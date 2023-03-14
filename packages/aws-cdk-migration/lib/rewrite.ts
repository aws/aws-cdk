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
   * When true, this will rewrite imports of generated L1s to reference aws-cdk-lib.
   *
   * For example:
   *   import * as codestar from './codestar.generated';`
   * becomes:
   *   import * as codestar from 'aws-cdk-lib/aws-codestar';
   */
  readonly rewriteCfnImports?: boolean;

  /**
   * The unscoped name of the package, e.g. 'aws-kinesisfirehose'.
   */
  readonly packageUnscopedName?: string;

  /**
   * When true, imports to known types from the 'constructs' library will be rewritten
   * to explicitly import from 'constructs', rather than '@aws-cdk/core'.
   * @default false
   */
  readonly rewriteConstructsImports?: boolean;
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
 * @param libName the mono CDK library name.
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteMonoPackageImports(sourceText: string, libName: string, fileName: string = 'index.ts', options: RewriteOptions = {}): string {
  return rewriteImports(
    sourceText,
    (modPath, importedElements) => updatedExternalLocation(modPath, libName, options, importedElements),
    fileName,
    options.rewriteConstructsImports,
  );
}

/**
 * Re-writes READMEs of "hyper-modular" CDK imports (most packages in `@aws-cdk/*`)
 * to the relevant "mono" CDK import path. The re-writing will only modify the imported
 * library path, presrving the existing quote style, etc...
 *
 * Syntax errors in the README snippets being processed may cause some import
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
 * @param sourceText the README where snippet imports should be re-written.
 * @param libName the mono CDK library name.
 * @param fileName   a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteReadmeImports(sourceText: string, libName: string, fileName: string = 'index.ts', options: RewriteOptions = {}): string {
  return sourceText.replace(/(```(?:ts|typescript|text)[^\n]*\n)(.*?)(\n\s*```)/gs, (_m, prefix, body, suffix) => {
    return prefix +
      rewriteImports(
        body,
        (modPath, importedElements) => updatedExternalLocation(modPath, libName, options, importedElements),
        fileName,
        options.rewriteConstructsImports,
      ) +
      suffix;
  });
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
 * @param sourceText         the source code where imports should be re-written.
 * @param updatedLocation    a function that returns the updated location of the import.
 * @param fileName           a customized file name to provide the TypeScript processor.
 *
 * @returns the updated source code.
 */
export function rewriteImports(
  sourceText: string,
  updatedLocation: (modulePath: string, importedElements?: ts.NodeArray<ts.ImportSpecifier>) => string | undefined,
  fileName: string = 'index.ts',
  rewriteConstructsImports: boolean = false,
): string {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ES2020, true);
  const rewriter = new ImportRewriter(sourceFile, updatedLocation, rewriteConstructsImports);
  ts.transform(sourceFile, [rewriter.rewriteTransformer()]);
  return rewriter.rewriteImports();
}

class ImportRewriter {
  private static CONSTRUCTS_TYPES = ['Construct', 'IConstruct'];

  private readonly replacements = new Array<{ original: ts.Node, updatedLocation: string, quoted: boolean }>();
  // Constructs rewrites
  private readonly constructsNamedImports: Set<ts.ImportSpecifier> = new Set();
  private readonly constructsId = 'constructs';
  private firstImportNode?: ts.Node;
  private constructsNamespaceImportRequired: boolean = false;

  public constructor(
    private readonly sourceFile: ts.SourceFile,
    private readonly updatedLocation: (modulePath: string, importedElements?: ts.NodeArray<ts.ImportSpecifier>) => string | undefined,
    private readonly rewriteConstructsImports: boolean,
  ) { }

