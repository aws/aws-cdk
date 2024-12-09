import * as fc from 'fast-check';
import { SecurityGroupRule } from '../../lib/network/security-group-rule';
import { arbitraryRule, twoArbitraryRules } from '../test-arbitraries';

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

test('can describe protocol', () => {
  expect(new SecurityGroupRule({ IpProtocol: -1 }).describeProtocol()).toEqual('Everything');
  expect(new SecurityGroupRule({ IpProtocol: '-1' }).describeProtocol()).toEqual('Everything');
  expect(new SecurityGroupRule({ FromPort: -1 }).describeProtocol()).toEqual('All *UNKNOWN*');
  expect(new SecurityGroupRule({ IpProtocol: 'tcp', FromPort: -1, ToPort: -1 }).describeProtocol()).toEqual('All TCP');
  expect(new SecurityGroupRule({ IpProtocol: 'tcp', FromPort: 10, ToPort: 20 }).describeProtocol()).toEqual('TCP 10-20');
  expect(new SecurityGroupRule({ IpProtocol: 'tcp', FromPort: 10, ToPort: 10 }).describeProtocol()).toEqual('TCP 10');
});
