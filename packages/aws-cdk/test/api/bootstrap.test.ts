import { CreateChangeSetInput } from 'aws-sdk/clients/cloudformation';
import { bootstrapEnvironment } from '../../lib';
import { fromYAML } from '../../lib/serialize';
import { MockSdkProvider, SyncHandlerSubsetOf } from '../util/mock-sdk';

const env = {
  account: '123456789012',
  region: 'us-east-1',
  name: 'mock',
};

let sdk: MockSdkProvider;
let executed: boolean;
let cfnMocks: jest.Mocked<SyncHandlerSubsetOf<AWS.CloudFormation>>;
let changeSetTemplate: any | undefined;
beforeEach(() => {
  sdk = new MockSdkProvider();
  executed = false;

  cfnMocks = {
    describeStacks: jest.fn()
      // First call, no stacks exist
      .mockImplementationOnce(() => ({ Stacks: [] }))
      // Second call, stack has been created
      .mockImplementationOnce(() => ({ Stacks: [
        {
          StackStatus: 'CREATE_COMPLETE',
          StackStatusReason: 'It is magic',
        }
      ] })),
    createChangeSet: jest.fn((info: CreateChangeSetInput) => {
      changeSetTemplate = fromYAML(info.TemplateBody as string);
      return {};
    }),
    describeChangeSet: jest.fn(() => ({
      Status: 'CREATE_COMPLETE',
      Changes: [],
    })),
    executeChangeSet: jest.fn(() => {
      executed = true;
      return {};
    }),
  };
  sdk.stubCloudFormation(cfnMocks);
});

test('do bootstrap', async () => {
  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined);

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using custom bucket name', async () => {
  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    bucketName: 'foobar',
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBe('foobar');
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using KMS CMK', async () => {
  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    kmsKeyId: 'myKmsKey',
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBe('myKmsKey');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap with custom tags for toolkit stack', async () => {
  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    tags: [{ Key: 'Foo', Value: 'Bar' }]
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('passing trusted accounts to the old bootstrapping results in an error', async () => {
  await expect(bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    trustedAccounts: ['0123456789012'],
  }))
  .rejects
  .toThrow('--trust can only be passed for the new bootstrap experience!');
});

test('passing CFN execution policies to the old bootstrapping results in an error', async () => {
  await expect(bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    cloudFormationExecutionPolicies: ['arn:aws:iam::aws:policy/AdministratorAccess'],
  }))
  .rejects
  .toThrow('--cloudformation-execution-policies can only be passed for the new bootstrap experience!');
});
