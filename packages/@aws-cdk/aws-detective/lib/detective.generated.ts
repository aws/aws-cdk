// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:53.278Z","fingerprint":"bEBm4xXhFfEiaD9MCLzin771ioIcbjPs5gWV/u2G0R0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnGraph`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html
 */
export interface CfnGraphProps {

    /**
     * The tag values to assign to the new behavior graph.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html#cfn-detective-graph-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnGraphProps`
 *
 * @param properties - the TypeScript properties of a `CfnGraphProps`
 *
 * @returns the result of the validation.
 */
function CfnGraphPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnGraphProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Detective::Graph` resource
 *
 * @param properties - the TypeScript properties of a `CfnGraphProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Detective::Graph` resource.
 */
// @ts-ignore TS6133
function cfnGraphPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGraphPropsValidator(properties).assertSuccess();
    return {
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnGraphPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGraphProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGraphProps>();
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Detective::Graph`
 *
 * The `AWS::Detective::Graph` resource is an Amazon Detective resource type that creates a Detective behavior graph. The requesting account becomes the administrator account for the behavior graph.
 *
 * @cloudformationResource AWS::Detective::Graph
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html
 */
export class CfnGraph extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Detective::Graph";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGraph {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGraphPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGraph(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the new behavior graph.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The tag values to assign to the new behavior graph.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-graph.html#cfn-detective-graph-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Detective::Graph`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGraphProps = {}) {
        super(scope, id, { type: CfnGraph.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Detective::Graph", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGraph.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGraphPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnMemberInvitation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html
 */
export interface CfnMemberInvitationProps {

    /**
     * The ARN of the behavior graph to invite the account to contribute data to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-grapharn
     */
    readonly graphArn: string;

    /**
     * The root user email address of the invited account. If the email address provided is not the root user email address for the provided account, the invitation creation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberemailaddress
     */
    readonly memberEmailAddress: string;

    /**
     * The AWS account identifier of the invited account
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberid
     */
    readonly memberId: string;

    /**
     * Whether to send an invitation email to the member account. If set to true, the member account does not receive an invitation email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-disableemailnotification
     */
    readonly disableEmailNotification?: boolean | cdk.IResolvable;

    /**
     * Customized text to include in the invitation email message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-message
     */
    readonly message?: string;
}

/**
 * Determine whether the given properties match those of a `CfnMemberInvitationProps`
 *
 * @param properties - the TypeScript properties of a `CfnMemberInvitationProps`
 *
 * @returns the result of the validation.
 */
function CfnMemberInvitationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('disableEmailNotification', cdk.validateBoolean)(properties.disableEmailNotification));
    errors.collect(cdk.propertyValidator('graphArn', cdk.requiredValidator)(properties.graphArn));
    errors.collect(cdk.propertyValidator('graphArn', cdk.validateString)(properties.graphArn));
    errors.collect(cdk.propertyValidator('memberEmailAddress', cdk.requiredValidator)(properties.memberEmailAddress));
    errors.collect(cdk.propertyValidator('memberEmailAddress', cdk.validateString)(properties.memberEmailAddress));
    errors.collect(cdk.propertyValidator('memberId', cdk.requiredValidator)(properties.memberId));
    errors.collect(cdk.propertyValidator('memberId', cdk.validateString)(properties.memberId));
    errors.collect(cdk.propertyValidator('message', cdk.validateString)(properties.message));
    return errors.wrap('supplied properties not correct for "CfnMemberInvitationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Detective::MemberInvitation` resource
 *
 * @param properties - the TypeScript properties of a `CfnMemberInvitationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Detective::MemberInvitation` resource.
 */
// @ts-ignore TS6133
function cfnMemberInvitationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMemberInvitationPropsValidator(properties).assertSuccess();
    return {
        GraphArn: cdk.stringToCloudFormation(properties.graphArn),
        MemberEmailAddress: cdk.stringToCloudFormation(properties.memberEmailAddress),
        MemberId: cdk.stringToCloudFormation(properties.memberId),
        DisableEmailNotification: cdk.booleanToCloudFormation(properties.disableEmailNotification),
        Message: cdk.stringToCloudFormation(properties.message),
    };
}

// @ts-ignore TS6133
function CfnMemberInvitationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMemberInvitationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMemberInvitationProps>();
    ret.addPropertyResult('graphArn', 'GraphArn', cfn_parse.FromCloudFormation.getString(properties.GraphArn));
    ret.addPropertyResult('memberEmailAddress', 'MemberEmailAddress', cfn_parse.FromCloudFormation.getString(properties.MemberEmailAddress));
    ret.addPropertyResult('memberId', 'MemberId', cfn_parse.FromCloudFormation.getString(properties.MemberId));
    ret.addPropertyResult('disableEmailNotification', 'DisableEmailNotification', properties.DisableEmailNotification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableEmailNotification) : undefined);
    ret.addPropertyResult('message', 'Message', properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Detective::MemberInvitation`
 *
 * The `AWS::Detective::MemberInvitation` resource is an Amazon Detective resource type that creates an invitation to join a Detective behavior graph. The administrator account can choose whether to send an email notification of the invitation to the root user email address of the AWS account.
 *
 * @cloudformationResource AWS::Detective::MemberInvitation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html
 */
export class CfnMemberInvitation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Detective::MemberInvitation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMemberInvitation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMemberInvitationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMemberInvitation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the behavior graph to invite the account to contribute data to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-grapharn
     */
    public graphArn: string;

    /**
     * The root user email address of the invited account. If the email address provided is not the root user email address for the provided account, the invitation creation fails.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberemailaddress
     */
    public memberEmailAddress: string;

    /**
     * The AWS account identifier of the invited account
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-memberid
     */
    public memberId: string;

    /**
     * Whether to send an invitation email to the member account. If set to true, the member account does not receive an invitation email.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-disableemailnotification
     */
    public disableEmailNotification: boolean | cdk.IResolvable | undefined;

    /**
     * Customized text to include in the invitation email message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-detective-memberinvitation.html#cfn-detective-memberinvitation-message
     */
    public message: string | undefined;

    /**
     * Create a new `AWS::Detective::MemberInvitation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMemberInvitationProps) {
        super(scope, id, { type: CfnMemberInvitation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'graphArn', this);
        cdk.requireProperty(props, 'memberEmailAddress', this);
        cdk.requireProperty(props, 'memberId', this);

        this.graphArn = props.graphArn;
        this.memberEmailAddress = props.memberEmailAddress;
        this.memberId = props.memberId;
        this.disableEmailNotification = props.disableEmailNotification;
        this.message = props.message;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMemberInvitation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            graphArn: this.graphArn,
            memberEmailAddress: this.memberEmailAddress,
            memberId: this.memberId,
            disableEmailNotification: this.disableEmailNotification,
            message: this.message,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMemberInvitationPropsToCloudFormation(props);
    }
}
