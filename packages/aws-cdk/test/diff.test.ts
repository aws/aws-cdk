/* eslint-disable import/order */
import { Writable } from 'stream';
import { StringDecoder } from 'string_decoder';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { instanceMockFrom, MockCloudExecutable } from './util';
import { Deployments } from '../lib/api/deployments';
import { CdkToolkit } from '../lib/cdk-toolkit';
import * as cfn from '../lib/api/util/cloudformation';
import { NestedStackTemplates } from '../lib/api/nested-stack-helpers';

let cloudExecutable: MockCloudExecutable;
let cloudFormation: jest.Mocked<Deployments>;
let toolkit: CdkToolkit;

describe('imports', () => {
  beforeEach(() => {
    jest.spyOn(cfn, 'createDiffChangeSet').mockImplementation(async () => {
      return {
        Changes: [
          {
            ResourceChange: {
              Action: 'Import',
              LogicalResourceId: 'Queue',
            },
          },
          {
            ResourceChange: {
              Action: 'Import',
              LogicalResourceId: 'Bucket',
            },
          },
          {
            ResourceChange: {
              Action: 'Import',
              LogicalResourceId: 'Queue2',
            },
          },
        ],
      };
    });
    cloudExecutable = new MockCloudExecutable({
      stacks: [{
        stackName: 'A',
        template: {
          Resources: {
            Queue: {
              Type: 'AWS::SQS::Queue',
            },
            Queue2: {
              Type: 'AWS::SQS::Queue',
            },
            Bucket: {
              Type: 'AWS::S3::Bucket',
            },
          },
        },
      }],
    });

    cloudFormation = instanceMockFrom(Deployments);

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    // Default implementations
    cloudFormation.readCurrentTemplateWithNestedStacks.mockImplementation((_stackArtifact: CloudFormationStackArtifact) => {
      return Promise.resolve({
        deployedTemplate: {},
        nestedStackCount: 0,
      });
    });
    cloudFormation.deployStack.mockImplementation((options) => Promise.resolve({
      noOp: true,
      outputs: {},
      stackArn: '',
      stackArtifact: options.stack,
    }));
  });

  test('imports', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['A'],
      stream: buffer,
      changeSet: true,
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    expect(plainTextOutput).toContain(`Stack A
Resources
[←] AWS::SQS::Queue Queue import
[←] AWS::SQS::Queue Queue2 import
[←] AWS::S3::Bucket Bucket import
`);

    expect(buffer.data.trim()).toContain('✨  Number of stacks with differences: 1');
    expect(exitCode).toBe(0);
  });
});

