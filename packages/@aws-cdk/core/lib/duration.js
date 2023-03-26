"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const token_1 = require("./token");
/**
 * Represents a length of time.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
class Duration {
    /**
     * Create a Duration representing an amount of milliseconds
     *
     * @param amount the amount of Milliseconds the `Duration` will represent.
     * @returns a new `Duration` representing `amount` ms.
     */
    static millis(amount) {
        return new Duration(amount, TimeUnit.Milliseconds);
    }
    /**
     * Create a Duration representing an amount of seconds
     *
     * @param amount the amount of Seconds the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Seconds.
     */
    static seconds(amount) {
        return new Duration(amount, TimeUnit.Seconds);
    }
    /**
     * Create a Duration representing an amount of minutes
     *
     * @param amount the amount of Minutes the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Minutes.
     */
    static minutes(amount) {
        return new Duration(amount, TimeUnit.Minutes);
    }
    /**
     * Create a Duration representing an amount of hours
     *
     * @param amount the amount of Hours the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Hours.
     */
    static hours(amount) {
        return new Duration(amount, TimeUnit.Hours);
    }
    /**
     * Create a Duration representing an amount of days
     *
     * @param amount the amount of Days the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Days.
     */
    static days(amount) {
        return new Duration(amount, TimeUnit.Days);
    }
    /**
     * Parse a period formatted according to the ISO 8601 standard
     *
     * @see https://www.iso.org/standard/70907.html
     * @param duration an ISO-formtted duration to be parsed.
     * @returns the parsed `Duration`.
     */
    static parse(duration) {
        const matches = duration.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
        if (!matches) {
            throw new Error(`Not a valid ISO duration: ${duration}`);
        }
        const [, days, hours, minutes, seconds] = matches;
        if (!days && !hours && !minutes && !seconds) {
            throw new Error(`Not a valid ISO duration: ${duration}`);
        }
        return Duration.millis(_toInt(seconds) * TimeUnit.Seconds.inMillis
            + (_toInt(minutes) * TimeUnit.Minutes.inMillis)
            + (_toInt(hours) * TimeUnit.Hours.inMillis)
            + (_toInt(days) * TimeUnit.Days.inMillis));
        function _toInt(str) {
            if (!str) {
                return 0;
            }
            return Number(str);
        }
    }
    constructor(amount, unit) {
        if (!token_1.Token.isUnresolved(amount) && amount < 0) {
            throw new Error(`Duration amounts cannot be negative. Received: ${amount}`);
        }
        this.amount = amount;
        this.unit = unit;
    }
    /**
     * Add two Durations together
     */
    plus(rhs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Duration(rhs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.plus);
            }
            throw error;
        }
        const targetUnit = finestUnit(this.unit, rhs.unit);
        const res = convert(this.amount, this.unit, targetUnit, {}) + convert(rhs.amount, rhs.unit, targetUnit, {});
        return new Duration(res, targetUnit);
    }
    /**
     * Substract two Durations together
     */
    minus(rhs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Duration(rhs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.minus);
            }
            throw error;
        }
        const targetUnit = finestUnit(this.unit, rhs.unit);
        const res = convert(this.amount, this.unit, targetUnit, {}) - convert(rhs.amount, rhs.unit, targetUnit, {});
        return new Duration(res, targetUnit);
    }
    /**
     * Return the total number of milliseconds in this Duration
     *
     * @returns the value of this `Duration` expressed in Milliseconds.
     */
    toMilliseconds(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TimeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toMilliseconds);
            }
            throw error;
        }
        return convert(this.amount, this.unit, TimeUnit.Milliseconds, opts);
    }
    /**
     * Return the total number of seconds in this Duration
     *
     * @returns the value of this `Duration` expressed in Seconds.
     */
    toSeconds(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TimeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toSeconds);
            }
            throw error;
        }
        return convert(this.amount, this.unit, TimeUnit.Seconds, opts);
    }
    /**
     * Return the total number of minutes in this Duration
     *
     * @returns the value of this `Duration` expressed in Minutes.
     */
    toMinutes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TimeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toMinutes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, TimeUnit.Minutes, opts);
    }
    /**
     * Return the total number of hours in this Duration
     *
     * @returns the value of this `Duration` expressed in Hours.
     */
    toHours(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TimeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toHours);
            }
            throw error;
        }
        return convert(this.amount, this.unit, TimeUnit.Hours, opts);
    }
    /**
     * Return the total number of days in this Duration
     *
     * @returns the value of this `Duration` expressed in Days.
     */
    toDays(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_TimeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toDays);
            }
            throw error;
        }
        return convert(this.amount, this.unit, TimeUnit.Days, opts);
    }
    /**
     * Return an ISO 8601 representation of this period
     *
     * @returns a string starting with 'P' describing the period
     * @see https://www.iso.org/standard/70907.html
     */
    toIsoString() {
        if (this.amount === 0) {
            return 'PT0S';
        }
        const ret = ['P'];
        let tee = false;
        for (const [amount, unit] of this.components(true)) {
            if ([TimeUnit.Seconds, TimeUnit.Minutes, TimeUnit.Hours].includes(unit) && !tee) {
                ret.push('T');
                tee = true;
            }
            ret.push(`${amount}${unit.isoLabel}`);
        }
        return ret.join('');
    }
    /**
     * Return an ISO 8601 representation of this period
     *
     * @returns a string starting with 'P' describing the period
     * @see https://www.iso.org/standard/70907.html
     * @deprecated Use `toIsoString()` instead.
     */
    toISOString() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Duration#toISOString", "Use `toIsoString()` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toISOString);
            }
            throw error;
        }
        return this.toIsoString();
    }
    /**
     * Turn this duration into a human-readable string
     */
    toHumanString() {
        if (this.amount === 0) {
            return fmtUnit(0, this.unit);
        }
        if (token_1.Token.isUnresolved(this.amount)) {
            return `<token> ${this.unit.label}`;
        }
        return this.components(false)
            // 2 significant parts, that's totally enough for humans
            .slice(0, 2)
            .map(([amount, unit]) => fmtUnit(amount, unit))
            .join(' ');
        function fmtUnit(amount, unit) {
            if (amount === 1) {
                // All of the labels end in 's'
                return `${amount} ${unit.label.substring(0, unit.label.length - 1)}`;
            }
            return `${amount} ${unit.label}`;
        }
    }
    /**
     * Returns a string representation of this `Duration`
     *
     * This is is never the right function to use when you want to use the `Duration`
     * object in a template. Use `toSeconds()`, `toMinutes()`, `toDays()`, etc. instead.
     */
    toString() {
        return `Duration.${this.unit.label}(${this.amount})`;
    }
    /**
     * Return the duration in a set of whole numbered time components, ordered from largest to smallest
     *
     * Only components != 0 will be returned.
     *
     * Can combine millis and seconds together for the benefit of toIsoString,
     * makes the logic in there simpler.
     */
    components(combineMillisWithSeconds) {
        const ret = new Array();
        let millis = convert(this.amount, this.unit, TimeUnit.Milliseconds, { integral: false });
        for (const unit of [TimeUnit.Days, TimeUnit.Hours, TimeUnit.Minutes, TimeUnit.Seconds]) {
            const count = convert(millis, TimeUnit.Milliseconds, unit, { integral: false });
            // Round down to a whole number UNLESS we're combining millis and seconds and we got to the seconds
            const wholeCount = unit === TimeUnit.Seconds && combineMillisWithSeconds ? count : Math.floor(count);
            if (wholeCount > 0) {
                ret.push([wholeCount, unit]);
                millis -= wholeCount * unit.inMillis;
            }
        }
        // Remainder in millis
        if (millis > 0) {
            ret.push([millis, TimeUnit.Milliseconds]);
        }
        return ret;
    }
    /**
     * Checks if duration is a token or a resolvable object
     */
    isUnresolved() {
        return token_1.Token.isUnresolved(this.amount);
    }
    /**
     * Returns unit of the duration
     */
    unitLabel() {
        return this.unit.label;
    }
    /**
     * Returns stringified number of duration
     */
    formatTokenToNumber() {
        const number = token_1.Tokenization.stringifyNumber(this.amount);
        return `${number} ${this.unit.label}`;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Duration[_a] = { fqn: "@aws-cdk/core.Duration", version: "0.0.0" };
exports.Duration = Duration;
class TimeUnit {
    constructor(label, isoLabel, inMillis) {
        this.label = label;
        this.isoLabel = isoLabel;
        this.inMillis = inMillis;
    }
    toString() {
        return this.label;
    }
}
TimeUnit.Milliseconds = new TimeUnit('millis', '', 1);
TimeUnit.Seconds = new TimeUnit('seconds', 'S', 1000);
TimeUnit.Minutes = new TimeUnit('minutes', 'M', 60000);
TimeUnit.Hours = new TimeUnit('hours', 'H', 3600000);
TimeUnit.Days = new TimeUnit('days', 'D', 86400000);
function convert(amount, fromUnit, toUnit, { integral = true }) {
    if (fromUnit.inMillis === toUnit.inMillis) {
        if (integral && !token_1.Token.isUnresolved(amount) && !Number.isInteger(amount)) {
            throw new Error(`${amount} must be a whole number of ${toUnit}.`);
        }
        return amount;
    }
    if (token_1.Token.isUnresolved(amount)) {
        throw new Error(`Duration must be specified as 'Duration.${toUnit}()' here since its value comes from a token and cannot be converted (got Duration.${fromUnit})`);
    }
    const value = (amount * fromUnit.inMillis) / toUnit.inMillis;
    if (!Number.isInteger(value) && integral) {
        throw new Error(`'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`);
    }
    return value;
}
/**
 * Return the time unit with highest granularity
 */
function finestUnit(a, b) {
    return a.inMillis < b.inMillis ? a : b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBOEM7QUFFOUM7Ozs7Ozs7R0FPRztBQUNILE1BQWEsUUFBUTtJQUNuQjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBYztRQUNqQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDcEQ7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBYztRQUNsQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDL0M7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBYztRQUNsQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDL0M7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYztRQUNoQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQWdCO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMxRDtRQUNELE1B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c0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBsZW5ndGggb2YgdGltZS5cbiAqXG4gKiBUaGUgYW1vdW50IGNhbiBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzIGEgbGl0ZXJhbCB2YWx1ZSAoZS5nOiBgMTBgKSB3aGljaFxuICogY2Fubm90IGJlIG5lZ2F0aXZlLCBvciBhcyBhbiB1bnJlc29sdmVkIG51bWJlciB0b2tlbi5cbiAqXG4gKiBXaGVuIHRoZSBhbW91bnQgaXMgcGFzc2VkIGFzIGEgdG9rZW4sIHVuaXQgY29udmVyc2lvbiBpcyBub3QgcG9zc2libGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBEdXJhdGlvbiB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBEdXJhdGlvbiByZXByZXNlbnRpbmcgYW4gYW1vdW50IG9mIG1pbGxpc2Vjb25kc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgTWlsbGlzZWNvbmRzIHRoZSBgRHVyYXRpb25gIHdpbGwgcmVwcmVzZW50LlxuICAgKiBAcmV0dXJucyBhIG5ldyBgRHVyYXRpb25gIHJlcHJlc2VudGluZyBgYW1vdW50YCBtcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWlsbGlzKGFtb3VudDogbnVtYmVyKTogRHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24oYW1vdW50LCBUaW1lVW5pdC5NaWxsaXNlY29uZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIHJlcHJlc2VudGluZyBhbiBhbW91bnQgb2Ygc2Vjb25kc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgU2Vjb25kcyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgU2Vjb25kcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2Vjb25kcyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuU2Vjb25kcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBtaW51dGVzXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBNaW51dGVzIHRoZSBgRHVyYXRpb25gIHdpbGwgcmVwcmVzZW50LlxuICAgKiBAcmV0dXJucyBhIG5ldyBgRHVyYXRpb25gIHJlcHJlc2VudGluZyBgYW1vdW50YCBNaW51dGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtaW51dGVzKGFtb3VudDogbnVtYmVyKTogRHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24oYW1vdW50LCBUaW1lVW5pdC5NaW51dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBEdXJhdGlvbiByZXByZXNlbnRpbmcgYW4gYW1vdW50IG9mIGhvdXJzXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBIb3VycyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgSG91cnMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGhvdXJzKGFtb3VudDogbnVtYmVyKTogRHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24oYW1vdW50LCBUaW1lVW5pdC5Ib3Vycyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBkYXlzXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBEYXlzIHRoZSBgRHVyYXRpb25gIHdpbGwgcmVwcmVzZW50LlxuICAgKiBAcmV0dXJucyBhIG5ldyBgRHVyYXRpb25gIHJlcHJlc2VudGluZyBgYW1vdW50YCBEYXlzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkYXlzKGFtb3VudDogbnVtYmVyKTogRHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24oYW1vdW50LCBUaW1lVW5pdC5EYXlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBhIHBlcmlvZCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIHRoZSBJU08gODYwMSBzdGFuZGFyZFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3Lmlzby5vcmcvc3RhbmRhcmQvNzA5MDcuaHRtbFxuICAgKiBAcGFyYW0gZHVyYXRpb24gYW4gSVNPLWZvcm10dGVkIGR1cmF0aW9uIHRvIGJlIHBhcnNlZC5cbiAgICogQHJldHVybnMgdGhlIHBhcnNlZCBgRHVyYXRpb25gLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYXJzZShkdXJhdGlvbjogc3RyaW5nKTogRHVyYXRpb24ge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBkdXJhdGlvbi5tYXRjaCgvXlAoPzooXFxkKylEKT8oPzpUKD86KFxcZCspSCk/KD86KFxcZCspTSk/KD86KFxcZCspUyk/KT8kLyk7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHZhbGlkIElTTyBkdXJhdGlvbjogJHtkdXJhdGlvbn1gKTtcbiAgICB9XG4gICAgY29uc3QgWywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHNdID0gbWF0Y2hlcztcbiAgICBpZiAoIWRheXMgJiYgIWhvdXJzICYmICFtaW51dGVzICYmICFzZWNvbmRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHZhbGlkIElTTyBkdXJhdGlvbjogJHtkdXJhdGlvbn1gKTtcbiAgICB9XG4gICAgcmV0dXJuIER1cmF0aW9uLm1pbGxpcyhcbiAgICAgIF90b0ludChzZWNvbmRzKSAqIFRpbWVVbml0LlNlY29uZHMuaW5NaWxsaXNcbiAgICAgICsgKF90b0ludChtaW51dGVzKSAqIFRpbWVVbml0Lk1pbnV0ZXMuaW5NaWxsaXMpXG4gICAgICArIChfdG9JbnQoaG91cnMpICogVGltZVVuaXQuSG91cnMuaW5NaWxsaXMpXG4gICAgICArIChfdG9JbnQoZGF5cykgKiBUaW1lVW5pdC5EYXlzLmluTWlsbGlzKSxcbiAgICApO1xuXG4gICAgZnVuY3Rpb24gX3RvSW50KHN0cjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgIGlmICghc3RyKSB7IHJldHVybiAwOyB9XG4gICAgICByZXR1cm4gTnVtYmVyKHN0cik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhbW91bnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSB1bml0OiBUaW1lVW5pdDtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGFtb3VudDogbnVtYmVyLCB1bml0OiBUaW1lVW5pdCkge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGFtb3VudCkgJiYgYW1vdW50IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXJhdGlvbiBhbW91bnRzIGNhbm5vdCBiZSBuZWdhdGl2ZS4gUmVjZWl2ZWQ6ICR7YW1vdW50fWApO1xuICAgIH1cblxuICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHR3byBEdXJhdGlvbnMgdG9nZXRoZXJcbiAgICovXG4gIHB1YmxpYyBwbHVzKHJoczogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG4gICAgY29uc3QgdGFyZ2V0VW5pdCA9IGZpbmVzdFVuaXQodGhpcy51bml0LCByaHMudW5pdCk7XG4gICAgY29uc3QgcmVzID0gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCB0YXJnZXRVbml0LCB7fSkgKyBjb252ZXJ0KHJocy5hbW91bnQsIHJocy51bml0LCB0YXJnZXRVbml0LCB7fSk7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbihyZXMsIHRhcmdldFVuaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnN0cmFjdCB0d28gRHVyYXRpb25zIHRvZ2V0aGVyXG4gICAqL1xuICBwdWJsaWMgbWludXMocmhzOiBEdXJhdGlvbik6IER1cmF0aW9uIHtcbiAgICBjb25zdCB0YXJnZXRVbml0ID0gZmluZXN0VW5pdCh0aGlzLnVuaXQsIHJocy51bml0KTtcbiAgICBjb25zdCByZXMgPSBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIHRhcmdldFVuaXQsIHt9KSAtIGNvbnZlcnQocmhzLmFtb3VudCwgcmhzLnVuaXQsIHRhcmdldFVuaXQsIHt9KTtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKHJlcywgdGFyZ2V0VW5pdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGluIHRoaXMgRHVyYXRpb25cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoaXMgYER1cmF0aW9uYCBleHByZXNzZWQgaW4gTWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgcHVibGljIHRvTWlsbGlzZWNvbmRzKG9wdHM6IFRpbWVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5NaWxsaXNlY29uZHMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIHNlY29uZHMgaW4gdGhpcyBEdXJhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhpcyBgRHVyYXRpb25gIGV4cHJlc3NlZCBpbiBTZWNvbmRzLlxuICAgKi9cbiAgcHVibGljIHRvU2Vjb25kcyhvcHRzOiBUaW1lQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuU2Vjb25kcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgbWludXRlcyBpbiB0aGlzIER1cmF0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGlzIGBEdXJhdGlvbmAgZXhwcmVzc2VkIGluIE1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgdG9NaW51dGVzKG9wdHM6IFRpbWVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5NaW51dGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBob3VycyBpbiB0aGlzIER1cmF0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGlzIGBEdXJhdGlvbmAgZXhwcmVzc2VkIGluIEhvdXJzLlxuICAgKi9cbiAgcHVibGljIHRvSG91cnMob3B0czogVGltZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0LkhvdXJzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBkYXlzIGluIHRoaXMgRHVyYXRpb25cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoaXMgYER1cmF0aW9uYCBleHByZXNzZWQgaW4gRGF5cy5cbiAgICovXG4gIHB1YmxpYyB0b0RheXMob3B0czogVGltZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0LkRheXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBJU08gODYwMSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHBlcmlvZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIHN0cmluZyBzdGFydGluZyB3aXRoICdQJyBkZXNjcmliaW5nIHRoZSBwZXJpb2RcbiAgICogQHNlZSBodHRwczovL3d3dy5pc28ub3JnL3N0YW5kYXJkLzcwOTA3Lmh0bWxcbiAgICovXG4gIHB1YmxpYyB0b0lzb1N0cmluZygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmFtb3VudCA9PT0gMCkgeyByZXR1cm4gJ1BUMFMnOyB9XG5cbiAgICBjb25zdCByZXQgPSBbJ1AnXTtcbiAgICBsZXQgdGVlID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IFthbW91bnQsIHVuaXRdIG9mIHRoaXMuY29tcG9uZW50cyh0cnVlKSkge1xuICAgICAgaWYgKFtUaW1lVW5pdC5TZWNvbmRzLCBUaW1lVW5pdC5NaW51dGVzLCBUaW1lVW5pdC5Ib3Vyc10uaW5jbHVkZXModW5pdCkgJiYgIXRlZSkge1xuICAgICAgICByZXQucHVzaCgnVCcpO1xuICAgICAgICB0ZWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0LnB1c2goYCR7YW1vdW50fSR7dW5pdC5pc29MYWJlbH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0LmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBJU08gODYwMSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHBlcmlvZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIHN0cmluZyBzdGFydGluZyB3aXRoICdQJyBkZXNjcmliaW5nIHRoZSBwZXJpb2RcbiAgICogQHNlZSBodHRwczovL3d3dy5pc28ub3JnL3N0YW5kYXJkLzcwOTA3Lmh0bWxcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGB0b0lzb1N0cmluZygpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHRvSVNPU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudG9Jc29TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUdXJuIHRoaXMgZHVyYXRpb24gaW50byBhIGh1bWFuLXJlYWRhYmxlIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHRvSHVtYW5TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5hbW91bnQgPT09IDApIHsgcmV0dXJuIGZtdFVuaXQoMCwgdGhpcy51bml0KTsgfVxuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5hbW91bnQpKSB7IHJldHVybiBgPHRva2VuPiAke3RoaXMudW5pdC5sYWJlbH1gOyB9XG5cbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzKGZhbHNlKVxuICAgICAgLy8gMiBzaWduaWZpY2FudCBwYXJ0cywgdGhhdCdzIHRvdGFsbHkgZW5vdWdoIGZvciBodW1hbnNcbiAgICAgIC5zbGljZSgwLCAyKVxuICAgICAgLm1hcCgoW2Ftb3VudCwgdW5pdF0pID0+IGZtdFVuaXQoYW1vdW50LCB1bml0KSlcbiAgICAgIC5qb2luKCcgJyk7XG5cbiAgICBmdW5jdGlvbiBmbXRVbml0KGFtb3VudDogbnVtYmVyLCB1bml0OiBUaW1lVW5pdCkge1xuICAgICAgaWYgKGFtb3VudCA9PT0gMSkge1xuICAgICAgICAvLyBBbGwgb2YgdGhlIGxhYmVscyBlbmQgaW4gJ3MnXG4gICAgICAgIHJldHVybiBgJHthbW91bnR9ICR7dW5pdC5sYWJlbC5zdWJzdHJpbmcoMCwgdW5pdC5sYWJlbC5sZW5ndGggLSAxKX1gO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke2Ftb3VudH0gJHt1bml0LmxhYmVsfWA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBgRHVyYXRpb25gXG4gICAqXG4gICAqIFRoaXMgaXMgaXMgbmV2ZXIgdGhlIHJpZ2h0IGZ1bmN0aW9uIHRvIHVzZSB3aGVuIHlvdSB3YW50IHRvIHVzZSB0aGUgYER1cmF0aW9uYFxuICAgKiBvYmplY3QgaW4gYSB0ZW1wbGF0ZS4gVXNlIGB0b1NlY29uZHMoKWAsIGB0b01pbnV0ZXMoKWAsIGB0b0RheXMoKWAsIGV0Yy4gaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBgRHVyYXRpb24uJHt0aGlzLnVuaXQubGFiZWx9KCR7dGhpcy5hbW91bnR9KWA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBkdXJhdGlvbiBpbiBhIHNldCBvZiB3aG9sZSBudW1iZXJlZCB0aW1lIGNvbXBvbmVudHMsIG9yZGVyZWQgZnJvbSBsYXJnZXN0IHRvIHNtYWxsZXN0XG4gICAqXG4gICAqIE9ubHkgY29tcG9uZW50cyAhPSAwIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIENhbiBjb21iaW5lIG1pbGxpcyBhbmQgc2Vjb25kcyB0b2dldGhlciBmb3IgdGhlIGJlbmVmaXQgb2YgdG9Jc29TdHJpbmcsXG4gICAqIG1ha2VzIHRoZSBsb2dpYyBpbiB0aGVyZSBzaW1wbGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBjb21wb25lbnRzKGNvbWJpbmVNaWxsaXNXaXRoU2Vjb25kczogYm9vbGVhbik6IEFycmF5PFtudW1iZXIsIFRpbWVVbml0XT4ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheTxbbnVtYmVyLCBUaW1lVW5pdF0+KCk7XG4gICAgbGV0IG1pbGxpcyA9IGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuTWlsbGlzZWNvbmRzLCB7IGludGVncmFsOiBmYWxzZSB9KTtcblxuICAgIGZvciAoY29uc3QgdW5pdCBvZiBbVGltZVVuaXQuRGF5cywgVGltZVVuaXQuSG91cnMsIFRpbWVVbml0Lk1pbnV0ZXMsIFRpbWVVbml0LlNlY29uZHNdKSB7XG4gICAgICBjb25zdCBjb3VudCA9IGNvbnZlcnQobWlsbGlzLCBUaW1lVW5pdC5NaWxsaXNlY29uZHMsIHVuaXQsIHsgaW50ZWdyYWw6IGZhbHNlIH0pO1xuICAgICAgLy8gUm91bmQgZG93biB0byBhIHdob2xlIG51bWJlciBVTkxFU1Mgd2UncmUgY29tYmluaW5nIG1pbGxpcyBhbmQgc2Vjb25kcyBhbmQgd2UgZ290IHRvIHRoZSBzZWNvbmRzXG4gICAgICBjb25zdCB3aG9sZUNvdW50ID0gdW5pdCA9PT0gVGltZVVuaXQuU2Vjb25kcyAmJiBjb21iaW5lTWlsbGlzV2l0aFNlY29uZHMgPyBjb3VudCA6IE1hdGguZmxvb3IoY291bnQpO1xuICAgICAgaWYgKHdob2xlQ291bnQgPiAwKSB7XG4gICAgICAgIHJldC5wdXNoKFt3aG9sZUNvdW50LCB1bml0XSk7XG4gICAgICAgIG1pbGxpcyAtPSB3aG9sZUNvdW50ICogdW5pdC5pbk1pbGxpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1haW5kZXIgaW4gbWlsbGlzXG4gICAgaWYgKG1pbGxpcyA+IDApIHtcbiAgICAgIHJldC5wdXNoKFttaWxsaXMsIFRpbWVVbml0Lk1pbGxpc2Vjb25kc10pO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBkdXJhdGlvbiBpcyBhIHRva2VuIG9yIGEgcmVzb2x2YWJsZSBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBpc1VucmVzb2x2ZWQoKSB7XG4gICAgcmV0dXJuIFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB1bml0IG9mIHRoZSBkdXJhdGlvblxuICAgKi9cbiAgcHVibGljIHVuaXRMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy51bml0LmxhYmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgc3RyaW5naWZpZWQgbnVtYmVyIG9mIGR1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgZm9ybWF0VG9rZW5Ub051bWJlcigpOiBzdHJpbmcge1xuICAgIGNvbnN0IG51bWJlciA9IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIodGhpcy5hbW91bnQpO1xuICAgIHJldHVybiBgJHtudW1iZXJ9ICR7dGhpcy51bml0LmxhYmVsfWA7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBob3cgdG8gY29udmVydCB0aW1lIHRvIGEgZGlmZmVyZW50IHVuaXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUNvbnZlcnNpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgY29udmVyc2lvbnMgaW50byBhIGxhcmdlciB0aW1lIHVuaXQgKGUuZy4gYFNlY29uZHNgIHRvIGBNaW51dGVzYCkgd2lsbCBmYWlsIGlmIHRoZSByZXN1bHQgaXMgbm90IGFuXG4gICAqIGludGVnZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGludGVncmFsPzogYm9vbGVhbjtcbn1cblxuY2xhc3MgVGltZVVuaXQge1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1pbGxpc2Vjb25kcyA9IG5ldyBUaW1lVW5pdCgnbWlsbGlzJywgJycsIDEpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNlY29uZHMgPSBuZXcgVGltZVVuaXQoJ3NlY29uZHMnLCAnUycsIDFfMDAwKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNaW51dGVzID0gbmV3IFRpbWVVbml0KCdtaW51dGVzJywgJ00nLCA2MF8wMDApO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEhvdXJzID0gbmV3IFRpbWVVbml0KCdob3VycycsICdIJywgM182MDBfMDAwKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBEYXlzID0gbmV3IFRpbWVVbml0KCdkYXlzJywgJ0QnLCA4Nl80MDBfMDAwKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsYWJlbDogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgaXNvTGFiZWw6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGluTWlsbGlzOiBudW1iZXIpIHtcbiAgICAvLyBNQVhfU0FGRV9JTlRFR0VSIGlzIDJeNTMsIHNvIGJ5IHJlcHJlc2VudGluZyBvdXIgZHVyYXRpb24gaW4gbWlsbGlzICh0aGUgbG93ZXN0XG4gICAgLy8gY29tbW9uIHVuaXQpIHRoZSBoaWdoZXN0IGR1cmF0aW9uIHdlIGNhbiByZXByZXNlbnQgaXNcbiAgICAvLyAyXjUzIC8gODYqMTBeNiB+PSAxMDQgKiAxMF42IGRheXMgKGFib3V0IDEwMCBtaWxsaW9uIGRheXMpLlxuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmxhYmVsO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnQoYW1vdW50OiBudW1iZXIsIGZyb21Vbml0OiBUaW1lVW5pdCwgdG9Vbml0OiBUaW1lVW5pdCwgeyBpbnRlZ3JhbCA9IHRydWUgfTogVGltZUNvbnZlcnNpb25PcHRpb25zKSB7XG4gIGlmIChmcm9tVW5pdC5pbk1pbGxpcyA9PT0gdG9Vbml0LmluTWlsbGlzKSB7XG4gICAgaWYgKGludGVncmFsICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoYW1vdW50KSAmJiAhTnVtYmVyLmlzSW50ZWdlcihhbW91bnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7YW1vdW50fSBtdXN0IGJlIGEgd2hvbGUgbnVtYmVyIG9mICR7dG9Vbml0fS5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGFtb3VudDtcbiAgfVxuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGFtb3VudCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYER1cmF0aW9uIG11c3QgYmUgc3BlY2lmaWVkIGFzICdEdXJhdGlvbi4ke3RvVW5pdH0oKScgaGVyZSBzaW5jZSBpdHMgdmFsdWUgY29tZXMgZnJvbSBhIHRva2VuIGFuZCBjYW5ub3QgYmUgY29udmVydGVkIChnb3QgRHVyYXRpb24uJHtmcm9tVW5pdH0pYCk7XG4gIH1cbiAgY29uc3QgdmFsdWUgPSAoYW1vdW50ICogZnJvbVVuaXQuaW5NaWxsaXMpIC8gdG9Vbml0LmluTWlsbGlzO1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIodmFsdWUpICYmIGludGVncmFsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnJHthbW91bnR9ICR7ZnJvbVVuaXR9JyBjYW5ub3QgYmUgY29udmVydGVkIGludG8gYSB3aG9sZSBudW1iZXIgb2YgJHt0b1VuaXR9LmApO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHRpbWUgdW5pdCB3aXRoIGhpZ2hlc3QgZ3JhbnVsYXJpdHlcbiAqL1xuZnVuY3Rpb24gZmluZXN0VW5pdChhOiBUaW1lVW5pdCwgYjogVGltZVVuaXQpIHtcbiAgcmV0dXJuIGEuaW5NaWxsaXMgPCBiLmluTWlsbGlzID8gYSA6IGI7XG59XG4iXX0=