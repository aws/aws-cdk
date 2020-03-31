import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Construct, Stack } from '@aws-cdk/core';

import { Api, IApi } from '../api';
import { Integration, IntegrationOptions, IntegrationType } from '../integration';
import { IRoute } from '../route';

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface LambdaIntegrationOptions extends IntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;

  /**
   * The Lambda function handler for this integration
   */
  readonly handler: IFunction;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 */
export interface LambdaIntegrationProps extends LambdaIntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IApi;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class LambdaIntegration extends Integration {
  protected handler: IFunction;

  constructor(scope: Construct, id: string, props: LambdaIntegrationProps) {
    const stack = Stack.of(scope);

    // This is not a standard ARN as it does not have the account-id part in it
    const uri = `arn:${stack.partition}:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`;
    super(scope, id, {
      ...props,
      type: props.proxy ? IntegrationType.AWS_PROXY : IntegrationType.AWS,
      uri
    });
    this.handler = props.handler;
  }

  public addPermissionsForRoute(route: IRoute) {
    if (this.api instanceof Api) {
      const sourceArn = this.api.executeApiArn(route);
      this.handler.addPermission(`ApiPermission.${route.node.uniqueId}`, {
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn
      });
    } else {
      throw new Error("This function is only supported on non-imported APIs");
    }
  }
}
