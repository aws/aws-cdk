export declare class ApiGatewayMetrics {
    static _4XxErrorSum(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static _4XxErrorSum(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static _4XxErrorSum(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static _5XxErrorSum(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static _5XxErrorSum(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static _5XxErrorSum(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static cacheHitCountSum(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static cacheHitCountSum(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static cacheHitCountSum(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static cacheMissCountSum(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static cacheMissCountSum(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static cacheMissCountSum(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static countSum(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static countSum(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static countSum(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static integrationLatencyAverage(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static integrationLatencyAverage(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static integrationLatencyAverage(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
    static latencyAverage(dimensions: {
        ApiName: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Stage: string;
    }>;
    static latencyAverage(dimensions: {
        ApiName: string;
    }): MetricWithDims<{
        ApiName: string;
    }>;
    static latencyAverage(dimensions: {
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }): MetricWithDims<{
        ApiName: string;
        Method: string;
        Resource: string;
        Stage: string;
    }>;
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
