import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { Architecture, Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingFileAccess, DockerImage } from '@aws-cdk/core';
import { Bundling } from '../lib/bundling';
import * as util from '../lib/util';

let getGoBuildVersionMock = jest.spyOn(util, 'getGoBuildVersion');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  Bundling.clearRunsLocallyCache();

  jest.spyOn(Code, 'fromAsset');

  jest.spyOn(DockerImage, 'fromBuild').mockReturnValue({
    image: 'built-image',
    cp: () => 'built-image',
    run: () => {},
    toJSON: () => 'build-image',
  });

  getGoBuildVersionMock.mockReturnValue(true);
});

const moduleDir = '/project/go.mod';
const entry = '/project/cmd/api';

test('bundling', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
    environment: {
      KEY: 'value',
    },
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(moduleDir), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
        CGO_ENABLED: '0',
        GO111MODULE: 'on',
        GOARCH: 'amd64',
        GOOS: 'linux',
      },
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap ./cmd/api',
        ].join(' && '),
      ],
    }),
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-go\/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-go/),
    }),
    platform: 'linux/amd64',
  }));
});

test('bundling with file as entry', () => {
  Bundling.bundle({
    entry: '/project/main.go',
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap ./main.go',
        ].join(' && '),
      ],
    }),
  });
});

test('bundling with file in subdirectory as entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api/main.go',
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap ./cmd/api/main.go',
        ].join(' && '),
      ],
    }),
  });
});

test('bundling with file other than main.go in subdirectory as entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api/api.go',
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap ./cmd/api/api.go',
        ].join(' && '),
      ],
    }),
  });
});

test('go with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');
  Bundling.bundle({
    entry: 'C:\\my-project\\cmd\\api',
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir: 'C:\\my-project\\go.mod',
    forcedDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringContaining('cmd/api'),
      ]),
    }),
  }));
  osPlatformMock.mockRestore();
});

test('with Docker build args', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
    buildArgs: {
      HELLO: 'WORLD',
    },
  });
  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-go\/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      HELLO: 'WORLD',
    }),
  }));
});

test('Local bundling', () => {
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('go version go1.15 linux/amd64'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const bundler = new Bundling({
    moduleDir,
    entry,
    environment: {
      KEY: 'value',
    },
    runtime: Runtime.PROVIDED_AL2,
    architecture: Architecture.X86_64,
  });

  expect(bundler.local).toBeDefined();

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.GO_1_X.bundlingDockerImage });
  expect(tryBundle).toBe(true);

  expect(spawnSyncMock).toHaveBeenCalledWith(
    'bash',
    expect.arrayContaining(['-c', expect.stringContaining('cmd/api')]),
    expect.objectContaining({
      env: expect.objectContaining({ KEY: 'value' }),
      cwd: expect.stringContaining('/project'),
    }),
  );

  // Docker image is not built
  expect(DockerImage.fromBuild).not.toHaveBeenCalled();
});

test('Incorrect go version', () => {
  getGoBuildVersionMock.mockReturnValueOnce(false);

  const bundler = new Bundling({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2,
    architecture: Architecture.X86_64,
  });

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.GO_1_X.bundlingDockerImage });

  expect(tryBundle).toBe(false);
});


test('Custom bundling docker image', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    dockerImage: DockerImage.fromRegistry('my-custom-image'),
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      image: { image: 'my-custom-image' },
    }),
  });
});

test('Go build flags can be passed', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
    environment: {
      KEY: 'value',
    },
    goBuildFlags: ['-ldflags "-s -w"'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
        CGO_ENABLED: '0',
        GO111MODULE: 'on',
        GOARCH: 'amd64',
        GOOS: 'linux',
      },
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap -ldflags "-s -w" ./cmd/api',
        ].join(' && '),
      ],
    }),
  });
});

test('AssetHashType can be specified', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    moduleDir,
    environment: {
      KEY: 'value',
    },
    assetHashType: AssetHashType.OUTPUT,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
        CGO_ENABLED: '0',
        GO111MODULE: 'on',
        GOARCH: 'amd64',
        GOOS: 'linux',
      },
      command: [
        'bash', '-c',
        [
          'go build -o /asset-output/bootstrap ./cmd/api',
        ].join(' && '),
      ],
    }),
  });
});


test('with command hooks', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2,
    architecture: Architecture.X86_64,
    commandHooks: {
      beforeBundling(inputDir: string, outputDir: string): string[] {
        return [
          `echo hello > ${inputDir}/a.txt`,
          `cp ${inputDir}/a.txt ${outputDir}`,
        ];
      },
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/b.txt ${outputDir}/txt`];
      },
    },
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(moduleDir), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringMatching(/^echo hello > \/asset-input\/a.txt && cp \/asset-input\/a.txt \/asset-output && .+ && cp \/asset-input\/b.txt \/asset-output\/txt$/),
      ],
    }),
  });
});

test('Custom bundling entrypoint', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
    }),
  });
});

test('Custom bundling volumes', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
    }),
  });
});

test('Custom bundling volumesFrom', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    volumesFrom: ['777f7dc92da7'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      volumesFrom: ['777f7dc92da7'],
    }),
  });
});

test('Custom bundling workingDirectory', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    workingDirectory: '/working-directory',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      workingDirectory: '/working-directory',
    }),
  });
});

test('Custom bundling user', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    user: 'user:group',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      user: 'user:group',
    }),
  });
});

test('Custom bundling securityOpt', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    securityOpt: 'no-new-privileges',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      securityOpt: 'no-new-privileges',
    }),
  });
});

test('Custom bundling network', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    network: 'host',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      network: 'host',
    }),
  });
});

test('Custom bundling file copy variant', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
    architecture: Architecture.X86_64,
    forcedDockerBundling: true,
    bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
    }),
  });
});
