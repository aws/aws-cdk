// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:51:03.660Z","fingerprint":"62Yz5WAZENjk0rRl3fLBRC7Xq5vN0OPfpmNpAtEy/9I="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnNotificationRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html
 */
export interface CfnNotificationRuleProps {

    /**
     * The level of detail to include in the notifications for this resource. `BASIC` will include only the contents of the event as it would appear in Amazon CloudWatch. `FULL` will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-detailtype
     */
    readonly detailType: string;

    /**
     * A list of event types associated with this notification rule. For a complete list of event types and IDs, see [Notification concepts](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api) in the *Developer Tools Console User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeids
     */
    readonly eventTypeIds: string[];

    /**
     * The name for the notification rule. Notification rule names must be unique in your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the notification rule. Supported resources include pipelines in AWS CodePipeline , repositories in AWS CodeCommit , and build projects in AWS CodeBuild .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-resource
     */
    readonly resource: string;

    /**
     * A list of Amazon Resource Names (ARNs) of Amazon Simple Notification Service topics and AWS Chatbot clients to associate with the notification rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targets
     */
    readonly targets: Array<CfnNotificationRule.TargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.CreatedBy`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-createdby
     */
    readonly createdBy?: string;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.EventTypeId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeid
     */
    readonly eventTypeId?: string;

    /**
     * The status of the notification rule. The default value is `ENABLED` . If the status is set to `DISABLED` , notifications aren't sent for the notification rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-status
     */
    readonly status?: string;

    /**
     * A list of tags to apply to this notification rule. Key names cannot start with " `aws` ".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-tags
     */
    readonly tags?: any;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.TargetAddress`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targetaddress
     */
    readonly targetAddress?: string;
}

/**
 * Determine whether the given properties match those of a `CfnNotificationRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnNotificationRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnNotificationRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('createdBy', cdk.validateString)(properties.createdBy));
    errors.collect(cdk.propertyValidator('detailType', cdk.requiredValidator)(properties.detailType));
    errors.collect(cdk.propertyValidator('detailType', cdk.validateString)(properties.detailType));
    errors.collect(cdk.propertyValidator('eventTypeId', cdk.validateString)(properties.eventTypeId));
    errors.collect(cdk.propertyValidator('eventTypeIds', cdk.requiredValidator)(properties.eventTypeIds));
    errors.collect(cdk.propertyValidator('eventTypeIds', cdk.listValidator(cdk.validateString))(properties.eventTypeIds));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('resource', cdk.requiredValidator)(properties.resource));
    errors.collect(cdk.propertyValidator('resource', cdk.validateString)(properties.resource));
    errors.collect(cdk.propertyValidator('status', cdk.validateString)(properties.status));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('targetAddress', cdk.validateString)(properties.targetAddress));
    errors.collect(cdk.propertyValidator('targets', cdk.requiredValidator)(properties.targets));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnNotificationRule_TargetPropertyValidator))(properties.targets));
    return errors.wrap('supplied properties not correct for "CfnNotificationRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeStarNotifications::NotificationRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnNotificationRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeStarNotifications::NotificationRule` resource.
 */
// @ts-ignore TS6133
function cfnNotificationRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationRulePropsValidator(properties).assertSuccess();
    return {
        DetailType: cdk.stringToCloudFormation(properties.detailType),
        EventTypeIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.eventTypeIds),
        Name: cdk.stringToCloudFormation(properties.name),
        Resource: cdk.stringToCloudFormation(properties.resource),
        Targets: cdk.listMapper(cfnNotificationRuleTargetPropertyToCloudFormation)(properties.targets),
        CreatedBy: cdk.stringToCloudFormation(properties.createdBy),
        EventTypeId: cdk.stringToCloudFormation(properties.eventTypeId),
        Status: cdk.stringToCloudFormation(properties.status),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TargetAddress: cdk.stringToCloudFormation(properties.targetAddress),
    };
}

