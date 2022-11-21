import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { outputFromStack, AwsClients } from './aws';
import { memoize0 } from './memoize';
import { ResourcePool } from './resource-pool';
import { TestContext } from './test-helpers';

const REGIONS = process.env.AWS_REGIONS
  ? process.env.AWS_REGIONS.split(',')
  : [process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1'];

export const FRAMEWORK_VERSION = process.env.FRAMEWORK_VERSION ?? '*';

export let MAJOR_VERSION = FRAMEWORK_VERSION.split('.')[0];
if (MAJOR_VERSION === '*') {
  if (process.env.REPO_ROOT) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const releaseJson = require(path.resolve(process.env.REPO_ROOT, 'release.json'));
    MAJOR_VERSION = `${releaseJson.majorVersion}`;
  } else {
    // eslint-disable-next-line no-console
    console.error('[WARNING] Have to guess at major version. Guessing version 1 to not break anything, but this should not happen');
    MAJOR_VERSION = '1';
  }
}

process.stdout.write(`Using regions: ${REGIONS}\n`);
process.stdout.write(`Using framework version: ${FRAMEWORK_VERSION} (major version ${MAJOR_VERSION})\n`);

const REGION_POOL = new ResourcePool(REGIONS);


/**
 * Cache monorepo discovery results, we only want to do this once per run
 */
const YARN_MONOREPO_CACHE: Record<string, any> = {};

/**
  * Return a { name -> directory } packages found in a Yarn monorepo
  *
  * Cached in YARN_MONOREPO_CACHE.
  */
export async function findYarnPackages(root: string): Promise<Record<string, string>> {
  if (!(root in YARN_MONOREPO_CACHE)) {
    const output: YarnWorkspacesOutput = JSON.parse(await shell(['yarn', 'workspaces', '--silent', 'info'], {
      captureStderr: false,
      cwd: root,
    }));

    const ret: Record<string, string> = {};
    for (const [k, v] of Object.entries(output)) {
      ret[k] = path.join(root, v.location);
    }
    YARN_MONOREPO_CACHE[root] = ret;
  }
  return YARN_MONOREPO_CACHE[root];
}

type YarnWorkspacesOutput = Record<string, { location: string }>;

export type AwsContext = { readonly aws: AwsClients };

/**
 * Higher order function to execute a block with an AWS client setup
 *
 * Allocate the next region from the REGION pool and dispose it afterwards.
 */
export function withAws<A extends TestContext>(block: (context: A & AwsContext) => Promise<void>) {
  return (context: A) => REGION_POOL.using(async (region) => {
    const aws = await AwsClients.forRegion(region, context.output);
    await sanityCheck(aws);

    return block({ ...context, aws });
  });
}

/**
 * Higher order function to execute a block with a CDK app fixture
 *
 * Requires an AWS client to be passed in.
 *
 * For backwards compatibility with existing tests (so we don't have to change
 * too much) the inner block is expected to take a `TestFixture` object.
 */
export function withCdkApp<A extends TestContext & AwsContext>(block: (context: TestFixture) => Promise<void>) {
  return async (context: A) => {
    const randy = randomString();
    const stackNamePrefix = `cdktest-${randy}`;
    const integTestDir = path.join(os.tmpdir(), `cdk-integ-${randy}`);

    context.output.write(` Stack prefix:   ${stackNamePrefix}\n`);
    context.output.write(` Test directory: ${integTestDir}\n`);
    context.output.write(` Region:         ${context.aws.region}\n`);

    await cloneDirectory(path.join(__dirname, '..', 'cli', 'app'), integTestDir, context.output);
    const fixture = new TestFixture(
      integTestDir,
      stackNamePrefix,
      context.output,
      context.aws);

    let success = true;
    try {
      const installationVersion = FRAMEWORK_VERSION;

      if (MAJOR_VERSION === '1') {
        await installNpmPackages(fixture, {
          '@aws-cdk/core': installationVersion,
          '@aws-cdk/aws-sns': installationVersion,
          '@aws-cdk/aws-sqs': installationVersion,
          '@aws-cdk/aws-iam': installationVersion,
          '@aws-cdk/aws-lambda': installationVersion,
          '@aws-cdk/aws-ssm': installationVersion,
          '@aws-cdk/aws-ecr-assets': installationVersion,
          '@aws-cdk/aws-cloudformation': installationVersion,
          '@aws-cdk/aws-ec2': installationVersion,
          '@aws-cdk/aws-s3': installationVersion,
          'constructs': '^3',
        });
      } else {
        await installNpmPackages(fixture, {
          'aws-cdk-lib': installationVersion,
          'constructs': '^10',
        });
      }

      await ensureBootstrapped(fixture);

      await block(fixture);
    } catch (e) {
      success = false;
      throw e;
    } finally {
      if (process.env.INTEG_NO_CLEAN) {
        process.stderr.write(`Left test directory in '${integTestDir}' ($INTEG_NO_CLEAN)\n`);
      } else {
        await fixture.dispose(success);
      }
    }
  };
}

