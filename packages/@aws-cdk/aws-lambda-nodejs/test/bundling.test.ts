import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Architecture, Code, Runtime, RuntimeFamily } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingFileAccess, DockerImage } from '@aws-cdk/core';
import { version as delayVersion } from 'delay/package.json';
import { Bundling } from '../lib/bundling';
import { PackageInstallation } from '../lib/package-installation';
import { Charset, LogLevel, OutputFormat, SourceMapMode } from '../lib/types';
import * as util from '../lib/util';


let detectPackageInstallationMock: jest.SpyInstance<PackageInstallation | undefined>;
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
  Bundling.clearEsbuildInstallationCache();
  Bundling.clearTscInstallationCache();

  jest.spyOn(Code, 'fromAsset');

  detectPackageInstallationMock = jest.spyOn(PackageInstallation, 'detect').mockReturnValue({
    isLocal: true,
    version: '0.8.8',
  });

  jest.spyOn(DockerImage, 'fromBuild').mockReturnValue({
    image: 'built-image',
    cp: () => 'dest-path',
    run: () => {},
    toJSON: () => 'built-image',
  });
});

let projectRoot = '/project';
let depsLockFilePath = '/project/yarn.lock';
let entry = '/project/lib/handler.ts';
let tsconfig = '/project/lib/custom-tsconfig.ts';

test('esbuild bundling in Docker', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    environment: {
      KEY: 'value',
    },
    loader: {
      '.png': 'dataurl',
    },
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
      },
      command: [
        'bash', '-c',
        'esbuild --bundle "/asset-input/lib/handler.ts" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:aws-sdk --loader:.png=dataurl',
      ],
      workingDirectory: '/',
    }),
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-nodejs\/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-nodejs/),
    }),
    platform: 'linux/amd64',
  }));
});

test('esbuild bundling with handler named index.ts', () => {
  Bundling.bundle({
    entry: '/project/lib/index.ts',
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'esbuild --bundle "/asset-input/lib/index.ts" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild bundling with tsx handler', () => {
  Bundling.bundle({
    entry: '/project/lib/handler.tsx',
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'esbuild --bundle "/asset-input/lib/handler.tsx" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');
  // Mock path.basename() because it cannot extract the basename of a Windows
  // path when running on Linux
  jest.spyOn(path, 'basename').mockReturnValueOnce('package-lock.json');
  jest.spyOn(path, 'relative').mockReturnValueOnce('lib\\entry.ts').mockReturnValueOnce('package-lock.json');

  Bundling.bundle({
    entry: 'C:\\my-project\\lib\\entry.ts',
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    projectRoot: 'C:\\my-project',
    depsLockFilePath: 'C:\\my-project\\package-lock.json',
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringContaining('/lib/entry.ts'),
      ]),
    }),
  }));

  osPlatformMock.mockRestore();
});

test('esbuild bundling with externals and dependencies', () => {
  const packageLock = path.join(__dirname, '..', 'package-lock.json');
  Bundling.bundle({
    entry: __filename,
    projectRoot: path.dirname(packageLock),
    depsLockFilePath: packageLock,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    externalModules: ['abc'],
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(packageLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/test/bundling.test.js" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:abc --external:delay',
          `echo \'{\"dependencies\":{\"delay\":\"${delayVersion}\"}}\' > "/asset-output/package.json"`,
          'cp "/asset-input/package-lock.json" "/asset-output/package-lock.json"',
          'cd "/asset-output"',
          'npm ci',
        ].join(' && '),
      ],
    }),
  });
});

test('esbuild bundling with esbuild options', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    minify: true,
    sourceMap: true,
    sourcesContent: false,
    target: 'es2020',
    loader: {
      '.png': 'dataurl',
    },
    logLevel: LogLevel.SILENT,
    keepNames: true,
    tsconfig,
    metafile: true,
    banner: '/* comments */',
    footer: '/* comments */',
    charset: Charset.UTF8,
    forceDockerBundling: true,
    mainFields: ['module', 'main'],
    define: {
      'process.env.KEY': JSON.stringify('VALUE'),
      'process.env.BOOL': 'true',
      'process.env.NUMBER': '7777',
      'process.env.STRING': JSON.stringify('this is a "test"'),
    },
    format: OutputFormat.ESM,
    inject: ['./my-shim.js'],
    esbuildArgs: {
      '--log-limit': '0',
      '--resolve-extensions': '.ts,.js',
      '--splitting': true,
      '--keep-names': '',
    },
  });

  // Correctly bundles with esbuild
  const defineInstructions = '--define:process.env.KEY="\\"VALUE\\"" --define:process.env.BOOL="true" --define:process.env.NUMBER="7777" --define:process.env.STRING="\\"this is a \\\\\\"test\\\\\\"\\""';
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash',
        '-c',
        [
          'esbuild --bundle "/asset-input/lib/handler.ts"',
          '--target=es2020 --platform=node --format=esm --outfile="/asset-output/index.mjs"',
          '--minify --sourcemap --sources-content=false --external:aws-sdk --loader:.png=dataurl',
          defineInstructions,
          '--log-level=silent --keep-names --tsconfig=/asset-input/lib/custom-tsconfig.ts',
          '--metafile=/asset-output/index.meta.json --banner:js="/* comments */" --footer:js="/* comments */"',
          '--charset=utf8 --main-fields=module,main --inject:./my-shim.js',
          '--log-limit="0" --resolve-extensions=".ts,.js" --splitting --keep-names',
        ].join(' '),
      ],
    }),
  });

  // Make sure that the define instructions are working as expected with the esbuild CLI
  const bundleProcess = util.exec('bash', ['-c', `npx esbuild --bundle ${`${__dirname}/integ-handlers/define.ts`} ${defineInstructions}`]);
  expect(bundleProcess.stdout.toString()).toMatchSnapshot();
});

