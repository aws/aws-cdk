import { Construct, IResource, Resource } from '@aws-cdk/core';

import { Api, IApi } from './api';
import { CfnIntegrationResponse } from './apigatewayv2.generated';
import { ContentHandlingStrategy, IIntegration, KnownTemplateKey } from './integration';

/**
 * Defines a set of common response patterns known to the system
 */
export enum KnownIntegrationResponseKey {
  /**
   * Default response, when no other pattern matches
   */
  DEFAULT = "$default",

  /**
   * Empty response
   */
  EMPTY = "empty",

  /**
   * Error response
   */
  ERROR = "error"
}

/**
 * Defines the contract for an Api Gateway V2 Deployment.
 */
export interface IIntegrationResponse extends IResource {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface IntegrationResponseOptions {
  /**
   * Specifies how to handle response payload content type conversions.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - Pass through unmodified
   */
  readonly contentHandlingStrategy?: ContentHandlingStrategy | string;

  /**
   * A key-value map specifying response parameters that are passed to the method response from the backend.
   *
   * The key is a method response header parameter name and the mapped value is an integration response header value,
   * a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body.
   *
   * The mapping key must match the pattern of `method.response.header.{name}`, where name is a valid and unique header name.
   *
   * The mapped non-static value must match the pattern of `integration.response.header.{name}` or `integration.response.body.{JSON-expression}`,
   * where `{name}` is a valid and unique response header name and `{JSON-expression}` is a valid JSON expression without the `$` prefix
   *
   * @default - no parameter used
   */
  readonly responseParameters?: { [key: string]: string };

  /**
   * The collection of response templates for the integration response as a string-to-string map of key-value pairs.
   *
   * Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
   *
   * @default - no templates used
   */
  readonly responseTemplates?: { [key: string]: string };

  /**
   * The template selection expression for the integration response.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no template selected
   */
  readonly templateSelectionExpression?: KnownTemplateKey | string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 */
export interface IntegrationResponseProps extends IntegrationResponseOptions {
  /**
   * Defines the api for this response.
   */
  readonly api: IApi;

  /**
   * Defines the parent integration for this response.
   */
  readonly integration: IIntegration;

  /**
   * The integration response key.
   */
  readonly key: KnownIntegrationResponseKey | string;
}

/**
 * A response for an integration for an API in Amazon API Gateway v2.
 */
export class IntegrationResponse extends Resource implements IIntegrationResponse {
  protected resource: CfnIntegrationResponse;

  constructor(scope: Construct, id: string, props: IntegrationResponseProps) {
    super(scope, id);

    this.resource = new CfnIntegrationResponse(this, 'Resource', {
      ...props,
      apiId: props.api.apiId,
      integrationId: props.integration.integrationId,
      integrationResponseKey: props.key
    });

    if (props.api instanceof Api) {
      if (props.api.latestDeployment) {
        props.api.latestDeployment.addToLogicalId({
          ...props,
          api: props.api.apiId,
          integration: props.integration.integrationId,
          id,
          integrationResponseKey: props.key
        });
        props.api.latestDeployment.registerDependency(this.resource);
      }
    }
  }
}