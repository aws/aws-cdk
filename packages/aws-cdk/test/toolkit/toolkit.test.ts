import * as chalk from 'chalk';
import { CliIoHost } from '../../toolkit/lib/cli-io-host';

describe('CliIoHost', () => {
  let mockStdout: jest.Mock;
  let mockStderr: jest.Mock;

  beforeEach(() => {
    mockStdout = jest.fn();
    mockStderr = jest.fn();

    // MOck the write methods of STD out and STD err
    jest.spyOn(process.stdout, 'write').mockImplementation((str: any, encoding?: any, cb?: any) => {
      mockStdout(str.toString());
      // Handle callback
      const callback = typeof encoding === 'function' ? encoding : cb;
      if (callback) callback();
      return true;
    });

    jest.spyOn(process.stderr, 'write').mockImplementation((str: any, encoding?: any, cb?: any) => {
      mockStderr(str.toString());
      // Handle callback
      const callback = typeof encoding === 'function' ? encoding : cb;
      if (callback) callback();
      return true;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('stream selection', () => {
    test('writes to stdout by default', async () => {
      const host = new CliIoHost({ useTTY: true });
      await host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'test message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('test message') + '\n');
      expect(mockStderr).not.toHaveBeenCalled();
    });

    test('writes to stderr for error level with red color', async () => {
      const host = new CliIoHost({ useTTY: true });
      await host.notify({
        time: new Date(),
        level: 'error',
        action: 'synth',
        code: 'TEST',
        message: 'error message',
      });

      expect(mockStderr).toHaveBeenCalledWith(chalk.red('error message') + '\n');
      expect(mockStdout).not.toHaveBeenCalled();
    });
  });

  describe('TTY formatting', () => {
    test('accepts custom chalk styles', async () => {
      const host = new CliIoHost({ useTTY: true });
      await host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'green message',
        style: chalk.green,
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.green('green message') + '\n');
    });

    test('applies custom style in TTY mode', async () => {
      const host = new CliIoHost({ useTTY: true });
      const customStyle = (str: string) => `\x1b[35m${str}\x1b[0m`; // Custom purple color

      await host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'styled message',
        style: customStyle,
      });

      expect(mockStdout).toHaveBeenCalledWith(customStyle('styled message') + '\n');
    });

    test('applies default style by message level in TTY mode', async () => {
      const host = new CliIoHost({ useTTY: true });
      await host.notify({
        time: new Date(),
        level: 'warn',
        action: 'synth',
        code: 'TEST',
        message: 'warning message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.yellow('warning message') + '\n');
    });

    test('does not apply styles in non-TTY mode', async () => {
      const host = new CliIoHost({ useTTY: false });
      await host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'unstyled message',
      });

      expect(mockStdout).toHaveBeenCalledWith('unstyled message\n');
    });

    test('does not apply styles in non-TTY mode with style provided', async () => {
      const host = new CliIoHost({ useTTY: false });
      await host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'unstyled message',
        style: chalk.green,
      });

      expect(mockStdout).toHaveBeenCalledWith('unstyled message\n');
    });
  });

  describe('timestamp handling', () => {
    test('includes timestamp for DEBUG level with gray color', async () => {
      const host = new CliIoHost({ useTTY: true });
      const testDate = new Date('2024-01-01T12:34:56');

      await host.notify({
        time: testDate,
        level: 'debug',
        action: 'synth',
        code: 'TEST',
        message: 'debug message',
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:34:56] ${chalk.gray('debug message')}\n`);
    });

    test('includes timestamp for TRACE level with gray color', async () => {
      const host = new CliIoHost({ useTTY: true });
      const testDate = new Date('2024-01-01T12:34:56');

      await host.notify({
        time: testDate,
        level: 'trace',
        action: 'synth',
        code: 'TEST',
        message: 'trace message',
      });

      expect(mockStdout).toHaveBeenCalledWith(`[12:34:56] ${chalk.gray('trace message')}\n`);
    });

    test('excludes timestamp for other levels but includes color', async () => {
      const host = new CliIoHost({ useTTY: true });
      const testDate = new Date('2024-01-01T12:34:56');

      await host.notify({
        time: testDate,
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'info message',
      });

      expect(mockStdout).toHaveBeenCalledWith(chalk.white('info message') + '\n');
    });
  });

  describe('error handling', () => {
    test('rejects on write error', async () => {
      jest.spyOn(process.stdout, 'write').mockImplementation((_: any, callback: any) => {
        callback(new Error('Write failed'));
        return true;
      });

      const host = new CliIoHost({ useTTY: true });
      await expect(host.notify({
        time: new Date(),
        level: 'info',
        action: 'synth',
        code: 'TEST',
        message: 'test message',
      })).rejects.toThrow('Write failed');
    });
  });
});
