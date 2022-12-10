import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Chain } from '../chain';
import { FieldUtils } from '../fields';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps, StateMachineType } from '../types';
import { ItemReader, ResultWriter } from './distributed-map';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';

/**
 * The processing mode of the Map state
 */
export enum MapProcessorMode {
  /**
   * Inline mode
   */
  INLINE = 'INLINE',

  /**
   * Distributed mode
   */
  DISTRIBUTED = 'DISTRIBUTED'
}

/**
 * Properties specified to process a group of items in a single child workflow execution
 */
export interface ItemBatcherOptions {
  /**
   * The maximum number of items that each child workflow execution processes
   *
   * @default - No maximum
   */
  readonly maxItemsPerBatch?: number;

  /**
   * Reference path to the maximum number of items per batch
   *
   * @default - No path
   */
  readonly maxItemsPerBatchPath?: string;

  /**
   * the maximum size of a batch in bytes, up to 256 KBs
   *
   * @default - No maximum, the interpreter processes as many items it can process up to 256 KB
   * in each child workflow execution
   */
  readonly maxInputBytesPerBatch?: number;

  /**
   * Reference path to the maximum size of a batch in bytes
   *
   * @default - No path
   */
  readonly maxInputBytesPerBatchPath?: string;

  /**
   * A fixed JSON input to include in each batch passed to each child workflow execution
   *
   * @default - No input
   */
  readonly batchInput?: { [key: string]: any };
}

/**
 * Options for defining a Distributed Map state
 */
export interface DistributatedMapOptions {
  /**
   * Execution type for the Map workflow
   *
   * @default StateMachineType.STANDARD
   */
  readonly executionType?: StateMachineType;

  /**
   * A string that uniquely identifies a Map state.
   * For each Map Run, Step Functions adds the label to the Map Run ARN
   *
   * @default - Step Functions automatically generates a unique label
   */
  readonly label?: string;

  /**
   * Specifies to process the dataset items in batches.
   * Each child workflow execution then receives a batch of these items as input.
   *
   * @default - No batcher
   */
  readonly itemBatcher?: ItemBatcherOptions;

  /**
   * Specifies a dataset and its location.
   * The Map state receives its input data from the specified dataset.
   *
   * @default - No item reader
   */
  readonly itemReader?: ItemReader;

  /**
   * Specifies the location where Step Functions writes all child workflow execution results.
   *
   * @default - No result writer
   */
  readonly resultWriter?: ResultWriter;
}

/**
 * Properties for defining a Map state
 */
export interface MapProps {
  /**
   * The mode of the Map state
   *
   * @default MapProcessorMode.INLINE
   */
  readonly mode?: MapProcessorMode;

  /**
   * An optional description for this state
   *
   * @default No comment
   */
  readonly comment?: string;

  /**
   * JSONPath expression to select part of the state to be the input to this state.
   *
   * May also be the special value JsonPath.DISCARD, which will cause the effective
   * input to be the empty object {}.
   *
   * @default $
   */
  readonly inputPath?: string;

  /**
   * JSONPath expression to select part of the state to be the output to this state.
   *
   * May also be the special value JsonPath.DISCARD, which will cause the effective
   * output to be the empty object {}.
   *
   * @default $
   */
  readonly outputPath?: string;

  /**
   * JSONPath expression to indicate where to inject the state's output
   *
   * May also be the special value JsonPath.DISCARD, which will cause the state's
   * input to become its output.
   *
   * @default $
   */
  readonly resultPath?: string;

  /**
   * JSONPath expression to select the array to iterate over
   *
   * @default $
   */
  readonly itemsPath?: string;

  /**
   * The JSON that you want to override your default iteration input
   *
   * @default $
   * @deprecated use `itemSelector` instead
   */
  readonly parameters?: { [key: string]: any };

  /**
   * The JSON that you want to override your default iteration input
   *
   * @default $
   */
  readonly itemSelector?: { [key: string]: any };

