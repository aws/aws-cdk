"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFrontMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class CloudFrontMetrics {
    static requestsSum(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: 'Requests',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalErrorRateAverage(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: 'TotalErrorRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static bytesDownloadedSum(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: 'BytesDownloaded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesUploadedSum(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: 'BytesUploaded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static _4XxErrorRateAverage(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: '4xxErrorRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static _5XxErrorRateAverage(dimensions) {
        return {
            namespace: 'AWS/CloudFront',
            metricName: '5xxErrorRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.CloudFrontMetrics = CloudFrontMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmcm9udC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZGZyb250LWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsaUJBQWlCO0lBQ3JCLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBc0Q7UUFDOUUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLFVBQVU7WUFDdEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQXNEO1FBQ3hGLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQXNEO1FBQ3JGLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQXNEO1FBQ25GLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFzRDtRQUN2RixPQUFPO1lBQ0wsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBc0Q7UUFDdkYsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqREQsOENBaURDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBDbG91ZEZyb250TWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgcmVxdWVzdHNTdW0oZGltZW5zaW9uczogeyBEaXN0cmlidXRpb25JZDogc3RyaW5nLCBSZWdpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9DbG91ZEZyb250JyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZXF1ZXN0cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdG90YWxFcnJvclJhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRGlzdHJpYnV0aW9uSWQ6IHN0cmluZywgUmVnaW9uOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQ2xvdWRGcm9udCcsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxFcnJvclJhdGUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBieXRlc0Rvd25sb2FkZWRTdW0oZGltZW5zaW9uczogeyBEaXN0cmlidXRpb25JZDogc3RyaW5nLCBSZWdpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9DbG91ZEZyb250JyxcbiAgICAgIG1ldHJpY05hbWU6ICdCeXRlc0Rvd25sb2FkZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzVXBsb2FkZWRTdW0oZGltZW5zaW9uczogeyBEaXN0cmlidXRpb25JZDogc3RyaW5nLCBSZWdpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9DbG91ZEZyb250JyxcbiAgICAgIG1ldHJpY05hbWU6ICdCeXRlc1VwbG9hZGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBfNFh4RXJyb3JSYXRlQXZlcmFnZShkaW1lbnNpb25zOiB7IERpc3RyaWJ1dGlvbklkOiBzdHJpbmcsIFJlZ2lvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0Nsb3VkRnJvbnQnLFxuICAgICAgbWV0cmljTmFtZTogJzR4eEVycm9yUmF0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIF81WHhFcnJvclJhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRGlzdHJpYnV0aW9uSWQ6IHN0cmluZywgUmVnaW9uOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQ2xvdWRGcm9udCcsXG4gICAgICBtZXRyaWNOYW1lOiAnNXh4RXJyb3JSYXRlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=