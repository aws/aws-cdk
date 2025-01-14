import {
  CreateChangeSetCommand,
  CreateStackCommand,
  DeleteStackCommand,
  DescribeChangeSetCommand,
  DescribeStacksCommand,
  ExecuteChangeSetCommand,
  GetTemplateCommand,
  StackStatus,
  UpdateTerminationProtectionCommand,
} from '@aws-sdk/client-cloudformation';
import { parse } from 'yaml';
import { Bootstrapper } from '../../lib/api/bootstrap';
import { legacyBootstrapTemplate } from '../../lib/api/bootstrap/legacy-template';
import { deserializeStructure, serializeStructure, toYAML } from '../../lib/serialize';
import { MockSdkProvider, mockCloudFormationClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

const env = {
  account: '123456789012',
  region: 'us-east-1',
  name: 'mock',
};

const templateBody = toYAML(deserializeStructure(serializeStructure(legacyBootstrapTemplate({}), true)));
const changeSetName = 'cdk-deploy-change-set';

jest.mock('../../lib/api/util/checks', () => ({
  determineAllowCrossAccountAssetPublishing: jest.fn().mockResolvedValue(true),
}));
let sdk: MockSdkProvider;
let changeSetTemplate: any | undefined;
let bootstrapper: Bootstrapper;
beforeEach(() => {
  sdk = new MockSdkProvider();
  bootstrapper = new Bootstrapper({ source: 'legacy' });
  mockCloudFormationClient.reset();
  restoreSdkMocksToDefault();
  // First two calls, no stacks exist (first is for version checking, second is in deploy-stack.ts)
  mockCloudFormationClient.on(CreateChangeSetCommand).callsFake((input) => {
    changeSetTemplate = deserializeStructure(input.TemplateBody);
    return {};
  });
  mockCloudFormationClient.on(DescribeChangeSetCommand).callsFake((input) => {
    return {
      ChangeSetName: input.ChangeSetName,
      StackName: input.StackName,
      Status: StackStatus.CREATE_COMPLETE,
    };
  });
  mockCloudFormationClient
    .on(DescribeStacksCommand)
    .resolvesOnce({
      Stacks: [],
    })
    .resolvesOnce({
      Stacks: [],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.CREATE_COMPLETE,
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    });
});

test('do bootstrap', async () => {
  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'mockStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
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
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
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
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBe('myKmsKey');
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
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
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('false');
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
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
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(changeSetTemplate.Conditions.UsePublicAccessBlockConfiguration['Fn::Equals'][0]).toBe('true');
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
});

test('passing trusted accounts to the old bootstrapping results in an error', async () => {
  await expect(
    bootstrapper.bootstrapEnvironment(env, sdk, {
      toolkitStackName: 'mockStack',
      parameters: {
        trustedAccounts: ['0123456789012'],
      },
    }),
  ).rejects.toThrow('--trust can only be passed for the modern bootstrap experience.');
});

test('passing CFN execution policies to the old bootstrapping results in an error', async () => {
  await expect(
    bootstrapper.bootstrapEnvironment(env, sdk, {
      toolkitStackName: 'mockStack',
      parameters: {
        cloudFormationExecutionPolicies: ['arn:aws:iam::aws:policy/AdministratorAccess'],
      },
    }),
  ).rejects.toThrow('--cloudformation-execution-policies can only be passed for the modern bootstrap experience.');
});

test('even if the bootstrap stack is in a rollback state, can still retry bootstrapping it', async () => {
  mockCloudFormationClient
    .on(DescribeStacksCommand)
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.UPDATE_ROLLBACK_COMPLETE,
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
            { OutputKey: 'BucketDomainName', OutputValue: 'aws.com' },
          ],
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.UPDATE_ROLLBACK_COMPLETE,
          StackStatusReason: 'It is magic',
          Outputs: [
            { OutputKey: 'BucketName', OutputValue: 'bucket' },
            { OutputKey: 'BucketDomainName', OutputValue: 'aws.com' },
          ],
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.CREATE_COMPLETE,
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    });

  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'MagicalStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(GetTemplateCommand, {
    StackName: 'MagicalStack',
  });
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
});

test('even if the bootstrap stack failed to create, can still retry bootstrapping it', async () => {
  mockCloudFormationClient
    .on(DescribeStacksCommand)
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.ROLLBACK_COMPLETE,
          StackStatusReason: 'It is magic',
          Outputs: [{ OutputKey: 'BucketName', OutputValue: 'bucket' }],
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.ROLLBACK_COMPLETE,
          StackStatusReason: 'It is magic',
          Outputs: [{ OutputKey: 'BucketName', OutputValue: 'bucket' }],
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    })
    .resolvesOnce({
      Stacks: [],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackStatus: StackStatus.CREATE_COMPLETE,
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    });

  // WHEN
  const ret = await bootstrapper.bootstrapEnvironment(env, sdk, { toolkitStackName: 'MagicalStack' });

  // THEN
  const bucketProperties = changeSetTemplate.Resources.StagingBucket.Properties;
  expect(bucketProperties.BucketName).toBeUndefined();
  expect(
    bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
  ).toBeUndefined();
  expect(ret.noOp).toBeFalsy();
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(DeleteStackCommand, {
    StackName: 'MagicalStack',
  });
});

test('stack is not termination protected by default', async () => {
  // WHEN
  // Seems silly, but we process the template multiple times to get the templateBody that goes into the call
  await bootstrapper.bootstrapEnvironment(env, sdk);

  // THEN
  // There are only two ways that termination can be set: either through calling CreateStackCommand
  // or by calling UpdateTerminationProtectionCommand, which is not done by default
  expect(mockCloudFormationClient).not.toHaveReceivedCommand(CreateStackCommand);
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(CreateChangeSetCommand, {
    StackName: 'CDKToolkit',
    ChangeSetType: 'CREATE',
    ClientToken: expect.any(String),
    Description: expect.any(String),
    Parameters: [],
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'],
    ChangeSetName: changeSetName,
    TemplateBody: templateBody,
  });
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
  expect(mockCloudFormationClient).not.toHaveReceivedCommandWith(UpdateTerminationProtectionCommand, {
    EnableTerminationProtection: true,
    StackName: 'CDKToolkit',
  });
});

test('stack is termination protected when set', async () => {
  // WHEN
  await bootstrapper.bootstrapEnvironment(env, sdk, {
    terminationProtection: true,
  });

  // THEN
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ExecuteChangeSetCommand, {
    ChangeSetName: changeSetName,
  });
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(UpdateTerminationProtectionCommand, {
    EnableTerminationProtection: true,
    StackName: 'CDKToolkit',
  });
});

test('do showTemplate YAML', async () => {
  process.stdout.write = jest.fn().mockImplementationOnce((template) => {
    // THEN
    expect(parse(template)).toHaveProperty(
      'Description',
      'The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.',
    );
  });

  // WHEN
  await bootstrapper.showTemplate(false);
});

test('do showTemplate JSON', async () => {
  process.stdout.write = jest.fn().mockImplementationOnce((template) => {
    // THEN
    expect(JSON.parse(template)).toHaveProperty(
      'Description',
      'The CDK Toolkit Stack. It was created by `cdk bootstrap` and manages resources necessary for managing your Cloud Applications with AWS CDK.',
    );
  });

  // WHEN
  await bootstrapper.showTemplate(true);
});
