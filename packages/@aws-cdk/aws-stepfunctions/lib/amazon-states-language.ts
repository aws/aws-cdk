import { Token, tokenAwareJsonify, istoken } from "@aws-cdk/core";
import { isString } from "util";
import { requireOneOf } from "./util";

/**
 * Models the Amazon States Language
 *
 * {@link https://states-language.net/spec.html}
 */
export namespace amazon_states_language {
    function requireNextOrEnd(props: any) {
        requireOneOf(props, ['next', 'end']);
    }

    /**
     * Converts all keys to PascalCase when serializing to JSON.
     */
    export class PascalCaseJson {
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
        /**
         * The version of the States language.
         *
         * @default "1.0"
         *
         * {@link https://states-language.net/spec.html#toplevelfields}
         */
        version?: string | Token,

        /**
         * The maximum number of seconds the machine is allowed to run.
         *
         * If the machine runs longer than the specified time, then the
         * interpreter fails the machine with a {@link ErrorCode#Timeout}
         * Error Name.
         *
         * {@link https://states-language.net/spec.html#toplevelfields}
         */
        timeoutSeconds?: number | Token
    }

    /**
     * A State Machine which can serialize to a JSON object
     */
    export class StateMachine extends PascalCaseJson {
        constructor(props: StateMachineProps) {
            if (props.timeoutSeconds !== undefined && !istoken(props.timeoutSeconds) && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error("timeoutSeconds must be an integer");
            }
            const allStates = props.states.stateNames();
            if (new Set(allStates).size !== allStates.length) {
                throw new Error('State names are not unique within the whole state machine');
            }
            super(props);
        }

        // tslint:disable:max-line-length
        /**
         * Returns a JSON representation for use with CloudFormation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html#cfn-stepfunctions-statemachine-definitionstring
         */
        // tslint:enable:max-line-length
        public definitionString() {
            return tokenAwareJsonify(this.toJSON());
        }
    }

    export interface Commentable {
        /**
         * A comment provided as human-readable description
         */
        comment?: string | Token
    }

    export interface BranchProps extends Commentable {
        /**
         * Represents the states in this State Machine.
         *
         * {@link https://states-language.net/spec.html#toplevelfields}
         */
        states: States,

        /**
         * Name of the state the interpreter starts running the machine at.
         *
         * Must exactly match one of the names of the {@link states} field.
         *
         * {@link https://states-language.net/spec.html#toplevelfields}
         */
        startAt: string | Token
    }

    export class Branch extends PascalCaseJson {
        constructor(props: BranchProps) {
            if (isString(props.startAt) && !props.states.hasState(props.startAt)) {
                throw new Error(`Specified startAt state '${props.startAt}' does not exist in states map`);
            }
            super(props);
        }

        public stateNames(): Array<string | Token> {
            return this.props.states.stateNames();
        }
    }

    /**
     * The States of the State Machine.
     *
     * State names must have length of less than or equal to 128 characters.
     * State names must be unique within the scope of the whole state machine.
     *
     * {@link https://states-language.net/spec.html#states-fields}
     */
    export class States extends PascalCaseJson {
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
        /**
         * The name of the next state to execute.
         *
         * Must exactly match the name of another state in the state machine.
         */
        next: string | Token;
    }

    export interface EndField {
        /**
         * Marks the state as an End State.
         *
         * After the interpreter executes an End State, the state machine will
         * terminate and return a result.
         */
        end: true | Token;
    }

    export interface NextOrEndField {
        /**
         * The name of the next state to execute.
         *
         * Must exactly match the name of another state in the state machine.
         */
        next?: string | Token,

        /**
         * Marks the state as an End State.
         *
         * After the interpreter executes an End State, the state machine will
         * terminate and return a result.
         */
        end?: true
    }

    export interface InputOutputPathFields {
        /**
         * A {@link https://states-language.net/spec.html#path Path} applied to
         * a State's raw input to select some or all of it.
         *
         * The selection is used as the input to the State.
         *
         * If `null` the raw input is discarded, and teh effective input for
         * the state is an empty JSON object.
         *
         * @default "$", which selects the whole raw input
         *
         * {@link https://states-language.net/spec.html#filters}
         */
        inputPath?: string | Token;

        /**
         * A {@link https://states-language.net/spec.html#path Path} applied to
         * a State's output after the application of {@link ResultPathField#resultPath ResultPath}
         * leading in the generation of the raw input for the next state.
         *
         * If `null` the input and result are discarded, and the effective
         * output for the state is an empty JSON object.
         *
         * @default "$", which is effectively the result of processing {@link ResultPathField#resultPath ResultPath}
         *
         * {@link https://states-language.net/spec.html#filters}
         */
        outputPath?: string | Token;
    }

