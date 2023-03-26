import { Construct } from 'constructs';
import { IFunction } from './function-base';
/**
 * Config returned from `LambdaInsightsVersion._bind`
 */
interface InsightsBindConfig {
    /**
     * ARN of the Lambda Insights Layer Version
     */
    readonly arn: string;
}
/**
 * Version of CloudWatch Lambda Insights
 */
export declare abstract class LambdaInsightsVersion {
    /**
     * Version 1.0.54.0
     */
    static readonly VERSION_1_0_54_0: LambdaInsightsVersion;
    /**
     * Version 1.0.86.0
     */
    static readonly VERSION_1_0_86_0: LambdaInsightsVersion;
    /**
     * Version 1.0.89.0
     */
    static readonly VERSION_1_0_89_0: LambdaInsightsVersion;
    /**
     * Version 1.0.98.0
     */
    static readonly VERSION_1_0_98_0: LambdaInsightsVersion;
    /**
     * Version 1.0.119.0
     */
    static readonly VERSION_1_0_119_0: LambdaInsightsVersion;
    /**
     * Version 1.0.135.0
     */
    static readonly VERSION_1_0_135_0: LambdaInsightsVersion;
    /**
     * Version 1.0.143.0
     */
    static readonly VERSION_1_0_143_0: LambdaInsightsVersion;
    /**
     * Version 1.0.178.0
     */
    static readonly VERSION_1_0_178_0: LambdaInsightsVersion;
    /**
     * Use the insights extension associated with the provided ARN. Make sure the ARN is associated
     * with same region as your function
     *
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
     */
    static fromInsightVersionArn(arn: string): LambdaInsightsVersion;
    private static fromInsightsVersion;
    /**
     * The arn of the Lambda Insights extension
     */
    readonly layerVersionArn: string;
    /**
     * Returns the arn of the Lambda Insights extension based on the
     * Lambda architecture
     * @internal
     */
    abstract _bind(_scope: Construct, _function: IFunction): InsightsBindConfig;
}
export {};
