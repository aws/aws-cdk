"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoboMakerMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class RoboMakerMetrics {
    static vCpuAverage(dimensions) {
        return {
            namespace: 'AWS/RoboMaker',
            metricName: 'vCPU',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryMaximum(dimensions) {
        return {
            namespace: 'AWS/RoboMaker',
            metricName: 'Memory',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static realTimeRatioAverage(dimensions) {
        return {
            namespace: 'AWS/RoboMaker',
            metricName: 'RealTimeRatio',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static simulationUnitSum(dimensions) {
        return {
            namespace: 'AWS/RoboMaker',
            metricName: 'SimulationUnit',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.RoboMakerMetrics = RoboMakerMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9ib21ha2VyLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvYm9tYWtlci1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLGdCQUFnQjtJQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLFVBQXVDO1FBQy9ELE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsTUFBTTtZQUNsQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQXVDO1FBQ2pFLE9BQU87WUFDTCxTQUFTLEVBQUUsZUFBZTtZQUMxQixVQUFVLEVBQUUsUUFBUTtZQUNwQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBdUM7UUFDeEUsT0FBTztZQUNMLFNBQVMsRUFBRSxlQUFlO1lBQzFCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUF1QztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWU7WUFDMUIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQWpDRCw0Q0FpQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIFJvYm9NYWtlck1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIHZDcHVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgU2ltdWxhdGlvbkpvYklkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvUm9ib01ha2VyJyxcbiAgICAgIG1ldHJpY05hbWU6ICd2Q1BVJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtb3J5TWF4aW11bShkaW1lbnNpb25zOiB7IFNpbXVsYXRpb25Kb2JJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvYm9NYWtlcicsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVtb3J5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcmVhbFRpbWVSYXRpb0F2ZXJhZ2UoZGltZW5zaW9uczogeyBTaW11bGF0aW9uSm9iSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9Sb2JvTWFrZXInLFxuICAgICAgbWV0cmljTmFtZTogJ1JlYWxUaW1lUmF0aW8nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBzaW11bGF0aW9uVW5pdFN1bShkaW1lbnNpb25zOiB7IFNpbXVsYXRpb25Kb2JJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1JvYm9NYWtlcicsXG4gICAgICBtZXRyaWNOYW1lOiAnU2ltdWxhdGlvblVuaXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuIl19