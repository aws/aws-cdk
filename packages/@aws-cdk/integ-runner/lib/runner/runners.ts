import * as path from 'path';
import { TestCase, RequireApproval, DefaultCdkOptions } from '@aws-cdk/cloud-assembly-schema';
import { diffTemplate, formatDifferences } from '@aws-cdk/cloudformation-diff';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY, FUTURE_FLAGS, TARGET_PARTITIONS } from '@aws-cdk/cx-api';
import { CdkCliWrapper, ICdk } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import * as workerpool from 'workerpool';
import { canonicalizeTemplate } from './private/canonicalize-assets';
import { AssemblyManifestReader } from './private/cloud-assembly';
import { IntegManifestReader } from './private/integ-manifest';
import * as logger from './private/logger';

const CDK_OUTDIR_PREFIX = 'cdk-integ.out';
const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';
const SET_CONTEXT_PRAGMA_PREFIX = 'pragma:set-context:';
const VERIFY_ASSET_HASHES = 'pragma:include-assets-hashes';

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

  /**
   * The directory where the CDK will be synthed to
   */
  protected readonly cdkOutDir: string;

  constructor(
    private readonly fileName: string,
    private readonly env?: { [name: string]: string },
    private readonly integOutDir?: string,
  ) {
    const parsed = path.parse(this.fileName);
    this.directory = parsed.dir;
    this.testName = parsed.name.slice(6);
    this.snapshotDir = path.join(this.directory, `${this.testName}.integ.snapshot`);
    this.relativeSnapshotDir = `${this.testName}.integ.snapshot`;
    this.sourceFilePath = path.join(this.directory, parsed.base);
    this.cdkContextPath = path.join(this.directory, 'cdk.context.json');
    this.cdk = new CdkCliWrapper({
      directory: this.directory,
      env: this.env,
    });
    this.cdkApp = `node ${parsed.base}`;
    if (this.hasSnapshot()) {
      this.loadManifest();
    }
    this.cdkOutDir = this.integOutDir ?? `${CDK_OUTDIR_PREFIX}.${this.testName}`;
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
      this._tests = reader.tests;
    } catch (e) {
      this._tests = this.renderTestCasesForLegacyTests();
    }
  }

  protected cleanup(): void {
    const cdkOutPath = path.join(this.directory, this.cdkOutDir);
    if (fs.existsSync(cdkOutPath)) {
      fs.removeSync(cdkOutPath);
    }
  }

  protected createSnapshot(): void {
    if (fs.existsSync(path.join(this.directory, this.cdkOutDir))) {
      workerpool.workerEmit({
        message: `creating snapshot at ${this.relativeSnapshotDir}`,
      });
      fs.moveSync(path.join(this.directory, this.cdkOutDir), this.snapshotDir, { overwrite: true });
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

  /**
   * There is not currently a way to pass structured context to the CLI
   * so to workaround this we write the context to a file
   */
  protected writeContext(additionalContext?: Record<string, any>): void {
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
    const context: Record<string, any> = {
      ...DEFAULT_SYNTH_OPTIONS.context,
      ...ctxPragmaContext,
      ...additionalContext,
    };
    fs.writeFileSync(this.cdkContextPath, JSON.stringify(context, undefined, 2), { encoding: 'utf-8' });
  }

  protected cleanupContextFile() {
    if (fs.existsSync(this.cdkContextPath)) {
      fs.unlinkSync(this.cdkContextPath);
    }
  }
}

/**
 * Options for the integration test runner
 */
export interface IntegTestRunOptions {
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
  constructor(fileName: string, env?: { [name: string]: string }) {
    super(fileName, env);
  }

  /**
   * Orchestrates running integration tests. Currently this includes
   *
   * 1. Deploying the integration test stacks
   * 2. Saving the snapshot
   * 3. Destroying the integration test stacks
   */
  public runIntegTestCase(options: IntegTestRunOptions): void {
    const clean = options.clean ?? true;
    try {
      if (!options.dryRun) {
        this.cdk.deploy({
          stacks: options.testCase.stacks,
          requireApproval: RequireApproval.NEVER,
          output: this.cdkOutDir,
          app: this.cdkApp,
          ...this.defaultArgs,
        });
        this.createSnapshot();
      }
    } finally {
      if (!options.dryRun) {
        if (clean) {
          this.cdk.destroy({
            stacks: options.testCase.stacks,
            force: true,
            app: this.cdkApp,
            output: this.cdkOutDir,
            ...this.defaultArgs,
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

    this.writeContext();
    this.cdk.synth({
      all: true,
      app: this.cdkApp,
      ...this.defaultArgs,
      // TODO: figure out if we need this...
      // env: {
      //   ...DEFAULT_SYNTH_OPTIONS.env,
      // },
      output: this.cdkOutDir,
    });
    this.loadManifest(this.cdkOutDir);
    this.cleanupContextFile();
  }
}

/**
 * Runner for snapshot tests. This handles orchestrating
 * the validation of the integration test snapshots
 */
export class IntegSnapshotRunner extends IntegRunner {
  constructor(fileName: string, integOutDir?: string) {
    super(fileName, {}, integOutDir);
  }

  /**
   * Synth the integration tests and compare the templates
   * to the existing snapshot.
   */
  public testSnapshot(): void {
    try {
      // read the existing snapshot
      const expectedStacks = this.readAssembly(this.snapshotDir);

      // synth the integration test
      this.writeContext();
      this.cdk.synth({
        all: true,
        app: this.cdkApp,
        output: this.cdkOutDir,
        ...this.defaultArgs,
      });
      const actualStacks = this.readAssembly(path.join(this.directory, this.cdkOutDir));

      // diff the existing snapshot (expected) with the integration test (actual)
      const success = this.diffAssembly(expectedStacks, actualStacks);

      if (!success) {
        // eslint-disable-next-line max-len
        throw new Error("Some stacks have changed. To verify that they still deploy successfully, run: 'yarn integ --update'");
      }
    } finally {
      this.cleanupContextFile();
      this.cleanup();
    }
  }

  private diffAssembly(existing: Record<string, any>, actual: Record<string, any>): boolean {
    const verifyHashes = this.pragmas().includes(VERIFY_ASSET_HASHES);
    const failures: string[] = [];
    for (const templateId of Object.keys(existing)) {
      if (!actual.hasOwnProperty(templateId)) {
        failures.push(templateId);
        logger.print('%s exists in snapshot, but not in actual', templateId);
      }
    }

    for (const templateId of Object.keys(actual)) {
      if (!existing.hasOwnProperty(templateId)) {
        failures.push(templateId);
        logger.print('%s does not exist in snapshot, but does in actual', templateId);
      } else {
        let actualTemplate = actual[templateId];
        let expectedTemplate = existing[templateId];

        if (!verifyHashes) {
          actualTemplate = canonicalizeTemplate(actualTemplate);
          expectedTemplate = canonicalizeTemplate(expectedTemplate);
        }
        const diff = diffTemplate(expectedTemplate, actualTemplate);
        if (!diff.isEmpty) {
          failures.push(templateId);
          formatDifferences(process.stdout, diff);
        }
      }
    }

    if (failures.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  private readAssembly(dir: string): Record<string, any> {
    const assembly = AssemblyManifestReader.fromPath(dir);
    const stacks = assembly.stacks;

    return stacks;
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
