import fc = require('fast-check');
import { Test } from 'nodeunit';
import { SecurityGroupRule } from '../../lib/network/security-group-rule';

export = {
  'can parse cidr-ip'(test: Test) {
    const rule = new SecurityGroupRule({
      GroupId: 'sg-1234',
      IpProtocol: 'tcp',
      FromPort: 10,
      ToPort: 20,
      CidrIp: '1.2.3.4/8',
    });

    test.equal(rule.groupId, 'sg-1234');
    test.equal(rule.ipProtocol, 'tcp');
    test.equal(rule.fromPort, 10);
    test.equal(rule.toPort, 20);

    const peer = rule.peer!;
    if (peer.kind !== 'cidr-ip') { throw new Error('Fail'); }
    test.equal(peer.ip, '1.2.3.4/8');

    test.done();
  },

  'can parse cidr-ip 6'(test: Test) {
    const rule = new SecurityGroupRule({
      CidrIpv6: '::0/0'
    });

    const peer = rule.peer!;
    if (peer.kind !== 'cidr-ip') { throw new Error('Fail'); }
    test.equal(peer.ip, '::0/0');

    test.done();
  },

  'can parse securityGroup'(test: Test) {
    for (const key of ['DestinationSecurityGroupId', 'SourceSecurityGroupId']) {
      const rule = new SecurityGroupRule({
        [key]: 'sg-1234',
      });

      const peer = rule.peer!;
      if (peer.kind !== 'security-group') { throw new Error('Fail'); }
      test.equal(peer.securityGroupId, 'sg-1234');
    }

    test.done();
  },

  'can parse prefixlist'(test: Test) {
    for (const key of ['DestinationPrefixListId', 'SourcePrefixListId']) {
      const rule = new SecurityGroupRule({
        [key]: 'pl-1',
      });

      const peer = rule.peer!;
      if (peer.kind !== 'prefix-list') { throw new Error('Fail'); }
      test.equal(peer.prefixListId, 'pl-1');
    }

    test.done();
  },

  'equality is reflexive'(test: Test) {
    fc.assert(fc.property(
      arbitraryRule, (statement) => {
        return new SecurityGroupRule(statement).equal(new SecurityGroupRule(statement));
      }
    ));
    test.done();
  },

  'equality is symmetric'(test: Test) {
    fc.assert(fc.property(
      twoArbitraryRules, (s) => {
        const a = new SecurityGroupRule(s.rule1);
        const b = new SecurityGroupRule(s.rule2);

        fc.pre(a.equal(b));
        return b.equal(a);
      }
    ));
    test.done();
  },
};

const arbitraryRule = fc.record({
  IpProtocol: fc.constantFrom('tcp', 'udp', 'icmp'),
  FromPort: fc.integer(80, 81),
  ToPort: fc.integer(81, 82),
  CidrIp: fc.constantFrom('0.0.0.0/0', '1.2.3.4/8', undefined, undefined),
  DestinationSecurityGroupId: fc.constantFrom('sg-1234', undefined),
  DestinationPrefixListId: fc.constantFrom('pl-1', undefined),
});

const twoArbitraryRules = fc.record({
  rule1: arbitraryRule,
  rule2: arbitraryRule,
  copyIp: fc.boolean(),
  copyFromPort: fc.boolean(),
  copyToPort : fc.boolean(),
  copyCidrIp: fc.boolean(),
  copySecurityGroupId: fc.boolean(),
  copyPrefixListId: fc.boolean(),
}).map(op => {
  const original = op.rule1;
  const modified = Object.create(original, {});

  if (op.copyIp) { modified.IpProtocol = op.rule2.IpProtocol; }
  if (op.copyFromPort) { modified.FromPort = op.rule2.FromPort; }
  if (op.copyToPort) { modified.ToPort = op.rule2.ToPort; }
  if (op.copyCidrIp) { modified.CidrIp = op.rule2.CidrIp; }
  if (op.copySecurityGroupId) { modified.DestinationSecurityGroupId = op.rule2.DestinationSecurityGroupId; }
  if (op.copyPrefixListId) { modified.DestinationPrefixListId = op.rule2.DestinationPrefixListId; }

  return { rule1: original, rule2: modified };
});