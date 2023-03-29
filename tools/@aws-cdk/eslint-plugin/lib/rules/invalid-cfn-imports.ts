import { Rule } from 'eslint';
import { Identifier, ImportSpecifier } from 'estree';
import * as fs from 'fs-extra';
import * as path from 'path';

let namespaceImports: {
  [key: string]: string
} = {};

export function create(context: Rule.RuleContext): Rule.NodeListener {
  // The format of Cfn imports only matters for alpha packages, so that they can be
  // formatted correctly when released separately for V2. The linter rule should only be
  // applied if the file is in an alpha package, or it is a test file.
  const filename = context.getFilename();
  if (!currentFileIsInAlphaPackage(filename) && !filename.match('test/rules/fixtures')) {
    return {};
  }

  return {
    ImportDeclaration: node => {
      const location = node.source.value as string;
      // Store all of the 'import * as name from location' imports, so that we can check the location when
      // we find name.CfnXXX references.
      node.specifiers.forEach(e => {
        if (e.type === 'ImportNamespaceSpecifier') {
          namespaceImports[e.local.name] = location;
        }
      });

      if (location.endsWith('generated') || location === '@aws-cdk/core') {
        // If importing directly from a generated file, this is fine. Also we know that aws-cdk/core is not experimental, so that is fine as well. 
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

      if (cfnImports.length > 0 && otherImports.length > 0 && location.startsWith('.')) {
        // import { CfnXXX, SomethingElse, AnotherThing } from './some/relative/path/not/ending/in/generated';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '`, and imported from its specific .generated location.',
          node: node,
        });
      } else if (cfnImports.length > 0 && location.startsWith('.')) {
        // import { CfnXXX } from './some/relative/path/not/ending/in/generated';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be imported from its specific .generated location.',
          node: node,
        });
      } else if (cfnImports.length > 0 && otherImports.length > 0 && checkIfImportedLocationIsAnAlphaPackage(location, context.getFilename())) {
        // import { CfnXXX, SomethingElse, AnotherThing } from '@aws-cdk/another-alpha-package';
        context.report({
          message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '`',
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

function reportErrorIfImportedLocationIsNotValid(context: Rule.RuleContext, node: Identifier, name: string, barrelImportName: string) {
  const location = namespaceImports[barrelImportName];
  if (!location) {
    // This scenario should not happen, but if it does, we don't want users to run into weird runtime errors from the linter.
    return;
  }
  if (location.endsWith('generated') || location === '@aws-cdk/core') {
    return;
  }
  if (location.startsWith('.')) {
    // import * as name from './some/relative/path/not/ending/in/generated'; name.CfnConstruct();
    context.report({
      message: 'To allow rewriting imports when generating v2 experimental packages, `' + name + '` must be imported by name from its specific .generated location.',
      node: node,
    });
  } else if (checkIfImportedLocationIsAnAlphaPackage(location, context.getFilename())) {
    // import * as name from '@aws-cdk/another-alpha-package'; name.CfnConstruct();
    context.report({
      message: 'To allow rewriting imports when generating v2 experimental packages, `' + name + '` must be imported by name and separate from non-L1 imports, since it is being imported from an experimental package: ' + location,
      node: node,
    });
  }
}

function currentFileIsInAlphaPackage(filename: string): boolean {
  const filePathSplit = filename.split('/');
  const awsCdkNamespaceIndex = filePathSplit.findIndex(e => e.match('@aws-cdk'))
  if (awsCdkNamespaceIndex !== -1) {
    const packageDir = filePathSplit.slice(0, awsCdkNamespaceIndex + 2).join('/');
    return isAlphaPackage(packageDir);
  }
  return false;
}

function checkIfImportedLocationIsAnAlphaPackage(location: string, currentFilename: string): boolean {
  const rootDir = getCdkRootDir(currentFilename);
  if (rootDir) {
    const packageDir = rootDir + `/packages/${location}`;
    return isAlphaPackage(packageDir);
  }
  return false;
}

function getCdkRootDir(filename: string): string | undefined {
  const filenameSplit = filename.split(path.sep);
  // for test files
  let rootDirIndex = filenameSplit.findIndex(e => e.match('tools'));

  // for package files
  if (rootDirIndex === -1) {
    rootDirIndex = filenameSplit.findIndex(e => e.match('packages'));
  }

  if (rootDirIndex !== -1) {
    return filenameSplit.slice(0, rootDirIndex).join('/');
  }
  return undefined;
}

function isAlphaPackage(packageDir: string): boolean {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), { encoding: 'utf-8' }));

  const separateModule = pkg['separate-module'];
  if (separateModule !== undefined) {
    return separateModule;
  }

  const maturity = pkg.maturity;
  if (maturity !== 'experimental' && maturity !== 'developer-preview') {
    return false;
  }
  // we're only interested in '@aws-cdk/' packages,
  // and those that are JSII-enabled
  return pkg.name.startsWith('@aws-cdk/') && !!pkg['jsii'];
}

function checkLeftAndRightForCfn(node: any): { name: string, location: string } | undefined {
  // Checking the left and right allows capturing the CfnConstruct name even if the TSQualifiedName references a subtype like:
  //    xxx.CfnConstruct.subtype
  //    xxx.CfnConstruct.subtype.anothersubtype
  if (!node) {
    return undefined;
  }
  if (node.name?.startsWith('Cfn')) {
    if (node.name === node.parent.left.name) {
      // This is the scenario for a reference to CfnConstruct.subtype
      // In this case, it is not qualified with a barrel import, so we don't need to do anything. 
      return undefined;
    }
    return {
      name: node.name,
      location: node.parent.left.name,
    };
  }

  const right = checkLeftAndRightForCfn(node.right);
  const left = checkLeftAndRightForCfn(node.left);

  return right ?? left ?? undefined;
}