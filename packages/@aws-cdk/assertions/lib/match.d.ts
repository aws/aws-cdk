import { Matcher } from './matcher';
/**
 * Partial and special matching during template assertions.
 */
export declare abstract class Match {
    /**
     * Use this matcher in the place of a field's value, if the field must not be present.
     */
    static absent(): Matcher;
    /**
     * Matches the specified pattern with the array found in the same relative path of the target.
     * The set of elements (or matchers) must be in the same order as would be found.
     * @param pattern the pattern to match
     */
    static arrayWith(pattern: any[]): Matcher;
    /**
     * Matches the specified pattern with the array found in the same relative path of the target.
     * The set of elements (or matchers) must match exactly and in order.
     * @param pattern the pattern to match
     */
    static arrayEquals(pattern: any[]): Matcher;
    /**
     * Deep exact matching of the specified pattern to the target.
     * @param pattern the pattern to match
     */
    static exact(pattern: any): Matcher;
    /**
     * Matches the specified pattern to an object found in the same relative path of the target.
     * The keys and their values (or matchers) must be present in the target but the target can be a superset.
     * @param pattern the pattern to match
     */
    static objectLike(pattern: {
        [key: string]: any;
    }): Matcher;
    /**
     * Matches the specified pattern to an object found in the same relative path of the target.
     * The keys and their values (or matchers) must match exactly with the target.
     * @param pattern the pattern to match
     */
    static objectEquals(pattern: {
        [key: string]: any;
    }): Matcher;
    /**
     * Matches any target which does NOT follow the specified pattern.
     * @param pattern the pattern to NOT match
     */
    static not(pattern: any): Matcher;
    /**
     * Matches any string-encoded JSON and applies the specified pattern after parsing it.
     * @param pattern the pattern to match after parsing the encoded JSON.
     */
    static serializedJson(pattern: any): Matcher;
    /**
     * Matches any non-null value at the target.
     */
    static anyValue(): Matcher;
    /**
     * Matches targets according to a regular expression
     */
    static stringLikeRegexp(pattern: string): Matcher;
}
