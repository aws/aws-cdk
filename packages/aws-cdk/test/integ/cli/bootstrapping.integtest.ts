import { cloudFormation, deleteStacks, s3 } from './aws-helpers';
import { cdk, cdkDeploy, cleanupOldStacks, deleteableStacks, fullStackName, prepareAppFixture } from './cdk-helpers';

jest.setTimeout(600_000);

// Needs to not start with the ACTUAL fullstack name otherwisecleanupOldStacks will pick it up.
const BOOTSTRAP_STACK_PREFIX = `toolkit-${fullStackName('stack')}`;
const BUCKETS_TO_DELETE = new Array<string>();

beforeAll(async () => {
  await prepareAppFixture();
});

beforeEach(async () => {
  await cleanupOldStacks();
  BUCKETS_TO_DELETE.splice(0, BUCKETS_TO_DELETE.length);
});

afterEach(async () => {
  await cleanupOldStacks();
  await cleanupBootstrapStacks();

  // We might have lost some buckets by upgrading the bootstrap stack. Be
  // sure to clean everything.
  for (const bucket of BUCKETS_TO_DELETE) {
    await deleteBucket(bucket);
  }
});

test('can bootstrap without execution', async () => {
  const bootstrapStackName = `${BOOTSTRAP_STACK_PREFIX}-1`;

  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--no-execute']);

  const resp = await cloudFormation('describeStacks', {
    StackName: bootstrapStackName,
  });

  expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
});

test('upgrade legacy bootstrap stack to new bootstrap stack while in use', async () => {
  const bootstrapStackName = `${BOOTSTRAP_STACK_PREFIX}-update-in-place`;

  const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
  const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;
  BUCKETS_TO_DELETE.push(legacyBootstrapBucketName, newBootstrapBucketName);

  // Legacy bootstrap
  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--bootstrap-bucket-name', legacyBootstrapBucketName]);

  // Deploy stack that uses file assets
  await cdkDeploy('lambda', {
    options: ['--toolkit-stack-name', bootstrapStackName],
  });

  // Upgrade bootstrap stack to "new" style
  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--bootstrap-bucket-name', newBootstrapBucketName], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
  });

  // (Force) deploy stack again
  // --force to bypass the check which says that the template hasn't changed.
  await cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--force',
    ],
  });
});

test('can bootstrap multiple toolkit stacks', async () => {
  const bootstrapStackName1 = `${BOOTSTRAP_STACK_PREFIX}-1`;
  const bootstrapStackName2 = `${BOOTSTRAP_STACK_PREFIX}-2`;

  // deploy two toolkit stacks into the same environment (see #1416)
  // one with tags
  await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName1, '--tags', 'Foo=Bar']);
  await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName2]);

  const response = await cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
});

/**
 * Delete bootstrap stack, cleaning S3 bucket if necessary
 */
async function deleteBootstrapStack(stackName: string) {
  let response;
  try {
    response = await cloudFormation('describeStacks', { StackName: stackName });
  } catch (e) {
    if (e.message.indexOf('does not exist') > -1) { return; }
    throw e;
  }

  const bucketOutput = (response.Stacks?.[0].Outputs ?? []).find(o => o.OutputKey === 'BucketName');
  if (bucketOutput?.OutputValue) {
    await emptyBucket(bucketOutput?.OutputValue);
  }

  await deleteStacks(stackName);
}

async function cleanupBootstrapStacks() {
  const stacksToDelete = await deleteableStacks(BOOTSTRAP_STACK_PREFIX);
  for (const stack of stacksToDelete) {
    await deleteBootstrapStack(stack);
  }
}

function randomString() {
  // Crazy
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}

async function emptyBucket(bucketName: string) {
  const objects = await s3('listObjects', { Bucket: bucketName });
  const deletes = (objects.Contents || []).map(obj => obj.Key || '').filter(d => !!d);
  if (deletes.length === 0) {
    return Promise.resolve();
  }
  return s3('deleteObjects', {
    Bucket: bucketName,
    Delete: {
      Objects: deletes.map(d => ({ Key: d })),
      Quiet: false,
    },
  });
}

async function deleteBucket(bucketName: string) {
  await emptyBucket(bucketName);
  try {
    await s3('deleteBucket', {
      Bucket: bucketName,
    });
  } catch (e) {
    if (e.message.indexOf('does not exist') > -1) { return; }
    throw e;
  }
}