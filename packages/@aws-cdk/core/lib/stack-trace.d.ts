/**
 * Captures the current process' stack trace.
 *
 * Stack traces are often invaluable tools to help diagnose problems, however
 * their capture is a rather expensive operation, and the stack traces can be
 * large. Consequently, users are strongly advised to condition capturing stack
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
export declare function captureStackTrace(below?: Function, limit?: number): string[];
