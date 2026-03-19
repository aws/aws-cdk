import { debugModeEnabled } from './debug';

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
export function captureStackTrace(
  below: Function = captureStackTrace,
  limit = Number.MAX_SAFE_INTEGER,
): string[] {
  if (!debugModeEnabled()) {
    return ['stack traces disabled'];
  }

  const previousLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = limit;
    return renderCallStackJustMyCode(captureCallStack(below), false);
  } finally {
    Error.stackTraceLimit = previousLimit;
  }
}

/**
 * Capture a call stack using `Error.captureStackTrace`
 *
 * Modern Nodes have a `util.getCallSites()` API but it's heavily unstable and
 * doesn't have all the information of the legacy API yet.
 */
export function captureCallStack(upTo: Function | undefined): NodeJS.CallSite[] {
  Error.prepareStackTrace = (_, trace) => trace;
  try {
    const obj: { stack: NodeJS.CallSite[] } = {} as any;
    Error.captureStackTrace(obj, upTo);
    if (obj.stack.length === 0) {
      // Protect against a common mistake: if upTo is not in the call stack, `captureStackTrace` will return an empty array.
      // If that happens, do it again without an `upTo` function.
      Error.captureStackTrace(obj);
    }
    return obj.stack;
  } finally {
    Error.prepareStackTrace = undefined as any;
  }
}

/**
 * Renders an array of CallSites nicely, focusing on the user application code
 *
 * We detect "Not My Code" using the following heuristics:
 *
 * - If there is '/node_modules/' in the file path, we assume the call stack is a library and we skip it.
 * - If there is 'node:' in the file path, we assume it is NodeJS internals and we skip it.
 */
export function renderCallStackJustMyCode(stack: NodeJS.CallSite[], indent = true): string[] {
  const moduleRe = /(\/|\\)node_modules(\/|\\)([^/\\]+)/;

  const lines = [];
  let skipped = new Array<string>();

  let i = 0;
  while (i < stack.length) {
    const frame = stack[i++];

    // FIXME: Show the last function we called into when going into library code

    const pat = fileName(frame).match(moduleRe);
    if (pat) {
      while (i < stack.length && fileName(stack[i]).includes(pat[0])) {
        i++;
      }
      // The last stack frame has the function that user code call into.
      skip(`${renderFunctionCall(frame)} in ${pat[3]}`);
    } else if (fileName(frame).includes('node:')) {
      skip('node internals');
      while (i < stack.length && fileName(stack[i]).includes('node:')) {
        i++;
      }
    } else {
      reportSkipped();
      const prefix = indent ? '    at ' : '';
      lines.push(`${prefix}${renderFunctionCall(frame)} (${fileName(frame)}:${frame.getLineNumber()})`);
    }
  }
  reportSkipped();
  return lines;

  function renderFunctionCall(frame: NodeJS.CallSite): string {
    return `${frame.isConstructor() ? 'new ' : ''}${frame.getFunctionName() || '<anonymous>'}`;
  }

  function fileName(frame: NodeJS.CallSite): string {
    return frame.getScriptNameOrSourceURL() ?? '?';
  }

  function skip(what: string) {
    if (!skipped.includes(what)) {
      skipped.push(what);
    }
  }

  function reportSkipped() {
    if (skipped.length > 0) {
      const prefix = indent ? '    ' : '';
      lines.push(`${prefix}...${skipped.join(', ')}...`);
    }
    skipped = [];
  }
}
