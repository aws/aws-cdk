import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

/**
 * The interface for a SageMaker Endpoint resource.
 */
export interface IEndpoint extends cdk.IResource {
  /**
   * The ARN of the endpoint.
   *
   * @attribute
   */
  readonly endpointArn: string;

  /**
   * The name of the endpoint.
   *
   * @attribute
   */
  readonly endpointName: string;

  /**
   * Permits an IAM principal to invoke this endpoint
   * @param grantee The principal to grant access to
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;
}
