"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.VPNMetrics = exports.TransitGatewayMetrics = exports.NATGatewayMetrics = exports.CWAgentMetrics = exports.EC2Metrics = exports.EBSMetrics = exports.EC2CapacityReservationsMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class EC2CapacityReservationsMetrics {
    static instanceUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/EC2CapacityReservations',
            metricName: 'InstanceUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static usedInstanceCountAverage(dimensions) {
        return {
            namespace: 'AWS/EC2CapacityReservations',
            metricName: 'UsedInstanceCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static availableInstanceCountAverage(dimensions) {
        return {
            namespace: 'AWS/EC2CapacityReservations',
            metricName: 'AvailableInstanceCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static totalInstanceCountAverage(dimensions) {
        return {
            namespace: 'AWS/EC2CapacityReservations',
            metricName: 'TotalInstanceCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.EC2CapacityReservationsMetrics = EC2CapacityReservationsMetrics;
class EBSMetrics {
    static volumeReadBytesSum(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeReadBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static volumeWriteBytesSum(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeWriteBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static volumeReadOpsSum(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeReadOps',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static volumeTotalReadTimeAverage(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeTotalReadTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static volumeWriteOpsSum(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeWriteOps',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static volumeTotalWriteTimeAverage(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeTotalWriteTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static volumeIdleTimeAverage(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeIdleTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static volumeQueueLengthAverage(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'VolumeQueueLength',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static burstBalanceAverage(dimensions) {
        return {
            namespace: 'AWS/EBS',
            metricName: 'BurstBalance',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.EBSMetrics = EBSMetrics;
class EC2Metrics {
    static cpuCreditUsageAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'CPUCreditUsage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuCreditBalanceAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'CPUCreditBalance',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuSurplusCreditBalanceAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'CPUSurplusCreditBalance',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuSurplusCreditsChargedAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'CPUSurplusCreditsCharged',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUtilizationAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'CPUUtilization',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskReadBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'DiskReadBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskReadOpsAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'DiskReadOps',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskWriteBytesAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'DiskWriteBytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskWriteOpsAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'DiskWriteOps',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static metadataNoTokenSum(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'MetadataNoToken',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static networkInAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'NetworkIn',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkOutAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'NetworkOut',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkPacketsInAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'NetworkPacketsIn',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static networkPacketsOutAverage(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'NetworkPacketsOut',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static statusCheckFailedSum(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'StatusCheckFailed',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static statusCheckFailedInstanceSum(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'StatusCheckFailed_Instance',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static statusCheckFailedSystemSum(dimensions) {
        return {
            namespace: 'AWS/EC2',
            metricName: 'StatusCheckFailed_System',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.EC2Metrics = EC2Metrics;
class CWAgentMetrics {
    static cpuUsageIdleAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'cpu_usage_idle',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUsageIowaitAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'cpu_usage_iowait',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUsageStealAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'cpu_usage_steal',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUsageSystemAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'cpu_usage_system',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static cpuUsageUserAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'cpu_usage_user',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskInodesFreeSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'disk_inodes_free',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static diskInodesTotalSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'disk_inodes_total',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static diskInodesUsedSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'disk_inodes_used',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static diskUsedPercentAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'disk_used_percent',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskioIoTimeAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'diskio_io_time',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskioReadBytesAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'diskio_read_bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskioReadsAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'diskio_reads',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskioWriteBytesAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'diskio_write_bytes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static diskioWritesAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'diskio_writes',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memCachedAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'mem_cached',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memTotalAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'mem_total',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memUsedAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'mem_used',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static memUsedPercentAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'mem_used_percent',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static netstatTcpEstablishedSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'netstat_tcp_established',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static netstatTcpTimeWaitSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'netstat_tcp_time_wait',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static swapUsedPercentAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'swap_used_percent',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static tcPv4ConnectionsEstablishedSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'TCPv4 Connections Established',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static tcPv6ConnectionsEstablishedSum(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'TCPv6 Connections Established',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static memoryCommittedBytesInUseAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'Memory % Committed Bytes In Use',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static processorIdleTimeAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'Processor % Idle Time',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static processorInterruptTimeAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'Processor % Interrupt Time',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static processorUserTimeAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'Processor % User Time',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static logicalDiskFreeSpaceAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'LogicalDisk % Free Space',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static pagingFileUsageAverage(dimensions) {
        return {
            namespace: 'CWAgent',
            metricName: 'Paging File % Usage',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.CWAgentMetrics = CWAgentMetrics;
class NATGatewayMetrics {
    static activeConnectionCountMaximum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'ActiveConnectionCount',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
    static packetsDropCountSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'PacketsDropCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesInFromDestinationSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesInFromDestination',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesInFromSourceSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesInFromSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesOutToDestinationSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesOutToDestination',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesOutToSourceSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'BytesOutToSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static connectionAttemptCountSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'ConnectionAttemptCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static connectionEstablishedCountSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'ConnectionEstablishedCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static errorPortAllocationSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'ErrorPortAllocation',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static idleTimeoutCountSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'IdleTimeoutCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsInFromDestinationSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'PacketsInFromDestination',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsInFromSourceSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'PacketsInFromSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsOutToDestinationSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'PacketsOutToDestination',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsOutToSourceSum(dimensions) {
        return {
            namespace: 'AWS/NATGateway',
            metricName: 'PacketsOutToSource',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.NATGatewayMetrics = NATGatewayMetrics;
class TransitGatewayMetrics {
    static bytesInSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'BytesIn',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static bytesOutSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'BytesOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetDropCountBlackholeSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'PacketDropCountBlackhole',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetDropCountNoRouteSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'PacketDropCountNoRoute',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsInSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'PacketsIn',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static packetsOutSum(dimensions) {
        return {
            namespace: 'AWS/TransitGateway',
            metricName: 'PacketsOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.TransitGatewayMetrics = TransitGatewayMetrics;
class VPNMetrics {
    static tunnelDataInSum(dimensions) {
        return {
            namespace: 'AWS/VPN',
            metricName: 'TunnelDataIn',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static tunnelStateAverage(dimensions) {
        return {
            namespace: 'AWS/VPN',
            metricName: 'TunnelState',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static tunnelDataOutSum(dimensions) {
        return {
            namespace: 'AWS/VPN',
            metricName: 'TunnelDataOut',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.VPNMetrics = VPNMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjMi1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLDhCQUE4QjtJQUNsQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsVUFBNkM7UUFDcEYsT0FBTztZQUNMLFNBQVMsRUFBRSw2QkFBNkI7WUFDeEMsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBNkM7UUFDbEYsT0FBTztZQUNMLFNBQVMsRUFBRSw2QkFBNkI7WUFDeEMsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsNkJBQTZCLENBQUMsVUFBNkM7UUFDdkYsT0FBTztZQUNMLFNBQVMsRUFBRSw2QkFBNkI7WUFDeEMsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBNkM7UUFDbkYsT0FBTztZQUNMLFNBQVMsRUFBRSw2QkFBNkI7WUFDeEMsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQWpDRCx3RUFpQ0M7QUFDRCxNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBZ0M7UUFDL0QsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWdDO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFnQztRQUM3RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDBCQUEwQixDQUFDLFVBQWdDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFnQztRQUM5RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMkJBQTJCLENBQUMsVUFBZ0M7UUFDeEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxzQkFBc0I7WUFDbEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQWdDO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFnQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBZ0M7UUFDaEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtDQUNGO0FBekVELGdDQXlFQztBQUNELE1BQWEsVUFBVTtJQUNkLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFrQztRQUNwRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBa0M7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDhCQUE4QixDQUFDLFVBQWtDO1FBQzdFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUseUJBQXlCO1lBQ3JDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxVQUFrQztRQUM5RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFNTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBZTtRQUNqRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFNTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBZTtRQUNoRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBTU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQWU7UUFDOUMsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQU1NLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFlO1FBQ2pELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQU1NLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFlO1FBQy9DLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFHTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBZTtRQUM5QyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFNTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBZTtRQUM1QyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLFdBQVc7WUFDdkIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBTU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQWU7UUFDN0MsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUlNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFlO1FBQ25ELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUlNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFlO1FBQ3BELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBa0M7UUFDM0UsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSw0QkFBNEI7WUFDeEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDBCQUEwQixDQUFDLFVBQWtDO1FBQ3pFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBcExELGdDQW9MQztBQUNELE1BQWEsY0FBYztJQUNsQixNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBa0M7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHFCQUFxQixDQUFDLFVBQWtDO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFrQztRQUNuRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBa0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQWtDO1FBQ2xFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFrQztRQUNoRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBa0M7UUFDakUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQWtDO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFrQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBa0M7UUFDbEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQWtDO1FBQ3JFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFrQztRQUNqRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQWtDO1FBQ3RFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsb0JBQW9CO1lBQ2hDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFrQztRQUNsRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQWtDO1FBQy9ELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsWUFBWTtZQUN4QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQWtDO1FBQzlELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsV0FBVztZQUN2QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQWtDO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsVUFBVTtZQUN0QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBa0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQWtDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUseUJBQXlCO1lBQ3JDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFrQztRQUNwRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBa0M7UUFDckUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDhCQUE4QixDQUFDLFVBQWtDO1FBQzdFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsK0JBQStCO1lBQzNDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxVQUFrQztRQUM3RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLCtCQUErQjtZQUMzQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsZ0NBQWdDLENBQUMsVUFBa0M7UUFDL0UsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxpQ0FBaUM7WUFDN0MsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQWtDO1FBQ3ZFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxVQUFrQztRQUM1RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLDRCQUE0QjtZQUN4QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBa0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSx1QkFBdUI7WUFDbkMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDJCQUEyQixDQUFDLFVBQWtDO1FBQzFFLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFrQztRQUNyRSxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7Q0FDRjtBQXpPRCx3Q0F5T0M7QUFDRCxNQUFhLGlCQUFpQjtJQUNyQixNQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBb0M7UUFDN0UsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBb0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBb0M7UUFDMUUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBb0M7UUFDckUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBb0M7UUFDekUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHVCQUF1QjtZQUNuQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBb0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBb0M7UUFDMUUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHdCQUF3QjtZQUNwQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsNkJBQTZCLENBQUMsVUFBb0M7UUFDOUUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLDRCQUE0QjtZQUN4QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBb0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsVUFBb0M7UUFDcEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMkJBQTJCLENBQUMsVUFBb0M7UUFDNUUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLDBCQUEwQjtZQUN0QyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBb0M7UUFDdkUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsVUFBb0M7UUFDM0UsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLHlCQUF5QjtZQUNyQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBb0M7UUFDdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQWpIRCw4Q0FpSEM7QUFDRCxNQUFhLHFCQUFxQjtJQUN6QixNQUFNLENBQUMsVUFBVSxDQUFDLFVBQXNDO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBc0M7UUFDOUQsT0FBTztZQUNMLFNBQVMsRUFBRSxvQkFBb0I7WUFDL0IsVUFBVSxFQUFFLFVBQVU7WUFDdEIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLDJCQUEyQixDQUFDLFVBQXNDO1FBQzlFLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSwwQkFBMEI7WUFDdEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQXNDO1FBQzVFLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFzQztRQUMvRCxPQUFPO1lBQ0wsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixVQUFVLEVBQUUsV0FBVztZQUN2QixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQXNDO1FBQ2hFLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxZQUFZO1lBQ3hCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtDQUNGO0FBakRELHNEQWlEQztBQUNELE1BQWEsVUFBVTtJQUNkLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBNkI7UUFDekQsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUE2QjtRQUM1RCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQTZCO1FBQzFELE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsZUFBZTtZQUMzQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpCRCxnQ0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIEVDMkNhcGFjaXR5UmVzZXJ2YXRpb25zTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBDYXBhY2l0eVJlc2VydmF0aW9uSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQzJDYXBhY2l0eVJlc2VydmF0aW9ucycsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5zdGFuY2VVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHVzZWRJbnN0YW5jZUNvdW50QXZlcmFnZShkaW1lbnNpb25zOiB7IENhcGFjaXR5UmVzZXJ2YXRpb25JZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMkNhcGFjaXR5UmVzZXJ2YXRpb25zJyxcbiAgICAgIG1ldHJpY05hbWU6ICdVc2VkSW5zdGFuY2VDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGF2YWlsYWJsZUluc3RhbmNlQ291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FwYWNpdHlSZXNlcnZhdGlvbklkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyQ2FwYWNpdHlSZXNlcnZhdGlvbnMnLFxuICAgICAgbWV0cmljTmFtZTogJ0F2YWlsYWJsZUluc3RhbmNlQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0b3RhbEluc3RhbmNlQ291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQ2FwYWNpdHlSZXNlcnZhdGlvbklkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyQ2FwYWNpdHlSZXNlcnZhdGlvbnMnLFxuICAgICAgbWV0cmljTmFtZTogJ1RvdGFsSW5zdGFuY2VDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIEVCU01ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIHZvbHVtZVJlYWRCeXRlc1N1bShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVSZWFkQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHZvbHVtZVdyaXRlQnl0ZXNTdW0oZGltZW5zaW9uczogeyBWb2x1bWVJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VCUycsXG4gICAgICBtZXRyaWNOYW1lOiAnVm9sdW1lV3JpdGVCeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdm9sdW1lUmVhZE9wc1N1bShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVSZWFkT3BzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB2b2x1bWVUb3RhbFJlYWRUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVUb3RhbFJlYWRUaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdm9sdW1lV3JpdGVPcHNTdW0oZGltZW5zaW9uczogeyBWb2x1bWVJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VCUycsXG4gICAgICBtZXRyaWNOYW1lOiAnVm9sdW1lV3JpdGVPcHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHZvbHVtZVRvdGFsV3JpdGVUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVUb3RhbFdyaXRlVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHZvbHVtZUlkbGVUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVJZGxlVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHZvbHVtZVF1ZXVlTGVuZ3RoQXZlcmFnZShkaW1lbnNpb25zOiB7IFZvbHVtZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUJTJyxcbiAgICAgIG1ldHJpY05hbWU6ICdWb2x1bWVRdWV1ZUxlbmd0aCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ1cnN0QmFsYW5jZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBWb2x1bWVJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VCUycsXG4gICAgICBtZXRyaWNOYW1lOiAnQnVyc3RCYWxhbmNlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG5leHBvcnQgY2xhc3MgRUMyTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgY3B1Q3JlZGl0VXNhZ2VBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMicsXG4gICAgICBtZXRyaWNOYW1lOiAnQ1BVQ3JlZGl0VXNhZ2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVDcmVkaXRCYWxhbmNlQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQzInLFxuICAgICAgbWV0cmljTmFtZTogJ0NQVUNyZWRpdEJhbGFuY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVTdXJwbHVzQ3JlZGl0QmFsYW5jZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVTdXJwbHVzQ3JlZGl0QmFsYW5jZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNwdVN1cnBsdXNDcmVkaXRzQ2hhcmdlZEF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVTdXJwbHVzQ3JlZGl0c0NoYXJnZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVVdGlsaXphdGlvbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNwdVV0aWxpemF0aW9uQXZlcmFnZShkaW1lbnNpb25zOiB7IEltYWdlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbWFnZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXRpbGl6YXRpb25BdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDUFVVdGlsaXphdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRpc2tSZWFkQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEluc3RhbmNlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrUmVhZEJ5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBJbWFnZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW1hZ2VJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRpc2tSZWFkQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQzInLFxuICAgICAgbWV0cmljTmFtZTogJ0Rpc2tSZWFkQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNrUmVhZE9wc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRpc2tSZWFkT3BzQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRPcHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGRpc2tSZWFkT3BzQXZlcmFnZShkaW1lbnNpb25zOiB7IEltYWdlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbWFnZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRPcHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1JlYWRPcHNBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEaXNrUmVhZE9wcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRpc2tXcml0ZUJ5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrV3JpdGVCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW1hZ2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEltYWdlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrV3JpdGVCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZVR5cGU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZVR5cGU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrV3JpdGVCeXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQzInLFxuICAgICAgbWV0cmljTmFtZTogJ0Rpc2tXcml0ZUJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlT3BzQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlT3BzQXZlcmFnZShkaW1lbnNpb25zOiB7ICB9KTogTWV0cmljV2l0aERpbXM8eyAgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlT3BzQXZlcmFnZShkaW1lbnNpb25zOiB7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrV3JpdGVPcHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW1hZ2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEltYWdlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBkaXNrV3JpdGVPcHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VUeXBlOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGlza1dyaXRlT3BzQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMicsXG4gICAgICBtZXRyaWNOYW1lOiAnRGlza1dyaXRlT3BzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWV0YWRhdGFOb1Rva2VuU3VtKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEluc3RhbmNlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBtZXRhZGF0YU5vVG9rZW5TdW0oZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG1ldGFkYXRhTm9Ub2tlblN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMicsXG4gICAgICBtZXRyaWNOYW1lOiAnTWV0YWRhdGFOb1Rva2VuJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEluc3RhbmNlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtJbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbWFnZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW1hZ2VJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtJbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZVR5cGU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZVR5cGU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrSW5BdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrSW4nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrT3V0QXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya091dEF2ZXJhZ2UoZGltZW5zaW9uczogeyAgfSk6IE1ldHJpY1dpdGhEaW1zPHsgIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW1hZ2VJZDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEltYWdlSWQ6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrT3V0QXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlVHlwZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEluc3RhbmNlVHlwZTogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrT3V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya1BhY2tldHNJbkF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgSW5zdGFuY2VJZDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzSW5BdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrUGFja2V0c0luQXZlcmFnZShkaW1lbnNpb25zOiB7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXV0b1NjYWxpbmdHcm91cE5hbWU6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrUGFja2V0c0luQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMicsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV0d29ya1BhY2tldHNJbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHdvcmtQYWNrZXRzT3V0QXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBJbnN0YW5jZUlkOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya1BhY2tldHNPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgIH0pOiBNZXRyaWNXaXRoRGltczx7ICB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrUGFja2V0c091dEF2ZXJhZ2UoZGltZW5zaW9uczogeyBBdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV0d29ya1BhY2tldHNPdXRBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXR3b3JrUGFja2V0c091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHN0YXR1c0NoZWNrRmFpbGVkU3VtKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDMicsXG4gICAgICBtZXRyaWNOYW1lOiAnU3RhdHVzQ2hlY2tGYWlsZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHN0YXR1c0NoZWNrRmFpbGVkSW5zdGFuY2VTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTdGF0dXNDaGVja0ZhaWxlZF9JbnN0YW5jZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgc3RhdHVzQ2hlY2tGYWlsZWRTeXN0ZW1TdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvRUMyJyxcbiAgICAgIG1ldHJpY05hbWU6ICdTdGF0dXNDaGVja0ZhaWxlZF9TeXN0ZW0nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIENXQWdlbnRNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBjcHVVc2FnZUlkbGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnY3B1X3VzYWdlX2lkbGUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVVc2FnZUlvd2FpdEF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdjcHVfdXNhZ2VfaW93YWl0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXNhZ2VTdGVhbEF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdjcHVfdXNhZ2Vfc3RlYWwnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjcHVVc2FnZVN5c3RlbUF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdjcHVfdXNhZ2Vfc3lzdGVtJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY3B1VXNhZ2VVc2VyQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ2NwdV91c2FnZV91c2VyJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGlza0lub2Rlc0ZyZWVTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdkaXNrX2lub2Rlc19mcmVlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNrSW5vZGVzVG90YWxTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdkaXNrX2lub2Rlc190b3RhbCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZGlza0lub2Rlc1VzZWRTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdkaXNrX2lub2Rlc191c2VkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNrVXNlZFBlcmNlbnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnZGlza191c2VkX3BlcmNlbnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNraW9Jb1RpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnZGlza2lvX2lvX3RpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNraW9SZWFkQnl0ZXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnZGlza2lvX3JlYWRfYnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNraW9SZWFkc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdkaXNraW9fcmVhZHMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBkaXNraW9Xcml0ZUJ5dGVzQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ2Rpc2tpb193cml0ZV9ieXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRpc2tpb1dyaXRlc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdkaXNraW9fd3JpdGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtQ2FjaGVkQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ21lbV9jYWNoZWQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtZW1Ub3RhbEF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdtZW1fdG90YWwnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBtZW1Vc2VkQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ21lbV91c2VkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtVXNlZFBlcmNlbnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnbWVtX3VzZWRfcGVyY2VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ldHN0YXRUY3BFc3RhYmxpc2hlZFN1bShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ25ldHN0YXRfdGNwX2VzdGFibGlzaGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXRzdGF0VGNwVGltZVdhaXRTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICduZXRzdGF0X3RjcF90aW1lX3dhaXQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHN3YXBVc2VkUGVyY2VudEF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdzd2FwX3VzZWRfcGVyY2VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRjUHY0Q29ubmVjdGlvbnNFc3RhYmxpc2hlZFN1bShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ1RDUHY0IENvbm5lY3Rpb25zIEVzdGFibGlzaGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0Y1B2NkNvbm5lY3Rpb25zRXN0YWJsaXNoZWRTdW0oZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdUQ1B2NiBDb25uZWN0aW9ucyBFc3RhYmxpc2hlZCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbWVtb3J5Q29tbWl0dGVkQnl0ZXNJblVzZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZW1vcnkgJSBDb21taXR0ZWQgQnl0ZXMgSW4gVXNlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc29ySWRsZVRpbWVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgSW5zdGFuY2VJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQ1dBZ2VudCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUHJvY2Vzc29yICUgSWRsZSBUaW1lJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc29ySW50ZXJydXB0VGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdQcm9jZXNzb3IgJSBJbnRlcnJ1cHQgVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NvclVzZXJUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ1Byb2Nlc3NvciAlIFVzZXIgVGltZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGxvZ2ljYWxEaXNrRnJlZVNwYWNlQXZlcmFnZShkaW1lbnNpb25zOiB7IEluc3RhbmNlSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0NXQWdlbnQnLFxuICAgICAgbWV0cmljTmFtZTogJ0xvZ2ljYWxEaXNrICUgRnJlZSBTcGFjZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBhZ2luZ0ZpbGVVc2FnZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBJbnN0YW5jZUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdDV0FnZW50JyxcbiAgICAgIG1ldHJpY05hbWU6ICdQYWdpbmcgRmlsZSAlIFVzYWdlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG5leHBvcnQgY2xhc3MgTkFUR2F0ZXdheU1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZUNvbm5lY3Rpb25Db3VudE1heGltdW0oZGltZW5zaW9uczogeyBOYXRHYXRld2F5SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OQVRHYXRld2F5JyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVDb25uZWN0aW9uQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwYWNrZXRzRHJvcENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTmF0R2F0ZXdheUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTkFUR2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0c0Ryb3BDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNJbkZyb21EZXN0aW5hdGlvblN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzSW5Gcm9tRGVzdGluYXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzSW5Gcm9tU291cmNlU3VtKGRpbWVuc2lvbnM6IHsgTmF0R2F0ZXdheUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTkFUR2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnQnl0ZXNJbkZyb21Tb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGJ5dGVzT3V0VG9EZXN0aW5hdGlvblN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzT3V0VG9EZXN0aW5hdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNPdXRUb1NvdXJjZVN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ0J5dGVzT3V0VG9Tb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbm5lY3Rpb25BdHRlbXB0Q291bnRTdW0oZGltZW5zaW9uczogeyBOYXRHYXRld2F5SWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OQVRHYXRld2F5JyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb25uZWN0aW9uQXR0ZW1wdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25uZWN0aW9uRXN0YWJsaXNoZWRDb3VudFN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ0Nvbm5lY3Rpb25Fc3RhYmxpc2hlZENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlcnJvclBvcnRBbGxvY2F0aW9uU3VtKGRpbWVuc2lvbnM6IHsgTmF0R2F0ZXdheUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTkFUR2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnRXJyb3JQb3J0QWxsb2NhdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaWRsZVRpbWVvdXRDb3VudFN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ0lkbGVUaW1lb3V0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBhY2tldHNJbkZyb21EZXN0aW5hdGlvblN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ1BhY2tldHNJbkZyb21EZXN0aW5hdGlvbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcGFja2V0c0luRnJvbVNvdXJjZVN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ1BhY2tldHNJbkZyb21Tb3VyY2UnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBhY2tldHNPdXRUb0Rlc3RpbmF0aW9uU3VtKGRpbWVuc2lvbnM6IHsgTmF0R2F0ZXdheUlkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTkFUR2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0c091dFRvRGVzdGluYXRpb24nLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHBhY2tldHNPdXRUb1NvdXJjZVN1bShkaW1lbnNpb25zOiB7IE5hdEdhdGV3YXlJZDogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05BVEdhdGV3YXknLFxuICAgICAgbWV0cmljTmFtZTogJ1BhY2tldHNPdXRUb1NvdXJjZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG5leHBvcnQgY2xhc3MgVHJhbnNpdEdhdGV3YXlNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBieXRlc0luU3VtKGRpbWVuc2lvbnM6IHsgVHJhbnNpdEdhdGV3YXk6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9UcmFuc2l0R2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnQnl0ZXNJbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXNPdXRTdW0oZGltZW5zaW9uczogeyBUcmFuc2l0R2F0ZXdheTogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1RyYW5zaXRHYXRld2F5JyxcbiAgICAgIG1ldHJpY05hbWU6ICdCeXRlc091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcGFja2V0RHJvcENvdW50QmxhY2tob2xlU3VtKGRpbWVuc2lvbnM6IHsgVHJhbnNpdEdhdGV3YXk6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9UcmFuc2l0R2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0RHJvcENvdW50QmxhY2tob2xlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwYWNrZXREcm9wQ291bnROb1JvdXRlU3VtKGRpbWVuc2lvbnM6IHsgVHJhbnNpdEdhdGV3YXk6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9UcmFuc2l0R2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0RHJvcENvdW50Tm9Sb3V0ZScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcGFja2V0c0luU3VtKGRpbWVuc2lvbnM6IHsgVHJhbnNpdEdhdGV3YXk6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9UcmFuc2l0R2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0c0luJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBwYWNrZXRzT3V0U3VtKGRpbWVuc2lvbnM6IHsgVHJhbnNpdEdhdGV3YXk6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9UcmFuc2l0R2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lOiAnUGFja2V0c091dCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG59XG5leHBvcnQgY2xhc3MgVlBOTWV0cmljcyB7XG4gIHB1YmxpYyBzdGF0aWMgdHVubmVsRGF0YUluU3VtKGRpbWVuc2lvbnM6IHsgVnBuSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9WUE4nLFxuICAgICAgbWV0cmljTmFtZTogJ1R1bm5lbERhdGFJbicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdHVubmVsU3RhdGVBdmVyYWdlKGRpbWVuc2lvbnM6IHsgVnBuSWQ6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9WUE4nLFxuICAgICAgbWV0cmljTmFtZTogJ1R1bm5lbFN0YXRlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdHVubmVsRGF0YU91dFN1bShkaW1lbnNpb25zOiB7IFZwbklkOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUdW5uZWxEYXRhT3V0JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbn1cbnR5cGUgTWV0cmljV2l0aERpbXM8RD4gPSB7IG5hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nLCBkaW1lbnNpb25zTWFwOiBEIH07XG4iXX0=