import { expect, haveResourceLike } from '@aws-cdk/assert';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alarm, GraphWidget, IWidget, MathExpression, Metric } from '../lib';

const a = new Metric({ namespace: 'Test', metricName: 'ACount', period: Duration.seconds(10) });
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
          JOY: b
        }
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
            usingMetrics: { a: b, c }
          })
        }
      });
    }, /Same id \('a'\) used for two metrics/);

    test.done();
  },

  'in graphs': {
    'MathExpressions can be added to a graph'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a, b }
          })
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [ { expression: 'a + b', label: 'a + b' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'a' } ],
        [ 'Test', 'BCount', { visible: false, id: 'b' } ],
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
                usingMetrics: { b, c }
              })
            }
          })
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [ { label: 'a + e', expression: 'a + e' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'a' } ],
        [ { expression: 'b + c', visible: false, id: 'e' } ],
        [ 'Test', 'BCount', { visible: false, id: 'b' } ],
        [ 'Test', 'CCount', { visible: false, id: 'c' } ]
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
                usingMetrics: { b: a, c }
              })
            }
          })
        ],
      });

      graphMetricsAre(test, graph, [
        [ { label: 'a + e', expression: 'a + e' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'a' } ],
        [ { expression: 'b + c', visible: false, id: 'e' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'b' } ],
        [ 'Test', 'CCount', { visible: false, id: 'c' } ]
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
                usingMetrics: { a, c }
              })
            }
          })
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [ { label: 'a + e', expression: 'a + e' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'a' } ],
        [ { expression: 'a + c', visible: false, id: 'e' } ],
        [ 'Test', 'CCount', { visible: false, id: 'c' } ]
      ]);

      test.done();
    },

    'MathExpression and its constituent metrics can both be added to a graph'(test: Test) {
      const graph = new GraphWidget({
        left: [
          a,
          new MathExpression({
            expression: 'a + b',
            usingMetrics: { a, b }
          })
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [ 'Test', 'ACount', { period: 10, id: 'a' } ],
        [ { label: 'a + b', expression: 'a + b' } ],
        [ 'Test', 'BCount', { visible: false, id: 'b' } ]
      ]);
      test.done();
    },

    'can use percentiles in expression metrics in graphs'(test: Test) {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          new MathExpression({
            expression: 'a + b99',
            usingMetrics: { a, b99 }
          })
        ],
      });

      // THEN
      graphMetricsAre(test, graph, [
        [ { expression: 'a + b99', label: 'a + b99' } ],
        [ 'Test', 'ACount', { period: 10, visible: false, id: 'a' } ],
        [ 'Test', 'BCount', { visible: false, id: 'b99', stat: 'p99' } ],
      ]);

      test.done();
    },
  },

  'in alarms': {
    'MathExpressions can be used for an alarm'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1, evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + b',
          usingMetrics: { a, b }
        })
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: "a + b",
          Id: "expr_1"
        },
        {
          Id: "a",
          MetricStat: {
            Metric: {
              MetricName: "ACount",
              Namespace: "Test"
            },
            Period: 10,
            Stat: "Average"
          },
          ReturnData: false
        },
        {
          Id: "b",
          MetricStat: {
            Metric: {
              MetricName: "BCount",
              Namespace: "Test"
            },
            Period: 300,
            Stat: "Average"
          },
          ReturnData: false
        }

      ]);

      test.done();
    },

    'can nest MathExpressions in an alarm'(test: Test) {
      // GIVEN
      new Alarm(stack, 'Alarm', {
        threshold: 1, evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + e',
          usingMetrics: {
            a,
            e: new MathExpression({
              expression: 'b + c',
              usingMetrics: { b, c }
            })
          }
        })
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: "a + e",
          Id: "expr_1"
        },
        {
          Id: "a",
          MetricStat: {
            Metric: {
              MetricName: "ACount",
              Namespace: "Test"
            },
            Period: 10,
            Stat: "Average"
          },
          ReturnData: false
        },
        {
          Expression: "b + c",
          Id: "e",
          ReturnData: false
        },
        {
          Id: "b",
          MetricStat: {
            Metric: {
              MetricName: "BCount",
              Namespace: "Test"
            },
            Period: 300,
            Stat: "Average"
          },
          ReturnData: false
        },
        {
          Id: "c",
          MetricStat: {
            Metric: {
              MetricName: "CCount",
              Namespace: "Test"
            },
            Period: 300,
            Stat: "Average"
          },
          ReturnData: false
        }
      ]);

      test.done();
    },

    'annotation for a mathexpression alarm is calculated based upon constituent metrics'(test: Test) {
      // GIVEN
      const alarm = new Alarm(stack, 'Alarm', {
        threshold: 1, evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + b',
          usingMetrics: { a, b: b.with({ period: Duration.minutes(10) }) }
        })
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
        threshold: 1, evaluationPeriods: 1,
        metric: new MathExpression({
          expression: 'a + b99',
          usingMetrics: { a, b99 }
        })
      });

      // THEN
      alarmMetricsAre([
        {
          Expression: "a + b99",
          Id: "expr_1"
        },
        {
          Id: "a",
          MetricStat: {
            Metric: {
              MetricName: "ACount",
              Namespace: "Test"
            },
            Period: 10,
            Stat: "Average"
          },
          ReturnData: false
        },
        {
          Id: "b99",
          MetricStat: {
            Metric: {
              MetricName: "BCount",
              Namespace: "Test"
            },
            Period: 300,
            Stat: "p99"
          },
          ReturnData: false
        }
      ]);

      test.done();
    },
  }
};

function graphMetricsAre(test: Test, w: IWidget, metrics: any[]) {
  test.deepEqual(stack.resolve(w.toJson()), [ {
    type: 'metric',
    width: 6,
    height: 6,
    properties:
    { view: 'timeSeries',
      region: { Ref: 'AWS::Region' },
      metrics,
      yAxis: {} } }]);
}

function alarmMetricsAre(metrics: any[]) {
  expect(stack).to(haveResourceLike('AWS::CloudWatch::Alarm', {
    Metrics: metrics
  }));
}
