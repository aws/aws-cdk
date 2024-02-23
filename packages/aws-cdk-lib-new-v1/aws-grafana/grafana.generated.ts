/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a *workspace* .
 *
 * In a workspace, you can create Grafana dashboards and visualizations to analyze your metrics, logs, and traces. You don't have to build, package, or deploy any hardware to run the Grafana server.
 *
 * @cloudformationResource AWS::Grafana::Workspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Grafana::Workspace";

  /**
   * Build a CfnWorkspace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkspacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date that the workspace was created.
   *
   * Type: Timestamp
   *
   * @cloudformationAttribute CreationTimestamp
   */
  public readonly attrCreationTimestamp: string;

  /**
   * The URL that users can use to access the Grafana console in the workspace.
   *
   * Type: String
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * Specifies the version of Grafana supported by this workspace.
   *
   * Type: String
   *
   * @cloudformationAttribute GrafanaVersion
   */
  public readonly attrGrafanaVersion: string;

  /**
   * The unique ID of this workspace.
   *
   * Type: String
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The most recent date that the workspace was modified.
   *
   * Type: Timestamp
   *
   * @cloudformationAttribute ModificationTimestamp
   */
  public readonly attrModificationTimestamp: string;

  /**
   * Specifies whether the workspace's SAML configuration is complete.
   *
   * Valid values: `CONFIGURED | NOT_CONFIGURED`
   *
   * Type: String
   *
   * @cloudformationAttribute SamlConfigurationStatus
   */
  public readonly attrSamlConfigurationStatus: string;

  /**
   * The ID of the IAM Identity Center-managed application that is created by Amazon Managed Grafana .
   *
   * Type: String
   *
   * @cloudformationAttribute SsoClientId
   */
  public readonly attrSsoClientId: string;

  /**
   * The current status of the workspace.
   *
   * Valid values: `ACTIVE | CREATING | DELETING | FAILED | UPDATING | UPGRADING | DELETION_FAILED | CREATION_FAILED | UPDATE_FAILED | UPGRADE_FAILED | LICENSE_REMOVAL_FAILED`
   *
   * Type: String
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization.
   */
  public accountAccessType: string;

  /**
   * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center , or both to authenticate users for using the Grafana console within a workspace. For more information, see [User authentication in Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) .
   */
  public authenticationProviders: Array<string>;

  /**
   * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
   */
  public clientToken?: string;

  /**
   * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
   */
  public dataSources?: Array<string>;

  /**
   * The user-defined description of the workspace.
   */
  public description?: string;

  /**
   * Specifies the version of Grafana to support in the workspace.
   */
  public grafanaVersion?: string;

  /**
   * The name of the workspace.
   */
  public name?: string;

  /**
   * The configuration settings for network access to your workspace.
   */
  public networkAccessControl?: cdk.IResolvable | CfnWorkspace.NetworkAccessControlProperty;

  /**
   * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
   */
  public notificationDestinations?: Array<string>;

  /**
   * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
   */
  public organizationalUnits?: Array<string>;

  /**
   * The name of the IAM role that is used to access resources through Organizations .
   */
  public organizationRoleName?: string;

  /**
   * If this is `SERVICE_MANAGED` , and the workplace was created through the Amazon Managed Grafana console, then Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
   */
  public permissionType: string;

  /**
   * Whether plugin administration is enabled in the workspace.
   */
  public pluginAdminEnabled?: boolean | cdk.IResolvable;

  /**
   * The IAM role that grants permissions to the AWS resources that the workspace will view data from.
   */
  public roleArn?: string;

  /**
   * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the `Admin` and `Editor` roles in the workspace.
   */
  public samlConfiguration?: cdk.IResolvable | CfnWorkspace.SamlConfigurationProperty;

  /**
   * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
   */
  public stackSetName?: string;

  /**
   * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
   */
  public vpcConfiguration?: cdk.IResolvable | CfnWorkspace.VpcConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps) {
    super(scope, id, {
      "type": CfnWorkspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountAccessType", this);
    cdk.requireProperty(props, "authenticationProviders", this);
    cdk.requireProperty(props, "permissionType", this);

    this.attrCreationTimestamp = cdk.Token.asString(this.getAtt("CreationTimestamp", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrGrafanaVersion = cdk.Token.asString(this.getAtt("GrafanaVersion", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrModificationTimestamp = cdk.Token.asString(this.getAtt("ModificationTimestamp", cdk.ResolutionTypeHint.STRING));
    this.attrSamlConfigurationStatus = cdk.Token.asString(this.getAtt("SamlConfigurationStatus", cdk.ResolutionTypeHint.STRING));
    this.attrSsoClientId = cdk.Token.asString(this.getAtt("SsoClientId", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.accountAccessType = props.accountAccessType;
    this.authenticationProviders = props.authenticationProviders;
    this.clientToken = props.clientToken;
    this.dataSources = props.dataSources;
    this.description = props.description;
    this.grafanaVersion = props.grafanaVersion;
    this.name = props.name;
    this.networkAccessControl = props.networkAccessControl;
    this.notificationDestinations = props.notificationDestinations;
    this.organizationalUnits = props.organizationalUnits;
    this.organizationRoleName = props.organizationRoleName;
    this.permissionType = props.permissionType;
    this.pluginAdminEnabled = props.pluginAdminEnabled;
    this.roleArn = props.roleArn;
    this.samlConfiguration = props.samlConfiguration;
    this.stackSetName = props.stackSetName;
    this.vpcConfiguration = props.vpcConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountAccessType": this.accountAccessType,
      "authenticationProviders": this.authenticationProviders,
      "clientToken": this.clientToken,
      "dataSources": this.dataSources,
      "description": this.description,
      "grafanaVersion": this.grafanaVersion,
      "name": this.name,
      "networkAccessControl": this.networkAccessControl,
      "notificationDestinations": this.notificationDestinations,
      "organizationalUnits": this.organizationalUnits,
      "organizationRoleName": this.organizationRoleName,
      "permissionType": this.permissionType,
      "pluginAdminEnabled": this.pluginAdminEnabled,
      "roleArn": this.roleArn,
      "samlConfiguration": this.samlConfiguration,
      "stackSetName": this.stackSetName,
      "vpcConfiguration": this.vpcConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkspacePropsToCloudFormation(props);
  }
}

export namespace CfnWorkspace {
  /**
   * A structure containing information about how this workspace works with SAML.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html
   */
  export interface SamlConfigurationProperty {
    /**
     * Lists which organizations defined in the SAML assertion are allowed to use the Amazon Managed Grafana workspace.
     *
     * If this is empty, all organizations in the assertion attribute have access.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-allowedorganizations
     */
    readonly allowedOrganizations?: Array<string>;

    /**
     * A structure that defines which attributes in the SAML assertion are to be used to define information about the users authenticated by that IdP to use the workspace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-assertionattributes
     */
    readonly assertionAttributes?: CfnWorkspace.AssertionAttributesProperty | cdk.IResolvable;

    /**
     * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-idpmetadata
     */
    readonly idpMetadata: CfnWorkspace.IdpMetadataProperty | cdk.IResolvable;

    /**
     * How long a sign-on session by a SAML user is valid, before the user has to sign on again.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-loginvalidityduration
     */
    readonly loginValidityDuration?: number;

    /**
     * A structure containing arrays that map group names in the SAML assertion to the Grafana `Admin` and `Editor` roles in the workspace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html#cfn-grafana-workspace-samlconfiguration-rolevalues
     */
    readonly roleValues?: cdk.IResolvable | CfnWorkspace.RoleValuesProperty;
  }

  /**
   * This structure defines which groups defined in the SAML assertion attribute are to be mapped to the Grafana `Admin` and `Editor` roles in the workspace.
   *
   * SAML authenticated users not part of `Admin` or `Editor` role groups have `Viewer` permission over the workspace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html
   */
  export interface RoleValuesProperty {
    /**
     * A list of groups from the SAML assertion attribute to grant the Grafana `Admin` role to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html#cfn-grafana-workspace-rolevalues-admin
     */
    readonly admin?: Array<string>;

    /**
     * A list of groups from the SAML assertion attribute to grant the Grafana `Editor` role to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html#cfn-grafana-workspace-rolevalues-editor
     */
    readonly editor?: Array<string>;
  }

  /**
   * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace.
   *
   * You can specify the metadata either by providing a URL to its location in the `url` parameter, or by specifying the full metadata in XML format in the `xml` parameter. Specifying both will cause an error.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html
   */
  export interface IdpMetadataProperty {
    /**
     * The URL of the location containing the IdP metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html#cfn-grafana-workspace-idpmetadata-url
     */
    readonly url?: string;

    /**
     * The full IdP metadata, in XML format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html#cfn-grafana-workspace-idpmetadata-xml
     */
    readonly xml?: string;
  }

  /**
   * A structure that defines which attributes in the IdP assertion are to be used to define information about the users authenticated by the IdP to use the workspace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html
   */
  export interface AssertionAttributesProperty {
    /**
     * The name of the attribute within the SAML assertion to use as the email names for SAML users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-email
     */
    readonly email?: string;

    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for user groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-groups
     */
    readonly groups?: string;

    /**
     * The name of the attribute within the SAML assertion to use as the login names for SAML users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-login
     */
    readonly login?: string;

    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for SAML users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-name
     */
    readonly name?: string;

    /**
     * The name of the attribute within the SAML assertion to use as the user full "friendly" names for the users' organizations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-org
     */
    readonly org?: string;

    /**
     * The name of the attribute within the SAML assertion to use as the user roles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html#cfn-grafana-workspace-assertionattributes-role
     */
    readonly role?: string;
  }

  /**
   * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
   *
   * > Provided `securityGroupIds` and `subnetIds` must be part of the same VPC.
   * >
   * > Connecting to a private VPC is not yet available in the Asia Pacific (Seoul) Region (ap-northeast-2).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html
   */
  export interface VpcConfigurationProperty {
    /**
     * The list of Amazon EC2 security group IDs attached to the Amazon VPC for your Grafana workspace to connect.
     *
     * Duplicates not allowed.
     *
     * *Array Members* : Minimum number of 1 items. Maximum number of 5 items.
     *
     * *Length* : Minimum length of 0. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html#cfn-grafana-workspace-vpcconfiguration-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * The list of Amazon EC2 subnet IDs created in the Amazon VPC for your Grafana workspace to connect.
     *
     * Duplicates not allowed.
     *
     * *Array Members* : Minimum number of 2 items. Maximum number of 6 items.
     *
     * *Length* : Minimum length of 0. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-vpcconfiguration.html#cfn-grafana-workspace-vpcconfiguration-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * The configuration settings for in-bound network access to your workspace.
   *
   * When this is configured, only listed IP addresses and VPC endpoints will be able to access your workspace. Standard Grafana authentication and authorization are still required.
   *
   * Access is granted to a caller that is in either the IP address list or the VPC endpoint list - they do not need to be in both.
   *
   * If this is not configured, or is removed, then all IP addresses and VPC endpoints are allowed. Standard Grafana authentication and authorization are still required.
   *
   * > While both `prefixListIds` and `vpceIds` are required, you can pass in an empty array of strings for either parameter if you do not want to allow any of that type.
   * >
   * > If both are passed as empty arrays, no traffic is allowed to the workspace, because only *explicitly* allowed connections are accepted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-networkaccesscontrol.html
   */
  export interface NetworkAccessControlProperty {
    /**
     * An array of prefix list IDs.
     *
     * A prefix list is a list of CIDR ranges of IP addresses. The IP addresses specified are allowed to access your workspace. If the list is not included in the configuration (passed an empty array) then no IP addresses are allowed to access the workspace. You create a prefix list using the Amazon VPC console.
     *
     * Prefix list IDs have the format `pl- *1a2b3c4d*` .
     *
     * For more information about prefix lists, see [Group CIDR blocks using managed prefix lists](https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists.html) in the *Amazon Virtual Private Cloud User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-networkaccesscontrol.html#cfn-grafana-workspace-networkaccesscontrol-prefixlistids
     */
    readonly prefixListIds?: Array<string>;

    /**
     * An array of Amazon VPC endpoint IDs for the workspace.
     *
     * You can create VPC endpoints to your Amazon Managed Grafana workspace for access from within a VPC. If a `NetworkAccessConfiguration` is specified then only VPC endpoints specified here are allowed to access the workspace. If you pass in an empty array of strings, then no VPCs are allowed to access the workspace.
     *
     * VPC endpoint IDs have the format `vpce- *1a2b3c4d*` .
     *
     * For more information about creating an interface VPC endpoint, see [Interface VPC endpoints](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints) in the *Amazon Managed Grafana User Guide* .
     *
     * > The only VPC endpoints that can be specified here are interface VPC endpoints for Grafana workspaces (using the `com.amazonaws.[region].grafana-workspace` service endpoint). Other VPC endpoints are ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-networkaccesscontrol.html#cfn-grafana-workspace-networkaccesscontrol-vpceids
     */
    readonly vpceIds?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html
 */
export interface CfnWorkspaceProps {
  /**
   * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization.
   *
   * If this is `ORGANIZATION` , the `OrganizationalUnits` parameter specifies which organizational units the workspace can access.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-accountaccesstype
   */
  readonly accountAccessType: string;

  /**
   * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center , or both to authenticate users for using the Grafana console within a workspace. For more information, see [User authentication in Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-authenticationproviders
   */
  readonly authenticationProviders: Array<string>;

  /**
   * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-clienttoken
   */
  readonly clientToken?: string;

  /**
   * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
   *
   * This list is only used when the workspace was created through the AWS console, and the `permissionType` is `SERVICE_MANAGED` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-datasources
   */
  readonly dataSources?: Array<string>;

  /**
   * The user-defined description of the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-description
   */
  readonly description?: string;

  /**
   * Specifies the version of Grafana to support in the workspace.
   *
   * Defaults to the latest version on create (for example, 9.4), or the current version of the workspace on update.
   *
   * Can only be used to upgrade (for example, from 8.4 to 9.4), not downgrade (for example, from 9.4 to 8.4).
   *
   * To know what versions are available to upgrade to for a specific workspace, see the [ListVersions](https://docs.aws.amazon.com/grafana/latest/APIReference/API_ListVersions.html) operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-grafanaversion
   */
  readonly grafanaVersion?: string;

  /**
   * The name of the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-name
   */
  readonly name?: string;

  /**
   * The configuration settings for network access to your workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-networkaccesscontrol
   */
  readonly networkAccessControl?: cdk.IResolvable | CfnWorkspace.NetworkAccessControlProperty;

  /**
   * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-notificationdestinations
   */
  readonly notificationDestinations?: Array<string>;

  /**
   * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationalunits
   */
  readonly organizationalUnits?: Array<string>;

  /**
   * The name of the IAM role that is used to access resources through Organizations .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationrolename
   */
  readonly organizationRoleName?: string;

  /**
   * If this is `SERVICE_MANAGED` , and the workplace was created through the Amazon Managed Grafana console, then Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
   *
   * If this is `CUSTOMER_MANAGED` , you must manage those roles and permissions yourself.
   *
   * If you are working with a workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other AWS accounts in the organization, this parameter must be set to `CUSTOMER_MANAGED` .
   *
   * For more information about converting between customer and service managed, see [Managing permissions for data sources and notification channels](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-datasource-and-notification.html) . For more information about the roles and permissions that must be managed for customer managed workspaces, see [Amazon Managed Grafana permissions and policies for AWS data sources and notification channels](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-permissiontype
   */
  readonly permissionType: string;

  /**
   * Whether plugin administration is enabled in the workspace.
   *
   * Setting to `true` allows workspace admins to install, uninstall, and update plugins from within the Grafana workspace.
   *
   * > This option is only valid for workspaces that support Grafana version 9 or newer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-pluginadminenabled
   */
  readonly pluginAdminEnabled?: boolean | cdk.IResolvable;

  /**
   * The IAM role that grants permissions to the AWS resources that the workspace will view data from.
   *
   * This role must already exist.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-rolearn
   */
  readonly roleArn?: string;

  /**
   * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the `Admin` and `Editor` roles in the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-samlconfiguration
   */
  readonly samlConfiguration?: cdk.IResolvable | CfnWorkspace.SamlConfigurationProperty;

  /**
   * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-stacksetname
   */
  readonly stackSetName?: string;

  /**
   * The configuration settings for an Amazon VPC that contains data sources for your Grafana workspace to connect to.
   *
   * > Connecting to a private VPC is not yet available in the Asia Pacific (Seoul) Region (ap-northeast-2).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-vpcconfiguration
   */
  readonly vpcConfiguration?: cdk.IResolvable | CfnWorkspace.VpcConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `RoleValuesProperty`
 *
 * @param properties - the TypeScript properties of a `RoleValuesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceRoleValuesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("admin", cdk.listValidator(cdk.validateString))(properties.admin));
  errors.collect(cdk.propertyValidator("editor", cdk.listValidator(cdk.validateString))(properties.editor));
  return errors.wrap("supplied properties not correct for \"RoleValuesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceRoleValuesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceRoleValuesPropertyValidator(properties).assertSuccess();
  return {
    "Admin": cdk.listMapper(cdk.stringToCloudFormation)(properties.admin),
    "Editor": cdk.listMapper(cdk.stringToCloudFormation)(properties.editor)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceRoleValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.RoleValuesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.RoleValuesProperty>();
  ret.addPropertyResult("admin", "Admin", (properties.Admin != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Admin) : undefined));
  ret.addPropertyResult("editor", "Editor", (properties.Editor != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Editor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdpMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `IdpMetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceIdpMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  errors.collect(cdk.propertyValidator("xml", cdk.validateString)(properties.xml));
  return errors.wrap("supplied properties not correct for \"IdpMetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceIdpMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceIdpMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Url": cdk.stringToCloudFormation(properties.url),
    "Xml": cdk.stringToCloudFormation(properties.xml)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceIdpMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.IdpMetadataProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.IdpMetadataProperty>();
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addPropertyResult("xml", "Xml", (properties.Xml != null ? cfn_parse.FromCloudFormation.getString(properties.Xml) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AssertionAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AssertionAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceAssertionAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("email", cdk.validateString)(properties.email));
  errors.collect(cdk.propertyValidator("groups", cdk.validateString)(properties.groups));
  errors.collect(cdk.propertyValidator("login", cdk.validateString)(properties.login));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("org", cdk.validateString)(properties.org));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  return errors.wrap("supplied properties not correct for \"AssertionAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceAssertionAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceAssertionAttributesPropertyValidator(properties).assertSuccess();
  return {
    "Email": cdk.stringToCloudFormation(properties.email),
    "Groups": cdk.stringToCloudFormation(properties.groups),
    "Login": cdk.stringToCloudFormation(properties.login),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Org": cdk.stringToCloudFormation(properties.org),
    "Role": cdk.stringToCloudFormation(properties.role)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceAssertionAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.AssertionAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.AssertionAttributesProperty>();
  ret.addPropertyResult("email", "Email", (properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined));
  ret.addPropertyResult("groups", "Groups", (properties.Groups != null ? cfn_parse.FromCloudFormation.getString(properties.Groups) : undefined));
  ret.addPropertyResult("login", "Login", (properties.Login != null ? cfn_parse.FromCloudFormation.getString(properties.Login) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("org", "Org", (properties.Org != null ? cfn_parse.FromCloudFormation.getString(properties.Org) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SamlConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SamlConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceSamlConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedOrganizations", cdk.listValidator(cdk.validateString))(properties.allowedOrganizations));
  errors.collect(cdk.propertyValidator("assertionAttributes", CfnWorkspaceAssertionAttributesPropertyValidator)(properties.assertionAttributes));
  errors.collect(cdk.propertyValidator("idpMetadata", cdk.requiredValidator)(properties.idpMetadata));
  errors.collect(cdk.propertyValidator("idpMetadata", CfnWorkspaceIdpMetadataPropertyValidator)(properties.idpMetadata));
  errors.collect(cdk.propertyValidator("loginValidityDuration", cdk.validateNumber)(properties.loginValidityDuration));
  errors.collect(cdk.propertyValidator("roleValues", CfnWorkspaceRoleValuesPropertyValidator)(properties.roleValues));
  return errors.wrap("supplied properties not correct for \"SamlConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceSamlConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceSamlConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedOrganizations": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOrganizations),
    "AssertionAttributes": convertCfnWorkspaceAssertionAttributesPropertyToCloudFormation(properties.assertionAttributes),
    "IdpMetadata": convertCfnWorkspaceIdpMetadataPropertyToCloudFormation(properties.idpMetadata),
    "LoginValidityDuration": cdk.numberToCloudFormation(properties.loginValidityDuration),
    "RoleValues": convertCfnWorkspaceRoleValuesPropertyToCloudFormation(properties.roleValues)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceSamlConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.SamlConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.SamlConfigurationProperty>();
  ret.addPropertyResult("allowedOrganizations", "AllowedOrganizations", (properties.AllowedOrganizations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOrganizations) : undefined));
  ret.addPropertyResult("assertionAttributes", "AssertionAttributes", (properties.AssertionAttributes != null ? CfnWorkspaceAssertionAttributesPropertyFromCloudFormation(properties.AssertionAttributes) : undefined));
  ret.addPropertyResult("idpMetadata", "IdpMetadata", (properties.IdpMetadata != null ? CfnWorkspaceIdpMetadataPropertyFromCloudFormation(properties.IdpMetadata) : undefined));
  ret.addPropertyResult("loginValidityDuration", "LoginValidityDuration", (properties.LoginValidityDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoginValidityDuration) : undefined));
  ret.addPropertyResult("roleValues", "RoleValues", (properties.RoleValues != null ? CfnWorkspaceRoleValuesPropertyFromCloudFormation(properties.RoleValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.VpcConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.VpcConfigurationProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkAccessControlProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkAccessControlProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceNetworkAccessControlPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("prefixListIds", cdk.listValidator(cdk.validateString))(properties.prefixListIds));
  errors.collect(cdk.propertyValidator("vpceIds", cdk.listValidator(cdk.validateString))(properties.vpceIds));
  return errors.wrap("supplied properties not correct for \"NetworkAccessControlProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceNetworkAccessControlPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceNetworkAccessControlPropertyValidator(properties).assertSuccess();
  return {
    "PrefixListIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.prefixListIds),
    "VpceIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpceIds)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceNetworkAccessControlPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.NetworkAccessControlProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.NetworkAccessControlProperty>();
  ret.addPropertyResult("prefixListIds", "PrefixListIds", (properties.PrefixListIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PrefixListIds) : undefined));
  ret.addPropertyResult("vpceIds", "VpceIds", (properties.VpceIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpceIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountAccessType", cdk.requiredValidator)(properties.accountAccessType));
  errors.collect(cdk.propertyValidator("accountAccessType", cdk.validateString)(properties.accountAccessType));
  errors.collect(cdk.propertyValidator("authenticationProviders", cdk.requiredValidator)(properties.authenticationProviders));
  errors.collect(cdk.propertyValidator("authenticationProviders", cdk.listValidator(cdk.validateString))(properties.authenticationProviders));
  errors.collect(cdk.propertyValidator("clientToken", cdk.validateString)(properties.clientToken));
  errors.collect(cdk.propertyValidator("dataSources", cdk.listValidator(cdk.validateString))(properties.dataSources));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("grafanaVersion", cdk.validateString)(properties.grafanaVersion));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkAccessControl", CfnWorkspaceNetworkAccessControlPropertyValidator)(properties.networkAccessControl));
  errors.collect(cdk.propertyValidator("notificationDestinations", cdk.listValidator(cdk.validateString))(properties.notificationDestinations));
  errors.collect(cdk.propertyValidator("organizationRoleName", cdk.validateString)(properties.organizationRoleName));
  errors.collect(cdk.propertyValidator("organizationalUnits", cdk.listValidator(cdk.validateString))(properties.organizationalUnits));
  errors.collect(cdk.propertyValidator("permissionType", cdk.requiredValidator)(properties.permissionType));
  errors.collect(cdk.propertyValidator("permissionType", cdk.validateString)(properties.permissionType));
  errors.collect(cdk.propertyValidator("pluginAdminEnabled", cdk.validateBoolean)(properties.pluginAdminEnabled));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("samlConfiguration", CfnWorkspaceSamlConfigurationPropertyValidator)(properties.samlConfiguration));
  errors.collect(cdk.propertyValidator("stackSetName", cdk.validateString)(properties.stackSetName));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnWorkspaceVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnWorkspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspacePropsValidator(properties).assertSuccess();
  return {
    "AccountAccessType": cdk.stringToCloudFormation(properties.accountAccessType),
    "AuthenticationProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.authenticationProviders),
    "ClientToken": cdk.stringToCloudFormation(properties.clientToken),
    "DataSources": cdk.listMapper(cdk.stringToCloudFormation)(properties.dataSources),
    "Description": cdk.stringToCloudFormation(properties.description),
    "GrafanaVersion": cdk.stringToCloudFormation(properties.grafanaVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkAccessControl": convertCfnWorkspaceNetworkAccessControlPropertyToCloudFormation(properties.networkAccessControl),
    "NotificationDestinations": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationDestinations),
    "OrganizationRoleName": cdk.stringToCloudFormation(properties.organizationRoleName),
    "OrganizationalUnits": cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnits),
    "PermissionType": cdk.stringToCloudFormation(properties.permissionType),
    "PluginAdminEnabled": cdk.booleanToCloudFormation(properties.pluginAdminEnabled),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SamlConfiguration": convertCfnWorkspaceSamlConfigurationPropertyToCloudFormation(properties.samlConfiguration),
    "StackSetName": cdk.stringToCloudFormation(properties.stackSetName),
    "VpcConfiguration": convertCfnWorkspaceVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
  ret.addPropertyResult("accountAccessType", "AccountAccessType", (properties.AccountAccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccountAccessType) : undefined));
  ret.addPropertyResult("authenticationProviders", "AuthenticationProviders", (properties.AuthenticationProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationProviders) : undefined));
  ret.addPropertyResult("clientToken", "ClientToken", (properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined));
  ret.addPropertyResult("dataSources", "DataSources", (properties.DataSources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DataSources) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("grafanaVersion", "GrafanaVersion", (properties.GrafanaVersion != null ? cfn_parse.FromCloudFormation.getString(properties.GrafanaVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkAccessControl", "NetworkAccessControl", (properties.NetworkAccessControl != null ? CfnWorkspaceNetworkAccessControlPropertyFromCloudFormation(properties.NetworkAccessControl) : undefined));
  ret.addPropertyResult("notificationDestinations", "NotificationDestinations", (properties.NotificationDestinations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationDestinations) : undefined));
  ret.addPropertyResult("organizationalUnits", "OrganizationalUnits", (properties.OrganizationalUnits != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OrganizationalUnits) : undefined));
  ret.addPropertyResult("organizationRoleName", "OrganizationRoleName", (properties.OrganizationRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationRoleName) : undefined));
  ret.addPropertyResult("permissionType", "PermissionType", (properties.PermissionType != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionType) : undefined));
  ret.addPropertyResult("pluginAdminEnabled", "PluginAdminEnabled", (properties.PluginAdminEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PluginAdminEnabled) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("samlConfiguration", "SamlConfiguration", (properties.SamlConfiguration != null ? CfnWorkspaceSamlConfigurationPropertyFromCloudFormation(properties.SamlConfiguration) : undefined));
  ret.addPropertyResult("stackSetName", "StackSetName", (properties.StackSetName != null ? cfn_parse.FromCloudFormation.getString(properties.StackSetName) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnWorkspaceVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}