"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const cdk = require("@aws-cdk/core");
const util_1 = require("./util");
const appscaling = require("../lib");
describe('target tracking', () => {
    test('test setup target tracking on predefined metric', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const target = util_1.createScalableTarget(stack);
        // WHEN
        target.scaleToTrackMetric('Tracking', {
            predefinedMetric: appscaling.PredefinedMetric.EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION,
            targetValue: 30,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
            PolicyType: 'TargetTrackingScaling',
            TargetTrackingScalingPolicyConfiguration: {
                PredefinedMetricSpecification: { PredefinedMetricType: 'EC2SpotFleetRequestAverageCPUUtilization' },
                TargetValue: 30,
            },
        });
    });
    test('test setup target tracking on predefined metric for lambda', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const target = util_1.createScalableTarget(stack);
        // WHEN
        target.scaleToTrackMetric('Tracking', {
            predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
            targetValue: 0.9,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
            PolicyType: 'TargetTrackingScaling',
            TargetTrackingScalingPolicyConfiguration: {
                PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
                TargetValue: 0.9,
            },
        });
    });
    test('test setup target tracking on predefined metric for DYNAMODB_WRITE_CAPACITY_UTILIZATION', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const target = util_1.createScalableTarget(stack);
        // WHEN
        target.scaleToTrackMetric('Tracking', {
            predefinedMetric: appscaling.PredefinedMetric.DYNAMODB_WRITE_CAPACITY_UTILIZATION,
            targetValue: 0.9,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
            TargetTrackingScalingPolicyConfiguration: {
                PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
                TargetValue: 0.9,
            },
        });
    });
    test('test setup target tracking on custom metric', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const target = util_1.createScalableTarget(stack);
        // WHEN
        target.scaleToTrackMetric('Tracking', {
            customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
            targetValue: 30,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
            PolicyType: 'TargetTrackingScaling',
            TargetTrackingScalingPolicyConfiguration: {
                CustomizedMetricSpecification: {
                    MetricName: 'Metric',
                    Namespace: 'Test',
                    Statistic: 'Average',
                },
                TargetValue: 30,
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0LXRyYWNraW5nLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXJnZXQtdHJhY2tpbmcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxzREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLGlDQUE4QztBQUM5QyxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1FBQzNELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLE1BQU0sR0FBRywyQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQyxPQUFPO1FBQ1AsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRTtZQUNwQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsOENBQThDO1lBQzVGLFdBQVcsRUFBRSxFQUFFO1NBQ2hCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0Q0FBNEMsRUFBRTtZQUM1RixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLHdDQUF3QyxFQUFFO2dCQUN4Qyw2QkFBNkIsRUFBRSxFQUFFLG9CQUFvQixFQUFFLDBDQUEwQyxFQUFFO2dCQUNuRyxXQUFXLEVBQUUsRUFBRTthQUNoQjtTQUVGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtRQUN0RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsMkJBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUU7WUFDcEMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLDBDQUEwQztZQUN4RixXQUFXLEVBQUUsR0FBRztTQUNqQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNENBQTRDLEVBQUU7WUFDNUYsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyx3Q0FBd0MsRUFBRTtnQkFDeEMsNkJBQTZCLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSx5Q0FBeUMsRUFBRTtnQkFDbEcsV0FBVyxFQUFFLEdBQUc7YUFDakI7U0FFRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5RkFBeUYsRUFBRSxHQUFHLEVBQUU7UUFDbkcsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sTUFBTSxHQUFHLDJCQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNDLE9BQU87UUFDUCxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFO1lBQ3BDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxtQ0FBbUM7WUFDakYsV0FBVyxFQUFFLEdBQUc7U0FDakIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRDQUE0QyxFQUFFO1lBQzVGLHdDQUF3QyxFQUFFO2dCQUN4Qyw2QkFBNkIsRUFBRSxFQUFFLG9CQUFvQixFQUFFLGtDQUFrQyxFQUFFO2dCQUMzRixXQUFXLEVBQUUsR0FBRzthQUNqQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsMkJBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUU7WUFDcEMsWUFBWSxFQUFFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ2hGLFdBQVcsRUFBRSxFQUFFO1NBQ2hCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0Q0FBNEMsRUFBRTtZQUM1RixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLHdDQUF3QyxFQUFFO2dCQUN4Qyw2QkFBNkIsRUFBRTtvQkFDN0IsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLFNBQVMsRUFBRSxNQUFNO29CQUNqQixTQUFTLEVBQUUsU0FBUztpQkFDckI7Z0JBQ0QsV0FBVyxFQUFFLEVBQUU7YUFDaEI7U0FFRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlU2NhbGFibGVUYXJnZXQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgYXBwc2NhbGluZyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgndGFyZ2V0IHRyYWNraW5nJywgKCkgPT4ge1xuICB0ZXN0KCd0ZXN0IHNldHVwIHRhcmdldCB0cmFja2luZyBvbiBwcmVkZWZpbmVkIG1ldHJpYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhcmdldCA9IGNyZWF0ZVNjYWxhYmxlVGFyZ2V0KHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXJnZXQuc2NhbGVUb1RyYWNrTWV0cmljKCdUcmFja2luZycsIHtcbiAgICAgIHByZWRlZmluZWRNZXRyaWM6IGFwcHNjYWxpbmcuUHJlZGVmaW5lZE1ldHJpYy5FQzJfU1BPVF9GTEVFVF9SRVFVRVNUX0FWRVJBR0VfQ1BVX1VUSUxJWkFUSU9OLFxuICAgICAgdGFyZ2V0VmFsdWU6IDMwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcGxpY2F0aW9uQXV0b1NjYWxpbmc6OlNjYWxpbmdQb2xpY3knLCB7XG4gICAgICBQb2xpY3lUeXBlOiAnVGFyZ2V0VHJhY2tpbmdTY2FsaW5nJyxcbiAgICAgIFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUHJlZGVmaW5lZE1ldHJpY1NwZWNpZmljYXRpb246IHsgUHJlZGVmaW5lZE1ldHJpY1R5cGU6ICdFQzJTcG90RmxlZXRSZXF1ZXN0QXZlcmFnZUNQVVV0aWxpemF0aW9uJyB9LFxuICAgICAgICBUYXJnZXRWYWx1ZTogMzAsXG4gICAgICB9LFxuXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd0ZXN0IHNldHVwIHRhcmdldCB0cmFja2luZyBvbiBwcmVkZWZpbmVkIG1ldHJpYyBmb3IgbGFtYmRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gY3JlYXRlU2NhbGFibGVUYXJnZXQoc3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhcmdldC5zY2FsZVRvVHJhY2tNZXRyaWMoJ1RyYWNraW5nJywge1xuICAgICAgcHJlZGVmaW5lZE1ldHJpYzogYXBwc2NhbGluZy5QcmVkZWZpbmVkTWV0cmljLkxBTUJEQV9QUk9WSVNJT05FRF9DT05DVVJSRU5DWV9VVElMSVpBVElPTixcbiAgICAgIHRhcmdldFZhbHVlOiAwLjksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGluZ1BvbGljeScsIHtcbiAgICAgIFBvbGljeVR5cGU6ICdUYXJnZXRUcmFja2luZ1NjYWxpbmcnLFxuICAgICAgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBQcmVkZWZpbmVkTWV0cmljU3BlY2lmaWNhdGlvbjogeyBQcmVkZWZpbmVkTWV0cmljVHlwZTogJ0xhbWJkYVByb3Zpc2lvbmVkQ29uY3VycmVuY3lVdGlsaXphdGlvbicgfSxcbiAgICAgICAgVGFyZ2V0VmFsdWU6IDAuOSxcbiAgICAgIH0sXG5cbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3Qgc2V0dXAgdGFyZ2V0IHRyYWNraW5nIG9uIHByZWRlZmluZWQgbWV0cmljIGZvciBEWU5BTU9EQl9XUklURV9DQVBBQ0lUWV9VVElMSVpBVElPTicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhcmdldCA9IGNyZWF0ZVNjYWxhYmxlVGFyZ2V0KHN0YWNrKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXJnZXQuc2NhbGVUb1RyYWNrTWV0cmljKCdUcmFja2luZycsIHtcbiAgICAgIHByZWRlZmluZWRNZXRyaWM6IGFwcHNjYWxpbmcuUHJlZGVmaW5lZE1ldHJpYy5EWU5BTU9EQl9XUklURV9DQVBBQ0lUWV9VVElMSVpBVElPTixcbiAgICAgIHRhcmdldFZhbHVlOiAwLjksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwbGljYXRpb25BdXRvU2NhbGluZzo6U2NhbGluZ1BvbGljeScsIHtcbiAgICAgIFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUHJlZGVmaW5lZE1ldHJpY1NwZWNpZmljYXRpb246IHsgUHJlZGVmaW5lZE1ldHJpY1R5cGU6ICdEeW5hbW9EQldyaXRlQ2FwYWNpdHlVdGlsaXphdGlvbicgfSxcbiAgICAgICAgVGFyZ2V0VmFsdWU6IDAuOSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3Qgc2V0dXAgdGFyZ2V0IHRyYWNraW5nIG9uIGN1c3RvbSBtZXRyaWMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXJnZXQgPSBjcmVhdGVTY2FsYWJsZVRhcmdldChzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFyZ2V0LnNjYWxlVG9UcmFja01ldHJpYygnVHJhY2tpbmcnLCB7XG4gICAgICBjdXN0b21NZXRyaWM6IG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7IG5hbWVzcGFjZTogJ1Rlc3QnLCBtZXRyaWNOYW1lOiAnTWV0cmljJyB9KSxcbiAgICAgIHRhcmdldFZhbHVlOiAzMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBsaWNhdGlvbkF1dG9TY2FsaW5nOjpTY2FsaW5nUG9saWN5Jywge1xuICAgICAgUG9saWN5VHlwZTogJ1RhcmdldFRyYWNraW5nU2NhbGluZycsXG4gICAgICBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3lDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEN1c3RvbWl6ZWRNZXRyaWNTcGVjaWZpY2F0aW9uOiB7XG4gICAgICAgICAgTWV0cmljTmFtZTogJ01ldHJpYycsXG4gICAgICAgICAgTmFtZXNwYWNlOiAnVGVzdCcsXG4gICAgICAgICAgU3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgICAgIH0sXG4gICAgICAgIFRhcmdldFZhbHVlOiAzMCxcbiAgICAgIH0sXG5cbiAgICB9KTtcblxuXG4gIH0pO1xufSk7XG4iXX0=