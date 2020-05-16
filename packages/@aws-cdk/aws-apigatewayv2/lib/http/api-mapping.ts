// import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { IStage } from '../common';
import { IHttpApi } from './api';
import { IDomainName } from './domain-name';

/**
 *  interface of the HttpApiMapping resource
 */
export interface IHttpApiMapping extends IResource {
  /**
   * ID of the HttpApiMapping
   */
  readonly httpApiMappingId: string;
}

/**
 * Properties used to create the HttpApiMapping resource
 */
export interface HttpApiMappingProps {
  /**
   * Name for the API Mapping resource
   * @default - id of the HttpApiMapping construct.
   */
  readonly apiMappingName?: string;
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
 * Create a new API mapping for API Gateway HTTP API endpoint.
 * @resource AWS::ApiGatewayV2::ApiMapping
 */
export class HttpApiMapping extends Resource implements IHttpApiMapping {
  /**
   * import from API ID
   */
  public static fromApiId(scope: Construct, id: string, httpApiMappingId: string): IHttpApiMapping {
    class Import extends Resource implements IHttpApiMapping {
      public readonly httpApiMappingId = httpApiMappingId;
    }
    return new Import(scope, id);
  }
  /**
   * ID of the API Mapping
   */
  public readonly httpApiMappingId: string;
  /**
   * Name of the API Mapping
   */
  public readonly httpApiMappingName: string;

  constructor(scope: Construct, id: string, props: HttpApiMappingProps) {
    super(scope, id);

    this.httpApiMappingName = props.apiMappingName ?? id;

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.httpApiId,
      domainName: props.domainName.domainName,
      stage: props.stage.stageName,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);
    this.httpApiMappingId = resource.ref;
  }

}