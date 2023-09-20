/**
 * Transform a set of .js files, making all module imports lazy
 *
 * That is:
 *
 * - Find all top-level require() assignments, and replace them with a function that performs
 *   the require(). That way, the require() is only done if any of the objects from its scope
 *   are actually used.
 * - Find all (transpiled) `export * from 'xyz';` statements (by searching for an invocation
 *   of `__exportStar()`): load the actual module, enumerate the entries, and create a getter
 *   for each entry.
 */
import { promises as fs } from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

type LogFn = (...x: string[]) => void;

export async function transformFile(filename: string) {
  progress(filename, '... ');
  const contents = await fs.readFile(filename, { encoding: 'utf-8' });
  const transformed = transformFileContents(filename, contents, progress);
  await fs.writeFile(filename, transformed, { encoding: 'utf-8' });
  progress(' Done!\n');

  function progress(...x: string[]) {
    process.stderr.write(x.join(' '));
  }
}

export function transformFileContents(filename: string, contents: string, progress?: LogFn) {
  const sourceFile = ts.createSourceFile(
    filename,
    contents,
    ts.ScriptTarget.Latest,
    true // setParentNodes, need this for tree analysis
  );

  // Find all top-level requires and turn them into a function
  const topLevelAssignments = sourceFile.statements
    .filter(ts.isVariableStatement)
    .filter((stmt) => stmt.declarationList.declarations.length === 1)
    .map((stmt) => [stmt, stmt.declarationList.declarations[0]] as const);

  progress?.(`${topLevelAssignments.length} declarations`, '... ');

  const topLevelRequires = topLevelAssignments
    .flatMap(([stmt, a]) => a.initializer && ts.isCallExpression(a.initializer)
      && ts.isIdentifier(a.initializer.expression) && a.initializer.expression.text === 'require'
      && ts.isStringLiteral(a.initializer.arguments[0])
      && ts.isIdentifier(a.name)
      ? [[stmt, a.name, a.initializer.arguments[0].text] as const] : []);

  progress?.(`${topLevelRequires.length} requires`, '... ');

  let file = sourceFile;

  for (const [stmt, binding, moduleName] of topLevelRequires) {
    const result = ts.transform(file, [(ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
      const factory = ctx.factory;
      const visit: ts.Visitor = node => {
        // If this is the statement, replace it with a function definition
        if (node === stmt) {
          return createVariable(factory, binding,
            factory.createArrowFunction(undefined, undefined, [], undefined, undefined,
              factory.createBlock([
                // tmp = require(...)
                createVariable(factory, 'tmp', factory.createCallExpression(factory.createIdentifier('require'), [], [factory.createStringLiteral(moduleName)])),

                // <this_fn> = () => tmp
                createAssignment(factory, binding.text,
                  factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createIdentifier('tmp'))),

                // return tmp
                factory.createReturnStatement(factory.createIdentifier('tmp')),
              ]),
            ),
          );
        }

        // If this is a shorthand property assignment and we we are the identifier in it, split it into two
        if (ts.isShorthandPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === binding.text) {
          return factory.createPropertyAssignment(node.name.text, factory.createCallExpression(factory.createIdentifier(binding.text), [], []));
        }

        // If this was an identifier referencing the original required module, turn it into a function call
        if (ts.isIdentifier(node) && node.text === binding.text) {

          // Ignore this identifier if it is not in RHS position
          const ignore = node.parent && (
            (ts.isPropertyAssignment(node.parent) && node.parent.name === node)  // { ident: value }
            || (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) // obj.ident = 3;
            || ts.isMethodDeclaration(node.parent) // public ident() { ... }
            || ts.isMethodSignature(node.parent) // interface X { ident(); }
            || ts.isPropertyDeclaration(node.parent) // class X { ident: string }
            || ts.isPropertySignature(node.parent) // interface X { ident: string }
            || ts.isGetAccessor(node.parent) // class X { get ident() { ... } }
            || ts.isGetAccessorDeclaration(node.parent) // interface X { get ident: string }
            || ts.isSetAccessor(node.parent) // class X { set ident() { ... } }
            || ts.isSetAccessorDeclaration(node.parent) // interface X { set ident: string }
          );
          // We should also ignore this identifier if it is shadowed
          // More places are also not RHS but if we leave those, it'll blow up syntactically and that's good

          if (!ignore) {
            return factory.createCallExpression(factory.createIdentifier(binding.text), [], []);
          }
        }

        return ts.visitEachChild(node, child => visit(child), ctx);
      };

      return (sf: ts.SourceFile) => ts.visitNode(sf, visit, ts.isSourceFile) ?? sf;
    }]);

    file = result.transformed[0];
    progress?.('X');
  }

  // Replace __exportStar

  file = ts.transform(file, [(ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    const factory = ctx.factory;
    const visit: ts.Visitor = node => {
      if (node.parent && ts.isSourceFile(node.parent)
        && ts.isExpressionStatement(node)
        && ts.isCallExpression(node.expression)
        && ts.isIdentifier(node.expression.expression)
        && node.expression.expression.text === '__exportStar'
        && node.expression.arguments.length === 2
        && ts.isCallExpression(node.expression.arguments[0])
        && ts.isIdentifier(node.expression.arguments[0].expression)
        && node.expression.arguments[0].expression.text === 'require'
        && ts.isStringLiteral(node.expression.arguments[0].arguments[0])) {
          // __exportStar(require('something'), exports);

        const requiredModule = node.expression.arguments[0].arguments[0].text;

        const file = require.resolve(requiredModule, { paths: [path.dirname(filename)] });
        // FIXME: Should probably do this in a subprocess
        const module = require(file);
        const entries = Object.keys(module);

        return entries.map((entry) =>
          createModuleGetter(factory, entry, requiredModule, (mod) =>
            factory.createPropertyAccessExpression(mod, entry))
          );
      }

      if (node.parent && ts.isSourceFile(node.parent)
        && ts.isExpressionStatement(node)
        && ts.isBinaryExpression(node.expression)
        && node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isPropertyAccessExpression(node.expression.left)
        && ts.isIdentifier(node.expression.left.expression)
        && node.expression.left.expression.text === 'exports'
        && ts.isCallExpression(node.expression.right)
        && ts.isIdentifier(node.expression.right.expression)
        && node.expression.right.expression.text === 'require'
        && ts.isStringLiteral(node.expression.right.arguments[0])) {
        // exports.module = require('./module');

        const exportName = node.expression.left.name.text;
        const moduleName = node.expression.right.arguments[0].text;
        return createModuleGetter(factory, exportName, moduleName, (x) => x);
      }

      return ts.visitEachChild(node, child => visit(child), ctx);
    };

    return (sf: ts.SourceFile) => ts.visitNode(sf, visit, ts.isSourceFile) ?? sf;
  }]).transformed[0];



  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printFile(file);
}

