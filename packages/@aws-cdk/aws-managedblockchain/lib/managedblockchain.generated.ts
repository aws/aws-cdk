// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:12.130Z","fingerprint":"V08ANGCq9So7wJN3jF5kAtagFL/5nWZGeVlfMqcra4Q="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnMember`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export interface CfnMemberProps {

    /**
     * Configuration properties of the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-memberconfiguration
     */
    readonly memberConfiguration: CfnMember.MemberConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier of the invitation to join the network sent to the account that creates the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-invitationid
     */
    readonly invitationId?: string;

    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkconfiguration
     */
    readonly networkConfiguration?: CfnMember.NetworkConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkid
     */
    readonly networkId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMemberProps`
 *
 * @param properties - the TypeScript properties of a `CfnMemberProps`
 *
 * @returns the result of the validation.
 */
function CfnMemberPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('invitationId', cdk.validateString)(properties.invitationId));
    errors.collect(cdk.propertyValidator('memberConfiguration', cdk.requiredValidator)(properties.memberConfiguration));
    errors.collect(cdk.propertyValidator('memberConfiguration', CfnMember_MemberConfigurationPropertyValidator)(properties.memberConfiguration));
    errors.collect(cdk.propertyValidator('networkConfiguration', CfnMember_NetworkConfigurationPropertyValidator)(properties.networkConfiguration));
    errors.collect(cdk.propertyValidator('networkId', cdk.validateString)(properties.networkId));
    return errors.wrap('supplied properties not correct for "CfnMemberProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member` resource
 *
 * @param properties - the TypeScript properties of a `CfnMemberProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member` resource.
 */
// @ts-ignore TS6133
function cfnMemberPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMemberPropsValidator(properties).assertSuccess();
    return {
        MemberConfiguration: cfnMemberMemberConfigurationPropertyToCloudFormation(properties.memberConfiguration),
        InvitationId: cdk.stringToCloudFormation(properties.invitationId),
        NetworkConfiguration: cfnMemberNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
        NetworkId: cdk.stringToCloudFormation(properties.networkId),
    };
}

