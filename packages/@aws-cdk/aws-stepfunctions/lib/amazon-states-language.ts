import { Token, tokenAwareJsonify } from "@aws-cdk/core";
import { isArray, isObject } from "util";
import { requireOneOf } from "./util";

// tslint:disable:variable-name
export namespace amazon_states_language {
    function requireNextOrEnd(props: any) {
        requireOneOf(props, ['next', 'end']);
    }

    // tslint:disable-next-line:no-shadowed-variable
    function toPascalCase(x: string) {
        return x[0].toUpperCase() + x.substring(1);
    }

    export class Jsonable {
        protected readonly props: any;

        constructor(props: any) {
            this.props = props;
        }

        public toJson() {
            return this.toJsonRecursive(this.props);
        }

        private toJsonRecursive(obj: any) {
            const output: { [index: string]: any } = {};
            for (const key of Object.keys(obj)) {
                const current = obj[key];
                const pascalKey = toPascalCase(key);
                if (current instanceof Jsonable) {
                    output[pascalKey] = current.toJson();
                } else if (isObject(current) || isArray(current)) {
                    output[pascalKey] = this.toJsonRecursive(current);
                } else {
                    output[pascalKey] = current;
                }
            }
            return output;
        }
    }

    export interface Commentable {
        comment?: string | Token
    }

    export interface Branch extends Commentable {
        states: { [name: string]: State },
        startAt: string | Token
    }

    export interface StateMachineProps extends Branch {
        version?: string | Token,
        timeoutSeconds?: number
    }

    export class StateMachine extends Jsonable {
        constructor(props: StateMachineProps) {
            if (!(props.startAt in props.states)) {
                throw new Error(`Specified startAt state '${props.startAt}' does not exist in states map`);
            }
            if (props.timeoutSeconds !== undefined && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error("timeoutSeconds must be an integer");
            }
            if (Object.keys(props.states).filter(n => n.length > 128).length > 0) {
                throw new Error("State names must be less than 128 characters in length");
            }
            super(props);
        }

