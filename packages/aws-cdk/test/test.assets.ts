import { AssetMetadataEntry } from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { Uploaded, UploadProps } from '../lib';
import { prepareAssets } from '../lib/assets';

export = {
  async 'prepare assets'(test: Test) {
  // GIVEN
  const stack = {
    name: 'SomeStack',
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
