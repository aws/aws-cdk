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

export function createModuleDefinitionFromCfnNamespace(namespace: string, bases: PackageBaseNames = AWS_CDK_LIB_BASE_NAMES) {
  const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');
  const moduleName = `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase();
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
