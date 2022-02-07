import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct, IDependable, Node } from 'constructs';
import { DestinationS3BackupProps } from '../common';

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

interface ConfigWithDependables {
  /**
   * Resources that were created by the sub-config creator that must be deployed before the delivery stream is deployed.
   */
  readonly dependables: IDependable[];
}

export interface DestinationLoggingConfig extends ConfigWithDependables {
  /**
   * Logging options that will be injected into the destination configuration.
   */
  readonly loggingOptions: CfnDeliveryStream.CloudWatchLoggingOptionsProperty;
}

export interface DestinationBackupConfig extends ConfigWithDependables {
  /**
   * S3 backup configuration that will be injected into the destination configuration.
   */
  readonly backupConfig: CfnDeliveryStream.S3DestinationConfigurationProperty;
}

export function createLoggingOptions(scope: Construct, props: DestinationLoggingProps): DestinationLoggingConfig | undefined {
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
): CfnDeliveryStream.BufferingHintsProperty | undefined {
  if (!interval && !size) {
    return undefined;
  }

  const intervalInSeconds = interval?.toSeconds() ?? 300;
  if (intervalInSeconds < 60 || intervalInSeconds > 900) {
    throw new Error(`Buffering interval must be between 60 and 900 seconds. Buffering interval provided was ${intervalInSeconds} seconds.`);
  }
  const sizeInMBs = size?.toMebibytes() ?? 5;
  if (sizeInMBs < 1 || sizeInMBs > 128) {
    throw new Error(`Buffering size must be between 1 and 128 MiBs. Buffering size provided was ${sizeInMBs} MiBs.`);
  }
  return { intervalInSeconds, sizeInMBs };
}

export function createEncryptionConfig(
  role: iam.IRole,
  encryptionKey?: kms.IKey,
): CfnDeliveryStream.EncryptionConfigurationProperty | undefined {
  encryptionKey?.grantEncryptDecrypt(role);
  return encryptionKey
    ? { kmsEncryptionConfig: { awskmsKeyArn: encryptionKey.keyArn } }
    : undefined;
}

export function createProcessingConfig(
  scope: Construct,
  role: iam.IRole,
  dataProcessor?: firehose.IDataProcessor,
): CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
  return dataProcessor
    ? {
      enabled: true,
      processors: [renderDataProcessor(dataProcessor, scope, role)],
    }
    : undefined;
}

function renderDataProcessor(
  processor: firehose.IDataProcessor,
  scope: Construct,
  role: iam.IRole,
): CfnDeliveryStream.ProcessorProperty {
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
    parameters,
  };
}

export function createBackupConfig(scope: Construct, role: iam.IRole, props?: DestinationS3BackupProps): DestinationBackupConfig | undefined {
  if (!props || (props.mode === undefined && !props.bucket)) {
    return undefined;
  }

  const bucket = props.bucket ?? new s3.Bucket(scope, 'BackupBucket');
  const bucketGrant = bucket.grantReadWrite(role);

  const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
    logging: props.logging,
    logGroup: props.logGroup,
    role,
    streamId: 'S3Backup',
  }) ?? {};

  return {
    backupConfig: {
      bucketArn: bucket.bucketArn,
      roleArn: role.roleArn,
      prefix: props.dataOutputPrefix,
      errorOutputPrefix: props.errorOutputPrefix,
      bufferingHints: createBufferingHints(props.bufferingInterval, props.bufferingSize),
      compressionFormat: props.compression?.value,
      encryptionConfiguration: createEncryptionConfig(role, props.encryptionKey),
      cloudWatchLoggingOptions: loggingOptions,
    },
    dependables: [bucketGrant, ...(loggingDependables ?? [])],
  };
}
