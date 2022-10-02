import * as path from 'path';
import * as fs from 'fs-extra';
import { createModuleDefinitionFromCfnNamespace, createLibraryReadme } from '../lib';

describe('createModuleDefinitionFromCfnNamespace', () => {
  test('base case', () => {
    const module = createModuleDefinitionFromCfnNamespace('AWS::EC2');

    expect(module).toEqual({
      namespace: 'AWS::EC2',
      moduleName: 'aws-ec2',
      moduleFamily: 'AWS',
      moduleBaseName: 'EC2',
      packageName: '@aws-cdk/aws-ec2',
      dotnetPackage: 'Amazon.CDK.AWS.EC2',
      javaGroupId: 'software.amazon.awscdk',
      javaPackage: 'services.ec2',
      javaArtifactId: 'ec2',
      pythonDistName: 'aws-cdk.aws-ec2',
      pythonModuleName: 'aws_cdk.aws_ec2',
    });
  });

  test('Serverless is special-cased to SAM', () => {
    const module = createModuleDefinitionFromCfnNamespace('AWS::Serverless');

    expect(module).toEqual({
      namespace: 'AWS::Serverless',
      moduleName: 'aws-sam',
      moduleFamily: 'AWS',
      moduleBaseName: 'SAM',
      packageName: '@aws-cdk/aws-sam',
      dotnetPackage: 'Amazon.CDK.AWS.SAM',
      javaGroupId: 'software.amazon.awscdk',
      javaPackage: 'services.sam',
      javaArtifactId: 'sam',
      pythonDistName: 'aws-cdk.aws-sam',
      pythonModuleName: 'aws_cdk.aws_sam',
    });
  });

  test('Java artifacts use different package/artifact when module family is not AWS', () => {
    const module = createModuleDefinitionFromCfnNamespace('Alexa::ASK');

    expect(module).toEqual({
      namespace: 'Alexa::ASK',
      moduleName: 'alexa-ask',
      moduleFamily: 'Alexa',
      moduleBaseName: 'ASK',
      packageName: '@aws-cdk/alexa-ask',
      dotnetPackage: 'Amazon.CDK.Alexa.ASK',
      javaGroupId: 'software.amazon.awscdk',
      javaPackage: 'alexa.ask',
      javaArtifactId: 'alexa-ask',
      pythonDistName: 'aws-cdk.alexa-ask',
      pythonModuleName: 'aws_cdk.alexa_ask',
    });
  });
});

describe('createLibraryReadme', () => {
  let tempDir: string | undefined;

  beforeEach(() => {
    tempDir = undefined;
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.emptyDir(tempDir);
      await fs.rmdir(tempDir);
    }
  });

  test('library name is valid', async () => {
    tempDir = fs.mkdtempSync(path.join(__dirname, 'temp'));
    const readmePath = path.join(tempDir, 'README.md');
    await createLibraryReadme('Alexa::ASK', readmePath);

    const readme = fs.readFileSync(readmePath, { encoding: 'utf8' });
    expect(readme).toContain("import * as alexa_ask from '@aws-cdk/alexa-ask';");
  });
});
