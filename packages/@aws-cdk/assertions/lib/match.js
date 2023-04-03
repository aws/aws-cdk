"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const matcher_1 = require("./matcher");
const absent_1 = require("./private/matchers/absent");
const sorting_1 = require("./private/sorting");
const sparse_matrix_1 = require("./private/sparse-matrix");
const type_1 = require("./private/type");
/**
 * Partial and special matching during template assertions.
 */
class Match {
    /**
     * Use this matcher in the place of a field's value, if the field must not be present.
     */
    static absent() {
        return new absent_1.AbsentMatch('absent');
    }
    /**
     * Matches the specified pattern with the array found in the same relative path of the target.
     * The set of elements (or matchers) must be in the same order as would be found.
     * @param pattern the pattern to match
     */
    static arrayWith(pattern) {
        return new ArrayMatch('arrayWith', pattern);
    }
    /**
     * Matches the specified pattern with the array found in the same relative path of the target.
     * The set of elements (or matchers) must match exactly and in order.
     * @param pattern the pattern to match
     */
    static arrayEquals(pattern) {
        return new ArrayMatch('arrayEquals', pattern, { subsequence: false });
    }
    /**
     * Deep exact matching of the specified pattern to the target.
     * @param pattern the pattern to match
     */
    static exact(pattern) {
        return new LiteralMatch('exact', pattern, { partialObjects: false });
    }
    /**
     * Matches the specified pattern to an object found in the same relative path of the target.
     * The keys and their values (or matchers) must be present in the target but the target can be a superset.
     * @param pattern the pattern to match
     */
    static objectLike(pattern) {
        return new ObjectMatch('objectLike', pattern);
    }
    /**
     * Matches the specified pattern to an object found in the same relative path of the target.
     * The keys and their values (or matchers) must match exactly with the target.
     * @param pattern the pattern to match
     */
    static objectEquals(pattern) {
        return new ObjectMatch('objectEquals', pattern, { partial: false });
    }
    /**
     * Matches any target which does NOT follow the specified pattern.
     * @param pattern the pattern to NOT match
     */
    static not(pattern) {
        return new NotMatch('not', pattern);
    }
    /**
     * Matches any string-encoded JSON and applies the specified pattern after parsing it.
     * @param pattern the pattern to match after parsing the encoded JSON.
     */
    static serializedJson(pattern) {
        return new SerializedJson('serializedJson', pattern);
    }
    /**
     * Matches any non-null value at the target.
     */
    static anyValue() {
        return new AnyMatch('anyValue');
    }
    /**
     * Matches targets according to a regular expression
     */
    static stringLikeRegexp(pattern) {
        return new StringLikeRegexpMatch('stringLikeRegexp', pattern);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Match[_a] = { fqn: "@aws-cdk/assertions.Match", version: "0.0.0" };
exports.Match = Match;
/**
 * A Match class that expects the target to match with the pattern exactly.
 * The pattern may be nested with other matchers that are then deletegated to.
 */
class LiteralMatch extends matcher_1.Matcher {
    constructor(name, pattern, options = {}) {
        super();
        this.name = name;
        this.pattern = pattern;
        this.partialObjects = options.partialObjects ?? false;
        if (matcher_1.Matcher.isMatcher(this.pattern)) {
            throw new Error('LiteralMatch cannot directly contain another matcher. ' +
                'Remove the top-level matcher or nest it more deeply.');
        }
    }
    test(actual) {
        if (Array.isArray(this.pattern)) {
            return new ArrayMatch(this.name, this.pattern, { subsequence: false, partialObjects: this.partialObjects }).test(actual);
        }
        if (typeof this.pattern === 'object') {
            return new ObjectMatch(this.name, this.pattern, { partial: this.partialObjects }).test(actual);
        }
        const result = new matcher_1.MatchResult(actual);
        if (typeof this.pattern !== typeof actual) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Expected type ${typeof this.pattern} but received ${(0, type_1.getType)(actual)}`,
            });
            return result;
        }
        if (actual !== this.pattern) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Expected ${this.pattern} but received ${actual}`,
            });
        }
        return result;
    }
}
/**
 * Match class that matches arrays.
 */
