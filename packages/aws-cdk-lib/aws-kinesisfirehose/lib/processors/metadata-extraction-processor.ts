import type { Construct } from 'constructs';
import { UnscopedValidationError, ValidationError } from '../../../core';
import type { CfnDeliveryStream } from '../kinesisfirehose.generated';
import type { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

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
export class JsonParsingEngine {
  /**
   * The JQ 1.6 parsing engine
   */
  static readonly JQ_1_6 = JsonParsingEngine.of('JQ-1.6');

  /**
   * A custom parsing engine
   */
  public static of(parsingEngine: string) {
    return new JsonParsingEngine(parsingEngine);
  }

  /**
   * @param parsingEngine The parsing engine string
   */
  private constructor(public readonly parsingEngine: string) {}
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
    const keys = Object.keys(query);
    if (keys.length === 0) {
      throw new UnscopedValidationError('The query for MetadataExtractionProcessor should not be empty.');
    } else if (keys.length > 50) {
      throw new UnscopedValidationError('The query for MetadataExtractionProcessor cannot exceed the limit of 50 keys.');
    }
    // Extraction query for JQ 1.6 is not a JSON, but a JQ expression.
    // For example:
    // {
    //    "customer_id": .customer_id,
    //    "device": .type.device,
    //    "year": .event_timestamp|strftime("%Y")
    // }
    const jqQuery = keys.map((key) => `${JSON.stringify(key)}:${query[key]}`);
    const options = {
      jsonParsingEngine: JsonParsingEngine.JQ_1_6,
      metadataExtractionQuery: `{${jqQuery.join(',')}}`,
    };
    return new MetadataExtractionProcessor(options, keys);
  }

  readonly props: DataProcessorProps = {};

  constructor(private readonly options: MetadataExtractionProcessorOptions, private readonly keys: string[]) {}

  bind(scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig {
    // CFN validation message: "class com.amazonaws.services.firehose.internal.model.MetadataExtractionProcessor can only be present when Dynamic Partitioning is enabled."
    if (!options.dynamicPartitioningEnabled) {
      throw new ValidationError('MetadataExtractionProcessor can only be present when Dynamic Partitioning is enabled.', scope);
    }

    // CFN validation message: "MetaDataExtraction JQ Query can't contain keys that are not present in the S3 Prefix expression"
    const re = /!\{partitionKeyFromQuery:([^{}]+)\}/g;
    const usedKeys = new Set<string>();
    let match;
    while (match = re.exec(options.prefix ?? '')) {
      usedKeys.add(match[1]);
    }
    if (!(this.keys.length === usedKeys.size && this.keys.every((key) => usedKeys.has(key)))) {
      throw new ValidationError('When dynamic partitioning via inline parsing is enabled, you must use all specified dynamic partitioning key values for partitioning your data source.', scope);
    }

    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'MetadataExtractionQuery', parameterValue: this.options.metadataExtractionQuery },
      { parameterName: 'JsonParsingEngine', parameterValue: this.options.jsonParsingEngine.parsingEngine },
    ];

    return {
      processorType: 'MetadataExtraction',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}
