"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStreamMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class AppStreamMetrics {
    static capacityUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'CapacityUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static insufficientCapacityErrorSum(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'InsufficientCapacityError',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static actualCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'ActualCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static availableCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'AvailableCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static desiredCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'DesiredCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static inUseCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'InUseCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static pendingCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'PendingCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static runningCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AppStream',
            metricName: 'RunningCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.AppStreamMetrics = AppStreamMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwc3RyZWFtLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcHN0cmVhbS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsMEJBQTBCLENBQUMsVUFBNkI7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDRCQUE0QixDQUFDLFVBQTZCO1FBQ3RFLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsMkJBQTJCO1lBQ3ZDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUE2QjtRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBNkI7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQTZCO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUE2QjtRQUM5RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQTZCO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUE2QjtRQUNoRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQWpFRCw0Q0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEFwcFN0cmVhbU1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGNhcGFjaXR5VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgRmxlZXQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBTdHJlYW0nLFxuICAgICAgbWV0cmljTmFtZTogJ0NhcGFjaXR5VXRpbGl6YXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbnN1ZmZpY2llbnRDYXBhY2l0eUVycm9yU3VtKGRpbWVuc2lvbnM6IHsgRmxlZXQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBTdHJlYW0nLFxuICAgICAgbWV0cmljTmFtZTogJ0luc3VmZmljaWVudENhcGFjaXR5RXJyb3InLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFjdHVhbENhcGFjaXR5QXZlcmFnZShkaW1lbnNpb25zOiB7IEZsZWV0OiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwU3RyZWFtJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3R1YWxDYXBhY2l0eScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGF2YWlsYWJsZUNhcGFjaXR5QXZlcmFnZShkaW1lbnNpb25zOiB7IEZsZWV0OiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwU3RyZWFtJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBdmFpbGFibGVDYXBhY2l0eScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRlc2lyZWRDYXBhY2l0eUF2ZXJhZ2UoZGltZW5zaW9uczogeyBGbGVldDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcFN0cmVhbScsXG4gICAgICBtZXRyaWNOYW1lOiAnRGVzaXJlZENhcGFjaXR5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaW5Vc2VDYXBhY2l0eUF2ZXJhZ2UoZGltZW5zaW9uczogeyBGbGVldDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcFN0cmVhbScsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5Vc2VDYXBhY2l0eScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBlbmRpbmdDYXBhY2l0eUF2ZXJhZ2UoZGltZW5zaW9uczogeyBGbGVldDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcFN0cmVhbScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGVuZGluZ0NhcGFjaXR5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcnVubmluZ0NhcGFjaXR5QXZlcmFnZShkaW1lbnNpb25zOiB7IEZsZWV0OiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwU3RyZWFtJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSdW5uaW5nQ2FwYWNpdHknLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==