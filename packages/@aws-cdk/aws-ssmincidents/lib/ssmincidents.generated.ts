// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:19.176Z","fingerprint":"tOB4bBHLEXDmTxw91TMBvfpKO1iJkoKKrga6Q66hIV4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnReplicationSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export interface CfnReplicationSetProps {

    /**
     * Specifies the Regions of the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-regions
     */
    readonly regions: Array<CfnReplicationSet.ReplicationRegionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Determines if the replication set deletion protection is enabled or not. If deletion protection is enabled, you can't delete the last Region in the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-deletionprotected
     */
    readonly deletionProtected?: boolean | cdk.IResolvable;

    /**
     * A list of tags to add to the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnReplicationSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationSetProps`
 *
 * @returns the result of the validation.
 */
function CfnReplicationSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deletionProtected', cdk.validateBoolean)(properties.deletionProtected));
    errors.collect(cdk.propertyValidator('regions', cdk.requiredValidator)(properties.regions));
    errors.collect(cdk.propertyValidator('regions', cdk.listValidator(CfnReplicationSet_ReplicationRegionPropertyValidator))(properties.regions));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnReplicationSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnReplicationSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet` resource.
 */
// @ts-ignore TS6133
function cfnReplicationSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationSetPropsValidator(properties).assertSuccess();
    return {
        Regions: cdk.listMapper(cfnReplicationSetReplicationRegionPropertyToCloudFormation)(properties.regions),
        DeletionProtected: cdk.booleanToCloudFormation(properties.deletionProtected),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnReplicationSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSetProps>();
    ret.addPropertyResult('regions', 'Regions', cfn_parse.FromCloudFormation.getArray(CfnReplicationSetReplicationRegionPropertyFromCloudFormation)(properties.Regions));
    ret.addPropertyResult('deletionProtected', 'DeletionProtected', properties.DeletionProtected != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtected) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSMIncidents::ReplicationSet`
 *
 * The `AWS::SSMIncidents::ReplicationSet` resource specifies a set of Regions that Incident Manager data is replicated to and the KMS key used to encrypt the data.
 *
 * @cloudformationResource AWS::SSMIncidents::ReplicationSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export class CfnReplicationSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMIncidents::ReplicationSet";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationSet {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnReplicationSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnReplicationSet(scope, id, propsResult.value);
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
     * Specifies the Regions of the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-regions
     */
    public regions: Array<CfnReplicationSet.ReplicationRegionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Determines if the replication set deletion protection is enabled or not. If deletion protection is enabled, you can't delete the last Region in the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-deletionprotected
     */
    public deletionProtected: boolean | cdk.IResolvable | undefined;

    /**
     * A list of tags to add to the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::SSMIncidents::ReplicationSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationSetProps) {
        super(scope, id, { type: CfnReplicationSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'regions', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.regions = props.regions;
        this.deletionProtected = props.deletionProtected;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSMIncidents::ReplicationSet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            regions: this.regions,
            deletionProtected: this.deletionProtected,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReplicationSetPropsToCloudFormation(props);
    }
}

export namespace CfnReplicationSet {
    /**
     * The `RegionConfiguration` property specifies the Region and KMS key to add to the replication set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html
     */
    export interface RegionConfigurationProperty {
        /**
         * The KMS key ID to use to encrypt your replication set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html#cfn-ssmincidents-replicationset-regionconfiguration-ssekmskeyid
         */
        readonly sseKmsKeyId: string;
    }
}

