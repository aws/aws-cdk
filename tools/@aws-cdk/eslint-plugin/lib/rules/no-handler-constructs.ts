import { Rule } from 'eslint';
import { ImportCache } from '../private/import-cache';

let importCache: ImportCache;

const BANNED_TYPES = {
  'aws-cdk-lib/aws-lambda': [ 'Function', 'SingletonFunction' ],
  'aws-cdk-lib/custom-resources': [ 'CustomResourceProvider' ],
};

export function create(context: Rule.RuleContext): Rule.NodeListener {
  function isConstructionBanned(node: any, importCache: ImportCache) {
    return importCache.imports.find((bannedItem) => {
      const localName = node.name ?? `${node.object.name}.${node.property.name}`;
      return bannedItem.localName === localName
    });
  }

  return {

    Program(_node: any) {
      importCache = new ImportCache();
    },

    ImportDeclaration(node: any) {
      if (Object.keys(BANNED_TYPES).includes(node.source.value)) {
        // @ts-ignore
        const localBannedTypes = BANNED_TYPES[node.source.value];
        node.specifiers.forEach((s: any) => {
          if (s.type === 'ImportSpecifier' && localBannedTypes.includes(s.imported.name)) {
            importCache.record({
              fileName: context.getFilename(),
              typeName: s.imported.name,
              importNode: node,
              localName: s.local.name
            });
          } else if (s.type === 'ImportNamespaceSpecifier') {
            // barrel import
            localBannedTypes.forEach((typeName: string) => {
              importCache.record({
                fileName: context.getFilename(),
                typeName,
                importNode: node,
                localName: `${s.local.name}.${typeName}`
              });
            });
          }
        });
      }
    },

    NewExpression(node: any) {
      const importNode = isConstructionBanned(node.callee, importCache);
      if (importNode) {
        context.report({
          message: `Construction of type ${importNode.typeName} from ${importNode.importNode.source.value} is not allowed. Please generate a handler construct using @aws-cdk/handler-framework.`,
          node: node,
        });
      }
    },
  };
}
