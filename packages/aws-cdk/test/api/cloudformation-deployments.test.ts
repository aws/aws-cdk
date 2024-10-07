/* eslint-disable import/order */
jest.mock('../../lib/api/deploy-stack');
jest.mock('../../lib/util/asset-publishing');

import { CloudFormation } from 'aws-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';
import { Deployments } from '../../lib/api/deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { HotswapMode } from '../../lib/api/hotswap/common';
import { ToolkitInfo } from '../../lib/api/toolkit-info';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';
import { testStack } from '../util';
import { mockBootstrapStack, MockedHandlerType, MockSdkProvider } from '../util/mock-sdk';

let sdkProvider: MockSdkProvider;
let deployments: Deployments;
let mockToolkitInfoLookup: jest.Mock;
let currentCfnStackResources: { [key: string]: CloudFormation.StackResourceSummary[] };
let numberOfTimesListStackResourcesWasCalled: number;
let mockRollbackStack: MockedHandlerType<CloudFormation['rollbackStack']> = jest.fn();
let mockContinueUpdateRollback: MockedHandlerType<CloudFormation['continueUpdateRollback']> = jest.fn();
let mockDescribeStackEvents: MockedHandlerType<CloudFormation['describeStackEvents']> = jest.fn();
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  deployments = new Deployments({ sdkProvider });

  numberOfTimesListStackResourcesWasCalled = 0;
  currentCfnStackResources = {};
  sdkProvider.stubCloudFormation({
    listStackResources: ({ StackName: stackName }) => {
      numberOfTimesListStackResourcesWasCalled++;
      const stackResources = currentCfnStackResources[stackName];
      if (!stackResources) {
        throw new Error(`Stack with id ${stackName} does not exist`);
      }
      return {
        StackResourceSummaries: stackResources,
      };
    },
    rollbackStack: mockRollbackStack,
    continueUpdateRollback: mockContinueUpdateRollback,
    describeStackEvents: mockDescribeStackEvents,
  });

  ToolkitInfo.lookup = mockToolkitInfoLookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo('TestBootstrapStack'));
});

function mockSuccessfulBootstrapStackLookup(props?: Record<string, any>) {
  const outputs = {
    BucketName: 'BUCKET_NAME',
    BucketDomainName: 'BUCKET_ENDPOINT',
    BootstrapVersion: '1',
    ...props,
  };

  const fakeStack = mockBootstrapStack(sdkProvider.sdk, {
    Outputs: Object.entries(outputs).map(([k, v]) => ({
      OutputKey: k,
      OutputValue: `${v}`,
    })),
  });

  mockToolkitInfoLookup.mockResolvedValue(ToolkitInfo.fromStack(fakeStack));
}

test('passes through hotswap=true to deployStack()', async () => {
  // WHEN
  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
    }),
    hotswap: HotswapMode.FALL_BACK,
  });

  // THEN
  expect(deployStack).toHaveBeenCalledWith(expect.objectContaining({
    hotswap: HotswapMode.FALL_BACK,
  }));
});

test('placeholders are substituted in CloudFormation execution role', async () => {
  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        cloudFormationExecutionRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(deployStack).toHaveBeenCalledWith(expect.objectContaining({
    roleArn: 'bloop:here:123456789012',
  }));
});

test('role with placeholders is assumed if assumerole is given', async () => {
  const mockForEnvironment = jest.fn().mockImplementation(() => { return { sdk: sdkProvider.sdk }; });
  sdkProvider.forEnvironment = mockForEnvironment;

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(mockForEnvironment).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
    assumeRoleArn: 'bloop:here:123456789012',
  }));
});

test('deployment fails if bootstrap stack is missing', async () => {
  await expect(deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
      },
    }),
  })).rejects.toThrow(/requires a bootstrap stack/);
});

test('deployment fails if bootstrap stack is too old', async () => {
  mockSuccessfulBootstrapStackLookup({
    BootstrapVersion: 5,
  });

  await expect(deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
      },
    }),
  })).rejects.toThrow(/requires bootstrap stack version '99', found '5'/);
});

