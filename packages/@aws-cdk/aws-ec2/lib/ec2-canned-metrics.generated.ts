// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

export class EC2CapacityReservationsMetrics {
  public static instanceUtilizationAverage(dimensions: { CapacityReservationId: string }) {
    return {
      namespace: 'AWS/EC2CapacityReservations',
      metricName: 'InstanceUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static usedInstanceCountAverage(dimensions: { CapacityReservationId: string }) {
    return {
      namespace: 'AWS/EC2CapacityReservations',
      metricName: 'UsedInstanceCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static availableInstanceCountAverage(dimensions: { CapacityReservationId: string }) {
    return {
      namespace: 'AWS/EC2CapacityReservations',
      metricName: 'AvailableInstanceCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static totalInstanceCountAverage(dimensions: { CapacityReservationId: string }) {
    return {
      namespace: 'AWS/EC2CapacityReservations',
      metricName: 'TotalInstanceCount',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
export class EBSMetrics {
  public static volumeReadBytesSum(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeReadBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static volumeWriteBytesSum(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeWriteBytes',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static volumeReadOpsSum(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeReadOps',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static volumeTotalReadTimeAverage(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeTotalReadTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static volumeWriteOpsSum(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeWriteOps',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static volumeTotalWriteTimeAverage(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeTotalWriteTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static volumeIdleTimeAverage(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeIdleTime',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static volumeQueueLengthAverage(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'VolumeQueueLength',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static burstBalanceAverage(dimensions: { VolumeId: string }) {
    return {
      namespace: 'AWS/EBS',
      metricName: 'BurstBalance',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
export class EC2Metrics {
  public static cpuCreditUsageAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'CPUCreditUsage',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuCreditBalanceAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'CPUCreditBalance',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuSurplusCreditBalanceAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'CPUSurplusCreditBalance',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuSurplusCreditsChargedAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'CPUSurplusCreditsCharged',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUtilizationAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static cpuUtilizationAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static cpuUtilizationAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static cpuUtilizationAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static cpuUtilizationAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static cpuUtilizationAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'CPUUtilization',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskReadBytesAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static diskReadBytesAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static diskReadBytesAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static diskReadBytesAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static diskReadBytesAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static diskReadBytesAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'DiskReadBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskReadOpsAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static diskReadOpsAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static diskReadOpsAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static diskReadOpsAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static diskReadOpsAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static diskReadOpsAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'DiskReadOps',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskWriteBytesAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static diskWriteBytesAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static diskWriteBytesAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static diskWriteBytesAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static diskWriteBytesAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static diskWriteBytesAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'DiskWriteBytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskWriteOpsAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static diskWriteOpsAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static diskWriteOpsAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static diskWriteOpsAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static diskWriteOpsAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static diskWriteOpsAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'DiskWriteOps',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static metadataNoTokenSum(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static metadataNoTokenSum(dimensions: {  }): MetricWithDims<{  }>;
  public static metadataNoTokenSum(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'MetadataNoToken',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static networkInAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static networkInAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static networkInAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static networkInAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static networkInAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static networkInAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'NetworkIn',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static networkOutAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static networkOutAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static networkOutAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static networkOutAverage(dimensions: { ImageId: string }): MetricWithDims<{ ImageId: string }>;
  public static networkOutAverage(dimensions: { InstanceType: string }): MetricWithDims<{ InstanceType: string }>;
  public static networkOutAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'NetworkOut',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static networkPacketsInAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static networkPacketsInAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static networkPacketsInAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static networkPacketsInAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'NetworkPacketsIn',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static networkPacketsOutAverage(dimensions: { InstanceId: string }): MetricWithDims<{ InstanceId: string }>;
  public static networkPacketsOutAverage(dimensions: {  }): MetricWithDims<{  }>;
  public static networkPacketsOutAverage(dimensions: { AutoScalingGroupName: string }): MetricWithDims<{ AutoScalingGroupName: string }>;
  public static networkPacketsOutAverage(dimensions: any) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'NetworkPacketsOut',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static statusCheckFailedSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'StatusCheckFailed',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static statusCheckFailedInstanceSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'StatusCheckFailed_Instance',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static statusCheckFailedSystemSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'AWS/EC2',
      metricName: 'StatusCheckFailed_System',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
export class CWAgentMetrics {
  public static cpuUsageIdleAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'cpu_usage_idle',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUsageIowaitAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'cpu_usage_iowait',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUsageStealAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'cpu_usage_steal',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUsageSystemAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'cpu_usage_system',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static cpuUsageUserAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'cpu_usage_user',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskInodesFreeSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'disk_inodes_free',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static diskInodesTotalSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'disk_inodes_total',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static diskInodesUsedSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'disk_inodes_used',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static diskUsedPercentAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'disk_used_percent',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskioIoTimeAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'diskio_io_time',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskioReadBytesAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'diskio_read_bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskioReadsAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'diskio_reads',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskioWriteBytesAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'diskio_write_bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static diskioWritesAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'diskio_writes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memCachedAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'mem_cached',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memTotalAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'mem_total',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memUsedAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'mem_used',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static memUsedPercentAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'mem_used_percent',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static netstatTcpEstablishedSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'netstat_tcp_established',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static netstatTcpTimeWaitSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'netstat_tcp_time_wait',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static swapUsedPercentAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'swap_used_percent',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static tcPv4ConnectionsEstablishedSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'TCPv4 Connections Established',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static tcPv6ConnectionsEstablishedSum(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'TCPv6 Connections Established',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static memoryCommittedBytesInUseAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'Memory % Committed Bytes In Use',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static processorIdleTimeAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'Processor % Idle Time',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static processorInterruptTimeAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'Processor % Interrupt Time',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static processorUserTimeAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'Processor % User Time',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static logicalDiskFreeSpaceAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'LogicalDisk % Free Space',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static pagingFileUsageAverage(dimensions: { InstanceId: string }) {
    return {
      namespace: 'CWAgent',
      metricName: 'Paging File % Usage',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
export class NATGatewayMetrics {
  public static activeConnectionCountMaximum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'ActiveConnectionCount',
      dimensionsMap: dimensions,
      statistic: 'Maximum',
    };
  }
  public static packetsDropCountSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'PacketsDropCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesInFromDestinationSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'BytesInFromDestination',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesInFromSourceSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'BytesInFromSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesOutToDestinationSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'BytesOutToDestination',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesOutToSourceSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'BytesOutToSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static connectionAttemptCountSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'ConnectionAttemptCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static connectionEstablishedCountSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'ConnectionEstablishedCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static errorPortAllocationSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'ErrorPortAllocation',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static idleTimeoutCountSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'IdleTimeoutCount',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsInFromDestinationSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'PacketsInFromDestination',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsInFromSourceSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'PacketsInFromSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsOutToDestinationSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'PacketsOutToDestination',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsOutToSourceSum(dimensions: { NatGatewayId: string }) {
    return {
      namespace: 'AWS/NATGateway',
      metricName: 'PacketsOutToSource',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
export class TransitGatewayMetrics {
  public static bytesInSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'BytesIn',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static bytesOutSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'BytesOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetDropCountBlackholeSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'PacketDropCountBlackhole',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetDropCountNoRouteSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'PacketDropCountNoRoute',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsInSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'PacketsIn',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static packetsOutSum(dimensions: { TransitGateway: string }) {
    return {
      namespace: 'AWS/TransitGateway',
      metricName: 'PacketsOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
export class VPNMetrics {
  public static tunnelDataInSum(dimensions: { VpnId: string }) {
    return {
      namespace: 'AWS/VPN',
      metricName: 'TunnelDataIn',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
  public static tunnelStateAverage(dimensions: { VpnId: string }) {
    return {
      namespace: 'AWS/VPN',
      metricName: 'TunnelState',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
  public static tunnelDataOutSum(dimensions: { VpnId: string }) {
    return {
      namespace: 'AWS/VPN',
      metricName: 'TunnelDataOut',
      dimensionsMap: dimensions,
      statistic: 'Sum',
    };
  }
}
type MetricWithDims<D> = { namespace: string, metricName: string, statistic: string, dimensionsMap: D };
