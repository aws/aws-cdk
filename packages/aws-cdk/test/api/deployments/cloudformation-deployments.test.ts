import * as cxapi from '@aws-cdk/cx-api';
import {
  ContinueUpdateRollbackCommand,
  DescribeStackEventsCommand,
  DescribeStacksCommand,
  ListStackResourcesCommand,
  RollbackStackCommand,
  type StackResourceSummary,
  StackStatus,
  DescribeChangeSetCommand,
  ChangeSetStatus,
  CreateChangeSetCommand,
} from '@aws-sdk/client-cloudformation';
import { GetParameterCommand } from '@aws-sdk/client-ssm';
import { CloudFormationStack, createChangeSet, Deployments } from '../../../lib/api/deployments';
import { deployStack } from '../../../lib/api/deployments/deploy-stack';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { ToolkitInfo } from '../../../lib/api/toolkit-info';
import { testStack } from '../../util';
import {
  mockBootstrapStack,
  mockCloudFormationClient,
  MockSdk,
  MockSdkProvider,
  mockSSMClient,
  restoreSdkMocksToDefault,
  setDefaultSTSMocks,
} from '../../util/mock-sdk';
import { FakeCloudformationStack } from '../fake-cloudformation-stack';

jest.mock('../../../lib/api/deployments/deploy-stack');
jest.mock('../../../lib/api/deployments/asset-publishing');

let sdkProvider: MockSdkProvider;
let sdk: MockSdk;
let deployments: Deployments;
let mockToolkitInfoLookup: jest.Mock;
let currentCfnStackResources: { [key: string]: StackResourceSummary[] };
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  sdk = new MockSdk();
  deployments = new Deployments({ sdkProvider });

  currentCfnStackResources = {};
  restoreSdkMocksToDefault();
  ToolkitInfo.lookup = mockToolkitInfoLookup = jest
    .fn()
    .mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo('TestBootstrapStack'));
  setDefaultSTSMocks();
});

function mockSuccessfulBootstrapStackLookup(props?: Record<string, any>) {
  const outputs = {
    BucketName: 'BUCKET_NAME',
    BucketDomainName: 'BUCKET_ENDPOINT',
    BootstrapVersion: '1',
    ...props,
  };

  const fakeStack = mockBootstrapStack({
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
  expect(deployStack).toHaveBeenCalledWith(
    expect.objectContaining({
      hotswap: HotswapMode.FALL_BACK,
    }),
  );
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

  expect(deployStack).toHaveBeenCalledWith(
    expect.objectContaining({
      roleArn: 'bloop:here:123456789012',
    }),
  );
});

test('role with placeholders is assumed if assumerole is given', async () => {
  const mockForEnvironment = jest.fn().mockImplementation(() => {
    return { sdk: new MockSdk() };
  });
  sdkProvider.forEnvironment = mockForEnvironment;

  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
      properties: {
        assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
      },
    }),
  });

  expect(mockForEnvironment).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.objectContaining({
      assumeRoleArn: 'bloop:here:123456789012',
    }),
  );
});

test('deployment fails if bootstrap stack is missing', async () => {
  await expect(
    deployments.deployStack({
      stack: testStack({
        stackName: 'boop',
        properties: {
          assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
          requiresBootstrapStackVersion: 99,
        },
      }),
    }),
  ).rejects.toThrow(/requires a bootstrap stack/);
});

test('deployment fails if bootstrap stack is too old', async () => {
  mockSuccessfulBootstrapStackLookup({
    BootstrapVersion: 5,
  });
  setDefaultSTSMocks();

  await expect(
    deployments.deployStack({
      stack: testStack({
        stackName: 'boop',
        properties: {
          assumeRoleArn: 'bloop:${AWS::Region}:${AWS::AccountId}',
          requiresBootstrapStackVersion: 99,
        },
      }),
    }),
  ).rejects.toThrow(/requires bootstrap stack version '99', found '5'/);
});

test.each([false, true])(
  'if toolkit stack be found: %p but SSM parameter name is present deployment succeeds',
  async (canLookup) => {
    if (canLookup) {
      mockSuccessfulBootstrapStackLookup({
        BootstrapVersion: 2,
      });
    }
    setDefaultSTSMocks();

    mockSSMClient.on(GetParameterCommand).resolves({
      Parameter: {
        Value: '99',
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

    expect(mockSSMClient).toHaveReceivedCommandWith(GetParameterCommand, {
      Name: '/some/parameter',
    });
  },
);

test('readCurrentTemplateWithNestedStacks() can handle non-Resources in the template', async () => {
  const stackSummary = stackSummaryOf(
    'NestedStack',
    'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
  );

  pushStackResourceSummaries('ParentOfStackWithOutputAndParameter', stackSummary);

  mockCloudFormationClient.on(ListStackResourcesCommand).resolvesOnce({
    StackResourceSummaries: [stackSummary],
  });
  mockCloudFormationClient.on(DescribeStacksCommand).resolvesOnce({
    Stacks: [
      {
        StackName: 'NestedStack',
        RootId: 'StackId',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
      },
    ],
  });

  const cfnStack = new FakeCloudformationStack({
    stackName: 'ParentOfStackWithOutputAndParameter',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = async (_, stackName: string) => {
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
  };

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

  // WHEN
  const rootTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);
  const deployedTemplate = rootTemplate.deployedRootTemplate;
  const nestedStacks = rootTemplate.nestedStacks;

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
  const rootSummary = stackSummaryOf(
    'NestedStack',
    'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
  );

  const nestedStackSummary = [
    stackSummaryOf(
      'GrandChildStackA',
      'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackA/abcd',
    ),
    stackSummaryOf(
      'GrandChildStackB',
      'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackB/abcd',
    ),
  ];

  const grandChildAStackSummary = stackSummaryOf(
    'GrandChildA',
    'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildA/abcd',
  );

  const grandchildBStackSummary = stackSummaryOf(
    'GrandChildB',
    'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildB/abcd',
  );

  pushStackResourceSummaries('MultiLevelRoot', rootSummary);
  pushStackResourceSummaries('NestedStack', ...nestedStackSummary);
  pushStackResourceSummaries('GrandChildStackA', grandChildAStackSummary);
  pushStackResourceSummaries('GrandChildStackB', grandchildBStackSummary);

  mockCloudFormationClient
    .on(ListStackResourcesCommand)
    .resolvesOnce({
      StackResourceSummaries: [rootSummary],
    })
    .resolvesOnce({
      StackResourceSummaries: nestedStackSummary,
    })
    .resolvesOnce({
      StackResourceSummaries: [grandChildAStackSummary],
    })
    .resolvesOnce({
      StackResourceSummaries: [grandchildBStackSummary],
    });

  mockCloudFormationClient
    .on(DescribeStacksCommand)
    .resolvesOnce({
      Stacks: [
        {
          StackName: 'NestedStack',
          RootId: 'StackId',
          CreationTime: new Date(),
          StackStatus: StackStatus.CREATE_COMPLETE,
        },
      ],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackName: 'GrandChildStackA',
          RootId: 'StackId',
          ParentId: 'NestedStack',
          CreationTime: new Date(),
          StackStatus: StackStatus.CREATE_COMPLETE,
        },
      ],
    })
    .resolvesOnce({
      Stacks: [
        {
          StackName: 'GrandChildStackB',
          RootId: 'StackId',
          ParentId: 'NestedStack',
          CreationTime: new Date(),
          StackStatus: StackStatus.CREATE_COMPLETE,
        },
      ],
    });
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

  // WHEN
  const rootTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);
  const deployedTemplate = rootTemplate.deployedRootTemplate;
  const nestedStacks = rootTemplate.nestedStacks;

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
  CloudFormationStack.lookup = async (_cfn, _stackName: string) => {
    cfnStack.template = async () => ({});

    return cfnStack;
  };
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

  pushStackResourceSummaries(
    'CachingRoot',
    stackSummaryOf(
      'NestedStackA',
      'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
    ),
    stackSummaryOf(
      'NestedStackB',
      'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
    ),
  );

  // WHEN
  await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(mockCloudFormationClient).toHaveReceivedCommandTimes(ListStackResourcesCommand, 1);
});

test('rollback stack assumes role if necessary', async () => {
  const mockForEnvironment = jest.fn().mockImplementation(() => {
    return { sdk };
  });
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

  expect(mockForEnvironment).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.objectContaining({
      assumeRoleArn: 'bloop:here:123456789012',
    }),
  );
});

