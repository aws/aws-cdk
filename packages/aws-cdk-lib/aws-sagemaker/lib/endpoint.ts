import type * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import type { IEndpointRef } from '../../interfaces/generated/aws-sagemaker-interfaces.generated';

/**
 * The interface for a SageMaker Endpoint resource.
 */
export interface IEndpoint extends IResource, IEndpointRef {
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
