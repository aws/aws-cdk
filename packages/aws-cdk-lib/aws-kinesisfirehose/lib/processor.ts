import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import { Duration, Size } from '../../core';

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
 * @deprecated Use `DataProcessorParameter`
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
 * A processor parameter in a data processor for an Amazon Kinesis Data Firehose delivery stream.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html
 */
export interface DataProcessorParameter {
  /**
   * The name of the parameter.
   */
  readonly parameterName: string;

  /**
   * The parameter value.
   */
  readonly parameterValue: string;
}

/**
 * The full configuration of a data processor.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html
 */
export interface DataProcessorConfig {
  /**
   * The type of processor.
   */
  readonly processorType: string;

  /**
   * The key-value pair that identifies the underlying processor resource.
   * @deprecated Use `parameters`
   * @default - No processor identifier
   */
  readonly processorIdentifier?: DataProcessorIdentifier;

  /**
   * The processor parameters.
   * @default - No paraeters
   */
  readonly parameters?: DataProcessorParameter[];
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

/**
 * The data processor to decompress CloudWatch Logs.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/writing-with-cloudwatch-logs-decompression.html
 */
export class DecompressionProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor() {}

  bind(_scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    return {
      processorType: 'Decompression',
      parameters: [
        { parameterName: 'CompressionFormat', parameterValue: 'GZIP' },
      ],
    };
  }
}

/**
 * The data processor to extract message after decompression of CloudWatch Logs.
 * This processor must used with `DecompressionProcessor`
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/Message_extraction.html
 */
export class CloudWatchLogProcessingProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor() {}

  bind(_scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    return {
      processorType: 'CloudWatchLogProcessing',
      parameters: [
        { parameterName: 'DataMessageExtraction', parameterValue: 'true' },
      ],
    };
  }
}

/**
 * The data processor to append new line delimiter to each record.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-s3bucketprefix.html#dynamic-partitioning-new-line-delimiter
 */
export class AppendDelimiterToRecordProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor() {}

  bind(_scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    return {
      processorType: 'AppendDelimiterToRecord',
      parameters: [],
    };
  }
}
