import { Construct } from 'constructs';
import { MapBase, BaseMapProps } from './map-base';
import * as iam from '../../../aws-iam';
import { IBucket } from '../../../aws-s3';
import { Aws } from '../../../core';
import { FieldUtils } from '../fields';
import { StateGraph } from '../state-graph';
import { StateMachineType } from '../state-machine';
import { CatchProps, IChainable, INextable, ProcessorConfig, ProcessorMode, RetryProps } from '../types';

const DISTRIBUTED_MAP_SYMBOL = Symbol.for('@aws-cdk/aws-stepfunctions.DistributedMap');

/**
 * Base interface for Item Reader configurations
 */
export interface IItemReader {
  /**
   * S3 Bucket containing objects to iterate over or a file with a list to iterate over
   */
  readonly bucket: IBucket;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distribute Map state will iterate over all items provided by the ItemReader
   */
  readonly maxItems?: number;

  /**
   * Render the ItemReader as JSON object
   */
  render(): any;

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  providePolicyStatements(): iam.PolicyStatement[];
}

/**
 * Base interface for Item Reader configuration properties
 */
interface ItemReaderProps {
  /**
   * S3 Bucket containing objects to iterate over or a file with a list to iterate over
   */
  readonly bucket: IBucket;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - Distribute Map state will iterate over all items provided by the ItemReader
   */
  readonly maxItems?: number;
}

/**
 * Properties for configuring an Item Reader that iterates over objects in an S3 bucket
 */
export interface S3ObjectsItemReaderProps extends ItemReaderProps {
  /**
   * S3 prefix used to limit objects to iterate over
   *
   * @default - No prefix
   */
  readonly prefix?: string;
}

/**
 * Item Reader configuration for iterating over objects in an S3 bucket
 */
export class S3ObjectsItemReader implements IItemReader {
  /**
   * S3 Bucket containing objects to iterate over
   */
  readonly bucket: IBucket;

  /**
   * S3 prefix used to limit objects to iterate over
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - No maxItems
   */
  readonly maxItems?: number;

  /**
   * ARN for the `listObjectsV2` method of the S3 API
   * This API method is used to iterate all objects in the S3 bucket/prefix
   */
  private readonly resource: string = `arn:${Aws.PARTITION}:states:::s3:listObjectsV2`;

  constructor(props: S3ObjectsItemReaderProps) {
    this.bucket = props.bucket;
    this.prefix = props.prefix;
    this.maxItems = props.maxItems;
  }

  /**
   * Renders the ItemReader configuration as JSON object
   * @returns - JSON object
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: this.resource,
      ...(this.maxItems && { ReaderConfig: { MaxItems: this.maxItems } }),
      Parameters: {
        Bucket: this.bucket.bucketName,
        ...(this.prefix && { Prefix: this.prefix }),
      },
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: [
          's3:ListBucket',
        ],
        resources: [this.bucket.bucketArn],
      }),
    ];
  }
}

/**
 * Base interface for Item Reader configuration properties the iterate over entries in a S3 file
 */
export interface S3ItemReaderProps extends ItemReaderProps {
  /**
   * Key of file stored in S3 bucket containing an array to iterate over
   */
  readonly key: string;
}

/**
 * Base Item Reader configuration for iterating over entries in a S3 file
 */
abstract class S3ItemReader implements IItemReader {
  /**
   * S3 Bucket containing a file with a list to iterate over
   */
  readonly bucket: IBucket;

  /**
   * S3 key of a file with a list to iterate over
   */
  readonly key: string;

  /**
   * Limits the number of items passed to the Distributed Map state
   *
   * @default - No maxItems
   */
  readonly maxItems?: number;

  protected readonly resource: string = `arn:${Aws.PARTITION}:states:::s3:getObject`
  protected abstract readonly inputType: string;

  constructor(props: S3ItemReaderProps) {
    this.bucket = props.bucket;
    this.key = props.key;
    this.maxItems = props.maxItems;
  }

