"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECSMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ECSMetrics {
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/ECS',
            metricName: 'CPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/ECS',
            metricName: 'MemoryUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuReservationAverage(dimensions) {
        return {
            namespace: 'AWS/ECS',
            metricName: 'CPUReservation',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryReservationAverage(dimensions) {
        return {
            namespace: 'AWS/ECS',
            metricName: 'MemoryReservation',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static gpuReservationAverage(dimensions) {
        return {
            namespace: 'AWS/ECS',
            metricName: 'GPUReservation',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ECSMetrics = ECSMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFHZCxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBZTtRQUNqRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFHTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBZTtRQUNwRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBbUM7UUFDckUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQW1DO1FBQ3hFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFtQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQTdDRCxnQ0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEVDU01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcsIFNlcnZpY2VOYW1lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2x1c3Rlck5hbWU6IHN0cmluZywgU2VydmljZU5hbWU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBDbHVzdGVyTmFtZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1lbW9yeVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcsIFNlcnZpY2VOYW1lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQ2x1c3Rlck5hbWU6IHN0cmluZywgU2VydmljZU5hbWU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBtZW1vcnlVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBDbHVzdGVyTmFtZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbWVtb3J5VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZW1vcnlVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNwdVJlc2VydmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVSZXNlcnZhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1lbW9yeVJlc2VydmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZW1vcnlSZXNlcnZhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdwdVJlc2VydmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IENsdXN0ZXJOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUNTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHUFVSZXNlcnZhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxudHlwZSBNZXRyaWNXaXRoRGltczxEPiA9IHsgbmFtZXNwYWNlOiBzdHJpbmcsIG1ldHJpY05hbWU6IHN0cmluZywgc3RhdGlzdGljOiBzdHJpbmcsIGRpbWVuc2lvbnNNYXA6IEQgfTtcbiJdfQ==