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
    constructor(matchers, options) {
        this.matchers = matchers;
        this.options = options;
        this.creationStack = (0, core_1.captureStackTrace)();
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
_a = JSII_RTTI_SYMBOL_1;
Match[_a] = { fqn: "@aws-cdk/aws-events.Match", version: "0.0.0" };
exports.Match = Match;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtcGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBdUY7QUFjdkY7O0dBRUc7QUFDSCxNQUFhLEtBQUs7SUFDaEI7O09BRUc7SUFDSSxNQUFNLENBQUMsU0FBUztRQUNyQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsTUFBTTtRQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFhO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFhO1FBQzFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWE7UUFDaEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWE7UUFDaEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENB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QUFxQyxRQUFlLEVBQ2pDLE9BQXFCO1FBREgsYUFBUSxHQUFSLFFBQVEsQ0FBTztRQUNqQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBQSx3QkFBaUIsR0FBRSxDQUFDO0tBQzFDO0lBRUQsT0FBTyxDQUFDLE9BQXdCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUNyRTtJQUVPLEtBQUssQ0FBQyxRQUFlO1FBQzNCLDZEQUE2RDtRQUM3RCwwRkFBMEY7UUFDMUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BFO0lBRUQsUUFBUTtRQUNOLE9BQU8sWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3QjtJQUVEOztPQUVHO0lBQ0gsTUFBTTtRQUNKLE9BQU8sWUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjs7OztBQXJOVSxzQkFBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNhcHR1cmVTdGFja1RyYWNlLCBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0LCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG50eXBlIENvbXBhcmlzb25PcGVyYXRvciA9ICc+JyB8ICc+PScgfCAnPCcgfCAnPD0nIHwgJz0nO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGhvdyB0byBjb25zdHJ1Y3QgbWF0Y2hlcnNcbiAqL1xuaW50ZXJmYWNlIE1hdGNoT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsaXN0IG9mIG1hdGNoZXJzIHNob3VsZCBiZSBtZXJnZWQgaW50byBhIHNpbmdsZSBtYXRjaGVyXG4gICAqL1xuICByZWFkb25seSBtZXJnZU1hdGNoZXJzOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEFuIGV2ZW50IHBhdHRlcm4gbWF0Y2hlclxuICovXG5leHBvcnQgY2xhc3MgTWF0Y2ggaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIC8qKlxuICAgKiBNYXRjaGVzIGEgbnVsbCB2YWx1ZSBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVsbFZhbHVlKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbbnVsbF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgd2hlbiB0aGUgZmllbGQgaXMgcHJlc2VudCBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXhpc3RzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBleGlzdHM6IHRydWUgfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgd2hlbiB0aGUgZmllbGQgaXMgYWJzZW50IGZyb20gdGhlIEpTT04gb2YgdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGRvZXNOb3RFeGlzdCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgZXhpc3RzOiBmYWxzZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhIHN0cmluZywgZXhhY3RseSwgaW4gdGhlIEpTT04gb2YgdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGV4YWN0U3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3ZhbHVlXSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBhIHN0cmluZywgcmVnYXJkbGVzcyBvZiBjYXNlLCBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZXF1YWxzSWdub3JlQ2FzZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFt7ICdlcXVhbHMtaWdub3JlLWNhc2UnOiB2YWx1ZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHByZWZpeCBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcHJlZml4KHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgcHJlZml4OiB2YWx1ZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBzdHJpbmdzIHdpdGggdGhlIGdpdmVuIHN1ZmZpeCBpbiB0aGUgSlNPTiBvZiB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3VmZml4KHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgc3VmZml4OiB2YWx1ZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBJUHY0IGFuZCBJUHY2IG5ldHdvcmsgYWRkcmVzc2VzIHVzaW5nIHRoZSBDbGFzc2xlc3MgSW50ZXItRG9tYWluIFJvdXRpbmcgKENJRFIpIGZvcm1hdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjaWRyKHJhbmdlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgaXB2NFJlZ2V4ID0gL14oWzAtOV17MSwzfVxcLil7M31bMC05XXsxLDN9KFxcLyhbMC05XXxbMS0yXVswLTldfDNbMC0yXSkpPyQvaWdtO1xuICAgIGNvbnN0IGlwdjZSZWdleCA9IC9ecyooKChbMC05QS1GYS1mXXsxLDR9Oil7N30oWzAtOUEtRmEtZl17MSw0fXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Nn0oOlswLTlBLUZhLWZdezEsNH18KCgyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKC4oMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs1fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDJ9KXw6KCgyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKC4oMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs0fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDN9KXwoKDpbMC05QS1GYS1mXXsxLDR9KT86KCgyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKC4oMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7M30oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw0fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwyfTooKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsyfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDV9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDN9OigoMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSguKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezF9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNn0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNH06KCgyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKC4oMjVbMC01XXwyWzAtNF1kfDFkZHxbMS05XT9kKSl7M30pKXw6KSl8KDooKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw3fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw1fTooKDI1WzAtNV18MlswLTRdZHwxZGR8WzEtOV0/ZCkoLigyNVswLTVdfDJbMC00XWR8MWRkfFsxLTldP2QpKXszfSkpfDopKSkoJS4rKT9zKihcXC8oWzAtOV18WzEtOV1bMC05XXwxWzAtMV1bMC05XXwxMlswLThdKSk/JC9pZ207XG5cbiAgICBpZiAoIWlwdjRSZWdleC50ZXN0KHJhbmdlKSAmJiAhaXB2NlJlZ2V4LnRlc3QocmFuZ2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSVAgYWRkcmVzcyByYW5nZTogJHtyYW5nZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyBjaWRyOiByYW5nZSB9XSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBJUHY0IGFuZCBJUHY2IG5ldHdvcmsgYWRkcmVzc2VzIHVzaW5nIHRoZSBDbGFzc2xlc3MgSW50ZXItRG9tYWluIFJvdXRpbmcgKENJRFIpIGZvcm1hdC5cbiAgICogQWxpYXMgb2YgYGNpZHIoKWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlwQWRkcmVzc1JhbmdlKHJhbmdlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIE1hdGNoLmNpZHIocmFuZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgYW55dGhpbmcgZXhjZXB0IHdoYXQncyBwcm92aWRlZCBpbiB0aGUgcnVsZS4gVGhlIGxpc3Qgb2YgcHJvdmlkZWQgdmFsdWVzIG11c3QgY29udGFpblxuICAgKiBvbmx5IHN0cmluZ3Mgb3Igb25seSBudW1iZXJzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnl0aGluZ0J1dCguLi52YWx1ZXM6IGFueVtdKTogc3RyaW5nW10ge1xuICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FueXRoaW5nQnV0IG1hdGNoZXJzIG11c3QgYmUgbm9uLWVtcHR5IGxpc3RzJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYWxsTnVtYmVycyA9IHZhbHVlcy5ldmVyeSh2ID0+IHR5cGVvZiAodikgPT09ICdudW1iZXInKTtcbiAgICBjb25zdCBhbGxTdHJpbmdzID0gdmFsdWVzLmV2ZXJ5KHYgPT4gdHlwZW9mICh2KSA9PT0gJ3N0cmluZycpO1xuXG4gICAgaWYgKCEoYWxsTnVtYmVycyB8fCBhbGxTdHJpbmdzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbnl0aGluZ0J1dCBtYXRjaGVycyBtdXN0IGJlIGxpc3RzIHRoYXQgY29udGFpbiBvbmx5IHN0cmluZ3Mgb3Igb25seSBudW1iZXJzLicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZyb21PYmplY3RzKFt7ICdhbnl0aGluZy1idXQnOiB2YWx1ZXMgfV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgYW55IHN0cmluZyB0aGF0IGRvZXNuJ3Qgc3RhcnQgd2l0aCB0aGUgZ2l2ZW4gcHJlZml4LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnl0aGluZ0J1dFByZWZpeChwcmVmaXg6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhbeyAnYW55dGhpbmctYnV0JzogeyBwcmVmaXg6IHByZWZpeCB9IH1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgZ3JlYXRlciB0aGFuIHRoZSBwcm92aWRlZCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBncmVhdGVyVGhhbih2YWx1ZTogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm51bWVyaWMoJz4nLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBudW1iZXJzIGdyZWF0ZXIgdGhhbiwgb3IgZXF1YWwgdG8sIHRoZSBwcm92aWRlZCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBncmVhdGVyVGhhbk9yRXF1YWwodmFsdWU6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5udW1lcmljKCc+PScsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgbGVzcyB0aGFuIHRoZSBwcm92aWRlZCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsZXNzVGhhbih2YWx1ZTogbnVtYmVyKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm51bWVyaWMoJzwnLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTWF0Y2hlcyBudW1iZXJzIGxlc3MgdGhhbiwgb3IgZXF1YWwgdG8sIHRoZSBwcm92aWRlZCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsZXNzVGhhbk9yRXF1YWwodmFsdWU6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5udW1lcmljKCc8PScsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGVxdWFsKHZhbHVlOiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubnVtZXJpYygnPScsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIG51bWJlcnMgaW5zaWRlIGEgY2xvc2VkIG51bWVyaWMgaW50ZXJ2YWwuIEVxdWl2YWxlbnQgdG86XG4gICAqXG4gICAqICAgIE1hdGNoLmFsbE9mKE1hdGNoLmdyZWF0ZXJUaGFuT3JFcXVhbChsb3dlciksIE1hdGNoLmxlc3NUaGFuT3JFcXVhbCh1cHBlcikpXG4gICAqXG4gICAqIEBwYXJhbSBsb3dlciBMb3dlciBib3VuZCAoaW5jbHVzaXZlKVxuICAgKiBAcGFyYW0gdXBwZXIgVXBwZXIgYm91bmQgKGluY2x1c2l2ZSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaW50ZXJ2YWwobG93ZXI6IG51bWJlciwgdXBwZXI6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICBpZiAobG93ZXIgPiB1cHBlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGludGVydmFsOiBbJHtsb3dlcn0sICR7dXBwZXJ9XWApO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRjaC5hbGxPZihNYXRjaC5ncmVhdGVyVGhhbk9yRXF1YWwobG93ZXIpLCBNYXRjaC5sZXNzVGhhbk9yRXF1YWwodXBwZXIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXRjaGVzIGFuIGV2ZW50IGlmIGFueSBvZiB0aGUgcHJvdmlkZWQgbWF0Y2hlcnMgZG8uIE9ubHkgbnVtZXJpYyBtYXRjaGVycyBhcmUgYWNjZXB0ZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbE9mKC4uLm1hdGNoZXJzOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICBpZiAobWF0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbGlzdCBvZiBtYXRjaGVycyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIGVsZW1lbnQuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbU1lcmdlZE9iamVjdHMobWF0Y2hlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoZXMgYW4gZXZlbnQgaWYgYW55IG9mIHRoZSBwcm92aWRlZCBtYXRjaGVycyBkb2VzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlPZiguLi5tYXRjaGVyczogYW55W10pOiBzdHJpbmdbXSB7XG4gICAgaWYgKG1hdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGxpc3Qgb2YgbWF0Y2hlcnMgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBlbGVtZW50LicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5mcm9tT2JqZWN0cyhtYXRjaGVycyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBudW1lcmljKG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IsIHZhbHVlOiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbU9iamVjdHMoW3sgbnVtZXJpYzogW29wZXJhdG9yLCB2YWx1ZV0gfV0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZnJvbU9iamVjdHModmFsdWVzOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gbmV3IE1hdGNoKHZhbHVlcywgeyBtZXJnZU1hdGNoZXJzOiBmYWxzZSB9KS5hc0xpc3QoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGZyb21NZXJnZWRPYmplY3RzKHZhbHVlczogYW55W10pOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIG5ldyBNYXRjaCh2YWx1ZXMsIHsgbWVyZ2VNYXRjaGVyczogdHJ1ZSB9KS5hc0xpc3QoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWF0Y2hlcnM6IGFueVtdLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogTWF0Y2hPcHRpb25zKSB7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICBjb25zdCBtYXRjaGVycyA9IHRoaXMubWF0Y2hlcnMuZmxhdE1hcChtYXRjaGVyID0+IGNvbnRleHQucmVzb2x2ZShtYXRjaGVyKSk7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tZXJnZU1hdGNoZXJzID8gdGhpcy5tZXJnZShtYXRjaGVycykgOiBtYXRjaGVycztcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2UobWF0Y2hlcnM6IGFueVtdKTogYW55IHtcbiAgICAvLyBUaGlzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBjYXNlIGZvciBtZXJnaW5nIGF0IHRoZSBtb21lbnQuXG4gICAgLy8gV2UgY2FuIGdlbmVyYWxpemUgdGhpcyBsb2dpYyBpZiBFdmVudEJyaWRnZSBzdGFydHMgc3VwcG9ydGluZyBtb3JlIGNhc2VzIGluIHRoZSBmdXR1cmUuXG4gICAgaWYgKCFtYXRjaGVycy5ldmVyeShtYXRjaGVyID0+IG1hdGNoZXI/Lm51bWVyaWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgbnVtZXJpYyBtYXRjaGVycyBjYW4gYmUgbWVyZ2VkIGludG8gYSBzaW5nbGUgbWF0Y2hlci4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3sgbnVtZXJpYzogbWF0Y2hlcnMuZmxhdE1hcChtYXRjaGVyID0+IG1hdGNoZXIubnVtZXJpYykgfV07XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgbWF0Y2hlciBhcyBhIGxpc3Qgb2Ygc3RyaW5nc1xuICAgKi9cbiAgYXNMaXN0KCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KHRoaXMpO1xuICB9XG59XG5cblxuLyoqXG4gKiBFdmVudHMgaW4gQW1hem9uIENsb3VkV2F0Y2ggRXZlbnRzIGFyZSByZXByZXNlbnRlZCBhcyBKU09OIG9iamVjdHMuIEZvciBtb3JlXG4gKiBpbmZvcm1hdGlvbiBhYm91dCBKU09OIG9iamVjdHMsIHNlZSBSRkMgNzE1OS5cbiAqXG4gKiAqKkltcG9ydGFudCoqOiB0aGlzIGNsYXNzIGNhbiBvbmx5IGJlIHVzZWQgd2l0aCBhIGBSdWxlYCBjbGFzcy4gSW4gcGFydGljdWxhcixcbiAqIGRvIG5vdCB1c2UgaXQgd2l0aCBgQ2ZuUnVsZWAgY2xhc3M6IHlvdXIgcGF0dGVybiB3aWxsIG5vdCBiZSByZW5kZXJlZFxuICogY29ycmVjdGx5LiBJbiBhIGBDZm5SdWxlYCBjbGFzcywgd3JpdGUgdGhlIHBhdHRlcm4gYXMgeW91IG5vcm1hbGx5IHdvdWxkIHdoZW5cbiAqIGRpcmVjdGx5IHdyaXRpbmcgQ2xvdWRGb3JtYXRpb24uXG4gKlxuICogUnVsZXMgdXNlIGV2ZW50IHBhdHRlcm5zIHRvIHNlbGVjdCBldmVudHMgYW5kIHJvdXRlIHRoZW0gdG8gdGFyZ2V0cy4gQVxuICogcGF0dGVybiBlaXRoZXIgbWF0Y2hlcyBhbiBldmVudCBvciBpdCBkb2Vzbid0LiBFdmVudCBwYXR0ZXJucyBhcmUgcmVwcmVzZW50ZWRcbiAqIGFzIEpTT04gb2JqZWN0cyB3aXRoIGEgc3RydWN0dXJlIHRoYXQgaXMgc2ltaWxhciB0byB0aGF0IG9mIGV2ZW50cy5cbiAqXG4gKiBJdCBpcyBpbXBvcnRhbnQgdG8gcmVtZW1iZXIgdGhlIGZvbGxvd2luZyBhYm91dCBldmVudCBwYXR0ZXJuIG1hdGNoaW5nOlxuICpcbiAqIC0gRm9yIGEgcGF0dGVybiB0byBtYXRjaCBhbiBldmVudCwgdGhlIGV2ZW50IG11c3QgY29udGFpbiBhbGwgdGhlIGZpZWxkIG5hbWVzXG4gKiAgIGxpc3RlZCBpbiB0aGUgcGF0dGVybi4gVGhlIGZpZWxkIG5hbWVzIG11c3QgYXBwZWFyIGluIHRoZSBldmVudCB3aXRoIHRoZVxuICogICBzYW1lIG5lc3Rpbmcgc3RydWN0dXJlLlxuICpcbiAqIC0gT3RoZXIgZmllbGRzIG9mIHRoZSBldmVudCBub3QgbWVudGlvbmVkIGluIHRoZSBwYXR0ZXJuIGFyZSBpZ25vcmVkO1xuICogICBlZmZlY3RpdmVseSwgdGhlcmUgaXMgYSBgYFwiKlwiOiBcIipcImBgIHdpbGRjYXJkIGZvciBmaWVsZHMgbm90IG1lbnRpb25lZC5cbiAqXG4gKiAtIFRoZSBtYXRjaGluZyBpcyBleGFjdCAoY2hhcmFjdGVyLWJ5LWNoYXJhY3RlciksIHdpdGhvdXQgY2FzZS1mb2xkaW5nIG9yIGFueVxuICogICBvdGhlciBzdHJpbmcgbm9ybWFsaXphdGlvbi5cbiAqXG4gKiAtIFRoZSB2YWx1ZXMgYmVpbmcgbWF0Y2hlZCBmb2xsb3cgSlNPTiBydWxlczogU3RyaW5ncyBlbmNsb3NlZCBpbiBxdW90ZXMsXG4gKiAgIG51bWJlcnMsIGFuZCB0aGUgdW5xdW90ZWQga2V5d29yZHMgdHJ1ZSwgZmFsc2UsIGFuZCBudWxsLlxuICpcbiAqIC0gTnVtYmVyIG1hdGNoaW5nIGlzIGF0IHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gbGV2ZWwuIEZvciBleGFtcGxlLCAzMDAsXG4gKiAgIDMwMC4wLCBhbmQgMy4wZTIgYXJlIG5vdCBjb25zaWRlcmVkIGVxdWFsLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L2V2ZW50cy9DbG91ZFdhdGNoRXZlbnRzYW5kRXZlbnRQYXR0ZXJucy5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRQYXR0ZXJuIHtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIHRoaXMgaXMgc2V0IHRvIDAgKHplcm8pIGluIGFsbCBldmVudHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb24/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQSB1bmlxdWUgdmFsdWUgaXMgZ2VuZXJhdGVkIGZvciBldmVyeSBldmVudC4gVGhpcyBjYW4gYmUgaGVscGZ1bCBpblxuICAgKiB0cmFjaW5nIGV2ZW50cyBhcyB0aGV5IG1vdmUgdGhyb3VnaCBydWxlcyB0byB0YXJnZXRzLCBhbmQgYXJlIHByb2Nlc3NlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gaWRcbiAgICovXG4gIHJlYWRvbmx5IGlkPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMsIGluIGNvbWJpbmF0aW9uIHdpdGggdGhlIHNvdXJjZSBmaWVsZCwgdGhlIGZpZWxkcyBhbmQgdmFsdWVzXG4gICAqIHRoYXQgYXBwZWFyIGluIHRoZSBkZXRhaWwgZmllbGQuXG4gICAqXG4gICAqIFJlcHJlc2VudHMgdGhlIFwiZGV0YWlsLXR5cGVcIiBldmVudCBmaWVsZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gZGV0YWlsIHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGRldGFpbFR5cGU/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogSWRlbnRpZmllcyB0aGUgc2VydmljZSB0aGF0IHNvdXJjZWQgdGhlIGV2ZW50LiBBbGwgZXZlbnRzIHNvdXJjZWQgZnJvbVxuICAgKiB3aXRoaW4gQVdTIGJlZ2luIHdpdGggXCJhd3MuXCIgQ3VzdG9tZXItZ2VuZXJhdGVkIGV2ZW50cyBjYW4gaGF2ZSBhbnkgdmFsdWVcbiAgICogaGVyZSwgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGJlZ2luIHdpdGggXCJhd3MuXCIgV2UgcmVjb21tZW5kIHRoZSB1c2Ugb2ZcbiAgICogSmF2YSBwYWNrYWdlLW5hbWUgc3R5bGUgcmV2ZXJzZSBkb21haW4tbmFtZSBzdHJpbmdzLlxuICAgKlxuICAgKiBUbyBmaW5kIHRoZSBjb3JyZWN0IHZhbHVlIGZvciBzb3VyY2UgZm9yIGFuIEFXUyBzZXJ2aWNlLCBzZWUgdGhlIHRhYmxlIGluXG4gICAqIEFXUyBTZXJ2aWNlIE5hbWVzcGFjZXMuIEZvciBleGFtcGxlLCB0aGUgc291cmNlIHZhbHVlIGZvciBBbWF6b25cbiAgICogQ2xvdWRGcm9udCBpcyBhd3MuY2xvdWRmcm9udC5cbiAgICpcbiAgICogQHNlZSBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9nZW5lcmFsL2xhdGVzdC9nci9hd3MtYXJucy1hbmQtbmFtZXNwYWNlcy5odG1sI2dlbnJlZi1hd3Mtc2VydmljZS1uYW1lc3BhY2VzXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIHNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSAxMi1kaWdpdCBudW1iZXIgaWRlbnRpZnlpbmcgYW4gQVdTIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmlsdGVyaW5nIG9uIGFjY291bnRcbiAgICovXG4gIHJlYWRvbmx5IGFjY291bnQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGV2ZW50IHRpbWVzdGFtcCwgd2hpY2ggY2FuIGJlIHNwZWNpZmllZCBieSB0aGUgc2VydmljZSBvcmlnaW5hdGluZ1xuICAgKiB0aGUgZXZlbnQuIElmIHRoZSBldmVudCBzcGFucyBhIHRpbWUgaW50ZXJ2YWwsIHRoZSBzZXJ2aWNlIG1pZ2h0IGNob29zZVxuICAgKiB0byByZXBvcnQgdGhlIHN0YXJ0IHRpbWUsIHNvIHRoaXMgdmFsdWUgY2FuIGJlIG5vdGljZWFibHkgYmVmb3JlIHRoZSB0aW1lXG4gICAqIHRoZSBldmVudCBpcyBhY3R1YWxseSByZWNlaXZlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaWx0ZXJpbmcgb24gdGltZVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZT86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHRoZSBBV1MgcmVnaW9uIHdoZXJlIHRoZSBldmVudCBvcmlnaW5hdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiByZWdpb25cbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGlzIEpTT04gYXJyYXkgY29udGFpbnMgQVJOcyB0aGF0IGlkZW50aWZ5IHJlc291cmNlcyB0aGF0IGFyZSBpbnZvbHZlZFxuICAgKiBpbiB0aGUgZXZlbnQuIEluY2x1c2lvbiBvZiB0aGVzZSBBUk5zIGlzIGF0IHRoZSBkaXNjcmV0aW9uIG9mIHRoZVxuICAgKiBzZXJ2aWNlLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgQW1hem9uIEVDMiBpbnN0YW5jZSBzdGF0ZS1jaGFuZ2VzIGluY2x1ZGUgQW1hem9uIEVDMlxuICAgKiBpbnN0YW5jZSBBUk5zLCBBdXRvIFNjYWxpbmcgZXZlbnRzIGluY2x1ZGUgQVJOcyBmb3IgYm90aCBpbnN0YW5jZXMgYW5kXG4gICAqIEF1dG8gU2NhbGluZyBncm91cHMsIGJ1dCBBUEkgY2FsbHMgd2l0aCBBV1MgQ2xvdWRUcmFpbCBkbyBub3QgaW5jbHVkZVxuICAgKiByZXNvdXJjZSBBUk5zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiByZXNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgSlNPTiBvYmplY3QsIHdob3NlIGNvbnRlbnQgaXMgYXQgdGhlIGRpc2NyZXRpb24gb2YgdGhlIHNlcnZpY2VcbiAgICogb3JpZ2luYXRpbmcgdGhlIGV2ZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpbHRlcmluZyBvbiBkZXRhaWxcbiAgICovXG4gIHJlYWRvbmx5IGRldGFpbD86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG4iXX0=