import { Rule } from 'eslint';
import { ImportSpecifier } from 'estree';

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    ImportDeclaration: node => {
      const moduleSpecifier = node.source.value as string;
      if (moduleSpecifier.endsWith('generated') || moduleSpecifier.match('aws-cdk')) {
        return;
      }
      const cfnImports: { importSpecifier: ImportSpecifier, range?: [number, number] }[] = [];
      node.specifiers.forEach(e => {
        if (e.type === 'ImportSpecifier') {
          if (e.imported.name.startsWith('Cfn')) {
            cfnImports.push({
              importSpecifier: e,
              range: e.range
            });
          }
        }
      });

      if (cfnImports.length > 0) {
        context.report({
          message: 'To allow rewriting imports for generating v2 experimental modules, import of `' + cfnImports.map(e => e.importSpecifier.imported.name).join(',') + '` must be separate from non-L1 imports, and imported from its specific .generated location.',
          node: node,
        })
      }
    },
  };
} 