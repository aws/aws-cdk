import type { Construct } from 'constructs';
import type { CfnDeliveryStream } from './kinesisfirehose.generated';
import type * as iam from '../../aws-iam';
import type { Duration, Size } from '../../core';

/**
 * Configure the LambdaFunctionProcessor.
 */
export interface DataProcessorProps {
  /**
   * The length of time Amazon Data Firehose will buffer incoming data before calling the processor.
   *s
   * @default Duration.minutes(1)
   */
  readonly bufferInterval?: Duration;

  /**
   * The amount of incoming data Amazon Data Firehose will buffer before calling the processor.
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferSize?: Size;

  /**
   * The number of times Amazon Data Firehose will retry the processor invocation after a failure due to network timeout or invocation limits.
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
   */
  readonly parameterName: string;

  /**
   * The identifier of the underlying processor resource.
   */
  readonly parameterValue: string;
}

/**
 * The full configuration of a data processor.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-kinesisfirehose-deliverystream-processor.html
 */
export interface DataProcessorConfig {
  /**
   * The type of processor.
   */
  readonly processorType: string;

  /**
   * The key-value pair that identifies the underlying processor resource.
   *
   * Ignored when the `parameters` is specified.
   */
  readonly processorIdentifier: DataProcessorIdentifier;

  /**
   * The processor parameters.
   *
   * @default - No processor parameters
   */
  readonly parameters?: CfnDeliveryStream.ProcessorParameterProperty[];
}

/**
 * Options when binding a DataProcessor to a delivery stream destination.
 */
export interface DataProcessorBindOptions {
  /**
   * The IAM role assumed by Amazon Data Firehose to write to the destination that this DataProcessor will bind to.
   */
  readonly role: iam.IRole;
  /**
   * Whether the dynamic partitioning is enabled.
   * @default false
   */
  readonly dynamicPartitioningEnabled?: boolean;
  /**
   * S3 bucket prefix
   * @default - No prefix
   */
  readonly prefix?: string;
}

/**
 * A data processor that Amazon Data Firehose will call to transform records before delivering data.
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
