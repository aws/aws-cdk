"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSpacesMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class WorkSpacesMetrics {
    static availableAverage(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'Available',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static unhealthyAverage(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'Unhealthy',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static sessionLaunchTimeAverage(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'SessionLaunchTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static connectionSuccessSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'ConnectionSuccess',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static connectionFailureSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'ConnectionFailure',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static connectionAttemptSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'ConnectionAttempt',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static inSessionLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'InSessionLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static sessionDisconnectSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'SessionDisconnect',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static userConnectedSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'UserConnected',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static stoppedSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'Stopped',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static maintenanceSum(dimensions) {
        return {
            namespace: 'AWS/WorkSpaces',
            metricName: 'Maintenance',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.WorkSpacesMetrics = WorkSpacesMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya3NwYWNlcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3Jrc3BhY2VzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsaUJBQWlCO0lBQ3JCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFtQztRQUNoRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixVQUFVLEVBQUUsV0FBVztZQUN2QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBbUM7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLFdBQVc7WUFDdkIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQW1DO1FBQ3hFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQW1DO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQW1DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQW1DO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBbUM7UUFDMUQsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLFNBQVM7WUFDckIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFtQztRQUM5RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixVQUFVLEVBQUUsYUFBYTtZQUN6QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpGRCw4Q0F5RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFdvcmtTcGFjZXNNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBhdmFpbGFibGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgV29ya3NwYWNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Xb3JrU3BhY2VzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBdmFpbGFibGUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB1bmhlYWx0aHlBdmVyYWdlKGRpbWVuc2lvbnM6IHsgV29ya3NwYWNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Xb3JrU3BhY2VzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdVbmhlYWx0aHknLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzZXNzaW9uTGF1bmNoVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBXb3Jrc3BhY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1dvcmtTcGFjZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1Nlc3Npb25MYXVuY2hUaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29ubmVjdGlvblN1Y2Nlc3NTdW0oZGltZW5zaW9uczogeyBXb3Jrc3BhY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1dvcmtTcGFjZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0Nvbm5lY3Rpb25TdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25uZWN0aW9uRmFpbHVyZVN1bShkaW1lbnNpb25zOiB7IFdvcmtzcGFjZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvV29ya1NwYWNlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29ubmVjdGlvbkZhaWx1cmUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbm5lY3Rpb25BdHRlbXB0U3VtKGRpbWVuc2lvbnM6IHsgV29ya3NwYWNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Xb3JrU3BhY2VzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb25uZWN0aW9uQXR0ZW1wdCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaW5TZXNzaW9uTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBXb3Jrc3BhY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1dvcmtTcGFjZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0luU2Vzc2lvbkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzZXNzaW9uRGlzY29ubmVjdFN1bShkaW1lbnNpb25zOiB7IFdvcmtzcGFjZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvV29ya1NwYWNlcycsXG4gICAgICBtZXRyaWNOYW1lOiAnU2Vzc2lvbkRpc2Nvbm5lY3QnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHVzZXJDb25uZWN0ZWRTdW0oZGltZW5zaW9uczogeyBXb3Jrc3BhY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1dvcmtTcGFjZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1VzZXJDb25uZWN0ZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHN0b3BwZWRTdW0oZGltZW5zaW9uczogeyBXb3Jrc3BhY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1dvcmtTcGFjZXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1N0b3BwZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1haW50ZW5hbmNlU3VtKGRpbWVuc2lvbnM6IHsgV29ya3NwYWNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Xb3JrU3BhY2VzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNYWludGVuYW5jZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=