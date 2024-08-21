import { Template } from '../../assertions';
import { AccountRootPrincipal, Role } from '../../aws-iam';
import { Duration, Stack } from '../../core';
import * as route53 from '../lib';

describe('cross account record set', () => {
  test('with simple values', () => {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'testzone',
    });
    const role = new Role(stack, 'Role', {
      assumedBy: new AccountRootPrincipal(),
    });

    // WHEN
    new route53.CrossAccountRecordSet(stack, 'Simple', {
      zone: zone,
      crossAccountRole: role,
      target: route53.RecordTarget.fromValues('1.2.3.4'),
      recordType: route53.RecordType.A,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountRecordSet', {
      Name: 'testzone.',
      Type: 'A',
      ResourceRecords: [{ Value: '1.2.3.4' }],
    });
  });

  test('with non-default values provided', () => {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'testzone',
    });
    const role = new Role(stack, 'Role', {
      assumedBy: new AccountRootPrincipal(),
    });
    const fakeTarget: route53.RecordTarget = {
      aliasTarget: {
        bind: (
          _record: route53.IRecordSet,
          _zone?: route53.IHostedZone,
        ): route53.AliasRecordTargetConfig => {
          return {
            dnsName: 'fakeDnsName',
            hostedZoneId: 'fakeHostedZoneId',
          };
        },
      },
    };

    // WHEN
    new route53.CrossAccountRecordSet(stack, 'Non-Default Values', {
      zone: zone,
      crossAccountRole: role,
      target: fakeTarget,
      recordType: route53.RecordType.A,
      region: 'us-east-1',
      setIdentifier: 'us-east-1',
      recordName: 'myrecord',
      ttl: Duration.minutes(5),
      deleteExisting: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountRecordSet', {
      Type: 'A',
      Region: 'us-east-1',
      SetIdentifier: 'us-east-1',
      Name: 'myrecord.testzone.',
      AliasTarget: {
        DNSName: 'fakeDnsName',
        HostedZoneId: 'fakeHostedZoneId',
        EvaluateTargetHealth: false,
      },
      TTL: 300,
      DeleteExisting: true,
    });
  });

  test('with EvaluateTargetHealth set to true', () => {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'testzone',
    });
    const role = new Role(stack, 'Role', {
      assumedBy: new AccountRootPrincipal(),
    });
    const fakeTarget: route53.RecordTarget = {
      aliasTarget: {
        bind: (
          _record: route53.IRecordSet,
          _zone?: route53.IHostedZone,
        ): route53.AliasRecordTargetConfig => {
          return {
            dnsName: 'fakeDnsName',
            hostedZoneId: 'fakeHostedZoneId',
          };
        },
      },
    };

    // WHEN
    new route53.CrossAccountRecordSet(stack, 'Non-Default Values', {
      zone: zone,
      crossAccountRole: role,
      target: fakeTarget,
      recordType: route53.RecordType.A,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountRecordSet', {
      Type: 'A',
      Name: 'testzone.',
      AliasTarget: {
        DNSName: 'fakeDnsName',
        HostedZoneId: 'fakeHostedZoneId',
      },
    });
  });
});
