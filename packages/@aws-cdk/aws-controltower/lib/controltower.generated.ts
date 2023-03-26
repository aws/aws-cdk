// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T10:14:35.463Z","fingerprint":"6Vq7BTEUTyq5kQvdS1KsRmBjA6anFzPZa1EmrEZGfks="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnEnabledControl`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html
 */
export interface CfnEnabledControlProps {

    /**
     * The ARN of the control. Only *Strongly recommended* and *Elective* controls are permitted, with the exception of the *Region deny* guardrail.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-controlidentifier
     */
    readonly controlIdentifier: string;

    /**
     * The ARN of the organizational unit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-targetidentifier
     */
    readonly targetIdentifier: string;
}

/**
 * Determine whether the given properties match those of a `CfnEnabledControlProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnabledControlProps`
 *
 * @returns the result of the validation.
 */
function CfnEnabledControlPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('controlIdentifier', cdk.requiredValidator)(properties.controlIdentifier));
    errors.collect(cdk.propertyValidator('controlIdentifier', cdk.validateString)(properties.controlIdentifier));
    errors.collect(cdk.propertyValidator('targetIdentifier', cdk.requiredValidator)(properties.targetIdentifier));
    errors.collect(cdk.propertyValidator('targetIdentifier', cdk.validateString)(properties.targetIdentifier));
    return errors.wrap('supplied properties not correct for "CfnEnabledControlProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ControlTower::EnabledControl` resource
 *
 * @param properties - the TypeScript properties of a `CfnEnabledControlProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ControlTower::EnabledControl` resource.
 */
// @ts-ignore TS6133
function cfnEnabledControlPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEnabledControlPropsValidator(properties).assertSuccess();
    return {
        ControlIdentifier: cdk.stringToCloudFormation(properties.controlIdentifier),
        TargetIdentifier: cdk.stringToCloudFormation(properties.targetIdentifier),
    };
}

// @ts-ignore TS6133
function CfnEnabledControlPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnabledControlProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnabledControlProps>();
    ret.addPropertyResult('controlIdentifier', 'ControlIdentifier', cfn_parse.FromCloudFormation.getString(properties.ControlIdentifier));
    ret.addPropertyResult('targetIdentifier', 'TargetIdentifier', cfn_parse.FromCloudFormation.getString(properties.TargetIdentifier));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ControlTower::EnabledControl`
 *
 * The resource represents an enabled control. It specifies an asynchronous operation that creates AWS resources on the specified organizational unit and the accounts it contains. The resources created will vary according to the control that you specify.
 *
 * @cloudformationResource AWS::ControlTower::EnabledControl
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html
 */
export class CfnEnabledControl extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ControlTower::EnabledControl";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnabledControl {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEnabledControlPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEnabledControl(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the control. Only *Strongly recommended* and *Elective* controls are permitted, with the exception of the *Region deny* guardrail.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-controlidentifier
     */
    public controlIdentifier: string;

    /**
     * The ARN of the organizational unit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-controltower-enabledcontrol.html#cfn-controltower-enabledcontrol-targetidentifier
     */
    public targetIdentifier: string;

    /**
     * Create a new `AWS::ControlTower::EnabledControl`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnabledControlProps) {
        super(scope, id, { type: CfnEnabledControl.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'controlIdentifier', this);
        cdk.requireProperty(props, 'targetIdentifier', this);

        this.controlIdentifier = props.controlIdentifier;
        this.targetIdentifier = props.targetIdentifier;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnabledControl.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            controlIdentifier: this.controlIdentifier,
            targetIdentifier: this.targetIdentifier,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEnabledControlPropsToCloudFormation(props);
    }
}
