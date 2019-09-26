import { IRecordSet } from "./record-set";
import { CfnRecordSet } from "./route53.generated";

/**
 * Classes that are valid alias record targets, like CloudFront distributions and load
 * balancers, should implement this interface.
 */
export interface IAliasRecordTarget {
  /**
   * Return hosted zone ID and DNS name, usable for Route53 alias targets
   */
  bind(record: IRecordSet): AliasRecordTargetConfig;
}

/**
 * Validatable alias record target class
 */
export interface IValidatableAliasRecordTarget extends IAliasRecordTarget {
  /**
   * Verifies that the generated alias record will be valid
   *
   * @throws Will throw if the generated record is deemed invalid
   */
  validate(record: CfnRecordSet): void;
}

export const isValidatableAliasRecordTarget = (recordTarget: IAliasRecordTarget): recordTarget is IValidatableAliasRecordTarget =>
  !!(recordTarget as IValidatableAliasRecordTarget).validate;

/**
 * Represents the properties of an alias target destination.
 */
export interface AliasRecordTargetConfig {
  /**
   * Hosted zone ID of the target
   */
  readonly hostedZoneId: string;

  /**
   * DNS name of the target
   */
  readonly dnsName: string;
}
