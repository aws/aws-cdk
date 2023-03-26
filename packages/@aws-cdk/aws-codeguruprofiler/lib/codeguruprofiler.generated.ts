// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-11T07:33:20.332Z","fingerprint":"YIuuneoIttC7h0waZMfCSedlFPMdHwsxmbnvBZsXyVA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnProfilingGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html
 */
export interface CfnProfilingGroupProps {

    /**
     * The name of the profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-profilinggroupname
     */
    readonly profilingGroupName: string;

    /**
     * The agent permissions attached to this profiling group. This action group grants `ConfigureAgent` and `PostAgentProfile` permissions to perform actions required by the profiling agent. The Json consists of key `Principals` .
     *
     * *Principals* : A list of string ARNs for the roles and users you want to grant access to the profiling group. Wildcards are not supported in the ARNs. You are allowed to provide up to 50 ARNs. An empty list is not permitted. This is a required key.
     *
     * For more information, see [Resource-based policies in CodeGuru Profiler](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/resource-based-policies.html) in the *Amazon CodeGuru Profiler user guide* , [ConfigureAgent](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ConfigureAgent.html) , and [PostAgentProfile](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_PostAgentProfile.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-agentpermissions
     */
    readonly agentPermissions?: any | cdk.IResolvable;

    /**
     * Adds anomaly notifications for a profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-anomalydetectionnotificationconfiguration
     */
    readonly anomalyDetectionNotificationConfiguration?: Array<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The compute platform of the profiling group. Use `AWSLambda` if your application runs on AWS Lambda. Use `Default` if your application runs on a compute platform that is not AWS Lambda , such an Amazon EC2 instance, an on-premises server, or a different platform. If not specified, `Default` is used. This property is immutable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-computeplatform
     */
    readonly computePlatform?: string;

