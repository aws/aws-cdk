import { expect, haveResource, not } from '@aws-cdk/assert';
import { Intrinsic, Lazy, Stack, Token } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Peer, Port, SecurityGroup, Vpc } from '../lib';

export = {
  'security group can allows all outbound traffic by default'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
    }));

    test.done();
  },

  'no new outbound rule is added if we are allowing all traffic anyway'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: true });
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This does not show up');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
    }));

    test.done();
  },

  'security group disallow outbound traffic by default'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86,
        },
      ],
    }));

    test.done();
  },

  'bogus outbound rule disappears if another rule is added'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This replaces the other one');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'This replaces the other one',
          FromPort: 86,
          IpProtocol: 'tcp',
          ToPort: 86,
        },
      ],
    }));

    test.done();
  },

  'all outbound rule cannot be added after creation'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    const sg = new SecurityGroup(stack, 'SG1', { vpc, allowAllOutbound: false });
    test.throws(() => {
      sg.addEgressRule(Peer.anyIpv4(), Port.allTraffic(), 'All traffic');
    }, /Cannot add/);

    test.done();
  },

  'immutable imports do not add rules'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const sg = SecurityGroup.fromSecurityGroupId(stack, 'SG1', 'test-id', {mutable: false});
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(86), 'This rule was not added');
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(86), 'This rule was not added');

    expect(stack).to(not(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'This rule was not added',
          FromPort: 86,
          IpProtocol: 'tcp',
          ToPort: 86,
        },
      ],
    })));

    expect(stack).to(not(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'This rule was not added',
          FromPort: 86,
          IpProtocol: 'tcp',
          ToPort: 86,
        },
      ],
    })));

    test.done();
  },

  'peer between all types of peers and port range types'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'TestStack', { env: { account: '12345678', region: 'dummy' }});
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
      Port.tcp(Lazy.numberValue({ produce: () => 5000 })),
      Port.allTcp(),
      Port.tcpRange(80, 90),
      Port.udp(2345),
      Port.udp(Lazy.numberValue({ produce: () => 7777 })),
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

    test.done();
  },

  'if tokens are used in ports, `canInlineRule` should be false to avoid cycles'(test: Test) {
    // GIVEN
    const p1 = Lazy.numberValue({ produce: () => 80 });
    const p2 = Lazy.numberValue({ produce: () => 5000 });

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
      test.equal(range.canInlineRule, false, range.toString());
    }

    test.done();
  },

  'Peer IP CIDR validation': {
    'passes with valid IPv4 CIDR block'(test: Test) {
      // GIVEN
      const cidrIps = ['0.0.0.0/0', '192.168.255.255/24'];

      // THEN
      for (const cidrIp of cidrIps) {
        test.equal(Peer.ipv4(cidrIp).uniqueId, cidrIp);
      }

      test.done();
    },

    'passes with unresolved IP CIDR token'(test: Test) {
      // GIVEN
      Token.asString(new Intrinsic('ip'));

      // THEN: don't throw

      test.done();
    },

    'throws if invalid IPv4 CIDR block'(test: Test) {
      // THEN
      test.throws(() => {
        Peer.ipv4('invalid');
      }, /Invalid IPv4 CIDR/);

      test.done();
    },

    'throws if missing mask in IPv4 CIDR block'(test: Test) {
      test.throws(() => {
        Peer.ipv4('0.0.0.0');
      }, /CIDR mask is missing in IPv4/);

      test.done();
    },

    'passes with valid IPv6 CIDR block'(test: Test) {
      // GIVEN
      const cidrIps = [
        '::/0',
        '2001:db8::/32',
        '2001:0db8:0000:0000:0000:8a2e:0370:7334/32',
        '2001:db8::8a2e:370:7334/32',
      ];

      // THEN
      for (const cidrIp of cidrIps) {
        test.equal(Peer.ipv6(cidrIp).uniqueId, cidrIp);
      }

      test.done();
    },

    'throws if invalid IPv6 CIDR block'(test: Test) {
      // THEN
      test.throws(() => {
        Peer.ipv6('invalid');
      }, /Invalid IPv6 CIDR/);

      test.done();
    },

    'throws if missing mask in IPv6 CIDR block'(test: Test) {
      test.throws(() => {
        Peer.ipv6('::');
      }, /IDR mask is missing in IPv6/);

      test.done();
    },
  },
};
