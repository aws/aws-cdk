import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Template } from 'aws-cdk-lib/assertions';

const app = new cdk.App();
const stackName = 'aws-cdk-autoscaling-deletion-protection';
const asgStack = new cdk.Stack(app, stackName);

const vpc = new ec2.Vpc(asgStack, 'VPC', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const asg = new autoscaling.AutoScalingGroup(asgStack, 'FleetPreventAll', {
  autoScalingGroupName: 'test-asg-deletion-protection',
  vpc,
  minCapacity: 0,
  desiredCapacity: 0,
  maxCapacity: 0,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  deletionProtection: autoscaling.DeletionProtection.PREVENT_ALL_DELETION,
});

const test = new integ.IntegTest(app, 'DeletionProtectionTest', {
  testCases: [asgStack],
});

// assertion logic
const cfnAsg = asg.node.defaultChild as cdk.CfnResource;
cfnAsg.addPropertyOverride('DeletionProtection', autoscaling.DeletionProtection.NONE);
const templateString = JSON.stringify(Template.fromStack(asgStack).toJSON(), null, 2);
cfnAsg.addPropertyOverride('DeletionProtection', autoscaling.DeletionProtection.PREVENT_ALL_DELETION);

test.assertions.awsApiCall('CloudFormation', 'deleteStack', {
  StackName: stackName,
}).next(
  test.assertions.awsApiCall('CloudFormation', 'describeStacks', {
    StackName: stackName,
  }).expect(integ.ExpectedResult.objectLike({
    Stacks: integ.Match.arrayWith([
      integ.Match.objectLike({
        StackName: stackName,
        StackStatus: 'DELETE_FAILED',
      }),
    ]),
  })).waitForAssertions(),
).next(
  test.assertions.awsApiCall('CloudFormation', 'updateStack', {
    StackName: stackName,
    TemplateBody: templateString,
  }),
);
