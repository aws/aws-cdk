import { cloudFormation, s3 } from './aws-helpers';
import { cdk, cdkDeploy, cleanupOldStacks, fullStackName, prepareAppFixture } from './cdk-helpers';

jest.setTimeout(600_000);

beforeAll(async () => {
  await prepareAppFixture();
});

beforeEach(async () => {
  await cleanupOldStacks();
});

afterEach(async () => {
  await cleanupOldStacks();
});

test('can bootstrap without execution', async () => {
  const bootstrapStackName = fullStackName('toolkit-stack-1');

  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--no-execute']);
  try {

    const resp = await cloudFormation('describeStacks', {
      StackName: bootstrapStackName,
    });

    expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
  } finally {
    await deleteBootstrapStack(bootstrapStackName);
  }
});

test('upgrade legacy bootstrap stack to new bootstrap stack while in use', async () => {
  const bootstrapStackName = fullStackName('updating-bootstrap-stack');

  const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
  const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;

  // Legacy bootstrap
  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--bootstrap-bucket-name', legacyBootstrapBucketName]);
  try {
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
    await cdkDeploy('lambda', {
      options: [
        '--toolkit-stack-name', bootstrapStackName,
        '--force',
      ],
    });
  } finally {
    await deleteBootstrapStack(bootstrapStackName);
    // Delete on the buckets. Needs to go after the stack delete.
    await deleteBucket(legacyBootstrapBucketName);
    await deleteBucket(newBootstrapBucketName);
  }
});

test('can bootstrap multiple toolkit stacks', async () => {
  const bootstrapStackName1 = fullStackName('toolkit-stack-1');
  const bootstrapStackName2 = fullStackName('toolkit-stack-2');
  try {
    // deploy two toolkit stacks into the same environment (see #1416)
    // one with tags
    await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName1, '--tags', 'Foo=Bar']);
    await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName2]);

    const response = await cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
    expect(response.Stacks?.[0].Tags).toEqual([
      { Key: 'Foo', Value: 'Bar' },
    ]);
  } finally {
    await deleteBootstrapStack(bootstrapStackName1);
    await deleteBootstrapStack(bootstrapStackName2);
  }
});

/**
 * Delete bootstrap stack, cleaning S3 bucket if necessary
 */
async function deleteBootstrapStack(stackName: string) {
  try {
    const response = await cloudFormation('describeStacks', { StackName: stackName });

    const bucketOutput = (response.Stacks?.[0].Outputs ?? []).find(o => o.OutputKey === 'BucketName');
    if (bucketOutput?.OutputValue) {
      await emptyBucket(bucketOutput?.OutputValue);
    }

  } catch (e) {
    if (e.message.indexOf('does not exist') > -1) { return; }
    throw e;
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