/**
 * Determine whether the given properties match those of a `RegionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RegionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationSet_RegionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sseKmsKeyId', cdk.requiredValidator)(properties.sseKmsKeyId));
    errors.collect(cdk.propertyValidator('sseKmsKeyId', cdk.validateString)(properties.sseKmsKeyId));
    return errors.wrap('supplied properties not correct for "RegionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet.RegionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `RegionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet.RegionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnReplicationSetRegionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationSet_RegionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        SseKmsKeyId: cdk.stringToCloudFormation(properties.sseKmsKeyId),
    };
}

// @ts-ignore TS6133
function CfnReplicationSetRegionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationSet.RegionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSet.RegionConfigurationProperty>();
    ret.addPropertyResult('sseKmsKeyId', 'SseKmsKeyId', cfn_parse.FromCloudFormation.getString(properties.SseKmsKeyId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnReplicationSet {
    /**
     * The `ReplicationRegion` property type specifies the Region and KMS key to add to the replication set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html
     */
    export interface ReplicationRegionProperty {
        /**
         * Specifies the Region configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionconfiguration
         */
        readonly regionConfiguration?: CfnReplicationSet.RegionConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies the region name to add to the replication set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionname
         */
        readonly regionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ReplicationRegionProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRegionProperty`
 *
 * @returns the result of the validation.
 */
function CfnReplicationSet_ReplicationRegionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('regionConfiguration', CfnReplicationSet_RegionConfigurationPropertyValidator)(properties.regionConfiguration));
    errors.collect(cdk.propertyValidator('regionName', cdk.validateString)(properties.regionName));
    return errors.wrap('supplied properties not correct for "ReplicationRegionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet.ReplicationRegion` resource
 *
 * @param properties - the TypeScript properties of a `ReplicationRegionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ReplicationSet.ReplicationRegion` resource.
 */
// @ts-ignore TS6133
function cfnReplicationSetReplicationRegionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReplicationSet_ReplicationRegionPropertyValidator(properties).assertSuccess();
    return {
        RegionConfiguration: cfnReplicationSetRegionConfigurationPropertyToCloudFormation(properties.regionConfiguration),
        RegionName: cdk.stringToCloudFormation(properties.regionName),
    };
}

