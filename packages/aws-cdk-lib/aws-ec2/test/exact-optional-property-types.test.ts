import * as path from 'path';
import * as ts from 'typescript';

/**
 * Regression guard for https://github.com/aws/aws-cdk/issues/37996.
 *
 * Consumers who enable TypeScript's `exactOptionalPropertyTypes` can't pass a
 * concrete construct where its interface is expected, and type-checking
 * `aws-cdk-lib` fails for them outright — because a class member typed
 * `T | undefined` is not assignable to an interface's optional `?: T`. The
 * library doesn't build with the flag, so these breaks slip past its own compile
 * and only surface downstream.
 *
 * This test compiles a consumer snippet with the flag on and asserts that this
 * package's concrete classes stay assignable to their interfaces.
 */

// One type-only assignment per concrete class -> interface pair to lock in.
// `declare const` avoids constructor boilerplate; the assignment is the assertion.
const ASSIGNABILITY_SNIPPET = `
import { Vpc, IVpc } from '../lib';

declare const vpc: Vpc;
const _vpc: IVpc = vpc;
void _vpc;
`;

/**
 * Compile the snippet under \`exactOptionalPropertyTypes\` and return only the
 * diagnostics anchored to the snippet (lib-source noise is filtered out).
 */
function snippetDiagnosticsUnderExactOptional(snippet: string): string[] {
  // Virtual file placed in this directory so `import ... from '../lib'` resolves
  // to the aws-ec2 source barrel.
  const snippetPath = path.join(__dirname, '__exact-optional-snippet__.ts');

  // Reuse the package's own tsconfig (target/module/lib/skipLibCheck) so dragging
  // the source graph does not inject spurious errors, then force the flag on.
  const tsconfigPath = ts.findConfigFile(__dirname, ts.sys.fileExists);
  if (!tsconfigPath) {
    throw new Error(`could not locate a tsconfig.json above ${__dirname}`);
  }
  const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
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

describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  // Compiling the source graph through the compiler API is heavier than a normal
  // unit test; give it room under the suite's 60s ceiling.
  test('aws-ec2 concrete classes are assignable to their interfaces under the flag', () => {
    expect(snippetDiagnosticsUnderExactOptional(ASSIGNABILITY_SNIPPET)).toEqual([]);
  }, 30_000);
});
