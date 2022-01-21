jest.mock('../../lib/api/deploy-stack');

import { CloudFormation } from 'aws-sdk';
import { CloudFormationDeployments } from '../../lib/api/cloudformation-deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { ToolkitInfo } from '../../lib/api/toolkit-info';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';
import { instanceMockFrom, testStack } from '../util';
import { mockBootstrapStack, MockSdkProvider } from '../util/mock-sdk';

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
let mockToolkitInfoLookup: jest.Mock;
let currentCfnStackResources: { [key: string]: CloudFormation.StackResourceSummary[] };
let numberOfTimesListStackResourcesWasCalled: number;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider();
  deployments = new CloudFormationDeployments({ sdkProvider });

  numberOfTimesListStackResourcesWasCalled = 0;
  currentCfnStackResources = {};
  sdkProvider.stubCloudFormation({
    listStackResources: ({ StackName: stackName }) => {
      numberOfTimesListStackResourcesWasCalled++;
      if (!currentCfnStackResources[stackName]) {
        throw new Error(`Stack with id ${stackName} does not exist`);
      }
      return {
        StackResourceSummaries: currentCfnStackResources[stackName],
      };
    },
  });

  ToolkitInfo.lookup = mockToolkitInfoLookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo(sdkProvider.sdk));
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

  mockToolkitInfoLookup.mockResolvedValue(ToolkitInfo.fromStack(fakeStack, sdkProvider.sdk));
}

test('passes through hotswap=true to deployStack()', async () => {
  // WHEN
  await deployments.deployStack({
    stack: testStack({
      stackName: 'boop',
    }),
    hotswap: true,
  });

  // THEN
  expect(deployStack).toHaveBeenCalledWith(expect.objectContaining({
    hotswap: true,
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

test('if toolkit stack cannot be found but SSM parameter name is present deployment succeeds', async () => {
  // FIXME: Mocking a successful bootstrap stack lookup here should not be necessary.
  // This should fail and return a placeholder failure object.
  mockSuccessfulBootstrapStackLookup({
    BootstrapVersion: 2,
  });

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
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_, stackName: string) => {
    switch (stackName) {
      case 'OutputParamRoot':
        (cfnStack as any).template = jest.fn().mockReturnValue({
          Resources: {
            NestedStack: {
              Type: 'AWS::CloudFormation::Stack',
              Metadata: {
                'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
              },
            },
          },
        });
        break;

      case 'NestedStack':
        (cfnStack as any).template = jest.fn().mockReturnValue({
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
        throw new Error('unknown stack name ' + stackName + ' found in cloudformation-deployments.test.ts');
    }

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'OutputParamRoot',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('OutputParamRoot',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );
  pushStackResourceSummaries('NestedStack',
    stackSummaryOf('NestedResource', 'AWS::Something',
      'arn:aws:something:bermuda-triangle-1337:123456789012:property',
    ),
  );

  // WHEN
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Resources: {
          NestedResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
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
      },
    },
  });

  expect(rootStack.template).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Resources: {
          NestedResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'new-value',
            },
          },
        },
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
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() with a 3-level nested + sibling structure works', async () => {
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_, stackName: string) => {
    switch (stackName) {
      case 'MultiLevelRoot':
        (cfnStack as any).template = jest.fn().mockReturnValue({
          Resources: {
            NestedStack: {
              Type: 'AWS::CloudFormation::Stack',
              Metadata: {
                'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
              },
            },
          },
        });
        break;

      case 'NestedStack':
        (cfnStack as any).template = jest.fn().mockReturnValue({
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
            NestedStackA: {
              Type: 'AWS::CloudFormation::Stack',
              Metadata: {
                'aws:asset:path': 'one-resource-stack.nested.template.json',
              },
            },
            NestedStackB: {
              Type: 'AWS::CloudFormation::Stack',
              Metadata: {
                'aws:asset:path': 'one-resource-stack.nested.template.json',
              },
            },
          },
        });
        break;

      case 'NestedStackA':
        (cfnStack as any).template = jest.fn().mockReturnValue({
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
          },
        });
        break;

      case 'NestedStackB':
        (cfnStack as any).template = jest.fn().mockReturnValue({
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
          },
        });
        break;

      default:
        throw new Error('unknown stack name ' + stackName + ' found in cloudformation-deployments.test.ts');
    }

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'MultiLevelRoot',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
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
    stackSummaryOf('NestedStackA', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStackA/abcd',
    ),
    stackSummaryOf('NestedStackB', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStackB/abcd',
    ),
    stackSummaryOf('SomeResource', 'AWS::Something',
      'arn:aws:something:bermuda-triangle-1337:123456789012:property',
    ),
  );
  pushStackResourceSummaries('NestedStackA',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildA/abcd',
    ),
  );
  pushStackResourceSummaries('NestedStackB',
    stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildB/abcd',
    ),
  );
  pushStackResourceSummaries('GrandChildA',
    stackSummaryOf('SomeResource', 'AWS::Something',
      'arn:aws:something:bermuda-triangle-1337:123456789012:property',
    ),
  );
  pushStackResourceSummaries('GrandChildB',
    stackSummaryOf('SomeResource', 'AWS::Something',
      'arn:aws:something:bermuda-triangle-1337:123456789012:property',
    ),
  );

  // WHEN
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Resources: {
          NestedStackA: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Property: 'old-value',
                },
              },
            },
          },
          NestedStackB: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Property: 'old-value',
                },
              },
            },
          },
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

  expect(rootStack.template).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Resources: {
          NestedStackA: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Property: 'new-value',
                },
              },
            },
          },
          NestedStackB: {
            Type: 'AWS::CloudFormation::Stack',
            Resources: {
              SomeResource: {
                Type: 'AWS::Something',
                Properties: {
                  Property: 'new-value',
                },
              },
            },
          },
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'new-value',
            },
          },
        },
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() on an undeployed parent stack with an (also undeployed) nested stack works', async () => {
  // GIVEN
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_cfn: CloudFormation, _stackName: string) => {
    (cfnStack as any).template = jest.fn().mockReturnValue({ });

    return cfnStack;
  });
  const rootStack = testStack({
    stackName: 'UndeployedParent',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-resource-one-stack-stack.nested.template.json',
          },
        },
      },
    },
  });

  // WHEN
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({});
});

