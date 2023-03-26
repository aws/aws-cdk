"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaConvertMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class MediaConvertMetrics {
    static transcodingTimeAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'TranscodingTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static jobsCompletedCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'JobsCompletedCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static _8KOutputDurationAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: '8KOutputDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static audioOutputDurationAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'AudioOutputDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static hdOutputDurationAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'HDOutputDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static jobsErroredCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'JobsErroredCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static sdOutputDurationAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'SDOutputDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static standbyTimeSum(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'StandbyTime',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static uhdOutputDurationAverage(dimensions) {
        return {
            namespace: 'AWS/MediaConvert',
            metricName: 'UHDOutputDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.MediaConvertMetrics = MediaConvertMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWFjb252ZXJ0LWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lZGlhY29udmVydC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLG1CQUFtQjtJQUN2QixNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBNkI7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBNkI7UUFDL0QsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBNkI7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsVUFBNkI7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBNkI7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBNkI7UUFDN0QsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBNkI7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQTZCO1FBQ3hELE9BQU87WUFDTCxTQUFTLEVBQUUsa0JBQWtCO1lBQzdCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUE2QjtRQUNsRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGtCQUFrQjtZQUM3QixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBekVELGtEQXlFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgTWVkaWFDb252ZXJ0TWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgdHJhbnNjb2RpbmdUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFDb252ZXJ0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdUcmFuc2NvZGluZ1RpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBqb2JzQ29tcGxldGVkQ291bnRTdW0oZGltZW5zaW9uczogeyBRdWV1ZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhQ29udmVydCcsXG4gICAgICBtZXRyaWNOYW1lOiAnSm9ic0NvbXBsZXRlZENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBfOEtPdXRwdXREdXJhdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBRdWV1ZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhQ29udmVydCcsXG4gICAgICBtZXRyaWNOYW1lOiAnOEtPdXRwdXREdXJhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGF1ZGlvT3V0cHV0RHVyYXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgUXVldWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUNvbnZlcnQnLFxuICAgICAgbWV0cmljTmFtZTogJ0F1ZGlvT3V0cHV0RHVyYXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBoZE91dHB1dER1cmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFDb252ZXJ0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdIRE91dHB1dER1cmF0aW9uJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgam9ic0Vycm9yZWRDb3VudFN1bShkaW1lbnNpb25zOiB7IFF1ZXVlOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFDb252ZXJ0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdKb2JzRXJyb3JlZENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzZE91dHB1dER1cmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFDb252ZXJ0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdTRE91dHB1dER1cmF0aW9uJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3RhbmRieVRpbWVTdW0oZGltZW5zaW9uczogeyBRdWV1ZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhQ29udmVydCcsXG4gICAgICBtZXRyaWNOYW1lOiAnU3RhbmRieVRpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHVoZE91dHB1dER1cmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFDb252ZXJ0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdVSERPdXRwdXREdXJhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuIl19