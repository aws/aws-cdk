import { Construct } from 'constructs';
import { ValidationError } from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

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
