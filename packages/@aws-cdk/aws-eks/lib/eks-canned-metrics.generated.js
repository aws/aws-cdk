"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInsightsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ContainerInsightsMetrics {
    static nodeCpuLimitSum(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_cpu_limit',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static nodeCpuUsageTotalSum(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_cpu_usage_total',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static nodeMemoryLimitSum(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_memory_limit',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static nodeMemoryWorkingSetSum(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_memory_working_set',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static podNetworkRxBytesAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'pod_network_rx_bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static podNetworkTxBytesAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'pod_network_tx_bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static nodeNetworkTotalBytesAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_network_total_bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static clusterFailedNodeCountAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'cluster_failed_node_count',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static nodeFilesystemUtilizationp90(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'node_filesystem_utilization',
            dimensionsMap: dimensions,
            statistic: 'p90',
        };
    }
    static clusterNodeCountAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'cluster_node_count',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static podCpuUtilizationAverage(dimensions) {
        return {
            namespace: 'ContainerInsights',
            metricName: 'pod_cpu_utilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ContainerInsightsMetrics = ContainerInsightsMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVrcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLHdCQUF3QjtJQUM1QixNQUFNLENBQUMsZUFBZSxDQUFDLFVBQW1DO1FBQy9ELE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQW1DO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQW1DO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSx5QkFBeUI7WUFDckMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQW1DO1FBQ3hFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQW1DO1FBQ3hFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDRCQUE0QixDQUFDLFVBQW1DO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSwwQkFBMEI7WUFDdEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDZCQUE2QixDQUFDLFVBQW1DO1FBQzdFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSwyQkFBMkI7WUFDdkMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDRCQUE0QixDQUFDLFVBQW1DO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSw2QkFBNkI7WUFDekMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQW1DO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQW1DO1FBQ3hFLE9BQU87WUFDTCxTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUF6RkQsNERBeUZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXJJbnNpZ2h0c01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIG5vZGVDcHVMaW1pdFN1bShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDb250YWluZXJJbnNpZ2h0cycsXG4gICAgICBtZXRyaWNOYW1lOiAnbm9kZV9jcHVfbGltaXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5vZGVDcHVVc2FnZVRvdGFsU3VtKGRpbWVuc2lvbnM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NvbnRhaW5lckluc2lnaHRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdub2RlX2NwdV91c2FnZV90b3RhbCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbm9kZU1lbW9yeUxpbWl0U3VtKGRpbWVuc2lvbnM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NvbnRhaW5lckluc2lnaHRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdub2RlX21lbW9yeV9saW1pdCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbm9kZU1lbW9yeVdvcmtpbmdTZXRTdW0oZGltZW5zaW9uczogeyBDbHVzdGVyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ29udGFpbmVySW5zaWdodHMnLFxuICAgICAgbWV0cmljTmFtZTogJ25vZGVfbWVtb3J5X3dvcmtpbmdfc2V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwb2ROZXR3b3JrUnhCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBDbHVzdGVyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ29udGFpbmVySW5zaWdodHMnLFxuICAgICAgbWV0cmljTmFtZTogJ3BvZF9uZXR3b3JrX3J4X2J5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcG9kTmV0d29ya1R4Qnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NvbnRhaW5lckluc2lnaHRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdwb2RfbmV0d29ya190eF9ieXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5vZGVOZXR3b3JrVG90YWxCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBDbHVzdGVyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ29udGFpbmVySW5zaWdodHMnLFxuICAgICAgbWV0cmljTmFtZTogJ25vZGVfbmV0d29ya190b3RhbF9ieXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNsdXN0ZXJGYWlsZWROb2RlQ291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NvbnRhaW5lckluc2lnaHRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdjbHVzdGVyX2ZhaWxlZF9ub2RlX2NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbm9kZUZpbGVzeXN0ZW1VdGlsaXphdGlvbnA5MChkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDb250YWluZXJJbnNpZ2h0cycsXG4gICAgICBtZXRyaWNOYW1lOiAnbm9kZV9maWxlc3lzdGVtX3V0aWxpemF0aW9uJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdwOTAnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjbHVzdGVyTm9kZUNvdW50QXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDb250YWluZXJJbnNpZ2h0cycsXG4gICAgICBtZXRyaWNOYW1lOiAnY2x1c3Rlcl9ub2RlX2NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcG9kQ3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NvbnRhaW5lckluc2lnaHRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdwb2RfY3B1X3V0aWxpemF0aW9uJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=