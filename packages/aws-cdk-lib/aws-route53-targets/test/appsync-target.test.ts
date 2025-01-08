import { join } from 'path';
import { Template } from '../../assertions';
import * as appsync from '../../aws-appsync';
import * as acm from '../../aws-certificatemanager';
import * as route53 from '../../aws-route53';
import { Stack } from '../../core';
import * as targets from '../lib';

test('targets.AppSyncTarget can be used to the default domain of an AppSync GraphqlApi', () => {
  // GIVEN
  const stack = new Stack();
  const cert = new acm.Certificate(stack, 'cert', { domainName: 'example.com' });
  const api = new appsync.GraphqlApi(stack, 'api', {
    definition: appsync.Definition.fromFile(join(__dirname, '..', '..', 'aws-appsync', 'test', 'appsync.test.graphql')),
    domainName: {
      domainName: 'example.com',
      certificate: cert,
    },
    name: 'api',
  });
  const zone = new route53.HostedZone(stack, 'zone', {
    zoneName: 'example.com',
  });

  // WHEN
  new route53.ARecord(stack, 'A', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.AppSyncTarget(api)),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'example.com.',
    Type: 'A',
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [
          'apiDomainNameBBFE36A4',
          'AppSyncDomainName',
        ],
      },
      HostedZoneId: {
        'Fn::FindInMap': [
          'AWSCloudFrontPartitionHostedZoneIdMap',
          { Ref: 'AWS::Partition' },
          'zoneId',
        ],
      },
    },
    HostedZoneId: {
      Ref: 'zoneEB40FF1E',
    },
  });
});