test('rollback stack allows rolling back from UPDATE_FAILED', async () => {
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
  expect(mockCloudFormationClient).toHaveReceivedCommand(RollbackStackCommand);
});

test('rollback stack allows continue rollback from UPDATE_ROLLBACK_FAILED', async () => {
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
  expect(mockCloudFormationClient).toHaveReceivedCommand(ContinueUpdateRollbackCommand);
});

test('rollback stack fails in UPDATE_COMPLETE state', async () => {
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

test('continue rollback stack with force ignores any failed resources', async () => {
  // GIVEN
  givenStacks({
    '*': { template: {}, stackStatus: 'UPDATE_ROLLBACK_FAILED' },
  });
  mockCloudFormationClient.on(DescribeStackEventsCommand).resolves({
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
  expect(mockCloudFormationClient).toHaveReceivedCommandWith(ContinueUpdateRollbackCommand, {
    ResourcesToSkip: ['Xyz'],
    StackName: 'boop',
    ClientRequestToken: expect.anything(),
  });
});

test('readCurrentTemplateWithNestedStacks() successfully ignores stacks without metadata', async () => {
  // GIVEN
  const rootSummary = stackSummaryOf(
    'WithMetadata',
    'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
  );

  pushStackResourceSummaries('MetadataRoot', rootSummary);
  mockCloudFormationClient.on(ListStackResourcesCommand).resolves({
    StackResourceSummaries: [rootSummary],
  });

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
      WithoutMetadata: {
        // Unchanged
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
      },
      WithEmptyMetadata: {
        // Unchanged
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
        },
        Metadata: {},
      },
      WithMetadata: {
        // Changed
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

describe('stackExists', () => {
  test.each([
    [false, 'deploy:here:123456789012'],
    [true, 'lookup:here:123456789012'],
  ])('uses lookup role if requested: %p', async (tryLookupRole, expectedRoleArn) => {
    const mockForEnvironment = jest.fn().mockImplementation(() => { return { sdk: new MockSdk() }; });
    sdkProvider.forEnvironment = mockForEnvironment;
    givenStacks({
      '*': { template: {} },
    });

    const result = await deployments.stackExists({
      stack: testStack({
        stackName: 'boop',
        properties: {
          assumeRoleArn: 'deploy:${AWS::Region}:${AWS::AccountId}',
          lookupRole: {
            arn: 'lookup:${AWS::Region}:${AWS::AccountId}',
          },
        },
      }),
      tryLookupRole,
    });

    expect(result).toBeTruthy();
    expect(mockForEnvironment).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.objectContaining({
      assumeRoleArn: expectedRoleArn,
    }));
  });
});

test('tags are passed along to create change set', async () => {
  mockCloudFormationClient.on(DescribeChangeSetCommand).resolves({
    Status: ChangeSetStatus.CREATE_COMPLETE,
  });

  const stack: any = {};
  stack.tags = { SomeKey: 'SomeValue' };
  for (const methodName of Object.getOwnPropertyNames(cxapi.CloudFormationStackArtifact.prototype)) {
    stack[methodName] = jest.fn();
  }

  await createChangeSet({
    stack: stack,
    cfn: new MockSdk().cloudFormation(),
    changeSetName: 'foo',
    willExecute: false,
    exists: true,
    uuid: '142DF82A-8ED8-4944-8EEB-A5BAE141F13F',
    bodyParameter: {},
    parameters: {},
  });

  expect(mockCloudFormationClient).toHaveReceivedCommandWith(CreateChangeSetCommand, {
    Tags: [{ Key: 'SomeKey', Value: 'SomeValue' }],
  });
});

function pushStackResourceSummaries(stackName: string, ...items: StackResourceSummary[]) {
  if (!currentCfnStackResources[stackName]) {
    currentCfnStackResources[stackName] = [];
  }

  currentCfnStackResources[stackName].push(...items);
}

function stackSummaryOf(logicalId: string, resourceType: string, physicalResourceId: string): StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: StackStatus.CREATE_COMPLETE,
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
