import { cloudFormation, deleteStacks } from './aws-helpers';
import { cdk, cleanupOldStacks, fullStackName, prepareAppFixture } from './cdk-helpers';

jest.setTimeout(600 * 1000);

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

  await cdk(['bootstrap', '-v',
    '--toolkit-stack-name', bootstrapStackName,
    '--no-execute']);
  try {

    const resp = await cloudFormation('describeStacks', {
      StackName: bootstrapStackName,
    });

    expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
  } finally {
    await deleteStacks(bootstrapStackName);
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
    await deleteStacks(bootstrapStackName1, bootstrapStackName2);
  }
});