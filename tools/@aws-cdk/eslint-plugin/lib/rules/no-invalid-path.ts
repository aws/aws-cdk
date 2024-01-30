import { Rule } from 'eslint';
import { isProdFile } from '../private/is-prod-file';
import * as path from 'path';
import * as fs from 'fs';

function isPathJoinFuncCall(node: any): boolean {
  return node.callee?.property?.name === 'join';
}

function noArgumentVariables(node: any): boolean {
  // Outside of the first argument, all arguments should be strings
  const components = node.arguments.slice(1);
  return components.every((a: any) => a.value !== undefined);
}

function hasSlashes(args: string[]): boolean {
  return args.some((a) => a.includes('/'));
}

function firstArgIsDirname(node: any): boolean {
  return node.arguments[0].name && node.arguments[0].name === '__dirname';
}

function argumentList(node: any): string[] {
  // Already confirmed that first argument is '__dirname', so can safely remove it
  const args: string[] = node.arguments.slice(1).map((a: any) => { return a.value; });
  return args;
}

function recreatePath(args: string[]): string {
  return `path.join(__dirname, '${args.join('\', \'')}')`;
}

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    CallExpression(node: any) {
      if (!isProdFile(context.getFilename())) {
        return;
      }

      if (isPathJoinFuncCall(node)) {
        if (node.arguments.length === 0) {
          // ERROR: this is 'path.join()'
          context.report({ node, message: '\'path.join()\' is not a valid path. You must specify arguments into the function.'})
          return;
        }

        if (!noArgumentVariables(node)) {
          // WARNING: unexpected non-string in the argument list. This happens if part of the argument list is a variable, i.e. `path.join(__dirname, myPath)`.
          // We may be able to do something about this, but we currently are just going to let it pass.
          return;
        }

        // We currently do not lint any path.join without '__dirname' as the first argument
        if (!firstArgIsDirname(node)) {
          return;
        }

        const args = argumentList(node);

        if (hasSlashes(args)) {
          // ERROR: This path looks like 'path.join(__dirname, 'a/b')' and should be changed to 'path.join(__dirname, 'a', 'b')'
          context.report({ node, message: `${recreatePath(args)} is not a valid path. It has '/' in the arguments which is not allowed. Each directory should be its own separate argument.`});
          return;
        }

        const firstDownDir = args.findIndex((p) => p !== '..');

        // Confirm path does not have any unnecessary '..' paths
        // This allows us to validate subsequent checks
        if (firstDownDir > 0 && args.some((p, i) => p === '..' && i > firstDownDir)) {
          // ERROR: This path oscillates between up and down commands
          context.report({ node, message: `${recreatePath(args)} is not a valid path. It goes backwards and forwards and backwards again, and can be simplified.`});
          return;
        }

        // Exclude the case where there are no '..' at all in the path -- those are never invalid
        const currentFile = context.getFilename();
        if (firstDownDir > 0) {
          for (let i = 0; i < firstDownDir; i++) {
            const pjFile = path.join(...[path.dirname(currentFile), ...args.slice(0, i), 'package.json']);
            if (fs.existsSync(pjFile)) {
              // ERROR: this path will end up going out of the package.json directory
              context.report({ node, message: `${recreatePath(args)} is not a valid path. It goes beyond the parent library's package.json file so the file it points to will not be available after the library is packaged.`});
              return;
            }
          }
        }
      }
    }
  }
}
