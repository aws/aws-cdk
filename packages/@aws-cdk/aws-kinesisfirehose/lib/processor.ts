import * as iam from '@aws-cdk/aws-iam';
import { Duration, Size } from '@aws-cdk/core';

import { Construct } from 'constructs';
import { CfnDeliveryStream } from './kinesisfirehose.generated';

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
 * The full configuration of a data processor.
 */
export interface DataProcessorConfig {
  /**
   * The CfnDeliveryStream.ProcessorProperty that will be added to the array of Processors.
   */
  readonly dataProcessor: CfnDeliveryStream.ProcessorProperty;
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
   * Binds this processor to a destination of a delivery stream.
   *
   * Implementers should use this method to grant processor invocation permissions to the provided stream and return the
   * necessary configuration to register as a processor.
   */
  bind(scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig;
}
