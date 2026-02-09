import type { Construct } from 'constructs';
import { UnscopedValidationError } from '../../../core';
import type { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

/**
 * Options for CloudWatchLogProcessor.
 */
export interface CloudWatchLogProcessorOptions {
  /**
   * Extract message from CloudWatch logs.
   * This must be true.
   */
  readonly dataMessageExtraction: boolean;
}

/**
 * The data processor to extract message after decompression of CloudWatch Logs.
 * This processor must used with `DecompressionProcessor`
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/Message_extraction.html
 */
export class CloudWatchLogProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor(options: CloudWatchLogProcessorOptions) {
    if (!options.dataMessageExtraction) {
      throw new UnscopedValidationError('dataMessageExtraction must be true.');
    }
  }

  bind(_scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    return {
      processorType: 'CloudWatchLogProcessing',
      processorIdentifier: { parameterName: '', parameterValue: '' }, // Dummy value for backward compatibility
      parameters: [
        { parameterName: 'DataMessageExtraction', parameterValue: 'true' },
      ],
    };
  }
}
