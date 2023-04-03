"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const codedeploy = require("../../lib");
const mockCluster = 'my-cluster';
const mockService = 'my-service';
const mockRegion = 'my-region';
const mockAccount = 'my-account';
function mockEcsService(stack) {
    const serviceArn = `arn:aws:ecs:${mockRegion}:${mockAccount}:service/${mockCluster}/${mockService}`;
    return ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);
}
function mockTargetGroup(stack, id) {
    const targetGroupArn = `arn:aws:elasticloadbalancing:${mockRegion}:${mockAccount}:targetgroup/${id}/f7a80aba5edd5980`;
    return elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, id, {
        targetGroupArn,
    });
}
function mockListener(stack, id) {
    const listenerArn = `arn:aws:elasticloadbalancing:${mockRegion}:${mockAccount}:listener/app/myloadbalancer/lb-12345/${id}`;
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySecurityGroup' + id, 'sg-12345678');
    return elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener' + id, {
        listenerArn,
        securityGroup,
    });
}
describe('CodeDeploy ECS DeploymentGroup', () => {
    describe('imported with fromEcsDeploymentGroupAttributes', () => {
        test('defaults the Deployment Config to AllAtOnce', () => {
            const stack = new cdk.Stack();
            const ecsApp = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'EA', 'EcsApplication');
            const importedGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'EDG', {
                application: ecsApp,
                deploymentGroupName: 'EcsDeploymentGroup',
            });
            expect(importedGroup.deploymentConfig.deploymentConfigName).toEqual('CodeDeployDefault.ECSAllAtOnce');
        });
    });
    test('can be created with default configuration', () => {
        const stack = new cdk.Stack();
        stack.node.setContext('@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup', true);
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
            Type: 'AWS::CodeDeploy::DeploymentGroup',
            Properties: {
                ApplicationName: {
                    Ref: 'MyDGApplication57B1E402',
                },
                ServiceRoleArn: {
                    'Fn::GetAtt': [
                        'MyDGServiceRole5E94FD88',
                        'Arn',
                    ],
                },
                AlarmConfiguration: {
                    Enabled: false,
                    Alarms: assertions_1.Match.absent(),
                },
                AutoRollbackConfiguration: {
                    Enabled: true,
                    Events: [
                        'DEPLOYMENT_FAILURE',
                    ],
                },
                BlueGreenDeploymentConfiguration: {
                    DeploymentReadyOption: {
                        ActionOnTimeout: 'CONTINUE_DEPLOYMENT',
                        WaitTimeInMinutes: 0,
                    },
                    TerminateBlueInstancesOnDeploymentSuccess: {
                        Action: 'TERMINATE',
                        TerminationWaitTimeInMinutes: 0,
                    },
                },
                DeploymentConfigName: 'CodeDeployDefault.ECSAllAtOnce',
                DeploymentStyle: {
                    DeploymentOption: 'WITH_TRAFFIC_CONTROL',
                    DeploymentType: 'BLUE_GREEN',
                },
                ECSServices: [
                    {
                        ClusterName: 'my-cluster',
                        ServiceName: 'my-service',
                    },
                ],
                LoadBalancerInfo: {
                    TargetGroupPairInfoList: [
                        {
                            ProdTrafficRoute: {
                                ListenerArns: [
                                    'arn:aws:elasticloadbalancing:my-region:my-account:listener/app/myloadbalancer/lb-12345/prod',
                                ],
                            },
                            TargetGroups: [
                                {
                                    Name: 'blue',
                                },
                                {
                                    Name: 'green',
                                },
                            ],
                        },
                    ],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CodeDeploy::Application', {
            Type: 'AWS::CodeDeploy::Application',
            Properties: {
                ComputePlatform: 'ECS',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: {
                                'Fn::FindInMap': [
                                    'ServiceprincipalMap',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'codedeploy',
                                ],
                            },
                        },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::aws:policy/AWSCodeDeployRoleForECS',
                        ],
                    ],
                },
            ],
        });
    });
    test('can be created with explicit name', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'test',
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            DeploymentGroupName: 'test',
        });
    });
    test('can be created with explicit application', () => {
        const stack = new cdk.Stack();
        const application = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'A', 'myapp');
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            application,
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            ApplicationName: 'myapp',
        });
    });
    test('can be created with explicit deployment config', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_15MINUTES,
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            DeploymentConfigName: 'CodeDeployDefault.ECSCanary10Percent15Minutes',
        });
    });
    test('fail with more than 100 characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'a'.repeat(101),
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        expect(() => app.synth()).toThrow(`Deployment group name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
    });
    test('fail with unallowed characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'my name',
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        expect(() => app.synth()).toThrow('Deployment group name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
    });
    test('fail when ECS service does not use CODE_DEPLOY deployment controller', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        const service = new ecs.FargateService(stack, 'FargateService', {
            cluster,
            taskDefinition,
            deploymentController: {
                type: ecs.DeploymentControllerType.ECS,
            },
        });
        expect(() => new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'a'.repeat(101),
            service,
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        })).toThrow('The ECS service associated with the deployment group must use the CODE_DEPLOY deployment controller type');
    });
    test('fail when ECS service uses CODE_DEPLOY deployment controller, but did not strip the revision ID from the task definition', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        const service = new ecs.FargateService(stack, 'FargateService', {
            cluster,
            taskDefinition,
            deploymentController: {
                type: ecs.DeploymentControllerType.CODE_DEPLOY,
            },
        });
        service.node.defaultChild.taskDefinition = 'arn:aws:ecs:us-west-2:123456789012:task-definition/hello_world:8';
        expect(() => new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'a'.repeat(101),
            service,
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        })).toThrow('The ECS service associated with the deployment group must specify the task definition using the task definition family name only. Otherwise, the task definition cannot be updated in the stack');
    });
    test('can be created with explicit role', () => {
        const stack = new cdk.Stack();
        const serviceRole = new iam.Role(stack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('not-codedeploy.test'),
        });
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            role: serviceRole,
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'not-codedeploy.test',
                        },
                    }],
                Version: '2012-10-17',
            },
            ManagedPolicyArns: [
                {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::aws:policy/AWSCodeDeployRoleForECS',
                        ],
                    ],
                },
            ],
        });
    });
    test('can rollback on alarm', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            alarms: [
                new cloudwatch.Alarm(stack, 'BlueTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'blue/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
                new cloudwatch.Alarm(stack, 'GreenTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'green/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
            ],
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [
                    {
                        Name: {
                            Ref: 'BlueTGUnHealthyHostsE5A415E0',
                        },
                    },
                    {
                        Name: {
                            Ref: 'GreenTGUnHealthyHosts49873ED5',
                        },
                    },
                ],
                Enabled: true,
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_ALARM',
                ],
            },
        });
    });
    test('can add alarms after construction', () => {
        const stack = new cdk.Stack();
        const dg = new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            alarms: [
                new cloudwatch.Alarm(stack, 'BlueTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'blue/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
            ],
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        dg.addAlarm(new cloudwatch.Alarm(stack, 'GreenTGUnHealthyHosts', {
            metric: new cloudwatch.Metric({
                namespace: 'AWS/ApplicationELB',
                metricName: 'UnHealthyHostCount',
                dimensionsMap: {
                    TargetGroup: 'green/f7a80aba5edd5980',
                    LoadBalancer: 'app/myloadbalancer/lb-12345',
                },
            }),
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            threshold: 1,
            evaluationPeriods: 1,
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [
                    {
                        Name: {
                            Ref: 'BlueTGUnHealthyHostsE5A415E0',
                        },
                    },
                    {
                        Name: {
                            Ref: 'GreenTGUnHealthyHosts49873ED5',
                        },
                    },
                ],
                Enabled: true,
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_ALARM',
                ],
            },
        });
    });
    test('fail if alarm rollbacks are enabled, but no alarms provided', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            autoRollback: {
                deploymentInAlarm: true,
            },
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        expect(() => app.synth()).toThrow('The auto-rollback setting \'deploymentInAlarm\' does not have any effect unless you associate at least one CloudWatch alarm with the Deployment Group.');
    });
    test('can disable rollback when alarm polling fails', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            ignorePollAlarmsFailure: true,
            alarms: [
                new cloudwatch.Alarm(stack, 'BlueTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'blue/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
                new cloudwatch.Alarm(stack, 'GreenTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'green/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
            ],
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [
                    {
                        Name: {
                            Ref: 'BlueTGUnHealthyHostsE5A415E0',
                        },
                    },
                    {
                        Name: {
                            Ref: 'GreenTGUnHealthyHosts49873ED5',
                        },
                    },
                ],
                Enabled: true,
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_ALARM',
                ],
            },
        });
    });
    test('can disable rollback when deployment fails', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            autoRollback: {
                failedDeployment: false,
            },
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
            Type: 'AWS::CodeDeploy::DeploymentGroup',
            Properties: {
                ApplicationName: {
                    Ref: 'MyDGApplication57B1E402',
                },
                ServiceRoleArn: {
                    'Fn::GetAtt': [
                        'MyDGServiceRole5E94FD88',
                        'Arn',
                    ],
                },
                BlueGreenDeploymentConfiguration: {
                    DeploymentReadyOption: {
                        ActionOnTimeout: 'CONTINUE_DEPLOYMENT',
                        WaitTimeInMinutes: 0,
                    },
                    TerminateBlueInstancesOnDeploymentSuccess: {
                        Action: 'TERMINATE',
                        TerminationWaitTimeInMinutes: 0,
                    },
                },
                DeploymentConfigName: 'CodeDeployDefault.ECSAllAtOnce',
                DeploymentStyle: {
                    DeploymentOption: 'WITH_TRAFFIC_CONTROL',
                    DeploymentType: 'BLUE_GREEN',
                },
                ECSServices: [
                    {
                        ClusterName: 'my-cluster',
                        ServiceName: 'my-service',
                    },
                ],
                LoadBalancerInfo: {
                    TargetGroupPairInfoList: [
                        {
                            ProdTrafficRoute: {
                                ListenerArns: [
                                    'arn:aws:elasticloadbalancing:my-region:my-account:listener/app/myloadbalancer/lb-12345/prod',
                                ],
                            },
                            TargetGroups: [
                                {
                                    Name: 'blue',
                                },
                                {
                                    Name: 'green',
                                },
                            ],
                        },
                    ],
                },
            },
        });
    });
    test('can enable rollback when deployment stops', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            autoRollback: {
                stoppedDeployment: true,
            },
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                    'DEPLOYMENT_STOP_ON_REQUEST',
                ],
            },
        });
    });
    test('can disable rollback when alarm in failure state', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            autoRollback: {
                deploymentInAlarm: false,
            },
            alarms: [
                new cloudwatch.Alarm(stack, 'BlueTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'blue/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
                new cloudwatch.Alarm(stack, 'GreenTGUnHealthyHosts', {
                    metric: new cloudwatch.Metric({
                        namespace: 'AWS/ApplicationELB',
                        metricName: 'UnHealthyHostCount',
                        dimensionsMap: {
                            TargetGroup: 'green/f7a80aba5edd5980',
                            LoadBalancer: 'app/myloadbalancer/lb-12345',
                        },
                    }),
                    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                    threshold: 1,
                    evaluationPeriods: 1,
                }),
            ],
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Alarms: [
                    {
                        Name: {
                            Ref: 'BlueTGUnHealthyHostsE5A415E0',
                        },
                    },
                    {
                        Name: {
                            Ref: 'GreenTGUnHealthyHosts49873ED5',
                        },
                    },
                ],
                Enabled: true,
            },
            AutoRollbackConfiguration: {
                Enabled: true,
                Events: [
                    'DEPLOYMENT_FAILURE',
                ],
            },
        });
    });
    test('can specify a test traffic route', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
                testListener: mockListener(stack, 'test'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            LoadBalancerInfo: {
                TargetGroupPairInfoList: [
                    {
                        ProdTrafficRoute: {
                            ListenerArns: [
                                'arn:aws:elasticloadbalancing:my-region:my-account:listener/app/myloadbalancer/lb-12345/prod',
                            ],
                        },
                        TestTrafficRoute: {
                            ListenerArns: [
                                'arn:aws:elasticloadbalancing:my-region:my-account:listener/app/myloadbalancer/lb-12345/test',
                            ],
                        },
                        TargetGroups: [
                            {
                                Name: 'blue',
                            },
                            {
                                Name: 'green',
                            },
                        ],
                    },
                ],
            },
        });
    });
    test('can require manual deployment approval', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
                deploymentApprovalWaitTime: core_1.Duration.hours(8),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            BlueGreenDeploymentConfiguration: {
                DeploymentReadyOption: {
                    ActionOnTimeout: 'STOP_DEPLOYMENT',
                    WaitTimeInMinutes: 480,
                },
                TerminateBlueInstancesOnDeploymentSuccess: {
                    Action: 'TERMINATE',
                    TerminationWaitTimeInMinutes: 0,
                },
            },
        });
    });
    test('can add deployment bake time', () => {
        const stack = new cdk.Stack();
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
                terminationWaitTime: core_1.Duration.hours(1),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            BlueGreenDeploymentConfiguration: {
                DeploymentReadyOption: {
                    ActionOnTimeout: 'CONTINUE_DEPLOYMENT',
                    WaitTimeInMinutes: 0,
                },
                TerminateBlueInstancesOnDeploymentSuccess: {
                    Action: 'TERMINATE',
                    TerminationWaitTimeInMinutes: 60,
                },
            },
        });
    });
    test('uses the correct Service Principal in the us-isob-east-1 region', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'CodeDeployLambdaStack', {
            env: { region: 'us-isob-east-1' },
        });
        new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
            service: mockEcsService(stack),
            blueGreenDeploymentConfig: {
                blueTargetGroup: mockTargetGroup(stack, 'blue'),
                greenTargetGroup: mockTargetGroup(stack, 'green'),
                listener: mockListener(stack, 'prod'),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'codedeploy.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    describe('deploymentGroup from ARN in different account and region', () => {
        let stack;
        let application;
        let group;
        const account = '222222222222';
        const region = 'theregion-1';
        beforeEach(() => {
            stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'blabla-1' } });
            application = codedeploy.EcsApplication.fromEcsApplicationArn(stack, 'Application', `arn:aws:codedeploy:${region}:${account}:application:MyApplication`);
            group = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'Group', {
                application,
                deploymentGroupName: 'DeploymentGroup',
            });
        });
        test('knows its account and region', () => {
            // THEN
            expect(application.env).toEqual(expect.objectContaining({ account, region }));
            expect(group.env).toEqual(expect.objectContaining({ account, region }));
        });
        test('references the predefined DeploymentGroupConfig in the right region', () => {
            expect(group.deploymentConfig.deploymentConfigArn).toEqual(expect.stringContaining(`:codedeploy:${region}:${account}:deploymentconfig:CodeDeployDefault.ECSAllAtOnce`));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1ncm91cC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwbG95bWVudC1ncm91cC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHdDQUFnRDtBQUNoRCx3Q0FBd0M7QUFFeEMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQztBQUNqQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBRWpDLFNBQVMsY0FBYyxDQUFDLEtBQWdCO0lBQ3RDLE1BQU0sVUFBVSxHQUFHLGVBQWUsVUFBVSxJQUFJLFdBQVcsWUFBWSxXQUFXLElBQUksV0FBVyxFQUFFLENBQUM7SUFDcEcsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakYsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsRUFBVTtJQUNuRCxNQUFNLGNBQWMsR0FBRyxnQ0FBZ0MsVUFBVSxJQUFJLFdBQVcsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7SUFDdEgsT0FBTyxLQUFLLENBQUMsc0JBQXNCLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUN2RSxjQUFjO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWdCLEVBQUUsRUFBVTtJQUNoRCxNQUFNLFdBQVcsR0FBRyxnQ0FBZ0MsVUFBVSxJQUFJLFdBQVcseUNBQXlDLEVBQUUsRUFBRSxDQUFDO0lBQzNILE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMs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IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGVsYnYyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWRlcGxveSBmcm9tICcuLi8uLi9saWInO1xuXG5jb25zdCBtb2NrQ2x1c3RlciA9ICdteS1jbHVzdGVyJztcbmNvbnN0IG1vY2tTZXJ2aWNlID0gJ215LXNlcnZpY2UnO1xuY29uc3QgbW9ja1JlZ2lvbiA9ICdteS1yZWdpb24nO1xuY29uc3QgbW9ja0FjY291bnQgPSAnbXktYWNjb3VudCc7XG5cbmZ1bmN0aW9uIG1vY2tFY3NTZXJ2aWNlKHN0YWNrOiBjZGsuU3RhY2spOiBlY3MuSUJhc2VTZXJ2aWNlIHtcbiAgY29uc3Qgc2VydmljZUFybiA9IGBhcm46YXdzOmVjczoke21vY2tSZWdpb259OiR7bW9ja0FjY291bnR9OnNlcnZpY2UvJHttb2NrQ2x1c3Rlcn0vJHttb2NrU2VydmljZX1gO1xuICByZXR1cm4gZWNzLkJhc2VTZXJ2aWNlLmZyb21TZXJ2aWNlQXJuV2l0aENsdXN0ZXIoc3RhY2ssICdTZXJ2aWNlJywgc2VydmljZUFybik7XG59XG5cbmZ1bmN0aW9uIG1vY2tUYXJnZXRHcm91cChzdGFjazogY2RrLlN0YWNrLCBpZDogc3RyaW5nKTogZWxidjIuSVRhcmdldEdyb3VwIHtcbiAgY29uc3QgdGFyZ2V0R3JvdXBBcm4gPSBgYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzoke21vY2tSZWdpb259OiR7bW9ja0FjY291bnR9OnRhcmdldGdyb3VwLyR7aWR9L2Y3YTgwYWJhNWVkZDU5ODBgO1xuICByZXR1cm4gZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cC5mcm9tVGFyZ2V0R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCBpZCwge1xuICAgIHRhcmdldEdyb3VwQXJuLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gbW9ja0xpc3RlbmVyKHN0YWNrOiBjZGsuU3RhY2ssIGlkOiBzdHJpbmcpOiBlbGJ2Mi5JTGlzdGVuZXIge1xuICBjb25zdCBsaXN0ZW5lckFybiA9IGBhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOiR7bW9ja1JlZ2lvbn06JHttb2NrQWNjb3VudH06bGlzdGVuZXIvYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1LyR7aWR9YDtcbiAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdNeVNlY3VyaXR5R3JvdXAnICsgaWQsICdzZy0xMjM0NTY3OCcpO1xuICByZXR1cm4gZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lci5mcm9tQXBwbGljYXRpb25MaXN0ZW5lckF0dHJpYnV0ZXMoc3RhY2ssICdMaXN0ZW5lcicgKyBpZCwge1xuICAgIGxpc3RlbmVyQXJuLFxuICAgIHNlY3VyaXR5R3JvdXAsXG4gIH0pO1xufVxuXG5kZXNjcmliZSgnQ29kZURlcGxveSBFQ1MgRGVwbG95bWVudEdyb3VwJywgKCkgPT4ge1xuICBkZXNjcmliZSgnaW1wb3J0ZWQgd2l0aCBmcm9tRWNzRGVwbG95bWVudEdyb3VwQXR0cmlidXRlcycsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0cyB0aGUgRGVwbG95bWVudCBDb25maWcgdG8gQWxsQXRPbmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGVjc0FwcCA9IGNvZGVkZXBsb3kuRWNzQXBwbGljYXRpb24uZnJvbUVjc0FwcGxpY2F0aW9uTmFtZShzdGFjaywgJ0VBJywgJ0Vjc0FwcGxpY2F0aW9uJyk7XG4gICAgICBjb25zdCBpbXBvcnRlZEdyb3VwID0gY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAuZnJvbUVjc0RlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdFREcnLCB7XG4gICAgICAgIGFwcGxpY2F0aW9uOiBlY3NBcHAsXG4gICAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdFY3NEZXBsb3ltZW50R3JvdXAnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChpbXBvcnRlZEdyb3VwLmRlcGxveW1lbnRDb25maWcuZGVwbG95bWVudENvbmZpZ05hbWUpLnRvRXF1YWwoJ0NvZGVEZXBsb3lEZWZhdWx0LkVDU0FsbEF0T25jZScpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1jb2RlZGVwbG95OnJlbW92ZUFsYXJtc0Zyb21EZXBsb3ltZW50R3JvdXAnLCB0cnVlKTtcblxuICAgIG5ldyBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgVHlwZTogJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJyxcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgQXBwbGljYXRpb25OYW1lOiB7XG4gICAgICAgICAgUmVmOiAnTXlER0FwcGxpY2F0aW9uNTdCMUU0MDInLFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015REdTZXJ2aWNlUm9sZTVFOTRGRDg4JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEFsYXJtQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIEFsYXJtczogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIH0sXG4gICAgICAgIEF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICAgJ0RFUExPWU1FTlRfRkFJTFVSRScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgQmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBEZXBsb3ltZW50UmVhZHlPcHRpb246IHtcbiAgICAgICAgICAgIEFjdGlvbk9uVGltZW91dDogJ0NPTlRJTlVFX0RFUExPWU1FTlQnLFxuICAgICAgICAgICAgV2FpdFRpbWVJbk1pbnV0ZXM6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUZXJtaW5hdGVCbHVlSW5zdGFuY2VzT25EZXBsb3ltZW50U3VjY2Vzczoge1xuICAgICAgICAgICAgQWN0aW9uOiAnVEVSTUlOQVRFJyxcbiAgICAgICAgICAgIFRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRGVwbG95bWVudENvbmZpZ05hbWU6ICdDb2RlRGVwbG95RGVmYXVsdC5FQ1NBbGxBdE9uY2UnLFxuICAgICAgICBEZXBsb3ltZW50U3R5bGU6IHtcbiAgICAgICAgICBEZXBsb3ltZW50T3B0aW9uOiAnV0lUSF9UUkFGRklDX0NPTlRST0wnLFxuICAgICAgICAgIERlcGxveW1lbnRUeXBlOiAnQkxVRV9HUkVFTicsXG4gICAgICAgIH0sXG4gICAgICAgIEVDU1NlcnZpY2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2x1c3Rlck5hbWU6ICdteS1jbHVzdGVyJyxcbiAgICAgICAgICAgIFNlcnZpY2VOYW1lOiAnbXktc2VydmljZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgTG9hZEJhbGFuY2VySW5mbzoge1xuICAgICAgICAgIFRhcmdldEdyb3VwUGFpckluZm9MaXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFByb2RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgICBMaXN0ZW5lckFybnM6IFtcbiAgICAgICAgICAgICAgICAgICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOm15LXJlZ2lvbjpteS1hY2NvdW50Omxpc3RlbmVyL2FwcC9teWxvYWRiYWxhbmNlci9sYi0xMjM0NS9wcm9kJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBUYXJnZXRHcm91cHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBOYW1lOiAnYmx1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBOYW1lOiAnZ3JlZW4nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpDb2RlRGVwbG95OjpBcHBsaWNhdGlvbicsIHtcbiAgICAgIFR5cGU6ICdBV1M6OkNvZGVEZXBsb3k6OkFwcGxpY2F0aW9uJyxcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgQ29tcHV0ZVBsYXRmb3JtOiAnRUNTJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiB7XG4gICAgICAgICAgICAgICdGbjo6RmluZEluTWFwJzogW1xuICAgICAgICAgICAgICAgICdTZXJ2aWNlcHJpbmNpcGFsTWFwJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY29kZWRlcGxveScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L0FXU0NvZGVEZXBsb3lSb2xlRm9yRUNTJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggZXhwbGljaXQgbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ3Rlc3QnLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBEZXBsb3ltZW50R3JvdXBOYW1lOiAndGVzdCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggZXhwbGljaXQgYXBwbGljYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBjb2RlZGVwbG95LkVjc0FwcGxpY2F0aW9uLmZyb21FY3NBcHBsaWNhdGlvbk5hbWUoc3RhY2ssICdBJywgJ215YXBwJyk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBBcHBsaWNhdGlvbk5hbWU6ICdteWFwcCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggZXhwbGljaXQgZGVwbG95bWVudCBjb25maWcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGRlcGxveW1lbnRDb25maWc6IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudENvbmZpZy5DQU5BUllfMTBQRVJDRU5UXzE1TUlOVVRFUyxcbiAgICAgIHNlcnZpY2U6IG1vY2tFY3NTZXJ2aWNlKHN0YWNrKSxcbiAgICAgIGJsdWVHcmVlbkRlcGxveW1lbnRDb25maWc6IHtcbiAgICAgICAgYmx1ZVRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdibHVlJyksXG4gICAgICAgIGdyZWVuVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2dyZWVuJyksXG4gICAgICAgIGxpc3RlbmVyOiBtb2NrTGlzdGVuZXIoc3RhY2ssICdwcm9kJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgRGVwbG95bWVudENvbmZpZ05hbWU6ICdDb2RlRGVwbG95RGVmYXVsdC5FQ1NDYW5hcnkxMFBlcmNlbnQxNU1pbnV0ZXMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIHdpdGggbW9yZSB0aGFuIDEwMCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ2EnLnJlcGVhdCgxMDEpLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coYERlcGxveW1lbnQgZ3JvdXAgbmFtZTogXCIkeydhJy5yZXBlYXQoMTAxKX1cIiBjYW4gYmUgYSBtYXggb2YgMTAwIGNoYXJhY3RlcnMuYCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWwgd2l0aCB1bmFsbG93ZWQgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdteSBuYW1lJyxcbiAgICAgIHNlcnZpY2U6IG1vY2tFY3NTZXJ2aWNlKHN0YWNrKSxcbiAgICAgIGJsdWVHcmVlbkRlcGxveW1lbnRDb25maWc6IHtcbiAgICAgICAgYmx1ZVRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdibHVlJyksXG4gICAgICAgIGdyZWVuVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2dyZWVuJyksXG4gICAgICAgIGxpc3RlbmVyOiBtb2NrTGlzdGVuZXIoc3RhY2ssICdwcm9kJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KCdEZXBsb3ltZW50IGdyb3VwIG5hbWU6IFwibXkgbmFtZVwiIGNhbiBvbmx5IGNvbnRhaW4gbGV0dGVycyAoYS16LCBBLVopLCBudW1iZXJzICgwLTkpLCBwZXJpb2RzICguKSwgdW5kZXJzY29yZXMgKF8pLCArIChwbHVzIHNpZ25zKSwgPSAoZXF1YWxzIHNpZ25zKSwgLCAoY29tbWFzKSwgQCAoYXQgc2lnbnMpLCAtIChtaW51cyBzaWducykuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWwgd2hlbiBFQ1Mgc2VydmljZSBkb2VzIG5vdCB1c2UgQ09ERV9ERVBMT1kgZGVwbG95bWVudCBjb250cm9sbGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgZGVwbG95bWVudENvbnRyb2xsZXI6IHtcbiAgICAgICAgdHlwZTogZWNzLkRlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiAnYScucmVwZWF0KDEwMSksXG4gICAgICBzZXJ2aWNlLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coJ1RoZSBFQ1Mgc2VydmljZSBhc3NvY2lhdGVkIHdpdGggdGhlIGRlcGxveW1lbnQgZ3JvdXAgbXVzdCB1c2UgdGhlIENPREVfREVQTE9ZIGRlcGxveW1lbnQgY29udHJvbGxlciB0eXBlJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWwgd2hlbiBFQ1Mgc2VydmljZSB1c2VzIENPREVfREVQTE9ZIGRlcGxveW1lbnQgY29udHJvbGxlciwgYnV0IGRpZCBub3Qgc3RyaXAgdGhlIHJldmlzaW9uIElEIGZyb20gdGhlIHRhc2sgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcblxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgIHR5cGU6IGVjcy5EZXBsb3ltZW50Q29udHJvbGxlclR5cGUuQ09ERV9ERVBMT1ksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIChzZXJ2aWNlLm5vZGUuZGVmYXVsdENoaWxkIGFzIGVjcy5DZm5TZXJ2aWNlKS50YXNrRGVmaW5pdGlvbiA9ICdhcm46YXdzOmVjczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnRhc2stZGVmaW5pdGlvbi9oZWxsb193b3JsZDo4JztcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ2EnLnJlcGVhdCgxMDEpLFxuICAgICAgc2VydmljZSxcbiAgICAgIGJsdWVHcmVlbkRlcGxveW1lbnRDb25maWc6IHtcbiAgICAgICAgYmx1ZVRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdibHVlJyksXG4gICAgICAgIGdyZWVuVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2dyZWVuJyksXG4gICAgICAgIGxpc3RlbmVyOiBtb2NrTGlzdGVuZXIoc3RhY2ssICdwcm9kJyksXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KCdUaGUgRUNTIHNlcnZpY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBkZXBsb3ltZW50IGdyb3VwIG11c3Qgc3BlY2lmeSB0aGUgdGFzayBkZWZpbml0aW9uIHVzaW5nIHRoZSB0YXNrIGRlZmluaXRpb24gZmFtaWx5IG5hbWUgb25seS4gT3RoZXJ3aXNlLCB0aGUgdGFzayBkZWZpbml0aW9uIGNhbm5vdCBiZSB1cGRhdGVkIGluIHRoZSBzdGFjaycpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCB3aXRoIGV4cGxpY2l0IHJvbGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc2VydmljZVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbm90LWNvZGVkZXBsb3kudGVzdCcpLFxuICAgIH0pO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIHJvbGU6IHNlcnZpY2VSb2xlLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnbm90LWNvZGVkZXBsb3kudGVzdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQVdTQ29kZURlcGxveVJvbGVGb3JFQ1MnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHJvbGxiYWNrIG9uIGFsYXJtJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBhbGFybXM6IFtcbiAgICAgICAgbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdCbHVlVEdVbkhlYWx0aHlIb3N0cycsIHtcbiAgICAgICAgICBtZXRyaWM6IG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgICAgICAgbWV0cmljTmFtZTogJ1VuSGVhbHRoeUhvc3RDb3VudCcsXG4gICAgICAgICAgICBkaW1lbnNpb25zTWFwOiB7XG4gICAgICAgICAgICAgIFRhcmdldEdyb3VwOiAnYmx1ZS9mN2E4MGFiYTVlZGQ1OTgwJyxcbiAgICAgICAgICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBjbG91ZHdhdGNoLkFsYXJtKHN0YWNrLCAnR3JlZW5UR1VuSGVhbHRoeUhvc3RzJywge1xuICAgICAgICAgIG1ldHJpYzogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICAgICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNNYXA6IHtcbiAgICAgICAgICAgICAgVGFyZ2V0R3JvdXA6ICdncmVlbi9mN2E4MGFiYTVlZGQ1OTgwJyxcbiAgICAgICAgICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBBbGFybUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgQWxhcm1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICBSZWY6ICdCbHVlVEdVbkhlYWx0aHlIb3N0c0U1QTQxNUUwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0dyZWVuVEdVbkhlYWx0aHlIb3N0czQ5ODczRUQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICdERVBMT1lNRU5UX0ZBSUxVUkUnLFxuICAgICAgICAgICdERVBMT1lNRU5UX1NUT1BfT05fQUxBUk0nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBhbGFybXMgYWZ0ZXIgY29uc3RydWN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGRnID0gbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFsYXJtczogW1xuICAgICAgICBuZXcgY2xvdWR3YXRjaC5BbGFybShzdGFjaywgJ0JsdWVUR1VuSGVhbHRoeUhvc3RzJywge1xuICAgICAgICAgIG1ldHJpYzogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICAgICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNNYXA6IHtcbiAgICAgICAgICAgICAgVGFyZ2V0R3JvdXA6ICdibHVlL2Y3YTgwYWJhNWVkZDU5ODAnLFxuICAgICAgICAgICAgICBMb2FkQmFsYW5jZXI6ICdhcHAvbXlsb2FkYmFsYW5jZXIvbGItMTIzNDUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb21wYXJpc29uT3BlcmF0b3I6IGNsb3Vkd2F0Y2guQ29tcGFyaXNvbk9wZXJhdG9yLkdSRUFURVJfVEhBTl9USFJFU0hPTEQsXG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGRnLmFkZEFsYXJtKG5ldyBjbG91ZHdhdGNoLkFsYXJtKHN0YWNrLCAnR3JlZW5UR1VuSGVhbHRoeUhvc3RzJywge1xuICAgICAgbWV0cmljOiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgICAgZGltZW5zaW9uc01hcDoge1xuICAgICAgICAgIFRhcmdldEdyb3VwOiAnZ3JlZW4vZjdhODBhYmE1ZWRkNTk4MCcsXG4gICAgICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1JyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgQWxhcm1Db25maWd1cmF0aW9uOiB7XG4gICAgICAgIEFsYXJtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgUmVmOiAnQmx1ZVRHVW5IZWFsdGh5SG9zdHNFNUE0MTVFMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICBSZWY6ICdHcmVlblRHVW5IZWFsdGh5SG9zdHM0OTg3M0VENScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgQXV0b1JvbGxiYWNrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICBFdmVudHM6IFtcbiAgICAgICAgICAnREVQTE9ZTUVOVF9GQUlMVVJFJyxcbiAgICAgICAgICAnREVQTE9ZTUVOVF9TVE9QX09OX0FMQVJNJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWwgaWYgYWxhcm0gcm9sbGJhY2tzIGFyZSBlbmFibGVkLCBidXQgbm8gYWxhcm1zIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBkZXBsb3ltZW50SW5BbGFybTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygnVGhlIGF1dG8tcm9sbGJhY2sgc2V0dGluZyBcXCdkZXBsb3ltZW50SW5BbGFybVxcJyBkb2VzIG5vdCBoYXZlIGFueSBlZmZlY3QgdW5sZXNzIHlvdSBhc3NvY2lhdGUgYXQgbGVhc3Qgb25lIENsb3VkV2F0Y2ggYWxhcm0gd2l0aCB0aGUgRGVwbG95bWVudCBHcm91cC4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRpc2FibGUgcm9sbGJhY2sgd2hlbiBhbGFybSBwb2xsaW5nIGZhaWxzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBpZ25vcmVQb2xsQWxhcm1zRmFpbHVyZTogdHJ1ZSxcbiAgICAgIGFsYXJtczogW1xuICAgICAgICBuZXcgY2xvdWR3YXRjaC5BbGFybShzdGFjaywgJ0JsdWVUR1VuSGVhbHRoeUhvc3RzJywge1xuICAgICAgICAgIG1ldHJpYzogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICAgICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNNYXA6IHtcbiAgICAgICAgICAgICAgVGFyZ2V0R3JvdXA6ICdibHVlL2Y3YTgwYWJhNWVkZDU5ODAnLFxuICAgICAgICAgICAgICBMb2FkQmFsYW5jZXI6ICdhcHAvbXlsb2FkYmFsYW5jZXIvbGItMTIzNDUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb21wYXJpc29uT3BlcmF0b3I6IGNsb3Vkd2F0Y2guQ29tcGFyaXNvbk9wZXJhdG9yLkdSRUFURVJfVEhBTl9USFJFU0hPTEQsXG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdHcmVlblRHVW5IZWFsdGh5SG9zdHMnLCB7XG4gICAgICAgICAgbWV0cmljOiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgICAgICAgIG1ldHJpY05hbWU6ICdVbkhlYWx0aHlIb3N0Q291bnQnLFxuICAgICAgICAgICAgZGltZW5zaW9uc01hcDoge1xuICAgICAgICAgICAgICBUYXJnZXRHcm91cDogJ2dyZWVuL2Y3YTgwYWJhNWVkZDU5ODAnLFxuICAgICAgICAgICAgICBMb2FkQmFsYW5jZXI6ICdhcHAvbXlsb2FkYmFsYW5jZXIvbGItMTIzNDUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb21wYXJpc29uT3BlcmF0b3I6IGNsb3Vkd2F0Y2guQ29tcGFyaXNvbk9wZXJhdG9yLkdSRUFURVJfVEhBTl9USFJFU0hPTEQsXG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEFsYXJtQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBBbGFybXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0JsdWVUR1VuSGVhbHRoeUhvc3RzRTVBNDE1RTAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgUmVmOiAnR3JlZW5UR1VuSGVhbHRoeUhvc3RzNDk4NzNFRDUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIEF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgRXZlbnRzOiBbXG4gICAgICAgICAgJ0RFUExPWU1FTlRfRkFJTFVSRScsXG4gICAgICAgICAgJ0RFUExPWU1FTlRfU1RPUF9PTl9BTEFSTScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZGlzYWJsZSByb2xsYmFjayB3aGVuIGRlcGxveW1lbnQgZmFpbHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBmYWlsZWREZXBsb3ltZW50OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgVHlwZTogJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJyxcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgQXBwbGljYXRpb25OYW1lOiB7XG4gICAgICAgICAgUmVmOiAnTXlER0FwcGxpY2F0aW9uNTdCMUU0MDInLFxuICAgICAgICB9LFxuICAgICAgICBTZXJ2aWNlUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015REdTZXJ2aWNlUm9sZTVFOTRGRDg4JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEJsdWVHcmVlbkRlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgRGVwbG95bWVudFJlYWR5T3B0aW9uOiB7XG4gICAgICAgICAgICBBY3Rpb25PblRpbWVvdXQ6ICdDT05USU5VRV9ERVBMT1lNRU5UJyxcbiAgICAgICAgICAgIFdhaXRUaW1lSW5NaW51dGVzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVGVybWluYXRlQmx1ZUluc3RhbmNlc09uRGVwbG95bWVudFN1Y2Nlc3M6IHtcbiAgICAgICAgICAgIEFjdGlvbjogJ1RFUk1JTkFURScsXG4gICAgICAgICAgICBUZXJtaW5hdGlvbldhaXRUaW1lSW5NaW51dGVzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIERlcGxveW1lbnRDb25maWdOYW1lOiAnQ29kZURlcGxveURlZmF1bHQuRUNTQWxsQXRPbmNlJyxcbiAgICAgICAgRGVwbG95bWVudFN0eWxlOiB7XG4gICAgICAgICAgRGVwbG95bWVudE9wdGlvbjogJ1dJVEhfVFJBRkZJQ19DT05UUk9MJyxcbiAgICAgICAgICBEZXBsb3ltZW50VHlwZTogJ0JMVUVfR1JFRU4nLFxuICAgICAgICB9LFxuICAgICAgICBFQ1NTZXJ2aWNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENsdXN0ZXJOYW1lOiAnbXktY2x1c3RlcicsXG4gICAgICAgICAgICBTZXJ2aWNlTmFtZTogJ215LXNlcnZpY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIExvYWRCYWxhbmNlckluZm86IHtcbiAgICAgICAgICBUYXJnZXRHcm91cFBhaXJJbmZvTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBQcm9kVHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgICAgTGlzdGVuZXJBcm5zOiBbXG4gICAgICAgICAgICAgICAgICAnYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzpteS1yZWdpb246bXktYWNjb3VudDpsaXN0ZW5lci9hcHAvbXlsb2FkYmFsYW5jZXIvbGItMTIzNDUvcHJvZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgVGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgTmFtZTogJ2JsdWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgTmFtZTogJ2dyZWVuJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGVuYWJsZSByb2xsYmFjayB3aGVuIGRlcGxveW1lbnQgc3RvcHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBzdG9wcGVkRGVwbG95bWVudDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEF1dG9Sb2xsYmFja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgRXZlbnRzOiBbXG4gICAgICAgICAgJ0RFUExPWU1FTlRfRkFJTFVSRScsXG4gICAgICAgICAgJ0RFUExPWU1FTlRfU1RPUF9PTl9SRVFVRVNUJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIHJvbGxiYWNrIHdoZW4gYWxhcm0gaW4gZmFpbHVyZSBzdGF0ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgYXV0b1JvbGxiYWNrOiB7XG4gICAgICAgIGRlcGxveW1lbnRJbkFsYXJtOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhbGFybXM6IFtcbiAgICAgICAgbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdCbHVlVEdVbkhlYWx0aHlIb3N0cycsIHtcbiAgICAgICAgICBtZXRyaWM6IG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgICAgICAgbWV0cmljTmFtZTogJ1VuSGVhbHRoeUhvc3RDb3VudCcsXG4gICAgICAgICAgICBkaW1lbnNpb25zTWFwOiB7XG4gICAgICAgICAgICAgIFRhcmdldEdyb3VwOiAnYmx1ZS9mN2E4MGFiYTVlZGQ1OTgwJyxcbiAgICAgICAgICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBjbG91ZHdhdGNoLkFsYXJtKHN0YWNrLCAnR3JlZW5UR1VuSGVhbHRoeUhvc3RzJywge1xuICAgICAgICAgIG1ldHJpYzogbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICAgICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgICAgICAgIGRpbWVuc2lvbnNNYXA6IHtcbiAgICAgICAgICAgICAgVGFyZ2V0R3JvdXA6ICdncmVlbi9mN2E4MGFiYTVlZGQ1OTgwJyxcbiAgICAgICAgICAgICAgTG9hZEJhbGFuY2VyOiAnYXBwL215bG9hZGJhbGFuY2VyL2xiLTEyMzQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBBbGFybUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgQWxhcm1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZToge1xuICAgICAgICAgICAgICBSZWY6ICdCbHVlVEdVbkhlYWx0aHlIb3N0c0U1QTQxNUUwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0dyZWVuVEdVbkhlYWx0aHlIb3N0czQ5ODczRUQ1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICdERVBMT1lNRU5UX0ZBSUxVUkUnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgYSB0ZXN0IHRyYWZmaWMgcm91dGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIHNlcnZpY2U6IG1vY2tFY3NTZXJ2aWNlKHN0YWNrKSxcbiAgICAgIGJsdWVHcmVlbkRlcGxveW1lbnRDb25maWc6IHtcbiAgICAgICAgYmx1ZVRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdibHVlJyksXG4gICAgICAgIGdyZWVuVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2dyZWVuJyksXG4gICAgICAgIGxpc3RlbmVyOiBtb2NrTGlzdGVuZXIoc3RhY2ssICdwcm9kJyksXG4gICAgICAgIHRlc3RMaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAndGVzdCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIExvYWRCYWxhbmNlckluZm86IHtcbiAgICAgICAgVGFyZ2V0R3JvdXBQYWlySW5mb0xpc3Q6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBQcm9kVHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIExpc3RlbmVyQXJuczogW1xuICAgICAgICAgICAgICAgICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOm15LXJlZ2lvbjpteS1hY2NvdW50Omxpc3RlbmVyL2FwcC9teWxvYWRiYWxhbmNlci9sYi0xMjM0NS9wcm9kJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUZXN0VHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgIExpc3RlbmVyQXJuczogW1xuICAgICAgICAgICAgICAgICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOm15LXJlZ2lvbjpteS1hY2NvdW50Omxpc3RlbmVyL2FwcC9teWxvYWRiYWxhbmNlci9sYi0xMjM0NS90ZXN0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUYXJnZXRHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdibHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdncmVlbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcmVxdWlyZSBtYW51YWwgZGVwbG95bWVudCBhcHByb3ZhbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgICAgZGVwbG95bWVudEFwcHJvdmFsV2FpdFRpbWU6IER1cmF0aW9uLmhvdXJzKDgpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIEJsdWVHcmVlbkRlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIERlcGxveW1lbnRSZWFkeU9wdGlvbjoge1xuICAgICAgICAgIEFjdGlvbk9uVGltZW91dDogJ1NUT1BfREVQTE9ZTUVOVCcsXG4gICAgICAgICAgV2FpdFRpbWVJbk1pbnV0ZXM6IDQ4MCxcbiAgICAgICAgfSxcbiAgICAgICAgVGVybWluYXRlQmx1ZUluc3RhbmNlc09uRGVwbG95bWVudFN1Y2Nlc3M6IHtcbiAgICAgICAgICBBY3Rpb246ICdURVJNSU5BVEUnLFxuICAgICAgICAgIFRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM6IDAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIGRlcGxveW1lbnQgYmFrZSB0aW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBjb2RlZGVwbG95LkVjc0RlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgICBzZXJ2aWNlOiBtb2NrRWNzU2VydmljZShzdGFjayksXG4gICAgICBibHVlR3JlZW5EZXBsb3ltZW50Q29uZmlnOiB7XG4gICAgICAgIGJsdWVUYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnYmx1ZScpLFxuICAgICAgICBncmVlblRhcmdldEdyb3VwOiBtb2NrVGFyZ2V0R3JvdXAoc3RhY2ssICdncmVlbicpLFxuICAgICAgICBsaXN0ZW5lcjogbW9ja0xpc3RlbmVyKHN0YWNrLCAncHJvZCcpLFxuICAgICAgICB0ZXJtaW5hdGlvbldhaXRUaW1lOiBEdXJhdGlvbi5ob3VycygxKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBCbHVlR3JlZW5EZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBEZXBsb3ltZW50UmVhZHlPcHRpb246IHtcbiAgICAgICAgICBBY3Rpb25PblRpbWVvdXQ6ICdDT05USU5VRV9ERVBMT1lNRU5UJyxcbiAgICAgICAgICBXYWl0VGltZUluTWludXRlczogMCxcbiAgICAgICAgfSxcbiAgICAgICAgVGVybWluYXRlQmx1ZUluc3RhbmNlc09uRGVwbG95bWVudFN1Y2Nlc3M6IHtcbiAgICAgICAgICBBY3Rpb246ICdURVJNSU5BVEUnLFxuICAgICAgICAgIFRlcm1pbmF0aW9uV2FpdFRpbWVJbk1pbnV0ZXM6IDYwLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcyB0aGUgY29ycmVjdCBTZXJ2aWNlIFByaW5jaXBhbCBpbiB0aGUgdXMtaXNvYi1lYXN0LTEgcmVnaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0NvZGVEZXBsb3lMYW1iZGFTdGFjaycsIHtcbiAgICAgIGVudjogeyByZWdpb246ICd1cy1pc29iLWVhc3QtMScgfSxcbiAgICB9KTtcbiAgICBuZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuICAgICAgc2VydmljZTogbW9ja0Vjc1NlcnZpY2Uoc3RhY2spLFxuICAgICAgYmx1ZUdyZWVuRGVwbG95bWVudENvbmZpZzoge1xuICAgICAgICBibHVlVGFyZ2V0R3JvdXA6IG1vY2tUYXJnZXRHcm91cChzdGFjaywgJ2JsdWUnKSxcbiAgICAgICAgZ3JlZW5UYXJnZXRHcm91cDogbW9ja1RhcmdldEdyb3VwKHN0YWNrLCAnZ3JlZW4nKSxcbiAgICAgICAgbGlzdGVuZXI6IG1vY2tMaXN0ZW5lcihzdGFjaywgJ3Byb2QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdjb2RlZGVwbG95LmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVwbG95bWVudEdyb3VwIGZyb20gQVJOIGluIGRpZmZlcmVudCBhY2NvdW50IGFuZCByZWdpb24nLCAoKSA9PiB7XG4gICAgbGV0IHN0YWNrOiBTdGFjaztcbiAgICBsZXQgYXBwbGljYXRpb246IGNvZGVkZXBsb3kuSUVjc0FwcGxpY2F0aW9uO1xuICAgIGxldCBncm91cDogY29kZWRlcGxveS5JRWNzRGVwbG95bWVudEdyb3VwO1xuXG4gICAgY29uc3QgYWNjb3VudCA9ICcyMjIyMjIyMjIyMjInO1xuICAgIGNvbnN0IHJlZ2lvbiA9ICd0aGVyZWdpb24tMSc7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnLCByZWdpb246ICdibGFibGEtMScgfSB9KTtcblxuICAgICAgYXBwbGljYXRpb24gPSBjb2RlZGVwbG95LkVjc0FwcGxpY2F0aW9uLmZyb21FY3NBcHBsaWNhdGlvbkFybihzdGFjaywgJ0FwcGxpY2F0aW9uJywgYGFybjphd3M6Y29kZWRlcGxveToke3JlZ2lvbn06JHthY2NvdW50fTphcHBsaWNhdGlvbjpNeUFwcGxpY2F0aW9uYCk7XG4gICAgICBncm91cCA9IGNvZGVkZXBsb3kuRWNzRGVwbG95bWVudEdyb3VwLmZyb21FY3NEZXBsb3ltZW50R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnR3JvdXAnLCB7XG4gICAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiAnRGVwbG95bWVudEdyb3VwJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgna25vd3MgaXRzIGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChhcHBsaWNhdGlvbi5lbnYpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBhY2NvdW50LCByZWdpb24gfSkpO1xuICAgICAgZXhwZWN0KGdyb3VwLmVudikudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGFjY291bnQsIHJlZ2lvbiB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZWZlcmVuY2VzIHRoZSBwcmVkZWZpbmVkIERlcGxveW1lbnRHcm91cENvbmZpZyBpbiB0aGUgcmlnaHQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdyb3VwLmRlcGxveW1lbnRDb25maWcuZGVwbG95bWVudENvbmZpZ0FybikudG9FcXVhbChleHBlY3Quc3RyaW5nQ29udGFpbmluZyhcbiAgICAgICAgYDpjb2RlZGVwbG95OiR7cmVnaW9ufToke2FjY291bnR9OmRlcGxveW1lbnRjb25maWc6Q29kZURlcGxveURlZmF1bHQuRUNTQWxsQXRPbmNlYCxcbiAgICAgICkpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19