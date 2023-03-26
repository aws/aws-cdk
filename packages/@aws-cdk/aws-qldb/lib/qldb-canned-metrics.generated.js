"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.QLDBMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class QLDBMetrics {
    static commandLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'CommandLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static journalStorageSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'JournalStorage',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static indexedStorageSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'IndexedStorage',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static isImpairedSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'IsImpaired',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static occConflictExceptionsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'OccConflictExceptions',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static readIOsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'ReadIOs',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static session4XxExceptionsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'Session4xxExceptions',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static session5XxExceptionsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'Session5xxExceptions',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static sessionRateExceededExceptionsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'SessionRateExceededExceptions',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static writeIOsSum(dimensions) {
        return {
            namespace: 'AWS/QLDB',
            metricName: 'WriteIOs',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.QLDBMetrics = QLDBMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicWxkYi1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJxbGRiLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsV0FBVztJQUNmLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFrQztRQUNwRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBa0M7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQWtDO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBa0M7UUFDNUQsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFrQztRQUN2RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtDO1FBQ3pELE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsU0FBUztZQUNyQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBa0M7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQWtDO1FBQ3RFLE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsc0JBQXNCO1lBQ2xDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFrQztRQUMvRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFVBQVU7WUFDckIsVUFBVSxFQUFFLCtCQUErQjtZQUMzQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQWtDO1FBQzFELE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsVUFBVTtZQUN0QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQWpGRCxrQ0FpRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFFMREJNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBjb21tYW5kTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBMZWRnZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUUxEQicsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29tbWFuZExhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBqb3VybmFsU3RvcmFnZVN1bShkaW1lbnNpb25zOiB7IExlZGdlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9RTERCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdKb3VybmFsU3RvcmFnZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaW5kZXhlZFN0b3JhZ2VTdW0oZGltZW5zaW9uczogeyBMZWRnZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUUxEQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5kZXhlZFN0b3JhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGlzSW1wYWlyZWRTdW0oZGltZW5zaW9uczogeyBMZWRnZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUUxEQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSXNJbXBhaXJlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgb2NjQ29uZmxpY3RFeGNlcHRpb25zU3VtKGRpbWVuc2lvbnM6IHsgTGVkZ2VyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1FMREInLFxuICAgICAgbWV0cmljTmFtZTogJ09jY0NvbmZsaWN0RXhjZXB0aW9ucycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcmVhZElPc1N1bShkaW1lbnNpb25zOiB7IExlZGdlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9RTERCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZWFkSU9zJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzZXNzaW9uNFh4RXhjZXB0aW9uc1N1bShkaW1lbnNpb25zOiB7IExlZGdlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9RTERCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTZXNzaW9uNHh4RXhjZXB0aW9ucycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc2Vzc2lvbjVYeEV4Y2VwdGlvbnNTdW0oZGltZW5zaW9uczogeyBMZWRnZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUUxEQicsXG4gICAgICBtZXRyaWNOYW1lOiAnU2Vzc2lvbjV4eEV4Y2VwdGlvbnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHNlc3Npb25SYXRlRXhjZWVkZWRFeGNlcHRpb25zU3VtKGRpbWVuc2lvbnM6IHsgTGVkZ2VyTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1FMREInLFxuICAgICAgbWV0cmljTmFtZTogJ1Nlc3Npb25SYXRlRXhjZWVkZWRFeGNlcHRpb25zJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB3cml0ZUlPc1N1bShkaW1lbnNpb25zOiB7IExlZGdlck5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9RTERCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdXcml0ZUlPcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=