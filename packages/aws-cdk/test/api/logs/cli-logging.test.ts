import { setIoMessageThreshold, setCI, data, print, info, success, highlight, error, warning, debug, trace, withCorkedLogging } from '../../../lib/logging';

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
    test('data() always writes to stdout', () => {
      data('test message');
      expect(mockStdout).toHaveBeenCalledWith('test message\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('error() always writes to stderr', () => {
      error('test error');
      expect(mockStderr).toHaveBeenCalledWith('test error\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stderr by default', () => {
      print('test print');
      expect(mockStderr).toHaveBeenCalledWith('test print\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stdout in CI mode', () => {
      setCI(true);
      print('test print');
      expect(mockStdout).toHaveBeenCalledWith('test print\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    test('respects log level settings', () => {
      setIoMessageThreshold('error');
      error('error message');
      warning('warning message');
      print('print message');
      expect(mockStderr).toHaveBeenCalledWith('error message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message\n');
    });

    test('debug messages only show at debug level', () => {
      setIoMessageThreshold('info');
      debug('debug message');
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('debug');
      debug('debug message');
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] debug message\n$/),
      );
    });

    test('trace messages only show at trace level', () => {
      setIoMessageThreshold('debug');
      trace('trace message');
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('trace');
      trace('trace message');
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] trace message\n$/),
      );
    });
  });

  describe('corked logging', () => {
    test('buffers messages when corked', async () => {
      await withCorkedLogging(async () => {
        print('message 1');
        print('message 2');
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledWith('message 1\n');
      expect(mockStderr).toHaveBeenCalledWith('message 2\n');
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
      expect(mockStderr).toHaveBeenCalledWith('outer 1\n');
      expect(mockStderr).toHaveBeenCalledWith('inner\n');
      expect(mockStderr).toHaveBeenCalledWith('outer 2\n');
    });
  });

  describe('formatted messages', () => {
    test('handles format strings correctly', () => {
      print('Hello %s, you have %d messages', 'User', 5);
      expect(mockStderr).toHaveBeenCalledWith('Hello User, you have 5 messages\n');
    });

    test('handles objects in format strings', () => {
      const obj = { name: 'test' };
      print('Object: %j', obj);
      expect(mockStderr).toHaveBeenCalledWith('Object: {"name":"test"}\n');
    });

    test('handles invalid format specifiers', () => {
      print('Test %z', 123);
      expect(mockStderr).toHaveBeenCalledWith('Test %z 123\n');
    });
  });

  describe('message codes', () => {
    test('accepts valid message codes', () => {
      print('CUSTOM_2001', 'test message');
      expect(mockStderr).toHaveBeenCalledWith('test message\n');
    });

    test('treats invalid code format as regular message', () => {
      print('INVALID_CODE', 'test');
      expect(mockStderr).toHaveBeenCalledWith('INVALID_CODE test\n');
    });
  });

  describe('styled output', () => {
    test('success() adds green color to output', () => {
      success('operation completed');
      expect(mockStderr).toHaveBeenCalledWith('operation completed\n');
      // Note: ANSI codes are stripped, so we can't test the actual color
    });

    test('highlight() adds bold formatting to output', () => {
      highlight('important message');
      expect(mockStderr).toHaveBeenCalledWith('important message\n');
      // Note: ANSI codes are stripped, so we can't test the actual formatting
    });
  });

  describe('advanced corked logging', () => {
    test('maintains message order in nested corking', async () => {
      const messages: string[] = [];
      jest.spyOn(process.stderr, 'write').mockImplementation((chunk: any) => {
        messages.push(stripAnsi(chunk.toString()).trim());
        return true;
      });

      await withCorkedLogging(async () => {
        print('first');
        await withCorkedLogging(async () => {
          print('second');
          await withCorkedLogging(async () => {
            print('third');
          });
          print('fourth');
        });
        print('fifth');
      });

      expect(messages).toEqual([
        'first',
        'second',
        'third',
        'fourth',
        'fifth'
      ]);
    });

    test('handles errors in corked blocks', async () => {
      const messages: string[] = [];
      jest.spyOn(process.stderr, 'write').mockImplementation((chunk: any) => {
        messages.push(stripAnsi(chunk.toString()).trim());
        return true;
      });

      await expect(withCorkedLogging(async () => {
        print('before error');
        throw new Error('test error');
      })).rejects.toThrow('test error');

      expect(messages).toContain('before error');
    });
  });

  describe('complex logging scenarios', () => {
    test('handles multiple log levels in corked block', async () => {
      await withCorkedLogging(async () => {
        error('error message');
        warning('warning message');
        print('info message');
        debug('debug message');
      });

      expect(mockStderr).toHaveBeenCalledWith('error message\n');
      expect(mockStderr).toHaveBeenCalledWith('warning message\n');
      expect(mockStderr).toHaveBeenCalledWith('info message\n');
    });

    test('respects log level changes during corked logging', async () => {
      await withCorkedLogging(async () => {
        debug('first debug');
        setIoMessageThreshold('debug');
        debug('second debug');
        setIoMessageThreshold('info');
        debug('third debug');
      });

      expect(mockStderr).not.toHaveBeenCalledWith('first debug\n');
      expect(mockStderr).toHaveBeenCalledWith('second debug\n');
      expect(mockStderr).not.toHaveBeenCalledWith('third debug\n');
    });
  });
});
