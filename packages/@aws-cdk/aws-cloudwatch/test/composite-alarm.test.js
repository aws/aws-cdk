"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('CompositeAlarm', () => {
    test('test alarm rule expression builder', () => {
        const stack = new core_1.Stack();
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const alarm1 = new lib_1.Alarm(stack, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        const alarm2 = new lib_1.Alarm(stack, 'Alarm2', {
            metric: testMetric,
            threshold: 1000,
            evaluationPeriods: 3,
        });
        const alarm3 = new lib_1.Alarm(stack, 'Alarm3', {
            metric: testMetric,
            threshold: 10000,
            evaluationPeriods: 3,
        });
        const alarm4 = new lib_1.Alarm(stack, 'Alarm4', {
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarm5 = new lib_1.Alarm(stack, 'Alarm5', {
            alarmName: 'Alarm with space in name',
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarmRule = lib_1.AlarmRule.anyOf(lib_1.AlarmRule.allOf(lib_1.AlarmRule.anyOf(alarm1, lib_1.AlarmRule.fromAlarm(alarm2, lib_1.AlarmState.OK), alarm3, alarm5), lib_1.AlarmRule.not(lib_1.AlarmRule.fromAlarm(alarm4, lib_1.AlarmState.INSUFFICIENT_DATA))), lib_1.AlarmRule.fromBoolean(false));
        new lib_1.CompositeAlarm(stack, 'CompositeAlarm', {
            alarmRule,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
            AlarmName: 'CompositeAlarm',
            AlarmRule: {
                'Fn::Join': [
                    '',
                    [
                        '(((ALARM("',
                        {
                            'Fn::GetAtt': [
                                'Alarm1F9009D71',
                                'Arn',
                            ],
                        },
                        '") OR OK("',
                        {
                            'Fn::GetAtt': [
                                'Alarm2A7122E13',
                                'Arn',
                            ],
                        },
                        '") OR ALARM("',
                        {
                            'Fn::GetAtt': [
                                'Alarm32341D8D9',
                                'Arn',
                            ],
                        },
                        '") OR ALARM("',
                        {
                            'Fn::GetAtt': [
                                'Alarm548383B2F',
                                'Arn',
                            ],
                        },
                        '")) AND (NOT (INSUFFICIENT_DATA("',
                        {
                            'Fn::GetAtt': [
                                'Alarm4671832C8',
                                'Arn',
                            ],
                        },
                        '")))) OR FALSE)',
                    ],
                ],
            },
        });
    });
    test('test action suppressor translates to a correct CFN properties', () => {
        const stack = new core_1.Stack();
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const actionsSuppressor = new lib_1.Alarm(stack, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        const alarmRule = lib_1.AlarmRule.fromBoolean(true);
        new lib_1.CompositeAlarm(stack, 'CompositeAlarm', {
            alarmRule,
            actionsSuppressor,
            actionsSuppressorExtensionPeriod: core_1.Duration.minutes(2),
            actionsSuppressorWaitPeriod: core_1.Duration.minutes(5),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
            AlarmName: 'CompositeAlarm',
            ActionsSuppressor: {
                'Fn::GetAtt': [
                    'Alarm1F9009D71',
                    'Arn',
                ],
            },
            ActionsSuppressorExtensionPeriod: 120,
            ActionsSuppressorWaitPeriod: 300,
        });
    });
    test('test wait and extension periods set without action suppressor', () => {
        const stack = new core_1.Stack();
        const alarmRule = lib_1.AlarmRule.fromBoolean(true);
        var createAlarm = () => new lib_1.CompositeAlarm(stack, 'CompositeAlarm', {
            alarmRule,
            actionsSuppressorExtensionPeriod: core_1.Duration.minutes(2),
            actionsSuppressorWaitPeriod: core_1.Duration.minutes(5),
        });
        expect(createAlarm).toThrow('ActionsSuppressor Extension/Wait Periods require an ActionsSuppressor to be set.');
    });
    test('test action suppressor has correct defaults set', () => {
        const stack = new core_1.Stack();
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const actionsSuppressor = new lib_1.Alarm(stack, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        const alarmRule = lib_1.AlarmRule.fromBoolean(true);
        new lib_1.CompositeAlarm(stack, 'CompositeAlarm', {
            alarmRule,
            actionsSuppressor,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::CompositeAlarm', {
            AlarmName: 'CompositeAlarm',
            ActionsSuppressor: {
                'Fn::GetAtt': [
                    'Alarm1F9009D71',
                    'Arn',
                ],
            },
            ActionsSuppressorExtensionPeriod: 60,
            ActionsSuppressorWaitPeriod: 60,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlLWFsYXJtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wb3NpdGUtYWxhcm0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBZ0Q7QUFDaEQsZ0NBQThFO0FBRTlFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUksWUFBTSxDQUFDO1lBQzVCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDeEMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDeEMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZixpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDeEMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3hDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN4QyxTQUFTLEVBQUUsMEJBQTBCO1lBQ3JDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsZUFBUyxDQUFDLEtBQUssQ0FDL0IsZUFBUyxDQUFDLEtBQUssQ0FDYixlQUFTLENBQUMsS0FBSyxDQUNiLE1BQU0sRUFDTixlQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxnQkFBVSxDQUFDLEVBQUUsQ0FBQyxFQUMxQyxNQUFNLEVBQ04sTUFBTSxDQUNQLEVBQ0QsZUFBUyxDQUFDLEdBQUcsQ0FBQyxlQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxnQkFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FDekUsRUFDRCxlQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUM3QixDQUFDO1FBRUYsSUFBSSxvQkFBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMxQyxTQUFTO1NBQ1YsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUNBQWlDLEVBQUU7WUFDakYsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0UsWUFBWTt3QkFDWjs0QkFDRSxZQUFZLEVBQUU7Z0NBQ1osZ0JBQWdCO2dDQUNoQixLQUFLOzZCQUNOO3lCQUNGO3dCQUNELFlBQVk7d0JBQ1o7NEJBQ0UsWUFBWSxFQUFFO2dDQUNaLGdCQUFnQjtnQ0FDaEIsS0FBSzs2QkFDTjt5QkFDRjt3QkFDRCxlQUFlO3dCQUNmOzRCQUNFLFlBQVksRUFBRTtnQ0FDWixnQkFBZ0I7Z0NBQ2hCLEtBQUs7NkJBQ047eUJBQ0Y7d0JBQ0QsZUFBZTt3QkFDZjs0QkFDRSxZQUFZLEVBQUU7Z0NBQ1osZ0JBQWdCO2dDQUNoQixLQUFLOzZCQUNOO3lCQUNGO3dCQUNELG1DQUFtQzt3QkFDbkM7NEJBQ0UsWUFBWSxFQUFFO2dDQUNaLGdCQUFnQjtnQ0FDaEIsS0FBSzs2QkFDTjt5QkFDRjt3QkFDRCxpQkFBaUI7cUJBQ2xCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLFVBQVUsR0FBRyxJQUFJLFlBQU0sQ0FBQztZQUM1QixTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDbkQsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUdILE1BQU0sU0FBUyxHQUFHLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUMsSUFBSSxvQkFBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMxQyxTQUFTO1lBQ1QsaUJBQWlCO1lBQ2pCLGdDQUFnQyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JELDJCQUEyQixFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlDQUFpQyxFQUFFO1lBQ2pGLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsaUJBQWlCLEVBQUU7Z0JBQ2pCLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7b0JBQ2hCLEtBQUs7aUJBQ047YUFDRjtZQUNELGdDQUFnQyxFQUFFLEdBQUc7WUFDckMsMkJBQTJCLEVBQUUsR0FBRztTQUNqQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLFNBQVMsR0FBRyxlQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlDLElBQUksV0FBVyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbEUsU0FBUztZQUNULGdDQUFnQyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JELDJCQUEyQixFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztJQUNsSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLFVBQVUsR0FBRyxJQUFJLFlBQU0sQ0FBQztZQUM1QixTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDbkQsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUdILE1BQU0sU0FBUyxHQUFHLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUMsSUFBSSxvQkFBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMxQyxTQUFTO1lBQ1QsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlDQUFpQyxFQUFFO1lBQ2pGLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsaUJBQWlCLEVBQUU7Z0JBQ2pCLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7b0JBQ2hCLEtBQUs7aUJBQ047YUFDRjtZQUNELGdDQUFnQyxFQUFFLEVBQUU7WUFDcEMsMkJBQTJCLEVBQUUsRUFBRTtTQUNoQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWxhcm0sIEFsYXJtUnVsZSwgQWxhcm1TdGF0ZSwgQ29tcG9zaXRlQWxhcm0sIE1ldHJpYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdDb21wb3NpdGVBbGFybScsICgpID0+IHtcbiAgdGVzdCgndGVzdCBhbGFybSBydWxlIGV4cHJlc3Npb24gYnVpbGRlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgdGVzdE1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTEgPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybTEnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm0yID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0yJywge1xuICAgICAgbWV0cmljOiB0ZXN0TWV0cmljLFxuICAgICAgdGhyZXNob2xkOiAxMDAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTMgPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybTMnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTQgPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybTQnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm01ID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm01Jywge1xuICAgICAgYWxhcm1OYW1lOiAnQWxhcm0gd2l0aCBzcGFjZSBpbiBuYW1lJyxcbiAgICAgIG1ldHJpYzogdGVzdE1ldHJpYyxcbiAgICAgIHRocmVzaG9sZDogMTAwMDAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybVJ1bGUgPSBBbGFybVJ1bGUuYW55T2YoXG4gICAgICBBbGFybVJ1bGUuYWxsT2YoXG4gICAgICAgIEFsYXJtUnVsZS5hbnlPZihcbiAgICAgICAgICBhbGFybTEsXG4gICAgICAgICAgQWxhcm1SdWxlLmZyb21BbGFybShhbGFybTIsIEFsYXJtU3RhdGUuT0spLFxuICAgICAgICAgIGFsYXJtMyxcbiAgICAgICAgICBhbGFybTUsXG4gICAgICAgICksXG4gICAgICAgIEFsYXJtUnVsZS5ub3QoQWxhcm1SdWxlLmZyb21BbGFybShhbGFybTQsIEFsYXJtU3RhdGUuSU5TVUZGSUNJRU5UX0RBVEEpKSxcbiAgICAgICksXG4gICAgICBBbGFybVJ1bGUuZnJvbUJvb2xlYW4oZmFsc2UpLFxuICAgICk7XG5cbiAgICBuZXcgQ29tcG9zaXRlQWxhcm0oc3RhY2ssICdDb21wb3NpdGVBbGFybScsIHtcbiAgICAgIGFsYXJtUnVsZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkNvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgQWxhcm1OYW1lOiAnQ29tcG9zaXRlQWxhcm0nLFxuICAgICAgQWxhcm1SdWxlOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnKCgoQUxBUk0oXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQWxhcm0xRjkwMDlENzEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIikgT1IgT0soXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQWxhcm0yQTcxMjJFMTMnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIikgT1IgQUxBUk0oXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQWxhcm0zMjM0MUQ4RDknLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIikgT1IgQUxBUk0oXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQWxhcm01NDgzODNCMkYnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIikpIEFORCAoTk9UIChJTlNVRkZJQ0lFTlRfREFUQShcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdBbGFybTQ2NzE4MzJDOCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1wiKSkpKSBPUiBGQUxTRSknLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndGVzdCBhY3Rpb24gc3VwcHJlc3NvciB0cmFuc2xhdGVzIHRvIGEgY29ycmVjdCBDRk4gcHJvcGVydGllcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgdGVzdE1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhY3Rpb25zU3VwcHJlc3NvciA9IG5ldyBBbGFybShzdGFjaywgJ0FsYXJtMScsIHtcbiAgICAgIG1ldHJpYzogdGVzdE1ldHJpYyxcbiAgICAgIHRocmVzaG9sZDogMTAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cblxuICAgIGNvbnN0IGFsYXJtUnVsZSA9IEFsYXJtUnVsZS5mcm9tQm9vbGVhbih0cnVlKTtcblxuICAgIG5ldyBDb21wb3NpdGVBbGFybShzdGFjaywgJ0NvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgYWxhcm1SdWxlLFxuICAgICAgYWN0aW9uc1N1cHByZXNzb3IsXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZDogRHVyYXRpb24ubWludXRlcygyKSxcbiAgICAgIGFjdGlvbnNTdXBwcmVzc29yV2FpdFBlcmlvZDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkNvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgQWxhcm1OYW1lOiAnQ29tcG9zaXRlQWxhcm0nLFxuICAgICAgQWN0aW9uc1N1cHByZXNzb3I6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0FsYXJtMUY5MDA5RDcxJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBBY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZDogMTIwLFxuICAgICAgQWN0aW9uc1N1cHByZXNzb3JXYWl0UGVyaW9kOiAzMDAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3Qgd2FpdCBhbmQgZXh0ZW5zaW9uIHBlcmlvZHMgc2V0IHdpdGhvdXQgYWN0aW9uIHN1cHByZXNzb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFsYXJtUnVsZSA9IEFsYXJtUnVsZS5mcm9tQm9vbGVhbih0cnVlKTtcblxuICAgIHZhciBjcmVhdGVBbGFybSA9ICgpID0+IG5ldyBDb21wb3NpdGVBbGFybShzdGFjaywgJ0NvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgYWxhcm1SdWxlLFxuICAgICAgYWN0aW9uc1N1cHByZXNzb3JFeHRlbnNpb25QZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMiksXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvcldhaXRQZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgfSk7XG5cbiAgICBleHBlY3QoY3JlYXRlQWxhcm0pLnRvVGhyb3coJ0FjdGlvbnNTdXBwcmVzc29yIEV4dGVuc2lvbi9XYWl0IFBlcmlvZHMgcmVxdWlyZSBhbiBBY3Rpb25zU3VwcHJlc3NvciB0byBiZSBzZXQuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3QgYWN0aW9uIHN1cHByZXNzb3IgaGFzIGNvcnJlY3QgZGVmYXVsdHMgc2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB0ZXN0TWV0cmljID0gbmV3IE1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdDREsvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTWV0cmljJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbnNTdXBwcmVzc29yID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0xJywge1xuICAgICAgbWV0cmljOiB0ZXN0TWV0cmljLFxuICAgICAgdGhyZXNob2xkOiAxMDAsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMyxcbiAgICB9KTtcblxuXG4gICAgY29uc3QgYWxhcm1SdWxlID0gQWxhcm1SdWxlLmZyb21Cb29sZWFuKHRydWUpO1xuXG4gICAgbmV3IENvbXBvc2l0ZUFsYXJtKHN0YWNrLCAnQ29tcG9zaXRlQWxhcm0nLCB7XG4gICAgICBhbGFybVJ1bGUsXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvcixcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkNvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgQWxhcm1OYW1lOiAnQ29tcG9zaXRlQWxhcm0nLFxuICAgICAgQWN0aW9uc1N1cHByZXNzb3I6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0FsYXJtMUY5MDA5RDcxJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBBY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZDogNjAsXG4gICAgICBBY3Rpb25zU3VwcHJlc3NvcldhaXRQZXJpb2Q6IDYwLFxuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=