  /**
   * Renders the ItemReader configuration as JSON object
   * @returns - JSON object
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: this.resource,
      ReaderConfig: {
        InputType: this.inputType,
        ...(this.maxItems && { MaxItems: this.maxItems }),
      },
      Parameters: {
        Bucket: this.bucket.bucketName,
        Key: this.key,
      },
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {
    const resource = `arn:${Aws.PARTITION}:s3:::${this.bucket.bucketName}/*`;

    return [
      new iam.PolicyStatement({
        actions: [
          's3:GetObject',
        ],
        resources: [resource],
      }),
    ];
  }
}

/**
 * Item Reader configuration for iterating over items in a JSON array stored in a S3 file
 */
export class S3JsonItemReader extends S3ItemReader {
  protected readonly inputType: string = 'JSON';
}

/**
 * CSV header location options
 */
export enum CsvHeaderLocation {
  /**
   * Headers will be read from first row of CSV file
   */
  FIRST_ROW = 'FIRST_ROW',

  /**
   * Headers are provided in CSVHeaders property
   */
  GIVEN = 'GIVEN',
}

/**
 * Configuration for CSV header options for a CSV Item Reader
 */
export class CsvHeaders {
  /**
   * Configures S3CsvItemReader to read headers from the first row of the CSV file
   * @returns - CsvHeaders
   */
  public static useFirstRow(): CsvHeaders {
    return new CsvHeaders(CsvHeaderLocation.FIRST_ROW);
  }

  /**
   * Configures S3CsvItemReader to use the headers provided in the `headers` parameter
   * @param headers - List of headers
   * @returns - CsvHeaders
   */
  public static use(headers: string[]): CsvHeaders {
    return new CsvHeaders(CsvHeaderLocation.GIVEN, headers);
  }

  /**
   * Location of headers in CSV file
   */
  public readonly headerLocation: CsvHeaderLocation;

  /**
   * List of headers if `headerLocation` is `GIVEN`
   */
  public readonly headers?: string[];

  private constructor(headerLocation: CsvHeaderLocation, headers?: string[]) {
    this.headerLocation = headerLocation;
    this.headers = headers;
  }
}

/**
 * Properties for configuring an Item Reader that iterates over items in a CSV file in S3
 */
export interface S3CsvItemReaderProps extends S3ItemReaderProps {
  /**
   * CSV file header configuration
   *
   * @default - CsvHeaders with CsvHeadersLocation.FIRST_ROW
   */
  readonly csvHeaders?: CsvHeaders;
}

/**
 * Item Reader configuration for iterating over items in a CSV file stored in S3
 */
export class S3CsvItemReader extends S3ItemReader {
  /**
   * CSV headers configuration
   */
  readonly csvHeaders: CsvHeaders;
  protected readonly inputType: string = 'CSV';

  constructor(props: S3CsvItemReaderProps) {
    super(props);
    this.csvHeaders = props.csvHeaders || CsvHeaders.useFirstRow();
  }

  public render(): any {
    let rendered = super.render();

    rendered.ReaderConfig = FieldUtils.renderObject({
      ...rendered.ReaderConfig,
      ...{
        CSVHeaderLocation: this.csvHeaders.headerLocation,
        ...(this.csvHeaders.headers && { CSVHeaders: this.csvHeaders.headers }),
      },
    });

    return rendered;
  }
}

/**
 * Item Reader configuration for iterating over items in a S3 inventory manifest file stored in S3
 */
export class S3ManifestItemReader extends S3ItemReader {
  protected readonly inputType: string = 'MANIFEST';
}

/**
 * Interface for Result Writer configuration properties
 */
export interface ResultWriterProps {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket: IBucket;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;
}

/**
 * Configuration for writing Distributed Map state results to S3
 */
export class ResultWriter {
  /**
   * S3 Bucket in which to save Map Run results
   */
  readonly bucket: IBucket;

  /**
   * S3 prefix in which to save Map Run results
   *
   * @default - No prefix
   */
  readonly prefix?: string;

