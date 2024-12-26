import * as chalk from 'chalk';

/**
 * Basic message structure for toolkit notifications.
 * Messages are emitted by the toolkit and handled by the IoHost.
 * 
 * @param time The time the message was emitted.
 * @param level The log level of the message.
 * @param action The action that triggered the message.
 * @param code A short code to identify the message.
 * @param message The message text.
 * @param forceStdout If true, the message will be written to stdout regardless of log level.
 */
interface IoMessage {
  time: Date;
  level: IoMessageLevel;
  action: IoAction;
  code: string;
  message: string;
  forceStdout?: boolean;
}

export type IoMessageLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type IoAction = 'synth' | 'list' | 'deploy' | 'destroy';

/**
 * Options for the CLI IO host.
 * 
 * @param useTTY If true, the host will use TTY features like color.
 * @param ci Flag representing whether the current process is running in a CI environment, 
 * If true, the host will write all messages to stdout.
 */
interface CliIoHostOptions {
  useTTY?: boolean;
  ci?: boolean;
}

/**
 * A simple IO host for the CLI that writes messages to the console.
 */
export class CliIoHost {
  private readonly pretty_messages: boolean;
  private readonly ci: boolean;

  constructor(options: CliIoHostOptions) {
    this.pretty_messages = options.useTTY ?? process.stdout.isTTY ?? false;
    this.ci = options.ci ?? false;
  }

  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  async notify(msg: IoMessage): Promise<void> {
    const output = this.formatMessage(msg);

    const stream = this.getStream(msg.level, msg.forceStdout ?? false);

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
    if (forceStdout) {
      return process.stdout;
    }
    if (level == 'error') return process.stderr;
    return this.ci ? process.stdout : process.stderr;
  }

  /**
   * Formats a message for console output with optional color support
   */
  private formatMessage(msg: IoMessage): string {
    // apply provided style or a default style if we're in TTY mode
    let message_text = this.pretty_messages
      ? styleMap[msg.level](msg.message)
      : msg.message;

    // prepend timestamp if IoMessageLevel is DEBUG or TRACE. Postpend a newline.
    return ((msg.level === 'debug' || msg.level === 'trace')
      ? `[${this.formatTime(msg.time)}] ${message_text}`
      : message_text) + '\n';
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
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.white,
  debug: chalk.gray,
  trace: chalk.gray,
};
