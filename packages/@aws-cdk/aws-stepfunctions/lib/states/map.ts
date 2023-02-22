import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';
import { Chain } from '../chain';
import { FieldUtils } from '../fields';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';

/**
 * Properties for defining a Map state
 */
export interface MapProps {
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
   */
  readonly parameters?: { [key: string]: any };

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

  private readonly maxConcurrency: number | undefined;
  private readonly itemsPath?: string;

  constructor(scope: Construct, id: string, props: MapProps = {}) {
    super(scope, id, props);
    this.endStates = [this];
    this.maxConcurrency = props.maxConcurrency;
    this.itemsPath = props.itemsPath;
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
      ...this.renderIterator(),
      ...this.renderItemsPath(),
      MaxConcurrency: this.maxConcurrency,
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

  private renderItemsPath(): any {
    return {
      ItemsPath: renderJsonPath(this.itemsPath),
    };
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
