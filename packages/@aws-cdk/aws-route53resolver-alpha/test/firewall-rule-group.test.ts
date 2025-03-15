import { Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Duration, Stack } from 'aws-cdk-lib';
import { DnsBlockResponse, FirewallDomainList, FirewallRuleAction, FirewallRuleGroup, IFirewallDomainList } from '../lib';

let stack: Stack;
let firewallDomainList: IFirewallDomainList;
beforeEach(() => {
  stack = new Stack();
  firewallDomainList = FirewallDomainList.fromFirewallDomainListId(stack, 'List', 'domain-list-id');
});

test('basic rule group', () => {
  // WHEN
  new FirewallRuleGroup(stack, 'RuleGroup', {
    rules: [
      {
        priority: 10,
        firewallDomainList,
        action: FirewallRuleAction.block(),
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallRuleGroup', {
    FirewallRules: [
      {
        Action: 'BLOCK',
        BlockResponse: 'NODATA',
        FirewallDomainListId: 'domain-list-id',
        Priority: 10,
      },
    ],
  });
});

test('use addRule to add rules', () => {
  // GIVEN
  const ruleGroup = new FirewallRuleGroup(stack, 'RuleGroup', {
    rules: [
      {
        priority: 10,
        firewallDomainList,
        action: FirewallRuleAction.allow(),
      },
    ],
  });

  // WHEN
  ruleGroup.addRule({
    priority: 20,
    firewallDomainList: FirewallDomainList.fromFirewallDomainListId(stack, 'OtherList', 'other-list-id'),
    action: FirewallRuleAction.allow(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallRuleGroup', {
    FirewallRules: [
      {
        Action: 'ALLOW',
        FirewallDomainListId: 'domain-list-id',
        Priority: 10,
      },
      {
        Action: 'ALLOW',
        FirewallDomainListId: 'other-list-id',
        Priority: 20,
      },
    ],
  });
});

test('rule with response override', () => {
  // GIVEN
  const ruleGroup = new FirewallRuleGroup(stack, 'RuleGroup');

  // WHEN
  ruleGroup.addRule({
    priority: 10,
    firewallDomainList,
    action: FirewallRuleAction.block(DnsBlockResponse.override('amazon.com', Duration.minutes(5))),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallRuleGroup', {
    FirewallRules: [
      {
        Action: 'BLOCK',
        BlockOverrideDnsType: 'CNAME',
        BlockOverrideDomain: 'amazon.com',
        BlockOverrideTtl: 300,
        BlockResponse: 'OVERRIDE',
        FirewallDomainListId: 'domain-list-id',
        Priority: 10,
      },
    ],
  });
});

test('associate rule group with a vpc', () => {
  // GIVEN
  const vpc = new Vpc(stack, 'Vpc');
  const ruleGroup = new FirewallRuleGroup(stack, 'RuleGroup');

  // WHEN
  ruleGroup.associate('Association', {
    priority: 101,
    vpc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Route53Resolver::FirewallRuleGroupAssociation', {
    FirewallRuleGroupId: {
      'Fn::GetAtt': [
        'RuleGroup06BA8844',
        'Id',
      ],
    },
    Priority: 101,
    VpcId: {
      Ref: 'Vpc8378EB38',
    },
  });
});

test('throws when associating with a priority not between 100-9,000', () => {
  // GIVEN
  const vpc = new Vpc(stack, 'Vpc');
  const ruleGroup = new FirewallRuleGroup(stack, 'RuleGroup');

  // THEN
  expect(() => ruleGroup.associate('Association', {
    priority: 100,
    vpc,
  })).toThrow(/Priority must be greater than 100 and less than 9000/);
});

test('fromFirewallRuleGroupName return correct imported resource when mapping provided', () => {
  const stackWithContext = new Stack();
  stackWithContext.node.setContext('firewallRuleGroups', {
    TestGroup: 'fwr-123456',
  });

  const importedGroup = FirewallRuleGroup.fromFirewallRuleGroupName(stackWithContext, 'ImportedGroup', 'TestGroup');

  expect(importedGroup.firewallRuleGroupId).toEqual('fwr-123456');
  expect(importedGroup.firewallRuleGroupName).toEqual('TestGroup');
});

test('fromFirewallRuleGroupName throws an error when the name is not in context', () => {
  const stackWithoutMapping = new Stack();
  stackWithoutMapping.node.setContext('firewallRuleGroups', {});

  expect(() => {
    FirewallRuleGroup.fromFirewallRuleGroupName(stackWithoutMapping, 'ImportedGroup', 'NonExistentGroup');
  }).toThrow(/Firewall Rule Group with name "NonExistentGroup" not found in context./);
});
