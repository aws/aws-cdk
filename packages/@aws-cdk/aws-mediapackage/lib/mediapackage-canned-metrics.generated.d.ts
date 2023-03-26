export declare class MediaPackageMetrics {
    static egressRequestCountSum(dimensions: {
        Channel: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Channel: string;
        };
        statistic: string;
    };
    static egressResponseTimeAverage(dimensions: {
        Channel: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Channel: string;
        };
        statistic: string;
    };
    static egressBytesSum(dimensions: {
        Channel: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Channel: string;
        };
        statistic: string;
    };
}
