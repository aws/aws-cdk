import * as cdk from '@aws-cdk/core';
import * as ga from './globalaccelerator.generated';

export interface IAccelerator {
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

export class Accelerator extends cdk.Resource implements IAccelerator {

  public readonly acceleratorArn: string;
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
