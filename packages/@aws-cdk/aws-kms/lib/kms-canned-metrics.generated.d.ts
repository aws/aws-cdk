export declare class KMSMetrics {
    static secondsUntilKeyMaterialExpirationAverage(dimensions: {
        KeyId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            KeyId: string;
        };
        statistic: string;
    };
}
