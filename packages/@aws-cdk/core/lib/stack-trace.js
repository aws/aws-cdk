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
    if (!debug_1.debugModeEnabled()) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stdHJhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFjay10cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBMkM7QUFFM0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQWdCLGlCQUFpQixDQUMvQixRQUFrQixpQkFBaUIsRUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7SUFFL0IsSUFBSSxDQUFDLHdCQUFnQixFQUFFLEVBQUU7UUFDdkIsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDbEM7SUFFRCxNQUFNLE1BQU0sR0FBdUIsRUFBRSxDQUFDO0lBQ3RDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7SUFDNUMsSUFBSTtRQUNGLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzlCLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEM7WUFBUztRQUNSLEtBQUssQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQXBCRCw4Q0FvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWJ1Z01vZGVFbmFibGVkIH0gZnJvbSAnLi9kZWJ1Zyc7XG5cbi8qKlxuICogQ2FwdHVyZXMgdGhlIGN1cnJlbnQgcHJvY2Vzcycgc3RhY2sgdHJhY2UuXG4gKlxuICogU3RhY2sgdHJhY2VzIGFyZSBvZnRlbiBpbnZhbHVhYmxlIHRvb2xzIHRvIGhlbHAgZGlhZ25vc2UgcHJvYmxlbXMsIGhvd2V2ZXJcbiAqIHRoZWlyIGNhcHR1cmUgaXMgYSByYXRoZXIgZXhwZW5zaXZlIG9wZXJhdGlvbiwgYW5kIHRoZSBzdGFjayB0cmFjZXMgY2FuIGJlXG4gKiBsYXJnZS4gQ29uc2VxdWVudGx5LCB1c2VycyBhcmUgc3Ryb25seSBhZHZpc2VkIHRvIGNvbmRpdGlvbiBjYXB0dXJpbmcgc3RhY2tcbiAqIHRyYWNlcyB0byBzcGVjaWZpYyB1c2VyIG9wdC1pbi5cbiAqXG4gKiBTdGFjayB0cmFjZXMgd2lsbCBvbmx5IGJlIGNhcHR1cmVkIGlmIHRoZSBgQ0RLX0RFQlVHYCBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICogaXMgc2V0IHRvIGAndHJ1ZSdgIG9yIGAxYC5cbiAqXG4gKiBAcGFyYW0gYmVsb3cgYW4gb3B0aW9uYWwgZnVuY3Rpb24gc3RhcnRpbmcgZnJvbSB3aGljaCBzdGFjayBmcmFtZXMgd2lsbCBiZVxuICogICAgICAgICAgICAgIGlnbm9yZWQuIERlZmF1bHRzIHRvIHRoZSBgY2FwdHVyZVN0YWNrVHJhY2VgIGZ1bmN0aW9uIGl0c2VsZi5cbiAqIEBwYXJhbSBsaW1pdCBhbmQgb3B0aW9uYWwgdXBwZXIgYm91bmQgdG8gdGhlIG51bWJlciBvZiBzdGFjayBmcmFtZXMgdG8gYmVcbiAqICAgICAgICAgICAgICBjYXB0dXJlZC4gSWYgbm90IHByb3ZpZGVkLCB0aGlzIGRlZmF1bHRzIHRvXG4gKiAgICAgICAgICAgICAgYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYCwgZWZmZWN0aXZlbHkgbWVhbmluZyBcIm5vIGxpbWl0XCIuXG4gKlxuICogQHJldHVybnMgdGhlIGNhcHR1cmVkIHN0YWNrIHRyYWNlLCBhcyBhbiBhcnJheSBvZiBzdGFjayBmcmFtZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlU3RhY2tUcmFjZShcbiAgYmVsb3c6IEZ1bmN0aW9uID0gY2FwdHVyZVN0YWNrVHJhY2UsXG4gIGxpbWl0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4pOiBzdHJpbmdbXSB7XG4gIGlmICghZGVidWdNb2RlRW5hYmxlZCgpKSB7XG4gICAgcmV0dXJuIFsnc3RhY2sgdHJhY2VzIGRpc2FibGVkJ107XG4gIH1cblxuICBjb25zdCBvYmplY3Q6IHsgc3RhY2s/OiBzdHJpbmcgfSA9IHt9O1xuICBjb25zdCBwcmV2aW91c0xpbWl0ID0gRXJyb3Iuc3RhY2tUcmFjZUxpbWl0O1xuICB0cnkge1xuICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IGxpbWl0O1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKG9iamVjdCwgYmVsb3cpO1xuICB9IGZpbmFsbHkge1xuICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IHByZXZpb3VzTGltaXQ7XG4gIH1cbiAgaWYgKCFvYmplY3Quc3RhY2spIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5zdGFjay5zcGxpdCgnXFxuJykuc2xpY2UoMSkubWFwKHMgPT4gcy5yZXBsYWNlKC9eXFxzKmF0XFxzKy8sICcnKSk7XG59XG4iXX0=