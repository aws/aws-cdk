import { Rule } from 'eslint';
import { isProdFile } from '../private/is-prod-file';

export const meta = {
  messages: {
    hardcodedArn: 'There are more partitions than just \'aws\'. Silence this message if you are sure this is safe, or switch to using \'Aws.PARTITION\'',
  },
};

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {

    // `node` is a type from @typescript-eslint/typescript-estree, but using 'any' for now
    // since it's incompatible with eslint.Rule namespace. Waiting for better compatibility in
    // https://github.com/typescript-eslint/typescript-eslint/tree/1765a178e456b152bd48192eb5db7e8541e2adf2/packages/experimental-utils#note
    // Meanwhile, use a debugger to explore the AST node.

    Literal(node: any) {
      if (!isProdFile(context.getFilename())) {
        return;
      }

      if (typeof node.value === 'string' && node.value.includes('arn:aws:')) {
        context.report({ node, messageId: 'hardcodedArn' });
      }
    },

    TemplateLiteral(node: any) {
      if (!isProdFile(context.getFilename())) {
        return;
      }
      for (const quasi of node.quasis) {
        const value = quasi.value.cooked;

        if (typeof value === 'string' && value.includes('arn:aws:')) {
          context.report({ node: quasi, messageId: 'hardcodedArn' });
        }
      }
    }
  }
}
