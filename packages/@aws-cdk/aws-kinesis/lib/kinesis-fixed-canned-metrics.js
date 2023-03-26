"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisMetrics = void 0;
const kinesis_canned_metrics_generated_1 = require("./kinesis-canned-metrics.generated");
/**
 * This class is to consolidate all the metrics from Stream in just one place.
 *
 * Current generated canned metrics don't match the proper metrics from the service. If it is fixed
 * at the source this class can be removed and just use the generated one directly.
 *
 * Stream Metrics reference: https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
class KinesisMetrics {
    static getRecordsBytesAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static getRecordsSuccessAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Success',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static getRecordsRecordsAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Records',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static getRecordsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Latency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordBytesAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecord.Bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecord.Latency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static getRecordsIteratorAgeMillisecondsMaximum(dimensions) {
        return kinesis_canned_metrics_generated_1.KinesisMetrics.getRecordsIteratorAgeMillisecondsMaximum(dimensions);
    }
    static putRecordSuccessAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.putRecordSuccessSum(dimensions),
            statistic: 'Average',
        };
    }
    static putRecordsBytesAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.putRecordsBytesSum(dimensions),
            statistic: 'Average',
        };
    }
    static putRecordsLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Latency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordsSuccessAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Success',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordsTotalRecordsAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.TotalRecords',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordsSuccessfulRecordsAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.SuccessfulRecords',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordsFailedRecordsAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.FailedRecords',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static putRecordsThrottledRecordsAverage(dimensions) {
        return {
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.ThrottledRecords',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static incomingBytesAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.incomingBytesSum(dimensions),
            statistic: 'Average',
        };
    }
    static incomingRecordsAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.incomingRecordsSum(dimensions),
            statistic: 'Average',
        };
    }
    static readProvisionedThroughputExceededAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.readProvisionedThroughputExceededSum(dimensions),
            statistic: 'Average',
        };
    }
    static writeProvisionedThroughputExceededAverage(dimensions) {
        return {
            ...kinesis_canned_metrics_generated_1.KinesisMetrics.writeProvisionedThroughputExceededSum(dimensions),
            statistic: 'Average',
        };
    }
}
exports.KinesisMetrics = KinesisMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1maXhlZC1jYW5uZWQtbWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImtpbmVzaXMtZml4ZWQtY2FubmVkLW1ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUZBQXFGO0FBRXJGOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLGNBQWM7SUFDbEIsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQWtDO1FBQ3JFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFrQztRQUN2RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBa0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQWtDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFrQztRQUNwRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGFBQWE7WUFDeEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNy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cUNBQXFDLENBQUMsVUFBVSxDQUFDO1lBQ2xFLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBeklELHdDQXlJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEtpbmVzaXNNZXRyaWNzIGFzIENhbm5lZE1ldHJpY3MgfSBmcm9tICcuL2tpbmVzaXMtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIHRvIGNvbnNvbGlkYXRlIGFsbCB0aGUgbWV0cmljcyBmcm9tIFN0cmVhbSBpbiBqdXN0IG9uZSBwbGFjZS5cbiAqXG4gKiBDdXJyZW50IGdlbmVyYXRlZCBjYW5uZWQgbWV0cmljcyBkb24ndCBtYXRjaCB0aGUgcHJvcGVyIG1ldHJpY3MgZnJvbSB0aGUgc2VydmljZS4gSWYgaXQgaXMgZml4ZWRcbiAqIGF0IHRoZSBzb3VyY2UgdGhpcyBjbGFzcyBjYW4gYmUgcmVtb3ZlZCBhbmQganVzdCB1c2UgdGhlIGdlbmVyYXRlZCBvbmUgZGlyZWN0bHkuXG4gKlxuICogU3RyZWFtIE1ldHJpY3MgcmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RyZWFtcy9sYXRlc3QvZGV2L21vbml0b3Jpbmctd2l0aC1jbG91ZHdhdGNoLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIEtpbmVzaXNNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzU3VjY2Vzc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnR2V0UmVjb3Jkcy5TdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZ2V0UmVjb3Jkc1JlY29yZHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuUmVjb3JkcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdldFJlY29yZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3JkLkJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0UmVjb3JkTGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3JkLkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBnZXRSZWNvcmRzSXRlcmF0b3JBZ2VNaWxsaXNlY29uZHNNYXhpbXVtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4gQ2FubmVkTWV0cmljcy5nZXRSZWNvcmRzSXRlcmF0b3JBZ2VNaWxsaXNlY29uZHNNYXhpbXVtKGRpbWVuc2lvbnMpO1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0UmVjb3JkU3VjY2Vzc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5DYW5uZWRNZXRyaWNzLnB1dFJlY29yZFN1Y2Nlc3NTdW0oZGltZW5zaW9ucyksXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0UmVjb3Jkc0J5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLkNhbm5lZE1ldHJpY3MucHV0UmVjb3Jkc0J5dGVzU3VtKGRpbWVuc2lvbnMpLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dFJlY29yZHNMYXRlbmN5QXZlcmFnZShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRSZWNvcmRzLkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRzU3VjY2Vzc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5TdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0UmVjb3Jkc1RvdGFsUmVjb3Jkc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5Ub3RhbFJlY29yZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRzU3VjY2Vzc2Z1bFJlY29yZHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dFJlY29yZHMuU3VjY2Vzc2Z1bFJlY29yZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwdXRSZWNvcmRzRmFpbGVkUmVjb3Jkc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5GYWlsZWRSZWNvcmRzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0UmVjb3Jkc1Rocm90dGxlZFJlY29yZHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dFJlY29yZHMuVGhyb3R0bGVkUmVjb3JkcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGluY29taW5nQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uQ2FubmVkTWV0cmljcy5pbmNvbWluZ0J5dGVzU3VtKGRpbWVuc2lvbnMpLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGluY29taW5nUmVjb3Jkc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5DYW5uZWRNZXRyaWNzLmluY29taW5nUmVjb3Jkc1N1bShkaW1lbnNpb25zKSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG5cbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlYWRQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5DYW5uZWRNZXRyaWNzLnJlYWRQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZFN1bShkaW1lbnNpb25zKSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB3cml0ZVByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkQXZlcmFnZShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLkNhbm5lZE1ldHJpY3Mud3JpdGVQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZFN1bShkaW1lbnNpb25zKSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==