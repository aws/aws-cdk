import * as ts from 'typescript';

interface Import {
  location?: ts.StringLiteral;
  value?: ts.Identifier | ts.NodeArray<ts.ImportSpecifier>;
}

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
   *
   * For example:
   *   import * as codestar from './codestar.generated';`
   * becomes:
   *   import * as codestar from 'aws-cdk-lib/aws-codestar';
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

  const replacements = new Array<{ original: ts.Node, updated: string }>();

  const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
    const moduleSpecifier = getModuleSpecifier(node);
    const newTarget = moduleSpecifier?.location && updatedLocationOf(moduleSpecifier.location.text, options);

    // Check for a Cfn barrel import that doesn't have 'generated' in the original location name, and could be interleaved with other imports
    if (!newTarget && moduleSpecifier?.location && moduleSpecifier.value && Array.isArray(moduleSpecifier.value)) {
      addReplacementsForCfnImportsMixedWithOtherImports(node, moduleSpecifier.value, moduleSpecifier.location.text);
    }

    if (moduleSpecifier?.location != null && newTarget != null) {
      replacements.push({ original: moduleSpecifier.location, updated: newTarget });
    }
    return node;
  };

  sourceFile.statements.forEach(node => ts.visitNode(node, visitor));

  let updatedSourceText = sourceText;
  // Applying replacements in reverse order, so node positions remain valid.
  for (const replacement of replacements.sort(({ original: l }, { original: r }) => r.getStart(sourceFile) - l.getStart(sourceFile))) {
    const prefix = updatedSourceText.substring(0, replacement.original.getStart(sourceFile) + 1);
    const suffix = updatedSourceText.substring(replacement.original.getEnd() - 1);

    updatedSourceText = prefix + replacement.updated + suffix;
  }

  return updatedSourceText;

  function getModuleSpecifier(node: ts.Node): Import | undefined {
    if (ts.isImportDeclaration(node)) {
      // import style
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        if (node.importClause && node.importClause.namedBindings) {
          if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            // import * as name from 'location';
            return {
              location: moduleSpecifier,
              value: node.importClause.namedBindings.name,
            };
          } else if (ts.isNamedImports(node.importClause.namedBindings)) {
            // import { Type } from 'location';
            return {
              location: moduleSpecifier,
              value: node.importClause.namedBindings.elements,
            };
          }
        } else {
          // import 'location';
          return {
            location: moduleSpecifier,
          };
        }
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
      return {
        location: node.moduleReference.expression,
        value: node.name,
      };
    } else if (
      (ts.isCallExpression(node))
      && ts.isIdentifier(node.expression)
      && node.expression.escapedText === 'require'
      && node.arguments.length === 1
    ) {
      // require('location');
      const argument = node.arguments[0];
      if (ts.isStringLiteral(argument)) {
        return {
          location: argument,
        };
      }
    } else if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression)) {
      // require('location'); // This is an alternate AST version of it
      return {
        location: getModuleSpecifier(node.expression)?.location,
      };
    }
    return undefined;
  }

  function addReplacementsForCfnImportsMixedWithOtherImports(
    node: ts.Node,
    importedValues: ts.NodeArray<ts.ImportSpecifier>,
    originalLocation: string,
  ) {
    const cfnImportsFromThisModule: ts.ImportSpecifier[] = [];
    const otherImports: ts.ImportSpecifier[] = [];

    importedValues.forEach((importedValue: ts.ImportSpecifier) => {
      if ((importedValue.name.text.startsWith('Cfn') || importedValue.propertyName?.text.startsWith('Cfn')) && !originalLocation.match('aws-cdk-lib')) {
        cfnImportsFromThisModule.push(importedValue);
      } else {
        otherImports.push(importedValue);
      }
    });

    if (cfnImportsFromThisModule.length > 0) {
      if (otherImports.length > 0) {
        // add another line for the other non-cfn imports insert a new line and indent
        const beginningLinePos = Array.from(sourceFile.getLineStarts())
          .reverse()
          .find((start) => start <= node.getStart(sourceFile))
          ?? node.getStart(sourceFile);
        const leadingSpaces = node.getStart(sourceFile) - beginningLinePos;
        const newImportLinePrefix = `${' '.repeat(leadingSpaces)}`;
        const lineWithNonCfnImports = `${newImportLinePrefix}import { ${otherImports.map((item: ts.ImportSpecifier) => item.name.text).join(', ')} } from '${originalLocation}'`;
        replacements.push({
          original: {
            getStart() {
              return node.getEnd();
            },
            getEnd() {
              return node.getEnd();
            },
          } as ts.Node,
          updated: lineWithNonCfnImports,
        });
      }

      // rewrite the line for Cfn. (remove non-cfn imports)
      const rewrittenImportLine = `import { ${cfnImportsFromThisModule.map((item: ts.ImportSpecifier) => item.name.text).join(', ')} } from 'aws-cdk-lib/${options.currentPackageName}'`;
      replacements.push({
        original: {
          getStart() {
            return node.getStart(sourceFile) - 1;
          },
          getEnd() {
            return node.getEnd();
          },
        } as ts.Node,
        updated: rewrittenImportLine,
      });
    }
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

  if (options.rewriteCfnImports && modulePath.endsWith('generated') && !modulePath.match(/canned-metric|augmentations/)) {
    const modulePathSplit = modulePath.split(/[./]/);
    // The following line takes the 2nd to last item in modulePathSplit, which will always be the basename of the module e.g. apigatewayv2.
    return `aws-cdk-lib/aws-${modulePathSplit[modulePathSplit.length - 2]}`;
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
