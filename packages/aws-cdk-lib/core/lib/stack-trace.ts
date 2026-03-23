import type { Node } from 'constructs';
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
 * Modern Nodes have a `util.getCallSites()` API but:
 *
 * - it's heavily unstable; and
 * - source map support works by hijacking `Error.prepareStackTrace`.
 *
 * It's easier for us to render a regular stacktrace as a string, have source map support
 * do the right thing, and then pick it apart, than to try and reconstruct it.
 */
export function captureCallStack(upTo: Function | undefined): CallSite[] {
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

/**
 * Parse the `error.stack` string into constituent components
 *
 * The string looks like this:
 *
 * ```
 * Error: Some Error message
 * Potentially spread over multiple lines
 *     at <function> (<file>:<line>:<col>)
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
export function parseErrorStack(stack: string): CallSite[] {
  const lines = stack.split('\n');

  const framePrefix = '    at ';

  return lines
    .filter(line => line.startsWith(framePrefix))
    .map(line => {
      line = line.slice(framePrefix.length);

      let fileName;
      let functionName;
      let sourceLocation;

      // line = <function> (<source>) | <source>
      const paren = line.indexOf('(');
      if (paren) {
        functionName = line.slice(0, paren - 1);
        line = line.slice(paren + 1, -1);
      } else {
        functionName = '<entry>';
      }

      // Make this easier to read
      if (functionName === 'Object.<anonymous>') {
        functionName = '<anonymous>';
      }
      let asI = functionName.indexOf(' [as ');
      if (asI > -1) {
        functionName = functionName.slice(0, asI);
      }

      // line = <file>:<line>:<col>, but file can contain : as well.
      // Grab at most 2 groups of only digits from the end of the string for source location
      const m = line.match(/(:[0-9]+){0,2}$/);

      fileName = m ? line.slice(0, -m[0].length) : line;
      sourceLocation = m ? m[0].slice(1) : '';

      return {
        fileName,
        functionName,
        sourceLocation,
      };
    });
}

/**
 * Renders an array of CallSites nicely, focusing on the user application code
 *
 * We detect "Not My Code" using the following heuristics:
 *
 * - If there is '/node_modules/' in the file path, we assume the call stack is a library and we skip it.
 * - If there is 'node:' in the file path, we assume it is NodeJS internals and we skip it.
 */
export function renderCallStackJustMyCode(stack: CallSite[], indent = true): string[] {
  const moduleRe = /(\/|\\)node_modules(\/|\\)([^/\\]+)/;

  const lines = [];
  let skipped = new Array<{ functionName?: string; fileName: string }>();

  let i = 0;
  while (i < stack.length) {
    const frame = stack[i++];

    const pat = frame.fileName.match(moduleRe);
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
    } else {
      reportSkipped(true);
      const prefix = indent ? '    at ' : '';
      lines.push(`${prefix}${frame.functionName} (${frame.fileName}:${frame.sourceLocation})`);
    }
  }
  reportSkipped(false);
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

interface CallSite {
  functionName: string;
  fileName: string;
  sourceLocation: string;
}

/**
 * Records a metadata entry on a construct node to trace a property assignment.
 *
 * When debug mode is enabled (via the `CDK_DEBUG` environment variable),
 * this attaches `aws:cdk:propertyAssignment` metadata to the given node,
 * including a stack trace pointing back to the caller. This is useful for
 * diagnosing where a particular property value was set during synthesis.
 *
 * This is a no-op when debug mode is not enabled.
 *
 * @param node the construct node to attach the metadata to.
 * @param propertyName the name of the property being assigned.
 */
export function traceProperty(node: Node, propertyName: string) {
  if (debugModeEnabled()) {
    node.addMetadata('aws:cdk:propertyAssignment', {
      propertyName,
      stackTrace: captureStackTrace(traceProperty),
    });
  }
}
