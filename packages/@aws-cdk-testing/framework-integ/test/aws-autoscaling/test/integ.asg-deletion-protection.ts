import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-autoscaling-deletion-protection');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const fleetNone = new autoscaling.AutoScalingGroup(stack, 'FleetNone', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  deletionProtection: autoscaling.DeletionProtection.NONE,
});

const fleetPreventForce = new autoscaling.AutoScalingGroup(stack, 'FleetPreventForce', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  deletionProtection: autoscaling.DeletionProtection.PREVENT_FORCE_DELETION,
});

const fleetPreventAll = new autoscaling.AutoScalingGroup(stack, 'FleetPreventAll', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  deletionProtection: autoscaling.DeletionProtection.PREVENT_ALL_DELETION,
});

const test = new integ.IntegTest(app, 'DeletionProtectionTest', {
  testCases: [stack],
});

test.assertions.awsApiCall('AutoScaling', 'describeAutoScalingGroups', {
  AutoScalingGroupNames: [fleetNone.autoScalingGroupName],
}).assertAtPath('AutoScalingGroups.0.DeletionProtection', integ.ExpectedResult.stringLikeRegexp('None'));

test.assertions.awsApiCall('AutoScaling', 'describeAutoScalingGroups', {
  AutoScalingGroupNames: [fleetPreventForce.autoScalingGroupName],
}).assertAtPath('AutoScalingGroups.0.DeletionProtection', integ.ExpectedResult.stringLikeRegexp('PreventForceDelete'));

test.assertions.awsApiCall('AutoScaling', 'describeAutoScalingGroups', {
  AutoScalingGroupNames: [fleetPreventAll.autoScalingGroupName],
}).assertAtPath('AutoScalingGroups.0.DeletionProtection', integ.ExpectedResult.stringLikeRegexp('PreventDelete'));
