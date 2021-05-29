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
 * - `require('@aws-cdk/lib');
 *
 * @param sourceText the source code where imports should be re-written.
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteImports(sourceText: string, fileName: string = 'index.ts'): string {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2018);

  const replacements = new Array<{ original: ts.Node, updated: string }>();

  let constructLookFor: {
    name: string,
    replacement: string,
    newImport: string,
  } | undefined;

  const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
    const { location: moduleSpecifier, value } = getModuleSpecifier(node) ?? {};
    if (moduleSpecifier) {
      if (moduleSpecifier.text === '@aws-cdk/core' && value) {
        if (Array.isArray(value)) {
          const constructValue = value.find((val) => (val.propertyName ?? val.name).text === 'Construct');
          if (constructValue) {
            const aliasStatement = constructValue.propertyName ? ` as ${constructValue.name.text}` : '';
            constructLookFor = {
              name: constructValue.name.text,
              replacement: constructValue.name.text,
              newImport: `import { Construct${aliasStatement} } from 'constructs';`,
            };
            const constructIndex = value.indexOf(constructValue);
            let importSpecifierStart = constructValue.getStart(sourceFile);
            let importSpecifierEnd = constructValue.getEnd();
            if (constructIndex > 0) {
              importSpecifierStart = value[constructIndex - 1].getEnd();
            } else if (constructIndex < value.length - 1) {
              importSpecifierEnd = value[constructIndex + 1].getStart(sourceFile);
            }
            replacements.push({
              original: {
                getStart() {
                  return importSpecifierStart;
                },
                getEnd() {
                  return importSpecifierEnd;
                },
              } as ts.Node,
              updated: '',
            });
          }
        } else if (ts.isIdentifier(value as ts.Node)) {
          const name = `${(value as ts.Identifier).text}.Construct`;
          const replacement = 'constructs.Construct';
          if (ts.isImportDeclaration(node)) {
            constructLookFor = {
              name,
              replacement,
              newImport: 'import * as constructs from \'constructs\';',
            };
          } else if (ts.isImportEqualsDeclaration(node)) {
            constructLookFor = {
              name,
              replacement,
              newImport: 'import constructs = require(\'constructs\');',
            };
          }
        }
        if (constructLookFor) {
          const beginningLinePos = Array.from(sourceFile.getLineStarts())
            .reverse()
            .find((start) => start <= node.getStart(sourceFile))
            ?? node.getStart(sourceFile);
          const leadingSpaces = node.getStart(sourceFile) - beginningLinePos;
          const newImportPrefix = `\n${' '.repeat(leadingSpaces)}`;
          replacements.push({
            original: {
              getStart() {
                return node.getEnd();
              },
              getEnd() {
                return node.getEnd();
              },
            } as ts.Node,
            updated: `${newImportPrefix}${constructLookFor.newImport}`,
          });
        }
      }

      const newTarget = updatedLocationOf(moduleSpecifier.text);
      if (newTarget != null) {
        replacements.push({
          original: {
            getStart() {
              return moduleSpecifier.getStart(sourceFile) + 1;
            },
            getEnd() {
              return moduleSpecifier.getEnd() - 1;
            },
          } as ts.Node,
          updated: newTarget,
        });
      }
    }

    if (
      constructLookFor
        && (ts.isTypeReferenceNode(node) || ts.isPropertyAccessExpression(node)) && node.getText(sourceFile) === constructLookFor.name
    ) {
      replacements.push({ original: node, updated: constructLookFor.replacement });
    }

    node.forEachChild(visitor);

    return undefined;
  };

  sourceFile.forEachChild(visitor);

  let updatedSourceText = sourceText;
  // Applying replacements in reverse order, so node positions remain valid.
  for (const replacement of replacements.sort(({ original: l }, { original: r }) => r.getStart(sourceFile) - l.getStart(sourceFile))) {
    const prefix = updatedSourceText.substring(0, replacement.original.getStart(sourceFile));
    const suffix = updatedSourceText.substring(replacement.original.getEnd());

    updatedSourceText = prefix + replacement.updated + suffix;
  }

  return updatedSourceText;
}

interface Import {
  location: ts.StringLiteral;
  value?: ts.Identifier | ts.NodeArray<ts.ImportSpecifier>;
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
          value: node.importClause.namedBindings.elements,
        };
      }
    } else {
      return {
        location: location,
      };
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
  }
  return undefined;
}

const EXEMPTIONS = new Set([
  '@aws-cdk/cloudformation-diff',
  '@aws-cdk/assert',
  '@aws-cdk/assert/jest',
]);

function updatedLocationOf(modulePath: string): string | undefined {
  let updated: string | undefined;
  if (!modulePath.startsWith('@aws-cdk/') || EXEMPTIONS.has(modulePath)) {
    updated = undefined;
  } else if (modulePath === '@aws-cdk/core') {
    updated = 'aws-cdk-lib';
  } else {
    updated = `aws-cdk-lib/${modulePath.substring(9)}`;
  }
  return updated;
}
