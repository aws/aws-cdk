import { Token, tokenAwareJsonify } from "@aws-cdk/core";
import { isString } from "util";
import { requireOneOf } from "./util";

export namespace amazon_states_language {
    function requireNextOrEnd(props: any) {
        requireOneOf(props, ['next', 'end']);
    }

    export class Jsonable {
        public readonly props: any;

        constructor(props: any) {
            this.props = props;
        }

        public toJSON() {
            return this.toPascalCase(this.props);
        }

        private toPascalCase(o: any) {
            const out: { [index: string]: any } = {};
            for (const k in o) {
                if (o.hasOwnProperty(k)) {
                    out[k[0].toUpperCase() + k.substring(1)] = o[k];
                }
            }
            return out;
        }
    }

    export interface StateMachineProps extends BranchProps {
        version?: string | Token,
        timeoutSeconds?: number
    }

    export class StateMachine extends Jsonable {
        constructor(props: StateMachineProps) {
            if (props.timeoutSeconds !== undefined && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error("timeoutSeconds must be an integer");
            }
            const allStates = props.states.stateNames();
            if (new Set(allStates).size !== allStates.length) {
                throw new Error('State names are not unique within the whole state machine');
            }
            super(props);
        }

        public definitionString() {
            return tokenAwareJsonify(this.toJSON());
        }
    }

    export interface Commentable {
        comment?: string | Token
    }

    export interface BranchProps extends Commentable {
        states: States,
        startAt: string | Token
    }

    export class Branch extends Jsonable {
        constructor(props: BranchProps) {
            if (isString(props.startAt) && !props.states.hasState(props.startAt)) {
                throw new Error(`Specified startAt state '${props.startAt}' does not exist in states map`);
            }
            super(props);
        }

        public stateNames(): string[] {
            return this.props.states.stateNames();
        }
    }

    export class States extends Jsonable {
        constructor(states: { [name: string]: State }) {
            const longNames = Object.keys(states).filter(n => n.length > 128);
            if (longNames.length > 0) {
                throw new Error(`State names ${JSON.stringify(longNames)} exceed 128 characters in length`);
            }
            Object.keys(states).forEach(stateName => {
                const state = states[stateName];
                const next = state.next();
                if (!state.isTerminal() && next.length === 0 && !(state instanceof ChoiceState)) {
                    throw new Error(`Non-terminal and non-ChoiceState state '${state}' does not have a 'next' field`);
                }
                next.forEach(referencedState => {
                    if (!(referencedState in states)) {
                        throw new Error(`State '${stateName}' references unknown Next state '${referencedState}'`);
                    }
                });
            });
            super(states);
        }

        public toJSON() {
            return this.props;
        }

        public hasState(name: string) {
            return this.props.hasOwnProperty(name);
        }

        public stateNames(): string[] {
            const names = Object.keys(this.props);
            Object.values(this.props).map(
                state => (state instanceof ParallelState) ? state.stateNames() : []
            ).forEach(branchNames => branchNames.forEach(name => names.push(name)));
            return names;
        }
    }

    export interface NextField {
        next: string;
    }

    export interface EndField {
        end: true;
    }

    export interface NextOrEndField {
        next?: string,
        end?: true
    }

    export interface InputOutputPathFields {
        inputPath?: string;
        outputPath?: string;
    }

    export interface ResultPathField {
        resultPath?: string;
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

    export interface ErrorEquals {
        errorEquals: string[];
    }

    export interface RetrierProps extends ErrorEquals {
        intervalSeconds?: number;
        maxAttempts?: number;
        backoffRate?: number;
    }

    function isErrorName(error: string) {
        return Object.values(ErrorCode).includes(error) || !error.startsWith("States.");
    }

    function validateErrorEquals(errors: string[]) {
        if (errors.length === 0) {
            throw new Error('ErrorEquals is empty. Must be a non-empty array of Error Names');
        }
        if (errors.length > 1 && errors.includes(ErrorCode.ALL)) {
            throw new Error(`Error name '${ErrorCode.ALL}' is specified along with other Error Names. '${ErrorCode.ALL}' must appear alone.`);
        }
        errors.forEach(error => {
            if (!isErrorName(error)) {
                throw new Error(`'${error}' is not a valid Error Name`);
            }
        });
    }