test('readCurrentTemplateWithNestedStacks() caches calls to listStackResources()', async () => {
  // GIVEN
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_cfn: CloudFormation, _stackName: string) => {
    (cfnStack as any).template = jest.fn().mockReturnValue({
      Resources:
      {
        NestedStackA: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
        NestedStackB: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
      },
    });

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'CachingRoot',
    template: {
      Resources: {
        NestedStackA: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
        NestedStackB: {
          Type: 'AWS::CloudFormation::Stack',
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

test('readCurrentTemplateWithNestedStacks() succesfully ignores stacks without metadata', async () => {
  // GIVEN
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_cfn: CloudFormation, stackName: string) => {
    if (stackName === 'MetadataRoot') {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          WithMetadata: {
            Type: 'AWS::CloudFormation::Stack',
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      });

    } else {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      });
    }

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'MetadataRoot',
    template: {
      Resources: {
        WithoutMetadata: {
          Type: 'AWS::CloudFormation::Stack',
        },
        WithEmptyMetadata: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {},
        },
        WithMetadata: {
          Type: 'AWS::CloudFormation::Stack',
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
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      WithMetadata: {
        Type: 'AWS::CloudFormation::Stack',
        NestedTemplate: {
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
          },
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
      },
      WithEmptyMetadata: { // Unchanged
        Type: 'AWS::CloudFormation::Stack',
        Metadata: {},
      },
      WithMetadata: { // Changed
        Type: 'AWS::CloudFormation::Stack',
        NestedTemplate: {
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'new-value',
              },
            },
          },
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() does not erase the AWS::CloudFormation::Stack resource properties', async () => {
  // GIVEN
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_cfn: CloudFormation, stackName: string) => {
    if (stackName === 'Root') {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          WithProperties: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TimeoutInMinutes: 5,
            },
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      });

    } else {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      });
    }

    return cfnStack;
  });

  const rootStack = testStack({
    stackName: 'Root',
    template: {
      Resources: {
        WithProperties: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TimeoutInMinutes: 5,
          },
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
      },
    },
  });

  pushStackResourceSummaries('Root', stackSummaryOf('WithProperties', 'AWS::CloudFormation::Stack',
    'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/one-resource-stack/abcd',
  ));

  // WHEN
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      WithProperties: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TimeoutInMinutes: 5,
        },
        NestedTemplate: {
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'old-value',
              },
            },
          },
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });

  expect(rootStack.template).toEqual({
    Resources: {
      WithProperties: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TimeoutInMinutes: 5,
        },
        NestedTemplate: {
          Resources: {
            SomeResource: {
              Type: 'AWS::Something',
              Properties: {
                Property: 'new-value',
              },
            },
          },
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });
});

/*test('ListStackResources() does not swallow all errors', async () => {
  // GIVEN
  const cfnStack = instanceMockFrom((CloudFormationStack as any));
  CloudFormationStack.lookup = jest.fn().mockImplementation((_cfn: CloudFormation, stackName: string) => {
    if (stackName === 'Root') {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          ChildStack: {
            Type: 'AWS::CloudFormation::Stack',
            Metadata: {
              'aws:asset:path': 'one-resource-stack.nested.template.json',
            },
          },
        },
      });
    } else {
      (cfnStack as any).template = jest.fn().mockReturnValue({
        Resources: {
          SomeResource: {
            Type: 'AWS::Something',
            Properties: {
              Property: 'old-value',
            },
          },
        },
      });
    }

    return cfnStack;
  });

  sdkProvider.stubCloudFormation({
    listStackResources: ({ StackName: stackName }) => {
      throw new Error(`A different error involving stack ${stackName} occurred`);
    },
  });
  const rootStack = testStack({
    stackName: 'Root',
    template: {
      Resources: {
        ChildStack: {
          Type: 'AWS::CloudFormation::Stack',
          Metadata: {
            'aws:asset:path': 'one-resource-stack.nested.template.json',
          },
        },
      },
    },
  });

  // THEN
  expect(await deployments.readCurrentTemplateWithNestedStacks(rootStack)).toThrow('A different error involving stack Root occurred');

});
*/

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
