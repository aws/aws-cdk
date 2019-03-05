// Note: this is isolated in a separate file because it is referenced by the build-tools.

/**
 * Information about an AWS region.
 */
export interface IRegionInfo {
  /**
   * The name of the AWS region, such as `us-east-1`.
   */
  readonly name: string;

  /**
   * The partition in which the region is located (e.g: `aws`, `aws-cn`, ...).
   */
  readonly partition: string;

  /**
   * The name of the endpoint used for S3 Static Website hosting in the region.
   */
  readonly s3WebsiteEndpoint: string;

  /**
   * A map from service name (e.g: `s3`, `sqs`, `application-autoscaling`, ...) to the service principal name for that
   * service in the region (e.g: `codedeploy.<region>.amazonaws.com`).
   */
  readonly servicePrincipals: { [service: string]: string };

  /**
   * Whether the `AWS::CDK::Metadata` resource is present in the region or not.
   */
  readonly cdkMetadataResourcePresent: boolean;
}
