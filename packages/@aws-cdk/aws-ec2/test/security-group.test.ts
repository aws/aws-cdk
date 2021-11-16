import '@aws-cdk/assert-internal/jest';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Intrinsic, Lazy, Stack, Token } from '@aws-cdk/core';
import { Peer, Port, SecurityGroup, SecurityGroupProps, Vpc } from '../lib';

const SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY = '@aws-cdk/aws-ec2.securityGroupDisableInlineRules';

describe('security group', () => {
  test('security group can allows all outbound traffic by default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });

    // THEN
    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
    });


  });

  test('no new outbound rule is added if we are allowing all traffic anyway', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This does not show up');

    // THEN
    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });

    // THEN
    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This replaces the other one');

    // THEN
    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
    expect(() => {
      sg.addEgressRule(Peer.anyIpv4(), Port.allTraffic(), 'All traffic');
    }).toThrow(/Cannot add/);


  });

  test('immutable imports do not add rules', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const sg = SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'test-id', { mutable: false });
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This rule was not added');
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'This rule was not added');

    expect(stack).not.toHaveResource('AWS::EC2::SecurityGroup', {
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

    expect(stack).not.toHaveResource('AWS::EC2::SecurityGroup', {
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
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' } });
    const vpc = new Vpc(stack, 'VPC');
    const sg = new SecurityGroup(stack, 'SG', { vpc });

    const peers = [
      new SecurityGroup(stack, 'PeerGroup', { vpc }),
      Peer.anyIpv4(),
      Peer.anyIpv6(),
      Peer.prefixList('pl-012345'),
    ];

    const ports = [
      Port.tcp(1234),
      Port.tcp(Lazy.number({ produce: () => 5000 })),
      Port.allTcp(),
      Port.tcpRange(80, 90),
      Port.udp(2345),
      Port.udp(Lazy.number({ produce: () => 7777 })),
      Port.allUdp(),
      Port.udpRange(85, 95),
      Port.icmpTypeAndCode(5, 1),
      Port.icmpType(8),
      Port.allIcmp(),
      Port.icmpPing(),
      Port.allTraffic(),
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
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' } });
    const vpc = new Vpc(stack, 'VPC');
    const sg = new SecurityGroup(stack, 'SG', { vpc });

    const p1 = Lazy.string({ produce: () => 'dummyid1' });
    const p2 = Lazy.string({ produce: () => 'dummyid2' });
    const peer1 = Peer.prefixList(p1);
    const peer2 = Peer.prefixList(p2);

    // WHEN
    sg.addIngressRule(peer1, Port.tcp(5432), 'Rule 1');
    sg.addIngressRule(peer2, Port.tcp(5432), 'Rule 2');

    // THEN -- no crash
    expect(stack).toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {
      Description: 'Rule 1',
    });
    expect(stack).toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {
      Description: 'Rule 2',
    });
  });

  test('if tokens are used in ports, `canInlineRule` should be false to avoid cycles', () => {
    // GIVEN
    const p1 = Lazy.number({ produce: () => 80 });
    const p2 = Lazy.number({ produce: () => 5000 });

    // WHEN
    const ports = [
      Port.tcp(p1),
      Port.tcp(p2),
      Port.tcpRange(p1, 90),
      Port.tcpRange(80, p2),
      Port.tcpRange(p1, p2),
      Port.udp(p1),
      Port.udpRange(p1, 95),
      Port.udpRange(85, p2),
      Port.udpRange(p1, p2),
      Port.icmpTypeAndCode(p1, 1),
      Port.icmpTypeAndCode(5, p1),
      Port.icmpTypeAndCode(p1, p2),
      Port.icmpType(p1),
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
        expect(Peer.ipv4(cidrIp).uniqueId).toEqual(cidrIp);
      }


    });

    test('passes with unresolved IP CIDR token', () => {
      // GIVEN
      Token.asString(new Intrinsic('ip'));

      // THEN: don't throw


    });

    test('throws if invalid IPv4 CIDR block', () => {
      // THEN
      expect(() => {
        Peer.ipv4('invalid');
      }).toThrow(/Invalid IPv4 CIDR/);


    });

    test('throws if missing mask in IPv4 CIDR block', () => {
      expect(() => {
        Peer.ipv4('0.0.0.0');
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
        expect(Peer.ipv6(cidrIp).uniqueId).toEqual(cidrIp);
      }


    });

    test('throws if invalid IPv6 CIDR block', () => {
      // THEN
      expect(() => {
        Peer.ipv6('invalid');
      }).toThrow(/Invalid IPv6 CIDR/);


    });

    test('throws if missing mask in IPv6 CIDR block', () => {
      expect(() => {
        Peer.ipv6('::');
      }).toThrow(/IDR mask is missing in IPv6/);


    });
  });

  testDeprecated('can look up a security group', () => {
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    const securityGroup = SecurityGroup.fromLookup(stack, 'stack', 'sg-1234');

    expect(securityGroup.securityGroupId).toEqual('sg-12345');
    expect(securityGroup.allowAllOutbound).toEqual(true);

  });

  test('can look up a security group by id', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    // WHEN
    const securityGroup = SecurityGroup.fromLookupById(stack, 'SG1', 'sg-12345');

    // THEN
    expect(securityGroup.securityGroupId).toEqual('sg-12345');
    expect(securityGroup.allowAllOutbound).toEqual(true);

  });

  test('can look up a security group by name and vpc', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
      vpcId: 'vpc-1234',
      availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
    });

    // WHEN
    const securityGroup = SecurityGroup.fromLookupByName(stack, 'SG1', 'sg-12345', vpc);

    // THEN
    expect(securityGroup.securityGroupId).toEqual('sg-12345');
    expect(securityGroup.allowAllOutbound).toEqual(true);

  });

  test('can look up a security group by id and vpc', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
      vpcId: 'vpc-1234',
      availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
    });

    // WHEN
    const securityGroup = SecurityGroup.fromLookupByName(stack, 'SG1', 'my-security-group', vpc);

    // THEN
    expect(securityGroup.securityGroupId).toEqual('sg-12345');
    expect(securityGroup.allowAllOutbound).toEqual(true);

  });

  test('throws if securityGroupId is tokenized', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    // WHEN
    expect(() => {
      SecurityGroup.fromLookupById(stack, 'stack', Lazy.string({ produce: () => 'sg-12345' }));
    }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');

  });

  test('throws if securityGroupName is tokenized', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    // WHEN
    expect(() => {
      SecurityGroup.fromLookupById(stack, 'stack', Lazy.string({ produce: () => 'my-security-group' }));
    }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');

  });

  test('throws if vpc id is tokenized', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack', {
      env: {
        account: '1234',
        region: 'us-east-1',
      },
    });

    const vpc = Vpc.fromVpcAttributes(stack, 'VPC', {
      vpcId: Lazy.string({ produce: () => 'vpc-1234' }),
      availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
    });

    // WHEN
    expect(() => {
      SecurityGroup.fromLookupByName(stack, 'stack', 'my-security-group', vpc);
    }).toThrow('All arguments to look up a security group must be concrete (no Tokens)');

  });

});

