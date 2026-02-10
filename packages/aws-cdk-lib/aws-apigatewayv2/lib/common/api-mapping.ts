import type { Construct } from 'constructs';
import type { IDomainName } from './domain-name';
import type { IStage } from './stage';
import type { CfnApiMappingProps } from '.././index';
import { CfnApiMapping } from '.././index';
import type { IResource } from '../../../core';
import { Resource } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { ApiMappingReference, IApiMappingRef, IApiRef, IDomainNameRef } from '../../../interfaces/generated/aws-apigatewayv2-interfaces.generated';

/**
 * Represents an ApiGatewayV2 ApiMapping resource
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 */
export interface IApiMapping extends IResource, IApiMappingRef {
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
  readonly api: IApiRef;

  /**
   * custom domain name of the mapping target
   */
  readonly domainName: IDomainNameRef;

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

  /**
   * Domain name
   *
   * @default - Certain operations on the referenced object may fail if not supplied
   */
  readonly domainName?: string;
}

/**
 * Create a new API mapping for API Gateway API endpoint.
 * @resource AWS::ApiGatewayV2::ApiMapping
 */
@propertyInjectable
export class ApiMapping extends Resource implements IApiMapping {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigatewayv2.ApiMapping';

  /**
   * import from API ID
   */
  public static fromApiMappingAttributes(scope: Construct, id: string, attrs: ApiMappingAttributes): IApiMapping {
    class Import extends Resource implements IApiMapping {
      public readonly apiMappingId = attrs.apiMappingId;
      public get apiMappingRef(): ApiMappingReference {
        const self = this;
        return {
          apiMappingId: this.apiMappingId,
          get domainName() {
            if (!attrs.domainName) {
              throw new ValidationError('Cannot use object in this API: \'domainName\' was not supplied when calling ApiMapping.fromApiMappingAttributes()', self);
            }
            return attrs.domainName;
          },
        };
      }
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

  /**
   * API domain name
   */
  private readonly _domainName: IDomainNameRef;

  constructor(scope: Construct, id: string, props: ApiMappingProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // defaultStage is present in IHttpStage.
    // However, importing "http" or "websocket" must import "common", but creating dependencies
    // the other way will cause potential cycles.
    // So casting to 'any'
    let stage = props.stage ?? (props.api as any).defaultStage;
    if (!stage) {
      throw new ValidationError('stage property must be specified', scope);
    }

    if (props.apiMappingKey === '') {
      throw new ValidationError('empty string for api mapping key not allowed', scope);
    }

    const apiMappingProps: CfnApiMappingProps = {
      apiId: props.api.apiRef.apiId,
      domainName: props.domainName.domainNameRef.domainName,
      stage: stage.stageName,
      apiMappingKey: props.apiMappingKey,
    };

    const resource = new CfnApiMapping(this, 'Resource', apiMappingProps);

    // ensure the dependency on the provided stage
    this.node.addDependency(stage);

    this.apiMappingId = resource.ref;
    this.mappingKey = props.apiMappingKey;
    this._domainName = props.domainName;
  }

  /**
   * API domain name
   */
  public get domainName(): IDomainName {
    const ret = this._domainName as IDomainName;
    if ('regionalDomainName' in ret && 'regionalHostedZoneId' in ret) {
      return ret;
    }
    throw new ValidationError(`Supplied domainName (${this._domainName.constructor.name}) does not implement IDomainName`, this);
  }

  public get apiMappingRef(): ApiMappingReference {
    const self = this;
    return {
      apiMappingId: this.apiMappingId,
      get domainName(): string {
        return self._domainName.domainNameRef.domainName;
      },
    };
  }

  /**
   * Return the domain for this API Mapping
   */
  public get domainUrl() {
    return `https://${this._domainName.domainNameRef.domainName}/${this.mappingKey ?? ''}`;
  }
}
