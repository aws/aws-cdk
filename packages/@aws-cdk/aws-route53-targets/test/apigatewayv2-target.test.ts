import { expect as expectStack, haveResource } from '@aws-cdk/assert';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('targets.ApiGatewayv2Domain can be used to directly reference a domain', () => {
  // GIVEN
  const stack = new Stack();
  const domainName = 'example.com';
  const cert = new acm.Certificate(stack, 'cert', { domainName });
  const dn = new apigwv2.DomainName(stack, 'DN', {
    domainName,
    certificate: cert,
  });
  const zone = new route53.HostedZone(stack, 'zone', {
    zoneName: 'example.com',
  });

  // WHEN
  new route53.ARecord(stack, 'A', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2Domain(dn)),
  });

  // THEN
  expectStack(stack).to(haveResource('AWS::Route53::RecordSet', {
    Name: 'example.com.',
    Type: 'A',
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [
          'DNFDC76583',
          'RegionalDomainName',
        ],
      },
      HostedZoneId: {
        'Fn::GetAtt': [
          'DNFDC76583',
          'RegionalHostedZoneId',
        ],
      },
    },
    HostedZoneId: {
      Ref: 'zoneEB40FF1E',
    },
  }));
});
