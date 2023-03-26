// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:28.741Z","fingerprint":"XX1EKAQoTdQzN7iml+WWGPM/VDjzTFcbX0jBkvVX+p4="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnLaunchProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export interface CfnLaunchProfileProps {

    /**
     * Unique identifiers for a collection of EC2 subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-ec2subnetids
     */
    readonly ec2SubnetIds: string[];

    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-launchprofileprotocolversions
     */
    readonly launchProfileProtocolVersions: string[];

    /**
     * A friendly name for the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-name
     */
    readonly name: string;

    /**
     * A configuration for a streaming session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-streamconfiguration
     */
    readonly streamConfiguration: CfnLaunchProfile.StreamConfigurationProperty | cdk.IResolvable;

    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studiocomponentids
     */
    readonly studioComponentIds: string[];

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studioid
     */
    readonly studioId: string;

    /**
     * A human-readable description of the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnLaunchProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnLaunchProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('ec2SubnetIds', cdk.requiredValidator)(properties.ec2SubnetIds));
    errors.collect(cdk.propertyValidator('ec2SubnetIds', cdk.listValidator(cdk.validateString))(properties.ec2SubnetIds));
    errors.collect(cdk.propertyValidator('launchProfileProtocolVersions', cdk.requiredValidator)(properties.launchProfileProtocolVersions));
    errors.collect(cdk.propertyValidator('launchProfileProtocolVersions', cdk.listValidator(cdk.validateString))(properties.launchProfileProtocolVersions));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('streamConfiguration', cdk.requiredValidator)(properties.streamConfiguration));
    errors.collect(cdk.propertyValidator('streamConfiguration', CfnLaunchProfile_StreamConfigurationPropertyValidator)(properties.streamConfiguration));
    errors.collect(cdk.propertyValidator('studioComponentIds', cdk.requiredValidator)(properties.studioComponentIds));
    errors.collect(cdk.propertyValidator('studioComponentIds', cdk.listValidator(cdk.validateString))(properties.studioComponentIds));
    errors.collect(cdk.propertyValidator('studioId', cdk.requiredValidator)(properties.studioId));
    errors.collect(cdk.propertyValidator('studioId', cdk.validateString)(properties.studioId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnLaunchProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnLaunchProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile` resource.
 */
