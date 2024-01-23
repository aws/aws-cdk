import { Rule } from 'eslint';
import { isProdFile } from '../private/is-prod-file';
import * as path from 'path';
import * as fs from 'fs';

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    CallExpression(node: any) {
      if (!isProdFile(context.getFilename())) {
        return;
      }

      if (node.callee.property.name === 'join' && node.arguments.length > 1 && node.arguments[0].name === '__dirname') {
        // Confirm path does not have unnecessary '..'
        const pathToParentDir = '..';
        const paths: string[] = [];
        let forward = false; // Determines if the path is officially going forward
        let validPath = true;
        for (let i=1; i<node.arguments.length; i++) {
          const path = node.arguments[i].value;
          // If path is going forward, we cannot have '..' anymore
          if (forward && path === pathToParentDir) {
            validPath = false;
            // I could break here but then I can't build the simulated path for the error message,
            // and in practice this should be a trivial amount of extra work.
          }
          if (path !== pathToParentDir) {
            forward = true;
          }
          paths.push(node.arguments[i].value);
        }

        if (!validPath) {
          const simulatedPath = `path.join(__dirname, '${paths.join('\', \'')}')`;
          context.report({ node, message: `${simulatedPath} is not a valid path. It goes backwards and forwards and backwards again, and can be simplified.`});
          return;
        }

        // Confirm path does not go back outside of a directory with package.json
        let currentDirPointer = path.dirname(context.getFilename());
        let reachedPackageJson = false;
        let j = 0;
        while (paths[j] === pathToParentDir) {
          // Move up one directory to simulate '..'
          currentDirPointer = path.dirname(currentDirPointer);

          if (reachedPackageJson) {
            validPath = false;
            break;
          }
          // Check if current directory has a package.json.
          // If so, we cannot have another parentDir symbol
          if (fs.existsSync(path.join(currentDirPointer, 'package.json'))) {
            reachedPackageJson = true;
          }

          j+=1;
        }
        
        if (!validPath) {
          const simulatedPath = `path.join(__dirname, '${paths.join('\', \'')}')`;
          context.report({ node, message: `${simulatedPath} is not a valid path. It goes beyond the parent library's package.json file so the file it points to will not be available after the library is packaged.`});
          return;
        }
      }
    }
  }
}
