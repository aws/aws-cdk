export declare class S3Metrics {
    static bucketSizeBytesAverage(dimensions: {
        BucketName: string;
        StorageType: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            BucketName: string;
            StorageType: string;
        };
        statistic: string;
    };
    static numberOfObjectsAverage(dimensions: {
        BucketName: string;
        StorageType: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            BucketName: string;
            StorageType: string;
        };
        statistic: string;
    };
}
