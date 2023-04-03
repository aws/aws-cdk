"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIdConnectProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
/**
 * IAM OIDC identity providers are entities in IAM that describe an external
 * identity provider (IdP) service that supports the OpenID Connect (OIDC)
 * standard, such as Google or Salesforce. You use an IAM OIDC identity provider
 * when you want to establish trust between an OIDC-compatible IdP and your AWS
 * account.
 *
 * This implementation has default values for thumbprints and clientIds props
 * that will be compatible with the eks cluster
 *
 * @see http://openid.net/connect
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
 *
 * @resource AWS::CloudFormation::CustomResource
 */
class OpenIdConnectProvider extends iam.OpenIdConnectProvider {
    /**
     * Defines an OpenID Connect provider.
     * @param scope The definition scope
     * @param id Construct ID
     * @param props Initialization properties
     */
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_OpenIdConnectProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, OpenIdConnectProvider);
            }
            throw error;
        }
        const clientIds = ['sts.amazonaws.com'];
        super(scope, id, {
            url: props.url,
            clientIds,
        });
    }
}
exports.OpenIdConnectProvider = OpenIdConnectProvider;
_a = JSII_RTTI_SYMBOL_1;
OpenIdConnectProvider[_a] = { fqn: "@aws-cdk/aws-eks.OpenIdConnectProvider", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9pZGMtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBb0J4Qzs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLHFCQUFxQjtJQUNsRTs7Ozs7T0FLRztJQUNILFlBQW1CLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWlDOzs7Ozs7K0NBUHZFLHFCQUFxQjs7OztRQVM5QixNQUFNLFNBQVMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFeEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxTQUFTO1NBQ1YsQ0FBQyxDQUFDO0tBQ0o7O0FBZkgsc0RBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb24gcHJvcGVydGllcyBmb3IgYE9wZW5JZENvbm5lY3RQcm92aWRlcmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3BlbklkQ29ubmVjdFByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIFVSTCBvZiB0aGUgaWRlbnRpdHkgcHJvdmlkZXIuIFRoZSBVUkwgbXVzdCBiZWdpbiB3aXRoIGh0dHBzOi8vIGFuZFxuICAgKiBzaG91bGQgY29ycmVzcG9uZCB0byB0aGUgaXNzIGNsYWltIGluIHRoZSBwcm92aWRlcidzIE9wZW5JRCBDb25uZWN0IElEXG4gICAqIHRva2Vucy4gUGVyIHRoZSBPSURDIHN0YW5kYXJkLCBwYXRoIGNvbXBvbmVudHMgYXJlIGFsbG93ZWQgYnV0IHF1ZXJ5XG4gICAqIHBhcmFtZXRlcnMgYXJlIG5vdC4gVHlwaWNhbGx5IHRoZSBVUkwgY29uc2lzdHMgb2Ygb25seSBhIGhvc3RuYW1lLCBsaWtlXG4gICAqIGh0dHBzOi8vc2VydmVyLmV4YW1wbGUub3JnIG9yIGh0dHBzOi8vZXhhbXBsZS5jb20uXG4gICAqXG4gICAqIFlvdSBjYW4gZmluZCB5b3VyIE9JREMgSXNzdWVyIFVSTCBieTpcbiAgICogYXdzIGVrcyBkZXNjcmliZS1jbHVzdGVyIC0tbmFtZSAlY2x1c3Rlcl9uYW1lJSAtLXF1ZXJ5IFwiY2x1c3Rlci5pZGVudGl0eS5vaWRjLmlzc3VlclwiIC0tb3V0cHV0IHRleHRcbiAgICovXG4gIHJlYWRvbmx5IHVybDogc3RyaW5nO1xufVxuXG4vKipcbiAqIElBTSBPSURDIGlkZW50aXR5IHByb3ZpZGVycyBhcmUgZW50aXRpZXMgaW4gSUFNIHRoYXQgZGVzY3JpYmUgYW4gZXh0ZXJuYWxcbiAqIGlkZW50aXR5IHByb3ZpZGVyIChJZFApIHNlcnZpY2UgdGhhdCBzdXBwb3J0cyB0aGUgT3BlbklEIENvbm5lY3QgKE9JREMpXG4gKiBzdGFuZGFyZCwgc3VjaCBhcyBHb29nbGUgb3IgU2FsZXNmb3JjZS4gWW91IHVzZSBhbiBJQU0gT0lEQyBpZGVudGl0eSBwcm92aWRlclxuICogd2hlbiB5b3Ugd2FudCB0byBlc3RhYmxpc2ggdHJ1c3QgYmV0d2VlbiBhbiBPSURDLWNvbXBhdGlibGUgSWRQIGFuZCB5b3VyIEFXU1xuICogYWNjb3VudC5cbiAqXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGhhcyBkZWZhdWx0IHZhbHVlcyBmb3IgdGh1bWJwcmludHMgYW5kIGNsaWVudElkcyBwcm9wc1xuICogdGhhdCB3aWxsIGJlIGNvbXBhdGlibGUgd2l0aCB0aGUgZWtzIGNsdXN0ZXJcbiAqXG4gKiBAc2VlIGh0dHA6Ly9vcGVuaWQubmV0L2Nvbm5lY3RcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2lkX3JvbGVzX3Byb3ZpZGVyc19vaWRjLmh0bWxcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2VcbiAqL1xuZXhwb3J0IGNsYXNzIE9wZW5JZENvbm5lY3RQcm92aWRlciBleHRlbmRzIGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIge1xuICAvKipcbiAgICogRGVmaW5lcyBhbiBPcGVuSUQgQ29ubmVjdCBwcm92aWRlci5cbiAgICogQHBhcmFtIHNjb3BlIFRoZSBkZWZpbml0aW9uIHNjb3BlXG4gICAqIEBwYXJhbSBpZCBDb25zdHJ1Y3QgSURcbiAgICogQHBhcmFtIHByb3BzIEluaXRpYWxpemF0aW9uIHByb3BlcnRpZXNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogT3BlbklkQ29ubmVjdFByb3ZpZGVyUHJvcHMpIHtcblxuICAgIGNvbnN0IGNsaWVudElkcyA9IFsnc3RzLmFtYXpvbmF3cy5jb20nXTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgdXJsOiBwcm9wcy51cmwsXG4gICAgICBjbGllbnRJZHMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==