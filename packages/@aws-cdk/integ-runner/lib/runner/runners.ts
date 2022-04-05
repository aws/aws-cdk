import * as path from 'path';
import { Writable, WritableOptions } from 'stream';
import { StringDecoder, NodeStringDecoder } from 'string_decoder';
import { TestCase, RequireApproval, DefaultCdkOptions } from '@aws-cdk/cloud-assembly-schema';
import { diffTemplate, formatDifferences } from '@aws-cdk/cloudformation-diff';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY, FUTURE_FLAGS, TARGET_PARTITIONS } from '@aws-cdk/cx-api';
import { CdkCliWrapper, ICdk } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { Diagnostic, DiagnosticReason } from '../workers/common';
import { canonicalizeTemplate } from './private/canonicalize-assets';
import { AssemblyManifestReader } from './private/cloud-assembly';
import { IntegManifestReader } from './private/integ-manifest';

const CDK_OUTDIR_PREFIX = 'cdk-integ.out';
const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';
const SET_CONTEXT_PRAGMA_PREFIX = 'pragma:set-context:';
const VERIFY_ASSET_HASHES = 'pragma:include-assets-hashes';
const ENABLE_LOOKUPS_PRAGMA = 'pragma:enable-lookups';
const DISABLE_UPDATE_WORKFLOW = 'pragma:disable-update-workflow';

/**
 * Options for creating an integration test runner
 */
export interface IntegRunnerOptions {
  /**
   * The name of the file that contains the integration test
   * This should be a JavaScript file
   */
  readonly fileName: string,

  /**
   * Additional environment variables that will be available
   * to the CDK CLI
   *
   * @default - no additional environment variables
   */
  readonly env?: { [name: string]: string },

  /**
   * tmp cdk.out directory
   *
   * @default - directory will be `cdk-integ.out.${testName}`
   */
  readonly integOutDir?: string,

  /**
   * Instance of the CDK CLI to use
   *
   * @default - CdkCliWrapper
   */
  readonly cdk?: ICdk;
}

/**
 * Represents an Integration test runner
 */
export abstract class IntegRunner {
  /**
   * The directory where the snapshot will be stored
   */
  public readonly snapshotDir: string;

  /**
   * An instance of the CDK  CLI
   */
  public readonly cdk: ICdk;

  /**
   * Pretty name of the test
   */
  public readonly testName: string;

  /**
   * The path to the integration test file
   */
  protected readonly sourceFilePath: string;

  /**
   * The value used in the '--app' CLI parameter
   */
  protected readonly cdkApp: string;

  /**
   * The path where the `cdk.context.json` file
   * will be created
   */
  protected readonly cdkContextPath: string;

  /**
   * The relative path from the cwd to the snapshot directory
   */
  protected readonly relativeSnapshotDir: string;

  /**
   * The integration tests that this runner will execute
   */
  protected _tests?: { [testName: string]: TestCase };

  /**
   * The working directory that the integration tests will be
   * executed from
   */
  protected readonly directory: string;

  /**
   * Default options to pass to the CDK CLI
   */
  protected readonly defaultArgs: DefaultCdkOptions = {
    pathMetadata: false,
    assetMetadata: false,
    versionReporting: false,
  }

  private _enableLookups?: boolean;
  private _disableUpdateWorkflow?: boolean;

  /**
   * The directory where the CDK will be synthed to
   */
  protected readonly cdkOutDir: string;

  constructor(options: IntegRunnerOptions) {
    const parsed = path.parse(options.fileName);
    this.directory = parsed.dir;
    const testName = parsed.name.slice(6);

    // if we are running in a package directory then juse use the fileName
    // as the testname, but if we are running in a parent directory with
    // multiple packages then use the directory/filename as the testname
    if (parsed.dir === 'test') {
      this.testName = testName;
    } else {
      this.testName = `${parsed.dir}/${parsed.name}`;
    }
    this.snapshotDir = path.join(this.directory, `${testName}.integ.snapshot`);
    this.relativeSnapshotDir = `${testName}.integ.snapshot`;
    this.sourceFilePath = path.join(this.directory, parsed.base);
    this.cdkContextPath = path.join(this.directory, 'cdk.context.json');
    this.cdk = options.cdk ?? new CdkCliWrapper({
      cdkExecutable: require.resolve('aws-cdk/bin/cdk'),
      directory: this.directory,
      env: {
        ...options.env,
      },
    });
    this.cdkOutDir = options.integOutDir ?? `${CDK_OUTDIR_PREFIX}.${testName}`;
    this.cdkApp = `node ${parsed.base}`;
    if (this.hasSnapshot()) {
      this.loadManifest();
    }
  }

