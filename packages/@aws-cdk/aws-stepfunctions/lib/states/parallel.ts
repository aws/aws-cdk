import cdk = require('@aws-cdk/cdk');
import { Errors, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';
import { renderNextEnd, renderRetry } from './util';

export interface ParallelProps {
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
}

export class Parallel extends State {
    private static Internals = class implements IInternalState {
        public readonly stateBehavior: StateBehavior = {
            canHaveCatch: true,
            canHaveNext: true,
            elidable: false,
        };

        constructor(private readonly parallel: Parallel) {
        }

        public get stateId(): string {
            return this.parallel.stateId;
        }

        public renderState() {
            const catches = this.parallel.transitions.filter(t => t.annotation !== undefined);
            const regularTransitions = this.parallel.transitions.filter(t => t.annotation === undefined);

            if (regularTransitions.length > 1) {
                throw new Error(`State "${this.stateId}" can only have one outgoing transition`);
            }

            return {
                ...this.parallel.renderBaseState(),
                ...renderNextEnd(regularTransitions),
                Catch: catches.length === 0 ? undefined : catches.map(c => c.annotation),
                Retry: new cdk.Token(() => this.parallel.retries.length === 0 ? undefined : this.parallel.retries.map(renderRetry)),
            };
        }

        public next(targetState: IInternalState): void {
            this.parallel.addNextTransition(targetState);
        }

        public catch(targetState: IInternalState, errors: string[]): void {
            this.parallel.addTransition(targetState, {
                ErrorEquals: errors,
                Next: targetState.stateId
            });
        }
    };

    private readonly branches: StateMachineDefinition[] = [];
    private readonly retries = new Array<RetryProps>();

    constructor(parent: StateMachineDefinition, id: string, props: ParallelProps = {}) {
        super(parent, id, {
            Type: StateType.Parallel,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
            ResultPath: props.resultPath,
            Branches: new cdk.Token(() => this.branches.map(b => b.renderStateMachine()))
        });
    }

    public parallel(definition: StateMachineDefinition) {
        this.branches.push(definition);
    }

    public retry(props: RetryProps = {}) {
        if (!props.errors) {
            props.errors = [Errors.all];
        }
        this.retries.push(props);
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Parallel.Internals(this));
    }
}
