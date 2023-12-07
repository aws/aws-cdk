export function createModuleDefinitionFromCfnNamespace(namespace: string) {
  const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');
  const moduleName = `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase();
  const submoduleName = moduleName.replace('-', '_');

  const lowcaseModuleName = moduleBaseName.toLocaleLowerCase();
  const packageName = `@aws-cdk/${moduleName}`;

  // dotnet names
  const dotnetPackage = `Amazon.CDK.${moduleFamily}.${moduleBaseName}`;

  // java names
  const javaGroupId = 'software.amazon.awscdk';
  const javaPackage =
    moduleFamily === 'AWS'
      ? `software.amazon.awscdk.services.${lowcaseModuleName}`
      : `${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
  const javaArtifactId =
    moduleFamily === 'AWS' ? lowcaseModuleName : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

  // python names
  const pythonDistName = `aws-cdk.${moduleName}`;
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
