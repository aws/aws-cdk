import { IStateChain } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-machine';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';

export interface SucceedProps {
    elidable?: boolean;
}

export class Succeed extends State {
    private static Internals = class implements IInternalState {
        constructor(private readonly succeed: Succeed) {
        }

        public get stateId(): string {
            return this.succeed.stateId;
        }

        public renderState() {
            return this.succeed.renderBaseState();
        }

        public get stateBehavior(): StateBehavior {
            return {
                canHaveCatch: false,
                canHaveNext: false,
                elidable: this.succeed.elidable,
            };
        }

        public next(_targetState: IInternalState): void {
            throw new Error("Cannot chain onto a Succeed state; this ends the state machine.");
        }

        public catch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Succeed.");
        }
    };
    private readonly elidable: boolean;

    constructor(parent: StateMachineDefinition, id: string, props: SucceedProps = {}) {
        super(parent, id, {
            Type: StateType.Succeed
        });
        this.elidable = props.elidable || false;
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Succeed.Internals(this));
    }
}
