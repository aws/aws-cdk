export namespace amazon_states_language {
    // tslint:disable
    export interface Commentable {
        Comment?: string
    }

    export interface Branch extends Commentable {
        States: {[index: string]: State},
        StartAt: string,
    }

    export interface StateMachine extends Branch {
        Version?: string,
        TimeoutSeconds?: string
    }

    export enum StateType {
        Pass,
        Task,
        Choice,
        Wait,
        Succeed,
        Fail,
        Parallel
    }

    export type State = PassState | TaskState | WaitState | ChoiceState | ParallelState | SucceedState | FailState;

    export interface NextField {
        Next: string;
    }

    export interface EndField {
        End: true;
    }

    export type NextOrEndField = NextField | EndField;

    export interface InputOutputPathFields {
        InputPath?: string;
        OutputPath?: string;
    }

    export interface ResultPathField {
        ResultPath?: string;
    }

    export enum ErrorCode {
        ALL = "States.ALL",
        Timeout = "States.Timeout",
        TaskFailed = "States.TaskFailed",
        Permissions = "States.Permissions",
        ResultPathMatchFailure = "States.ResultPathMatchFailure",
        BranchFailed = "States.BranchFailed",
        NoChoiceMatched = "States.NoChoiceMatched"
    }

    export interface WithErrors {
        ErrorEquals: string[];
    }

    export interface Retrier extends WithErrors {
        IntervalSeconds?: number;
        MaxAttempts?: number;
        BackoffRate?: number;
    }

    export interface Catcher extends WithErrors {
        Next: string;
        ResultPath?: string;
    }

    export interface RetryCatchFields {
        Retry?: Retrier[];
        Catch?: Catcher[];
    }

    export interface BasePassState extends Commentable, InputOutputPathFields, ResultPathField {
        Type: StateType.Pass,
        Result?: any;
    }

    export type PassState = BasePassState & NextOrEndField;

    export interface BaseTaskState extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields {
        Type: StateType.Task;
        Resource: string;
        TimeoutSeconds?: number;
        HeartbeatSeconds?: number;
    }

    export type TaskState = BaseTaskState & NextOrEndField;

    export interface ChoiceState extends Commentable, InputOutputPathFields {
        Type: StateType.Choice;
        Choices: Array<ChoiceRule<ComparisonOperation>>;
        Default?: string;
    }

    export interface BaseWaitState extends Commentable, InputOutputPathFields {
        Type: StateType.Wait
    }

    export interface WaitSeconds extends BaseWaitState {
        Seconds: number
    }

    export interface WaitSecondsPath extends BaseWaitState {
        SecondsPath: string
    }

    export interface WaitTimestamp extends BaseWaitState {
        Timestamp: string
    }

    export interface WaitTimestampPath extends BaseWaitState {
        TimestampPath: string
    }

    export type WaitState = (WaitSeconds | WaitSecondsPath | WaitTimestamp | WaitTimestampPath) & NextOrEndField;

    export interface SucceedState extends Commentable, InputOutputPathFields {
        Type: StateType.Succeed;
    }

    export interface FailState extends Commentable {
        Type: StateType.Fail;
        Error: string | ErrorCode,
        Cause: string
    }

    export interface BaseParallelState extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields {
        Type: StateType.Parallel;
        Branches: Branch[]
    }

    export type ParallelState = BaseParallelState & NextOrEndField;

    export interface VariableComparisonOperation {
        Variable: string;
    }

    export interface StringEqualsComparisonOperation extends VariableComparisonOperation {
        StringEquals: string;
    }

    export interface StringLessThanComparisonOperation extends VariableComparisonOperation {
        StringLessThan: string;
    }

    export interface StringGreaterThanComparisonOperation extends VariableComparisonOperation {
        StringGreaterThan: string;
    }

    export interface StringLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        StringLessThanEquals: string;
    }

    export interface StringGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        StringGreaterThanEquals: string;
    }

    export interface NumericEqualsComparisonOperation extends VariableComparisonOperation {
        NumericEquals: number;
    }

    export interface NumericLessThanComparisonOperation extends VariableComparisonOperation {
        NumericLessThan: number;
    }

    export interface NumericGreaterThanComparisonOperation extends VariableComparisonOperation {
        NumericGreaterThan: number;
    }

    export interface NumericLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        NumericLessThanEquals: number;
    }

    export interface NumericGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        NumericGreaterThanEquals: number;
    }

    export interface BooleanEqualsComparisonOperation extends VariableComparisonOperation {
        BooleanEquals: boolean;
    }

    export interface TimestampEqualsComparisonOperation extends VariableComparisonOperation {
        TimestampEquals: string;
    }

    export interface TimestampLessThanComparisonOperation extends VariableComparisonOperation {
        TimestampLessThan: string;
    }

    export interface TimestampGreaterThanComparisonOperation extends VariableComparisonOperation {
        TimestampGreaterThan: string;
    }

    export interface TimestampLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        TimestampLessThanEquals: string;
    }

    export interface TimestampGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        TimestampGreaterThanEquals: string;
    }

    export interface AndComparisonOperation {
        And: ComparisonOperation[]
    }

    export interface OrComparisonOperation {
        Or: ComparisonOperation[]
    }

    export interface NotComparisonOperation {
        Not: ComparisonOperation
    }

    export type ComparisonOperation = VariableComparisonOperation | AndComparisonOperation | OrComparisonOperation | NotComparisonOperation;

    export type ChoiceRule<T extends ComparisonOperation> = NextField & T;
    export type StringEqualsChoiceRule = ChoiceRule<StringEqualsComparisonOperation>;
    export type StringLessThanChoiceRule = ChoiceRule<StringLessThanComparisonOperation>;
    export type StringGreaterThanChoiceRule = ChoiceRule<StringGreaterThanComparisonOperation>;
    export type StringLessThanEqualsChoiceRule = ChoiceRule<StringLessThanEqualsComparisonOperation>;
    export type StringGreaterThanEqualsChoiceRule = ChoiceRule<StringGreaterThanEqualsComparisonOperation>;
    export type NumericEqualsChoiceRule = ChoiceRule<NumericEqualsComparisonOperation>;
    export type NumericLessThanChoiceRule = ChoiceRule<NumericLessThanComparisonOperation>;
    export type NumericGreaterThanChoiceRule = ChoiceRule<NumericGreaterThanComparisonOperation>;
    export type NumericLessThanEqualsChoiceRule = ChoiceRule<NumericLessThanEqualsComparisonOperation>;
    export type NumericGreaterThanEqualsChoiceRule = ChoiceRule<NumericGreaterThanEqualsComparisonOperation>;
    export type BooleanEqualsChoiceRule = ChoiceRule<BooleanEqualsComparisonOperation>;
    export type TimestampEqualsChoiceRule = ChoiceRule<TimestampEqualsComparisonOperation>;
    export type TimestampLessThanChoiceRule = ChoiceRule<TimestampLessThanComparisonOperation>;
    export type TimestampGreaterThanChoiceRule = ChoiceRule<TimestampGreaterThanComparisonOperation>;
    export type TimestampLessThanEqualsChoiceRule = ChoiceRule<TimestampLessThanEqualsComparisonOperation>;
    export type TimestampGreaterThanEqualsChoiceRule = ChoiceRule<TimestampGreaterThanEqualsComparisonOperation>;
    export type AndChoiceRule = ChoiceRule<AndComparisonOperation>;
    export type OrChoiceRule = ChoiceRule<OrComparisonOperation>;
    export type NotChoiceRule = ChoiceRule<NotComparisonOperation>;
    // tslint:enable
}