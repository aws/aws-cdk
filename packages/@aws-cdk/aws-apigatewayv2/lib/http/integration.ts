import { Construct, Resource } from '@aws-cdk/core';
import { CfnIntegration } from '../apigatewayv2.generated';
import { IIntegration } from '../common';
import { IHttpApi } from './api';
import { HttpMethod, IHttpRoute } from './route';

/**
 * Represents an Integration for an HTTP API.
 */
export interface IHttpIntegration extends IIntegration {
  /** The HTTP API associated with this integration */
  readonly httpApi: IHttpApi;
}

/**
 * Supported integration types
 */
export enum HttpIntegrationType {
  /**
   * Integration type is a Lambda proxy
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   */
  LAMBDA_PROXY = 'AWS_PROXY',
  /**
   * Integration type is an HTTP proxy
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   */
  HTTP_PROXY = 'HTTP_PROXY',
}

/**
 * Payload format version for lambda proxy integration
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export class PayloadFormatVersion {
  /** Version 1.0 */
  public static readonly VERSION_1_0 = new PayloadFormatVersion('1.0');
  /** Version 2.0 */
  public static readonly VERSION_2_0 = new PayloadFormatVersion('2.0');

  /**
   * A custom payload version.
   * Typically used if there is a version number that the CDK doesn't support yet
   */
  public static custom(version: string) {
    return new PayloadFormatVersion(version);
  }

  /** version as a string */
  public readonly version: string;

  private constructor(version: string) {
    this.version = version;
  }
}

/**
 * The integration properties
 */
export interface HttpIntegrationProps {
  /**
   * The HTTP API to which this integration should be bound.
   */
  readonly httpApi: IHttpApi;

  /**
   * Integration type
   */
  readonly integrationType: HttpIntegrationType;

  /**
   * Integration URI.
   * This will be the function ARN in the case of `HttpIntegrationType.LAMBDA_PROXY`,
   * or HTTP URL in the case of `HttpIntegrationType.HTTP_PROXY`.
   */
  readonly integrationUri: string;

  /**
   * The HTTP method to use when calling the underlying HTTP proxy
   * @default - none. required if the integration type is `HttpIntegrationType.HTTP_PROXY`.
   */
  readonly method?: HttpMethod;

  /**
   * The version of the payload format
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default - defaults to latest in the case of HttpIntegrationType.LAMBDA_PROXY`, irrelevant otherwise.
   */
  readonly payloadFormatVersion?: PayloadFormatVersion;
}

/**
 * The integration for an API route.
 * @resource AWS::ApiGatewayV2::Integration
 */
export class HttpIntegration extends Resource implements IHttpIntegration {
  public readonly integrationId: string;

  public readonly httpApi: IHttpApi;

  constructor(scope: Construct, id: string, props: HttpIntegrationProps) {
    super(scope, id);
    const integ = new CfnIntegration(this, 'Resource', {
      apiId: props.httpApi.httpApiId,
      integrationType: props.integrationType,
      integrationUri: props.integrationUri,
      integrationMethod: props.method,
      payloadFormatVersion: props.payloadFormatVersion?.version,
    });
    this.integrationId = integ.ref;
    this.httpApi = props.httpApi;
  }
}

/**
 * The interface that various route integration classes will inherit.
 */
export interface IHttpRouteIntegration {
  /**
   * Bind this integration to the route.
   */
  bind(route: IHttpRoute): HttpRouteIntegrationConfig;
}

/**
 * Config returned back as a result of the bind.
 */
export interface HttpRouteIntegrationConfig {
  /**
   * Integration type.
   */
  readonly type: HttpIntegrationType;

  /**
   * Integration URI
   */
  readonly uri: string;

  /**
   * The HTTP method that must be used to invoke the underlying proxy.
   * Required for `HttpIntegrationType.HTTP_PROXY`
   * @default - undefined
   */
  readonly method?: HttpMethod;

  /**
   * Payload format version in the case of lambda proxy integration
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default - undefined
   */
  readonly payloadFormatVersion: PayloadFormatVersion;
}