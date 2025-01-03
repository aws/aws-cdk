import * as chalk from 'chalk';

/**
 * Basic message structure for toolkit notifications.
 * Messages are emitted by the toolkit and handled by the IoHost.
 */
export interface IoMessage {
  /**
   * The time the message was emitted.
   */
  readonly time: Date;

  /**
   * The log level of the message.
   */
  readonly level: IoMessageLevel;

  /**
   * The action that triggered the message.
   */
  readonly action: IoAction;

  /**
   * A short code uniquely identifying message type.
   */
  readonly code: string;

  /**
   * The message text.
   */
  readonly message: string;

  /**
   * If true, the message will be written to stdout
   * regardless of any other parameters.
   *
   * @default false
   */
  readonly forceStdout?: boolean;
}

export type IoMessageLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * The current action being performed by the CLI. 'none' represents the absence of an action.
 */
export type IoAction = 'synth' | 'list' | 'deploy' | 'destroy' | 'none';

/**
 * A simple IO host for the CLI that writes messages to the console.
 */
export class CliIoHost {
  /**
   * Returns the singleton instance
   */
  static getIoHost(): CliIoHost {
    if (!CliIoHost.instance) {
      CliIoHost.instance = new CliIoHost();
    }
    return CliIoHost.instance;
  }

  /**
   * Determines which output stream to use based on log level and configuration.
   */
  public static getStream(level: IoMessageLevel, forceStdout: boolean) {
    // For legacy purposes all log streams are written to stderr by default, unless
    // specified otherwise, by passing `forceStdout`, which is used by the `data()` logging function, or
    // if the CDK is running in a CI environment. This is because some CI environments will immediately
    // fail if stderr is written to. In these cases, we detect if we are in a CI environment and
    // write all messages to stdout instead.
    if (forceStdout) {
      return process.stdout;
    }
    if (level == 'error') return process.stderr;
    return this.ci ? process.stdout : process.stderr;
  }

  /**
   * Singleton instance of the CliIoHost
   */
  private static instance: CliIoHost | undefined;

  /**
   * Whether the host should apply chalk styles to messages. Defaults to false if the host is not running in a TTY.
   */
  private isTTY: boolean;

  /**
   * Whether the CliIoHost is running in CI mode. In CI mode, all non-error output goes to stdout instead of stderr.
   */
  private ci: boolean = false;

  /**
   * the current {@link IoAction} set by the CLI.
   */
  private currentAction: IoAction | undefined;

  private constructor() {
    this.isTTY = process.stdout.isTTY ?? false;
  }

  public static get currentAction(): IoAction | undefined {
    return CliIoHost.getIoHost().currentAction;
  }

  public static set currentAction(action: IoAction) {
    CliIoHost.getIoHost().currentAction = action;
  }

  public static get ci(): boolean {
    return CliIoHost.getIoHost().ci;
  }

  public static set ci(value: boolean) {
    CliIoHost.getIoHost().ci = value;
  }

  public static get isTTY(): boolean {
    return CliIoHost.getIoHost().isTTY;
  }

  public static set isTTY(value: boolean) {
    CliIoHost.getIoHost().isTTY = value;
  }

  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  async notify(msg: IoMessage): Promise<void> {
    const output = this.formatMessage(msg);

    const stream = CliIoHost.getStream(msg.level, msg.forceStdout ?? false);

    return new Promise((resolve, reject) => {
      stream.write(output, (err) => {
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
    let message_text = this.isTTY
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

/**
   * Validates a message code.
   * Message codes must be in the format [A-Z]+_[0-2]\d{3}.
   *
   * @example 'SDK_0002', 'ASSETS_1014', 'TOOLKIT_2000'
   */
export function validateMessageCode(code: string): boolean {
  // Matches pattern like SDK_0001, TOOLKIT_1000, etc.
  const pattern = /^[A-Z]+_[0-2]\d{3}$/;
  return pattern.test(code);
}

export const styleMap: Record<IoMessageLevel, (str: string) => string> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.white,
  debug: chalk.gray,
  trace: chalk.gray,
};
