import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as NetFW from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'MyTestVpc', {
      cidr: '10.0.0.0/16',
    });

    // Setup Stateful 5Tuple rule & Group

    const stateful5TupleRule = new NetFW.Stateful5TupleRule({
      action: NetFW.StatefulStandardAction.DROP,
      destinationPort: '$WEB_PORTS',
      destination: '$HOME_NET',
      protocol: 'TCP',
      sourcePort: 'any',
      source: '10.10.0.0/16',
      direction: NetFW.Stateful5TupleDirection.FORWARD,
      ruleOptions: [
        {
          keyword: 'sid',
          settings: ['1234'],
        },
      ],
    });

    const stateful5TupleRuleGroup = new NetFW.Stateful5TupleRuleGroup(this, 'MyStateful5TupleRuleGroup', {
      capacity: 100,
      rules: [stateful5TupleRule],
      variables: {
        ipSets: {
          HOME_NET: { definition: ['10.0.0.0/16', '10.10.0.0/16'] },
        },
        portSets: {
          WEB_PORTS: { definition: ['443', '80'] },
        },
      },
    });


    // Setup Stateful Domain list rule & Group

    const statefulDomainListRule = new NetFW.StatefulDomainListRule({
      type: NetFW.StatefulDomainListType.DENYLIST,
      targets: ['.example.com', 'www.example.org'],
      targetTypes: [
        NetFW.StatefulDomainListTargetType.TLS_SNI,
        NetFW.StatefulDomainListTargetType.HTTP_HOST,
      ],
    });

    const statefulDomainListRuleGroup = new NetFW.StatefulDomainListRuleGroup(this, 'MyStatefulDomainListRuleGroup', {
      capacity: 100,
      rule: statefulDomainListRule,
    });

    // Setup Stateful Suricata rule & Group

    const statefulSuricataRuleGroup = new NetFW.StatefulSuricataRuleGroup(this, 'MyStatefulSuricataRuleGroup', {
      capacity: 100,
      rules: 'alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (msg:\".htpasswd access attempt\"; flow:to_server,established; content:\".htpasswd\"; nocase; sid:210503; rev:1;)',
      variables: {
        ipSets: {
          HTTP_SERVERS: { definition: ['10.0.0.0/16'] },
        },
        portSets: {
          HTTP_PORTS: { definition: ['80', '8080'] },
        },
      },
    });

    // Setup Stateless rule & group

    const statelessRule = new NetFW.StatelessRule({
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
      destinations: ['10.0.0.0/16'],
      protocols: [6],
      sourcePorts: [{
        fromPort: 0,
        toPort: 65535,
      }],
      sources: ['10.0.0.0/16', '10.10.0.0/16'],
    });

    const statelessRuleGroup = new NetFW.StatelessRuleGroup(this, 'MyStatelessRuleGroup', {
      ruleGroupName: 'MyStatelessRuleGroup',
      rules: [{ rule: statelessRule, priority: 10 }],
    });


    // Finally setup Policy and firewall.
    const policy = new NetFW.FirewallPolicy(this, 'MyNetworkfirewallPolicy', {
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statefulRuleGroups: [
        {
          ruleGroup: statefulDomainListRuleGroup,
        },
        {
          ruleGroup: stateful5TupleRuleGroup,
        },
        {
          ruleGroup: statefulSuricataRuleGroup,
        },
      ],
      statelessRuleGroups: [
        {
          priority: 10,
          ruleGroup: statelessRuleGroup,
        },
      ],
    });

    new NetFW.Firewall(this, 'networkFirewall', {
      firewallName: 'my-network-firewall',
      vpc: vpc,
      policy: policy,
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'network-firewall-integ-stack');
new IntegTest(app, 'AllBasicTest', {
  testCases: [testCase],
});
app.synth();
