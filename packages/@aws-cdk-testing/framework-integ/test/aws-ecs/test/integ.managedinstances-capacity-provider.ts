import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': true,
  },
});
const stack = new cdk.Stack(app, 'integ-managedinstances-capacity-provider');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

// Create a security group for FMI instances
const fmiSecurityGroup = new ec2.SecurityGroup(stack, 'ManagedInstancesSecurityGroup', {
  vpc,
  description: 'Security group for ManagedInstances capacity provider instances',
  allowAllOutbound: true,
});

// Create MI Capacity Provider — let the construct create default instance profile
// (must be prefixed with 'ecsInstanceRole' for the managed policy PassRole condition)
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  capacityOptionType: ecs.CapacityOptionType.SPOT,
  subnets: vpc.privateSubnets,
  securityGroups: [fmiSecurityGroup],
  propagateTags: ecs.PropagateManagedInstancesTags.CAPACITY_PROVIDER,
  instanceRequirements: {
    vCpuCountMin: 1,
    memoryMin: cdk.Size.gibibytes(2),
  },
});

// Configure security group rules using IConnectable interface
miCapacityProvider.connections.allowFrom(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(80));

// Add FMI capacity provider to cluster
cluster.addManagedInstancesCapacityProvider(miCapacityProvider);
cluster.addDefaultCapacityProviderStrategy([
  {
    capacityProvider: miCapacityProvider.capacityProviderName,
    weight: 1,
  },
]);

// Create a task definition compatible with Managed Instances and Fargate
const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
  compatibility: ecs.Compatibility.FARGATE_AND_MANAGED_INSTANCES,
  cpu: '256',
  memoryMiB: '512',
  networkMode: ecs.NetworkMode.AWS_VPC,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/httpd:2.4'),
  memoryLimitMiB: 512,
  portMappings: [
    {
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    },
  ],
});

// Create a service using the MI capacity provider
new ecs.FargateService(stack, 'ManagedInstancesService', {
  cluster,
  taskDefinition,
  capacityProviderStrategies: [
    {
      capacityProvider: miCapacityProvider.capacityProviderName,
      weight: 1,
    },
  ],
  desiredCount: 1,
});

new integ.IntegTest(app, 'ManagedInstancesCapacityProviders', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // https://github.com/aws/aws-cdk/issues/36071
      expectError: true,
    },
  },
});

app.synth();
