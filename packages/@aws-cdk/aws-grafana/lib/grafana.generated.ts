// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:17.693Z","fingerprint":"SyZDJssW89jIiBCbMqggUHkzQo1kFi5SxVDqx8pGJbE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountAccessType', cdk.validateString)(properties.accountAccessType));
    errors.collect(cdk.propertyValidator('authenticationProviders', cdk.listValidator(cdk.validateString))(properties.authenticationProviders));
    errors.collect(cdk.propertyValidator('clientToken', cdk.validateString)(properties.clientToken));
    errors.collect(cdk.propertyValidator('dataSources', cdk.listValidator(cdk.validateString))(properties.dataSources));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('notificationDestinations', cdk.listValidator(cdk.validateString))(properties.notificationDestinations));
    errors.collect(cdk.propertyValidator('organizationRoleName', cdk.validateString)(properties.organizationRoleName));
    errors.collect(cdk.propertyValidator('organizationalUnits', cdk.listValidator(cdk.validateString))(properties.organizationalUnits));
    errors.collect(cdk.propertyValidator('permissionType', cdk.validateString)(properties.permissionType));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('samlConfiguration', CfnWorkspace_SamlConfigurationPropertyValidator)(properties.samlConfiguration));
    errors.collect(cdk.propertyValidator('stackSetName', cdk.validateString)(properties.stackSetName));
    errors.collect(cdk.propertyValidator('vpcConfiguration', CfnWorkspace_VpcConfigurationPropertyValidator)(properties.vpcConfiguration));
    return errors.wrap('supplied properties not correct for "CfnWorkspaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace` resource.
 */
// @ts-ignore TS6133
function cfnWorkspacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspacePropsValidator(properties).assertSuccess();
    return {
        AccountAccessType: cdk.stringToCloudFormation(properties.accountAccessType),
        AuthenticationProviders: cdk.listMapper(cdk.stringToCloudFormation)(properties.authenticationProviders),
        ClientToken: cdk.stringToCloudFormation(properties.clientToken),
        DataSources: cdk.listMapper(cdk.stringToCloudFormation)(properties.dataSources),
        Description: cdk.stringToCloudFormation(properties.description),
        Name: cdk.stringToCloudFormation(properties.name),
        NotificationDestinations: cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationDestinations),
        OrganizationalUnits: cdk.listMapper(cdk.stringToCloudFormation)(properties.organizationalUnits),
        OrganizationRoleName: cdk.stringToCloudFormation(properties.organizationRoleName),
        PermissionType: cdk.stringToCloudFormation(properties.permissionType),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SamlConfiguration: cfnWorkspaceSamlConfigurationPropertyToCloudFormation(properties.samlConfiguration),
        StackSetName: cdk.stringToCloudFormation(properties.stackSetName),
        VpcConfiguration: cfnWorkspaceVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration),
    };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
    ret.addPropertyResult('accountAccessType', 'AccountAccessType', properties.AccountAccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccountAccessType) : undefined);
    ret.addPropertyResult('authenticationProviders', 'AuthenticationProviders', properties.AuthenticationProviders != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AuthenticationProviders) : undefined);
    ret.addPropertyResult('clientToken', 'ClientToken', properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined);
    ret.addPropertyResult('dataSources', 'DataSources', properties.DataSources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.DataSources) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('notificationDestinations', 'NotificationDestinations', properties.NotificationDestinations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.NotificationDestinations) : undefined);
    ret.addPropertyResult('organizationalUnits', 'OrganizationalUnits', properties.OrganizationalUnits != null ? cfn_parse.FromCloudFormation.getStringArray(properties.OrganizationalUnits) : undefined);
    ret.addPropertyResult('organizationRoleName', 'OrganizationRoleName', properties.OrganizationRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationRoleName) : undefined);
    ret.addPropertyResult('permissionType', 'PermissionType', properties.PermissionType != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionType) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('samlConfiguration', 'SamlConfiguration', properties.SamlConfiguration != null ? CfnWorkspaceSamlConfigurationPropertyFromCloudFormation(properties.SamlConfiguration) : undefined);
    ret.addPropertyResult('stackSetName', 'StackSetName', properties.StackSetName != null ? cfn_parse.FromCloudFormation.getString(properties.StackSetName) : undefined);
    ret.addPropertyResult('vpcConfiguration', 'VpcConfiguration', properties.VpcConfiguration != null ? CfnWorkspaceVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Grafana::Workspace";

    /**
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
        const ret = new CfnWorkspace(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The date that the workspace was created.
     *
     * Type: Timestamp
     * @cloudformationAttribute CreationTimestamp
     */
    public readonly attrCreationTimestamp: string;

    /**
     * The URL that users can use to access the Grafana console in the workspace.
     *
     * Type: String
     * @cloudformationAttribute Endpoint
     */
    public readonly attrEndpoint: string;

    /**
     * The version of Grafana supported in this workspace.
     *
     * Type: String
     * @cloudformationAttribute GrafanaVersion
     */
    public readonly attrGrafanaVersion: string;

    /**
     * The unique ID of this workspace.
     *
     * Type: String
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The most recent date that the workspace was modified.
     *
     * Type: Timestamp
     * @cloudformationAttribute ModificationTimestamp
     */
    public readonly attrModificationTimestamp: string;

    /**
     * Specifies whether the workspace's SAML configuration is complete.
     *
     * Valid values: `CONFIGURED | NOT_CONFIGURED`
     *
     * Type: String
     * @cloudformationAttribute SamlConfigurationStatus
     */
    public readonly attrSamlConfigurationStatus: string;

    /**
     * The ID of the IAM Identity Center-managed application that is created by Amazon Managed Grafana .
     *
     * Type: String
     * @cloudformationAttribute SsoClientId
     */
    public readonly attrSsoClientId: string;

    /**
     * The current status of the workspace.
     *
     * Valid values: `ACTIVE | CREATING | DELETING | FAILED | UPDATING | UPGRADING | DELETION_FAILED | CREATION_FAILED | UPDATE_FAILED | UPGRADE_FAILED | LICENSE_REMOVAL_FAILED`
     *
     * Type: String
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * Specifies whether the workspace can access AWS resources in this AWS account only, or whether it can also access AWS resources in other accounts in the same organization. If this is `ORGANIZATION` , the `workspaceOrganizationalUnits` parameter specifies which organizational units the workspace can access.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-accountaccesstype
     */
    public accountAccessType: string | undefined;

    /**
     * Specifies whether this workspace uses SAML 2.0, AWS IAM Identity Center (successor to AWS Single Sign-On) , or both to authenticate users for using the Grafana console within a workspace. For more information, see [User authentication in Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-authenticationproviders
     */
    public authenticationProviders: string[] | undefined;

    /**
     * A unique, case-sensitive, user-provided identifier to ensure the idempotency of the request.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-clienttoken
     */
    public clientToken: string | undefined;

    /**
     * Specifies the AWS data sources that have been configured to have IAM roles and permissions created to allow Amazon Managed Grafana to read data from these sources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-datasources
     */
    public dataSources: string[] | undefined;

    /**
     * The user-defined description of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-description
     */
    public description: string | undefined;

    /**
     * The name of the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-name
     */
    public name: string | undefined;

    /**
     * The AWS notification channels that Amazon Managed Grafana can automatically create IAM roles and permissions for, to allow Amazon Managed Grafana to use these channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-notificationdestinations
     */
    public notificationDestinations: string[] | undefined;

    /**
     * Specifies the organizational units that this workspace is allowed to use data sources from, if this workspace is in an account that is part of an organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationalunits
     */
    public organizationalUnits: string[] | undefined;

    /**
     * The name of the IAM role that is used to access resources through Organizations .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-organizationrolename
     */
    public organizationRoleName: string | undefined;

    /**
     * If this is `Service Managed` , Amazon Managed Grafana automatically creates the IAM roles and provisions the permissions that the workspace needs to use AWS data sources and notification channels.
     *
     * If this is `CUSTOMER_MANAGED` , you manage those roles and permissions yourself. If you are creating this workspace in a member account of an organization and that account is not a delegated administrator account, and you want the workspace to access data sources in other AWS accounts in the organization, you must choose `CUSTOMER_MANAGED` .
     *
     * For more information, see [Amazon Managed Grafana permissions and policies for AWS data sources and notification channels](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-permissiontype
     */
    public permissionType: string | undefined;

    /**
     * The IAM role that grants permissions to the AWS resources that the workspace will view data from. This role must already exist.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-rolearn
     */
    public roleArn: string | undefined;

    /**
     * If the workspace uses SAML, use this structure to map SAML assertion attributes to workspace user information and define which groups in the assertion attribute are to have the `Admin` and `Editor` roles in the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-samlconfiguration
     */
    public samlConfiguration: CfnWorkspace.SamlConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The name of the AWS CloudFormation stack set that is used to generate IAM roles to be used for this workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-stacksetname
     */
    public stackSetName: string | undefined;

    /**
     * The configuration for connecting to data sources in a private VPC ( Amazon Virtual Private Cloud ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-grafana-workspace.html#cfn-grafana-workspace-vpcconfiguration
     */
    public vpcConfiguration: CfnWorkspace.VpcConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Grafana::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps = {}) {
        super(scope, id, { type: CfnWorkspace.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrCreationTimestamp = cdk.Token.asString(this.getAtt('CreationTimestamp', cdk.ResolutionTypeHint.STRING));
        this.attrEndpoint = cdk.Token.asString(this.getAtt('Endpoint', cdk.ResolutionTypeHint.STRING));
        this.attrGrafanaVersion = cdk.Token.asString(this.getAtt('GrafanaVersion', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrModificationTimestamp = cdk.Token.asString(this.getAtt('ModificationTimestamp', cdk.ResolutionTypeHint.STRING));
        this.attrSamlConfigurationStatus = cdk.Token.asString(this.getAtt('SamlConfigurationStatus', cdk.ResolutionTypeHint.STRING));
        this.attrSsoClientId = cdk.Token.asString(this.getAtt('SsoClientId', cdk.ResolutionTypeHint.STRING));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.accountAccessType = props.accountAccessType;
        this.authenticationProviders = props.authenticationProviders;
        this.clientToken = props.clientToken;
        this.dataSources = props.dataSources;
        this.description = props.description;
        this.name = props.name;
        this.notificationDestinations = props.notificationDestinations;
        this.organizationalUnits = props.organizationalUnits;
        this.organizationRoleName = props.organizationRoleName;
        this.permissionType = props.permissionType;
        this.roleArn = props.roleArn;
        this.samlConfiguration = props.samlConfiguration;
        this.stackSetName = props.stackSetName;
        this.vpcConfiguration = props.vpcConfiguration;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountAccessType: this.accountAccessType,
            authenticationProviders: this.authenticationProviders,
            clientToken: this.clientToken,
            dataSources: this.dataSources,
            description: this.description,
            name: this.name,
            notificationDestinations: this.notificationDestinations,
            organizationalUnits: this.organizationalUnits,
            organizationRoleName: this.organizationRoleName,
            permissionType: this.permissionType,
            roleArn: this.roleArn,
            samlConfiguration: this.samlConfiguration,
            stackSetName: this.stackSetName,
            vpcConfiguration: this.vpcConfiguration,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkspacePropsToCloudFormation(props);
    }
}

export namespace CfnWorkspace {
    /**
     * A structure that defines which attributes in the IdP assertion are to be used to define information about the users authenticated by the IdP to use the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-assertionattributes.html
     */
    export interface AssertionAttributesProperty {
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

/**
 * Determine whether the given properties match those of a `AssertionAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AssertionAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_AssertionAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('email', cdk.validateString)(properties.email));
    errors.collect(cdk.propertyValidator('groups', cdk.validateString)(properties.groups));
    errors.collect(cdk.propertyValidator('login', cdk.validateString)(properties.login));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('org', cdk.validateString)(properties.org));
    errors.collect(cdk.propertyValidator('role', cdk.validateString)(properties.role));
    return errors.wrap('supplied properties not correct for "AssertionAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace.AssertionAttributes` resource
 *
 * @param properties - the TypeScript properties of a `AssertionAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace.AssertionAttributes` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceAssertionAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_AssertionAttributesPropertyValidator(properties).assertSuccess();
    return {
        Email: cdk.stringToCloudFormation(properties.email),
        Groups: cdk.stringToCloudFormation(properties.groups),
        Login: cdk.stringToCloudFormation(properties.login),
        Name: cdk.stringToCloudFormation(properties.name),
        Org: cdk.stringToCloudFormation(properties.org),
        Role: cdk.stringToCloudFormation(properties.role),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceAssertionAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.AssertionAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.AssertionAttributesProperty>();
    ret.addPropertyResult('email', 'Email', properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined);
    ret.addPropertyResult('groups', 'Groups', properties.Groups != null ? cfn_parse.FromCloudFormation.getString(properties.Groups) : undefined);
    ret.addPropertyResult('login', 'Login', properties.Login != null ? cfn_parse.FromCloudFormation.getString(properties.Login) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('org', 'Org', properties.Org != null ? cfn_parse.FromCloudFormation.getString(properties.Org) : undefined);
    ret.addPropertyResult('role', 'Role', properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkspace {
    /**
     * A structure containing the identity provider (IdP) metadata used to integrate the identity provider with this workspace. You can specify the metadata either by providing a URL to its location in the `url` parameter, or by specifying the full metadata in XML format in the `xml` parameter. Specifying both will cause an error.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-idpmetadata.html
     */
    export interface IdpMetadataProperty {
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

/**
 * Determine whether the given properties match those of a `IdpMetadataProperty`
 *
 * @param properties - the TypeScript properties of a `IdpMetadataProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_IdpMetadataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('xml', cdk.validateString)(properties.xml));
    return errors.wrap('supplied properties not correct for "IdpMetadataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace.IdpMetadata` resource
 *
 * @param properties - the TypeScript properties of a `IdpMetadataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace.IdpMetadata` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceIdpMetadataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_IdpMetadataPropertyValidator(properties).assertSuccess();
    return {
        Url: cdk.stringToCloudFormation(properties.url),
        Xml: cdk.stringToCloudFormation(properties.xml),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceIdpMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.IdpMetadataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.IdpMetadataProperty>();
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addPropertyResult('xml', 'Xml', properties.Xml != null ? cfn_parse.FromCloudFormation.getString(properties.Xml) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkspace {
    /**
     * This structure defines which groups defined in the SAML assertion attribute are to be mapped to the Grafana `Admin` and `Editor` roles in the workspace. SAML authenticated users not part of `Admin` or `Editor` role groups have `Viewer` permission over the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-rolevalues.html
     */
    export interface RoleValuesProperty {
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

/**
 * Determine whether the given properties match those of a `RoleValuesProperty`
 *
 * @param properties - the TypeScript properties of a `RoleValuesProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_RoleValuesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('admin', cdk.listValidator(cdk.validateString))(properties.admin));
    errors.collect(cdk.propertyValidator('editor', cdk.listValidator(cdk.validateString))(properties.editor));
    return errors.wrap('supplied properties not correct for "RoleValuesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace.RoleValues` resource
 *
 * @param properties - the TypeScript properties of a `RoleValuesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace.RoleValues` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceRoleValuesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_RoleValuesPropertyValidator(properties).assertSuccess();
    return {
        Admin: cdk.listMapper(cdk.stringToCloudFormation)(properties.admin),
        Editor: cdk.listMapper(cdk.stringToCloudFormation)(properties.editor),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceRoleValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.RoleValuesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.RoleValuesProperty>();
    ret.addPropertyResult('admin', 'Admin', properties.Admin != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Admin) : undefined);
    ret.addPropertyResult('editor', 'Editor', properties.Editor != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Editor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkspace {
    /**
     * A structure containing information about how this workspace works with SAML.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-grafana-workspace-samlconfiguration.html
     */
    export interface SamlConfigurationProperty {
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

/**
 * Determine whether the given properties match those of a `SamlConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SamlConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_SamlConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowedOrganizations', cdk.listValidator(cdk.validateString))(properties.allowedOrganizations));
    errors.collect(cdk.propertyValidator('assertionAttributes', CfnWorkspace_AssertionAttributesPropertyValidator)(properties.assertionAttributes));
    errors.collect(cdk.propertyValidator('idpMetadata', cdk.requiredValidator)(properties.idpMetadata));
    errors.collect(cdk.propertyValidator('idpMetadata', CfnWorkspace_IdpMetadataPropertyValidator)(properties.idpMetadata));
    errors.collect(cdk.propertyValidator('loginValidityDuration', cdk.validateNumber)(properties.loginValidityDuration));
    errors.collect(cdk.propertyValidator('roleValues', CfnWorkspace_RoleValuesPropertyValidator)(properties.roleValues));
    return errors.wrap('supplied properties not correct for "SamlConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace.SamlConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SamlConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace.SamlConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceSamlConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_SamlConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AllowedOrganizations: cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOrganizations),
        AssertionAttributes: cfnWorkspaceAssertionAttributesPropertyToCloudFormation(properties.assertionAttributes),
        IdpMetadata: cfnWorkspaceIdpMetadataPropertyToCloudFormation(properties.idpMetadata),
        LoginValidityDuration: cdk.numberToCloudFormation(properties.loginValidityDuration),
        RoleValues: cfnWorkspaceRoleValuesPropertyToCloudFormation(properties.roleValues),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceSamlConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.SamlConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.SamlConfigurationProperty>();
    ret.addPropertyResult('allowedOrganizations', 'AllowedOrganizations', properties.AllowedOrganizations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AllowedOrganizations) : undefined);
    ret.addPropertyResult('assertionAttributes', 'AssertionAttributes', properties.AssertionAttributes != null ? CfnWorkspaceAssertionAttributesPropertyFromCloudFormation(properties.AssertionAttributes) : undefined);
    ret.addPropertyResult('idpMetadata', 'IdpMetadata', CfnWorkspaceIdpMetadataPropertyFromCloudFormation(properties.IdpMetadata));
    ret.addPropertyResult('loginValidityDuration', 'LoginValidityDuration', properties.LoginValidityDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoginValidityDuration) : undefined);
    ret.addPropertyResult('roleValues', 'RoleValues', properties.RoleValues != null ? CfnWorkspaceRoleValuesPropertyFromCloudFormation(properties.RoleValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWorkspace {
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
    export interface VpcConfigurationProperty {
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

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_VpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.requiredValidator)(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VpcConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Grafana::Workspace.VpcConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Grafana::Workspace.VpcConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceVpcConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_VpcConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.VpcConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.VpcConfigurationProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds));
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
