import { Construct } from 'constructs';
import {
  Arn,
  CustomResource,
  IResource,
  Resource,
  Token,
} from '../../core';
import { OidcProvider } from '../../custom-resource-handlers/dist/aws-iam/oidc-provider.generated';

const RESOURCE_TYPE = 'Custom::AWSCDKOpenIdConnectProvider';

/**
 * Represents an IAM OpenID Connect provider.
 *
 */
export interface IOpenIdConnectProvider extends IResource {
  /**
   * The Amazon Resource Name (ARN) of the IAM OpenID Connect provider.
   */
  readonly openIdConnectProviderArn: string;

  /**
   * The issuer for OIDC Provider
   */
  readonly openIdConnectProviderIssuer: string;
}

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
   * You cannot register the same provider multiple times in a single AWS
   * account. If you try to submit a URL that has already been used for an
   * OpenID Connect provider in the AWS account, you will get an error.
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
   * Typically this list includes only one entry. However, IAM lets you have up
   * to five thumbprints for an OIDC provider. This lets you maintain multiple
   * thumbprints if the identity provider is rotating certificates.
   *
   * The server certificate thumbprint is the hex-encoded SHA-1 hash value of
   * the X.509 certificate used by the domain where the OpenID Connect provider
   * makes its keys available. It is always a 40-character string.
   *
   * You must provide at least one thumbprint when creating an IAM OIDC
   * provider. For example, assume that the OIDC provider is server.example.com
   * and the provider stores its keys at
   * https://keys.server.example.com/openid-connect. In that case, the
   * thumbprint string would be the hex-encoded SHA-1 hash value of the
   * certificate used by https://keys.server.example.com.
   *
   * @default - If no thumbprints are specified (an empty array or `undefined`),
   * the thumbprint of the root certificate authority will be obtained from the
   * provider's server as described in https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
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
 * @resource AWS::CloudFormation::CustomResource
 */
export class OpenIdConnectProvider extends Resource implements IOpenIdConnectProvider {
  /**
   * Imports an Open ID connect provider from an ARN.
   * @param scope The definition scope
   * @param id ID of the construct
   * @param openIdConnectProviderArn the ARN to import
   */
  public static fromOpenIdConnectProviderArn(scope: Construct, id: string, openIdConnectProviderArn: string): IOpenIdConnectProvider {
    const resourceName = Arn.extractResourceName(openIdConnectProviderArn, 'oidc-provider');

    class Import extends Resource implements IOpenIdConnectProvider {
      public readonly openIdConnectProviderArn = openIdConnectProviderArn;
      public readonly openIdConnectProviderIssuer = resourceName;
    }

    return new Import(scope, id);
  }

  /**
   * The Amazon Resource Name (ARN) of the IAM OpenID Connect provider.
   */
  public readonly openIdConnectProviderArn: string;

  public readonly openIdConnectProviderIssuer: string;

  /**
   * The thumbprints configured for this provider.
   */
  public readonly openIdConnectProviderthumbprints: string;

  /**
   * Defines an OpenID Connect provider.
   * @param scope The definition scope
   * @param id Construct ID
   * @param props Initialization properties
   */
  public constructor(scope: Construct, id: string, props: OpenIdConnectProviderProps) {
    super(scope, id);

    const provider = this.getOrCreateProvider();
    const resource = new CustomResource(this, 'Resource', {
      resourceType: RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        ClientIDList: props.clientIds,
        ThumbprintList: props.thumbprints,
        Url: props.url,

        // code changes can cause thumbprint changes in case they weren't explicitly provided.
        // add the code hash as a property so that CFN invokes the UPDATE handler in these cases,
        // thus updating the thumbprint if necessary.
        CodeHash: provider.codeHash,
      },
    });

    this.openIdConnectProviderArn = Token.asString(resource.ref);
    this.openIdConnectProviderIssuer = Arn.extractResourceName(this.openIdConnectProviderArn, 'oidc-provider');
    this.openIdConnectProviderthumbprints = Token.asString(resource.getAtt('Thumbprints'));
  }

  private getOrCreateProvider() {
    return OidcProvider.getOrCreateProvider(this, RESOURCE_TYPE, {
      policyStatements: [
        {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'iam:CreateOpenIDConnectProvider',
            'iam:DeleteOpenIDConnectProvider',
            'iam:UpdateOpenIDConnectProviderThumbprint',
            'iam:AddClientIDToOpenIDConnectProvider',
            'iam:RemoveClientIDFromOpenIDConnectProvider',
          ],
        },
      ],
    });
  }
}
