import * as cdk from '@aws-cdk/core';
import * as ga from './globalaccelerator.generated';

export interface IAccelerator extends cdk.IResource {
  /**
   * @attribute
   */
  readonly acceleratorArn: string;

  /**
   * @attribute
   */
  readonly dnsName: string;
}

export interface AcceleratorProps {
  readonly acceleratorName?: string;
  readonly enabled?: boolean;
}

/**
 * Attributes required to import an existing accelerator to the stack
 */
export interface AcceleratorAttributes {
  readonly acceleratorArn: string;
  readonly dnsName: string;
}

/**
 * The Accelerator construct
 */
export class Accelerator extends cdk.Resource implements IAccelerator {
  public static fromAcceleratorAttributes(scope: cdk.Construct, id: string, attrs: AcceleratorAttributes ): IAccelerator {
    class Import extends cdk.Resource implements IAccelerator {
      public readonly acceleratorArn = attrs.acceleratorArn;
      public readonly dnsName = attrs.dnsName;
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

  constructor(scope: cdk.Construct, id: string, props: AcceleratorProps = {}) {
    super(scope, id);

    const resource = new ga.CfnAccelerator(this, 'Resource', {
      enabled: props.enabled ?? true,
      name: props.acceleratorName ?? id,
    });

    this.acceleratorArn = resource.attrAcceleratorArn;
    this.dnsName = resource.attrDnsName;
  }
}
