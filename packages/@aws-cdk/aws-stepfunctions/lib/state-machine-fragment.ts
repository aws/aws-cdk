import { Chain } from './chain';
import { Parallel, ParallelProps } from './states/parallel';
import { State } from './states/state';
import { IChainable, INextable } from './types';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Base class for reusable state machine fragments
 */
export abstract class StateMachineFragment extends Construct implements IChainable {
  /**
   * The start state of this state machine fragment
   */
  public abstract readonly startState: State;

  /**
   * The states to chain onto if this fragment is used
   */
  public abstract readonly endStates: INextable[];

  public get id() {
    return this.node.id;
  }

  /**
   * Prefix the IDs of all states in this state machine fragment
   *
   * Use this to avoid multiple copies of the state machine all having the
   * same state IDs.
   *
   * @param prefix The prefix to add. Will use construct ID by default.
   */
  public prefixStates(prefix?: string): StateMachineFragment {
    State.prefixStates(this, prefix || `${this.id}: `);
    return this;
  }

  /**
   * Wrap all states in this state machine fragment up into a single state.
   *
   * This can be used to add retry or error handling onto this state
   * machine fragment.
   *
   * Be aware that this changes the result of the inner state machine
   * to be an array with the result of the state machine in it. Adjust
   * your paths accordingly. For example, change 'outputPath' to
   * '$[0]'.
   */
  public toSingleState(options: SingleStateOptions = {}): Parallel {
    const stateId = options.stateId || this.id;
    this.prefixStates(options.prefixStates || `${stateId}: `);

    return new Parallel(this, stateId, options).branch(this);
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable) {
    return Chain.start(this).next(next);
  }
}

/**
 * Options for creating a single state
 */
export interface SingleStateOptions extends ParallelProps {
  /**
   * ID of newly created containing state
   *
   * @default Construct ID of the StateMachineFragment
   */
  readonly stateId?: string;

  /**
   * String to prefix all stateIds in the state machine with
   *
   * @default stateId
   */
  readonly prefixStates?: string;
}