        public definitionString() {
            return tokenAwareJsonify(this.toJson());
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

    export class State extends Jsonable {
        constructor(type: StateType, props: any) {
            super({ ...props, ...{type}});
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

    export interface WithErrors {
        errorEquals: string[];
    }

    export interface Retrier extends WithErrors {
        intervalseconds?: number;
        maxAttempts?: number;
        backoffRate?: number;
    }

    export type Catcher = WithErrors | ResultPathField | NextField;

    export interface RetryCatchFields {
        retry?: Retrier[];
        catch?: Catcher[];
    }

    export interface PassStateProps extends Commentable, InputOutputPathFields, ResultPathField, NextOrEndField {
        result?: any;
    }

    export class PassState extends State {
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

    export class TaskState extends State {
        constructor(props: TaskStateProps) {
            if (props.timeoutSeconds !== undefined && !Number.isInteger(props.timeoutSeconds)) {
                throw new Error(`timeoutSeconds must be an integer, not '${props.timeoutSeconds}'`);
            }
            if (props.heartbeatSeconds !== undefined && !Number.isInteger(props.heartbeatSeconds)) {
                throw new Error(`heartbeatSeconds must be an integer, not '${props.heartbeatSeconds}'`);
            }
            if (props.timeoutSeconds !== undefined && props.heartbeatSeconds !== undefined && props.heartbeatSeconds >= props.timeoutSeconds) {
                throw new Error("heartbeatSeconds must be smaller than timeoutSeconds");
            }
            requireNextOrEnd(props);
            super(StateType.Task, props);
        }
    }

    export interface WaitStateProps extends Commentable, InputOutputPathFields {
        seconds?: number
        secondsPath?: string,
        timestamp?: string,
        timestampPath?: string
    }

    export class WaitState extends State {
        constructor(props: WaitStateProps) {
            requireOneOf(props, ['seconds', 'secondsPath', 'timestamp', 'timestampPath']);
            super(StateType.Wait, props);
        }
    }

    export interface SucceedStateProps extends Commentable, InputOutputPathFields {
    }

    export class SucceedState extends State {
        constructor(props: SucceedStateProps) {
            super(StateType.Succeed, props);
        }
    }

    export interface FailStateProps extends State, Commentable {
        error: string | ErrorCode,
        cause: string
    }

    export class FailState extends State {
        constructor(props: FailStateProps) {
            super(StateType.Fail, props);
        }
    }

    // export class ChoiceRules extends Jsonable {
    //     private readonly choices: ChoiceRule[];

    //     constructor(...choices: ChoiceRule[]) {
    //         super(null);
    //         this.choices = choices;
    //     }

    //     public toJson() {
    //         return this.choices;
    //         // return this.choices.map(choiceRule => choiceRule.toJson());
    //     }
    // }

    // export interface ChoiceStateProps extends Commentable, InputOutputPathFields {
    //     choices: ChoiceRules;
    //     default?: string;
    // }

    // export class ChoiceState extends State {
    //     constructor(props: ChoiceStateProps) {
    //         super(StateType.Choice, props);
    //     }
    // }

    // export enum ComparisonOperator {
    //     StringEquals,
    //     StringLessThan,
    //     StringGreaterThan,
    //     StringLessThanEquals,
    //     StringGreaterThanEquals,
    //     NumericEquals,
    //     NumericLessThan,
    //     NumericGreaterThan,
    //     NumericLessThanEquals,
    //     NumericGreaterThanEquals,
    //     BooleanEquals,
    //     TimestampEquals,
    //     TimestampLessThan,
    //     TimestampGreaterThan,
    //     TimestampLessThanEquals,
    //     TimestampGreaterThanEquals,
    //     And,
    //     Or,
    //     Not
    // }

    // export interface ComparisonOperationProps {
    //     comparisonOperator: ComparisonOperator,
    //     value: string | number | boolean | ComparisonOperator[]
    // }

    // export abstract class ComparisonOperation extends Jsonable {

    // }

    // export interface BaseVariableComparisonOperationProps {
    //     comparisonOperator: ComparisonOperator,
    //     value: string | number | boolean,
    //     variable: string
    // }

    // export interface VariableComparisonOperationProps<T> {
    //     value: T,
    //     variable: string
    // }

    // export abstract class VariableComparisonOperation extends ComparisonOperation {
    //     protected readonly props: BaseVariableComparisonOperationProps;

    //     constructor(props: BaseVariableComparisonOperationProps) {
    //         super(null);
    //         this.props = props;
    //     }

    //     public toJson(): any {
    //         return {
    //             [this.props.comparisonOperator]: this.props.value,
    //             variable: this.props.variable
    //         };
    //     }
    // }

    // export class StringEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.StringEquals}});
    //     }
    // }

    // export class StringLessThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThan}});
    //     }
    // }

    // export class StringGreaterThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThan}});
    //     }
    // }

    // export class StringLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.StringLessThanEquals}});
    //     }
    // }

    // export class StringGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.StringGreaterThanEquals}});
    //     }
    // }

    // export class NumericEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<number>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.NumericEquals}});
    //     }
    // }

    // export class NumericLessThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<number>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThan}});
    //     }
    // }

    // export class NumericGreaterThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<number>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThan}});
    //     }
    // }

    // export class NumericLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<number>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.NumericLessThanEquals}});
    //     }
    // }

    // export class NumericGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<number>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.NumericGreaterThanEquals}});
    //     }
    // }

    // export class BooleanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<boolean>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.BooleanEquals}});
    //     }
    // }

    // export class TimestampEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.TimestampEquals}});
    //     }
    // }

    // export class TimestampLessThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThan}});
    //     }
    // }

    // export class TimestampGreaterThanComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.TimestampGreaterThan}});
    //     }
    // }

    // export class TimestampLessThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.TimestampLessThanEquals}});
    //     }
    // }

    // export class TimestampGreaterThanEqualsComparisonOperation extends VariableComparisonOperation {
    //     constructor(props: VariableComparisonOperationProps<string>) {
    //         super({...props, ...{comparisonOperator: ComparisonOperator.TimestampGreaterThanEquals}});
    //     }
    // }

    // export interface ArrayComparisonOperationProps {
    //     comparisonOperator: ComparisonOperator,
    //     comparisonOperations: ComparisonOperation[]
    // }

    // // export abstract class ArrayComparisonOperation extends ComparisonOperation {
    // //     protected readonly props: ArrayComparisonOperationProps;

    // //     constructor(props: ArrayComparisonOperationProps) {
    // //         super(null);
    // //         this.props = props;
    // //     }

    // //     public toJson() {
    // //         return {
    // //             // [this.props.comparisonOperator]: this.props.comparisonOperations.map(comparisonOperation => comparisonOperation.toJson())
    // //         };
    // //     }
    // // }

    // // export class AndComparisonOperation extends ArrayComparisonOperation {
    // //     constructor(...comparisonOperations: ComparisonOperation[]) {
    // //         super({ comparisonOperator: ComparisonOperator.And, comparisonOperations});
    // //     }
    // // }

    // // export class OrComparisonOperation extends ArrayComparisonOperation {
    // //     constructor(...comparisonOperations: ComparisonOperation[]) {
    // //         super({ comparisonOperator: ComparisonOperator.Or, comparisonOperations});
    // //     }
    // // }

    // // export class NotComparisonOperation extends ComparisonOperation {
    // //     protected readonly comparisonOperation: ComparisonOperation;

    // //     constructor(comparisonOperation: ComparisonOperation) {
    // //         super(null);
    // //         this.comparisonOperation = comparisonOperation;
    // //     }

    // //     public toJson() {
    // //         return {
    // //             [ComparisonOperator.Not]: this.comparisonOperation.toJson()
    // //         };
    // //     }
    // // }

    // export interface ChoiceRuleProps extends NextField {
    //     comparisonOperation: ComparisonOperation;
    // }

    // export class ChoiceRule extends Jsonable {
    //     protected readonly props: ChoiceRuleProps;

    //     constructor(props: ChoiceRuleProps) {
    //         super(null);
    //         this.props = props;
    //     }

    //     public toJson() {
    //         return {
    //             // ...this.props.comparisonOperation.toJson(),
    //             // ...{next: this.props.next}
    //         };
    //     }
    // }

    export interface ParallelStateProps extends Commentable, InputOutputPathFields, ResultPathField, RetryCatchFields, NextOrEndField {
        branches: Branch[]
    }

    export class ParallelState extends State {
        constructor(props: ParallelStateProps) {
            requireNextOrEnd(props);
            super(StateType.Parallel, props);
        }
    }
}