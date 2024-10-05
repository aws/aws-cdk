import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-disable-api-termination');

const vpc = new ec2.Vpc(stack, 'Vpc');

const instance = new ec2.Instance(stack, 'TestInstance', {
  vpc,
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
  instanceType: new ec2.InstanceType('t3.micro'),
  ebsOptimized: true,
  disableApiTermination: true,
});

const testCase = new IntegTest(app, 'instance-disable-api-termination', {
  testCases: [stack],
});

// Describe Instance
const describe = testCase.assertions.awsApiCall('EC2', 'describeInstanceAttribute', {
  InstanceId: instance.instanceId,
  Attribute: 'disableApiTermination',
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  DisableApiTermination: { Value: true },
}));
