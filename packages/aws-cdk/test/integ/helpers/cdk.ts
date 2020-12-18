import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { outputFromStack, AwsClients } from './aws';
import { ResourcePool } from './resource-pool';
import { TestContext } from './test-helpers';

const REGIONS = process.env.AWS_REGIONS
  ? process.env.AWS_REGIONS.split(',')
  : [process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1'];

const FRAMEWORK_VERSION = process.env.FRAMEWORK_VERSION;

process.stdout.write(`Using regions: ${REGIONS}\n`);
process.stdout.write(`Using framework version: ${FRAMEWORK_VERSION}\n`);

const REGION_POOL = new ResourcePool(REGIONS);


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
      let modules = [
        '@aws-cdk/core',
        '@aws-cdk/aws-sns',
        '@aws-cdk/aws-iam',
        '@aws-cdk/aws-lambda',
        '@aws-cdk/aws-ssm',
        '@aws-cdk/aws-ecr-assets',
        '@aws-cdk/aws-cloudformation',
        '@aws-cdk/aws-ec2',
      ];
      if (FRAMEWORK_VERSION) {
        modules = modules.map(module => `${module}@${FRAMEWORK_VERSION}`);
      }
      await fixture.shell(['npm', 'install', ...modules]);

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
      let module = uberPackage;
      if (FRAMEWORK_VERSION) {
        module = `${module}@${FRAMEWORK_VERSION}`;
      }
      await fixture.shell(['npm', 'install', 'constructs', module]);

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

export class TestFixture {
  public readonly qualifier = randomString().substr(0, 10);
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

  public async shell(command: string[], options: Omit<ShellOptions, 'cwd'|'output'> = {}): Promise<string> {
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

  public async cdk(args: string[], options: CdkCliOptions = {}) {
    const verbose = options.verbose ?? true;

    return this.shell(['cdk', ...(verbose ? ['-v'] : []), ...args], {
      ...options,
      modEnv: {
        AWS_REGION: this.aws.region,
        AWS_DEFAULT_REGION: this.aws.region,
        STACK_NAME_PREFIX: this.stackNamePrefix,
        ...options.modEnv,
      },
    });
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
  // Old-style bootstrap stack with default name
  if (await fixture.aws.stackStatus('CDKToolkit') === undefined) {
    await fixture.cdk(['bootstrap', `aws://${await fixture.aws.account()}/${fixture.aws.region}`]);
  }
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
      const output = (Buffer.concat(stdout).toString('utf-8') + Buffer.concat(stderr).toString('utf-8')).trim();
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
