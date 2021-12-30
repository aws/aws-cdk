import { CloudWatchLogEventMonitor } from '../../../lib/api/monitor/logs-monitor';
import { FakePrinter } from './fake-printer';
import * as setup from './hotswap-test-setup';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let logMonitor: jest.Mock;
let eventMonitor: CloudWatchLogEventMonitor;
let mockGetEndpointSuffix: () => string;

beforeEach(() => {
  jest.useFakeTimers();
  hotswapMockSdkProvider = setup.setupHotswapTests();
  logMonitor = jest.fn();
  eventMonitor = new CloudWatchLogEventMonitor({ printer: new FakePrinter() });
  eventMonitor.setLogGroups = logMonitor;
  mockGetEndpointSuffix = jest.fn(() => 'amazonaws.com');
  hotswapMockSdkProvider.stubGetEndpointSuffix(mockGetEndpointSuffix);
});
afterAll(() => {
  jest.useRealTimers();
});

test('add log groups from lambda function', async () => {
  // GIVEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  await hotswapMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['/aws/lambda/my-function']);
});

test('add log groups from ECS Task Definitions', async () => {
  // GIVEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Def', 'AWS::ECS::TaskDefinition', 'app'));
  setup.pushStackResourceSummaries(setup.stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  await hotswapMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from State Machines', async () => {
  // GIVEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Def', 'AWS::StepFunctions::StateMachine', 'machine'));
  setup.pushStackResourceSummaries(setup.stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  await hotswapMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from CodeBuild Projects', async () => {
  // GIVEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Def', 'AWS::CodeBuild::Project', 'project'));
  setup.pushStackResourceSummaries(setup.stackSummaryOf('LogGroup', 'AWS::Logs::LogGroup', 'log_group'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  await hotswapMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['log_group']);
});

test('add log groups from CodeBuild Projects, implicit', async () => {
  // GIVEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Def', 'AWS::CodeBuild::Project', 'project'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  await hotswapMockSdkProvider.registerCloudWatchLogGroups(cdkStackArtifact, eventMonitor);
  expect(logMonitor).toHaveBeenCalledWith(['/aws/codebuild/project']);
});
