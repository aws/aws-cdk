import { IResolvable, IResolveContext } from '@aws-cdk/core';
import { IRule } from './rule-ref';
/**
 * The input to send to the event target
 */
export declare abstract class RuleTargetInput {
    /**
     * Pass text to the event target
     *
     * May contain strings returned by `EventField.from()` to substitute in parts of the
     * matched event.
     *
     * The Rule Target input value will be a single string: the string you pass
     * here.  Do not use this method to pass a complex value like a JSON object to
     * a Rule Target.  Use `RuleTargetInput.fromObject()` instead.
     */
    static fromText(text: string): RuleTargetInput;
    /**
     * Pass text to the event target, splitting on newlines.
     *
     * This is only useful when passing to a target that does not
     * take a single argument.
     *
     * May contain strings returned by `EventField.from()` to substitute in parts
     * of the matched event.
     */
    static fromMultilineText(text: string): RuleTargetInput;
    /**
     * Pass a JSON object to the event target
     *
     * May contain strings returned by `EventField.from()` to substitute in parts of the
     * matched event.
     */
    static fromObject(obj: any): RuleTargetInput;
    /**
     * Take the event target input from a path in the event JSON
     */
    static fromEventPath(path: string): RuleTargetInput;
    protected constructor();
    /**
     * Return the input properties for this input object
     */
    abstract bind(rule: IRule): RuleTargetInputProperties;
}
/**
 * The input properties for an event target
 */
export interface RuleTargetInputProperties {
    /**
     * Literal input to the target service (must be valid JSON)
     *
     * @default - input for the event target. If the input contains a paths map
     *   values wil be extracted from event and inserted into the `inputTemplate`.
     */
    readonly input?: string;
    /**
     * JsonPath to take input from the input event
     *
     * @default - None. The entire matched event is passed as input
     */
    readonly inputPath?: string;
    /**
     * Input template to insert paths map into
     *
     * @default - None.
     */
    readonly inputTemplate?: string;
    /**
     * Paths map to extract values from event and insert into `inputTemplate`
     *
     * @default - No values extracted from event.
     */
    readonly inputPathsMap?: {
        [key: string]: string;
    };
}
/**
 * Represents a field in the event pattern
 */
export declare class EventField implements IResolvable {
    readonly path: string;
    /**
     * Extract the event ID from the event
     */
    static get eventId(): string;
    /**
     * Extract the detail type from the event
     */
    static get detailType(): string;
    /**
     * Extract the source from the event
     */
    static get source(): string;
    /**
     * Extract the account from the event
     */
    static get account(): string;
    /**
     * Extract the time from the event
     */
    static get time(): string;
    /**
     * Extract the region from the event
     */
    static get region(): string;
    /**
     * Extract a custom JSON path from the event
     */
    static fromPath(path: string): string;
    /**
     * Human readable display hint about the event pattern
     */
    readonly displayHint: string;
    readonly creationStack: string[];
    /**
     *
     * @param path the path to a field in the event pattern
     */
    private constructor();
    resolve(_ctx: IResolveContext): any;
    toString(): string;
    /**
     * Convert the path to the field in the event pattern to JSON
     */
    toJSON(): string;
}