  /**
   * The JSON that will replace the state's raw result and become the effective
   * result before ResultPath is applied.
   *
   * You can use ResultSelector to create a payload with values that are static
   * or selected from the state's raw result.
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector
   *
   * @default - None
   */
  readonly resultSelector?: { [key: string]: any };

  /**
   * MaxConcurrency
   *
   * An upper bound on the number of iterations you want running at once.
   *
   * @default - full concurrency
   */
  readonly maxConcurrency?: number;

  /**
   * Options for configuring a Distributed Map state
   *
   * @default - No options
   */
  readonly distributatedMapOptions?: DistributatedMapOptions;
}

/**
 * Returns true if the value passed is a positive integer
 * @param value the value ti validate
 */

export const isPositiveInteger = (value: number) => {
  const isFloat = Math.floor(value) !== value;

  const isNotPositiveInteger = value < 0 || value > Number.MAX_SAFE_INTEGER;

  return !isFloat && !isNotPositiveInteger;
};

/**
 * Define a Map state in the state machine
 *
 * A `Map` state can be used to run a set of steps for each element of an input array.
 * A Map state will execute the same steps for multiple entries of an array in the state input.
 *
 * While the Parallel state executes multiple branches of steps using the same input, a Map state
 * will execute the same steps for multiple entries of an array in the state input.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html
 */
export class Map extends State implements INextable {
  public readonly endStates: INextable[];

  private readonly mode?: MapProcessorMode;
  private readonly maxConcurrency: number | undefined;
  private readonly itemsPath?: string;
  private readonly itemSelector?: object;
  private readonly distributatedMapOptions?: DistributatedMapOptions;

  constructor(scope: Construct, id: string, props: MapProps = {}) {
    super(scope, id, props);
    this.validateProps(props);
    this.endStates = [this];
    this.mode = props.mode;
    this.maxConcurrency = props.maxConcurrency;
    this.itemsPath = props.itemsPath;
    this.itemSelector = props.itemSelector;
    this.distributatedMapOptions = props.distributatedMapOptions;

    if (this.mode === MapProcessorMode.DISTRIBUTED) {
      this.isDistributedMapState = true;
    }
  }

  /**
   * Add retry configuration for this state
   *
   * This controls if and how the execution will be retried if a particular
   * error occurs.
   */
  public addRetry(props: RetryProps = {}): Map {
    super._addRetry(props);
    return this;
  }

  /**
   * Add a recovery handler for this state
   *
   * When a particular error occurs, execution will continue at the error
   * handler instead of failing the state machine execution.
   */
  public addCatch(handler: IChainable, props: CatchProps = {}): Map {
    super._addCatch(handler.startState, props);
    return this;
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable): Chain {
    super.makeNext(next.startState);
    return Chain.sequence(this, next);
  }

  /**
   * Define iterator state machine in Map
   */
  public iterator(iterator: IChainable): Map {
    const name = `Map ${this.stateId} Iterator`;
    super.addIterator(new StateGraph(iterator.startState, name));
    return this;
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      Type: StateType.MAP,
      Comment: this.comment,
      ResultPath: renderJsonPath(this.resultPath),
      ...this.renderNextEnd(),
      ...this.renderInputOutput(),
      ...this.renderParameters(),
      ...this.renderResultSelector(),
      ...this.renderRetryCatch(),
      ...this.renderItemProcessor(),
      ...this.renderItemReader(),
      ...this.renderItemsPath(),
      ...this.renderItemSelector(),
      ...this.renderItemBatcher(),
      ...this.renderResultWriter(),
      MaxConcurrency: this.maxConcurrency,
      Label: this.distributatedMapOptions?.label,
    };
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    const errors: string[] = [];

    if (this.iteration === undefined) {
      errors.push('Map state must have a non-empty iterator');
    }

    if (this.maxConcurrency !== undefined && !Token.isUnresolved(this.maxConcurrency) && !isPositiveInteger(this.maxConcurrency)) {
      errors.push('maxConcurrency has to be a positive integer');
    }

