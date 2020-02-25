import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ec2 from '../lib';

export = {
  'NetworkAclEntry CidrBlock should be optional'(test: Test) {
    const stack = new cdk.Stack();

    new ec2.CfnNetworkAclEntry(stack, 'ACL', {
      // Note the conspicuous absence of cidrBlock
      networkAclId: 'asdf',
      protocol: 5,
      ruleAction: 'action',
      ruleNumber: 1
    });

    test.done();
  },
};
