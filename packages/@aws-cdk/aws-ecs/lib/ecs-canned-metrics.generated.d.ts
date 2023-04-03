export declare class ECSMetrics {
    static cpuUtilizationAverage(dimensions: {
        ClusterName: string;
        ServiceName: string;
    }): MetricWithDims<{
        ClusterName: string;
        ServiceName: string;
    }>;
    static cpuUtilizationAverage(dimensions: {
        ClusterName: string;
    }): MetricWithDims<{
        ClusterName: string;
    }>;
    static memoryUtilizationAverage(dimensions: {
        ClusterName: string;
        ServiceName: string;
    }): MetricWithDims<{
        ClusterName: string;
        ServiceName: string;
    }>;
    static memoryUtilizationAverage(dimensions: {
        ClusterName: string;
    }): MetricWithDims<{
        ClusterName: string;
    }>;
    static cpuReservationAverage(dimensions: {
        ClusterName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ClusterName: string;
        };
        statistic: string;
    };
    static memoryReservationAverage(dimensions: {
        ClusterName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ClusterName: string;
        };
        statistic: string;
    };
    static gpuReservationAverage(dimensions: {
        ClusterName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ClusterName: string;
        };
        statistic: string;
    };
}
declare type MetricWithDims<D> = {
    namespace: string;
    metricName: string;
    statistic: string;
    dimensionsMap: D;
};
export {};
