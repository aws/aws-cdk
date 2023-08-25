/* eslint-disable import/order */
import * as AWS from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode, lowerCaseFirstCharacter, transformObjectKeys } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockRegisterTaskDef: jest.Mock<AWS.ECS.RegisterTaskDefinitionResponse, AWS.ECS.RegisterTaskDefinitionRequest[]>;
let mockDescribeTaskDef: jest.Mock<AWS.ECS.DescribeTaskDefinitionResponse, AWS.ECS.DescribeTaskDefinitionRequest[]>;
let mockUpdateService: (params: AWS.ECS.UpdateServiceRequest) => AWS.ECS.UpdateServiceResponse;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();

  mockRegisterTaskDef = jest.fn();
  mockDescribeTaskDef = jest.fn();
  mockUpdateService = jest.fn();
  hotswapMockSdkProvider.stubEcs({
    registerTaskDefinition: mockRegisterTaskDef,
    describeTaskDefinition: mockDescribeTaskDef,
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

function setupCurrentTaskDefinition(props: {taskDefinitionProperties: any, includeService: boolean, otherResources?: any}) {
  setup.setCurrentCfnStackTemplate({
    Resources: {
      TaskDef: {
        Type: 'AWS::ECS::TaskDefinition',
        Properties: props.taskDefinitionProperties,
      },
      ...(props.includeService ? {
        Service: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: { Ref: 'TaskDef' },
          },
        },
      } : {}),
      ...(props.otherResources ?? {}),
    },
  });
  if (props.includeService) {
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('Service', 'AWS::ECS::Service',
        'arn:aws:ecs:region:account:service/my-cluster/my-service'),
    );
  }
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('TaskDef', 'AWS::ECS::TaskDefinition',
      'arn:aws:ecs:region:account:task-definition/my-task-def:2'),
  );
  mockRegisterTaskDef.mockReturnValue({
    taskDefinition: {
      taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
    },
  });
  mockDescribeTaskDef.mockReturnValue({
    taskDefinition: transformObjectKeys(props.taskDefinitionProperties, lowerCaseFirstCharacter, {
      ContainerDefinitions: {
        DockerLabels: true,
        FirelensConfiguration: {
          Options: true,
        },
        LogConfiguration: {
          Options: true,
        },
      },
      Volumes: {
        DockerVolumeConfiguration: {
          DriverOpts: true,
          Labels: true,
        },
      },
    }),
  });
}

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('should call registerTaskDefinition and updateService for a difference only in the TaskDefinition with a Family property', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
      },
      includeService: true,
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockRegisterTaskDef).toBeCalledWith({
      family: 'my-task-def',
      containerDefinitions: [
        { image: 'image2' },
      ],
    });
    expect(mockDescribeTaskDef).toBeCalledWith({
      taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
      include: ['TAGS'],
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

  test('any other TaskDefinition property change besides ContainerDefinition cannot be hotswapped in CLASSIC mode but does not block HOTSWAP_ONLY mode deployments', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
        Cpu: '256',
      },
      includeService: true,
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockRegisterTaskDef).not.toHaveBeenCalled();
      expect(mockDescribeTaskDef).not.toHaveBeenCalled();
      expect(mockUpdateService).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockRegisterTaskDef).toBeCalledWith({
        family: 'my-task-def',
        containerDefinitions: [
          { image: 'image2' },
        ],
        cpu: '256', // this uses the old value because a new value could cause a service replacement
      });
      expect(mockDescribeTaskDef).toBeCalledWith({
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        include: ['TAGS'],
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
    }
  });

  test('deleting any other TaskDefinition property besides ContainerDefinition results in a full deployment in CLASSIC mode and a hotswap deployment in HOTSWAP_ONLY mode', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
        Cpu: '256',
      },
      includeService: true,
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockRegisterTaskDef).not.toHaveBeenCalled();
      expect(mockDescribeTaskDef).not.toHaveBeenCalled();
      expect(mockUpdateService).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockDescribeTaskDef).toBeCalledWith({
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        include: ['TAGS'],
      });
      expect(mockRegisterTaskDef).toBeCalledWith({
        family: 'my-task-def',
        containerDefinitions: [
          { image: 'image2' },
        ],
        cpu: '256', // this uses the old value because a new value could cause a service replacement
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
    }
  });

  test('should call registerTaskDefinition and updateService for a difference only in the TaskDefinition without a Family property', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
      },
      includeService: true,
    });
    mockDescribeTaskDef.mockReturnValue({
      taskDefinition: {
        taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        family: 'my-task-def',
        containerDefinitions: [
          {
            image: 'image1',
          },
        ],
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockDescribeTaskDef).toBeCalledWith({
      taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
      include: ['TAGS'],
    });
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

  test('a difference just in a TaskDefinition, without any services using it, is not hotswappable in FALL_BACK mode', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
      },
      includeService: false,
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockDescribeTaskDef).not.toHaveBeenCalled();
      expect(mockRegisterTaskDef).not.toHaveBeenCalled();
      expect(mockUpdateService).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockDescribeTaskDef).toBeCalledWith({
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        include: ['TAGS'],
      });
      expect(mockRegisterTaskDef).toBeCalledWith({
        family: 'my-task-def',
        containerDefinitions: [
          { image: 'image2' },
        ],
      });

      expect(mockUpdateService).not.toHaveBeenCalledWith();
    }
  });

  test('if anything besides an ECS Service references the changed TaskDefinition, hotswapping is not possible in CLASSIC mode but is possible in HOTSWAP_ONLY', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          { Image: 'image1' },
        ],
      },
      includeService: true,
      otherResources: {
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockDescribeTaskDef).not.toHaveBeenCalled();
      expect(mockRegisterTaskDef).not.toHaveBeenCalled();
      expect(mockUpdateService).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockDescribeTaskDef).toBeCalledWith({
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        include: ['TAGS'],
      });
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
    }
  });

  test('should call registerTaskDefinition, describeTaskDefinition, and updateService for a difference only in the container image but with environment variables of unsupported intrinsics', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          {
            Image: 'image1',
            Environment: [
              {
                Name: 'FOO',
                Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
              },
            ],
          },
        ],
      },
      includeService: true,
    });
    mockDescribeTaskDef.mockReturnValue({
      taskDefinition: {
        taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        family: 'my-task-def',
        containerDefinitions: [
          {
            image: 'image1',
            environment: [
              {
                name: 'FOO',
                value: 'value',
              },
            ],
          },
        ],
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
                  Environment: [
                    {
                      Name: 'FOO',
                      Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
                    },
                  ],
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockRegisterTaskDef).toBeCalledWith({
      family: 'my-task-def',
      containerDefinitions: [
        {
          image: 'image2',
          environment: [
            {
              name: 'FOO',
              value: 'value',
            },
          ],
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

  test('should call registerTaskDefinition, describeTaskDefinition, and updateService for a simple environment variable addition', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          {
            Image: 'image1',
            Environment: [
              {
                Name: 'FOO',
                Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
              },
            ],
          },
        ],
      },
      includeService: true,
    });
    mockDescribeTaskDef.mockReturnValue({
      taskDefinition: {
        taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        family: 'my-task-def',
        containerDefinitions: [
          {
            image: 'image1',
            environment: [
              {
                name: 'FOO',
                value: 'value',
              },
            ],
          },
        ],
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
                  Environment: [
                    {
                      Name: 'FOO',
                      Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
                    },
                    {
                      Name: 'BAR',
                      Value: '1',
                    },
                  ],
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockRegisterTaskDef).toBeCalledWith({
      family: 'my-task-def',
      containerDefinitions: [
        {
          image: 'image2',
          environment: [
            {
              name: 'FOO',
              value: 'value',
            },
            {
              name: 'BAR',
              value: '1',
            },
          ],
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

  test('should call registerTaskDefinition, describeTaskDefinition, and updateService for a environment variable deletion', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          {
            Image: 'image1',
            Environment: [
              {
                Name: 'FOO',
                Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
              },
              {
                Name: 'BAR',
                Value: '1',
              },
            ],
          },
        ],
      },
      includeService: true,
    });
    mockDescribeTaskDef.mockReturnValue({
      taskDefinition: {
        taskDefinitionArn: 'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        family: 'my-task-def',
        containerDefinitions: [
          {
            image: 'image1',
            environment: [
              {
                name: 'FOO',
                value: 'value',
              },
              {
                name: 'BAR',
                value: '1',
              },
            ],
          },
        ],
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
                  Environment: [
                    {
                      Name: 'FOO',
                      Value: { 'Fn::GetAtt': ['Bar', 'Baz'] },
                    },
                  ],
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockRegisterTaskDef).toBeCalledWith({
      family: 'my-task-def',
      containerDefinitions: [
        {
          image: 'image2',
          environment: [
            {
              name: 'FOO',
              value: 'value',
            },
          ],
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

  test('should call registerTaskDefinition with certain properties not lowercased nor uppercased', async () => {
    // GIVEN
    setupCurrentTaskDefinition({
      taskDefinitionProperties: {
        Family: 'my-task-def',
        ContainerDefinitions: [
          {
            Image: 'image1',
            DockerLabels: { Label1: 'label1' },
            FirelensConfiguration: {
              Options: { Name: 'cloudwatch' },
            },
            LogConfiguration: {
              Options: { Option1: 'option1', option2: 'option2' },
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
      includeService: true,
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
                    Options: { Option1: 'option1', option2: 'option2' },
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
            options: { Option1: 'option1', option2: 'option2' },
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
});
