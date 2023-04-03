export declare class LogsMetrics {
    static incomingLogEventsSum(dimensions: {
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LogGroupName: string;
        };
        statistic: string;
    };
    static incomingBytesSum(dimensions: {
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LogGroupName: string;
        };
        statistic: string;
    };
    static deliveryErrorsSum(dimensions: {
        DestinationType: string;
        FilterName: string;
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DestinationType: string;
            FilterName: string;
            LogGroupName: string;
        };
        statistic: string;
    };
    static deliveryThrottlingSum(dimensions: {
        DestinationType: string;
        FilterName: string;
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DestinationType: string;
            FilterName: string;
            LogGroupName: string;
        };
        statistic: string;
    };
    static forwardedBytesSum(dimensions: {
        DestinationType: string;
        FilterName: string;
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DestinationType: string;
            FilterName: string;
            LogGroupName: string;
        };
        statistic: string;
    };
    static forwardedLogEventsSum(dimensions: {
        DestinationType: string;
        FilterName: string;
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DestinationType: string;
            FilterName: string;
            LogGroupName: string;
        };
        statistic: string;
    };
    static throttleCountSum(dimensions: {
        DestinationType: string;
        FilterName: string;
        LogGroupName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DestinationType: string;
            FilterName: string;
            LogGroupName: string;
        };
        statistic: string;
    };
}
