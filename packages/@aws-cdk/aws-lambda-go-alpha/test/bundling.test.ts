
import child_process from 'child_process';
import os from 'os';
import path from 'path';
import { AssetHashType, BundlingFileAccess, DockerImage } from 'aws-cdk-lib';
import { Architecture, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
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
    run: () => { },
    toJSON: () => 'build-image',
  });

  getGoBuildVersionMock.mockReturnValue(true);
});

const moduleDir = '/project/go.mod';
const entry = '/project/cmd/api';

test('bundling', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
    environment: {
      KEY: 'value',
    },
    network: 'host',
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
          "go build -o '/asset-output/bootstrap' './cmd/api'",
        ].join(' && '),
      ],
    }),
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-go-alpha\/lib\/docker$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-go/),
    }),
    platform: 'linux/amd64',
    network: 'host',
  }));
});

test('bundling with file as entry', () => {
  Bundling.bundle({
    entry: '/project/main.go',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './main.go'",
        ].join(' && '),
      ],
    }),
  });
});

test('bundling with file in subdirectory as entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api/main.go',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api/main.go'",
        ].join(' && '),
      ],
    }),
  });
});

test('bundling with file other than main.go in subdirectory as entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api/api.go',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api/api.go'",
        ].join(' && '),
      ],
    }),
  });
});

test('bundling with moduleDir as directory', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir: '/project',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api'",
        ].join(' && '),
      ],
    }),
  });
});

test('escapes shell metacharacters in entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api;v2',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api;v2'",
        ].join(' && '),
      ],
    }),
  });
});

test('escapes single quotes in entry', () => {
  Bundling.bundle({
    entry: "/project/cmd/it's $(v2)",
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/it'\\''s $(v2)'",
        ].join(' && '),
      ],
    }),
  });
});

test('escapes backticks in entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api`v2`',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api`v2`'",
        ].join(' && '),
      ],
    }),
  });
});

test('escapes newlines in entry', () => {
  Bundling.bundle({
    entry: '/project/cmd/api\nv2',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          "go build -o '/asset-output/bootstrap' './cmd/api\nv2'",
        ].join(' && '),
      ],
    }),
  });
});

test('rejects entries outside the module root', () => {
  expect(() => new Bundling({
    entry: '/other/cmd/api',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  })).toThrow('entryPath ("/other/cmd/api") should be under projectRoot ("/project")');
});

test('rejects exact parent directory entry outside the module root', () => {
  expect(() => new Bundling({
    entry: '/project/..',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  })).toThrow('entryPath ("/project/..") should be under projectRoot ("/project")');
});

test('rejects sibling entries when moduleDir is a directory', () => {
  expect(() => new Bundling({
    entry: '/project-sibling/cmd/api',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir: '/project',
  })).toThrow('entryPath ("/project-sibling/cmd/api") should be under projectRoot ("/project")');
});

test('go with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');
  Bundling.bundle({
    entry: 'C:\\my-project\\cmd\\api',
    runtime: Runtime.PROVIDED_AL2023,
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

test('Windows local bundling quotes paths without caret escaping', () => {
  const bundler = new Bundling({
    entry: 'C:\\my-project\\cmd\\api (v2)&demo',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir: 'C:\\my-project\\go.mod',
  });

  const command = bundler.createBundlingCommand('C:\\my-project', 'C:\\out dir', 'win32');

  expect(command).toBe('go build -o "C:\\out dir\\bootstrap" "./cmd/api (v2)&demo"');
  expect(command).not.toContain('^');
});

test('Windows local bundling rejects percent expansion in path arguments', () => {
  const bundler = new Bundling({
    entry: 'C:\\my-project\\cmd\\api%VERSION%',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir: 'C:\\my-project\\go.mod',
  });

  expect(() => bundler.createBundlingCommand('C:\\my-project', 'C:\\out dir', 'win32'))
    .toThrow('Path argument ("./cmd/api%VERSION%") cannot contain \'"\', \'%\', or control characters on Windows local bundling');
});

test('Windows local bundling rejects control characters in path arguments', () => {
  const bundler = new Bundling({
    entry: 'C:\\my-project\\cmd\\api\nv2',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir: 'C:\\my-project\\go.mod',
  });

  expect(() => bundler.createBundlingCommand('C:\\my-project', 'C:\\out dir', 'win32'))
    .toThrow('Path argument ("./cmd/api\\nv2") cannot contain \'"\', \'%\', or control characters on Windows local bundling');
});

test('POSIX local bundling preserves backslashes in output paths', () => {
  const bundler = new Bundling({
    entry,
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
  });

  const command = bundler.createBundlingCommand('/asset-input', '/tmp/my\\project/cdk.out', 'linux');

  expect(command).toBe("go build -o '/tmp/my\\project/cdk.out/bootstrap' './cmd/api'");
});

test('with Docker build args', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
    moduleDir,
    forcedDockerBundling: true,
    buildArgs: {
      HELLO: 'WORLD',
    },
  });
  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-go-alpha\/lib\/docker$/), expect.objectContaining({
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
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
  });

  expect(bundler.local).toBeDefined();

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.PROVIDED_AL2023.bundlingImage });
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

test('Local bundling escapes shell metacharacters in entry', () => {
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
    entry: '/project/cmd/api;v2',
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
  });

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.PROVIDED_AL2023.bundlingImage });
  expect(tryBundle).toBe(true);

  expect(spawnSyncMock).toHaveBeenCalledWith(
    'bash',
    [
      '-c',
      "go build -o '/outdir/bootstrap' './cmd/api;v2'",
    ],
    expect.objectContaining({
      cwd: expect.stringContaining('/project'),
    }),
  );
});

test('Incorrect go version', () => {
  getGoBuildVersionMock.mockReturnValueOnce(false);

  const bundler = new Bundling({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2023,
    architecture: Architecture.X86_64,
  });

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.PROVIDED_AL2023.bundlingImage });

  expect(tryBundle).toBe(false);
});

test('Custom bundling docker image', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
          "go build -o '/asset-output/bootstrap' -ldflags \"-s -w\" './cmd/api'",
        ].join(' && '),
      ],
    }),
  });
});

test('AssetHashType can be specified', () => {
  Bundling.bundle({
    entry,
    runtime: Runtime.PROVIDED_AL2023,
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
          "go build -o '/asset-output/bootstrap' './cmd/api'",
        ].join(' && '),
      ],
    }),
  });
});

test('with command hooks', () => {
  Bundling.bundle({
    entry,
    moduleDir,
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
    runtime: Runtime.PROVIDED_AL2023,
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
