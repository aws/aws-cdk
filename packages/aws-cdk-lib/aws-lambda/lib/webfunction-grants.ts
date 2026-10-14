import type { IWebFunctionEndpointRef } from './lambda.generated';
import * as iam from '../../aws-iam';

/**
 * Collection of grant methods for a WebFunction endpoint.
 */
export class WebFunctionGrants {
  /**
   * Creates grants for a WebFunction endpoint.
   */
  public static fromWebFunctionEndpoint(endpoint: IWebFunctionEndpointRef): WebFunctionGrants {
    return new WebFunctionGrants(endpoint);
  }

  private constructor(private readonly endpoint: IWebFunctionEndpointRef) {}

  /**
   * Grants permission to invoke the endpoint over HTTP.
   *
   * Only meaningful for an endpoint with `WebFunctionAuthType.IAM_AUTH`; requests to it must be
   * signed by the grantee.
   */
  public invoke(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['lambda:InvokeWebFunctionEndpoint'],
      resourceArns: [this.endpoint.webFunctionEndpointRef.endpointArn],
    });
  }
}