test('throws with ESM and NODEJS_12_X', () => {
  expect(() => Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_12_X,
    architecture: Architecture.X86_64,
    format: OutputFormat.ESM,
  })).toThrow(/ECMAScript module output format is not supported by the nodejs12.x runtime/);
});

test('esbuild bundling source map default', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    sourceMap: true,
    sourceMapMode: SourceMapMode.DEFAULT,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/lib/handler.ts" --target=node14 --platform=node --outfile="/asset-output/index.js"',
          '--sourcemap --external:aws-sdk',
        ].join(' '),
      ],
    }),
  });
});

test('esbuild bundling without aws-sdk v3 when use greater than or equal Runtime.NODEJS_18_X', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_18_X,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'esbuild --bundle "/asset-input/lib/handler.ts" --target=node18 --platform=node --outfile="/asset-output/index.js" --external:@aws-sdk/*',
      ],
    }),
  });
});

test('esbuild bundling source map inline', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    sourceMap: true,
    sourceMapMode: SourceMapMode.INLINE,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/lib/handler.ts" --target=node14 --platform=node --outfile="/asset-output/index.js"',
          '--sourcemap=inline --external:aws-sdk',
        ].join(' '),
      ],
    }),
  });
});

test('esbuild bundling is correctly done with custom runtime matching predefined runtime', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: new Runtime('nodejs14.x', RuntimeFamily.NODEJS, { supportsInlineCode: true }),
    architecture: Architecture.X86_64,
    sourceMapMode: SourceMapMode.INLINE,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/lib/handler.ts" --target=node14 --platform=node --outfile="/asset-output/index.js"',
          '--sourcemap=inline --external:aws-sdk',
        ].join(' '),
      ],
    }),
  });
});

test('esbuild bundling source map enabled when only source map mode exists', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    sourceMapMode: SourceMapMode.INLINE,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/lib/handler.ts" --target=node14 --platform=node --outfile="/asset-output/index.js"',
          '--sourcemap=inline --external:aws-sdk',
        ].join(' '),
      ],
    }),
  });
});

test('esbuild bundling throws when sourceMapMode used with false sourceMap', () => {
  expect(() => {
    Bundling.bundle({
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: Runtime.NODEJS_14_X,
      architecture: Architecture.X86_64,
      sourceMap: false,
      sourceMapMode: SourceMapMode.INLINE,
    });
  }).toThrow('sourceMapMode cannot be used when sourceMap is false');
});

test('Detects yarn.lock', () => {
  const yarnLock = path.join(__dirname, '..', 'yarn.lock');
  Bundling.bundle({
    entry: __filename,
    projectRoot: path.dirname(yarnLock),
    depsLockFilePath: yarnLock,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(yarnLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/yarn\.lock.+yarn install --no-immutable/),
      ]),
    }),
  });
});

test('Detects pnpm-lock.yaml', () => {
  const pnpmLock = '/project/pnpm-lock.yaml';
  Bundling.bundle({
    entry: __filename,
    projectRoot,
    depsLockFilePath: pnpmLock,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(pnpmLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/echo '' > "\/asset-output\/pnpm-workspace.yaml\".+pnpm-lock\.yaml.+pnpm install --config.node-linker=hoisted --config.package-import-method=clone-or-copy && rm "\/asset-output\/node_modules\/.modules.yaml"/),
      ]),
    }),
  });
});

test('with Docker build args', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    buildArgs: {
      HELLO: 'WORLD',
    },
    forceDockerBundling: true,
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      HELLO: 'WORLD',
    }),
  }));
});

