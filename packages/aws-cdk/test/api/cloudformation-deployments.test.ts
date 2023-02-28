jest.mock('../../lib/api/deploy-stack');
jest.mock('../../lib/util/asset-publishing');

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';
import { DEFAULT_BOOTSTRAP_VARIANT } from '../../lib';
import { CloudFormationDeployments } from '../../lib/api/cloudformation-deployments';
import { deployStack } from '../../lib/api/deploy-stack';
import { HotswapMode } from '../../lib/api/hotswap/common';
import { EcrRepositoryInfo, ToolkitInfo } from '../../lib/api/toolkit-info';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';
import { buildAssets, publishAssets } from '../../lib/util/asset-publishing';
import { testStack } from '../util';
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
      const stackResources = currentCfnStackResources[stackName];
      if (!stackResources) {
        throw new Error(`Stack with id ${stackName} does not exist`);
      }
      return {
        StackResourceSummaries: stackResources,
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

test('deployStack builds assets by default for backward compatibility', async () => {
  const stack = testStackWithAssetManifest();

  // WHEN
  await deployments.deployStack({
    stack,
  });

  // THEN
  const expectedOptions = expect.objectContaining({
    buildAssets: true,
  });
  expect(publishAssets).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), expectedOptions);
});

test('deployStack can disable asset building for prebuilds', async () => {
  const stack = testStackWithAssetManifest();

  // WHEN
  await deployments.deployStack({
    stack,
    buildAssets: false,
  });

  // THEN
  const expectedOptions = expect.objectContaining({
    buildAssets: false,
  });
  expect(publishAssets).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), expectedOptions);
});

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
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
          NestedTemplate: {
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
          NestedTemplate: {
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
        Metadata: {
          'aws:asset:path': 'one-output-one-param-stack.nested.template.json',
        },
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() with a 3-level nested + sibling structure works', async () => {
  const cfnStack = new FakeCloudformationStack({
    stackName: 'MultiLevelRoot',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = (async (_, stackName: string) => {
    switch (stackName) {
      case 'MultiLevelRoot':
        cfnStack.template = async () => ({
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
        break;

      case 'NestedStack':
        cfnStack.template = async () => ({
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
        });
        break;

      case 'GrandChildStackA':
        cfnStack.template = async () => ({
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

      case 'GrandChildStackB':
        cfnStack.template = async () => ({
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
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
          NestedTemplate: {
            Resources: {
              GrandChildStackA: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'https://www.magic-url.com',
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
                },
                Metadata: {
                  'aws:asset:path': 'one-resource-stack.nested.template.json',
                },
              },
              GrandChildStackB: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'https://www.magic-url.com',
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
                },
                Metadata: {
                  'aws:asset:path': 'one-resource-stack.nested.template.json',
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
          NestedTemplate: {
            Resources: {
              GrandChildStackA: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'https://www.magic-url.com',
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
                },
                Metadata: {
                  'aws:asset:path': 'one-resource-stack.nested.template.json',
                },
              },
              GrandChildStackB: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  TemplateURL: 'https://www.magic-url.com',
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
                },
                Metadata: {
                  'aws:asset:path': 'one-resource-stack.nested.template.json',
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
        Metadata: {
          'aws:asset:path': 'one-resource-two-stacks-stack.nested.template.json',
        },
      },
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
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      NestedStack: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          NestedTemplate: {
            Resources: {
              NestedStack: {
                Type: 'AWS::CloudFormation::Stack',
                Properties: {
                  NestedTemplate: {},
                },
              },
            },
          },
        },
      },
    },
  });
});

test('readCurrentTemplateWithNestedStacks() caches calls to listStackResources()', async () => {
  // GIVEN
  const cfnStack = new FakeCloudformationStack({
    stackName: 'CachingRoot',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = (async (_cfn, _stackName: string) => {
    cfnStack.template = async () => ({
      Resources:
      {
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
    });

    return cfnStack;
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

test('readCurrentTemplateWithNestedStacks() succesfully ignores stacks without metadata', async () => {
  // GIVEN
  const cfnStack = new FakeCloudformationStack({
    stackName: 'MetadataRoot',
    stackId: 'StackId',
  });
  CloudFormationStack.lookup = (async (_, stackName: string) => {
    if (stackName === 'MetadataRoot') {
      cfnStack.template = async () => ({
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

    } else {
      cfnStack.template = async () => ({
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
  const deployedTemplate = await deployments.readCurrentTemplateWithNestedStacks(rootStack);

  // THEN
  expect(deployedTemplate).toEqual({
    Resources: {
      WithMetadata: {
        Type: 'AWS::CloudFormation::Stack',
        Properties: {
          TemplateURL: 'https://www.magic-url.com',
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
        },
        Metadata: {
          'aws:asset:path': 'one-resource-stack.nested.template.json',
        },
      },
    },
  });
});

test('building assets', async () => {
  // GIVEN
  const stack = testStackWithAssetManifest();

  // WHEN
  await deployments.buildStackAssets({
    stack,
  });

  // THEN
  const expectedAssetManifest = expect.objectContaining({
    directory: stack.assembly.directory,
    manifest: expect.objectContaining({
      files: expect.objectContaining({
        fake: expect.anything(),
      }),
    }),
  });
  const expectedEnvironment = expect.objectContaining({
    account: 'account',
    name: 'aws://account/region',
    region: 'region',
  });
  expect(buildAssets).toBeCalledWith(expectedAssetManifest, sdkProvider, expectedEnvironment, undefined);
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

function testStackWithAssetManifest() {
  const toolkitInfo = new class extends ToolkitInfo {
    public found: boolean = true;
    public bucketUrl: string = 's3://fake/here';
    public bucketName: string = 'fake';
    public variant: string = DEFAULT_BOOTSTRAP_VARIANT;
    public version: number = 1234;
    public get bootstrapStack(): CloudFormationStack {
      throw new Error('This should never happen');
    };

    constructor() {
      super(sdkProvider.sdk);
    }

    public validateVersion(): Promise<void> {
      return Promise.resolve();
    }

    public prepareEcrRepository(): Promise<EcrRepositoryInfo> {
      return Promise.resolve({
        repositoryUri: 'fake',
      });
    }
  };

  ToolkitInfo.lookup = mockToolkitInfoLookup = jest.fn().mockResolvedValue(toolkitInfo);

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out.'));
  fs.writeFileSync(path.join(outDir, 'assets.json'), JSON.stringify({
    version: '15.0.0',
    files: {
      fake: {
        source: {
          path: 'fake.json',
          packaging: 'file',
        },
        destinations: {
          'current_account-current_region': {
            bucketName: 'fake-bucket',
            objectKey: 'fake.json',
            assumeRoleArn: 'arn:fake',
          },
        },
      },
    },
    dockerImages: {},
  }));
  fs.writeFileSync(path.join(outDir, 'template.json'), JSON.stringify({
    Resources: {
      No: { Type: 'Resource' },
    },
  }));

  const builder = new cxapi.CloudAssemblyBuilder(outDir);

  builder.addArtifact('assets', {
    type: cxschema.ArtifactType.ASSET_MANIFEST,
    properties: {
      file: 'assets.json',
    },
    environment: 'aws://account/region',
  });

  builder.addArtifact('stack', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    properties: {
      templateFile: 'template.json',
    },
    environment: 'aws://account/region',
    dependencies: ['assets'],
  });

  const assembly = builder.buildAssembly();
  return assembly.getStackArtifact('stack');
}