class ArrayMatch extends matcher_1.Matcher {
    constructor(name, pattern, options = {}) {
        super();
        this.name = name;
        this.pattern = pattern;
        this.subsequence = options.subsequence ?? true;
        this.partialObjects = options.partialObjects ?? false;
    }
    test(actual) {
        if (!Array.isArray(actual)) {
            return new matcher_1.MatchResult(actual).recordFailure({
                matcher: this,
                path: [],
                message: `Expected type array but received ${(0, type_1.getType)(actual)}`,
            });
        }
        return this.subsequence ? this.testSubsequence(actual) : this.testFullArray(actual);
    }
    testFullArray(actual) {
        const result = new matcher_1.MatchResult(actual);
        let i = 0;
        for (; i < this.pattern.length && i < actual.length; i++) {
            const patternElement = this.pattern[i];
            const matcher = matcher_1.Matcher.isMatcher(patternElement)
                ? patternElement
                : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });
            const innerResult = matcher.test(actual[i]);
            result.compose(`${i}`, innerResult);
        }
        if (i < this.pattern.length) {
            result.recordFailure({
                matcher: this,
                message: `Not enough elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
                path: [`${i}`],
            });
        }
        if (i < actual.length) {
            result.recordFailure({
                matcher: this,
                message: `Too many elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
                path: [`${i}`],
            });
        }
        return result;
    }
    testSubsequence(actual) {
        const result = new matcher_1.MatchResult(actual);
        // For subsequences, there is a lot of testing and backtracking that happens
        // here, keep track of it all so we can report in a sensible amount of
        // detail on what we did if the match happens to fail.
        let patternIdx = 0;
        let actualIdx = 0;
        const matches = new sparse_matrix_1.SparseMatrix();
        while (patternIdx < this.pattern.length && actualIdx < actual.length) {
            const patternElement = this.pattern[patternIdx];
            const matcher = matcher_1.Matcher.isMatcher(patternElement)
                ? patternElement
                : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });
            const matcherName = matcher.name;
            if (matcherName == 'absent' || matcherName == 'anyValue') {
                // array subsequence matcher is not compatible with anyValue() or absent() matcher. They don't make sense to be used together.
                throw new Error(`The Matcher ${matcherName}() cannot be nested within arrayWith()`);
            }
            const innerResult = matcher.test(actual[actualIdx]);
            matches.set(patternIdx, actualIdx, innerResult);
            actualIdx++;
            if (innerResult.isSuccess) {
                result.compose(`${actualIdx}`, innerResult); // Record any captures
                patternIdx++;
            }
        }
        // If we haven't matched all patterns:
        // - Report on each one that did match on where it matched (perhaps it was wrong)
        // - Report the closest match for the failing one
        if (patternIdx < this.pattern.length) {
            // Succeeded Pattern Index
            for (let spi = 0; spi < patternIdx; spi++) {
                const foundMatch = matches.row(spi).find(([, r]) => r.isSuccess);
                if (!foundMatch) {
                    continue;
                } // Should never fail but let's be defensive
                const [index] = foundMatch;
                result.compose(`${index}`, new matcher_1.MatchResult(actual[index]).recordFailure({
                    matcher: this,
                    message: `arrayWith pattern ${spi} matched here`,
                    path: [],
                    cost: 0, // This is an informational message so it would be unfair to assign it cost
                }));
            }
            const failedMatches = matches.row(patternIdx);
            failedMatches.sort((0, sorting_1.sortKeyComparator)(([i, r]) => [r.failCost, i]));
            if (failedMatches.length > 0) {
                const [index, innerResult] = failedMatches[0];
                result.recordFailure({
                    matcher: this,
                    message: `Could not match arrayWith pattern ${patternIdx}. This is the closest match`,
                    path: [`${index}`],
                    cost: 0, //  Informational message
                });
                result.compose(`${index}`, innerResult);
            }
            else {
                // The previous matcher matched at the end of the pattern and we didn't even get to try anything
                result.recordFailure({
                    matcher: this,
                    message: `Could not match arrayWith pattern ${patternIdx}. No more elements to try`,
                    path: [`${actual.length}`],
                });
            }
        }
        return result;
    }
}
/**
 * Match class that matches objects.
 */
