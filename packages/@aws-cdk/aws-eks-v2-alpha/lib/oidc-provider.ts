import { RemovalPolicy } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
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

  /**
   * The removal policy to apply to the OpenID Connect Provider and the custom resource.
   *
   * @default - RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Initialization properties for `OpenIdConnectProviderNative`.
 */
// awslint:ignore:props-physical-name
export interface OpenIdConnectProviderNativeProps extends OpenIdConnectProviderProps {}

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
 * @deprecated Use `OpenIdConnectProviderNative` instead.
 */
@propertyInjectable
export class OpenIdConnectProvider extends iam.OpenIdConnectProvider {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-eks-v2-alpha.OpenIdConnectProvider';

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
 * Note: This class implements both `IOidcProvider` (native interface with `oidcProviderArn`)
 * and `IOpenIdConnectProvider` (custom resource interface with `openIdConnectProviderArn`)
 * to maintain compatibility with existing EKS cluster code that expects different attribute names.
 *
 * @see http://openid.net/connect
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
 *
 * @resource AWS::IAM::OIDCProvider
 */
@propertyInjectable
export class OpenIdConnectProviderNative extends iam.OidcProviderNative implements iam.IOpenIdConnectProvider {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-eks-v2-alpha.OpenIdConnectProviderNative';

  /**
   * The Amazon Resource Name (ARN) of the IAM OpenID Connect provider.
   */
  public get openIdConnectProviderArn(): string {
    return this.oidcProviderArn;
  }

  /**
   * The issuer for OIDC Provider
   */
  public get openIdConnectProviderIssuer(): string {
    return this.oidcProviderIssuer;
  }

  /**
   * The thumbprints configured for this provider.
   */
  public get openIdConnectProviderthumbprints(): string {
    return this.oidcProviderThumbprints;
  }

  /**
   * Defines a native OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(scope: Construct, id: string, props: OpenIdConnectProviderNativeProps) {
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
