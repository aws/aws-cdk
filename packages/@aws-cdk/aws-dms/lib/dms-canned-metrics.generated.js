"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMSMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class DMSMetrics {
    static cdcLatencyTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCLatencyTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcLatencySourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCLatencySource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static availableMemoryAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'AvailableMemory',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cdcChangesDiskTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCChangesDiskTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcChangesMemorySourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCChangesMemorySource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcChangesMemoryTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCChangesMemoryTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcIncomingChangesSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCIncomingChanges',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcThroughputBandwidthSourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCThroughputBandwidthSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcThroughputBandwidthTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCThroughputBandwidthTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcThroughputRowsSourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCThroughputRowsSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cdcThroughputRowsTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CDCThroughputRowsTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cpuAllocatedSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CPUAllocated',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'CPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static freeMemoryAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'FreeMemory',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static fullLoadThroughputBandwidthSourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'FullLoadThroughputBandwidthSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static fullLoadThroughputBandwidthTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'FullLoadThroughputBandwidthTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static fullLoadThroughputRowsSourceSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'FullLoadThroughputRowsSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static fullLoadThroughputRowsTargetSum(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'FullLoadThroughputRowsTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static memoryAllocatedAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'MemoryAllocated',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryUsageAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'MemoryUsage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static swapUsageAverage(dimensions) {
        return {
            namespace: 'AWS/DMS',
            metricName: 'SwapUsage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.DMSMetrics = DMSMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG1zLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRtcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBcUQ7UUFDckYsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQXFEO1FBQ3JGLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFxRDtRQUN4RixPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBcUQ7UUFDekYsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQXFEO1FBQzNGLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxL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Q0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDhCQUE4QjtZQUMxQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBcUQ7UUFDeEYsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQXFEO1FBQ3BGLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsYUFBYTtZQUN6QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBcUQ7UUFDbEYsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBektELGdDQXlLQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgRE1TTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgY2RjTGF0ZW5jeVRhcmdldFN1bShkaW1lbnNpb25zOiB7IFJlcGxpY2F0aW9uSW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRE1TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDRENMYXRlbmN5VGFyZ2V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjZGNMYXRlbmN5U291cmNlU3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0NEQ0xhdGVuY3lTb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGF2YWlsYWJsZU1lbW9yeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQXZhaWxhYmxlTWVtb3J5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2RjQ2hhbmdlc0Rpc2tUYXJnZXRTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ0RDQ2hhbmdlc0Rpc2tUYXJnZXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNkY0NoYW5nZXNNZW1vcnlTb3VyY2VTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ0RDQ2hhbmdlc01lbW9yeVNvdXJjZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2RjQ2hhbmdlc01lbW9yeVRhcmdldFN1bShkaW1lbnNpb25zOiB7IFJlcGxpY2F0aW9uSW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRE1TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDRENDaGFuZ2VzTWVtb3J5VGFyZ2V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjZGNJbmNvbWluZ0NoYW5nZXNTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ0RDSW5jb21pbmdDaGFuZ2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjZGNUaHJvdWdocHV0QmFuZHdpZHRoU291cmNlU3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0NEQ1Rocm91Z2hwdXRCYW5kd2lkdGhTb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNkY1Rocm91Z2hwdXRCYW5kd2lkdGhUYXJnZXRTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ0RDVGhyb3VnaHB1dEJhbmR3aWR0aFRhcmdldCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2RjVGhyb3VnaHB1dFJvd3NTb3VyY2VTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ0RDVGhyb3VnaHB1dFJvd3NTb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNkY1Rocm91Z2hwdXRSb3dzVGFyZ2V0U3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0NEQ1Rocm91Z2hwdXRSb3dzVGFyZ2V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVBbGxvY2F0ZWRTdW0oZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVQWxsb2NhdGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVVXRpbGl6YXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBmcmVlTWVtb3J5QXZlcmFnZShkaW1lbnNpb25zOiB7IFJlcGxpY2F0aW9uSW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRE1TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdGcmVlTWVtb3J5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZnVsbExvYWRUaHJvdWdocHV0QmFuZHdpZHRoU291cmNlU3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0Z1bGxMb2FkVGhyb3VnaHB1dEJhbmR3aWR0aFNvdXJjZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZnVsbExvYWRUaHJvdWdocHV0QmFuZHdpZHRoVGFyZ2V0U3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0Z1bGxMb2FkVGhyb3VnaHB1dEJhbmR3aWR0aFRhcmdldCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZnVsbExvYWRUaHJvdWdocHV0Um93c1NvdXJjZVN1bShkaW1lbnNpb25zOiB7IFJlcGxpY2F0aW9uSW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRE1TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdGdWxsTG9hZFRocm91Z2hwdXRSb3dzU291cmNlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBmdWxsTG9hZFRocm91Z2hwdXRSb3dzVGFyZ2V0U3VtKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ0Z1bGxMb2FkVGhyb3VnaHB1dFJvd3NUYXJnZXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1lbW9yeUFsbG9jYXRlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBSZXBsaWNhdGlvbkluc3RhbmNlSWRlbnRpZmllcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RNUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVtb3J5QWxsb2NhdGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtb3J5VXNhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgUmVwbGljYXRpb25JbnN0YW5jZUlkZW50aWZpZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9ETVMnLFxuICAgICAgbWV0cmljTmFtZTogJ01lbW9yeVVzYWdlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3dhcFVzYWdlQXZlcmFnZShkaW1lbnNpb25zOiB7IFJlcGxpY2F0aW9uSW5zdGFuY2VJZGVudGlmaWVyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRE1TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTd2FwVXNhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==