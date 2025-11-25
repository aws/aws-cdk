import type { ModuleDefinition } from '@aws-cdk/pkglint';
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
export function namespaceToModuleDefinition(namespace: string, bases: PackageBaseNames = AWS_CDK_LIB_BASE_NAMES): ModuleDefinition {
  // [aws-s3, AWS, S3]
  const { moduleName, moduleFamily, moduleBaseName } = naming.modulePartsFromNamespace(namespace);
  const submoduleName = moduleName.replace('-', '_'); // aws_s3

  const lowcaseModuleName = moduleBaseName.toLocaleLowerCase(); // s3
  const packageName = `${bases.javascript}/${moduleName}`; // aws-cdk-lib/aws-s3

  // dotnet names
  const dotnetPackage = `${bases.dotnet}.${moduleFamily}.${moduleBaseName}`; // Amazon.CDK.AWS.S3

  // java names
  const javaGroupId = bases.java;
  const javaPackage =
    moduleFamily === 'AWS'
      ? `${bases.java}.services.${lowcaseModuleName}`
      : `${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
  const javaArtifactId =
    moduleFamily === 'AWS' ? lowcaseModuleName : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

  // python names
  const pythonDistName = `${bases.python}.${moduleName}`; // aws-cdk.aws-s3
  const pythonModuleName = pythonDistName.replace(/-/g, '_'); // aws_cdk.aws_s3

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
