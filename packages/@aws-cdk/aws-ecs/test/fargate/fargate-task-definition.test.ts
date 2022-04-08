import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

describe('fargate task definition', () => {
  describe('When creating a Fargate TaskDefinition', () => {
    test('with only required properties set, it correctly sets default properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Family: 'FargateTaskDef',
        NetworkMode: ecs.NetworkMode.AWS_VPC,
        RequiresCompatibilities: ['FARGATE'],
        Cpu: '256',
        Memory: '512',
      });


    });

    test('support lazy cpu and memory values', () => {
      // GIVEN
      const stack = new cdk.Stack();

      new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
        cpu: cdk.Lazy.number({ produce: () => 128 }),
        memoryLimitMiB: cdk.Lazy.number({ produce: () => 1024 }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Cpu: '128',
        Memory: '1024',
      });


    });

    test('with all properties set', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
        cpu: 128,
        executionRole: new iam.Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new iam.CompositePrincipal(
            new iam.ServicePrincipal('ecs.amazonaws.com'),
            new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        family: 'myApp',
        memoryLimitMiB: 1024,
        taskRole: new iam.Role(stack, 'TaskRole', {
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        ephemeralStorageGiB: 21,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.X86_64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        },
      });

      taskDefinition.addVolume({
        host: {
          sourcePath: '/tmp/cache',
        },
        name: 'scratch',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Cpu: '128',
        ExecutionRoleArn: {
          'Fn::GetAtt': [
            'ExecutionRole605A040B',
            'Arn',
          ],
        },
        EphemeralStorage: {
          SizeInGiB: 21,
        },
        Family: 'myApp',
        Memory: '1024',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: [
          ecs.LaunchType.FARGATE,
        ],
        RuntimePlatform: {
          CpuArchitecture: 'X86_64',
          OperatingSystemFamily: 'LINUX',
        },
        TaskRoleArn: {
          'Fn::GetAtt': [
            'TaskRole30FC0FBB',
            'Arn',
          ],
        },
        Volumes: [
          {
            Host: {
              SourcePath: '/tmp/cache',
            },
            Name: 'scratch',
          },
        ],
      });


    });

    test('throws when adding placement constraint', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      expect(() => {
        taskDefinition.addPlacementConstraint(ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));
      }).toThrow(/Cannot set placement constraints on tasks that run on Fargate/);


    });

    test('throws when adding inference accelerators', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const inferenceAccelerator = {
        deviceName: 'device1',
        deviceType: 'eia2.medium',
      };

      // THEN
      expect(() => {
        taskDefinition.addInferenceAccelerator(inferenceAccelerator);
      }).toThrow(/Cannot use inference accelerators on tasks that run on Fargate/);


    });

    test('throws when ephemeral storage request is too high', () => {
      // GIVEN
      const stack = new cdk.Stack();
      expect(() => {
        new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
          ephemeralStorageGiB: 201,
        });
      }).toThrow(/Ephemeral storage size must be between 21GiB and 200GiB/);

      // THEN
    });

    test('throws when ephemeral storage request is too low', () => {
      // GIVEN
      const stack = new cdk.Stack();
      expect(() => {
        new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
          ephemeralStorageGiB: 20,
        });
      }).toThrow(/Ephemeral storage size must be between 21GiB and 200GiB/);

      // THEN
    });
  });

  describe('When importing from an existing Fargate TaskDefinition', () => {
    test('can succeed using TaskDefinition Arn', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';

      // WHEN
      const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'FARGATE_TD_ID', expectTaskDefinitionArn);

      // THEN
      expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);

    });

    test('can succeed using attributes', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
      const expectTaskRole = new iam.Role(stack, 'TaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      // WHEN
      const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        networkMode: expectNetworkMode,
        taskRole: expectTaskRole,
      });

      // THEN
      expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);
      expect(taskDefinition.compatibility).toEqual(ecs.Compatibility.FARGATE);
      expect(taskDefinition.isFargateCompatible).toEqual(true);
      expect(taskDefinition.isEc2Compatible).toEqual(false);
      expect(taskDefinition.networkMode).toEqual(expectNetworkMode);
      expect(taskDefinition.taskRole).toEqual(expectTaskRole);


    });

    test('returns a Fargate TaskDefinition that will throw an error when trying to access its networkMode but its networkMode is undefined', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectTaskRole = new iam.Role(stack, 'TaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      // WHEN
      const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        taskRole: expectTaskRole,
      });

      // THEN
      expect(() => {
        taskDefinition.networkMode;
      }).toThrow('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
        'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');


    });

    test('returns a Fargate TaskDefinition that will throw an error when trying to access its taskRole but its taskRole is undefined', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectNetworkMode = ecs.NetworkMode.AWS_VPC;

      // WHEN
      const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        networkMode: expectNetworkMode,
      });

      // THEN
      expect(() => {
        taskDefinition.taskRole;
      }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
    });

    test('Passing in token for ephemeral storage will not throw error', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const param = new cdk.CfnParameter(stack, 'prammm', {
        type: 'Number',
        default: 1,
      });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
        ephemeralStorageGiB: param.valueAsNumber,
      });

      // THEN
      expect(() => {
        taskDefinition.ephemeralStorageGiB;
      }).toBeTruthy;
    });

    test('runtime testing for windows container', () => {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
        cpu: 1024,
        memoryLimitMiB: 2048,
        runtimePlatform: {
          operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
          cpuArchitecture: ecs.CpuArchitecture.X86_64,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Cpu: '1024',
        Family: 'FargateTaskDef',
        Memory: '2048',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: [
          ecs.LaunchType.FARGATE,
        ],
        RuntimePlatform: {
          CpuArchitecture: 'X86_64',
          OperatingSystemFamily: 'WINDOWS_SERVER_2019_CORE',
        },
        TaskRoleArn: {
          'Fn::GetAtt': [
            'FargateTaskDefTaskRole0B257552',
            'Arn',
          ],
        },
      });
    });

    test('runtime testing for linux container', () => {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
        cpu: 1024,
        memoryLimitMiB: 2048,
        runtimePlatform: {
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Cpu: '1024',
        Family: 'FargateTaskDef',
        Memory: '2048',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: [
          ecs.LaunchType.FARGATE,
        ],
        RuntimePlatform: {
          CpuArchitecture: 'ARM64',
          OperatingSystemFamily: 'LINUX',
        },
        TaskRoleArn: {
          'Fn::GetAtt': [
            'FargateTaskDefTaskRole0B257552',
            'Arn',
          ],
        },
      });
    });

    test('creating a Fargate TaskDefinition with WINDOWS_SERVER_X operatingSystemFamily and incorrect cpu throws an error', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // Not in CPU Ranage.
      expect(() => {
        new ecs.FargateTaskDefinition(stack, 'FargateTaskDefCPU', {
          cpu: 128,
          memoryLimitMiB: 1024,
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.X86_64,
            operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
          },
        });
      }).toThrowError(`If operatingSystemFamily is ${ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE._operatingSystemFamily}, then cpu must be in 1024 (1 vCPU), 2048 (2 vCPU), or 4096 (4 vCPU).`);

      // Memory is not in 1 GB increments.
      expect(() => {
        new ecs.FargateTaskDefinition(stack, 'FargateTaskDefMemory', {
          cpu: 1024,
          memoryLimitMiB: 1025,
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.X86_64,
            operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
          },
        });
      }).toThrowError('If provided cpu is 1024, then memoryMiB must have a min of 1024 and a max of 8192, in 1024 increments. Provided memoryMiB was 1025.');

      // Check runtimePlatform was been defined ,but not undefined cpu and memoryLimitMiB.
      expect(() => {
        new ecs.FargateTaskDefinition(stack, 'FargateTaskDef', {
          runtimePlatform: {
            cpuArchitecture: ecs.CpuArchitecture.X86_64,
            operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2004_CORE,
          },
        });
      }).toThrowError('If operatingSystemFamily is WINDOWS_SERVER_2004_CORE, then cpu must be in 1024 (1 vCPU), 2048 (2 vCPU), or 4096 (4 vCPU). Provided value was: 256');

    });

  });
});