export function withMonolithicCfnIncludeCdkApp<A extends TestContext>(block: (context: TestFixture) => Promise<void>) {
  return async (context: A) => {
    const uberPackage = process.env.UBERPACKAGE;
    if (!uberPackage) {
      throw new Error('The UBERPACKAGE environment variable is required for running this test!');
    }

    const randy = randomString();
    const stackNamePrefix = `cdk-uber-cfn-include-${randy}`;
    const integTestDir = path.join(os.tmpdir(), `cdk-uber-cfn-include-${randy}`);

    context.output.write(` Stack prefix:   ${stackNamePrefix}\n`);
    context.output.write(` Test directory: ${integTestDir}\n`);

    const awsClients = await AwsClients.default(context.output);
    await cloneDirectory(path.join(__dirname, '..', 'uberpackage', 'cfn-include-app'), integTestDir, context.output);
    const fixture = new TestFixture(
      integTestDir,
      stackNamePrefix,
      context.output,
      awsClients,
    );

    let success = true;
    try {
      await installNpmPackages(fixture, {
        [uberPackage]: FRAMEWORK_VERSION ?? '*',
      });

      await block(fixture);
    } catch (e) {
      success = false;
      throw e;
    } finally {
      if (process.env.INTEG_NO_CLEAN) {
        process.stderr.write(`Left test directory in '${integTestDir}' ($INTEG_NO_CLEAN)\n`);
      } else {
        await fixture.dispose(success);
      }
    }
  };
}

/**
 * Default test fixture for most (all?) integ tests
 *
 * It's a composition of withAws/withCdkApp, expecting the test block to take a `TestFixture`
 * object.
 *
 * We could have put `withAws(withCdkApp(fixture => { /... actual test here.../ }))` in every
 * test declaration but centralizing it is going to make it convenient to modify in the future.
 */
export function withDefaultFixture(block: (context: TestFixture) => Promise<void>) {
  return withAws<TestContext>(withCdkApp(block));
  //              ^~~~~~ this is disappointing TypeScript! Feels like you should have been able to derive this.
}

export interface ShellOptions extends child_process.SpawnOptions {
  /**
   * Properties to add to 'env'
   */
  modEnv?: Record<string, string>;

  /**
   * Don't fail when exiting with an error
   *
   * @default false
   */
  allowErrExit?: boolean;

  /**
   * Whether to capture stderr
   *
   * @default true
   */
  captureStderr?: boolean;

  /**
   * Pass output here
   */
  output?: NodeJS.WritableStream;

  /**
   * Only return stderr. For example, this is used to validate
   * that when CI=true, all logs are sent to stdout.
   *
   * @default false
   */
  onlyStderr?: boolean;
}

export interface CdkCliOptions extends ShellOptions {
  options?: string[];
  neverRequireApproval?: boolean;
  verbose?: boolean;
}

/**
 * Prepare a target dir byreplicating a source directory
 */
export async function cloneDirectory(source: string, target: string, output?: NodeJS.WritableStream) {
  await shell(['rm', '-rf', target], { output });
  await shell(['mkdir', '-p', target], { output });
  await shell(['cp', '-R', source + '/*', target], { output });
}

