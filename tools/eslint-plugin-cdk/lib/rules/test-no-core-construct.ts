import { Rule } from 'eslint';
import { RecordCache } from '../private/record-cache';

// see comment later on why the type here is 'any'
type Node = any;

interface ImportCacheKey {
  readonly fileName: string;
  readonly importName: string;
}

let importCache: RecordCache<ImportCacheKey, Node>;
let importsFixed: boolean;

const BANNED_TYPES = [ 'IConstruct', 'Construct' ];

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {

    // `node` is a type from @typescript-eslint/typescript-estree, but using 'any' for now
    // since it's incompatible with eslint.Rule namespace. Waiting for better compatibility in
    // https://github.com/typescript-eslint/typescript-eslint/tree/1765a178e456b152bd48192eb5db7e8541e2adf2/packages/experimental-utils#note
    // Meanwhile, use a debugger to explore the AST node.

    Program(_node: any) {
      if (!isTestFile(context.getFilename())) {
        return;
      }
      importCache = new RecordCache();
      importsFixed = false;
    },

    ImportDeclaration(node: any) {
      if (!isTestFile(context.getFilename())) {
        return;
      }
      if (node.source.value === '@aws-cdk/core') {
        node.specifiers.forEach((s: any) => {
          if (s.type === 'ImportSpecifier' && BANNED_TYPES.includes(s.imported.name)) {
            // named import
            importCache.pushRecord({ fileName: context.getFilename(), importName: s.imported.name }, node);
          } else if (s.type === 'ImportNamespaceSpecifier') {
            // barrel import
            BANNED_TYPES.forEach(typename => {
              importCache.pushRecord({ fileName: context.getFilename(), importName: `${s.local.name}.${typename}` }, node);
            });
          }
        });
      }
    },

    Identifier(node: any) {
      if (!isTestFile(context.getFilename())) {
        return;
      }
      if (!node.typeAnnotation?.typeAnnotation) {
        return;
      }
      const type = node.typeAnnotation.typeAnnotation.typeName;
      if (!type) { return; }
      if (type.type === 'TSQualifiedName') {
        // barrel import
        const qualifier = type.left.name;
        const typename = type.right.name;
        const key: ImportCacheKey = { fileName: context.getFilename(), importName: `${qualifier}.${typename}` };
        const importNode = importCache.getRecord(key);
        if (!importNode) {
          return;
        }
        context.report({
          node,
          message: 'avoid Construct and IConstruct from "@aws-cdk/core"',
          fix: (fixer: Rule.RuleFixer) => {
            const fixes: Rule.Fix[] = [];
            if (!importsFixed) {
              fixes.push(fixer.insertTextAfter(importNode, "\nimport * as constructs from 'constructs';"));
              importsFixed = true;
            }
            fixes.push(fixer.replaceTextRange(node.typeAnnotation.typeAnnotation.range, `constructs.${typename}`));
            return fixes;
          }
        });
      } else if (type.type === 'Identifier') {
        // named imports
        const typename = type.name;
        const importNode = importCache.getRecord({ fileName: context.getFilename(), importName: typename });
        if (!importNode) {
          return;
        }
        context.report({
          node,
          message: 'avoid Construct and IConstruct from "@aws-cdk/core"',
          fix: (fixer: Rule.RuleFixer) => {
            const fixes: Rule.Fix[] = [];
            if (!importsFixed) {
              const typesToImport = BANNED_TYPES.filter(t => {
                return importCache.getRecord({ fileName: context.getFilename(), importName: t });
              });
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
    },
  }
}

function isTestFile(filename: string) {
  const isJestTest = new RegExp(/\/test\/.*test\.ts$/).test(filename);;
  const isNodeUnitTest = new RegExp(/\/test\/.*test\.[^/]+\.ts$/).test(filename);
  const isIntegTest = new RegExp(/\/test\/.*integ\.[^/]+\.ts$/).test(filename);
  return isJestTest || isNodeUnitTest || isIntegTest;
}