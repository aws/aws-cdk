import * as cognito from '@aws-cdk/aws-cognito';
import { Duration, FeatureFlags, Lazy, Names, Stack } from '@aws-cdk/core';
import { APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { CfnAuthorizer, CfnAuthorizerProps } from '../apigateway.generated';
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
export class CognitoUserPoolsAuthorizer extends Authorizer implements IAuthorizer {
  /**
   * The id of the authorizer.
   * @attribute
   */
  public readonly authorizerId: string;

  /**
   * The ARN of the authorizer to be used in permission policies, such as IAM and resource-based grants.
   * @attribute
   */
  public readonly authorizerArn: string;

  /**
   * The authorization type of this authorizer.
   */
  public readonly authorizationType?: AuthorizationType;

  private restApiId?: string;

  private readonly authorizerProps: CfnAuthorizerProps;

  constructor(scope: Construct, id: string, props: CognitoUserPoolsAuthorizerProps) {
    super(scope, id);

    const restApiId = this.lazyRestApiId();

    const authorizerProps = {
      name: props.authorizerName ?? Names.uniqueId(this),
      restApiId,
      type: 'COGNITO_USER_POOLS',
      providerArns: props.cognitoUserPools.map(userPool => userPool.userPoolArn),
      authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds(),
      identitySource: props.identitySource || 'method.request.header.Authorization',
    };

    this.authorizerProps = authorizerProps;

    const resource = new CfnAuthorizer(this, 'Resource', authorizerProps);

    this.authorizerId = resource.ref;
    this.authorizerArn = Stack.of(this).formatArn({
      service: 'execute-api',
      resource: restApiId,
      resourceName: `authorizers/${this.authorizerId}`,
    });
    this.authorizationType = AuthorizationType.COGNITO;
  }

  /**
   * Attaches this authorizer to a specific REST API.
   * @internal
   */
  public _attachToApi(restApi: IRestApi): void {
    if (this.restApiId && this.restApiId !== restApi.restApiId) {
      throw new Error('Cannot attach authorizer to two different rest APIs');
    }

    this.restApiId = restApi.restApiId;

    const addToLogicalId = FeatureFlags.of(this).isEnabled(APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID);

    const deployment = restApi.latestDeployment;
    if (deployment && addToLogicalId) {
      deployment.node.addDependency(this);
      deployment.addToLogicalId({
        authorizer: this.authorizerProps,
      });
    }
  }

  /**
   * Returns a token that resolves to the Rest Api Id at the time of synthesis.
   * Throws an error, during token resolution, if no RestApi is attached to this authorizer.
   */
  private lazyRestApiId() {
    return Lazy.string({
      produce: () => {
        if (!this.restApiId) {
          throw new Error(`Authorizer (${this.node.path}) must be attached to a RestApi`);
        }
        return this.restApiId;
      },
    });
  }
}