test.each([false, true])('if toolkit stack be found: %p but SSM parameter name is present deployment succeeds', async (canLookup) => {
  if (canLookup) {
    mockSuccessfulBootstrapStackLookup({
      BootstrapVersion: 2,
    });
  }

  let requestedParameterName: string;
  sdkProvider.stubSSM({
    getParameter(request) {
      requestedParameterName = request.Name;
      return {
        Parameter: {
          Value: '99',
        },
      };
    },
  });

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
        requiresBootstrapStackVersion: 99,
        bootstrapStackVersionSsmParameter: '/some/parameter',
      },
    }),
  });

  expect(requestedParameterName!).toEqual('/some/parameter');
});

test('readCurrentTemplateWithNestedStacks() can handle non-Resources in the template', async () => {
  const cfnStack = new FakeCloudformationStack({
    stackName: 'ParentOfStackWithOutputAndParameter',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = (async (_, stackName: string) => {
    switch (stackName) {
      case 'ParentOfStackWithOutputAndParameter':
        cfnStack.template = async () => ({
          Resources: {
            NestedStack: {
              Type: 'AWS::CloudFormation::Stack',
              Properties: {
                TemplateURL: 'https://www.magic-url.com',
              },
              Metadata: {
                'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
              },
            },
          },
        });
        break;

      case 'NestedStack':
        cfnStack.template = async () => ({
          Resources: {
            NestedResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
          },
          Parameters: {
            NestedParam: {
              Type: 'String',
            },
          },
          Outputs: {
            NestedOutput: {
              Value: {
                Ref: 'NestedResource',
              },
            },
          },
        });
        break;

      default:
        throw new Error('unknown stack name ' + stackName + ' found');
    }

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'ParentOfStackWithOutputAndParameter',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('ParentOfStackWithOutputAndParameter',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );

  // WHEN
  const deployedTemplate = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).deployedRootTemplate;
  const nestedStacks = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).nestedStacks;

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
        },
      },
    },
  });

  expect(rootStack.template).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
        },
      },
    },
  });

  expect(nestedStacks).toEqual({
    NestedStack: {
      deployedTemplate: {
        Outputs: {
          NestedOutput: {
            Value: {
              Ref: 'NestedResource',
            },
          },
        },
        Parameters: {
          NestedParam: {
            Type: 'String',
          },
        },
        Resources: {
          NestedResource: {
            Properties: {
              Property: 'old-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      generatedTemplate: {
        Outputs: {
          NestedOutput: {
            Value: {
              Ref: 'NestedResource',
            },
          },
        },
        Parameters: {
          NestedParam: {
            Type: 'Number',
          },
        },
        Resources: {
          NestedResource: {
            Properties: {
              Property: 'new-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      nestedStackTemplates: {},
      physicalName: 'NestedStack',
    },
  });
});

test('readCurrentTemplateWithNestedStacks() with a 3-level nested + sibling structure works', async () => {
  givenStacks({
    MultiLevelRoot: {
      template: {
        Resources: {
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
            },
          },
        },
      },
    },
    NestedStack: {
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
          GrandChildStackA: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
          GrandChildStackB: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      },
    },
    GrandChildStackA: {
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      },
    },
    GrandChildStackB: {
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      },
    },
  });

  const rootStack = testStack({
    stackName: 'MultiLevelRoot',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('MultiLevelRoot',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );
  pushStackResourceSummaries('NestedStack',
    stackSummaryOf('GrandChildStackA', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackA/abcd',
    ),
    stackSummaryOf('GrandChildStackB', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackB/abcd',
    ),
  );
  pushStackResourceSummaries('GrandChildStackA',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildA/abcd',
    ),
  );
  pushStackResourceSummaries('GrandChildStackB',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildB/abcd',
    ),
  );

  // WHEN
  const deployedTemplate = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).deployedRootTemplate;
  const nestedStacks = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).nestedStacks;

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
        },
      },
    },
  });

  expect(rootStack.template).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
        },
      },
    },
  });

  expect(nestedStacks).toEqual({
    NestedStack: {
      deployedTemplate: {
        Resources: {
          GrandChildStackA: {
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Type: 'AWS::CloudFormation::Stack',
          },
          GrandChildStackB: {
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Type: 'AWS::CloudFormation::Stack',
          },
          SomeResource: {
            Properties: {
              Property: 'old-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      generatedTemplate: {
        Resources: {
          GrandChildStackA: {
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Type: 'AWS::CloudFormation::Stack',
          },
          GrandChildStackB: {
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Type: 'AWS::CloudFormation::Stack',
          },
          SomeResource: {
            Properties: {
              Property: 'new-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      nestedStackTemplates: {
        GrandChildStackA: {
          deployedTemplate: {
            Resources: {
              SomeResource: {
                Properties: {
                  Property: 'old-value',
                },
                Type: 'AWS::Something',
              },
            },
          },
          generatedTemplate: {
            Resources: {
              SomeResource: {
                Properties: {
                  Property: 'new-value',
                },
                Type: 'AWS::Something',
              },
            },
          },
          nestedStackTemplates: {},
          physicalName: 'GrandChildStackA',
        },
        GrandChildStackB: {
          deployedTemplate: {
            Resources: {
              SomeResource: {
                Properties: {
                  Property: 'old-value',
                },
                Type: 'AWS::Something',
              },
            },
          },
          generatedTemplate: {
            Resources: {
              SomeResource: {
                Properties: {
                  Property: 'new-value',
                },
                Type: 'AWS::Something',
              },
            },
          },
          nestedStackTemplates: {},
          physicalName: 'GrandChildStackB',
        },
      },
      physicalName: 'NestedStack',
    },
  });
});

test('readCurrentTemplateWithNestedStacks() on an undeployed parent stack with an (also undeployed) nested stack works', async () => {
  // GIVEN
  const cfnStack = new FakeCloudformationStack({
    stackName: 'UndeployedParent',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = (async (_cfn, _stackName: string) => {
    cfnStack.template = async () => ({});

    return cfnStack;
  });
  const rootStack = testStack({
    stackName: 'UndeployedParent',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-resource-one-stack-stack.nested.template.json',
          },
        },
      },
    },
  });

  // WHEN
  const deployedTemplate = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).deployedRootTemplate;
  const nestedStacks = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).nestedStacks;

  // THEN
  expect(deployedTemplate).toEqual({});
  expect(nestedStacks).toEqual({
    NestedStack: {
      deployedTemplate: {},
      generatedTemplate: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'new-value',
            },
          },
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      },
      nestedStackTemplates: {
        NestedStack: {
          deployedTemplate: {},
          generatedTemplate: {
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Property: 'new-value',
                },
              },
            },
          },
          nestedStackTemplates: {},
        },
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() caches calls to listStackResources()', async () => {
  // GIVEN
  givenStacks({
    '*': {
      template: {
        Resources: {
          NestedStackA: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
          NestedStackB: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      },
    },
  });

  const rootStack = testStack({
    stackName: 'CachingRoot',
    template: {
      Resources: {
        NestedStackA: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
        NestedStackB: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('CachingRoot',
    stackSummaryOf('NestedStackA', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
    ),
    stackSummaryOf('NestedStackB', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
    ),
  );

  // WHEN
  await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(numberOfTimesListStackResourcesWasCalled).toEqual(1);
});

test('rollback stack assumes role if necessary', async() => {
  const mockForEnvironment = jest.fn().mockImplementation(() => { return { sdk: sdkProvider.sdk }; });
  sdkProvider.forEnvironment = mockForEnvironment;
  givenStacks({
    '*': { template: {} },
  });

  await deployments.rollbackStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
    validateBootstrapStackVersion: false,
  });

  expect(mockForEnvironment).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
    assumeRoleArn: 'bloop:here:123456789012',
  }));
});

