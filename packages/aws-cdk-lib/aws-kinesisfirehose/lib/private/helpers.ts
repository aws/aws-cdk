import { Construct, IDependable, Node } from 'constructs';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as logs from '../../../aws-logs';
import * as s3 from '../../../aws-s3';
import * as cdk from '../../../core';
import { DestinationS3BackupProps } from '../common';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';
import { ILoggingConfig } from '../logging-config';
import { IDataProcessor } from '../processor';

export interface DestinationLoggingProps {
  /**
   * Configuration that determines whether to log errors during data transformation or delivery failures,
   * and specifies the CloudWatch log group for storing error logs.
   *
   * @default - errors will be logged and a log group will be created for you.
   */
  readonly loggingConfig?: ILoggingConfig;

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
  if (props.loggingConfig?.logging !== false || props.loggingConfig?.logGroup) {
    const logGroup = props.loggingConfig?.logGroup ?? Node.of(scope).tryFindChild('LogGroup') as logs.ILogGroup ?? new logs.LogGroup(scope, 'LogGroup');
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
  scope: Construct,
  interval?: cdk.Duration,
  size?: cdk.Size,
): CfnDeliveryStream.BufferingHintsProperty | undefined {
  if (!interval && !size) {
    return undefined;
  }

  const intervalInSeconds = interval?.toSeconds() ?? 300;
  if (intervalInSeconds > 900) {
    throw new cdk.ValidationError(`Buffering interval must be less than 900 seconds. Buffering interval provided was ${intervalInSeconds} seconds.`, scope);
  }
  const sizeInMBs = size?.toMebibytes() ?? 5;
  if (sizeInMBs < 1 || sizeInMBs > 128) {
    throw new cdk.ValidationError(`Buffering size must be between 1 and 128 MiBs. Buffering size provided was ${sizeInMBs} MiBs.`, scope);
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
  dataProcessor?: IDataProcessor,
): CfnDeliveryStream.ProcessingConfigurationProperty | undefined {
  return dataProcessor
    ? {
      enabled: true,
      processors: [renderDataProcessor(dataProcessor, scope, role)],
    }
    : undefined;
}

function renderDataProcessor(
  processor: IDataProcessor,
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
    loggingConfig: props.loggingConfig,
    role,
    streamId: 'S3Backup',
  }) ?? {};

  return {
    backupConfig: {
      bucketArn: bucket.bucketArn,
      roleArn: role.roleArn,
      prefix: props.dataOutputPrefix,
      errorOutputPrefix: props.errorOutputPrefix,
      bufferingHints: createBufferingHints(scope, props.bufferingInterval, props.bufferingSize),
      compressionFormat: props.compression?.value,
      encryptionConfiguration: createEncryptionConfig(role, props.encryptionKey),
      cloudWatchLoggingOptions: loggingOptions,
    },
    dependables: [bucketGrant, ...(loggingDependables ?? [])],
  };
}
