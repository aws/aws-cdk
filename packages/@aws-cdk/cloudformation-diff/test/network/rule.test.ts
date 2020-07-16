import * as fc from 'fast-check';
import { SecurityGroupRule } from '../../lib/network/security-group-rule';

test('can parse cidr-ip', () => {
  const rule = new SecurityGroupRule({
    GroupId: 'sg-1234',
    IpProtocol: 'tcp',
    FromPort: 10,
    ToPort: 20,
    CidrIp: '1.2.3.4/8',
  });

  expect(rule.groupId).toEqual('sg-1234');
  expect(rule.ipProtocol).toEqual('tcp');
  expect(rule.fromPort).toEqual(10);
  expect(rule.toPort).toEqual(20);

  const peer = rule.peer!;
  if (peer.kind !== 'cidr-ip') { throw new Error('Fail'); }
  expect(peer.ip).toEqual('1.2.3.4/8');
});

test('can parse cidr-ip 6', () => {
  const rule = new SecurityGroupRule({
    CidrIpv6: '::/0',
  });

  const peer = rule.peer!;
  if (peer.kind !== 'cidr-ip') { throw new Error('Fail'); }
  expect(peer.ip).toEqual('::/0');
});

test('can parse securityGroup', () => {
  for (const key of ['DestinationSecurityGroupId', 'SourceSecurityGroupId']) {
    const rule = new SecurityGroupRule({
      [key]: 'sg-1234',
    });

    const peer = rule.peer!;
    if (peer.kind !== 'security-group') { throw new Error('Fail'); }
    expect(peer.securityGroupId).toEqual('sg-1234');
  }
});

test('can parse prefixlist', () => {
  for (const key of ['DestinationPrefixListId', 'SourcePrefixListId']) {
    const rule = new SecurityGroupRule({
      [key]: 'pl-1',
    });

    const peer = rule.peer!;
    if (peer.kind !== 'prefix-list') { throw new Error('Fail'); }
    expect(peer.prefixListId).toEqual('pl-1');
  }
});

test('equality is reflexive', () => {
  fc.assert(fc.property(
    arbitraryRule, (statement) => {
      return new SecurityGroupRule(statement).equal(new SecurityGroupRule(statement));
    },
  ));
});

test('equality is symmetric', () => {
  fc.assert(fc.property(
    twoArbitraryRules, (s) => {
      const a = new SecurityGroupRule(s.rule1);
      const b = new SecurityGroupRule(s.rule2);

      fc.pre(a.equal(b));
      return b.equal(a);
    },
  ));
});

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
  copyToPort: fc.boolean(),
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
