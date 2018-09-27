import { resolve, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { AlarmWidget, GraphWidget, Metric, Shading, SingleValueWidget } from '../lib';

export = {
  'add metrics to graphs on either axis'(test: Test) {
    // WHEN
    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({ namespace: 'CDK', metricName: 'Test' })
      ],
      right: [
        new Metric({ namespace: 'CDK', metricName: 'Tast' })
      ]
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'My fancy graph',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'left', period: 300, stat: 'Average' }],
          ['CDK', 'Tast', { yAxis: 'right', period: 300, stat: 'Average' }]
        ],
        annotations: { horizontal: [] },
        yAxis: { left: { min: 0 }, right: { min: 0 } }
      }
    }]);

    test.done();
  },

  'label and color are respected in constructor'(test: Test) {
    // WHEN
    const widget = new GraphWidget({
      left: [new Metric({ namespace: 'CDK', metricName: 'Test', label: 'MyMetric', color: '000000' }) ],
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'left', period: 300, stat: 'Average', label: 'MyMetric', color: '000000' }],
        ],
        annotations: { horizontal: [] },
        yAxis: { left: { min: 0 }, right: { min: 0 } }
      }
    }]);

    test.done();
  },

  'singlevalue widget'(test: Test) {
    // GIVEN
    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    // WHEN
    const widget = new SingleValueWidget({
      metrics: [ metric ]
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 3,
      properties: {
        view: 'singleValue',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'left', period: 300, stat: 'Average' }],
        ],
      }
    }]);

    test.done();
  },

  'alarm widget'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const alarm = new Metric({ namespace: 'CDK', metricName: 'Test' }).newAlarm(stack, 'Alarm', {
      evaluationPeriods: 2,
      threshold: 1000
    });

    // WHEN
    const widget = new AlarmWidget({
      alarm,
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        annotations: {
          alarms: [{ 'Fn::GetAtt': [ 'Alarm7103F465', 'Arn' ] }]
        },
        yAxis: { left: { min: 0 } }
      }
    }]);

    test.done();
  },

  'add annotations to graph'(test: Test) {
    // WHEN
    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({ namespace: 'CDK', metricName: 'Test' })
      ],
      leftAnnotations: [{
        value: 1000,
        color: '667788',
        fill: Shading.Below,
        label: 'this is the annotation',
      }]
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'My fancy graph',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'left', period: 300, stat: 'Average' }],
        ],
        annotations: { horizontal: [{
          yAxis: 'left',
          value: 1000,
          color: '667788',
          fill: 'below',
          label: 'this is the annotation',
        }] },
        yAxis: { left: { min: 0 }, right: { min: 0 } }
      }
    }]);

    test.done();
  },

  'convert alarm to annotation'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    const alarm = metric.newAlarm(stack, 'Alarm', {
      evaluationPeriods: 2,
      threshold: 1000
    });

    // WHEN
    const widget = new GraphWidget({
      right: [ metric ],
      rightAnnotations: [ alarm.toAnnotation() ]
    });

    // THEN
    test.deepEqual(resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'right', period: 300, stat: 'Average' }],
        ],
        annotations: {
          horizontal: [{
            yAxis: 'right',
            value: 1000,
            label: 'Test >= 1000 for 2 datapoints within 10 minutes',
          }]
        },
        yAxis: { left: { min: 0 }, right: { min: 0 } }
      }
    }]);

    test.done();
  },
};