// @ts-ignore TS6133
function CfnReplicationSetReplicationRegionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationSet.ReplicationRegionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSet.ReplicationRegionProperty>();
    ret.addPropertyResult('regionConfiguration', 'RegionConfiguration', properties.RegionConfiguration != null ? CfnReplicationSetRegionConfigurationPropertyFromCloudFormation(properties.RegionConfiguration) : undefined);
    ret.addPropertyResult('regionName', 'RegionName', properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResponsePlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export interface CfnResponsePlanProps {

    /**
     * Details used to create an incident when using this response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-incidenttemplate
     */
    readonly incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;

    /**
     * The name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-name
     */
    readonly name: string;

    /**
     * The actions that the response plan starts at the beginning of an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-actions
     */
    readonly actions?: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-chatchannel
     */
    readonly chatChannel?: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable;

    /**
     * The human readable name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-displayname
     */
    readonly displayName?: string;

    /**
     * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-engagements
     */
    readonly engagements?: string[];

    /**
     * Information about third-party services integrated into the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-integrations
     */
    readonly integrations?: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnResponsePlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnResponsePlanProps`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlanPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(CfnResponsePlan_ActionPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('chatChannel', CfnResponsePlan_ChatChannelPropertyValidator)(properties.chatChannel));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('engagements', cdk.listValidator(cdk.validateString))(properties.engagements));
    errors.collect(cdk.propertyValidator('incidentTemplate', cdk.requiredValidator)(properties.incidentTemplate));
    errors.collect(cdk.propertyValidator('incidentTemplate', CfnResponsePlan_IncidentTemplatePropertyValidator)(properties.incidentTemplate));
    errors.collect(cdk.propertyValidator('integrations', cdk.listValidator(CfnResponsePlan_IntegrationPropertyValidator))(properties.integrations));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnResponsePlanProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan` resource
 *
 * @param properties - the TypeScript properties of a `CfnResponsePlanProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlanPropsValidator(properties).assertSuccess();
    return {
        IncidentTemplate: cfnResponsePlanIncidentTemplatePropertyToCloudFormation(properties.incidentTemplate),
        Name: cdk.stringToCloudFormation(properties.name),
        Actions: cdk.listMapper(cfnResponsePlanActionPropertyToCloudFormation)(properties.actions),
        ChatChannel: cfnResponsePlanChatChannelPropertyToCloudFormation(properties.chatChannel),
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        Engagements: cdk.listMapper(cdk.stringToCloudFormation)(properties.engagements),
        Integrations: cdk.listMapper(cfnResponsePlanIntegrationPropertyToCloudFormation)(properties.integrations),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlanProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlanProps>();
    ret.addPropertyResult('incidentTemplate', 'IncidentTemplate', CfnResponsePlanIncidentTemplatePropertyFromCloudFormation(properties.IncidentTemplate));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('actions', 'Actions', properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanActionPropertyFromCloudFormation)(properties.Actions) : undefined);
    ret.addPropertyResult('chatChannel', 'ChatChannel', properties.ChatChannel != null ? CfnResponsePlanChatChannelPropertyFromCloudFormation(properties.ChatChannel) : undefined);
    ret.addPropertyResult('displayName', 'DisplayName', properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined);
    ret.addPropertyResult('engagements', 'Engagements', properties.Engagements != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Engagements) : undefined);
    ret.addPropertyResult('integrations', 'Integrations', properties.Integrations != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanIntegrationPropertyFromCloudFormation)(properties.Integrations) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSMIncidents::ResponsePlan`
 *
 * The `AWS::SSMIncidents::ResponsePlan` resource specifies the details of the response plan that are used when creating an incident.
 *
 * @cloudformationResource AWS::SSMIncidents::ResponsePlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export class CfnResponsePlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMIncidents::ResponsePlan";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResponsePlan {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResponsePlanPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResponsePlan(scope, id, propsResult.value);
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
     * Details used to create an incident when using this response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-incidenttemplate
     */
    public incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;

    /**
     * The name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-name
     */
    public name: string;

    /**
     * The actions that the response plan starts at the beginning of an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-actions
     */
    public actions: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-chatchannel
     */
    public chatChannel: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable | undefined;

    /**
     * The human readable name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-displayname
     */
    public displayName: string | undefined;

    /**
     * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-engagements
     */
    public engagements: string[] | undefined;

    /**
     * Information about third-party services integrated into the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-integrations
     */
    public integrations: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::SSMIncidents::ResponsePlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResponsePlanProps) {
        super(scope, id, { type: CfnResponsePlan.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'incidentTemplate', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.incidentTemplate = props.incidentTemplate;
        this.name = props.name;
        this.actions = props.actions;
        this.chatChannel = props.chatChannel;
        this.displayName = props.displayName;
        this.engagements = props.engagements;
        this.integrations = props.integrations;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSMIncidents::ResponsePlan", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResponsePlan.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            incidentTemplate: this.incidentTemplate,
            name: this.name,
            actions: this.actions,
            chatChannel: this.chatChannel,
            displayName: this.displayName,
            engagements: this.engagements,
            integrations: this.integrations,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResponsePlanPropsToCloudFormation(props);
    }
}

export namespace CfnResponsePlan {
    /**
     * The `Action` property type specifies the configuration to launch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html
     */
    export interface ActionProperty {
        /**
         * Details about the Systems Manager automation document that will be used as a runbook during an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html#cfn-ssmincidents-responseplan-action-ssmautomation
         */
        readonly ssmAutomation?: CfnResponsePlan.SsmAutomationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ssmAutomation', CfnResponsePlan_SsmAutomationPropertyValidator)(properties.ssmAutomation));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.Action` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_ActionPropertyValidator(properties).assertSuccess();
    return {
        SsmAutomation: cfnResponsePlanSsmAutomationPropertyToCloudFormation(properties.ssmAutomation),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.ActionProperty>();
    ret.addPropertyResult('ssmAutomation', 'SsmAutomation', properties.SsmAutomation != null ? CfnResponsePlanSsmAutomationPropertyFromCloudFormation(properties.SsmAutomation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html
     */
    export interface ChatChannelProperty {
        /**
         * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident. You can also make updates to the incident through the chat channel by using the SNS topics
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html#cfn-ssmincidents-responseplan-chatchannel-chatbotsns
         */
        readonly chatbotSns?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ChatChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChatChannelProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_ChatChannelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('chatbotSns', cdk.listValidator(cdk.validateString))(properties.chatbotSns));
    return errors.wrap('supplied properties not correct for "ChatChannelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.ChatChannel` resource
 *
 * @param properties - the TypeScript properties of a `ChatChannelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.ChatChannel` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanChatChannelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_ChatChannelPropertyValidator(properties).assertSuccess();
    return {
        ChatbotSns: cdk.listMapper(cdk.stringToCloudFormation)(properties.chatbotSns),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanChatChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.ChatChannelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.ChatChannelProperty>();
    ret.addPropertyResult('chatbotSns', 'ChatbotSns', properties.ChatbotSns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ChatbotSns) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * When you add a runbook to a response plan, you can specify the parameters the runbook should use at runtime. Response plans support parameters with both static and dynamic values. For static values, you enter the value when you define the parameter in the response plan. For dynamic values, the system determines the correct parameter value by collecting information from the incident. Incident Manager supports the following dynamic parameters:
     *
     * *Incident ARN*
     *
     * When Incident Manager creates an incident, the system captures the Amazon Resource Name (ARN) of the corresponding incident record and enters it for this parameter in the runbook.
     *
     * > This value can only be assigned to parameters of type `String` . If assigned to a parameter of any other type, the runbook fails to run.
     *
     * *Involved resources*
     *
     * When Incident Manager creates an incident, the system captures the ARNs of the resources involved in the incident. These resource ARNs are then assigned to this parameter in the runbook.
     *
     * > This value can only be assigned to parameters of type `StringList` . If assigned to a parameter of any other type, the runbook fails to run.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html
     */
    export interface DynamicSsmParameterProperty {
        /**
         * The key parameter to use when running the Systems Manager Automation runbook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-key
         */
        readonly key: string;
        /**
         * The dynamic parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-value
         */
        readonly value: CfnResponsePlan.DynamicSsmParameterValueProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DynamicSsmParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_DynamicSsmParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', CfnResponsePlan_DynamicSsmParameterValuePropertyValidator)(properties.value));
    return errors.wrap('supplied properties not correct for "DynamicSsmParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.DynamicSsmParameter` resource
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.DynamicSsmParameter` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanDynamicSsmParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_DynamicSsmParameterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cfnResponsePlanDynamicSsmParameterValuePropertyToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.DynamicSsmParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.DynamicSsmParameterProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', CfnResponsePlanDynamicSsmParameterValuePropertyFromCloudFormation(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The dynamic parameter value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html
     */
    export interface DynamicSsmParameterValueProperty {
        /**
         * Variable dynamic parameters. A parameter value is determined when an incident is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html#cfn-ssmincidents-responseplan-dynamicssmparametervalue-variable
         */
        readonly variable?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DynamicSsmParameterValueProperty`
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_DynamicSsmParameterValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('variable', cdk.validateString)(properties.variable));
    return errors.wrap('supplied properties not correct for "DynamicSsmParameterValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.DynamicSsmParameterValue` resource
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.DynamicSsmParameterValue` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanDynamicSsmParameterValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_DynamicSsmParameterValuePropertyValidator(properties).assertSuccess();
    return {
        Variable: cdk.stringToCloudFormation(properties.variable),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.DynamicSsmParameterValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.DynamicSsmParameterValueProperty>();
    ret.addPropertyResult('variable', 'Variable', properties.Variable != null ? cfn_parse.FromCloudFormation.getString(properties.Variable) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The `IncidentTemplate` property type specifies details used to create an incident when using this response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html
     */
    export interface IncidentTemplateProperty {
        /**
         * Used to create only one incident record for an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-dedupestring
         */
        readonly dedupeString?: string;
        /**
         * Defines the impact to the customers. Providing an impact overwrites the impact provided by a response plan.
         *
         * **Possible impacts:** - `1` - Critical impact, this typically relates to full application failure that impacts many to all customers.
         * - `2` - High impact, partial application failure with impact to many customers.
         * - `3` - Medium impact, the application is providing reduced service to customers.
         * - `4` - Low impact, customer might aren't impacted by the problem yet.
         * - `5` - No impact, customers aren't currently impacted but urgent action is needed to avoid impact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-impact
         */
        readonly impact: number;
        /**
         * Tags to assign to the template. When the `StartIncident` API action is called, Incident Manager assigns the tags specified in the template to the incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-incidenttags
         */
        readonly incidentTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident. You can also make updates to the incident through the chat channel using the SNS topics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-notificationtargets
         */
        readonly notificationTargets?: Array<CfnResponsePlan.NotificationTargetItemProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The summary describes what has happened during the incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-summary
         */
        readonly summary?: string;
        /**
         * The title of the incident is a brief and easily recognizable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-title
         */
        readonly title: string;
    }
}

/**
 * Determine whether the given properties match those of a `IncidentTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `IncidentTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_IncidentTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dedupeString', cdk.validateString)(properties.dedupeString));
    errors.collect(cdk.propertyValidator('impact', cdk.requiredValidator)(properties.impact));
    errors.collect(cdk.propertyValidator('impact', cdk.validateNumber)(properties.impact));
    errors.collect(cdk.propertyValidator('incidentTags', cdk.listValidator(cdk.validateCfnTag))(properties.incidentTags));
    errors.collect(cdk.propertyValidator('notificationTargets', cdk.listValidator(CfnResponsePlan_NotificationTargetItemPropertyValidator))(properties.notificationTargets));
    errors.collect(cdk.propertyValidator('summary', cdk.validateString)(properties.summary));
    errors.collect(cdk.propertyValidator('title', cdk.requiredValidator)(properties.title));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    return errors.wrap('supplied properties not correct for "IncidentTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.IncidentTemplate` resource
 *
 * @param properties - the TypeScript properties of a `IncidentTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.IncidentTemplate` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanIncidentTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_IncidentTemplatePropertyValidator(properties).assertSuccess();
    return {
        DedupeString: cdk.stringToCloudFormation(properties.dedupeString),
        Impact: cdk.numberToCloudFormation(properties.impact),
        IncidentTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.incidentTags),
        NotificationTargets: cdk.listMapper(cfnResponsePlanNotificationTargetItemPropertyToCloudFormation)(properties.notificationTargets),
        Summary: cdk.stringToCloudFormation(properties.summary),
        Title: cdk.stringToCloudFormation(properties.title),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanIncidentTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.IncidentTemplateProperty>();
    ret.addPropertyResult('dedupeString', 'DedupeString', properties.DedupeString != null ? cfn_parse.FromCloudFormation.getString(properties.DedupeString) : undefined);
    ret.addPropertyResult('impact', 'Impact', cfn_parse.FromCloudFormation.getNumber(properties.Impact));
    ret.addPropertyResult('incidentTags', 'IncidentTags', properties.IncidentTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.IncidentTags) : undefined);
    ret.addPropertyResult('notificationTargets', 'NotificationTargets', properties.NotificationTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanNotificationTargetItemPropertyFromCloudFormation)(properties.NotificationTargets) : undefined);
    ret.addPropertyResult('summary', 'Summary', properties.Summary != null ? cfn_parse.FromCloudFormation.getString(properties.Summary) : undefined);
    ret.addPropertyResult('title', 'Title', cfn_parse.FromCloudFormation.getString(properties.Title));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * Information about third-party services integrated into a response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html
     */
    export interface IntegrationProperty {
        /**
         * Information about the PagerDuty service where the response plan creates an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html#cfn-ssmincidents-responseplan-integration-pagerdutyconfiguration
         */
        readonly pagerDutyConfiguration: CfnResponsePlan.PagerDutyConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntegrationProperty`
 *
 * @param properties - the TypeScript properties of a `IntegrationProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_IntegrationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pagerDutyConfiguration', cdk.requiredValidator)(properties.pagerDutyConfiguration));
    errors.collect(cdk.propertyValidator('pagerDutyConfiguration', CfnResponsePlan_PagerDutyConfigurationPropertyValidator)(properties.pagerDutyConfiguration));
    return errors.wrap('supplied properties not correct for "IntegrationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.Integration` resource
 *
 * @param properties - the TypeScript properties of a `IntegrationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.Integration` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanIntegrationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_IntegrationPropertyValidator(properties).assertSuccess();
    return {
        PagerDutyConfiguration: cfnResponsePlanPagerDutyConfigurationPropertyToCloudFormation(properties.pagerDutyConfiguration),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanIntegrationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.IntegrationProperty>();
    ret.addPropertyResult('pagerDutyConfiguration', 'PagerDutyConfiguration', CfnResponsePlanPagerDutyConfigurationPropertyFromCloudFormation(properties.PagerDutyConfiguration));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The SNS topic that's used by AWS Chatbot to notify the incidents chat channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html
     */
    export interface NotificationTargetItemProperty {
        /**
         * The Amazon Resource Name (ARN) of the SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html#cfn-ssmincidents-responseplan-notificationtargetitem-snstopicarn
         */
        readonly snsTopicArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NotificationTargetItemProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationTargetItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_NotificationTargetItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('snsTopicArn', cdk.validateString)(properties.snsTopicArn));
    return errors.wrap('supplied properties not correct for "NotificationTargetItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.NotificationTargetItem` resource
 *
 * @param properties - the TypeScript properties of a `NotificationTargetItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.NotificationTargetItem` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanNotificationTargetItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_NotificationTargetItemPropertyValidator(properties).assertSuccess();
    return {
        SnsTopicArn: cdk.stringToCloudFormation(properties.snsTopicArn),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanNotificationTargetItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.NotificationTargetItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.NotificationTargetItemProperty>();
    ret.addPropertyResult('snsTopicArn', 'SnsTopicArn', properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * Details about the PagerDuty configuration for a response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html
     */
    export interface PagerDutyConfigurationProperty {
        /**
         * The name of the PagerDuty configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-name
         */
        readonly name: string;
        /**
         * Details about the PagerDuty service associated with the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-pagerdutyincidentconfiguration
         */
        readonly pagerDutyIncidentConfiguration: CfnResponsePlan.PagerDutyIncidentConfigurationProperty | cdk.IResolvable;
        /**
         * The ID of the AWS Secrets Manager secret that stores your PagerDuty key, either a General Access REST API Key or User Token REST API Key, and other user credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-secretid
         */
        readonly secretId: string;
    }
}

/**
 * Determine whether the given properties match those of a `PagerDutyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PagerDutyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_PagerDutyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('pagerDutyIncidentConfiguration', cdk.requiredValidator)(properties.pagerDutyIncidentConfiguration));
    errors.collect(cdk.propertyValidator('pagerDutyIncidentConfiguration', CfnResponsePlan_PagerDutyIncidentConfigurationPropertyValidator)(properties.pagerDutyIncidentConfiguration));
    errors.collect(cdk.propertyValidator('secretId', cdk.requiredValidator)(properties.secretId));
    errors.collect(cdk.propertyValidator('secretId', cdk.validateString)(properties.secretId));
    return errors.wrap('supplied properties not correct for "PagerDutyConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.PagerDutyConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `PagerDutyConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.PagerDutyConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanPagerDutyConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_PagerDutyConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        PagerDutyIncidentConfiguration: cfnResponsePlanPagerDutyIncidentConfigurationPropertyToCloudFormation(properties.pagerDutyIncidentConfiguration),
        SecretId: cdk.stringToCloudFormation(properties.secretId),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanPagerDutyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.PagerDutyConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.PagerDutyConfigurationProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('pagerDutyIncidentConfiguration', 'PagerDutyIncidentConfiguration', CfnResponsePlanPagerDutyIncidentConfigurationPropertyFromCloudFormation(properties.PagerDutyIncidentConfiguration));
    ret.addPropertyResult('secretId', 'SecretId', cfn_parse.FromCloudFormation.getString(properties.SecretId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html
     */
    export interface PagerDutyIncidentConfigurationProperty {
        /**
         * The ID of the PagerDuty service that the response plan associates with an incident when it launches.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyincidentconfiguration-serviceid
         */
        readonly serviceId: string;
    }
}

/**
 * Determine whether the given properties match those of a `PagerDutyIncidentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PagerDutyIncidentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_PagerDutyIncidentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('serviceId', cdk.requiredValidator)(properties.serviceId));
    errors.collect(cdk.propertyValidator('serviceId', cdk.validateString)(properties.serviceId));
    return errors.wrap('supplied properties not correct for "PagerDutyIncidentConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.PagerDutyIncidentConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `PagerDutyIncidentConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.PagerDutyIncidentConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanPagerDutyIncidentConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_PagerDutyIncidentConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ServiceId: cdk.stringToCloudFormation(properties.serviceId),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanPagerDutyIncidentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.PagerDutyIncidentConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.PagerDutyIncidentConfigurationProperty>();
    ret.addPropertyResult('serviceId', 'ServiceId', cfn_parse.FromCloudFormation.getString(properties.ServiceId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The `SsmAutomation` property type specifies details about the Systems Manager automation document that will be used as a runbook during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html
     */
    export interface SsmAutomationProperty {
        /**
         * The automation document's name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentname
         */
        readonly documentName: string;
        /**
         * The automation document's version to use when running.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentversion
         */
        readonly documentVersion?: string;
        /**
         * The key-value pairs to resolve dynamic parameter values when processing a Systems Manager Automation runbook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-dynamicparameters
         */
        readonly dynamicParameters?: Array<CfnResponsePlan.DynamicSsmParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The key-value pair parameters to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-parameters
         */
        readonly parameters?: Array<CfnResponsePlan.SsmParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the role that the automation document will assume when running commands.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-rolearn
         */
        readonly roleArn: string;
        /**
         * The account that the automation document will be run in. This can be in either the management account or an application account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-targetaccount
         */
        readonly targetAccount?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SsmAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `SsmAutomationProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_SsmAutomationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('documentName', cdk.requiredValidator)(properties.documentName));
    errors.collect(cdk.propertyValidator('documentName', cdk.validateString)(properties.documentName));
    errors.collect(cdk.propertyValidator('documentVersion', cdk.validateString)(properties.documentVersion));
    errors.collect(cdk.propertyValidator('dynamicParameters', cdk.listValidator(CfnResponsePlan_DynamicSsmParameterPropertyValidator))(properties.dynamicParameters));
    errors.collect(cdk.propertyValidator('parameters', cdk.listValidator(CfnResponsePlan_SsmParameterPropertyValidator))(properties.parameters));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('targetAccount', cdk.validateString)(properties.targetAccount));
    return errors.wrap('supplied properties not correct for "SsmAutomationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.SsmAutomation` resource
 *
 * @param properties - the TypeScript properties of a `SsmAutomationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.SsmAutomation` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanSsmAutomationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_SsmAutomationPropertyValidator(properties).assertSuccess();
    return {
        DocumentName: cdk.stringToCloudFormation(properties.documentName),
        DocumentVersion: cdk.stringToCloudFormation(properties.documentVersion),
        DynamicParameters: cdk.listMapper(cfnResponsePlanDynamicSsmParameterPropertyToCloudFormation)(properties.dynamicParameters),
        Parameters: cdk.listMapper(cfnResponsePlanSsmParameterPropertyToCloudFormation)(properties.parameters),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        TargetAccount: cdk.stringToCloudFormation(properties.targetAccount),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanSsmAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.SsmAutomationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.SsmAutomationProperty>();
    ret.addPropertyResult('documentName', 'DocumentName', cfn_parse.FromCloudFormation.getString(properties.DocumentName));
    ret.addPropertyResult('documentVersion', 'DocumentVersion', properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined);
    ret.addPropertyResult('dynamicParameters', 'DynamicParameters', properties.DynamicParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanDynamicSsmParameterPropertyFromCloudFormation)(properties.DynamicParameters) : undefined);
    ret.addPropertyResult('parameters', 'Parameters', properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanSsmParameterPropertyFromCloudFormation)(properties.Parameters) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('targetAccount', 'TargetAccount', properties.TargetAccount != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAccount) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResponsePlan {
    /**
     * The key-value pair parameters to use when running the automation document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html
     */
    export interface SsmParameterProperty {
        /**
         * The key parameter to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-key
         */
        readonly key: string;
        /**
         * The value parameter to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-values
         */
        readonly values: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SsmParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SsmParameterProperty`
 *
 * @returns the result of the validation.
 */
function CfnResponsePlan_SsmParameterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('values', cdk.requiredValidator)(properties.values));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "SsmParameterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.SsmParameter` resource
 *
 * @param properties - the TypeScript properties of a `SsmParameterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMIncidents::ResponsePlan.SsmParameter` resource.
 */
// @ts-ignore TS6133
function cfnResponsePlanSsmParameterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResponsePlan_SsmParameterPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnResponsePlanSsmParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.SsmParameterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.SsmParameterProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('values', 'Values', cfn_parse.FromCloudFormation.getStringArray(properties.Values));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
