"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisAnalyticsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class KinesisAnalyticsMetrics {
    static kpUsAverage(dimensions) {
        return {
            namespace: 'AWS/KinesisAnalytics',
            metricName: 'KPUs',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static millisBehindLatestAverage(dimensions) {
        return {
            namespace: 'AWS/KinesisAnalytics',
            metricName: 'MillisBehindLatest',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.KinesisAnalyticsMetrics = KinesisAnalyticsMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpc2FuYWx5dGljcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJraW5lc2lzYW5hbHl0aWNzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsdUJBQXVCO0lBQzNCLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBbUM7UUFDM0QsT0FBTztZQUNMLFNBQVMsRUFBRSxzQkFBc0I7WUFDakMsVUFBVSxFQUFFLE1BQU07WUFDbEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQW1DO1FBQ3pFLE9BQU87WUFDTCxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqQkQsMERBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBLaW5lc2lzQW5hbHl0aWNzTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMga3BVc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBcHBsaWNhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXNBbmFseXRpY3MnLFxuICAgICAgbWV0cmljTmFtZTogJ0tQVXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtaWxsaXNCZWhpbmRMYXRlc3RBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXBwbGljYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzQW5hbHl0aWNzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNaWxsaXNCZWhpbmRMYXRlc3QnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==