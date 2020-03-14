import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

/**
 * The integration interface
 */
export interface IIntegration extends cdk.IResource {
/**
 * The resource ID of the integration
 *
 * @attribute
 */
  readonly integrationId: string
}

/**
 * Integration typ
 *
 */
export enum IntegrationType {
  /**
   * for integrating the route or method request with an AWS service action, includingthe Lambda function-invoking action.
   * With the Lambda function-invoking action, this is referred to as the Lambda custom integration. With any other AWS service
   * action, this is known as AWS integration. Supported only for WebSocket APIs.
   */
  AWS = 'AWS',
  /**
   * for integrating the route or method request with the Lambda function-invoking action with the client request passed through as-is.
   * This integration is also referred to as Lambda proxy integration.
   */
  AWS_PROXY = 'AWS_PROXY',
  /**
   * for integrating the route or method request with an HTTP endpoint. This integration is also referred to as the HTTP custom integration.
   * Supported only for WebSocket APIs.
   */
  HTTP = 'HTTP',
  /**
   * for integrating the route or method request with an HTTP endpoint, with the client request passed through as-is.
   * This is also referred to as HTTP proxy integration. For HTTP API private integrations, use an `HTTP_PROXY` integration.
   */
  HTTP_PROXY = 'HTTP_PROXY',
  /**
   * for integrating the route or method request with API Gateway as a "loopback" endpoint without invoking any backend.
   * Supported only for WebSocket APIs.
   */
  MOCK = 'MOCK'
}

/**
 * the integration properties
 */
export interface IntegrationProps extends cdk.StackProps {
  /**
   * integration name
   * @default - the resource ID of the integration
   */
  readonly integrationName?: string;
  /**
   * API ID
   */
  readonly apiId: string;
  /**
   * integration type
   */
  readonly integrationType: IntegrationType
  /**
   * integration URI
   */
  readonly integrationUri: string
  /**
   * integration method
   */
  readonly integrationMethod: apigatewayv2.HttpMethod
}

/**
 * Lambda Proxy integration properties
 */
export interface LambdaProxyIntegrationProps extends cdk.StackProps {
  /**
   * integration name
   * @default - the resource id
   */
  readonly integrationName?: string;
  /**
   * The API identifier
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  readonly api: apigatewayv2.IHttpApi;
  /**
   * The Lambda function for this integration.
   */
  readonly targetHandler: lambda.IFunction
}

/**
 * HTTP Proxy integration properties
 */
export interface HttpProxyIntegrationProps extends cdk.StackProps {
  /**
   * integration name
   * @default - the resource id
   */
  readonly integrationName?: string
  /**
   * The API identifier
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  readonly api: apigatewayv2.IHttpApi;
  /**
   * The full-qualified HTTP URL for the HTTP integration
   */
  readonly targetUrl: string
  /**
   * Specifies the integration's HTTP method type.
   * @default - ANY
   */
  readonly integrationMethod?: apigatewayv2.HttpMethod
}

/**
 * The integration resource for HTTP API
 */
export class Integration extends cdk.Resource implements IIntegration {
  /**
   * import from integration ID
   */
  public static fromIntegrationId(scope: cdk.Construct, id: string, integrationId: string): IIntegration {
    class Import extends cdk.Resource implements IIntegration {
      public readonly integrationId = integrationId;
    }

    return new Import(scope, id);
  }
  public readonly integrationId: string;
  constructor(scope: cdk.Construct, id: string, props: IntegrationProps) {
    super(scope, id);
    const integ = new apigatewayv2.CfnIntegration(this, 'Resource', {
      apiId: props.apiId,
      integrationType: props.integrationType,
      integrationMethod: props.integrationMethod,
      integrationUri: props.integrationUri,
      payloadFormatVersion: '1.0'
    });
    this.integrationId = integ.ref;
  }
}

/**
 * The Lambda Proxy integration resource for HTTP API
 * @resource AWS::ApiGatewayV2::Integration
 */
export class LambdaProxyIntegration extends cdk.Resource  implements IIntegration {
  public readonly integrationId: string;
  constructor(scope: cdk.Construct, id: string, props: LambdaProxyIntegrationProps) {
    super(scope, id);

    const partition = this.isChina() ? 'aws-cn' : 'aws';
    const region = this.stack.region;
    const account = this.stack.account;

    // create integration
    const integ = new apigatewayv2.CfnIntegration(this, 'Resource', {
      apiId: props.api.httpApiId,
      integrationType: apigatewayv2.IntegrationType.AWS_PROXY,
      integrationMethod: apigatewayv2.HttpMethod.POST,
      payloadFormatVersion: '1.0',
      integrationUri: `arn:${partition}:apigateway:${region}:lambda:path/2015-03-31/functions/${props.targetHandler.functionArn}/invocations`,
    });
    this.integrationId = integ.ref;
    // create permission
    new lambda.CfnPermission(scope, `Permission-${id}`, {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: props.targetHandler.functionName,
      sourceArn: `arn:${partition}:execute-api:${region}:${account}:${props.api.httpApiId}/*/*`,
    });
  }
  private isChina(): boolean {
    const region = this.stack.region;
    return !cdk.Token.isUnresolved(region) && region.startsWith('cn-');
  }
}

/**
 * The HTTP Proxy integration resource for HTTP API
 *
 * @resource AWS::ApiGatewayV2::Integration
 */
export class HttpProxyIntegration extends cdk.Resource implements IIntegration {
  public readonly integrationId: string;

  constructor(scope: cdk.Construct, id: string, props: HttpProxyIntegrationProps) {
    super(scope, id);

    // create integration
    const integ = new apigatewayv2.CfnIntegration(this, 'Resource', {
      apiId: props.api.httpApiId,
      integrationType: apigatewayv2.IntegrationType.HTTP_PROXY,
      integrationMethod: props.integrationMethod ?? apigatewayv2.HttpMethod.ANY,
      integrationUri: props.targetUrl,
      payloadFormatVersion: '1.0'
    });
    this.integrationId = integ.ref;
  }
}