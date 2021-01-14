import { Rule } from 'eslint';
import { ImportCache, Node } from '../private/import-cache';

let importCache: ImportCache;
let importsFixed: boolean;

const BANNED_TYPES = [ 'IConstruct', 'Construct' ];

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {

    Program: ()  => {
      if (!isTestFile(context.getFilename())) {
        return;
      }
      importCache = new ImportCache();
      importsFixed = false;
    },

    ImportDeclaration: node => {
      if (!isTestFile(context.getFilename())) {
        return;
      }

      if (node.source.value === '@aws-cdk/core') {
        node.specifiers.forEach((s: any) => {
          if (s.type === 'ImportSpecifier' && BANNED_TYPES.includes(s.imported.name)) {
            // named import
            importCache.record({
              fileName: context.getFilename(),
              typeName: s.imported.name,
              importNode: node,
              localName: s.local.name
            });
          } else if (s.type === 'ImportNamespaceSpecifier') {
            // barrel import
            BANNED_TYPES.forEach(typeName => {
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

    Identifier(node: any) {
      if (!isTestFile(context.getFilename())) {
        return;
      }
      // Only apply rule to bindings (variables and function parameters)

      const typeAnnotation = node.typeAnnotation?.typeAnnotation
      if (!typeAnnotation) {
        return;
      }
      const type = typeAnnotation.typeName;
      if (!type) { return; }

      const message = 'Use Construct and IConstruct from the "constructs" module in variable declarations (not "@aws-cdk/core")';

      if (type.type === 'TSQualifiedName') {
        // barrel import
        const qualifier = type.left.name;
        const typename = type.right.name;
        const importNode = findImportNode(`${qualifier}.${typename}`);
        if (!importNode) {
          return;
        }
        context.report({
          node,
          message,
          fix: (fixer: Rule.RuleFixer) => {
            const fixes: Rule.Fix[] = [];
            if (!importsFixed) {
              fixes.push(fixer.insertTextAfter(importNode, "\nimport * as constructs from 'constructs';"));
              importsFixed = true;
            }
            fixes.push(fixer.replaceTextRange(typeAnnotation.range, `constructs.${typename}`));
            return fixes;
          }
        });
      } else if (type.type === 'Identifier') {
        // named imports
        const importNode = findImportNode(type.name);
        if (!importNode) {
          return;
        }
        context.report({
          node,
          message,
          fix: (fixer: Rule.RuleFixer) => {
            const fixes: Rule.Fix[] = [];
            if (!importsFixed) {
              const typesToImport = BANNED_TYPES.map(typeName => {
                const val = importCache.find({ fileName: context.getFilename(), typeName });
                if (!val) { return undefined; }
                if (typeName === val.localName) { return typeName; }
                return `${typeName} as ${val.localName}`;
              }).filter(x => x !== undefined);
              fixes.push(fixer.insertTextAfter(importNode, `\nimport { ${typesToImport.join(', ')} } from 'constructs';`));

              const specifiers = importNode.specifiers;
              if (specifiers.length === typesToImport.length) {
                fixes.push(fixer.removeRange(importNode.range));
              } else {
                for (let i = 0; i < specifiers.length; i++) {
                  const s = specifiers[i];
                  if (typesToImport.includes(s.imported.name)) {
                    if (i === specifiers.length - 1) {
                      fixes.push(fixer.removeRange([s.range[0] - 2, s.range[1]])); // include the leading comma
                    } else {
                      fixes.push(fixer.removeRange([s.range[0], s.range[1] + 2])); // include the trailing comma
                    }
                  }
                }
              }
              importsFixed = true;
            }
            return fixes;
          }
        });
      } else {
        return;
      }

      function findImportNode(localName: string): Node | undefined {
        return BANNED_TYPES.map(typeName => {
          const val = importCache.find({ fileName: context.getFilename(), typeName });
          if (val && val.localName === localName) {
            return val.importNode;
          }
          return undefined;
        }).find(x => x !== undefined);
      }
    },
  }
}

function isTestFile(filename: string) {
  return new RegExp(/\/test\//).test(filename);
}