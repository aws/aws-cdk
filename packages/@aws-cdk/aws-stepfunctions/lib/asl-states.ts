import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Condition } from './asl-condition';
import { IStepFunctionsTaskResource, StepFunctionsTaskResourceProps } from './task-resource';

export interface StateMachineDefinitionProps {
    timeoutSeconds?: number;
}

export interface INextState {
    firstState(): State;
}

export class StateMachineDefinition extends cdk.Construct {
    /**
     * Used to find this Construct back in the construct tree
     */
    public readonly isStateMachine = true;

    private readonly states: State[] = [];
    private startState?: State;
    private readonly timeoutSeconds?: number;
    private readonly policyStatements = new Array<cdk.PolicyStatement>();

    constructor(parent: cdk.Construct, id: string, props: StateMachineDefinitionProps = {}) {
        super(parent, id);
        this.timeoutSeconds = props.timeoutSeconds;
    }

    public _addState(state: State) {
        this.states.push(state);
        if (this.startState === undefined) {
            this.startState = state;
        }
    }

    public addToRolePolicy(statement: cdk.PolicyStatement) {
        this.policyStatements.push(statement);
    }

    public addPolicyStatementsToRole(role: iam.Role) {
        for (const s of this.policyStatements) {
            role.addToPolicy(s);
        }
    }

    public toStateMachine(): any {
        if (!this.startState) {
            throw new Error('No states added to StateMachine');
        }

        const states: any = {};
        for (const s of this.states) {
            states[s.stateId] = s.toState();
        }

        // FIXME: Check all states are reachable.

        return {
            StartAt: this.startState.stateId,
            States: states,
            TimeoutSeconds: this.timeoutSeconds,
            Version: '1.0',
        };
    }
}

export interface StateProps {
    type: StateType;
    inputPath?: string;
    outputPath?: string;
}

export interface INextable {
    next(state: State): void;
}

export abstract class State extends cdk.Construct {
    private readonly type: StateType;
    private readonly inputPath?: string;
    private readonly outputPath?: string;

    constructor(parent: StateMachineDefinition, id: string, props: StateProps) {
        super(parent, id);

        this.type = props.type;
        this.inputPath = props.inputPath;
        this.outputPath = props.outputPath;

        parent._addState(this);
    }

    /**
     * Return the name of this state
     */
    public get stateId(): string {
        const sm = this.encompassingStateMachine();
        return this.ancestors(sm).map(p => p.id).join('/');
    }

    public toState(): any {
        return {
            Type: this.type,
            InputPath: this.inputPath,
            OutputPath: this.outputPath,
        };
    }

    /**
     * Find the top-level StateMachine we're part of
     */
    private encompassingStateMachine(): StateMachineDefinition {
        let curr: cdk.Construct | undefined = this;
        while (curr && !isStateMachine(curr)) {
            curr = curr.parent;
        }
        if (!curr) {
            throw new Error('Could not find encompassing StateMachine');
        }
        return curr;
    }
}

function isStateMachine(construct: cdk.Construct): construct is StateMachineDefinition {
    return (construct as any).isStateMachine;
}

export interface TaskProps {
    resource: IStepFunctionsTaskResource;
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
    timeoutSeconds?: number;
    heartbeatSeconds?: number;
}

export class Task extends State implements INextable {
    private _next?: State;
    private readonly resource: IStepFunctionsTaskResource;
    private readonly resultPath?: string;
    private readonly timeoutSeconds?: number;
    private readonly heartbeatSeconds?: number;
    private readonly resourceProps: StepFunctionsTaskResourceProps;

    constructor(parent: StateMachineDefinition, id: string, props: TaskProps) {
        super(parent, id, {
            type: StateType.Task,
            inputPath: props.inputPath,
            outputPath: props.outputPath
        });
        this.resource = props.resource;
        this.resultPath = props.resultPath;
        this.timeoutSeconds = props.timeoutSeconds;
        this.heartbeatSeconds = props.heartbeatSeconds;

        this.resourceProps = this.resource.asStepFunctionsTaskResource(this);
    }

    /**
     * Add a policy statement to the role that ultimately executes this
     */
    public addToRolePolicy(statement: cdk.PolicyStatement) {
        (this.parent as StateMachineDefinition).addToRolePolicy(statement);
    }

    public next(state: State) {
        this._next = state;
    }

    public toState(): any {
        return {
            ...super.toState(),
            Resource: this.resourceProps.resourceArn,
            ResultPath: this.resultPath,
            Next: this._next ? this._next.stateId : undefined,
            End: this._next ? undefined : true,
            TimeoutSeconds: this.timeoutSeconds,
            HeartbeatSeconds: this.heartbeatSeconds,
        };
    }
}

