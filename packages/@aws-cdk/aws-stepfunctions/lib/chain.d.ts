import { Parallel, ParallelProps } from './states/parallel';
import { State } from './states/state';
import { IChainable, INextable } from './types';
/**
 * A collection of states to chain onto
 *
 * A Chain has a start and zero or more chainable ends. If there are
 * zero ends, calling next() on the Chain will fail.
 */
export declare class Chain implements IChainable {
    private readonly lastAdded;
    /**
     * Begin a new Chain from one chainable
     */
    static start(state: IChainable): Chain;
    /**
     * Make a Chain with the start from one chain and the ends from another
     */
    static sequence(start: IChainable, next: IChainable): Chain;
    /**
     * Make a Chain with specific start and end states, and a last-added Chainable
     */
    static custom(startState: State, endStates: INextable[], lastAdded: IChainable): Chain;
    /**
     * Identify this Chain
     */
    readonly id: string;
    /**
     * The start state of this chain
     */
    readonly startState: State;
    /**
     * The chainable end state(s) of this chain
     */
    readonly endStates: INextable[];
    private constructor();
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
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
    toSingleState(id: string, props?: ParallelProps): Parallel;
}
