import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-infrastructure-configuration-all-parameters');

const topic = new sns.Topic(stack, 'NotificationTopic');
const instanceProfile = new iam.InstanceProfile(stack, 'EC2InstanceProfileForImageBuilder', {
  role: new iam.Role(stack, 'EC2InstanceProfileForImageBuilderRole', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  }),
});
const bucket = new s3.Bucket(stack, 'LogBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });

new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration', {
  instanceProfile: instanceProfile,
  description: 'This is an infrastructure configuration.',
  ec2InstanceAvailabilityZone: stack.availabilityZones[0],
  ec2InstanceTenancy: imagebuilder.Tenancy.DEDICATED,
  vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
  securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'SecurityGroup', vpc.vpcDefaultSecurityGroup)],
  httpPutResponseHopLimit: 1,
  httpTokens: imagebuilder.HttpTokens.REQUIRED,
  instanceTypes: [
    ec2.InstanceType.of(ec2.InstanceClass.M7I_FLEX, ec2.InstanceSize.LARGE),
    ec2.InstanceType.of(ec2.InstanceClass.C7G, ec2.InstanceSize.MEDIUM),
  ],
  logging: {
    s3Bucket: bucket,
    s3KeyPrefix: 'imagebuilder-logs',
  },
  keyPair: ec2.KeyPair.fromKeyPairName(stack, 'KeyPair', 'key-pair-name'),
  notificationTopic: topic,
  resourceTags: {
    infraTag1: 'infraValue1',
    infraTag2: 'infraValue2',
  },
  tags: {
    key1: 'value1',
    key2: 'value2',
  },
  terminateInstanceOnFailure: true,
});

new integ.IntegTest(app, 'InfrastructureConfigurationTest', {
  testCases: [stack],
});
