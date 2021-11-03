import * as reflect from 'jsii-reflect';

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
  if (type.assembly.name === 'aws-cdk-lib') {
    let namespacedPart = type.assembly.name;
    if (type.namespace) {
      const parts = type.namespace.split('_');
      namespacedPart = SPECIAL_NAMESPACE_IMPORT_NAMES[type.namespace] ?? parts[1] ?? parts[0];
      return {
        importName: namespacedPart.replace(/^aws_/g, '').replace(/[^a-z0-9_]/g, '_'),
        moduleName: `${type.assembly.name}/${namespacedPart.replace('-', '_')}`,
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
      importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
      moduleName: type.assembly.name,
    };
  }
}