// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:41.013Z","fingerprint":"6FGJPw+naTn156XOaZzKgIXR71FTIGjF8ccphq6xzlg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnADMChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html
 */
export interface CfnADMChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the ADM channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The Client ID that you received from Amazon to send messages by using ADM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientid
     */
    readonly clientId: string;

    /**
     * The Client Secret that you received from Amazon to send messages by using ADM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientsecret
     */
    readonly clientSecret: string;

    /**
     * Specifies whether to enable the ADM channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnADMChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnADMChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnADMChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('clientId', cdk.requiredValidator)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.requiredValidator)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.validateString)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "CfnADMChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::ADMChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnADMChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::ADMChannel` resource.
 */
// @ts-ignore TS6133
function cfnADMChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnADMChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        ClientSecret: cdk.stringToCloudFormation(properties.clientSecret),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnADMChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnADMChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnADMChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('clientId', 'ClientId', cfn_parse.FromCloudFormation.getString(properties.ClientId));
    ret.addPropertyResult('clientSecret', 'ClientSecret', cfn_parse.FromCloudFormation.getString(properties.ClientSecret));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::ADMChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the ADM channel to send push notifications through the Amazon Device Messaging (ADM) service to apps that run on Amazon devices, such as Kindle Fire tablets. Before you can use Amazon Pinpoint to send messages to Amazon devices, you have to enable the ADM channel for an Amazon Pinpoint application.
 *
 * The ADMChannel resource represents the status and authentication settings for the ADM channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::ADMChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html
 */
export class CfnADMChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::ADMChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnADMChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnADMChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnADMChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the ADM channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-applicationid
     */
    public applicationId: string;

    /**
     * The Client ID that you received from Amazon to send messages by using ADM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientid
     */
    public clientId: string;

    /**
     * The Client Secret that you received from Amazon to send messages by using ADM.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-clientsecret
     */
    public clientSecret: string;

    /**
     * Specifies whether to enable the ADM channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-admchannel.html#cfn-pinpoint-admchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pinpoint::ADMChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnADMChannelProps) {
        super(scope, id, { type: CfnADMChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'clientId', this);
        cdk.requireProperty(props, 'clientSecret', this);

        this.applicationId = props.applicationId;
        this.clientId = props.clientId;
        this.clientSecret = props.clientSecret;
        this.enabled = props.enabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnADMChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            enabled: this.enabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnADMChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnAPNSChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html
 */
export interface CfnAPNSChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-bundleid
     */
    readonly bundleId?: string;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-certificate
     */
    readonly certificate?: string;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-defaultauthenticationmethod
     */
    readonly defaultAuthenticationMethod?: string;

    /**
     * Specifies whether to enable the APNs channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-privatekey
     */
    readonly privateKey?: string;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-teamid
     */
    readonly teamId?: string;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkey
     */
    readonly tokenKey?: string;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkeyid
     */
    readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnAPNSChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('defaultAuthenticationMethod', cdk.validateString)(properties.defaultAuthenticationMethod));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    errors.collect(cdk.propertyValidator('tokenKey', cdk.validateString)(properties.tokenKey));
    errors.collect(cdk.propertyValidator('tokenKeyId', cdk.validateString)(properties.tokenKeyId));
    return errors.wrap('supplied properties not correct for "CfnAPNSChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::APNSChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnAPNSChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::APNSChannel` resource.
 */
// @ts-ignore TS6133
function cfnAPNSChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAPNSChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        DefaultAuthenticationMethod: cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        TokenKey: cdk.stringToCloudFormation(properties.tokenKey),
        TokenKeyId: cdk.stringToCloudFormation(properties.tokenKeyId),
    };
}

