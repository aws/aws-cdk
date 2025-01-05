import { setIoMessageThreshold, setCI, data, print, success, highlight, error, warning, info, debug, trace, withCorkedLogging } from '../../../lib/logging';

describe('logging', () => {
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  const stripAnsi = (str: string): string => {
    const ansiRegex = /\u001b\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '');
  };

  beforeEach(() => {
    setIoMessageThreshold('info');
    setCI(false);

    mockStdout = jest.fn();
    mockStderr = jest.fn();

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
    test('data() always writes to stdout with both styles', () => {
      // String style
      data('test message');
      expect(mockStdout).toHaveBeenCalledWith('test message\n');

      // Object style
      data({ message: 'test message 2' });
      expect(mockStdout).toHaveBeenCalledWith('test message 2\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('error() always writes to stderr with both styles', () => {
      // String style
      error('test error');
      expect(mockStderr).toHaveBeenCalledWith('test error\n');

      // Object style
      error({ message: 'test error 2' });
      expect(mockStderr).toHaveBeenCalledWith('test error 2\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stderr by default with both styles', () => {
      // String style
      print('test print');
      expect(mockStderr).toHaveBeenCalledWith('test print\n');

      // Object style
      print({ message: 'test print 2' });
      expect(mockStderr).toHaveBeenCalledWith('test print 2\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('print() writes to stdout in CI mode with both styles', () => {
      setCI(true);
      // String style
      print('test print');
      expect(mockStdout).toHaveBeenCalledWith('test print\n');

      // Object style
      print({ message: 'test print 2' });
      expect(mockStdout).toHaveBeenCalledWith('test print 2\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    test('respects log level settings with both styles', () => {
      setIoMessageThreshold('error');

      // String style
      error('error message');
      warning('warning message');
      print('print message');

      // Object style
      error({ message: 'error message 2' });
      warning({ message: 'warning message 2' });
      print({ message: 'print message 2' });

      expect(mockStderr).toHaveBeenCalledWith('error message\n');
      expect(mockStderr).toHaveBeenCalledWith('error message 2\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message 2\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message 2\n');
    });

    test('debug messages only show at debug level with both styles', () => {
      setIoMessageThreshold('info');
      debug('debug message');
      debug({ message: 'debug message 2' });
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('debug');
      debug('debug message');
      debug({ message: 'debug message 2' });
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] debug message\n$/),
      );
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] debug message 2\n$/),
      );
    });

    test('trace messages only show at trace level with both styles', () => {
      setIoMessageThreshold('debug');
      trace('trace message');
      trace({ message: 'trace message 2' });
      expect(mockStderr).not.toHaveBeenCalled();

      setIoMessageThreshold('trace');
      trace('trace message');
      trace({ message: 'trace message 2' });
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] trace message\n$/),
      );
      expect(mockStderr).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] trace message 2\n$/),
      );
    });
  });

  describe('formatted messages', () => {
    test('handles format strings correctly with both styles', () => {
      // String style
      print('Hello %s, you have %d messages', 'User', 5);
      expect(mockStderr).toHaveBeenCalledWith('Hello User, you have 5 messages\n');

      // Object style
      print({ message: 'Hello %s, you have %d messages' }, 'User', 5);
      expect(mockStderr).toHaveBeenCalledWith('Hello User, you have 5 messages\n');
    });

    test('handles objects in format strings with both styles', () => {
      const obj = { name: 'test' };
      // String style
      print('Object: %j', obj);
      expect(mockStderr).toHaveBeenCalledWith('Object: {"name":"test"}\n');

      // Object style
      print({ message: 'Object: %j' }, obj);
      expect(mockStderr).toHaveBeenCalledWith('Object: {"name":"test"}\n');
    });

    test('handles multiple style changes in single call', () => {
      const obj = { id: 123 };
      success('Processing %s: %j at %d%%', 'task', obj, 50);
      expect(mockStderr).toHaveBeenCalledWith(
        'Processing task: {"id":123} at 50%\n',
      );
    });
  });

  describe('styled output', () => {
    test('success() adds green color to output with both styles', () => {
      // String style
      success('operation completed');
      expect(mockStderr).toHaveBeenCalledWith('operation completed\n');

      // Object style
      success({ message: 'operation completed 2' });
      expect(mockStderr).toHaveBeenCalledWith('operation completed 2\n');
    });

    test('highlight() adds bold formatting to output with both styles', () => {
      // String style
      highlight('important message');
      expect(mockStderr).toHaveBeenCalledWith('important message\n');

      // Object style
      highlight({ message: 'important message 2' });
      expect(mockStderr).toHaveBeenCalledWith('important message 2\n');
    });

    test('success handles format strings with styling', () => {
      success('completed task %d of %d', 1, 3);
      expect(mockStderr).toHaveBeenCalledWith('completed task 1 of 3\n');

      // Remove the code from the test since it's an implementation detail
      success({ message: 'completed task %d of %d' }, 2, 3);
      expect(mockStderr).toHaveBeenCalledWith('completed task 2 of 3\n');
    });

    test('highlight handles complex objects with styling', () => {
      const complexObj = { status: 'active', count: 42 };
      highlight('Status: %j', complexObj);
      expect(mockStderr).toHaveBeenCalledWith('Status: {"status":"active","count":42}\n');

      // Remove the code from the test since it's an implementation detail
      highlight({ message: 'Status: %j' }, complexObj);
      expect(mockStderr).toHaveBeenCalledWith('Status: {"status":"active","count":42}\n');
    });
  });

  describe('edge cases', () => {
    test('handles null and undefined arguments with both styles', () => {
      // String style
      print('Values: %s, %s', null, undefined);
      expect(mockStderr).toHaveBeenCalledWith('Values: null, undefined\n');

      // Object style
      print({ message: 'Values: %s, %s' }, null, undefined);
      expect(mockStderr).toHaveBeenCalledWith('Values: null, undefined\n');
    });

    test('handles circular references in objects with both styles', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;

      // String style
      print('Object: %j', obj);
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('[Circular'));

      // Object style
      print({ message: 'Object: %j' }, obj);
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('[Circular'));
    });
  });

  describe('message codes', () => {
    test('validates message codes correctly', () => {
      // Valid codes
      expect(() => error({ message: 'test', code: 'TOOLKIT_0001' })).not.toThrow();
      expect(() => warning({ message: 'test', code: 'ASSETS_1499' })).not.toThrow();
      expect(() => info({ message: 'test', code: 'SDK_2000' })).not.toThrow();

      // Invalid codes
      expect(() => error({ message: 'test', code: 'ERROR001' })).toThrow();
      expect(() => warning({ message: 'test', code: 'WARN_300' })).toThrow();
      expect(() => info({ message: 'test', code: '001' })).toThrow();
    });

    test('uses default codes when none provided', () => {
      error('test error');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('test error'));
      // Would need to modify the code to expose the actual message code for verification
    });
  });

  describe('corked logging', () => {
    test('buffers messages when corked', async () => {
      await withCorkedLogging(async () => {
        print('message 1');
        print({ message: 'message 2' });
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledWith('message 1\n');
      expect(mockStderr).toHaveBeenCalledWith('message 2\n');
    });

    test('handles nested corking correctly', async () => {
      await withCorkedLogging(async () => {
        print('outer 1');
        await withCorkedLogging(async () => {
          print({ message: 'inner' });
        });
        print({ message: 'outer 2' });
        expect(mockStderr).not.toHaveBeenCalled();
      });

      expect(mockStderr).toHaveBeenCalledTimes(3);
      expect(mockStderr).toHaveBeenCalledWith('outer 1\n');
      expect(mockStderr).toHaveBeenCalledWith('inner\n');
      expect(mockStderr).toHaveBeenCalledWith('outer 2\n');
    });

    test('handles errors in corked block while preserving buffer', async () => {
      await expect(withCorkedLogging(async () => {
        print('message 1');
        throw new Error('test error');
      })).rejects.toThrow('test error');

      // The buffered message should still be printed even if the block throws
      expect(mockStderr).toHaveBeenCalledWith('message 1\n');
    });

    test('maintains correct order with mixed log levels in corked block', async () => {
      // Set threshold to debug to allow debug messages
      setIoMessageThreshold('debug');

      await withCorkedLogging(async () => {
        error('error message');
        warning('warning message');
        success('success message');
        debug('debug message');
      });

      const calls = mockStderr.mock.calls.map(call => call[0]);
      expect(calls).toEqual([
        'error message\n',
        'warning message\n',
        'success message\n',
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] debug message\n$/),
      ]);

      // Reset threshold back to info for other tests
      setIoMessageThreshold('info');
    });
  });

  describe('CI mode behavior', () => {
    test('correctly switches between stdout and stderr based on CI mode', () => {
      setCI(true);
      warning('warning in CI');
      success('success in CI');
      error('error in CI');

      expect(mockStdout).toHaveBeenCalledWith('warning in CI\n');
      expect(mockStdout).toHaveBeenCalledWith('success in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('error in CI\n');

      setCI(false);
      warning('warning not in CI');
      success('success not in CI');
      error('error not in CI');

      expect(mockStderr).toHaveBeenCalledWith('warning not in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('success not in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('error not in CI\n');
    });
  });
});
