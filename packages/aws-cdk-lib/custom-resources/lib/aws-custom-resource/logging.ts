/**
 * Properties used to initialize Logging.
 */
export interface LoggingProps {
  /**
   * Whether or not to log data associated with the API call response.
   *
   * @default true
   */
  readonly logApiResponseData?: boolean;
}

/**
 * A class used to configure Logging during AwsCustomResource SDK calls.
 */
export abstract class Logging {
  /**
   * Enables logging of all logged data in the lambda handler.
   *
   * This includes the event object, the API call response, all fields in the response object
   * returned by the lambda, and any errors encountered.
   */
  public static all(): Logging {
    return new (class extends Logging {
      public constructor() {
        super();
      }
    })();
  }

  /**
   * Hides logging of data associated with the API call response. This includes hiding the raw API
   * call response and the `Data` field associated with the lambda handler response.
   */
  public static withDataHidden(): Logging {
    return new (class extends Logging {
      public constructor() {
        super({ logApiResponseData: false });
      }
    })();
  }

  /**
   * Whether or not to log data associated with the API call response.
   */
  private logApiResponseData?: boolean;

  protected constructor(props: LoggingProps = {}) {
    this.logApiResponseData = props.logApiResponseData ?? true;
  }

  /**
   * @internal
   */
  public _render() {
    return { logApiResponseData: this.logApiResponseData };
  }
}
