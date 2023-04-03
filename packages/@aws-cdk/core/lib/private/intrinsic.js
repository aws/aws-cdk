"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intrinsic = void 0;
const stack_trace_1 = require("../stack-trace");
const token_1 = require("../token");
const type_hints_1 = require("../type-hints");
/**
 * Token subclass that represents values intrinsic to the target document language
 *
 * WARNING: this class should not be externally exposed, but is currently visible
 * because of a limitation of jsii (https://github.com/aws/jsii/issues/524).
 *
 * This class will disappear in a future release and should not be used.
 *
 */
class Intrinsic {
    constructor(value, options = {}) {
        if (isFunction(value)) {
            throw new Error(`Argument to Intrinsic must be a plain value object, got ${value}`);
        }
        this.creationStack = options.stackTrace ?? true ? (0, stack_trace_1.captureStackTrace)() : [];
        this.value = value;
        this.typeHint = options.typeHint ?? type_hints_1.ResolutionTypeHint.STRING;
    }
    resolve(_context) {
        return this.value;
    }
    /**
     * Convert an instance of this Token to a string
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a string. We treat it the same as an explicit
     * stringification.
     */
    toString() {
        return token_1.Token.asString(this);
    }
    /**
     * Convert an instance of this Token to a string list
     *
     * This method will be called implicitly by language runtimes if the object
     * is embedded into a list. We treat it the same as an explicit
     * stringification.
     */
    toStringList() {
        return token_1.Token.asList(this);
    }
    /**
     * Turn this Token into JSON
     *
     * Called automatically when JSON.stringify() is called on a Token.
     */
    toJSON() {
        // We can't do the right work here because in case we contain a function, we
        // won't know the type of value that function represents (in the simplest
        // case, string or number), and we can't know that without an
        // IResolveContext to actually do the resolution, which we don't have.
        // We used to throw an error, but since JSON.stringify() is often used in
        // error messages to produce a readable representation of an object, if we
        // throw here we'll obfuscate that descriptive error with something worse.
        // So return a string representation that indicates this thing is a token
        // and needs resolving.
        return '<unresolved-token>';
    }
    /**
     * Creates a throwable Error object that contains the token creation stack trace.
     * @param message Error message
     */
    newError(message) {
        return new Error(`${message}\nToken created:\n    at ${this.creationStack.join('\n    at ')}\nError thrown:`);
    }
}
exports.Intrinsic = Intrinsic;
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cmluc2ljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50cmluc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGdEQUFtRDtBQUNuRCxvQ0FBaUM7QUFDakMsOENBQW1EO0FBdUJuRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsU0FBUztJQWFwQixZQUFZLEtBQVUsRUFBRSxVQUEwQixFQUFFO1FBQ2xELElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELEtBQUssRUFBRSxDQUFDLENBQUM7U0FDckY7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFBLCtCQUFpQixHQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksK0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBQ2hFLENBQUM7SUFFTSxPQUFPLENBQUMsUUFBeUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxRQUFRO1FBQ2IsT0FBTyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxZQUFZO1FBQ2pCLE9BQU8sYUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU07UUFDWCw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLDZEQUE2RDtRQUM3RCxzRUFBc0U7UUFFdEUseUVBQXlFO1FBQ3pFLDBFQUEwRTtRQUMxRSwwRUFBMEU7UUFDMUUseUVBQXlFO1FBQ3pFLHVCQUF1QjtRQUN2QixPQUFPLG9CQUFvQixDQUFDO0lBQzlCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxRQUFRLENBQUMsT0FBZTtRQUNoQyxPQUFPLElBQUksS0FBSyxDQUFDLEdBQUcsT0FBTyw0QkFBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDaEgsQ0FBQztDQUNGO0FBM0VELDhCQTJFQztBQUVELFNBQVMsVUFBVSxDQUFDLENBQU07SUFDeEIsT0FBTyxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUM7QUFDakMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IGNhcHR1cmVTdGFja1RyYWNlIH0gZnJvbSAnLi4vc3RhY2stdHJhY2UnO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5pbXBvcnQgeyBSZXNvbHV0aW9uVHlwZUhpbnQgfSBmcm9tICcuLi90eXBlLWhpbnRzJztcblxuLyoqXG4gKiBDdXN0b21pemF0aW9uIHByb3BlcnRpZXMgZm9yIGFuIEludHJpbnNpYyB0b2tlblxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnRyaW5zaWNQcm9wcyB7XG4gIC8qKlxuICAgKiBDYXB0dXJlIHRoZSBzdGFjayB0cmFjZSBvZiB3aGVyZSB0aGlzIHRva2VuIGlzIGNyZWF0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhY2tUcmFjZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqXG4gICAqIFR5cGUgdGhhdCB0aGlzIHRva2VuIGlzIGV4cGVjdGVkIHRvIGV2YWx1YXRlIHRvXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlc29sdXRpb25UeXBlSGludC5TVFJJTkdcbiAgICovXG4gIHJlYWRvbmx5IHR5cGVIaW50PzogUmVzb2x1dGlvblR5cGVIaW50O1xufVxuXG4vKipcbiAqIFRva2VuIHN1YmNsYXNzIHRoYXQgcmVwcmVzZW50cyB2YWx1ZXMgaW50cmluc2ljIHRvIHRoZSB0YXJnZXQgZG9jdW1lbnQgbGFuZ3VhZ2VcbiAqXG4gKiBXQVJOSU5HOiB0aGlzIGNsYXNzIHNob3VsZCBub3QgYmUgZXh0ZXJuYWxseSBleHBvc2VkLCBidXQgaXMgY3VycmVudGx5IHZpc2libGVcbiAqIGJlY2F1c2Ugb2YgYSBsaW1pdGF0aW9uIG9mIGpzaWkgKGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvNTI0KS5cbiAqXG4gKiBUaGlzIGNsYXNzIHdpbGwgZGlzYXBwZWFyIGluIGEgZnV0dXJlIHJlbGVhc2UgYW5kIHNob3VsZCBub3QgYmUgdXNlZC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRyaW5zaWMgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgY2FwdHVyZWQgc3RhY2sgdHJhY2Ugd2hpY2ggcmVwcmVzZW50cyB0aGUgbG9jYXRpb24gaW4gd2hpY2ggdGhpcyB0b2tlbiB3YXMgY3JlYXRlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVHlwZSB0aGF0IHRoZSBJbnRyaW5zaWMgaXMgZXhwZWN0ZWQgdG8gZXZhbHVhdGUgdG8uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZUhpbnQ/OiBSZXNvbHV0aW9uVHlwZUhpbnQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIG9wdGlvbnM6IEludHJpbnNpY1Byb3BzID0ge30pIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgdG8gSW50cmluc2ljIG11c3QgYmUgYSBwbGFpbiB2YWx1ZSBvYmplY3QsIGdvdCAke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IG9wdGlvbnMuc3RhY2tUcmFjZSA/PyB0cnVlID8gY2FwdHVyZVN0YWNrVHJhY2UoKSA6IFtdO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnR5cGVIaW50ID0gb3B0aW9ucy50eXBlSGludCA/PyBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoX2NvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gaW5zdGFuY2Ugb2YgdGhpcyBUb2tlbiB0byBhIHN0cmluZ1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBpbXBsaWNpdGx5IGJ5IGxhbmd1YWdlIHJ1bnRpbWVzIGlmIHRoZSBvYmplY3RcbiAgICogaXMgZW1iZWRkZWQgaW50byBhIHN0cmluZy4gV2UgdHJlYXQgaXQgdGhlIHNhbWUgYXMgYW4gZXhwbGljaXRcbiAgICogc3RyaW5naWZpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gaW5zdGFuY2Ugb2YgdGhpcyBUb2tlbiB0byBhIHN0cmluZyBsaXN0XG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGltcGxpY2l0bHkgYnkgbGFuZ3VhZ2UgcnVudGltZXMgaWYgdGhlIG9iamVjdFxuICAgKiBpcyBlbWJlZGRlZCBpbnRvIGEgbGlzdC4gV2UgdHJlYXQgaXQgdGhlIHNhbWUgYXMgYW4gZXhwbGljaXRcbiAgICogc3RyaW5naWZpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nTGlzdCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUdXJuIHRoaXMgVG9rZW4gaW50byBKU09OXG4gICAqXG4gICAqIENhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gSlNPTi5zdHJpbmdpZnkoKSBpcyBjYWxsZWQgb24gYSBUb2tlbi5cbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICAvLyBXZSBjYW4ndCBkbyB0aGUgcmlnaHQgd29yayBoZXJlIGJlY2F1c2UgaW4gY2FzZSB3ZSBjb250YWluIGEgZnVuY3Rpb24sIHdlXG4gICAgLy8gd29uJ3Qga25vdyB0aGUgdHlwZSBvZiB2YWx1ZSB0aGF0IGZ1bmN0aW9uIHJlcHJlc2VudHMgKGluIHRoZSBzaW1wbGVzdFxuICAgIC8vIGNhc2UsIHN0cmluZyBvciBudW1iZXIpLCBhbmQgd2UgY2FuJ3Qga25vdyB0aGF0IHdpdGhvdXQgYW5cbiAgICAvLyBJUmVzb2x2ZUNvbnRleHQgdG8gYWN0dWFsbHkgZG8gdGhlIHJlc29sdXRpb24sIHdoaWNoIHdlIGRvbid0IGhhdmUuXG5cbiAgICAvLyBXZSB1c2VkIHRvIHRocm93IGFuIGVycm9yLCBidXQgc2luY2UgSlNPTi5zdHJpbmdpZnkoKSBpcyBvZnRlbiB1c2VkIGluXG4gICAgLy8gZXJyb3IgbWVzc2FnZXMgdG8gcHJvZHVjZSBhIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIGFuIG9iamVjdCwgaWYgd2VcbiAgICAvLyB0aHJvdyBoZXJlIHdlJ2xsIG9iZnVzY2F0ZSB0aGF0IGRlc2NyaXB0aXZlIGVycm9yIHdpdGggc29tZXRoaW5nIHdvcnNlLlxuICAgIC8vIFNvIHJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB0aGF0IGluZGljYXRlcyB0aGlzIHRoaW5nIGlzIGEgdG9rZW5cbiAgICAvLyBhbmQgbmVlZHMgcmVzb2x2aW5nLlxuICAgIHJldHVybiAnPHVucmVzb2x2ZWQtdG9rZW4+JztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdGhyb3dhYmxlIEVycm9yIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSB0b2tlbiBjcmVhdGlvbiBzdGFjayB0cmFjZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgRXJyb3IgbWVzc2FnZVxuICAgKi9cbiAgcHJvdGVjdGVkIG5ld0Vycm9yKG1lc3NhZ2U6IHN0cmluZyk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgJHttZXNzYWdlfVxcblRva2VuIGNyZWF0ZWQ6XFxuICAgIGF0ICR7dGhpcy5jcmVhdGlvblN0YWNrLmpvaW4oJ1xcbiAgICBhdCAnKX1cXG5FcnJvciB0aHJvd246YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4OiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuIl19