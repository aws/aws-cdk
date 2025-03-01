import { Construct } from 'constructs';
import { CommonDestinationProps, BackupMode as S3BackupMode } from './common';
import { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import { createBackupConfig, createLoggingOptions, createProcessingConfig } from './private/helpers';
import { ISecret } from '../../aws-secretsmanager';
import { Duration, Size } from '../../core';

/**
 *
 */
export enum HTTPCompression {
  /**
   *
   */
  GZIP = 'GZIP',
  /**
   *
   */
  NONE = 'NONE',
}

/**
 *
 */
export enum HTTPBackupMode {
  /**
   *
   */
  FAILED = 'FailedDataOnly',
  /**
   *
   */
  ALL = 'AllData',
}

/**
 * The buffering options that can be used before data is delivered to the specified destination.
 */
export interface BufferingHints {
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
 *
 */
export interface RetryOptions {
  /**
   *
   */
  readonly duration: Duration;
}

/**
 *
 */
export interface Endpoint {
  /**
   *
   */
  readonly url: string;
  /**
   * @default - Not used
   */
  readonly accessKey?: string;
  /**
   *
   * @default - Not used
   */
  readonly secret?: ISecret;
  /**
   * @default - Not used
   */
  readonly name?: string;
}

/**
 *
 */
export interface Attribute {
  /**
   *
   */
  readonly name: string;
  /**
   *
   */
  readonly value: string;
}

/**
 *
 */
export interface HTTPEndpointProps extends CommonDestinationProps {
  /**
   *
   */
  readonly endpoint: Endpoint;
  /**
   * @default - FailedDataOnly
   */
  readonly backupMode?: HTTPBackupMode;
  /**
   * @default - GZIP
   */
  readonly requestCompression?: HTTPCompression;
  /**
   * @default -
   */
  readonly bufferingHints?: BufferingHints;
  /**
   * @default -
   */
  readonly retryOptions?: RetryOptions;
  /**
   * @default - None
   */
  readonly attributes?: Attribute[];
}

/**
 *
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
      mode: S3BackupMode.FAILED,
    })!; // Probably not a good idea?

    if (this.props.endpoint.secret) {
      this.props.endpoint.secret.grantRead(role);
    }

    return {
      httpEndpointDestinationConfiguration: {
        endpointConfiguration: {
          url: this.props.endpoint.url,
          ...this.props.endpoint.accessKey && { accessKey: this.props.endpoint.accessKey },
          ...this.props.endpoint.name && { name: this.props.endpoint.name },
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
          contentEncoding: this.props.requestCompression ?? HTTPCompression.GZIP,
          ...this.props.attributes && {
            commonAttributes: [...this.props.attributes.map(attr => ({ attributeName: attr.name, attributeValue: attr.value }))],
          },
        },
        cloudWatchLoggingOptions: loggingOptions,
        processingConfiguration: createProcessingConfig(scope, role, this.props.processor),
        roleArn: role.roleArn,
        s3BackupMode: this.props.backupMode ?? HTTPBackupMode.FAILED,
        s3Configuration: backupConfig,
        ...this.props.endpoint.secret && {
          secretsManagerConfiguration: {
            secretArn: this.props.endpoint.secret.secretArn,
            enabled: true,
            roleArn: role.roleArn,
          },
        },
      },
      dependables: [...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }
}
