import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-linear-deployment');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const blueTargetGroup = new elbv2.ApplicationTargetGroup(stack, 'BlueTG', {
  vpc: cluster.vpc,
  port: 80,
  protocol: elbv2.ApplicationProtocol.HTTP,
  targetType: elbv2.TargetType.IP,
  healthCheck: {
    path: '/',
    healthyHttpCodes: '200',
  },
});

const greenTargetGroup = new elbv2.ApplicationTargetGroup(stack, 'GreenTG', {
  vpc: cluster.vpc,
  port: 80,
  protocol: elbv2.ApplicationProtocol.HTTP,
  targetType: elbv2.TargetType.IP,
  healthCheck: {
    path: '/',
    healthyHttpCodes: '200',
  },
});

const lbSecurityGroup = new ec2.SecurityGroup(stack, 'LBSecurityGroup', {
  vpc: cluster.vpc,
  allowAllOutbound: true,
});

const ecsSecurityGroup = new ec2.SecurityGroup(stack, 'ECSSecurityGroup', {
  vpc: cluster.vpc,
  allowAllOutbound: true,
});
ecsSecurityGroup.addIngressRule(lbSecurityGroup, ec2.Port.tcp(80));

const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc: cluster.vpc,
  internetFacing: true,
  securityGroup: lbSecurityGroup,
  idleTimeout: cdk.Duration.seconds(60),
});

const listener = alb.addListener('ALBListener', {
  port: 80,
  defaultAction: elbv2.ListenerAction.fixedResponse(404),
  open: false,
});

const prodListenerRule = new elbv2.ApplicationListenerRule(stack, 'ALBProductionListenerRule', {
  listener: listener,
  priority: 1,
  conditions: [
    elbv2.ListenerCondition.pathPatterns(['/*']),
  ],
  action: elbv2.ListenerAction.weightedForward([
    {
      targetGroup: blueTargetGroup,
      weight: 100,
    },
    {
      targetGroup: greenTargetGroup,
      weight: 0,
    },
  ]),
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('container', {
  containerName: 'nginx',
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
  portMappings: [{
    name: 'api',
    containerPort: 80,
    appProtocol: ecs.AppProtocol.http,
  }],
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroups: [ecsSecurityGroup],
  deploymentStrategy: ecs.DeploymentStrategy.LINEAR,
  linearConfiguration: {
    stepPercent: 10.0,
    stepBakeTime: cdk.Duration.minutes(5),
  },
});

const target = service.loadBalancerTarget({
  containerName: 'nginx',
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
  alternateTarget: new ecs.AlternateTarget('LBAlternateOptions', {
    alternateTargetGroup: greenTargetGroup,
    productionListener: ecs.ListenerRuleConfiguration.applicationListenerRule(prodListenerRule),
  }),
});

target.attachToApplicationTargetGroup(blueTargetGroup);

new integ.IntegTest(app, 'aws-ecs-linear', {
  testCases: [stack],
});
