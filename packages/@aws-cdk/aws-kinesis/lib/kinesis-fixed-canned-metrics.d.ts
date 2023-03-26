/**
 * This class is to consolidate all the metrics from Stream in just one place.
 *
 * Current generated canned metrics don't match the proper metrics from the service. If it is fixed
 * at the source this class can be removed and just use the generated one directly.
 *
 * Stream Metrics reference: https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
 */
export declare class KinesisMetrics {
    static getRecordsBytesAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsSuccessAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsLatencyAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordBytesAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordLatencyAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsIteratorAgeMillisecondsMaximum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordSuccessAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
    static putRecordsBytesAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
    static putRecordsLatencyAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsSuccessAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsTotalRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsSuccessfulRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsFailedRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsThrottledRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static incomingBytesAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
    static incomingRecordsAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
    static readProvisionedThroughputExceededAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
    static writeProvisionedThroughputExceededAverage(dimensions: {
        StreamName: string;
    }): {
        statistic: string;
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
    };
}
