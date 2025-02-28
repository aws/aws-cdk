import { Construct } from 'constructs';
import { BackupMode, CommonDestinationProps } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';
import { createBackupConfig, createBufferingHints, createEncryptionConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';

export enum DatadogLogsEndpointUrl {
  DATADOG_LOGS_US1 = 'https://aws-kinesis-http-intake.logs.datadoghq.com/v1/input',
  DATADOG_LOGS_US3 = 'https://aws-kinesis-http-intake.logs.us3.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose',
  DATADOG_LOGS_US5 = 'https://aws-kinesis-http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-protocol=aws-kinesis-firehose',
  DATADOG_LOGS_AP1 = 'https://aws-kinesis-http-intake.loqs.ap1.datadoqhq.com/api/v2/loqs?dd-protocol=aws-kinesis-firehose',
  DATADOG_LOGS_EU = 'https://aws-kinesis-http-intake.logs.datadoghq.eu/v1/input',
  DATADOG_LOGS_GOV = 'https://aws-kinesis-http-intake.logs.ddog-gov.com/v1/input',
}

export enum DatadogMetricsEndpointUrl {
  DATADOG_METRICS_US = 'https://awsmetrics-intake.datadoghq.com/v1/input',
  DATADOG_METRICS_US5 = 'https://event-platform-intake.us5.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose',
  DATADOG_METRICS_AP1 = 'https://event-platform-intake.ap1.datadoghq.com/api/v2/awsmetrics?dd-protocol=aws-kinesis-firehose',
  DATADOG_METRICS_EU = 'https://awsmetrics-intake.datadoghq.eu/v1/input',
}

export enum DatadogConfigurationsEndpointUrl {
  DATADOG_CONFIGURATION_US1 = 'https://cloudplatform-intake.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  DATADOG_CONFIGURATION_US3 = 'https://cloudplatform-intake.us3.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  DATADOG_CONFIGURATION_US5 = 'https://cloudplatform-intake.us5.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  DATADOG_CONFIGURATION_AP1 = 'https://cloudplatform-intake.ap1.datadoghq.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  DATADOG_CONFIGURATION_EU = 'https://cloudplatform-intake.datadoghq.eu/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
  DATADOG_CONFIGURATION_US_GOV = 'https://cloudplatform-intake.ddog-gov.com/api/v2/cloudchanges?dd-protocol=aws-kinesis-firehose',
}

export interface BufferHints {
  /**
   * The higher interval allows more time to collect data and the size of data may be bigger. The lower interval sends the data more frequently and may be more advantageous when looking at shorter cycles of data activity.
   * @default 60 seconds
   */
  interval?: Duration;
  /**
   * The higher buffer size may be lower in cost with higher latency. The lower buffer size will be faster in delivery with higher cost and less latency.
   * @default 4 MiB
   */
  size?: Size;
}

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
}

export class Datadog implements IDestination {
  constructor(private readonly props: DatadogProps) { }

  bind(scope: Construct, options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'Datadog Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'DatadogDestination',
    }) ?? {};

    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, this.props.s3Backup) ?? {};

    this.props.apiKey.grantRead(role);

    return {
      httpEndpointDestinationConfiguration: {
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupConfiguration: backupConfig,
        s3BackupMode: this.getS3BackupMode(),
        endpointConfiguration: {
          url: this.props.url,
        },
        requestConfiguration: {
          contentEncoding: 'GZIP',
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
}
