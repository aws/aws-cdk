import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';
import { Token } from '../../../core';
import { Chain } from '../chain';
import { FieldUtils } from '../fields';
import { IChainable, INextable, ProcessorMode } from '../types';

/**
 * Properties for defining a Map state
 */
export interface BaseMapProps {
  /**
   * Optional name for this state
   *
   * @default - The construct ID will be used as state name
   */
  readonly stateName?: string;

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
   * The JSON that you want to override your default iteration input (mutually exclusive  with `parameters`).
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-itemselector.html
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
export abstract class MapBase extends State implements INextable {
  public readonly endStates: INextable[];

  private readonly maxConcurrency: number | undefined;
  protected readonly itemsPath?: string;
  protected readonly itemSelector?: { [key: string]: any };

  constructor(scope: Construct, id: string, props: BaseMapProps = {}) {
    super(scope, id, props);
    this.endStates = [this];
    this.maxConcurrency = props.maxConcurrency;
    this.itemsPath = props.itemsPath;
    this.itemSelector = props.itemSelector;
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable): Chain {
    super.makeNext(next.startState);
    return Chain.sequence(this, next);
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
      ...this.renderResultSelector(),
      ...this.renderRetryCatch(),
      ...this.renderItemsPath(),
      ...this.renderItemSelector(),
      ...this.renderItemProcessor(),
      MaxConcurrency: this.maxConcurrency,
    };
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    const errors: string[] = [];

    if (this.processorConfig?.mode === ProcessorMode.DISTRIBUTED && !this.processorConfig?.executionType) {
      errors.push('You must specify an execution type for the distributed Map workflow');
    }

    if (this.maxConcurrency && !Token.isUnresolved(this.maxConcurrency) && !isPositiveInteger(this.maxConcurrency)) {
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
   * Render ItemSelector in ASL JSON format
   */
  private renderItemSelector(): any {
    if (!this.itemSelector) return undefined;
    return FieldUtils.renderObject({
      ItemSelector: this.itemSelector,
    });
  }
}