describe('non-nested stacks', () => {
  beforeEach(() => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [{
        stackName: 'A',
        template: { resource: 'A' },
      },
      {
        stackName: 'B',
        depends: ['A'],
        template: { resource: 'B' },
      },
      {
        stackName: 'C',
        depends: ['A'],
        template: { resource: 'C' },
        metadata: {
          '/resource': [
            {
              type: cxschema.ArtifactMetadataEntryType.ERROR,
              data: 'this is an error',
            },
          ],
        },
      },
      {
        stackName: 'D',
        template: { resource: 'D' },
      }],
    });

    cloudFormation = instanceMockFrom(Deployments);

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    // Default implementations
    cloudFormation.readCurrentTemplateWithNestedStacks.mockImplementation((stackArtifact: CloudFormationStackArtifact) => {
      if (stackArtifact.stackName === 'D') {
        return Promise.resolve({
          deployedRootTemplate: { resource: 'D' },
          nestedStacks: {},
        });
      }
      return Promise.resolve({
        deployedRootTemplate: {},
        nestedStacks: {},
      });
    });
    cloudFormation.deployStack.mockImplementation((options) => Promise.resolve({
      noOp: true,
      outputs: {},
      stackArn: '',
      stackArtifact: options.stack,
    }));
  });

  test('diff can diff multiple stacks', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['B'],
      stream: buffer,
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    expect(plainTextOutput).toContain('Stack A');
    expect(plainTextOutput).toContain('Stack B');

    expect(buffer.data.trim()).toContain('✨  Number of stacks with differences: 2');
    expect(exitCode).toBe(0);
  });

  test('diff number of stack diffs, not resource diffs', async () => {
    // GIVEN
    cloudExecutable = new MockCloudExecutable({
      stacks: [{
        stackName: 'A',
        template: { resourceA: 'A', resourceB: 'B' },
      },
      {
        stackName: 'B',
        template: { resourceC: 'C' },
      }],
    });

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['A', 'B'],
      stream: buffer,
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    expect(plainTextOutput).toContain('Stack A');
    expect(plainTextOutput).toContain('Stack B');

    expect(buffer.data.trim()).toContain('✨  Number of stacks with differences: 2');
    expect(exitCode).toBe(0);
  });

  test('exits with 1 with diffs and fail set to true', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['A'],
      stream: buffer,
      fail: true,
    });

    // THEN
    expect(buffer.data.trim()).toContain('✨  Number of stacks with differences: 1');
    expect(exitCode).toBe(1);
  });

  test('throws an error if no valid stack names given', async () => {
    const buffer = new StringWritable();

    // WHEN
    await expect(() => toolkit.diff({
      stackNames: ['X', 'Y', 'Z'],
      stream: buffer,
    })).rejects.toThrow('No stacks match the name(s) X,Y,Z');
  });

  test('exits with 1 with diff in first stack, but not in second stack and fail set to true', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['A', 'D'],
      stream: buffer,
      fail: true,
    });

    // THEN
    expect(buffer.data.trim()).toContain('✨  Number of stacks with differences: 1');
    expect(exitCode).toBe(1);
  });

  test('throws an error during diffs on stack with error metadata', async () => {
    const buffer = new StringWritable();

    // WHEN
    await expect(() => toolkit.diff({
      stackNames: ['C'],
      stream: buffer,
    })).rejects.toThrow(/Found errors/);
  });

  test('when quiet mode is enabled, stacks with no diffs should not print stack name & no differences to stdout', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['A', 'A'],
      stream: buffer,
      fail: false,
      quiet: true,
    });

    // THEN
    expect(buffer.data.trim()).not.toContain('Stack A');
    expect(buffer.data.trim()).not.toContain('There were no differences');
    expect(exitCode).toBe(0);
  });
});

