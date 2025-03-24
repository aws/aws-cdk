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
  readonly metadataExtractionQuery: string;
  /**
   * JSON parsing engine
   */
  readonly jsonParsingEngine: JsonParsingEngine;
}

/**
 * The JSON parsing engine for MetadataExtractionProcessor
 */
export enum JsonParsingEngine {
  /** The JQ 1.6 parsing engine */
  JQ_1_6 = 'JQ-1.6',
}

/**
 * The data processor for dynamic partitioning with inline parsing.
 *
 * @see https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning-partitioning-keys.html
 */
export class MetadataExtractionProcessor implements IDataProcessor {
  /**
   * Creates the inline parsing configuration with JQ 1.6 engine.
   *
   * @param query A map of partition key to jq expression.
   */
  public static jq16(query: Record<string, string>): MetadataExtractionProcessor {
    // Extraction query for JQ 1.6 is not a JSON.
    // For example:
    // {
    //    "customer_id": .customer_id,
    //    "device": .type.device,
    //    "year": .event_timestamp|strftime("%Y")
    // }
    const jqQuery = Object.entries(query).map(([key, expression]) => `${JSON.stringify(key)}:${expression}`);
    return new this({
      jsonParsingEngine: JsonParsingEngine.JQ_1_6,
      metadataExtractionQuery: `{${jqQuery.join(',')}}`,
    });
  }

  readonly props: DataProcessorProps = {};

  constructor(private readonly options: MetadataExtractionProcessorOptions) {}

  bind(scope: Construct, _options: DataProcessorBindOptions): DataProcessorConfig {
    if (Object.keys(this.options.metadataExtractionQuery).length === 0) {
      throw new ValidationError('metadataExtractionQuery is empty', scope);
    }

    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'MetadataExtractionQuery', parameterValue: this.options.metadataExtractionQuery },
      { parameterName: 'JsonParsingEngine', parameterValue: this.options.jsonParsingEngine },
    ];

    return {
      processorType: 'MetadataExtraction',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}
