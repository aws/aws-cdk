import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  networkMode: ecs.NetworkMode.HOST,
  ipcMode: ecs.IpcMode.HOST,
  pidMode: ecs.PidMode.TASK,
});

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

const service = new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
});

const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
lb.addListener({ externalPort: 80 });
lb.addTarget(service);

new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });

app.synth();
