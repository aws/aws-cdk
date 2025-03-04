import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { AssignableStateOptions, JsonataCommonOptions, JsonPathCommonOptions, renderJsonPath, State, StateBaseProps } from './state';
import { Token } from '../../../core';
import { Chain } from '../chain';
import { FieldUtils } from '../fields';
import { IChainable, INextable, ProcessorMode, QueryLanguage } from '../types';

/**
 * Base properties for defining a Map state that using JSONPath
 */
export interface MapBaseJsonPathOptions extends JsonPathCommonOptions {
  /**
   * JSONPath expression to select the array to iterate over
   *
   * @default $
   */
  readonly itemsPath?: string;

  /**
   * MaxConcurrencyPath
   *
   * A JsonPath that specifies the maximum concurrency dynamically from the state input.
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/concepts-asl-use-map-state-inline.html#map-state-inline-additional-fields
   *
   * @default - full concurrency
   */
  readonly maxConcurrencyPath?: string;

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
}

/**
 * The array that the Map state will iterate over.
 */
export abstract class ProvideItems {
  /**
   * Use a JSON array as Map state items.
   *
   * Example value: `[1, "{% $two %}", 3]`
   */
  public static jsonArray(array: any[]): ProvideItems { return { items: array }; }
  /**
   * Use a JSONata expression as Map state items.
   *
   * Example value: `{% $states.input.items %}`
   */
  public static jsonata(jsonataExpression: string): ProvideItems { return { items: jsonataExpression }; }
  /**
   * The array that the Map state will iterate over.
   */
  public abstract readonly items: any;
}

/**
 * Base properties for defining a Map state that using JSONata
 */
export interface MapBaseJsonataOptions extends JsonataCommonOptions {
  /**
   * The array that the Map state will iterate over.
   * @default - The state input as is.
   */
  readonly items?: ProvideItems;
}

/**
 * Base properties for defining a Map state
 */
export interface MapBaseOptions extends AssignableStateOptions {
  /**
   * MaxConcurrency
   *
   * An upper bound on the number of iterations you want running at once.
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/concepts-asl-use-map-state-inline.html#map-state-inline-additional-fields
   *
   * @default - full concurrency
   */
  readonly maxConcurrency?: number;

  /**
   * The JSON that you want to override your default iteration input (mutually exclusive  with `parameters`).
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-itemselector.html
   *
   * @default $
   */
  readonly itemSelector?: { [key: string]: any };
}

/**
 * Properties for defining a Map state
 */
export interface MapBaseProps extends StateBaseProps, MapBaseOptions, MapBaseJsonPathOptions, MapBaseJsonataOptions {}

/**
 * Returns true if the value passed is a positive integer
 * @param value the value to validate
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

  private readonly maxConcurrency?: number;
  private readonly maxConcurrencyPath?: string;
  protected readonly items?: ProvideItems;
  protected readonly itemsPath?: string;
  protected readonly itemSelector?: { [key: string]: any };

  constructor(scope: Construct, id: string, props: MapBaseProps = {}) {
    super(scope, id, props);
    this.endStates = [this];
    this.maxConcurrency = props.maxConcurrency;
    this.maxConcurrencyPath = props.maxConcurrencyPath;
    this.items = props.items;
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
  public toStateJson(topLevelQueryLanguage?: QueryLanguage): object {
    return {
      Type: StateType.MAP,
      ...this.renderQueryLanguage(topLevelQueryLanguage),
      Comment: this.comment,
      ResultPath: renderJsonPath(this.resultPath),
      ...this.renderNextEnd(),
      ...this.renderInputOutput(),
      ...this.renderResultSelector(),
      ...this.renderRetryCatch(),
      Items: this.items?.items,
      ...this.renderItemsPath(),
      ...this.renderItemSelector(),
      ...this.renderItemProcessor(),
      ...(this.maxConcurrency && { MaxConcurrency: this.maxConcurrency }),
      ...(this.maxConcurrencyPath && { MaxConcurrencyPath: renderJsonPath(this.maxConcurrencyPath) }),
      ...this.renderAssign(topLevelQueryLanguage),
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

    if (this.maxConcurrency && this.maxConcurrencyPath) {
      errors.push('Provide either `maxConcurrency` or `maxConcurrencyPath`, but not both');
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
