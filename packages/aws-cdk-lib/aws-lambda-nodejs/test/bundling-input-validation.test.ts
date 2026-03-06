import * as os from 'os';
import * as path from 'path';
import { Architecture, Code, Runtime } from '../../aws-lambda';
import { App, DockerImage, Stack } from '../../core';
import { Bundling } from '../lib/bundling';
import { PackageInstallation } from '../lib/package-installation';
import { validateShellSafe } from '../lib/util';

const STANDARD_RUNTIME = Runtime.NODEJS_20_X;

let stack: Stack;
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
  Bundling.clearEsbuildInstallationCache();
  Bundling.clearTscInstallationCache();

  stack = new Stack(new App(), 'TestStack');

  jest.spyOn(Code, 'fromAsset');
  jest.spyOn(PackageInstallation, 'detect').mockReturnValue({
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

const bundleProps = {
  entry: '/project/lib/handler.ts',
  projectRoot: '/project',
  depsLockFilePath: '/project/yarn.lock',
  runtime: STANDARD_RUNTIME,
  architecture: Architecture.X86_64,
};

// Values containing reserved characters that are not valid in bundling options
const INVALID_INPUTS = [
  'foo & bar',
  'foo; bar',
  'foo | bar',
  'foo `bar`',
  'foo $(bar)',
  'foo > bar',
  'foo < bar',
  '$(bar)',
  'foo && bar',
  'foo || bar',
  '{foo,bar}',
  'foo!bar',
];

describe('validateShellSafe', () => {
  test.each(INVALID_INPUTS)('rejects invalid input: %s', (input) => {
    expect(() => validateShellSafe(input, 'test')).toThrow(/Invalid characters/);
  });

  test('allows valid npm package names', () => {
    expect(() => validateShellSafe('@aws-sdk/*', 'test')).not.toThrow();
    expect(() => validateShellSafe('lodash', 'test')).not.toThrow();
    expect(() => validateShellSafe('@scope/my-package', 'test')).not.toThrow();
  });

  test('allows valid file paths', () => {
    expect(() => validateShellSafe('./my-shim.js', 'test')).not.toThrow();
    expect(() => validateShellSafe('/absolute/path/file.ts', 'test')).not.toThrow();
    expect(() => validateShellSafe('path with spaces/file.js', 'test')).not.toThrow();
  });

  test('allows valid esbuild flags', () => {
    expect(() => validateShellSafe('--keep-names', 'test')).not.toThrow();
    expect(() => validateShellSafe('.js=.mjs', 'test')).not.toThrow();
  });
});

describe('validateShellSafe edge cases', () => {
  test('rejects newline characters', () => {
    expect(() => validateShellSafe('foo\nbar', 'test')).toThrow(/Invalid characters/);
  });

  test('rejects carriage return characters', () => {
    expect(() => validateShellSafe('foo\rbar', 'test')).toThrow(/Invalid characters/);
  });

  test('rejects CRLF sequences', () => {
    expect(() => validateShellSafe('foo\r\nbar', 'test')).toThrow(/Invalid characters/);
  });

  test('allows empty strings', () => {
    expect(() => validateShellSafe('', 'test')).not.toThrow();
  });

  test('allows backslashes (valid in Windows paths)', () => {
    expect(() => validateShellSafe('C:\\project\\lib', 'test')).not.toThrow();
  });

  test('allows single and double quotes', () => {
    expect(() => validateShellSafe("it's", 'test')).not.toThrow();
    expect(() => validateShellSafe('"quoted"', 'test')).not.toThrow();
  });

  test('allows hash character', () => {
    expect(() => validateShellSafe('#comment', 'test')).not.toThrow();
  });

  test('rejects unicode characters', () => {
    expect(() => validateShellSafe('módule', 'test')).toThrow(/Invalid characters/);
    expect(() => validateShellSafe('日本語', 'test')).toThrow(/Invalid characters/);
  });

  test('allows tilde in paths', () => {
    expect(() => validateShellSafe('~/project/shim.js', 'test')).not.toThrow();
  });

  test('allows equals signs and colons', () => {
    expect(() => validateShellSafe('key=value', 'test')).not.toThrow();
    expect(() => validateShellSafe('.ext:loader', 'test')).not.toThrow();
  });
});

describe('newline handling in bundling options', () => {
  test('rejects newlines in externalModules', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['foo\nbar'],
    })).toThrow(/Invalid characters/);
  });

  test('rejects newlines in define keys', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      define: { 'FOO\nBAR': 'baz' },
    })).toThrow(/Invalid characters/);
  });

  test('rejects newlines in esbuildArgs values', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      esbuildArgs: { '--flag': 'val\nfoo' },
    })).toThrow(/Invalid characters/);
  });
});

