import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';

/**
 * Initialization properties for `OpenIdConnectProvider`.
 */
export interface OpenIdConnectProviderProps {
  /**
   * The URL of the identity provider. The URL must begin with https:// and
   * should correspond to the iss claim in the provider's OpenID Connect ID
   * tokens. Per the OIDC standard, path components are allowed but query
   * parameters are not. Typically the URL consists of only a hostname, like
   * https://server.example.org or https://example.com.
   *
   * You can find your OIDC Issuer URL by:
   * aws eks describe-cluster --name %cluster_name% --query "cluster.identity.oidc.issuer" --output text
   */
  readonly url: string;
}

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
export class OpenIdConnectProvider extends iam.OpenIdConnectProvider {
  /**
   * Defines an OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(scope: Construct, id: string, props: OpenIdConnectProviderProps) {
    /**
     * For some reason EKS isn't validating the root certificate but a intermediate certificate
     * which is one level up in the tree. Because of the a constant thumbprint value has to be
     * stated with this OpenID Connect provider. The certificate thumbprint is the same for all the regions.
     */
    const thumbprints = ['9e99a48a9960b14926bb7f3b02e22da2b0ab7280'];

    const clientIds = ['sts.amazonaws.com'];

    super(scope, id, {
      url: props.url,
      thumbprints,
      clientIds,
    });
  }
}
