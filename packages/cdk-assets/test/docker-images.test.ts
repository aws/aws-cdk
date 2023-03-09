jest.mock('child_process');

import * as fs from 'fs';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { mockAws, mockedApiFailure, mockedApiResult } from './mock-aws';
import { mockSpawn } from './mock-child_process';
import { AssetManifest, AssetPublishing } from '../lib';
import * as dockercreds from '../lib/private/docker-credentials';


let aws: ReturnType<typeof mockAws>;
const absoluteDockerPath = '/simple/cdk.out/dockerdir';
beforeEach(() => {
  jest.resetAllMocks();
  delete(process.env.CDK_DOCKER);

  // By default, assume no externally-configured credentials.
  jest.spyOn(dockercreds, 'cdkCredentialsConfig').mockReturnValue(undefined);

  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
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
    '/multi/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset1: {
          source: {
            directory: 'dockerdir',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'theAsset1',
            },
          },
        },
        theAsset2: {
          source: {
            directory: 'dockerdir',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'theAsset2',
            },
          },
        },
      },
    }),
    '/external/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theExternalAsset: {
          source: {
            executable: ['sometool'],
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'ghijkl',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/dockerdir/Dockerfile': 'FROM scratch',
    '/abs/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
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
    '/default-network/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
            networkMode: 'default',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'nopqr',
            },
          },
        },
      },
    }),
    '/default-network/cdk.out/dockerdir/Dockerfile': 'FROM scratch',
    '/platform-arm64/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
            platform: 'linux/arm64',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'nopqr',
            },
          },
        },
      },
    }),
    '/cache/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
            cacheFrom: [{ type: 'registry', params: { ref: 'abcdef' } }],
            cacheTo: { type: 'inline' },
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'nopqr',
            },
          },
        },
      },
    }),
    '/cache-from-multiple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
            cacheFrom: [
              { type: 'registry', params: { ref: 'cache:ref' } },
              { type: 'registry', params: { ref: 'cache:main' } },
              { type: 'gha' },
            ],
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'nopqr',
            },
          },
        },
      },
    }),
    '/cache-to-complex/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      dockerImages: {
        theAsset: {
          source: {
            directory: 'dockerdir',
            cacheTo: { type: 'registry', params: { ref: 'cache:main', mode: 'max', compression: 'zstd' } },
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              repositoryName: 'repo',
              imageTag: 'nopqr',
            },
          },
        },
      },
    }),
    '/platform-arm64/cdk.out/dockerdir/Dockerfile': 'FROM scratch',
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
      imageIds: [{ imageTag: 'abcdef' }],
      repositoryName: 'repo',
    }));
  });

  test('Displays an error if the ECR repository cannot be found', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('RepositoryNotFoundException', 'Repository not Found');

    await expect(pub.publish()).rejects.toThrow('Error building and publishing: Repository not Found');
  });

  test('successful run does not need to query account ID', async () => {
    aws.mockEcr.describeImages = mockedApiResult({ /* No error == image exists */ });
    await pub.publish();
    expect(aws.discoverCurrentAccount).not.toHaveBeenCalled();
  });

  test('upload docker image if not uploaded yet but exists locally', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'] },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build and upload docker image if not exists anywhere', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build with networkMode option', async () => {
    pub = new AssetPublishing(AssetManifest.fromPath('/default-network/cdk.out'), { aws });
    const defaultNetworkDockerpath = '/default-network/cdk.out/dockerdir';
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--network', 'default', '.'], cwd: defaultNetworkDockerpath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build with platform option', async () => {
    pub = new AssetPublishing(AssetManifest.fromPath('/platform-arm64/cdk.out'), { aws });
    const defaultNetworkDockerpath = '/platform-arm64/cdk.out/dockerdir';
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--platform', 'linux/arm64', '.'], cwd: defaultNetworkDockerpath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build with cache option', async () => {
    pub = new AssetPublishing(AssetManifest.fromPath('/cache/cdk.out'), { aws });
    const defaultNetworkDockerpath = '/cache/cdk.out/dockerdir';
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--cache-from', 'type=registry,ref=abcdef', '--cache-to', 'type=inline', '.'], cwd: defaultNetworkDockerpath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build with multiple cache from option', async () => {
    pub = new AssetPublishing(AssetManifest.fromPath('/cache-from-multiple/cdk.out'), { aws });
    const defaultNetworkDockerpath = '/cache-from-multiple/cdk.out/dockerdir';
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      {
        commandLine: [
          'docker', 'build', '--tag', 'cdkasset-theasset', '--cache-from', 'type=registry,ref=cache:ref', '--cache-from', 'type=registry,ref=cache:main', '--cache-from', 'type=gha', '.',
        ],
        cwd: defaultNetworkDockerpath,
      },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });

  test('build with cache to complex option', async () => {
    pub = new AssetPublishing(AssetManifest.fromPath('/cache-to-complex/cdk.out'), { aws });
    const defaultNetworkDockerpath = '/cache-to-complex/cdk.out/dockerdir';
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
      { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--cache-to', 'type=registry,ref=cache:main,mode=max,compression=zstd', '.'], cwd: defaultNetworkDockerpath },
      { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] },
    );

    await pub.publish();

    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  });
});

