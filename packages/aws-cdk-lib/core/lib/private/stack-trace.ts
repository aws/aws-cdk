import { StackFrame } from '@aws-cdk/cloud-assembly-api';

/**
 * Captures the current process' stack trace.
 *
 * Stack traces are often invaluable tools to help diagnose problems, however
 * their capture is a rather expensive operation, and the stack traces can be
 * large. Consequently, callers of this code should give the user an ability
 * to opt out of call stack capturing.
 *
 * Most commonly, use the `debugModeEnabled()` function to turn them on or off.
 *
 * @param below an optional function starting from which stack frames will be
 *              ignored. Defaults to the `captureStackTrace` function itself.
 * @param limit and optional upper bound to the number of stack frames to be
 *              captured. If not provided, uses the default stack trace limit
 *              configured using `--stack-trace-limit`.
 *
 * @returns the captured stack trace, as an array of stack frames.
 */
export function captureStackTrace(
  below: Function = captureStackTrace,
  limit = undefined,
): string[] {
  if (!limit) {
    // Fast path without try/finally
    return enhancedStackTrace(below, false);
  }

  const previousLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = limit;
    return enhancedStackTrace(below, false);
  } finally {
    Error.stackTraceLimit = previousLimit;
  }
}

/**
 * Builds a user-focused stack trace by combining internal JS call frames with
 * any host-language frames provided by the jsii runtime.
 *
 * This helper captures the current call stack up to `upTo`, removes or groups
 * non-user frames (such as `node_modules`, Node internals, and jsii runtime
 * internals), optionally prefixes lines with standard stack-trace indentation,
 * and appends external host frames when available.
 *
 * @param upTo the function at which stack capture should stop (exclusive). Pass
 * `undefined` to use the default capture behavior.
 * @param indent whether to prefix rendered lines with stack-style indentation
 * (`"    at "` for user frames). Defaults to `true`.
 * @returns a rendered stack trace as an array of human-readable lines.
 */
export function enhancedStackTrace(upTo: Function | undefined, indent = true): string[] {
  return withExternalTrace(renderCallStackJustMyCode(captureCallStack(upTo), indent));
}

function withExternalTrace(internal: string[]) {
  const hostTrace: [string, number, number, string][] | undefined =
    (global as any)[Symbol.for('jsii.context.hostStackTrace')];

  if (hostTrace != null) {
    // The first frame represents the last call on the non-Javascript side,
    // to the jsii runtime. This is not interesting to the user, so we drop it
    return internal.concat(hostTrace.slice(1).map(formatExternalFrame));
  }
  return internal;
}

/**
 * Capture a call stack using `Error.captureStackTrace`
 *
 * Modern Nodes have a `util.getCallSites()` API but:
 *
 * - it's heavily unstable; and
 * - source map support works by hijacking `Error.prepareStackTrace`.
 *
 * It's easier for us to render a regular stacktrace as a string, have source map support
 * do the right thing, and then pick it apart, than to try and reconstruct it.
 */
export function captureCallStack(upTo: Function | undefined): StackFrame[] {
  const obj: { stack: string } = {} as any;
  Error.captureStackTrace(obj, upTo);
  let trace = parseErrorStack(obj.stack);
  if (trace.length === 0) {
    // Protect against a common mistake: if upTo is not in the call stack, `captureStackTrace` will return an empty array.
    // If that happens, do it again without an `upTo` function.
    Error.captureStackTrace(obj);
    trace = parseErrorStack(obj.stack);
  }
  return trace;
}

function formatExternalFrame(trace: [string, number, number, string]): string {
  const [filename, line, column, name] = trace;
  return `${name} (${filename}:${line}${column > 0 ? ':' + column : ''})`;
}

/**
 * Parse the `error.stack` string into constituent components
 *
 * The string looks like this:
 *
 * ```
 * Error: Some Error message
 * Potentially spread over multiple lines
 *     at <function> (<file>:<line>:<col>)
 *     at <class>.<function> (<file>:<line>:<col>)
 *     at Object.<anonymous> (<file>:<line>:<col>)
 *     at <function> [as somethingElse] (<file>:<line>:<col>)
 *     at new <constructor> (<file>:<line>:<col>)
 *     at <file>:<line>:<col>
 * ```
 *
 * `<file>` can be `node:internal/modules/whatever`.
 */
