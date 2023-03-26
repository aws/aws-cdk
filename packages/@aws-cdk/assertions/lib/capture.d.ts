import { Matcher, MatchResult } from './matcher';
/**
 * Capture values while matching templates.
 * Using an instance of this class within a Matcher will capture the matching value.
 * The `as*()` APIs on the instance can be used to get the captured value.
 */
export declare class Capture extends Matcher {
    private readonly pattern?;
    readonly name: string;
    /** @internal */
    _captured: any[];
    private idx;
    /**
     * Initialize a new capture
     * @param pattern a nested pattern or Matcher.
     * If a nested pattern is provided `objectLike()` matching is applied.
     */
    constructor(pattern?: any);
    test(actual: any): MatchResult;
    /**
     * When multiple results are captured, move the iterator to the next result.
     * @returns true if another capture is present, false otherwise
     */
    next(): boolean;
    /**
     * Retrieve the captured value as a string.
     * An error is generated if no value is captured or if the value is not a string.
     */
    asString(): string;
    /**
     * Retrieve the captured value as a number.
     * An error is generated if no value is captured or if the value is not a number.
     */
    asNumber(): number;
    /**
     * Retrieve the captured value as a boolean.
     * An error is generated if no value is captured or if the value is not a boolean.
     */
    asBoolean(): boolean;
    /**
     * Retrieve the captured value as an array.
     * An error is generated if no value is captured or if the value is not an array.
     */
    asArray(): any[];
    /**
     * Retrieve the captured value as a JSON object.
     * An error is generated if no value is captured or if the value is not an object.
     */
    asObject(): {
        [key: string]: any;
    };
    private validate;
    private reportIncorrectType;
}
