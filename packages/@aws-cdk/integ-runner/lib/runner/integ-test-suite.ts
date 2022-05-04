import * as osPath from 'path';
import { TestCase, TestOptions, Manifest, IntegManifest } from '@aws-cdk/cloud-assembly-schema';
import { ICdk, ListOptions } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegManifestReader } from './private/integ-manifest';

const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';
const SET_CONTEXT_PRAGMA_PREFIX = 'pragma:set-context:';
const VERIFY_ASSET_HASHES = 'pragma:include-assets-hashes';
const DISABLE_UPDATE_WORKFLOW = 'pragma:disable-update-workflow';
const ENABLE_LOOKUPS_PRAGMA = 'pragma:enable-lookups';

/**
 * Represents an integration test
 */
export type TestSuite = { [testName: string]: TestCase };

export type TestSuiteType = 'test-suite' | 'legacy-test-suite';

/**
 * Helper class for working with Integration tests
 * This requires an `integ.json` file in the snapshot
 * directory. For legacy test cases use LegacyIntegTestCases
 */
export class IntegTestSuite {

  /**
   * Loads integ tests from a snapshot directory
   */
  public static fromPath(path: string): IntegTestSuite {
    const reader = IntegManifestReader.fromPath(path);
    return new IntegTestSuite(
      reader.tests.enableLookups,
      reader.tests.testCases,
      reader.tests.synthContext,
    );
  }

  public readonly type: TestSuiteType = 'test-suite';

  constructor(
    public readonly enableLookups: boolean,
    public readonly testSuite: TestSuite,
    public readonly synthContext?: { [name: string]: string },
  ) {}


  /**
   * Returns a list of stacks that have stackUpdateWorkflow disabled
   */
  public getStacksWithoutUpdateWorkflow(): string[] {
    return Object.values(this.testSuite)
      .filter(testCase => !(testCase.stackUpdateWorkflow ?? true))
      .flatMap((testCase: TestCase) => testCase.stacks);
  }

  /**
   * Returns test case options for a given stack
   */
  public getOptionsForStack(stackId: string): TestOptions | undefined {
    for (const testCase of Object.values(this.testSuite ?? {})) {
      if (testCase.stacks.includes(stackId)) {
        return {
          hooks: testCase.hooks,
          regions: testCase.regions,
          diffAssets: testCase.diffAssets ?? false,
          allowDestroy: testCase.allowDestroy,
          cdkCommandOptions: testCase.cdkCommandOptions,
          stackUpdateWorkflow: testCase.stackUpdateWorkflow ?? true,
        };
      }
    }
    return undefined;
  }

  /**
   * Get a list of stacks in the test suite
   */
  public get stacks(): string[] {
    return Object.values(this.testSuite).flatMap(testCase => testCase.stacks);
  }
}

/**
 * Options for a reading a legacy test case manifest
 */
export interface LegacyTestCaseConfig {
  /**
   * The name of the test case
   */
  readonly testName: string;

  /**
   * Options to use when performing `cdk list`
   * This is used to determine the name of the stacks
   * in the test case
   */
  readonly listOptions: ListOptions;

  /**
   * An instance of the CDK CLI (e.g. CdkCliWrapper)
   */
  readonly cdk: ICdk;

  /**
   * The path to the integration test file
   * i.e. integ.test.js
   */
  readonly integSourceFilePath: string;
}

/**
 * Helper class for creating an integ manifest for legacy
 * test cases, i.e. tests without a `integ.json`.
 */
export class LegacyIntegTestSuite extends IntegTestSuite {

