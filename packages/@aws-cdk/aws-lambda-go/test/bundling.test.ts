import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, DockerImage } from '@aws-cdk/core';
import { Bundling } from '../lib/bundling';
import * as util from '../lib/util';

jest.mock('@aws-cdk/aws-lambda');
const fromAssetMock = jest.spyOn(DockerImage, 'fromBuild');
let getGoBuildVersionMock = jest.spyOn(util, 'getGoBuildVersion');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  Bundling.clearRunsLocallyCache();
  getGoBuildVersionMock.mockReturnValue(true);
  fromAssetMock.mockReturnValue({
    image: 'built-image',
    cp: () => 'built-image',
    run: () => {},
    toJSON: () => 'build-image',
  });
});

const moduleDir = '/project/go.mod';
const entry = '/project/cmd/api';

test('bundling', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.GO_1_X,
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
});

test('bundling with file as entry', () => {
  Bundling.bundle({
    entry: '/project/main.go',
    runtime: Runtime.GO_1_X,
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
    moduleDir,
    forcedDockerBundling: true,
    buildArgs: {
      HELLO: 'WORLD',
    },
  });
  expect(fromAssetMock).toHaveBeenCalledWith(expect.stringMatching(/lib$/), expect.objectContaining({
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
  expect(fromAssetMock).not.toHaveBeenCalled();
});

test('Incorrect go version', () => {
  getGoBuildVersionMock.mockReturnValueOnce(false);

  const bundler = new Bundling({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2,
  });

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.GO_1_X.bundlingDockerImage });

  expect(tryBundle).toBe(false);
});


test('Custom bundling docker image', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.GO_1_X,
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
