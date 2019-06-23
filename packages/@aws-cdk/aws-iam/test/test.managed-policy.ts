import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import { ManagedPolicy } from '../lib';

export = {
  'simple managed policy'(test: Test) {
    const stack = new cdk.Stack();
    const mp = ManagedPolicy.fromAwsManagedPolicyName("service-role/SomePolicy");

    test.deepEqual(stack.resolve(mp.managedPolicyArn), {
      "Fn::Join": ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/service-role/SomePolicy'
      ]]
    });

    test.done();
  },
};
