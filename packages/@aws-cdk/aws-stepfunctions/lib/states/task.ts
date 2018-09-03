import cdk = require('@aws-cdk/cdk');
import { Errors, IChainable, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { renderRetries } from './util';

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
    policyStatements?: cdk.PolicyStatement[];
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
        public readonly canHaveCatch = true;
        public readonly stateId: string;
        public readonly policyStatements: cdk.PolicyStatement[];

        constructor(private readonly task: Task) {
            this.stateId = task.stateId;
            this.policyStatements = task.resourceProps.policyStatements || [];
        }

        public renderState() {
            return {
                ...this.task.renderBaseState(),
                ...renderRetries(this.task.retries),
                ...this.task.transitions.renderSingle(TransitionType.Next, { End: true }),
                ...this.task.transitions.renderList(TransitionType.Catch),
            };
        }

        public addNext(targetState: IInternalState): void {
            this.task.addNextTransition(targetState);
        }

        public addCatch(targetState: IInternalState, errors: string[]): void {
            this.task.transitions.add(TransitionType.Catch, targetState, { ErrorEquals: errors });
        }

        public accessibleStates() {
            return this.task.accessibleStates();
        }

        public get hasOpenNextTransition(): boolean {
            return !this.task.hasNextTransition;
        }
    };

    private readonly resourceProps: StepFunctionsTaskResourceProps;
    private readonly retries = new Array<RetryProps>();

    constructor(parent: cdk.Construct, id: string, props: TaskProps) {
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

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    public onError(handler: IChainable, ...errors: string[]): IStateChain {
        return this.toStateChain().onError(handler, ...errors);
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
