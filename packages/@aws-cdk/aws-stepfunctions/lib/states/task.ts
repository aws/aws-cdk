import cdk = require('@aws-cdk/cdk');
import { Errors, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateBehavior, StateType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { StateMachineDefinition } from './state-machine-definition';
import { renderNextEnd, renderRetry } from './util';

/**
 * Interface for objects that can be invoked in a Task state
 */
export interface IStepFunctionsTaskResource {
    /**
     * Return the properties required for using this object as a Task resource
     */
    asStepFunctionsTaskResource(callingTask: Task): StepFunctionsTaskResourceProps;
}

export interface StepFunctionsTaskResourceProps {
    resourceArn: cdk.Arn;
}

export interface TaskProps {
    resource: IStepFunctionsTaskResource;
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
    timeoutSeconds?: number;
    heartbeatSeconds?: number;
}

export class Task extends State {
    private static Internals = class implements IInternalState {
        public readonly stateBehavior: StateBehavior = {
            canHaveCatch: true,
            canHaveNext: true,
            elidable: false,
        };

        constructor(private readonly task: Task) {
        }

        public get stateId(): string {
            return this.task.stateId;
        }

        public renderState() {
            const catches = this.task.transitions.filter(t => t.annotation !== undefined);
            const regularTransitions = this.task.transitions.filter(t => t.annotation === undefined);

            if (regularTransitions.length > 1) {
                throw new Error(`State "${this.stateId}" can only have one outgoing transition`);
            }

            return {
                ...this.task.renderBaseState(),
                ...renderNextEnd(regularTransitions),
                Catch: catches.length === 0 ? undefined : catches.map(c => c.annotation),
                Retry: this.task.retries.length === 0 ? undefined : this.task.retries.map(renderRetry),
            };
        }

        public next(targetState: IInternalState): void {
            this.task.addNextTransition(targetState);
        }

        public catch(targetState: IInternalState, errors: string[]): void {
            this.task.addTransition(targetState, {
                ErrorEquals: errors,
                Next: targetState.stateId
            });
        }
    };

    private readonly resourceProps: StepFunctionsTaskResourceProps;
    private readonly retries = new Array<RetryProps>();

    constructor(parent: StateMachineDefinition, id: string, props: TaskProps) {
        super(parent, id, {
            Type: StateType.Task,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
            Resource: new cdk.Token(() => this.resourceProps.resourceArn),
            ResultPath: props.resultPath,
            TimeoutSeconds: props.timeoutSeconds,
            HeartbeatSeconds: props.heartbeatSeconds
        });
        this.resourceProps = props.resource.asStepFunctionsTaskResource(this);
    }

    /**
     * Add a policy statement to the role that ultimately executes this
     */
    public addToRolePolicy(statement: cdk.PolicyStatement) {
        this.containingStateMachine().addToRolePolicy(statement);
    }

    public retry(props: RetryProps = {}) {
        if (!props.errors) {
            props.errors = [Errors.all];
        }
        this.retries.push(props);
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Task.Internals(this));
    }
}
