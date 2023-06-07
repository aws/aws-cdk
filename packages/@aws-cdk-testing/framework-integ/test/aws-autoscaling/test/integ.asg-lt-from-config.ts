import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AUTOSCALING_DISABLE_LAUNCH_CONFIG } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-lg-from-config');
stack.node.setContext(AUTOSCALING_DISABLE_LAUNCH_CONFIG, true);

const blockDevices = [{
  deviceName: 'ebs',
  mappingEnabled: true,
  volume: autoscaling.BlockDeviceVolume.ebs(15, {
    deleteOnTermination: true,
    encrypted: true,
    volumeType: autoscaling.EbsDeviceVolumeType.IO1,
    iops: 5000,
  }),
}, {
  deviceName: 'ebs-snapshot',
  volume: autoscaling.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
    volumeSize: 500,
    deleteOnTermination: false,
    volumeType: autoscaling.EbsDeviceVolumeType.SC1,
  }),
}];

const userData = ec2.UserData.forLinux();

const vpc = new ec2.Vpc(stack, 'VPC');
const securityGroup = new ec2.SecurityGroup(stack, 'IntegSg', {
  vpc,
  allowAllIpv6Outbound: true,
});

new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
  machineImage: new ec2.AmazonLinuxImage(),
  keyName: 'ec2-key-pair',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
  instanceMonitoring: autoscaling.Monitoring.DETAILED,
  securityGroup,
  userData,
  associatePublicIpAddress: true,
  spotPrice: '0.05',
  blockDevices,
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});

new IntegTest(app, 'LaunchTemplateFromLaunchConfigPropsTest', {
  testCases: [stack],
});
app.synth();
