// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:28.714Z","fingerprint":"NiZR1X+EW8EbIV0jhd7kb3JuhpWT+a9jHEA7dPPW20Y="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export interface CfnGroupProps {

    /**
     * `AWS::IdentityStore::Group.DisplayName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-displayname
     */
    readonly displayName: string;

    /**
     * `AWS::IdentityStore::Group.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-identitystoreid
     */
    readonly identityStoreId: string;

    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('displayName', cdk.requiredValidator)(properties.displayName));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('identityStoreId', cdk.requiredValidator)(properties.identityStoreId));
    errors.collect(cdk.propertyValidator('identityStoreId', cdk.validateString)(properties.identityStoreId));
    return errors.wrap('supplied properties not correct for "CfnGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IdentityStore::Group` resource
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IdentityStore::Group` resource.
 */
// @ts-ignore TS6133
function cfnGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroupPropsValidator(properties).assertSuccess();
    return {
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        IdentityStoreId: cdk.stringToCloudFormation(properties.identityStoreId),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
    ret.addPropertyResult('displayName', 'DisplayName', cfn_parse.FromCloudFormation.getString(properties.DisplayName));
    ret.addPropertyResult('identityStoreId', 'IdentityStoreId', cfn_parse.FromCloudFormation.getString(properties.IdentityStoreId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IdentityStore::Group`
 *
 * A group object, which contains a specified group’s metadata and attributes.
 *
 * @cloudformationResource AWS::IdentityStore::Group
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IdentityStore::Group";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier of the newly created group in the identity store.
     * @cloudformationAttribute GroupId
     */
    public readonly attrGroupId: string;

    /**
     * `AWS::IdentityStore::Group.DisplayName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-displayname
     */
    public displayName: string;

    /**
     * `AWS::IdentityStore::Group.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-identitystoreid
     */
    public identityStoreId: string;

    /**
     * A string containing the description of the group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-group.html#cfn-identitystore-group-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::IdentityStore::Group`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGroupProps) {
        super(scope, id, { type: CfnGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'displayName', this);
        cdk.requireProperty(props, 'identityStoreId', this);
        this.attrGroupId = cdk.Token.asString(this.getAtt('GroupId', cdk.ResolutionTypeHint.STRING));

        this.displayName = props.displayName;
        this.identityStoreId = props.identityStoreId;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            displayName: this.displayName,
            identityStoreId: this.identityStoreId,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnGroupMembership`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export interface CfnGroupMembershipProps {

    /**
     * `AWS::IdentityStore::GroupMembership.GroupId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-groupid
     */
    readonly groupId: string;

    /**
     * `AWS::IdentityStore::GroupMembership.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-identitystoreid
     */
    readonly identityStoreId: string;

    /**
     * An object containing the identifier of a group member. Setting `MemberId` 's `UserId` field to a specific User's ID indicates we should consider that User as a group member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-memberid
     */
    readonly memberId: CfnGroupMembership.MemberIdProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGroupMembershipProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupMembershipProps`
 *
 * @returns the result of the validation.
 */
function CfnGroupMembershipPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupId', cdk.requiredValidator)(properties.groupId));
    errors.collect(cdk.propertyValidator('groupId', cdk.validateString)(properties.groupId));
    errors.collect(cdk.propertyValidator('identityStoreId', cdk.requiredValidator)(properties.identityStoreId));
    errors.collect(cdk.propertyValidator('identityStoreId', cdk.validateString)(properties.identityStoreId));
    errors.collect(cdk.propertyValidator('memberId', cdk.requiredValidator)(properties.memberId));
    errors.collect(cdk.propertyValidator('memberId', CfnGroupMembership_MemberIdPropertyValidator)(properties.memberId));
    return errors.wrap('supplied properties not correct for "CfnGroupMembershipProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IdentityStore::GroupMembership` resource
 *
 * @param properties - the TypeScript properties of a `CfnGroupMembershipProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IdentityStore::GroupMembership` resource.
 */
// @ts-ignore TS6133
function cfnGroupMembershipPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroupMembershipPropsValidator(properties).assertSuccess();
    return {
        GroupId: cdk.stringToCloudFormation(properties.groupId),
        IdentityStoreId: cdk.stringToCloudFormation(properties.identityStoreId),
        MemberId: cfnGroupMembershipMemberIdPropertyToCloudFormation(properties.memberId),
    };
}

