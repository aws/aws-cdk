import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-key-pair-1');

const vpc = new ec2.Vpc(stack, 'Vpc');

const keyPair = new ec2.KeyPair(stack, 'TestKeyPair');

new ec2.Instance(stack, 'TestInstance', {
  vpc,
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
  instanceType: new ec2.InstanceType('t3.micro'),
  keyPair,
});

new integ.IntegTest(app, 'KeyPairTest', {
  testCases: [stack],
});

app.synth();