  /**
   * Whether or not lookups are enabled for a given test case
   */
  protected get enableLookups(): boolean {
    return this._enableLookups ?? false;
  }

  /**
   * Whether or not to run the update workflow when
   * updating the snapshot
   */
  protected get disableUpdateWorkflow(): boolean {
    return this._disableUpdateWorkflow ?? false;
  }

  /**
   * Return this list of test cases for this integration test
   */
  public get tests(): { [testName: string]: TestCase } | undefined {
    return this._tests;
  }

  /**
   * Returns true if a snapshot already exists for this test
   */
  public hasSnapshot(): boolean {
    if (fs.existsSync(this.snapshotDir)) {
      return true;
    } else {
      return false;
    }
  }

  protected loadManifest(dir?: string): void {
    try {
      const reader = IntegManifestReader.fromPath(dir ?? this.snapshotDir);
      this._tests = reader.tests.testCases;
      this._enableLookups = reader.tests.enableLookups;
    } catch (e) {
      this._tests = this.renderTestCasesForLegacyTests();
      this._enableLookups = this.pragmas().includes(ENABLE_LOOKUPS_PRAGMA);
      this._disableUpdateWorkflow = this.pragmas().includes(DISABLE_UPDATE_WORKFLOW);
    }
  }

  protected cleanup(): void {
    const cdkOutPath = path.join(this.directory, this.cdkOutDir);
    if (fs.existsSync(cdkOutPath)) {
      fs.removeSync(cdkOutPath);
    }
  }

  /**
   * In cases where we do not want to retain the assets,
   * for example, if the assets are very large
   */
  protected removeAssetsFromSnapshot(): void {
    const files = fs.readdirSync(this.snapshotDir);
    files.forEach(file => {
      const fileName = path.join(this.snapshotDir, file);
      if (file.startsWith('asset.')) {
        if (fs.lstatSync(fileName).isDirectory()) {
          fs.emptyDirSync(fileName);
          fs.rmdirSync(fileName);
        } else {
          fs.unlinkSync(fileName);
        }
      }
    });
  }

