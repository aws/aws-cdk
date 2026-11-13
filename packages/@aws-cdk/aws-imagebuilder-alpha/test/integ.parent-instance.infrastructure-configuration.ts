import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-infrastructure-configuration-parent-instance');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 1,
  natGateways: 0,
  subnetConfiguration: [{ name: 'Public', subnetType: ec2.SubnetType.PUBLIC }],
});

// The group only has to exist for the infrastructure configuration to be created, so it runs no instances.
const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'BuildPool', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  requireImdsv2: true,
  minCapacity: 0,
  maxCapacity: 1,
  desiredCapacity: 0,
});

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
  parentInstance: {
    autoScalingGroup,
    capacityWaitTimeout: cdk.Duration.minutes(10),
  },
  terminateInstanceOnCompletion: false,
});

// The pipeline gets an execution role scoped to the group; no build is started
new imagebuilder.ImagePipeline(stack, 'ImagePipeline', {
  recipe: new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
    baseImage: imagebuilder.BaseImage.fromSsmParameterName(
      '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64',
    ),
  }),
  infrastructureConfiguration,
});

new integ.IntegTest(app, 'InfrastructureConfigurationParentInstanceTest', {
  testCases: [stack],
});
