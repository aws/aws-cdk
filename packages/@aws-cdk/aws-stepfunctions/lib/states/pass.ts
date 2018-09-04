import cdk = require('@aws-cdk/cdk');
import { CatchProps, IChainable, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';

export interface PassProps {
    inputPath?: string;
    outputPath?: string;
    comment?: string;
}

export class Pass extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = false;
        public readonly stateId: string;
        public readonly policyStatements = new Array<cdk.PolicyStatement>();

        constructor(private readonly pass: Pass) {
            this.stateId = this.pass.stateId;
        }

        public renderState() {
            return {
                ...this.pass.renderBaseState(),
                ...this.pass.transitions.renderSingle(TransitionType.Next, { End: true }),
            };
        }

        public addNext(targetState: IStateChain): void {
            this.pass.addNextTransition(targetState);
        }

        public addCatch(_targetState: IStateChain, _props?: CatchProps): void {
            throw new Error("Cannot catch errors on a Pass.");
        }

        public addRetry(_retry?: RetryProps): void {
            // Nothing
        }

        public accessibleChains() {
            return this.pass.accessibleStates();
        }

        public get hasOpenNextTransition(): boolean {
            return !this.pass.hasNextTransition;
        }
    };

    constructor(parent: cdk.Construct, id: string, props: PassProps = {}) {
        super(parent, id, {
            Type: StateType.Pass,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
            Comment: props.comment,
        });
    }

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Pass.Internals(this));
    }
}
