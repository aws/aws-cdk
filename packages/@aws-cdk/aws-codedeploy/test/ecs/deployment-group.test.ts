import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, IApplicationTargetGroup, TargetType } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as codedeploy from '../../lib';
import { EcsDeploymentGroupProps } from '../../lib';

function stubEcsDeploymentGroupProps(stack: cdk.Stack) : EcsDeploymentGroupProps {
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
  const blueTargetGroup = new ApplicationTargetGroup(stack, 'BlueTargetGroup', {
    vpc,
    protocol: ApplicationProtocol.HTTP,
    targetType: TargetType.IP,
  });
  const greenTargetGroup = new ApplicationTargetGroup(stack, 'GreenTargetGroup', {
    vpc,
    protocol: ApplicationProtocol.HTTP,
    targetType: TargetType.IP,
  });
  const loadBalancer = new ApplicationLoadBalancer(stack, 'SvcALB', {
    vpc,
  });
  const listener = loadBalancer.addListener('SvcListener', {
    defaultTargetGroups: [blueTargetGroup],
    port: 80,
  });
  service.attachToApplicationTargetGroup(blueTargetGroup);

  return {
    services: [service],
    blueGreenDeploymentConfiguration: {
      prodListener: listener,
      blueTargetGroup,
      greenTargetGroup,
    },
  };
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

    const props = stubEcsDeploymentGroupProps(stack);
    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      ...props,
      application,
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

    const props = stubEcsDeploymentGroupProps(stack);
    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      ...props,
      application,
      blueGreenDeploymentConfiguration: {
        ...props.blueGreenDeploymentConfiguration,
        waitTimeForContinueDeployment: Duration.minutes(10),
        waitTimeForTermination: Duration.minutes(5),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      BlueGreenDeploymentConfiguration: {
        DeploymentReadyOption: {
          ActionOnTimeout: 'STOP_DEPLOYMENT',
          WaitTimeInMinutes: 10,
        },
        TerminateBlueInstancesOnDeploymentSuccess: {
          Action: 'TERMINATE',
          TerminationWaitTimeInMinutes: 5,
        },
      },
    });
  });

  test('can be created by explicitly passing an Application', () => {
    const stack = new cdk.Stack();

    const application = new codedeploy.EcsApplication(stack, 'MyApp');
    const props = stubEcsDeploymentGroupProps(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      ...props,
      application,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ApplicationName: {
        Ref: 'MyApp3CE31C26',
      },
      ECSServices: [{
        ClusterName: stack.resolve(props.services[0].cluster.clusterName),
        ServiceName: stack.resolve(props.services[0].serviceName),
      }],
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
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

    const props = stubEcsDeploymentGroupProps(stack);
    const deploymentGroup = new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      ...props,
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

    const props = stubEcsDeploymentGroupProps(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      ...props,
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

    const props = stubEcsDeploymentGroupProps(stack);
    const deploymentGroup = new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      ...props,
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

    const props = stubEcsDeploymentGroupProps(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      ...props,
      autoRollback: {
        deploymentInAlarm: true,
      },
    });

    expect(() => app.synth()).toThrow(/deploymentInAlarm/);
  });

  test('setting traffic shifting', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    const props = stubEcsDeploymentGroupProps(stack);
    const loadBalancer = new ApplicationLoadBalancer(stack, 'testALB', {
      vpc: props.services[0].cluster.vpc,
    });
    const testListener = loadBalancer.addListener('TestListener', {
      defaultTargetGroups: [props.blueGreenDeploymentConfiguration.blueTargetGroup as IApplicationTargetGroup],
      protocol: ApplicationProtocol.HTTP,
      port: 81,
    });
    new codedeploy.EcsDeploymentGroup(stack, 'DeploymentGroup', {
      ...props,
      blueGreenDeploymentConfiguration: {
        ...props.blueGreenDeploymentConfiguration,
        testListener,
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
            Name: stack.resolve(props.blueGreenDeploymentConfiguration.blueTargetGroup.targetGroupName),
          }, {
            Name: stack.resolve(props.blueGreenDeploymentConfiguration.greenTargetGroup.targetGroupName),
          }],
          ProdTrafficRoute: {
            ListenerArns: [
              stack.resolve(props.blueGreenDeploymentConfiguration.prodListener.listenerArn),
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

  test('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const props = stubEcsDeploymentGroupProps(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      ...props,
      deploymentGroupName: 'a'.repeat(101),
    });

    expect(() => app.synth()).toThrow(`Deployment group name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
  });

  test('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const props = stubEcsDeploymentGroupProps(stack);
    new codedeploy.EcsDeploymentGroup(stack, 'MyDG', {
      ...props,
      deploymentGroupName: 'my name',
    });

    expect(() => app.synth()).toThrow('Deployment group name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
  });

});
