import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Duration, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as route53 from '../lib';

describe('record set', () => {
  test('with default ttl', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'zzz',
      ],
      TTL: '1800',
    });
  });

  test('with custom ttl', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'aa.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'bbb',
      ],
      TTL: '6077',
    });
  });

  test('with ttl of 0', () => {
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
      ttl: Duration.seconds(0),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      TTL: '0',
    });
  });

  test('defaults to zone root', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      Type: 'A',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '1.2.3.4',
      ],
    });
  });

  test('A record with ip addresses', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
    });
  });

  test('A record with alias', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: '_foo.myzone.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      },
    });
  });

  test('AAAA record with ip addresses', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'AAAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      ],
      TTL: '1800',
    });
  });

  test('AAAA record with alias on zone root', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      Type: 'AAAA',
      AliasTarget: {
        HostedZoneId: 'Z2P70J7EXAMPLE',
        DNSName: 'foo.example.com',
      },
    });
  });

  test('CNAME record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CNAME',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'hello',
      ],
      TTL: '1800',
    });
  });

  test('TXT record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'TXT',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '"should be enclosed with double quotes"',
      ],
      TTL: '1800',
    });
  });

  test('TXT record with value longer than 255 chars', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'TXT',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '"hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello""hello"',
      ],
      TTL: '1800',
    });
  });

  test('SRV record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'SRV',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '10 5 8080 aws.com',
      ],
      TTL: '1800',
    });
  });

  test('CAA record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "ssl.com"',
      ],
      TTL: '1800',
    });
  });

  test('CAA Amazon record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
      TTL: '1800',
    });
  });

  test('CAA Amazon record with record name', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'CAA',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '0 issue "amazon.com"',
      ],
      TTL: '1800',
    });
  });

  test('MX record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'mail.myzone.',
      Type: 'MX',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '10 workmail.aws',
      ],
      TTL: '1800',
    });
  });

  test('NS record', () => {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.NsRecord(stack, 'NS', {
      zone,
      recordName: 'www',
      values: ['ns-1.awsdns.co.uk.', 'ns-2.awsdns.com.'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'NS',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'ns-1.awsdns.co.uk.',
        'ns-2.awsdns.com.',
      ],
      TTL: '1800',
    });
  });

  test('DS record', () => {
    // GIVEN
    const stack = new Stack();

    const zone = new route53.HostedZone(stack, 'HostedZone', {
      zoneName: 'myzone',
    });

    // WHEN
    new route53.DsRecord(stack, 'DS', {
      zone,
      recordName: 'www',
      values: ['12345 3 1 123456789abcdef67890123456789abcdef67890'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.myzone.',
      Type: 'DS',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        '12345 3 1 123456789abcdef67890123456789abcdef67890',
      ],
      TTL: '1800',
    });
  });

  test('Zone delegation record', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'foo.myzone.',
      Type: 'NS',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      ResourceRecords: [
        'ns-1777.awsdns-30.co.uk.',
      ],
      TTL: '172800',
    });
  });

  testDeprecated('Cross account zone delegation record with parentHostedZoneId', () => {
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
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
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
    });
    Template.fromStack(stack).hasResource('Custom::CrossAccountZoneDelegation', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  testDeprecated('Cross account zone delegation record with parentHostedZoneName', () => {
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
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
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
      ParentZoneName: 'myzone.com',
      DelegatedZoneName: 'sub.myzone.com',
      DelegatedZoneNameServers: {
        'Fn::GetAtt': [
          'ChildHostedZone4B14AC71',
          'NameServers',
        ],
      },
      TTL: 60,
    });
  });

  testDeprecated('Cross account zone delegation record throws when parent id and name both/nither are supplied', () => {
    // GIVEN
    const stack = new Stack();
    const parentZone = new route53.PublicHostedZone(stack, 'ParentHostedZone', {
      zoneName: 'myzone.com',
      crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('123456789012'),
    });

    // THEN
    const childZone = new route53.PublicHostedZone(stack, 'ChildHostedZone', {
      zoneName: 'sub.myzone.com',
    });

    expect(() => {
      new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation1', {
        delegatedZone: childZone,
        delegationRole: parentZone.crossAccountZoneDelegationRole!,
        ttl: Duration.seconds(60),
      });
    }).toThrow(/At least one of parentHostedZoneName or parentHostedZoneId is required/);

    expect(() => {
      new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
        delegatedZone: childZone,
        parentHostedZoneId: parentZone.hostedZoneId,
        parentHostedZoneName: parentZone.zoneName,
        delegationRole: parentZone.crossAccountZoneDelegationRole!,
        ttl: Duration.seconds(60),
      });
    }).toThrow(/Only one of parentHostedZoneName and parentHostedZoneId is supported/);
  });

  testDeprecated('Multiple cross account zone delegation records', () => {
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
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });
    const childZone2 = new route53.PublicHostedZone(stack, 'ChildHostedZone2', {
      zoneName: 'anothersub.myzone.com',
    });
    new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
      delegatedZone: childZone2,
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });

    // THEN
    const childHostedZones = [
      { name: 'sub.myzone.com', id: 'ChildHostedZone4B14AC71', dependsOn: 'DelegationcrossaccountzonedelegationhandlerrolePolicy1E157602' },
      { name: 'anothersub.myzone.com', id: 'ChildHostedZone2A37198F0', dependsOn: 'Delegation2crossaccountzonedelegationhandlerrolePolicy713BEAC3' },
    ];

    for (var childHostedZone of childHostedZones) {
      Template.fromStack(stack).hasResource('Custom::CrossAccountZoneDelegation', {
        Properties: {
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
          ParentZoneName: 'myzone.com',
          DelegatedZoneName: childHostedZone.name,
          DelegatedZoneNameServers: {
            'Fn::GetAtt': [
              childHostedZone.id,
              'NameServers',
            ],
          },
          TTL: 60,
        },
        DependsOn: [
          childHostedZone.dependsOn,
        ],
      });
    }
  });

  testDeprecated('Cross account zone delegation policies', () => {
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
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });
    const childZone2 = new route53.PublicHostedZone(stack, 'ChildHostedZone2', {
      zoneName: 'anothersub.myzone.com',
    });
    new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
      delegatedZone: childZone2,
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });

    // THEN
    const policyNames = [
      'DelegationcrossaccountzonedelegationhandlerrolePolicy1E157602',
      'Delegation2crossaccountzonedelegationhandlerrolePolicy713BEAC3',
    ];

    for (var policyName of policyNames) {
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: policyName,
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'ParentHostedZoneCrossAccountZoneDelegationRole95B1C36E',
                  'Arn',
                ],
              },
            },
          ],
        },
        Roles: [
          {
            'Fn::Select': [1, {
              'Fn::Split': ['/', {
                'Fn::Select': [5, {
                  'Fn::Split': [':', {
                    'Fn::GetAtt': [
                      'CustomCrossAccountZoneDelegationCustomResourceProviderRoleED64687B',
                      'Arn',
                    ],
                  }],
                }],
              }],
            }],
          },
        ],
      });
    }
  });

  testDeprecated('Cross account zone context flag', () => {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext('@aws-cdk/aws-route53:useRegionalStsEndpoint', true);
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
      parentHostedZoneName: 'myzone.com',
      delegationRole: parentZone.crossAccountZoneDelegationRole!,
      ttl: Duration.seconds(60),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
      UseRegionalStsEndpoint: 'true',
    });
  });

  test('Delete existing record', () => {
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
      deleteExisting: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::DeleteExistingRecordSet', {
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
      RecordName: 'www.myzone.',
      RecordType: 'A',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: 'route53:GetChange',
                Resource: '*',
              },
              {
                Effect: 'Allow',
                Action: 'route53:ListResourceRecordSets',
                Resource: {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':route53:::hostedzone/',
                    { Ref: 'HostedZoneDB99F866' },
                  ]],
                },
              },
              {
                Effect: 'Allow',
                Action: 'route53:ChangeResourceRecordSets',
                Resource: {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':route53:::hostedzone/',
                    { Ref: 'HostedZoneDB99F866' },
                  ]],
                },
                Condition: {
                  'ForAllValues:StringEquals': {
                    'route53:ChangeResourceRecordSetsRecordTypes': ['A'],
                    'route53:ChangeResourceRecordSetsActions': ['DELETE'],
                  },
                },
              },
            ],
          },
        },
      ],
    });
  });
});
