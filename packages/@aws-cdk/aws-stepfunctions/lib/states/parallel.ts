import { Construct } from 'constructs';
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';

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
    for (const branch of branches) {
      const name = `Parallel '${this.stateId}' branch ${this.branches.length + 1}`;
      super.addBranch(new StateGraph(branch.startState, name));
    }
    return this;
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
    };
  }

  /**
   * Validate this state
   */
  protected validate(): string[] {
    if (this.branches.length === 0) {
      return ['Parallel must have at least one branch'];
    }
    return [];
  }
}
