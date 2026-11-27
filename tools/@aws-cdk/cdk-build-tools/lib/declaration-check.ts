import * as path from 'path';
import * as ts from 'typescript';

/**
 * The strictest settings a consumer is likely to compile against.
 *
 * `skipLibCheck: false` makes TypeScript check our `.d.ts` files as well as the
 * consumer's own code, which is how users run into errors in them.
 */
const CONSUMER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: false,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  types: ['node'],
};

/**
 * The declaration files for the entry points a package publishes.
 *
 * The entry points are every target in the `exports` map, at any depth, because
 * conditional exports nest their targets in objects. A package without an
 * `exports` map uses its `types` or `main` entry. Each `.js` target maps to the
 * `.d.ts` next to it, and targets that are neither (`.jsii`, `.json`) are skipped.
 *
 * @returns paths relative to the package directory, without duplicates
 */
export function declarationEntryPoints(pkg: { exports?: unknown; types?: string; main?: string }): string[] {
  const targets = pkg.exports !== undefined ? leaves(pkg.exports) : [pkg.types ?? pkg.main];
  const declarations = targets
    .filter((t): t is string => typeof t === 'string' && /\.(js|d\.ts)$/.test(t))
    .map((t) => t.replace(/\.js$/, '.d.ts'));
  return [...new Set(declarations)];
}

/**
 * Type-check a package's emitted declarations the way a strict consumer would.
 *
 * Only diagnostics in the package's own declarations are returned. Its
 * dependencies are checked by their own builds.
 *
 * @param packageDir the package directory
 * @param entryPoints the declaration files consumers can import, relative to `packageDir`
 */
export function checkDeclarations(packageDir: string, entryPoints: string[]): readonly ts.Diagnostic[] {
  const program = declarationProgram(entryPoints.map((f) => path.resolve(packageDir, f)), CONSUMER_OPTIONS);
  const ownFiles = program.getSourceFiles().filter((f) => isInPackage(f.fileName, packageDir));
  return [
    ...program.getOptionsDiagnostics(),
    ...ownFiles.flatMap((f) => [...program.getSyntacticDiagnostics(f), ...program.getSemanticDiagnostics(f)]),
  ];
}

/**
 * Type-check consumer code against a package's emitted declarations.
 *
 * The code is compiled as if it were a file in the package root, so it can
 * import the package by its own name.
 *
 * @param packageDir the package directory
 * @param code the consumer's source code
 * @param options compiler options to apply over the strict consumer settings
 */
export function checkConsumer(packageDir: string, code: string, options: ts.CompilerOptions = {}): readonly ts.Diagnostic[] {
  const consumer = { fileName: path.resolve(packageDir, '__consumer__.ts'), code };
  const program = declarationProgram([consumer.fileName], { ...CONSUMER_OPTIONS, ...options }, consumer);
  return ts.getPreEmitDiagnostics(program);
}

/**
 * Render diagnostics as `file(line,col): error TSxxxx: message` lines.
 */
export function formatDiagnostics(diagnostics: readonly ts.Diagnostic[], cwd: string): string {
  return ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => cwd,
    getNewLine: () => '\n',
  });
}

/**
 * A program over the declarations reachable from `rootFiles`.
 *
 * jsii writes each `.d.ts` next to its `.ts` source, and TypeScript prefers the
 * source when it resolves an import. The host hides every non-declaration `.ts`
 * file, so that only the published declarations are checked. An in-memory
 * `consumer` file is served as-is.
 */
function declarationProgram(rootFiles: string[], options: ts.CompilerOptions, consumer?: { fileName: string; code: string }): ts.Program {
  const host = ts.createCompilerHost(options);
  const fileExists = host.fileExists.bind(host);
  const getSourceFile = host.getSourceFile.bind(host);
  host.fileExists = (f) => f === consumer?.fileName || (!isSource(f) && fileExists(f));
  host.getSourceFile = (f, languageVersion, ...rest) => f === consumer?.fileName
    ? ts.createSourceFile(f, consumer.code, languageVersion)
    : getSourceFile(f, languageVersion, ...rest);
  return ts.createProgram(rootFiles, options, host);
}

function leaves(value: unknown): unknown[] {
  return typeof value === 'object' && value !== null ? Object.values(value).flatMap(leaves) : [value];
}

function isSource(fileName: string): boolean {
  return /\.[cm]?tsx?$/.test(fileName) && !/\.d\.[cm]?ts$/.test(fileName);
}

function isInPackage(fileName: string, packageDir: string): boolean {
  const relative = path.relative(path.resolve(packageDir), path.resolve(fileName));
  return !relative.startsWith('..') && !relative.split(path.sep).includes('node_modules');
}
