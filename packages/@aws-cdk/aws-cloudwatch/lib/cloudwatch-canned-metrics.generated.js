"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWatchMetricStreamsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class CloudWatchMetricStreamsMetrics {
    static metricUpdateSum(dimensions) {
        return {
            namespace: 'AWS/CloudWatch/MetricStreams',
            metricName: 'MetricUpdate',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static publishErrorRateAverage(dimensions) {
        return {
            namespace: 'AWS/CloudWatch/MetricStreams',
            metricName: 'PublishErrorRate',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.CloudWatchMetricStreamsMetrics = CloudWatchMetricStreamsMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWR3YXRjaC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZHdhdGNoLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsOEJBQThCO0lBQ2xDLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBd0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSw4QkFBOEI7WUFDekMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQXdDO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsOEJBQThCO1lBQ3pDLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqQkQsd0VBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBDbG91ZFdhdGNoTWV0cmljU3RyZWFtc01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIG1ldHJpY1VwZGF0ZVN1bShkaW1lbnNpb25zOiB7IE1ldHJpY1N0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9DbG91ZFdhdGNoL01ldHJpY1N0cmVhbXMnLFxuICAgICAgbWV0cmljTmFtZTogJ01ldHJpY1VwZGF0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHVibGlzaEVycm9yUmF0ZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBNZXRyaWNTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQ2xvdWRXYXRjaC9NZXRyaWNTdHJlYW1zJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdWJsaXNoRXJyb3JSYXRlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG4iXX0=