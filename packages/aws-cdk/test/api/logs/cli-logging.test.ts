import { setIoMessageThreshold, setCI, data, print, error, warning, debug, trace, withCorkedLogging } from '../../../lib/logging';

describe('logging', () => {
  // Mock streams to capture output
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  // Helper function to strip ANSI codes
  const stripAnsi = (str: string): string => {
    const ansiRegex = /\u001b\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '');
  };

  beforeEach(() => {
    // Reset log level before each test
    setIoMessageThreshold('info');
    setCI(false);

    // Create mock functions to capture output
    mockStdout = jest.fn();
    mockStderr = jest.fn();

    // Mock the write methods directly and strip ANSI codes
    jest.spyOn(process.stdout, 'write').mockImplementation((chunk: any) => {
      mockStdout(stripAnsi(chunk.toString()));
      return true;
    });

    jest.spyOn(process.stderr, 'write').mockImplementation((chunk: any) => {
      mockStderr(stripAnsi(chunk.toString()));
      return true;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('stream selection', () => {
    test('data() always writes to stdout', async () => {
      await data('test message');
      expect(mockStdout).toHaveBeenCalledWith('test message\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('error() always writes to stderr', async () => {
      await error('test error');
      expect(mockStderr).toHaveBeenCalledWith('test error\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stderr by default', async () => {
      await print('test print');
      expect(mockStderr).toHaveBeenCalledWith('test print\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stdout in CI mode', async () => {
      setCI(true);
      await print('test print');
      expect(mockStdout).toHaveBeenCalledWith('test print\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    test('respects log level settings', async () => {
      setIoMessageThreshold('error');
      await error('error message');
      await warning('warning message');
      await print('print message');
      expect(mockStderr).toHaveBeenCalledWith('error message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message\n');
    });

    test('debug messages only show at debug level', async () => {
      setIoMessageThreshold('info');
      await debug('debug message');
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('debug');
      await debug('debug message');
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] debug message\n$/),
      );
    });

    test('trace messages only show at trace level', async () => {
      setIoMessageThreshold('debug');
      await trace('trace message');
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('trace');
      await trace('trace message');
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] trace message\n$/),
      );
    });
  });

  describe('corked logging', () => {
    test('buffers messages when corked', async () => {
      await withCorkedLogging(async () => {
        await print('message 1');
        await print('message 2');
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledWith('message 1\n');
      expect(mockStderr).toHaveBeenCalledWith('message 2\n');
    });

    test('handles nested corking correctly', async () => {
      await withCorkedLogging(async () => {
        await print('outer 1');
        await withCorkedLogging(async () => {
          await print('inner');
        });
        await print('outer 2');
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledTimes(3);
      expect(mockStderr).toHaveBeenCalledWith('outer 1\n');
      expect(mockStderr).toHaveBeenCalledWith('inner\n');
      expect(mockStderr).toHaveBeenCalledWith('outer 2\n');
    });
  });
});
