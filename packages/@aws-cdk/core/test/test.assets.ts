import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { FileAssetPackaging, Stack } from '../lib';
import { toCloudFormation } from './util';

export = {
  'addFileAsset correctly sets metadata and creates S3 parameters'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.addFileAsset({
      fileName: 'file-name',
      packaging: FileAssetPackaging.ZIP_DIRECTORY,
      sourceHash: 'source-hash'
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxapi.ASSET_METADATA);

    test.equal(assetMetadata && assetMetadata.data.path, 'file-name');
    test.equal(assetMetadata && assetMetadata.data.id, 'source-hash');
    test.equal(assetMetadata && assetMetadata.data.packaging, FileAssetPackaging.ZIP_DIRECTORY);
    test.equal(assetMetadata && assetMetadata.data.sourceHash, 'source-hash');

    test.deepEqual(toCloudFormation(stack), {
      Parameters: {
        AssetParameterssourcehashS3BucketE6E91E3E: {
          Type: 'String',
          Description: 'S3 bucket for asset "source-hash"'
        },
        AssetParameterssourcehashS3VersionKeyAC4157C3: {
          Type: 'String',
          Description: 'S3 key for asset version "source-hash"'
        },
        AssetParameterssourcehashArtifactHashADBAE418: {
          Type: 'String',
          Description: 'Artifact hash for asset "source-hash"'
        }
      }
    });

    test.done();

  },

  'addDockerImageAsset correctly sets metadata and creates an ECR parameter'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    stack.addDockerImageAsset({
      sourceHash: 'source-hash',
      directoryName: 'directory-name',
      repositoryName: 'repository-name'
    });

    // THEN
    const assetMetadata = stack.node.metadata.find(({ type }) => type === cxapi.ASSET_METADATA);

    test.equal(assetMetadata && assetMetadata.data.packaging, 'container-image');
    test.equal(assetMetadata && assetMetadata.data.path, 'directory-name');
    test.equal(assetMetadata && assetMetadata.data.sourceHash, 'source-hash');
    test.equal(assetMetadata && assetMetadata.data.repositoryName, 'repository-name');

    test.deepEqual(toCloudFormation(stack), {
      Parameters: {
        AssetParameterssourcehashImageName3B572B12: {
          Type: 'String',
          Description: 'ECR repository name and tag for asset "source-hash"'
        }
      }
    });

    test.done();
  },
};
