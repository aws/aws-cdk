import * as ts from 'typescript';

export interface RewriteImportsOptions {
  fileName?: string;
  monoPackageName?: string;
  monoAssertPackageName?: string;
}
export const DEFAULT_NAME = 'monocdk-experiment';
export const DEFAULT_ASSERT_NAME = '@monocdk-experiment/assert';

/**
 * Re-writes "hyper-modular" CDK imports (most packages in `@aws-cdk/*`) to the
 * relevant "mono" CDK import path. The re-writing will only modify the imported
 * library path, preserving the existing quote style, etc...
 *
 * Syntax errors in the source file being processed may cause some import
 * statements to not be re-written.
 *
 * Supported import statement forms are:
 * - `import * as lib from '@aws-cdk/lib';`
 * - `import { Type } from '@aws-cdk/lib';`
 * - `import '@aws-cdk/lib';`
 * - `import lib = require('@aws-cdk/lib');`
 * - `import { Type } = require('@aws-cdk/lib');
 * - `require('@aws-cdk/lib');
 *
 * @param sourceText the source code where imports should be re-written.
 * @param options the options to configure this attribute
 * - fileName: a customized file name to provide the TypeScript processor. default: 'index.ts'
 * - monoPackageName: the name of the monolithic package. default: 'monocdk-experiment'
 * - monoAssertPackageName: The name of the assert library corresponding to the monolithic package used. default: '@monocdk-experiment/assert'
 * @returns the updated source code.
 */
export function rewriteImports(sourceText: string, options?: RewriteImportsOptions): string {
  const sourceFile = ts.createSourceFile(options?.fileName ?? 'index.ts', sourceText, ts.ScriptTarget.ES2018);
  const replacements = new Array<{ original: ts.Node, updatedLocation: string }>();
  const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
    const moduleSpecifier = getModuleSpecifier(node);
    const newTarget = moduleSpecifier && updatedLocationOf(moduleSpecifier.text,
      options?.monoPackageName ?? DEFAULT_NAME, options?.monoAssertPackageName ?? DEFAULT_ASSERT_NAME);

    if (moduleSpecifier != null && newTarget != null) {
      replacements.push({ original: moduleSpecifier, updatedLocation: newTarget });
    }

    return node;
  };

  sourceFile.statements.forEach(node => ts.visitNode(node, visitor));

  let updatedSourceText = sourceText;
  // Applying replacements in reverse order, so node positions remain valid.
  for (const replacement of replacements.sort(({ original: l }, { original: r }) => r.getStart(sourceFile) - l.getStart(sourceFile))) {
    const prefix = updatedSourceText.substring(0, replacement.original.getStart(sourceFile) + 1);
    const suffix = updatedSourceText.substring(replacement.original.getEnd() - 1);

    updatedSourceText = prefix + replacement.updatedLocation + suffix;
  }

  return updatedSourceText;

  function getModuleSpecifier(node: ts.Node): ts.StringLiteral | undefined {
    if (ts.isImportDeclaration(node)) {
      // import style
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        // import from 'location';
        // import * as name from 'location';
        return moduleSpecifier;
      } else if (ts.isBinaryExpression(moduleSpecifier) && ts.isCallExpression(moduleSpecifier.right)) {
        // import { Type } = require('location');
        return getModuleSpecifier(moduleSpecifier.right);
      }
    } else if (
      ts.isImportEqualsDeclaration(node)
      && ts.isExternalModuleReference(node.moduleReference)
      && ts.isStringLiteral(node.moduleReference.expression)
    ) {
      // import name = require('location');
      return node.moduleReference.expression;
    } else if (
      (ts.isCallExpression(node))
      && ts.isIdentifier(node.expression)
      && node.expression.escapedText === 'require'
      && node.arguments.length === 1
    ) {
      // require('location');
      const argument = node.arguments[0];
      if (ts.isStringLiteral(argument)) {
        return argument;
      }
    } else if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression)) {
      // require('location'); // This is an alternate AST version of it
      return getModuleSpecifier(node.expression);
    }
    return undefined;
  }
}

const EXEMPTIONS = new Set([
  '@aws-cdk/cloudformation-diff',
]);

function updatedLocationOf(modulePath: string, monoPackageName: string, monoAssertPackageName: string): string | undefined {
  if (!modulePath.startsWith('@aws-cdk/') || EXEMPTIONS.has(modulePath)) {
    return undefined;
  }

  if (modulePath === '@aws-cdk/core') {
    return monoPackageName;
  }

  if (modulePath === '@aws-cdk/assert') {
    return monoAssertPackageName;
  }

  if (modulePath === '@aws-cdk/assert/jest') {
    return `${monoAssertPackageName}/jest`;
  }

  return `${monoPackageName}/${modulePath.substring(9)}`;
}