describe('invalid input in externalModules', () => {
  test('rejects reserved characters in externalModules', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['foo & bar > output.txt'],
    })).toThrow(/Invalid characters/);
  });

  test('allows valid externalModules', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['@aws-sdk/*', 'lodash', '@smithy/*'],
    })).not.toThrow();
  });
});

describe('invalid input in define keys', () => {
  test('rejects reserved characters in define keys', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      define: { 'FOO & BAR': 'baz' },
    })).toThrow(/Invalid characters/);
  });

  test('allows valid define entries', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      define: { 'process.env.NODE_ENV': '"production"' },
    })).not.toThrow();
  });
});

describe('invalid input in loader', () => {
  test('rejects reserved characters in loader keys', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      loader: { '.png & foo': 'dataurl' },
    })).toThrow(/Invalid characters/);
  });

  test('rejects reserved characters in loader values', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      loader: { '.png': 'dataurl; foo' },
    })).toThrow(/Invalid characters/);
  });

  test('allows valid loader entries', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      loader: { '.png': 'dataurl', '.svg': 'text' },
    })).not.toThrow();
  });
});

describe('invalid input in inject', () => {
  test('rejects reserved characters in inject paths', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      inject: ['./shim.js & foo'],
    })).toThrow(/Invalid characters/);
  });

  test('allows valid inject paths', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      inject: ['./my-shim.js', './path/second-shim.js'],
    })).not.toThrow();
  });
});

describe('invalid input in esbuildArgs', () => {
  test('rejects reserved characters in esbuildArgs keys', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      esbuildArgs: { '--log-limit & foo': '0' },
    })).toThrow(/Invalid characters/);
  });

  test('rejects reserved characters in esbuildArgs values', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      esbuildArgs: { '--log-limit': '0; foo' },
    })).toThrow(/Invalid characters/);
  });

  test('allows valid esbuildArgs', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      esbuildArgs: { '--log-limit': '0', '--keep-names': true },
    })).not.toThrow();
  });
});

describe('banner and footer are safe via JSON.stringify', () => {
  test('allows banner with reserved characters since JSON.stringify wraps them', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      banner: '/* banner */ & test',
    })).not.toThrow();
  });

  test('allows footer with semicolons since JSON.stringify wraps them', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      footer: '"use strict";',
    })).not.toThrow();
  });

  test('allows typical banner and footer', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      banner: '/* comments */',
      footer: '/* end */',
    })).not.toThrow();
  });
});

describe('valid bundling configurations', () => {
  test('accepts all common externalModules patterns', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: [
        '@aws-sdk/*',
        '@aws-sdk/client-s3',
        '@smithy/*',
        'aws-sdk',
        'lodash',
        '@scope/my-package',
        'my-external-dep',
        'abc',
      ],
    })).not.toThrow();
  });

  test('accepts all common loader patterns', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      loader: {
        '.png': 'dataurl',
        '.gif': 'file',
        '.svg': 'text',
        '.json': 'json',
        '.css': 'css',
        '.woff2': 'base64',
      },
    })).not.toThrow();
  });

  test('accepts typical define entries', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_URL': '"https://api.example.com"',
        'process.env.BOOL': 'true',
        'process.env.NUMBER': '7777',
        'global.DEBUG': 'false',
        '__VERSION__': '"1.0.0"',
      },
    })).not.toThrow();
  });

  test('accepts typical inject paths', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      inject: [
        './my-shim.js',
        './path with space/second-shim.js',
        './polyfills/process.js',
        '../shared/env-shim.ts',
      ],
    })).not.toThrow();
  });

  test('accepts typical esbuildArgs', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      esbuildArgs: {
        '--log-limit': '0',
        '--resolve-extensions': '.ts,.js',
        '--keep-names': true,
        '--splitting': true,
        '--out-extension': '.js=.mjs',
        '--alias': 'react=preact/compat',
        '--tree-shaking': 'true',
      },
    })).not.toThrow();
  });

  test('accepts typical banner and footer', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      banner: '/* comments */',
      footer: '/* end */',
    })).not.toThrow();
  });

  test('accepts banner with use strict and semicolons', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      banner: '"use strict";',
    })).not.toThrow();
  });

  test('accepts all options combined', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['@aws-sdk/*', 'lodash'],
      loader: { '.png': 'dataurl', '.svg': 'text' },
      define: { 'process.env.NODE_ENV': '"production"' },
      inject: ['./my-shim.js'],
      esbuildArgs: { '--log-limit': '0', '--keep-names': true },
      banner: '/* Copyright 2024 */',
      footer: '/* EOF */',
    })).not.toThrow();
  });
});