    export interface ResultPathField {
        /**
         * A {@link https://states-language.net/spec.html#ref-paths Reference Path}
         * which specifies the where to place the result, relative to the raw input.
         *
         * If the input has a field which matches the ResultPath value, then in
         * the * output, that field is discarded and overwritten. Otherwise, a
         * new field is created.
         *
         * If `null` the state's own raw output is discarded and its raw input
         * becomes its result.
         *
         * @default "$", the state's result overwrites and replaces the raw input
         *
         * {@link https://states-language.net/spec.html#filters}
         */
        resultPath?: string | Token;
    }

    /**
     * Predefined Error Codes
     *
     * {@link https://states-language.net/spec.html#appendix-a}
     */
    export enum ErrorCode {
        /**
         * A wild-card which matches any Error Name.
         */
        ALL = "States.ALL",

        /**
         * A {@link TaskState Task State} either ran longer than the {@link TaskStateProps#timeoutSeconds TimeoutSeconds} value,
         * or failed to heartbeat for a time longer than the {@link TaskStateProps#heartbeatSeconds HeartbeatSeconds} value.
         */
        Timeout = "States.Timeout",

        /**
         * A {@link TaskState Task State} failed during the execution.
         */
        TaskFailed = "States.TaskFailed",

        /**
         * A {@link TaskState Task State} failed because it had insufficient privileges to
         * execute the specified code.
         */
        Permissions = "States.Permissions",

        /**
         * A {@link TaskState Task State} failed because it had insufficient privileges to
         * execute the specified code.
         */
        ResultPathMatchFailure = "States.ResultPathMatchFailure",

        /**
         * A branch of a {@link ParallelState Parallel state} failed.
         */
        BranchFailed = "States.BranchFailed",

        /**
         * A {@link ChoiceState Choice state} failed to find a match for the condition field
         * extracted from its input.
         */
        NoChoiceMatched = "States.NoChoiceMatched"
    }

    export interface ErrorEquals {
        /**
         * A non-empty array of {@link https://states-language.net/spec.html#error-names Error Names}
         * this rule should match.
         *
         * Can use {@link ErrorCode} values for pre-defined Error Codes.
         *
         * The reserved error name {@link ErrorCode#ALL} is a wild-card and
         * matches any Error Name. It must appear alone in the array and must
         * appear in the last {@link Retrier}/{@link Catcher} in the
         * {@link RetryCatchFields#retry}/{@link RetryCatchFields#catch} arrays
         *
         * {@link https://states-language.net/spec.html#errors}
         */
        errorEquals: Array<string | Token>
    }

    export interface RetrierProps extends ErrorEquals {
        /**
         * Number of seconds before first retry attempt.
         *
         * Must be a positive integer.
         *
         * @default 1
         */
        intervalSeconds?: number | Token

        /**
         * Maximum number of retry attempts.
         *
         * Must be a non-negative integer. May be set to 0 to specify no retries
         *
         * @default 3
         */
        maxAttempts?: number | Token

        /**
         * Multiplier tha tincreases the retry interval on each attempt.
         *
         * Must be greater than or equal to 1.0.
         *
         * @default 2.0
         */
        backoffRate?: number | Token
    }

    function validateErrorEquals(errors: Array<string | Token>) {
        if (errors.length === 0) {
            throw new Error('ErrorEquals is empty. Must be a non-empty array of Error Names');
        }
        if (errors.length > 1 && errors.includes(ErrorCode.ALL)) {
            throw new Error(`Error name '${ErrorCode.ALL}' is specified along with other Error Names. '${ErrorCode.ALL}' must appear alone.`);
        }
        errors.forEach(name => {
            if (isString(name) && !(Object.values(ErrorCode).includes(name) || !name.startsWith("States."))) {
                throw new Error(`'${name}' is not a valid Error Name`);
            }
        });
    }

