/* eslint-disable import/order */
import { AssetMetadataEntry } from '@aws-cdk/cloud-assembly-schema';
import { testStack, withMocked } from './util';
import { addMetadataAssetsToManifest } from '../lib/assets';
import { AssetManifestBuilder } from '../lib/util/asset-manifest-builder';
import { EnvironmentResources, EnvironmentResourcesRegistry } from '../lib/api/environment-resources';
import { MockSdk } from './util/mock-sdk';
import { MockToolkitInfo } from './util/mock-toolkitinfo';

let assets: AssetManifestBuilder;
let envRegistry: EnvironmentResourcesRegistry;
let envResources: EnvironmentResources;
let toolkitMock: ReturnType<typeof MockToolkitInfo.setup>;
beforeEach(() => {
  assets = new AssetManifestBuilder();
  envRegistry = new EnvironmentResourcesRegistry();

  const sdk = new MockSdk();
  envResources = envRegistry.for({ account: '11111111', region: 'us-nowhere', name: 'aws://11111111/us-nowhere' }, sdk);
  toolkitMock = MockToolkitInfo.setup();
});

afterEach(() => {
  toolkitMock.dispose();
});

describe('file assets', () => {
  test('convert to manifest and parameters', async () => {
    // GIVEN
    const ext = __filename.match(/\.([tj]s)$/)?.[1];
    const stack = stackWithAssets([
      {
        sourceHash: 'source-hash',
        path: __filename,
        id: 'SomeStackSomeResource4567',
        packaging: 'file',
        s3BucketParameter: 'BucketParameter',
        s3KeyParameter: 'KeyParameter',
        artifactHashParameter: 'ArtifactHashParameter',
      },
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, envResources);

    // THEN
    expect(params).toEqual({
      BucketParameter: 'MockToolkitBucketName',
      KeyParameter: `assets/SomeStackSomeResource4567/||source-hash.${ext}`,
      ArtifactHashParameter: 'source-hash',
    });

    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        destination: {
          bucketName: 'MockToolkitBucketName',
          objectKey: `assets/SomeStackSomeResource4567/source-hash.${ext}`,
        },
        source: {
          packaging: 'file',
          path: __filename,
        },
      }),
    ]);
  });

  test('hash and ID the same => only one path component', async () => {
    // GIVEN
    const ext = __filename.match(/\.([tj]s)$/)?.[1];
    const stack = stackWithAssets([
      {
        sourceHash: 'source-hash',
        path: __filename,
        id: 'source-hash',
        packaging: 'file',
        s3BucketParameter: 'BucketParameter',
        s3KeyParameter: 'KeyParameter',
        artifactHashParameter: 'ArtifactHashParameter',
      },
    ]);

    // WHEN
    await addMetadataAssetsToManifest(stack, assets, envResources);

    // THEN
    expect(assets.toManifest('.').entries).toEqual([
      expect.objectContaining({
        destination: {
          bucketName: 'MockToolkitBucketName',
          objectKey: `assets/source-hash.${ext}`,
        },
      }),
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
        sourceHash: 'boom',
      },
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, envResources, ['SomeStackSomeResource4567']);

    // THEN
    expect(params).toEqual({
    });

    expect(assets.toManifest('.').entries).toEqual([]);
  });
});

describe('docker assets', () => {
  test('parameter and no repository name (old)', async () => {
    await withMocked(envResources, 'prepareEcrRepository', async () => {
      // GIVEN
      const stack = stackWithAssets([
        {
          id: 'Stack:Construct/ABC123',
          imageNameParameter: 'MyParameter',
          packaging: 'container-image',
          path: '/foo',
          sourceHash: '0123456789abcdef',
        },
      ]);
      mockFn(envResources.prepareEcrRepository).mockResolvedValue({ repositoryUri: 'docker.uri' });

      // WHEN
      const params = await addMetadataAssetsToManifest(stack, assets, envResources);

      // THEN
      expect(envResources.prepareEcrRepository).toHaveBeenCalledWith('cdk/stack-construct-abc123');
      expect(params).toEqual({
        MyParameter: 'docker.uri:0123456789abcdef',
      });
      expect(assets.toManifest('.').entries).toEqual([
        expect.objectContaining({
          type: 'docker-image',
          destination: {
            imageTag: '0123456789abcdef',
            repositoryName: 'cdk/stack-construct-abc123',
          },
          source: {
            directory: '/foo',
          },
        }),
      ]);
    });
  });

  test('if parameter is left out then repo and tag are required', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        id: 'Stack:Construct/ABC123',
        packaging: 'container-image',
        path: '/foo',
        sourceHash: '0123456789abcdef',
      },
    ]);

    await expect(addMetadataAssetsToManifest(stack, assets, envResources)).rejects.toThrow('Invalid Docker image asset');
  });

  test('no parameter and repo/tag name (new)', async () => {
    await withMocked(envResources, 'prepareEcrRepository', async () => {
      // GIVEN
      const stack = stackWithAssets([
        {
          id: 'Stack:Construct/ABC123',
          repositoryName: 'reponame',
          imageTag: '12345',
          packaging: 'container-image',
          path: '/foo',
          sourceHash: '0123456789abcdef',
        },
      ]);
      mockFn(envResources.prepareEcrRepository).mockResolvedValue({ repositoryUri: 'docker.uri' });

      // WHEN
      const params = await addMetadataAssetsToManifest(stack, assets, envResources);

      // THEN
      expect(envResources.prepareEcrRepository).toHaveBeenCalledWith('reponame');
      expect(params).toEqual({}); // No parameters!
      expect(assets.toManifest('.').entries).toEqual([
        expect.objectContaining({
          type: 'docker-image',
          destination: {
            imageTag: '12345',
            repositoryName: 'reponame',
          },
          source: {
            directory: '/foo',
          },
        }),
      ]);
    });
  });

  test('reuse', async () => {
    // GIVEN
    const stack = stackWithAssets([
      {
        path: __dirname,
        id: 'SomeStackSomeResource4567',
        packaging: 'container-image',
        imageNameParameter: 'asdf',
        sourceHash: 'source-hash',
      },
    ]);

    // WHEN
    const params = await addMetadataAssetsToManifest(stack, assets, envResources, ['SomeStackSomeResource4567']);

    // THEN
    expect(params).toEqual({
    });

    expect(assets.toManifest('.').entries).toEqual([]);
  });
});

function stackWithAssets(assetEntries: AssetMetadataEntry[]) {
  return testStack({
    stackName: 'SomeStack',
    assets: assetEntries,
    template: {
      Resources: {
        SomeResource: {
          Type: 'AWS::Something::Something',
        },
      },
    },
  });
}

function mockFn<F extends (...xs: any[]) => any>(fn: F): jest.Mock<ReturnType<F>> {
  if (!jest.isMockFunction(fn)) {
    throw new Error(`Not a mock function: ${fn}`);
  }
  return fn;
}
