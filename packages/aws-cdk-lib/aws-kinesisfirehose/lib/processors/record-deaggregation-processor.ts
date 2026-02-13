import type { Construct } from 'constructs';
import { ValidationError } from '../../../core';
import type { CfnDeliveryStream } from '../kinesisfirehose.generated';
import type { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

/**
 * Props for RecordDeAggregationProcessor
 */
export interface RecordDeAggregationProcessorOptions {
  /**
   * The sub-record type to deaggregate input records.
   */
  readonly subRecordType: SubRecordType;
  /**
   * The custom delimiter when subRecordType is DELIMITED. Must be specified in the base64-encoded format.
   * @default - No delimiter
   */
  readonly delimiter?: string;
}

/**
 * The sub-record type to deaggregate input records.
 */
export enum SubRecordType {
  /** The records are JSON objects on a single line with no delimiter or newline-delimited (JSONL). */
  JSON = 'JSON',
  /** The records are delimited by a custom delimiter. */
  DELIMITED = 'DELIMITED',
}

/**
 * The data processor for multi record deaggrecation.
 *
 * Record deaggregation by JSON or by delimiter is capped at 500 per record.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-multirecord-deaggergation.html
 */
export class RecordDeAggregationProcessor implements IDataProcessor {
  /**
   * Perform deaggregation from JSON objects on a single line with no delimiter or newline-delimited (JSONL).
   */
  public static json(): RecordDeAggregationProcessor {
    return new RecordDeAggregationProcessor({ subRecordType: SubRecordType.JSON });
  }

  /**
   * Perform deaggregation based on a specified custom delimiter.
   *
   * @param delimiter The custom delimiter.
   */
  public static delimited(delimiter: string): RecordDeAggregationProcessor {
    return new RecordDeAggregationProcessor({ subRecordType: SubRecordType.DELIMITED, delimiter: Buffer.from(delimiter).toString('base64') });
  }

  readonly props: DataProcessorProps = {};

  constructor(private readonly options: RecordDeAggregationProcessorOptions) {}

  bind(scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig {
    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'SubRecordType', parameterValue: this.options.subRecordType },
    ];
    // CFN validation message: "class com.amazonaws.services.firehose.internal.model.RecordDeAggregationProcessor can only be present when Dynamic Partitioning is enabled."
    if (!options.dynamicPartitioningEnabled) {
      throw new ValidationError('RecordDeAggregationProcessor can only be present when Dynamic Partitioning is enabled.', scope);
    }
    if (this.options.subRecordType === SubRecordType.DELIMITED) {
      if (!this.options.delimiter) {
        throw new ValidationError('The delimiter must be specified when subRecordType is DELIMITED.', scope);
      }
      parameters.push({
        parameterName: 'Delimiter', parameterValue: this.options.delimiter,
      });
    }
    return {
      processorType: 'RecordDeAggregation',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}
