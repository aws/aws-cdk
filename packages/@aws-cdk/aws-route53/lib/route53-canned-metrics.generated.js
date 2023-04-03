"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route53Metrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class Route53Metrics {
    static healthCheckPercentageHealthyAverage(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'HealthCheckPercentageHealthy',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static connectionTimeAverage(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'ConnectionTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static healthCheckStatusMinimum(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'HealthCheckStatus',
            dimensionsMap: dimensions,
            statistic: 'Minimum',
        };
    }
    static sslHandshakeTimeAverage(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'SSLHandshakeTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static childHealthCheckHealthyCountAverage(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'ChildHealthCheckHealthyCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static timeToFirstByteAverage(dimensions) {
        return {
            namespace: 'AWS/Route53',
            metricName: 'TimeToFirstByte',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.Route53Metrics = Route53Metrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGU1My1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZTUzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsY0FBYztJQUNsQixNQUFNLENBQUMsbUNBQW1DLENBQUMsVUFBcUM7UUFDckYsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSw4QkFBOEI7WUFDMUMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQXFDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFxQztRQUMxRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBcUM7UUFDekUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1DQUFtQyxDQUFDLFVBQXFDO1FBQ3JGLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsOEJBQThCO1lBQzFDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFxQztRQUN4RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQWpERCx3Q0FpREMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFJvdXRlNTNNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBoZWFsdGhDaGVja1BlcmNlbnRhZ2VIZWFsdGh5QXZlcmFnZShkaW1lbnNpb25zOiB7IEhlYWx0aENoZWNrSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Sb3V0ZTUzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIZWFsdGhDaGVja1BlcmNlbnRhZ2VIZWFsdGh5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29ubmVjdGlvblRpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSGVhbHRoQ2hlY2tJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvdXRlNTMnLFxuICAgICAgbWV0cmljTmFtZTogJ0Nvbm5lY3Rpb25UaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGVhbHRoQ2hlY2tTdGF0dXNNaW5pbXVtKGRpbWVuc2lvbnM6IHsgSGVhbHRoQ2hlY2tJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvdXRlNTMnLFxuICAgICAgbWV0cmljTmFtZTogJ0hlYWx0aENoZWNrU3RhdHVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNaW5pbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3NsSGFuZHNoYWtlVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBIZWFsdGhDaGVja0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUm91dGU1MycsXG4gICAgICBtZXRyaWNOYW1lOiAnU1NMSGFuZHNoYWtlVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNoaWxkSGVhbHRoQ2hlY2tIZWFsdGh5Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSGVhbHRoQ2hlY2tJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvdXRlNTMnLFxuICAgICAgbWV0cmljTmFtZTogJ0NoaWxkSGVhbHRoQ2hlY2tIZWFsdGh5Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0aW1lVG9GaXJzdEJ5dGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSGVhbHRoQ2hlY2tJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvdXRlNTMnLFxuICAgICAgbWV0cmljTmFtZTogJ1RpbWVUb0ZpcnN0Qnl0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuIl19