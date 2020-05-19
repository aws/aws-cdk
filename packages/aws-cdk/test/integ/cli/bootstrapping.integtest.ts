import { cloudFormation } from './aws-helpers';
import { cdk, cdkDeploy, cleanup, fullStackName, prepareAppFixture, rememberToDeleteBucket } from './cdk-helpers';

jest.setTimeout(600_000);

const QUALIFIER = randomString();

beforeAll(async () => {
  await prepareAppFixture();
});

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

test('can bootstrap without execution', async () => {
  const bootstrapStackName = fullStackName('bootstrap-stack');

  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--no-execute']);

  const resp = await cloudFormation('describeStacks', {
    StackName: bootstrapStackName,
  });

  expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
});

test('upgrade legacy bootstrap stack to new bootstrap stack while in use', async () => {
  const bootstrapStackName = fullStackName('bootstrap-stack');

  const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
  const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;
  rememberToDeleteBucket(legacyBootstrapBucketName);  // This one will leak
  rememberToDeleteBucket(newBootstrapBucketName);     // This one shouldn't leak if the test succeeds, but let's be safe in case it doesn't

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
    '--bootstrap-bucket-name', newBootstrapBucketName,
    '--qualifier', QUALIFIER], {
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

test('deploy new style synthesis to new style bootstrap', async () => {
  const bootstrapStackName = fullStackName('bootstrap-stack');

  await cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--qualifier', QUALIFIER,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess',
  ], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
  });

  // Deploy stack that uses file assets
  await cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${QUALIFIER}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
});

test('deploying new style synthesis to old style bootstrap fails', async () => {
  const bootstrapStackName = fullStackName('bootstrap-stack');

  await cdk(['bootstrap', '--toolkit-stack-name', bootstrapStackName]);

  // Deploy stack that uses file assets, this fails because the bootstrap stack
  // is version checked.
  await expect(cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  })).rejects.toThrow('exited with error');
});

test('can create multiple legacy bootstrap stacks', async () => {
  const bootstrapStackName1 = fullStackName('bootstrap-stack-1');
  const bootstrapStackName2 = fullStackName('bootstrap-stack-2');

  // deploy two toolkit stacks into the same environment (see #1416)
  // one with tags
  await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName1, '--tags', 'Foo=Bar']);
  await cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName2]);

  const response = await cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
});

function randomString() {
  // Crazy
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}
