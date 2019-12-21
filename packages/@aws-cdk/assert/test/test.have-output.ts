import cxapi = require('@aws-cdk/cx-api');
import { unlink, writeFileSync } from 'fs';
import { Test } from 'nodeunit';
import { join } from 'path';
import { expect, haveOutput } from '../lib';

let templateFilePath: string;
let synthStack: cxapi.CloudFormationStackArtifact;
let noOutputStack: cxapi.CloudFormationStackArtifact;
module.exports = {
  'setUp'(cb: () => void) {
    synthStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource',
          Properties: {
            PropA: 'somevalue'
          }
        },
        AnotherResource: {
          Type: 'Some::AnotherResource',
          Properties: {
            PropA: 'anothervalue'
          }
        }
      },
      Outputs: {
        TestOutput: {
          Value: {
            'Fn::GetAtt': [
              'SomeResource',
              'Arn'
            ]
          },
          Export: {
            Name: 'TestOutputExportName'
          }
        },
        ComplexExportNameOutput: {
          Value: {
            'Fn::GetAtt': [
              'ComplexOutputResource',
              'Arn'
            ]
          },
          Export: {
            Name: {
              "Fn::Sub": "${AWS::StackName}-ComplexExportNameOutput"
            }
          }
        }
      }
    });
    noOutputStack = mkStack({
      Resources: {
        SomeResource: {
          Type: 'Some::Resource',
          Properties: {
            PropA: 'somevalue'
          }
        }
      }
    });
    cb();
  },
  'haveOutput should assert true when output with correct name is provided'(test: Test) {
    expect(synthStack).to(haveOutput({
      outputName: 'TestOutput'
    }));
    test.done();
  },
  'haveOutput should assert false when output with incorrect name is provided'(test: Test) {
    expect(synthStack).notTo(haveOutput({
      outputName: 'WrongOutput'
    }));
    test.done();
  },
  'haveOutput should assert true when output with correct name and export name is provided'(test: Test) {
    expect(synthStack).to(haveOutput({
      outputName: 'TestOutput',
      exportName: 'TestOutputExportName',
    }));
    test.done();
  },
  'haveOutput should assert false when output with correct name and incorrect export name is provided'(test: Test) {
    expect(synthStack).notTo(haveOutput({
      outputName: 'TestOutput',
      exportName: 'WrongTestOutputExportName',
    }));
    test.done();
  },
  'haveOutput should assert true when output with correct name, export name and value is provided'(test: Test) {
    expect(synthStack).to(haveOutput({
      outputName: 'TestOutput',
      exportName: 'TestOutputExportName',
      outputValue: {
        'Fn::GetAtt': [
          'SomeResource',
          'Arn'
        ]
      }
    }));
    test.done();
  },
  'haveOutput should assert false when output with correct name and export name and incorrect value is provided'(test: Test) {
    expect(synthStack).notTo(haveOutput({
      outputName: 'TestOutput',
      exportName: 'TestOutputExportName',
      outputValue: 'SomeWrongValue'
    }));
    test.done();
  },
  'haveOutput should assert true when output with correct export name and value is provided'(test: Test) {
    expect(synthStack).to(haveOutput({
      exportName: 'TestOutputExportName',
      outputValue: {
        'Fn::GetAtt': [
          'SomeResource',
          'Arn'
        ]
      }
    }));
    test.done();
  },
  'haveOutput should assert false when output with correct export name and incorrect value is provided'(test: Test) {
    expect(synthStack).notTo(haveOutput({
      exportName: 'TestOutputExportName',
      outputValue: 'WrongValue'
    }));
    test.done();
  },
  'haveOutput should assert true when output with correct output name and value is provided'(test: Test) {
    expect(synthStack).to(haveOutput({
      outputName: 'TestOutput',
      outputValue: {
        'Fn::GetAtt': [
          'SomeResource',
          'Arn'
        ]
      }
    }));
    test.done();
  },
  'haveOutput should assert false when output with correct output name and incorrect value is provided'(test: Test) {
    expect(synthStack).notTo(haveOutput({
      outputName: 'TestOutput',
      outputValue: 'WrongValue'
    }));
    test.done();
  },
  'haveOutput should assert false when asserting against noOutputStack'(test: Test) {
    expect(noOutputStack).notTo(haveOutput({
      outputName: 'TestOutputName',
      exportName: 'TestExportName',
      outputValue: 'TestOutputValue'
    }));
    test.done();
  },
  'haveOutput should throw Error when none of outputName and exportName is provided'(test: Test) {
    test.throws(() => {
      expect(synthStack).to(haveOutput({
        outputValue: 'SomeValue'
      }));
    });
    test.done();
  },
  'haveOutput should be able to handle complex exportName values'(test: Test) {
    expect(synthStack).to(haveOutput({
      exportName: {'Fn::Sub': '${AWS::StackName}-ComplexExportNameOutput'},
      outputValue: {
        'Fn::GetAtt': [
          'ComplexOutputResource',
          'Arn'
        ]
      }
    }));
    test.done();
  },
  'tearDown'(cb: () => void) {
    if (templateFilePath) {
      unlink(templateFilePath, cb);
    } else {
      cb();
    }
  }
};

function mkStack(template: any): cxapi.CloudFormationStackArtifact {
  const templateFileName = 'test-have-output-template.json';
  const stackName = 'test-have-output';
  const assembly = new cxapi.CloudAssemblyBuilder();
  assembly.addArtifact(stackName, {
    type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format('123456789012', 'bermuda-triangle-1'),
    properties: {
      templateFile: templateFileName
    }
  });
  templateFilePath = join(assembly.outdir, templateFileName);
  writeFileSync(templateFilePath, JSON.stringify(template));
  return assembly.buildAssembly().getStackByName(stackName);
}
