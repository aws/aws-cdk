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
  aws_applicationautoscaling: 'appscaling',
  aws_elasticloadbalancing: 'elb',
  aws_elasticloadbalancingv2: 'elbv2',
};

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
}

/**
 * Parses the given type for human-readable information on the module
 * that the type is from. Meant to serve as a single source of truth
 * for parsing the type for module information.
 */
export function module(type: reflect.Type): ImportedModule {
  if (type.assembly.name.startsWith('aws-cdk-lib')) {
    if (type.namespace) {
      const parts = type.namespace.split('_');
      const namespacedPart = SPECIAL_NAMESPACE_IMPORT_NAMES[type.namespace] ?? parts[1] ?? parts[0];
      return {
        importName: escapeIdentifier(namespacedPart.replace(/^aws_/g, '').replace(/[^a-z0-9_]/g, '_')),
        moduleName: type.assembly.name,
      };
    }
    // if there is no namespace in v2, we are in the root module
    return {
      importName: 'cdk',
      moduleName: 'aws-cdk-lib',
    };
  } else {
    const parts = type.assembly.name.split('/');
    const nonNamespacedPart = SPECIAL_PACKAGE_ROOT_IMPORT_NAMES[type.assembly.name] ?? parts[1] ?? parts[0];
    return {
      importName: escapeIdentifier(nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_')),
      moduleName: type.assembly.name,
    };
  }
}

/**
 * Namespaced name inside a module
 */
export function typeNamespacedName(type: reflect.Type): string {
  return [
    type.namespace,
    type.name,
  ].filter((x) => x).join('.');
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