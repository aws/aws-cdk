import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { AnomalyMonitor, MonitorType } from '../lib/anomaly-monitor';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('services monitor', () => {
  new AnomalyMonitor(stack, 'Monitor', {
    anomalyMonitorName: 'MyMonitor',
    type: MonitorType.awsServices(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalyMonitor', {
    MonitorDimension: 'SERVICE',
    MonitorName: 'MyMonitor',
    MonitorType: 'DIMENSIONAL',
  });
});

test('tags monitor', () => {
  new AnomalyMonitor(stack, 'Monitor', {
    type: MonitorType.costAllocationTag('key', ['value1', 'value2']),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalyMonitor', {
    MonitorName: 'Monitor',
    MonitorType: 'CUSTOM',
    MonitorSpecification: '{"Tags":{"Key":"key","Values":["value1","value2"]}}',
  });
});

test('cost categories monitor', () => {
  new AnomalyMonitor(stack, 'Monitor', {
    type: MonitorType.costCategory('key', 'value1'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalyMonitor', {
    MonitorName: 'Monitor',
    MonitorType: 'CUSTOM',
    MonitorSpecification: '{"CostCategories":{"Key":"key","Values":["value1"]}}',
  });
});

test('linked accounts monitor', () => {
  new AnomalyMonitor(stack, 'Monitor', {
    type: MonitorType.linkedAccounts(['123456789012', '123456789013']),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CE::AnomalyMonitor', {
    MonitorName: 'Monitor',
    MonitorType: 'CUSTOM',
    MonitorSpecification: '{"Dimensions":{"Key":"LINKED_ACCOUNT","Values":["123456789012","123456789013"]}}',
  });
});

test('import from arn', () => {
  const anomalyMonitorArn = stack.formatArn({
    service: 'ce',
    resource: 'anomalymonitor',
    resourceName: 'monitor',
  });
  const anomalyMonitor = AnomalyMonitor.fromAnomalyMonitorArn(stack, 'Monitor', anomalyMonitorArn);

  // THEN
  expect(anomalyMonitor.anomalyMonitorArn).toEqual(anomalyMonitorArn);
});
