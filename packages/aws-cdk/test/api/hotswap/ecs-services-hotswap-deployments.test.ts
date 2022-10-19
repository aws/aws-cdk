import * as AWS from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockRegisterTaskDef: jest.Mock<AWS.ECS.RegisterTaskDefinitionResponse, AWS.ECS.RegisterTaskDefinitionRequest[]>;
let mockUpdateService: (params: AWS.ECS.UpdateServiceRequest) => AWS.ECS.UpdateServiceResponse;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();

  mockRegisterTaskDef = jest.fn();
  mockUpdateService = jest.fn();
  hotswapMockSdkProvider.stubEcs({
    registerTaskDefinition: mockRegisterTaskDef,
    updateService: mockUpdateService,
  }, {
    // these are needed for the waiter API that the ECS service hotswap uses
    api: {
      waiters: {},
    },
    makeRequest() {
      return {
        promise: () => Promise.resolve({}),
        response: {},
        addListeners: () => {},
      };
    },
  });
});

test('should call registerTaskDefinition and updateService for a difference only in the TaskDefinition with a Family property', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          Family: 'my-task-def',
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
        },
      },
      Service: {
        Type: 'AWS::ECS::Service',
        Properties: {
          TaskDefinition: { Ref: 'TaskDef' },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Service', 'AWS::ECS::Service',
      'arn:aws:ecs:region:account:service/my-cluster/my-service'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'my-task-def',
            ContainerDefinitions: [
              { Image: 'image2' },
            ],
          },
        },
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockRegisterTaskDef).toBeCalledWith({
    family: 'my-task-def',
    containerDefinitions: [
      { image: 'image2' },
    ],
  });
  expect(mockUpdateService).toBeCalledWith({
    service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
    cluster: 'my-cluster',
    taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    deploymentConfiguration: {
      minimumHealthyPercent: 0,
    },
    forceNewDeployment: true,
  });
});

test('any other TaskDefinition property change besides ContainerDefinition cannot be hotswapped', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          Family: 'my-task-def',
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
          Cpu: '256',
        },
      },
      Service: {
        Type: 'AWS::ECS::Service',
        Properties: {
          TaskDefinition: { Ref: 'TaskDef' },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Service', 'AWS::ECS::Service',
      'arn:aws:ecs:region:account:service/my-cluster/my-service'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'my-task-def',
            ContainerDefinitions: [
              { Image: 'image2' },
            ],
            Cpu: '512',
          },
        },
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('should call registerTaskDefinition and updateService for a difference only in the TaskDefinition without a Family property', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
        },
      },
      Service: {
        Type: 'AWS::ECS::Service',
        Properties: {
          TaskDefinition: { Ref: 'TaskDef' },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('TaskDef', 'AWS::ECS::TaskDefinition',
      'arn:aws:ecs:region:account:task-definition/my-task-def:2'),
    setup.stackSummaryOf('Service', 'AWS::ECS::Service',
      'arn:aws:ecs:region:account:service/my-cluster/my-service'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            ContainerDefinitions: [
              { Image: 'image2' },
            ],
          },
        },
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockRegisterTaskDef).toBeCalledWith({
    family: 'my-task-def',
    containerDefinitions: [
      { image: 'image2' },
    ],
  });
  expect(mockUpdateService).toBeCalledWith({
    service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
    cluster: 'my-cluster',
    taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    deploymentConfiguration: {
      minimumHealthyPercent: 0,
    },
    forceNewDeployment: true,
  });
});

test('a difference just in a TaskDefinition, without any services using it, is not hotswappable', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('TaskDef', 'AWS::ECS::TaskDefinition',
      'arn:aws:ecs:region:account:task-definition/my-task-def:2'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            ContainerDefinitions: [
              { Image: 'image2' },
            ],
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockRegisterTaskDef).not.toHaveBeenCalled();
});

test('if anything besides an ECS Service references the changed TaskDefinition, hotswapping is not possible', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          Family: 'my-task-def',
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
        },
      },
      Service: {
        Type: 'AWS::ECS::Service',
        Properties: {
          TaskDefinition: { Ref: 'TaskDef' },
        },
      },
      Function: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Environment: {
            Variables: {
              TaskDefRevArn: { Ref: 'TaskDef' },
            },
          },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Service', 'AWS::ECS::Service',
      'arn:aws:ecs:region:account:service/my-cluster/my-service'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'my-task-def',
            ContainerDefinitions: [
              { Image: 'image2' },
            ],
          },
        },
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
        Function: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Environment: {
              Variables: {
                TaskDefRevArn: { Ref: 'TaskDef' },
              },
            },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockRegisterTaskDef).not.toHaveBeenCalled();
});

test('should call registerTaskDefinition with certain properties not lowercased', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: {
          Family: 'my-task-def',
          ContainerDefinitions: [
            { Image: 'image1' },
          ],
          Volumes: [
            {
              DockerVolumeConfiguration: {
                DriverOpts: { Option1: 'option1' },
                Labels: { Label1: 'label1' },
              },
            },
          ],
        },
      },
      Service: {
        Type: 'AWS::ECS::Service',
        Properties: {
          TaskDefinition: { Ref: 'TaskDef' },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Service', 'AWS::ECS::Service',
      'arn:aws:ecs:region:account:service/my-cluster/my-service'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'my-task-def',
            ContainerDefinitions: [
              {
                Image: 'image2',
                DockerLabels: { Label1: 'label1' },
                FirelensConfiguration: {
                  Options: { Name: 'cloudwatch' },
                },
                LogConfiguration: {
                  Options: { Option1: 'option1' },
                },
              },
            ],
            Volumes: [
              {
                DockerVolumeConfiguration: {
                  DriverOpts: { Option1: 'option1' },
                  Labels: { Label1: 'label1' },
                },
              },
            ],
          },
        },
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockRegisterTaskDef).toBeCalledWith({
    family: 'my-task-def',
    containerDefinitions: [
      {
        image: 'image2',
        dockerLabels: { Label1: 'label1' },
        firelensConfiguration: {
          options: {
            Name: 'cloudwatch',
          },
        },
        logConfiguration: {
          options: { Option1: 'option1' },
        },
      },
    ],
    volumes: [
      {
        dockerVolumeConfiguration: {
          driverOpts: { Option1: 'option1' },
          labels: { Label1: 'label1' },
        },
      },
    ],
  });
  expect(mockUpdateService).toBeCalledWith({
    service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
    cluster: 'my-cluster',
    taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    deploymentConfiguration: {
      minimumHealthyPercent: 0,
    },
    forceNewDeployment: true,
  });
});
