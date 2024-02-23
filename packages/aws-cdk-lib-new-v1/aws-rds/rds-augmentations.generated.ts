// Copyright 2012-2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
/* eslint-disable prettier/prettier,max-len */
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { DatabaseClusterBase } from "./cluster";
import { DatabaseInstanceBase } from "./instance";

declare module "./cluster-ref" {
  interface IDatabaseCluster {
    /**
     * Return the given named metric for this DBCluster
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The percentage of CPU utilization.
     *
     * Average over 5 minutes
     */
    metricCPUUtilization(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of database connections in use.
     *
     * Average over 5 minutes
     */
    metricDatabaseConnections(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of deadlocks in the database per second.
     *
     * Average over 5 minutes
     */
    metricDeadlocks(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of time that the instance has been running, in seconds.
     *
     * Average over 5 minutes
     */
    metricEngineUptime(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available random access memory, in bytes.
     *
     * Average over 5 minutes
     */
    metricFreeableMemory(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of local storage available, in bytes.
     *
     * Average over 5 minutes
     */
    metricFreeLocalStorage(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput received from clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkReceiveThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput both received from and transmitted to clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput sent to clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkTransmitThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The total amount of backup storage in bytes consumed by all Aurora snapshots outside its backup retention window.
     *
     * Average over 5 minutes
     */
    metricSnapshotStorageUsed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The total amount of backup storage in bytes for which you are billed.
     *
     * Average over 5 minutes
     */
    metricTotalBackupStorageBilled(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of storage used by your Aurora DB instance, in bytes.
     *
     * Average over 5 minutes
     */
    metricVolumeBytesUsed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of billed read I/O operations from a cluster volume, reported at 5-minute intervals.
     *
     * Average over 5 minutes
     */
    metricVolumeReadIOPs(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of write disk I/O operations to the cluster volume, reported at 5-minute intervals.
     *
     * Average over 5 minutes
     */
    metricVolumeWriteIOPs(props?: cw.MetricOptions): cw.Metric;
  }
}



declare module "./cluster" {
  interface DatabaseClusterBase {
    /**
     * Return the given named metric for this DBCluster
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The percentage of CPU utilization.
     *
     * Average over 5 minutes
     */
    metricCPUUtilization(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of database connections in use.
     *
     * Average over 5 minutes
     */
    metricDatabaseConnections(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of deadlocks in the database per second.
     *
     * Average over 5 minutes
     */
    metricDeadlocks(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of time that the instance has been running, in seconds.
     *
     * Average over 5 minutes
     */
    metricEngineUptime(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available random access memory, in bytes.
     *
     * Average over 5 minutes
     */
    metricFreeableMemory(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of local storage available, in bytes.
     *
     * Average over 5 minutes
     */
    metricFreeLocalStorage(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput received from clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkReceiveThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput both received from and transmitted to clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of network throughput sent to clients by each instance, in bytes per second.
     *
     * Average over 5 minutes
     */
    metricNetworkTransmitThroughput(props?: cw.MetricOptions): cw.Metric;

    /**
     * The total amount of backup storage in bytes consumed by all Aurora snapshots outside its backup retention window.
     *
     * Average over 5 minutes
     */
    metricSnapshotStorageUsed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The total amount of backup storage in bytes for which you are billed.
     *
     * Average over 5 minutes
     */
    metricTotalBackupStorageBilled(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of storage used by your Aurora DB instance, in bytes.
     *
     * Average over 5 minutes
     */
    metricVolumeBytesUsed(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of billed read I/O operations from a cluster volume, reported at 5-minute intervals.
     *
     * Average over 5 minutes
     */
    metricVolumeReadIOPs(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of write disk I/O operations to the cluster volume, reported at 5-minute intervals.
     *
     * Average over 5 minutes
     */
    metricVolumeWriteIOPs(props?: cw.MetricOptions): cw.Metric;
  }
}

DatabaseClusterBase.prototype.metric = function(metricName: string, props?: cw.MetricOptions) {
  return new cw.Metric({
    "namespace": "AWS/RDS",
    "metricName": metricName,
    "dimensionsMap": {
      "DBClusterIdentifier": this.clusterIdentifier
    },
    ...props
  }).attachTo(this);
};
DatabaseClusterBase.prototype.metricCPUUtilization = function(props?: cw.MetricOptions) {
  return this.metric("CPUUtilization", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricDatabaseConnections = function(props?: cw.MetricOptions) {
  return this.metric("DatabaseConnections", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricDeadlocks = function(props?: cw.MetricOptions) {
  return this.metric("Deadlocks", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricEngineUptime = function(props?: cw.MetricOptions) {
  return this.metric("EngineUptime", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricFreeableMemory = function(props?: cw.MetricOptions) {
  return this.metric("FreeableMemory", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricFreeLocalStorage = function(props?: cw.MetricOptions) {
  return this.metric("FreeLocalStorage", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricNetworkReceiveThroughput = function(props?: cw.MetricOptions) {
  return this.metric("NetworkReceiveThroughput", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricNetworkThroughput = function(props?: cw.MetricOptions) {
  return this.metric("NetworkThroughput", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricNetworkTransmitThroughput = function(props?: cw.MetricOptions) {
  return this.metric("NetworkTransmitThroughput", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricSnapshotStorageUsed = function(props?: cw.MetricOptions) {
  return this.metric("SnapshotStorageUsed", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricTotalBackupStorageBilled = function(props?: cw.MetricOptions) {
  return this.metric("TotalBackupStorageBilled", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricVolumeBytesUsed = function(props?: cw.MetricOptions) {
  return this.metric("VolumeBytesUsed", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricVolumeReadIOPs = function(props?: cw.MetricOptions) {
  return this.metric("VolumeReadIOPs", {
    "statistic": "Average",
    ...props
  });
};
DatabaseClusterBase.prototype.metricVolumeWriteIOPs = function(props?: cw.MetricOptions) {
  return this.metric("VolumeWriteIOPs", {
    "statistic": "Average",
    ...props
  });
};

declare module "./instance" {
  interface IDatabaseInstance {
    /**
     * Return the given named metric for this DBInstance
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The percentage of CPU utilization.
     *
     * Average over 5 minutes
     */
    metricCPUUtilization(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of database connections in use.
     *
     * Average over 5 minutes
     */
    metricDatabaseConnections(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available storage space.
     *
     * Average over 5 minutes
     */
    metricFreeStorageSpace(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available random access memory.
     *
     * Average over 5 minutes
     */
    metricFreeableMemory(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of disk read I/O operations per second.
     *
     * Average over 5 minutes
     */
    metricWriteIOPS(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of disk write I/O operations per second.
     *
     * Average over 5 minutes
     */
    metricReadIOPS(props?: cw.MetricOptions): cw.Metric;
  }
}



declare module "./instance" {
  interface DatabaseInstanceBase {
    /**
     * Return the given named metric for this DBInstance
     */
    metric(metricName: string, props?: cw.MetricOptions): cw.Metric;

    /**
     * The percentage of CPU utilization.
     *
     * Average over 5 minutes
     */
    metricCPUUtilization(props?: cw.MetricOptions): cw.Metric;

    /**
     * The number of database connections in use.
     *
     * Average over 5 minutes
     */
    metricDatabaseConnections(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available storage space.
     *
     * Average over 5 minutes
     */
    metricFreeStorageSpace(props?: cw.MetricOptions): cw.Metric;

    /**
     * The amount of available random access memory.
     *
     * Average over 5 minutes
     */
    metricFreeableMemory(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of disk read I/O operations per second.
     *
     * Average over 5 minutes
     */
    metricWriteIOPS(props?: cw.MetricOptions): cw.Metric;

    /**
     * The average number of disk write I/O operations per second.
     *
     * Average over 5 minutes
     */
    metricReadIOPS(props?: cw.MetricOptions): cw.Metric;
  }
}

DatabaseInstanceBase.prototype.metric = function(metricName: string, props?: cw.MetricOptions) {
  return new cw.Metric({
    "namespace": "AWS/RDS",
    "metricName": metricName,
    "dimensionsMap": {
      "DBInstanceIdentifier": this.instanceIdentifier
    },
    ...props
  }).attachTo(this);
};
DatabaseInstanceBase.prototype.metricCPUUtilization = function(props?: cw.MetricOptions) {
  return this.metric("CPUUtilization", {
    "statistic": "Average",
    ...props
  });
};
DatabaseInstanceBase.prototype.metricDatabaseConnections = function(props?: cw.MetricOptions) {
  return this.metric("DatabaseConnections", {
    "statistic": "Average",
    ...props
  });
};
DatabaseInstanceBase.prototype.metricFreeStorageSpace = function(props?: cw.MetricOptions) {
  return this.metric("FreeStorageSpace", {
    "statistic": "Average",
    ...props
  });
};
DatabaseInstanceBase.prototype.metricFreeableMemory = function(props?: cw.MetricOptions) {
  return this.metric("FreeableMemory", {
    "statistic": "Average",
    ...props
  });
};
DatabaseInstanceBase.prototype.metricWriteIOPS = function(props?: cw.MetricOptions) {
  return this.metric("WriteIOPS", {
    "statistic": "Average",
    ...props
  });
};
DatabaseInstanceBase.prototype.metricReadIOPS = function(props?: cw.MetricOptions) {
  return this.metric("ReadIOPS", {
    "statistic": "Average",
    ...props
  });
};