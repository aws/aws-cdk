import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cloud9 from '../lib';

export = {
  'default cloud9 ec2 environment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env', { vpc });

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "t2.micro",
      SubnetId: "pub1"
    }
    ));

    test.done();
  },

};

function mockVpc(stack: cdk.Stack) {
  return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: ['az1'],
    publicSubnetIds: ['pub1'],
    privateSubnetIds: ['pri1'],
    isolatedSubnetIds: [],
  });
}
