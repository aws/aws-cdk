"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexMetrics = void 0;
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
class LexMetrics {
    static runtimeRequestCountSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeRequestCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimeSuccessfulRequestLatencyAverage(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeSuccessfulRequestLatency',
            dimensionsMap: dimensions,
            statistic: 'Average',
        };
    }
    static runtimeInvalidLambdaResponsesSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeInvalidLambdaResponses',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimeLambdaErrorsSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeLambdaErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static missedUtteranceCountSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'MissedUtteranceCount',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimePollyErrorsSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimePollyErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimeSystemErrorsSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeSystemErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimeThrottledEventsSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeThrottledEvents',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
    static runtimeUserErrorsSum(dimensions) {
        return {
            namespace: 'AWS/Lex',
            metricName: 'RuntimeUserErrors',
            dimensionsMap: dimensions,
            statistic: 'Sum',
        };
    }
}
exports.LexMetrics = LexMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4LWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxleC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtFQUErRTs7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUU5RixNQUFhLFVBQVU7SUFDZCxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBb0U7UUFDdkcsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHNDQUFzQyxDQUFDLFVBQW9FO1FBQ3ZILE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsaUNBQWlDO1lBQzdDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxVQUFvRTtRQUNqSCxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLCtCQUErQjtZQUMzQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBb0U7UUFDdkcsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQW9FO1FBQ3hHLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsc0JBQXNCO1lBQ2xDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFvRTtRQUN0RyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7SUFDTSxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBb0U7UUFDdkcsT0FBTztZQUNMLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsYUFBYSxFQUFFLFVBQVU7WUFDekIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQztLQUNIO0lBQ00sTUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQW9FO1FBQzFHLE9BQU87WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLGFBQWEsRUFBRSxVQUFVO1lBQ3pCLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUM7S0FDSDtJQUNNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFvRTtRQUNyRyxPQUFPO1lBQ0wsU0FBUyxFQUFFLFNBQVM7WUFDcEIsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixhQUFhLEVBQUUsVUFBVTtZQUN6QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDO0tBQ0g7Q0FDRjtBQXpFRCxnQ0F5RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuZXhwb3J0IGNsYXNzIExleE1ldHJpY3Mge1xuICBwdWJsaWMgc3RhdGljIHJ1bnRpbWVSZXF1ZXN0Q291bnRTdW0oZGltZW5zaW9uczogeyBCb3RBbGlhczogc3RyaW5nLCBCb3ROYW1lOiBzdHJpbmcsIE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xleCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUnVudGltZVJlcXVlc3RDb3VudCcsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcnVudGltZVN1Y2Nlc3NmdWxSZXF1ZXN0TGF0ZW5jeUF2ZXJhZ2UoZGltZW5zaW9uczogeyBCb3RBbGlhczogc3RyaW5nLCBCb3ROYW1lOiBzdHJpbmcsIE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xleCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUnVudGltZVN1Y2Nlc3NmdWxSZXF1ZXN0TGF0ZW5jeScsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJ1bnRpbWVJbnZhbGlkTGFtYmRhUmVzcG9uc2VzU3VtKGRpbWVuc2lvbnM6IHsgQm90QWxpYXM6IHN0cmluZywgQm90TmFtZTogc3RyaW5nLCBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MZXgnLFxuICAgICAgbWV0cmljTmFtZTogJ1J1bnRpbWVJbnZhbGlkTGFtYmRhUmVzcG9uc2VzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBydW50aW1lTGFtYmRhRXJyb3JzU3VtKGRpbWVuc2lvbnM6IHsgQm90QWxpYXM6IHN0cmluZywgQm90TmFtZTogc3RyaW5nLCBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MZXgnLFxuICAgICAgbWV0cmljTmFtZTogJ1J1bnRpbWVMYW1iZGFFcnJvcnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIG1pc3NlZFV0dGVyYW5jZUNvdW50U3VtKGRpbWVuc2lvbnM6IHsgQm90QWxpYXM6IHN0cmluZywgQm90TmFtZTogc3RyaW5nLCBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MZXgnLFxuICAgICAgbWV0cmljTmFtZTogJ01pc3NlZFV0dGVyYW5jZUNvdW50JyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBydW50aW1lUG9sbHlFcnJvcnNTdW0oZGltZW5zaW9uczogeyBCb3RBbGlhczogc3RyaW5nLCBCb3ROYW1lOiBzdHJpbmcsIE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xleCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUnVudGltZVBvbGx5RXJyb3JzJyxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IGRpbWVuc2lvbnMsXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH07XG4gIH1cbiAgcHVibGljIHN0YXRpYyBydW50aW1lU3lzdGVtRXJyb3JzU3VtKGRpbWVuc2lvbnM6IHsgQm90QWxpYXM6IHN0cmluZywgQm90TmFtZTogc3RyaW5nLCBPcGVyYXRpb246IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MZXgnLFxuICAgICAgbWV0cmljTmFtZTogJ1J1bnRpbWVTeXN0ZW1FcnJvcnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxuICBwdWJsaWMgc3RhdGljIHJ1bnRpbWVUaHJvdHRsZWRFdmVudHNTdW0oZGltZW5zaW9uczogeyBCb3RBbGlhczogc3RyaW5nLCBCb3ROYW1lOiBzdHJpbmcsIE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xleCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUnVudGltZVRocm90dGxlZEV2ZW50cycsXG4gICAgICBkaW1lbnNpb25zTWFwOiBkaW1lbnNpb25zLFxuICAgICAgc3RhdGlzdGljOiAnU3VtJyxcbiAgICB9O1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgcnVudGltZVVzZXJFcnJvcnNTdW0oZGltZW5zaW9uczogeyBCb3RBbGlhczogc3RyaW5nLCBCb3ROYW1lOiBzdHJpbmcsIE9wZXJhdGlvbjogc3RyaW5nIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0xleCcsXG4gICAgICBtZXRyaWNOYW1lOiAnUnVudGltZVVzZXJFcnJvcnMnLFxuICAgICAgZGltZW5zaW9uc01hcDogZGltZW5zaW9ucyxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfTtcbiAgfVxufVxuIl19