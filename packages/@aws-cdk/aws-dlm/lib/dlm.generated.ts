// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:51:55.495Z","fingerprint":"gBvaIWpqzfq1WXPN/8tRH4RJRZ3s09DAEsEKLqtSDik="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnLifecyclePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export interface CfnLifecyclePolicyProps {

    /**
     * A description of the lifecycle policy. The characters ^[0-9A-Za-z _-]+$ are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-description
     */
    readonly description?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-executionrolearn
     */
    readonly executionRoleArn?: string;

    /**
     * The configuration details of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-policydetails
     */
    readonly policyDetails?: CfnLifecyclePolicy.PolicyDetailsProperty | cdk.IResolvable;

    /**
     * The activation state of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-state
     */
    readonly state?: string;

    /**
     * The tags to apply to the lifecycle policy during creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnLifecyclePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnLifecyclePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('executionRoleArn', cdk.validateString)(properties.executionRoleArn));
    errors.collect(cdk.propertyValidator('policyDetails', CfnLifecyclePolicy_PolicyDetailsPropertyValidator)(properties.policyDetails));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLifecyclePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnLifecyclePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicyPropsValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        ExecutionRoleArn: cdk.stringToCloudFormation(properties.executionRoleArn),
        PolicyDetails: cfnLifecyclePolicyPolicyDetailsPropertyToCloudFormation(properties.policyDetails),
        State: cdk.stringToCloudFormation(properties.state),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicyProps>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('executionRoleArn', 'ExecutionRoleArn', properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined);
    ret.addPropertyResult('policyDetails', 'PolicyDetails', properties.PolicyDetails != null ? CfnLifecyclePolicyPolicyDetailsPropertyFromCloudFormation(properties.PolicyDetails) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::DLM::LifecyclePolicy`
 *
 * Specifies a lifecycle policy, which is used to automate operations on Amazon EBS resources.
 *
 * The properties are required when you add a lifecycle policy and optional when you update a lifecycle policy.
 *
 * @cloudformationResource AWS::DLM::LifecyclePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export class CfnLifecyclePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DLM::LifecyclePolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecyclePolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLifecyclePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnLifecyclePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the lifecycle policy.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * A description of the lifecycle policy. The characters ^[0-9A-Za-z _-]+$ are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-description
     */
    public description: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-executionrolearn
     */
    public executionRoleArn: string | undefined;

    /**
     * The configuration details of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-policydetails
     */
    public policyDetails: CfnLifecyclePolicy.PolicyDetailsProperty | cdk.IResolvable | undefined;

    /**
     * The activation state of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-state
     */
    public state: string | undefined;

    /**
     * The tags to apply to the lifecycle policy during creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::DLM::LifecyclePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLifecyclePolicyProps = {}) {
        super(scope, id, { type: CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.description = props.description;
        this.executionRoleArn = props.executionRoleArn;
        this.policyDetails = props.policyDetails;
        this.state = props.state;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DLM::LifecyclePolicy", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            description: this.description,
            executionRoleArn: this.executionRoleArn,
            policyDetails: this.policyDetails,
            state: this.state,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLifecyclePolicyPropsToCloudFormation(props);
    }
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an action for an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html
     */
    export interface ActionProperty {
        /**
         * The rule for copying shared snapshots across Regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-crossregioncopy
         */
        readonly crossRegionCopy: Array<CfnLifecyclePolicy.CrossRegionCopyActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A descriptive name for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('crossRegionCopy', cdk.requiredValidator)(properties.crossRegionCopy));
    errors.collect(cdk.propertyValidator('crossRegionCopy', cdk.listValidator(CfnLifecyclePolicy_CrossRegionCopyActionPropertyValidator))(properties.crossRegionCopy));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Action` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_ActionPropertyValidator(properties).assertSuccess();
    return {
        CrossRegionCopy: cdk.listMapper(cfnLifecyclePolicyCrossRegionCopyActionPropertyToCloudFormation)(properties.crossRegionCopy),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ActionProperty>();
    ret.addPropertyResult('crossRegionCopy', 'CrossRegionCopy', cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyCrossRegionCopyActionPropertyFromCloudFormation)(properties.CrossRegionCopy));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies information about the archive storage tier retention period.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html
     */
    export interface ArchiveRetainRuleProperty {
        /**
         * Information about retention period in the Amazon EBS Snapshots Archive. For more information, see [Archive Amazon EBS snapshots](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/snapshot-archive.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html#cfn-dlm-lifecyclepolicy-archiveretainrule-retentionarchivetier
         */
        readonly retentionArchiveTier: CfnLifecyclePolicy.RetentionArchiveTierProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveRetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRetainRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_ArchiveRetainRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('retentionArchiveTier', cdk.requiredValidator)(properties.retentionArchiveTier));
    errors.collect(cdk.propertyValidator('retentionArchiveTier', CfnLifecyclePolicy_RetentionArchiveTierPropertyValidator)(properties.retentionArchiveTier));
    return errors.wrap('supplied properties not correct for "ArchiveRetainRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ArchiveRetainRule` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveRetainRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ArchiveRetainRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyArchiveRetainRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_ArchiveRetainRulePropertyValidator(properties).assertSuccess();
    return {
        RetentionArchiveTier: cfnLifecyclePolicyRetentionArchiveTierPropertyToCloudFormation(properties.retentionArchiveTier),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ArchiveRetainRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ArchiveRetainRuleProperty>();
    ret.addPropertyResult('retentionArchiveTier', 'RetentionArchiveTier', CfnLifecyclePolicyRetentionArchiveTierPropertyFromCloudFormation(properties.RetentionArchiveTier));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a snapshot archiving rule for a schedule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html
     */
    export interface ArchiveRuleProperty {
        /**
         * Information about the retention period for the snapshot archiving rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html#cfn-dlm-lifecyclepolicy-archiverule-retainrule
         */
        readonly retainRule: CfnLifecyclePolicy.ArchiveRetainRuleProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_ArchiveRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('retainRule', cdk.requiredValidator)(properties.retainRule));
    errors.collect(cdk.propertyValidator('retainRule', CfnLifecyclePolicy_ArchiveRetainRulePropertyValidator)(properties.retainRule));
    return errors.wrap('supplied properties not correct for "ArchiveRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ArchiveRule` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ArchiveRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyArchiveRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_ArchiveRulePropertyValidator(properties).assertSuccess();
    return {
        RetainRule: cfnLifecyclePolicyArchiveRetainRulePropertyToCloudFormation(properties.retainRule),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ArchiveRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ArchiveRuleProperty>();
    ret.addPropertyResult('retainRule', 'RetainRule', CfnLifecyclePolicyArchiveRetainRulePropertyFromCloudFormation(properties.RetainRule));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies when the policy should create snapshots or AMIs.
     *
     * > - You must specify either *CronExpression* , or *Interval* , *IntervalUnit* , and *Times* .
     * > - If you need to specify an `ArchiveRule` for the schedule, then you must specify a creation frequency of at least 28 days.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html
     */
    export interface CreateRuleProperty {
        /**
         * The schedule, as a Cron expression. The schedule interval must be between 1 hour and 1 year. For more information, see [Cron expressions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions) in the *Amazon CloudWatch User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-cronexpression
         */
        readonly cronExpression?: string;
        /**
         * The interval between snapshots. The supported values are 1, 2, 3, 4, 6, 8, 12, and 24.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-interval
         */
        readonly interval?: number;
        /**
         * The interval unit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-intervalunit
         */
        readonly intervalUnit?: string;
        /**
         * *[Snapshot policies only]* Specifies the destination for snapshots created by the policy. To create snapshots in the same Region as the source resource, specify `CLOUD` . To create snapshots on the same Outpost as the source resource, specify `OUTPOST_LOCAL` . If you omit this parameter, `CLOUD` is used by default.
         *
         * If the policy targets resources in an AWS Region , then you must create snapshots in the same Region as the source resource. If the policy targets resources on an Outpost, then you can create snapshots on the same Outpost as the source resource, or in the Region of that Outpost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-location
         */
        readonly location?: string;
        /**
         * The time, in UTC, to start the operation. The supported format is hh:mm.
         *
         * The operation occurs within a one-hour window following the specified time. If you do not specify a time, Amazon Data Lifecycle Manager selects a time within the next 24 hours.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-times
         */
        readonly times?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CreateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CreateRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_CreateRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cronExpression', cdk.validateString)(properties.cronExpression));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    errors.collect(cdk.propertyValidator('location', cdk.validateString)(properties.location));
    errors.collect(cdk.propertyValidator('times', cdk.listValidator(cdk.validateString))(properties.times));
    return errors.wrap('supplied properties not correct for "CreateRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CreateRule` resource
 *
 * @param properties - the TypeScript properties of a `CreateRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CreateRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyCreateRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_CreateRulePropertyValidator(properties).assertSuccess();
    return {
        CronExpression: cdk.stringToCloudFormation(properties.cronExpression),
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
        Location: cdk.stringToCloudFormation(properties.location),
        Times: cdk.listMapper(cdk.stringToCloudFormation)(properties.times),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCreateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CreateRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CreateRuleProperty>();
    ret.addPropertyResult('cronExpression', 'CronExpression', properties.CronExpression != null ? cfn_parse.FromCloudFormation.getString(properties.CronExpression) : undefined);
    ret.addPropertyResult('interval', 'Interval', properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined);
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined);
    ret.addPropertyResult('location', 'Location', properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined);
    ret.addPropertyResult('times', 'Times', properties.Times != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Times) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies a cross-Region copy action for event-based policies.
     *
     * > To specify a cross-Region copy rule for snapshot and AMI policies, use `CrossRegionCopyRule` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html
     */
    export interface CrossRegionCopyActionProperty {
        /**
         * The encryption settings for the copied snapshot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-encryptionconfiguration
         */
        readonly encryptionConfiguration: CfnLifecyclePolicy.EncryptionConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies. After the retention period expires, the cross-Region copy is deleted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;
        /**
         * The target Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-target
         */
        readonly target: string;
    }
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyActionProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_CrossRegionCopyActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionConfiguration', cdk.requiredValidator)(properties.encryptionConfiguration));
    errors.collect(cdk.propertyValidator('encryptionConfiguration', CfnLifecyclePolicy_EncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
    errors.collect(cdk.propertyValidator('retainRule', CfnLifecyclePolicy_CrossRegionCopyRetainRulePropertyValidator)(properties.retainRule));
    errors.collect(cdk.propertyValidator('target', cdk.requiredValidator)(properties.target));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    return errors.wrap('supplied properties not correct for "CrossRegionCopyActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyAction` resource
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyAction` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyCrossRegionCopyActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_CrossRegionCopyActionPropertyValidator(properties).assertSuccess();
    return {
        EncryptionConfiguration: cfnLifecyclePolicyEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
        RetainRule: cfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties.retainRule),
        Target: cdk.stringToCloudFormation(properties.target),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyActionProperty>();
    ret.addPropertyResult('encryptionConfiguration', 'EncryptionConfiguration', CfnLifecyclePolicyEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration));
    ret.addPropertyResult('retainRule', 'RetainRule', properties.RetainRule != null ? CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined);
    ret.addPropertyResult('target', 'Target', cfn_parse.FromCloudFormation.getString(properties.Target));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[AMI policies only]* Specifies an AMI deprecation rule for cross-Region AMI copies created by an AMI policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html
     */
    export interface CrossRegionCopyDeprecateRuleProperty {
        /**
         * The period after which to deprecate the cross-Region AMI copies. The period must be less than or equal to the cross-Region AMI copy retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-interval
         */
        readonly interval: number;
        /**
         * The unit of time in which to measure the *Interval* . For example, to deprecate a cross-Region AMI copy after 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-intervalunit
         */
        readonly intervalUnit: string;
    }
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyDeprecateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyDeprecateRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_CrossRegionCopyDeprecateRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('interval', cdk.requiredValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.requiredValidator)(properties.intervalUnit));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "CrossRegionCopyDeprecateRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyDeprecateRule` resource
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyDeprecateRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyDeprecateRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_CrossRegionCopyDeprecateRulePropertyValidator(properties).assertSuccess();
    return {
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty>();
    ret.addPropertyResult('interval', 'Interval', cfn_parse.FromCloudFormation.getNumber(properties.Interval));
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', cfn_parse.FromCloudFormation.getString(properties.IntervalUnit));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies. After the retention period expires, the cross-Region copy is deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html
     */
    export interface CrossRegionCopyRetainRuleProperty {
        /**
         * The amount of time to retain a cross-Region snapshot or AMI copy. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-interval
         */
        readonly interval: number;
        /**
         * The unit of time for time-based retention. For example, to retain a cross-Region copy for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-intervalunit
         */
        readonly intervalUnit: string;
    }
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyRetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRetainRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_CrossRegionCopyRetainRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('interval', cdk.requiredValidator)(properties.interval));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.requiredValidator)(properties.intervalUnit));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "CrossRegionCopyRetainRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyRetainRule` resource
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRetainRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyRetainRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_CrossRegionCopyRetainRulePropertyValidator(properties).assertSuccess();
    return {
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty>();
    ret.addPropertyResult('interval', 'Interval', cfn_parse.FromCloudFormation.getNumber(properties.Interval));
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', cfn_parse.FromCloudFormation.getString(properties.IntervalUnit));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a cross-Region copy rule for snapshot and AMI policies.
     *
     * > To specify a cross-Region copy action for event-based polices, use `CrossRegionCopyAction` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html
     */
    export interface CrossRegionCopyRuleProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption. If this parameter is not specified, the default KMS key for the account is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-cmkarn
         */
        readonly cmkArn?: string;
        /**
         * Indicates whether to copy all user-defined tags from the source snapshot or AMI to the cross-Region copy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-copytags
         */
        readonly copyTags?: boolean | cdk.IResolvable;
        /**
         * *[AMI policies only]* The AMI deprecation rule for cross-Region AMI copies created by the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-deprecaterule
         */
        readonly deprecateRule?: CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty | cdk.IResolvable;
        /**
         * To encrypt a copy of an unencrypted snapshot if encryption by default is not enabled, enable encryption using this parameter. Copies of encrypted snapshots are encrypted, even if this parameter is false or if encryption by default is not enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-encrypted
         */
        readonly encrypted: boolean | cdk.IResolvable;
        /**
         * The retention rule that indicates how long the cross-Region snapshot or AMI copies are to be retained in the destination Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;
        /**
         * The target Region or the Amazon Resource Name (ARN) of the target Outpost for the snapshot copies.
         *
         * Use this parameter instead of *TargetRegion* . Do not specify both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-target
         */
        readonly target?: string;
        /**
         * > Avoid using this parameter when creating new policies. Instead, use *Target* to specify a target Region or a target Outpost for snapshot copies.
         * >
         * > For policies created before the *Target* parameter was introduced, this parameter indicates the target Region for snapshot copies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-targetregion
         */
        readonly targetRegion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_CrossRegionCopyRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cmkArn', cdk.validateString)(properties.cmkArn));
    errors.collect(cdk.propertyValidator('copyTags', cdk.validateBoolean)(properties.copyTags));
    errors.collect(cdk.propertyValidator('deprecateRule', CfnLifecyclePolicy_CrossRegionCopyDeprecateRulePropertyValidator)(properties.deprecateRule));
    errors.collect(cdk.propertyValidator('encrypted', cdk.requiredValidator)(properties.encrypted));
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    errors.collect(cdk.propertyValidator('retainRule', CfnLifecyclePolicy_CrossRegionCopyRetainRulePropertyValidator)(properties.retainRule));
    errors.collect(cdk.propertyValidator('target', cdk.validateString)(properties.target));
    errors.collect(cdk.propertyValidator('targetRegion', cdk.validateString)(properties.targetRegion));
    return errors.wrap('supplied properties not correct for "CrossRegionCopyRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyRule` resource
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.CrossRegionCopyRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyCrossRegionCopyRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_CrossRegionCopyRulePropertyValidator(properties).assertSuccess();
    return {
        CmkArn: cdk.stringToCloudFormation(properties.cmkArn),
        CopyTags: cdk.booleanToCloudFormation(properties.copyTags),
        DeprecateRule: cfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyToCloudFormation(properties.deprecateRule),
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
        RetainRule: cfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties.retainRule),
        Target: cdk.stringToCloudFormation(properties.target),
        TargetRegion: cdk.stringToCloudFormation(properties.targetRegion),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyRuleProperty>();
    ret.addPropertyResult('cmkArn', 'CmkArn', properties.CmkArn != null ? cfn_parse.FromCloudFormation.getString(properties.CmkArn) : undefined);
    ret.addPropertyResult('copyTags', 'CopyTags', properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined);
    ret.addPropertyResult('deprecateRule', 'DeprecateRule', properties.DeprecateRule != null ? CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyFromCloudFormation(properties.DeprecateRule) : undefined);
    ret.addPropertyResult('encrypted', 'Encrypted', cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted));
    ret.addPropertyResult('retainRule', 'RetainRule', properties.RetainRule != null ? CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined);
    ret.addPropertyResult('target', 'Target', properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined);
    ret.addPropertyResult('targetRegion', 'TargetRegion', properties.TargetRegion != null ? cfn_parse.FromCloudFormation.getString(properties.TargetRegion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[AMI policies only]* Specifies an AMI deprecation rule for AMIs created by an AMI lifecycle policy.
     *
     * For age-based schedules, you must specify *Interval* and *IntervalUnit* . For count-based schedules, you must specify *Count* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html
     */
    export interface DeprecateRuleProperty {
        /**
         * If the schedule has a count-based retention rule, this parameter specifies the number of oldest AMIs to deprecate. The count must be less than or equal to the schedule's retention count, and it can't be greater than 1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-count
         */
        readonly count?: number;
        /**
         * If the schedule has an age-based retention rule, this parameter specifies the period after which to deprecate AMIs created by the schedule. The period must be less than or equal to the schedule's retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time in which to measure the *Interval* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeprecateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `DeprecateRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_DeprecateRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "DeprecateRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.DeprecateRule` resource
 *
 * @param properties - the TypeScript properties of a `DeprecateRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.DeprecateRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyDeprecateRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_DeprecateRulePropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.numberToCloudFormation(properties.count),
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyDeprecateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.DeprecateRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.DeprecateRuleProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addPropertyResult('interval', 'Interval', properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined);
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies the encryption settings for cross-Region snapshot copies created by event-based policies.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html
     */
    export interface EncryptionConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption. If this parameter is not specified, the default KMS key for the account is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-cmkarn
         */
        readonly cmkArn?: string;
        /**
         * To encrypt a copy of an unencrypted snapshot when encryption by default is not enabled, enable encryption using this parameter. Copies of encrypted snapshots are encrypted, even if this parameter is false or when encryption by default is not enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-encrypted
         */
        readonly encrypted: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_EncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cmkArn', cdk.validateString)(properties.cmkArn));
    errors.collect(cdk.propertyValidator('encrypted', cdk.requiredValidator)(properties.encrypted));
    errors.collect(cdk.propertyValidator('encrypted', cdk.validateBoolean)(properties.encrypted));
    return errors.wrap('supplied properties not correct for "EncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_EncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        CmkArn: cdk.stringToCloudFormation(properties.cmkArn),
        Encrypted: cdk.booleanToCloudFormation(properties.encrypted),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EncryptionConfigurationProperty>();
    ret.addPropertyResult('cmkArn', 'CmkArn', properties.CmkArn != null ? cfn_parse.FromCloudFormation.getString(properties.CmkArn) : undefined);
    ret.addPropertyResult('encrypted', 'Encrypted', cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an event that activates an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html
     */
    export interface EventParametersProperty {
        /**
         * The snapshot description that can trigger the policy. The description pattern is specified using a regular expression. The policy runs only if a snapshot with a description that matches the specified pattern is shared with your account.
         *
         * For example, specifying `^.*Created for policy: policy-1234567890abcdef0.*$` configures the policy to run only if snapshots created by policy `policy-1234567890abcdef0` are shared with your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-descriptionregex
         */
        readonly descriptionRegex?: string;
        /**
         * The type of event. Currently, only snapshot sharing events are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-eventtype
         */
        readonly eventType: string;
        /**
         * The IDs of the AWS accounts that can trigger policy by sharing snapshots with your account. The policy only runs if one of the specified AWS accounts shares a snapshot with your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-snapshotowner
         */
        readonly snapshotOwner: string[];
    }
}

/**
 * Determine whether the given properties match those of a `EventParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EventParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_EventParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('descriptionRegex', cdk.validateString)(properties.descriptionRegex));
    errors.collect(cdk.propertyValidator('eventType', cdk.requiredValidator)(properties.eventType));
    errors.collect(cdk.propertyValidator('eventType', cdk.validateString)(properties.eventType));
    errors.collect(cdk.propertyValidator('snapshotOwner', cdk.requiredValidator)(properties.snapshotOwner));
    errors.collect(cdk.propertyValidator('snapshotOwner', cdk.listValidator(cdk.validateString))(properties.snapshotOwner));
    return errors.wrap('supplied properties not correct for "EventParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EventParameters` resource
 *
 * @param properties - the TypeScript properties of a `EventParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EventParameters` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyEventParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_EventParametersPropertyValidator(properties).assertSuccess();
    return {
        DescriptionRegex: cdk.stringToCloudFormation(properties.descriptionRegex),
        EventType: cdk.stringToCloudFormation(properties.eventType),
        SnapshotOwner: cdk.listMapper(cdk.stringToCloudFormation)(properties.snapshotOwner),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEventParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EventParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EventParametersProperty>();
    ret.addPropertyResult('descriptionRegex', 'DescriptionRegex', properties.DescriptionRegex != null ? cfn_parse.FromCloudFormation.getString(properties.DescriptionRegex) : undefined);
    ret.addPropertyResult('eventType', 'EventType', cfn_parse.FromCloudFormation.getString(properties.EventType));
    ret.addPropertyResult('snapshotOwner', 'SnapshotOwner', cfn_parse.FromCloudFormation.getStringArray(properties.SnapshotOwner));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an event that activates an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html
     */
    export interface EventSourceProperty {
        /**
         * Information about the event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-parameters
         */
        readonly parameters?: CfnLifecyclePolicy.EventParametersProperty | cdk.IResolvable;
        /**
         * The source of the event. Currently only managed CloudWatch Events rules are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-type
         */
        readonly type: string;
    }
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_EventSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('parameters', CfnLifecyclePolicy_EventParametersPropertyValidator)(properties.parameters));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "EventSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EventSource` resource
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.EventSource` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyEventSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_EventSourcePropertyValidator(properties).assertSuccess();
    return {
        Parameters: cfnLifecyclePolicyEventParametersPropertyToCloudFormation(properties.parameters),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EventSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EventSourceProperty>();
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? CfnLifecyclePolicyEventParametersPropertyFromCloudFormation(properties.Parameters) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a rule for enabling fast snapshot restore for snapshots created by snapshot policies. You can enable fast snapshot restore based on either a count or a time interval.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html
     */
    export interface FastRestoreRuleProperty {
        /**
         * The Availability Zones in which to enable fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-availabilityzones
         */
        readonly availabilityZones?: string[];
        /**
         * The number of snapshots to be enabled with fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-count
         */
        readonly count?: number;
        /**
         * The amount of time to enable fast snapshot restore. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time for enabling fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FastRestoreRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FastRestoreRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_FastRestoreRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZones', cdk.listValidator(cdk.validateString))(properties.availabilityZones));
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "FastRestoreRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.FastRestoreRule` resource
 *
 * @param properties - the TypeScript properties of a `FastRestoreRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.FastRestoreRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyFastRestoreRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_FastRestoreRulePropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZones: cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
        Count: cdk.numberToCloudFormation(properties.count),
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyFastRestoreRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.FastRestoreRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.FastRestoreRuleProperty>();
    ret.addPropertyResult('availabilityZones', 'AvailabilityZones', properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AvailabilityZones) : undefined);
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addPropertyResult('interval', 'Interval', properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined);
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies optional parameters for snapshot and AMI policies. The set of valid parameters depends on the combination of policy type and target resource type.
     *
     * If you choose to exclude boot volumes and you specify tags that consequently exclude all of the additional data volumes attached to an instance, then Amazon Data Lifecycle Manager will not create any snapshots for the affected instance, and it will emit a `SnapshotsCreateFailed` Amazon CloudWatch metric. For more information, see [Monitor your policies using Amazon CloudWatch](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-dlm-cw-metrics.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html
     */
    export interface ParametersProperty {
        /**
         * *[Snapshot policies that target instances only]* Indicates whether to exclude the root volume from multi-volume snapshot sets. The default is `false` . If you specify `true` , then the root volumes attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludebootvolume
         */
        readonly excludeBootVolume?: boolean | cdk.IResolvable;
        /**
         * *[Snapshot policies that target instances only]* The tags used to identify data (non-root) volumes to exclude from multi-volume snapshot sets.
         *
         * If you create a snapshot lifecycle policy that targets instances and you specify tags for this parameter, then data volumes with the specified tags that are attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludedatavolumetags
         */
        readonly excludeDataVolumeTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies only]* Indicates whether targeted instances are rebooted when the lifecycle policy runs. `true` indicates that targeted instances are not rebooted when the policy runs. `false` indicates that target instances are rebooted when the policy runs. The default is `true` (instances are not rebooted).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-noreboot
         */
        readonly noReboot?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_ParametersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('excludeBootVolume', cdk.validateBoolean)(properties.excludeBootVolume));
    errors.collect(cdk.propertyValidator('excludeDataVolumeTags', cdk.listValidator(cdk.validateCfnTag))(properties.excludeDataVolumeTags));
    errors.collect(cdk.propertyValidator('noReboot', cdk.validateBoolean)(properties.noReboot));
    return errors.wrap('supplied properties not correct for "ParametersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Parameters` resource
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Parameters` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyParametersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_ParametersPropertyValidator(properties).assertSuccess();
    return {
        ExcludeBootVolume: cdk.booleanToCloudFormation(properties.excludeBootVolume),
        ExcludeDataVolumeTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.excludeDataVolumeTags),
        NoReboot: cdk.booleanToCloudFormation(properties.noReboot),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ParametersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ParametersProperty>();
    ret.addPropertyResult('excludeBootVolume', 'ExcludeBootVolume', properties.ExcludeBootVolume != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeBootVolume) : undefined);
    ret.addPropertyResult('excludeDataVolumeTags', 'ExcludeDataVolumeTags', properties.ExcludeDataVolumeTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ExcludeDataVolumeTags) : undefined);
    ret.addPropertyResult('noReboot', 'NoReboot', properties.NoReboot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoReboot) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[All policy types]* Specifies the configuration of a lifecycle policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html
     */
    export interface PolicyDetailsProperty {
        /**
         * *[Event-based policies only]* The actions to be performed when the event-based policy is activated. You can specify only one action per policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-actions
         */
        readonly actions?: Array<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[Event-based policies only]* The event that activates the event-based policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-eventsource
         */
        readonly eventSource?: CfnLifecyclePolicy.EventSourceProperty | cdk.IResolvable;
        /**
         * *[Snapshot and AMI policies only]* A set of optional parameters for snapshot and AMI lifecycle policies.
         *
         * > If you are modifying a policy that was created or previously modified using the Amazon Data Lifecycle Manager console, then you must include this parameter and specify either the default values or the new values that you require. You can't omit this parameter or set its values to null.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-parameters
         */
        readonly parameters?: CfnLifecyclePolicy.ParametersProperty | cdk.IResolvable;
        /**
         * *[All policy types]* The valid target resource types and actions a policy can manage. Specify `EBS_SNAPSHOT_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of Amazon EBS snapshots. Specify `IMAGE_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of EBS-backed AMIs. Specify `EVENT_BASED_POLICY` to create an event-based policy that performs specific actions when a defined event occurs in your AWS account .
         *
         * The default is `EBS_SNAPSHOT_MANAGEMENT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-policytype
         */
        readonly policyType?: string;
        /**
         * *[Snapshot and AMI policies only]* The location of the resources to backup. If the source resources are located in an AWS Region , specify `CLOUD` . If the source resources are located on an Outpost in your account, specify `OUTPOST` .
         *
         * If you specify `OUTPOST` , Amazon Data Lifecycle Manager backs up all resources of the specified type with matching target tags across all of the Outposts in your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcelocations
         */
        readonly resourceLocations?: string[];
        /**
         * *[Snapshot policies only]* The target resource type for snapshot and AMI lifecycle policies. Use `VOLUME` to create snapshots of individual volumes or use `INSTANCE` to create multi-volume snapshots from the volumes for an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcetypes
         */
        readonly resourceTypes?: string[];
        /**
         * *[Snapshot and AMI policies only]* The schedules of policy-defined actions for snapshot and AMI lifecycle policies. A policy can have up to four schedules—one mandatory schedule and up to three optional schedules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-schedules
         */
        readonly schedules?: Array<CfnLifecyclePolicy.ScheduleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[Snapshot and AMI policies only]* The single tag that identifies targeted resources for this policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-targettags
         */
        readonly targetTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PolicyDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_PolicyDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(CfnLifecyclePolicy_ActionPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('eventSource', CfnLifecyclePolicy_EventSourcePropertyValidator)(properties.eventSource));
    errors.collect(cdk.propertyValidator('parameters', CfnLifecyclePolicy_ParametersPropertyValidator)(properties.parameters));
    errors.collect(cdk.propertyValidator('policyType', cdk.validateString)(properties.policyType));
    errors.collect(cdk.propertyValidator('resourceLocations', cdk.listValidator(cdk.validateString))(properties.resourceLocations));
    errors.collect(cdk.propertyValidator('resourceTypes', cdk.listValidator(cdk.validateString))(properties.resourceTypes));
    errors.collect(cdk.propertyValidator('schedules', cdk.listValidator(CfnLifecyclePolicy_SchedulePropertyValidator))(properties.schedules));
    errors.collect(cdk.propertyValidator('targetTags', cdk.listValidator(cdk.validateCfnTag))(properties.targetTags));
    return errors.wrap('supplied properties not correct for "PolicyDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.PolicyDetails` resource
 *
 * @param properties - the TypeScript properties of a `PolicyDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.PolicyDetails` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyPolicyDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_PolicyDetailsPropertyValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cfnLifecyclePolicyActionPropertyToCloudFormation)(properties.actions),
        EventSource: cfnLifecyclePolicyEventSourcePropertyToCloudFormation(properties.eventSource),
        Parameters: cfnLifecyclePolicyParametersPropertyToCloudFormation(properties.parameters),
        PolicyType: cdk.stringToCloudFormation(properties.policyType),
        ResourceLocations: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceLocations),
        ResourceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes),
        Schedules: cdk.listMapper(cfnLifecyclePolicySchedulePropertyToCloudFormation)(properties.schedules),
        TargetTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.targetTags),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPolicyDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.PolicyDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.PolicyDetailsProperty>();
    ret.addPropertyResult('actions', 'Actions', properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyActionPropertyFromCloudFormation)(properties.Actions) : undefined);
    ret.addPropertyResult('eventSource', 'EventSource', properties.EventSource != null ? CfnLifecyclePolicyEventSourcePropertyFromCloudFormation(properties.EventSource) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? CfnLifecyclePolicyParametersPropertyFromCloudFormation(properties.Parameters) : undefined);
    ret.addPropertyResult('policyType', 'PolicyType', properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined);
    ret.addPropertyResult('resourceLocations', 'ResourceLocations', properties.ResourceLocations != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceLocations) : undefined);
    ret.addPropertyResult('resourceTypes', 'ResourceTypes', properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ResourceTypes) : undefined);
    ret.addPropertyResult('schedules', 'Schedules', properties.Schedules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicySchedulePropertyFromCloudFormation)(properties.Schedules) : undefined);
    ret.addPropertyResult('targetTags', 'TargetTags', properties.TargetTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TargetTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a retention rule for snapshots created by snapshot policies, or for AMIs created by AMI policies.
     *
     * > For snapshot policies that have an `ArchiveRule` , this retention rule applies to standard tier retention. When the retention threshold is met, snapshots are moved from the standard to the archive tier.
     * >
     * > For snapshot policies that do not have an *ArchiveRule* , snapshots are permanently deleted when this retention threshold is met.
     *
     * You can retain snapshots based on either a count or a time interval.
     *
     * - *Count-based retention*
     *
     * You must specify *Count* . If you specify an `ArchiveRule` for the schedule, then you can specify a retention count of `0` to archive snapshots immediately after creation. If you specify a `FastRestoreRule` , `ShareRule` , or a `CrossRegionCopyRule` , then you must specify a retention count of `1` or more.
     * - *Age-based retention*
     *
     * You must specify *Interval* and *IntervalUnit* . If you specify an `ArchiveRule` for the schedule, then you can specify a retention interval of `0` days to archive snapshots immediately after creation. If you specify a `FastRestoreRule` , `ShareRule` , or a `CrossRegionCopyRule` , then you must specify a retention interval of `1` day or more.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html
     */
    export interface RetainRuleProperty {
        /**
         * The number of snapshots to retain for each volume, up to a maximum of 1000. For example if you want to retain a maximum of three snapshots, specify `3` . When the fourth snapshot is created, the oldest retained snapshot is deleted, or it is moved to the archive tier if you have specified an `ArchiveRule` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-count
         */
        readonly count?: number;
        /**
         * The amount of time to retain each snapshot. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time for time-based retention. For example, to retain snapshots for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` . Once the snapshot has been retained for 3 months, it is deleted, or it is moved to the archive tier if you have specified an `ArchiveRule` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RetainRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_RetainRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "RetainRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.RetainRule` resource
 *
 * @param properties - the TypeScript properties of a `RetainRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.RetainRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyRetainRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_RetainRulePropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.numberToCloudFormation(properties.count),
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.RetainRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.RetainRuleProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addPropertyResult('interval', 'Interval', properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined);
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Describes the retention rule for archived snapshots. Once the archive retention threshold is met, the snapshots are permanently deleted from the archive tier.
     *
     * > The archive retention rule must retain snapshots in the archive tier for a minimum of 90 days.
     *
     * For *count-based schedules* , you must specify *Count* . For *age-based schedules* , you must specify *Interval* and *IntervalUnit* .
     *
     * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html
     */
    export interface RetentionArchiveTierProperty {
        /**
         * The maximum number of snapshots to retain in the archive storage tier for each volume. The count must ensure that each snapshot remains in the archive tier for at least 90 days. For example, if the schedule creates snapshots every 30 days, you must specify a count of 3 or more to ensure that each snapshot is archived for at least 90 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-count
         */
        readonly count?: number;
        /**
         * Specifies the period of time to retain snapshots in the archive tier. After this period expires, the snapshot is permanently deleted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-interval
         */
        readonly interval?: number;
        /**
         * The unit of time in which to measure the *Interval* . For example, to retain a snapshots in the archive tier for 6 months, specify `Interval=6` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-intervalunit
         */
        readonly intervalUnit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `RetentionArchiveTierProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionArchiveTierProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_RetentionArchiveTierPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('count', cdk.validateNumber)(properties.count));
    errors.collect(cdk.propertyValidator('interval', cdk.validateNumber)(properties.interval));
    errors.collect(cdk.propertyValidator('intervalUnit', cdk.validateString)(properties.intervalUnit));
    return errors.wrap('supplied properties not correct for "RetentionArchiveTierProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.RetentionArchiveTier` resource
 *
 * @param properties - the TypeScript properties of a `RetentionArchiveTierProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.RetentionArchiveTier` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyRetentionArchiveTierPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_RetentionArchiveTierPropertyValidator(properties).assertSuccess();
    return {
        Count: cdk.numberToCloudFormation(properties.count),
        Interval: cdk.numberToCloudFormation(properties.interval),
        IntervalUnit: cdk.stringToCloudFormation(properties.intervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyRetentionArchiveTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.RetentionArchiveTierProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.RetentionArchiveTierProperty>();
    ret.addPropertyResult('count', 'Count', properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined);
    ret.addPropertyResult('interval', 'Interval', properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined);
    ret.addPropertyResult('intervalUnit', 'IntervalUnit', properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a schedule for a snapshot or AMI lifecycle policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html
     */
    export interface ScheduleProperty {
        /**
         * *[Snapshot policies that target volumes only]* The snapshot archiving rule for the schedule. When you specify an archiving rule, snapshots are automatically moved from the standard tier to the archive tier once the schedule's retention threshold is met. Snapshots are then retained in the archive tier for the archive retention period that you specify.
         *
         * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-archiverule
         */
        readonly archiveRule?: CfnLifecyclePolicy.ArchiveRuleProperty | cdk.IResolvable;
        /**
         * Copy all user-defined tags on a source volume to snapshots of the volume created by this policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-copytags
         */
        readonly copyTags?: boolean | cdk.IResolvable;
        /**
         * The creation rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-createrule
         */
        readonly createRule?: CfnLifecyclePolicy.CreateRuleProperty | cdk.IResolvable;
        /**
         * Specifies a rule for copying snapshots or AMIs across regions.
         *
         * > You can't specify cross-Region copy rules for policies that create snapshots on an Outpost. If the policy creates snapshots in a Region, then snapshots can be copied to up to three Regions or Outposts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-crossregioncopyrules
         */
        readonly crossRegionCopyRules?: Array<CfnLifecyclePolicy.CrossRegionCopyRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies only]* The AMI deprecation rule for the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-deprecaterule
         */
        readonly deprecateRule?: CfnLifecyclePolicy.DeprecateRuleProperty | cdk.IResolvable;
        /**
         * *[Snapshot policies only]* The rule for enabling fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-fastrestorerule
         */
        readonly fastRestoreRule?: CfnLifecyclePolicy.FastRestoreRuleProperty | cdk.IResolvable;
        /**
         * The name of the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-name
         */
        readonly name?: string;
        /**
         * The retention rule for snapshots or AMIs created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.RetainRuleProperty | cdk.IResolvable;
        /**
         * *[Snapshot policies only]* The rule for sharing snapshots with other AWS accounts .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-sharerules
         */
        readonly shareRules?: Array<CfnLifecyclePolicy.ShareRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The tags to apply to policy-created resources. These user-defined tags are in addition to the AWS -added lifecycle tags.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-tagstoadd
         */
        readonly tagsToAdd?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies and snapshot policies that target instances only]* A collection of key/value pairs with values determined dynamically when the policy is executed. Keys may be any valid Amazon EC2 tag key. Values must be in one of the two following formats: `$(instance-id)` or `$(timestamp)` . Variable tags are only valid for EBS Snapshot Management – Instance policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-variabletags
         */
        readonly variableTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_SchedulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('archiveRule', CfnLifecyclePolicy_ArchiveRulePropertyValidator)(properties.archiveRule));
    errors.collect(cdk.propertyValidator('copyTags', cdk.validateBoolean)(properties.copyTags));
    errors.collect(cdk.propertyValidator('createRule', CfnLifecyclePolicy_CreateRulePropertyValidator)(properties.createRule));
    errors.collect(cdk.propertyValidator('crossRegionCopyRules', cdk.listValidator(CfnLifecyclePolicy_CrossRegionCopyRulePropertyValidator))(properties.crossRegionCopyRules));
    errors.collect(cdk.propertyValidator('deprecateRule', CfnLifecyclePolicy_DeprecateRulePropertyValidator)(properties.deprecateRule));
    errors.collect(cdk.propertyValidator('fastRestoreRule', CfnLifecyclePolicy_FastRestoreRulePropertyValidator)(properties.fastRestoreRule));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('retainRule', CfnLifecyclePolicy_RetainRulePropertyValidator)(properties.retainRule));
    errors.collect(cdk.propertyValidator('shareRules', cdk.listValidator(CfnLifecyclePolicy_ShareRulePropertyValidator))(properties.shareRules));
    errors.collect(cdk.propertyValidator('tagsToAdd', cdk.listValidator(cdk.validateCfnTag))(properties.tagsToAdd));
    errors.collect(cdk.propertyValidator('variableTags', cdk.listValidator(cdk.validateCfnTag))(properties.variableTags));
    return errors.wrap('supplied properties not correct for "ScheduleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Schedule` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.Schedule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicySchedulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_SchedulePropertyValidator(properties).assertSuccess();
    return {
        ArchiveRule: cfnLifecyclePolicyArchiveRulePropertyToCloudFormation(properties.archiveRule),
        CopyTags: cdk.booleanToCloudFormation(properties.copyTags),
        CreateRule: cfnLifecyclePolicyCreateRulePropertyToCloudFormation(properties.createRule),
        CrossRegionCopyRules: cdk.listMapper(cfnLifecyclePolicyCrossRegionCopyRulePropertyToCloudFormation)(properties.crossRegionCopyRules),
        DeprecateRule: cfnLifecyclePolicyDeprecateRulePropertyToCloudFormation(properties.deprecateRule),
        FastRestoreRule: cfnLifecyclePolicyFastRestoreRulePropertyToCloudFormation(properties.fastRestoreRule),
        Name: cdk.stringToCloudFormation(properties.name),
        RetainRule: cfnLifecyclePolicyRetainRulePropertyToCloudFormation(properties.retainRule),
        ShareRules: cdk.listMapper(cfnLifecyclePolicyShareRulePropertyToCloudFormation)(properties.shareRules),
        TagsToAdd: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tagsToAdd),
        VariableTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.variableTags),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicySchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ScheduleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ScheduleProperty>();
    ret.addPropertyResult('archiveRule', 'ArchiveRule', properties.ArchiveRule != null ? CfnLifecyclePolicyArchiveRulePropertyFromCloudFormation(properties.ArchiveRule) : undefined);
    ret.addPropertyResult('copyTags', 'CopyTags', properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined);
    ret.addPropertyResult('createRule', 'CreateRule', properties.CreateRule != null ? CfnLifecyclePolicyCreateRulePropertyFromCloudFormation(properties.CreateRule) : undefined);
    ret.addPropertyResult('crossRegionCopyRules', 'CrossRegionCopyRules', properties.CrossRegionCopyRules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyCrossRegionCopyRulePropertyFromCloudFormation)(properties.CrossRegionCopyRules) : undefined);
    ret.addPropertyResult('deprecateRule', 'DeprecateRule', properties.DeprecateRule != null ? CfnLifecyclePolicyDeprecateRulePropertyFromCloudFormation(properties.DeprecateRule) : undefined);
    ret.addPropertyResult('fastRestoreRule', 'FastRestoreRule', properties.FastRestoreRule != null ? CfnLifecyclePolicyFastRestoreRulePropertyFromCloudFormation(properties.FastRestoreRule) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('retainRule', 'RetainRule', properties.RetainRule != null ? CfnLifecyclePolicyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined);
    ret.addPropertyResult('shareRules', 'ShareRules', properties.ShareRules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyShareRulePropertyFromCloudFormation)(properties.ShareRules) : undefined);
    ret.addPropertyResult('tagsToAdd', 'TagsToAdd', properties.TagsToAdd != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TagsToAdd) : undefined);
    ret.addPropertyResult('variableTags', 'VariableTags', properties.VariableTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.VariableTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a rule for sharing snapshots across AWS accounts .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html
     */
    export interface ShareRuleProperty {
        /**
         * The IDs of the AWS accounts with which to share the snapshots.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-targetaccounts
         */
        readonly targetAccounts?: string[];
        /**
         * The period after which snapshots that are shared with other AWS accounts are automatically unshared.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareinterval
         */
        readonly unshareInterval?: number;
        /**
         * The unit of time for the automatic unsharing interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareintervalunit
         */
        readonly unshareIntervalUnit?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ShareRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ShareRuleProperty`
 *
 * @returns the result of the validation.
 */
function CfnLifecyclePolicy_ShareRulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetAccounts', cdk.listValidator(cdk.validateString))(properties.targetAccounts));
    errors.collect(cdk.propertyValidator('unshareInterval', cdk.validateNumber)(properties.unshareInterval));
    errors.collect(cdk.propertyValidator('unshareIntervalUnit', cdk.validateString)(properties.unshareIntervalUnit));
    return errors.wrap('supplied properties not correct for "ShareRuleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ShareRule` resource
 *
 * @param properties - the TypeScript properties of a `ShareRuleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::DLM::LifecyclePolicy.ShareRule` resource.
 */
// @ts-ignore TS6133
function cfnLifecyclePolicyShareRulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLifecyclePolicy_ShareRulePropertyValidator(properties).assertSuccess();
    return {
        TargetAccounts: cdk.listMapper(cdk.stringToCloudFormation)(properties.targetAccounts),
        UnshareInterval: cdk.numberToCloudFormation(properties.unshareInterval),
        UnshareIntervalUnit: cdk.stringToCloudFormation(properties.unshareIntervalUnit),
    };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyShareRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ShareRuleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ShareRuleProperty>();
    ret.addPropertyResult('targetAccounts', 'TargetAccounts', properties.TargetAccounts != null ? cfn_parse.FromCloudFormation.getStringArray(properties.TargetAccounts) : undefined);
    ret.addPropertyResult('unshareInterval', 'UnshareInterval', properties.UnshareInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnshareInterval) : undefined);
    ret.addPropertyResult('unshareIntervalUnit', 'UnshareIntervalUnit', properties.UnshareIntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.UnshareIntervalUnit) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
