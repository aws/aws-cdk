import cdk = require('@aws-cdk/cdk');
import { CatchProps, Errors, IChainable, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { renderRetries } from './util';

export interface ParallelProps {
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
    comment?: string;
}

export class Parallel extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = true;
        public readonly stateId: string;

        constructor(private readonly parallel: Parallel) {
            this.stateId = parallel.stateId;
        }

        public renderState() {
            return {
                ...this.parallel.renderBaseState(),
                ...renderRetries(this.parallel.retries),
                ...this.parallel.transitions.renderSingle(TransitionType.Next, { End: true }),
                ...this.parallel.transitions.renderList(TransitionType.Catch),
            };
        }

        public addNext(targetState: IStateChain): void {
            this.parallel.addNextTransition(targetState);
        }

        public addCatch(targetState: IStateChain, props: CatchProps = {}): void {
            this.parallel.transitions.add(TransitionType.Catch, targetState, {
                ErrorEquals: props.errors ? props.errors : [Errors.all],
                ResultPath: props.resultPath
            });
        }

        public addRetry(retry?: RetryProps): void {
            this.parallel.retry(retry);
        }

        public accessibleChains() {
            return this.parallel.accessibleStates();
        }

        public get hasOpenNextTransition(): boolean {
            return !this.parallel.hasNextTransition;
        }

        public get policyStatements(): cdk.PolicyStatement[] {
            const ret = new Array<cdk.PolicyStatement>();
            for (const branch of this.parallel.branches) {
                ret.push(...branch.toStateChain().renderStateMachine().policyStatements);
            }
            return ret;
        }
    };

    private readonly branches: IChainable[] = [];
    private readonly retries = new Array<RetryProps>();

    constructor(parent: cdk.Construct, id: string, props: ParallelProps = {}) {
        super(parent, id, {
            Type: StateType.Parallel,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
            ResultPath: props.resultPath,
            Comment: props.comment,
            // Lazy because the states are mutable and they might get chained onto
            // (Users shouldn't, but they might)
            Branches: new cdk.Token(() => this.branches.map(b => b.toStateChain().renderStateMachine().stateMachineDefinition))
        });
    }

    public branch(definition: IChainable): Parallel {
        this.branches.push(definition);
        return this;
    }

    public retry(props: RetryProps = {}): Parallel {
        if (!props.errors) {
            props.errors = [Errors.all];
        }
        this.retries.push(props);
        return this;
    }

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    public onError(handler: IChainable, props: CatchProps = {}): IStateChain {
        return this.toStateChain().onError(handler, props);
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Parallel.Internals(this));
    }
}
