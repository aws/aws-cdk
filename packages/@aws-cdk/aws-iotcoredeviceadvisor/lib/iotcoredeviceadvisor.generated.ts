// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:35.210Z","fingerprint":"6IGfZ4Mj1CW+QrlX4ywpDIGGwqyCPbMz97HKZhehPJQ="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnSuiteDefinition`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html
 */
export interface CfnSuiteDefinitionProps {

    /**
     * The configuration of the Suite Definition. Listed below are the required elements of the `SuiteDefinitionConfiguration` .
     *
     * - ***devicePermissionRoleArn*** - The device permission arn.
     *
     * This is a required element.
     *
     * *Type:* String
     * - ***devices*** - The list of configured devices under test. For more information on devices under test, see [DeviceUnderTest](https://docs.aws.amazon.com/iot/latest/apireference/API_iotdeviceadvisor_DeviceUnderTest.html)
     *
     * Not a required element.
     *
     * *Type:* List of devices under test
     * - ***intendedForQualification*** - The tests intended for qualification in a suite.
     *
     * Not a required element.
     *
     * *Type:* Boolean
     * - ***rootGroup*** - The test suite root group. For more information on creating and using root groups see the [Device Advisor workflow](https://docs.aws.amazon.com/iot/latest/developerguide/device-advisor-workflow.html) .
     *
     * This is a required element.
     *
     * *Type:* String
     * - ***suiteDefinitionName*** - The Suite Definition Configuration name.
     *
     * This is a required element.
     *
     * *Type:* String
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration
     */
    readonly suiteDefinitionConfiguration: any | cdk.IResolvable;

