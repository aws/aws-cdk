import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import { CfnDeliveryStream } from './kinesisfirehose.generated';
import * as iam from '../../aws-iam';
import { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';
import { createBackupConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { Bucket } from '../../aws-s3';

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
 * The buffering options that can be used before data is delivered to the specified destination.
 */
export interface BufferHints {
  /**
   * The higher interval allows more time to collect data and the size of data may be bigger. The lower interval sends the data more frequently and may be more advantageous when looking at shorter cycles of data activity.
   * @default 60 seconds
   */
  readonly interval?: Duration;
  /**
   * The higher buffer size may be lower in cost with higher latency. The lower buffer size will be faster in delivery with higher cost and less latency.
   * @default 4 MiB
   */
  readonly size?: Size;
}

/**
 * Datadog tag
 */
export interface DatadogTag {
  /**
   * Tag key
   */
  readonly key: string;
  /**
   * Tag value
   */
  readonly value: string;
}

/**
 * Props for defining a Datadog destination of a Kinesis Data Firehose delivery stream.
 */
export interface DatadogProps extends CommonDestinationProps {
  /**
   * The API key required to enable data delivery from Amazon Data Firehose.
   */
  readonly apiKey: ISecret;
  /**
   * The URL of the Datadog endpoint.
   */
  readonly url: DatadogLogsEndpointUrl | DatadogMetricsEndpointUrl | DatadogConfigurationsEndpointUrl;
  /**
   * Amazon Data Firehose buffers incoming records before delivering them to your Datadog domain.
   * @default - 60 second interval with 4MiB size.
   */
  readonly bufferHints?: BufferHints;
  /**
   * The time period during which Amazon Data Firehose retries sending data to the selected HTTP endpoint.
   * @default 60 seconds
   */
  readonly retryDuration?: Duration;
  /**
   * Datadog tags to apply for filtering.
   * @default - No tags.
   */
  readonly tags?: DatadogTag[];
}

/**
 * A Datadog destination for data from a Kinesis Data Firehose delivery stream.
 */
export class Datadog implements IDestination {
  constructor(private readonly props: DatadogProps) { }

  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'Datadog Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'DatadogDestination',
    }) ?? {};

    const bucket = new Bucket(scope, 'S3 Configuration', {});
    bucket.grantReadWrite(role);

    const { dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};

    this.props.apiKey.grantRead(role);

    return {
      httpEndpointDestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3Configuration: {
          bucketArn: bucket.bucketArn,
          roleArn: role.roleArn,
        },
        s3BackupMode: this.getS3BackupMode(),
        endpointConfiguration: {
          url: this.props.url,
        },
        requestConfiguration: {
          contentEncoding: 'GZIP',
          commonAttributes: this.createAttributesFromTags(),
        },
        retryOptions: {
          durationInSeconds: this.props.retryDuration?.toSeconds() ?? 60,
        },
        bufferingHints: {
          sizeInMBs: this.props.bufferHints?.size?.toMebibytes() ?? 4,
          intervalInSeconds: this.props.bufferHints?.interval?.toSeconds() ?? 60,
        },
        secretsManagerConfiguration: {
          enabled: true,
          roleArn: role.roleArn,
          secretArn: this.props.apiKey.secretArn,
        },
      },
      dependables: [...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }
  private getS3BackupMode(): string | undefined {
    return this.props.s3Backup?.bucket || this.props.s3Backup?.mode === BackupMode.ALL
      ? 'Enabled'
      : undefined;
  }
  private createAttributesFromTags(): CfnDeliveryStream.HttpEndpointCommonAttributeProperty[] {
    let attributes: any = [];
    this.props.tags?.forEach((tag) => {
      attributes.push({
        attributeName: tag.key,
        attributeValue: tag.value,
      });
    });
    return attributes;
  }
}
