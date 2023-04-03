"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class LogsMetrics {
    static incomingLogEventsSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'IncomingLogEvents',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static incomingBytesSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'IncomingBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static deliveryErrorsSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'DeliveryErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static deliveryThrottlingSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'DeliveryThrottling',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static forwardedBytesSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'ForwardedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static forwardedLogEventsSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'ForwardedLogEvents',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static throttleCountSum(dimensions) {
        return {
            namespace: 'AWS/Logs',
            metricName: 'ThrottleCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.LogsMetrics = LogsMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsV0FBVztJQUNmLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFvQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBb0M7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFpRjtRQUMvRyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBaUY7UUFDbkgsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQWlGO1FBQy9HLE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFpRjtRQUNuSCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBaUY7UUFDOUcsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBekRELGtDQXlEQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgTG9nc01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGluY29taW5nTG9nRXZlbnRzU3VtKGRpbWVuc2lvbnM6IHsgTG9nR3JvdXBOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTG9ncycsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5jb21pbmdMb2dFdmVudHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGluY29taW5nQnl0ZXNTdW0oZGltZW5zaW9uczogeyBMb2dHcm91cE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Mb2dzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJbmNvbWluZ0J5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkZWxpdmVyeUVycm9yc1N1bShkaW1lbnNpb25zOiB7IERlc3RpbmF0aW9uVHlwZTogc3RyaW5nLCBGaWx0ZXJOYW1lOiBzdHJpbmcsIExvZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xvZ3MnLFxuICAgICAgbWV0cmljTmFtZTogJ0RlbGl2ZXJ5RXJyb3JzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkZWxpdmVyeVRocm90dGxpbmdTdW0oZGltZW5zaW9uczogeyBEZXN0aW5hdGlvblR5cGU6IHN0cmluZywgRmlsdGVyTmFtZTogc3RyaW5nLCBMb2dHcm91cE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Mb2dzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEZWxpdmVyeVRocm90dGxpbmcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGZvcndhcmRlZEJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgRGVzdGluYXRpb25UeXBlOiBzdHJpbmcsIEZpbHRlck5hbWU6IHN0cmluZywgTG9nR3JvdXBOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTG9ncycsXG4gICAgICBtZXRyaWNOYW1lOiAnRm9yd2FyZGVkQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGZvcndhcmRlZExvZ0V2ZW50c1N1bShkaW1lbnNpb25zOiB7IERlc3RpbmF0aW9uVHlwZTogc3RyaW5nLCBGaWx0ZXJOYW1lOiBzdHJpbmcsIExvZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xvZ3MnLFxuICAgICAgbWV0cmljTmFtZTogJ0ZvcndhcmRlZExvZ0V2ZW50cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGhyb3R0bGVDb3VudFN1bShkaW1lbnNpb25zOiB7IERlc3RpbmF0aW9uVHlwZTogc3RyaW5nLCBGaWx0ZXJOYW1lOiBzdHJpbmcsIExvZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xvZ3MnLFxuICAgICAgbWV0cmljTmFtZTogJ1Rocm90dGxlQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuIl19