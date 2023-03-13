import { InspectionFailure, PropertyMatcher } from './have-resource';
/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Only does lenient matching one level deep, at the next level all objects must declare the
 * exact expected keys again.
 */
export declare function objectLike<A extends object>(pattern: A): PropertyMatcher;
/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Switches to "deep" lenient matching. Nested objects also only need to contain declared keys.
 */
export declare function deepObjectLike<A extends object>(pattern: A): PropertyMatcher;
/**
 * Match exactly the given value
 *
 * This is the default, you only need this to escape from the deep lenient matching
 * of `deepObjectLike`.
 */
export declare function exactValue(expected: any): PropertyMatcher;
/**
 * A matcher for a list that contains all of the given elements in any order
 */
export declare function arrayWith(...elements: any[]): PropertyMatcher;
/**
 * Helper function to make matcher failure reporting a little easier
 *
 * Our protocol is weird (change a string on a passed-in object and return 'false'),
 * but I don't want to change that right now.
 */
export declare function failMatcher(inspection: InspectionFailure, error: string): boolean;
/**
 * Match a given literal value against a matcher
 *
 * If the matcher is a callable, use that to evaluate the value. Otherwise, the values
 * must be literally the same.
 */
export declare function match(value: any, matcher: any, inspection: InspectionFailure): boolean;
/**
 * Do a glob-like pattern match (which only supports *s). Supports multiline strings.
 */
export declare function stringLike(pattern: string): PropertyMatcher;
/**
 * Matches any value
 */
export declare function anything(): PropertyMatcher;
/**
 * Negate an inner matcher
 */
export declare function notMatching(matcher: any): PropertyMatcher;
export declare type TypeValidator<T> = (x: any) => x is T;
/**
 * Captures a value onto an object if it matches a given inner matcher
 *
 * @example
 *
 * const someValue = Capture.aString();
 * expect(stack).toHaveResource({
 *    // ...
 *    Value: someValue.capture(stringMatching('*a*')),
 * });
 * console.log(someValue.capturedValue);
 */
export declare class Capture<T = any> {
    private readonly typeValidator?;
    /**
     * A Capture object that captures any type
     */
    static anyType(): Capture<any>;
    /**
     * A Capture object that captures a string type
     */
    static aString(): Capture<string>;
    /**
     * A Capture object that captures a custom type
     */
    static a<T>(validator: TypeValidator<T>): Capture<T>;
    private _value?;
    private _didCapture;
    private _wasInvoked;
    protected constructor(typeValidator?: TypeValidator<T> | undefined);
    /**
     * Capture the value if the inner matcher successfully matches it
     *
     * If no matcher is given, `anything()` is assumed.
     *
     * And exception will be thrown if the inner matcher returns `true` and
     * the value turns out to be of a different type than the `Capture` object
     * is expecting.
     */
    capture(matcher?: any): PropertyMatcher;
    /**
     * Whether a value was successfully captured
     */
    get didCapture(): boolean;
    /**
     * Return the value that was captured
     *
     * Throws an exception if now value was captured
     */
    get capturedValue(): T;
}
/**
 * Match on the innards of a JSON string, instead of the complete string
 */
export declare function encodedJson(matcher: any): PropertyMatcher;
/**
 * Make a matcher out of the given argument if it's not a matcher already
 *
 * If it's not a matcher, it will be treated as a literal.
 */
export declare function matcherFrom(matcher: any): PropertyMatcher;
/**
 * Annotate a matcher with toJSON
 *
 * We will JSON.stringify() values if we have a match failure, but for matchers this
 * would show (in traditional JS fashion) something like '[function Function]', or more
 * accurately nothing at all since functions cannot be JSONified.
 *
 * We override to JSON() in order to produce a readable version of the matcher.
 */
export declare function annotateMatcher<A extends object>(how: A, matcher: PropertyMatcher): PropertyMatcher;
