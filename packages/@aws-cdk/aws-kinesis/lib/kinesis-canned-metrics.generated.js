"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class KinesisMetrics {
    static readProvisionedThroughputExceededSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'ReadProvisionedThroughputExceeded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static writeProvisionedThroughputExceededSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'WriteProvisionedThroughputExceeded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getRecordsIteratorAgeMillisecondsMaximum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.IteratorAgeMilliseconds',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static putRecordSuccessSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecord.Success',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putRecordsSuccessSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Success',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putRecordsBytesSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Bytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getRecordsSuccessSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Success',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getRecordsBytesSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Bytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getRecordsRecordsSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Records',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getRecordsLatencyMaximum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Latency',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static incomingBytesSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static incomingRecordsSum(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingRecords',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.KinesisMetrics = KinesisMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJraW5lc2lzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEsY0FBYztJQUNsQixNQUFNLENBQUMsb0NBQW9DLENBQUMsVUFBa0M7UUFDbkYsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxtQ0FBbUM7WUFDL0MsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFDQUFxQyxDQUFDLFVBQWtDO1FBQ3BGLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsb0NBQW9DO1lBQ2hELGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3Q0FBd0MsQ0FBQyxVQUFrQztRQUN2RixPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLG9DQUFvQztZQUNoRCxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBa0M7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQWtDO1FBQ25FLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFrQztRQUNqRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBa0M7UUFDbkUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQWtDO1FBQ2pFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBa0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQWtDO1FBQy9ELE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsZUFBZTtZQUMzQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBa0M7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0NBQ0Y7QUFqR0Qsd0NBaUdDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBLaW5lc2lzTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZFByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkU3VtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1JlYWRQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgd3JpdGVQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZFN1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdXcml0ZVByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzSXRlcmF0b3JBZ2VNaWxsaXNlY29uZHNNYXhpbXVtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuSXRlcmF0b3JBZ2VNaWxsaXNlY29uZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRTdWNjZXNzU3VtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dFJlY29yZC5TdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRzU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRSZWNvcmRzLlN1Y2Nlc3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dFJlY29yZHNCeXRlc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRSZWNvcmRzLkJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLlN1Y2Nlc3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdldFJlY29yZHNCeXRlc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLkJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzUmVjb3Jkc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLlJlY29yZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdldFJlY29yZHNMYXRlbmN5TWF4aW11bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBpbmNvbWluZ0J5dGVzU3VtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0luY29taW5nQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGluY29taW5nUmVjb3Jkc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJbmNvbWluZ1JlY29yZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuIl19