export declare class TransferMetrics {
    static bytesInSum(dimensions: {
        ServerId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ServerId: string;
        };
        statistic: string;
    };
    static bytesOutSum(dimensions: {
        ServerId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ServerId: string;
        };
        statistic: string;
    };
}
