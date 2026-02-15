import type { Construct } from 'constructs';
import type { DomainNameReference, IDomainNameRef, IRestApiRef, IStageRef } from './apigateway.generated';
import { CfnDomainName } from './apigateway.generated';
import type { BasePathMappingOptions } from './base-path-mapping';
import { BasePathMapping } from './base-path-mapping';
import type { IRestApi } from './restapi';
import { EndpointType } from './restapi';
import type { AddRoutingRuleOptions } from './routing-rule';
import { RoutingRule } from './routing-rule';
import * as apigwv2 from '../../aws-apigatewayv2';
import type { IBucket } from '../../aws-s3';
import type { IResource } from '../../core';
import { Arn, Names, Resource, Stack, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ICertificateRef } from '../../interfaces/generated/aws-certificatemanager-interfaces.generated';

/**
 * Options for creating an api mapping
 */
export interface ApiMappingOptions {
  /**
   * The api path name that callers of the API must provide in the URL after
   * the domain name (e.g. `example.com/base-path`). If you specify this
   * property, it can't be an empty string.
   *
   * If this is undefined, a mapping will be added for the empty path. Any request
   * that does not match a mapping will get sent to the API that has been mapped
   * to the empty path.
   *
   * @default - map requests from the domain root (e.g. `example.com`).
   */
  readonly basePath?: string;
}

/**
 * The minimum version of the SSL protocol that you want API Gateway to use for HTTPS connections.
 */
export enum SecurityPolicy {
  /** Cipher suite TLS 1.0 */
  TLS_1_0 = 'TLS_1_0',

  /** Cipher suite TLS 1.2 */
  TLS_1_2 = 'TLS_1_2',
}

/**
 * Routing mode for a custom domain name.
 * Determines how API Gateway routes traffic from the domain to your APIs.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-routing-rules.html
 */
export enum RoutingMode {
  /**
   * Only base path mappings and API mappings are used. Routing rules are ignored.
   * This is the default.
   */
  BASE_PATH_MAPPING_ONLY = 'BASE_PATH_MAPPING_ONLY',

  /**
   * Only routing rules are evaluated. Base path mappings and API mappings are ignored.
   * Use addRoutingRule() to define rules. Requires REGIONAL endpoint.
   */
  ROUTING_RULE_ONLY = 'ROUTING_RULE_ONLY',

  /**
   * Routing rules are evaluated first; if no rule matches, API mappings are used.
   */
  ROUTING_RULE_THEN_API_MAPPING = 'ROUTING_RULE_THEN_API_MAPPING',
}

export interface DomainNameOptions {
  /**
   * The custom domain name for your API. Uppercase letters are not supported.
   */
  readonly domainName: string;

  /**
   * The reference to an AWS-managed certificate for use by the edge-optimized
   * endpoint for the domain name. For "EDGE" domain names, the certificate
   * needs to be in the US East (N. Virginia) region.
   */
  readonly certificate: ICertificateRef;

  /**
   * The type of endpoint for this DomainName.
   * @default REGIONAL
   */
  readonly endpointType?: EndpointType;

  /**
   * The Transport Layer Security (TLS) version + cipher suite for this domain name.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html
   * @default SecurityPolicy.TLS_1_2
   */
  readonly securityPolicy?: SecurityPolicy;

  /**
   * The mutual TLS authentication configuration for a custom domain name.
   * @default - mTLS is not configured.
   */
  readonly mtls?: MTLSConfig;

  /**
   * The base path name that callers of the API must provide in the URL after
   * the domain name (e.g. `example.com/base-path`). If you specify this
   * property, it can't be an empty string.
   *
   * @default - map requests from the domain root (e.g. `example.com`).
   */
  readonly basePath?: string;

  /**
   * Routing mode for this domain. When set to ROUTING_RULE_ONLY or
   * ROUTING_RULE_THEN_API_MAPPING, you can use addRoutingRule() to route by path/header.
   * Routing rules are only supported for REGIONAL endpoints.
   *
   * @default RoutingMode.BASE_PATH_MAPPING_ONLY
   */
  readonly routingMode?: RoutingMode;
}

export interface DomainNameProps extends DomainNameOptions {
  /**
   * If specified, all requests to this domain will be mapped to the production
   * deployment of this API. If you wish to map this domain to multiple APIs
   * with different base paths, use `addBasePathMapping` or `addApiMapping`.
   *
   * @default - you will have to call `addBasePathMapping` to map this domain to
   * API endpoints.
   */
  readonly mapping?: IRestApi;
}

export interface IDomainName extends IResource, IDomainNameRef {
  /**
   * The domain name (e.g. `example.com`)
   *
   * @attribute DomainName
   */
  readonly domainName: string;

  /**
   * The Route53 alias target to use in order to connect a record set to this domain through an alias.
   *
   * @attribute DistributionDomainName,RegionalDomainName
   */
  readonly domainNameAliasDomainName: string;

