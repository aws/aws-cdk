import { Construct } from 'constructs';
import { DataProcessorBindOptions, DataProcessorProps, ExtendedDataProcessorConfig, IDataProcessor } from '../processor';

/**
 * The data processor to append new line delimiter to each record.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-s3bucketprefix.html#dynamic-partitioning-new-line-delimiter
 */
export class AppendDelimiterToRecordProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor() {}

  bind(_scope: Construct, _options: DataProcessorBindOptions): ExtendedDataProcessorConfig {
    return {
      processorType: 'AppendDelimiterToRecord',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters: [],
    };
  }
}
