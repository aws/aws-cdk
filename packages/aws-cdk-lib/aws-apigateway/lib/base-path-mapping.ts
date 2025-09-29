import { Construct } from 'constructs';
import { CfnBasePathMapping, IDomainNameRef, IRestApiRef } from './apigateway.generated';
import { RestApiBase } from './restapi';
import { Stage } from './stage';
import { Resource, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

export interface BasePathMappingOptions {
  /**
   * The base path name that callers of the API must provide in the URL after
   * the domain name (e.g. `example.com/base-path`). If you specify this
   * property, it can't be an empty string.
   *
   * @default - map requests from the domain root (e.g. `example.com`). If this
   * is undefined, no additional mappings will be allowed on this domain name.
   */
  readonly basePath?: string;

  /**
   * The Deployment stage of API
   * [disable-awslint:ref-via-interface]
   * @default - map to deploymentStage of restApi otherwise stage needs to pass in URL
   */
  readonly stage?: Stage;

  /**
   * Whether to attach the base path mapping to a stage.
   * Use this property to create a base path mapping without attaching it to the Rest API default stage.
   * This property is ignored if `stage` is provided.
   * @default - true
   */
  readonly attachToStage?: boolean;
}

export interface BasePathMappingProps extends BasePathMappingOptions {
  /**
   * The DomainName to associate with this base path mapping.
   */
  readonly domainName: IDomainNameRef;

  /**
   * The RestApi resource to target.
   */
  readonly restApi: IRestApiRef;
}

/**
 * This resource creates a base path that clients who call your API must use in
 * the invocation URL.
 *
 * Unless you're importing a domain with `DomainName.fromDomainNameAttributes()`,
 * you can use `DomainName.addBasePathMapping()` to define mappings.
 */
@propertyInjectable
export class BasePathMapping extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigateway.BasePathMapping';

  constructor(scope: Construct, id: string, props: BasePathMappingProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.basePath && !Token.isUnresolved(props.basePath)) {
      if (props.basePath.startsWith('/') || props.basePath.endsWith('/')) {
        throw new ValidationError(`A base path cannot start or end with /", received: ${props.basePath}`, scope);
      }
      if (props.basePath.match(/\/{2,}/)) {
        throw new ValidationError(`A base path cannot have more than one consecutive /", received: ${props.basePath}`, scope);
      }
      if (!props.basePath.match(/^[a-zA-Z0-9$_.+!*'()-/]+$/)) {
        throw new ValidationError(`A base path may only contain letters, numbers, and one of "$-_.+!*'()/", received: ${props.basePath}`, scope);
      }
    }

    const attachToStage = props.attachToStage ?? true;

    // if restApi is an owned API and it has a deployment stage, map all requests
    // to that stage. otherwise, the stage will have to be specified in the URL.
    // if props.attachToStage is false, then do not attach to the stage.
    const stage = props.stage ?? (props.restApi instanceof RestApiBase && attachToStage
      ? props.restApi.deploymentStage
      : undefined);

    new CfnBasePathMapping(this, 'Resource', {
      basePath: props.basePath,
      domainName: props.domainName.domainNameRef.domainName,
      restApiId: props.restApi.restApiRef.restApiId,
      stage: stage?.stageName,
    });
  }
}
