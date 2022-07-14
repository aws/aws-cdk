import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc-azs');

new ec2.Vpc(stack, 'MyVpc', {
  availabilityZones: [stack.availabilityZones[1]],
});

app.synth();
