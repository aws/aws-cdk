export declare class TimestreamMetrics {
    static userErrorsSum(dimensions: {
        Operation: string;
    }): MetricWithDims<{
        Operation: string;
    }>;
    static userErrorsSum(dimensions: {
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }): MetricWithDims<{
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }>;
    static systemErrorsSum(dimensions: {
        Operation: string;
    }): MetricWithDims<{
        Operation: string;
    }>;
    static systemErrorsSum(dimensions: {
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }): MetricWithDims<{
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }>;
    static successfulRequestLatencySampleCount(dimensions: {
        Operation: string;
    }): MetricWithDims<{
        Operation: string;
    }>;
    static successfulRequestLatencySampleCount(dimensions: {
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }): MetricWithDims<{
        DatabaseName: string;
        Operation: string;
        TableName: string;
    }>;
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
