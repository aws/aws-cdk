import * as iam from '@aws-cdk/aws-iam';
import { IResource as IResourceBase, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ResourceOptions } from './resource';
import { IRestApi } from './restapi';
import { IStage } from './stage';
import { QuotaSettings, ThrottleSettings, UsagePlanPerApiStage } from './usage-plan';
/**
 * API keys are alphanumeric string values that you distribute to
 * app developer customers to grant access to your API
 */
export interface IApiKey extends IResourceBase {
    /**
     * The API key ID.
     * @attribute
     */
    readonly keyId: string;
    /**
     * The API key ARN.
     */
    readonly keyArn: string;
}
/**
 * The options for creating an API Key.
 */
export interface ApiKeyOptions extends ResourceOptions {
    /**
     * A name for the API key. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name.
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
     * @default automically generated name
     */
    readonly apiKeyName?: string;
    /**
     * The value of the API key. Must be at least 20 characters long.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-value
     * @default none
     */
    readonly value?: string;
    /**
     * A description of the purpose of the API key.
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-description
     * @default none
     */
    readonly description?: string;
}
/**
 * ApiKey Properties.
 */
export interface ApiKeyProps extends ApiKeyOptions {
    /**
     * A list of resources this api key is associated with.
     * @default none
     * @deprecated - use `stages` instead
     */
    readonly resources?: IRestApi[];
    /**
     * A list of Stages this api key is associated with.
     *
     * @default - the api key is not associated with any stages
     */
    readonly stages?: IStage[];
    /**
     * An AWS Marketplace customer identifier to use when integrating with the AWS SaaS Marketplace.
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-customerid
     * @default none
     */
    readonly customerId?: string;
    /**
     * Indicates whether the API key can be used by clients.
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-enabled
     * @default true
     */
    readonly enabled?: boolean;
    /**
     * Specifies whether the key identifier is distinct from the created API key value.
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-generatedistinctid
     * @default false
     */
    readonly generateDistinctId?: boolean;
}
/**
 * Base implementation that is common to the various implementations of IApiKey
 */
declare abstract class ApiKeyBase extends Resource implements IApiKey {
    abstract readonly keyId: string;
    abstract readonly keyArn: string;
    /**
     * Permits the IAM principal all read operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantRead(grantee: iam.IGrantable): iam.Grant;
    /**
     * Permits the IAM principal all write operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantWrite(grantee: iam.IGrantable): iam.Grant;
    /**
     * Permits the IAM principal all read and write operations through this key
     *
     * @param grantee The principal to grant access to
     */
    grantReadWrite(grantee: iam.IGrantable): iam.Grant;
}
/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export declare class ApiKey extends ApiKeyBase {
    /**
     * Import an ApiKey by its Id
     */
    static fromApiKeyId(scope: Construct, id: string, apiKeyId: string): IApiKey;
    readonly keyId: string;
    readonly keyArn: string;
    constructor(scope: Construct, id: string, props?: ApiKeyProps);
    private renderStageKeys;
}
/**
 * RateLimitedApiKey properties.
 */
export interface RateLimitedApiKeyProps extends ApiKeyProps {
    /**
     * API Stages to be associated with the RateLimitedApiKey.
     * @default none
     */
    readonly apiStages?: UsagePlanPerApiStage[];
    /**
     * Number of requests clients can make in a given time period.
     * @default none
     */
    readonly quota?: QuotaSettings;
    /**
     * Overall throttle settings for the API.
     * @default none
     */
    readonly throttle?: ThrottleSettings;
}
/**
 * An API Gateway ApiKey, for which a rate limiting configuration can be specified.
 *
 * @resource AWS::ApiGateway::ApiKey
 */
export declare class RateLimitedApiKey extends ApiKeyBase {
    readonly keyId: string;
    readonly keyArn: string;
    constructor(scope: Construct, id: string, props?: RateLimitedApiKeyProps);
}
export {};
