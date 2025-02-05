import * as logs from '../../aws-logs';

/**
 * Configuration interface for logging errors when data transformation or delivery fails.
 *
 * This interface defines whether logging is enabled and optionally allows specifying a
 * CloudWatch Log Group for storing error logs.
 */
export interface ILoggingConfig {
  /**
   * If true, log errors when data transformation or data delivery fails.
   *
   * `true` when using `EnableLogging`, `false` when using `DisableLogging`.
   */
  readonly logging: boolean;

  /**
   * The CloudWatch log group where log streams will be created to hold error logs.
   *
   * @default - if `logging` is set to `true`, a log group will be created for you.
   */
  readonly logGroup?: logs.ILogGroup;
}

/**
 * Enables logging for error logs with an optional custom CloudWatch log group.
 *
 * When this class is used, logging is enabled (`logging: true`) and
 * you can optionally provide a CloudWatch log group for storing the error logs.
 *
 * If no log group is provided, a default one will be created automatically.
 */
export class EnableLogging implements ILoggingConfig {
  public readonly logGroup?: logs.ILogGroup;
  public readonly logging: boolean;

  constructor(logGroup?: logs.ILogGroup) {
    this.logGroup = logGroup;
    this.logging = true;
  }
}

/**
 * Disables logging for error logs.
 *
 * When this class is used, logging is disabled (`logging: false`)
 * and no CloudWatch log group can be specified.
 */
export class DisableLogging implements ILoggingConfig {
  public readonly logging: boolean;

  constructor() {
    this.logging = false;
  }
}
