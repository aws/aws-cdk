// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:49.306Z","fingerprint":"uqHxsQsKaUeUPE1/tOi1X7w3cKxDbg4KsHBw/0fRbuc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnExecutionPlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export interface CfnExecutionPlanProps {

    /**
     * `AWS::KendraRanking::ExecutionPlan.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-name
     */
    readonly name: string;

    /**
     * `AWS::KendraRanking::ExecutionPlan.CapacityUnits`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-capacityunits
     */
    readonly capacityUnits?: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::KendraRanking::ExecutionPlan.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-description
     */
    readonly description?: string;

    /**
     * `AWS::KendraRanking::ExecutionPlan.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnExecutionPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnExecutionPlanProps`
 *
 * @returns the result of the validation.
 */
function CfnExecutionPlanPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('capacityUnits', CfnExecutionPlan_CapacityUnitsConfigurationPropertyValidator)(properties.capacityUnits));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnExecutionPlanProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KendraRanking::ExecutionPlan` resource
 *
 * @param properties - the TypeScript properties of a `CfnExecutionPlanProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KendraRanking::ExecutionPlan` resource.
 */
// @ts-ignore TS6133
function cfnExecutionPlanPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExecutionPlanPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        CapacityUnits: cfnExecutionPlanCapacityUnitsConfigurationPropertyToCloudFormation(properties.capacityUnits),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnExecutionPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExecutionPlanProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExecutionPlanProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('capacityUnits', 'CapacityUnits', properties.CapacityUnits != null ? CfnExecutionPlanCapacityUnitsConfigurationPropertyFromCloudFormation(properties.CapacityUnits) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::KendraRanking::ExecutionPlan`
 *
 *
 *
 * @cloudformationResource AWS::KendraRanking::ExecutionPlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html
 */
export class CfnExecutionPlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::KendraRanking::ExecutionPlan";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExecutionPlan {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnExecutionPlanPropsFromCloudFormation(resourceProperties);
        const ret = new CfnExecutionPlan(scope, id, propsResult.value);
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
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * `AWS::KendraRanking::ExecutionPlan.Name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-name
     */
    public name: string;

    /**
     * `AWS::KendraRanking::ExecutionPlan.CapacityUnits`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-capacityunits
     */
    public capacityUnits: CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::KendraRanking::ExecutionPlan.Description`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-description
     */
    public description: string | undefined;

    /**
     * `AWS::KendraRanking::ExecutionPlan.Tags`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendraranking-executionplan.html#cfn-kendraranking-executionplan-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::KendraRanking::ExecutionPlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnExecutionPlanProps) {
        super(scope, id, { type: CfnExecutionPlan.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.capacityUnits = props.capacityUnits;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KendraRanking::ExecutionPlan", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnExecutionPlan.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            capacityUnits: this.capacityUnits,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnExecutionPlanPropsToCloudFormation(props);
    }
}

export namespace CfnExecutionPlan {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html
     */
    export interface CapacityUnitsConfigurationProperty {
        /**
         * `CfnExecutionPlan.CapacityUnitsConfigurationProperty.RescoreCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendraranking-executionplan-capacityunitsconfiguration.html#cfn-kendraranking-executionplan-capacityunitsconfiguration-rescorecapacityunits
         */
        readonly rescoreCapacityUnits: number;
    }
}

/**
 * Determine whether the given properties match those of a `CapacityUnitsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityUnitsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnExecutionPlan_CapacityUnitsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rescoreCapacityUnits', cdk.requiredValidator)(properties.rescoreCapacityUnits));
    errors.collect(cdk.propertyValidator('rescoreCapacityUnits', cdk.validateNumber)(properties.rescoreCapacityUnits));
    return errors.wrap('supplied properties not correct for "CapacityUnitsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::KendraRanking::ExecutionPlan.CapacityUnitsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CapacityUnitsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::KendraRanking::ExecutionPlan.CapacityUnitsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnExecutionPlanCapacityUnitsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnExecutionPlan_CapacityUnitsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        RescoreCapacityUnits: cdk.numberToCloudFormation(properties.rescoreCapacityUnits),
    };
}

// @ts-ignore TS6133
function CfnExecutionPlanCapacityUnitsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnExecutionPlan.CapacityUnitsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnExecutionPlan.CapacityUnitsConfigurationProperty>();
    ret.addPropertyResult('rescoreCapacityUnits', 'RescoreCapacityUnits', cfn_parse.FromCloudFormation.getNumber(properties.RescoreCapacityUnits));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
