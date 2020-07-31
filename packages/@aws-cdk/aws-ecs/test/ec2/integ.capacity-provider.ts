import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-capacity-provider');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// create the 1st capacity provider with on-demand t3.large instances
const cp = cluster.addCapacityProvider('CP', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
    minCapacity: 2,
  },
  managedScaling: true,
  managedTerminationProtection: true,
});

// create the 2nd capacity provider with ec2 spot t3.large instances
const cpSpot = cluster.addCapacityProvider('CPSpot', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
    minCapacity: 3,
    spotPrice: '0.1',
  },
  managedScaling: true,
  managedTerminationProtection: true,
});

// register both capacity providers to the cluster
cluster.addCapacityProviderConfiguration('CapacityProviderConfiguration', {
  capacityProvider: [cp, cpSpot],
  defaultStrategy: [
    { capacityProvider: cp, base: 1, weight: 1 },
    { capacityProvider: cpSpot, weight: 3 },
  ],
});
