import { Construct, Resource } from '@aws-cdk/core';
import { IHttpApi } from '../api';
import { CfnIntegration } from '../apigatewayv2.generated';
import { IIntegration } from '../integration';
import { HttpMethod } from '../route';

/**
 * HTTP Proxy integration properties
 */
export interface HttpProxyIntegrationOptions {
  /**
   * integration name
   * @default - the resource id
   */
  readonly integrationName?: string

  /**
   * The full-qualified HTTP URL for the HTTP integration
   */
  readonly targetUrl: string
  /**
   * Specifies the integration's HTTP method type.
   * @default - ANY
   */
  readonly integrationMethod?: HttpMethod
}

export interface HttpProxyIntegrationProps extends HttpProxyIntegrationOptions {
  /**
   * The API identifier
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
   */
  readonly api: IHttpApi;
}

/**
 * The HTTP Proxy integration resource for HTTP API
 *
 * @resource AWS::ApiGatewayV2::Integration
 */
export class HttpProxyIntegration extends Resource implements IIntegration {
  public readonly integrationId: string;

  constructor(scope: Construct, id: string, props: HttpProxyIntegrationProps) {
    super(scope, id);

    // create integration
    const integ = new CfnIntegration(this, 'Resource', {
      apiId: props.api.httpApiId,
      integrationType: 'HTTP_PROXY',
      integrationMethod: props.integrationMethod ?? HttpMethod.ANY,
      integrationUri: props.targetUrl,
      payloadFormatVersion: '1.0',
    });
    this.integrationId = integ.ref;
  }
}