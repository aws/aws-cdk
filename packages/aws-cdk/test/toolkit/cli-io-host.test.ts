import * as chalk from 'chalk';
import { CliIoHost, IoMessage } from '../../lib/toolkit/cli-io-host';

const ioHost = CliIoHost.instance({
  logLevel: 'trace',
});

describe('CliIoHost', () => {
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;
  let defaultMessage: IoMessage<unknown>;

  beforeEach(() => {
    mockStdout = jest.fn();
    mockStderr = jest.fn();

    // Reset singleton state
    ioHost.isTTY = process.stdout.isTTY ?? false;
    ioHost.isCI = false;
    ioHost.currentAction = 'synth';

    defaultMessage = {
      time: new Date('2024-01-01T12:00:00'),
      level: 'info',
      action: 'synth',
      code: 'CDK_TOOLKIT_I0001',
      message: 'test message',
    };

    jest.spyOn(process.stdout, 'write').mockImplementation((str: any, encoding?: any, cb?: any) => {
      mockStdout(str.toString());
      const callback = typeof encoding === 'function' ? encoding : cb;
      if (callback) callback();
      return true;
    });

    jest.spyOn(process.stderr, 'write').mockImplementation((str: any, encoding?: any, cb?: any) => {
      mockStderr(str.toString());
      const callback = typeof encoding === 'function' ? encoding : cb;
      if (callback) callback();
      return true;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('stream selection', () => {
    test('writes to stderr by default for non-error messages in non-CI mode', async () => {
      ioHost.isTTY = true;
      await ioHost.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'test message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.white('test message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('writes to stderr for error level with red color', async () => {
      ioHost.isTTY = true;
      await ioHost.notify({
        time: new Date(),
        level: 'error',
        action: 'synth',
        code: 'CDK_TOOLKIT_E0001',
        message: 'error message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.red('error message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('writes to stdout when forceStdout is true', async () => {
      ioHost.isTTY = true;
      await ioHost.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'forced message',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('forced message') + '\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('message formatting', () => {
    beforeEach(() => {
      ioHost.isTTY = true;
    });

    test('formats debug messages with timestamp', async () => {
      await ioHost.notify({
        ...defaultMessage,
        level: 'debug',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:00:00] ${chalk.gray('test message')}\n`);
    });

    test('formats trace messages with timestamp', async () => {
      await ioHost.notify({
        ...defaultMessage,
        level: 'trace',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:00:00] ${chalk.gray('test message')}\n`);
    });

    test('applies no styling when TTY is false', async () => {
      ioHost.isTTY = false;
      await ioHost.notify({
        ...defaultMessage,
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith('test message\n');
    });

    test('applies correct color styles for different message levels', async () => {
      const testCases = [
        { level: 'error' as const, style: chalk.red },
        { level: 'warn' as const, style: chalk.yellow },
        { level: 'info' as const, style: chalk.white },
        { level: 'debug' as const, style: chalk.gray },
        { level: 'trace' as const, style: chalk.gray },
      ];

      for (const { level, style } of testCases) {
        await ioHost.notify({
          ...defaultMessage,
          level,
          forceStdout: true,
        });

        const expectedOutput = level === 'debug' || level === 'trace'
          ? `[12:00:00] ${style('test message')}\n`
          : `${style('test message')}\n`;

        expect(mockStdout).toHaveBeenCalledWith(expectedOutput);
        mockStdout.mockClear();
      }
    });
  });

  describe('action handling', () => {
    test('sets and gets current action', () => {
      ioHost.currentAction = 'deploy';
      expect(ioHost.currentAction).toBe('deploy');
    });
  });

  describe('CI mode behavior', () => {
    beforeEach(() => {
      ioHost.isTTY = true;
      ioHost.isCI = true;
    });

    test('writes to stdout in CI mode when level is not error', async () => {
      await ioHost.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_W0001',
        message: 'ci message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('ci message') + '\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('writes to stderr for error level in CI mode', async () => {
      await ioHost.notify({
        time: new Date(),
        level: 'error',
        action: 'synth',
        code: 'CDK_TOOLKIT_E0001',
        message: 'ci error message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.red('ci error message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });
  });

  describe('timestamp handling', () => {
    beforeEach(() => {
      ioHost.isTTY = true;
    });

    test('includes timestamp for DEBUG level with gray color', async () => {
      const testDate = new Date('2024-01-01T12:34:56');
      await ioHost.notify({
        time: testDate,
        level: 'debug',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'debug message',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:34:56] ${chalk.gray('debug message')}\n`);
    });

    test('excludes timestamp for other levels but includes color', async () => {
      const testDate = new Date('2024-01-01T12:34:56');
      await ioHost.notify({
        time: testDate,
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'info message',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('info message') + '\n');
    });
  });

  describe('error handling', () => {
    test('rejects on write error', async () => {
      jest.spyOn(process.stdout, 'write').mockImplementation((_: any, callback: any) => {
        if (callback) callback(new Error('Write failed'));
        return true;
      });

      await expect(ioHost.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'test message',
        forceStdout: true,
      })).rejects.toThrow('Write failed');
    });
  });

  describe('requestResponse', () => {
    test('logs messages and returns default', async () => {
      ioHost.isTTY = true;
      const response = await ioHost.requestResponse({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'test message',
        defaultResponse: 'default response',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.white('test message') + '\n');
      expect(response).toBe('default response');
    });
  });
});
