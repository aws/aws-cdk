import * as cdk from '@aws-cdk/core';
import { Workspace, RuleGroupsNamespace, RuleGroupsNamespaceData, AlertGroups, RecordGroups } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-rule-groups-namespace');

const workspace = new Workspace(stack, 'demo-workspace', {
  alias: 'demo-rule-groups-namespace',
});
const alert = new AlertGroups({
  name: 'alert-test',
  rules: [{
    alert: 'metric:alerting_rule',
    expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
    for: '2m',
  }],
});
const record = new RecordGroups({
  name: 'test',
  rules: [{
    record: 'metric:recording_rule',
    expr: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
  }],
});
const data = new RuleGroupsNamespaceData({
  groups: [record, alert],
});
const ruleGroupsNamespace = new RuleGroupsNamespace(stack, 'DemoWorkspace', {
  name: 'DemoRuleGroupsNamespace',
  workspace,
  data,
});

new cdk.CfnOutput(stack, 'arn', { value: ruleGroupsNamespace.ruleGroupsNamespaceArn });