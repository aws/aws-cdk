import { Construct, Resource } from '@aws-cdk/core';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { IApiMapping, IDomainName, IStage } from '../common';
import { IHttpApi } from '../http/api';

/**
 * Properties used to create the HttpApiMapping resource
 */
export interface HttpApiMappingProps {
  /**
   * Api mapping name
   * @default -  logical id
   */
  readonly apiMappingName?: string;

  /**
   * Api mapping key
   * @default -  empty api mapping key
   */
  readonly apiMappingKey?: string;

  /**
   * API for the HttpApiMapping resource
   */
  readonly api: IHttpApi;

  /**
   * custom domain nam efor the HttpApiMapping resource
   */
  readonly domainName: IDomainName;

  /**
   * stage for the HttpApiMapping resource
   */
  readonly stage: IStage;
}

/**
 * The attributes used to import existing HttpApiMapping
 */
export interface HttpApiMappingAttributes {
  /**
   * The API mapping ID
   */
  readonly apiMappingId: string;
}

/**
 * Create a new API mapping for API Gateway HTTP API endpoint.
 * @resource AWS::ApiGatewayV2::ApiMapping
 */
export class HttpApiMapping extends Resource implements IApiMapping {
  /**
   * import from API ID
   */
  public static fromHttpApiMappingAttributes(scope: Construct, id: string, attrs: HttpApiMappingAttributes): IApiMapping {
    class Import extends Resource implements IApiMapping {
      public readonly apiMappingId = attrs.apiMappingId;
    }
    return new Import(scope, id);
  }
  /**
   * ID of the API Mapping
   */
  public readonly apiMappingId: string;

  /**
   * Name of the API Mapping
   * @attribute
   */
  public readonly apiMappingName: string;

  constructor(scope: Construct, id: string, props: HttpApiMappingProps) {
    super(scope, id);

    this.apiMappingName = props.apiMappingName ?? id;

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.httpApiId,
      domainName: props.domainName.domainName,
      stage: props.stage.stageName,
      apiMappingKey: props.apiMappingKey,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);
    this.apiMappingId = resource.ref;
  }

}
