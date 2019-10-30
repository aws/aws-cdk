import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import sinon = require('sinon');
import { ToolkitInfo } from '../lib';
import { prepareContainerAsset } from '../lib/docker';
import os = require('../lib/os');
import { MockSDK } from './util/mock-sdk';

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
      sourceHash: '0123456789abcdef',
    };

    try {
      await prepareContainerAsset('.', asset, toolkit, false);
    } catch (e) {
      if (!/STOPTEST/.test(e.toString())) { throw e; }
    }

    // THEN
    test.deepEqual(createdName, 'some-name');

    test.done();
  },

  async 'passes the correct target to docker build'(test: Test) {
    // GIVEN
    const toolkit = new ToolkitInfo({
      sdk: new MockSDK(),
      bucketName: 'BUCKET_NAME',
      bucketEndpoint: 'BUCKET_ENDPOINT',
      environment: { name: 'env', account: '1234', region: 'abc' }
    });

    const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({
      repositoryUri: 'uri',
      repositoryName: 'name'
    });

    const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

    // WHEN
    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      id: 'assetId',
      imageNameParameter: 'MyParameter',
      packaging: 'container-image',
      path: '/foo',
      sourceHash: '1234567890abcdefa-target',
      repositoryName: 'some-name',
      buildArgs: {
        a: 'b',
        c: 'd'
      },
      target: 'a-target',
    };

    try {
      await prepareContainerAsset('.', asset, toolkit, false, false);
    } catch (e) {
      if (!/STOPTEST/.test(e.toString())) { throw e; }
    }

    // THEN
    const command = ['docker', 'build', '--build-arg', 'a=b', '--build-arg', 'c=d', '--tag', `uri:latest`, '/foo', '--target', 'a-target'];
    test.ok(shellStub.calledWith(command));

    prepareEcrRepositoryStub.restore();
    shellStub.restore();
    test.done();
  },

  async 'passes the correct args to docker build'(test: Test) {
    // GIVEN
    const toolkit = new ToolkitInfo({
      sdk: new MockSDK(),
      bucketName: 'BUCKET_NAME',
      bucketEndpoint: 'BUCKET_ENDPOINT',
      environment: { name: 'env', account: '1234', region: 'abc' }
    });

    const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({
      repositoryUri: 'uri',
      repositoryName: 'name'
    });

    const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

    // WHEN
    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      id: 'assetId',
      imageNameParameter: 'MyParameter',
      packaging: 'container-image',
      path: '/foo',
      sourceHash: '1234567890abcdef',
      repositoryName: 'some-name',
      buildArgs: {
        a: 'b',
        c: 'd'
      }
    };

    try {
      await prepareContainerAsset('.', asset, toolkit, false);
    } catch (e) {
      if (!/STOPTEST/.test(e.toString())) { throw e; }
    }

    // THEN
    const command = ['docker', 'build', '--build-arg', 'a=b', '--build-arg', 'c=d', '--tag', `uri:latest`, '/foo'];
    test.ok(shellStub.calledWith(command));

    prepareEcrRepositoryStub.restore();
    shellStub.restore();
    test.done();
  },

  async 'relative path'(test: Test) {
    // GIVEN
    const toolkit = new ToolkitInfo({
      sdk: new MockSDK(),
      bucketName: 'BUCKET_NAME',
      bucketEndpoint: 'BUCKET_ENDPOINT',
      environment: { name: 'env', account: '1234', region: 'abc' }
    });

    const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({
      repositoryUri: 'uri',
      repositoryName: 'name'
    });

    const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

    // WHEN
    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      id: 'assetId',
      imageNameParameter: 'MyParameter',
      packaging: 'container-image',
      path: 'relative-to-assembly',
      sourceHash: '1234567890abcdef',
      repositoryName: 'some-name',
      buildArgs: {
        a: 'b',
        c: 'd'
      }
    };

    try {
      await prepareContainerAsset('/assembly/dir/root', asset, toolkit, false);
    } catch (e) {
      if (!/STOPTEST/.test(e.toString())) { throw e; }
    }

    // THEN
    const command = ['docker', 'build', '--build-arg', 'a=b', '--build-arg', 'c=d', '--tag', `uri:latest`, '/assembly/dir/root/relative-to-assembly'];
    test.ok(shellStub.calledWith(command));

    prepareEcrRepositoryStub.restore();
    shellStub.restore();
    test.done();
  }
};
