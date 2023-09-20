"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFileContents = exports.transformFile = void 0;
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
const fs_1 = require("fs");
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
async function transformFile(filename) {
    progress(filename, '... ');
    const contents = await fs_1.promises.readFile(filename, { encoding: 'utf-8' });
    const transformed = transformFileContents(filename, contents, progress);
    await fs_1.promises.writeFile(filename, transformed, { encoding: 'utf-8' });
    progress(' Done!\n');
    function progress(...x) {
        process.stderr.write(x.join(' '));
    }
}
exports.transformFile = transformFile;
function transformFileContents(filename, contents, progress) {
    const sourceFile = ts.createSourceFile(filename, contents, ts.ScriptTarget.Latest, true // setParentNodes, need this for tree analysis
    );
    // Find all top-level requires and turn them into a function
    const topLevelAssignments = sourceFile.statements
        .filter(ts.isVariableStatement)
        .filter((stmt) => stmt.declarationList.declarations.length === 1)
        .map((stmt) => [stmt, stmt.declarationList.declarations[0]]);
    progress === null || progress === void 0 ? void 0 : progress(`${topLevelAssignments.length} declarations`, '... ');
    const topLevelRequires = topLevelAssignments
        .flatMap(([stmt, a]) => a.initializer && ts.isCallExpression(a.initializer)
        && ts.isIdentifier(a.initializer.expression) && a.initializer.expression.text === 'require'
        && ts.isStringLiteral(a.initializer.arguments[0])
        && ts.isIdentifier(a.name)
        ? [[stmt, a.name, a.initializer.arguments[0].text]] : []);
    progress === null || progress === void 0 ? void 0 : progress(`${topLevelRequires.length} requires`, '... ');
    let file = sourceFile;
    for (const [stmt, binding, moduleName] of topLevelRequires) {
        const result = ts.transform(file, [(ctx) => {
                const factory = ctx.factory;
                const visit = node => {
                    // If this is the statement, replace it with a function definition
                    if (node === stmt) {
                        return createVariable(factory, binding, factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createBlock([
                            // tmp = require(...)
                            createVariable(factory, 'tmp', factory.createCallExpression(factory.createIdentifier('require'), [], [factory.createStringLiteral(moduleName)])),
                            // <this_fn> = () => tmp
                            createAssignment(factory, binding.text, factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createIdentifier('tmp'))),
                            // return tmp
                            factory.createReturnStatement(factory.createIdentifier('tmp')),
                        ])));
                    }
                    // If this is a shorthand property assignment and we we are the identifier in it, split it into two
                    if (ts.isShorthandPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === binding.text) {
                        return factory.createPropertyAssignment(node.name.text, factory.createCallExpression(factory.createIdentifier(binding.text), [], []));
                    }
                    // If this was an identifier referencing the original required module, turn it into a function call
                    if (ts.isIdentifier(node) && node.text === binding.text) {
                        // Ignore this identifier if it is not in RHS position
                        const ignore = node.parent && ((ts.isPropertyAssignment(node.parent) && node.parent.name === node) // { ident: value }
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
                return (sf) => { var _a; return (_a = ts.visitNode(sf, visit, ts.isSourceFile)) !== null && _a !== void 0 ? _a : sf; };
            }]);
        file = result.transformed[0];
        progress === null || progress === void 0 ? void 0 : progress('X');
    }
    // Replace __exportStar
    file = ts.transform(file, [(ctx) => {
            const factory = ctx.factory;
            const visit = node => {
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
                    return entries.map((entry) => factory.createExpressionStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier('Object'), factory.createIdentifier('defineProperty')), undefined, [
                        factory.createIdentifier('exports'),
                        factory.createStringLiteral(entry),
                        factory.createObjectLiteralExpression([
                            factory.createPropertyAssignment('configurable', factory.createTrue()),
                            factory.createPropertyAssignment('get', factory.createArrowFunction(undefined, undefined, [], undefined, undefined, factory.createPropertyAccessExpression(factory.createCallExpression(factory.createIdentifier('require'), undefined, [factory.createStringLiteral(requiredModule)]), entry)))
                        ]),
                    ])));
                }
                return ts.visitEachChild(node, child => visit(child), ctx);
            };
            return (sf) => { var _a; return (_a = ts.visitNode(sf, visit, ts.isSourceFile)) !== null && _a !== void 0 ? _a : sf; };
        }]).transformed[0];
    // To print the AST, we'll use TypeScript's printer
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    return printer.printFile(file);
}
exports.transformFileContents = transformFileContents;
function createVariable(factory, name, expression) {
    return factory.createVariableStatement([], factory.createVariableDeclarationList([
        factory.createVariableDeclaration(name, undefined, undefined, expression),
    ]));
}
function createAssignment(factory, name, expression) {
    return factory.createExpressionStatement(factory.createBinaryExpression(factory.createIdentifier(name), ts.SyntaxKind.EqualsToken, expression));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsMkJBQW9DO0FBQ3BDLDJDQUE2QjtBQUM3QiwrQ0FBaUM7QUFJMUIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxRQUFnQjtJQUNsRCxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNwRSxNQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sYUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDakUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJCLFNBQVMsUUFBUSxDQUFDLEdBQUcsQ0FBVztRQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztBQUNILENBQUM7QUFWRCxzQ0FVQztBQUVELFNBQWdCLHFCQUFxQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtJQUN4RixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQ3BDLFFBQVEsRUFDUixRQUFRLEVBQ1IsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQ3RCLElBQUksQ0FBQyw4Q0FBOEM7S0FDcEQsQ0FBQztJQUVGLDREQUE0RDtJQUM1RCxNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxVQUFVO1NBQzlDLE1BQU0s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QyxVQUFVLENBQUMsV0FBVyxFQUN6QixVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRyYW5zZm9ybSBhIHNldCBvZiAuanMgZmlsZXMsIG1ha2luZyBhbGwgbW9kdWxlIGltcG9ydHMgbGF6eVxuICpcbiAqIFRoYXQgaXM6XG4gKlxuICogLSBGaW5kIGFsbCB0b3AtbGV2ZWwgcmVxdWlyZSgpIGFzc2lnbm1lbnRzLCBhbmQgcmVwbGFjZSB0aGVtIHdpdGggYSBmdW5jdGlvbiB0aGF0IHBlcmZvcm1zXG4gKiAgIHRoZSByZXF1aXJlKCkuIFRoYXQgd2F5LCB0aGUgcmVxdWlyZSgpIGlzIG9ubHkgZG9uZSBpZiBhbnkgb2YgdGhlIG9iamVjdHMgZnJvbSBpdHMgc2NvcGVcbiAqICAgYXJlIGFjdHVhbGx5IHVzZWQuXG4gKiAtIEZpbmQgYWxsICh0cmFuc3BpbGVkKSBgZXhwb3J0ICogZnJvbSAneHl6JztgIHN0YXRlbWVudHMgKGJ5IHNlYXJjaGluZyBmb3IgYW4gaW52b2NhdGlvblxuICogICBvZiBgX19leHBvcnRTdGFyKClgKTogbG9hZCB0aGUgYWN0dWFsIG1vZHVsZSwgZW51bWVyYXRlIHRoZSBlbnRyaWVzLCBhbmQgY3JlYXRlIGEgZ2V0dGVyXG4gKiAgIGZvciBlYWNoIGVudHJ5LlxuICovXG5pbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxudHlwZSBMb2dGbiA9ICguLi54OiBzdHJpbmdbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zZm9ybUZpbGUoZmlsZW5hbWU6IHN0cmluZykge1xuICBwcm9ncmVzcyhmaWxlbmFtZSwgJy4uLiAnKTtcbiAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShmaWxlbmFtZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgY29uc3QgdHJhbnNmb3JtZWQgPSB0cmFuc2Zvcm1GaWxlQ29udGVudHMoZmlsZW5hbWUsIGNvbnRlbnRzLCBwcm9ncmVzcyk7XG4gIGF3YWl0IGZzLndyaXRlRmlsZShmaWxlbmFtZSwgdHJhbnNmb3JtZWQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gIHByb2dyZXNzKCcgRG9uZSFcXG4nKTtcblxuICBmdW5jdGlvbiBwcm9ncmVzcyguLi54OiBzdHJpbmdbXSkge1xuICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKHguam9pbignICcpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtRmlsZUNvbnRlbnRzKGZpbGVuYW1lOiBzdHJpbmcsIGNvbnRlbnRzOiBzdHJpbmcsIHByb2dyZXNzPzogTG9nRm4pIHtcbiAgY29uc3Qgc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgZmlsZW5hbWUsXG4gICAgY29udGVudHMsXG4gICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICB0cnVlIC8vIHNldFBhcmVudE5vZGVzLCBuZWVkIHRoaXMgZm9yIHRyZWUgYW5hbHlzaXNcbiAgKTtcblxuICAvLyBGaW5kIGFsbCB0b3AtbGV2ZWwgcmVxdWlyZXMgYW5kIHR1cm4gdGhlbSBpbnRvIGEgZnVuY3Rpb25cbiAgY29uc3QgdG9wTGV2ZWxBc3NpZ25tZW50cyA9IHNvdXJjZUZpbGUuc3RhdGVtZW50c1xuICAgIC5maWx0ZXIodHMuaXNWYXJpYWJsZVN0YXRlbWVudClcbiAgICAuZmlsdGVyKChzdG10KSA9PiBzdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxKVxuICAgIC5tYXAoKHN0bXQpID0+IFtzdG10LCBzdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF1dIGFzIGNvbnN0KTtcblxuICBwcm9ncmVzcz8uKGAke3RvcExldmVsQXNzaWdubWVudHMubGVuZ3RofSBkZWNsYXJhdGlvbnNgLCAnLi4uICcpO1xuXG4gIGNvbnN0IHRvcExldmVsUmVxdWlyZXMgPSB0b3BMZXZlbEFzc2lnbm1lbnRzXG4gICAgLmZsYXRNYXAoKFtzdG10LCBhXSkgPT4gYS5pbml0aWFsaXplciAmJiB0cy5pc0NhbGxFeHByZXNzaW9uKGEuaW5pdGlhbGl6ZXIpXG4gICAgICAmJiB0cy5pc0lkZW50aWZpZXIoYS5pbml0aWFsaXplci5leHByZXNzaW9uKSAmJiBhLmluaXRpYWxpemVyLmV4cHJlc3Npb24udGV4dCA9PT0gJ3JlcXVpcmUnXG4gICAgICAmJiB0cy5pc1N0cmluZ0xpdGVyYWwoYS5pbml0aWFsaXplci5hcmd1bWVudHNbMF0pXG4gICAgICAmJiB0cy5pc0lkZW50aWZpZXIoYS5uYW1lKVxuICAgICAgPyBbW3N0bXQsIGEubmFtZSwgYS5pbml0aWFsaXplci5hcmd1bWVudHNbMF0udGV4dF0gYXMgY29uc3RdIDogW10pO1xuXG4gIHByb2dyZXNzPy4oYCR7dG9wTGV2ZWxSZXF1aXJlcy5sZW5ndGh9IHJlcXVpcmVzYCwgJy4uLiAnKTtcblxuICBsZXQgZmlsZSA9IHNvdXJjZUZpbGU7XG5cbiAgZm9yIChjb25zdCBbc3RtdCwgYmluZGluZywgbW9kdWxlTmFtZV0gb2YgdG9wTGV2ZWxSZXF1aXJlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRzLnRyYW5zZm9ybShmaWxlLCBbKGN0eDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgICAgY29uc3QgZmFjdG9yeSA9IGN0eC5mYWN0b3J5O1xuICAgICAgY29uc3QgdmlzaXQ6IHRzLlZpc2l0b3IgPSBub2RlID0+IHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgc3RhdGVtZW50LCByZXBsYWNlIGl0IHdpdGggYSBmdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgICAgIGlmIChub2RlID09PSBzdG10KSB7XG4gICAgICAgICAgcmV0dXJuIGNyZWF0ZVZhcmlhYmxlKGZhY3RvcnksIGJpbmRpbmcsXG4gICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZUFycm93RnVuY3Rpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIFtdLCB1bmRlZmluZWQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgZmFjdG9yeS5jcmVhdGVCbG9jayhbXG4gICAgICAgICAgICAgICAgLy8gdG1wID0gcmVxdWlyZSguLi4pXG4gICAgICAgICAgICAgICAgY3JlYXRlVmFyaWFibGUoZmFjdG9yeSwgJ3RtcCcsIGZhY3RvcnkuY3JlYXRlQ2FsbEV4cHJlc3Npb24oZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKCdyZXF1aXJlJyksIFtdLCBbZmFjdG9yeS5jcmVhdGVTdHJpbmdMaXRlcmFsKG1vZHVsZU5hbWUpXSkpLFxuXG4gICAgICAgICAgICAgICAgLy8gPHRoaXNfZm4+ID0gKCkgPT4gdG1wXG4gICAgICAgICAgICAgICAgY3JlYXRlQXNzaWdubWVudChmYWN0b3J5LCBiaW5kaW5nLnRleHQsXG4gICAgICAgICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZUFycm93RnVuY3Rpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIFtdLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFjdG9yeS5jcmVhdGVJZGVudGlmaWVyKCd0bXAnKSkpLFxuXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRtcFxuICAgICAgICAgICAgICAgIGZhY3RvcnkuY3JlYXRlUmV0dXJuU3RhdGVtZW50KGZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcigndG1wJykpLFxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYSBzaG9ydGhhbmQgcHJvcGVydHkgYXNzaWdubWVudCBhbmQgd2Ugd2UgYXJlIHRoZSBpZGVudGlmaWVyIGluIGl0LCBzcGxpdCBpdCBpbnRvIHR3b1xuICAgICAgICBpZiAodHMuaXNTaG9ydGhhbmRQcm9wZXJ0eUFzc2lnbm1lbnQobm9kZSkgJiYgdHMuaXNJZGVudGlmaWVyKG5vZGUubmFtZSkgJiYgbm9kZS5uYW1lLnRleHQgPT09IGJpbmRpbmcudGV4dCkge1xuICAgICAgICAgIHJldHVybiBmYWN0b3J5LmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChub2RlLm5hbWUudGV4dCwgZmFjdG9yeS5jcmVhdGVDYWxsRXhwcmVzc2lvbihmYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoYmluZGluZy50ZXh0KSwgW10sIFtdKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHdhcyBhbiBpZGVudGlmaWVyIHJlZmVyZW5jaW5nIHRoZSBvcmlnaW5hbCByZXF1aXJlZCBtb2R1bGUsIHR1cm4gaXQgaW50byBhIGZ1bmN0aW9uIGNhbGxcbiAgICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQgPT09IGJpbmRpbmcudGV4dCkge1xuXG4gICAgICAgICAgLy8gSWdub3JlIHRoaXMgaWRlbnRpZmllciBpZiBpdCBpcyBub3QgaW4gUkhTIHBvc2l0aW9uXG4gICAgICAgICAgY29uc3QgaWdub3JlID0gbm9kZS5wYXJlbnQgJiYgKFxuICAgICAgICAgICAgKHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudC5uYW1lID09PSBub2RlKSAgLy8geyBpZGVudDogdmFsdWUgfVxuICAgICAgICAgICAgfHwgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudC5uYW1lID09PSBub2RlKSAvLyBvYmouaWRlbnQgPSAzO1xuICAgICAgICAgICAgfHwgdHMuaXNNZXRob2REZWNsYXJhdGlvbihub2RlLnBhcmVudCkgLy8gcHVibGljIGlkZW50KCkgeyAuLi4gfVxuICAgICAgICAgICAgfHwgdHMuaXNNZXRob2RTaWduYXR1cmUobm9kZS5wYXJlbnQpIC8vIGludGVyZmFjZSBYIHsgaWRlbnQoKTsgfVxuICAgICAgICAgICAgfHwgdHMuaXNQcm9wZXJ0eURlY2xhcmF0aW9uKG5vZGUucGFyZW50KSAvLyBjbGFzcyBYIHsgaWRlbnQ6IHN0cmluZyB9XG4gICAgICAgICAgICB8fCB0cy5pc1Byb3BlcnR5U2lnbmF0dXJlKG5vZGUucGFyZW50KSAvLyBpbnRlcmZhY2UgWCB7IGlkZW50OiBzdHJpbmcgfVxuICAgICAgICAgICAgfHwgdHMuaXNHZXRBY2Nlc3Nvcihub2RlLnBhcmVudCkgLy8gY2xhc3MgWCB7IGdldCBpZGVudCgpIHsgLi4uIH0gfVxuICAgICAgICAgICAgfHwgdHMuaXNHZXRBY2Nlc3NvckRlY2xhcmF0aW9uKG5vZGUucGFyZW50KSAvLyBpbnRlcmZhY2UgWCB7IGdldCBpZGVudDogc3RyaW5nIH1cbiAgICAgICAgICAgIHx8IHRzLmlzU2V0QWNjZXNzb3Iobm9kZS5wYXJlbnQpIC8vIGNsYXNzIFggeyBzZXQgaWRlbnQoKSB7IC4uLiB9IH1cbiAgICAgICAgICAgIHx8IHRzLmlzU2V0QWNjZXNzb3JEZWNsYXJhdGlvbihub2RlLnBhcmVudCkgLy8gaW50ZXJmYWNlIFggeyBzZXQgaWRlbnQ6IHN0cmluZyB9XG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBXZSBzaG91bGQgYWxzbyBpZ25vcmUgdGhpcyBpZGVudGlmaWVyIGlmIGl0IGlzIHNoYWRvd2VkXG4gICAgICAgICAgLy8gTW9yZSBwbGFjZXMgYXJlIGFsc28gbm90IFJIUyBidXQgaWYgd2UgbGVhdmUgdGhvc2UsIGl0J2xsIGJsb3cgdXAgc3ludGFjdGljYWxseSBhbmQgdGhhdCdzIGdvb2RcblxuICAgICAgICAgIGlmICghaWdub3JlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeS5jcmVhdGVDYWxsRXhwcmVzc2lvbihmYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoYmluZGluZy50ZXh0KSwgW10sIFtdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgY2hpbGQgPT4gdmlzaXQoY2hpbGQpLCBjdHgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChzZjogdHMuU291cmNlRmlsZSkgPT4gdHMudmlzaXROb2RlKHNmLCB2aXNpdCwgdHMuaXNTb3VyY2VGaWxlKSA/PyBzZjtcbiAgICB9XSk7XG5cbiAgICBmaWxlID0gcmVzdWx0LnRyYW5zZm9ybWVkWzBdO1xuICAgIHByb2dyZXNzPy4oJ1gnKTtcbiAgfVxuXG4gIC8vIFJlcGxhY2UgX19leHBvcnRTdGFyXG5cbiAgZmlsZSA9IHRzLnRyYW5zZm9ybShmaWxlLCBbKGN0eDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIGNvbnN0IGZhY3RvcnkgPSBjdHguZmFjdG9yeTtcbiAgICBjb25zdCB2aXNpdDogdHMuVmlzaXRvciA9IG5vZGUgPT4ge1xuICAgICAgaWYgKG5vZGUucGFyZW50ICYmIHRzLmlzU291cmNlRmlsZShub2RlLnBhcmVudClcbiAgICAgICAgJiYgdHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpXG4gICAgICAgICYmIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKVxuICAgICAgICAmJiB0cy5pc0lkZW50aWZpZXIobm9kZS5leHByZXNzaW9uLmV4cHJlc3Npb24pXG4gICAgICAgICYmIG5vZGUuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09ICdfX2V4cG9ydFN0YXInXG4gICAgICAgICYmIG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHMubGVuZ3RoID09PSAyXG4gICAgICAgICYmIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXSlcbiAgICAgICAgJiYgdHMuaXNJZGVudGlmaWVyKG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF0uZXhwcmVzc2lvbilcbiAgICAgICAgJiYgbm9kZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXS5leHByZXNzaW9uLnRleHQgPT09ICdyZXF1aXJlJ1xuICAgICAgICAmJiB0cy5pc1N0cmluZ0xpdGVyYWwobm9kZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXS5hcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgLy8gX19leHBvcnRTdGFyKHJlcXVpcmUoJ3NvbWV0aGluZycpLCBleHBvcnRzKTtcblxuICAgICAgICBjb25zdCByZXF1aXJlZE1vZHVsZSA9IG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF0uYXJndW1lbnRzWzBdLnRleHQ7XG5cbiAgICAgICAgY29uc3QgZmlsZSA9IHJlcXVpcmUucmVzb2x2ZShyZXF1aXJlZE1vZHVsZSwgeyBwYXRoczogW3BhdGguZGlybmFtZShmaWxlbmFtZSldIH0pO1xuICAgICAgICAvLyBGSVhNRTogU2hvdWxkIHByb2JhYmx5IGRvIHRoaXMgaW4gYSBzdWJwcm9jZXNzXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUoZmlsZSk7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3Qua2V5cyhtb2R1bGUpO1xuXG4gICAgICAgIHJldHVybiBlbnRyaWVzLm1hcCgoZW50cnkpID0+XG4gICAgICAgICAgZmFjdG9yeS5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KGZhY3RvcnkuY3JlYXRlQ2FsbEV4cHJlc3Npb24oXG4gICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZVByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihmYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoJ09iamVjdCcpLCBmYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoJ2RlZmluZVByb3BlcnR5JykpLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZUlkZW50aWZpZXIoJ2V4cG9ydHMnKSxcbiAgICAgICAgICAgICAgZmFjdG9yeS5jcmVhdGVTdHJpbmdMaXRlcmFsKGVudHJ5KSxcbiAgICAgICAgICAgICAgZmFjdG9yeS5jcmVhdGVPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihbXG4gICAgICAgICAgICAgICAgZmFjdG9yeS5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ2NvbmZpZ3VyYWJsZScsIGZhY3RvcnkuY3JlYXRlVHJ1ZSgpKSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgnZ2V0JyxcbiAgICAgICAgICAgICAgICAgIGZhY3RvcnkuY3JlYXRlQXJyb3dGdW5jdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZVByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihcbiAgICAgICAgICAgICAgICAgICAgICBmYWN0b3J5LmNyZWF0ZUNhbGxFeHByZXNzaW9uKGZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcigncmVxdWlyZScpLCB1bmRlZmluZWQsIFtmYWN0b3J5LmNyZWF0ZVN0cmluZ0xpdGVyYWwocmVxdWlyZWRNb2R1bGUpXSksXG4gICAgICAgICAgICAgICAgICAgICAgZW50cnkpKSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBdXG4gICAgICAgICAgKSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgY2hpbGQgPT4gdmlzaXQoY2hpbGQpLCBjdHgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB0cy52aXNpdE5vZGUoc2YsIHZpc2l0LCB0cy5pc1NvdXJjZUZpbGUpID8/IHNmO1xuICB9XSkudHJhbnNmb3JtZWRbMF07XG5cblxuXG4gIC8vIFRvIHByaW50IHRoZSBBU1QsIHdlJ2xsIHVzZSBUeXBlU2NyaXB0J3MgcHJpbnRlclxuICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xuXG4gIHJldHVybiBwcmludGVyLnByaW50RmlsZShmaWxlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFyaWFibGUoZmFjdG9yeTogdHMuTm9kZUZhY3RvcnksIG5hbWU6IHN0cmluZyB8IHRzLkJpbmRpbmdOYW1lLCBleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKSB7XG4gIHJldHVybiBmYWN0b3J5LmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KFtdLFxuICAgIGZhY3RvcnkuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoW1xuICAgICAgZmFjdG9yeS5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uKG5hbWUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBleHByZXNzaW9uKSxcbiAgICBdKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbm1lbnQoZmFjdG9yeTogdHMuTm9kZUZhY3RvcnksIG5hbWU6IHN0cmluZywgZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbikge1xuICByZXR1cm4gZmFjdG9yeS5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KFxuICAgIGZhY3RvcnkuY3JlYXRlQmluYXJ5RXhwcmVzc2lvbihcbiAgICAgIGZhY3RvcnkuY3JlYXRlSWRlbnRpZmllcihuYW1lKSxcbiAgICAgIHRzLlN5bnRheEtpbmQuRXF1YWxzVG9rZW4sXG4gICAgICBleHByZXNzaW9uKSk7XG59Il19