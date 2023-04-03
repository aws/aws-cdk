import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnIdentityPool`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html
 */
export interface CfnIdentityPoolProps {
    /**
     * Specifies whether the identity pool supports unauthenticated logins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowunauthenticatedidentities
     */
    readonly allowUnauthenticatedIdentities: boolean | cdk.IResolvable;
    /**
     * Enables the Basic (Classic) authentication flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowclassicflow
     */
    readonly allowClassicFlow?: boolean | cdk.IResolvable;
    /**
     * The events to configure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoevents
     */
    readonly cognitoEvents?: any | cdk.IResolvable;
    /**
     * The Amazon Cognito user pools and their client IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoidentityproviders
     */
    readonly cognitoIdentityProviders?: Array<CfnIdentityPool.CognitoIdentityProviderProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Configuration options for configuring Amazon Cognito streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitostreams
     */
    readonly cognitoStreams?: CfnIdentityPool.CognitoStreamsProperty | cdk.IResolvable;
    /**
     * The "domain" Amazon Cognito uses when referencing your users. This name acts as a placeholder that allows your backend and the Amazon Cognito service to communicate about the developer provider. For the `DeveloperProviderName` , you can use letters and periods (.), underscores (_), and dashes (-).
     *
     * *Minimum length* : 1
     *
     * *Maximum length* : 100
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-developerprovidername
     */
    readonly developerProviderName?: string;
    /**
     * The name of your Amazon Cognito identity pool.
     *
     * *Minimum length* : 1
     *
     * *Maximum length* : 128
     *
     * *Pattern* : `[\w\s+=,.@-]+`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-identitypoolname
     */
    readonly identityPoolName?: string;
    /**
     * The Amazon Resource Names (ARNs) of the OpenID connect providers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-openidconnectproviderarns
     */
    readonly openIdConnectProviderArns?: string[];
    /**
     * The configuration options to be applied to the identity pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-pushsync
     */
    readonly pushSync?: CfnIdentityPool.PushSyncProperty | cdk.IResolvable;
    /**
     * The Amazon Resource Names (ARNs) of the Security Assertion Markup Language (SAML) providers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-samlproviderarns
     */
    readonly samlProviderArns?: string[];
    /**
     * Key-value pairs that map provider names to provider app IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-supportedloginproviders
     */
    readonly supportedLoginProviders?: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::IdentityPool`
 *
 * The `AWS::Cognito::IdentityPool` resource creates an Amazon Cognito identity pool.
 *
 * To avoid deleting the resource accidentally from AWS CloudFormation , use [DeletionPolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html) and the [UpdateReplacePolicy Attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html) to retain the resource on deletion or replacement.
 *
 * @cloudformationResource AWS::Cognito::IdentityPool
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html
 */
