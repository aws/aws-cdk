import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { registerCloudWatchLogGroups } from '../../../lib/api/logs/cloudwatch-logs';
import { CloudWatchLogEventMonitor } from '../../../lib/api/logs/logs-monitor';
import { testStack, TestStackArtifact } from '../../util';
import { MockSdkProvider } from '../../util/mock-sdk';
import { FakePrinter } from './fake-printer';

let logsMockSdkProvider: LogsMockSdkProvider;
let logMonitor: jest.Mock;
let eventMonitor: CloudWatchLogEventMonitor;
let mockGetEndpointSuffix: () => string;

beforeEach(() => {
  jest.useFakeTimers();
  logsMockSdkProvider = new LogsMockSdkProvider();
  logMonitor = jest.fn();
  eventMonitor = new CloudWatchLogEventMonitor({ printer: new FakePrinter() });
  eventMonitor.addLogGroups = logMonitor;
  mockGetEndpointSuffix = jest.fn(() => 'amazonaws.com');
  logsMockSdkProvider.stubGetEndpointSuffix(mockGetEndpointSuffix);
  // clear the array
  currentCfnStackResources.splice(0);
});
afterAll(() => {
  jest.useRealTimers();
});

test('add log groups from lambda function', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));
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
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['/aws/lambda/my-function']);
});

test('add log groups from ECS Task Definitions', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::ECS::TaskDefinition', 'app'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
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
                    'awslogs-group': {
                      Ref: 'LogGroup',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  });
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from State Machines', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::StepFunctions::StateMachine', 'machine'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
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
                      'Fn::GetAtt': [
                        'LogGroup',,
                        'Arn',
                      ],
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
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from CodeBuild Projects', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::CodeBuild::Project', 'project'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
            LogGroupName: 'log_group',
          },
        },
        Def: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            PojectName: 'project',
            LogsConfig: {
              CloudWatchLogs: {
                GroupName: {
                  Ref: 'LogGroup',
                },
              },
            },
          },
        },
      },
    },
  });
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from CodeBuild Projects, implicit', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::CodeBuild::Project', 'project'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Def: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            PojectName: 'project',
          },
        },
      },
    },
  });
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['/aws/codebuild/project']);
});

test('excluded log groups are not added', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('FlowLog', 'AWS::EC2::FlowLog', 'flow'));
  pushStackResourceSummaries(stackSummaryOf('Def', 'AWS::CodeBuild::Project', 'project'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  pushStackResourceSummaries(stackSummaryOf('LogGroup2', 'AWS::Logs::LogGroup', 'log_group2'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
            LogGroupName: 'log_group',
          },
        },
        LogGroup2: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
            LogGroupName: 'log_group2',
          },
        },
        Def: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            PojectName: 'project',
          },
        },
        FlowLog: {
          Type: 'AWS::EC2::FlowLog',
          Properties: {
            LogDestination: {
              Ref: 'LogGroup',
            },
          },
        },
        FlowLog2: {
          Type: 'AWS::EC2::FlowLog',
          Properties: {
            LogDestination: {
              'Fn::GetAtt': [
                'LogGroup2',,
                'Arn',
              ],
            },
          },
        },
      },
    },
  });
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['/aws/codebuild/project']);
});

test('unassociated log groups are added', async () => {
  // GIVEN
  pushStackResourceSummaries(stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        LogGroup: {
          Properties: {
            Type: 'AWS::Logs::LogGroup',
            LogGroupName: 'log_group',
          },
        },
      },
    },
  });
  await logsMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

const STACK_NAME = 'withouterrors';
// const STACK_ID = 'stackId';
const currentCfnStackResources: CloudFormation.StackResourceSummary[] = [];

function pushStackResourceSummaries(...items: CloudFormation.StackResourceSummary[]) {
  currentCfnStackResources.push(...items);
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

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}

class LogsMockSdkProvider {
  public readonly mockSdkProvider: MockSdkProvider;

  constructor() {
    this.mockSdkProvider = new MockSdkProvider({ realSdk: false });

    this.mockSdkProvider.stubCloudFormation({
      listStackResources: ({ StackName: stackName }) => {
        if (stackName !== STACK_NAME) {
          throw new Error(`Expected Stack name in listStackResources() call to be: '${STACK_NAME}', but received: ${stackName}'`);
        }
        return {
          StackResourceSummaries: currentCfnStackResources,
        };
      },
    });
  }

  public stubGetEndpointSuffix(stub: () => string) {
    this.mockSdkProvider.stubGetEndpointSuffix(stub);
  }

  public registerCloudWatchLogGroups(
    stackArtifact: cxapi.CloudFormationStackArtifact,
    cloudWatchLogMonitor: CloudWatchLogEventMonitor,
  ): Promise<void> {
    return registerCloudWatchLogGroups(this.mockSdkProvider, stackArtifact, cloudWatchLogMonitor);
  }
}
