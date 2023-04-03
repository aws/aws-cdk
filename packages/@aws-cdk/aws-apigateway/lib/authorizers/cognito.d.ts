import * as cognito from '@aws-cdk/aws-cognito';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Authorizer, IAuthorizer } from '../authorizer';
import { AuthorizationType } from '../method';
import { IRestApi } from '../restapi';
/**
 * Properties for CognitoUserPoolsAuthorizer
 */
export interface CognitoUserPoolsAuthorizerProps {
    /**
     * An optional human friendly name for the authorizer. Note that, this is not the primary identifier of the authorizer.
     *
     * @default - the unique construct ID
     */
    readonly authorizerName?: string;
    /**
     * The user pools to associate with this authorizer.
     */
    readonly cognitoUserPools: cognito.IUserPool[];
    /**
     * How long APIGateway should cache the results. Max 1 hour.
     * Disable caching by setting this to 0.
     *
     * @default Duration.minutes(5)
     */
    readonly resultsCacheTtl?: Duration;
    /**
     * The request header mapping expression for the bearer token. This is typically passed as part of the header, in which case
     * this should be `method.request.header.Authorizer` where Authorizer is the header containing the bearer token.
     * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
     * @default `IdentitySource.header('Authorization')`
     */
    readonly identitySource?: string;
}
/**
 * Cognito user pools based custom authorizer
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export declare class CognitoUserPoolsAuthorizer extends Authorizer implements IAuthorizer {
    /**
     * The id of the authorizer.
     * @attribute
     */
    readonly authorizerId: string;
    /**
     * The ARN of the authorizer to be used in permission policies, such as IAM and resource-based grants.
     * @attribute
     */
    readonly authorizerArn: string;
    /**
     * The authorization type of this authorizer.
     */
    readonly authorizationType?: AuthorizationType;
    private restApiId?;
    private readonly authorizerProps;
    constructor(scope: Construct, id: string, props: CognitoUserPoolsAuthorizerProps);
    /**
     * Attaches this authorizer to a specific REST API.
     * @internal
     */
    _attachToApi(restApi: IRestApi): void;
    /**
     * Returns a token that resolves to the Rest Api Id at the time of synthesis.
     * Throws an error, during token resolution, if no RestApi is attached to this authorizer.
     */
    private lazyRestApiId;
}
