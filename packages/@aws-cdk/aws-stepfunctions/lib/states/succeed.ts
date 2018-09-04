import cdk = require('@aws-cdk/cdk');
import { IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';

export interface SucceedProps {
    comment?: string;
}

export class Succeed extends State {
    private static Internals = class implements IInternalState {
        public readonly hasOpenNextTransition = false;
        public readonly canHaveCatch = false;
        public readonly stateId: string;
        public readonly policyStatements = new Array<cdk.PolicyStatement>();

        constructor(private readonly succeed: Succeed) {
            this.stateId = succeed.stateId;
        }

        public renderState() {
            return this.succeed.renderBaseState();
        }

        public addNext(_targetState: IStateChain): void {
            throw new Error("Cannot chain onto a Succeed state; this ends the state machine.");
        }

        public addCatch(_targetState: IStateChain, _errors: string[]): void {
            throw new Error("Cannot catch errors on a Succeed.");
        }

        public addRetry(_retry?: RetryProps): void {
            // Nothing
        }

        public accessibleChains() {
            return this.succeed.accessibleStates();
        }
    };

    constructor(parent: cdk.Construct, id: string, props: SucceedProps = {}) {
        super(parent, id, {
            Type: StateType.Succeed,
            Comment: props.comment,
        });
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Succeed.Internals(this));
    }
}
