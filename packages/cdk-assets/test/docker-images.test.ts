jest.mock('child_process');

import { AssetManifest } from '@aws-cdk/cx-api';
import * as mockfs from 'mock-fs';
import { AssetPublishing } from '../lib';
import { mockAws, mockedApiFailure, mockedApiResult } from './mock-aws';
import { mockSpawn } from './mock-child_process';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: 'assets-1.0',
      assets: {
        theAsset: {
          type: 'docker-image',
          source: {
            directory: 'dockerdir'
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'abcdef',
              imageUri: '12345.amazonaws.com/repo:abcdef',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/dockerdir/Dockerfile': 'FROM scratch',
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

test('pass destination properties to AWS client', async () => {
  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out'), throwOnError: false });

  await pub.publish();

  expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

describe('with a complete manifest', () => {
  let pub: AssetPublishing;
  beforeEach(() => {
    pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out') });
  });

  test('Do nothing if docker image already exists', async () => {
    aws.mockEcr.describeImages = mockedApiResult({ /* No error == image exists */ });

    await pub.publish();

    expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
      imageIds: [{imageTag: 'abcdef'}],
      repositoryName: 'repo'
    }));
  });

  test('upload docker image if not uploaded yet but exists locally', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' }
      ]
    });

    mockSpawn(
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'] },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
      );

    await pub.publish();
  });

  test('build and upload docker image if not exists anywhere', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' }
      ]
    });

    mockSpawn(
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '/simple/cdk.out/dockerdir'] },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
    );

    await pub.publish();
  });
});