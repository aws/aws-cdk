import { Construct } from 'constructs';
import { MapBase, BaseMapProps } from './map-base';
import { FieldUtils } from '../fields';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, ProcessorConfig, ProcessorMode, RetryProps } from '../types';

/**
 * Properties for defining a Map state
 */
export interface MapProps extends BaseMapProps {
  /**
   * The JSON that you want to override your default iteration input (mutually exclusive  with `itemSelector`).
   *
   * @deprecated Step Functions has deprecated the `parameters` field in favor of
   * the new `itemSelector` field
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-itemselector.html
   *
   * @default $
   */
  readonly parameters?: { [key: string]: any };
}

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
export class Map extends MapBase implements INextable {
  constructor(scope: Construct, id: string, props: MapProps = {}) {
    super(scope, id, props);
    this.processorMode = ProcessorMode.INLINE;
  }

  /**
   * Define iterator state machine in Map.
   *
   * A Map must either have a non-empty iterator or a non-empty item processor (mutually exclusive  with `itemProcessor`).
   *
   * @deprecated - use `itemProcessor` instead.
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
      ...super.toStateJson(),
      ...this.renderParameters(),
      ...this.renderIterator(),
    };
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    const errors = super.validateState();

    if (!this.iteration && !this.processor) {
      errors.push('Map state must either have a non-empty iterator or a non-empty item processor');
    }

    if (this.iteration && this.processor) {
      errors.push('Map state cannot have both an iterator and an item processor');
    }

    if (this.parameters && this.itemSelector) {
      errors.push('Map state cannot have both parameters and an item selector');
    }

    return errors;
  }

  /**
   * Render Parameters in ASL JSON format
   */
  private renderParameters(): any {
    if (!this.parameters) {
      return undefined;
    }
    return FieldUtils.renderObject({
      Parameters: this.parameters,
    });
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
   * Define item processor in Map.
   *
   * A Map must either have a non-empty iterator or a non-empty item processor (mutually exclusive  with `iterator`).
   */
  public itemProcessor(processor: IChainable, config: ProcessorConfig = {}): Map {
    const name = `Map ${this.stateId} Item Processor`;
    const stateGraph = new StateGraph(processor.startState, name);
    super.addItemProcessor(stateGraph, config);
    return this;
  }
}
