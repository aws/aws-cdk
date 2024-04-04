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
   * Note: This property is only relevant when using SDK v3.
   *
   * @default true
   */
  readonly logApiResponse?: boolean;

  /**
   * Whether or not to log the response object that will be returned by the lambda.
   *
   * @default true
   */
  readonly logResponseObject?: boolean;

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
export class Logging {
  /**
   * Enables logging of all logged data in the lambda handler.
   *
   * This includes the event object, the API call response, all fields in the response object
   * returned by the lambda, and any errors encountered.
   */
  public static on() {
    return new Logging();
  }

  /**
   * Enables selective logging of logged data in the lambda handler.
   */
  public static selective(props: LoggingProps) {
    return new Logging({ ...props });
  }

  /**
   * Turns off all logging in the lambda handler.
   */
  public static off() {
    return new Logging({
      logHandlerEvent: false,
      logApiResponse: false,
      logResponseObject: false,
      logErrors: false,
    });
  }

  /**
   * Whether or not to log the event object received by the lambda handler.
   */
  public readonly logHandlerEvent: boolean;

  /**
   * Whether or not to log the API call response.
   */
  public readonly logApiResponse: boolean;

  /**
   * Whether or not to log the response object that will be returned by the lambda.
   */
  public readonly logResponseObject: boolean;

  /**
   * Whether or not to log errors that were encountered during lambda execution.
   */
  public readonly logErrors: boolean;

  private constructor(props: LoggingProps = {}) {
    this.logHandlerEvent = props.logHandlerEvent ?? true;
    this.logApiResponse = props.logApiResponse ?? true;
    this.logResponseObject = props.logResponseObject ?? true;
    this.logErrors = props.logErrors ?? true;
  }
}