import { Capture } from './capture';
/**
 * Represents a matcher that can perform special data matching
 * capabilities between a given pattern and a target.
 */
export declare abstract class Matcher {
    /**
     * Check whether the provided object is a subtype of the `IMatcher`.
     */
    static isMatcher(x: any): x is Matcher;
    /**
     * A name for the matcher. This is collected as part of the result and may be presented to the user.
     */
    abstract readonly name: string;
    /**
     * Test whether a target matches the provided pattern.
     * Every Matcher must implement this method.
     * This method will be invoked by the assertions framework. Do not call this method directly.
     * @param actual the target to match
     * @return the list of match failures. An empty array denotes a successful match.
     */
    abstract test(actual: any): MatchResult;
}
/**
 * Match failure details
 */
export interface MatchFailure {
    /**
     * The matcher that had the failure
     */
    readonly matcher: Matcher;
    /**
     * The relative path in the target where the failure occurred.
     * If the failure occurred at root of the match tree, set the path to an empty list.
     * If it occurs in the 5th index of an array nested within the 'foo' key of an object,
     * set the path as `['/foo', '[5]']`.
     */
    readonly path: string[];
    /**
     * Failure message
     */
    readonly message: string;
    /**
     * The cost of this particular mismatch
     *
     * @default 1
     */
    readonly cost?: number;
}
/**
 * Information about a value captured during match
 */
export interface MatchCapture {
    /**
     * The instance of Capture class to which this capture is associated with.
     */
    readonly capture: Capture;
    /**
     * The value that was captured
     */
    readonly value: any;
}
/**
 * The result of `Match.test()`.
 */
export declare class MatchResult {
    /**
     * The target for which this result was generated.
     */
    readonly target: any;
    private readonly failuresHere;
    private readonly captures;
    private finalized;
    private readonly innerMatchFailures;
    private _hasFailed;
    private _failCount;
    private _cost;
    constructor(target: any);
    /**
     * DEPRECATED
     * @deprecated use recordFailure()
     */
    push(matcher: Matcher, path: string[], message: string): this;
    /**
     * Record a new failure into this result at a specific path.
     */
    recordFailure(failure: MatchFailure): this;
    /** Whether the match is a success */
    get isSuccess(): boolean;
    /** Does the result contain any failures. If not, the result is a success */
    hasFailed(): boolean;
    /** The number of failures */
    get failCount(): number;
    /** The cost of the failures so far */
    get failCost(): number;
    /**
     * Compose the results of a previous match as a subtree.
     * @param id the id of the parent tree.
     */
    compose(id: string, inner: MatchResult): this;
    /**
     * Prepare the result to be analyzed.
     * This API *must* be called prior to analyzing these results.
     */
    finished(): this;
    /**
     * Render the failed match in a presentable way
     *
     * Prefer using `renderMismatch` over this method. It is left for backwards
     * compatibility for test suites that expect it, but `renderMismatch()` will
     * produce better output.
     */
    toHumanStrings(): string[];
    /**
     * Do a deep render of the match result, showing the structure mismatches in context
     */
    renderMismatch(): string;
    /**
     * Record a capture against in this match result.
     */
    recordCapture(options: MatchCapture): void;
}
