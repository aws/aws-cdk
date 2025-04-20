import { Construct } from 'constructs';
import { ItemBatcher } from './distributed-map/item-batcher';
import { IItemReader } from './distributed-map/item-reader';
import { ResultWriter, ResultWriterV2 } from './distributed-map/result-writer';
import { MapBase, MapBaseJsonataOptions, MapBaseJsonPathOptions, MapBaseOptions, MapBaseProps } from './map-base';
import { Annotations, FeatureFlags } from '../../../core';
import { FieldUtils } from '../fields';
import { StateGraph } from '../state-graph';
import { StateMachineType } from '../state-machine';
import { CatchProps, IChainable, INextable, ProcessorConfig, ProcessorMode, QueryLanguage, RetryProps } from '../types';
import { StateBaseProps } from './state';
import { STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2 } from '../../../cx-api';

const DISTRIBUTED_MAP_SYMBOL = Symbol.for('@aws-cdk/aws-stepfunctions.DistributedMap');

interface DistributedMapBaseOptions extends MapBaseOptions {
  /**
   * MapExecutionType
   *
   * The execution type of the distributed map state
   *
   * This property overwrites ProcessorConfig.executionType
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
   * ToleratedFailureCount
   *
   * Number of failed items to tolerate in a Map Run, as static number
   *
   * @default - No toleratedFailureCount
   */
  readonly toleratedFailureCount?: number;

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
   * @deprecated Use {@link resultWriterV2}
   * @default - No resultWriter
   */
  readonly resultWriter?: ResultWriter;

  /**
   * Configuration for S3 location in which to save Map Run results
   * Enable "@aws-cdk/aws-stepfunctions:useDistributedMapResultWriterV2" feature in the context to use resultWriterV2
   * Example: stack.node.setContext("@aws-cdk/aws-stepfunctions:useDistributedMapResultWriterV2", true);
   *
   * @default - No resultWriterV2
   */
  readonly resultWriterV2?: ResultWriterV2;

  /**
   * Specifies to process a group of items in a single child workflow execution
   *
   * @default - No itemBatcher
   */
  readonly itemBatcher?: ItemBatcher;
}

interface DistributedMapJsonPathOptions extends MapBaseJsonPathOptions {
  /**
   * ToleratedFailurePercentagePath
   *
   * Percentage of failed items to tolerate in a Map Run, as JsonPath
   *
   * @default - No toleratedFailurePercentagePath
   */
  readonly toleratedFailurePercentagePath?: string;

  /**
   * ToleratedFailureCountPath
   *
   * Number of failed items to tolerate in a Map Run, as JsonPath
   *
   * @default - No toleratedFailureCountPath
   */
  readonly toleratedFailureCountPath?: string;
}

/**
 * Properties for configuring a Distribute Map state that using JSONPath
 */
export interface DistributedMapJsonPathProps extends StateBaseProps, DistributedMapBaseOptions, DistributedMapJsonPathOptions {}

/**
 * Properties for configuring a Distribute Map state that using JSONata
 */
export interface DistributedMapJsonataProps extends StateBaseProps, DistributedMapBaseOptions, MapBaseJsonataOptions {}

/**
 * Properties for configuring a Distribute Map state
 */
