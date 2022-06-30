import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Represents an Sagemaker endpoint resource.
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

  /**
   * Grant access to invoke the endpoint to the given identity.
   *
   * This will grant the following permissions:
   *  - sagemaker:InvokeEndpoint
   *
   * @param grantee Principal to grant send rights to
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Reference to a new or existing Amazon Sagemaker endpoint.
 */
export abstract class EndpointBase extends Resource implements IEndpoint {

  /**
   * The ARN of the endpoint.
   *
   * @attribute
   */
  public abstract readonly endpointArn: string;

  /**
   * The name of the endpoint.
   *
   * @attribute
   */
  public abstract readonly endpointName: string;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  /**
   * Grant access to invoke the endpoint to the given identity.
   *
   * This will grant the following permissions:
   *  - sagemaker:InvokeEndpoint
   *
   * @param grantee Principal to grant send rights to
   */
  public grantInvoke(grantee: iam.IGrantable) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [
        'sagemaker:InvokeEndpoint',
      ],
      resourceArns: [
        this.endpointArn,
      ],
    });
  }
}

/**
 * Reference to a endpoint
 */
export interface EndpointAttributes {
  /**
   * The ARN of the endpoint.
   */
  readonly endpointArn: string;

  /**
   * The name of the endpoint.
   *
   * @default - if endpoint name is not specified, the name will be derived from the endpoint ARN
   */
  readonly endpointName?: string;
}
