import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { AssignableStateOptions, JsonataCommonOptions, JsonPathCommonOptions, renderJsonPath, State, StateBaseProps } from './state';
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, QueryLanguage, RetryProps } from '../types';

interface ParallelJsonPathOptions extends JsonPathCommonOptions {
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
interface ParallelJsonataOptions extends JsonataCommonOptions {
  /**
   * Parameters pass a collection of key-value pairs, either static values or JSONata expressions that select from the input.
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/transforming-data.html
   *
   * @default No arguments
   */
  readonly arguments?: { [name: string]: any };
}

/**
 * Properties for defining a Parallel state that using JSONPath
 */
export interface ParallelJsonPathProps extends StateBaseProps, AssignableStateOptions, ParallelJsonPathOptions {}

/**
 * Properties for defining a Parallel state that using JSONata
 */
export interface ParallelJsonataProps extends StateBaseProps, AssignableStateOptions, ParallelJsonataOptions {}

/**
 * Properties for defining a Parallel state
 */
export interface ParallelProps extends StateBaseProps, AssignableStateOptions, ParallelJsonPathOptions, ParallelJsonataOptions {}

/**
 * Define a Parallel state in the state machine
 *
 * A Parallel state can be used to run one or more state machines at the same
 * time.
 *
 * The Result of a Parallel state is an array of the results of its substatemachines.
 */
export class Parallel extends State implements INextable {
  /**
   * Define a Parallel state using JSONPath in the state machine
   *
   * A Parallel state can be used to run one or more state machines at the same
   * time.
   *
   * The Result of a Parallel state is an array of the results of its substatemachines.
   */
  public static jsonPath(scope: Construct, id: string, props: ParallelJsonPathProps = {}) {
    return new Parallel(scope, id, props);
  }
  /**
   * Define a Parallel state using JSONata in the state machine
   *
   * A Parallel state can be used to run one or more state machines at the same
   * time.
   *
   * The Result of a Parallel state is an array of the results of its substatemachines.
   */
  public static jsonata(scope: Construct, id: string, props: ParallelJsonataProps = {}) {
    return new Parallel(scope, id, {
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }
  public readonly endStates: INextable[];
  private readonly _branches: IChainable[] = [];

  constructor(scope: Construct, id: string, props: ParallelProps = {}) {
    super(scope, id, props);

    this.endStates = [this];
  }

  /**
   * Add retry configuration for this state
   *
   * This controls if and how the execution will be retried if a particular
   * error occurs.
   */
  public addRetry(props: RetryProps = {}): Parallel {
    super._addRetry(props);
    return this;
  }

  /**
   * Add a recovery handler for this state
   *
   * When a particular error occurs, execution will continue at the error
   * handler instead of failing the state machine execution.
   */
  public addCatch(handler: IChainable, props: CatchProps = {}): Parallel {
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
   * Define one or more branches to run in parallel
   */
  public branch(...branches: IChainable[]): Parallel {
    // Store branches for late-bound stategraph creation when we call bindToGraph.
    this._branches.push(...branches);
    return this;
  }

  /**
   * Overwrites State.bindToGraph. Adds branches to
   * the Parallel state here so that any necessary
   * prefixes are appended first.
   */
  public bindToGraph(graph: StateGraph) {
    for (const branch of this._branches) {
      const name = `Parallel '${this.stateId}' branch ${this.branches.length + 1}`;
      super.addBranch(new StateGraph(branch.startState, name));
    }
    this._branches.splice(0, this._branches.length);
    return super.bindToGraph(graph);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(topLevelQueryLanguage?: QueryLanguage): object {
    return {
      Type: StateType.PARALLEL,
      ...this.renderQueryLanguage(topLevelQueryLanguage),
      Comment: this.comment,
      ResultPath: renderJsonPath(this.resultPath),
      ...this.renderNextEnd(),
      ...this.renderInputOutput(),
      ...this.renderRetryCatch(),
      ...this.renderBranches(),
      ...this.renderResultSelector(),
      ...this.renderAssign(topLevelQueryLanguage),
    };
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    if (this.branches.length === 0) {
      return ['Parallel must have at least one branch'];
    }
    return [];
  }
}
