import * as chalk from 'chalk';

export type IoMessageCodeCategory = 'TOOLKIT' | 'SDK' | 'ASSETS';
export type IoCodeLevel = 'E' | 'W' | 'I';
export type IoMessageSpecificCode<L extends IoCodeLevel> = `CDK_${IoMessageCodeCategory}_${L}${number}${number}${number}${number}`;
export type IoMessageCode = IoMessageSpecificCode<IoCodeLevel>;

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
  readonly action: ToolkitAction;

  /**
   * A short message code uniquely identifying a message type using the format CDK_[CATEGORY]_[E/W/I][000-999].
   *
   * The level indicator follows these rules:
   * - 'E' for error level messages
   * - 'W' for warning level messages
   * - 'I' for info/debug/trace level messages
   *
   * Codes ending in 000 are generic messages, while codes ending in 001-999 are specific to a particular message.
   * The following are examples of valid and invalid message codes:
   * ```ts
   * 'CDK_ASSETS_I000'       // valid: generic assets info message
   * 'CDK_TOOLKIT_E002'      // valid: specific toolkit error message
   * 'CDK_SDK_W023'          // valid: specific sdk warning message
   * ```
   */
  readonly code: IoMessageCode;

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
export type ToolkitAction = 'synth' | 'list' | 'deploy' | 'destroy' | 'none';

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
   * Singleton instance of the CliIoHost
   */
  private static instance: CliIoHost | undefined;

  /**
   * Determines which output stream to use based on log level and configuration.
   */
  private static getStream(level: IoMessageLevel, forceStdout: boolean) {
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
   * Whether the host should apply chalk styles to messages. Defaults to false if the host is not running in a TTY.
   *
   * @default false
   */
  private isTTY: boolean;

  /**
   * Whether the CliIoHost is running in CI mode. In CI mode, all non-error output goes to stdout instead of stderr.
   *
   * Set to false in the CliIoHost constructor it will be overwritten if the CLI CI argument is passed
   */
  private ci: boolean;

  /**
   * the current {@link ToolkitAction} set by the CLI.
   */
  private currentAction: ToolkitAction | undefined;

  private constructor() {
    this.isTTY = process.stdout.isTTY ?? false;
    this.ci = false;
  }

  public static get currentAction(): ToolkitAction | undefined {
    return CliIoHost.getIoHost().currentAction;
  }

  public static set currentAction(action: ToolkitAction) {
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

export const styleMap: Record<IoMessageLevel, (str: string) => string> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.white,
  debug: chalk.gray,
  trace: chalk.gray,
};
