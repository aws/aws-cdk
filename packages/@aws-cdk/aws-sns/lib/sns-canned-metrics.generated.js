"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNSMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class SNSMetrics {
    static numberOfNotificationsDeliveredSum(dimensions) {
        return {
            namespace: 'AWS/SNS',
            metricName: 'NumberOfNotificationsDelivered',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static numberOfNotificationsFailedSum(dimensions) {
        return {
            namespace: 'AWS/SNS',
            metricName: 'NumberOfNotificationsFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static numberOfMessagesPublishedSum(dimensions) {
        return {
            namespace: 'AWS/SNS',
            metricName: 'NumberOfMessagesPublished',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static publishSizeAverage(dimensions) {
        return {
            namespace: 'AWS/SNS',
            metricName: 'PublishSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static smsSuccessRateSum(dimensions) {
        return {
            namespace: 'AWS/SNS',
            metricName: 'SMSSuccessRate',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.SNSMetrics = SNSMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNucy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMsaUNBQWlDLENBQUMsVUFBaUM7UUFDL0UsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQ0FBZ0M7WUFDNUMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDhCQUE4QixDQUFDLFVBQWlDO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsNkJBQTZCO1lBQ3pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxVQUFpQztRQUMxRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDJCQUEyQjtZQUN2QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBaUM7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFpQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpDRCxnQ0F5Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFNOU01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIG51bWJlck9mTm90aWZpY2F0aW9uc0RlbGl2ZXJlZFN1bShkaW1lbnNpb25zOiB7IFRvcGljTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NOUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTnVtYmVyT2ZOb3RpZmljYXRpb25zRGVsaXZlcmVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBudW1iZXJPZk5vdGlmaWNhdGlvbnNGYWlsZWRTdW0oZGltZW5zaW9uczogeyBUb3BpY05hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9TTlMnLFxuICAgICAgbWV0cmljTmFtZTogJ051bWJlck9mTm90aWZpY2F0aW9uc0ZhaWxlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyT2ZNZXNzYWdlc1B1Ymxpc2hlZFN1bShkaW1lbnNpb25zOiB7IFRvcGljTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NOUycsXG4gICAgICBtZXRyaWNOYW1lOiAnTnVtYmVyT2ZNZXNzYWdlc1B1Ymxpc2hlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHVibGlzaFNpemVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgVG9waWNOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU05TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdWJsaXNoU2l6ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNtc1N1Y2Nlc3NSYXRlU3VtKGRpbWVuc2lvbnM6IHsgVG9waWNOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU05TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTTVNTdWNjZXNzUmF0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=