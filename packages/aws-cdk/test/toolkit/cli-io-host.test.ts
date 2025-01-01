import * as chalk from 'chalk';
import { CliIoHost } from '../../lib/toolkit/cli-io-host';

describe('CliIoHost', () => {
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  beforeEach(() => {
    mockStdout = jest.fn();
    mockStderr = jest.fn();

    // Reset singleton state
    CliIoHost.isTTY = process.stdout.isTTY ?? false;
    CliIoHost.ci = false;

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
      CliIoHost.isTTY = true;
      await CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'test message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.white('test message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('writes to stderr for error level with red color', async () => {
      CliIoHost.isTTY = true;
      await CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'error',
        action: 'synth',
        code: 'TEST',
        message: 'error message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.red('error message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });

    test('writes to stdout when forceStdout is true', async () => {
      CliIoHost.isTTY = true;
      await CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'forced message',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('forced message') + '\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });
  });

  describe('CI mode behavior', () => {
    beforeEach(() => {
      CliIoHost.isTTY = true;
      CliIoHost.ci = true;
    });

    test('writes to stdout in CI mode when level is not error', async () => {
      await CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'ci message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('ci message') + '\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('writes to stderr for error level in CI mode', async () => {
      await CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'error',
        action: 'synth',
        code: 'TEST',
        message: 'ci error message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.red('ci error message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });
  });

  describe('timestamp handling', () => {
    beforeEach(() => {
      CliIoHost.isTTY = true;
    });

    test('includes timestamp for DEBUG level with gray color', async () => {
      const testDate = new Date('2024-01-01T12:34:56');
      await CliIoHost.getIoHost().notify({
        time: testDate,
        level: 'debug',
        action: 'synth',
        code: 'TEST',
        message: 'debug message',
        forceStdout: true,
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:34:56] ${chalk.gray('debug message')}\n`);
    });

    test('excludes timestamp for other levels but includes color', async () => {
      const testDate = new Date('2024-01-01T12:34:56');
      await CliIoHost.getIoHost().notify({
        time: testDate,
        level: 'info',
        action: 'synth',
        code: 'TEST',
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

      await expect(CliIoHost.getIoHost().notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'test message',
        forceStdout: true,
      })).rejects.toThrow('Write failed');
    });
  });
});