  /**
   * The Route53 hosted zone ID to use in order to connect a record set to this domain through an alias.
   *
   * @attribute DistributionHostedZoneId,RegionalHostedZoneId
   */
  readonly domainNameAliasHostedZoneId: string;
}

@propertyInjectable
export class DomainName extends Resource implements IDomainName {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigateway.DomainName';

  /**
   * Imports an existing domain name.
   */
  public static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName {
    class Import extends Resource implements IDomainName {
      public readonly domainName = attrs.domainName;
      public readonly domainNameAliasDomainName = attrs.domainNameAliasTarget;
      public readonly domainNameAliasHostedZoneId = attrs.domainNameAliasHostedZoneId;

      public readonly domainNameRef = {
        domainName: this.domainName,
        domainNameArn: Arn.format({
          service: 'apigateway',
          resource: 'domainnames',
          resourceName: attrs.domainName,
        }, Stack.of(scope)),
      };
    }

    return new Import(scope, id);
  }

  public readonly domainName: string;
  public readonly domainNameRef: DomainNameReference;
  public readonly domainNameAliasDomainName: string;
  public readonly domainNameAliasHostedZoneId: string;
  private readonly basePaths = new Set<string | undefined>();
  private readonly securityPolicy?: SecurityPolicy;
  private readonly endpointType: EndpointType;
  private readonly routingMode: RoutingMode;

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.endpointType = props.endpointType || EndpointType.REGIONAL;
    this.routingMode = props.routingMode ?? RoutingMode.BASE_PATH_MAPPING_ONLY;
    const edge = this.endpointType === EndpointType.EDGE;
    this.securityPolicy = props.securityPolicy;

    if (this.routingMode !== RoutingMode.BASE_PATH_MAPPING_ONLY && this.endpointType !== EndpointType.REGIONAL) {
      throw new ValidationError('Routing rules are only supported for REGIONAL endpoint type', scope);
    }

    if (!Token.isUnresolved(props.domainName) && /[A-Z]/.test(props.domainName)) {
      throw new ValidationError(`Domain name does not support uppercase letters. Got: ${props.domainName}`, scope);
    }

    const mtlsConfig = this.configureMTLS(props.mtls);
    const resource = new CfnDomainName(this, 'Resource', {
      domainName: props.domainName,
      certificateArn: edge ? props.certificate.certificateRef.certificateId : undefined,
      regionalCertificateArn: edge ? undefined : props.certificate.certificateRef.certificateId,
      endpointConfiguration: { types: [this.endpointType] },
      mutualTlsAuthentication: mtlsConfig,
      securityPolicy: props.securityPolicy,
      routingMode: this.routingMode,
    });

    this.domainName = resource.ref;
    this.domainNameRef = resource.domainNameRef;

    this.domainNameAliasDomainName = edge
      ? resource.attrDistributionDomainName
      : resource.attrRegionalDomainName;

    this.domainNameAliasHostedZoneId = edge
      ? resource.attrDistributionHostedZoneId
      : resource.attrRegionalHostedZoneId;

    if (this.routingMode === RoutingMode.ROUTING_RULE_ONLY && props.mapping) {
      throw new ValidationError(
        'Cannot set "mapping" when routingMode is ROUTING_RULE_ONLY. Use addRoutingRule() instead.',
        scope,
      );
    }

