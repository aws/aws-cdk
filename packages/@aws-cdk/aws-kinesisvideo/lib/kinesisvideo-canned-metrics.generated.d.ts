export declare class KinesisVideoMetrics {
    static getMediaSuccessSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putMediaSuccessSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static getMediaMillisBehindNowSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static listFragmentsLatencySum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putMediaFragmentIngestionLatencySum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putMediaFragmentPersistLatencySum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putMediaIncomingBytesSum(dimensions: {
        StreamName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            StreamName: string;
        };
        statistic: string;
    };
    static putMediaIncomingFramesSum(dimensions: {
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
