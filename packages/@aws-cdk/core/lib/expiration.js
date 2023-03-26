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
    constructor(date) {
        this.date = date;
    }
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
_a = JSII_RTTI_SYMBOL_1;
Expiration[_a] = { fqn: "@aws-cdk/core.Expiration", version: "0.0.0" };
exports.Expiration = Expiration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwaXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cGlyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7R0FJRztBQUNILE1BQWEsVUFBVTtJQUNyQjs7O09BR0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQU8sSUFBSSxPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFM0Q7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFTLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUUvRTs7O09BR0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQVc7Ozs7Ozs7O01BQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFekc7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBUyxJQUFJLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBTzNFLFlBQW9CLElBQVU7UUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7SUFFRDs7T0FFRztJQUNJLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUMvQztJQUNEOzs7T0FHRztJQUNJLFFBQVEsQ0FBQyxDQUFXOzs7Ozs7Ozs7O1FBQ3pCLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUFFRDs7O09BR0c7SUFDSSxPQUFPLENBQUUsQ0FBVzs7Ozs7Ozs7OztRQUN6QixPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0tBQzlEOzs7O0FBdkRVLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICcuL2R1cmF0aW9uJztcbi8qKlxuICogUmVwcmVzZW50cyBhIGRhdGUgb2YgZXhwaXJhdGlvbi5cbiAqXG4gKiBUaGUgYW1vdW50IGNhbiBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzIGEgRGF0ZSBvYmplY3QsIHRpbWVzdGFtcCwgRHVyYXRpb24gb3Igc3RyaW5nLlxuICovXG5leHBvcnQgY2xhc3MgRXhwaXJhdGlvbiB7XG4gIC8qKlxuICAgKiBFeHBpcmUgYXQgdGhlIHNwZWNpZmllZCBkYXRlXG4gICAqIEBwYXJhbSBkIGRhdGUgdG8gZXhwaXJlIGF0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGF0RGF0ZShkOiBEYXRlKSB7IHJldHVybiBuZXcgRXhwaXJhdGlvbihkKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmUgYXQgdGhlIHNwZWNpZmllZCB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHQgdGltZXN0YW1wIGluIHVuaXggbWlsbGlzZWNvbmRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGF0VGltZXN0YW1wKHQ6IG51bWJlcikgeyByZXR1cm4gRXhwaXJhdGlvbi5hdERhdGUobmV3IERhdGUodCkpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGlyZSBvbmNlIHRoZSBzcGVjaWZpZWQgZHVyYXRpb24gaGFzIHBhc3NlZCBzaW5jZSBkZXBsb3ltZW50IHRpbWVcbiAgICogQHBhcmFtIHQgdGhlIGR1cmF0aW9uIHRvIHdhaXQgYmVmb3JlIGV4cGlyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFmdGVyKHQ6IER1cmF0aW9uKSB7IHJldHVybiBFeHBpcmF0aW9uLmF0RGF0ZShuZXcgRGF0ZShEYXRlLm5vdygpICsgdC50b01pbGxpc2Vjb25kcygpKSk7IH1cblxuICAvKipcbiAgICogRXhwaXJlIGF0IHNwZWNpZmllZCBkYXRlLCByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0gcyB0aGUgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyBkYXRlIHRvIGV4cGlyZSBhdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nKHM6IHN0cmluZykgeyByZXR1cm4gbmV3IEV4cGlyYXRpb24obmV3IERhdGUocykpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGlyYXRpb24gdmFsdWUgYXMgYSBEYXRlIG9iamVjdFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihkYXRlOiBEYXRlKSB7XG4gICAgdGhpcy5kYXRlID0gZGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGlwcmF0aW9uIFZhbHVlIGluIGEgZm9ybWF0dGVkIFVuaXggRXBvY2ggVGltZSBpbiBzZWNvbmRzXG4gICAqL1xuICBwdWJsaWMgdG9FcG9jaCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgRXhpcGlyYXRpb24gZXhwaXJlcyBiZWZvcmUgaW5wdXRcbiAgICogQHBhcmFtIHQgdGhlIGR1cmF0aW9uIHRvIGNoZWNrIGFnYWluc3RcbiAgICovXG4gIHB1YmxpYyBpc0JlZm9yZSh0OiBEdXJhdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGUgPCBuZXcgRGF0ZShEYXRlLm5vdygpICsgdC50b01pbGxpc2Vjb25kcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBFeGlwaXJhdGlvbiBleHBpcmVzIGFmdGVyIGlucHV0XG4gICAqIEBwYXJhbSB0IHRoZSBkdXJhdGlvbiB0byBjaGVjayBhZ2FpbnN0XG4gICAqL1xuICBwdWJsaWMgaXNBZnRlciggdDogRHVyYXRpb24gKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZSA+IG5ldyBEYXRlKERhdGUubm93KCkgKyB0LnRvTWlsbGlzZWNvbmRzKCkpO1xuICB9XG59XG4iXX0=