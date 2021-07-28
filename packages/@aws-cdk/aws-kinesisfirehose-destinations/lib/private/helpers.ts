import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Construct, Node } from 'constructs';

export interface DestinationLoggingProps {
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
   */
  readonly role: iam.IRole;

  /**
   * The ID of the stream that is created in the log group where logs will be placed.
   *
   * Must be unique within the log group, so should be different every time this function is called.
   */
  readonly streamId: string;
}

export interface DestinationLoggingOutput {
  /**
   * Logging options that will be injected into the destination configuration.
   */
  readonly loggingOptions: firehose.CfnDeliveryStream.CloudWatchLoggingOptionsProperty;

  /**
   * Resources that were created by the sub-config creator that must be deployed before the delivery stream is deployed.
   */
  readonly dependables: cdk.IDependable[];
}

export function createLoggingOptions(scope: Construct, props: DestinationLoggingProps): DestinationLoggingOutput | undefined {
  if (props.logging === false && props.logGroup) {
    throw new Error('logging cannot be set to false when logGroup is provided');
  }
  if (props.logging !== false || props.logGroup) {
    const logGroup = props.logGroup ?? Node.of(scope).tryFindChild('LogGroup') as logs.ILogGroup ?? new logs.LogGroup(scope, 'LogGroup');
    const logGroupGrant = logGroup.grantWrite(props.role);
    return {
      loggingOptions: {
        enabled: true,
        logGroupName: logGroup.logGroupName,
        logStreamName: logGroup.addStream(props.streamId).logStreamName,
      },
      dependables: [logGroupGrant],
    };
  }
  return undefined;
}

export function createBufferingHints(
  interval?: cdk.Duration,
  size?: cdk.Size,
): firehose.CfnDeliveryStream.BufferingHintsProperty | undefined {
  if (!interval && !size) {
    return undefined;
  }
  const intervalInSeconds = interval?.toSeconds() ?? 300;
  const sizeInMBs = size?.toMebibytes() ?? 5;
  if (intervalInSeconds < 60 || intervalInSeconds > 900) {
    throw new Error('Buffering interval must be between 60 and 900 seconds');
  }
  if (sizeInMBs < 1 || sizeInMBs > 128) {
    throw new Error('Buffering size must be between 1 and 128 MBs');
  }
  return {
    intervalInSeconds,
    sizeInMBs,
  };
}
