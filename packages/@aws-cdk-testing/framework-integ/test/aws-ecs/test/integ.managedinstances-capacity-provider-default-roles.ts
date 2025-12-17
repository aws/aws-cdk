import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': true,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
  },
});
const stack = new cdk.Stack(app, 'integ-managedinstances-capacity-provider-default-roles');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: true });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

// Create a security group for FMI instances
const fmiSecurityGroup = new ec2.SecurityGroup(stack, 'ManagedInstancesSecurityGroup', {
  vpc,
  description: 'Security group for ManagedInstances capacity provider instances',
  allowAllOutbound: false,
});

// Add specific outbound rule for HTTPS
fmiSecurityGroup.addEgressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(443),
  'Allow HTTPS outbound',
);

// Create MI Capacity Provider without specifying infrastructureRole or ec2InstanceProfile
// This will test the default roles
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [fmiSecurityGroup],
  propagateTags: ecs.PropagateManagedInstancesTags.CAPACITY_PROVIDER,
  instanceRequirements: {
    vCpuCountMin: 1,
    memoryMin: cdk.Size.gibibytes(2),
    cpuManufacturers: [ec2.CpuManufacturer.INTEL],
  },
});

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

new integ.IntegTest(app, 'ManagedInstancesCapacityProvidersDefaultRoles', {
  testCases: [stack],
});

app.synth();
