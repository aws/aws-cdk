/**
 * Properties used to initialize Logging.
 */
export interface LoggingProps {
  /**
   * Whether or not to log the event object received by the lambda handler.
   *
   * @default true
   */
  readonly logHandlerEvent?: boolean;

  /**
   * Whether or not to log the response returned from the API call.
   *
   * @default true
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
   * @default true
   */
  readonly logResponseObject?: boolean;

  /**
   * Whether or not to log the AWS SDK version used for API calls during lambda execution.
   *
   * @default true
   */
  readonly logSdkVersion?: boolean;

  /**
   * Whether or not to log errors that were encountered during lambda execution.
   *
   * @default true
   */
  readonly logErrors?: boolean;
}

/**
 * A class that represents Logging that will take place during lambda execution.
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
        super();
      }
    })();
  }

  /**
   * Enables selective logging of logged data in the lambda handler.
   */
  public static selective(props: LoggingProps = {}): Logging {
    return new (class extends Logging {
      public constructor() {
        super({ ...props });
      }
    })();
  }

  /**
   * Turns off all logging in the lambda handler.
   */
  public static off(): Logging {
    return new (class extends Logging {
      public constructor() {
        super({
          logHandlerEvent: false,
          logApiResponse: false,
          logResponseObject: false,
          logSdkVersion: false,
          logErrors: false,
        });
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

  protected constructor(props: LoggingProps = {}) {
    this.logHandlerEvent = props.logHandlerEvent ?? true;
    this.logApiResponse = props.logApiResponse ?? true;
    this.logResponseObject = props.logResponseObject ?? true;
    this.logSdkVersion = props.logSdkVersion ?? true;
    this.logErrors = props.logErrors ?? true;
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
