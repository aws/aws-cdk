export declare class IoT1ClickMetrics {
    static totalEventsSum(dimensions: {
        DeviceType: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DeviceType: string;
        };
        statistic: string;
    };
    static remainingLifeAverage(dimensions: {
        DeviceType: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DeviceType: string;
        };
        statistic: string;
    };
    static callbackInvocationErrorsSum(dimensions: {
        DeviceType: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DeviceType: string;
        };
        statistic: string;
    };
}
