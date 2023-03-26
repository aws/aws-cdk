import { Construct } from 'constructs';
import { Chain } from './chain';
import { Parallel, ParallelProps } from './states/parallel';
import { State } from './states/state';
import { IChainable, INextable } from './types';
/**
 * Base class for reusable state machine fragments
 */
export declare abstract class StateMachineFragment extends Construct implements IChainable {
    /**
     * The start state of this state machine fragment
     */
    abstract readonly startState: State;
    /**
     * The states to chain onto if this fragment is used
     */
    abstract readonly endStates: INextable[];
    get id(): string;
    /**
     * Prefix the IDs of all states in this state machine fragment
     *
     * Use this to avoid multiple copies of the state machine all having the
     * same state IDs.
     *
     * @param prefix The prefix to add. Will use construct ID by default.
     */
    prefixStates(prefix?: string): StateMachineFragment;
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
    toSingleState(options?: SingleStateOptions): Parallel;
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
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
