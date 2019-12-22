import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { HostedZone } from '../lib';

export = {
  'Hosted Zone': {
    'Hosted Zone constructs the ARN'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' }
      });

      const testZone = new HostedZone(stack, 'HostedZone', {
        zoneName: 'testZone'
      });

      test.deepEqual(stack.resolve(testZone.hostedZoneArn), {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':route53:::hostedzone/',
            { Ref: 'HostedZoneDB99F866' }
          ]
        ]
      });

      test.done();
    }
  }
};
