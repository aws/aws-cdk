import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Construct, Node } from 'constructs';
import { CfnDeliveryStream } from './kinesisfirehose.generated';

/**
 * A Kinesis Data Firehose delivery stream destination configuration.
 */
export interface DestinationConfig {
  /**
   * S3 destination configuration properties.
   *
   * @default - S3 destination is not used.
   */
  readonly extendedS3DestinationConfiguration?: CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty;
}

/**
 * Options when binding a destination to a delivery stream.
 */
export interface DestinationBindOptions {
}

/**
 * A Kinesis Data Firehose delivery stream destination.
 */
export interface IDestination {
  /**
   * Binds this destination to the Kinesis Data Firehose delivery stream.
   *
   * Implementers should use this method to bind resources to the stack and initialize values using the provided stream.
   */
  bind(scope: Construct, options: DestinationBindOptions): DestinationConfig;
}

/**
 * Generic properties for defining a delivery stream destination.
 */
export interface DestinationProps {
  /**
   * If true, log errors when data transformation or data delivery fails.
   *
   * If `logGroup` is provided, this will be implicitly set to `true`.
   *
   * @default true - errors are logged.
   */
  readonly logging?: boolean;

  /**
   * The CloudWatch log group where log streams will be created to hold error logs.
   *
   * @default - if `logging` is set to `true`, a log group will be created for you.
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * The IAM role associated with this destination.
   *
   * Assumed by Kinesis Data Firehose to invoke processors and write to destinations
   *
   * @default - a role will be created with default permissions.
   */
  readonly role?: iam.IRole;
}

/**
 * Abstract base class that destination types can extend to benefit from methods that create generic configuration.
 */
export abstract class DestinationBase implements IDestination {

  constructor(protected readonly props: DestinationProps = {}) { }

  abstract bind(scope: Construct, options: DestinationBindOptions): DestinationConfig;

  protected createLoggingOptions(
    scope: Construct,
    role: iam.IRole,
    streamId: string,
  ): CfnDeliveryStream.CloudWatchLoggingOptionsProperty | undefined {
    if (this.props.logging === false && this.props.logGroup) {
      throw new Error('logging cannot be set to false when logGroup is provided');
    }
    if (this.props.logging !== false || this.props.logGroup) {
      const logGroup = Node.of(scope).tryFindChild('LogGroup') as logs.ILogGroup ?? this.props.logGroup ?? new logs.LogGroup(scope, 'LogGroup');
      const logGroupGrant = logGroup.grantWrite(role);
      Node.of(scope).addDependency(logGroupGrant);
      return {
        enabled: true,
        logGroupName: logGroup.logGroupName,
        logStreamName: logGroup.addStream(streamId).logStreamName,
      };
    }
    return undefined;
  }
}
