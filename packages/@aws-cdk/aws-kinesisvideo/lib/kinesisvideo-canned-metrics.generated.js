"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisVideoMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class KinesisVideoMetrics {
    static getMediaSuccessSum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'GetMedia.Success',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putMediaSuccessSum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'PutMedia.Success',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static getMediaMillisBehindNowSum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'GetMedia.MillisBehindNow',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static listFragmentsLatencySum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'ListFragments.Latency',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putMediaFragmentIngestionLatencySum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'PutMedia.FragmentIngestionLatency',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putMediaFragmentPersistLatencySum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'PutMedia.FragmentPersistLatency',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putMediaIncomingBytesSum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'PutMedia.IncomingBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static putMediaIncomingFramesSum(dimensions) {
        return {
            namespace: 'AWS/KinesisVideo',
            metricName: 'PutMedia.IncomingFrames',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.KinesisVideoMetrics = KinesisVideoMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpc3ZpZGVvLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImtpbmVzaXN2aWRlby1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLG1CQUFtQjtJQUN2QixNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBa0M7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBa0M7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsVUFBa0M7UUFDekUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBa0M7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUNBQW1DLENBQUMsVUFBa0M7UUFDbEYsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLG1DQUFtQztZQUMvQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsaUNBQWlDLENBQUMsVUFBa0M7UUFDaEYsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLGlDQUFpQztZQUM3QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBa0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBa0M7UUFDeEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLHlCQUF5QjtZQUNyQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQWpFRCxrREFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEtpbmVzaXNWaWRlb01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGdldE1lZGlhU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzVmlkZW8nLFxuICAgICAgbWV0cmljTmFtZTogJ0dldE1lZGlhLlN1Y2Nlc3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dE1lZGlhU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzVmlkZW8nLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dE1lZGlhLlN1Y2Nlc3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdldE1lZGlhTWlsbGlzQmVoaW5kTm93U3VtKGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXNWaWRlbycsXG4gICAgICBtZXRyaWNOYW1lOiAnR2V0TWVkaWEuTWlsbGlzQmVoaW5kTm93JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBsaXN0RnJhZ21lbnRzTGF0ZW5jeVN1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzVmlkZW8nLFxuICAgICAgbWV0cmljTmFtZTogJ0xpc3RGcmFnbWVudHMuTGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHV0TWVkaWFGcmFnbWVudEluZ2VzdGlvbkxhdGVuY3lTdW0oZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpc1ZpZGVvJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRNZWRpYS5GcmFnbWVudEluZ2VzdGlvbkxhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dE1lZGlhRnJhZ21lbnRQZXJzaXN0TGF0ZW5jeVN1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzVmlkZW8nLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dE1lZGlhLkZyYWdtZW50UGVyc2lzdExhdGVuY3knLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dE1lZGlhSW5jb21pbmdCeXRlc1N1bShkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzVmlkZW8nLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dE1lZGlhLkluY29taW5nQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHB1dE1lZGlhSW5jb21pbmdGcmFtZXNTdW0oZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpc1ZpZGVvJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRNZWRpYS5JbmNvbWluZ0ZyYW1lcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=