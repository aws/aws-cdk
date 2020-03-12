import { CreateChangeSetInput } from 'aws-sdk/clients/cloudformation';
import { bootstrapEnvironment } from '../../lib';
import { fromYAML } from '../../lib/serialize';
import { MockSdkProvider } from '../util/mock-sdk';

const env = {
  account: '123456789012',
  region: 'us-east-1',
  name: 'mock',
};

test('do bootstrap', async () => {
  // GIVEN
  const sdk = new MockSdkProvider();

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(info: CreateChangeSetInput) {
      const template = fromYAML(info.TemplateBody as string);
      const bucketProperties = template.Resources.StagingBucket.Properties;
      expect(bucketProperties.BucketName).toBeUndefined();
      expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
        .toBeUndefined();
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined);

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using custom bucket name', async () => {
  // GIVEN
  const sdk = new MockSdkProvider();

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(info: CreateChangeSetInput) {
      const template = fromYAML(info.TemplateBody as string);
      const bucketProperties = template.Resources.StagingBucket.Properties;
      expect(bucketProperties.BucketName).toBe('foobar');
      expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
        .toBeUndefined();
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    bucketName: 'foobar',
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
test('do bootstrap using KMS CMK', async () => {
  // GIVEN
  const sdk = new MockSdkProvider();

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(info: CreateChangeSetInput) {
      const template = fromYAML(info.TemplateBody as string);
      const bucketProperties = template.Resources.StagingBucket.Properties;
      expect(bucketProperties.BucketName).toBeUndefined();
      expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
        .toBe('myKmsKey');
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    kmsKeyId: 'myKmsKey',
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
test('do bootstrap with custom tags for toolkit stack', async () => {
  // GIVEN
  const sdk = new MockSdkProvider();

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(info: CreateChangeSetInput) {
      const template = fromYAML(info.TemplateBody as string);
      const bucketProperties = template.Resources.StagingBucket.Properties;
      expect(bucketProperties.BucketName).toBeUndefined();
      expect(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID)
        .toBeUndefined();
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    tags: [{ Key: 'Foo', Value: 'Bar' }]
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('passing trusted accounts to the old bootstrapping results in an error', async () => {
  const sdk = new MockSdkProvider();

  await expect(bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    trustedAccounts: ['0123456789012'],
  }))
  .rejects
  .toThrow('--trust can only be passed for the new bootstrap experience!');
});

test('passing CFN execution policies to the old bootstrapping results in an error', async () => {
  const sdk = new MockSdkProvider();

  await expect(bootstrapEnvironment(env, sdk, 'mockStack', undefined, {
    cloudFormationExecutionPolicies: ['arn:aws:iam::aws:policy/AdministratorAccess'],
  }))
  .rejects
  .toThrow('--cloudformation-execution-policies can only be passed for the new bootstrap experience!');
});
