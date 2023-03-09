import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { toCloudFormation } from './util';
import { App, FileAssetPackaging, Stack } from '../lib';

describe('assets', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    stack = new Stack(app);
  });

  test('addFileAsset correctly sets metadata and creates S3 parameters', () => {
    // WHEN
    stack.synthesizer.addFileAsset({
      fileName: 'file-name',
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      sourceHash: 'source-hash',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    expect(assetMetadata && assetMetadata.data).toBeDefined();

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.AssetMetadataEntry;
      expect(data.path).toEqual('file-name');
      expect(data.id).toEqual('source-hash');
      expect(data.packaging).toEqual(FileAssetPackaging.ZIP_DIRECTORY);
      expect(data.sourceHash).toEqual('source-hash');
    }

    expect(toCloudFormation(stack)).toEqual({
      Parameters: {
        AssetParameterssourcehashS3BucketE6E91E3E: {
          Type: 'String',
          Description: 'S3 bucket for asset "source-hash"',
        },
        AssetParameterssourcehashS3VersionKeyAC4157C3: {
          Type: 'String',
          Description: 'S3 key for asset version "source-hash"',
        },
        AssetParameterssourcehashArtifactHashADBAE418: {
          Type: 'String',
          Description: 'Artifact hash for asset "source-hash"',
        },
      },
    });
  });

  test('addFileAsset correctly sets object urls', () => {
    // WHEN
    const assetLocation = stack.synthesizer.addFileAsset({
      fileName: 'file-name',
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      sourceHash: 'source-hash',
    });

    // THEN
    const expectedS3UrlPrefix = 's3://';
    const expectedHttpUrlPrefix = `https://s3.${stack.region}.${stack.urlSuffix}/`;

    expect(
      assetLocation.s3ObjectUrl.replace(expectedS3UrlPrefix, '')).toEqual(
      assetLocation.httpUrl.replace(expectedHttpUrlPrefix, ''),
    );
  });

  test('addDockerImageAsset correctly sets metadata', () => {
    // WHEN
    stack.synthesizer.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    expect(assetMetadata && assetMetadata.data).toBeDefined();

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      expect(data.packaging).toEqual('container-image');
      expect(data.path).toEqual('directory-name');
      expect(data.sourceHash).toEqual('source-hash');
      expect(data.imageTag).toEqual('source-hash');
    }

    expect(toCloudFormation(stack)).toEqual({ });

  });

  test('addDockerImageAsset uses the default repository name', () => {
    // WHEN
    stack.synthesizer.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    expect(assetMetadata && assetMetadata.data).toBeDefined();

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      expect(data.packaging).toEqual('container-image');
      expect(data.path).toEqual('directory-name');
      expect(data.sourceHash).toEqual('source-hash');
      expect(data.imageTag).toEqual('source-hash');
    }

    expect(toCloudFormation(stack)).toEqual({ });

  });

  test('addDockerImageAsset supports overriding repository name through a context key as a workaround until we have API for that', () => {
    stack.node.setContext('assets-ecr-repository-name', 'my-custom-repo-name');

    // WHEN
    stack.synthesizer.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    expect(assetMetadata && assetMetadata.data).toBeDefined();

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      expect(data.packaging).toEqual('container-image');
      expect(data.path).toEqual('directory-name');
      expect(data.sourceHash).toEqual('source-hash');
      expect(data.repositoryName).toEqual('my-custom-repo-name');
      expect(data.imageTag).toEqual('source-hash');
    }

    expect(toCloudFormation(stack)).toEqual({ });

  });
});
