"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class InspectorMetrics {
    static totalHealthyAgentsAverage(dimensions) {
        return {
            namespace: 'AWS/Inspector',
            metricName: 'TotalHealthyAgents',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalAssessmentRunsAverage(dimensions) {
        return {
            namespace: 'AWS/Inspector',
            metricName: 'TotalAssessmentRuns',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalMatchingAgentsAverage(dimensions) {
        return {
            namespace: 'AWS/Inspector',
            metricName: 'TotalMatchingAgents',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalFindingsAverage(dimensions) {
        return {
            namespace: 'AWS/Inspector',
            metricName: 'TotalFindings',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.InspectorMetrics = InspectorMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3BlY3Rvci1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBNkU7UUFDbkgsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDBCQUEwQixDQUFDLFVBQTZFO1FBQ3BILE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxVQUE2RTtRQUNwSCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBNkU7UUFDOUcsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBakNELDRDQWlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgSW5zcGVjdG9yTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgdG90YWxIZWFsdGh5QWdlbnRzQXZlcmFnZShkaW1lbnNpb25zOiB7IEFzc2Vzc21lbnRUZW1wbGF0ZUFybjogc3RyaW5nLCBBc3Nlc3NtZW50VGVtcGxhdGVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvSW5zcGVjdG9yJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUb3RhbEhlYWx0aHlBZ2VudHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbEFzc2Vzc21lbnRSdW5zQXZlcmFnZShkaW1lbnNpb25zOiB7IEFzc2Vzc21lbnRUZW1wbGF0ZUFybjogc3RyaW5nLCBBc3Nlc3NtZW50VGVtcGxhdGVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvSW5zcGVjdG9yJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUb3RhbEFzc2Vzc21lbnRSdW5zJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdG90YWxNYXRjaGluZ0FnZW50c0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBc3Nlc3NtZW50VGVtcGxhdGVBcm46IHN0cmluZywgQXNzZXNzbWVudFRlbXBsYXRlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0luc3BlY3RvcicsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxNYXRjaGluZ0FnZW50cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRvdGFsRmluZGluZ3NBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXNzZXNzbWVudFRlbXBsYXRlQXJuOiBzdHJpbmcsIEFzc2Vzc21lbnRUZW1wbGF0ZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9JbnNwZWN0b3InLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdGFsRmluZGluZ3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==