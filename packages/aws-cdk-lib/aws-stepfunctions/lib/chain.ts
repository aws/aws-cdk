import { Parallel, ParallelProps } from './states/parallel';
import { State } from './states/state';
import { IChainable, INextable } from './types';

/**
 * A collection of states to chain onto
 *
 * A Chain has a start and zero or more chainable ends. If there are
 * zero ends, calling next() on the Chain will fail.
 */
export class Chain implements IChainable {
  /**
   * Begin a new Chain from one chainable
   */
  public static start(state: IChainable) {
    return new Chain(state.startState, state.endStates, state);
  }

  /**
   * Make a Chain with the start from one chain and the ends from another
   */
  public static sequence(start: IChainable, next: IChainable) {
    return new Chain(start.startState, next.endStates, next);
  }

  /**
   * Make a Chain with specific start and end states, and a last-added Chainable
   */
  public static custom(startState: State, endStates: INextable[], lastAdded: IChainable) {
    return new Chain(startState, endStates, lastAdded);
  }

  /**
   * Identify this Chain
   */
  public readonly id: string;

  /**
   * The start state of this chain
   */
  public readonly startState: State;

  /**
   * The chainable end state(s) of this chain
   */
  public readonly endStates: INextable[];

  private constructor(startState: State, endStates: INextable[], private readonly lastAdded: IChainable) {
    this.id = lastAdded.id;
    this.startState = startState;
    this.endStates = endStates;
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable): Chain {
    if (this.endStates.length === 0) {
      throw new Error(`Cannot add to chain: last state in chain (${this.lastAdded.id}) does not allow it`);
    }

    for (const endState of this.endStates) {
      endState.next(next);
    }

    return new Chain(this.startState, next.endStates, next);
  }

  /**
   * Return a single state that encompasses all states in the chain
   *
   * This can be used to add error handling to a sequence of states.
   *
   * Be aware that this changes the result of the inner state machine
   * to be an array with the result of the state machine in it. Adjust
   * your paths accordingly. For example, change 'outputPath' to
   * '$[0]'.
   */
  public toSingleState(id: string, props: ParallelProps = {}): Parallel {
    return new Parallel(this.startState, id, props).branch(this);
  }
}
