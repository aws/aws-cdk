import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { outputFromStack, testEnv, AwsClients } from './aws-helpers';
import { TestEnvironment } from './test-helpers';

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
    return await shell(command, {
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

  public async cdkDestroy(stackNames: string | string[], options: CdkCliOptions = {}) {
    stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;

    return this.cdk(['destroy',
      '-f', // We never want a prompt in an unattended test
      ...(options.options ?? []),
      ...this.fullStackName(stackNames)], options);
  }

  public async cdk(args: string[], options: CdkCliOptions = {}) {
    return await this.shell(['cdk', ...args], {
      ...options,
      modEnv: {
        AWS_REGION: (await testEnv()).region,
        AWS_DEFAULT_REGION: (await testEnv()).region,
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
   * Cleanup leftover stacks and buckets
   */
  public async dispose(success: boolean) {
    const stacksToDelete = await this.deleteableStacks(this.stackNamePrefix);

    // Bootstrap stacks have buckets that need to be cleaned
    const bucketNames = stacksToDelete.map(stack => outputFromStack('BucketName', stack)).filter(defined);
    await Promise.all(bucketNames.map(b => this.aws.emptyBucket(b)));

    // Bootstrap stacks have ECR repositories with images which should be deleted
    const imageRepositoryNames = stacksToDelete.map(stack => outputFromStack('ImageRepositoryName', stack)).filter(defined);
    await Promise.all(imageRepositoryNames.map(r => this.aws.deleteImageRepository(r)));

    await this.aws.deleteStacks(...stacksToDelete.map(s => s.StackName));

    // We might have leaked some buckets by upgrading the bootstrap stack. Be
    // sure to clean everything.
    for (const bucket of bucketsToDelete) {
      await this.aws.deleteBucket(bucket);
    }
    bucketsToDelete = [];

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
 * Prepare the app fixture
 *
 * If this is done in the main test script, it will be skipped
 * in the subprocess scripts since the app fixture can just be reused.
 */
export async function prepareAppFixture(env: TestEnvironment): Promise<TestFixture> {
  const randy = randomString();
  const stackNamePrefix = `cdktest-${randy}`;
  const integTestDir = path.join(os.tmpdir(), `cdk-integ-${randy}`);

  env.output.write(` Stack prefixes: ${stackNamePrefix}\n`);
  env.output.write(` Test directory: ${integTestDir}\n`);

  await cloneDirectory(path.join(__dirname, 'app'), integTestDir, env.output);

  const fixture = new TestFixture(integTestDir, stackNamePrefix, env.output, await AwsClients.default(env.output));

  await fixture.shell(['npm', 'install',
    '@aws-cdk/core',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-ssm',
    '@aws-cdk/aws-ecr-assets',
    '@aws-cdk/aws-cloudformation',
    '@aws-cdk/aws-ec2']);

  return fixture;
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
      if (code === 0 || options.allowErrExit) {
        resolve((Buffer.concat(stdout).toString('utf-8') + Buffer.concat(stderr).toString('utf-8')).trim());
      } else {
        reject(new Error(`'${command.join(' ')}' exited with error code ${code}: ${Buffer.concat(stderr).toString('utf-8').trim()}`));
      }
    });
  });
}

let bucketsToDelete = new Array<string>();

/**
 * Append this to the list of buckets to potentially delete
 *
 * At the end of a test, we clean up buckets that may not have gotten destroyed
 * (for whatever reason).
 */
export function rememberToDeleteBucket(bucketName: string) {
  bucketsToDelete.push(bucketName);
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