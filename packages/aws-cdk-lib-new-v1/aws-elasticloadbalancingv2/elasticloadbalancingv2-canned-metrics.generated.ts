/* eslint-disable prettier/prettier,max-len */
export interface MetricWithDims<D> {
  readonly namespace: string;

  readonly metricName: string;

  readonly statistic: string;

  readonly dimensionsMap: D;
}

export class ApplicationELBMetrics {
  public static activeConnectionCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ActiveConnectionCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static clientTlsNegotiationErrorCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static clientTlsNegotiationErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static clientTlsNegotiationErrorCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ClientTLSNegotiationErrorCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumedLcUsAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ConsumedLCUs",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static desyncMitigationModeNonCompliantRequestCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "DesyncMitigationMode_NonCompliant_Request_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthErrorSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthErrorSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthFailureSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthFailureSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthFailureSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthFailure",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthLatencySum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthLatencySum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthLatencySum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthLatency",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthRefreshTokenSuccessSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthRefreshTokenSuccessSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthRefreshTokenSuccessSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthRefreshTokenSuccess",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthSuccessSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthSuccessSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthSuccessSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthSuccess",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static elbAuthUserClaimsSizeExceededSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static elbAuthUserClaimsSizeExceededSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static elbAuthUserClaimsSizeExceededSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ELBAuthUserClaimsSizeExceeded",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static grpcRequestCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "GrpcRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpFixedResponseCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpFixedResponseCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpFixedResponseCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTP_Fixed_Response_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpRedirectCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpRedirectCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpRedirectCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTP_Redirect_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpRedirectUrlLimitExceededCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpRedirectUrlLimitExceededCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpRedirectUrlLimitExceededCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTP_Redirect_Url_Limit_Exceeded_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb3XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeElb3XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeElb3XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_3XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb4XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeElb4XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeElb4XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_4XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb5XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeElb5XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeElb5XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_5XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb500CountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_500_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb502CountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_502_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb503CountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_503_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeElb504CountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_ELB_504_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeTarget2XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeTarget2XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeTarget2XxCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget2XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget2XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_Target_2XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeTarget3XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeTarget3XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeTarget3XxCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget3XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget3XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_Target_3XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeTarget4XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeTarget4XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeTarget4XxCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget4XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget4XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_Target_4XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static httpCodeTarget5XxCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static httpCodeTarget5XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static httpCodeTarget5XxCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget5XxCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static httpCodeTarget5XxCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HTTPCode_Target_5XX_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static iPv6ProcessedBytesSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "IPv6ProcessedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static iPv6RequestCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "IPv6RequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static newConnectionCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "NewConnectionCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static nonStickyRequestCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static nonStickyRequestCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static nonStickyRequestCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "NonStickyRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ProcessedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static rejectedConnectionCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static rejectedConnectionCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static rejectedConnectionCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "RejectedConnectionCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static requestCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static requestCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static requestCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "RequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static ruleEvaluationsSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "RuleEvaluations",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static targetConnectionErrorCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static targetConnectionErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static targetConnectionErrorCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static targetConnectionErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static targetConnectionErrorCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "TargetConnectionErrorCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static targetResponseTimeAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static targetResponseTimeAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static targetResponseTimeAverage(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static targetResponseTimeAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static targetResponseTimeAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "TargetResponseTime",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static targetTlsNegotiationErrorCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "TargetTLSNegotiationErrorCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static lambdaTargetProcessedBytesSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "LambdaTargetProcessedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static requestCountPerTargetSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static requestCountPerTargetSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static requestCountPerTargetSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static requestCountPerTargetSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "RequestCountPerTarget",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static lambdaInternalErrorSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static lambdaInternalErrorSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static lambdaInternalErrorSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static lambdaInternalErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "LambdaInternalError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static lambdaUserErrorSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static lambdaUserErrorSum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static lambdaUserErrorSum(dimensions: { TargetGroup: string; }): MetricWithDims<{ TargetGroup: string; }>;

