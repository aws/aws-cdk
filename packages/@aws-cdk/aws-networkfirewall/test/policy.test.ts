//import { Template, Match } from '@aws-cdk/assertions';
import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

test('Default property', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::FirewallPolicy', {
    FirewallPolicy: {
      StatefulRuleGroupReferences: [],
      StatelessDefaultActions: [
        'aws:drop',
      ],
      StatelessFragmentDefaultActions: [
        'aws:drop',
      ],
      StatelessRuleGroupReferences: [],
    },
    FirewallPolicyName: 'MyNetworkFirewallPolicy',
  });
});

test('Can get firewall policy name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      FirewallPolicyName: policy.firewallPolicyId,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    FirewallPolicyName: {
      Ref: 'MyNetworkFirewallPolicy645720A6',
    },
  });
});

test('Can get firewall policy by name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const policy = NetFW.FirewallPolicy.fromFirewallPolicyName(stack, 'MyNetworkFirewallPolicy', 'MyFirewallPolicy');
  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      FirewallPolicyName: policy.firewallPolicyId,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    FirewallPolicyName: 'MyFirewallPolicy',
  });
});

test('Policy name must be valid', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      firewallPolicyName: 'MyFirewallPolicy%3',
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
    });
  // THEN
  }).toThrow('firewallPolicyName must contain only letters, numbers, and dashes, got: \'MyFirewallPolicy%3\'');
});

test('Stateless default actions must only have one non-custom action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      firewallPolicyName: 'MyFirewallPolicy',
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP, NetFW.StatelessStandardAction.PASS],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
    });
  // THEN
  }).toThrow('Only one standard action can be provided for the StatelessDefaultAction, all other actions must be custom');
});

test('Stateless Fragment default actions must only have one non-custom action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      firewallPolicyName: 'MyFirewallPolicy',
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP, NetFW.StatelessStandardAction.PASS],
    });
  // THEN
  }).toThrow('Only one standard action can be provided for the StatelessFragementDefaultAction, all other actions must be custom');
});

test('Stateful strict actions must only have one non-custom action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      firewallPolicyName: 'MyFirewallPolicy',
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statefulDefaultActions: [NetFW.StatefulStrictAction.DROP_STRICT, NetFW.StatefulStrictAction.ALERT_STRICT],
    });
  // THEN
  }).toThrow('Only one strict action can be provided for the StatefulDefaultAction, all other actions must be custom');
});

test('Multiple custom default actions can be supplied', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    firewallPolicyName: 'MyFirewallPolicy',
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP, 'custom-1', 'custom-2'],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP, 'custom-1', 'custom-2'],
    statefulDefaultActions: [NetFW.StatefulStrictAction.DROP_STRICT, 'custom-1', 'custom-2'],
  });
  // THEN
});

test('verifies unique group priority on stateless rule groups', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRuleGroup1 = new NetFW.StatelessRuleGroup(stack, 'StatelessRuleGroup1', {
    rules: [],
  });
  const statelessRuleGroup2 = new NetFW.StatelessRuleGroup(stack, 'StatelessRuleGroup2', {
    rules: [],
  });

  const statelessRuleGroupList:NetFW.StatelessRuleGroupList[] = [
    {
      priority: 10,
      ruleGroup: statelessRuleGroup1,
    },
    {
      priority: 10,
      ruleGroup: statelessRuleGroup2,
    },
  ];

  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessRuleGroups: statelessRuleGroupList,
    });
  // THEN
  }).toThrow('Priority must be unique, recieved duplicate priority on stateless group');
});

test('verifies unique group priority on stateful groups', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statefulRuleGroup1 = new NetFW.StatefulSuricataRuleGroup(stack, 'StatefulRuleGroup1', {
    rules: '',
  });
  const statefulRuleGroup2 = new NetFW.StatefulSuricataRuleGroup(stack, 'StatefulRuleGroup2', {
    rules: '',
  });

  const statefulRuleGroupList:NetFW.StatefulRuleGroupList[] = [
    {
      priority: 10,
      ruleGroup: statefulRuleGroup1,
    },
    {
      priority: 10,
      ruleGroup: statefulRuleGroup2,
    },
  ];

  expect(() => {
    new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statefulRuleGroups: statefulRuleGroupList,
    });
  // THEN
  }).toThrow('Priority must be unique, recieved duplicate priority on stateful group');
});

test('Can add new groups to policy', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    cidr: '10.0.0.0/16',
  });
  // create some rules
  const statelessRule1 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.FORWARD],
  });
  const statefulRule1 = new NetFW.Stateful5TupleRule({
    action: NetFW.StatefulStandardAction.DROP,
  });
  const statefulRule2 = new NetFW.StatefulDomainListRule({
    type: NetFW.StatefulDomainListType.ALLOWLIST,
    targets: ['example.com'],
    targetTypes: [NetFW.StatefulDomainListTargetType.HTTP_HOST],
  });
  // create some rule groups
  const statelessRuleGroup1 = new NetFW.StatelessRuleGroup(stack, 'StatelessRuleGroup1', {
    rules: [{ rule: statelessRule1, priority: 10 }],
  });
  const statefulRuleGroup1 = new NetFW.Stateful5TupleRuleGroup(stack, 'StatefulRuleGroup1', {
    rules: [statefulRule1],
  });
  const statefulRuleGroup2 = new NetFW.StatefulDomainListRuleGroup(stack, 'StatefulRuleGroup2', {
    rule: statefulRule2,
  });
  const statefulRuleGroup3 = new NetFW.StatefulSuricataRuleGroup(stack, 'StatefulRuleGroup3', {
    rules: '',
  });

  // For stateless rule groups, we must set them into a list
  const statelessRuleGroupList:NetFW.StatelessRuleGroupList[] = [
    {
      priority: 10,
      ruleGroup: statelessRuleGroup1,
    },
  ];
  const statefulRuleGroupList:NetFW.StatefulRuleGroupList[] = [
    {
      priority: 10,
      ruleGroup: statefulRuleGroup1,
    },
    {
      priority: 20,
      ruleGroup: statefulRuleGroup2,
    },
    {
      priority: 30,
      ruleGroup: statefulRuleGroup3,
    },
  ];
  // WHEN
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessRuleGroups: statelessRuleGroupList,
    statefulRuleGroups: statefulRuleGroupList,
  });
  new NetFW.Firewall(stack, 'MyNetworkFirewall', {
    vpc: vpc,
    policy: policy,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::FirewallPolicy', {
    FirewallPolicyName: 'MyNetworkFirewallPolicy',
    FirewallPolicy: {
      StatefulRuleGroupReferences: [
        {
          Priority: 10,
          ResourceArn: {
            'Fn::GetAtt': [
              'StatefulRuleGroup185567ABC',
              'RuleGroupArn',
            ],
          },
        },
        {
          Priority: 20,
          ResourceArn: {
            'Fn::GetAtt': [
              'StatefulRuleGroup2A56B8650',
              'RuleGroupArn',
            ],
          },
        },
        {
          Priority: 30,
          ResourceArn: {
            'Fn::GetAtt': [
              'StatefulRuleGroup30566741A',
              'RuleGroupArn',
            ],
          },
        },
      ],
      StatelessDefaultActions: [
        'aws:drop',
      ],
      StatelessFragmentDefaultActions: [
        'aws:drop',
      ],
      StatelessRuleGroupReferences: [
        {
          Priority: 10,
          ResourceArn: {
            'Fn::GetAtt': [
              'StatelessRuleGroup170E51540',
              'RuleGroupArn',
            ],
          },
        },
      ],
    },
  });
});
