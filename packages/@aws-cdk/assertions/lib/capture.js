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
        if (type_1.getType(val) === 'string') {
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
        if (type_1.getType(val) === 'number') {
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
        if (type_1.getType(val) === 'boolean') {
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
        if (type_1.getType(val) === 'array') {
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
        if (type_1.getType(val) === 'object') {
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
        throw new Error(`Captured value is expected to be ${expected} but found ${type_1.getType(this._captured[this.idx])}. ` +
            `Value is ${JSON.stringify(this._captured[this.idx], undefined, 2)}`);
    }
}
exports.Capture = Capture;
_a = JSII_RTTI_SYMBOL_1;
Capture[_a] = { fqn: "@aws-cdk/assertions.Capture", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcHR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3QkFBMEI7QUFDMUIsdUNBQWlEO0FBQ2pELHlDQUErQztBQUUvQzs7OztHQUlHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsaUJBQU87SUFNbEM7Ozs7T0FJRztJQUNILFlBQTZCLE9BQWE7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUFEbUIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtRQVQxQyxnQkFBZ0I7UUFDVCxjQUFTLEdBQVUsRUFBRSxDQUFDO1FBQ3JCLFFBQUcsR0FBRyxDQUFDLENBQUM7UUFTZCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztLQUN2QjtJQUVNLElBQUksQ0FBQyxNQUFXO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDbEIsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsOENBQThDLE1BQU0sRUFBRTthQUNoRSxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDOUIsTUFBTSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMzQixPQUFPLFdBQVcsQ0FBQzth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QUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN6RTs7QUE1SEgsMEJBNkhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2ggfSBmcm9tICcuJztcbmltcG9ydCB7IE1hdGNoZXIsIE1hdGNoUmVzdWx0IH0gZnJvbSAnLi9tYXRjaGVyJztcbmltcG9ydCB7IFR5cGUsIGdldFR5cGUgfSBmcm9tICcuL3ByaXZhdGUvdHlwZSc7XG5cbi8qKlxuICogQ2FwdHVyZSB2YWx1ZXMgd2hpbGUgbWF0Y2hpbmcgdGVtcGxhdGVzLlxuICogVXNpbmcgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyB3aXRoaW4gYSBNYXRjaGVyIHdpbGwgY2FwdHVyZSB0aGUgbWF0Y2hpbmcgdmFsdWUuXG4gKiBUaGUgYGFzKigpYCBBUElzIG9uIHRoZSBpbnN0YW5jZSBjYW4gYmUgdXNlZCB0byBnZXQgdGhlIGNhcHR1cmVkIHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgQ2FwdHVyZSBleHRlbmRzIE1hdGNoZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfY2FwdHVyZWQ6IGFueVtdID0gW107XG4gIHByaXZhdGUgaWR4ID0gMDtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBjYXB0dXJlXG4gICAqIEBwYXJhbSBwYXR0ZXJuIGEgbmVzdGVkIHBhdHRlcm4gb3IgTWF0Y2hlci5cbiAgICogSWYgYSBuZXN0ZWQgcGF0dGVybiBpcyBwcm92aWRlZCBgb2JqZWN0TGlrZSgpYCBtYXRjaGluZyBpcyBhcHBsaWVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwYXR0ZXJuPzogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUgPSAnQ2FwdHVyZSc7XG4gIH1cblxuICBwdWJsaWMgdGVzdChhY3R1YWw6IGFueSk6IE1hdGNoUmVzdWx0IHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWF0Y2hSZXN1bHQoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsID09IG51bGwpIHtcbiAgICAgIHJldHVybiByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgQ2FuIG9ubHkgY2FwdHVyZSBub24tbnVsbGlzaCB2YWx1ZXMuIEZvdW5kICR7YWN0dWFsfWAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXR0ZXJuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGlubmVyTWF0Y2hlciA9IE1hdGNoZXIuaXNNYXRjaGVyKHRoaXMucGF0dGVybikgPyB0aGlzLnBhdHRlcm4gOiBNYXRjaC5vYmplY3RMaWtlKHRoaXMucGF0dGVybik7XG4gICAgICBjb25zdCBpbm5lclJlc3VsdCA9IGlubmVyTWF0Y2hlci50ZXN0KGFjdHVhbCk7XG4gICAgICBpZiAoaW5uZXJSZXN1bHQuaGFzRmFpbGVkKCkpIHtcbiAgICAgICAgcmV0dXJuIGlubmVyUmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdC5yZWNvcmRDYXB0dXJlKHsgY2FwdHVyZTogdGhpcywgdmFsdWU6IGFjdHVhbCB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gbXVsdGlwbGUgcmVzdWx0cyBhcmUgY2FwdHVyZWQsIG1vdmUgdGhlIGl0ZXJhdG9yIHRvIHRoZSBuZXh0IHJlc3VsdC5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiBhbm90aGVyIGNhcHR1cmUgaXMgcHJlc2VudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgbmV4dCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5pZHggPCB0aGlzLl9jYXB0dXJlZC5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmlkeCsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2FwdHVyZWQgdmFsdWUgYXMgYSBzdHJpbmcuXG4gICAqIEFuIGVycm9yIGlzIGdlbmVyYXRlZCBpZiBubyB2YWx1ZSBpcyBjYXB0dXJlZCBvciBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIGFzU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2NhcHR1cmVkW3RoaXMuaWR4XTtcbiAgICBpZiAoZ2V0VHlwZSh2YWwpID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRJbmNvcnJlY3RUeXBlKCdzdHJpbmcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2FwdHVyZWQgdmFsdWUgYXMgYSBudW1iZXIuXG4gICAqIEFuIGVycm9yIGlzIGdlbmVyYXRlZCBpZiBubyB2YWx1ZSBpcyBjYXB0dXJlZCBvciBpZiB0aGUgdmFsdWUgaXMgbm90IGEgbnVtYmVyLlxuICAgKi9cbiAgcHVibGljIGFzTnVtYmVyKCk6IG51bWJlciB7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2NhcHR1cmVkW3RoaXMuaWR4XTtcbiAgICBpZiAoZ2V0VHlwZSh2YWwpID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRJbmNvcnJlY3RUeXBlKCdudW1iZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2FwdHVyZWQgdmFsdWUgYXMgYSBib29sZWFuLlxuICAgKiBBbiBlcnJvciBpcyBnZW5lcmF0ZWQgaWYgbm8gdmFsdWUgaXMgY2FwdHVyZWQgb3IgaWYgdGhlIHZhbHVlIGlzIG5vdCBhIGJvb2xlYW4uXG4gICAqL1xuICBwdWJsaWMgYXNCb29sZWFuKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9jYXB0dXJlZFt0aGlzLmlkeF07XG4gICAgaWYgKGdldFR5cGUodmFsKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICB0aGlzLnJlcG9ydEluY29ycmVjdFR5cGUoJ2Jvb2xlYW4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgY2FwdHVyZWQgdmFsdWUgYXMgYW4gYXJyYXkuXG4gICAqIEFuIGVycm9yIGlzIGdlbmVyYXRlZCBpZiBubyB2YWx1ZSBpcyBjYXB0dXJlZCBvciBpZiB0aGUgdmFsdWUgaXMgbm90IGFuIGFycmF5LlxuICAgKi9cbiAgcHVibGljIGFzQXJyYXkoKTogYW55W10ge1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9jYXB0dXJlZFt0aGlzLmlkeF07XG4gICAgaWYgKGdldFR5cGUodmFsKSA9PT0gJ2FycmF5Jykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRJbmNvcnJlY3RUeXBlKCdhcnJheScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBjYXB0dXJlZCB2YWx1ZSBhcyBhIEpTT04gb2JqZWN0LlxuICAgKiBBbiBlcnJvciBpcyBnZW5lcmF0ZWQgaWYgbm8gdmFsdWUgaXMgY2FwdHVyZWQgb3IgaWYgdGhlIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgYXNPYmplY3QoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuX2NhcHR1cmVkW3RoaXMuaWR4XTtcbiAgICBpZiAoZ2V0VHlwZSh2YWwpID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdGhpcy5yZXBvcnRJbmNvcnJlY3RUeXBlKCdvYmplY3QnKTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NhcHR1cmVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB2YWx1ZSBjYXB0dXJlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVwb3J0SW5jb3JyZWN0VHlwZShleHBlY3RlZDogVHlwZSk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhcHR1cmVkIHZhbHVlIGlzIGV4cGVjdGVkIHRvIGJlICR7ZXhwZWN0ZWR9IGJ1dCBmb3VuZCAke2dldFR5cGUodGhpcy5fY2FwdHVyZWRbdGhpcy5pZHhdKX0uIGAgK1xuICAgICAgYFZhbHVlIGlzICR7SlNPTi5zdHJpbmdpZnkodGhpcy5fY2FwdHVyZWRbdGhpcy5pZHhdLCB1bmRlZmluZWQsIDIpfWApO1xuICB9XG59Il19