function testRulesAreInlined(contextDisableInlineRules: boolean | undefined | null, optionsDisableInlineRules: boolean | undefined) {

  describe('When allowAllOutbound', () => {
    test('new SecurityGroup will create an inline SecurityGroupEgress rule to allow all traffic', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      new SecurityGroup(stack, 'SG1', props);

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupEgress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addEgressRule rule will not modify egress rules', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupEgress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule will add a new ingress rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      new SecurityGroup(stack, 'SG1', props);

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});


    });
    test('addEgressRule rule will add a new inline egress rule and remove the denyAllTraffic rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An inline Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupEgress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule will add a new ingress rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupEgress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });
  });

};


function testRulesAreNotInlined(contextDisableInlineRules: boolean | undefined | null, optionsDisableInlineRules: boolean | undefined) {

  describe('When allowAllOutbound', () => {
    test('new SecurityGroup will create an external SecurityGroupEgress rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });
      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '0.0.0.0/0',
        Description: 'Allow all outbound traffic by default',
        IpProtocol: '-1',
      });
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule rule will not remove external allowAllOutbound rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '0.0.0.0/0',
        Description: 'Allow all outbound traffic by default',
        IpProtocol: '-1',
      });

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule rule will not add a new egress rule', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });

      expect(stack).not.toHaveResource('AWS::EC2::SecurityGroupEgress', {
        GroupId: stack.resolve(sg.securityGroupId),
        Description: 'An external Rule',
      });

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule rule will add a new external ingress rule even if it could have been inlined', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: true, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '0.0.0.0/0',
        Description: 'An external Rule',
        FromPort: 86,
        IpProtocol: 'tcp',
        ToPort: 86,
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
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
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});
      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
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
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});
      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupEgress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '255.255.255.255/32',
      });

    });

    test('addEgressRule rule will add a new external egress rule even if it could have been inlined', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '0.0.0.0/0',
        Description: 'An external Rule',
        FromPort: 86,
        IpProtocol: 'tcp',
        ToPort: 86,
      });

      expect(stack).not.toHaveResourceLike('AWS::EC2::SecurityGroupIngress', {});

    });

    test('addIngressRule will add a new external ingress rule even if it could have been inlined', () => {
      // GIVEN
      const stack = new Stack();
      stack.node.setContext(SECURITY_GROUP_DISABLE_INLINE_RULES_CONTEXT_KEY, contextDisableInlineRules);
      const vpc = new Vpc(stack, 'VPC');
      const props: SecurityGroupProps = { vpc, allowAllOutbound: false, disableInlineRules: optionsDisableInlineRules };

      // WHEN
      const sg = new SecurityGroup(stack, 'SG1', props);
      sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'An external Rule');

      expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SG1',
        VpcId: stack.resolve(vpc.vpcId),
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
        GroupId: stack.resolve(sg.securityGroupId),
        CidrIp: '0.0.0.0/0',
        Description: 'An external Rule',
        FromPort: 86,
        IpProtocol: 'tcp',
        ToPort: 86,
      });

      expect(stack).toHaveResource('AWS::EC2::SecurityGroupEgress', {
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