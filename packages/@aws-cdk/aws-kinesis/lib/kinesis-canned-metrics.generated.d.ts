export declare class KinesisMetrics {
    static readProvisionedThroughputExceededSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static writeProvisionedThroughputExceededSum(dimensions: {
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
    static putRecordSuccessSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsSuccessSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putRecordsBytesSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsSuccessSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsBytesSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsRecordsSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getRecordsLatencyMaximum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static incomingBytesSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static incomingRecordsSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
}