  constructor(props: ResultWriterProps) {
    this.bucket = props.bucket;
    this.prefix = props.prefix;
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  public render(): any {
    return FieldUtils.renderObject({
      Resource: `arn:${Aws.PARTITION}:states:::s3:putObject`,
      Parameters: {
        Bucket: this.bucket.bucketName,
        ...(this.prefix && { Prefix: this.prefix }),
      },
    });
  }

  /**
   * Compile policy statements to provide relevent permissions to the state machine
   */
  public providePolicyStatements(): iam.PolicyStatement[] {

    const resource = `arn:${Aws.PARTITION}:s3:::${this.bucket.bucketName}/*`;

    return [
      new iam.PolicyStatement({
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:ListMultipartUploadParts',
          's3:AbortMultipartUpload',
        ],
        resources: [resource],
      }),
    ];
  }
}

/**
 * Interface for ItemBatcher configuration properties
 */
export interface ItemBatcherProps {
  /**
   * MaxItemsPerBatch
   *
   * Specifies the maximum number of items that each child workflow execution processes, as static number
   *
   * @default - No maxItemsPerBatch
   */
  readonly maxItemsPerBatch?: number;

  /**
   * MaxItemsPerBatchPath
   *
   * Specifies the maximum number of items that each child workflow execution processes, as JsonPath
   *
   * @default - No maxItemsPerBatchPath
   */
  readonly maxItemsPerBatchPath?: string;

  /**
   * MaxInputBytesPerBatch
   *
   * Specifies the maximum number of bytes that each child workflow execution processes, as static number
   *
   * @default - No maxInputBytesPerBatch
   */
  readonly maxInputBytesPerBatch?: number;

  /**
   * MaxInputBytesPerBatchPath
   *
   * Specifies the maximum number of bytes that each child workflow execution processes, as JsonPath
   *
   * @default - No maxInputBytesPerBatchPath
   */
  readonly maxInputBytesPerBatchPath?: string;

  /**
   * BatchInput
   *
   * Fixed JSON input to include in each batch passed to each child workflow execution
   *
   * @default - No batchInput
   */
  readonly batchInput?: object;
}

/**
 * Configuration for processing a group of items in a single child workflow execution
 */
export class ItemBatcher {
  private props: ItemBatcherProps;

  constructor(props: ItemBatcherProps) {
    this.props = props;
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  public render(): any {
    if (
      !this.props.maxItemsPerBatch &&
      !this.props.maxItemsPerBatchPath &&
      !this.props.maxInputBytesPerBatch &&
      !this.props.maxInputBytesPerBatchPath &&
      !this.props.batchInput) {
      return undefined;
    }

    return {
      ...(this.props.maxItemsPerBatch && { MaxItemsPerBatch: this.props.maxItemsPerBatch }),
      ...(this.props.maxItemsPerBatchPath && { MaxItemsPerBatchPath: this.props.maxItemsPerBatchPath }),
      ...(this.props.maxInputBytesPerBatch && { MaxInputBytesPerBatch: this.props.maxInputBytesPerBatch }),
      ...(this.props.maxInputBytesPerBatchPath && { MaxInputBytesPerBatchPath: this.props.maxInputBytesPerBatchPath }),
      ...(this.props.batchInput && { BatchInput: this.props.batchInput }),
    };
  }

  /**
   * Validate this item batcher
   */
  public validateItemBatcher(): string[] {
    const errors: string [] = [];
    if (this.props.maxItemsPerBatch && this.props.maxItemsPerBatchPath) {
      errors.push('Provide either `maxItemsPerBatch` or `maxItemsPerBatchPath`, but not both');
    }

    if (this.props.maxInputBytesPerBatch && this.props.maxInputBytesPerBatchPath) {
      errors.push('Provide either `maxInputBytesPerBatch` or `maxInputBytesPerBatchPath`, but not both');
    }

    return errors;
  }
}

/**
 * Properties for configuring a Distribute Map state
 */
export interface DistributedMapProps extends BaseMapProps {
  /**
     * MapExecutionType
     *
     * The execution type of the distributed map state
     *
     * @default StateMachineType.STANDARD
     */
  readonly mapExecutionType?: StateMachineType;

  /**
     * ItemReader
     *
     * Configuration for where to read items dataset in S3 to iterate
     *
     * @default - No itemReader
     */
  readonly itemReader?: IItemReader;

