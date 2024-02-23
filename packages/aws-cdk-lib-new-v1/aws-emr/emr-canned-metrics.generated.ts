/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ElasticMapReduceMetrics {
  public static appsCompletedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsCompleted",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static appsFailedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsFailed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static appsKilledSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsKilled",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static appsPendingSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsPending",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static appsRunningSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsRunning",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static appsSubmittedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "AppsSubmitted",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static backupFailedAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "BackupFailed",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static capacityRemainingGbSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "CapacityRemainingGB",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static containerAllocatedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ContainerAllocated",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static containerPendingSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ContainerPending",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static containerPendingRatioSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ContainerPendingRatio",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static containerReservedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ContainerReserved",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static coreNodesPendingAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "CoreNodesPending",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static coreNodesRunningAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "CoreNodesRunning",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static corruptBlocksSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "CorruptBlocks",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static dfsPendingReplicationBlocksSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "DfsPendingReplicationBlocks",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hbaseBackupFailedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "HbaseBackupFailed",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hdfsBytesReadSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "HDFSBytesRead",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hdfsBytesWrittenSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "HDFSBytesWritten",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static hdfsUtilizationAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "HDFSUtilization",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static isIdleAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "IsIdle",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static jobsFailedAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "JobsFailed",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static jobsRunningAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "JobsRunning",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static liveDataNodesAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "LiveDataNodes",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static liveTaskTrackersAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "LiveTaskTrackers",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static mapSlotsOpenAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MapSlotsOpen",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static mapTasksRemainingAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MapTasksRemaining",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static mapTasksRunningAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MapTasksRunning",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static memoryAllocatedMbSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MemoryAllocatedMB",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static memoryReservedMbSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MemoryReservedMB",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static memoryTotalMbSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MemoryTotalMB",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static missingBlocksAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MissingBlocks",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static mostRecentBackupDurationAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MostRecentBackupDuration",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static mrActiveNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRActiveNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static mrDecommissionedNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRDecommissionedNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static mrLostNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRLostNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static mrRebootedNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRRebootedNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static mrTotalNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRTotalNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static mrUnhealthyNodesSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MRUnhealthyNodes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static multiMasterInstanceGroupNodesRequestedSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MultiMasterInstanceGroupNodesRequested",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static multiMasterInstanceGroupNodesRunningSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MultiMasterInstanceGroupNodesRunning",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static multiMasterInstanceGroupNodesRunningPercentageAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "MultiMasterInstanceGroupNodesRunningPercentage",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static pendingDeletionBlocksSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "PendingDeletionBlocks",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static reduceSlotsOpenAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ReduceSlotsOpen",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static reduceTasksRemainingAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ReduceTasksRemaining",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static reduceTasksRunningAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "ReduceTasksRunning",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static remainingMapTasksPerSlotAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "RemainingMapTasksPerSlot",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static s3BytesReadSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "S3BytesRead",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static s3BytesWrittenSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "S3BytesWritten",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static taskNodesPendingAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "TaskNodesPending",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static taskNodesRunningAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "TaskNodesRunning",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static timeSinceLastSuccessfulBackupAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "TimeSinceLastSuccessfulBackup",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static totalLoadAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "TotalLoad",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static underReplicatedBlocksSum(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "UnderReplicatedBlocks",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static yarnMemoryAvailablePercentageAverage(dimensions: { JobFlowId: string; }): MetricWithDims<{ JobFlowId: string; }> {
    return {
      "namespace": "AWS/ElasticMapReduce",
      "metricName": "YARNMemoryAvailablePercentage",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}