  public static lambdaUserErrorSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "LambdaUserError",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static droppedInvalidHeaderRequestCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "DroppedInvalidHeaderRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static forwardedInvalidHeaderRequestCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "ForwardedInvalidHeaderRequestCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static healthyHostCountAverage(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static healthyHostCountAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static healthyHostCountAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "HealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static unHealthyHostCountAverage(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static unHealthyHostCountAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static unHealthyHostCountAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/ApplicationELB",
      "metricName": "UnHealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }
}

export class GatewayELBMetrics {
  public static healthyHostCountAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "HealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static unHealthyHostCountAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "UnHealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activeFlowCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "ActiveFlowCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumedLcUsAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "ConsumedLCUs",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static newFlowCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "NewFlowCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/GatewayELB",
      "metricName": "ProcessedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }
}

export class NetworkELBMetrics {
  public static activeFlowCountAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static activeFlowCountAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static activeFlowCountAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ActiveFlowCount",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activeFlowCountTcpAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static activeFlowCountTcpAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static activeFlowCountTcpAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ActiveFlowCount_TCP",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activeFlowCountTlsAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static activeFlowCountTlsAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static activeFlowCountTlsAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ActiveFlowCount_TLS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static activeFlowCountUdpAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static activeFlowCountUdpAverage(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static activeFlowCountUdpAverage(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ActiveFlowCount_UDP",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static clientTlsNegotiationErrorCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static clientTlsNegotiationErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static clientTlsNegotiationErrorCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ClientTLSNegotiationErrorCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static consumedLcUsAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ConsumedLCUs",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static consumedLcUsTcpAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ConsumedLCUs_TCP",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static consumedLcUsTlsAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ConsumedLCUs_TLS",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static consumedLcUsUdpAverage(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ConsumedLCUs_UDP",
      "dimensionsMap": dimensions,
      "statistic": "Average"
    };
  }

  public static newFlowCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static newFlowCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static newFlowCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "NewFlowCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static newFlowCountTcpSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static newFlowCountTcpSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static newFlowCountTcpSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "NewFlowCount_TCP",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static newFlowCountTlsSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static newFlowCountTlsSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static newFlowCountTlsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "NewFlowCount_TLS",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static newFlowCountUdpSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static newFlowCountUdpSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static newFlowCountUdpSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "NewFlowCount_UDP",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static processedBytesSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static processedBytesSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ProcessedBytes",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesTcpSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static processedBytesTcpSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static processedBytesTcpSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ProcessedBytes_TCP",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesTlsSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static processedBytesTlsSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static processedBytesTlsSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ProcessedBytes_TLS",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static processedBytesUdpSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static processedBytesUdpSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static processedBytesUdpSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "ProcessedBytes_UDP",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static targetTlsNegotiationErrorCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static targetTlsNegotiationErrorCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "TargetTLSNegotiationErrorCount",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static tcpClientResetCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static tcpClientResetCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static tcpClientResetCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "TCP_Client_Reset_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static tcpElbResetCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static tcpElbResetCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static tcpElbResetCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "TCP_ELB_Reset_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static tcpTargetResetCountSum(dimensions: { LoadBalancer: string; }): MetricWithDims<{ LoadBalancer: string; }>;

  public static tcpTargetResetCountSum(dimensions: { AvailabilityZone: string; LoadBalancer: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; }>;

  public static tcpTargetResetCountSum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "TCP_Target_Reset_Count",
      "dimensionsMap": dimensions,
      "statistic": "Sum"
    };
  }

  public static healthyHostCountMinimum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static healthyHostCountMinimum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static healthyHostCountMinimum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "HealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Minimum"
    };
  }

  public static unHealthyHostCountMaximum(dimensions: { LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ LoadBalancer: string; TargetGroup: string; }>;

  public static unHealthyHostCountMaximum(dimensions: { AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }): MetricWithDims<{ AvailabilityZone: string; LoadBalancer: string; TargetGroup: string; }>;

  public static unHealthyHostCountMaximum(dimensions: any): MetricWithDims<any> {
    return {
      "namespace": "AWS/NetworkELB",
      "metricName": "UnHealthyHostCount",
      "dimensionsMap": dimensions,
      "statistic": "Maximum"
    };
  }
}