import { IStateChain } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';
import { renderNextEnd } from './util';

export interface WaitProps {
    seconds?: number;
    timestamp?: string;

    secondsPath?: string;
    timestampPath?: string;
}

export class Wait extends State {
    private static Internals = class implements IInternalState {
        public readonly stateBehavior: StateBehavior = {
            canHaveCatch: false,
            canHaveNext: true,
            elidable: false
        };

        constructor(private readonly wait: Wait) {
        }

        public get stateId(): string {
            return this.wait.stateId;
        }

        public renderState() {
            return {
                ...this.wait.renderBaseState(),
                ...renderNextEnd(this.wait.transitions),
            };
        }

        public next(targetState: IInternalState): void {
            this.wait.addTransition(targetState);
        }

        public catch(_targetState: IInternalState, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Wait.");
        }
    };

    constructor(parent: StateMachineDefinition, id: string, props: WaitProps) {
        // FIXME: Validate input
        super(parent, id, {
            Type: StateType.Task,
            Seconds: props.seconds,
            Timestamp: props.timestamp,
            SecondsPath: props.secondsPath,
            TimestampPath: props.timestampPath
        });
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Wait.Internals(this));
    }
}