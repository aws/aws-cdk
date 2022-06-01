/**
 * Prevent the use of `__dirname` in non-generated library sources
 *
 * The reason we can't indiscriminately use this is because we want to able to bundle
 * libraries into a single source file, which might change the value of `__dirname`.
 *
 * Instead, we have to use a mechanism we can hook into.
 */
import { Rule } from 'eslint';

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    Identifier(node) {
      if (isTestFile(context.getFilename()) || isGeneratedFile(context.getFilename())) {
        return;
      }

      if (node.name === '__dirname') {
        context.report({
          node,
          message: 'Do not use __dirname, build a path relative to moduleDir() instead.',
        });
      }
    },
  }
}

function isTestFile(filename: string) {
  return /\/test\//.test(filename);
}

function isGeneratedFile(filename: string) {
  return /generated\./.test(filename);
}
