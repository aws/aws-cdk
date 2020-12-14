import { CreateChangeSetInput } from 'aws-sdk/clients/cloudformation';
import { Bootstrapper } from '../../lib/api/bootstrap';
import { deserializeStructure } from '../../lib/serialize';
import { MockSdkProvider, SyncHandlerSubsetOf } from '../util/mock-sdk';

const env = {
  account: '123456789012',
  region: 'us-east-1',
  name: 'mock',
};

let sdk: MockSdkProvider;
let executed: boolean;
let protectedTermination: boolean;
let cfnMocks: jest.Mocked<SyncHandlerSubsetOf<AWS.CloudFormation>>;
let changeSetTemplate: any | undefined;
let bootstrapper: Bootstrapper;
beforeEach(() => {
  sdk = new MockSdkProvider();
  executed = false;
  protectedTermination = false;
  bootstrapper = new Bootstrapper({ source: 'legacy' });

  cfnMocks = {
    describeStackEvents: jest.fn().mockReturnValue({}),
    describeStacks: jest.fn()
      // First two calls, no stacks exist (first is for version checking, second is in deploy-stack.ts)
      .mockImplementationOnce(() => ({ Stacks: [] }))
      .mockImplementationOnce(() => ({ Stacks: [] }))
      // Second call, stack has been created
      .mockImplementationOnce(() => ({
        Stacks: [
          {
            StackStatus: 'CREATE_COMPLETE',
            StackStatusReason: 'It is magic',
            EnableTerminationProtection: false,
          },
        ],
      })),
    createChangeSet: jest.fn((info: CreateChangeSetInput) => {
      changeSetTemplate = deserializeStructure(info.TemplateBody as string);
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
    getTemplate: jest.fn(() => {
      executed = true;
      return {};
    }),
    deleteStack: jest.fn(),
    updateTerminationProtection: jest.fn(() => {
      protectedTermination = true;
      return {};
    }),
  };
  sdk.stubCloudFormation(cfnMocks);
});

test('do bootstrap', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'mockStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using custom bucket name', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    parameters: {
      bucketName: 'foobar',
    },
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBe('foobar');
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using KMS CMK', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    parameters: {
      kmsKeyId: 'myKmsKey',
    },
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBe('myKmsKey');
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('bootstrap disable bucket Public Access Block Configuration', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    parameters: {
      publicAccessBlockConfiguration: false,
    },
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('false');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap with custom tags for toolkit stack', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    tags: [{ Key: 'Foo', Value: 'Bar' }],
  });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('passing trusted accounts to the old bootstrapping results in an error', async () => {
  await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    parameters: {
      trustedAccounts: ['0123456789012'],
    },
  }))
    .rejects
    .toThrow('--trust can only be passed for the modern bootstrap experience.');
});

test('passing CFN execution policies to the old bootstrapping results in an error', async () => {
  await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
    toolkitStackName: 'mockStack',
    parameters: {
      cloudFormationExecutionPolicies: ['arn:aws:iam::aws:policy/AdministratorAccess'],
    },
  }))
    .rejects
    .toThrow('--cloudformation-execution-policies can only be passed for the modern bootstrap experience.');
});

test('even if the bootstrap stack is in a rollback state, can still retry bootstrapping it', async () => {
  (cfnMocks.describeStacks! as jest.Mock)
    .mockReset()
    // First two calls, the stack exists with a 'rollback complete' status
    // (first is for version checking, second is in deploy-stack.ts)
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'UPDATE_ROLLBACK_COMPLETE',
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
            { OutputKey: 'BucketDomainName', OutputValue: 'aws.com' },
          ],
        },
      ],
    }))
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'UPDATE_ROLLBACK_COMPLETE',
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
            { OutputKey: 'BucketDomainName', OutputValue: 'aws.com' },
          ],
        },
      ],
    }))
    // Third call, stack has been created
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'CREATE_COMPLETE',
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
        },
      ],
    }));

  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'mockStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('even if the bootstrap stack failed to create, can still retry bootstrapping it', async () => {
  (cfnMocks.describeStacks! as jest.Mock)
    .mockReset()
    // First two calls, the stack exists with a 'rollback complete' status
    // (first is for version checking, second is in deploy-stack.ts)
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'ROLLBACK_COMPLETE',
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
          ],
        } as AWS.CloudFormation.Stack,
      ],
    }))
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'ROLLBACK_COMPLETE',
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
          ],
        },
      ],
    }))
    // Third call, we just did a delete and want to see it gone
    .mockImplementationOnce(() => ({ Stacks: [] }))
    // Fourth call, stack has been created
    .mockImplementationOnce(() => ({
      Stacks: [
        {
          StackStatus: 'CREATE_COMPLETE',
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
        },
      ],
    }));

  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'mockStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
    .toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
  expect(cfnMocks.deleteStack).toHaveBeenCalled();
});

test('stack is not termination protected by default', async () => {
  // WHEN
  await bootstrapper.bootstrapEnvironment(env, sdk);

  // THEN
  expect(executed).toBeTruthy();
  expect(protectedTermination).toBeFalsy();
});

test('stack is termination protected when set', async () => {
  // WHEN
  await bootstrapper.bootstrapEnvironment(env, sdk, {
    terminationProtection: true,
  });

  // THEN
  expect(executed).toBeTruthy();
  expect(protectedTermination).toBeTruthy();
});
