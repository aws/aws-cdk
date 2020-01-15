import { Uploaded, UploadProps } from '../lib';
import { prepareAssets } from '../lib/assets';
import { testAssembly, testStack } from './util';

test('prepare assets', async () => {
  // GIVEN
  const assembly = testAssembly({
    stacks: [{
      stackName: 'SomeStack',
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something::Something'
          }
        }
      },
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
      ]
    }]
  });

  const toolkit = new FakeToolkit();

  // WHEN
  const params = await prepareAssets(assembly.getStackByName('SomeStack'), toolkit as any);

  // THEN
  expect(params).toEqual([
    { ParameterKey: 'BucketParameter', ParameterValue: 'bucket' },
    { ParameterKey: 'KeyParameter', ParameterValue: 'assets/SomeStackSomeResource4567/||12345.ts' },
    { ParameterKey: 'ArtifactHashParameter', ParameterValue: '12345' },
  ]);
});

test('prepare assets with reuse', async () => {
  // GIVEN
  const stack = testStack({
    stackName: 'SomeStack',
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
    template: {
      Resources: {
        SomeResource: {
          Type: 'AWS::Something::Something'
        }
      }
    }
  });
  const toolkit = new FakeToolkit();

  // WHEN
  const params = await prepareAssets(stack, toolkit as any, undefined, ['SomeStackSomeResource4567']);

  // THEN
  expect(params).toEqual([
    { ParameterKey: 'BucketParameter', UsePreviousValue: true },
    { ParameterKey: 'KeyParameter', UsePreviousValue: true },
    { ParameterKey: 'ArtifactHashParameter', UsePreviousValue: true },
  ]);
});

test('prepare container asset with reuse', async () => {
  // GIVEN
  const stack = testStack({
    stackName: 'SomeStack',
    assets: [
      {
        path: __dirname,
        id: 'SomeStackSomeResource4567',
        packaging: 'container-image',
        imageNameParameter: 'asdf',
        sourceHash: 'source-hash'
      }
    ],
    template: {
      Resources: {
        SomeResource: {
          Type: 'AWS::Something::Something'
        }
      }
    }
  });
  const toolkit = new FakeToolkit();

  // WHEN
  const params = await prepareAssets(stack, toolkit as any, undefined, ['SomeStackSomeResource4567']);

  // THEN
  expect(params).toEqual([
    { ParameterKey: 'asdf', UsePreviousValue: true },
  ]);
});

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