interface CommonCdkBootstrapCommandOptions {
  readonly toolkitStackName: string;

  /**
   * @default false
   */
  readonly verbose?: boolean;

  /**
   * @default - auto-generated CloudFormation name
   */
  readonly bootstrapBucketName?: string;

  readonly cliOptions?: CdkCliOptions;

  /**
   * @default - none
   */
  readonly tags?: string;
}

export interface CdkLegacyBootstrapCommandOptions extends CommonCdkBootstrapCommandOptions {
  /**
   * @default false
   */
  readonly noExecute?: boolean;

  /**
   * @default true
   */
  readonly publicAccessBlockConfiguration?: boolean;
}

export interface CdkModernBootstrapCommandOptions extends CommonCdkBootstrapCommandOptions {
  /**
   * @default false
   */
  readonly force?: boolean;

  /**
   * @default - none
   */
  readonly cfnExecutionPolicy?: string;

  /**
   * @default false
   */
  readonly showTemplate?: boolean;

  readonly template?: string;

  /**
   * @default false
   */
  readonly terminationProtection?: boolean;

  /**
   * @default undefined
   */
  readonly examplePermissionsBoundary?: boolean;

  /**
   * @default undefined
   */
  readonly customPermissionsBoundary?: string;
}

export class TestFixture {
  public readonly qualifier = randomString().slice(0, 10);
  private readonly bucketsToDelete = new Array<string>();

  constructor(
    public readonly integTestDir: string,
    public readonly stackNamePrefix: string,
    public readonly output: NodeJS.WritableStream,
    public readonly aws: AwsClients) {
  }

  public log(s: string) {
    this.output.write(`${s}\n`);
  }

  public async shell(command: string[], options: Omit<ShellOptions, 'cwd' | 'output'> = {}): Promise<string> {
    return shell(command, {
      output: this.output,
      cwd: this.integTestDir,
      ...options,
    });
  }

  public async cdkDeploy(stackNames: string | string[], options: CdkCliOptions = {}) {
    stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;

    const neverRequireApproval = options.neverRequireApproval ?? true;

    return this.cdk(['deploy',
      ...(neverRequireApproval ? ['--require-approval=never'] : []), // Default to no approval in an unattended test
      ...(options.options ?? []),
      ...this.fullStackName(stackNames)], options);
  }

  public async cdkSynth(options: CdkCliOptions = {}) {
    return this.cdk([
      'synth',
      ...(options.options ?? []),
    ], options);
  }

  public async cdkDestroy(stackNames: string | string[], options: CdkCliOptions = {}) {
    stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;

    return this.cdk(['destroy',
      '-f', // We never want a prompt in an unattended test
      ...(options.options ?? []),
      ...this.fullStackName(stackNames)], options);
  }

  public async cdkBootstrapLegacy(options: CdkLegacyBootstrapCommandOptions): Promise<string> {
    const args = ['bootstrap'];

    if (options.verbose) {
      args.push('-v');
    }
    args.push('--toolkit-stack-name', options.toolkitStackName);
    if (options.bootstrapBucketName) {
      args.push('--bootstrap-bucket-name', options.bootstrapBucketName);
    }
    if (options.noExecute) {
      args.push('--no-execute');
    }
    if (options.publicAccessBlockConfiguration !== undefined) {
      args.push('--public-access-block-configuration', options.publicAccessBlockConfiguration.toString());
    }
    if (options.tags) {
      args.push('--tags', options.tags);
    }

    return this.cdk(args, {
      ...options.cliOptions,
      modEnv: {
        ...options.cliOptions?.modEnv,
        // so that this works for V2,
        // where the "new" bootstrap is the default
        CDK_LEGACY_BOOTSTRAP: '1',
      },
    });
  }

