"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekognitionMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class RekognitionMetrics {
    static successfulRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'SuccessfulRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static serverErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'ServerErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static detectedFaceCountSum(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'DetectedFaceCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static detectedLabelCountSum(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'DetectedLabelCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static responseTimeAverage(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'ResponseTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static userErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/Rekognition',
            metricName: 'UserErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.RekognitionMetrics = RekognitionMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVrb2duaXRpb24tY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVrb2duaXRpb24tY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSxrQkFBa0I7SUFDdEIsTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQWlDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWlDO1FBQ2pFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWlDO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQWlDO1FBQ25FLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWlDO1FBQ2pFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFpQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBakRELGdEQWlEQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgUmVrb2duaXRpb25NZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBzdWNjZXNzZnVsUmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IHsgT3BlcmF0aW9uOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUmVrb2duaXRpb24nLFxuICAgICAgbWV0cmljTmFtZTogJ1N1Y2Nlc3NmdWxSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNlcnZlckVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9SZWtvZ25pdGlvbicsXG4gICAgICBtZXRyaWNOYW1lOiAnU2VydmVyRXJyb3JDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGV0ZWN0ZWRGYWNlQ291bnRTdW0oZGltZW5zaW9uczogeyBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9SZWtvZ25pdGlvbicsXG4gICAgICBtZXRyaWNOYW1lOiAnRGV0ZWN0ZWRGYWNlQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRldGVjdGVkTGFiZWxDb3VudFN1bShkaW1lbnNpb25zOiB7IE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1Jla29nbml0aW9uJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEZXRlY3RlZExhYmVsQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlc3BvbnNlVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9SZWtvZ25pdGlvbicsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVzcG9uc2VUaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdXNlckVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9SZWtvZ25pdGlvbicsXG4gICAgICBtZXRyaWNOYW1lOiAnVXNlckVycm9yQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuIl19