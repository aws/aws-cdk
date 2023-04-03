"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * An event pattern matcher
 */
class Match {
    constructor(matchers, options) {
        this.matchers = matchers;
        this.options = options;
        this.creationStack = core_1.captureStackTrace();
    }
    /**
     * Matches a null value in the JSON of the event
     */
    static nullValue() {
        return this.fromObjects([null]);
    }
    /**
     * Matches when the field is present in the JSON of the event
     */
    static exists() {
        return this.fromObjects([{ exists: true }]);
    }
    /**
     * Matches when the field is absent from the JSON of the event
     */
    static doesNotExist() {
        return this.fromObjects([{ exists: false }]);
    }
    /**
     * Matches a string, exactly, in the JSON of the event
     */
    static exactString(value) {
        return this.fromObjects([value]);
    }
    /**
     * Matches a string, regardless of case, in the JSON of the event
     */
    static equalsIgnoreCase(value) {
        return this.fromObjects([{ 'equals-ignore-case': value }]);
    }
    /**
     * Matches strings with the given prefix in the JSON of the event
     */
    static prefix(value) {
        return this.fromObjects([{ prefix: value }]);
    }
    /**
     * Matches strings with the given suffix in the JSON of the event
     */
    static suffix(value) {
        return this.fromObjects([{ suffix: value }]);
    }
    /**
     * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format
     */
    static cidr(range) {
        const ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/igm;
        const ipv6Regex = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/igm;
        if (!ipv4Regex.test(range) && !ipv6Regex.test(range)) {
            throw new Error(`Invalid IP address range: ${range}`);
        }
        return this.fromObjects([{ cidr: range }]);
    }
    /**
     * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format.
     * Alias of `cidr()`.
     */
    static ipAddressRange(range) {
        return Match.cidr(range);
    }
    /**
     * Matches anything except what's provided in the rule. The list of provided values must contain
     * only strings or only numbers.
     */
    static anythingBut(...values) {
        if (values.length === 0) {
            throw new Error('anythingBut matchers must be non-empty lists');
        }
        const allNumbers = values.every(v => typeof (v) === 'number');
        const allStrings = values.every(v => typeof (v) === 'string');
        if (!(allNumbers || allStrings)) {
            throw new Error('anythingBut matchers must be lists that contain only strings or only numbers.');
        }
        return this.fromObjects([{ 'anything-but': values }]);
    }
    /**
     * Matches any string that doesn't start with the given prefix.
     */
    static anythingButPrefix(prefix) {
        return this.fromObjects([{ 'anything-but': { prefix: prefix } }]);
    }
    /**
     * Matches numbers greater than the provided value
     */
    static greaterThan(value) {
        return this.numeric('>', value);
    }
    /**
     * Matches numbers greater than, or equal to, the provided value
     */
    static greaterThanOrEqual(value) {
        return this.numeric('>=', value);
    }
    /**
     * Matches numbers less than the provided value
     */
    static lessThan(value) {
        return this.numeric('<', value);
    }
    /**
     * Matches numbers less than, or equal to, the provided value
     */
    static lessThanOrEqual(value) {
        return this.numeric('<=', value);
    }
    /**
     * Matches numbers equal to the provided value
     */
    static equal(value) {
        return this.numeric('=', value);
    }
    /**
     * Matches numbers inside a closed numeric interval. Equivalent to:
     *
     *    Match.allOf(Match.greaterThanOrEqual(lower), Match.lessThanOrEqual(upper))
     *
     * @param lower Lower bound (inclusive)
     * @param upper Upper bound (inclusive)
     */
    static interval(lower, upper) {
        if (lower > upper) {
            throw new Error(`Invalid interval: [${lower}, ${upper}]`);
        }
        return Match.allOf(Match.greaterThanOrEqual(lower), Match.lessThanOrEqual(upper));
    }
    /**
     * Matches an event if any of the provided matchers do. Only numeric matchers are accepted.
     */
    static allOf(...matchers) {
        if (matchers.length === 0) {
            throw new Error('A list of matchers must contain at least one element.');
        }
        return this.fromMergedObjects(matchers);
    }
    /**
     * Matches an event if any of the provided matchers does.
     */
    static anyOf(...matchers) {
        if (matchers.length === 0) {
            throw new Error('A list of matchers must contain at least one element.');
        }
        return this.fromObjects(matchers);
    }
    static numeric(operator, value) {
        return this.fromObjects([{ numeric: [operator, value] }]);
    }
    static fromObjects(values) {
        return new Match(values, { mergeMatchers: false }).asList();
    }
    static fromMergedObjects(values) {
        return new Match(values, { mergeMatchers: true }).asList();
    }
    resolve(context) {
        const matchers = this.matchers.flatMap(matcher => context.resolve(matcher));
        return this.options.mergeMatchers ? this.merge(matchers) : matchers;
    }
    merge(matchers) {
        // This is the only supported case for merging at the moment.
        // We can generalize this logic if EventBridge starts supporting more cases in the future.
        if (!matchers.every(matcher => matcher?.numeric)) {
            throw new Error('Only numeric matchers can be merged into a single matcher.');
        }
        return [{ numeric: matchers.flatMap(matcher => matcher.numeric) }];
    }
    toString() {
        return core_1.Token.asString(this);
    }
    /**
     * A representation of this matcher as a list of strings
     */
    asList() {
        return core_1.Token.asList(this);
    }
}
exports.Match = Match;
_a = JSII_RTTI_SYMBOL_1;
Match[_a] = { fqn: "@aws-cdk/aws-events.Match", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtcGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBdUY7QUFjdkY7O0dBRUc7QUFDSCxNQUFhLEtBQUs7SUF3TGhCLFlBQXFDLFFBQWUsRUFDakMsT0FBcUI7UUFESCxhQUFRLEdBQVIsUUFBUSxDQUFPO1FBQ2pDLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyx3QkFBaUIsRUFBRSxDQUFDO0tBQzFDO0lBMUxEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVM7UUFDckIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNqQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWTtRQUN4QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDOUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBYTtRQUNyQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBYTtRQUMxQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM1RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFhO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFhO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFhO1FBQzlCLE1BQU0sU0FBUyxHQUFHLGdFQUFnRSxDQUFDO1FBQ25GLE1BQU0sU0FBUyxHQUFHLHNpQ0FBc2lDLENBQUM7UUFFempDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFhO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFhO1FBQ3hDLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztRQUM5RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7U0FDbEc7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFjO1FBQzVDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ25FO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWE7UUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNqQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQWE7UUFDNUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDakM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBYTtRQUN6QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWE7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQ2pELElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixLQUFLLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQztTQUMzRDtRQUVELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ25GO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBZTtRQUNwQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUMxRTtRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3pDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBZTtRQUNwQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUMxRTtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuQztJQUVPLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBNEIsRUFBRSxLQUFhO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzNEO0lBRU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFhO1FBQ3RDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDN0Q7SUFFTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBYTtRQUM1QyxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzVEO0lBU0QsT0FBTyxDQUFDLE9BQXdCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUNyRTtJQUVPLEtBQUssQ0FBQyxRQUFlO1FBQzNCLDZEQUE2RDtRQUM3RCwwRkFBMEY7UUFDMUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BFO0lBRUQsUUFBUTtRQUNOLE9BQU8sWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtJQUVEOztPQUVHO0lBQ0gsTUFBTTtRQUNKLE9BQU8sWUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjs7QUFyTkgsc0JBc05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2FwdHVyZVN0YWNrVHJhY2UsIElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbnR5cGUgQ29tcGFyaXNvbk9wZXJhdG9yID0gJz4nIHwgJz49JyB8ICc8JyB8ICc8PScgfCAnPSc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRvIGNvbnN0cnVjdCBtYXRjaGVyc1xuICovXG5pbnRlcmZhY2UgTWF0Y2hPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxpc3Qgb2YgbWF0Y2hlcnMgc2hvdWxkIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIG1hdGNoZXJcbiAgICovXG4gIHJlYWRvbmx5IG1lcmdlTWF0Y2hlcnM6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQW4gZXZlbnQgcGF0dGVybiBtYXRjaGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgLyoqXG4gICAqIE1hdGNoZXMgYSBudWxsIHZhbHVlIGluIHRoZSBKU09OIG9mIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudWxsVmFsdWUoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFtudWxsXSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyB3aGVuIHRoZSBmaWVsZCBpcyBwcmVzZW50IGluIHRoZSBKU09OIG9mIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleGlzdHMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFt7IGV4aXN0czogdHJ1ZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyB3aGVuIHRoZSBmaWVsZCBpcyBhYnNlbnQgZnJvbSB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZG9lc05vdEV4aXN0KCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBleGlzdHM6IGZhbHNlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGEgc3RyaW5nLCBleGFjdGx5LCBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhhY3RTdHJpbmcodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbdmFsdWVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGEgc3RyaW5nLCByZWdhcmRsZXNzIG9mIGNhc2UsIGluIHRoZSBKU09OIG9mIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBlcXVhbHNJZ25vcmVDYXNlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgJ2VxdWFscy1pZ25vcmUtY2FzZSc6IHZhbHVlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gcHJlZml4IGluIHRoZSBKU09OIG9mIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwcmVmaXgodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBwcmVmaXg6IHZhbHVlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIHN0cmluZ3Mgd2l0aCB0aGUgZ2l2ZW4gc3VmZml4IGluIHRoZSBKU09OIG9mIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdWZmaXgodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBzdWZmaXg6IHZhbHVlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIElQdjQgYW5kIElQdjYgbmV0d29yayBhZGRyZXNzZXMgdXNpbmcgdGhlIENsYXNzbGVzcyBJbnRlci1Eb21haW4gUm91dGluZyAoQ0lEUikgZm9ybWF0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNpZHIocmFuZ2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBpcHY0UmVnZXggPSAvXihbMC05XXsxLDN9XFwuKXszfVswLTldezEsM30oXFwvKFswLTldfFsxLTJdWzAtOV18M1swLTJdKSk/JC9pZ207XG4gICAgY29uc3QgaXB2NlJlZ2V4ID0gL15zKigoKFswLTlBLUZhLWZdezEsNH06KXs3fShbMC05QS1GYS1mXXsxLDR9fDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs2fSg6WzAtOUEtRmEtZl17MSw0fXwoKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezV9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsMn0pfDooKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezR9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsM30pfCgoOlswLTlBLUZhLWZdezEsNH0pPzooKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXszfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDR9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDJ9OigoMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSguKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezJ9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNX0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsM306KCgyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKC4oMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7MX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw2fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw0fTooKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSkpfDopKXwoOigoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDd9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDV9OigoMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSguKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkpezN9KSl8OikpKSglLispP3MqKFxcLyhbMC05XXxbMS05XVswLTldfDFbMC0xXVswLTldfDEyWzAtOF0pKT8kL2lnbTtcblxuICAgIGlmICghaXB2NFJlZ2V4LnRlc3QocmFuZ2UpICYmICFpcHY2UmVnZXgudGVzdChyYW5nZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBJUCBhZGRyZXNzIHJhbmdlOiAke3JhbmdlfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFt7IGNpZHI6IHJhbmdlIH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIElQdjQgYW5kIElQdjYgbmV0d29yayBhZGRyZXNzZXMgdXNpbmcgdGhlIENsYXNzbGVzcyBJbnRlci1Eb21haW4gUm91dGluZyAoQ0lEUikgZm9ybWF0LlxuICAgKiBBbGlhcyBvZiBgY2lkcigpYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXBBZGRyZXNzUmFuZ2UocmFuZ2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gTWF0Y2guY2lkcihyYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbnl0aGluZyBleGNlcHQgd2hhdCdzIHByb3ZpZGVkIGluIHRoZSBydWxlLiBUaGUgbGlzdCBvZiBwcm92aWRlZCB2YWx1ZXMgbXVzdCBjb250YWluXG4gICAqIG9ubHkgc3RyaW5ncyBvciBvbmx5IG51bWJlcnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueXRoaW5nQnV0KC4uLnZhbHVlczogYW55W10pOiBzdHJpbmdbXSB7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYW55dGhpbmdCdXQgbWF0Y2hlcnMgbXVzdCBiZSBub24tZW1wdHkgbGlzdHMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbGxOdW1iZXJzID0gdmFsdWVzLmV2ZXJ5KHYgPT4gdHlwZW9mICh2KSA9PT0gJ251bWJlcicpO1xuICAgIGNvbnN0IGFsbFN0cmluZ3MgPSB2YWx1ZXMuZXZlcnkodiA9PiB0eXBlb2YgKHYpID09PSAnc3RyaW5nJyk7XG5cbiAgICBpZiAoIShhbGxOdW1iZXJzIHx8IGFsbFN0cmluZ3MpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FueXRoaW5nQnV0IG1hdGNoZXJzIG11c3QgYmUgbGlzdHMgdGhhdCBjb250YWluIG9ubHkgc3RyaW5ncyBvciBvbmx5IG51bWJlcnMuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgJ2FueXRoaW5nLWJ1dCc6IHZhbHVlcyB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbnkgc3RyaW5nIHRoYXQgZG9lc24ndCBzdGFydCB3aXRoIHRoZSBnaXZlbiBwcmVmaXguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueXRoaW5nQnV0UHJlZml4KHByZWZpeDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFt7ICdhbnl0aGluZy1idXQnOiB7IHByZWZpeDogcHJlZml4IH0gfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgbnVtYmVycyBncmVhdGVyIHRoYW4gdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdyZWF0ZXJUaGFuKHZhbHVlOiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubnVtZXJpYygnPicsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgZ3JlYXRlciB0aGFuLCBvciBlcXVhbCB0bywgdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdyZWF0ZXJUaGFuT3JFcXVhbCh2YWx1ZTogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm51bWVyaWMoJz49JywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgbnVtYmVycyBsZXNzIHRoYW4gdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxlc3NUaGFuKHZhbHVlOiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubnVtZXJpYygnPCcsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgbGVzcyB0aGFuLCBvciBlcXVhbCB0bywgdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxlc3NUaGFuT3JFcXVhbCh2YWx1ZTogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm51bWVyaWMoJzw9JywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgbnVtYmVycyBlcXVhbCB0byB0aGUgcHJvdmlkZWQgdmFsdWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXF1YWwodmFsdWU6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5udW1lcmljKCc9JywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgbnVtYmVycyBpbnNpZGUgYSBjbG9zZWQgbnVtZXJpYyBpbnRlcnZhbC4gRXF1aXZhbGVudCB0bzpcbiAgICpcbiAgICogICAgTWF0Y2guYWxsT2YoTWF0Y2guZ3JlYXRlclRoYW5PckVxdWFsKGxvd2VyKSwgTWF0Y2gubGVzc1RoYW5PckVxdWFsKHVwcGVyKSlcbiAgICpcbiAgICogQHBhcmFtIGxvd2VyIExvd2VyIGJvdW5kIChpbmNsdXNpdmUpXG4gICAqIEBwYXJhbSB1cHBlciBVcHBlciBib3VuZCAoaW5jbHVzaXZlKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbnRlcnZhbChsb3dlcjogbnVtYmVyLCB1cHBlcjogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIGlmIChsb3dlciA+IHVwcGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW50ZXJ2YWw6IFske2xvd2VyfSwgJHt1cHBlcn1dYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGNoLmFsbE9mKE1hdGNoLmdyZWF0ZXJUaGFuT3JFcXVhbChsb3dlciksIE1hdGNoLmxlc3NUaGFuT3JFcXVhbCh1cHBlcikpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgYW4gZXZlbnQgaWYgYW55IG9mIHRoZSBwcm92aWRlZCBtYXRjaGVycyBkby4gT25seSBudW1lcmljIG1hdGNoZXJzIGFyZSBhY2NlcHRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWxsT2YoLi4ubWF0Y2hlcnM6IGFueVtdKTogc3RyaW5nW10ge1xuICAgIGlmIChtYXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBsaXN0IG9mIG1hdGNoZXJzIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgZWxlbWVudC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tTWVyZ2VkT2JqZWN0cyhtYXRjaGVycyk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhbiBldmVudCBpZiBhbnkgb2YgdGhlIHByb3ZpZGVkIG1hdGNoZXJzIGRvZXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueU9mKC4uLm1hdGNoZXJzOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICBpZiAobWF0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbGlzdCBvZiBtYXRjaGVycyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIGVsZW1lbnQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKG1hdGNoZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIG51bWVyaWMob3BlcmF0b3I6IENvbXBhcmlzb25PcGVyYXRvciwgdmFsdWU6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBudW1lcmljOiBbb3BlcmF0b3IsIHZhbHVlXSB9XSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBmcm9tT2JqZWN0cyh2YWx1ZXM6IGFueVtdKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBuZXcgTWF0Y2godmFsdWVzLCB7IG1lcmdlTWF0Y2hlcnM6IGZhbHNlIH0pLmFzTGlzdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZnJvbU1lcmdlZE9iamVjdHModmFsdWVzOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gbmV3IE1hdGNoKHZhbHVlcywgeyBtZXJnZU1hdGNoZXJzOiB0cnVlIH0pLmFzTGlzdCgpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtYXRjaGVyczogYW55W10sXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBNYXRjaE9wdGlvbnMpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIGNvbnN0IG1hdGNoZXJzID0gdGhpcy5tYXRjaGVycy5mbGF0TWFwKG1hdGNoZXIgPT4gY29udGV4dC5yZXNvbHZlKG1hdGNoZXIpKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1lcmdlTWF0Y2hlcnMgPyB0aGlzLm1lcmdlKG1hdGNoZXJzKSA6IG1hdGNoZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZShtYXRjaGVyczogYW55W10pOiBhbnkge1xuICAgIC8vIFRoaXMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGNhc2UgZm9yIG1lcmdpbmcgYXQgdGhlIG1vbWVudC5cbiAgICAvLyBXZSBjYW4gZ2VuZXJhbGl6ZSB0aGlzIGxvZ2ljIGlmIEV2ZW50QnJpZGdlIHN0YXJ0cyBzdXBwb3J0aW5nIG1vcmUgY2FzZXMgaW4gdGhlIGZ1dHVyZS5cbiAgICBpZiAoIW1hdGNoZXJzLmV2ZXJ5KG1hdGNoZXIgPT4gbWF0Y2hlcj8ubnVtZXJpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBudW1lcmljIG1hdGNoZXJzIGNhbiBiZSBtZXJnZWQgaW50byBhIHNpbmdsZSBtYXRjaGVyLicpO1xuICAgIH1cblxuICAgIHJldHVybiBbeyBudW1lcmljOiBtYXRjaGVycy5mbGF0TWFwKG1hdGNoZXIgPT4gbWF0Y2hlci5udW1lcmljKSB9XTtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBtYXRjaGVyIGFzIGEgbGlzdCBvZiBzdHJpbmdzXG4gICAqL1xuICBhc0xpc3QoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QodGhpcyk7XG4gIH1cbn1cblxuXG4vKipcbiAqIEV2ZW50cyBpbiBBbWF6b24gQ2xvdWRXYXRjaCBFdmVudHMgYXJlIHJlcHJlc2VudGVkIGFzIEpTT04gb2JqZWN0cy4gRm9yIG1vcmVcbiAqIGluZm9ybWF0aW9uIGFib3V0IEpTT04gb2JqZWN0cywgc2VlIFJGQyA3MTU5LlxuICpcbiAqICoqSW1wb3J0YW50Kio6IHRoaXMgY2xhc3MgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIGEgYFJ1bGVgIGNsYXNzLiBJbiBwYXJ0aWN1bGFyLFxuICogZG8gbm90IHVzZSBpdCB3aXRoIGBDZm5SdWxlYCBjbGFzczogeW91ciBwYXR0ZXJuIHdpbGwgbm90IGJlIHJlbmRlcmVkXG4gKiBjb3JyZWN0bHkuIEluIGEgYENmblJ1bGVgIGNsYXNzLCB3cml0ZSB0aGUgcGF0dGVybiBhcyB5b3Ugbm9ybWFsbHkgd291bGQgd2hlblxuICogZGlyZWN0bHkgd3JpdGluZyBDbG91ZEZvcm1hdGlvbi5cbiAqXG4gKiBSdWxlcyB1c2UgZXZlbnQgcGF0dGVybnMgdG8gc2VsZWN0IGV2ZW50cyBhbmQgcm91dGUgdGhlbSB0byB0YXJnZXRzLiBBXG4gKiBwYXR0ZXJuIGVpdGhlciBtYXRjaGVzIGFuIGV2ZW50IG9yIGl0IGRvZXNuJ3QuIEV2ZW50IHBhdHRlcm5zIGFyZSByZXByZXNlbnRlZFxuICogYXMgSlNPTiBvYmplY3RzIHdpdGggYSBzdHJ1Y3R1cmUgdGhhdCBpcyBzaW1pbGFyIHRvIHRoYXQgb2YgZXZlbnRzLlxuICpcbiAqIEl0IGlzIGltcG9ydGFudCB0byByZW1lbWJlciB0aGUgZm9sbG93aW5nIGFib3V0IGV2ZW50IHBhdHRlcm4gbWF0Y2hpbmc6XG4gKlxuICogLSBGb3IgYSBwYXR0ZXJuIHRvIG1hdGNoIGFuIGV2ZW50LCB0aGUgZXZlbnQgbXVzdCBjb250YWluIGFsbCB0aGUgZmllbGQgbmFtZXNcbiAqICAgbGlzdGVkIGluIHRoZSBwYXR0ZXJuLiBUaGUgZmllbGQgbmFtZXMgbXVzdCBhcHBlYXIgaW4gdGhlIGV2ZW50IHdpdGggdGhlXG4gKiAgIHNhbWUgbmVzdGluZyBzdHJ1Y3R1cmUuXG4gKlxuICogLSBPdGhlciBmaWVsZHMgb2YgdGhlIGV2ZW50IG5vdCBtZW50aW9uZWQgaW4gdGhlIHBhdHRlcm4gYXJlIGlnbm9yZWQ7XG4gKiAgIGVmZmVjdGl2ZWx5LCB0aGVyZSBpcyBhIGBgXCIqXCI6IFwiKlwiYGAgd2lsZGNhcmQgZm9yIGZpZWxkcyBub3QgbWVudGlvbmVkLlxuICpcbiAqIC0gVGhlIG1hdGNoaW5nIGlzIGV4YWN0IChjaGFyYWN0ZXItYnktY2hhcmFjdGVyKSwgd2l0aG91dCBjYXNlLWZvbGRpbmcgb3IgYW55XG4gKiAgIG90aGVyIHN0cmluZyBub3JtYWxpemF0aW9uLlxuICpcbiAqIC0gVGhlIHZhbHVlcyBiZWluZyBtYXRjaGVkIGZvbGxvdyBKU09OIHJ1bGVzOiBTdHJpbmdzIGVuY2xvc2VkIGluIHF1b3RlcyxcbiAqICAgbnVtYmVycywgYW5kIHRoZSB1bnF1b3RlZCBrZXl3b3JkcyB0cnVlLCBmYWxzZSwgYW5kIG51bGwuXG4gKlxuICogLSBOdW1iZXIgbWF0Y2hpbmcgaXMgYXQgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBsZXZlbC4gRm9yIGV4YW1wbGUsIDMwMCxcbiAqICAgMzAwLjAsIGFuZCAzLjBlMiBhcmUgbm90IGNvbnNpZGVyZWQgZXF1YWwuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvZXZlbnRzL0Nsb3VkV2F0Y2hFdmVudHNhbmRFdmVudFBhdHRlcm5zLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudFBhdHRlcm4ge1xuICAvKipcbiAgICogQnkgZGVmYXVsdCwgdGhpcyBpcyBzZXQgdG8gMCAoemVybykgaW4gYWxsIGV2ZW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIHVuaXF1ZSB2YWx1ZSBpcyBnZW5lcmF0ZWQgZm9yIGV2ZXJ5IGV2ZW50LiBUaGlzIGNhbiBiZSBoZWxwZnVsIGluXG4gICAqIHRyYWNpbmcgZXZlbnRzIGFzIHRoZXkgbW92ZSB0aHJvdWdoIHJ1bGVzIHRvIHRhcmdldHMsIGFuZCBhcmUgcHJvY2Vzc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiBpZFxuICAgKi9cbiAgcmVhZG9ubHkgaWQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogSWRlbnRpZmllcywgaW4gY29tYmluYXRpb24gd2l0aCB0aGUgc291cmNlIGZpZWxkLCB0aGUgZmllbGRzIGFuZCB2YWx1ZXNcbiAgICogdGhhdCBhcHBlYXIgaW4gdGhlIGRldGFpbCBmaWVsZC5cbiAgICpcbiAgICogUmVwcmVzZW50cyB0aGUgXCJkZXRhaWwtdHlwZVwiIGV2ZW50IGZpZWxkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiBkZXRhaWwgdHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgZGV0YWlsVHlwZT86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHRoZSBzZXJ2aWNlIHRoYXQgc291cmNlZCB0aGUgZXZlbnQuIEFsbCBldmVudHMgc291cmNlZCBmcm9tXG4gICAqIHdpdGhpbiBBV1MgYmVnaW4gd2l0aCBcImF3cy5cIiBDdXN0b21lci1nZW5lcmF0ZWQgZXZlbnRzIGNhbiBoYXZlIGFueSB2YWx1ZVxuICAgKiBoZXJlLCBhcyBsb25nIGFzIGl0IGRvZXNuJ3QgYmVnaW4gd2l0aCBcImF3cy5cIiBXZSByZWNvbW1lbmQgdGhlIHVzZSBvZlxuICAgKiBKYXZhIHBhY2thZ2UtbmFtZSBzdHlsZSByZXZlcnNlIGRvbWFpbi1uYW1lIHN0cmluZ3MuXG4gICAqXG4gICAqIFRvIGZpbmQgdGhlIGNvcnJlY3QgdmFsdWUgZm9yIHNvdXJjZSBmb3IgYW4gQVdTIHNlcnZpY2UsIHNlZSB0aGUgdGFibGUgaW5cbiAgICogQVdTIFNlcnZpY2UgTmFtZXNwYWNlcy4gRm9yIGV4YW1wbGUsIHRoZSBzb3VyY2UgdmFsdWUgZm9yIEFtYXpvblxuICAgKiBDbG91ZEZyb250IGlzIGF3cy5jbG91ZGZyb250LlxuICAgKlxuICAgKiBAc2VlIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2dlbmVyYWwvbGF0ZXN0L2dyL2F3cy1hcm5zLWFuZC1uYW1lc3BhY2VzLmh0bWwjZ2VucmVmLWF3cy1zZXJ2aWNlLW5hbWVzcGFjZXNcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gc291cmNlXG4gICAqL1xuICByZWFkb25seSBzb3VyY2U/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIDEyLWRpZ2l0IG51bWJlciBpZGVudGlmeWluZyBhbiBBV1MgYWNjb3VudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gYWNjb3VudFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgdGltZXN0YW1wLCB3aGljaCBjYW4gYmUgc3BlY2lmaWVkIGJ5IHRoZSBzZXJ2aWNlIG9yaWdpbmF0aW5nXG4gICAqIHRoZSBldmVudC4gSWYgdGhlIGV2ZW50IHNwYW5zIGEgdGltZSBpbnRlcnZhbCwgdGhlIHNlcnZpY2UgbWlnaHQgY2hvb3NlXG4gICAqIHRvIHJlcG9ydCB0aGUgc3RhcnQgdGltZSwgc28gdGhpcyB2YWx1ZSBjYW4gYmUgbm90aWNlYWJseSBiZWZvcmUgdGhlIHRpbWVcbiAgICogdGhlIGV2ZW50IGlzIGFjdHVhbGx5IHJlY2VpdmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiB0aW1lXG4gICAqL1xuICByZWFkb25seSB0aW1lPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMgdGhlIEFXUyByZWdpb24gd2hlcmUgdGhlIGV2ZW50IG9yaWdpbmF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIHJlZ2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoaXMgSlNPTiBhcnJheSBjb250YWlucyBBUk5zIHRoYXQgaWRlbnRpZnkgcmVzb3VyY2VzIHRoYXQgYXJlIGludm9sdmVkXG4gICAqIGluIHRoZSBldmVudC4gSW5jbHVzaW9uIG9mIHRoZXNlIEFSTnMgaXMgYXQgdGhlIGRpc2NyZXRpb24gb2YgdGhlXG4gICAqIHNlcnZpY2UuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBBbWF6b24gRUMyIGluc3RhbmNlIHN0YXRlLWNoYW5nZXMgaW5jbHVkZSBBbWF6b24gRUMyXG4gICAqIGluc3RhbmNlIEFSTnMsIEF1dG8gU2NhbGluZyBldmVudHMgaW5jbHVkZSBBUk5zIGZvciBib3RoIGluc3RhbmNlcyBhbmRcbiAgICogQXV0byBTY2FsaW5nIGdyb3VwcywgYnV0IEFQSSBjYWxscyB3aXRoIEFXUyBDbG91ZFRyYWlsIGRvIG5vdCBpbmNsdWRlXG4gICAqIHJlc291cmNlIEFSTnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIHJlc291cmNlXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQSBKU09OIG9iamVjdCwgd2hvc2UgY29udGVudCBpcyBhdCB0aGUgZGlzY3JldGlvbiBvZiB0aGUgc2VydmljZVxuICAgKiBvcmlnaW5hdGluZyB0aGUgZXZlbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIGRldGFpbFxuICAgKi9cbiAgcmVhZG9ubHkgZGV0YWlsPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cbiJdfQ==