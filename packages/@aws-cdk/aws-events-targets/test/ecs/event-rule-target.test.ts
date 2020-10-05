import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

test('Can use EC2 taskdef as EventRule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
  });

  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
    memoryLimitMiB: 256,
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }],
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'TaskDef54694570' },
        },
        InputTransformer: {
          InputPathsMap: {
            'detail-event': '$.detail.event',
          },
          InputTemplate: '{"containerOverrides":[{"name":"TheContainer","command":["echo",<detail-event>]}]}',
        },
        RoleArn: { 'Fn::GetAtt': ['TaskDefEventsRoleFB3B67B8', 'Arn'] },
        Id: 'Target0',
      },
    ],
  });
});

test('Can use Fargate taskdef as EventRule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  const target = new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }],
  });
  rule.addTarget(target);

  // THEN
  expect(target.securityGroup).toBeDefined(); // Generated security groups should be accessible.
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'TaskDef54694570' },
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              Subnets: [
                {
                  Ref: 'VpcPrivateSubnet1Subnet536B997A',
                },
              ],
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                {
                  'Fn::GetAtt': [
                    'TaskDefSecurityGroupD50E7CF0',
                    'GroupId',
                  ],
                },
              ],
            },
          },
        },
        InputTransformer: {
          InputPathsMap: {
            'detail-event': '$.detail.event',
          },
          InputTemplate: '{"containerOverrides":[{"name":"TheContainer","command":["echo",<detail-event>]}]}',
        },
        RoleArn: { 'Fn::GetAtt': ['TaskDefEventsRoleFB3B67B8', 'Arn'] },
        Id: 'Target0',
      },
    ],
  });
});

test('Can use same fargate taskdef with multiple rules', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const scheduledRule = new events.Rule(stack, 'ScheduleRule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  const patternRule = new events.Rule(stack, 'PatternRule', {
    eventPattern: {
      detail: ['test'],
    },
  });

  scheduledRule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
  }));

  expect(() => patternRule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
  }))).not.toThrow();
});

test('Can use same fargate taskdef multiple times in a rule', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'ScheduleRule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.a')],
    }],
  }));

  expect(() => rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.b')],
    }],
  }))).not.toThrow();
});

test('Isolated subnet does not have AssignPublicIp=true', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', {
    maxAzs: 1,
    subnetConfiguration: [{
      subnetType: ec2.SubnetType.ISOLATED,
      name: 'Isolated',
    }],
  });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    subnetSelection: { subnetType: ec2.SubnetType.ISOLATED },
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', 'yay'],
    }],
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          TaskCount: 1,
          TaskDefinitionArn: { Ref: 'TaskDef54694570' },
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              Subnets: [
                {
                  Ref: 'VpcIsolatedSubnet1SubnetE48C5737',
                },
              ],
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                {
                  'Fn::GetAtt': [
                    'TaskDefSecurityGroupD50E7CF0',
                    'GroupId',
                  ],
                },
              ],
            },
          },
        },
        Input: '{"containerOverrides":[{"name":"TheContainer","command":["echo","yay"]}]}',
        RoleArn: { 'Fn::GetAtt': ['TaskDefEventsRoleFB3B67B8', 'Arn'] },
        Id: 'Target0',
      },
    ],
  });
});

test('throws an error if both securityGroup and securityGroups is specified', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });
  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

  // THEN
  expect(() => {
    rule.addTarget(new targets.EcsTask({
      cluster,
      taskDefinition,
      taskCount: 1,
      securityGroup,
      securityGroups: [securityGroup],
      containerOverrides: [{
        containerName: 'TheContainer',
        command: ['echo', 'yay'],
      }],
    }));
  }).toThrow(/Only one of SecurityGroup or SecurityGroups can be populated./);
});

test('uses multiple security groups', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });
  const securityGroups = [
    new ec2.SecurityGroup(stack, 'SecurityGroupA', { vpc }),
    new ec2.SecurityGroup(stack, 'SecurityGroupB', { vpc }),
  ];

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    securityGroups,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', 'yay'],
    }],
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsVpcConfiguration: {
              AssignPublicIp: 'DISABLED',
              SecurityGroups: [
                { 'Fn::GetAtt': ['SecurityGroupAED40ADC5', 'GroupId'] },
                { 'Fn::GetAtt': ['SecurityGroupB04591F90', 'GroupId'] },
              ],
              Subnets: [{ Ref: 'VpcPrivateSubnet1Subnet536B997A' }],
            },
          },
          TaskCount: 1,
          TaskDefinitionArn: {
            Ref: 'TaskDef54694570',
          },
        },
        Id: 'Target0',
        Input: '{"containerOverrides":[{"name":"TheContainer","command":["echo","yay"]}]}',
        RoleArn: { 'Fn::GetAtt': ['TaskDefEventsRoleFB3B67B8', 'Arn'] },
      },
    ],
  });
});

test('uses existing IAM role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  const role = new iam.Role(stack, 'CustomIamRole', {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
  });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }],
    role,
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          TaskCount: 1,
          TaskDefinitionArn: {
            Ref: 'TaskDef54694570',
          },
        },
        RoleArn: { 'Fn::GetAtt': ['CustomIamRoleE653F2D1', 'Arn'] },
        Id: 'Target0',
      },
    ],
  });
});

test('uses the specific fargate platform version', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  const platformVersion = ecs.FargatePlatformVersion.VERSION1_4;

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }],
    platformVersion,
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
        EcsParameters: {
          LaunchType: 'FARGATE',
          TaskCount: 1,
          TaskDefinitionArn: {
            Ref: 'TaskDef54694570',
          },
          PlatformVersion: '1.4.0',
        },
        Id: 'Target0',
      },
    ],
  });
});
