import * as fs from 'fs-extra';
import { cfnOnlyReadmeContents } from './readme-contents';

export interface ModuleDefinition {
  readonly namespace: string;
  readonly moduleName: string;
  readonly moduleFamily: string;
  readonly moduleBaseName: string;
  readonly packageName: string;

  readonly dotnetPackage: string;
  readonly javaGroupId: string;
  readonly javaPackage: string;
  readonly javaArtifactId: string;

  readonly pythonDistName: string;
  readonly pythonModuleName: string;
}

export function createModuleDefinitionFromCfnNamespace(namespace: string): ModuleDefinition {
  const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');
  const moduleName = `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase();

  const lowcaseModuleName = moduleBaseName.toLocaleLowerCase();
  const packageName = `@aws-cdk/${moduleName}`;

  // dotnet names
  const dotnetPackage = `Amazon.CDK.${moduleFamily}.${moduleBaseName}`;

  // java names
  const javaGroupId = 'software.amazon.awscdk';
  const javaPackage = moduleFamily === 'AWS'
    ? `services.${lowcaseModuleName}`
    : `${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
  const javaArtifactId = moduleFamily === 'AWS'
    ? lowcaseModuleName
    : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

  // python names
  const pythonDistName = `aws-cdk.${moduleName}`;
  const pythonModuleName = pythonDistName.replace(/-/g, '_');

  return {
    namespace,
    moduleName,
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


export async function createLibraryReadme(namespace: string, readmePath: string, alphaPackageName?: string) {
  const module = createModuleDefinitionFromCfnNamespace(namespace);

  await fs.writeFile(readmePath, cfnOnlyReadmeContents({
    cfnNamespace: namespace,
    packageName: module.packageName,
    alphaPackageName,
  }));
}
