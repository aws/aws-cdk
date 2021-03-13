import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { parseCertificateArn, parsePolicyArn } from '../lib/util';

nodeunitShim({
  certificateArnFromId: {
    'produce arn from certificate id'(test: Test) {
      const stack = new cdk.Stack();
      const certificateId = 'hello';
      test.deepEqual(stack.resolve(parseCertificateArn(stack, { certificateId })), {
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              'iot:::cert/hello']],
      });
      test.done();
    },
  },
  certificateIdFromArn: {
    'produce arn from certificate id'(test: Test) {
      const stack = new cdk.Stack();
      const certificateArn = 'arn:aws:iot:::cert/hello';
      test.deepEqual(stack.resolve(parseCertificateArn(stack, { certificateArn })), {
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              'iot:::cert/hello']],
      });
      test.done();
    },
  },
  policyArnFromId: {
    'produce arn from policy name'(test: Test) {
      const stack = new cdk.Stack();
      const policyName = 'hello';
      test.deepEqual(stack.resolve(parsePolicyArn(stack, policyName)), {
        'Fn::Join':
          ['',
            ['arn:',
              { Ref: 'AWS::Partition' },
              'iot:::policy/hello']],
      });
      test.done();
    },
  },
});
