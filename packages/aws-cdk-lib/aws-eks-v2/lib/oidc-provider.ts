import type { Construct } from 'constructs';
import type { RemovalPolicy } from '../..';
import * as iam from '../../aws-iam';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

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

  /**
   * The removal policy to apply to the OpenID Connect Provider
   *
   * @default - RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Initialization properties for `OidcProviderNative`.
 */
export interface OidcProviderNativeProps extends OpenIdConnectProviderProps {}

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
 * @deprecated Use `OidcProviderNative` instead. This construct will be removed in a future major release.
 */
@propertyInjectable
export class OpenIdConnectProvider extends iam.OpenIdConnectProvider {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-eks-v2.OpenIdConnectProvider';

  /**
   * Defines an OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(scope: Construct, id: string, props: OpenIdConnectProviderProps) {
    const clientIds = ['sts.amazonaws.com'];

    super(scope, id, {
      url: props.url,
      clientIds,
      removalPolicy: props.removalPolicy,
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * IAM OIDC identity providers are entities in IAM that describe an external
 * identity provider (IdP) service that supports the OpenID Connect (OIDC)
 * standard, such as Google or Salesforce. You use an IAM OIDC identity provider
 * when you want to establish trust between an OIDC-compatible IdP and your AWS
 * account.
 *
 * This implementation uses the native CloudFormation resource and has default
 * values for thumbprints and clientIds props that will be compatible with the eks cluster.
 *
 * @see http://openid.net/connect
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
 *
 * @resource AWS::IAM::OIDCProvider
 */
@propertyInjectable
export class OidcProviderNative extends iam.OidcProviderNative {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-eks-v2.OidcProviderNative';

  /**
   * Defines a native OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(scope: Construct, id: string, props: OidcProviderNativeProps) {
    const clientIds = ['sts.amazonaws.com'];

    super(scope, id, {
      url: props.url,
      clientIds,
      removalPolicy: props.removalPolicy,
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}
