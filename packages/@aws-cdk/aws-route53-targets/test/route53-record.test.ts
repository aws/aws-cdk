import { Template } from '@aws-cdk/assertions';
import { ARecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import { Route53RecordTarget } from '../lib';

test('use another route 53 record as record target', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
  const record = new ARecord(zone, 'Record', {
    zone,
    target: RecordTarget.fromIpAddresses('1.2.3.4'),
  });

  // WHEN
  new ARecord(zone, 'Alias', {
    zone,
    target: RecordTarget.fromAlias(new Route53RecordTarget(record)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        Ref: 'HostedZoneRecordB6AB510D',
      },
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    },
  });
});
