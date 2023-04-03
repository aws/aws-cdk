"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Graphs', () => {
    test('add stacked property to graphs', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'Test widget',
            stacked: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    title: 'Test widget',
                    region: { Ref: 'AWS::Region' },
                    stacked: true,
                    yAxis: {},
                },
            }]);
    });
    test('add metrics to graphs on either axis', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'My fancy graph',
            left: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }),
            ],
            right: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Tast' }),
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    title: 'My fancy graph',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                        ['CDK', 'Tast', { yAxis: 'right' }],
                    ],
                    yAxis: {},
                },
            }]);
    });
    test('add metrics to graphs on either axis lazily', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'My fancy graph',
        });
        widget.addLeftMetric(new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }));
        widget.addRightMetric(new lib_1.Metric({ namespace: 'CDK', metricName: 'Tast' }));
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    title: 'My fancy graph',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                        ['CDK', 'Tast', { yAxis: 'right' }],
                    ],
                    yAxis: {},
                },
            }]);
    });
    test('label and color are respected in constructor', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            left: [new lib_1.Metric({ namespace: 'CDK', metricName: 'Test', label: 'MyMetric', color: '000000' })],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test', { label: 'MyMetric', color: '000000' }],
                    ],
                    yAxis: {},
                },
            }]);
    });
    test('bar view', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'Test widget',
            view: lib_1.GraphWidgetView.BAR,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'bar',
                    title: 'Test widget',
                    region: { Ref: 'AWS::Region' },
                    yAxis: {},
                },
            }]);
    });
    test('singlevalue widget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const widget = new lib_1.SingleValueWidget({
            metrics: [metric],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 3,
                properties: {
                    view: 'singleValue',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                },
            }]);
    });
    test('query result widget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = { logGroupName: 'my-log-group' };
        // WHEN
        const widget = new lib_1.LogQueryWidget({
            logGroupNames: [logGroup.logGroupName],
            queryLines: [
                'fields @message',
                'filter @message like /Error/',
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'log',
                width: 6,
                height: 6,
                properties: {
                    view: 'table',
                    region: { Ref: 'AWS::Region' },
                    query: `SOURCE '${logGroup.logGroupName}' | fields @message\n| filter @message like /Error/`,
                },
            }]);
    });
    test('query result widget - bar', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = { logGroupName: 'my-log-group' };
        // WHEN
        const widget = new lib_1.LogQueryWidget({
            logGroupNames: [logGroup.logGroupName],
            view: lib_1.LogQueryVisualizationType.BAR,
            queryLines: [
                'fields @message',
                'filter @message like /Error/',
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'log',
                width: 6,
                height: 6,
                properties: {
                    view: 'bar',
                    region: { Ref: 'AWS::Region' },
                    query: `SOURCE '${logGroup.logGroupName}' | fields @message\n| filter @message like /Error/`,
                },
            }]);
    });
    test('query result widget - pie', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = { logGroupName: 'my-log-group' };
        // WHEN
        const widget = new lib_1.LogQueryWidget({
            logGroupNames: [logGroup.logGroupName],
            view: lib_1.LogQueryVisualizationType.PIE,
            queryLines: [
                'fields @message',
                'filter @message like /Error/',
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'log',
                width: 6,
                height: 6,
                properties: {
                    view: 'pie',
                    region: { Ref: 'AWS::Region' },
                    query: `SOURCE '${logGroup.logGroupName}' | fields @message\n| filter @message like /Error/`,
                },
            }]);
    });
    test('query result widget - line', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = { logGroupName: 'my-log-group' };
        // WHEN
        const widget = new lib_1.LogQueryWidget({
            logGroupNames: [logGroup.logGroupName],
            view: lib_1.LogQueryVisualizationType.LINE,
            queryLines: [
                'fields @message',
                'filter @message like /Error/',
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'log',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    stacked: false,
                    region: { Ref: 'AWS::Region' },
                    query: `SOURCE '${logGroup.logGroupName}' | fields @message\n| filter @message like /Error/`,
                },
            }]);
    });
    test('query result widget - stackedarea', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = { logGroupName: 'my-log-group' };
        // WHEN
        const widget = new lib_1.LogQueryWidget({
            logGroupNames: [logGroup.logGroupName],
            view: lib_1.LogQueryVisualizationType.STACKEDAREA,
            queryLines: [
                'fields @message',
                'filter @message like /Error/',
            ],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'log',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    stacked: true,
                    region: { Ref: 'AWS::Region' },
                    query: `SOURCE '${logGroup.logGroupName}' | fields @message\n| filter @message like /Error/`,
                },
            }]);
    });
    test('alarm widget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const alarm = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }).createAlarm(stack, 'Alarm', {
            evaluationPeriods: 2,
            threshold: 1000,
        });
        // WHEN
        const widget = new lib_1.AlarmWidget({
            alarm,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    region: { Ref: 'AWS::Region' },
                    annotations: {
                        alarms: [{ 'Fn::GetAtt': ['Alarm7103F465', 'Arn'] }],
                    },
                    yAxis: {},
                },
            }]);
    });
    test('custom widget basic', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const widget = new lib_1.CustomWidget({
            functionArn: 'arn:aws:lambda:us-east-1:123456789:function:customwidgetfunction',
            title: 'CustomWidget',
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'custom',
                width: 6,
                height: 6,
                properties: {
                    title: 'CustomWidget',
                    endpoint: 'arn:aws:lambda:us-east-1:123456789:function:customwidgetfunction',
                    updateOn: {
                        refresh: true,
                        resize: true,
                        timeRange: true,
                    },
                },
            }]);
    });
    test('custom widget full config', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const widget = new lib_1.CustomWidget({
            functionArn: 'arn:aws:lambda:us-east-1:123456789:function:customwidgetfunction',
            title: 'CustomWidget',
            height: 1,
            width: 1,
            params: {
                any: 'param',
            },
            updateOnRefresh: false,
            updateOnResize: false,
            updateOnTimeRangeChange: false,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'custom',
                width: 1,
                height: 1,
                properties: {
                    title: 'CustomWidget',
                    endpoint: 'arn:aws:lambda:us-east-1:123456789:function:customwidgetfunction',
                    params: {
                        any: 'param',
                    },
                    updateOn: {
                        refresh: false,
                        resize: false,
                        timeRange: false,
                    },
                },
            }]);
    });
    test('add annotations to graph', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'My fancy graph',
            left: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }),
            ],
            leftAnnotations: [{
                    value: 1000,
                    color: '667788',
                    fill: lib_1.Shading.BELOW,
                    label: 'this is the annotation',
                }],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
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
                    annotations: {
                        horizontal: [{
                                yAxis: 'left',
                                value: 1000,
                                color: '667788',
                                fill: 'below',
                                label: 'this is the annotation',
                            }],
                    },
                    yAxis: {},
                },
            }]);
    });
    test('convert alarm to annotation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        const alarm = metric.createAlarm(stack, 'Alarm', {
            evaluationPeriods: 7,
            datapointsToAlarm: 2,
            threshold: 1000,
        });
        // WHEN
        const widget = new lib_1.GraphWidget({
            right: [metric],
            rightAnnotations: [alarm.toAnnotation()],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
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
                            }],
                    },
                    yAxis: {},
                },
            }]);
    });
    test('add yAxis to graph', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'My fancy graph',
            left: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }),
            ],
            right: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Tast' }),
            ],
            leftYAxis: ({
                label: 'Left yAxis',
                max: 100,
            }),
            rightYAxis: ({
                label: 'Right yAxis',
                min: 10,
                showUnits: false,
            }),
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    title: 'My fancy graph',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                        ['CDK', 'Tast', { yAxis: 'right' }],
                    ],
                    yAxis: {
                        left: { label: 'Left yAxis', max: 100 },
                        right: { label: 'Right yAxis', min: 10, showUnits: false },
                    },
                },
            }]);
    });
    test('specify liveData property on graph', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            title: 'My live graph',
            left: [
                new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' }),
            ],
            liveData: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    title: 'My live graph',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    liveData: true,
                    yAxis: {},
                },
            }]);
    });
    test('can use imported alarm with graph', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const alarm = lib_1.Alarm.fromAlarmArn(stack, 'Alarm', 'arn:aws:cloudwatch:region:account-id:alarm:alarm-name');
        // WHEN
        new lib_1.AlarmWidget({
            title: 'My fancy graph',
            alarm,
        });
        // THEN: Compiles
    });
    test('add setPeriodToTimeRange to singleValueWidget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const widget = new lib_1.SingleValueWidget({
            metrics: [metric],
            setPeriodToTimeRange: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 3,
                properties: {
                    view: 'singleValue',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    setPeriodToTimeRange: true,
                },
            }]);
    });
    test('add sparkline to singleValueWidget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const widget = new lib_1.SingleValueWidget({
            metrics: [metric],
            sparkline: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 3,
                properties: {
                    view: 'singleValue',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    sparkline: true,
                },
            }]);
    });
    test('throws if setPeriodToTimeRange and sparkline is set on singleValueWidget', () => {
        // GIVEN
        new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const toThrow = () => {
            new lib_1.SingleValueWidget({
                metrics: [metric],
                setPeriodToTimeRange: true,
                sparkline: true,
            });
        };
        // THEN
        expect(() => toThrow()).toThrow(/You cannot use setPeriodToTimeRange with sparkline/);
    });
    test('add singleValueFullPrecision to singleValueWidget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const widget = new lib_1.SingleValueWidget({
            metrics: [metric],
            fullPrecision: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 3,
                properties: {
                    view: 'singleValue',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    singleValueFullPrecision: true,
                },
            }]);
    });
    test('allows overriding custom values of dashboard widgets', () => {
        class HiddenMetric extends lib_1.Metric {
            toMetricConfig() {
                const ret = super.toMetricConfig();
                // @ts-ignore
                ret.renderingProperties.visible = false;
                return ret;
            }
        }
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            left: [
                new HiddenMetric({ namespace: 'CDK', metricName: 'Test' }),
            ],
        });
        expect(stack.resolve(widget.toJson())[0].properties.metrics[0])
            .toEqual(['CDK', 'Test', { visible: false }]);
    });
    test('GraphColor is correctly converted into the correct hexcode', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const metric = new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' });
        // WHEN
        const widget = new lib_1.GraphWidget({
            left: [metric.with({
                    color: lib_1.Color.BLUE,
                })],
            leftAnnotations: [
                { color: lib_1.Color.RED, value: 100 },
            ],
        });
        expect(stack.resolve(widget.toJson())[0].properties.metrics[0]).toEqual(['CDK', 'Test', { color: '#1f77b4' }]);
        expect(stack.resolve(widget.toJson())[0].properties.annotations.horizontal[0]).toEqual({ yAxis: 'left', value: 100, color: '#d62728' });
    });
    test('legend position is respected in constructor', () => {
        // WHEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            left: [new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' })],
            legendPosition: lib_1.LegendPosition.RIGHT,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    yAxis: {},
                    legend: {
                        position: 'right',
                    },
                },
            }]);
    });
    test('add setPeriodToTimeRange to GraphWidget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            left: [new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' })],
            view: lib_1.GraphWidgetView.PIE,
            setPeriodToTimeRange: true,
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'pie',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    yAxis: {},
                    setPeriodToTimeRange: true,
                },
            }]);
    });
    test('add GaugeWidget', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GaugeWidget({
            metrics: [new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' })],
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'gauge',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    yAxis: {
                        left: {
                            min: 0,
                            max: 100,
                        },
                    },
                },
            }]);
    });
    test('GraphWidget supports stat and period', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const widget = new lib_1.GraphWidget({
            left: [new lib_1.Metric({ namespace: 'CDK', metricName: 'Test' })],
            statistic: 'Average',
            period: core_1.Duration.days(2),
        });
        // THEN
        expect(stack.resolve(widget.toJson())).toEqual([{
                type: 'metric',
                width: 6,
                height: 6,
                properties: {
                    view: 'timeSeries',
                    region: { Ref: 'AWS::Region' },
                    metrics: [
                        ['CDK', 'Test'],
                    ],
                    yAxis: {},
                    stat: 'Average',
                    period: 172800,
                },
            }]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFwaHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFnRDtBQUNoRCxnQ0FBMk07QUFFM00sUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUMxQyxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFXLENBQUM7WUFDN0IsS0FBSyxFQUFFLGFBQWE7WUFDcEIsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxZQUFZO29CQUNsQixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTtvQkFDOUIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsS0FBSyxFQUFFLEVBQUU7aUJBQ1Y7YUFDRixDQUFDLENBQUMsQ0FBQztJQUdOLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUNoRCxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFXLENBQUM7WUFDN0IsS0FBSyxFQUFFLGdCQUFnQjtZQUN2QixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxZQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUs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LEVBQUU7d0JBQ1AsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO3FCQUNoQjtvQkFDRCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxJQUFJLEVBQUUsU0FBUztvQkFDZixNQUFNLEVBQUUsTUFBTTtpQkFDZjthQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWxhcm0sIEFsYXJtV2lkZ2V0LCBDb2xvciwgR3JhcGhXaWRnZXQsIEdyYXBoV2lkZ2V0VmlldywgTGVnZW5kUG9zaXRpb24sIExvZ1F1ZXJ5V2lkZ2V0LCBNZXRyaWMsIFNoYWRpbmcsIFNpbmdsZVZhbHVlV2lkZ2V0LCBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLCBDdXN0b21XaWRnZXQsIEdhdWdlV2lkZ2V0IH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0dyYXBocycsICgpID0+IHtcbiAgdGVzdCgnYWRkIHN0YWNrZWQgcHJvcGVydHkgdG8gZ3JhcGhzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICB0aXRsZTogJ1Rlc3Qgd2lkZ2V0JyxcbiAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ21ldHJpYycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICB0aXRsZTogJ1Rlc3Qgd2lkZ2V0JyxcbiAgICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICBzdGFja2VkOiB0cnVlLFxuICAgICAgICB5QXhpczoge30sXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWNzIHRvIGdyYXBocyBvbiBlaXRoZXIgYXhpcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgdGl0bGU6ICdNeSBmYW5jeSBncmFwaCcsXG4gICAgICBsZWZ0OiBbXG4gICAgICAgIG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSksXG4gICAgICBdLFxuICAgICAgcmlnaHQ6IFtcbiAgICAgICAgbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUYXN0JyB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ21ldHJpYycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICB0aXRsZTogJ015IGZhbmN5IGdyYXBoJyxcbiAgICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICBtZXRyaWNzOiBbXG4gICAgICAgICAgWydDREsnLCAnVGVzdCddLFxuICAgICAgICAgIFsnQ0RLJywgJ1Rhc3QnLCB7IHlBeGlzOiAncmlnaHQnIH1dLFxuICAgICAgICBdLFxuICAgICAgICB5QXhpczoge30sXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWNzIHRvIGdyYXBocyBvbiBlaXRoZXIgYXhpcyBsYXppbHknLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIHRpdGxlOiAnTXkgZmFuY3kgZ3JhcGgnLFxuICAgIH0pO1xuICAgIHdpZGdldC5hZGRMZWZ0TWV0cmljKG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSkpO1xuICAgIHdpZGdldC5hZGRSaWdodE1ldHJpYyhuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rhc3QnIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHRpdGxlOiAnTXkgZmFuY3kgZ3JhcGgnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAgICBbJ0NESycsICdUZXN0J10sXG4gICAgICAgICAgWydDREsnLCAnVGFzdCcsIHsgeUF4aXM6ICdyaWdodCcgfV0sXG4gICAgICAgIF0sXG4gICAgICAgIHlBeGlzOiB7fSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnbGFiZWwgYW5kIGNvbG9yIGFyZSByZXNwZWN0ZWQgaW4gY29uc3RydWN0b3InLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIGxlZnQ6IFtuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnLCBsYWJlbDogJ015TWV0cmljJywgY29sb3I6ICcwMDAwMDAnIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnLCB7IGxhYmVsOiAnTXlNZXRyaWMnLCBjb2xvcjogJzAwMDAwMCcgfV0sXG4gICAgICAgIF0sXG4gICAgICAgIHlBeGlzOiB7fSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYmFyIHZpZXcnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIHRpdGxlOiAnVGVzdCB3aWRnZXQnLFxuICAgICAgdmlldzogR3JhcGhXaWRnZXRWaWV3LkJBUixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAnYmFyJyxcbiAgICAgICAgdGl0bGU6ICdUZXN0IHdpZGdldCcsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgeUF4aXM6IHt9LFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdzaW5nbGV2YWx1ZSB3aWRnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG1ldHJpYyA9IG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IFNpbmdsZVZhbHVlV2lkZ2V0KHtcbiAgICAgIG1ldHJpY3M6IFttZXRyaWNdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICdzaW5nbGVWYWx1ZScsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgncXVlcnkgcmVzdWx0IHdpZGdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSB7IGxvZ0dyb3VwTmFtZTogJ215LWxvZy1ncm91cCcgfTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgTG9nUXVlcnlXaWRnZXQoe1xuICAgICAgbG9nR3JvdXBOYW1lczogW2xvZ0dyb3VwLmxvZ0dyb3VwTmFtZV0sXG4gICAgICBxdWVyeUxpbmVzOiBbXG4gICAgICAgICdmaWVsZHMgQG1lc3NhZ2UnLFxuICAgICAgICAnZmlsdGVyIEBtZXNzYWdlIGxpa2UgL0Vycm9yLycsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdsb2cnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDYsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICd0YWJsZScsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgcXVlcnk6IGBTT1VSQ0UgJyR7bG9nR3JvdXAubG9nR3JvdXBOYW1lfScgfCBmaWVsZHMgQG1lc3NhZ2VcXG58IGZpbHRlciBAbWVzc2FnZSBsaWtlIC9FcnJvci9gLFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdxdWVyeSByZXN1bHQgd2lkZ2V0IC0gYmFyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IHsgbG9nR3JvdXBOYW1lOiAnbXktbG9nLWdyb3VwJyB9O1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBMb2dRdWVyeVdpZGdldCh7XG4gICAgICBsb2dHcm91cE5hbWVzOiBbbG9nR3JvdXAubG9nR3JvdXBOYW1lXSxcbiAgICAgIHZpZXc6IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuQkFSLFxuICAgICAgcXVlcnlMaW5lczogW1xuICAgICAgICAnZmllbGRzIEBtZXNzYWdlJyxcbiAgICAgICAgJ2ZpbHRlciBAbWVzc2FnZSBsaWtlIC9FcnJvci8nLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbG9nJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAnYmFyJyxcbiAgICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICBxdWVyeTogYFNPVVJDRSAnJHtsb2dHcm91cC5sb2dHcm91cE5hbWV9JyB8IGZpZWxkcyBAbWVzc2FnZVxcbnwgZmlsdGVyIEBtZXNzYWdlIGxpa2UgL0Vycm9yL2AsXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3F1ZXJ5IHJlc3VsdCB3aWRnZXQgLSBwaWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0geyBsb2dHcm91cE5hbWU6ICdteS1sb2ctZ3JvdXAnIH07XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IExvZ1F1ZXJ5V2lkZ2V0KHtcbiAgICAgIGxvZ0dyb3VwTmFtZXM6IFtsb2dHcm91cC5sb2dHcm91cE5hbWVdLFxuICAgICAgdmlldzogTG9nUXVlcnlWaXN1YWxpemF0aW9uVHlwZS5QSUUsXG4gICAgICBxdWVyeUxpbmVzOiBbXG4gICAgICAgICdmaWVsZHMgQG1lc3NhZ2UnLFxuICAgICAgICAnZmlsdGVyIEBtZXNzYWdlIGxpa2UgL0Vycm9yLycsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdsb2cnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDYsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICdwaWUnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIHF1ZXJ5OiBgU09VUkNFICcke2xvZ0dyb3VwLmxvZ0dyb3VwTmFtZX0nIHwgZmllbGRzIEBtZXNzYWdlXFxufCBmaWx0ZXIgQG1lc3NhZ2UgbGlrZSAvRXJyb3IvYCxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgncXVlcnkgcmVzdWx0IHdpZGdldCAtIGxpbmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0geyBsb2dHcm91cE5hbWU6ICdteS1sb2ctZ3JvdXAnIH0gO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBMb2dRdWVyeVdpZGdldCh7XG4gICAgICBsb2dHcm91cE5hbWVzOiBbbG9nR3JvdXAubG9nR3JvdXBOYW1lXSxcbiAgICAgIHZpZXc6IExvZ1F1ZXJ5VmlzdWFsaXphdGlvblR5cGUuTElORSxcbiAgICAgIHF1ZXJ5TGluZXM6IFtcbiAgICAgICAgJ2ZpZWxkcyBAbWVzc2FnZScsXG4gICAgICAgICdmaWx0ZXIgQG1lc3NhZ2UgbGlrZSAvRXJyb3IvJyxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ2xvZycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICBzdGFja2VkOiBmYWxzZSxcbiAgICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICBxdWVyeTogYFNPVVJDRSAnJHtsb2dHcm91cC5sb2dHcm91cE5hbWV9JyB8IGZpZWxkcyBAbWVzc2FnZVxcbnwgZmlsdGVyIEBtZXNzYWdlIGxpa2UgL0Vycm9yL2AsXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3F1ZXJ5IHJlc3VsdCB3aWRnZXQgLSBzdGFja2VkYXJlYScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSB7IGxvZ0dyb3VwTmFtZTogJ215LWxvZy1ncm91cCcgfTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgTG9nUXVlcnlXaWRnZXQoe1xuICAgICAgbG9nR3JvdXBOYW1lczogW2xvZ0dyb3VwLmxvZ0dyb3VwTmFtZV0sXG4gICAgICB2aWV3OiBMb2dRdWVyeVZpc3VhbGl6YXRpb25UeXBlLlNUQUNLRURBUkVBLFxuICAgICAgcXVlcnlMaW5lczogW1xuICAgICAgICAnZmllbGRzIEBtZXNzYWdlJyxcbiAgICAgICAgJ2ZpbHRlciBAbWVzc2FnZSBsaWtlIC9FcnJvci8nLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbG9nJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgcXVlcnk6IGBTT1VSQ0UgJyR7bG9nR3JvdXAubG9nR3JvdXBOYW1lfScgfCBmaWVsZHMgQG1lc3NhZ2VcXG58IGZpbHRlciBAbWVzc2FnZSBsaWtlIC9FcnJvci9gLFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhbGFybSB3aWRnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYWxhcm0gPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pLmNyZWF0ZUFsYXJtKHN0YWNrLCAnQWxhcm0nLCB7XG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMixcbiAgICAgIHRocmVzaG9sZDogMTAwMCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgQWxhcm1XaWRnZXQoe1xuICAgICAgYWxhcm0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ21ldHJpYycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgYWxhcm1zOiBbeyAnRm46OkdldEF0dCc6IFsnQWxhcm03MTAzRjQ2NScsICdBcm4nXSB9XSxcbiAgICAgICAgfSxcbiAgICAgICAgeUF4aXM6IHt9LFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gd2lkZ2V0IGJhc2ljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgQ3VzdG9tV2lkZ2V0KHtcbiAgICAgIGZ1bmN0aW9uQXJuOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTpmdW5jdGlvbjpjdXN0b213aWRnZXRmdW5jdGlvbicsXG4gICAgICB0aXRsZTogJ0N1c3RvbVdpZGdldCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGl0bGU6ICdDdXN0b21XaWRnZXQnLFxuICAgICAgICBlbmRwb2ludDogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMToxMjM0NTY3ODk6ZnVuY3Rpb246Y3VzdG9td2lkZ2V0ZnVuY3Rpb24nLFxuICAgICAgICB1cGRhdGVPbjoge1xuICAgICAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgICAgIHRpbWVSYW5nZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfV0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gd2lkZ2V0IGZ1bGwgY29uZmlnJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgQ3VzdG9tV2lkZ2V0KHtcbiAgICAgIGZ1bmN0aW9uQXJuOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTpmdW5jdGlvbjpjdXN0b213aWRnZXRmdW5jdGlvbicsXG4gICAgICB0aXRsZTogJ0N1c3RvbVdpZGdldCcsXG4gICAgICBoZWlnaHQ6IDEsXG4gICAgICB3aWR0aDogMSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBhbnk6ICdwYXJhbScsXG4gICAgICB9LFxuICAgICAgdXBkYXRlT25SZWZyZXNoOiBmYWxzZSxcbiAgICAgIHVwZGF0ZU9uUmVzaXplOiBmYWxzZSxcbiAgICAgIHVwZGF0ZU9uVGltZVJhbmdlQ2hhbmdlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgIHdpZHRoOiAxLFxuICAgICAgaGVpZ2h0OiAxLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0aXRsZTogJ0N1c3RvbVdpZGdldCcsXG4gICAgICAgIGVuZHBvaW50OiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjEyMzQ1Njc4OTpmdW5jdGlvbjpjdXN0b213aWRnZXRmdW5jdGlvbicsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGFueTogJ3BhcmFtJyxcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlT246IHtcbiAgICAgICAgICByZWZyZXNoOiBmYWxzZSxcbiAgICAgICAgICByZXNpemU6IGZhbHNlLFxuICAgICAgICAgIHRpbWVSYW5nZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGFubm90YXRpb25zIHRvIGdyYXBoJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICB0aXRsZTogJ015IGZhbmN5IGdyYXBoJyxcbiAgICAgIGxlZnQ6IFtcbiAgICAgICAgbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KSxcbiAgICAgIF0sXG4gICAgICBsZWZ0QW5ub3RhdGlvbnM6IFt7XG4gICAgICAgIHZhbHVlOiAxMDAwLFxuICAgICAgICBjb2xvcjogJzY2Nzc4OCcsXG4gICAgICAgIGZpbGw6IFNoYWRpbmcuQkVMT1csXG4gICAgICAgIGxhYmVsOiAndGhpcyBpcyB0aGUgYW5ub3RhdGlvbicsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHRpdGxlOiAnTXkgZmFuY3kgZ3JhcGgnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAgICBbJ0NESycsICdUZXN0J10sXG4gICAgICAgIF0sXG4gICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgaG9yaXpvbnRhbDogW3tcbiAgICAgICAgICAgIHlBeGlzOiAnbGVmdCcsXG4gICAgICAgICAgICB2YWx1ZTogMTAwMCxcbiAgICAgICAgICAgIGNvbG9yOiAnNjY3Nzg4JyxcbiAgICAgICAgICAgIGZpbGw6ICdiZWxvdycsXG4gICAgICAgICAgICBsYWJlbDogJ3RoaXMgaXMgdGhlIGFubm90YXRpb24nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgICB5QXhpczoge30sXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnZlcnQgYWxhcm0gdG8gYW5ub3RhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBtZXRyaWMgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pO1xuXG4gICAgY29uc3QgYWxhcm0gPSBtZXRyaWMuY3JlYXRlQWxhcm0oc3RhY2ssICdBbGFybScsIHtcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiA3LFxuICAgICAgZGF0YXBvaW50c1RvQWxhcm06IDIsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIHJpZ2h0OiBbbWV0cmljXSxcbiAgICAgIHJpZ2h0QW5ub3RhdGlvbnM6IFthbGFybS50b0Fubm90YXRpb24oKV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ21ldHJpYycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAgICBbJ0NESycsICdUZXN0JywgeyB5QXhpczogJ3JpZ2h0JyB9XSxcbiAgICAgICAgXSxcbiAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICBob3Jpem9udGFsOiBbe1xuICAgICAgICAgICAgeUF4aXM6ICdyaWdodCcsXG4gICAgICAgICAgICB2YWx1ZTogMTAwMCxcbiAgICAgICAgICAgIGxhYmVsOiAnVGVzdCA+PSAxMDAwIGZvciAyIGRhdGFwb2ludHMgd2l0aGluIDM1IG1pbnV0ZXMnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgICB5QXhpczoge30sXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCB5QXhpcyB0byBncmFwaCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgdGl0bGU6ICdNeSBmYW5jeSBncmFwaCcsXG4gICAgICBsZWZ0OiBbXG4gICAgICAgIG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSksXG4gICAgICBdLFxuICAgICAgcmlnaHQ6IFtcbiAgICAgICAgbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUYXN0JyB9KSxcbiAgICAgIF0sXG4gICAgICBsZWZ0WUF4aXM6ICh7XG4gICAgICAgIGxhYmVsOiAnTGVmdCB5QXhpcycsXG4gICAgICAgIG1heDogMTAwLFxuICAgICAgfSksXG4gICAgICByaWdodFlBeGlzOiAoe1xuICAgICAgICBsYWJlbDogJ1JpZ2h0IHlBeGlzJyxcbiAgICAgICAgbWluOiAxMCxcbiAgICAgICAgc2hvd1VuaXRzOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDYsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICd0aW1lU2VyaWVzJyxcbiAgICAgICAgdGl0bGU6ICdNeSBmYW5jeSBncmFwaCcsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgICBbJ0NESycsICdUYXN0JywgeyB5QXhpczogJ3JpZ2h0JyB9XSxcbiAgICAgICAgXSxcbiAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICBsZWZ0OiB7IGxhYmVsOiAnTGVmdCB5QXhpcycsIG1heDogMTAwIH0sXG4gICAgICAgICAgcmlnaHQ6IHsgbGFiZWw6ICdSaWdodCB5QXhpcycsIG1pbjogMTAsIHNob3dVbml0czogZmFsc2UgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lmeSBsaXZlRGF0YSBwcm9wZXJ0eSBvbiBncmFwaCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgdGl0bGU6ICdNeSBsaXZlIGdyYXBoJyxcbiAgICAgIGxlZnQ6IFtcbiAgICAgICAgbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KSxcbiAgICAgIF0sXG4gICAgICBsaXZlRGF0YTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHRpdGxlOiAnTXkgbGl2ZSBncmFwaCcsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgICAgbGl2ZURhdGE6IHRydWUsXG4gICAgICAgIHlBeGlzOiB7fSxcbiAgICAgIH0sXG4gICAgfV0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBpbXBvcnRlZCBhbGFybSB3aXRoIGdyYXBoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhbGFybSA9IEFsYXJtLmZyb21BbGFybUFybihzdGFjaywgJ0FsYXJtJywgJ2Fybjphd3M6Y2xvdWR3YXRjaDpyZWdpb246YWNjb3VudC1pZDphbGFybTphbGFybS1uYW1lJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFsYXJtV2lkZ2V0KHtcbiAgICAgIHRpdGxlOiAnTXkgZmFuY3kgZ3JhcGgnLFxuICAgICAgYWxhcm0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOOiBDb21waWxlc1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkIHNldFBlcmlvZFRvVGltZVJhbmdlIHRvIHNpbmdsZVZhbHVlV2lkZ2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBtZXRyaWMgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBTaW5nbGVWYWx1ZVdpZGdldCh7XG4gICAgICBtZXRyaWNzOiBbbWV0cmljXSxcbiAgICAgIHNldFBlcmlvZFRvVGltZVJhbmdlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICdzaW5nbGVWYWx1ZScsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgICAgc2V0UGVyaW9kVG9UaW1lUmFuZ2U6IHRydWUsXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBzcGFya2xpbmUgdG8gc2luZ2xlVmFsdWVXaWRnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG1ldHJpYyA9IG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IFNpbmdsZVZhbHVlV2lkZ2V0KHtcbiAgICAgIG1ldHJpY3M6IFttZXRyaWNdLFxuICAgICAgc3BhcmtsaW5lOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICdzaW5nbGVWYWx1ZScsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgICAgc3BhcmtsaW5lOiB0cnVlLFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgc2V0UGVyaW9kVG9UaW1lUmFuZ2UgYW5kIHNwYXJrbGluZSBpcyBzZXQgb24gc2luZ2xlVmFsdWVXaWRnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBtZXRyaWMgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRvVGhyb3cgPSAoKSA9PiB7XG4gICAgICBuZXcgU2luZ2xlVmFsdWVXaWRnZXQoe1xuICAgICAgICBtZXRyaWNzOiBbbWV0cmljXSxcbiAgICAgICAgc2V0UGVyaW9kVG9UaW1lUmFuZ2U6IHRydWUsXG4gICAgICAgIHNwYXJrbGluZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHRvVGhyb3coKSkudG9UaHJvdygvWW91IGNhbm5vdCB1c2Ugc2V0UGVyaW9kVG9UaW1lUmFuZ2Ugd2l0aCBzcGFya2xpbmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIHNpbmdsZVZhbHVlRnVsbFByZWNpc2lvbiB0byBzaW5nbGVWYWx1ZVdpZGdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbWV0cmljID0gbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aWRnZXQgPSBuZXcgU2luZ2xlVmFsdWVXaWRnZXQoe1xuICAgICAgbWV0cmljczogW21ldHJpY10sXG4gICAgICBmdWxsUHJlY2lzaW9uOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICAgIHR5cGU6ICdtZXRyaWMnLFxuICAgICAgd2lkdGg6IDYsXG4gICAgICBoZWlnaHQ6IDMsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZpZXc6ICdzaW5nbGVWYWx1ZScsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgICAgc2luZ2xlVmFsdWVGdWxsUHJlY2lzaW9uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9XSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdhbGxvd3Mgb3ZlcnJpZGluZyBjdXN0b20gdmFsdWVzIG9mIGRhc2hib2FyZCB3aWRnZXRzJywgKCkgPT4ge1xuICAgIGNsYXNzIEhpZGRlbk1ldHJpYyBleHRlbmRzIE1ldHJpYyB7XG4gICAgICBwdWJsaWMgdG9NZXRyaWNDb25maWcoKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHN1cGVyLnRvTWV0cmljQ29uZmlnKCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0LnJlbmRlcmluZ1Byb3BlcnRpZXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIGxlZnQ6IFtcbiAgICAgICAgbmV3IEhpZGRlbk1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpWzBdLnByb3BlcnRpZXMubWV0cmljc1swXSlcbiAgICAgIC50b0VxdWFsKFsnQ0RLJywgJ1Rlc3QnLCB7IHZpc2libGU6IGZhbHNlIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0dyYXBoQ29sb3IgaXMgY29ycmVjdGx5IGNvbnZlcnRlZCBpbnRvIHRoZSBjb3JyZWN0IGhleGNvZGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG1ldHJpYyA9IG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdDREsnLCBtZXRyaWNOYW1lOiAnVGVzdCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIGxlZnQ6IFttZXRyaWMud2l0aCh7XG4gICAgICAgIGNvbG9yOiBDb2xvci5CTFVFLFxuICAgICAgfSldLFxuICAgICAgbGVmdEFubm90YXRpb25zOiBbXG4gICAgICAgIHsgY29sb3I6IENvbG9yLlJFRCwgdmFsdWU6IDEwMCB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSlbMF0ucHJvcGVydGllcy5tZXRyaWNzWzBdKS50b0VxdWFsKFsnQ0RLJywgJ1Rlc3QnLCB7IGNvbG9yOiAnIzFmNzdiNCcgfV0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHdpZGdldC50b0pzb24oKSlbMF0ucHJvcGVydGllcy5hbm5vdGF0aW9ucy5ob3Jpem9udGFsWzBdKS50b0VxdWFsKHsgeUF4aXM6ICdsZWZ0JywgdmFsdWU6IDEwMCwgY29sb3I6ICcjZDYyNzI4JyB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdsZWdlbmQgcG9zaXRpb24gaXMgcmVzcGVjdGVkIGluIGNvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICBsZWZ0OiBbbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KV0sXG4gICAgICBsZWdlbmRQb3NpdGlvbjogTGVnZW5kUG9zaXRpb24uUklHSFQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUod2lkZ2V0LnRvSnNvbigpKSkudG9FcXVhbChbe1xuICAgICAgdHlwZTogJ21ldHJpYycsXG4gICAgICB3aWR0aDogNixcbiAgICAgIGhlaWdodDogNixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAgICBbJ0NESycsICdUZXN0J10sXG4gICAgICAgIF0sXG4gICAgICAgIHlBeGlzOiB7fSxcbiAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBzZXRQZXJpb2RUb1RpbWVSYW5nZSB0byBHcmFwaFdpZGdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgIGxlZnQ6IFtuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pXSxcbiAgICAgIHZpZXc6IEdyYXBoV2lkZ2V0Vmlldy5QSUUsXG4gICAgICBzZXRQZXJpb2RUb1RpbWVSYW5nZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAncGllJyxcbiAgICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICBtZXRyaWNzOiBbXG4gICAgICAgICAgWydDREsnLCAnVGVzdCddLFxuICAgICAgICBdLFxuICAgICAgICB5QXhpczoge30sXG4gICAgICAgIHNldFBlcmlvZFRvVGltZVJhbmdlOiB0cnVlLFxuICAgICAgfSxcbiAgICB9XSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBHYXVnZVdpZGdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgd2lkZ2V0ID0gbmV3IEdhdWdlV2lkZ2V0KHtcbiAgICAgIG1ldHJpY3M6IFtuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnQ0RLJywgbWV0cmljTmFtZTogJ1Rlc3QnIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAnZ2F1Z2UnLFxuICAgICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgIG1ldHJpY3M6IFtcbiAgICAgICAgICBbJ0NESycsICdUZXN0J10sXG4gICAgICAgIF0sXG4gICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgbGVmdDoge1xuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAxMDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfV0pO1xuICB9KTtcblxuICB0ZXN0KCdHcmFwaFdpZGdldCBzdXBwb3J0cyBzdGF0IGFuZCBwZXJpb2QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHdpZGdldCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICBsZWZ0OiBbbmV3IE1ldHJpYyh7IG5hbWVzcGFjZTogJ0NESycsIG1ldHJpY05hbWU6ICdUZXN0JyB9KV0sXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICAgIHBlcmlvZDogRHVyYXRpb24uZGF5cygyKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh3aWRnZXQudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgICB0eXBlOiAnbWV0cmljJyxcbiAgICAgIHdpZHRoOiA2LFxuICAgICAgaGVpZ2h0OiA2LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICAgIHJlZ2lvbjogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgbWV0cmljczogW1xuICAgICAgICAgIFsnQ0RLJywgJ1Rlc3QnXSxcbiAgICAgICAgXSxcbiAgICAgICAgeUF4aXM6IHt9LFxuICAgICAgICBzdGF0OiAnQXZlcmFnZScsXG4gICAgICAgIHBlcmlvZDogMTcyODAwLFxuICAgICAgfSxcbiAgICB9XSk7XG4gIH0pO1xufSk7XG4iXX0=