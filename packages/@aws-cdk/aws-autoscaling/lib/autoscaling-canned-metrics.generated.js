"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoScalingMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class AutoScalingMetrics {
    static groupTotalInstancesAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupTotalInstances',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupDesiredCapacityAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupDesiredCapacity',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupMaxSizeAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupMaxSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupMinSizeAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupMinSize',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupTerminatingInstancesAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupTerminatingInstances',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupPendingInstancesAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupPendingInstances',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupInServiceInstancesAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupInServiceInstances',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static groupStandbyInstancesAverage(dimensions) {
        return {
            namespace: 'AWS/AutoScaling',
            metricName: 'GroupStandbyInstances',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.AutoScalingMetrics = AutoScalingMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NjYWxpbmctY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0b3NjYWxpbmctY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7OztBQUUvRSw0QkFBNEIsQ0FBQyxpRUFBaUU7QUFFOUYsTUFBYSxrQkFBa0I7SUFDdEIsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFVBQTRDO1FBQ25GLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDJCQUEyQixDQUFDLFVBQTRDO1FBQ3BGLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQTRDO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUE0QztRQUM1RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0NBQWdDLENBQUMsVUFBNEM7UUFDekYsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLDJCQUEyQjtZQUN2QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBNEM7UUFDckYsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsOEJBQThCLENBQUMsVUFBNEM7UUFDdkYsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLHlCQUF5QjtZQUNyQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBNEM7UUFDckYsT0FBTztZQUNMLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQWpFRCxnREFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEF1dG9TY2FsaW5nTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgZ3JvdXBUb3RhbEluc3RhbmNlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0F1dG9TY2FsaW5nJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHcm91cFRvdGFsSW5zdGFuY2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZ3JvdXBEZXNpcmVkQ2FwYWNpdHlBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BdXRvU2NhbGluZycsXG4gICAgICBtZXRyaWNOYW1lOiAnR3JvdXBEZXNpcmVkQ2FwYWNpdHknLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBncm91cE1heFNpemVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BdXRvU2NhbGluZycsXG4gICAgICBtZXRyaWNOYW1lOiAnR3JvdXBNYXhTaXplJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZ3JvdXBNaW5TaXplQXZlcmFnZShkaW1lbnNpb25zOiB7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXV0b1NjYWxpbmcnLFxuICAgICAgbWV0cmljTmFtZTogJ0dyb3VwTWluU2l6ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdyb3VwVGVybWluYXRpbmdJbnN0YW5jZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BdXRvU2NhbGluZycsXG4gICAgICBtZXRyaWNOYW1lOiAnR3JvdXBUZXJtaW5hdGluZ0luc3RhbmNlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdyb3VwUGVuZGluZ0luc3RhbmNlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0F1dG9TY2FsaW5nJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHcm91cFBlbmRpbmdJbnN0YW5jZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBncm91cEluU2VydmljZUluc3RhbmNlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0F1dG9TY2FsaW5nJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHcm91cEluU2VydmljZUluc3RhbmNlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGdyb3VwU3RhbmRieUluc3RhbmNlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0F1dG9TY2FsaW5nJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHcm91cFN0YW5kYnlJbnN0YW5jZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==