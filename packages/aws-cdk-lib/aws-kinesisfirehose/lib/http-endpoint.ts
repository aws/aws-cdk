import { Construct } from 'constructs';
import { CommonDestinationProps, BackupMode as S3BackupMode } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import { createBackupConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';

/**
 * Kinesis Data Firehose uses the content encoding to compress the body of a request before sending the request to the destination.
 */
export enum HTTPCompression {
  /**
   * GZIP
   */
  GZIP = 'GZIP',
  /**
   * NONE
   */
  NONE = 'NONE',
}

/**
 * Describes the S3 bucket backup options for the data that Kinesis Data Firehose delivers to the HTTP endpoint destination.
 */
export enum HTTPBackupMode {
  /**
   * Back up only the documents that Kinesis Data Firehose could not deliver.
   */
  FAILED = 'FailedDataOnly',
  /**
   * Back up all documents.
   */
  ALL = 'AllData',
}

/**
 * The buffering options that can be used before data is delivered to the specified destination.
 */
export interface HTTPBufferingHints {
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
 * Describes the retry behavior in case Kinesis Data Firehose is unable to deliver data to the specified HTTP endpoint destination, or if it doesn't receive a valid acknowledgment of receipt from the specified HTTP endpoint destination.
 */
export interface HTTPRetryOptions {
  /**
   * The total amount of time that Kinesis Data Firehose spends on retries.
   */
  readonly duration: Duration;
}

/**
 * Describes the configuration of the HTTP endpoint to which Kinesis Firehose delivers data.
 */
export interface HTTPEndpointConfig {
  /**
   * The URL of the HTTP endpoint selected as the destination.
   */
  readonly url: string;
  /**
   * The access key required for Kinesis Firehose to authenticate with the HTTP endpoint selected as the destination.
   * @default - None
   */
  readonly accessKey?: string;
  /**
   * The secret required for Kinesis Firehose to authenticate with the HTTP endpoint selected as the destination.
   * @default - None
   */
  readonly secret?: ISecret;
  /**
   * The name of the HTTP endpoint selected as the destination.
   * @default - None
   */
  readonly name?: string;
}

/**
 * Describes the metadata sent to the HTTP endpoint destination.
 */
export interface HTTPAttribute {
  /**
   * The name of the HTTP endpoint common attribute.
   */
  readonly name: string;
  /**
   * The value of the HTTP endpoint common attribute.
   */
  readonly value: string;
}

/**
 * Props for defining an HTTP destination of a Kinesis Data Firehose delivery stream.
 */
export interface HTTPEndpointProps extends CommonDestinationProps {
  /**
   * Describes the configuration of the HTTP endpoint to which Kinesis Firehose delivers data.
   */
  readonly endpointConfig: HTTPEndpointConfig;
  /**
   * Describes the S3 bucket backup options for the data that Kinesis Data Firehose delivers to the HTTP endpoint destination.
   * @default - Failed data only
   */
  readonly backupMode?: HTTPBackupMode;
  /**
   * Compress the body of a request before sending the request to the destination.
   * @default - None
   */
  readonly requestCompression?: HTTPCompression;
  /**
   * The buffering options that can be used before data is delivered to the specified destination.
   * @default - None
   */
  readonly bufferingHints?: HTTPBufferingHints;
  /**
   * The total amount of time that Kinesis Data Firehose spends on retries
   * @default - None
   */
  readonly retryOptions?: HTTPRetryOptions;
  /**
   * Describes the metadata sent to the HTTP endpoint destination.
   * @default - None
   */
  readonly attributes?: HTTPAttribute[];
}

/**
 *  An HTTP destination for data from a Kinesis Data Firehose delivery stream.
 */
export class HTTPEndpoint implements IDestination {
  constructor(private readonly props: HTTPEndpointProps) {}
  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'HTTP Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'HTTPDestination',
    }) ?? {};

    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, {
      mode: this.props.backupMode === HTTPBackupMode.ALL ? S3BackupMode.ALL : S3BackupMode.FAILED,
    })!; // Probably not a good idea?

    if (this.props.endpointConfig.secret) {
      this.props.endpointConfig.secret.grantRead(role);
    }

    return {
      httpEndpointDestinationConfiguration: {
        endpointConfiguration: {
          url: this.props.endpointConfig.url,
          ...this.props.endpointConfig.accessKey && { accessKey: this.props.endpointConfig.accessKey },
          ...this.props.endpointConfig.name && { name: this.props.endpointConfig.name },
        },
        ...this.props.retryOptions && {
          retryOptions: {
            durationInSeconds: this.props.retryOptions?.duration.toSeconds(),
          },
        },
        ...this.props.bufferingHints && {
          bufferingHints: {
            ...this.props.bufferingHints.interval && { intervalInSeconds: this.props.bufferingHints.interval.toSeconds() },
            ...this.props.bufferingHints.size && { sizeInMBs: this.props.bufferingHints.size.toMebibytes() },
          },
        },
        requestConfiguration: {
          contentEncoding: this.props.requestCompression ?? HTTPCompression.NONE,
          ...this.props.attributes && {
            commonAttributes: [...this.props.attributes.map(attr => ({ attributeName: attr.name, attributeValue: attr.value }))],
          },
        },
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupMode: this.props.backupMode ?? HTTPBackupMode.FAILED,
        s3Configuration: backupConfig,
        ...this.props.endpointConfig.secret && {
          secretsManagerConfiguration: {
            secretArn: this.props.endpointConfig.secret.secretArn,
            enabled: true,
            roleArn: role.roleArn,
          },
        },
      },
      dependables: [...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }
}
