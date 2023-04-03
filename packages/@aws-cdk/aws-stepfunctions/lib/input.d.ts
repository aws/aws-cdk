/**
 * Type union for task classes that accept multiple types of payload
 */
export declare class TaskInput {
    readonly type: InputType;
    readonly value: any;
    /**
     * Use a literal string as task input
     *
     * This might be a JSON-encoded object, or just a text.
     */
    static fromText(text: string): TaskInput;
    /**
     * Use an object as task input
     *
     * This object may contain JSON path fields as object values, if desired.
     */
    static fromObject(obj: {
        [key: string]: any;
    }): TaskInput;
    /**
     * Use a part of the execution data or task context as task input
     *
     * Use this when you want to use a subobject or string from
     * the current state machine execution or the current task context
     * as complete payload to a task.
     */
    static fromJsonPathAt(path: string): TaskInput;
    /**
     * Use a part of the execution data as task input
     *
     * Use this when you want to use a subobject or string from
     * the current state machine execution as complete payload
     * to a task.
     *
     * @deprecated Use `fromJsonPathAt`.
     */
    static fromDataAt(path: string): TaskInput;
    /**
     * Use a part of the task context as task input
     *
     * Use this when you want to use a subobject or string from
     * the current task context as complete payload
     * to a task.
     *
     * @deprecated Use `fromJsonPathAt`.
     */
    static fromContextAt(path: string): TaskInput;
    /**
     *
     * @param type type of task input
     * @param value payload for the corresponding input type.
     * It can be a JSON-encoded object, context, data, etc.
     */
    private constructor();
}
/**
 * The type of task input
 */
export declare enum InputType {
    /**
     * Use a literal string
     * This might be a JSON-encoded object, or just text.
     * valid JSON text: standalone, quote-delimited strings; objects; arrays; numbers; Boolean values; and null.
     *
     * example: `literal string`
     * example: {"json": "encoded"}
     */
    TEXT = 0,
    /**
     * Use an object which may contain Data and Context fields
     * as object values, if desired.
     *
     * example:
     * {
     *  literal: 'literal',
     *  SomeInput: sfn.JsonPath.stringAt('$.someField')
     * }
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-data.html
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/input-output-contextobject.html
     */
    OBJECT = 1
}
