import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { cloudFormation, deleteBucket, deleteImageRepository, deleteStacks, emptyBucket, outputFromStack, testEnv } from './aws-helpers';

export const INTEG_TEST_DIR = path.join(os.tmpdir(), 'cdk-integ-test2');

export const STACK_NAME_PREFIX = process.env.STACK_NAME_PREFIX || (() => {
  // Make the stack names unique based on the codebuild project name
  // (if it exists). This prevents multiple codebuild projects stomping
  // on each other's stacks and failing them.
  //
  // The get codebuild project name from the ID: PROJECT_NAME:1238a83
  if (process.env.CODEBUILD_BUILD_ID) { return process.env.CODEBUILD_BUILD_ID.split(':')[0]; }
  if (process.env.IS_CANARY === 'true') { return 'cdk-toolkit-canary'; }
  return 'cdk-toolkit-integration';
})();

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
}

export interface CdkCliOptions extends ShellOptions {
  options?: string[];
  neverRequireApproval?: boolean;
}

export function log(x: string) {
  process.stderr.write(x + '\n');
}

export async function cdkDeploy(stackNames: string | string[], options: CdkCliOptions = {}) {
  stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;

  const neverRequireApproval = options.neverRequireApproval ?? true;

  return await cdk(['deploy',
    ...(neverRequireApproval ? ['--require-approval=never'] : []), // Default to no approval in an unattended test
    ...(options.options ?? []),
    ...fullStackName(stackNames)], options);
}

export async function cdkDestroy(stackNames: string | string[], options: CdkCliOptions = {}) {
  stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;

  return await cdk(['destroy',
    '-f', // We never want a prompt in an unattended test
    ...(options.options ?? []),
    ...fullStackName(stackNames)], options);
}

export async function cdk(args: string[], options: CdkCliOptions = {}) {
  return await shell(['cdk', ...args], {
    cwd: INTEG_TEST_DIR,
    ...options,
    modEnv: {
      AWS_REGION: (await testEnv()).region,
      AWS_DEFAULT_REGION: (await testEnv()).region,
      STACK_NAME_PREFIX,
      ...options.modEnv,
    },
  });
}

export function fullStackName(stackName: string): string;
export function fullStackName(stackNames: string[]): string[];
export function fullStackName(stackNames: string | string[]): string | string[] {
  if (typeof stackNames === 'string') {
    return `${STACK_NAME_PREFIX}-${stackNames}`;
  } else {
    return stackNames.map(s => `${STACK_NAME_PREFIX}-${s}`);
  }
}

/**
 * Prepare a target dir byreplicating a source directory
 */
export async function cloneDirectory(source: string, target: string) {
  await shell(['rm', '-rf', target]);
  await shell(['mkdir', '-p', target]);
  await shell(['cp', '-R', source + '/*', target]);
}

/**
 * Prepare the app fixture
 *
 * If this is done in the main test script, it will be skipped
 * in the subprocess scripts since the app fixture can just be reused.
 */
export async function prepareAppFixture() {
  await cloneDirectory(path.join(__dirname, 'app'), INTEG_TEST_DIR);

  await shell(['npm', 'install',
    '@aws-cdk/core',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-ssm',
    '@aws-cdk/aws-ecr-assets',
    '@aws-cdk/aws-cloudformation',
    '@aws-cdk/aws-ec2'], {
    cwd: INTEG_TEST_DIR,
  });
}

/**
 * Return the stacks starting with our testing prefix that should be deleted
 */
export async function deleteableStacks(prefix: string): Promise<AWS.CloudFormation.Stack[]> {
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

  const response = await cloudFormation('describeStacks', {});

  return (response.Stacks ?? [])
    .filter(s => s.StackName.startsWith(prefix))
    .filter(s => statusFilter.includes(s.StackStatus))
    .filter(s => s.RootId === undefined); // Only delete parent stacks. Nested stacks are deleted in the process
}

/**
 * Cleanup leftover stacks and buckets
 */
export async function cleanup(): Promise<void> {
  const stacksToDelete = await deleteableStacks(STACK_NAME_PREFIX);

  // Bootstrap stacks have buckets that need to be cleaned
  const bucketNames = stacksToDelete.map(stack => outputFromStack('BucketName', stack)).filter(defined);
  await Promise.all(bucketNames.map(emptyBucket));

  // Bootstrap stacks have ECR repositories with images which should be deleted
  const imageRepositoryNames = stacksToDelete.map(stack => outputFromStack('ImageRepositoryName', stack)).filter(defined);
  await Promise.all(imageRepositoryNames.map(deleteImageRepository));

  await deleteStacks(...stacksToDelete.map(s => s.StackName));

  // We might have leaked some buckets by upgrading the bootstrap stack. Be
  // sure to clean everything.
  for (const bucket of bucketsToDelete) {
    await deleteBucket(bucket);
  }
  bucketsToDelete = [];
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

  log(`💻 ${command.join(' ')}`);

  const env = options.env ?? (options.modEnv ? {...process.env, ...options.modEnv} : undefined);

  const child = child_process.spawn(command[0], command.slice(1), {
    ...options,
    env,
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: [ 'ignore', 'pipe', 'pipe' ],
  });

  return new Promise<string>((resolve, reject) => {
    const stdout = new Array<Buffer>();
    const stderr = new Array<Buffer>();

    child.stdout!.on('data', chunk => {
      process.stdout.write(chunk);
      stdout.push(chunk);
    });

    child.stderr!.on('data', chunk => {
      process.stderr.write(chunk);
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