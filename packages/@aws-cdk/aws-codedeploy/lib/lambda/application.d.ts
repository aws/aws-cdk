import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a reference to a CodeDeploy Application deploying to AWS Lambda.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the `LambdaApplication` class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the `LambdaApplication#fromLambdaApplicationName` method.
 */
export interface ILambdaApplication extends IResource {
    /** @attribute */
    readonly applicationArn: string;
    /** @attribute */
    readonly applicationName: string;
}
/**
 * Construction properties for `LambdaApplication`.
 */
export interface LambdaApplicationProps {
    /**
     * The physical, human-readable name of the CodeDeploy Application.
     *
     * @default an auto-generated name will be used
     */
    readonly applicationName?: string;
}
/**
 * A CodeDeploy Application that deploys to an AWS Lambda function.
 *
 * @resource AWS::CodeDeploy::Application
 */
export declare class LambdaApplication extends Resource implements ILambdaApplication {
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack.
     *
     * The Application's account and region are assumed to be the same as the stack it is being imported
     * into. If not, use `fromLambdaApplicationArn`.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param lambdaApplicationName the name of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromLambdaApplicationName(scope: Construct, id: string, lambdaApplicationName: string): ILambdaApplication;
    /**
     * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param lambdaApplicationArn the ARN of the application to import
     * @returns a Construct representing a reference to an existing Application
     */
    static fromLambdaApplicationArn(scope: Construct, id: string, lambdaApplicationArn: string): ILambdaApplication;
    readonly applicationArn: string;
    readonly applicationName: string;
    constructor(scope: Construct, id: string, props?: LambdaApplicationProps);
}
