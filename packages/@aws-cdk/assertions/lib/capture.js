"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capture = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const _1 = require(".");
const matcher_1 = require("./matcher");
const type_1 = require("./private/type");
/**
 * Capture values while matching templates.
 * Using an instance of this class within a Matcher will capture the matching value.
 * The `as*()` APIs on the instance can be used to get the captured value.
 */
class Capture extends matcher_1.Matcher {
    /**
     * Initialize a new capture
     * @param pattern a nested pattern or Matcher.
     * If a nested pattern is provided `objectLike()` matching is applied.
     */
    constructor(pattern) {
        super();
        this.pattern = pattern;
        /** @internal */
        this._captured = [];
        this.idx = 0;
        this.name = 'Capture';
    }
    test(actual) {
        const result = new matcher_1.MatchResult(actual);
        if (actual == null) {
            return result.recordFailure({
                matcher: this,
                path: [],
                message: `Can only capture non-nullish values. Found ${actual}`,
            });
        }
        if (this.pattern !== undefined) {
            const innerMatcher = matcher_1.Matcher.isMatcher(this.pattern) ? this.pattern : _1.Match.objectLike(this.pattern);
            const innerResult = innerMatcher.test(actual);
            if (innerResult.hasFailed()) {
                return innerResult;
            }
        }
        result.recordCapture({ capture: this, value: actual });
        return result;
    }
    /**
     * When multiple results are captured, move the iterator to the next result.
     * @returns true if another capture is present, false otherwise
     */
    next() {
        if (this.idx < this._captured.length - 1) {
            this.idx++;
            return true;
        }
        return false;
    }
    /**
     * Retrieve the captured value as a string.
     * An error is generated if no value is captured or if the value is not a string.
     */
    asString() {
        this.validate();
        const val = this._captured[this.idx];
        if ((0, type_1.getType)(val) === 'string') {
            return val;
        }
        this.reportIncorrectType('string');
    }
    /**
     * Retrieve the captured value as a number.
     * An error is generated if no value is captured or if the value is not a number.
     */
    asNumber() {
        this.validate();
        const val = this._captured[this.idx];
        if ((0, type_1.getType)(val) === 'number') {
            return val;
        }
        this.reportIncorrectType('number');
    }
    /**
     * Retrieve the captured value as a boolean.
     * An error is generated if no value is captured or if the value is not a boolean.
     */
    asBoolean() {
        this.validate();
        const val = this._captured[this.idx];
        if ((0, type_1.getType)(val) === 'boolean') {
            return val;
        }
        this.reportIncorrectType('boolean');
    }
    /**
     * Retrieve the captured value as an array.
     * An error is generated if no value is captured or if the value is not an array.
     */
    asArray() {
        this.validate();
        const val = this._captured[this.idx];
        if ((0, type_1.getType)(val) === 'array') {
            return val;
        }
        this.reportIncorrectType('array');
    }
    /**
     * Retrieve the captured value as a JSON object.
     * An error is generated if no value is captured or if the value is not an object.
     */
    asObject() {
        this.validate();
        const val = this._captured[this.idx];
        if ((0, type_1.getType)(val) === 'object') {
            return val;
        }
        this.reportIncorrectType('object');
    }
    validate() {
        if (this._captured.length === 0) {
            throw new Error('No value captured');
        }
    }
    reportIncorrectType(expected) {
        throw new Error(`Captured value is expected to be ${expected} but found ${(0, type_1.getType)(this._captured[this.idx])}. ` +
            `Value is ${JSON.stringify(this._captured[this.idx], undefined, 2)}`);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Capture[_a] = { fqn: "@aws-cdk/assertions.Capture", version: "0.0.0" };
exports.Capture = Capture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcHR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3QkFBMEI7QUFDMUIsdUNBQWlEO0FBQ2pELHlDQUErQztBQUUvQzs7OztHQUlHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsaUJBQU87SUFNbEM7Ozs7T0FJRztJQUNILFlBQTZCLE9BQWE7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUFEbUIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtRQVQxQyxnQkFBZ0I7UUFDVCxjQUFTLEdBQVUsRUFBRSxDQUFDO1FBQ3JCLFFBQUcsR0FBRyxDQUFDLENBQUM7UUFTZCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztLQUN2QjtJQUVNLElBQUksQ0FBQyxNQUFXO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDbEIsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsOENBQThDLE1BQU0sRUFBRTthQUNoRSxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDOUIsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMzQixPQUFPLFdBQVcsQ0FBQzth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QUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN6RTs7OztBQTVIVSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoIH0gZnJvbSAnLic7XG5pbXBvcnQgeyBNYXRjaGVyLCBNYXRjaFJlc3VsdCB9IGZyb20gJy4vbWF0Y2hlcic7XG5pbXBvcnQgeyBUeXBlLCBnZXRUeXBlIH0gZnJvbSAnLi9wcml2YXRlL3R5cGUnO1xuXG4vKipcbiAqIENhcHR1cmUgdmFsdWVzIHdoaWxlIG1hdGNoaW5nIHRlbXBsYXRlcy5cbiAqIFVzaW5nIGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3Mgd2l0aGluIGEgTWF0Y2hlciB3aWxsIGNhcHR1cmUgdGhlIG1hdGNoaW5nIHZhbHVlLlxuICogVGhlIGBhcyooKWAgQVBJcyBvbiB0aGUgaW5zdGFuY2UgY2FuIGJlIHVzZWQgdG8gZ2V0IHRoZSBjYXB0dXJlZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENhcHR1cmUgZXh0ZW5kcyBNYXRjaGVyIHtcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX2NhcHR1cmVkOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIGlkeCA9IDA7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgY2FwdHVyZVxuICAgKiBAcGFyYW0gcGF0dGVybiBhIG5lc3RlZCBwYXR0ZXJuIG9yIE1hdGNoZXIuXG4gICAqIElmIGEgbmVzdGVkIHBhdHRlcm4gaXMgcHJvdmlkZWQgYG9iamVjdExpa2UoKWAgbWF0Y2hpbmcgaXMgYXBwbGllZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybj86IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lID0gJ0NhcHR1cmUnO1xuICB9XG5cbiAgcHVibGljIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYENhbiBvbmx5IGNhcHR1cmUgbm9uLW51bGxpc2ggdmFsdWVzLiBGb3VuZCAke2FjdHVhbH1gLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGF0dGVybiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBpbm5lck1hdGNoZXIgPSBNYXRjaGVyLmlzTWF0Y2hlcih0aGlzLnBhdHRlcm4pID8gdGhpcy5wYXR0ZXJuIDogTWF0Y2gub2JqZWN0TGlrZSh0aGlzLnBhdHRlcm4pO1xuICAgICAgY29uc3QgaW5uZXJSZXN1bHQgPSBpbm5lck1hdGNoZXIudGVzdChhY3R1YWwpO1xuICAgICAgaWYgKGlubmVyUmVzdWx0Lmhhc0ZhaWxlZCgpKSB7XG4gICAgICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQucmVjb3JkQ2FwdHVyZSh7IGNhcHR1cmU6IHRoaXMsIHZhbHVlOiBhY3R1YWwgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIG11bHRpcGxlIHJlc3VsdHMgYXJlIGNhcHR1cmVkLCBtb3ZlIHRoZSBpdGVyYXRvciB0byB0aGUgbmV4dCByZXN1bHQuXG4gICAqIEByZXR1cm5zIHRydWUgaWYgYW5vdGhlciBjYXB0dXJlIGlzIHByZXNlbnQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgcHVibGljIG5leHQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuaWR4IDwgdGhpcy5fY2FwdHVyZWQubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5pZHgrKztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNhcHR1cmVkIHZhbHVlIGFzIGEgc3RyaW5nLlxuICAgKiBBbiBlcnJvciBpcyBnZW5lcmF0ZWQgaWYgbm8gdmFsdWUgaXMgY2FwdHVyZWQgb3IgaWYgdGhlIHZhbHVlIGlzIG5vdCBhIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBhc1N0cmluZygpOiBzdHJpbmcge1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9jYXB0dXJlZFt0aGlzLmlkeF07XG4gICAgaWYgKGdldFR5cGUodmFsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHRoaXMucmVwb3J0SW5jb3JyZWN0VHlwZSgnc3RyaW5nJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNhcHR1cmVkIHZhbHVlIGFzIGEgbnVtYmVyLlxuICAgKiBBbiBlcnJvciBpcyBnZW5lcmF0ZWQgaWYgbm8gdmFsdWUgaXMgY2FwdHVyZWQgb3IgaWYgdGhlIHZhbHVlIGlzIG5vdCBhIG51bWJlci5cbiAgICovXG4gIHB1YmxpYyBhc051bWJlcigpOiBudW1iZXIge1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9jYXB0dXJlZFt0aGlzLmlkeF07XG4gICAgaWYgKGdldFR5cGUodmFsKSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHRoaXMucmVwb3J0SW5jb3JyZWN0VHlwZSgnbnVtYmVyJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNhcHR1cmVkIHZhbHVlIGFzIGEgYm9vbGVhbi5cbiAgICogQW4gZXJyb3IgaXMgZ2VuZXJhdGVkIGlmIG5vIHZhbHVlIGlzIGNhcHR1cmVkIG9yIGlmIHRoZSB2YWx1ZSBpcyBub3QgYSBib29sZWFuLlxuICAgKi9cbiAgcHVibGljIGFzQm9vbGVhbigpOiBib29sZWFuIHtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgY29uc3QgdmFsID0gdGhpcy5fY2FwdHVyZWRbdGhpcy5pZHhdO1xuICAgIGlmIChnZXRUeXBlKHZhbCkgPT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRJbmNvcnJlY3RUeXBlKCdib29sZWFuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGNhcHR1cmVkIHZhbHVlIGFzIGFuIGFycmF5LlxuICAgKiBBbiBlcnJvciBpcyBnZW5lcmF0ZWQgaWYgbm8gdmFsdWUgaXMgY2FwdHVyZWQgb3IgaWYgdGhlIHZhbHVlIGlzIG5vdCBhbiBhcnJheS5cbiAgICovXG4gIHB1YmxpYyBhc0FycmF5KCk6IGFueVtdIHtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgY29uc3QgdmFsID0gdGhpcy5fY2FwdHVyZWRbdGhpcy5pZHhdO1xuICAgIGlmIChnZXRUeXBlKHZhbCkgPT09ICdhcnJheScpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHRoaXMucmVwb3J0SW5jb3JyZWN0VHlwZSgnYXJyYXknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2FwdHVyZWQgdmFsdWUgYXMgYSBKU09OIG9iamVjdC5cbiAgICogQW4gZXJyb3IgaXMgZ2VuZXJhdGVkIGlmIG5vIHZhbHVlIGlzIGNhcHR1cmVkIG9yIGlmIHRoZSB2YWx1ZSBpcyBub3QgYW4gb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGFzT2JqZWN0KCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9jYXB0dXJlZFt0aGlzLmlkeF07XG4gICAgaWYgKGdldFR5cGUodmFsKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHRoaXMucmVwb3J0SW5jb3JyZWN0VHlwZSgnb2JqZWN0Jyk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYXB0dXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdmFsdWUgY2FwdHVyZWQnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlcG9ydEluY29ycmVjdFR5cGUoZXhwZWN0ZWQ6IFR5cGUpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYXB0dXJlZCB2YWx1ZSBpcyBleHBlY3RlZCB0byBiZSAke2V4cGVjdGVkfSBidXQgZm91bmQgJHtnZXRUeXBlKHRoaXMuX2NhcHR1cmVkW3RoaXMuaWR4XSl9LiBgICtcbiAgICAgIGBWYWx1ZSBpcyAke0pTT04uc3RyaW5naWZ5KHRoaXMuX2NhcHR1cmVkW3RoaXMuaWR4XSwgdW5kZWZpbmVkLCAyKX1gKTtcbiAgfVxufSJdfQ==