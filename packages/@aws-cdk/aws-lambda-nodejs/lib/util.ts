import * as fs from 'fs';
import * as path from 'path';

// From https://github.com/errwischt/stacktrace-parser/blob/master/src/stack-trace-parser.js
const STACK_RE = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

/**
 * A parsed stack trace line
 */
export interface StackTrace {
  readonly file: string;
  readonly methodName?: string;
  readonly lineNumber: number;
  readonly column: number;
}

/**
 * Parses the stack trace of an error
 */
export function parseStackTrace(error?: Error): StackTrace[] {
  const err = error || new Error();

  if (!err.stack) {
    return [];
  }

  const lines = err.stack.split('\n');

  const stackTrace: StackTrace[] = [];

  for (const line of lines) {
    const results = STACK_RE.exec(line);
    if (results) {
      stackTrace.push({
        file: results[2],
        methodName: results[1],
        lineNumber: parseInt(results[3], 10),
        column: parseInt(results[4], 10),
      });
    }
  }

  return stackTrace;
}

/**
 * Returns the major version of node installation
 */
export function nodeMajorVersion(): number {
  return parseInt(process.versions.node.split('.')[0], 10);
}

/**
 * Find a file by walking up parent directories
 */
export function findUp(name: string, directory: string = process.cwd()): string | undefined {
  const absoluteDirectory = path.resolve(directory);

  if (fs.existsSync(path.join(directory, name))) {
    return directory;
  }

  const { root } = path.parse(absoluteDirectory);
  if (absoluteDirectory === root) {
    return undefined;
  }

  return findUp(name, path.dirname(absoluteDirectory));
}
