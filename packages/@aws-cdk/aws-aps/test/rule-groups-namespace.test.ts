import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { RuleGroupsNamespace, WorkSpace } from '../lib/';


test('create a RuleGroupsNamespace', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const workspace = new WorkSpace(stack, 'Demoworkspace');
  new RuleGroupsNamespace(stack, 'DemoWorkSpace', {
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

  // we should have the RuleGroupsNamespace
  Template.fromStack(stack).hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: 'groups:\n  - name: test\n    rules:\n    - record: metric:recording_rule\n      expr: avg(rate(container_cpu_usage_seconds_total[5m]))\n  - name: alert-test\n    rules:\n    - alert: metric:alerting_rule\n        expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0\n      for: 2m',
    Workspace: {
      Ref: 'Demoworkspace63CEB022',
    },
    Name: 'DemoRuleGroupsNamespace',
  });
});

