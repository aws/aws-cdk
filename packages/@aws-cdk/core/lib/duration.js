"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
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
     * @param duration an ISO-formatted duration to be parsed.
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
        const targetUnit = finestUnit(this.unit, rhs.unit);
        const res = convert(this.amount, this.unit, targetUnit, {}) + convert(rhs.amount, rhs.unit, targetUnit, {});
        return new Duration(res, targetUnit);
    }
    /**
     * Substract two Durations together
     */
    minus(rhs) {
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
        return convert(this.amount, this.unit, TimeUnit.Milliseconds, opts);
    }
    /**
     * Return the total number of seconds in this Duration
     *
     * @returns the value of this `Duration` expressed in Seconds.
     */
    toSeconds(opts = {}) {
        return convert(this.amount, this.unit, TimeUnit.Seconds, opts);
    }
    /**
     * Return the total number of minutes in this Duration
     *
     * @returns the value of this `Duration` expressed in Minutes.
     */
    toMinutes(opts = {}) {
        return convert(this.amount, this.unit, TimeUnit.Minutes, opts);
    }
    /**
     * Return the total number of hours in this Duration
     *
     * @returns the value of this `Duration` expressed in Hours.
     */
    toHours(opts = {}) {
        return convert(this.amount, this.unit, TimeUnit.Hours, opts);
    }
    /**
     * Return the total number of days in this Duration
     *
     * @returns the value of this `Duration` expressed in Days.
     */
    toDays(opts = {}) {
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
class TimeUnit {
    constructor(label, isoLabel, inMillis) {
        this.label = label;
        this.isoLabel = isoLabel;
        this.inMillis = inMillis;
        // MAX_SAFE_INTEGER is 2^53, so by representing our duration in millis (the lowest
        // common unit) the highest duration we can represent is
        // 2^53 / 86*10^6 ~= 104 * 10^6 days (about 100 million days).
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdXJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBOEM7QUFFOUM7Ozs7Ozs7R0FPRztBQUNILE1BQWEsUUFBUTtJQUNuQjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBYztRQUNqQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFjO1FBQ2xDLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWM7UUFDbEMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYztRQUNoQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFjO1FBQy9CLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFnQjtRQUNsQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLFFBQVEsRUFBRSxD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LEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICcuL3Rva2VuJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbGVuZ3RoIG9mIHRpbWUuXG4gKlxuICogVGhlIGFtb3VudCBjYW4gYmUgc3BlY2lmaWVkIGVpdGhlciBhcyBhIGxpdGVyYWwgdmFsdWUgKGUuZzogYDEwYCkgd2hpY2hcbiAqIGNhbm5vdCBiZSBuZWdhdGl2ZSwgb3IgYXMgYW4gdW5yZXNvbHZlZCBudW1iZXIgdG9rZW4uXG4gKlxuICogV2hlbiB0aGUgYW1vdW50IGlzIHBhc3NlZCBhcyBhIHRva2VuLCB1bml0IGNvbnZlcnNpb24gaXMgbm90IHBvc3NpYmxlLlxuICovXG5leHBvcnQgY2xhc3MgRHVyYXRpb24ge1xuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBtaWxsaXNlY29uZHNcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIE1pbGxpc2Vjb25kcyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgbXMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1pbGxpcyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuTWlsbGlzZWNvbmRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBEdXJhdGlvbiByZXByZXNlbnRpbmcgYW4gYW1vdW50IG9mIHNlY29uZHNcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIFNlY29uZHMgdGhlIGBEdXJhdGlvbmAgd2lsbCByZXByZXNlbnQuXG4gICAqIEByZXR1cm5zIGEgbmV3IGBEdXJhdGlvbmAgcmVwcmVzZW50aW5nIGBhbW91bnRgIFNlY29uZHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlY29uZHMoYW1vdW50OiBudW1iZXIpOiBEdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbihhbW91bnQsIFRpbWVVbml0LlNlY29uZHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIHJlcHJlc2VudGluZyBhbiBhbW91bnQgb2YgbWludXRlc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgTWludXRlcyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgTWludXRlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWludXRlcyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuTWludXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRHVyYXRpb24gcmVwcmVzZW50aW5nIGFuIGFtb3VudCBvZiBob3Vyc1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgSG91cnMgdGhlIGBEdXJhdGlvbmAgd2lsbCByZXByZXNlbnQuXG4gICAqIEByZXR1cm5zIGEgbmV3IGBEdXJhdGlvbmAgcmVwcmVzZW50aW5nIGBhbW91bnRgIEhvdXJzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBob3VycyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuSG91cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIER1cmF0aW9uIHJlcHJlc2VudGluZyBhbiBhbW91bnQgb2YgZGF5c1xuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgRGF5cyB0aGUgYER1cmF0aW9uYCB3aWxsIHJlcHJlc2VudC5cbiAgICogQHJldHVybnMgYSBuZXcgYER1cmF0aW9uYCByZXByZXNlbnRpbmcgYGFtb3VudGAgRGF5cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGF5cyhhbW91bnQ6IG51bWJlcik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKGFtb3VudCwgVGltZVVuaXQuRGF5cyk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBwZXJpb2QgZm9ybWF0dGVkIGFjY29yZGluZyB0byB0aGUgSVNPIDg2MDEgc3RhbmRhcmRcbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5pc28ub3JnL3N0YW5kYXJkLzcwOTA3Lmh0bWxcbiAgICogQHBhcmFtIGR1cmF0aW9uIGFuIElTTy1mb3JtYXR0ZWQgZHVyYXRpb24gdG8gYmUgcGFyc2VkLlxuICAgKiBAcmV0dXJucyB0aGUgcGFyc2VkIGBEdXJhdGlvbmAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGR1cmF0aW9uOiBzdHJpbmcpOiBEdXJhdGlvbiB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IGR1cmF0aW9uLm1hdGNoKC9eUCg/OihcXGQrKUQpPyg/OlQoPzooXFxkKylIKT8oPzooXFxkKylNKT8oPzooXFxkKylTKT8pPyQvKTtcbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgdmFsaWQgSVNPIGR1cmF0aW9uOiAke2R1cmF0aW9ufWApO1xuICAgIH1cbiAgICBjb25zdCBbLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kc10gPSBtYXRjaGVzO1xuICAgIGlmICghZGF5cyAmJiAhaG91cnMgJiYgIW1pbnV0ZXMgJiYgIXNlY29uZHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgdmFsaWQgSVNPIGR1cmF0aW9uOiAke2R1cmF0aW9ufWApO1xuICAgIH1cbiAgICByZXR1cm4gRHVyYXRpb24ubWlsbGlzKFxuICAgICAgX3RvSW50KHNlY29uZHMpICogVGltZVVuaXQuU2Vjb25kcy5pbk1pbGxpc1xuICAgICAgKyAoX3RvSW50KG1pbnV0ZXMpICogVGltZVVuaXQuTWludXRlcy5pbk1pbGxpcylcbiAgICAgICsgKF90b0ludChob3VycykgKiBUaW1lVW5pdC5Ib3Vycy5pbk1pbGxpcylcbiAgICAgICsgKF90b0ludChkYXlzKSAqIFRpbWVVbml0LkRheXMuaW5NaWxsaXMpLFxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBfdG9JbnQoc3RyOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgaWYgKCFzdHIpIHsgcmV0dXJuIDA7IH1cbiAgICAgIHJldHVybiBOdW1iZXIoc3RyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IGFtb3VudDogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IHVuaXQ6IFRpbWVVbml0O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoYW1vdW50OiBudW1iZXIsIHVuaXQ6IFRpbWVVbml0KSB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoYW1vdW50KSAmJiBhbW91bnQgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cmF0aW9uIGFtb3VudHMgY2Fubm90IGJlIG5lZ2F0aXZlLiBSZWNlaXZlZDogJHthbW91bnR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgdGhpcy51bml0ID0gdW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdHdvIER1cmF0aW9ucyB0b2dldGhlclxuICAgKi9cbiAgcHVibGljIHBsdXMocmhzOiBEdXJhdGlvbik6IER1cmF0aW9uIHtcbiAgICBjb25zdCB0YXJnZXRVbml0ID0gZmluZXN0VW5pdCh0aGlzLnVuaXQsIHJocy51bml0KTtcbiAgICBjb25zdCByZXMgPSBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIHRhcmdldFVuaXQsIHt9KSArIGNvbnZlcnQocmhzLmFtb3VudCwgcmhzLnVuaXQsIHRhcmdldFVuaXQsIHt9KTtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKHJlcywgdGFyZ2V0VW5pdCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic3RyYWN0IHR3byBEdXJhdGlvbnMgdG9nZXRoZXJcbiAgICovXG4gIHB1YmxpYyBtaW51cyhyaHM6IER1cmF0aW9uKTogRHVyYXRpb24ge1xuICAgIGNvbnN0IHRhcmdldFVuaXQgPSBmaW5lc3RVbml0KHRoaXMudW5pdCwgcmhzLnVuaXQpO1xuICAgIGNvbnN0IHJlcyA9IGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgdGFyZ2V0VW5pdCwge30pIC0gY29udmVydChyaHMuYW1vdW50LCByaHMudW5pdCwgdGFyZ2V0VW5pdCwge30pO1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24ocmVzLCB0YXJnZXRVbml0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaW4gdGhpcyBEdXJhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhpcyBgRHVyYXRpb25gIGV4cHJlc3NlZCBpbiBNaWxsaXNlY29uZHMuXG4gICAqL1xuICBwdWJsaWMgdG9NaWxsaXNlY29uZHMob3B0czogVGltZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0Lk1pbGxpc2Vjb25kcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2Ygc2Vjb25kcyBpbiB0aGlzIER1cmF0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGlzIGBEdXJhdGlvbmAgZXhwcmVzc2VkIGluIFNlY29uZHMuXG4gICAqL1xuICBwdWJsaWMgdG9TZWNvbmRzKG9wdHM6IFRpbWVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5TZWNvbmRzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBtaW51dGVzIGluIHRoaXMgRHVyYXRpb25cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoaXMgYER1cmF0aW9uYCBleHByZXNzZWQgaW4gTWludXRlcy5cbiAgICovXG4gIHB1YmxpYyB0b01pbnV0ZXMob3B0czogVGltZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFRpbWVVbml0Lk1pbnV0ZXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIGhvdXJzIGluIHRoaXMgRHVyYXRpb25cbiAgICpcbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoaXMgYER1cmF0aW9uYCBleHByZXNzZWQgaW4gSG91cnMuXG4gICAqL1xuICBwdWJsaWMgdG9Ib3VycyhvcHRzOiBUaW1lQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuSG91cnMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgbnVtYmVyIG9mIGRheXMgaW4gdGhpcyBEdXJhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhpcyBgRHVyYXRpb25gIGV4cHJlc3NlZCBpbiBEYXlzLlxuICAgKi9cbiAgcHVibGljIHRvRGF5cyhvcHRzOiBUaW1lQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgVGltZVVuaXQuRGF5cywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFuIElTTyA4NjAxIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgcGVyaW9kXG4gICAqXG4gICAqIEByZXR1cm5zIGEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggJ1AnIGRlc2NyaWJpbmcgdGhlIHBlcmlvZFxuICAgKiBAc2VlIGh0dHBzOi8vd3d3Lmlzby5vcmcvc3RhbmRhcmQvNzA5MDcuaHRtbFxuICAgKi9cbiAgcHVibGljIHRvSXNvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuYW1vdW50ID09PSAwKSB7IHJldHVybiAnUFQwUyc7IH1cblxuICAgIGNvbnN0IHJldCA9IFsnUCddO1xuICAgIGxldCB0ZWUgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgW2Ftb3VudCwgdW5pdF0gb2YgdGhpcy5jb21wb25lbnRzKHRydWUpKSB7XG4gICAgICBpZiAoW1RpbWVVbml0LlNlY29uZHMsIFRpbWVVbml0Lk1pbnV0ZXMsIFRpbWVVbml0LkhvdXJzXS5pbmNsdWRlcyh1bml0KSAmJiAhdGVlKSB7XG4gICAgICAgIHJldC5wdXNoKCdUJyk7XG4gICAgICAgIHRlZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXQucHVzaChgJHthbW91bnR9JHt1bml0Lmlzb0xhYmVsfWApO1xuICAgIH1cblxuICAgIHJldHVybiByZXQuam9pbignJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFuIElTTyA4NjAxIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgcGVyaW9kXG4gICAqXG4gICAqIEByZXR1cm5zIGEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggJ1AnIGRlc2NyaWJpbmcgdGhlIHBlcmlvZFxuICAgKiBAc2VlIGh0dHBzOi8vd3d3Lmlzby5vcmcvc3RhbmRhcmQvNzA5MDcuaHRtbFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHRvSXNvU3RyaW5nKClgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgdG9JU09TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50b0lzb1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFR1cm4gdGhpcyBkdXJhdGlvbiBpbnRvIGEgaHVtYW4tcmVhZGFibGUgc3RyaW5nXG4gICAqL1xuICBwdWJsaWMgdG9IdW1hblN0cmluZygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmFtb3VudCA9PT0gMCkgeyByZXR1cm4gZm10VW5pdCgwLCB0aGlzLnVuaXQpOyB9XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmFtb3VudCkpIHsgcmV0dXJuIGA8dG9rZW4+ICR7dGhpcy51bml0LmxhYmVsfWA7IH1cblxuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHMoZmFsc2UpXG4gICAgICAvLyAyIHNpZ25pZmljYW50IHBhcnRzLCB0aGF0J3MgdG90YWxseSBlbm91Z2ggZm9yIGh1bWFuc1xuICAgICAgLnNsaWNlKDAsIDIpXG4gICAgICAubWFwKChbYW1vdW50LCB1bml0XSkgPT4gZm10VW5pdChhbW91bnQsIHVuaXQpKVxuICAgICAgLmpvaW4oJyAnKTtcblxuICAgIGZ1bmN0aW9uIGZtdFVuaXQoYW1vdW50OiBudW1iZXIsIHVuaXQ6IFRpbWVVbml0KSB7XG4gICAgICBpZiAoYW1vdW50ID09PSAxKSB7XG4gICAgICAgIC8vIEFsbCBvZiB0aGUgbGFiZWxzIGVuZCBpbiAncydcbiAgICAgICAgcmV0dXJuIGAke2Ftb3VudH0gJHt1bml0LmxhYmVsLnN1YnN0cmluZygwLCB1bml0LmxhYmVsLmxlbmd0aCAtIDEpfWA7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7YW1vdW50fSAke3VuaXQubGFiZWx9YDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGBEdXJhdGlvbmBcbiAgICpcbiAgICogVGhpcyBpcyBpcyBuZXZlciB0aGUgcmlnaHQgZnVuY3Rpb24gdG8gdXNlIHdoZW4geW91IHdhbnQgdG8gdXNlIHRoZSBgRHVyYXRpb25gXG4gICAqIG9iamVjdCBpbiBhIHRlbXBsYXRlLiBVc2UgYHRvU2Vjb25kcygpYCwgYHRvTWludXRlcygpYCwgYHRvRGF5cygpYCwgZXRjLiBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBEdXJhdGlvbi4ke3RoaXMudW5pdC5sYWJlbH0oJHt0aGlzLmFtb3VudH0pYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGR1cmF0aW9uIGluIGEgc2V0IG9mIHdob2xlIG51bWJlcmVkIHRpbWUgY29tcG9uZW50cywgb3JkZXJlZCBmcm9tIGxhcmdlc3QgdG8gc21hbGxlc3RcbiAgICpcbiAgICogT25seSBjb21wb25lbnRzICE9IDAgd2lsbCBiZSByZXR1cm5lZC5cbiAgICpcbiAgICogQ2FuIGNvbWJpbmUgbWlsbGlzIGFuZCBzZWNvbmRzIHRvZ2V0aGVyIGZvciB0aGUgYmVuZWZpdCBvZiB0b0lzb1N0cmluZyxcbiAgICogbWFrZXMgdGhlIGxvZ2ljIGluIHRoZXJlIHNpbXBsZXIuXG4gICAqL1xuICBwcml2YXRlIGNvbXBvbmVudHMoY29tYmluZU1pbGxpc1dpdGhTZWNvbmRzOiBib29sZWFuKTogQXJyYXk8W251bWJlciwgVGltZVVuaXRdPiB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PFtudW1iZXIsIFRpbWVVbml0XT4oKTtcbiAgICBsZXQgbWlsbGlzID0gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBUaW1lVW5pdC5NaWxsaXNlY29uZHMsIHsgaW50ZWdyYWw6IGZhbHNlIH0pO1xuXG4gICAgZm9yIChjb25zdCB1bml0IG9mIFtUaW1lVW5pdC5EYXlzLCBUaW1lVW5pdC5Ib3VycywgVGltZVVuaXQuTWludXRlcywgVGltZVVuaXQuU2Vjb25kc10pIHtcbiAgICAgIGNvbnN0IGNvdW50ID0gY29udmVydChtaWxsaXMsIFRpbWVVbml0Lk1pbGxpc2Vjb25kcywgdW5pdCwgeyBpbnRlZ3JhbDogZmFsc2UgfSk7XG4gICAgICAvLyBSb3VuZCBkb3duIHRvIGEgd2hvbGUgbnVtYmVyIFVOTEVTUyB3ZSdyZSBjb21iaW5pbmcgbWlsbGlzIGFuZCBzZWNvbmRzIGFuZCB3ZSBnb3QgdG8gdGhlIHNlY29uZHNcbiAgICAgIGNvbnN0IHdob2xlQ291bnQgPSB1bml0ID09PSBUaW1lVW5pdC5TZWNvbmRzICYmIGNvbWJpbmVNaWxsaXNXaXRoU2Vjb25kcyA/IGNvdW50IDogTWF0aC5mbG9vcihjb3VudCk7XG4gICAgICBpZiAod2hvbGVDb3VudCA+IDApIHtcbiAgICAgICAgcmV0LnB1c2goW3dob2xlQ291bnQsIHVuaXRdKTtcbiAgICAgICAgbWlsbGlzIC09IHdob2xlQ291bnQgKiB1bml0LmluTWlsbGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbWFpbmRlciBpbiBtaWxsaXNcbiAgICBpZiAobWlsbGlzID4gMCkge1xuICAgICAgcmV0LnB1c2goW21pbGxpcywgVGltZVVuaXQuTWlsbGlzZWNvbmRzXSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGR1cmF0aW9uIGlzIGEgdG9rZW4gb3IgYSByZXNvbHZhYmxlIG9iamVjdFxuICAgKi9cbiAgcHVibGljIGlzVW5yZXNvbHZlZCgpIHtcbiAgICByZXR1cm4gVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMuYW1vdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHVuaXQgb2YgdGhlIGR1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgdW5pdExhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLnVuaXQubGFiZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBzdHJpbmdpZmllZCBudW1iZXIgb2YgZHVyYXRpb25cbiAgICovXG4gIHB1YmxpYyBmb3JtYXRUb2tlblRvTnVtYmVyKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbnVtYmVyID0gVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcih0aGlzLmFtb3VudCk7XG4gICAgcmV0dXJuIGAke251bWJlcn0gJHt0aGlzLnVuaXQubGFiZWx9YDtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGhvdyB0byBjb252ZXJ0IHRpbWUgdG8gYSBkaWZmZXJlbnQgdW5pdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaW1lQ29udmVyc2lvbk9wdGlvbnMge1xuICAvKipcbiAgICogSWYgYHRydWVgLCBjb252ZXJzaW9ucyBpbnRvIGEgbGFyZ2VyIHRpbWUgdW5pdCAoZS5nLiBgU2Vjb25kc2AgdG8gYE1pbnV0ZXNgKSB3aWxsIGZhaWwgaWYgdGhlIHJlc3VsdCBpcyBub3QgYW5cbiAgICogaW50ZWdlci5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZWdyYWw/OiBib29sZWFuO1xufVxuXG5jbGFzcyBUaW1lVW5pdCB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTWlsbGlzZWNvbmRzID0gbmV3IFRpbWVVbml0KCdtaWxsaXMnLCAnJywgMSk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU2Vjb25kcyA9IG5ldyBUaW1lVW5pdCgnc2Vjb25kcycsICdTJywgMV8wMDApO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1pbnV0ZXMgPSBuZXcgVGltZVVuaXQoJ21pbnV0ZXMnLCAnTScsIDYwXzAwMCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgSG91cnMgPSBuZXcgVGltZVVuaXQoJ2hvdXJzJywgJ0gnLCAzXzYwMF8wMDApO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERheXMgPSBuZXcgVGltZVVuaXQoJ2RheXMnLCAnRCcsIDg2XzQwMF8wMDApO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGxhYmVsOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBpc29MYWJlbDogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgaW5NaWxsaXM6IG51bWJlcikge1xuICAgIC8vIE1BWF9TQUZFX0lOVEVHRVIgaXMgMl41Mywgc28gYnkgcmVwcmVzZW50aW5nIG91ciBkdXJhdGlvbiBpbiBtaWxsaXMgKHRoZSBsb3dlc3RcbiAgICAvLyBjb21tb24gdW5pdCkgdGhlIGhpZ2hlc3QgZHVyYXRpb24gd2UgY2FuIHJlcHJlc2VudCBpc1xuICAgIC8vIDJeNTMgLyA4NioxMF42IH49IDEwNCAqIDEwXjYgZGF5cyAoYWJvdXQgMTAwIG1pbGxpb24gZGF5cykuXG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWw7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29udmVydChhbW91bnQ6IG51bWJlciwgZnJvbVVuaXQ6IFRpbWVVbml0LCB0b1VuaXQ6IFRpbWVVbml0LCB7IGludGVncmFsID0gdHJ1ZSB9OiBUaW1lQ29udmVyc2lvbk9wdGlvbnMpIHtcbiAgaWYgKGZyb21Vbml0LmluTWlsbGlzID09PSB0b1VuaXQuaW5NaWxsaXMpIHtcbiAgICBpZiAoaW50ZWdyYWwgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChhbW91bnQpICYmICFOdW1iZXIuaXNJbnRlZ2VyKGFtb3VudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHthbW91bnR9IG11c3QgYmUgYSB3aG9sZSBudW1iZXIgb2YgJHt0b1VuaXR9LmApO1xuICAgIH1cbiAgICByZXR1cm4gYW1vdW50O1xuICB9XG4gIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoYW1vdW50KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRHVyYXRpb24gbXVzdCBiZSBzcGVjaWZpZWQgYXMgJ0R1cmF0aW9uLiR7dG9Vbml0fSgpJyBoZXJlIHNpbmNlIGl0cyB2YWx1ZSBjb21lcyBmcm9tIGEgdG9rZW4gYW5kIGNhbm5vdCBiZSBjb252ZXJ0ZWQgKGdvdCBEdXJhdGlvbi4ke2Zyb21Vbml0fSlgKTtcbiAgfVxuICBjb25zdCB2YWx1ZSA9IChhbW91bnQgKiBmcm9tVW5pdC5pbk1pbGxpcykgLyB0b1VuaXQuaW5NaWxsaXM7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgJiYgaW50ZWdyYWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2Ftb3VudH0gJHtmcm9tVW5pdH0nIGNhbm5vdCBiZSBjb252ZXJ0ZWQgaW50byBhIHdob2xlIG51bWJlciBvZiAke3RvVW5pdH0uYCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgdGltZSB1bml0IHdpdGggaGlnaGVzdCBncmFudWxhcml0eVxuICovXG5mdW5jdGlvbiBmaW5lc3RVbml0KGE6IFRpbWVVbml0LCBiOiBUaW1lVW5pdCkge1xuICByZXR1cm4gYS5pbk1pbGxpcyA8IGIuaW5NaWxsaXMgPyBhIDogYjtcbn1cbiJdfQ==