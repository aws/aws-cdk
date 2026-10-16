import * as path from 'path';
import * as ts from 'typescript';

/**
 * Type-check a consumer `snippet` under `exactOptionalPropertyTypes` and return
 * the diagnostics anchored to the snippet itself.
 *
 * Shared harness for the per-package assignability guards tracked by
 * https://github.com/aws/aws-cdk/issues/37996. `aws-cdk-lib` does not build with
 * the flag, so a class member typed `T | undefined` that is not assignable to an
 * interface's optional `?: T` slips past the library's own compile and only
 * breaks downstream consumers who enable the flag. A normal `const x: IFoo = foo`
 * assertion can't catch this (the lib test build has the flag off); this compiles
 * the snippet with the flag explicitly on.
 *
 * `testDir` is the calling test's directory (`__dirname`). The snippet is compiled
 * as a virtual file in that directory, so its `import ... from '../lib'` resolves
 * to the package under test and the package's own tsconfig is picked up. The
 * snippet is checked against the in-repo source, which drags the wider source
 * graph and emits many unrelated diagnostics in source `.ts` files; those are
 * intentionally ignored — only diagnostics anchored to the snippet are returned.
 *
 * Other packages adopt this guard by passing their test directory (`__dirname`)
 * and a package-specific snippet; the harness needs no per-package changes.
 */
export function exactOptionalAssignabilityDiagnostics(testDir: string, snippet: string): string[] {
  const snippetPath = path.join(testDir, '__exact-optional-snippet__.ts');

  const tsconfigPath = ts.findConfigFile(testDir, ts.sys.fileExists.bind(ts.sys));
  if (!tsconfigPath) {
    throw new Error(`could not locate a tsconfig.json above ${testDir}`);
  }
  const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile.bind(ts.sys));
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(tsconfigPath));
  const options: ts.CompilerOptions = {
    ...parsed.options,
    exactOptionalPropertyTypes: true,
    skipLibCheck: true,
    noEmit: true,
    // The lib tsconfig is a `composite` project; without these the program rejects
    // the un-listed source files (TS6307) instead of type-checking the snippet.
    composite: false,
    incremental: false,
    declaration: false,
    declarationMap: false,
    tsBuildInfoFile: undefined,
  };

  const host = ts.createCompilerHost(options, true);
  const isSnippet = (fileName: string) => path.resolve(fileName) === path.resolve(snippetPath);

  const baseGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, langVersion, onError, shouldCreate) =>
    isSnippet(fileName)
      ? ts.createSourceFile(fileName, snippet, langVersion, true)
      : baseGetSourceFile(fileName, langVersion, onError, shouldCreate);

  const program = ts.createProgram([snippetPath], options, host);
  const snippetSource = program.getSourceFile(snippetPath);

  return ts.getPreEmitDiagnostics(program, snippetSource)
    .filter((d) => d.file && isSnippet(d.file.fileName))
    .map((d) => `TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
}
