import cdk = require('@aws-cdk/cdk');
import { IStateChain, RetryProps } from './asl-external-api';
import { accessChainInternals } from './asl-state-chain';

export interface IInternalState {
    readonly stateId: string;
    readonly canHaveCatch: boolean;
    readonly hasOpenNextTransition: boolean;
    readonly policyStatements: cdk.PolicyStatement[];

    addNext(target: IStateChain): void;
    addCatch(target: IStateChain, errors: string[]): void;
    addRetry(retry?: RetryProps): void;

    accessibleChains(): IStateChain[];
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
    targetChain: IStateChain;
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

    public add(transitionType: TransitionType, targetChain: IStateChain, annotation?: any) {
        this.transitions.push({ transitionType, targetChain, annotation });
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
            [type]: accessChainInternals(transitions[0].targetChain).startState.stateId
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
                Next: accessChainInternals(t.targetChain).startState.stateId,
            }))
        };
    }
}