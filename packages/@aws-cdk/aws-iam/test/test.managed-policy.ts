import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { AwsManagedPolicy } from '../lib';

export = {
  'simple managed policy'(test: Test) {
    const stack = new cdk.Stack();
    const mp = new AwsManagedPolicy("service-role/SomePolicy", stack);

    test.deepEqual(stack.node.resolve(mp.policyArn), {
      "Fn::Join": ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/service-role/SomePolicy'
      ]]
    });

    test.done();
  },
};
