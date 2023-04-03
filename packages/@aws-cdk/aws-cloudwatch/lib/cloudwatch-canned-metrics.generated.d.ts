export declare class CloudWatchMetricStreamsMetrics {
    static metricUpdateSum(dimensions: {
        MetricStreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            MetricStreamName: string;
        };
        statistic: string;
    };
    static publishErrorRateAverage(dimensions: {
        MetricStreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            MetricStreamName: string;
        };
        statistic: string;
    };
}
