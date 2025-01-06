import { Template } from '../../assertions';
import { UserPool, UserPoolDomain } from '../../aws-cognito';
import { ARecord, PublicHostedZone, RecordTarget } from '../../aws-route53';
import { Stack } from '../../core';
import { USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE } from '../../cx-api';
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

test('can get dns name without custom resource if feature flag is set', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE, true);
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
  const template = Template.fromStack(stack);

  // THEN
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': ['UserPoolDomain5479B217', 'CloudFrontDistribution'],
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
  template.resourceCountIs('AWS::Lambda::Function', 0);
  template.resourceCountIs('Custom::UserPoolCloudFrontDomainName', 0);
});
