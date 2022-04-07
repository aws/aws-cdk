//import { Template, Match } from '@aws-cdk/assertions';
import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

/**
 * Tests for 5 Tuple Stateful rule groups
 */
test('Default properties on 5Tuple Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.Stateful5TupleRuleGroup(stack, 'MyStateful5TupleRuleGroup');
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStateful5TupleRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RulesSource: {},
      StatefulRuleOptions: {
        RuleOrder: 'DEFAULT_ACTION_ORDER',
      },
    },
  });
});

test('Given properties on 5Tuple Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const stateful5TupleRule1 = new NetFW.Stateful5TupleRule({
    action: NetFW.StatefulStandardAction.DROP,
  });
  const stateful5TupleRule2 = new NetFW.Stateful5TupleRule({
    action: NetFW.StatefulStandardAction.PASS,
  });
  // WHEN
  new NetFW.Stateful5TupleRuleGroup(stack, 'MyStateful5TupleRuleGroup', {
    ruleGroupName: 'MyStatefulRuleGroup',
    capacity: 100,
    rules: [stateful5TupleRule1, stateful5TupleRule2],
    variables: {
      ipSets: {
        ipSetsKey: { definition: ['10.0.0.0/16', '10.10.0.0/16'] },
      },
      portSets: {
        portSetsKey: { definition: ['443', '80'] },
      },
    },
    ruleOrder: NetFW.StatefulRuleOptions.STRICT_ORDER,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStatefulRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RuleVariables: {
        IPSets: {
          ipSetsKey: {
            Definition: ['10.0.0.0/16', '10.10.0.0/16'],
          },
        },
        PortSets: {
          portSetsKey: { Definition: ['443', '80'] },
        },
      },
      RulesSource: {
        StatefulRules: [
          {
            Action: 'DROP',
            Header: {
              Destination: 'ANY',
              DestinationPort: 'ANY',
              Direction: 'ANY',
              Protocol: 'IP',
              Source: 'ANY',
              SourcePort: 'ANY',
            },
            RuleOptions: [],
          },
          {
            Action: 'PASS',
            Header: {
              Destination: 'ANY',
              DestinationPort: 'ANY',
              Direction: 'ANY',
              Protocol: 'IP',
              Source: 'ANY',
              SourcePort: 'ANY',
            },
            RuleOptions: [],
          },
        ],
      },
      StatefulRuleOptions: {
        RuleOrder: 'STRICT_ORDER',
      },
    },
  });
});

/**
 *  Tests Domain List stateful rules
 */

test('Default properties on Domain List Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.StatefulDomainListRuleGroup(stack, 'MyStatefulDomainListRuleGroup');
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStatefulDomainListRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RulesSource: {},
      StatefulRuleOptions: {
        RuleOrder: 'DEFAULT_ACTION_ORDER',
      },
    },
  });
});

test('Given properties on Domain List Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const statefulDomainListRule = new NetFW.StatefulDomainListRule({
    type: NetFW.StatefulDomainListType.DENYLIST,
    targets: ['example.com'],
    targetTypes: [NetFW.StatefulDomainListTargetType.HTTP_HOST],
  });
  // WHEN
  new NetFW.StatefulDomainListRuleGroup(stack, 'MyStatefulDomainListRuleGroup', {
    capacity: 100,
    ruleGroupName: 'MyStatefulRuleGroup',
    rule: statefulDomainListRule,
    variables: {
      ipSets: {
        ipSetsKey: { definition: ['10.0.0.0/16', '10.10.0.0/16'] },
      },
      portSets: {
        portSetsKey: { definition: ['443', '80'] },
      },
    },
    ruleOrder: NetFW.StatefulRuleOptions.STRICT_ORDER,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStatefulRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RuleVariables: {
        IPSets: {
          ipSetsKey: {
            Definition: ['10.0.0.0/16', '10.10.0.0/16'],
          },
        },
        PortSets: {
          portSetsKey: { Definition: ['443', '80'] },
        },
      },
      RulesSource: {
        RulesSourceList: {
          GeneratedRulesType: 'DENYLIST',
          TargetTypes: [
            'HTTP_HOST',
          ],
          Targets: [
            'example.com',
          ],
        },
      },
      StatefulRuleOptions: {
        RuleOrder: 'STRICT_ORDER',
      },
    },
  });
});

/**
 * Tests for Suricata rule groups
 */

test('Default properties on Suricata Rule Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.StatefulSuricataRuleGroup(stack, 'MyStatefulSuricataRuleGroup');
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStatefulSuricataRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RulesSource: {},
      StatefulRuleOptions: {
        RuleOrder: 'DEFAULT_ACTION_ORDER',
      },
    },
  });
});

test('Given properties on Suricata Rule Group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  // WHEN
  new NetFW.StatefulSuricataRuleGroup(stack, 'MyStatefulSuricataRuleGroup', {
    capacity: 100,
    ruleGroupName: 'MyStatefulRuleGroup',
    rules: 'drop tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"ET TROJAN Likely Bot Nick in IRC (USA +..)"; flow:established,to_server; flowbits:isset,is_proto_irc; content:"NICK "; pcre:"/NICK .*USA.*[0-9]{3,}/i"; reference:url,doc.emergingthreats.net/2008124; classtype:trojan-activity; sid:2008124; rev:2;)',
    variables: {
      ipSets: {
        ipSetsKey: { definition: ['10.0.0.0/16', '10.10.0.0/16'] },
      },
      portSets: {
        portSetsKey: { definition: ['443', '80'] },
      },
    },
    ruleOrder: NetFW.StatefulRuleOptions.STRICT_ORDER,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::RuleGroup', {
    Capacity: 100,
    RuleGroupName: 'MyStatefulRuleGroup',
    Type: 'STATEFUL',
    RuleGroup: {
      RuleVariables: {
        IPSets: {
          ipSetsKey: {
            Definition: ['10.0.0.0/16', '10.10.0.0/16'],
          },
        },
        PortSets: {
          portSetsKey: { Definition: ['443', '80'] },
        },
      },
      RulesSource: {
        RulesString: 'drop tcp $HOME_NET any -> $EXTERNAL_NET any (msg:\"ET TROJAN Likely Bot Nick in IRC (USA +..)\"; flow:established,to_server; flowbits:isset,is_proto_irc; content:\"NICK \"; pcre:\"/NICK .*USA.*[0-9]{3,}/i\"; reference:url,doc.emergingthreats.net/2008124; classtype:trojan-activity; sid:2008124; rev:2;)',
      },
      StatefulRuleOptions: {
        RuleOrder: 'STRICT_ORDER',
      },
    },
  });
});
