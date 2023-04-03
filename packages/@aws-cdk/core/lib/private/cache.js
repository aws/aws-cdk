"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
/**
 * A simple cache class.
 *
 * Must be declared at the top of the file because we're going to use it statically in the
 * AssetStaging class.
 */
class Cache {
    constructor() {
        this.cache = new Map();
    }
    /**
     * Clears the cache
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Get a value from the cache or calculate it
     */
    obtain(cacheKey, calcFn) {
        let value = this.cache.get(cacheKey);
        if (value) {
            return value;
        }
        value = calcFn();
        this.cache.set(cacheKey, value);
        return value;
    }
}
exports.Cache = Cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7R0FLRztBQUNILE1BQWEsS0FBSztJQUFsQjtRQUNVLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBb0J2QyxDQUFDO0lBbEJDOztPQUVHO0lBQ0ksS0FBSztRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFnQixFQUFFLE1BQWU7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztTQUFFO1FBRTVCLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsT0FBTyxLQUFLLENBQUM7S0FDZDtDQUNGO0FBckJELHNCQXFCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQSBzaW1wbGUgY2FjaGUgY2xhc3MuXG4gKlxuICogTXVzdCBiZSBkZWNsYXJlZCBhdCB0aGUgdG9wIG9mIHRoZSBmaWxlIGJlY2F1c2Ugd2UncmUgZ29pbmcgdG8gdXNlIGl0IHN0YXRpY2FsbHkgaW4gdGhlXG4gKiBBc3NldFN0YWdpbmcgY2xhc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYWNoZTxBPiB7XG4gIHByaXZhdGUgY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgQT4oKTtcblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBjYWNoZVxuICAgKi9cbiAgcHVibGljIGNsZWFyKCkge1xuICAgIHRoaXMuY2FjaGUuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSBvciBjYWxjdWxhdGUgaXRcbiAgICovXG4gIHB1YmxpYyBvYnRhaW4oY2FjaGVLZXk6IHN0cmluZywgY2FsY0ZuOiAoKSA9PiBBKTogQSB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5jYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgIGlmICh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cblxuICAgIHZhbHVlID0gY2FsY0ZuKCk7XG4gICAgdGhpcy5jYWNoZS5zZXQoY2FjaGVLZXksIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuIl19