import { exec } from '../lib/cli';
import { LogLevel, setLogLevel } from '../lib/logging';

// Store original version module exports so we don't conflict with other tests
const originalVersion = jest.requireActual('../lib/version');

// Mock the dependencies
jest.mock('../lib/logging', () => ({
  LogLevel: {
    DEBUG: 'DEBUG',
    TRACE: 'TRACE',
  },
  setLogLevel: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  print: jest.fn(),
  data: jest.fn(),
}));

jest.mock('@aws-cdk/cx-api');
jest.mock('@jsii/check-node/run');
jest.mock('../lib/platform-warnings', () => ({
  checkForPlatformWarnings: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../lib/settings', () => ({
  Configuration: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(undefined),
    settings: {
      get: jest.fn().mockReturnValue(undefined),
    },
    context: {
      get: jest.fn().mockReturnValue([]),
    },
  })),
}));

jest.mock('../lib/notices', () => ({
  Notices: {
    create: jest.fn().mockReturnValue({
      refresh: jest.fn().mockResolvedValue(undefined),
      display: jest.fn(),
    }),
  },
}));

jest.mock('../lib/parse-command-line-arguments', () => ({
  parseCommandLineArguments: jest.fn().mockImplementation((args) => Promise.resolve({
    _: ['version'],
    verbose: args.includes('-v') ? (
      args.filter((arg: string) => arg === '-v').length
    ) : args.includes('--verbose') ? (
      parseInt(args[args.indexOf('--verbose') + 1]) || true
    ) : undefined,
  })),
}));

describe('exec verbose flag tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up version module for our tests
    jest.mock('../lib/version', () => ({
      ...originalVersion,
      DISPLAY_VERSION: 'test-version',
      displayVersionMessage: jest.fn().mockResolvedValue(undefined),
    }));
  });

  afterEach(() => {
    // Restore the version module to its original state
    jest.resetModules();
    jest.setMock('../lib/version', originalVersion);
  });

  test('should not set log level when no verbose flag is present', async () => {
    await exec(['version']);
    expect(setLogLevel).not.toHaveBeenCalled();
  });

  test('should set DEBUG level with single -v flag', async () => {
    await exec(['-v', 'version']);
    expect(setLogLevel).toHaveBeenCalledWith(LogLevel.DEBUG);
  });

  test('should set TRACE level with double -v flag', async () => {
    await exec(['-v', '-v', 'version']);
    expect(setLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });

  test('should set DEBUG level with --verbose=1', async () => {
    await exec(['--verbose', '1', 'version']);
    expect(setLogLevel).toHaveBeenCalledWith(LogLevel.DEBUG);
  });

  test('should set TRACE level with --verbose=2', async () => {
    await exec(['--verbose', '2', 'version']);
    expect(setLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });

  test('should set TRACE level with verbose level > 2', async () => {
    await exec(['--verbose', '3', 'version']);
    expect(setLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });
});
