/**
 * Properties the alias record target
 */
export interface IAliasRecordTargetProps {
  /**
   * Target Hosted zone ID.
   *
   * @default - hosted zone ID for the EBS endpoint will be retrieved based on the stack's region.
   */
  readonly hostedZoneId?: string;

  /**
   * Evaluate target health
   *
   * @default - no health check configuration
   */
  readonly evaluateTargetHealth?: boolean;
}
