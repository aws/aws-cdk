import { debug, error, info, success, warning } from '../../lib/logging';
import { CliIoHost } from '../../lib/toolkit/cli-io-host';

const ioHost = CliIoHost.instance({}, true);
let mockStderr: jest.Mock;

const stripAnsi = (str: string): string => {
  const ansiRegex = /\u001b\[[0-9;]*[a-zA-Z]/g;
  return str.replace(ansiRegex, '');
};

beforeEach(() => {
  ioHost.logLevel = 'info';
  ioHost.isCI = false;

  mockStderr = jest.fn();
  jest.spyOn(process.stderr, 'write').mockImplementation((chunk: any) => {
    mockStderr(stripAnsi(chunk.toString()));
    return true;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('corked logging', () => {
  test('buffers messages when corked', async () => {
    await ioHost.withCorkedLogging(async () => {
      info('message 1');
      info({ message: 'message 2' });
      expect(mockStderr).not.toHaveBeenCalled();
    });

    expect(mockStderr).toHaveBeenCalledWith('message 1\n');
    expect(mockStderr).toHaveBeenCalledWith('message 2\n');
  });

  test('handles nested corking correctly', async () => {
    await ioHost.withCorkedLogging(async () => {
      info('outer 1');
      await ioHost.withCorkedLogging(async () => {
        info({ message: 'inner' });
      });
      info({ message: 'outer 2' });
      expect(mockStderr).not.toHaveBeenCalled();
    });

    expect(mockStderr).toHaveBeenCalledTimes(3);
    expect(mockStderr).toHaveBeenCalledWith('outer 1\n');
    expect(mockStderr).toHaveBeenCalledWith('inner\n');
    expect(mockStderr).toHaveBeenCalledWith('outer 2\n');
  });

  test('handles errors in corked block while preserving buffer', async () => {
    await expect(ioHost.withCorkedLogging(async () => {
      info('message 1');
      throw new Error('test error');
    })).rejects.toThrow('test error');

    // The buffered message should still be printed even if the block throws
    expect(mockStderr).toHaveBeenCalledWith('message 1\n');
  });

  test('maintains correct order with mixed log levels in corked block', async () => {
    // Set threshold to debug to allow debug messages
    ioHost.logLevel = 'debug';

    await ioHost.withCorkedLogging(async () => {
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
  });
});
