import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-managedinstances-capacity-provider-local-storage');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

const fmiSecurityGroup = new ec2.SecurityGroup(stack, 'ManagedInstancesSecurityGroup', {
  vpc,
  description: 'Security group for ManagedInstances capacity provider instances with local storage',
  allowAllOutbound: true,
});

// Create MI Capacity Provider with useLocalStorage enabled.
// localStorage: REQUIRED ensures only instances with instance store volumes are selected.
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [fmiSecurityGroup],
  useLocalStorage: true,
  instanceRequirements: {
    vCpuCountMin: 1,
    memoryMin: cdk.Size.gibibytes(2),
    localStorage: ec2.LocalStorage.REQUIRED,
  },
});

cluster.addManagedInstancesCapacityProvider(miCapacityProvider);
cluster.addDefaultCapacityProviderStrategy([
  {
    capacityProvider: miCapacityProvider.capacityProviderName,
    weight: 1,
  },
]);

const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
  compatibility: ecs.Compatibility.FARGATE_AND_MANAGED_INSTANCES,
  cpu: '256',
  memoryMiB: '512',
  networkMode: ecs.NetworkMode.AWS_VPC,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/httpd:2.4'),
  memoryLimitMiB: 512,
  portMappings: [{ containerPort: 80, protocol: ecs.Protocol.TCP }],
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

new integ.IntegTest(app, 'ManagedInstancesCapacityProviderLocalStorage', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // https://github.com/aws/aws-cdk/issues/36071
      expectError: true,
    },
  },
});
