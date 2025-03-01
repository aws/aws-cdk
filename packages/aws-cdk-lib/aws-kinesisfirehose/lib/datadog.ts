import { Attribute, HTTPBackupMode, HTTPEndpoint } from './http-endpoint';
import { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';

/**
 * Datadog logs HTTP endpoint URLs
 */
export enum DatadogLogsEndpointUrl {
  /**
   * US Location
   */
  DATADOG_LOGS_US1 = 'https://aws-kinesis-http-intake.logs.datadoghq.com/v1/input',
  /**
   * US Location
   */
  DATADOG_LOGS_US3 = 'https://aws-kinesis-http-intake.logs.us3.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose',
  /**
   * US Location
   */
  DATADOG_LOGS_US5 = 'https://aws-kinesis-http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose',
  /**
   * Japan Location
   */
  DATADOG_LOGS_AP1 = 'https://aws-kinesis-http-intake.loqs.ap1.datadoqhq.com/api/v2/loqs?dd-protocol=aws-kinesis-firehose',
  /**
   * EU Location
   */
  DATADOG_LOGS_EU = 'https://aws-kinesis-http-intake.logs.datadoghq.eu/v1/input',
  /**
   * US Government Location
   */
  DATADOG_LOGS_GOV = 'https://aws-kinesis-http-intake.logs.ddog-gov.com/v1/input',
}

/**
 * Datadog metrics HTTP endpoint URLs
 */
export enum DatadogMetricsEndpointUrl {
  /**
   * US Location
   */
  DATADOG_METRICS_US = 'https://awsmetrics-intake.datadoghq.com/v1/input',
  /**
   * US Location
   */
  DATADOG_METRICS_US5 = 'https://event-platform-intake.us5.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose',
  /**
   * Japan Location
   */
  DATADOG_METRICS_AP1 = 'https://event-platform-intake.ap1.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose',
  /**
   * EU Location
   */
  DATADOG_METRICS_EU = 'https://awsmetrics-intake.datadoghq.eu/v1/input',
}

/**
 * Datadog configurations HTTP endpoint URLs
 */
export enum DatadogConfigurationsEndpointUrl {
  /**
   * US Location
   */
  DATADOG_CONFIGURATION_US1 = 'https://cloudplatform-intake.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  /**
   * US Location
   */
  DATADOG_CONFIGURATION_US3 = 'https://cloudplatform-intake.us3.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  /**
   * US Location
   */
  DATADOG_CONFIGURATION_US5 = 'https://cloudplatform-intake.us5.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  /**
   * Japan Location
   */
  DATADOG_CONFIGURATION_AP1 = 'https://cloudplatform-intake.ap1.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  /**
   * EU Location
   */
  DATADOG_CONFIGURATION_EU = 'https://cloudplatform-intake.datadoghq.eu/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  /**
   * US Government Location
   */
  DATADOG_CONFIGURATION_US_GOV = 'https://cloudplatform-intake.ddog-gov.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
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
   * The URL of the Datadog endpoint.
   */
  readonly url: DatadogLogsEndpointUrl | DatadogMetricsEndpointUrl | DatadogConfigurationsEndpointUrl;
  /**
   * Datadog tags to apply for filtering.
   * @default - No tags.
   */
  readonly tags?: Attribute[];
  /**
   * @default - failed only
   */
  readonly backupMode?: HTTPBackupMode;
}

/**
 * A Datadog destination for data from a Kinesis Data Firehose delivery stream.
 */
export class Datadog extends HTTPEndpoint {
  constructor(props: DatadogProps) {
    super({
      endpoint: {
        url: props.url,
        secret: props.apiKey,
      },
      bufferingHints: {
        interval: Duration.seconds(60),
        size: Size.mebibytes(4),
      },
      retryOptions: {
        duration: Duration.seconds(60),
      },
      attributes: props.tags ?? [],
    });
  }
}