// @ts-ignore TS6133
function CfnMemberPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMemberProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMemberProps>();
    ret.addPropertyResult('memberConfiguration', 'MemberConfiguration', CfnMemberMemberConfigurationPropertyFromCloudFormation(properties.MemberConfiguration));
    ret.addPropertyResult('invitationId', 'InvitationId', properties.InvitationId != null ? cfn_parse.FromCloudFormation.getString(properties.InvitationId) : undefined);
    ret.addPropertyResult('networkConfiguration', 'NetworkConfiguration', properties.NetworkConfiguration != null ? CfnMemberNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined);
    ret.addPropertyResult('networkId', 'NetworkId', properties.NetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ManagedBlockchain::Member`
 *
 * Creates a member within a Managed Blockchain network.
 *
 * Applies only to Hyperledger Fabric.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Member
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html
 */
export class CfnMember extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ManagedBlockchain::Member";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMember {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMemberPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMember(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the member.
     * @cloudformationAttribute MemberId
     */
    public readonly attrMemberId: string;

    /**
     * The unique identifier of the network to which the member belongs.
     * @cloudformationAttribute NetworkId
     */
    public readonly attrNetworkId: string;

    /**
     * Configuration properties of the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-memberconfiguration
     */
    public memberConfiguration: CfnMember.MemberConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier of the invitation to join the network sent to the account that creates the member.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-invitationid
     */
    public invitationId: string | undefined;

    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkconfiguration
     */
    public networkConfiguration: CfnMember.NetworkConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The unique identifier of the network to which the member belongs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-member.html#cfn-managedblockchain-member-networkid
     */
    public networkId: string | undefined;

    /**
     * Create a new `AWS::ManagedBlockchain::Member`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMemberProps) {
        super(scope, id, { type: CfnMember.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'memberConfiguration', this);
        this.attrMemberId = cdk.Token.asString(this.getAtt('MemberId', cdk.ResolutionTypeHint.STRING));
        this.attrNetworkId = cdk.Token.asString(this.getAtt('NetworkId', cdk.ResolutionTypeHint.STRING));

        this.memberConfiguration = props.memberConfiguration;
        this.invitationId = props.invitationId;
        this.networkConfiguration = props.networkConfiguration;
        this.networkId = props.networkId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMember.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            memberConfiguration: this.memberConfiguration,
            invitationId: this.invitationId,
            networkConfiguration: this.networkConfiguration,
            networkId: this.networkId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMemberPropsToCloudFormation(props);
    }
}

export namespace CfnMember {
    /**
     * A policy type that defines the voting rules for the network. The rules decide if a proposal is approved. Approval may be based on criteria such as the percentage of `YES` votes and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html
     */
    export interface ApprovalThresholdPolicyProperty {
        /**
         * The duration from the time that a proposal is created until it expires. If members cast neither the required number of `YES` votes to approve the proposal nor the number of `NO` votes required to reject it before the duration expires, the proposal is `EXPIRED` and `ProposalActions` aren't carried out.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-proposaldurationinhours
         */
        readonly proposalDurationInHours?: number;
        /**
         * Determines whether the vote percentage must be greater than the `ThresholdPercentage` or must be greater than or equal to the `ThreholdPercentage` to be approved.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdcomparator
         */
        readonly thresholdComparator?: string;
        /**
         * The percentage of votes among all members that must be `YES` for a proposal to be approved. For example, a `ThresholdPercentage` value of `50` indicates 50%. The `ThresholdComparator` determines the precise comparison. If a `ThresholdPercentage` value of `50` is specified on a network with 10 members, along with a `ThresholdComparator` value of `GREATER_THAN` , this indicates that 6 `YES` votes are required for the proposal to be approved.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-approvalthresholdpolicy.html#cfn-managedblockchain-member-approvalthresholdpolicy-thresholdpercentage
         */
        readonly thresholdPercentage?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ApprovalThresholdPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ApprovalThresholdPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_ApprovalThresholdPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('proposalDurationInHours', cdk.validateNumber)(properties.proposalDurationInHours));
    errors.collect(cdk.propertyValidator('thresholdComparator', cdk.validateString)(properties.thresholdComparator));
    errors.collect(cdk.propertyValidator('thresholdPercentage', cdk.validateNumber)(properties.thresholdPercentage));
    return errors.wrap('supplied properties not correct for "ApprovalThresholdPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.ApprovalThresholdPolicy` resource
 *
 * @param properties - the TypeScript properties of a `ApprovalThresholdPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.ApprovalThresholdPolicy` resource.
 */
// @ts-ignore TS6133
function cfnMemberApprovalThresholdPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_ApprovalThresholdPolicyPropertyValidator(properties).assertSuccess();
    return {
        ProposalDurationInHours: cdk.numberToCloudFormation(properties.proposalDurationInHours),
        ThresholdComparator: cdk.stringToCloudFormation(properties.thresholdComparator),
        ThresholdPercentage: cdk.numberToCloudFormation(properties.thresholdPercentage),
    };
}