export declare class CfnIdentityPool extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::IdentityPool";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityPool;
    /**
     * The name of the Amazon Cognito identity pool, returned as a string.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * Specifies whether the identity pool supports unauthenticated logins.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowunauthenticatedidentities
     */
    allowUnauthenticatedIdentities: boolean | cdk.IResolvable;
    /**
     * Enables the Basic (Classic) authentication flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowclassicflow
     */
    allowClassicFlow: boolean | cdk.IResolvable | undefined;
    /**
     * The events to configure.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoevents
     */
    cognitoEvents: any | cdk.IResolvable | undefined;
    /**
     * The Amazon Cognito user pools and their client IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoidentityproviders
     */
    cognitoIdentityProviders: Array<CfnIdentityPool.CognitoIdentityProviderProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Configuration options for configuring Amazon Cognito streams.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitostreams
     */
    cognitoStreams: CfnIdentityPool.CognitoStreamsProperty | cdk.IResolvable | undefined;
    /**
     * The "domain" Amazon Cognito uses when referencing your users. This name acts as a placeholder that allows your backend and the Amazon Cognito service to communicate about the developer provider. For the `DeveloperProviderName` , you can use letters and periods (.), underscores (_), and dashes (-).
     *
     * *Minimum length* : 1
     *
     * *Maximum length* : 100
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-developerprovidername
     */
    developerProviderName: string | undefined;
    /**
     * The name of your Amazon Cognito identity pool.
     *
     * *Minimum length* : 1
     *
     * *Maximum length* : 128
     *
     * *Pattern* : `[\w\s+=,.@-]+`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-identitypoolname
     */
    identityPoolName: string | undefined;
    /**
     * The Amazon Resource Names (ARNs) of the OpenID connect providers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-openidconnectproviderarns
     */
    openIdConnectProviderArns: string[] | undefined;
    /**
     * The configuration options to be applied to the identity pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-pushsync
     */
    pushSync: CfnIdentityPool.PushSyncProperty | cdk.IResolvable | undefined;
    /**
     * The Amazon Resource Names (ARNs) of the Security Assertion Markup Language (SAML) providers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-samlproviderarns
     */
    samlProviderArns: string[] | undefined;
    /**
     * Key-value pairs that map provider names to provider app IDs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-supportedloginproviders
     */
    supportedLoginProviders: any | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::IdentityPool`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIdentityPoolProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnIdentityPool {
    /**
     * `CognitoIdentityProvider` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that represents an Amazon Cognito user pool and its client ID.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html
     */
    interface CognitoIdentityProviderProperty {
        /**
         * The client ID for the Amazon Cognito user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-clientid
         */
        readonly clientId?: string;
        /**
         * The provider name for an Amazon Cognito user pool. For example: `cognito-idp.us-east-2.amazonaws.com/us-east-2_123456789` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-providername
         */
        readonly providerName?: string;
        /**
         * TRUE if server-side token validation is enabled for the identity provider’s token.
         *
         * After you set the `ServerSideTokenCheck` to TRUE for an identity pool, that identity pool checks with the integrated user pools to make sure the user has not been globally signed out or deleted before the identity pool provides an OIDC token or AWS credentials for the user.
         *
         * If the user is signed out or deleted, the identity pool returns a 400 Not Authorized error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-serversidetokencheck
         */
        readonly serverSideTokenCheck?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnIdentityPool {
    /**
     * `CognitoStreams` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that defines configuration options for Amazon Cognito streams.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html
     */
    interface CognitoStreamsProperty {
        /**
         * The Amazon Resource Name (ARN) of the role Amazon Cognito can assume to publish to the stream. This role must grant access to Amazon Cognito (cognito-sync) to invoke `PutRecord` on your Amazon Cognito stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-rolearn
         */
        readonly roleArn?: string;
        /**
         * The name of the Amazon Cognito stream to receive updates. This stream must be in the developer's account and in the same Region as the identity pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamname
         */
        readonly streamName?: string;
        /**
         * Status of the Amazon Cognito streams. Valid values are: `ENABLED` or `DISABLED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamingstatus
         */
        readonly streamingStatus?: string;
    }
}
export declare namespace CfnIdentityPool {
    /**
     * `PushSync` is a property of the [AWS::Cognito::IdentityPool](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html) resource that defines the configuration options to be applied to an Amazon Cognito identity pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html
     */
    interface PushSyncProperty {
        /**
         * The ARNs of the Amazon SNS platform applications that could be used by clients.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html#cfn-cognito-identitypool-pushsync-applicationarns
         */
        readonly applicationArns?: string[];
        /**
         * An IAM role configured to allow Amazon Cognito to call Amazon SNS on behalf of the developer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-pushsync.html#cfn-cognito-identitypool-pushsync-rolearn
         */
        readonly roleArn?: string;
    }
}
/**
 * Properties for defining a `CfnIdentityPoolRoleAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export interface CfnIdentityPoolRoleAttachmentProps {
    /**
     * An identity pool ID in the format `REGION:GUID` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-identitypoolid
     */
    readonly identityPoolId: string;
    /**
     * How users for a specific identity provider are mapped to roles. This is a string to the `RoleMapping` object map. The string identifies the identity provider. For example: `graph.facebook.com` or `cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id` .
     *
     * If the `IdentityProvider` field isn't provided in this object, the string is used as the identity provider name.
     *
     * For more information, see the [RoleMapping property](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-rolemappings
     */
    readonly roleMappings?: {
        [key: string]: (CfnIdentityPoolRoleAttachment.RoleMappingProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The map of the roles associated with this pool. For a given role, the key is either "authenticated" or "unauthenticated". The value is the role ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-roles
     */
    readonly roles?: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::IdentityPoolRoleAttachment`
 *
 * The `AWS::Cognito::IdentityPoolRoleAttachment` resource manages the role configuration for an Amazon Cognito identity pool.
 *
 * @cloudformationResource AWS::Cognito::IdentityPoolRoleAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export declare class CfnIdentityPoolRoleAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::IdentityPoolRoleAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityPoolRoleAttachment;
    /**
     * An identity pool ID in the format `REGION:GUID` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-identitypoolid
     */
    identityPoolId: string;
    /**
     * How users for a specific identity provider are mapped to roles. This is a string to the `RoleMapping` object map. The string identifies the identity provider. For example: `graph.facebook.com` or `cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id` .
     *
     * If the `IdentityProvider` field isn't provided in this object, the string is used as the identity provider name.
     *
     * For more information, see the [RoleMapping property](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-rolemappings
     */
    roleMappings: {
        [key: string]: (CfnIdentityPoolRoleAttachment.RoleMappingProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The map of the roles associated with this pool. For a given role, the key is either "authenticated" or "unauthenticated". The value is the role ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html#cfn-cognito-identitypoolroleattachment-roles
     */
    roles: any | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::IdentityPoolRoleAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIdentityPoolRoleAttachmentProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnIdentityPoolRoleAttachment {
    /**
     * Defines how to map a claim to a role ARN.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html
     */
    interface MappingRuleProperty {
        /**
         * The claim name that must be present in the token. For example: "isAdmin" or "paid".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-claim
         */
        readonly claim: string;
        /**
         * The match condition that specifies how closely the claim value in the IdP token must match `Value` .
         *
         * Valid values are: `Equals` , `Contains` , `StartsWith` , and `NotEqual` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-matchtype
         */
        readonly matchType: string;
        /**
         * The Amazon Resource Name (ARN) of the role.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-rolearn
         */
        readonly roleArn: string;
        /**
         * A brief string that the claim must match. For example, "paid" or "yes".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-mappingrule.html#cfn-cognito-identitypoolroleattachment-mappingrule-value
         */
        readonly value: string;
    }
}
export declare namespace CfnIdentityPoolRoleAttachment {
    /**
     * `RoleMapping` is a property of the [AWS::Cognito::IdentityPoolRoleAttachment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html) resource that defines the role-mapping attributes of an Amazon Cognito identity pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html
     */
    interface RoleMappingProperty {
        /**
         * Specifies the action to be taken if either no rules match the claim value for the Rules type, or there is no `cognito:preferred_role` claim and there are multiple `cognito:roles` matches for the Token type. If you specify Token or Rules as the Type, AmbiguousRoleResolution is required.
         *
         * Valid values are `AuthenticatedRole` or `Deny` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-ambiguousroleresolution
         */
        readonly ambiguousRoleResolution?: string;
        /**
         * Identifier for the identity provider for which the role is mapped. For example: `graph.facebook.com` or `cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id (http://cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id)` . This is the identity provider that is used by the user for authentication.
         *
         * If the identity provider property isn't provided, the key of the entry in the `RoleMappings` map is used as the identity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-identityprovider
         */
        readonly identityProvider?: string;
        /**
         * The rules to be used for mapping users to roles. If you specify "Rules" as the role-mapping type, RulesConfiguration is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-rulesconfiguration
         */
        readonly rulesConfiguration?: CfnIdentityPoolRoleAttachment.RulesConfigurationTypeProperty | cdk.IResolvable;
        /**
         * The role-mapping type. `Token` uses `cognito:roles` and `cognito:preferred_role` claims from the Amazon Cognito identity provider token to map groups to roles. `Rules` attempts to match claims from the token to map to a role.
         *
         * Valid values are `Token` or `Rules` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html#cfn-cognito-identitypoolroleattachment-rolemapping-type
         */
        readonly type: string;
    }
}
export declare namespace CfnIdentityPoolRoleAttachment {
    /**
     * `RulesConfigurationType` is a subproperty of the [RoleMapping](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rolemapping.html) property that defines the rules to be used for mapping users to roles.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html
     */
    interface RulesConfigurationTypeProperty {
        /**
         * The rules. You can specify up to 25 rules per identity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypoolroleattachment-rulesconfigurationtype.html#cfn-cognito-identitypoolroleattachment-rulesconfigurationtype-rules
         */
        readonly rules: Array<CfnIdentityPoolRoleAttachment.MappingRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnUserPool`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html
 */
export interface CfnUserPoolProps {
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` . It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-accountrecoverysetting
     */
    readonly accountRecoverySetting?: CfnUserPool.AccountRecoverySettingProperty | cdk.IResolvable;
    /**
     * The configuration for creating a new user profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-admincreateuserconfig
     */
    readonly adminCreateUserConfig?: CfnUserPool.AdminCreateUserConfigProperty | cdk.IResolvable;
    /**
     * Attributes supported as an alias for this user pool. Possible values: *phone_number* , *email* , or *preferred_username* .
     *
     * > This user pool property cannot be updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-aliasattributes
     */
    readonly aliasAttributes?: string[];
    /**
     * The attributes to be auto-verified. Possible values: *email* , *phone_number* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-autoverifiedattributes
     */
    readonly autoVerifiedAttributes?: string[];
    /**
     * `AWS::Cognito::UserPool.DeletionProtection`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deletionprotection
     */
    readonly deletionProtection?: string;
    /**
     * The device-remembering configuration for a user pool. A null value indicates that you have deactivated device remembering in your user pool.
     *
     * > When you provide a value for any `DeviceConfiguration` field, you activate the Amazon Cognito device-remembering feature.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deviceconfiguration
     */
    readonly deviceConfiguration?: CfnUserPool.DeviceConfigurationProperty | cdk.IResolvable;
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, AWS Region, and sender for messages from your user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailconfiguration
     */
    readonly emailConfiguration?: CfnUserPool.EmailConfigurationProperty | cdk.IResolvable;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationmessage
     */
    readonly emailVerificationMessage?: string;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationsubject
     */
    readonly emailVerificationSubject?: string;
    /**
     * Enables MFA on a specified user pool. To disable all MFAs after it has been enabled, set MfaConfiguration to “OFF” and remove EnabledMfas. MFAs can only be all disabled if MfaConfiguration is OFF. Once SMS_MFA is enabled, SMS_MFA can only be disabled by setting MfaConfiguration to “OFF”. Can be one of the following values:
     *
     * - `SMS_MFA` - Enables SMS MFA for the user pool. SMS_MFA can only be enabled if SMS configuration is provided.
     * - `SOFTWARE_TOKEN_MFA` - Enables software token MFA for the user pool.
     *
     * Allowed values: `SMS_MFA` | `SOFTWARE_TOKEN_MFA`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-enabledmfas
     */
    readonly enabledMfas?: string[];
    /**
     * The Lambda trigger configuration information for the new user pool.
     *
     * > In a push model, event sources (such as Amazon S3 and custom applications) need permission to invoke a function. So you must make an extra call to add permission for these event sources to invoke your Lambda function.
     * >
     * > For more information on using the Lambda API to add permission, see [AddPermission](https://docs.aws.amazon.com/lambda/latest/dg/API_AddPermission.html) .
     * >
     * > For adding permission using the AWS CLI , see [add-permission](https://docs.aws.amazon.com/cli/latest/reference/lambda/add-permission.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-lambdaconfig
     */
    readonly lambdaConfig?: CfnUserPool.LambdaConfigProperty | cdk.IResolvable;
    /**
     * The multi-factor authentication (MFA) configuration. Valid values include:
     *
     * - `OFF` MFA won't be used for any users.
     * - `ON` MFA is required for all users to sign in.
     * - `OPTIONAL` MFA will be required only for individual users who have an MFA factor activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-mfaconfiguration
     */
    readonly mfaConfiguration?: string;
    /**
     * The policy associated with a user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-policies
     */
    readonly policies?: CfnUserPool.PoliciesProperty | cdk.IResolvable;
    /**
     * The schema attributes for the new user pool. These attributes can be standard or custom attributes.
     *
     * > During a user pool update, you can add new schema attributes but you cannot modify or delete an existing schema attribute.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-schema
     */
    readonly schema?: Array<CfnUserPool.SchemaAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A string representing the SMS authentication message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsauthenticationmessage
     */
    readonly smsAuthenticationMessage?: string;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your AWS account through Amazon Simple Notification Service. To send SMS messages with Amazon SNS in the AWS Region that you want, the Amazon Cognito user pool uses an AWS Identity and Access Management (IAM) role in your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsconfiguration
     */
    readonly smsConfiguration?: CfnUserPool.SmsConfigurationProperty | cdk.IResolvable;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsverificationmessage
     */
    readonly smsVerificationMessage?: string;
    /**
     * The settings for updates to user attributes. These settings include the property `AttributesRequireVerificationBeforeUpdate` ,
     * a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For
     * more information, see [Verifying updates to email addresses and phone numbers](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html#user-pool-settings-verifications-verify-attribute-updates) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userattributeupdatesettings
     */
    readonly userAttributeUpdateSettings?: CfnUserPool.UserAttributeUpdateSettingsProperty | cdk.IResolvable;
    /**
     * Determines whether email addresses or phone numbers can be specified as user names when a user signs up. Possible values: `phone_number` or `email` .
     *
     * This user pool property cannot be updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameattributes
     */
    readonly usernameAttributes?: string[];
    /**
     * You can choose to set case sensitivity on the username input for the selected sign-in option. For example, when this is set to `False` , users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameconfiguration
     */
    readonly usernameConfiguration?: CfnUserPool.UsernameConfigurationProperty | cdk.IResolvable;
    /**
     * Enables advanced security risk detection. Set the key `AdvancedSecurityMode` to the value "AUDIT".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooladdons
     */
    readonly userPoolAddOns?: CfnUserPool.UserPoolAddOnsProperty | cdk.IResolvable;
    /**
     * A string used to name the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpoolname
     */
    readonly userPoolName?: string;
    /**
     * The tag keys and values to assign to the user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooltags
     */
    readonly userPoolTags?: any;
    /**
     * The template for the verification message that the user sees when the app requests permission to access the user's information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-verificationmessagetemplate
     */
    readonly verificationMessageTemplate?: CfnUserPool.VerificationMessageTemplateProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPool`
 *
 * The `AWS::Cognito::UserPool` resource creates an Amazon Cognito user pool. For more information on working with Amazon Cognito user pools, see [Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and [CreateUserPool](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPool.html) .
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPool
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html
 */
export declare class CfnUserPool extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPool";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPool;
    /**
     * The Amazon Resource Name (ARN) of the user pool, such as `arn:aws:cognito-idp:us-east-1:123412341234:userpool/us-east-1_123412341` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The provider name of the Amazon Cognito user pool, specified as a `String` .
     * @cloudformationAttribute ProviderName
     */
    readonly attrProviderName: string;
    /**
     * The URL of the provider of the Amazon Cognito user pool, specified as a `String` .
     * @cloudformationAttribute ProviderURL
     */
    readonly attrProviderUrl: string;
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` . It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-accountrecoverysetting
     */
    accountRecoverySetting: CfnUserPool.AccountRecoverySettingProperty | cdk.IResolvable | undefined;
    /**
     * The configuration for creating a new user profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-admincreateuserconfig
     */
    adminCreateUserConfig: CfnUserPool.AdminCreateUserConfigProperty | cdk.IResolvable | undefined;
    /**
     * Attributes supported as an alias for this user pool. Possible values: *phone_number* , *email* , or *preferred_username* .
     *
     * > This user pool property cannot be updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-aliasattributes
     */
    aliasAttributes: string[] | undefined;
    /**
     * The attributes to be auto-verified. Possible values: *email* , *phone_number* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-autoverifiedattributes
     */
    autoVerifiedAttributes: string[] | undefined;
    /**
     * `AWS::Cognito::UserPool.DeletionProtection`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deletionprotection
     */
    deletionProtection: string | undefined;
    /**
     * The device-remembering configuration for a user pool. A null value indicates that you have deactivated device remembering in your user pool.
     *
     * > When you provide a value for any `DeviceConfiguration` field, you activate the Amazon Cognito device-remembering feature.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deviceconfiguration
     */
    deviceConfiguration: CfnUserPool.DeviceConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, AWS Region, and sender for messages from your user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailconfiguration
     */
    emailConfiguration: CfnUserPool.EmailConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationmessage
     */
    emailVerificationMessage: string | undefined;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationsubject
     */
    emailVerificationSubject: string | undefined;
    /**
     * Enables MFA on a specified user pool. To disable all MFAs after it has been enabled, set MfaConfiguration to “OFF” and remove EnabledMfas. MFAs can only be all disabled if MfaConfiguration is OFF. Once SMS_MFA is enabled, SMS_MFA can only be disabled by setting MfaConfiguration to “OFF”. Can be one of the following values:
     *
     * - `SMS_MFA` - Enables SMS MFA for the user pool. SMS_MFA can only be enabled if SMS configuration is provided.
     * - `SOFTWARE_TOKEN_MFA` - Enables software token MFA for the user pool.
     *
     * Allowed values: `SMS_MFA` | `SOFTWARE_TOKEN_MFA`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-enabledmfas
     */
    enabledMfas: string[] | undefined;
    /**
     * The Lambda trigger configuration information for the new user pool.
     *
     * > In a push model, event sources (such as Amazon S3 and custom applications) need permission to invoke a function. So you must make an extra call to add permission for these event sources to invoke your Lambda function.
     * >
     * > For more information on using the Lambda API to add permission, see [AddPermission](https://docs.aws.amazon.com/lambda/latest/dg/API_AddPermission.html) .
     * >
     * > For adding permission using the AWS CLI , see [add-permission](https://docs.aws.amazon.com/cli/latest/reference/lambda/add-permission.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-lambdaconfig
     */
    lambdaConfig: CfnUserPool.LambdaConfigProperty | cdk.IResolvable | undefined;
    /**
     * The multi-factor authentication (MFA) configuration. Valid values include:
     *
     * - `OFF` MFA won't be used for any users.
     * - `ON` MFA is required for all users to sign in.
     * - `OPTIONAL` MFA will be required only for individual users who have an MFA factor activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-mfaconfiguration
     */
    mfaConfiguration: string | undefined;
    /**
     * The policy associated with a user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-policies
     */
    policies: CfnUserPool.PoliciesProperty | cdk.IResolvable | undefined;
    /**
     * The schema attributes for the new user pool. These attributes can be standard or custom attributes.
     *
     * > During a user pool update, you can add new schema attributes but you cannot modify or delete an existing schema attribute.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-schema
     */
    schema: Array<CfnUserPool.SchemaAttributeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A string representing the SMS authentication message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsauthenticationmessage
     */
    smsAuthenticationMessage: string | undefined;
    /**
     * The SMS configuration with the settings that your Amazon Cognito user pool must use to send an SMS message from your AWS account through Amazon Simple Notification Service. To send SMS messages with Amazon SNS in the AWS Region that you want, the Amazon Cognito user pool uses an AWS Identity and Access Management (IAM) role in your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsconfiguration
     */
    smsConfiguration: CfnUserPool.SmsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * This parameter is no longer used. See [VerificationMessageTemplateType](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerificationMessageTemplateType.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsverificationmessage
     */
    smsVerificationMessage: string | undefined;
    /**
     * The settings for updates to user attributes. These settings include the property `AttributesRequireVerificationBeforeUpdate` ,
     * a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For
     * more information, see [Verifying updates to email addresses and phone numbers](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html#user-pool-settings-verifications-verify-attribute-updates) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userattributeupdatesettings
     */
    userAttributeUpdateSettings: CfnUserPool.UserAttributeUpdateSettingsProperty | cdk.IResolvable | undefined;
    /**
     * Determines whether email addresses or phone numbers can be specified as user names when a user signs up. Possible values: `phone_number` or `email` .
     *
     * This user pool property cannot be updated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameattributes
     */
    usernameAttributes: string[] | undefined;
    /**
     * You can choose to set case sensitivity on the username input for the selected sign-in option. For example, when this is set to `False` , users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameconfiguration
     */
    usernameConfiguration: CfnUserPool.UsernameConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Enables advanced security risk detection. Set the key `AdvancedSecurityMode` to the value "AUDIT".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooladdons
     */
    userPoolAddOns: CfnUserPool.UserPoolAddOnsProperty | cdk.IResolvable | undefined;
    /**
     * A string used to name the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpoolname
     */
    userPoolName: string | undefined;
    /**
     * The tag keys and values to assign to the user pool. A tag is a label that you can use to categorize and manage user pools in different ways, such as by purpose, owner, environment, or other criteria.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooltags
     */
    readonly tags: cdk.TagManager;
    /**
     * The template for the verification message that the user sees when the app requests permission to access the user's information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-verificationmessagetemplate
     */
    verificationMessageTemplate: CfnUserPool.VerificationMessageTemplateProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPool`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnUserPoolProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPool {
    /**
     * Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword` . It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-accountrecoverysetting.html
     */
    interface AccountRecoverySettingProperty {
        /**
         * The list of `RecoveryOptionTypes` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-accountrecoverysetting.html#cfn-cognito-userpool-accountrecoverysetting-recoverymechanisms
         */
        readonly recoveryMechanisms?: Array<CfnUserPool.RecoveryOptionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnUserPool {
    /**
     * The configuration for `AdminCreateUser` requests.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html
     */
    interface AdminCreateUserConfigProperty {
        /**
         * Set to `True` if only the administrator is allowed to create user profiles. Set to `False` if users can sign themselves up via an app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-allowadmincreateuseronly
         */
        readonly allowAdminCreateUserOnly?: boolean | cdk.IResolvable;
        /**
         * The message template to be used for the welcome message to new users.
         *
         * See also [Customizing User Invitation Messages](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-customizations.html#cognito-user-pool-settings-user-invitation-message-customization) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-invitemessagetemplate
         */
        readonly inviteMessageTemplate?: CfnUserPool.InviteMessageTemplateProperty | cdk.IResolvable;
        /**
         * The user account expiration limit, in days, after which a new account that hasn't signed in is no longer usable. To reset the account after that time limit, you must call `AdminCreateUser` again, specifying `"RESEND"` for the `MessageAction` parameter. The default value for this parameter is 7.
         *
         * > If you set a value for `TemporaryPasswordValidityDays` in `PasswordPolicy` , that value will be used, and `UnusedAccountValidityDays` will be no longer be an available parameter for that user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-admincreateuserconfig.html#cfn-cognito-userpool-admincreateuserconfig-unusedaccountvaliditydays
         */
        readonly unusedAccountValidityDays?: number;
    }
}
export declare namespace CfnUserPool {
    /**
     * A custom email sender AWS Lambda trigger.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html
     */
    interface CustomEmailSenderProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Cognito triggers to send email notifications to users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html#cfn-cognito-userpool-customemailsender-lambdaarn
         */
        readonly lambdaArn?: string;
        /**
         * The Lambda version represents the signature of the "request" attribute in the "event" information that Amazon Cognito passes to your custom email sender AWS Lambda function. The only supported value is `V1_0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customemailsender.html#cfn-cognito-userpool-customemailsender-lambdaversion
         */
        readonly lambdaVersion?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * A custom SMS sender AWS Lambda trigger.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html
     */
    interface CustomSMSSenderProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS Lambda function that Amazon Cognito triggers to send SMS notifications to users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html#cfn-cognito-userpool-customsmssender-lambdaarn
         */
        readonly lambdaArn?: string;
        /**
         * The Lambda version represents the signature of the "request" attribute in the "event" information Amazon Cognito passes to your custom SMS sender Lambda function. The only supported value is `V1_0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-customsmssender.html#cfn-cognito-userpool-customsmssender-lambdaversion
         */
        readonly lambdaVersion?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The device-remembering configuration for a user pool. A [DescribeUserPool](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_DescribeUserPool.html) request returns a null value for this object when the user pool isn't configured to remember devices. When device remembering is active, you can remember a user's device with a [ConfirmDevice](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmDevice.html) API request. Additionally. when the property `DeviceOnlyRememberedOnUserPrompt` is `true` , you must follow `ConfirmDevice` with an [UpdateDeviceStatus](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UpdateDeviceStatus.html) API request that sets the user's device to `remembered` or `not_remembered` .
     *
     * To sign in with a remembered device, include `DEVICE_KEY` in the authentication parameters in your user's [InitiateAuth](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html) request. If your app doesn't include a `DEVICE_KEY` parameter, the [response](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_ResponseSyntax) from Amazon Cognito includes newly-generated `DEVICE_KEY` and `DEVICE_GROUP_KEY` values under `NewDeviceMetadata` . Store these values to use in future device-authentication requests.
     *
     * > When you provide a value for any property of `DeviceConfiguration` , you activate the device remembering for the user pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html
     */
    interface DeviceConfigurationProperty {
        /**
         * When true, a remembered device can sign in with device authentication instead of SMS and time-based one-time password (TOTP) factors for multi-factor authentication (MFA).
         *
         * > Whether or not `ChallengeRequiredOnNewDevice` is true, users who sign in with devices that have not been confirmed or remembered must still provide a second factor in a user pool that requires MFA.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-challengerequiredonnewdevice
         */
        readonly challengeRequiredOnNewDevice?: boolean | cdk.IResolvable;
        /**
         * When true, Amazon Cognito doesn't automatically remember a user's device when your app sends a [ConfirmDevice](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmDevice.html) API request. In your app, create a prompt for your user to choose whether they want to remember their device. Return the user's choice in an [UpdateDeviceStatus](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UpdateDeviceStatus.html) API request.
         *
         * When `DeviceOnlyRememberedOnUserPrompt` is `false` , Amazon Cognito immediately remembers devices that you register in a `ConfirmDevice` API request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-deviceconfiguration.html#cfn-cognito-userpool-deviceconfiguration-deviceonlyrememberedonuserprompt
         */
        readonly deviceOnlyRememberedOnUserPrompt?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnUserPool {
    /**
     * The email configuration of your user pool. The email configuration type sets your preferred sending method, AWS Region, and sender for messages from your user pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html
     */
    interface EmailConfigurationProperty {
        /**
         * The set of configuration rules that can be applied to emails sent using Amazon SES. A configuration set is applied to an email by including a reference to the configuration set in the headers of the email. Once applied, all of the rules in that configuration set are applied to the email. Configuration sets can be used to apply the following types of rules to emails:
         *
         * - Event publishing – Amazon SES can track the number of send, delivery, open, click, bounce, and complaint events for each email sent. Use event publishing to send information about these events to other AWS services such as SNS and CloudWatch.
         * - IP pool management – When leasing dedicated IP addresses with Amazon SES, you can create groups of IP addresses, called dedicated IP pools. You can then associate the dedicated IP pools with configuration sets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-configurationset
         */
        readonly configurationSet?: string;
        /**
         * Specifies whether Amazon Cognito uses its built-in functionality to send your users email messages, or uses your Amazon Simple Email Service email configuration. Specify one of the following values:
         *
         * - **COGNITO_DEFAULT** - When Amazon Cognito emails your users, it uses its built-in email functionality. When you use the default option, Amazon Cognito allows only a limited number of emails each day for your user pool. For typical production environments, the default email limit is less than the required delivery volume. To achieve a higher delivery volume, specify DEVELOPER to use your Amazon SES email configuration.
         *
         * To look up the email delivery limit for the default option, see [Limits](https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html) in the *Amazon Cognito Developer Guide* .
         *
         * The default FROM address is `no-reply@verificationemail.com` . To customize the FROM address, provide the Amazon Resource Name (ARN) of an Amazon SES verified email address for the `SourceArn` parameter.
         * - **DEVELOPER** - When Amazon Cognito emails your users, it uses your Amazon SES configuration. Amazon Cognito calls Amazon SES on your behalf to send email from your verified email address. When you use this option, the email delivery limits are the same limits that apply to your Amazon SES verified email address in your AWS account .
         *
         * If you use this option, provide the ARN of an Amazon SES verified email address for the `SourceArn` parameter.
         *
         * Before Amazon Cognito can email your users, it requires additional permissions to call Amazon SES on your behalf. When you update your user pool with this option, Amazon Cognito creates a *service-linked role* , which is a type of role in your AWS account . This role contains the permissions that allow you to access Amazon SES and send email messages from your email address. For more information about the service-linked role that Amazon Cognito creates, see [Using Service-Linked Roles for Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/using-service-linked-roles.html) in the *Amazon Cognito Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-emailsendingaccount
         */
        readonly emailSendingAccount?: string;
        /**
         * Identifies either the sender's email address or the sender's name with their email address. For example, `testuser@example.com` or `Test User <testuser@example.com>` . This address appears before the body of the email.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-from
         */
        readonly from?: string;
        /**
         * The destination to which the receiver of the email should reply.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-replytoemailaddress
         */
        readonly replyToEmailAddress?: string;
        /**
         * The ARN of a verified email address in Amazon SES. Amazon Cognito uses this email address in one of the following ways, depending on the value that you specify for the `EmailSendingAccount` parameter:
         *
         * - If you specify `COGNITO_DEFAULT` , Amazon Cognito uses this address as the custom FROM address when it emails your users using its built-in email account.
         * - If you specify `DEVELOPER` , Amazon Cognito emails your users with this address by calling Amazon SES on your behalf.
         *
         * The Region value of the `SourceArn` parameter must indicate a supported AWS Region of your user pool. Typically, the Region in the `SourceArn` and the user pool Region are the same. For more information, see [Amazon SES email configuration regions](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html#user-pool-email-developer-region-mapping) in the [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-sourcearn
         */
        readonly sourceArn?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The message template to be used for the welcome message to new users.
     *
     * See also [Customizing User Invitation Messages](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-customizations.html#cognito-user-pool-settings-user-invitation-message-customization) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html
     */
    interface InviteMessageTemplateProperty {
        /**
         * The message template for email messages. EmailMessage is allowed only if [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is DEVELOPER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailmessage
         */
        readonly emailMessage?: string;
        /**
         * The subject line for email messages. EmailSubject is allowed only if [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is DEVELOPER.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailsubject
         */
        readonly emailSubject?: string;
        /**
         * The message template for SMS messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-smsmessage
         */
        readonly smsMessage?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * Specifies the configuration for AWS Lambda triggers.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html
     */
    interface LambdaConfigProperty {
        /**
         * Creates an authentication challenge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-createauthchallenge
         */
        readonly createAuthChallenge?: string;
        /**
         * A custom email sender AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-customemailsender
         */
        readonly customEmailSender?: CfnUserPool.CustomEmailSenderProperty | cdk.IResolvable;
        /**
         * A custom Message AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-custommessage
         */
        readonly customMessage?: string;
        /**
         * A custom SMS sender AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-customsmssender
         */
        readonly customSmsSender?: CfnUserPool.CustomSMSSenderProperty | cdk.IResolvable;
        /**
         * Defines the authentication challenge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-defineauthchallenge
         */
        readonly defineAuthChallenge?: string;
        /**
         * The Amazon Resource Name of a AWS Key Management Service ( AWS KMS ) key. Amazon Cognito uses the key to encrypt codes and temporary passwords sent to `CustomEmailSender` and `CustomSMSSender` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-kmskeyid
         */
        readonly kmsKeyId?: string;
        /**
         * A post-authentication AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postauthentication
         */
        readonly postAuthentication?: string;
        /**
         * A post-confirmation AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postconfirmation
         */
        readonly postConfirmation?: string;
        /**
         * A pre-authentication AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-preauthentication
         */
        readonly preAuthentication?: string;
        /**
         * A pre-registration AWS Lambda trigger.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-presignup
         */
        readonly preSignUp?: string;
        /**
         * A Lambda trigger that is invoked before token generation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-pretokengeneration
         */
        readonly preTokenGeneration?: string;
        /**
         * The user migration Lambda config type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-usermigration
         */
        readonly userMigration?: string;
        /**
         * Verifies the authentication challenge response.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-verifyauthchallengeresponse
         */
        readonly verifyAuthChallengeResponse?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The minimum and maximum values of an attribute that is of the number data type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html
     */
    interface NumberAttributeConstraintsProperty {
        /**
         * The maximum value of an attribute that is of the number data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-maxvalue
         */
        readonly maxValue?: string;
        /**
         * The minimum value of an attribute that is of the number data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-numberattributeconstraints.html#cfn-cognito-userpool-numberattributeconstraints-minvalue
         */
        readonly minValue?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The password policy type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html
     */
    interface PasswordPolicyProperty {
        /**
         * The minimum length of the password in the policy that you have set. This value can't be less than 6.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-minimumlength
         */
        readonly minimumLength?: number;
        /**
         * In the password policy that you have set, refers to whether you have required users to use at least one lowercase letter in their password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requirelowercase
         */
        readonly requireLowercase?: boolean | cdk.IResolvable;
        /**
         * In the password policy that you have set, refers to whether you have required users to use at least one number in their password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requirenumbers
         */
        readonly requireNumbers?: boolean | cdk.IResolvable;
        /**
         * In the password policy that you have set, refers to whether you have required users to use at least one symbol in their password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requiresymbols
         */
        readonly requireSymbols?: boolean | cdk.IResolvable;
        /**
         * In the password policy that you have set, refers to whether you have required users to use at least one uppercase letter in their password.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-requireuppercase
         */
        readonly requireUppercase?: boolean | cdk.IResolvable;
        /**
         * The number of days a temporary password is valid in the password policy. If the user doesn't sign in during this time, an administrator must reset their password.
         *
         * > When you set `TemporaryPasswordValidityDays` for a user pool, you can no longer set a value for the legacy `UnusedAccountValidityDays` parameter in that user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-passwordpolicy.html#cfn-cognito-userpool-passwordpolicy-temporarypasswordvaliditydays
         */
        readonly temporaryPasswordValidityDays?: number;
    }
}
export declare namespace CfnUserPool {
    /**
     * The policy associated with a user pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html
     */
    interface PoliciesProperty {
        /**
         * The password policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html#cfn-cognito-userpool-policies-passwordpolicy
         */
        readonly passwordPolicy?: CfnUserPool.PasswordPolicyProperty | cdk.IResolvable;
    }
}
export declare namespace CfnUserPool {
    /**
     * A map containing a priority as a key, and recovery method name as a value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html
     */
    interface RecoveryOptionProperty {
        /**
         * Specifies the recovery method for a user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html#cfn-cognito-userpool-recoveryoption-name
         */
        readonly name?: string;
        /**
         * A positive integer specifying priority of a method with 1 being the highest priority.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-recoveryoption.html#cfn-cognito-userpool-recoveryoption-priority
         */
        readonly priority?: number;
    }
}
export declare namespace CfnUserPool {
    /**
     * Contains information about the schema attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html
     */
    interface SchemaAttributeProperty {
        /**
         * The attribute data type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-attributedatatype
         */
        readonly attributeDataType?: string;
        /**
         * > We recommend that you use [WriteAttributes](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UserPoolClientType.html#CognitoUserPools-Type-UserPoolClientType-WriteAttributes) in the user pool client to control how attributes can be mutated for new use cases instead of using `DeveloperOnlyAttribute` .
         *
         * Specifies whether the attribute type is developer only. This attribute can only be modified by an administrator. Users will not be able to modify this attribute using their access token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-developeronlyattribute
         */
        readonly developerOnlyAttribute?: boolean | cdk.IResolvable;
        /**
         * Specifies whether the value of the attribute can be changed.
         *
         * For any user pool attribute that is mapped to an IdP attribute, you must set this parameter to `true` . Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute. For more information, see [Specifying Identity Provider Attribute Mappings for Your User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-mutable
         */
        readonly mutable?: boolean | cdk.IResolvable;
        /**
         * A schema attribute of the name type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-name
         */
        readonly name?: string;
        /**
         * Specifies the constraints for an attribute of the number type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-numberattributeconstraints
         */
        readonly numberAttributeConstraints?: CfnUserPool.NumberAttributeConstraintsProperty | cdk.IResolvable;
        /**
         * Specifies whether a user pool attribute is required. If the attribute is required and the user doesn't provide a value, registration or sign-in will fail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-required
         */
        readonly required?: boolean | cdk.IResolvable;
        /**
         * Specifies the constraints for an attribute of the string type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html#cfn-cognito-userpool-schemaattribute-stringattributeconstraints
         */
        readonly stringAttributeConstraints?: CfnUserPool.StringAttributeConstraintsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnUserPool {
    /**
     * The SMS configuration type that includes the settings the Cognito User Pool needs to call for the Amazon SNS service to send an SMS message from your AWS account . The Cognito User Pool makes the request to the Amazon SNS Service by using an IAM role that you provide for your AWS account .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html
     */
    interface SmsConfigurationProperty {
        /**
         * The external ID is a value. We recommend you use `ExternalId` to add security to your IAM role, which is used to call Amazon SNS to send SMS messages for your user pool. If you provide an `ExternalId` , the Cognito User Pool uses it when attempting to assume your IAM role. You can also set your roles trust policy to require the `ExternalID` . If you use the Cognito Management Console to create a role for SMS MFA, Cognito creates a role with the required permissions and a trust policy that uses `ExternalId` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-externalid
         */
        readonly externalId?: string;
        /**
         * The Amazon Resource Name (ARN) of the Amazon SNS caller. This is the ARN of the IAM role in your AWS account that Amazon Cognito will use to send SMS messages. SMS messages are subject to a [spending limit](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snscallerarn
         */
        readonly snsCallerArn?: string;
        /**
         * The AWS Region to use with Amazon SNS integration. You can choose the same Region as your user pool, or a supported *Legacy Amazon SNS alternate Region* .
         *
         * Amazon Cognito resources in the Asia Pacific (Seoul) AWS Region must use your Amazon SNS configuration in the Asia Pacific (Tokyo) Region. For more information, see [SMS message settings for Amazon Cognito user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-sms-settings.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-smsconfiguration.html#cfn-cognito-userpool-smsconfiguration-snsregion
         */
        readonly snsRegion?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The `StringAttributeConstraints` property type defines the string attribute constraints of an Amazon Cognito user pool. `StringAttributeConstraints` is a subproperty of the [SchemaAttribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-schemaattribute.html) property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html
     */
    interface StringAttributeConstraintsProperty {
        /**
         * The maximum length.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-maxlength
         */
        readonly maxLength?: string;
        /**
         * The minimum length.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-stringattributeconstraints.html#cfn-cognito-userpool-stringattributeconstraints-minlength
         */
        readonly minLength?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The settings for updates to user attributes. These settings include the property `AttributesRequireVerificationBeforeUpdate` ,
     * a user-pool setting that tells Amazon Cognito how to handle changes to the value of your users' email address and phone number attributes. For
     * more information, see [Verifying updates to email addresses and phone numbers](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html#user-pool-settings-verifications-verify-attribute-updates) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userattributeupdatesettings.html
     */
    interface UserAttributeUpdateSettingsProperty {
        /**
         * Requires that your user verifies their email address, phone number, or both before Amazon Cognito updates the value of that attribute. When you update a user attribute that has this option activated, Amazon Cognito sends a verification message to the new phone number or email address. Amazon Cognito doesn’t change the value of the attribute until your user responds to the verification message and confirms the new value.
         *
         * You can verify an updated email address or phone number with a [VerifyUserAttribute](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_VerifyUserAttribute.html) API request. You can also call the [AdminUpdateUserAttributes](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html) API and set `email_verified` or `phone_number_verified` to true.
         *
         * When `AttributesRequireVerificationBeforeUpdate` is false, your user pool doesn't require that your users verify attribute changes before Amazon Cognito updates them. In a user pool where `AttributesRequireVerificationBeforeUpdate` is false, API operations that change attribute values can immediately update a user’s `email` or `phone_number` attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userattributeupdatesettings.html#cfn-cognito-userpool-userattributeupdatesettings-attributesrequireverificationbeforeupdate
         */
        readonly attributesRequireVerificationBeforeUpdate: string[];
    }
}
export declare namespace CfnUserPool {
    /**
     * The user pool add-ons type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html
     */
    interface UserPoolAddOnsProperty {
        /**
         * The advanced security mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html#cfn-cognito-userpool-userpooladdons-advancedsecuritymode
         */
        readonly advancedSecurityMode?: string;
    }
}
export declare namespace CfnUserPool {
    /**
     * The `UsernameConfiguration` property type specifies case sensitivity on the username input for the selected sign-in option.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-usernameconfiguration.html
     */
    interface UsernameConfigurationProperty {
        /**
         * Specifies whether user name case sensitivity will be applied for all users in the user pool through Amazon Cognito APIs. For most use cases, set case sensitivity to `False` (case insensitive) as a best practice. When usernames and email addresses are case insensitive, users can sign in as the same user when they enter a different capitalization of their user name.
         *
         * Valid values include:
         *
         * - **True** - Enables case sensitivity for all username input. When this option is set to `True` , users must sign in using the exact capitalization of their given username, such as “UserName”. This is the default value.
         * - **False** - Enables case insensitivity for all username input. For example, when this option is set to `False` , users can sign in using `username` , `USERNAME` , or `UserName` . This option also enables both `preferred_username` and `email` alias to be case insensitive, in addition to the `username` attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-usernameconfiguration.html#cfn-cognito-userpool-usernameconfiguration-casesensitive
         */
        readonly caseSensitive?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnUserPool {
    /**
     * The template for verification messages.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html
     */
    interface VerificationMessageTemplateProperty {
        /**
         * The default email option.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-defaultemailoption
         */
        readonly defaultEmailOption?: string;
        /**
         * The template for email messages that Amazon Cognito sends to your users. You can set an `EmailMessage` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailmessage
         */
        readonly emailMessage?: string;
        /**
         * The email message template for sending a confirmation link to the user. You can set an `EmailMessageByLink` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailmessagebylink
         */
        readonly emailMessageByLink?: string;
        /**
         * The subject line for the email message template. You can set an `EmailSubject` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailsubject
         */
        readonly emailSubject?: string;
        /**
         * The subject line for the email message template for sending a confirmation link to the user. You can set an `EmailSubjectByLink` template only if the value of [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` . When your [EmailSendingAccount](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_EmailConfigurationType.html#CognitoUserPools-Type-EmailConfigurationType-EmailSendingAccount) is `DEVELOPER` , your user pool sends email messages with your own Amazon SES configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-emailsubjectbylink
         */
        readonly emailSubjectByLink?: string;
        /**
         * The template for SMS messages that Amazon Cognito sends to your users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-verificationmessagetemplate.html#cfn-cognito-userpool-verificationmessagetemplate-smsmessage
         */
        readonly smsMessage?: string;
    }
}
/**
 * Properties for defining a `CfnUserPoolClient`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html
 */
export interface CfnUserPoolClientProps {
    /**
     * The user pool ID for the user pool where you want to create a user pool client.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-userpoolid
     */
    readonly userPoolId: string;
    /**
     * The access token time limit. After this limit expires, your user can't use their access token. To specify the time unit for `AccessTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `AccessTokenValidity` to `10` and `TokenValidityUnits` to `hours` , your user can authorize access with their access token for 10 hours.
     *
     * The default time unit for `AccessTokenValidity` in an API request is hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-accesstokenvalidity
     */
    readonly accessTokenValidity?: number;
    /**
     * The allowed OAuth flows.
     *
     * - **code** - Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the `/oauth2/token` endpoint.
     * - **implicit** - Issue the access token (and, optionally, ID token, based on scopes) directly to your user.
     * - **client_credentials** - Issue the access token from the `/oauth2/token` endpoint directly to a non-person user using a combination of the client ID and client secret.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflows
     */
    readonly allowedOAuthFlows?: string[];
    /**
     * Set to true if the client is allowed to follow the OAuth protocol when interacting with Amazon Cognito user pools.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflowsuserpoolclient
     */
    readonly allowedOAuthFlowsUserPoolClient?: boolean | cdk.IResolvable;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are `phone` , `email` , `openid` , and `profile` . Possible values provided by AWS are `aws.cognito.signin.user.admin` . Custom scopes created in Resource Servers are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthscopes
     */
    readonly allowedOAuthScopes?: string[];
    /**
     * The user pool analytics configuration for collecting metrics and sending them to your Amazon Pinpoint campaign.
     *
     * > In AWS Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in AWS Region us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-analyticsconfiguration
     */
    readonly analyticsConfiguration?: CfnUserPoolClient.AnalyticsConfigurationProperty | cdk.IResolvable;
    /**
     * Amazon Cognito creates a session token for each API request in an authentication flow. `AuthSessionValidity` is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-authsessionvalidity
     */
    readonly authSessionValidity?: number;
    /**
     * A list of allowed redirect (callback) URLs for the IdPs.
     *
     * A redirect URI must:
     *
     * - Be an absolute URI.
     * - Be registered with the authorization server.
     * - Not include a fragment component.
     *
     * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
     *
     * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
     *
     * App callback URLs such as myapp://example are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-callbackurls
     */
    readonly callbackUrLs?: string[];
    /**
     * The client name for the user pool client you would like to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-clientname
     */
    readonly clientName?: string;
    /**
     * The default redirect URI. Must be in the `CallbackURLs` list.
     *
     * A redirect URI must:
     *
     * - Be an absolute URI.
     * - Be registered with the authorization server.
     * - Not include a fragment component.
     *
     * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
     *
     * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
     *
     * App callback URLs such as myapp://example are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-defaultredirecturi
     */
    readonly defaultRedirectUri?: string;
    /**
     * Activates the propagation of additional user context data. For more information about propagation of user context data, see [Adding advanced security to a user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html) . If you don’t include this parameter, you can't send device fingerprint information, including source IP address, to Amazon Cognito advanced security. You can only activate `EnablePropagateAdditionalUserContextData` in an app client that has a client secret.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enablepropagateadditionalusercontextdata
     */
    readonly enablePropagateAdditionalUserContextData?: boolean | cdk.IResolvable;
    /**
     * Activates or deactivates token revocation. For more information about revoking tokens, see [RevokeToken](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RevokeToken.html) .
     *
     * If you don't include this parameter, token revocation is automatically activated for the new user pool client.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enabletokenrevocation
     */
    readonly enableTokenRevocation?: boolean | cdk.IResolvable;
    /**
     * The authentication flows that you want your user pool client to support. For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.
     *
     * > If you don't specify a value for `ExplicitAuthFlows` , your user client supports `ALLOW_REFRESH_TOKEN_AUTH` , `ALLOW_USER_SRP_AUTH` , and `ALLOW_CUSTOM_AUTH` .
     *
     * Valid values include:
     *
     * - `ALLOW_ADMIN_USER_PASSWORD_AUTH` : Enable admin based user password authentication flow `ADMIN_USER_PASSWORD_AUTH` . This setting replaces the `ADMIN_NO_SRP_AUTH` setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.
     * - `ALLOW_CUSTOM_AUTH` : Enable Lambda trigger based authentication.
     * - `ALLOW_USER_PASSWORD_AUTH` : Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.
     * - `ALLOW_USER_SRP_AUTH` : Enable SRP-based authentication.
     * - `ALLOW_REFRESH_TOKEN_AUTH` : Enable authflow to refresh tokens.
     *
     * In some environments, you will see the values `ADMIN_NO_SRP_AUTH` , `CUSTOM_AUTH_FLOW_ONLY` , or `USER_PASSWORD_AUTH` . You can't assign these legacy `ExplicitAuthFlows` values to user pool clients at the same time as values that begin with `ALLOW_` ,
     * like `ALLOW_USER_SRP_AUTH` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-explicitauthflows
     */
    readonly explicitAuthFlows?: string[];
    /**
     * Boolean to specify whether you want to generate a secret for the user pool client being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-generatesecret
     */
    readonly generateSecret?: boolean | cdk.IResolvable;
    /**
     * The ID token time limit. After this limit expires, your user can't use their ID token. To specify the time unit for `IdTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `IdTokenValidity` as `10` and `TokenValidityUnits` as `hours` , your user can authenticate their session with their ID token for 10 hours.
     *
     * The default time unit for `IdTokenValidity` in an API request is hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-idtokenvalidity
     */
    readonly idTokenValidity?: number;
    /**
     * A list of allowed logout URLs for the IdPs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-logouturls
     */
    readonly logoutUrLs?: string[];
    /**
     * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool. When set to `ENABLED` and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to `LEGACY` , those APIs will return a `UserNotFoundException` exception if the user does not exist in the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-preventuserexistenceerrors
     */
    readonly preventUserExistenceErrors?: string;
    /**
     * The read attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-readattributes
     */
    readonly readAttributes?: string[];
    /**
     * The refresh token time limit. After this limit expires, your user can't use their refresh token. To specify the time unit for `RefreshTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `RefreshTokenValidity` as `10` and `TokenValidityUnits` as `days` , your user can refresh their session and retrieve new access and ID tokens for 10 days.
     *
     * The default time unit for `RefreshTokenValidity` in an API request is days. You can't set `RefreshTokenValidity` to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-refreshtokenvalidity
     */
    readonly refreshTokenValidity?: number;
    /**
     * A list of provider names for the identity providers (IdPs) that are supported on this client. The following are supported: `COGNITO` , `Facebook` , `Google` , `SignInWithApple` , and `LoginWithAmazon` . You can also specify the names that you configured for the SAML and OIDC IdPs in your user pool, for example `MySAMLIdP` or `MyOIDCIdP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-supportedidentityproviders
     */
    readonly supportedIdentityProviders?: string[];
    /**
     * The units in which the validity times are represented. The default unit for RefreshToken is days, and default for ID and access tokens are hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-tokenvalidityunits
     */
    readonly tokenValidityUnits?: CfnUserPoolClient.TokenValidityUnitsProperty | cdk.IResolvable;
    /**
     * The user pool attributes that the app client can write to.
     *
     * If your app client allows users to sign in through an IdP, this array must include all attributes that you have mapped to IdP attributes. Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If your app client does not have write access to a mapped attribute, Amazon Cognito throws an error when it tries to update the attribute. For more information, see [Specifying IdP Attribute Mappings for Your user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-writeattributes
     */
    readonly writeAttributes?: string[];
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolClient`
 *
 * The `AWS::Cognito::UserPoolClient` resource specifies an Amazon Cognito user pool client.
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPoolClient
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html
 */
export declare class CfnUserPoolClient extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolClient";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolClient;
    /**
     *
     * @cloudformationAttribute ClientSecret
     */
    readonly attrClientSecret: string;
    /**
     *
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The user pool ID for the user pool where you want to create a user pool client.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-userpoolid
     */
    userPoolId: string;
    /**
     * The access token time limit. After this limit expires, your user can't use their access token. To specify the time unit for `AccessTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `AccessTokenValidity` to `10` and `TokenValidityUnits` to `hours` , your user can authorize access with their access token for 10 hours.
     *
     * The default time unit for `AccessTokenValidity` in an API request is hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-accesstokenvalidity
     */
    accessTokenValidity: number | undefined;
    /**
     * The allowed OAuth flows.
     *
     * - **code** - Use a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the `/oauth2/token` endpoint.
     * - **implicit** - Issue the access token (and, optionally, ID token, based on scopes) directly to your user.
     * - **client_credentials** - Issue the access token from the `/oauth2/token` endpoint directly to a non-person user using a combination of the client ID and client secret.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflows
     */
    allowedOAuthFlows: string[] | undefined;
    /**
     * Set to true if the client is allowed to follow the OAuth protocol when interacting with Amazon Cognito user pools.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthflowsuserpoolclient
     */
    allowedOAuthFlowsUserPoolClient: boolean | cdk.IResolvable | undefined;
    /**
     * The allowed OAuth scopes. Possible values provided by OAuth are `phone` , `email` , `openid` , and `profile` . Possible values provided by AWS are `aws.cognito.signin.user.admin` . Custom scopes created in Resource Servers are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-allowedoauthscopes
     */
    allowedOAuthScopes: string[] | undefined;
    /**
     * The user pool analytics configuration for collecting metrics and sending them to your Amazon Pinpoint campaign.
     *
     * > In AWS Regions where Amazon Pinpoint isn't available, user pools only support sending events to Amazon Pinpoint projects in AWS Region us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-analyticsconfiguration
     */
    analyticsConfiguration: CfnUserPoolClient.AnalyticsConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Amazon Cognito creates a session token for each API request in an authentication flow. `AuthSessionValidity` is the duration, in minutes, of that session token. Your user pool native user must respond to each authentication challenge before the session expires.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-authsessionvalidity
     */
    authSessionValidity: number | undefined;
    /**
     * A list of allowed redirect (callback) URLs for the IdPs.
     *
     * A redirect URI must:
     *
     * - Be an absolute URI.
     * - Be registered with the authorization server.
     * - Not include a fragment component.
     *
     * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
     *
     * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
     *
     * App callback URLs such as myapp://example are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-callbackurls
     */
    callbackUrLs: string[] | undefined;
    /**
     * The client name for the user pool client you would like to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-clientname
     */
    clientName: string | undefined;
    /**
     * The default redirect URI. Must be in the `CallbackURLs` list.
     *
     * A redirect URI must:
     *
     * - Be an absolute URI.
     * - Be registered with the authorization server.
     * - Not include a fragment component.
     *
     * See [OAuth 2.0 - Redirection Endpoint](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc6749#section-3.1.2) .
     *
     * Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
     *
     * App callback URLs such as myapp://example are also supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-defaultredirecturi
     */
    defaultRedirectUri: string | undefined;
    /**
     * Activates the propagation of additional user context data. For more information about propagation of user context data, see [Adding advanced security to a user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html) . If you don’t include this parameter, you can't send device fingerprint information, including source IP address, to Amazon Cognito advanced security. You can only activate `EnablePropagateAdditionalUserContextData` in an app client that has a client secret.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enablepropagateadditionalusercontextdata
     */
    enablePropagateAdditionalUserContextData: boolean | cdk.IResolvable | undefined;
    /**
     * Activates or deactivates token revocation. For more information about revoking tokens, see [RevokeToken](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_RevokeToken.html) .
     *
     * If you don't include this parameter, token revocation is automatically activated for the new user pool client.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-enabletokenrevocation
     */
    enableTokenRevocation: boolean | cdk.IResolvable | undefined;
    /**
     * The authentication flows that you want your user pool client to support. For each app client in your user pool, you can sign in your users with any combination of one or more flows, including with a user name and Secure Remote Password (SRP), a user name and password, or a custom authentication process that you define with Lambda functions.
     *
     * > If you don't specify a value for `ExplicitAuthFlows` , your user client supports `ALLOW_REFRESH_TOKEN_AUTH` , `ALLOW_USER_SRP_AUTH` , and `ALLOW_CUSTOM_AUTH` .
     *
     * Valid values include:
     *
     * - `ALLOW_ADMIN_USER_PASSWORD_AUTH` : Enable admin based user password authentication flow `ADMIN_USER_PASSWORD_AUTH` . This setting replaces the `ADMIN_NO_SRP_AUTH` setting. With this authentication flow, your app passes a user name and password to Amazon Cognito in the request, instead of using the Secure Remote Password (SRP) protocol to securely transmit the password.
     * - `ALLOW_CUSTOM_AUTH` : Enable Lambda trigger based authentication.
     * - `ALLOW_USER_PASSWORD_AUTH` : Enable user password-based authentication. In this flow, Amazon Cognito receives the password in the request instead of using the SRP protocol to verify passwords.
     * - `ALLOW_USER_SRP_AUTH` : Enable SRP-based authentication.
     * - `ALLOW_REFRESH_TOKEN_AUTH` : Enable authflow to refresh tokens.
     *
     * In some environments, you will see the values `ADMIN_NO_SRP_AUTH` , `CUSTOM_AUTH_FLOW_ONLY` , or `USER_PASSWORD_AUTH` . You can't assign these legacy `ExplicitAuthFlows` values to user pool clients at the same time as values that begin with `ALLOW_` ,
     * like `ALLOW_USER_SRP_AUTH` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-explicitauthflows
     */
    explicitAuthFlows: string[] | undefined;
    /**
     * Boolean to specify whether you want to generate a secret for the user pool client being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-generatesecret
     */
    generateSecret: boolean | cdk.IResolvable | undefined;
    /**
     * The ID token time limit. After this limit expires, your user can't use their ID token. To specify the time unit for `IdTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `IdTokenValidity` as `10` and `TokenValidityUnits` as `hours` , your user can authenticate their session with their ID token for 10 hours.
     *
     * The default time unit for `IdTokenValidity` in an API request is hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-idtokenvalidity
     */
    idTokenValidity: number | undefined;
    /**
     * A list of allowed logout URLs for the IdPs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-logouturls
     */
    logoutUrLs: string[] | undefined;
    /**
     * Use this setting to choose which errors and responses are returned by Cognito APIs during authentication, account confirmation, and password recovery when the user does not exist in the user pool. When set to `ENABLED` and the user does not exist, authentication returns an error indicating either the username or password was incorrect, and account confirmation and password recovery return a response indicating a code was sent to a simulated destination. When set to `LEGACY` , those APIs will return a `UserNotFoundException` exception if the user does not exist in the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-preventuserexistenceerrors
     */
    preventUserExistenceErrors: string | undefined;
    /**
     * The read attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-readattributes
     */
    readAttributes: string[] | undefined;
    /**
     * The refresh token time limit. After this limit expires, your user can't use their refresh token. To specify the time unit for `RefreshTokenValidity` as `seconds` , `minutes` , `hours` , or `days` , set a `TokenValidityUnits` value in your API request.
     *
     * For example, when you set `RefreshTokenValidity` as `10` and `TokenValidityUnits` as `days` , your user can refresh their session and retrieve new access and ID tokens for 10 days.
     *
     * The default time unit for `RefreshTokenValidity` in an API request is days. You can't set `RefreshTokenValidity` to 0. If you do, Amazon Cognito overrides the value with the default value of 30 days.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-refreshtokenvalidity
     */
    refreshTokenValidity: number | undefined;
    /**
     * A list of provider names for the identity providers (IdPs) that are supported on this client. The following are supported: `COGNITO` , `Facebook` , `Google` , `SignInWithApple` , and `LoginWithAmazon` . You can also specify the names that you configured for the SAML and OIDC IdPs in your user pool, for example `MySAMLIdP` or `MyOIDCIdP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-supportedidentityproviders
     */
    supportedIdentityProviders: string[] | undefined;
    /**
     * The units in which the validity times are represented. The default unit for RefreshToken is days, and default for ID and access tokens are hours.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-tokenvalidityunits
     */
    tokenValidityUnits: CfnUserPoolClient.TokenValidityUnitsProperty | cdk.IResolvable | undefined;
    /**
     * The user pool attributes that the app client can write to.
     *
     * If your app client allows users to sign in through an IdP, this array must include all attributes that you have mapped to IdP attributes. Amazon Cognito updates mapped attributes when users sign in to your application through an IdP. If your app client does not have write access to a mapped attribute, Amazon Cognito throws an error when it tries to update the attribute. For more information, see [Specifying IdP Attribute Mappings for Your user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-specifying-attribute-mapping.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-writeattributes
     */
    writeAttributes: string[] | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolClient`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolClientProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPoolClient {
    /**
     * The Amazon Pinpoint analytics configuration necessary to collect metrics for a user pool.
     *
     * > In Regions where Amazon Pinpointisn't available, user pools only support sending events to Amazon Pinpoint projects in us-east-1. In Regions where Amazon Pinpoint is available, user pools support sending events to Amazon Pinpoint projects within that same Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html
     */
    interface AnalyticsConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of an Amazon Pinpoint project. You can use the Amazon Pinpoint project for integration with the chosen user pool client. Amazon Cognito publishes events to the Amazon Pinpoint project that the app ARN declares.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-applicationarn
         */
        readonly applicationArn?: string;
        /**
         * The application ID for an Amazon Pinpoint application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-applicationid
         */
        readonly applicationId?: string;
        /**
         * The external ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-externalid
         */
        readonly externalId?: string;
        /**
         * The ARN of an AWS Identity and Access Management role that authorizes Amazon Cognito to publish events to Amazon Pinpoint analytics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-rolearn
         */
        readonly roleArn?: string;
        /**
         * If `UserDataShared` is `true` , Amazon Cognito includes user data in the events that it publishes to Amazon Pinpoint analytics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-analyticsconfiguration.html#cfn-cognito-userpoolclient-analyticsconfiguration-userdatashared
         */
        readonly userDataShared?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnUserPoolClient {
    /**
     * The time units you use when you set the duration of ID, access, and refresh tokens. The default unit for RefreshToken is days, and the default for ID and access tokens is hours.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html
     */
    interface TokenValidityUnitsProperty {
        /**
         * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `AccessTokenValidity` parameter. The default `AccessTokenValidity` time unit is hours. `AccessTokenValidity` duration can range from five minutes to one day.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-accesstoken
         */
        readonly accessToken?: string;
        /**
         * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `IdTokenValidity` parameter. The default `IdTokenValidity` time unit is hours. `IdTokenValidity` duration can range from five minutes to one day.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-idtoken
         */
        readonly idToken?: string;
        /**
         * A time unit of `seconds` , `minutes` , `hours` , or `days` for the value that you set in the `RefreshTokenValidity` parameter. The default `RefreshTokenValidity` time unit is days. `RefreshTokenValidity` duration can range from 60 minutes to 10 years.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolclient-tokenvalidityunits.html#cfn-cognito-userpoolclient-tokenvalidityunits-refreshtoken
         */
        readonly refreshToken?: string;
    }
}
/**
 * Properties for defining a `CfnUserPoolDomain`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html
 */
export interface CfnUserPoolDomainProps {
    /**
     * The domain name for the domain that hosts the sign-up and sign-in pages for your application. For example: `auth.example.com` . If you're using a prefix domain, this field denotes the first part of the domain before `.auth.[region].amazoncognito.com` .
     *
     * This string can include only lowercase letters, numbers, and hyphens. Don't use a hyphen for the first or last character. Use periods to separate subdomain names.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-domain
     */
    readonly domain: string;
    /**
     * The user pool ID for the user pool where you want to associate a user pool domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-userpoolid
     */
    readonly userPoolId: string;
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in pages for your application. Use this object to specify an SSL certificate that is managed by ACM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-customdomainconfig
     */
    readonly customDomainConfig?: CfnUserPoolDomain.CustomDomainConfigTypeProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolDomain`
 *
 * The AWS::Cognito::UserPoolDomain resource creates a new domain for a user pool.
 *
 * @cloudformationResource AWS::Cognito::UserPoolDomain
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html
 */
export declare class CfnUserPoolDomain extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolDomain";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolDomain;
    /**
     * The Amazon CloudFront endpoint that you use as the target of the alias that you set up with your Domain Name Service (DNS) provider.
     * @cloudformationAttribute CloudFrontDistribution
     */
    readonly attrCloudFrontDistribution: string;
    /**
     * The domain name for the domain that hosts the sign-up and sign-in pages for your application. For example: `auth.example.com` . If you're using a prefix domain, this field denotes the first part of the domain before `.auth.[region].amazoncognito.com` .
     *
     * This string can include only lowercase letters, numbers, and hyphens. Don't use a hyphen for the first or last character. Use periods to separate subdomain names.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-domain
     */
    domain: string;
    /**
     * The user pool ID for the user pool where you want to associate a user pool domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-userpoolid
     */
    userPoolId: string;
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in pages for your application. Use this object to specify an SSL certificate that is managed by ACM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooldomain.html#cfn-cognito-userpooldomain-customdomainconfig
     */
    customDomainConfig: CfnUserPoolDomain.CustomDomainConfigTypeProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolDomain`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolDomainProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPoolDomain {
    /**
     * The configuration for a custom domain that hosts the sign-up and sign-in webpages for your application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooldomain-customdomainconfigtype.html
     */
    interface CustomDomainConfigTypeProperty {
        /**
         * The Amazon Resource Name (ARN) of an AWS Certificate Manager SSL certificate. You use this certificate for the subdomain of your custom domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooldomain-customdomainconfigtype.html#cfn-cognito-userpooldomain-customdomainconfigtype-certificatearn
         */
        readonly certificateArn?: string;
    }
}
/**
 * Properties for defining a `CfnUserPoolGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html
 */
export interface CfnUserPoolGroupProps {
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-userpoolid
     */
    readonly userPoolId: string;
    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-description
     */
    readonly description?: string;
    /**
     * The name of the group. Must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-groupname
     */
    readonly groupName?: string;
    /**
     * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower `Precedence` values take precedence over groups with higher or null `Precedence` values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN is given in the user's tokens for the `cognito:roles` and `cognito:preferred_role` claims.
     *
     * Two groups can have the same `Precedence` value. If this happens, neither group takes precedence over the other. If two groups with the same `Precedence` have the same role ARN, that role is used in the `cognito:preferred_role` claim in tokens for users in each group. If the two groups have different role ARNs, the `cognito:preferred_role` claim isn't set in users' tokens.
     *
     * The default `Precedence` value is null. The maximum `Precedence` value is `2^31-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-precedence
     */
    readonly precedence?: number;
    /**
     * The role Amazon Resource Name (ARN) for the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-rolearn
     */
    readonly roleArn?: string;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolGroup`
 *
 * Specifies a new group in the identified user pool.
 *
 * Calling this action requires developer credentials.
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPoolGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html
 */
export declare class CfnUserPoolGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolGroup;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-userpoolid
     */
    userPoolId: string;
    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-description
     */
    description: string | undefined;
    /**
     * The name of the group. Must be unique.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-groupname
     */
    groupName: string | undefined;
    /**
     * A non-negative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower `Precedence` values take precedence over groups with higher or null `Precedence` values. If a user belongs to two or more groups, it is the group with the lowest precedence value whose role ARN is given in the user's tokens for the `cognito:roles` and `cognito:preferred_role` claims.
     *
     * Two groups can have the same `Precedence` value. If this happens, neither group takes precedence over the other. If two groups with the same `Precedence` have the same role ARN, that role is used in the `cognito:preferred_role` claim in tokens for users in each group. If the two groups have different role ARNs, the `cognito:preferred_role` claim isn't set in users' tokens.
     *
     * The default `Precedence` value is null. The maximum `Precedence` value is `2^31-1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-precedence
     */
    precedence: number | undefined;
    /**
     * The role Amazon Resource Name (ARN) for the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolgroup.html#cfn-cognito-userpoolgroup-rolearn
     */
    roleArn: string | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnUserPoolIdentityProvider`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html
 */
export interface CfnUserPoolIdentityProviderProps {
    /**
     * The IdP name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providername
     */
    readonly providerName: string;
    /**
     * The IdP type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providertype
     */
    readonly providerType: string;
    /**
     * The user pool ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-userpoolid
     */
    readonly userPoolId: string;
    /**
     * A mapping of IdP attributes to standard and custom user pool attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-attributemapping
     */
    readonly attributeMapping?: any | cdk.IResolvable;
    /**
     * A list of IdP identifiers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-idpidentifiers
     */
    readonly idpIdentifiers?: string[];
    /**
     * The IdP details. The following list describes the provider detail keys for each IdP type.
     *
     * - For Google and Login with Amazon:
     *
     * - client_id
     * - client_secret
     * - authorize_scopes
     * - For Facebook:
     *
     * - client_id
     * - client_secret
     * - authorize_scopes
     * - api_version
     * - For Sign in with Apple:
     *
     * - client_id
     * - team_id
     * - key_id
     * - private_key
     * - authorize_scopes
     * - For OpenID Connect (OIDC) providers:
     *
     * - client_id
     * - client_secret
     * - attributes_request_method
     * - oidc_issuer
     * - authorize_scopes
     * - The following keys are only present if Amazon Cognito didn't discover them at the `oidc_issuer` URL.
     *
     * - authorize_url
     * - token_url
     * - attributes_url
     * - jwks_uri
     * - Amazon Cognito sets the value of the following keys automatically. They are read-only.
     *
     * - attributes_url_add_attributes
     * - For SAML providers:
     *
     * - MetadataFile or MetadataURL
     * - IDPSignout *optional*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providerdetails
     */
    readonly providerDetails?: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolIdentityProvider`
 *
 * The `AWS::Cognito::UserPoolIdentityProvider` resource creates an identity provider for a user pool.
 *
 * @cloudformationResource AWS::Cognito::UserPoolIdentityProvider
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html
 */
export declare class CfnUserPoolIdentityProvider extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolIdentityProvider";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolIdentityProvider;
    /**
     * The IdP name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providername
     */
    providerName: string;
    /**
     * The IdP type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providertype
     */
    providerType: string;
    /**
     * The user pool ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-userpoolid
     */
    userPoolId: string;
    /**
     * A mapping of IdP attributes to standard and custom user pool attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-attributemapping
     */
    attributeMapping: any | cdk.IResolvable | undefined;
    /**
     * A list of IdP identifiers.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-idpidentifiers
     */
    idpIdentifiers: string[] | undefined;
    /**
     * The IdP details. The following list describes the provider detail keys for each IdP type.
     *
     * - For Google and Login with Amazon:
     *
     * - client_id
     * - client_secret
     * - authorize_scopes
     * - For Facebook:
     *
     * - client_id
     * - client_secret
     * - authorize_scopes
     * - api_version
     * - For Sign in with Apple:
     *
     * - client_id
     * - team_id
     * - key_id
     * - private_key
     * - authorize_scopes
     * - For OpenID Connect (OIDC) providers:
     *
     * - client_id
     * - client_secret
     * - attributes_request_method
     * - oidc_issuer
     * - authorize_scopes
     * - The following keys are only present if Amazon Cognito didn't discover them at the `oidc_issuer` URL.
     *
     * - authorize_url
     * - token_url
     * - attributes_url
     * - jwks_uri
     * - Amazon Cognito sets the value of the following keys automatically. They are read-only.
     *
     * - attributes_url_add_attributes
     * - For SAML providers:
     *
     * - MetadataFile or MetadataURL
     * - IDPSignout *optional*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolidentityprovider.html#cfn-cognito-userpoolidentityprovider-providerdetails
     */
    providerDetails: any | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolIdentityProvider`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolIdentityProviderProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnUserPoolResourceServer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html
 */
export interface CfnUserPoolResourceServerProps {
    /**
     * A unique resource server identifier for the resource server. This could be an HTTPS endpoint where the resource server is located. For example: `https://my-weather-api.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-identifier
     */
    readonly identifier: string;
    /**
     * A friendly name for the resource server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-name
     */
    readonly name: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-userpoolid
     */
    readonly userPoolId: string;
    /**
     * A list of scopes. Each scope is a map with keys `ScopeName` and `ScopeDescription` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-scopes
     */
    readonly scopes?: Array<CfnUserPoolResourceServer.ResourceServerScopeTypeProperty | cdk.IResolvable> | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolResourceServer`
 *
 * The `AWS::Cognito::UserPoolResourceServer` resource creates a new OAuth2.0 resource server and defines custom scopes in it.
 *
 * > If you don't specify a value for a parameter, Amazon Cognito sets it to a default value.
 *
 * @cloudformationResource AWS::Cognito::UserPoolResourceServer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html
 */
export declare class CfnUserPoolResourceServer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolResourceServer";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolResourceServer;
    /**
     * A unique resource server identifier for the resource server. This could be an HTTPS endpoint where the resource server is located. For example: `https://my-weather-api.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-identifier
     */
    identifier: string;
    /**
     * A friendly name for the resource server.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-name
     */
    name: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-userpoolid
     */
    userPoolId: string;
    /**
     * A list of scopes. Each scope is a map with keys `ScopeName` and `ScopeDescription` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolresourceserver.html#cfn-cognito-userpoolresourceserver-scopes
     */
    scopes: Array<CfnUserPoolResourceServer.ResourceServerScopeTypeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolResourceServer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolResourceServerProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPoolResourceServer {
    /**
     * A resource server scope.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html
     */
    interface ResourceServerScopeTypeProperty {
        /**
         * A description of the scope.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html#cfn-cognito-userpoolresourceserver-resourceserverscopetype-scopedescription
         */
        readonly scopeDescription: string;
        /**
         * The name of the scope.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolresourceserver-resourceserverscopetype.html#cfn-cognito-userpoolresourceserver-resourceserverscopetype-scopename
         */
        readonly scopeName: string;
    }
}
/**
 * Properties for defining a `CfnUserPoolRiskConfigurationAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html
 */
export interface CfnUserPoolRiskConfigurationAttachmentProps {
    /**
     * The app client ID. You can specify the risk configuration for a single client (with a specific ClientId) or for all clients (by setting the ClientId to `ALL` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-clientid
     */
    readonly clientId: string;
    /**
     * The user pool ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-userpoolid
     */
    readonly userPoolId: string;
    /**
     * The account takeover risk configuration object, including the `NotifyConfiguration` object and `Actions` to take if there is an account takeover.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfiguration
     */
    readonly accountTakeoverRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty | cdk.IResolvable;
    /**
     * The compromised credentials risk configuration object, including the `EventFilter` and the `EventAction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfiguration
     */
    readonly compromisedCredentialsRiskConfiguration?: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty | cdk.IResolvable;
    /**
     * The configuration to override the risk decision.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfiguration
     */
    readonly riskExceptionConfiguration?: CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolRiskConfigurationAttachment`
 *
 * The `AWS::Cognito::UserPoolRiskConfigurationAttachment` resource sets the risk configuration that is used for Amazon Cognito advanced security features.
 *
 * You can specify risk configuration for a single client (with a specific `clientId` ) or for all clients (by setting the `clientId` to `ALL` ). If you specify `ALL` , the default configuration is used for every client that has had no risk configuration set previously. If you specify risk configuration for a particular client, it no longer falls back to the `ALL` configuration.
 *
 * @cloudformationResource AWS::Cognito::UserPoolRiskConfigurationAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html
 */
export declare class CfnUserPoolRiskConfigurationAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolRiskConfigurationAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolRiskConfigurationAttachment;
    /**
     * The app client ID. You can specify the risk configuration for a single client (with a specific ClientId) or for all clients (by setting the ClientId to `ALL` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-clientid
     */
    clientId: string;
    /**
     * The user pool ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-userpoolid
     */
    userPoolId: string;
    /**
     * The account takeover risk configuration object, including the `NotifyConfiguration` object and `Actions` to take if there is an account takeover.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfiguration
     */
    accountTakeoverRiskConfiguration: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverRiskConfigurationTypeProperty | cdk.IResolvable | undefined;
    /**
     * The compromised credentials risk configuration object, including the `EventFilter` and the `EventAction` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfiguration
     */
    compromisedCredentialsRiskConfiguration: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsRiskConfigurationTypeProperty | cdk.IResolvable | undefined;
    /**
     * The configuration to override the risk decision.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfiguration
     */
    riskExceptionConfiguration: CfnUserPoolRiskConfigurationAttachment.RiskExceptionConfigurationTypeProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolRiskConfigurationAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolRiskConfigurationAttachmentProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * Account takeover action type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html
     */
    interface AccountTakeoverActionTypeProperty {
        /**
         * The action to take in response to the account takeover action. Valid values are as follows:
         *
         * - `BLOCK` Choosing this action will block the request.
         * - `MFA_IF_CONFIGURED` Present an MFA challenge if user has configured it, else allow the request.
         * - `MFA_REQUIRED` Present an MFA challenge if user has configured it, else block the request.
         * - `NO_ACTION` Allow the user to sign in.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype-eventaction
         */
        readonly eventAction: string;
        /**
         * Flag specifying whether to send a notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype-notify
         */
        readonly notify: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * Account takeover actions type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html
     */
    interface AccountTakeoverActionsTypeProperty {
        /**
         * Action to take for a high risk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-highaction
         */
        readonly highAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;
        /**
         * Action to take for a low risk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-lowaction
         */
        readonly lowAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;
        /**
         * Action to take for a medium risk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractionstype-mediumaction
         */
        readonly mediumAction?: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionTypeProperty | cdk.IResolvable;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * Configuration for mitigation actions and notification for different levels of risk detected for a potential account takeover.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html
     */
    interface AccountTakeoverRiskConfigurationTypeProperty {
        /**
         * Account takeover risk configuration actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype-actions
         */
        readonly actions: CfnUserPoolRiskConfigurationAttachment.AccountTakeoverActionsTypeProperty | cdk.IResolvable;
        /**
         * The notify configuration used to construct email notifications.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoverriskconfigurationtype-notifyconfiguration
         */
        readonly notifyConfiguration?: CfnUserPoolRiskConfigurationAttachment.NotifyConfigurationTypeProperty | cdk.IResolvable;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * The compromised credentials actions type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype.html
     */
    interface CompromisedCredentialsActionsTypeProperty {
        /**
         * The event action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsactionstype-eventaction
         */
        readonly eventAction: string;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * The compromised credentials risk configuration type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html
     */
    interface CompromisedCredentialsRiskConfigurationTypeProperty {
        /**
         * The compromised credentials risk configuration actions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype-actions
         */
        readonly actions: CfnUserPoolRiskConfigurationAttachment.CompromisedCredentialsActionsTypeProperty | cdk.IResolvable;
        /**
         * Perform the action for these events. The default is to perform all events if no event filter is specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-compromisedcredentialsriskconfigurationtype-eventfilter
         */
        readonly eventFilter?: string[];
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * The notify configuration type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html
     */
    interface NotifyConfigurationTypeProperty {
        /**
         * Email template used when a detected risk event is blocked.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-blockemail
         */
        readonly blockEmail?: CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty | cdk.IResolvable;
        /**
         * The email address that is sending the email. The address must be either individually verified with Amazon Simple Email Service, or from a domain that has been verified with Amazon SES.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-from
         */
        readonly from?: string;
        /**
         * The multi-factor authentication (MFA) email template used when MFA is challenged as part of a detected risk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-mfaemail
         */
        readonly mfaEmail?: CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty | cdk.IResolvable;
        /**
         * The email template used when a detected risk event is allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-noactionemail
         */
        readonly noActionEmail?: CfnUserPoolRiskConfigurationAttachment.NotifyEmailTypeProperty | cdk.IResolvable;
        /**
         * The destination to which the receiver of an email should reply to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-replyto
         */
        readonly replyTo?: string;
        /**
         * The Amazon Resource Name (ARN) of the identity that is associated with the sending authorization policy. This identity permits Amazon Cognito to send for the email address specified in the `From` parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype-sourcearn
         */
        readonly sourceArn: string;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * The notify email type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html
     */
    interface NotifyEmailTypeProperty {
        /**
         * The email HTML body.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-htmlbody
         */
        readonly htmlBody?: string;
        /**
         * The email subject.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-subject
         */
        readonly subject: string;
        /**
         * The email text body.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyemailtype.html#cfn-cognito-userpoolriskconfigurationattachment-notifyemailtype-textbody
         */
        readonly textBody?: string;
    }
}
export declare namespace CfnUserPoolRiskConfigurationAttachment {
    /**
     * The type of the configuration to override the risk decision.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html
     */
    interface RiskExceptionConfigurationTypeProperty {
        /**
         * Overrides the risk decision to always block the pre-authentication requests. The IP range is in CIDR notation, a compact representation of an IP address and its routing prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype-blockediprangelist
         */
        readonly blockedIpRangeList?: string[];
        /**
         * Risk detection isn't performed on the IP addresses in this range list. The IP range is in CIDR notation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfigurationtype-skippediprangelist
         */
        readonly skippedIpRangeList?: string[];
    }
}
/**
 * Properties for defining a `CfnUserPoolUICustomizationAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html
 */
export interface CfnUserPoolUICustomizationAttachmentProps {
    /**
     * The client ID for the client app. You can specify the UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to `ALL` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-clientid
     */
    readonly clientId: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-userpoolid
     */
    readonly userPoolId: string;
    /**
     * The CSS values in the UI customization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-css
     */
    readonly css?: string;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolUICustomizationAttachment`
 *
 * The `AWS::Cognito::UserPoolUICustomizationAttachment` resource sets the UI customization information for a user pool's built-in app UI.
 *
 * You can specify app UI customization settings for a single client (with a specific `clientId` ) or for all clients (by setting the `clientId` to `ALL` ). If you specify `ALL` , the default configuration is used for every client that has had no UI customization set previously. If you specify UI customization settings for a particular client, it no longer falls back to the `ALL` configuration.
 *
 * > Before you create this resource, your user pool must have a domain associated with it. You can create an `AWS::Cognito::UserPoolDomain` resource first in this user pool.
 *
 * Setting a logo image isn't supported from AWS CloudFormation . Use the Amazon Cognito [SetUICustomization](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SetUICustomization.html#API_SetUICustomization_RequestSyntax) API operation to set the image.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUICustomizationAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html
 */
export declare class CfnUserPoolUICustomizationAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolUICustomizationAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUICustomizationAttachment;
    /**
     * The client ID for the client app. You can specify the UI customization settings for a single client (with a specific clientId) or for all clients (by setting the clientId to `ALL` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-clientid
     */
    clientId: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-userpoolid
     */
    userPoolId: string;
    /**
     * The CSS values in the UI customization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluicustomizationattachment.html#cfn-cognito-userpooluicustomizationattachment-css
     */
    css: string | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolUICustomizationAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUICustomizationAttachmentProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnUserPoolUser`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html
 */
export interface CfnUserPoolUserProps {
    /**
     * The user pool ID for the user pool where the user will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userpoolid
     */
    readonly userPoolId: string;
    /**
     * A map of custom key-value pairs that you can provide as input for the custom workflow that is invoked by the *pre sign-up* trigger.
     *
     * You create custom workflows by assigning AWS Lambda functions to user pool triggers. When you create a `UserPoolUser` resource and include the `ClientMetadata` property, Amazon Cognito invokes the function that is assigned to the *pre sign-up* trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a `clientMetadata` attribute, which provides the data that you assigned to the ClientMetadata property. In your function code in AWS Lambda , you can process the `clientMetadata` value to enhance your workflow for your specific needs.
     *
     * For more information, see [Customizing User Pool Workflows with Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html) in the *Amazon Cognito Developer Guide* .
     *
     * > Take the following limitations into consideration when you use the ClientMetadata parameter:
     * >
     * > - Amazon Cognito does not store the ClientMetadata value. This data is available only to AWS Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.
     * > - Amazon Cognito does not validate the ClientMetadata value.
     * > - Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-clientmetadata
     */
    readonly clientMetadata?: any | cdk.IResolvable;
    /**
     * Specify `"EMAIL"` if email will be used to send the welcome message. Specify `"SMS"` if the phone number will be used. The default value is `"SMS"` . You can specify more than one value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-desireddeliverymediums
     */
    readonly desiredDeliveryMediums?: string[];
    /**
     * This parameter is used only if the `phone_number_verified` or `email_verified` attribute is set to `True` . Otherwise, it is ignored.
     *
     * If this parameter is set to `True` and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias.
     *
     * If this parameter is set to `False` , the API throws an `AliasExistsException` error if the alias already exists. The default value is `False` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-forcealiascreation
     */
    readonly forceAliasCreation?: boolean | cdk.IResolvable;
    /**
     * Set to `RESEND` to resend the invitation message to a user that already exists and reset the expiration limit on the user's account. Set to `SUPPRESS` to suppress sending the message. You can specify only one value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-messageaction
     */
    readonly messageAction?: string;
    /**
     * The user attributes and attribute values to be set for the user to be created. These are name-value pairs You can create a user without specifying any attributes other than `Username` . However, any attributes that you specify as required (in [](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPool.html) or in the *Attributes* tab of the console) must be supplied either by you (in your call to `AdminCreateUser` ) or by the user (when they sign up in response to your welcome message).
     *
     * For custom attributes, you must prepend the `custom:` prefix to the attribute name.
     *
     * To send a message inviting the user to sign up, you must specify the user's email address or phone number. This can be done in your call to AdminCreateUser or in the *Users* tab of the Amazon Cognito console for managing your user pools.
     *
     * In your call to `AdminCreateUser` , you can set the `email_verified` attribute to `True` , and you can set the `phone_number_verified` attribute to `True` . (You can also do this by calling [](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html) .)
     *
     * - *email* : The email address of the user to whom the message that contains the code and user name will be sent. Required if the `email_verified` attribute is set to `True` , or if `"EMAIL"` is specified in the `DesiredDeliveryMediums` parameter.
     * - *phone_number* : The phone number of the user to whom the message that contains the code and user name will be sent. Required if the `phone_number_verified` attribute is set to `True` , or if `"SMS"` is specified in the `DesiredDeliveryMediums` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userattributes
     */
    readonly userAttributes?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The username for the user. Must be unique within the user pool. Must be a UTF-8 string between 1 and 128 characters. After the user is created, the username can't be changed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-username
     */
    readonly username?: string;
    /**
     * The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain.
     *
     * To configure custom validation, you must create a Pre Sign-up AWS Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process.
     *
     * The user's validation data isn't persisted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-validationdata
     */
    readonly validationData?: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolUser`
 *
 * The `AWS::Cognito::UserPoolUser` resource creates an Amazon Cognito user pool user.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUser
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html
 */
export declare class CfnUserPoolUser extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolUser";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUser;
    /**
     * The user pool ID for the user pool where the user will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userpoolid
     */
    userPoolId: string;
    /**
     * A map of custom key-value pairs that you can provide as input for the custom workflow that is invoked by the *pre sign-up* trigger.
     *
     * You create custom workflows by assigning AWS Lambda functions to user pool triggers. When you create a `UserPoolUser` resource and include the `ClientMetadata` property, Amazon Cognito invokes the function that is assigned to the *pre sign-up* trigger. When Amazon Cognito invokes this function, it passes a JSON payload, which the function receives as input. This payload contains a `clientMetadata` attribute, which provides the data that you assigned to the ClientMetadata property. In your function code in AWS Lambda , you can process the `clientMetadata` value to enhance your workflow for your specific needs.
     *
     * For more information, see [Customizing User Pool Workflows with Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html) in the *Amazon Cognito Developer Guide* .
     *
     * > Take the following limitations into consideration when you use the ClientMetadata parameter:
     * >
     * > - Amazon Cognito does not store the ClientMetadata value. This data is available only to AWS Lambda triggers that are assigned to a user pool to support custom workflows. If your user pool configuration does not include triggers, the ClientMetadata parameter serves no purpose.
     * > - Amazon Cognito does not validate the ClientMetadata value.
     * > - Amazon Cognito does not encrypt the the ClientMetadata value, so don't use it to provide sensitive information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-clientmetadata
     */
    clientMetadata: any | cdk.IResolvable | undefined;
    /**
     * Specify `"EMAIL"` if email will be used to send the welcome message. Specify `"SMS"` if the phone number will be used. The default value is `"SMS"` . You can specify more than one value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-desireddeliverymediums
     */
    desiredDeliveryMediums: string[] | undefined;
    /**
     * This parameter is used only if the `phone_number_verified` or `email_verified` attribute is set to `True` . Otherwise, it is ignored.
     *
     * If this parameter is set to `True` and the phone number or email address specified in the UserAttributes parameter already exists as an alias with a different user, the API call will migrate the alias from the previous user to the newly created user. The previous user will no longer be able to log in using that alias.
     *
     * If this parameter is set to `False` , the API throws an `AliasExistsException` error if the alias already exists. The default value is `False` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-forcealiascreation
     */
    forceAliasCreation: boolean | cdk.IResolvable | undefined;
    /**
     * Set to `RESEND` to resend the invitation message to a user that already exists and reset the expiration limit on the user's account. Set to `SUPPRESS` to suppress sending the message. You can specify only one value.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-messageaction
     */
    messageAction: string | undefined;
    /**
     * The user attributes and attribute values to be set for the user to be created. These are name-value pairs You can create a user without specifying any attributes other than `Username` . However, any attributes that you specify as required (in [](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPool.html) or in the *Attributes* tab of the console) must be supplied either by you (in your call to `AdminCreateUser` ) or by the user (when they sign up in response to your welcome message).
     *
     * For custom attributes, you must prepend the `custom:` prefix to the attribute name.
     *
     * To send a message inviting the user to sign up, you must specify the user's email address or phone number. This can be done in your call to AdminCreateUser or in the *Users* tab of the Amazon Cognito console for managing your user pools.
     *
     * In your call to `AdminCreateUser` , you can set the `email_verified` attribute to `True` , and you can set the `phone_number_verified` attribute to `True` . (You can also do this by calling [](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html) .)
     *
     * - *email* : The email address of the user to whom the message that contains the code and user name will be sent. Required if the `email_verified` attribute is set to `True` , or if `"EMAIL"` is specified in the `DesiredDeliveryMediums` parameter.
     * - *phone_number* : The phone number of the user to whom the message that contains the code and user name will be sent. Required if the `phone_number_verified` attribute is set to `True` , or if `"SMS"` is specified in the `DesiredDeliveryMediums` parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userattributes
     */
    userAttributes: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The username for the user. Must be unique within the user pool. Must be a UTF-8 string between 1 and 128 characters. After the user is created, the username can't be changed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-username
     */
    username: string | undefined;
    /**
     * The user's validation data. This is an array of name-value pairs that contain user attributes and attribute values that you can use for custom validation, such as restricting the types of user accounts that can be registered. For example, you might choose to allow or disallow user sign-up based on the user's domain.
     *
     * To configure custom validation, you must create a Pre Sign-up AWS Lambda trigger for the user pool as described in the Amazon Cognito Developer Guide. The Lambda trigger receives the validation data and uses it in the validation process.
     *
     * The user's validation data isn't persisted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-validationdata
     */
    validationData: Array<CfnUserPoolUser.AttributeTypeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Cognito::UserPoolUser`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUserProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnUserPoolUser {
    /**
     * Specifies whether the attribute is standard or custom.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html
     */
    interface AttributeTypeProperty {
        /**
         * The name of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html#cfn-cognito-userpooluser-attributetype-name
         */
        readonly name?: string;
        /**
         * The value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpooluser-attributetype.html#cfn-cognito-userpooluser-attributetype-value
         */
        readonly value?: string;
    }
}
/**
 * Properties for defining a `CfnUserPoolUserToGroupAttachment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html
 */
export interface CfnUserPoolUserToGroupAttachmentProps {
    /**
     * The group name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-groupname
     */
    readonly groupName: string;
    /**
     * The username for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-username
     */
    readonly username: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-userpoolid
     */
    readonly userPoolId: string;
}
/**
 * A CloudFormation `AWS::Cognito::UserPoolUserToGroupAttachment`
 *
 * Adds the specified user to the specified group.
 *
 * Calling this action requires developer credentials.
 *
 * @cloudformationResource AWS::Cognito::UserPoolUserToGroupAttachment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html
 */
export declare class CfnUserPoolUserToGroupAttachment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Cognito::UserPoolUserToGroupAttachment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserPoolUserToGroupAttachment;
    /**
     * The group name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-groupname
     */
    groupName: string;
    /**
     * The username for the user.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-username
     */
    username: string;
    /**
     * The user pool ID for the user pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html#cfn-cognito-userpoolusertogroupattachment-userpoolid
     */
    userPoolId: string;
    /**
     * Create a new `AWS::Cognito::UserPoolUserToGroupAttachment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnUserPoolUserToGroupAttachmentProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
