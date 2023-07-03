import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';

/**
 * Properties for defining a Parallel state
 */
export interface ParallelProps {
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
 * Define a Parallel state in the state machine
 *
 * A Parallel state can be used to run one or more state machines at the same
 * time.
 *
 * The Result of a Parallel state is an array of the results of its substatemachines.
 */
export class Parallel extends State implements INextable {
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
  public toStateJson(): object {
    return {
      Type: StateType.PARALLEL,
      Comment: this.comment,
      ResultPath: renderJsonPath(this.resultPath),
      ...this.renderNextEnd(),
      ...this.renderInputOutput(),
      ...this.renderRetryCatch(),
      ...this.renderBranches(),
      ...this.renderResultSelector(),
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
