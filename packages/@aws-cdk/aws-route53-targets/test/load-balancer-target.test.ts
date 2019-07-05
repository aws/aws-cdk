import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import route53 = require('@aws-cdk/aws-route53');
import { Stack } from '@aws-cdk/core';
import targets = require('../lib');

test('use ALB as record target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2
  });
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true
  });

  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.AddressRecordTarget.fromAlias(new targets.LoadBalancerTarget(lb))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: { "Fn::GetAtt": [ "LB8A12904C", "DNSName" ] },
      HostedZoneId: { "Fn::GetAtt": [ "LB8A12904C", "CanonicalHostedZoneID" ] }
    },
  });
});