class ObjectMatch extends matcher_1.Matcher {
    constructor(name, pattern, options = {}) {
        super();
        this.name = name;
        this.pattern = pattern;
        this.partial = options.partial ?? true;
    }
    test(actual) {
        if (typeof actual !== 'object' || Array.isArray(actual)) {
            return new matcher_1.MatchResult(actual).recordFailure({
                matcher: this,
                path: [],
                message: `Expected type object but received ${(0, type_1.getType)(actual)}`,
            });
        }
        const result = new matcher_1.MatchResult(actual);
        if (!this.partial) {
            for (const a of Object.keys(actual)) {
                if (!(a in this.pattern)) {
                    result.recordFailure({
                        matcher: this,
                        path: [a],
                        message: `Unexpected key ${a}`,
                    });
                }
            }
        }
        for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
            if (!(patternKey in actual) && !(patternVal instanceof absent_1.AbsentMatch)) {
                result.recordFailure({
                    matcher: this,
                    path: [patternKey],
                    message: `Missing key '${patternKey}'`,
                });
                continue;
            }
            const matcher = matcher_1.Matcher.isMatcher(patternVal) ?
                patternVal :
                new LiteralMatch(this.name, patternVal, { partialObjects: this.partial });
            const inner = matcher.test(actual[patternKey]);
            result.compose(patternKey, inner);
        }
        return result;
    }
}
class SerializedJson extends matcher_1.Matcher {
    constructor(name, pattern) {
        super();
        this.name = name;
        this.pattern = pattern;
    }
    ;
    test(actual) {
        if ((0, type_1.getType)(actual) !== 'string') {
            return new matcher_1.MatchResult(actual).recordFailure({
                matcher: this,
                path: [],
                message: `Expected JSON as a string but found ${(0, type_1.getType)(actual)}`,
            });
        }
        let parsed;
        try {
            parsed = JSON.parse(actual);
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                return new matcher_1.MatchResult(actual).recordFailure({
                    matcher: this,
                    path: [],
                    message: `Invalid JSON string: ${actual}`,
                });
            }
            else {
                throw err;
            }
        }
        const matcher = matcher_1.Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
        const innerResult = matcher.test(parsed);
        if (innerResult.hasFailed()) {
            innerResult.recordFailure({
                matcher: this,
                path: [],
                message: 'Encoded JSON value does not match',
            });
        }
        return innerResult;
    }
}
class NotMatch extends matcher_1.Matcher {
    constructor(name, pattern) {
        super();
        this.name = name;
        this.pattern = pattern;
    }
    test(actual) {
        const matcher = matcher_1.Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
        const innerResult = matcher.test(actual);
        const result = new matcher_1.MatchResult(actual);
        if (innerResult.failCount === 0) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Found unexpected match: ${JSON.stringify(actual, undefined, 2)}`,
            });
        }
        return result;
    }
}
class AnyMatch extends matcher_1.Matcher {
    constructor(name) {
        super();
        this.name = name;
    }
    test(actual) {
        const result = new matcher_1.MatchResult(actual);
        if (actual == null) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: 'Expected a value but found none',
            });
        }
        return result;
    }
}
class StringLikeRegexpMatch extends matcher_1.Matcher {
    constructor(name, pattern) {
        super();
        this.name = name;
        this.pattern = pattern;
    }
    test(actual) {
        const result = new matcher_1.MatchResult(actual);
        const regex = new RegExp(this.pattern, 'gm');
        if (typeof actual !== 'string') {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Expected a string, but got '${typeof actual}'`,
            });
        }
        if (!regex.test(actual)) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `String '${actual}' did not match pattern '${this.pattern}'`,
            });
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVDQUFpRDtBQUNqRCxzREFBd0Q7QUFDeEQsK0NBQXNEO0FBQ3RELDJEQUF1RDtBQUN2RCx5Q0FBeUM7QUFFekM7O0dBRUc7QUFDSCxNQUFzQixLQUFLO0lBQ3pCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLG9CQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFjO1FBQ3BDLE9BQU8sSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBYztRQUN0QyxPQUFPLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN2RTtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBWTtRQUM5QixPQUFPLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN0RTtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQTZCO1FBQ3BELE9BQU8sSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBNkI7UUFDdEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDckU7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9B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QyxPQUFPLEdBQUc7YUFDdEUsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaGVyLCBNYXRjaFJlc3VsdCB9IGZyb20gJy4vbWF0Y2hlcic7XG5pbXBvcnQgeyBBYnNlbnRNYXRjaCB9IGZyb20gJy4vcHJpdmF0ZS9tYXRjaGVycy9hYnNlbnQnO1xuaW1wb3J0IHsgc29ydEtleUNvbXBhcmF0b3IgfSBmcm9tICcuL3ByaXZhdGUvc29ydGluZyc7XG5pbXBvcnQgeyBTcGFyc2VNYXRyaXggfSBmcm9tICcuL3ByaXZhdGUvc3BhcnNlLW1hdHJpeCc7XG5pbXBvcnQgeyBnZXRUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3R5cGUnO1xuXG4vKipcbiAqIFBhcnRpYWwgYW5kIHNwZWNpYWwgbWF0Y2hpbmcgZHVyaW5nIHRlbXBsYXRlIGFzc2VydGlvbnMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRjaCB7XG4gIC8qKlxuICAgKiBVc2UgdGhpcyBtYXRjaGVyIGluIHRoZSBwbGFjZSBvZiBhIGZpZWxkJ3MgdmFsdWUsIGlmIHRoZSBmaWVsZCBtdXN0IG5vdCBiZSBwcmVzZW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhYnNlbnQoKTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBBYnNlbnRNYXRjaCgnYWJzZW50Jyk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4gd2l0aCB0aGUgYXJyYXkgZm91bmQgaW4gdGhlIHNhbWUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgdGFyZ2V0LlxuICAgKiBUaGUgc2V0IG9mIGVsZW1lbnRzIChvciBtYXRjaGVycykgbXVzdCBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB3b3VsZCBiZSBmb3VuZC5cbiAgICogQHBhcmFtIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gbWF0Y2hcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXJyYXlXaXRoKHBhdHRlcm46IGFueVtdKTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBBcnJheU1hdGNoKCdhcnJheVdpdGgnLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB3aXRoIHRoZSBhcnJheSBmb3VuZCBpbiB0aGUgc2FtZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSB0YXJnZXQuXG4gICAqIFRoZSBzZXQgb2YgZWxlbWVudHMgKG9yIG1hdGNoZXJzKSBtdXN0IG1hdGNoIGV4YWN0bHkgYW5kIGluIG9yZGVyLlxuICAgKiBAcGFyYW0gcGF0dGVybiB0aGUgcGF0dGVybiB0byBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcnJheUVxdWFscyhwYXR0ZXJuOiBhbnlbXSk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgQXJyYXlNYXRjaCgnYXJyYXlFcXVhbHMnLCBwYXR0ZXJuLCB7IHN1YnNlcXVlbmNlOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWVwIGV4YWN0IG1hdGNoaW5nIG9mIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB0byB0aGUgdGFyZ2V0LlxuICAgKiBAcGFyYW0gcGF0dGVybiB0aGUgcGF0dGVybiB0byBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleGFjdChwYXR0ZXJuOiBhbnkpOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxNYXRjaCgnZXhhY3QnLCBwYXR0ZXJuLCB7IHBhcnRpYWxPYmplY3RzOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB0byBhbiBvYmplY3QgZm91bmQgaW4gdGhlIHNhbWUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgdGFyZ2V0LlxuICAgKiBUaGUga2V5cyBhbmQgdGhlaXIgdmFsdWVzIChvciBtYXRjaGVycykgbXVzdCBiZSBwcmVzZW50IGluIHRoZSB0YXJnZXQgYnV0IHRoZSB0YXJnZXQgY2FuIGJlIGEgc3VwZXJzZXQuXG4gICAqIEBwYXJhbSBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9iamVjdExpa2UocGF0dGVybjoge1trZXk6IHN0cmluZ106IGFueX0pOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdE1hdGNoKCdvYmplY3RMaWtlJywgcGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4gdG8gYW4gb2JqZWN0IGZvdW5kIGluIHRoZSBzYW1lIHJlbGF0aXZlIHBhdGggb2YgdGhlIHRhcmdldC5cbiAgICogVGhlIGtleXMgYW5kIHRoZWlyIHZhbHVlcyAob3IgbWF0Y2hlcnMpIG11c3QgbWF0Y2ggZXhhY3RseSB3aXRoIHRoZSB0YXJnZXQuXG4gICAqIEBwYXJhbSBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9iamVjdEVxdWFscyhwYXR0ZXJuOiB7W2tleTogc3RyaW5nXTogYW55fSk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgT2JqZWN0TWF0Y2goJ29iamVjdEVxdWFscycsIHBhdHRlcm4sIHsgcGFydGlhbDogZmFsc2UgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbnkgdGFyZ2V0IHdoaWNoIGRvZXMgTk9UIGZvbGxvdyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4uXG4gICAqIEBwYXJhbSBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIE5PVCBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3QocGF0dGVybjogYW55KTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBOb3RNYXRjaCgnbm90JywgcGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbnkgc3RyaW5nLWVuY29kZWQgSlNPTiBhbmQgYXBwbGllcyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4gYWZ0ZXIgcGFyc2luZyBpdC5cbiAgICogQHBhcmFtIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gbWF0Y2ggYWZ0ZXIgcGFyc2luZyB0aGUgZW5jb2RlZCBKU09OLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzZXJpYWxpemVkSnNvbihwYXR0ZXJuOiBhbnkpOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IFNlcmlhbGl6ZWRKc29uKCdzZXJpYWxpemVkSnNvbicsIHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgYW55IG5vbi1udWxsIHZhbHVlIGF0IHRoZSB0YXJnZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueVZhbHVlKCk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgQW55TWF0Y2goJ2FueVZhbHVlJyk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyB0YXJnZXRzIGFjY29yZGluZyB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdMaWtlUmVnZXhwKHBhdHRlcm46IHN0cmluZyk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgU3RyaW5nTGlrZVJlZ2V4cE1hdGNoKCdzdHJpbmdMaWtlUmVnZXhwJywgcGF0dGVybik7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSBgTGl0ZXJhbE1hdGNoYCBjbGFzcy5cbiAqL1xuaW50ZXJmYWNlIExpdGVyYWxNYXRjaE9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciBvYmplY3RzIG5lc3RlZCBhdCBhbnkgbGV2ZWwgc2hvdWxkIGJlIG1hdGNoZWQgcGFydGlhbGx5LlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGFydGlhbE9iamVjdHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgTWF0Y2ggY2xhc3MgdGhhdCBleHBlY3RzIHRoZSB0YXJnZXQgdG8gbWF0Y2ggd2l0aCB0aGUgcGF0dGVybiBleGFjdGx5LlxuICogVGhlIHBhdHRlcm4gbWF5IGJlIG5lc3RlZCB3aXRoIG90aGVyIG1hdGNoZXJzIHRoYXQgYXJlIHRoZW4gZGVsZXRlZ2F0ZWQgdG8uXG4gKi9cbmNsYXNzIExpdGVyYWxNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IHBhcnRpYWxPYmplY3RzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuOiBhbnksXG4gICAgb3B0aW9uczogTGl0ZXJhbE1hdGNoT3B0aW9ucyA9IHt9KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFydGlhbE9iamVjdHMgPSBvcHRpb25zLnBhcnRpYWxPYmplY3RzID8/IGZhbHNlO1xuXG4gICAgaWYgKE1hdGNoZXIuaXNNYXRjaGVyKHRoaXMucGF0dGVybikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGl0ZXJhbE1hdGNoIGNhbm5vdCBkaXJlY3RseSBjb250YWluIGFub3RoZXIgbWF0Y2hlci4gJyArXG4gICAgICAgICdSZW1vdmUgdGhlIHRvcC1sZXZlbCBtYXRjaGVyIG9yIG5lc3QgaXQgbW9yZSBkZWVwbHkuJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5wYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdGNoKHRoaXMubmFtZSwgdGhpcy5wYXR0ZXJuLCB7IHN1YnNlcXVlbmNlOiBmYWxzZSwgcGFydGlhbE9iamVjdHM6IHRoaXMucGFydGlhbE9iamVjdHMgfSkudGVzdChhY3R1YWwpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5wYXR0ZXJuID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIG5ldyBPYmplY3RNYXRjaCh0aGlzLm5hbWUsIHRoaXMucGF0dGVybiwgeyBwYXJ0aWFsOiB0aGlzLnBhcnRpYWxPYmplY3RzIH0pLnRlc3QoYWN0dWFsKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcbiAgICBpZiAodHlwZW9mIHRoaXMucGF0dGVybiAhPT0gdHlwZW9mIGFjdHVhbCkge1xuICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIHR5cGUgJHt0eXBlb2YgdGhpcy5wYXR0ZXJufSBidXQgcmVjZWl2ZWQgJHtnZXRUeXBlKGFjdHVhbCl9YCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoYWN0dWFsICE9PSB0aGlzLnBhdHRlcm4pIHtcbiAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgcGF0aDogW10sXG4gICAgICAgIG1lc3NhZ2U6IGBFeHBlY3RlZCAke3RoaXMucGF0dGVybn0gYnV0IHJlY2VpdmVkICR7YWN0dWFsfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGluaXRpYWxpemluZyB0aGUgYEFycmF5TWF0Y2hgIGNsYXNzLlxuICovXG5pbnRlcmZhY2UgQXJyYXlNYXRjaE9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgcGF0dGVybiBpcyBhIHN1YnNlcXVlbmNlIG9mIHRoZSB0YXJnZXQuXG4gICAqIEEgc3Vic2VxdWVuY2UgaXMgYSBzZXF1ZW5jZSB0aGF0IGNhbiBiZSBkZXJpdmVkIGZyb20gYW5vdGhlciBzZXF1ZW5jZSBieSBkZWxldGluZ1xuICAgKiBzb21lIG9yIG5vIGVsZW1lbnRzIHdpdGhvdXQgY2hhbmdpbmcgdGhlIG9yZGVyIG9mIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHN1YnNlcXVlbmNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjb250aW51ZSBtYXRjaGluZyBvYmplY3RzIGluc2lkZSB0aGUgYXJyYXkgcGFydGlhbGx5XG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwYXJ0aWFsT2JqZWN0cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTWF0Y2ggY2xhc3MgdGhhdCBtYXRjaGVzIGFycmF5cy5cbiAqL1xuY2xhc3MgQXJyYXlNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IHN1YnNlcXVlbmNlOiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IHBhcnRpYWxPYmplY3RzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuOiBhbnlbXSxcbiAgICBvcHRpb25zOiBBcnJheU1hdGNoT3B0aW9ucyA9IHt9KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3Vic2VxdWVuY2UgPSBvcHRpb25zLnN1YnNlcXVlbmNlID8/IHRydWU7XG4gICAgdGhpcy5wYXJ0aWFsT2JqZWN0cyA9IG9wdGlvbnMucGFydGlhbE9iamVjdHMgPz8gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWN0dWFsKSkge1xuICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpLnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIHR5cGUgYXJyYXkgYnV0IHJlY2VpdmVkICR7Z2V0VHlwZShhY3R1YWwpfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzZXF1ZW5jZSA/IHRoaXMudGVzdFN1YnNlcXVlbmNlKGFjdHVhbCkgOiB0aGlzLnRlc3RGdWxsQXJyYXkoYWN0dWFsKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVzdEZ1bGxBcnJheShhY3R1YWw6IEFycmF5PGFueT4pOiBNYXRjaFJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yICg7IGkgPCB0aGlzLnBhdHRlcm4ubGVuZ3RoICYmIGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhdHRlcm5FbGVtZW50ID0gdGhpcy5wYXR0ZXJuW2ldO1xuICAgICAgY29uc3QgbWF0Y2hlciA9IE1hdGNoZXIuaXNNYXRjaGVyKHBhdHRlcm5FbGVtZW50KVxuICAgICAgICA/IHBhdHRlcm5FbGVtZW50XG4gICAgICAgIDogbmV3IExpdGVyYWxNYXRjaCh0aGlzLm5hbWUsIHBhdHRlcm5FbGVtZW50LCB7IHBhcnRpYWxPYmplY3RzOiB0aGlzLnBhcnRpYWxPYmplY3RzIH0pO1xuXG4gICAgICBjb25zdCBpbm5lclJlc3VsdCA9IG1hdGNoZXIudGVzdChhY3R1YWxbaV0pO1xuICAgICAgcmVzdWx0LmNvbXBvc2UoYCR7aX1gLCBpbm5lclJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKGkgPCB0aGlzLnBhdHRlcm4ubGVuZ3RoKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIG1lc3NhZ2U6IGBOb3QgZW5vdWdoIGVsZW1lbnRzIGluIGFycmF5IChleHBlY3RpbmcgJHt0aGlzLnBhdHRlcm4ubGVuZ3RofSwgZ290ICR7YWN0dWFsLmxlbmd0aH0pYCxcbiAgICAgICAgcGF0aDogW2Ake2l9YF0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGkgPCBhY3R1YWwubGVuZ3RoKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIG1lc3NhZ2U6IGBUb28gbWFueSBlbGVtZW50cyBpbiBhcnJheSAoZXhwZWN0aW5nICR7dGhpcy5wYXR0ZXJuLmxlbmd0aH0sIGdvdCAke2FjdHVhbC5sZW5ndGh9KWAsXG4gICAgICAgIHBhdGg6IFtgJHtpfWBdLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgdGVzdFN1YnNlcXVlbmNlKGFjdHVhbDogQXJyYXk8YW55Pik6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcblxuICAgIC8vIEZvciBzdWJzZXF1ZW5jZXMsIHRoZXJlIGlzIGEgbG90IG9mIHRlc3RpbmcgYW5kIGJhY2t0cmFja2luZyB0aGF0IGhhcHBlbnNcbiAgICAvLyBoZXJlLCBrZWVwIHRyYWNrIG9mIGl0IGFsbCBzbyB3ZSBjYW4gcmVwb3J0IGluIGEgc2Vuc2libGUgYW1vdW50IG9mXG4gICAgLy8gZGV0YWlsIG9uIHdoYXQgd2UgZGlkIGlmIHRoZSBtYXRjaCBoYXBwZW5zIHRvIGZhaWwuXG5cbiAgICBsZXQgcGF0dGVybklkeCA9IDA7XG4gICAgbGV0IGFjdHVhbElkeCA9IDA7XG4gICAgY29uc3QgbWF0Y2hlcyA9IG5ldyBTcGFyc2VNYXRyaXg8TWF0Y2hSZXN1bHQ+KCk7XG5cbiAgICB3aGlsZSAocGF0dGVybklkeCA8IHRoaXMucGF0dGVybi5sZW5ndGggJiYgYWN0dWFsSWR4IDwgYWN0dWFsLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGF0dGVybkVsZW1lbnQgPSB0aGlzLnBhdHRlcm5bcGF0dGVybklkeF07XG5cbiAgICAgIGNvbnN0IG1hdGNoZXIgPSBNYXRjaGVyLmlzTWF0Y2hlcihwYXR0ZXJuRWxlbWVudClcbiAgICAgICAgPyBwYXR0ZXJuRWxlbWVudFxuICAgICAgICA6IG5ldyBMaXRlcmFsTWF0Y2godGhpcy5uYW1lLCBwYXR0ZXJuRWxlbWVudCwgeyBwYXJ0aWFsT2JqZWN0czogdGhpcy5wYXJ0aWFsT2JqZWN0cyB9KTtcblxuICAgICAgY29uc3QgbWF0Y2hlck5hbWUgPSBtYXRjaGVyLm5hbWU7XG4gICAgICBpZiAobWF0Y2hlck5hbWUgPT0gJ2Fic2VudCcgfHwgbWF0Y2hlck5hbWUgPT0gJ2FueVZhbHVlJykge1xuICAgICAgICAvLyBhcnJheSBzdWJzZXF1ZW5jZSBtYXRjaGVyIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggYW55VmFsdWUoKSBvciBhYnNlbnQoKSBtYXRjaGVyLiBUaGV5IGRvbid0IG1ha2Ugc2Vuc2UgdG8gYmUgdXNlZCB0b2dldGhlci5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgTWF0Y2hlciAke21hdGNoZXJOYW1lfSgpIGNhbm5vdCBiZSBuZXN0ZWQgd2l0aGluIGFycmF5V2l0aCgpYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gbWF0Y2hlci50ZXN0KGFjdHVhbFthY3R1YWxJZHhdKTtcbiAgICAgIG1hdGNoZXMuc2V0KHBhdHRlcm5JZHgsIGFjdHVhbElkeCwgaW5uZXJSZXN1bHQpO1xuXG4gICAgICBhY3R1YWxJZHgrKztcbiAgICAgIGlmIChpbm5lclJlc3VsdC5pc1N1Y2Nlc3MpIHtcbiAgICAgICAgcmVzdWx0LmNvbXBvc2UoYCR7YWN0dWFsSWR4fWAsIGlubmVyUmVzdWx0KTsgLy8gUmVjb3JkIGFueSBjYXB0dXJlc1xuICAgICAgICBwYXR0ZXJuSWR4Kys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZW4ndCBtYXRjaGVkIGFsbCBwYXR0ZXJuczpcbiAgICAvLyAtIFJlcG9ydCBvbiBlYWNoIG9uZSB0aGF0IGRpZCBtYXRjaCBvbiB3aGVyZSBpdCBtYXRjaGVkIChwZXJoYXBzIGl0IHdhcyB3cm9uZylcbiAgICAvLyAtIFJlcG9ydCB0aGUgY2xvc2VzdCBtYXRjaCBmb3IgdGhlIGZhaWxpbmcgb25lXG4gICAgaWYgKHBhdHRlcm5JZHggPCB0aGlzLnBhdHRlcm4ubGVuZ3RoKSB7XG4gICAgICAvLyBTdWNjZWVkZWQgUGF0dGVybiBJbmRleFxuICAgICAgZm9yIChsZXQgc3BpID0gMDsgc3BpIDwgcGF0dGVybklkeDsgc3BpKyspIHtcbiAgICAgICAgY29uc3QgZm91bmRNYXRjaCA9IG1hdGNoZXMucm93KHNwaSkuZmluZCgoWywgcl0pID0+IHIuaXNTdWNjZXNzKTtcbiAgICAgICAgaWYgKCFmb3VuZE1hdGNoKSB7IGNvbnRpbnVlOyB9IC8vIFNob3VsZCBuZXZlciBmYWlsIGJ1dCBsZXQncyBiZSBkZWZlbnNpdmVcblxuICAgICAgICBjb25zdCBbaW5kZXhdID0gZm91bmRNYXRjaDtcblxuICAgICAgICByZXN1bHQuY29tcG9zZShgJHtpbmRleH1gLCBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsW2luZGV4XSkucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgICBtZXNzYWdlOiBgYXJyYXlXaXRoIHBhdHRlcm4gJHtzcGl9IG1hdGNoZWQgaGVyZWAsXG4gICAgICAgICAgcGF0aDogW10sXG4gICAgICAgICAgY29zdDogMCwgLy8gVGhpcyBpcyBhbiBpbmZvcm1hdGlvbmFsIG1lc3NhZ2Ugc28gaXQgd291bGQgYmUgdW5mYWlyIHRvIGFzc2lnbiBpdCBjb3N0XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmFpbGVkTWF0Y2hlcyA9IG1hdGNoZXMucm93KHBhdHRlcm5JZHgpO1xuICAgICAgZmFpbGVkTWF0Y2hlcy5zb3J0KHNvcnRLZXlDb21wYXJhdG9yKChbaSwgcl0pID0+IFtyLmZhaWxDb3N0LCBpXSkpO1xuICAgICAgaWYgKGZhaWxlZE1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBbaW5kZXgsIGlubmVyUmVzdWx0XSA9IGZhaWxlZE1hdGNoZXNbMF07XG4gICAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3QgbWF0Y2ggYXJyYXlXaXRoIHBhdHRlcm4gJHtwYXR0ZXJuSWR4fS4gVGhpcyBpcyB0aGUgY2xvc2VzdCBtYXRjaGAsXG4gICAgICAgICAgcGF0aDogW2Ake2luZGV4fWBdLFxuICAgICAgICAgIGNvc3Q6IDAsIC8vICBJbmZvcm1hdGlvbmFsIG1lc3NhZ2VcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3VsdC5jb21wb3NlKGAke2luZGV4fWAsIGlubmVyUmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBwcmV2aW91cyBtYXRjaGVyIG1hdGNoZWQgYXQgdGhlIGVuZCBvZiB0aGUgcGF0dGVybiBhbmQgd2UgZGlkbid0IGV2ZW4gZ2V0IHRvIHRyeSBhbnl0aGluZ1xuICAgICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgICBtZXNzYWdlOiBgQ291bGQgbm90IG1hdGNoIGFycmF5V2l0aCBwYXR0ZXJuICR7cGF0dGVybklkeH0uIE5vIG1vcmUgZWxlbWVudHMgdG8gdHJ5YCxcbiAgICAgICAgICBwYXRoOiBbYCR7YWN0dWFsLmxlbmd0aH1gXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hlbiBpbml0aWFsaXppbmcgYE9iamVjdE1hdGNoYCBjbGFzcy5cbiAqL1xuaW50ZXJmYWNlIE9iamVjdE1hdGNoT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYXR0ZXJuIHNob3VsZCBwYXJ0aWFsbHkgbWF0Y2ggd2l0aCB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICogVGhlIHRhcmdldCBvYmplY3QgY2FuIGNvbnRhaW4gbW9yZSBrZXlzIHRoYW4gZXhwZWN0ZWQgYnkgdGhlIHBhdHRlcm4uXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHBhcnRpYWw/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE1hdGNoIGNsYXNzIHRoYXQgbWF0Y2hlcyBvYmplY3RzLlxuICovXG5jbGFzcyBPYmplY3RNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IHBhcnRpYWw6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgIG9wdGlvbnM6IE9iamVjdE1hdGNoT3B0aW9ucyA9IHt9KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFydGlhbCA9IG9wdGlvbnMucGFydGlhbCA/PyB0cnVlO1xuICB9XG5cbiAgcHVibGljIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgaWYgKHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoYWN0dWFsKSkge1xuICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpLnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIHR5cGUgb2JqZWN0IGJ1dCByZWNlaXZlZCAke2dldFR5cGUoYWN0dWFsKX1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG4gICAgaWYgKCF0aGlzLnBhcnRpYWwpIHtcbiAgICAgIGZvciAoY29uc3QgYSBvZiBPYmplY3Qua2V5cyhhY3R1YWwpKSB7XG4gICAgICAgIGlmICghKGEgaW4gdGhpcy5wYXR0ZXJuKSkge1xuICAgICAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgICAgICBwYXRoOiBbYV0sXG4gICAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCBrZXkgJHthfWAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IFtwYXR0ZXJuS2V5LCBwYXR0ZXJuVmFsXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnBhdHRlcm4pKSB7XG4gICAgICBpZiAoIShwYXR0ZXJuS2V5IGluIGFjdHVhbCkgJiYgIShwYXR0ZXJuVmFsIGluc3RhbmNlb2YgQWJzZW50TWF0Y2gpKSB7XG4gICAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICAgIHBhdGg6IFtwYXR0ZXJuS2V5XSxcbiAgICAgICAgICBtZXNzYWdlOiBgTWlzc2luZyBrZXkgJyR7cGF0dGVybktleX0nYCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgbWF0Y2hlciA9IE1hdGNoZXIuaXNNYXRjaGVyKHBhdHRlcm5WYWwpID9cbiAgICAgICAgcGF0dGVyblZhbCA6XG4gICAgICAgIG5ldyBMaXRlcmFsTWF0Y2godGhpcy5uYW1lLCBwYXR0ZXJuVmFsLCB7IHBhcnRpYWxPYmplY3RzOiB0aGlzLnBhcnRpYWwgfSk7XG4gICAgICBjb25zdCBpbm5lciA9IG1hdGNoZXIudGVzdChhY3R1YWxbcGF0dGVybktleV0pO1xuICAgICAgcmVzdWx0LmNvbXBvc2UocGF0dGVybktleSwgaW5uZXIpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuY2xhc3MgU2VyaWFsaXplZEpzb24gZXh0ZW5kcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IGFueSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfTtcblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBpZiAoZ2V0VHlwZShhY3R1YWwpICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpLnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIEpTT04gYXMgYSBzdHJpbmcgYnV0IGZvdW5kICR7Z2V0VHlwZShhY3R1YWwpfWAsXG4gICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHBhcnNlZDtcbiAgICB0cnkge1xuICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShhY3R1YWwpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKS5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICAgIHBhdGg6IFtdLFxuICAgICAgICAgIG1lc3NhZ2U6IGBJbnZhbGlkIEpTT04gc3RyaW5nOiAke2FjdHVhbH1gLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYXRjaGVyID0gTWF0Y2hlci5pc01hdGNoZXIodGhpcy5wYXR0ZXJuKSA/IHRoaXMucGF0dGVybiA6IG5ldyBMaXRlcmFsTWF0Y2godGhpcy5uYW1lLCB0aGlzLnBhdHRlcm4pO1xuICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gbWF0Y2hlci50ZXN0KHBhcnNlZCk7XG4gICAgaWYgKGlubmVyUmVzdWx0Lmhhc0ZhaWxlZCgpKSB7XG4gICAgICBpbm5lclJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgcGF0aDogW10sXG4gICAgICAgIG1lc3NhZ2U6ICdFbmNvZGVkIEpTT04gdmFsdWUgZG9lcyBub3QgbWF0Y2gnLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfVxufVxuXG5jbGFzcyBOb3RNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjoge1trZXk6IHN0cmluZ106IGFueX0pIHtcblxuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCBtYXRjaGVyID0gTWF0Y2hlci5pc01hdGNoZXIodGhpcy5wYXR0ZXJuKSA/IHRoaXMucGF0dGVybiA6IG5ldyBMaXRlcmFsTWF0Y2godGhpcy5uYW1lLCB0aGlzLnBhdHRlcm4pO1xuXG4gICAgY29uc3QgaW5uZXJSZXN1bHQgPSBtYXRjaGVyLnRlc3QoYWN0dWFsKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcbiAgICBpZiAoaW5uZXJSZXN1bHQuZmFpbENvdW50ID09PSAwKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRm91bmQgdW5leHBlY3RlZCBtYXRjaDogJHtKU09OLnN0cmluZ2lmeShhY3R1YWwsIHVuZGVmaW5lZCwgMil9YCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmNsYXNzIEFueU1hdGNoIGV4dGVuZHMgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbCA9PSBudWxsKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiAnRXhwZWN0ZWQgYSB2YWx1ZSBidXQgZm91bmQgbm9uZScsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5jbGFzcyBTdHJpbmdMaWtlUmVnZXhwTWF0Y2ggZXh0ZW5kcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IHN0cmluZykge1xuXG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG5cbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAodGhpcy5wYXR0ZXJuLCAnZ20nKTtcblxuICAgIGlmICh0eXBlb2YgYWN0dWFsICE9PSAnc3RyaW5nJykge1xuICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIGEgc3RyaW5nLCBidXQgZ290ICcke3R5cGVvZiBhY3R1YWx9J2AsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlZ2V4LnRlc3QoYWN0dWFsKSkge1xuICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYFN0cmluZyAnJHthY3R1YWx9JyBkaWQgbm90IG1hdGNoIHBhdHRlcm4gJyR7dGhpcy5wYXR0ZXJufSdgLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG59XG4iXX0=