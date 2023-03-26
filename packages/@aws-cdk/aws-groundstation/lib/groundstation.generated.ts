// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:22.210Z","fingerprint":"g2StUEh7/uyMO0fQL591cm6YeA0xxX8pCfLkP/GSKCo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export interface CfnConfigProps {

    /**
     * Object containing the parameters of a config. Only one subtype may be specified per config. See the subtype definitions for a description of each config subtype.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-configdata
     */
    readonly configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;

    /**
     * The name of the config object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-name
     */
    readonly name: string;

    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configData', cdk.requiredValidator)(properties.configData));
    errors.collect(cdk.propertyValidator('configData', CfnConfig_ConfigDataPropertyValidator)(properties.configData));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config` resource.
 */
// @ts-ignore TS6133
function cfnConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigPropsValidator(properties).assertSuccess();
    return {
        ConfigData: cfnConfigConfigDataPropertyToCloudFormation(properties.configData),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigProps>();
    ret.addPropertyResult('configData', 'ConfigData', CfnConfigConfigDataPropertyFromCloudFormation(properties.ConfigData));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::GroundStation::Config`
 *
 * Creates a `Config` with the specified parameters.
 *
 * Config objects provide Ground Station with the details necessary in order to schedule and execute satellite contacts.
 *
 * @cloudformationResource AWS::GroundStation::Config
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html
 */
