import { Construct } from 'constructs';
import { DataProcessorBindOptions, DataProcessorProps, ExtendedDataProcessorConfig, IDataProcessor } from '../processor';

/**
 * Compression format for DecompressionProcessor.
 */
export enum DecompressionProcessorCompressionFormat {
  /** GZIP compression */
  GZIP = 'GZIP',
}

/**
 * Options for DecompressionProcessor.
 */
export interface DecompressionProcessorOptions {
  /**
   * The input compression format
   * @default DecompressionProcessorCompressionFormat.GZIP
   */
  readonly compressionFormat?: DecompressionProcessorCompressionFormat;
}

/**
 * The data processor to decompress CloudWatch Logs.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/writing-with-cloudwatch-logs-decompression.html
 */
export class DecompressionProcessor implements IDataProcessor {
  public readonly props: DataProcessorProps = {};

  constructor(private readonly options: DecompressionProcessorOptions = {}) {}

  bind(_scope: Construct, _options: DataProcessorBindOptions): ExtendedDataProcessorConfig {
    return {
      processorType: 'Decompression',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters: [
        { parameterName: 'CompressionFormat', parameterValue: this.options.compressionFormat ?? 'GZIP' },
      ],
    };
  }
}