// @ts-ignore TS6133
function CfnMemberApprovalThresholdPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.ApprovalThresholdPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.ApprovalThresholdPolicyProperty>();
    ret.addPropertyResult('proposalDurationInHours', 'ProposalDurationInHours', properties.ProposalDurationInHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProposalDurationInHours) : undefined);
    ret.addPropertyResult('thresholdComparator', 'ThresholdComparator', properties.ThresholdComparator != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdComparator) : undefined);
    ret.addPropertyResult('thresholdPercentage', 'ThresholdPercentage', properties.ThresholdPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThresholdPercentage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Configuration properties of the member.
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html
     */
    export interface MemberConfigurationProperty {
        /**
         * An optional description of the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-description
         */
        readonly description?: string;
        /**
         * Configuration properties of the blockchain framework relevant to the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-memberframeworkconfiguration
         */
        readonly memberFrameworkConfiguration?: CfnMember.MemberFrameworkConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the member.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberconfiguration.html#cfn-managedblockchain-member-memberconfiguration-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `MemberConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_MemberConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('memberFrameworkConfiguration', CfnMember_MemberFrameworkConfigurationPropertyValidator)(properties.memberFrameworkConfiguration));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "MemberConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MemberConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberMemberConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_MemberConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        MemberFrameworkConfiguration: cfnMemberMemberFrameworkConfigurationPropertyToCloudFormation(properties.memberFrameworkConfiguration),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnMemberMemberConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.MemberConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberConfigurationProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('memberFrameworkConfiguration', 'MemberFrameworkConfiguration', properties.MemberFrameworkConfiguration != null ? CfnMemberMemberFrameworkConfigurationPropertyFromCloudFormation(properties.MemberFrameworkConfiguration) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network using the Hyperledger Fabric framework.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html
     */
    export interface MemberFabricConfigurationProperty {
        /**
         * The password for the member's initial administrative user. The `AdminPassword` must be at least eight characters long and no more than 32 characters. It must contain at least one uppercase letter, one lowercase letter, and one digit. It cannot have a single quotation mark (‘), a double quotation marks (“), a forward slash(/), a backward slash(\), @, or a space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminpassword
         */
        readonly adminPassword: string;
        /**
         * The user name for the member's initial administrative user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberfabricconfiguration.html#cfn-managedblockchain-member-memberfabricconfiguration-adminusername
         */
        readonly adminUsername: string;
    }
}

/**
 * Determine whether the given properties match those of a `MemberFabricConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberFabricConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_MemberFabricConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adminPassword', cdk.requiredValidator)(properties.adminPassword));
    errors.collect(cdk.propertyValidator('adminPassword', cdk.validateString)(properties.adminPassword));
    errors.collect(cdk.propertyValidator('adminUsername', cdk.requiredValidator)(properties.adminUsername));
    errors.collect(cdk.propertyValidator('adminUsername', cdk.validateString)(properties.adminUsername));
    return errors.wrap('supplied properties not correct for "MemberFabricConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberFabricConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MemberFabricConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberFabricConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberMemberFabricConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_MemberFabricConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdminPassword: cdk.stringToCloudFormation(properties.adminPassword),
        AdminUsername: cdk.stringToCloudFormation(properties.adminUsername),
    };
}

// @ts-ignore TS6133
function CfnMemberMemberFabricConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.MemberFabricConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberFabricConfigurationProperty>();
    ret.addPropertyResult('adminPassword', 'AdminPassword', cfn_parse.FromCloudFormation.getString(properties.AdminPassword));
    ret.addPropertyResult('adminUsername', 'AdminUsername', cfn_parse.FromCloudFormation.getString(properties.AdminUsername));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Configuration properties relevant to a member for the blockchain framework that the Managed Blockchain network uses.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html
     */
    export interface MemberFrameworkConfigurationProperty {
        /**
         * Configuration properties for Hyperledger Fabric.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-memberframeworkconfiguration.html#cfn-managedblockchain-member-memberframeworkconfiguration-memberfabricconfiguration
         */
        readonly memberFabricConfiguration?: CfnMember.MemberFabricConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MemberFrameworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MemberFrameworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_MemberFrameworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('memberFabricConfiguration', CfnMember_MemberFabricConfigurationPropertyValidator)(properties.memberFabricConfiguration));
    return errors.wrap('supplied properties not correct for "MemberFrameworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberFrameworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MemberFrameworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.MemberFrameworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberMemberFrameworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_MemberFrameworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        MemberFabricConfiguration: cfnMemberMemberFabricConfigurationPropertyToCloudFormation(properties.memberFabricConfiguration),
    };
}

