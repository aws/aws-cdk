export declare class QLDBMetrics {
    static commandLatencyAverage(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static journalStorageSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static indexedStorageSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static isImpairedSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static occConflictExceptionsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static readIOsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static session4XxExceptionsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static session5XxExceptionsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static sessionRateExceededExceptionsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
    static writeIOsSum(dimensions: {
        LedgerName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            LedgerName: string;
        };
        statistic: string;
    };
}
