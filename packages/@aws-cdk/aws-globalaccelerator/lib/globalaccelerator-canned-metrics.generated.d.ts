export declare class GlobalAcceleratorMetrics {
    static newFlowCountSum(dimensions: {
        Accelerator: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Accelerator: string;
        };
        statistic: string;
    };
    static processedBytesInSum(dimensions: {
        Accelerator: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Accelerator: string;
        };
        statistic: string;
    };
    static processedBytesOutSum(dimensions: {
        Accelerator: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Accelerator: string;
        };
        statistic: string;
    };
}
