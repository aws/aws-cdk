import { CreateChangeSetInput } from 'aws-sdk/clients/cloudformation';
import { Test } from 'nodeunit';
import { bootstrapEnvironment } from '../../lib';
import { fromYAML } from '../../lib/serialize';
import { MockSDK } from '../util/mock-sdk';

export = {
  async 'do bootstrap'(test: Test) {
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
        test.equals(bucketProperties.BucketName, undefined, 'Expected BucketName to be undefined');
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
    }, sdk, 'mockStack', undefined, {tags: undefined});

    // THEN
    test.equals(ret.noOp, false);
    test.equals(executed, true);

    test.done();
  },
  async 'do bootstrap using custom bucket name'(test: Test) {
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
        test.equals(bucketProperties.BucketName, 'foobar', 'Expected BucketName to be foobar');
        test.equals(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
          undefined, 'Expected KMSMasterKeyID to be undefined');
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
      bucketName: 'foobar', tags: undefined
    });

    // THEN
    test.equals(ret.noOp, false);
    test.equals(executed, true);

    test.done();
  },
  async 'do bootstrap using KMS CMK'(test: Test) {
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
        test.equals(bucketProperties.BucketName, undefined, 'Expected BucketName to be undefined');
        test.equals(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
          'myKmsKey', 'Expected KMSMasterKeyID to be myKmsKey');
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
      kmsKeyId: 'myKmsKey', tags: undefined
    });

    // THEN
    test.equals(ret.noOp, false);
    test.equals(executed, true);

    test.done();
  },
  async 'do bootstrap using tags'(test: Test) {
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
        test.equals(bucketProperties.BucketName, undefined, 'Expected BucketName to be undefined');
        test.equals(bucketProperties.BucketEncryption.ServerSideEncryptionConfiguration[0].ServerSideEncryptionByDefault.KMSMasterKeyID,
            'myKmsKey', 'Expected KMSMasterKeyID to be myKmsKey');
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
      kmsKeyId: 'myKmsKey', tags: [{ Key: 'Foo', Value: 'Bar' }]
    });

    // THEN
    test.equals(ret.noOp, false);
    test.equals(executed, true);

    test.done();
  },
};
