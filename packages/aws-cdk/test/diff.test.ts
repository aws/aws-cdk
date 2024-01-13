/* eslint-disable import/order */
import { Writable } from 'stream';
import { StringDecoder } from 'string_decoder';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
//import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { /*instanceMockFrom,*/ MockCloudExecutable, testStack } from './util';
import { MockToolkitEnvironment } from './util/nested-stack-mocks';
import { Deployments } from '../lib/api/deployments';
import { CdkToolkit } from '../lib/cdk-toolkit';
// import * as cfn from '../lib/api/util/cloudformation';
import * as fs from 'fs';
import * as path from 'path';
import * as setup from './api/hotswap/hotswap-test-setup';

let cloudExecutable: MockCloudExecutable;
let cloudFormation: Deployments;
let toolkit: CdkToolkit;

describe('top-level stacks', () => {
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

    //cloudFormation = instanceMockFrom(Deployments);
    cloudFormation = new Deployments({
      sdkProvider: cloudExecutable.sdkProvider,
    });

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    /*
    cloudFormation.readCurrentTemplateWithNestedStacks.mockImplementation((stackArtifact: CloudFormationStackArtifact) => {
      if (stackArtifact.stackName === 'D') {
        return Promise.resolve({
          deployedRootTemplate: { resource: 'D' },
          nestedStackCount: 0,
          nestedStacks: {},
        });
      }
      return Promise.resolve({
        deployedRootTemplate: {},
        nestedStackCount: 0,
        nestedStacks: {},
      });
    });
    cloudFormation.deployStack.mockImplementation((options) => Promise.resolve({
      noOp: true,
      outputs: {},
      stackArn: '',
      stackArtifact: options.stack,
    }));
    */
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

  test('diff counts stack diffs, not resource diffs', async () => {
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

  test('diff exists with 1 and fail set to `true` when the diff is not empty', async () => {
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

  test('diff exists with 1 and fail set to `true` with one non-empty diff and one empty diff', async () => {
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
  // These tests must first create the nested stack and write it's template to disk, because otherwise the rootStack will not be able to find it, and complain
  // Then, 
  // 
  beforeEach(() => {
    cloudExecutable = new MockCloudExecutable({
      stacks: [{
        stackName: 'Parent',
        template: {},
      }],
    });

    cloudFormation = new Deployments({
      sdkProvider: cloudExecutable.sdkProvider,
    });

    toolkit = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
    });

    /*
    cloudFormation.readCurrentTemplateWithNestedStacks.mockImplementation((stackArtifact: CloudFormationStackArtifact) => {
      if (stackArtifact.stackName === 'Parent') {
        stackArtifact.template.Resources = {
          AdditionChild: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Prop: 'added-value',
                },
              },
            },
          },
          DeletionChild: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
              },
            },
          },
          ChangedChild: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Prop: 'new-value',
                },
              },
            },
          },
        };
        return Promise.resolve({
          deployedRootTemplate: {
            Resources: {
              AdditionChild: {
                Type: 'AWS::CloudFormation::Stack',
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                  },
                },
              },
              DeletionChild: {
                Type: 'AWS::CloudFormation::Stack',
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'value-to-be-removed',
                    },
                  },
                },
              },
              ChangedChild: {
                Type: 'AWS::CloudFormation::Stack',
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'old-value',
                    },
                  },
                },
              },
            },
          },
          nestedStackCount: 3,
          nestedStacks: {
            AdditionChild: {
              deployedTemplate: {
                Type: 'AWS::CloudFormation::Stack',
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                  },
                },
              },
              generatedTemplate: {
                Type: 'AWS::CloudFormation::Stack',
                Resources: {
                  SomeResource: {
                    Type: 'AWS::Something',
                    Properties: {
                      Prop: 'added-value',
                    },
                  },
                },
              },
            },
          },
        });
      }
      return Promise.resolve({
        deployedTemplate: {},
        nestedStackCount: 0,
        nestedStackNames: {},
      });
    });
    */
  });

  test('foo', async () => {
    // GIVEN
    // generated template
    const nestedStack = testStack({
      stackName: 'NestedStack',
      template: {
        Resources: {
          ReInvent: {
            Type: 'AWS::ReInvent::Convention',
            Properties: {
              AttendeeCount: 500000,
            },
          },
        },
      },
    });

    // deployed template
    fs.writeFileSync(path.join(__dirname, 'nested-stack-templates/simple-nested-stack.json'), JSON.stringify(nestedStack.template));
    const rootStack = testStack({
      stackName: 'Parent',
      template: {
        Resources: {
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.amazon.com',
            },
            Metadata: {
              'aws:asset:path': path.join('simple-nested-stack.json'),
            },
          },
        },
      },
    });

    const mockToolkitEnv = new MockToolkitEnvironment({
      stacks: [rootStack],
    });

    setup.setupHotswapNestedStackTests('ParentStack', mockToolkitEnv.sdkProvider);
    setup.pushNestedStackResourceSummaries('Parent',
      setup.stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
        'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
      ),
    );

    // deployed template value
    nestedStack.template.Resources.ReInvent.Properties.AttendeeCount = 5;

    setup.addTemplateToCloudFormationLookupMock(rootStack);
    setup.addTemplateToCloudFormationLookupMock(nestedStack);

    // WHEN
    // generated template value
    rootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazoff.com';

    // GIVEN
    //const buffer = new StringWritable();

    // WHEN
    const exitCode = await mockToolkitEnv.toolkit.diff({
      stackNames: ['Parent'],
      stream: process.stderr,
    });

    fs.rmSync(path.join(__dirname, 'nested-stack-templates/simple-nested-stack.json'));

    expect(exitCode).toEqual(1);
  });

  /*
  test('diff can diff nested stacks', async () => {
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
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [+] Added: .Properties
[~] AWS::CloudFormation::Stack DeletionChild
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [-] Removed: .Properties
[~] AWS::CloudFormation::Stack ChangedChild
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [~] .Properties:
             └─ [~] .Prop:
                 ├─ [-] old-value
                 └─ [+] new-value


✨  Number of stacks with differences: 4`);

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
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [+] Added: .Properties
[~] AWS::CloudFormation::Stack DeletionChild
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [-] Removed: .Properties
[~] AWS::CloudFormation::Stack ChangedChild
 └─ [~] Resources
     └─ [~] .SomeResource:
         └─ [~] .Properties:
             └─ [~] .Prop:
                 ├─ [-] old-value
                 └─ [+] new-value


✨  Number of stacks with differences: 4`);

    expect(exitCode).toBe(0);
    expect(changeSetSpy).not.toHaveBeenCalled();
  });
*/
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