describe('invalid input with multiple reserved characters', () => {
  test('rejects multiple reserved characters in externalModules', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: [
        'lodash',
        'lodash & foo $(bar)',
      ],
    })).toThrow(/Invalid characters/);
  });

  test('rejects pipe in externalModules', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['foo | bar | baz'],
    })).toThrow(/Invalid characters/);
  });

  test('rejects backticks in define keys', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      define: { '`foo`': 'bar' },
    })).toThrow(/Invalid characters/);
  });
});

describe('validation applies to Docker bundling path', () => {
  test('rejects invalid externalModules with forceDockerBundling', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      externalModules: ['foo & bar'],
    })).toThrow(/Invalid characters/);
  });

  test('rejects invalid define with forceDockerBundling', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      define: { 'FOO $(bar)': 'baz' },
    })).toThrow(/Invalid characters/);
  });

  test('rejects invalid esbuildArgs with forceDockerBundling', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      esbuildArgs: { '--flag': 'val; foo' },
    })).toThrow(/Invalid characters/);
  });
});

describe('validation applies to local bundling path', () => {
  test('rejects invalid externalModules on local bundling', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      externalModules: ['foo; bar'],
    })).toThrow(/Invalid characters/);
  });
});

describe('validateShellSafe covers tsconfig compiler option values', () => {
  test('rejects reserved characters in string compiler option values', () => {
    expect(() => validateShellSafe('ES2022; foo', 'tsconfig compilerOption \'target\'')).toThrow(/Invalid characters/);
    expect(() => validateShellSafe('CommonJS & foo', 'tsconfig compilerOption \'module\'')).toThrow(/Invalid characters/);
    expect(() => validateShellSafe('./ $(foo)', 'tsconfig compilerOption \'outDir\'')).toThrow(/Invalid characters/);
  });

  test('rejects reserved characters in array compiler option values', () => {
    expect(() => validateShellSafe('es2022 | foo', 'tsconfig compilerOption \'lib\'')).toThrow(/Invalid characters/);
  });

  test('allows valid compiler option values', () => {
    expect(() => validateShellSafe('ES2022', 'tsconfig compilerOption \'target\'')).not.toThrow();
    expect(() => validateShellSafe('CommonJS', 'tsconfig compilerOption \'module\'')).not.toThrow();
    expect(() => validateShellSafe('./', 'tsconfig compilerOption \'outDir\'')).not.toThrow();
    expect(() => validateShellSafe('es2022', 'tsconfig compilerOption \'lib\'')).not.toThrow();
    expect(() => validateShellSafe('lf', 'tsconfig compilerOption \'newLine\'')).not.toThrow();
  });
});

describe('validation applies on Windows', () => {
  let osPlatformMock: jest.SpyInstance;

  beforeEach(() => {
    osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');
    jest.spyOn(path, 'basename').mockReturnValueOnce('package-lock.json');
    jest.spyOn(path, 'relative')
      .mockReturnValueOnce('lib\\handler.ts')
      .mockReturnValueOnce('yarn.lock');
  });

  afterEach(() => {
    osPlatformMock.mockRestore();
  });

  test('rejects reserved characters in externalModules on Windows', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      externalModules: ['foo & bar'],
    })).toThrow(/Invalid characters/);
  });

  test('rejects pipe in externalModules on Windows', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      externalModules: ['foo | bar'],
    })).toThrow(/Invalid characters/);
  });

  test('rejects redirect in define keys on Windows', () => {
    expect(() => Bundling.bundle(stack, {
      ...bundleProps,
      forceDockerBundling: true,
      define: { 'FOO > bar': 'baz' },
    })).toThrow(/Invalid characters/);
  });
});
