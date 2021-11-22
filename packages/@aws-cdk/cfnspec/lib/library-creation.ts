import * as fs from 'fs-extra';

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
  const moduleName = `${moduleFamily}-${moduleBaseName.replace(/V\d+$/, '')}`.toLocaleLowerCase();

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

export async function createLibraryReadme(namespace: string, readmePath: string) {
  const module = createModuleDefinitionFromCfnNamespace(namespace);

  await fs.writeFile(readmePath, [
    `# ${namespace} Construct Library`,
    '<!--BEGIN STABILITY BANNER-->',
    '',
    '---',
    '',
    '![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)',
    '',
    '> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.',
    '>',
    '> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib',
    '',
    '---',
    '',
    '<!--END STABILITY BANNER-->',
    '',
    'This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.',
    '',
    '```ts nofixture',
    `import * as ${module.moduleName.toLocaleLowerCase().replace(/[^a-z0-9_]/g, '_')} from '${module.packageName}';`,
    '```',
    '',
  ].join('\n'), 'utf8');
}
