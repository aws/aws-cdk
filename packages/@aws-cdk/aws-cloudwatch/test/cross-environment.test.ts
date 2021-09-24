import { Template } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
import { Alarm, GraphWidget, IWidget, MathExpression, Metric } from '../lib';

const a = new Metric({ namespace: 'Test', metricName: 'ACount' });

let stack1: Stack;
let stack2: Stack;
let stack3: Stack;
describe('cross environment', () => {
  beforeEach(() => {
    stack1 = new Stack(undefined, undefined, { env: { region: 'pluto', account: '1234' } });
    stack2 = new Stack(undefined, undefined, { env: { region: 'mars', account: '5678' } });
    stack3 = new Stack(undefined, undefined, { env: { region: 'pluto', account: '0000' } });
  });

  describe('in graphs', () => {
    test('metric attached to stack1 will not render region and account in stack1', () => {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(stack1),
        ],
      });

      // THEN
      graphMetricsAre(stack1, graph, [
        ['Test', 'ACount'],
      ]);


    });

    test('metric attached to stack1 will render region and account in stack2', () => {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(stack1),
        ],
      });

      // THEN
      graphMetricsAre(stack2, graph, [
        ['Test', 'ACount', { region: 'pluto', accountId: '1234' }],
      ]);


    });

    test('metric with explicit account and region will render in environment agnostic stack', () => {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.with({ account: '1234', region: 'us-north-5' }),
        ],
      });

      // THEN
      graphMetricsAre(new Stack(), graph, [
        ['Test', 'ACount', { accountId: '1234', region: 'us-north-5' }],
      ]);


    });

    test('metric attached to agnostic stack will not render in agnostic stack', () => {
      // GIVEN
      const graph = new GraphWidget({
        left: [
          a.attachTo(new Stack()),
        ],
      });

      // THEN
      graphMetricsAre(new Stack(), graph, [
        ['Test', 'ACount'],
      ]);


    });

    test('math expressions with explicit account and region will render in environment agnostic stack', () => {
      // GIVEN
      const expression = 'SEARCH(\'MetricName="ACount"\', \'Sum\', 300)';

      const b = new MathExpression({
        expression,
        usingMetrics: {},
        label: 'Test label',
        searchAccount: '5678',
        searchRegion: 'mars',
      });

      const graph = new GraphWidget({
        left: [
          b,
        ],
      });

      // THEN
      graphMetricsAre(new Stack(), graph, [
        [{
          expression,
          accountId: '5678',
          region: 'mars',
          label: 'Test label',
        }],
      ]);
    });
  });

  describe('in alarms', () => {
    test('metric attached to stack1 will not render region and account in stack1', () => {
      // GIVEN
      new Alarm(stack1, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: a.attachTo(stack1),
      });

      // THEN
      Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
        MetricName: 'ACount',
        Namespace: 'Test',
        Period: 300,
      });


    });

    test('metric attached to stack1 will throw in stack2', () => {
      // Cross-region/cross-account metrics are supported in Dashboards but not in Alarms

      // GIVEN
      expect(() => {
        new Alarm(stack2, 'Alarm', {
          threshold: 1,
          evaluationPeriods: 1,
          metric: a.attachTo(stack1),
        });
      }).toThrow(/Cannot create an Alarm in region 'mars' based on metric 'ACount' in 'pluto'/);


    });

    test('metric attached to stack3 will render in stack1', () => {
      //Cross-account metrics are supported in Alarms

      // GIVEN
      new Alarm(stack1, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: a.attachTo(stack3),
      });

      // THEN
      Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Metrics: [
          {
            AccountId: '0000',
            Id: 'm1',
            MetricStat: {
              Metric: {
                MetricName: 'ACount',
                Namespace: 'Test',
              },
              Period: 300,
              Stat: 'Average',
            },
            ReturnData: true,
          },
        ],
      });
    });

    test('metric can render in a different account', () => {
      // GIVEN
      const b = new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        account: '0000',
      });

      new Alarm(stack1, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: b,
      });

      // THEN
      Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Metrics: [
          {
            AccountId: '0000',
            Id: 'm1',
            MetricStat: {
              Metric: {
                MetricName: 'ACount',
                Namespace: 'Test',
              },
              Period: 300,
              Stat: 'Average',
            },
            ReturnData: true,
          },
        ],
      });
    });

    test('math expression can render in a different account', () => {
      // GIVEN
      const b = new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        account: '1234',
      });

      const c = new MathExpression({
        expression: 'a + b',
        usingMetrics: { a: a.attachTo(stack3), b },
        period: Duration.minutes(1),
      });

      new Alarm(stack1, 'Alarm', {
        threshold: 1,
        evaluationPeriods: 1,
        metric: c,
      });

      // THEN
      Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Metrics: [
          {
            Expression: 'a + b',
            Id: 'expr_1',
          },
          {
            AccountId: '0000',
            Id: 'a',
            MetricStat: {
              Metric: {
                MetricName: 'ACount',
                Namespace: 'Test',
              },
              Period: 60,
              Stat: 'Average',
            },
            ReturnData: false,
          },
          {
            AccountId: '1234',
            Id: 'b',
            MetricStat: {
              Metric: {
                MetricName: 'ACount',
                Namespace: 'Test',
              },
              Period: 60,
              Stat: 'Average',
            },
            ReturnData: false,
          },
        ],
      });
    });

    test('math expression with different searchAccount will throw', () => {
      // GIVEN
      const b = new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        account: '1234',
      });

      const c = new MathExpression({
        expression: 'a + b',
        usingMetrics: { a: a.attachTo(stack3), b },
        period: Duration.minutes(1),
        searchAccount: '5678',
      });

      // THEN
      expect(() => {
        new Alarm(stack1, 'Alarm', {
          threshold: 1,
          evaluationPeriods: 1,
          metric: c,
        });
      }).toThrow(/Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
    });

    test('match expression with different searchRegion will throw', () => {
      // GIVEN
      const b = new Metric({
        namespace: 'Test',
        metricName: 'ACount',
        account: '1234',
      });

      const c = new MathExpression({
        expression: 'a + b',
        usingMetrics: { a: a.attachTo(stack3), b },
        period: Duration.minutes(1),
        searchRegion: 'mars',
      });

      // THEN
      expect(() => {
        new Alarm(stack1, 'Alarm', {
          threshold: 1,
          evaluationPeriods: 1,
          metric: c,
        });
      }).toThrow(/Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
    });
  });
});

function graphMetricsAre(stack: Stack, w: IWidget, metrics: any[]) {
  expect(stack.resolve(w.toJson())).toEqual([{
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
