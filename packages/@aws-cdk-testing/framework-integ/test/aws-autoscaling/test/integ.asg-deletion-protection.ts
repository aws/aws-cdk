import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const app = new cdk.App();
const asgStack = new cdk.Stack(app, 'aws-cdk-autoscaling-deletion-protection');

const vpc = new ec2.Vpc(asgStack, 'VPC', { maxAzs: 1, restrictDefaultSecurityGroup: false });

new autoscaling.AutoScalingGroup(asgStack, 'FleetPreventAll', {
  autoScalingGroupName: 'test-asg-deletion-protection',
  vpc,
  minCapacity: 0,
  desiredCapacity: 0,
  maxCapacity: 0,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  deletionProtection: autoscaling.DeletionProtection.PREVENT_ALL_DELETION,
});

new integ.IntegTest(app, 'DeletionProtectionTest', {
  testCases: [asgStack],
  stackUpdateWorkflow: false,
  hooks: {
    preDestroy: [
      'aws autoscaling update-auto-scaling-group --auto-scaling-group-name test-asg-deletion-protection --deletion-protection none --region us-east-1',
    ],
  },
});
