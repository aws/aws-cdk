import * as cdk from '@aws-cdk/core';
import { WorkSpace, RuleGroupsNamespace } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-rule-groups-namespace');

const workspace = new WorkSpace(stack, 'demo-workspace', {
  alias: 'demo-rule-groups-namespace',
});

const ruleGroupsNamespace = new RuleGroupsNamespace(stack, 'DemoWorkSpace', {
  name: 'DemoRuleGroupsNamespace',
  workspace: workspace.workspaceArn,
  data: `groups:
  - name: test
    rules:
    - record: metric:recording_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m]))
  - name: alert-test
    rules:
    - alert: metric:alerting_rule
      expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0
      for: 2m`,
});

new cdk.CfnOutput(stack, 'arn', { value: ruleGroupsNamespace.ruleGroupsNamespaceArn });