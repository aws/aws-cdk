// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:35.870Z","fingerprint":"MWMe5NIWFJYVKlpFWFyxHjCK0QMqEwsLecp11okFz7c="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnConnectionAlias`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html
 */
export interface CfnConnectionAliasProps {

    /**
     * The connection string specified for the connection alias. The connection string must be in the form of a fully qualified domain name (FQDN), such as `www.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-connectionstring
     */
    readonly connectionString: string;

    /**
     * The tags to associate with the connection alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnConnectionAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectionAliasProps`
 *
 * @returns the result of the validation.
 */
function CfnConnectionAliasPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionString', cdk.requiredValidator)(properties.connectionString));
    errors.collect(cdk.propertyValidator('connectionString', cdk.validateString)(properties.connectionString));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConnectionAliasProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WorkSpaces::ConnectionAlias` resource
 *
 * @param properties - the TypeScript properties of a `CfnConnectionAliasProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WorkSpaces::ConnectionAlias` resource.
 */
// @ts-ignore TS6133
function cfnConnectionAliasPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectionAliasPropsValidator(properties).assertSuccess();
    return {
        ConnectionString: cdk.stringToCloudFormation(properties.connectionString),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConnectionAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionAliasProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionAliasProps>();
    ret.addPropertyResult('connectionString', 'ConnectionString', cfn_parse.FromCloudFormation.getString(properties.ConnectionString));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WorkSpaces::ConnectionAlias`
 *
 * The `AWS::WorkSpaces::ConnectionAlias` resource specifies a connection alias. Connection aliases are used for cross-Region redirection. For more information, see [Cross-Region Redirection for Amazon WorkSpaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/cross-region-redirection.html) .
 *
 * @cloudformationResource AWS::WorkSpaces::ConnectionAlias
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html
 */
export class CfnConnectionAlias extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WorkSpaces::ConnectionAlias";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectionAlias {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConnectionAliasPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConnectionAlias(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier of the connection alias, returned as a string.
     * @cloudformationAttribute AliasId
     */
    public readonly attrAliasId: string;

    /**
     * The association status of the connection alias, returned as an array of `ConnectionAliasAssociation` objects.
     * @cloudformationAttribute Associations
     */
    public readonly attrAssociations: cdk.IResolvable;

    /**
     * The current state of the connection alias, returned as a string.
     * @cloudformationAttribute ConnectionAliasState
     */
    public readonly attrConnectionAliasState: string;

    /**
     * The connection string specified for the connection alias. The connection string must be in the form of a fully qualified domain name (FQDN), such as `www.example.com` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-connectionstring
     */
    public connectionString: string;

