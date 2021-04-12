import { unlink, writeFileSync } from 'fs';
import { join } from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import '../jest';

let templateFilePath: string;
let synthStack: cxapi.CloudFormationStackArtifact;
let noOutputStack: cxapi.CloudFormationStackArtifact;

beforeEach(done => {
  synthStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: 'somevalue',
        },
      },
      AnotherResource: {
        Type: 'Some::AnotherResource',
        Properties: {
          PropA: 'anothervalue',
        },
      },
    },
    Outputs: {
      TestOutput: {
        Value: {
          'Fn::GetAtt': [
            'SomeResource',
            'Arn',
          ],
        },
        Export: {
          Name: 'TestOutputExportName',
        },
      },
      ComplexExportNameOutput: {
        Value: {
          'Fn::GetAtt': [
            'ComplexOutputResource',
            'Arn',
          ],
        },
        Export: {
          Name: {
            'Fn::Sub': '${AWS::StackName}-ComplexExportNameOutput',
          },
        },
      },
    },
  });
  noOutputStack = mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: {
          PropA: 'somevalue',
        },
      },
    },
  });
  done();
});

test('haveOutput should assert true when output with correct name is provided', () => {
  expect(synthStack).toHaveOutput({
    outputName: 'TestOutput',
  });
});

test('haveOutput should assert false when output with incorrect name is provided', () => {
  expect(synthStack).not.toHaveOutput({
    outputName: 'WrongOutput',
  });
});

test('haveOutput should assert true when output with correct name and export name is provided', () => {
  expect(synthStack).toHaveOutput({
    outputName: 'TestOutput',
    exportName: 'TestOutputExportName',
  });
});

test('haveOutput should assert false when output with correct name and incorrect export name is provided', () => {
  expect(synthStack).not.toHaveOutput({
    outputName: 'TestOutput',
    exportName: 'WrongTestOutputExportName',
  });
});

test('haveOutput should assert true when output with correct name, export name and value is provided', () => {
  expect(synthStack).toHaveOutput({
    outputName: 'TestOutput',
    exportName: 'TestOutputExportName',
    outputValue: {
      'Fn::GetAtt': [
        'SomeResource',
        'Arn',
      ],
    },
  });
});

test('haveOutput should assert false when output with correct name and export name and incorrect value is provided', () => {
  expect(synthStack).not.toHaveOutput({
    outputName: 'TestOutput',
    exportName: 'TestOutputExportName',
    outputValue: 'SomeWrongValue',
  });
});

test('haveOutput should assert true when output with correct export name and value is provided', () => {
  expect(synthStack).toHaveOutput({
    exportName: 'TestOutputExportName',
    outputValue: {
      'Fn::GetAtt': [
        'SomeResource',
        'Arn',
      ],
    },
  });
});

test('haveOutput should assert false when output with correct export name and incorrect value is provided', () => {
  expect(synthStack).not.toHaveOutput({
    exportName: 'TestOutputExportName',
    outputValue: 'WrongValue',
  });
});

test('haveOutput should assert true when output with correct output name and value is provided', () => {
  expect(synthStack).toHaveOutput({
    outputName: 'TestOutput',
    outputValue: {
      'Fn::GetAtt': [
        'SomeResource',
        'Arn',
      ],
    },
  });
});

test('haveOutput should assert false when output with correct output name and incorrect value is provided', () => {
  expect(synthStack).not.toHaveOutput({
    outputName: 'TestOutput',
    outputValue: 'WrongValue',
  });
});

test('haveOutput should assert false when asserting against noOutputStack', () => {
  expect(noOutputStack).not.toHaveOutput({
    outputName: 'TestOutputName',
    exportName: 'TestExportName',
    outputValue: 'TestOutputValue',
  });
});

test('haveOutput should throw Error when none of outputName and exportName is provided', () => {
  expect(() => expect(synthStack).toHaveOutput({ outputValue: 'SomeValue' }))
    .toThrow('At least one of [outputName, exportName] should be provided');
});

test('haveOutput should be able to handle complex exportName values', () => {
  expect(synthStack).toHaveOutput({
    exportName: { 'Fn::Sub': '${AWS::StackName}-ComplexExportNameOutput' },
    outputValue: {
      'Fn::GetAtt': [
        'ComplexOutputResource',
        'Arn',
      ],
    },
  });
});

afterEach(done => {
  if (templateFilePath) {
    unlink(templateFilePath, done);
  } else {
    done();
  }
});

function mkStack(template: any): cxapi.CloudFormationStackArtifact {
  const templateFileName = 'test-have-output-template.json';
  const stackName = 'test-have-output';
  const assembly = new cxapi.CloudAssemblyBuilder();

  assembly.addArtifact(stackName, {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format('123456789012', 'bermuda-triangle-1'),
    properties: {
      templateFile: templateFileName,
    },
  });

  templateFilePath = join(assembly.outdir, templateFileName);
  writeFileSync(templateFilePath, JSON.stringify(template));

  return assembly.buildAssembly().getStackByName(stackName);
}
