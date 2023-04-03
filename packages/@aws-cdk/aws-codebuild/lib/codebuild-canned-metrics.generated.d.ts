export declare class CodeBuildMetrics {
    static succeededBuildsSum(dimensions: {
        ProjectName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ProjectName: string;
        };
        statistic: string;
    };
    static failedBuildsSum(dimensions: {
        ProjectName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ProjectName: string;
        };
        statistic: string;
    };
    static buildsSum(dimensions: {
        ProjectName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ProjectName: string;
        };
        statistic: string;
    };
    static durationAverage(dimensions: {
        ProjectName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            ProjectName: string;
        };
        statistic: string;
    };
}
