export declare class SNSMetrics {
    static numberOfNotificationsDeliveredSum(dimensions: {
        TopicName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TopicName: string;
        };
        statistic: string;
    };
    static numberOfNotificationsFailedSum(dimensions: {
        TopicName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TopicName: string;
        };
        statistic: string;
    };
    static numberOfMessagesPublishedSum(dimensions: {
        TopicName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TopicName: string;
        };
        statistic: string;
    };
    static publishSizeAverage(dimensions: {
        TopicName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TopicName: string;
        };
        statistic: string;
    };
    static smsSuccessRateSum(dimensions: {
        TopicName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            TopicName: string;
        };
        statistic: string;
    };
}
