import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alarm, GraphWidget, IWidget, MathExpression, Metric } from '../lib';

const a = new Metric({ namespace: 'Test', metricName: 'ACount' });
const b = new Metric({ namespace: 'Test', metricName: 'BCount', statistic: 'Average' });
const c = new Metric({ namespace: 'Test', metricName: 'CCount' });
const b99 = new Metric({ namespace: 'Test', metricName: 'BCount', statistic: 'p99' });

let stack: Stack;
export = {
  'setUp'(cb: () => void) {
    stack = new Stack();
    cb();
  },

  'can not use invalid variable names in MathExpression'(test: Test) {
    test.throws(() => {
      new MathExpression({
        expression: 'HAPPY + JOY',
        usingMetrics: {
          HAPPY: a,
          JOY: b,
        },
      });
    }, /Invalid variable names in expression/);

    test.done();
  },

  'cannot reuse variable names in nested MathExpressions'(test: Test) {
    // WHEN
    test.throws(() => {
      new MathExpression({
        expression: 'a + e',
        usingMetrics: {
          a,
          e: new MathExpression({
            expression: 'a + c',
            usingMetrics: { a: b, c },
          }),
        },
      });
    }, /The ID 'a' used for two metrics in the expression: 'BCount' and 'ACount'. Rename one/);

    test.done();
  },

  'can not use invalid period in MathExpression'(test: Test) {
    test.throws(() => {
      new MathExpression({
        expression: 'a+b',
        usingMetrics: { a, b },
        period: Duration.seconds(20),
      });
    }, /'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received 20/);

    test.done();
  },

  'MathExpression optimization: "with" with the same period returns the same object'(test: Test) {
    const m = new MathExpression({ expression: 'SUM(METRICS())', usingMetrics: {}, period: Duration.minutes(10) });

    // Note: object equality, NOT deep equality on purpose
    test.equals(m.with({}), m);
    test.equals(m.with({ period: Duration.minutes(10) }), m);

    test.notEqual(m.with({ period: Duration.minutes(5) }), m);

    test.done();
  },

  'in graphs': {
    'MathExpressions can be added to a graph'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a, b },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ expression: 'a + b', label: 'a + b' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        ['Test', 'BCount', { visible: false, id: 'b' }],
      ]);

      test.done();
    },

    'can nest MathExpressions in a graph'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + e',
            usingMetrics: {
              a,
              e: new MathExpression({
                expression: 'b + c',
                usingMetrics: { b, c },
              }),
            },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ label: 'a + e', expression: 'a + e' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        [{ expression: 'b + c', visible: false, id: 'e' }],
        ['Test', 'BCount', { visible: false, id: 'b' }],
        ['Test', 'CCount', { visible: false, id: 'c' }],
      ]);

      test.done();
    },

    'can add the same metric under different ids'(test: Test) {
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + e',
            usingMetrics: {
              a,
              e: new MathExpression({
                expression: 'b + c',
                usingMetrics: { b: a, c },
              }),
            },
          }),
        ],
      });

      graphMetricsAre(test, graph, [
        [{ label: 'a + e', expression: 'a + e' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        [{ expression: 'b + c', visible: false, id: 'e' }],
        ['Test', 'ACount', { visible: false, id: 'b' }],
        ['Test', 'CCount', { visible: false, id: 'c' }],
      ]);

      test.done();
    },

    'can reuse identifiers in MathExpressions if metrics are the same'(test: Test) {
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + e',
            usingMetrics: {
              a,
              e: new MathExpression({
                expression: 'a + c',
                usingMetrics: { a, c },
              }),
            },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ label: 'a + e', expression: 'a + e' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        [{ expression: 'a + c', visible: false, id: 'e' }],
        ['Test', 'CCount', { visible: false, id: 'c' }],
      ]);

      test.done();
    },

    'MathExpression and its constituent metrics can both be added to a graph'(test: Test) {
      const graph = new GraphWidget({
        left: [
          a,
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a, b },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        ['Test', 'ACount', { id: 'a' }],
        [{ label: 'a + b', expression: 'a + b' }],
        ['Test', 'BCount', { visible: false, id: 'b' }],
      ]);
      test.done();
    },

    'MathExpression controls period of metrics directly used in it'(test: Test) {
      // Check that if we add A with { period: 10s } to a mathexpression of period 5m
      // then two metric lines are added for A, one at 10s and one at 5m
      const graph = new GraphWidget({
        left: [
          a.with({ period: Duration.seconds(10) }),
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a: a.with({ period: Duration.seconds(10) }), b },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        ['Test', 'ACount', { period: 10 }],
        [{ label: 'a + b', expression: 'a + b' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        ['Test', 'BCount', { visible: false, id: 'b' }],
      ]);
      test.done();
    },

    'top level period in a MathExpression is respected in its metrics'(test: Test) {
      const graph = new GraphWidget({
        left: [
          a,
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a, b },
            period: Duration.minutes(1),
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        ['Test', 'ACount'],
        [{ label: 'a + b', expression: 'a + b', period: 60 }],
        ['Test', 'ACount', { visible: false, id: 'a', period: 60 }],
        ['Test', 'BCount', { visible: false, id: 'b', period: 60 }],
      ]);
      test.done();
    },

    'MathExpression controls period of metrics transitively used in it'(test: Test) {
      // Same as the previous test, but recursively

      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + e',
            usingMetrics: {
              a,
              e: new MathExpression({
                expression: 'a + b',
                period: Duration.minutes(1),
                usingMetrics: { a, b },
              }),
            },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ expression: 'a + e', label: 'a + e' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        [{ expression: 'a + b', visible: false, id: 'e' }],
        ['Test', 'BCount', { visible: false, id: 'b' }],
      ]);
      test.done();
    },

    'can use percentiles in expression metrics in graphs'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + b99',
            usingMetrics: { a, b99 },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ expression: 'a + b99', label: 'a + b99' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        ['Test', 'BCount', { visible: false, id: 'b99', stat: 'p99' }],
      ]);

      test.done();
    },

    'can reuse the same metric between left and right axes'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + 1',
            usingMetrics: { a },
          }),
        ],
        right: [
          new MathExpression({
            expression: 'a + 2',
            usingMetrics: { a },
          }),
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [{ label: 'a + 1', expression: 'a + 1' }],
        ['Test', 'ACount', { visible: false, id: 'a' }],
        [{ label: 'a + 2', expression: 'a + 2', yAxis: 'right' }],
      ]);

      test.done();
    },

    'detect name conflicts between left and right axes'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'm1 + 1',
            usingMetrics: { m1: a },
          }),
        ],
        right: [
          new MathExpression({
            expression: 'm1 + 1',
            usingMetrics: { m1: b },
          }),
        ],
      });

      // THEN
      test.throws(() => {
        graphMetricsAre(test, graph, []);
      }, /Cannot have two different metrics share the same id \('m1'\)/);

      test.done();
    },
  },

  'in alarms': {
    'MathExpressions can be used for an alarm'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + b',
          usingMetrics: { a, b },
        }),
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: 'a + b',
          Id: 'expr_1',
        },
        {
          Id: 'a',
          MetricStat: {
            Metric: {
              MetricName: 'ACount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Id: 'b',
          MetricStat: {
            Metric: {
              MetricName: 'BCount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },

      ]);

      test.done();
    },

    'can nest MathExpressions in an alarm'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + e',
          usingMetrics: {
            a,
            e: new MathExpression({
              expression: 'b + c',
              usingMetrics: { b, c },
            }),
          },
        }),
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: 'a + e',
          Id: 'expr_1',
        },
        {
          Id: 'a',
          MetricStat: {
            Metric: {
              MetricName: 'ACount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Expression: 'b + c',
          Id: 'e',
          ReturnData: false,
        },
        {
          Id: 'b',
          MetricStat: {
            Metric: {
              MetricName: 'BCount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Id: 'c',
          MetricStat: {
            Metric: {
              MetricName: 'CCount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
      ]);

      test.done();
    },

    'MathExpression controls period of metrics transitively used in it with alarms'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + e',
          usingMetrics: {
            a,
            e: new MathExpression({
              expression: 'b + c',
              usingMetrics: { b, c },
              period: Duration.minutes(1),
            }),
          },
          period: Duration.seconds(30),
        }),
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: 'a + e',
          Id: 'expr_1',
        },
        {
          Id: 'a',
          MetricStat: {
            Metric: {
              MetricName: 'ACount',
              Namespace: 'Test',
            },
            Period: 30,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Expression: 'b + c',
          Id: 'e',
          ReturnData: false,
        },
        {
          Id: 'b',
          MetricStat: {
            Metric: {
              MetricName: 'BCount',
              Namespace: 'Test',
            },
            Period: 30,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Id: 'c',
          MetricStat: {
            Metric: {
              MetricName: 'CCount',
              Namespace: 'Test',
            },
            Period: 30,
            Stat: 'Average',
          },
          ReturnData: false,
        },
      ]);

      test.done();
    },

    'MathExpression without inner metrics emits its own period'(test: Test) {
      // WHEN
      new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'INSIGHT_RULE_METRIC("SomeId", UniqueContributors)',
          usingMetrics: {},
        }),
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: 'INSIGHT_RULE_METRIC("SomeId", UniqueContributors)',
          Id: 'expr_1',
          Period: 300,
        },
      ]);

      test.done();
    },

    'annotation for a mathexpression alarm is calculated based upon constituent metrics'(test: Test) {
      // GIVEN
      const alarm = new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          period: Duration.minutes(10),
          expression: 'a + b',
          usingMetrics: { a, b: b.with({ period: Duration.minutes(20) }) }, // This is overridden
        }),
      });

      // WHEN
      const alarmLabel = alarm.toAnnotation().label;

      // THEN
      test.equals(alarmLabel, 'a + b >= 1 for 1 datapoints within 10 minutes');

      test.done();
    },

    'can use percentiles in expression metrics in alarms'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + b99',
          usingMetrics: { a, b99 },
        }),
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: 'a + b99',
          Id: 'expr_1',
        },
        {
          Id: 'a',
          MetricStat: {
            Metric: {
              MetricName: 'ACount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Id: 'b99',
          MetricStat: {
            Metric: {
              MetricName: 'BCount',
              Namespace: 'Test',
            },
            Period: 300,
            Stat: 'p99',
          },
          ReturnData: false,
        },
      ]);

      test.done();
    },
  },
};

function graphMetricsAre(test: Test, w: IWidget, metrics: any[]) {
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

function alarmMetricsAre(metrics: any[]) {
  expect(stack).to(haveResourceLike('AWS::CloudWatch::Alarm', {
    Metrics: metrics,
  }));
}
