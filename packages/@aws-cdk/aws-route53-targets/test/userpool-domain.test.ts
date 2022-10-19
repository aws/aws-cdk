import { Template } from '@aws-cdk/assertions';
import { UserPool, UserPoolDomain } from '@aws-cdk/aws-cognito';
import { ARecord, PublicHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { Stack } from '@aws-cdk/core';
import { UserPoolDomainTarget } from '../lib';

test('use user pool domain as record target', () => {
  // GIVEN
  const stack = new Stack();
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
  const userPool = new UserPool(stack, 'UserPool');
  const domain = new UserPoolDomain(stack, 'UserPoolDomain', {
    userPool,
    cognitoDomain: { domainPrefix: 'domain-prefix' },
  });

  // WHEN
  new ARecord(zone, 'Alias', {
    zone,
    target: RecordTarget.fromAlias(new UserPoolDomainTarget(domain)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': ['UserPoolDomainCloudFrontDomainName0B254952', 'DomainDescription.CloudFrontDistribution'],
      },
      HostedZoneId: {
        'Fn::FindInMap': [
          'AWSCloudFrontPartitionHostedZoneIdMap',
          {
            Ref: 'AWS::Partition',
          },
          'zoneId',
        ],
      },
    },
  });
});