    return errors;
  }

  private validateProps(props: MapProps) {
    if (props.itemSelector && props.parameters) {
      throw new Error('Only one of itemSelector or parameters can be provided');
    }
    if (props.mode === MapProcessorMode.INLINE && props.distributatedMapOptions) {
      throw new Error('distributatedMapOptions can only be used with DISTRIBUTED mode');
    }
    if (props.distributatedMapOptions?.label && props.distributatedMapOptions?.label.length > 40) {
      throw new Error('Label can only be 40 characters long');
    }
    if (props.distributatedMapOptions?.itemBatcher) {
      const itemBatcher = props.distributatedMapOptions?.itemBatcher;
      if (itemBatcher.maxItemsPerBatch && itemBatcher.maxItemsPerBatchPath) {
        throw new Error('Only one of maxItemsPerBatch or maxItemsPerBatchPath can be provided');
      }
      if (itemBatcher.maxInputBytesPerBatch && itemBatcher.maxInputBytesPerBatchPath) {
        throw new Error('Only one of maxInputBytesPerBatch or maxInputBytesPerBatchPath can be provided');
      }
    }
  }

  private renderItemsPath(): any {
    return {
      ItemsPath: renderJsonPath(this.itemsPath),
    };
  }

  private renderItemProcessor(): any {
    if (!this.iteration) {
      throw new Error('Iterator must not be undefined!');
    }
    return {
      ItemProcessor: {
        ...this.renderProcessorConfig(),
        ...this.iteration.toGraphJson(),
      },
    };
  }

  private renderProcessorConfig(): any {
    if (this.mode && this.mode === MapProcessorMode.DISTRIBUTED) {
      return {
        ProcessorConfig: {
          Mode: this.mode,
          ExecutionType: this.distributatedMapOptions?.executionType || StateMachineType.STANDARD,
        },
      };
    }
    return {};
  }

  private renderItemBatcher(): any {
    const itemBatcher = this.distributatedMapOptions?.itemBatcher;
    if (itemBatcher) {
      return {
        ItemBatcher: {
          ...(itemBatcher.maxItemsPerBatch ? { MaxItemsPerBatch: itemBatcher.maxItemsPerBatch } : {}),
          ...(itemBatcher.maxItemsPerBatchPath ? { MaxItemsPerBatchPath: itemBatcher.maxItemsPerBatchPath } : {}),
          ...(itemBatcher.maxInputBytesPerBatch ? { MaxInputBytesPerBatch: itemBatcher.maxInputBytesPerBatch } : {}),
          ...(itemBatcher.maxInputBytesPerBatchPath ? { MaxInputBytesPerBatchPath: itemBatcher.maxInputBytesPerBatchPath } : {}),
          ...(itemBatcher.batchInput ? { BatchInput: FieldUtils.renderObject(itemBatcher.batchInput) } : {}),
        },
      };
    }
    return {};
  }

  private renderItemReader(): any {
    const itemReader = this.distributatedMapOptions?.itemReader;
    if (!itemReader) {
      return {};
    }

    itemReader.providePolicyStatements().forEach((statement) => {
      this.iteration?.registerPolicyStatement(statement);
    });
    return {
      ItemReader: itemReader.render(),
    };
  }

  private renderResultWriter(): any {
    const resultWriter = this.distributatedMapOptions?.resultWriter;
    if (!resultWriter) {
      return {};
    }

    resultWriter.providePolicyStatements().forEach((statement) => {
      this.iteration?.registerPolicyStatement(statement);
    });
    return {
      ResultWriter: resultWriter.render(),
    };
  }

  /**
   * Render ItemSelector in ASL JSON format
   */
  private renderItemSelector(): any {
    return FieldUtils.renderObject({
      ItemSelector: this.itemSelector,
    });
  }

  /**
   * Render Parameters in ASL JSON format
   */
  private renderParameters(): any {
    return FieldUtils.renderObject({
      Parameters: this.parameters,
    });
  }
}
