"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticMapReduceMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ElasticMapReduceMetrics {
    static appsCompletedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsCompleted',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static appsFailedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static appsKilledSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsKilled',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static appsPendingSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsPending',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static appsRunningSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsRunning',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static appsSubmittedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'AppsSubmitted',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static backupFailedAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'BackupFailed',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static capacityRemainingGbSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'CapacityRemainingGB',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static containerAllocatedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ContainerAllocated',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static containerPendingSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ContainerPending',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static containerPendingRatioSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ContainerPendingRatio',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static containerReservedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ContainerReserved',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static coreNodesPendingAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'CoreNodesPending',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static coreNodesRunningAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'CoreNodesRunning',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static corruptBlocksSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'CorruptBlocks',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static dfsPendingReplicationBlocksSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'DfsPendingReplicationBlocks',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hbaseBackupFailedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'HbaseBackupFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hdfsBytesReadSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'HDFSBytesRead',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hdfsBytesWrittenSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'HDFSBytesWritten',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static hdfsUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'HDFSUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static isIdleAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'IsIdle',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static jobsFailedAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'JobsFailed',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static jobsRunningAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'JobsRunning',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static liveDataNodesAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'LiveDataNodes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static liveTaskTrackersAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'LiveTaskTrackers',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static mapSlotsOpenAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MapSlotsOpen',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static mapTasksRemainingAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MapTasksRemaining',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static mapTasksRunningAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MapTasksRunning',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memoryAllocatedMbSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MemoryAllocatedMB',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static memoryReservedMbSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MemoryReservedMB',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static memoryTotalMbSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MemoryTotalMB',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static missingBlocksAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MissingBlocks',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static mostRecentBackupDurationAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MostRecentBackupDuration',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static mrActiveNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRActiveNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static mrDecommissionedNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRDecommissionedNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static mrLostNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRLostNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static mrRebootedNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRRebootedNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static mrTotalNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRTotalNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static mrUnhealthyNodesSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MRUnhealthyNodes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static multiMasterInstanceGroupNodesRequestedSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MultiMasterInstanceGroupNodesRequested',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static multiMasterInstanceGroupNodesRunningSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MultiMasterInstanceGroupNodesRunning',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static multiMasterInstanceGroupNodesRunningPercentageAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'MultiMasterInstanceGroupNodesRunningPercentage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static pendingDeletionBlocksSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'PendingDeletionBlocks',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static reduceSlotsOpenAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ReduceSlotsOpen',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static reduceTasksRemainingAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ReduceTasksRemaining',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static reduceTasksRunningAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'ReduceTasksRunning',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static remainingMapTasksPerSlotAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'RemainingMapTasksPerSlot',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static s3BytesReadSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'S3BytesRead',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static s3BytesWrittenSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'S3BytesWritten',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static taskNodesPendingAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'TaskNodesPending',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static taskNodesRunningAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'TaskNodesRunning',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static timeSinceLastSuccessfulBackupAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'TimeSinceLastSuccessfulBackup',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalLoadAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'TotalLoad',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static underReplicatedBlocksSum(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'UnderReplicatedBlocks',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static yarnMemoryAvailablePercentageAverage(dimensions) {
        return {
            namespace: 'AWS/ElasticMapReduce',
            metricName: 'YARNMemoryAvailablePercentage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ElasticMapReduceMetrics = ElasticMapReduceMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1yLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVtci1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLHVCQUF1QjtJQUMzQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBaUM7UUFDOUQsT0FBTztZQUNMLFNBQVMsRUFBRSxzQkFBc0I7WUFDakMsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFpQztRQUMzRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsWUFBWTtZQUN4QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQWlDO1FBQzNELE9BQU87WUFDTCxTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBaUM7UUFDNUQsT0FBTztZQUNMLFNBQVMsRUFBRSxzQkFBc0I7WUFDakMsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFpQztRQUM1RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsYUFBYTtZQUN6QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztT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Q0FBQyxVQUFpQztRQUNsRixPQUFPO1lBQ0wsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxVQUFVLEVBQUUsK0JBQStCO1lBQzNDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBemJELDBEQXliQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5leHBvcnQgY2xhc3MgRWxhc3RpY01hcFJlZHVjZU1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGFwcHNDb21wbGV0ZWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBzQ29tcGxldGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhcHBzRmFpbGVkU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQXBwc0ZhaWxlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYXBwc0tpbGxlZFN1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0FwcHNLaWxsZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFwcHNQZW5kaW5nU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQXBwc1BlbmRpbmcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFwcHNSdW5uaW5nU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQXBwc1J1bm5pbmcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFwcHNTdWJtaXR0ZWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBcHBzU3VibWl0dGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBiYWNrdXBGYWlsZWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnQmFja3VwRmFpbGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2FwYWNpdHlSZW1haW5pbmdHYlN1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0NhcGFjaXR5UmVtYWluaW5nR0InLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbnRhaW5lckFsbG9jYXRlZFN1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnRhaW5lckFsbG9jYXRlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29udGFpbmVyUGVuZGluZ1N1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnRhaW5lclBlbmRpbmcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbnRhaW5lclBlbmRpbmdSYXRpb1N1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnRhaW5lclBlbmRpbmdSYXRpbycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29udGFpbmVyUmVzZXJ2ZWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb250YWluZXJSZXNlcnZlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29yZU5vZGVzUGVuZGluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb3JlTm9kZXNQZW5kaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29yZU5vZGVzUnVubmluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb3JlTm9kZXNSdW5uaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29ycnVwdEJsb2Nrc1N1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0NvcnJ1cHRCbG9ja3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRmc1BlbmRpbmdSZXBsaWNhdGlvbkJsb2Nrc1N1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0Rmc1BlbmRpbmdSZXBsaWNhdGlvbkJsb2NrcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGJhc2VCYWNrdXBGYWlsZWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIYmFzZUJhY2t1cEZhaWxlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGRmc0J5dGVzUmVhZFN1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0hERlNCeXRlc1JlYWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGhkZnNCeXRlc1dyaXR0ZW5TdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIREZTQnl0ZXNXcml0dGVuJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBoZGZzVXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSERGU1V0aWxpemF0aW9uJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaXNJZGxlQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0lzSWRsZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGpvYnNGYWlsZWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnSm9ic0ZhaWxlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGpvYnNSdW5uaW5nQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ0pvYnNSdW5uaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbGl2ZURhdGFOb2Rlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdMaXZlRGF0YU5vZGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbGl2ZVRhc2tUcmFja2Vyc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdMaXZlVGFza1RyYWNrZXJzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWFwU2xvdHNPcGVuQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ01hcFNsb3RzT3BlbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1hcFRhc2tzUmVtYWluaW5nQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ01hcFRhc2tzUmVtYWluaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWFwVGFza3NSdW5uaW5nQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ01hcFRhc2tzUnVubmluZycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1lbW9yeUFsbG9jYXRlZE1iU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVtb3J5QWxsb2NhdGVkTUInLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1lbW9yeVJlc2VydmVkTWJTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZW1vcnlSZXNlcnZlZE1CJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtZW1vcnlUb3RhbE1iU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWVtb3J5VG90YWxNQicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWlzc2luZ0Jsb2Nrc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNaXNzaW5nQmxvY2tzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbW9zdFJlY2VudEJhY2t1cER1cmF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ01vc3RSZWNlbnRCYWNrdXBEdXJhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1yQWN0aXZlTm9kZXNTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNUkFjdGl2ZU5vZGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtckRlY29tbWlzc2lvbmVkTm9kZXNTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNUkRlY29tbWlzc2lvbmVkTm9kZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1yTG9zdE5vZGVzU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTVJMb3N0Tm9kZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1yUmVib290ZWROb2Rlc1N1bShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ01SUmVib290ZWROb2RlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbXJUb3RhbE5vZGVzU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTVJUb3RhbE5vZGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtclVuaGVhbHRoeU5vZGVzU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTVJVbmhlYWx0aHlOb2RlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbXVsdGlNYXN0ZXJJbnN0YW5jZUdyb3VwTm9kZXNSZXF1ZXN0ZWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdNdWx0aU1hc3Rlckluc3RhbmNlR3JvdXBOb2Rlc1JlcXVlc3RlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbXVsdGlNYXN0ZXJJbnN0YW5jZUdyb3VwTm9kZXNSdW5uaW5nU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnTXVsdGlNYXN0ZXJJbnN0YW5jZUdyb3VwTm9kZXNSdW5uaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtdWx0aU1hc3Rlckluc3RhbmNlR3JvdXBOb2Rlc1J1bm5pbmdQZXJjZW50YWdlQXZlcmFnZShkaW1lbnNpb25zOiB7IEpvYkZsb3dJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VsYXN0aWNNYXBSZWR1Y2UnLFxuICAgICAgbWV0cmljTmFtZTogJ011bHRpTWFzdGVySW5zdGFuY2VHcm91cE5vZGVzUnVubmluZ1BlcmNlbnRhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwZW5kaW5nRGVsZXRpb25CbG9ja3NTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQZW5kaW5nRGVsZXRpb25CbG9ja3MnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlZHVjZVNsb3RzT3BlbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZWR1Y2VTbG90c09wZW4nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyByZWR1Y2VUYXNrc1JlbWFpbmluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZWR1Y2VUYXNrc1JlbWFpbmluZycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlZHVjZVRhc2tzUnVubmluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZWR1Y2VUYXNrc1J1bm5pbmcnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyByZW1haW5pbmdNYXBUYXNrc1BlclNsb3RBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVtYWluaW5nTWFwVGFza3NQZXJTbG90JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgczNCeXRlc1JlYWRTdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTM0J5dGVzUmVhZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgczNCeXRlc1dyaXR0ZW5TdW0oZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTM0J5dGVzV3JpdHRlbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGFza05vZGVzUGVuZGluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUYXNrTm9kZXNQZW5kaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGFza05vZGVzUnVubmluZ0F2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUYXNrTm9kZXNSdW5uaW5nJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGltZVNpbmNlTGFzdFN1Y2Nlc3NmdWxCYWNrdXBBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnVGltZVNpbmNlTGFzdFN1Y2Nlc3NmdWxCYWNrdXAnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbExvYWRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnVG90YWxMb2FkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdW5kZXJSZXBsaWNhdGVkQmxvY2tzU3VtKGRpbWVuc2lvbnM6IHsgSm9iRmxvd0lkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRWxhc3RpY01hcFJlZHVjZScsXG4gICAgICBtZXRyaWNOYW1lOiAnVW5kZXJSZXBsaWNhdGVkQmxvY2tzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB5YXJuTWVtb3J5QXZhaWxhYmxlUGVyY2VudGFnZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBKb2JGbG93SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FbGFzdGljTWFwUmVkdWNlJyxcbiAgICAgIG1ldHJpY05hbWU6ICdZQVJOTWVtb3J5QXZhaWxhYmxlUGVyY2VudGFnZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuIl19