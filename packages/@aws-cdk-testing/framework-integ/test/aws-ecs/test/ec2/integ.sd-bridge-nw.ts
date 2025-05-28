import * as ec2 from 'aws-cdk-lib/aws-ec2';
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
const stack = new cdk.Stack(app, 'aws-ecs-integ-ecs');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

// Add Private DNS Namespace
const domainName = 'scorekeep.com';
cluster.addDefaultCloudMapNamespace({
  name: domainName,
});

// Create frontend service
// default network mode is bridge
const frontendTD = new ecs.Ec2TaskDefinition(stack, 'frontendTD');

const frontend = frontendTD.addContainer('frontend', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

frontend.addPortMappings({
  containerPort: 80,
  hostPort: 80,
  protocol: ecs.Protocol.TCP,
});

new ecs.Ec2Service(stack, 'FrontendService', {
  cluster,
  taskDefinition: frontendTD,
  cloudMapOptions: {
    name: 'frontend',
  },
});

app.synth();
