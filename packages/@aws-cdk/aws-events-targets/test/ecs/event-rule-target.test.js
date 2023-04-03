"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const sqs = require("@aws-cdk/aws-sqs");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const targets = require("../../lib");
let stack;
let vpc;
let cluster;
beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
    cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        instanceType: new ec2.InstanceType('t2.micro'),
    });
    const provider = new ecs.AsgCapacityProvider(stack, 'AsgCapacityProvider', { autoScalingGroup });
    cluster.addAsgCapacityProvider(provider);
});
test('Can use EC2 taskdef as EventRule target', () => {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
test('Can use EC2 taskdef as EventRule target with dead letter queue', () => {
    // GIVEN
    const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
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
        deadLetterQueue,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
                DeadLetterConfig: {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyDeadLetterQueueD997968A',
                            'Arn',
                        ],
                    },
                },
            },
        ],
    });
});
test('Throws error for lacking of taskRole ' +
    'when importing from an EC2 task definition just from a task definition arn as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionArn(stack, 'TaskDef', 'importedTaskDefArn');
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    // THEN
    expect(() => {
        rule.addTarget(new targets.EcsTask({
            cluster,
            taskDefinition,
            taskCount: 1,
            containerOverrides: [{
                    containerName: 'TheContainer',
                    command: ['echo', events.EventField.fromPath('$.detail.event')],
                }],
        }));
    }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
});
test('Can import an EC2 task definition from task definition attributes as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.Ec2TaskDefinition.fromEc2TaskDefinitionAttributes(stack, 'TaskDef', {
        taskDefinitionArn: 'importedTaskDefArn',
        networkMode: ecs.NetworkMode.BRIDGE,
        taskRole: new iam.Role(stack, 'TaskRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
                EcsParameters: {
                    TaskCount: 1,
                    TaskDefinitionArn: 'importedTaskDefArn',
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
test('Throws error for lacking of taskRole ' +
    'when importing from a Fargate task definition just from a task definition arn as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'TaskDef', 'ImportedTaskDefArn');
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    // THEN
    expect(() => {
        rule.addTarget(new targets.EcsTask({
            cluster,
            taskDefinition,
            taskCount: 1,
            containerOverrides: [{
                    containerName: 'TheContainer',
                    command: ['echo', events.EventField.fromPath('$.detail.event')],
                }],
        }));
    }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
});
test('Can import a Fargate task definition from task definition attributes as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TaskDef', {
        taskDefinitionArn: 'importedTaskDefArn',
        networkMode: ecs.NetworkMode.AWS_VPC,
        taskRole: new iam.Role(stack, 'TaskRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
                EcsParameters: {
                    TaskCount: 1,
                    TaskDefinitionArn: 'importedTaskDefArn',
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
test('Throws error for lacking of taskRole ' +
    'when importing from a task definition just from a task definition arn as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(stack, 'TaskDef', 'ImportedTaskDefArn');
    const rule = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.expression('rate(1 min)'),
    });
    // THEN
    expect(() => {
        rule.addTarget(new targets.EcsTask({
            cluster,
            taskDefinition,
            taskCount: 1,
            containerOverrides: [{
                    containerName: 'TheContainer',
                    command: ['echo', events.EventField.fromPath('$.detail.event')],
                }],
        }));
    }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');
});
test('Can import a Task definition from task definition attributes as EventRule target', () => {
    // GIVEN
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionAttributes(stack, 'TaskDef', {
        taskDefinitionArn: 'importedTaskDefArn',
        networkMode: ecs.NetworkMode.AWS_VPC,
        taskRole: new iam.Role(stack, 'TaskRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: { 'Fn::GetAtt': ['EcsCluster97242B84', 'Arn'] },
                EcsParameters: {
                    TaskCount: 1,
                    TaskDefinitionArn: 'importedTaskDefArn',
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
    expect(target.securityGroups?.length).toBeGreaterThan(0); // Generated security groups should be accessible.
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
test('Can use Fargate taskdef as EventRule target with dead letter queue', () => {
    // GIVEN
    const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
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
        deadLetterQueue,
    });
    rule.addTarget(target);
    // THEN
    expect(target.securityGroups?.length).toBeGreaterThan(0); // Generated security groups should be accessible.
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
                DeadLetterConfig: {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyDeadLetterQueueD997968A',
                            'Arn',
                        ],
                    },
                },
            },
        ],
    });
});
test('Can use same fargate taskdef with multiple rules', () => {
    // GIVEN
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
    vpc = new ec2.Vpc(stack, 'Vpc2', {
        maxAzs: 1,
        subnetConfiguration: [{
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                name: 'Isolated',
            }],
    });
    cluster = new ecs.Cluster(stack, 'EcsCluster2', { vpc });
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
        subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        containerOverrides: [{
                containerName: 'TheContainer',
                command: ['echo', 'yay'],
            }],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Targets: [
            {
                Arn: { 'Fn::GetAtt': ['EcsCluster2F191ADEC', 'Arn'] },
                EcsParameters: {
                    TaskCount: 1,
                    TaskDefinitionArn: { Ref: 'TaskDef54694570' },
                    LaunchType: 'FARGATE',
                    NetworkConfiguration: {
                        AwsVpcConfiguration: {
                            Subnets: [
                                {
                                    Ref: 'Vpc2IsolatedSubnet1SubnetB1A200D6',
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
cdk_build_tools_1.testDeprecated('throws an error if both securityGroup and securityGroups is specified', () => {
    // GIVEN
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtcnVsZS10YXJnZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXJ1bGUtdGFyZ2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0RBQXdEO0FBQ3hELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOERBQTBEO0FBQzFELHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLElBQUksR0FBWSxDQUFDO0FBQ2pCLElBQUksT0FBb0IsQ0FBQztBQUV6QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLEVBQUU7UUFDMUYsR0FBRztRQUNILFlBQVksRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFO1FBQ2xELFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0tBQy9DLENBQUMsQ0FBQztJQUNILE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUNqRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsUUFB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QUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7S0FDcEQsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ2pDLE9BQU87UUFDUCxjQUFjO1FBQ2QsU0FBUyxFQUFFLENBQUM7UUFDWixrQkFBa0IsRUFBRSxDQUFDO2dCQUNuQixhQUFhLEVBQUUsY0FBYztnQkFDN0IsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDaEUsQ0FBQztRQUNGLGVBQWU7S0FDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSixPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7UUFDbkUsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BELGFBQWEsRUFBRTtvQkFDYixVQUFVLEVBQUUsU0FBUztvQkFDckIsU0FBUyxFQUFFLENBQUM7b0JBQ1osaUJBQWlCLEVBQUU7d0JBQ2pCLEdBQUcsRUFBRSxpQkFBaUI7cUJBQ3ZCO29CQUNELGVBQWUsRUFBRSxPQUFPO2lCQUN6QjtnQkFDRCxFQUFFLEVBQUUsU0FBUzthQUNkO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi8uLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCB2cGM6IGVjMi5WcGM7XG5sZXQgY2x1c3RlcjogZWNzLkNsdXN0ZXI7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMSB9KTtcbiAgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgdnBjLFxuICAgIG1hY2hpbmVJbWFnZTogZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MigpLFxuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gIH0pO1xuICBjb25zdCBwcm92aWRlciA9IG5ldyBlY3MuQXNnQ2FwYWNpdHlQcm92aWRlcihzdGFjaywgJ0FzZ0NhcGFjaXR5UHJvdmlkZXInLCB7IGF1dG9TY2FsaW5nR3JvdXAgfSk7XG4gIGNsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihwcm92aWRlcik7XG59KTtcblxudGVzdCgnQ2FuIHVzZSBFQzIgdGFza2RlZiBhcyBFdmVudFJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG4gIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignVGhlQ29udGFpbmVyJywge1xuICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gICAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczogW3tcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgIH1dLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICdkZXRhaWwtZXZlbnQnOiAnJC5kZXRhaWwuZXZlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsPGRldGFpbC1ldmVudD5dfV19JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdDYW4gdXNlIEVDMiB0YXNrZGVmIGFzIEV2ZW50UnVsZSB0YXJnZXQgd2l0aCBkZWFkIGxldHRlciBxdWV1ZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgZGVhZExldHRlclF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015RGVhZExldHRlclF1ZXVlJyk7XG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgICBtZW1vcnlMaW1pdE1pQjogMjU2LFxuICB9KTtcblxuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW4pJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB0YXNrQ291bnQ6IDEsXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuZXZlbnQnKV0sXG4gICAgfV0sXG4gICAgZGVhZExldHRlclF1ZXVlLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICdkZXRhaWwtZXZlbnQnOiAnJC5kZXRhaWwuZXZlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsPGRldGFpbC1ldmVudD5dfV19JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RGVhZExldHRlclF1ZXVlRDk5Nzk2OEEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnVGhyb3dzIGVycm9yIGZvciBsYWNraW5nIG9mIHRhc2tSb2xlICcgK1xuICAgICd3aGVuIGltcG9ydGluZyBmcm9tIGFuIEVDMiB0YXNrIGRlZmluaXRpb24ganVzdCBmcm9tIGEgdGFzayBkZWZpbml0aW9uIGFybiBhcyBFdmVudFJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5FYzJUYXNrRGVmaW5pdGlvbi5mcm9tRWMyVGFza0RlZmluaXRpb25Bcm4oc3RhY2ssICdUYXNrRGVmJywgJ2ltcG9ydGVkVGFza0RlZkFybicpO1xuXG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgdGFza0NvdW50OiAxLFxuICAgICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgICBjb250YWluZXJOYW1lOiAnVGhlQ29udGFpbmVyJyxcbiAgICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgICAgfV0sXG4gICAgfSkpO1xuICB9KS50b1Rocm93KCdUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyB0aGUgdGFza1JvbGUgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB0byBiZSBkZWZpbmVkLiAnICtcbiAgICAnQWRkIHRoZSBcXCd0YXNrUm9sZVxcJyBpbiBJbXBvcnRlZFRhc2tEZWZpbml0aW9uUHJvcHMgdG8gaW5zdGFudGlhdGUgSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbicpO1xufSk7XG5cbnRlc3QoJ0NhbiBpbXBvcnQgYW4gRUMyIHRhc2sgZGVmaW5pdGlvbiBmcm9tIHRhc2sgZGVmaW5pdGlvbiBhdHRyaWJ1dGVzIGFzIEV2ZW50UnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gZWNzLkVjMlRhc2tEZWZpbml0aW9uLmZyb21FYzJUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdUYXNrRGVmJywge1xuICAgIHRhc2tEZWZpbml0aW9uQXJuOiAnaW1wb3J0ZWRUYXNrRGVmQXJuJyxcbiAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkJSSURHRSxcbiAgICB0YXNrUm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGFza1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczogW3tcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgIH1dLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiAnaW1wb3J0ZWRUYXNrRGVmQXJuJyxcbiAgICAgICAgfSxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICdkZXRhaWwtZXZlbnQnOiAnJC5kZXRhaWwuZXZlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsPGRldGFpbC1ldmVudD5dfV19JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdUaHJvd3MgZXJyb3IgZm9yIGxhY2tpbmcgb2YgdGFza1JvbGUgJyArXG4gICd3aGVuIGltcG9ydGluZyBmcm9tIGEgRmFyZ2F0ZSB0YXNrIGRlZmluaXRpb24ganVzdCBmcm9tIGEgdGFzayBkZWZpbml0aW9uIGFybiBhcyBFdmVudFJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24uZnJvbUZhcmdhdGVUYXNrRGVmaW5pdGlvbkFybihzdGFjaywgJ1Rhc2tEZWYnLCAnSW1wb3J0ZWRUYXNrRGVmQXJuJyk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICB0YXNrQ291bnQ6IDEsXG4gICAgICBjb250YWluZXJPdmVycmlkZXM6IFt7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgICBjb21tYW5kOiBbJ2VjaG8nLCBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuZXZlbnQnKV0sXG4gICAgICB9XSxcbiAgICB9KSk7XG4gIH0pLnRvVGhyb3coJ1RoaXMgb3BlcmF0aW9uIHJlcXVpcmVzIHRoZSB0YXNrUm9sZSBpbiBJbXBvcnRlZFRhc2tEZWZpbml0aW9uIHRvIGJlIGRlZmluZWQuICcgK1xuICAgICdBZGQgdGhlIFxcJ3Rhc2tSb2xlXFwnIGluIEltcG9ydGVkVGFza0RlZmluaXRpb25Qcm9wcyB0byBpbnN0YW50aWF0ZSBJbXBvcnRlZFRhc2tEZWZpbml0aW9uJyk7XG59KTtcblxudGVzdCgnQ2FuIGltcG9ydCBhIEZhcmdhdGUgdGFzayBkZWZpbml0aW9uIGZyb20gdGFzayBkZWZpbml0aW9uIGF0dHJpYnV0ZXMgYXMgRXZlbnRSdWxlIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uLmZyb21GYXJnYXRlVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgICB0YXNrRGVmaW5pdGlvbkFybjogJ2ltcG9ydGVkVGFza0RlZkFybicsXG4gICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgIHRhc2tSb2xlOiBuZXcgaWFtLlJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW4pJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB0YXNrQ291bnQ6IDEsXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuZXZlbnQnKV0sXG4gICAgfV0sXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzQ2x1c3Rlcjk3MjQyQjg0JywgJ0FybiddIH0sXG4gICAgICAgIEVjc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICBUYXNrQ291bnQ6IDEsXG4gICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46ICdpbXBvcnRlZFRhc2tEZWZBcm4nLFxuICAgICAgICB9LFxuICAgICAgICBJbnB1dFRyYW5zZm9ybWVyOiB7XG4gICAgICAgICAgSW5wdXRQYXRoc01hcDoge1xuICAgICAgICAgICAgJ2RldGFpbC1ldmVudCc6ICckLmRldGFpbC5ldmVudCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJbnB1dFRlbXBsYXRlOiAne1wiY29udGFpbmVyT3ZlcnJpZGVzXCI6W3tcIm5hbWVcIjpcIlRoZUNvbnRhaW5lclwiLFwiY29tbWFuZFwiOltcImVjaG9cIiw8ZGV0YWlsLWV2ZW50Pl19XX0nLFxuICAgICAgICB9LFxuICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydUYXNrRGVmRXZlbnRzUm9sZUZCM0I2N0I4JywgJ0FybiddIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1Rocm93cyBlcnJvciBmb3IgbGFja2luZyBvZiB0YXNrUm9sZSAnICtcbiAgJ3doZW4gaW1wb3J0aW5nIGZyb20gYSB0YXNrIGRlZmluaXRpb24ganVzdCBmcm9tIGEgdGFzayBkZWZpbml0aW9uIGFybiBhcyBFdmVudFJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5UYXNrRGVmaW5pdGlvbi5mcm9tVGFza0RlZmluaXRpb25Bcm4oc3RhY2ssICdUYXNrRGVmJywgJ0ltcG9ydGVkVGFza0RlZkFybicpO1xuXG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgdGFza0NvdW50OiAxLFxuICAgICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgICBjb250YWluZXJOYW1lOiAnVGhlQ29udGFpbmVyJyxcbiAgICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgICAgfV0sXG4gICAgfSkpO1xuICB9KS50b1Rocm93KCdUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyB0aGUgdGFza1JvbGUgaW4gSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB0byBiZSBkZWZpbmVkLiAnICtcbiAgICAnQWRkIHRoZSBcXCd0YXNrUm9sZVxcJyBpbiBJbXBvcnRlZFRhc2tEZWZpbml0aW9uUHJvcHMgdG8gaW5zdGFudGlhdGUgSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbicpO1xufSk7XG5cbnRlc3QoJ0NhbiBpbXBvcnQgYSBUYXNrIGRlZmluaXRpb24gZnJvbSB0YXNrIGRlZmluaXRpb24gYXR0cmlidXRlcyBhcyBFdmVudFJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24uZnJvbUZhcmdhdGVUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMoc3RhY2ssICdUYXNrRGVmJywge1xuICAgIHRhc2tEZWZpbml0aW9uQXJuOiAnaW1wb3J0ZWRUYXNrRGVmQXJuJyxcbiAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgdGFza1JvbGU6IG5ldyBpYW0uUm9sZShzdGFjaywgJ1Rhc2tSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgfSksXG4gIH0pO1xuXG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5FY3NUYXNrKHtcbiAgICBjbHVzdGVyLFxuICAgIHRhc2tEZWZpbml0aW9uLFxuICAgIHRhc2tDb3VudDogMSxcbiAgICBjb250YWluZXJPdmVycmlkZXM6IFt7XG4gICAgICBjb250YWluZXJOYW1lOiAnVGhlQ29udGFpbmVyJyxcbiAgICAgIGNvbW1hbmQ6IFsnZWNobycsIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5ldmVudCcpXSxcbiAgICB9XSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7ICdGbjo6R2V0QXR0JzogWydFY3NDbHVzdGVyOTcyNDJCODQnLCAnQXJuJ10gfSxcbiAgICAgICAgRWNzUGFyYW1ldGVyczoge1xuICAgICAgICAgIFRhc2tDb3VudDogMSxcbiAgICAgICAgICBUYXNrRGVmaW5pdGlvbkFybjogJ2ltcG9ydGVkVGFza0RlZkFybicsXG4gICAgICAgIH0sXG4gICAgICAgIElucHV0VHJhbnNmb3JtZXI6IHtcbiAgICAgICAgICBJbnB1dFBhdGhzTWFwOiB7XG4gICAgICAgICAgICAnZGV0YWlsLWV2ZW50JzogJyQuZGV0YWlsLmV2ZW50JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElucHV0VGVtcGxhdGU6ICd7XCJjb250YWluZXJPdmVycmlkZXNcIjpbe1wibmFtZVwiOlwiVGhlQ29udGFpbmVyXCIsXCJjb21tYW5kXCI6W1wiZWNob1wiLDxkZXRhaWwtZXZlbnQ+XX1dfScsXG4gICAgICAgIH0sXG4gICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1Rhc2tEZWZFdmVudHNSb2xlRkIzQjY3QjgnLCAnQXJuJ10gfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnQ2FuIHVzZSBGYXJnYXRlIHRhc2tkZWYgYXMgRXZlbnRSdWxlIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHRhcmdldCA9IG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczogW3tcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgIH1dLFxuICB9KTtcbiAgcnVsZS5hZGRUYXJnZXQodGFyZ2V0KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCh0YXJnZXQuc2VjdXJpdHlHcm91cHM/Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApOyAvLyBHZW5lcmF0ZWQgc2VjdXJpdHkgZ3JvdXBzIHNob3VsZCBiZSBhY2Nlc3NpYmxlLlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcgfSxcbiAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEF3c1ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1ZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTM2Qjk5N0EnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEFzc2lnblB1YmxpY0lwOiAnRElTQUJMRUQnLFxuICAgICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnVGFza0RlZlNlY3VyaXR5R3JvdXBENTBFN0NGMCcsXG4gICAgICAgICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICdkZXRhaWwtZXZlbnQnOiAnJC5kZXRhaWwuZXZlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsPGRldGFpbC1ldmVudD5dfV19JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdDYW4gdXNlIEZhcmdhdGUgdGFza2RlZiBhcyBFdmVudFJ1bGUgdGFyZ2V0IHdpdGggZGVhZCBsZXR0ZXIgcXVldWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGRlYWRMZXR0ZXJRdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeURlYWRMZXR0ZXJRdWV1ZScpO1xuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ1RoZUNvbnRhaW5lcicsIHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVuaycpLFxuICB9KTtcblxuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW4pJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgdGFyZ2V0ID0gbmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB0YXNrQ291bnQ6IDEsXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuZXZlbnQnKV0sXG4gICAgfV0sXG4gICAgZGVhZExldHRlclF1ZXVlLFxuICB9KTtcbiAgcnVsZS5hZGRUYXJnZXQodGFyZ2V0KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCh0YXJnZXQuc2VjdXJpdHlHcm91cHM/Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApOyAvLyBHZW5lcmF0ZWQgc2VjdXJpdHkgZ3JvdXBzIHNob3VsZCBiZSBhY2Nlc3NpYmxlLlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcgfSxcbiAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEF3c1ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1ZwY1ByaXZhdGVTdWJuZXQxU3VibmV0NTM2Qjk5N0EnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEFzc2lnblB1YmxpY0lwOiAnRElTQUJMRUQnLFxuICAgICAgICAgICAgICBTZWN1cml0eUdyb3VwczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnVGFza0RlZlNlY3VyaXR5R3JvdXBENTBFN0NGMCcsXG4gICAgICAgICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICdkZXRhaWwtZXZlbnQnOiAnJC5kZXRhaWwuZXZlbnQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsPGRldGFpbC1ldmVudD5dfV19JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RGVhZExldHRlclF1ZXVlRDk5Nzk2OEEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnQ2FuIHVzZSBzYW1lIGZhcmdhdGUgdGFza2RlZiB3aXRoIG11bHRpcGxlIHJ1bGVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ1RoZUNvbnRhaW5lcicsIHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVuaycpLFxuICB9KTtcblxuICBjb25zdCBzY2hlZHVsZWRSdWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnU2NoZWR1bGVSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgY29uc3QgcGF0dGVyblJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdQYXR0ZXJuUnVsZScsIHtcbiAgICBldmVudFBhdHRlcm46IHtcbiAgICAgIGRldGFpbDogWyd0ZXN0J10sXG4gICAgfSxcbiAgfSk7XG5cbiAgc2NoZWR1bGVkUnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgfSkpO1xuXG4gIGV4cGVjdCgoKSA9PiBwYXR0ZXJuUnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgfSkpKS5ub3QudG9UaHJvdygpO1xufSk7XG5cbnRlc3QoJ0NhbiB1c2Ugc2FtZSBmYXJnYXRlIHRhc2tkZWYgbXVsdGlwbGUgdGltZXMgaW4gYSBydWxlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ1RoZUNvbnRhaW5lcicsIHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVuaycpLFxuICB9KTtcblxuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnU2NoZWR1bGVSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgICBjb250YWluZXJPdmVycmlkZXM6IFt7XG4gICAgICBjb250YWluZXJOYW1lOiAnVGhlQ29udGFpbmVyJyxcbiAgICAgIGNvbW1hbmQ6IFsnZWNobycsIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5hJyldLFxuICAgIH1dLFxuICB9KSk7XG5cbiAgZXhwZWN0KCgpID0+IHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuYicpXSxcbiAgICB9XSxcbiAgfSkpKS5ub3QudG9UaHJvdygpO1xufSk7XG5cbnRlc3QoJ0lzb2xhdGVkIHN1Ym5ldCBkb2VzIG5vdCBoYXZlIEFzc2lnblB1YmxpY0lwPXRydWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjMicsIHtcbiAgICBtYXhBenM6IDEsXG4gICAgc3VibmV0Q29uZmlndXJhdGlvbjogW3tcbiAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgIH1dLFxuICB9KTtcbiAgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXIyJywgeyB2cGMgfSk7XG5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIHN1Ym5ldFNlbGVjdGlvbjogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEIH0sXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCAneWF5J10sXG4gICAgfV0sXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzQ2x1c3RlcjJGMTkxQURFQycsICdBcm4nXSB9LFxuICAgICAgICBFY3NQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7IFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcgfSxcbiAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEF3c1ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgU3VibmV0czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1ZwYzJJc29sYXRlZFN1Ym5ldDFTdWJuZXRCMUEyMDBENicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdUYXNrRGVmU2VjdXJpdHlHcm91cEQ1MEU3Q0YwJyxcbiAgICAgICAgICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBJbnB1dDogJ3tcImNvbnRhaW5lck92ZXJyaWRlc1wiOlt7XCJuYW1lXCI6XCJUaGVDb250YWluZXJcIixcImNvbW1hbmRcIjpbXCJlY2hvXCIsXCJ5YXlcIl19XX0nLFxuICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydUYXNrRGVmRXZlbnRzUm9sZUZCM0I2N0I4JywgJ0FybiddIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd0aHJvd3MgYW4gZXJyb3IgaWYgYm90aCBzZWN1cml0eUdyb3VwIGFuZCBzZWN1cml0eUdyb3VwcyBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG4gIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignVGhlQ29udGFpbmVyJywge1xuICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZW5rJyksXG4gIH0pO1xuXG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgfSk7XG4gIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgdGFza0NvdW50OiAxLFxuICAgICAgc2VjdXJpdHlHcm91cCxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgICBjb250YWluZXJPdmVycmlkZXM6IFt7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgICBjb21tYW5kOiBbJ2VjaG8nLCAneWF5J10sXG4gICAgICB9XSxcbiAgICB9KSk7XG4gIH0pLnRvVGhyb3coL09ubHkgb25lIG9mIFNlY3VyaXR5R3JvdXAgb3IgU2VjdXJpdHlHcm91cHMgY2FuIGJlIHBvcHVsYXRlZC4vKTtcbn0pO1xuXG50ZXN0KCd1c2VzIG11bHRpcGxlIHNlY3VyaXR5IGdyb3VwcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcbiAgY29uc3Qgc2VjdXJpdHlHcm91cHMgPSBbXG4gICAgbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cEEnLCB7IHZwYyB9KSxcbiAgICBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwQicsIHsgdnBjIH0pLFxuICBdO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuRWNzVGFzayh7XG4gICAgY2x1c3RlcixcbiAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB0YXNrQ291bnQ6IDEsXG4gICAgc2VjdXJpdHlHcm91cHMsXG4gICAgY29udGFpbmVyT3ZlcnJpZGVzOiBbe1xuICAgICAgY29udGFpbmVyTmFtZTogJ1RoZUNvbnRhaW5lcicsXG4gICAgICBjb21tYW5kOiBbJ2VjaG8nLCAneWF5J10sXG4gICAgfV0sXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzQ2x1c3Rlcjk3MjQyQjg0JywgJ0FybiddIH0sXG4gICAgICAgIEVjc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgTmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIEF3c1ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgQXNzaWduUHVibGljSXA6ICdESVNBQkxFRCcsXG4gICAgICAgICAgICAgIFNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnU2VjdXJpdHlHcm91cEFFRDQwQURDNScsICdHcm91cElkJ10gfSxcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydTZWN1cml0eUdyb3VwQjA0NTkxRjkwJywgJ0dyb3VwSWQnXSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBTdWJuZXRzOiBbeyBSZWY6ICdWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUzNkI5OTdBJyB9XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUYXNrQ291bnQ6IDEsXG4gICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46IHtcbiAgICAgICAgICAgIFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgSW5wdXQ6ICd7XCJjb250YWluZXJPdmVycmlkZXNcIjpbe1wibmFtZVwiOlwiVGhlQ29udGFpbmVyXCIsXCJjb21tYW5kXCI6W1wiZWNob1wiLFwieWF5XCJdfV19JyxcbiAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZkV2ZW50c1JvbGVGQjNCNjdCOCcsICdBcm4nXSB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd1c2VzIGV4aXN0aW5nIElBTSByb2xlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnQ3VzdG9tSWFtUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZXZlbnRzLmFtYXpvbmF3cy5jb20nKSxcbiAgfSk7XG5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczogW3tcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgIH1dLFxuICAgIHJvbGUsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjogeyAnRm46OkdldEF0dCc6IFsnRWNzQ2x1c3Rlcjk3MjQyQjg0JywgJ0FybiddIH0sXG4gICAgICAgIEVjc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICAgICAgVGFza0NvdW50OiAxLFxuICAgICAgICAgIFRhc2tEZWZpbml0aW9uQXJuOiB7XG4gICAgICAgICAgICBSZWY6ICdUYXNrRGVmNTQ2OTQ1NzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0N1c3RvbUlhbVJvbGVFNjUzRjJEMScsICdBcm4nXSB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd1c2VzIHRoZSBzcGVjaWZpYyBmYXJnYXRlIHBsYXRmb3JtIHZlcnNpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHBsYXRmb3JtVmVyc2lvbiA9IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzQ7XG5cbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdUaGVDb250YWluZXInLCB7XG4gICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbmsnKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkVjc1Rhc2soe1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgdGFza0NvdW50OiAxLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczogW3tcbiAgICAgIGNvbnRhaW5lck5hbWU6ICdUaGVDb250YWluZXInLFxuICAgICAgY29tbWFuZDogWydlY2hvJywgZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmV2ZW50JyldLFxuICAgIH1dLFxuICAgIHBsYXRmb3JtVmVyc2lvbixcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7ICdGbjo6R2V0QXR0JzogWydFY3NDbHVzdGVyOTcyNDJCODQnLCAnQXJuJ10gfSxcbiAgICAgICAgRWNzUGFyYW1ldGVyczoge1xuICAgICAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICAgICAgICBUYXNrQ291bnQ6IDEsXG4gICAgICAgICAgVGFza0RlZmluaXRpb25Bcm46IHtcbiAgICAgICAgICAgIFJlZjogJ1Rhc2tEZWY1NDY5NDU3MCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQbGF0Zm9ybVZlcnNpb246ICcxLjQuMCcsXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG4iXX0=