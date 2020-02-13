import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Lazy, Stack } from '@aws-cdk/core';
import { CfnAuthorizer } from '../apigateway.generated';
import { Authorizer, IAuthorizer } from '../authorizer';
import { RestApi } from '../restapi';

/**
 * Base properties for all lambda authorizers
 */
export interface LambdaAuthorizerProps {
  /**
   * An optional human friendly name for the authorizer. Note that, this is not the primary identifier of the authorizer.
   *
   * @default this.node.uniqueId
   */
  readonly authorizerName?: string;

  /**
   * The handler for the authorizer lambda function.
   *
   * The handler must follow a very specific protocol on the input it receives and the output it needs to produce.
   * API Gateway has documented the handler's input specification
   * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html | here} and output specification
   * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html | here}.
   */
  readonly handler: lambda.IFunction;

  /**
   * How long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to 0.
   *
   * @default Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * An optional IAM role for APIGateway to assume before calling the Lambda-based authorizer. The IAM role must be
   * assumable by 'apigateway.amazonaws.com'.
   *
   * @default - A resource policy is added to the Lambda function allowing apigateway.amazonaws.com to invoke the function.
   */
  readonly assumeRole?: iam.IRole;
}

abstract class LambdaAuthorizer extends Authorizer implements IAuthorizer {

  /**
   * The id of the authorizer.
   * @attribute
   */
  public readonly authorizerId: string;

  /**
   * The ARN of the authorizer to be used in permission policies, such as IAM and resource-based grants.
   */
  public readonly authorizerArn: string;

  protected restApiId?: string;

  protected constructor(scope: Construct, id: string, props: LambdaAuthorizerProps) {
    super(scope, id);

    if (props.resultsCacheTtl && props.resultsCacheTtl.toSeconds() > 3600) {
      throw new Error(`Lambda authorizer property 'resultsCacheTtl' must not be greater than 3600 seconds (1 hour)`);
    }

    const restApiId = Lazy.stringValue({ produce: () => this.restApiId });

    this.authorizerId = this.createResource(props).ref;

    this.authorizerArn = Stack.of(this).formatArn({
      service: 'execute-api',
      resource: restApiId,
      resourceName: `authorizers/${this.authorizerId}`
    });

    if (!props.assumeRole) {
      props.handler.addPermission(`${this.node.uniqueId}:Permissions`, {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn: this.authorizerArn
      });
    } else if (props.assumeRole instanceof iam.Role) { // i.e., not imported
      props.assumeRole.attachInlinePolicy(new iam.Policy(this, 'authorizerInvokePolicy', {
        statements: [
          new iam.PolicyStatement({
            resources: [ props.handler.functionArn ],
            actions: [ 'lambda:InvokeFunction' ],
          })
        ]
      }));
    }
  }

  /**
   * Attaches this authorizer to a specific REST API.
   * @internal
   */
  public _attachToApi(restApi: RestApi) {
    if (this.restApiId && this.restApiId !== restApi.restApiId) {
      throw new Error(`Cannot attach authorizer to two different rest APIs`);
    }

    this.restApiId = restApi.restApiId;
  }

  protected abstract createResource<T extends LambdaAuthorizerProps>(props: T): CfnAuthorizer;
}

/**
 * Properties for TokenAuthorizer
 */
export interface TokenAuthorizerProps extends LambdaAuthorizerProps {
  /**
   * An optional regex to be matched against the authorization token. When matched the authorizer lambda is invoked,
   * otherwise a 401 Unauthorized is returned to the client.
   *
   * @default - no regex filter will be applied.
   */
  readonly validationRegex?: string;

  /**
   * The request header mapping expression for the bearer token. This is typically passed as part of the header, in which case
   * this should be `method.request.header.Authorizer` where Authorizer is the header containing the bearer token.
   * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
   * @default 'method.request.header.Authorization'
   */
  readonly identitySource?: string;
}

/**
 * Token based lambda authorizer that recognizes the caller's identity as a bearer token,
 * such as a JSON Web Token (JWT) or an OAuth token.
 * Based on the token, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export class TokenAuthorizer extends LambdaAuthorizer {

  constructor(scope: Construct, id: string, props: TokenAuthorizerProps) {
    super(scope, id, props);
  }

  protected createResource(props: TokenAuthorizerProps): CfnAuthorizer {
    const restApiId = Lazy.stringValue({ produce: () => this.restApiId });

    return new CfnAuthorizer(this, 'Resource', {
      name: props.authorizerName ?? this.node.uniqueId,
      restApiId,
      type: 'TOKEN',
      authorizerUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`,
      authorizerCredentials: props.assumeRole?.roleArn,
      authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds() ?? 0,
      identitySource: props.identitySource || 'method.request.header.Authorization',
      identityValidationExpression: props.validationRegex,
    });
  }
}

/**
 * Properties for RequestAuthorizerProps
 */
export interface RequestAuthorizerProps extends LambdaAuthorizerProps {
  /**
   * An array of request header mapping expressions for identities. Supported parameter types are
   * Header, Query String, Stage Variable, and Context. For instance, extracting an authorization
   * token from a header would use the identity source `method.request.header.Authorizer`.
   *
   * Note: API Gateway uses the specified identity sources as the request authorizer caching key. When caching is
   * enabled, API Gateway calls the authorizer's Lambda function only after successfully verifying that all the
   * specified identity sources are present at runtime. If a specified identify source is missing, null, or empty,
   * API Gateway returns a 401 Unauthorized response without calling the authorizer Lambda function.
   *
   * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
   * @default no identity sources
   */
  readonly identitySource?: string[];
}

/**
 * Request-based lambda authorizer that recognizes the caller's identity via request parameters,
 * such as headers, paths, query strings, stage variables, or context variables.
 * Based on the request, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export class RequestAuthorizer extends LambdaAuthorizer {

  constructor(scope: Construct, id: string, props: RequestAuthorizerProps) {
    super(scope, id, props);

    if (props.resultsCacheTtl && props.identitySource?.length === 0) {
      throw new Error(`At least one Identity Source is required for a REQUEST-based Lambda authorizer if caching is enabled.`);
    }
  }

  protected createResource(props: RequestAuthorizerProps): CfnAuthorizer {
    const restApiId = Lazy.stringValue({ produce: () => this.restApiId });

    return new CfnAuthorizer(this, 'Resource', {
      name: props.authorizerName ?? this.node.uniqueId,
      restApiId,
      type: 'REQUEST',
      authorizerUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`,
      authorizerCredentials: props.assumeRole?.roleArn,
      authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds() ?? 0,
      identitySource: props.identitySource?.join(','),
    });
  }
}
