import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { Uploaded, UploadProps } from '../lib';
import { prepareAssets } from '../lib/assets';

export = {
  async 'prepare assets'(test: Test) {
    // GIVEN
    const stack: cxapi.ICloudFormationStackArtifact = {
      id: 'SomeStack',
      originalName: 'SomeStack',
      assets: [
        {
          sourceHash: 'source-hash',
          path: __filename,
          id: 'SomeStackSomeResource4567',
          packaging: 'file',
          s3BucketParameter: 'BucketParameter',
          s3KeyParameter: 'KeyParameter',
          artifactHashParameter: 'ArtifactHashParameter',
        }
      ],
      logicalIdToPathMap: { },
      missing: { },
      autoDeploy: true,
      depends: [],
      messages: [],
      name: 'SomeStack',
      environment: {
        name: 'myenv',
        account: 'myaccount',
        region: 'myregion'
      },
      metadata: { },
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
      { ParameterKey: 'ArtifactHashParameter', ParameterValue: '12345' },
    ]);

    test.done();
  },

  async 'prepare assets with reuse'(test: Test) {
    // GIVEN
    const stack: cxapi.ICloudFormationStackArtifact = {
      id: 'SomeStack',
      name: 'SomeStack',
      originalName: 'SomeStack',
      assets: [
        {
          path: __filename,
          id: 'SomeStackSomeResource4567',
          packaging: 'file',
          s3BucketParameter: 'BucketParameter',
          s3KeyParameter: 'KeyParameter',
          artifactHashParameter: 'ArtifactHashParameter',
          sourceHash: 'boom'
        }
      ],
      logicalIdToPathMap: { },
      missing: { },
      autoDeploy: true,
      depends: [],
      messages: [],
      environment: {
        name: 'myenv',
        account: 'myaccount',
        region: 'myregion'
      },
      metadata: { },
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
      { ParameterKey: 'ArtifactHashParameter', UsePreviousValue: true },
    ]);

    test.done();
  },

  async 'prepare container asset with reuse'(test: Test) {
    // GIVEN
    const stack: cxapi.ICloudFormationStackArtifact = {
      id: 'SomeStack',
      name: 'SomeStack',
      originalName: 'SomeStack',
      assets: [
        {
          path: __dirname,
          id: 'SomeStackSomeResource4567',
          packaging: 'container-image',
          imageNameParameter: 'asdf',
          sourceHash: 'source-hash'
        }
      ],
      logicalIdToPathMap: { },
      missing: { },
      autoDeploy: true,
      depends: [],
      messages: [],
      environment: { name: 'myenv', account: 'myaccount', region: 'myregion' },
      metadata: { },
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
      key: `${props.s3KeyPrefix}${filename}`,
      hash: '12345',
      changed: true,
    };
  }
}
