import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-blue-green-deployment');

// Create VPC and Cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
  defaultCloudMapNamespace: {
    name: 'bluegreendeployment.com',
    useForServiceConnect: true,
  },
});

// Create Blue target group for B/G deployment
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

// Create Green target group for B/G deployment
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

// Create security groups
const lbSecurityGroup = new ec2.SecurityGroup(stack, 'LBSecurityGroup', {
  vpc: cluster.vpc,
  allowAllOutbound: true,
});
lbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

const ecsSecurityGroup = new ec2.SecurityGroup(stack, 'ECSSecurityGroup', {
  vpc: cluster.vpc,
  allowAllOutbound: true,
});
ecsSecurityGroup.addIngressRule(lbSecurityGroup, ec2.Port.tcp(80));

// Create ALB
const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc: cluster.vpc,
  internetFacing: true,
  securityGroup: lbSecurityGroup,
  idleTimeout: cdk.Duration.seconds(60),
});

// Create ALB listener with default 404 response
const listener = alb.addListener('ALBListenerHTTP', {
  port: 80,
  defaultAction: elbv2.ListenerAction.fixedResponse(404),
});

// Create Prod listener rule
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

// Create granular IAM roles
const ecsTaskExecutionRole = new iam.Role(stack, 'EcsTaskExecutionRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
  ],
});

// Create Blue/Green deployment service role
const ecsServiceRole = new iam.Role(stack, 'ServiceRole', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('ecs.amazonaws.com'),
  ),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceRole'),
  ],
  inlinePolicies: {
    LambdaInvokePolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          resources: ['*'],
        }),
      ],
    }),
    ELBPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            'elasticloadbalancing:ModifyRule',
            'elasticloadbalancing:ModifyListener',
          ],
          resources: [prodListenerRule.listenerRuleArn],
        }),
      ],
    }),
  },
});

// Create Lambda hook
const lambdaHook = new lambda.Function(stack, 'LambdaHook', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_22_X,
  code: lambda.Code.fromInline(`exports.handler = async (event, context) => {
    console.log('Event received:', JSON.stringify(event));
    return { hookStatus: 'SUCCEEDED' }; 
    };`),
});

lambdaHook.grantInvoke(ecsServiceRole);

// Create task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
  executionRole: ecsTaskExecutionRole,
});

// Add container to task definition
taskDefinition.addContainer('container', {
  containerName: 'nginx',
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest'),
  portMappings: [{
    name: 'api',
    containerPort: 80,
    appProtocol: ecs.AppProtocol.http,
  }],
});

// Create Fargate service with escape hatching for B/G deployment
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroups: [ecsSecurityGroup],
});

service.attachToApplicationTargetGroup(blueTargetGroup);

// Use escape hatching to set B/G deployment properties
const cfnService = service.node.defaultChild as ecs.CfnService;
cfnService.addPropertyOverride('DeploymentController', {
  Type: 'ECS',
});

cfnService.addPropertyOverride('DeploymentConfiguration', {
  DeploymentCircuitBreaker: {
    Enable: false,
    Rollback: false,
  },
  MaximumPercent: 200,
  MinimumHealthyPercent: 100,
  Strategy: 'BLUE_GREEN',
  BakeTimeInMinutes: 0,
  LifecycleHooks: [{
    HookTargetArn: lambdaHook.functionArn,
    RoleArn: ecsServiceRole.roleArn,
    LifecycleStages: ['POST_TEST_TRAFFIC_SHIFT'],
  }],
});

cfnService.addPropertyOverride('LoadBalancers.0', {
  AdvancedConfiguration: {
    AlternateTargetGroupArn: greenTargetGroup.targetGroupArn,
    RoleArn: ecsServiceRole.roleArn,
    ProductionListenerRule: prodListenerRule.listenerRuleArn,
  },
});

// Create integration test
new integ.IntegTest(app, 'aws-ecs-blue-green', {
  testCases: [stack],
});

app.synth();
