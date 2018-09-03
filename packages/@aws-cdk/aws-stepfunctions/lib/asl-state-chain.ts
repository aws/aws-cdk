import { Errors, IChainable, IStateChain } from './asl-external-api';
import { IInternalState } from './asl-internal-api';

export class StateChain implements IStateChain {
    private allStates = new Set<IInternalState>();
    private activeStates = new Set<IInternalState>();
    private _startState: IInternalState;

    constructor(startState: IInternalState) {
        this.allStates.add(startState);

        this.activeStates.add(startState);
        this._startState = startState;
    }

    public get startState(): IInternalState {
        return this._startState;
    }

    public then(state: IChainable): IStateChain {
        const sm = state.toStateChain();

        const ret = this.clone();

        if (this.activeStates.size === 0) {
            throw new Error('Cannot chain onto state machine; no end states');
        }

        for (const endState of this.activeStates) {
            endState.next(sm.startState);
        }

        ret.absorb(sm);
        ret.activeStates = new Set(accessMachineInternals(sm).activeStates);

        return ret;
    }

    public toStateChain(): IStateChain {
        return this;
    }

    public catch(handler: IChainable, ...errors: string[]): IStateChain {
        if (errors.length === 0) {
            errors = [Errors.all];
        }

        const sm = handler.toStateChain();

        const canApplyDirectly = Array.from(this.allStates).every(s => s.stateBehavior.canHaveCatch);
        if (!canApplyDirectly) {
            // Can't easily create a Parallel here automatically since we need a
            // StateMachineDefinition parent and need to invent a unique name.
            throw new Error('Chain contains non-Task, non-Parallel actions. Wrap this in a Parallel to catch errors.');
        }

        const ret = this.clone();
        for (const state of this.allStates) {
            state.catch(sm.startState, errors);
        }

        // Those states are now part of the state machine, but we don't include
        // their active ends.
        ret.absorb(sm);

        return ret;
    }

    public absorb(other: IStateChain) {
        const sdm = accessMachineInternals(other);
        for (const state of sdm.allStates) {
            this.allStates.add(state);
        }
    }

    private clone(): StateChain {
        const ret = new StateChain(this.startState);
        ret.allStates = new Set(this.allStates);
        ret.activeStates = new Set(this.activeStates);
        return ret;
    }
}

/**
 * Access private parts of the state machine definition
 *
 * Parts that we don't want to show to the consumers because they'll
 * only distract, but parts that other states need to achieve their
 * work.
 */
export function accessMachineInternals(x: IStateChain): StateChain {
    return x as StateChain;
}