  public async cdkBootstrapModern(options: CdkModernBootstrapCommandOptions): Promise<string> {
    const args = ['bootstrap'];

    if (options.verbose) {
      args.push('-v');
    }
    if (options.showTemplate) {
      args.push('--show-template');
    }
    if (options.template) {
      args.push('--template', options.template);
    }
    args.push('--toolkit-stack-name', options.toolkitStackName);
    if (options.bootstrapBucketName) {
      args.push('--bootstrap-bucket-name', options.bootstrapBucketName);
    }
    args.push('--qualifier', this.qualifier);
    if (options.cfnExecutionPolicy) {
      args.push('--cloudformation-execution-policies', options.cfnExecutionPolicy);
    }
    if (options.terminationProtection !== undefined) {
      args.push('--termination-protection', options.terminationProtection.toString());
    }
    if (options.force) {
      args.push('--force');
    }
    if (options.tags) {
      args.push('--tags', options.tags);
    }
    if (options.customPermissionsBoundary !== undefined) {
      args.push('--custom-permissions-boundary', options.customPermissionsBoundary);
    } else if (options.examplePermissionsBoundary !== undefined) {
      args.push('--example-permissions-boundary');
    }

    return this.cdk(args, {
      ...options.cliOptions,
      modEnv: {
        ...options.cliOptions?.modEnv,
        // so that this works for V1,
        // where the "old" bootstrap is the default
        CDK_NEW_BOOTSTRAP: '1',
      },
    });
  }

  public async cdk(args: string[], options: CdkCliOptions = {}) {
    const verbose = options.verbose ?? true;

    return this.shell(['cdk', ...(verbose ? ['-v'] : []), ...args], {
      ...options,
      modEnv: {
        AWS_REGION: this.aws.region,
        AWS_DEFAULT_REGION: this.aws.region,
        STACK_NAME_PREFIX: this.stackNamePrefix,
        PACKAGE_LAYOUT_VERSION: MAJOR_VERSION,
        ...options.modEnv,
      },
    });
  }

  public template(stackName: string): any {
    const fullStackName = this.fullStackName(stackName);
    const templatePath = path.join(this.integTestDir, 'cdk.out', `${fullStackName}.template.json`);
    return JSON.parse(fs.readFileSync(templatePath, { encoding: 'utf-8' }).toString());
  }

  public get bootstrapStackName() {
    return this.fullStackName('bootstrap-stack');
  }

  public fullStackName(stackName: string): string;
  public fullStackName(stackNames: string[]): string[];
  public fullStackName(stackNames: string | string[]): string | string[] {
    if (typeof stackNames === 'string') {
      return `${this.stackNamePrefix}-${stackNames}`;
    } else {
      return stackNames.map(s => `${this.stackNamePrefix}-${s}`);
    }
  }

  /**
   * Append this to the list of buckets to potentially delete
   *
   * At the end of a test, we clean up buckets that may not have gotten destroyed
   * (for whatever reason).
   */
  public rememberToDeleteBucket(bucketName: string) {
    this.bucketsToDelete.push(bucketName);
  }

  /**
   * Cleanup leftover stacks and buckets
   */
  public async dispose(success: boolean) {
    const stacksToDelete = await this.deleteableStacks(this.stackNamePrefix);

    this.sortBootstrapStacksToTheEnd(stacksToDelete);

    // Bootstrap stacks have buckets that need to be cleaned
    const bucketNames = stacksToDelete.map(stack => outputFromStack('BucketName', stack)).filter(defined);
    await Promise.all(bucketNames.map(b => this.aws.emptyBucket(b)));
    // The bootstrap bucket has a removal policy of RETAIN by default, so add it to the buckets to be cleaned up.
    this.bucketsToDelete.push(...bucketNames);

    // Bootstrap stacks have ECR repositories with images which should be deleted
    const imageRepositoryNames = stacksToDelete.map(stack => outputFromStack('ImageRepositoryName', stack)).filter(defined);
    await Promise.all(imageRepositoryNames.map(r => this.aws.deleteImageRepository(r)));

    await this.aws.deleteStacks(...stacksToDelete.map(s => s.StackName));

    // We might have leaked some buckets by upgrading the bootstrap stack. Be
    // sure to clean everything.
    for (const bucket of this.bucketsToDelete) {
      await this.aws.deleteBucket(bucket);
    }

    // If the tests completed successfully, happily delete the fixture
    // (otherwise leave it for humans to inspect)
    if (success) {
      rimraf(this.integTestDir);
    }
  }

