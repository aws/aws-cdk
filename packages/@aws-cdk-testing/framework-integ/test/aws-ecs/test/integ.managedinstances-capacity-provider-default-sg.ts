import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': true,
  },
});
const stack = new cdk.Stack(app, 'integ-managedinstances-capacity-provider-default-sg');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

// Create MI Capacity Provider without securityGroups — a default SG is auto-created from vpc
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  vpc,
  subnets: vpc.privateSubnets,
  propagateTags: ecs.PropagateManagedInstancesTags.CAPACITY_PROVIDER,
  instanceRequirements: {
    vCpuCountMin: 1,
    memoryMin: cdk.Size.gibibytes(2),
  },
});

// Configure rules via IConnectable using the auto-created SG
miCapacityProvider.connections.allowFrom(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(80));

// Add capacity provider to cluster
cluster.addManagedInstancesCapacityProvider(miCapacityProvider);
cluster.addDefaultCapacityProviderStrategy([
  {
    capacityProvider: miCapacityProvider.capacityProviderName,
    weight: 1,
  },
]);

// Task definition compatible with Managed Instances
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

new integ.IntegTest(app, 'ManagedInstancesCapacityProviderDefaultSg', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // https://github.com/aws/aws-cdk/issues/36071
      expectError: true,
    },
  },
});

app.synth();
