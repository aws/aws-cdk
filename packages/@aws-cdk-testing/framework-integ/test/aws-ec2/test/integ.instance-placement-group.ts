import { App, Stack } from 'aws-cdk-lib';
import {
  Instance, InstanceType, MachineImage, Vpc,
  PlacementGroup, PlacementGroupStrategy,
  InstanceClass, InstanceSize, SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'ec2-instance-placementgroup-stack');

// create a placementGroup
const pg = new PlacementGroup(stack, 'test-pg', {
  strategy: PlacementGroupStrategy.SPREAD,
});

// create a vpc with one public subnet only
const vpc = new Vpc(stack, 'VPC', {
  subnetConfiguration: [
    {
      name: 'public',
      subnetType: SubnetType.PUBLIC,
    },
  ],
  natGateways: 0,
});

// create a Instance with placementGroup support
new Instance(stack, 'Instance', {
  vpc,
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
  machineImage: MachineImage.latestAmazonLinux2023(),
  placementGroup: pg,
});

new IntegTest(app, 'Ec2InstancePlacementGroup', {
  testCases: [stack],
});
