import type { IWebFunctionEndpointRef } from './lambda.generated';
import * as iam from '../../aws-iam';

/**
 * Collection of grant methods for a WebFunction endpoint.
 */
export class WebFunctionEndpointGrants {
  /**
   * Creates grants for a WebFunction endpoint.
   */
  public static fromWebFunctionEndpoint(endpoint: IWebFunctionEndpointRef): WebFunctionEndpointGrants {
    return new WebFunctionEndpointGrants(endpoint);
  }

  private constructor(private readonly endpoint: IWebFunctionEndpointRef) {}

  /**
   * Grants permission to invoke the endpoint over HTTP.
   *
   * Only meaningful for an endpoint with `WebFunctionAuthType.IAM_AUTH`; requests to it must be
   * signed by the grantee.
   *
   * A role or user in this account gets the permission in its own policy. Any other grantee, such
   * as a service principal or another account, gets a statement in the resource-based policy of
   * the WebFunction the endpoint serves, which requires that function to be defined in this app.
   */
  public invoke(grantee: iam.IGrantable): iam.Grant {
    const options = {
      grantee,
      actions: ['lambda:InvokeWebFunctionEndpoint'],
      resourceArns: [this.endpoint.webFunctionEndpointRef.endpointArn],
    };
    if (iam.GrantableResources.isResourceWithPolicy(this.endpoint)) {
      const policyArn = (this.endpoint as { _arnForResourcePolicy?: () => string })._arnForResourcePolicy?.();
      return iam.Grant.addToPrincipalOrResource({
        ...options,
        resource: this.endpoint,
        // How the function's resource-based policy names the endpoint; see `_arnForResourcePolicy`.
        resourceSelfArns: policyArn ? [policyArn] : undefined,
      });
    }
    return iam.Grant.addToPrincipal(options);
  }
}
