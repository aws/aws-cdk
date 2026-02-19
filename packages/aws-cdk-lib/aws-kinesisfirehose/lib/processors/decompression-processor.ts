import type { Construct } from 'constructs';
import type { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

/**
 * Compression format for DecompressionProcessor.
 */
export class DecompressionProcessorCompressionFormat {
  /**
   * GZIP compression
   */
  static readonly GZIP = DecompressionProcessorCompressionFormat.of('GZIP');

  /**
   * A custom compression format
   */
  public static of(compressionFormat: string) {
    return new DecompressionProcessorCompressionFormat(compressionFormat);
  }

  /**
   * @param compressionFormat The compression format string
   */
  private constructor(public readonly compressionFormat: string) {}
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

  bind(_scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    return {
      processorType: 'Decompression',
      processorIdentifier: { parameterName: '', parameterValue: '' }, // Dummy value for backward compatibility
      parameters: [
        { parameterName: 'CompressionFormat', parameterValue: this.options.compressionFormat?.compressionFormat ?? 'GZIP' },
      ],
    };
  }
}
