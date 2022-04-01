/* eslint-disable no-console */
/**
 * Verify that the two styles of imports we support:
 *
 *    import { aws_ec2 } from 'aws-cdk-lib';
 *    import * as aws_ec2 from 'aws-cdk-lib/aws-ec2';
 *
 * Resolve to the same source file when analyzed using the TypeScript compiler.
 *
 * This is necessary for Rosetta's analysis and translation of examples: we need
 * to know what submodule we're importing here, and we need to be able to deal
 * with both styles since both are used interchangeably.
 */
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as ts from 'typescript';

async function main() {
  // First make a tempdir and symlink `aws-cdk-lib` into it so we can refer to it
  // as if it was an installed module.
  await withTemporaryDirectory(async (tmpDir) => {
    await fs.mkdirp(path.join(tmpDir, 'node_modules'));
    await fs.symlink(path.resolve(__dirname, '..'), path.join(tmpDir, 'node_modules', 'aws-cdk-lib'));

    const import1 = 'import { aws_ec2 } from "aws-cdk-lib";';
    const import2 = 'import * as aws_ec2 from "aws-cdk-lib/aws-ec2";';

    const src1 = await compileAndResolve(path.join(tmpDir, 'program1.ts'), import1, 'aws_ec2');
    const src2 = await compileAndResolve(path.join(tmpDir, 'program2.ts'), import2, 'aws_ec2');

    if (src1 !== src2) {
      console.error('Import mismatch!');
      console.error('\n    ', import1, '\n');
      console.error('resolves to', src1);
      console.error('\n    ', import2, '\n');
      console.error('resolves to', src2);
      process.exitCode = 1;
    }
  });
}

async function compileAndResolve(fileName: string, contents: string, symbolName: string) {
  await fs.writeFile(fileName, contents + `\n\nconsole.log(${symbolName});`, { encoding: 'utf-8' });
  const program = ts.createProgram({ rootNames: [fileName], options: STANDARD_COMPILER_OPTIONS });

  const sourceFile = program.getSourceFile(fileName);
  if (!sourceFile) {
    throw new Error(`Could not find sourcefile back: ${fileName}`);
  }

  const diags = [
    ...program.getGlobalDiagnostics(),
    ...program.getDeclarationDiagnostics(sourceFile),
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ];
  if (diags.length > 0) {
    console.error(ts.formatDiagnostics(diags, {
      getNewLine: () => '\n',
      getCurrentDirectory: () => path.dirname(fileName),
      getCanonicalFileName: (f) => path.resolve(f),
    }));
    throw new Error('Compilation failed');
  }

  // Find the 'console.log()' back and resolve the symbol inside
  const logStmt = assertNode(sourceFile.statements[1], ts.isExpressionStatement);
  const logCall = assertNode(logStmt.expression, ts.isCallExpression);
  const ident = assertNode(logCall.arguments[0], ts.isIdentifier);

  let sym = program.getTypeChecker().getSymbolAtLocation(ident);

  // Resolve alias if applicable
  // eslint-disable-next-line no-bitwise
  while (sym && ((sym.flags & ts.SymbolFlags.Alias) !== 0)) {
    sym = program.getTypeChecker().getAliasedSymbol(sym);
  }

  if (!sym) {
    throw new Error(`Could not resolve: ${symbolName} in '${contents}'`);
  }

  // Return the filename
  const srcFile = sym.declarations?.[0].getSourceFile().fileName.replace(/[.](ts|js|d\.ts)$/, '');
  if (!srcFile) {
    console.log(sym);
    throw new Error(`Symbol ${symbolName} in '${contents}' does not resolve to a source location`);
  }
  return srcFile;
}

export async function withTemporaryDirectory<T>(callback: (dir: string) => Promise<T>): Promise<T> {
  const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), path.basename(__filename)));
  try {
    return await callback(tmpdir);
  } finally {
    await fs.remove(tmpdir);
  }
}

function assertNode<A extends ts.Node>(x: ts.Node, assert: (x: ts.Node) => x is A): A {
  if (!assert(x)) {
    throw new Error(`Not the right type of node, expecting ${assert.name}, got ${ts.SyntaxKind[x.kind]}`);
  }
  return x;
}

export const STANDARD_COMPILER_OPTIONS: ts.CompilerOptions = {
  alwaysStrict: true,
  charset: 'utf8',
  declaration: true,
  experimentalDecorators: true,
  inlineSourceMap: true,
  inlineSources: true,
  lib: ['lib.es2016.d.ts', 'lib.es2017.object.d.ts', 'lib.es2017.string.d.ts'],
  module: ts.ModuleKind.CommonJS,
  noEmitOnError: true,
  noFallthroughCasesInSwitch: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  noUnusedLocals: false, // Important, becomes super annoying without this
  noUnusedParameters: false, // Important, becomes super annoying without this
  resolveJsonModule: true,
  strict: true,
  strictNullChecks: true,
  strictPropertyInitialization: true,
  stripInternal: true,
  target: ts.ScriptTarget.ES2019,
  // Incremental builds
  incremental: true,
  tsBuildInfoFile: '.tsbuildinfo',
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