// @ts-ignore TS6133
function CfnMemberMemberFrameworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.MemberFrameworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.MemberFrameworkConfigurationProperty>();
    ret.addPropertyResult('memberFabricConfiguration', 'MemberFabricConfiguration', properties.MemberFabricConfiguration != null ? CfnMemberMemberFabricConfigurationPropertyFromCloudFormation(properties.MemberFabricConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Configuration properties of the network to which the member belongs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html
     */
    export interface NetworkConfigurationProperty {
        /**
         * Attributes of the blockchain framework for the network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-description
         */
        readonly description?: string;
        /**
         * The blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-framework
         */
        readonly framework: string;
        /**
         * The version of the blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-frameworkversion
         */
        readonly frameworkVersion: string;
        /**
         * The name of the network.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-name
         */
        readonly name: string;
        /**
         * Configuration properties relevant to the network for the blockchain framework that the network uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-networkframeworkconfiguration
         */
        readonly networkFrameworkConfiguration?: CfnMember.NetworkFrameworkConfigurationProperty | cdk.IResolvable;
        /**
         * The voting rules for the network to decide if a proposal is accepted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkconfiguration.html#cfn-managedblockchain-member-networkconfiguration-votingpolicy
         */
        readonly votingPolicy: CfnMember.VotingPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_NetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('framework', cdk.requiredValidator)(properties.framework));
    errors.collect(cdk.propertyValidator('framework', cdk.validateString)(properties.framework));
    errors.collect(cdk.propertyValidator('frameworkVersion', cdk.requiredValidator)(properties.frameworkVersion));
    errors.collect(cdk.propertyValidator('frameworkVersion', cdk.validateString)(properties.frameworkVersion));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('networkFrameworkConfiguration', CfnMember_NetworkFrameworkConfigurationPropertyValidator)(properties.networkFrameworkConfiguration));
    errors.collect(cdk.propertyValidator('votingPolicy', cdk.requiredValidator)(properties.votingPolicy));
    errors.collect(cdk.propertyValidator('votingPolicy', CfnMember_VotingPolicyPropertyValidator)(properties.votingPolicy));
    return errors.wrap('supplied properties not correct for "NetworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberNetworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_NetworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        Framework: cdk.stringToCloudFormation(properties.framework),
        FrameworkVersion: cdk.stringToCloudFormation(properties.frameworkVersion),
        Name: cdk.stringToCloudFormation(properties.name),
        NetworkFrameworkConfiguration: cfnMemberNetworkFrameworkConfigurationPropertyToCloudFormation(properties.networkFrameworkConfiguration),
        VotingPolicy: cfnMemberVotingPolicyPropertyToCloudFormation(properties.votingPolicy),
    };
}