  /**
   * Return the stacks starting with our testing prefix that should be deleted
   */
  private async deleteableStacks(prefix: string): Promise<AWS.CloudFormation.Stack[]> {
    const statusFilter = [
      'CREATE_IN_PROGRESS', 'CREATE_FAILED', 'CREATE_COMPLETE',
      'ROLLBACK_IN_PROGRESS', 'ROLLBACK_FAILED', 'ROLLBACK_COMPLETE',
      'DELETE_FAILED',
      'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
      'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_IN_PROGRESS',
      'UPDATE_ROLLBACK_FAILED',
      'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
      'UPDATE_ROLLBACK_COMPLETE', 'REVIEW_IN_PROGRESS',
      'IMPORT_IN_PROGRESS', 'IMPORT_COMPLETE',
      'IMPORT_ROLLBACK_IN_PROGRESS', 'IMPORT_ROLLBACK_FAILED',
      'IMPORT_ROLLBACK_COMPLETE',
    ];

    const response = await this.aws.cloudFormation('describeStacks', {});

    return (response.Stacks ?? [])
      .filter(s => s.StackName.startsWith(prefix))
      .filter(s => statusFilter.includes(s.StackStatus))
      .filter(s => s.RootId === undefined); // Only delete parent stacks. Nested stacks are deleted in the process
  }

  private sortBootstrapStacksToTheEnd(stacks: AWS.CloudFormation.Stack[]) {
    stacks.sort((a, b) => {
      const aBs = a.StackName.startsWith(this.bootstrapStackName);
      const bBs = b.StackName.startsWith(this.bootstrapStackName);

      return aBs != bBs
        // '+' converts a boolean to 0 or 1
        ? (+aBs) - (+bBs)
        : a.StackName.localeCompare(b.StackName);
    });
  }
}

/**
 * Perform a one-time quick sanity check that the AWS clients has properly configured credentials
 *
 * If we don't do this, calls are going to fail and they'll be retried and everything will take
 * forever before the user notices a simple misconfiguration.
 *
 * We can't check for the presence of environment variables since credentials could come from
 * anywhere, so do simple account retrieval.
 *
 * Only do it once per process.
 */
async function sanityCheck(aws: AwsClients) {
  if (sanityChecked === undefined) {
    try {
      await aws.account();
      sanityChecked = true;
    } catch (e) {
      sanityChecked = false;
      throw new Error(`AWS credentials probably not configured, got error: ${e.message}`);
    }
  }
  if (!sanityChecked) {
    throw new Error('AWS credentials probably not configured, see previous error');
  }
}
let sanityChecked: boolean | undefined;

/**
 * Make sure that the given environment is bootstrapped
 *
 * Since we go striping across regions, it's going to suck doing this
 * by hand so let's just mass-automate it.
 */