test('Local bundling', () => {
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const bundler = new Bundling({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    environment: {
      KEY: 'value',
    },
    logLevel: LogLevel.ERROR,
  });

  expect(bundler.local).toBeDefined();

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.NODEJS_14_X.bundlingDockerImage });
  expect(tryBundle).toBe(true);

  expect(spawnSyncMock).toHaveBeenCalledWith(
    'bash',
    expect.arrayContaining(['-c', expect.stringContaining(entry)]),
    expect.objectContaining({
      env: expect.objectContaining({ KEY: 'value' }),
      cwd: '/project',
    }),
  );

  // Docker image is not built
  expect(DockerImage.fromBuild).not.toHaveBeenCalled();

  spawnSyncMock.mockRestore();
});


test('Incorrect esbuild version', () => {
  detectPackageInstallationMock.mockReturnValueOnce({
    isLocal: true,
    version: '3.4.5',
  });

  const bundler = new Bundling({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
  });

  expect(() => bundler.local?.tryBundle('/outdir', {
    image: Runtime.NODEJS_14_X.bundlingImage,
  })).toThrow(/Expected esbuild version 0.x but got 3.4.5/);
});

test('Custom bundling docker image', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    dockerImage: DockerImage.fromRegistry('my-custom-image'),
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      image: { image: 'my-custom-image' },
    }),
  });
});

test('with command hooks', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
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
      beforeInstall() {
        return [];
      },
    },
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringMatching(/^echo hello > \/asset-input\/a.txt && cp \/asset-input\/a.txt \/asset-output && .+ && cp \/asset-input\/b.txt \/asset-output\/txt$/),
      ],
    }),
  });
});

test('esbuild bundling with projectRoot', () => {
  Bundling.bundle({
    entry: '/project/lib/index.ts',
    projectRoot: '/project',
    depsLockFilePath,
    tsconfig,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'esbuild --bundle "/asset-input/lib/index.ts" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:aws-sdk --tsconfig=/asset-input/lib/custom-tsconfig.ts',
      ],
    }),
  });
});

test('esbuild bundling with projectRoot and externals and dependencies', () => {
  const repoRoot = path.join(__dirname, '../../../..');
  const packageLock = path.join(repoRoot, 'common', 'package-lock.json');
  Bundling.bundle({
    entry: __filename,
    projectRoot: repoRoot,
    depsLockFilePath: packageLock,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    externalModules: ['abc'],
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(repoRoot, {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'esbuild --bundle "/asset-input/packages/@aws-cdk/aws-lambda-nodejs/test/bundling.test.js" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:abc --external:delay',
          `echo \'{\"dependencies\":{\"delay\":\"${delayVersion}\"}}\' > "/asset-output/package.json"`,
          'cp "/asset-input/common/package-lock.json" "/asset-output/package-lock.json"',
          'cd "/asset-output"',
          'npm ci',
        ].join(' && '),
      ],
    }),
  });
});

test('esbuild bundling with pre compilations', () => {
  const packageLock = path.join(__dirname, '..', 'package-lock.json');

  Bundling.bundle({
    entry: __filename.replace('.js', '.ts'),
    projectRoot: path.dirname(packageLock),
    depsLockFilePath: packageLock,
    runtime: Runtime.NODEJS_14_X,
    preCompilation: true,
    forceDockerBundling: true,
    architecture: Architecture.X86_64,
  });

  const compilerOptions = util.getTsconfigCompilerOptions(findParentTsConfigPath(__dirname));

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(packageLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          `tsc \"/asset-input/test/bundling.test.ts\" ${compilerOptions} &&`,
          'esbuild --bundle \"/asset-input/test/bundling.test.js\" --target=node14 --platform=node --outfile=\"/asset-output/index.js\" --external:aws-sdk',
        ].join(' '),
      ],
    }),
  });

  expect(detectPackageInstallationMock).toHaveBeenCalledWith('typescript');
});

test('throws with pre compilation and not found tsconfig', () => {
  expect(() => {
    Bundling.bundle({
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: Runtime.NODEJS_14_X,
      forceDockerBundling: true,
      preCompilation: true,
      architecture: Architecture.X86_64,
    });
  }).toThrow('Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`');

});

test('with custom hash', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    forceDockerBundling: true,
    assetHash: 'custom',
    architecture: Architecture.X86_64,
  });

  // Correctly passes asset hash options
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), expect.objectContaining({
    assetHash: 'custom',
    assetHashType: AssetHashType.CUSTOM,
  }));
});

test('Custom bundling entrypoint', () => {
  Bundling.bundle({
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
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
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_14_X,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
    }),
  });
});

function findParentTsConfigPath(dir: string, depth: number = 1, limit: number = 5): string {
  const target = path.join(dir, 'tsconfig.json');
  if (fs.existsSync(target)) {
    return target;
  } else if (depth < limit) {
    return findParentTsConfigPath(path.join(dir, '..'), depth + 1, limit);
  }

  throw new Error(`No \`package.json\` file found within ${depth} parent directories`);
}
