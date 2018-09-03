export interface IInternalState {
    readonly stateId: string;
    readonly stateBehavior: StateBehavior;

    next(targetState: IInternalState): void;
    catch(targetState: IInternalState, errors: string[]): void;
    renderState(): any;
}

export interface StateBehavior {
    elidable: boolean;
    canHaveNext: boolean;
    canHaveCatch: boolean;
}

export interface Transition {
    targetState: IInternalState;
    annotation: any;
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
