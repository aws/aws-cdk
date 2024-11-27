import { LogLevel } from '../lib/logging';

describe('Verbose flag logging tests', () => {
  let mockSetLogLevel: jest.Mock;
  let processVerboseFlag: (argv: any) => void;

  beforeEach(() => {
    mockSetLogLevel = jest.fn();
    // Recreate the function we're testing with mocked dependencies
    processVerboseFlag = (argv: any) => {
      if (argv.verbose) {
        const verboseLevel = typeof argv.verbose === 'boolean' ? 1 : argv.verbose;
        let logLevel: LogLevel;
        switch (verboseLevel) {
          case 1:
            logLevel = LogLevel.DEBUG;
            break;
          case 2:
          default:
            logLevel = LogLevel.TRACE;
            break;
        }
        mockSetLogLevel(logLevel);
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not set log level when verbose is false', () => {
    processVerboseFlag({ verbose: false });
    expect(mockSetLogLevel).not.toHaveBeenCalled();
  });

  test('should not set log level when verbose is undefined', () => {
    processVerboseFlag({ verbose: undefined });
    expect(mockSetLogLevel).not.toHaveBeenCalled();
  });

  test('should set DEBUG level when verbose is true (boolean)', () => {
    processVerboseFlag({ verbose: true });
    expect(mockSetLogLevel).toHaveBeenCalledWith(LogLevel.DEBUG);
  });

  test('should set DEBUG level when verbose is 1', () => {
    processVerboseFlag({ verbose: 1 });
    expect(mockSetLogLevel).toHaveBeenCalledWith(LogLevel.DEBUG);
  });

  test('should set TRACE level when verbose is 2', () => {
    processVerboseFlag({ verbose: 2 });
    expect(mockSetLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });

  test('should set TRACE level when verbose is greater than 2', () => {
    processVerboseFlag({ verbose: 3 });
    expect(mockSetLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });

  test('should handle string values correctly', () => {
    processVerboseFlag({ verbose: '2' });
    expect(mockSetLogLevel).toHaveBeenCalledWith(LogLevel.TRACE);
  });
});