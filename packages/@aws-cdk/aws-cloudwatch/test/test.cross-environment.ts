import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alarm, GraphWidget, IWidget, Metric } from '../lib';

const a = new Metric({ namespace: 'Test', metricName: 'ACount' });

let stack1: Stack;
let stack2: Stack;
export = {
  'setUp'(cb: () => void) {
    stack1 = new Stack(undefined, undefined, { env: { region: 'pluto', account: '1234' } });
    stack2 = new Stack(undefined, undefined, { env: { region: 'mars', account: '5678' } });
    cb();
  },

  'in graphs': {
    'metric attached to stack1 will not render region and account in stack1'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(stack1),
        ],
      });

      // THEN
      graphMetricsAre(test, stack1, graph, [
        ['Test', 'ACount'],
      ]);

      test.done();
    },

    'metric attached to stack1 will render region and account in stack2'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(stack1),
        ],
      });

      // THEN
      graphMetricsAre(test, stack2, graph, [
        ['Test', 'ACount', { region: 'pluto', accountId: '1234' }],
      ]);

      test.done();
    },

    'metric with explicit account and region will render in environment agnostic stack'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.with({ account: '1234', region: 'us-north-5' }),
        ],
      });

      // THEN
      graphMetricsAre(test, new Stack(), graph, [
        ['Test', 'ACount', { accountId: '1234', region: 'us-north-5' }],
      ]);

      test.done();
    },

    'metric attached to agnostic stack will not render in agnostic stack'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(new Stack()),
        ],
      });

      // THEN
      graphMetricsAre(test, new Stack(), graph, [
        ['Test', 'ACount'],
      ]);

      test.done();
    },
  },

  'in alarms': {
    'metric attached to stack1 will not render region and account in stack1'(test: Test) {
      // GIVEN
      new Alarm(stack1, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: a.attachTo(stack1),
      });

      // THEN
      expect(stack1).to(haveResourceLike('AWS::CloudWatch::Alarm', {
        MetricName: 'ACount',
        Namespace: 'Test',
        Period: 300,
      }));

      test.done();
    },

    'metric attached to stack1 will throw in stack2'(test: Test) {
      // Cross-region/cross-account metrics are supported in Dashboards but not in Alarms

      // GIVEN
      test.throws(() => {
        new Alarm(stack2, 'Alarm', {
          threshold: 1,
          evaluationPeriods: 1,
          metric: a.attachTo(stack1),
        });
      }, /Cannot create an Alarm in region 'mars' based on metric 'ACount' in 'pluto'/);

      test.done();
    },
  },
};

function graphMetricsAre(test: Test, stack: Stack, w: IWidget, metrics: any[]) {
  test.deepEqual(stack.resolve(w.toJson()), [{
    type: 'metric',
    width: 6,
    height: 6,
    properties:
    {
      view: 'timeSeries',
      region: { Ref: 'AWS::Region' },
      metrics,
      yAxis: {},
    },
  }]);
}