// @ts-ignore TS6133
function CfnGroupMembershipPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupMembershipProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupMembershipProps>();
    ret.addPropertyResult('groupId', 'GroupId', cfn_parse.FromCloudFormation.getString(properties.GroupId));
    ret.addPropertyResult('identityStoreId', 'IdentityStoreId', cfn_parse.FromCloudFormation.getString(properties.IdentityStoreId));
    ret.addPropertyResult('memberId', 'MemberId', CfnGroupMembershipMemberIdPropertyFromCloudFormation(properties.MemberId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IdentityStore::GroupMembership`
 *
 * Contains the identifiers for a group, a group member, and a `GroupMembership` object in the identity store.
 *
 * @cloudformationResource AWS::IdentityStore::GroupMembership
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html
 */
export class CfnGroupMembership extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IdentityStore::GroupMembership";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroupMembership {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGroupMembershipPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGroupMembership(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier for a `GroupMembership` in the identity store.
     * @cloudformationAttribute MembershipId
     */
    public readonly attrMembershipId: string;

    /**
     * `AWS::IdentityStore::GroupMembership.GroupId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-groupid
     */
    public groupId: string;

    /**
     * `AWS::IdentityStore::GroupMembership.IdentityStoreId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-identitystoreid
     */
    public identityStoreId: string;

    /**
     * An object containing the identifier of a group member. Setting `MemberId` 's `UserId` field to a specific User's ID indicates we should consider that User as a group member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-identitystore-groupmembership.html#cfn-identitystore-groupmembership-memberid
     */
    public memberId: CfnGroupMembership.MemberIdProperty | cdk.IResolvable;

    /**
     * Create a new `AWS::IdentityStore::GroupMembership`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGroupMembershipProps) {
        super(scope, id, { type: CfnGroupMembership.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'groupId', this);
        cdk.requireProperty(props, 'identityStoreId', this);
        cdk.requireProperty(props, 'memberId', this);
        this.attrMembershipId = cdk.Token.asString(this.getAtt('MembershipId', cdk.ResolutionTypeHint.STRING));

        this.groupId = props.groupId;
        this.identityStoreId = props.identityStoreId;
        this.memberId = props.memberId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroupMembership.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            groupId: this.groupId,
            identityStoreId: this.identityStoreId,
            memberId: this.memberId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGroupMembershipPropsToCloudFormation(props);
    }
}

export namespace CfnGroupMembership {
    /**
     * An object that contains the identifier of a group member. Setting the `UserID` field to the specific identifier for a user indicates that the user is a member of the group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html
     */
    export interface MemberIdProperty {
        /**
         * `CfnGroupMembership.MemberIdProperty.UserId`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-identitystore-groupmembership-memberid.html#cfn-identitystore-groupmembership-memberid-userid
         */
        readonly userId: string;
    }
}

/**
 * Determine whether the given properties match those of a `MemberIdProperty`
 *
 * @param properties - the TypeScript properties of a `MemberIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnGroupMembership_MemberIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('userId', cdk.requiredValidator)(properties.userId));
    errors.collect(cdk.propertyValidator('userId', cdk.validateString)(properties.userId));
    return errors.wrap('supplied properties not correct for "MemberIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IdentityStore::GroupMembership.MemberId` resource
 *
 * @param properties - the TypeScript properties of a `MemberIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IdentityStore::GroupMembership.MemberId` resource.
 */
// @ts-ignore TS6133
function cfnGroupMembershipMemberIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGroupMembership_MemberIdPropertyValidator(properties).assertSuccess();
    return {
        UserId: cdk.stringToCloudFormation(properties.userId),
    };
}

// @ts-ignore TS6133
function CfnGroupMembershipMemberIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupMembership.MemberIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupMembership.MemberIdProperty>();
    ret.addPropertyResult('userId', 'UserId', cfn_parse.FromCloudFormation.getString(properties.UserId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
