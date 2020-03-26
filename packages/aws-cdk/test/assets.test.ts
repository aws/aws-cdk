import { AssetMetadataEntry } from '@aws-cdk/cx-api';
import { AssetManifest } from 'cdk-assets';
import { ToolkitInfo } from '../lib';
import { addMetadataAssetsToManifest } from '../lib/assets';
import { AssetManifestBuilder } from '../lib/util/asset-manifest-builder';
import { publishAssets } from '../lib/util/asset-publishing';
import { testStack } from './util';
import { MockSDK } from './util/mock-sdk';

let toolkit: ToolkitInfo;
let assets: AssetManifestBuilder;
beforeEach(() => {
  toolkit = {
    bucketUrl: 'https://bucket',
    bucketName: 'bucket',
    prepareEcrRepository: jest.fn(),
  } as any;
  assets = new AssetManifestBuilder();
});

describe('file assets', () => {
  test('convert to manifest and parameters', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        sourceHash: 'source-hash',
        path: __filename,
        id: 'SomeStackSomeResource4567',
        packaging: 'file',
        s3BucketParameter: 'BucketParameter',
        s3KeyParameter: 'KeyParameter',
        artifactHashParameter: 'ArtifactHashParameter',
      }
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, toolkit);

    // THEN
    expect(params).toEqual([
      { ParameterKey: 'BucketParameter', ParameterValue: 'bucket' },
      { ParameterKey: 'KeyParameter', ParameterValue: 'assets/SomeStackSomeResource4567/||source-hash.js' },
      { ParameterKey: 'ArtifactHashParameter', ParameterValue: 'source-hash' },
    ]);

    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        destination: {
          bucketName: "bucket",
          objectKey: "assets/SomeStackSomeResource4567/source-hash.js",
        },
        source: {
          packaging: "file",
          path: __filename,
        },
      })
    ]);
  });

  test('hash and ID the same => only one path component', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        sourceHash: 'source-hash',
        path: __filename,
        id: 'source-hash',
        packaging: 'file',
        s3BucketParameter: 'BucketParameter',
        s3KeyParameter: 'KeyParameter',
        artifactHashParameter: 'ArtifactHashParameter',
      }
    ]);

    // WHEN
    await addMetadataAssetsToManifest(stack, assets, toolkit);

    // THEN
    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        destination: {
          bucketName: 'bucket',
          objectKey: "assets/source-hash.js",
        },
      })
    ]);
  });

  test('reuse', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        path: __filename,
        id: 'SomeStackSomeResource4567',
        packaging: 'file',
        s3BucketParameter: 'BucketParameter',
        s3KeyParameter: 'KeyParameter',
        artifactHashParameter: 'ArtifactHashParameter',
        sourceHash: 'boom'
      }
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, toolkit, ['SomeStackSomeResource4567']);

    // THEN
    expect(params).toEqual([
      { ParameterKey: 'BucketParameter', UsePreviousValue: true },
      { ParameterKey: 'KeyParameter', UsePreviousValue: true },
      { ParameterKey: 'ArtifactHashParameter', UsePreviousValue: true },
    ]);

    expect(assets.toManifest('.').entries).toEqual([]);
  });
});

describe('docker assets', () => {
  test('parameter and no repository name (old)', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        id: 'Stack:Construct/ABC123',
        imageNameParameter: 'MyParameter',
        packaging: 'container-image',
        path: '/foo',
        sourceHash: '0123456789abcdef',
      }
    ]);
    mockFn(toolkit.prepareEcrRepository).mockResolvedValue({ repositoryUri: 'docker.uri' });

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, toolkit);

    // THEN
    expect(toolkit.prepareEcrRepository).toHaveBeenCalledWith('cdk/stack-construct-abc123');
    expect(params).toEqual([
      { ParameterKey: 'MyParameter', ParameterValue: 'docker.uri:0123456789abcdef' },
    ]);
    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        type: "docker-image",
        destination: {
          imageTag: "0123456789abcdef",
          repositoryName: "cdk/stack-construct-abc123",
        },
        source: {
          directory: "/foo",
        },
      })
    ]);
  });

  test('if parameter is left out then repo and tag are required', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        id: 'Stack:Construct/ABC123',
        packaging: 'container-image',
        path: '/foo',
        sourceHash: '0123456789abcdef',
      }
    ]);

    await expect(addMetadataAssetsToManifest(stack, assets, toolkit)).rejects.toThrow('Invalid Docker image asset');
  });

  test('no parameter and repo/tag name (new)', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        id: 'Stack:Construct/ABC123',
        repositoryName: 'reponame',
        imageTag: '12345',
        packaging: 'container-image',
        path: '/foo',
        sourceHash: '0123456789abcdef',
      }
    ]);
    mockFn(toolkit.prepareEcrRepository).mockResolvedValue({ repositoryUri: 'docker.uri' });

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, toolkit);

    // THEN
    expect(toolkit.prepareEcrRepository).toHaveBeenCalledWith('reponame');
    expect(params).toEqual([]); // No parameters!
    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        type: "docker-image",
        destination: {
          imageTag: "12345",
          repositoryName: "reponame",
        },
        source: {
          directory: "/foo",
        },
      })
    ]);
  });

  test('reuse', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        path: __dirname,
        id: 'SomeStackSomeResource4567',
        packaging: 'container-image',
        imageNameParameter: 'asdf',
        sourceHash: 'source-hash'
      }
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, toolkit, ['SomeStackSomeResource4567']);

    // THEN
    expect(params).toEqual([
      { ParameterKey: 'asdf', UsePreviousValue: true },
    ]);

    expect(assets.toManifest('.').entries).toEqual([]);
  });
});

test('publishing does not fail if there is no "default" account', () => {
  // GIVEN
  const manifest = new AssetManifest('.', {
    version: '0',
    files: {
      assetId: {
        source: { path: __filename },
        destinations: {
          theDestination: {
            bucketName: '${AWS::AccountId}-bucket',
            objectKey: 'key',
          },
        }
      },
    },
  });
  const provider = new MockSDK();
  provider.defaultAccount = jest.fn(() => Promise.resolve(undefined));

  // WHEN
  publishAssets(manifest, provider, { account: '12345678', region: 'aa-south-1', name: 'main' });
});

function stackWithAssets(assetEntries: AssetMetadataEntry[]) {
  return testStack({
    stackName: 'SomeStack',
    assets: assetEntries,
    template: {
      Resources: {
        SomeResource: {
          Type: 'AWS::Something::Something'
        }
      }
    }
  });
}

function mockFn<F extends (...xs: any[]) => any>(fn: F): jest.Mock<ReturnType<F>> {
  if (!jest.isMockFunction(fn)) {
    throw new Error(`Not a mock function: ${fn}`);
  }
  return fn;
}