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
  // Optionally specify Chalk style for stdout/stderr, if TTY is enabled
  style?: ((str: string) => string);
}

export type IoMessageLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type IoAction = 'synth' | 'list' | 'deploy' | 'destroy';

interface CliIoHostOptions {
  useTTY?: boolean;
  ci?: boolean;
}

/**
 * A simple IO host for the CLI that writes messages to the console.
 */
export class CliIoHost {
  private readonly pretty_messages: boolean;

  constructor(options: CliIoHostOptions = {}) {
    this.pretty_messages = 
    options.useTTY ?? 
    (options.ci ? false : (process.stdout.isTTY ?? false));
  }

  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  async notify(msg: IoMessage): Promise<void> {
    const output = this.formatMessage(msg);

    const stream = this.getStream(msg.level, msg.action === 'synth');

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
   * Determines which output stream to use based on log level and configuration.
   */
  private getStream(level: IoMessageLevel, forceStdout: boolean) {
    if (level === 'error' || forceStdout) {
      return process.stderr;
    } else {
      return process.stdout;
    }
  }

  /**
   * Formats a message for console output with optional color support
   */
  private formatMessage(msg: IoMessage): string {
    // apply provided style or a default style if we're in TTY mode
    let output = this.pretty_messages
      ? (msg.style?.(msg.message) ?? styleMap[msg.level](msg.message))
      : msg.message;

    // prepend timestamp if IoMessageLevel is DEBUG or TRACE
    return (msg.level === 'debug' || msg.level === 'trace')
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
  'error': chalk.red,
  'warn': chalk.yellow,
  'info': chalk.white,
  'debug': chalk.gray,
  'trace': chalk.gray,
};
