// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:17.431Z","fingerprint":"kSZKqF67LP5k3AX3isukrdJMzTyIac4wKEeZDMQ+nhI="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnContact`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export interface CfnContactProps {

    /**
     * The unique and identifiable alias of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-alias
     */
    readonly alias: string;

    /**
     * The full name of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-displayname
     */
    readonly displayName: string;

    /**
     * A list of stages. A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-plan
     */
    readonly plan: Array<CfnContact.StageProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Refers to the type of contact. A single contact is type `PERSONAL` and an escalation plan is type `ESCALATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-type
     */
    readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnContactProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactProps`
 *
 * @returns the result of the validation.
 */
function CfnContactPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alias', cdk.requiredValidator)(properties.alias));
    errors.collect(cdk.propertyValidator('alias', cdk.validateString)(properties.alias));
    errors.collect(cdk.propertyValidator('displayName', cdk.requiredValidator)(properties.displayName));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('plan', cdk.requiredValidator)(properties.plan));
    errors.collect(cdk.propertyValidator('plan', cdk.listValidator(CfnContact_StagePropertyValidator))(properties.plan));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnContactProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::Contact` resource
 *
 * @param properties - the TypeScript properties of a `CfnContactProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::Contact` resource.
 */
// @ts-ignore TS6133
function cfnContactPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContactPropsValidator(properties).assertSuccess();
    return {
        Alias: cdk.stringToCloudFormation(properties.alias),
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        Plan: cdk.listMapper(cfnContactStagePropertyToCloudFormation)(properties.plan),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnContactPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactProps>();
    ret.addPropertyResult('alias', 'Alias', cfn_parse.FromCloudFormation.getString(properties.Alias));
    ret.addPropertyResult('displayName', 'DisplayName', cfn_parse.FromCloudFormation.getString(properties.DisplayName));
    ret.addPropertyResult('plan', 'Plan', cfn_parse.FromCloudFormation.getArray(CfnContactStagePropertyFromCloudFormation)(properties.Plan));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSMContacts::Contact`
 *
 * The `AWS::SSMContacts::Contact` resource specifies a contact or escalation plan. Incident Manager contacts are a subset of actions and data types that you can use for managing responder engagement and interaction.
 *
 * @cloudformationResource AWS::SSMContacts::Contact
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export class CfnContact extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMContacts::Contact";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContact {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContactPropsFromCloudFormation(resourceProperties);
        const ret = new CfnContact(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the `Contact` resource, such as `arn:aws:ssm-contacts:us-west-2:123456789012:contact/contactalias` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique and identifiable alias of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-alias
     */
    public alias: string;

    /**
     * The full name of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-displayname
     */
    public displayName: string;

    /**
     * A list of stages. A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-plan
     */
    public plan: Array<CfnContact.StageProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Refers to the type of contact. A single contact is type `PERSONAL` and an escalation plan is type `ESCALATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-type
     */
    public type: string;

    /**
     * Create a new `AWS::SSMContacts::Contact`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactProps) {
        super(scope, id, { type: CfnContact.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'alias', this);
        cdk.requireProperty(props, 'displayName', this);
        cdk.requireProperty(props, 'plan', this);
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.alias = props.alias;
        this.displayName = props.displayName;
        this.plan = props.plan;
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContact.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            alias: this.alias,
            displayName: this.displayName,
            plan: this.plan,
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContactPropsToCloudFormation(props);
    }
}

export namespace CfnContact {
    /**
     * Information about the contact channel that Incident Manager uses to engage the contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html
     */
    export interface ChannelTargetInfoProperty {
        /**
         * The Amazon Resource Name (ARN) of the contact channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-channelid
         */
        readonly channelId: string;
        /**
         * The number of minutes to wait to retry sending engagement in the case the engagement initially fails.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-retryintervalinminutes
         */
        readonly retryIntervalInMinutes: number;
    }
}

/**
 * Determine whether the given properties match those of a `ChannelTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnContact_ChannelTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelId', cdk.requiredValidator)(properties.channelId));
    errors.collect(cdk.propertyValidator('channelId', cdk.validateString)(properties.channelId));
    errors.collect(cdk.propertyValidator('retryIntervalInMinutes', cdk.requiredValidator)(properties.retryIntervalInMinutes));
    errors.collect(cdk.propertyValidator('retryIntervalInMinutes', cdk.validateNumber)(properties.retryIntervalInMinutes));
    return errors.wrap('supplied properties not correct for "ChannelTargetInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.ChannelTargetInfo` resource
 *
 * @param properties - the TypeScript properties of a `ChannelTargetInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.ChannelTargetInfo` resource.
 */
// @ts-ignore TS6133
function cfnContactChannelTargetInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContact_ChannelTargetInfoPropertyValidator(properties).assertSuccess();
    return {
        ChannelId: cdk.stringToCloudFormation(properties.channelId),
        RetryIntervalInMinutes: cdk.numberToCloudFormation(properties.retryIntervalInMinutes),
    };
}

// @ts-ignore TS6133
function CfnContactChannelTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.ChannelTargetInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.ChannelTargetInfoProperty>();
    ret.addPropertyResult('channelId', 'ChannelId', cfn_parse.FromCloudFormation.getString(properties.ChannelId));
    ret.addPropertyResult('retryIntervalInMinutes', 'RetryIntervalInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.RetryIntervalInMinutes));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContact {
    /**
     * The contact that Incident Manager is engaging during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html
     */
    export interface ContactTargetInfoProperty {
        /**
         * The Amazon Resource Name (ARN) of the contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-contactid
         */
        readonly contactId: string;
        /**
         * A Boolean value determining if the contact's acknowledgement stops the progress of stages in the plan.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-isessential
         */
        readonly isEssential: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ContactTargetInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ContactTargetInfoProperty`
 *
 * @returns the result of the validation.
 */
function CfnContact_ContactTargetInfoPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contactId', cdk.requiredValidator)(properties.contactId));
    errors.collect(cdk.propertyValidator('contactId', cdk.validateString)(properties.contactId));
    errors.collect(cdk.propertyValidator('isEssential', cdk.requiredValidator)(properties.isEssential));
    errors.collect(cdk.propertyValidator('isEssential', cdk.validateBoolean)(properties.isEssential));
    return errors.wrap('supplied properties not correct for "ContactTargetInfoProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.ContactTargetInfo` resource
 *
 * @param properties - the TypeScript properties of a `ContactTargetInfoProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.ContactTargetInfo` resource.
 */
// @ts-ignore TS6133
function cfnContactContactTargetInfoPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContact_ContactTargetInfoPropertyValidator(properties).assertSuccess();
    return {
        ContactId: cdk.stringToCloudFormation(properties.contactId),
        IsEssential: cdk.booleanToCloudFormation(properties.isEssential),
    };
}

// @ts-ignore TS6133
function CfnContactContactTargetInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.ContactTargetInfoProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.ContactTargetInfoProperty>();
    ret.addPropertyResult('contactId', 'ContactId', cfn_parse.FromCloudFormation.getString(properties.ContactId));
    ret.addPropertyResult('isEssential', 'IsEssential', cfn_parse.FromCloudFormation.getBoolean(properties.IsEssential));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContact {
    /**
     * The `Stage` property type specifies a set amount of time that an escalation plan or engagement plan engages the specified contacts or contact methods.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html
     */
    export interface StageProperty {
        /**
         * The time to wait until beginning the next stage. The duration can only be set to 0 if a target is specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-durationinminutes
         */
        readonly durationInMinutes: number;
        /**
         * The contacts or contact methods that the escalation plan or engagement plan is engaging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-targets
         */
        readonly targets?: Array<CfnContact.TargetsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StageProperty`
 *
 * @param properties - the TypeScript properties of a `StageProperty`
 *
 * @returns the result of the validation.
 */
function CfnContact_StagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('durationInMinutes', cdk.requiredValidator)(properties.durationInMinutes));
    errors.collect(cdk.propertyValidator('durationInMinutes', cdk.validateNumber)(properties.durationInMinutes));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnContact_TargetsPropertyValidator))(properties.targets));
    return errors.wrap('supplied properties not correct for "StageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.Stage` resource
 *
 * @param properties - the TypeScript properties of a `StageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.Stage` resource.
 */
// @ts-ignore TS6133
function cfnContactStagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContact_StagePropertyValidator(properties).assertSuccess();
    return {
        DurationInMinutes: cdk.numberToCloudFormation(properties.durationInMinutes),
        Targets: cdk.listMapper(cfnContactTargetsPropertyToCloudFormation)(properties.targets),
    };
}

// @ts-ignore TS6133
function CfnContactStagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.StageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.StageProperty>();
    ret.addPropertyResult('durationInMinutes', 'DurationInMinutes', cfn_parse.FromCloudFormation.getNumber(properties.DurationInMinutes));
    ret.addPropertyResult('targets', 'Targets', properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnContactTargetsPropertyFromCloudFormation)(properties.Targets) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnContact {
    /**
     * The contact or contact channel that's being engaged.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html
     */
    export interface TargetsProperty {
        /**
         * Information about the contact channel Incident Manager is engaging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-channeltargetinfo
         */
        readonly channelTargetInfo?: CfnContact.ChannelTargetInfoProperty | cdk.IResolvable;
        /**
         * The contact that Incident Manager is engaging during an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-contacttargetinfo
         */
        readonly contactTargetInfo?: CfnContact.ContactTargetInfoProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TargetsProperty`
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the result of the validation.
 */
function CfnContact_TargetsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelTargetInfo', CfnContact_ChannelTargetInfoPropertyValidator)(properties.channelTargetInfo));
    errors.collect(cdk.propertyValidator('contactTargetInfo', CfnContact_ContactTargetInfoPropertyValidator)(properties.contactTargetInfo));
    return errors.wrap('supplied properties not correct for "TargetsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.Targets` resource
 *
 * @param properties - the TypeScript properties of a `TargetsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::Contact.Targets` resource.
 */
// @ts-ignore TS6133
function cfnContactTargetsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContact_TargetsPropertyValidator(properties).assertSuccess();
    return {
        ChannelTargetInfo: cfnContactChannelTargetInfoPropertyToCloudFormation(properties.channelTargetInfo),
        ContactTargetInfo: cfnContactContactTargetInfoPropertyToCloudFormation(properties.contactTargetInfo),
    };
}

// @ts-ignore TS6133
function CfnContactTargetsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContact.TargetsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContact.TargetsProperty>();
    ret.addPropertyResult('channelTargetInfo', 'ChannelTargetInfo', properties.ChannelTargetInfo != null ? CfnContactChannelTargetInfoPropertyFromCloudFormation(properties.ChannelTargetInfo) : undefined);
    ret.addPropertyResult('contactTargetInfo', 'ContactTargetInfo', properties.ContactTargetInfo != null ? CfnContactContactTargetInfoPropertyFromCloudFormation(properties.ContactTargetInfo) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnContactChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export interface CfnContactChannelProps {

    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeladdress
     */
    readonly channelAddress: string;

    /**
     * The name of the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channelname
     */
    readonly channelName: string;

    /**
     * The type of the contact channel. Incident Manager supports three contact methods:
     *
     * - SMS
     * - VOICE
     * - EMAIL
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeltype
     */
    readonly channelType: string;

    /**
     * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-contactid
     */
    readonly contactId: string;

    /**
     * If you want to activate the channel at a later time, you can choose to defer activation. Incident Manager can't engage your contact channel until it has been activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-deferactivation
     */
    readonly deferActivation?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnContactChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnContactChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelAddress', cdk.requiredValidator)(properties.channelAddress));
    errors.collect(cdk.propertyValidator('channelAddress', cdk.validateString)(properties.channelAddress));
    errors.collect(cdk.propertyValidator('channelName', cdk.requiredValidator)(properties.channelName));
    errors.collect(cdk.propertyValidator('channelName', cdk.validateString)(properties.channelName));
    errors.collect(cdk.propertyValidator('channelType', cdk.requiredValidator)(properties.channelType));
    errors.collect(cdk.propertyValidator('channelType', cdk.validateString)(properties.channelType));
    errors.collect(cdk.propertyValidator('contactId', cdk.requiredValidator)(properties.contactId));
    errors.collect(cdk.propertyValidator('contactId', cdk.validateString)(properties.contactId));
    errors.collect(cdk.propertyValidator('deferActivation', cdk.validateBoolean)(properties.deferActivation));
    return errors.wrap('supplied properties not correct for "CfnContactChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SSMContacts::ContactChannel` resource
 *
 * @param properties - the TypeScript properties of a `CfnContactChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SSMContacts::ContactChannel` resource.
 */
// @ts-ignore TS6133
function cfnContactChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnContactChannelPropsValidator(properties).assertSuccess();
    return {
        ChannelAddress: cdk.stringToCloudFormation(properties.channelAddress),
        ChannelName: cdk.stringToCloudFormation(properties.channelName),
        ChannelType: cdk.stringToCloudFormation(properties.channelType),
        ContactId: cdk.stringToCloudFormation(properties.contactId),
        DeferActivation: cdk.booleanToCloudFormation(properties.deferActivation),
    };
}

// @ts-ignore TS6133
function CfnContactChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactChannelProps>();
    ret.addPropertyResult('channelAddress', 'ChannelAddress', cfn_parse.FromCloudFormation.getString(properties.ChannelAddress));
    ret.addPropertyResult('channelName', 'ChannelName', cfn_parse.FromCloudFormation.getString(properties.ChannelName));
    ret.addPropertyResult('channelType', 'ChannelType', cfn_parse.FromCloudFormation.getString(properties.ChannelType));
    ret.addPropertyResult('contactId', 'ContactId', cfn_parse.FromCloudFormation.getString(properties.ContactId));
    ret.addPropertyResult('deferActivation', 'DeferActivation', properties.DeferActivation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeferActivation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SSMContacts::ContactChannel`
 *
 * The `AWS::SSMContacts::ContactChannel` resource specifies a contact channel as the method that Incident Manager uses to engage your contact.
 *
 * @cloudformationResource AWS::SSMContacts::ContactChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export class CfnContactChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMContacts::ContactChannel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnContactChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnContactChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the `ContactChannel` resource.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeladdress
     */
    public channelAddress: string;

    /**
     * The name of the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channelname
     */
    public channelName: string;

    /**
     * The type of the contact channel. Incident Manager supports three contact methods:
     *
     * - SMS
     * - VOICE
     * - EMAIL
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeltype
     */
    public channelType: string;

    /**
     * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-contactid
     */
    public contactId: string;

    /**
     * If you want to activate the channel at a later time, you can choose to defer activation. Incident Manager can't engage your contact channel until it has been activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-deferactivation
     */
    public deferActivation: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::SSMContacts::ContactChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactChannelProps) {
        super(scope, id, { type: CfnContactChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'channelAddress', this);
        cdk.requireProperty(props, 'channelName', this);
        cdk.requireProperty(props, 'channelType', this);
        cdk.requireProperty(props, 'contactId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.channelAddress = props.channelAddress;
        this.channelName = props.channelName;
        this.channelType = props.channelType;
        this.contactId = props.contactId;
        this.deferActivation = props.deferActivation;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            channelAddress: this.channelAddress,
            channelName: this.channelName,
            channelType: this.channelType,
            contactId: this.contactId,
            deferActivation: this.deferActivation,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnContactChannelPropsToCloudFormation(props);
    }
}
