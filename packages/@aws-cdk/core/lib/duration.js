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
    constructor(amount, unit) {
        if (!token_1.Token.isUnresolved(amount) && amount < 0) {
            throw new Error(`Duration amounts cannot be negative. Received: ${amount}`);
        }
        this.amount = amount;
        this.unit = unit;
    }
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
exports.Duration = Duration;
_a = JSII_RTTI_SYMBOL_1;
Duration[_a] = { fqn: "@aws-cdk/core.Duration", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBOEM7QUFFOUM7Ozs7Ozs7R0FPRztBQUNILE1BQWEsUUFBUTtJQW1GbkIsWUFBb0IsTUFBYyxFQUFFLElBQWM7UUFDaEQsSUFBSSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzdFO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7SUF6RkQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQWM7UUFDakMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3BEO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWM7UUFDbEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWM7UUFDbEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9DO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDaEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQWM7UUFDL0IsT0FBTyxJQUFJLFFBQVEsQ0FBQyxN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ZXNDb250ZW50IjpbImltcG9ydCB7IFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICcuL3Rva2VuJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbGVuZ3RoIG9mIHRpbWUuXG4gKlxuICogVGhlIGFtb3VudCBjYW4gYmUgc3BlY2lmaWVkIGVpdGhlciBhcyBhIGxpdGVyYWwgdmFsdWUgKGUuZzogYDEwYCkgd2hpY2hcbiAqIGNhbm5vdCBiZSBuZWdhdGl2ZSwgb3IgYXMgYW4gdW5yZXNvbHZlZCBudW1iZXIgdG9rZW4uXG4gKlxuICogV2hlbiB0aGUgYW1vdW50IGlzIHBhc3NlZCBhcyBhIHRva2VuLCB1bml0IGNvbnZlcnNpb24gaXMgbm90IHBvc3NpYmxlLlxuICovXG5leHBvcnQgY2xhc3MgRHVyYXRpb24ge1xuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBtaWxsaXNlY29uZHNcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIE1pbGxpc2Vjb25kcyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1pbGxpcyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuTWlsbGlzZWNvbmRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBEdXJhdGlvbiByZXByZXNlbnRpbmcgYW4gYW1vdW50IG9mIHNlY29uZHNcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIFNlY29uZHMgdGhlIGBEdXJhdGlvbmAgd2lsbCByZXByZXNlbnQuXG4gICAqIEByZXR1cm5zIGEgbmV3IGBEdXJhdGlvbmAgcmVwcmVzZW50aW5nIGBhbW91bnRgIFNlY29uZHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlY29uZHMoYW1vdW50OiBudW1iZXIpOiBEdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbihhbW91bnQsIFRpbWVVbml0LlNlY29uZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIHJlcHJlc2VudGluZyBhbiBhbW91bnQgb2YgbWludXRlc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgTWludXRlcyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgTWludXRlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWludXRlcyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuTWludXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBob3Vyc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgSG91cnMgdGhlIGBEdXJhdGlvbmAgd2lsbCByZXByZXNlbnQuXG4gICAqIEByZXR1cm5zIGEgbmV3IGBEdXJhdGlvbmAgcmVwcmVzZW50aW5nIGBhbW91bnRgIEhvdXJzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBob3VycyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuSG91cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIHJlcHJlc2VudGluZyBhbiBhbW91bnQgb2YgZGF5c1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgRGF5cyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgRGF5cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGF5cyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuRGF5cyk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBwZXJpb2QgZm9ybWF0dGVkIGFjY29yZGluZyB0byB0aGUgSVNPIDg2MDEgc3RhbmRhcmRcbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5pc28ub3JnL3N0YW5kYXJkLzcwOTA3Lmh0bWxcbiAgICogQHBhcmFtIGR1cmF0aW9uIGFuIElTTy1mb3JtdHRlZCBkdXJhdGlvbiB0byBiZSBwYXJzZWQuXG4gICAqIEByZXR1cm5zIHRoZSBwYXJzZWQgYER1cmF0aW9uYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2UoZHVyYXRpb246IHN0cmluZyk6IER1cmF0aW9uIHtcbiAgICBjb25zdCBtYXRjaGVzID0gZHVyYXRpb24ubWF0Y2goL15QKD86KFxcZCspRCk/KD86VCg/OihcXGQrKUgpPyg/OihcXGQrKU0pPyg/OihcXGQrKVMpPyk/JC8pO1xuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBJU08gZHVyYXRpb246ICR7ZHVyYXRpb259YCk7XG4gICAgfVxuICAgIGNvbnN0IFssIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzXSA9IG1hdGNoZXM7XG4gICAgaWYgKCFkYXlzICYmICFob3VycyAmJiAhbWludXRlcyAmJiAhc2Vjb25kcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBJU08gZHVyYXRpb246ICR7ZHVyYXRpb259YCk7XG4gICAgfVxuICAgIHJldHVybiBEdXJhdGlvbi5taWxsaXMoXG4gICAgICBfdG9JbnQoc2Vjb25kcykgKiBUaW1lVW5pdC5TZWNvbmRzLmluTWlsbGlzXG4gICAgICArIChfdG9JbnQobWludXRlcykgKiBUaW1lVW5pdC5NaW51dGVzLmluTWlsbGlzKVxuICAgICAgKyAoX3RvSW50KGhvdXJzKSAqIFRpbWVVbml0LkhvdXJzLmluTWlsbGlzKVxuICAgICAgKyAoX3RvSW50KGRheXMpICogVGltZVVuaXQuRGF5cy5pbk1pbGxpcyksXG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIF90b0ludChzdHI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICBpZiAoIXN0cikgeyByZXR1cm4gMDsgfVxuICAgICAgcmV0dXJuIE51bWJlcihzdHIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgYW1vdW50OiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgdW5pdDogVGltZVVuaXQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihhbW91bnQ6IG51bWJlciwgdW5pdDogVGltZVVuaXQpIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChhbW91bnQpICYmIGFtb3VudCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVyYXRpb24gYW1vdW50cyBjYW5ub3QgYmUgbmVnYXRpdmUuIFJlY2VpdmVkOiAke2Ftb3VudH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0d28gRHVyYXRpb25zIHRvZ2V0aGVyXG4gICAqL1xuICBwdWJsaWMgcGx1cyhyaHM6IER1cmF0aW9uKTogRHVyYXRpb24ge1xuICAgIGNvbnN0IHRhcmdldFVuaXQgPSBmaW5lc3RVbml0KHRoaXMudW5pdCwgcmhzLnVuaXQpO1xuICAgIGNvbnN0IHJlcyA9IGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgdGFyZ2V0VW5pdCwge30pICsgY29udmVydChyaHMuYW1vdW50LCByaHMudW5pdCwgdGFyZ2V0VW5pdCwge30pO1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24ocmVzLCB0YXJnZXRVbml0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzdHJhY3QgdHdvIER1cmF0aW9ucyB0b2dldGhlclxuICAgKi9cbiAgcHVibGljIG1pbnVzKHJoczogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG4gICAgY29uc3QgdGFyZ2V0VW5pdCA9IGZpbmVzdFVuaXQodGhpcy51bml0LCByaHMudW5pdCk7XG4gICAgY29uc3QgcmVzID0gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCB0YXJnZXRVbml0LCB7fSkgLSBjb252ZXJ0KHJocy5hbW91bnQsIHJocy51bml0LCB0YXJnZXRVbml0LCB7fSk7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbihyZXMsIHRhcmdldFVuaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiB0aGlzIER1cmF0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGlzIGBEdXJhdGlvbmAgZXhwcmVzc2VkIGluIE1pbGxpc2Vjb25kcy5cbiAgICovXG4gIHB1YmxpYyB0b01pbGxpc2Vjb25kcyhvcHRzOiBUaW1lQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuTWlsbGlzZWNvbmRzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBzZWNvbmRzIGluIHRoaXMgRHVyYXRpb25cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoaXMgYER1cmF0aW9uYCBleHByZXNzZWQgaW4gU2Vjb25kcy5cbiAgICovXG4gIHB1YmxpYyB0b1NlY29uZHMob3B0czogVGltZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0LlNlY29uZHMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIG1pbnV0ZXMgaW4gdGhpcyBEdXJhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhpcyBgRHVyYXRpb25gIGV4cHJlc3NlZCBpbiBNaW51dGVzLlxuICAgKi9cbiAgcHVibGljIHRvTWludXRlcyhvcHRzOiBUaW1lQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuTWludXRlcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgaG91cnMgaW4gdGhpcyBEdXJhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhpcyBgRHVyYXRpb25gIGV4cHJlc3NlZCBpbiBIb3Vycy5cbiAgICovXG4gIHB1YmxpYyB0b0hvdXJzKG9wdHM6IFRpbWVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5Ib3Vycywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgZGF5cyBpbiB0aGlzIER1cmF0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGlzIGBEdXJhdGlvbmAgZXhwcmVzc2VkIGluIERheXMuXG4gICAqL1xuICBwdWJsaWMgdG9EYXlzKG9wdHM6IFRpbWVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5EYXlzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gSVNPIDg2MDEgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBwZXJpb2RcbiAgICpcbiAgICogQHJldHVybnMgYSBzdHJpbmcgc3RhcnRpbmcgd2l0aCAnUCcgZGVzY3JpYmluZyB0aGUgcGVyaW9kXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuaXNvLm9yZy9zdGFuZGFyZC83MDkwNy5odG1sXG4gICAqL1xuICBwdWJsaWMgdG9Jc29TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5hbW91bnQgPT09IDApIHsgcmV0dXJuICdQVDBTJzsgfVxuXG4gICAgY29uc3QgcmV0ID0gWydQJ107XG4gICAgbGV0IHRlZSA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBbYW1vdW50LCB1bml0XSBvZiB0aGlzLmNvbXBvbmVudHModHJ1ZSkpIHtcbiAgICAgIGlmIChbVGltZVVuaXQuU2Vjb25kcywgVGltZVVuaXQuTWludXRlcywgVGltZVVuaXQuSG91cnNdLmluY2x1ZGVzKHVuaXQpICYmICF0ZWUpIHtcbiAgICAgICAgcmV0LnB1c2goJ1QnKTtcbiAgICAgICAgdGVlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldC5wdXNoKGAke2Ftb3VudH0ke3VuaXQuaXNvTGFiZWx9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldC5qb2luKCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gSVNPIDg2MDEgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBwZXJpb2RcbiAgICpcbiAgICogQHJldHVybnMgYSBzdHJpbmcgc3RhcnRpbmcgd2l0aCAnUCcgZGVzY3JpYmluZyB0aGUgcGVyaW9kXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuaXNvLm9yZy9zdGFuZGFyZC83MDkwNy5odG1sXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgdG9Jc29TdHJpbmcoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyB0b0lTT1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRvSXNvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVHVybiB0aGlzIGR1cmF0aW9uIGludG8gYSBodW1hbi1yZWFkYWJsZSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyB0b0h1bWFuU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuYW1vdW50ID09PSAwKSB7IHJldHVybiBmbXRVbml0KDAsIHRoaXMudW5pdCk7IH1cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMuYW1vdW50KSkgeyByZXR1cm4gYDx0b2tlbj4gJHt0aGlzLnVuaXQubGFiZWx9YDsgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cyhmYWxzZSlcbiAgICAgIC8vIDIgc2lnbmlmaWNhbnQgcGFydHMsIHRoYXQncyB0b3RhbGx5IGVub3VnaCBmb3IgaHVtYW5zXG4gICAgICAuc2xpY2UoMCwgMilcbiAgICAgIC5tYXAoKFthbW91bnQsIHVuaXRdKSA9PiBmbXRVbml0KGFtb3VudCwgdW5pdCkpXG4gICAgICAuam9pbignICcpO1xuXG4gICAgZnVuY3Rpb24gZm10VW5pdChhbW91bnQ6IG51bWJlciwgdW5pdDogVGltZVVuaXQpIHtcbiAgICAgIGlmIChhbW91bnQgPT09IDEpIHtcbiAgICAgICAgLy8gQWxsIG9mIHRoZSBsYWJlbHMgZW5kIGluICdzJ1xuICAgICAgICByZXR1cm4gYCR7YW1vdW50fSAke3VuaXQubGFiZWwuc3Vic3RyaW5nKDAsIHVuaXQubGFiZWwubGVuZ3RoIC0gMSl9YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHthbW91bnR9ICR7dW5pdC5sYWJlbH1gO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgYER1cmF0aW9uYFxuICAgKlxuICAgKiBUaGlzIGlzIGlzIG5ldmVyIHRoZSByaWdodCBmdW5jdGlvbiB0byB1c2Ugd2hlbiB5b3Ugd2FudCB0byB1c2UgdGhlIGBEdXJhdGlvbmBcbiAgICogb2JqZWN0IGluIGEgdGVtcGxhdGUuIFVzZSBgdG9TZWNvbmRzKClgLCBgdG9NaW51dGVzKClgLCBgdG9EYXlzKClgLCBldGMuIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYER1cmF0aW9uLiR7dGhpcy51bml0LmxhYmVsfSgke3RoaXMuYW1vdW50fSlgO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZHVyYXRpb24gaW4gYSBzZXQgb2Ygd2hvbGUgbnVtYmVyZWQgdGltZSBjb21wb25lbnRzLCBvcmRlcmVkIGZyb20gbGFyZ2VzdCB0byBzbWFsbGVzdFxuICAgKlxuICAgKiBPbmx5IGNvbXBvbmVudHMgIT0gMCB3aWxsIGJlIHJldHVybmVkLlxuICAgKlxuICAgKiBDYW4gY29tYmluZSBtaWxsaXMgYW5kIHNlY29uZHMgdG9nZXRoZXIgZm9yIHRoZSBiZW5lZml0IG9mIHRvSXNvU3RyaW5nLFxuICAgKiBtYWtlcyB0aGUgbG9naWMgaW4gdGhlcmUgc2ltcGxlci5cbiAgICovXG4gIHByaXZhdGUgY29tcG9uZW50cyhjb21iaW5lTWlsbGlzV2l0aFNlY29uZHM6IGJvb2xlYW4pOiBBcnJheTxbbnVtYmVyLCBUaW1lVW5pdF0+IHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8W251bWJlciwgVGltZVVuaXRdPigpO1xuICAgIGxldCBtaWxsaXMgPSBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0Lk1pbGxpc2Vjb25kcywgeyBpbnRlZ3JhbDogZmFsc2UgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHVuaXQgb2YgW1RpbWVVbml0LkRheXMsIFRpbWVVbml0LkhvdXJzLCBUaW1lVW5pdC5NaW51dGVzLCBUaW1lVW5pdC5TZWNvbmRzXSkge1xuICAgICAgY29uc3QgY291bnQgPSBjb252ZXJ0KG1pbGxpcywgVGltZVVuaXQuTWlsbGlzZWNvbmRzLCB1bml0LCB7IGludGVncmFsOiBmYWxzZSB9KTtcbiAgICAgIC8vIFJvdW5kIGRvd24gdG8gYSB3aG9sZSBudW1iZXIgVU5MRVNTIHdlJ3JlIGNvbWJpbmluZyBtaWxsaXMgYW5kIHNlY29uZHMgYW5kIHdlIGdvdCB0byB0aGUgc2Vjb25kc1xuICAgICAgY29uc3Qgd2hvbGVDb3VudCA9IHVuaXQgPT09IFRpbWVVbml0LlNlY29uZHMgJiYgY29tYmluZU1pbGxpc1dpdGhTZWNvbmRzID8gY291bnQgOiBNYXRoLmZsb29yKGNvdW50KTtcbiAgICAgIGlmICh3aG9sZUNvdW50ID4gMCkge1xuICAgICAgICByZXQucHVzaChbd2hvbGVDb3VudCwgdW5pdF0pO1xuICAgICAgICBtaWxsaXMgLT0gd2hvbGVDb3VudCAqIHVuaXQuaW5NaWxsaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtYWluZGVyIGluIG1pbGxpc1xuICAgIGlmIChtaWxsaXMgPiAwKSB7XG4gICAgICByZXQucHVzaChbbWlsbGlzLCBUaW1lVW5pdC5NaWxsaXNlY29uZHNdKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgZHVyYXRpb24gaXMgYSB0b2tlbiBvciBhIHJlc29sdmFibGUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgaXNVbnJlc29sdmVkKCkge1xuICAgIHJldHVybiBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5hbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdW5pdCBvZiB0aGUgZHVyYXRpb25cbiAgICovXG4gIHB1YmxpYyB1bml0TGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudW5pdC5sYWJlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHN0cmluZ2lmaWVkIG51bWJlciBvZiBkdXJhdGlvblxuICAgKi9cbiAgcHVibGljIGZvcm1hdFRva2VuVG9OdW1iZXIoKTogc3RyaW5nIHtcbiAgICBjb25zdCBudW1iZXIgPSBUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKHRoaXMuYW1vdW50KTtcbiAgICByZXR1cm4gYCR7bnVtYmVyfSAke3RoaXMudW5pdC5sYWJlbH1gO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRvIGNvbnZlcnQgdGltZSB0byBhIGRpZmZlcmVudCB1bml0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVDb252ZXJzaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIGNvbnZlcnNpb25zIGludG8gYSBsYXJnZXIgdGltZSB1bml0IChlLmcuIGBTZWNvbmRzYCB0byBgTWludXRlc2ApIHdpbGwgZmFpbCBpZiB0aGUgcmVzdWx0IGlzIG5vdCBhblxuICAgKiBpbnRlZ2VyLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBpbnRlZ3JhbD86IGJvb2xlYW47XG59XG5cbmNsYXNzIFRpbWVVbml0IHtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNaWxsaXNlY29uZHMgPSBuZXcgVGltZVVuaXQoJ21pbGxpcycsICcnLCAxKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTZWNvbmRzID0gbmV3IFRpbWVVbml0KCdzZWNvbmRzJywgJ1MnLCAxXzAwMCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTWludXRlcyA9IG5ldyBUaW1lVW5pdCgnbWludXRlcycsICdNJywgNjBfMDAwKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBIb3VycyA9IG5ldyBUaW1lVW5pdCgnaG91cnMnLCAnSCcsIDNfNjAwXzAwMCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRGF5cyA9IG5ldyBUaW1lVW5pdCgnZGF5cycsICdEJywgODZfNDAwXzAwMCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbGFiZWw6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGlzb0xhYmVsOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBpbk1pbGxpczogbnVtYmVyKSB7XG4gICAgLy8gTUFYX1NBRkVfSU5URUdFUiBpcyAyXjUzLCBzbyBieSByZXByZXNlbnRpbmcgb3VyIGR1cmF0aW9uIGluIG1pbGxpcyAodGhlIGxvd2VzdFxuICAgIC8vIGNvbW1vbiB1bml0KSB0aGUgaGlnaGVzdCBkdXJhdGlvbiB3ZSBjYW4gcmVwcmVzZW50IGlzXG4gICAgLy8gMl41MyAvIDg2KjEwXjYgfj0gMTA0ICogMTBeNiBkYXlzIChhYm91dCAxMDAgbWlsbGlvbiBkYXlzKS5cbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0KGFtb3VudDogbnVtYmVyLCBmcm9tVW5pdDogVGltZVVuaXQsIHRvVW5pdDogVGltZVVuaXQsIHsgaW50ZWdyYWwgPSB0cnVlIH06IFRpbWVDb252ZXJzaW9uT3B0aW9ucykge1xuICBpZiAoZnJvbVVuaXQuaW5NaWxsaXMgPT09IHRvVW5pdC5pbk1pbGxpcykge1xuICAgIGlmIChpbnRlZ3JhbCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKGFtb3VudCkgJiYgIU51bWJlci5pc0ludGVnZXIoYW1vdW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Ftb3VudH0gbXVzdCBiZSBhIHdob2xlIG51bWJlciBvZiAke3RvVW5pdH0uYCk7XG4gICAgfVxuICAgIHJldHVybiBhbW91bnQ7XG4gIH1cbiAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChhbW91bnQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEdXJhdGlvbiBtdXN0IGJlIHNwZWNpZmllZCBhcyAnRHVyYXRpb24uJHt0b1VuaXR9KCknIGhlcmUgc2luY2UgaXRzIHZhbHVlIGNvbWVzIGZyb20gYSB0b2tlbiBhbmQgY2Fubm90IGJlIGNvbnZlcnRlZCAoZ290IER1cmF0aW9uLiR7ZnJvbVVuaXR9KWApO1xuICB9XG4gIGNvbnN0IHZhbHVlID0gKGFtb3VudCAqIGZyb21Vbml0LmluTWlsbGlzKSAvIHRvVW5pdC5pbk1pbGxpcztcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSAmJiBpbnRlZ3JhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJyR7YW1vdW50fSAke2Zyb21Vbml0fScgY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIGEgd2hvbGUgbnVtYmVyIG9mICR7dG9Vbml0fS5gKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0aW1lIHVuaXQgd2l0aCBoaWdoZXN0IGdyYW51bGFyaXR5XG4gKi9cbmZ1bmN0aW9uIGZpbmVzdFVuaXQoYTogVGltZVVuaXQsIGI6IFRpbWVVbml0KSB7XG4gIHJldHVybiBhLmluTWlsbGlzIDwgYi5pbk1pbGxpcyA/IGEgOiBiO1xufVxuIl19