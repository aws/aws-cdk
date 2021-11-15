import * as reflect from 'jsii-reflect';
import { Code } from './code';
import { Import } from './declaration';

/**
 * Customary module import names that differ from what would be automatically generated.
 */
const SPECIAL_PACKAGE_ROOT_IMPORT_NAMES: Record<string, string> = {
  'aws-cdk-lib': 'cdk',
  '@aws-cdk/core': 'cdk',
  '@aws-cdk/aws-applicationautoscaling': 'appscaling',
  '@aws-cdk/aws-elasticloadbalancing': 'elb',
  '@aws-cdk/aws-elasticloadbalancingv2': 'elbv2',
};

const SPECIAL_NAMESPACE_IMPORT_NAMES: Record<string, string> = {
  'aws-cdk-lib.aws_applicationautoscaling': 'appscaling',
  'aws-cdk-lib.aws_elasticloadbalancing': 'elb',
  'aws-cdk-lib.aws_elasticloadbalancingv2': 'elbv2',
};

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
  readonly submoduleName?: string;
}

/**
 * Parses the given type for human-readable information on the module
 * that the type is from. Meant to serve as a single source of truth
 * for parsing the type for module information.
 */
export function module(type: reflect.Type): ImportedModule {
  const parts = analyzeTypeName(type);

  if (parts.submoduleNameParts.length > 0) {
    const specialNameKey = [parts.assemblyName, ...parts.submoduleNameParts].join('.');

    const importName = SPECIAL_NAMESPACE_IMPORT_NAMES[specialNameKey] ?? parts.submoduleNameParts.join('.');
    return {
      importName: escapeIdentifier(importName.replace(/^aws_/g, '').replace(/[^a-z0-9_]/g, '_')),
      moduleName: parts.assemblyName,
      submoduleName: parts.submoduleNameParts.join('.'),
    };
  }

  // Split '@aws-cdk/aws-s3' into ['@aws-cdk', 'aws-s3']
  const slashParts = type.assembly.name.split('/');
  const nonNamespacedPart = SPECIAL_PACKAGE_ROOT_IMPORT_NAMES[parts.assemblyName] ?? slashParts[1] ?? slashParts[0];
  return {
    importName: escapeIdentifier(nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_')),
    moduleName: type.assembly.name,
  };
}

/**
 * Namespaced name inside a module
 */
export function typeNamespacedName(type: reflect.Type): string {
  const parts = analyzeTypeName(type);

  return [
    ...parts.namespaceNameParts,
    parts.simpleName,
  ].join('.');
}

const KEYWORDS = ['function', 'default'];

export function escapeIdentifier(ident: string): string {
  return KEYWORDS.includes(ident) ? `${ident}_` : ident;
}

export function moduleReference(type: reflect.Type) {
  const imp = new Import(type);
  return new Code(imp.importName, [imp]);
}

export function typeReference(type: reflect.Type) {
  return Code.concatAll(
    moduleReference(type),
    '.',
    typeNamespacedName(type));
}

/**
 * A type name consists of 4 parts which are all treated differently
 */
interface TypeNameParts {
  readonly assemblyName: string;
  readonly submoduleNameParts: string[];
  readonly namespaceNameParts: string[];
  readonly simpleName: string;
}

function analyzeTypeName(type: reflect.Type): TypeNameParts {
  // Need to divide the namespace into submodule and non-submodule

  // For type 'asm.b.c.d.Type' contains ['asm', 'b', 'c', 'd']
  const nsParts = type.fqn.split('.').slice(0, -1);

  const moduleFqns = new Set(type.assembly.allSubmodules.map((s) => s.fqn));

  let split = nsParts.length;
  while (split > 1 && !moduleFqns.has(nsParts.slice(0, split).join('.'))) {
    split--;
  }

  return {
    assemblyName: type.assembly.name,
    submoduleNameParts: nsParts.slice(1, split),
    namespaceNameParts: nsParts.slice(split, nsParts.length),
    simpleName: type.name,
  };
}