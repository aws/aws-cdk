export declare class SQSMetrics {
    static numberOfMessagesSentAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static approximateNumberOfMessagesDelayedAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static numberOfMessagesReceivedAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static numberOfMessagesDeletedAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static approximateNumberOfMessagesNotVisibleAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static approximateNumberOfMessagesVisibleAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static approximateAgeOfOldestMessageAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static numberOfEmptyReceivesAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
    static sentMessageSizeAverage(dimensions: {
        QueueName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            QueueName: string;
        };
        statistic: string;
    };
}
