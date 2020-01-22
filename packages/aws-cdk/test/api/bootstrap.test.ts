import { CreateChangeSetInput } from 'aws-sdk/clients/cloudformation';
import { bootstrapEnvironment } from '../../lib';
import { fromYAML } from '../../lib/serialize';
import { MockSDK } from '../util/mock-sdk';

test('do bootstrap', async () => {
  // GIVEN
  const sdk = new MockSDK();

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
  const ret = await bootstrapEnvironment({
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  }, sdk, 'mockStack', undefined);

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('do bootstrap using custom bucket name', async () => {
  // GIVEN
  const sdk = new MockSDK();

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
  const ret = await bootstrapEnvironment({
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  }, sdk, 'mockStack', undefined, {
    bucketName: 'foobar',
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
test('do bootstrap using KMS CMK', async () => {
  // GIVEN
  const sdk = new MockSDK();

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
  const ret = await bootstrapEnvironment({
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  }, sdk, 'mockStack', undefined, {
    kmsKeyId: 'myKmsKey',
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
test('do bootstrap with custom tags for toolkit stack', async () => {
  // GIVEN
  const sdk = new MockSDK();

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
  const ret = await bootstrapEnvironment({
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  }, sdk, 'mockStack', undefined, {
    tags: [{ Key: 'Foo', Value: 'Bar' }]
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});
