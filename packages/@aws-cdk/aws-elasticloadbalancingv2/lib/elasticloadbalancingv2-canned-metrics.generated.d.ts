export declare class ApplicationELBMetrics {
    static activeConnectionCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static clientTlsNegotiationErrorCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static clientTlsNegotiationErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static consumedLcUsAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static desyncMitigationModeNonCompliantRequestCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static desyncMitigationModeNonCompliantRequestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthErrorSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthErrorSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthFailureSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthFailureSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthLatencySum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthLatencySum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthRefreshTokenSuccessSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthRefreshTokenSuccessSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthSuccessSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthSuccessSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static elbAuthUserClaimsSizeExceededSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static elbAuthUserClaimsSizeExceededSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static grpcRequestCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static httpFixedResponseCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpFixedResponseCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpRedirectCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpRedirectCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpRedirectUrlLimitExceededCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpRedirectUrlLimitExceededCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeElb3XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeElb3XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeElb4XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeElb4XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeElb5XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeElb5XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeElb500CountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static httpCodeElb502CountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static httpCodeElb503CountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static httpCodeElb504CountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static httpCodeTarget2XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeTarget2XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeTarget2XxCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget2XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget3XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeTarget3XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeTarget3XxCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget3XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget4XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeTarget4XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeTarget4XxCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget4XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget5XxCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static httpCodeTarget5XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static httpCodeTarget5XxCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static httpCodeTarget5XxCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static iPv6ProcessedBytesSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static iPv6RequestCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static newConnectionCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static nonStickyRequestCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static nonStickyRequestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static processedBytesSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static rejectedConnectionCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static rejectedConnectionCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static requestCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static requestCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static ruleEvaluationsSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static targetConnectionErrorCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static targetConnectionErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static targetConnectionErrorCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static targetConnectionErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static targetResponseTimeAverage(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static targetResponseTimeAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static targetResponseTimeAverage(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static targetResponseTimeAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static lambdaTargetProcessedBytesSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static requestCountPerTargetSum(dimensions: {
        TargetGroup: string;
    }): MetricWithDims<{
        TargetGroup: string;
    }>;
    static requestCountPerTargetSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static lambdaInternalErrorSum(dimensions: {
        TargetGroup: string;
    }): MetricWithDims<{
        TargetGroup: string;
    }>;
    static lambdaInternalErrorSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static lambdaUserErrorSum(dimensions: {
        TargetGroup: string;
    }): MetricWithDims<{
        TargetGroup: string;
    }>;
    static lambdaUserErrorSum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static droppedInvalidHeaderRequestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AvailabilityZone: string;
            LoadBalancer: string;
        };
        statistic: string;
    };
    static forwardedInvalidHeaderRequestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AvailabilityZone: string;
            LoadBalancer: string;
        };
        statistic: string;
    };
    static healthyHostCountAverage(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static healthyHostCountAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static unHealthyHostCountAverage(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static unHealthyHostCountAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
}
export declare class GatewayELBMetrics {
    static healthyHostCountAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static unHealthyHostCountAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static activeFlowCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static consumedLcUsAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static newFlowCountSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static processedBytesSum(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
}
export declare class NetworkELBMetrics {
    static activeFlowCountAverage(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static activeFlowCountAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static activeFlowCountTcpAverage(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static activeFlowCountTcpAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static activeFlowCountTlsAverage(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static activeFlowCountTlsAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static activeFlowCountUdpAverage(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static activeFlowCountUdpAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static clientTlsNegotiationErrorCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static clientTlsNegotiationErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static consumedLcUsAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static consumedLcUsTcpAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static consumedLcUsTlsAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static consumedLcUsUdpAverage(dimensions: {
        LoadBalancer: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LoadBalancer: string;
        };
        statistic: string;
    };
    static newFlowCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static newFlowCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static newFlowCountTcpSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static newFlowCountTcpSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static newFlowCountTlsSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static newFlowCountTlsSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static newFlowCountUdpSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static newFlowCountUdpSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static processedBytesSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static processedBytesSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static processedBytesTcpSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static processedBytesTcpSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static processedBytesTlsSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static processedBytesTlsSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static processedBytesUdpSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static processedBytesUdpSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static targetTlsNegotiationErrorCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static tcpClientResetCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static tcpClientResetCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static tcpElbResetCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static tcpElbResetCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static tcpTargetResetCountSum(dimensions: {
        LoadBalancer: string;
    }): MetricWithDims<{
        LoadBalancer: string;
    }>;
    static tcpTargetResetCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
    }>;
    static healthyHostCountMinimum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static healthyHostCountMinimum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static unHealthyHostCountMaximum(dimensions: {
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        LoadBalancer: string;
        TargetGroup: string;
    }>;
    static unHealthyHostCountMaximum(dimensions: {
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancer: string;
        TargetGroup: string;
    }>;
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
