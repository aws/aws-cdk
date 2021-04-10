import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { FileAssetPackaging, Stack } from '../lib';
import { toCloudFormation } from './util';

nodeunitShim({
  'addFileAsset correctly sets metadata and creates S3 parameters'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.addFileAsset({
      fileName: 'file-name',
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      sourceHash: 'source-hash',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    test.ok(assetMetadata && assetMetadata.data);

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.AssetMetadataEntry;
      test.equal(data.path, 'file-name');
      test.equal(data.id, 'source-hash');
      test.equal(data.packaging, FileAssetPackaging.ZIP_DIRECTORY);
      test.equal(data.sourceHash, 'source-hash');
    }

    test.deepEqual(toCloudFormation(stack), {
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

    test.done();
  },

  'addFileAsset correctly sets object urls'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const assetLocation = stack.addFileAsset({
      fileName: 'file-name',
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      sourceHash: 'source-hash',
    });

    // THEN
    const expectedS3UrlPrefix = 's3://';
    const expectedHttpUrlPrefix = `https://s3.${stack.region}.${stack.urlSuffix}/`;

    test.equal(
      assetLocation.s3ObjectUrl.replace(expectedS3UrlPrefix, ''),
      assetLocation.httpUrl.replace(expectedHttpUrlPrefix, ''),
    );

    test.done();
  },

  'addDockerImageAsset correctly sets metadata'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
      repositoryName: 'repository-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    test.ok(assetMetadata && assetMetadata.data);

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      test.equal(data.packaging, 'container-image');
      test.equal(data.path, 'directory-name');
      test.equal(data.sourceHash, 'source-hash');
      test.equal(data.repositoryName, 'repository-name');
      test.equal(data.imageTag, 'source-hash');
    }

    test.deepEqual(toCloudFormation(stack), { });
    test.done();
  },

  'addDockerImageAsset uses the default repository name'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    test.ok(assetMetadata && assetMetadata.data);

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      test.equal(data.packaging, 'container-image');
      test.equal(data.path, 'directory-name');
      test.equal(data.sourceHash, 'source-hash');
      test.equal(data.repositoryName, 'aws-cdk/assets');
      test.equal(data.imageTag, 'source-hash');
    }

    test.deepEqual(toCloudFormation(stack), { });
    test.done();
  },

  'addDockerImageAsset supports overriding repository name through a context key as a workaround until we have API for that'(test: Test) {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext('assets-ecr-repository-name', 'my-custom-repo-name');

    // WHEN
    stack.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxschema.ArtifactMetadataEntryType.ASSET);

    test.ok(assetMetadata && assetMetadata.data);

    if (assetMetadata && assetMetadata.data) {
      const data = assetMetadata.data as cxschema.ContainerImageAssetMetadataEntry;
      test.equal(data.packaging, 'container-image');
      test.equal(data.path, 'directory-name');
      test.equal(data.sourceHash, 'source-hash');
      test.equal(data.repositoryName, 'my-custom-repo-name');
      test.equal(data.imageTag, 'source-hash');
    }

    test.deepEqual(toCloudFormation(stack), { });
    test.done();
  },
});
