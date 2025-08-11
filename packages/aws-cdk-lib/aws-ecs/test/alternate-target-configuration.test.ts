import { Template, Match } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { App, Stack } from '../../core';
import * as ecs from '../lib';

describe('AlternateTarget', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let taskDefinition: ecs.FargateTaskDefinition;
  let blueTargetGroup: elbv2.ApplicationTargetGroup;
  let greenTargetGroup: elbv2.ApplicationTargetGroup;
  let alb: elbv2.ApplicationLoadBalancer;
  let listener: elbv2.ApplicationListener;
  let prodRule: elbv2.ApplicationListenerRule;
  let testRule: elbv2.ApplicationListenerRule;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ containerPort: 80 }],
    });

    blueTargetGroup = new elbv2.ApplicationTargetGroup(stack, 'BlueTG', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    greenTargetGroup = new elbv2.ApplicationTargetGroup(stack, 'GreenTG', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
    listener = alb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.fixedResponse(200),
    });

    prodRule = new elbv2.ApplicationListenerRule(stack, 'ProdRule', {
      listener,
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/prod'])],
      action: elbv2.ListenerAction.forward([blueTargetGroup]),
    });

    testRule = new elbv2.ApplicationListenerRule(stack, 'TestRule', {
      listener,
      priority: 2,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/test'])],
      action: elbv2.ListenerAction.forward([blueTargetGroup]),
    });
  });

  test('AlternateTarget creates correct configuration with production listener only', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // WHEN
    const alternateTarget = new ecs.AlternateTarget('GreenTG', {
      alternateTargetGroup: greenTargetGroup,
      productionListener: ecs.ListenerRuleConfiguration.applicationListenerRule(prodRule),
    });

    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
      alternateTarget,
    });
    target.attachToApplicationTargetGroup(blueTargetGroup);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('BlueTG'),
          },
          AdvancedConfiguration: {
            AlternateTargetGroupArn: {
              Ref: Match.stringLikeRegexp('GreenTG'),
            },
            ProductionListenerRule: {
              Ref: Match.stringLikeRegexp('ProdRule'),
            },
            TestListenerRule: Match.absent(),
          },
        },
      ],
    });
  });

  test('AlternateTarget creates correct configuration with both production and test listeners', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // WHEN
    const alternateTarget = new ecs.AlternateTarget('GreenTG', {
      alternateTargetGroup: greenTargetGroup,
      productionListener: ecs.ListenerRuleConfiguration.applicationListenerRule(prodRule),
      testListener: ecs.ListenerRuleConfiguration.applicationListenerRule(testRule),
    });

    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
      alternateTarget,
    });
    target.attachToApplicationTargetGroup(blueTargetGroup);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('BlueTG'),
          },
          AdvancedConfiguration: {
            AlternateTargetGroupArn: {
              Ref: Match.stringLikeRegexp('GreenTG'),
            },
            ProductionListenerRule: {
              Ref: Match.stringLikeRegexp('ProdRule'),
            },
            TestListenerRule: {
              Ref: Match.stringLikeRegexp('TestRule'),
            },
          },
        },
      ],
    });
  });

  test('AlternateTarget creates correct configuration with custom role', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const customRole = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECSInfrastructureRolePolicyForLoadBalancers'),
      ],
    });

    // WHEN
    const alternateTarget = new ecs.AlternateTarget('GreenTG', {
      alternateTargetGroup: greenTargetGroup,
      productionListener: ecs.ListenerRuleConfiguration.applicationListenerRule(prodRule),
      role: customRole,
    });

    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
      alternateTarget,
    });
    target.attachToApplicationTargetGroup(blueTargetGroup);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('BlueTG'),
          },
          AdvancedConfiguration: {
            AlternateTargetGroupArn: {
              Ref: Match.stringLikeRegexp('GreenTG'),
            },
            ProductionListenerRule: {
              Ref: Match.stringLikeRegexp('ProdRule'),
            },
            RoleArn: {
              'Fn::GetAtt': [
                'CustomRole6D8E6809',
                'Arn',
              ],
            },
          },
        },
      ],
    });
  });

  test('NetworkListenerConfiguration works with NLB listeners', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
    const nlbListener = nlb.addListener('NlbListener', { port: 80 });

    const nlbBlueTargetGroup = new elbv2.NetworkTargetGroup(stack, 'NlbBlueTG', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    const nlbGreenTargetGroup = new elbv2.NetworkTargetGroup(stack, 'NlbGreenTG', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    nlbListener.addAction('DefaultAction', {
      action: elbv2.NetworkListenerAction.forward([nlbBlueTargetGroup]),
    });

    // WHEN
    const alternateTarget = new ecs.AlternateTarget('GreenTG', {
      alternateTargetGroup: nlbGreenTargetGroup,
      productionListener: ecs.ListenerRuleConfiguration.networkListener(nlbListener),
    });

    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
      alternateTarget,
    });
    target.attachToNetworkTargetGroup(nlbBlueTargetGroup);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('NlbBlueTG'),
          },
          AdvancedConfiguration: {
            AlternateTargetGroupArn: {
              Ref: Match.stringLikeRegexp('NlbGreenTG'),
            },
            ProductionListenerRule: {
              Ref: Match.stringLikeRegexp('NlbListener'),
            },
          },
        },
      ],
    });
  });

  test('Service without alternate target works correctly (regression test)', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // WHEN - No alternate target provided
    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
    });
    target.attachToApplicationTargetGroup(blueTargetGroup);

    // THEN - Should not have AdvancedConfiguration
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('BlueTG'),
          },
          AdvancedConfiguration: Match.absent(),
        },
      ],
    });
  });

  test('Service without alternate target works with NLB (regression test)', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
    const nlbBlueTargetGroup = new elbv2.NetworkTargetGroup(stack, 'NlbBlueTG', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    // WHEN - No alternate target provided
    const target = service.loadBalancerTarget({
      containerName: 'web',
      containerPort: 80,
    });
    target.attachToNetworkTargetGroup(nlbBlueTargetGroup);

    // THEN - Should not have AdvancedConfiguration
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LoadBalancers: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: Match.stringLikeRegexp('NlbBlueTG'),
          },
          AdvancedConfiguration: Match.absent(),
        },
      ],
    });
  });
});
