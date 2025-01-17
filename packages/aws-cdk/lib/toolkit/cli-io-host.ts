import * as chalk from 'chalk';

export type IoMessageCodeCategory = 'TOOLKIT' | 'SDK' | 'ASSETS';
export type IoCodeLevel = 'E' | 'W' | 'I';
export type IoMessageSpecificCode<L extends IoCodeLevel> = `CDK_${IoMessageCodeCategory}_${L}${number}${number}${number}${number}`;
export type IoMessageCode = IoMessageSpecificCode<IoCodeLevel>;

/**
 * Basic message structure for toolkit notifications.
 * Messages are emitted by the toolkit and handled by the IoHost.
 */
export interface IoMessage<T> {
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

  /**
   * The data attached to the message.
   */
  readonly data?: T;
}

export interface IoRequest<T, U> extends IoMessage<T> {
  /**
   * The default response that will be used if no data is returned.
   */
  readonly defaultResponse: U;
}

export type IoMessageLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export const levelPriority: Record<IoMessageLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

/**
 * The current action being performed by the CLI. 'none' represents the absence of an action.
 */
export type ToolkitAction =
| 'bootstrap'
| 'synth'
| 'list'
| 'diff'
| 'deploy'
| 'rollback'
| 'watch'
| 'destroy'
| 'context'
| 'docs'
| 'doctor'
| 'gc'
| 'import'
| 'metadata'
| 'notices'
| 'init'
| 'migrate'
| 'version';

export interface IIoHost {
  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  notify<T>(msg: IoMessage<T>): Promise<void>;

  /**
   * Notifies the host of a message that requires a response.
   *
   * If the host does not return a response the suggested
   * default response from the input message will be used.
   */
  requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U>;
}

export interface CliIoHostProps {
  /**
   * The initial Toolkit action the hosts starts with.
   *
   * @default 'none'
   */
  readonly currentAction?: ToolkitAction;

  /**
   * Determines the verbosity of the output.
   *
   * The CliIoHost will still receive all messages and requests,
   * but only the messages included in this level will be printed.
   *
   * @default 'info'
   */
  readonly logLevel?: IoMessageLevel;

  /**
   * Overrides the automatic TTY detection.
   *
   * When TTY is disabled, the CLI will have no interactions or color.
   *
   * @default - determined from the current process
   */
  readonly isTTY?: boolean;

  /**
   * Whether the CliIoHost is running in CI mode.
   *
   * In CI mode, all non-error output goes to stdout instead of stderr.
   * Set to false in the CliIoHost constructor it will be overwritten if the CLI CI argument is passed
   *
   * @default - determined from the environment, specifically based on `process.env.CI`
   */
  readonly isCI?: boolean;
}

/**
 * A simple IO host for the CLI that writes messages to the console.
 */
export class CliIoHost implements IIoHost {
  /**
   * Returns the singleton instance
   */
  static instance(props: CliIoHostProps = {}, forceNew = false): CliIoHost {
    if (forceNew || !CliIoHost._instance) {
      CliIoHost._instance = new CliIoHost(props);
    }
    return CliIoHost._instance;
  }

  /**
   * Singleton instance of the CliIoHost
   */
  private static _instance: CliIoHost | undefined;

  private _currentAction: ToolkitAction;
  private _isCI: boolean;
  private _isTTY: boolean;
  private _logLevel: IoMessageLevel;
  private _internalIoHost?: IIoHost;

  private constructor(props: CliIoHostProps = {}) {
    this._currentAction = props.currentAction ?? 'none' as ToolkitAction;
    this._isTTY = props.isTTY ?? process.stdout.isTTY ?? false;
    this._logLevel = props.logLevel ?? 'info';
    this._isCI = props.isCI ?? isCI();
  }

  /**
   * Returns the singleton instance
   */
  public registerIoHost(ioHost: IIoHost) {
    if (ioHost !== this) {
      this._internalIoHost = ioHost;
    }
  }

  /**
   * The current action being performed by the CLI.
   */
  public get currentAction(): ToolkitAction {
    return this._currentAction;
  }

  /**
   * Sets the current action being performed by the CLI.
   *
   * @param action The action being performed by the CLI.
   */
  public set currentAction(action: ToolkitAction) {
    this._currentAction = action;
  }

  /**
   * Whether the host can use interactions and message styling.
   */
  public get isTTY(): boolean {
    return this._isTTY;
  }

  /**
   * Set TTY mode, i.e can the host use interactions and message styling.
   *
   * @param value set TTY mode
   */
  public set isTTY(value: boolean) {
    this._isTTY = value;
  }

  /**
   * Whether the CliIoHost is running in CI mode. In CI mode, all non-error output goes to stdout instead of stderr.
   */
  public get isCI(): boolean {
    return this._isCI;
  }

  /**
   * Set the CI mode. In CI mode, all non-error output goes to stdout instead of stderr.
   * @param value set the CI mode
   */
  public set isCI(value: boolean) {
    this._isCI = value;
  }

  /**
   * The current threshold. Messages with a lower priority level will be ignored.
   */
  public get logLevel(): IoMessageLevel {
    return this._logLevel;
  }

  /**
   * Sets the current threshold. Messages with a lower priority level will be ignored.
   * @param level The new log level threshold
   */
  public set logLevel(level: IoMessageLevel) {
    this._logLevel = level;
  }

  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  public async notify<T>(msg: IoMessage<T>): Promise<void> {
    if (this._internalIoHost) {
      return this._internalIoHost.notify(msg);
    }

    if (levelPriority[msg.level] > levelPriority[this.logLevel]) {
      return;
    }

    const output = this.formatMessage(msg);
    const stream = this.stream(msg.level, msg.forceStdout ?? false);

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
   * Determines which output stream to use based on log level and configuration.
   */
  private stream(level: IoMessageLevel, forceStdout: boolean) {
    // For legacy purposes all log streams are written to stderr by default, unless
    // specified otherwise, by passing `forceStdout`, which is used by the `data()` logging function, or
    // if the CDK is running in a CI environment. This is because some CI environments will immediately
    // fail if stderr is written to. In these cases, we detect if we are in a CI environment and
    // write all messages to stdout instead.
    if (forceStdout) {
      return process.stdout;
    }
    if (level == 'error') return process.stderr;
    return CliIoHost.instance().isCI ? process.stdout : process.stderr;
  }

  /**
   * Notifies the host of a message that requires a response.
   *
   * If the host does not return a response the suggested
   * default response from the input message will be used.
   */
  public async requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U> {
    if (this._internalIoHost) {
      return this._internalIoHost.requestResponse(msg);
    }

    await this.notify(msg);
    return msg.defaultResponse;
  }

  /**
   * Formats a message for console output with optional color support
   */
  private formatMessage(msg: IoMessage<any>): string {
    // apply provided style or a default style if we're in TTY mode
    let message_text = this._isTTY
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

/**
 * Returns true if the current process is running in a CI environment
 * @returns true if the current process is running in a CI environment
 */
export function isCI(): boolean {
  return process.env.CI !== undefined && process.env.CI !== 'false' && process.env.CI !== '0';
}