async function ensureBootstrapped(fixture: TestFixture) {
  // Always use the modern bootstrap stack, otherwise we may get the error
  // "refusing to downgrade from version 7 to version 0" when bootstrapping with default
  // settings using a v1 CLI.
  //
  // It doesn't matter for tests: when they want to test something about an actual legacy
  // bootstrap stack, they'll create a bootstrap stack with a non-default name to test that exact property.
  const envSpecifier = `aws://${await fixture.aws.account()}/${fixture.aws.region}`;
  if (ALREADY_BOOTSTRAPPED_IN_THIS_RUN.has(envSpecifier)) { return; }

  await fixture.cdk(['bootstrap', envSpecifier], {
    modEnv: {
      // Even for v1, use new bootstrap
      CDK_NEW_BOOTSTRAP: '1',
    },
  });
  ALREADY_BOOTSTRAPPED_IN_THIS_RUN.add(envSpecifier);
}

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export async function shell(command: string[], options: ShellOptions = {}): Promise<string> {
  if (options.modEnv && options.env) {
    throw new Error('Use either env or modEnv but not both');
  }

  options.output?.write(`💻 ${command.join(' ')}\n`);

  const env = options.env ?? (options.modEnv ? { ...process.env, ...options.modEnv } : undefined);

  const child = child_process.spawn(command[0], command.slice(1), {
    ...options,
    env,
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<Buffer>();
    const stderr = new Array<Buffer>();

    child.stdout!.on('data', chunk => {
      options.output?.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      options.output?.write(chunk);
      if (options.captureStderr ?? true) {
        stderr.push(chunk);
      }
    });

    child.once('error', reject);

    child.once('close', code => {
      const stderrOutput = Buffer.concat(stderr).toString('utf-8');
      const stdoutOutput = Buffer.concat(stdout).toString('utf-8');
      const output = (options.onlyStderr ? stderrOutput : stdoutOutput + stderrOutput).trim();
      if (code === 0 || options.allowErrExit) {
        resolve(output);
      } else {
        reject(new Error(`'${command.join(' ')}' exited with error code ${code}. Output: \n${output}`));
      }
    });
  });
}

function defined<A>(x: A): x is NonNullable<A> {
  return x !== undefined;
}

/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 */
export function rimraf(fsPath: string) {
  try {
    const isDir = fs.lstatSync(fsPath).isDirectory();

    if (isDir) {
      for (const file of fs.readdirSync(fsPath)) {
        rimraf(path.join(fsPath, file));
      }
      fs.rmdirSync(fsPath);
    } else {
      fs.unlinkSync(fsPath);
    }
  } catch (e) {
    // We will survive ENOENT
    if (e.code !== 'ENOENT') { throw e; }
  }
}

export function randomString() {
  // Crazy
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}

/**
 * Install the given NPM packages, identified by their names and versions
 *
 * Works by writing the packages to a `package.json` file, and
 * then running NPM7's "install" on it. The use of NPM7 will automatically
 * install required peerDependencies.
 *
 * If we're running in REPO mode and we find the package in the set of local
 * packages in the repository, we'll write the directory name to `package.json`
 * so that NPM will create a symlink (this allows running tests against
 * built-but-unpackaged modules, and saves dev cycle time).
 *
 * Be aware you MUST install all the packages you directly depend upon! In the case
 * of a repo/symlinking install, transitive dependencies WILL NOT be installed in the
 * current directory's `node_modules` directory, because they will already have been
 * symlinked from the TARGET directory's `node_modules` directory (which is sufficient
 * for Node's dependency lookup mechanism).
 */
export async function installNpmPackages(fixture: TestFixture, packages: Record<string, string>) {
  if (process.env.REPO_ROOT) {
    const monoRepo = await findYarnPackages(process.env.REPO_ROOT);

    // Replace the install target with the physical location of this package
    for (const key of Object.keys(packages)) {
      if (key in monoRepo) {
        packages[key] = monoRepo[key];
      }
    }
  }

  fs.writeFileSync(path.join(fixture.integTestDir, 'package.json'), JSON.stringify({
    name: 'cdk-integ-tests',
    private: true,
    version: '0.0.1',
    devDependencies: packages,
  }, undefined, 2), { encoding: 'utf-8' });

  // Now install that `package.json` using NPM7
  const npm7 = await installNpm7();
  await fixture.shell([npm7, 'install']);
}

/**
 * Install NPM7 somewhere on the machine and return the path to its binary.
 *
 * - We install NPM7 explicitly so we don't have to depend on the environment.
 * - The install is cached so we don't have to install it over and over again
 *   for every test.
 */
const installNpm7 = memoize0(async (): Promise<string> => {
  const installDir = path.join(os.tmpdir(), 'cdk-integ-npm7');
  await shell(['rm', '-rf', installDir]);
  await shell(['mkdir', '-p', installDir]);

  await shell(['npm', 'install', 'npm@7'], { cwd: installDir });

  return path.join(installDir, 'node_modules', '.bin', 'npm');
});

const ALREADY_BOOTSTRAPPED_IN_THIS_RUN = new Set();
