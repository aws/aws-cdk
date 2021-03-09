import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApiMapping, CfnApiMappingProps } from '../apigatewayv2.generated';
import { HttpApi } from '../http/api';
import { IApi } from './api';
import { IDomainName } from './domain-name';
import { IStage } from './stage';

/**
 * Represents an ApiGatewayV2 ApiMapping resource
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 */
export interface IApiMapping extends IResource {
  /**
   * ID of the api mapping
   * @attribute
   */
  readonly apiMappingId: string;
}

/**
 * Properties used to create the ApiMapping resource
 */
export interface ApiMappingProps {
  /**
   * Api mapping key. The path where this stage should be mapped to on the domain
   * @default - undefined for the root path mapping.
   */
  readonly apiMappingKey?: string;

  /**
   * The Api to which this mapping is applied
   */
  readonly api: IApi;

  /**
   * custom domain name of the mapping target
   */
  readonly domainName: IDomainName;

  /**
   * stage for the ApiMapping resource
   * required for WebSocket API
   * defaults to default stage of an HTTP API
   *
   * @default - Default stage of the passed API for HTTP API, required for WebSocket API
   */
  readonly stage?: IStage;
}

/**
 * The attributes used to import existing ApiMapping
 */
export interface ApiMappingAttributes {
  /**
   * The API mapping ID
   */
  readonly apiMappingId: string;
}

/**
 * Create a new API mapping for API Gateway API endpoint.
 * @resource AWS::ApiGatewayV2::ApiMapping
 */
export class ApiMapping extends Resource implements IApiMapping {
  /**
   * import from API ID
   */
  public static fromApiMappingAttributes(scope: Construct, id: string, attrs: ApiMappingAttributes): IApiMapping {
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

  constructor(scope: Construct, id: string, props: ApiMappingProps) {
    super(scope, id);

    let stage = props.stage;
    if (!stage) {
      if (props.api instanceof HttpApi) {
        if (props.api.defaultStage) {
          stage = props.api.defaultStage;
        } else {
          throw new Error('stage is required if default stage is not available');
        }
      } else {
        throw new Error('stage is required for WebSocket API');
      }
    }

    const paramRe = '^[a-zA-Z0-9]*[-_.+!,$]?[a-zA-Z0-9]*$';
    if (props.apiMappingKey && !new RegExp(paramRe).test(props.apiMappingKey)) {
      throw new Error('An ApiMapping key may contain only letters, numbers and one of $-_.+!*\'(),');
    }

    if (props.apiMappingKey === '') {
      throw new Error('empty string for api mapping key not allowed');
    }

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.apiId,
      domainName: props.domainName.name,
      stage: stage.stageName,
      apiMappingKey: props.apiMappingKey,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);

    // ensure the dependency on the provided stage
    this.node.addDependency(stage);

    this.apiMappingId = resource.ref;
    this.mappingKey = props.apiMappingKey;
  }
}
