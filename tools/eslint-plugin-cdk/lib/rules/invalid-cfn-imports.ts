import { Rule } from 'eslint';
import { Identifier, ImportSpecifier } from 'estree';
import * as fs from 'fs-extra';
import * as path from 'path';

let namespaceImports: {
  [key: string]: string
} = {};

export function create(context: Rule.RuleContext): Rule.NodeListener {
  const filename = context.getFilename();
  if (!inAlphaPackage(filename) && !filename.match('test/rules/fixtures')) {
    // The format of Cfn imports only matters for alpha modules, so that they can be
    // formatted correctly when released separately for V2.
    return {};
  }

  return {
    ImportDeclaration: node => {
      const moduleSpecifier = node.source.value as string;
      // Store all of the 'import * as name from location' imports, so that we can check the location when
      // we find name.CfnXXX references.
      node.specifiers.forEach(e => {
        if (e.type === 'ImportNamespaceSpecifier') {
          namespaceImports[e.local.name] = moduleSpecifier;
        }
      });

      if (moduleSpecifier.endsWith('generated')) {
        return;
      }

      const cfnImports: ImportSpecifier[] = [];
      const otherImports: ImportSpecifier[] = [];
      node.specifiers.forEach(e => {
        if (e.type === 'ImportSpecifier') {
          if (e.imported.name.startsWith('Cfn')) {
            cfnImports.push(e);
          } else {
            otherImports.push(e);
          }
        }
      });

      if (cfnImports.length > 0 && otherImports.length > 0 && moduleSpecifier.startsWith('.')) {
        // import { CfnXXX, SomethingElse, AnotherThing } from './some/relative/path/not/ending/in/generated';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental modules, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '` , and imported from its specific .generated location.',
          node: node,
        });
      } else if (cfnImports.length > 0 && moduleSpecifier.startsWith('.')) {
        // import { CfnXXX } from './some/relative/path/not/ending/in/generated';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental modules, import of `' + cfnImports.map(e => e.imported.name).join(', ') + 'must be imported from its specific .generated location.',
          node: node,
        });
      } else if (cfnImports.length > 0 && otherImports.length > 0 && checkIfImportedLocationIsAnAlphaPackage(moduleSpecifier)) {
        // import { CfnXXX, SomethingElse, AnotherThing } from '@aws-cdk/another-alpha-module';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental modules, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '`',
          node: node,
        });
      }
    },

    // This captures using `xxx.CfnConstruct` as an identifier
    Identifier: node => {
      const typeAnnotation = (node as any).typeAnnotation?.typeAnnotation;
      const type = typeAnnotation?.typeName;
      if (type?.type === 'TSQualifiedName') {
        const result = checkLeftAndRightForCfn(type);
        if (result) {
          reportErrorIfImportedLocationIsNotValid(context, node, result.name, result.location);
        }
      }
      if (node.name.startsWith('Cfn') && node.parent.type === 'MemberExpression' && node.parent.object.type === 'Identifier') {
        // new xxx.CfnConstruct();
        reportErrorIfImportedLocationIsNotValid(context, node, node.name, node.parent.object.name);
      }
    },
  };
}

function reportErrorIfImportedLocationIsNotValid(context: Rule.RuleContext, node: Identifier, name: string, location: string) {
  const moduleSpecifier = namespaceImports[location];
  if (moduleSpecifier.endsWith('generated')) {
    return;
  }
  if (moduleSpecifier.startsWith('.')) {
    // import * as name from './some/relative/path/not/ending/in/generated'; name.CfnConstruct();
    context.report({
      message: 'To allow rewriting imports when generating v2 experimental modules, `' + name + '` must be imported by name from its specific .generated location. Original identifier: ' + location + ' actual original location: ' + moduleSpecifier,
      node: node,
    });
  } else if (checkIfImportedLocationIsAnAlphaPackage(moduleSpecifier)) {
    // import * as name from '@aws-cdk/another-alpha-module'; name.CfnConstruct();
    context.report({
      message: 'To allow rewriting imports when generating v2 experimental modules, `' + name + '` must be imported by name and separate from non-L1 imports, since it is being imported from an experimental package: ' + moduleSpecifier + '. Original identifier: ' + location,
      node: node,
    });
  }
}

function checkIfImportedLocationIsAnAlphaPackage(_moduleName: string): boolean {
  // TODO
  return true;
}

function inAlphaPackage(filename: string): boolean {
  const filenameSplit = filename.split('/');
  const awsCdkNamespaceIndex = filenameSplit.findIndex(e => e.match('@aws-cdk'));
  if (awsCdkNamespaceIndex !== -1) {
    const moduleDir = filenameSplit.slice(0, awsCdkNamespaceIndex + 2).join('/');
    const pkg = JSON.parse(fs.readFileSync(path.join(moduleDir, 'package.json'), { encoding: 'utf-8' }));

    const separateModule = pkg['separate-module'];
    if (separateModule !== undefined) {
      return separateModule;
    }

    const maturity = pkg.maturity;
    if (maturity !== 'experimental' && maturity !== 'developer-preview') {
      return false;
    }
    // we're only interested in '@aws-cdk/' packages,
    // and those that are JSII-enabled (so no @aws-cdk/assert)
    return pkg.name.startsWith('@aws-cdk/') && !!pkg['jsii'];
  }
  return false;
}

function checkLeftAndRightForCfn(node: any): { name: string, location: string } | undefined {
  // Checking the left and right allows capturing the CfnConstruct name even if the TSQualifiedName references a subtype like:
  //    xxx.CfnConstruct.subtype
  //    xxx.CfnConstruct.subtype.anothersubtype
  if (!node) {
    return undefined;
  }
  if (node.name?.startsWith('Cfn')) {
    return {
      name: node.name,
      location: node.parent.left.name,
    };
  }

  const right = checkLeftAndRightForCfn(node.right);
  const left = checkLeftAndRightForCfn(node.left);

  return right ?? left ?? undefined;
}