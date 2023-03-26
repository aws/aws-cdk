"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPackageMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class MediaPackageMetrics {
    static egressRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaPackage',
            metricName: 'EgressRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static egressResponseTimeAverage(dimensions) {
        return {
            namespace: 'AWS/MediaPackage',
            metricName: 'EgressResponseTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static egressBytesSum(dimensions) {
        return {
            namespace: 'AWS/MediaPackage',
            metricName: 'EgressBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.MediaPackageMetrics = MediaPackageMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWFwYWNrYWdlLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lZGlhcGFja2FnZS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLG1CQUFtQjtJQUN2QixNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBK0I7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBK0I7UUFDckUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQStCO1FBQzFELE9BQU87WUFDTCxTQUFTLEVBQUUsa0JBQWtCO1lBQzdCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBekJELGtEQXlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgTWVkaWFQYWNrYWdlTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgZWdyZXNzUmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhUGFja2FnZScsXG4gICAgICBtZXRyaWNOYW1lOiAnRWdyZXNzUmVxdWVzdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlZ3Jlc3NSZXNwb25zZVRpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhUGFja2FnZScsXG4gICAgICBtZXRyaWNOYW1lOiAnRWdyZXNzUmVzcG9uc2VUaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZWdyZXNzQnl0ZXNTdW0oZGltZW5zaW9uczogeyBDaGFubmVsOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFQYWNrYWdlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFZ3Jlc3NCeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=