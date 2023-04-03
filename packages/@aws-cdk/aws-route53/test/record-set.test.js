"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const route53 = require("../lib");
describe('record set', () => {
    test('with default ttl', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        // WHEN
        new route53.RecordSet(stack, 'Basic', {
            zone,
            recordName: 'aa',
            recordType: route53.RecordType.CNAME,
            target: route53.RecordTarget.fromValues('bbb'),
            ttl: core_1.Duration.seconds(6077),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        // WHEN
        new route53.RecordSet(stack, 'Basic', {
            zone,
            recordName: 'aa',
            recordType: route53.RecordType.CNAME,
            target: route53.RecordTarget.fromValues('bbb'),
            ttl: core_1.Duration.seconds(0),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
            TTL: '0',
        });
    });
    test('defaults to zone root', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        const target = {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        const target = {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        // WHEN
        new route53.CaaAmazonRecord(stack, 'CAAAmazon', {
            zone,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
        const zone = new route53.HostedZone(stack, 'HostedZone', {
            zoneName: 'myzone',
        });
        // WHEN
        new route53.CaaAmazonRecord(stack, 'CAAAmazon', {
            zone,
            recordName: 'www',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
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
    cdk_build_tools_1.testDeprecated('Cross account zone delegation record with parentHostedZoneId', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
            removalPolicy: core_1.RemovalPolicy.RETAIN,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
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
        assertions_1.Template.fromStack(stack).hasResource('Custom::CrossAccountZoneDelegation', {
            DeletionPolicy: 'Retain',
            UpdateReplacePolicy: 'Retain',
        });
    });
    cdk_build_tools_1.testDeprecated('Cross account zone delegation record with parentHostedZoneName', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
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
    cdk_build_tools_1.testDeprecated('Cross account zone delegation record throws when parent id and name both/nither are supplied', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
                delegationRole: parentZone.crossAccountZoneDelegationRole,
                ttl: core_1.Duration.seconds(60),
            });
        }).toThrow(/At least one of parentHostedZoneName or parentHostedZoneId is required/);
        expect(() => {
            new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
                delegatedZone: childZone,
                parentHostedZoneId: parentZone.hostedZoneId,
                parentHostedZoneName: parentZone.zoneName,
                delegationRole: parentZone.crossAccountZoneDelegationRole,
                ttl: core_1.Duration.seconds(60),
            });
        }).toThrow(/Only one of parentHostedZoneName and parentHostedZoneId is supported/);
    });
    cdk_build_tools_1.testDeprecated('Multiple cross account zone delegation records', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        const childZone2 = new route53.PublicHostedZone(stack, 'ChildHostedZone2', {
            zoneName: 'anothersub.myzone.com',
        });
        new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
            delegatedZone: childZone2,
            parentHostedZoneName: 'myzone.com',
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        // THEN
        const childHostedZones = [
            { name: 'sub.myzone.com', id: 'ChildHostedZone4B14AC71', dependsOn: 'DelegationcrossaccountzonedelegationhandlerrolePolicy1E157602' },
            { name: 'anothersub.myzone.com', id: 'ChildHostedZone2A37198F0', dependsOn: 'Delegation2crossaccountzonedelegationhandlerrolePolicy713BEAC3' },
        ];
        for (var childHostedZone of childHostedZones) {
            assertions_1.Template.fromStack(stack).hasResource('Custom::CrossAccountZoneDelegation', {
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
    cdk_build_tools_1.testDeprecated('Cross account zone delegation policies', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        const childZone2 = new route53.PublicHostedZone(stack, 'ChildHostedZone2', {
            zoneName: 'anothersub.myzone.com',
        });
        new route53.CrossAccountZoneDelegationRecord(stack, 'Delegation2', {
            delegatedZone: childZone2,
            parentHostedZoneName: 'myzone.com',
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        // THEN
        const policyNames = [
            'DelegationcrossaccountzonedelegationhandlerrolePolicy1E157602',
            'Delegation2crossaccountzonedelegationhandlerrolePolicy713BEAC3',
        ];
        for (var policyName of policyNames) {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    cdk_build_tools_1.testDeprecated('Cross account zone context flag', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
            delegationRole: parentZone.crossAccountZoneDelegationRole,
            ttl: core_1.Duration.seconds(60),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::CrossAccountZoneDelegation', {
            UseRegionalStsEndpoint: 'true',
        });
    });
    test('Delete existing record', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::DeleteExistingRecordSet', {
            HostedZoneId: {
                Ref: 'HostedZoneDB99F866',
            },
            RecordName: 'www.myzone.',
            RecordType: 'A',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXNldC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVjb3JkLXNldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQsd0NBQStEO0FBQy9ELGtDQUFrQztBQUVsQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQzVCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3ZELFFBQVEsRUFBRSxRQUFRO1NBQ25CLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNwQyxJQUFJO1lBQ0osVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSztZQUNwQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxJQUFJLEVBQUUsYUFBYTtZQUNuQixJQUFJLEVBQUUsT0FBTztZQUNiLFlBQVksRUFBRTtnQkFDWixHQUFHLEVBQUUsb0JBQW9CO2FBQzFCO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLEtBQUs7YUFDTjtZQUNELEdBQUcsRUFBRSxNQUFNO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNC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LEdBQUcsRUFBRSxvQkFBb0IsRUFBRTt5Q0FDOUIsQ0FBQztpQ0FDSDs2QkFDRjs0QkFDRDtnQ0FDRSxNQUFNLEVBQUUsT0FBTztnQ0FDZixNQUFNLEVBQUUsa0NBQWtDO2dDQUMxQyxRQUFRLEVBQUU7b0NBQ1IsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFOzRDQUNmLE1BQU07NENBQ04sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7NENBQ3pCLHdCQUF3Qjs0Q0FDeEIsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7eUNBQzlCLENBQUM7aUNBQ0g7Z0NBQ0QsU0FBUyxFQUFFO29DQUNULDJCQUEyQixFQUFFO3dDQUMzQiw2Q0FBNkMsRUFBRSxDQUFDLEdBQUcsQ0FBQzt3Q0FDcEQseUNBQXlDLEVBQUUsQ0FBQyxRQUFRLENBQUM7cUNBQ3REO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IER1cmF0aW9uLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgncmVjb3JkIHNldCcsICgpID0+IHtcbiAgdGVzdCgnd2l0aCBkZWZhdWx0IHR0bCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHJvdXRlNTMuUmVjb3JkU2V0KHN0YWNrLCAnQmFzaWMnLCB7XG4gICAgICB6b25lLFxuICAgICAgcmVjb3JkTmFtZTogJ3d3dycsXG4gICAgICByZWNvcmRUeXBlOiByb3V0ZTUzLlJlY29yZFR5cGUuQ05BTUUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21WYWx1ZXMoJ3p6eicpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICd3d3cubXl6b25lLicsXG4gICAgICBUeXBlOiAnQ05BTUUnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICd6enonLFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGN1c3RvbSB0dGwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLlJlY29yZFNldChzdGFjaywgJ0Jhc2ljJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICdhYScsXG4gICAgICByZWNvcmRUeXBlOiByb3V0ZTUzLlJlY29yZFR5cGUuQ05BTUUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21WYWx1ZXMoJ2JiYicpLFxuICAgICAgdHRsOiBEdXJhdGlvbi5zZWNvbmRzKDYwNzcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICdhYS5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdDTkFNRScsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJ2JiYicsXG4gICAgICBdLFxuICAgICAgVFRMOiAnNjA3NycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggdHRsIG9mIDAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLlJlY29yZFNldChzdGFjaywgJ0Jhc2ljJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICdhYScsXG4gICAgICByZWNvcmRUeXBlOiByb3V0ZTUzLlJlY29yZFR5cGUuQ05BTUUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21WYWx1ZXMoJ2JiYicpLFxuICAgICAgdHRsOiBEdXJhdGlvbi5zZWNvbmRzKDApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIFRUTDogJzAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0cyB0byB6b25lIHJvb3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLlJlY29yZFNldChzdGFjaywgJ0Jhc2ljJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZFR5cGU6IHJvdXRlNTMuUmVjb3JkVHlwZS5BLFxuICAgICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tVmFsdWVzKCcxLjIuMy40JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ215em9uZS4nLFxuICAgICAgVHlwZTogJ0EnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICcxLjIuMy40JyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0EgcmVjb3JkIHdpdGggaXAgYWRkcmVzc2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgcm91dGU1My5BUmVjb3JkKHN0YWNrLCAnQScsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnd3d3JyxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUlwQWRkcmVzc2VzKCcxLjIuMy40JywgJzUuNi43LjgnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgICBOYW1lOiAnd3d3Lm15em9uZS4nLFxuICAgICAgVHlwZTogJ0EnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICcxLjIuMy40JyxcbiAgICAgICAgJzUuNi43LjgnLFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdBIHJlY29yZCB3aXRoIGFsaWFzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRhcmdldDogcm91dGU1My5JQWxpYXNSZWNvcmRUYXJnZXQgPSB7XG4gICAgICBiaW5kOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaG9zdGVkWm9uZUlkOiAnWjJQNzBKN0VYQU1QTEUnLFxuICAgICAgICAgIGRuc05hbWU6ICdmb28uZXhhbXBsZS5jb20nLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQoem9uZSwgJ0FsaWFzJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICdfZm9vJyxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKHRhcmdldCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ19mb28ubXl6b25lLicsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBUeXBlOiAnQScsXG4gICAgICBBbGlhc1RhcmdldDoge1xuICAgICAgICBIb3N0ZWRab25lSWQ6ICdaMlA3MEo3RVhBTVBMRScsXG4gICAgICAgIEROU05hbWU6ICdmb28uZXhhbXBsZS5jb20nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQUFBQSByZWNvcmQgd2l0aCBpcCBhZGRyZXNzZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLkFhYWFSZWNvcmQoc3RhY2ssICdBQUFBJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICd3d3cnLFxuICAgICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tSXBBZGRyZXNzZXMoJzIwMDE6MGRiODo4NWEzOjAwMDA6MDAwMDo4YTJlOjAzNzA6NzMzNCcpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICd3d3cubXl6b25lLicsXG4gICAgICBUeXBlOiAnQUFBQScsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJzIwMDE6MGRiODo4NWEzOjAwMDA6MDAwMDo4YTJlOjAzNzA6NzMzNCcsXG4gICAgICBdLFxuICAgICAgVFRMOiAnMTgwMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FBQUEgcmVjb3JkIHdpdGggYWxpYXMgb24gem9uZSByb290JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZScsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YXJnZXQ6IHJvdXRlNTMuSUFsaWFzUmVjb3JkVGFyZ2V0ID0ge1xuICAgICAgYmluZDogKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhvc3RlZFpvbmVJZDogJ1oyUDcwSjdFWEFNUExFJyxcbiAgICAgICAgICBkbnNOYW1lOiAnZm9vLmV4YW1wbGUuY29tJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgcm91dGU1My5BYWFhUmVjb3JkKHpvbmUsICdBbGlhcycsIHtcbiAgICAgIHpvbmUsXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyh0YXJnZXQpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICdteXpvbmUuJyxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgfSxcbiAgICAgIFR5cGU6ICdBQUFBJyxcbiAgICAgIEFsaWFzVGFyZ2V0OiB7XG4gICAgICAgIEhvc3RlZFpvbmVJZDogJ1oyUDcwSjdFWEFNUExFJyxcbiAgICAgICAgRE5TTmFtZTogJ2Zvby5leGFtcGxlLmNvbScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDTkFNRSByZWNvcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLkNuYW1lUmVjb3JkKHN0YWNrLCAnQ05BTUUnLCB7XG4gICAgICB6b25lLFxuICAgICAgcmVjb3JkTmFtZTogJ3d3dycsXG4gICAgICBkb21haW5OYW1lOiAnaGVsbG8nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICd3d3cubXl6b25lLicsXG4gICAgICBUeXBlOiAnQ05BTUUnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICdoZWxsbycsXG4gICAgICBdLFxuICAgICAgVFRMOiAnMTgwMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1RYVCByZWNvcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLlR4dFJlY29yZChzdGFjaywgJ1RYVCcsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnd3d3JyxcbiAgICAgIHZhbHVlczogWydzaG91bGQgYmUgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGVzJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ3d3dy5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdUWFQnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICdcInNob3VsZCBiZSBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZXNcIicsXG4gICAgICBdLFxuICAgICAgVFRMOiAnMTgwMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1RYVCByZWNvcmQgd2l0aCB2YWx1ZSBsb25nZXIgdGhhbiAyNTUgY2hhcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLlR4dFJlY29yZChzdGFjaywgJ1RYVCcsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnd3d3JyxcbiAgICAgIHZhbHVlczogWydoZWxsbycucmVwZWF0KDUyKV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ3d3dy5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdUWFQnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VSZWNvcmRzOiBbXG4gICAgICAgICdcImhlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb2hlbGxvaGVsbG9oZWxsb1wiXCJoZWxsb1wiJyxcbiAgICAgIF0sXG4gICAgICBUVEw6ICcxODAwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU1JWIHJlY29yZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHJvdXRlNTMuU3J2UmVjb3JkKHN0YWNrLCAnU1JWJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICd3d3cnLFxuICAgICAgdmFsdWVzOiBbe1xuICAgICAgICBob3N0TmFtZTogJ2F3cy5jb20nLFxuICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICBwcmlvcml0eTogMTAsXG4gICAgICAgIHdlaWdodDogNSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICd3d3cubXl6b25lLicsXG4gICAgICBUeXBlOiAnU1JWJyxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlUmVjb3JkczogW1xuICAgICAgICAnMTAgNSA4MDgwIGF3cy5jb20nLFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDQUEgcmVjb3JkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgcm91dGU1My5DYWFSZWNvcmQoc3RhY2ssICdDQUEnLCB7XG4gICAgICB6b25lLFxuICAgICAgcmVjb3JkTmFtZTogJ3d3dycsXG4gICAgICB2YWx1ZXM6IFt7XG4gICAgICAgIGZsYWc6IDAsXG4gICAgICAgIHRhZzogcm91dGU1My5DYWFUYWcuSVNTVUUsXG4gICAgICAgIHZhbHVlOiAnc3NsLmNvbScsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgICBOYW1lOiAnd3d3Lm15em9uZS4nLFxuICAgICAgVHlwZTogJ0NBQScsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJzAgaXNzdWUgXCJzc2wuY29tXCInLFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDQUEgQW1hem9uIHJlY29yZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHJvdXRlNTMuQ2FhQW1hem9uUmVjb3JkKHN0YWNrLCAnQ0FBQW1hem9uJywge1xuICAgICAgem9uZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgICBOYW1lOiAnbXl6b25lLicsXG4gICAgICBUeXBlOiAnQ0FBJyxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlUmVjb3JkczogW1xuICAgICAgICAnMCBpc3N1ZSBcImFtYXpvbi5jb21cIicsXG4gICAgICBdLFxuICAgICAgVFRMOiAnMTgwMCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NBQSBBbWF6b24gcmVjb3JkIHdpdGggcmVjb3JkIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLkNhYUFtYXpvblJlY29yZChzdGFjaywgJ0NBQUFtYXpvbicsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnd3d3JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgICBOYW1lOiAnd3d3Lm15em9uZS4nLFxuICAgICAgVHlwZTogJ0NBQScsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJzAgaXNzdWUgXCJhbWF6b24uY29tXCInLFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdNWCByZWNvcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLk14UmVjb3JkKHN0YWNrLCAnTVgnLCB7XG4gICAgICB6b25lLFxuICAgICAgcmVjb3JkTmFtZTogJ21haWwnLFxuICAgICAgdmFsdWVzOiBbe1xuICAgICAgICBob3N0TmFtZTogJ3dvcmttYWlsLmF3cycsXG4gICAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICdtYWlsLm15em9uZS4nLFxuICAgICAgVHlwZTogJ01YJyxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlUmVjb3JkczogW1xuICAgICAgICAnMTAgd29ya21haWwuYXdzJyxcbiAgICAgIF0sXG4gICAgICBUVEw6ICcxODAwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTlMgcmVjb3JkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgcm91dGU1My5Oc1JlY29yZChzdGFjaywgJ05TJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICd3d3cnLFxuICAgICAgdmFsdWVzOiBbJ25zLTEuYXdzZG5zLmNvLnVrLicsICducy0yLmF3c2Rucy5jb20uJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ3d3dy5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdOUycsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJ25zLTEuYXdzZG5zLmNvLnVrLicsXG4gICAgICAgICducy0yLmF3c2Rucy5jb20uJyxcbiAgICAgIF0sXG4gICAgICBUVEw6ICcxODAwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRFMgcmVjb3JkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgcm91dGU1My5Ec1JlY29yZChzdGFjaywgJ0RTJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICd3d3cnLFxuICAgICAgdmFsdWVzOiBbJzEyMzQ1IDMgMSAxMjM0NTY3ODlhYmNkZWY2Nzg5MDEyMzQ1Njc4OWFiY2RlZjY3ODkwJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ3d3dy5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdEUycsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJzEyMzQ1IDMgMSAxMjM0NTY3ODlhYmNkZWY2Nzg5MDEyMzQ1Njc4OWFiY2RlZjY3ODkwJyxcbiAgICAgIF0sXG4gICAgICBUVEw6ICcxODAwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnWm9uZSBkZWxlZ2F0aW9uIHJlY29yZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IHJvdXRlNTMuWm9uZURlbGVnYXRpb25SZWNvcmQoc3RhY2ssICdOUycsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnZm9vJyxcbiAgICAgIG5hbWVTZXJ2ZXJzOiBbJ25zLTE3NzcuYXdzZG5zLTMwLmNvLnVrJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ2Zvby5teXpvbmUuJyxcbiAgICAgIFR5cGU6ICdOUycsXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAgJ25zLTE3NzcuYXdzZG5zLTMwLmNvLnVrLicsXG4gICAgICBdLFxuICAgICAgVFRMOiAnMTcyODAwJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0Nyb3NzIGFjY291bnQgem9uZSBkZWxlZ2F0aW9uIHJlY29yZCB3aXRoIHBhcmVudEhvc3RlZFpvbmVJZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcGFyZW50Wm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdQYXJlbnRIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsOiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQ1Njc4OTAxMicpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoaWxkWm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdDaGlsZEhvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ3N1Yi5teXpvbmUuY29tJyxcbiAgICB9KTtcbiAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZChzdGFjaywgJ0RlbGVnYXRpb24nLCB7XG4gICAgICBkZWxlZ2F0ZWRab25lOiBjaGlsZFpvbmUsXG4gICAgICBwYXJlbnRIb3N0ZWRab25lSWQ6IHBhcmVudFpvbmUuaG9zdGVkWm9uZUlkLFxuICAgICAgZGVsZWdhdGlvblJvbGU6IHBhcmVudFpvbmUuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlISxcbiAgICAgIHR0bDogRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDcm9zc0FjY291bnRab25lRGVsZWdhdGlvbicsIHtcbiAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQ3VzdG9tQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25DdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ0QTg0MjY1JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBBc3N1bWVSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdQYXJlbnRIb3N0ZWRab25lQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlOTVCMUMzNkUnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFBhcmVudFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdQYXJlbnRIb3N0ZWRab25lQzJCRDg2RTEnLFxuICAgICAgfSxcbiAgICAgIERlbGVnYXRlZFpvbmVOYW1lOiAnc3ViLm15em9uZS5jb20nLFxuICAgICAgRGVsZWdhdGVkWm9uZU5hbWVTZXJ2ZXJzOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdDaGlsZEhvc3RlZFpvbmU0QjE0QUM3MScsXG4gICAgICAgICAgJ05hbWVTZXJ2ZXJzJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBUVEw6IDYwLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0N1c3RvbTo6Q3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb24nLCB7XG4gICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0Nyb3NzIGFjY291bnQgem9uZSBkZWxlZ2F0aW9uIHJlY29yZCB3aXRoIHBhcmVudEhvc3RlZFpvbmVOYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwYXJlbnRab25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ1BhcmVudEhvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZS5jb20nLFxuICAgICAgY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25QcmluY2lwYWw6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMTIzNDU2Nzg5MDEyJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2hpbGRab25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0NoaWxkSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnc3ViLm15em9uZS5jb20nLFxuICAgIH0pO1xuICAgIG5ldyByb3V0ZTUzLkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkKHN0YWNrLCAnRGVsZWdhdGlvbicsIHtcbiAgICAgIGRlbGVnYXRlZFpvbmU6IGNoaWxkWm9uZSxcbiAgICAgIHBhcmVudEhvc3RlZFpvbmVOYW1lOiAnbXl6b25lLmNvbScsXG4gICAgICBkZWxlZ2F0aW9uUm9sZTogcGFyZW50Wm9uZS5jcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJvbGUhLFxuICAgICAgdHRsOiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpDcm9zc0FjY291bnRab25lRGVsZWdhdGlvbicsIHtcbiAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQ3VzdG9tQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25DdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ0QTg0MjY1JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBBc3N1bWVSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdQYXJlbnRIb3N0ZWRab25lQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlOTVCMUMzNkUnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFBhcmVudFpvbmVOYW1lOiAnbXl6b25lLmNvbScsXG4gICAgICBEZWxlZ2F0ZWRab25lTmFtZTogJ3N1Yi5teXpvbmUuY29tJyxcbiAgICAgIERlbGVnYXRlZFpvbmVOYW1lU2VydmVyczoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQ2hpbGRIb3N0ZWRab25lNEIxNEFDNzEnLFxuICAgICAgICAgICdOYW1lU2VydmVycycsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVFRMOiA2MCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ0Nyb3NzIGFjY291bnQgem9uZSBkZWxlZ2F0aW9uIHJlY29yZCB0aHJvd3Mgd2hlbiBwYXJlbnQgaWQgYW5kIG5hbWUgYm90aC9uaXRoZXIgYXJlIHN1cHBsaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwYXJlbnRab25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ1BhcmVudEhvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ215em9uZS5jb20nLFxuICAgICAgY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25QcmluY2lwYWw6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMTIzNDU2Nzg5MDEyJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY2hpbGRab25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0NoaWxkSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnc3ViLm15em9uZS5jb20nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyByb3V0ZTUzLkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkKHN0YWNrLCAnRGVsZWdhdGlvbjEnLCB7XG4gICAgICAgIGRlbGVnYXRlZFpvbmU6IGNoaWxkWm9uZSxcbiAgICAgICAgZGVsZWdhdGlvblJvbGU6IHBhcmVudFpvbmUuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlISxcbiAgICAgICAgdHRsOiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0F0IGxlYXN0IG9uZSBvZiBwYXJlbnRIb3N0ZWRab25lTmFtZSBvciBwYXJlbnRIb3N0ZWRab25lSWQgaXMgcmVxdWlyZWQvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZChzdGFjaywgJ0RlbGVnYXRpb24yJywge1xuICAgICAgICBkZWxlZ2F0ZWRab25lOiBjaGlsZFpvbmUsXG4gICAgICAgIHBhcmVudEhvc3RlZFpvbmVJZDogcGFyZW50Wm9uZS5ob3N0ZWRab25lSWQsXG4gICAgICAgIHBhcmVudEhvc3RlZFpvbmVOYW1lOiBwYXJlbnRab25lLnpvbmVOYW1lLFxuICAgICAgICBkZWxlZ2F0aW9uUm9sZTogcGFyZW50Wm9uZS5jcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJvbGUhLFxuICAgICAgICB0dGw6IER1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvT25seSBvbmUgb2YgcGFyZW50SG9zdGVkWm9uZU5hbWUgYW5kIHBhcmVudEhvc3RlZFpvbmVJZCBpcyBzdXBwb3J0ZWQvKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ011bHRpcGxlIGNyb3NzIGFjY291bnQgem9uZSBkZWxlZ2F0aW9uIHJlY29yZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBhcmVudFpvbmUgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnUGFyZW50SG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAnbXl6b25lLmNvbScsXG4gICAgICBjcm9zc0FjY291bnRab25lRGVsZWdhdGlvblByaW5jaXBhbDogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcxMjM0NTY3ODkwMTInKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjaGlsZFpvbmUgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnQ2hpbGRIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdzdWIubXl6b25lLmNvbScsXG4gICAgfSk7XG4gICAgbmV3IHJvdXRlNTMuQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25SZWNvcmQoc3RhY2ssICdEZWxlZ2F0aW9uJywge1xuICAgICAgZGVsZWdhdGVkWm9uZTogY2hpbGRab25lLFxuICAgICAgcGFyZW50SG9zdGVkWm9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgIGRlbGVnYXRpb25Sb2xlOiBwYXJlbnRab25lLmNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZSEsXG4gICAgICB0dGw6IER1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIH0pO1xuICAgIGNvbnN0IGNoaWxkWm9uZTIgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnQ2hpbGRIb3N0ZWRab25lMicsIHtcbiAgICAgIHpvbmVOYW1lOiAnYW5vdGhlcnN1Yi5teXpvbmUuY29tJyxcbiAgICB9KTtcbiAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZChzdGFjaywgJ0RlbGVnYXRpb24yJywge1xuICAgICAgZGVsZWdhdGVkWm9uZTogY2hpbGRab25lMixcbiAgICAgIHBhcmVudEhvc3RlZFpvbmVOYW1lOiAnbXl6b25lLmNvbScsXG4gICAgICBkZWxlZ2F0aW9uUm9sZTogcGFyZW50Wm9uZS5jcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJvbGUhLFxuICAgICAgdHRsOiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjaGlsZEhvc3RlZFpvbmVzID0gW1xuICAgICAgeyBuYW1lOiAnc3ViLm15em9uZS5jb20nLCBpZDogJ0NoaWxkSG9zdGVkWm9uZTRCMTRBQzcxJywgZGVwZW5kc09uOiAnRGVsZWdhdGlvbmNyb3NzYWNjb3VudHpvbmVkZWxlZ2F0aW9uaGFuZGxlcnJvbGVQb2xpY3kxRTE1NzYwMicgfSxcbiAgICAgIHsgbmFtZTogJ2Fub3RoZXJzdWIubXl6b25lLmNvbScsIGlkOiAnQ2hpbGRIb3N0ZWRab25lMkEzNzE5OEYwJywgZGVwZW5kc09uOiAnRGVsZWdhdGlvbjJjcm9zc2FjY291bnR6b25lZGVsZWdhdGlvbmhhbmRsZXJyb2xlUG9saWN5NzEzQkVBQzMnIH0sXG4gICAgXTtcblxuICAgIGZvciAodmFyIGNoaWxkSG9zdGVkWm9uZSBvZiBjaGlsZEhvc3RlZFpvbmVzKSB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdDdXN0b206OkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uJywge1xuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXI0NEE4NDI2NScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFzc3VtZVJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUGFyZW50SG9zdGVkWm9uZUNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZTk1QjFDMzZFJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUGFyZW50Wm9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgICAgICBEZWxlZ2F0ZWRab25lTmFtZTogY2hpbGRIb3N0ZWRab25lLm5hbWUsXG4gICAgICAgICAgRGVsZWdhdGVkWm9uZU5hbWVTZXJ2ZXJzOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgY2hpbGRIb3N0ZWRab25lLmlkLFxuICAgICAgICAgICAgICAnTmFtZVNlcnZlcnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRUTDogNjAsXG4gICAgICAgIH0sXG4gICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgIGNoaWxkSG9zdGVkWm9uZS5kZXBlbmRzT24sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdDcm9zcyBhY2NvdW50IHpvbmUgZGVsZWdhdGlvbiBwb2xpY2llcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcGFyZW50Wm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdQYXJlbnRIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsOiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQ1Njc4OTAxMicpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoaWxkWm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdDaGlsZEhvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ3N1Yi5teXpvbmUuY29tJyxcbiAgICB9KTtcbiAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZChzdGFjaywgJ0RlbGVnYXRpb24nLCB7XG4gICAgICBkZWxlZ2F0ZWRab25lOiBjaGlsZFpvbmUsXG4gICAgICBwYXJlbnRIb3N0ZWRab25lTmFtZTogJ215em9uZS5jb20nLFxuICAgICAgZGVsZWdhdGlvblJvbGU6IHBhcmVudFpvbmUuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlISxcbiAgICAgIHR0bDogRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG4gICAgY29uc3QgY2hpbGRab25lMiA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdDaGlsZEhvc3RlZFpvbmUyJywge1xuICAgICAgem9uZU5hbWU6ICdhbm90aGVyc3ViLm15em9uZS5jb20nLFxuICAgIH0pO1xuICAgIG5ldyByb3V0ZTUzLkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkKHN0YWNrLCAnRGVsZWdhdGlvbjInLCB7XG4gICAgICBkZWxlZ2F0ZWRab25lOiBjaGlsZFpvbmUyLFxuICAgICAgcGFyZW50SG9zdGVkWm9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgIGRlbGVnYXRpb25Sb2xlOiBwYXJlbnRab25lLmNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZSEsXG4gICAgICB0dGw6IER1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHBvbGljeU5hbWVzID0gW1xuICAgICAgJ0RlbGVnYXRpb25jcm9zc2FjY291bnR6b25lZGVsZWdhdGlvbmhhbmRsZXJyb2xlUG9saWN5MUUxNTc2MDInLFxuICAgICAgJ0RlbGVnYXRpb24yY3Jvc3NhY2NvdW50em9uZWRlbGVnYXRpb25oYW5kbGVycm9sZVBvbGljeTcxM0JFQUMzJyxcbiAgICBdO1xuXG4gICAgZm9yICh2YXIgcG9saWN5TmFtZSBvZiBwb2xpY3lOYW1lcykge1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeU5hbWU6IHBvbGljeU5hbWUsXG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdQYXJlbnRIb3N0ZWRab25lQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlOTVCMUMzNkUnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OlNlbGVjdCc6IFsxLCB7XG4gICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbJy8nLCB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbNSwge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFsnOicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVFRDY0Njg3QicsXG4gICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnQ3Jvc3MgYWNjb3VudCB6b25lIGNvbnRleHQgZmxhZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KCdAYXdzLWNkay9hd3Mtcm91dGU1Mzp1c2VSZWdpb25hbFN0c0VuZHBvaW50JywgdHJ1ZSk7XG4gICAgY29uc3QgcGFyZW50Wm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdQYXJlbnRIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUuY29tJyxcbiAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsOiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQ1Njc4OTAxMicpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNoaWxkWm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdDaGlsZEhvc3RlZFpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogJ3N1Yi5teXpvbmUuY29tJyxcbiAgICB9KTtcbiAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZChzdGFjaywgJ0RlbGVnYXRpb24nLCB7XG4gICAgICBkZWxlZ2F0ZWRab25lOiBjaGlsZFpvbmUsXG4gICAgICBwYXJlbnRIb3N0ZWRab25lTmFtZTogJ215em9uZS5jb20nLFxuICAgICAgZGVsZWdhdGlvblJvbGU6IHBhcmVudFpvbmUuY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlISxcbiAgICAgIHR0bDogRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6Q3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb24nLCB7XG4gICAgICBVc2VSZWdpb25hbFN0c0VuZHBvaW50OiAndHJ1ZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RlbGV0ZSBleGlzdGluZyByZWNvcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdteXpvbmUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQoc3RhY2ssICdBJywge1xuICAgICAgem9uZSxcbiAgICAgIHJlY29yZE5hbWU6ICd3d3cnLFxuICAgICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tSXBBZGRyZXNzZXMoJzEuMi4zLjQnLCAnNS42LjcuOCcpLFxuICAgICAgZGVsZXRlRXhpc3Rpbmc6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6RGVsZXRlRXhpc3RpbmdSZWNvcmRTZXQnLCB7XG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgICBSZWNvcmROYW1lOiAnd3d3Lm15em9uZS4nLFxuICAgICAgUmVjb3JkVHlwZTogJ0EnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdyb3V0ZTUzOkdldENoYW5nZScsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdyb3V0ZTUzOkxpc3RSZXNvdXJjZVJlY29yZFNldHMnLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOnJvdXRlNTM6Ojpob3N0ZWR6b25lLycsXG4gICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyB9LFxuICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0cycsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6cm91dGU1Mzo6Omhvc3RlZHpvbmUvJyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnIH0sXG4gICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgJ0ZvckFsbFZhbHVlczpTdHJpbmdFcXVhbHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c1JlY29yZFR5cGVzJzogWydBJ10sXG4gICAgICAgICAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c0FjdGlvbnMnOiBbJ0RFTEVURSddLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==