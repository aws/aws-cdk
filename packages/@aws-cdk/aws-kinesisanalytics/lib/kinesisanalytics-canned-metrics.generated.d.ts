export declare class KinesisAnalyticsMetrics {
    static kpUsAverage(dimensions: {
        Application: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Application: string;
        };
        statistic: string;
    };
    static millisBehindLatestAverage(dimensions: {
        Application: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Application: string;
        };
        statistic: string;
    };
}
