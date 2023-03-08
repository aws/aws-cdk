import { Match, Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Duration, Stack } from '@aws-cdk/core';
import * as codedeploy from '../../lib';

const mockCluster = 'my-cluster';
const mockService = 'my-service';
const mockRegion = 'my-region';
const mockAccount = 'my-account';

function mockEcsService(stack: cdk.Stack): ecs.IBaseService {
  const serviceArn = `arn:aws:ecs:${mockRegion}:${mockAccount}:service/${mockCluster}/${mockService}`;
  return ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);
}

function mockTargetGroup(stack: cdk.Stack, id: string): elbv2.ITargetGroup {
  const targetGroupArn = `arn:aws:elasticloadbalancing:${mockRegion}:${mockAccount}:targetgroup/${id}/f7a80aba5edd5980`;
  return elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, id, {
    targetGroupArn,
  });
}

function mockListener(stack: cdk.Stack, id: string): elbv2.IListener {
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

    Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
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
          Alarms: Match.absent(),
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

    Template.fromStack(stack).hasResource('AWS::CodeDeploy::Application', {
      Type: 'AWS::CodeDeploy::Application',
      Properties: {
        ComputePlatform: 'ECS',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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
    (service.node.defaultChild as ecs.CfnService).taskDefinition = 'arn:aws:ecs:us-west-2:123456789012:task-definition/hello_world:8';

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

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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
        deploymentApprovalWaitTime: Duration.hours(8),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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
        terminationWaitTime: Duration.hours(1),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    let stack: Stack;
    let application: codedeploy.IEcsApplication;
    let group: codedeploy.IEcsDeploymentGroup;

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
      expect(group.deploymentConfig.deploymentConfigArn).toEqual(expect.stringContaining(
        `:codedeploy:${region}:${account}:deploymentconfig:CodeDeployDefault.ECSAllAtOnce`,
      ));
    });
  });
});