    /**
     * The tags to associate with the connection alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-connectionalias.html#cfn-workspaces-connectionalias-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::WorkSpaces::ConnectionAlias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectionAliasProps) {
        super(scope, id, { type: CfnConnectionAlias.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'connectionString', this);
        this.attrAliasId = cdk.Token.asString(this.getAtt('AliasId', cdk.ResolutionTypeHint.STRING));
        this.attrAssociations = this.getAtt('Associations', cdk.ResolutionTypeHint.STRING);
        this.attrConnectionAliasState = cdk.Token.asString(this.getAtt('ConnectionAliasState', cdk.ResolutionTypeHint.STRING));

        this.connectionString = props.connectionString;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WorkSpaces::ConnectionAlias", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnectionAlias.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            connectionString: this.connectionString,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConnectionAliasPropsToCloudFormation(props);
    }
}

export namespace CfnConnectionAlias {
    /**
     * Describes a connection alias association that is used for cross-Region redirection. For more information, see [Cross-Region Redirection for Amazon WorkSpaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/cross-region-redirection.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html
     */
    export interface ConnectionAliasAssociationProperty {
        /**
         * The identifier of the AWS account that associated the connection alias with a directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-associatedaccountid
         */
        readonly associatedAccountId?: string;
        /**
         * The association status of the connection alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-associationstatus
         */
        readonly associationStatus?: string;
        /**
         * The identifier of the connection alias association. You use the connection identifier in the DNS TXT record when you're configuring your DNS routing policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-connectionidentifier
         */
        readonly connectionIdentifier?: string;
        /**
         * The identifier of the directory associated with a connection alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-connectionalias-connectionaliasassociation.html#cfn-workspaces-connectionalias-connectionaliasassociation-resourceid
         */
        readonly resourceId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ConnectionAliasAssociationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionAliasAssociationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConnectionAlias_ConnectionAliasAssociationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associatedAccountId', cdk.validateString)(properties.associatedAccountId));
    errors.collect(cdk.propertyValidator('associationStatus', cdk.validateString)(properties.associationStatus));
    errors.collect(cdk.propertyValidator('connectionIdentifier', cdk.validateString)(properties.connectionIdentifier));
    errors.collect(cdk.propertyValidator('resourceId', cdk.validateString)(properties.resourceId));
    return errors.wrap('supplied properties not correct for "ConnectionAliasAssociationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WorkSpaces::ConnectionAlias.ConnectionAliasAssociation` resource
 *
 * @param properties - the TypeScript properties of a `ConnectionAliasAssociationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WorkSpaces::ConnectionAlias.ConnectionAliasAssociation` resource.
 */
// @ts-ignore TS6133
function cfnConnectionAliasConnectionAliasAssociationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConnectionAlias_ConnectionAliasAssociationPropertyValidator(properties).assertSuccess();
    return {
        AssociatedAccountId: cdk.stringToCloudFormation(properties.associatedAccountId),
        AssociationStatus: cdk.stringToCloudFormation(properties.associationStatus),
        ConnectionIdentifier: cdk.stringToCloudFormation(properties.connectionIdentifier),
        ResourceId: cdk.stringToCloudFormation(properties.resourceId),
    };
}

// @ts-ignore TS6133
function CfnConnectionAliasConnectionAliasAssociationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectionAlias.ConnectionAliasAssociationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectionAlias.ConnectionAliasAssociationProperty>();
    ret.addPropertyResult('associatedAccountId', 'AssociatedAccountId', properties.AssociatedAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AssociatedAccountId) : undefined);
    ret.addPropertyResult('associationStatus', 'AssociationStatus', properties.AssociationStatus != null ? cfn_parse.FromCloudFormation.getString(properties.AssociationStatus) : undefined);
    ret.addPropertyResult('connectionIdentifier', 'ConnectionIdentifier', properties.ConnectionIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionIdentifier) : undefined);
    ret.addPropertyResult('resourceId', 'ResourceId', properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html
 */
export interface CfnWorkspaceProps {

    /**
     * The identifier of the bundle for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-bundleid
     */
    readonly bundleId: string;

    /**
     * The identifier of the AWS Directory Service directory for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-directoryid
     */
    readonly directoryId: string;

    /**
     * The user name of the user for the WorkSpace. This user name must exist in the AWS Directory Service directory for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-username
     */
    readonly userName: string;

    /**
     * Indicates whether the data stored on the root volume is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-rootvolumeencryptionenabled
     */
    readonly rootVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * The tags for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Indicates whether the data stored on the user volume is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-uservolumeencryptionenabled
     */
    readonly userVolumeEncryptionEnabled?: boolean | cdk.IResolvable;

    /**
     * The symmetric AWS KMS key used to encrypt data stored on your WorkSpace. Amazon WorkSpaces does not support asymmetric KMS keys.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-volumeencryptionkey
     */
    readonly volumeEncryptionKey?: string;

    /**
     * The WorkSpace properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-workspaceproperties
     */
    readonly workspaceProperties?: CfnWorkspace.WorkspacePropertiesProperty | cdk.IResolvable;
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
    errors.collect(cdk.propertyValidator('bundleId', cdk.requiredValidator)(properties.bundleId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('directoryId', cdk.requiredValidator)(properties.directoryId));
    errors.collect(cdk.propertyValidator('directoryId', cdk.validateString)(properties.directoryId));
    errors.collect(cdk.propertyValidator('rootVolumeEncryptionEnabled', cdk.validateBoolean)(properties.rootVolumeEncryptionEnabled));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('userName', cdk.requiredValidator)(properties.userName));
    errors.collect(cdk.propertyValidator('userName', cdk.validateString)(properties.userName));
    errors.collect(cdk.propertyValidator('userVolumeEncryptionEnabled', cdk.validateBoolean)(properties.userVolumeEncryptionEnabled));
    errors.collect(cdk.propertyValidator('volumeEncryptionKey', cdk.validateString)(properties.volumeEncryptionKey));
    errors.collect(cdk.propertyValidator('workspaceProperties', CfnWorkspace_WorkspacePropertiesPropertyValidator)(properties.workspaceProperties));
    return errors.wrap('supplied properties not correct for "CfnWorkspaceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WorkSpaces::Workspace` resource
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WorkSpaces::Workspace` resource.
 */
// @ts-ignore TS6133
function cfnWorkspacePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspacePropsValidator(properties).assertSuccess();
    return {
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        DirectoryId: cdk.stringToCloudFormation(properties.directoryId),
        UserName: cdk.stringToCloudFormation(properties.userName),
        RootVolumeEncryptionEnabled: cdk.booleanToCloudFormation(properties.rootVolumeEncryptionEnabled),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        UserVolumeEncryptionEnabled: cdk.booleanToCloudFormation(properties.userVolumeEncryptionEnabled),
        VolumeEncryptionKey: cdk.stringToCloudFormation(properties.volumeEncryptionKey),
        WorkspaceProperties: cfnWorkspaceWorkspacePropertiesPropertyToCloudFormation(properties.workspaceProperties),
    };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
    ret.addPropertyResult('bundleId', 'BundleId', cfn_parse.FromCloudFormation.getString(properties.BundleId));
    ret.addPropertyResult('directoryId', 'DirectoryId', cfn_parse.FromCloudFormation.getString(properties.DirectoryId));
    ret.addPropertyResult('userName', 'UserName', cfn_parse.FromCloudFormation.getString(properties.UserName));
    ret.addPropertyResult('rootVolumeEncryptionEnabled', 'RootVolumeEncryptionEnabled', properties.RootVolumeEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RootVolumeEncryptionEnabled) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('userVolumeEncryptionEnabled', 'UserVolumeEncryptionEnabled', properties.UserVolumeEncryptionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserVolumeEncryptionEnabled) : undefined);
    ret.addPropertyResult('volumeEncryptionKey', 'VolumeEncryptionKey', properties.VolumeEncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeEncryptionKey) : undefined);
    ret.addPropertyResult('workspaceProperties', 'WorkspaceProperties', properties.WorkspaceProperties != null ? CfnWorkspaceWorkspacePropertiesPropertyFromCloudFormation(properties.WorkspaceProperties) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::WorkSpaces::Workspace`
 *
 * The `AWS::WorkSpaces::Workspace` resource specifies a WorkSpace.
 *
 * Updates are not supported for the `BundleId` , `RootVolumeEncryptionEnabled` , `UserVolumeEncryptionEnabled` , or `VolumeEncryptionKey` properties. To update these properties, you must also update a property that triggers a replacement, such as the `UserName` property.
 *
 * @cloudformationResource AWS::WorkSpaces::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::WorkSpaces::Workspace";

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
     * The identifier of the bundle for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-bundleid
     */
    public bundleId: string;

    /**
     * The identifier of the AWS Directory Service directory for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-directoryid
     */
    public directoryId: string;

    /**
     * The user name of the user for the WorkSpace. This user name must exist in the AWS Directory Service directory for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-username
     */
    public userName: string;

    /**
     * Indicates whether the data stored on the root volume is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-rootvolumeencryptionenabled
     */
    public rootVolumeEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The tags for the WorkSpace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Indicates whether the data stored on the user volume is encrypted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-uservolumeencryptionenabled
     */
    public userVolumeEncryptionEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The symmetric AWS KMS key used to encrypt data stored on your WorkSpace. Amazon WorkSpaces does not support asymmetric KMS keys.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-volumeencryptionkey
     */
    public volumeEncryptionKey: string | undefined;

    /**
     * The WorkSpace properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-workspaces-workspace.html#cfn-workspaces-workspace-workspaceproperties
     */
    public workspaceProperties: CfnWorkspace.WorkspacePropertiesProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::WorkSpaces::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps) {
        super(scope, id, { type: CfnWorkspace.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'bundleId', this);
        cdk.requireProperty(props, 'directoryId', this);
        cdk.requireProperty(props, 'userName', this);

        this.bundleId = props.bundleId;
        this.directoryId = props.directoryId;
        this.userName = props.userName;
        this.rootVolumeEncryptionEnabled = props.rootVolumeEncryptionEnabled;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::WorkSpaces::Workspace", props.tags, { tagPropertyName: 'tags' });
        this.userVolumeEncryptionEnabled = props.userVolumeEncryptionEnabled;
        this.volumeEncryptionKey = props.volumeEncryptionKey;
        this.workspaceProperties = props.workspaceProperties;
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
            bundleId: this.bundleId,
            directoryId: this.directoryId,
            userName: this.userName,
            rootVolumeEncryptionEnabled: this.rootVolumeEncryptionEnabled,
            tags: this.tags.renderTags(),
            userVolumeEncryptionEnabled: this.userVolumeEncryptionEnabled,
            volumeEncryptionKey: this.volumeEncryptionKey,
            workspaceProperties: this.workspaceProperties,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWorkspacePropsToCloudFormation(props);
    }
}

export namespace CfnWorkspace {
    /**
     * Information about a WorkSpace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html
     */
    export interface WorkspacePropertiesProperty {
        /**
         * The compute type. For more information, see [Amazon WorkSpaces Bundles](https://docs.aws.amazon.com/workspaces/details/#Amazon_WorkSpaces_Bundles) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-computetypename
         */
        readonly computeTypeName?: string;
        /**
         * The size of the root volume. For important information about how to modify the size of the root and user volumes, see [Modify a WorkSpace](https://docs.aws.amazon.com/workspaces/latest/adminguide/modify-workspaces.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-rootvolumesizegib
         */
        readonly rootVolumeSizeGib?: number;
        /**
         * The running mode. For more information, see [Manage the WorkSpace Running Mode](https://docs.aws.amazon.com/workspaces/latest/adminguide/running-mode.html) .
         *
         * > The `MANUAL` value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see [Amazon WorkSpaces Core](https://docs.aws.amazon.com/workspaces/core/) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-runningmode
         */
        readonly runningMode?: string;
        /**
         * The time after a user logs off when WorkSpaces are automatically stopped. Configured in 60-minute intervals.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-runningmodeautostoptimeoutinminutes
         */
        readonly runningModeAutoStopTimeoutInMinutes?: number;
        /**
         * The size of the user storage. For important information about how to modify the size of the root and user volumes, see [Modify a WorkSpace](https://docs.aws.amazon.com/workspaces/latest/adminguide/modify-workspaces.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-workspaces-workspace-workspaceproperties.html#cfn-workspaces-workspace-workspaceproperties-uservolumesizegib
         */
        readonly userVolumeSizeGib?: number;
    }
}

/**
 * Determine whether the given properties match those of a `WorkspacePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `WorkspacePropertiesProperty`
 *
 * @returns the result of the validation.
 */
function CfnWorkspace_WorkspacePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('computeTypeName', cdk.validateString)(properties.computeTypeName));
    errors.collect(cdk.propertyValidator('rootVolumeSizeGib', cdk.validateNumber)(properties.rootVolumeSizeGib));
    errors.collect(cdk.propertyValidator('runningMode', cdk.validateString)(properties.runningMode));
    errors.collect(cdk.propertyValidator('runningModeAutoStopTimeoutInMinutes', cdk.validateNumber)(properties.runningModeAutoStopTimeoutInMinutes));
    errors.collect(cdk.propertyValidator('userVolumeSizeGib', cdk.validateNumber)(properties.userVolumeSizeGib));
    return errors.wrap('supplied properties not correct for "WorkspacePropertiesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::WorkSpaces::Workspace.WorkspaceProperties` resource
 *
 * @param properties - the TypeScript properties of a `WorkspacePropertiesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::WorkSpaces::Workspace.WorkspaceProperties` resource.
 */
// @ts-ignore TS6133
function cfnWorkspaceWorkspacePropertiesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWorkspace_WorkspacePropertiesPropertyValidator(properties).assertSuccess();
    return {
        ComputeTypeName: cdk.stringToCloudFormation(properties.computeTypeName),
        RootVolumeSizeGib: cdk.numberToCloudFormation(properties.rootVolumeSizeGib),
        RunningMode: cdk.stringToCloudFormation(properties.runningMode),
        RunningModeAutoStopTimeoutInMinutes: cdk.numberToCloudFormation(properties.runningModeAutoStopTimeoutInMinutes),
        UserVolumeSizeGib: cdk.numberToCloudFormation(properties.userVolumeSizeGib),
    };
}

// @ts-ignore TS6133
function CfnWorkspaceWorkspacePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspace.WorkspacePropertiesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.WorkspacePropertiesProperty>();
    ret.addPropertyResult('computeTypeName', 'ComputeTypeName', properties.ComputeTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeTypeName) : undefined);
    ret.addPropertyResult('rootVolumeSizeGib', 'RootVolumeSizeGib', properties.RootVolumeSizeGib != null ? cfn_parse.FromCloudFormation.getNumber(properties.RootVolumeSizeGib) : undefined);
    ret.addPropertyResult('runningMode', 'RunningMode', properties.RunningMode != null ? cfn_parse.FromCloudFormation.getString(properties.RunningMode) : undefined);
    ret.addPropertyResult('runningModeAutoStopTimeoutInMinutes', 'RunningModeAutoStopTimeoutInMinutes', properties.RunningModeAutoStopTimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunningModeAutoStopTimeoutInMinutes) : undefined);
    ret.addPropertyResult('userVolumeSizeGib', 'UserVolumeSizeGib', properties.UserVolumeSizeGib != null ? cfn_parse.FromCloudFormation.getNumber(properties.UserVolumeSizeGib) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
