import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'integ-capacity-provider8', { env });

// const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true })

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
Array.isArray(cluster)

// create the 1st capacity provider with on-demand t3.large instances
cluster.addCapacityProvider('CP', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
    minCapacity: 2,
  },
  managedScaling: true,
  managedTerminationProtection: true,
  defaultStrategy: { base: 1, weight: 1 },
});

// // create the 2nd capacity provider with ec2 spot t3.large instances
cluster.addCapacityProvider('CPSpot', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
    minCapacity: 3,
    spotPrice: '0.1',
  },
  managedScaling: true,
  managedTerminationProtection: true,
  defaultStrategy: { weight: 3 },
});


// // register both capacity providers to the cluster
// cluster.addCapacityProviderConfiguration('CapacityProviderConfiguration', {
//   capacityProvider: [cp, cpSpot],
//   defaultStrategy: [
//     { capacityProvider: cp, base: 1, weight: 1 },
//     { capacityProvider: cpSpot, weight: 3 },
//   ],
// });
