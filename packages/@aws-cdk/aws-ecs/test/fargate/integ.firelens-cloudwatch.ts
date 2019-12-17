import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// grant cloudwatch logs permissions to task role
const taskIAMRole = new iam.Role(stack, 'firelens-cloudwatch-role', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
  inlinePolicies: {
    firelens_cloudwatch_policy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            'logs:CreateLogStream',
            'logs:CreateLogGroup',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents'
          ],
          resources: ['*'],
        })
      ]
    }),
  },
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
  taskRole: taskIAMRole,
});

// add log router container with firelens configuration
taskDefinition.addContainer('log-router', {
  image: ecs.ContainerImage.fromRegistry('amazon/aws-for-fluent-bit'),
  firelensConfig: {
    type: ecs.FireLensRouterType.FLUENTBIT,
  },
  logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
  memoryReservationMiB: 50,
});

const container = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  logging: new ecs.FireLensLogDriver({
    options: {
      Name: 'cloudwatch',
      region: stack.region,
      log_group_name: 'firelens-fluent-bit',
      auto_create_group: 'true',
      log_stream_prefix: 'from-fluent-bit'
    }
  }),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP
});

// Create a security group that allows tcp @ port 80
const securityGroup = new ec2.SecurityGroup(stack, 'websvc-sg', { vpc });
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroup,
});

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80 });

service.registerLoadBalancerTargets({
  containerName: 'nginx',
  containerPort: 80,
  listener: ecs.ListenerConfig.networkListener(listener),
  newTargetGroupId: 'ECS',
});

new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName, });

app.synth();
