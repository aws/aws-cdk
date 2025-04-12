import { Template } from '../../assertions';
import * as elasticbeanstalk from '../../aws-elasticbeanstalk';
import * as route53 from '../../aws-route53';
import { App, Stack } from '../../core';
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

test('EBS environment endpoint token can be referenced if stack region is specified', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: {
      region: 'us-west-2',
    },
  });
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  const ebsEnv = new elasticbeanstalk.CfnEnvironment(stack, 'Environment', {
    applicationName: 'test',
  });

  // WHEN
  new route53.ARecord(stack, 'Alias', {
    zone,
    target: route53.RecordTarget.fromAlias(
      new targets.ElasticBeanstalkEnvironmentEndpointTarget(ebsEnv.attrEndpointUrl),
    ),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': ['Environment', 'EndpointURL'],
      },
      HostedZoneId: 'Z38NKT9BP95V3O',
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
