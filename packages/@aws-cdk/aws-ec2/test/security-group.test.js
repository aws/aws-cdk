"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY = '@aws-cdk/aws-ec2.securityGroupDisableInlineRules';
describe('security group', () => {
    test('security group can allows all outbound traffic by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
            ],
        });
    });
    test('security group can allows all ipv6 outbound traffic by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllIpv6Outbound: true });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
                {
                    CidrIpv6: '::/0',
                    Description: 'Allow all outbound ipv6 traffic by default',
                    IpProtocol: '-1',
                },
            ],
        });
    });
    test('can add ipv6 rules even if allowAllOutbound=true', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        const sg = new lib_1.SecurityGroup(stack, 'SG1', { vpc });
        sg.addEgressRule(lib_1.Peer.ipv6('2001:db8::/128'), lib_1.Port.tcp(80));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
                {
                    CidrIpv6: '2001:db8::/128',
                    Description: 'from 2001:db8::/128:80',
                    FromPort: 80,
                    ToPort: 80,
                    IpProtocol: 'tcp',
                },
            ],
        });
    });
    test('no new outbound rule is added if we are allowing all traffic anyway', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        const sg = new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });
        sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'This does not show up');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
            ],
        });
    });
    test('security group disallow outbound traffic by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '255.255.255.255/32',
                    Description: 'Disallow all traffic',
                    FromPort: 252,
                    IpProtocol: 'icmp',
                    ToPort: 86,
                },
            ],
        });
    });
    test('bogus outbound rule disappears if another rule is added', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        const sg = new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
        sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'This replaces the other one');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'This replaces the other one',
                    FromPort: 86,
                    IpProtocol: 'tcp',
                    ToPort: 86,
                },
            ],
        });
    });
    test('all outbound rule cannot be added after creation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        const sg = new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
        expect(() => {
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.allTraffic(), 'All traffic');
        }).toThrow(/Cannot add/);
    });
    test('all ipv6 outbound rule cannot be added after creation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        const sg = new lib_1.SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
        expect(() => {
            sg.addEgressRule(lib_1.Peer.anyIpv6(), lib_1.Port.allTraffic(), 'All traffic');
        }).toThrow(/Cannot add/);
    });
    test('immutable imports do not add rules', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const sg = lib_1.SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'test-id', { mutable: false });
        sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'This rule was not added');
        sg.addIngressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'This rule was not added');
        const openEgressRules = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::SecurityGroup', {
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'This rule was not added',
                    FromPort: 86,
                    IpProtocol: 'tcp',
                    ToPort: 86,
                },
            ],
        });
        expect(Object.keys(openEgressRules).length).toBe(0);
        const openIngressRules = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::SecurityGroup', {
            SecurityGroupIngress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'This rule was not added',
                    FromPort: 86,
                    IpProtocol: 'tcp',
                    ToPort: 86,
                },
            ],
        });
        expect(Object.keys(openIngressRules).length).toBe(0);
    });
    describe('Inline Rule Control', () => {
        //Not inlined
        describe('When props.disableInlineRules is true', () => { testRulesAreNotInlined(undefined, true); });
        describe('When context.disableInlineRules is true', () => { testRulesAreNotInlined(true, undefined); });
        describe('When context.disableInlineRules is true and props.disableInlineRules is true', () => { testRulesAreNotInlined(true, true); });
        describe('When context.disableInlineRules is false and props.disableInlineRules is true', () => { testRulesAreNotInlined(false, true); });
        describe('When props.disableInlineRules is true and context.disableInlineRules is null', () => { testRulesAreNotInlined(null, true); });
        //Inlined
        describe('When context.disableInlineRules is false and props.disableInlineRules is false', () => { testRulesAreInlined(false, false); });
        describe('When context.disableInlineRules is true and props.disableInlineRules is false', () => { testRulesAreInlined(true, false); });
        describe('When context.disableInlineRules is false', () => { testRulesAreInlined(false, undefined); });
        describe('When props.disableInlineRules is false', () => { testRulesAreInlined(undefined, false); });
        describe('When neither props.disableInlineRules nor context.disableInlineRules are defined', () => { testRulesAreInlined(undefined, undefined); });
        describe('When props.disableInlineRules is undefined and context.disableInlineRules is null', () => { testRulesAreInlined(null, undefined); });
        describe('When props.disableInlineRules is false and context.disableInlineRules is null', () => { testRulesAreInlined(null, false); });
    });
    test('peer between all types of peers and port range types', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' } });
        const vpc = new lib_1.Vpc(stack, 'VPC');
        const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc, allowAllIpv6Outbound: true });
        const peers = [
            new lib_1.SecurityGroup(stack, 'PeerGroup', { vpc }),
            lib_1.Peer.anyIpv4(),
            lib_1.Peer.anyIpv6(),
            lib_1.Peer.prefixList('pl-012345'),
            lib_1.Peer.securityGroupId('sg-012345678'),
        ];
        const ports = [
            lib_1.Port.tcp(1234),
            lib_1.Port.tcp(core_1.Lazy.number({ produce: () => 5000 })),
            lib_1.Port.allTcp(),
            lib_1.Port.tcpRange(80, 90),
            lib_1.Port.udp(2345),
            lib_1.Port.udp(core_1.Lazy.number({ produce: () => 7777 })),
            lib_1.Port.allUdp(),
            lib_1.Port.udpRange(85, 95),
            lib_1.Port.icmpTypeAndCode(5, 1),
            lib_1.Port.icmpType(8),
            lib_1.Port.allIcmp(),
            lib_1.Port.icmpPing(),
            lib_1.Port.allTraffic(),
        ];
        // WHEN
        for (const peer of peers) {
            for (const port of ports) {
                sg.connections.allowTo(peer, port);
                sg.connections.allowFrom(peer, port);
            }
        }
        // THEN -- no crash
    });
    test('can add multiple rules using tokens on same security group', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' } });
        const vpc = new lib_1.Vpc(stack, 'VPC');
        const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc });
        const p1 = core_1.Lazy.string({ produce: () => 'dummyid1' });
        const p2 = core_1.Lazy.string({ produce: () => 'dummyid2' });
        const peer1 = lib_1.Peer.prefixList(p1);
        const peer2 = lib_1.Peer.prefixList(p2);
        // WHEN
        sg.addIngressRule(peer1, lib_1.Port.tcp(5432), 'Rule 1');
        sg.addIngressRule(peer2, lib_1.Port.tcp(5432), 'Rule 2');
        // THEN -- no crash
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            Description: 'Rule 1',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            Description: 'Rule 2',
        });
    });
    test('if tokens are used in ports, `canInlineRule` should be false to avoid cycles', () => {
        // GIVEN
        const p1 = core_1.Lazy.number({ produce: () => 80 });
        const p2 = core_1.Lazy.number({ produce: () => 5000 });
        // WHEN
        const ports = [
            lib_1.Port.tcp(p1),
            lib_1.Port.tcp(p2),
            lib_1.Port.tcpRange(p1, 90),
            lib_1.Port.tcpRange(80, p2),
            lib_1.Port.tcpRange(p1, p2),
            lib_1.Port.udp(p1),
            lib_1.Port.udpRange(p1, 95),
            lib_1.Port.udpRange(85, p2),
            lib_1.Port.udpRange(p1, p2),
            lib_1.Port.icmpTypeAndCode(p1, 1),
            lib_1.Port.icmpTypeAndCode(5, p1),
            lib_1.Port.icmpTypeAndCode(p1, p2),
            lib_1.Port.icmpType(p1),
        ];
        // THEN
        for (const range of ports) {
            expect(range.canInlineRule).toEqual(false);
        }
    });
    describe('Peer IP CIDR validation', () => {
        test('passes with valid IPv4 CIDR block', () => {
            // GIVEN
            const cidrIps = ['0.0.0.0/0', '192.168.255.255/24'];
            // THEN
            for (const cidrIp of cidrIps) {
                expect(lib_1.Peer.ipv4(cidrIp).uniqueId).toEqual(cidrIp);
            }
        });
        test('passes with unresolved IP CIDR token', () => {
            // GIVEN
            core_1.Token.asString(new core_1.Intrinsic('ip'));
            // THEN: don't throw
        });
        test('throws if invalid IPv4 CIDR block', () => {
            // THEN
            expect(() => {
                lib_1.Peer.ipv4('invalid');
            }).toThrow(/Invalid IPv4 CIDR/);
        });
        test('throws if missing mask in IPv4 CIDR block', () => {
            expect(() => {
                lib_1.Peer.ipv4('0.0.0.0');
            }).toThrow(/CIDR mask is missing in IPv4/);
        });
        test('passes with valid IPv6 CIDR block', () => {
            // GIVEN
            const cidrIps = [
                '::/0',
                '2001:db8::/32',
                '2001:0db8:0000:0000:0000:8a2e:0370:7334/32',
                '2001:db8::8a2e:370:7334/32',
            ];
            // THEN
            for (const cidrIp of cidrIps) {
                expect(lib_1.Peer.ipv6(cidrIp).uniqueId).toEqual(cidrIp);
            }
        });
        test('throws if invalid IPv6 CIDR block', () => {
            // THEN
            expect(() => {
                lib_1.Peer.ipv6('invalid');
            }).toThrow(/Invalid IPv6 CIDR/);
        });
        test('throws if missing mask in IPv6 CIDR block', () => {
            expect(() => {
                lib_1.Peer.ipv6('::');
            }).toThrow(/IDR mask is missing in IPv6/);
        });
    });
    describe('Peer security group ID validation', () => {
        test('passes with valid security group ID', () => {
            //GIVEN
            const securityGroupIds = ['sg-12345678', 'sg-0123456789abcdefg'];
            // THEN
            for (const securityGroupId of securityGroupIds) {
                expect(lib_1.Peer.securityGroupId(securityGroupId).uniqueId).toEqual(securityGroupId);
            }
        });
        test('passes with valid security group ID and source owner id', () => {
            //GIVEN
            const securityGroupIds = ['sg-12345678', 'sg-0123456789abcdefg'];
            const ownerIds = ['000000000000', '000000000001'];
            // THEN
            for (const securityGroupId of securityGroupIds) {
                for (const ownerId of ownerIds) {
                    expect(lib_1.Peer.securityGroupId(securityGroupId, ownerId).uniqueId).toEqual(securityGroupId);
                }
            }
        });
        test('passes with unresolved security group id token or owner id token', () => {
            // GIVEN
            core_1.Token.asString('securityGroupId');
            const securityGroupId = core_1.Lazy.string({ produce: () => 'sg-01234567' });
            const ownerId = core_1.Lazy.string({ produce: () => '000000000000' });
            lib_1.Peer.securityGroupId(securityGroupId);
            lib_1.Peer.securityGroupId(securityGroupId, ownerId);
            // THEN: don't throw
        });
        test('throws if invalid security group ID', () => {
            // THEN
            expect(() => {
                lib_1.Peer.securityGroupId('invalid');
            }).toThrow(/Invalid security group ID/);
        });
        test('throws if invalid source security group id', () => {
            // THEN
            expect(() => {
                lib_1.Peer.securityGroupId('sg-12345678', 'invalid');
            }).toThrow(/Invalid security group owner ID/);
        });
    });
    describe('SourceSecurityGroupOwnerId property validation', () => {
        test('SourceSecurityGroupOwnerId property is not present when value is not provided to ingress rule', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack');
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc });
            //WHEN
            sg.addIngressRule(lib_1.Peer.securityGroupId('sg-123456789'), lib_1.Port.allTcp(), 'no owner id property');
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupIngress: [{
                        SourceSecurityGroupId: 'sg-123456789',
                        Description: 'no owner id property',
                        FromPort: 0,
                        ToPort: 65535,
                        IpProtocol: 'tcp',
                    }],
            });
        });
        test('SourceSecurityGroupOwnerId property is present when value is provided to ingress rule', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack');
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc });
            //WHEN
            sg.addIngressRule(lib_1.Peer.securityGroupId('sg-123456789', '000000000000'), lib_1.Port.allTcp(), 'contains owner id property');
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupIngress: [{
                        SourceSecurityGroupId: 'sg-123456789',
                        SourceSecurityGroupOwnerId: '000000000000',
                        Description: 'contains owner id property',
                        FromPort: 0,
                        ToPort: 65535,
                        IpProtocol: 'tcp',
                    }],
            });
        });
        test('SourceSecurityGroupOwnerId property is not present when value is provided to egress rule', () => {
            // GIVEN
            const stack = new core_1.Stack(undefined, 'TestStack');
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const sg = new lib_1.SecurityGroup(stack, 'SG', { vpc, allowAllOutbound: false });
            //WHEN
            sg.addEgressRule(lib_1.Peer.securityGroupId('sg-123456789', '000000000000'), lib_1.Port.allTcp(), 'no owner id property');
            //THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                SecurityGroupEgress: [{
                        DestinationSecurityGroupId: 'sg-123456789',
                        Description: 'no owner id property',
                        FromPort: 0,
                        ToPort: 65535,
                        IpProtocol: 'tcp',
                    }],
            });
        });
    });
});
describe('security group lookup', () => {
    (0, cdk_build_tools_1.testDeprecated)('can look up a security group', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        const securityGroup = lib_1.SecurityGroup.fromLookup(stack, 'stack', 'sg-1234');
        expect(securityGroup.securityGroupId).toEqual('sg-12345678');
        expect(securityGroup.allowAllOutbound).toEqual(true);
    });
    test('can look up a security group by id', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        // WHEN
        const securityGroup = lib_1.SecurityGroup.fromLookupById(stack, 'SG1', 'sg-12345');
        // THEN
        expect(securityGroup.securityGroupId).toEqual('sg-12345678');
        expect(securityGroup.allowAllOutbound).toEqual(true);
    });
    test('can look up a security group by name and vpc', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
            vpcId: 'vpc-1234',
            availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
        });
        // WHEN
        const securityGroup = lib_1.SecurityGroup.fromLookupByName(stack, 'SG1', 'sg-12345', vpc);
        // THEN
        expect(securityGroup.securityGroupId).toEqual('sg-12345678');
        expect(securityGroup.allowAllOutbound).toEqual(true);
    });
    test('can look up a security group by id and vpc', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
            vpcId: 'vpc-1234',
            availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
        });
        // WHEN
        const securityGroup = lib_1.SecurityGroup.fromLookupByName(stack, 'SG1', 'my-security-group', vpc);
        // THEN
        expect(securityGroup.securityGroupId).toEqual('sg-12345678');
        expect(securityGroup.allowAllOutbound).toEqual(true);
    });
    test('can look up a security group and use it as a peer', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
            vpcId: 'vpc-1234',
            availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
        });
        // WHEN
        const securityGroup = lib_1.SecurityGroup.fromLookupByName(stack, 'SG1', 'my-security-group', vpc);
        // THEN
        expect(() => {
            lib_1.Peer.securityGroupId(securityGroup.securityGroupId);
        }).not.toThrow();
    });
    test('throws if securityGroupId is tokenized', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        // WHEN
        expect(() => {
            lib_1.SecurityGroup.fromLookupById(stack, 'stack', core_1.Lazy.string({ produce: () => 'sg-12345' }));
        }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');
    });
    test('throws if securityGroupName is tokenized', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        // WHEN
        expect(() => {
            lib_1.SecurityGroup.fromLookupById(stack, 'stack', core_1.Lazy.string({ produce: () => 'my-security-group' }));
        }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');
    });
    test('throws if vpc id is tokenized', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack', {
            env: {
                account: '1234',
                region: 'us-east-1',
            },
        });
        const vpc = lib_1.Vpc.fromVpcAttributes(stack, 'VPC', {
            vpcId: core_1.Lazy.string({ produce: () => 'vpc-1234' }),
            availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
        });
        // WHEN
        expect(() => {
            lib_1.SecurityGroup.fromLookupByName(stack, 'stack', 'my-security-group', vpc);
        }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');
    });
});
function testRulesAreInlined(contextDisableInlineRules, optionsDisableInlineRules) {
    describe('When allowAllOutbound', () => {
        test('new SecurityGroup will create an inline SecurityGroupEgress rule to allow all traffic', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            new lib_1.SecurityGroup(stack, 'SG1', props);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addEgressRule rule will not modify egress rules', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule will add a new ingress rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addIngressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupIngress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'An external Rule',
                        FromPort: 86,
                        IpProtocol: 'tcp',
                        ToPort: 86,
                    },
                ],
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1',
                    },
                ],
            });
        });
    });
    describe('When do not allowAllOutbound', () => {
        test('new SecurityGroup rule will create an egress rule that denies all traffic', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            new lib_1.SecurityGroup(stack, 'SG1', props);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupEgress: [
                    {
                        CidrIp: '255.255.255.255/32',
                        Description: 'Disallow all traffic',
                        IpProtocol: 'icmp',
                        FromPort: 252,
                        ToPort: 86,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addEgressRule rule will add a new inline egress rule and remove the denyAllTraffic rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An inline Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'An inline Rule',
                        FromPort: 86,
                        IpProtocol: 'tcp',
                        ToPort: 86,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule will add a new ingress rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addIngressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
                SecurityGroupIngress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'An external Rule',
                        FromPort: 86,
                        IpProtocol: 'tcp',
                        ToPort: 86,
                    },
                ],
                SecurityGroupEgress: [
                    {
                        CidrIp: '255.255.255.255/32',
                        Description: 'Disallow all traffic',
                        IpProtocol: 'icmp',
                        FromPort: 252,
                        ToPort: 86,
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupEgress', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
    });
}
;
function testRulesAreNotInlined(contextDisableInlineRules, optionsDisableInlineRules) {
    describe('When allowAllOutbound', () => {
        test('new SecurityGroup will create an external SecurityGroupEgress rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'Allow all outbound traffic by default',
                IpProtocol: '-1',
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule rule will not remove external allowAllOutbound rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'Allow all outbound traffic by default',
                IpProtocol: '-1',
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule rule will not add a new egress rule', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            const egressGroups = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                Description: 'An external Rule',
            });
            expect(Object.keys(egressGroups).length).toBe(0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule rule will add a new external ingress rule even if it could have been inlined', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addIngressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'An external Rule',
                FromPort: 86,
                IpProtocol: 'tcp',
                ToPort: 86,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'Allow all outbound traffic by default',
                IpProtocol: '-1',
            });
        });
    });
    describe('When do not allowAllOutbound', () => {
        test('new SecurityGroup rule will create an external egress rule that denies all traffic', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '255.255.255.255/32',
                Description: 'Disallow all traffic',
                IpProtocol: 'icmp',
                FromPort: 252,
                ToPort: 86,
            });
        });
        test('addEgressRule rule will remove the rule that denies all traffic if another egress rule is added', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
            const egressGroups = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '255.255.255.255/32',
            });
            expect(Object.keys(egressGroups).length).toBe(0);
        });
        test('addEgressRule rule will add a new external egress rule even if it could have been inlined', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addEgressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'An external Rule',
                FromPort: 86,
                IpProtocol: 'tcp',
                ToPort: 86,
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroupIngress', 0);
        });
        test('addIngressRule will add a new external ingress rule even if it could have been inlined', () => {
            // GIVEN
            const stack = new core_1.Stack();
            stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
            const vpc = new lib_1.Vpc(stack, 'VPC');
            const props = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };
            // WHEN
            const sg = new lib_1.SecurityGroup(stack, 'SG1', props);
            sg.addIngressRule(lib_1.Peer.anyIpv4(), lib_1.Port.tcp(86), 'An external Rule');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
                GroupDescription: 'Default/SG1',
                VpcId: stack.resolve(vpc.vpcId),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '0.0.0.0/0',
                Description: 'An external Rule',
                FromPort: 86,
                IpProtocol: 'tcp',
                ToPort: 86,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
                GroupId: stack.resolve(sg.securityGroupId),
                CidrIp: '255.255.255.255/32',
                Description: 'Disallow all traffic',
                IpProtocol: 'icmp',
                FromPort: 252,
                ToPort: 86,
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktZ3JvdXAudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlY3VyaXR5LWdyb3VwLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOERBQTBEO0FBQzFELHdDQUFtRTtBQUNuRSxnQ0FBNEU7QUFFNUUsTUFBTSwrQ0FBK0MsR0FBRyxrREFBa0QsQ0FBQztBQUUzRyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLElBQUksQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7UUFDckUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxJQUFJLG1CQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWpFLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsTUFBTSxFQUFFLFdBQVc7b0JBQ25CLFdBQVcsRUFBRSx1Q0FBdUM7b0JBQ3BELFVBQVUsRUFBRSxJQUFJO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQyxPQUFPO1FBQ1AsSUFBSSxtQkFBYSxDQUFDLEtBQUssRUFB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QUU7Z0JBQ1osVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxFQUFFO2FBQ1gsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsK0JBQStCLEVBQUU7Z0JBQy9FLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzFDLE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLFdBQVcsRUFBRSxzQkFBc0I7Z0JBQ25DLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsRUFBRTthQUNYLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IEFwcCwgSW50cmluc2ljLCBMYXp5LCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFBlZXIsIFBvcnQsIFNlY3VyaXR5R3JvdXAsIFNlY3VyaXR5R3JvdXBQcm9wcywgVnBjIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVkgPSAnQGF3cy1jZGsvYXdzLWVjMi5zZWN1cml0eUdyb3VwRGlzYWJsZUlubGluZVJ1bGVzJztcblxuZGVzY3JpYmUoJ3NlY3VyaXR5IGdyb3VwJywgKCkgPT4ge1xuICB0ZXN0KCdzZWN1cml0eSBncm91cCBjYW4gYWxsb3dzIGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiB0cnVlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2VjdXJpdHkgZ3JvdXAgY2FuIGFsbG93cyBhbGwgaXB2NiBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjLCBhbGxvd0FsbElwdjZPdXRib3VuZDogdHJ1ZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIENpZHJJcHY2OiAnOjovMCcsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgaXB2NiB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIGlwdjYgcnVsZXMgZXZlbiBpZiBhbGxvd0FsbE91dGJvdW5kPXRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZyA9IG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cxJywgeyB2cGMgfSk7XG4gICAgc2cuYWRkRWdyZXNzUnVsZShQZWVyLmlwdjYoJzIwMDE6ZGI4OjovMTI4JyksIFBvcnQudGNwKDgwKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXB2NjogJzIwMDE6ZGI4OjovMTI4JyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ2Zyb20gMjAwMTpkYjg6Oi8xMjg6ODAnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4MCxcbiAgICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdubyBuZXcgb3V0Ym91bmQgcnVsZSBpcyBhZGRlZCBpZiB3ZSBhcmUgYWxsb3dpbmcgYWxsIHRyYWZmaWMgYW55d2F5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiB0cnVlIH0pO1xuICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQudGNwKDg2KSwgJ1RoaXMgZG9lcyBub3Qgc2hvdyB1cCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3NlY3VyaXR5IGdyb3VwIGRpc2FsbG93IG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cxJywgeyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIENpZHJJcDogJzI1NS4yNTUuMjU1LjI1NS8zMicsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdEaXNhbGxvdyBhbGwgdHJhZmZpYycsXG4gICAgICAgICAgRnJvbVBvcnQ6IDI1MixcbiAgICAgICAgICBJcFByb3RvY29sOiAnaWNtcCcsXG4gICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdib2d1cyBvdXRib3VuZCBydWxlIGRpc2FwcGVhcnMgaWYgYW5vdGhlciBydWxlIGlzIGFkZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSB9KTtcbiAgICBzZy5hZGRFZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4NiksICdUaGlzIHJlcGxhY2VzIHRoZSBvdGhlciBvbmUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyByZXBsYWNlcyB0aGUgb3RoZXIgb25lJyxcbiAgICAgICAgICBGcm9tUG9ydDogODYsXG4gICAgICAgICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbCBvdXRib3VuZCBydWxlIGNhbm5vdCBiZSBhZGRlZCBhZnRlciBjcmVhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCB7IHZwYywgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQuYWxsVHJhZmZpYygpLCAnQWxsIHRyYWZmaWMnKTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbCBpcHY2IG91dGJvdW5kIHJ1bGUgY2Fubm90IGJlIGFkZGVkIGFmdGVyIGNyZWF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc2cuYWRkRWdyZXNzUnVsZShQZWVyLmFueUlwdjYoKSwgUG9ydC5hbGxUcmFmZmljKCksICdBbGwgdHJhZmZpYycpO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBhZGQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1tdXRhYmxlIGltcG9ydHMgZG8gbm90IGFkZCBydWxlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2cgPSBTZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdTRzEnLCAndGVzdC1pZCcsIHsgbXV0YWJsZTogZmFsc2UgfSk7XG4gICAgc2cuYWRkRWdyZXNzUnVsZShQZWVyLmFueUlwdjQoKSwgUG9ydC50Y3AoODYpLCAnVGhpcyBydWxlIHdhcyBub3QgYWRkZWQnKTtcbiAgICBzZy5hZGRJbmdyZXNzUnVsZShQZWVyLmFueUlwdjQoKSwgUG9ydC50Y3AoODYpLCAnVGhpcyBydWxlIHdhcyBub3QgYWRkZWQnKTtcblxuICAgIGNvbnN0IG9wZW5FZ3Jlc3NSdWxlcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBydWxlIHdhcyBub3QgYWRkZWQnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMob3BlbkVncmVzc1J1bGVzKS5sZW5ndGgpLnRvQmUoMCk7XG5cbiAgICBjb25zdCBvcGVuSW5ncmVzc1J1bGVzID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBydWxlIHdhcyBub3QgYWRkZWQnLFxuICAgICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMob3BlbkluZ3Jlc3NSdWxlcykubGVuZ3RoKS50b0JlKDApO1xuICB9KTtcblxuICBkZXNjcmliZSgnSW5saW5lIFJ1bGUgQ29udHJvbCcsICgpID0+IHtcbiAgICAvL05vdCBpbmxpbmVkXG4gICAgZGVzY3JpYmUoJ1doZW4gcHJvcHMuZGlzYWJsZUlubGluZVJ1bGVzIGlzIHRydWUnLCAoKSA9PiB7IHRlc3RSdWxlc0FyZU5vdElubGluZWQodW5kZWZpbmVkLCB0cnVlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gY29udGV4dC5kaXNhYmxlSW5saW5lUnVsZXMgaXMgdHJ1ZScsICgpID0+IHsgdGVzdFJ1bGVzQXJlTm90SW5saW5lZCh0cnVlLCB1bmRlZmluZWQpOyB9KTtcbiAgICBkZXNjcmliZSgnV2hlbiBjb250ZXh0LmRpc2FibGVJbmxpbmVSdWxlcyBpcyB0cnVlIGFuZCBwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgaXMgdHJ1ZScsICgpID0+IHsgdGVzdFJ1bGVzQXJlTm90SW5saW5lZCh0cnVlLCB0cnVlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gY29udGV4dC5kaXNhYmxlSW5saW5lUnVsZXMgaXMgZmFsc2UgYW5kIHByb3BzLmRpc2FibGVJbmxpbmVSdWxlcyBpcyB0cnVlJywgKCkgPT4geyB0ZXN0UnVsZXNBcmVOb3RJbmxpbmVkKGZhbHNlLCB0cnVlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gcHJvcHMuZGlzYWJsZUlubGluZVJ1bGVzIGlzIHRydWUgYW5kIGNvbnRleHQuZGlzYWJsZUlubGluZVJ1bGVzIGlzIG51bGwnLCAoKSA9PiB7IHRlc3RSdWxlc0FyZU5vdElubGluZWQobnVsbCwgdHJ1ZSk7IH0pO1xuICAgIC8vSW5saW5lZFxuICAgIGRlc2NyaWJlKCdXaGVuIGNvbnRleHQuZGlzYWJsZUlubGluZVJ1bGVzIGlzIGZhbHNlIGFuZCBwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgaXMgZmFsc2UnLCAoKSA9PiB7IHRlc3RSdWxlc0FyZUlubGluZWQoZmFsc2UsIGZhbHNlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gY29udGV4dC5kaXNhYmxlSW5saW5lUnVsZXMgaXMgdHJ1ZSBhbmQgcHJvcHMuZGlzYWJsZUlubGluZVJ1bGVzIGlzIGZhbHNlJywgKCkgPT4geyB0ZXN0UnVsZXNBcmVJbmxpbmVkKHRydWUsIGZhbHNlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gY29udGV4dC5kaXNhYmxlSW5saW5lUnVsZXMgaXMgZmFsc2UnLCAoKSA9PiB7IHRlc3RSdWxlc0FyZUlubGluZWQoZmFsc2UsIHVuZGVmaW5lZCk7IH0pO1xuICAgIGRlc2NyaWJlKCdXaGVuIHByb3BzLmRpc2FibGVJbmxpbmVSdWxlcyBpcyBmYWxzZScsICgpID0+IHsgdGVzdFJ1bGVzQXJlSW5saW5lZCh1bmRlZmluZWQsIGZhbHNlKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gbmVpdGhlciBwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgbm9yIGNvbnRleHQuZGlzYWJsZUlubGluZVJ1bGVzIGFyZSBkZWZpbmVkJywgKCkgPT4geyB0ZXN0UnVsZXNBcmVJbmxpbmVkKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTsgfSk7XG4gICAgZGVzY3JpYmUoJ1doZW4gcHJvcHMuZGlzYWJsZUlubGluZVJ1bGVzIGlzIHVuZGVmaW5lZCBhbmQgY29udGV4dC5kaXNhYmxlSW5saW5lUnVsZXMgaXMgbnVsbCcsICgpID0+IHsgdGVzdFJ1bGVzQXJlSW5saW5lZChudWxsLCB1bmRlZmluZWQpOyB9KTtcbiAgICBkZXNjcmliZSgnV2hlbiBwcm9wcy5kaXNhYmxlSW5saW5lUnVsZXMgaXMgZmFsc2UgYW5kIGNvbnRleHQuZGlzYWJsZUlubGluZVJ1bGVzIGlzIG51bGwnLCAoKSA9PiB7IHRlc3RSdWxlc0FyZUlubGluZWQobnVsbCwgZmFsc2UpOyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncGVlciBiZXR3ZWVuIGFsbCB0eXBlcyBvZiBwZWVycyBhbmQgcG9ydCByYW5nZSB0eXBlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3OCcsIHJlZ2lvbjogJ2R1bW15JyB9IH0pO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBzZyA9IG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYywgYWxsb3dBbGxJcHY2T3V0Ym91bmQ6IHRydWUgfSk7XG5cbiAgICBjb25zdCBwZWVycyA9IFtcbiAgICAgIG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnUGVlckdyb3VwJywgeyB2cGMgfSksXG4gICAgICBQZWVyLmFueUlwdjQoKSxcbiAgICAgIFBlZXIuYW55SXB2NigpLFxuICAgICAgUGVlci5wcmVmaXhMaXN0KCdwbC0wMTIzNDUnKSxcbiAgICAgIFBlZXIuc2VjdXJpdHlHcm91cElkKCdzZy0wMTIzNDU2NzgnKSxcbiAgICBdO1xuXG4gICAgY29uc3QgcG9ydHMgPSBbXG4gICAgICBQb3J0LnRjcCgxMjM0KSxcbiAgICAgIFBvcnQudGNwKExhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gNTAwMCB9KSksXG4gICAgICBQb3J0LmFsbFRjcCgpLFxuICAgICAgUG9ydC50Y3BSYW5nZSg4MCwgOTApLFxuICAgICAgUG9ydC51ZHAoMjM0NSksXG4gICAgICBQb3J0LnVkcChMYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDc3NzcgfSkpLFxuICAgICAgUG9ydC5hbGxVZHAoKSxcbiAgICAgIFBvcnQudWRwUmFuZ2UoODUsIDk1KSxcbiAgICAgIFBvcnQuaWNtcFR5cGVBbmRDb2RlKDUsIDEpLFxuICAgICAgUG9ydC5pY21wVHlwZSg4KSxcbiAgICAgIFBvcnQuYWxsSWNtcCgpLFxuICAgICAgUG9ydC5pY21wUGluZygpLFxuICAgICAgUG9ydC5hbGxUcmFmZmljKCksXG4gICAgXTtcblxuICAgIC8vIFdIRU5cbiAgICBmb3IgKGNvbnN0IHBlZXIgb2YgcGVlcnMpIHtcbiAgICAgIGZvciAoY29uc3QgcG9ydCBvZiBwb3J0cykge1xuICAgICAgICBzZy5jb25uZWN0aW9ucy5hbGxvd1RvKHBlZXIsIHBvcnQpO1xuICAgICAgICBzZy5jb25uZWN0aW9ucy5hbGxvd0Zyb20ocGVlciwgcG9ydCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVEhFTiAtLSBubyBjcmFzaFxuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBtdWx0aXBsZSBydWxlcyB1c2luZyB0b2tlbnMgb24gc2FtZSBzZWN1cml0eSBncm91cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3OCcsIHJlZ2lvbjogJ2R1bW15JyB9IH0pO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBzZyA9IG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYyB9KTtcblxuICAgIGNvbnN0IHAxID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnZHVtbXlpZDEnIH0pO1xuICAgIGNvbnN0IHAyID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnZHVtbXlpZDInIH0pO1xuICAgIGNvbnN0IHBlZXIxID0gUGVlci5wcmVmaXhMaXN0KHAxKTtcbiAgICBjb25zdCBwZWVyMiA9IFBlZXIucHJlZml4TGlzdChwMik7XG5cbiAgICAvLyBXSEVOXG4gICAgc2cuYWRkSW5ncmVzc1J1bGUocGVlcjEsIFBvcnQudGNwKDU0MzIpLCAnUnVsZSAxJyk7XG4gICAgc2cuYWRkSW5ncmVzc1J1bGUocGVlcjIsIFBvcnQudGNwKDU0MzIpLCAnUnVsZSAyJyk7XG5cbiAgICAvLyBUSEVOIC0tIG5vIGNyYXNoXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgIERlc2NyaXB0aW9uOiAnUnVsZSAxJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgRGVzY3JpcHRpb246ICdSdWxlIDInLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiB0b2tlbnMgYXJlIHVzZWQgaW4gcG9ydHMsIGBjYW5JbmxpbmVSdWxlYCBzaG91bGQgYmUgZmFsc2UgdG8gYXZvaWQgY3ljbGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcDEgPSBMYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDgwIH0pO1xuICAgIGNvbnN0IHAyID0gTGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA1MDAwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBvcnRzID0gW1xuICAgICAgUG9ydC50Y3AocDEpLFxuICAgICAgUG9ydC50Y3AocDIpLFxuICAgICAgUG9ydC50Y3BSYW5nZShwMSwgOTApLFxuICAgICAgUG9ydC50Y3BSYW5nZSg4MCwgcDIpLFxuICAgICAgUG9ydC50Y3BSYW5nZShwMSwgcDIpLFxuICAgICAgUG9ydC51ZHAocDEpLFxuICAgICAgUG9ydC51ZHBSYW5nZShwMSwgOTUpLFxuICAgICAgUG9ydC51ZHBSYW5nZSg4NSwgcDIpLFxuICAgICAgUG9ydC51ZHBSYW5nZShwMSwgcDIpLFxuICAgICAgUG9ydC5pY21wVHlwZUFuZENvZGUocDEsIDEpLFxuICAgICAgUG9ydC5pY21wVHlwZUFuZENvZGUoNSwgcDEpLFxuICAgICAgUG9ydC5pY21wVHlwZUFuZENvZGUocDEsIHAyKSxcbiAgICAgIFBvcnQuaWNtcFR5cGUocDEpLFxuICAgIF07XG5cbiAgICAvLyBUSEVOXG4gICAgZm9yIChjb25zdCByYW5nZSBvZiBwb3J0cykge1xuICAgICAgZXhwZWN0KHJhbmdlLmNhbklubGluZVJ1bGUpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH1cblxuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdQZWVyIElQIENJRFIgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdwYXNzZXMgd2l0aCB2YWxpZCBJUHY0IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgY2lkcklwcyA9IFsnMC4wLjAuMC8wJywgJzE5Mi4xNjguMjU1LjI1NS8yNCddO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBmb3IgKGNvbnN0IGNpZHJJcCBvZiBjaWRySXBzKSB7XG4gICAgICAgIGV4cGVjdChQZWVyLmlwdjQoY2lkcklwKS51bmlxdWVJZCkudG9FcXVhbChjaWRySXApO1xuICAgICAgfVxuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Bhc3NlcyB3aXRoIHVucmVzb2x2ZWQgSVAgQ0lEUiB0b2tlbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBUb2tlbi5hc1N0cmluZyhuZXcgSW50cmluc2ljKCdpcCcpKTtcblxuICAgICAgLy8gVEhFTjogZG9uJ3QgdGhyb3dcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgaWYgaW52YWxpZCBJUHY0IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBQZWVyLmlwdjQoJ2ludmFsaWQnKTtcbiAgICAgIH0pLnRvVGhyb3coL0ludmFsaWQgSVB2NCBDSURSLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIG1pc3NpbmcgbWFzayBpbiBJUHY0IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBQZWVyLmlwdjQoJzAuMC4wLjAnKTtcbiAgICAgIH0pLnRvVGhyb3coL0NJRFIgbWFzayBpcyBtaXNzaW5nIGluIElQdjQvKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwYXNzZXMgd2l0aCB2YWxpZCBJUHY2IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgY2lkcklwcyA9IFtcbiAgICAgICAgJzo6LzAnLFxuICAgICAgICAnMjAwMTpkYjg6Oi8zMicsXG4gICAgICAgICcyMDAxOjBkYjg6MDAwMDowMDAwOjAwMDA6OGEyZTowMzcwOjczMzQvMzInLFxuICAgICAgICAnMjAwMTpkYjg6OjhhMmU6MzcwOjczMzQvMzInLFxuICAgICAgXTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZm9yIChjb25zdCBjaWRySXAgb2YgY2lkcklwcykge1xuICAgICAgICBleHBlY3QoUGVlci5pcHY2KGNpZHJJcCkudW5pcXVlSWQpLnRvRXF1YWwoY2lkcklwKTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgaWYgaW52YWxpZCBJUHY2IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBQZWVyLmlwdjYoJ2ludmFsaWQnKTtcbiAgICAgIH0pLnRvVGhyb3coL0ludmFsaWQgSVB2NiBDSURSLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIG1pc3NpbmcgbWFzayBpbiBJUHY2IENJRFIgYmxvY2snLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBQZWVyLmlwdjYoJzo6Jyk7XG4gICAgICB9KS50b1Rocm93KC9JRFIgbWFzayBpcyBtaXNzaW5nIGluIElQdjYvKTtcblxuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdQZWVyIHNlY3VyaXR5IGdyb3VwIElEIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgncGFzc2VzIHdpdGggdmFsaWQgc2VjdXJpdHkgZ3JvdXAgSUQnLCAoKSA9PiB7XG4gICAgICAvL0dJVkVOXG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwSWRzID0gWydzZy0xMjM0NTY3OCcsICdzZy0wMTIzNDU2Nzg5YWJjZGVmZyddO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBmb3IgKGNvbnN0IHNlY3VyaXR5R3JvdXBJZCBvZiBzZWN1cml0eUdyb3VwSWRzKSB7XG4gICAgICAgIGV4cGVjdChQZWVyLnNlY3VyaXR5R3JvdXBJZChzZWN1cml0eUdyb3VwSWQpLnVuaXF1ZUlkKS50b0VxdWFsKHNlY3VyaXR5R3JvdXBJZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwYXNzZXMgd2l0aCB2YWxpZCBzZWN1cml0eSBncm91cCBJRCBhbmQgc291cmNlIG93bmVyIGlkJywgKCkgPT4ge1xuICAgICAgLy9HSVZFTlxuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cElkcyA9IFsnc2ctMTIzNDU2NzgnLCAnc2ctMDEyMzQ1Njc4OWFiY2RlZmcnXTtcbiAgICAgIGNvbnN0IG93bmVySWRzID0gWycwMDAwMDAwMDAwMDAnLCAnMDAwMDAwMDAwMDAxJ107XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGZvciAoY29uc3Qgc2VjdXJpdHlHcm91cElkIG9mIHNlY3VyaXR5R3JvdXBJZHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBvd25lcklkIG9mIG93bmVySWRzKSB7XG4gICAgICAgICAgZXhwZWN0KFBlZXIuc2VjdXJpdHlHcm91cElkKHNlY3VyaXR5R3JvdXBJZCwgb3duZXJJZCkudW5pcXVlSWQpLnRvRXF1YWwoc2VjdXJpdHlHcm91cElkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGVzdCgncGFzc2VzIHdpdGggdW5yZXNvbHZlZCBzZWN1cml0eSBncm91cCBpZCB0b2tlbiBvciBvd25lciBpZCB0b2tlbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBUb2tlbi5hc1N0cmluZygnc2VjdXJpdHlHcm91cElkJyk7XG5cbiAgICAgIGNvbnN0IHNlY3VyaXR5R3JvdXBJZCA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3NnLTAxMjM0NTY3JyB9KTtcbiAgICAgIGNvbnN0IG93bmVySWQgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICcwMDAwMDAwMDAwMDAnIH0pO1xuICAgICAgUGVlci5zZWN1cml0eUdyb3VwSWQoc2VjdXJpdHlHcm91cElkKTtcbiAgICAgIFBlZXIuc2VjdXJpdHlHcm91cElkKHNlY3VyaXR5R3JvdXBJZCwgb3duZXJJZCk7XG5cbiAgICAgIC8vIFRIRU46IGRvbid0IHRocm93XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgaWYgaW52YWxpZCBzZWN1cml0eSBncm91cCBJRCcsICgpID0+IHtcbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIFBlZXIuc2VjdXJpdHlHcm91cElkKCdpbnZhbGlkJyk7XG4gICAgICB9KS50b1Rocm93KC9JbnZhbGlkIHNlY3VyaXR5IGdyb3VwIElELyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGlmIGludmFsaWQgc291cmNlIHNlY3VyaXR5IGdyb3VwIGlkJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgUGVlci5zZWN1cml0eUdyb3VwSWQoJ3NnLTEyMzQ1Njc4JywgJ2ludmFsaWQnKTtcbiAgICAgIH0pLnRvVGhyb3coL0ludmFsaWQgc2VjdXJpdHkgZ3JvdXAgb3duZXIgSUQvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1NvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkIHByb3BlcnR5IHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnU291cmNlU2VjdXJpdHlHcm91cE93bmVySWQgcHJvcGVydHkgaXMgbm90IHByZXNlbnQgd2hlbiB2YWx1ZSBpcyBub3QgcHJvdmlkZWQgdG8gaW5ncmVzcyBydWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHJywgeyB2cGMgfSk7XG5cbiAgICAgIC8vV0hFTlxuICAgICAgc2cuYWRkSW5ncmVzc1J1bGUoUGVlci5zZWN1cml0eUdyb3VwSWQoJ3NnLTEyMzQ1Njc4OScpLCBQb3J0LmFsbFRjcCgpLCAnbm8gb3duZXIgaWQgcHJvcGVydHknKTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbe1xuICAgICAgICAgIFNvdXJjZVNlY3VyaXR5R3JvdXBJZDogJ3NnLTEyMzQ1Njc4OScsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdubyBvd25lciBpZCBwcm9wZXJ0eScsXG4gICAgICAgICAgRnJvbVBvcnQ6IDAsXG4gICAgICAgICAgVG9Qb3J0OiA2NTUzNSxcbiAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgfV0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1NvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkIHByb3BlcnR5IGlzIHByZXNlbnQgd2hlbiB2YWx1ZSBpcyBwcm92aWRlZCB0byBpbmdyZXNzIHJ1bGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBzZyA9IG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYyB9KTtcblxuICAgICAgLy9XSEVOXG4gICAgICBzZy5hZGRJbmdyZXNzUnVsZShQZWVyLnNlY3VyaXR5R3JvdXBJZCgnc2ctMTIzNDU2Nzg5JywgJzAwMDAwMDAwMDAwMCcpLCBQb3J0LmFsbFRjcCgpLCAnY29udGFpbnMgb3duZXIgaWQgcHJvcGVydHknKTtcblxuICAgICAgLy9USEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbe1xuICAgICAgICAgIFNvdXJjZVNlY3VyaXR5R3JvdXBJZDogJ3NnLTEyMzQ1Njc4OScsXG4gICAgICAgICAgU291cmNlU2VjdXJpdHlHcm91cE93bmVySWQ6ICcwMDAwMDAwMDAwMDAnLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnY29udGFpbnMgb3duZXIgaWQgcHJvcGVydHknLFxuICAgICAgICAgIEZyb21Qb3J0OiAwLFxuICAgICAgICAgIFRvUG9ydDogNjU1MzUsXG4gICAgICAgICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdTb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCBwcm9wZXJ0eSBpcyBub3QgcHJlc2VudCB3aGVuIHZhbHVlIGlzIHByb3ZpZGVkIHRvIGVncmVzcyBydWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHJywgeyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlIH0pO1xuXG4gICAgICAvL1dIRU5cbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5zZWN1cml0eUdyb3VwSWQoJ3NnLTEyMzQ1Njc4OScsICcwMDAwMDAwMDAwMDAnKSwgUG9ydC5hbGxUY3AoKSwgJ25vIG93bmVyIGlkIHByb3BlcnR5Jyk7XG5cbiAgICAgIC8vVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbe1xuICAgICAgICAgIERlc3RpbmF0aW9uU2VjdXJpdHlHcm91cElkOiAnc2ctMTIzNDU2Nzg5JyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ25vIG93bmVyIGlkIHByb3BlcnR5JyxcbiAgICAgICAgICBGcm9tUG9ydDogMCxcbiAgICAgICAgICBUb1BvcnQ6IDY1NTM1LFxuICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc2VjdXJpdHkgZ3JvdXAgbG9va3VwJywgKCkgPT4ge1xuICB0ZXN0RGVwcmVjYXRlZCgnY2FuIGxvb2sgdXAgYSBzZWN1cml0eSBncm91cCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBTZWN1cml0eUdyb3VwLmZyb21Mb29rdXAoc3RhY2ssICdzdGFjaycsICdzZy0xMjM0Jyk7XG5cbiAgICBleHBlY3Qoc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQpLnRvRXF1YWwoJ3NnLTEyMzQ1Njc4Jyk7XG4gICAgZXhwZWN0KHNlY3VyaXR5R3JvdXAuYWxsb3dBbGxPdXRib3VuZCkudG9FcXVhbCh0cnVlKTtcblxuICB9KTtcblxuICB0ZXN0KCdjYW4gbG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIGJ5IGlkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0JyxcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IFNlY3VyaXR5R3JvdXAuZnJvbUxvb2t1cEJ5SWQoc3RhY2ssICdTRzEnLCAnc2ctMTIzNDUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQpLnRvRXF1YWwoJ3NnLTEyMzQ1Njc4Jyk7XG4gICAgZXhwZWN0KHNlY3VyaXR5R3JvdXAuYWxsb3dBbGxPdXRib3VuZCkudG9FcXVhbCh0cnVlKTtcblxuICB9KTtcblxuICB0ZXN0KCdjYW4gbG9vayB1cCBhIHNlY3VyaXR5IGdyb3VwIGJ5IG5hbWUgYW5kIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNCcsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBTZWN1cml0eUdyb3VwLmZyb21Mb29rdXBCeU5hbWUoc3RhY2ssICdTRzEnLCAnc2ctMTIzNDUnLCB2cGMpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzZWN1cml0eUdyb3VwLnNlY3VyaXR5R3JvdXBJZCkudG9FcXVhbCgnc2ctMTIzNDU2NzgnKTtcbiAgICBleHBlY3Qoc2VjdXJpdHlHcm91cC5hbGxvd0FsbE91dGJvdW5kKS50b0VxdWFsKHRydWUpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBsb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgYnkgaWQgYW5kIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNCcsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdnBjID0gVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVlBDJywge1xuICAgICAgdnBjSWQ6ICd2cGMtMTIzNCcsXG4gICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBTZWN1cml0eUdyb3VwLmZyb21Mb29rdXBCeU5hbWUoc3RhY2ssICdTRzEnLCAnbXktc2VjdXJpdHktZ3JvdXAnLCB2cGMpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzZWN1cml0eUdyb3VwLnNlY3VyaXR5R3JvdXBJZCkudG9FcXVhbCgnc2ctMTIzNDU2NzgnKTtcbiAgICBleHBlY3Qoc2VjdXJpdHlHcm91cC5hbGxvd0FsbE91dGJvdW5kKS50b0VxdWFsKHRydWUpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBsb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgYW5kIHVzZSBpdCBhcyBhIHBlZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgIHZwY0lkOiAndnBjLTEyMzQnLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZXM6IFsnZHVtbXkxYScsICdkdW1teTFiJywgJ2R1bW15MWMnXSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gU2VjdXJpdHlHcm91cC5mcm9tTG9va3VwQnlOYW1lKHN0YWNrLCAnU0cxJywgJ215LXNlY3VyaXR5LWdyb3VwJywgdnBjKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgUGVlci5zZWN1cml0eUdyb3VwSWQoc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQpO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBzZWN1cml0eUdyb3VwSWQgaXMgdG9rZW5pemVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0JyxcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFNlY3VyaXR5R3JvdXAuZnJvbUxvb2t1cEJ5SWQoc3RhY2ssICdzdGFjaycsIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3NnLTEyMzQ1JyB9KSk7XG4gICAgfSkudG9UaHJvdygnQWxsIGFyZ3VtZW50cyB0byBsb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgbXVzdCBiZSBjb25jcmV0ZSAobm8gVG9rZW5zKScpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBzZWN1cml0eUdyb3VwTmFtZSBpcyB0b2tlbml6ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgU2VjdXJpdHlHcm91cC5mcm9tTG9va3VwQnlJZChzdGFjaywgJ3N0YWNrJywgTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnbXktc2VjdXJpdHktZ3JvdXAnIH0pKTtcbiAgICB9KS50b1Rocm93KCdBbGwgYXJndW1lbnRzIHRvIGxvb2sgdXAgYSBzZWN1cml0eSBncm91cCBtdXN0IGJlIGNvbmNyZXRlIChubyBUb2tlbnMpJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHZwYyBpZCBpcyB0b2tlbml6ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHZwYyA9IFZwYy5mcm9tVnBjQXR0cmlidXRlcyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgIHZwY0lkOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICd2cGMtMTIzNCcgfSksXG4gICAgICBhdmFpbGFiaWxpdHlab25lczogWydkdW1teTFhJywgJ2R1bW15MWInLCAnZHVtbXkxYyddLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBTZWN1cml0eUdyb3VwLmZyb21Mb29rdXBCeU5hbWUoc3RhY2ssICdzdGFjaycsICdteS1zZWN1cml0eS1ncm91cCcsIHZwYyk7XG4gICAgfSkudG9UaHJvdygnQWxsIGFyZ3VtZW50cyB0byBsb29rIHVwIGEgc2VjdXJpdHkgZ3JvdXAgbXVzdCBiZSBjb25jcmV0ZSAobm8gVG9rZW5zKScpO1xuXG4gIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gdGVzdFJ1bGVzQXJlSW5saW5lZChjb250ZXh0RGlzYWJsZUlubGluZVJ1bGVzOiBib29sZWFuIHwgdW5kZWZpbmVkIHwgbnVsbCwgb3B0aW9uc0Rpc2FibGVJbmxpbmVSdWxlczogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuXG4gIGRlc2NyaWJlKCdXaGVuIGFsbG93QWxsT3V0Ym91bmQnLCAoKSA9PiB7XG4gICAgdGVzdCgnbmV3IFNlY3VyaXR5R3JvdXAgd2lsbCBjcmVhdGUgYW4gaW5saW5lIFNlY3VyaXR5R3JvdXBFZ3Jlc3MgcnVsZSB0byBhbGxvdyBhbGwgdHJhZmZpYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZLCBjb250ZXh0RGlzYWJsZUlubGluZVJ1bGVzKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IHByb3BzOiBTZWN1cml0eUdyb3VwUHJvcHMgPSB7IHZwYywgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cxJywgcHJvcHMpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L1NHMScsXG4gICAgICAgIFZwY0lkOiBzdGFjay5yZXNvbHZlKHZwYy52cGNJZCksXG4gICAgICAgIFNlY3VyaXR5R3JvdXBFZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEVncmVzc1J1bGUgcnVsZSB3aWxsIG5vdCBtb2RpZnkgZWdyZXNzIHJ1bGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQudGNwKDg2KSwgJ0FuIGV4dGVybmFsIFJ1bGUnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9TRzEnLFxuICAgICAgICBWcGNJZDogc3RhY2sucmVzb2x2ZSh2cGMudnBjSWQpLFxuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywgMCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEluZ3Jlc3NSdWxlIHdpbGwgYWRkIGEgbmV3IGluZ3Jlc3MgcnVsZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZLCBjb250ZXh0RGlzYWJsZUlubGluZVJ1bGVzKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IHByb3BzOiBTZWN1cml0eUdyb3VwUHJvcHMgPSB7IHZwYywgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCBwcm9wcyk7XG4gICAgICBzZy5hZGRJbmdyZXNzUnVsZShQZWVyLmFueUlwdjQoKSwgUG9ydC50Y3AoODYpLCAnQW4gZXh0ZXJuYWwgUnVsZScpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L1NHMScsXG4gICAgICAgIFZwY0lkOiBzdGFjay5yZXNvbHZlKHZwYy52cGNJZCksXG4gICAgICAgIFNlY3VyaXR5R3JvdXBJbmdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQW4gZXh0ZXJuYWwgUnVsZScsXG4gICAgICAgICAgICBGcm9tUG9ydDogODYsXG4gICAgICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgIFRvUG9ydDogODYsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gZG8gbm90IGFsbG93QWxsT3V0Ym91bmQnLCAoKSA9PiB7XG4gICAgdGVzdCgnbmV3IFNlY3VyaXR5R3JvdXAgcnVsZSB3aWxsIGNyZWF0ZSBhbiBlZ3Jlc3MgcnVsZSB0aGF0IGRlbmllcyBhbGwgdHJhZmZpYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZLCBjb250ZXh0RGlzYWJsZUlubGluZVJ1bGVzKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IHByb3BzOiBTZWN1cml0eUdyb3VwUHJvcHMgPSB7IHZwYywgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsIGRpc2FibGVJbmxpbmVSdWxlczogb3B0aW9uc0Rpc2FibGVJbmxpbmVSdWxlcyB9O1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9TRzEnLFxuICAgICAgICBWcGNJZDogc3RhY2sucmVzb2x2ZSh2cGMudnBjSWQpLFxuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMjU1LjI1NS4yNTUuMjU1LzMyJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnRGlzYWxsb3cgYWxsIHRyYWZmaWMnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICAgICAgRnJvbVBvcnQ6IDI1MixcbiAgICAgICAgICAgIFRvUG9ydDogODYsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIDApO1xuXG5cbiAgICB9KTtcbiAgICB0ZXN0KCdhZGRFZ3Jlc3NSdWxlIHJ1bGUgd2lsbCBhZGQgYSBuZXcgaW5saW5lIGVncmVzcyBydWxlIGFuZCByZW1vdmUgdGhlIGRlbnlBbGxUcmFmZmljIHJ1bGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSwgY29udGV4dERpc2FibGVJbmxpbmVSdWxlcyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBwcm9wczogU2VjdXJpdHlHcm91cFByb3BzID0geyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQudGNwKDg2KSwgJ0FuIGlubGluZSBSdWxlJyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FuIGlubGluZSBSdWxlJyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIDApO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRJbmdyZXNzUnVsZSB3aWxsIGFkZCBhIG5ldyBpbmdyZXNzIHJ1bGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSwgY29udGV4dERpc2FibGVJbmxpbmVSdWxlcyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBwcm9wczogU2VjdXJpdHlHcm91cFByb3BzID0geyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEluZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4NiksICdBbiBleHRlcm5hbCBSdWxlJyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgICAgU2VjdXJpdHlHcm91cEluZ3Jlc3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdBbiBleHRlcm5hbCBSdWxlJyxcbiAgICAgICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBTZWN1cml0eUdyb3VwRWdyZXNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ2lkcklwOiAnMjU1LjI1NS4yNTUuMjU1LzMyJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnRGlzYWxsb3cgYWxsIHRyYWZmaWMnLFxuICAgICAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICAgICAgRnJvbVBvcnQ6IDI1MixcbiAgICAgICAgICAgIFRvUG9ydDogODYsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEluZ3Jlc3MnLCAwKTtcblxuICAgIH0pO1xuICB9KTtcblxufTtcblxuXG5mdW5jdGlvbiB0ZXN0UnVsZXNBcmVOb3RJbmxpbmVkKGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXM6IGJvb2xlYW4gfCB1bmRlZmluZWQgfCBudWxsLCBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzOiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG5cbiAgZGVzY3JpYmUoJ1doZW4gYWxsb3dBbGxPdXRib3VuZCcsICgpID0+IHtcbiAgICB0ZXN0KCduZXcgU2VjdXJpdHlHcm91cCB3aWxsIGNyZWF0ZSBhbiBleHRlcm5hbCBTZWN1cml0eUdyb3VwRWdyZXNzIHJ1bGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSwgY29udGV4dERpc2FibGVJbmxpbmVSdWxlcyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBwcm9wczogU2VjdXJpdHlHcm91cFByb3BzID0geyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsIGRpc2FibGVJbmxpbmVSdWxlczogb3B0aW9uc0Rpc2FibGVJbmxpbmVSdWxlcyB9O1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZyA9IG5ldyBTZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cxJywgcHJvcHMpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L1NHMScsXG4gICAgICAgIFZwY0lkOiBzdGFjay5yZXNvbHZlKHZwYy52cGNJZCksXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICAgICAgR3JvdXBJZDogc3RhY2sucmVzb2x2ZShzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICBJcFByb3RvY29sOiAnLTEnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEluZ3Jlc3NSdWxlIHJ1bGUgd2lsbCBub3QgcmVtb3ZlIGV4dGVybmFsIGFsbG93QWxsT3V0Ym91bmQgcnVsZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KFNFQ1VSSVRZX0dST1VQX0RJU0FCTEVfSU5MSU5FX1JVTEVTX0NPTlRFWFRfS0VZLCBjb250ZXh0RGlzYWJsZUlubGluZVJ1bGVzKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IHByb3BzOiBTZWN1cml0eUdyb3VwUHJvcHMgPSB7IHZwYywgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCBwcm9wcyk7XG4gICAgICBzZy5hZGRFZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4NiksICdBbiBleHRlcm5hbCBSdWxlJyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgICAgIEdyb3VwSWQ6IHN0YWNrLnJlc29sdmUoc2cuc2VjdXJpdHlHcm91cElkKSxcbiAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgRGVzY3JpcHRpb246ICdBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBieSBkZWZhdWx0JyxcbiAgICAgICAgSXBQcm90b2NvbDogJy0xJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEluZ3Jlc3NSdWxlIHJ1bGUgd2lsbCBub3QgYWRkIGEgbmV3IGVncmVzcyBydWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQudGNwKDg2KSwgJ0FuIGV4dGVybmFsIFJ1bGUnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9TRzEnLFxuICAgICAgICBWcGNJZDogc3RhY2sucmVzb2x2ZSh2cGMudnBjSWQpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGVncmVzc0dyb3VwcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgICAgIEdyb3VwSWQ6IHN0YWNrLnJlc29sdmUoc2cuc2VjdXJpdHlHcm91cElkKSxcbiAgICAgICAgRGVzY3JpcHRpb246ICdBbiBleHRlcm5hbCBSdWxlJyxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGVncmVzc0dyb3VwcykubGVuZ3RoKS50b0JlKDApO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRJbmdyZXNzUnVsZSBydWxlIHdpbGwgYWRkIGEgbmV3IGV4dGVybmFsIGluZ3Jlc3MgcnVsZSBldmVuIGlmIGl0IGNvdWxkIGhhdmUgYmVlbiBpbmxpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEluZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4NiksICdBbiBleHRlcm5hbCBSdWxlJyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgICBHcm91cElkOiBzdGFjay5yZXNvbHZlKHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgIERlc2NyaXB0aW9uOiAnQW4gZXh0ZXJuYWwgUnVsZScsXG4gICAgICAgIEZyb21Qb3J0OiA4NixcbiAgICAgICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgIFRvUG9ydDogODYsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgICBHcm91cElkOiBzdGFjay5yZXNvbHZlKHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIENpZHJJcDogJzAuMC4wLjAvMCcsXG4gICAgICAgIERlc2NyaXB0aW9uOiAnQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYnkgZGVmYXVsdCcsXG4gICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnV2hlbiBkbyBub3QgYWxsb3dBbGxPdXRib3VuZCcsICgpID0+IHtcbiAgICB0ZXN0KCduZXcgU2VjdXJpdHlHcm91cCBydWxlIHdpbGwgY3JlYXRlIGFuIGV4dGVybmFsIGVncmVzcyBydWxlIHRoYXQgZGVuaWVzIGFsbCB0cmFmZmljJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCBwcm9wcyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIDApO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgICBHcm91cElkOiBzdGFjay5yZXNvbHZlKHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIENpZHJJcDogJzI1NS4yNTUuMjU1LjI1NS8zMicsXG4gICAgICAgIERlc2NyaXB0aW9uOiAnRGlzYWxsb3cgYWxsIHRyYWZmaWMnLFxuICAgICAgICBJcFByb3RvY29sOiAnaWNtcCcsXG4gICAgICAgIEZyb21Qb3J0OiAyNTIsXG4gICAgICAgIFRvUG9ydDogODYsXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkRWdyZXNzUnVsZSBydWxlIHdpbGwgcmVtb3ZlIHRoZSBydWxlIHRoYXQgZGVuaWVzIGFsbCB0cmFmZmljIGlmIGFub3RoZXIgZWdyZXNzIHJ1bGUgaXMgYWRkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChTRUNVUklUWV9HUk9VUF9ESVNBQkxFX0lOTElORV9SVUxFU19DT05URVhUX0tFWSwgY29udGV4dERpc2FibGVJbmxpbmVSdWxlcyk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBwcm9wczogU2VjdXJpdHlHcm91cFByb3BzID0geyB2cGMsIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLCBkaXNhYmxlSW5saW5lUnVsZXM6IG9wdGlvbnNEaXNhYmxlSW5saW5lUnVsZXMgfTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2cgPSBuZXcgU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHByb3BzKTtcbiAgICAgIHNnLmFkZEVncmVzc1J1bGUoUGVlci5hbnlJcHY0KCksIFBvcnQudGNwKDg2KSwgJ0FuIGV4dGVybmFsIFJ1bGUnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgICBHcm91cERlc2NyaXB0aW9uOiAnRGVmYXVsdC9TRzEnLFxuICAgICAgICBWcGNJZDogc3RhY2sucmVzb2x2ZSh2cGMudnBjSWQpLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG4gICAgICBjb25zdCBlZ3Jlc3NHcm91cHMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwRWdyZXNzJywge1xuICAgICAgICBHcm91cElkOiBzdGFjay5yZXNvbHZlKHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIENpZHJJcDogJzI1NS4yNTUuMjU1LjI1NS8zMicsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhlZ3Jlc3NHcm91cHMpLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEVncmVzc1J1bGUgcnVsZSB3aWxsIGFkZCBhIG5ldyBleHRlcm5hbCBlZ3Jlc3MgcnVsZSBldmVuIGlmIGl0IGNvdWxkIGhhdmUgYmVlbiBpbmxpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCBwcm9wcyk7XG4gICAgICBzZy5hZGRFZ3Jlc3NSdWxlKFBlZXIuYW55SXB2NCgpLCBQb3J0LnRjcCg4NiksICdBbiBleHRlcm5hbCBSdWxlJyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0RlZmF1bHQvU0cxJyxcbiAgICAgICAgVnBjSWQ6IHN0YWNrLnJlc29sdmUodnBjLnZwY0lkKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgICAgIEdyb3VwSWQ6IHN0YWNrLnJlc29sdmUoc2cuc2VjdXJpdHlHcm91cElkKSxcbiAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgRGVzY3JpcHRpb246ICdBbiBleHRlcm5hbCBSdWxlJyxcbiAgICAgICAgRnJvbVBvcnQ6IDg2LFxuICAgICAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgVG9Qb3J0OiA4NixcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywgMCk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZEluZ3Jlc3NSdWxlIHdpbGwgYWRkIGEgbmV3IGV4dGVybmFsIGluZ3Jlc3MgcnVsZSBldmVuIGlmIGl0IGNvdWxkIGhhdmUgYmVlbiBpbmxpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoU0VDVVJJVFlfR1JPVVBfRElTQUJMRV9JTkxJTkVfUlVMRVNfQ09OVEVYVF9LRVksIGNvbnRleHREaXNhYmxlSW5saW5lUnVsZXMpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgcHJvcHM6IFNlY3VyaXR5R3JvdXBQcm9wcyA9IHsgdnBjLCBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSwgZGlzYWJsZUlubGluZVJ1bGVzOiBvcHRpb25zRGlzYWJsZUlubGluZVJ1bGVzIH07XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzEnLCBwcm9wcyk7XG4gICAgICBzZy5hZGRJbmdyZXNzUnVsZShQZWVyLmFueUlwdjQoKSwgUG9ydC50Y3AoODYpLCAnQW4gZXh0ZXJuYWwgUnVsZScpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L1NHMScsXG4gICAgICAgIFZwY0lkOiBzdGFjay5yZXNvbHZlKHZwYy52cGNJZCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgICAgR3JvdXBJZDogc3RhY2sucmVzb2x2ZShzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBDaWRySXA6ICcwLjAuMC4wLzAnLFxuICAgICAgICBEZXNjcmlwdGlvbjogJ0FuIGV4dGVybmFsIFJ1bGUnLFxuICAgICAgICBGcm9tUG9ydDogODYsXG4gICAgICAgIElwUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICAgICAgR3JvdXBJZDogc3RhY2sucmVzb2x2ZShzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBDaWRySXA6ICcyNTUuMjU1LjI1NS4yNTUvMzInLFxuICAgICAgICBEZXNjcmlwdGlvbjogJ0Rpc2FsbG93IGFsbCB0cmFmZmljJyxcbiAgICAgICAgSXBQcm90b2NvbDogJ2ljbXAnLFxuICAgICAgICBGcm9tUG9ydDogMjUyLFxuICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbn1cbiJdfQ==