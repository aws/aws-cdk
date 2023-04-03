"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EFSMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class EFSMetrics {
    static burstCreditBalanceAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'BurstCreditBalance',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static clientConnectionsSum(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'ClientConnections',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static dataReadIoBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'DataReadIOBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static dataWriteIoBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'DataWriteIOBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static metaDataIoBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'MetaDataIOBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static meteredIoBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'MeteredIOBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static percentIoLimitAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'PercentIOLimit',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static permittedThroughputAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'PermittedThroughput',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalIoBytesSum(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'TotalIOBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static storageBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EFS',
            metricName: 'StorageBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.EFSMetrics = EFSMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVmcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBb0M7UUFDMUUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW9DO1FBQ3JFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFvQztRQUN2RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBb0M7UUFDeEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQW9DO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFvQztRQUN0RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBb0M7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDBCQUEwQixDQUFDLFVBQW9DO1FBQzNFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBb0M7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUEwRDtRQUMxRixPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqRkQsZ0NBaUZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBFRlNNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBidXJzdENyZWRpdEJhbGFuY2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRmlsZVN5c3RlbUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUZTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdCdXJzdENyZWRpdEJhbGFuY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjbGllbnRDb25uZWN0aW9uc1N1bShkaW1lbnNpb25zOiB7IEZpbGVTeXN0ZW1JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ2xpZW50Q29ubmVjdGlvbnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRhdGFSZWFkSW9CeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBGaWxlU3lzdGVtSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FRlMnLFxuICAgICAgbWV0cmljTmFtZTogJ0RhdGFSZWFkSU9CeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRhdGFXcml0ZUlvQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRmlsZVN5c3RlbUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUZTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEYXRhV3JpdGVJT0J5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWV0YURhdGFJb0J5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7IEZpbGVTeXN0ZW1JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTWV0YURhdGFJT0J5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWV0ZXJlZElvQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRmlsZVN5c3RlbUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUZTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXRlcmVkSU9CeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBlcmNlbnRJb0xpbWl0QXZlcmFnZShkaW1lbnNpb25zOiB7IEZpbGVTeXN0ZW1JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnUGVyY2VudElPTGltaXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwZXJtaXR0ZWRUaHJvdWdocHV0QXZlcmFnZShkaW1lbnNpb25zOiB7IEZpbGVTeXN0ZW1JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnUGVybWl0dGVkVGhyb3VnaHB1dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRvdGFsSW9CeXRlc1N1bShkaW1lbnNpb25zOiB7IEZpbGVTeXN0ZW1JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxJT0J5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzdG9yYWdlQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRmlsZVN5c3RlbUlkOiBzdHJpbmcsIFN0b3JhZ2VDbGFzczogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VGUycsXG4gICAgICBtZXRyaWNOYW1lOiAnU3RvcmFnZUJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=