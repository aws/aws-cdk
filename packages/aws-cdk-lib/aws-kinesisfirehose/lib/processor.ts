import { Construct } from 'constructs';
import { CfnDeliveryStream } from './kinesisfirehose.generated';
import * as iam from '../../aws-iam';
import { Duration, Size, ValidationError } from '../../core';

/**
 * Configure the data processor.
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
   * The IAM role assumed by Amazon Data Firehose to write to the destination that this DataProcessor will bind to.
   */
  readonly role: iam.IRole;
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

/**
 * Props for RecordDeAggregationProcessor
 */
export interface RecordDeAggregationProcessorOptions {
  /**
   * FIXME: SubRecordType
   */
  readonly subRecordType: SubRecordType;
  /**
   * FIXME: Delimiter; required when subRecordType is DELIMITED
   * @default - No delimiter
   */
  readonly delimiter?: string;
}

/**
 * FIXME: The sub record type
 */
export enum SubRecordType {
  /** JSON */
  JSON = 'JSON',
  /** DELIMITED */
  DELIMITED = 'DELIMITED',
}

/**
 * Multi record deaggrecation processor
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-multirecord-deaggergation.html
 */
export class RecordDeAggregationProcessor implements IDataProcessor {
  readonly props: DataProcessorProps = {};

  constructor(private readonly options: RecordDeAggregationProcessorOptions) {}

  bind(scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'SubRecordType', parameterValue: this.options.subRecordType },
    ];
    if (this.options.subRecordType === SubRecordType.DELIMITED) {
      if (!this.options.delimiter) {
        throw new ValidationError('delimiter must be specified when subRecordType is DELIMITED.', scope);
      }
      parameters.push({
        parameterName: 'Delimiter', parameterValue: Buffer.from(this.options.delimiter).toString('base64'),
      });
    }
    return {
      processorType: 'RecordDeAggregation',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}

/**
 * Props for MetadataExtractionProcessor
 */
export interface MetadataExtractionProcessorOptions {
  /**
   * Map parameter to JQ query
   */
  readonly metadataExtractionQuery: Record<string, string>;
  /**
   * JSON parsing engine
   */
  readonly jsonParsingEngine: JsonParsingEngine;
}

/**
 * The JSON parsing engine for MetadataExtractionProcessor
 */
export enum JsonParsingEngine {
  /** JQ 1.6 */
  JQ_1_6 = 'JQ-1.6',
}

/**
 * Metadata extraction processor
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-partitioning-keys.html
 */
export class MetadataExtractionProcessor implements IDataProcessor {
  readonly props: DataProcessorProps = {};

  constructor(private readonly options: MetadataExtractionProcessorOptions) {}

  bind(scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    if (Object.keys(this.options.metadataExtractionQuery).length === 0) {
      throw new ValidationError('metadataExtractionQuery is empty', scope);
    }

    const jqQuery = Object.entries(this.options.metadataExtractionQuery).map(([key, query]) => `${JSON.stringify(key)}:${query}`);
    const metadataExtractionQuery = `{${jqQuery.join(',')}}`;

    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'MetadataExtractionQuery', parameterValue: metadataExtractionQuery },
      { parameterName: 'JsonParsingEngine', parameterValue: this.options.jsonParsingEngine },
    ];

    return {
      processorType: 'MetadataExtraction',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}