export class CfnConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::Config";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the config, such as `arn:aws:groundstation:us-east-2:1234567890:config/tracking/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the config, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The type of the config, such as `tracking` .
     * @cloudformationAttribute Type
     */
    public readonly attrType: string;

    /**
     * Object containing the parameters of a config. Only one subtype may be specified per config. See the subtype definitions for a description of each config subtype.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-configdata
     */
    public configData: CfnConfig.ConfigDataProperty | cdk.IResolvable;

    /**
     * The name of the config object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-name
     */
    public name: string;

    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-config.html#cfn-groundstation-config-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::GroundStation::Config`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigProps) {
        super(scope, id, { type: CfnConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'configData', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrType = cdk.Token.asString(this.getAtt('Type', cdk.ResolutionTypeHint.STRING));

        this.configData = props.configData;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::Config", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            configData: this.configData,
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigPropsToCloudFormation(props);
    }
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink config in a mission profile to receive the downlink data in raw DigIF format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html
     */
    export interface AntennaDownlinkConfigProperty {
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkconfig.html#cfn-groundstation-config-antennadownlinkconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.SpectrumConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AntennaDownlinkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_AntennaDownlinkConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spectrumConfig', CfnConfig_SpectrumConfigPropertyValidator)(properties.spectrumConfig));
    return errors.wrap('supplied properties not correct for "AntennaDownlinkConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaDownlinkConfig` resource
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaDownlinkConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigAntennaDownlinkConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_AntennaDownlinkConfigPropertyValidator(properties).assertSuccess();
    return {
        SpectrumConfig: cfnConfigSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig),
    };
}

// @ts-ignore TS6133
function CfnConfigAntennaDownlinkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaDownlinkConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaDownlinkConfigProperty>();
    ret.addPropertyResult('spectrumConfig', 'SpectrumConfig', properties.SpectrumConfig != null ? CfnConfigSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for downlink during a contact. Use an antenna downlink demod decode config in a mission profile to receive the downlink data that has been demodulated and decoded.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html
     */
    export interface AntennaDownlinkDemodDecodeConfigProperty {
        /**
         * Defines how the RF signal will be decoded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-decodeconfig
         */
        readonly decodeConfig?: CfnConfig.DecodeConfigProperty | cdk.IResolvable;
        /**
         * Defines how the RF signal will be demodulated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-demodulationconfig
         */
        readonly demodulationConfig?: CfnConfig.DemodulationConfigProperty | cdk.IResolvable;
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennadownlinkdemoddecodeconfig.html#cfn-groundstation-config-antennadownlinkdemoddecodeconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.SpectrumConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AntennaDownlinkDemodDecodeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkDemodDecodeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_AntennaDownlinkDemodDecodeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('decodeConfig', CfnConfig_DecodeConfigPropertyValidator)(properties.decodeConfig));
    errors.collect(cdk.propertyValidator('demodulationConfig', CfnConfig_DemodulationConfigPropertyValidator)(properties.demodulationConfig));
    errors.collect(cdk.propertyValidator('spectrumConfig', CfnConfig_SpectrumConfigPropertyValidator)(properties.spectrumConfig));
    return errors.wrap('supplied properties not correct for "AntennaDownlinkDemodDecodeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaDownlinkDemodDecodeConfig` resource
 *
 * @param properties - the TypeScript properties of a `AntennaDownlinkDemodDecodeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaDownlinkDemodDecodeConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigAntennaDownlinkDemodDecodeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_AntennaDownlinkDemodDecodeConfigPropertyValidator(properties).assertSuccess();
    return {
        DecodeConfig: cfnConfigDecodeConfigPropertyToCloudFormation(properties.decodeConfig),
        DemodulationConfig: cfnConfigDemodulationConfigPropertyToCloudFormation(properties.demodulationConfig),
        SpectrumConfig: cfnConfigSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig),
    };
}

// @ts-ignore TS6133
function CfnConfigAntennaDownlinkDemodDecodeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaDownlinkDemodDecodeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaDownlinkDemodDecodeConfigProperty>();
    ret.addPropertyResult('decodeConfig', 'DecodeConfig', properties.DecodeConfig != null ? CfnConfigDecodeConfigPropertyFromCloudFormation(properties.DecodeConfig) : undefined);
    ret.addPropertyResult('demodulationConfig', 'DemodulationConfig', properties.DemodulationConfig != null ? CfnConfigDemodulationConfigPropertyFromCloudFormation(properties.DemodulationConfig) : undefined);
    ret.addPropertyResult('spectrumConfig', 'SpectrumConfig', properties.SpectrumConfig != null ? CfnConfigSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should configure an antenna for uplink during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html
     */
    export interface AntennaUplinkConfigProperty {
        /**
         * Defines the spectrum configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-spectrumconfig
         */
        readonly spectrumConfig?: CfnConfig.UplinkSpectrumConfigProperty | cdk.IResolvable;
        /**
         * The equivalent isotropically radiated power (EIRP) to use for uplink transmissions. Valid values are between 20.0 to 50.0 dBW.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-targeteirp
         */
        readonly targetEirp?: CfnConfig.EirpProperty | cdk.IResolvable;
        /**
         * Whether or not uplink transmit is disabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-antennauplinkconfig.html#cfn-groundstation-config-antennauplinkconfig-transmitdisabled
         */
        readonly transmitDisabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AntennaUplinkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AntennaUplinkConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_AntennaUplinkConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('spectrumConfig', CfnConfig_UplinkSpectrumConfigPropertyValidator)(properties.spectrumConfig));
    errors.collect(cdk.propertyValidator('targetEirp', CfnConfig_EirpPropertyValidator)(properties.targetEirp));
    errors.collect(cdk.propertyValidator('transmitDisabled', cdk.validateBoolean)(properties.transmitDisabled));
    return errors.wrap('supplied properties not correct for "AntennaUplinkConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaUplinkConfig` resource
 *
 * @param properties - the TypeScript properties of a `AntennaUplinkConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.AntennaUplinkConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigAntennaUplinkConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_AntennaUplinkConfigPropertyValidator(properties).assertSuccess();
    return {
        SpectrumConfig: cfnConfigUplinkSpectrumConfigPropertyToCloudFormation(properties.spectrumConfig),
        TargetEirp: cfnConfigEirpPropertyToCloudFormation(properties.targetEirp),
        TransmitDisabled: cdk.booleanToCloudFormation(properties.transmitDisabled),
    };
}

// @ts-ignore TS6133
function CfnConfigAntennaUplinkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.AntennaUplinkConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.AntennaUplinkConfigProperty>();
    ret.addPropertyResult('spectrumConfig', 'SpectrumConfig', properties.SpectrumConfig != null ? CfnConfigUplinkSpectrumConfigPropertyFromCloudFormation(properties.SpectrumConfig) : undefined);
    ret.addPropertyResult('targetEirp', 'TargetEirp', properties.TargetEirp != null ? CfnConfigEirpPropertyFromCloudFormation(properties.TargetEirp) : undefined);
    ret.addPropertyResult('transmitDisabled', 'TransmitDisabled', properties.TransmitDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TransmitDisabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Config objects provide information to Ground Station about how to configure the antenna and how data flows during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html
     */
    export interface ConfigDataProperty {
        /**
         * Provides information for an antenna downlink config object. Antenna downlink config objects are used to provide parameters for downlinks where no demodulation or decoding is performed by Ground Station (RF over IP downlinks).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkconfig
         */
        readonly antennaDownlinkConfig?: CfnConfig.AntennaDownlinkConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a downlink demod decode config object. Downlink demod decode config objects are used to provide parameters for downlinks where the Ground Station service will demodulate and decode the downlinked data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennadownlinkdemoddecodeconfig
         */
        readonly antennaDownlinkDemodDecodeConfig?: CfnConfig.AntennaDownlinkDemodDecodeConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an uplink config object. Uplink config objects are used to provide parameters for uplink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-antennauplinkconfig
         */
        readonly antennaUplinkConfig?: CfnConfig.AntennaUplinkConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a dataflow endpoint config object. Dataflow endpoint config objects are used to provide parameters about which IP endpoint(s) to use during a contact. Dataflow endpoints are where Ground Station sends data during a downlink contact and where Ground Station receives data to send to the satellite during an uplink contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-dataflowendpointconfig
         */
        readonly dataflowEndpointConfig?: CfnConfig.DataflowEndpointConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an S3 recording config object. S3 recording config objects are used to provide parameters for S3 recording during downlink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-s3recordingconfig
         */
        readonly s3RecordingConfig?: CfnConfig.S3RecordingConfigProperty | cdk.IResolvable;
        /**
         * Provides information for a tracking config object. Tracking config objects are used to provide parameters about how to track the satellite through the sky during a contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-trackingconfig
         */
        readonly trackingConfig?: CfnConfig.TrackingConfigProperty | cdk.IResolvable;
        /**
         * Provides information for an uplink echo config object. Uplink echo config objects are used to provide parameters for uplink echo during uplink contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-configdata.html#cfn-groundstation-config-configdata-uplinkechoconfig
         */
        readonly uplinkEchoConfig?: CfnConfig.UplinkEchoConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConfigDataProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigDataProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_ConfigDataPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('antennaDownlinkConfig', CfnConfig_AntennaDownlinkConfigPropertyValidator)(properties.antennaDownlinkConfig));
    errors.collect(cdk.propertyValidator('antennaDownlinkDemodDecodeConfig', CfnConfig_AntennaDownlinkDemodDecodeConfigPropertyValidator)(properties.antennaDownlinkDemodDecodeConfig));
    errors.collect(cdk.propertyValidator('antennaUplinkConfig', CfnConfig_AntennaUplinkConfigPropertyValidator)(properties.antennaUplinkConfig));
    errors.collect(cdk.propertyValidator('dataflowEndpointConfig', CfnConfig_DataflowEndpointConfigPropertyValidator)(properties.dataflowEndpointConfig));
    errors.collect(cdk.propertyValidator('s3RecordingConfig', CfnConfig_S3RecordingConfigPropertyValidator)(properties.s3RecordingConfig));
    errors.collect(cdk.propertyValidator('trackingConfig', CfnConfig_TrackingConfigPropertyValidator)(properties.trackingConfig));
    errors.collect(cdk.propertyValidator('uplinkEchoConfig', CfnConfig_UplinkEchoConfigPropertyValidator)(properties.uplinkEchoConfig));
    return errors.wrap('supplied properties not correct for "ConfigDataProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.ConfigData` resource
 *
 * @param properties - the TypeScript properties of a `ConfigDataProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.ConfigData` resource.
 */
// @ts-ignore TS6133
function cfnConfigConfigDataPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_ConfigDataPropertyValidator(properties).assertSuccess();
    return {
        AntennaDownlinkConfig: cfnConfigAntennaDownlinkConfigPropertyToCloudFormation(properties.antennaDownlinkConfig),
        AntennaDownlinkDemodDecodeConfig: cfnConfigAntennaDownlinkDemodDecodeConfigPropertyToCloudFormation(properties.antennaDownlinkDemodDecodeConfig),
        AntennaUplinkConfig: cfnConfigAntennaUplinkConfigPropertyToCloudFormation(properties.antennaUplinkConfig),
        DataflowEndpointConfig: cfnConfigDataflowEndpointConfigPropertyToCloudFormation(properties.dataflowEndpointConfig),
        S3RecordingConfig: cfnConfigS3RecordingConfigPropertyToCloudFormation(properties.s3RecordingConfig),
        TrackingConfig: cfnConfigTrackingConfigPropertyToCloudFormation(properties.trackingConfig),
        UplinkEchoConfig: cfnConfigUplinkEchoConfigPropertyToCloudFormation(properties.uplinkEchoConfig),
    };
}

// @ts-ignore TS6133
function CfnConfigConfigDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.ConfigDataProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.ConfigDataProperty>();
    ret.addPropertyResult('antennaDownlinkConfig', 'AntennaDownlinkConfig', properties.AntennaDownlinkConfig != null ? CfnConfigAntennaDownlinkConfigPropertyFromCloudFormation(properties.AntennaDownlinkConfig) : undefined);
    ret.addPropertyResult('antennaDownlinkDemodDecodeConfig', 'AntennaDownlinkDemodDecodeConfig', properties.AntennaDownlinkDemodDecodeConfig != null ? CfnConfigAntennaDownlinkDemodDecodeConfigPropertyFromCloudFormation(properties.AntennaDownlinkDemodDecodeConfig) : undefined);
    ret.addPropertyResult('antennaUplinkConfig', 'AntennaUplinkConfig', properties.AntennaUplinkConfig != null ? CfnConfigAntennaUplinkConfigPropertyFromCloudFormation(properties.AntennaUplinkConfig) : undefined);
    ret.addPropertyResult('dataflowEndpointConfig', 'DataflowEndpointConfig', properties.DataflowEndpointConfig != null ? CfnConfigDataflowEndpointConfigPropertyFromCloudFormation(properties.DataflowEndpointConfig) : undefined);
    ret.addPropertyResult('s3RecordingConfig', 'S3RecordingConfig', properties.S3RecordingConfig != null ? CfnConfigS3RecordingConfigPropertyFromCloudFormation(properties.S3RecordingConfig) : undefined);
    ret.addPropertyResult('trackingConfig', 'TrackingConfig', properties.TrackingConfig != null ? CfnConfigTrackingConfigPropertyFromCloudFormation(properties.TrackingConfig) : undefined);
    ret.addPropertyResult('uplinkEchoConfig', 'UplinkEchoConfig', properties.UplinkEchoConfig != null ? CfnConfigUplinkEchoConfigPropertyFromCloudFormation(properties.UplinkEchoConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information to AWS Ground Station about which IP endpoints to use during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html
     */
    export interface DataflowEndpointConfigProperty {
        /**
         * The name of the dataflow endpoint to use during contacts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointname
         */
        readonly dataflowEndpointName?: string;
        /**
         * The region of the dataflow endpoint to use during contacts. When omitted, Ground Station will use the region of the contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-dataflowendpointconfig.html#cfn-groundstation-config-dataflowendpointconfig-dataflowendpointregion
         */
        readonly dataflowEndpointRegion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataflowEndpointConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_DataflowEndpointConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dataflowEndpointName', cdk.validateString)(properties.dataflowEndpointName));
    errors.collect(cdk.propertyValidator('dataflowEndpointRegion', cdk.validateString)(properties.dataflowEndpointRegion));
    return errors.wrap('supplied properties not correct for "DataflowEndpointConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.DataflowEndpointConfig` resource
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.DataflowEndpointConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigDataflowEndpointConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_DataflowEndpointConfigPropertyValidator(properties).assertSuccess();
    return {
        DataflowEndpointName: cdk.stringToCloudFormation(properties.dataflowEndpointName),
        DataflowEndpointRegion: cdk.stringToCloudFormation(properties.dataflowEndpointRegion),
    };
}

// @ts-ignore TS6133
function CfnConfigDataflowEndpointConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DataflowEndpointConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DataflowEndpointConfigProperty>();
    ret.addPropertyResult('dataflowEndpointName', 'DataflowEndpointName', properties.DataflowEndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.DataflowEndpointName) : undefined);
    ret.addPropertyResult('dataflowEndpointRegion', 'DataflowEndpointRegion', properties.DataflowEndpointRegion != null ? cfn_parse.FromCloudFormation.getString(properties.DataflowEndpointRegion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines decoding settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html
     */
    export interface DecodeConfigProperty {
        /**
         * The decoding settings are in JSON format and define a set of steps to perform to decode the data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-decodeconfig.html#cfn-groundstation-config-decodeconfig-unvalidatedjson
         */
        readonly unvalidatedJson?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DecodeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DecodeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_DecodeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('unvalidatedJson', cdk.validateString)(properties.unvalidatedJson));
    return errors.wrap('supplied properties not correct for "DecodeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.DecodeConfig` resource
 *
 * @param properties - the TypeScript properties of a `DecodeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.DecodeConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigDecodeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_DecodeConfigPropertyValidator(properties).assertSuccess();
    return {
        UnvalidatedJSON: cdk.stringToCloudFormation(properties.unvalidatedJson),
    };
}

// @ts-ignore TS6133
function CfnConfigDecodeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DecodeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DecodeConfigProperty>();
    ret.addPropertyResult('unvalidatedJson', 'UnvalidatedJSON', properties.UnvalidatedJSON != null ? cfn_parse.FromCloudFormation.getString(properties.UnvalidatedJSON) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines demodulation settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html
     */
    export interface DemodulationConfigProperty {
        /**
         * The demodulation settings are in JSON format and define parameters for demodulation, for example which modulation scheme (e.g. PSK, QPSK, etc.) and matched filter to use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-demodulationconfig.html#cfn-groundstation-config-demodulationconfig-unvalidatedjson
         */
        readonly unvalidatedJson?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DemodulationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DemodulationConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_DemodulationConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('unvalidatedJson', cdk.validateString)(properties.unvalidatedJson));
    return errors.wrap('supplied properties not correct for "DemodulationConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.DemodulationConfig` resource
 *
 * @param properties - the TypeScript properties of a `DemodulationConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.DemodulationConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigDemodulationConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_DemodulationConfigPropertyValidator(properties).assertSuccess();
    return {
        UnvalidatedJSON: cdk.stringToCloudFormation(properties.unvalidatedJson),
    };
}

// @ts-ignore TS6133
function CfnConfigDemodulationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.DemodulationConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.DemodulationConfigProperty>();
    ret.addPropertyResult('unvalidatedJson', 'UnvalidatedJSON', properties.UnvalidatedJSON != null ? cfn_parse.FromCloudFormation.getString(properties.UnvalidatedJSON) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines an equivalent isotropically radiated power (EIRP).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html
     */
    export interface EirpProperty {
        /**
         * The units of the EIRP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-units
         */
        readonly units?: string;
        /**
         * The value of the EIRP. Valid values are between 20.0 to 50.0 dBW.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-eirp.html#cfn-groundstation-config-eirp-value
         */
        readonly value?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EirpProperty`
 *
 * @param properties - the TypeScript properties of a `EirpProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_EirpPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('units', cdk.validateString)(properties.units));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "EirpProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.Eirp` resource
 *
 * @param properties - the TypeScript properties of a `EirpProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.Eirp` resource.
 */
// @ts-ignore TS6133
function cfnConfigEirpPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_EirpPropertyValidator(properties).assertSuccess();
    return {
        Units: cdk.stringToCloudFormation(properties.units),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigEirpPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.EirpProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.EirpProperty>();
    ret.addPropertyResult('units', 'Units', properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines a frequency.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html
     */
    export interface FrequencyProperty {
        /**
         * The units of the frequency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-units
         */
        readonly units?: string;
        /**
         * The value of the frequency. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequency.html#cfn-groundstation-config-frequency-value
         */
        readonly value?: number;
    }
}

/**
 * Determine whether the given properties match those of a `FrequencyProperty`
 *
 * @param properties - the TypeScript properties of a `FrequencyProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_FrequencyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('units', cdk.validateString)(properties.units));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "FrequencyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.Frequency` resource
 *
 * @param properties - the TypeScript properties of a `FrequencyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.Frequency` resource.
 */
// @ts-ignore TS6133
function cfnConfigFrequencyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_FrequencyPropertyValidator(properties).assertSuccess();
    return {
        Units: cdk.stringToCloudFormation(properties.units),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigFrequencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.FrequencyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.FrequencyProperty>();
    ret.addPropertyResult('units', 'Units', properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines a bandwidth.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html
     */
    export interface FrequencyBandwidthProperty {
        /**
         * The units of the bandwidth.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-units
         */
        readonly units?: string;
        /**
         * The value of the bandwidth. AWS Ground Station currently has the following bandwidth limitations:
         *
         * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
         * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
         * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-frequencybandwidth.html#cfn-groundstation-config-frequencybandwidth-value
         */
        readonly value?: number;
    }
}

/**
 * Determine whether the given properties match those of a `FrequencyBandwidthProperty`
 *
 * @param properties - the TypeScript properties of a `FrequencyBandwidthProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_FrequencyBandwidthPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('units', cdk.validateString)(properties.units));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "FrequencyBandwidthProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.FrequencyBandwidth` resource
 *
 * @param properties - the TypeScript properties of a `FrequencyBandwidthProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.FrequencyBandwidth` resource.
 */
// @ts-ignore TS6133
function cfnConfigFrequencyBandwidthPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_FrequencyBandwidthPropertyValidator(properties).assertSuccess();
    return {
        Units: cdk.stringToCloudFormation(properties.units),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigFrequencyBandwidthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.FrequencyBandwidthProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.FrequencyBandwidthProperty>();
    ret.addPropertyResult('units', 'Units', properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should save downlink data to S3.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html
     */
    export interface S3RecordingConfigProperty {
        /**
         * S3 Bucket where the data is written. The name of the S3 Bucket provided must begin with `aws-groundstation` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-bucketarn
         */
        readonly bucketArn?: string;
        /**
         * The prefix of the S3 data object. If you choose to use any optional keys for substitution, these values will be replaced with the corresponding information from your contact details. For example, a prefix of `{satellite_id}/{year}/{month}/{day}/` will replaced with `fake_satellite_id/2021/01/10/`
         *
         * *Optional keys for substitution* : `{satellite_id}` | `{config-name}` | `{config-id}` | `{year}` | `{month}` | `{day}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-prefix
         */
        readonly prefix?: string;
        /**
         * Defines the ARN of the role assumed for putting archives to S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-s3recordingconfig.html#cfn-groundstation-config-s3recordingconfig-rolearn
         */
        readonly roleArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3RecordingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3RecordingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_S3RecordingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bucketArn', cdk.validateString)(properties.bucketArn));
    errors.collect(cdk.propertyValidator('prefix', cdk.validateString)(properties.prefix));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "S3RecordingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.S3RecordingConfig` resource
 *
 * @param properties - the TypeScript properties of a `S3RecordingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.S3RecordingConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigS3RecordingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_S3RecordingConfigPropertyValidator(properties).assertSuccess();
    return {
        BucketArn: cdk.stringToCloudFormation(properties.bucketArn),
        Prefix: cdk.stringToCloudFormation(properties.prefix),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnConfigS3RecordingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.S3RecordingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.S3RecordingConfigProperty>();
    ret.addPropertyResult('bucketArn', 'BucketArn', properties.BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketArn) : undefined);
    ret.addPropertyResult('prefix', 'Prefix', properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines a spectrum.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html
     */
    export interface SpectrumConfigProperty {
        /**
         * The bandwidth of the spectrum. AWS Ground Station currently has the following bandwidth limitations:
         *
         * - For `AntennaDownlinkDemodDecodeconfig` , valid values are between 125 kHz to 650 MHz.
         * - For `AntennaDownlinkconfig` , valid values are between 10 kHz to 54 MHz.
         * - For `AntennaUplinkConfig` , valid values are between 10 kHz to 54 MHz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-bandwidth
         */
        readonly bandwidth?: CfnConfig.FrequencyBandwidthProperty | cdk.IResolvable;
        /**
         * The center frequency of the spectrum. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-centerfrequency
         */
        readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;
        /**
         * The polarization of the spectrum. Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` . Capturing both `"RIGHT_HAND"` and `"LEFT_HAND"` polarization requires two separate configs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-spectrumconfig.html#cfn-groundstation-config-spectrumconfig-polarization
         */
        readonly polarization?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SpectrumConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SpectrumConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_SpectrumConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidth', CfnConfig_FrequencyBandwidthPropertyValidator)(properties.bandwidth));
    errors.collect(cdk.propertyValidator('centerFrequency', CfnConfig_FrequencyPropertyValidator)(properties.centerFrequency));
    errors.collect(cdk.propertyValidator('polarization', cdk.validateString)(properties.polarization));
    return errors.wrap('supplied properties not correct for "SpectrumConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.SpectrumConfig` resource
 *
 * @param properties - the TypeScript properties of a `SpectrumConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.SpectrumConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigSpectrumConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_SpectrumConfigPropertyValidator(properties).assertSuccess();
    return {
        Bandwidth: cfnConfigFrequencyBandwidthPropertyToCloudFormation(properties.bandwidth),
        CenterFrequency: cfnConfigFrequencyPropertyToCloudFormation(properties.centerFrequency),
        Polarization: cdk.stringToCloudFormation(properties.polarization),
    };
}

// @ts-ignore TS6133
function CfnConfigSpectrumConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.SpectrumConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.SpectrumConfigProperty>();
    ret.addPropertyResult('bandwidth', 'Bandwidth', properties.Bandwidth != null ? CfnConfigFrequencyBandwidthPropertyFromCloudFormation(properties.Bandwidth) : undefined);
    ret.addPropertyResult('centerFrequency', 'CenterFrequency', properties.CenterFrequency != null ? CfnConfigFrequencyPropertyFromCloudFormation(properties.CenterFrequency) : undefined);
    ret.addPropertyResult('polarization', 'Polarization', properties.Polarization != null ? cfn_parse.FromCloudFormation.getString(properties.Polarization) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should track the satellite through the sky during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html
     */
    export interface TrackingConfigProperty {
        /**
         * Specifies whether or not to use autotrack. `REMOVED` specifies that program track should only be used during the contact. `PREFERRED` specifies that autotracking is preferred during the contact but fallback to program track if the signal is lost. `REQUIRED` specifies that autotracking is required during the contact and not to use program track if the signal is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-trackingconfig.html#cfn-groundstation-config-trackingconfig-autotrack
         */
        readonly autotrack?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TrackingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TrackingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_TrackingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autotrack', cdk.validateString)(properties.autotrack));
    return errors.wrap('supplied properties not correct for "TrackingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.TrackingConfig` resource
 *
 * @param properties - the TypeScript properties of a `TrackingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.TrackingConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigTrackingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_TrackingConfigPropertyValidator(properties).assertSuccess();
    return {
        Autotrack: cdk.stringToCloudFormation(properties.autotrack),
    };
}

// @ts-ignore TS6133
function CfnConfigTrackingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.TrackingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.TrackingConfigProperty>();
    ret.addPropertyResult('autotrack', 'Autotrack', properties.Autotrack != null ? cfn_parse.FromCloudFormation.getString(properties.Autotrack) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Provides information about how AWS Ground Station should echo back uplink transmissions to a dataflow endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html
     */
    export interface UplinkEchoConfigProperty {
        /**
         * Defines the ARN of the uplink config to echo back to a dataflow endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-antennauplinkconfigarn
         */
        readonly antennaUplinkConfigArn?: string;
        /**
         * Whether or not uplink echo is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkechoconfig.html#cfn-groundstation-config-uplinkechoconfig-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `UplinkEchoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UplinkEchoConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_UplinkEchoConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('antennaUplinkConfigArn', cdk.validateString)(properties.antennaUplinkConfigArn));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "UplinkEchoConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.UplinkEchoConfig` resource
 *
 * @param properties - the TypeScript properties of a `UplinkEchoConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.UplinkEchoConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigUplinkEchoConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_UplinkEchoConfigPropertyValidator(properties).assertSuccess();
    return {
        AntennaUplinkConfigArn: cdk.stringToCloudFormation(properties.antennaUplinkConfigArn),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnConfigUplinkEchoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.UplinkEchoConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.UplinkEchoConfigProperty>();
    ret.addPropertyResult('antennaUplinkConfigArn', 'AntennaUplinkConfigArn', properties.AntennaUplinkConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.AntennaUplinkConfigArn) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfig {
    /**
     * Defines a uplink spectrum.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html
     */
    export interface UplinkSpectrumConfigProperty {
        /**
         * The center frequency of the spectrum. Valid values are between 2200 to 2300 MHz and 7750 to 8400 MHz for downlink and 2025 to 2120 MHz for uplink.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-centerfrequency
         */
        readonly centerFrequency?: CfnConfig.FrequencyProperty | cdk.IResolvable;
        /**
         * The polarization of the spectrum. Valid values are `"RIGHT_HAND"` and `"LEFT_HAND"` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-config-uplinkspectrumconfig.html#cfn-groundstation-config-uplinkspectrumconfig-polarization
         */
        readonly polarization?: string;
    }
}

/**
 * Determine whether the given properties match those of a `UplinkSpectrumConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UplinkSpectrumConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfig_UplinkSpectrumConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('centerFrequency', CfnConfig_FrequencyPropertyValidator)(properties.centerFrequency));
    errors.collect(cdk.propertyValidator('polarization', cdk.validateString)(properties.polarization));
    return errors.wrap('supplied properties not correct for "UplinkSpectrumConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::Config.UplinkSpectrumConfig` resource
 *
 * @param properties - the TypeScript properties of a `UplinkSpectrumConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::Config.UplinkSpectrumConfig` resource.
 */
// @ts-ignore TS6133
function cfnConfigUplinkSpectrumConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfig_UplinkSpectrumConfigPropertyValidator(properties).assertSuccess();
    return {
        CenterFrequency: cfnConfigFrequencyPropertyToCloudFormation(properties.centerFrequency),
        Polarization: cdk.stringToCloudFormation(properties.polarization),
    };
}

// @ts-ignore TS6133
function CfnConfigUplinkSpectrumConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfig.UplinkSpectrumConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfig.UplinkSpectrumConfigProperty>();
    ret.addPropertyResult('centerFrequency', 'CenterFrequency', properties.CenterFrequency != null ? CfnConfigFrequencyPropertyFromCloudFormation(properties.CenterFrequency) : undefined);
    ret.addPropertyResult('polarization', 'Polarization', properties.Polarization != null ? cfn_parse.FromCloudFormation.getString(properties.Polarization) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDataflowEndpointGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export interface CfnDataflowEndpointGroupProps {

    /**
     * List of Endpoint Details, containing address and port for each endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-endpointdetails
     */
    readonly endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnDataflowEndpointGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataflowEndpointGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnDataflowEndpointGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpointDetails', cdk.requiredValidator)(properties.endpointDetails));
    errors.collect(cdk.propertyValidator('endpointDetails', cdk.listValidator(CfnDataflowEndpointGroup_EndpointDetailsPropertyValidator))(properties.endpointDetails));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDataflowEndpointGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnDataflowEndpointGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup` resource.
 */
// @ts-ignore TS6133
function cfnDataflowEndpointGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataflowEndpointGroupPropsValidator(properties).assertSuccess();
    return {
        EndpointDetails: cdk.listMapper(cfnDataflowEndpointGroupEndpointDetailsPropertyToCloudFormation)(properties.endpointDetails),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroupProps>();
    ret.addPropertyResult('endpointDetails', 'EndpointDetails', cfn_parse.FromCloudFormation.getArray(CfnDataflowEndpointGroupEndpointDetailsPropertyFromCloudFormation)(properties.EndpointDetails));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::GroundStation::DataflowEndpointGroup`
 *
 * Creates a Dataflow Endpoint Group request.
 *
 * Dataflow endpoint groups contain a list of endpoints. When the name of a dataflow endpoint group is specified in a mission profile, the Ground Station service will connect to the endpoints and flow data during a contact.
 *
 * For more information about dataflow endpoint groups, see [Dataflow Endpoint Groups](https://docs.aws.amazon.com/ground-station/latest/ug/dataflowendpointgroups.html) .
 *
 * @cloudformationResource AWS::GroundStation::DataflowEndpointGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html
 */
export class CfnDataflowEndpointGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::DataflowEndpointGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataflowEndpointGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDataflowEndpointGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDataflowEndpointGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the dataflow endpoint group, such as `arn:aws:groundstation:us-east-2:1234567890:dataflow-endpoint-group/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * UUID of a dataflow endpoint group.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * List of Endpoint Details, containing address and port for each endpoint.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-endpointdetails
     */
    public endpointDetails: Array<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Tags assigned to a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-dataflowendpointgroup.html#cfn-groundstation-dataflowendpointgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::GroundStation::DataflowEndpointGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDataflowEndpointGroupProps) {
        super(scope, id, { type: CfnDataflowEndpointGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'endpointDetails', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.endpointDetails = props.endpointDetails;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::DataflowEndpointGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataflowEndpointGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            endpointDetails: this.endpointDetails,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDataflowEndpointGroupPropsToCloudFormation(props);
    }
}

export namespace CfnDataflowEndpointGroup {
    /**
     * Contains information such as socket address and name that defines an endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html
     */
    export interface DataflowEndpointProperty {
        /**
         * The address and port of an endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-address
         */
        readonly address?: CfnDataflowEndpointGroup.SocketAddressProperty | cdk.IResolvable;
        /**
         * Maximum transmission unit (MTU) size in bytes of a dataflow endpoint. Valid values are between 1400 and 1500. A default value of 1500 is used if not set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-mtu
         */
        readonly mtu?: number;
        /**
         * The endpoint name.
         *
         * When listing available contacts for a satellite, Ground Station searches for a dataflow endpoint whose name matches the value specified by the dataflow endpoint config of the selected mission profile. If no matching dataflow endpoints are found then Ground Station will not display any available contacts for the satellite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-dataflowendpoint.html#cfn-groundstation-dataflowendpointgroup-dataflowendpoint-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataflowEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataflowEndpointGroup_DataflowEndpointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('address', CfnDataflowEndpointGroup_SocketAddressPropertyValidator)(properties.address));
    errors.collect(cdk.propertyValidator('mtu', cdk.validateNumber)(properties.mtu));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "DataflowEndpointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.DataflowEndpoint` resource
 *
 * @param properties - the TypeScript properties of a `DataflowEndpointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.DataflowEndpoint` resource.
 */
// @ts-ignore TS6133
function cfnDataflowEndpointGroupDataflowEndpointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataflowEndpointGroup_DataflowEndpointPropertyValidator(properties).assertSuccess();
    return {
        Address: cfnDataflowEndpointGroupSocketAddressPropertyToCloudFormation(properties.address),
        Mtu: cdk.numberToCloudFormation(properties.mtu),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupDataflowEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.DataflowEndpointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.DataflowEndpointProperty>();
    ret.addPropertyResult('address', 'Address', properties.Address != null ? CfnDataflowEndpointGroupSocketAddressPropertyFromCloudFormation(properties.Address) : undefined);
    ret.addPropertyResult('mtu', 'Mtu', properties.Mtu != null ? cfn_parse.FromCloudFormation.getNumber(properties.Mtu) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataflowEndpointGroup {
    /**
     * The security details and endpoint information.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html
     */
    export interface EndpointDetailsProperty {
        /**
         * Information about the endpoint such as name and the endpoint address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-endpoint
         */
        readonly endpoint?: CfnDataflowEndpointGroup.DataflowEndpointProperty | cdk.IResolvable;
        /**
         * The role ARN, and IDs for security groups and subnets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-endpointdetails.html#cfn-groundstation-dataflowendpointgroup-endpointdetails-securitydetails
         */
        readonly securityDetails?: CfnDataflowEndpointGroup.SecurityDetailsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EndpointDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataflowEndpointGroup_EndpointDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoint', CfnDataflowEndpointGroup_DataflowEndpointPropertyValidator)(properties.endpoint));
    errors.collect(cdk.propertyValidator('securityDetails', CfnDataflowEndpointGroup_SecurityDetailsPropertyValidator)(properties.securityDetails));
    return errors.wrap('supplied properties not correct for "EndpointDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.EndpointDetails` resource
 *
 * @param properties - the TypeScript properties of a `EndpointDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.EndpointDetails` resource.
 */
// @ts-ignore TS6133
function cfnDataflowEndpointGroupEndpointDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataflowEndpointGroup_EndpointDetailsPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cfnDataflowEndpointGroupDataflowEndpointPropertyToCloudFormation(properties.endpoint),
        SecurityDetails: cfnDataflowEndpointGroupSecurityDetailsPropertyToCloudFormation(properties.securityDetails),
    };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupEndpointDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.EndpointDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.EndpointDetailsProperty>();
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? CfnDataflowEndpointGroupDataflowEndpointPropertyFromCloudFormation(properties.Endpoint) : undefined);
    ret.addPropertyResult('securityDetails', 'SecurityDetails', properties.SecurityDetails != null ? CfnDataflowEndpointGroupSecurityDetailsPropertyFromCloudFormation(properties.SecurityDetails) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataflowEndpointGroup {
    /**
     * Information about IAM roles, subnets, and security groups needed for this DataflowEndpointGroup.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html
     */
    export interface SecurityDetailsProperty {
        /**
         * The ARN of a role which Ground Station has permission to assume, such as `arn:aws:iam::1234567890:role/DataDeliveryServiceRole` .
         *
         * Ground Station will assume this role and create an ENI in your VPC on the specified subnet upon creation of a dataflow endpoint group. This ENI is used as the ingress/egress point for data streamed during a satellite contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-rolearn
         */
        readonly roleArn?: string;
        /**
         * The security group Ids of the security role, such as `sg-1234567890abcdef0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The subnet Ids of the security details, such as `subnet-12345678` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-securitydetails.html#cfn-groundstation-dataflowendpointgroup-securitydetails-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SecurityDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataflowEndpointGroup_SecurityDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "SecurityDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.SecurityDetails` resource
 *
 * @param properties - the TypeScript properties of a `SecurityDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.SecurityDetails` resource.
 */
// @ts-ignore TS6133
function cfnDataflowEndpointGroupSecurityDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataflowEndpointGroup_SecurityDetailsPropertyValidator(properties).assertSuccess();
    return {
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupSecurityDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.SecurityDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.SecurityDetailsProperty>();
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnDataflowEndpointGroup {
    /**
     * The address of the endpoint, such as `192.168.1.1` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html
     */
    export interface SocketAddressProperty {
        /**
         * The name of the endpoint, such as `Endpoint 1` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-name
         */
        readonly name?: string;
        /**
         * The port of the endpoint, such as `55888` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-dataflowendpointgroup-socketaddress.html#cfn-groundstation-dataflowendpointgroup-socketaddress-port
         */
        readonly port?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SocketAddressProperty`
 *
 * @param properties - the TypeScript properties of a `SocketAddressProperty`
 *
 * @returns the result of the validation.
 */
function CfnDataflowEndpointGroup_SocketAddressPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "SocketAddressProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.SocketAddress` resource
 *
 * @param properties - the TypeScript properties of a `SocketAddressProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::DataflowEndpointGroup.SocketAddress` resource.
 */
// @ts-ignore TS6133
function cfnDataflowEndpointGroupSocketAddressPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDataflowEndpointGroup_SocketAddressPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnDataflowEndpointGroupSocketAddressPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataflowEndpointGroup.SocketAddressProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataflowEndpointGroup.SocketAddressProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnMissionProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export interface CfnMissionProfileProps {

    /**
     * A list containing lists of config ARNs. Each list of config ARNs is an edge, with a "from" config and a "to" config.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-dataflowedges
     */
    readonly dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Minimum length of a contact in seconds that Ground Station will return when listing contacts. Ground Station will not return contacts shorter than this duration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-minimumviablecontactdurationseconds
     */
    readonly minimumViableContactDurationSeconds: number;

    /**
     * The name of the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-name
     */
    readonly name: string;

    /**
     * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-trackingconfigarn
     */
    readonly trackingConfigArn: string;

    /**
     * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactpostpassdurationseconds
     */
    readonly contactPostPassDurationSeconds?: number;

    /**
     * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactprepassdurationseconds
     */
    readonly contactPrePassDurationSeconds?: number;

    /**
     * Tags assigned to the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnMissionProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnMissionProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnMissionProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contactPostPassDurationSeconds', cdk.validateNumber)(properties.contactPostPassDurationSeconds));
    errors.collect(cdk.propertyValidator('contactPrePassDurationSeconds', cdk.validateNumber)(properties.contactPrePassDurationSeconds));
    errors.collect(cdk.propertyValidator('dataflowEdges', cdk.requiredValidator)(properties.dataflowEdges));
    errors.collect(cdk.propertyValidator('dataflowEdges', cdk.listValidator(CfnMissionProfile_DataflowEdgePropertyValidator))(properties.dataflowEdges));
    errors.collect(cdk.propertyValidator('minimumViableContactDurationSeconds', cdk.requiredValidator)(properties.minimumViableContactDurationSeconds));
    errors.collect(cdk.propertyValidator('minimumViableContactDurationSeconds', cdk.validateNumber)(properties.minimumViableContactDurationSeconds));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('trackingConfigArn', cdk.requiredValidator)(properties.trackingConfigArn));
    errors.collect(cdk.propertyValidator('trackingConfigArn', cdk.validateString)(properties.trackingConfigArn));
    return errors.wrap('supplied properties not correct for "CfnMissionProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::MissionProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnMissionProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::MissionProfile` resource.
 */
// @ts-ignore TS6133
function cfnMissionProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMissionProfilePropsValidator(properties).assertSuccess();
    return {
        DataflowEdges: cdk.listMapper(cfnMissionProfileDataflowEdgePropertyToCloudFormation)(properties.dataflowEdges),
        MinimumViableContactDurationSeconds: cdk.numberToCloudFormation(properties.minimumViableContactDurationSeconds),
        Name: cdk.stringToCloudFormation(properties.name),
        TrackingConfigArn: cdk.stringToCloudFormation(properties.trackingConfigArn),
        ContactPostPassDurationSeconds: cdk.numberToCloudFormation(properties.contactPostPassDurationSeconds),
        ContactPrePassDurationSeconds: cdk.numberToCloudFormation(properties.contactPrePassDurationSeconds),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnMissionProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMissionProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMissionProfileProps>();
    ret.addPropertyResult('dataflowEdges', 'DataflowEdges', cfn_parse.FromCloudFormation.getArray(CfnMissionProfileDataflowEdgePropertyFromCloudFormation)(properties.DataflowEdges));
    ret.addPropertyResult('minimumViableContactDurationSeconds', 'MinimumViableContactDurationSeconds', cfn_parse.FromCloudFormation.getNumber(properties.MinimumViableContactDurationSeconds));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('trackingConfigArn', 'TrackingConfigArn', cfn_parse.FromCloudFormation.getString(properties.TrackingConfigArn));
    ret.addPropertyResult('contactPostPassDurationSeconds', 'ContactPostPassDurationSeconds', properties.ContactPostPassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPostPassDurationSeconds) : undefined);
    ret.addPropertyResult('contactPrePassDurationSeconds', 'ContactPrePassDurationSeconds', properties.ContactPrePassDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContactPrePassDurationSeconds) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::GroundStation::MissionProfile`
 *
 * Mission profiles specify parameters and provide references to config objects to define how Ground Station lists and executes contacts.
 *
 * @cloudformationResource AWS::GroundStation::MissionProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html
 */
export class CfnMissionProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GroundStation::MissionProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMissionProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnMissionProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnMissionProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the mission profile, such as `arn:aws:groundstation:us-east-2:1234567890:mission-profile/9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The ID of the mission profile, such as `9940bf3b-d2ba-427e-9906-842b5e5d2296` .
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The region of the mission profile.
     * @cloudformationAttribute Region
     */
    public readonly attrRegion: string;

    /**
     * A list containing lists of config ARNs. Each list of config ARNs is an edge, with a "from" config and a "to" config.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-dataflowedges
     */
    public dataflowEdges: Array<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Minimum length of a contact in seconds that Ground Station will return when listing contacts. Ground Station will not return contacts shorter than this duration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-minimumviablecontactdurationseconds
     */
    public minimumViableContactDurationSeconds: number;

    /**
     * The name of the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-name
     */
    public name: string;

    /**
     * The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-trackingconfigarn
     */
    public trackingConfigArn: string;

    /**
     * Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactpostpassdurationseconds
     */
    public contactPostPassDurationSeconds: number | undefined;

    /**
     * Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass. For more information on CloudWatch Events, see the [What Is CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-contactprepassdurationseconds
     */
    public contactPrePassDurationSeconds: number | undefined;

    /**
     * Tags assigned to the mission profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-groundstation-missionprofile.html#cfn-groundstation-missionprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::GroundStation::MissionProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnMissionProfileProps) {
        super(scope, id, { type: CfnMissionProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataflowEdges', this);
        cdk.requireProperty(props, 'minimumViableContactDurationSeconds', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'trackingConfigArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrRegion = cdk.Token.asString(this.getAtt('Region', cdk.ResolutionTypeHint.STRING));

        this.dataflowEdges = props.dataflowEdges;
        this.minimumViableContactDurationSeconds = props.minimumViableContactDurationSeconds;
        this.name = props.name;
        this.trackingConfigArn = props.trackingConfigArn;
        this.contactPostPassDurationSeconds = props.contactPostPassDurationSeconds;
        this.contactPrePassDurationSeconds = props.contactPrePassDurationSeconds;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::GroundStation::MissionProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnMissionProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataflowEdges: this.dataflowEdges,
            minimumViableContactDurationSeconds: this.minimumViableContactDurationSeconds,
            name: this.name,
            trackingConfigArn: this.trackingConfigArn,
            contactPostPassDurationSeconds: this.contactPostPassDurationSeconds,
            contactPrePassDurationSeconds: this.contactPrePassDurationSeconds,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnMissionProfilePropsToCloudFormation(props);
    }
}

export namespace CfnMissionProfile {
    /**
     * A dataflow edge defines from where and to where data will flow during a contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html
     */
    export interface DataflowEdgeProperty {
        /**
         * The ARN of the destination for this dataflow edge. For example, specify the ARN of a dataflow endpoint config for a downlink edge or an antenna uplink config for an uplink edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-destination
         */
        readonly destination?: string;
        /**
         * The ARN of the source for this dataflow edge. For example, specify the ARN of an antenna downlink config for a downlink edge or a dataflow endpoint config for an uplink edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-groundstation-missionprofile-dataflowedge.html#cfn-groundstation-missionprofile-dataflowedge-source
         */
        readonly source?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DataflowEdgeProperty`
 *
 * @param properties - the TypeScript properties of a `DataflowEdgeProperty`
 *
 * @returns the result of the validation.
 */
function CfnMissionProfile_DataflowEdgePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.validateString)(properties.destination));
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    return errors.wrap('supplied properties not correct for "DataflowEdgeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::GroundStation::MissionProfile.DataflowEdge` resource
 *
 * @param properties - the TypeScript properties of a `DataflowEdgeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::GroundStation::MissionProfile.DataflowEdge` resource.
 */
// @ts-ignore TS6133
function cfnMissionProfileDataflowEdgePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnMissionProfile_DataflowEdgePropertyValidator(properties).assertSuccess();
    return {
        Destination: cdk.stringToCloudFormation(properties.destination),
        Source: cdk.stringToCloudFormation(properties.source),
    };
}

// @ts-ignore TS6133
function CfnMissionProfileDataflowEdgePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMissionProfile.DataflowEdgeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMissionProfile.DataflowEdgeProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined);
    ret.addPropertyResult('source', 'Source', properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
