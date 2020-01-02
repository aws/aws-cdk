import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Lazy, Stack } from '@aws-cdk/core';
import { CfnAuthorizer } from '../apigateway.generated';
import { Authorizer, IAuthorizer } from '../authorizer';
import { RestApi } from '../restapi';

/**
 * Properties for TokenAuthorizer
 */
export interface TokenAuthorizerProps {

  /**
   * An optional name for the authorizer. When provided, this will also be used for the physical id of the
   * CloudFormation resource of type `AWS::ApiGateway::Authorization`.
   *
   * @default - CDK will use the uniqueId assigned to this construct.
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
   * The request header mapping expression for the bearer token. This is typically passed as part of the header, in which case
   * this should be `method.request.header.Authorizer` where Authorizer is the header containing the bearer token.
   * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
   * @default 'method.request.header.Authorizer'
   */
  readonly identitySource?: string;

  /**
   * The TTL on how long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to 0.
   *
   *  @default - Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * An optional regex to be matched against the authorization token. When matched the authorizer lambda is invoked,
   * otherwise a 401 Unauthorized is returned to the client.
   *
   * @default - no regex filter will be applied.
   */
  readonly validationRegex?: string;

  /**
   * An optional IAM role for APIGateway to assume before calling the Lambda-based authorizer. The IAM role must be
   * assumable by 'apigateway.amazonaws.com'.
   *
   * @default - A resource policy is added to the Lambda function allowing apigateway.amazonaws.com to invoke the function.
   */
  readonly assumeRole?: iam.IRole;
}

/**
 * Token based lambda authorizer that recognizes the caller's identity as a bearer token,
 * such as a JSON Web Token (JWT) or an OAuth token.
 * Based on the token, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export class TokenAuthorizer extends Authorizer implements IAuthorizer {

  /**
   * The id of the authorizer.
   * @attribute
   */
  public readonly authorizerId: string;

  /**
   * The ARN of the authorizer to be used in permission policies, such as IAM and resource-based grants.
   */
  public readonly authorizerArn: string;

  private restApiId?: string;

  constructor(scope: Construct, id: string, props: TokenAuthorizerProps) {
    super(scope, id);

    if (props.resultsCacheTtl && props.resultsCacheTtl.toSeconds() > 3600) {
      throw new Error(`Lambda authorizer property 'cacheTtl' must not be greater than 3600 seconds (1 hour)`);
    }

    const restApiId = Lazy.stringValue({ produce: () => this.restApiId });

    const resource = new CfnAuthorizer(this, 'Resource', {
      name: props.authorizerName,
      restApiId,
      type: 'TOKEN',
      authorizerUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`,
      authorizerCredentials: props.assumeRole ? props.assumeRole.roleArn : undefined,
      authorizerResultTtlInSeconds: props.resultsCacheTtl && props.resultsCacheTtl.toSeconds(),
      identitySource: props.identitySource || 'method.request.header.Authorization',
      identityValidationExpression: props.validationRegex,
    });

    this.authorizerId = resource.ref;

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
   *
   * @internal
   */
  public _attachToApi(restApi: RestApi) {
    if (this.restApiId && this.restApiId !== restApi.restApiId) {
      throw new Error(`Cannot attach authorizer to two different rest APIs`);
    }

    this.restApiId = restApi.restApiId;
  }
}