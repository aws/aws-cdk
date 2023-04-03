export declare class CloudFrontMetrics {
    static requestsSum(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
    static totalErrorRateAverage(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
    static bytesDownloadedSum(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
    static bytesUploadedSum(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
    static _4XxErrorRateAverage(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
    static _5XxErrorRateAverage(dimensions: {
        DistributionId: string;
        Region: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            DistributionId: string;
            Region: string;
        };
        statistic: string;
    };
}
