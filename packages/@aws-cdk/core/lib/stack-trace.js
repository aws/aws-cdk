"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureStackTrace = void 0;
const debug_1 = require("./debug");
/**
 * Captures the current process' stack trace.
 *
 * Stack traces are often invaluable tools to help diagnose problems, however
 * their capture is a rather expensive operation, and the stack traces can be
 * large. Consequently, users are stronly advised to condition capturing stack
 * traces to specific user opt-in.
 *
 * Stack traces will only be captured if the `CDK_DEBUG` environment variable
 * is set to `'true'` or `1`.
 *
 * @param below an optional function starting from which stack frames will be
 *              ignored. Defaults to the `captureStackTrace` function itself.
 * @param limit and optional upper bound to the number of stack frames to be
 *              captured. If not provided, this defaults to
 *              `Number.MAX_SAFE_INTEGER`, effectively meaning "no limit".
 *
 * @returns the captured stack trace, as an array of stack frames.
 */
function captureStackTrace(below = captureStackTrace, limit = Number.MAX_SAFE_INTEGER) {
    if (!(0, debug_1.debugModeEnabled)()) {
        return ['stack traces disabled'];
    }
    const object = {};
    const previousLimit = Error.stackTraceLimit;
    try {
        Error.stackTraceLimit = limit;
        Error.captureStackTrace(object, below);
    }
    finally {
        Error.stackTraceLimit = previousLimit;
    }
    if (!object.stack) {
        return [];
    }
    return object.stack.split('\n').slice(1).map(s => s.replace(/^\s*at\s+/, ''));
}
exports.captureStackTrace = captureStackTrace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stdHJhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFjay10cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBMkM7QUFFM0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQWdCLGlCQUFpQixDQUMvQixRQUFrQixpQkFBaUIsRUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7SUFFL0IsSUFBSSxDQUFDLElBQUEsd0JBQWdCLEdBQUUsRUFBRTtRQUN2QixPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNsQztJQUVELE1BQU0sTUFBTSxHQUF1QixFQUFFLENBQUM7SUFDdEMsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUM1QyxJQUFJO1FBQ0YsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDOUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QztZQUFTO1FBQ1IsS0FBSyxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7S0FDdkM7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNqQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBcEJELDhDQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlYnVnTW9kZUVuYWJsZWQgfSBmcm9tICcuL2RlYnVnJztcblxuLyoqXG4gKiBDYXB0dXJlcyB0aGUgY3VycmVudCBwcm9jZXNzJyBzdGFjayB0cmFjZS5cbiAqXG4gKiBTdGFjayB0cmFjZXMgYXJlIG9mdGVuIGludmFsdWFibGUgdG9vbHMgdG8gaGVscCBkaWFnbm9zZSBwcm9ibGVtcywgaG93ZXZlclxuICogdGhlaXIgY2FwdHVyZSBpcyBhIHJhdGhlciBleHBlbnNpdmUgb3BlcmF0aW9uLCBhbmQgdGhlIHN0YWNrIHRyYWNlcyBjYW4gYmVcbiAqIGxhcmdlLiBDb25zZXF1ZW50bHksIHVzZXJzIGFyZSBzdHJvbmx5IGFkdmlzZWQgdG8gY29uZGl0aW9uIGNhcHR1cmluZyBzdGFja1xuICogdHJhY2VzIHRvIHNwZWNpZmljIHVzZXIgb3B0LWluLlxuICpcbiAqIFN0YWNrIHRyYWNlcyB3aWxsIG9ubHkgYmUgY2FwdHVyZWQgaWYgdGhlIGBDREtfREVCVUdgIGVudmlyb25tZW50IHZhcmlhYmxlXG4gKiBpcyBzZXQgdG8gYCd0cnVlJ2Agb3IgYDFgLlxuICpcbiAqIEBwYXJhbSBiZWxvdyBhbiBvcHRpb25hbCBmdW5jdGlvbiBzdGFydGluZyBmcm9tIHdoaWNoIHN0YWNrIGZyYW1lcyB3aWxsIGJlXG4gKiAgICAgICAgICAgICAgaWdub3JlZC4gRGVmYXVsdHMgdG8gdGhlIGBjYXB0dXJlU3RhY2tUcmFjZWAgZnVuY3Rpb24gaXRzZWxmLlxuICogQHBhcmFtIGxpbWl0IGFuZCBvcHRpb25hbCB1cHBlciBib3VuZCB0byB0aGUgbnVtYmVyIG9mIHN0YWNrIGZyYW1lcyB0byBiZVxuICogICAgICAgICAgICAgIGNhcHR1cmVkLiBJZiBub3QgcHJvdmlkZWQsIHRoaXMgZGVmYXVsdHMgdG9cbiAqICAgICAgICAgICAgICBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLCBlZmZlY3RpdmVseSBtZWFuaW5nIFwibm8gbGltaXRcIi5cbiAqXG4gKiBAcmV0dXJucyB0aGUgY2FwdHVyZWQgc3RhY2sgdHJhY2UsIGFzIGFuIGFycmF5IG9mIHN0YWNrIGZyYW1lcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVTdGFja1RyYWNlKFxuICBiZWxvdzogRnVuY3Rpb24gPSBjYXB0dXJlU3RhY2tUcmFjZSxcbiAgbGltaXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbik6IHN0cmluZ1tdIHtcbiAgaWYgKCFkZWJ1Z01vZGVFbmFibGVkKCkpIHtcbiAgICByZXR1cm4gWydzdGFjayB0cmFjZXMgZGlzYWJsZWQnXTtcbiAgfVxuXG4gIGNvbnN0IG9iamVjdDogeyBzdGFjaz86IHN0cmluZyB9ID0ge307XG4gIGNvbnN0IHByZXZpb3VzTGltaXQgPSBFcnJvci5zdGFja1RyYWNlTGltaXQ7XG4gIHRyeSB7XG4gICAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gbGltaXQ7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2Uob2JqZWN0LCBiZWxvdyk7XG4gIH0gZmluYWxseSB7XG4gICAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gcHJldmlvdXNMaW1pdDtcbiAgfVxuICBpZiAoIW9iamVjdC5zdGFjaykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gb2JqZWN0LnN0YWNrLnNwbGl0KCdcXG4nKS5zbGljZSgxKS5tYXAocyA9PiBzLnJlcGxhY2UoL15cXHMqYXRcXHMrLywgJycpKTtcbn1cbiJdfQ==