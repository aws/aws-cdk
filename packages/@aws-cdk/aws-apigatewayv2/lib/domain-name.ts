import { Construct, IResource, Resource } from '@aws-cdk/core';

import { CfnDomainName } from './apigatewayv2.generated';

/**
 * Represents an endpoint type
 */
export enum EndpointType {
  /**
   * Regional endpoint
   */
  REGIONAL = "REGIONAL",

  /**
   * Edge endpoint
   */
  EDGE = "EDGE"
}

/**
 * Specifies the configuration for a an API's domain name.
 */
export interface DomainNameConfiguration {
  /**
   * An AWS-managed certificate that will be used by the edge-optimized endpoint for this domain name.
   * AWS Certificate Manager is the only supported source.
   *
   * @default - uses `certificateName` if defined, or no certificate
   */
  readonly certificateArn?: string;

  /**
   * The user-friendly name of the certificate that will be used by the edge-optimized endpoint for this domain name.
   *
   * @default - uses `certificateArn` if defined, or no certificate
   */
  readonly certificateName?: string;

  /**
   * The endpoint type.
   *
   * @default 'REGIONAL'
   */
  readonly endpointType?: EndpointType;
}

/**
 * Defines the attributes for an Api Gateway V2 Domain Name.
 */
export interface DomainNameAttributes {
  /**
   * The custom domain name for your API in Amazon API Gateway.
   */
  readonly domainName: string;
}

/**
 * Defines the contract for an Api Gateway V2 Domain Name.
 */
export interface IDomainName extends IResource {
  /**
   * The custom domain name for your API in Amazon API Gateway.
   * @attribute
   */
  readonly domainName: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Api Mapping.
 */
export interface DomainNameProps {
  /**
   * The custom domain name for your API in Amazon API Gateway.
   */
  readonly domainName: string;

  /**
   * The domain name configurations.
   *
   * @default - no specific configuration
   */
  readonly domainNameConfigurations?: DomainNameConfiguration[];
  // TODO: Tags
}

/**
 * A Domain Name for an API. An API mapping relates a path of your custom domain name to a stage of your API.
 *
 * A custom domain name can have multiple API mappings, but the paths can't overlap.
 *
 * A custom domain can map only to APIs of the same protocol type.
 */
export class DomainName extends Resource implements IDomainName {

  /**
   * Creates a new imported Domain Name
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param attrs domain name attributes
   */
  public static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName {
    class Import extends Resource implements IDomainName {
      public readonly domainName = attrs.domainName;
    }

    return new Import(scope, id);
  }

  /**
   * The custom domain name for your API in Amazon API Gateway.
   */
  public readonly domainName: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   * You set up this association by adding a DNS record that points the custom domain name to this regional domain name.
   *
   * @attribute
   */
  public readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   *
   * @attribute
   */
  public readonly regionalHostedZoneId: string;

  private resource: CfnDomainName;

  constructor(scope: Construct, id: string, props: DomainNameProps) {
    super(scope, id);

    this.resource = new CfnDomainName(this, 'Resource', {
      ...props
    });
    this.domainName = this.resource.ref;
    this.regionalDomainName = this.resource.attrRegionalDomainName;
    this.regionalHostedZoneId = this.resource.attrRegionalHostedZoneId;
  }
}