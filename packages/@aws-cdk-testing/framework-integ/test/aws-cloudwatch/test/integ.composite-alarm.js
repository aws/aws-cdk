"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
class CompositeAlarmIntegrationTest extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const testMetric = new aws_cloudwatch_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const alarm1 = new aws_cloudwatch_1.Alarm(this, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        const alarm2 = new aws_cloudwatch_1.Alarm(this, 'Alarm2', {
            metric: testMetric,
            threshold: 1000,
            evaluationPeriods: 3,
        });
        const alarm3 = new aws_cloudwatch_1.Alarm(this, 'Alarm3', {
            metric: testMetric,
            threshold: 10000,
            evaluationPeriods: 3,
        });
        const alarm4 = new aws_cloudwatch_1.Alarm(this, 'Alarm4', {
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarm5 = new aws_cloudwatch_1.Alarm(this, 'Alarm5', {
            alarmName: 'Alarm with space in name',
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarmRule = aws_cloudwatch_1.AlarmRule.anyOf(aws_cloudwatch_1.AlarmRule.allOf(aws_cloudwatch_1.AlarmRule.anyOf(alarm1, aws_cloudwatch_1.AlarmRule.fromAlarm(alarm2, aws_cloudwatch_1.AlarmState.OK), alarm3, alarm5), aws_cloudwatch_1.AlarmRule.not(aws_cloudwatch_1.AlarmRule.fromAlarm(alarm4, aws_cloudwatch_1.AlarmState.INSUFFICIENT_DATA))), aws_cloudwatch_1.AlarmRule.fromBoolean(false));
        new aws_cloudwatch_1.CompositeAlarm(this, 'CompositeAlarm', {
            alarmRule,
            actionsSuppressor: alarm5,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-composite-alarm', {
    testCases: [new CompositeAlarmIntegrationTest(app, 'CompositeAlarmIntegrationTest')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29tcG9zaXRlLWFsYXJtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29tcG9zaXRlLWFsYXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXFEO0FBQ3JELGtFQUF1RDtBQUN2RCwrREFBa0c7QUFFbEcsTUFBTSw2QkFBOEIsU0FBUSxtQkFBSztJQUUvQyxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBTSxDQUFDO1lBQzVCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN2QyxNQUFNLEVBQUUsVUFBVTtZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBSyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDdkMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN2QyxNQUFNLEVBQUUsVUFBVTtZQUNsQixTQUFTLEVBQUUsTUFBTTtZQUNqQixpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksc0JBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSwwQkFBMEI7WUFDckMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsU0FBUyxFQUFFLE1BQU07WUFDakIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRywwQkFBUyxDQUFDLEtBQUssQ0FDL0IsMEJBQVMsQ0FBQyxLQUFLLENBQ2IsMEJBQVMsQ0FBQyxLQUFLLENBQ2IsTUFBTSxFQUNOLDBCQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSwyQkFBVSxDQUFDLEVBQUUsQ0FBQyxFQUMxQyxNQUFNLEVBQ04sTUFBTSxDQUNQLEVBQ0QsMEJBQVMsQ0FBQyxHQUFHLENBQUMsMEJBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLDJCQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUN6RSxFQUNELDBCQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUM3QixDQUFDO1FBRUYsSUFBSSwrQkFBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6QyxTQUFTO1lBQ1QsaUJBQWlCLEVBQUUsTUFBTTtTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUY7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixFQUFFO0lBQzlDLFNBQVMsRUFBRSxDQUFDLElBQUksNkJBQTZCLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7Q0FDckYsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IEFsYXJtLCBBbGFybVJ1bGUsIEFsYXJtU3RhdGUsIENvbXBvc2l0ZUFsYXJtLCBNZXRyaWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5cbmNsYXNzIENvbXBvc2l0ZUFsYXJtSW50ZWdyYXRpb25UZXN0IGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdGVzdE1ldHJpYyA9IG5ldyBNZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQ0RLL1Rlc3QnLFxuICAgICAgbWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTEgPSBuZXcgQWxhcm0odGhpcywgJ0FsYXJtMScsIHtcbiAgICAgIG1ldHJpYzogdGVzdE1ldHJpYyxcbiAgICAgIHRocmVzaG9sZDogMTAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTIgPSBuZXcgQWxhcm0odGhpcywgJ0FsYXJtMicsIHtcbiAgICAgIG1ldHJpYzogdGVzdE1ldHJpYyxcbiAgICAgIHRocmVzaG9sZDogMTAwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm0zID0gbmV3IEFsYXJtKHRoaXMsICdBbGFybTMnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTQgPSBuZXcgQWxhcm0odGhpcywgJ0FsYXJtNCcsIHtcbiAgICAgIG1ldHJpYzogdGVzdE1ldHJpYyxcbiAgICAgIHRocmVzaG9sZDogMTAwMDAwLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGFybTUgPSBuZXcgQWxhcm0odGhpcywgJ0FsYXJtNScsIHtcbiAgICAgIGFsYXJtTmFtZTogJ0FsYXJtIHdpdGggc3BhY2UgaW4gbmFtZScsXG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm1SdWxlID0gQWxhcm1SdWxlLmFueU9mKFxuICAgICAgQWxhcm1SdWxlLmFsbE9mKFxuICAgICAgICBBbGFybVJ1bGUuYW55T2YoXG4gICAgICAgICAgYWxhcm0xLFxuICAgICAgICAgIEFsYXJtUnVsZS5mcm9tQWxhcm0oYWxhcm0yLCBBbGFybVN0YXRlLk9LKSxcbiAgICAgICAgICBhbGFybTMsXG4gICAgICAgICAgYWxhcm01LFxuICAgICAgICApLFxuICAgICAgICBBbGFybVJ1bGUubm90KEFsYXJtUnVsZS5mcm9tQWxhcm0oYWxhcm00LCBBbGFybVN0YXRlLklOU1VGRklDSUVOVF9EQVRBKSksXG4gICAgICApLFxuICAgICAgQWxhcm1SdWxlLmZyb21Cb29sZWFuKGZhbHNlKSxcbiAgICApO1xuXG4gICAgbmV3IENvbXBvc2l0ZUFsYXJtKHRoaXMsICdDb21wb3NpdGVBbGFybScsIHtcbiAgICAgIGFsYXJtUnVsZSxcbiAgICAgIGFjdGlvbnNTdXBwcmVzc29yOiBhbGFybTUsXG4gICAgfSk7XG4gIH1cblxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2RrLWludGVnLWNvbXBvc2l0ZS1hbGFybScsIHtcbiAgdGVzdENhc2VzOiBbbmV3IENvbXBvc2l0ZUFsYXJtSW50ZWdyYXRpb25UZXN0KGFwcCwgJ0NvbXBvc2l0ZUFsYXJtSW50ZWdyYXRpb25UZXN0JyldLFxufSk7XG4iXX0=