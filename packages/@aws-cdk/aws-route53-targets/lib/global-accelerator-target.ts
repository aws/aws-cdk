import { IAccelerator } from '@aws-cdk/aws-globalaccelerator';
import { IRecordSet, IAliasRecordTarget, AliasRecordTargetConfig } from '@aws-cdk/aws-route53';

export class GlobalAcceleratorTarget implements IAliasRecordTarget {
  /**
   * The hosted zone Id if using an alias record in Route53.
   * This value never changes.
   * Ref: https://docs.aws.amazon.com/general/latest/gr/global_accelerator.html
   */
  public static readonly GLOBAL_ACCELERATOR_ZONE_ID = 'Z2BJ6XQ5FK7U4H';

  /**
   * Create an Alias Target for a Global Accelerator.
   *
   * If passing a string value, it must be a valid DNS name for an existing Global Accelerator. e.g. xyz.awsglobalaccelerator.com
   * If passing an instance of an accelerator created within CDK, the accelerator.dnsName property will be used as the target.
   */
  constructor(private readonly accelerator: string | IAccelerator) {
  }

  bind(record: IRecordSet): AliasRecordTargetConfig {
    let acceleratorDomainName;
    if (typeof this.accelerator === 'string') {
      acceleratorDomainName = this.accelerator;
    } else {
      acceleratorDomainName = this.accelerator.dnsName;
    }
    return {
      hostedZoneId: GlobalAcceleratorTarget.GLOBAL_ACCELERATOR_ZONE_ID,
      dnsName: acceleratorDomainName,
    };
  }
}
