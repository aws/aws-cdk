/**
 * Properties for AWS EventBridge event metadata
 */
export interface AWSEventMetadataProps {
  /**
   * By default, this is set to 0 (zero) in all events.
   *
   * @default - No filtering on version
   */
  readonly version?: string[] | undefined;

  /**
   * This JSON array contains ARNs that identify resources that are involved
   * in the event. Inclusion of these ARNs is at the discretion of the
   * service.
   *
   * For example, Amazon EC2 instance state-changes include Amazon EC2
   * instance ARNs, Auto Scaling events include ARNs for both instances and
   * Auto Scaling groups, but API calls with AWS CloudTrail do not include
   * resource ARNs.
   *
   * @default - No filtering on resource
   */
  readonly resources?: string[] | undefined;

  /**
   * Identifies the AWS region where the event originated.
   *
   * @default - No filtering on region
   */
  readonly region?: string[] | undefined;
}
