import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('use InterfaceVpcEndpoint as record target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'InterfaceEndpoint', {
    vpc,
    service: {
      name: 'com.amazonaws.us-west-2.workspaces',
      port: 80,
    },
  });
  const zone = new route53.PrivateHostedZone(stack, 'PrivateZone', {
    vpc,
    zoneName: 'test.aws.cdk.com',
  });

  // WHEN
  new route53.ARecord(stack, 'AliasEndpointRecord', {
    zone,
    recordName: 'foo',
    target: route53.RecordTarget.fromAlias(new targets.InterfaceVpcEndpointTarget(interfaceVpcEndpoint)),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Route53::RecordSet', {
    AliasTarget: {
      HostedZoneId: {
        'Fn::Select': [
          0,
          {
            'Fn::Split': [
              ':',
              {
                'Fn::Select': [
                  0,
                  {
                    'Fn::GetAtt': [
                      'InterfaceEndpoint12DE6E71',
                      'DnsEntries',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      DNSName: {
        'Fn::Select': [
          1,
          {
            'Fn::Split': [
              ':',
              {
                'Fn::Select': [
                  0,
                  {
                    'Fn::GetAtt': [
                      'InterfaceEndpoint12DE6E71',
                      'DnsEntries',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  });
});
