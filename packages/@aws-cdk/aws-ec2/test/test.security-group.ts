import { expect, haveResource } from '@aws-cdk/assert';
import { Intrinsic, Lazy, Stack, Token } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';

import {
  AllTraffic,
  AnyIPv4,
  AnyIPv6,
  IcmpAllTypeCodes,
  IcmpAllTypesAndCodes,
  IcmpPing,
  IcmpTypeAndCode,
  PrefixList,
  SecurityGroup,
  TcpAllPorts,
  TcpPort,
  TcpPortRange,
  UdpAllPorts,
  UdpPort,
  UdpPortRange,
  Vpc
} from "../lib";

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
    sg.addEgressRule(new AnyIPv4(), new TcpPort(86), 'This does not show up');

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
    sg.addEgressRule(new AnyIPv4(), new TcpPort(86), 'This replaces the other one');

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
      sg.addEgressRule(new AnyIPv4(), new AllTraffic(), 'All traffic');
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
      new AnyIPv4(),
      new AnyIPv6(),
      new PrefixList('pl-012345'),
    ];

    const ports = [
      new TcpPort(1234),
      new TcpPort(Token.encodeAsNumber(new Intrinsic(5000))),
      new TcpAllPorts(),
      new TcpPortRange(80, 90),
      new UdpPort(2345),
      new UdpPort(Token.encodeAsNumber(new Intrinsic(777))),
      new UdpAllPorts(),
      new UdpPortRange(85, 95),
      new IcmpTypeAndCode(5, 1),
      new IcmpAllTypeCodes(8),
      new IcmpAllTypesAndCodes(),
      new IcmpPing(),
      new AllTraffic()
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
      new TcpPort(p1),
      new TcpPort(p2),
      new TcpPortRange(p1, 90),
      new TcpPortRange(80, p2),
      new TcpPortRange(p1, p2),
      new UdpPort(p1),
      new UdpPortRange(p1, 95),
      new UdpPortRange(85, p2),
      new UdpPortRange(p1, p2),
      new IcmpTypeAndCode(p1, 1),
      new IcmpTypeAndCode(5, p1),
      new IcmpTypeAndCode(p1, p2),
      new IcmpAllTypeCodes(p1),
    ];

    // THEN
    for (const range of ports) {
      test.equal(range.canInlineRule, false, range.toString());
    }

    test.done();
  }
};