"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expiration = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Represents a date of expiration.
 *
 * The amount can be specified either as a Date object, timestamp, Duration or string.
 */
class Expiration {
    constructor(date) {
        this.date = date;
    }
    /**
     * Expire at the specified date
     * @param d date to expire at
     */
    static atDate(d) { return new Expiration(d); }
    /**
     * Expire at the specified timestamp
     * @param t timestamp in unix milliseconds
     */
    static atTimestamp(t) { return Expiration.atDate(new Date(t)); }
    /**
     * Expire once the specified duration has passed since deployment time
     * @param t the duration to wait before expiring
     */
    static after(t) { try {
        jsiiDeprecationWarnings._aws_cdk_core_Duration(t);
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.after);
        }
        throw error;
    } return Expiration.atDate(new Date(Date.now() + t.toMilliseconds())); }
    /**
     * Expire at specified date, represented as a string
     *
     * @param s the string that represents date to expire at
     */
    static fromString(s) { return new Expiration(new Date(s)); }
    /**
     * Exipration Value in a formatted Unix Epoch Time in seconds
     */
    toEpoch() {
        return Math.round(this.date.getTime() / 1000);
    }
    /**
     * Check if Exipiration expires before input
     * @param t the duration to check against
     */
    isBefore(t) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Duration(t);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.isBefore);
            }
            throw error;
        }
        return this.date < new Date(Date.now() + t.toMilliseconds());
    }
    /**
     * Check if Exipiration expires after input
     * @param t the duration to check against
     */
    isAfter(t) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Duration(t);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.isAfter);
            }
            throw error;
        }
        return this.date > new Date(Date.now() + t.toMilliseconds());
    }
}
exports.Expiration = Expiration;
_a = JSII_RTTI_SYMBOL_1;
Expiration[_a] = { fqn: "@aws-cdk/core.Expiration", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwaXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cGlyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7R0FJRztBQUNILE1BQWEsVUFBVTtJQStCckIsWUFBb0IsSUFBVTtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjtJQWhDRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQU8sSUFBSSxPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFM0Q7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFTLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUUvRTs7O09BR0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQVc7Ozs7Ozs7O01BQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFekc7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBUyxJQUFJLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBVzNFOztPQUVHO0lBQ0ksT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQy9DO0lBQ0Q7OztPQUdHO0lBQ0ksUUFBUSxDQUFDLENBQVc7Ozs7Ozs7Ozs7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztLQUM5RDtJQUVEOzs7T0FHRztJQUNJLE9BQU8sQ0FBRSxDQUFXOzs7Ozs7Ozs7O1FBQ3pCLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7S0FDOUQ7O0FBdkRILGdDQXdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnLi9kdXJhdGlvbic7XG4vKipcbiAqIFJlcHJlc2VudHMgYSBkYXRlIG9mIGV4cGlyYXRpb24uXG4gKlxuICogVGhlIGFtb3VudCBjYW4gYmUgc3BlY2lmaWVkIGVpdGhlciBhcyBhIERhdGUgb2JqZWN0LCB0aW1lc3RhbXAsIER1cmF0aW9uIG9yIHN0cmluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIEV4cGlyYXRpb24ge1xuICAvKipcbiAgICogRXhwaXJlIGF0IHRoZSBzcGVjaWZpZWQgZGF0ZVxuICAgKiBAcGFyYW0gZCBkYXRlIHRvIGV4cGlyZSBhdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhdERhdGUoZDogRGF0ZSkgeyByZXR1cm4gbmV3IEV4cGlyYXRpb24oZCk7IH1cblxuICAvKipcbiAgICogRXhwaXJlIGF0IHRoZSBzcGVjaWZpZWQgdGltZXN0YW1wXG4gICAqIEBwYXJhbSB0IHRpbWVzdGFtcCBpbiB1bml4IG1pbGxpc2Vjb25kc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhdFRpbWVzdGFtcCh0OiBudW1iZXIpIHsgcmV0dXJuIEV4cGlyYXRpb24uYXREYXRlKG5ldyBEYXRlKHQpKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmUgb25jZSB0aGUgc3BlY2lmaWVkIGR1cmF0aW9uIGhhcyBwYXNzZWQgc2luY2UgZGVwbG95bWVudCB0aW1lXG4gICAqIEBwYXJhbSB0IHRoZSBkdXJhdGlvbiB0byB3YWl0IGJlZm9yZSBleHBpcmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhZnRlcih0OiBEdXJhdGlvbikgeyByZXR1cm4gRXhwaXJhdGlvbi5hdERhdGUobmV3IERhdGUoRGF0ZS5ub3coKSArIHQudG9NaWxsaXNlY29uZHMoKSkpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGlyZSBhdCBzcGVjaWZpZWQgZGF0ZSwgcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHMgdGhlIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgZGF0ZSB0byBleHBpcmUgYXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyhzOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBFeHBpcmF0aW9uKG5ldyBEYXRlKHMpKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmF0aW9uIHZhbHVlIGFzIGEgRGF0ZSBvYmplY3RcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkYXRlOiBEYXRlO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoZGF0ZTogRGF0ZSkge1xuICAgIHRoaXMuZGF0ZSA9IGRhdGU7XG4gIH1cblxuICAvKipcbiAgICogRXhpcHJhdGlvbiBWYWx1ZSBpbiBhIGZvcm1hdHRlZCBVbml4IEVwb2NoIFRpbWUgaW4gc2Vjb25kc1xuICAgKi9cbiAgcHVibGljIHRvRXBvY2goKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmRhdGUuZ2V0VGltZSgpIC8gMTAwMCk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIGlmIEV4aXBpcmF0aW9uIGV4cGlyZXMgYmVmb3JlIGlucHV0XG4gICAqIEBwYXJhbSB0IHRoZSBkdXJhdGlvbiB0byBjaGVjayBhZ2FpbnN0XG4gICAqL1xuICBwdWJsaWMgaXNCZWZvcmUodDogRHVyYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlIDwgbmV3IERhdGUoRGF0ZS5ub3coKSArIHQudG9NaWxsaXNlY29uZHMoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgRXhpcGlyYXRpb24gZXhwaXJlcyBhZnRlciBpbnB1dFxuICAgKiBAcGFyYW0gdCB0aGUgZHVyYXRpb24gdG8gY2hlY2sgYWdhaW5zdFxuICAgKi9cbiAgcHVibGljIGlzQWZ0ZXIoIHQ6IER1cmF0aW9uICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGUgPiBuZXcgRGF0ZShEYXRlLm5vdygpICsgdC50b01pbGxpc2Vjb25kcygpKTtcbiAgfVxufVxuIl19