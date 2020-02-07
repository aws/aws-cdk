import * as fs from 'fs';

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
 * Finds closest package.json path
 */
export function findPkgPath(): string | undefined {
  let pkgPath;

  for (const path of module.paths) {
    pkgPath = path.replace(/node_modules$/, 'package.json');
    if (fs.existsSync(pkgPath)) {
      break;
    }
  }

  return pkgPath;
}

/**
 * Updates the package.json and returns the original
 */
export function updatePkg(pkgPath: string, data: any): Buffer {
  const original = fs.readFileSync(pkgPath);

  const pkgJson = JSON.parse(original.toString());

  const updated = {
    ...pkgJson,
    ...data,
  };

  fs.writeFileSync(pkgPath, JSON.stringify(updated, null, 2));

  return original;
}
