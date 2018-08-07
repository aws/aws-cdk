import { cloudformation } from '@aws-cdk/aws-cloudformation';
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
/**
 * Collection of arbitrary properties
 */
export declare type Properties = {
    [key: string]: any;
};
/**
 * Properties to provide a Lambda-backed custom resource
 */
export interface CustomResourceProps {
    /**
     * The Lambda provider that implements this custom resource.
     *
     * We recommend using a SingletonLambda for this.
     *
     * Optional, exactly one of lamdaProvider or topicProvider must be set.
     */
    lambdaProvider?: lambda.LambdaRef;
    /**
     * The SNS Topic for the provider that implements this custom resource.
     *
     * Optional, exactly one of lamdaProvider or topicProvider must be set.
     */
    topicProvider?: sns.TopicRef;
    /**
     * Properties to pass to the Lambda
     */
    properties?: Properties;
}
/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
export declare class CustomResource extends cloudformation.CustomResource {
    private readonly userProperties?;
    constructor(parent: cdk.Construct, name: string, props: CustomResourceProps);
    /**
     * Override renderProperties to mix in the user-defined properties
     */
    protected renderProperties(): {
        [key: string]: any;
    };
}
