import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');

export = {
  'Enable proxy protocol v2 attribute for target group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      proxyProtocolV2: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'true'
        }
      ]
    }));

    test.done();
  },

  'Disable proxy protocol v2 for attribute target group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      proxyProtocolV2: false
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'false'
        }
      ]
    }));

    test.done();
  },
};
