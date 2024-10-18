import { Template } from '../../assertions';
import * as route53 from '../../aws-route53';
import { Stack } from '../../core';
import * as targets from '../lib';

test('use EBS environment as record target', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(
      new targets.ElasticBeanstalkEnvironmentEndpointTarget('mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com'),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 'mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com',
      HostedZoneId: 'Z117KPS5GTRQ2G',
    },
  });
});

test('support 4-levels subdomain URLs for EBS environments', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget('mycustomcnameprefix.us-east-1.elasticbeanstalk.com')),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 'mycustomcnameprefix.us-east-1.elasticbeanstalk.com',
      HostedZoneId: 'Z117KPS5GTRQ2G',
    },
  });
});

test('use EBS environment as record target with health check', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(
      new targets.ElasticBeanstalkEnvironmentEndpointTarget('mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com', {
        evaluateTargetHealth: true,
      }),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      EvaluateTargetHealth: true,
    },
  });
});
