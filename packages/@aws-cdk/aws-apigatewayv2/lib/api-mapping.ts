import { Construct, IResource, Resource } from '@aws-cdk/core';

import { IApi } from './api';
import { CfnApiMapping } from './apigatewayv2.generated';
import { IDomainName } from './domain-name';
import { IStage } from './stage';

/**
 * Defines the contract for an Api Gateway V2 Api Mapping.
 */
export interface IApiMapping extends IResource {
  /**
   * The ID of this API Gateway Api Mapping.
   * @attribute
   */
  readonly apiMappingId: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Api Mapping.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface ApiMappingOptions {
  /**
   * The API mapping key.
   *
   * @default - no API mapping key
   */
  readonly apiMappingKey?: string;

  /**
   * The associated domain name
   */
  readonly domainName: IDomainName | string;

  /**
   * The API stage.
   */
  readonly stage: IStage;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Api Mapping.
 */
export interface ApiMappingProps extends ApiMappingOptions {
  /**
   * Defines the api for this deployment.
   */
  readonly api: IApi;
}

/**
 * An Api Mapping for an API. An API mapping relates a path of your custom domain name to a stage of your API.
 *
 * A custom domain name can have multiple API mappings, but the paths can't overlap.
 *
 * A custom domain can map only to APIs of the same protocol type.
 */
export class ApiMapping extends Resource implements IApiMapping {

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

  constructor(scope: Construct, id: string, props: ApiMappingProps) {
    super(scope, id);

    this.resource = new CfnApiMapping(this, 'Resource', {
      ...props,
      apiId: props.api.apiId,
      domainName: ((typeof(props.domainName) === "string") ? props.domainName : props.domainName.domainName),
      stage: props.stage.stageName
    });
    this.apiMappingId = this.resource.ref;
  }
}