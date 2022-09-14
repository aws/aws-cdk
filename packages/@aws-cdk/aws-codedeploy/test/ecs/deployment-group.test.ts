import { Template, Match } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, CfnTargetGroup, TargetType } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as codedeploy from '../../lib';

function stubService(stack: cdk.Stack) {
  const vpc = new ec2.Vpc(stack, 'MyVpc');
  const cluster = new ecs.Cluster(stack, 'MyCluster', {
    vpc,
  });
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'MyTaskDef', {
    cpu: 256,
    memoryLimitMiB: 512,
    family: 'myfamily',
  });
  taskDefinition.addContainer('MyContainer', {
    image: ecs.ContainerImage.fromRegistry('nginx'),
    portMappings: [{
      containerPort: 80,
    }],
  });
  const service = new ecs.FargateService(stack, 'MyService', {
    cluster,
    taskDefinition,
  });
  const targetGroup = new ApplicationTargetGroup(stack, 'SvcTargetGroup', {
    vpc,
    protocol: ApplicationProtocol.HTTP,
    targetType: TargetType.IP,
  });
  const loadBalancer = new ApplicationLoadBalancer(stack, 'SvcALB', {
    vpc,
  });
  loadBalancer.addListener('SvcListener', {
    defaultTargetGroups: [targetGroup],
    port: 80,
  });
  service.attachToApplicationTargetGroup(targetGroup);
  return service;
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

      expect(importedGroup.deploymentConfig).toEqual(codedeploy.EcsDeploymentConfig.ALL_AT_ONCE);
    });
  });

  test('service is updated', () => {
    const stack = new cdk.Stack();

    const service = stubService(stack);
    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      application,
      services: [service],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentController: {
        Type: 'CODE_DEPLOY',
      },
      TaskDefinition: 'myfamily',
    });
  });

  test('can set deploymentReadyOption', () => {
    const stack = new cdk.Stack();

    const service = stubService(stack);
    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      application,
      services: [service],
      blueGreenDeploymentConfiguration: {
        waitTimeForContinueDeployment: Duration.minutes(10),
        waitTimeForTermination: codedeploy.EcsBlueGreenDeploymentConfig.DurationInfinity,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      BlueGreenDeploymentConfiguration: {
        DeploymentReadyOption: {
          ActionOnTimeout: 'STOP_DEPLOYMENT',
          WaitTimeInMinutes: 10,
        },
        TerminateBlueInstancesOnDeploymentSuccess: {
          Action: 'KEEP_ALIVE',
        },
      },
    });
  });

  test('can be created by explicitly passing an Application', () => {
    const stack = new cdk.Stack();

    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    const service = stubService(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      application,
      services: [service],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ApplicationName: {
        Ref: 'MyApp3CE31C26',
      },
      ECSServices: [{
        ClusterName: stack.resolve(service.cluster.clusterName),
        ServiceName: stack.resolve(service.serviceName),
      }],
      DeploymentStyle: {
        DeploymentOption: 'WITHOUT_TRAFFIC_CONTROL',
        DeploymentType: 'IN_PLACE',
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
        },
        TerminateBlueInstancesOnDeploymentSuccess: {
          Action: 'TERMINATE',
          TerminationWaitTimeInMinutes: 0,
        },
      },
      DeploymentConfigName: 'CodeDeployDefault.ECSAllAtOnce',
    });
  });

  test('can be imported', () => {
    const stack = new cdk.Stack();

    const application = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'MyApp', 'MyApp');
    const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'MyDG', {
      application,
      deploymentGroupName: 'MyDG',
    });

    expect(deploymentGroup).not.toEqual(undefined);
  });

  test('can have alarms added to it after being created', () => {
    const stack = new cdk.Stack();

    const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
      metric: new cloudwatch.Metric({
        metricName: 'Errors',
        namespace: 'my.namespace',
      }),
      threshold: 1,
      evaluationPeriods: 1,
    });

    const deploymentGroup = new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [stubService(stack)],
    });
    deploymentGroup.addAlarm(alarm);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      AlarmConfiguration: {
        Alarms: [
          {
            Name: {
              Ref: 'Alarm1F9009D71',
            },
          },
        ],
        Enabled: true,
      },
    });
  });

  test('only automatically rolls back failed deployments by default', () => {
    const stack = new cdk.Stack();

    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [stubService(stack)],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: [
          'DEPLOYMENT_FAILURE',
        ],
      },
    });
  });

  test('rolls back alarmed deployments if at least one alarm has been added', () => {
    const stack = new cdk.Stack();

    const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
      metric: new cloudwatch.Metric({
        metricName: 'Errors',
        namespace: 'my.namespace',
      }),
      threshold: 1,
      evaluationPeriods: 1,
    });

    const deploymentGroup = new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [stubService(stack)],
      autoRollback: {
        failedDeployment: false,
      },
    });
    deploymentGroup.addAlarm(alarm);

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: [
          'DEPLOYMENT_STOP_ON_ALARM',
        ],
      },
    });
  });

  test('setting to roll back on alarms without providing any results in an exception', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [stubService(stack)],
      autoRollback: {
        deploymentInAlarm: true,
      },
    });

    expect(() => app.synth()).toThrow(/deploymentInAlarm/);
  });

  test('setting traffic shifting', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    const service = stubService(stack);
    const targetGroup = new ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc: service.cluster.vpc,
      protocol: ApplicationProtocol.HTTP,
      targetType: TargetType.IP,
    });
    const testTargetGroup = new ApplicationTargetGroup(stack, 'TestTargetGroup', {
      vpc: service.cluster.vpc,
      protocol: ApplicationProtocol.HTTP,
      targetType: TargetType.IP,
    });
    const loadBalancer = new ApplicationLoadBalancer(stack, 'ALB', {
      vpc: service.cluster.vpc,
    });
    const listener = loadBalancer.addListener('Listener', {
      defaultTargetGroups: [targetGroup],
      port: 80,
    });
    const testListener = loadBalancer.addListener('TestListener', {
      defaultTargetGroups: [testTargetGroup],
      protocol: ApplicationProtocol.HTTP,
      port: 81,
    });
    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [service],
      prodTrafficRoute: {
        listener,
        targetGroup,
      },
      testTrafficRoute: {
        targetGroup: testTargetGroup,
        listener: testListener,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
      LoadBalancerInfo: {
        TargetGroupPairInfoList: [{
          TargetGroups: [{
            Name: stack.resolve(targetGroup.targetGroupName),
          }, {
            Name: stack.resolve(testTargetGroup.targetGroupName),
          }],
          ProdTrafficRoute: {
            ListenerArns: [
              stack.resolve(listener.listenerArn),
            ],
          },
          TestTrafficRoute: {
            ListenerArns: [
              stack.resolve(testListener.listenerArn),
            ],
          },
        }],
      },
    });
  });

  test('setting traffic shifting with auto-creation test target group', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    const service = stubService(stack);
    const targetGroup = new ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc: service.cluster.vpc,
      protocol: ApplicationProtocol.HTTP,
      targetType: TargetType.IP,
    });
    const loadBalancer = new ApplicationLoadBalancer(stack, 'ALB', {
      vpc: service.cluster.vpc,
    });
    const listener = loadBalancer.addListener('Listener', {
      defaultTargetGroups: [targetGroup],
      port: 80,
    });
    const dg = new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      services: [service],
      prodTrafficRoute: {
        listener,
        targetGroup,
      },
    });

    const testTargetGroup = dg.node.findChild('TestTargetGroup') as CfnTargetGroup;
    expect(testTargetGroup).toBeTruthy();

    const template = Template.fromStack(stack);
    template.resourcePropertiesCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 80,
      Protocol: 'HTTP',
      TargetType: 'ip',
    }, 3);

    template.hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
      LoadBalancerInfo: {
        TargetGroupPairInfoList: [{
          TargetGroups: [{
            Name: stack.resolve(targetGroup.targetGroupName),
          }, {
            Name: Match.anyValue(),
          }],
          ProdTrafficRoute: {
            ListenerArns: [
              stack.resolve(listener.listenerArn),
            ],
          },
        }],
      },
    });

  });

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      services: [stubService(stack)],
      deploymentGroupName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Deployment group name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      services: [stubService(stack)],
      deploymentGroupName: 'my name',
    });

    expect(() => app.synth()).toThrow('Deployment group name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });

});
