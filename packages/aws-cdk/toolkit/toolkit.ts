import * as chalk from 'chalk';

/**
 * Basic message structure for toolkit notifications.
 * Messages are emitted by the toolkit and handled by the IoHost.
 */
interface IoMessage {
  time: Date;
  level: IoMessageLevel;
  action: IoAction;
  code: string;
  message: string;
  // Specify Chalk style for stdout/stderr, if TTY is enabled
  style?: ((str: string) => string);
}

enum IoMessageLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

enum IoAction {
  SYNTH = 'synth',
  LIST = 'list',
  DEPLOY = 'deploy',
  DESTROY = 'destroy',
}

/**
 * A simple IO host for the CLI that writes messages to the console.
 */
class CliIoHost {
  private readonly useTTY: boolean;

  constructor(options: { useTTY?: boolean } = {}) {
    this.useTTY = options.useTTY ?? process.stdout.isTTY ?? false;
  }

  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  async notify(msg: IoMessage): Promise<void> {
    const output = this.formatMessage(msg);

    const stream = msg.level === 'error' ? process.stderr : process.stdout;

    return new Promise((resolve, reject) => {
      stream.write(output + '\n', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Formats a message for console output with optional color support
   */
  private formatMessage(msg: IoMessage): string {
    // apply provided style or a default style if we're in TTY mode
    let output = this.useTTY
      ? (msg.style?.(msg.message) ?? styleMap[msg.level](msg.message))
      : msg.message;

    // prepend timestamp if IoMessageLevel is DEBUG or TRACE
    return (msg.level === IoMessageLevel.DEBUG || msg.level === IoMessageLevel.TRACE)
      ? `[${this.formatTime(msg.time)}] ${output}`
      : output;
  }

  /**
   * Formats date to HH:MM:SS
   */
  private formatTime(d: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

}

const styleMap: Record<IoMessageLevel, (str: string) => string> = {
  [IoMessageLevel.ERROR]: chalk.red,
  [IoMessageLevel.WARN]: chalk.yellow,
  [IoMessageLevel.INFO]: chalk.white,
  [IoMessageLevel.DEBUG]: chalk.gray,
  [IoMessageLevel.TRACE]: chalk.gray,
};

/**
 * @internal
 * Used by the toolkit unit tests.
 * These APIs are not part of the public interface and will change without notice.
 * Do Not Use.
 *
 */
export const _private = {
  CliIoHost,
  IoMessageLevel,
  IoAction,
} as const;
