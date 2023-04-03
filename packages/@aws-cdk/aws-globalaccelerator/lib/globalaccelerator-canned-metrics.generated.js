"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAcceleratorMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class GlobalAcceleratorMetrics {
    static newFlowCountSum(dimensions) {
        return {
            namespace: 'AWS/GlobalAccelerator',
            metricName: 'NewFlowCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesInSum(dimensions) {
        return {
            namespace: 'AWS/GlobalAccelerator',
            metricName: 'ProcessedBytesIn',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesOutSum(dimensions) {
        return {
            namespace: 'AWS/GlobalAccelerator',
            metricName: 'ProcessedBytesOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.GlobalAcceleratorMetrics = GlobalAcceleratorMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsYWNjZWxlcmF0b3ItY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xvYmFsYWNjZWxlcmF0b3ItY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSx3QkFBd0I7SUFDNUIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFtQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLHVCQUF1QjtZQUNsQyxVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBbUM7UUFDbkUsT0FBTztZQUNMLFNBQVMsRUFBRSx1QkFBdUI7WUFDbEMsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBbUM7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSx1QkFBdUI7WUFDbEMsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpCRCw0REF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEdsb2JhbEFjY2VsZXJhdG9yTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgbmV3Rmxvd0NvdW50U3VtKGRpbWVuc2lvbnM6IHsgQWNjZWxlcmF0b3I6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HbG9iYWxBY2NlbGVyYXRvcicsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV3Rmxvd0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc0luU3VtKGRpbWVuc2lvbnM6IHsgQWNjZWxlcmF0b3I6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HbG9iYWxBY2NlbGVyYXRvcicsXG4gICAgICBtZXRyaWNOYW1lOiAnUHJvY2Vzc2VkQnl0ZXNJbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNPdXRTdW0oZGltZW5zaW9uczogeyBBY2NlbGVyYXRvcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0dsb2JhbEFjY2VsZXJhdG9yJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQcm9jZXNzZWRCeXRlc091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG4iXX0=