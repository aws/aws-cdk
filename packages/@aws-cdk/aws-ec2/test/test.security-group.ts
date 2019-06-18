import { expect, haveResource } from '@aws-cdk/assert';
import { Lazy, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Peer, Port, SecurityGroup, Vpc } from "../lib";

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
          CidrIp: "0.0.0.0/0",
          Description: "Allow all outbound traffic by default",
          IpProtocol: "-1"
        }
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
    sg.addEgressRule(Peer.anyIpv4(), Port.tcpPort(86), 'This does not show up');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "Allow all outbound traffic by default",
          IpProtocol: "-1"
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
          CidrIp: "255.255.255.255/32",
          Description: "Disallow all traffic",
          FromPort: 252,
          IpProtocol: "icmp",
          ToPort: 86
        }
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
    sg.addEgressRule(Peer.anyIpv4(), Port.tcpPort(86), 'This replaces the other one');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "This replaces the other one",
          FromPort: 86,
          IpProtocol: "tcp",
          ToPort: 86
        }
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
      Port.tcpPort(1234),
      Port.tcpPort(Lazy.numberValue({ produce: () => 5000 })),
      Port.allTcp(),
      Port.tcpPortRange(80, 90),
      Port.udpPort(2345),
      Port.udpPort(Lazy.numberValue({ produce: () => 7777 })),
      Port.allUdp(),
      Port.udpPortRange(85, 95),
      Port.icmpTypeAndCode(5, 1),
      Port.icmpType(8),
      Port.allIcmp(),
      Port.icmpPing(),
      Port.allTraffic()
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
      Port.tcpPort(p1),
      Port.tcpPort(p2),
      Port.tcpPortRange(p1, 90),
      Port.tcpPortRange(80, p2),
      Port.tcpPortRange(p1, p2),
      Port.udpPort(p1),
      Port.udpPortRange(p1, 95),
      Port.udpPortRange(85, p2),
      Port.udpPortRange(p1, p2),
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
  }
};
