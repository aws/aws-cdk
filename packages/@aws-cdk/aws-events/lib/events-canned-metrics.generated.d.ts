export declare class EventsMetrics {
    static invocationsSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
    static failedInvocationsSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
    static deadLetterInvocationsSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
    static triggeredRulesSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
    static matchedEventsSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
    static throttledRulesSum(dimensions: {
        RuleName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            RuleName: string;
        };
        statistic: string;
    };
}
