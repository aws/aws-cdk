import * as logs from 'aws-cdk-lib/aws-logs';

/**
 * Represents the logging configuration for error logs.
 * 
 * This class defines whether logging is enabled or disabled and holds
 * the CloudWatch log group where error logs are stored if logging is enabled.
 * 
 * Subclasses must implement whether logging is enabled (`EnableLogging`) 
 * or disabled (`DisableLogging`).
 */
export abstract class LoggingConfig {
    /**
     * If true, log errors when data transformation or data delivery fails.
     *
     * `true` when using `EnableLogging`, `false` when using `DisableLogging`.
     */
    public abstract logging: boolean;

    /**
     * The CloudWatch log group where log streams will be created to hold error logs.
     *
     * @default - if `logging` is set to `true`, a log group will be created for you.
     */
    public logGroup?: logs.ILogGroup;
}

/**
 * Enables logging for error logs with an optional custom CloudWatch log group.
 * 
 * When this class is used, logging is enabled (`logging: true`) and 
 * you can optionally provide a CloudWatch log group for storing the error logs.
 * 
 * If no log group is provided, a default one will be created automatically.
 */
export class EnableLogging extends LoggingConfig {
    public logging: boolean = true;
  
    constructor(logGroup?: logs.ILogGroup) {
      super();
      this.logGroup = logGroup;
    }
  }
  
/**
 * Disables logging for error logs.
 * 
 * When this class is used, logging is disabled (`logging: false`) 
 * and no CloudWatch log group can be specified.
 */
export class DisableLogging extends LoggingConfig {
    public logging: boolean = false;
  
    constructor() {
      super();
      // No logGroup should be allowed when logging is disabled
    }
  }