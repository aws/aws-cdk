import { Template } from '@aws-cdk/assertions';
import * as globalaccelerator from '@aws-cdk/aws-globalaccelerator';
import * as route53 from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('GlobalAcceleratorTarget exposes a public constant of the zone id', () => {
  expect(targets.GlobalAcceleratorTarget.GLOBAL_ACCELERATOR_ZONE_ID).toStrictEqual('Z2BJ6XQ5FK7U4H');
  expect(targets.GlobalAcceleratorDomainTarget.GLOBAL_ACCELERATOR_ZONE_ID).toStrictEqual('Z2BJ6XQ5FK7U4H');
});

test('GlobalAcceleratorTarget creates an alias resource with a string domain name', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'GlobalAcceleratorAlias', {
    target: route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorDomainTarget('xyz.awsglobalaccelerator.com')),
    recordName: 'test',
    zone,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: 'xyz.awsglobalaccelerator.com',
      HostedZoneId: 'Z2BJ6XQ5FK7U4H',
    },
  });
});

test('GlobalAcceleratorTarget creates an alias resource with a Global Accelerator reference domain name', () => {
  // GIVEN
  const stack = new Stack();
  const accelerator = new globalaccelerator.Accelerator(stack, 'Accelerator');
  const logicalId = stack.getLogicalId(<globalaccelerator.CfnAccelerator>accelerator.node.defaultChild);
  const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

  // WHEN
  new route53.ARecord(stack, 'GlobalAcceleratorAlias', {
    target: route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorTarget(accelerator)),
    recordName: 'test',
    zone,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [
          logicalId,
          'DnsName',
        ],
      },
      HostedZoneId: 'Z2BJ6XQ5FK7U4H',
    },
  });
});