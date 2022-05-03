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
    priority: 10,
  });
  // WHEN
  new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
    ruleGroupName: 'MyNamedStatelessRuleGroup',
    capacity: 100,
    rules: [statelessRule],
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
    priority: 10,
  });
  const statelessRule2 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
    priority: 10,
  });
  // WHEN
  expect(() => {
    new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
      rules: [statelessRule1, statelessRule2],
    });
  // THEN
  }).toThrow('Priority must be unique, got duplicate priority: \'10\'');
});

test('Calculate Capacity of rules', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statelessRule1 = new NetFW.StatelessRule({
    actions: [NetFW.StatelessStandardAction.DROP],
    priority: 10,
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
    priority: 20,
  });
  // WHEN
  const statelessRuleGroup = new NetFW.StatelessRuleGroup(stack, 'MyStatelessRuleGroup', {
    ruleGroupName: 'MyNamedStatelessRuleGroup',
    rules: [statelessRule1, statelessRule2],
  });

  // capacity of statelessRule1(16) + statelessRule2(1) = 17
  expect(statelessRuleGroup.calculateCapacity()).toBe(17);
});
