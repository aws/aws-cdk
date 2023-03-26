"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStoreMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class MediaStoreMetrics {
    static requestCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: 'RequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static turnaroundTimeAverage(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: 'TurnaroundTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static _4XxErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: '4xxErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static _5XxErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: '5xxErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesDownloadedSum(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: 'BytesDownloaded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesUploadedSum(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: 'BytesUploaded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalTimeAverage(dimensions) {
        return {
            namespace: 'AWS/MediaStore',
            metricName: 'TotalTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.MediaStoreMetrics = MediaStoreMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWFzdG9yZS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZWRpYXN0b3JlLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsaUJBQWlCO0lBQ3JCLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBcUM7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQXFDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQXFDO1FBQ25FLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFxQztRQUNuRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixVQUFVLEVBQUUsZUFBZTtZQUMzQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBcUM7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBcUM7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQXFDO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBekRELDhDQXlEQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgTWVkaWFTdG9yZU1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIHJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7IENvbnRhaW5lck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYVN0b3JlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHR1cm5hcm91bmRUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IENvbnRhaW5lck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYVN0b3JlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdXJuYXJvdW5kVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIF80WHhFcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQ29udGFpbmVyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhU3RvcmUnLFxuICAgICAgbWV0cmljTmFtZTogJzR4eEVycm9yQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIF81WHhFcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQ29udGFpbmVyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhU3RvcmUnLFxuICAgICAgbWV0cmljTmFtZTogJzV4eEVycm9yQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzRG93bmxvYWRlZFN1bShkaW1lbnNpb25zOiB7IENvbnRhaW5lck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYVN0b3JlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdCeXRlc0Rvd25sb2FkZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzVXBsb2FkZWRTdW0oZGltZW5zaW9uczogeyBDb250YWluZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFTdG9yZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQnl0ZXNVcGxvYWRlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdG90YWxUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IENvbnRhaW5lck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYVN0b3JlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUb3RhbFRpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==