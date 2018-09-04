import cdk = require('@aws-cdk/cdk');
import { IChainable, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';

export interface WaitProps {
    seconds?: number;
    timestamp?: string;

    secondsPath?: string;
    timestampPath?: string;

    comment?: string;
}

export class Wait extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = false;
        public readonly stateId: string;
        public readonly policyStatements = new Array<cdk.PolicyStatement>();

        constructor(private readonly wait: Wait) {
            this.stateId = wait.stateId;
        }

        public renderState() {
            return {
                ...this.wait.renderBaseState(),
                ...this.wait.transitions.renderSingle(TransitionType.Next, { End: true }),
            };
        }

        public addNext(targetState: IStateChain): void {
            this.wait.addNextTransition(targetState);
        }

        public addCatch(_targetState: IStateChain, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Wait.");
        }

        public addRetry(_retry?: RetryProps): void {
            // Nothing
        }

        public accessibleChains() {
            return this.wait.accessibleStates();
        }

        public get hasOpenNextTransition(): boolean {
            return !this.wait.hasNextTransition;
        }
    };

    constructor(parent: cdk.Construct, id: string, props: WaitProps) {
        // FIXME: Validate input
        super(parent, id, {
            Type: StateType.Wait,
            Seconds: props.seconds,
            Timestamp: props.timestamp,
            SecondsPath: props.secondsPath,
            TimestampPath: props.timestampPath,
            Comment: props.comment,
        });
    }

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Wait.Internals(this));
    }
}