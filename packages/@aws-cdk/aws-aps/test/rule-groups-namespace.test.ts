import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Workspace, RuleGroupsNamespace, RuleGroupsNamespaceData, AlertGroups, RecordGroups } from '../lib';


test('create a RuleGroupsNamespace', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const workspace = new Workspace(stack, 'Demoworkspace');
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
  const alert2 = new AlertGroups({
    name: 'alert-test2',
    rules: [{
      alert: 'metric:alerting_rule',
      expr: 'avg(rate(container_cpu_usage_seconds_total[5m])) > 0',
      for: '2m',
    }],
  });
  const record2 = new RecordGroups({
    name: 'test2',
    rules: [{
      record: 'metric:recording_rule',
      expr: 'avg(rate(container_cpu_usage_seconds_total[5m]))',
    }],
  });
  const data = new RuleGroupsNamespaceData({
    groups: [record, alert],
  });
  data.addRules(record2);
  data.addRules(alert2);
  new RuleGroupsNamespace(stack, 'DemoWorkSpace', {
    name: 'DemoRuleGroupsNamespace',
    workspace,
    data,
  });

  // we should have the RuleGroupsNamespace
  Template.fromStack(stack).hasResourceProperties('AWS::APS::RuleGroupsNamespace', {
    Data: 'groups:\n  - name: test\n    rules:\n      - record: metric:recording_rule\n        expr: avg(rate(container_cpu_usage_seconds_total[5m]))\n  - name: alert-test\n    rules:\n      - alert: metric:alerting_rule\n        expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0\n        for: 2m\n  - name: test2\n    rules:\n      - record: metric:recording_rule\n        expr: avg(rate(container_cpu_usage_seconds_total[5m]))\n  - name: alert-test2\n    rules:\n      - alert: metric:alerting_rule\n        expr: avg(rate(container_cpu_usage_seconds_total[5m])) > 0\n        for: 2m\n',
    Workspace: {
      Ref: 'Demoworkspace63CEB022',
    },
    Name: 'DemoRuleGroupsNamespace',
  });
});