  /**
     * ToleratedFailurePercentage
     *
     * Percentage of failed items to tolerate in a Map Run, as static number
     *
     * @default - No toleratedFailurePercentage
     */
  readonly toleratedFailurePercentage?: number;

  /**
     * ToleratedFailurePercentagePath
     *
     * Percentage of failed items to tolerate in a Map Run, as JsonPath
     *
     * @default - No toleratedFailurePercentagePath
     */
  readonly toleratedFailurePercentagePath?: string;

  /**
     * ToleratedFailureCount
     *
     * Number of failed items to tolerate in a Map Run, as static number
     *
     * @default - No toleratedFailureCount
     */
  readonly toleratedFailureCount?: number;

  /**
     * ToleratedFailureCountPath
     *
     * Number of failed items to tolerate in a Map Run, as JsonPath
     *
     * @default - No toleratedFailureCountPath
     */
  readonly toleratedFailureCountPath?: string;

  /**
     * Label
     *
     * Unique name for the Distributed Map state added to each Map Run
     *
     * @default - No label
     */
  readonly label?: string;

  /**
   * Configuration for S3 location in which to save Map Run results
   *
   * @default - No resultWriter
   */
  readonly resultWriter?: ResultWriter;

  /**
   * Specifies to process a group of items in a single child workflow execution
   *
   * @default - No itemBatcher
   */
  readonly itemBatcher?: ItemBatcher;
}

/**
 * Define a Distributed Mode Map state in the state machine
 *
 * A `Map` state can be used to run a set of steps for each element of an input array.
 * A Map state will execute the same steps for multiple entries of an array in the state input.
 *
 * While the Parallel state executes multiple branches of steps using the same input, a Map state
 * will execute the same steps for multiple entries of an array in the state input.
 *
 * A `Map` state in `Distributed` mode will execute a child workflow for each iteration of the Map state.
 * This serves to increase concurrency and allows for larger workloads to be run in a single state machine.
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-asl-use-map-state-distributed.html
 */
export class DistributedMap extends MapBase implements INextable {
  /**
   * Return whether the given object is a DistributedMap.
   */
  public static isDistributedMap(x: any): x is DistributedMap {
    return x !== null && typeof(x) === 'object' && DISTRIBUTED_MAP_SYMBOL in x;
  }

  private readonly mapExecutionType?: StateMachineType;
  private readonly itemReader?: IItemReader;
  private readonly toleratedFailurePercentage?: number;
  private readonly toleratedFailurePercentagePath?: string;
  private readonly toleratedFailureCount?: number;
  private readonly toleratedFailureCountPath?: string;
  private readonly label?: string;
  private readonly resultWriter?: ResultWriter;
  private readonly itemBatcher?: ItemBatcher;

  constructor(scope: Construct, id: string, props: DistributedMapProps = {}) {
    super(scope, id, props);
    this.mapExecutionType = props.mapExecutionType ?? StateMachineType.STANDARD;
    this.itemReader = props.itemReader;
    this.toleratedFailurePercentage = props.toleratedFailurePercentage;
    this.toleratedFailurePercentagePath = props.toleratedFailurePercentagePath;
    this.toleratedFailureCount = props.toleratedFailureCount;
    this.toleratedFailureCountPath = props.toleratedFailureCountPath;
    this.label = props.label;
    this.itemBatcher = props.itemBatcher;
    this.resultWriter = props.resultWriter;
    this.processorMode = ProcessorMode.DISTRIBUTED;
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    const errors: string[] = super.validateState();

    if (this.processorConfig?.mode === ProcessorMode.INLINE) {
      errors.push('Processing mode cannot be `INLINE` for a Distributed Map');
    }

    if (this.itemsPath && this.itemReader) {
      errors.push('Provide either `itemsPath` or `itemReader`, but not both');
    }

    if (this.toleratedFailurePercentage && this.toleratedFailurePercentagePath) {
      errors.push('Provide either `toleratedFailurePercentage` or `toleratedFailurePercentagePath`, but not both');
    }

    if (this.toleratedFailurePercentage && !(this.toleratedFailurePercentage >= 0 && this.toleratedFailurePercentage <= 100)) {
      errors.push('toleratedFailurePercentage must be between 0 and 100');
    }

    if (this.toleratedFailureCount && this.toleratedFailureCountPath) {
      errors.push('Provide either `toleratedFailureCount` or `toleratedFailureCountPath`, but not both');
    }

    if (this.itemBatcher) {
      errors.push(...this.itemBatcher.validateItemBatcher());
    }

    if (this.label) {
      if (this.label.length > 40) {
        errors.push('label must be 40 characters or less');
      }

      let labelRegex = new RegExp('[\s\?\*\<\>\{\}\\[\\]\:\;\,\\\|\^\~\$\#\%\&\`\"]|[\u0000-\u001f]|[\u007f-\u009f]', 'gi');
      if (labelRegex.test(this.label)) {
        errors.push('label cannot contain any whitespace or special characters');
      }
    }

    return errors;
  }

