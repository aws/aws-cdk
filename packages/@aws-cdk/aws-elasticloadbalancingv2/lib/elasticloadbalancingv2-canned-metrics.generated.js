"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkELBMetrics = exports.GatewayELBMetrics = exports.ApplicationELBMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class ApplicationELBMetrics {
    static activeConnectionCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ActiveConnectionCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static clientTlsNegotiationErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ClientTLSNegotiationErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static consumedLcUsAverage(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ConsumedLCUs',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static desyncMitigationModeNonCompliantRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'DesyncMitigationMode_NonCompliant_Request_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthErrorSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthError',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthFailureSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthFailure',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthLatencySum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthLatency',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthRefreshTokenSuccessSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthRefreshTokenSuccess',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthSuccessSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthSuccess',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static elbAuthUserClaimsSizeExceededSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ELBAuthUserClaimsSizeExceeded',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static grpcRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'GrpcRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpFixedResponseCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTP_Fixed_Response_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpRedirectCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTP_Redirect_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpRedirectUrlLimitExceededCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTP_Redirect_Url_Limit_Exceeded_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb3XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_3XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb4XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_4XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb5XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_5XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb500CountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_500_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb502CountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_502_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb503CountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_503_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeElb504CountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_ELB_504_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeTarget2XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_Target_2XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeTarget3XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_Target_3XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeTarget4XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_Target_4XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static httpCodeTarget5XxCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HTTPCode_Target_5XX_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static iPv6ProcessedBytesSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'IPv6ProcessedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static iPv6RequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'IPv6RequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static newConnectionCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'NewConnectionCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static nonStickyRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'NonStickyRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ProcessedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static rejectedConnectionCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'RejectedConnectionCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static requestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'RequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static ruleEvaluationsSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'RuleEvaluations',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static targetConnectionErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'TargetConnectionErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static targetResponseTimeAverage(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'TargetResponseTime',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static targetTlsNegotiationErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'TargetTLSNegotiationErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static lambdaTargetProcessedBytesSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'LambdaTargetProcessedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static requestCountPerTargetSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'RequestCountPerTarget',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static lambdaInternalErrorSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'LambdaInternalError',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static lambdaUserErrorSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'LambdaUserError',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static droppedInvalidHeaderRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'DroppedInvalidHeaderRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static forwardedInvalidHeaderRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'ForwardedInvalidHeaderRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static healthyHostCountAverage(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'HealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static unHealthyHostCountAverage(dimensions) {
        return {
            namespace: 'AWS/ApplicationELB',
            metricName: 'UnHealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
}
exports.ApplicationELBMetrics = ApplicationELBMetrics;
class GatewayELBMetrics {
    static healthyHostCountAverage(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'HealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static unHealthyHostCountAverage(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'UnHealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activeFlowCountSum(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'ActiveFlowCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static consumedLcUsAverage(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'ConsumedLCUs',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static newFlowCountSum(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'NewFlowCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesSum(dimensions) {
        return {
            namespace: 'AWS/GatewayELB',
            metricName: 'ProcessedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.GatewayELBMetrics = GatewayELBMetrics;
class NetworkELBMetrics {
    static activeFlowCountAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ActiveFlowCount',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activeFlowCountTcpAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ActiveFlowCount_TCP',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activeFlowCountTlsAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ActiveFlowCount_TLS',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static activeFlowCountUdpAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ActiveFlowCount_UDP',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static clientTlsNegotiationErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ClientTLSNegotiationErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static consumedLcUsAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ConsumedLCUs',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static consumedLcUsTcpAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ConsumedLCUs_TCP',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static consumedLcUsTlsAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ConsumedLCUs_TLS',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static consumedLcUsUdpAverage(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ConsumedLCUs_UDP',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static newFlowCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'NewFlowCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static newFlowCountTcpSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'NewFlowCount_TCP',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static newFlowCountTlsSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'NewFlowCount_TLS',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static newFlowCountUdpSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'NewFlowCount_UDP',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ProcessedBytes',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesTcpSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ProcessedBytes_TCP',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesTlsSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ProcessedBytes_TLS',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static processedBytesUdpSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'ProcessedBytes_UDP',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static targetTlsNegotiationErrorCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'TargetTLSNegotiationErrorCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static tcpClientResetCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'TCP_Client_Reset_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static tcpElbResetCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'TCP_ELB_Reset_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static tcpTargetResetCountSum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'TCP_Target_Reset_Count',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static healthyHostCountMinimum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'HealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Minimum',
        };
    }
    static unHealthyHostCountMaximum(dimensions) {
        return {
            namespace: 'AWS/NetworkELB',
            metricName: 'UnHealthyHostCount',
            dimensionsMap: dimensions,
            statistic: 'Maximum',
        };
    }
}
exports.NetworkELBMetrics = NetworkELBMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljbG9hZGJhbGFuY2luZ3YyLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFOzs7QUFFL0UsNEJBQTRCLENBQUMsaUVBQWlFO0FBRTlGLE1BQWEscUJBQXFCO0lBQ3pCLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFvQztRQUN6RSxPQUFPO1lBQ0wsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxVQUFlO1FBQzdELE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxnQ0FBZ0M7WUFDNUMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFVBQW9DO1FBQ3BFLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQywrQ0FBK0MsQ0FBQyxVQUFlO1FBQzNFLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxpREFBaUQ7WUFDN0QsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBR00sTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFlO1FBQzNDLE9BQU87WUFDTCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxj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RSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUdNLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxVQUFlO1FBQ3JELE9BQU87WUFDTCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQztLQUNIO0NBQ0Y7QUEvTkQsOENBK05DIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovIC8vIFRoaXMgaXMgZ2VuZXJhdGVkIGNvZGUgLSBsaW5lIGxlbmd0aHMgYXJlIGRpZmZpY3VsdCB0byBjb250cm9sXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkVMQk1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZUNvbm5lY3Rpb25Db3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVDb25uZWN0aW9uQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNsaWVudFRsc05lZ290aWF0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNsaWVudFRsc05lZ290aWF0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBjbGllbnRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnQ2xpZW50VExTTmVnb3RpYXRpb25FcnJvckNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25zdW1lZExjVXNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnN1bWVkTENVcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGRlc3luY01pdGlnYXRpb25Nb2RlTm9uQ29tcGxpYW50UmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVzeW5jTWl0aWdhdGlvbk1vZGVOb25Db21wbGlhbnRSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgZGVzeW5jTWl0aWdhdGlvbk1vZGVOb25Db21wbGlhbnRSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnRGVzeW5jTWl0aWdhdGlvbk1vZGVfTm9uQ29tcGxpYW50X1JlcXVlc3RfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhFcnJvclN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhFcnJvclN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoRXJyb3JTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnRUxCQXV0aEVycm9yJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoRmFpbHVyZVN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhGYWlsdXJlU3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhGYWlsdXJlU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0VMQkF1dGhGYWlsdXJlJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoTGF0ZW5jeVN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhMYXRlbmN5U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhMYXRlbmN5U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0VMQkF1dGhMYXRlbmN5JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoUmVmcmVzaFRva2VuU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhSZWZyZXNoVG9rZW5TdWNjZXNzU3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhSZWZyZXNoVG9rZW5TdWNjZXNzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0VMQkF1dGhSZWZyZXNoVG9rZW5TdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoU3VjY2Vzc1N1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhTdWNjZXNzU3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhTdWNjZXNzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0VMQkF1dGhTdWNjZXNzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBlbGJBdXRoVXNlckNsYWltc1NpemVFeGNlZWRlZFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhVc2VyQ2xhaW1zU2l6ZUV4Y2VlZGVkU3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGVsYkF1dGhVc2VyQ2xhaW1zU2l6ZUV4Y2VlZGVkU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0VMQkF1dGhVc2VyQ2xhaW1zU2l6ZUV4Y2VlZGVkJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBncnBjUmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0dycGNSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh0dHBGaXhlZFJlc3BvbnNlQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwRml4ZWRSZXNwb25zZUNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBGaXhlZFJlc3BvbnNlQ291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSFRUUF9GaXhlZF9SZXNwb25zZV9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaHR0cFJlZGlyZWN0Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwUmVkaXJlY3RDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwUmVkaXJlY3RDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIVFRQX1JlZGlyZWN0X0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBodHRwUmVkaXJlY3RVcmxMaW1pdEV4Y2VlZGVkQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwUmVkaXJlY3RVcmxMaW1pdEV4Y2VlZGVkQ291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cFJlZGlyZWN0VXJsTGltaXRFeGNlZWRlZENvdW50U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hUVFBfUmVkaXJlY3RfVXJsX0xpbWl0X0V4Y2VlZGVkX0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZUVsYjNYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVFbGIzWHhDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZUVsYjNYeENvdW50U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hUVFBDb2RlX0VMQl8zWFhfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlRWxiNFh4Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZUVsYjRYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlRWxiNFh4Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSFRUUENvZGVfRUxCXzRYWF9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVFbGI1WHhDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlRWxiNVh4Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVFbGI1WHhDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIVFRQQ29kZV9FTEJfNVhYX0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZUVsYjUwMENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hUVFBDb2RlX0VMQl81MDBfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlRWxiNTAyQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSFRUUENvZGVfRUxCXzUwMl9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVFbGI1MDNDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIVFRQQ29kZV9FTEJfNTAzX0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZUVsYjUwNENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hUVFBDb2RlX0VMQl81MDRfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0Mlh4Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDJYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0Mlh4Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDJYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0Mlh4Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSFRUUENvZGVfVGFyZ2V0XzJYWF9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVUYXJnZXQzWHhDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0M1h4Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVUYXJnZXQzWHhDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0M1h4Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVUYXJnZXQzWHhDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdIVFRQQ29kZV9UYXJnZXRfM1hYX0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDRYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVUYXJnZXQ0WHhDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDRYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaHR0cENvZGVUYXJnZXQ0WHhDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDRYeENvdW50U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hUVFBDb2RlX1RhcmdldF80WFhfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0NVh4Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDVYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0NVh4Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBodHRwQ29kZVRhcmdldDVYeENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGh0dHBDb2RlVGFyZ2V0NVh4Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSFRUUENvZGVfVGFyZ2V0XzVYWF9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaVB2NlByb2Nlc3NlZEJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0lQdjZQcm9jZXNzZWRCeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaVB2NlJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdJUHY2UmVxdWVzdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXdDb25uZWN0aW9uQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV3Q29ubmVjdGlvbkNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBub25TdGlja3lSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBub25TdGlja3lSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbm9uU3RpY2t5UmVxdWVzdENvdW50U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ05vblN0aWNreVJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnUHJvY2Vzc2VkQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlamVjdGVkQ29ubmVjdGlvbkNvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVqZWN0ZWRDb25uZWN0aW9uQ291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVqZWN0ZWRDb25uZWN0aW9uQ291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVqZWN0ZWRDb25uZWN0aW9uQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJ1bGVFdmFsdWF0aW9uc1N1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdSdWxlRXZhbHVhdGlvbnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRhcmdldENvbm5lY3Rpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0Q29ubmVjdGlvbkVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB0YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB0YXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUYXJnZXRDb25uZWN0aW9uRXJyb3JDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0UmVzcG9uc2VUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRhcmdldFJlc3BvbnNlVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0UmVzcG9uc2VUaW1lQXZlcmFnZShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRhcmdldFJlc3BvbnNlVGltZUF2ZXJhZ2UoZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0UmVzcG9uc2VUaW1lQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUYXJnZXRSZXNwb25zZVRpbWUnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0YXJnZXRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB0YXJnZXRUbHNOZWdvdGlhdGlvbkVycm9yQ291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRhcmdldFRsc05lZ290aWF0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUYXJnZXRUTFNOZWdvdGlhdGlvbkVycm9yQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGxhbWJkYVRhcmdldFByb2Nlc3NlZEJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0xhbWJkYVRhcmdldFByb2Nlc3NlZEJ5dGVzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyByZXF1ZXN0Q291bnRQZXJUYXJnZXRTdW0oZGltZW5zaW9uczogeyBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVxdWVzdENvdW50UGVyVGFyZ2V0U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcmVxdWVzdENvdW50UGVyVGFyZ2V0U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1JlcXVlc3RDb3VudFBlclRhcmdldCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbGFtYmRhSW50ZXJuYWxFcnJvclN1bShkaW1lbnNpb25zOiB7IFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBsYW1iZGFJbnRlcm5hbEVycm9yU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbGFtYmRhSW50ZXJuYWxFcnJvclN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdMYW1iZGFJbnRlcm5hbEVycm9yJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBsYW1iZGFVc2VyRXJyb3JTdW0oZGltZW5zaW9uczogeyBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbGFtYmRhVXNlckVycm9yU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbGFtYmRhVXNlckVycm9yU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0xhbWJkYVVzZXJFcnJvcicsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZHJvcHBlZEludmFsaWRIZWFkZXJSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0FwcGxpY2F0aW9uRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdEcm9wcGVkSW52YWxpZEhlYWRlclJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgZm9yd2FyZGVkSW52YWxpZEhlYWRlclJlcXVlc3RDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBwbGljYXRpb25FTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0ZvcndhcmRlZEludmFsaWRIZWFkZXJSZXF1ZXN0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGhlYWx0aHlIb3N0Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaGVhbHRoeUhvc3RDb3VudEF2ZXJhZ2UoZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgaGVhbHRoeUhvc3RDb3VudEF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSGVhbHRoeUhvc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHVuSGVhbHRoeUhvc3RDb3VudEF2ZXJhZ2UoZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB1bkhlYWx0aHlIb3N0Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nLCBUYXJnZXRHcm91cDogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHVuSGVhbHRoeUhvc3RDb3VudEF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcHBsaWNhdGlvbkVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG59XG5leHBvcnQgY2xhc3MgR2F0ZXdheUVMQk1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIGhlYWx0aHlIb3N0Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvR2F0ZXdheUVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnSGVhbHRoeUhvc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHVuSGVhbHRoeUhvc3RDb3VudEF2ZXJhZ2UoZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HYXRld2F5RUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdVbkhlYWx0aHlIb3N0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HYXRld2F5RUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVGbG93Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbnN1bWVkTGNVc0F2ZXJhZ2UoZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HYXRld2F5RUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb25zdW1lZExDVXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXdGbG93Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9HYXRld2F5RUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXdGbG93Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NlZEJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvR2F0ZXdheUVMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnUHJvY2Vzc2VkQnl0ZXMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIE5ldHdvcmtFTEJNZXRyaWNzIHtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlRmxvd0NvdW50QXZlcmFnZShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZlRmxvd0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlRmxvd0NvdW50VGNwQXZlcmFnZShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZUZsb3dDb3VudFRjcEF2ZXJhZ2UoZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlRmxvd0NvdW50VGNwQXZlcmFnZShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0FjdGl2ZUZsb3dDb3VudF9UQ1AnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRUbHNBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgYWN0aXZlRmxvd0NvdW50VGxzQXZlcmFnZShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRUbHNBdmVyYWdlKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnQWN0aXZlRmxvd0NvdW50X1RMUycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGFjdGl2ZUZsb3dDb3VudFVkcEF2ZXJhZ2UoZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBhY3RpdmVGbG93Q291bnRVZHBBdmVyYWdlKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZUZsb3dDb3VudFVkcEF2ZXJhZ2UoZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdBY3RpdmVGbG93Q291bnRfVURQJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY2xpZW50VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgY2xpZW50VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIGNsaWVudFRsc05lZ290aWF0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0NsaWVudFRMU05lZ290aWF0aW9uRXJyb3JDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29uc3VtZWRMY1VzQXZlcmFnZShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnN1bWVkTENVcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIGNvbnN1bWVkTGNVc1RjcEF2ZXJhZ2UoZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdDb25zdW1lZExDVXNfVENQJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgY29uc3VtZWRMY1VzVGxzQXZlcmFnZShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0NvbnN1bWVkTENVc19UTFMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBjb25zdW1lZExjVXNVZHBBdmVyYWdlKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnQ29uc3VtZWRMQ1VzX1VEUCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ld0Zsb3dDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0Zsb3dDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXdGbG93Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXdGbG93Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG5ld0Zsb3dDb3VudFRjcFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0Zsb3dDb3VudFRjcFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXdGbG93Q291bnRUY3BTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOZXdGbG93Q291bnRfVENQJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBuZXdGbG93Q291bnRUbHNTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBuZXdGbG93Q291bnRUbHNTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV3Rmxvd0NvdW50VGxzU3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnTmV3Rmxvd0NvdW50X1RMUycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgbmV3Rmxvd0NvdW50VWRwU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgbmV3Rmxvd0NvdW50VWRwU3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIG5ld0Zsb3dDb3VudFVkcFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ05ld0Zsb3dDb3VudF9VRFAnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHByb2Nlc3NlZEJ5dGVzU3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQcm9jZXNzZWRCeXRlcycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNUY3BTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1RjcFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1RjcFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1Byb2Nlc3NlZEJ5dGVzX1RDUCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNUbHNTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1Rsc1N1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1Rsc1N1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1Byb2Nlc3NlZEJ5dGVzX1RMUycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc2VkQnl0ZXNVZHBTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1VkcFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBwcm9jZXNzZWRCeXRlc1VkcFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1Byb2Nlc3NlZEJ5dGVzX1VEUCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGFyZ2V0VGxzTmVnb3RpYXRpb25FcnJvckNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRhcmdldFRsc05lZ290aWF0aW9uRXJyb3JDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1RhcmdldFRMU05lZ290aWF0aW9uRXJyb3JDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgdGNwQ2xpZW50UmVzZXRDb3VudFN1bShkaW1lbnNpb25zOiB7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRjcENsaWVudFJlc2V0Q291bnRTdW0oZGltZW5zaW9uczogeyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0pOiBNZXRyaWNXaXRoRGltczx7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGNwQ2xpZW50UmVzZXRDb3VudFN1bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ1RDUF9DbGllbnRfUmVzZXRfQ291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHRjcEVsYlJlc2V0Q291bnRTdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB0Y3BFbGJSZXNldENvdW50U3VtKGRpbWVuc2lvbnM6IHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBBdmFpbGFiaWxpdHlab25lOiBzdHJpbmcsIExvYWRCYWxhbmNlcjogc3RyaW5nIH0+O1xuICBwdWJsaWMgc3RhdGljIHRjcEVsYlJlc2V0Q291bnRTdW0oZGltZW5zaW9uczogYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9OZXR3b3JrRUxCJyxcbiAgICAgIG1ldHJpY05hbWU6ICdUQ1BfRUxCX1Jlc2V0X0NvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB0Y3BUYXJnZXRSZXNldENvdW50U3VtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdGNwVGFyZ2V0UmVzZXRDb3VudFN1bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB0Y3BUYXJnZXRSZXNldENvdW50U3VtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnVENQX1RhcmdldF9SZXNldF9Db3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgaGVhbHRoeUhvc3RDb3VudE1pbmltdW0oZGltZW5zaW9uczogeyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9KTogTWV0cmljV2l0aERpbXM8eyBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBoZWFsdGh5SG9zdENvdW50TWluaW11bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyBoZWFsdGh5SG9zdENvdW50TWluaW11bShkaW1lbnNpb25zOiBhbnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL05ldHdvcmtFTEInLFxuICAgICAgbWV0cmljTmFtZTogJ0hlYWx0aHlIb3N0Q291bnQnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ01pbmltdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyB1bkhlYWx0aHlIb3N0Q291bnRNYXhpbXVtKGRpbWVuc2lvbnM6IHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfT47XG4gIHB1YmxpYyBzdGF0aWMgdW5IZWFsdGh5SG9zdENvdW50TWF4aW11bShkaW1lbnNpb25zOiB7IEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZywgTG9hZEJhbGFuY2VyOiBzdHJpbmcsIFRhcmdldEdyb3VwOiBzdHJpbmcgfSk6IE1ldHJpY1dpdGhEaW1zPHsgQXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nLCBMb2FkQmFsYW5jZXI6IHN0cmluZywgVGFyZ2V0R3JvdXA6IHN0cmluZyB9PjtcbiAgcHVibGljIHN0YXRpYyB1bkhlYWx0aHlIb3N0Q291bnRNYXhpbXVtKGRpbWVuc2lvbnM6IGFueSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvTmV0d29ya0VMQicsXG4gICAgICBtZXRyaWNOYW1lOiAnVW5IZWFsdGh5SG9zdENvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9O1xuICB9XG59XG50eXBlIE1ldHJpY1dpdGhEaW1zPEQ+ID0geyBuYW1lc3BhY2U6IHN0cmluZywgbWV0cmljTmFtZTogc3RyaW5nLCBzdGF0aXN0aWM6IHN0cmluZywgZGltZW5zaW9uc01hcDogRCB9O1xuIl19