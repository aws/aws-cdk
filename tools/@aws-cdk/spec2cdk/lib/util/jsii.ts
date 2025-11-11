import * as naming from '../naming';

export interface PackageBaseNames {
  javascript: string;
  dotnet: string;
  java: string;
  python: string;
}

export const AWS_CDK_LIB_BASE_NAMES: PackageBaseNames = {
  javascript: 'aws-cdk-lib',
  dotnet: 'Amazon.CDK',
  java: 'software.amazon.awscdk',
  python: 'aws-cdk',
};

/**
 * Creates a module definition for the given namespace
 *
 * @param namespace - the namespace to create a module definition for
 * @param bases - provide different package base names and overwrite jsii targets
 * @returns the module definition
 */
export function namespaceToModuleDefinition(namespace: string, bases: PackageBaseNames = AWS_CDK_LIB_BASE_NAMES) {
  const { moduleName, moduleFamily, moduleBaseName } = naming.modulePartsFromNamespace(namespace);
  const submoduleName = moduleName.replace('-', '_');

  const lowcaseModuleName = moduleBaseName.toLocaleLowerCase();
  const packageName = `${bases.javascript}/${moduleName}`;

  // dotnet names
  const dotnetPackage = `${bases.dotnet}.${moduleFamily}.${moduleBaseName}`;

  // java names
  const javaGroupId = bases.java;
  const javaPackage =
    moduleFamily === 'AWS'
      ? `${bases.java}.services.${lowcaseModuleName}`
      : `${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
  const javaArtifactId =
    moduleFamily === 'AWS' ? lowcaseModuleName : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

  // python names
  const pythonDistName = `${bases.python}.${moduleName}`;
  const pythonModuleName = pythonDistName.replace(/-/g, '_');

  return {
    namespace,
    moduleName,
    submoduleName,
    moduleFamily,
    moduleBaseName,
    packageName,
    dotnetPackage,
    javaGroupId,
    javaPackage,
    javaArtifactId,
    pythonDistName,
    pythonModuleName,
  };
}
