/**
 * Options used to initialize Logging.
 */
export interface LoggingOptions {
  /**
   * Whether or not to log the event object received by the lambda handler.
   *
   * @default false
   */
  readonly logHandlerEvent?: boolean;

  /**
   * Whether or not to log the response returned from the API call.
   *
   * @default false
   */
  readonly logApiResponse?: boolean;

  /**
   * Whether or not to log the response object that will be returned by the lambda.
   *
   * Example response object:
   *
   * {
   *   "Status": "SUCCESS",
   *   "Reason": "OK",
   *   "PhysicalResourceId": "1234567890123",
   *   "StackId": "arn:aws:cloudformation:us-west-2:123456789012:stack/Test/043tyub2-194e-4cy2-a969-9891ghj6cd0d",
   *   "RequestId": "a16y677a-a8b6-41a6-bf7b-7644586861a5",
   *   "LogicalResourceId": "Sercret",
   *   "NoEcho": false,
   *   "Data": {
   *     "region": "us-west-2",
   *     "Parameter.ARN": "arn:aws:ssm:us-west-2:123456789012:parameter/Test/Parameter",
   *     "Parameter.DataType": "text",
   *     "Parameter.Name": "/Test/Parameter",
   *     "Parameter.Type": "SecureString",
   *     "Parameter.Value": "ThisIsSecret!123",
   *     "Parameter.Version": 1
   *   }
   * }
   *
   * @default false
   */
  readonly logResponseObject?: boolean;

  /**
   * Whether or not to log the AWS SDK version used for API calls during lambda execution.
   *
   * @default false
   */
  readonly logSdkVersion?: boolean;

  /**
   * Whether or not to log errors that were encountered during lambda execution.
   *
   * @default false
   */
  readonly logErrors?: boolean;
}

/**
 * A class used to configure Logging during for AwsCustomResource.
 */
export abstract class Logging {
  /**
   * Enables logging of all logged data in the lambda handler.
   *
   * This includes the event object, the API call response, all fields in the response object
   * returned by the lambda, and any errors encountered.
   */
  public static on(): Logging {
    return new (class extends Logging {
      public constructor() {
        super({
          logHandlerEvent: true,
          logApiResponse: true,
          logResponseObject: true,
          logSdkVersion: true,
          logErrors: true,
        });
      }
    })();
  }

  /**
   * Enables selective logging of logged data in the lambda handler.
   */
  public static selective(options: LoggingOptions = {}): Logging {
    return new (class extends Logging {
      public constructor() {
        super({ ...options });
      }
    })();
  }

  /**
   * Turns off all logging in the lambda handler.
   */
  public static off(): Logging {
    return new (class extends Logging {
      public constructor() {
        super();
      }
    })();
  }

  /**
   * Whether or not to log the event object received by the lambda handler.
   */
  private readonly logHandlerEvent: boolean;

  /**
   * Whether or not to log the API call response.
   */
  private readonly logApiResponse: boolean;

  /**
   * Whether or not to log the response object that will be returned by the lambda.
   */
  private readonly logResponseObject: boolean;

  /**
   * Whether or not to log the AWS SDK version used for API calls during lambda execution.
   */
  private readonly logSdkVersion: boolean;

  /**
   * Whether or not to log errors that were encountered during lambda execution.
   */
  private readonly logErrors: boolean;

  protected constructor(props: LoggingOptions = {}) {
    this.logHandlerEvent = props.logHandlerEvent ?? false;
    this.logApiResponse = props.logApiResponse ?? false;
    this.logResponseObject = props.logResponseObject ?? false;
    this.logSdkVersion = props.logSdkVersion ?? false;
    this.logErrors = props.logErrors ?? false;
  }

  /**
   * @internal
   */
  public _render() {
    return {
      logHandlerEvent: this.logHandlerEvent,
      logApiResponse: this.logApiResponse,
      logResponseObject: this.logResponseObject,
      logSdkVersion: this.logSdkVersion,
      logErrors: this.logErrors,
    };
  }
}
