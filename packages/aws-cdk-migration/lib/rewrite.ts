import * as ts from 'typescript';

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
export function rewriteImports(sourceText: string, fileName: string = 'index.ts'): string {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2018);
  const program = ts.createProgram([fileName], {});
  const typeChecker = program.getTypeChecker();

  const replacements = new Array<{ original: ts.Node, updatedLocation: string }>();

  const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
    const { location: moduleSpecifier, value } = getModuleSpecifier(node) ?? {};
    if (moduleSpecifier) {
      if (moduleSpecifier.text === '@aws-cdk/core' && value) {
        let lookForName: string | undefined;
        let lookForQualifier: string | undefined;
        if (Array.isArray(value)) {
          lookForName = value.find(({ property }) => property.text === 'Construct')?.alias.text;
        } else if (ts.isIdentifier(value)) {
          lookForName = 'Construct';
          lookForQualifier = value.text;
        }
        lookForName ?? '' + lookForQualifier ?? '';
      }

      const newTarget = updatedLocationOf(moduleSpecifier.text);
      if (newTarget != null) {
        replacements.push({ original: moduleSpecifier, updatedLocation: newTarget });
      }

      // eslint-disable-next-line no-console
      console.log(node);
      const symbol = typeChecker.getSymbolAtLocation(node);
      if (symbol) {
        // eslint-disable-next-line no-console
        console.log(typeChecker.getFullyQualifiedName(symbol));
      }
    }

    return node;
  };

  ts.forEachChild(sourceFile, node => visitor(node));

  let updatedSourceText = sourceText;
  // Applying replacements in reverse order, so node positions remain valid.
  for (const replacement of replacements.sort(({ original: l }, { original: r }) => r.getStart(sourceFile) - l.getStart(sourceFile))) {
    const prefix = updatedSourceText.substring(0, replacement.original.getStart(sourceFile) + 1);
    const suffix = updatedSourceText.substring(replacement.original.getEnd() - 1);

    updatedSourceText = prefix + replacement.updatedLocation + suffix;
  }

  return updatedSourceText;
}

interface ImportName {
  property: ts.Identifier;
  alias: ts.Identifier;
}

interface Import {
  location: ts.StringLiteral;
  value?: ts.Identifier | ImportName[];
}

function getModuleSpecifier(node: ts.Node): Import | undefined {
  if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
    // import { Type } from 'location';
    // import * as name from 'location';
    const location = node.moduleSpecifier;
    if (node.importClause && node.importClause.namedBindings) {
      if (ts.isNamespaceImport(node.importClause.namedBindings)) {
        return {
          location: location,
          value: node.importClause.namedBindings.name,
        };
      } else if (ts.isNamedImports(node.importClause.namedBindings)) {
        return {
          location: location,
          value: node.importClause.namedBindings.elements.map((element) => {
            return { property: element.propertyName ?? element.name, alias: element.name };
          }),
        };
      }
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
    return getModuleSpecifier(node.expression);
  }
  return undefined;
}

const EXEMPTIONS = new Set([
  '@aws-cdk/cloudformation-diff',
]);

function updatedLocationOf(modulePath: string): string | undefined {
  if (!modulePath.startsWith('@aws-cdk/') || EXEMPTIONS.has(modulePath)) {
    return undefined;
  }

  if (modulePath === '@aws-cdk/core') {
    return 'aws-cdk-lib';
  }

  // These 2 are unchanged
  if (modulePath === '@aws-cdk/assert') {
    return '@aws-cdk/assert';
  }

  if (modulePath === '@aws-cdk/assert/jest') {
    return '@aws-cdk/assert/jest';
  }

  return `aws-cdk-lib/${modulePath.substring(9)}`;
}
