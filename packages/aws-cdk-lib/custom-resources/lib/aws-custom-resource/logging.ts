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
   * Whether or not to log errors that were encountered during lambda execution.
   */
  private readonly logErrors: boolean;

  protected constructor(props: LoggingProps = {}) {
    this.logHandlerEvent = props.logHandlerEvent ?? true;
    this.logApiResponse = props.logApiResponse ?? true;
    this.logResponseObject = props.logResponseObject ?? true;
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
      logErrors: this.logErrors,
    };
  }
}