  protected whenBoundToGraph(graph: StateGraph) {
    super.whenBoundToGraph(graph);
    if (this.resultWriter) {
      this.resultWriter.providePolicyStatements().forEach(policyStatement => {
        graph.registerPolicyStatement(policyStatement);
      });
    }
    if (this.itemReader) {
      this.itemReader.providePolicyStatements().forEach(policyStatement => {
        graph.registerPolicyStatement(policyStatement);
      });
    }
  }

  /**
   * Add retry configuration for this state
   *
   * This controls if and how the execution will be retried if a particular
   * error occurs.
   */
  public addRetry(props: RetryProps = {}): DistributedMap {
    super._addRetry(props);
    return this;
  }

  /**
   * Add a recovery handler for this state
   *
   * When a particular error occurs, execution will continue at the error
   * handler instead of failing the state machine execution.
   */
  public addCatch(handler: IChainable, props: CatchProps = {}): DistributedMap {
    super._addCatch(handler.startState, props);
    return this;
  }

  /**
   * Define item processor in a Distributed Map.
   *
   * A Distributed Map must have a non-empty item processor
   */
  public itemProcessor(processor: IChainable, config: ProcessorConfig = {}): DistributedMap {
    const name = `Map ${this.stateId} Item Processor`;
    const stateGraph = new StateGraph(processor.startState, name);
    super.addItemProcessor(stateGraph, config);
    return this;
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    let rendered: any = super.toStateJson();
    if (this.mapExecutionType) {
      rendered.ItemProcessor.ProcessorConfig.ExecutionType = this.mapExecutionType;
    }

    return {
      ...rendered,
      ...this.renderItemReader(),
      ...this.renderItemBatcher(),
      ...(this.toleratedFailurePercentage && { ToleratedFailurePercentage: this.toleratedFailurePercentage }),
      ...(this.toleratedFailurePercentagePath && { ToleratedFailurePercentagePath: this.toleratedFailurePercentagePath }),
      ...(this.toleratedFailureCount && { ToleratedFailureCount: this.toleratedFailureCount }),
      ...(this.toleratedFailureCountPath && { ToleratedFailureCountPath: this.toleratedFailureCountPath }),
      ...(this.label && { Label: this.label }),
      ...this.renderResultWriter(),
    };
  }

  /**
   * Render the ItemReader as JSON object
   */
  private renderItemReader(): any {
    if (!this.itemReader) { return undefined; }

    return FieldUtils.renderObject({
      ItemReader: this.itemReader.render(),
    });
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  private renderResultWriter(): any {
    if (!this.resultWriter) { return undefined; }

    return FieldUtils.renderObject({
      ResultWriter: this.resultWriter.render(),
    });
  }

  /**
   * Render ItemBatcher in ASL JSON format
   */
  private renderItemBatcher(): any {
    if (!this.itemBatcher) { return undefined; }

    return {
      ItemBatcher: this.itemBatcher.render(),
    };
  }
}

/**
 * Mark all instances of 'DistributeMap'.
 */
Object.defineProperty(DistributedMap.prototype, DISTRIBUTED_MAP_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});
