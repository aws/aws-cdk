// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:19.109Z","fingerprint":"sI0k8gFgEvFHdVOTC+7/Oi5Rccn5IgS+f49V2s7WWzc="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnPlaybackConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html
 */
export interface CfnPlaybackConfigurationProps {

    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing you can provide a static VAST URL. The maximum length is 25,000 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-addecisionserverurl
     */
    readonly adDecisionServerUrl: string;

    /**
     * The identifier for the playback configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-name
     */
    readonly name: string;

    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-videocontentsourceurl
     */
    readonly videoContentSourceUrl: string;

    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see [Ad Suppression](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-availsuppression
     */
    readonly availSuppression?: CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable;

    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see [Bumpers](https://docs.aws.amazon.com/mediatailor/latest/ug/bumpers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-bumper
     */
    readonly bumper?: CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable;

    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration
     */
    readonly cdnConfiguration?: CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable;

    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see [Domain Variables](https://docs.aws.amazon.com/mediatailor/latest/ug/variables-domain.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-configurationaliases
     */
    readonly configurationAliases?: { [key: string]: (any | cdk.IResolvable) } | cdk.IResolvable;

    /**
     * The configuration for DASH content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration
     */
    readonly dashConfiguration?: CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable;

    /**
     * `AWS::MediaTailor::PlaybackConfiguration.HlsConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-hlsconfiguration
     */
    readonly hlsConfiguration?: CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration for pre-roll ad insertion.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration
     */
    readonly livePreRollConfiguration?: CfnPlaybackConfiguration.LivePreRollConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-manifestprocessingrules
     */
    readonly manifestProcessingRules?: CfnPlaybackConfiguration.ManifestProcessingRulesProperty | cdk.IResolvable;

    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to *ad replacement* in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see [Ad Behavior in MediaTailor](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-personalizationthresholdseconds
     */
    readonly personalizationThresholdSeconds?: number;

    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID configurations. For VPAID, the slate is required because MediaTailor provides it in the slots that are designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-slateadurl
     */
    readonly slateAdUrl?: string;

    /**
     * The tags to assign to the playback configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-transcodeprofilename
     */
    readonly transcodeProfileName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPlaybackConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlaybackConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adDecisionServerUrl', cdk.requiredValidator)(properties.adDecisionServerUrl));
    errors.collect(cdk.propertyValidator('adDecisionServerUrl', cdk.validateString)(properties.adDecisionServerUrl));
    errors.collect(cdk.propertyValidator('availSuppression', CfnPlaybackConfiguration_AvailSuppressionPropertyValidator)(properties.availSuppression));
    errors.collect(cdk.propertyValidator('bumper', CfnPlaybackConfiguration_BumperPropertyValidator)(properties.bumper));
    errors.collect(cdk.propertyValidator('cdnConfiguration', CfnPlaybackConfiguration_CdnConfigurationPropertyValidator)(properties.cdnConfiguration));
    errors.collect(cdk.propertyValidator('configurationAliases', cdk.hashValidator(cdk.validateObject))(properties.configurationAliases));
    errors.collect(cdk.propertyValidator('dashConfiguration', CfnPlaybackConfiguration_DashConfigurationPropertyValidator)(properties.dashConfiguration));
    errors.collect(cdk.propertyValidator('hlsConfiguration', CfnPlaybackConfiguration_HlsConfigurationPropertyValidator)(properties.hlsConfiguration));
    errors.collect(cdk.propertyValidator('livePreRollConfiguration', CfnPlaybackConfiguration_LivePreRollConfigurationPropertyValidator)(properties.livePreRollConfiguration));
    errors.collect(cdk.propertyValidator('manifestProcessingRules', CfnPlaybackConfiguration_ManifestProcessingRulesPropertyValidator)(properties.manifestProcessingRules));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('personalizationThresholdSeconds', cdk.validateNumber)(properties.personalizationThresholdSeconds));
    errors.collect(cdk.propertyValidator('slateAdUrl', cdk.validateString)(properties.slateAdUrl));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('transcodeProfileName', cdk.validateString)(properties.transcodeProfileName));
    errors.collect(cdk.propertyValidator('videoContentSourceUrl', cdk.requiredValidator)(properties.videoContentSourceUrl));
    errors.collect(cdk.propertyValidator('videoContentSourceUrl', cdk.validateString)(properties.videoContentSourceUrl));
    return errors.wrap('supplied properties not correct for "CfnPlaybackConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnPlaybackConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfigurationPropsValidator(properties).assertSuccess();
    return {
        AdDecisionServerUrl: cdk.stringToCloudFormation(properties.adDecisionServerUrl),
        Name: cdk.stringToCloudFormation(properties.name),
        VideoContentSourceUrl: cdk.stringToCloudFormation(properties.videoContentSourceUrl),
        AvailSuppression: cfnPlaybackConfigurationAvailSuppressionPropertyToCloudFormation(properties.availSuppression),
        Bumper: cfnPlaybackConfigurationBumperPropertyToCloudFormation(properties.bumper),
        CdnConfiguration: cfnPlaybackConfigurationCdnConfigurationPropertyToCloudFormation(properties.cdnConfiguration),
        ConfigurationAliases: cdk.hashMapper(cdk.objectToCloudFormation)(properties.configurationAliases),
        DashConfiguration: cfnPlaybackConfigurationDashConfigurationPropertyToCloudFormation(properties.dashConfiguration),
        HlsConfiguration: cfnPlaybackConfigurationHlsConfigurationPropertyToCloudFormation(properties.hlsConfiguration),
        LivePreRollConfiguration: cfnPlaybackConfigurationLivePreRollConfigurationPropertyToCloudFormation(properties.livePreRollConfiguration),
        ManifestProcessingRules: cfnPlaybackConfigurationManifestProcessingRulesPropertyToCloudFormation(properties.manifestProcessingRules),
        PersonalizationThresholdSeconds: cdk.numberToCloudFormation(properties.personalizationThresholdSeconds),
        SlateAdUrl: cdk.stringToCloudFormation(properties.slateAdUrl),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TranscodeProfileName: cdk.stringToCloudFormation(properties.transcodeProfileName),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfigurationProps>();
    ret.addPropertyResult('adDecisionServerUrl', 'AdDecisionServerUrl', cfn_parse.FromCloudFormation.getString(properties.AdDecisionServerUrl));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('videoContentSourceUrl', 'VideoContentSourceUrl', cfn_parse.FromCloudFormation.getString(properties.VideoContentSourceUrl));
    ret.addPropertyResult('availSuppression', 'AvailSuppression', properties.AvailSuppression != null ? CfnPlaybackConfigurationAvailSuppressionPropertyFromCloudFormation(properties.AvailSuppression) : undefined);
    ret.addPropertyResult('bumper', 'Bumper', properties.Bumper != null ? CfnPlaybackConfigurationBumperPropertyFromCloudFormation(properties.Bumper) : undefined);
    ret.addPropertyResult('cdnConfiguration', 'CdnConfiguration', properties.CdnConfiguration != null ? CfnPlaybackConfigurationCdnConfigurationPropertyFromCloudFormation(properties.CdnConfiguration) : undefined);
    ret.addPropertyResult('configurationAliases', 'ConfigurationAliases', properties.ConfigurationAliases != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getAny)(properties.ConfigurationAliases) : undefined);
    ret.addPropertyResult('dashConfiguration', 'DashConfiguration', properties.DashConfiguration != null ? CfnPlaybackConfigurationDashConfigurationPropertyFromCloudFormation(properties.DashConfiguration) : undefined);
    ret.addPropertyResult('hlsConfiguration', 'HlsConfiguration', properties.HlsConfiguration != null ? CfnPlaybackConfigurationHlsConfigurationPropertyFromCloudFormation(properties.HlsConfiguration) : undefined);
    ret.addPropertyResult('livePreRollConfiguration', 'LivePreRollConfiguration', properties.LivePreRollConfiguration != null ? CfnPlaybackConfigurationLivePreRollConfigurationPropertyFromCloudFormation(properties.LivePreRollConfiguration) : undefined);
    ret.addPropertyResult('manifestProcessingRules', 'ManifestProcessingRules', properties.ManifestProcessingRules != null ? CfnPlaybackConfigurationManifestProcessingRulesPropertyFromCloudFormation(properties.ManifestProcessingRules) : undefined);
    ret.addPropertyResult('personalizationThresholdSeconds', 'PersonalizationThresholdSeconds', properties.PersonalizationThresholdSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PersonalizationThresholdSeconds) : undefined);
    ret.addPropertyResult('slateAdUrl', 'SlateAdUrl', properties.SlateAdUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SlateAdUrl) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('transcodeProfileName', 'TranscodeProfileName', properties.TranscodeProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.TranscodeProfileName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaTailor::PlaybackConfiguration`
 *
 * Adds a new playback configuration to AWS Elemental MediaTailor .
 *
 * @cloudformationResource AWS::MediaTailor::PlaybackConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html
 */
export class CfnPlaybackConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaTailor::PlaybackConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlaybackConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPlaybackConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnPlaybackConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The URL generated by MediaTailor to initiate a playback session. The session uses server-side reporting. This setting is ignored in PUT operations.
     * @cloudformationAttribute DashConfiguration.ManifestEndpointPrefix
     */
    public readonly attrDashConfigurationManifestEndpointPrefix: string;

    /**
     * The URL that is used to initiate a playback session for devices that support Apple HLS. The session uses server-side reporting.
     * @cloudformationAttribute HlsConfiguration.ManifestEndpointPrefix
     */
    public readonly attrHlsConfigurationManifestEndpointPrefix: string;

    /**
     * The Amazon Resource Name (ARN) for the playback configuration.
     * @cloudformationAttribute PlaybackConfigurationArn
     */
    public readonly attrPlaybackConfigurationArn: string;

    /**
     * The URL that the player accesses to get a manifest from MediaTailor . This session will use server-side reporting.
     * @cloudformationAttribute PlaybackEndpointPrefix
     */
    public readonly attrPlaybackEndpointPrefix: string;

    /**
     * The URL that the player uses to initialize a session that uses client-side reporting.
     * @cloudformationAttribute SessionInitializationEndpointPrefix
     */
    public readonly attrSessionInitializationEndpointPrefix: string;

    /**
     * The URL for the ad decision server (ADS). This includes the specification of static parameters and placeholders for dynamic parameters. MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing you can provide a static VAST URL. The maximum length is 25,000 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-addecisionserverurl
     */
    public adDecisionServerUrl: string;

    /**
     * The identifier for the playback configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-name
     */
    public name: string;

    /**
     * The URL prefix for the parent manifest for the stream, minus the asset ID. The maximum length is 512 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-videocontentsourceurl
     */
    public videoContentSourceUrl: string;

    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see [Ad Suppression](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-availsuppression
     */
    public availSuppression: CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable | undefined;

    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see [Bumpers](https://docs.aws.amazon.com/mediatailor/latest/ug/bumpers.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-bumper
     */
    public bumper: CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable | undefined;

    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration
     */
    public cdnConfiguration: CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The player parameters and aliases used as dynamic variables during session initialization. For more information, see [Domain Variables](https://docs.aws.amazon.com/mediatailor/latest/ug/variables-domain.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-configurationaliases
     */
    public configurationAliases: { [key: string]: (any | cdk.IResolvable) } | cdk.IResolvable | undefined;

    /**
     * The configuration for DASH content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration
     */
    public dashConfiguration: CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * `AWS::MediaTailor::PlaybackConfiguration.HlsConfiguration`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-hlsconfiguration
     */
    public hlsConfiguration: CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The configuration for pre-roll ad insertion.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration
     */
    public livePreRollConfiguration: CfnPlaybackConfiguration.LivePreRollConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-manifestprocessingrules
     */
    public manifestProcessingRules: CfnPlaybackConfiguration.ManifestProcessingRulesProperty | cdk.IResolvable | undefined;

    /**
     * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break. If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to *ad replacement* in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see [Ad Behavior in MediaTailor](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-personalizationthresholdseconds
     */
    public personalizationThresholdSeconds: number | undefined;

    /**
     * The URL for a high-quality video asset to transcode and use to fill in time that's not used by ads. MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID configurations. For VPAID, the slate is required because MediaTailor provides it in the slots that are designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-slateadurl
     */
    public slateAdUrl: string | undefined;

    /**
     * The tags to assign to the playback configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name that is used to associate this playback configuration with a custom transcode profile. This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-transcodeprofilename
     */
    public transcodeProfileName: string | undefined;

    /**
     * Create a new `AWS::MediaTailor::PlaybackConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPlaybackConfigurationProps) {
        super(scope, id, { type: CfnPlaybackConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'adDecisionServerUrl', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'videoContentSourceUrl', this);
        this.attrDashConfigurationManifestEndpointPrefix = cdk.Token.asString(this.getAtt('DashConfiguration.ManifestEndpointPrefix', cdk.ResolutionTypeHint.STRING));
        this.attrHlsConfigurationManifestEndpointPrefix = cdk.Token.asString(this.getAtt('HlsConfiguration.ManifestEndpointPrefix', cdk.ResolutionTypeHint.STRING));
        this.attrPlaybackConfigurationArn = cdk.Token.asString(this.getAtt('PlaybackConfigurationArn', cdk.ResolutionTypeHint.STRING));
        this.attrPlaybackEndpointPrefix = cdk.Token.asString(this.getAtt('PlaybackEndpointPrefix', cdk.ResolutionTypeHint.STRING));
        this.attrSessionInitializationEndpointPrefix = cdk.Token.asString(this.getAtt('SessionInitializationEndpointPrefix', cdk.ResolutionTypeHint.STRING));

        this.adDecisionServerUrl = props.adDecisionServerUrl;
        this.name = props.name;
        this.videoContentSourceUrl = props.videoContentSourceUrl;
        this.availSuppression = props.availSuppression;
        this.bumper = props.bumper;
        this.cdnConfiguration = props.cdnConfiguration;
        this.configurationAliases = props.configurationAliases;
        this.dashConfiguration = props.dashConfiguration;
        this.hlsConfiguration = props.hlsConfiguration;
        this.livePreRollConfiguration = props.livePreRollConfiguration;
        this.manifestProcessingRules = props.manifestProcessingRules;
        this.personalizationThresholdSeconds = props.personalizationThresholdSeconds;
        this.slateAdUrl = props.slateAdUrl;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaTailor::PlaybackConfiguration", props.tags, { tagPropertyName: 'tags' });
        this.transcodeProfileName = props.transcodeProfileName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlaybackConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            adDecisionServerUrl: this.adDecisionServerUrl,
            name: this.name,
            videoContentSourceUrl: this.videoContentSourceUrl,
            availSuppression: this.availSuppression,
            bumper: this.bumper,
            cdnConfiguration: this.cdnConfiguration,
            configurationAliases: this.configurationAliases,
            dashConfiguration: this.dashConfiguration,
            hlsConfiguration: this.hlsConfiguration,
            livePreRollConfiguration: this.livePreRollConfiguration,
            manifestProcessingRules: this.manifestProcessingRules,
            personalizationThresholdSeconds: this.personalizationThresholdSeconds,
            slateAdUrl: this.slateAdUrl,
            tags: this.tags.renderTags(),
            transcodeProfileName: this.transcodeProfileName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPlaybackConfigurationPropsToCloudFormation(props);
    }
}

export namespace CfnPlaybackConfiguration {
    /**
     * For HLS, when set to `true` , MediaTailor passes through `EXT-X-CUE-IN` , `EXT-X-CUE-OUT` , and `EXT-X-SPLICEPOINT-SCTE35` ad markers from the origin manifest to the MediaTailor personalized manifest.
     *
     * No logic is applied to these ad markers. For example, if `EXT-X-CUE-OUT` has a value of `60` , but no ads are filled for that ad break, MediaTailor will not set the value to `0` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-admarkerpassthrough.html
     */
    export interface AdMarkerPassthroughProperty {
        /**
         * Enables ad marker passthrough for your configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-admarkerpassthrough.html#cfn-mediatailor-playbackconfiguration-admarkerpassthrough-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AdMarkerPassthroughProperty`
 *
 * @param properties - the TypeScript properties of a `AdMarkerPassthroughProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_AdMarkerPassthroughPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "AdMarkerPassthroughProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.AdMarkerPassthrough` resource
 *
 * @param properties - the TypeScript properties of a `AdMarkerPassthroughProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.AdMarkerPassthrough` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationAdMarkerPassthroughPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_AdMarkerPassthroughPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationAdMarkerPassthroughPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.AdMarkerPassthroughProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.AdMarkerPassthroughProperty>();
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for avail suppression, also known as ad suppression. For more information about ad suppression, see [Ad Suppression](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html
     */
    export interface AvailSuppressionProperty {
        /**
         * Sets the ad suppression mode. By default, ad suppression is off and all ad breaks are filled with ads or slate. When Mode is set to BEHIND_LIVE_EDGE, ad suppression is active and MediaTailor won't fill ad breaks on or behind the ad suppression Value time in the manifest lookback window.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html#cfn-mediatailor-playbackconfiguration-availsuppression-mode
         */
        readonly mode?: string;
        /**
         * A live edge offset time in HH:MM:SS. MediaTailor won't fill ad breaks on or behind this time in the manifest lookback window. If Value is set to 00:00:00, it is in sync with the live edge, and MediaTailor won't fill any ad breaks on or behind the live edge. If you set a Value time, MediaTailor won't fill any ad breaks on or behind this time in the manifest lookback window. For example, if you set 00:45:00, then MediaTailor will fill ad breaks that occur within 45 minutes behind the live edge, but won't fill ad breaks on or behind 45 minutes behind the live edge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html#cfn-mediatailor-playbackconfiguration-availsuppression-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AvailSuppressionProperty`
 *
 * @param properties - the TypeScript properties of a `AvailSuppressionProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_AvailSuppressionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "AvailSuppressionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.AvailSuppression` resource
 *
 * @param properties - the TypeScript properties of a `AvailSuppressionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.AvailSuppression` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationAvailSuppressionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_AvailSuppressionPropertyValidator(properties).assertSuccess();
    return {
        Mode: cdk.stringToCloudFormation(properties.mode),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationAvailSuppressionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.AvailSuppressionProperty>();
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for bumpers. Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see [Bumpers](https://docs.aws.amazon.com/mediatailor/latest/ug/bumpers.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html
     */
    export interface BumperProperty {
        /**
         * The URL for the end bumper asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html#cfn-mediatailor-playbackconfiguration-bumper-endurl
         */
        readonly endUrl?: string;
        /**
         * The URL for the start bumper asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html#cfn-mediatailor-playbackconfiguration-bumper-starturl
         */
        readonly startUrl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BumperProperty`
 *
 * @param properties - the TypeScript properties of a `BumperProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_BumperPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endUrl', cdk.validateString)(properties.endUrl));
    errors.collect(cdk.propertyValidator('startUrl', cdk.validateString)(properties.startUrl));
    return errors.wrap('supplied properties not correct for "BumperProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.Bumper` resource
 *
 * @param properties - the TypeScript properties of a `BumperProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.Bumper` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationBumperPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_BumperPropertyValidator(properties).assertSuccess();
    return {
        EndUrl: cdk.stringToCloudFormation(properties.endUrl),
        StartUrl: cdk.stringToCloudFormation(properties.startUrl),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationBumperPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.BumperProperty>();
    ret.addPropertyResult('endUrl', 'EndUrl', properties.EndUrl != null ? cfn_parse.FromCloudFormation.getString(properties.EndUrl) : undefined);
    ret.addPropertyResult('startUrl', 'StartUrl', properties.StartUrl != null ? cfn_parse.FromCloudFormation.getString(properties.StartUrl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html
     */
    export interface CdnConfigurationProperty {
        /**
         * A non-default content delivery network (CDN) to serve ad segments. By default, MediaTailor uses Amazon CloudFront with default cache settings as its CDN for ad segments. To set up an alternate CDN, create a rule in your CDN for the origin ads.mediatailor.&lt;region>.amazonaws.com. Then specify the rule's name in this AdSegmentUrlPrefix. When MediaTailor serves a manifest, it reports your CDN as the source for ad segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration-adsegmenturlprefix
         */
        readonly adSegmentUrlPrefix?: string;
        /**
         * A content delivery network (CDN) to cache content segments, so that content requests don’t always have to go to the origin server. First, create a rule in your CDN for the content segment origin server. Then specify the rule's name in this ContentSegmentUrlPrefix. When MediaTailor serves a manifest, it reports your CDN as the source for content segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration-contentsegmenturlprefix
         */
        readonly contentSegmentUrlPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CdnConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CdnConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_CdnConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adSegmentUrlPrefix', cdk.validateString)(properties.adSegmentUrlPrefix));
    errors.collect(cdk.propertyValidator('contentSegmentUrlPrefix', cdk.validateString)(properties.contentSegmentUrlPrefix));
    return errors.wrap('supplied properties not correct for "CdnConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.CdnConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CdnConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.CdnConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationCdnConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_CdnConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdSegmentUrlPrefix: cdk.stringToCloudFormation(properties.adSegmentUrlPrefix),
        ContentSegmentUrlPrefix: cdk.stringToCloudFormation(properties.contentSegmentUrlPrefix),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationCdnConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.CdnConfigurationProperty>();
    ret.addPropertyResult('adSegmentUrlPrefix', 'AdSegmentUrlPrefix', properties.AdSegmentUrlPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.AdSegmentUrlPrefix) : undefined);
    ret.addPropertyResult('contentSegmentUrlPrefix', 'ContentSegmentUrlPrefix', properties.ContentSegmentUrlPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ContentSegmentUrlPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for DASH content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html
     */
    export interface DashConfigurationProperty {
        /**
         * The URL generated by MediaTailor to initiate a playback session. The session uses server-side reporting. This setting is ignored in PUT operations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-manifestendpointprefix
         */
        readonly manifestEndpointPrefix?: string;
        /**
         * The setting that controls whether MediaTailor includes the Location tag in DASH manifests. MediaTailor populates the Location tag with the URL for manifest update requests, to be used by players that don't support sticky redirects. Disable this if you have CDN routing rules set up for accessing MediaTailor manifests, and you are either using client-side reporting or your players support sticky HTTP redirects. Valid values are DISABLED and EMT_DEFAULT. The EMT_DEFAULT setting enables the inclusion of the tag and is the default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-mpdlocation
         */
        readonly mpdLocation?: string;
        /**
         * The setting that controls whether MediaTailor handles manifests from the origin server as multi-period manifests or single-period manifests. If your origin server produces single-period manifests, set this to SINGLE_PERIOD. The default setting is MULTI_PERIOD. For multi-period manifests, omit this setting or set it to MULTI_PERIOD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-originmanifesttype
         */
        readonly originManifestType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DashConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DashConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_DashConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifestEndpointPrefix', cdk.validateString)(properties.manifestEndpointPrefix));
    errors.collect(cdk.propertyValidator('mpdLocation', cdk.validateString)(properties.mpdLocation));
    errors.collect(cdk.propertyValidator('originManifestType', cdk.validateString)(properties.originManifestType));
    return errors.wrap('supplied properties not correct for "DashConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.DashConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DashConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.DashConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationDashConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_DashConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ManifestEndpointPrefix: cdk.stringToCloudFormation(properties.manifestEndpointPrefix),
        MpdLocation: cdk.stringToCloudFormation(properties.mpdLocation),
        OriginManifestType: cdk.stringToCloudFormation(properties.originManifestType),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationDashConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.DashConfigurationProperty>();
    ret.addPropertyResult('manifestEndpointPrefix', 'ManifestEndpointPrefix', properties.ManifestEndpointPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestEndpointPrefix) : undefined);
    ret.addPropertyResult('mpdLocation', 'MpdLocation', properties.MpdLocation != null ? cfn_parse.FromCloudFormation.getString(properties.MpdLocation) : undefined);
    ret.addPropertyResult('originManifestType', 'OriginManifestType', properties.OriginManifestType != null ? cfn_parse.FromCloudFormation.getString(properties.OriginManifestType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for HLS content.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-hlsconfiguration.html
     */
    export interface HlsConfigurationProperty {
        /**
         * The URL that is used to initiate a playback session for devices that support Apple HLS. The session uses server-side reporting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-hlsconfiguration.html#cfn-mediatailor-playbackconfiguration-hlsconfiguration-manifestendpointprefix
         */
        readonly manifestEndpointPrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HlsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_HlsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('manifestEndpointPrefix', cdk.validateString)(properties.manifestEndpointPrefix));
    return errors.wrap('supplied properties not correct for "HlsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.HlsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `HlsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.HlsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationHlsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_HlsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ManifestEndpointPrefix: cdk.stringToCloudFormation(properties.manifestEndpointPrefix),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationHlsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.HlsConfigurationProperty>();
    ret.addPropertyResult('manifestEndpointPrefix', 'ManifestEndpointPrefix', properties.ManifestEndpointPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestEndpointPrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for pre-roll ad insertion.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html
     */
    export interface LivePreRollConfigurationProperty {
        /**
         * The URL for the ad decision server (ADS) for pre-roll ads. This includes the specification of static parameters and placeholders for dynamic parameters. MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing, you can provide a static VAST URL. The maximum length is 25,000 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration-addecisionserverurl
         */
        readonly adDecisionServerUrl?: string;
        /**
         * The maximum allowed duration for the pre-roll ad avail. MediaTailor won't play pre-roll ads to exceed this duration, regardless of the total duration of ads that the ADS returns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration-maxdurationseconds
         */
        readonly maxDurationSeconds?: number;
    }
}

/**
 * Determine whether the given properties match those of a `LivePreRollConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LivePreRollConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_LivePreRollConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adDecisionServerUrl', cdk.validateString)(properties.adDecisionServerUrl));
    errors.collect(cdk.propertyValidator('maxDurationSeconds', cdk.validateNumber)(properties.maxDurationSeconds));
    return errors.wrap('supplied properties not correct for "LivePreRollConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.LivePreRollConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `LivePreRollConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.LivePreRollConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationLivePreRollConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_LivePreRollConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AdDecisionServerUrl: cdk.stringToCloudFormation(properties.adDecisionServerUrl),
        MaxDurationSeconds: cdk.numberToCloudFormation(properties.maxDurationSeconds),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationLivePreRollConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.LivePreRollConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.LivePreRollConfigurationProperty>();
    ret.addPropertyResult('adDecisionServerUrl', 'AdDecisionServerUrl', properties.AdDecisionServerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AdDecisionServerUrl) : undefined);
    ret.addPropertyResult('maxDurationSeconds', 'MaxDurationSeconds', properties.MaxDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDurationSeconds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPlaybackConfiguration {
    /**
     * The configuration for manifest processing rules. Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-manifestprocessingrules.html
     */
    export interface ManifestProcessingRulesProperty {
        /**
         * For HLS, when set to `true` , MediaTailor passes through `EXT-X-CUE-IN` , `EXT-X-CUE-OUT` , and `EXT-X-SPLICEPOINT-SCTE35` ad markers from the origin manifest to the MediaTailor personalized manifest.
         *
         * No logic is applied to these ad markers. For example, if `EXT-X-CUE-OUT` has a value of `60` , but no ads are filled for that ad break, MediaTailor will not set the value to `0` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-manifestprocessingrules.html#cfn-mediatailor-playbackconfiguration-manifestprocessingrules-admarkerpassthrough
         */
        readonly adMarkerPassthrough?: CfnPlaybackConfiguration.AdMarkerPassthroughProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ManifestProcessingRulesProperty`
 *
 * @param properties - the TypeScript properties of a `ManifestProcessingRulesProperty`
 *
 * @returns the result of the validation.
 */
function CfnPlaybackConfiguration_ManifestProcessingRulesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkerPassthrough', CfnPlaybackConfiguration_AdMarkerPassthroughPropertyValidator)(properties.adMarkerPassthrough));
    return errors.wrap('supplied properties not correct for "ManifestProcessingRulesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.ManifestProcessingRules` resource
 *
 * @param properties - the TypeScript properties of a `ManifestProcessingRulesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaTailor::PlaybackConfiguration.ManifestProcessingRules` resource.
 */
// @ts-ignore TS6133
function cfnPlaybackConfigurationManifestProcessingRulesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPlaybackConfiguration_ManifestProcessingRulesPropertyValidator(properties).assertSuccess();
    return {
        AdMarkerPassthrough: cfnPlaybackConfigurationAdMarkerPassthroughPropertyToCloudFormation(properties.adMarkerPassthrough),
    };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationManifestProcessingRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.ManifestProcessingRulesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.ManifestProcessingRulesProperty>();
    ret.addPropertyResult('adMarkerPassthrough', 'AdMarkerPassthrough', properties.AdMarkerPassthrough != null ? CfnPlaybackConfigurationAdMarkerPassthroughPropertyFromCloudFormation(properties.AdMarkerPassthrough) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