export interface DistributedMapProps extends MapBaseProps, DistributedMapBaseOptions, DistributedMapJsonPathOptions, MapBaseJsonataOptions {}

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
   * Define a Distributed Mode Map state using JSONPath in the state machine
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
  public static jsonPath(scope: Construct, id: string, props: DistributedMapJsonPathProps = {}) {
    return new DistributedMap(scope, id, props);
  }
  /**
   * Define a Distributed Mode Map state using JSONata in the state machine
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
  public static jsonata(scope: Construct, id: string, props: DistributedMapJsonataProps = {}) {
    return new DistributedMap(scope, id, {
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }
  /**
   * Return whether the given object is a DistributedMap.
   */
  public static isDistributedMap(x: any): x is DistributedMap {
    return x !== null && typeof (x) === 'object' && DISTRIBUTED_MAP_SYMBOL in x;
  }

  private readonly mapExecutionType?: StateMachineType;
  private readonly itemReader?: IItemReader;
  private readonly toleratedFailurePercentage?: number;
  private readonly toleratedFailurePercentagePath?: string;
  private readonly toleratedFailureCount?: number;
  private readonly toleratedFailureCountPath?: string;
  private readonly label?: string;
  private readonly resultWriter?: ResultWriter;
  private readonly resultWriterV2?: ResultWriterV2;
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
    this.resultWriterV2 = props.resultWriterV2;
    this.processorMode = ProcessorMode.DISTRIBUTED;
  }

  private getResultWriter(): ResultWriterV2 | ResultWriter | undefined {
    return FeatureFlags.of(this).isEnabled(STEPFUNCTIONS_USE_DISTRIBUTED_MAP_RESULT_WRITER_V2)
      ? this.resultWriterV2
      : this.resultWriter;
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

    if (this.itemReader) {
      errors.push(...this.itemReader.validateItemReader());
    }

    if (this.resultWriter) {
      errors.push(...this.resultWriter.validateResultWriter());
    }

    if (this.label) {
      if (this.label.length > 40) {
        errors.push('label must be 40 characters or less');
      }

      let labelRegex = /[\s\?\*\<\>\{\}\\[\]\:\;\,\|\^\~\$\#\%\&\`\"]|[\u0000-\u001f]|[\u007f-\u009f]/gi;
      if (labelRegex.test(this.label)) {
        errors.push('label cannot contain any whitespace or special characters');
      }
    }

    return errors;
  }

  protected whenBoundToGraph(graph: StateGraph) {
    super.whenBoundToGraph(graph);
    const resultWriter = this.getResultWriter();
    if (resultWriter && resultWriter.bucket) {
      resultWriter.providePolicyStatements().forEach(policyStatement => {
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
  public toStateJson(stateMachineQueryLanguage?: QueryLanguage): object {
    let rendered: any = super.toStateJson(stateMachineQueryLanguage);
    if (rendered.ItemProcessor.ProcessorConfig.ExecutionType) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-stepfunctions:propertyIgnored', 'Property \'ProcessorConfig.executionType\' is ignored, use the \'mapExecutionType\' in the \'DistributedMap\' class instead.');
    }

    rendered.ItemProcessor.ProcessorConfig.ExecutionType = this.mapExecutionType;
    const renderedResultWriter = this.renderResultWriter(stateMachineQueryLanguage);
    this.addWarningIfResultWriterIsEmpty(renderedResultWriter);
    // ItemReader and ResultWriter configuration will base on the Map's query language.
    // If Map's query language is not specified, then use state machine's query language.
    const stateQueryLanguage = this.queryLanguage ?? stateMachineQueryLanguage;
    return {
      ...rendered,
      ...this.renderItemReader(stateQueryLanguage),
      ...this.renderItemBatcher(),
      ...(this.toleratedFailurePercentage && { ToleratedFailurePercentage: this.toleratedFailurePercentage }),
      ...(this.toleratedFailurePercentagePath && { ToleratedFailurePercentagePath: this.toleratedFailurePercentagePath }),
      ...(this.toleratedFailureCount && { ToleratedFailureCount: this.toleratedFailureCount }),
      ...(this.toleratedFailureCountPath && { ToleratedFailureCountPath: this.toleratedFailureCountPath }),
      ...(this.label && { Label: this.label }),
      ...renderedResultWriter,
    };
  }

  private addWarningIfResultWriterIsEmpty(renderedResultWriter: any) {
    // Step Functions currently allows saving empty ResultWriter object but it fails while executing the State Machine.
    // This will now be possible when using resultWriterV2.
    // Integ tessts cannot cover this test case as it the test will start failing if Step Functions service
    // starts validating empty ResultWriter objects in future.
    // https://docs.aws.amazon.com/step-functions/latest/dg/input-output-resultwriter.html#input-output-resultwriter-field-contents
    if (
      renderedResultWriter &&
      renderedResultWriter.ResultWriter &&
      renderedResultWriter.ResultWriter.Resource === undefined &&
      renderedResultWriter.ResultWriter.WriterConfig === undefined
    ) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-stepfunctions:emptyResultWriter', 'ResultWriter should specify at least the WriterConfig or the Bucket and Prefix');
    }
  }

  /**
   * Render the ItemReader as JSON object
   */
  private renderItemReader(queryLanguage?: QueryLanguage): any {
    if (!this.itemReader) { return undefined; }

    return FieldUtils.renderObject({
      ItemReader: this.itemReader.render(queryLanguage),
    });
  }

  /**
   * Render ResultWriter in ASL JSON format
   */
  private renderResultWriter(queryLanguage?: QueryLanguage): any {
    const resultWriter = this.getResultWriter();
    if (!resultWriter) { return undefined; }

    return FieldUtils.renderObject({
      ResultWriter: resultWriter.render(queryLanguage),
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
