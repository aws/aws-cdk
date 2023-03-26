"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class SQSMetrics {
    static numberOfMessagesSentAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'NumberOfMessagesSent',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static approximateNumberOfMessagesDelayedAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesDelayed',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static numberOfMessagesReceivedAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'NumberOfMessagesReceived',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static numberOfMessagesDeletedAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'NumberOfMessagesDeleted',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static approximateNumberOfMessagesNotVisibleAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesNotVisible',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static approximateNumberOfMessagesVisibleAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesVisible',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static approximateAgeOfOldestMessageAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'ApproximateAgeOfOldestMessage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static numberOfEmptyReceivesAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'NumberOfEmptyReceives',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static sentMessageSizeAverage(dimensions) {
        return {
            namespace: 'AWS/SQS',
            metricName: 'SentMessageSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.SQSMetrics = SQSMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNxcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMsMkJBQTJCLENBQUMsVUFBaUM7UUFDekUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHlDQUF5QyxDQUFDLFVBQWlDO1FBQ3ZGLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsb0NBQW9DO1lBQ2hELGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxVQUFpQztRQUM3RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsOEJBQThCLENBQUMsVUFBaUM7UUFDNUUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSx5QkFBeUI7WUFDckMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDRDQUE0QyxDQUFDLFVBQWlDO1FBQzFGLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsdUNBQXVDO1lBQ25ELGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx5Q0FBeUMsQ0FBQyxVQUFpQztRQUN2RixPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG9DQUFvQztZQUNoRCxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0NBQW9DLENBQUMsVUFBaUM7UUFDbEYsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSwrQkFBK0I7WUFDM0MsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDRCQUE0QixDQUFDLFVBQWlDO1FBQzFFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFpQztRQUNwRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQXpFRCxnQ0F5RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFNRU01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIG51bWJlck9mTWVzc2FnZXNTZW50QXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NRUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTnVtYmVyT2ZNZXNzYWdlc1NlbnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhcHByb3hpbWF0ZU51bWJlck9mTWVzc2FnZXNEZWxheWVkQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NRUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQXBwcm94aW1hdGVOdW1iZXJPZk1lc3NhZ2VzRGVsYXllZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG51bWJlck9mTWVzc2FnZXNSZWNlaXZlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBRdWV1ZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TUVMnLFxuICAgICAgbWV0cmljTmFtZTogJ051bWJlck9mTWVzc2FnZXNSZWNlaXZlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG51bWJlck9mTWVzc2FnZXNEZWxldGVkQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NRUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTnVtYmVyT2ZNZXNzYWdlc0RlbGV0ZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhcHByb3hpbWF0ZU51bWJlck9mTWVzc2FnZXNOb3RWaXNpYmxlQXZlcmFnZShkaW1lbnNpb25zOiB7IFF1ZXVlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NRUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQXBwcm94aW1hdGVOdW1iZXJPZk1lc3NhZ2VzTm90VmlzaWJsZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFwcHJveGltYXRlTnVtYmVyT2ZNZXNzYWdlc1Zpc2libGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgUXVldWVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU1FTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHByb3hpbWF0ZU51bWJlck9mTWVzc2FnZXNWaXNpYmxlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwcm94aW1hdGVBZ2VPZk9sZGVzdE1lc3NhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgUXVldWVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU1FTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHByb3hpbWF0ZUFnZU9mT2xkZXN0TWVzc2FnZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG51bWJlck9mRW1wdHlSZWNlaXZlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBRdWV1ZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TUVMnLFxuICAgICAgbWV0cmljTmFtZTogJ051bWJlck9mRW1wdHlSZWNlaXZlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNlbnRNZXNzYWdlU2l6ZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBRdWV1ZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TUVMnLFxuICAgICAgbWV0cmljTmFtZTogJ1NlbnRNZXNzYWdlU2l6ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuIl19