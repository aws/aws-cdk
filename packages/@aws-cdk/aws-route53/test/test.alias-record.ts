import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { AliasRecord, IAliasRecordTarget, PublicHostedZone } from '../lib';

export = {
  'test alias record'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

    const target: IAliasRecordTarget = {
      bind: () => {
        return {
          hostedZoneId: 'Z2P70J7EXAMPLE',
          dnsName: 'foo.example.com'
        };
      }
    };

    // WHEN
    new AliasRecord(zone, 'Alias', {
      zone,
      recordName: '_foo',
      target
    });

    // THEN - stack contains a record set
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: '_foo.test.public.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866'
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      }
    }));

    test.done();
  },
  'test alias record on zone root'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

    const target: IAliasRecordTarget = {
      bind: () => {
        return {
          hostedZoneId: 'Z2P70J7EXAMPLE',
          dnsName: 'foo.example.com'
        };
      }
    };

    // WHEN
    new AliasRecord(zone, 'Alias', {
      zone,
      recordName: 'test.public',
      target
    });

    // THEN - stack contains a record set
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'test.public.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866'
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      }
    }));

    test.done();
  }
};
