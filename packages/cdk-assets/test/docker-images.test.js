"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('child_process');
const fs = require("fs");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const mockfs = require("mock-fs");
const mock_aws_1 = require("./mock-aws");
const mock_child_process_1 = require("./mock-child_process");
const lib_1 = require("../lib");
const dockercreds = require("../lib/private/docker-credentials");
let aws;
const absoluteDockerPath = '/simple/cdk.out/dockerdir';
beforeEach(() => {
    jest.resetAllMocks();
    delete (process.env.CDK_DOCKER);
    // By default, assume no externally-configured credentials.
    jest.spyOn(dockercreds, 'cdkCredentialsConfig').mockReturnValue(undefined);
    mockfs({
        '/simple/cdk.out/assets.json': JSON.stringify({
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
            version: cloud_assembly_schema_1.Manifest.version(),
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
        '/nocache/cdk.out/assets.json': JSON.stringify({
            version: cloud_assembly_schema_1.Manifest.version(),
            dockerImages: {
                theAsset: {
                    source: {
                        directory: 'dockerdir',
                        cacheDisabled: true,
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
    aws = (0, mock_aws_1.mockAws)();
});
afterEach(() => {
    mockfs.restore();
});
test('pass destination properties to AWS client', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });
    await pub.publish();
    expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
        region: 'us-north-50',
        assumeRoleArn: 'arn:aws:role',
    }));
});
describe('with a complete manifest', () => {
    let pub;
    beforeEach(() => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws });
    });
    test('Do nothing if docker image already exists', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiResult)({ /* No error == image exists */});
        await pub.publish();
        expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
            imageIds: [{ imageTag: 'abcdef' }],
            repositoryName: 'repo',
        }));
    });
    test('Displays an error if the ECR repository cannot be found', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('RepositoryNotFoundException', 'Repository not Found');
        await expect(pub.publish()).rejects.toThrow('Error publishing: Repository not Found');
    });
    test('successful run does not need to query account ID', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiResult)({ /* No error == image exists */});
        await pub.publish();
        expect(aws.discoverCurrentAccount).not.toHaveBeenCalled();
    });
    test('upload docker image if not uploaded yet but exists locally', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'] }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build and upload docker image if not exists anywhere', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with networkMode option', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/default-network/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/default-network/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--network', 'default', '.'], cwd: defaultNetworkDockerpath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with platform option', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/platform-arm64/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/platform-arm64/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--platform', 'linux/arm64', '.'], cwd: defaultNetworkDockerpath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with cache option', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/cache/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/cache/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--cache-from', 'type=registry,ref=abcdef', '--cache-to', 'type=inline', '.'], cwd: defaultNetworkDockerpath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with cache disabled', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/nocache/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/nocache/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--no-cache', '.'], cwd: defaultNetworkDockerpath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with multiple cache from option', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/cache-from-multiple/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/cache-from-multiple/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, {
            commandLine: [
                'docker', 'build', '--tag', 'cdkasset-theasset', '--cache-from', 'type=registry,ref=cache:ref', '--cache-from', 'type=registry,ref=cache:main', '--cache-from', 'type=gha', '.',
            ],
            cwd: defaultNetworkDockerpath,
        }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
    test('build with cache to complex option', async () => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/cache-to-complex/cdk.out'), { aws });
        const defaultNetworkDockerpath = '/cache-to-complex/cdk.out/dockerdir';
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '--cache-to', 'type=registry,ref=cache:main,mode=max,compression=zstd', '.'], cwd: defaultNetworkDockerpath }, { commandLine: ['docker', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:nopqr'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:nopqr'] });
        await pub.publish();
        expectAllSpawns();
        expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    });
});
describe('external assets', () => {
    let pub;
    const externalTag = 'external:tag';
    beforeEach(() => {
        pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/external/cdk.out'), { aws });
    });
    test('upload externally generated Docker image', async () => {
        aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
        aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
            authorizationData: [
                { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
            ],
        });
        const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['sometool'], stdout: externalTag, cwd: '/external/cdk.out' }, { commandLine: ['docker', 'tag', externalTag, '12345.amazonaws.com/repo:ghijkl'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:ghijkl'] });
        await pub.publish();
        expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
            region: 'us-north-50',
            assumeRoleArn: 'arn:aws:role',
        }));
        expectAllSpawns();
    });
});
test('correctly identify Docker directory if path is absolute', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/abs/cdk.out'), { aws });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)(
    // Only care about the 'build' command line
    { commandLine: ['docker', 'login'], prefix: true }, { commandLine: ['docker', 'inspect'], exitCode: 1, prefix: true }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath }, { commandLine: ['docker', 'tag'], prefix: true }, { commandLine: ['docker', 'push'], prefix: true });
    await pub.publish();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
    expectAllSpawns();
});
test('when external credentials are present, explicit Docker config directories are used', async () => {
    // Setup -- Mock that we have CDK credentials, and mock fs operations.
    jest.spyOn(dockercreds, 'cdkCredentialsConfig').mockReturnValue({ version: '0.1', domainCredentials: {} });
    jest.spyOn(fs, 'mkdtempSync').mockImplementationOnce(() => '/tmp/mockedTempDir');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn());
    let pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)(
    // Initally use the first created directory with the CDK credentials
    { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'inspect', 'cdkasset-theasset'], exitCode: 1 }, { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'build', '--tag', 'cdkasset-theasset', '.'], cwd: absoluteDockerPath }, { commandLine: ['docker', '--config', '/tmp/mockedTempDir', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] }, 
    // Prior to push, revert to the default config directory
    { commandLine: ['docker', 'login'], prefix: true }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:abcdef'] });
    await pub.publish();
    expectAllSpawns();
});
test('logging in only once for two assets', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/multi/cdk.out'), { aws, throwOnError: false });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/repo:theAsset1'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:theAsset1'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12345.amazonaws.com/repo:theAsset2'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/repo:theAsset2'] });
    await pub.publish();
    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
test('logging in twice for two repository domains (containing account id & region)', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/multi/cdk.out'), { aws, throwOnError: false });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
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
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://12345.proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] }, { commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://12346.proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12346.amazonaws.com/aws-cdk/assets:theAsset2'] }, { commandLine: ['docker', 'push', '12346.amazonaws.com/aws-cdk/assets:theAsset2'] });
    await pub.publish();
    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
test('building only', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/multi/cdk.out'), {
        aws,
        throwOnError: false,
        buildAssets: true,
        publishAssets: false,
    });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset1'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset1', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset1', '12345.amazonaws.com/repo:theAsset1'] }, { commandLine: ['docker', 'inspect', 'cdkasset-theasset2'], exitCode: 1 }, { commandLine: ['docker', 'build', '--tag', 'cdkasset-theasset2', '.'], cwd: '/multi/cdk.out/dockerdir' }, { commandLine: ['docker', 'tag', 'cdkasset-theasset2', '12345.amazonaws.com/repo:theAsset2'] });
    await pub.publish();
    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
test('publishing only', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/multi/cdk.out'), {
        aws,
        throwOnError: false,
        buildAssets: false,
        publishAssets: true,
    });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['docker', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset1'] }, { commandLine: ['docker', 'push', '12345.amazonaws.com/aws-cdk/assets:theAsset2'] });
    await pub.publish();
    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
test('overriding the docker command', async () => {
    process.env.CDK_DOCKER = 'custom';
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiFailure)('ImageNotFoundException', 'File does not exist');
    aws.mockEcr.getAuthorizationToken = (0, mock_aws_1.mockedApiResult)({
        authorizationData: [
            { authorizationToken: 'dXNlcjpwYXNz', proxyEndpoint: 'https://proxy.com/' },
        ],
    });
    const expectAllSpawns = (0, mock_child_process_1.mockSpawn)({ commandLine: ['custom', 'login', '--username', 'user', '--password-stdin', 'https://proxy.com/'] }, { commandLine: ['custom', 'inspect', 'cdkasset-theasset'] }, { commandLine: ['custom', 'tag', 'cdkasset-theasset', '12345.amazonaws.com/repo:abcdef'] }, { commandLine: ['custom', 'push', '12345.amazonaws.com/repo:abcdef'] });
    await pub.publish();
    expectAllSpawns();
    expect(true).toBeTruthy(); // Expect no exception, satisfy linter
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLWltYWdlcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9ja2VyLWltYWdlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUUzQix5QkFBeUI7QUFDekIsMEVBQTBEO0FBQzFELGtDQUFrQztBQUNsQyx5Q0FBd0U7QUFDeEUsNkRBQWlEO0FBQ2pELGdDQUF3RDtBQUN4RCxpRUFBaUU7QUFFakUsSUFBSSxHQUErQixDQUFDO0FBQ3BDLE1BQU0sa0JBQWtCLEdBQUcsMkJBQTJCLENBQUM7QUFDdkQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQixPQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUvQiwyREFBMkQ7SUFDM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFM0UsTUFBTSxDQUFDO1FBQ0wsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUM1QyxPQUFPLEVBQUUsZ0NBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsWUFBWSxFQUFFO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUU7d0JBQ04sU0FBUyxFQUFFLFdBQVc7cUJBQ3ZCO29CQUNELFlBQVksRUFBRTt3QkFDWixjQUFjLEVBQUU7NEJBQ2QsTUFBTSxFQUFFLGFBQWE7NEJBQ3JCLGFBQWEsRUFBRSxjQUFjOzRCQUM3QixjQUFjLEVBQUUsTUFBTTs0QkFDdEIsUUFBUSxFQUFFLFFBQVE7eUJBQ25CO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO1FBQ0YsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUMzQyxPQUFPLEVBQUUsZ0NBQVEsQ0FBQyxPQUFPLEVBQUU7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QUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUV6RyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxJQUFBLDJCQUFnQixFQUFDLHdCQUF3QixFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDL0YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxJQUFBLDBCQUFlLEVBQUM7UUFDbEQsaUJBQWlCLEVBQUU7WUFDakIsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFO1NBQzVFO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxlQUFlLEdBQUcsSUFBQSw4QkFBUyxFQUMvQixFQUFFLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxFQUFFLEVBQ3BHLEVBQUUsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLEVBQzNELEVBQUUsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxpQ0FBaUMsQ0FBQyxFQUFFLEVBQzFGLEVBQUUsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxpQ0FBaUMsQ0FBQyxFQUFFLENBQ3ZFLENBQUM7SUFFRixNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVwQixlQUFlLEVBQUUsQ0FBQztJQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxzQ0FBc0M7QUFDbkUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJqZXN0Lm1vY2soJ2NoaWxkX3Byb2Nlc3MnKTtcblxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgTWFuaWZlc3QgfSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgbW9ja2ZzIGZyb20gJ21vY2stZnMnO1xuaW1wb3J0IHsgbW9ja0F3cywgbW9ja2VkQXBpRmFpbHVyZSwgbW9ja2VkQXBpUmVzdWx0IH0gZnJvbSAnLi9tb2NrLWF3cyc7XG5pbXBvcnQgeyBtb2NrU3Bhd24gfSBmcm9tICcuL21vY2stY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyBBc3NldE1hbmlmZXN0LCBBc3NldFB1Ymxpc2hpbmcgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgZG9ja2VyY3JlZHMgZnJvbSAnLi4vbGliL3ByaXZhdGUvZG9ja2VyLWNyZWRlbnRpYWxzJztcblxubGV0IGF3czogUmV0dXJuVHlwZTx0eXBlb2YgbW9ja0F3cz47XG5jb25zdCBhYnNvbHV0ZURvY2tlclBhdGggPSAnL3NpbXBsZS9jZGsub3V0L2RvY2tlcmRpcic7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgamVzdC5yZXNldEFsbE1vY2tzKCk7XG4gIGRlbGV0ZShwcm9jZXNzLmVudi5DREtfRE9DS0VSKTtcblxuICAvLyBCeSBkZWZhdWx0LCBhc3N1bWUgbm8gZXh0ZXJuYWxseS1jb25maWd1cmVkIGNyZWRlbnRpYWxzLlxuICBqZXN0LnNweU9uKGRvY2tlcmNyZWRzLCAnY2RrQ3JlZGVudGlhbHNDb25maWcnKS5tb2NrUmV0dXJuVmFsdWUodW5kZWZpbmVkKTtcblxuICBtb2NrZnMoe1xuICAgICcvc2ltcGxlL2Nkay5vdXQvYXNzZXRzLmpzb24nOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBkb2NrZXJJbWFnZXM6IHtcbiAgICAgICAgdGhlQXNzZXQ6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGRpcmVjdG9yeTogJ2RvY2tlcmRpcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAnYWJjZGVmJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9tdWx0aS9jZGsub3V0L2Fzc2V0cy5qc29uJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdmVyc2lvbjogTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgZG9ja2VySW1hZ2VzOiB7XG4gICAgICAgIHRoZUFzc2V0MToge1xuICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAnZG9ja2VyZGlyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgICAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlJyxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdyZXBvJyxcbiAgICAgICAgICAgICAgaW1hZ2VUYWc6ICd0aGVBc3NldDEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0aGVBc3NldDI6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGRpcmVjdG9yeTogJ2RvY2tlcmRpcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAndGhlQXNzZXQyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9leHRlcm5hbC9jZGsub3V0L2Fzc2V0cy5qc29uJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdmVyc2lvbjogTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgZG9ja2VySW1hZ2VzOiB7XG4gICAgICAgIHRoZUV4dGVybmFsQXNzZXQ6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGV4ZWN1dGFibGU6IFsnc29tZXRvb2wnXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgICAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlJyxcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdyZXBvJyxcbiAgICAgICAgICAgICAgaW1hZ2VUYWc6ICdnaGlqa2wnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnL3NpbXBsZS9jZGsub3V0L2RvY2tlcmRpci9Eb2NrZXJmaWxlJzogJ0ZST00gc2NyYXRjaCcsXG4gICAgJy9hYnMvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGRvY2tlckltYWdlczoge1xuICAgICAgICB0aGVBc3NldDoge1xuICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiBhYnNvbHV0ZURvY2tlclBhdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAnYWJjZGVmJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9kZWZhdWx0LW5ldHdvcmsvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGRvY2tlckltYWdlczoge1xuICAgICAgICB0aGVBc3NldDoge1xuICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAnZG9ja2VyZGlyJyxcbiAgICAgICAgICAgIG5ldHdvcmtNb2RlOiAnZGVmYXVsdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAnbm9wcXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnL2RlZmF1bHQtbmV0d29yay9jZGsub3V0L2RvY2tlcmRpci9Eb2NrZXJmaWxlJzogJ0ZST00gc2NyYXRjaCcsXG4gICAgJy9wbGF0Zm9ybS1hcm02NC9jZGsub3V0L2Fzc2V0cy5qc29uJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdmVyc2lvbjogTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgZG9ja2VySW1hZ2VzOiB7XG4gICAgICAgIHRoZUFzc2V0OiB7XG4gICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICBkaXJlY3Rvcnk6ICdkb2NrZXJkaXInLFxuICAgICAgICAgICAgcGxhdGZvcm06ICdsaW51eC9hcm02NCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAnbm9wcXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnL2NhY2hlL2Nkay5vdXQvYXNzZXRzLmpzb24nOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBkb2NrZXJJbWFnZXM6IHtcbiAgICAgICAgdGhlQXNzZXQ6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGRpcmVjdG9yeTogJ2RvY2tlcmRpcicsXG4gICAgICAgICAgICBjYWNoZUZyb206IFt7IHR5cGU6ICdyZWdpc3RyeScsIHBhcmFtczogeyByZWY6ICdhYmNkZWYnIH0gfV0sXG4gICAgICAgICAgICBjYWNoZVRvOiB7IHR5cGU6ICdpbmxpbmUnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgICAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwbycsXG4gICAgICAgICAgICAgIGltYWdlVGFnOiAnbm9wcXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnL2NhY2hlLWZyb20tbXVsdGlwbGUvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGRvY2tlckltYWdlczoge1xuICAgICAgICB0aGVBc3NldDoge1xuICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAnZG9ja2VyZGlyJyxcbiAgICAgICAgICAgIGNhY2hlRnJvbTogW1xuICAgICAgICAgICAgICB7IHR5cGU6ICdyZWdpc3RyeScsIHBhcmFtczogeyByZWY6ICdjYWNoZTpyZWYnIH0gfSxcbiAgICAgICAgICAgICAgeyB0eXBlOiAncmVnaXN0cnknLCBwYXJhbXM6IHsgcmVmOiAnY2FjaGU6bWFpbicgfSB9LFxuICAgICAgICAgICAgICB7IHR5cGU6ICdnaGEnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICAgICB0aGVEZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgICByZWdpb246ICd1cy1ub3J0aC01MCcsXG4gICAgICAgICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUnLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogJ3JlcG8nLFxuICAgICAgICAgICAgICBpbWFnZVRhZzogJ25vcHFyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9jYWNoZS10by1jb21wbGV4L2Nkay5vdXQvYXNzZXRzLmpzb24nOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBkb2NrZXJJbWFnZXM6IHtcbiAgICAgICAgdGhlQXNzZXQ6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGRpcmVjdG9yeTogJ2RvY2tlcmRpcicsXG4gICAgICAgICAgICBjYWNoZVRvOiB7IHR5cGU6ICdyZWdpc3RyeScsIHBhcmFtczogeyByZWY6ICdjYWNoZTptYWluJywgbW9kZTogJ21heCcsIGNvbXByZXNzaW9uOiAnenN0ZCcgfSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICAgICB0aGVEZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgICByZWdpb246ICd1cy1ub3J0aC01MCcsXG4gICAgICAgICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUnLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogJ3JlcG8nLFxuICAgICAgICAgICAgICBpbWFnZVRhZzogJ25vcHFyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9ub2NhY2hlL2Nkay5vdXQvYXNzZXRzLmpzb24nOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBkb2NrZXJJbWFnZXM6IHtcbiAgICAgICAgdGhlQXNzZXQ6IHtcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIGRpcmVjdG9yeTogJ2RvY2tlcmRpcicsXG4gICAgICAgICAgICBjYWNoZURpc2FibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICAgICB0aGVEZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgICByZWdpb246ICd1cy1ub3J0aC01MCcsXG4gICAgICAgICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUnLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogJ3JlcG8nLFxuICAgICAgICAgICAgICBpbWFnZVRhZzogJ25vcHFyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9wbGF0Zm9ybS1hcm02NC9jZGsub3V0L2RvY2tlcmRpci9Eb2NrZXJmaWxlJzogJ0ZST00gc2NyYXRjaCcsXG4gIH0pO1xuXG4gIGF3cyA9IG1vY2tBd3MoKTtcbn0pO1xuXG5hZnRlckVhY2goKCkgPT4ge1xuICBtb2NrZnMucmVzdG9yZSgpO1xufSk7XG5cbnRlc3QoJ3Bhc3MgZGVzdGluYXRpb24gcHJvcGVydGllcyB0byBBV1MgY2xpZW50JywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9zaW1wbGUvY2RrLm91dCcpLCB7IGF3cywgdGhyb3dPbkVycm9yOiBmYWxzZSB9KTtcblxuICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gIGV4cGVjdChhd3MuZWNyQ2xpZW50KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUnLFxuICB9KSk7XG59KTtcblxuZGVzY3JpYmUoJ3dpdGggYSBjb21wbGV0ZSBtYW5pZmVzdCcsICgpID0+IHtcbiAgbGV0IHB1YjogQXNzZXRQdWJsaXNoaW5nO1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9zaW1wbGUvY2RrLm91dCcpLCB7IGF3cyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRG8gbm90aGluZyBpZiBkb2NrZXIgaW1hZ2UgYWxyZWFkeSBleGlzdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlSZXN1bHQoeyAvKiBObyBlcnJvciA9PSBpbWFnZSBleGlzdHMgKi8gfSk7XG5cbiAgICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gICAgZXhwZWN0KGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICBpbWFnZUlkczogW3sgaW1hZ2VUYWc6ICdhYmNkZWYnIH1dLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6ICdyZXBvJyxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Rpc3BsYXlzIGFuIGVycm9yIGlmIHRoZSBFQ1IgcmVwb3NpdG9yeSBjYW5ub3QgYmUgZm91bmQnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdSZXBvc2l0b3J5Tm90Rm91bmRFeGNlcHRpb24nLCAnUmVwb3NpdG9yeSBub3QgRm91bmQnKTtcblxuICAgIGF3YWl0IGV4cGVjdChwdWIucHVibGlzaCgpKS5yZWplY3RzLnRvVGhyb3coJ0Vycm9yIHB1Ymxpc2hpbmc6IFJlcG9zaXRvcnkgbm90IEZvdW5kJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1Y2Nlc3NmdWwgcnVuIGRvZXMgbm90IG5lZWQgdG8gcXVlcnkgYWNjb3VudCBJRCcsIGFzeW5jICgpID0+IHtcbiAgICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaVJlc3VsdCh7IC8qIE5vIGVycm9yID09IGltYWdlIGV4aXN0cyAqLyB9KTtcbiAgICBhd2FpdCBwdWIucHVibGlzaCgpO1xuICAgIGV4cGVjdChhd3MuZGlzY292ZXJDdXJyZW50QWNjb3VudCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgndXBsb2FkIGRvY2tlciBpbWFnZSBpZiBub3QgdXBsb2FkZWQgeWV0IGJ1dCBleGlzdHMgbG9jYWxseScsIGFzeW5jICgpID0+IHtcbiAgICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaUZhaWx1cmUoJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nLCAnRmlsZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgIGF3cy5tb2NrRWNyLmdldEF1dGhvcml6YXRpb25Ub2tlbiA9IG1vY2tlZEFwaVJlc3VsdCh7XG4gICAgICBhdXRob3JpemF0aW9uRGF0YTogW1xuICAgICAgICB7IGF1dGhvcml6YXRpb25Ub2tlbjogJ2RYTmxjanB3WVhOeicsIHByb3h5RW5kcG9pbnQ6ICdodHRwczovL3Byb3h5LmNvbS8nIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnbG9naW4nLCAnLS11c2VybmFtZScsICd1c2VyJywgJy0tcGFzc3dvcmQtc3RkaW4nLCAnaHR0cHM6Ly9wcm94eS5jb20vJ10gfSxcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2luc3BlY3QnLCAnY2RrYXNzZXQtdGhlYXNzZXQnXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzphYmNkZWYnXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAncHVzaCcsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86YWJjZGVmJ10gfSxcbiAgICApO1xuXG4gICAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICAgIGV4cGVjdEFsbFNwYXducygpO1xuICAgIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7IC8vIEV4cGVjdCBubyBleGNlcHRpb24sIHNhdGlzZnkgbGludGVyXG4gIH0pO1xuXG4gIHRlc3QoJ2J1aWxkIGFuZCB1cGxvYWQgZG9ja2VyIGltYWdlIGlmIG5vdCBleGlzdHMgYW55d2hlcmUnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgICAgYXV0aG9yaXphdGlvbkRhdGE6IFtcbiAgICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0J10sIGV4aXRDb2RlOiAxIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldCcsICcuJ10sIGN3ZDogYWJzb2x1dGVEb2NrZXJQYXRoIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICd0YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOmFiY2RlZiddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzphYmNkZWYnXSB9LFxuICAgICk7XG5cbiAgICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gICAgZXhwZWN0QWxsU3Bhd25zKCk7XG4gICAgZXhwZWN0KHRydWUpLnRvQmVUcnV0aHkoKTsgLy8gRXhwZWN0IG5vIGV4Y2VwdGlvbiwgc2F0aXNmeSBsaW50ZXJcbiAgfSk7XG5cbiAgdGVzdCgnYnVpbGQgd2l0aCBuZXR3b3JrTW9kZSBvcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgcHViID0gbmV3IEFzc2V0UHVibGlzaGluZyhBc3NldE1hbmlmZXN0LmZyb21QYXRoKCcvZGVmYXVsdC1uZXR3b3JrL2Nkay5vdXQnKSwgeyBhd3MgfSk7XG4gICAgY29uc3QgZGVmYXVsdE5ldHdvcmtEb2NrZXJwYXRoID0gJy9kZWZhdWx0LW5ldHdvcmsvY2RrLm91dC9kb2NrZXJkaXInO1xuICAgIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpRmFpbHVyZSgnSW1hZ2VOb3RGb3VuZEV4Y2VwdGlvbicsICdGaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICAgIHsgYXV0aG9yaXphdGlvblRva2VuOiAnZFhObGNqcHdZWE56JywgcHJveHlFbmRwb2ludDogJ2h0dHBzOi8vcHJveHkuY29tLycgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHBlY3RBbGxTcGF3bnMgPSBtb2NrU3Bhd24oXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbicsICctLXVzZXJuYW1lJywgJ3VzZXInLCAnLS1wYXNzd29yZC1zdGRpbicsICdodHRwczovL3Byb3h5LmNvbS8nXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldCddLCBleGl0Q29kZTogMSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnYnVpbGQnLCAnLS10YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnLS1uZXR3b3JrJywgJ2RlZmF1bHQnLCAnLiddLCBjd2Q6IGRlZmF1bHROZXR3b3JrRG9ja2VycGF0aCB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgICBleHBlY3RBbGxTcGF3bnMoKTtcbiAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxuICB9KTtcblxuICB0ZXN0KCdidWlsZCB3aXRoIHBsYXRmb3JtIG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9wbGF0Zm9ybS1hcm02NC9jZGsub3V0JyksIHsgYXdzIH0pO1xuICAgIGNvbnN0IGRlZmF1bHROZXR3b3JrRG9ja2VycGF0aCA9ICcvcGxhdGZvcm0tYXJtNjQvY2RrLm91dC9kb2NrZXJkaXInO1xuICAgIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpRmFpbHVyZSgnSW1hZ2VOb3RGb3VuZEV4Y2VwdGlvbicsICdGaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICAgIHsgYXV0aG9yaXphdGlvblRva2VuOiAnZFhObGNqcHdZWE56JywgcHJveHlFbmRwb2ludDogJ2h0dHBzOi8vcHJveHkuY29tLycgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHBlY3RBbGxTcGF3bnMgPSBtb2NrU3Bhd24oXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbicsICctLXVzZXJuYW1lJywgJ3VzZXInLCAnLS1wYXNzd29yZC1zdGRpbicsICdodHRwczovL3Byb3h5LmNvbS8nXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldCddLCBleGl0Q29kZTogMSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnYnVpbGQnLCAnLS10YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnLS1wbGF0Zm9ybScsICdsaW51eC9hcm02NCcsICcuJ10sIGN3ZDogZGVmYXVsdE5ldHdvcmtEb2NrZXJwYXRoIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICd0YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOm5vcHFyJ10gfSxcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOm5vcHFyJ10gfSxcbiAgICApO1xuXG4gICAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICAgIGV4cGVjdEFsbFNwYXducygpO1xuICAgIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7IC8vIEV4cGVjdCBubyBleGNlcHRpb24sIHNhdGlzZnkgbGludGVyXG4gIH0pO1xuXG4gIHRlc3QoJ2J1aWxkIHdpdGggY2FjaGUgb3B0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgIHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL2NhY2hlL2Nkay5vdXQnKSwgeyBhd3MgfSk7XG4gICAgY29uc3QgZGVmYXVsdE5ldHdvcmtEb2NrZXJwYXRoID0gJy9jYWNoZS9jZGsub3V0L2RvY2tlcmRpcic7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgICAgYXV0aG9yaXphdGlvbkRhdGE6IFtcbiAgICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0J10sIGV4aXRDb2RlOiAxIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldCcsICctLWNhY2hlLWZyb20nLCAndHlwZT1yZWdpc3RyeSxyZWY9YWJjZGVmJywgJy0tY2FjaGUtdG8nLCAndHlwZT1pbmxpbmUnLCAnLiddLCBjd2Q6IGRlZmF1bHROZXR3b3JrRG9ja2VycGF0aCB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgICBleHBlY3RBbGxTcGF3bnMoKTtcbiAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxuICB9KTtcblxuICB0ZXN0KCdidWlsZCB3aXRoIGNhY2hlIGRpc2FibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL25vY2FjaGUvY2RrLm91dCcpLCB7IGF3cyB9KTtcbiAgICBjb25zdCBkZWZhdWx0TmV0d29ya0RvY2tlcnBhdGggPSAnL25vY2FjaGUvY2RrLm91dC9kb2NrZXJkaXInO1xuICAgIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpRmFpbHVyZSgnSW1hZ2VOb3RGb3VuZEV4Y2VwdGlvbicsICdGaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICAgIHsgYXV0aG9yaXphdGlvblRva2VuOiAnZFhObGNqcHdZWE56JywgcHJveHlFbmRwb2ludDogJ2h0dHBzOi8vcHJveHkuY29tLycgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHBlY3RBbGxTcGF3bnMgPSBtb2NrU3Bhd24oXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbicsICctLXVzZXJuYW1lJywgJ3VzZXInLCAnLS1wYXNzd29yZC1zdGRpbicsICdodHRwczovL3Byb3h5LmNvbS8nXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldCddLCBleGl0Q29kZTogMSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnYnVpbGQnLCAnLS10YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnLS1uby1jYWNoZScsICcuJ10sIGN3ZDogZGVmYXVsdE5ldHdvcmtEb2NrZXJwYXRoIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICd0YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOm5vcHFyJ10gfSxcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOm5vcHFyJ10gfSxcbiAgICApO1xuXG4gICAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICAgIGV4cGVjdEFsbFNwYXducygpO1xuICAgIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7IC8vIEV4cGVjdCBubyBleGNlcHRpb24sIHNhdGlzZnkgbGludGVyXG4gIH0pO1xuXG4gIHRlc3QoJ2J1aWxkIHdpdGggbXVsdGlwbGUgY2FjaGUgZnJvbSBvcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgcHViID0gbmV3IEFzc2V0UHVibGlzaGluZyhBc3NldE1hbmlmZXN0LmZyb21QYXRoKCcvY2FjaGUtZnJvbS1tdWx0aXBsZS9jZGsub3V0JyksIHsgYXdzIH0pO1xuICAgIGNvbnN0IGRlZmF1bHROZXR3b3JrRG9ja2VycGF0aCA9ICcvY2FjaGUtZnJvbS1tdWx0aXBsZS9jZGsub3V0L2RvY2tlcmRpcic7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgICAgYXV0aG9yaXphdGlvbkRhdGE6IFtcbiAgICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0J10sIGV4aXRDb2RlOiAxIH0sXG4gICAgICB7XG4gICAgICAgIGNvbW1hbmRMaW5lOiBbXG4gICAgICAgICAgJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldCcsICctLWNhY2hlLWZyb20nLCAndHlwZT1yZWdpc3RyeSxyZWY9Y2FjaGU6cmVmJywgJy0tY2FjaGUtZnJvbScsICd0eXBlPXJlZ2lzdHJ5LHJlZj1jYWNoZTptYWluJywgJy0tY2FjaGUtZnJvbScsICd0eXBlPWdoYScsICcuJyxcbiAgICAgICAgXSxcbiAgICAgICAgY3dkOiBkZWZhdWx0TmV0d29ya0RvY2tlcnBhdGgsXG4gICAgICB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgICBleHBlY3RBbGxTcGF3bnMoKTtcbiAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxuICB9KTtcblxuICB0ZXN0KCdidWlsZCB3aXRoIGNhY2hlIHRvIGNvbXBsZXggb3B0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgIHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL2NhY2hlLXRvLWNvbXBsZXgvY2RrLm91dCcpLCB7IGF3cyB9KTtcbiAgICBjb25zdCBkZWZhdWx0TmV0d29ya0RvY2tlcnBhdGggPSAnL2NhY2hlLXRvLWNvbXBsZXgvY2RrLm91dC9kb2NrZXJkaXInO1xuICAgIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpRmFpbHVyZSgnSW1hZ2VOb3RGb3VuZEV4Y2VwdGlvbicsICdGaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICAgIHsgYXV0aG9yaXphdGlvblRva2VuOiAnZFhObGNqcHdZWE56JywgcHJveHlFbmRwb2ludDogJ2h0dHBzOi8vcHJveHkuY29tLycgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHBlY3RBbGxTcGF3bnMgPSBtb2NrU3Bhd24oXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbicsICctLXVzZXJuYW1lJywgJ3VzZXInLCAnLS1wYXNzd29yZC1zdGRpbicsICdodHRwczovL3Byb3h5LmNvbS8nXSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldCddLCBleGl0Q29kZTogMSB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnYnVpbGQnLCAnLS10YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQnLCAnLS1jYWNoZS10bycsICd0eXBlPXJlZ2lzdHJ5LHJlZj1jYWNoZTptYWluLG1vZGU9bWF4LGNvbXByZXNzaW9uPXpzdGQnLCAnLiddLCBjd2Q6IGRlZmF1bHROZXR3b3JrRG9ja2VycGF0aCB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzpub3BxciddIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgICBleHBlY3RBbGxTcGF3bnMoKTtcbiAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZXh0ZXJuYWwgYXNzZXRzJywgKCkgPT4ge1xuICBsZXQgcHViOiBBc3NldFB1Ymxpc2hpbmc7XG4gIGNvbnN0IGV4dGVybmFsVGFnID0gJ2V4dGVybmFsOnRhZyc7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL2V4dGVybmFsL2Nkay5vdXQnKSwgeyBhd3MgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VwbG9hZCBleHRlcm5hbGx5IGdlbmVyYXRlZCBEb2NrZXIgaW1hZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgICAgYXV0aG9yaXphdGlvbkRhdGE6IFtcbiAgICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgICB7IGNvbW1hbmRMaW5lOiBbJ3NvbWV0b29sJ10sIHN0ZG91dDogZXh0ZXJuYWxUYWcsIGN3ZDogJy9leHRlcm5hbC9jZGsub3V0JyB9LFxuICAgICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgZXh0ZXJuYWxUYWcsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86Z2hpamtsJ10gfSxcbiAgICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOmdoaWprbCddIH0sXG4gICAgKTtcblxuICAgIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgICBleHBlY3QoYXdzLmVjckNsaWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgfSkpO1xuICAgIGV4cGVjdEFsbFNwYXducygpO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdjb3JyZWN0bHkgaWRlbnRpZnkgRG9ja2VyIGRpcmVjdG9yeSBpZiBwYXRoIGlzIGFic29sdXRlJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9hYnMvY2RrLm91dCcpLCB7IGF3cyB9KTtcblxuICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaUZhaWx1cmUoJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nLCAnRmlsZSBkb2VzIG5vdCBleGlzdCcpO1xuICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICB7IGF1dGhvcml6YXRpb25Ub2tlbjogJ2RYTmxjanB3WVhOeicsIHByb3h5RW5kcG9pbnQ6ICdodHRwczovL3Byb3h5LmNvbS8nIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgIC8vIE9ubHkgY2FyZSBhYm91dCB0aGUgJ2J1aWxkJyBjb21tYW5kIGxpbmVcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbiddLCBwcmVmaXg6IHRydWUgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0J10sIGV4aXRDb2RlOiAxLCBwcmVmaXg6IHRydWUgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldCcsICcuJ10sIGN3ZDogYWJzb2x1dGVEb2NrZXJQYXRoIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJ10sIHByZWZpeDogdHJ1ZSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnXSwgcHJlZml4OiB0cnVlIH0sXG4gICk7XG5cbiAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxuICBleHBlY3RBbGxTcGF3bnMoKTtcbn0pO1xuXG50ZXN0KCd3aGVuIGV4dGVybmFsIGNyZWRlbnRpYWxzIGFyZSBwcmVzZW50LCBleHBsaWNpdCBEb2NrZXIgY29uZmlnIGRpcmVjdG9yaWVzIGFyZSB1c2VkJywgYXN5bmMgKCkgPT4ge1xuICAvLyBTZXR1cCAtLSBNb2NrIHRoYXQgd2UgaGF2ZSBDREsgY3JlZGVudGlhbHMsIGFuZCBtb2NrIGZzIG9wZXJhdGlvbnMuXG4gIGplc3Quc3B5T24oZG9ja2VyY3JlZHMsICdjZGtDcmVkZW50aWFsc0NvbmZpZycpLm1vY2tSZXR1cm5WYWx1ZSh7IHZlcnNpb246ICcwLjEnLCBkb21haW5DcmVkZW50aWFsczoge30gfSk7XG4gIGplc3Quc3B5T24oZnMsICdta2R0ZW1wU3luYycpLm1vY2tJbXBsZW1lbnRhdGlvbk9uY2UoKCkgPT4gJy90bXAvbW9ja2VkVGVtcERpcicpO1xuICBqZXN0LnNweU9uKGZzLCAnd3JpdGVGaWxlU3luYycpLm1vY2tJbXBsZW1lbnRhdGlvbihqZXN0LmZuKCkpO1xuXG4gIGxldCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9zaW1wbGUvY2RrLm91dCcpLCB7IGF3cyB9KTtcbiAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICBhdXRob3JpemF0aW9uRGF0YTogW1xuICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICAvLyBJbml0YWxseSB1c2UgdGhlIGZpcnN0IGNyZWF0ZWQgZGlyZWN0b3J5IHdpdGggdGhlIENESyBjcmVkZW50aWFsc1xuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJy0tY29uZmlnJywgJy90bXAvbW9ja2VkVGVtcERpcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0J10sIGV4aXRDb2RlOiAxIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnLS1jb25maWcnLCAnL3RtcC9tb2NrZWRUZW1wRGlyJywgJ2J1aWxkJywgJy0tdGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJy4nXSwgY3dkOiBhYnNvbHV0ZURvY2tlclBhdGggfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICctLWNvbmZpZycsICcvdG1wL21vY2tlZFRlbXBEaXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzphYmNkZWYnXSB9LFxuICAgIC8vIFByaW9yIHRvIHB1c2gsIHJldmVydCB0byB0aGUgZGVmYXVsdCBjb25maWcgZGlyZWN0b3J5XG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnbG9naW4nXSwgcHJlZml4OiB0cnVlIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAncHVzaCcsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86YWJjZGVmJ10gfSxcbiAgKTtcblxuICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gIGV4cGVjdEFsbFNwYXducygpO1xufSk7XG5cbnRlc3QoJ2xvZ2dpbmcgaW4gb25seSBvbmNlIGZvciB0d28gYXNzZXRzJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9tdWx0aS9jZGsub3V0JyksIHsgYXdzLCB0aHJvd09uRXJyb3I6IGZhbHNlIH0pO1xuICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaUZhaWx1cmUoJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nLCAnRmlsZSBkb2VzIG5vdCBleGlzdCcpO1xuICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICB7IGF1dGhvcml6YXRpb25Ub2tlbjogJ2RYTmxjanB3WVhOeicsIHByb3h5RW5kcG9pbnQ6ICdodHRwczovL3Byb3h5LmNvbS8nIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldDEnXSwgZXhpdENvZGU6IDEgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldDEnLCAnLiddLCBjd2Q6ICcvbXVsdGkvY2RrLm91dC9kb2NrZXJkaXInIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0MScsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86dGhlQXNzZXQxJ10gfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzp0aGVBc3NldDEnXSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2luc3BlY3QnLCAnY2RrYXNzZXQtdGhlYXNzZXQyJ10sIGV4aXRDb2RlOiAxIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnYnVpbGQnLCAnLS10YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQyJywgJy4nXSwgY3dkOiAnL211bHRpL2Nkay5vdXQvZG9ja2VyZGlyJyB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3RhZycsICdjZGthc3NldC10aGVhc3NldDInLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOnRoZUFzc2V0MiddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAncHVzaCcsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86dGhlQXNzZXQyJ10gfSxcbiAgKTtcblxuICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gIGV4cGVjdEFsbFNwYXducygpO1xuICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxufSk7XG5cbnRlc3QoJ2xvZ2dpbmcgaW4gdHdpY2UgZm9yIHR3byByZXBvc2l0b3J5IGRvbWFpbnMgKGNvbnRhaW5pbmcgYWNjb3VudCBpZCAmIHJlZ2lvbiknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL211bHRpL2Nkay5vdXQnKSwgeyBhd3MsIHRocm93T25FcnJvcjogZmFsc2UgfSk7XG4gIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpRmFpbHVyZSgnSW1hZ2VOb3RGb3VuZEV4Y2VwdGlvbicsICdGaWxlIGRvZXMgbm90IGV4aXN0Jyk7XG5cbiAgbGV0IHJlcG9JZHggPSAxMjM0NTtcbiAgYXdzLm1vY2tFY3IuZGVzY3JpYmVSZXBvc2l0b3JpZXMgPSBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHtcbiAgICBwcm9taXNlOiBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IFByb21pc2UucmVzb2x2ZSh7XG4gICAgICByZXBvc2l0b3JpZXM6IFtcbiAgICAgICAgLy8gVXN1YWxseSBsb29rcyBsaWtlOiAwMTIzNDU2Nzg5MTAuZGtyLmVjci51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9hd3MtY2RrL2Fzc2V0c1xuICAgICAgICB7IHJlcG9zaXRvcnlVcmk6IGAke3JlcG9JZHgrK30uYW1hem9uYXdzLmNvbS9hd3MtY2RrL2Fzc2V0c2AgfSxcbiAgICAgIF0sXG4gICAgfSkpLFxuICB9KTtcblxuICBsZXQgcHJveHlJZHggPSAxMjM0NTtcbiAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gamVzdC5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgcHJvbWlzZTogamVzdC5mbigpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgYXV0aG9yaXphdGlvbkRhdGE6IFtcbiAgICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiBgaHR0cHM6Ly8ke3Byb3h5SWR4Kyt9LnByb3h5LmNvbS9gIH0sXG4gICAgICBdLFxuICAgIH0pKSxcbiAgfSk7XG5cbiAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vMTIzNDUucHJveHkuY29tLyddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldDEnXSwgZXhpdENvZGU6IDEgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldDEnLCAnLiddLCBjd2Q6ICcvbXVsdGkvY2RrLm91dC9kb2NrZXJkaXInIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0MScsICcxMjM0NS5hbWF6b25hd3MuY29tL2F3cy1jZGsvYXNzZXRzOnRoZUFzc2V0MSddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAncHVzaCcsICcxMjM0NS5hbWF6b25hd3MuY29tL2F3cy1jZGsvYXNzZXRzOnRoZUFzc2V0MSddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnbG9naW4nLCAnLS11c2VybmFtZScsICd1c2VyJywgJy0tcGFzc3dvcmQtc3RkaW4nLCAnaHR0cHM6Ly8xMjM0Ni5wcm94eS5jb20vJ10gfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0MiddLCBleGl0Q29kZTogMSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2J1aWxkJywgJy0tdGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0MicsICcuJ10sIGN3ZDogJy9tdWx0aS9jZGsub3V0L2RvY2tlcmRpcicgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICd0YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQyJywgJzEyMzQ2LmFtYXpvbmF3cy5jb20vYXdzLWNkay9hc3NldHM6dGhlQXNzZXQyJ10gfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdwdXNoJywgJzEyMzQ2LmFtYXpvbmF3cy5jb20vYXdzLWNkay9hc3NldHM6dGhlQXNzZXQyJ10gfSxcbiAgKTtcblxuICBhd2FpdCBwdWIucHVibGlzaCgpO1xuXG4gIGV4cGVjdEFsbFNwYXducygpO1xuICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpOyAvLyBFeHBlY3Qgbm8gZXhjZXB0aW9uLCBzYXRpc2Z5IGxpbnRlclxufSk7XG5cbnRlc3QoJ2J1aWxkaW5nIG9ubHknLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL211bHRpL2Nkay5vdXQnKSwge1xuICAgIGF3cyxcbiAgICB0aHJvd09uRXJyb3I6IGZhbHNlLFxuICAgIGJ1aWxkQXNzZXRzOiB0cnVlLFxuICAgIHB1Ymxpc2hBc3NldHM6IGZhbHNlLFxuICB9KTtcblxuICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaUZhaWx1cmUoJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nLCAnRmlsZSBkb2VzIG5vdCBleGlzdCcpO1xuICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICB7IGF1dGhvcml6YXRpb25Ub2tlbjogJ2RYTmxjanB3WVhOeicsIHByb3h5RW5kcG9pbnQ6ICdodHRwczovL3Byb3h5LmNvbS8nIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldDEnXSwgZXhpdENvZGU6IDEgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdidWlsZCcsICctLXRhZycsICdjZGthc3NldC10aGVhc3NldDEnLCAnLiddLCBjd2Q6ICcvbXVsdGkvY2RrLm91dC9kb2NrZXJkaXInIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydkb2NrZXInLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0MScsICcxMjM0NS5hbWF6b25hd3MuY29tL3JlcG86dGhlQXNzZXQxJ10gfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdpbnNwZWN0JywgJ2Nka2Fzc2V0LXRoZWFzc2V0MiddLCBleGl0Q29kZTogMSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ2J1aWxkJywgJy0tdGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0MicsICcuJ10sIGN3ZDogJy9tdWx0aS9jZGsub3V0L2RvY2tlcmRpcicgfSxcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICd0YWcnLCAnY2RrYXNzZXQtdGhlYXNzZXQyJywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzp0aGVBc3NldDInXSB9LFxuICApO1xuXG4gIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgZXhwZWN0QWxsU3Bhd25zKCk7XG4gIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7IC8vIEV4cGVjdCBubyBleGNlcHRpb24sIHNhdGlzZnkgbGludGVyXG59KTtcblxudGVzdCgncHVibGlzaGluZyBvbmx5JywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9tdWx0aS9jZGsub3V0JyksIHtcbiAgICBhd3MsXG4gICAgdGhyb3dPbkVycm9yOiBmYWxzZSxcbiAgICBidWlsZEFzc2V0czogZmFsc2UsXG4gICAgcHVibGlzaEFzc2V0czogdHJ1ZSxcbiAgfSk7XG5cbiAgYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMgPSBtb2NrZWRBcGlGYWlsdXJlKCdJbWFnZU5vdEZvdW5kRXhjZXB0aW9uJywgJ0ZpbGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgYXdzLm1vY2tFY3IuZ2V0QXV0aG9yaXphdGlvblRva2VuID0gbW9ja2VkQXBpUmVzdWx0KHtcbiAgICBhdXRob3JpemF0aW9uRGF0YTogW1xuICAgICAgeyBhdXRob3JpemF0aW9uVG9rZW46ICdkWE5sY2pwd1lYTnonLCBwcm94eUVuZHBvaW50OiAnaHR0cHM6Ly9wcm94eS5jb20vJyB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIGNvbnN0IGV4cGVjdEFsbFNwYXducyA9IG1vY2tTcGF3bihcbiAgICB7IGNvbW1hbmRMaW5lOiBbJ2RvY2tlcicsICdsb2dpbicsICctLXVzZXJuYW1lJywgJ3VzZXInLCAnLS1wYXNzd29yZC1zdGRpbicsICdodHRwczovL3Byb3h5LmNvbS8nXSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9hd3MtY2RrL2Fzc2V0czp0aGVBc3NldDEnXSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnZG9ja2VyJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9hd3MtY2RrL2Fzc2V0czp0aGVBc3NldDInXSB9LFxuICApO1xuXG4gIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgZXhwZWN0QWxsU3Bhd25zKCk7XG4gIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7IC8vIEV4cGVjdCBubyBleGNlcHRpb24sIHNhdGlzZnkgbGludGVyXG59KTtcblxudGVzdCgnb3ZlcnJpZGluZyB0aGUgZG9ja2VyIGNvbW1hbmQnLCBhc3luYyAoKSA9PiB7XG4gIHByb2Nlc3MuZW52LkNES19ET0NLRVIgPSAnY3VzdG9tJztcblxuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9zaW1wbGUvY2RrLm91dCcpLCB7IGF3cywgdGhyb3dPbkVycm9yOiBmYWxzZSB9KTtcblxuICBhd3MubW9ja0Vjci5kZXNjcmliZUltYWdlcyA9IG1vY2tlZEFwaUZhaWx1cmUoJ0ltYWdlTm90Rm91bmRFeGNlcHRpb24nLCAnRmlsZSBkb2VzIG5vdCBleGlzdCcpO1xuICBhd3MubW9ja0Vjci5nZXRBdXRob3JpemF0aW9uVG9rZW4gPSBtb2NrZWRBcGlSZXN1bHQoe1xuICAgIGF1dGhvcml6YXRpb25EYXRhOiBbXG4gICAgICB7IGF1dGhvcml6YXRpb25Ub2tlbjogJ2RYTmxjanB3WVhOeicsIHByb3h5RW5kcG9pbnQ6ICdodHRwczovL3Byb3h5LmNvbS8nIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgY29uc3QgZXhwZWN0QWxsU3Bhd25zID0gbW9ja1NwYXduKFxuICAgIHsgY29tbWFuZExpbmU6IFsnY3VzdG9tJywgJ2xvZ2luJywgJy0tdXNlcm5hbWUnLCAndXNlcicsICctLXBhc3N3b3JkLXN0ZGluJywgJ2h0dHBzOi8vcHJveHkuY29tLyddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydjdXN0b20nLCAnaW5zcGVjdCcsICdjZGthc3NldC10aGVhc3NldCddIH0sXG4gICAgeyBjb21tYW5kTGluZTogWydjdXN0b20nLCAndGFnJywgJ2Nka2Fzc2V0LXRoZWFzc2V0JywgJzEyMzQ1LmFtYXpvbmF3cy5jb20vcmVwbzphYmNkZWYnXSB9LFxuICAgIHsgY29tbWFuZExpbmU6IFsnY3VzdG9tJywgJ3B1c2gnLCAnMTIzNDUuYW1hem9uYXdzLmNvbS9yZXBvOmFiY2RlZiddIH0sXG4gICk7XG5cbiAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICBleHBlY3RBbGxTcGF3bnMoKTtcbiAgZXhwZWN0KHRydWUpLnRvQmVUcnV0aHkoKTsgLy8gRXhwZWN0IG5vIGV4Y2VwdGlvbiwgc2F0aXNmeSBsaW50ZXJcbn0pO1xuIl19