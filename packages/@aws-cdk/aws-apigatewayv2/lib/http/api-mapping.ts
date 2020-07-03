import { Construct, Resource } from '@aws-cdk/core';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { IApiMapping, IDomainName } from '../common';
import { IHttpApi } from '../http/api';
import { IHttpStage } from './stage';

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
   * Api mapping key. The path where this stage should be mapped to on the domain
   * @default '/'
   */
  readonly apiMappingKey?: string;

  /**
   * The HttpApi to which this mapping is applied
   */
  readonly api: IHttpApi;

  /**
   * custom domain name of the mapping target
   */
  readonly domainName: IDomainName;

  /**
   * stage for the HttpApiMapping resource
   *
   * @default - the $default stage
   */
  readonly stage?: IHttpStage;
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
      stage: props.stage?.stageName ?? '$default',
      // if apiMappingKey is '/' we set it as undefined which maps to the root path of the domain
      apiMappingKey: props.apiMappingKey === '/' ? undefined : props.apiMappingKey,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);
    this.apiMappingId = resource.ref;
  }

}
