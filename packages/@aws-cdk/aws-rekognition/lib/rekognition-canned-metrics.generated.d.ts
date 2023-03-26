export declare class RekognitionMetrics {
    static successfulRequestCountSum(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
    static serverErrorCountSum(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
    static detectedFaceCountSum(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
    static detectedLabelCountSum(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
    static responseTimeAverage(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
    static userErrorCountSum(dimensions: {
        Operation: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
        };
        statistic: string;
    };
}
