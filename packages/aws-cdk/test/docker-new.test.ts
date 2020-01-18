import * as cxapi from '@aws-cdk/cx-api';
import * as sinon from 'sinon';
import { ToolkitInfo } from '../lib';
import { prepareContainerAsset } from '../lib/docker';
import * as os from '../lib/os';
import { MockSDK } from './util/mock-sdk';

test('fails if "repositoryName" and "imageTag" are not specified', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    sourceHash: '0123456789abcdef',
  };

  // THEN
  await expect(prepareContainerAsset('.', asset, toolkit, false))
    .rejects.toEqual(new Error(`invalid docker image asset configuration\. "repositoryName" and "imageTag" are required and "imageNameParameter" is not allowed`));
});

test('fails if "repositoryName" is not specified', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    repositoryName: 'repository-name',
    packaging: 'container-image',
    path: '/foo',
    sourceHash: '0123456789abcdef',
  };

  // THEN
  await expect(prepareContainerAsset('.', asset, toolkit, false))
    .rejects.toEqual(new Error(`invalid docker image asset configuration\. "repositoryName" and "imageTag" are required and "imageNameParameter" is not allowed`));
});

test('creates repository with given name', async () => {
  // GIVEN
  const sdk = new MockSDK();
  const toolkit = newMockToolkitInfo(sdk);
  let createdName;

  sdk.stubEcr({
    describeRepositories: () => ({ repositories: [] }),
    createRepository: req => {
      createdName = req.repositoryName;

      // Stop the test so that we don't actually docker build
      throw new Error('STOPTEST');
    },
  });

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    repositoryName: 'some-name',
    imageTag: 'image-tag',
    sourceHash: '0123456789abcdef',
  };

  try {
    await prepareContainerAsset('.', asset, toolkit, false);
  } catch (e) {
    if (!/STOPTEST/.test(e.toString())) { throw e; }
  }

  // THEN
  expect(createdName).toBe('some-name');
});

test('configures image scanning', async () => {
  // GIVEN
  let putImageScanningConfigurationParams;

  const sdk = new MockSDK();
  sdk.stubEcr({
    describeRepositories: () => ({ repositories: [] }),
    createRepository: () => ({ repository: { repositoryUri: 'uri' } }),
    putImageScanningConfiguration: params => {
      putImageScanningConfigurationParams = params;

      // Stop the test so that we don't actually docker build
      throw new Error('STOPTEST');
    }
  });

  const toolkit = newMockToolkitInfo(sdk);

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
    sourceHash: '0123456789abcdef',
  };

  try {
    await prepareContainerAsset('.', asset, toolkit, false);
  } catch (e) {
    if (!/STOPTEST/.test(e.toString())) { throw e; }
  }

  expect(putImageScanningConfigurationParams).toEqual({
    repositoryName: 'some-name',
    imageScanningConfiguration: {
      scanOnPush: true
    }
  });
});

test('passes the correct target to docker build', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();

  const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({ repositoryUri: 'uri' });
  const checkEcrImageStub = sinon.stub(toolkit, 'checkEcrImage').resolves(false);
  const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    sourceHash: '1234567890abcdef',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
    buildArgs: {
      a: 'b',
      c: 'd'
    },
    target: 'a-target',
  };

  try {
    await prepareContainerAsset('.', asset, toolkit, false);
  } catch (e) {
    if (!/STOPTEST/.test(e.toString())) { throw e; }
  }

  // THEN
  const command = [ 'docker', 'build', '--tag', `uri:some-tag`, '--target', 'a-target', '--build-arg', 'a=b', '--build-arg', 'c=d', '/foo' ];
  sinon.assert.calledWith(shellStub, command);

  prepareEcrRepositoryStub.restore();
  shellStub.restore();
  checkEcrImageStub.restore();
});

test('passes the correct args to docker build', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();

  const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({ repositoryUri: 'uri' });
  const checkEcrImageStub = sinon.stub(toolkit, 'checkEcrImage').resolves(false);
  const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    sourceHash: '1234567890abcdef',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
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
  const command = ['docker', 'build', '--tag', `uri:some-tag`, '--build-arg', 'a=b', '--build-arg', 'c=d', '/foo'];
  sinon.assert.calledWith(shellStub, command);

  prepareEcrRepositoryStub.restore();
  checkEcrImageStub.restore();
  shellStub.restore();
});

test('passes the correct docker file name if specified', async () => {
  const toolkit = newMockToolkitInfo();
  const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({ repositoryUri: 'uri' });
  const checkEcrImageStub = sinon.stub(toolkit, 'checkEcrImage').resolves(false);
  const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: '/foo',
    sourceHash: '1234567890abcdef',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
    file: 'CustomDockerfile',
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
  const command = ['docker', 'build', '--tag', `uri:some-tag`, '--file', '/foo/CustomDockerfile', '--build-arg', 'a=b', '--build-arg', 'c=d', '/foo'];
  sinon.assert.calledWith(shellStub, command);

  prepareEcrRepositoryStub.restore();
  checkEcrImageStub.restore();
  shellStub.restore();
});

test('relative path', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();
  const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository').resolves({ repositoryUri: 'uri' });
  const checkEcrImageStub = sinon.stub(toolkit, 'checkEcrImage').resolves(false);
  const shellStub = sinon.stub(os, 'shell').rejects('STOPTEST');

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: 'relative-to-assembly',
    sourceHash: '1234567890abcdef',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
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
  const command = ['docker', 'build', '--tag', `uri:some-tag`, '--build-arg', 'a=b', '--build-arg', 'c=d', '/assembly/dir/root/relative-to-assembly'];
  sinon.assert.calledWith(shellStub, command);

  prepareEcrRepositoryStub.restore();
  checkEcrImageStub.restore();
  shellStub.restore();
});

test('skips build & push if image already exists in the ECR repo', async () => {
  // GIVEN
  const toolkit = newMockToolkitInfo();
  const prepareEcrRepositoryStub = sinon.stub(toolkit, 'prepareEcrRepository');
  const shellStub = sinon.stub(os, 'shell');
  const checkEcrImageStub = sinon.stub(toolkit, 'checkEcrImage').resolves(true);

  // WHEN
  const asset: cxapi.ContainerImageAssetMetadataEntry = {
    id: 'assetId',
    packaging: 'container-image',
    path: 'relative-to-assembly',
    sourceHash: '1234567890abcdef',
    repositoryName: 'some-name',
    imageTag: 'some-tag',
    buildArgs: {
      a: 'b',
      c: 'd'
    }
  };

  await prepareContainerAsset('/assembly/dir/root', asset, toolkit, false);

  // THEN
  sinon.assert.calledOnce(prepareEcrRepositoryStub);
  sinon.assert.calledOnce(checkEcrImageStub);
  sinon.assert.notCalled(shellStub);
});

function newMockToolkitInfo(sdk: MockSDK = new MockSDK()) {
  return new ToolkitInfo({
    sdk,
    bucketName: 'BUCKET_NAME',
    bucketEndpoint: 'BUCKET_ENDPOINT',
    environment: { name: 'env', account: '1234', region: 'abc' }
  });
}