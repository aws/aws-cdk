import cdk = require('@aws-cdk/cdk');

export interface IInternalState {
    readonly stateId: string;
    readonly canHaveCatch: boolean;
    readonly hasOpenNextTransition: boolean;
    readonly policyStatements: cdk.PolicyStatement[];

    addNext(targetState: IInternalState): void;
    addCatch(targetState: IInternalState, errors: string[]): void;

    accessibleStates(): IInternalState[];
    renderState(): any;
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

export interface Transition {
    transitionType: TransitionType;
    targetState: IInternalState;
    annotation?: any;
}

export enum TransitionType {
    Next = 'Next',
    Catch = 'Catch',
    Choice = 'Choices',
    Default = 'Default',
}

export class Transitions {
    private readonly transitions = new Array<Transition>();

    public add(transitionType: TransitionType, targetState: IInternalState, annotation?: any) {
        this.transitions.push({ transitionType, targetState, annotation });
    }

    public has(type: TransitionType): boolean {
        return this.get(type).length > 0;
    }

    public get(type: TransitionType): Transition[] {
        return this.transitions.filter(t => t.transitionType === type);
    }

    public all(): Transition[] {
        return this.transitions;
    }

    public renderSingle(type: TransitionType, otherwise: any = {}): any {
        const transitions = this.get(type);
        if (transitions.length === 0) {
            return otherwise;
        }
        return {
            [type]: transitions[0].targetState.stateId
        };
    }

    public renderList(type: TransitionType): any {
        const transitions = this.get(type);
        if (transitions.length === 0) {
            return {};
        }

        return {
            [type]: transitions.map(t => ({
                ...t.annotation,
                Next: t.targetState.stateId,
            }))
        };
    }
}