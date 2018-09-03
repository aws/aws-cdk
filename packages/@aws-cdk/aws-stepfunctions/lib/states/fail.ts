import { IStateChain } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-machine';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';

export interface FailProps {
    error: string;
    cause: string;
}

export class Fail extends State {
    private static Internals = class implements IInternalState {
        public readonly stateBehavior: StateBehavior = {
            canHaveCatch: false,
            canHaveNext: false,
            elidable: false
        };

        constructor(private readonly fail: Fail) {
        }

        public get stateId(): string {
            return this.fail.stateId;
        }

        public renderState() {
            return this.fail.renderBaseState();
        }

        public next(_targetState: IInternalState): void {
            throw new Error("Cannot chain onto a Fail state. This ends the state machine.");
        }

        public catch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Fail.");
        }
    };

    constructor(parent: StateMachineDefinition, id: string, props: FailProps) {
        super(parent, id, {
            Type: StateType.Fail,
            Error: props.error,
            Cause: props.cause
        });
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Fail.Internals(this));
    }
}