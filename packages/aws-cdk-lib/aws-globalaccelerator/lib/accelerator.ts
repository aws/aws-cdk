import { Construct } from 'constructs';
import * as ga from './globalaccelerator.generated';
import { Listener, ListenerOptions } from './listener';
import * as cdk from '../../core';

/**
 * The interface of the Accelerator
 */
export interface IAccelerator extends cdk.IResource {
  /**
   * The ARN of the accelerator.
   *
   * @attribute
   */
  readonly acceleratorArn: string;

  /**
   * The Domain Name System (DNS) name that Global Accelerator creates that points to your accelerator's static
   * IP addresses.
   *
   * @attribute
   */
  readonly dnsName: string;

  /**
   * The DNS name that Global Accelerator creates that points to a dual-stack accelerator's four static IP addresses:
   * two IPv4 addresses and two IPv6 addresses.
   *
   * @attribute
   */
  readonly dualStackDnsName?: string;

  /**
   * The array of IPv4 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
   *
   * @attribute
   */
  readonly ipv4Addresses?: string[];

  /**
   * The array of IPv6 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
   *
   * @attribute
   */
  readonly ipv6Addresses?: string[];
}

/**
 * Construct properties of the Accelerator
 */
export interface AcceleratorProps {
  /**
   * The name of the accelerator
   *
   * @default - resource ID
   */
  readonly acceleratorName?: string;

  /**
   * Indicates whether the accelerator is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * IP addresses associated with the accelerator.
   *
   * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose IP
   * addresses from your own pool to use for the accelerator's static IP addresses when you create an accelerator.
   * You can specify one or two addresses, separated by a comma. Do not include the /32 suffix.
   *
   * Only one IP address from each of your IP address ranges can be used for each accelerator. If you specify
   * only one IP address from your IP address range, Global Accelerator assigns a second static IP address for
   * the accelerator from the AWS IP address pool.
   *
   * Note that you can't update IP addresses for an existing accelerator. To change them, you must create a
   * new accelerator with the new addresses.
   *
   * @default - undefined. IP addresses will be from Amazon's pool of IP addresses.
   */
  readonly ipAddresses?: string[];

  /**
  * The IP address type that an accelerator supports.
  *
  * For a standard accelerator, the value can be IPV4 or DUAL_STACK.
  *
  * @default - "IPV4"
  */
  readonly ipAddressType?: IpAddressType;
}

/**
 * Attributes required to import an existing accelerator to the stack
 */
export interface AcceleratorAttributes {
  /**
   * The ARN of the accelerator
   */
  readonly acceleratorArn: string;

  /**
   * The DNS name of the accelerator
   */
  readonly dnsName: string;

  /**
   * The DNS name that points to the dual-stack accelerator's four static IP addresses: two IPv4 addresses and two IPv6 addresses.
   *
   * @default - undefined
   */
  readonly dualStackDnsName?: string;

  /**
   * The array of IPv4 addresses in the IP address set
   *
   * @default - undefined
   */
  readonly ipv4Addresses?: string[];

  /**
   * The array of IPv6 addresses in the IP address set
   *
   * @default - undefined
   */
  readonly ipv6Addresses?: string[];
}

/**
 * The IP address type that an accelerator supports.
 */
export enum IpAddressType {
  /**
   * IPV4
   */
  IPV4 = 'IPV4',

  /**
   * DUAL_STACK
   */
  DUAL_STACK = 'DUAL_STACK',
}

/**
 * The Accelerator construct
 */
export class Accelerator extends cdk.Resource implements IAccelerator {
  /**
   * import from attributes
   */
  public static fromAcceleratorAttributes(scope: Construct, id: string, attrs: AcceleratorAttributes): IAccelerator {
    class Import extends cdk.Resource implements IAccelerator {
      public readonly acceleratorArn = attrs.acceleratorArn;
      public readonly dnsName = attrs.dnsName;
      public readonly dualStackDnsName = attrs.dualStackDnsName;
      public readonly ipv4Addresses = attrs.ipv4Addresses;
      public readonly ipv6Addresses = attrs.ipv6Addresses;
    }
    return new Import(scope, id);
  }
  /**
   * The ARN of the accelerator.
   */
  public readonly acceleratorArn: string;

  /**
   * The Domain Name System (DNS) name that Global Accelerator creates that points to your accelerator's static
   * IP addresses.
   */
  public readonly dnsName: string;

  /**
   * The DNS name that points to the dual-stack accelerator's four static IP addresses:
   * two IPv4 addresses and two IPv6 addresses.
   */
  public readonly dualStackDnsName?: string;

  /**
   * The array of IPv4 addresses in the IP address set
   */
  public readonly ipv4Addresses?: string[];

  /**
   * The array of IPv6 addresses in the IP address set
   */
  public readonly ipv6Addresses?: string[];

  constructor(scope: Construct, id: string, props: AcceleratorProps = {}) {
    super(scope, id);

    this.validateAcceleratorName(props.acceleratorName);
    this.validateIpAddresses(props.ipAddresses);

    const name = props.acceleratorName ?? cdk.Names.uniqueResourceName(this, {
      maxLength: 64,
    });
    const resource = new ga.CfnAccelerator(this, 'Resource', {
      enabled: props.enabled ?? true,
      name,
      ipAddresses: props.ipAddresses,
      ipAddressType: props.ipAddressType,
    });

    this.acceleratorArn = resource.attrAcceleratorArn;
    this.dnsName = resource.attrDnsName;
    this.dualStackDnsName = resource.attrDualStackDnsName;
    this.ipv4Addresses = resource.attrIpv4Addresses;
    this.ipv6Addresses = resource.attrIpv6Addresses;
  }

  /**
   * Add a listener to the accelerator
   */
  public addListener(id: string, options: ListenerOptions) {
    return new Listener(this, id, {
      accelerator: this,
      ...options,
    });
  }

  private validateAcceleratorName(name?: string) {
    if (!cdk.Token.isUnresolved(name) && name !== undefined && (name.length < 1 || name.length > 64)) {
      throw new Error(`Invalid acceleratorName value ${name}, must have length between 1 and 64, got: ${name.length}`);
    }
  }

  private validateIpAddresses(ipAddresses?: string[]) {
    if (ipAddresses !== undefined && (ipAddresses.length < 1 || ipAddresses.length > 2)) {
      throw new Error(`Invalid ipAddresses value [${ipAddresses}], you can specify one or two addresses, got: ${ipAddresses.length}`);
    }
  }
}