  /**
   * Returns the single test stack to use.
   *
   * If the test has a single stack, it will be chosen. Otherwise a pragma is expected within the
   * test file the name of the stack:
   *
   * @example
   *
   *    /// !cdk-integ <stack-name>
   *
   */
  public static fromLegacy(config: LegacyTestCaseConfig): LegacyIntegTestSuite {
    const pragmas = this.pragmas(config.integSourceFilePath);
    const tests: TestCase = {
      stacks: [],
      diffAssets: pragmas.includes(VERIFY_ASSET_HASHES),
      stackUpdateWorkflow: !pragmas.includes(DISABLE_UPDATE_WORKFLOW),
    };
    const pragma = this.readStackPragma(config.integSourceFilePath);
    if (pragma.length > 0) {
      tests.stacks.push(...pragma);
    } else {
      const stacks = (config.cdk.list({
        ...config.listOptions,
      })).split('\n');
      if (stacks.length !== 1) {
        throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
          '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
          `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
          `  Available stacks: ${stacks.join(' ')} (wildcards are also supported)\n`);
      }
      if (stacks.length === 1 && stacks[0] === '') {
        throw new Error(`No stack found for test ${config.testName}`);
      }
      tests.stacks.push(...stacks);
    }

    return new LegacyIntegTestSuite(
      pragmas.includes(ENABLE_LOOKUPS_PRAGMA),
      {
        [config.testName]: tests,
      },
      LegacyIntegTestSuite.getPragmaContext(config.integSourceFilePath),
    );
  }

  public static getPragmaContext(integSourceFilePath: string): Record<string, any> {
    const ctxPragmaContext: Record<string, any> = {};

    // apply context from set-context pragma
    // usage: pragma:set-context:key=value
    const ctxPragmas = (this.pragmas(integSourceFilePath)).filter(p => p.startsWith(SET_CONTEXT_PRAGMA_PREFIX));
    for (const p of ctxPragmas) {
      const instruction = p.substring(SET_CONTEXT_PRAGMA_PREFIX.length);
      const [key, value] = instruction.split('=');
      if (key == null || value == null) {
        throw new Error(`invalid "set-context" pragma syntax. example: "pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true" got: ${p}`);
      }

      ctxPragmaContext[key] = value;
    }
    return {
      ...ctxPragmaContext,
    };
  }


  /**
   * Reads stack names from the "!cdk-integ" pragma.
   *
   * Every word that's NOT prefixed by "pragma:" is considered a stack name.
   *
   * @example
   *
   *    /// !cdk-integ <stack-name>
   */
  private static readStackPragma(integSourceFilePath: string): string[] {
    return (this.readIntegPragma(integSourceFilePath)).filter(p => !p.startsWith(PRAGMA_PREFIX));
  }

  /**
   * Read arbitrary cdk-integ pragma directives
   *
   * Reads the test source file and looks for the "!cdk-integ" pragma. If it exists, returns it's
   * contents. This allows integ tests to supply custom command line arguments to "cdk deploy" and "cdk synth".
   *
   * @example
   *
   *    /// !cdk-integ [...]
   */
  private static readIntegPragma(integSourceFilePath: string): string[] {
    const source = fs.readFileSync(integSourceFilePath, { encoding: 'utf-8' });
    const pragmaLine = source.split('\n').find(x => x.startsWith(CDK_INTEG_STACK_PRAGMA + ' '));
    if (!pragmaLine) {
      return [];
    }

    const args = pragmaLine.substring(CDK_INTEG_STACK_PRAGMA.length).trim().split(' ');
    if (args.length === 0) {
      throw new Error(`Invalid syntax for cdk-integ pragma. Usage: "${CDK_INTEG_STACK_PRAGMA} [STACK] [pragma:PRAGMA] [...]"`);
    }
    return args;
  }

  /**
   * Return the non-stack pragmas
   *
   * These are all pragmas that start with "pragma:".
   *
   * For backwards compatibility reasons, all pragmas that DON'T start with this
   * string are considered to be stack names.
   */
  private static pragmas(integSourceFilePath: string): string[] {
    return (this.readIntegPragma(integSourceFilePath)).filter(p => p.startsWith(PRAGMA_PREFIX));
  }

  public readonly type: TestSuiteType = 'legacy-test-suite';

  constructor(
    public readonly enableLookups: boolean,
    public readonly testSuite: TestSuite,
    public readonly synthContext?: { [name: string]: string },
  ) {
    super(enableLookups, testSuite);
  }

  /**
   * Save the integ manifest to a directory
   */
  public saveManifest(directory: string, context?: Record<string, any>): void {
    const manifest: IntegManifest = {
      version: Manifest.version(),
      testCases: this.testSuite,
      synthContext: context,
      enableLookups: this.enableLookups,
    };
    Manifest.saveIntegManifest(manifest, osPath.join(directory, IntegManifestReader.DEFAULT_FILENAME));
  }
}