    export class Retrier extends Jsonable {
        constructor(props: RetrierProps) {
            validateErrorEquals(props.errorEquals);
            if (props.intervalSeconds && (!Number.isInteger(props.intervalSeconds) || props.intervalSeconds < 1)) {
                throw new Error(`intervalSeconds '${props.intervalSeconds}' is not a positive integer`);
            }
            if (props.maxAttempts && (!Number.isInteger(props.maxAttempts) || props.maxAttempts < 0)) {
                throw new Error(`maxAttempts '${props.maxAttempts}' is not a non-negative integer`);
            }
            if (props.backoffRate && props.backoffRate < 1.0) {
                throw new Error(`backoffRate '${props.backoffRate}' is not >= 1.0`);
            }
            super(props);
        }
    }

    export interface CatcherProps extends ErrorEquals, ResultPathField, NextField {

    }

    export class Catcher extends Jsonable {
        constructor(props: CatcherProps) {
            validateErrorEquals(props.errorEquals);
            super(props);
        }
    }

    export interface RetryCatchFields {
        retry?: Retriers;
        catch?: Catchers;
    }

    function validateErrorAllAppearsLast(props: ErrorEquals[]) {
        props.slice(0, -1).forEach(prop => {
            if (prop.errorEquals.includes(ErrorCode.ALL)) {
                throw new Error(
                    `Error code '${ErrorCode.ALL}' found before last error handler. '${ErrorCode.ALL}' must appear in the last error handler.`
                );
            }
        });
    }

    export class Retriers extends Jsonable {
        constructor(retriers: Retrier[]) {
            validateErrorAllAppearsLast(retriers.map(retrier => retrier.props));
            super(retriers);
        }
    }

    export class Catchers extends Jsonable {
        constructor(catchers: Catcher[]) {
            validateErrorAllAppearsLast(catchers.map(catcher => catcher.props));
            super(catchers);
        }
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

    export interface State {
        isTerminal(): boolean
        next(): string[]
    }

    export abstract class BaseState extends Jsonable implements State {
        constructor(type: StateType, props: any) {
            super({ ...props, ...{type: StateType[type]}});
        }

        public isTerminal() {
            return this.props.hasOwnProperty('end') && this.props.end === true;
        }

        public next() {
            return (this.props.next) ? [this.props.next] : [];
        }
    }

    export interface PassStateProps extends Commentable, InputOutputPathFields, ResultPathField, NextOrEndField {
        result?: any;
    }

    export class PassState extends BaseState {
        constructor(props: PassStateProps) {
            requireNextOrEnd(props);
            super(StateType.Pass, props);
        }
    }

    export interface TaskStateProps extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields, NextOrEndField {
        resource: string;
        timeoutSeconds?: number;
        heartbeatSeconds?: number;
    }

    export class TaskState extends BaseState {
        constructor(props: TaskStateProps) {
            if (props.timeoutSeconds !== undefined && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error(`timeoutSeconds '${props.timeoutSeconds}' is not an integer`);
            }
            if (props.heartbeatSeconds !== undefined && !Number.isInteger(props.heartbeatSeconds)) {
                throw new Error(`heartbeatSeconds '${props.heartbeatSeconds}' is not an integer`);
            }
            if (props.timeoutSeconds !== undefined && props.heartbeatSeconds !== undefined && props.heartbeatSeconds >= props.timeoutSeconds) {
                throw new Error("heartbeatSeconds is larger than timeoutSeconds");
            }
            requireNextOrEnd(props);
            super(StateType.Task, props);
        }
    }

    export enum ComparisonOperator {
        StringEquals,
        StringLessThan,
        StringGreaterThan,
        StringLessThanEquals,
        StringGreaterThanEquals,
        NumericEquals,
        NumericLessThan,
        NumericGreaterThan,
        NumericLessThanEquals,
        NumericGreaterThanEquals,
        BooleanEquals,
        TimestampEquals,
        TimestampLessThan,
        TimestampGreaterThan,
        TimestampLessThanEquals,
        TimestampGreaterThanEquals,
        And,
        Or,
        Not
    }

    export abstract class ComparisonOperation extends Jsonable {
    }

    export interface BaseVariableComparisonOperationProps {
        comparisonOperator: ComparisonOperator,
        value: any,
        variable: string
    }

    export interface VariableComparisonOperationProps<T> {
        value: T,
        variable: string
    }

    export abstract class VariableComparisonOperation extends ComparisonOperation {
        constructor(props: BaseVariableComparisonOperationProps) {
            super(props);
        }

        public toJSON(): any {
            return {
                Variable: this.props.variable,
                [ComparisonOperator[this.props.comparisonOperator]]: this.props.value
            };
        }
    }

