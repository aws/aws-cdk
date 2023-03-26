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
exports.Match = Match;
_a = JSII_RTTI_SYMBOL_1;
Match[_a] = { fqn: "@aws-cdk/assertions.Match", version: "0.0.0" };
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
                message: `Expected type ${typeof this.pattern} but received ${type_1.getType(actual)}`,
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
                message: `Expected type array but received ${type_1.getType(actual)}`,
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
                    cost: 0,
                }));
            }
            const failedMatches = matches.row(patternIdx);
            failedMatches.sort(sorting_1.sortKeyComparator(([i, r]) => [r.failCost, i]));
            if (failedMatches.length > 0) {
                const [index, innerResult] = failedMatches[0];
                result.recordFailure({
                    matcher: this,
                    message: `Could not match arrayWith pattern ${patternIdx}. This is the closest match`,
                    path: [`${index}`],
                    cost: 0,
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
                message: `Expected type object but received ${type_1.getType(actual)}`,
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
        if (type_1.getType(actual) !== 'string') {
            return new matcher_1.MatchResult(actual).recordFailure({
                matcher: this,
                path: [],
                message: `Expected JSON as a string but found ${type_1.getType(actual)}`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVDQUFpRDtBQUNqRCxzREFBd0Q7QUFDeEQsK0NBQXNEO0FBQ3RELDJEQUF1RDtBQUN2RCx5Q0FBeUM7QUFFekM7O0dBRUc7QUFDSCxNQUFzQixLQUFLO0lBQ3pCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLG9CQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFjO1FBQ3BDLE9BQU8sSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBYztRQUN0QyxPQUFPLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN2RTtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBWTtRQUM5QixPQUFPLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN0RTtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQTZCO1FBQ3BELE9BQU8sSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBNkI7UUFDdEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDckU7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQVk7UUFDNUIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDckM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQVk7UUFDdkMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN0RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVE7UUFDcEIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNqQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQWU7UUFDNUMsT0FBTyxJQUFJLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQy9EOztBQWhGSCxzQkFpRkM7OztBQWFEOzs7R0FHRztBQUNILE1BQU0sWUFBYSxTQUFRLGlCQUFPO0lBR2hDLFlBQ2tCLElBQVksRUFDWCxPQUFZLEVBQzdCLFVBQStCLEVBQUU7UUFFakMsS0FBSyxFQUFFLENBQUM7UUFKUSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1gsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUk3QixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksS0FBSyxDQUFDO1FBRXRELElBQUksaUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdEO2dCQUN0RSxzREFBc0QsQ0FBQyxDQUFDO1NBQzNEO0tBQ0Y7SUFFTSxJQUFJLENBQUMsTUFBVztRQUNyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFIO1FBRUQsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRztRQUVELE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sRUFBRTtZQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsaUJBQWlCLE9BQU8sSUFBSSxDQUFDLE9BQU8saUJBQWlCLGNBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTthQUNoRixDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQixNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsWUFBWSxJQUFJLENBQUMsT0FBTyxpQkFBaUIsTUFBTSxFQUFFO2FBQzNELENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxNQUFNLENBQUM7S0FDZjtDQUNGO0FBc0JEOztHQUVHO0FBQ0gsTUFBTSxVQUFXLFNBQVEsaUJBQU87SUFJOUIsWUFDa0IsSUFBWSxFQUNYLE9BQWMsRUFDL0IsVUFBNkIsRUFBRTtRQUUvQixLQUFLLEVBQUUsQ0FBQztRQUpRLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFPO1FBSS9CLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7UUFDL0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQztLQUN2RDtJQUVNLElBQUksQ0FBQyxNQUFXO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDM0MsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLG9DQUFvQyxjQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDL0QsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckY7SUFFTyxhQUFhLENBQUMsTUFBa0I7UUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO2dCQUMvQyxDQUFDLENBQUMsY0FBYztnQkFDaEIsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRXpGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDM0IsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDbkIsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsT0FBTyxFQUFFLDJDQUEyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sU0FBUyxNQUFNLENBQUMsTUFBTSxHQUFHO2dCQUNoRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxJQUFJO2dCQUNiLE9BQU8sRUFBRSx5Q0FBeUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLFNBQVMsTUFBTSxDQUFDLE1BQU0sR0FBRztnQkFDOUYsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQzthQUNmLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUVPLGVBQWUsQ0FBQyxNQUFrQjtRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkMsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSxzREFBc0Q7UUFFdEQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixNQUFNLE9BQU8sR0FBRyxJQUFJLDRCQUFZLEVBQWUsQ0FBQztRQUVoRCxPQUFPLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNwRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWhELE1BQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztnQkFDL0MsQ0FBQyxDQUFDLGNBQWM7Z0JBQ2hCLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUV6RixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2pDLElBQUksV0FBVyxJQUFJLFFBQVEsSUFBSSxXQUFXLElBQUksVUFBVSxFQUFFO2dCQUN4RCw4SEFBOEg7Z0JBQzlILE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxXQUFXLHdDQUF3QyxDQUFDLENBQUM7YUFDckY7WUFFRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVoRCxTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTtnQkFDekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO2dCQUNuRSxVQUFVLEVBQUUsQ0FBQzthQUNkO1NBQ0Y7UUFFRCxzQ0FBc0M7UUFDdEMsaUZBQWlGO1FBQ2pGLGlEQUFpRDtRQUNqRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNwQywwQkFBMEI7WUFDMUIsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDekMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDakUsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFBRSxTQUFTO2lCQUFFLENBQUMsMkNBQTJDO2dCQUUxRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUUzQixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztvQkFDdEUsT0FBTyxFQUFFLElBQUk7b0JBQ2IsT0FBTyxFQUFFLHFCQUFxQixHQUFHLGVBQWU7b0JBQ2hELElBQUksRUFBRSxFQUFFO29CQUNSLElBQUksRUFBRSxDQUFDO2lCQUNSLENBQUMsQ0FBQyxDQUFDO2FBQ0w7WUFFRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLGFBQWEsQ0FBQyxJQUFJLENBQUMsMkJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztvQkFDbkIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsT0FBTyxFQUFFLHFDQUFxQyxVQUFVLDZCQUE2QjtvQkFDckYsSUFBSSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxFQUFFLENBQUM7aUJBQ1IsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxnR0FBZ0c7Z0JBQ2hHLE1BQU0sQ0FBQyxhQUFhLENBQUM7b0JBQ25CLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSxxQ0FBcUMsVUFBVSwyQkFBMkI7b0JBQ25GLElBQUksRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMzQixDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsT0FBTyxNQUFNLENBQUM7S0FDZjtDQUNGO0FBY0Q7O0dBRUc7QUFDSCxNQUFNLFdBQVksU0FBUSxpQkFBTztJQUcvQixZQUNrQixJQUFZLEVBQ1gsT0FBNkIsRUFDOUMsVUFBOEIsRUFBRTtRQUVoQyxLQUFLLEVBQUUsQ0FBQztRQUpRLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQUk5QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0tBQ3hDO0lBRU0sSUFBSSxDQUFDLE1BQVc7UUFDckIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN2RCxPQUFPLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQzNDLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxxQ0FBcUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ2hFLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDeEIsTUFBTSxDQUFDLGFBQWEsQ0FBQzt3QkFDbkIsT0FBTyxFQUFFLElBQUk7d0JBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNULE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO3FCQUMvQixDQUFDLENBQUM7aUJBQ0o7YUFDRjtTQUNGO1FBRUQsS0FBSyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ25FLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxZQUFZLG9CQUFXLENBQUMsRUFBRTtnQkFDbkUsTUFBTSxDQUFDLGFBQWEsQ0FBQztvQkFDbkIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUNsQixPQUFPLEVBQUUsZ0JBQWdCLFVBQVUsR0FBRztpQkFDdkMsQ0FBQyxDQUFDO2dCQUNILFNBQVM7YUFDVjtZQUNELE1BQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLFVBQVUsQ0FBQyxDQUFDO2dCQUNaLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkM7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0NBQ0Y7QUFFRCxNQUFNLGNBQWUsU0FBUSxpQkFBTztJQUNsQyxZQUNrQixJQUFZLEVBQ1gsT0FBWTtRQUU3QixLQUFLLEVBQUUsQ0FBQztRQUhRLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFLO0tBRzlCO0lBQUEsQ0FBQztJQUVLLElBQUksQ0FBQyxNQUFXO1FBQ3JCLElBQUksY0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNoQyxPQUFPLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQzNDLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSx1Q0FBdUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ2xFLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0I7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksR0FBRyxZQUFZLFdBQVcsRUFBRTtnQkFDOUIsT0FBTyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDO29CQUMzQyxPQUFPLEVBQUUsSUFBSTtvQkFDYixJQUFJLEVBQUUsRUFBRTtvQkFDUixPQUFPLEVBQUUsd0JBQXdCLE1BQU0sRUFBRTtpQkFDMUMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLENBQUM7YUFDWDtTQUNGO1FBRUQsTUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQzNCLFdBQVcsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxtQ0FBbUM7YUFDN0MsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLFdBQVcsQ0FBQztLQUNwQjtDQUNGO0FBRUQsTUFBTSxRQUFTLFNBQVEsaUJBQU87SUFDNUIsWUFDa0IsSUFBWSxFQUNYLE9BQTZCO1FBRTlDLEtBQUssRUFBRSxDQUFDO1FBSFEsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNYLFlBQU8sR0FBUCxPQUFPLENBQXNCO0tBRy9DO0lBRU0sSUFBSSxDQUFDLE1BQVc7UUFDckIsTUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzRyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSwyQkFBMkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO2FBQzNFLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtDQUNGO0FBRUQsTUFBTSxRQUFTLFNBQVEsaUJBQU87SUFDNUIsWUFBNEIsSUFBWTtRQUN0QyxLQUFLLEVBQUUsQ0FBQztRQURrQixTQUFJLEdBQUosSUFBSSxDQUFRO0tBRXZDO0lBRU0sSUFBSSxDQUFDLE1BQVc7UUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUNsQixNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsaUNBQWlDO2FBQzNDLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtDQUNGO0FBRUQsTUFBTSxxQkFBc0IsU0FBUSxpQkFBTztJQUN6QyxZQUNrQixJQUFZLEVBQ1gsT0FBZTtRQUVoQyxLQUFLLEVBQUUsQ0FBQztRQUhRLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFRO0tBR2pDO0lBRUQsSUFBSSxDQUFDLE1BQVc7UUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUM5QixNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsK0JBQStCLE9BQU8sTUFBTSxHQUFHO2FBQ3pELENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDbkIsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLFdBQVcsTUFBTSw0QkFBNEIsSUFBSSxDQUFDLE9BQU8sR0FBRzthQUN0RSxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoZXIsIE1hdGNoUmVzdWx0IH0gZnJvbSAnLi9tYXRjaGVyJztcbmltcG9ydCB7IEFic2VudE1hdGNoIH0gZnJvbSAnLi9wcml2YXRlL21hdGNoZXJzL2Fic2VudCc7XG5pbXBvcnQgeyBzb3J0S2V5Q29tcGFyYXRvciB9IGZyb20gJy4vcHJpdmF0ZS9zb3J0aW5nJztcbmltcG9ydCB7IFNwYXJzZU1hdHJpeCB9IGZyb20gJy4vcHJpdmF0ZS9zcGFyc2UtbWF0cml4JztcbmltcG9ydCB7IGdldFR5cGUgfSBmcm9tICcuL3ByaXZhdGUvdHlwZSc7XG5cbi8qKlxuICogUGFydGlhbCBhbmQgc3BlY2lhbCBtYXRjaGluZyBkdXJpbmcgdGVtcGxhdGUgYXNzZXJ0aW9ucy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdGNoIHtcbiAgLyoqXG4gICAqIFVzZSB0aGlzIG1hdGNoZXIgaW4gdGhlIHBsYWNlIG9mIGEgZmllbGQncyB2YWx1ZSwgaWYgdGhlIGZpZWxkIG11c3Qgbm90IGJlIHByZXNlbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFic2VudCgpOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IEFic2VudE1hdGNoKCdhYnNlbnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB3aXRoIHRoZSBhcnJheSBmb3VuZCBpbiB0aGUgc2FtZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSB0YXJnZXQuXG4gICAqIFRoZSBzZXQgb2YgZWxlbWVudHMgKG9yIG1hdGNoZXJzKSBtdXN0IGJlIGluIHRoZSBzYW1lIG9yZGVyIGFzIHdvdWxkIGJlIGZvdW5kLlxuICAgKiBAcGFyYW0gcGF0dGVybiB0aGUgcGF0dGVybiB0byBtYXRjaFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcnJheVdpdGgocGF0dGVybjogYW55W10pOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IEFycmF5TWF0Y2goJ2FycmF5V2l0aCcsIHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgdGhlIHNwZWNpZmllZCBwYXR0ZXJuIHdpdGggdGhlIGFycmF5IGZvdW5kIGluIHRoZSBzYW1lIHJlbGF0aXZlIHBhdGggb2YgdGhlIHRhcmdldC5cbiAgICogVGhlIHNldCBvZiBlbGVtZW50cyAob3IgbWF0Y2hlcnMpIG11c3QgbWF0Y2ggZXhhY3RseSBhbmQgaW4gb3JkZXIuXG4gICAqIEBwYXJhbSBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFycmF5RXF1YWxzKHBhdHRlcm46IGFueVtdKTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBBcnJheU1hdGNoKCdhcnJheUVxdWFscycsIHBhdHRlcm4sIHsgc3Vic2VxdWVuY2U6IGZhbHNlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZXAgZXhhY3QgbWF0Y2hpbmcgb2YgdGhlIHNwZWNpZmllZCBwYXR0ZXJuIHRvIHRoZSB0YXJnZXQuXG4gICAqIEBwYXJhbSBwYXR0ZXJuIHRoZSBwYXR0ZXJuIHRvIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGV4YWN0KHBhdHRlcm46IGFueSk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbE1hdGNoKCdleGFjdCcsIHBhdHRlcm4sIHsgcGFydGlhbE9iamVjdHM6IGZhbHNlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgdGhlIHNwZWNpZmllZCBwYXR0ZXJuIHRvIGFuIG9iamVjdCBmb3VuZCBpbiB0aGUgc2FtZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSB0YXJnZXQuXG4gICAqIFRoZSBrZXlzIGFuZCB0aGVpciB2YWx1ZXMgKG9yIG1hdGNoZXJzKSBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIHRhcmdldCBidXQgdGhlIHRhcmdldCBjYW4gYmUgYSBzdXBlcnNldC5cbiAgICogQHBhcmFtIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gbWF0Y2hcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2JqZWN0TGlrZShwYXR0ZXJuOiB7W2tleTogc3RyaW5nXTogYW55fSk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgT2JqZWN0TWF0Y2goJ29iamVjdExpa2UnLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB0byBhbiBvYmplY3QgZm91bmQgaW4gdGhlIHNhbWUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgdGFyZ2V0LlxuICAgKiBUaGUga2V5cyBhbmQgdGhlaXIgdmFsdWVzIChvciBtYXRjaGVycykgbXVzdCBtYXRjaCBleGFjdGx5IHdpdGggdGhlIHRhcmdldC5cbiAgICogQHBhcmFtIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gbWF0Y2hcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2JqZWN0RXF1YWxzKHBhdHRlcm46IHtba2V5OiBzdHJpbmddOiBhbnl9KTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RNYXRjaCgnb2JqZWN0RXF1YWxzJywgcGF0dGVybiwgeyBwYXJ0aWFsOiBmYWxzZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGFueSB0YXJnZXQgd2hpY2ggZG9lcyBOT1QgZm9sbG93IHRoZSBzcGVjaWZpZWQgcGF0dGVybi5cbiAgICogQHBhcmFtIHBhdHRlcm4gdGhlIHBhdHRlcm4gdG8gTk9UIG1hdGNoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdChwYXR0ZXJuOiBhbnkpOiBNYXRjaGVyIHtcbiAgICByZXR1cm4gbmV3IE5vdE1hdGNoKCdub3QnLCBwYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGFueSBzdHJpbmctZW5jb2RlZCBKU09OIGFuZCBhcHBsaWVzIHRoZSBzcGVjaWZpZWQgcGF0dGVybiBhZnRlciBwYXJzaW5nIGl0LlxuICAgKiBAcGFyYW0gcGF0dGVybiB0aGUgcGF0dGVybiB0byBtYXRjaCBhZnRlciBwYXJzaW5nIHRoZSBlbmNvZGVkIEpTT04uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlcmlhbGl6ZWRKc29uKHBhdHRlcm46IGFueSk6IE1hdGNoZXIge1xuICAgIHJldHVybiBuZXcgU2VyaWFsaXplZEpzb24oJ3NlcmlhbGl6ZWRKc29uJywgcGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbnkgbm9uLW51bGwgdmFsdWUgYXQgdGhlIHRhcmdldC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55VmFsdWUoKTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBBbnlNYXRjaCgnYW55VmFsdWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHRhcmdldHMgYWNjb3JkaW5nIHRvIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0xpa2VSZWdleHAocGF0dGVybjogc3RyaW5nKTogTWF0Y2hlciB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdMaWtlUmVnZXhwTWF0Y2goJ3N0cmluZ0xpa2VSZWdleHAnLCBwYXR0ZXJuKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hlbiBpbml0aWFsaXppbmcgdGhlIGBMaXRlcmFsTWF0Y2hgIGNsYXNzLlxuICovXG5pbnRlcmZhY2UgTGl0ZXJhbE1hdGNoT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9iamVjdHMgbmVzdGVkIGF0IGFueSBsZXZlbCBzaG91bGQgYmUgbWF0Y2hlZCBwYXJ0aWFsbHkuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwYXJ0aWFsT2JqZWN0cz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBNYXRjaCBjbGFzcyB0aGF0IGV4cGVjdHMgdGhlIHRhcmdldCB0byBtYXRjaCB3aXRoIHRoZSBwYXR0ZXJuIGV4YWN0bHkuXG4gKiBUaGUgcGF0dGVybiBtYXkgYmUgbmVzdGVkIHdpdGggb3RoZXIgbWF0Y2hlcnMgdGhhdCBhcmUgdGhlbiBkZWxldGVnYXRlZCB0by5cbiAqL1xuY2xhc3MgTGl0ZXJhbE1hdGNoIGV4dGVuZHMgTWF0Y2hlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGFydGlhbE9iamVjdHM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IGFueSxcbiAgICBvcHRpb25zOiBMaXRlcmFsTWF0Y2hPcHRpb25zID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJ0aWFsT2JqZWN0cyA9IG9wdGlvbnMucGFydGlhbE9iamVjdHMgPz8gZmFsc2U7XG5cbiAgICBpZiAoTWF0Y2hlci5pc01hdGNoZXIodGhpcy5wYXR0ZXJuKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMaXRlcmFsTWF0Y2ggY2Fubm90IGRpcmVjdGx5IGNvbnRhaW4gYW5vdGhlciBtYXRjaGVyLiAnICtcbiAgICAgICAgJ1JlbW92ZSB0aGUgdG9wLWxldmVsIG1hdGNoZXIgb3IgbmVzdCBpdCBtb3JlIGRlZXBseS4nKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gbmV3IEFycmF5TWF0Y2godGhpcy5uYW1lLCB0aGlzLnBhdHRlcm4sIHsgc3Vic2VxdWVuY2U6IGZhbHNlLCBwYXJ0aWFsT2JqZWN0czogdGhpcy5wYXJ0aWFsT2JqZWN0cyB9KS50ZXN0KGFjdHVhbCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhdHRlcm4gPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gbmV3IE9iamVjdE1hdGNoKHRoaXMubmFtZSwgdGhpcy5wYXR0ZXJuLCB7IHBhcnRpYWw6IHRoaXMucGFydGlhbE9iamVjdHMgfSkudGVzdChhY3R1YWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpO1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYXR0ZXJuICE9PSB0eXBlb2YgYWN0dWFsKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgdHlwZSAke3R5cGVvZiB0aGlzLnBhdHRlcm59IGJ1dCByZWNlaXZlZCAke2dldFR5cGUoYWN0dWFsKX1gLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmIChhY3R1YWwgIT09IHRoaXMucGF0dGVybikge1xuICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkICR7dGhpcy5wYXR0ZXJufSBidXQgcmVjZWl2ZWQgJHthY3R1YWx9YCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSBgQXJyYXlNYXRjaGAgY2xhc3MuXG4gKi9cbmludGVyZmFjZSBBcnJheU1hdGNoT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYXR0ZXJuIGlzIGEgc3Vic2VxdWVuY2Ugb2YgdGhlIHRhcmdldC5cbiAgICogQSBzdWJzZXF1ZW5jZSBpcyBhIHNlcXVlbmNlIHRoYXQgY2FuIGJlIGRlcml2ZWQgZnJvbSBhbm90aGVyIHNlcXVlbmNlIGJ5IGRlbGV0aW5nXG4gICAqIHNvbWUgb3Igbm8gZWxlbWVudHMgd2l0aG91dCBjaGFuZ2luZyB0aGUgb3JkZXIgb2YgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3Vic2VxdWVuY2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNvbnRpbnVlIG1hdGNoaW5nIG9iamVjdHMgaW5zaWRlIHRoZSBhcnJheSBwYXJ0aWFsbHlcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHBhcnRpYWxPYmplY3RzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNYXRjaCBjbGFzcyB0aGF0IG1hdGNoZXMgYXJyYXlzLlxuICovXG5jbGFzcyBBcnJheU1hdGNoIGV4dGVuZHMgTWF0Y2hlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3Vic2VxdWVuY2U6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgcGFydGlhbE9iamVjdHM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IGFueVtdLFxuICAgIG9wdGlvbnM6IEFycmF5TWF0Y2hPcHRpb25zID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdWJzZXF1ZW5jZSA9IG9wdGlvbnMuc3Vic2VxdWVuY2UgPz8gdHJ1ZTtcbiAgICB0aGlzLnBhcnRpYWxPYmplY3RzID0gb3B0aW9ucy5wYXJ0aWFsT2JqZWN0cyA/PyBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyB0ZXN0KGFjdHVhbDogYW55KTogTWF0Y2hSZXN1bHQge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhY3R1YWwpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCkucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgdHlwZSBhcnJheSBidXQgcmVjZWl2ZWQgJHtnZXRUeXBlKGFjdHVhbCl9YCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN1YnNlcXVlbmNlID8gdGhpcy50ZXN0U3Vic2VxdWVuY2UoYWN0dWFsKSA6IHRoaXMudGVzdEZ1bGxBcnJheShhY3R1YWwpO1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXN0RnVsbEFycmF5KGFjdHVhbDogQXJyYXk8YW55Pik6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcblxuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKDsgaSA8IHRoaXMucGF0dGVybi5sZW5ndGggJiYgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcGF0dGVybkVsZW1lbnQgPSB0aGlzLnBhdHRlcm5baV07XG4gICAgICBjb25zdCBtYXRjaGVyID0gTWF0Y2hlci5pc01hdGNoZXIocGF0dGVybkVsZW1lbnQpXG4gICAgICAgID8gcGF0dGVybkVsZW1lbnRcbiAgICAgICAgOiBuZXcgTGl0ZXJhbE1hdGNoKHRoaXMubmFtZSwgcGF0dGVybkVsZW1lbnQsIHsgcGFydGlhbE9iamVjdHM6IHRoaXMucGFydGlhbE9iamVjdHMgfSk7XG5cbiAgICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gbWF0Y2hlci50ZXN0KGFjdHVhbFtpXSk7XG4gICAgICByZXN1bHQuY29tcG9zZShgJHtpfWAsIGlubmVyUmVzdWx0KTtcbiAgICB9XG5cbiAgICBpZiAoaSA8IHRoaXMucGF0dGVybi5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgbWVzc2FnZTogYE5vdCBlbm91Z2ggZWxlbWVudHMgaW4gYXJyYXkgKGV4cGVjdGluZyAke3RoaXMucGF0dGVybi5sZW5ndGh9LCBnb3QgJHthY3R1YWwubGVuZ3RofSlgLFxuICAgICAgICBwYXRoOiBbYCR7aX1gXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaSA8IGFjdHVhbC5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgbWVzc2FnZTogYFRvbyBtYW55IGVsZW1lbnRzIGluIGFycmF5IChleHBlY3RpbmcgJHt0aGlzLnBhdHRlcm4ubGVuZ3RofSwgZ290ICR7YWN0dWFsLmxlbmd0aH0pYCxcbiAgICAgICAgcGF0aDogW2Ake2l9YF0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSB0ZXN0U3Vic2VxdWVuY2UoYWN0dWFsOiBBcnJheTxhbnk+KTogTWF0Y2hSZXN1bHQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpO1xuXG4gICAgLy8gRm9yIHN1YnNlcXVlbmNlcywgdGhlcmUgaXMgYSBsb3Qgb2YgdGVzdGluZyBhbmQgYmFja3RyYWNraW5nIHRoYXQgaGFwcGVuc1xuICAgIC8vIGhlcmUsIGtlZXAgdHJhY2sgb2YgaXQgYWxsIHNvIHdlIGNhbiByZXBvcnQgaW4gYSBzZW5zaWJsZSBhbW91bnQgb2ZcbiAgICAvLyBkZXRhaWwgb24gd2hhdCB3ZSBkaWQgaWYgdGhlIG1hdGNoIGhhcHBlbnMgdG8gZmFpbC5cblxuICAgIGxldCBwYXR0ZXJuSWR4ID0gMDtcbiAgICBsZXQgYWN0dWFsSWR4ID0gMDtcbiAgICBjb25zdCBtYXRjaGVzID0gbmV3IFNwYXJzZU1hdHJpeDxNYXRjaFJlc3VsdD4oKTtcblxuICAgIHdoaWxlIChwYXR0ZXJuSWR4IDwgdGhpcy5wYXR0ZXJuLmxlbmd0aCAmJiBhY3R1YWxJZHggPCBhY3R1YWwubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXR0ZXJuRWxlbWVudCA9IHRoaXMucGF0dGVybltwYXR0ZXJuSWR4XTtcblxuICAgICAgY29uc3QgbWF0Y2hlciA9IE1hdGNoZXIuaXNNYXRjaGVyKHBhdHRlcm5FbGVtZW50KVxuICAgICAgICA/IHBhdHRlcm5FbGVtZW50XG4gICAgICAgIDogbmV3IExpdGVyYWxNYXRjaCh0aGlzLm5hbWUsIHBhdHRlcm5FbGVtZW50LCB7IHBhcnRpYWxPYmplY3RzOiB0aGlzLnBhcnRpYWxPYmplY3RzIH0pO1xuXG4gICAgICBjb25zdCBtYXRjaGVyTmFtZSA9IG1hdGNoZXIubmFtZTtcbiAgICAgIGlmIChtYXRjaGVyTmFtZSA9PSAnYWJzZW50JyB8fCBtYXRjaGVyTmFtZSA9PSAnYW55VmFsdWUnKSB7XG4gICAgICAgIC8vIGFycmF5IHN1YnNlcXVlbmNlIG1hdGNoZXIgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBhbnlWYWx1ZSgpIG9yIGFic2VudCgpIG1hdGNoZXIuIFRoZXkgZG9uJ3QgbWFrZSBzZW5zZSB0byBiZSB1c2VkIHRvZ2V0aGVyLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBNYXRjaGVyICR7bWF0Y2hlck5hbWV9KCkgY2Fubm90IGJlIG5lc3RlZCB3aXRoaW4gYXJyYXlXaXRoKClgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5uZXJSZXN1bHQgPSBtYXRjaGVyLnRlc3QoYWN0dWFsW2FjdHVhbElkeF0pO1xuICAgICAgbWF0Y2hlcy5zZXQocGF0dGVybklkeCwgYWN0dWFsSWR4LCBpbm5lclJlc3VsdCk7XG5cbiAgICAgIGFjdHVhbElkeCsrO1xuICAgICAgaWYgKGlubmVyUmVzdWx0LmlzU3VjY2Vzcykge1xuICAgICAgICByZXN1bHQuY29tcG9zZShgJHthY3R1YWxJZHh9YCwgaW5uZXJSZXN1bHQpOyAvLyBSZWNvcmQgYW55IGNhcHR1cmVzXG4gICAgICAgIHBhdHRlcm5JZHgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlbid0IG1hdGNoZWQgYWxsIHBhdHRlcm5zOlxuICAgIC8vIC0gUmVwb3J0IG9uIGVhY2ggb25lIHRoYXQgZGlkIG1hdGNoIG9uIHdoZXJlIGl0IG1hdGNoZWQgKHBlcmhhcHMgaXQgd2FzIHdyb25nKVxuICAgIC8vIC0gUmVwb3J0IHRoZSBjbG9zZXN0IG1hdGNoIGZvciB0aGUgZmFpbGluZyBvbmVcbiAgICBpZiAocGF0dGVybklkeCA8IHRoaXMucGF0dGVybi5sZW5ndGgpIHtcbiAgICAgIC8vIFN1Y2NlZWRlZCBQYXR0ZXJuIEluZGV4XG4gICAgICBmb3IgKGxldCBzcGkgPSAwOyBzcGkgPCBwYXR0ZXJuSWR4OyBzcGkrKykge1xuICAgICAgICBjb25zdCBmb3VuZE1hdGNoID0gbWF0Y2hlcy5yb3coc3BpKS5maW5kKChbLCByXSkgPT4gci5pc1N1Y2Nlc3MpO1xuICAgICAgICBpZiAoIWZvdW5kTWF0Y2gpIHsgY29udGludWU7IH0gLy8gU2hvdWxkIG5ldmVyIGZhaWwgYnV0IGxldCdzIGJlIGRlZmVuc2l2ZVxuXG4gICAgICAgIGNvbnN0IFtpbmRleF0gPSBmb3VuZE1hdGNoO1xuXG4gICAgICAgIHJlc3VsdC5jb21wb3NlKGAke2luZGV4fWAsIG5ldyBNYXRjaFJlc3VsdChhY3R1YWxbaW5kZXhdKS5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICAgIG1lc3NhZ2U6IGBhcnJheVdpdGggcGF0dGVybiAke3NwaX0gbWF0Y2hlZCBoZXJlYCxcbiAgICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgICBjb3N0OiAwLCAvLyBUaGlzIGlzIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSBzbyBpdCB3b3VsZCBiZSB1bmZhaXIgdG8gYXNzaWduIGl0IGNvc3RcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmYWlsZWRNYXRjaGVzID0gbWF0Y2hlcy5yb3cocGF0dGVybklkeCk7XG4gICAgICBmYWlsZWRNYXRjaGVzLnNvcnQoc29ydEtleUNvbXBhcmF0b3IoKFtpLCByXSkgPT4gW3IuZmFpbENvc3QsIGldKSk7XG4gICAgICBpZiAoZmFpbGVkTWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IFtpbmRleCwgaW5uZXJSZXN1bHRdID0gZmFpbGVkTWF0Y2hlc1swXTtcbiAgICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgICAgbWVzc2FnZTogYENvdWxkIG5vdCBtYXRjaCBhcnJheVdpdGggcGF0dGVybiAke3BhdHRlcm5JZHh9LiBUaGlzIGlzIHRoZSBjbG9zZXN0IG1hdGNoYCxcbiAgICAgICAgICBwYXRoOiBbYCR7aW5kZXh9YF0sXG4gICAgICAgICAgY29zdDogMCwgLy8gIEluZm9ybWF0aW9uYWwgbWVzc2FnZVxuICAgICAgICB9KTtcbiAgICAgICAgcmVzdWx0LmNvbXBvc2UoYCR7aW5kZXh9YCwgaW5uZXJSZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIHByZXZpb3VzIG1hdGNoZXIgbWF0Y2hlZCBhdCB0aGUgZW5kIG9mIHRoZSBwYXR0ZXJuIGFuZCB3ZSBkaWRuJ3QgZXZlbiBnZXQgdG8gdHJ5IGFueXRoaW5nXG4gICAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICAgIG1lc3NhZ2U6IGBDb3VsZCBub3QgbWF0Y2ggYXJyYXlXaXRoIHBhdHRlcm4gJHtwYXR0ZXJuSWR4fS4gTm8gbW9yZSBlbGVtZW50cyB0byB0cnlgLFxuICAgICAgICAgIHBhdGg6IFtgJHthY3R1YWwubGVuZ3RofWBdLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGluaXRpYWxpemluZyBgT2JqZWN0TWF0Y2hgIGNsYXNzLlxuICovXG5pbnRlcmZhY2UgT2JqZWN0TWF0Y2hPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHBhdHRlcm4gc2hvdWxkIHBhcnRpYWxseSBtYXRjaCB3aXRoIHRoZSB0YXJnZXQgb2JqZWN0LlxuICAgKiBUaGUgdGFyZ2V0IG9iamVjdCBjYW4gY29udGFpbiBtb3JlIGtleXMgdGhhbiBleHBlY3RlZCBieSB0aGUgcGF0dGVybi5cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcGFydGlhbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTWF0Y2ggY2xhc3MgdGhhdCBtYXRjaGVzIG9iamVjdHMuXG4gKi9cbmNsYXNzIE9iamVjdE1hdGNoIGV4dGVuZHMgTWF0Y2hlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGFydGlhbDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgb3B0aW9uczogT2JqZWN0TWF0Y2hPcHRpb25zID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsID8/IHRydWU7XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBpZiAodHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShhY3R1YWwpKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCkucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgdHlwZSBvYmplY3QgYnV0IHJlY2VpdmVkICR7Z2V0VHlwZShhY3R1YWwpfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcbiAgICBpZiAoIXRoaXMucGFydGlhbCkge1xuICAgICAgZm9yIChjb25zdCBhIG9mIE9iamVjdC5rZXlzKGFjdHVhbCkpIHtcbiAgICAgICAgaWYgKCEoYSBpbiB0aGlzLnBhdHRlcm4pKSB7XG4gICAgICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgICAgIHBhdGg6IFthXSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkIGtleSAke2F9YCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgW3BhdHRlcm5LZXksIHBhdHRlcm5WYWxdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMucGF0dGVybikpIHtcbiAgICAgIGlmICghKHBhdHRlcm5LZXkgaW4gYWN0dWFsKSAmJiAhKHBhdHRlcm5WYWwgaW5zdGFuY2VvZiBBYnNlbnRNYXRjaCkpIHtcbiAgICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgICAgcGF0aDogW3BhdHRlcm5LZXldLFxuICAgICAgICAgIG1lc3NhZ2U6IGBNaXNzaW5nIGtleSAnJHtwYXR0ZXJuS2V5fSdgLFxuICAgICAgICB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBtYXRjaGVyID0gTWF0Y2hlci5pc01hdGNoZXIocGF0dGVyblZhbCkgP1xuICAgICAgICBwYXR0ZXJuVmFsIDpcbiAgICAgICAgbmV3IExpdGVyYWxNYXRjaCh0aGlzLm5hbWUsIHBhdHRlcm5WYWwsIHsgcGFydGlhbE9iamVjdHM6IHRoaXMucGFydGlhbCB9KTtcbiAgICAgIGNvbnN0IGlubmVyID0gbWF0Y2hlci50ZXN0KGFjdHVhbFtwYXR0ZXJuS2V5XSk7XG4gICAgICByZXN1bHQuY29tcG9zZShwYXR0ZXJuS2V5LCBpbm5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5jbGFzcyBTZXJpYWxpemVkSnNvbiBleHRlbmRzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogYW55LFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9O1xuXG4gIHB1YmxpYyB0ZXN0KGFjdHVhbDogYW55KTogTWF0Y2hSZXN1bHQge1xuICAgIGlmIChnZXRUeXBlKGFjdHVhbCkgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCkucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgSlNPTiBhcyBhIHN0cmluZyBidXQgZm91bmQgJHtnZXRUeXBlKGFjdHVhbCl9YCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgcGFyc2VkO1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGFjdHVhbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpLnJlY29yZEZhaWx1cmUoe1xuICAgICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgICAgcGF0aDogW10sXG4gICAgICAgICAgbWVzc2FnZTogYEludmFsaWQgSlNPTiBzdHJpbmc6ICR7YWN0dWFsfWAsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoZXIgPSBNYXRjaGVyLmlzTWF0Y2hlcih0aGlzLnBhdHRlcm4pID8gdGhpcy5wYXR0ZXJuIDogbmV3IExpdGVyYWxNYXRjaCh0aGlzLm5hbWUsIHRoaXMucGF0dGVybik7XG4gICAgY29uc3QgaW5uZXJSZXN1bHQgPSBtYXRjaGVyLnRlc3QocGFyc2VkKTtcbiAgICBpZiAoaW5uZXJSZXN1bHQuaGFzRmFpbGVkKCkpIHtcbiAgICAgIGlubmVyUmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogJ0VuY29kZWQgSlNPTiB2YWx1ZSBkb2VzIG5vdCBtYXRjaCcsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGlubmVyUmVzdWx0O1xuICB9XG59XG5cbmNsYXNzIE5vdE1hdGNoIGV4dGVuZHMgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuOiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuXG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0ZXN0KGFjdHVhbDogYW55KTogTWF0Y2hSZXN1bHQge1xuICAgIGNvbnN0IG1hdGNoZXIgPSBNYXRjaGVyLmlzTWF0Y2hlcih0aGlzLnBhdHRlcm4pID8gdGhpcy5wYXR0ZXJuIDogbmV3IExpdGVyYWxNYXRjaCh0aGlzLm5hbWUsIHRoaXMucGF0dGVybik7XG5cbiAgICBjb25zdCBpbm5lclJlc3VsdCA9IG1hdGNoZXIudGVzdChhY3R1YWwpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpO1xuICAgIGlmIChpbm5lclJlc3VsdC5mYWlsQ291bnQgPT09IDApIHtcbiAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgcGF0aDogW10sXG4gICAgICAgIG1lc3NhZ2U6IGBGb3VuZCB1bmV4cGVjdGVkIG1hdGNoOiAke0pTT04uc3RyaW5naWZ5KGFjdHVhbCwgdW5kZWZpbmVkLCAyKX1gLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuY2xhc3MgQW55TWF0Y2ggZXh0ZW5kcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsID09IG51bGwpIHtcbiAgICAgIHJlc3VsdC5yZWNvcmRGYWlsdXJlKHtcbiAgICAgICAgbWF0Y2hlcjogdGhpcyxcbiAgICAgICAgcGF0aDogW10sXG4gICAgICAgIG1lc3NhZ2U6ICdFeHBlY3RlZCBhIHZhbHVlIGJ1dCBmb3VuZCBub25lJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmNsYXNzIFN0cmluZ0xpa2VSZWdleHBNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogc3RyaW5nKSB7XG5cbiAgICBzdXBlcigpO1xuICB9XG5cbiAgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcblxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLnBhdHRlcm4sICdnbScpO1xuXG4gICAgaWYgKHR5cGVvZiBhY3R1YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgYSBzdHJpbmcsIGJ1dCBnb3QgJyR7dHlwZW9mIGFjdHVhbH0nYCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVnZXgudGVzdChhY3R1YWwpKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgU3RyaW5nICcke2FjdHVhbH0nIGRpZCBub3QgbWF0Y2ggcGF0dGVybiAnJHt0aGlzLnBhdHRlcm59J2AsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbn1cbiJdfQ==