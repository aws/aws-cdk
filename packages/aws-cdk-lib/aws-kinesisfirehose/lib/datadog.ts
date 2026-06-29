import {
  type HTTPAttribute,
  HTTPBackupMode,
  HTTPCompression,
  HTTPEndpoint,
} from './http-endpoint';
import type { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';

/**
 * A Datadog endpoint URL for use with Kinesis Data Firehose.
 *
 * Use one of the predefined static members for a known Datadog region, or
 * `DatadogEndpoint.of(url)` for a custom URL.
 */
export class DatadogEndpoint {
  /**
   * Logs — US1
   */
  public static readonly LOGS_US1 = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.datadoghq.com/v1/input');
  /**
   * Logs — US3
   */
  public static readonly LOGS_US3 = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.us3.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose');
  /**
   * Logs — US5
   */
  public static readonly LOGS_US5 = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose');
  /**
   * Logs — AP1 (Japan)
   */
  public static readonly LOGS_AP1 = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.ap1.datadoqhq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose');
  /**
   * Logs — EU
   */
  public static readonly LOGS_EU = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.datadoghq.eu/v1/input');
  /**
   * Logs — US Government
   */
  public static readonly LOGS_GOV = new DatadogEndpoint('https://aws-kinesis-http-intake.logs.ddog-gov.com/v1/input');

  /**
   * Metrics — US
   */
  public static readonly METRICS_US = new DatadogEndpoint('https://awsmetrics-intake.datadoghq.com/v1/input');
  /**
   * Metrics — US5
   */
  public static readonly METRICS_US5 = new DatadogEndpoint('https://event-platform-intake.us5.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose');
  /**
   * Metrics — AP1 (Japan)
   */
  public static readonly METRICS_AP1 = new DatadogEndpoint('https://event-platform-intake.ap1.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose');
  /**
   * Metrics — EU
   */
  public static readonly METRICS_EU = new DatadogEndpoint('https://awsmetrics-intake.datadoghq.eu/v1/input');

  /**
   * Configurations — US1
   */
  public static readonly CONFIGURATION_US1 = new DatadogEndpoint('https://cloudplatform-intake.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');
  /**
   * Configurations — US3
   */
  public static readonly CONFIGURATION_US3 = new DatadogEndpoint('https://cloudplatform-intake.us3.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');
  /**
   * Configurations — US5
   */
  public static readonly CONFIGURATION_US5 = new DatadogEndpoint('https://cloudplatform-intake.us5.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');
  /**
   * Configurations — AP1 (Japan)
   */
  public static readonly CONFIGURATION_AP1 = new DatadogEndpoint('https://cloudplatform-intake.ap1.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');
  /**
   * Configurations — EU
   */
  public static readonly CONFIGURATION_EU = new DatadogEndpoint('https://cloudplatform-intake.datadoghq.eu/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');
  /**
   * Configurations — US Government
   */
  public static readonly CONFIGURATION_US_GOV = new DatadogEndpoint('https://cloudplatform-intake.ddog-gov.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose');

  /**
   * Use a custom Datadog endpoint URL.
   *
   * @param url The full HTTPS endpoint URL.
   */
  public static of(url: string): DatadogEndpoint {
    return new DatadogEndpoint(url);
  }

  private constructor(
    /**
     * The endpoint URL string.
     */
    public readonly url: string,
  ) {}
}

/**
 * Props for defining a Datadog destination of a Kinesis Data Firehose delivery stream.
 */
export interface DatadogProps {
  /**
   * The API key required to enable data delivery from Amazon Data Firehose.
   */
  readonly apiKey: ISecret;
  /**
   * The Datadog endpoint to send data to.
   */
  readonly endpoint: DatadogEndpoint;
  /**
   * Datadog tags to apply for filtering.
   *
   * @default - No tags.
   */
  readonly tags?: HTTPAttribute[];
  /**
   * Describes the S3 bucket backup options for the data that Kinesis Data Firehose delivers to Datadog.
   *
   * @default - Failed only
   */
  readonly backupMode?: HTTPBackupMode;
}

/**
 * A Datadog destination for data from a Kinesis Data Firehose delivery stream.
 */
export class Datadog extends HTTPEndpoint {
  constructor(props: DatadogProps) {
    super({
      endpointConfig: {
        url: props.endpoint.url,
        secret: props.apiKey,
      },
      requestCompression: HTTPCompression.GZIP,
      bufferingHints: {
        interval: Duration.seconds(60),
        size: Size.mebibytes(4),
      },
      retryOptions: {
        duration: Duration.seconds(60),
      },
      backupMode: props.backupMode ?? HTTPBackupMode.FAILED,
      attributes: props.tags ?? [],
    });
  }
}