// @ts-ignore TS6133
function CfnAPNSChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('bundleId', 'BundleId', properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined);
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('defaultAuthenticationMethod', 'DefaultAuthenticationMethod', properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addPropertyResult('teamId', 'TeamId', properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined);
    ret.addPropertyResult('tokenKey', 'TokenKey', properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined);
    ret.addPropertyResult('tokenKeyId', 'TokenKeyId', properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::APNSChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the APNs channel to send push notification messages to the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send notifications to APNs, you have to enable the APNs channel for an Amazon Pinpoint application.
 *
 * The APNSChannel resource represents the status and authentication settings for the APNs channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html
 */
export class CfnAPNSChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::APNSChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAPNSChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAPNSChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-applicationid
     */
    public applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-bundleid
     */
    public bundleId: string | undefined;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-certificate
     */
    public certificate: string | undefined;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-defaultauthenticationmethod
     */
    public defaultAuthenticationMethod: string | undefined;

    /**
     * Specifies whether to enable the APNs channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-privatekey
     */
    public privateKey: string | undefined;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-teamid
     */
    public teamId: string | undefined;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkey
     */
    public tokenKey: string | undefined;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnschannel.html#cfn-pinpoint-apnschannel-tokenkeyid
     */
    public tokenKeyId: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::APNSChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAPNSChannelProps) {
        super(scope, id, { type: CfnAPNSChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.bundleId = props.bundleId;
        this.certificate = props.certificate;
        this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
        this.enabled = props.enabled;
        this.privateKey = props.privateKey;
        this.teamId = props.teamId;
        this.tokenKey = props.tokenKey;
        this.tokenKeyId = props.tokenKeyId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            bundleId: this.bundleId,
            certificate: this.certificate,
            defaultAuthenticationMethod: this.defaultAuthenticationMethod,
            enabled: this.enabled,
            privateKey: this.privateKey,
            teamId: this.teamId,
            tokenKey: this.tokenKey,
            tokenKeyId: this.tokenKeyId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAPNSChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnAPNSSandboxChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html
 */
export interface CfnAPNSSandboxChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs sandbox channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-bundleid
     */
    readonly bundleId?: string;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-certificate
     */
    readonly certificate?: string;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-defaultauthenticationmethod
     */
    readonly defaultAuthenticationMethod?: string;

    /**
     * Specifies whether to enable the APNs Sandbox channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-privatekey
     */
    readonly privateKey?: string;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-teamid
     */
    readonly teamId?: string;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkey
     */
    readonly tokenKey?: string;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkeyid
     */
    readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSSandboxChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSSandboxChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnAPNSSandboxChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('defaultAuthenticationMethod', cdk.validateString)(properties.defaultAuthenticationMethod));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    errors.collect(cdk.propertyValidator('tokenKey', cdk.validateString)(properties.tokenKey));
    errors.collect(cdk.propertyValidator('tokenKeyId', cdk.validateString)(properties.tokenKeyId));
    return errors.wrap('supplied properties not correct for "CfnAPNSSandboxChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::APNSSandboxChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnAPNSSandboxChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::APNSSandboxChannel` resource.
 */
// @ts-ignore TS6133
function cfnAPNSSandboxChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAPNSSandboxChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        DefaultAuthenticationMethod: cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        TokenKey: cdk.stringToCloudFormation(properties.tokenKey),
        TokenKeyId: cdk.stringToCloudFormation(properties.tokenKeyId),
    };
}

// @ts-ignore TS6133
function CfnAPNSSandboxChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSSandboxChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSSandboxChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('bundleId', 'BundleId', properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined);
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('defaultAuthenticationMethod', 'DefaultAuthenticationMethod', properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addPropertyResult('teamId', 'TeamId', properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined);
    ret.addPropertyResult('tokenKey', 'TokenKey', properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined);
    ret.addPropertyResult('tokenKeyId', 'TokenKeyId', properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::APNSSandboxChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the APNs sandbox channel to send push notification messages to the sandbox environment of the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send notifications to the APNs sandbox environment, you have to enable the APNs sandbox channel for an Amazon Pinpoint application.
 *
 * The APNSSandboxChannel resource represents the status and authentication settings of the APNs sandbox channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSSandboxChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html
 */
export class CfnAPNSSandboxChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::APNSSandboxChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSSandboxChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAPNSSandboxChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAPNSSandboxChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs sandbox channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-applicationid
     */
    public applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-bundleid
     */
    public bundleId: string | undefined;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-certificate
     */
    public certificate: string | undefined;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-defaultauthenticationmethod
     */
    public defaultAuthenticationMethod: string | undefined;

    /**
     * Specifies whether to enable the APNs Sandbox channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-privatekey
     */
    public privateKey: string | undefined;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-teamid
     */
    public teamId: string | undefined;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkey
     */
    public tokenKey: string | undefined;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnssandboxchannel.html#cfn-pinpoint-apnssandboxchannel-tokenkeyid
     */
    public tokenKeyId: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::APNSSandboxChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAPNSSandboxChannelProps) {
        super(scope, id, { type: CfnAPNSSandboxChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.bundleId = props.bundleId;
        this.certificate = props.certificate;
        this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
        this.enabled = props.enabled;
        this.privateKey = props.privateKey;
        this.teamId = props.teamId;
        this.tokenKey = props.tokenKey;
        this.tokenKeyId = props.tokenKeyId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSSandboxChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            bundleId: this.bundleId,
            certificate: this.certificate,
            defaultAuthenticationMethod: this.defaultAuthenticationMethod,
            enabled: this.enabled,
            privateKey: this.privateKey,
            teamId: this.teamId,
            tokenKey: this.tokenKey,
            tokenKeyId: this.tokenKeyId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAPNSSandboxChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnAPNSVoipChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html
 */
export interface CfnAPNSVoipChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs VoIP channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-bundleid
     */
    readonly bundleId?: string;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-certificate
     */
    readonly certificate?: string;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-defaultauthenticationmethod
     */
    readonly defaultAuthenticationMethod?: string;

    /**
     * Specifies whether to enable the APNs VoIP channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-privatekey
     */
    readonly privateKey?: string;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-teamid
     */
    readonly teamId?: string;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkey
     */
    readonly tokenKey?: string;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkeyid
     */
    readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSVoipChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnAPNSVoipChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('defaultAuthenticationMethod', cdk.validateString)(properties.defaultAuthenticationMethod));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    errors.collect(cdk.propertyValidator('tokenKey', cdk.validateString)(properties.tokenKey));
    errors.collect(cdk.propertyValidator('tokenKeyId', cdk.validateString)(properties.tokenKeyId));
    return errors.wrap('supplied properties not correct for "CfnAPNSVoipChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::APNSVoipChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::APNSVoipChannel` resource.
 */
// @ts-ignore TS6133
function cfnAPNSVoipChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAPNSVoipChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        DefaultAuthenticationMethod: cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        TokenKey: cdk.stringToCloudFormation(properties.tokenKey),
        TokenKeyId: cdk.stringToCloudFormation(properties.tokenKeyId),
    };
}

// @ts-ignore TS6133
function CfnAPNSVoipChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSVoipChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSVoipChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('bundleId', 'BundleId', properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined);
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('defaultAuthenticationMethod', 'DefaultAuthenticationMethod', properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addPropertyResult('teamId', 'TeamId', properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined);
    ret.addPropertyResult('tokenKey', 'TokenKey', properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined);
    ret.addPropertyResult('tokenKeyId', 'TokenKeyId', properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::APNSVoipChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the APNs VoIP channel to send VoIP notification messages to the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send VoIP notifications to APNs, you have to enable the APNs VoIP channel for an Amazon Pinpoint application.
 *
 * The APNSVoipChannel resource represents the status and authentication settings of the APNs VoIP channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSVoipChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html
 */
export class CfnAPNSVoipChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::APNSVoipChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSVoipChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAPNSVoipChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAPNSVoipChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the APNs VoIP channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-applicationid
     */
    public applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-bundleid
     */
    public bundleId: string | undefined;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with APNs by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-certificate
     */
    public certificate: string | undefined;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-defaultauthenticationmethod
     */
    public defaultAuthenticationMethod: string | undefined;

    /**
     * Specifies whether to enable the APNs VoIP channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with APNs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-privatekey
     */
    public privateKey: string | undefined;

    /**
     * The identifier that's assigned to your Apple Developer Account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-teamid
     */
    public teamId: string | undefined;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkey
     */
    public tokenKey: string | undefined;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with APNs by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipchannel.html#cfn-pinpoint-apnsvoipchannel-tokenkeyid
     */
    public tokenKeyId: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::APNSVoipChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAPNSVoipChannelProps) {
        super(scope, id, { type: CfnAPNSVoipChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.bundleId = props.bundleId;
        this.certificate = props.certificate;
        this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
        this.enabled = props.enabled;
        this.privateKey = props.privateKey;
        this.teamId = props.teamId;
        this.tokenKey = props.tokenKey;
        this.tokenKeyId = props.tokenKeyId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSVoipChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            bundleId: this.bundleId,
            certificate: this.certificate,
            defaultAuthenticationMethod: this.defaultAuthenticationMethod,
            enabled: this.enabled,
            privateKey: this.privateKey,
            teamId: this.teamId,
            tokenKey: this.tokenKey,
            tokenKeyId: this.tokenKeyId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAPNSVoipChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnAPNSVoipSandboxChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html
 */
export interface CfnAPNSVoipSandboxChannelProps {

    /**
     * The unique identifier for the application that the APNs VoIP sandbox channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-bundleid
     */
    readonly bundleId?: string;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-certificate
     */
    readonly certificate?: string;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-defaultauthenticationmethod
     */
    readonly defaultAuthenticationMethod?: string;

    /**
     * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-privatekey
     */
    readonly privateKey?: string;

    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-teamid
     */
    readonly teamId?: string;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkey
     */
    readonly tokenKey?: string;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkeyid
     */
    readonly tokenKeyId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAPNSVoipSandboxChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipSandboxChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnAPNSVoipSandboxChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('bundleId', cdk.validateString)(properties.bundleId));
    errors.collect(cdk.propertyValidator('certificate', cdk.validateString)(properties.certificate));
    errors.collect(cdk.propertyValidator('defaultAuthenticationMethod', cdk.validateString)(properties.defaultAuthenticationMethod));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('privateKey', cdk.validateString)(properties.privateKey));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    errors.collect(cdk.propertyValidator('tokenKey', cdk.validateString)(properties.tokenKey));
    errors.collect(cdk.propertyValidator('tokenKeyId', cdk.validateString)(properties.tokenKeyId));
    return errors.wrap('supplied properties not correct for "CfnAPNSVoipSandboxChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::APNSVoipSandboxChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnAPNSVoipSandboxChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::APNSVoipSandboxChannel` resource.
 */
// @ts-ignore TS6133
function cfnAPNSVoipSandboxChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAPNSVoipSandboxChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        BundleId: cdk.stringToCloudFormation(properties.bundleId),
        Certificate: cdk.stringToCloudFormation(properties.certificate),
        DefaultAuthenticationMethod: cdk.stringToCloudFormation(properties.defaultAuthenticationMethod),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        PrivateKey: cdk.stringToCloudFormation(properties.privateKey),
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        TokenKey: cdk.stringToCloudFormation(properties.tokenKey),
        TokenKeyId: cdk.stringToCloudFormation(properties.tokenKeyId),
    };
}

// @ts-ignore TS6133
function CfnAPNSVoipSandboxChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPNSVoipSandboxChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPNSVoipSandboxChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('bundleId', 'BundleId', properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined);
    ret.addPropertyResult('certificate', 'Certificate', properties.Certificate != null ? cfn_parse.FromCloudFormation.getString(properties.Certificate) : undefined);
    ret.addPropertyResult('defaultAuthenticationMethod', 'DefaultAuthenticationMethod', properties.DefaultAuthenticationMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthenticationMethod) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('privateKey', 'PrivateKey', properties.PrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateKey) : undefined);
    ret.addPropertyResult('teamId', 'TeamId', properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined);
    ret.addPropertyResult('tokenKey', 'TokenKey', properties.TokenKey != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKey) : undefined);
    ret.addPropertyResult('tokenKeyId', 'TokenKeyId', properties.TokenKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.TokenKeyId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::APNSVoipSandboxChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the APNs VoIP sandbox channel to send VoIP notification messages to the sandbox environment of the Apple Push Notification service (APNs). Before you can use Amazon Pinpoint to send VoIP notifications to the APNs sandbox environment, you have to enable the APNs VoIP sandbox channel for an Amazon Pinpoint application.
 *
 * The APNSVoipSandboxChannel resource represents the status and authentication settings of the APNs VoIP sandbox channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::APNSVoipSandboxChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html
 */
export class CfnAPNSVoipSandboxChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::APNSVoipSandboxChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPNSVoipSandboxChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAPNSVoipSandboxChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAPNSVoipSandboxChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the application that the APNs VoIP sandbox channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-applicationid
     */
    public applicationId: string;

    /**
     * The bundle identifier that's assigned to your iOS app. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-bundleid
     */
    public bundleId: string | undefined;

    /**
     * The APNs client certificate that you received from Apple. Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using an APNs certificate.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-certificate
     */
    public certificate: string | undefined;

    /**
     * The default authentication method that you want Amazon Pinpoint to use when authenticating with APNs. Valid options are `key` or `certificate` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-defaultauthenticationmethod
     */
    public defaultAuthenticationMethod: string | undefined;

    /**
     * Specifies whether the APNs VoIP sandbox channel is enabled for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The private key for the APNs client certificate that you want Amazon Pinpoint to use to communicate with the APNs sandbox environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-privatekey
     */
    public privateKey: string | undefined;

    /**
     * The identifier that's assigned to your Apple developer account team. This identifier is used for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-teamid
     */
    public teamId: string | undefined;

    /**
     * The authentication key to use for APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkey
     */
    public tokenKey: string | undefined;

    /**
     * The key identifier that's assigned to your APNs signing key. Specify this value if you want Amazon Pinpoint to communicate with the APNs sandbox environment by using APNs tokens.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-apnsvoipsandboxchannel.html#cfn-pinpoint-apnsvoipsandboxchannel-tokenkeyid
     */
    public tokenKeyId: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::APNSVoipSandboxChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAPNSVoipSandboxChannelProps) {
        super(scope, id, { type: CfnAPNSVoipSandboxChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.bundleId = props.bundleId;
        this.certificate = props.certificate;
        this.defaultAuthenticationMethod = props.defaultAuthenticationMethod;
        this.enabled = props.enabled;
        this.privateKey = props.privateKey;
        this.teamId = props.teamId;
        this.tokenKey = props.tokenKey;
        this.tokenKeyId = props.tokenKeyId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPNSVoipSandboxChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            bundleId: this.bundleId,
            certificate: this.certificate,
            defaultAuthenticationMethod: this.defaultAuthenticationMethod,
            enabled: this.enabled,
            privateKey: this.privateKey,
            teamId: this.teamId,
            tokenKey: this.tokenKey,
            tokenKeyId: this.tokenKeyId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAPNSVoipSandboxChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html
 */
export interface CfnAppProps {

    /**
     * The display name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-name
     */
    readonly name: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-tags
     */
    readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAppProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::App` resource
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::App` resource.
 */
// @ts-ignore TS6133
function cfnAppPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAppPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.objectToCloudFormation(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::App`
 *
 * An *app* is an Amazon Pinpoint application, also referred to as a *project* . An application is a collection of related settings, customer information, segments, campaigns, and other types of Amazon Pinpoint resources.
 *
 * The App resource represents an Amazon Pinpoint application.
 *
 * @cloudformationResource AWS::Pinpoint::App
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::App";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApp(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the application.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The display name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-name
     */
    public name: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-app.html#cfn-pinpoint-app-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Pinpoint::App`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
        super(scope, id, { type: CfnApp.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::App", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAppPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnApplicationSettings`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html
 */
export interface CfnApplicationSettingsProps {

    /**
     * The unique identifier for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-applicationid
     */
    readonly applicationId: string;

    /**
     * The settings for the Lambda function to use by default as a code hook for campaigns in the application. To override these settings for a specific campaign, use the Campaign resource to define custom Lambda function settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-campaignhook
     */
    readonly campaignHook?: CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable;

    /**
     * Specifies whether to enable application-related alarms in Amazon CloudWatch.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-cloudwatchmetricsenabled
     */
    readonly cloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * The default sending limits for campaigns in the application. To override these limits for a specific campaign, use the Campaign resource to define custom limits for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-limits
     */
    readonly limits?: CfnApplicationSettings.LimitsProperty | cdk.IResolvable;

    /**
     * The default quiet time for campaigns in the application. Quiet time is a specific time range when campaigns don't send messages to endpoints, if all the following conditions are met:
     *
     * - The `EndpointDemographic.Timezone` property of the endpoint is set to a valid value.
     *
     * - The current time in the endpoint's time zone is later than or equal to the time specified by the `QuietTime.Start` property for the application (or a campaign that has custom quiet time settings).
     *
     * - The current time in the endpoint's time zone is earlier than or equal to the time specified by the `QuietTime.End` property for the application (or a campaign that has custom quiet time settings).
     *
     * If any of the preceding conditions isn't met, the endpoint will receive messages from a campaign, even if quiet time is enabled.
     *
     * To override the default quiet time settings for a specific campaign, use the Campaign resource to define a custom quiet time for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-quiettime
     */
    readonly quietTime?: CfnApplicationSettings.QuietTimeProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationSettingsProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationSettingsProps`
 *
 * @returns the result of the validation.
 */
function CfnApplicationSettingsPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('campaignHook', CfnApplicationSettings_CampaignHookPropertyValidator)(properties.campaignHook));
    errors.collect(cdk.propertyValidator('cloudWatchMetricsEnabled', cdk.validateBoolean)(properties.cloudWatchMetricsEnabled));
    errors.collect(cdk.propertyValidator('limits', CfnApplicationSettings_LimitsPropertyValidator)(properties.limits));
    errors.collect(cdk.propertyValidator('quietTime', CfnApplicationSettings_QuietTimePropertyValidator)(properties.quietTime));
    return errors.wrap('supplied properties not correct for "CfnApplicationSettingsProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings` resource
 *
 * @param properties - the TypeScript properties of a `CfnApplicationSettingsProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSettingsPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationSettingsPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        CampaignHook: cfnApplicationSettingsCampaignHookPropertyToCloudFormation(properties.campaignHook),
        CloudWatchMetricsEnabled: cdk.booleanToCloudFormation(properties.cloudWatchMetricsEnabled),
        Limits: cfnApplicationSettingsLimitsPropertyToCloudFormation(properties.limits),
        QuietTime: cfnApplicationSettingsQuietTimePropertyToCloudFormation(properties.quietTime),
    };
}

// @ts-ignore TS6133
function CfnApplicationSettingsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettingsProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettingsProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('campaignHook', 'CampaignHook', properties.CampaignHook != null ? CfnApplicationSettingsCampaignHookPropertyFromCloudFormation(properties.CampaignHook) : undefined);
    ret.addPropertyResult('cloudWatchMetricsEnabled', 'CloudWatchMetricsEnabled', properties.CloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CloudWatchMetricsEnabled) : undefined);
    ret.addPropertyResult('limits', 'Limits', properties.Limits != null ? CfnApplicationSettingsLimitsPropertyFromCloudFormation(properties.Limits) : undefined);
    ret.addPropertyResult('quietTime', 'QuietTime', properties.QuietTime != null ? CfnApplicationSettingsQuietTimePropertyFromCloudFormation(properties.QuietTime) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::ApplicationSettings`
 *
 * Specifies the settings for an Amazon Pinpoint application. In Amazon Pinpoint, an *application* (also referred to as an *app* or *project* ) is a collection of related settings, customer information, segments, and campaigns, and other types of Amazon Pinpoint resources.
 *
 * @cloudformationResource AWS::Pinpoint::ApplicationSettings
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html
 */
export class CfnApplicationSettings extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::ApplicationSettings";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationSettings {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnApplicationSettingsPropsFromCloudFormation(resourceProperties);
        const ret = new CfnApplicationSettings(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-applicationid
     */
    public applicationId: string;

    /**
     * The settings for the Lambda function to use by default as a code hook for campaigns in the application. To override these settings for a specific campaign, use the Campaign resource to define custom Lambda function settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-campaignhook
     */
    public campaignHook: CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable | undefined;

    /**
     * Specifies whether to enable application-related alarms in Amazon CloudWatch.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-cloudwatchmetricsenabled
     */
    public cloudWatchMetricsEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The default sending limits for campaigns in the application. To override these limits for a specific campaign, use the Campaign resource to define custom limits for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-limits
     */
    public limits: CfnApplicationSettings.LimitsProperty | cdk.IResolvable | undefined;

    /**
     * The default quiet time for campaigns in the application. Quiet time is a specific time range when campaigns don't send messages to endpoints, if all the following conditions are met:
     *
     * - The `EndpointDemographic.Timezone` property of the endpoint is set to a valid value.
     *
     * - The current time in the endpoint's time zone is later than or equal to the time specified by the `QuietTime.Start` property for the application (or a campaign that has custom quiet time settings).
     *
     * - The current time in the endpoint's time zone is earlier than or equal to the time specified by the `QuietTime.End` property for the application (or a campaign that has custom quiet time settings).
     *
     * If any of the preceding conditions isn't met, the endpoint will receive messages from a campaign, even if quiet time is enabled.
     *
     * To override the default quiet time settings for a specific campaign, use the Campaign resource to define a custom quiet time for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-applicationsettings.html#cfn-pinpoint-applicationsettings-quiettime
     */
    public quietTime: CfnApplicationSettings.QuietTimeProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pinpoint::ApplicationSettings`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationSettingsProps) {
        super(scope, id, { type: CfnApplicationSettings.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.campaignHook = props.campaignHook;
        this.cloudWatchMetricsEnabled = props.cloudWatchMetricsEnabled;
        this.limits = props.limits;
        this.quietTime = props.quietTime;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationSettings.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            campaignHook: this.campaignHook,
            cloudWatchMetricsEnabled: this.cloudWatchMetricsEnabled,
            limits: this.limits,
            quietTime: this.quietTime,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnApplicationSettingsPropsToCloudFormation(props);
    }
}

export namespace CfnApplicationSettings {
    /**
     * Specifies the Lambda function to use by default as a code hook for campaigns in the application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html
     */
    export interface CampaignHookProperty {
        /**
         * The name or Amazon Resource Name (ARN) of the Lambda function that Amazon Pinpoint invokes to send messages for campaigns in the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-lambdafunctionname
         */
        readonly lambdaFunctionName?: string;
        /**
         * The mode that Amazon Pinpoint uses to invoke the Lambda function. Possible values are:
         *
         * - `FILTER` - Invoke the function to customize the segment that's used by a campaign.
         * - `DELIVERY` - (Deprecated) Previously, invoked the function to send a campaign through a custom channel. This functionality is not supported anymore. To send a campaign through a custom channel, use the `CustomDeliveryConfiguration` and `CampaignCustomMessage` objects of the campaign.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-mode
         */
        readonly mode?: string;
        /**
         * The web URL that Amazon Pinpoint calls to invoke the Lambda function over HTTPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-campaignhook.html#cfn-pinpoint-applicationsettings-campaignhook-weburl
         */
        readonly webUrl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignHookProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationSettings_CampaignHookPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaFunctionName', cdk.validateString)(properties.lambdaFunctionName));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('webUrl', cdk.validateString)(properties.webUrl));
    return errors.wrap('supplied properties not correct for "CampaignHookProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.CampaignHook` resource
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.CampaignHook` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSettingsCampaignHookPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationSettings_CampaignHookPropertyValidator(properties).assertSuccess();
    return {
        LambdaFunctionName: cdk.stringToCloudFormation(properties.lambdaFunctionName),
        Mode: cdk.stringToCloudFormation(properties.mode),
        WebUrl: cdk.stringToCloudFormation(properties.webUrl),
    };
}

// @ts-ignore TS6133
function CfnApplicationSettingsCampaignHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettings.CampaignHookProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.CampaignHookProperty>();
    ret.addPropertyResult('lambdaFunctionName', 'LambdaFunctionName', properties.LambdaFunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionName) : undefined);
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addPropertyResult('webUrl', 'WebUrl', properties.WebUrl != null ? cfn_parse.FromCloudFormation.getString(properties.WebUrl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationSettings {
    /**
     * Specifies the default sending limits for campaigns in the application.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html
     */
    export interface LimitsProperty {
        /**
         * The maximum number of messages that a campaign can send to a single endpoint during a 24-hour period. The maximum value is 100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-daily
         */
        readonly daily?: number;
        /**
         * The maximum amount of time, in seconds, that a campaign can attempt to deliver a message after the scheduled start time for the campaign. The minimum value is 60 seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-maximumduration
         */
        readonly maximumDuration?: number;
        /**
         * The maximum number of messages that a campaign can send each second. The minimum value is 50. The maximum value is 20,000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-messagespersecond
         */
        readonly messagesPerSecond?: number;
        /**
         * The maximum number of messages that a campaign can send to a single endpoint during the course of the campaign. The maximum value is 100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-limits.html#cfn-pinpoint-applicationsettings-limits-total
         */
        readonly total?: number;
    }
}

/**
 * Determine whether the given properties match those of a `LimitsProperty`
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationSettings_LimitsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('daily', cdk.validateNumber)(properties.daily));
    errors.collect(cdk.propertyValidator('maximumDuration', cdk.validateNumber)(properties.maximumDuration));
    errors.collect(cdk.propertyValidator('messagesPerSecond', cdk.validateNumber)(properties.messagesPerSecond));
    errors.collect(cdk.propertyValidator('total', cdk.validateNumber)(properties.total));
    return errors.wrap('supplied properties not correct for "LimitsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.Limits` resource
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.Limits` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSettingsLimitsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationSettings_LimitsPropertyValidator(properties).assertSuccess();
    return {
        Daily: cdk.numberToCloudFormation(properties.daily),
        MaximumDuration: cdk.numberToCloudFormation(properties.maximumDuration),
        MessagesPerSecond: cdk.numberToCloudFormation(properties.messagesPerSecond),
        Total: cdk.numberToCloudFormation(properties.total),
    };
}

// @ts-ignore TS6133
function CfnApplicationSettingsLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettings.LimitsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.LimitsProperty>();
    ret.addPropertyResult('daily', 'Daily', properties.Daily != null ? cfn_parse.FromCloudFormation.getNumber(properties.Daily) : undefined);
    ret.addPropertyResult('maximumDuration', 'MaximumDuration', properties.MaximumDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumDuration) : undefined);
    ret.addPropertyResult('messagesPerSecond', 'MessagesPerSecond', properties.MessagesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessagesPerSecond) : undefined);
    ret.addPropertyResult('total', 'Total', properties.Total != null ? cfn_parse.FromCloudFormation.getNumber(properties.Total) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnApplicationSettings {
    /**
     * Specifies the start and end times that define a time range when messages aren't sent to endpoints.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html
     */
    export interface QuietTimeProperty {
        /**
         * The specific time when quiet time ends. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html#cfn-pinpoint-applicationsettings-quiettime-end
         */
        readonly end: string;
        /**
         * The specific time when quiet time begins. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-applicationsettings-quiettime.html#cfn-pinpoint-applicationsettings-quiettime-start
         */
        readonly start: string;
    }
}

/**
 * Determine whether the given properties match those of a `QuietTimeProperty`
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnApplicationSettings_QuietTimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('end', cdk.requiredValidator)(properties.end));
    errors.collect(cdk.propertyValidator('end', cdk.validateString)(properties.end));
    errors.collect(cdk.propertyValidator('start', cdk.requiredValidator)(properties.start));
    errors.collect(cdk.propertyValidator('start', cdk.validateString)(properties.start));
    return errors.wrap('supplied properties not correct for "QuietTimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.QuietTime` resource
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::ApplicationSettings.QuietTime` resource.
 */
// @ts-ignore TS6133
function cfnApplicationSettingsQuietTimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnApplicationSettings_QuietTimePropertyValidator(properties).assertSuccess();
    return {
        End: cdk.stringToCloudFormation(properties.end),
        Start: cdk.stringToCloudFormation(properties.start),
    };
}

// @ts-ignore TS6133
function CfnApplicationSettingsQuietTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationSettings.QuietTimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationSettings.QuietTimeProperty>();
    ret.addPropertyResult('end', 'End', cfn_parse.FromCloudFormation.getString(properties.End));
    ret.addPropertyResult('start', 'Start', cfn_parse.FromCloudFormation.getString(properties.Start));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBaiduChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html
 */
export interface CfnBaiduChannelProps {

    /**
     * The API key that you received from the Baidu Cloud Push service to communicate with the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-apikey
     */
    readonly apiKey: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that you're configuring the Baidu channel for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The secret key that you received from the Baidu Cloud Push service to communicate with the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-secretkey
     */
    readonly secretKey: string;

    /**
     * Specifies whether to enable the Baidu channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBaiduChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnBaiduChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnBaiduChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiKey', cdk.requiredValidator)(properties.apiKey));
    errors.collect(cdk.propertyValidator('apiKey', cdk.validateString)(properties.apiKey));
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('secretKey', cdk.requiredValidator)(properties.secretKey));
    errors.collect(cdk.propertyValidator('secretKey', cdk.validateString)(properties.secretKey));
    return errors.wrap('supplied properties not correct for "CfnBaiduChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::BaiduChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnBaiduChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::BaiduChannel` resource.
 */
// @ts-ignore TS6133
function cfnBaiduChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBaiduChannelPropsValidator(properties).assertSuccess();
    return {
        ApiKey: cdk.stringToCloudFormation(properties.apiKey),
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        SecretKey: cdk.stringToCloudFormation(properties.secretKey),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBaiduChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBaiduChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBaiduChannelProps>();
    ret.addPropertyResult('apiKey', 'ApiKey', cfn_parse.FromCloudFormation.getString(properties.ApiKey));
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('secretKey', 'SecretKey', cfn_parse.FromCloudFormation.getString(properties.SecretKey));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::BaiduChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the Baidu channel to send notifications to the Baidu Cloud Push notification service. Before you can use Amazon Pinpoint to send notifications to the Baidu Cloud Push service, you have to enable the Baidu channel for an Amazon Pinpoint application.
 *
 * The BaiduChannel resource represents the status and authentication settings of the Baidu channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::BaiduChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html
 */
export class CfnBaiduChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::BaiduChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBaiduChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBaiduChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBaiduChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The API key that you received from the Baidu Cloud Push service to communicate with the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-apikey
     */
    public apiKey: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that you're configuring the Baidu channel for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-applicationid
     */
    public applicationId: string;

    /**
     * The secret key that you received from the Baidu Cloud Push service to communicate with the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-secretkey
     */
    public secretKey: string;

    /**
     * Specifies whether to enable the Baidu channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-baiduchannel.html#cfn-pinpoint-baiduchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pinpoint::BaiduChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBaiduChannelProps) {
        super(scope, id, { type: CfnBaiduChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiKey', this);
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'secretKey', this);

        this.apiKey = props.apiKey;
        this.applicationId = props.applicationId;
        this.secretKey = props.secretKey;
        this.enabled = props.enabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBaiduChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiKey: this.apiKey,
            applicationId: this.applicationId,
            secretKey: this.secretKey,
            enabled: this.enabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBaiduChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html
 */
export interface CfnCampaignProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the campaign is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-applicationid
     */
    readonly applicationId: string;

    /**
     * The name of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-name
     */
    readonly name: string;

    /**
     * The schedule settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-schedule
     */
    readonly schedule: CfnCampaign.ScheduleProperty | cdk.IResolvable;

    /**
     * The unique identifier for the segment to associate with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentid
     */
    readonly segmentId: string;

    /**
     * An array of requests that defines additional treatments for the campaign, in addition to the default treatment for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-additionaltreatments
     */
    readonly additionalTreatments?: Array<CfnCampaign.WriteTreatmentResourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies the Lambda function to use as a code hook for a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-campaignhook
     */
    readonly campaignHook?: CfnCampaign.CampaignHookProperty | cdk.IResolvable;

    /**
     * The delivery configuration settings for sending the treatment through a custom channel. This object is required if the `MessageConfiguration` object for the treatment specifies a `CustomMessage` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-customdeliveryconfiguration
     */
    readonly customDeliveryConfiguration?: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable;

    /**
     * A custom description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-description
     */
    readonly description?: string;

    /**
     * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-holdoutpercent
     */
    readonly holdoutPercent?: number;

    /**
     * Specifies whether to pause the campaign. A paused campaign doesn't run unless you resume it by changing this value to `false` . If you restart a campaign, the campaign restarts from the beginning and not at the point you paused it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-ispaused
     */
    readonly isPaused?: boolean | cdk.IResolvable;

    /**
     * The messaging limits for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-limits
     */
    readonly limits?: CfnCampaign.LimitsProperty | cdk.IResolvable;

    /**
     * The message configuration settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-messageconfiguration
     */
    readonly messageConfiguration?: CfnCampaign.MessageConfigurationProperty | cdk.IResolvable;

    /**
     * An integer between 1 and 5, inclusive, that represents the priority of the in-app message campaign, where 1 is the highest priority and 5 is the lowest. If there are multiple messages scheduled to be displayed at the same time, the priority determines the order in which those messages are displayed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-priority
     */
    readonly priority?: number;

    /**
     * The version of the segment to associate with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentversion
     */
    readonly segmentVersion?: number;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-tags
     */
    readonly tags?: any;

    /**
     * The message template to use for the treatment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-templateconfiguration
     */
    readonly templateConfiguration?: CfnCampaign.TemplateConfigurationProperty | cdk.IResolvable;

    /**
     * A custom description of the default treatment for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentdescription
     */
    readonly treatmentDescription?: string;

    /**
     * A custom name of the default treatment for the campaign, if the campaign has multiple treatments. A *treatment* is a variation of a campaign that's used for A/B testing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentname
     */
    readonly treatmentName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
function CfnCampaignPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('additionalTreatments', cdk.listValidator(CfnCampaign_WriteTreatmentResourcePropertyValidator))(properties.additionalTreatments));
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('campaignHook', CfnCampaign_CampaignHookPropertyValidator)(properties.campaignHook));
    errors.collect(cdk.propertyValidator('customDeliveryConfiguration', CfnCampaign_CustomDeliveryConfigurationPropertyValidator)(properties.customDeliveryConfiguration));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('holdoutPercent', cdk.validateNumber)(properties.holdoutPercent));
    errors.collect(cdk.propertyValidator('isPaused', cdk.validateBoolean)(properties.isPaused));
    errors.collect(cdk.propertyValidator('limits', CfnCampaign_LimitsPropertyValidator)(properties.limits));
    errors.collect(cdk.propertyValidator('messageConfiguration', CfnCampaign_MessageConfigurationPropertyValidator)(properties.messageConfiguration));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('schedule', cdk.requiredValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('schedule', CfnCampaign_SchedulePropertyValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('segmentId', cdk.requiredValidator)(properties.segmentId));
    errors.collect(cdk.propertyValidator('segmentId', cdk.validateString)(properties.segmentId));
    errors.collect(cdk.propertyValidator('segmentVersion', cdk.validateNumber)(properties.segmentVersion));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('templateConfiguration', CfnCampaign_TemplateConfigurationPropertyValidator)(properties.templateConfiguration));
    errors.collect(cdk.propertyValidator('treatmentDescription', cdk.validateString)(properties.treatmentDescription));
    errors.collect(cdk.propertyValidator('treatmentName', cdk.validateString)(properties.treatmentName));
    return errors.wrap('supplied properties not correct for "CfnCampaignProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign` resource
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign` resource.
 */
// @ts-ignore TS6133
function cfnCampaignPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaignPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Name: cdk.stringToCloudFormation(properties.name),
        Schedule: cfnCampaignSchedulePropertyToCloudFormation(properties.schedule),
        SegmentId: cdk.stringToCloudFormation(properties.segmentId),
        AdditionalTreatments: cdk.listMapper(cfnCampaignWriteTreatmentResourcePropertyToCloudFormation)(properties.additionalTreatments),
        CampaignHook: cfnCampaignCampaignHookPropertyToCloudFormation(properties.campaignHook),
        CustomDeliveryConfiguration: cfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties.customDeliveryConfiguration),
        Description: cdk.stringToCloudFormation(properties.description),
        HoldoutPercent: cdk.numberToCloudFormation(properties.holdoutPercent),
        IsPaused: cdk.booleanToCloudFormation(properties.isPaused),
        Limits: cfnCampaignLimitsPropertyToCloudFormation(properties.limits),
        MessageConfiguration: cfnCampaignMessageConfigurationPropertyToCloudFormation(properties.messageConfiguration),
        Priority: cdk.numberToCloudFormation(properties.priority),
        SegmentVersion: cdk.numberToCloudFormation(properties.segmentVersion),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TemplateConfiguration: cfnCampaignTemplateConfigurationPropertyToCloudFormation(properties.templateConfiguration),
        TreatmentDescription: cdk.stringToCloudFormation(properties.treatmentDescription),
        TreatmentName: cdk.stringToCloudFormation(properties.treatmentName),
    };
}

// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaignProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaignProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('schedule', 'Schedule', CfnCampaignSchedulePropertyFromCloudFormation(properties.Schedule));
    ret.addPropertyResult('segmentId', 'SegmentId', cfn_parse.FromCloudFormation.getString(properties.SegmentId));
    ret.addPropertyResult('additionalTreatments', 'AdditionalTreatments', properties.AdditionalTreatments != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignWriteTreatmentResourcePropertyFromCloudFormation)(properties.AdditionalTreatments) : undefined);
    ret.addPropertyResult('campaignHook', 'CampaignHook', properties.CampaignHook != null ? CfnCampaignCampaignHookPropertyFromCloudFormation(properties.CampaignHook) : undefined);
    ret.addPropertyResult('customDeliveryConfiguration', 'CustomDeliveryConfiguration', properties.CustomDeliveryConfiguration != null ? CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties.CustomDeliveryConfiguration) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('holdoutPercent', 'HoldoutPercent', properties.HoldoutPercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.HoldoutPercent) : undefined);
    ret.addPropertyResult('isPaused', 'IsPaused', properties.IsPaused != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPaused) : undefined);
    ret.addPropertyResult('limits', 'Limits', properties.Limits != null ? CfnCampaignLimitsPropertyFromCloudFormation(properties.Limits) : undefined);
    ret.addPropertyResult('messageConfiguration', 'MessageConfiguration', properties.MessageConfiguration != null ? CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties.MessageConfiguration) : undefined);
    ret.addPropertyResult('priority', 'Priority', properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined);
    ret.addPropertyResult('segmentVersion', 'SegmentVersion', properties.SegmentVersion != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentVersion) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateConfiguration', 'TemplateConfiguration', properties.TemplateConfiguration != null ? CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties.TemplateConfiguration) : undefined);
    ret.addPropertyResult('treatmentDescription', 'TreatmentDescription', properties.TreatmentDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentDescription) : undefined);
    ret.addPropertyResult('treatmentName', 'TreatmentName', properties.TreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::Campaign`
 *
 * Specifies the settings for a campaign. A *campaign* is a messaging initiative that engages a specific segment of users for an Amazon Pinpoint application.
 *
 * @cloudformationResource AWS::Pinpoint::Campaign
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::Campaign";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCampaign(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the campaign.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier for the campaign.
     * @cloudformationAttribute CampaignId
     */
    public readonly attrCampaignId: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that the campaign is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-applicationid
     */
    public applicationId: string;

    /**
     * The name of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-name
     */
    public name: string;

    /**
     * The schedule settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-schedule
     */
    public schedule: CfnCampaign.ScheduleProperty | cdk.IResolvable;

    /**
     * The unique identifier for the segment to associate with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentid
     */
    public segmentId: string;

    /**
     * An array of requests that defines additional treatments for the campaign, in addition to the default treatment for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-additionaltreatments
     */
    public additionalTreatments: Array<CfnCampaign.WriteTreatmentResourceProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Specifies the Lambda function to use as a code hook for a campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-campaignhook
     */
    public campaignHook: CfnCampaign.CampaignHookProperty | cdk.IResolvable | undefined;

    /**
     * The delivery configuration settings for sending the treatment through a custom channel. This object is required if the `MessageConfiguration` object for the treatment specifies a `CustomMessage` object.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-customdeliveryconfiguration
     */
    public customDeliveryConfiguration: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A custom description of the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-description
     */
    public description: string | undefined;

    /**
     * The allocated percentage of users (segment members) who shouldn't receive messages from the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-holdoutpercent
     */
    public holdoutPercent: number | undefined;

    /**
     * Specifies whether to pause the campaign. A paused campaign doesn't run unless you resume it by changing this value to `false` . If you restart a campaign, the campaign restarts from the beginning and not at the point you paused it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-ispaused
     */
    public isPaused: boolean | cdk.IResolvable | undefined;

    /**
     * The messaging limits for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-limits
     */
    public limits: CfnCampaign.LimitsProperty | cdk.IResolvable | undefined;

    /**
     * The message configuration settings for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-messageconfiguration
     */
    public messageConfiguration: CfnCampaign.MessageConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * An integer between 1 and 5, inclusive, that represents the priority of the in-app message campaign, where 1 is the highest priority and 5 is the lowest. If there are multiple messages scheduled to be displayed at the same time, the priority determines the order in which those messages are displayed.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-priority
     */
    public priority: number | undefined;

    /**
     * The version of the segment to associate with the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-segmentversion
     */
    public segmentVersion: number | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The message template to use for the treatment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-templateconfiguration
     */
    public templateConfiguration: CfnCampaign.TemplateConfigurationProperty | cdk.IResolvable | undefined;

    /**
     * A custom description of the default treatment for the campaign.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentdescription
     */
    public treatmentDescription: string | undefined;

    /**
     * A custom name of the default treatment for the campaign, if the campaign has multiple treatments. A *treatment* is a variation of a campaign that's used for A/B testing.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-campaign.html#cfn-pinpoint-campaign-treatmentname
     */
    public treatmentName: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::Campaign`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
        super(scope, id, { type: CfnCampaign.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'schedule', this);
        cdk.requireProperty(props, 'segmentId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrCampaignId = cdk.Token.asString(this.getAtt('CampaignId', cdk.ResolutionTypeHint.STRING));

        this.applicationId = props.applicationId;
        this.name = props.name;
        this.schedule = props.schedule;
        this.segmentId = props.segmentId;
        this.additionalTreatments = props.additionalTreatments;
        this.campaignHook = props.campaignHook;
        this.customDeliveryConfiguration = props.customDeliveryConfiguration;
        this.description = props.description;
        this.holdoutPercent = props.holdoutPercent;
        this.isPaused = props.isPaused;
        this.limits = props.limits;
        this.messageConfiguration = props.messageConfiguration;
        this.priority = props.priority;
        this.segmentVersion = props.segmentVersion;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::Campaign", props.tags, { tagPropertyName: 'tags' });
        this.templateConfiguration = props.templateConfiguration;
        this.treatmentDescription = props.treatmentDescription;
        this.treatmentName = props.treatmentName;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            name: this.name,
            schedule: this.schedule,
            segmentId: this.segmentId,
            additionalTreatments: this.additionalTreatments,
            campaignHook: this.campaignHook,
            customDeliveryConfiguration: this.customDeliveryConfiguration,
            description: this.description,
            holdoutPercent: this.holdoutPercent,
            isPaused: this.isPaused,
            limits: this.limits,
            messageConfiguration: this.messageConfiguration,
            priority: this.priority,
            segmentVersion: this.segmentVersion,
            tags: this.tags.renderTags(),
            templateConfiguration: this.templateConfiguration,
            treatmentDescription: this.treatmentDescription,
            treatmentName: this.treatmentName,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCampaignPropsToCloudFormation(props);
    }
}

export namespace CfnCampaign {
    /**
     * Specifies attribute-based criteria for including or excluding endpoints from a segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html
     */
    export interface AttributeDimensionProperty {
        /**
         * The type of segment dimension to use. Valid values are:
         *
         * - `INCLUSIVE` – endpoints that have attributes matching the values are included in the segment.
         * - `EXCLUSIVE` – endpoints that have attributes matching the values are excluded from the segment.
         * - `CONTAINS` – endpoints that have attributes' substrings match the values are included in the segment.
         * - `BEFORE` – endpoints with attributes read as ISO_INSTANT datetimes before the value are included in the segment.
         * - `AFTER` – endpoints with attributes read as ISO_INSTANT datetimes after the value are included in the segment.
         * - `BETWEEN` – endpoints with attributes read as ISO_INSTANT datetimes between the values are included in the segment.
         * - `ON` – endpoints with attributes read as ISO_INSTANT dates on the value are included in the segment. Time is ignored in this comparison.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html#cfn-pinpoint-campaign-attributedimension-attributetype
         */
        readonly attributeType?: string;
        /**
         * The criteria values to use for the segment dimension. Depending on the value of the `AttributeType` property, endpoints are included or excluded from the segment if their attribute values match the criteria values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-attributedimension.html#cfn-pinpoint-campaign-attributedimension-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AttributeDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_AttributeDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeType', cdk.validateString)(properties.attributeType));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "AttributeDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.AttributeDimension` resource
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.AttributeDimension` resource.
 */
// @ts-ignore TS6133
function cfnCampaignAttributeDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_AttributeDimensionPropertyValidator(properties).assertSuccess();
    return {
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnCampaignAttributeDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.AttributeDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.AttributeDimensionProperty>();
    ret.addPropertyResult('attributeType', 'AttributeType', properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the contents of a message that's sent through a custom channel to recipients of a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigncustommessage.html
     */
    export interface CampaignCustomMessageProperty {
        /**
         * The raw, JSON-formatted string to use as the payload for the message. The maximum size is 5 KB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigncustommessage.html#cfn-pinpoint-campaign-campaigncustommessage-data
         */
        readonly data?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignCustomMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignCustomMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignCustomMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('data', cdk.validateString)(properties.data));
    return errors.wrap('supplied properties not correct for "CampaignCustomMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignCustomMessage` resource
 *
 * @param properties - the TypeScript properties of a `CampaignCustomMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignCustomMessage` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignCustomMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignCustomMessagePropertyValidator(properties).assertSuccess();
    return {
        Data: cdk.stringToCloudFormation(properties.data),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignCustomMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignCustomMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignCustomMessageProperty>();
    ret.addPropertyResult('data', 'Data', properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the content and "From" address for an email message that's sent to recipients of a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html
     */
    export interface CampaignEmailMessageProperty {
        /**
         * The body of the email for recipients whose email clients don't render HTML content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-body
         */
        readonly body?: string;
        /**
         * The verified email address to send the email from. The default address is the `FromAddress` specified for the email channel for the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-fromaddress
         */
        readonly fromAddress?: string;
        /**
         * The body of the email, in HTML format, for recipients whose email clients render HTML content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-htmlbody
         */
        readonly htmlBody?: string;
        /**
         * The subject line, or title, of the email.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignemailmessage.html#cfn-pinpoint-campaign-campaignemailmessage-title
         */
        readonly title?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignEmailMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignEmailMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignEmailMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('fromAddress', cdk.validateString)(properties.fromAddress));
    errors.collect(cdk.propertyValidator('htmlBody', cdk.validateString)(properties.htmlBody));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    return errors.wrap('supplied properties not correct for "CampaignEmailMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignEmailMessage` resource
 *
 * @param properties - the TypeScript properties of a `CampaignEmailMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignEmailMessage` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignEmailMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignEmailMessagePropertyValidator(properties).assertSuccess();
    return {
        Body: cdk.stringToCloudFormation(properties.body),
        FromAddress: cdk.stringToCloudFormation(properties.fromAddress),
        HtmlBody: cdk.stringToCloudFormation(properties.htmlBody),
        Title: cdk.stringToCloudFormation(properties.title),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignEmailMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignEmailMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignEmailMessageProperty>();
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('fromAddress', 'FromAddress', properties.FromAddress != null ? cfn_parse.FromCloudFormation.getString(properties.FromAddress) : undefined);
    ret.addPropertyResult('htmlBody', 'HtmlBody', properties.HtmlBody != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlBody) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the settings for events that cause a campaign to be sent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html
     */
    export interface CampaignEventFilterProperty {
        /**
         * The dimension settings of the event filter for the campaign.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html#cfn-pinpoint-campaign-campaigneventfilter-dimensions
         */
        readonly dimensions?: CfnCampaign.EventDimensionsProperty | cdk.IResolvable;
        /**
         * The type of event that causes the campaign to be sent. Valid values are: `SYSTEM` , sends the campaign when a system event occurs; and, `ENDPOINT` , sends the campaign when an endpoint event (Events resource) occurs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigneventfilter.html#cfn-pinpoint-campaign-campaigneventfilter-filtertype
         */
        readonly filterType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignEventFilterProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignEventFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignEventFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', CfnCampaign_EventDimensionsPropertyValidator)(properties.dimensions));
    errors.collect(cdk.propertyValidator('filterType', cdk.validateString)(properties.filterType));
    return errors.wrap('supplied properties not correct for "CampaignEventFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignEventFilter` resource
 *
 * @param properties - the TypeScript properties of a `CampaignEventFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignEventFilter` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignEventFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignEventFilterPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cfnCampaignEventDimensionsPropertyToCloudFormation(properties.dimensions),
        FilterType: cdk.stringToCloudFormation(properties.filterType),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignEventFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignEventFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignEventFilterProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? CfnCampaignEventDimensionsPropertyFromCloudFormation(properties.Dimensions) : undefined);
    ret.addPropertyResult('filterType', 'FilterType', properties.FilterType != null ? cfn_parse.FromCloudFormation.getString(properties.FilterType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies settings for invoking an Lambda function that customizes a segment for a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html
     */
    export interface CampaignHookProperty {
        /**
         * The name or Amazon Resource Name (ARN) of the Lambda function that Amazon Pinpoint invokes to customize a segment for a campaign.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-lambdafunctionname
         */
        readonly lambdaFunctionName?: string;
        /**
         * The mode that Amazon Pinpoint uses to invoke the Lambda function. Possible values are:
         *
         * - `FILTER` - Invoke the function to customize the segment that's used by a campaign.
         * - `DELIVERY` - (Deprecated) Previously, invoked the function to send a campaign through a custom channel. This functionality is not supported anymore. To send a campaign through a custom channel, use the `CustomDeliveryConfiguration` and `CampaignCustomMessage` objects of the campaign.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-mode
         */
        readonly mode?: string;
        /**
         * The web URL that Amazon Pinpoint calls to invoke the Lambda function over HTTPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignhook.html#cfn-pinpoint-campaign-campaignhook-weburl
         */
        readonly webUrl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignHookProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignHookPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaFunctionName', cdk.validateString)(properties.lambdaFunctionName));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('webUrl', cdk.validateString)(properties.webUrl));
    return errors.wrap('supplied properties not correct for "CampaignHookProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignHook` resource
 *
 * @param properties - the TypeScript properties of a `CampaignHookProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignHook` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignHookPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignHookPropertyValidator(properties).assertSuccess();
    return {
        LambdaFunctionName: cdk.stringToCloudFormation(properties.lambdaFunctionName),
        Mode: cdk.stringToCloudFormation(properties.mode),
        WebUrl: cdk.stringToCloudFormation(properties.webUrl),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignHookProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignHookProperty>();
    ret.addPropertyResult('lambdaFunctionName', 'LambdaFunctionName', properties.LambdaFunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaFunctionName) : undefined);
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addPropertyResult('webUrl', 'WebUrl', properties.WebUrl != null ? cfn_parse.FromCloudFormation.getString(properties.WebUrl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the appearance of an in-app message, including the message type, the title and body text, text and background colors, and the configurations of buttons that appear in the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html
     */
    export interface CampaignInAppMessageProperty {
        /**
         * An array that contains configurtion information about the in-app message for the campaign, including title and body text, text colors, background colors, image URLs, and button configurations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-content
         */
        readonly content?: Array<CfnCampaign.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-customconfig
         */
        readonly customConfig?: any | cdk.IResolvable;
        /**
         * A string that describes how the in-app message will appear. You can specify one of the following:
         *
         * - `BOTTOM_BANNER` – a message that appears as a banner at the bottom of the page.
         * - `TOP_BANNER` – a message that appears as a banner at the top of the page.
         * - `OVERLAYS` – a message that covers entire screen.
         * - `MOBILE_FEED` – a message that appears in a window in front of the page.
         * - `MIDDLE_BANNER` – a message that appears as a banner in the middle of the page.
         * - `CAROUSEL` – a scrollable layout of up to five unique messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaigninappmessage.html#cfn-pinpoint-campaign-campaigninappmessage-layout
         */
        readonly layout?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignInAppMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignInAppMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignInAppMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.listValidator(CfnCampaign_InAppMessageContentPropertyValidator))(properties.content));
    errors.collect(cdk.propertyValidator('customConfig', cdk.validateObject)(properties.customConfig));
    errors.collect(cdk.propertyValidator('layout', cdk.validateString)(properties.layout));
    return errors.wrap('supplied properties not correct for "CampaignInAppMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignInAppMessage` resource
 *
 * @param properties - the TypeScript properties of a `CampaignInAppMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignInAppMessage` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignInAppMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignInAppMessagePropertyValidator(properties).assertSuccess();
    return {
        Content: cdk.listMapper(cfnCampaignInAppMessageContentPropertyToCloudFormation)(properties.content),
        CustomConfig: cdk.objectToCloudFormation(properties.customConfig),
        Layout: cdk.stringToCloudFormation(properties.layout),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignInAppMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignInAppMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignInAppMessageProperty>();
    ret.addPropertyResult('content', 'Content', properties.Content != null ? cfn_parse.FromCloudFormation.getArray(CfnCampaignInAppMessageContentPropertyFromCloudFormation)(properties.Content) : undefined);
    ret.addPropertyResult('customConfig', 'CustomConfig', properties.CustomConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomConfig) : undefined);
    ret.addPropertyResult('layout', 'Layout', properties.Layout != null ? cfn_parse.FromCloudFormation.getString(properties.Layout) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the content and settings for an SMS message that's sent to recipients of a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html
     */
    export interface CampaignSmsMessageProperty {
        /**
         * The body of the SMS message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-body
         */
        readonly body?: string;
        /**
         * The entity ID or Principal Entity (PE) id received from the regulatory body for sending SMS in your country.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-entityid
         */
        readonly entityId?: string;
        /**
         * The SMS message type. Valid values are `TRANSACTIONAL` (for messages that are critical or time-sensitive, such as a one-time passwords) and `PROMOTIONAL` (for messsages that aren't critical or time-sensitive, such as marketing messages).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-messagetype
         */
        readonly messageType?: string;
        /**
         * The long code to send the SMS message from. This value should be one of the dedicated long codes that's assigned to your AWS account. Although it isn't required, we recommend that you specify the long code using an E.164 format to ensure prompt and accurate delivery of the message. For example, +12065550100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-originationnumber
         */
        readonly originationNumber?: string;
        /**
         * The alphabetic Sender ID to display as the sender of the message on a recipient's device. Support for sender IDs varies by country or region. To specify a phone number as the sender, omit this parameter and use `OriginationNumber` instead. For more information about support for Sender ID by country, see the [Amazon Pinpoint User Guide](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-senderid
         */
        readonly senderId?: string;
        /**
         * The template ID received from the regulatory body for sending SMS in your country.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-campaignsmsmessage.html#cfn-pinpoint-campaign-campaignsmsmessage-templateid
         */
        readonly templateId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CampaignSmsMessageProperty`
 *
 * @param properties - the TypeScript properties of a `CampaignSmsMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CampaignSmsMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('entityId', cdk.validateString)(properties.entityId));
    errors.collect(cdk.propertyValidator('messageType', cdk.validateString)(properties.messageType));
    errors.collect(cdk.propertyValidator('originationNumber', cdk.validateString)(properties.originationNumber));
    errors.collect(cdk.propertyValidator('senderId', cdk.validateString)(properties.senderId));
    errors.collect(cdk.propertyValidator('templateId', cdk.validateString)(properties.templateId));
    return errors.wrap('supplied properties not correct for "CampaignSmsMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignSmsMessage` resource
 *
 * @param properties - the TypeScript properties of a `CampaignSmsMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CampaignSmsMessage` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCampaignSmsMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CampaignSmsMessagePropertyValidator(properties).assertSuccess();
    return {
        Body: cdk.stringToCloudFormation(properties.body),
        EntityId: cdk.stringToCloudFormation(properties.entityId),
        MessageType: cdk.stringToCloudFormation(properties.messageType),
        OriginationNumber: cdk.stringToCloudFormation(properties.originationNumber),
        SenderId: cdk.stringToCloudFormation(properties.senderId),
        TemplateId: cdk.stringToCloudFormation(properties.templateId),
    };
}

// @ts-ignore TS6133
function CfnCampaignCampaignSmsMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CampaignSmsMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CampaignSmsMessageProperty>();
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('entityId', 'EntityId', properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined);
    ret.addPropertyResult('messageType', 'MessageType', properties.MessageType != null ? cfn_parse.FromCloudFormation.getString(properties.MessageType) : undefined);
    ret.addPropertyResult('originationNumber', 'OriginationNumber', properties.OriginationNumber != null ? cfn_parse.FromCloudFormation.getString(properties.OriginationNumber) : undefined);
    ret.addPropertyResult('senderId', 'SenderId', properties.SenderId != null ? cfn_parse.FromCloudFormation.getString(properties.SenderId) : undefined);
    ret.addPropertyResult('templateId', 'TemplateId', properties.TemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the delivery configuration settings for sending a campaign or campaign treatment through a custom channel. This object is required if you use the `CampaignCustomMessage` object to define the message to send for the campaign or campaign treatment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html
     */
    export interface CustomDeliveryConfigurationProperty {
        /**
         * The destination to send the campaign or treatment to. This value can be one of the following:
         *
         * - The name or Amazon Resource Name (ARN) of an AWS Lambda function to invoke to handle delivery of the campaign or treatment.
         * - The URL for a web application or service that supports HTTPS and can receive the message. The URL has to be a full URL, including the HTTPS protocol.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html#cfn-pinpoint-campaign-customdeliveryconfiguration-deliveryuri
         */
        readonly deliveryUri?: string;
        /**
         * The types of endpoints to send the campaign or treatment to. Each valid value maps to a type of channel that you can associate with an endpoint by using the `ChannelType` property of an endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-customdeliveryconfiguration.html#cfn-pinpoint-campaign-customdeliveryconfiguration-endpointtypes
         */
        readonly endpointTypes?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `CustomDeliveryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomDeliveryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_CustomDeliveryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryUri', cdk.validateString)(properties.deliveryUri));
    errors.collect(cdk.propertyValidator('endpointTypes', cdk.listValidator(cdk.validateString))(properties.endpointTypes));
    return errors.wrap('supplied properties not correct for "CustomDeliveryConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CustomDeliveryConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CustomDeliveryConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.CustomDeliveryConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_CustomDeliveryConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DeliveryUri: cdk.stringToCloudFormation(properties.deliveryUri),
        EndpointTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.endpointTypes),
    };
}

// @ts-ignore TS6133
function CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.CustomDeliveryConfigurationProperty>();
    ret.addPropertyResult('deliveryUri', 'DeliveryUri', properties.DeliveryUri != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryUri) : undefined);
    ret.addPropertyResult('endpointTypes', 'EndpointTypes', properties.EndpointTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.EndpointTypes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the default behavior for a button that appears in an in-app message. You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html
     */
    export interface DefaultButtonConfigurationProperty {
        /**
         * The background color of a button, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * The border radius of a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-borderradius
         */
        readonly borderRadius?: number;
        /**
         * The action that occurs when a recipient chooses a button in an in-app message. You can specify one of the following:
         *
         * - `LINK` – A link to a web destination.
         * - `DEEP_LINK` – A link to a specific page in an application.
         * - `CLOSE` – Dismisses the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-buttonaction
         */
        readonly buttonAction?: string;
        /**
         * The destination (such as a URL) for a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-link
         */
        readonly link?: string;
        /**
         * The text that appears on a button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-text
         */
        readonly text?: string;
        /**
         * The color of the body text in a button, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-defaultbuttonconfiguration.html#cfn-pinpoint-campaign-defaultbuttonconfiguration-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_DefaultButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('borderRadius', cdk.validateNumber)(properties.borderRadius));
    errors.collect(cdk.propertyValidator('buttonAction', cdk.validateString)(properties.buttonAction));
    errors.collect(cdk.propertyValidator('link', cdk.validateString)(properties.link));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "DefaultButtonConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.DefaultButtonConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.DefaultButtonConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCampaignDefaultButtonConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_DefaultButtonConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BorderRadius: cdk.numberToCloudFormation(properties.borderRadius),
        ButtonAction: cdk.stringToCloudFormation(properties.buttonAction),
        Link: cdk.stringToCloudFormation(properties.link),
        Text: cdk.stringToCloudFormation(properties.text),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnCampaignDefaultButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.DefaultButtonConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.DefaultButtonConfigurationProperty>();
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('borderRadius', 'BorderRadius', properties.BorderRadius != null ? cfn_parse.FromCloudFormation.getNumber(properties.BorderRadius) : undefined);
    ret.addPropertyResult('buttonAction', 'ButtonAction', properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined);
    ret.addPropertyResult('link', 'Link', properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined);
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the dimensions for an event filter that determines when a campaign is sent or a journey activity is performed.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html
     */
    export interface EventDimensionsProperty {
        /**
         * One or more custom attributes that your application reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create an event filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-attributes
         */
        readonly attributes?: any | cdk.IResolvable;
        /**
         * The name of the event that causes the campaign to be sent or the journey activity to be performed. This can be a standard event that Amazon Pinpoint generates, such as `_email.delivered` or `_custom.delivered` . For campaigns, this can also be a custom event that's specific to your application. For information about standard events, see [Streaming Amazon Pinpoint Events](https://docs.aws.amazon.com/pinpoint/latest/developerguide/event-streams.html) in the *Amazon Pinpoint Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-eventtype
         */
        readonly eventType?: CfnCampaign.SetDimensionProperty | cdk.IResolvable;
        /**
         * One or more custom metrics that your application reports to Amazon Pinpoint . You can use these metrics as selection criteria when you create an event filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-eventdimensions.html#cfn-pinpoint-campaign-eventdimensions-metrics
         */
        readonly metrics?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventDimensionsProperty`
 *
 * @param properties - the TypeScript properties of a `EventDimensionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_EventDimensionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.validateObject)(properties.attributes));
    errors.collect(cdk.propertyValidator('eventType', CfnCampaign_SetDimensionPropertyValidator)(properties.eventType));
    errors.collect(cdk.propertyValidator('metrics', cdk.validateObject)(properties.metrics));
    return errors.wrap('supplied properties not correct for "EventDimensionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.EventDimensions` resource
 *
 * @param properties - the TypeScript properties of a `EventDimensionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.EventDimensions` resource.
 */
// @ts-ignore TS6133
function cfnCampaignEventDimensionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_EventDimensionsPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.objectToCloudFormation(properties.attributes),
        EventType: cfnCampaignSetDimensionPropertyToCloudFormation(properties.eventType),
        Metrics: cdk.objectToCloudFormation(properties.metrics),
    };
}

// @ts-ignore TS6133
function CfnCampaignEventDimensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.EventDimensionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.EventDimensionsProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined);
    ret.addPropertyResult('eventType', 'EventType', properties.EventType != null ? CfnCampaignSetDimensionPropertyFromCloudFormation(properties.EventType) : undefined);
    ret.addPropertyResult('metrics', 'Metrics', properties.Metrics != null ? cfn_parse.FromCloudFormation.getAny(properties.Metrics) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the configuration of main body text of the in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html
     */
    export interface InAppMessageBodyConfigProperty {
        /**
         * The text alignment of the main body text of the message. Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-alignment
         */
        readonly alignment?: string;
        /**
         * The main body text of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-body
         */
        readonly body?: string;
        /**
         * The color of the body text, expressed as a string consisting of a hex color code (such as "#000000" for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebodyconfig.html#cfn-pinpoint-campaign-inappmessagebodyconfig-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InAppMessageBodyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageBodyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_InAppMessageBodyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "InAppMessageBodyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageBodyConfig` resource
 *
 * @param properties - the TypeScript properties of a `InAppMessageBodyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageBodyConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignInAppMessageBodyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_InAppMessageBodyConfigPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        Body: cdk.stringToCloudFormation(properties.body),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageBodyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageBodyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageBodyConfigProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the configuration of a button that appears in an in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html
     */
    export interface InAppMessageButtonProperty {
        /**
         * An object that defines the default behavior for a button in in-app messages sent to Android.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-android
         */
        readonly android?: CfnCampaign.OverrideButtonConfigurationProperty | cdk.IResolvable;
        /**
         * An object that defines the default behavior for a button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-defaultconfig
         */
        readonly defaultConfig?: CfnCampaign.DefaultButtonConfigurationProperty | cdk.IResolvable;
        /**
         * An object that defines the default behavior for a button in in-app messages sent to iOS devices.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-ios
         */
        readonly ios?: CfnCampaign.OverrideButtonConfigurationProperty | cdk.IResolvable;
        /**
         * An object that defines the default behavior for a button in in-app messages for web applications.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagebutton.html#cfn-pinpoint-campaign-inappmessagebutton-web
         */
        readonly web?: CfnCampaign.OverrideButtonConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InAppMessageButtonProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageButtonProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_InAppMessageButtonPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('android', CfnCampaign_OverrideButtonConfigurationPropertyValidator)(properties.android));
    errors.collect(cdk.propertyValidator('defaultConfig', CfnCampaign_DefaultButtonConfigurationPropertyValidator)(properties.defaultConfig));
    errors.collect(cdk.propertyValidator('ios', CfnCampaign_OverrideButtonConfigurationPropertyValidator)(properties.ios));
    errors.collect(cdk.propertyValidator('web', CfnCampaign_OverrideButtonConfigurationPropertyValidator)(properties.web));
    return errors.wrap('supplied properties not correct for "InAppMessageButtonProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageButton` resource
 *
 * @param properties - the TypeScript properties of a `InAppMessageButtonProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageButton` resource.
 */
// @ts-ignore TS6133
function cfnCampaignInAppMessageButtonPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_InAppMessageButtonPropertyValidator(properties).assertSuccess();
    return {
        Android: cfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.android),
        DefaultConfig: cfnCampaignDefaultButtonConfigurationPropertyToCloudFormation(properties.defaultConfig),
        IOS: cfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.ios),
        Web: cfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties.web),
    };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageButtonProperty>();
    ret.addPropertyResult('android', 'Android', properties.Android != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.Android) : undefined);
    ret.addPropertyResult('defaultConfig', 'DefaultConfig', properties.DefaultConfig != null ? CfnCampaignDefaultButtonConfigurationPropertyFromCloudFormation(properties.DefaultConfig) : undefined);
    ret.addPropertyResult('ios', 'IOS', properties.IOS != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.IOS) : undefined);
    ret.addPropertyResult('web', 'Web', properties.Web != null ? CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties.Web) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the configuration and contents of an in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html
     */
    export interface InAppMessageContentProperty {
        /**
         * The background color for an in-app message banner, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * Specifies the configuration of main body text in an in-app message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-bodyconfig
         */
        readonly bodyConfig?: CfnCampaign.InAppMessageBodyConfigProperty | cdk.IResolvable;
        /**
         * Specifies the configuration and content of the header or title text of the in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-headerconfig
         */
        readonly headerConfig?: CfnCampaign.InAppMessageHeaderConfigProperty | cdk.IResolvable;
        /**
         * The URL of the image that appears on an in-app message banner.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-imageurl
         */
        readonly imageUrl?: string;
        /**
         * An object that contains configuration information about the primary button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-primarybtn
         */
        readonly primaryBtn?: CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable;
        /**
         * An object that contains configuration information about the secondary button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessagecontent.html#cfn-pinpoint-campaign-inappmessagecontent-secondarybtn
         */
        readonly secondaryBtn?: CfnCampaign.InAppMessageButtonProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InAppMessageContentProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_InAppMessageContentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('bodyConfig', CfnCampaign_InAppMessageBodyConfigPropertyValidator)(properties.bodyConfig));
    errors.collect(cdk.propertyValidator('headerConfig', CfnCampaign_InAppMessageHeaderConfigPropertyValidator)(properties.headerConfig));
    errors.collect(cdk.propertyValidator('imageUrl', cdk.validateString)(properties.imageUrl));
    errors.collect(cdk.propertyValidator('primaryBtn', CfnCampaign_InAppMessageButtonPropertyValidator)(properties.primaryBtn));
    errors.collect(cdk.propertyValidator('secondaryBtn', CfnCampaign_InAppMessageButtonPropertyValidator)(properties.secondaryBtn));
    return errors.wrap('supplied properties not correct for "InAppMessageContentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageContent` resource
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageContent` resource.
 */
// @ts-ignore TS6133
function cfnCampaignInAppMessageContentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_InAppMessageContentPropertyValidator(properties).assertSuccess();
    return {
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BodyConfig: cfnCampaignInAppMessageBodyConfigPropertyToCloudFormation(properties.bodyConfig),
        HeaderConfig: cfnCampaignInAppMessageHeaderConfigPropertyToCloudFormation(properties.headerConfig),
        ImageUrl: cdk.stringToCloudFormation(properties.imageUrl),
        PrimaryBtn: cfnCampaignInAppMessageButtonPropertyToCloudFormation(properties.primaryBtn),
        SecondaryBtn: cfnCampaignInAppMessageButtonPropertyToCloudFormation(properties.secondaryBtn),
    };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageContentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageContentProperty>();
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('bodyConfig', 'BodyConfig', properties.BodyConfig != null ? CfnCampaignInAppMessageBodyConfigPropertyFromCloudFormation(properties.BodyConfig) : undefined);
    ret.addPropertyResult('headerConfig', 'HeaderConfig', properties.HeaderConfig != null ? CfnCampaignInAppMessageHeaderConfigPropertyFromCloudFormation(properties.HeaderConfig) : undefined);
    ret.addPropertyResult('imageUrl', 'ImageUrl', properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined);
    ret.addPropertyResult('primaryBtn', 'PrimaryBtn', properties.PrimaryBtn != null ? CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties.PrimaryBtn) : undefined);
    ret.addPropertyResult('secondaryBtn', 'SecondaryBtn', properties.SecondaryBtn != null ? CfnCampaignInAppMessageButtonPropertyFromCloudFormation(properties.SecondaryBtn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the configuration and content of the header or title text of the in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html
     */
    export interface InAppMessageHeaderConfigProperty {
        /**
         * The text alignment of the title of the message. Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-alignment
         */
        readonly alignment?: string;
        /**
         * The header or title text of the in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-header
         */
        readonly header?: string;
        /**
         * The color of the body text, expressed as a string consisting of a hex color code (such as "#000000" for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-inappmessageheaderconfig.html#cfn-pinpoint-campaign-inappmessageheaderconfig-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InAppMessageHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_InAppMessageHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('header', cdk.validateString)(properties.header));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "InAppMessageHeaderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageHeaderConfig` resource
 *
 * @param properties - the TypeScript properties of a `InAppMessageHeaderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.InAppMessageHeaderConfig` resource.
 */
// @ts-ignore TS6133
function cfnCampaignInAppMessageHeaderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_InAppMessageHeaderConfigPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        Header: cdk.stringToCloudFormation(properties.header),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnCampaignInAppMessageHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.InAppMessageHeaderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.InAppMessageHeaderConfigProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('header', 'Header', properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the limits on the messages that a campaign can send.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html
     */
    export interface LimitsProperty {
        /**
         * The maximum number of messages that a campaign can send to a single endpoint during a 24-hour period. The maximum value is 100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-daily
         */
        readonly daily?: number;
        /**
         * The maximum amount of time, in seconds, that a campaign can attempt to deliver a message after the scheduled start time for the campaign. The minimum value is 60 seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-maximumduration
         */
        readonly maximumDuration?: number;
        /**
         * The maximum number of messages that a campaign can send each second. The minimum value is 50. The maximum value is 20,000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-messagespersecond
         */
        readonly messagesPerSecond?: number;
        /**
         * `CfnCampaign.LimitsProperty.Session`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-session
         */
        readonly session?: number;
        /**
         * The maximum number of messages that a campaign can send to a single endpoint during the course of the campaign. The maximum value is 100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-limits.html#cfn-pinpoint-campaign-limits-total
         */
        readonly total?: number;
    }
}

/**
 * Determine whether the given properties match those of a `LimitsProperty`
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_LimitsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('daily', cdk.validateNumber)(properties.daily));
    errors.collect(cdk.propertyValidator('maximumDuration', cdk.validateNumber)(properties.maximumDuration));
    errors.collect(cdk.propertyValidator('messagesPerSecond', cdk.validateNumber)(properties.messagesPerSecond));
    errors.collect(cdk.propertyValidator('session', cdk.validateNumber)(properties.session));
    errors.collect(cdk.propertyValidator('total', cdk.validateNumber)(properties.total));
    return errors.wrap('supplied properties not correct for "LimitsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Limits` resource
 *
 * @param properties - the TypeScript properties of a `LimitsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Limits` resource.
 */
// @ts-ignore TS6133
function cfnCampaignLimitsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_LimitsPropertyValidator(properties).assertSuccess();
    return {
        Daily: cdk.numberToCloudFormation(properties.daily),
        MaximumDuration: cdk.numberToCloudFormation(properties.maximumDuration),
        MessagesPerSecond: cdk.numberToCloudFormation(properties.messagesPerSecond),
        Session: cdk.numberToCloudFormation(properties.session),
        Total: cdk.numberToCloudFormation(properties.total),
    };
}

// @ts-ignore TS6133
function CfnCampaignLimitsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.LimitsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.LimitsProperty>();
    ret.addPropertyResult('daily', 'Daily', properties.Daily != null ? cfn_parse.FromCloudFormation.getNumber(properties.Daily) : undefined);
    ret.addPropertyResult('maximumDuration', 'MaximumDuration', properties.MaximumDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumDuration) : undefined);
    ret.addPropertyResult('messagesPerSecond', 'MessagesPerSecond', properties.MessagesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessagesPerSecond) : undefined);
    ret.addPropertyResult('session', 'Session', properties.Session != null ? cfn_parse.FromCloudFormation.getNumber(properties.Session) : undefined);
    ret.addPropertyResult('total', 'Total', properties.Total != null ? cfn_parse.FromCloudFormation.getNumber(properties.Total) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the content and settings for a push notification that's sent to recipients of a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html
     */
    export interface MessageProperty {
        /**
         * The action to occur if a recipient taps the push notification. Valid values are:
         *
         * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
         * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of iOS and Android.
         * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-action
         */
        readonly action?: string;
        /**
         * The body of the notification message. The maximum number of characters is 200.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-body
         */
        readonly body?: string;
        /**
         * The URL of the image to display as the push notification icon, such as the icon for the app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imageiconurl
         */
        readonly imageIconUrl?: string;
        /**
         * The URL of the image to display as the small, push notification icon, such as a small version of the icon for the app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imagesmalliconurl
         */
        readonly imageSmallIconUrl?: string;
        /**
         * The URL of an image to display in the push notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-imageurl
         */
        readonly imageUrl?: string;
        /**
         * The JSON payload to use for a silent push notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-jsonbody
         */
        readonly jsonBody?: string;
        /**
         * The URL of the image or video to display in the push notification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-mediaurl
         */
        readonly mediaUrl?: string;
        /**
         * The raw, JSON-formatted string to use as the payload for the notification message. If specified, this value overrides all other content for the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-rawcontent
         */
        readonly rawContent?: string;
        /**
         * Specifies whether the notification is a silent push notification, which is a push notification that doesn't display on a recipient's device. Silent push notifications can be used for cases such as updating an app's configuration, displaying messages in an in-app message center, or supporting phone home functionality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-silentpush
         */
        readonly silentPush?: boolean | cdk.IResolvable;
        /**
         * The number of seconds that the push notification service should keep the message, if the service is unable to deliver the notification the first time. This value is converted to an expiration value when it's sent to a push notification service. If this value is `0` , the service treats the notification as if it expires immediately and the service doesn't store or try to deliver the notification again.
         *
         * This value doesn't apply to messages that are sent through the Amazon Device Messaging (ADM) service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-timetolive
         */
        readonly timeToLive?: number;
        /**
         * The title to display above the notification message on a recipient's device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-title
         */
        readonly title?: string;
        /**
         * The URL to open in a recipient's default mobile browser, if a recipient taps the push notification and the value of the `Action` property is `URL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-message.html#cfn-pinpoint-campaign-message-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MessageProperty`
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_MessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('imageIconUrl', cdk.validateString)(properties.imageIconUrl));
    errors.collect(cdk.propertyValidator('imageSmallIconUrl', cdk.validateString)(properties.imageSmallIconUrl));
    errors.collect(cdk.propertyValidator('imageUrl', cdk.validateString)(properties.imageUrl));
    errors.collect(cdk.propertyValidator('jsonBody', cdk.validateString)(properties.jsonBody));
    errors.collect(cdk.propertyValidator('mediaUrl', cdk.validateString)(properties.mediaUrl));
    errors.collect(cdk.propertyValidator('rawContent', cdk.validateString)(properties.rawContent));
    errors.collect(cdk.propertyValidator('silentPush', cdk.validateBoolean)(properties.silentPush));
    errors.collect(cdk.propertyValidator('timeToLive', cdk.validateNumber)(properties.timeToLive));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "MessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Message` resource
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Message` resource.
 */
// @ts-ignore TS6133
function cfnCampaignMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_MessagePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Body: cdk.stringToCloudFormation(properties.body),
        ImageIconUrl: cdk.stringToCloudFormation(properties.imageIconUrl),
        ImageSmallIconUrl: cdk.stringToCloudFormation(properties.imageSmallIconUrl),
        ImageUrl: cdk.stringToCloudFormation(properties.imageUrl),
        JsonBody: cdk.stringToCloudFormation(properties.jsonBody),
        MediaUrl: cdk.stringToCloudFormation(properties.mediaUrl),
        RawContent: cdk.stringToCloudFormation(properties.rawContent),
        SilentPush: cdk.booleanToCloudFormation(properties.silentPush),
        TimeToLive: cdk.numberToCloudFormation(properties.timeToLive),
        Title: cdk.stringToCloudFormation(properties.title),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnCampaignMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.MessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MessageProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('imageIconUrl', 'ImageIconUrl', properties.ImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIconUrl) : undefined);
    ret.addPropertyResult('imageSmallIconUrl', 'ImageSmallIconUrl', properties.ImageSmallIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageSmallIconUrl) : undefined);
    ret.addPropertyResult('imageUrl', 'ImageUrl', properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined);
    ret.addPropertyResult('jsonBody', 'JsonBody', properties.JsonBody != null ? cfn_parse.FromCloudFormation.getString(properties.JsonBody) : undefined);
    ret.addPropertyResult('mediaUrl', 'MediaUrl', properties.MediaUrl != null ? cfn_parse.FromCloudFormation.getString(properties.MediaUrl) : undefined);
    ret.addPropertyResult('rawContent', 'RawContent', properties.RawContent != null ? cfn_parse.FromCloudFormation.getString(properties.RawContent) : undefined);
    ret.addPropertyResult('silentPush', 'SilentPush', properties.SilentPush != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SilentPush) : undefined);
    ret.addPropertyResult('timeToLive', 'TimeToLive', properties.TimeToLive != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeToLive) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the message configuration settings for a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html
     */
    export interface MessageConfigurationProperty {
        /**
         * The message that the campaign sends through the ADM (Amazon Device Messaging) channel. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-admmessage
         */
        readonly admMessage?: CfnCampaign.MessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through the APNs (Apple Push Notification service) channel. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-apnsmessage
         */
        readonly apnsMessage?: CfnCampaign.MessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through the Baidu (Baidu Cloud Push) channel. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-baidumessage
         */
        readonly baiduMessage?: CfnCampaign.MessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through a custom channel, as specified by the delivery configuration ( `CustomDeliveryConfiguration` ) settings for the campaign. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-custommessage
         */
        readonly customMessage?: CfnCampaign.CampaignCustomMessageProperty | cdk.IResolvable;
        /**
         * The default message that the campaign sends through all the channels that are configured for the campaign.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-defaultmessage
         */
        readonly defaultMessage?: CfnCampaign.MessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through the email channel. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-emailmessage
         */
        readonly emailMessage?: CfnCampaign.CampaignEmailMessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through the GCM channel, which enables Amazon Pinpoint to send push notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-gcmmessage
         */
        readonly gcmMessage?: CfnCampaign.MessageProperty | cdk.IResolvable;
        /**
         * The default message for the in-app messaging channel. This message overrides the default message ( `DefaultMessage` ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-inappmessage
         */
        readonly inAppMessage?: CfnCampaign.CampaignInAppMessageProperty | cdk.IResolvable;
        /**
         * The message that the campaign sends through the SMS channel. If specified, this message overrides the default message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-messageconfiguration.html#cfn-pinpoint-campaign-messageconfiguration-smsmessage
         */
        readonly smsMessage?: CfnCampaign.CampaignSmsMessageProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MessageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MessageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_MessageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('admMessage', CfnCampaign_MessagePropertyValidator)(properties.admMessage));
    errors.collect(cdk.propertyValidator('apnsMessage', CfnCampaign_MessagePropertyValidator)(properties.apnsMessage));
    errors.collect(cdk.propertyValidator('baiduMessage', CfnCampaign_MessagePropertyValidator)(properties.baiduMessage));
    errors.collect(cdk.propertyValidator('customMessage', CfnCampaign_CampaignCustomMessagePropertyValidator)(properties.customMessage));
    errors.collect(cdk.propertyValidator('defaultMessage', CfnCampaign_MessagePropertyValidator)(properties.defaultMessage));
    errors.collect(cdk.propertyValidator('emailMessage', CfnCampaign_CampaignEmailMessagePropertyValidator)(properties.emailMessage));
    errors.collect(cdk.propertyValidator('gcmMessage', CfnCampaign_MessagePropertyValidator)(properties.gcmMessage));
    errors.collect(cdk.propertyValidator('inAppMessage', CfnCampaign_CampaignInAppMessagePropertyValidator)(properties.inAppMessage));
    errors.collect(cdk.propertyValidator('smsMessage', CfnCampaign_CampaignSmsMessagePropertyValidator)(properties.smsMessage));
    return errors.wrap('supplied properties not correct for "MessageConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.MessageConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MessageConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.MessageConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCampaignMessageConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_MessageConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ADMMessage: cfnCampaignMessagePropertyToCloudFormation(properties.admMessage),
        APNSMessage: cfnCampaignMessagePropertyToCloudFormation(properties.apnsMessage),
        BaiduMessage: cfnCampaignMessagePropertyToCloudFormation(properties.baiduMessage),
        CustomMessage: cfnCampaignCampaignCustomMessagePropertyToCloudFormation(properties.customMessage),
        DefaultMessage: cfnCampaignMessagePropertyToCloudFormation(properties.defaultMessage),
        EmailMessage: cfnCampaignCampaignEmailMessagePropertyToCloudFormation(properties.emailMessage),
        GCMMessage: cfnCampaignMessagePropertyToCloudFormation(properties.gcmMessage),
        InAppMessage: cfnCampaignCampaignInAppMessagePropertyToCloudFormation(properties.inAppMessage),
        SMSMessage: cfnCampaignCampaignSmsMessagePropertyToCloudFormation(properties.smsMessage),
    };
}

// @ts-ignore TS6133
function CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.MessageConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MessageConfigurationProperty>();
    ret.addPropertyResult('admMessage', 'ADMMessage', properties.ADMMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.ADMMessage) : undefined);
    ret.addPropertyResult('apnsMessage', 'APNSMessage', properties.APNSMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.APNSMessage) : undefined);
    ret.addPropertyResult('baiduMessage', 'BaiduMessage', properties.BaiduMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.BaiduMessage) : undefined);
    ret.addPropertyResult('customMessage', 'CustomMessage', properties.CustomMessage != null ? CfnCampaignCampaignCustomMessagePropertyFromCloudFormation(properties.CustomMessage) : undefined);
    ret.addPropertyResult('defaultMessage', 'DefaultMessage', properties.DefaultMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.DefaultMessage) : undefined);
    ret.addPropertyResult('emailMessage', 'EmailMessage', properties.EmailMessage != null ? CfnCampaignCampaignEmailMessagePropertyFromCloudFormation(properties.EmailMessage) : undefined);
    ret.addPropertyResult('gcmMessage', 'GCMMessage', properties.GCMMessage != null ? CfnCampaignMessagePropertyFromCloudFormation(properties.GCMMessage) : undefined);
    ret.addPropertyResult('inAppMessage', 'InAppMessage', properties.InAppMessage != null ? CfnCampaignCampaignInAppMessagePropertyFromCloudFormation(properties.InAppMessage) : undefined);
    ret.addPropertyResult('smsMessage', 'SMSMessage', properties.SMSMessage != null ? CfnCampaignCampaignSmsMessagePropertyFromCloudFormation(properties.SMSMessage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies metric-based criteria for including or excluding endpoints from a segment. These criteria derive from custom metrics that you define for endpoints.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html
     */
    export interface MetricDimensionProperty {
        /**
         * The operator to use when comparing metric values. Valid values are: `GREATER_THAN` , `LESS_THAN` , `GREATER_THAN_OR_EQUAL` , `LESS_THAN_OR_EQUAL` , and `EQUAL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html#cfn-pinpoint-campaign-metricdimension-comparisonoperator
         */
        readonly comparisonOperator?: string;
        /**
         * The value to compare.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-metricdimension.html#cfn-pinpoint-campaign-metricdimension-value
         */
        readonly value?: number;
    }
}

/**
 * Determine whether the given properties match those of a `MetricDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_MetricDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('comparisonOperator', cdk.validateString)(properties.comparisonOperator));
    errors.collect(cdk.propertyValidator('value', cdk.validateNumber)(properties.value));
    return errors.wrap('supplied properties not correct for "MetricDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.MetricDimension` resource
 *
 * @param properties - the TypeScript properties of a `MetricDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.MetricDimension` resource.
 */
// @ts-ignore TS6133
function cfnCampaignMetricDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_MetricDimensionPropertyValidator(properties).assertSuccess();
    return {
        ComparisonOperator: cdk.stringToCloudFormation(properties.comparisonOperator),
        Value: cdk.numberToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnCampaignMetricDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.MetricDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.MetricDimensionProperty>();
    ret.addPropertyResult('comparisonOperator', 'ComparisonOperator', properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the configuration of a button with settings that are specific to a certain device type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html
     */
    export interface OverrideButtonConfigurationProperty {
        /**
         * The action that occurs when a recipient chooses a button in an in-app message. You can specify one of the following:
         *
         * - `LINK` – A link to a web destination.
         * - `DEEP_LINK` – A link to a specific page in an application.
         * - `CLOSE` – Dismisses the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html#cfn-pinpoint-campaign-overridebuttonconfiguration-buttonaction
         */
        readonly buttonAction?: string;
        /**
         * The destination (such as a URL) for a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-overridebuttonconfiguration.html#cfn-pinpoint-campaign-overridebuttonconfiguration-link
         */
        readonly link?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OverrideButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_OverrideButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('buttonAction', cdk.validateString)(properties.buttonAction));
    errors.collect(cdk.propertyValidator('link', cdk.validateString)(properties.link));
    return errors.wrap('supplied properties not correct for "OverrideButtonConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.OverrideButtonConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.OverrideButtonConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCampaignOverrideButtonConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_OverrideButtonConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ButtonAction: cdk.stringToCloudFormation(properties.buttonAction),
        Link: cdk.stringToCloudFormation(properties.link),
    };
}

// @ts-ignore TS6133
function CfnCampaignOverrideButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.OverrideButtonConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.OverrideButtonConfigurationProperty>();
    ret.addPropertyResult('buttonAction', 'ButtonAction', properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined);
    ret.addPropertyResult('link', 'Link', properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the start and end times that define a time range when messages aren't sent to endpoints.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule-quiettime.html
     */
    export interface QuietTimeProperty {
        /**
         * The specific time when quiet time ends. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule-quiettime.html#cfn-pinpoint-campaign-schedule-quiettime-end
         */
        readonly end: string;
        /**
         * The specific time when quiet time begins. This value has to use 24-hour notation and be in HH:MM format, where HH is the hour (with a leading zero, if applicable) and MM is the minutes. For example, use `02:30` to represent 2:30 AM, or `14:30` to represent 2:30 PM.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule-quiettime.html#cfn-pinpoint-campaign-schedule-quiettime-start
         */
        readonly start: string;
    }
}

/**
 * Determine whether the given properties match those of a `QuietTimeProperty`
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_QuietTimePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('end', cdk.requiredValidator)(properties.end));
    errors.collect(cdk.propertyValidator('end', cdk.validateString)(properties.end));
    errors.collect(cdk.propertyValidator('start', cdk.requiredValidator)(properties.start));
    errors.collect(cdk.propertyValidator('start', cdk.validateString)(properties.start));
    return errors.wrap('supplied properties not correct for "QuietTimeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.QuietTime` resource
 *
 * @param properties - the TypeScript properties of a `QuietTimeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.QuietTime` resource.
 */
// @ts-ignore TS6133
function cfnCampaignQuietTimePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_QuietTimePropertyValidator(properties).assertSuccess();
    return {
        End: cdk.stringToCloudFormation(properties.end),
        Start: cdk.stringToCloudFormation(properties.start),
    };
}

// @ts-ignore TS6133
function CfnCampaignQuietTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.QuietTimeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.QuietTimeProperty>();
    ret.addPropertyResult('end', 'End', cfn_parse.FromCloudFormation.getString(properties.End));
    ret.addPropertyResult('start', 'Start', cfn_parse.FromCloudFormation.getString(properties.Start));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the schedule settings for a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html
     */
    export interface ScheduleProperty {
        /**
         * The scheduled time, in ISO 8601 format, when the campaign ended or will end.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-endtime
         */
        readonly endTime?: string;
        /**
         * The type of event that causes the campaign to be sent, if the value of the `Frequency` property is `EVENT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-eventfilter
         */
        readonly eventFilter?: CfnCampaign.CampaignEventFilterProperty | cdk.IResolvable;
        /**
         * Specifies how often the campaign is sent or whether the campaign is sent in response to a specific event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-frequency
         */
        readonly frequency?: string;
        /**
         * Specifies whether the start and end times for the campaign schedule use each recipient's local time. To base the schedule on each recipient's local time, set this value to `true` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-islocaltime
         */
        readonly isLocalTime?: boolean | cdk.IResolvable;
        /**
         * The default quiet time for the campaign. Quiet time is a specific time range when a campaign doesn't send messages to endpoints, if all the following conditions are met:
         *
         * - The `EndpointDemographic.Timezone` property of the endpoint is set to a valid value.
         * - The current time in the endpoint's time zone is later than or equal to the time specified by the `QuietTime.Start` property for the campaign.
         * - The current time in the endpoint's time zone is earlier than or equal to the time specified by the `QuietTime.End` property for the campaign.
         *
         * If any of the preceding conditions isn't met, the endpoint will receive messages from the campaign, even if quiet time is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-quiettime
         */
        readonly quietTime?: CfnCampaign.QuietTimeProperty | cdk.IResolvable;
        /**
         * The scheduled time when the campaign began or will begin. Valid values are: `IMMEDIATE` , to start the campaign immediately; or, a specific time in ISO 8601 format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-starttime
         */
        readonly startTime?: string;
        /**
         * The starting UTC offset for the campaign schedule, if the value of the `IsLocalTime` property is `true` . Valid values are: `UTC, UTC+01, UTC+02, UTC+03, UTC+03:30, UTC+04, UTC+04:30, UTC+05, UTC+05:30, UTC+05:45, UTC+06, UTC+06:30, UTC+07, UTC+08, UTC+09, UTC+09:30, UTC+10, UTC+10:30, UTC+11, UTC+12, UTC+13, UTC-02, UTC-03, UTC-04, UTC-05, UTC-06, UTC-07, UTC-08, UTC-09, UTC-10,` and `UTC-11` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-schedule.html#cfn-pinpoint-campaign-schedule-timezone
         */
        readonly timeZone?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_SchedulePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endTime', cdk.validateString)(properties.endTime));
    errors.collect(cdk.propertyValidator('eventFilter', CfnCampaign_CampaignEventFilterPropertyValidator)(properties.eventFilter));
    errors.collect(cdk.propertyValidator('frequency', cdk.validateString)(properties.frequency));
    errors.collect(cdk.propertyValidator('isLocalTime', cdk.validateBoolean)(properties.isLocalTime));
    errors.collect(cdk.propertyValidator('quietTime', CfnCampaign_QuietTimePropertyValidator)(properties.quietTime));
    errors.collect(cdk.propertyValidator('startTime', cdk.validateString)(properties.startTime));
    errors.collect(cdk.propertyValidator('timeZone', cdk.validateString)(properties.timeZone));
    return errors.wrap('supplied properties not correct for "ScheduleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Schedule` resource
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Schedule` resource.
 */
// @ts-ignore TS6133
function cfnCampaignSchedulePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_SchedulePropertyValidator(properties).assertSuccess();
    return {
        EndTime: cdk.stringToCloudFormation(properties.endTime),
        EventFilter: cfnCampaignCampaignEventFilterPropertyToCloudFormation(properties.eventFilter),
        Frequency: cdk.stringToCloudFormation(properties.frequency),
        IsLocalTime: cdk.booleanToCloudFormation(properties.isLocalTime),
        QuietTime: cfnCampaignQuietTimePropertyToCloudFormation(properties.quietTime),
        StartTime: cdk.stringToCloudFormation(properties.startTime),
        TimeZone: cdk.stringToCloudFormation(properties.timeZone),
    };
}

// @ts-ignore TS6133
function CfnCampaignSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.ScheduleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ScheduleProperty>();
    ret.addPropertyResult('endTime', 'EndTime', properties.EndTime != null ? cfn_parse.FromCloudFormation.getString(properties.EndTime) : undefined);
    ret.addPropertyResult('eventFilter', 'EventFilter', properties.EventFilter != null ? CfnCampaignCampaignEventFilterPropertyFromCloudFormation(properties.EventFilter) : undefined);
    ret.addPropertyResult('frequency', 'Frequency', properties.Frequency != null ? cfn_parse.FromCloudFormation.getString(properties.Frequency) : undefined);
    ret.addPropertyResult('isLocalTime', 'IsLocalTime', properties.IsLocalTime != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsLocalTime) : undefined);
    ret.addPropertyResult('quietTime', 'QuietTime', properties.QuietTime != null ? CfnCampaignQuietTimePropertyFromCloudFormation(properties.QuietTime) : undefined);
    ret.addPropertyResult('startTime', 'StartTime', properties.StartTime != null ? cfn_parse.FromCloudFormation.getString(properties.StartTime) : undefined);
    ret.addPropertyResult('timeZone', 'TimeZone', properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the dimension type and values for a segment dimension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html
     */
    export interface SetDimensionProperty {
        /**
         * The type of segment dimension to use. Valid values are: `INCLUSIVE` , endpoints that match the criteria are included in the segment; and, `EXCLUSIVE` , endpoints that match the criteria are excluded from the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html#cfn-pinpoint-campaign-setdimension-dimensiontype
         */
        readonly dimensionType?: string;
        /**
         * The criteria values to use for the segment dimension. Depending on the value of the `DimensionType` property, endpoints are included or excluded from the segment if their values match the criteria values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-setdimension.html#cfn-pinpoint-campaign-setdimension-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SetDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_SetDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionType', cdk.validateString)(properties.dimensionType));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "SetDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.SetDimension` resource
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.SetDimension` resource.
 */
// @ts-ignore TS6133
function cfnCampaignSetDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_SetDimensionPropertyValidator(properties).assertSuccess();
    return {
        DimensionType: cdk.stringToCloudFormation(properties.dimensionType),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnCampaignSetDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.SetDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.SetDimensionProperty>();
    ret.addPropertyResult('dimensionType', 'DimensionType', properties.DimensionType != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionType) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the name and version of the message template to use for the message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html
     */
    export interface TemplateProperty {
        /**
         * The name of the message template to use for the message. If specified, this value must match the name of an existing message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html#cfn-pinpoint-campaign-template-name
         */
        readonly name?: string;
        /**
         * The unique identifier for the version of the message template to use for the message. If specified, this value must match the identifier for an existing template version. To retrieve a list of versions and version identifiers for a template, use the Template Versions resource.
         *
         * If you don't specify a value for this property, Amazon Pinpoint uses the *active version* of the template. The *active version* is typically the version of a template that's been most recently reviewed and approved for use, depending on your workflow. It isn't necessarily the latest version of a template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-template.html#cfn-pinpoint-campaign-template-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_TemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "TemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Template` resource
 *
 * @param properties - the TypeScript properties of a `TemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.Template` resource.
 */
// @ts-ignore TS6133
function cfnCampaignTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_TemplatePropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnCampaignTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.TemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TemplateProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the message template to use for the message, for each type of channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html
     */
    export interface TemplateConfigurationProperty {
        /**
         * The email template to use for the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-emailtemplate
         */
        readonly emailTemplate?: CfnCampaign.TemplateProperty | cdk.IResolvable;
        /**
         * The push notification template to use for the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-pushtemplate
         */
        readonly pushTemplate?: CfnCampaign.TemplateProperty | cdk.IResolvable;
        /**
         * The SMS template to use for the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-smstemplate
         */
        readonly smsTemplate?: CfnCampaign.TemplateProperty | cdk.IResolvable;
        /**
         * The voice template to use for the message. This object isn't supported for campaigns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-templateconfiguration.html#cfn-pinpoint-campaign-templateconfiguration-voicetemplate
         */
        readonly voiceTemplate?: CfnCampaign.TemplateProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TemplateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_TemplateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('emailTemplate', CfnCampaign_TemplatePropertyValidator)(properties.emailTemplate));
    errors.collect(cdk.propertyValidator('pushTemplate', CfnCampaign_TemplatePropertyValidator)(properties.pushTemplate));
    errors.collect(cdk.propertyValidator('smsTemplate', CfnCampaign_TemplatePropertyValidator)(properties.smsTemplate));
    errors.collect(cdk.propertyValidator('voiceTemplate', CfnCampaign_TemplatePropertyValidator)(properties.voiceTemplate));
    return errors.wrap('supplied properties not correct for "TemplateConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.TemplateConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `TemplateConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.TemplateConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnCampaignTemplateConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_TemplateConfigurationPropertyValidator(properties).assertSuccess();
    return {
        EmailTemplate: cfnCampaignTemplatePropertyToCloudFormation(properties.emailTemplate),
        PushTemplate: cfnCampaignTemplatePropertyToCloudFormation(properties.pushTemplate),
        SMSTemplate: cfnCampaignTemplatePropertyToCloudFormation(properties.smsTemplate),
        VoiceTemplate: cfnCampaignTemplatePropertyToCloudFormation(properties.voiceTemplate),
    };
}

// @ts-ignore TS6133
function CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.TemplateConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.TemplateConfigurationProperty>();
    ret.addPropertyResult('emailTemplate', 'EmailTemplate', properties.EmailTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.EmailTemplate) : undefined);
    ret.addPropertyResult('pushTemplate', 'PushTemplate', properties.PushTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.PushTemplate) : undefined);
    ret.addPropertyResult('smsTemplate', 'SMSTemplate', properties.SMSTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.SMSTemplate) : undefined);
    ret.addPropertyResult('voiceTemplate', 'VoiceTemplate', properties.VoiceTemplate != null ? CfnCampaignTemplatePropertyFromCloudFormation(properties.VoiceTemplate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCampaign {
    /**
     * Specifies the settings for a campaign treatment. A *treatment* is a variation of a campaign that's used for A/B testing of a campaign.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html
     */
    export interface WriteTreatmentResourceProperty {
        /**
         * The delivery configuration settings for sending the treatment through a custom channel. This object is required if the `MessageConfiguration` object for the treatment specifies a `CustomMessage` object.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-customdeliveryconfiguration
         */
        readonly customDeliveryConfiguration?: CfnCampaign.CustomDeliveryConfigurationProperty | cdk.IResolvable;
        /**
         * The message configuration settings for the treatment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-messageconfiguration
         */
        readonly messageConfiguration?: CfnCampaign.MessageConfigurationProperty | cdk.IResolvable;
        /**
         * The schedule settings for the treatment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-schedule
         */
        readonly schedule?: CfnCampaign.ScheduleProperty | cdk.IResolvable;
        /**
         * The allocated percentage of users (segment members) to send the treatment to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-sizepercent
         */
        readonly sizePercent?: number;
        /**
         * The message template to use for the treatment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-templateconfiguration
         */
        readonly templateConfiguration?: CfnCampaign.TemplateConfigurationProperty | cdk.IResolvable;
        /**
         * A custom description of the treatment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-treatmentdescription
         */
        readonly treatmentDescription?: string;
        /**
         * A custom name for the treatment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-campaign-writetreatmentresource.html#cfn-pinpoint-campaign-writetreatmentresource-treatmentname
         */
        readonly treatmentName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WriteTreatmentResourceProperty`
 *
 * @param properties - the TypeScript properties of a `WriteTreatmentResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnCampaign_WriteTreatmentResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customDeliveryConfiguration', CfnCampaign_CustomDeliveryConfigurationPropertyValidator)(properties.customDeliveryConfiguration));
    errors.collect(cdk.propertyValidator('messageConfiguration', CfnCampaign_MessageConfigurationPropertyValidator)(properties.messageConfiguration));
    errors.collect(cdk.propertyValidator('schedule', CfnCampaign_SchedulePropertyValidator)(properties.schedule));
    errors.collect(cdk.propertyValidator('sizePercent', cdk.validateNumber)(properties.sizePercent));
    errors.collect(cdk.propertyValidator('templateConfiguration', CfnCampaign_TemplateConfigurationPropertyValidator)(properties.templateConfiguration));
    errors.collect(cdk.propertyValidator('treatmentDescription', cdk.validateString)(properties.treatmentDescription));
    errors.collect(cdk.propertyValidator('treatmentName', cdk.validateString)(properties.treatmentName));
    return errors.wrap('supplied properties not correct for "WriteTreatmentResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.WriteTreatmentResource` resource
 *
 * @param properties - the TypeScript properties of a `WriteTreatmentResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Campaign.WriteTreatmentResource` resource.
 */
// @ts-ignore TS6133
function cfnCampaignWriteTreatmentResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCampaign_WriteTreatmentResourcePropertyValidator(properties).assertSuccess();
    return {
        CustomDeliveryConfiguration: cfnCampaignCustomDeliveryConfigurationPropertyToCloudFormation(properties.customDeliveryConfiguration),
        MessageConfiguration: cfnCampaignMessageConfigurationPropertyToCloudFormation(properties.messageConfiguration),
        Schedule: cfnCampaignSchedulePropertyToCloudFormation(properties.schedule),
        SizePercent: cdk.numberToCloudFormation(properties.sizePercent),
        TemplateConfiguration: cfnCampaignTemplateConfigurationPropertyToCloudFormation(properties.templateConfiguration),
        TreatmentDescription: cdk.stringToCloudFormation(properties.treatmentDescription),
        TreatmentName: cdk.stringToCloudFormation(properties.treatmentName),
    };
}

// @ts-ignore TS6133
function CfnCampaignWriteTreatmentResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.WriteTreatmentResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.WriteTreatmentResourceProperty>();
    ret.addPropertyResult('customDeliveryConfiguration', 'CustomDeliveryConfiguration', properties.CustomDeliveryConfiguration != null ? CfnCampaignCustomDeliveryConfigurationPropertyFromCloudFormation(properties.CustomDeliveryConfiguration) : undefined);
    ret.addPropertyResult('messageConfiguration', 'MessageConfiguration', properties.MessageConfiguration != null ? CfnCampaignMessageConfigurationPropertyFromCloudFormation(properties.MessageConfiguration) : undefined);
    ret.addPropertyResult('schedule', 'Schedule', properties.Schedule != null ? CfnCampaignSchedulePropertyFromCloudFormation(properties.Schedule) : undefined);
    ret.addPropertyResult('sizePercent', 'SizePercent', properties.SizePercent != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizePercent) : undefined);
    ret.addPropertyResult('templateConfiguration', 'TemplateConfiguration', properties.TemplateConfiguration != null ? CfnCampaignTemplateConfigurationPropertyFromCloudFormation(properties.TemplateConfiguration) : undefined);
    ret.addPropertyResult('treatmentDescription', 'TreatmentDescription', properties.TreatmentDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentDescription) : undefined);
    ret.addPropertyResult('treatmentName', 'TreatmentName', properties.TreatmentName != null ? cfn_parse.FromCloudFormation.getString(properties.TreatmentName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnEmailChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html
 */
export interface CfnEmailChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that you're specifying the email channel for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * The verified email address that you want to send email from when you send email through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-fromaddress
     */
    readonly fromAddress: string;

    /**
     * The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that you want to use when you send email through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-identity
     */
    readonly identity: string;

    /**
     * The [Amazon SES configuration set](https://docs.aws.amazon.com/ses/latest/APIReference/API_ConfigurationSet.html) that you want to apply to messages that you send through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-configurationset
     */
    readonly configurationSet?: string;

    /**
     * Specifies whether to enable the email channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-rolearn
     */
    readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEmailChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnEmailChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnEmailChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('configurationSet', cdk.validateString)(properties.configurationSet));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('fromAddress', cdk.requiredValidator)(properties.fromAddress));
    errors.collect(cdk.propertyValidator('fromAddress', cdk.validateString)(properties.fromAddress));
    errors.collect(cdk.propertyValidator('identity', cdk.requiredValidator)(properties.identity));
    errors.collect(cdk.propertyValidator('identity', cdk.validateString)(properties.identity));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnEmailChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::EmailChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnEmailChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::EmailChannel` resource.
 */
// @ts-ignore TS6133
function cfnEmailChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEmailChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        FromAddress: cdk.stringToCloudFormation(properties.fromAddress),
        Identity: cdk.stringToCloudFormation(properties.identity),
        ConfigurationSet: cdk.stringToCloudFormation(properties.configurationSet),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnEmailChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('fromAddress', 'FromAddress', cfn_parse.FromCloudFormation.getString(properties.FromAddress));
    ret.addPropertyResult('identity', 'Identity', cfn_parse.FromCloudFormation.getString(properties.Identity));
    ret.addPropertyResult('configurationSet', 'ConfigurationSet', properties.ConfigurationSet != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSet) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::EmailChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the email channel to send email to users. Before you can use Amazon Pinpoint to send email, you must enable the email channel for an Amazon Pinpoint application.
 *
 * The EmailChannel resource represents the status, identity, and other settings of the email channel for an application
 *
 * @cloudformationResource AWS::Pinpoint::EmailChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html
 */
export class CfnEmailChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::EmailChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEmailChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEmailChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEmailChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that you're specifying the email channel for.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-applicationid
     */
    public applicationId: string;

    /**
     * The verified email address that you want to send email from when you send email through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-fromaddress
     */
    public fromAddress: string;

    /**
     * The Amazon Resource Name (ARN) of the identity, verified with Amazon Simple Email Service (Amazon SES), that you want to use when you send email through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-identity
     */
    public identity: string;

    /**
     * The [Amazon SES configuration set](https://docs.aws.amazon.com/ses/latest/APIReference/API_ConfigurationSet.html) that you want to apply to messages that you send through the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-configurationset
     */
    public configurationSet: string | undefined;

    /**
     * Specifies whether to enable the email channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The ARN of the AWS Identity and Access Management (IAM) role that you want Amazon Pinpoint to use when it submits email-related event data for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailchannel.html#cfn-pinpoint-emailchannel-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::EmailChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEmailChannelProps) {
        super(scope, id, { type: CfnEmailChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'fromAddress', this);
        cdk.requireProperty(props, 'identity', this);

        this.applicationId = props.applicationId;
        this.fromAddress = props.fromAddress;
        this.identity = props.identity;
        this.configurationSet = props.configurationSet;
        this.enabled = props.enabled;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEmailChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            fromAddress: this.fromAddress,
            identity: this.identity,
            configurationSet: this.configurationSet,
            enabled: this.enabled,
            roleArn: this.roleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEmailChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnEmailTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html
 */
export interface CfnEmailTemplateProps {

    /**
     * The subject line, or title, to use in email messages that are based on the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-subject
     */
    readonly subject: string;

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatename
     */
    readonly templateName: string;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-defaultsubstitutions
     */
    readonly defaultSubstitutions?: string;

    /**
     * The message body, in HTML format, to use in email messages that are based on the message template. We recommend using HTML format for email clients that render HTML content. You can include links, formatted text, and more in an HTML message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-htmlpart
     */
    readonly htmlPart?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-tags
     */
    readonly tags?: any;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatedescription
     */
    readonly templateDescription?: string;

    /**
     * The message body, in plain text format, to use in email messages that are based on the message template. We recommend using plain text format for email clients that don't render HTML content and clients that are connected to high-latency networks, such as mobile devices.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-textpart
     */
    readonly textPart?: string;
}

/**
 * Determine whether the given properties match those of a `CfnEmailTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnEmailTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnEmailTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultSubstitutions', cdk.validateString)(properties.defaultSubstitutions));
    errors.collect(cdk.propertyValidator('htmlPart', cdk.validateString)(properties.htmlPart));
    errors.collect(cdk.propertyValidator('subject', cdk.requiredValidator)(properties.subject));
    errors.collect(cdk.propertyValidator('subject', cdk.validateString)(properties.subject));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('templateDescription', cdk.validateString)(properties.templateDescription));
    errors.collect(cdk.propertyValidator('templateName', cdk.requiredValidator)(properties.templateName));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    errors.collect(cdk.propertyValidator('textPart', cdk.validateString)(properties.textPart));
    return errors.wrap('supplied properties not correct for "CfnEmailTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::EmailTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnEmailTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::EmailTemplate` resource.
 */
// @ts-ignore TS6133
function cfnEmailTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEmailTemplatePropsValidator(properties).assertSuccess();
    return {
        Subject: cdk.stringToCloudFormation(properties.subject),
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
        DefaultSubstitutions: cdk.stringToCloudFormation(properties.defaultSubstitutions),
        HtmlPart: cdk.stringToCloudFormation(properties.htmlPart),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TemplateDescription: cdk.stringToCloudFormation(properties.templateDescription),
        TextPart: cdk.stringToCloudFormation(properties.textPart),
    };
}

// @ts-ignore TS6133
function CfnEmailTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailTemplateProps>();
    ret.addPropertyResult('subject', 'Subject', cfn_parse.FromCloudFormation.getString(properties.Subject));
    ret.addPropertyResult('templateName', 'TemplateName', cfn_parse.FromCloudFormation.getString(properties.TemplateName));
    ret.addPropertyResult('defaultSubstitutions', 'DefaultSubstitutions', properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined);
    ret.addPropertyResult('htmlPart', 'HtmlPart', properties.HtmlPart != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlPart) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateDescription', 'TemplateDescription', properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined);
    ret.addPropertyResult('textPart', 'TextPart', properties.TextPart != null ? cfn_parse.FromCloudFormation.getString(properties.TextPart) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::EmailTemplate`
 *
 * Creates a message template that you can use in messages that are sent through the email channel. A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::EmailTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html
 */
export class CfnEmailTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::EmailTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEmailTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEmailTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnEmailTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the message template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The subject line, or title, to use in email messages that are based on the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-subject
     */
    public subject: string;

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatename
     */
    public templateName: string;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-defaultsubstitutions
     */
    public defaultSubstitutions: string | undefined;

    /**
     * The message body, in HTML format, to use in email messages that are based on the message template. We recommend using HTML format for email clients that render HTML content. You can include links, formatted text, and more in an HTML message.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-htmlpart
     */
    public htmlPart: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-templatedescription
     */
    public templateDescription: string | undefined;

    /**
     * The message body, in plain text format, to use in email messages that are based on the message template. We recommend using plain text format for email clients that don't render HTML content and clients that are connected to high-latency networks, such as mobile devices.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-emailtemplate.html#cfn-pinpoint-emailtemplate-textpart
     */
    public textPart: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::EmailTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEmailTemplateProps) {
        super(scope, id, { type: CfnEmailTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'subject', this);
        cdk.requireProperty(props, 'templateName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.subject = props.subject;
        this.templateName = props.templateName;
        this.defaultSubstitutions = props.defaultSubstitutions;
        this.htmlPart = props.htmlPart;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::EmailTemplate", props.tags, { tagPropertyName: 'tags' });
        this.templateDescription = props.templateDescription;
        this.textPart = props.textPart;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEmailTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            subject: this.subject,
            templateName: this.templateName,
            defaultSubstitutions: this.defaultSubstitutions,
            htmlPart: this.htmlPart,
            tags: this.tags.renderTags(),
            templateDescription: this.templateDescription,
            textPart: this.textPart,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEmailTemplatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnEventStream`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html
 */
export interface CfnEventStreamProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that you want to export data from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-applicationid
     */
    readonly applicationId: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream that you want to publish event data to.
     *
     * For a Kinesis data stream, the ARN format is: `arn:aws:kinesis: region : account-id :stream/ stream_name`
     *
     * For a Kinesis Data Firehose delivery stream, the ARN format is: `arn:aws:firehose: region : account-id :deliverystream/ stream_name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-destinationstreamarn
     */
    readonly destinationStreamArn: string;

    /**
     * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-rolearn
     */
    readonly roleArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnEventStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventStreamProps`
 *
 * @returns the result of the validation.
 */
function CfnEventStreamPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('destinationStreamArn', cdk.requiredValidator)(properties.destinationStreamArn));
    errors.collect(cdk.propertyValidator('destinationStreamArn', cdk.validateString)(properties.destinationStreamArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    return errors.wrap('supplied properties not correct for "CfnEventStreamProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::EventStream` resource
 *
 * @param properties - the TypeScript properties of a `CfnEventStreamProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::EventStream` resource.
 */
// @ts-ignore TS6133
function cfnEventStreamPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnEventStreamPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        DestinationStreamArn: cdk.stringToCloudFormation(properties.destinationStreamArn),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
    };
}

// @ts-ignore TS6133
function CfnEventStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventStreamProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventStreamProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('destinationStreamArn', 'DestinationStreamArn', cfn_parse.FromCloudFormation.getString(properties.DestinationStreamArn));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::EventStream`
 *
 * Creates a new event stream for an application or updates the settings of an existing event stream for an application.
 *
 * @cloudformationResource AWS::Pinpoint::EventStream
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html
 */
export class CfnEventStream extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::EventStream";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventStream {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnEventStreamPropsFromCloudFormation(resourceProperties);
        const ret = new CfnEventStream(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that you want to export data from.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-applicationid
     */
    public applicationId: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis data stream or Amazon Kinesis Data Firehose delivery stream that you want to publish event data to.
     *
     * For a Kinesis data stream, the ARN format is: `arn:aws:kinesis: region : account-id :stream/ stream_name`
     *
     * For a Kinesis Data Firehose delivery stream, the ARN format is: `arn:aws:firehose: region : account-id :deliverystream/ stream_name`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-destinationstreamarn
     */
    public destinationStreamArn: string;

    /**
     * The AWS Identity and Access Management (IAM) role that authorizes Amazon Pinpoint to publish event data to the stream in your AWS account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-eventstream.html#cfn-pinpoint-eventstream-rolearn
     */
    public roleArn: string;

    /**
     * Create a new `AWS::Pinpoint::EventStream`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEventStreamProps) {
        super(scope, id, { type: CfnEventStream.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'destinationStreamArn', this);
        cdk.requireProperty(props, 'roleArn', this);

        this.applicationId = props.applicationId;
        this.destinationStreamArn = props.destinationStreamArn;
        this.roleArn = props.roleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventStream.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            destinationStreamArn: this.destinationStreamArn,
            roleArn: this.roleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnEventStreamPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnGCMChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html
 */
export interface CfnGCMChannelProps {

    /**
     * The Web API key, also called the *server key* , that you received from Google to communicate with Google services.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-apikey
     */
    readonly apiKey: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that the GCM channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-applicationid
     */
    readonly applicationId: string;

    /**
     * Specifies whether to enable the GCM channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnGCMChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnGCMChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnGCMChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('apiKey', cdk.requiredValidator)(properties.apiKey));
    errors.collect(cdk.propertyValidator('apiKey', cdk.validateString)(properties.apiKey));
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "CfnGCMChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::GCMChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnGCMChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::GCMChannel` resource.
 */
// @ts-ignore TS6133
function cfnGCMChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnGCMChannelPropsValidator(properties).assertSuccess();
    return {
        ApiKey: cdk.stringToCloudFormation(properties.apiKey),
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnGCMChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGCMChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGCMChannelProps>();
    ret.addPropertyResult('apiKey', 'ApiKey', cfn_parse.FromCloudFormation.getString(properties.ApiKey));
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::GCMChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. You can use the GCM channel to send push notification messages to the Firebase Cloud Messaging (FCM) service, which replaced the Google Cloud Messaging (GCM) service. Before you use Amazon Pinpoint to send notifications to FCM, you have to enable the GCM channel for an Amazon Pinpoint application.
 *
 * The GCMChannel resource represents the status and authentication settings of the GCM channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::GCMChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html
 */
export class CfnGCMChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::GCMChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGCMChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnGCMChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnGCMChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Web API key, also called the *server key* , that you received from Google to communicate with Google services.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-apikey
     */
    public apiKey: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that the GCM channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-applicationid
     */
    public applicationId: string;

    /**
     * Specifies whether to enable the GCM channel for the Amazon Pinpoint application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-gcmchannel.html#cfn-pinpoint-gcmchannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pinpoint::GCMChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnGCMChannelProps) {
        super(scope, id, { type: CfnGCMChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'apiKey', this);
        cdk.requireProperty(props, 'applicationId', this);

        this.apiKey = props.apiKey;
        this.applicationId = props.applicationId;
        this.enabled = props.enabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnGCMChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            apiKey: this.apiKey,
            applicationId: this.applicationId,
            enabled: this.enabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnGCMChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnInAppTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html
 */
export interface CfnInAppTemplateProps {

    /**
     * The name of the in-app message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatename
     */
    readonly templateName: string;

    /**
     * An object that contains information about the content of an in-app message, including its title and body text, text colors, background colors, images, buttons, and behaviors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-content
     */
    readonly content?: Array<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-customconfig
     */
    readonly customConfig?: any | cdk.IResolvable;

    /**
     * A string that determines the appearance of the in-app message. You can specify one of the following:
     *
     * - `BOTTOM_BANNER` – a message that appears as a banner at the bottom of the page.
     * - `TOP_BANNER` – a message that appears as a banner at the top of the page.
     * - `OVERLAYS` – a message that covers entire screen.
     * - `MOBILE_FEED` – a message that appears in a window in front of the page.
     * - `MIDDLE_BANNER` – a message that appears as a banner in the middle of the page.
     * - `CAROUSEL` – a scrollable layout of up to five unique messages.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-layout
     */
    readonly layout?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-tags
     */
    readonly tags?: any;

    /**
     * An optional description of the in-app template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatedescription
     */
    readonly templateDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnInAppTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnInAppTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('content', cdk.listValidator(CfnInAppTemplate_InAppMessageContentPropertyValidator))(properties.content));
    errors.collect(cdk.propertyValidator('customConfig', cdk.validateObject)(properties.customConfig));
    errors.collect(cdk.propertyValidator('layout', cdk.validateString)(properties.layout));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('templateDescription', cdk.validateString)(properties.templateDescription));
    errors.collect(cdk.propertyValidator('templateName', cdk.requiredValidator)(properties.templateName));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    return errors.wrap('supplied properties not correct for "CfnInAppTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnInAppTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplatePropsValidator(properties).assertSuccess();
    return {
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
        Content: cdk.listMapper(cfnInAppTemplateInAppMessageContentPropertyToCloudFormation)(properties.content),
        CustomConfig: cdk.objectToCloudFormation(properties.customConfig),
        Layout: cdk.stringToCloudFormation(properties.layout),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TemplateDescription: cdk.stringToCloudFormation(properties.templateDescription),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplateProps>();
    ret.addPropertyResult('templateName', 'TemplateName', cfn_parse.FromCloudFormation.getString(properties.TemplateName));
    ret.addPropertyResult('content', 'Content', properties.Content != null ? cfn_parse.FromCloudFormation.getArray(CfnInAppTemplateInAppMessageContentPropertyFromCloudFormation)(properties.Content) : undefined);
    ret.addPropertyResult('customConfig', 'CustomConfig', properties.CustomConfig != null ? cfn_parse.FromCloudFormation.getAny(properties.CustomConfig) : undefined);
    ret.addPropertyResult('layout', 'Layout', properties.Layout != null ? cfn_parse.FromCloudFormation.getString(properties.Layout) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateDescription', 'TemplateDescription', properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::InAppTemplate`
 *
 * Creates a message template that you can use to send in-app messages. A message template is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::InAppTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html
 */
export class CfnInAppTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::InAppTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInAppTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInAppTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnInAppTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the message template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the in-app message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatename
     */
    public templateName: string;

    /**
     * An object that contains information about the content of an in-app message, including its title and body text, text colors, background colors, images, buttons, and behaviors.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-content
     */
    public content: Array<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Custom data, in the form of key-value pairs, that is included in an in-app messaging payload.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-customconfig
     */
    public customConfig: any | cdk.IResolvable | undefined;

    /**
     * A string that determines the appearance of the in-app message. You can specify one of the following:
     *
     * - `BOTTOM_BANNER` – a message that appears as a banner at the bottom of the page.
     * - `TOP_BANNER` – a message that appears as a banner at the top of the page.
     * - `OVERLAYS` – a message that covers entire screen.
     * - `MOBILE_FEED` – a message that appears in a window in front of the page.
     * - `MIDDLE_BANNER` – a message that appears as a banner in the middle of the page.
     * - `CAROUSEL` – a scrollable layout of up to five unique messages.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-layout
     */
    public layout: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * An optional description of the in-app template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-inapptemplate.html#cfn-pinpoint-inapptemplate-templatedescription
     */
    public templateDescription: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::InAppTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInAppTemplateProps) {
        super(scope, id, { type: CfnInAppTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'templateName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.templateName = props.templateName;
        this.content = props.content;
        this.customConfig = props.customConfig;
        this.layout = props.layout;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::InAppTemplate", props.tags, { tagPropertyName: 'tags' });
        this.templateDescription = props.templateDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInAppTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            templateName: this.templateName,
            content: this.content,
            customConfig: this.customConfig,
            layout: this.layout,
            tags: this.tags.renderTags(),
            templateDescription: this.templateDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInAppTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the configuration of the main body text of the in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html
     */
    export interface BodyConfigProperty {
        /**
         * The text alignment of the main body text of the message. Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-alignment
         */
        readonly alignment?: string;
        /**
         * The main body text of the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-body
         */
        readonly body?: string;
        /**
         * The color of the body text, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-bodyconfig.html#cfn-pinpoint-inapptemplate-bodyconfig-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BodyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BodyConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_BodyConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "BodyConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.BodyConfig` resource
 *
 * @param properties - the TypeScript properties of a `BodyConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.BodyConfig` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateBodyConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_BodyConfigPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        Body: cdk.stringToCloudFormation(properties.body),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateBodyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.BodyConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.BodyConfigProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the behavior of buttons that appear in an in-app message template.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html
     */
    export interface ButtonConfigProperty {
        /**
         * Optional button configuration to use for in-app messages sent to Android devices. This button configuration overrides the default button configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-android
         */
        readonly android?: CfnInAppTemplate.OverrideButtonConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies the default behavior of a button that appears in an in-app message. You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-defaultconfig
         */
        readonly defaultConfig?: CfnInAppTemplate.DefaultButtonConfigurationProperty | cdk.IResolvable;
        /**
         * Optional button configuration to use for in-app messages sent to iOS devices. This button configuration overrides the default button configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-ios
         */
        readonly ios?: CfnInAppTemplate.OverrideButtonConfigurationProperty | cdk.IResolvable;
        /**
         * Optional button configuration to use for in-app messages sent to web applications. This button configuration overrides the default button configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-buttonconfig.html#cfn-pinpoint-inapptemplate-buttonconfig-web
         */
        readonly web?: CfnInAppTemplate.OverrideButtonConfigurationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ButtonConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ButtonConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_ButtonConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('android', CfnInAppTemplate_OverrideButtonConfigurationPropertyValidator)(properties.android));
    errors.collect(cdk.propertyValidator('defaultConfig', CfnInAppTemplate_DefaultButtonConfigurationPropertyValidator)(properties.defaultConfig));
    errors.collect(cdk.propertyValidator('ios', CfnInAppTemplate_OverrideButtonConfigurationPropertyValidator)(properties.ios));
    errors.collect(cdk.propertyValidator('web', CfnInAppTemplate_OverrideButtonConfigurationPropertyValidator)(properties.web));
    return errors.wrap('supplied properties not correct for "ButtonConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.ButtonConfig` resource
 *
 * @param properties - the TypeScript properties of a `ButtonConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.ButtonConfig` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateButtonConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_ButtonConfigPropertyValidator(properties).assertSuccess();
    return {
        Android: cfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.android),
        DefaultConfig: cfnInAppTemplateDefaultButtonConfigurationPropertyToCloudFormation(properties.defaultConfig),
        IOS: cfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.ios),
        Web: cfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties.web),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.ButtonConfigProperty>();
    ret.addPropertyResult('android', 'Android', properties.Android != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.Android) : undefined);
    ret.addPropertyResult('defaultConfig', 'DefaultConfig', properties.DefaultConfig != null ? CfnInAppTemplateDefaultButtonConfigurationPropertyFromCloudFormation(properties.DefaultConfig) : undefined);
    ret.addPropertyResult('ios', 'IOS', properties.IOS != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.IOS) : undefined);
    ret.addPropertyResult('web', 'Web', properties.Web != null ? CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties.Web) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the default behavior of a button that appears in an in-app message. You can optionally add button configurations that specifically apply to iOS, Android, or web browser users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html
     */
    export interface DefaultButtonConfigurationProperty {
        /**
         * The background color of a button, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * The border radius of a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-borderradius
         */
        readonly borderRadius?: number;
        /**
         * The action that occurs when a recipient chooses a button in an in-app message. You can specify one of the following:
         *
         * - `LINK` – A link to a web destination.
         * - `DEEP_LINK` – A link to a specific page in an application.
         * - `CLOSE` – Dismisses the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-buttonaction
         */
        readonly buttonAction?: string;
        /**
         * The destination (such as a URL) for a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-link
         */
        readonly link?: string;
        /**
         * The text that appears on a button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-text
         */
        readonly text?: string;
        /**
         * The color of the body text in a button, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-defaultbuttonconfiguration.html#cfn-pinpoint-inapptemplate-defaultbuttonconfiguration-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_DefaultButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('borderRadius', cdk.validateNumber)(properties.borderRadius));
    errors.collect(cdk.propertyValidator('buttonAction', cdk.validateString)(properties.buttonAction));
    errors.collect(cdk.propertyValidator('link', cdk.validateString)(properties.link));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "DefaultButtonConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.DefaultButtonConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DefaultButtonConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.DefaultButtonConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateDefaultButtonConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_DefaultButtonConfigurationPropertyValidator(properties).assertSuccess();
    return {
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BorderRadius: cdk.numberToCloudFormation(properties.borderRadius),
        ButtonAction: cdk.stringToCloudFormation(properties.buttonAction),
        Link: cdk.stringToCloudFormation(properties.link),
        Text: cdk.stringToCloudFormation(properties.text),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateDefaultButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.DefaultButtonConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.DefaultButtonConfigurationProperty>();
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('borderRadius', 'BorderRadius', properties.BorderRadius != null ? cfn_parse.FromCloudFormation.getNumber(properties.BorderRadius) : undefined);
    ret.addPropertyResult('buttonAction', 'ButtonAction', properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined);
    ret.addPropertyResult('link', 'Link', properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined);
    ret.addPropertyResult('text', 'Text', properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the configuration and content of the header or title text of the in-app message.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html
     */
    export interface HeaderConfigProperty {
        /**
         * The text alignment of the title of the message. Acceptable values: `LEFT` , `CENTER` , `RIGHT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-alignment
         */
        readonly alignment?: string;
        /**
         * The title text of the in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-header
         */
        readonly header?: string;
        /**
         * The color of the title text, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-headerconfig.html#cfn-pinpoint-inapptemplate-headerconfig-textcolor
         */
        readonly textColor?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_HeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('header', cdk.validateString)(properties.header));
    errors.collect(cdk.propertyValidator('textColor', cdk.validateString)(properties.textColor));
    return errors.wrap('supplied properties not correct for "HeaderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.HeaderConfig` resource
 *
 * @param properties - the TypeScript properties of a `HeaderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.HeaderConfig` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateHeaderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_HeaderConfigPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        Header: cdk.stringToCloudFormation(properties.header),
        TextColor: cdk.stringToCloudFormation(properties.textColor),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.HeaderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.HeaderConfigProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('header', 'Header', properties.Header != null ? cfn_parse.FromCloudFormation.getString(properties.Header) : undefined);
    ret.addPropertyResult('textColor', 'TextColor', properties.TextColor != null ? cfn_parse.FromCloudFormation.getString(properties.TextColor) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the configuration of an in-app message, including its header, body, buttons, colors, and images.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html
     */
    export interface InAppMessageContentProperty {
        /**
         * The background color for an in-app message banner, expressed as a hex color code (such as #000000 for black).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * An object that contains configuration information about the header or title text of the in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-bodyconfig
         */
        readonly bodyConfig?: CfnInAppTemplate.BodyConfigProperty | cdk.IResolvable;
        /**
         * An object that contains configuration information about the header or title text of the in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-headerconfig
         */
        readonly headerConfig?: CfnInAppTemplate.HeaderConfigProperty | cdk.IResolvable;
        /**
         * The URL of the image that appears on an in-app message banner.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-imageurl
         */
        readonly imageUrl?: string;
        /**
         * An object that contains configuration information about the primary button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-primarybtn
         */
        readonly primaryBtn?: CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable;
        /**
         * An object that contains configuration information about the secondary button in an in-app message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-inappmessagecontent.html#cfn-pinpoint-inapptemplate-inappmessagecontent-secondarybtn
         */
        readonly secondaryBtn?: CfnInAppTemplate.ButtonConfigProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InAppMessageContentProperty`
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_InAppMessageContentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('bodyConfig', CfnInAppTemplate_BodyConfigPropertyValidator)(properties.bodyConfig));
    errors.collect(cdk.propertyValidator('headerConfig', CfnInAppTemplate_HeaderConfigPropertyValidator)(properties.headerConfig));
    errors.collect(cdk.propertyValidator('imageUrl', cdk.validateString)(properties.imageUrl));
    errors.collect(cdk.propertyValidator('primaryBtn', CfnInAppTemplate_ButtonConfigPropertyValidator)(properties.primaryBtn));
    errors.collect(cdk.propertyValidator('secondaryBtn', CfnInAppTemplate_ButtonConfigPropertyValidator)(properties.secondaryBtn));
    return errors.wrap('supplied properties not correct for "InAppMessageContentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.InAppMessageContent` resource
 *
 * @param properties - the TypeScript properties of a `InAppMessageContentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.InAppMessageContent` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateInAppMessageContentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_InAppMessageContentPropertyValidator(properties).assertSuccess();
    return {
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BodyConfig: cfnInAppTemplateBodyConfigPropertyToCloudFormation(properties.bodyConfig),
        HeaderConfig: cfnInAppTemplateHeaderConfigPropertyToCloudFormation(properties.headerConfig),
        ImageUrl: cdk.stringToCloudFormation(properties.imageUrl),
        PrimaryBtn: cfnInAppTemplateButtonConfigPropertyToCloudFormation(properties.primaryBtn),
        SecondaryBtn: cfnInAppTemplateButtonConfigPropertyToCloudFormation(properties.secondaryBtn),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateInAppMessageContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.InAppMessageContentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.InAppMessageContentProperty>();
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('bodyConfig', 'BodyConfig', properties.BodyConfig != null ? CfnInAppTemplateBodyConfigPropertyFromCloudFormation(properties.BodyConfig) : undefined);
    ret.addPropertyResult('headerConfig', 'HeaderConfig', properties.HeaderConfig != null ? CfnInAppTemplateHeaderConfigPropertyFromCloudFormation(properties.HeaderConfig) : undefined);
    ret.addPropertyResult('imageUrl', 'ImageUrl', properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined);
    ret.addPropertyResult('primaryBtn', 'PrimaryBtn', properties.PrimaryBtn != null ? CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties.PrimaryBtn) : undefined);
    ret.addPropertyResult('secondaryBtn', 'SecondaryBtn', properties.SecondaryBtn != null ? CfnInAppTemplateButtonConfigPropertyFromCloudFormation(properties.SecondaryBtn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInAppTemplate {
    /**
     * Specifies the configuration of a button with settings that are specific to a certain device type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html
     */
    export interface OverrideButtonConfigurationProperty {
        /**
         * The action that occurs when a recipient chooses a button in an in-app message. You can specify one of the following:
         *
         * - `LINK` – A link to a web destination.
         * - `DEEP_LINK` – A link to a specific page in an application.
         * - `CLOSE` – Dismisses the message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html#cfn-pinpoint-inapptemplate-overridebuttonconfiguration-buttonaction
         */
        readonly buttonAction?: string;
        /**
         * The destination (such as a URL) for a button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-inapptemplate-overridebuttonconfiguration.html#cfn-pinpoint-inapptemplate-overridebuttonconfiguration-link
         */
        readonly link?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OverrideButtonConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnInAppTemplate_OverrideButtonConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('buttonAction', cdk.validateString)(properties.buttonAction));
    errors.collect(cdk.propertyValidator('link', cdk.validateString)(properties.link));
    return errors.wrap('supplied properties not correct for "OverrideButtonConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.OverrideButtonConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `OverrideButtonConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::InAppTemplate.OverrideButtonConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnInAppTemplateOverrideButtonConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInAppTemplate_OverrideButtonConfigurationPropertyValidator(properties).assertSuccess();
    return {
        ButtonAction: cdk.stringToCloudFormation(properties.buttonAction),
        Link: cdk.stringToCloudFormation(properties.link),
    };
}

// @ts-ignore TS6133
function CfnInAppTemplateOverrideButtonConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInAppTemplate.OverrideButtonConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInAppTemplate.OverrideButtonConfigurationProperty>();
    ret.addPropertyResult('buttonAction', 'ButtonAction', properties.ButtonAction != null ? cfn_parse.FromCloudFormation.getString(properties.ButtonAction) : undefined);
    ret.addPropertyResult('link', 'Link', properties.Link != null ? cfn_parse.FromCloudFormation.getString(properties.Link) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnPushTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html
 */
export interface CfnPushTemplateProps {

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatename
     */
    readonly templateName: string;

    /**
     * The message template to use for the ADM (Amazon Device Messaging) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-adm
     */
    readonly adm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

    /**
     * The message template to use for the APNs (Apple Push Notification service) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-apns
     */
    readonly apns?: CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable;

    /**
     * The message template to use for the Baidu (Baidu Cloud Push) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-baidu
     */
    readonly baidu?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

    /**
     * The default message template to use for push notification channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-default
     */
    readonly default?: CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-defaultsubstitutions
     */
    readonly defaultSubstitutions?: string;

    /**
     * The message template to use for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-gcm
     */
    readonly gcm?: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-tags
     */
    readonly tags?: any;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatedescription
     */
    readonly templateDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPushTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnPushTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnPushTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adm', CfnPushTemplate_AndroidPushNotificationTemplatePropertyValidator)(properties.adm));
    errors.collect(cdk.propertyValidator('apns', CfnPushTemplate_APNSPushNotificationTemplatePropertyValidator)(properties.apns));
    errors.collect(cdk.propertyValidator('baidu', CfnPushTemplate_AndroidPushNotificationTemplatePropertyValidator)(properties.baidu));
    errors.collect(cdk.propertyValidator('default', CfnPushTemplate_DefaultPushNotificationTemplatePropertyValidator)(properties.default));
    errors.collect(cdk.propertyValidator('defaultSubstitutions', cdk.validateString)(properties.defaultSubstitutions));
    errors.collect(cdk.propertyValidator('gcm', CfnPushTemplate_AndroidPushNotificationTemplatePropertyValidator)(properties.gcm));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('templateDescription', cdk.validateString)(properties.templateDescription));
    errors.collect(cdk.propertyValidator('templateName', cdk.requiredValidator)(properties.templateName));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    return errors.wrap('supplied properties not correct for "CfnPushTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnPushTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate` resource.
 */
// @ts-ignore TS6133
function cfnPushTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPushTemplatePropsValidator(properties).assertSuccess();
    return {
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
        ADM: cfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.adm),
        APNS: cfnPushTemplateAPNSPushNotificationTemplatePropertyToCloudFormation(properties.apns),
        Baidu: cfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.baidu),
        Default: cfnPushTemplateDefaultPushNotificationTemplatePropertyToCloudFormation(properties.default),
        DefaultSubstitutions: cdk.stringToCloudFormation(properties.defaultSubstitutions),
        GCM: cfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties.gcm),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TemplateDescription: cdk.stringToCloudFormation(properties.templateDescription),
    };
}

// @ts-ignore TS6133
function CfnPushTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplateProps>();
    ret.addPropertyResult('templateName', 'TemplateName', cfn_parse.FromCloudFormation.getString(properties.TemplateName));
    ret.addPropertyResult('adm', 'ADM', properties.ADM != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.ADM) : undefined);
    ret.addPropertyResult('apns', 'APNS', properties.APNS != null ? CfnPushTemplateAPNSPushNotificationTemplatePropertyFromCloudFormation(properties.APNS) : undefined);
    ret.addPropertyResult('baidu', 'Baidu', properties.Baidu != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.Baidu) : undefined);
    ret.addPropertyResult('default', 'Default', properties.Default != null ? CfnPushTemplateDefaultPushNotificationTemplatePropertyFromCloudFormation(properties.Default) : undefined);
    ret.addPropertyResult('defaultSubstitutions', 'DefaultSubstitutions', properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined);
    ret.addPropertyResult('gcm', 'GCM', properties.GCM != null ? CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties.GCM) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateDescription', 'TemplateDescription', properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::PushTemplate`
 *
 * Creates a message template that you can use in messages that are sent through a push notification channel. A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::PushTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html
 */
export class CfnPushTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::PushTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPushTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnPushTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnPushTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the message template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatename
     */
    public templateName: string;

    /**
     * The message template to use for the ADM (Amazon Device Messaging) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-adm
     */
    public adm: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable | undefined;

    /**
     * The message template to use for the APNs (Apple Push Notification service) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-apns
     */
    public apns: CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable | undefined;

    /**
     * The message template to use for the Baidu (Baidu Cloud Push) channel. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-baidu
     */
    public baidu: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable | undefined;

    /**
     * The default message template to use for push notification channels.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-default
     */
    public default: CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable | undefined;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-defaultsubstitutions
     */
    public defaultSubstitutions: string | undefined;

    /**
     * The message template to use for the GCM channel, which is used to send notifications through the Firebase Cloud Messaging (FCM), formerly Google Cloud Messaging (GCM), service. This message template overrides the default template for push notification channels ( `Default` ).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-gcm
     */
    public gcm: CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-pushtemplate.html#cfn-pinpoint-pushtemplate-templatedescription
     */
    public templateDescription: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::PushTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPushTemplateProps) {
        super(scope, id, { type: CfnPushTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'templateName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.templateName = props.templateName;
        this.adm = props.adm;
        this.apns = props.apns;
        this.baidu = props.baidu;
        this.default = props.default;
        this.defaultSubstitutions = props.defaultSubstitutions;
        this.gcm = props.gcm;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::PushTemplate", props.tags, { tagPropertyName: 'tags' });
        this.templateDescription = props.templateDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnPushTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            templateName: this.templateName,
            adm: this.adm,
            apns: this.apns,
            baidu: this.baidu,
            default: this.default,
            defaultSubstitutions: this.defaultSubstitutions,
            gcm: this.gcm,
            tags: this.tags.renderTags(),
            templateDescription: this.templateDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnPushTemplatePropsToCloudFormation(props);
    }
}

export namespace CfnPushTemplate {
    /**
     * Specifies channel-specific content and settings for a message template that can be used in push notifications that are sent through the APNs (Apple Push Notification service) channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html
     */
    export interface APNSPushNotificationTemplateProperty {
        /**
         * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are:
         *
         * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
         * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS platform.
         * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-action
         */
        readonly action?: string;
        /**
         * The message body to use in push notifications that are based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-body
         */
        readonly body?: string;
        /**
         * The URL of an image or video to display in push notifications that are based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-mediaurl
         */
        readonly mediaUrl?: string;
        /**
         * The key for the sound to play when the recipient receives a push notification that's based on the message template. The value for this key is the name of a sound file in your app's main bundle or the `Library/Sounds` folder in your app's data container. If the sound file can't be found or you specify `default` for the value, the system plays the default alert sound.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-sound
         */
        readonly sound?: string;
        /**
         * The title to use in push notifications that are based on the message template. This title appears above the notification message on a recipient's device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-title
         */
        readonly title?: string;
        /**
         * The URL to open in the recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-apnspushnotificationtemplate.html#cfn-pinpoint-pushtemplate-apnspushnotificationtemplate-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `APNSPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `APNSPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnPushTemplate_APNSPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('mediaUrl', cdk.validateString)(properties.mediaUrl));
    errors.collect(cdk.propertyValidator('sound', cdk.validateString)(properties.sound));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "APNSPushNotificationTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.APNSPushNotificationTemplate` resource
 *
 * @param properties - the TypeScript properties of a `APNSPushNotificationTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.APNSPushNotificationTemplate` resource.
 */
// @ts-ignore TS6133
function cfnPushTemplateAPNSPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPushTemplate_APNSPushNotificationTemplatePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Body: cdk.stringToCloudFormation(properties.body),
        MediaUrl: cdk.stringToCloudFormation(properties.mediaUrl),
        Sound: cdk.stringToCloudFormation(properties.sound),
        Title: cdk.stringToCloudFormation(properties.title),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnPushTemplateAPNSPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.APNSPushNotificationTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.APNSPushNotificationTemplateProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('mediaUrl', 'MediaUrl', properties.MediaUrl != null ? cfn_parse.FromCloudFormation.getString(properties.MediaUrl) : undefined);
    ret.addPropertyResult('sound', 'Sound', properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPushTemplate {
    /**
     * Specifies channel-specific content and settings for a message template that can be used in push notifications that are sent through the ADM (Amazon Device Messaging), Baidu (Baidu Cloud Push), or GCM (Firebase Cloud Messaging, formerly Google Cloud Messaging) channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html
     */
    export interface AndroidPushNotificationTemplateProperty {
        /**
         * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are:
         *
         * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
         * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This action uses the deep-linking features of the Android platform.
         * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-action
         */
        readonly action?: string;
        /**
         * The message body to use in a push notification that's based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-body
         */
        readonly body?: string;
        /**
         * The URL of the large icon image to display in the content view of a push notification that's based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-imageiconurl
         */
        readonly imageIconUrl?: string;
        /**
         * The URL of an image to display in a push notification that's based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-imageurl
         */
        readonly imageUrl?: string;
        /**
         * The URL of the small icon image to display in the status bar and the content view of a push notification that's based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-smallimageiconurl
         */
        readonly smallImageIconUrl?: string;
        /**
         * The sound to play when a recipient receives a push notification that's based on the message template. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in `/res/raw/` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-sound
         */
        readonly sound?: string;
        /**
         * The title to use in a push notification that's based on the message template. This title appears above the notification message on a recipient's device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-title
         */
        readonly title?: string;
        /**
         * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-androidpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-androidpushnotificationtemplate-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AndroidPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `AndroidPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnPushTemplate_AndroidPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('imageIconUrl', cdk.validateString)(properties.imageIconUrl));
    errors.collect(cdk.propertyValidator('imageUrl', cdk.validateString)(properties.imageUrl));
    errors.collect(cdk.propertyValidator('smallImageIconUrl', cdk.validateString)(properties.smallImageIconUrl));
    errors.collect(cdk.propertyValidator('sound', cdk.validateString)(properties.sound));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "AndroidPushNotificationTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.AndroidPushNotificationTemplate` resource
 *
 * @param properties - the TypeScript properties of a `AndroidPushNotificationTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.AndroidPushNotificationTemplate` resource.
 */
// @ts-ignore TS6133
function cfnPushTemplateAndroidPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPushTemplate_AndroidPushNotificationTemplatePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Body: cdk.stringToCloudFormation(properties.body),
        ImageIconUrl: cdk.stringToCloudFormation(properties.imageIconUrl),
        ImageUrl: cdk.stringToCloudFormation(properties.imageUrl),
        SmallImageIconUrl: cdk.stringToCloudFormation(properties.smallImageIconUrl),
        Sound: cdk.stringToCloudFormation(properties.sound),
        Title: cdk.stringToCloudFormation(properties.title),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnPushTemplateAndroidPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.AndroidPushNotificationTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.AndroidPushNotificationTemplateProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('imageIconUrl', 'ImageIconUrl', properties.ImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIconUrl) : undefined);
    ret.addPropertyResult('imageUrl', 'ImageUrl', properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined);
    ret.addPropertyResult('smallImageIconUrl', 'SmallImageIconUrl', properties.SmallImageIconUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SmallImageIconUrl) : undefined);
    ret.addPropertyResult('sound', 'Sound', properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnPushTemplate {
    /**
     * Specifies the default settings and content for a message template that can be used in messages that are sent through a push notification channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html
     */
    export interface DefaultPushNotificationTemplateProperty {
        /**
         * The action to occur if a recipient taps a push notification that's based on the message template. Valid values are:
         *
         * - `OPEN_APP` – Your app opens or it becomes the foreground app if it was sent to the background. This is the default action.
         * - `DEEP_LINK` – Your app opens and displays a designated user interface in the app. This setting uses the deep-linking features of the iOS and Android platforms.
         * - `URL` – The default mobile browser on the recipient's device opens and loads the web page at a URL that you specify.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-action
         */
        readonly action?: string;
        /**
         * The message body to use in push notifications that are based on the message template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-body
         */
        readonly body?: string;
        /**
         * The sound to play when a recipient receives a push notification that's based on the message template. You can use the default stream or specify the file name of a sound resource that's bundled in your app. On an Android platform, the sound file must reside in `/res/raw/` .
         *
         * For an iOS platform, this value is the key for the name of a sound file in your app's main bundle or the `Library/Sounds` folder in your app's data container. If the sound file can't be found or you specify `default` for the value, the system plays the default alert sound.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-sound
         */
        readonly sound?: string;
        /**
         * The title to use in push notifications that are based on the message template. This title appears above the notification message on a recipient's device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-title
         */
        readonly title?: string;
        /**
         * The URL to open in a recipient's default mobile browser, if a recipient taps a push notification that's based on the message template and the value of the `Action` property is `URL` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-pushtemplate-defaultpushnotificationtemplate.html#cfn-pinpoint-pushtemplate-defaultpushnotificationtemplate-url
         */
        readonly url?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DefaultPushNotificationTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultPushNotificationTemplateProperty`
 *
 * @returns the result of the validation.
 */
function CfnPushTemplate_DefaultPushNotificationTemplatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('action', cdk.validateString)(properties.action));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('sound', cdk.validateString)(properties.sound));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    return errors.wrap('supplied properties not correct for "DefaultPushNotificationTemplateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.DefaultPushNotificationTemplate` resource
 *
 * @param properties - the TypeScript properties of a `DefaultPushNotificationTemplateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::PushTemplate.DefaultPushNotificationTemplate` resource.
 */
// @ts-ignore TS6133
function cfnPushTemplateDefaultPushNotificationTemplatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnPushTemplate_DefaultPushNotificationTemplatePropertyValidator(properties).assertSuccess();
    return {
        Action: cdk.stringToCloudFormation(properties.action),
        Body: cdk.stringToCloudFormation(properties.body),
        Sound: cdk.stringToCloudFormation(properties.sound),
        Title: cdk.stringToCloudFormation(properties.title),
        Url: cdk.stringToCloudFormation(properties.url),
    };
}

// @ts-ignore TS6133
function CfnPushTemplateDefaultPushNotificationTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPushTemplate.DefaultPushNotificationTemplateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPushTemplate.DefaultPushNotificationTemplateProperty>();
    ret.addPropertyResult('action', 'Action', properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined);
    ret.addPropertyResult('body', 'Body', properties.Body != null ? cfn_parse.FromCloudFormation.getString(properties.Body) : undefined);
    ret.addPropertyResult('sound', 'Sound', properties.Sound != null ? cfn_parse.FromCloudFormation.getString(properties.Sound) : undefined);
    ret.addPropertyResult('title', 'Title', properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSMSChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html
 */
export interface CfnSMSChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the SMS channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-applicationid
     */
    readonly applicationId: string;

    /**
     * Specifies whether to enable the SMS channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The identity that you want to display on recipients' devices when they receive messages from the SMS channel.
     *
     * > SenderIDs are only supported in certain countries and regions. For more information, see [Supported Countries and Regions](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) in the *Amazon Pinpoint User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-senderid
     */
    readonly senderId?: string;

    /**
     * The registered short code that you want to use when you send messages through the SMS channel.
     *
     * > For information about obtaining a dedicated short code for sending SMS messages, see [Requesting Dedicated Short Codes for SMS Messaging with Amazon Pinpoint](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-awssupport-short-code.html) in the *Amazon Pinpoint User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-shortcode
     */
    readonly shortCode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSMSChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnSMSChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnSMSChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('senderId', cdk.validateString)(properties.senderId));
    errors.collect(cdk.propertyValidator('shortCode', cdk.validateString)(properties.shortCode));
    return errors.wrap('supplied properties not correct for "CfnSMSChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::SMSChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnSMSChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::SMSChannel` resource.
 */
// @ts-ignore TS6133
function cfnSMSChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSMSChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        SenderId: cdk.stringToCloudFormation(properties.senderId),
        ShortCode: cdk.stringToCloudFormation(properties.shortCode),
    };
}

// @ts-ignore TS6133
function CfnSMSChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSMSChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSMSChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('senderId', 'SenderId', properties.SenderId != null ? cfn_parse.FromCloudFormation.getString(properties.SenderId) : undefined);
    ret.addPropertyResult('shortCode', 'ShortCode', properties.ShortCode != null ? cfn_parse.FromCloudFormation.getString(properties.ShortCode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::SMSChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. To send an SMS text message, you send the message through the SMS channel. Before you can use Amazon Pinpoint to send text messages, you have to enable the SMS channel for an Amazon Pinpoint application.
 *
 * The SMSChannel resource represents the status, sender ID, and other settings for the SMS channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::SMSChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html
 */
export class CfnSMSChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::SMSChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSMSChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSMSChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSMSChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the SMS channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-applicationid
     */
    public applicationId: string;

    /**
     * Specifies whether to enable the SMS channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * The identity that you want to display on recipients' devices when they receive messages from the SMS channel.
     *
     * > SenderIDs are only supported in certain countries and regions. For more information, see [Supported Countries and Regions](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) in the *Amazon Pinpoint User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-senderid
     */
    public senderId: string | undefined;

    /**
     * The registered short code that you want to use when you send messages through the SMS channel.
     *
     * > For information about obtaining a dedicated short code for sending SMS messages, see [Requesting Dedicated Short Codes for SMS Messaging with Amazon Pinpoint](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-awssupport-short-code.html) in the *Amazon Pinpoint User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smschannel.html#cfn-pinpoint-smschannel-shortcode
     */
    public shortCode: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::SMSChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSMSChannelProps) {
        super(scope, id, { type: CfnSMSChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.enabled = props.enabled;
        this.senderId = props.senderId;
        this.shortCode = props.shortCode;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSMSChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            enabled: this.enabled,
            senderId: this.senderId,
            shortCode: this.shortCode,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSMSChannelPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnSegment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html
 */
export interface CfnSegmentProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the segment is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-applicationid
     */
    readonly applicationId: string;

    /**
     * The name of the segment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-name
     */
    readonly name: string;

    /**
     * The criteria that define the dimensions for the segment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-dimensions
     */
    readonly dimensions?: CfnSegment.SegmentDimensionsProperty | cdk.IResolvable;

    /**
     * The segment group to use and the dimensions to apply to the group's base segments in order to build the segment. A segment group can consist of zero or more base segments. Your request can include only one segment group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-segmentgroups
     */
    readonly segmentGroups?: CfnSegment.SegmentGroupsProperty | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-tags
     */
    readonly tags?: any;
}

/**
 * Determine whether the given properties match those of a `CfnSegmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnSegmentProps`
 *
 * @returns the result of the validation.
 */
function CfnSegmentPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('dimensions', CfnSegment_SegmentDimensionsPropertyValidator)(properties.dimensions));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('segmentGroups', CfnSegment_SegmentGroupsPropertyValidator)(properties.segmentGroups));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnSegmentProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment` resource
 *
 * @param properties - the TypeScript properties of a `CfnSegmentProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment` resource.
 */
// @ts-ignore TS6133
function cfnSegmentPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegmentPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Name: cdk.stringToCloudFormation(properties.name),
        Dimensions: cfnSegmentSegmentDimensionsPropertyToCloudFormation(properties.dimensions),
        SegmentGroups: cfnSegmentSegmentGroupsPropertyToCloudFormation(properties.segmentGroups),
        Tags: cdk.objectToCloudFormation(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnSegmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegmentProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegmentProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? CfnSegmentSegmentDimensionsPropertyFromCloudFormation(properties.Dimensions) : undefined);
    ret.addPropertyResult('segmentGroups', 'SegmentGroups', properties.SegmentGroups != null ? CfnSegmentSegmentGroupsPropertyFromCloudFormation(properties.SegmentGroups) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::Segment`
 *
 * Updates the configuration, dimension, and other settings for an existing segment.
 *
 * @cloudformationResource AWS::Pinpoint::Segment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html
 */
export class CfnSegment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::Segment";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSegment {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSegmentPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSegment(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the segment.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier for the segment.
     * @cloudformationAttribute SegmentId
     */
    public readonly attrSegmentId: string;

    /**
     * The unique identifier for the Amazon Pinpoint application that the segment is associated with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-applicationid
     */
    public applicationId: string;

    /**
     * The name of the segment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-name
     */
    public name: string;

    /**
     * The criteria that define the dimensions for the segment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-dimensions
     */
    public dimensions: CfnSegment.SegmentDimensionsProperty | cdk.IResolvable | undefined;

    /**
     * The segment group to use and the dimensions to apply to the group's base segments in order to build the segment. A segment group can consist of zero or more base segments. Your request can include only one segment group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-segmentgroups
     */
    public segmentGroups: CfnSegment.SegmentGroupsProperty | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-segment.html#cfn-pinpoint-segment-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Pinpoint::Segment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSegmentProps) {
        super(scope, id, { type: CfnSegment.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);
        cdk.requireProperty(props, 'name', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrSegmentId = cdk.Token.asString(this.getAtt('SegmentId', cdk.ResolutionTypeHint.STRING));

        this.applicationId = props.applicationId;
        this.name = props.name;
        this.dimensions = props.dimensions;
        this.segmentGroups = props.segmentGroups;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::Segment", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSegment.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            name: this.name,
            dimensions: this.dimensions,
            segmentGroups: this.segmentGroups,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSegmentPropsToCloudFormation(props);
    }
}

export namespace CfnSegment {
    /**
     * Specifies attribute-based criteria for including or excluding endpoints from a segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html
     */
    export interface AttributeDimensionProperty {
        /**
         * The type of segment dimension to use. Valid values are:
         *
         * - `INCLUSIVE` – endpoints that have attributes matching the values are included in the segment.
         * - `EXCLUSIVE` – endpoints that have attributes matching the values are excluded from the segment.
         * - `CONTAINS` – endpoints that have attributes' substrings match the values are included in the segment.
         * - `BEFORE` – endpoints with attributes read as ISO_INSTANT datetimes before the value are included in the segment.
         * - `AFTER` – endpoints with attributes read as ISO_INSTANT datetimes after the value are included in the segment.
         * - `BETWEEN` – endpoints with attributes read as ISO_INSTANT datetimes between the values are included in the segment.
         * - `ON` – endpoints with attributes read as ISO_INSTANT dates on the value are included in the segment. Time is ignored in this comparison.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html#cfn-pinpoint-segment-attributedimension-attributetype
         */
        readonly attributeType?: string;
        /**
         * The criteria values to use for the segment dimension. Depending on the value of the `AttributeType` property, endpoints are included or excluded from the segment if their attribute values match the criteria values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-attributedimension.html#cfn-pinpoint-segment-attributedimension-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `AttributeDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_AttributeDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributeType', cdk.validateString)(properties.attributeType));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "AttributeDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.AttributeDimension` resource
 *
 * @param properties - the TypeScript properties of a `AttributeDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.AttributeDimension` resource.
 */
// @ts-ignore TS6133
function cfnSegmentAttributeDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_AttributeDimensionPropertyValidator(properties).assertSuccess();
    return {
        AttributeType: cdk.stringToCloudFormation(properties.attributeType),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnSegmentAttributeDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.AttributeDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.AttributeDimensionProperty>();
    ret.addPropertyResult('attributeType', 'AttributeType', properties.AttributeType != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeType) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies behavior-based criteria for the segment, such as how recently users have used your app.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-behavior.html
     */
    export interface BehaviorProperty {
        /**
         * Specifies how recently segment members were active.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-behavior.html#cfn-pinpoint-segment-segmentdimensions-behavior-recency
         */
        readonly recency?: CfnSegment.RecencyProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `BehaviorProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_BehaviorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('recency', CfnSegment_RecencyPropertyValidator)(properties.recency));
    return errors.wrap('supplied properties not correct for "BehaviorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Behavior` resource
 *
 * @param properties - the TypeScript properties of a `BehaviorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Behavior` resource.
 */
// @ts-ignore TS6133
function cfnSegmentBehaviorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_BehaviorPropertyValidator(properties).assertSuccess();
    return {
        Recency: cfnSegmentRecencyPropertyToCloudFormation(properties.recency),
    };
}

// @ts-ignore TS6133
function CfnSegmentBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.BehaviorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.BehaviorProperty>();
    ret.addPropertyResult('recency', 'Recency', properties.Recency != null ? CfnSegmentRecencyPropertyFromCloudFormation(properties.Recency) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the GPS coordinates of a location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates.html
     */
    export interface CoordinatesProperty {
        /**
         * The latitude coordinate of the location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates.html#cfn-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates-latitude
         */
        readonly latitude: number;
        /**
         * The longitude coordinate of the location.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates.html#cfn-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates-longitude
         */
        readonly longitude: number;
    }
}

/**
 * Determine whether the given properties match those of a `CoordinatesProperty`
 *
 * @param properties - the TypeScript properties of a `CoordinatesProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_CoordinatesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('latitude', cdk.requiredValidator)(properties.latitude));
    errors.collect(cdk.propertyValidator('latitude', cdk.validateNumber)(properties.latitude));
    errors.collect(cdk.propertyValidator('longitude', cdk.requiredValidator)(properties.longitude));
    errors.collect(cdk.propertyValidator('longitude', cdk.validateNumber)(properties.longitude));
    return errors.wrap('supplied properties not correct for "CoordinatesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Coordinates` resource
 *
 * @param properties - the TypeScript properties of a `CoordinatesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Coordinates` resource.
 */
// @ts-ignore TS6133
function cfnSegmentCoordinatesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_CoordinatesPropertyValidator(properties).assertSuccess();
    return {
        Latitude: cdk.numberToCloudFormation(properties.latitude),
        Longitude: cdk.numberToCloudFormation(properties.longitude),
    };
}

// @ts-ignore TS6133
function CfnSegmentCoordinatesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.CoordinatesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.CoordinatesProperty>();
    ret.addPropertyResult('latitude', 'Latitude', cfn_parse.FromCloudFormation.getNumber(properties.Latitude));
    ret.addPropertyResult('longitude', 'Longitude', cfn_parse.FromCloudFormation.getNumber(properties.Longitude));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies demographic-based criteria, such as device platform, for the segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html
     */
    export interface DemographicProperty {
        /**
         * The app version criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-appversion
         */
        readonly appVersion?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The channel criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-channel
         */
        readonly channel?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The device type criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-devicetype
         */
        readonly deviceType?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The device make criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-make
         */
        readonly make?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The device model criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-model
         */
        readonly model?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The device platform criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-demographic.html#cfn-pinpoint-segment-segmentdimensions-demographic-platform
         */
        readonly platform?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DemographicProperty`
 *
 * @param properties - the TypeScript properties of a `DemographicProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_DemographicPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('appVersion', CfnSegment_SetDimensionPropertyValidator)(properties.appVersion));
    errors.collect(cdk.propertyValidator('channel', CfnSegment_SetDimensionPropertyValidator)(properties.channel));
    errors.collect(cdk.propertyValidator('deviceType', CfnSegment_SetDimensionPropertyValidator)(properties.deviceType));
    errors.collect(cdk.propertyValidator('make', CfnSegment_SetDimensionPropertyValidator)(properties.make));
    errors.collect(cdk.propertyValidator('model', CfnSegment_SetDimensionPropertyValidator)(properties.model));
    errors.collect(cdk.propertyValidator('platform', CfnSegment_SetDimensionPropertyValidator)(properties.platform));
    return errors.wrap('supplied properties not correct for "DemographicProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Demographic` resource
 *
 * @param properties - the TypeScript properties of a `DemographicProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Demographic` resource.
 */
// @ts-ignore TS6133
function cfnSegmentDemographicPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_DemographicPropertyValidator(properties).assertSuccess();
    return {
        AppVersion: cfnSegmentSetDimensionPropertyToCloudFormation(properties.appVersion),
        Channel: cfnSegmentSetDimensionPropertyToCloudFormation(properties.channel),
        DeviceType: cfnSegmentSetDimensionPropertyToCloudFormation(properties.deviceType),
        Make: cfnSegmentSetDimensionPropertyToCloudFormation(properties.make),
        Model: cfnSegmentSetDimensionPropertyToCloudFormation(properties.model),
        Platform: cfnSegmentSetDimensionPropertyToCloudFormation(properties.platform),
    };
}

// @ts-ignore TS6133
function CfnSegmentDemographicPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.DemographicProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.DemographicProperty>();
    ret.addPropertyResult('appVersion', 'AppVersion', properties.AppVersion != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.AppVersion) : undefined);
    ret.addPropertyResult('channel', 'Channel', properties.Channel != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Channel) : undefined);
    ret.addPropertyResult('deviceType', 'DeviceType', properties.DeviceType != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.DeviceType) : undefined);
    ret.addPropertyResult('make', 'Make', properties.Make != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Make) : undefined);
    ret.addPropertyResult('model', 'Model', properties.Model != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Model) : undefined);
    ret.addPropertyResult('platform', 'Platform', properties.Platform != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Platform) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the GPS coordinates of the endpoint location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint.html
     */
    export interface GPSPointProperty {
        /**
         * The GPS coordinates to measure distance from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint.html#cfn-pinpoint-segment-segmentdimensions-location-gpspoint-coordinates
         */
        readonly coordinates: CfnSegment.CoordinatesProperty | cdk.IResolvable;
        /**
         * The range, in kilometers, from the GPS coordinates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location-gpspoint.html#cfn-pinpoint-segment-segmentdimensions-location-gpspoint-rangeinkilometers
         */
        readonly rangeInKilometers: number;
    }
}

/**
 * Determine whether the given properties match those of a `GPSPointProperty`
 *
 * @param properties - the TypeScript properties of a `GPSPointProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_GPSPointPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('coordinates', cdk.requiredValidator)(properties.coordinates));
    errors.collect(cdk.propertyValidator('coordinates', CfnSegment_CoordinatesPropertyValidator)(properties.coordinates));
    errors.collect(cdk.propertyValidator('rangeInKilometers', cdk.requiredValidator)(properties.rangeInKilometers));
    errors.collect(cdk.propertyValidator('rangeInKilometers', cdk.validateNumber)(properties.rangeInKilometers));
    return errors.wrap('supplied properties not correct for "GPSPointProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.GPSPoint` resource
 *
 * @param properties - the TypeScript properties of a `GPSPointProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.GPSPoint` resource.
 */
// @ts-ignore TS6133
function cfnSegmentGPSPointPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_GPSPointPropertyValidator(properties).assertSuccess();
    return {
        Coordinates: cfnSegmentCoordinatesPropertyToCloudFormation(properties.coordinates),
        RangeInKilometers: cdk.numberToCloudFormation(properties.rangeInKilometers),
    };
}

// @ts-ignore TS6133
function CfnSegmentGPSPointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.GPSPointProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.GPSPointProperty>();
    ret.addPropertyResult('coordinates', 'Coordinates', CfnSegmentCoordinatesPropertyFromCloudFormation(properties.Coordinates));
    ret.addPropertyResult('rangeInKilometers', 'RangeInKilometers', cfn_parse.FromCloudFormation.getNumber(properties.RangeInKilometers));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * An array that defines the set of segment criteria to evaluate when handling segment groups for the segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups.html
     */
    export interface GroupsProperty {
        /**
         * An array that defines the dimensions to include or exclude from the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups.html#cfn-pinpoint-segment-segmentgroups-groups-dimensions
         */
        readonly dimensions?: Array<CfnSegment.SegmentDimensionsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The base segment to build the segment on. A base segment, also called a *source segment* , defines the initial population of endpoints for a segment. When you add dimensions to the segment, Amazon Pinpoint filters the base segment by using the dimensions that you specify.
         *
         * You can specify more than one dimensional segment or only one imported segment. If you specify an imported segment, the segment size estimate that displays on the Amazon Pinpoint console indicates the size of the imported segment without any filters applied to it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups.html#cfn-pinpoint-segment-segmentgroups-groups-sourcesegments
         */
        readonly sourceSegments?: Array<CfnSegment.SourceSegmentsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies how to handle multiple base segments for the segment. For example, if you specify three base segments for the segment, whether the resulting segment is based on all, any, or none of the base segments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups.html#cfn-pinpoint-segment-segmentgroups-groups-sourcetype
         */
        readonly sourceType?: string;
        /**
         * Specifies how to handle multiple dimensions for the segment. For example, if you specify three dimensions for the segment, whether the resulting segment includes endpoints that match all, any, or none of the dimensions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups.html#cfn-pinpoint-segment-segmentgroups-groups-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GroupsProperty`
 *
 * @param properties - the TypeScript properties of a `GroupsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_GroupsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensions', cdk.listValidator(CfnSegment_SegmentDimensionsPropertyValidator))(properties.dimensions));
    errors.collect(cdk.propertyValidator('sourceSegments', cdk.listValidator(CfnSegment_SourceSegmentsPropertyValidator))(properties.sourceSegments));
    errors.collect(cdk.propertyValidator('sourceType', cdk.validateString)(properties.sourceType));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "GroupsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Groups` resource
 *
 * @param properties - the TypeScript properties of a `GroupsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Groups` resource.
 */
// @ts-ignore TS6133
function cfnSegmentGroupsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_GroupsPropertyValidator(properties).assertSuccess();
    return {
        Dimensions: cdk.listMapper(cfnSegmentSegmentDimensionsPropertyToCloudFormation)(properties.dimensions),
        SourceSegments: cdk.listMapper(cfnSegmentSourceSegmentsPropertyToCloudFormation)(properties.sourceSegments),
        SourceType: cdk.stringToCloudFormation(properties.sourceType),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnSegmentGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.GroupsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.GroupsProperty>();
    ret.addPropertyResult('dimensions', 'Dimensions', properties.Dimensions != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentSegmentDimensionsPropertyFromCloudFormation)(properties.Dimensions) : undefined);
    ret.addPropertyResult('sourceSegments', 'SourceSegments', properties.SourceSegments != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentSourceSegmentsPropertyFromCloudFormation)(properties.SourceSegments) : undefined);
    ret.addPropertyResult('sourceType', 'SourceType', properties.SourceType != null ? cfn_parse.FromCloudFormation.getString(properties.SourceType) : undefined);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies location-based criteria, such as region or GPS coordinates, for the segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location.html
     */
    export interface LocationProperty {
        /**
         * The country or region code, in ISO 3166-1 alpha-2 format, for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location.html#cfn-pinpoint-segment-segmentdimensions-location-country
         */
        readonly country?: CfnSegment.SetDimensionProperty | cdk.IResolvable;
        /**
         * The GPS point dimension for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-location.html#cfn-pinpoint-segment-segmentdimensions-location-gpspoint
         */
        readonly gpsPoint?: CfnSegment.GPSPointProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('country', CfnSegment_SetDimensionPropertyValidator)(properties.country));
    errors.collect(cdk.propertyValidator('gpsPoint', CfnSegment_GPSPointPropertyValidator)(properties.gpsPoint));
    return errors.wrap('supplied properties not correct for "LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Location` resource
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Location` resource.
 */
// @ts-ignore TS6133
function cfnSegmentLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_LocationPropertyValidator(properties).assertSuccess();
    return {
        Country: cfnSegmentSetDimensionPropertyToCloudFormation(properties.country),
        GPSPoint: cfnSegmentGPSPointPropertyToCloudFormation(properties.gpsPoint),
    };
}

// @ts-ignore TS6133
function CfnSegmentLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.LocationProperty>();
    ret.addPropertyResult('country', 'Country', properties.Country != null ? CfnSegmentSetDimensionPropertyFromCloudFormation(properties.Country) : undefined);
    ret.addPropertyResult('gpsPoint', 'GPSPoint', properties.GPSPoint != null ? CfnSegmentGPSPointPropertyFromCloudFormation(properties.GPSPoint) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies how recently segment members were active.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-behavior-recency.html
     */
    export interface RecencyProperty {
        /**
         * The duration to use when determining which users have been active or inactive with your app.
         *
         * Possible values: `HR_24` | `DAY_7` | `DAY_14` | `DAY_30` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-behavior-recency.html#cfn-pinpoint-segment-segmentdimensions-behavior-recency-duration
         */
        readonly duration: string;
        /**
         * The type of recency dimension to use for the segment. Valid values are: `ACTIVE` and `INACTIVE` . If the value is `ACTIVE` , the segment includes users who have used your app within the specified duration are included in the segment. If the value is `INACTIVE` , the segment includes users who haven't used your app within the specified duration are included in the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions-behavior-recency.html#cfn-pinpoint-segment-segmentdimensions-behavior-recency-recencytype
         */
        readonly recencyType: string;
    }
}

/**
 * Determine whether the given properties match those of a `RecencyProperty`
 *
 * @param properties - the TypeScript properties of a `RecencyProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_RecencyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('duration', cdk.requiredValidator)(properties.duration));
    errors.collect(cdk.propertyValidator('duration', cdk.validateString)(properties.duration));
    errors.collect(cdk.propertyValidator('recencyType', cdk.requiredValidator)(properties.recencyType));
    errors.collect(cdk.propertyValidator('recencyType', cdk.validateString)(properties.recencyType));
    return errors.wrap('supplied properties not correct for "RecencyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Recency` resource
 *
 * @param properties - the TypeScript properties of a `RecencyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.Recency` resource.
 */
// @ts-ignore TS6133
function cfnSegmentRecencyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_RecencyPropertyValidator(properties).assertSuccess();
    return {
        Duration: cdk.stringToCloudFormation(properties.duration),
        RecencyType: cdk.stringToCloudFormation(properties.recencyType),
    };
}

// @ts-ignore TS6133
function CfnSegmentRecencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.RecencyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.RecencyProperty>();
    ret.addPropertyResult('duration', 'Duration', cfn_parse.FromCloudFormation.getString(properties.Duration));
    ret.addPropertyResult('recencyType', 'RecencyType', cfn_parse.FromCloudFormation.getString(properties.RecencyType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the dimension settings for a segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html
     */
    export interface SegmentDimensionsProperty {
        /**
         * One or more custom attributes to use as criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-attributes
         */
        readonly attributes?: any | cdk.IResolvable;
        /**
         * The behavior-based criteria, such as how recently users have used your app, for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-behavior
         */
        readonly behavior?: CfnSegment.BehaviorProperty | cdk.IResolvable;
        /**
         * The demographic-based criteria, such as device platform, for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-demographic
         */
        readonly demographic?: CfnSegment.DemographicProperty | cdk.IResolvable;
        /**
         * The location-based criteria, such as region or GPS coordinates, for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-location
         */
        readonly location?: CfnSegment.LocationProperty | cdk.IResolvable;
        /**
         * One or more custom metrics to use as criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-metrics
         */
        readonly metrics?: any | cdk.IResolvable;
        /**
         * One or more custom user attributes to use as criteria for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentdimensions.html#cfn-pinpoint-segment-segmentdimensions-userattributes
         */
        readonly userAttributes?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SegmentDimensionsProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentDimensionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_SegmentDimensionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attributes', cdk.validateObject)(properties.attributes));
    errors.collect(cdk.propertyValidator('behavior', CfnSegment_BehaviorPropertyValidator)(properties.behavior));
    errors.collect(cdk.propertyValidator('demographic', CfnSegment_DemographicPropertyValidator)(properties.demographic));
    errors.collect(cdk.propertyValidator('location', CfnSegment_LocationPropertyValidator)(properties.location));
    errors.collect(cdk.propertyValidator('metrics', cdk.validateObject)(properties.metrics));
    errors.collect(cdk.propertyValidator('userAttributes', cdk.validateObject)(properties.userAttributes));
    return errors.wrap('supplied properties not correct for "SegmentDimensionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SegmentDimensions` resource
 *
 * @param properties - the TypeScript properties of a `SegmentDimensionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SegmentDimensions` resource.
 */
// @ts-ignore TS6133
function cfnSegmentSegmentDimensionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_SegmentDimensionsPropertyValidator(properties).assertSuccess();
    return {
        Attributes: cdk.objectToCloudFormation(properties.attributes),
        Behavior: cfnSegmentBehaviorPropertyToCloudFormation(properties.behavior),
        Demographic: cfnSegmentDemographicPropertyToCloudFormation(properties.demographic),
        Location: cfnSegmentLocationPropertyToCloudFormation(properties.location),
        Metrics: cdk.objectToCloudFormation(properties.metrics),
        UserAttributes: cdk.objectToCloudFormation(properties.userAttributes),
    };
}

// @ts-ignore TS6133
function CfnSegmentSegmentDimensionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.SegmentDimensionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SegmentDimensionsProperty>();
    ret.addPropertyResult('attributes', 'Attributes', properties.Attributes != null ? cfn_parse.FromCloudFormation.getAny(properties.Attributes) : undefined);
    ret.addPropertyResult('behavior', 'Behavior', properties.Behavior != null ? CfnSegmentBehaviorPropertyFromCloudFormation(properties.Behavior) : undefined);
    ret.addPropertyResult('demographic', 'Demographic', properties.Demographic != null ? CfnSegmentDemographicPropertyFromCloudFormation(properties.Demographic) : undefined);
    ret.addPropertyResult('location', 'Location', properties.Location != null ? CfnSegmentLocationPropertyFromCloudFormation(properties.Location) : undefined);
    ret.addPropertyResult('metrics', 'Metrics', properties.Metrics != null ? cfn_parse.FromCloudFormation.getAny(properties.Metrics) : undefined);
    ret.addPropertyResult('userAttributes', 'UserAttributes', properties.UserAttributes != null ? cfn_parse.FromCloudFormation.getAny(properties.UserAttributes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the set of segment criteria to evaluate when handling segment groups for the segment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html
     */
    export interface SegmentGroupsProperty {
        /**
         * Specifies the set of segment criteria to evaluate when handling segment groups for the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html#cfn-pinpoint-segment-segmentgroups-groups
         */
        readonly groups?: Array<CfnSegment.GroupsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies how to handle multiple segment groups for the segment. For example, if the segment includes three segment groups, whether the resulting segment includes endpoints that match all, any, or none of the segment groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups.html#cfn-pinpoint-segment-segmentgroups-include
         */
        readonly include?: string;
    }
}

/**
 * Determine whether the given properties match those of a `SegmentGroupsProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentGroupsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_SegmentGroupsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groups', cdk.listValidator(CfnSegment_GroupsPropertyValidator))(properties.groups));
    errors.collect(cdk.propertyValidator('include', cdk.validateString)(properties.include));
    return errors.wrap('supplied properties not correct for "SegmentGroupsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SegmentGroups` resource
 *
 * @param properties - the TypeScript properties of a `SegmentGroupsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SegmentGroups` resource.
 */
// @ts-ignore TS6133
function cfnSegmentSegmentGroupsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_SegmentGroupsPropertyValidator(properties).assertSuccess();
    return {
        Groups: cdk.listMapper(cfnSegmentGroupsPropertyToCloudFormation)(properties.groups),
        Include: cdk.stringToCloudFormation(properties.include),
    };
}

// @ts-ignore TS6133
function CfnSegmentSegmentGroupsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.SegmentGroupsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SegmentGroupsProperty>();
    ret.addPropertyResult('groups', 'Groups', properties.Groups != null ? cfn_parse.FromCloudFormation.getArray(CfnSegmentGroupsPropertyFromCloudFormation)(properties.Groups) : undefined);
    ret.addPropertyResult('include', 'Include', properties.Include != null ? cfn_parse.FromCloudFormation.getString(properties.Include) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the dimension type and values for a segment dimension.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html
     */
    export interface SetDimensionProperty {
        /**
         * The type of segment dimension to use. Valid values are: `INCLUSIVE` , endpoints that match the criteria are included in the segment; and, `EXCLUSIVE` , endpoints that match the criteria are excluded from the segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html#cfn-pinpoint-segment-setdimension-dimensiontype
         */
        readonly dimensionType?: string;
        /**
         * The criteria values to use for the segment dimension. Depending on the value of the `DimensionType` property, endpoints are included or excluded from the segment if their values match the criteria values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-setdimension.html#cfn-pinpoint-segment-setdimension-values
         */
        readonly values?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `SetDimensionProperty`
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_SetDimensionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionType', cdk.validateString)(properties.dimensionType));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "SetDimensionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SetDimension` resource
 *
 * @param properties - the TypeScript properties of a `SetDimensionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SetDimension` resource.
 */
// @ts-ignore TS6133
function cfnSegmentSetDimensionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_SetDimensionPropertyValidator(properties).assertSuccess();
    return {
        DimensionType: cdk.stringToCloudFormation(properties.dimensionType),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnSegmentSetDimensionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.SetDimensionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SetDimensionProperty>();
    ret.addPropertyResult('dimensionType', 'DimensionType', properties.DimensionType != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionType) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnSegment {
    /**
     * Specifies the base segment to build the segment on. A base segment, also called a *source segment* , defines the initial population of endpoints for a segment. When you add dimensions to the segment, Amazon Pinpoint filters the base segment by using the dimensions that you specify.
     *
     * You can specify more than one dimensional segment or only one imported segment. If you specify an imported segment, the segment size estimate that displays on the Amazon Pinpoint console indicates the size of the imported segment without any filters applied to it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups-sourcesegments.html
     */
    export interface SourceSegmentsProperty {
        /**
         * The unique identifier for the source segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups-sourcesegments.html#cfn-pinpoint-segment-segmentgroups-groups-sourcesegments-id
         */
        readonly id: string;
        /**
         * The version number of the source segment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpoint-segment-segmentgroups-groups-sourcesegments.html#cfn-pinpoint-segment-segmentgroups-groups-sourcesegments-version
         */
        readonly version?: number;
    }
}

/**
 * Determine whether the given properties match those of a `SourceSegmentsProperty`
 *
 * @param properties - the TypeScript properties of a `SourceSegmentsProperty`
 *
 * @returns the result of the validation.
 */
function CfnSegment_SourceSegmentsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('version', cdk.validateNumber)(properties.version));
    return errors.wrap('supplied properties not correct for "SourceSegmentsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SourceSegments` resource
 *
 * @param properties - the TypeScript properties of a `SourceSegmentsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::Segment.SourceSegments` resource.
 */
// @ts-ignore TS6133
function cfnSegmentSourceSegmentsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSegment_SourceSegmentsPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Version: cdk.numberToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnSegmentSourceSegmentsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSegment.SourceSegmentsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSegment.SourceSegmentsProperty>();
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnSmsTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html
 */
export interface CfnSmsTemplateProps {

    /**
     * The message body to use in text messages that are based on the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-body
     */
    readonly body: string;

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatename
     */
    readonly templateName: string;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-defaultsubstitutions
     */
    readonly defaultSubstitutions?: string;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-tags
     */
    readonly tags?: any;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatedescription
     */
    readonly templateDescription?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSmsTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnSmsTemplateProps`
 *
 * @returns the result of the validation.
 */
function CfnSmsTemplatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('body', cdk.requiredValidator)(properties.body));
    errors.collect(cdk.propertyValidator('body', cdk.validateString)(properties.body));
    errors.collect(cdk.propertyValidator('defaultSubstitutions', cdk.validateString)(properties.defaultSubstitutions));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('templateDescription', cdk.validateString)(properties.templateDescription));
    errors.collect(cdk.propertyValidator('templateName', cdk.requiredValidator)(properties.templateName));
    errors.collect(cdk.propertyValidator('templateName', cdk.validateString)(properties.templateName));
    return errors.wrap('supplied properties not correct for "CfnSmsTemplateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::SmsTemplate` resource
 *
 * @param properties - the TypeScript properties of a `CfnSmsTemplateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::SmsTemplate` resource.
 */
// @ts-ignore TS6133
function cfnSmsTemplatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSmsTemplatePropsValidator(properties).assertSuccess();
    return {
        Body: cdk.stringToCloudFormation(properties.body),
        TemplateName: cdk.stringToCloudFormation(properties.templateName),
        DefaultSubstitutions: cdk.stringToCloudFormation(properties.defaultSubstitutions),
        Tags: cdk.objectToCloudFormation(properties.tags),
        TemplateDescription: cdk.stringToCloudFormation(properties.templateDescription),
    };
}

// @ts-ignore TS6133
function CfnSmsTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSmsTemplateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSmsTemplateProps>();
    ret.addPropertyResult('body', 'Body', cfn_parse.FromCloudFormation.getString(properties.Body));
    ret.addPropertyResult('templateName', 'TemplateName', cfn_parse.FromCloudFormation.getString(properties.TemplateName));
    ret.addPropertyResult('defaultSubstitutions', 'DefaultSubstitutions', properties.DefaultSubstitutions != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubstitutions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('templateDescription', 'TemplateDescription', properties.TemplateDescription != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::SmsTemplate`
 *
 * Creates a message template that you can use in messages that are sent through the SMS channel. A *message template* is a set of content and settings that you can define, save, and reuse in messages for any of your Amazon Pinpoint applications.
 *
 * @cloudformationResource AWS::Pinpoint::SmsTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html
 */
export class CfnSmsTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::SmsTemplate";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSmsTemplate {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSmsTemplatePropsFromCloudFormation(resourceProperties);
        const ret = new CfnSmsTemplate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the message template.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The message body to use in text messages that are based on the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-body
     */
    public body: string;

    /**
     * The name of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatename
     */
    public templateName: string;

    /**
     * A JSON object that specifies the default values to use for message variables in the message template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the default value for that variable. When you create a message that's based on the template, you can override these defaults with message-specific and address-specific variables and values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-defaultsubstitutions
     */
    public defaultSubstitutions: string | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * A custom description of the message template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-smstemplate.html#cfn-pinpoint-smstemplate-templatedescription
     */
    public templateDescription: string | undefined;

    /**
     * Create a new `AWS::Pinpoint::SmsTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSmsTemplateProps) {
        super(scope, id, { type: CfnSmsTemplate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'body', this);
        cdk.requireProperty(props, 'templateName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.body = props.body;
        this.templateName = props.templateName;
        this.defaultSubstitutions = props.defaultSubstitutions;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Pinpoint::SmsTemplate", props.tags, { tagPropertyName: 'tags' });
        this.templateDescription = props.templateDescription;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSmsTemplate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            body: this.body,
            templateName: this.templateName,
            defaultSubstitutions: this.defaultSubstitutions,
            tags: this.tags.renderTags(),
            templateDescription: this.templateDescription,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSmsTemplatePropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnVoiceChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html
 */
export interface CfnVoiceChannelProps {

    /**
     * The unique identifier for the Amazon Pinpoint application that the voice channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-applicationid
     */
    readonly applicationId: string;

    /**
     * Specifies whether to enable the voice channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnVoiceChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnVoiceChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnVoiceChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationId', cdk.requiredValidator)(properties.applicationId));
    errors.collect(cdk.propertyValidator('applicationId', cdk.validateString)(properties.applicationId));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "CfnVoiceChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Pinpoint::VoiceChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnVoiceChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Pinpoint::VoiceChannel` resource.
 */
// @ts-ignore TS6133
function cfnVoiceChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnVoiceChannelPropsValidator(properties).assertSuccess();
    return {
        ApplicationId: cdk.stringToCloudFormation(properties.applicationId),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnVoiceChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVoiceChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVoiceChannelProps>();
    ret.addPropertyResult('applicationId', 'ApplicationId', cfn_parse.FromCloudFormation.getString(properties.ApplicationId));
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Pinpoint::VoiceChannel`
 *
 * A *channel* is a type of platform that you can deliver messages to. To send a voice message, you send the message through the voice channel. Before you can use Amazon Pinpoint to send voice messages, you have to enable the voice channel for an Amazon Pinpoint application.
 *
 * The VoiceChannel resource represents the status and other information about the voice channel for an application.
 *
 * @cloudformationResource AWS::Pinpoint::VoiceChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html
 */
export class CfnVoiceChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Pinpoint::VoiceChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVoiceChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnVoiceChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnVoiceChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier for the Amazon Pinpoint application that the voice channel applies to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-applicationid
     */
    public applicationId: string;

    /**
     * Specifies whether to enable the voice channel for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpoint-voicechannel.html#cfn-pinpoint-voicechannel-enabled
     */
    public enabled: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Pinpoint::VoiceChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnVoiceChannelProps) {
        super(scope, id, { type: CfnVoiceChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'applicationId', this);

        this.applicationId = props.applicationId;
        this.enabled = props.enabled;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnVoiceChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            applicationId: this.applicationId,
            enabled: this.enabled,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnVoiceChannelPropsToCloudFormation(props);
    }
}
