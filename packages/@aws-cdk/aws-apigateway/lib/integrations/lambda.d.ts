import * as lambda from '@aws-cdk/aws-lambda';
import { AwsIntegration } from './aws';
import { IntegrationConfig, IntegrationOptions } from '../integration';
import { Method } from '../method';
export interface LambdaIntegrationOptions extends IntegrationOptions {
    /**
     * Use proxy integration or normal (request/response mapping) integration.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
     *
     * @default true
     */
    readonly proxy?: boolean;
    /**
     * Allow invoking method from AWS Console UI (for testing purposes).
     *
     * This will add another permission to the AWS Lambda resource policy which
     * will allow the `test-invoke-stage` stage to invoke this handler. If this
     * is set to `false`, the function will only be usable from the deployment
     * endpoint.
     *
     * @default true
     */
    readonly allowTestInvoke?: boolean;
}
/**
 * Integrates an AWS Lambda function to an API Gateway method.
 *
 * @example
 *
 *    declare const resource: apigateway.Resource;
 *    declare const handler: lambda.Function;
 *    resource.addMethod('GET', new apigateway.LambdaIntegration(handler));
 *
 */
export declare class LambdaIntegration extends AwsIntegration {
    private readonly handler;
    private readonly enableTest;
    constructor(handler: lambda.IFunction, options?: LambdaIntegrationOptions);
    bind(method: Method): IntegrationConfig;
}