export interface PassProps {
    inputPath?: string;
    outputPath?: string;
}

export class Pass extends State implements INextable {
    private _next?: State;

    constructor(parent: StateMachineDefinition, id: string, props: PassProps = {}) {
        super(parent, id, {
            type: StateType.Pass,
            inputPath: props.inputPath,
            outputPath: props.outputPath
        });
    }

    public next(state: State) {
        this._next = state;
    }

    public toState(): any {
        return {
            ...super.toState(),
            Next: this._next ? this._next.stateId : undefined,
            End: this._next ? undefined : true,
        };
    }
}

export interface WaitProps {
    seconds?: number;
    timestamp?: string;

    secondsPath?: string;
    timestampPath?: string;
}

export class Wait extends State implements INextable {
    private _next?: State;
    private readonly seconds?: number;
    private readonly timestamp?: string;
    private readonly secondsPath?: string;
    private readonly timestampPath?: string;

    constructor(parent: StateMachineDefinition, id: string, props: WaitProps) {
        // FIXME: Validate input

        super(parent, id, {
            type: StateType.Wait,
        });

        this.seconds = props.seconds;
        this.timestamp = props.timestamp;
        this.secondsPath = props.secondsPath;
        this.timestampPath = props.timestampPath;
    }

    public next(state: State) {
        this._next = state;
    }

    public toState(): any {
        return {
            ...super.toState(),
            Seconds: this.seconds,
            Timestamp: this.timestamp,
            SecondsPath: this.secondsPath,
            TimestampPath: this.timestampPath,
            Next: this._next ? this._next.stateId : undefined,
            End: this._next ? undefined : true,
        };
    }
}

export interface ParallelProps {
    branches: StateMachineDefinition[]
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
}

export class Parallel extends State implements INextable {
    private _next?: State;
    private readonly branches: StateMachineDefinition[];
    private readonly resultPath?: string;

    constructor(parent: StateMachineDefinition, id: string, props: ParallelProps) {
        super(parent, id, {
            type: StateType.Parallel,
            inputPath: props.inputPath,
            outputPath: props.outputPath
        });
        this.branches = props.branches;
        this.resultPath = props.resultPath;
    }

    public next(state: State) {
        this._next = state;
    }

    public toState(): any {
        return {
            ...super.toState(),
            ResultPath: this.resultPath,
            Next: this._next ? this._next.stateId : undefined,
            End: this._next ? undefined : true,
            Branches: this.branches.map(b => b.toStateMachine())
        };
    }
}

export interface ChoiceBranch {
    condition: Condition;
    next: State;
}

export interface ChoiceProps {
    inputPath?: string;
    outputPath?: string;
}

export class Choice extends State {
    private readonly choices: ChoiceBranch[] = [];
    private default?: State;

    constructor(parent: StateMachineDefinition, id: string, props: ChoiceProps = {}) {
        super(parent, id, {
            type: StateType.Choice,
            inputPath: props.inputPath,
            outputPath: props.outputPath
        });
    }

    public on(condition: Condition, next: State) {
        this.choices.push({ condition, next });
    }

    public otherwise(next: State) {
        this.default = next;
    }

    public toState(): any {
        return {
            ...super.toState(),
            Choices: this.choices.map(c => this.renderChoice(c)),
            Default: this.default ? this.default.stateId : undefined
        };
    }

    private renderChoice(c: ChoiceBranch) {
        return {
            ...c.condition.toCondition(),
            Next: c.next.stateId
        };
    }
}

export interface FailProps {
    error: string;
    cause: string;
}

export class Fail extends State {
    private readonly error: string;
    private readonly cause: string;

    constructor(parent: StateMachineDefinition, id: string, props: FailProps) {
        super(parent, id, {
            type: StateType.Fail
        });
        this.error = props.error;
        this.cause = props.cause;
    }

    public toState(): any {
        return {
            ...super.toState(),
            Error: this.error,
            Cause: this.cause
        };
    }
}

export class Succeed extends State {
    constructor(parent: StateMachineDefinition, id: string) {
        super(parent, id, {
            type: StateType.Succeed
        });
    }
}

export enum StateType {
    Pass = 'Pass',
    Task = 'Task',
    Choice = 'Choice',
    Wait = 'Wait',
    Succeed = 'Succeed',
    Fail = 'Fail',
    Parallel = 'Parallel'
}