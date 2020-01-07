import * as acm from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnDomainName } from './apigateway.generated';
import { BasePathMapping, BasePathMappingOptions } from './base-path-mapping';
import { EndpointType, IRestApi} from './restapi';

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
  readonly certificate: acm.ICertificate;

  /**
   * The type of endpoint for this DomainName.
   * @default REGIONAL
   */
  readonly endpointType?: EndpointType;
}

export interface DomainNameProps extends DomainNameOptions {
  /**
   * If specified, all requests to this domain will be mapped to the production
   * deployment of this API. If you wish to map this domain to multiple APIs
   * with different base paths, don't specify this option and use
   * `addBasePathMapping`.
   *
   * @default - you will have to call `addBasePathMapping` to map this domain to
   * API endpoints.
   */
  readonly mapping?: IRestApi;
}

export interface IDomainName extends IResource {
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

export class DomainName extends Resource implements IDomainName {

  /**
   * Imports an existing domain name.
   */
  public static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName {
    class Import extends Resource implements IDomainName {
      public readonly domainName = attrs.domainName;
      public readonly domainNameAliasDomainName = attrs.domainNameAliasTarget;
      public readonly domainNameAliasHostedZoneId = attrs.domainNameAliasHostedZoneId;
    }

    return new Import(scope, id);
  }

  public readonly domainName: string;
  public readonly domainNameAliasDomainName: string;
  public readonly domainNameAliasHostedZoneId: string;

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    const endpointType = props.endpointType || EndpointType.REGIONAL;
    const edge = endpointType === EndpointType.EDGE;

    const resource = new CfnDomainName(this, 'Resource', {
      domainName: props.domainName,
      certificateArn: edge ? props.certificate.certificateArn : undefined,
      regionalCertificateArn: edge ? undefined : props.certificate.certificateArn,
      endpointConfiguration: { types: [endpointType] },
    });

    this.domainName = resource.ref;

    this.domainNameAliasDomainName = edge
      ? resource.attrDistributionDomainName
      : resource.attrRegionalDomainName;

    this.domainNameAliasHostedZoneId = edge
      ? resource.attrDistributionHostedZoneId
      : resource.attrRegionalHostedZoneId;

    if (props.mapping) {
      this.addBasePathMapping(props.mapping);
    }
  }

  /**
   * Maps this domain to an API endpoint.
   * @param targetApi That target API endpoint, requests will be mapped to the deployment stage.
   * @param options Options for mapping to base path with or without a stage
   */
  public addBasePathMapping(targetApi: IRestApi, options: BasePathMappingOptions = { }) {
    const basePath = options.basePath || '/';
    const id = `Map:${basePath}=>${targetApi.node.uniqueId}`;
    return new BasePathMapping(this, id, {
      domainName: this,
      restApi: targetApi,
      ...options
    });
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
   * Thje Route53 hosted zone ID to use in order to connect a record set to this domain through an alias.
   */
  readonly domainNameAliasHostedZoneId: string;
}