// @ts-ignore TS6133
function CfnMemberNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.NetworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkConfigurationProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('framework', 'Framework', cfn_parse.FromCloudFormation.getString(properties.Framework));
    ret.addPropertyResult('frameworkVersion', 'FrameworkVersion', cfn_parse.FromCloudFormation.getString(properties.FrameworkVersion));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('networkFrameworkConfiguration', 'NetworkFrameworkConfiguration', properties.NetworkFrameworkConfiguration != null ? CfnMemberNetworkFrameworkConfigurationPropertyFromCloudFormation(properties.NetworkFrameworkConfiguration) : undefined);
    ret.addPropertyResult('votingPolicy', 'VotingPolicy', CfnMemberVotingPolicyPropertyFromCloudFormation(properties.VotingPolicy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Hyperledger Fabric configuration properties for the network.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html
     */
    export interface NetworkFabricConfigurationProperty {
        /**
         * The edition of Amazon Managed Blockchain that the network uses. Valid values are `standard` and `starter` . For more information, see
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkfabricconfiguration.html#cfn-managedblockchain-member-networkfabricconfiguration-edition
         */
        readonly edition: string;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkFabricConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkFabricConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_NetworkFabricConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('edition', cdk.requiredValidator)(properties.edition));
    errors.collect(cdk.propertyValidator('edition', cdk.validateString)(properties.edition));
    return errors.wrap('supplied properties not correct for "NetworkFabricConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkFabricConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkFabricConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkFabricConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberNetworkFabricConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_NetworkFabricConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Edition: cdk.stringToCloudFormation(properties.edition),
    };
}

// @ts-ignore TS6133
function CfnMemberNetworkFabricConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.NetworkFabricConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkFabricConfigurationProperty>();
    ret.addPropertyResult('edition', 'Edition', cfn_parse.FromCloudFormation.getString(properties.Edition));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * Configuration properties relevant to the network for the blockchain framework that the network uses.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html
     */
    export interface NetworkFrameworkConfigurationProperty {
        /**
         * Configuration properties for Hyperledger Fabric for a member in a Managed Blockchain network using the Hyperledger Fabric framework.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-networkframeworkconfiguration.html#cfn-managedblockchain-member-networkframeworkconfiguration-networkfabricconfiguration
         */
        readonly networkFabricConfiguration?: CfnMember.NetworkFabricConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkFrameworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkFrameworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_NetworkFrameworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('networkFabricConfiguration', CfnMember_NetworkFabricConfigurationPropertyValidator)(properties.networkFabricConfiguration));
    return errors.wrap('supplied properties not correct for "NetworkFrameworkConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkFrameworkConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NetworkFrameworkConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.NetworkFrameworkConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnMemberNetworkFrameworkConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_NetworkFrameworkConfigurationPropertyValidator(properties).assertSuccess();
    return {
        NetworkFabricConfiguration: cfnMemberNetworkFabricConfigurationPropertyToCloudFormation(properties.networkFabricConfiguration),
    };
}

// @ts-ignore TS6133
function CfnMemberNetworkFrameworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.NetworkFrameworkConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.NetworkFrameworkConfigurationProperty>();
    ret.addPropertyResult('networkFabricConfiguration', 'NetworkFabricConfiguration', properties.NetworkFabricConfiguration != null ? CfnMemberNetworkFabricConfigurationPropertyFromCloudFormation(properties.NetworkFabricConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnMember {
    /**
     * The voting rules for the network to decide if a proposal is accepted
     *
     * Applies only to Hyperledger Fabric.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html
     */
    export interface VotingPolicyProperty {
        /**
         * Defines the rules for the network for voting on proposals, such as the percentage of `YES` votes required for the proposal to be approved and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-member-votingpolicy.html#cfn-managedblockchain-member-votingpolicy-approvalthresholdpolicy
         */
        readonly approvalThresholdPolicy?: CfnMember.ApprovalThresholdPolicyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VotingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `VotingPolicyProperty`
 *
 * @returns the result of the validation.
 */
function CfnMember_VotingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('approvalThresholdPolicy', CfnMember_ApprovalThresholdPolicyPropertyValidator)(properties.approvalThresholdPolicy));
    return errors.wrap('supplied properties not correct for "VotingPolicyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.VotingPolicy` resource
 *
 * @param properties - the TypeScript properties of a `VotingPolicyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Member.VotingPolicy` resource.
 */
// @ts-ignore TS6133
function cfnMemberVotingPolicyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMember_VotingPolicyPropertyValidator(properties).assertSuccess();
    return {
        ApprovalThresholdPolicy: cfnMemberApprovalThresholdPolicyPropertyToCloudFormation(properties.approvalThresholdPolicy),
    };
}

// @ts-ignore TS6133
function CfnMemberVotingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMember.VotingPolicyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMember.VotingPolicyProperty>();
    ret.addPropertyResult('approvalThresholdPolicy', 'ApprovalThresholdPolicy', properties.ApprovalThresholdPolicy != null ? CfnMemberApprovalThresholdPolicyPropertyFromCloudFormation(properties.ApprovalThresholdPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnNode`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export interface CfnNodeProps {

    /**
     * The unique identifier of the network for the node.
     *
     * Ethereum public networks have the following `NetworkId` s:
     *
     * - `n-ethereum-mainnet`
     * - `n-ethereum-goerli`
     * - `n-ethereum-rinkeby`
     * - `n-ethereum-ropsten`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-networkid
     */
    readonly networkId: string;

    /**
     * Configuration properties of a peer node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-nodeconfiguration
     */
    readonly nodeConfiguration: CfnNode.NodeConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier of the member to which the node belongs. Applies only to Hyperledger Fabric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-memberid
     */
    readonly memberId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnNodeProps`
 *
 * @param properties - the TypeScript properties of a `CfnNodeProps`
 *
 * @returns the result of the validation.
 */
function CfnNodePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('memberId', cdk.validateString)(properties.memberId));
    errors.collect(cdk.propertyValidator('networkId', cdk.requiredValidator)(properties.networkId));
    errors.collect(cdk.propertyValidator('networkId', cdk.validateString)(properties.networkId));
    errors.collect(cdk.propertyValidator('nodeConfiguration', cdk.requiredValidator)(properties.nodeConfiguration));
    errors.collect(cdk.propertyValidator('nodeConfiguration', CfnNode_NodeConfigurationPropertyValidator)(properties.nodeConfiguration));
    return errors.wrap('supplied properties not correct for "CfnNodeProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Node` resource
 *
 * @param properties - the TypeScript properties of a `CfnNodeProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Node` resource.
 */
// @ts-ignore TS6133
function cfnNodePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodePropsValidator(properties).assertSuccess();
    return {
        NetworkId: cdk.stringToCloudFormation(properties.networkId),
        NodeConfiguration: cfnNodeNodeConfigurationPropertyToCloudFormation(properties.nodeConfiguration),
        MemberId: cdk.stringToCloudFormation(properties.memberId),
    };
}

// @ts-ignore TS6133
function CfnNodePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodeProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodeProps>();
    ret.addPropertyResult('networkId', 'NetworkId', cfn_parse.FromCloudFormation.getString(properties.NetworkId));
    ret.addPropertyResult('nodeConfiguration', 'NodeConfiguration', CfnNodeNodeConfigurationPropertyFromCloudFormation(properties.NodeConfiguration));
    ret.addPropertyResult('memberId', 'MemberId', properties.MemberId != null ? cfn_parse.FromCloudFormation.getString(properties.MemberId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ManagedBlockchain::Node`
 *
 * Creates a node on the specified blockchain network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 *
 * @cloudformationResource AWS::ManagedBlockchain::Node
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html
 */
export class CfnNode extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ManagedBlockchain::Node";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNode {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNodePropsFromCloudFormation(resourceProperties);
        const ret = new CfnNode(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the node.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the member in which the node is created. Applies only to Hyperledger Fabric.
     * @cloudformationAttribute MemberId
     */
    public readonly attrMemberId: string;

    /**
     * The unique identifier of the network that the node is in.
     * @cloudformationAttribute NetworkId
     */
    public readonly attrNetworkId: string;

    /**
     * The unique identifier of the node.
     * @cloudformationAttribute NodeId
     */
    public readonly attrNodeId: string;

    /**
     * The unique identifier of the network for the node.
     *
     * Ethereum public networks have the following `NetworkId` s:
     *
     * - `n-ethereum-mainnet`
     * - `n-ethereum-goerli`
     * - `n-ethereum-rinkeby`
     * - `n-ethereum-ropsten`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-networkid
     */
    public networkId: string;

    /**
     * Configuration properties of a peer node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-nodeconfiguration
     */
    public nodeConfiguration: CfnNode.NodeConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier of the member to which the node belongs. Applies only to Hyperledger Fabric.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-managedblockchain-node.html#cfn-managedblockchain-node-memberid
     */
    public memberId: string | undefined;

    /**
     * Create a new `AWS::ManagedBlockchain::Node`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNodeProps) {
        super(scope, id, { type: CfnNode.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'networkId', this);
        cdk.requireProperty(props, 'nodeConfiguration', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrMemberId = cdk.Token.asString(this.getAtt('MemberId', cdk.ResolutionTypeHint.STRING));
        this.attrNetworkId = cdk.Token.asString(this.getAtt('NetworkId', cdk.ResolutionTypeHint.STRING));
        this.attrNodeId = cdk.Token.asString(this.getAtt('NodeId', cdk.ResolutionTypeHint.STRING));

        this.networkId = props.networkId;
        this.nodeConfiguration = props.nodeConfiguration;
        this.memberId = props.memberId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNode.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            networkId: this.networkId,
            nodeConfiguration: this.nodeConfiguration,
            memberId: this.memberId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNodePropsToCloudFormation(props);
    }
}

export namespace CfnNode {
    /**
     * Configuration properties of a peer node within a membership.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html
     */
    export interface NodeConfigurationProperty {
        /**
         * The Availability Zone in which the node exists. Required for Ethereum nodes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-availabilityzone
         */
        readonly availabilityZone: string;
        /**
         * The Amazon Managed Blockchain instance type for the node.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-managedblockchain-node-nodeconfiguration.html#cfn-managedblockchain-node-nodeconfiguration-instancetype
         */
        readonly instanceType: string;
    }
}

/**
 * Determine whether the given properties match those of a `NodeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NodeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnNode_NodeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.requiredValidator)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('instanceType', cdk.requiredValidator)(properties.instanceType));
    errors.collect(cdk.propertyValidator('instanceType', cdk.validateString)(properties.instanceType));
    return errors.wrap('supplied properties not correct for "NodeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Node.NodeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NodeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ManagedBlockchain::Node.NodeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnNodeNodeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNode_NodeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        InstanceType: cdk.stringToCloudFormation(properties.instanceType),
    };
}

// @ts-ignore TS6133
function CfnNodeNodeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNode.NodeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNode.NodeConfigurationProperty>();
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone));
    ret.addPropertyResult('instanceType', 'InstanceType', cfn_parse.FromCloudFormation.getString(properties.InstanceType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