    /**
     * Metadata that can be used to manage the the Suite Definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnSuiteDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSuiteDefinitionProps`
 *
 * @returns the result of the validation.
 */
function CfnSuiteDefinitionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('suiteDefinitionConfiguration', cdk.requiredValidator)(properties.suiteDefinitionConfiguration));
    errors.collect(cdk.propertyValidator('suiteDefinitionConfiguration', cdk.validateObject)(properties.suiteDefinitionConfiguration));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSuiteDefinitionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition` resource
 *
 * @param properties - the TypeScript properties of a `CfnSuiteDefinitionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition` resource.
 */
// @ts-ignore TS6133
function cfnSuiteDefinitionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSuiteDefinitionPropsValidator(properties).assertSuccess();
    return {
        SuiteDefinitionConfiguration: cdk.objectToCloudFormation(properties.suiteDefinitionConfiguration),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSuiteDefinitionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinitionProps>();
    ret.addPropertyResult('suiteDefinitionConfiguration', 'SuiteDefinitionConfiguration', cfn_parse.FromCloudFormation.getAny(properties.SuiteDefinitionConfiguration));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::IoTCoreDeviceAdvisor::SuiteDefinition`
 *
 * Creates a Device Advisor test suite.
 *
 * Requires permission to access the [CreateSuiteDefinition](https://docs.aws.amazon.com//service-authorization/latest/reference/list_awsiot.html#awsiot-actions-as-permissions) action.
 *
 * @cloudformationResource AWS::IoTCoreDeviceAdvisor::SuiteDefinition
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html
 */
export class CfnSuiteDefinition extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTCoreDeviceAdvisor::SuiteDefinition";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSuiteDefinition {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSuiteDefinitionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSuiteDefinition(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Arn of the Suite Definition.
     * @cloudformationAttribute SuiteDefinitionArn
     */
    public readonly attrSuiteDefinitionArn: string;

    /**
     * The version of the Suite Definition.
     * @cloudformationAttribute SuiteDefinitionId
     */
    public readonly attrSuiteDefinitionId: string;

    /**
     * The ID of the Suite Definition.
     * @cloudformationAttribute SuiteDefinitionVersion
     */
    public readonly attrSuiteDefinitionVersion: string;

    /**
     * The configuration of the Suite Definition. Listed below are the required elements of the `SuiteDefinitionConfiguration` .
     *
     * - ***devicePermissionRoleArn*** - The device permission arn.
     *
     * This is a required element.
     *
     * *Type:* String
     * - ***devices*** - The list of configured devices under test. For more information on devices under test, see [DeviceUnderTest](https://docs.aws.amazon.com/iot/latest/apireference/API_iotdeviceadvisor_DeviceUnderTest.html)
     *
     * Not a required element.
     *
     * *Type:* List of devices under test
     * - ***intendedForQualification*** - The tests intended for qualification in a suite.
     *
     * Not a required element.
     *
     * *Type:* Boolean
     * - ***rootGroup*** - The test suite root group. For more information on creating and using root groups see the [Device Advisor workflow](https://docs.aws.amazon.com/iot/latest/developerguide/device-advisor-workflow.html) .
     *
     * This is a required element.
     *
     * *Type:* String
     * - ***suiteDefinitionName*** - The Suite Definition Configuration name.
     *
     * This is a required element.
     *
     * *Type:* String
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration
     */
    public suiteDefinitionConfiguration: any | cdk.IResolvable;

    /**
     * Metadata that can be used to manage the the Suite Definition.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotcoredeviceadvisor-suitedefinition.html#cfn-iotcoredeviceadvisor-suitedefinition-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::IoTCoreDeviceAdvisor::SuiteDefinition`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSuiteDefinitionProps) {
        super(scope, id, { type: CfnSuiteDefinition.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'suiteDefinitionConfiguration', this);
        this.attrSuiteDefinitionArn = cdk.Token.asString(this.getAtt('SuiteDefinitionArn', cdk.ResolutionTypeHint.STRING));
        this.attrSuiteDefinitionId = cdk.Token.asString(this.getAtt('SuiteDefinitionId', cdk.ResolutionTypeHint.STRING));
        this.attrSuiteDefinitionVersion = cdk.Token.asString(this.getAtt('SuiteDefinitionVersion', cdk.ResolutionTypeHint.STRING));

        this.suiteDefinitionConfiguration = props.suiteDefinitionConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTCoreDeviceAdvisor::SuiteDefinition", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSuiteDefinition.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            suiteDefinitionConfiguration: this.suiteDefinitionConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSuiteDefinitionPropsToCloudFormation(props);
    }
}

export namespace CfnSuiteDefinition {
    /**
     * Information of a test device. A thing ARN or a certificate ARN is required.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html
     */
    export interface DeviceUnderTestProperty {
        /**
         * Lists devices certificate ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html#cfn-iotcoredeviceadvisor-suitedefinition-deviceundertest-certificatearn
         */
        readonly certificateArn?: string;
        /**
         * Lists devices thing ARN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-deviceundertest.html#cfn-iotcoredeviceadvisor-suitedefinition-deviceundertest-thingarn
         */
        readonly thingArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeviceUnderTestProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceUnderTestProperty`
 *
 * @returns the result of the validation.
 */
function CfnSuiteDefinition_DeviceUnderTestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    errors.collect(cdk.propertyValidator('thingArn', cdk.validateString)(properties.thingArn));
    return errors.wrap('supplied properties not correct for "DeviceUnderTestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition.DeviceUnderTest` resource
 *
 * @param properties - the TypeScript properties of a `DeviceUnderTestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition.DeviceUnderTest` resource.
 */
// @ts-ignore TS6133
function cfnSuiteDefinitionDeviceUnderTestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSuiteDefinition_DeviceUnderTestPropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
        ThingArn: cdk.stringToCloudFormation(properties.thingArn),
    };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionDeviceUnderTestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSuiteDefinition.DeviceUnderTestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinition.DeviceUnderTestProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined);
    ret.addPropertyResult('thingArn', 'ThingArn', properties.ThingArn != null ? cfn_parse.FromCloudFormation.getString(properties.ThingArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSuiteDefinition {
    /**
     * Gets the suite definition configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html
     */
    export interface SuiteDefinitionConfigurationProperty {
        /**
         * Gets the device permission ARN. This is a required parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-devicepermissionrolearn
         */
        readonly devicePermissionRoleArn: string;
        /**
         * Gets the devices configured.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-devices
         */
        readonly devices?: Array<CfnSuiteDefinition.DeviceUnderTestProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Gets the tests intended for qualification in a suite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-intendedforqualification
         */
        readonly intendedForQualification?: boolean | cdk.IResolvable;
        /**
         * Gets the test suite root group. This is a required parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-rootgroup
         */
        readonly rootGroup: string;
        /**
         * Gets the suite definition name. This is a required parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration.html#cfn-iotcoredeviceadvisor-suitedefinition-suitedefinitionconfiguration-suitedefinitionname
         */
        readonly suiteDefinitionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SuiteDefinitionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SuiteDefinitionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSuiteDefinition_SuiteDefinitionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('devicePermissionRoleArn', cdk.requiredValidator)(properties.devicePermissionRoleArn));
    errors.collect(cdk.propertyValidator('devicePermissionRoleArn', cdk.validateString)(properties.devicePermissionRoleArn));
    errors.collect(cdk.propertyValidator('devices', cdk.listValidator(CfnSuiteDefinition_DeviceUnderTestPropertyValidator))(properties.devices));
    errors.collect(cdk.propertyValidator('intendedForQualification', cdk.validateBoolean)(properties.intendedForQualification));
    errors.collect(cdk.propertyValidator('rootGroup', cdk.requiredValidator)(properties.rootGroup));
    errors.collect(cdk.propertyValidator('rootGroup', cdk.validateString)(properties.rootGroup));
    errors.collect(cdk.propertyValidator('suiteDefinitionName', cdk.validateString)(properties.suiteDefinitionName));
    return errors.wrap('supplied properties not correct for "SuiteDefinitionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition.SuiteDefinitionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SuiteDefinitionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::IoTCoreDeviceAdvisor::SuiteDefinition.SuiteDefinitionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSuiteDefinitionSuiteDefinitionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSuiteDefinition_SuiteDefinitionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DevicePermissionRoleArn: cdk.stringToCloudFormation(properties.devicePermissionRoleArn),
        Devices: cdk.listMapper(cfnSuiteDefinitionDeviceUnderTestPropertyToCloudFormation)(properties.devices),
        IntendedForQualification: cdk.booleanToCloudFormation(properties.intendedForQualification),
        RootGroup: cdk.stringToCloudFormation(properties.rootGroup),
        SuiteDefinitionName: cdk.stringToCloudFormation(properties.suiteDefinitionName),
    };
}

// @ts-ignore TS6133
function CfnSuiteDefinitionSuiteDefinitionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSuiteDefinition.SuiteDefinitionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSuiteDefinition.SuiteDefinitionConfigurationProperty>();
    ret.addPropertyResult('devicePermissionRoleArn', 'DevicePermissionRoleArn', cfn_parse.FromCloudFormation.getString(properties.DevicePermissionRoleArn));
    ret.addPropertyResult('devices', 'Devices', properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnSuiteDefinitionDeviceUnderTestPropertyFromCloudFormation)(properties.Devices) : undefined);
    ret.addPropertyResult('intendedForQualification', 'IntendedForQualification', properties.IntendedForQualification != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IntendedForQualification) : undefined);
    ret.addPropertyResult('rootGroup', 'RootGroup', cfn_parse.FromCloudFormation.getString(properties.RootGroup));
    ret.addPropertyResult('suiteDefinitionName', 'SuiteDefinitionName', properties.SuiteDefinitionName != null ? cfn_parse.FromCloudFormation.getString(properties.SuiteDefinitionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
