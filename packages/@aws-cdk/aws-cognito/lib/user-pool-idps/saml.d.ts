import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
/**
 * Properties to initialize UserPoolIdentityProviderSaml.
 */
export interface UserPoolIdentityProviderSamlProps extends UserPoolIdentityProviderProps {
    /**
     * The name of the provider. Must be between 3 and 32 characters.
     *
     * @default - the unique ID of the construct
     */
    readonly name?: string;
    /**
     * Identifiers
     *
     * Identifiers can be used to redirect users to the correct IdP in multitenant apps.
     *
     * @default - no identifiers used
     */
    readonly identifiers?: string[];
    /**
     * The SAML metadata.
     */
    readonly metadata: UserPoolIdentityProviderSamlMetadata;
    /**
     * Whether to enable the "Sign-out flow" feature.
     *
     * @default - false
     */
    readonly idpSignout?: boolean;
}
/**
 * Metadata types that can be used for a SAML user pool identity provider.
 */
export declare enum UserPoolIdentityProviderSamlMetadataType {
    /** Metadata provided via a URL. */
    URL = "url",
    /** Metadata provided via the contents of a file. */
    FILE = "file"
}
/**
 * Metadata for a SAML user pool identity provider.
 */
export declare class UserPoolIdentityProviderSamlMetadata {
    readonly metadataContent: string;
    readonly metadataType: UserPoolIdentityProviderSamlMetadataType;
    /**
     * Specify SAML metadata via a URL.
     */
    static url(url: string): UserPoolIdentityProviderSamlMetadata;
    /**
     * Specify SAML metadata via the contents of a file.
     */
    static file(fileContent: string): UserPoolIdentityProviderSamlMetadata;
    /**
     * Construct the metadata for a SAML identity provider.
     *
     * @param metadataContent A URL hosting SAML metadata, or the content of a file containing SAML metadata.
     * @param metadataType The type of metadata, either a URL or file content.
     */
    private constructor();
}
/**
 * Represents a identity provider that integrates with SAML.
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export declare class UserPoolIdentityProviderSaml extends UserPoolIdentityProviderBase {
    readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderSamlProps);
    private getProviderName;
    private validateName;
}