    const multiLevel = this.validateBasePath(props.basePath);
    if (props.mapping && !multiLevel) {
      this.addBasePathMapping(props.mapping, {
        basePath: props.basePath,
      });
    } else if (props.mapping && multiLevel) {
      this.addApiMapping(props.mapping.deploymentStage, {
        basePath: props.basePath,
      });
    }
  }

  private validateBasePath(path?: string): boolean {
    if (this.isMultiLevel(path)) {
      if (this.endpointType === EndpointType.EDGE) {
        throw new ValidationError('multi-level basePath is only supported when endpointType is EndpointType.REGIONAL', this);
      }
      if (this.securityPolicy && this.securityPolicy !== SecurityPolicy.TLS_1_2) {
        throw new ValidationError('securityPolicy must be set to TLS_1_2 if multi-level basePath is provided', this);
      }
      return true;
    }
    return false;
  }

  private isMultiLevel(path?: string): boolean {
    return (path?.split('/').filter(x => !!x) ?? []).length >= 2;
  }

  /**
   * Maps this domain to an API endpoint.
   *
   * This uses the BasePathMapping from ApiGateway v1 which does not support multi-level paths.
   *
   * If you need to create a mapping for a multi-level path use `addApiMapping` instead.
   *
   * @param targetApi That target API endpoint, requests will be mapped to the deployment stage.
   * @param options Options for mapping to base path with or without a stage
   */
  @MethodMetadata()
  public addBasePathMapping(targetApi: IRestApiRef, options: BasePathMappingOptions = {}): BasePathMapping {
    if (this.routingMode === RoutingMode.ROUTING_RULE_ONLY) {
      throw new ValidationError(
        'Cannot call addBasePathMapping when routingMode is ROUTING_RULE_ONLY. Set routingMode to BASE_PATH_MAPPING_ONLY or ROUTING_RULE_THEN_API_MAPPING.',
        this,
      );
    }
    if (this.basePaths.has(options.basePath)) {
      throw new ValidationError(`DomainName ${this.node.id} already has a mapping for path ${options.basePath}`, this);
    }
    if (this.isMultiLevel(options.basePath)) {
      throw new ValidationError('BasePathMapping does not support multi-level paths. Use "addApiMapping instead.', this);
    }

    this.basePaths.add(options.basePath);
    const basePath = options.basePath || '/';
    const id = `Map:${basePath}=>${Names.nodeUniqueId(targetApi.node)}`;
    return new BasePathMapping(this, id, {
      domainName: this,
      restApi: targetApi,
      ...options,
    });
  }

  /**
   * Maps this domain to an API endpoint.
   *
   * This uses the ApiMapping from ApiGatewayV2 which supports multi-level paths, but
   * also only supports:
   * - SecurityPolicy.TLS_1_2
   * - EndpointType.REGIONAL
   *
   * @param targetStage the target API stage.
   * @param options Options for mapping to a stage
   */
  @MethodMetadata()
  public addApiMapping(targetStage: IStageRef, options: ApiMappingOptions = {}): void {
    if (this.routingMode === RoutingMode.ROUTING_RULE_ONLY) {
      throw new ValidationError(
        'Cannot call addApiMapping when routingMode is ROUTING_RULE_ONLY. Set routingMode to BASE_PATH_MAPPING_ONLY or ROUTING_RULE_THEN_API_MAPPING.',
        this,
      );
    }
    if (this.basePaths.has(options.basePath)) {
      throw new ValidationError(`DomainName ${this.node.id} already has a mapping for path ${options.basePath}`, this);
    }
    this.validateBasePath(options.basePath);
    this.basePaths.add(options.basePath);
    const id = `Map:${options.basePath ?? 'none'}=>${Names.nodeUniqueId(targetStage.node)}`;
    new apigwv2.CfnApiMapping(this, id, {
      apiId: targetStage.stageRef.restApiId,
      stage: targetStage.stageRef.stageName,
      domainName: this.domainName,
      apiMappingKey: options.basePath,
    });
  }

  /**
   * Adds a routing rule to this domain. Only allowed when routingMode is
   * ROUTING_RULE_ONLY or ROUTING_RULE_THEN_API_MAPPING. Domain must be REGIONAL.
   *
   * @param id Unique id for the rule construct
   * @param options Priority, conditions (base path and/or headers), and target API action
   * @returns The RoutingRule construct
   */
  @MethodMetadata()
  public addRoutingRule(id: string, options: AddRoutingRuleOptions): RoutingRule {
    if (this.routingMode === RoutingMode.BASE_PATH_MAPPING_ONLY) {
      throw new ValidationError(
        'Cannot call addRoutingRule when routingMode is BASE_PATH_MAPPING_ONLY. Set routingMode to ROUTING_RULE_ONLY or ROUTING_RULE_THEN_API_MAPPING.',
        this,
      );
    }
    if (this.endpointType !== EndpointType.REGIONAL) {
      throw new ValidationError('Routing rules are only supported for REGIONAL endpoint type', this);
    }
    return new RoutingRule(this, id, {
      domainName: this,
      priority: options.priority,
      conditions: options.conditions,
      action: options.action,
    });
  }

  private configureMTLS(mtlsConfig?: MTLSConfig): CfnDomainName.MutualTlsAuthenticationProperty | undefined {
    if (!mtlsConfig) return undefined;
    return {
      truststoreUri: mtlsConfig.bucket.s3UrlForObject(mtlsConfig.key),
      truststoreVersion: mtlsConfig.version,
    };
  }
}

export interface DomainNameAttributes {
  /**
   * The domain name (e.g. `example.com`)
   */
  readonly domainName: string;

  /**
   * The Route53 alias target to use in order to connect a record set to this domain through an alias.
   */
  readonly domainNameAliasTarget: string;

  /**
   * The Route53 hosted zone ID to use in order to connect a record set to this domain through an alias.
   */
  readonly domainNameAliasHostedZoneId: string;
}

/**
 * The mTLS authentication configuration for a custom domain name.
 */
export interface MTLSConfig {
  /**
   * The bucket that the trust store is hosted in.
   */
  readonly bucket: IBucket;

  /**
   * The key in S3 to look at for the trust store.
   */
  readonly key: string;

  /**
   *  The version of the S3 object that contains your truststore.
   *  To specify a version, you must have versioning enabled for the S3 bucket.
   *  @default - latest version
   */
  readonly version?: string;
}
