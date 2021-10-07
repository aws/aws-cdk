import '@aws-cdk/assert-internal/jest';
import * as route53 from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('use EBS environment as record target', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget('mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com')),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 'mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com',
      HostedZoneId: 'Z117KPS5GTRQ2G',
    },
  });
});
