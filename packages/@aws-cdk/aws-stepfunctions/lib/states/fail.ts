import cdk = require('@aws-cdk/cdk');
import { IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';

export interface FailProps {
    error: string;
    cause: string;
    comment?: string;
}

export class Fail extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = false;
        public readonly hasOpenNextTransition = false;
        public readonly stateId: string;
        public readonly policyStatements = new Array<cdk.PolicyStatement>();

        constructor(private readonly fail: Fail) {
            this.stateId = fail.stateId;
        }

        public renderState() {
            return this.fail.renderBaseState();
        }

        public addNext(_targetState: IStateChain): void {
            throw new Error("Cannot chain onto a Fail state. This ends the state machine.");
        }

        public addCatch(_targetState: IStateChain, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Fail.");
        }

        public accessibleChains() {
            return this.fail.accessibleStates();
        }

        public addRetry(_retry?: RetryProps): void {
            // Nothing
        }
    };

    constructor(parent: cdk.Construct, id: string, props: FailProps) {
        super(parent, id, {
            Type: StateType.Fail,
            Error: props.error,
            Cause: props.cause,
            Comment: props.comment,
        });
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Fail.Internals(this));
    }
}