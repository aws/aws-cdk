// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:45.814Z","fingerprint":"w8yMG6uD0SsZLYTPRxQHC5UZf4iR8AQco1NasyV/0Do="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDestination`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export interface CfnDestinationProps {

    /**
     * The rule name to send messages to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expression
     */
    readonly expression: string;

    /**
     * The type of value in `Expression` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expressiontype
     */
    readonly expressionType: string;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-name
     */
    readonly name: string;

    /**
     * The ARN of the IAM Role that authorizes the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-rolearn
     */
    readonly roleArn: string;

    /**
     * The description of the new resource. Maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-description
     */
    readonly description?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the result of the validation.
 */
function CfnDestinationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('expression', cdk.requiredValidator)(properties.expression));
    errors.collect(cdk.propertyValidator('expression', cdk.validateString)(properties.expression));
    errors.collect(cdk.propertyValidator('expressionType', cdk.requiredValidator)(properties.expressionType));
    errors.collect(cdk.propertyValidator('expressionType', cdk.validateString)(properties.expressionType));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDestinationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::Destination` resource
 *
 * @param properties - the TypeScript properties of a `CfnDestinationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::Destination` resource.
 */
// @ts-ignore TS6133
function cfnDestinationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDestinationPropsValidator(properties).assertSuccess();
    return {
        Expression: cdk.stringToCloudFormation(properties.expression),
        ExpressionType: cdk.stringToCloudFormation(properties.expressionType),
        Name: cdk.stringToCloudFormation(properties.name),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDestinationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDestinationProps>();
    ret.addPropertyResult('expression', 'Expression', cfn_parse.FromCloudFormation.getString(properties.Expression));
    ret.addPropertyResult('expressionType', 'ExpressionType', cfn_parse.FromCloudFormation.getString(properties.ExpressionType));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::Destination`
 *
 * Creates a new destination that maps a device message to an AWS IoT rule.
 *
 * @cloudformationResource AWS::IoTWireless::Destination
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html
 */
