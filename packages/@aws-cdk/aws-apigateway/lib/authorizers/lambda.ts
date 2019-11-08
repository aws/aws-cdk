import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, Lazy, Stack } from '@aws-cdk/core';
import { CfnAuthorizer } from '../../lib/apigateway.generated';
import { CustomAuthorizer } from '../../lib/authorizer';

/**
 * Properties for TokenAuthorizer
 */
export interface TokenAuthorizerProps {

  /**
   * An optional name for the authorizer. When provided, this will also be used for the physical id of the
   * CloudFormation resource of type `AWS::ApiGateway::Authorizer`.
   *
   * @default - CDK will use the uniqueId assigned to this construct.
   */
  readonly name?: string;

  /**
   * The authorizer lambda function.
   */
  readonly function: lambda.IFunction;

  /**
   * The name of the header in the request that contains the authorization token as submitted by the client.
   */
  readonly headerName: string;

  /**
   * The TTL on how long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to 0.
   *
   *  @default - 300 seconds
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
   * An optional IAM role for APIGateway to assume before calling the Lambda-based authorizer.
   *
   * @default - A resource policy is added to the Lambda function allowing apigateway.amazonaws.com to invoke the function.
   */
  readonly assumeRole?: iam.IRole;
}

/**
 * Token based lambda authorizer that recognizes the caller's identity caller's identity as a bearer token,
 * such as a JSON Web Token (JWT) or an OAuth token.
 * Based on the token, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export class TokenAuthorizer extends CustomAuthorizer {

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

  constructor(scope: Construct, id: string, props: TokenAuthorizerProps) {
    super(scope, id, {
      physicalName: props.name || Lazy.stringValue({ produce: () => this.node.uniqueId })
    });

    if (props.resultsCacheTtl && props.resultsCacheTtl.toSeconds() > 3600) {
      throw new Error(`Lambda authorizer property 'cacheTtl' must not be greater than 3600 seconds`);
    }

    const resource = new CfnAuthorizer(this, 'Resource', {
      name: this.physicalName,
      restApiId: this.restApiId,
      type: 'TOKEN',
      authorizerUri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${props.function.functionArn}/invocations`,
      authorizerCredentials: props.assumeRole ? props.assumeRole.roleArn : undefined,
      authorizerResultTtlInSeconds: props.resultsCacheTtl && props.resultsCacheTtl.toSeconds(),
      identitySource: `method.request.header.${props.headerName}`,
      identityValidationExpression: props.validationRegex,
    });

    this.authorizerId = resource.ref;

    this.authorizerArn = Stack.of(this).formatArn({
      service: 'execute-api',
      resource: this.restApiId,
      resourceName: `authorizers/${this.authorizerId}`
    });

    if (!props.assumeRole) {
      new lambda.CfnPermission(this, `${this.node.uniqueId}:Permissions`, {
        functionName: props.function.functionArn,
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        sourceArn: this.authorizerArn
      });
    }
  }
}