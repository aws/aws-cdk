"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const a = new lib_1.Metric({ namespace: 'Test', metricName: 'ACount' });
const b = new lib_1.Metric({ namespace: 'Test', metricName: 'BCount', statistic: 'Average' });
const c = new lib_1.Metric({ namespace: 'Test', metricName: 'CCount' });
const b99 = new lib_1.Metric({ namespace: 'Test', metricName: 'BCount', statistic: 'p99' });
let stack;
describe('Metric Math', () => {
    beforeEach(() => {
        stack = new core_1.Stack();
    });
    test('can not use invalid variable names in MathExpression', () => {
        expect(() => {
            new lib_1.MathExpression({
                expression: 'HAPPY + JOY',
                usingMetrics: {
                    HAPPY: a,
                    JOY: b,
                },
            });
        }).toThrow(/Invalid variable names in expression/);
    });
    test('cannot reuse variable names in nested MathExpressions', () => {
        // WHEN
        expect(() => {
            new lib_1.MathExpression({
                expression: 'a + e',
                usingMetrics: {
                    a,
                    e: new lib_1.MathExpression({
                        expression: 'a + c',
                        usingMetrics: { a: b, c },
                    }),
                },
            });
        }).toThrow(/The ID 'a' used for two metrics in the expression: 'BCount' and 'ACount'. Rename one/);
    });
    test('can not use invalid period in MathExpression', () => {
        expect(() => {
            new lib_1.MathExpression({
                expression: 'a+b',
                usingMetrics: { a, b },
                period: core_1.Duration.seconds(20),
            });
        }).toThrow(/'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received 20/);
    });
    test('MathExpression optimization: "with" with the same period returns the same object', () => {
        const m = new lib_1.MathExpression({ expression: 'SUM(METRICS())', usingMetrics: {}, period: core_1.Duration.minutes(10) });
        // Note: object equality, NOT deep equality on purpose
        expect(m.with({})).toEqual(m);
        expect(m.with({ period: core_1.Duration.minutes(10) })).toEqual(m);
        expect(m.with({ period: core_1.Duration.minutes(5) })).not.toEqual(m);
    });
    test('math expression referring to unknown expressions produces a warning', () => {
        const m = new lib_1.MathExpression({
            expression: 'm1 + m2',
        });
        expect(m.warnings).toContainEqual(expect.stringContaining("'m1 + m2' references unknown identifiers"));
    });
    test('metrics METRICS expression does not produce warning for unknown identifier', () => {
        const m = new lib_1.MathExpression({
            expression: 'SUM(METRICS())',
            usingMetrics: {},
        });
        expect(m.warnings).toBeUndefined();
    });
    test('metrics search expression does not produce warning for unknown identifier', () => {
        const m = new lib_1.MathExpression({
            expression: "SEARCH('{dimension_one, dimension_two} my_metric', 'Average', 300)",
            usingMetrics: {},
        });
        expect(m.warnings).toBeUndefined();
    });
    test('metrics insights expression does not produce warning for unknown identifier', () => {
        const m = new lib_1.MathExpression({
            expression: "SELECT AVG(CpuUsage) FROM EC2 WHERE Instance = '123456'",
        });
        expect(m.warnings).toBeUndefined();
    });
    test('math expression referring to unknown expressions produces a warning, even when nested', () => {
        const m = new lib_1.MathExpression({
            expression: 'e1 + 5',
            usingMetrics: {
                e1: new lib_1.MathExpression({
                    expression: 'm1 + m2',
                }),
            },
        });
        expect(m.warnings).toContainEqual(expect.stringContaining("'m1 + m2' references unknown identifiers"));
    });
    describe('in graphs', () => {
        test('MathExpressions can be added to a graph', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + b',
                        usingMetrics: { a, b },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ expression: 'a + b', label: 'a + b' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                ['Test', 'BCount', { visible: false, id: 'b' }],
            ]);
        });
        test('can nest MathExpressions in a graph', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + e',
                        usingMetrics: {
                            a,
                            e: new lib_1.MathExpression({
                                expression: 'b + c',
                                usingMetrics: { b, c },
                            }),
                        },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ label: 'a + e', expression: 'a + e' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                [{ expression: 'b + c', visible: false, id: 'e' }],
                ['Test', 'BCount', { visible: false, id: 'b' }],
                ['Test', 'CCount', { visible: false, id: 'c' }],
            ]);
        });
        test('can add the same metric under different ids', () => {
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + e',
                        usingMetrics: {
                            a,
                            e: new lib_1.MathExpression({
                                expression: 'b + c',
                                usingMetrics: { b: a, c },
                            }),
                        },
                    }),
                ],
            });
            graphMetricsAre(graph, [
                [{ label: 'a + e', expression: 'a + e' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                [{ expression: 'b + c', visible: false, id: 'e' }],
                ['Test', 'ACount', { visible: false, id: 'b' }],
                ['Test', 'CCount', { visible: false, id: 'c' }],
            ]);
        });
        test('passing an empty string as the label of a MathExpressions does not emit a label', () => {
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + e',
                        label: '',
                        usingMetrics: {
                            a,
                        },
                    }),
                ],
            });
            graphMetricsAre(graph, [
                [{ expression: 'a + e' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
            ]);
        });
        test('can reuse identifiers in MathExpressions if metrics are the same', () => {
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + e',
                        usingMetrics: {
                            a,
                            e: new lib_1.MathExpression({
                                expression: 'a + c',
                                usingMetrics: { a, c },
                            }),
                        },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ label: 'a + e', expression: 'a + e' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                [{ expression: 'a + c', visible: false, id: 'e' }],
                ['Test', 'CCount', { visible: false, id: 'c' }],
            ]);
        });
        test('MathExpression and its constituent metrics can both be added to a graph', () => {
            const graph = new lib_1.GraphWidget({
                left: [
                    a,
                    new lib_1.MathExpression({
                        expression: 'a + b',
                        usingMetrics: { a, b },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                ['Test', 'ACount', { id: 'a' }],
                [{ label: 'a + b', expression: 'a + b' }],
                ['Test', 'BCount', { visible: false, id: 'b' }],
            ]);
        });
        test('MathExpression controls period of metrics directly used in it', () => {
            // Check that if we add A with { period: 10s } to a mathexpression of period 5m
            // then two metric lines are added for A, one at 10s and one at 5m
            const graph = new lib_1.GraphWidget({
                left: [
                    a.with({ period: core_1.Duration.seconds(10) }),
                    new lib_1.MathExpression({
                        expression: 'a + b',
                        usingMetrics: { a: a.with({ period: core_1.Duration.seconds(10) }), b },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                ['Test', 'ACount', { period: 10 }],
                [{ label: 'a + b', expression: 'a + b' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                ['Test', 'BCount', { visible: false, id: 'b' }],
            ]);
        });
        test('top level period in a MathExpression is respected in its metrics', () => {
            const graph = new lib_1.GraphWidget({
                left: [
                    a,
                    new lib_1.MathExpression({
                        expression: 'a + b',
                        usingMetrics: { a, b },
                        period: core_1.Duration.minutes(1),
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                ['Test', 'ACount'],
                [{ label: 'a + b', expression: 'a + b', period: 60 }],
                ['Test', 'ACount', { visible: false, id: 'a', period: 60 }],
                ['Test', 'BCount', { visible: false, id: 'b', period: 60 }],
            ]);
        });
        test('MathExpression controls period of metrics transitively used in it', () => {
            // Same as the previous test, but recursively
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + e',
                        usingMetrics: {
                            a,
                            e: new lib_1.MathExpression({
                                expression: 'a + b',
                                period: core_1.Duration.minutes(1),
                                usingMetrics: { a, b },
                            }),
                        },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ expression: 'a + e', label: 'a + e' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                [{ expression: 'a + b', visible: false, id: 'e' }],
                ['Test', 'BCount', { visible: false, id: 'b' }],
            ]);
        });
        test('can use percentiles in expression metrics in graphs', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + b99',
                        usingMetrics: { a, b99 },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ expression: 'a + b99', label: 'a + b99' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                ['Test', 'BCount', { visible: false, id: 'b99', stat: 'p99' }],
            ]);
        });
        test('can reuse the same metric between left and right axes', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'a + 1',
                        usingMetrics: { a },
                    }),
                ],
                right: [
                    new lib_1.MathExpression({
                        expression: 'a + 2',
                        usingMetrics: { a },
                    }),
                ],
            });
            // THEN
            graphMetricsAre(graph, [
                [{ label: 'a + 1', expression: 'a + 1' }],
                ['Test', 'ACount', { visible: false, id: 'a' }],
                [{ label: 'a + 2', expression: 'a + 2', yAxis: 'right' }],
            ]);
        });
        test('detect name conflicts between left and right axes', () => {
            // GIVEN
            const graph = new lib_1.GraphWidget({
                left: [
                    new lib_1.MathExpression({
                        expression: 'm1 + 1',
                        usingMetrics: { m1: a },
                    }),
                ],
                right: [
                    new lib_1.MathExpression({
                        expression: 'm1 + 1',
                        usingMetrics: { m1: b },
                    }),
                ],
            });
            // THEN
            expect(() => {
                graphMetricsAre(graph, []);
            }).toThrow(/Cannot have two different metrics share the same id \('m1'\)/);
        });
    });
    describe('in alarms', () => {
        test('MathExpressions can be used for an alarm', () => {
            // GIVEN
            new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
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
        });
        test('can nest MathExpressions in an alarm', () => {
            // GIVEN
            new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
                    expression: 'a + e',
                    usingMetrics: {
                        a,
                        e: new lib_1.MathExpression({
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
        });
        test('MathExpression controls period of metrics transitively used in it with alarms', () => {
            // GIVEN
            new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
                    expression: 'a + e',
                    usingMetrics: {
                        a,
                        e: new lib_1.MathExpression({
                            expression: 'b + c',
                            usingMetrics: { b, c },
                            period: core_1.Duration.minutes(1),
                        }),
                    },
                    period: core_1.Duration.seconds(30),
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
        });
        test('MathExpression without inner metrics emits its own period', () => {
            // WHEN
            new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
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
        });
        test('annotation for a mathexpression alarm is calculated based upon constituent metrics', () => {
            // GIVEN
            const alarm = new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
                    period: core_1.Duration.minutes(10),
                    expression: 'a + b',
                    usingMetrics: { a, b: b.with({ period: core_1.Duration.minutes(20) }) }, // This is overridden
                }),
            });
            // WHEN
            const alarmLabel = alarm.toAnnotation().label;
            // THEN
            expect(alarmLabel).toEqual('a + b >= 1 for 1 datapoints within 10 minutes');
        });
        test('can use percentiles in expression metrics in alarms', () => {
            // GIVEN
            new lib_1.Alarm(stack, 'Alarm', {
                threshold: 1,
                evaluationPeriods: 1,
                metric: new lib_1.MathExpression({
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
        });
    });
});
function graphMetricsAre(w, metrics) {
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
function alarmMetricsAre(metrics) {
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        Metrics: metrics,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLW1hdGgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1ldHJpYy1tYXRoLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQWdEO0FBQ2hELGdDQUE2RTtBQUU3RSxNQUFNLENBQUMsR0FBRyxJQUFJLFlBQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDbEUsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDeEYsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLE1BQU0sR0FBRyxHQUFHLElBQUksWUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRXRGLElBQUksS0FBWSxDQUFDO0FBQ2pCLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksb0JBQWMsQ0FBQztnQkFDakIsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLFlBQVksRUFBRTtvQkFDWixLQUFLLEVBQUUsQ0FBQztvQkFDUixHQUFHLEVBQUUsQ0FBQztpQkFDUDthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxD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SUFBSSxFQUFFLFNBQVM7cUJBQ2hCO29CQUNELFVBQVUsRUFBRSxLQUFLO2lCQUNsQjtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsS0FBSztvQkFDVCxVQUFVLEVBQUU7d0JBQ1YsTUFBTSxFQUFFOzRCQUNOLFVBQVUsRUFBRSxRQUFROzRCQUNwQixTQUFTLEVBQUUsTUFBTTt5QkFDbEI7d0JBQ0QsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsSUFBSSxFQUFFLEtBQUs7cUJBQ1o7b0JBQ0QsVUFBVSxFQUFFLEtBQUs7aUJBQ2xCO2FBQ0YsQ0FBQyxDQUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxlQUFlLENBQUMsQ0FBVSxFQUFFLE9BQWM7SUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7WUFDVCxVQUFVLEVBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7Z0JBQzlCLE9BQU87Z0JBQ1AsS0FBSyxFQUFFLEVBQUU7YUFDVjtTQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE9BQWM7SUFDckMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7UUFDeEUsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFsYXJtLCBHcmFwaFdpZGdldCwgSVdpZGdldCwgTWF0aEV4cHJlc3Npb24sIE1ldHJpYyB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGEgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnVGVzdCcsIG1ldHJpY05hbWU6ICdBQ291bnQnIH0pO1xuY29uc3QgYiA9IG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdUZXN0JywgbWV0cmljTmFtZTogJ0JDb3VudCcsIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnIH0pO1xuY29uc3QgYyA9IG5ldyBNZXRyaWMoeyBuYW1lc3BhY2U6ICdUZXN0JywgbWV0cmljTmFtZTogJ0NDb3VudCcgfSk7XG5jb25zdCBiOTkgPSBuZXcgTWV0cmljKHsgbmFtZXNwYWNlOiAnVGVzdCcsIG1ldHJpY05hbWU6ICdCQ291bnQnLCBzdGF0aXN0aWM6ICdwOTknIH0pO1xuXG5sZXQgc3RhY2s6IFN0YWNrO1xuZGVzY3JpYmUoJ01ldHJpYyBNYXRoJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gbm90IHVzZSBpbnZhbGlkIHZhcmlhYmxlIG5hbWVzIGluIE1hdGhFeHByZXNzaW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICBleHByZXNzaW9uOiAnSEFQUFkgKyBKT1knLFxuICAgICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgICBIQVBQWTogYSxcbiAgICAgICAgICBKT1k6IGIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9JbnZhbGlkIHZhcmlhYmxlIG5hbWVzIGluIGV4cHJlc3Npb24vKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCByZXVzZSB2YXJpYWJsZSBuYW1lcyBpbiBuZXN0ZWQgTWF0aEV4cHJlc3Npb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBlJyxcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7XG4gICAgICAgICAgYSxcbiAgICAgICAgICBlOiBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBjJyxcbiAgICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhOiBiLCBjIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9UaGUgSUQgJ2EnIHVzZWQgZm9yIHR3byBtZXRyaWNzIGluIHRoZSBleHByZXNzaW9uOiAnQkNvdW50JyBhbmQgJ0FDb3VudCcuIFJlbmFtZSBvbmUvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBub3QgdXNlIGludmFsaWQgcGVyaW9kIGluIE1hdGhFeHByZXNzaW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICBleHByZXNzaW9uOiAnYStiJyxcbiAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGEsIGIgfSxcbiAgICAgICAgcGVyaW9kOiBEdXJhdGlvbi5zZWNvbmRzKDIwKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coLydwZXJpb2QnIG11c3QgYmUgMSwgNSwgMTAsIDMwLCBvciBhIG11bHRpcGxlIG9mIDYwIHNlY29uZHMsIHJlY2VpdmVkIDIwLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdNYXRoRXhwcmVzc2lvbiBvcHRpbWl6YXRpb246IFwid2l0aFwiIHdpdGggdGhlIHNhbWUgcGVyaW9kIHJldHVybnMgdGhlIHNhbWUgb2JqZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWF0aEV4cHJlc3Npb24oeyBleHByZXNzaW9uOiAnU1VNKE1FVFJJQ1MoKSknLCB1c2luZ01ldHJpY3M6IHt9LCBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMTApIH0pO1xuXG4gICAgLy8gTm90ZTogb2JqZWN0IGVxdWFsaXR5LCBOT1QgZGVlcCBlcXVhbGl0eSBvbiBwdXJwb3NlXG4gICAgZXhwZWN0KG0ud2l0aCh7fSkpLnRvRXF1YWwobSk7XG4gICAgZXhwZWN0KG0ud2l0aCh7IHBlcmlvZDogRHVyYXRpb24ubWludXRlcygxMCkgfSkpLnRvRXF1YWwobSk7XG5cbiAgICBleHBlY3QobS53aXRoKHsgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpIH0pKS5ub3QudG9FcXVhbChtKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWF0aCBleHByZXNzaW9uIHJlZmVycmluZyB0byB1bmtub3duIGV4cHJlc3Npb25zIHByb2R1Y2VzIGEgd2FybmluZycsICgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgIGV4cHJlc3Npb246ICdtMSArIG0yJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChtLndhcm5pbmdzKS50b0NvbnRhaW5FcXVhbChleHBlY3Quc3RyaW5nQ29udGFpbmluZyhcIidtMSArIG0yJyByZWZlcmVuY2VzIHVua25vd24gaWRlbnRpZmllcnNcIikpO1xuICB9KTtcblxuICB0ZXN0KCdtZXRyaWNzIE1FVFJJQ1MgZXhwcmVzc2lvbiBkb2VzIG5vdCBwcm9kdWNlIHdhcm5pbmcgZm9yIHVua25vd24gaWRlbnRpZmllcicsICgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgIGV4cHJlc3Npb246ICdTVU0oTUVUUklDUygpKScsXG4gICAgICB1c2luZ01ldHJpY3M6IHt9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG0ud2FybmluZ3MpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0cmljcyBzZWFyY2ggZXhwcmVzc2lvbiBkb2VzIG5vdCBwcm9kdWNlIHdhcm5pbmcgZm9yIHVua25vd24gaWRlbnRpZmllcicsICgpID0+IHtcbiAgICBjb25zdCBtID0gbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgIGV4cHJlc3Npb246IFwiU0VBUkNIKCd7ZGltZW5zaW9uX29uZSwgZGltZW5zaW9uX3R3b30gbXlfbWV0cmljJywgJ0F2ZXJhZ2UnLCAzMDApXCIsXG4gICAgICB1c2luZ01ldHJpY3M6IHt9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG0ud2FybmluZ3MpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0cmljcyBpbnNpZ2h0cyBleHByZXNzaW9uIGRvZXMgbm90IHByb2R1Y2Ugd2FybmluZyBmb3IgdW5rbm93biBpZGVudGlmaWVyJywgKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgZXhwcmVzc2lvbjogXCJTRUxFQ1QgQVZHKENwdVVzYWdlKSBGUk9NIEVDMiBXSEVSRSBJbnN0YW5jZSA9ICcxMjM0NTYnXCIsXG4gICAgfSk7XG5cbiAgICBleHBlY3QobS53YXJuaW5ncykudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdtYXRoIGV4cHJlc3Npb24gcmVmZXJyaW5nIHRvIHVua25vd24gZXhwcmVzc2lvbnMgcHJvZHVjZXMgYSB3YXJuaW5nLCBldmVuIHdoZW4gbmVzdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG0gPSBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgZXhwcmVzc2lvbjogJ2UxICsgNScsXG4gICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgZTE6IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgZXhwcmVzc2lvbjogJ20xICsgbTInLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QobS53YXJuaW5ncykudG9Db250YWluRXF1YWwoZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoXCInbTEgKyBtMicgcmVmZXJlbmNlcyB1bmtub3duIGlkZW50aWZpZXJzXCIpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2luIGdyYXBocycsICgpID0+IHtcbiAgICB0ZXN0KCdNYXRoRXhwcmVzc2lvbnMgY2FuIGJlIGFkZGVkIHRvIGEgZ3JhcGgnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgYicsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYSwgYiB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShncmFwaCwgW1xuICAgICAgICBbeyBleHByZXNzaW9uOiAnYSArIGInLCBsYWJlbDogJ2EgKyBiJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0FDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdCQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2InIH1dLFxuICAgICAgXSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIG5lc3QgTWF0aEV4cHJlc3Npb25zIGluIGEgZ3JhcGgnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgZScsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgICAgICAgYSxcbiAgICAgICAgICAgICAgZTogbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiAnYiArIGMnLFxuICAgICAgICAgICAgICAgIHVzaW5nTWV0cmljczogeyBiLCBjIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBncmFwaE1ldHJpY3NBcmUoZ3JhcGgsIFtcbiAgICAgICAgW3sgbGFiZWw6ICdhICsgZScsIGV4cHJlc3Npb246ICdhICsgZScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2EnIH1dLFxuICAgICAgICBbeyBleHByZXNzaW9uOiAnYiArIGMnLCB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdlJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0JDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYicgfV0sXG4gICAgICAgIFsnVGVzdCcsICdDQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2MnIH1dLFxuICAgICAgXSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGFkZCB0aGUgc2FtZSBtZXRyaWMgdW5kZXIgZGlmZmVyZW50IGlkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGdyYXBoID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgICAgbGVmdDogW1xuICAgICAgICAgIG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgICBleHByZXNzaW9uOiAnYSArIGUnLFxuICAgICAgICAgICAgdXNpbmdNZXRyaWNzOiB7XG4gICAgICAgICAgICAgIGEsXG4gICAgICAgICAgICAgIGU6IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2IgKyBjJyxcbiAgICAgICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYjogYSwgYyB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgZ3JhcGhNZXRyaWNzQXJlKGdyYXBoLCBbXG4gICAgICAgIFt7IGxhYmVsOiAnYSArIGUnLCBleHByZXNzaW9uOiAnYSArIGUnIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdhJyB9XSxcbiAgICAgICAgW3sgZXhwcmVzc2lvbjogJ2IgKyBjJywgdmlzaWJsZTogZmFsc2UsIGlkOiAnZScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2InIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQ0NvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdjJyB9XSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Bhc3NpbmcgYW4gZW1wdHkgc3RyaW5nIGFzIHRoZSBsYWJlbCBvZiBhIE1hdGhFeHByZXNzaW9ucyBkb2VzIG5vdCBlbWl0IGEgbGFiZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBlJyxcbiAgICAgICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgICAgIHVzaW5nTWV0cmljczoge1xuICAgICAgICAgICAgICBhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBncmFwaE1ldHJpY3NBcmUoZ3JhcGgsIFtcbiAgICAgICAgW3sgZXhwcmVzc2lvbjogJ2EgKyBlJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0FDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYScgfV0sXG4gICAgICBdKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gcmV1c2UgaWRlbnRpZmllcnMgaW4gTWF0aEV4cHJlc3Npb25zIGlmIG1ldHJpY3MgYXJlIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgZScsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgICAgICAgYSxcbiAgICAgICAgICAgICAgZTogbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiAnYSArIGMnLFxuICAgICAgICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhLCBjIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBncmFwaE1ldHJpY3NBcmUoZ3JhcGgsIFtcbiAgICAgICAgW3sgbGFiZWw6ICdhICsgZScsIGV4cHJlc3Npb246ICdhICsgZScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2EnIH1dLFxuICAgICAgICBbeyBleHByZXNzaW9uOiAnYSArIGMnLCB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdlJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0NDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYycgfV0sXG4gICAgICBdKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdNYXRoRXhwcmVzc2lvbiBhbmQgaXRzIGNvbnN0aXR1ZW50IG1ldHJpY3MgY2FuIGJvdGggYmUgYWRkZWQgdG8gYSBncmFwaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGdyYXBoID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgICAgbGVmdDogW1xuICAgICAgICAgIGEsXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgYicsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYSwgYiB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShncmFwaCwgW1xuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyBpZDogJ2EnIH1dLFxuICAgICAgICBbeyBsYWJlbDogJ2EgKyBiJywgZXhwcmVzc2lvbjogJ2EgKyBiJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0JDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYicgfV0sXG4gICAgICBdKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnTWF0aEV4cHJlc3Npb24gY29udHJvbHMgcGVyaW9kIG9mIG1ldHJpY3MgZGlyZWN0bHkgdXNlZCBpbiBpdCcsICgpID0+IHtcbiAgICAgIC8vIENoZWNrIHRoYXQgaWYgd2UgYWRkIEEgd2l0aCB7IHBlcmlvZDogMTBzIH0gdG8gYSBtYXRoZXhwcmVzc2lvbiBvZiBwZXJpb2QgNW1cbiAgICAgIC8vIHRoZW4gdHdvIG1ldHJpYyBsaW5lcyBhcmUgYWRkZWQgZm9yIEEsIG9uZSBhdCAxMHMgYW5kIG9uZSBhdCA1bVxuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgYS53aXRoKHsgcGVyaW9kOiBEdXJhdGlvbi5zZWNvbmRzKDEwKSB9KSxcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhOiBhLndpdGgoeyBwZXJpb2Q6IER1cmF0aW9uLnNlY29uZHMoMTApIH0pLCBiIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZ3JhcGhNZXRyaWNzQXJlKGdyYXBoLCBbXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnLCB7IHBlcmlvZDogMTAgfV0sXG4gICAgICAgIFt7IGxhYmVsOiAnYSArIGInLCBleHByZXNzaW9uOiAnYSArIGInIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdhJyB9XSxcbiAgICAgICAgWydUZXN0JywgJ0JDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYicgfV0sXG4gICAgICBdKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndG9wIGxldmVsIHBlcmlvZCBpbiBhIE1hdGhFeHByZXNzaW9uIGlzIHJlc3BlY3RlZCBpbiBpdHMgbWV0cmljcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGdyYXBoID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgICAgbGVmdDogW1xuICAgICAgICAgIGEsXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgYicsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYSwgYiB9LFxuICAgICAgICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDEpLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShncmFwaCwgW1xuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50J10sXG4gICAgICAgIFt7IGxhYmVsOiAnYSArIGInLCBleHByZXNzaW9uOiAnYSArIGInLCBwZXJpb2Q6IDYwIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdhJywgcGVyaW9kOiA2MCB9XSxcbiAgICAgICAgWydUZXN0JywgJ0JDb3VudCcsIHsgdmlzaWJsZTogZmFsc2UsIGlkOiAnYicsIHBlcmlvZDogNjAgfV0sXG4gICAgICBdKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnTWF0aEV4cHJlc3Npb24gY29udHJvbHMgcGVyaW9kIG9mIG1ldHJpY3MgdHJhbnNpdGl2ZWx5IHVzZWQgaW4gaXQnLCAoKSA9PiB7XG4gICAgICAvLyBTYW1lIGFzIHRoZSBwcmV2aW91cyB0ZXN0LCBidXQgcmVjdXJzaXZlbHlcblxuICAgICAgY29uc3QgZ3JhcGggPSBuZXcgR3JhcGhXaWRnZXQoe1xuICAgICAgICBsZWZ0OiBbXG4gICAgICAgICAgbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgZScsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgICAgICAgYSxcbiAgICAgICAgICAgICAgZTogbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiAnYSArIGInLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcygxKSxcbiAgICAgICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYSwgYiB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZ3JhcGhNZXRyaWNzQXJlKGdyYXBoLCBbXG4gICAgICAgIFt7IGV4cHJlc3Npb246ICdhICsgZScsIGxhYmVsOiAnYSArIGUnIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdhJyB9XSxcbiAgICAgICAgW3sgZXhwcmVzc2lvbjogJ2EgKyBiJywgdmlzaWJsZTogZmFsc2UsIGlkOiAnZScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdCQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2InIH1dLFxuICAgICAgXSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2UgcGVyY2VudGlsZXMgaW4gZXhwcmVzc2lvbiBtZXRyaWNzIGluIGdyYXBocycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiOTknLFxuICAgICAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGEsIGI5OSB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGdyYXBoTWV0cmljc0FyZShncmFwaCwgW1xuICAgICAgICBbeyBleHByZXNzaW9uOiAnYSArIGI5OScsIGxhYmVsOiAnYSArIGI5OScgfV0sXG4gICAgICAgIFsnVGVzdCcsICdBQ291bnQnLCB7IHZpc2libGU6IGZhbHNlLCBpZDogJ2EnIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQkNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdiOTknLCBzdGF0OiAncDk5JyB9XSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiByZXVzZSB0aGUgc2FtZSBtZXRyaWMgYmV0d2VlbiBsZWZ0IGFuZCByaWdodCBheGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGdyYXBoID0gbmV3IEdyYXBoV2lkZ2V0KHtcbiAgICAgICAgbGVmdDogW1xuICAgICAgICAgIG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgICBleHByZXNzaW9uOiAnYSArIDEnLFxuICAgICAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGEgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgcmlnaHQ6IFtcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyAyJyxcbiAgICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZ3JhcGhNZXRyaWNzQXJlKGdyYXBoLCBbXG4gICAgICAgIFt7IGxhYmVsOiAnYSArIDEnLCBleHByZXNzaW9uOiAnYSArIDEnIH1dLFxuICAgICAgICBbJ1Rlc3QnLCAnQUNvdW50JywgeyB2aXNpYmxlOiBmYWxzZSwgaWQ6ICdhJyB9XSxcbiAgICAgICAgW3sgbGFiZWw6ICdhICsgMicsIGV4cHJlc3Npb246ICdhICsgMicsIHlBeGlzOiAncmlnaHQnIH1dLFxuICAgICAgXSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZGV0ZWN0IG5hbWUgY29uZmxpY3RzIGJldHdlZW4gbGVmdCBhbmQgcmlnaHQgYXhlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBncmFwaCA9IG5ldyBHcmFwaFdpZGdldCh7XG4gICAgICAgIGxlZnQ6IFtcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ20xICsgMScsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgbTE6IGEgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgcmlnaHQ6IFtcbiAgICAgICAgICBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgZXhwcmVzc2lvbjogJ20xICsgMScsXG4gICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgbTE6IGIgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBncmFwaE1ldHJpY3NBcmUoZ3JhcGgsIFtdKTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBoYXZlIHR3byBkaWZmZXJlbnQgbWV0cmljcyBzaGFyZSB0aGUgc2FtZSBpZCBcXCgnbTEnXFwpLyk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW4gYWxhcm1zJywgKCkgPT4ge1xuICAgIHRlc3QoJ01hdGhFeHByZXNzaW9ucyBjYW4gYmUgdXNlZCBmb3IgYW4gYWxhcm0nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0nLCB7XG4gICAgICAgIHRocmVzaG9sZDogMSxcbiAgICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICAgIG1ldHJpYzogbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICBleHByZXNzaW9uOiAnYSArIGInLFxuICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhLCBiIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGFsYXJtTWV0cmljc0FyZShbXG4gICAgICAgIHtcbiAgICAgICAgICBFeHByZXNzaW9uOiAnYSArIGInLFxuICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIElkOiAnYScsXG4gICAgICAgICAgTWV0cmljU3RhdDoge1xuICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgIE1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQZXJpb2Q6IDMwMCxcbiAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJldHVybkRhdGE6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgSWQ6ICdiJyxcbiAgICAgICAgICBNZXRyaWNTdGF0OiB7XG4gICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0JDb3VudCcsXG4gICAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBlcmlvZDogMzAwLFxuICAgICAgICAgICAgU3RhdDogJ0F2ZXJhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmV0dXJuRGF0YTogZmFsc2UsXG4gICAgICAgIH0sXG5cbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBuZXN0IE1hdGhFeHByZXNzaW9ucyBpbiBhbiBhbGFybScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBuZXcgQWxhcm0oc3RhY2ssICdBbGFybScsIHtcbiAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgbWV0cmljOiBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgIGV4cHJlc3Npb246ICdhICsgZScsXG4gICAgICAgICAgdXNpbmdNZXRyaWNzOiB7XG4gICAgICAgICAgICBhLFxuICAgICAgICAgICAgZTogbmV3IE1hdGhFeHByZXNzaW9uKHtcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbjogJ2IgKyBjJyxcbiAgICAgICAgICAgICAgdXNpbmdNZXRyaWNzOiB7IGIsIGMgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGFsYXJtTWV0cmljc0FyZShbXG4gICAgICAgIHtcbiAgICAgICAgICBFeHByZXNzaW9uOiAnYSArIGUnLFxuICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIElkOiAnYScsXG4gICAgICAgICAgTWV0cmljU3RhdDoge1xuICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgIE1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQZXJpb2Q6IDMwMCxcbiAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJldHVybkRhdGE6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRXhwcmVzc2lvbjogJ2IgKyBjJyxcbiAgICAgICAgICBJZDogJ2UnLFxuICAgICAgICAgIFJldHVybkRhdGE6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgSWQ6ICdiJyxcbiAgICAgICAgICBNZXRyaWNTdGF0OiB7XG4gICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0JDb3VudCcsXG4gICAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBlcmlvZDogMzAwLFxuICAgICAgICAgICAgU3RhdDogJ0F2ZXJhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmV0dXJuRGF0YTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBJZDogJ2MnLFxuICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgIE1ldHJpYzoge1xuICAgICAgICAgICAgICBNZXRyaWNOYW1lOiAnQ0NvdW50JyxcbiAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUGVyaW9kOiAzMDAsXG4gICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ01hdGhFeHByZXNzaW9uIGNvbnRyb2xzIHBlcmlvZCBvZiBtZXRyaWNzIHRyYW5zaXRpdmVseSB1c2VkIGluIGl0IHdpdGggYWxhcm1zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIG5ldyBBbGFybShzdGFjaywgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBlJyxcbiAgICAgICAgICB1c2luZ01ldHJpY3M6IHtcbiAgICAgICAgICAgIGEsXG4gICAgICAgICAgICBlOiBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgICAgICBleHByZXNzaW9uOiAnYiArIGMnLFxuICAgICAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYiwgYyB9LFxuICAgICAgICAgICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBlcmlvZDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGFsYXJtTWV0cmljc0FyZShbXG4gICAgICAgIHtcbiAgICAgICAgICBFeHByZXNzaW9uOiAnYSArIGUnLFxuICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIElkOiAnYScsXG4gICAgICAgICAgTWV0cmljU3RhdDoge1xuICAgICAgICAgICAgTWV0cmljOiB7XG4gICAgICAgICAgICAgIE1ldHJpY05hbWU6ICdBQ291bnQnLFxuICAgICAgICAgICAgICBOYW1lc3BhY2U6ICdUZXN0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQZXJpb2Q6IDMwLFxuICAgICAgICAgICAgU3RhdDogJ0F2ZXJhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmV0dXJuRGF0YTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBFeHByZXNzaW9uOiAnYiArIGMnLFxuICAgICAgICAgIElkOiAnZScsXG4gICAgICAgICAgUmV0dXJuRGF0YTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBJZDogJ2InLFxuICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgIE1ldHJpYzoge1xuICAgICAgICAgICAgICBNZXRyaWNOYW1lOiAnQkNvdW50JyxcbiAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUGVyaW9kOiAzMCxcbiAgICAgICAgICAgIFN0YXQ6ICdBdmVyYWdlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJldHVybkRhdGE6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgSWQ6ICdjJyxcbiAgICAgICAgICBNZXRyaWNTdGF0OiB7XG4gICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0NDb3VudCcsXG4gICAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBlcmlvZDogMzAsXG4gICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ01hdGhFeHByZXNzaW9uIHdpdGhvdXQgaW5uZXIgbWV0cmljcyBlbWl0cyBpdHMgb3duIHBlcmlvZCcsICgpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBbGFybShzdGFjaywgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgZXhwcmVzc2lvbjogJ0lOU0lHSFRfUlVMRV9NRVRSSUMoXCJTb21lSWRcIiwgVW5pcXVlQ29udHJpYnV0b3JzKScsXG4gICAgICAgICAgdXNpbmdNZXRyaWNzOiB7fSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYWxhcm1NZXRyaWNzQXJlKFtcbiAgICAgICAge1xuICAgICAgICAgIEV4cHJlc3Npb246ICdJTlNJR0hUX1JVTEVfTUVUUklDKFwiU29tZUlkXCIsIFVuaXF1ZUNvbnRyaWJ1dG9ycyknLFxuICAgICAgICAgIElkOiAnZXhwcl8xJyxcbiAgICAgICAgICBQZXJpb2Q6IDMwMCxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2Fubm90YXRpb24gZm9yIGEgbWF0aGV4cHJlc3Npb24gYWxhcm0gaXMgY2FsY3VsYXRlZCBiYXNlZCB1cG9uIGNvbnN0aXR1ZW50IG1ldHJpY3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYWxhcm0gPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybScsIHtcbiAgICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgICAgbWV0cmljOiBuZXcgTWF0aEV4cHJlc3Npb24oe1xuICAgICAgICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcygxMCksXG4gICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiJyxcbiAgICAgICAgICB1c2luZ01ldHJpY3M6IHsgYSwgYjogYi53aXRoKHsgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDIwKSB9KSB9LCAvLyBUaGlzIGlzIG92ZXJyaWRkZW5cbiAgICAgICAgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYWxhcm1MYWJlbCA9IGFsYXJtLnRvQW5ub3RhdGlvbigpLmxhYmVsO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoYWxhcm1MYWJlbCkudG9FcXVhbCgnYSArIGIgPj0gMSBmb3IgMSBkYXRhcG9pbnRzIHdpdGhpbiAxMCBtaW51dGVzJyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSBwZXJjZW50aWxlcyBpbiBleHByZXNzaW9uIG1ldHJpY3MgaW4gYWxhcm1zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIG5ldyBBbGFybShzdGFjaywgJ0FsYXJtJywge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgICBtZXRyaWM6IG5ldyBNYXRoRXhwcmVzc2lvbih7XG4gICAgICAgICAgZXhwcmVzc2lvbjogJ2EgKyBiOTknLFxuICAgICAgICAgIHVzaW5nTWV0cmljczogeyBhLCBiOTkgfSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgYWxhcm1NZXRyaWNzQXJlKFtcbiAgICAgICAge1xuICAgICAgICAgIEV4cHJlc3Npb246ICdhICsgYjk5JyxcbiAgICAgICAgICBJZDogJ2V4cHJfMScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBJZDogJ2EnLFxuICAgICAgICAgIE1ldHJpY1N0YXQ6IHtcbiAgICAgICAgICAgIE1ldHJpYzoge1xuICAgICAgICAgICAgICBNZXRyaWNOYW1lOiAnQUNvdW50JyxcbiAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUGVyaW9kOiAzMDAsXG4gICAgICAgICAgICBTdGF0OiAnQXZlcmFnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIElkOiAnYjk5JyxcbiAgICAgICAgICBNZXRyaWNTdGF0OiB7XG4gICAgICAgICAgICBNZXRyaWM6IHtcbiAgICAgICAgICAgICAgTWV0cmljTmFtZTogJ0JDb3VudCcsXG4gICAgICAgICAgICAgIE5hbWVzcGFjZTogJ1Rlc3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBlcmlvZDogMzAwLFxuICAgICAgICAgICAgU3RhdDogJ3A5OScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXR1cm5EYXRhOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZ3JhcGhNZXRyaWNzQXJlKHc6IElXaWRnZXQsIG1ldHJpY3M6IGFueVtdKSB7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHcudG9Kc29uKCkpKS50b0VxdWFsKFt7XG4gICAgdHlwZTogJ21ldHJpYycsXG4gICAgd2lkdGg6IDYsXG4gICAgaGVpZ2h0OiA2LFxuICAgIHByb3BlcnRpZXM6XG4gICAge1xuICAgICAgdmlldzogJ3RpbWVTZXJpZXMnLFxuICAgICAgcmVnaW9uOiB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgbWV0cmljcyxcbiAgICAgIHlBeGlzOiB7fSxcbiAgICB9LFxuICB9XSk7XG59XG5cbmZ1bmN0aW9uIGFsYXJtTWV0cmljc0FyZShtZXRyaWNzOiBhbnlbXSkge1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpBbGFybScsIHtcbiAgICBNZXRyaWNzOiBtZXRyaWNzLFxuICB9KTtcbn1cbiJdfQ==