// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:34.103Z","fingerprint":"opikxbuK3DBRA9d/rlxQ88Zo86r6Q+AVxP859Yx/f1w="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDevice`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html
 */
export interface CfnDeviceProps {

    /**
     * The ID of the device, such as `G030PX0312744DWM` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-deviceid
     */
    readonly deviceId: string;

    /**
     * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the result of the validation.
 */
function CfnDevicePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deviceId', cdk.requiredValidator)(properties.deviceId));
    errors.collect(cdk.propertyValidator('deviceId', cdk.validateString)(properties.deviceId));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "CfnDeviceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoT1Click::Device` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoT1Click::Device` resource.
 */
// @ts-ignore TS6133
function cfnDevicePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDevicePropsValidator(properties).assertSuccess();
    return {
        DeviceId: cdk.stringToCloudFormation(properties.deviceId),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProps>();
    ret.addPropertyResult('deviceId', 'DeviceId', cfn_parse.FromCloudFormation.getString(properties.DeviceId));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoT1Click::Device`
 *
 * The `AWS::IoT1Click::Device` resource controls the enabled state of an AWS IoT 1-Click compatible device. For more information, see [Device](https://docs.aws.amazon.com/iot-1-click/1.0/devices-apireference/devices-deviceid.html) in the *AWS IoT 1-Click Devices API Reference* .
 *
 * @cloudformationResource AWS::IoT1Click::Device
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html
 */
export class CfnDevice extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoT1Click::Device";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDevice {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDevicePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDevice(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the device, such as `arn:aws:iot1click:us-west-2:123456789012:devices/G030PX0312744DWM` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the device.
     * @cloudformationAttribute DeviceId
     */
    public readonly attrDeviceId: string;

    /**
     * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
     * @cloudformationAttribute Enabled
     */
    public readonly attrEnabled: cdk.IResolvable;

    /**
     * The ID of the device, such as `G030PX0312744DWM` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-deviceid
     */
    public deviceId: string;

    /**
     * A Boolean value indicating whether the device is enabled ( `true` ) or not ( `false` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-device.html#cfn-iot1click-device-enabled
     */
    public enabled: boolean | cdk.IResolvable;

    /**
     * Create a new `AWS::IoT1Click::Device`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeviceProps) {
        super(scope, id, { type: CfnDevice.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'deviceId', this);
        cdk.requireProperty(props, 'enabled', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDeviceId = cdk.Token.asString(this.getAtt('DeviceId', cdk.ResolutionTypeHint.STRING));
        this.attrEnabled = this.getAtt('Enabled', cdk.ResolutionTypeHint.STRING);

        this.deviceId = props.deviceId;
        this.enabled = props.enabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDevice.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            deviceId: this.deviceId,
            enabled: this.enabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDevicePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnPlacement`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html
 */
export interface CfnPlacementProps {

    /**
     * The name of the project containing the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-projectname
     */
    readonly projectName: string;

    /**
     * The devices to associate with the placement, as defined by a mapping of zero or more key-value pairs wherein the key is a template name and the value is a device ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-associateddevices
     */
    readonly associatedDevices?: any | cdk.IResolvable;

    /**
     * The user-defined attributes associated with the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-attributes
     */
    readonly attributes?: any | cdk.IResolvable;

    /**
     * The name of the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-placementname
     */
    readonly placementName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPlacementProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlacementProps`
 *
 * @returns the result of the validation.
 */
function CfnPlacementPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associatedDevices', cdk.validateObject)(properties.associatedDevices));
    errors.collect(cdk.propertyValidator('attributes', cdk.validateObject)(properties.attributes));
    errors.collect(cdk.propertyValidator('placementName', cdk.validateString)(properties.placementName));
    errors.collect(cdk.propertyValidator('projectName', cdk.requiredValidator)(properties.projectName));
    errors.collect(cdk.propertyValidator('projectName', cdk.validateString)(properties.projectName));
    return errors.wrap('supplied properties not correct for "CfnPlacementProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoT1Click::Placement` resource
 *
 * @param properties - the TypeScript properties of a `CfnPlacementProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoT1Click::Placement` resource.
 */
// @ts-ignore TS6133
function cfnPlacementPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlacementPropsValidator(properties).assertSuccess();
    return {
        ProjectName: cdk.stringToCloudFormation(properties.projectName),
        AssociatedDevices: cdk.objectToCloudFormation(properties.associatedDevices),
        Attributes: cdk.objectToCloudFormation(properties.attributes),
        PlacementName: cdk.stringToCloudFormation(properties.placementName),
    };
}

// @ts-ignore TS6133
function CfnPlacementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlacementProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlacementProps>();
    ret.addPropertyResult('projectName', 'ProjectName', cfn_parse.FromCloudFormation.getString(properties.ProjectName));
    ret.addPropertyResult('associatedDevices', 'AssociatedDevices', properties.AssociatedDevices != null ? cfn_parse.FromCloudFormation.getAny(properties.AssociatedDevices) : undefined);
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined);
    ret.addPropertyResult('placementName', 'PlacementName', properties.PlacementName != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoT1Click::Placement`
 *
 * The `AWS::IoT1Click::Placement` resource creates a placement to be associated with an AWS IoT 1-Click project. A placement is an instance of a device in a location. For more information, see [Projects, Templates, and Placements](https://docs.aws.amazon.com/iot-1-click/latest/developerguide/1click-PTP.html) in the *AWS IoT 1-Click Developer Guide* .
 *
 * @cloudformationResource AWS::IoT1Click::Placement
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html
 */
export class CfnPlacement extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoT1Click::Placement";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlacement {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPlacementPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPlacement(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the placement, such as `floor17` .
     * @cloudformationAttribute PlacementName
     */
    public readonly attrPlacementName: string;

    /**
     * The name of the project containing the placement, such as `conference-rooms` .
     * @cloudformationAttribute ProjectName
     */
    public readonly attrProjectName: string;

    /**
     * The name of the project containing the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-projectname
     */
    public projectName: string;

    /**
     * The devices to associate with the placement, as defined by a mapping of zero or more key-value pairs wherein the key is a template name and the value is a device ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-associateddevices
     */
    public associatedDevices: any | cdk.IResolvable | undefined;

    /**
     * The user-defined attributes associated with the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-attributes
     */
    public attributes: any | cdk.IResolvable | undefined;

    /**
     * The name of the placement.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-placement.html#cfn-iot1click-placement-placementname
     */
    public placementName: string | undefined;

    /**
     * Create a new `AWS::IoT1Click::Placement`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPlacementProps) {
        super(scope, id, { type: CfnPlacement.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'projectName', this);
        this.attrPlacementName = cdk.Token.asString(this.getAtt('PlacementName', cdk.ResolutionTypeHint.STRING));
        this.attrProjectName = cdk.Token.asString(this.getAtt('ProjectName', cdk.ResolutionTypeHint.STRING));

        this.projectName = props.projectName;
        this.associatedDevices = props.associatedDevices;
        this.attributes = props.attributes;
        this.placementName = props.placementName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlacement.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            projectName: this.projectName,
            associatedDevices: this.associatedDevices,
            attributes: this.attributes,
            placementName: this.placementName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPlacementPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html
 */
export interface CfnProjectProps {

    /**
     * An object describing the project's placement specifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-placementtemplate
     */
    readonly placementTemplate: CfnProject.PlacementTemplateProperty | cdk.IResolvable;

    /**
     * The description of the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-description
     */
    readonly description?: string;

    /**
     * The name of the project from which to obtain information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-projectname
     */
    readonly projectName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('placementTemplate', cdk.requiredValidator)(properties.placementTemplate));
    errors.collect(cdk.propertyValidator('placementTemplate', CfnProject_PlacementTemplatePropertyValidator)(properties.placementTemplate));
    errors.collect(cdk.propertyValidator('projectName', cdk.validateString)(properties.projectName));
    return errors.wrap('supplied properties not correct for "CfnProjectProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoT1Click::Project` resource
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoT1Click::Project` resource.
 */
// @ts-ignore TS6133
function cfnProjectPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProjectPropsValidator(properties).assertSuccess();
    return {
        PlacementTemplate: cfnProjectPlacementTemplatePropertyToCloudFormation(properties.placementTemplate),
        Description: cdk.stringToCloudFormation(properties.description),
        ProjectName: cdk.stringToCloudFormation(properties.projectName),
    };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
    ret.addPropertyResult('placementTemplate', 'PlacementTemplate', CfnProjectPlacementTemplatePropertyFromCloudFormation(properties.PlacementTemplate));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('projectName', 'ProjectName', properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoT1Click::Project`
 *
 * The `AWS::IoT1Click::Project` resource creates an empty project with a placement template. A project contains zero or more placements that adhere to the placement template defined in the project. For more information, see [CreateProject](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_CreateProject.html) in the *AWS IoT 1-Click Projects API Reference* .
 *
 * @cloudformationResource AWS::IoT1Click::Project
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoT1Click::Project";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
        const ret = new CfnProject(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the project, such as `arn:aws:iot1click:us-east-1:123456789012:projects/project-a1bzhi` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the project, such as `project-a1bzhi` .
     * @cloudformationAttribute ProjectName
     */
    public readonly attrProjectName: string;

    /**
     * An object describing the project's placement specifications.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-placementtemplate
     */
    public placementTemplate: CfnProject.PlacementTemplateProperty | cdk.IResolvable;

    /**
     * The description of the project.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-description
     */
    public description: string | undefined;

    /**
     * The name of the project from which to obtain information.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot1click-project.html#cfn-iot1click-project-projectname
     */
    public projectName: string | undefined;

    /**
     * Create a new `AWS::IoT1Click::Project`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
        super(scope, id, { type: CfnProject.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'placementTemplate', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrProjectName = cdk.Token.asString(this.getAtt('ProjectName', cdk.ResolutionTypeHint.STRING));

        this.placementTemplate = props.placementTemplate;
        this.description = props.description;
        this.projectName = props.projectName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            placementTemplate: this.placementTemplate,
            description: this.description,
            projectName: this.projectName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnProjectPropsToCloudFormation(props);
    }
}

export namespace CfnProject {
    /**
     * In AWS CloudFormation , use the `DeviceTemplate` property type to define the template for an AWS IoT 1-Click project.
     *
     * `DeviceTemplate` is a property of the `AWS::IoT1Click::Project` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html
     */
    export interface DeviceTemplateProperty {
        /**
         * An optional AWS Lambda function to invoke instead of the default AWS Lambda function provided by the placement template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html#cfn-iot1click-project-devicetemplate-callbackoverrides
         */
        readonly callbackOverrides?: any | cdk.IResolvable;
        /**
         * The device type, which currently must be `"button"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-devicetemplate.html#cfn-iot1click-project-devicetemplate-devicetype
         */
        readonly deviceType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeviceTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnProject_DeviceTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('callbackOverrides', cdk.validateObject)(properties.callbackOverrides));
    errors.collect(cdk.propertyValidator('deviceType', cdk.validateString)(properties.deviceType));
    return errors.wrap('supplied properties not correct for "DeviceTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoT1Click::Project.DeviceTemplate` resource
 *
 * @param properties - the TypeScript properties of a `DeviceTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoT1Click::Project.DeviceTemplate` resource.
 */
// @ts-ignore TS6133
function cfnProjectDeviceTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProject_DeviceTemplatePropertyValidator(properties).assertSuccess();
    return {
        CallbackOverrides: cdk.objectToCloudFormation(properties.callbackOverrides),
        DeviceType: cdk.stringToCloudFormation(properties.deviceType),
    };
}

// @ts-ignore TS6133
function CfnProjectDeviceTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProject.DeviceTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.DeviceTemplateProperty>();
    ret.addPropertyResult('callbackOverrides', 'CallbackOverrides', properties.CallbackOverrides != null ? cfn_parse.FromCloudFormation.getAny(properties.CallbackOverrides) : undefined);
    ret.addPropertyResult('deviceType', 'DeviceType', properties.DeviceType != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnProject {
    /**
     * In AWS CloudFormation , use the `PlacementTemplate` property type to define the template for an AWS IoT 1-Click project.
     *
     * `PlacementTemplate` is a property of the `AWS::IoT1Click::Project` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html
     */
    export interface PlacementTemplateProperty {
        /**
         * The default attributes (key-value pairs) to be applied to all placements using this template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html#cfn-iot1click-project-placementtemplate-defaultattributes
         */
        readonly defaultAttributes?: any | cdk.IResolvable;
        /**
         * An object specifying the [DeviceTemplate](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_DeviceTemplate.html) for all placements using this ( [PlacementTemplate](https://docs.aws.amazon.com/iot-1-click/latest/projects-apireference/API_PlacementTemplate.html) ) template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iot1click-project-placementtemplate.html#cfn-iot1click-project-placementtemplate-devicetemplates
         */
        readonly deviceTemplates?: { [key: string]: (CfnProject.DeviceTemplateProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PlacementTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `PlacementTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnProject_PlacementTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultAttributes', cdk.validateObject)(properties.defaultAttributes));
    errors.collect(cdk.propertyValidator('deviceTemplates', cdk.hashValidator(CfnProject_DeviceTemplatePropertyValidator))(properties.deviceTemplates));
    return errors.wrap('supplied properties not correct for "PlacementTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoT1Click::Project.PlacementTemplate` resource
 *
 * @param properties - the TypeScript properties of a `PlacementTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoT1Click::Project.PlacementTemplate` resource.
 */
// @ts-ignore TS6133
function cfnProjectPlacementTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnProject_PlacementTemplatePropertyValidator(properties).assertSuccess();
    return {
        DefaultAttributes: cdk.objectToCloudFormation(properties.defaultAttributes),
        DeviceTemplates: cdk.hashMapper(cfnProjectDeviceTemplatePropertyToCloudFormation)(properties.deviceTemplates),
    };
}

// @ts-ignore TS6133
function CfnProjectPlacementTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProject.PlacementTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.PlacementTemplateProperty>();
    ret.addPropertyResult('defaultAttributes', 'DefaultAttributes', properties.DefaultAttributes != null ? cfn_parse.FromCloudFormation.getAny(properties.DefaultAttributes) : undefined);
    ret.addPropertyResult('deviceTemplates', 'DeviceTemplates', properties.DeviceTemplates != null ? cfn_parse.FromCloudFormation.getMap(CfnProjectDeviceTemplatePropertyFromCloudFormation)(properties.DeviceTemplates) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
