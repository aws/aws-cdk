import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Alarm, AlarmWidget, Color, GraphWidget, Metric, Shading, SingleValueWidget } from '../lib';

export = {
  'add stacked property to graphs'(test: Test) {
    // WHEN
    const stack = new Stack();
    const widget = new GraphWidget({
      title: 'Test widget',
      stacked: true
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'Test widget',
        region: { Ref: 'AWS::Region' },
        stacked: true,
        yAxis: {}
      }
    }]);

    test.done();
  },

  'add metrics to graphs on either axis'(test: Test) {
    // WHEN
    const stack = new Stack();
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
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'My fancy graph',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test'],
          ['CDK', 'Tast', { yAxis: 'right' }]
        ],
        yAxis: {}
      }
    }]);

    test.done();
  },

  'label and color are respected in constructor'(test: Test) {
    // WHEN
    const stack = new Stack();
    const widget = new GraphWidget({
      left: [new Metric({ namespace: 'CDK', metricName: 'Test', label: 'MyMetric', color: '000000' }) ],
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { label: 'MyMetric', color: '000000' }],
        ],
        yAxis: {}
      }
    }]);

    test.done();
  },

  'singlevalue widget'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    // WHEN
    const widget = new SingleValueWidget({
      metrics: [ metric ]
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 3,
      properties: {
        view: 'singleValue',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test'],
        ]
      }
    }]);

    test.done();
  },

  'alarm widget'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const alarm = new Metric({ namespace: 'CDK', metricName: 'Test' }).createAlarm(stack, 'Alarm', {
      evaluationPeriods: 2,
      threshold: 1000
    });

    // WHEN
    const widget = new AlarmWidget({
      alarm,
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        annotations: {
          alarms: [{ 'Fn::GetAtt': [ 'Alarm7103F465', 'Arn' ] }]
        },
        yAxis: {}
      }
    }]);

    test.done();
  },

  'add annotations to graph'(test: Test) {
    // WHEN
    const stack = new Stack();
    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({ namespace: 'CDK', metricName: 'Test' })
      ],
      leftAnnotations: [{
        value: 1000,
        color: '667788',
        fill: Shading.BELOW,
        label: 'this is the annotation',
      }]
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'My fancy graph',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test'],
        ],
        annotations: { horizontal: [{
          yAxis: 'left',
          value: 1000,
          color: '667788',
          fill: 'below',
          label: 'this is the annotation',
        }] },
        yAxis: {}
      }
    }]);

    test.done();
  },

  'convert alarm to annotation'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    const alarm = metric.createAlarm(stack, 'Alarm', {
      evaluationPeriods: 7,
      datapointsToAlarm: 2,
      threshold: 1000
    });

    // WHEN
    const widget = new GraphWidget({
      right: [ metric ],
      rightAnnotations: [ alarm.toAnnotation() ]
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test', { yAxis: 'right' }],
        ],
        annotations: {
          horizontal: [{
            yAxis: 'right',
            value: 1000,
            label: 'Test >= 1000 for 2 datapoints within 35 minutes',
          }]
        },
        yAxis: {}
      }
    }]);

    test.done();
  },

  'add yAxis to graph'(test: Test) {
    // WHEN
    const stack = new Stack();
    const widget = new GraphWidget({
      title: 'My fancy graph',
      left: [
        new Metric({ namespace: 'CDK', metricName: 'Test' })
      ],
      right: [
        new Metric({ namespace: 'CDK', metricName: 'Tast' })
      ],
      leftYAxis: ({
        label: 'Left yAxis',
        max: 100
      }),
      rightYAxis: ({
        label: 'Right yAxis',
        min: 10,
        showUnits: false
      })
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        title: 'My fancy graph',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test'],
          ['CDK', 'Tast', { yAxis: 'right' }]
        ],
        yAxis: {
          left: { label: 'Left yAxis', max: 100 },
          right: { label: 'Right yAxis', min: 10, showUnits: false } }
      }
    }]);

    test.done();
  },

  'can use imported alarm with graph'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const alarm = Alarm.fromAlarmArn(stack, 'Alarm', 'arn:aws:cloudwatch:region:account-id:alarm:alarm-name');

    // WHEN
    new AlarmWidget({
      title: 'My fancy graph',
      alarm
    });

    // THEN: Compiles

    test.done();
  },

  'add setPeriodToTimeRange to singleValueWidget'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    // WHEN
    const widget = new SingleValueWidget({
      metrics: [ metric ],
      setPeriodToTimeRange: true
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [{
      type: 'metric',
      width: 6,
      height: 3,
      properties: {
        view: 'singleValue',
        region: { Ref: 'AWS::Region' },
        metrics: [
          ['CDK', 'Test'],
        ],
        setPeriodToTimeRange: true
      }
    }]);

    test.done();
  },

  'allows overriding custom values of dashboard widgets'(test: Test) {
    class HiddenMetric extends Metric {
      public toMetricConfig() {
        const ret = super.toMetricConfig();
        // @ts-ignore
        ret.renderingProperties.visible = false;
        return ret;
      }
    }

    const stack = new Stack();
    const widget = new GraphWidget({
      left: [
        new HiddenMetric({ namespace: 'CDK', metricName: 'Test' })
      ]
    });

    // test.ok(widget.toJson()[0].properties.metrics[0].visible === false);
    test.deepEqual(
      stack.resolve(widget.toJson())[0].properties.metrics[0],
      ['CDK', 'Test', { visible: false }]
    );

    test.done();
  },

  'GraphColor is correctly converted into the correct hexcode'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });

    // WHEN
    const widget = new GraphWidget({
      left: [metric.with({
        color: Color.BLUE,
      })],
      leftAnnotations: [
        { color: Color.RED, value: 100, },
      ]
    });

    test.deepEqual(stack.resolve(widget.toJson())[0].properties.metrics[0], [ 'CDK', 'Test', { color: '#1f77b4' } ]);
    test.deepEqual(stack.resolve(widget.toJson())[0].properties.annotations.horizontal[0], { yAxis: 'left', value: 100, color: '#d62728' });
    test.done();
  },
};