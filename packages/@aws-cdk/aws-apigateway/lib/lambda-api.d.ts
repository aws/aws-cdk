import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { LambdaIntegrationOptions } from './integrations';
import { RestApi, RestApiProps } from './restapi';
export interface LambdaRestApiProps extends RestApiProps {
    /**
     * The default Lambda function that handles all requests from this API.
     *
     * This handler will be used as a the default integration for all methods in
     * this API, unless specified otherwise in `addMethod`.
     */
    readonly handler: lambda.IFunction;
    /**
     * Specific Lambda integration options.
     *
     * @default see defaults defined in `LambdaIntegrationOptions`.
     */
    readonly integrationOptions?: LambdaIntegrationOptions;
    /**
     * If true, route all requests to the Lambda Function
     *
     * If set to false, you will need to explicitly define the API model using
     * `addResource` and `addMethod` (or `addProxy`).
     *
     * @default true
     */
    readonly proxy?: boolean;
    /**
     * @deprecated the `LambdaRestApiProps` now extends `RestApiProps`, so all
     * options are just available here. Note that the options specified in
     * `options` will be overridden by any props specified at the root level.
     *
     * @default - no options.
     */
    readonly options?: RestApiProps;
}
/**
 * Defines an API Gateway REST API with AWS Lambda proxy integration.
 *
 * Use the `proxy` property to define a greedy proxy ("{proxy+}") and "ANY"
 * method from the specified path. If not defined, you will need to explicity
 * add resources and methods to the API.
 */
export declare class LambdaRestApi extends RestApi {
    constructor(scope: Construct, id: string, props: LambdaRestApiProps);
}