function createVariable(factory: ts.NodeFactory, name: string | ts.BindingName, expression: ts.Expression) {
  return factory.createVariableStatement([],
    factory.createVariableDeclarationList([
      factory.createVariableDeclaration(name, undefined, undefined, expression),
    ]));
}

function createAssignment(factory: ts.NodeFactory, name: string, expression: ts.Expression) {
  return factory.createExpressionStatement(
    factory.createBinaryExpression(
      factory.createIdentifier(name),
      ts.SyntaxKind.EqualsToken,
      expression));
}

function createModuleGetter(
  factory: ts.NodeFactory,
  exportName: string,
  moduleName: string,
  moduleFormatter: (x: ts.Expression) => ts.Expression,
) {
  return factory.createExpressionStatement(factory.createCallExpression(
    factory.createPropertyAccessExpression(factory.createIdentifier('Object'), factory.createIdentifier('defineProperty')),
    undefined,
    [
      factory.createIdentifier('exports'),
      factory.createStringLiteral(exportName),
      factory.createObjectLiteralExpression([
        factory.createPropertyAssignment('configurable', factory.createTrue()),
        factory.createPropertyAssignment('get',
          factory.createArrowFunction(undefined, undefined, [], undefined, undefined,
            moduleFormatter(
              factory.createCallExpression(factory.createIdentifier('require'), undefined, [factory.createStringLiteral(moduleName)])))),
      ]),
    ]
  ));
}