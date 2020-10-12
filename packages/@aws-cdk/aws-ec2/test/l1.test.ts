import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

test('NetworkAclEntry CidrBlock should be optional', () => {
  const stack = new cdk.Stack();

  new ec2.CfnNetworkAclEntry(stack, 'ACL', {
    // Note the conspicuous absence of cidrBlock
    networkAclId: 'asdf',
    protocol: 5,
    ruleAction: 'action',
    ruleNumber: 1,
  });
});
