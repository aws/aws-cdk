import { LogLevel, log, setLogLevel, setCI, data, print, error, warning, success, debug, trace, prefix, withCorkedLogging } from '../lib/logging';

describe('logging', () => {
  // Mock streams to capture output
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  beforeEach(() => {
    // Reset log level before each test
    setLogLevel(LogLevel.INFO);
    setCI(false);

    // Create mock functions to capture output
    mockStdout = jest.fn();
    mockStderr = jest.fn();

    // Just mock the write methods directly
    jest.spyOn(process.stdout, 'write').mockImplementation((chunk: any) => {
      mockStdout(chunk.toString());
      return true;
    });

    jest.spyOn(process.stderr, 'write').mockImplementation((chunk: any) => {
      mockStderr(chunk.toString());
      return true;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('stream selection', () => {
    test('data() always writes to stdout', () => {
      data('test message');
      expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('test message\n'));
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('error() always writes to stderr', () => {
      error('test error');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('test error\n'));
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stderr by default', () => {
      print('test print');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('test print\n'));
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stdout in CI mode', () => {
      setCI(true);
      print('test print');
      expect(mockStdout).toHaveBeenCalledWith(expect.stringContaining('test print\n'));
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    test('respects log level settings', () => {
      setLogLevel(LogLevel.ERROR);
      error('error message');
      warning('warning message');
      print('print message');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('error message\n'));
      expect(mockStderr).not.toHaveBeenCalledWith(expect.stringContaining('warning message\n'));
      expect(mockStderr).not.toHaveBeenCalledWith(expect.stringContaining('print message\n'));
    });

    test('debug messages only show at debug level', () => {
      setLogLevel(LogLevel.INFO);
      debug('debug message');
      expect(mockStderr).not.toHaveBeenCalled();

      setLogLevel(LogLevel.DEBUG);
      debug('debug message');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('debug message\n'));
    });

    test('trace messages only show at trace level', () => {
      setLogLevel(LogLevel.DEBUG);
      trace('trace message');
      expect(mockStderr).not.toHaveBeenCalled();

      setLogLevel(LogLevel.TRACE);
      trace('trace message');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('trace message\n'));
    });
  });

  describe('message formatting', () => {
    test('formats messages with multiple arguments', () => {
      print('Value: %d, String: %s', 42, 'test');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('Value: 42, String: test\n'));
    });

    test('handles prefix correctly', () => {
      const prefixedLog = prefix('PREFIX');
      prefixedLog('test message');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('PREFIX test message\n'));
    });

    test('handles custom styles', () => {
      success('success message');
      // Note: actual styling will depend on chalk, but we can verify the message is there
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('success message\n'));
    });
  });

  describe('corked logging', () => {
    test('buffers messages when corked', async () => {
      await withCorkedLogging(async () => {
        print('message 1');
        print('message 2');
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('message 1\n'));
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('message 2\n'));
    });

    test('handles nested corking correctly', async () => {
      await withCorkedLogging(async () => {
        print('outer 1');
        await withCorkedLogging(async () => {
          print('inner');
        });
        print('outer 2');
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledTimes(3);
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('outer 1\n'));
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('inner\n'));
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('outer 2\n'));
    });
  });

  describe('backward compatibility', () => {
    test('handles old numeric log levels', () => {
      setLogLevel(0); // Old DEFAULT level
      print('info message');
      debug('debug message');

      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('info message\n'));
      expect(mockStderr).not.toHaveBeenCalledWith(expect.stringContaining('debug message\n'));
    });
  });

  describe('timestamp and prefix handling', () => {
    test('adds timestamp when requested', () => {
      log({
        level: LogLevel.INFO,
        message: 'test message',
        timestamp: true,
      });
      expect(mockStderr).toHaveBeenCalledWith(expect.stringMatching(/\[\d{2}:\d{2}:\d{2}\] test message\n/));
    });

    test('combines timestamp and prefix correctly', () => {
      log({
        level: LogLevel.INFO,
        message: 'test message',
        timestamp: true,
        prefix: 'PREFIX',
      });
      expect(mockStderr).toHaveBeenCalledWith(expect.stringMatching(/\[\d{2}:\d{2}:\d{2}\] PREFIX test message\n/));
    });
  });
});