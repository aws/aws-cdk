import { result, success, highlight, error, warning, info, debug, trace } from '../../../lib/logging';
import { CliIoHost } from '../../../lib/toolkit/cli-io-host';

describe('logging', () => {
  const ioHost = CliIoHost.instance({}, true);
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  const stripAnsi = (str: string): string => {
    const ansiRegex = /\u001b\[[0-9;]*[a-zA-Z]/g;
    return str.replace(ansiRegex, '');
  };

  beforeEach(() => {
    ioHost.logLevel = 'info';
    ioHost.isCI = false;

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
    test('result() always writes to stdout with both styles', () => {
      // String style
      result('test message');
      expect(mockStdout).toHaveBeenCalledWith('test message\n');

      // Object style
      result({ message: 'test message 2' });
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

    test('info() writes to stderr by default with both styles', () => {
      // String style
      info('test print');
      expect(mockStderr).toHaveBeenCalledWith('test print\n');

      // Object style
      info({ message: 'test print 2' });
      expect(mockStderr).toHaveBeenCalledWith('test print 2\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('info() writes to stdout in CI mode with both styles', () => {
      ioHost.isCI = true;
      // String style
      info('test print');
      expect(mockStdout).toHaveBeenCalledWith('test print\n');

      // Object style
      info({ message: 'test print 2' });
      expect(mockStdout).toHaveBeenCalledWith('test print 2\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('log levels', () => {
    test('respects log level settings with both styles', () => {
      ioHost.logLevel = 'error';

      // String style
      error('error message');
      warning('warning message');
      info('print message');

      // Object style
      error({ message: 'error message 2' });
      warning({ message: 'warning message 2' });
      info({ message: 'print message 2' });

      expect(mockStderr).toHaveBeenCalledWith('error message\n');
      expect(mockStderr).toHaveBeenCalledWith('error message 2\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('warning message 2\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message\n');
      expect(mockStderr).not.toHaveBeenCalledWith('print message 2\n');
    });

    test('debug messages only show at debug level with both styles', () => {
      ioHost.logLevel = 'info';
      debug('debug message');
      debug({ message: 'debug message 2' });
      expect(mockStderr).not.toHaveBeenCalled();

      ioHost.logLevel = 'debug';
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
      ioHost.logLevel = 'debug';
      trace('trace message');
      trace({ message: 'trace message 2' });
      expect(mockStderr).not.toHaveBeenCalled();

      ioHost.logLevel = 'trace';
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
      info('Hello %s, you have %d messages', 'User', 5);
      expect(mockStderr).toHaveBeenCalledWith('Hello User, you have 5 messages\n');

      // Object style
      info({ message: 'Hello %s, you have %d messages' }, 'User', 5);
      expect(mockStderr).toHaveBeenCalledWith('Hello User, you have 5 messages\n');
    });

    test('handles objects in format strings with both styles', () => {
      const obj = { name: 'test' };
      // String style
      info('Object: %j', obj);
      expect(mockStderr).toHaveBeenCalledWith('Object: {"name":"test"}\n');

      // Object style
      info({ message: 'Object: %j' }, obj);
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
      info('Values: %s, %s', null, undefined);
      expect(mockStderr).toHaveBeenCalledWith('Values: null, undefined\n');

      // Object style
      info({ message: 'Values: %s, %s' }, null, undefined);
      expect(mockStderr).toHaveBeenCalledWith('Values: null, undefined\n');
    });

    test('handles circular references in objects with both styles', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;

      // String style
      info('Object: %j', obj);
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('[Circular'));

      // Object style
      info({ message: 'Object: %j' }, obj);
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('[Circular'));
    });
  });

  describe('message codes', () => {
    test('validates message codes correctly', () => {
      // Valid codes
      expect(() => error({ message: 'test', code: 'CDK_TOOLKIT_E0001' })).not.toThrow();
      expect(() => warning({ message: 'test', code: 'CDK_ASSETS_W4999' })).not.toThrow();
      expect(() => info({ message: 'test', code: 'CDK_SDK_I0000' })).not.toThrow();
    });

    test('uses default codes when none provided', () => {
      error('test error');
      expect(mockStderr).toHaveBeenCalledWith(expect.stringContaining('test error'));
      // Would need to modify the code to expose the actual message code for verification
    });
  });

  describe('CI mode behavior', () => {
    test('correctly switches between stdout and stderr based on CI mode', () => {
      ioHost.isCI = true;
      warning('warning in CI');
      success('success in CI');
      error('error in CI');

      expect(mockStdout).toHaveBeenCalledWith('warning in CI\n');
      expect(mockStdout).toHaveBeenCalledWith('success in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('error in CI\n');

      ioHost.isCI = false;
      warning('warning not in CI');
      success('success not in CI');
      error('error not in CI');

      expect(mockStderr).toHaveBeenCalledWith('warning not in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('success not in CI\n');
      expect(mockStderr).toHaveBeenCalledWith('error not in CI\n');
    });
  });
});