  protected createSnapshot(): void {
    if (fs.existsSync(this.snapshotDir)) {
      fs.removeSync(this.snapshotDir);
    }

    // if lookups are enabled then we need to synth again
    // using dummy context and save that as the snapshot
    if (this.enableLookups) {
      this.cdk.synthFast({
        execCmd: this.cdkApp.split(' '),
        env: {
          ...DEFAULT_SYNTH_OPTIONS.env,
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext()),
        },
        output: this.relativeSnapshotDir,
      });
    } else {
      fs.moveSync(path.join(this.directory, this.cdkOutDir), this.snapshotDir, { overwrite: true });
    }
    if (this.disableUpdateWorkflow) {
      this.removeAssetsFromSnapshot();
    }
  }

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
  private renderTestCasesForLegacyTests(): { [testName: string]: TestCase } {
    const tests: TestCase = {
      stacks: [],
    };
    const pragma = this.readStackPragma();
    if (pragma.length > 0) {
      tests.stacks.push(...pragma);
    } else {
      const stacks = (this.cdk.list({
        ...this.defaultArgs,
        all: true,
        app: this.cdkApp,
        output: this.cdkOutDir,
      })).split('\n');
      if (stacks.length !== 1) {
        throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
          '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
          `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
          `  Available stacks: ${stacks.join(' ')} (wildcards are also supported)\n`);
      }
      tests.stacks.push(...stacks);
    }

    return {
      [this.testName]: tests,
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
  private readStackPragma(): string[] {
    return (this.readIntegPragma()).filter(p => !p.startsWith(PRAGMA_PREFIX));
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
  private readIntegPragma(): string[] {
    const source = fs.readFileSync(this.sourceFilePath, { encoding: 'utf-8' });
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
  protected pragmas(): string[] {
    return (this.readIntegPragma()).filter(p => p.startsWith(PRAGMA_PREFIX));
  }

  protected getContext(additionalContext?: Record<string, any>): Record<string, any> {
    const ctxPragmaContext: Record<string, any> = {};

    // apply context from set-context pragma
    // usage: pragma:set-context:key=value
    const ctxPragmas = (this.pragmas()).filter(p => p.startsWith(SET_CONTEXT_PRAGMA_PREFIX));
    for (const p of ctxPragmas) {
      const instruction = p.substring(SET_CONTEXT_PRAGMA_PREFIX.length);
      const [key, value] = instruction.split('=');
      if (key == null || value == null) {
        throw new Error(`invalid "set-context" pragma syntax. example: "pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true" got: ${p}`);
      }

      ctxPragmaContext[key] = value;
    }
    return {
      ...DEFAULT_SYNTH_OPTIONS.context,
      ...ctxPragmaContext,
      ...additionalContext,
    };
  }
}

/**
 * Options for the integration test runner
 */
export interface RunOptions {
  /**
   * The test case to execute
   */
  readonly testCase: TestCase;

  /**
   * Whether or not to run `cdk destroy` and cleanup the
   * integration test stacks.
   *
   * Set this to false if you need to perform any validation
   * or troubleshooting after deployment.
   *
   * @default true
   */
  readonly clean?: boolean;

  /**
   * If set to true, the integration test will not deploy
   * anything and will simply update the snapshot.
   *
   * You should NOT use this method since you are essentially
   * bypassing the integration test.
   *
   * @default false
   */
  readonly dryRun?: boolean;
}

/**
 * An integration test runner that orchestrates executing
 * integration tests
 */
export class IntegTestRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions) {
    super(options);
  }

  /**
   * Orchestrates running integration tests. Currently this includes
   *
   * 1. Deploying the integration test stacks
   * 2. Saving the snapshot
   * 3. Destroying the integration test stacks
   */
  public runIntegTestCase(options: RunOptions): void {
    const clean = options.clean ?? true;
    try {
      if (!options.dryRun) {
        this.cdk.deploy({
          ...this.defaultArgs,
          stacks: options.testCase.stacks,
          requireApproval: RequireApproval.NEVER,
          output: this.cdkOutDir,
          app: this.cdkApp,
          lookups: this.enableLookups,
        });
      } else {
        const env: Record<string, any> = {
          ...DEFAULT_SYNTH_OPTIONS.env,
        };
        if (this.enableLookups) {
          env.CDK_CONTEXT_JSON = JSON.stringify(this.getContext());
        }
        this.cdk.synthFast({
          execCmd: this.cdkApp.split(' '),
          env,
          output: this.cdkOutDir,
        });
      }
      this.createSnapshot();
    } catch (e) {
      throw e;
    } finally {
      if (!options.dryRun) {
        if (clean) {
          this.cdk.destroy({
            ...this.defaultArgs,
            stacks: options.testCase.stacks,
            force: true,
            app: this.cdkApp,
            output: this.cdkOutDir,
          });
        }
      }
      this.cleanup();
    }
  }

  /**
   * Generate a snapshot if one does not exist
   * This will synth and then load the integration test manifest
   */
  public generateSnapshot(): void {
    if (this.hasSnapshot()) {
      throw new Error(`${this.testName} already has a snapshot: ${this.snapshotDir}`);
    }

    this.cdk.synthFast({
      execCmd: this.cdkApp.split(' '),
      env: {
        ...DEFAULT_SYNTH_OPTIONS.env,
        CDK_CONTEXT_JSON: JSON.stringify(this.getContext()),
      },
      output: this.cdkOutDir,
    });
    this.loadManifest(this.cdkOutDir);
  }
}

/**
 * Runner for snapshot tests. This handles orchestrating
 * the validation of the integration test snapshots
 */
export class IntegSnapshotRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions) {
    super(options);
  }

  /**
   * Synth the integration tests and compare the templates
   * to the existing snapshot.
   */
  public testSnapshot(): Diagnostic[] {
    try {
      // read the existing snapshot
      const expectedStacks = this.readAssembly(this.snapshotDir);

      const env: Record<string, any> = {
        ...DEFAULT_SYNTH_OPTIONS.env,
      };
      // if lookups are enabled then write the dummy context file
      if (this.enableLookups) {
        env.CDK_CONTEXT_JSON = JSON.stringify(this.getContext());
      }
      // synth the integration test
      this.cdk.synthFast({
        execCmd: this.cdkApp.split(' '),
        env,
        output: this.cdkOutDir,
      });
      const actualStacks = this.readAssembly(path.join(this.directory, this.cdkOutDir));

      // diff the existing snapshot (expected) with the integration test (actual)
      const diagnostics = this.diffAssembly(expectedStacks, actualStacks);
      return diagnostics;
    } catch (e) {
      throw e;
    } finally {
      this.cleanup();
    }
  }

  private diffAssembly(existing: Record<string, any>, actual: Record<string, any>): Diagnostic[] {
    const verifyHashes = this.pragmas().includes(VERIFY_ASSET_HASHES);
    const failures: Diagnostic[] = [];
    for (const templateId of Object.keys(existing)) {
      if (!actual.hasOwnProperty(templateId)) {
        failures.push({
          testName: this.testName,
          reason: DiagnosticReason.SNAPSHOT_FAILED,
          message: `${templateId} exists in snapshot, but not in actual`,
        });
      }
    }

    for (const templateId of Object.keys(actual)) {
      if (!existing.hasOwnProperty(templateId)) {
        failures.push({
          testName: this.testName,
          reason: DiagnosticReason.SNAPSHOT_FAILED,
          message: `${templateId} does not exist in snapshot, but does in actual`,
        });
      } else {
        let actualTemplate = actual[templateId];
        let expectedTemplate = existing[templateId];

        if (!verifyHashes) {
          actualTemplate = canonicalizeTemplate(actualTemplate);
          expectedTemplate = canonicalizeTemplate(expectedTemplate);
        }
        const diff = diffTemplate(expectedTemplate, actualTemplate);
        if (!diff.isEmpty) {
          const writable = new StringWritable({});
          formatDifferences(writable, diff);
          failures.push({
            reason: DiagnosticReason.SNAPSHOT_FAILED,
            message: writable.data,
            testName: this.testName,
          });
        }
      }
    }

    return failures;
  }

  private readAssembly(dir: string): Record<string, any> {
    const assembly = AssemblyManifestReader.fromPath(dir);
    const stacks = assembly.stacks;

    return stacks;
  }
}

class StringWritable extends Writable {
  public data: string;
  private _decoder: NodeStringDecoder;
  constructor(options: WritableOptions) {
    super(options);
    this._decoder = new StringDecoder();
    this.data = '';
  }

  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }

    this.data += chunk;
    callback();
  }

  _final(callback: (error?: Error | null) => void): void {
    this.data += this._decoder.end();
    callback();
  }
}

// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
const DEFAULT_SYNTH_OPTIONS = {
  context: {
    [AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY]: ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'availability-zones:account=12345678:region=test-region': ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region': '{"image_id": "ami-1234"}',
    // eslint-disable-next-line max-len
    'ami:account=12345678:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=test-region': 'ami-1234',
    'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': {
      vpcId: 'vpc-60900905',
      subnetGroups: [
        {
          type: 'Public',
          name: 'Public',
          subnets: [
            {
              subnetId: 'subnet-e19455ca',
              availabilityZone: 'us-east-1a',
              routeTableId: 'rtb-e19455ca',
            },
            {
              subnetId: 'subnet-e0c24797',
              availabilityZone: 'us-east-1b',
              routeTableId: 'rtb-e0c24797',
            },
            {
              subnetId: 'subnet-ccd77395',
              availabilityZone: 'us-east-1c',
              routeTableId: 'rtb-ccd77395',
            },
          ],
        },
      ],
    },
    // Enable feature flags for all integ tests
    ...FUTURE_FLAGS,

    // Restricting to these target partitions makes most service principals synthesize to
    // `service.${URL_SUFFIX}`, which is technically *incorrect* (it's only `amazonaws.com`
    // or `amazonaws.com.cn`, never UrlSuffix for any of the restricted regions) but it's what
    // most existing integ tests contain, and we want to disturb as few as possible.
    [TARGET_PARTITIONS]: ['aws', 'aws-cn'],
  },
  env: {
    CDK_INTEG_ACCOUNT: '12345678',
    CDK_INTEG_REGION: 'test-region',
  },
};