describe('nested stacks', () => {
  beforeEach(() => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [{
        stackName: 'Parent',
        template: {},
      }],
    });

    cloudFormation = instanceMockFrom(Deployments);

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    cloudFormation.readCurrentTemplateWithNestedStacks.mockImplementation((stackArtifact: CloudFormationStackArtifact) => {
      if (stackArtifact.stackName === 'Parent') {
        stackArtifact.template.Resources = {
          AdditionChild: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'addition-child-url-old',
            },
          },
          DeletionChild: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'deletion-child-url-old',
            },
          },
          ChangedChild: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'changed-child-url-old',
            },
          },
          UnchangedChild: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'changed-child-url-constant',
            },
          },
        };
        return Promise.resolve({
          deployedRootTemplate: {
            Resources: {
              AdditionChild: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'addition-child-url-new',
                },
              },
              DeletionChild: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'deletion-child-url-new',
                },
              },
              ChangedChild: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'changed-child-url-new',
                },
              },
              UnchangedChild: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'changed-child-url-constant',
                },
              },
            },
          },
          nestedStacks: {
            AdditionChild: {
              deployedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                  },
                },
              },
              generatedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'added-value',
                    },
                  },
                },
              },
              nestedStackTemplates: {},
              physicalName: 'AdditionChild',
            },
            DeletionChild: {
              deployedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'value-to-be-removed',
                    },
                  },
                },
              },
              generatedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                  },
                },
              },
              nestedStackTemplates: {},
              physicalName: 'DeletionChild',
            },
            ChangedChild: {
              deployedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'old-value',
                    },
                  },
                },
              },
              generatedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'new-value',
                    },
                  },
                },
              },
              nestedStackTemplates: {},
              physicalName: 'ChangedChild',
            },
            newChild: {
              deployedTemplate: {},
              generatedTemplate: {
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'new-value',
                    },
                  },
                },
              },
              nestedStackTemplates: {
                newGrandChild: {
                  deployedTemplate: {},
                  generatedTemplate: {
                    Resources: {
                      SomeResource: {
                        Type: 'AWS::Something',
                        Properties: {
                          Prop: 'new-value',
                        },
                      },
                    },
                  },
                  physicalName: undefined,
                  nestedStackTemplates: {},
                } as NestedStackTemplates,
              },
              physicalName: undefined,
            },
          },
        });
      }
      return Promise.resolve({
        deployedRootTemplate: {},
        nestedStacks: {},
      });
    });
  });

  test('diff can diff nested stacks and display the nested stack logical ID if has not been deployed or otherwise has no physical name', async () => {
    // GIVEN
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['Parent'],
      stream: buffer,
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
      .replace(/[ \t]+$/mg, '');
    expect(plainTextOutput.trim()).toEqual(`Stack Parent
Resources
[~] AWS::CloudFormation::Stack AdditionChild
 └─ [~] TemplateURL
     ├─ [-] addition-child-url-new
     └─ [+] addition-child-url-old
[~] AWS::CloudFormation::Stack DeletionChild
 └─ [~] TemplateURL
     ├─ [-] deletion-child-url-new
     └─ [+] deletion-child-url-old
[~] AWS::CloudFormation::Stack ChangedChild
 └─ [~] TemplateURL
     ├─ [-] changed-child-url-new
     └─ [+] changed-child-url-old

Stack AdditionChild
Resources
[~] AWS::Something SomeResource
 └─ [+] Prop
     └─ added-value

Stack DeletionChild
Resources
[~] AWS::Something SomeResource
 └─ [-] Prop
     └─ value-to-be-removed

Stack ChangedChild
Resources
[~] AWS::Something SomeResource
 └─ [~] Prop
     ├─ [-] old-value
     └─ [+] new-value

Stack newChild
Resources
[+] AWS::Something SomeResource

Stack newGrandChild
Resources
[+] AWS::Something SomeResource


✨  Number of stacks with differences: 6`);

    expect(exitCode).toBe(0);
  });

  test('diff falls back to non-changeset diff for nested stacks', async () => {
    // GIVEN
    const changeSetSpy = jest.spyOn(cfn, 'waitForChangeSet');
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['Parent'],
      stream: buffer,
      changeSet: true,
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
      .replace(/[ \t]+$/mg, '');
    expect(plainTextOutput.trim()).toEqual(`Stack Parent
Resources
[~] AWS::CloudFormation::Stack AdditionChild
 └─ [~] TemplateURL
     ├─ [-] addition-child-url-new
     └─ [+] addition-child-url-old
[~] AWS::CloudFormation::Stack DeletionChild
 └─ [~] TemplateURL
     ├─ [-] deletion-child-url-new
     └─ [+] deletion-child-url-old
[~] AWS::CloudFormation::Stack ChangedChild
 └─ [~] TemplateURL
     ├─ [-] changed-child-url-new
     └─ [+] changed-child-url-old

Stack AdditionChild
Resources
[~] AWS::Something SomeResource
 └─ [+] Prop
     └─ added-value

Stack DeletionChild
Resources
[~] AWS::Something SomeResource
 └─ [-] Prop
     └─ value-to-be-removed

Stack ChangedChild
Resources
[~] AWS::Something SomeResource
 └─ [~] Prop
     ├─ [-] old-value
     └─ [+] new-value

Stack newChild
Resources
[+] AWS::Something SomeResource

Stack newGrandChild
Resources
[+] AWS::Something SomeResource


✨  Number of stacks with differences: 6`);

    expect(exitCode).toBe(0);
    expect(changeSetSpy).not.toHaveBeenCalled();
  });
});

class StringWritable extends Writable {
  public data: string;
  private readonly _decoder: StringDecoder;

  constructor(options: any = {}) {
    super(options);
    this._decoder = new StringDecoder(options && options.defaultEncoding);
    this.data = '';
  }

  public _write(chunk: any, encoding: string, callback: (error?: Error | undefined) => void) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }

  public _final(callback: (error?: Error | null) => void) {
    this.data += this._decoder.end();
    callback();
  }
}
