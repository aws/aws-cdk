//
// This rule ensures that the `@aws-cdk/core.Construct` class is always
// imported at the end, and in a separate section. In the `v2-main` branch,
// this class is removed and so is the import. Keeping it in a separate line
// and section ensures that any other adjustments to the import do not cause
// conflicts on forward merges.
//

import { ImportDeclaration } from 'estree';
import { Rule } from 'eslint';

interface ImportOrderViolation {
  node: ImportDeclaration;
  localName: string;
  range: [number, number];
}

let importOrderViolation: ImportOrderViolation | undefined;
let coreConstructImportLine: ImportDeclaration | undefined;
let lastImport: Rule.Node | undefined;

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    Program: _ => {
      // reset for every file
      importOrderViolation = undefined;
      coreConstructImportLine = undefined;
      lastImport = undefined;
    },

    // collect all "import" statements. we will later use them to determine
    // exactly how to import `core.Construct`.
    ImportDeclaration: node => {
      lastImport = node;

      if (coreConstructImportLine && coreConstructImportLine.range) {
        // If CoreConstruct import was previously seen, this import line should not succeed it.

        importOrderViolation = {
          node: coreConstructImportLine,
          range: coreConstructImportLine.range,
          localName: coreConstructImportLine.specifiers[0].local.name,
        };
      }

      for (const [i, s] of node.specifiers.entries()) {
        const isConstruct = (s.local.name === 'CoreConstruct' || s.local.name === 'Construct') && node.source.value === '@aws-cdk/core';
        if (isConstruct && s.range) {
          if (node.specifiers.length > 1) {
            // if there is more than one specifier on the line that also imports CoreConstruct, i.e.,
            // `import { Resource, Construct as CoreConstruct, Token } from '@aws-cdk/core'`

            // If this is the last specifier, delete just that. If not, delete until the beginning of the next specifier.
            const range: [number, number] = (i === node.specifiers.length - 1) ? s.range : [s.range[0], node.specifiers[i + 1].range![0]];
            importOrderViolation = { node, range, localName: s.local.name };
          } else {
            // This means that CoreConstruct is the only import within this line,
            // so record the node so the whole line can be removed if there are imports that follow

            coreConstructImportLine = node;
          }
        }
      }
    },

    Identifier: node => {
      if (
        node.parent.type !== 'ImportSpecifier' && 
        (node.name === 'CoreConstruct' || node.name === 'Construct') &&
        importOrderViolation
      ) {
        reportImportOrderViolations(context);
      }
    },
  }
}

function reportImportOrderViolations(context: Rule.RuleContext) {
  if (importOrderViolation && lastImport) {
    const violation = importOrderViolation;
    const _lastImport = lastImport;
    context.report({
      message: 'To avoid merge conflicts with the v2 branch, import of "@aws-cdk/core.Construct" must be in its own line, '
        + 'and as the very last import.',
      node: violation.node,
      fix: fixer => {
        const fixes: Rule.Fix[] = [];
        fixes.push(fixer.removeRange(violation.range));
        const sym = violation.localName === 'Construct' ? 'Construct' : 'Construct as CoreConstruct'
        const addImport = `import { ${sym} } from '@aws-cdk/core';`;
        fixes.push(fixer.insertTextAfter(_lastImport, [
          "",
          "",
          "// keep this import separate from other imports to reduce chance for merge conflicts with v2-main",
          "// eslint-disable-next-line no-duplicate-imports, import/order",
          addImport,
        ].join('\n')));
        return fixes;
      }
    });
    // reset, so that this is reported only once
    importOrderViolation = undefined;
  }
}