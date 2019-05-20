import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import route53 = require('../lib');

export = {
  'with default ttl'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone'
    });

    new route53.CnameRecord(stack, 'MyCname', {
      zone,
      recordName: 'www',
      recordValue: 'zzz',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: "www.myzone.",
      Type: "CNAME",
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      },
      ResourceRecords: [
        "zzz"
      ],
      TTL: "1800"
    }));
    test.done();
  },

  'with custom ttl'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone'
    });

    new route53.CnameRecord(stack, 'MyCname', {
      zone,
      recordName: 'aa',
      recordValue: 'bbb',
      ttl: 6077,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: "aa.myzone.",
      Type: "CNAME",
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      },
      ResourceRecords: [
        "bbb"
      ],
      TTL: "6077"
    }));
    test.done();
  }
};