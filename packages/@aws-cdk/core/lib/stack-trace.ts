/**
 * Captures the current process' stack trace.
 *
 * Stack traces are often invaluable tools to help diagnose problems, however
 * their capture is a rather expensive operation, and the stack traces can be
 * large. Consequently, users are stronly advised to condition capturing stack
 * traces to specific user opt-in.
 *
 * If the `CDK_DISABLE_STACK_TRACE` environment variable is set (to any value,
 * except for an empty string), no stack traces will be captured, and instead
 * the literal value `['stack traces disabled']` will be returned instead. This
 * is only true if the `CDK_DEBUG` environment variable is not set to `'true'`,
 * in which case stack traces are *always* captured.
 *
 * @param below an optional function starting from which stack frames will be
 *              ignored. Defaults to the `captureStackTrace` function itself.
 * @param limit and optional upper bound to the number of stack frames to be
 *              captured. If not provided, this defaults to
 *              `Number.MAX_SAFE_INTEGER`, effectively meaning "no limit".
 *
 * @returns the captured stack trace, as an array of stack frames.
 */
export function captureStackTrace(
  below: Function = captureStackTrace,
  limit = Number.MAX_SAFE_INTEGER,
): string[] {
  if (process.env.CDK_DISABLE_STACK_TRACE && process.env.CDK_DEBUG !== 'true') {
    return ['stack traces disabled'];
  }

  const object: { stack?: string } = {};
  const previousLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = limit;
    Error.captureStackTrace(object, below);
  } finally {
    Error.stackTraceLimit = previousLimit;
  }
  if (!object.stack) {
    return [];
  }
  return object.stack.split('\n').slice(1).map(s => s.replace(/^\s*at\s+/, ''));
}
