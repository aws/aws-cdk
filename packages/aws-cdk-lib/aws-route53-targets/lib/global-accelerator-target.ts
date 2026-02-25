import type { IAliasRecordTargetProps } from './shared';
import type * as globalaccelerator from '../../aws-globalaccelerator';
import type * as route53 from '../../aws-route53';
import { UnscopedValidationError } from '../../core';
import type { IAcceleratorRef } from '../../interfaces/generated/aws-globalaccelerator-interfaces.generated';

/**
 * Use a Global Accelerator domain name as an alias record target.
 */
export class GlobalAcceleratorDomainTarget implements route53.IAliasRecordTarget {
  /**
   * The hosted zone Id if using an alias record in Route53.
   * This value never changes.
   * Ref: https://docs.aws.amazon.com/general/latest/gr/global_accelerator.html
   */
  public static readonly GLOBAL_ACCELERATOR_ZONE_ID = 'Z2BJ6XQ5FK7U4H';

  /**
   * Create an Alias Target for a Global Accelerator domain name.
   */
  constructor(private readonly acceleratorDomainName: string, private readonly props?: IAliasRecordTargetProps) {}

  bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: GlobalAcceleratorTarget.GLOBAL_ACCELERATOR_ZONE_ID,
      dnsName: this.acceleratorDomainName,
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }
}

/**
 * Use a Global Accelerator instance domain name as an alias record target.
 */
export class GlobalAcceleratorTarget extends GlobalAcceleratorDomainTarget {
  /**
   * Create an Alias Target for a Global Accelerator instance.
   */
  constructor(accelerator: IAcceleratorRef, props?: IAliasRecordTargetProps) {
    super(toIAccelerator(accelerator).dnsName, props);
  }
}

function toIAccelerator(accelerator: IAcceleratorRef): globalaccelerator.IAccelerator {
  if (!('dnsName' in accelerator) || typeof (accelerator as any).dnsName !== 'string') {
    throw new UnscopedValidationError(`'accelerator' instance should implement IAccelerator, but doesn't: ${accelerator.constructor.name}`);
  }
  return accelerator as globalaccelerator.IAccelerator;
}
