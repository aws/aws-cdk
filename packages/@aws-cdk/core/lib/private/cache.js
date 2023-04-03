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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7R0FLRztBQUNILE1BQWEsS0FBSztJQUFsQjtRQUNVLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBb0J2QyxDQUFDO0lBbEJDOztPQUVHO0lBQ0ksS0FBSztRQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQWdCLEVBQUUsTUFBZTtRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLEtBQUssRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1NBQUU7UUFFNUIsS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRjtBQXJCRCxzQkFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgc2ltcGxlIGNhY2hlIGNsYXNzLlxuICpcbiAqIE11c3QgYmUgZGVjbGFyZWQgYXQgdGhlIHRvcCBvZiB0aGUgZmlsZSBiZWNhdXNlIHdlJ3JlIGdvaW5nIHRvIHVzZSBpdCBzdGF0aWNhbGx5IGluIHRoZVxuICogQXNzZXRTdGFnaW5nIGNsYXNzLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGU8QT4ge1xuICBwcml2YXRlIGNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIEE+KCk7XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgY2FjaGVcbiAgICovXG4gIHB1YmxpYyBjbGVhcigpIHtcbiAgICB0aGlzLmNhY2hlLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdmFsdWUgZnJvbSB0aGUgY2FjaGUgb3IgY2FsY3VsYXRlIGl0XG4gICAqL1xuICBwdWJsaWMgb2J0YWluKGNhY2hlS2V5OiBzdHJpbmcsIGNhbGNGbjogKCkgPT4gQSk6IEEge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuY2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9XG5cbiAgICB2YWx1ZSA9IGNhbGNGbigpO1xuICAgIHRoaXMuY2FjaGUuc2V0KGNhY2hlS2V5LCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbiJdfQ==