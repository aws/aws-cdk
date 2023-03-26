"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoT1ClickMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class IoT1ClickMetrics {
    static totalEventsSum(dimensions) {
        return {
            namespace: 'AWS/IoT1Click',
            metricName: 'TotalEvents',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static remainingLifeAverage(dimensions) {
        return {
            namespace: 'AWS/IoT1Click',
            metricName: 'RemainingLife',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static callbackInvocationErrorsSum(dimensions) {
        return {
            namespace: 'AWS/IoT1Click',
            metricName: 'CallbackInvocationErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.IoT1ClickMetrics = IoT1ClickMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW90MWNsaWNrLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlvdDFjbGljay1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsY0FBYyxDQUFDLFVBQWtDO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsYUFBYTtZQUN6QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBa0M7UUFDbkUsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxVQUFrQztRQUMxRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpCRCw0Q0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIElvVDFDbGlja01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIHRvdGFsRXZlbnRzU3VtKGRpbWVuc2lvbnM6IHsgRGV2aWNlVHlwZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0lvVDFDbGljaycsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxFdmVudHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlbWFpbmluZ0xpZmVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgRGV2aWNlVHlwZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0lvVDFDbGljaycsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVtYWluaW5nTGlmZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNhbGxiYWNrSW52b2NhdGlvbkVycm9yc1N1bShkaW1lbnNpb25zOiB7IERldmljZVR5cGU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Jb1QxQ2xpY2snLFxuICAgICAgbWV0cmljTmFtZTogJ0NhbGxiYWNrSW52b2NhdGlvbkVycm9ycycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=