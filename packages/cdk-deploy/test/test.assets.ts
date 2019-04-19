import { AssetMetadataEntry, ContainerImageAssetMetadataEntry, SynthesizedStack } from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { Uploaded, UploadProps } from '../lib/api/toolkit-info';
import { prepareAssets } from '../lib/assets';

export = {
  async 'prepare assets'(test: Test) {
    // GIVEN
    const stack: SynthesizedStack = {
      name: 'SomeStack',
      environment: {
        name: 'myenv',
        account: 'myaccount',
        region: 'myregion'
      },
      metadata: {
        '/SomeStack/SomeResource': [{
          type: 'aws:cdk:asset',
          data: {
            path: __filename,
            id: 'SomeStackSomeResource4567',
            packaging: 'file',
            s3BucketParameter: 'BucketParameter',
            s3KeyParameter: 'KeyParameter'
          } as AssetMetadataEntry,
          trace: []
        }]
      },
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something::Something'
          }
        }
      }
    };
    const toolkit = new FakeToolkit();

    // WHEN
    const params = await prepareAssets(stack, toolkit as any);

    // THEN
    test.deepEqual(params, [
      { ParameterKey: 'BucketParameter', ParameterValue: 'bucket' },
      { ParameterKey: 'KeyParameter', ParameterValue: 'assets/SomeStackSomeResource4567/||12345.js' },
    ]);

    test.done();
  },

  async 'prepare assets with reuse'(test: Test) {
    // GIVEN
    const stack: SynthesizedStack = {
      name: 'SomeStack',
      environment: {
        name: 'myenv',
        account: 'myaccount',
        region: 'myregion'
      },
      metadata: {
        '/SomeStack/SomeResource': [{
          type: 'aws:cdk:asset',
          data: {
            path: __filename,
            id: 'SomeStackSomeResource4567',
            packaging: 'file',
            s3BucketParameter: 'BucketParameter',
            s3KeyParameter: 'KeyParameter'
          } as AssetMetadataEntry,
          trace: []
        }]
      },
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something::Something'
          }
        }
      }
    };
    const toolkit = new FakeToolkit();

    // WHEN
    const params = await prepareAssets(stack, toolkit as any, undefined, ['SomeStackSomeResource4567']);

    // THEN
    test.deepEqual(params, [
      { ParameterKey: 'BucketParameter', UsePreviousValue: true },
      { ParameterKey: 'KeyParameter', UsePreviousValue: true },
    ]);

    test.done();
  },

  async 'prepare container asset with reuse'(test: Test) {
    // GIVEN
    const stack: SynthesizedStack = {
      name: 'SomeStack',
      environment: { name: 'myenv', account: 'myaccount', region: 'myregion' },
      metadata: {
        '/SomeStack/SomeResource': [{
          type: 'aws:cdk:asset',
          data: {
            path: __dirname,
            id: 'SomeStackSomeResource4567',
            packaging: 'container-image',
            imageNameParameter: 'asdf'
          } as ContainerImageAssetMetadataEntry,
          trace: []
        }]
      },
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something::Something'
          }
        }
      }
    };
    const toolkit = new FakeToolkit();

    // WHEN
    const params = await prepareAssets(stack, toolkit as any, undefined, ['SomeStackSomeResource4567']);

    // THEN
    test.deepEqual(params, [
      { ParameterKey: 'asdf', UsePreviousValue: true },
    ]);

    test.done();
  }
};

class FakeToolkit {
  public bucketUrl: string = 'https://bucket';
  public bucketName: string = 'bucket';

  public async uploadIfChanged(_data: any, props: UploadProps): Promise<Uploaded> {
    const filename = `12345${props.s3KeySuffix}`;
    return {
      filename,
      changed: true,
      key: `${props.s3KeyPrefix}${filename}`
    };
  }
}