    export class StringEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringEquals}});
        }
    }

    export class StringLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThan}});
        }
    }

    export class StringGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThan}});
        }
    }

    export class StringLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThanEquals}});
        }
    }

    export class StringGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThanEquals}});
        }
    }

    export class NumericEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericEquals}});
        }
    }

    export class NumericLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThan}});
        }
    }

    export class NumericGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThan}});
        }
    }

    export class NumericLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThanEquals}});
        }
    }

    export class NumericGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThanEquals}});
        }
    }

    export class BooleanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<boolean>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.BooleanEquals}});
        }
    }

    export class TimestampEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampEquals}});
        }
    }

    export class TimestampLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThan}});
        }
    }

    export class TimestampGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampGreaterThan}});
        }
    }

    export class TimestampLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThanEquals}});
        }
    }

    export class TimestampGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampGreaterThanEquals}});
        }
    }

    export interface ArrayComparisonOperationProps {
        comparisonOperator: ComparisonOperator,
        comparisonOperations: ComparisonOperation[]
    }

    export abstract class ArrayComparisonOperation extends ComparisonOperation {
        constructor(props: ArrayComparisonOperationProps) {
            if (props.comparisonOperations.length === 0) {
                throw new Error('\'comparisonOperations\' is empty. Must be non-empty array of ChoiceRules');
            }
            super({
                [ComparisonOperator[props.comparisonOperator]]: props.comparisonOperations
            });
        }
    }

    export class AndComparisonOperation extends ArrayComparisonOperation {
        constructor(...comparisonOperations: ComparisonOperation[]) {
            super({ comparisonOperator: ComparisonOperator.And, comparisonOperations});
        }
    }

    export class OrComparisonOperation extends ArrayComparisonOperation {
        constructor(...comparisonOperations: ComparisonOperation[]) {
            super({ comparisonOperator: ComparisonOperator.Or, comparisonOperations});
        }
    }

    export class NotComparisonOperation extends ComparisonOperation {
        constructor(comparisonOperation: ComparisonOperation) {
            super({ [ComparisonOperator[ComparisonOperator.Not]]: comparisonOperation});
        }
    }

    export interface ChoiceRuleProps extends NextField {
        comparisonOperation: ComparisonOperation;
    }

    export class ChoiceRule extends Jsonable {
        constructor(props: ChoiceRuleProps) {
            super({...props.comparisonOperation.props, next: props.next});
        }
    }

    export class ChoiceRules extends Jsonable {
        constructor(...choices: ChoiceRule[]) {
            super(choices);
        }

        public get length(): number {
            return this.props.length;
        }

        public get nextStates(): string[] {
            return this.props.map((choiceRule: ChoiceRule) => choiceRule.props.next);
        }
    }

    export interface ChoiceStateProps extends Commentable, InputOutputPathFields {
        choices: ChoiceRules;
        default?: string;
    }

    export class ChoiceState extends BaseState {
        constructor(props: ChoiceStateProps) {
            if (props.choices.length === 0) {
                throw new Error('\'choices\' is empty. Must be non-empty array of ChoiceRules');
            }
            super(StateType.Choice, props);
        }

        public next() {
            return this.props.choices.nextStates().concat([this.props.default]);
        }
    }

    export interface WaitStateProps extends Commentable, InputOutputPathFields, NextOrEndField {
        seconds?: number
        secondsPath?: string,
        timestamp?: string,
        timestampPath?: string
    }

    export class WaitState extends BaseState {
        constructor(props: WaitStateProps) {
            requireOneOf(props, ['seconds', 'secondsPath', 'timestamp', 'timestampPath']);
            requireNextOrEnd(props);
            super(StateType.Wait, props);
        }
    }

    export interface SucceedStateProps extends Commentable, InputOutputPathFields {
    }

    export class SucceedState extends BaseState {
        constructor(props: SucceedStateProps = {}) {
            super(StateType.Succeed, props);
        }

        public isTerminal() {
            return true;
        }
    }

    export interface FailStateProps extends BaseState, Commentable {
        error: string,
        cause: string
    }

    export class FailState extends BaseState {
        constructor(props: FailStateProps) {
            super(StateType.Fail, props);
        }

        public isTerminal() {
            return true;
        }
    }

    export interface ParallelStateProps extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields, NextOrEndField {
        branches: Branch[]
    }

    export class ParallelState extends BaseState {
        constructor(props: ParallelStateProps) {
            requireNextOrEnd(props);
            super(StateType.Parallel, props);
        }

        public stateNames(): string[] {
            const names: string[] = [];
            this.props.branches.forEach((branch: Branch) => branch.stateNames().forEach(name => names.push(name)));
            return names;
        }
    }
}