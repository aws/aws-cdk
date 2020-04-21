jest.mock('child_process');

import { AssetManifestSchema } from '@aws-cdk/cdk-assets-schema';
import * as mockfs from 'mock-fs';
import { AssetManifest, AssetPublishing } from '../lib';
import { mockAws, mockedApiFailure, mockedApiResult } from './mock-aws';
import { mockSpawn } from './mock-child_process';

let aws: ReturnType<typeof mockAws>;
const absoluteDockerPath = '/simple/cdk.out/dockerdir';
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: AssetManifestSchema.currentVersion(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'abcdef',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/dockerdir/Dockerfile': 'FROM scratch',
    '/abs/cdk.out/assets.json': JSON.stringify({
      version: AssetManifestSchema.currentVersion(),
      dockerImages: {
        theAsset: {
          source: {
            directory: absoluteDockerPath,
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'abcdef',
            },
          },
        },
      },
    }),
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

test('pass destination properties to AWS client', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });

  await pub.publish();

  expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

describe('with a complete manifest', () => {
  let pub: AssetPublishing;
  beforeEach(() => {
    pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });
  });

  test('Do nothing if docker image already exists', async () => {
    aws.mockEcr.describeImages = mockedApiResult({ /* No error == image exists */ });

    await pub.publish();

    expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
      imageIds: [{imageTag: 'abcdef'}],
      repositoryName: 'repo',
    }));
  });

  test('upload docker image if not uploaded yet but exists locally', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'] },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
    );

    await pub.publish();
  });

  test('build and upload docker image if not exists anywhere', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
    );

    await pub.publish();
  });
});

test('correctly identify Docker directory if path is absolute', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/abs/cdk.out'), { aws });

  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  mockSpawn(
    // Only care about the 'build' command line
    { commandLine: ['docker', 'login'], prefix: true },
    { commandLine: ['docker', 'inspect'], exitCode: 1, prefix: true },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath },
    { commandLine: ['docker', 'tag'], prefix: true },
    { commandLine: ['docker', 'push'], prefix: true },
  );

  await pub.publish();
});
