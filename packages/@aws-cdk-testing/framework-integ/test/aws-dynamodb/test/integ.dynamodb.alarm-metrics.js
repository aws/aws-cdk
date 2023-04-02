"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStack = void 0;
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new aws_dynamodb_1.Table(this, 'Table', {
            partitionKey: { name: 'metric', type: aws_dynamodb_1.AttributeType.STRING },
        });
        const metricTableThrottled = table.metricThrottledRequestsForOperations({
            operations: [aws_dynamodb_1.Operation.PUT_ITEM, aws_dynamodb_1.Operation.SCAN],
            period: aws_cdk_lib_1.Duration.minutes(1),
        });
        new aws_cloudwatch_1.Alarm(this, 'TableThrottleAlarm', {
            metric: metricTableThrottled,
            evaluationPeriods: 1,
            threshold: 1,
        });
        const metricTableError = table.metricSystemErrorsForOperations({
            operations: [aws_dynamodb_1.Operation.PUT_ITEM, aws_dynamodb_1.Operation.SCAN],
            period: aws_cdk_lib_1.Duration.minutes(1),
        });
        new aws_cloudwatch_1.Alarm(this, 'TableErrorAlarm', {
            metric: metricTableError,
            evaluationPeriods: 1,
            threshold: 1,
        });
    }
}
exports.TestStack = TestStack;
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'alarm-metrics');
new integ_tests_alpha_1.IntegTest(app, 'alarm-metrics-integ', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZHluYW1vZGIuYWxhcm0tbWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmR5bmFtb2RiLmFsYXJtLW1ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0RBQW1EO0FBQ25ELDZDQUErRDtBQUMvRCxrRUFBdUQ7QUFFdkQsMkRBQTJFO0FBRTNFLE1BQWEsU0FBVSxTQUFRLG1CQUFLO0lBQ2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDckMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNLEVBQUU7U0FDN0QsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLENBQUMsb0NBQW9DLENBQUM7WUFDdEUsVUFBVSxFQUFFLENBQUMsd0JBQVMsQ0FBQyxRQUFRLEVBQUUsd0JBQVMsQ0FBQyxJQUFJLENBQUM7WUFDaEQsTUFBTSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUM1QixDQUFDLENBQUM7UUFDSCxJQUFJLHNCQUFLLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3BDLE1BQU0sRUFBRSxvQkFBb0I7WUFDNUIsaUJBQWlCLEVBQUUsQ0FBQztZQUNwQixTQUFTLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FBQztRQUNILE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLCtCQUErQixDQUFDO1lBQzdELFVBQVUsRUFBRSxDQUFDLHdCQUFTLENBQUMsUUFBUSxFQUFFLHdCQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELE1BQU0sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxzQkFBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNqQyxNQUFNLEVBQUUsZ0JBQWdCO1lBQ3hCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsU0FBUyxFQUFFLENBQUM7U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExQkQsOEJBMEJDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBRWxELElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUU7SUFDeEMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFsYXJtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgQXBwLCBEdXJhdGlvbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIE9wZXJhdGlvbiwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuXG5leHBvcnQgY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdUYWJsZScsIHtcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnbWV0cmljJywgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICB9KTtcbiAgICBjb25zdCBtZXRyaWNUYWJsZVRocm90dGxlZCA9IHRhYmxlLm1ldHJpY1Rocm90dGxlZFJlcXVlc3RzRm9yT3BlcmF0aW9ucyh7XG4gICAgICBvcGVyYXRpb25zOiBbT3BlcmF0aW9uLlBVVF9JVEVNLCBPcGVyYXRpb24uU0NBTl0sXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgfSk7XG4gICAgbmV3IEFsYXJtKHRoaXMsICdUYWJsZVRocm90dGxlQWxhcm0nLCB7XG4gICAgICBtZXRyaWM6IG1ldHJpY1RhYmxlVGhyb3R0bGVkLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgfSk7XG4gICAgY29uc3QgbWV0cmljVGFibGVFcnJvciA9IHRhYmxlLm1ldHJpY1N5c3RlbUVycm9yc0Zvck9wZXJhdGlvbnMoe1xuICAgICAgb3BlcmF0aW9uczogW09wZXJhdGlvbi5QVVRfSVRFTSwgT3BlcmF0aW9uLlNDQU5dLFxuICAgICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDEpLFxuICAgIH0pO1xuICAgIG5ldyBBbGFybSh0aGlzLCAnVGFibGVFcnJvckFsYXJtJywge1xuICAgICAgbWV0cmljOiBtZXRyaWNUYWJsZUVycm9yLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2FsYXJtLW1ldHJpY3MnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdhbGFybS1tZXRyaWNzLWludGVnJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7Il19