// @ts-ignore TS6133
function CfnNotificationRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationRuleProps>();
    ret.addPropertyResult('detailType', 'DetailType', cfn_parse.FromCloudFormation.getString(properties.DetailType));
    ret.addPropertyResult('eventTypeIds', 'EventTypeIds', cfn_parse.FromCloudFormation.getStringArray(properties.EventTypeIds));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('resource', 'Resource', cfn_parse.FromCloudFormation.getString(properties.Resource));
    ret.addPropertyResult('targets', 'Targets', cfn_parse.FromCloudFormation.getArray(CfnNotificationRuleTargetPropertyFromCloudFormation)(properties.Targets));
    ret.addPropertyResult('createdBy', 'CreatedBy', properties.CreatedBy != null ? cfn_parse.FromCloudFormation.getString(properties.CreatedBy) : undefined);
    ret.addPropertyResult('eventTypeId', 'EventTypeId', properties.EventTypeId != null ? cfn_parse.FromCloudFormation.getString(properties.EventTypeId) : undefined);
    ret.addPropertyResult('status', 'Status', properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('targetAddress', 'TargetAddress', properties.TargetAddress != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAddress) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeStarNotifications::NotificationRule`
 *
 * Creates a notification rule for a resource. The rule specifies the events you want notifications about and the targets (such as AWS Chatbot topics or AWS Chatbot clients configured for Slack) where you want to receive them.
 *
 * @cloudformationResource AWS::CodeStarNotifications::NotificationRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html
 */
export class CfnNotificationRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeStarNotifications::NotificationRule";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNotificationRule {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNotificationRulePropsFromCloudFormation(resourceProperties);
        const ret = new CfnNotificationRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The level of detail to include in the notifications for this resource. `BASIC` will include only the contents of the event as it would appear in Amazon CloudWatch. `FULL` will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-detailtype
     */
    public detailType: string;

    /**
     * A list of event types associated with this notification rule. For a complete list of event types and IDs, see [Notification concepts](https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api) in the *Developer Tools Console User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeids
     */
    public eventTypeIds: string[];

    /**
     * The name for the notification rule. Notification rule names must be unique in your AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the notification rule. Supported resources include pipelines in AWS CodePipeline , repositories in AWS CodeCommit , and build projects in AWS CodeBuild .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-resource
     */
    public resource: string;

    /**
     * A list of Amazon Resource Names (ARNs) of Amazon Simple Notification Service topics and AWS Chatbot clients to associate with the notification rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targets
     */
    public targets: Array<CfnNotificationRule.TargetProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.CreatedBy`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-createdby
     */
    public createdBy: string | undefined;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.EventTypeId`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-eventtypeid
     */
    public eventTypeId: string | undefined;

    /**
     * The status of the notification rule. The default value is `ENABLED` . If the status is set to `DISABLED` , notifications aren't sent for the notification rule.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-status
     */
    public status: string | undefined;

    /**
     * A list of tags to apply to this notification rule. Key names cannot start with " `aws` ".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::CodeStarNotifications::NotificationRule.TargetAddress`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-targetaddress
     */
    public targetAddress: string | undefined;

    /**
     * Create a new `AWS::CodeStarNotifications::NotificationRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNotificationRuleProps) {
        super(scope, id, { type: CfnNotificationRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'detailType', this);
        cdk.requireProperty(props, 'eventTypeIds', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'resource', this);
        cdk.requireProperty(props, 'targets', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.detailType = props.detailType;
        this.eventTypeIds = props.eventTypeIds;
        this.name = props.name;
        this.resource = props.resource;
        this.targets = props.targets;
        this.createdBy = props.createdBy;
        this.eventTypeId = props.eventTypeId;
        this.status = props.status;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::CodeStarNotifications::NotificationRule", props.tags, { tagPropertyName: 'tags' });
        this.targetAddress = props.targetAddress;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNotificationRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            detailType: this.detailType,
            eventTypeIds: this.eventTypeIds,
            name: this.name,
            resource: this.resource,
            targets: this.targets,
            createdBy: this.createdBy,
            eventTypeId: this.eventTypeId,
            status: this.status,
            tags: this.tags.renderTags(),
            targetAddress: this.targetAddress,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNotificationRulePropsToCloudFormation(props);
    }
}

export namespace CfnNotificationRule {
    /**
     * Information about the AWS Chatbot topics or AWS Chatbot clients associated with a notification rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html
     */
    export interface TargetProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS Chatbot topic or AWS Chatbot client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html#cfn-codestarnotifications-notificationrule-target-targetaddress
         */
        readonly targetAddress: string;
        /**
         * The target type. Can be an Amazon Simple Notification Service topic or AWS Chatbot client.
         *
         * - Amazon Simple Notification Service topics are specified as `SNS` .
         * - AWS Chatbot clients are specified as `AWSChatbotSlack` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html#cfn-codestarnotifications-notificationrule-target-targettype
         */
        readonly targetType: string;
    }
}

/**
 * Determine whether the given properties match those of a `TargetProperty`
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the result of the validation.
 */
function CfnNotificationRule_TargetPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetAddress', cdk.requiredValidator)(properties.targetAddress));
    errors.collect(cdk.propertyValidator('targetAddress', cdk.validateString)(properties.targetAddress));
    errors.collect(cdk.propertyValidator('targetType', cdk.requiredValidator)(properties.targetType));
    errors.collect(cdk.propertyValidator('targetType', cdk.validateString)(properties.targetType));
    return errors.wrap('supplied properties not correct for "TargetProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeStarNotifications::NotificationRule.Target` resource
 *
 * @param properties - the TypeScript properties of a `TargetProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeStarNotifications::NotificationRule.Target` resource.
 */
// @ts-ignore TS6133
function cfnNotificationRuleTargetPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNotificationRule_TargetPropertyValidator(properties).assertSuccess();
    return {
        TargetAddress: cdk.stringToCloudFormation(properties.targetAddress),
        TargetType: cdk.stringToCloudFormation(properties.targetType),
    };
}

// @ts-ignore TS6133
function CfnNotificationRuleTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNotificationRule.TargetProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNotificationRule.TargetProperty>();
    ret.addPropertyResult('targetAddress', 'TargetAddress', cfn_parse.FromCloudFormation.getString(properties.TargetAddress));
    ret.addPropertyResult('targetType', 'TargetType', cfn_parse.FromCloudFormation.getString(properties.TargetType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