  public rewriteTransformer(): ts.TransformerFactory<ts.SourceFile> {
    const coreNamespaceImports: Set<string> = new Set();

    return (context) => {
      return (sourceFile) => {
        const visitor = <T extends ts.Node>(node: T): ts.VisitResult<T> => {
          const moduleSpecifier = getModuleSpecifier(node);
          if (moduleSpecifier) {
            return this.visitImportNode<T>(node, coreNamespaceImports, moduleSpecifier);
          }

          // Rewrite any access or type references with a format `foo.Construct`,
          // where `foo` matches the name of a namespace import for '@aws-cdk/core'
          // Simple identifiers (e.g., readonly foo: Construct) do not need to be written,
          // only qualified identifiers (e.g., cdk.Construct).
          if (ts.isIdentifier(node) && ImportRewriter.CONSTRUCTS_TYPES.includes(node.text)) {
            if (ts.isPropertyAccessExpression(node.parent)
              && ts.isIdentifier(node.parent.expression)
              && coreNamespaceImports.has(node.parent.expression.text)) {
              this.replacements.push({ original: node.parent, updatedLocation: `${this.constructsId}.${node.text}`, quoted: false });
              this.constructsNamespaceImportRequired = true;
            } else if (ts.isQualifiedName(node.parent)
              && ts.isIdentifier(node.parent.left)
              && coreNamespaceImports.has(node.parent.left.text)) {
              this.replacements.push({ original: node.parent, updatedLocation: `${this.constructsId}.${node.text}`, quoted: false });
              this.constructsNamespaceImportRequired = true;
            }
          }

          return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(sourceFile, visitor);
      };
    };
  }

  /**
   * Visit import nodes where a module specifier of some kind has been found.
   *
   * For most nodes, this simply involves rewritting the location of the module via `this.updatedLocation`.
   *
   * Assumes the current node is an import (of some type) that imports '@aws-cdk/core'.
   *
   * The following import types are suported:
   * - import * as core1 from '@aws-cdk/core';
   * - import core2 = require('@aws-cdk/core');
   * - import { Type1, Type2 as CoreType2 } from '@aws-cdk/core';
   * - import { Type1, Type2 as CoreType2 } = require('@aws-cdk/core');
   *
   * For all namespace imports, capture the namespace used so any references later can be updated.
   * For example, 'core1.Construct' needs to be renamed to 'constructs.Construct'.
   * For all named imports:
   * - If all named imports are constructs types, simply rename the import from core to constructs.
   * - If there's a split, the constructs types are removed and captured for later to go into a new import.
   *
   * @returns true iff all other transforms should be skipped for this node.
   */
  private visitImportNode<T extends ts.Node>(node: T, coreNamespaceImports: Set<string>, moduleSpecifier: ts.StringLiteral) {
    // Used later for constructs imports generation, to mark location and get indentation
    if (!this.firstImportNode) { this.firstImportNode = node; }

    // Special-case @aws-cdk/core for the case of constructs imports.
    if (this.rewriteConstructsImports && moduleSpecifier.text === '@aws-cdk/core') {
      if (ts.isImportEqualsDeclaration(node)) {
        // import core = require('@aws-cdk/core');
        coreNamespaceImports.add(node.name.text);
      } else if (ts.isImportDeclaration(node) && node.importClause?.namedBindings) {
        const bindings = node.importClause?.namedBindings;
        if (ts.isNamespaceImport(bindings)) {
          // import * as core from '@aws-cdk/core';
          coreNamespaceImports.add(bindings.name.text);
        } else if (ts.isNamedImports(bindings)) {
          // import { Type1, Type2 as CoreType2 } from '@aws-cdk/core';
          // import { Type1, Type2 as CoreType2 } = require('@aws-cdk/core');

          // Segment the types into core vs construct types
          const constructsImports: ts.ImportSpecifier[] = [];
          const coreImports: ts.ImportSpecifier[] = [];
          bindings.elements.forEach((e) => {
            if (ImportRewriter.CONSTRUCTS_TYPES.includes(e.name.text) ||
              (e.propertyName && ImportRewriter.CONSTRUCTS_TYPES.includes(e.propertyName.text))) {
              constructsImports.push(e);
            } else {
              coreImports.push(e);
            }
          });

          // Three cases:
          // 1. There are no constructs imports. No special-casing to do.
          // 2. There are ONLY constructs imports. The whole import can be replaced.
          // 3. There is a mix. We must remove the constructs imports, and add them to a dedicated line.
          if (constructsImports.length > 0) {
            if (coreImports.length === 0) {
              // Rewrite the module to constructs, skipping the normal updateLocation replacement.
              this.replacements.push({ original: moduleSpecifier, updatedLocation: this.constructsId, quoted: true });
              return node;
            } else {
              // Track these named imports to add to a dedicated import statement later.
              constructsImports.forEach((i) => this.constructsNamedImports.add(i));

              // This replaces the interior of the import statement, between the braces:
              // import { Stack as CdkStack, StackProps } ...
              const coreBindings = ' ' + coreImports.map((e) => e.getText()).join(', ') + ' ';
              this.replacements.push({ original: bindings, updatedLocation: coreBindings, quoted: true });
            }
          }
        }
      }
    }

    const newTarget = this.updatedLocation(moduleSpecifier.text, getImportedElements(node));
    if (newTarget != null) {
      this.replacements.push({ original: moduleSpecifier, updatedLocation: newTarget, quoted: true });
    }
    return node;
  }

  /**
   * Rewrites the imports -- and possibly some qualified identifiers -- in the source file,
   * based on the replacement information gathered via transforming the source through `rewriteTransformer()`.
   */
  public rewriteImports(): string {
    let updatedSourceText = this.sourceFile.text;
    // Applying replacements in reverse order, so node positions remain valid.
    const sortedReplacements = this.replacements.sort(
      ({ original: l }, { original: r }) => r.getStart(this.sourceFile) - l.getStart(this.sourceFile));
    for (const replacement of sortedReplacements) {
      const offset = replacement.quoted ? 1 : 0;
      const prefix = updatedSourceText.substring(0, replacement.original.getStart(this.sourceFile) + offset);
      const suffix = updatedSourceText.substring(replacement.original.getEnd() - offset);

      updatedSourceText = prefix + replacement.updatedLocation + suffix;
    }

    // Lastly, prepend the source with any new constructs imports, as needed.
    const constructsImports = this.getConstructsImportsPrefix();
    if (constructsImports) {
      const insertionPoint = this.firstImportNode
        // Start of the line, past any leading comments or shebang lines
        ? (this.firstImportNode.getStart() - this.getNodeIndentation(this.firstImportNode))
        : 0;
      updatedSourceText = updatedSourceText.substring(0, insertionPoint)
        + constructsImports
        + updatedSourceText.substring(insertionPoint);
    }

    return updatedSourceText;
  }

  /**
   * If constructs imports are needed (either namespaced or named types),
   * this returns a string with one (or both) imports that can be prepended to the source.
   */
  private getConstructsImportsPrefix(): string | undefined {
    if (!this.constructsNamespaceImportRequired && this.constructsNamedImports.size === 0) { return undefined; }

    const indentation = ' '.repeat(this.getNodeIndentation(this.firstImportNode));
    let constructsImportPrefix = '';
    if (this.constructsNamespaceImportRequired) {
      constructsImportPrefix += `${indentation}import * as ${this.constructsId} from 'constructs';\n`;
    }
    if (this.constructsNamedImports.size > 0) {
      const namedImports = [...this.constructsNamedImports].map(i => i.getText()).join(', ');
      constructsImportPrefix += `${indentation}import { ${namedImports} } from 'constructs';\n`;
    }
    return constructsImportPrefix;
  }

  /**
   * For a given node, attempts to determine and return how many spaces of indentation are used.
   */
  private getNodeIndentation(node?: ts.Node): number {
    if (!node) { return 0; }

    // Get leading spaces for the final line in the node's trivia
    const fullText = node.getFullText();
    const trivia = fullText.substring(0, fullText.length - node.getWidth());
    const m = /( *)$/.exec(trivia);
    return m ? m[1].length : 0;
  }
}

/**
 * Returns the module specifier (location) of an import statement in one of the following forms:
 *   import from 'location';
 *   import * as name from 'location';
 *   import { Type } from 'location';
 *   import { Type } = require('location');
 *   import name = require('location');
 *   require('location');
 */
function getModuleSpecifier(node: ts.Node): ts.StringLiteral | undefined {
  if (ts.isImportDeclaration(node)) {
    // import style
    const moduleSpecifier = node.moduleSpecifier;
    if (ts.isStringLiteral(moduleSpecifier)) {
      // import from 'location';
      // import * as name from 'location';
      // import { Foo } from 'location';
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

const EXEMPTIONS = new Set([
  '@aws-cdk/cloudformation-diff',
  // The dev-tools
  '@aws-cdk/cdk-build-tools',
  '@aws-cdk/cdk-integ-tools',
  '@aws-cdk/cfn2ts',
  '@aws-cdk/eslint-plugin',
  '@aws-cdk/pkglint',
]);

function updatedExternalLocation(
  modulePath: string,
  libName: string,
  options: RewriteOptions,
  importedElements?: ts.NodeArray<ts.ImportSpecifier>,
): string | undefined {
  const customModulePath = options.customModules?.[modulePath];
  if (customModulePath) {
    let awsCdkLibLocation = undefined;
    importedElements?.forEach(e => {
      if (e.name.text.startsWith('Cfn') || e.propertyName?.text.startsWith('Cfn')) {
        // This is an L1 import, so don't return the customModulePath (which is the alpha module).
        // Return the relevant aws-cdk-lib location.
        awsCdkLibLocation = `${libName}/${modulePath.substring('@aws-cdk/'.length)}`;
      }
    });
    if (awsCdkLibLocation) {
      return awsCdkLibLocation;
    }
    return customModulePath;
  }

  if (options.rewriteCfnImports && modulePath.endsWith(`${options.packageUnscopedName?.slice('aws-'.length)}.generated`)) {
    return `${libName}/${options.packageUnscopedName}`;
  }

  if (
    !modulePath.startsWith('@aws-cdk/')
    || EXEMPTIONS.has(modulePath)
    || Array.from(EXEMPTIONS).some((ex) => modulePath.startsWith(`${ex}/`))
  ) {
    return undefined;
  }

  if (modulePath.startsWith('@aws-cdk/core/lib')) {
    return `${libName}/core/lib/${modulePath.substring('@aws-cdk/core/lib/'.length)}`;
  }

  if (modulePath === '@aws-cdk/core') {
    return libName;
  }

  return `${libName}/${modulePath.substring('@aws-cdk/'.length)}`;
}

/**
 * Returns the names of all types imported via named imports of the form:
 * import { Type } from 'location'
 */
function getImportedElements(node: ts.Node): ts.NodeArray<ts.ImportSpecifier> | undefined {
  if (
    ts.isImportDeclaration(node)
    && ts.isStringLiteral(node.moduleSpecifier)
    && node.importClause
    && node.importClause.namedBindings
    && ts.isNamedImports(node.importClause.namedBindings)
  ) {
    return node.importClause.namedBindings.elements;
  }
  return undefined;
}
