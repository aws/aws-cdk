import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Size, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import {
  Cluster,
  Compatibility,
  ContainerImage,
  FargatePlatformVersion,
  PlacementConstraint,
  PlacementStrategy,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { TestSource } from './test-classes';
import { EcsTaskTarget, EcsTaskTargetCompute } from '../lib/ecs';

describe('ecs-task', () => {
  let app: App;
  let stack: Stack;
  let vpc: Vpc;
  let cluster: Cluster;
  let taskDefinition: TaskDefinition;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    vpc = new Vpc(stack, 'Vpc');
    cluster = new Cluster(stack, 'Cluster', { vpc });
    taskDefinition = new TaskDefinition(stack, 'TaskDef', {
      compatibility: Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });
    taskDefinition.addContainer('Container', {
      image: ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
    });
  });

  describe('basic configuration', () => {
    it('should have target arn as cluster arn', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        Target: { 'Fn::GetAtt': [Match.stringLikeRegexp('Cluster'), 'Arn'] },
      });
    });

    it('should have default task count of 1', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            TaskCount: 1,
          },
        },
      });
    });

    it('should have custom task count', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        taskCount: 5,
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            TaskCount: 5,
          },
        },
      });
    });

    it('should have enableEcsManagedTags true by default', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            EnableECSManagedTags: true,
          },
        },
      });
    });

    it('should have enableEcsManagedTags false when specified', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        enableECSManagedTags: false,
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            EnableECSManagedTags: false,
          },
        },
      });
    });

    it('should have enableExecuteCommand when specified', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        enableExecuteCommand: true,
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            EnableExecuteCommand: true,
          },
        },
      });
    });
  });

  describe('network configuration', () => {
    it('should have network configuration with subnets and security groups', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                AssignPublicIp: 'DISABLED',
                Subnets: Match.arrayWith([Match.objectLike({ Ref: Match.stringLikeRegexp('VpcPrivateSubnet') })]),
                SecurityGroups: Match.arrayWith([Match.objectLike({ 'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('SecurityGroup')]) })]),
              },
            },
          },
        },
      });
    });

    it('should have assignPublicIp ENABLED when specified', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        assignPublicIp: true,
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            NetworkConfiguration: {
              AwsvpcConfiguration: {
                AssignPublicIp: 'ENABLED',
              },
            },
          },
        },
      });
    });
  });

  describe('compute configuration', () => {
    it('should use Fargate launch type for Fargate compatible task definition', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            LaunchType: 'FARGATE',
          },
        },
      });
    });

    it('should use EC2 launch type for EC2 compatible task definition', () => {
      const ec2TaskDef = new TaskDefinition(stack, 'Ec2TaskDef', {
        compatibility: Compatibility.EC2,
      });
      ec2TaskDef.addContainer('Container', {
        image: ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
        memoryLimitMiB: 512,
      });

      const target = new EcsTaskTarget(cluster, { taskDefinition: ec2TaskDef });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            LaunchType: 'EC2',
          },
        },
      });
    });

    it('should use explicit Fargate launch type with platform version', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        compute: EcsTaskTargetCompute.fargateLaunchType({
          platformVersion: FargatePlatformVersion.VERSION1_4,
        }),
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            LaunchType: 'FARGATE',
            PlatformVersion: '1.4.0',
          },
        },
      });
    });

    it('should use capacity provider strategy', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        compute: EcsTaskTargetCompute.capacityProviderStrategy([
          { capacityProvider: 'FARGATE', weight: 1 },
          { capacityProvider: 'FARGATE_SPOT', weight: 2 },
        ]),
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            CapacityProviderStrategy: [
              { CapacityProvider: 'FARGATE', Weight: 1 },
              { CapacityProvider: 'FARGATE_SPOT', Weight: 2 },
            ],
          },
        },
      });
    });
  });

  describe('container overrides', () => {
    it('should have container overrides with name mapping', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        containerOverrides: [
          {
            containerName: 'Container',
            command: ['echo', 'hello'],
            cpu: 128,
            memory: Size.gibibytes(1),
            memoryReservation: Size.mebibytes(512),
            environment: [
              { name: 'ENV_VAR', value: 'test' },
            ],
          },
        ],
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            Overrides: {
              ContainerOverrides: [
                {
                  Name: 'Container',
                  Command: ['echo', 'hello'],
                  Cpu: 128,
                  Memory: 1024,
                  MemoryReservation: 512,
                  Environment: [
                    { Name: 'ENV_VAR', Value: 'test' },
                  ],
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('placement', () => {
    it('should have group', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        group: 'my-task-group',
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            Group: 'my-task-group',
          },
        },
      });
    });

    it('should have placement constraints', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        placementConstraints: [PlacementConstraint.distinctInstances()],
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            PlacementConstraints: [{ Type: 'distinctInstance' }],
          },
        },
      });
    });

    it('should have placement strategies', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        placementStrategies: [PlacementStrategy.spreadAcrossInstances()],
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            PlacementStrategy: [{ Field: 'instanceId', Type: 'spread' }],
          },
        },
      });
    });
  });

  describe('task overrides', () => {
    it('should have cpu and memory overrides', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        cpu: '512',
        memory: '1024',
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            Overrides: {
              Cpu: '512',
              Memory: '1024',
            },
          },
        },
      });
    });

    it('should have ephemeral storage override', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        ephemeralStorage: Size.gibibytes(30),
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            Overrides: {
              EphemeralStorage: { SizeInGiB: 30 },
            },
          },
        },
      });
    });

    it('should have execution role and task role overrides', () => {
      const executionRole = new Role(stack, 'ExecutionRole', {
        assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
      const taskRole = new Role(stack, 'TaskRole', {
        assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        executionRole,
        taskRole,
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          EcsTaskParameters: {
            Overrides: {
              ExecutionRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('ExecutionRole'), 'Arn'] },
              TaskRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('TaskRole'), 'Arn'] },
            },
          },
        },
      });
    });
  });

  describe('input transformation', () => {
    it('should have input transformation', () => {
      const target = new EcsTaskTarget(cluster, {
        taskDefinition,
        inputTransformation: InputTransformation.fromObject({ key: 'value' }),
      });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Pipes::Pipe', {
        TargetParameters: {
          InputTemplate: '{"key":"value"}',
        },
      });
    });
  });

  describe('IAM permissions', () => {
    it('should grant ecs:RunTask permission on task definition', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: { Ref: Match.stringLikeRegexp('TaskDef') },
            }),
          ]),
        },
      });
    });

    it('should grant iam:PassRole permission for task role only (without execution role)', () => {
      const target = new EcsTaskTarget(cluster, { taskDefinition });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('TaskDefTaskRole'), 'Arn'] },
              Condition: {
                StringLike: {
                  'iam:PassedToService': 'ecs-tasks.amazonaws.com',
                },
              },
            }),
          ]),
        },
      });
    });

    it('should grant iam:PassRole permission for both task role and execution role (with ECR image)', () => {
      const repo = new Repository(stack, 'Repo');
      const taskDefWithEcr = new TaskDefinition(stack, 'TaskDefWithEcr', {
        compatibility: Compatibility.EC2,
      });
      taskDefWithEcr.addContainer('Container', {
        image: ContainerImage.fromEcrRepository(repo),
        memoryLimitMiB: 512,
      });

      const target = new EcsTaskTarget(cluster, { taskDefinition: taskDefWithEcr });

      new Pipe(stack, 'Pipe', {
        source: new TestSource(),
        target,
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: [
                { 'Fn::GetAtt': [Match.stringLikeRegexp('TaskDefWithEcrTaskRole'), 'Arn'] },
                { 'Fn::GetAtt': [Match.stringLikeRegexp('TaskDefWithEcrExecutionRole'), 'Arn'] },
              ],
              Condition: {
                StringLike: {
                  'iam:PassedToService': 'ecs-tasks.amazonaws.com',
                },
              },
            }),
          ]),
        },
      });
    });
  });

  describe('validation', () => {
    it('should throw error when assignPublicIp is true with EC2 launch type', () => {
      const ec2TaskDef = new TaskDefinition(stack, 'Ec2TaskDef', {
        compatibility: Compatibility.EC2,
      });
      ec2TaskDef.addContainer('Container', {
        image: ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
        memoryLimitMiB: 512,
      });

      const target = new EcsTaskTarget(cluster, {
        taskDefinition: ec2TaskDef,
        assignPublicIp: true,
      });

      expect(() => {
        new Pipe(stack, 'Pipe', {
          source: new TestSource(),
          target,
        });
      }).toThrow(/You can specify ENABLED only when LaunchType in EcsParameters is set to FARGATE/);
    });
  });
});
