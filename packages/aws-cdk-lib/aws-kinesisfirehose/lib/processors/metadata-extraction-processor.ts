import { Construct } from 'constructs';
import { ValidationError } from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

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
