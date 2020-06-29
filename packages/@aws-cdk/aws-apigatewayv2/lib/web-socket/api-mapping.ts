import { Construct, Resource } from '@aws-cdk/core';

import { CfnApiMapping } from '../apigatewayv2.generated';
import { IApiMapping } from '../common/api-mapping';
import { IDomainName } from '../common/domain-name';
import { IStage } from '../common/stage';
import { IWebSocketApi } from './api';

/**
 * Defines the properties required for defining an Api Gateway V2 Api Mapping.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface WebSocketApiMappingOptions {
  /**
   * The API mapping key.
   *
   * @default - no API mapping key
   */
  readonly apiMappingKey?: string;

  /**
   * The associated domain name
   */
  readonly domainName: IDomainName;

  /**
   * The API stage.
   */
  readonly stage: IStage;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Api Mapping.
 */
export interface WebSocketApiMappingProps extends WebSocketApiMappingOptions {
  /**
   * Defines the api for this deployment.
   */
  readonly api: IWebSocketApi;
}

/**
 * An Api Mapping for an API. An API mapping relates a path of your custom domain name to a stage of your API.
 *
 * A custom domain name can have multiple API mappings, but the paths can't overlap.
 *
 * A custom domain can map only to APIs of the same protocol type.
 *
 * @resource AWS::ApiGatewayV2::ApiMapping
 */
export class WebSocketApiMapping extends Resource implements IApiMapping {

  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param apiMappingId Identifier of the API Mapping
   */
  public static fromApiMappingId(scope: Construct, id: string, apiMappingId: string): IApiMapping {
    class Import extends Resource implements IApiMapping {
      public readonly apiMappingId = apiMappingId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api Mapping.
   */
  public readonly apiMappingId: string;

  protected resource: CfnApiMapping;

  constructor(scope: Construct, id: string, props: WebSocketApiMappingProps) {
    super(scope, id);

    this.resource = new CfnApiMapping(this, 'Resource', {
      apiId: props.api.webSocketApiId,
      domainName: props.domainName.domainName,
      stage: props.stage.stageName,
      apiMappingKey: props.apiMappingKey,
    });
    this.apiMappingId = this.resource.ref;
  }
}