"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expiration = void 0;
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
    static after(t) { return Expiration.atDate(new Date(Date.now() + t.toMilliseconds())); }
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
     * Expiration Value in a formatted Unix Epoch Time in seconds
     */
    toEpoch() {
        return Math.round(this.date.getTime() / 1000);
    }
    /**
     * Check if Expiration expires before input
     * @param t the duration to check against
     */
    isBefore(t) {
        return this.date < new Date(Date.now() + t.toMilliseconds());
    }
    /**
     * Check if Expiration expires after input
     * @param t the duration to check against
     */
    isAfter(t) {
        return this.date > new Date(Date.now() + t.toMilliseconds());
    }
}
exports.Expiration = Expiration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwaXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cGlyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0E7Ozs7R0FJRztBQUNILE1BQWEsVUFBVTtJQUNyQjs7O09BR0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQU8sSUFBSSxPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQVMsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFL0U7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFXLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6Rzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFTLElBQUksT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQU8zRSxZQUFvQixJQUFVO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRDs7T0FFRztJQUNJLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0ksUUFBUSxDQUFDLENBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksT0FBTyxDQUFFLENBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0Y7QUF4REQsZ0NBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICcuL2R1cmF0aW9uJztcbi8qKlxuICogUmVwcmVzZW50cyBhIGRhdGUgb2YgZXhwaXJhdGlvbi5cbiAqXG4gKiBUaGUgYW1vdW50IGNhbiBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzIGEgRGF0ZSBvYmplY3QsIHRpbWVzdGFtcCwgRHVyYXRpb24gb3Igc3RyaW5nLlxuICovXG5leHBvcnQgY2xhc3MgRXhwaXJhdGlvbiB7XG4gIC8qKlxuICAgKiBFeHBpcmUgYXQgdGhlIHNwZWNpZmllZCBkYXRlXG4gICAqIEBwYXJhbSBkIGRhdGUgdG8gZXhwaXJlIGF0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGF0RGF0ZShkOiBEYXRlKSB7IHJldHVybiBuZXcgRXhwaXJhdGlvbihkKTsgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmUgYXQgdGhlIHNwZWNpZmllZCB0aW1lc3RhbXBcbiAgICogQHBhcmFtIHQgdGltZXN0YW1wIGluIHVuaXggbWlsbGlzZWNvbmRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGF0VGltZXN0YW1wKHQ6IG51bWJlcikgeyByZXR1cm4gRXhwaXJhdGlvbi5hdERhdGUobmV3IERhdGUodCkpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGlyZSBvbmNlIHRoZSBzcGVjaWZpZWQgZHVyYXRpb24gaGFzIHBhc3NlZCBzaW5jZSBkZXBsb3ltZW50IHRpbWVcbiAgICogQHBhcmFtIHQgdGhlIGR1cmF0aW9uIHRvIHdhaXQgYmVmb3JlIGV4cGlyaW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFmdGVyKHQ6IER1cmF0aW9uKSB7IHJldHVybiBFeHBpcmF0aW9uLmF0RGF0ZShuZXcgRGF0ZShEYXRlLm5vdygpICsgdC50b01pbGxpc2Vjb25kcygpKSk7IH1cblxuICAvKipcbiAgICogRXhwaXJlIGF0IHNwZWNpZmllZCBkYXRlLCByZXByZXNlbnRlZCBhcyBhIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0gcyB0aGUgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyBkYXRlIHRvIGV4cGlyZSBhdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nKHM6IHN0cmluZykgeyByZXR1cm4gbmV3IEV4cGlyYXRpb24obmV3IERhdGUocykpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGlyYXRpb24gdmFsdWUgYXMgYSBEYXRlIG9iamVjdFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRhdGU6IERhdGU7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihkYXRlOiBEYXRlKSB7XG4gICAgdGhpcy5kYXRlID0gZGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBpcmF0aW9uIFZhbHVlIGluIGEgZm9ybWF0dGVkIFVuaXggRXBvY2ggVGltZSBpbiBzZWNvbmRzXG4gICAqL1xuICBwdWJsaWMgdG9FcG9jaCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgRXhwaXJhdGlvbiBleHBpcmVzIGJlZm9yZSBpbnB1dFxuICAgKiBAcGFyYW0gdCB0aGUgZHVyYXRpb24gdG8gY2hlY2sgYWdhaW5zdFxuICAgKi9cbiAgcHVibGljIGlzQmVmb3JlKHQ6IER1cmF0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZSA8IG5ldyBEYXRlKERhdGUubm93KCkgKyB0LnRvTWlsbGlzZWNvbmRzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIEV4cGlyYXRpb24gZXhwaXJlcyBhZnRlciBpbnB1dFxuICAgKiBAcGFyYW0gdCB0aGUgZHVyYXRpb24gdG8gY2hlY2sgYWdhaW5zdFxuICAgKi9cbiAgcHVibGljIGlzQWZ0ZXIoIHQ6IER1cmF0aW9uICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGUgPiBuZXcgRGF0ZShEYXRlLm5vdygpICsgdC50b01pbGxpc2Vjb25kcygpKTtcbiAgfVxufVxuIl19