export declare class ELBMetrics {
    static backendConnectionErrorsSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static backendConnectionErrorsSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static desyncMitigationModeNonCompliantRequestCountSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static desyncMitigationModeNonCompliantRequestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeBackend2XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeBackend2XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeBackend3XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeBackend3XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeBackend4XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeBackend4XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeBackend5XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeBackend5XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeElb4XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeElb4XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static httpCodeElb5XxSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static httpCodeElb5XxSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static healthyHostCountAverage(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static healthyHostCountAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static latencyAverage(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static latencyAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static requestCountSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static requestCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static spilloverCountSum(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static spilloverCountSum(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static surgeQueueLengthAverage(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static surgeQueueLengthAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
    static unHealthyHostCountAverage(dimensions: {
        LoadBalancerName: string;
    }): MetricWithDims<{
        LoadBalancerName: string;
    }>;
    static unHealthyHostCountAverage(dimensions: {
        AvailabilityZone: string;
        LoadBalancerName: string;
    }): MetricWithDims<{
        AvailabilityZone: string;
        LoadBalancerName: string;
    }>;
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
