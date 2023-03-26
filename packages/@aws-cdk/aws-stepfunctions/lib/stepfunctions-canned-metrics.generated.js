"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatesMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class StatesMetrics {
    static executionTimeAverage(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static executionsFailedSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionsFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static executionsSucceededSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionsSucceeded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static executionsThrottledSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionsThrottled',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static executionsAbortedSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionsAborted',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static executionsTimedOutSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ExecutionsTimedOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activityTimeAverage(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivityTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activitiesSucceededSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesSucceeded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activitiesFailedSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activitiesHeartbeatTimedOutSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesHeartbeatTimedOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activitiesScheduledSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesScheduled',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activitiesStartedSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesStarted',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activitiesTimedOutSum(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivitiesTimedOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static activityRunTimeAverage(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivityRunTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activityScheduleTimeAverage(dimensions) {
        return {
            namespace: 'AWS/States',
            metricName: 'ActivityScheduleTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.StatesMetrics = StatesMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcGZ1bmN0aW9ucy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGVwZnVuY3Rpb25zLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsYUFBYTtJQUNqQixNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBdUM7UUFDeEUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUF1QztRQUN2RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBdUM7UUFDMUUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQXVDO1FBQzFFLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUF1QztRQUN4RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBdUM7UUFDekUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQW1DO1FBQ25FLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBbUM7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQW1DO1FBQ25FLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxVQUFtQztRQUM5RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLDZCQUE2QjtZQUN6QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBbUM7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFtQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBbUM7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDJCQUEyQixDQUFDLFVBQW1DO1FBQzNFLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsc0JBQXNCO1lBQ2xDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBekhELHNDQXlIQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgU3RhdGVzTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgZXhlY3V0aW9uVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBTdGF0ZU1hY2hpbmVBcm46IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0V4ZWN1dGlvblRpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBleGVjdXRpb25zRmFpbGVkU3VtKGRpbWVuc2lvbnM6IHsgU3RhdGVNYWNoaW5lQXJuOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFeGVjdXRpb25zRmFpbGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBleGVjdXRpb25zU3VjY2VlZGVkU3VtKGRpbWVuc2lvbnM6IHsgU3RhdGVNYWNoaW5lQXJuOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFeGVjdXRpb25zU3VjY2VlZGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBleGVjdXRpb25zVGhyb3R0bGVkU3VtKGRpbWVuc2lvbnM6IHsgU3RhdGVNYWNoaW5lQXJuOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFeGVjdXRpb25zVGhyb3R0bGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBleGVjdXRpb25zQWJvcnRlZFN1bShkaW1lbnNpb25zOiB7IFN0YXRlTWFjaGluZUFybjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnRXhlY3V0aW9uc0Fib3J0ZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGV4ZWN1dGlvbnNUaW1lZE91dFN1bShkaW1lbnNpb25zOiB7IFN0YXRlTWFjaGluZUFybjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnRXhlY3V0aW9uc1RpbWVkT3V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3Rpdml0eVRpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQWN0aXZpdHlBcm46IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0FjdGl2aXR5VGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFjdGl2aXRpZXNTdWNjZWVkZWRTdW0oZGltZW5zaW9uczogeyBBY3Rpdml0eUFybjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZpdGllc1N1Y2NlZWRlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZpdGllc0ZhaWxlZFN1bShkaW1lbnNpb25zOiB7IEFjdGl2aXR5QXJuOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3Rpdml0aWVzRmFpbGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3Rpdml0aWVzSGVhcnRiZWF0VGltZWRPdXRTdW0oZGltZW5zaW9uczogeyBBY3Rpdml0eUFybjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZpdGllc0hlYXJ0YmVhdFRpbWVkT3V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3Rpdml0aWVzU2NoZWR1bGVkU3VtKGRpbWVuc2lvbnM6IHsgQWN0aXZpdHlBcm46IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0FjdGl2aXRpZXNTY2hlZHVsZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFjdGl2aXRpZXNTdGFydGVkU3VtKGRpbWVuc2lvbnM6IHsgQWN0aXZpdHlBcm46IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0FjdGl2aXRpZXNTdGFydGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3Rpdml0aWVzVGltZWRPdXRTdW0oZGltZW5zaW9uczogeyBBY3Rpdml0eUFybjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZpdGllc1RpbWVkT3V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3Rpdml0eVJ1blRpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQWN0aXZpdHlBcm46IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0FjdGl2aXR5UnVuVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFjdGl2aXR5U2NoZWR1bGVUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IEFjdGl2aXR5QXJuOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3Rpdml0eVNjaGVkdWxlVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuIl19