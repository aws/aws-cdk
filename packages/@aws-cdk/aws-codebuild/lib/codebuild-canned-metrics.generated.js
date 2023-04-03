"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBuildMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class CodeBuildMetrics {
    static succeededBuildsSum(dimensions) {
        return {
            namespace: 'AWS/CodeBuild',
            metricName: 'SucceededBuilds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static failedBuildsSum(dimensions) {
        return {
            namespace: 'AWS/CodeBuild',
            metricName: 'FailedBuilds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static buildsSum(dimensions) {
        return {
            namespace: 'AWS/CodeBuild',
            metricName: 'Builds',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static durationAverage(dimensions) {
        return {
            namespace: 'AWS/CodeBuild',
            metricName: 'Duration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.CodeBuildMetrics = CodeBuildMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJ1aWxkLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVidWlsZC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBbUM7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFtQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFtQztRQUN6RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFtQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUFqQ0QsNENBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBDb2RlQnVpbGRNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBzdWNjZWVkZWRCdWlsZHNTdW0oZGltZW5zaW9uczogeyBQcm9qZWN0TmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZGVCdWlsZCcsXG4gICAgICBtZXRyaWNOYW1lOiAnU3VjY2VlZGVkQnVpbGRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBmYWlsZWRCdWlsZHNTdW0oZGltZW5zaW9uczogeyBQcm9qZWN0TmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZGVCdWlsZCcsXG4gICAgICBtZXRyaWNOYW1lOiAnRmFpbGVkQnVpbGRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBidWlsZHNTdW0oZGltZW5zaW9uczogeyBQcm9qZWN0TmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZGVCdWlsZCcsXG4gICAgICBtZXRyaWNOYW1lOiAnQnVpbGRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkdXJhdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBQcm9qZWN0TmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZGVCdWlsZCcsXG4gICAgICBtZXRyaWNOYW1lOiAnRHVyYXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==