test('rollback stack allows rolling back from UPDATE_FAILED', async() => {
  // GIVEN
  givenStacks({
    '*': { template: {}, stackStatus: 'UPDATE_FAILED' },
  });

  // WHEN
  await deployments.rollbackStack({
    stack: testStack({ stackName: 'boop' }),
    validateBootstrapStackVersion: false,
  });

  // THEN
  expect(mockRollbackStack).toHaveBeenCalled();
});

test('rollback stack allows continue rollback from UPDATE_ROLLBACK_FAILED', async() => {
  // GIVEN
  givenStacks({
    '*': { template: {}, stackStatus: 'UPDATE_ROLLBACK_FAILED' },
  });

  // WHEN
  await deployments.rollbackStack({
    stack: testStack({ stackName: 'boop' }),
    validateBootstrapStackVersion: false,
  });

  // THEN
  expect(mockContinueUpdateRollback).toHaveBeenCalled();
});

test('rollback stack fails in UPDATE_COMPLETE state', async() => {
  // GIVEN
  givenStacks({
    '*': { template: {}, stackStatus: 'UPDATE_COMPLETE' },
  });

  // WHEN
  const response = await deployments.rollbackStack({
    stack: testStack({ stackName: 'boop' }),
    validateBootstrapStackVersion: false,
  });

  // THEN
  expect(response.notInRollbackableState).toBe(true);
});

