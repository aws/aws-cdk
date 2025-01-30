import * as chalk from 'chalk';
import { CliIoHost, IoMessage, IoMessageLevel } from '../../lib/toolkit/cli-io-host';

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

    test('writes to stdout for result level', async () => {
      ioHost.isTTY = true;
      await ioHost.notify({
        time: new Date(),
        level: 'result',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'result message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('result message') + '\n');
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
      });

      expect(mockStderr).toHaveBeenCalledWith(`[12:00:00] ${chalk.gray('test message')}\n`);
    });

    test('formats trace messages with timestamp', async () => {
      await ioHost.notify({
        ...defaultMessage,
        level: 'trace',
      });

      expect(mockStderr).toHaveBeenCalledWith(`[12:00:00] ${chalk.gray('test message')}\n`);
    });

    test('applies no styling when TTY is false', async () => {
      ioHost.isTTY = false;
      await ioHost.notify({
        ...defaultMessage,
      });

      expect(mockStderr).toHaveBeenCalledWith('test message\n');
    });

    test.each([
      ['error', 'red', false],
      ['warn', 'yellow', false],
      ['info', 'white', false],
      ['debug', 'gray', true],
      ['trace', 'gray', true],
    ] as Array<[IoMessageLevel, typeof chalk.ForegroundColor, boolean]>)('outputs %ss in %s color ', async (level, color, shouldAddTime) => {
      // Given
      const style = chalk[color];
      let expectedOutput = `${style('test message')}\n`;
      if (shouldAddTime) {
        expectedOutput = `[12:00:00] ${expectedOutput}`;
      }

      // When
      await ioHost.notify({
        ...defaultMessage,
        level,
      });

      // Then
      expect(mockStderr).toHaveBeenCalledWith(expectedOutput);
      mockStdout.mockClear();
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
      });

      expect(mockStderr).toHaveBeenCalledWith(`[12:34:56] ${chalk.gray('debug message')}\n`);
    });

    test('excludes timestamp for other levels but includes color', async () => {
      const testDate = new Date('2024-01-01T12:34:56');
      await ioHost.notify({
        time: testDate,
        level: 'info',
        action: 'synth',
        code: 'CDK_TOOLKIT_I0001',
        message: 'info message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.white('info message') + '\n');
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
