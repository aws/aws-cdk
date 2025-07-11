import { Construct } from 'constructs';
import { CfnOIDCProvider } from './iam.generated';
import { Arn, IResource, Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Represents an IAM OpenID Connect provider.
 *
 */
export interface IOidcProvider extends IResource {
  /**
   * The Amazon Resource Name (ARN) of the IAM OpenID Connect provider.
   *
   * @attribute
   */
  readonly oidcProviderArn: string;

  /**
   * The issuer for OIDC Provider
   *
   * @attribute
   */
  readonly oidcProviderIssuer: string;
}

/**
 * Initialization properties for `OIDCProviderNative`.
 */
export interface OidcProviderNativeProps {
  /**
   * The name of the Native OIDC Provider.
   *
   * @default - A name is automatically generated.
   */
  readonly oidcProviderName?: string;

  /**
   * The URL of the identity provider. The URL must begin with https:// and
   * should correspond to the iss claim in the provider's OpenID Connect ID
   * tokens. Per the OIDC standard, path components are allowed but query
   * parameters are not. Typically the URL consists of only a hostname, like
   * https://server.example.org or https://example.com.
   *
   * You cannot register the same provider multiple times in a single AWS
   * account. If you try to submit a URL that has already been used for an
   * OpenID Connect provider in the AWS account, you will get an error.
   *
   * Warning: This URL cannot contain any port numbers
   */
  readonly url: string;

  /**
   * A list of client IDs (also known as audiences). When a mobile or web app
   * registers with an OpenID Connect provider, they establish a value that
   * identifies the application. (This is the value that's sent as the client_id
   * parameter on OAuth requests.)
   *
   * You can register multiple client IDs with the same provider. For example,
   * you might have multiple applications that use the same OIDC provider. You
   * cannot register more than 100 client IDs with a single IAM OIDC provider.
   *
   * Client IDs are up to 255 characters long.
   *
   * @default - no clients are allowed
   */
  readonly clientIds?: string[];

  /**
   * A list of server certificate thumbprints for the OpenID Connect (OIDC)
   * identity provider's server certificates.
   *
   * Typically this list includes only 1 entry or empty. However, IAM lets
   * you have up to 5 thumbprints for an OIDC provider. This lets you maintain
   * multiple thumbprints if the identity provider is rotating certificates.
   *
   * The server certificate thumbprint is the hex-encoded SHA-1 hash value of
   * the X.509 certificate used by the domain where the OpenID Connect provider
   * makes its keys available. It is always a 40-character string.
   *
   * For example, assume that the OIDC provider is server.example.com and the
   * provider stores its keys at https://keys.server.example.com/openid-connect.
   * In that case, the thumbprint string would be the hex-encoded SHA-1 hash
   * value of the certificate used by https://keys.server.example.com.
   *
   * This property is optional. If it is not included, IAM will retrieve and use
   * the top intermediate certificate authority (CA) thumbprint of the OpenID
   * Connect identity provider server certificate.
   *
   * Obtain the thumbprint of the root certificate authority from the provider's
   * server as described in https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
   *
   * @default - no thumbprints are allowed. IAM will retrieve and use thumbprint
   * of idenity provider server cerctificate
   */
  readonly thumbprints?: string[];
}

/**
 * IAM OIDC identity providers are entities in IAM that describe an external
 * identity provider (IdP) service that supports the OpenID Connect (OIDC)
 * standard, such as Google or Salesforce. You use an IAM OIDC identity provider
 * when you want to establish trust between an OIDC-compatible IdP and your AWS
 * account. This is useful when creating a mobile app or web application that
 * requires access to AWS resources, but you don't want to create custom sign-in
 * code or manage your own user identities.
 *
 * @see http://openid.net/connect
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html
 *
 * @resource AWS::IAM::OIDCProvider
 */
@propertyInjectable
export class OidcProviderNative extends Resource implements IOidcProvider {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-iam.OidcProviderNative';

  /**
   * Imports an Open ID connect provider from an ARN.
   * @param scope The definition scope
   * @param id ID of the construct
   * @param oidcProviderArn the ARN to import
   */
  public static fromOidcProviderArn(
    scope: Construct,
    id: string,
    oidcProviderArn: string,
  ): IOidcProvider {
    const resourceName = Arn.extractResourceName(
      oidcProviderArn,
      'oidc-provider',
    );

    class Import extends Resource implements IOidcProvider {
      public readonly oidcProviderArn = oidcProviderArn;
      public readonly oidcProviderIssuer = resourceName;
    }

    return new Import(scope, id);
  }

  /**
   * The Amazon Resource Name (ARN) of the Native IAM OpenID Connect provider.
   *
   * @attribute
   */
  public readonly oidcProviderArn: string;

  /**
   * The issuer for the Native OIDC Provider
   *
   * @attribute
   */
  public readonly oidcProviderIssuer: string;

  /**
   * The thumbprints configured for this provider.
   *
   * @attribute
   */
  public readonly oidcProviderThumbprints: string;

  /**
   * Defines a Native OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(
    scope: Construct,
    id: string,
    props: OidcProviderNativeProps,
  ) {
    super(scope, id, {
      physicalName: props.oidcProviderName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (!props.url.startsWith('https://')) {
      throw new ValidationError(
        'The URL of the identity provider must start with https://', scope,
      );
    }

    // maximum length of url is 255 characters
    if (props.url.length > 255) {
      throw new ValidationError('The maximum length allowed for url is 255 characters', scope);
    }

    // clientids cannot be more than 100
    if (props.clientIds && props.clientIds.length > 100) {
      throw new ValidationError('The maximum number of clients that can be registered is 100', scope);
    }

    // clientId max length is 255
    if (props.clientIds?.some((clientId) => clientId.length > 255)) {
      throw new ValidationError('The maximum length of a client ID is 255 characters', scope);
    }

    // thumbprints[] is optional, but if provided, must be 5 or less
    if (props.thumbprints && props.thumbprints.length > 5) {
      throw new ValidationError('The maximum number of thumbprints is 5', scope);
    }

    // thumbprint length is 40
    if (props.thumbprints?.some((thumbprint) => thumbprint.length !== 40)) {
      throw new ValidationError('The length of a thumbprint must be 40 characters', scope);
    }

    // thumbprint must be hex
    if (props.thumbprints?.some((thumbprint) => !/^[0-9a-fA-F]+$/.test(thumbprint))) {
      throw new ValidationError('All thumbprints must be in hexadecimal format', scope);
    }

    const resource = new CfnOIDCProvider(this, 'Resource', {
      url: props.url,
      clientIdList: props.clientIds,
      thumbprintList: props.thumbprints,
    });

    this.oidcProviderArn = Token.asString(resource.ref);
    this.oidcProviderIssuer = Arn.extractResourceName(
      this.oidcProviderArn,
      'oidc-provider',
    );

    this.oidcProviderThumbprints = Token.asString(props.thumbprints);
  }
}
