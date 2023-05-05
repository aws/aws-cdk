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
}