export class CfnDestination extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::Destination";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDestination {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDestinationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDestination(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the destination created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The rule name to send messages to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expression
     */
    public expression: string;

    /**
     * The type of value in `Expression` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-expressiontype
     */
    public expressionType: string;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-name
     */
    public name: string;

    /**
     * The ARN of the IAM Role that authorizes the destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-rolearn
     */
    public roleArn: string;

    /**
     * The description of the new resource. Maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-description
     */
    public description: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-destination.html#cfn-iotwireless-destination-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::Destination`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDestinationProps) {
        super(scope, id, { type: CfnDestination.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'expression', this);
        cdk.requireProperty(props, 'expressionType', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.expression = props.expression;
        this.expressionType = props.expressionType;
        this.name = props.name;
        this.roleArn = props.roleArn;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::Destination", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDestination.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            expression: this.expression,
            expressionType: this.expressionType,
            name: this.name,
            roleArn: this.roleArn,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDestinationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnDeviceProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export interface CfnDeviceProfileProps {

    /**
     * LoRaWAN device profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-lorawan
     */
    readonly loRaWan?: CfnDeviceProfile.LoRaWANDeviceProfileProperty | cdk.IResolvable;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDeviceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnDeviceProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('loRaWan', CfnDeviceProfile_LoRaWANDeviceProfilePropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDeviceProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::DeviceProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnDeviceProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::DeviceProfile` resource.
 */
// @ts-ignore TS6133
function cfnDeviceProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeviceProfilePropsValidator(properties).assertSuccess();
    return {
        LoRaWAN: cfnDeviceProfileLoRaWANDeviceProfilePropertyToCloudFormation(properties.loRaWan),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDeviceProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProfileProps>();
    ret.addPropertyResult('loRaWan', 'LoRaWAN', properties.LoRaWAN != null ? CfnDeviceProfileLoRaWANDeviceProfilePropertyFromCloudFormation(properties.LoRaWAN) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::DeviceProfile`
 *
 * Creates a new device profile.
 *
 * @cloudformationResource AWS::IoTWireless::DeviceProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html
 */
export class CfnDeviceProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::DeviceProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeviceProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDeviceProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnDeviceProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the device profile created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the device profile created.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * LoRaWAN device profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-lorawan
     */
    public loRaWan: CfnDeviceProfile.LoRaWANDeviceProfileProperty | cdk.IResolvable | undefined;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-deviceprofile.html#cfn-iotwireless-deviceprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::DeviceProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDeviceProfileProps = {}) {
        super(scope, id, { type: CfnDeviceProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.loRaWan = props.loRaWan;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::DeviceProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeviceProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            loRaWan: this.loRaWan,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDeviceProfilePropsToCloudFormation(props);
    }
}

export namespace CfnDeviceProfile {
    /**
     * LoRaWAN device profile object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html
     */
    export interface LoRaWANDeviceProfileProperty {
        /**
         * The ClassBTimeout value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classbtimeout
         */
        readonly classBTimeout?: number;
        /**
         * The ClassCTimeout value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-classctimeout
         */
        readonly classCTimeout?: number;
        /**
         * The list of values that make up the FactoryPresetFreqs value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-factorypresetfreqslist
         */
        readonly factoryPresetFreqsList?: number[] | cdk.IResolvable;
        /**
         * The MAC version (such as OTAA 1.1 or OTAA 1.0.3) to use with this device profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-macversion
         */
        readonly macVersion?: string;
        /**
         * The MaxDutyCycle value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxdutycycle
         */
        readonly maxDutyCycle?: number;
        /**
         * The MaxEIRP value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-maxeirp
         */
        readonly maxEirp?: number;
        /**
         * The PingSlotDR value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotdr
         */
        readonly pingSlotDr?: number;
        /**
         * The PingSlotFreq value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotfreq
         */
        readonly pingSlotFreq?: number;
        /**
         * The PingSlotPeriod value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-pingslotperiod
         */
        readonly pingSlotPeriod?: number;
        /**
         * The version of regional parameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-regparamsrevision
         */
        readonly regParamsRevision?: string;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rfregion
         */
        readonly rfRegion?: string;
        /**
         * The RXDataRate2 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdatarate2
         */
        readonly rxDataRate2?: number;
        /**
         * The RXDelay1 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdelay1
         */
        readonly rxDelay1?: number;
        /**
         * The RXDROffset1 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxdroffset1
         */
        readonly rxDrOffset1?: number;
        /**
         * The RXFreq2 value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-rxfreq2
         */
        readonly rxFreq2?: number;
        /**
         * The Supports32BitFCnt value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supports32bitfcnt
         */
        readonly supports32BitFCnt?: boolean | cdk.IResolvable;
        /**
         * The SupportsClassB value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassb
         */
        readonly supportsClassB?: boolean | cdk.IResolvable;
        /**
         * The SupportsClassC value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsclassc
         */
        readonly supportsClassC?: boolean | cdk.IResolvable;
        /**
         * The SupportsJoin value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-deviceprofile-lorawandeviceprofile.html#cfn-iotwireless-deviceprofile-lorawandeviceprofile-supportsjoin
         */
        readonly supportsJoin?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANDeviceProfileProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProfileProperty`
 *
 * @returns the result of the validation.
 */
function CfnDeviceProfile_LoRaWANDeviceProfilePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('classBTimeout', cdk.validateNumber)(properties.classBTimeout));
    errors.collect(cdk.propertyValidator('classCTimeout', cdk.validateNumber)(properties.classCTimeout));
    errors.collect(cdk.propertyValidator('factoryPresetFreqsList', cdk.listValidator(cdk.validateNumber))(properties.factoryPresetFreqsList));
    errors.collect(cdk.propertyValidator('macVersion', cdk.validateString)(properties.macVersion));
    errors.collect(cdk.propertyValidator('maxDutyCycle', cdk.validateNumber)(properties.maxDutyCycle));
    errors.collect(cdk.propertyValidator('maxEirp', cdk.validateNumber)(properties.maxEirp));
    errors.collect(cdk.propertyValidator('pingSlotDr', cdk.validateNumber)(properties.pingSlotDr));
    errors.collect(cdk.propertyValidator('pingSlotFreq', cdk.validateNumber)(properties.pingSlotFreq));
    errors.collect(cdk.propertyValidator('pingSlotPeriod', cdk.validateNumber)(properties.pingSlotPeriod));
    errors.collect(cdk.propertyValidator('regParamsRevision', cdk.validateString)(properties.regParamsRevision));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.validateString)(properties.rfRegion));
    errors.collect(cdk.propertyValidator('rxDataRate2', cdk.validateNumber)(properties.rxDataRate2));
    errors.collect(cdk.propertyValidator('rxDelay1', cdk.validateNumber)(properties.rxDelay1));
    errors.collect(cdk.propertyValidator('rxDrOffset1', cdk.validateNumber)(properties.rxDrOffset1));
    errors.collect(cdk.propertyValidator('rxFreq2', cdk.validateNumber)(properties.rxFreq2));
    errors.collect(cdk.propertyValidator('supports32BitFCnt', cdk.validateBoolean)(properties.supports32BitFCnt));
    errors.collect(cdk.propertyValidator('supportsClassB', cdk.validateBoolean)(properties.supportsClassB));
    errors.collect(cdk.propertyValidator('supportsClassC', cdk.validateBoolean)(properties.supportsClassC));
    errors.collect(cdk.propertyValidator('supportsJoin', cdk.validateBoolean)(properties.supportsJoin));
    return errors.wrap('supplied properties not correct for "LoRaWANDeviceProfileProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::DeviceProfile.LoRaWANDeviceProfile` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProfileProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::DeviceProfile.LoRaWANDeviceProfile` resource.
 */
// @ts-ignore TS6133
function cfnDeviceProfileLoRaWANDeviceProfilePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDeviceProfile_LoRaWANDeviceProfilePropertyValidator(properties).assertSuccess();
    return {
        ClassBTimeout: cdk.numberToCloudFormation(properties.classBTimeout),
        ClassCTimeout: cdk.numberToCloudFormation(properties.classCTimeout),
        FactoryPresetFreqsList: cdk.listMapper(cdk.numberToCloudFormation)(properties.factoryPresetFreqsList),
        MacVersion: cdk.stringToCloudFormation(properties.macVersion),
        MaxDutyCycle: cdk.numberToCloudFormation(properties.maxDutyCycle),
        MaxEirp: cdk.numberToCloudFormation(properties.maxEirp),
        PingSlotDr: cdk.numberToCloudFormation(properties.pingSlotDr),
        PingSlotFreq: cdk.numberToCloudFormation(properties.pingSlotFreq),
        PingSlotPeriod: cdk.numberToCloudFormation(properties.pingSlotPeriod),
        RegParamsRevision: cdk.stringToCloudFormation(properties.regParamsRevision),
        RfRegion: cdk.stringToCloudFormation(properties.rfRegion),
        RxDataRate2: cdk.numberToCloudFormation(properties.rxDataRate2),
        RxDelay1: cdk.numberToCloudFormation(properties.rxDelay1),
        RxDrOffset1: cdk.numberToCloudFormation(properties.rxDrOffset1),
        RxFreq2: cdk.numberToCloudFormation(properties.rxFreq2),
        Supports32BitFCnt: cdk.booleanToCloudFormation(properties.supports32BitFCnt),
        SupportsClassB: cdk.booleanToCloudFormation(properties.supportsClassB),
        SupportsClassC: cdk.booleanToCloudFormation(properties.supportsClassC),
        SupportsJoin: cdk.booleanToCloudFormation(properties.supportsJoin),
    };
}

// @ts-ignore TS6133
function CfnDeviceProfileLoRaWANDeviceProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeviceProfile.LoRaWANDeviceProfileProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeviceProfile.LoRaWANDeviceProfileProperty>();
    ret.addPropertyResult('classBTimeout', 'ClassBTimeout', properties.ClassBTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ClassBTimeout) : undefined);
    ret.addPropertyResult('classCTimeout', 'ClassCTimeout', properties.ClassCTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ClassCTimeout) : undefined);
    ret.addPropertyResult('factoryPresetFreqsList', 'FactoryPresetFreqsList', properties.FactoryPresetFreqsList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.FactoryPresetFreqsList) : undefined);
    ret.addPropertyResult('macVersion', 'MacVersion', properties.MacVersion != null ? cfn_parse.FromCloudFormation.getString(properties.MacVersion) : undefined);
    ret.addPropertyResult('maxDutyCycle', 'MaxDutyCycle', properties.MaxDutyCycle != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDutyCycle) : undefined);
    ret.addPropertyResult('maxEirp', 'MaxEirp', properties.MaxEirp != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxEirp) : undefined);
    ret.addPropertyResult('pingSlotDr', 'PingSlotDr', properties.PingSlotDr != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotDr) : undefined);
    ret.addPropertyResult('pingSlotFreq', 'PingSlotFreq', properties.PingSlotFreq != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotFreq) : undefined);
    ret.addPropertyResult('pingSlotPeriod', 'PingSlotPeriod', properties.PingSlotPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PingSlotPeriod) : undefined);
    ret.addPropertyResult('regParamsRevision', 'RegParamsRevision', properties.RegParamsRevision != null ? cfn_parse.FromCloudFormation.getString(properties.RegParamsRevision) : undefined);
    ret.addPropertyResult('rfRegion', 'RfRegion', properties.RfRegion != null ? cfn_parse.FromCloudFormation.getString(properties.RfRegion) : undefined);
    ret.addPropertyResult('rxDataRate2', 'RxDataRate2', properties.RxDataRate2 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDataRate2) : undefined);
    ret.addPropertyResult('rxDelay1', 'RxDelay1', properties.RxDelay1 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDelay1) : undefined);
    ret.addPropertyResult('rxDrOffset1', 'RxDrOffset1', properties.RxDrOffset1 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxDrOffset1) : undefined);
    ret.addPropertyResult('rxFreq2', 'RxFreq2', properties.RxFreq2 != null ? cfn_parse.FromCloudFormation.getNumber(properties.RxFreq2) : undefined);
    ret.addPropertyResult('supports32BitFCnt', 'Supports32BitFCnt', properties.Supports32BitFCnt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Supports32BitFCnt) : undefined);
    ret.addPropertyResult('supportsClassB', 'SupportsClassB', properties.SupportsClassB != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsClassB) : undefined);
    ret.addPropertyResult('supportsClassC', 'SupportsClassC', properties.SupportsClassC != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsClassC) : undefined);
    ret.addPropertyResult('supportsJoin', 'SupportsJoin', properties.SupportsJoin != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SupportsJoin) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFuotaTask`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export interface CfnFuotaTaskProps {

    /**
     * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdateimage
     */
    readonly firmwareUpdateImage: string;

    /**
     * The firmware update role that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdaterole
     */
    readonly firmwareUpdateRole: string;

    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-lorawan
     */
    readonly loRaWan: CfnFuotaTask.LoRaWANProperty | cdk.IResolvable;

    /**
     * The ID of the multicast group to associate with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatemulticastgroup
     */
    readonly associateMulticastGroup?: string;

    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatewirelessdevice
     */
    readonly associateWirelessDevice?: string;

    /**
     * The description of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-description
     */
    readonly description?: string;

    /**
     * The ID of the multicast group to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatemulticastgroup
     */
    readonly disassociateMulticastGroup?: string;

    /**
     * The ID of the wireless device to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatewirelessdevice
     */
    readonly disassociateWirelessDevice?: string;

    /**
     * The name of a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFuotaTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnFuotaTaskProps`
 *
 * @returns the result of the validation.
 */
function CfnFuotaTaskPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associateMulticastGroup', cdk.validateString)(properties.associateMulticastGroup));
    errors.collect(cdk.propertyValidator('associateWirelessDevice', cdk.validateString)(properties.associateWirelessDevice));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disassociateMulticastGroup', cdk.validateString)(properties.disassociateMulticastGroup));
    errors.collect(cdk.propertyValidator('disassociateWirelessDevice', cdk.validateString)(properties.disassociateWirelessDevice));
    errors.collect(cdk.propertyValidator('firmwareUpdateImage', cdk.requiredValidator)(properties.firmwareUpdateImage));
    errors.collect(cdk.propertyValidator('firmwareUpdateImage', cdk.validateString)(properties.firmwareUpdateImage));
    errors.collect(cdk.propertyValidator('firmwareUpdateRole', cdk.requiredValidator)(properties.firmwareUpdateRole));
    errors.collect(cdk.propertyValidator('firmwareUpdateRole', cdk.validateString)(properties.firmwareUpdateRole));
    errors.collect(cdk.propertyValidator('loRaWan', cdk.requiredValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('loRaWan', CfnFuotaTask_LoRaWANPropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFuotaTaskProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::FuotaTask` resource
 *
 * @param properties - the TypeScript properties of a `CfnFuotaTaskProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::FuotaTask` resource.
 */
// @ts-ignore TS6133
function cfnFuotaTaskPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFuotaTaskPropsValidator(properties).assertSuccess();
    return {
        FirmwareUpdateImage: cdk.stringToCloudFormation(properties.firmwareUpdateImage),
        FirmwareUpdateRole: cdk.stringToCloudFormation(properties.firmwareUpdateRole),
        LoRaWAN: cfnFuotaTaskLoRaWANPropertyToCloudFormation(properties.loRaWan),
        AssociateMulticastGroup: cdk.stringToCloudFormation(properties.associateMulticastGroup),
        AssociateWirelessDevice: cdk.stringToCloudFormation(properties.associateWirelessDevice),
        Description: cdk.stringToCloudFormation(properties.description),
        DisassociateMulticastGroup: cdk.stringToCloudFormation(properties.disassociateMulticastGroup),
        DisassociateWirelessDevice: cdk.stringToCloudFormation(properties.disassociateWirelessDevice),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFuotaTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFuotaTaskProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFuotaTaskProps>();
    ret.addPropertyResult('firmwareUpdateImage', 'FirmwareUpdateImage', cfn_parse.FromCloudFormation.getString(properties.FirmwareUpdateImage));
    ret.addPropertyResult('firmwareUpdateRole', 'FirmwareUpdateRole', cfn_parse.FromCloudFormation.getString(properties.FirmwareUpdateRole));
    ret.addPropertyResult('loRaWan', 'LoRaWAN', CfnFuotaTaskLoRaWANPropertyFromCloudFormation(properties.LoRaWAN));
    ret.addPropertyResult('associateMulticastGroup', 'AssociateMulticastGroup', properties.AssociateMulticastGroup != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateMulticastGroup) : undefined);
    ret.addPropertyResult('associateWirelessDevice', 'AssociateWirelessDevice', properties.AssociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateWirelessDevice) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('disassociateMulticastGroup', 'DisassociateMulticastGroup', properties.DisassociateMulticastGroup != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateMulticastGroup) : undefined);
    ret.addPropertyResult('disassociateWirelessDevice', 'DisassociateWirelessDevice', properties.DisassociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateWirelessDevice) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::FuotaTask`
 *
 * A FUOTA task.
 *
 * @cloudformationResource AWS::IoTWireless::FuotaTask
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html
 */
export class CfnFuotaTask extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::FuotaTask";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFuotaTask {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFuotaTaskPropsFromCloudFormation(resourceProperties);
        const ret = new CfnFuotaTask(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of a FUOTA task
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The status of a FUOTA task.
     * @cloudformationAttribute FuotaTaskStatus
     */
    public readonly attrFuotaTaskStatus: string;

    /**
     * The ID of a FUOTA task.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Start time of a FUOTA task.
     * @cloudformationAttribute LoRaWAN.StartTime
     */
    public readonly attrLoRaWanStartTime: string;

    /**
     * The S3 URI points to a firmware update image that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdateimage
     */
    public firmwareUpdateImage: string;

    /**
     * The firmware update role that is to be used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-firmwareupdaterole
     */
    public firmwareUpdateRole: string;

    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-lorawan
     */
    public loRaWan: CfnFuotaTask.LoRaWANProperty | cdk.IResolvable;

    /**
     * The ID of the multicast group to associate with a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatemulticastgroup
     */
    public associateMulticastGroup: string | undefined;

    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-associatewirelessdevice
     */
    public associateWirelessDevice: string | undefined;

    /**
     * The description of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-description
     */
    public description: string | undefined;

    /**
     * The ID of the multicast group to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatemulticastgroup
     */
    public disassociateMulticastGroup: string | undefined;

    /**
     * The ID of the wireless device to disassociate from a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-disassociatewirelessdevice
     */
    public disassociateWirelessDevice: string | undefined;

    /**
     * The name of a FUOTA task.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-fuotatask.html#cfn-iotwireless-fuotatask-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::FuotaTask`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFuotaTaskProps) {
        super(scope, id, { type: CfnFuotaTask.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'firmwareUpdateImage', this);
        cdk.requireProperty(props, 'firmwareUpdateRole', this);
        cdk.requireProperty(props, 'loRaWan', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrFuotaTaskStatus = cdk.Token.asString(this.getAtt('FuotaTaskStatus', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanStartTime = cdk.Token.asString(this.getAtt('LoRaWAN.StartTime', cdk.ResolutionTypeHint.STRING));

        this.firmwareUpdateImage = props.firmwareUpdateImage;
        this.firmwareUpdateRole = props.firmwareUpdateRole;
        this.loRaWan = props.loRaWan;
        this.associateMulticastGroup = props.associateMulticastGroup;
        this.associateWirelessDevice = props.associateWirelessDevice;
        this.description = props.description;
        this.disassociateMulticastGroup = props.disassociateMulticastGroup;
        this.disassociateWirelessDevice = props.disassociateWirelessDevice;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::FuotaTask", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFuotaTask.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            firmwareUpdateImage: this.firmwareUpdateImage,
            firmwareUpdateRole: this.firmwareUpdateRole,
            loRaWan: this.loRaWan,
            associateMulticastGroup: this.associateMulticastGroup,
            associateWirelessDevice: this.associateWirelessDevice,
            description: this.description,
            disassociateMulticastGroup: this.disassociateMulticastGroup,
            disassociateWirelessDevice: this.disassociateWirelessDevice,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFuotaTaskPropsToCloudFormation(props);
    }
}

export namespace CfnFuotaTask {
    /**
     * The LoRaWAN information used with a FUOTA task.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html
     */
    export interface LoRaWANProperty {
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-rfregion
         */
        readonly rfRegion: string;
        /**
         * Start time of a FUOTA task.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-fuotatask-lorawan.html#cfn-iotwireless-fuotatask-lorawan-starttime
         */
        readonly startTime?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the result of the validation.
 */
function CfnFuotaTask_LoRaWANPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('rfRegion', cdk.requiredValidator)(properties.rfRegion));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.validateString)(properties.rfRegion));
    errors.collect(cdk.propertyValidator('startTime', cdk.validateString)(properties.startTime));
    return errors.wrap('supplied properties not correct for "LoRaWANProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::FuotaTask.LoRaWAN` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::FuotaTask.LoRaWAN` resource.
 */
// @ts-ignore TS6133
function cfnFuotaTaskLoRaWANPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFuotaTask_LoRaWANPropertyValidator(properties).assertSuccess();
    return {
        RfRegion: cdk.stringToCloudFormation(properties.rfRegion),
        StartTime: cdk.stringToCloudFormation(properties.startTime),
    };
}

// @ts-ignore TS6133
function CfnFuotaTaskLoRaWANPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFuotaTask.LoRaWANProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFuotaTask.LoRaWANProperty>();
    ret.addPropertyResult('rfRegion', 'RfRegion', cfn_parse.FromCloudFormation.getString(properties.RfRegion));
    ret.addPropertyResult('startTime', 'StartTime', properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMulticastGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export interface CfnMulticastGroupProps {

    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-lorawan
     */
    readonly loRaWan: CfnMulticastGroup.LoRaWANProperty | cdk.IResolvable;

    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-associatewirelessdevice
     */
    readonly associateWirelessDevice?: string;

    /**
     * The description of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-description
     */
    readonly description?: string;

    /**
     * The ID of the wireless device to disassociate from a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-disassociatewirelessdevice
     */
    readonly disassociateWirelessDevice?: string;

    /**
     * The name of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnMulticastGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnMulticastGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnMulticastGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('associateWirelessDevice', cdk.validateString)(properties.associateWirelessDevice));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('disassociateWirelessDevice', cdk.validateString)(properties.disassociateWirelessDevice));
    errors.collect(cdk.propertyValidator('loRaWan', cdk.requiredValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('loRaWan', CfnMulticastGroup_LoRaWANPropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnMulticastGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::MulticastGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnMulticastGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::MulticastGroup` resource.
 */
// @ts-ignore TS6133
function cfnMulticastGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMulticastGroupPropsValidator(properties).assertSuccess();
    return {
        LoRaWAN: cfnMulticastGroupLoRaWANPropertyToCloudFormation(properties.loRaWan),
        AssociateWirelessDevice: cdk.stringToCloudFormation(properties.associateWirelessDevice),
        Description: cdk.stringToCloudFormation(properties.description),
        DisassociateWirelessDevice: cdk.stringToCloudFormation(properties.disassociateWirelessDevice),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnMulticastGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMulticastGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMulticastGroupProps>();
    ret.addPropertyResult('loRaWan', 'LoRaWAN', CfnMulticastGroupLoRaWANPropertyFromCloudFormation(properties.LoRaWAN));
    ret.addPropertyResult('associateWirelessDevice', 'AssociateWirelessDevice', properties.AssociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.AssociateWirelessDevice) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('disassociateWirelessDevice', 'DisassociateWirelessDevice', properties.DisassociateWirelessDevice != null ? cfn_parse.FromCloudFormation.getString(properties.DisassociateWirelessDevice) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::MulticastGroup`
 *
 * A multicast group.
 *
 * @cloudformationResource AWS::IoTWireless::MulticastGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html
 */
export class CfnMulticastGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::MulticastGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMulticastGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMulticastGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnMulticastGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the multicast group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the multicast group.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The number of devices that are associated to the multicast group.
     * @cloudformationAttribute LoRaWAN.NumberOfDevicesInGroup
     */
    public readonly attrLoRaWanNumberOfDevicesInGroup: number;

    /**
     * The number of devices that are requested to be associated with the multicast group.
     * @cloudformationAttribute LoRaWAN.NumberOfDevicesRequested
     */
    public readonly attrLoRaWanNumberOfDevicesRequested: number;

    /**
     * The status of a multicast group.
     * @cloudformationAttribute Status
     */
    public readonly attrStatus: string;

    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-lorawan
     */
    public loRaWan: CfnMulticastGroup.LoRaWANProperty | cdk.IResolvable;

    /**
     * The ID of the wireless device to associate with a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-associatewirelessdevice
     */
    public associateWirelessDevice: string | undefined;

    /**
     * The description of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-description
     */
    public description: string | undefined;

    /**
     * The ID of the wireless device to disassociate from a multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-disassociatewirelessdevice
     */
    public disassociateWirelessDevice: string | undefined;

    /**
     * The name of the multicast group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-multicastgroup.html#cfn-iotwireless-multicastgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::MulticastGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMulticastGroupProps) {
        super(scope, id, { type: CfnMulticastGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'loRaWan', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanNumberOfDevicesInGroup = cdk.Token.asNumber(this.getAtt('LoRaWAN.NumberOfDevicesInGroup', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanNumberOfDevicesRequested = cdk.Token.asNumber(this.getAtt('LoRaWAN.NumberOfDevicesRequested', cdk.ResolutionTypeHint.NUMBER));
        this.attrStatus = cdk.Token.asString(this.getAtt('Status', cdk.ResolutionTypeHint.STRING));

        this.loRaWan = props.loRaWan;
        this.associateWirelessDevice = props.associateWirelessDevice;
        this.description = props.description;
        this.disassociateWirelessDevice = props.disassociateWirelessDevice;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::MulticastGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMulticastGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            loRaWan: this.loRaWan,
            associateWirelessDevice: this.associateWirelessDevice,
            description: this.description,
            disassociateWirelessDevice: this.disassociateWirelessDevice,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMulticastGroupPropsToCloudFormation(props);
    }
}

export namespace CfnMulticastGroup {
    /**
     * The LoRaWAN information that is to be used with the multicast group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html
     */
    export interface LoRaWANProperty {
        /**
         * DlClass for LoRaWAN. Valid values are ClassB and ClassC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-dlclass
         */
        readonly dlClass: string;
        /**
         * Number of devices that are associated to the multicast group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesingroup
         */
        readonly numberOfDevicesInGroup?: number;
        /**
         * Number of devices that are requested to be associated with the multicast group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-numberofdevicesrequested
         */
        readonly numberOfDevicesRequested?: number;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-multicastgroup-lorawan.html#cfn-iotwireless-multicastgroup-lorawan-rfregion
         */
        readonly rfRegion: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the result of the validation.
 */
function CfnMulticastGroup_LoRaWANPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dlClass', cdk.requiredValidator)(properties.dlClass));
    errors.collect(cdk.propertyValidator('dlClass', cdk.validateString)(properties.dlClass));
    errors.collect(cdk.propertyValidator('numberOfDevicesInGroup', cdk.validateNumber)(properties.numberOfDevicesInGroup));
    errors.collect(cdk.propertyValidator('numberOfDevicesRequested', cdk.validateNumber)(properties.numberOfDevicesRequested));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.requiredValidator)(properties.rfRegion));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.validateString)(properties.rfRegion));
    return errors.wrap('supplied properties not correct for "LoRaWANProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::MulticastGroup.LoRaWAN` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::MulticastGroup.LoRaWAN` resource.
 */
// @ts-ignore TS6133
function cfnMulticastGroupLoRaWANPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMulticastGroup_LoRaWANPropertyValidator(properties).assertSuccess();
    return {
        DlClass: cdk.stringToCloudFormation(properties.dlClass),
        NumberOfDevicesInGroup: cdk.numberToCloudFormation(properties.numberOfDevicesInGroup),
        NumberOfDevicesRequested: cdk.numberToCloudFormation(properties.numberOfDevicesRequested),
        RfRegion: cdk.stringToCloudFormation(properties.rfRegion),
    };
}

// @ts-ignore TS6133
function CfnMulticastGroupLoRaWANPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMulticastGroup.LoRaWANProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMulticastGroup.LoRaWANProperty>();
    ret.addPropertyResult('dlClass', 'DlClass', cfn_parse.FromCloudFormation.getString(properties.DlClass));
    ret.addPropertyResult('numberOfDevicesInGroup', 'NumberOfDevicesInGroup', properties.NumberOfDevicesInGroup != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDevicesInGroup) : undefined);
    ret.addPropertyResult('numberOfDevicesRequested', 'NumberOfDevicesRequested', properties.NumberOfDevicesRequested != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDevicesRequested) : undefined);
    ret.addPropertyResult('rfRegion', 'RfRegion', cfn_parse.FromCloudFormation.getString(properties.RfRegion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnNetworkAnalyzerConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export interface CfnNetworkAnalyzerConfigurationProps {

    /**
     * Name of the network analyzer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-name
     */
    readonly name: string;

    /**
     * The description of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-description
     */
    readonly description?: string;

    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * Trace content for your wireless gateway and wireless device resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent
     */
    readonly traceContent?: any | cdk.IResolvable;

    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the `WirelessDeviceId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessdevices
     */
    readonly wirelessDevices?: string[];

    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the `WirelessGatewayId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessgateways
     */
    readonly wirelessGateways?: string[];
}

/**
 * Determine whether the given properties match those of a `CfnNetworkAnalyzerConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnNetworkAnalyzerConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnNetworkAnalyzerConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('traceContent', cdk.validateObject)(properties.traceContent));
    errors.collect(cdk.propertyValidator('wirelessDevices', cdk.listValidator(cdk.validateString))(properties.wirelessDevices));
    errors.collect(cdk.propertyValidator('wirelessGateways', cdk.listValidator(cdk.validateString))(properties.wirelessGateways));
    return errors.wrap('supplied properties not correct for "CfnNetworkAnalyzerConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::NetworkAnalyzerConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnNetworkAnalyzerConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::NetworkAnalyzerConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnNetworkAnalyzerConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNetworkAnalyzerConfigurationPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TraceContent: cdk.objectToCloudFormation(properties.traceContent),
        WirelessDevices: cdk.listMapper(cdk.stringToCloudFormation)(properties.wirelessDevices),
        WirelessGateways: cdk.listMapper(cdk.stringToCloudFormation)(properties.wirelessGateways),
    };
}

// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNetworkAnalyzerConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkAnalyzerConfigurationProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('traceContent', 'TraceContent', properties.TraceContent != null ? cfn_parse.FromCloudFormation.getAny(properties.TraceContent) : undefined);
    ret.addPropertyResult('wirelessDevices', 'WirelessDevices', properties.WirelessDevices != null ? cfn_parse.FromCloudFormation.getStringArray(properties.WirelessDevices) : undefined);
    ret.addPropertyResult('wirelessGateways', 'WirelessGateways', properties.WirelessGateways != null ? cfn_parse.FromCloudFormation.getStringArray(properties.WirelessGateways) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::NetworkAnalyzerConfiguration`
 *
 * Network analyzer configuration.
 *
 * @cloudformationResource AWS::IoTWireless::NetworkAnalyzerConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html
 */
export class CfnNetworkAnalyzerConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::NetworkAnalyzerConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNetworkAnalyzerConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNetworkAnalyzerConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNetworkAnalyzerConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Name of the network analyzer configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-name
     */
    public name: string;

    /**
     * The description of the resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-description
     */
    public description: string | undefined;

    /**
     * The tags to attach to the specified resource. Tags are metadata that you can use to manage a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Trace content for your wireless gateway and wireless device resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent
     */
    public traceContent: any | cdk.IResolvable | undefined;

    /**
     * Wireless device resources to add to the network analyzer configuration. Provide the `WirelessDeviceId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessdevices
     */
    public wirelessDevices: string[] | undefined;

    /**
     * Wireless gateway resources to add to the network analyzer configuration. Provide the `WirelessGatewayId` of the resource to add in the input array.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-networkanalyzerconfiguration.html#cfn-iotwireless-networkanalyzerconfiguration-wirelessgateways
     */
    public wirelessGateways: string[] | undefined;

    /**
     * Create a new `AWS::IoTWireless::NetworkAnalyzerConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNetworkAnalyzerConfigurationProps) {
        super(scope, id, { type: CfnNetworkAnalyzerConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::NetworkAnalyzerConfiguration", props.tags, { tagPropertyName: 'tags' });
        this.traceContent = props.traceContent;
        this.wirelessDevices = props.wirelessDevices;
        this.wirelessGateways = props.wirelessGateways;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNetworkAnalyzerConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            description: this.description,
            tags: this.tags.renderTags(),
            traceContent: this.traceContent,
            wirelessDevices: this.wirelessDevices,
            wirelessGateways: this.wirelessGateways,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNetworkAnalyzerConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnNetworkAnalyzerConfiguration {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html
     */
    export interface TraceContentProperty {
        /**
         * `CfnNetworkAnalyzerConfiguration.TraceContentProperty.LogLevel`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-loglevel
         */
        readonly logLevel?: string;
        /**
         * `CfnNetworkAnalyzerConfiguration.TraceContentProperty.WirelessDeviceFrameInfo`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-networkanalyzerconfiguration-tracecontent.html#cfn-iotwireless-networkanalyzerconfiguration-tracecontent-wirelessdeviceframeinfo
         */
        readonly wirelessDeviceFrameInfo?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TraceContentProperty`
 *
 * @param properties - the TypeScript properties of a `TraceContentProperty`
 *
 * @returns the result of the validation.
 */
function CfnNetworkAnalyzerConfiguration_TraceContentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('logLevel', cdk.validateString)(properties.logLevel));
    errors.collect(cdk.propertyValidator('wirelessDeviceFrameInfo', cdk.validateString)(properties.wirelessDeviceFrameInfo));
    return errors.wrap('supplied properties not correct for "TraceContentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::NetworkAnalyzerConfiguration.TraceContent` resource
 *
 * @param properties - the TypeScript properties of a `TraceContentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::NetworkAnalyzerConfiguration.TraceContent` resource.
 */
// @ts-ignore TS6133
function cfnNetworkAnalyzerConfigurationTraceContentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNetworkAnalyzerConfiguration_TraceContentPropertyValidator(properties).assertSuccess();
    return {
        LogLevel: cdk.stringToCloudFormation(properties.logLevel),
        WirelessDeviceFrameInfo: cdk.stringToCloudFormation(properties.wirelessDeviceFrameInfo),
    };
}

// @ts-ignore TS6133
function CfnNetworkAnalyzerConfigurationTraceContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNetworkAnalyzerConfiguration.TraceContentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNetworkAnalyzerConfiguration.TraceContentProperty>();
    ret.addPropertyResult('logLevel', 'LogLevel', properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined);
    ret.addPropertyResult('wirelessDeviceFrameInfo', 'WirelessDeviceFrameInfo', properties.WirelessDeviceFrameInfo != null ? cfn_parse.FromCloudFormation.getString(properties.WirelessDeviceFrameInfo) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPartnerAccount`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export interface CfnPartnerAccountProps {

    /**
     * `AWS::IoTWireless::PartnerAccount.AccountLinked`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-accountlinked
     */
    readonly accountLinked?: boolean | cdk.IResolvable;

    /**
     * The ID of the partner account to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partneraccountid
     */
    readonly partnerAccountId?: string;

    /**
     * `AWS::IoTWireless::PartnerAccount.PartnerType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partnertype
     */
    readonly partnerType?: string;

    /**
     * The Sidewalk account credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalk
     */
    readonly sidewalk?: CfnPartnerAccount.SidewalkAccountInfoProperty | cdk.IResolvable;

    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkResponse`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkresponse
     */
    readonly sidewalkResponse?: CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty | cdk.IResolvable;

    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkUpdate`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkupdate
     */
    readonly sidewalkUpdate?: CfnPartnerAccount.SidewalkUpdateAccountProperty | cdk.IResolvable;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnPartnerAccountProps`
 *
 * @param properties - the TypeScript properties of a `CfnPartnerAccountProps`
 *
 * @returns the result of the validation.
 */
function CfnPartnerAccountPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountLinked', cdk.validateBoolean)(properties.accountLinked));
    errors.collect(cdk.propertyValidator('partnerAccountId', cdk.validateString)(properties.partnerAccountId));
    errors.collect(cdk.propertyValidator('partnerType', cdk.validateString)(properties.partnerType));
    errors.collect(cdk.propertyValidator('sidewalk', CfnPartnerAccount_SidewalkAccountInfoPropertyValidator)(properties.sidewalk));
    errors.collect(cdk.propertyValidator('sidewalkResponse', CfnPartnerAccount_SidewalkAccountInfoWithFingerprintPropertyValidator)(properties.sidewalkResponse));
    errors.collect(cdk.propertyValidator('sidewalkUpdate', CfnPartnerAccount_SidewalkUpdateAccountPropertyValidator)(properties.sidewalkUpdate));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnPartnerAccountProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount` resource
 *
 * @param properties - the TypeScript properties of a `CfnPartnerAccountProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount` resource.
 */
// @ts-ignore TS6133
function cfnPartnerAccountPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPartnerAccountPropsValidator(properties).assertSuccess();
    return {
        AccountLinked: cdk.booleanToCloudFormation(properties.accountLinked),
        PartnerAccountId: cdk.stringToCloudFormation(properties.partnerAccountId),
        PartnerType: cdk.stringToCloudFormation(properties.partnerType),
        Sidewalk: cfnPartnerAccountSidewalkAccountInfoPropertyToCloudFormation(properties.sidewalk),
        SidewalkResponse: cfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyToCloudFormation(properties.sidewalkResponse),
        SidewalkUpdate: cfnPartnerAccountSidewalkUpdateAccountPropertyToCloudFormation(properties.sidewalkUpdate),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnPartnerAccountPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnerAccountProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccountProps>();
    ret.addPropertyResult('accountLinked', 'AccountLinked', properties.AccountLinked != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AccountLinked) : undefined);
    ret.addPropertyResult('partnerAccountId', 'PartnerAccountId', properties.PartnerAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerAccountId) : undefined);
    ret.addPropertyResult('partnerType', 'PartnerType', properties.PartnerType != null ? cfn_parse.FromCloudFormation.getString(properties.PartnerType) : undefined);
    ret.addPropertyResult('sidewalk', 'Sidewalk', properties.Sidewalk != null ? CfnPartnerAccountSidewalkAccountInfoPropertyFromCloudFormation(properties.Sidewalk) : undefined);
    ret.addPropertyResult('sidewalkResponse', 'SidewalkResponse', properties.SidewalkResponse != null ? CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyFromCloudFormation(properties.SidewalkResponse) : undefined);
    ret.addPropertyResult('sidewalkUpdate', 'SidewalkUpdate', properties.SidewalkUpdate != null ? CfnPartnerAccountSidewalkUpdateAccountPropertyFromCloudFormation(properties.SidewalkUpdate) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::PartnerAccount`
 *
 * A partner account. If `PartnerAccountId` and `PartnerType` are `null` , returns all partner accounts.
 *
 * @cloudformationResource AWS::IoTWireless::PartnerAccount
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html
 */
export class CfnPartnerAccount extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::PartnerAccount";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPartnerAccount {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPartnerAccountPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPartnerAccount(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     *
     * @cloudformationAttribute Fingerprint
     */
    public readonly attrFingerprint: string;

    /**
     * `AWS::IoTWireless::PartnerAccount.AccountLinked`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-accountlinked
     */
    public accountLinked: boolean | cdk.IResolvable | undefined;

    /**
     * The ID of the partner account to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partneraccountid
     */
    public partnerAccountId: string | undefined;

    /**
     * `AWS::IoTWireless::PartnerAccount.PartnerType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-partnertype
     */
    public partnerType: string | undefined;

    /**
     * The Sidewalk account credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalk
     */
    public sidewalk: CfnPartnerAccount.SidewalkAccountInfoProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkResponse`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkresponse
     */
    public sidewalkResponse: CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::IoTWireless::PartnerAccount.SidewalkUpdate`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-sidewalkupdate
     */
    public sidewalkUpdate: CfnPartnerAccount.SidewalkUpdateAccountProperty | cdk.IResolvable | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-partneraccount.html#cfn-iotwireless-partneraccount-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::PartnerAccount`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPartnerAccountProps = {}) {
        super(scope, id, { type: CfnPartnerAccount.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrFingerprint = cdk.Token.asString(this.getAtt('Fingerprint', cdk.ResolutionTypeHint.STRING));

        this.accountLinked = props.accountLinked;
        this.partnerAccountId = props.partnerAccountId;
        this.partnerType = props.partnerType;
        this.sidewalk = props.sidewalk;
        this.sidewalkResponse = props.sidewalkResponse;
        this.sidewalkUpdate = props.sidewalkUpdate;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::PartnerAccount", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPartnerAccount.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            accountLinked: this.accountLinked,
            partnerAccountId: this.partnerAccountId,
            partnerType: this.partnerType,
            sidewalk: this.sidewalk,
            sidewalkResponse: this.sidewalkResponse,
            sidewalkUpdate: this.sidewalkUpdate,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPartnerAccountPropsToCloudFormation(props);
    }
}

export namespace CfnPartnerAccount {
    /**
     * Information about a Sidewalk account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html
     */
    export interface SidewalkAccountInfoProperty {
        /**
         * The Sidewalk application server private key. The application server private key is a secret key, which you should handle in a similar way as you would an application password. You can protect the application server private key by storing the value in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfo.html#cfn-iotwireless-partneraccount-sidewalkaccountinfo-appserverprivatekey
         */
        readonly appServerPrivateKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `SidewalkAccountInfoProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnPartnerAccount_SidewalkAccountInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appServerPrivateKey', cdk.requiredValidator)(properties.appServerPrivateKey));
    errors.collect(cdk.propertyValidator('appServerPrivateKey', cdk.validateString)(properties.appServerPrivateKey));
    return errors.wrap('supplied properties not correct for "SidewalkAccountInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkAccountInfo` resource
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkAccountInfo` resource.
 */
// @ts-ignore TS6133
function cfnPartnerAccountSidewalkAccountInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPartnerAccount_SidewalkAccountInfoPropertyValidator(properties).assertSuccess();
    return {
        AppServerPrivateKey: cdk.stringToCloudFormation(properties.appServerPrivateKey),
    };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnerAccount.SidewalkAccountInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkAccountInfoProperty>();
    ret.addPropertyResult('appServerPrivateKey', 'AppServerPrivateKey', cfn_parse.FromCloudFormation.getString(properties.AppServerPrivateKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPartnerAccount {
    /**
     * Information about a Sidewalk account.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html
     */
    export interface SidewalkAccountInfoWithFingerprintProperty {
        /**
         * The Sidewalk Amazon ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-amazonid
         */
        readonly amazonId?: string;
        /**
         * The Amazon Resource Name (ARN) of the resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-arn
         */
        readonly arn?: string;
        /**
         * The fingerprint of the Sidewalk application server private key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint.html#cfn-iotwireless-partneraccount-sidewalkaccountinfowithfingerprint-fingerprint
         */
        readonly fingerprint?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SidewalkAccountInfoWithFingerprintProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoWithFingerprintProperty`
 *
 * @returns the result of the validation.
 */
function CfnPartnerAccount_SidewalkAccountInfoWithFingerprintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amazonId', cdk.validateString)(properties.amazonId));
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    errors.collect(cdk.propertyValidator('fingerprint', cdk.validateString)(properties.fingerprint));
    return errors.wrap('supplied properties not correct for "SidewalkAccountInfoWithFingerprintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkAccountInfoWithFingerprint` resource
 *
 * @param properties - the TypeScript properties of a `SidewalkAccountInfoWithFingerprintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkAccountInfoWithFingerprint` resource.
 */
// @ts-ignore TS6133
function cfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPartnerAccount_SidewalkAccountInfoWithFingerprintPropertyValidator(properties).assertSuccess();
    return {
        AmazonId: cdk.stringToCloudFormation(properties.amazonId),
        Arn: cdk.stringToCloudFormation(properties.arn),
        Fingerprint: cdk.stringToCloudFormation(properties.fingerprint),
    };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkAccountInfoWithFingerprintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkAccountInfoWithFingerprintProperty>();
    ret.addPropertyResult('amazonId', 'AmazonId', properties.AmazonId != null ? cfn_parse.FromCloudFormation.getString(properties.AmazonId) : undefined);
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addPropertyResult('fingerprint', 'Fingerprint', properties.Fingerprint != null ? cfn_parse.FromCloudFormation.getString(properties.Fingerprint) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPartnerAccount {
    /**
     * Sidewalk update.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html
     */
    export interface SidewalkUpdateAccountProperty {
        /**
         * The new Sidewalk application server private key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-partneraccount-sidewalkupdateaccount.html#cfn-iotwireless-partneraccount-sidewalkupdateaccount-appserverprivatekey
         */
        readonly appServerPrivateKey?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SidewalkUpdateAccountProperty`
 *
 * @param properties - the TypeScript properties of a `SidewalkUpdateAccountProperty`
 *
 * @returns the result of the validation.
 */
function CfnPartnerAccount_SidewalkUpdateAccountPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appServerPrivateKey', cdk.validateString)(properties.appServerPrivateKey));
    return errors.wrap('supplied properties not correct for "SidewalkUpdateAccountProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkUpdateAccount` resource
 *
 * @param properties - the TypeScript properties of a `SidewalkUpdateAccountProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::PartnerAccount.SidewalkUpdateAccount` resource.
 */
// @ts-ignore TS6133
function cfnPartnerAccountSidewalkUpdateAccountPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPartnerAccount_SidewalkUpdateAccountPropertyValidator(properties).assertSuccess();
    return {
        AppServerPrivateKey: cdk.stringToCloudFormation(properties.appServerPrivateKey),
    };
}

// @ts-ignore TS6133
function CfnPartnerAccountSidewalkUpdateAccountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnerAccount.SidewalkUpdateAccountProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnerAccount.SidewalkUpdateAccountProperty>();
    ret.addPropertyResult('appServerPrivateKey', 'AppServerPrivateKey', properties.AppServerPrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.AppServerPrivateKey) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnServiceProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export interface CfnServiceProfileProps {

    /**
     * LoRaWAN service profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-lorawan
     */
    readonly loRaWan?: CfnServiceProfile.LoRaWANServiceProfileProperty | cdk.IResolvable;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnServiceProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnServiceProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('loRaWan', CfnServiceProfile_LoRaWANServiceProfilePropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnServiceProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::ServiceProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnServiceProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::ServiceProfile` resource.
 */
// @ts-ignore TS6133
function cfnServiceProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServiceProfilePropsValidator(properties).assertSuccess();
    return {
        LoRaWAN: cfnServiceProfileLoRaWANServiceProfilePropertyToCloudFormation(properties.loRaWan),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnServiceProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProfileProps>();
    ret.addPropertyResult('loRaWan', 'LoRaWAN', properties.LoRaWAN != null ? CfnServiceProfileLoRaWANServiceProfilePropertyFromCloudFormation(properties.LoRaWAN) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::ServiceProfile`
 *
 * Creates a new service profile.
 *
 * @cloudformationResource AWS::IoTWireless::ServiceProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html
 */
export class CfnServiceProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::ServiceProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnServiceProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnServiceProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the service profile created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the service profile created.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The ChannelMask value.
     * @cloudformationAttribute LoRaWAN.ChannelMask
     */
    public readonly attrLoRaWanChannelMask: string;

    /**
     * The DevStatusReqFreq value.
     * @cloudformationAttribute LoRaWAN.DevStatusReqFreq
     */
    public readonly attrLoRaWanDevStatusReqFreq: number;

    /**
     * The DLBucketSize value.
     * @cloudformationAttribute LoRaWAN.DlBucketSize
     */
    public readonly attrLoRaWanDlBucketSize: number;

    /**
     * The DLRate value.
     * @cloudformationAttribute LoRaWAN.DlRate
     */
    public readonly attrLoRaWanDlRate: number;

    /**
     * The DLRatePolicy value.
     * @cloudformationAttribute LoRaWAN.DlRatePolicy
     */
    public readonly attrLoRaWanDlRatePolicy: string;

    /**
     * The DRMax value.
     * @cloudformationAttribute LoRaWAN.DrMax
     */
    public readonly attrLoRaWanDrMax: number;

    /**
     * The DRMin value.
     * @cloudformationAttribute LoRaWAN.DrMin
     */
    public readonly attrLoRaWanDrMin: number;

    /**
     * The HRAllowed value that describes whether handover roaming is allowed.
     * @cloudformationAttribute LoRaWAN.HrAllowed
     */
    public readonly attrLoRaWanHrAllowed: cdk.IResolvable;

    /**
     * The MinGwDiversity value.
     * @cloudformationAttribute LoRaWAN.MinGwDiversity
     */
    public readonly attrLoRaWanMinGwDiversity: number;

    /**
     * The NwkGeoLoc value.
     * @cloudformationAttribute LoRaWAN.NwkGeoLoc
     */
    public readonly attrLoRaWanNwkGeoLoc: cdk.IResolvable;

    /**
     * The PRAllowed value that describes whether passive roaming is allowed.
     * @cloudformationAttribute LoRaWAN.PrAllowed
     */
    public readonly attrLoRaWanPrAllowed: cdk.IResolvable;

    /**
     * The RAAllowed value that describes whether roaming activation is allowed.
     * @cloudformationAttribute LoRaWAN.RaAllowed
     */
    public readonly attrLoRaWanRaAllowed: cdk.IResolvable;

    /**
     * The ReportDevStatusBattery value.
     * @cloudformationAttribute LoRaWAN.ReportDevStatusBattery
     */
    public readonly attrLoRaWanReportDevStatusBattery: cdk.IResolvable;

    /**
     * The ReportDevStatusMargin value.
     * @cloudformationAttribute LoRaWAN.ReportDevStatusMargin
     */
    public readonly attrLoRaWanReportDevStatusMargin: cdk.IResolvable;

    /**
     * The TargetPer value.
     * @cloudformationAttribute LoRaWAN.TargetPer
     */
    public readonly attrLoRaWanTargetPer: number;

    /**
     * The UlBucketSize value.
     * @cloudformationAttribute LoRaWAN.UlBucketSize
     */
    public readonly attrLoRaWanUlBucketSize: number;

    /**
     * The ULRate value.
     * @cloudformationAttribute LoRaWAN.UlRate
     */
    public readonly attrLoRaWanUlRate: number;

    /**
     * The ULRatePolicy value.
     * @cloudformationAttribute LoRaWAN.UlRatePolicy
     */
    public readonly attrLoRaWanUlRatePolicy: string;

    /**
     *
     * @cloudformationAttribute LoRaWANResponse
     */
    public readonly attrLoRaWanResponse: cdk.IResolvable;

    /**
     * LoRaWAN service profile object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-lorawan
     */
    public loRaWan: CfnServiceProfile.LoRaWANServiceProfileProperty | cdk.IResolvable | undefined;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-serviceprofile.html#cfn-iotwireless-serviceprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTWireless::ServiceProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServiceProfileProps = {}) {
        super(scope, id, { type: CfnServiceProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanChannelMask = cdk.Token.asString(this.getAtt('LoRaWAN.ChannelMask', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanDevStatusReqFreq = cdk.Token.asNumber(this.getAtt('LoRaWAN.DevStatusReqFreq', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanDlBucketSize = cdk.Token.asNumber(this.getAtt('LoRaWAN.DlBucketSize', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanDlRate = cdk.Token.asNumber(this.getAtt('LoRaWAN.DlRate', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanDlRatePolicy = cdk.Token.asString(this.getAtt('LoRaWAN.DlRatePolicy', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanDrMax = cdk.Token.asNumber(this.getAtt('LoRaWAN.DrMax', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanDrMin = cdk.Token.asNumber(this.getAtt('LoRaWAN.DrMin', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanHrAllowed = this.getAtt('LoRaWAN.HrAllowed', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanMinGwDiversity = cdk.Token.asNumber(this.getAtt('LoRaWAN.MinGwDiversity', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanNwkGeoLoc = this.getAtt('LoRaWAN.NwkGeoLoc', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanPrAllowed = this.getAtt('LoRaWAN.PrAllowed', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanRaAllowed = this.getAtt('LoRaWAN.RaAllowed', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanReportDevStatusBattery = this.getAtt('LoRaWAN.ReportDevStatusBattery', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanReportDevStatusMargin = this.getAtt('LoRaWAN.ReportDevStatusMargin', cdk.ResolutionTypeHint.STRING);
        this.attrLoRaWanTargetPer = cdk.Token.asNumber(this.getAtt('LoRaWAN.TargetPer', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanUlBucketSize = cdk.Token.asNumber(this.getAtt('LoRaWAN.UlBucketSize', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanUlRate = cdk.Token.asNumber(this.getAtt('LoRaWAN.UlRate', cdk.ResolutionTypeHint.NUMBER));
        this.attrLoRaWanUlRatePolicy = cdk.Token.asString(this.getAtt('LoRaWAN.UlRatePolicy', cdk.ResolutionTypeHint.STRING));
        this.attrLoRaWanResponse = this.getAtt('LoRaWANResponse', cdk.ResolutionTypeHint.STRING);

        this.loRaWan = props.loRaWan;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::ServiceProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            loRaWan: this.loRaWan,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnServiceProfilePropsToCloudFormation(props);
    }
}

export namespace CfnServiceProfile {
    /**
     * LoRaWANServiceProfile object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html
     */
    export interface LoRaWANServiceProfileProperty {
        /**
         * The AddGWMetaData value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-addgwmetadata
         */
        readonly addGwMetadata?: boolean | cdk.IResolvable;
        /**
         * The ChannelMask value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-channelmask
         */
        readonly channelMask?: string;
        /**
         * The DevStatusReqFreq value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-devstatusreqfreq
         */
        readonly devStatusReqFreq?: number;
        /**
         * The DLBucketSize value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlbucketsize
         */
        readonly dlBucketSize?: number;
        /**
         * The DLRate value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlrate
         */
        readonly dlRate?: number;
        /**
         * The DLRatePolicy value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-dlratepolicy
         */
        readonly dlRatePolicy?: string;
        /**
         * The DRMax value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmax
         */
        readonly drMax?: number;
        /**
         * The DRMin value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-drmin
         */
        readonly drMin?: number;
        /**
         * The HRAllowed value that describes whether handover roaming is allowed.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-hrallowed
         */
        readonly hrAllowed?: boolean | cdk.IResolvable;
        /**
         * The MinGwDiversity value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-mingwdiversity
         */
        readonly minGwDiversity?: number;
        /**
         * The NwkGeoLoc value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-nwkgeoloc
         */
        readonly nwkGeoLoc?: boolean | cdk.IResolvable;
        /**
         * The PRAllowed value that describes whether passive roaming is allowed.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-prallowed
         */
        readonly prAllowed?: boolean | cdk.IResolvable;
        /**
         * The RAAllowed value that describes whether roaming activation is allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-raallowed
         */
        readonly raAllowed?: boolean | cdk.IResolvable;
        /**
         * The ReportDevStatusBattery value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusbattery
         */
        readonly reportDevStatusBattery?: boolean | cdk.IResolvable;
        /**
         * The ReportDevStatusMargin value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-reportdevstatusmargin
         */
        readonly reportDevStatusMargin?: boolean | cdk.IResolvable;
        /**
         * The TargetPer value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-targetper
         */
        readonly targetPer?: number;
        /**
         * The UlBucketSize value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulbucketsize
         */
        readonly ulBucketSize?: number;
        /**
         * The ULRate value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulrate
         */
        readonly ulRate?: number;
        /**
         * The ULRatePolicy value.
         *
         * This property is `ReadOnly` and can't be inputted for create. It's returned with `Fn::GetAtt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-serviceprofile-lorawanserviceprofile.html#cfn-iotwireless-serviceprofile-lorawanserviceprofile-ulratepolicy
         */
        readonly ulRatePolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANServiceProfileProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANServiceProfileProperty`
 *
 * @returns the result of the validation.
 */
function CfnServiceProfile_LoRaWANServiceProfilePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addGwMetadata', cdk.validateBoolean)(properties.addGwMetadata));
    errors.collect(cdk.propertyValidator('channelMask', cdk.validateString)(properties.channelMask));
    errors.collect(cdk.propertyValidator('devStatusReqFreq', cdk.validateNumber)(properties.devStatusReqFreq));
    errors.collect(cdk.propertyValidator('dlBucketSize', cdk.validateNumber)(properties.dlBucketSize));
    errors.collect(cdk.propertyValidator('dlRate', cdk.validateNumber)(properties.dlRate));
    errors.collect(cdk.propertyValidator('dlRatePolicy', cdk.validateString)(properties.dlRatePolicy));
    errors.collect(cdk.propertyValidator('drMax', cdk.validateNumber)(properties.drMax));
    errors.collect(cdk.propertyValidator('drMin', cdk.validateNumber)(properties.drMin));
    errors.collect(cdk.propertyValidator('hrAllowed', cdk.validateBoolean)(properties.hrAllowed));
    errors.collect(cdk.propertyValidator('minGwDiversity', cdk.validateNumber)(properties.minGwDiversity));
    errors.collect(cdk.propertyValidator('nwkGeoLoc', cdk.validateBoolean)(properties.nwkGeoLoc));
    errors.collect(cdk.propertyValidator('prAllowed', cdk.validateBoolean)(properties.prAllowed));
    errors.collect(cdk.propertyValidator('raAllowed', cdk.validateBoolean)(properties.raAllowed));
    errors.collect(cdk.propertyValidator('reportDevStatusBattery', cdk.validateBoolean)(properties.reportDevStatusBattery));
    errors.collect(cdk.propertyValidator('reportDevStatusMargin', cdk.validateBoolean)(properties.reportDevStatusMargin));
    errors.collect(cdk.propertyValidator('targetPer', cdk.validateNumber)(properties.targetPer));
    errors.collect(cdk.propertyValidator('ulBucketSize', cdk.validateNumber)(properties.ulBucketSize));
    errors.collect(cdk.propertyValidator('ulRate', cdk.validateNumber)(properties.ulRate));
    errors.collect(cdk.propertyValidator('ulRatePolicy', cdk.validateString)(properties.ulRatePolicy));
    return errors.wrap('supplied properties not correct for "LoRaWANServiceProfileProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::ServiceProfile.LoRaWANServiceProfile` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANServiceProfileProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::ServiceProfile.LoRaWANServiceProfile` resource.
 */
// @ts-ignore TS6133
function cfnServiceProfileLoRaWANServiceProfilePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnServiceProfile_LoRaWANServiceProfilePropertyValidator(properties).assertSuccess();
    return {
        AddGwMetadata: cdk.booleanToCloudFormation(properties.addGwMetadata),
        ChannelMask: cdk.stringToCloudFormation(properties.channelMask),
        DevStatusReqFreq: cdk.numberToCloudFormation(properties.devStatusReqFreq),
        DlBucketSize: cdk.numberToCloudFormation(properties.dlBucketSize),
        DlRate: cdk.numberToCloudFormation(properties.dlRate),
        DlRatePolicy: cdk.stringToCloudFormation(properties.dlRatePolicy),
        DrMax: cdk.numberToCloudFormation(properties.drMax),
        DrMin: cdk.numberToCloudFormation(properties.drMin),
        HrAllowed: cdk.booleanToCloudFormation(properties.hrAllowed),
        MinGwDiversity: cdk.numberToCloudFormation(properties.minGwDiversity),
        NwkGeoLoc: cdk.booleanToCloudFormation(properties.nwkGeoLoc),
        PrAllowed: cdk.booleanToCloudFormation(properties.prAllowed),
        RaAllowed: cdk.booleanToCloudFormation(properties.raAllowed),
        ReportDevStatusBattery: cdk.booleanToCloudFormation(properties.reportDevStatusBattery),
        ReportDevStatusMargin: cdk.booleanToCloudFormation(properties.reportDevStatusMargin),
        TargetPer: cdk.numberToCloudFormation(properties.targetPer),
        UlBucketSize: cdk.numberToCloudFormation(properties.ulBucketSize),
        UlRate: cdk.numberToCloudFormation(properties.ulRate),
        UlRatePolicy: cdk.stringToCloudFormation(properties.ulRatePolicy),
    };
}

// @ts-ignore TS6133
function CfnServiceProfileLoRaWANServiceProfilePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceProfile.LoRaWANServiceProfileProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceProfile.LoRaWANServiceProfileProperty>();
    ret.addPropertyResult('addGwMetadata', 'AddGwMetadata', properties.AddGwMetadata != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddGwMetadata) : undefined);
    ret.addPropertyResult('channelMask', 'ChannelMask', properties.ChannelMask != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelMask) : undefined);
    ret.addPropertyResult('devStatusReqFreq', 'DevStatusReqFreq', properties.DevStatusReqFreq != null ? cfn_parse.FromCloudFormation.getNumber(properties.DevStatusReqFreq) : undefined);
    ret.addPropertyResult('dlBucketSize', 'DlBucketSize', properties.DlBucketSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DlBucketSize) : undefined);
    ret.addPropertyResult('dlRate', 'DlRate', properties.DlRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.DlRate) : undefined);
    ret.addPropertyResult('dlRatePolicy', 'DlRatePolicy', properties.DlRatePolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DlRatePolicy) : undefined);
    ret.addPropertyResult('drMax', 'DrMax', properties.DrMax != null ? cfn_parse.FromCloudFormation.getNumber(properties.DrMax) : undefined);
    ret.addPropertyResult('drMin', 'DrMin', properties.DrMin != null ? cfn_parse.FromCloudFormation.getNumber(properties.DrMin) : undefined);
    ret.addPropertyResult('hrAllowed', 'HrAllowed', properties.HrAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HrAllowed) : undefined);
    ret.addPropertyResult('minGwDiversity', 'MinGwDiversity', properties.MinGwDiversity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinGwDiversity) : undefined);
    ret.addPropertyResult('nwkGeoLoc', 'NwkGeoLoc', properties.NwkGeoLoc != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NwkGeoLoc) : undefined);
    ret.addPropertyResult('prAllowed', 'PrAllowed', properties.PrAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PrAllowed) : undefined);
    ret.addPropertyResult('raAllowed', 'RaAllowed', properties.RaAllowed != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RaAllowed) : undefined);
    ret.addPropertyResult('reportDevStatusBattery', 'ReportDevStatusBattery', properties.ReportDevStatusBattery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReportDevStatusBattery) : undefined);
    ret.addPropertyResult('reportDevStatusMargin', 'ReportDevStatusMargin', properties.ReportDevStatusMargin != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReportDevStatusMargin) : undefined);
    ret.addPropertyResult('targetPer', 'TargetPer', properties.TargetPer != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetPer) : undefined);
    ret.addPropertyResult('ulBucketSize', 'UlBucketSize', properties.UlBucketSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.UlBucketSize) : undefined);
    ret.addPropertyResult('ulRate', 'UlRate', properties.UlRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.UlRate) : undefined);
    ret.addPropertyResult('ulRatePolicy', 'UlRatePolicy', properties.UlRatePolicy != null ? cfn_parse.FromCloudFormation.getString(properties.UlRatePolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTaskDefinition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export interface CfnTaskDefinitionProps {

    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If `false` , the task must be created by calling `CreateWirelessGatewayTask` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-autocreatetasks
     */
    readonly autoCreateTasks: boolean | cdk.IResolvable;

    /**
     * `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry
     */
    readonly loRaWanUpdateGatewayTaskEntry?: CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty | cdk.IResolvable;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * `AWS::IoTWireless::TaskDefinition.TaskDefinitionType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-taskdefinitiontype
     */
    readonly taskDefinitionType?: string;

    /**
     * Information about the gateways to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-update
     */
    readonly update?: CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnTaskDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskDefinitionProps`
 *
 * @returns the result of the validation.
 */
function CfnTaskDefinitionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoCreateTasks', cdk.requiredValidator)(properties.autoCreateTasks));
    errors.collect(cdk.propertyValidator('autoCreateTasks', cdk.validateBoolean)(properties.autoCreateTasks));
    errors.collect(cdk.propertyValidator('loRaWanUpdateGatewayTaskEntry', CfnTaskDefinition_LoRaWANUpdateGatewayTaskEntryPropertyValidator)(properties.loRaWanUpdateGatewayTaskEntry));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('taskDefinitionType', cdk.validateString)(properties.taskDefinitionType));
    errors.collect(cdk.propertyValidator('update', CfnTaskDefinition_UpdateWirelessGatewayTaskCreatePropertyValidator)(properties.update));
    return errors.wrap('supplied properties not correct for "CfnTaskDefinitionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CfnTaskDefinitionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition` resource.
 */
// @ts-ignore TS6133
function cfnTaskDefinitionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskDefinitionPropsValidator(properties).assertSuccess();
    return {
        AutoCreateTasks: cdk.booleanToCloudFormation(properties.autoCreateTasks),
        LoRaWANUpdateGatewayTaskEntry: cfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyToCloudFormation(properties.loRaWanUpdateGatewayTaskEntry),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TaskDefinitionType: cdk.stringToCloudFormation(properties.taskDefinitionType),
        Update: cfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyToCloudFormation(properties.update),
    };
}

// @ts-ignore TS6133
function CfnTaskDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinitionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinitionProps>();
    ret.addPropertyResult('autoCreateTasks', 'AutoCreateTasks', cfn_parse.FromCloudFormation.getBoolean(properties.AutoCreateTasks));
    ret.addPropertyResult('loRaWanUpdateGatewayTaskEntry', 'LoRaWANUpdateGatewayTaskEntry', properties.LoRaWANUpdateGatewayTaskEntry != null ? CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyFromCloudFormation(properties.LoRaWANUpdateGatewayTaskEntry) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('taskDefinitionType', 'TaskDefinitionType', properties.TaskDefinitionType != null ? cfn_parse.FromCloudFormation.getString(properties.TaskDefinitionType) : undefined);
    ret.addPropertyResult('update', 'Update', properties.Update != null ? CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyFromCloudFormation(properties.Update) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::TaskDefinition`
 *
 * Creates a gateway task definition.
 *
 * @cloudformationResource AWS::IoTWireless::TaskDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html
 */
export class CfnTaskDefinition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::TaskDefinition";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskDefinition {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTaskDefinitionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTaskDefinition(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name of the resource.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the new wireless gateway task definition.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Whether to automatically create tasks using this task definition for all gateways with the specified current version. If `false` , the task must be created by calling `CreateWirelessGatewayTask` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-autocreatetasks
     */
    public autoCreateTasks: boolean | cdk.IResolvable;

    /**
     * `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry
     */
    public loRaWanUpdateGatewayTaskEntry: CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty | cdk.IResolvable | undefined;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * `AWS::IoTWireless::TaskDefinition.TaskDefinitionType`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-taskdefinitiontype
     */
    public taskDefinitionType: string | undefined;

    /**
     * Information about the gateways to update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-taskdefinition.html#cfn-iotwireless-taskdefinition-update
     */
    public update: CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::IoTWireless::TaskDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTaskDefinitionProps) {
        super(scope, id, { type: CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'autoCreateTasks', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.autoCreateTasks = props.autoCreateTasks;
        this.loRaWanUpdateGatewayTaskEntry = props.loRaWanUpdateGatewayTaskEntry;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::TaskDefinition", props.tags, { tagPropertyName: 'tags' });
        this.taskDefinitionType = props.taskDefinitionType;
        this.update = props.update;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskDefinition.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            autoCreateTasks: this.autoCreateTasks,
            loRaWanUpdateGatewayTaskEntry: this.loRaWanUpdateGatewayTaskEntry,
            name: this.name,
            tags: this.tags.renderTags(),
            taskDefinitionType: this.taskDefinitionType,
            update: this.update,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTaskDefinitionPropsToCloudFormation(props);
    }
}

export namespace CfnTaskDefinition {
    /**
     * LoRaWANGatewayVersion object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html
     */
    export interface LoRaWANGatewayVersionProperty {
        /**
         * The model number of the wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-model
         */
        readonly model?: string;
        /**
         * The version of the wireless gateway firmware.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-packageversion
         */
        readonly packageVersion?: string;
        /**
         * The basic station version of the wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawangatewayversion.html#cfn-iotwireless-taskdefinition-lorawangatewayversion-station
         */
        readonly station?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANGatewayVersionProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayVersionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('model', cdk.validateString)(properties.model));
    errors.collect(cdk.propertyValidator('packageVersion', cdk.validateString)(properties.packageVersion));
    errors.collect(cdk.propertyValidator('station', cdk.validateString)(properties.station));
    return errors.wrap('supplied properties not correct for "LoRaWANGatewayVersionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANGatewayVersion` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayVersionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANGatewayVersion` resource.
 */
// @ts-ignore TS6133
function cfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator(properties).assertSuccess();
    return {
        Model: cdk.stringToCloudFormation(properties.model),
        PackageVersion: cdk.stringToCloudFormation(properties.packageVersion),
        Station: cdk.stringToCloudFormation(properties.station),
    };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANGatewayVersionProperty>();
    ret.addPropertyResult('model', 'Model', properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined);
    ret.addPropertyResult('packageVersion', 'PackageVersion', properties.PackageVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PackageVersion) : undefined);
    ret.addPropertyResult('station', 'Station', properties.Station != null ? cfn_parse.FromCloudFormation.getString(properties.Station) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskDefinition {
    /**
     * The signature used to verify the update firmware.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html
     */
    export interface LoRaWANUpdateGatewayTaskCreateProperty {
        /**
         * The version of the gateways that should receive the update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-currentversion
         */
        readonly currentVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
        /**
         * The CRC of the signature private key to check.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-sigkeycrc
         */
        readonly sigKeyCrc?: number;
        /**
         * The signature used to verify the update firmware.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updatesignature
         */
        readonly updateSignature?: string;
        /**
         * The firmware version to update the gateway to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskcreate-updateversion
         */
        readonly updateVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANUpdateGatewayTaskCreateProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskCreateProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskDefinition_LoRaWANUpdateGatewayTaskCreatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('currentVersion', CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator)(properties.currentVersion));
    errors.collect(cdk.propertyValidator('sigKeyCrc', cdk.validateNumber)(properties.sigKeyCrc));
    errors.collect(cdk.propertyValidator('updateSignature', cdk.validateString)(properties.updateSignature));
    errors.collect(cdk.propertyValidator('updateVersion', CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator)(properties.updateVersion));
    return errors.wrap('supplied properties not correct for "LoRaWANUpdateGatewayTaskCreateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskCreate` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskCreateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskCreate` resource.
 */
// @ts-ignore TS6133
function cfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskDefinition_LoRaWANUpdateGatewayTaskCreatePropertyValidator(properties).assertSuccess();
    return {
        CurrentVersion: cfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.currentVersion),
        SigKeyCrc: cdk.numberToCloudFormation(properties.sigKeyCrc),
        UpdateSignature: cdk.stringToCloudFormation(properties.updateSignature),
        UpdateVersion: cfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.updateVersion),
    };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty>();
    ret.addPropertyResult('currentVersion', 'CurrentVersion', properties.CurrentVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.CurrentVersion) : undefined);
    ret.addPropertyResult('sigKeyCrc', 'SigKeyCrc', properties.SigKeyCrc != null ? cfn_parse.FromCloudFormation.getNumber(properties.SigKeyCrc) : undefined);
    ret.addPropertyResult('updateSignature', 'UpdateSignature', properties.UpdateSignature != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateSignature) : undefined);
    ret.addPropertyResult('updateVersion', 'UpdateVersion', properties.UpdateVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.UpdateVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskDefinition {
    /**
     * LoRaWANUpdateGatewayTaskEntry object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html
     */
    export interface LoRaWANUpdateGatewayTaskEntryProperty {
        /**
         * The version of the gateways that should receive the update.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-currentversion
         */
        readonly currentVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
        /**
         * The firmware version to update the gateway to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-lorawanupdategatewaytaskentry.html#cfn-iotwireless-taskdefinition-lorawanupdategatewaytaskentry-updateversion
         */
        readonly updateVersion?: CfnTaskDefinition.LoRaWANGatewayVersionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANUpdateGatewayTaskEntryProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskEntryProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskDefinition_LoRaWANUpdateGatewayTaskEntryPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('currentVersion', CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator)(properties.currentVersion));
    errors.collect(cdk.propertyValidator('updateVersion', CfnTaskDefinition_LoRaWANGatewayVersionPropertyValidator)(properties.updateVersion));
    return errors.wrap('supplied properties not correct for "LoRaWANUpdateGatewayTaskEntryProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANUpdateGatewayTaskEntryProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.LoRaWANUpdateGatewayTaskEntry` resource.
 */
// @ts-ignore TS6133
function cfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskDefinition_LoRaWANUpdateGatewayTaskEntryPropertyValidator(properties).assertSuccess();
    return {
        CurrentVersion: cfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.currentVersion),
        UpdateVersion: cfnTaskDefinitionLoRaWANGatewayVersionPropertyToCloudFormation(properties.updateVersion),
    };
}

// @ts-ignore TS6133
function CfnTaskDefinitionLoRaWANUpdateGatewayTaskEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.LoRaWANUpdateGatewayTaskEntryProperty>();
    ret.addPropertyResult('currentVersion', 'CurrentVersion', properties.CurrentVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.CurrentVersion) : undefined);
    ret.addPropertyResult('updateVersion', 'UpdateVersion', properties.UpdateVersion != null ? CfnTaskDefinitionLoRaWANGatewayVersionPropertyFromCloudFormation(properties.UpdateVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTaskDefinition {
    /**
     * UpdateWirelessGatewayTaskCreate object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html
     */
    export interface UpdateWirelessGatewayTaskCreateProperty {
        /**
         * The properties that relate to the LoRaWAN wireless gateway.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-lorawan
         */
        readonly loRaWan?: CfnTaskDefinition.LoRaWANUpdateGatewayTaskCreateProperty | cdk.IResolvable;
        /**
         * The IAM role used to read data from the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatarole
         */
        readonly updateDataRole?: string;
        /**
         * The link to the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate.html#cfn-iotwireless-taskdefinition-updatewirelessgatewaytaskcreate-updatedatasource
         */
        readonly updateDataSource?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UpdateWirelessGatewayTaskCreateProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateWirelessGatewayTaskCreateProperty`
 *
 * @returns the result of the validation.
 */
function CfnTaskDefinition_UpdateWirelessGatewayTaskCreatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('loRaWan', CfnTaskDefinition_LoRaWANUpdateGatewayTaskCreatePropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('updateDataRole', cdk.validateString)(properties.updateDataRole));
    errors.collect(cdk.propertyValidator('updateDataSource', cdk.validateString)(properties.updateDataSource));
    return errors.wrap('supplied properties not correct for "UpdateWirelessGatewayTaskCreateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.UpdateWirelessGatewayTaskCreate` resource
 *
 * @param properties - the TypeScript properties of a `UpdateWirelessGatewayTaskCreateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::TaskDefinition.UpdateWirelessGatewayTaskCreate` resource.
 */
// @ts-ignore TS6133
function cfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTaskDefinition_UpdateWirelessGatewayTaskCreatePropertyValidator(properties).assertSuccess();
    return {
        LoRaWAN: cfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyToCloudFormation(properties.loRaWan),
        UpdateDataRole: cdk.stringToCloudFormation(properties.updateDataRole),
        UpdateDataSource: cdk.stringToCloudFormation(properties.updateDataSource),
    };
}

// @ts-ignore TS6133
function CfnTaskDefinitionUpdateWirelessGatewayTaskCreatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskDefinition.UpdateWirelessGatewayTaskCreateProperty>();
    ret.addPropertyResult('loRaWan', 'LoRaWAN', properties.LoRaWAN != null ? CfnTaskDefinitionLoRaWANUpdateGatewayTaskCreatePropertyFromCloudFormation(properties.LoRaWAN) : undefined);
    ret.addPropertyResult('updateDataRole', 'UpdateDataRole', properties.UpdateDataRole != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateDataRole) : undefined);
    ret.addPropertyResult('updateDataSource', 'UpdateDataSource', properties.UpdateDataSource != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateDataSource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWirelessDevice`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export interface CfnWirelessDeviceProps {

    /**
     * The name of the destination to assign to the new wireless device. Can have only have alphanumeric, - (hyphen) and _ (underscore) characters and it can't have any spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-destinationname
     */
    readonly destinationName: string;

    /**
     * The wireless device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-type
     */
    readonly type: string;

    /**
     * The description of the new resource. Maximum length is 2048.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-description
     */
    readonly description?: string;

    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lastuplinkreceivedat
     */
    readonly lastUplinkReceivedAt?: string;

    /**
     * The device configuration information to use to create the wireless device. Must be at least one of OtaaV10x, OtaaV11, AbpV11, or AbpV10x.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lorawan
     */
    readonly loRaWan?: CfnWirelessDevice.LoRaWANDeviceProperty | cdk.IResolvable;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ARN of the thing to associate with the wireless device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-thingarn
     */
    readonly thingArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnWirelessDeviceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWirelessDeviceProps`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevicePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('destinationName', cdk.requiredValidator)(properties.destinationName));
    errors.collect(cdk.propertyValidator('destinationName', cdk.validateString)(properties.destinationName));
    errors.collect(cdk.propertyValidator('lastUplinkReceivedAt', cdk.validateString)(properties.lastUplinkReceivedAt));
    errors.collect(cdk.propertyValidator('loRaWan', CfnWirelessDevice_LoRaWANDevicePropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('thingArn', cdk.validateString)(properties.thingArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnWirelessDeviceProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice` resource
 *
 * @param properties - the TypeScript properties of a `CfnWirelessDeviceProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDevicePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevicePropsValidator(properties).assertSuccess();
    return {
        DestinationName: cdk.stringToCloudFormation(properties.destinationName),
        Type: cdk.stringToCloudFormation(properties.type),
        Description: cdk.stringToCloudFormation(properties.description),
        LastUplinkReceivedAt: cdk.stringToCloudFormation(properties.lastUplinkReceivedAt),
        LoRaWAN: cfnWirelessDeviceLoRaWANDevicePropertyToCloudFormation(properties.loRaWan),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        ThingArn: cdk.stringToCloudFormation(properties.thingArn),
    };
}

// @ts-ignore TS6133
function CfnWirelessDevicePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDeviceProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDeviceProps>();
    ret.addPropertyResult('destinationName', 'DestinationName', cfn_parse.FromCloudFormation.getString(properties.DestinationName));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('lastUplinkReceivedAt', 'LastUplinkReceivedAt', properties.LastUplinkReceivedAt != null ? cfn_parse.FromCloudFormation.getString(properties.LastUplinkReceivedAt) : undefined);
    ret.addPropertyResult('loRaWan', 'LoRaWAN', properties.LoRaWAN != null ? CfnWirelessDeviceLoRaWANDevicePropertyFromCloudFormation(properties.LoRaWAN) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('thingArn', 'ThingArn', properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::WirelessDevice`
 *
 * Provisions a wireless device.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessDevice
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html
 */
export class CfnWirelessDevice extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::WirelessDevice";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessDevice {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWirelessDevicePropsFromCloudFormation(resourceProperties);
        const ret = new CfnWirelessDevice(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the wireless device created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the wireless device created.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name of the thing associated with the wireless device. The value is empty if a thing isn't associated with the device.
     * @cloudformationAttribute ThingName
     */
    public readonly attrThingName: string;

    /**
     * The name of the destination to assign to the new wireless device. Can have only have alphanumeric, - (hyphen) and _ (underscore) characters and it can't have any spaces.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-destinationname
     */
    public destinationName: string;

    /**
     * The wireless device type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-type
     */
    public type: string;

    /**
     * The description of the new resource. Maximum length is 2048.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-description
     */
    public description: string | undefined;

    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lastuplinkreceivedat
     */
    public lastUplinkReceivedAt: string | undefined;

    /**
     * The device configuration information to use to create the wireless device. Must be at least one of OtaaV10x, OtaaV11, AbpV11, or AbpV10x.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-lorawan
     */
    public loRaWan: CfnWirelessDevice.LoRaWANDeviceProperty | cdk.IResolvable | undefined;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ARN of the thing to associate with the wireless device.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessdevice.html#cfn-iotwireless-wirelessdevice-thingarn
     */
    public thingArn: string | undefined;

    /**
     * Create a new `AWS::IoTWireless::WirelessDevice`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWirelessDeviceProps) {
        super(scope, id, { type: CfnWirelessDevice.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'destinationName', this);
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrThingName = cdk.Token.asString(this.getAtt('ThingName', cdk.ResolutionTypeHint.STRING));

        this.destinationName = props.destinationName;
        this.type = props.type;
        this.description = props.description;
        this.lastUplinkReceivedAt = props.lastUplinkReceivedAt;
        this.loRaWan = props.loRaWan;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::WirelessDevice", props.tags, { tagPropertyName: 'tags' });
        this.thingArn = props.thingArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWirelessDevice.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            destinationName: this.destinationName,
            type: this.type,
            description: this.description,
            lastUplinkReceivedAt: this.lastUplinkReceivedAt,
            loRaWan: this.loRaWan,
            name: this.name,
            tags: this.tags.renderTags(),
            thingArn: this.thingArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWirelessDevicePropsToCloudFormation(props);
    }
}

export namespace CfnWirelessDevice {
    /**
     * ABP device object for LoRaWAN specification v1.0.x.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html
     */
    export interface AbpV10xProperty {
        /**
         * The DevAddr value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-devaddr
         */
        readonly devAddr: string;
        /**
         * Session keys for ABP v1.0.x
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv10x.html#cfn-iotwireless-wirelessdevice-abpv10x-sessionkeys
         */
        readonly sessionKeys: CfnWirelessDevice.SessionKeysAbpV10xProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AbpV10xProperty`
 *
 * @param properties - the TypeScript properties of a `AbpV10xProperty`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_AbpV10xPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('devAddr', cdk.requiredValidator)(properties.devAddr));
    errors.collect(cdk.propertyValidator('devAddr', cdk.validateString)(properties.devAddr));
    errors.collect(cdk.propertyValidator('sessionKeys', cdk.requiredValidator)(properties.sessionKeys));
    errors.collect(cdk.propertyValidator('sessionKeys', CfnWirelessDevice_SessionKeysAbpV10xPropertyValidator)(properties.sessionKeys));
    return errors.wrap('supplied properties not correct for "AbpV10xProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.AbpV10x` resource
 *
 * @param properties - the TypeScript properties of a `AbpV10xProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.AbpV10x` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceAbpV10xPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_AbpV10xPropertyValidator(properties).assertSuccess();
    return {
        DevAddr: cdk.stringToCloudFormation(properties.devAddr),
        SessionKeys: cfnWirelessDeviceSessionKeysAbpV10xPropertyToCloudFormation(properties.sessionKeys),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceAbpV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.AbpV10xProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.AbpV10xProperty>();
    ret.addPropertyResult('devAddr', 'DevAddr', cfn_parse.FromCloudFormation.getString(properties.DevAddr));
    ret.addPropertyResult('sessionKeys', 'SessionKeys', CfnWirelessDeviceSessionKeysAbpV10xPropertyFromCloudFormation(properties.SessionKeys));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * ABP device object for create APIs for v1.1.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html
     */
    export interface AbpV11Property {
        /**
         * The DevAddr value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-devaddr
         */
        readonly devAddr: string;
        /**
         * Session keys for ABP v1.1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-abpv11.html#cfn-iotwireless-wirelessdevice-abpv11-sessionkeys
         */
        readonly sessionKeys: CfnWirelessDevice.SessionKeysAbpV11Property | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AbpV11Property`
 *
 * @param properties - the TypeScript properties of a `AbpV11Property`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_AbpV11PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('devAddr', cdk.requiredValidator)(properties.devAddr));
    errors.collect(cdk.propertyValidator('devAddr', cdk.validateString)(properties.devAddr));
    errors.collect(cdk.propertyValidator('sessionKeys', cdk.requiredValidator)(properties.sessionKeys));
    errors.collect(cdk.propertyValidator('sessionKeys', CfnWirelessDevice_SessionKeysAbpV11PropertyValidator)(properties.sessionKeys));
    return errors.wrap('supplied properties not correct for "AbpV11Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.AbpV11` resource
 *
 * @param properties - the TypeScript properties of a `AbpV11Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.AbpV11` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceAbpV11PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_AbpV11PropertyValidator(properties).assertSuccess();
    return {
        DevAddr: cdk.stringToCloudFormation(properties.devAddr),
        SessionKeys: cfnWirelessDeviceSessionKeysAbpV11PropertyToCloudFormation(properties.sessionKeys),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceAbpV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.AbpV11Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.AbpV11Property>();
    ret.addPropertyResult('devAddr', 'DevAddr', cfn_parse.FromCloudFormation.getString(properties.DevAddr));
    ret.addPropertyResult('sessionKeys', 'SessionKeys', CfnWirelessDeviceSessionKeysAbpV11PropertyFromCloudFormation(properties.SessionKeys));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * LoRaWAN object for create functions.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html
     */
    export interface LoRaWANDeviceProperty {
        /**
         * LoRaWAN object for create APIs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv10x
         */
        readonly abpV10X?: CfnWirelessDevice.AbpV10xProperty | cdk.IResolvable;
        /**
         * ABP device object for create APIs for v1.1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-abpv11
         */
        readonly abpV11?: CfnWirelessDevice.AbpV11Property | cdk.IResolvable;
        /**
         * The DevEUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deveui
         */
        readonly devEui?: string;
        /**
         * The ID of the device profile for the new wireless device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-deviceprofileid
         */
        readonly deviceProfileId?: string;
        /**
         * OTAA device object for create APIs for v1.0.x
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav10x
         */
        readonly otaaV10X?: CfnWirelessDevice.OtaaV10xProperty | cdk.IResolvable;
        /**
         * OTAA device object for v1.1 for create APIs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-otaav11
         */
        readonly otaaV11?: CfnWirelessDevice.OtaaV11Property | cdk.IResolvable;
        /**
         * The ID of the service profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-lorawandevice.html#cfn-iotwireless-wirelessdevice-lorawandevice-serviceprofileid
         */
        readonly serviceProfileId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANDeviceProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProperty`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_LoRaWANDevicePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('abpV10X', CfnWirelessDevice_AbpV10xPropertyValidator)(properties.abpV10X));
    errors.collect(cdk.propertyValidator('abpV11', CfnWirelessDevice_AbpV11PropertyValidator)(properties.abpV11));
    errors.collect(cdk.propertyValidator('devEui', cdk.validateString)(properties.devEui));
    errors.collect(cdk.propertyValidator('deviceProfileId', cdk.validateString)(properties.deviceProfileId));
    errors.collect(cdk.propertyValidator('otaaV10X', CfnWirelessDevice_OtaaV10xPropertyValidator)(properties.otaaV10X));
    errors.collect(cdk.propertyValidator('otaaV11', CfnWirelessDevice_OtaaV11PropertyValidator)(properties.otaaV11));
    errors.collect(cdk.propertyValidator('serviceProfileId', cdk.validateString)(properties.serviceProfileId));
    return errors.wrap('supplied properties not correct for "LoRaWANDeviceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.LoRaWANDevice` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANDeviceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.LoRaWANDevice` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceLoRaWANDevicePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_LoRaWANDevicePropertyValidator(properties).assertSuccess();
    return {
        AbpV10x: cfnWirelessDeviceAbpV10xPropertyToCloudFormation(properties.abpV10X),
        AbpV11: cfnWirelessDeviceAbpV11PropertyToCloudFormation(properties.abpV11),
        DevEui: cdk.stringToCloudFormation(properties.devEui),
        DeviceProfileId: cdk.stringToCloudFormation(properties.deviceProfileId),
        OtaaV10x: cfnWirelessDeviceOtaaV10xPropertyToCloudFormation(properties.otaaV10X),
        OtaaV11: cfnWirelessDeviceOtaaV11PropertyToCloudFormation(properties.otaaV11),
        ServiceProfileId: cdk.stringToCloudFormation(properties.serviceProfileId),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceLoRaWANDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.LoRaWANDeviceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.LoRaWANDeviceProperty>();
    ret.addPropertyResult('abpV10X', 'AbpV10x', properties.AbpV10x != null ? CfnWirelessDeviceAbpV10xPropertyFromCloudFormation(properties.AbpV10x) : undefined);
    ret.addPropertyResult('abpV11', 'AbpV11', properties.AbpV11 != null ? CfnWirelessDeviceAbpV11PropertyFromCloudFormation(properties.AbpV11) : undefined);
    ret.addPropertyResult('devEui', 'DevEui', properties.DevEui != null ? cfn_parse.FromCloudFormation.getString(properties.DevEui) : undefined);
    ret.addPropertyResult('deviceProfileId', 'DeviceProfileId', properties.DeviceProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceProfileId) : undefined);
    ret.addPropertyResult('otaaV10X', 'OtaaV10x', properties.OtaaV10x != null ? CfnWirelessDeviceOtaaV10xPropertyFromCloudFormation(properties.OtaaV10x) : undefined);
    ret.addPropertyResult('otaaV11', 'OtaaV11', properties.OtaaV11 != null ? CfnWirelessDeviceOtaaV11PropertyFromCloudFormation(properties.OtaaV11) : undefined);
    ret.addPropertyResult('serviceProfileId', 'ServiceProfileId', properties.ServiceProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceProfileId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * OTAA device object for create APIs for v1.0.x.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html
     */
    export interface OtaaV10xProperty {
        /**
         * The AppEUI value, with pattern of `[a-fA-F0-9]{16}` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appeui
         */
        readonly appEui: string;
        /**
         * The AppKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav10x.html#cfn-iotwireless-wirelessdevice-otaav10x-appkey
         */
        readonly appKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `OtaaV10xProperty`
 *
 * @param properties - the TypeScript properties of a `OtaaV10xProperty`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_OtaaV10xPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appEui', cdk.requiredValidator)(properties.appEui));
    errors.collect(cdk.propertyValidator('appEui', cdk.validateString)(properties.appEui));
    errors.collect(cdk.propertyValidator('appKey', cdk.requiredValidator)(properties.appKey));
    errors.collect(cdk.propertyValidator('appKey', cdk.validateString)(properties.appKey));
    return errors.wrap('supplied properties not correct for "OtaaV10xProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.OtaaV10x` resource
 *
 * @param properties - the TypeScript properties of a `OtaaV10xProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.OtaaV10x` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceOtaaV10xPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_OtaaV10xPropertyValidator(properties).assertSuccess();
    return {
        AppEui: cdk.stringToCloudFormation(properties.appEui),
        AppKey: cdk.stringToCloudFormation(properties.appKey),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.OtaaV10xProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.OtaaV10xProperty>();
    ret.addPropertyResult('appEui', 'AppEui', cfn_parse.FromCloudFormation.getString(properties.AppEui));
    ret.addPropertyResult('appKey', 'AppKey', cfn_parse.FromCloudFormation.getString(properties.AppKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * OTAA device object for v1.1 for create APIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html
     */
    export interface OtaaV11Property {
        /**
         * The AppKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-appkey
         */
        readonly appKey: string;
        /**
         * The JoinEUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-joineui
         */
        readonly joinEui: string;
        /**
         * The NwkKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-otaav11.html#cfn-iotwireless-wirelessdevice-otaav11-nwkkey
         */
        readonly nwkKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `OtaaV11Property`
 *
 * @param properties - the TypeScript properties of a `OtaaV11Property`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_OtaaV11PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appKey', cdk.requiredValidator)(properties.appKey));
    errors.collect(cdk.propertyValidator('appKey', cdk.validateString)(properties.appKey));
    errors.collect(cdk.propertyValidator('joinEui', cdk.requiredValidator)(properties.joinEui));
    errors.collect(cdk.propertyValidator('joinEui', cdk.validateString)(properties.joinEui));
    errors.collect(cdk.propertyValidator('nwkKey', cdk.requiredValidator)(properties.nwkKey));
    errors.collect(cdk.propertyValidator('nwkKey', cdk.validateString)(properties.nwkKey));
    return errors.wrap('supplied properties not correct for "OtaaV11Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.OtaaV11` resource
 *
 * @param properties - the TypeScript properties of a `OtaaV11Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.OtaaV11` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceOtaaV11PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_OtaaV11PropertyValidator(properties).assertSuccess();
    return {
        AppKey: cdk.stringToCloudFormation(properties.appKey),
        JoinEui: cdk.stringToCloudFormation(properties.joinEui),
        NwkKey: cdk.stringToCloudFormation(properties.nwkKey),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceOtaaV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.OtaaV11Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.OtaaV11Property>();
    ret.addPropertyResult('appKey', 'AppKey', cfn_parse.FromCloudFormation.getString(properties.AppKey));
    ret.addPropertyResult('joinEui', 'JoinEui', cfn_parse.FromCloudFormation.getString(properties.JoinEui));
    ret.addPropertyResult('nwkKey', 'NwkKey', cfn_parse.FromCloudFormation.getString(properties.NwkKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * LoRaWAN object for create APIs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html
     */
    export interface SessionKeysAbpV10xProperty {
        /**
         * The AppSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-appskey
         */
        readonly appSKey: string;
        /**
         * The NwkSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv10x.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv10x-nwkskey
         */
        readonly nwkSKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `SessionKeysAbpV10xProperty`
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV10xProperty`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_SessionKeysAbpV10xPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appSKey', cdk.requiredValidator)(properties.appSKey));
    errors.collect(cdk.propertyValidator('appSKey', cdk.validateString)(properties.appSKey));
    errors.collect(cdk.propertyValidator('nwkSKey', cdk.requiredValidator)(properties.nwkSKey));
    errors.collect(cdk.propertyValidator('nwkSKey', cdk.validateString)(properties.nwkSKey));
    return errors.wrap('supplied properties not correct for "SessionKeysAbpV10xProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.SessionKeysAbpV10x` resource
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV10xProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.SessionKeysAbpV10x` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceSessionKeysAbpV10xPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_SessionKeysAbpV10xPropertyValidator(properties).assertSuccess();
    return {
        AppSKey: cdk.stringToCloudFormation(properties.appSKey),
        NwkSKey: cdk.stringToCloudFormation(properties.nwkSKey),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV10xPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.SessionKeysAbpV10xProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.SessionKeysAbpV10xProperty>();
    ret.addPropertyResult('appSKey', 'AppSKey', cfn_parse.FromCloudFormation.getString(properties.AppSKey));
    ret.addPropertyResult('nwkSKey', 'NwkSKey', cfn_parse.FromCloudFormation.getString(properties.NwkSKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnWirelessDevice {
    /**
     * Session keys for ABP v1.1.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html
     */
    export interface SessionKeysAbpV11Property {
        /**
         * The AppSKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the AppSKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-appskey
         */
        readonly appSKey: string;
        /**
         * The FNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the FNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-fnwksintkey
         */
        readonly fNwkSIntKey: string;
        /**
         * The NwkSEncKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the NwkSEncKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-nwksenckey
         */
        readonly nwkSEncKey: string;
        /**
         * The SNwkSIntKey is a secret key, which you should handle in a similar way as you would an application password. You can protect the SNwkSIntKey value by storing it in the AWS Secrets Manager and use the [secretsmanager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager) to reference this value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessdevice-sessionkeysabpv11.html#cfn-iotwireless-wirelessdevice-sessionkeysabpv11-snwksintkey
         */
        readonly sNwkSIntKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `SessionKeysAbpV11Property`
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV11Property`
 *
 * @returns the result of the validation.
 */
function CfnWirelessDevice_SessionKeysAbpV11PropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appSKey', cdk.requiredValidator)(properties.appSKey));
    errors.collect(cdk.propertyValidator('appSKey', cdk.validateString)(properties.appSKey));
    errors.collect(cdk.propertyValidator('fNwkSIntKey', cdk.requiredValidator)(properties.fNwkSIntKey));
    errors.collect(cdk.propertyValidator('fNwkSIntKey', cdk.validateString)(properties.fNwkSIntKey));
    errors.collect(cdk.propertyValidator('nwkSEncKey', cdk.requiredValidator)(properties.nwkSEncKey));
    errors.collect(cdk.propertyValidator('nwkSEncKey', cdk.validateString)(properties.nwkSEncKey));
    errors.collect(cdk.propertyValidator('sNwkSIntKey', cdk.requiredValidator)(properties.sNwkSIntKey));
    errors.collect(cdk.propertyValidator('sNwkSIntKey', cdk.validateString)(properties.sNwkSIntKey));
    return errors.wrap('supplied properties not correct for "SessionKeysAbpV11Property"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.SessionKeysAbpV11` resource
 *
 * @param properties - the TypeScript properties of a `SessionKeysAbpV11Property`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessDevice.SessionKeysAbpV11` resource.
 */
// @ts-ignore TS6133
function cfnWirelessDeviceSessionKeysAbpV11PropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessDevice_SessionKeysAbpV11PropertyValidator(properties).assertSuccess();
    return {
        AppSKey: cdk.stringToCloudFormation(properties.appSKey),
        FNwkSIntKey: cdk.stringToCloudFormation(properties.fNwkSIntKey),
        NwkSEncKey: cdk.stringToCloudFormation(properties.nwkSEncKey),
        SNwkSIntKey: cdk.stringToCloudFormation(properties.sNwkSIntKey),
    };
}

// @ts-ignore TS6133
function CfnWirelessDeviceSessionKeysAbpV11PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessDevice.SessionKeysAbpV11Property | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessDevice.SessionKeysAbpV11Property>();
    ret.addPropertyResult('appSKey', 'AppSKey', cfn_parse.FromCloudFormation.getString(properties.AppSKey));
    ret.addPropertyResult('fNwkSIntKey', 'FNwkSIntKey', cfn_parse.FromCloudFormation.getString(properties.FNwkSIntKey));
    ret.addPropertyResult('nwkSEncKey', 'NwkSEncKey', cfn_parse.FromCloudFormation.getString(properties.NwkSEncKey));
    ret.addPropertyResult('sNwkSIntKey', 'SNwkSIntKey', cfn_parse.FromCloudFormation.getString(properties.SNwkSIntKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnWirelessGateway`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export interface CfnWirelessGatewayProps {

    /**
     * The gateway configuration information to use to create the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lorawan
     */
    readonly loRaWan: CfnWirelessGateway.LoRaWANGatewayProperty | cdk.IResolvable;

    /**
     * The description of the new resource. The maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-description
     */
    readonly description?: string;

    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lastuplinkreceivedat
     */
    readonly lastUplinkReceivedAt?: string;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-name
     */
    readonly name?: string;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The ARN of the thing to associate with the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingarn
     */
    readonly thingArn?: string;

    /**
     * `AWS::IoTWireless::WirelessGateway.ThingName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingname
     */
    readonly thingName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnWirelessGatewayProps`
 *
 * @param properties - the TypeScript properties of a `CfnWirelessGatewayProps`
 *
 * @returns the result of the validation.
 */
function CfnWirelessGatewayPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('lastUplinkReceivedAt', cdk.validateString)(properties.lastUplinkReceivedAt));
    errors.collect(cdk.propertyValidator('loRaWan', cdk.requiredValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('loRaWan', CfnWirelessGateway_LoRaWANGatewayPropertyValidator)(properties.loRaWan));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('thingArn', cdk.validateString)(properties.thingArn));
    errors.collect(cdk.propertyValidator('thingName', cdk.validateString)(properties.thingName));
    return errors.wrap('supplied properties not correct for "CfnWirelessGatewayProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessGateway` resource
 *
 * @param properties - the TypeScript properties of a `CfnWirelessGatewayProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessGateway` resource.
 */
// @ts-ignore TS6133
function cfnWirelessGatewayPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessGatewayPropsValidator(properties).assertSuccess();
    return {
        LoRaWAN: cfnWirelessGatewayLoRaWANGatewayPropertyToCloudFormation(properties.loRaWan),
        Description: cdk.stringToCloudFormation(properties.description),
        LastUplinkReceivedAt: cdk.stringToCloudFormation(properties.lastUplinkReceivedAt),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        ThingArn: cdk.stringToCloudFormation(properties.thingArn),
        ThingName: cdk.stringToCloudFormation(properties.thingName),
    };
}

// @ts-ignore TS6133
function CfnWirelessGatewayPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessGatewayProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessGatewayProps>();
    ret.addPropertyResult('loRaWan', 'LoRaWAN', CfnWirelessGatewayLoRaWANGatewayPropertyFromCloudFormation(properties.LoRaWAN));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('lastUplinkReceivedAt', 'LastUplinkReceivedAt', properties.LastUplinkReceivedAt != null ? cfn_parse.FromCloudFormation.getString(properties.LastUplinkReceivedAt) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('thingArn', 'ThingArn', properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined);
    ret.addPropertyResult('thingName', 'ThingName', properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTWireless::WirelessGateway`
 *
 * Provisions a wireless gateway.
 *
 * @cloudformationResource AWS::IoTWireless::WirelessGateway
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html
 */
export class CfnWirelessGateway extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTWireless::WirelessGateway";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWirelessGateway {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnWirelessGatewayPropsFromCloudFormation(resourceProperties);
        const ret = new CfnWirelessGateway(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the wireless gateway created.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the wireless gateway created.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The gateway configuration information to use to create the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lorawan
     */
    public loRaWan: CfnWirelessGateway.LoRaWANGatewayProperty | cdk.IResolvable;

    /**
     * The description of the new resource. The maximum length is 2048 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-description
     */
    public description: string | undefined;

    /**
     * The date and time when the most recent uplink was received.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-lastuplinkreceivedat
     */
    public lastUplinkReceivedAt: string | undefined;

    /**
     * The name of the new resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-name
     */
    public name: string | undefined;

    /**
     * The tags are an array of key-value pairs to attach to the specified resource. Tags can have a minimum of 0 and a maximum of 50 items.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The ARN of the thing to associate with the wireless gateway.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingarn
     */
    public thingArn: string | undefined;

    /**
     * `AWS::IoTWireless::WirelessGateway.ThingName`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotwireless-wirelessgateway.html#cfn-iotwireless-wirelessgateway-thingname
     */
    public thingName: string | undefined;

    /**
     * Create a new `AWS::IoTWireless::WirelessGateway`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnWirelessGatewayProps) {
        super(scope, id, { type: CfnWirelessGateway.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'loRaWan', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.loRaWan = props.loRaWan;
        this.description = props.description;
        this.lastUplinkReceivedAt = props.lastUplinkReceivedAt;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTWireless::WirelessGateway", props.tags, { tagPropertyName: 'tags' });
        this.thingArn = props.thingArn;
        this.thingName = props.thingName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnWirelessGateway.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            loRaWan: this.loRaWan,
            description: this.description,
            lastUplinkReceivedAt: this.lastUplinkReceivedAt,
            name: this.name,
            tags: this.tags.renderTags(),
            thingArn: this.thingArn,
            thingName: this.thingName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnWirelessGatewayPropsToCloudFormation(props);
    }
}

export namespace CfnWirelessGateway {
    /**
     * LoRaWAN wireless gateway object.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html
     */
    export interface LoRaWANGatewayProperty {
        /**
         * The gateway's EUI value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-gatewayeui
         */
        readonly gatewayEui: string;
        /**
         * The frequency band (RFRegion) value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotwireless-wirelessgateway-lorawangateway.html#cfn-iotwireless-wirelessgateway-lorawangateway-rfregion
         */
        readonly rfRegion: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoRaWANGatewayProperty`
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayProperty`
 *
 * @returns the result of the validation.
 */
function CfnWirelessGateway_LoRaWANGatewayPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gatewayEui', cdk.requiredValidator)(properties.gatewayEui));
    errors.collect(cdk.propertyValidator('gatewayEui', cdk.validateString)(properties.gatewayEui));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.requiredValidator)(properties.rfRegion));
    errors.collect(cdk.propertyValidator('rfRegion', cdk.validateString)(properties.rfRegion));
    return errors.wrap('supplied properties not correct for "LoRaWANGatewayProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessGateway.LoRaWANGateway` resource
 *
 * @param properties - the TypeScript properties of a `LoRaWANGatewayProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTWireless::WirelessGateway.LoRaWANGateway` resource.
 */
// @ts-ignore TS6133
function cfnWirelessGatewayLoRaWANGatewayPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnWirelessGateway_LoRaWANGatewayPropertyValidator(properties).assertSuccess();
    return {
        GatewayEui: cdk.stringToCloudFormation(properties.gatewayEui),
        RfRegion: cdk.stringToCloudFormation(properties.rfRegion),
    };
}

// @ts-ignore TS6133
function CfnWirelessGatewayLoRaWANGatewayPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWirelessGateway.LoRaWANGatewayProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWirelessGateway.LoRaWANGatewayProperty>();
    ret.addPropertyResult('gatewayEui', 'GatewayEui', cfn_parse.FromCloudFormation.getString(properties.GatewayEui));
    ret.addPropertyResult('rfRegion', 'RfRegion', cfn_parse.FromCloudFormation.getString(properties.RfRegion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
