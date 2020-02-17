import * as cdk from '@aws-cdk/core';
import * as waf from './index';

/**
 * Specifies whether the addresses are IPV4 or IPV6.
 */
export enum IpAddressVersion {
  /**
   * Specifies IPV4 addresses
   */
  IPV4 = 'IPV4',

  /**
   * Specifies IPV6 addresses
   */
  IPV6 = 'IPV6'
}

/**
 * Specifies whether this is for an AWS CloudFront distribution or for a
 * regional application. A regional application can be an Application Load
 * Balancer (ALB) or an API Gateway stage. Valid Values are CLOUDFRONT and
 * REGIONAL.
 */
export enum IpSetScope {
  /**
   * Specifies a Cloudfront application scope
   */
  CLOUDFRONT = 'CLOUDFRONT',

  /**
   * Specifies a Regional application scope
   */
  REGIONAL = 'REGIONAL'
}

export interface IIpSet {
  /**
   * A friendly name of the IP set. You cannot change the name of an IPSet
   * after you create it.
   */
  readonly ipSetName: string;
}

export abstract class IpSetBase extends cdk.Resource implements IIpSet {
  /**
   * A friendly name of the IP set. You cannot change the name of an IPSet
   * after you create it.
   */
  public abstract readonly ipSetName: string;
}

export interface IpSetProps {
  /**
   * A friendly name of the IP set. You cannot change the name of an IPSet
   * after you create it.
   * @default none
   */
  readonly name?: string;

  /**
   * A friendly description of the IP set. You cannot change the description
   * of an IP set after you create it.
   * @default none
   */
  readonly description?: string;

  /**
   * Contains an array of strings that specify one or more IP addresses or
   * blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   * AWS WAF supports all address ranges for IP versions IPv4 and IPv6.
   */
  readonly addresses?: string[];

  /**
   * Specify IPV4 or IPV6.
   *
   * @default IPV4
   */
  readonly ipAddressVersion?: IpAddressVersion;

  /**
   * Specifies whether this is for an AWS CloudFront distribution or for a
   * regional application. A regional application can be an Application
   * Load Balancer (ALB) or an API Gateway stage.
   *
   * @default CLOUDFRONT
   */
  readonly scope?: IpSetScope;
}

export class IpSet extends IpSetBase {
  /**
   * A friendly name of the IP set. You cannot change the name of an IPSet
   * after you create it.
   */
  public readonly ipSetName: string;

  /**
   * Contains an array of strings that specify one or more IP addresses or
   * blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   * AWS WAF supports all address ranges for IP versions IPv4 and IPv6.
   */
  private addresses: string[] = [];

  constructor(scope: cdk.Construct, id: string, props: IpSetProps) {
    super(scope, id, {
      physicalName: props.name || cdk.PhysicalName.GENERATE_IF_NEEDED
    });

    this.addAddresses(...props.addresses || []);

    const resource = new waf.CfnIPSet(this, 'Resource', {
      addresses: {
        ipAddresses: cdk.Lazy.listValue({ produce: () => this.addresses }, { omitEmpty: true })
      },
      ipAddressVersion: props.ipAddressVersion || IpAddressVersion.IPV4,
      name: props.name,
      scope: props.scope || IpSetScope.CLOUDFRONT,
      description: props.description
    });

    this.ipSetName = this.getResourceNameAttribute(resource.ref);
  }

  /**
   * Adds an ip address to the the addresses list
   */
  public addAddresses(...addresses: string[]): void {
    for (const address of addresses) {
      this.addresses.push(address);
    }
  }
}