    /**
     * A retry policy for the specified errors.
     *
     * {@link https://states-language.net/spec.html#errors}
     */
    export class Retrier extends PascalCaseJson {
        constructor(props: RetrierProps) {
            validateErrorEquals(props.errorEquals);
            if (props.intervalSeconds && !istoken(props.intervalSeconds) && (!Number.isInteger(props.intervalSeconds) || props.intervalSeconds < 1)) {
                throw new Error(`intervalSeconds '${props.intervalSeconds}' is not a positive integer`);
            }
            if (props.maxAttempts && !istoken(props.maxAttempts) && (!Number.isInteger(props.maxAttempts) || props.maxAttempts < 0)) {
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

    /**
     * A fallback state for the specified errors.
     *
     * {@link https://states-language.net/spec.html#errors}
     */
    export class Catcher extends PascalCaseJson {
        constructor(props: CatcherProps) {
            validateErrorEquals(props.errorEquals);
            super(props);
        }
    }

    export interface RetryCatchFields {
        /**
         * Ordered array of {@link Retrier} the interpreter scans through on
         * error.
         *
         * {@link https://states-language.net/spec.html#errors}
         */
        retry?: Retriers;

        /**
         * Ordered array  of {@link Catcher} the interpeter scans through to
         * handle errors when there is no {@link retry} or retries have been
         * exhausted.
         *
         * {@link https://states-language.net/spec.html#errors}
         */
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

    export class Retriers extends PascalCaseJson {
        constructor(retriers: Retrier[]) {
            validateErrorAllAppearsLast(retriers.map(retrier => retrier.props));
            super(retriers);
        }
    }

    export class Catchers extends PascalCaseJson {
        constructor(catchers: Catcher[]) {
            validateErrorAllAppearsLast(catchers.map(catcher => catcher.props));
            super(catchers);
        }
    }

    /**
     * Values for the "Type" field which is required for every State object.
     *
     * {@link https://states-language.net/spec.html#statetypes}
     */
    export enum StateType {
        Pass,
        Task,
        Choice,
        Wait,
        Succeed,
        Fail,
        Parallel
    }

    /**
     * A State in a State Machine.
     *
     * {@link https://states-language.net/spec.html#statetypes}
     */
    export interface State {
        isTerminal(): boolean
        next(): Array<string | Token>;
    }

    export abstract class BaseState extends PascalCaseJson implements State {
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
        /**
         * Treated as the output of a virtual task, placed as prescribed by the {@link resultPath} field.
         *
         * @default By default, the output is the input.
         */
        result?: any;
    }

    /**
     * Passes its input to its output, performing no work.
     *
     * Can also be used to inject fixed data into the state machine.
     *
     * {@link https://states-language.net/spec.html#pass-state}
     */
    export class PassState extends BaseState {
        constructor(props: PassStateProps) {
            requireNextOrEnd(props);
            super(StateType.Pass, props);
        }
    }

    export interface TaskStateProps extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields, NextOrEndField {
        /**
         * A URI identifying the task to execute.
         *
         * The States language does not constrain the URI. However, the AWS
         * Step Functions intepreter only supports the ARN of an Activity or
         * Lambda function. {@link https://docs.aws.amazon.com/step-functions/latest/dg/concepts-tasks.html}
         */
        resource: string | Token;

        /**
         * The maxium number of seconds the state will run before the interpeter
         * fails it with a {@link ErrorCode.Timeout} error.
         *
         * Must be a positive integer, and must be smaller than {@link heartbeatSeconds} if provided.
         *
         * @default 60
         */
        timeoutSeconds?: number | Token;

        /**
         * The number of seconds between heartbeats before the intepreter
         * fails the state with a {@link ErrorCode.Timeout} error.
         */
        heartbeatSeconds?: number | Token;
    }

    /**
     * Executes the work identified by the {@link TaskStateProps#resource} field.
     *
     * {@link https://states-language.net/spec.html#task-state}
     */
    export class TaskState extends BaseState {
        constructor(props: TaskStateProps) {
            if (props.timeoutSeconds !== undefined && !istoken(props.timeoutSeconds) && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error(`timeoutSeconds '${props.timeoutSeconds}' is not an integer`);
            }
            if (props.heartbeatSeconds !== undefined && !istoken(props.timeoutSeconds) && !Number.isInteger(props.heartbeatSeconds)) {
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

    export abstract class ComparisonOperation extends PascalCaseJson {
    }

    export interface BaseVariableComparisonOperationProps {
        comparisonOperator: ComparisonOperator,
        value: any,
        variable: string | Token
    }

    export interface VariableComparisonOperationProps<T> {
        /**
         * The value to be compared against.
         */
        value: T,

        /**
         * A Path to the value to be compared.
         */
        variable: string | Token
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
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringEquals}});
        }
    }

    export class StringLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThan}});
        }
    }

    export class StringGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThan}});
        }
    }

    export class StringLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThanEquals}});
        }
    }

    export class StringGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThanEquals}});
        }
    }

    export class NumericEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericEquals}});
        }
    }

    export class NumericLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThan}});
        }
    }

    export class NumericGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThan}});
        }
    }

    export class NumericLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThanEquals}});
        }
    }

    export class NumericGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<number | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThanEquals}});
        }
    }

    export class BooleanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<boolean | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.BooleanEquals}});
        }
    }

    export class TimestampEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampEquals}});
        }
    }

    export class TimestampLessThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThan}});
        }
    }

    export class TimestampGreaterThanComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampGreaterThan}});
        }
    }

    export class TimestampLessThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
            super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThanEquals}});
        }
    }

    export class TimestampGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
        constructor(props: VariableComparisonOperationProps<string | Token>) {
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

    /**
     * A rule desribing a conditional state transition.
     */
    export class ChoiceRule extends PascalCaseJson {
        constructor(props: ChoiceRuleProps) {
            super({...props.comparisonOperation.props, next: props.next});
        }
    }

    /**
     * An non-empty ordered array of ChoiceRule the interpreter will scan through
     * in order to make a state transition choice.
     */
    export class ChoiceRules extends PascalCaseJson {
        constructor(...choices: ChoiceRule[]) {
            if (choices.length === 0) {
                throw new Error("'Choices' array is empty. Must specify non-empty array of ChoiceRule.");
            }
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
        /**
         * Ordered array of {@link ChoiceRule}s the interpreter will scan through.
         */
        choices: ChoiceRules;

        /**
         * Name of a state to transition to if none of the ChoiceRules in
         * {@link choices} match.
         *
         * @default The interpreter will raise a {@link ErrorCode.NoChoiceMatched}
         * error if no {@link ChoiceRule} matches and there is no {@link default}
         * specified.
         */
        default?: string | Token;
    }

    /**
     * Adds branching logic to a state machine.
     *
     * {@link https://states-language.net/spec.html#choice-state}
     */
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
        /**
         * Number of seconds to wait.
         */
        seconds?: number | Token

        /**
         * {@link https://states-language.net/spec.html#ref-paths Reference Path} to a value for
         * the number of seconds to wait.
         */
        secondsPath?: string | Token,

        /**
         * Wait until specified absolute time.
         *
         * Must be an ISO-8601 extended offsete date-time formatted string.
         */
        timestamp?: string | Token,

        /**
         * {@link https://states-language.net/spec.html#ref-paths Reference Path} to a value for
         * an absolute expiry time.
         *
         * Value must be an ISO-8601 extended offsete date-time formatted string.
         */
        timestampPath?: string | Token
    }

    /**
     * Delay the state machine for a specified time.
     *
     * {@link https://states-language.net/spec.html#wait-state}
     */
    export class WaitState extends BaseState {
        constructor(props: WaitStateProps) {
            requireOneOf(props, ['seconds', 'secondsPath', 'timestamp', 'timestampPath']);
            requireNextOrEnd(props);
            super(StateType.Wait, props);
        }
    }

    export interface SucceedStateProps extends Commentable, InputOutputPathFields {
    }

    /**
     * Terminate the state machine successfully.
     *
     * {@link https://states-language.net/spec.html#succeed-state}
     */
    export class SucceedState extends BaseState {
        constructor(props: SucceedStateProps = {}) {
            super(StateType.Succeed, props);
        }

        public isTerminal() {
            return true;
        }
    }

    export interface FailStateProps extends BaseState, Commentable {
        /**
         * An Error Name used for error handling in a {@link Retrier} or {@link Catcher},
         * or for operational/diagnostic purposes.
         */
        error: string | Token,

        /**
         * A human-readable message describing the error.
         */
        cause: string | Token
    }

    /**
     * Terminate the state machine and mark the execution as a failure.
     *
     * {@link https://states-language.net/spec.html#fail-state}
     */
    export class FailState extends BaseState {
        constructor(props: FailStateProps) {
            super(StateType.Fail, props);
        }

        public isTerminal() {
            return true;
        }
    }

    export interface ParallelStateProps extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields, NextOrEndField {
        /**
         * An array of branches to execute in parallel.
         */
        branches: Branches
    }

    export class Branches extends PascalCaseJson {
        constructor(...branches: Branch[]) {
            super(branches);
        }

        public stateNames(): Array<string | Token> {
            const names: Array<string | Token> = [];
            this.props.branches.forEach((branch: Branch) => branch.stateNames().forEach(name => names.push(name)));
            return names;
        }
    }

    /**
     * Executes branches in parallel.
     *
     * {@link https://states-language.net/spec.html#parallel-state}
     */
    export class ParallelState extends BaseState {
        constructor(props: ParallelStateProps) {
            requireNextOrEnd(props);
            super(StateType.Parallel, props);
        }

        public stateNames(): Array<string | Token> {
            return this.props.branches.stateNames();
        }
    }
}