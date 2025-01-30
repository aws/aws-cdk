import * as cxapi from '@aws-cdk/cx-api';
import {
  ListStackResourcesCommand,
  ListStackResourcesCommandInput,
  StackResourceSummary,
  StackStatus,
} from '@aws-sdk/client-cloudformation';
import { SdkProvider } from '../../../lib/api';
import { findCloudWatchLogGroups } from '../../../lib/api/logs/find-cloudwatch-logs';
import { testStack, TestStackArtifact } from '../../util';
import {
  mockCloudFormationClient,
  MockSdk,
  MockSdkProvider,
  restoreSdkMocksToDefault,
  setDefaultSTSMocks,
} from '../../util/mock-sdk';

let sdk: MockSdk;
let logsMockSdkProvider: SdkProvider;

beforeEach(() => {
  logsMockSdkProvider = new MockSdkProvider();
  sdk = new MockSdk();
  sdk.getUrlSuffix = () => Promise.resolve('amazonaws.com');
  restoreSdkMocksToDefault();
  setDefaultSTSMocks();
  jest.resetAllMocks();
  // clear the array
  currentCfnStackResources.splice(0);
  mockCloudFormationClient.on(ListStackResourcesCommand).callsFake((input: ListStackResourcesCommandInput) => {
    if (input.StackName !== STACK_NAME) {
      throw new Error(
        `Expected Stack name in listStackResources() call to be: '${STACK_NAME}', but received: ${input.StackName}'`,
      );
    }
    return {
      StackResourceSummaries: currentCfnStackResources,
    };
  });
});

test('add log groups from lambda function', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            FunctionName: 'my-function',
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['/aws/lambda/my-function']);
});

test('add log groups from lambda function when using custom LoggingConfig', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            FunctionName: 'my-function',
            LoggingConfig: {
              LogGroup: '/this/custom/my-custom-log-group',
            },
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['/this/custom/my-custom-log-group']);
});

test('add log groups from lambda function when using custom LoggingConfig using Ref', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        MyCustomLogGroupLogicalId: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: '/this/custom/my-custom-log-group',
          },
        },
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            FunctionName: 'my-function',
            LoggingConfig: {
              LogGroup: {
                Ref: 'MyCustomLogGroupLogicalId',
              },
            },
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['/this/custom/my-custom-log-group']);
});

test('add log groups from lambda function without physical name', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['/aws/lambda/my-function']);
});

test('empty template', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {},
  });

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual([]);
});

test('add log groups from ECS Task Definitions', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: 'log_group',
          },
        },
        Def: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'app',
            ContainerDefinitions: [
              {
                LogConfiguration: {
                  LogDriver: 'awslogs',
                  Options: {
                    'awslogs-group': { Ref: 'LogGroup' },
                  },
                },
              },
            ],
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['log_group']);
});

test('add log groups from State Machines', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: 'log_group',
          },
        },
        Def: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            LoggingConfiguration: {
              Destinations: [
                {
                  CloudWatchLogsLogGroup: {
                    LogGroupArn: {
                      'Fn::GetAtt': ['LogGroup', 'Arn'],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['log_group']);
});

test('excluded log groups are not added', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: 'log_group',
          },
        },
        LogGroup2: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: 'log_group2',
          },
        },
        Def: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            PojectName: 'project',
            LogsConfig: {
              CloudWatchLogs: {
                GroupName: { Ref: 'LogGroup' },
              },
            },
          },
        },
        FlowLog: {
          Type: 'AWS::EC2::FlowLog',
          Properties: {
            LogDestination: { Ref: 'LogGroup' },
          },
        },
        FlowLog2: {
          Type: 'AWS::EC2::FlowLog',
          Properties: {
            LogDestination: {
              'Fn::GetAtt': ['LogGroup2', 'Arn'],
            },
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup2', 'AWS::Logs::LogGroup', 'log_group2'));
  pushStackResourceSummaries(stackSummaryOf('FlowLog', 'AWS::EC2::FlowLog', 'flow_log'));
  pushStackResourceSummaries(stackSummaryOf('FlowLog2', 'AWS::EC2::FlowLog', 'flow_log2'));
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::CodeBuild:Project', 'project'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual([]);
});

test('unassociated log groups are added', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: 'log_group',
          },
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['log_group']);
});

test('log groups without physical names are added', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Type: 'AWS::Logs::LogGroup',
        },
      },
    },
  });
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));

  // WHEN
  const result = await findCloudWatchLogGroups(logsMockSdkProvider, cdkStackArtifact);

  // THEN
  expect(result.logGroupNames).toEqual(['log_group']);
});

const STACK_NAME = 'withouterrors';
const currentCfnStackResources: StackResourceSummary[] = [];

function pushStackResourceSummaries(...items: StackResourceSummary[]) {
  currentCfnStackResources.push(...items);
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

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}