// @ts-ignore TS6133
function cfnLaunchProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchProfilePropsValidator(properties).assertSuccess();
    return {
        Ec2SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SubnetIds),
        LaunchProfileProtocolVersions: cdk.listMapper(cdk.stringToCloudFormation)(properties.launchProfileProtocolVersions),
        Name: cdk.stringToCloudFormation(properties.name),
        StreamConfiguration: cfnLaunchProfileStreamConfigurationPropertyToCloudFormation(properties.streamConfiguration),
        StudioComponentIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.studioComponentIds),
        StudioId: cdk.stringToCloudFormation(properties.studioId),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnLaunchProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfileProps>();
    ret.addPropertyResult('ec2SubnetIds', 'Ec2SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.Ec2SubnetIds));
    ret.addPropertyResult('launchProfileProtocolVersions', 'LaunchProfileProtocolVersions', cfn_parse.FromCloudFormation.getStringArray(properties.LaunchProfileProtocolVersions));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('streamConfiguration', 'StreamConfiguration', CfnLaunchProfileStreamConfigurationPropertyFromCloudFormation(properties.StreamConfiguration));
    ret.addPropertyResult('studioComponentIds', 'StudioComponentIds', cfn_parse.FromCloudFormation.getStringArray(properties.StudioComponentIds));
    ret.addPropertyResult('studioId', 'StudioId', cfn_parse.FromCloudFormation.getString(properties.StudioId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NimbleStudio::LaunchProfile`
 *
 * The `AWS::NimbleStudio::LaunchProfile` resource represents access permissions for a set of studio components, including types of workstations, render farms, and shared file systems. Launch profiles are shared with studio users to give them access to the set of studio components.
 *
 * @cloudformationResource AWS::NimbleStudio::LaunchProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export class CfnLaunchProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::LaunchProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnLaunchProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnLaunchProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the launch profile resource.
     * @cloudformationAttribute LaunchProfileId
     */
    public readonly attrLaunchProfileId: string;

    /**
     * Unique identifiers for a collection of EC2 subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-ec2subnetids
     */
    public ec2SubnetIds: string[];

    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-launchprofileprotocolversions
     */
    public launchProfileProtocolVersions: string[];

    /**
     * A friendly name for the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-name
     */
    public name: string;

    /**
     * A configuration for a streaming session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-streamconfiguration
     */
    public streamConfiguration: CfnLaunchProfile.StreamConfigurationProperty | cdk.IResolvable;

    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studiocomponentids
     */
    public studioComponentIds: string[];

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studioid
     */
    public studioId: string;

    /**
     * A human-readable description of the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NimbleStudio::LaunchProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchProfileProps) {
        super(scope, id, { type: CfnLaunchProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'ec2SubnetIds', this);
        cdk.requireProperty(props, 'launchProfileProtocolVersions', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'streamConfiguration', this);
        cdk.requireProperty(props, 'studioComponentIds', this);
        cdk.requireProperty(props, 'studioId', this);
        this.attrLaunchProfileId = cdk.Token.asString(this.getAtt('LaunchProfileId', cdk.ResolutionTypeHint.STRING));

        this.ec2SubnetIds = props.ec2SubnetIds;
        this.launchProfileProtocolVersions = props.launchProfileProtocolVersions;
        this.name = props.name;
        this.streamConfiguration = props.streamConfiguration;
        this.studioComponentIds = props.studioComponentIds;
        this.studioId = props.studioId;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::LaunchProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ec2SubnetIds: this.ec2SubnetIds,
            launchProfileProtocolVersions: this.launchProfileProtocolVersions,
            name: this.name,
            streamConfiguration: this.streamConfiguration,
            studioComponentIds: this.studioComponentIds,
            studioId: this.studioId,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLaunchProfilePropsToCloudFormation(props);
    }
}

export namespace CfnLaunchProfile {
    /**
     * A configuration for a streaming session.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html
     */
    export interface StreamConfigurationProperty {
        /**
         * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a `STOPPED` state.
         *
         * - When `ACTIVATED` , the streaming session is scheduled for termination after being in the `STOPPED` state for the time specified in `maxStoppedSessionLengthInMinutes` .
         * - When `DEACTIVATED` , the streaming session can remain in the `STOPPED` state indefinitely.
         *
         * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` . When allowed, the default value for this parameter is `DEACTIVATED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-automaticterminationmode
         */
        readonly automaticTerminationMode?: string;
        /**
         * Allows or deactivates the use of the system clipboard to copy and paste between the streaming session and streaming client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-clipboardmode
         */
        readonly clipboardMode: string;
        /**
         * The EC2 instance types that users can select from when launching a streaming session with this launch profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-ec2instancetypes
         */
        readonly ec2InstanceTypes: string[];
        /**
         * The length of time, in minutes, that a streaming session can be active before it is stopped or terminated. After this point, Nimble Studio automatically terminates or stops the session. The default length of time is 690 minutes, and the maximum length of time is 30 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxsessionlengthinminutes
         */
        readonly maxSessionLengthInMinutes?: number;
        /**
         * Integer that determines if you can start and stop your sessions and how long a session can stay in the `STOPPED` state. The default value is 0. The maximum value is 5760.
         *
         * This field is allowed only when `sessionPersistenceMode` is `ACTIVATED` and `automaticTerminationMode` is `ACTIVATED` .
         *
         * If the value is set to 0, your sessions can’t be `STOPPED` . If you then call `StopStreamingSession` , the session fails. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be terminated (instead of `STOPPED` ).
         *
         * If the value is set to a positive number, the session can be stopped. You can call `StopStreamingSession` to stop sessions in the `READY` state. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be stopped (instead of terminated).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxstoppedsessionlengthinminutes
         */
        readonly maxStoppedSessionLengthInMinutes?: number;
        /**
         * Determine if a streaming session created from this launch profile can configure persistent storage. This means that `volumeConfiguration` and `automaticTerminationMode` are configured.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionpersistencemode
         */
        readonly sessionPersistenceMode?: string;
        /**
         * The upload storage for a streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionstorage
         */
        readonly sessionStorage?: CfnLaunchProfile.StreamConfigurationSessionStorageProperty | cdk.IResolvable;
        /**
         * The streaming images that users can select from when launching a streaming session with this launch profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-streamingimageids
         */
        readonly streamingImageIds: string[];
        /**
         * Custom volume configuration for the root volumes that are attached to streaming sessions.
         *
         * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-volumeconfiguration
         */
        readonly volumeConfiguration?: CfnLaunchProfile.VolumeConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StreamConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLaunchProfile_StreamConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automaticTerminationMode', cdk.validateString)(properties.automaticTerminationMode));
    errors.collect(cdk.propertyValidator('clipboardMode', cdk.requiredValidator)(properties.clipboardMode));
    errors.collect(cdk.propertyValidator('clipboardMode', cdk.validateString)(properties.clipboardMode));
    errors.collect(cdk.propertyValidator('ec2InstanceTypes', cdk.requiredValidator)(properties.ec2InstanceTypes));
    errors.collect(cdk.propertyValidator('ec2InstanceTypes', cdk.listValidator(cdk.validateString))(properties.ec2InstanceTypes));
    errors.collect(cdk.propertyValidator('maxSessionLengthInMinutes', cdk.validateNumber)(properties.maxSessionLengthInMinutes));
    errors.collect(cdk.propertyValidator('maxStoppedSessionLengthInMinutes', cdk.validateNumber)(properties.maxStoppedSessionLengthInMinutes));
    errors.collect(cdk.propertyValidator('sessionPersistenceMode', cdk.validateString)(properties.sessionPersistenceMode));
    errors.collect(cdk.propertyValidator('sessionStorage', CfnLaunchProfile_StreamConfigurationSessionStoragePropertyValidator)(properties.sessionStorage));
    errors.collect(cdk.propertyValidator('streamingImageIds', cdk.requiredValidator)(properties.streamingImageIds));
    errors.collect(cdk.propertyValidator('streamingImageIds', cdk.listValidator(cdk.validateString))(properties.streamingImageIds));
    errors.collect(cdk.propertyValidator('volumeConfiguration', CfnLaunchProfile_VolumeConfigurationPropertyValidator)(properties.volumeConfiguration));
    return errors.wrap('supplied properties not correct for "StreamConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLaunchProfileStreamConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchProfile_StreamConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AutomaticTerminationMode: cdk.stringToCloudFormation(properties.automaticTerminationMode),
        ClipboardMode: cdk.stringToCloudFormation(properties.clipboardMode),
        Ec2InstanceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2InstanceTypes),
        MaxSessionLengthInMinutes: cdk.numberToCloudFormation(properties.maxSessionLengthInMinutes),
        MaxStoppedSessionLengthInMinutes: cdk.numberToCloudFormation(properties.maxStoppedSessionLengthInMinutes),
        SessionPersistenceMode: cdk.stringToCloudFormation(properties.sessionPersistenceMode),
        SessionStorage: cfnLaunchProfileStreamConfigurationSessionStoragePropertyToCloudFormation(properties.sessionStorage),
        StreamingImageIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.streamingImageIds),
        VolumeConfiguration: cfnLaunchProfileVolumeConfigurationPropertyToCloudFormation(properties.volumeConfiguration),
    };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfile.StreamConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamConfigurationProperty>();
    ret.addPropertyResult('automaticTerminationMode', 'AutomaticTerminationMode', properties.AutomaticTerminationMode != null ? cfn_parse.FromCloudFormation.getString(properties.AutomaticTerminationMode) : undefined);
    ret.addPropertyResult('clipboardMode', 'ClipboardMode', cfn_parse.FromCloudFormation.getString(properties.ClipboardMode));
    ret.addPropertyResult('ec2InstanceTypes', 'Ec2InstanceTypes', cfn_parse.FromCloudFormation.getStringArray(properties.Ec2InstanceTypes));
    ret.addPropertyResult('maxSessionLengthInMinutes', 'MaxSessionLengthInMinutes', properties.MaxSessionLengthInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSessionLengthInMinutes) : undefined);
    ret.addPropertyResult('maxStoppedSessionLengthInMinutes', 'MaxStoppedSessionLengthInMinutes', properties.MaxStoppedSessionLengthInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxStoppedSessionLengthInMinutes) : undefined);
    ret.addPropertyResult('sessionPersistenceMode', 'SessionPersistenceMode', properties.SessionPersistenceMode != null ? cfn_parse.FromCloudFormation.getString(properties.SessionPersistenceMode) : undefined);
    ret.addPropertyResult('sessionStorage', 'SessionStorage', properties.SessionStorage != null ? CfnLaunchProfileStreamConfigurationSessionStoragePropertyFromCloudFormation(properties.SessionStorage) : undefined);
    ret.addPropertyResult('streamingImageIds', 'StreamingImageIds', cfn_parse.FromCloudFormation.getStringArray(properties.StreamingImageIds));
    ret.addPropertyResult('volumeConfiguration', 'VolumeConfiguration', properties.VolumeConfiguration != null ? CfnLaunchProfileVolumeConfigurationPropertyFromCloudFormation(properties.VolumeConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLaunchProfile {
    /**
     * The configuration for a streaming session’s upload storage.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html
     */
    export interface StreamConfigurationSessionStorageProperty {
        /**
         * Allows artists to upload files to their workstations. The only valid option is `UPLOAD` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-mode
         */
        readonly mode: string[];
        /**
         * The configuration for the upload storage root of the streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-root
         */
        readonly root?: CfnLaunchProfile.StreamingSessionStorageRootProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StreamConfigurationSessionStorageProperty`
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationSessionStorageProperty`
 *
 * @returns the result of the validation.
 */
function CfnLaunchProfile_StreamConfigurationSessionStoragePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mode', cdk.requiredValidator)(properties.mode));
    errors.collect(cdk.propertyValidator('mode', cdk.listValidator(cdk.validateString))(properties.mode));
    errors.collect(cdk.propertyValidator('root', CfnLaunchProfile_StreamingSessionStorageRootPropertyValidator)(properties.root));
    return errors.wrap('supplied properties not correct for "StreamConfigurationSessionStorageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamConfigurationSessionStorage` resource
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationSessionStorageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamConfigurationSessionStorage` resource.
 */
// @ts-ignore TS6133
function cfnLaunchProfileStreamConfigurationSessionStoragePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchProfile_StreamConfigurationSessionStoragePropertyValidator(properties).assertSuccess();
    return {
        Mode: cdk.listMapper(cdk.stringToCloudFormation)(properties.mode),
        Root: cfnLaunchProfileStreamingSessionStorageRootPropertyToCloudFormation(properties.root),
    };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationSessionStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfile.StreamConfigurationSessionStorageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamConfigurationSessionStorageProperty>();
    ret.addPropertyResult('mode', 'Mode', cfn_parse.FromCloudFormation.getStringArray(properties.Mode));
    ret.addPropertyResult('root', 'Root', properties.Root != null ? CfnLaunchProfileStreamingSessionStorageRootPropertyFromCloudFormation(properties.Root) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLaunchProfile {
    /**
     * The upload storage root location (folder) on streaming workstations where files are uploaded.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html
     */
    export interface StreamingSessionStorageRootProperty {
        /**
         * The folder path in Linux workstations where files are uploaded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-linux
         */
        readonly linux?: string;
        /**
         * The folder path in Windows workstations where files are uploaded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-windows
         */
        readonly windows?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamingSessionStorageRootProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingSessionStorageRootProperty`
 *
 * @returns the result of the validation.
 */
function CfnLaunchProfile_StreamingSessionStorageRootPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('linux', cdk.validateString)(properties.linux));
    errors.collect(cdk.propertyValidator('windows', cdk.validateString)(properties.windows));
    return errors.wrap('supplied properties not correct for "StreamingSessionStorageRootProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamingSessionStorageRoot` resource
 *
 * @param properties - the TypeScript properties of a `StreamingSessionStorageRootProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.StreamingSessionStorageRoot` resource.
 */
// @ts-ignore TS6133
function cfnLaunchProfileStreamingSessionStorageRootPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchProfile_StreamingSessionStorageRootPropertyValidator(properties).assertSuccess();
    return {
        Linux: cdk.stringToCloudFormation(properties.linux),
        Windows: cdk.stringToCloudFormation(properties.windows),
    };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamingSessionStorageRootPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfile.StreamingSessionStorageRootProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamingSessionStorageRootProperty>();
    ret.addPropertyResult('linux', 'Linux', properties.Linux != null ? cfn_parse.FromCloudFormation.getString(properties.Linux) : undefined);
    ret.addPropertyResult('windows', 'Windows', properties.Windows != null ? cfn_parse.FromCloudFormation.getString(properties.Windows) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLaunchProfile {
    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions.
     *
     * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html
     */
    export interface VolumeConfigurationProperty {
        /**
         * The number of I/O operations per second for the root volume that is attached to streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-iops
         */
        readonly iops?: number;
        /**
         * The size of the root volume that is attached to the streaming session. The root volume size is measured in GiBs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-size
         */
        readonly size?: number;
        /**
         * The throughput to provision for the root volume that is attached to the streaming session. The throughput is measured in MiB/s.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-throughput
         */
        readonly throughput?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnLaunchProfile_VolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('iops', cdk.validateNumber)(properties.iops));
    errors.collect(cdk.propertyValidator('size', cdk.validateNumber)(properties.size));
    errors.collect(cdk.propertyValidator('throughput', cdk.validateNumber)(properties.throughput));
    return errors.wrap('supplied properties not correct for "VolumeConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.VolumeConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::LaunchProfile.VolumeConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnLaunchProfileVolumeConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLaunchProfile_VolumeConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Iops: cdk.numberToCloudFormation(properties.iops),
        Size: cdk.numberToCloudFormation(properties.size),
        Throughput: cdk.numberToCloudFormation(properties.throughput),
    };
}

// @ts-ignore TS6133
function CfnLaunchProfileVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfile.VolumeConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.VolumeConfigurationProperty>();
    ret.addPropertyResult('iops', 'Iops', properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined);
    ret.addPropertyResult('size', 'Size', properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined);
    ret.addPropertyResult('throughput', 'Throughput', properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStreamingImage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export interface CfnStreamingImageProps {

    /**
     * The ID of an EC2 machine image with which to create the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-ec2imageid
     */
    readonly ec2ImageId: string;

    /**
     * A friendly name for a streaming image resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-name
     */
    readonly name: string;

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-studioid
     */
    readonly studioId: string;

    /**
     * A human-readable description of the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-description
     */
    readonly description?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnStreamingImageProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamingImageProps`
 *
 * @returns the result of the validation.
 */
function CfnStreamingImagePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('ec2ImageId', cdk.requiredValidator)(properties.ec2ImageId));
    errors.collect(cdk.propertyValidator('ec2ImageId', cdk.validateString)(properties.ec2ImageId));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('studioId', cdk.requiredValidator)(properties.studioId));
    errors.collect(cdk.propertyValidator('studioId', cdk.validateString)(properties.studioId));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnStreamingImageProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StreamingImage` resource
 *
 * @param properties - the TypeScript properties of a `CfnStreamingImageProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StreamingImage` resource.
 */
// @ts-ignore TS6133
function cfnStreamingImagePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingImagePropsValidator(properties).assertSuccess();
    return {
        Ec2ImageId: cdk.stringToCloudFormation(properties.ec2ImageId),
        Name: cdk.stringToCloudFormation(properties.name),
        StudioId: cdk.stringToCloudFormation(properties.studioId),
        Description: cdk.stringToCloudFormation(properties.description),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStreamingImagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingImageProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingImageProps>();
    ret.addPropertyResult('ec2ImageId', 'Ec2ImageId', cfn_parse.FromCloudFormation.getString(properties.Ec2ImageId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('studioId', 'StudioId', cfn_parse.FromCloudFormation.getString(properties.StudioId));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NimbleStudio::StreamingImage`
 *
 * The `AWS::NimbleStudio::StreamingImage` resource creates a streaming image in a studio. A streaming image defines the operating system and software to be used in an  streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StreamingImage
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export class CfnStreamingImage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::StreamingImage";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamingImage {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStreamingImagePropsFromCloudFormation(resourceProperties);
        const ret = new CfnStreamingImage(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute EncryptionConfiguration.KeyArn
     */
    public readonly attrEncryptionConfigurationKeyArn: string;

    /**
     *
     * @cloudformationAttribute EncryptionConfiguration.KeyType
     */
    public readonly attrEncryptionConfigurationKeyType: string;

    /**
     * The list of IDs of EULAs that must be accepted before a streaming session can be started using this streaming image.
     * @cloudformationAttribute EulaIds
     */
    public readonly attrEulaIds: string[];

    /**
     * The owner of the streaming image, either the studioId that contains the streaming image or 'amazon' for images that are provided by  .
     * @cloudformationAttribute Owner
     */
    public readonly attrOwner: string;

    /**
     * The platform of the streaming image, either WINDOWS or LINUX.
     * @cloudformationAttribute Platform
     */
    public readonly attrPlatform: string;

    /**
     * The unique identifier for the streaming image resource.
     * @cloudformationAttribute StreamingImageId
     */
    public readonly attrStreamingImageId: string;

    /**
     * The ID of an EC2 machine image with which to create the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-ec2imageid
     */
    public ec2ImageId: string;

    /**
     * A friendly name for a streaming image resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-name
     */
    public name: string;

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-studioid
     */
    public studioId: string;

    /**
     * A human-readable description of the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-description
     */
    public description: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NimbleStudio::StreamingImage`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamingImageProps) {
        super(scope, id, { type: CfnStreamingImage.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'ec2ImageId', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'studioId', this);
        this.attrEncryptionConfigurationKeyArn = cdk.Token.asString(this.getAtt('EncryptionConfiguration.KeyArn', cdk.ResolutionTypeHint.STRING));
        this.attrEncryptionConfigurationKeyType = cdk.Token.asString(this.getAtt('EncryptionConfiguration.KeyType', cdk.ResolutionTypeHint.STRING));
        this.attrEulaIds = cdk.Token.asList(this.getAtt('EulaIds', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrOwner = cdk.Token.asString(this.getAtt('Owner', cdk.ResolutionTypeHint.STRING));
        this.attrPlatform = cdk.Token.asString(this.getAtt('Platform', cdk.ResolutionTypeHint.STRING));
        this.attrStreamingImageId = cdk.Token.asString(this.getAtt('StreamingImageId', cdk.ResolutionTypeHint.STRING));

        this.ec2ImageId = props.ec2ImageId;
        this.name = props.name;
        this.studioId = props.studioId;
        this.description = props.description;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::StreamingImage", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamingImage.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ec2ImageId: this.ec2ImageId,
            name: this.name,
            studioId: this.studioId,
            description: this.description,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStreamingImagePropsToCloudFormation(props);
    }
}

export namespace CfnStreamingImage {
    /**
     * Specifies how a streaming image is encrypted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html
     */
    export interface StreamingImageEncryptionConfigurationProperty {
        /**
         * The ARN for a KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keyarn
         */
        readonly keyArn?: string;
        /**
         * The type of KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keytype
         */
        readonly keyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `StreamingImageEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingImageEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStreamingImage_StreamingImageEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyArn', cdk.validateString)(properties.keyArn));
    errors.collect(cdk.propertyValidator('keyType', cdk.requiredValidator)(properties.keyType));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    return errors.wrap('supplied properties not correct for "StreamingImageEncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StreamingImage.StreamingImageEncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StreamingImageEncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StreamingImage.StreamingImageEncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStreamingImageStreamingImageEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStreamingImage_StreamingImageEncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KeyArn: cdk.stringToCloudFormation(properties.keyArn),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
    };
}

// @ts-ignore TS6133
function CfnStreamingImageStreamingImageEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingImage.StreamingImageEncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingImage.StreamingImageEncryptionConfigurationProperty>();
    ret.addPropertyResult('keyArn', 'KeyArn', properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', cfn_parse.FromCloudFormation.getString(properties.KeyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStudio`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export interface CfnStudioProps {

    /**
     * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-adminrolearn
     */
    readonly adminRoleArn: string;

    /**
     * A friendly name for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-displayname
     */
    readonly displayName: string;

    /**
     * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioname
     */
    readonly studioName: string;

    /**
     * The IAM role that studio users assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-userrolearn
     */
    readonly userRoleArn: string;

    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioencryptionconfiguration
     */
    readonly studioEncryptionConfiguration?: CfnStudio.StudioEncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnStudioProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the result of the validation.
 */
function CfnStudioPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adminRoleArn', cdk.requiredValidator)(properties.adminRoleArn));
    errors.collect(cdk.propertyValidator('adminRoleArn', cdk.validateString)(properties.adminRoleArn));
    errors.collect(cdk.propertyValidator('displayName', cdk.requiredValidator)(properties.displayName));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('studioEncryptionConfiguration', CfnStudio_StudioEncryptionConfigurationPropertyValidator)(properties.studioEncryptionConfiguration));
    errors.collect(cdk.propertyValidator('studioName', cdk.requiredValidator)(properties.studioName));
    errors.collect(cdk.propertyValidator('studioName', cdk.validateString)(properties.studioName));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('userRoleArn', cdk.requiredValidator)(properties.userRoleArn));
    errors.collect(cdk.propertyValidator('userRoleArn', cdk.validateString)(properties.userRoleArn));
    return errors.wrap('supplied properties not correct for "CfnStudioProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::Studio` resource
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::Studio` resource.
 */
// @ts-ignore TS6133
function cfnStudioPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioPropsValidator(properties).assertSuccess();
    return {
        AdminRoleArn: cdk.stringToCloudFormation(properties.adminRoleArn),
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        StudioName: cdk.stringToCloudFormation(properties.studioName),
        UserRoleArn: cdk.stringToCloudFormation(properties.userRoleArn),
        StudioEncryptionConfiguration: cfnStudioStudioEncryptionConfigurationPropertyToCloudFormation(properties.studioEncryptionConfiguration),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStudioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioProps>();
    ret.addPropertyResult('adminRoleArn', 'AdminRoleArn', cfn_parse.FromCloudFormation.getString(properties.AdminRoleArn));
    ret.addPropertyResult('displayName', 'DisplayName', cfn_parse.FromCloudFormation.getString(properties.DisplayName));
    ret.addPropertyResult('studioName', 'StudioName', cfn_parse.FromCloudFormation.getString(properties.StudioName));
    ret.addPropertyResult('userRoleArn', 'UserRoleArn', cfn_parse.FromCloudFormation.getString(properties.UserRoleArn));
    ret.addPropertyResult('studioEncryptionConfiguration', 'StudioEncryptionConfiguration', properties.StudioEncryptionConfiguration != null ? CfnStudioStudioEncryptionConfigurationPropertyFromCloudFormation(properties.StudioEncryptionConfiguration) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NimbleStudio::Studio`
 *
 * The `AWS::NimbleStudio::Studio` resource creates a new studio resource. In  , all other resources are contained in a studio.
 *
 * When creating a studio, two IAM roles must be provided: the admin role and the user role. These roles are assumed by your users when they log in to the  portal. The user role must have the AmazonNimbleStudio-StudioUser managed policy attached for the portal to function properly. The Admin Role must have the AmazonNimbleStudio-StudioAdmin managed policy attached for the portal to function properly.
 *
 * You can optionally specify an AWS Key Management Service key in the StudioEncryptionConfiguration. In Nimble Studio, resource names, descriptions, initialization scripts, and other data you provide are always encrypted at rest using an AWS Key Management Service key. By default, this key is owned by AWS and managed on your behalf. You may provide your own AWS Key Management Service key when calling CreateStudio to encrypt this data using a key that you own and manage. When providing an AWS Key Management Service key during studio creation,  creates AWS Key Management Service grants in your account to provide your studio user and admin roles access to these AWS Key Management Service keys. If you delete this grant, the studio will no longer be accessible to your portal users. If you delete the studio AWS Key Management Service key, your studio will no longer be accessible.
 *
 * @cloudformationResource AWS::NimbleStudio::Studio
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export class CfnStudio extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::Studio";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudio {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStudioPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStudio(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The AWS Region where the studio resource is located. For example, `us-west-2` .
     * @cloudformationAttribute HomeRegion
     */
    public readonly attrHomeRegion: string;

    /**
     * The IAM Identity Center application client ID that is used to integrate with IAM Identity Center , which enables IAM Identity Center users to log into the  portal.
     * @cloudformationAttribute SsoClientId
     */
    public readonly attrSsoClientId: string;

    /**
     * The unique identifier for the studio resource.
     * @cloudformationAttribute StudioId
     */
    public readonly attrStudioId: string;

    /**
     * The unique identifier for the studio resource.
     * @cloudformationAttribute StudioUrl
     */
    public readonly attrStudioUrl: string;

    /**
     * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-adminrolearn
     */
    public adminRoleArn: string;

    /**
     * A friendly name for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-displayname
     */
    public displayName: string;

    /**
     * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioname
     */
    public studioName: string;

    /**
     * The IAM role that studio users assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-userrolearn
     */
    public userRoleArn: string;

    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioencryptionconfiguration
     */
    public studioEncryptionConfiguration: CfnStudio.StudioEncryptionConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NimbleStudio::Studio`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioProps) {
        super(scope, id, { type: CfnStudio.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'adminRoleArn', this);
        cdk.requireProperty(props, 'displayName', this);
        cdk.requireProperty(props, 'studioName', this);
        cdk.requireProperty(props, 'userRoleArn', this);
        this.attrHomeRegion = cdk.Token.asString(this.getAtt('HomeRegion', cdk.ResolutionTypeHint.STRING));
        this.attrSsoClientId = cdk.Token.asString(this.getAtt('SsoClientId', cdk.ResolutionTypeHint.STRING));
        this.attrStudioId = cdk.Token.asString(this.getAtt('StudioId', cdk.ResolutionTypeHint.STRING));
        this.attrStudioUrl = cdk.Token.asString(this.getAtt('StudioUrl', cdk.ResolutionTypeHint.STRING));

        this.adminRoleArn = props.adminRoleArn;
        this.displayName = props.displayName;
        this.studioName = props.studioName;
        this.userRoleArn = props.userRoleArn;
        this.studioEncryptionConfiguration = props.studioEncryptionConfiguration;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::Studio", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudio.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            adminRoleArn: this.adminRoleArn,
            displayName: this.displayName,
            studioName: this.studioName,
            userRoleArn: this.userRoleArn,
            studioEncryptionConfiguration: this.studioEncryptionConfiguration,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStudioPropsToCloudFormation(props);
    }
}

export namespace CfnStudio {
    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html
     */
    export interface StudioEncryptionConfigurationProperty {
        /**
         * The ARN for a KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keyarn
         */
        readonly keyArn?: string;
        /**
         * The type of KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keytype
         */
        readonly keyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `StudioEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StudioEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudio_StudioEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyArn', cdk.validateString)(properties.keyArn));
    errors.collect(cdk.propertyValidator('keyType', cdk.requiredValidator)(properties.keyType));
    errors.collect(cdk.propertyValidator('keyType', cdk.validateString)(properties.keyType));
    return errors.wrap('supplied properties not correct for "StudioEncryptionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::Studio.StudioEncryptionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StudioEncryptionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::Studio.StudioEncryptionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioStudioEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudio_StudioEncryptionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KeyArn: cdk.stringToCloudFormation(properties.keyArn),
        KeyType: cdk.stringToCloudFormation(properties.keyType),
    };
}

// @ts-ignore TS6133
function CfnStudioStudioEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudio.StudioEncryptionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudio.StudioEncryptionConfigurationProperty>();
    ret.addPropertyResult('keyArn', 'KeyArn', properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined);
    ret.addPropertyResult('keyType', 'KeyType', cfn_parse.FromCloudFormation.getString(properties.KeyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnStudioComponent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export interface CfnStudioComponentProps {

    /**
     * A friendly name for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-name
     */
    readonly name: string;

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-studioid
     */
    readonly studioId: string;

    /**
     * The type of the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-type
     */
    readonly type: string;

    /**
     * The configuration of the studio component, based on component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-configuration
     */
    readonly configuration?: CfnStudioComponent.StudioComponentConfigurationProperty | cdk.IResolvable;

    /**
     * A human-readable description for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-description
     */
    readonly description?: string;

    /**
     * The EC2 security groups that control access to the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-ec2securitygroupids
     */
    readonly ec2SecurityGroupIds?: string[];

    /**
     * Initialization scripts for studio components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-initializationscripts
     */
    readonly initializationScripts?: Array<CfnStudioComponent.StudioComponentInitializationScriptProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Parameters for the studio component scripts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-scriptparameters
     */
    readonly scriptParameters?: Array<CfnStudioComponent.ScriptParameterKeyValueProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The specific subtype of a studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-subtype
     */
    readonly subtype?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnStudioComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioComponentProps`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configuration', CfnStudioComponent_StudioComponentConfigurationPropertyValidator)(properties.configuration));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('ec2SecurityGroupIds', cdk.listValidator(cdk.validateString))(properties.ec2SecurityGroupIds));
    errors.collect(cdk.propertyValidator('initializationScripts', cdk.listValidator(CfnStudioComponent_StudioComponentInitializationScriptPropertyValidator))(properties.initializationScripts));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scriptParameters', cdk.listValidator(CfnStudioComponent_ScriptParameterKeyValuePropertyValidator))(properties.scriptParameters));
    errors.collect(cdk.propertyValidator('studioId', cdk.requiredValidator)(properties.studioId));
    errors.collect(cdk.propertyValidator('studioId', cdk.validateString)(properties.studioId));
    errors.collect(cdk.propertyValidator('subtype', cdk.validateString)(properties.subtype));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnStudioComponentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent` resource
 *
 * @param properties - the TypeScript properties of a `CfnStudioComponentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponentPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        StudioId: cdk.stringToCloudFormation(properties.studioId),
        Type: cdk.stringToCloudFormation(properties.type),
        Configuration: cfnStudioComponentStudioComponentConfigurationPropertyToCloudFormation(properties.configuration),
        Description: cdk.stringToCloudFormation(properties.description),
        Ec2SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SecurityGroupIds),
        InitializationScripts: cdk.listMapper(cfnStudioComponentStudioComponentInitializationScriptPropertyToCloudFormation)(properties.initializationScripts),
        ScriptParameters: cdk.listMapper(cfnStudioComponentScriptParameterKeyValuePropertyToCloudFormation)(properties.scriptParameters),
        Subtype: cdk.stringToCloudFormation(properties.subtype),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponentProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('studioId', 'StudioId', cfn_parse.FromCloudFormation.getString(properties.StudioId));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('configuration', 'Configuration', properties.Configuration != null ? CfnStudioComponentStudioComponentConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('ec2SecurityGroupIds', 'Ec2SecurityGroupIds', properties.Ec2SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Ec2SecurityGroupIds) : undefined);
    ret.addPropertyResult('initializationScripts', 'InitializationScripts', properties.InitializationScripts != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentStudioComponentInitializationScriptPropertyFromCloudFormation)(properties.InitializationScripts) : undefined);
    ret.addPropertyResult('scriptParameters', 'ScriptParameters', properties.ScriptParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentScriptParameterKeyValuePropertyFromCloudFormation)(properties.ScriptParameters) : undefined);
    ret.addPropertyResult('subtype', 'Subtype', properties.Subtype != null ? cfn_parse.FromCloudFormation.getString(properties.Subtype) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::NimbleStudio::StudioComponent`
 *
 * The `AWS::NimbleStudio::StudioComponent` resource represents a network resource that is used by a studio's users and workflows. A typical studio contains studio components for the following: a render farm, an Active Directory, a licensing service, and a shared file system.
 *
 * Access to a studio component is managed by specifying security groups for the resource, as well as its endpoint.
 *
 * A studio component also has a set of initialization scripts, which are returned by `GetLaunchProfileInitialization` . These initialization scripts run on streaming sessions when they start. They provide users with flexibility in controlling how studio resources are configured on a streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StudioComponent
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export class CfnStudioComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::StudioComponent";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudioComponent {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnStudioComponentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnStudioComponent(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the studio component resource.
     * @cloudformationAttribute StudioComponentId
     */
    public readonly attrStudioComponentId: string;

    /**
     * A friendly name for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-name
     */
    public name: string;

    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-studioid
     */
    public studioId: string;

    /**
     * The type of the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-type
     */
    public type: string;

    /**
     * The configuration of the studio component, based on component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-configuration
     */
    public configuration: CfnStudioComponent.StudioComponentConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A human-readable description for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-description
     */
    public description: string | undefined;

    /**
     * The EC2 security groups that control access to the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-ec2securitygroupids
     */
    public ec2SecurityGroupIds: string[] | undefined;

    /**
     * Initialization scripts for studio components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-initializationscripts
     */
    public initializationScripts: Array<CfnStudioComponent.StudioComponentInitializationScriptProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Parameters for the studio component scripts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-scriptparameters
     */
    public scriptParameters: Array<CfnStudioComponent.ScriptParameterKeyValueProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The specific subtype of a studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-subtype
     */
    public subtype: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::NimbleStudio::StudioComponent`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioComponentProps) {
        super(scope, id, { type: CfnStudioComponent.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'studioId', this);
        cdk.requireProperty(props, 'type', this);
        this.attrStudioComponentId = cdk.Token.asString(this.getAtt('StudioComponentId', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.studioId = props.studioId;
        this.type = props.type;
        this.configuration = props.configuration;
        this.description = props.description;
        this.ec2SecurityGroupIds = props.ec2SecurityGroupIds;
        this.initializationScripts = props.initializationScripts;
        this.scriptParameters = props.scriptParameters;
        this.subtype = props.subtype;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::StudioComponent", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudioComponent.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            studioId: this.studioId,
            type: this.type,
            configuration: this.configuration,
            description: this.description,
            ec2SecurityGroupIds: this.ec2SecurityGroupIds,
            initializationScripts: this.initializationScripts,
            scriptParameters: this.scriptParameters,
            subtype: this.subtype,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnStudioComponentPropsToCloudFormation(props);
    }
}

export namespace CfnStudioComponent {
    /**
     * An LDAP attribute of an Active Directory computer account, in the form of a name:value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html
     */
    export interface ActiveDirectoryComputerAttributeProperty {
        /**
         * The name for the LDAP attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-name
         */
        readonly name?: string;
        /**
         * The value for the LDAP attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActiveDirectoryComputerAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryComputerAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_ActiveDirectoryComputerAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ActiveDirectoryComputerAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ActiveDirectoryComputerAttribute` resource
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryComputerAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ActiveDirectoryComputerAttribute` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentActiveDirectoryComputerAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_ActiveDirectoryComputerAttributePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryComputerAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html
     */
    export interface ActiveDirectoryConfigurationProperty {
        /**
         * A collection of custom attributes for an Active Directory computer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-computerattributes
         */
        readonly computerAttributes?: Array<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The directory ID of the AWS Directory Service for Microsoft Active Directory to access using this studio component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-directoryid
         */
        readonly directoryId?: string;
        /**
         * The distinguished name (DN) and organizational unit (OU) of an Active Directory computer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-organizationalunitdistinguishedname
         */
        readonly organizationalUnitDistinguishedName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ActiveDirectoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_ActiveDirectoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('computerAttributes', cdk.listValidator(CfnStudioComponent_ActiveDirectoryComputerAttributePropertyValidator))(properties.computerAttributes));
    errors.collect(cdk.propertyValidator('directoryId', cdk.validateString)(properties.directoryId));
    errors.collect(cdk.propertyValidator('organizationalUnitDistinguishedName', cdk.validateString)(properties.organizationalUnitDistinguishedName));
    return errors.wrap('supplied properties not correct for "ActiveDirectoryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ActiveDirectoryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ActiveDirectoryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentActiveDirectoryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_ActiveDirectoryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ComputerAttributes: cdk.listMapper(cfnStudioComponentActiveDirectoryComputerAttributePropertyToCloudFormation)(properties.computerAttributes),
        DirectoryId: cdk.stringToCloudFormation(properties.directoryId),
        OrganizationalUnitDistinguishedName: cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ActiveDirectoryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ActiveDirectoryConfigurationProperty>();
    ret.addPropertyResult('computerAttributes', 'ComputerAttributes', properties.ComputerAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentActiveDirectoryComputerAttributePropertyFromCloudFormation)(properties.ComputerAttributes) : undefined);
    ret.addPropertyResult('directoryId', 'DirectoryId', properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined);
    ret.addPropertyResult('organizationalUnitDistinguishedName', 'OrganizationalUnitDistinguishedName', properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * The configuration for a render farm that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html
     */
    export interface ComputeFarmConfigurationProperty {
        /**
         * The name of an Active Directory user that is used on ComputeFarm worker instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-activedirectoryuser
         */
        readonly activeDirectoryUser?: string;
        /**
         * The endpoint of the ComputeFarm that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-endpoint
         */
        readonly endpoint?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ComputeFarmConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeFarmConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_ComputeFarmConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activeDirectoryUser', cdk.validateString)(properties.activeDirectoryUser));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    return errors.wrap('supplied properties not correct for "ComputeFarmConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ComputeFarmConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `ComputeFarmConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ComputeFarmConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentComputeFarmConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_ComputeFarmConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ActiveDirectoryUser: cdk.stringToCloudFormation(properties.activeDirectoryUser),
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentComputeFarmConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ComputeFarmConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ComputeFarmConfigurationProperty>();
    ret.addPropertyResult('activeDirectoryUser', 'ActiveDirectoryUser', properties.ActiveDirectoryUser != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveDirectoryUser) : undefined);
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * The configuration for a license service that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html
     */
    export interface LicenseServiceConfigurationProperty {
        /**
         * The endpoint of the license service that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html#cfn-nimblestudio-studiocomponent-licenseserviceconfiguration-endpoint
         */
        readonly endpoint?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LicenseServiceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LicenseServiceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_LicenseServiceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    return errors.wrap('supplied properties not correct for "LicenseServiceConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.LicenseServiceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LicenseServiceConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.LicenseServiceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentLicenseServiceConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_LicenseServiceConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentLicenseServiceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.LicenseServiceConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.LicenseServiceConfigurationProperty>();
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * A parameter for a studio component script, in the form of a key-value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html
     */
    export interface ScriptParameterKeyValueProperty {
        /**
         * A script parameter key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-key
         */
        readonly key?: string;
        /**
         * A script parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScriptParameterKeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptParameterKeyValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_ScriptParameterKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ScriptParameterKeyValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ScriptParameterKeyValue` resource
 *
 * @param properties - the TypeScript properties of a `ScriptParameterKeyValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.ScriptParameterKeyValue` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentScriptParameterKeyValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_ScriptParameterKeyValuePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentScriptParameterKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ScriptParameterKeyValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ScriptParameterKeyValueProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * The configuration for a shared file storage system that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html
     */
    export interface SharedFileSystemConfigurationProperty {
        /**
         * The endpoint of the shared file system that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-endpoint
         */
        readonly endpoint?: string;
        /**
         * The unique identifier for a file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-filesystemid
         */
        readonly fileSystemId?: string;
        /**
         * The mount location for a shared file system on a Linux virtual workstation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-linuxmountpoint
         */
        readonly linuxMountPoint?: string;
        /**
         * The name of the file share.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-sharename
         */
        readonly shareName?: string;
        /**
         * The mount location for a shared file system on a Windows virtual workstation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-windowsmountdrive
         */
        readonly windowsMountDrive?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SharedFileSystemConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SharedFileSystemConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_SharedFileSystemConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    errors.collect(cdk.propertyValidator('fileSystemId', cdk.validateString)(properties.fileSystemId));
    errors.collect(cdk.propertyValidator('linuxMountPoint', cdk.validateString)(properties.linuxMountPoint));
    errors.collect(cdk.propertyValidator('shareName', cdk.validateString)(properties.shareName));
    errors.collect(cdk.propertyValidator('windowsMountDrive', cdk.validateString)(properties.windowsMountDrive));
    return errors.wrap('supplied properties not correct for "SharedFileSystemConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.SharedFileSystemConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `SharedFileSystemConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.SharedFileSystemConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentSharedFileSystemConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_SharedFileSystemConfigurationPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
        FileSystemId: cdk.stringToCloudFormation(properties.fileSystemId),
        LinuxMountPoint: cdk.stringToCloudFormation(properties.linuxMountPoint),
        ShareName: cdk.stringToCloudFormation(properties.shareName),
        WindowsMountDrive: cdk.stringToCloudFormation(properties.windowsMountDrive),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentSharedFileSystemConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.SharedFileSystemConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.SharedFileSystemConfigurationProperty>();
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addPropertyResult('fileSystemId', 'FileSystemId', properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined);
    ret.addPropertyResult('linuxMountPoint', 'LinuxMountPoint', properties.LinuxMountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.LinuxMountPoint) : undefined);
    ret.addPropertyResult('shareName', 'ShareName', properties.ShareName != null ? cfn_parse.FromCloudFormation.getString(properties.ShareName) : undefined);
    ret.addPropertyResult('windowsMountDrive', 'WindowsMountDrive', properties.WindowsMountDrive != null ? cfn_parse.FromCloudFormation.getString(properties.WindowsMountDrive) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * The configuration of the studio component, based on component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html
     */
    export interface StudioComponentConfigurationProperty {
        /**
         * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-activedirectoryconfiguration
         */
        readonly activeDirectoryConfiguration?: CfnStudioComponent.ActiveDirectoryConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a render farm that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-computefarmconfiguration
         */
        readonly computeFarmConfiguration?: CfnStudioComponent.ComputeFarmConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a license service that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-licenseserviceconfiguration
         */
        readonly licenseServiceConfiguration?: CfnStudioComponent.LicenseServiceConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a shared file storage system that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-sharedfilesystemconfiguration
         */
        readonly sharedFileSystemConfiguration?: CfnStudioComponent.SharedFileSystemConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StudioComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StudioComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_StudioComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('activeDirectoryConfiguration', CfnStudioComponent_ActiveDirectoryConfigurationPropertyValidator)(properties.activeDirectoryConfiguration));
    errors.collect(cdk.propertyValidator('computeFarmConfiguration', CfnStudioComponent_ComputeFarmConfigurationPropertyValidator)(properties.computeFarmConfiguration));
    errors.collect(cdk.propertyValidator('licenseServiceConfiguration', CfnStudioComponent_LicenseServiceConfigurationPropertyValidator)(properties.licenseServiceConfiguration));
    errors.collect(cdk.propertyValidator('sharedFileSystemConfiguration', CfnStudioComponent_SharedFileSystemConfigurationPropertyValidator)(properties.sharedFileSystemConfiguration));
    return errors.wrap('supplied properties not correct for "StudioComponentConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.StudioComponentConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `StudioComponentConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.StudioComponentConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentStudioComponentConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_StudioComponentConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ActiveDirectoryConfiguration: cfnStudioComponentActiveDirectoryConfigurationPropertyToCloudFormation(properties.activeDirectoryConfiguration),
        ComputeFarmConfiguration: cfnStudioComponentComputeFarmConfigurationPropertyToCloudFormation(properties.computeFarmConfiguration),
        LicenseServiceConfiguration: cfnStudioComponentLicenseServiceConfigurationPropertyToCloudFormation(properties.licenseServiceConfiguration),
        SharedFileSystemConfiguration: cfnStudioComponentSharedFileSystemConfigurationPropertyToCloudFormation(properties.sharedFileSystemConfiguration),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentStudioComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.StudioComponentConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.StudioComponentConfigurationProperty>();
    ret.addPropertyResult('activeDirectoryConfiguration', 'ActiveDirectoryConfiguration', properties.ActiveDirectoryConfiguration != null ? CfnStudioComponentActiveDirectoryConfigurationPropertyFromCloudFormation(properties.ActiveDirectoryConfiguration) : undefined);
    ret.addPropertyResult('computeFarmConfiguration', 'ComputeFarmConfiguration', properties.ComputeFarmConfiguration != null ? CfnStudioComponentComputeFarmConfigurationPropertyFromCloudFormation(properties.ComputeFarmConfiguration) : undefined);
    ret.addPropertyResult('licenseServiceConfiguration', 'LicenseServiceConfiguration', properties.LicenseServiceConfiguration != null ? CfnStudioComponentLicenseServiceConfigurationPropertyFromCloudFormation(properties.LicenseServiceConfiguration) : undefined);
    ret.addPropertyResult('sharedFileSystemConfiguration', 'SharedFileSystemConfiguration', properties.SharedFileSystemConfiguration != null ? CfnStudioComponentSharedFileSystemConfigurationPropertyFromCloudFormation(properties.SharedFileSystemConfiguration) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnStudioComponent {
    /**
     * Initialization scripts for studio components.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html
     */
    export interface StudioComponentInitializationScriptProperty {
        /**
         * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-launchprofileprotocolversion
         */
        readonly launchProfileProtocolVersion?: string;
        /**
         * The platform of the initialization script, either Windows or Linux.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-platform
         */
        readonly platform?: string;
        /**
         * The method to use when running the initialization script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-runcontext
         */
        readonly runContext?: string;
        /**
         * The initialization script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-script
         */
        readonly script?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StudioComponentInitializationScriptProperty`
 *
 * @param properties - the TypeScript properties of a `StudioComponentInitializationScriptProperty`
 *
 * @returns the result of the validation.
 */
function CfnStudioComponent_StudioComponentInitializationScriptPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('launchProfileProtocolVersion', cdk.validateString)(properties.launchProfileProtocolVersion));
    errors.collect(cdk.propertyValidator('platform', cdk.validateString)(properties.platform));
    errors.collect(cdk.propertyValidator('runContext', cdk.validateString)(properties.runContext));
    errors.collect(cdk.propertyValidator('script', cdk.validateString)(properties.script));
    return errors.wrap('supplied properties not correct for "StudioComponentInitializationScriptProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.StudioComponentInitializationScript` resource
 *
 * @param properties - the TypeScript properties of a `StudioComponentInitializationScriptProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::NimbleStudio::StudioComponent.StudioComponentInitializationScript` resource.
 */
// @ts-ignore TS6133
function cfnStudioComponentStudioComponentInitializationScriptPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnStudioComponent_StudioComponentInitializationScriptPropertyValidator(properties).assertSuccess();
    return {
        LaunchProfileProtocolVersion: cdk.stringToCloudFormation(properties.launchProfileProtocolVersion),
        Platform: cdk.stringToCloudFormation(properties.platform),
        RunContext: cdk.stringToCloudFormation(properties.runContext),
        Script: cdk.stringToCloudFormation(properties.script),
    };
}

// @ts-ignore TS6133
function CfnStudioComponentStudioComponentInitializationScriptPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.StudioComponentInitializationScriptProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.StudioComponentInitializationScriptProperty>();
    ret.addPropertyResult('launchProfileProtocolVersion', 'LaunchProfileProtocolVersion', properties.LaunchProfileProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchProfileProtocolVersion) : undefined);
    ret.addPropertyResult('platform', 'Platform', properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined);
    ret.addPropertyResult('runContext', 'RunContext', properties.RunContext != null ? cfn_parse.FromCloudFormation.getString(properties.RunContext) : undefined);
    ret.addPropertyResult('script', 'Script', properties.Script != null ? cfn_parse.FromCloudFormation.getString(properties.Script) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