describe('external assets', () => {
  let pub: AssetPublishing;
  const externalTag = 'external:tag';
  beforeEach(() => {
    pub = new AssetPublishing(AssetManifest.fromPath('/external/cdk.out'), { aws });
  });

  test('upload externally generated Docker image', async () => {
    aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = mockedApiResult({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
      ],
    });

    const expectAllSpawns = mockSpawn(
      { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
      { commandLine: ['sometool'], stdout: externalTag, cwd: '/external/cdk.out' },
      { commandLine: ['docker', 'tag', externalTag, '12345.amazonaws.com/repo:ghijkl'] },
      { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:ghijkl'] },
    );

    await pub.publish();

    expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
      region: 'us-north-50',
      assumeRoleArn: 'arn:aws:role',
    }));
    expectAllSpawns();
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

  const expectAllSpawns = mockSpawn(
    // Only care about the 'build' command line
    { commandLine: ['docker', 'login'], prefix: true },
    { commandLine: ['docker', 'inspect'], exitCode: 1, prefix: true },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath },
    { commandLine: ['docker', 'tag'], prefix: true },
    { commandLine: ['docker', 'push'], prefix: true },
  );

  await pub.publish();

  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
  expectAllSpawns();
});

test('when external credentials are present, explicit Docker config directories are used', async () => {
  // Setup -- Mock that we have CDK credentials, and mock fs operations.
  jest.spyOn(dockercreds, 'cdkCredentialsConfig').mockReturnValue({ version: '0.1', domainCredentials: {} });
  jest.spyOn(fs, 'mkdtempSync').mockImplementationOnce(() => '/tmp/mockedTempDir');
  jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn());

  let pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });
  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  const expectAllSpawns = mockSpawn(
    // Initally use the first created directory with the CDK credentials
    { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'inspect', 'cdkasset-theasset'], exitCode: 1 },
    { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath },
    { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
    // Prior to push, revert to the default config directory
    { commandLine: ['docker', 'login'], prefix: true },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] },
  );

  await pub.publish();

  expectAllSpawns();
});

test('logging in only once for two assets', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/multi/cdk.out'), { aws, throwOnError: false });
  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  const expectAllSpawns = mockSpawn(
    { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/repo:theAsset1'] },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:theAsset1'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12345.amazonaws.com/repo:theAsset2'] },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:theAsset2'] },
  );

  await pub.publish();

  expectAllSpawns();
  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});

test('logging in twice for two repository domains (containing account id & region)', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/multi/cdk.out'), { aws, throwOnError: false });
  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');

  let repoIdx = 12345;
  aws.mockEcr.describeRepositories = jest.fn().mockReturnValue({
    promise: jest.fn().mockImplementation(() => Promise.resolve({
      repositories: [
        // Usually looks like: 012345678910.dkr.ecr.us-west-2.amazonaws.com/aws-cdk/assets
        { repositoryUri: `${repoIdx++}.amazonaws.com/aws-cdk/assets` },
      ],
    })),
  });

  let proxyIdx = 12345;
  aws.mockEcr.getAuthorizationToken = jest.fn().mockReturnValue({
    promise: jest.fn().mockImplementation(() => Promise.resolve({
      authorizationData: [
        { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: `https://${proxyIdx++}.proxy.com/` },
      ],
    })),
  });

  const expectAllSpawns = mockSpawn(
    { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://12345.proxy.com/'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] },
    { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://12346.proxy.com/'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12346.amazonaws.com/aws-cdk/assets:theAsset2'] },
    { commandLine: ['docker', 'push', '12346.amazonaws.com/aws-cdk/assets:theAsset2'] },
  );

  await pub.publish();

  expectAllSpawns();
  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});

test('building only', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/multi/cdk.out'), {
    aws,
    throwOnError: false,
    buildAssets: true,
    publishAssets: false,
  });

  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  const expectAllSpawns = mockSpawn(
    { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/repo:theAsset1'] },
    { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 },
    { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' },
    { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12345.amazonaws.com/repo:theAsset2'] },
  );

  await pub.publish();

  expectAllSpawns();
  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});

test('publishing only', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/multi/cdk.out'), {
    aws,
    throwOnError: false,
    buildAssets: false,
    publishAssets: true,
  });

  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  const expectAllSpawns = mockSpawn(
    { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] },
    { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset2'] },
  );

  await pub.publish();

  expectAllSpawns();
  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});

test('overriding the docker command', async () => {
  process.env.CDK_DOCKER = 'custom';

  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });

  aws.mockEcr.describeImages = mockedApiFailure('ImageNotFoundException', 'File does not exist');
  aws.mockEcr.getAuthorizationToken = mockedApiResult({
    authorizationData: [
      { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
    ],
  });

  const expectAllSpawns = mockSpawn(
    { commandLine: ['custom', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] },
    { commandLine: ['custom', 'inspect', 'cdkasset-theasset'] },
    { commandLine: ['custom', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] },
    { commandLine: ['custom', 'push', '12345.amazonaws.com/repo:abcdef'] },
  );

  await pub.publish();

  expectAllSpawns();
  expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
