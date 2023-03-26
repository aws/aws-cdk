import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html
 */
export interface CfnWorkspaceProps {
    /**
     * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization. If this is `ORGANIZATION` , the `workspaceOrganizationalUnits` parameter specifies which organizational units the workspace can access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-accountaccesstype
     */
    readonly accountAccessType?: string;
    /**
     * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center (successor to AWS Single Sign-On) , or both to authenticate users for using the Grafana console within a workspace. For more information, see [User authentication in Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-authenticationproviders
     */
    readonly authenticationProviders?: string[];
    /**
     * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-clienttoken
     */
    readonly clientToken?: string;
    /**
     * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-datasources
     */
    readonly dataSources?: string[];
    /**
     * The user-defined description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-description
     */
    readonly description?: string;
    /**
     * The name of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-name
     */
    readonly name?: string;
    /**
     * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-notificationdestinations
     */
    readonly notificationDestinations?: string[];
    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationalunits
     */
    readonly organizationalUnits?: string[];
    /**
     * The name of the IAM role that is used to access resources through Organizations .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationrolename
     */
    readonly organizationRoleName?: string;
    /**
     * If this is `Service Managed` , Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
     *
     * If this is `CUSTOMER_MANAGED` , you manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other AWS accounts in the organization, you must choose `CUSTOMER_MANAGED` .
     *
     * For more information, see [Amazon Managed Grafana permissions and policies for AWS data sources and notification channels](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-permissiontype
     */
    readonly permissionType?: string;
    /**
     * The IAM role that grants permissions to the AWS resources that the workspace will view data from. This role must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-rolearn
     */
    readonly roleArn?: string;
    /**
     * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the `Admin` and `Editor` roles in the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-samlconfiguration
     */
    readonly samlConfiguration?: CfnWorkspace.SamlConfigurationProperty | cdk.IResolvable;
    /**
     * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-stacksetname
     */
    readonly stackSetName?: string;
    /**
     * The configuration for connecting to data sources in a private VPC ( Amazon Virtual Private Cloud ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnWorkspace.VpcConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Grafana::Workspace`
 *
 * Specifies a *workspace* . In a workspace, you can create Grafana dashboards and visualizations to analyze your metrics, logs, and traces. You don't have to build, package, or deploy any hardware to run the Grafana server.
 *
 * @cloudformationResource AWS::Grafana::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html
 */
export declare class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Grafana::Workspace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace;
    /**
     * The date that the workspace was created.
     *
     * Type: Timestamp
     * @cloudformationAttribute CreationTimestamp
     */
    readonly attrCreationTimestamp: string;
    /**
     * The URL that users can use to access the Grafana console in the workspace.
     *
     * Type: String
     * @cloudformationAttribute Endpoint
     */
    readonly attrEndpoint: string;
    /**
     * The version of Grafana supported in this workspace.
     *
     * Type: String
     * @cloudformationAttribute GrafanaVersion
     */
    readonly attrGrafanaVersion: string;
    /**
     * The unique ID of this workspace.
     *
     * Type: String
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The most recent date that the workspace was modified.
     *
     * Type: Timestamp
     * @cloudformationAttribute ModificationTimestamp
     */
    readonly attrModificationTimestamp: string;
    /**
     * Specifies whether the workspace's SAML configuration is complete.
     *
     * Valid values: `CONFIGURED | NOT_CONFIGURED`
     *
     * Type: String
     * @cloudformationAttribute SamlConfigurationStatus
     */
    readonly attrSamlConfigurationStatus: string;
    /**
     * The ID of the IAM Identity Center-managed application that is created by Amazon Managed Grafana .
     *
     * Type: String
     * @cloudformationAttribute SsoClientId
     */
    readonly attrSsoClientId: string;
    /**
     * The current status of the workspace.
     *
     * Valid values: `ACTIVE | CREATING | DELETING | FAILED | UPDATING | UPGRADING | DELETION_FAILED | CREATION_FAILED | UPDATE_FAILED | UPGRADE_FAILED | LICENSE_REMOVAL_FAILED`
     *
     * Type: String
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization. If this is `ORGANIZATION` , the `workspaceOrganizationalUnits` parameter specifies which organizational units the workspace can access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-accountaccesstype
     */
    accountAccessType: string | undefined;
    /**
     * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center (successor to AWS Single Sign-On) , or both to authenticate users for using the Grafana console within a workspace. For more information, see [User authentication in Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-authenticationproviders
     */
    authenticationProviders: string[] | undefined;
    /**
     * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-clienttoken
     */
    clientToken: string | undefined;
    /**
     * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-datasources
     */
    dataSources: string[] | undefined;
    /**
     * The user-defined description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-description
     */
    description: string | undefined;
    /**
     * The name of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-name
     */
    name: string | undefined;
    /**
     * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-notificationdestinations
     */
    notificationDestinations: string[] | undefined;
    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationalunits
     */
    organizationalUnits: string[] | undefined;
    /**
     * The name of the IAM role that is used to access resources through Organizations .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationrolename
     */
    organizationRoleName: string | undefined;
    /**
     * If this is `Service Managed` , Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
     *
     * If this is `CUSTOMER_MANAGED` , you manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other AWS accounts in the organization, you must choose `CUSTOMER_MANAGED` .
     *
     * For more information, see [Amazon Managed Grafana permissions and policies for AWS data sources and notification channels](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-permissiontype
     */
    permissionType: string | undefined;
    /**
     * The IAM role that grants permissions to the AWS resources that the workspace will view data from. This role must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-rolearn
     */
    roleArn: string | undefined;
    /**
     * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the `Admin` and `Editor` roles in the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-samlconfiguration
     */
    samlConfiguration: CfnWorkspace.SamlConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-stacksetname
     */
    stackSetName: string | undefined;
    /**
     * The configuration for connecting to data sources in a private VPC ( Amazon Virtual Private Cloud ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-vpcconfiguration
     */
    vpcConfiguration: CfnWorkspace.VpcConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Grafana::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnWorkspaceProps);
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
export declare namespace CfnWorkspace {
    /**
     * A structure that defines which attributes in the IdP assertion are to be used to define information about the users authenticated by the IdP to use the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html
     */
    interface AssertionAttributesProperty {
        /**
         * The name of the attribute within the SAML assertion to use as the email names for SAML users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-email
         */
        readonly email?: string;
        /**
         * The name of the attribute within the SAML assertion to use as the user full "friendly" names for user groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-groups
         */
        readonly groups?: string;
        /**
         * The name of the attribute within the SAML assertion to use as the login names for SAML users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-login
         */
        readonly login?: string;
        /**
         * The name of the attribute within the SAML assertion to use as the user full "friendly" names for SAML users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-name
         */
        readonly name?: string;
        /**
         * The name of the attribute within the SAML assertion to use as the user full "friendly" names for the users' organizations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-org
         */
        readonly org?: string;
        /**
         * The name of the attribute within the SAML assertion to use as the user roles.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-role
         */
        readonly role?: string;
    }
}
export declare namespace CfnWorkspace {
    /**
     * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace. You can specify the metadata either by providing a URL to its location in the `url` parameter, or by specifying the full metadata in XML format in the `xml` parameter. Specifying both will cause an error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html
     */
    interface IdpMetadataProperty {
        /**
         * The URL of the location containing the IdP metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html#cfn-grafana-workspace-idpmetadata-url
         */
        readonly url?: string;
        /**
         * The full IdP metadata, in XML format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html#cfn-grafana-workspace-idpmetadata-xml
         */
        readonly xml?: string;
    }
}
export declare namespace CfnWorkspace {
    /**
     * This structure defines which groups defined in the SAML assertion attribute are to be mapped to the Grafana `Admin` and `Editor` roles in the workspace. SAML authenticated users not part of `Admin` or `Editor` role groups have `Viewer` permission over the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html
     */
    interface RoleValuesProperty {
        /**
         * A list of groups from the SAML assertion attribute to grant the Grafana `Admin` role to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html#cfn-grafana-workspace-rolevalues-admin
         */
        readonly admin?: string[];
        /**
         * A list of groups from the SAML assertion attribute to grant the Grafana `Editor` role to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html#cfn-grafana-workspace-rolevalues-editor
         */
        readonly editor?: string[];
    }
}
export declare namespace CfnWorkspace {
    /**
     * A structure containing information about how this workspace works with SAML.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html
     */
    interface SamlConfigurationProperty {
        /**
         * Lists which organizations defined in the SAML assertion are allowed to use the Amazon Managed Grafana workspace. If this is empty, all organizations in the assertion attribute have access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-allowedorganizations
         */
        readonly allowedOrganizations?: string[];
        /**
         * A structure that defines which attributes in the SAML assertion are to be used to define information about the users authenticated by that IdP to use the workspace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-assertionattributes
         */
        readonly assertionAttributes?: CfnWorkspace.AssertionAttributesProperty | cdk.IResolvable;
        /**
         * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-idpmetadata
         */
        readonly idpMetadata: CfnWorkspace.IdpMetadataProperty | cdk.IResolvable;
        /**
         * How long a sign-on session by a SAML user is valid, before the user has to sign on again.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-loginvalidityduration
         */
        readonly loginValidityDuration?: number;
        /**
         * A structure containing arrays that map group names in the SAML assertion to the Grafana `Admin` and `Editor` roles in the workspace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-rolevalues
         */
        readonly roleValues?: CfnWorkspace.RoleValuesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnWorkspace {
    /**
     * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
     *
     * > Provided `securityGroupIds` and `subnetIds` must be part of the same VPC.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html
     */
    interface VpcConfigurationProperty {
        /**
         * The list of Amazon EC2 security group IDs attached to the Amazon VPC for your Grafana workspace to connect. Duplicates not allowed.
         *
         * *Array Members* : Minimum number of 1 items. Maximum number of 5 items.
         *
         * *Length* : Minimum length of 0. Maximum length of 255.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html#cfn-grafana-workspace-vpcconfiguration-securitygroupids
         */
        readonly securityGroupIds: string[];
        /**
         * The list of Amazon EC2 subnet IDs created in the Amazon VPC for your Grafana workspace to connect. Duplicates not allowed.
         *
         * *Array Members* : Minimum number of 2 items. Maximum number of 6 items.
         *
         * *Length* : Minimum length of 0. Maximum length of 255.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html#cfn-grafana-workspace-vpcconfiguration-subnetids
         */
        readonly subnetIds: string[];
    }
}
