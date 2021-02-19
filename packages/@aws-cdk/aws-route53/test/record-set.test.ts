import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { Duration, Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as route53 from '../lib';

nodeunitShim({
  'with default ttl'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.RecordSet(stack, 'Basic', {
      zone,
      recordName: 'www',
      recordType: route53.RecordType.CNAME,
      target: route53.RecordTarget.fromValues('zzz'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'zzz',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'with custom ttl'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.RecordSet(stack, 'Basic', {
      zone,
      recordName: 'aa',
      recordType: route53.RecordType.CNAME,
      target: route53.RecordTarget.fromValues('bbb'),
      ttl: Duration.seconds(6077),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'aa.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'bbb',
      ],
      TTL: '6077',
    }));
    test.done();
  },

  'defaults to zone root'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.RecordSet(stack, 'Basic', {
      zone,
      recordType: route53.RecordType.A,
      target: route53.RecordTarget.fromValues('1.2.3.4'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      Type: 'A',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '1.2.3.4',
      ],
    }));
    test.done();
  },

  'A record with ip addresses'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.ARecord(stack, 'A', {
      zone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'A',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '1.2.3.4',
        '5.6.7.8',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'A record with alias'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    const target: route53.IAliasRecordTarget = {
      bind: () => {
        return {
          hostedZoneId: 'Z2P70J7EXAMPLE',
          dnsName: 'foo.example.com',
        };
      },
    };

    // WHEN
    new route53.ARecord(zone, 'Alias', {
      zone,
      recordName: '_foo',
      target: route53.RecordTarget.fromAlias(target),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: '_foo.myzone.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      },
    }));

    test.done();
  },

  'AAAA record with ip addresses'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.AaaaRecord(stack, 'AAAA', {
      zone,
      recordName: 'www',
      target: route53.RecordTarget.fromIpAddresses('2001:0db8:85a3:0000:0000:8a2e:0370:7334'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'AAAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'AAAA record with alias on zone root'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    const target: route53.IAliasRecordTarget = {
      bind: () => {
        return {
          hostedZoneId: 'Z2P70J7EXAMPLE',
          dnsName: 'foo.example.com',
        };
      },
    };

    // WHEN
    new route53.AaaaRecord(zone, 'Alias', {
      zone,
      target: route53.RecordTarget.fromAlias(target),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'AAAA',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      },
    }));

    test.done();
  },

  'CNAME record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.CnameRecord(stack, 'CNAME', {
      zone,
      recordName: 'www',
      domainName: 'hello',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'hello',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'TXT record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.TxtRecord(stack, 'TXT', {
      zone,
      recordName: 'www',
      values: ['should be enclosed with double quotes'],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'TXT',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '"should be enclosed with double quotes"',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'TXT record with value longer than 255 chars'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.TxtRecord(stack, 'TXT', {
      zone,
      recordName: 'www',
      values: ['hello'.repeat(52)],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'TXT',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '"hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello""hello"',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'SRV record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.SrvRecord(stack, 'SRV', {
      zone,
      recordName: 'www',
      values: [{
        hostName: 'aws.com',
        port: 8080,
        priority: 10,
        weight: 5,
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'SRV',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '10 5 8080 aws.com',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'CAA record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.CaaRecord(stack, 'CAA', {
      zone,
      recordName: 'www',
      values: [{
        flag: 0,
        tag: route53.CaaTag.ISSUE,
        value: 'ssl.com',
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "ssl.com"',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'CAA Amazon record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.CaaAmazonRecord(stack, 'CAAAmazon', {
      zone,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'CAA Amazon record with record name'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.CaaAmazonRecord(stack, 'CAAAmazon', {
      zone,
      recordName: 'www',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'MX record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.MxRecord(stack, 'MX', {
      zone,
      recordName: 'mail',
      values: [{
        hostName: 'workmail.aws',
        priority: 10,
      }],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'mail.myzone.',
      Type: 'MX',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '10 workmail.aws',
      ],
      TTL: '1800',
    }));
    test.done();
  },

  'Zone delegation record'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.ZoneDelegationRecord(stack, 'NS', {
      zone,
      recordName: 'foo',
      nameServers: ['ns-1777.awsdns-30.co.uk'],
    });

    // THEN
    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'foo.myzone.',
      Type: 'NS',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'ns-1777.awsdns-30.co.uk.',
      ],
      TTL: '172800',
    }));
    test.done();
  },

  'Cross account zone delegation record'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const parentZone = new route53.PublicHostedZone(stack, 'ParentHostedZone', {
      zoneName: 'myzone.com',
      crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('123456789012'),
    });

    // WHEN
    const childZone = new route53.PublicHostedZone(stack, 'ChildHostedZone', {
      zoneName: 'sub.myzone.com',
    });
    new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation', {
      delegatedZone: childZone,
      parentHostedZoneId: parentZone.hostedZoneId,
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });

    // THEN
    expect(stack).to(haveResource('Custom::CrossAccountZoneDelegation', {
      ServiceToken: {
        'Fn::GetAtt': [
          'CustomCrossAccountZoneDelegationCustomResourceProviderHandler44A84265',
          'Arn',
        ],
      },
      AssumeRoleArn: {
        'Fn::GetAtt': [
          'ParentHostedZoneCrossAccountZoneDelegationRole95B1C36E',
          'Arn',
        ],
      },
      ParentZoneId: {
        Ref: 'ParentHostedZoneC2BD86E1',
      },
      DelegatedZoneName: 'sub.myzone.com',
      DelegatedZoneNameServers: {
        'Fn::GetAtt': [
          'ChildHostedZone4B14AC71',
          'NameServers',
        ],
      },
      TTL: 60,
    }));
    test.done();
  },
});
