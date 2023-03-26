"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonMQMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class AmazonMQMetrics {
    static ackRateAverage(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'AckRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static channelCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'ChannelCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static confirmRateAverage(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'ConfirmRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static connectionCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'ConnectionCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static consumerCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'ConsumerCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static cpuCreditBalanceHeapUsageMaximum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'CpuCreditBalanceHeapUsage',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'CpuUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static currentConnectionsCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'CurrentConnectionsCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static exchangeCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'ExchangeCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static messageCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'MessageCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static messageReadyCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'MessageReadyCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static messageUnacknowledgedCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'MessageUnacknowledgedCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static networkInSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'NetworkIn',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static networkOutSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'NetworkOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static publishRateAverage(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'PublishRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static queueCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'QueueCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalConsumerCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'TotalConsumerCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalMessageCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'TotalMessageCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static totalProducerCountSum(dimensions) {
        return {
            namespace: 'AWS/AmazonMQ',
            metricName: 'TotalProducerCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.AmazonMQMetrics = AmazonMQMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9ubXEtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1hem9ubXEtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSxlQUFlO0lBQ25CLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBOEI7UUFDekQsT0FBTztZQUNMLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBOEI7UUFDMUQsT0FBTztZQUNMLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUE4QjtRQUM3RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGNBQWM7WUFDekIsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQThCO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsY0FBYztZQUN6QixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUE4QjtRQUMzRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGNBQWM7WUFDekIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtB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QWM7WUFDekIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBOEI7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0NBQ0Y7QUF6SkQsMENBeUpDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBBbWF6b25NUU1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGFja1JhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQnJva2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQW1hem9uTVEnLFxuICAgICAgbWV0cmljTmFtZTogJ0Fja1JhdGUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjaGFubmVsQ291bnRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ2hhbm5lbENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25maXJtUmF0ZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29uZmlybVJhdGUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25uZWN0aW9uQ291bnRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29ubmVjdGlvbkNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25zdW1lckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQnJva2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQW1hem9uTVEnLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnN1bWVyQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNwdUNyZWRpdEJhbGFuY2VIZWFwVXNhZ2VNYXhpbXVtKGRpbWVuc2lvbnM6IHsgQnJva2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQW1hem9uTVEnLFxuICAgICAgbWV0cmljTmFtZTogJ0NwdUNyZWRpdEJhbGFuY2VIZWFwVXNhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnQ3B1VXRpbGl6YXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjdXJyZW50Q29ubmVjdGlvbnNDb3VudFN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDdXJyZW50Q29ubmVjdGlvbnNDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZXhjaGFuZ2VDb3VudFN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdFeGNoYW5nZUNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtZXNzYWdlQ291bnRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVzc2FnZUNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtZXNzYWdlUmVhZHlDb3VudFN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXNzYWdlUmVhZHlDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVzc2FnZVVuYWNrbm93bGVkZ2VkQ291bnRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVzc2FnZVVuYWNrbm93bGVkZ2VkQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtJblN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrSW4nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtPdXRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV0d29ya091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHVibGlzaFJhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQnJva2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQW1hem9uTVEnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1Ymxpc2hSYXRlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcXVldWVDb3VudFN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdRdWV1ZUNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbENvbnN1bWVyQ291bnRTdW0oZGltZW5zaW9uczogeyBCcm9rZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BbWF6b25NUScsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxDb25zdW1lckNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbE1lc3NhZ2VDb3VudFN1bShkaW1lbnNpb25zOiB7IEJyb2tlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FtYXpvbk1RJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUb3RhbE1lc3NhZ2VDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdG90YWxQcm9kdWNlckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQnJva2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQW1hem9uTVEnLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdGFsUHJvZHVjZXJDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=