//import { Template, Match } from '@aws-cdk/assertions';
import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

test('Default property', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup');
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 0,
    RuleGroupName: 'MyStatelessRuleGroup',
    Type: 'STATELESS',
    RuleGroup: {
      RulesSource: {
        StatelessRulesAndCustomActions: {
          StatelessRules: [],
        },
      },
    },
  });
});

test('Given property', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRule = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
    ruleGroupName: 'MyNamedStatelessRuleGroup',
    capacity: 100,
    rules: [{ rule: statelessRule, priority: 10 }],
    customActions: [
      {
        actionDefinition: {
          publishMetricAction: {
            dimensions: [{
              value: 'value',
            }],
          },
        },
        actionName: 'actionName',
      },
    ],
    variables: {
      ipSets: {
        ipSetsKey: {
          definition: ['10.0.0.0/16', '10.10.0.0/16'],
        },
      },
      portSets: {
        portSetsKey: {
          definition: ['443', '80'],
        },
      },
    },
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyNamedStatelessRuleGroup',
    Type: 'STATELESS',
    RuleGroup: {
      RuleVariables: {
        IPSets: {
          ipSetsKey: {
            Definition: [
              '10.0.0.0/16',
              '10.10.0.0/16',
            ],
          },
        },
        PortSets: {
          portSetsKey: {
            Definition: [
              '443',
              '80',
            ],
          },
        },
      },
      RulesSource: {
        StatelessRulesAndCustomActions: {
          CustomActions: [
            {
              ActionDefinition: {
                PublishMetricAction: {
                  Dimensions: [
                    {
                      Value: 'value',
                    },
                  ],
                },
              },
              ActionName: 'actionName',
            },
          ],
          StatelessRules: [
            {
              Priority: 10,
              RuleDefinition: {
                Actions: [
                  'aws:drop',
                ],
                MatchAttributes: {
                  Destinations: [],
                  Sources: [],
                },
              },
            },
          ],
        },
      },
    },
  });
});


test('Verifies rule Priorties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRule1 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
  });
  const statelessRule2 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  expect(() => {
    new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
      rules: [
        {
          rule: statelessRule1,
          priority: 10,
        },
        {
          rule: statelessRule2,
          priority: 10,
        },
      ],
    });
  // THEN
  }).toThrow('Priority must be unique, got duplicate priority: \'10\'');
});

test('Calculate Capacity of rules', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRule1 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
    destinationPorts: [
      {
        fromPort: 80,
        toPort: 80,
      },
      {
        fromPort: 443,
        toPort: 443,
      },
    ],
    destinations: ['10.0.0.0/16, 10.10.0.0/16'],
    sourcePorts: [{
      fromPort: 0,
      toPort: 65535,
    }],
    sources: ['10.0.0.0/16', '10.10.0.0/16'],
    protocols: [10, 11],
    tcpFlags: [{ flags: ['ECE', 'SYN'], masks: ['SYN', 'ECE'] }],
  });
  const statelessRule2 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  const statelessRuleGroup = new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
    ruleGroupName: 'MyNamedStatelessRuleGroup',
    rules: [
      {
        rule: statelessRule1,
        priority: 10,
      },
      {
        rule: statelessRule2,
        priority: 20,
      },
    ],
  });

  // capacity of statelessRule1(16) + statelessRule2(1) = 17
  expect(statelessRuleGroup.calculateCapacity()).toBe(17);
});
test('Capacity validation', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  expect(() => {
    new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
      ruleGroupName: 'MyNamedStatelessRuleGroup',
      capacity: 30001,
    });
  }).toThrow('Capacity must be a positive value less than 30,000, got: \'30001\'');
});
test('Calculate Capacity validation', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRule1 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
    destinationPorts: [
      { fromPort: 1, toPort: 1 },
      { fromPort: 2, toPort: 2 },
      { fromPort: 3, toPort: 3 },
      { fromPort: 4, toPort: 4 },
      { fromPort: 5, toPort: 5 },
      { fromPort: 6, toPort: 6 },
      { fromPort: 7, toPort: 7 },
      { fromPort: 8, toPort: 8 },
      { fromPort: 9, toPort: 9 },
      { fromPort: 10, toPort: 10 },
    ],
    destinations: ['10.0.0.0/16, 10.1.0.0/16, 10.2.0.0/16, 10.3.0.0/16, 10.4.0.0/16, 10.5.0.0/16, 10.6.0.0/16, 10.7.0.0/16, 10.8.0.0/16, 10.9.0.0/16'],
    sourcePorts: [
      { fromPort: 1, toPort: 1 },
      { fromPort: 2, toPort: 2 },
      { fromPort: 3, toPort: 3 },
      { fromPort: 4, toPort: 4 },
      { fromPort: 5, toPort: 5 },
      { fromPort: 6, toPort: 6 },
      { fromPort: 7, toPort: 7 },
      { fromPort: 8, toPort: 8 },
      { fromPort: 9, toPort: 9 },
      { fromPort: 10, toPort: 10 },
    ],
    sources: ['10.0.0.0/16, 10.1.0.0/16, 10.2.0.0/16, 10.3.0.0/16, 10.4.0.0/16, 10.5.0.0/16, 10.6.0.0/16, 10.7.0.0/16, 10.8.0.0/16, 10.9.0.0/16'],
    protocols: [10, 11],
    tcpFlags: [{ flags: ['ECE', 'SYN'], masks: ['SYN', 'ECE'] }],
  });
  const statelessRule2 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
    destinationPorts: [
      { fromPort: 1, toPort: 1 },
      { fromPort: 2, toPort: 2 },
      { fromPort: 3, toPort: 3 },
      { fromPort: 4, toPort: 4 },
      { fromPort: 5, toPort: 5 },
      { fromPort: 6, toPort: 6 },
      { fromPort: 7, toPort: 7 },
      { fromPort: 8, toPort: 8 },
      { fromPort: 9, toPort: 9 },
      { fromPort: 10, toPort: 10 },
    ],
    destinations: ['10.0.0.0/16, 10.1.0.0/16, 10.2.0.0/16, 10.3.0.0/16, 10.4.0.0/16, 10.5.0.0/16, 10.6.0.0/16, 10.7.0.0/16, 10.8.0.0/16, 10.9.0.0/16'],
    sourcePorts: [
      { fromPort: 1, toPort: 1 },
      { fromPort: 2, toPort: 2 },
      { fromPort: 3, toPort: 3 },
      { fromPort: 4, toPort: 4 },
      { fromPort: 5, toPort: 5 },
      { fromPort: 6, toPort: 6 },
      { fromPort: 7, toPort: 7 },
      { fromPort: 8, toPort: 8 },
      { fromPort: 9, toPort: 9 },
      { fromPort: 10, toPort: 10 },
    ],
    sources: ['10.0.0.0/16, 10.1.0.0/16, 10.2.0.0/16, 10.3.0.0/16, 10.4.0.0/16, 10.5.0.0/16, 10.6.0.0/16, 10.7.0.0/16, 10.8.0.0/16, 10.9.0.0/16'],
    protocols: [10, 11],
    tcpFlags: [{ flags: ['ECE', 'SYN'], masks: ['SYN', 'ECE'] }],
  });
  // WHEN
  expect(() => {
    new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
      ruleGroupName: 'MyNamedStatelessRuleGroup',
      rules: [
        {
          rule: statelessRule1,
          priority: 10,
        },
        {
          rule: statelessRule2,
          priority: 20,
        },
      ],
    });
  }).toThrow('Capacity must be a positive value less than 30,000, got: \'40000\'');
});
