import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { IApiMapping, IDomainName } from '../common';
import { IHttpApi } from '../http/api';
import { IHttpStage } from './stage';

/**
 * Properties used to create the HttpApiMapping resource
 */
export interface HttpApiMappingProps {
  /**
   * Api mapping key. The path where this stage should be mapped to on the domain
   * @default - undefined for the root path mapping.
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
   * API Mapping key
   */
  public readonly mappingKey?: string;

  constructor(scope: Construct, id: string, props: HttpApiMappingProps) {
    super(scope, id);

    if ((!props.stage?.stageName) && !props.api.defaultStage) {
      throw new Error('stage is required if default stage is not available');
    }

    const paramRe = '^[a-zA-Z0-9]*[-_.+!,$]?[a-zA-Z0-9]*$';
    if (props.apiMappingKey && !new RegExp(paramRe).test(props.apiMappingKey)) {
      throw new Error('An ApiMapping key may contain only letters, numbers and one of $-_.+!*\'(),');
    }

    if (props.apiMappingKey === '') {
      throw new Error('empty string for api mapping key not allowed');
    }

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.httpApiId,
      domainName: props.domainName.name,
      stage: props.stage?.stageName ?? props.api.defaultStage!.stageName,
      apiMappingKey: props.apiMappingKey,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);

    // ensure the dependency on the provided stage
    if (props.stage) {
      this.node.addDependency(props.stage);
    }

    // if stage not specified, we ensure the default stage is ready before we create the api mapping
    if (!props.stage?.stageName && props.api.defaultStage) {
      this.node.addDependency(props.api.defaultStage!);
    }

    this.apiMappingId = resource.ref;
    this.mappingKey = props.apiMappingKey;
  }

}
