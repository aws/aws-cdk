"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const a = new lib_1.Metric({ namespace: 'Test', metricName: 'ACount' });
let stack1;
let stack2;
let stack3;
let stack4;
describe('cross environment', () => {
    beforeEach(() => {
        stack1 = new core_1.Stack(undefined, undefined, { env: { region: 'pluto', account: '1234' } });
        stack2 = new core_1.Stack(undefined, undefined, { env: { region: 'mars', account: '5678' } });
        stack3 = new core_1.Stack(undefined, undefined, { env: { region: 'pluto', account: '0000' } });
        stack4 = new core_1.Stack(undefined, undefined);
    });
    describe('in graphs', () => {
        test('metric attached to stack1 will not render region and account in stack1', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
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
            const graph = new lib_1.GraphWidget({
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
            const graph = new lib_1.GraphWidget({
                left: [
                    a.with({ account: '1234', region: 'us-north-5' }),
                ],
            });
            // THEN
            graphMetricsAre(new core_1.Stack(), graph, [
                ['Test', 'ACount', { accountId: '1234', region: 'us-north-5' }],
            ]);
        });
        test('metric attached to agnostic stack will not render in agnostic stack', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    a.attachTo(new core_1.Stack()),
                ],
            });
            // THEN
            graphMetricsAre(new core_1.Stack(), graph, [
                ['Test', 'ACount'],
            ]);
        });
        test('math expressions with explicit account and region will render in environment agnostic stack', () => {
            // GIVEN
            const expression = 'SEARCH(\'MetricName="ACount"\', \'Sum\', 300)';
            const b = new lib_1.MathExpression({
                expression,
                usingMetrics: {},
                label: 'Test label',
                searchAccount: '5678',
                searchRegion: 'mars',
            });
            const graph = new lib_1.GraphWidget({
                left: [
                    b,
                ],
            });
            // THEN
            graphMetricsAre(new core_1.Stack(), graph, [
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
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: a.attachTo(stack1),
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
                MetricName: 'ACount',
                Namespace: 'Test',
                Period: 300,
            });
        });
        test('metric attached to stack1 will throw in stack2', () => {
            // Cross-region metrics are supported in Dashboards but not in Alarms
            // GIVEN
            expect(() => {
                new lib_1.Alarm(stack2, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric: a.attachTo(stack1),
                });
            }).toThrow(/Cannot create an Alarm in region 'mars' based on metric 'ACount' in 'pluto'/);
        });
        test('metric attached to stack3 will render in stack1', () => {
            //Cross-account metrics are supported in Alarms
            // GIVEN
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: a.attachTo(stack3),
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
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
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                account: '0000',
            });
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: b,
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
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
        test('metric from same account as stack will not have accountId', () => {
            // GIVEN
            // including label property will force Alarm configuration to "modern" config.
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                label: 'my-label',
            });
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: b,
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
                Metrics: [
                    {
                        AccountId: assertions_1.Match.absent(),
                        Id: 'm1',
                        Label: 'my-label',
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
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                account: '5678',
            });
            const c = new lib_1.MathExpression({
                expression: 'a + b',
                usingMetrics: { a: a.attachTo(stack3), b },
                period: core_1.Duration.minutes(1),
            });
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: c,
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
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
                        AccountId: '5678',
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
        test('math expression from same account as stack will not have accountId', () => {
            // GIVEN
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                account: '1234',
            });
            const c = new lib_1.MathExpression({
                expression: 'a + b',
                usingMetrics: { a: a.attachTo(stack1), b },
                period: core_1.Duration.minutes(1),
            });
            new lib_1.Alarm(stack1, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: c,
            });
            // THEN
            assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
                Metrics: [
                    {
                        Expression: 'a + b',
                        Id: 'expr_1',
                    },
                    {
                        AccountId: assertions_1.Match.absent(),
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
                        AccountId: assertions_1.Match.absent(),
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
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                account: '1234',
            });
            const c = new lib_1.MathExpression({
                expression: 'a + b',
                usingMetrics: { a: a.attachTo(stack3), b },
                period: core_1.Duration.minutes(1),
                searchAccount: '5678',
            });
            // THEN
            expect(() => {
                new lib_1.Alarm(stack1, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric: c,
                });
            }).toThrow(/Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
        });
        test('math expression with different searchRegion will throw', () => {
            // GIVEN
            const b = new lib_1.Metric({
                namespace: 'Test',
                metricName: 'ACount',
                account: '1234',
            });
            const c = new lib_1.MathExpression({
                expression: 'a + b',
                usingMetrics: { a: a.attachTo(stack3), b },
                period: core_1.Duration.minutes(1),
                searchRegion: 'mars',
            });
            // THEN
            expect(() => {
                new lib_1.Alarm(stack1, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric: c,
                });
            }).toThrow(/Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
        });
        describe('accountId requirements', () => {
            test('metric account is not defined', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                });
                new lib_1.Alarm(stack4, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric,
                });
                // Alarm will be defined as legacy alarm.
                assertions_1.Template.fromStack(stack4).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    Threshold: 1,
                    EvaluationPeriods: 1,
                    MetricName: 'ACount',
                    Namespace: 'Test',
                });
            });
            test('metric account is defined and stack account is token', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                    account: '123456789',
                });
                new lib_1.Alarm(stack4, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric,
                });
                // Alarm will be defined as modern alarm.
                assertions_1.Template.fromStack(stack4).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    Metrics: assertions_1.Match.anyValue(),
                });
            });
            test('metric account is attached to stack account', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                });
                new lib_1.Alarm(stack4, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric: metric.attachTo(stack4),
                });
                // Alarm will be defined as legacy alarm.
                assertions_1.Template.fromStack(stack4).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    Threshold: 1,
                    EvaluationPeriods: 1,
                    MetricName: 'ACount',
                    Namespace: 'Test',
                });
            });
            test('metric account === stack account, both are the AccountID token', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                    account: core_1.Aws.ACCOUNT_ID,
                });
                new lib_1.Alarm(stack4, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric,
                });
                // Alarm will be defined as legacy alarm
                assertions_1.Template.fromStack(stack4).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    MetricName: 'ACount',
                });
            });
            test('metric account and stack account are different tokens', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                    account: core_1.Token.asString('asdf'),
                });
                new lib_1.Alarm(stack4, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric,
                });
                // Alarm will be defined as modern alarm, since there is no way of knowing that the two tokens are equal.
                assertions_1.Template.fromStack(stack4).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    Metrics: assertions_1.Match.anyValue(),
                });
            });
            test('metric account !== stack account', () => {
                const metric = new lib_1.Metric({
                    namespace: 'Test',
                    metricName: 'ACount',
                    account: '123456789',
                });
                new lib_1.Alarm(stack1, 'Alarm', {
                    threshold: 1,
                    evaluationPeriods: 1,
                    metric,
                });
                // Alarm will be defined as modern alarm.
                assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::CloudWatch::Alarm', {
                    Metrics: assertions_1.Match.anyValue(),
                });
            });
        });
    });
});
function graphMetricsAre(stack, w, metrics) {
    expect(stack.resolve(w.toJson())).toEqual([{
            type: 'metric',
            width: 6,
            height: 6,
            properties: {
                view: 'timeSeries',
                region: { Ref: 'AWS::Region' },
                metrics,
                yAxis: {},
            },
        }]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtZW52aXJvbm1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLWVudmlyb25tZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQTREO0FBQzVELGdDQUE2RTtBQUU3RSxNQUFNLENBQUMsR0FBRyxJQUFJLFlBQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbEUsSUFBSSxNQUFhLENBQUM7QUFDbEIsSUFBSSxNQUFhLENBQUM7QUFDbEIsSUFBSSxNQUFhLENBQUM7QUFDbEIsSUFBSSxNQUFhLENBQUM7QUFDbEIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsTUFBTSxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEYsTUFBTSxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkYsTUFBTSxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEYsTUFBTSxHQUFHLElBQUksWUFBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pC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R0FBRyxFQUFFLGFBQWEsRUFBRTtnQkFDOUIsT0FBTztnQkFDUCxLQUFLLEVBQUUsRUFBRTthQUNWO1NBQ0YsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2ssIFRva2VuLCBBd3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFsYXJtLCBHcmFwaFdpZGdldCwgSVdpZGdldCwgTWF0aEV4cHJlc3Npb24sIE1ldHJpYyB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGEgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnVGVzdCcsIG1ldHJpY05hbWU6ICdBQ291bnQnIH0pO1xuXG5sZXQgc3RhY2sxOiBTdGFjaztcbmxldCBzdGFjazI6IFN0YWNrO1xubGV0IHN0YWNrMzogU3RhY2s7XG5sZXQgc3RhY2s0OiBTdGFjaztcbmRlc2NyaWJlKCdjcm9zcyBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sxID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyByZWdpb246ICdwbHV0bycsIGFjY291bnQ6ICcxMjM0JyB9IH0pO1xuICAgIHN0YWNrMiA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBlbnY6IHsgcmVnaW9uOiAnbWFycycsIGFjY291bnQ6ICc1Njc4JyB9IH0pO1xuICAgIHN0YWNrMyA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBlbnY6IHsgcmVnaW9uOiAncGx1dG8nLCBhY2NvdW50OiAnMDAwMCcgfSB9KTtcbiAgICBzdGFjazQgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW4gZ3JhcGhzJywgKCkgPT4ge1xuICAgIHRlc3QoJ21ldHJpYyBhdHRhY2hlZCB0byBzdGFjazEgd2lsbCBub3QgcmVuZGVyIHJlZ2lvbiBhbmQgYWNjb3VudCBpbiBzdGFjazEnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgYS5hdHRhY2hUbyhzdGFjazEpLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShzdGFjazEsIGdyYXBoLCBbXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnXSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpYyBhdHRhY2hlZCB0byBzdGFjazEgd2lsbCByZW5kZXIgcmVnaW9uIGFuZCBhY2NvdW50IGluIHN0YWNrMicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBhLmF0dGFjaFRvKHN0YWNrMSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZ3JhcGhNZXRyaWNzQXJlKHN0YWNrMiwgZ3JhcGgsIFtcbiAgICAgICAgWydUZXN0JywgJ0FDb3VudCcsIHsgcmVnaW9uOiAncGx1dG8nLCBhY2NvdW50SWQ6ICcxMjM0JyB9XSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpYyB3aXRoIGV4cGxpY2l0IGFjY291bnQgYW5kIHJlZ2lvbiB3aWxsIHJlbmRlciBpbiBlbnZpcm9ubWVudCBhZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBhLndpdGgoeyBhY2NvdW50OiAnMTIzNCcsIHJlZ2lvbjogJ3VzLW5vcnRoLTUnIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShuZXcgU3RhY2soKSwgZ3JhcGgsIFtcbiAgICAgICAgWydUZXN0JywgJ0FDb3VudCcsIHsgYWNjb3VudElkOiAnMTIzNCcsIHJlZ2lvbjogJ3VzLW5vcnRoLTUnIH1dLFxuICAgICAgXSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljIGF0dGFjaGVkIHRvIGFnbm9zdGljIHN0YWNrIHdpbGwgbm90IHJlbmRlciBpbiBhZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBhLmF0dGFjaFRvKG5ldyBTdGFjaygpKSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBncmFwaE1ldHJpY3NBcmUobmV3IFN0YWNrKCksIGdyYXBoLCBbXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnXSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ21hdGggZXhwcmVzc2lvbnMgd2l0aCBleHBsaWNpdCBhY2NvdW50IGFuZCByZWdpb24gd2lsbCByZW5kZXIgaW4gZW52aXJvbm1lbnQgYWdub3N0aWMgc3RhY2snLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZXhwcmVzc2lvbiA9ICdTRUFSQ0goXFwnTWV0cmljTmFtZT1cIkFDb3VudFwiXFwnLCBcXCdTdW1cXCcsIDMwMCknO1xuXG4gICAgICBjb25zdCBiID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7fSxcbiAgICAgICAgbGFiZWw6ICdUZXN0IGxhYmVsJyxcbiAgICAgICAgc2VhcmNoQWNjb3VudDogJzU2NzgnLFxuICAgICAgICBzZWFyY2hSZWdpb246ICdtYXJzJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBiLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShuZXcgU3RhY2soKSwgZ3JhcGgsIFtcbiAgICAgICAgW3tcbiAgICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICAgIGFjY291bnRJZDogJzU2NzgnLFxuICAgICAgICAgIHJlZ2lvbjogJ21hcnMnLFxuICAgICAgICAgIGxhYmVsOiAnVGVzdCBsYWJlbCcsXG4gICAgICAgIH1dLFxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbiBhbGFybXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWV0cmljIGF0dGFjaGVkIHRvIHN0YWNrMSB3aWxsIG5vdCByZW5kZXIgcmVnaW9uIGFuZCBhY2NvdW50IGluIHN0YWNrMScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBuZXcgQWxhcm0oc3RhY2sxLCAnQWxhcm0nLCB7XG4gICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgIG1ldHJpYzogYS5hdHRhY2hUbyhzdGFjazEpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICBQZXJpb2Q6IDMwMCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljIGF0dGFjaGVkIHRvIHN0YWNrMSB3aWxsIHRocm93IGluIHN0YWNrMicsICgpID0+IHtcbiAgICAgIC8vIENyb3NzLXJlZ2lvbiBtZXRyaWNzIGFyZSBzdXBwb3J0ZWQgaW4gRGFzaGJvYXJkcyBidXQgbm90IGluIEFsYXJtc1xuXG4gICAgICAvLyBHSVZFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IEFsYXJtKHN0YWNrMiwgJ0FsYXJtJywge1xuICAgICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgICBtZXRyaWM6IGEuYXR0YWNoVG8oc3RhY2sxKSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgY3JlYXRlIGFuIEFsYXJtIGluIHJlZ2lvbiAnbWFycycgYmFzZWQgb24gbWV0cmljICdBQ291bnQnIGluICdwbHV0bycvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpYyBhdHRhY2hlZCB0byBzdGFjazMgd2lsbCByZW5kZXIgaW4gc3RhY2sxJywgKCkgPT4ge1xuICAgICAgLy9Dcm9zcy1hY2NvdW50IG1ldHJpY3MgYXJlIHN1cHBvcnRlZCBpbiBBbGFybXNcblxuICAgICAgLy8gR0lWRU5cbiAgICAgIG5ldyBBbGFybShzdGFjazEsICdBbGFybScsIHtcbiAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgbWV0cmljOiBhLmF0dGFjaFRvKHN0YWNrMyksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICBNZXRyaWNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWNjb3VudElkOiAnMDAwMCcsXG4gICAgICAgICAgICBJZDogJ20xJyxcbiAgICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFBlcmlvZDogMzAwLFxuICAgICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuRGF0YTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRyaWMgY2FuIHJlbmRlciBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGIgPSBuZXcgTWV0cmljKHtcbiAgICAgICAgbmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgIG1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICBhY2NvdW50OiAnMDAwMCcsXG4gICAgICB9KTtcblxuICAgICAgbmV3IEFsYXJtKHN0YWNrMSwgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IGIsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICBNZXRyaWNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWNjb3VudElkOiAnMDAwMCcsXG4gICAgICAgICAgICBJZDogJ20xJyxcbiAgICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFBlcmlvZDogMzAwLFxuICAgICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuRGF0YTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRyaWMgZnJvbSBzYW1lIGFjY291bnQgYXMgc3RhY2sgd2lsbCBub3QgaGF2ZSBhY2NvdW50SWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuXG4gICAgICAvLyBpbmNsdWRpbmcgbGFiZWwgcHJvcGVydHkgd2lsbCBmb3JjZSBBbGFybSBjb25maWd1cmF0aW9uIHRvIFwibW9kZXJuXCIgY29uZmlnLlxuICAgICAgY29uc3QgYiA9IG5ldyBNZXRyaWMoe1xuICAgICAgICBuYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIGxhYmVsOiAnbXktbGFiZWwnLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBBbGFybShzdGFjazEsICdBbGFybScsIHtcbiAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgbWV0cmljOiBiLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazEpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICAgICAgTWV0cmljczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjY291bnRJZDogTWF0Y2guYWJzZW50KCksXG4gICAgICAgICAgICBJZDogJ20xJyxcbiAgICAgICAgICAgIExhYmVsOiAnbXktbGFiZWwnLFxuICAgICAgICAgICAgTWV0cmljU3RhdDoge1xuICAgICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgICBNZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUGVyaW9kOiAzMDAsXG4gICAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXR1cm5EYXRhOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21hdGggZXhwcmVzc2lvbiBjYW4gcmVuZGVyIGluIGEgZGlmZmVyZW50IGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYiA9IG5ldyBNZXRyaWMoe1xuICAgICAgICBuYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIGFjY291bnQ6ICc1Njc4JyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGE6IGEuYXR0YWNoVG8oc3RhY2szKSwgYiB9LFxuICAgICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICB9KTtcblxuICAgICAgbmV3IEFsYXJtKHN0YWNrMSwgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IGMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICBNZXRyaWNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjY291bnRJZDogJzAwMDAnLFxuICAgICAgICAgICAgSWQ6ICdhJyxcbiAgICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFBlcmlvZDogNjAsXG4gICAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjY291bnRJZDogJzU2NzgnLFxuICAgICAgICAgICAgSWQ6ICdiJyxcbiAgICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFBlcmlvZDogNjAsXG4gICAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtYXRoIGV4cHJlc3Npb24gZnJvbSBzYW1lIGFjY291bnQgYXMgc3RhY2sgd2lsbCBub3QgaGF2ZSBhY2NvdW50SWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYiA9IG5ldyBNZXRyaWMoe1xuICAgICAgICBuYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0JyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGE6IGEuYXR0YWNoVG8oc3RhY2sxKSwgYiB9LFxuICAgICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICB9KTtcblxuICAgICAgbmV3IEFsYXJtKHN0YWNrMSwgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IGMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICBNZXRyaWNzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjY291bnRJZDogTWF0Y2guYWJzZW50KCksXG4gICAgICAgICAgICBJZDogJ2EnLFxuICAgICAgICAgICAgTWV0cmljU3RhdDoge1xuICAgICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgICBNZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUGVyaW9kOiA2MCxcbiAgICAgICAgICAgICAgU3RhdDogJ0F2ZXJhZ2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldHVybkRhdGE6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWNjb3VudElkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgICAgIElkOiAnYicsXG4gICAgICAgICAgICBNZXRyaWNTdGF0OiB7XG4gICAgICAgICAgICAgIE1ldHJpYzoge1xuICAgICAgICAgICAgICAgIE1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBQZXJpb2Q6IDYwLFxuICAgICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuRGF0YTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0aCBleHByZXNzaW9uIHdpdGggZGlmZmVyZW50IHNlYXJjaEFjY291bnQgd2lsbCB0aHJvdycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBiID0gbmV3IE1ldHJpYyh7XG4gICAgICAgIG5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICBtZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgYWNjb3VudDogJzEyMzQnLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGMgPSBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICBleHByZXNzaW9uOiAnYSArIGInLFxuICAgICAgICB1c2luZ01ldHJpY3M6IHsgYTogYS5hdHRhY2hUbyhzdGFjazMpLCBiIH0sXG4gICAgICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcygxKSxcbiAgICAgICAgc2VhcmNoQWNjb3VudDogJzU2NzgnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBBbGFybShzdGFjazEsICdBbGFybScsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgICAgbWV0cmljOiBjLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBjcmVhdGUgYW4gQWxhcm0gYmFzZWQgb24gYSBNYXRoRXhwcmVzc2lvbiB3aGljaCBzcGVjaWZpZXMgYSBzZWFyY2hBY2NvdW50IG9yIHNlYXJjaFJlZ2lvbi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWF0aCBleHByZXNzaW9uIHdpdGggZGlmZmVyZW50IHNlYXJjaFJlZ2lvbiB3aWxsIHRocm93JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGIgPSBuZXcgTWV0cmljKHtcbiAgICAgICAgbmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgIG1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICBhY2NvdW50OiAnMTIzNCcsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYyA9IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgIGV4cHJlc3Npb246ICdhICsgYicsXG4gICAgICAgIHVzaW5nTWV0cmljczogeyBhOiBhLmF0dGFjaFRvKHN0YWNrMyksIGIgfSxcbiAgICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDEpLFxuICAgICAgICBzZWFyY2hSZWdpb246ICdtYXJzJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgQWxhcm0oc3RhY2sxLCAnQWxhcm0nLCB7XG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICAgIG1ldHJpYzogYyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgY3JlYXRlIGFuIEFsYXJtIGJhc2VkIG9uIGEgTWF0aEV4cHJlc3Npb24gd2hpY2ggc3BlY2lmaWVzIGEgc2VhcmNoQWNjb3VudCBvciBzZWFyY2hSZWdpb24vKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhY2NvdW50SWQgcmVxdWlyZW1lbnRzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnbWV0cmljIGFjY291bnQgaXMgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgICAgIG5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQWxhcm0oc3RhY2s0LCAnQWxhcm0nLCB7XG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICAgIG1ldHJpYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWxhcm0gd2lsbCBiZSBkZWZpbmVkIGFzIGxlZ2FjeSBhbGFybS5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrNCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICAgIFRocmVzaG9sZDogMSxcbiAgICAgICAgICBFdmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgICBNZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnbWV0cmljIGFjY291bnQgaXMgZGVmaW5lZCBhbmQgc3RhY2sgYWNjb3VudCBpcyB0b2tlbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWV0cmljID0gbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBBbGFybShzdGFjazQsICdBbGFybScsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgICAgbWV0cmljLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbGFybSB3aWxsIGJlIGRlZmluZWQgYXMgbW9kZXJuIGFsYXJtLlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2s0KS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6QWxhcm0nLCB7XG4gICAgICAgICAgTWV0cmljczogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnbWV0cmljIGFjY291bnQgaXMgYXR0YWNoZWQgdG8gc3RhY2sgYWNjb3VudCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWV0cmljID0gbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBBbGFybShzdGFjazQsICdBbGFybScsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgICAgbWV0cmljOiBtZXRyaWMuYXR0YWNoVG8oc3RhY2s0KSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWxhcm0gd2lsbCBiZSBkZWZpbmVkIGFzIGxlZ2FjeSBhbGFybS5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrNCkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgICAgIFRocmVzaG9sZDogMSxcbiAgICAgICAgICBFdmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgICBNZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnbWV0cmljIGFjY291bnQgPT09IHN0YWNrIGFjY291bnQsIGJvdGggYXJlIHRoZSBBY2NvdW50SUQgdG9rZW4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgICAgIG5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICAgIGFjY291bnQ6IEF3cy5BQ0NPVU5UX0lELFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQWxhcm0oc3RhY2s0LCAnQWxhcm0nLCB7XG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICAgIG1ldHJpYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWxhcm0gd2lsbCBiZSBkZWZpbmVkIGFzIGxlZ2FjeSBhbGFybVxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2s0KS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6QWxhcm0nLCB7XG4gICAgICAgICAgTWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ21ldHJpYyBhY2NvdW50IGFuZCBzdGFjayBhY2NvdW50IGFyZSBkaWZmZXJlbnQgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRyaWMgPSBuZXcgTWV0cmljKHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICBtZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICBhY2NvdW50OiBUb2tlbi5hc1N0cmluZygnYXNkZicpLFxuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgQWxhcm0oc3RhY2s0LCAnQWxhcm0nLCB7XG4gICAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICAgIG1ldHJpYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWxhcm0gd2lsbCBiZSBkZWZpbmVkIGFzIG1vZGVybiBhbGFybSwgc2luY2UgdGhlcmUgaXMgbm8gd2F5IG9mIGtub3dpbmcgdGhhdCB0aGUgdHdvIHRva2VucyBhcmUgZXF1YWwuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazQpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICAgICAgICBNZXRyaWNzOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdtZXRyaWMgYWNjb3VudCAhPT0gc3RhY2sgYWNjb3VudCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWV0cmljID0gbmV3IE1ldHJpYyh7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ0FDb3VudCcsXG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBBbGFybShzdGFjazEsICdBbGFybScsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgICAgbWV0cmljLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbGFybSB3aWxsIGJlIGRlZmluZWQgYXMgbW9kZXJuIGFsYXJtLlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6QWxhcm0nLCB7XG4gICAgICAgICAgTWV0cmljczogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZ3JhcGhNZXRyaWNzQXJlKHN0YWNrOiBTdGFjaywgdzogSVdpZGdldCwgbWV0cmljczogYW55W10pIHtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUody50b0pzb24oKSkpLnRvRXF1YWwoW3tcbiAgICB0eXBlOiAnbWV0cmljJyxcbiAgICB3aWR0aDogNixcbiAgICBoZWlnaHQ6IDYsXG4gICAgcHJvcGVydGllczpcbiAgICB7XG4gICAgICB2aWV3OiAndGltZVNlcmllcycsXG4gICAgICByZWdpb246IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICBtZXRyaWNzLFxuICAgICAgeUF4aXM6IHt9LFxuICAgIH0sXG4gIH1dKTtcbn1cbiJdfQ==