    /**
     * A list of tags to add to the created profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnProfilingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfilingGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnProfilingGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('agentPermissions', cdk.validateObject)(properties.agentPermissions));
    errors.collect(cdk.propertyValidator('anomalyDetectionNotificationConfiguration', cdk.listValidator(CfnProfilingGroup_ChannelPropertyValidator))(properties.anomalyDetectionNotificationConfiguration));
    errors.collect(cdk.propertyValidator('computePlatform', cdk.validateString)(properties.computePlatform));
    errors.collect(cdk.propertyValidator('profilingGroupName', cdk.requiredValidator)(properties.profilingGroupName));
    errors.collect(cdk.propertyValidator('profilingGroupName', cdk.validateString)(properties.profilingGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnProfilingGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnProfilingGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup` resource.
 */
// @ts-ignore TS6133
function cfnProfilingGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilingGroupPropsValidator(properties).assertSuccess();
    return {
        ProfilingGroupName: cdk.stringToCloudFormation(properties.profilingGroupName),
        AgentPermissions: cdk.objectToCloudFormation(properties.agentPermissions),
        AnomalyDetectionNotificationConfiguration: cdk.listMapper(cfnProfilingGroupChannelPropertyToCloudFormation)(properties.anomalyDetectionNotificationConfiguration),
        ComputePlatform: cdk.stringToCloudFormation(properties.computePlatform),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnProfilingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroupProps>();
    ret.addPropertyResult('profilingGroupName', 'ProfilingGroupName', cfn_parse.FromCloudFormation.getString(properties.ProfilingGroupName));
    ret.addPropertyResult('agentPermissions', 'AgentPermissions', properties.AgentPermissions != null ? cfn_parse.FromCloudFormation.getAny(properties.AgentPermissions) : undefined);
    ret.addPropertyResult('anomalyDetectionNotificationConfiguration', 'AnomalyDetectionNotificationConfiguration', properties.AnomalyDetectionNotificationConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnProfilingGroupChannelPropertyFromCloudFormation)(properties.AnomalyDetectionNotificationConfiguration) : undefined);
    ret.addPropertyResult('computePlatform', 'ComputePlatform', properties.ComputePlatform != null ? cfn_parse.FromCloudFormation.getString(properties.ComputePlatform) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::CodeGuruProfiler::ProfilingGroup`
 *
 * Creates a profiling group.
 *
 * @cloudformationResource AWS::CodeGuruProfiler::ProfilingGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html
 */
export class CfnProfilingGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::CodeGuruProfiler::ProfilingGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfilingGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProfilingGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnProfilingGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The full Amazon Resource Name (ARN) for that profiling group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-profilinggroupname
     */
    public profilingGroupName: string;

    /**
     * The agent permissions attached to this profiling group. This action group grants `ConfigureAgent` and `PostAgentProfile` permissions to perform actions required by the profiling agent. The Json consists of key `Principals` .
     *
     * *Principals* : A list of string ARNs for the roles and users you want to grant access to the profiling group. Wildcards are not supported in the ARNs. You are allowed to provide up to 50 ARNs. An empty list is not permitted. This is a required key.
     *
     * For more information, see [Resource-based policies in CodeGuru Profiler](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/resource-based-policies.html) in the *Amazon CodeGuru Profiler user guide* , [ConfigureAgent](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ConfigureAgent.html) , and [PostAgentProfile](https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_PostAgentProfile.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-agentpermissions
     */
    public agentPermissions: any | cdk.IResolvable | undefined;

    /**
     * Adds anomaly notifications for a profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-anomalydetectionnotificationconfiguration
     */
    public anomalyDetectionNotificationConfiguration: Array<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The compute platform of the profiling group. Use `AWSLambda` if your application runs on AWS Lambda. Use `Default` if your application runs on a compute platform that is not AWS Lambda , such an Amazon EC2 instance, an on-premises server, or a different platform. If not specified, `Default` is used. This property is immutable.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-computeplatform
     */
    public computePlatform: string | undefined;

    /**
     * A list of tags to add to the created profiling group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeguruprofiler-profilinggroup.html#cfn-codeguruprofiler-profilinggroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::CodeGuruProfiler::ProfilingGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProfilingGroupProps) {
        super(scope, id, { type: CfnProfilingGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'profilingGroupName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.profilingGroupName = props.profilingGroupName;
        this.agentPermissions = props.agentPermissions;
        this.anomalyDetectionNotificationConfiguration = props.anomalyDetectionNotificationConfiguration;
        this.computePlatform = props.computePlatform;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeGuruProfiler::ProfilingGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfilingGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            profilingGroupName: this.profilingGroupName,
            agentPermissions: this.agentPermissions,
            anomalyDetectionNotificationConfiguration: this.anomalyDetectionNotificationConfiguration,
            computePlatform: this.computePlatform,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProfilingGroupPropsToCloudFormation(props);
    }
}

export namespace CfnProfilingGroup {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-agentpermissions.html
     */
    export interface AgentPermissionsProperty {
        /**
         * `CfnProfilingGroup.AgentPermissionsProperty.Principals`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-agentpermissions.html#cfn-codeguruprofiler-profilinggroup-agentpermissions-principals
         */
        readonly principals: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AgentPermissionsProperty`
 *
 * @param properties - the TypeScript properties of a `AgentPermissionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnProfilingGroup_AgentPermissionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('principals', cdk.requiredValidator)(properties.principals));
    errors.collect(cdk.propertyValidator('principals', cdk.listValidator(cdk.validateString))(properties.principals));
    return errors.wrap('supplied properties not correct for "AgentPermissionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup.AgentPermissions` resource
 *
 * @param properties - the TypeScript properties of a `AgentPermissionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup.AgentPermissions` resource.
 */
// @ts-ignore TS6133
function cfnProfilingGroupAgentPermissionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilingGroup_AgentPermissionsPropertyValidator(properties).assertSuccess();
    return {
        Principals: cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
    };
}

// @ts-ignore TS6133
function CfnProfilingGroupAgentPermissionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroup.AgentPermissionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroup.AgentPermissionsProperty>();
    ret.addPropertyResult('principals', 'Principals', cfn_parse.FromCloudFormation.getStringArray(properties.Principals));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnProfilingGroup {
    /**
     * Notification medium for users to get alerted for events that occur in application profile. We support SNS topic as a notification channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html
     */
    export interface ChannelProperty {
        /**
         * The channel ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html#cfn-codeguruprofiler-profilinggroup-channel-channelid
         */
        readonly channelId?: string;
        /**
         * The channel URI.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codeguruprofiler-profilinggroup-channel.html#cfn-codeguruprofiler-profilinggroup-channel-channeluri
         */
        readonly channelUri: string;
    }
}

/**
 * Determine whether the given properties match those of a `ChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the result of the validation.
 */
function CfnProfilingGroup_ChannelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelId', cdk.validateString)(properties.channelId));
    errors.collect(cdk.propertyValidator('channelUri', cdk.requiredValidator)(properties.channelUri));
    errors.collect(cdk.propertyValidator('channelUri', cdk.validateString)(properties.channelUri));
    return errors.wrap('supplied properties not correct for "ChannelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup.Channel` resource
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::CodeGuruProfiler::ProfilingGroup.Channel` resource.
 */
// @ts-ignore TS6133
function cfnProfilingGroupChannelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProfilingGroup_ChannelPropertyValidator(properties).assertSuccess();
    return {
        channelId: cdk.stringToCloudFormation(properties.channelId),
        channelUri: cdk.stringToCloudFormation(properties.channelUri),
    };
}

// @ts-ignore TS6133
function CfnProfilingGroupChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfilingGroup.ChannelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfilingGroup.ChannelProperty>();
    ret.addPropertyResult('channelId', 'channelId', properties.channelId != null ? cfn_parse.FromCloudFormation.getString(properties.channelId) : undefined);
    ret.addPropertyResult('channelUri', 'channelUri', cfn_parse.FromCloudFormation.getString(properties.channelUri));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