test('continue rollback stack with force ignores any failed resources', async() => {
  // GIVEN
  givenStacks({
    '*': { template: {}, stackStatus: 'UPDATE_ROLLBACK_FAILED' },
  });
  mockDescribeStackEvents.mockReturnValue({
    StackEvents: [
      {
        EventId: 'asdf',
        StackId: 'stack/MyStack',
        StackName: 'MyStack',
        Timestamp: new Date(),
        LogicalResourceId: 'Xyz',
        ResourceStatus: 'UPDATE_FAILED',
      },
    ],
  });

  // WHEN
  await deployments.rollbackStack({
    stack: testStack({ stackName: 'boop' }),
    validateBootstrapStackVersion: false,
    force: true,
  });

  // THEN
  expect(mockContinueUpdateRollback).toHaveBeenCalledWith(expect.objectContaining({
    ResourcesToSkip: ['Xyz'],
  }));
});

test('readCurrentTemplateWithNestedStacks() succesfully ignores stacks without metadata', async () => {
  // GIVEN
  givenStacks({
    'MetadataRoot': {
      template: {
        Resources: {
          WithMetadata: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      },
    },
    '*': {
      template: {
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      },
    },
  });

  const rootStack = testStack({
    stackName: 'MetadataRoot',
    template: {
      Resources: {
        WithoutMetadata: {
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Type: 'AWS::CloudFormation::Stack',
        },
        WithEmptyMetadata: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {},
        },
        WithMetadata: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('MetadataRoot', stackSummaryOf('WithMetadata', 'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
  ));

  // WHEN
  const deployedTemplate = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).deployedRootTemplate;
  const nestedStacks = (await deployments.readCurrentTemplateWithNestedStacks(rootStack)).nestedStacks;

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      WithMetadata: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });

  expect(rootStack.template).toEqual({
    Resources: {
      WithoutMetadata: { // Unchanged
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
      },
      WithEmptyMetadata: { // Unchanged
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {},
      },
      WithMetadata: { // Changed
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });
  expect(nestedStacks).toEqual({
    WithMetadata: {
      deployedTemplate: {
        Resources: {
          SomeResource: {
            Properties: {
              Property: 'old-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      generatedTemplate: {
        Resources: {
          SomeResource: {
            Properties: {
              Property: 'new-value',
            },
            Type: 'AWS::Something',
          },
        },
      },
      physicalName: 'one-resource-stack',
      nestedStackTemplates: {},
    },
  });
});

function pushStackResourceSummaries(stackName: string, ...items: CloudFormation.StackResourceSummary[]) {
  if (!currentCfnStackResources[stackName]) {
    currentCfnStackResources[stackName] = [];
  }

  currentCfnStackResources[stackName].push(...items);
}

function stackSummaryOf(logicalId: string, resourceType: string, physicalResourceId: string): CloudFormation.StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: 'CREATE_COMPLETE',
    LastUpdatedTimestamp: new Date(),
  };
}

function givenStacks(stacks: Record<string, { template: any; stackStatus?: string }>) {
  jest.spyOn(CloudFormationStack, 'lookup').mockImplementation(async (_, stackName) => {
    let stack = stacks[stackName];
    if (!stack) {
      stack = stacks['*'];
    }
    if (stack) {
      const cfnStack = new FakeCloudformationStack({
        stackName,
        stackId: `stack/${stackName}`,
        stackStatus: stack.stackStatus,
      });
      cfnStack.setTemplate(stack.template);
      return cfnStack;
    } else {
      return new FakeCloudformationStack({ stackName });
    }
  });
}