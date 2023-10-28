import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as route53resolver from '../lib';

const app = new App();
const stack = new Stack(app, 'cdk-route53-resolver-firewall');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });

const blockList = new route53resolver.FirewallDomainList(stack, 'BlockList', {
  domains: route53resolver.FirewallDomains.fromList(['bad-domain.com', 'bot-domain.net']),
});
const overrideList = new route53resolver.FirewallDomainList(stack, 'OverrideList', {
  domains: route53resolver.FirewallDomains.fromList(['override-domain.com']),
});
const managedMalwareList = new route53resolver.FirewallManagedDomainList(stack, 'ManagedMalwareList', {
  managedDomainList: route53resolver.ManagedDomain.MALWARE_DOMAIN_LIST,
});
const managedAggregateThreatList = new route53resolver.FirewallManagedDomainList(stack, 'ManagedAggregateThreatList', {
  managedDomainList: route53resolver.ManagedDomain.AGGREGATE_THREAT_LIST,
});

new route53resolver.FirewallDomainList(stack, 'OtherList', {
  domains: route53resolver.FirewallDomains.fromAsset(path.join(__dirname, 'domains.txt')),
});

const ruleGroup = new route53resolver.FirewallRuleGroup(stack, 'RuleGroup');

ruleGroup.addRule({
  priority: 10,
  firewallDomainList: blockList,
  action: route53resolver.FirewallRuleAction.block(),
});
ruleGroup.addRule({
  priority: 20,
  firewallDomainList: overrideList,
  action: route53resolver.FirewallRuleAction.block(route53resolver.DnsBlockResponse.override('amazon.com')),
});
ruleGroup.addRule({
  priority: 30,
  firewallDomainList: managedMalwareList,
  action: route53resolver.FirewallRuleAction.block(),
});
ruleGroup.addRule({
  priority: 40,
  firewallDomainList: managedAggregateThreatList,
  action: route53resolver.FirewallRuleAction.block(),
});

ruleGroup.associate('Association', {
  priority: 101,
  vpc,
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
