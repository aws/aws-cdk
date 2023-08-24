import { IResource } from '../../core';

/**
 * The interface for a SageMaker Endpoint resource.
 */
export interface IEndpoint extends IResource {
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
