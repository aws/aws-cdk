import { expect as expectStack, haveResource } from '@aws-cdk/assert';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('targets.ApiGateway can be used to the default domain of an APIGW', () => {
  // GIVEN
  const stack = new Stack();
  const cert = new acm.Certificate(stack, 'cert', { domainName: 'example.com' });
  const api = new apigw.RestApi(stack, 'api', {
    domainName: {
      domainName: 'example.com',
      certificate: cert,
    }
  });
  const zone = new route53.HostedZone(stack, 'zone', {
    zoneName: 'example.com'
  });
  api.root.addMethod('GET');

  // WHEN
  new route53.ARecord(stack, 'A', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
  });

  // THEN
  expectStack(stack).to(haveResource('AWS::Route53::RecordSet', {
    Name: 'example.com.',
    Type: 'A',
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [
          'apiCustomDomain64773C4F',
          'RegionalDomainName'
        ]
      },
      HostedZoneId: {
        'Fn::GetAtt': [
          'apiCustomDomain64773C4F',
          'RegionalHostedZoneId'
        ]
      }
    },
    HostedZoneId: {
      Ref: 'zoneEB40FF1E'
    }
  }));
});

test('targets.ApiGatewayDomain can be used to directly reference a domain', () => {
  // GIVEN
  const stack = new Stack();
  const cert = new acm.Certificate(stack, 'cert', { domainName: 'example.com' });
  const domain = new apigw.DomainName(stack, 'domain', { domainName: 'example.com', certificate: cert });
  const zone = new route53.HostedZone(stack, 'zone', {
    zoneName: 'example.com'
  });

  // WHEN
  new route53.ARecord(stack, 'A', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ApiGatewayDomain(domain))
  });

  // THEN
  expectStack(stack).to(haveResource('AWS::Route53::RecordSet', {
    Name: 'example.com.',
    Type: 'A',
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [
          'domainFBFFA2F6',
          'RegionalDomainName'
        ]
      },
      HostedZoneId: {
        'Fn::GetAtt': [
          'domainFBFFA2F6',
          'RegionalHostedZoneId'
        ]
      }
    },
    HostedZoneId: {
      Ref: 'zoneEB40FF1E'
    }
  }));
});

test('fails if an ApiGateway is used with an API that does not define a domain name', () => {
  // GIVEN
  const stack = new Stack();
  const api = new apigw.RestApi(stack, 'api');
  const zone = new route53.HostedZone(stack, 'zone', {
    zoneName: 'example.com'
  });
  api.root.addMethod('GET');

  // THEN
  expect(() => {
    new route53.ARecord(stack, 'A', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
    });
  }).toThrow(/API does not define a default domain name/);
});
