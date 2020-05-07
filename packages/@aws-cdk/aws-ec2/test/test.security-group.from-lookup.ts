import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { SecurityGroup } from "../lib";

export = {
  'SecurityGroup.fromLookup()': {
    'fromLookup will return context values'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' }
      });
      const filter = {
        vpcId: 'vpc-12345',
        filter: {
          'group-name': 'default'
        }
      };

      SecurityGroup.fromLookup(stack, 'SG01', filter);

      const missing = SynthUtils.synthesize(stack).assembly.manifest.missing!;
      test.ok(missing && missing.length === 1);

      const fakeSgId = 'sg-12345678';
      const fakeSg = {
        securityGroupId: `${fakeSgId}`
      };

      const stack2 = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '12345', region: 'us-east-1' }
      });
      stack2.node.setContext(missing[0].key, fakeSg);

      const sg = SecurityGroup.fromLookup(stack2, 'SG01', filter);
      // WHEN
      const sgId = sg.securityGroupId;

      // THEN
      test.deepEqual(sgId, fakeSgId);
      test.done();
    }
  }
};
