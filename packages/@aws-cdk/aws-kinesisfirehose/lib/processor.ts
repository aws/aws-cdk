import * as iam from '@aws-cdk/aws-iam';
import { Duration, Size } from '@aws-cdk/core';

import { Construct } from 'constructs';

/**
 * Configure the data processor.
 */
export interface DataProcessorProps {
  /**
   * The length of time Kinesis Data Firehose will buffer incoming data before calling the processor.
   *s
   * @default Duration.minutes(1)
   */
  readonly bufferInterval?: Duration;

  /**
   * The amount of incoming data Kinesis Data Firehose will buffer before calling the processor.
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferSize?: Size;

  /**
   * The number of times Kinesis Data Firehose will retry the processor invocation after a failure due to network timeout or invocation limits.
   *
   * @default 3
   */
  readonly retries?: number;
}

/**
 * The key-value pair that identifies the underlying processor resource.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html
 */
export interface DataProcessorIdentifier {
  /**
   * The parameter name that corresponds to the processor resource's identifier.
   *
   * Must be an accepted value in `CfnDeliveryStream.ProcessoryParameterProperty.ParameterName`.
   */
  readonly parameterName: string;

  /**
   * The identifier of the underlying processor resource.
   */
  readonly parameterValue: string;
}

/**
 * The full configuration of a data processor.
 */
export interface DataProcessorConfig {
  /**
   * The type of the underlying processor resource.
   *
   * Must be an accepted value in `CfnDeliveryStream.ProcessorProperty.Type`.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html#cfn-kinesisfirehose-deliverystream-processor-type
   * @example 'Lambda'
   */
  readonly processorType: string;

  /**
   * The key-value pair that identifies the underlying processor resource.
   */
  readonly processorIdentifier: DataProcessorIdentifier;
}

/**
 * Options when binding a DataProcessor to a delivery stream destination.
 */
export interface DataProcessorBindOptions {
  /**
   * The IAM role assumed by Kinesis Data Firehose to write to the destination that this DataProcessor will bind to.
   */
  readonly role: iam.IRole;
}

/**
 * A data processor that Kinesis Data Firehose will call to transform records before delivering data.
 */
export interface IDataProcessor {
  /**
   * The constructor props of the DataProcessor.
   */
  readonly props: DataProcessorProps;

  /**
   * Binds this processor to a destination of a delivery stream.
   *
   * Implementers should use this method to grant processor invocation permissions to the provided stream and return the
   * necessary configuration to register as a processor.
   */
  bind(scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig;
}
