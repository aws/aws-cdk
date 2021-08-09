import * as ts from 'typescript';

/**
 * The options for rewriting the file.
 */
export interface RewriteOptions {
  /**
   * Optional module names that should result in replacing to something different than just 'aws-cdk-lib'.
   */
  readonly customModules?: { [moduleName: string]: string };
}

/**
 * Re-writes "hyper-modular" CDK imports (most packages in `@aws-cdk/*`) to the
 * relevant "mono" CDK import path. The re-writing will only modify the imported
 * library path, presrving the existing quote style, etc...
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
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteImports(sourceText: string, fileName: string = 'index.ts', options: RewriteOptions = {}): string {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2018);

  const replacements = new Array<{ original: ts.Node, updatedLocation: string }>();

  const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
    const moduleSpecifier = getModuleSpecifier(node);
    const newTarget = moduleSpecifier && updatedLocationOf(moduleSpecifier.text, options);

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

function updatedLocationOf(modulePath: string, options: RewriteOptions): string | undefined {
  const customModulePath = options.customModules?.[modulePath];
  if (customModulePath) {
    return customModulePath;
  }

  if (!modulePath.startsWith('@aws-cdk/') || EXEMPTIONS.has(modulePath)) {
    return undefined;
  }

  if (modulePath.startsWith('@aws-cdk/core/lib')) {
    return `aws-cdk-lib/lib/core/lib/${modulePath.substring('@aws-cdk/core/lib/'.length)}`;
  }

  if (modulePath === '@aws-cdk/core') {
    return 'aws-cdk-lib';
  }

  // These 2 are unchanged
  if (modulePath === '@aws-cdk/assert') {
    return '@aws-cdk/assert';
  }

  // can't use simple equality here,
  // because we have imports like "import '@aws-cdk/assert-internal/jest'"
  if (modulePath.startsWith('@aws-cdk/assert-internal')) {
    return modulePath.replace(/^@aws-cdk\/assert-internal/, '@aws-cdk/assert');
  }

  if (modulePath === '@aws-cdk/assert/jest') {
    return '@aws-cdk/assert/jest';
  }

  return `aws-cdk-lib/${modulePath.substring(9)}`;
}
