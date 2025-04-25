/**
 * Properties the alias record target
 */
export interface IAliasRecordTargetProps {
  /**
   * Target Hosted zone ID.
   *
   * @default - no hosted zone id, can be auto detected for some kinds of target
   */
  readonly hostedZoneId?: string;

  /**
   * Evaluate target health
   *
   * @default - no health check configuration
   */
  readonly evaluateTargetHealth?: boolean;
}
