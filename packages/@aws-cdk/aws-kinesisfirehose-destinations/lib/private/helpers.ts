import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Construct, Node } from 'constructs';
import { IDataProcessor } from '../processor';

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
  bufferingInterval?: cdk.Duration,
  bufferingSize?: cdk.Size,
):firehose.CfnDeliveryStream.BufferingHintsProperty | undefined {
  if (bufferingInterval && bufferingSize) {
    if (bufferingInterval.toSeconds() < 60 || bufferingInterval.toSeconds() > 900) {
      throw new Error('Buffering interval must be between 60 and 900 seconds');
    }
    if (bufferingSize.toMebibytes() < 1 || bufferingSize.toMebibytes() > 128) {
      throw new Error('Buffering size must be between 1 and 128 MBs');
    }
    return {
      intervalInSeconds: bufferingInterval.toSeconds(),
      sizeInMBs: bufferingSize.toMebibytes(),
    };
  } else if (!bufferingInterval && bufferingSize) {
    throw new Error('If bufferingSize is specified, bufferingInterval must also be specified');
  } else if (bufferingInterval && !bufferingSize) {
    throw new Error('If bufferingInterval is specified, bufferingSize must also be specified');
  }
  return undefined;
}

export function createEncryptionConfig(role: iam.IRole, encryptionKey?: kms.IKey): firehose.CfnDeliveryStream.EncryptionConfigurationProperty {
  encryptionKey?.grantEncryptDecrypt(role);
  return encryptionKey != null
    ? { kmsEncryptionConfig: { awskmsKeyArn: encryptionKey.keyArn } }
    : { noEncryptionConfig: 'NoEncryption' };
}

export function createProcessingConfig(
  scope: Construct,
  role: iam.IRole,
  dataProcessors?: IDataProcessor[],
): firehose.CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
  if (dataProcessors && dataProcessors.length > 1) {
    throw new Error('Only one processor is allowed per delivery stream destination');
  }
  if (dataProcessors && dataProcessors.length > 0) {
    const processors = dataProcessors.map((processor) => {
      const processorConfig = processor.bind(scope, { role });
      const parameters = [{ parameterName: 'RoleArn', parameterValue: role.roleArn }];
      parameters.push(processorConfig.processorIdentifier);
      if (processor.props.bufferInterval) {
        parameters.push({ parameterName: 'BufferIntervalInSeconds', parameterValue: processor.props.bufferInterval.toSeconds().toString() });
      }
      if (processor.props.bufferSize) {
        parameters.push({ parameterName: 'BufferSizeInMBs', parameterValue: processor.props.bufferSize.toMebibytes().toString() });
      }
      if (processor.props.retries) {
        parameters.push({ parameterName: 'NumberOfRetries', parameterValue: processor.props.retries.toString() });
      }
      return {
        type: processorConfig.processorType,
        parameters: parameters,
      };
    });

    return {
      enabled: true,
      processors: processors,
    };
  }
  return undefined;
}
