import * as fs from 'fs-extra';
import { cfnOnlyReadmeContents } from './readme-contents';

export interface ModuleDefinition {
  readonly namespace: string;
  readonly moduleName: string;
  readonly submoduleName: string;
  readonly moduleFamily: string;
  readonly moduleBaseName: string;
  readonly packageName: string;

  readonly dotnetPackage: string;

  readonly javaGroupId: string;
  readonly javaPackage: string;
  readonly javaArtifactId: string;

  readonly goModuleName: string;
  readonly goPackageName: string;

  readonly pythonDistName: string;
  readonly pythonModuleName: string;
}

export function createModuleDefinitionFromCfnNamespace(namespace: string): ModuleDefinition {
  const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');
  const moduleName = `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase();
  const submoduleName = moduleName.replace('-', '_');

  const lowcaseModuleName = moduleBaseName.toLocaleLowerCase();
  const packageName = `@aws-cdk/${moduleName}`;

  // dotnet names
  const dotnetPackage = `Amazon.CDK.${moduleFamily}.${moduleBaseName}`;

  // java names
  const javaGroupId = 'software.amazon.awscdk';
  const javaPackage = moduleFamily === 'AWS'
    ? `software.amazon.awscdk.services.${lowcaseModuleName}`
    : `software.amazon.awscdk.${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
  const javaArtifactId = moduleFamily === 'AWS'
    ? lowcaseModuleName
    : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

  // python names
  const pythonDistName = `aws-cdk.${moduleName}`;
  const pythonModuleName = pythonDistName.replace(/-/g, '_');

  // go names
  const goPackageName = `${moduleFamily}${moduleBaseName}`.replace(/[^a-z0-9]+/ig, '').toLowerCase();
  const goModuleName = `github.com/aws/aws-cdk-go/awscdk/v2/${goPackageName}`;

  return {
    namespace,
    moduleName,
    submoduleName,
    moduleFamily,
    moduleBaseName,
    packageName,
    dotnetPackage,
    goModuleName,
    goPackageName,
    javaGroupId,
    javaPackage,
    javaArtifactId,
    pythonDistName,
    pythonModuleName,
  };
}

export async function createLibraryReadme(namespace: string, readmePath: string, alphaPackageName?: string) {
  const module = createModuleDefinitionFromCfnNamespace(namespace);

  await fs.writeFile(readmePath, cfnOnlyReadmeContents({
    cfnNamespace: namespace,
    packageName: module.packageName,
    alphaPackageName,
  }));
}
