import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';
import { CapacityProviderConfiguration } from '../../lib/capacity-provider';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'integ-capacity-provider2', { env });

// const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true })

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const cp = cluster.addCapacityProvider('CP', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
  },
  managedScaling: true,
  managedTerminationProtection: true,
})

const cpSpot = cluster.addCapacityProvider('CPSpot', {
  capacityOptions: {
    instanceType: new ec2.InstanceType('t3.large'),
    spotPrice: '0.1',
  },
  managedScaling: true,
  managedTerminationProtection: true,
})

new CapacityProviderConfiguration(stack, 'CapacityProviderConfiguration', {
  cluster,
  capacityProvider: [ cp, cpSpot ],
  defaultStrategy: [
    { capacityProvider: cp, weight: 1 },
    { capacityProvider: cpSpot, base: 1, weight: 3 },
  ],
})
