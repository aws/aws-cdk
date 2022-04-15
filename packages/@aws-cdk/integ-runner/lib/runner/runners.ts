import * as path from 'path';
import { Writable, WritableOptions } from 'stream';
import { StringDecoder, NodeStringDecoder } from 'string_decoder';
import { TestCase, RequireApproval, DefaultCdkOptions } from '@aws-cdk/cloud-assembly-schema';
import { diffTemplate, formatDifferences, ResourceDifference, ResourceImpact } from '@aws-cdk/cloudformation-diff';
import * as cxapi from '@aws-cdk/cx-api';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY, FUTURE_FLAGS, TARGET_PARTITIONS } from '@aws-cdk/cx-api';
import { CdkCliWrapper, ICdk } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import * as logger from '../logger';
import { Diagnostic, DiagnosticReason, DestructiveChange } from '../workers/common';
import { canonicalizeTemplate } from './private/canonicalize-assets';
import { AssemblyManifestReader, ManifestTrace } from './private/cloud-assembly';
import { IntegManifestReader } from './private/integ-manifest';
import { exec } from './private/utils';

const CDK_OUTDIR_PREFIX = 'cdk-integ.out';
const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';
const SET_CONTEXT_PRAGMA_PREFIX = 'pragma:set-context:';
const VERIFY_ASSET_HASHES = 'pragma:include-assets-hashes';
const ENABLE_LOOKUPS_PRAGMA = 'pragma:enable-lookups';
const DISABLE_UPDATE_WORKFLOW = 'pragma:disable-update-workflow';
const DESTRUCTIVE_CHANGES = '!!DESTRUCTIVE_CHANGES:';

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
   * The AWS profile to use when invoking the CDK CLI
   *
   * @default - no profile is passed, the default profile is used
   */
  readonly profile?: string;

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

  protected readonly profile?: string;

  protected _destructiveChanges?: DestructiveChange[];

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
    this.profile = options.profile;
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
   * If there are any destructive changes to a stack then this will record
   * those in the manifest.json file
   */
  private renderTraceData(): ManifestTrace {
    const traceData: ManifestTrace = new Map();
    const destructiveChanges = this._destructiveChanges ?? [];
    destructiveChanges.forEach(change => {
      const trace = traceData.get(change.stackName);
      if (trace) {
        trace.set(change.logicalId, `${DESTRUCTIVE_CHANGES} ${change.impact}`);
      } else {
        traceData.set(change.stackName, new Map([
          [change.logicalId, `${DESTRUCTIVE_CHANGES} ${change.impact}`],
        ]));
      }
    });
    return traceData;
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

  /**
   * Remove the asset cache (.cache/) files from the snapshot.
   * These are a cache of the asset zips, but we are fine with
   * re-zipping on deploy
   */
  protected removeAssetsCacheFromSnapshot(): void {
    const files = fs.readdirSync(this.snapshotDir);
    files.forEach(file => {
      const fileName = path.join(this.snapshotDir, file);
      if (fs.lstatSync(fileName).isDirectory() && file === '.cache') {
        fs.emptyDirSync(fileName);
        fs.rmdirSync(fileName);
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
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext(true)),
        },
        output: this.relativeSnapshotDir,
      });
    } else {
      fs.moveSync(path.join(this.directory, this.cdkOutDir), this.snapshotDir, { overwrite: true });
    }
    if (fs.existsSync(this.snapshotDir)) {
      if (this.disableUpdateWorkflow) {
        this.removeAssetsFromSnapshot();
      }
      const assembly = AssemblyManifestReader.fromPath(this.snapshotDir);
      assembly.cleanManifest();
      assembly.recordTrace(this.renderTraceData());
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
        profile: this.profile,
        output: this.cdkOutDir,
      })).split('\n');
      if (stacks.length !== 1) {
        throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
          '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
          `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
          `  Available stacks: ${stacks.join(' ')} (wildcards are also supported)\n`);
      }
      if (stacks.length === 1 && stacks[0] === '') {
        throw new Error(`No stack found for test ${this.testName}`);
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

  protected getContext(enableLookups?: boolean, additionalContext?: Record<string, any>): Record<string, any> {
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
      ...enableLookups ? [DEFAULT_SYNTH_OPTIONS.context] : [],
      [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
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

  /**
   * If this is set to false then the stack update workflow will
   * not be run
   *
   * The update workflow exists to check for cases where a change would cause
   * a failure to an existing stack, but not for a newly created stack.
   *
   * @default true
   */
  readonly updateWorkflow?: boolean;
}

/**
 * An integration test runner that orchestrates executing
 * integration tests
 */
export class IntegTestRunner extends IntegRunner {
  constructor(options: IntegRunnerOptions, destructiveChanges?: DestructiveChange[]) {
    super(options);
    this._destructiveChanges = destructiveChanges;
  }

  /**
   * When running integration tests with the update path workflow
   * it is important that the snapshot that is deployed is the current snapshot
   * from the upstream branch. In order to guarantee that, first checkout the latest
   * (to the user) snapshot from upstream
   *
   * It is not straightforward to figure out what branch the current
   * working branch was created from. This is a best effort attempt to do so.
   * This assumes that there is an 'origin'. `git remote show origin` returns a list of
   * all branches and we then search for one that starts with `HEAD branch: `
   */
  private checkoutSnapshot(): void {
    const cwd = path.dirname(this.snapshotDir);
    // https://git-scm.com/docs/git-merge-base
    let baseBranch: string | undefined = undefined;
    // try to find the base branch that the working branch was created from
    try {
      const origin: string = exec(['git', 'remote', 'show', 'origin'], {
        cwd,
      });
      const originLines = origin.split('\n');
      for (const line of originLines) {
        if (line.trim().startsWith('HEAD branch: ')) {
          baseBranch = line.trim().split('HEAD branch: ')[1];
        }
      }
    } catch (e) {
      logger.warning('%s\n%s',
        'Could not determine git origin branch.',
        `You need to manually checkout the snapshot directory ${this.snapshotDir}` +
        'from the merge-base (https://git-scm.com/docs/git-merge-base)',
      );
      logger.warning('error: %s', e);
    }

    // if we found the base branch then get the merge-base (most recent common commit)
    // and checkout the snapshot using that commit
    if (baseBranch) {
      try {
        const base = exec(['git', 'merge-base', 'HEAD', baseBranch], {
          cwd,
        });
        exec(['git', 'checkout', base, '--', this.relativeSnapshotDir], {
          cwd,
        });
      } catch (e) {
        logger.warning('%s\n%s',
          `Could not checkout snapshot directory ${this.snapshotDir} using these commands: `,
          `git merge-base HEAD ${baseBranch} && git checkout {merge-base} -- ${this.relativeSnapshotDir}`,
        );
        logger.warning('error: %s', e);
      }
    }
  }

  /**
   * Orchestrates running integration tests. Currently this includes
   *
   * 1. (if update workflow is enabled) Deploying the snapshot test stacks
   * 2. Deploying the integration test stacks
   * 2. Saving the snapshot (if successful)
   * 3. Destroying the integration test stacks (if clean=false)
   *
   * The update workflow exists to check for cases where a change would cause
   * a failure to an existing stack, but not for a newly created stack.
   */
  public runIntegTestCase(options: RunOptions): void {
    const clean = options.clean ?? true;
    const updateWorkflowEnabled = (options.updateWorkflow ?? true) && (options.testCase.stackUpdateWorkflow ?? true);
    try {
      if (!options.dryRun) {
        // if the update workflow is not disabled, first
        // perform a deployment with the exising snapshot
        // then perform a deployment (which will be a stack update)
        // with the current integration test
        // We also only want to run the update workflow if there is an existing
        // snapshot (otherwise there is nothing to update)
        if (!this.disableUpdateWorkflow && updateWorkflowEnabled && this.hasSnapshot()) {
          // make sure the snapshot is the latest from 'origin'
          this.checkoutSnapshot();
          this.cdk.deploy({
            ...this.defaultArgs,
            stacks: options.testCase.stacks,
            requireApproval: RequireApproval.NEVER,
            output: this.cdkOutDir,
            app: this.relativeSnapshotDir,
            lookups: this.enableLookups,
            ...options.testCase.cdkCommandOptions?.deploy,
          });
        }
        this.cdk.deploy({
          ...this.defaultArgs,
          profile: this.profile,
          stacks: options.testCase.stacks,
          requireApproval: RequireApproval.NEVER,
          output: this.cdkOutDir,
          app: this.cdkApp,
          lookups: this.enableLookups,
          ...options.testCase.cdkCommandOptions?.deploy,
        });
      } else {
        const env: Record<string, any> = {
          ...DEFAULT_SYNTH_OPTIONS.env,
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext(this.enableLookups)),
        };
        // if lookups are enabled then we need to synth
        // with the "dummy" context
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
            profile: this.profile,
            stacks: options.testCase.stacks,
            force: true,
            app: this.cdkApp,
            output: this.cdkOutDir,
            ...options.testCase.cdkCommandOptions?.destroy,
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
   *
   * @returns any diagnostics and any destructive changes
   */
  public testSnapshot(): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    try {
      // read the existing snapshot
      const expectedStacks = this.readAssembly(this.snapshotDir);

      // if lookups are enabled then use "dummy" context
      const env: Record<string, any> = {
        ...DEFAULT_SYNTH_OPTIONS.env,
        CDK_CONTEXT_JSON: JSON.stringify(this.getContext(this.enableLookups)),
      };
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

  /**
   * For a given stack return all resource types that are allowed to be destroyed
   * as part of a stack update
   *
   * @param stackId the stack id
   * @returns a list of resource types or undefined if none are found
   */
  private getAllowedDestroyTypesForStack(stackId: string): string[] | undefined {
    for (const testCase of Object.values(this.tests ?? {})) {
      if (testCase.stacks.includes(stackId)) {
        return testCase.allowDestroy;
      }
    }
    return undefined;
  }

  /**
   * Find any differences between the existing and expected snapshots
   *
   * @param existing - the existing (expected) snapshot
   * @param actual - the new (actual) snapshot
   * @returns any diagnostics and any destructive changes
   */
  private diffAssembly(
    existing: Record<string, any>,
    actual: Record<string, any>,
  ): { diagnostics: Diagnostic[], destructiveChanges: DestructiveChange[] } {
    const verifyHashes = this.pragmas().includes(VERIFY_ASSET_HASHES);
    const failures: Diagnostic[] = [];
    const destructiveChanges: DestructiveChange[] = [];

    // check if there is a CFN template in the current snapshot
    // that does not exist in the "actual" snapshot
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
      // check if there is a CFN template in the "actual" snapshot
      // that does not exist in the current snapshot
      if (!existing.hasOwnProperty(templateId)) {
        failures.push({
          testName: this.testName,
          reason: DiagnosticReason.SNAPSHOT_FAILED,
          message: `${templateId} does not exist in snapshot, but does in actual`,
        });
      } else {
        let actualTemplate = actual[templateId];
        let expectedTemplate = existing[templateId];
        const allowedDestroyTypes = this.getAllowedDestroyTypesForStack(templateId) ?? [];

        // if we are not verifying asset hashes then remove the specific
        // asset hashes from the templates so they are not part of the diff
        // comparison
        if (!verifyHashes) {
          actualTemplate = canonicalizeTemplate(actualTemplate);
          expectedTemplate = canonicalizeTemplate(expectedTemplate);
        }
        const templateDiff = diffTemplate(expectedTemplate, actualTemplate);
        if (!templateDiff.isEmpty) {
          // go through all the resource differences and check for any
          // "destructive" changes
          templateDiff.resources.forEachDifference((logicalId: string, change: ResourceDifference) => {
            // if the change is a removal it will not show up as a 'changeImpact'
            // so need to check for it separately, unless it is a resourceType that
            // has been "allowed" to be destroyed
            const resourceType = change.oldValue?.Type ?? change.newValue?.Type;
            if (resourceType && allowedDestroyTypes.includes(resourceType)) {
              return;
            }
            if (change.isRemoval) {
              destructiveChanges.push({
                impact: ResourceImpact.WILL_DESTROY,
                logicalId,
                stackName: templateId,
              });
            } else {
              switch (change.changeImpact) {
                case ResourceImpact.MAY_REPLACE:
                case ResourceImpact.WILL_ORPHAN:
                case ResourceImpact.WILL_DESTROY:
                case ResourceImpact.WILL_REPLACE:
                  destructiveChanges.push({
                    impact: change.changeImpact,
                    logicalId,
                    stackName: templateId,
                  });
                  break;
              }
            }
          });
          const writable = new StringWritable({});
          formatDifferences(writable, templateDiff);
          failures.push({
            reason: DiagnosticReason.SNAPSHOT_FAILED,
            message: writable.data,
            testName: this.testName,
          });
        }
      }
    }

    return {
      diagnostics: failures,
      destructiveChanges,
    };
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
