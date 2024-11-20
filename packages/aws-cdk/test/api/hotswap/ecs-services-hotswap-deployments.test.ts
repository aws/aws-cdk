import { DescribeServicesCommand, RegisterTaskDefinitionCommand, UpdateServiceCommand } from '@aws-sdk/client-ecs';
import * as setup from './hotswap-test-setup';
import { EcsHotswapProperties, HotswapMode, HotswapPropertyOverrides } from '../../../lib/api/hotswap/common';
import { Configuration } from '../../../lib/settings';
import { mockECSClient } from '../../util/mock-sdk';
import { silentTest } from '../../util/silent';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockECSClient
    .on(UpdateServiceCommand)
    .resolves({
      service: {
        clusterArn: 'arn:aws:ecs:region:account:service/my-cluster',
        serviceArn: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
      },
    })
    .on(DescribeServicesCommand)
    .resolves({
      services: [
        {
          deployments: [
            {
              desiredCount: 1,
              runningCount: 1,
            },
          ],
        },
      ],
    });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  silentTest(
    'should call registerTaskDefinition and updateService for a difference only in the TaskDefinition with a Family property',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              Family: 'my-task-def',
              ContainerDefinitions: [{ Image: 'image1' }],
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
        setup.stackSummaryOf(
          'Service',
          'AWS::ECS::Service',
          'arn:aws:ecs:region:account:service/my-cluster/my-service',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
      expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
        family: 'my-task-def',
        containerDefinitions: [{ image: 'image2' }],
      });

      expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
        service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
        cluster: 'my-cluster',
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
        deploymentConfiguration: {
          minimumHealthyPercent: 0,
        },
        forceNewDeployment: true,
      });
    },
  );

  silentTest(
    'any other TaskDefinition property change besides ContainerDefinition cannot be hotswapped in CLASSIC mode but does not block HOTSWAP_ONLY mode deployments',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              Family: 'my-task-def',
              ContainerDefinitions: [{ Image: 'image1' }],
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
        setup.stackSummaryOf(
          'Service',
          'AWS::ECS::Service',
          'arn:aws:ecs:region:account:service/my-cluster/my-service',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
        expect(mockECSClient).not.toHaveReceivedCommand(RegisterTaskDefinitionCommand);
        expect(mockECSClient).not.toHaveReceivedCommand(UpdateServiceCommand);
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).not.toBeUndefined();
        expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
          family: 'my-task-def',
          containerDefinitions: [{ image: 'image2' }],
          cpu: '256', // this uses the old value because a new value could cause a service replacement
        });
        expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
          service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
          cluster: 'my-cluster',
          taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
          deploymentConfiguration: {
            minimumHealthyPercent: 0,
          },
          forceNewDeployment: true,
        });
      }
    },
  );

  silentTest(
    'deleting any other TaskDefinition property besides ContainerDefinition results in a full deployment in CLASSIC mode and a hotswap deployment in HOTSWAP_ONLY mode',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              Family: 'my-task-def',
              ContainerDefinitions: [{ Image: 'image1' }],
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
        setup.stackSummaryOf(
          'Service',
          'AWS::ECS::Service',
          'arn:aws:ecs:region:account:service/my-cluster/my-service',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
        expect(mockECSClient).not.toHaveReceivedCommand(RegisterTaskDefinitionCommand);
        expect(mockECSClient).not.toHaveReceivedCommand(UpdateServiceCommand);
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).not.toBeUndefined();
        expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
          family: 'my-task-def',
          containerDefinitions: [{ image: 'image2' }],
          cpu: '256', // this uses the old value because a new value could cause a service replacement
        });
        expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
          service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
          cluster: 'my-cluster',
          taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
          deploymentConfiguration: {
            minimumHealthyPercent: 0,
          },
          forceNewDeployment: true,
        });
      }
    },
  );

  silentTest(
    'should call registerTaskDefinition and updateService for a difference only in the TaskDefinition without a Family property',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              ContainerDefinitions: [{ Image: 'image1' }],
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
        setup.stackSummaryOf(
          'TaskDef',
          'AWS::ECS::TaskDefinition',
          'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        ),
        setup.stackSummaryOf(
          'Service',
          'AWS::ECS::Service',
          'arn:aws:ecs:region:account:service/my-cluster/my-service',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
      expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
        family: 'my-task-def',
        containerDefinitions: [{ image: 'image2' }],
      });
      expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
        service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
        cluster: 'my-cluster',
        taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
        deploymentConfiguration: {
          minimumHealthyPercent: 0,
        },
        forceNewDeployment: true,
      });
    },
  );

  silentTest(
    'a difference just in a TaskDefinition, without any services using it, is not hotswappable in FALL_BACK mode',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              ContainerDefinitions: [{ Image: 'image1' }],
            },
          },
        },
      });
      setup.pushStackResourceSummaries(
        setup.stackSummaryOf(
          'TaskDef',
          'AWS::ECS::TaskDefinition',
          'arn:aws:ecs:region:account:task-definition/my-task-def:2',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
        expect(mockECSClient).not.toHaveReceivedCommand(RegisterTaskDefinitionCommand);
        expect(mockECSClient).not.toHaveReceivedCommand(UpdateServiceCommand);
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).not.toBeUndefined();
        expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
          family: 'my-task-def',
          containerDefinitions: [{ image: 'image2' }],
        });

        expect(mockECSClient).not.toHaveReceivedCommand(UpdateServiceCommand);
      }
    },
  );

  silentTest(
    'if anything besides an ECS Service references the changed TaskDefinition, hotswapping is not possible in CLASSIC mode but is possible in HOTSWAP_ONLY',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          TaskDef: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
              Family: 'my-task-def',
              ContainerDefinitions: [{ Image: 'image1' }],
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
        setup.stackSummaryOf(
          'Service',
          'AWS::ECS::Service',
          'arn:aws:ecs:region:account:service/my-cluster/my-service',
        ),
      );
      mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
                ContainerDefinitions: [{ Image: 'image2' }],
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
        expect(mockECSClient).not.toHaveReceivedCommand(RegisterTaskDefinitionCommand);
        expect(mockECSClient).not.toHaveReceivedCommand(UpdateServiceCommand);
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).not.toBeUndefined();
        expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
          family: 'my-task-def',
          containerDefinitions: [{ image: 'image2' }],
        });
        expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
          service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
          cluster: 'my-cluster',
          taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
          deploymentConfiguration: {
            minimumHealthyPercent: 0,
          },
          forceNewDeployment: true,
        });
      }
    },
  );

  silentTest('should call registerTaskDefinition with certain properties not lowercased', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        TaskDef: {
          Type: 'AWS::ECS::TaskDefinition',
          Properties: {
            Family: 'my-task-def',
            ContainerDefinitions: [{ Image: 'image1' }],
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
      setup.stackSummaryOf('Service', 'AWS::ECS::Service', 'arn:aws:ecs:region:account:service/my-cluster/my-service'),
    );
    mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
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
    expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
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

describe.each([
  new Configuration().settings.set(['hotswap'], { ecs: { minimumHealthyPercent: 10 } }),
  new Configuration().settings.set(['hotswap'], { ecs: { minimumHealthyPercent: 10, maximumHealthyPercent: 100 } }),
])('hotswap properties', (settings) => {
  test('should handle all possible hotswap properties', async () => {
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
    mockECSClient.on(RegisterTaskDefinitionCommand).resolves({
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
    let ecsHotswapProperties = new EcsHotswapProperties(settings.get(['hotswap']).ecs.minimumHealthyPercent, settings.get(['hotswap']).ecs.maximumHealthyPercent);
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(
      HotswapMode.HOTSWAP_ONLY,
      cdkStackArtifact,
      {},
      new HotswapPropertyOverrides(ecsHotswapProperties),
    );

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockECSClient).toHaveReceivedCommandWith(RegisterTaskDefinitionCommand, {
      family: 'my-task-def',
      containerDefinitions: [
        { image: 'image2' },
      ],
    });
    expect(mockECSClient).toHaveReceivedCommandWith(UpdateServiceCommand, {
      service: 'arn:aws:ecs:region:account:service/my-cluster/my-service',
      cluster: 'my-cluster',
      taskDefinition: 'arn:aws:ecs:region:account:task-definition/my-task-def:3',
      deploymentConfiguration: {
        minimumHealthyPercent: settings.get(['hotswap']).ecs?.minimumHealthyPercent == undefined ?
          0 : settings.get(['hotswap']).ecs?.minimumHealthyPercent,
        maximumPercent: settings.get(['hotswap']).ecs?.maximumHealthyPercent,
      },
      forceNewDeployment: true,
    });
  });
});
