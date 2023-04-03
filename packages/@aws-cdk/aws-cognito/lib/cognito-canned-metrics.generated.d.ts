export declare class CognitoMetrics {
    static noRiskSum(dimensions: {
        Operation: string;
        UserPoolId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
            UserPoolId: string;
        };
        statistic: string;
    };
    static riskSum(dimensions: {
        Operation: string;
        UserPoolId: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            Operation: string;
            UserPoolId: string;
        };
        statistic: string;
    };
}
