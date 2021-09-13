import * as ts from 'typescript';

/**
 * The options for rewriting the file.
 */
export interface RewriteOptions {
  /**
   * Optional module names that should result in replacing to something different than just 'aws-cdk-lib'.
   */
  readonly customModules?: { [moduleName: string]: string };

  /**
   * Optional flag to set for rewriting imports in alpha packages. When true, this will rewrite imports of generated L1s to reference aws-cdk-lib.
   */
  readonly rewriteCfnImports?: boolean;

  /**
   * The name of the current package, e.g. aws-apigatewayv2.
   *
   * This is necessary for re-writing L1 imports where the module name is not present in the imported location.
   * e.g. import { CfnCluster, Cluster, ClusterParameterGroup, ClusterSubnetGroup, ClusterType } from '../lib';
   */
  readonly currentPackageName?: string;
}

const EXEMPTIONS = new Set([
  '@aws-cdk/cloudformation-diff',
]);

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
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteImports(sourceText: string, fileName: string = 'index.ts', options: RewriteOptions = {}): string {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2018);

  const updateStatement = function (node: ts.Statement): ts.Statement[] | ts.Statement {
    return updateStatementIfIsImportDeclaration(node)
      ?? updateStatementIfIsImportEqualsDeclaration(node)
      ?? updateStatementIfStandaloneRequireCallStatement(node)
      ?? updateStatementIfCfnIsMixedWithOtherImports(node);
  };

  const updatedStatements = flatMapForNodeArrays(sourceFile.statements, updateStatement);
  const printer = ts.createPrinter();

  // Generate the updated text from the list of updated statement nodes
  const printedStatements = updatedStatements.map(s => {
    // The 'original' key is present for all nodes that were created using a ts.UpdateXX() function
    if (!Object(s).original) {
      // This node was not updated, return original text.
      try {
        return s.getText(sourceFile);
      } catch (e) {
        // This node is brand new, so it doesn't have any text in the original source file, and we need to print it.
        return `\n${printer.printNode(ts.EmitHint.Unspecified, s, sourceFile)}`;
      }
    }

    return `${printer.printNode(ts.EmitHint.Unspecified, s, sourceFile)}`;
  });
  return printedStatements.join('\n');

  /**
   * Updates import statements in the following formats:
   *   import * as name from 'location';
   *   import { X, Y } from 'location';
   *   import 'location';
   *   import { X } = require('location');
   */
  function updateStatementIfIsImportDeclaration(node: ts.Statement): ts.Statement[] | ts.Statement | undefined {
    if (ts.isImportDeclaration(node)) {
      return updateImportDeclarationIfModuleSpecifierIsStringLiteral(node)
        ?? updateImportDeclarationWithRequireCallStatement(node);
    }
    return undefined;
  }

  /**
   * Updates import statements in the following formats:
   *   import name = require('location');
   */
  function updateStatementIfIsImportEqualsDeclaration(node: ts.Statement): ts.Statement[] | ts.Statement | undefined {
    if (
      ts.isImportEqualsDeclaration(node)
      && ts.isExternalModuleReference(node.moduleReference)
      && ts.isStringLiteral(node.moduleReference.expression)
    ) {
      // import name = require('location');
      const newLocation = updatedLocationOf(node.moduleReference.expression.text);
      if (newLocation) {
        return ts.updateImportEqualsDeclaration(node,
          undefined,
          undefined,
          node.name,
          ts.updateExternalModuleReference(node.moduleReference, ts.createIdentifier(newLocation)),
        );
      }
    }
    return undefined;
  }

  /**
   * Updates import statements in the following formats:
   *   require('location');
   */
  function updateStatementIfStandaloneRequireCallStatement(node: ts.Statement): ts.Statement[] | ts.Statement | undefined {
    if (
      ts.isExpressionStatement(node)
      && ts.isCallExpression(node.expression)
      && ts.isIdentifier(node.expression.expression)
      && node.expression.arguments.length === 1
      && node.expression.expression.escapedText === 'require'
    ) {
      // require('location');
      const arg = node.expression.arguments[0];
      if (ts.isStringLiteral(arg)) {
        const newLocation = updatedLocationOf(arg.text);
        if (newLocation) {
          const newCall = ts.updateCall(node.expression,
            node.expression.expression,
            undefined,
            [ts.createIdentifier(newLocation)],
          );
          return ts.updateExpressionStatement(node, newCall);
        }
      }
    }
    return undefined;
  }

  /**
   * Updates import statements if L1 Cfn constructs are mixed with other L2 constructs, or the imported location does not include 'generated' in the file name.
   * Example: import { CfnCluster, Cluster, ClusterParameterGroup, ClusterSubnetGroup, ClusterType } from '../lib';
   */
  function updateStatementIfCfnIsMixedWithOtherImports(node: ts.Statement): ts.Statement[] | ts.Statement {
    if (
      ts.isImportDeclaration(node)
      && ts.isStringLiteral(node.moduleSpecifier)
      && node.importClause
      && node.importClause.namedBindings
      && ts.isNamedImports(node.importClause.namedBindings)
    ) {
      const originalLocation = node.moduleSpecifier;
      const importedValues = node.importClause!.namedBindings.elements;
      const cfnImportsFromThisModule: ts.ImportSpecifier[] = [];
      const otherImports: ts.ImportSpecifier[] = [];

      importedValues.forEach((importedValue: ts.ImportSpecifier) => {
        if ((importedValue.name.text.startsWith('Cfn') || importedValue.propertyName?.text.startsWith('Cfn')) && !originalLocation.text.match('aws-cdk-lib')) {
          cfnImportsFromThisModule.push(importedValue);
        } else {
          otherImports.push(importedValue);
        }
      });

      if (cfnImportsFromThisModule.length > 0) {
        // rewrite the original node with only the Cfn import and the correct location.
        const rewrittenOriginalNodewithOnlyCfnImports = ts.updateImportDeclaration(node,
          undefined,
          undefined,
          ts.createImportClause(
            undefined,
            ts.createNamedImports(cfnImportsFromThisModule),
          ),
          ts.createIdentifier(`'aws-cdk-lib/${options.currentPackageName}'`),
        );
        // create a new node with the other imports
        if (otherImports.length > 0) {
          const otherImportsNewNode = ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
              undefined,
              ts.createNamedImports(otherImports),
            ),
            originalLocation,
          );
          return [rewrittenOriginalNodewithOnlyCfnImports, otherImportsNewNode];
        }
        return rewrittenOriginalNodewithOnlyCfnImports;
      }
    }
    return node;
  }

  /**
   * Updates import statements in the following formats:
   *   import * as name from 'location';
   *   import { X, Y } from 'location';
   *   import 'location';
   */
  function updateImportDeclarationIfModuleSpecifierIsStringLiteral(node: ts.ImportDeclaration): ts.Statement[] | ts.Statement | undefined {
    if (ts.isStringLiteral(node.moduleSpecifier)) {
      const newLocation = updatedLocationOf(node.moduleSpecifier.text);
      if (newLocation) {
        if (node.importClause && node.importClause.namedBindings) {
          if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            // import * as name from 'location';
            return ts.updateImportDeclaration(node,
              undefined,
              undefined,
              ts.createImportClause(
                undefined,
                node.importClause.namedBindings,
              ),
              ts.createIdentifier(newLocation),
            );
          }
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            // import { X, Y } from 'location';
            return ts.updateImportDeclaration(node,
              undefined,
              undefined,
              node.importClause,
              ts.createIdentifier(newLocation),
            );
          }
        } else {
          // import 'location';
          return ts.updateImportDeclaration(node,
            undefined,
            undefined,
            undefined,
            ts.createIdentifier(newLocation),
          );
        }
      }
    }
    return undefined;
  }

  /**
   * Updates import statements in the following formats:
   *   import { X } = require('location');
   */
  function updateImportDeclarationWithRequireCallStatement(node: ts.ImportDeclaration): ts.Statement[] | ts.Statement | undefined {
    if (
      ts.isBinaryExpression(node.moduleSpecifier)
      && ts.isCallExpression(node.moduleSpecifier.right)
      && ts.isIdentifier(node.moduleSpecifier.right.expression)
      && node.moduleSpecifier.right.arguments.length === 1
      && node.moduleSpecifier.right.expression.escapedText === 'require'
    ) {
      // import { X } = require('location');
      // TODO: This implementation generates import `{ X } from require('newLocation')`. I am not sure why the = gets dropped in favor of `from`.
      const arg = node.moduleSpecifier.right.arguments[0];
      if (ts.isStringLiteral(arg)) {
        const newLocation = updatedLocationOf(arg.text);
        if (
          newLocation
          && node.importClause
          && node.importClause.namedBindings
          && ts.isNamedImports(node.importClause.namedBindings)
        ) {
          return ts.updateImportDeclaration(node,
            undefined,
            undefined,
            node.importClause,
            ts.updateCall(
              node.moduleSpecifier.right,
              ts.createIdentifier('require'),
              undefined,
              [ts.createIdentifier(newLocation)],
            ),
          );
        }
      }
    }
    return undefined;
  }

  function updatedLocationOf(originalLocation: string): string | undefined {
    const customModulePath = options.customModules?.[originalLocation];
    if (customModulePath) {
      return `'${customModulePath}'`;
    }

    if (
      !originalLocation.startsWith('@aws-cdk/')
      || EXEMPTIONS.has(originalLocation)
      || originalLocation === '@aws-cdk/assert'
      || originalLocation === '@aws-cdk/assert/jest') {
      return undefined;
    }

    if (originalLocation.startsWith('@aws-cdk/core/lib')) {
      return `'aws-cdk-lib/lib/core/lib/${originalLocation.substring('@aws-cdk/core/lib/'.length)}'`;
    }

    if (originalLocation === '@aws-cdk/core') {
      return '\'aws-cdk-lib\'';
    }

    // can't use simple equality here,
    // because we have imports like "import '@aws-cdk/assert-internal/jest'"
    if (originalLocation.startsWith('@aws-cdk/assert-internal')) {
      return originalLocation.replace(/^@aws-cdk\/assert-internal/, '@aws-cdk/assert');
    }

    return `'aws-cdk-lib/${originalLocation.substring('@aws-cdk/'.length)}'`;
  }
}

function flatMapForNodeArrays(xs: ts.NodeArray<ts.Statement>, fn: (x: ts.Statement) => ts.Statement[] | ts.Statement): ts.NodeArray<ts.Statement> {
  const ret = new Array<ts.Statement>();
  for (const x of xs) {
    const result = fn(x);
    if (Array.isArray(result)) {
      ret.push(...result);
    } else {
      ret.push(result);
    }
  }
  return ts.createNodeArray<ts.Statement>(ret);
}