"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaLiveMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class MediaLiveMetrics {
    static activeAlertsMaximum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'ActiveAlerts',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static inputVideoFrameRateAverage(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'InputVideoFrameRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static fillMsecAverage(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'FillMsec',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static inputLossSecondsSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'InputLossSeconds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static rtpPacketsReceivedSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'RtpPacketsReceived',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static rtpPacketsRecoveredViaFecSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'RtpPacketsRecoveredViaFec',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static rtpPacketsLostSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'RtpPacketsLost',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static fecRowPacketsReceivedSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'FecRowPacketsReceived',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static fecColumnPacketsReceivedSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'FecColumnPacketsReceived',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static primaryInputActiveMinimum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'PrimaryInputActive',
            dimensionsMap: dimensions,
            statistic: 'Minimum',
        };
    }
    static networkInAverage(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'NetworkIn',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkOutAverage(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'NetworkOut',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static pipelinesLockedMinimum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'PipelinesLocked',
            dimensionsMap: dimensions,
            statistic: 'Minimum',
        };
    }
    static inputTimecodesPresentMinimum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'InputTimecodesPresent',
            dimensionsMap: dimensions,
            statistic: 'Minimum',
        };
    }
    static activeOutputsMaximum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'ActiveOutputs',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static output4XxErrorsSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'Output4xxErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static output5XxErrorsSum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'Output5xxErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static audioLevelMaximum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'AudioLevel',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static outputAudioLevelDbfsMaximum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'OutputAudioLevelDbfs',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static outputAudioLevelLkfsMaximum(dimensions) {
        return {
            namespace: 'AWS/MediaLive',
            metricName: 'OutputAudioLevelLkfs',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
}
exports.MediaLiveMetrics = MediaLiveMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWFsaXZlLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lZGlhbGl2ZS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBbUQ7UUFDbkYsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxVQUFlO1FBQ3RELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBbUQ7UUFDL0UsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFlO1FBQy9DLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFlO1FBQ2pELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxVQUFlO1FBQ3hELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsMkJBQTJCO1lBQ3ZDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFlO1FBQzdDLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFlO1FBQ3BELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxVQUFlO1FBQ3ZELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxVQUFtRDtRQUN6RixPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBbUQ7UUFDaEYsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFtRDtRQUNqRixPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLFlBQVk7WUFDeEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQW1EO1FBQ3RGLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxVQUFlO1FBQ3hELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUE0RTtRQUM3RyxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQTRFO1FBQzNHLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUE0RTtRQUMzRyxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBaUY7UUFDL0csT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxVQUFpRjtRQUN6SCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLHNCQUFzQjtZQUNsQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMkJBQTJCLENBQUMsVUFBaUY7UUFDekgsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqTEQsNENBaUxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBNZWRpYUxpdmVNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVBbGVydHNNYXhpbXVtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVBbGVydHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbnB1dFZpZGVvRnJhbWVSYXRlQXZlcmFnZShkaW1lbnNpb25zOiB7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGlucHV0VmlkZW9GcmFtZVJhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBpbnB1dFZpZGVvRnJhbWVSYXRlQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5wdXRWaWRlb0ZyYW1lUmF0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGZpbGxNc2VjQXZlcmFnZShkaW1lbnNpb25zOiB7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnRmlsbE1zZWMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbnB1dExvc3NTZWNvbmRzU3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5wdXRMb3NzU2Vjb25kc1N1bShkaW1lbnNpb25zOiB7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBY3RpdmVJbnB1dEZhaWxvdmVyTGFiZWw6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5wdXRMb3NzU2Vjb25kc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5wdXRMb3NzU2Vjb25kcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcnRwUGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcnRwUGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBydHBQYWNrZXRzUmVjZWl2ZWRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUxpdmUnLFxuICAgICAgbWV0cmljTmFtZTogJ1J0cFBhY2tldHNSZWNlaXZlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcnRwUGFja2V0c1JlY292ZXJlZFZpYUZlY1N1bShkaW1lbnNpb25zOiB7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJ0cFBhY2tldHNSZWNvdmVyZWRWaWFGZWNTdW0oZGltZW5zaW9uczogeyBBY3RpdmVJbnB1dEZhaWxvdmVyTGFiZWw6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJ0cFBhY2tldHNSZWNvdmVyZWRWaWFGZWNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUxpdmUnLFxuICAgICAgbWV0cmljTmFtZTogJ1J0cFBhY2tldHNSZWNvdmVyZWRWaWFGZWMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJ0cFBhY2tldHNMb3N0U3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcnRwUGFja2V0c0xvc3RTdW0oZGltZW5zaW9uczogeyBBY3RpdmVJbnB1dEZhaWxvdmVyTGFiZWw6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJ0cFBhY2tldHNMb3N0U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSdHBQYWNrZXRzTG9zdCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZmVjUm93UGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZmVjUm93UGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBmZWNSb3dQYWNrZXRzUmVjZWl2ZWRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUxpdmUnLFxuICAgICAgbWV0cmljTmFtZTogJ0ZlY1Jvd1BhY2tldHNSZWNlaXZlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZmVjQ29sdW1uUGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZmVjQ29sdW1uUGFja2V0c1JlY2VpdmVkU3VtKGRpbWVuc2lvbnM6IHsgQWN0aXZlSW5wdXRGYWlsb3ZlckxhYmVsOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBmZWNDb2x1bW5QYWNrZXRzUmVjZWl2ZWRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUxpdmUnLFxuICAgICAgbWV0cmljTmFtZTogJ0ZlY0NvbHVtblBhY2tldHNSZWNlaXZlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJpbWFyeUlucHV0QWN0aXZlTWluaW11bShkaW1lbnNpb25zOiB7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnUHJpbWFyeUlucHV0QWN0aXZlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNaW5pbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya0luQXZlcmFnZShkaW1lbnNpb25zOiB7IENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV0d29ya0luJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya091dEF2ZXJhZ2UoZGltZW5zaW9uczogeyBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9NZWRpYUxpdmUnLFxuICAgICAgbWV0cmljTmFtZTogJ05ldHdvcmtPdXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwaXBlbGluZXNMb2NrZWRNaW5pbXVtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQaXBlbGluZXNMb2NrZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01pbmltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbnB1dFRpbWVjb2Rlc1ByZXNlbnRNaW5pbXVtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5wdXRUaW1lY29kZXNQcmVzZW50TWluaW11bShkaW1lbnNpb25zOiB7IEFjdGl2ZUlucHV0RmFpbG92ZXJMYWJlbDogc3RyaW5nLCBDaGFubmVsSWQ6IHN0cmluZywgUGlwZWxpbmU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBY3RpdmVJbnB1dEZhaWxvdmVyTGFiZWw6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaW5wdXRUaW1lY29kZXNQcmVzZW50TWluaW11bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5wdXRUaW1lY29kZXNQcmVzZW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNaW5pbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlT3V0cHV0c01heGltdW0oZGltZW5zaW9uczogeyBDaGFubmVsSWQ6IHN0cmluZywgT3V0cHV0R3JvdXBOYW1lOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVPdXRwdXRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgb3V0cHV0NFh4RXJyb3JzU3VtKGRpbWVuc2lvbnM6IHsgQ2hhbm5lbElkOiBzdHJpbmcsIE91dHB1dEdyb3VwTmFtZTogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnT3V0cHV0NHh4RXJyb3JzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBvdXRwdXQ1WHhFcnJvcnNTdW0oZGltZW5zaW9uczogeyBDaGFubmVsSWQ6IHN0cmluZywgT3V0cHV0R3JvdXBOYW1lOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdPdXRwdXQ1eHhFcnJvcnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGF1ZGlvTGV2ZWxNYXhpbXVtKGRpbWVuc2lvbnM6IHsgQXVkaW9EZXNjcmlwdGlvbk5hbWU6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBdWRpb0xldmVsJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgb3V0cHV0QXVkaW9MZXZlbERiZnNNYXhpbXVtKGRpbWVuc2lvbnM6IHsgQXVkaW9EZXNjcmlwdGlvbk5hbWU6IHN0cmluZywgQ2hhbm5lbElkOiBzdHJpbmcsIFBpcGVsaW5lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTWVkaWFMaXZlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdPdXRwdXRBdWRpb0xldmVsRGJmcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnTWF4aW11bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG91dHB1dEF1ZGlvTGV2ZWxMa2ZzTWF4aW11bShkaW1lbnNpb25zOiB7IEF1ZGlvRGVzY3JpcHRpb25OYW1lOiBzdHJpbmcsIENoYW5uZWxJZDogc3RyaW5nLCBQaXBlbGluZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL01lZGlhTGl2ZScsXG4gICAgICBtZXRyaWNOYW1lOiAnT3V0cHV0QXVkaW9MZXZlbExrZnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbn1cbnR5cGUgTWV0cmljV2l0aERpbXM8RD4gPSB7IG5hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nLCBkaW1lbnNpb25zTWFwOiBEIH07XG4iXX0=