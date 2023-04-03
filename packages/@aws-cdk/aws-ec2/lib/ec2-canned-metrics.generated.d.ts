export declare class EC2CapacityReservationsMetrics {
    static instanceUtilizationAverage(dimensions: {
        CapacityReservationId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            CapacityReservationId: string;
        };
        statistic: string;
    };
    static usedInstanceCountAverage(dimensions: {
        CapacityReservationId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            CapacityReservationId: string;
        };
        statistic: string;
    };
    static availableInstanceCountAverage(dimensions: {
        CapacityReservationId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            CapacityReservationId: string;
        };
        statistic: string;
    };
    static totalInstanceCountAverage(dimensions: {
        CapacityReservationId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            CapacityReservationId: string;
        };
        statistic: string;
    };
}
export declare class EBSMetrics {
    static volumeReadBytesSum(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeWriteBytesSum(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeReadOpsSum(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeTotalReadTimeAverage(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeWriteOpsSum(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeTotalWriteTimeAverage(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeIdleTimeAverage(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static volumeQueueLengthAverage(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
    static burstBalanceAverage(dimensions: {
        VolumeId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VolumeId: string;
        };
        statistic: string;
    };
}
export declare class EC2Metrics {
    static cpuCreditUsageAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuCreditBalanceAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuSurplusCreditBalanceAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuSurplusCreditsChargedAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuUtilizationAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static cpuUtilizationAverage(dimensions: {}): MetricWithDims<{}>;
    static cpuUtilizationAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static cpuUtilizationAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static cpuUtilizationAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static diskReadBytesAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static diskReadBytesAverage(dimensions: {}): MetricWithDims<{}>;
    static diskReadBytesAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static diskReadBytesAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static diskReadBytesAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static diskReadOpsAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static diskReadOpsAverage(dimensions: {}): MetricWithDims<{}>;
    static diskReadOpsAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static diskReadOpsAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static diskReadOpsAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static diskWriteBytesAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static diskWriteBytesAverage(dimensions: {}): MetricWithDims<{}>;
    static diskWriteBytesAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static diskWriteBytesAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static diskWriteBytesAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static diskWriteOpsAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static diskWriteOpsAverage(dimensions: {}): MetricWithDims<{}>;
    static diskWriteOpsAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static diskWriteOpsAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static diskWriteOpsAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static metadataNoTokenSum(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static metadataNoTokenSum(dimensions: {}): MetricWithDims<{}>;
    static networkInAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static networkInAverage(dimensions: {}): MetricWithDims<{}>;
    static networkInAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static networkInAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static networkInAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static networkOutAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static networkOutAverage(dimensions: {}): MetricWithDims<{}>;
    static networkOutAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static networkOutAverage(dimensions: {
        ImageId: string;
    }): MetricWithDims<{
        ImageId: string;
    }>;
    static networkOutAverage(dimensions: {
        InstanceType: string;
    }): MetricWithDims<{
        InstanceType: string;
    }>;
    static networkPacketsInAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static networkPacketsInAverage(dimensions: {}): MetricWithDims<{}>;
    static networkPacketsInAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static networkPacketsOutAverage(dimensions: {
        InstanceId: string;
    }): MetricWithDims<{
        InstanceId: string;
    }>;
    static networkPacketsOutAverage(dimensions: {}): MetricWithDims<{}>;
    static networkPacketsOutAverage(dimensions: {
        AutoScalingGroupName: string;
    }): MetricWithDims<{
        AutoScalingGroupName: string;
    }>;
    static statusCheckFailedSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static statusCheckFailedInstanceSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static statusCheckFailedSystemSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
}
export declare class CWAgentMetrics {
    static cpuUsageIdleAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuUsageIowaitAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuUsageStealAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuUsageSystemAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static cpuUsageUserAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskInodesFreeSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskInodesTotalSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskInodesUsedSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskUsedPercentAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskioIoTimeAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskioReadBytesAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskioReadsAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskioWriteBytesAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static diskioWritesAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static memCachedAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static memTotalAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static memUsedAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static memUsedPercentAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static netstatTcpEstablishedSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static netstatTcpTimeWaitSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static swapUsedPercentAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static tcPv4ConnectionsEstablishedSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static tcPv6ConnectionsEstablishedSum(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static memoryCommittedBytesInUseAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static processorIdleTimeAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static processorInterruptTimeAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static processorUserTimeAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static logicalDiskFreeSpaceAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
    static pagingFileUsageAverage(dimensions: {
        InstanceId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            InstanceId: string;
        };
        statistic: string;
    };
}
export declare class NATGatewayMetrics {
    static activeConnectionCountMaximum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static packetsDropCountSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static bytesInFromDestinationSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static bytesInFromSourceSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static bytesOutToDestinationSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static bytesOutToSourceSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static connectionAttemptCountSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static connectionEstablishedCountSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static errorPortAllocationSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static idleTimeoutCountSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static packetsInFromDestinationSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static packetsInFromSourceSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static packetsOutToDestinationSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
    static packetsOutToSourceSum(dimensions: {
        NatGatewayId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            NatGatewayId: string;
        };
        statistic: string;
    };
}
export declare class TransitGatewayMetrics {
    static bytesInSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
    static bytesOutSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
    static packetDropCountBlackholeSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
    static packetDropCountNoRouteSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
    static packetsInSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
    static packetsOutSum(dimensions: {
        TransitGateway: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TransitGateway: string;
        };
        statistic: string;
    };
}
export declare class VPNMetrics {
    static tunnelDataInSum(dimensions: {
        VpnId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VpnId: string;
        };
        statistic: string;
    };
    static tunnelStateAverage(dimensions: {
        VpnId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VpnId: string;
        };
        statistic: string;
    };
    static tunnelDataOutSum(dimensions: {
        VpnId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            VpnId: string;
        };
        statistic: string;
    };
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
