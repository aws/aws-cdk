import cxapi = require('@aws-cdk/cx-api');
import { MockSDK } from '@aws-cdk/toolchain-common/test/util/mock-sdk';
import { Test } from 'nodeunit';
import { ToolkitInfo } from '../lib/api/toolkit-info';
import { prepareContainerAsset } from '../lib/docker';

export = {
  async 'creates repository with given name'(test: Test) {
    // GIVEN

    let createdName;

    const sdk = new MockSDK();
    sdk.stubEcr({
      describeRepositories() {
        return { repositories: [] };
      },

      createRepository(req) {
        createdName = req.repositoryName;

        // Stop the test so that we don't actually docker build
        throw new Error('STOPTEST');
      },
    });

    const toolkit = new ToolkitInfo({
      sdk,
      bucketName: 'BUCKET_NAME',
      bucketEndpoint: 'BUCKET_ENDPOINT',
      environment: { name: 'env', account: '1234', region: 'abc' }
    });

    // WHEN
    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      id: 'assetId',
      imageNameParameter: 'MyParameter',
      packaging: 'container-image',
      path: '/foo',
      repositoryName: 'some-name',
    };

    try {
      await prepareContainerAsset(asset, toolkit, false);
    } catch (e) {
      if (!/STOPTEST/.test(e.toString())) { throw e; }
    }

    // THEN
    test.deepEqual(createdName, 'some-name');

    test.done();
  },
};