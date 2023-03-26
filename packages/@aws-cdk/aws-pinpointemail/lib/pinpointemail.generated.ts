// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:43.690Z","fingerprint":"N6H9/lYTBWgUiwCajAHAE649hZ7psNpWjU7vtFei+pE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnConfigurationSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html
 */
export interface CfnConfigurationSetProps {

    /**
     * The name of the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-name
     */
    readonly name: string;

    /**
     * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-deliveryoptions
     */
    readonly deliveryOptions?: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable;

    /**
     * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-reputationoptions
     */
    readonly reputationOptions?: CfnConfigurationSet.ReputationOptionsProperty | cdk.IResolvable;

    /**
     * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-sendingoptions
     */
    readonly sendingOptions?: CfnConfigurationSet.SendingOptionsProperty | cdk.IResolvable;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-tags
     */
    readonly tags?: CfnConfigurationSet.TagsProperty[];

    /**
     * An object that defines the open and click tracking options for emails that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-trackingoptions
     */
    readonly trackingOptions?: CfnConfigurationSet.TrackingOptionsProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryOptions', CfnConfigurationSet_DeliveryOptionsPropertyValidator)(properties.deliveryOptions));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('reputationOptions', CfnConfigurationSet_ReputationOptionsPropertyValidator)(properties.reputationOptions));
    errors.collect(cdk.propertyValidator('sendingOptions', CfnConfigurationSet_SendingOptionsPropertyValidator)(properties.sendingOptions));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnConfigurationSet_TagsPropertyValidator))(properties.tags));
    errors.collect(cdk.propertyValidator('trackingOptions', CfnConfigurationSet_TrackingOptionsPropertyValidator)(properties.trackingOptions));
    return errors.wrap('supplied properties not correct for "CfnConfigurationSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        DeliveryOptions: cfnConfigurationSetDeliveryOptionsPropertyToCloudFormation(properties.deliveryOptions),
        ReputationOptions: cfnConfigurationSetReputationOptionsPropertyToCloudFormation(properties.reputationOptions),
        SendingOptions: cfnConfigurationSetSendingOptionsPropertyToCloudFormation(properties.sendingOptions),
        Tags: cdk.listMapper(cfnConfigurationSetTagsPropertyToCloudFormation)(properties.tags),
        TrackingOptions: cfnConfigurationSetTrackingOptionsPropertyToCloudFormation(properties.trackingOptions),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('deliveryOptions', 'DeliveryOptions', properties.DeliveryOptions != null ? CfnConfigurationSetDeliveryOptionsPropertyFromCloudFormation(properties.DeliveryOptions) : undefined);
    ret.addPropertyResult('reputationOptions', 'ReputationOptions', properties.ReputationOptions != null ? CfnConfigurationSetReputationOptionsPropertyFromCloudFormation(properties.ReputationOptions) : undefined);
    ret.addPropertyResult('sendingOptions', 'SendingOptions', properties.SendingOptions != null ? CfnConfigurationSetSendingOptionsPropertyFromCloudFormation(properties.SendingOptions) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationSetTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addPropertyResult('trackingOptions', 'TrackingOptions', properties.TrackingOptions != null ? CfnConfigurationSetTrackingOptionsPropertyFromCloudFormation(properties.TrackingOptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::PinpointEmail::ConfigurationSet`
 *
 * Create a configuration set. *Configuration sets* are groups of rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
 *
 * @cloudformationResource AWS::PinpointEmail::ConfigurationSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html
 */
export class CfnConfigurationSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::PinpointEmail::ConfigurationSet";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationSet {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationSetPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-name
     */
    public name: string;

    /**
     * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-deliveryoptions
     */
    public deliveryOptions: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-reputationoptions
     */
    public reputationOptions: CfnConfigurationSet.ReputationOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-sendingoptions
     */
    public sendingOptions: CfnConfigurationSet.SendingOptionsProperty | cdk.IResolvable | undefined;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-tags
     */
    public tags: CfnConfigurationSet.TagsProperty[] | undefined;

    /**
     * An object that defines the open and click tracking options for emails that you send using the configuration set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-trackingoptions
     */
    public trackingOptions: CfnConfigurationSet.TrackingOptionsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::PinpointEmail::ConfigurationSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationSetProps) {
        super(scope, id, { type: CfnConfigurationSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);

        this.name = props.name;
        this.deliveryOptions = props.deliveryOptions;
        this.reputationOptions = props.reputationOptions;
        this.sendingOptions = props.sendingOptions;
        this.tags = props.tags;
        this.trackingOptions = props.trackingOptions;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            deliveryOptions: this.deliveryOptions,
            reputationOptions: this.reputationOptions,
            sendingOptions: this.sendingOptions,
            tags: this.tags,
            trackingOptions: this.trackingOptions,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationSetPropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationSet {
    /**
     * Used to associate a configuration set with a dedicated IP pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-deliveryoptions.html
     */
    export interface DeliveryOptionsProperty {
        /**
         * The name of the dedicated IP pool that you want to associate with the configuration set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-deliveryoptions.html#cfn-pinpointemail-configurationset-deliveryoptions-sendingpoolname
         */
        readonly sendingPoolName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DeliveryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DeliveryOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSet_DeliveryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sendingPoolName', cdk.validateString)(properties.sendingPoolName));
    return errors.wrap('supplied properties not correct for "DeliveryOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.DeliveryOptions` resource
 *
 * @param properties - the TypeScript properties of a `DeliveryOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.DeliveryOptions` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetDeliveryOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSet_DeliveryOptionsPropertyValidator(properties).assertSuccess();
    return {
        SendingPoolName: cdk.stringToCloudFormation(properties.sendingPoolName),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetDeliveryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.DeliveryOptionsProperty>();
    ret.addPropertyResult('sendingPoolName', 'SendingPoolName', properties.SendingPoolName != null ? cfn_parse.FromCloudFormation.getString(properties.SendingPoolName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSet {
    /**
     * Enable or disable collection of reputation metrics for emails that you send using this configuration set in the current AWS Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-reputationoptions.html
     */
    export interface ReputationOptionsProperty {
        /**
         * If `true` , tracking of reputation metrics is enabled for the configuration set. If `false` , tracking of reputation metrics is disabled for the configuration set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-reputationoptions.html#cfn-pinpointemail-configurationset-reputationoptions-reputationmetricsenabled
         */
        readonly reputationMetricsEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ReputationOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ReputationOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSet_ReputationOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('reputationMetricsEnabled', cdk.validateBoolean)(properties.reputationMetricsEnabled));
    return errors.wrap('supplied properties not correct for "ReputationOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.ReputationOptions` resource
 *
 * @param properties - the TypeScript properties of a `ReputationOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.ReputationOptions` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetReputationOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSet_ReputationOptionsPropertyValidator(properties).assertSuccess();
    return {
        ReputationMetricsEnabled: cdk.booleanToCloudFormation(properties.reputationMetricsEnabled),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetReputationOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.ReputationOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.ReputationOptionsProperty>();
    ret.addPropertyResult('reputationMetricsEnabled', 'ReputationMetricsEnabled', properties.ReputationMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReputationMetricsEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSet {
    /**
     * Used to enable or disable email sending for messages that use this configuration set in the current AWS Region.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-sendingoptions.html
     */
    export interface SendingOptionsProperty {
        /**
         * If `true` , email sending is enabled for the configuration set. If `false` , email sending is disabled for the configuration set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-sendingoptions.html#cfn-pinpointemail-configurationset-sendingoptions-sendingenabled
         */
        readonly sendingEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SendingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SendingOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSet_SendingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sendingEnabled', cdk.validateBoolean)(properties.sendingEnabled));
    return errors.wrap('supplied properties not correct for "SendingOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.SendingOptions` resource
 *
 * @param properties - the TypeScript properties of a `SendingOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.SendingOptions` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetSendingOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSet_SendingOptionsPropertyValidator(properties).assertSuccess();
    return {
        SendingEnabled: cdk.booleanToCloudFormation(properties.sendingEnabled),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetSendingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.SendingOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.SendingOptionsProperty>();
    ret.addPropertyResult('sendingEnabled', 'SendingEnabled', properties.SendingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SendingEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSet {
    /**
     * An object that defines the tags (keys and values) that you want to associate with the configuration set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html
     */
    export interface TagsProperty {
        /**
         * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
         *
         * If you specify tags for the configuration set, then this value is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html#cfn-pinpointemail-configurationset-tags-key
         */
        readonly key?: string;
        /**
         * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html#cfn-pinpointemail-configurationset-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSet_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.Tags` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSet_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSet {
    /**
     * An object that defines the tracking options for a configuration set. When you use Amazon Pinpoint to send an email, it contains an invisible image that's used to track when recipients open your email. If your email contains links, those links are changed slightly in order to track when recipients click them.
     *
     * These images and links include references to a domain operated by AWS . You can optionally configure Amazon Pinpoint to use a domain that you operate for these images and links.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-trackingoptions.html
     */
    export interface TrackingOptionsProperty {
        /**
         * The domain that you want to use for tracking open and click events.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-trackingoptions.html#cfn-pinpointemail-configurationset-trackingoptions-customredirectdomain
         */
        readonly customRedirectDomain?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TrackingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `TrackingOptionsProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSet_TrackingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customRedirectDomain', cdk.validateString)(properties.customRedirectDomain));
    return errors.wrap('supplied properties not correct for "TrackingOptionsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.TrackingOptions` resource
 *
 * @param properties - the TypeScript properties of a `TrackingOptionsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSet.TrackingOptions` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetTrackingOptionsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSet_TrackingOptionsPropertyValidator(properties).assertSuccess();
    return {
        CustomRedirectDomain: cdk.stringToCloudFormation(properties.customRedirectDomain),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetTrackingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.TrackingOptionsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.TrackingOptionsProperty>();
    ret.addPropertyResult('customRedirectDomain', 'CustomRedirectDomain', properties.CustomRedirectDomain != null ? cfn_parse.FromCloudFormation.getString(properties.CustomRedirectDomain) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnConfigurationSetEventDestination`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html
 */
export interface CfnConfigurationSetEventDestinationProps {

    /**
     * The name of the configuration set that contains the event destination that you want to modify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-configurationsetname
     */
    readonly configurationSetName: string;

    /**
     * The name of the event destination that you want to modify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestinationname
     */
    readonly eventDestinationName: string;

    /**
     * An object that defines the event destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination
     */
    readonly eventDestination?: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationSetEventDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetEventDestinationProps`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestinationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configurationSetName', cdk.requiredValidator)(properties.configurationSetName));
    errors.collect(cdk.propertyValidator('configurationSetName', cdk.validateString)(properties.configurationSetName));
    errors.collect(cdk.propertyValidator('eventDestination', CfnConfigurationSetEventDestination_EventDestinationPropertyValidator)(properties.eventDestination));
    errors.collect(cdk.propertyValidator('eventDestinationName', cdk.requiredValidator)(properties.eventDestinationName));
    errors.collect(cdk.propertyValidator('eventDestinationName', cdk.validateString)(properties.eventDestinationName));
    return errors.wrap('supplied properties not correct for "CfnConfigurationSetEventDestinationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination` resource
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetEventDestinationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestinationPropsValidator(properties).assertSuccess();
    return {
        ConfigurationSetName: cdk.stringToCloudFormation(properties.configurationSetName),
        EventDestinationName: cdk.stringToCloudFormation(properties.eventDestinationName),
        EventDestination: cfnConfigurationSetEventDestinationEventDestinationPropertyToCloudFormation(properties.eventDestination),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestinationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestinationProps>();
    ret.addPropertyResult('configurationSetName', 'ConfigurationSetName', cfn_parse.FromCloudFormation.getString(properties.ConfigurationSetName));
    ret.addPropertyResult('eventDestinationName', 'EventDestinationName', cfn_parse.FromCloudFormation.getString(properties.EventDestinationName));
    ret.addPropertyResult('eventDestination', 'EventDestination', properties.EventDestination != null ? CfnConfigurationSetEventDestinationEventDestinationPropertyFromCloudFormation(properties.EventDestination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::PinpointEmail::ConfigurationSetEventDestination`
 *
 * Create an event destination. In Amazon Pinpoint, *events* include message sends, deliveries, opens, clicks, bounces, and complaints. *Event destinations* are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 *
 * A single configuration set can include more than one event destination.
 *
 * @cloudformationResource AWS::PinpointEmail::ConfigurationSetEventDestination
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html
 */
export class CfnConfigurationSetEventDestination extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::PinpointEmail::ConfigurationSetEventDestination";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationSetEventDestination {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnConfigurationSetEventDestinationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnConfigurationSetEventDestination(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the configuration set that contains the event destination that you want to modify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-configurationsetname
     */
    public configurationSetName: string;

    /**
     * The name of the event destination that you want to modify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestinationname
     */
    public eventDestinationName: string;

    /**
     * An object that defines the event destination.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination
     */
    public eventDestination: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::PinpointEmail::ConfigurationSetEventDestination`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConfigurationSetEventDestinationProps) {
        super(scope, id, { type: CfnConfigurationSetEventDestination.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'configurationSetName', this);
        cdk.requireProperty(props, 'eventDestinationName', this);

        this.configurationSetName = props.configurationSetName;
        this.eventDestinationName = props.eventDestinationName;
        this.eventDestination = props.eventDestination;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationSetEventDestination.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            configurationSetName: this.configurationSetName,
            eventDestinationName: this.eventDestinationName,
            eventDestination: this.eventDestination,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnConfigurationSetEventDestinationPropsToCloudFormation(props);
    }
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * An object that defines an Amazon CloudWatch destination for email events. You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-cloudwatchdestination.html
     */
    export interface CloudWatchDestinationProperty {
        /**
         * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-cloudwatchdestination.html#cfn-pinpointemail-configurationseteventdestination-cloudwatchdestination-dimensionconfigurations
         */
        readonly dimensionConfigurations?: Array<CfnConfigurationSetEventDestination.DimensionConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_CloudWatchDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dimensionConfigurations', cdk.listValidator(CfnConfigurationSetEventDestination_DimensionConfigurationPropertyValidator))(properties.dimensionConfigurations));
    return errors.wrap('supplied properties not correct for "CloudWatchDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.CloudWatchDestination` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.CloudWatchDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationCloudWatchDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_CloudWatchDestinationPropertyValidator(properties).assertSuccess();
    return {
        DimensionConfigurations: cdk.listMapper(cfnConfigurationSetEventDestinationDimensionConfigurationPropertyToCloudFormation)(properties.dimensionConfigurations),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.CloudWatchDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.CloudWatchDestinationProperty>();
    ret.addPropertyResult('dimensionConfigurations', 'DimensionConfigurations', properties.DimensionConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationSetEventDestinationDimensionConfigurationPropertyFromCloudFormation)(properties.DimensionConfigurations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html
     */
    export interface DimensionConfigurationProperty {
        /**
         * The default value of the dimension that is published to Amazon CloudWatch if you don't provide the value of the dimension when you send an email. This value has to meet the following criteria:
         *
         * - It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
         * - It can contain no more than 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-defaultdimensionvalue
         */
        readonly defaultDimensionValue: string;
        /**
         * The name of an Amazon CloudWatch dimension associated with an email sending metric. The name has to meet the following criteria:
         *
         * - It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
         * - It can contain no more than 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-dimensionname
         */
        readonly dimensionName: string;
        /**
         * The location where Amazon Pinpoint finds the value of a dimension to publish to Amazon CloudWatch. Acceptable values: `MESSAGE_TAG` , `EMAIL_HEADER` , and `LINK_TAG` .
         *
         * If you want Amazon Pinpoint to use the message tags that you specify using an `X-SES-MESSAGE-TAGS` header or a parameter to the `SendEmail` API, choose `MESSAGE_TAG` . If you want Amazon Pinpoint to use your own email headers, choose `EMAIL_HEADER` . If you want Amazon Pinpoint to use tags that are specified in your links, choose `LINK_TAG` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-dimensionvaluesource
         */
        readonly dimensionValueSource: string;
    }
}

/**
 * Determine whether the given properties match those of a `DimensionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_DimensionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultDimensionValue', cdk.requiredValidator)(properties.defaultDimensionValue));
    errors.collect(cdk.propertyValidator('defaultDimensionValue', cdk.validateString)(properties.defaultDimensionValue));
    errors.collect(cdk.propertyValidator('dimensionName', cdk.requiredValidator)(properties.dimensionName));
    errors.collect(cdk.propertyValidator('dimensionName', cdk.validateString)(properties.dimensionName));
    errors.collect(cdk.propertyValidator('dimensionValueSource', cdk.requiredValidator)(properties.dimensionValueSource));
    errors.collect(cdk.propertyValidator('dimensionValueSource', cdk.validateString)(properties.dimensionValueSource));
    return errors.wrap('supplied properties not correct for "DimensionConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.DimensionConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `DimensionConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.DimensionConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationDimensionConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_DimensionConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DefaultDimensionValue: cdk.stringToCloudFormation(properties.defaultDimensionValue),
        DimensionName: cdk.stringToCloudFormation(properties.dimensionName),
        DimensionValueSource: cdk.stringToCloudFormation(properties.dimensionValueSource),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationDimensionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.DimensionConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.DimensionConfigurationProperty>();
    ret.addPropertyResult('defaultDimensionValue', 'DefaultDimensionValue', cfn_parse.FromCloudFormation.getString(properties.DefaultDimensionValue));
    ret.addPropertyResult('dimensionName', 'DimensionName', cfn_parse.FromCloudFormation.getString(properties.DimensionName));
    ret.addPropertyResult('dimensionValueSource', 'DimensionValueSource', cfn_parse.FromCloudFormation.getString(properties.DimensionValueSource));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * In Amazon Pinpoint, *events* include message sends, deliveries, opens, clicks, bounces, and complaints. *Event destinations* are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html
     */
    export interface EventDestinationProperty {
        /**
         * An object that defines an Amazon CloudWatch destination for email events. You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-cloudwatchdestination
         */
        readonly cloudWatchDestination?: CfnConfigurationSetEventDestination.CloudWatchDestinationProperty | cdk.IResolvable;
        /**
         * If `true` , the event destination is enabled. When the event destination is enabled, the specified event types are sent to the destinations in this `EventDestinationDefinition` .
         *
         * If `false` , the event destination is disabled. When the event destination is disabled, events aren't sent to the specified destinations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * An object that defines an Amazon Kinesis Data Firehose destination for email events. You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-kinesisfirehosedestination
         */
        readonly kinesisFirehoseDestination?: CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty | cdk.IResolvable;
        /**
         * The types of events that Amazon Pinpoint sends to the specified event destinations. Acceptable values: `SEND` , `REJECT` , `BOUNCE` , `COMPLAINT` , `DELIVERY` , `OPEN` , `CLICK` , and `RENDERING_FAILURE` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-matchingeventtypes
         */
        readonly matchingEventTypes: string[];
        /**
         * An object that defines a Amazon Pinpoint destination for email events. You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-pinpointdestination
         */
        readonly pinpointDestination?: CfnConfigurationSetEventDestination.PinpointDestinationProperty | cdk.IResolvable;
        /**
         * An object that defines an Amazon SNS destination for email events. You can use Amazon SNS to send notification when certain email events occur.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-snsdestination
         */
        readonly snsDestination?: CfnConfigurationSetEventDestination.SnsDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EventDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `EventDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_EventDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchDestination', CfnConfigurationSetEventDestination_CloudWatchDestinationPropertyValidator)(properties.cloudWatchDestination));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('kinesisFirehoseDestination', CfnConfigurationSetEventDestination_KinesisFirehoseDestinationPropertyValidator)(properties.kinesisFirehoseDestination));
    errors.collect(cdk.propertyValidator('matchingEventTypes', cdk.requiredValidator)(properties.matchingEventTypes));
    errors.collect(cdk.propertyValidator('matchingEventTypes', cdk.listValidator(cdk.validateString))(properties.matchingEventTypes));
    errors.collect(cdk.propertyValidator('pinpointDestination', CfnConfigurationSetEventDestination_PinpointDestinationPropertyValidator)(properties.pinpointDestination));
    errors.collect(cdk.propertyValidator('snsDestination', CfnConfigurationSetEventDestination_SnsDestinationPropertyValidator)(properties.snsDestination));
    return errors.wrap('supplied properties not correct for "EventDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.EventDestination` resource
 *
 * @param properties - the TypeScript properties of a `EventDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.EventDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationEventDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_EventDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchDestination: cfnConfigurationSetEventDestinationCloudWatchDestinationPropertyToCloudFormation(properties.cloudWatchDestination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        KinesisFirehoseDestination: cfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyToCloudFormation(properties.kinesisFirehoseDestination),
        MatchingEventTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.matchingEventTypes),
        PinpointDestination: cfnConfigurationSetEventDestinationPinpointDestinationPropertyToCloudFormation(properties.pinpointDestination),
        SnsDestination: cfnConfigurationSetEventDestinationSnsDestinationPropertyToCloudFormation(properties.snsDestination),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationEventDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.EventDestinationProperty>();
    ret.addPropertyResult('cloudWatchDestination', 'CloudWatchDestination', properties.CloudWatchDestination != null ? CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyFromCloudFormation(properties.CloudWatchDestination) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addPropertyResult('kinesisFirehoseDestination', 'KinesisFirehoseDestination', properties.KinesisFirehoseDestination != null ? CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyFromCloudFormation(properties.KinesisFirehoseDestination) : undefined);
    ret.addPropertyResult('matchingEventTypes', 'MatchingEventTypes', cfn_parse.FromCloudFormation.getStringArray(properties.MatchingEventTypes));
    ret.addPropertyResult('pinpointDestination', 'PinpointDestination', properties.PinpointDestination != null ? CfnConfigurationSetEventDestinationPinpointDestinationPropertyFromCloudFormation(properties.PinpointDestination) : undefined);
    ret.addPropertyResult('snsDestination', 'SnsDestination', properties.SnsDestination != null ? CfnConfigurationSetEventDestinationSnsDestinationPropertyFromCloudFormation(properties.SnsDestination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * An object that defines an Amazon Kinesis Data Firehose destination for email events. You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html
     */
    export interface KinesisFirehoseDestinationProperty {
        /**
         * The Amazon Resource Name (ARN) of the Amazon Kinesis Data Firehose stream that Amazon Pinpoint sends email events to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html#cfn-pinpointemail-configurationseteventdestination-kinesisfirehosedestination-deliverystreamarn
         */
        readonly deliveryStreamArn: string;
        /**
         * The Amazon Resource Name (ARN) of the IAM role that Amazon Pinpoint uses when sending email events to the Amazon Kinesis Data Firehose stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html#cfn-pinpointemail-configurationseteventdestination-kinesisfirehosedestination-iamrolearn
         */
        readonly iamRoleArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_KinesisFirehoseDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryStreamArn', cdk.requiredValidator)(properties.deliveryStreamArn));
    errors.collect(cdk.propertyValidator('deliveryStreamArn', cdk.validateString)(properties.deliveryStreamArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.requiredValidator)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.validateString)(properties.iamRoleArn));
    return errors.wrap('supplied properties not correct for "KinesisFirehoseDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.KinesisFirehoseDestination` resource
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.KinesisFirehoseDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_KinesisFirehoseDestinationPropertyValidator(properties).assertSuccess();
    return {
        DeliveryStreamArn: cdk.stringToCloudFormation(properties.deliveryStreamArn),
        IamRoleArn: cdk.stringToCloudFormation(properties.iamRoleArn),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty>();
    ret.addPropertyResult('deliveryStreamArn', 'DeliveryStreamArn', cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamArn));
    ret.addPropertyResult('iamRoleArn', 'IamRoleArn', cfn_parse.FromCloudFormation.getString(properties.IamRoleArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * An object that defines a Amazon Pinpoint destination for email events. You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-pinpointdestination.html
     */
    export interface PinpointDestinationProperty {
        /**
         * The Amazon Resource Name (ARN) of the Amazon Pinpoint project that you want to send email events to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-pinpointdestination.html#cfn-pinpointemail-configurationseteventdestination-pinpointdestination-applicationarn
         */
        readonly applicationArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `PinpointDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `PinpointDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_PinpointDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('applicationArn', cdk.validateString)(properties.applicationArn));
    return errors.wrap('supplied properties not correct for "PinpointDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.PinpointDestination` resource
 *
 * @param properties - the TypeScript properties of a `PinpointDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.PinpointDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationPinpointDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_PinpointDestinationPropertyValidator(properties).assertSuccess();
    return {
        ApplicationArn: cdk.stringToCloudFormation(properties.applicationArn),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPinpointDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.PinpointDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.PinpointDestinationProperty>();
    ret.addPropertyResult('applicationArn', 'ApplicationArn', properties.ApplicationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnConfigurationSetEventDestination {
    /**
     * An object that defines an Amazon SNS destination for email events. You can use Amazon SNS to send notification when certain email events occur.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-snsdestination.html
     */
    export interface SnsDestinationProperty {
        /**
         * The Amazon Resource Name (ARN) of the Amazon SNS topic that you want to publish email events to. For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-snsdestination.html#cfn-pinpointemail-configurationseteventdestination-snsdestination-topicarn
         */
        readonly topicArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `SnsDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `SnsDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnConfigurationSetEventDestination_SnsDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('topicArn', cdk.requiredValidator)(properties.topicArn));
    errors.collect(cdk.propertyValidator('topicArn', cdk.validateString)(properties.topicArn));
    return errors.wrap('supplied properties not correct for "SnsDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.SnsDestination` resource
 *
 * @param properties - the TypeScript properties of a `SnsDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::ConfigurationSetEventDestination.SnsDestination` resource.
 */
// @ts-ignore TS6133
function cfnConfigurationSetEventDestinationSnsDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnConfigurationSetEventDestination_SnsDestinationPropertyValidator(properties).assertSuccess();
    return {
        TopicArn: cdk.stringToCloudFormation(properties.topicArn),
    };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationSnsDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.SnsDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.SnsDestinationProperty>();
    ret.addPropertyResult('topicArn', 'TopicArn', cfn_parse.FromCloudFormation.getString(properties.TopicArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnDedicatedIpPool`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html
 */
export interface CfnDedicatedIpPoolProps {

    /**
     * The name of the dedicated IP pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-poolname
     */
    readonly poolName?: string;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-tags
     */
    readonly tags?: CfnDedicatedIpPool.TagsProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnDedicatedIpPoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnDedicatedIpPoolProps`
 *
 * @returns the result of the validation.
 */
function CfnDedicatedIpPoolPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('poolName', cdk.validateString)(properties.poolName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnDedicatedIpPool_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnDedicatedIpPoolProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::DedicatedIpPool` resource
 *
 * @param properties - the TypeScript properties of a `CfnDedicatedIpPoolProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::DedicatedIpPool` resource.
 */
// @ts-ignore TS6133
function cfnDedicatedIpPoolPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDedicatedIpPoolPropsValidator(properties).assertSuccess();
    return {
        PoolName: cdk.stringToCloudFormation(properties.poolName),
        Tags: cdk.listMapper(cfnDedicatedIpPoolTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnDedicatedIpPoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDedicatedIpPoolProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDedicatedIpPoolProps>();
    ret.addPropertyResult('poolName', 'PoolName', properties.PoolName != null ? cfn_parse.FromCloudFormation.getString(properties.PoolName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDedicatedIpPoolTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::PinpointEmail::DedicatedIpPool`
 *
 * A request to create a new dedicated IP pool.
 *
 * @cloudformationResource AWS::PinpointEmail::DedicatedIpPool
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html
 */
export class CfnDedicatedIpPool extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::PinpointEmail::DedicatedIpPool";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDedicatedIpPool {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDedicatedIpPoolPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDedicatedIpPool(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The name of the dedicated IP pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-poolname
     */
    public poolName: string | undefined;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-tags
     */
    public tags: CfnDedicatedIpPool.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::PinpointEmail::DedicatedIpPool`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDedicatedIpPoolProps = {}) {
        super(scope, id, { type: CfnDedicatedIpPool.CFN_RESOURCE_TYPE_NAME, properties: props });

        this.poolName = props.poolName;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDedicatedIpPool.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            poolName: this.poolName,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDedicatedIpPoolPropsToCloudFormation(props);
    }
}

export namespace CfnDedicatedIpPool {
    /**
     * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html
     */
    export interface TagsProperty {
        /**
         * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
         *
         * If you specify tags for the dedicated IP pool, then this value is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html#cfn-pinpointemail-dedicatedippool-tags-key
         */
        readonly key?: string;
        /**
         * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html#cfn-pinpointemail-dedicatedippool-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnDedicatedIpPool_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::DedicatedIpPool.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::DedicatedIpPool.Tags` resource.
 */
// @ts-ignore TS6133
function cfnDedicatedIpPoolTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDedicatedIpPool_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnDedicatedIpPoolTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDedicatedIpPool.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDedicatedIpPool.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnIdentity`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html
 */
export interface CfnIdentityProps {

    /**
     * The address or domain of the identity, such as *sender@example.com* or *example.co.uk* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-name
     */
    readonly name: string;

    /**
     * For domain identities, this attribute is used to enable or disable DomainKeys Identified Mail (DKIM) signing for the domain.
     *
     * If the value is `true` , then the messages that you send from the domain are signed using both the DKIM keys for your domain, as well as the keys for the `amazonses.com` domain. If the value is `false` , then the messages that you send are only signed using the DKIM keys for the `amazonses.com` domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-dkimsigningenabled
     */
    readonly dkimSigningEnabled?: boolean | cdk.IResolvable;

    /**
     * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event.
     *
     * When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email.
     *
     * When you disable feedback forwarding, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-feedbackforwardingenabled
     */
    readonly feedbackForwardingEnabled?: boolean | cdk.IResolvable;

    /**
     * Used to enable or disable the custom Mail-From domain configuration for an email identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-mailfromattributes
     */
    readonly mailFromAttributes?: CfnIdentity.MailFromAttributesProperty | cdk.IResolvable;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the email identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-tags
     */
    readonly tags?: CfnIdentity.TagsProperty[];
}

/**
 * Determine whether the given properties match those of a `CfnIdentityProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProps`
 *
 * @returns the result of the validation.
 */
function CfnIdentityPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('dkimSigningEnabled', cdk.validateBoolean)(properties.dkimSigningEnabled));
    errors.collect(cdk.propertyValidator('feedbackForwardingEnabled', cdk.validateBoolean)(properties.feedbackForwardingEnabled));
    errors.collect(cdk.propertyValidator('mailFromAttributes', CfnIdentity_MailFromAttributesPropertyValidator)(properties.mailFromAttributes));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(CfnIdentity_TagsPropertyValidator))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnIdentityProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity` resource
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity` resource.
 */
// @ts-ignore TS6133
function cfnIdentityPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentityPropsValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        DkimSigningEnabled: cdk.booleanToCloudFormation(properties.dkimSigningEnabled),
        FeedbackForwardingEnabled: cdk.booleanToCloudFormation(properties.feedbackForwardingEnabled),
        MailFromAttributes: cfnIdentityMailFromAttributesPropertyToCloudFormation(properties.mailFromAttributes),
        Tags: cdk.listMapper(cfnIdentityTagsPropertyToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnIdentityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProps>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('dkimSigningEnabled', 'DkimSigningEnabled', properties.DkimSigningEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DkimSigningEnabled) : undefined);
    ret.addPropertyResult('feedbackForwardingEnabled', 'FeedbackForwardingEnabled', properties.FeedbackForwardingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FeedbackForwardingEnabled) : undefined);
    ret.addPropertyResult('mailFromAttributes', 'MailFromAttributes', properties.MailFromAttributes != null ? CfnIdentityMailFromAttributesPropertyFromCloudFormation(properties.MailFromAttributes) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityTagsPropertyFromCloudFormation)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::PinpointEmail::Identity`
 *
 * Specifies an identity to use for sending email through Amazon Pinpoint. In Amazon Pinpoint, an *identity* is an email address or domain that you use when you send email. Before you can use Amazon Pinpoint to send an email from an identity, you first have to verify it. By verifying an identity, you demonstrate that you're the owner of the address or domain, and that you've given Amazon Pinpoint permission to send email from that identity.
 *
 * When you verify an email address, Amazon Pinpoint sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.
 *
 * When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS configuration for your domain. It usually takes around 72 hours to complete the domain verification process.
 *
 * > When you use CloudFormation to specify an identity, CloudFormation might indicate that the identity was created successfully. However, you have to verify the identity before you can use it to send email.
 *
 * @cloudformationResource AWS::PinpointEmail::Identity
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html
 */
export class CfnIdentity extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::PinpointEmail::Identity";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentity {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIdentityPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIdentity(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The host name for the first token that you have to add to the DNS configuration for your domain.
     *
     * For more information, see [Verifying a Domain](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-email-manage-verify.html#channels-email-manage-verify-domain) in the Amazon Pinpoint User Guide.
     * @cloudformationAttribute IdentityDNSRecordName1
     */
    public readonly attrIdentityDnsRecordName1: string;

    /**
     * The host name for the second token that you have to add to the DNS configuration for your domain.
     * @cloudformationAttribute IdentityDNSRecordName2
     */
    public readonly attrIdentityDnsRecordName2: string;

    /**
     * The host name for the third token that you have to add to the DNS configuration for your domain.
     * @cloudformationAttribute IdentityDNSRecordName3
     */
    public readonly attrIdentityDnsRecordName3: string;

    /**
     * The record value for the first token that you have to add to the DNS configuration for your domain.
     * @cloudformationAttribute IdentityDNSRecordValue1
     */
    public readonly attrIdentityDnsRecordValue1: string;

    /**
     * The record value for the second token that you have to add to the DNS configuration for your domain.
     * @cloudformationAttribute IdentityDNSRecordValue2
     */
    public readonly attrIdentityDnsRecordValue2: string;

    /**
     * The record value for the third token that you have to add to the DNS configuration for your domain.
     * @cloudformationAttribute IdentityDNSRecordValue3
     */
    public readonly attrIdentityDnsRecordValue3: string;

    /**
     * The address or domain of the identity, such as *sender@example.com* or *example.co.uk* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-name
     */
    public name: string;

    /**
     * For domain identities, this attribute is used to enable or disable DomainKeys Identified Mail (DKIM) signing for the domain.
     *
     * If the value is `true` , then the messages that you send from the domain are signed using both the DKIM keys for your domain, as well as the keys for the `amazonses.com` domain. If the value is `false` , then the messages that you send are only signed using the DKIM keys for the `amazonses.com` domain.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-dkimsigningenabled
     */
    public dkimSigningEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event.
     *
     * When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email.
     *
     * When you disable feedback forwarding, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-feedbackforwardingenabled
     */
    public feedbackForwardingEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Used to enable or disable the custom Mail-From domain configuration for an email identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-mailfromattributes
     */
    public mailFromAttributes: CfnIdentity.MailFromAttributesProperty | cdk.IResolvable | undefined;

    /**
     * An object that defines the tags (keys and values) that you want to associate with the email identity.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-tags
     */
    public tags: CfnIdentity.TagsProperty[] | undefined;

    /**
     * Create a new `AWS::PinpointEmail::Identity`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIdentityProps) {
        super(scope, id, { type: CfnIdentity.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'name', this);
        this.attrIdentityDnsRecordName1 = cdk.Token.asString(this.getAtt('IdentityDNSRecordName1', cdk.ResolutionTypeHint.STRING));
        this.attrIdentityDnsRecordName2 = cdk.Token.asString(this.getAtt('IdentityDNSRecordName2', cdk.ResolutionTypeHint.STRING));
        this.attrIdentityDnsRecordName3 = cdk.Token.asString(this.getAtt('IdentityDNSRecordName3', cdk.ResolutionTypeHint.STRING));
        this.attrIdentityDnsRecordValue1 = cdk.Token.asString(this.getAtt('IdentityDNSRecordValue1', cdk.ResolutionTypeHint.STRING));
        this.attrIdentityDnsRecordValue2 = cdk.Token.asString(this.getAtt('IdentityDNSRecordValue2', cdk.ResolutionTypeHint.STRING));
        this.attrIdentityDnsRecordValue3 = cdk.Token.asString(this.getAtt('IdentityDNSRecordValue3', cdk.ResolutionTypeHint.STRING));

        this.name = props.name;
        this.dkimSigningEnabled = props.dkimSigningEnabled;
        this.feedbackForwardingEnabled = props.feedbackForwardingEnabled;
        this.mailFromAttributes = props.mailFromAttributes;
        this.tags = props.tags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentity.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            name: this.name,
            dkimSigningEnabled: this.dkimSigningEnabled,
            feedbackForwardingEnabled: this.feedbackForwardingEnabled,
            mailFromAttributes: this.mailFromAttributes,
            tags: this.tags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIdentityPropsToCloudFormation(props);
    }
}

export namespace CfnIdentity {
    /**
     * A list of attributes that are associated with a MAIL FROM domain.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html
     */
    export interface MailFromAttributesProperty {
        /**
         * The action that Amazon Pinpoint to takes if it can't read the required MX record for a custom MAIL FROM domain. When you set this value to `UseDefaultValue` , Amazon Pinpoint uses *amazonses.com* as the MAIL FROM domain. When you set this value to `RejectMessage` , Amazon Pinpoint returns a `MailFromDomainNotVerified` error, and doesn't attempt to deliver the email.
         *
         * These behaviors are taken when the custom MAIL FROM domain configuration is in the `Pending` , `Failed` , and `TemporaryFailure` states.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html#cfn-pinpointemail-identity-mailfromattributes-behavioronmxfailure
         */
        readonly behaviorOnMxFailure?: string;
        /**
         * The name of a domain that an email identity uses as a custom MAIL FROM domain.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html#cfn-pinpointemail-identity-mailfromattributes-mailfromdomain
         */
        readonly mailFromDomain?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MailFromAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `MailFromAttributesProperty`
 *
 * @returns the result of the validation.
 */
function CfnIdentity_MailFromAttributesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('behaviorOnMxFailure', cdk.validateString)(properties.behaviorOnMxFailure));
    errors.collect(cdk.propertyValidator('mailFromDomain', cdk.validateString)(properties.mailFromDomain));
    return errors.wrap('supplied properties not correct for "MailFromAttributesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity.MailFromAttributes` resource
 *
 * @param properties - the TypeScript properties of a `MailFromAttributesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity.MailFromAttributes` resource.
 */
// @ts-ignore TS6133
function cfnIdentityMailFromAttributesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentity_MailFromAttributesPropertyValidator(properties).assertSuccess();
    return {
        BehaviorOnMxFailure: cdk.stringToCloudFormation(properties.behaviorOnMxFailure),
        MailFromDomain: cdk.stringToCloudFormation(properties.mailFromDomain),
    };
}

// @ts-ignore TS6133
function CfnIdentityMailFromAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentity.MailFromAttributesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentity.MailFromAttributesProperty>();
    ret.addPropertyResult('behaviorOnMxFailure', 'BehaviorOnMxFailure', properties.BehaviorOnMxFailure != null ? cfn_parse.FromCloudFormation.getString(properties.BehaviorOnMxFailure) : undefined);
    ret.addPropertyResult('mailFromDomain', 'MailFromDomain', properties.MailFromDomain != null ? cfn_parse.FromCloudFormation.getString(properties.MailFromDomain) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIdentity {
    /**
     * An object that defines the tags (keys and values) that you want to associate with the identity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html
     */
    export interface TagsProperty {
        /**
         * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
         *
         * If you specify tags for the identity, then this value is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html#cfn-pinpointemail-identity-tags-key
         */
        readonly key?: string;
        /**
         * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html#cfn-pinpointemail-identity-tags-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
function CfnIdentity_TagsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TagsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity.Tags` resource
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::PinpointEmail::Identity.Tags` resource.
 */
// @ts-ignore TS6133
function cfnIdentityTagsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentity_TagsPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnIdentityTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentity.TagsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentity.TagsProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
