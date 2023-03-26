"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAXMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class DAXMetrics {
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'CPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static failedRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'FailedRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static batchGetItemRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'BatchGetItemRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static errorRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'ErrorRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static estimatedDbSizeAverage(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'EstimatedDbSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static evictedSizeAverage(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'EvictedSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static faultRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'FaultRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getItemRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'GetItemRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static itemCacheHitsSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'ItemCacheHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static itemCacheMissesSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'ItemCacheMisses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static queryCacheHitsSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'QueryCacheHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static queryRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'QueryRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static scanCacheHitsSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'ScanCacheHits',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/DAX',
            metricName: 'TotalRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.DAXMetrics = DAXMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF4LWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRheC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBZ0I7UUFDbEQsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQWdCO1FBQ2xELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxVQUFnQjtRQUN4RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBZ0I7UUFDakQsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQWdCO1FBQ25ELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFnQjtRQUMvQyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWdCO1FBQ2pELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFnQjtRQUNuRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBZ0I7UUFDN0MsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFnQjtRQUMvQyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBZ0I7UUFDOUMsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWdCO1FBQ2pELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFnQjtRQUM3QyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWdCO1FBQ2pELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBakhELGdDQWlIQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgREFYTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RBWCcsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVVXRpbGl6YXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBmYWlsZWRSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdGYWlsZWRSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJhdGNoR2V0SXRlbVJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7ICB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9EQVgnLFxuICAgICAgbWV0cmljTmFtZTogJ0JhdGNoR2V0SXRlbVJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZXJyb3JSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFcnJvclJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZXN0aW1hdGVkRGJTaXplQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9EQVgnLFxuICAgICAgbWV0cmljTmFtZTogJ0VzdGltYXRlZERiU2l6ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGV2aWN0ZWRTaXplQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9EQVgnLFxuICAgICAgbWV0cmljTmFtZTogJ0V2aWN0ZWRTaXplJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZmF1bHRSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdGYXVsdFJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZ2V0SXRlbVJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7ICB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9EQVgnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldEl0ZW1SZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGl0ZW1DYWNoZUhpdHNTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJdGVtQ2FjaGVIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpdGVtQ2FjaGVNaXNzZXNTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJdGVtQ2FjaGVNaXNzZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHF1ZXJ5Q2FjaGVIaXRzU3VtKGRpbWVuc2lvbnM6IHsgIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RBWCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUXVlcnlDYWNoZUhpdHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHF1ZXJ5UmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IHsgIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0RBWCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUXVlcnlSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNjYW5DYWNoZUhpdHNTdW0oZGltZW5zaW9uczogeyAgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvREFYJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTY2FuQ2FjaGVIaXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbFJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7ICB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9EQVgnLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdGFsUmVxdWVzdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==