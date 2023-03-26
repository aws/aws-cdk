"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class EventsMetrics {
    static invocationsSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'Invocations',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static failedInvocationsSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'FailedInvocations',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static deadLetterInvocationsSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'DeadLetterInvocations',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static triggeredRulesSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'TriggeredRules',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static matchedEventsSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'MatchedEvents',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static throttledRulesSum(dimensions) {
        return {
            namespace: 'AWS/Events',
            metricName: 'ThrottledRules',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.EventsMetrics = EventsMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50cy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGFBQWE7SUFDakIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFnQztRQUMzRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWdDO1FBQ2pFLE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFnQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBZ0M7UUFDOUQsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQWdDO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsZUFBZTtZQUMzQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBZ0M7UUFDOUQsT0FBTztZQUNMLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0NBQ0Y7QUFqREQsc0NBaURDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBFdmVudHNNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBpbnZvY2F0aW9uc1N1bShkaW1lbnNpb25zOiB7IFJ1bGVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRXZlbnRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJbnZvY2F0aW9ucycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZmFpbGVkSW52b2NhdGlvbnNTdW0oZGltZW5zaW9uczogeyBSdWxlTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0V2ZW50cycsXG4gICAgICBtZXRyaWNOYW1lOiAnRmFpbGVkSW52b2NhdGlvbnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRlYWRMZXR0ZXJJbnZvY2F0aW9uc1N1bShkaW1lbnNpb25zOiB7IFJ1bGVOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRXZlbnRzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEZWFkTGV0dGVySW52b2NhdGlvbnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRyaWdnZXJlZFJ1bGVzU3VtKGRpbWVuc2lvbnM6IHsgUnVsZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FdmVudHMnLFxuICAgICAgbWV0cmljTmFtZTogJ1RyaWdnZXJlZFJ1bGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtYXRjaGVkRXZlbnRzU3VtKGRpbWVuc2lvbnM6IHsgUnVsZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FdmVudHMnLFxuICAgICAgbWV0cmljTmFtZTogJ01hdGNoZWRFdmVudHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRocm90dGxlZFJ1bGVzU3VtKGRpbWVuc2lvbnM6IHsgUnVsZU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FdmVudHMnLFxuICAgICAgbWV0cmljTmFtZTogJ1Rocm90dGxlZFJ1bGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==