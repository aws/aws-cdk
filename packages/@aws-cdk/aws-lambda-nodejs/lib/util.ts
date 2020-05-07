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
 * Finds the closest path containg a path
 */
function findClosestPathContaining(p: string): string | undefined {
  for (const nodeModulesPath of module.paths) {
    if (fs.existsSync(path.join(path.dirname(nodeModulesPath), p))) {
      return path.dirname(nodeModulesPath);
    }
  }

  return undefined;
}

/**
 * Finds closest package.json path
 */
export function findPkgPath(): string | undefined {
  return findClosestPathContaining('package.json');
}

/**
 * Finds closest .git/
 */
export function findGitPath(): string | undefined {
  return findClosestPathContaining(`.git${path.sep}`);
}
