export declare class InspectorMetrics {
    static totalHealthyAgentsAverage(dimensions: {
        AssessmentTemplateArn: string;
        AssessmentTemplateName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AssessmentTemplateArn: string;
            AssessmentTemplateName: string;
        };
        statistic: string;
    };
    static totalAssessmentRunsAverage(dimensions: {
        AssessmentTemplateArn: string;
        AssessmentTemplateName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AssessmentTemplateArn: string;
            AssessmentTemplateName: string;
        };
        statistic: string;
    };
    static totalMatchingAgentsAverage(dimensions: {
        AssessmentTemplateArn: string;
        AssessmentTemplateName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AssessmentTemplateArn: string;
            AssessmentTemplateName: string;
        };
        statistic: string;
    };
    static totalFindingsAverage(dimensions: {
        AssessmentTemplateArn: string;
        AssessmentTemplateName: string;
    }): {
        namespace: string;
        metricName: string;
        dimensionsMap: {
            AssessmentTemplateArn: string;
            AssessmentTemplateName: string;
        };
        statistic: string;
    };
}
