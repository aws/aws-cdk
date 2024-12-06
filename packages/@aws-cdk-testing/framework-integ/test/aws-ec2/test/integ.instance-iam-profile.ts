import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceProfile, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'instance-iam-profile');

const vpc = new ec2.Vpc(stack, 'VPC');

const role = new Role(stack, 'MyRole', {
  assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
});
const instanceProfile = new InstanceProfile(stack, 'MyInstanceProfile', {
  role,
});

const instance = new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
  instanceProfile,
});

const integTest = new IntegTest(app, 'instance-iam-profile-test', {
  testCases: [stack],
});

const describeDefault = integTest.assertions.awsApiCall('EC2', 'describeInstances', {
  InstanceIds: [instance.instanceId],
});

// validate
describeDefault.assertAtPath(
  'Reservations.0.Instances.0.IamInstanceProfile.Arn',
  ExpectedResult.stringLikeRegexp(instanceProfile.instanceProfileArn),
);

app.synth();