export function parseErrorStack(stack: string): StackFrame[] {
  const lines = stack.split('\n');

  const framePrefix = '    at ';

  return lines
    .filter(line => line.startsWith(framePrefix))
    .map(line => StackFrame.parse(line.slice(framePrefix.length)));
}

// Look for `/node_modules/` followed by either
// - An @ sign, and 2 path segments
// - No @ sign, and 1 path segment
const MODULE_RE = /(\/|\\)node_modules(\/|\\)(@[^/\\]+[/\\][^/\\]+|[^@][^/\\]*)/;

const DECORATOR_RE = /(\/|\\)(prop-injectable|no-box-stack-traces)\./;

/**
 * Renders an array of CallSites nicely, focusing on the user application code
 *
 * We detect "Not My Code" using the following heuristics:
 *
 * - If there is '/node_modules/' in the file path, we assume the call stack is a library and we skip it.
 * - If there is 'node:' in the file path, we assume it is NodeJS internals and we skip it.
 * - We skip (and hide) 'prop-injectable' or 'no-box-stack-traces' in the trace, because those are
 *   constructor decorators that hide what's interesting (and look weird).
 *
 * If `indent` is enabled, we will prefix stack frames of actual files with "  at ", just like
 * Node does for its stack frames.
 */
export function renderCallStackJustMyCode(stack: StackFrame[], indent = true): string[] {
  const lines = [];
  let skipped = new Array<{ functionName?: string; fileName: string }>();

  let sawMyCode = false;
  let i = 0;
  while (i < stack.length) {
    const frame = stack[i++];

    if (frame.fileName.match(DECORATOR_RE)) {
      continue;
    }

    const pat = frame.fileName.match(MODULE_RE);
    if (pat) {
      while (i < stack.length && stack[i].fileName.includes(pat[0])) {
        i++;
      }
      // The last stack frame has the function that user code call into.
      skip({ functionName: stack[i - 1].functionName, fileName: pat[3] });
    } else if (frame.fileName.includes('node:')) {
      skip({ fileName: 'node internals' });
      while (i < stack.length && stack[i].fileName.includes('node:')) {
        i++;
      }
    } else if (isHostInternalFrame(frame)) {
      skip({ fileName: 'jsii runtime' });
      while (i < stack.length && isHostInternalFrame(stack[i])) {
        i++;
      }
    } else {
      reportSkipped(true);
      const prefix = indent ? '    at ' : '';
      lines.push(`${prefix}${frame.functionName} (${frame.fileName}:${frame.sourceLocation})`);
      sawMyCode = true;
    }
  }
  reportSkipped(false);

  if (!sawMyCode) {
    lines.push(`${indent ? '    ' : ''}(no user code in ${Error.stackTraceLimit} frames, use --stack-trace-limit to capture more)`);
  }

  return lines;

  function skip(what: typeof skipped[number]) {
    if (!skipped.find(x => x.fileName === what.fileName && x.functionName === what.functionName)) {
      skipped.push(what);
    }
  }

  function reportSkipped(includeFunction: boolean) {
    if (skipped.length > 0) {
      const rendered = skipped.map((s, j) =>
        // Only render the function name of the last frame before user code
        j === skipped.length - 1 && s.functionName && includeFunction ?
          `${s.functionName} in ${s.fileName}` : s.fileName);

      const prefix = indent ? '    ' : '';
      lines.push(`${prefix}...${rendered.join(', ')}...`);
    }
    skipped = [];
  }
}

/**
 * Whether the call site comes from the internals of the host that sent us the stack trace
 */
function isHostInternalFrame(frame: StackFrame): boolean {
  const hostDirName = (global as any)[Symbol.for('jsii.context.hostDirName')];
  return frame.fileName.includes(hostDirName);
}

