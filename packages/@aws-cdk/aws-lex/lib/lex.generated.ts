// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:52:58.508Z","fingerprint":"jQW80yVDxHMTo3gwDl+c+BISq//AQ+s98ZcVF8B9z9A="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnBot`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html
 */
export interface CfnBotProps {

    /**
     * Provides information on additional privacy protections Amazon Lex should use with the bot's data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-dataprivacy
     */
    readonly dataPrivacy: any | cdk.IResolvable;

    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.
     *
     * A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout.
     *
     * You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-idlesessionttlinseconds
     */
    readonly idleSessionTtlInSeconds: number;

    /**
     * The name of the field to filter the list of bots.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-name
     */
    readonly name: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-rolearn
     */
    readonly roleArn: string;

    /**
     * Indicates whether Amazon Lex V2 should automatically build the locales for the bot after a change.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-autobuildbotlocales
     */
    readonly autoBuildBotLocales?: boolean | cdk.IResolvable;

    /**
     * The Amazon S3 location of files used to import a bot. The files must be in the import format specified in [JSON format for importing and exporting](https://docs.aws.amazon.com/lexv2/latest/dg/import-export-format.html) in the *Amazon Lex developer guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botfiles3location
     */
    readonly botFileS3Location?: CfnBot.S3LocationProperty | cdk.IResolvable;

    /**
     * A list of locales for the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botlocales
     */
    readonly botLocales?: Array<CfnBot.BotLocaleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of tags to add to the bot. You can only add tags when you import a bot. You can't use the `UpdateBot` operation to update tags. To update tags, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-bottags
     */
    readonly botTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-description
     */
    readonly description?: string;

    /**
     * Specifies configuration settings for the alias used to test the bot. If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliassettings
     */
    readonly testBotAliasSettings?: CfnBot.TestBotAliasSettingsProperty | cdk.IResolvable;

    /**
     * A list of tags to add to the test alias for a bot. You can only add tags when you import a bot. You can't use the `UpdateAlias` operation to update tags. To update tags on the test alias, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliastags
     */
    readonly testBotAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBotProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotProps`
 *
 * @returns the result of the validation.
 */
function CfnBotPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('autoBuildBotLocales', cdk.validateBoolean)(properties.autoBuildBotLocales));
    errors.collect(cdk.propertyValidator('botFileS3Location', CfnBot_S3LocationPropertyValidator)(properties.botFileS3Location));
    errors.collect(cdk.propertyValidator('botLocales', cdk.listValidator(CfnBot_BotLocalePropertyValidator))(properties.botLocales));
    errors.collect(cdk.propertyValidator('botTags', cdk.listValidator(cdk.validateCfnTag))(properties.botTags));
    errors.collect(cdk.propertyValidator('dataPrivacy', cdk.requiredValidator)(properties.dataPrivacy));
    errors.collect(cdk.propertyValidator('dataPrivacy', cdk.validateObject)(properties.dataPrivacy));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('idleSessionTtlInSeconds', cdk.requiredValidator)(properties.idleSessionTtlInSeconds));
    errors.collect(cdk.propertyValidator('idleSessionTtlInSeconds', cdk.validateNumber)(properties.idleSessionTtlInSeconds));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('testBotAliasSettings', CfnBot_TestBotAliasSettingsPropertyValidator)(properties.testBotAliasSettings));
    errors.collect(cdk.propertyValidator('testBotAliasTags', cdk.listValidator(cdk.validateCfnTag))(properties.testBotAliasTags));
    return errors.wrap('supplied properties not correct for "CfnBotProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot` resource
 *
 * @param properties - the TypeScript properties of a `CfnBotProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot` resource.
 */
// @ts-ignore TS6133
function cfnBotPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotPropsValidator(properties).assertSuccess();
    return {
        DataPrivacy: cdk.objectToCloudFormation(properties.dataPrivacy),
        IdleSessionTTLInSeconds: cdk.numberToCloudFormation(properties.idleSessionTtlInSeconds),
        Name: cdk.stringToCloudFormation(properties.name),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        AutoBuildBotLocales: cdk.booleanToCloudFormation(properties.autoBuildBotLocales),
        BotFileS3Location: cfnBotS3LocationPropertyToCloudFormation(properties.botFileS3Location),
        BotLocales: cdk.listMapper(cfnBotBotLocalePropertyToCloudFormation)(properties.botLocales),
        BotTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.botTags),
        Description: cdk.stringToCloudFormation(properties.description),
        TestBotAliasSettings: cfnBotTestBotAliasSettingsPropertyToCloudFormation(properties.testBotAliasSettings),
        TestBotAliasTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.testBotAliasTags),
    };
}

// @ts-ignore TS6133
function CfnBotPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotProps>();
    ret.addPropertyResult('dataPrivacy', 'DataPrivacy', cfn_parse.FromCloudFormation.getAny(properties.DataPrivacy));
    ret.addPropertyResult('idleSessionTtlInSeconds', 'IdleSessionTTLInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.IdleSessionTTLInSeconds));
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('autoBuildBotLocales', 'AutoBuildBotLocales', properties.AutoBuildBotLocales != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoBuildBotLocales) : undefined);
    ret.addPropertyResult('botFileS3Location', 'BotFileS3Location', properties.BotFileS3Location != null ? CfnBotS3LocationPropertyFromCloudFormation(properties.BotFileS3Location) : undefined);
    ret.addPropertyResult('botLocales', 'BotLocales', properties.BotLocales != null ? cfn_parse.FromCloudFormation.getArray(CfnBotBotLocalePropertyFromCloudFormation)(properties.BotLocales) : undefined);
    ret.addPropertyResult('botTags', 'BotTags', properties.BotTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.BotTags) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('testBotAliasSettings', 'TestBotAliasSettings', properties.TestBotAliasSettings != null ? CfnBotTestBotAliasSettingsPropertyFromCloudFormation(properties.TestBotAliasSettings) : undefined);
    ret.addPropertyResult('testBotAliasTags', 'TestBotAliasTags', properties.TestBotAliasTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TestBotAliasTags) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lex::Bot`
 *
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies an Amazon Lex conversational bot.
 *
 * You must configure an intent based on the AMAZON.FallbackIntent built-in intent. If you don't add one, creating the bot will fail.
 *
 * @cloudformationResource AWS::Lex::Bot
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html
 */
export class CfnBot extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::Bot";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBot {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBotPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBot(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the bot.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the bot.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Provides information on additional privacy protections Amazon Lex should use with the bot's data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-dataprivacy
     */
    public dataPrivacy: any | cdk.IResolvable;

    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.
     *
     * A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout.
     *
     * You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-idlesessionttlinseconds
     */
    public idleSessionTtlInSeconds: number;

    /**
     * The name of the field to filter the list of bots.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-name
     */
    public name: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-rolearn
     */
    public roleArn: string;

    /**
     * Indicates whether Amazon Lex V2 should automatically build the locales for the bot after a change.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-autobuildbotlocales
     */
    public autoBuildBotLocales: boolean | cdk.IResolvable | undefined;

    /**
     * The Amazon S3 location of files used to import a bot. The files must be in the import format specified in [JSON format for importing and exporting](https://docs.aws.amazon.com/lexv2/latest/dg/import-export-format.html) in the *Amazon Lex developer guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botfiles3location
     */
    public botFileS3Location: CfnBot.S3LocationProperty | cdk.IResolvable | undefined;

    /**
     * A list of locales for the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botlocales
     */
    public botLocales: Array<CfnBot.BotLocaleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A list of tags to add to the bot. You can only add tags when you import a bot. You can't use the `UpdateBot` operation to update tags. To update tags, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-bottags
     */
    public botTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-description
     */
    public description: string | undefined;

    /**
     * Specifies configuration settings for the alias used to test the bot. If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliassettings
     */
    public testBotAliasSettings: CfnBot.TestBotAliasSettingsProperty | cdk.IResolvable | undefined;

    /**
     * A list of tags to add to the test alias for a bot. You can only add tags when you import a bot. You can't use the `UpdateAlias` operation to update tags. To update tags on the test alias, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliastags
     */
    public testBotAliasTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lex::Bot`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotProps) {
        super(scope, id, { type: CfnBot.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'dataPrivacy', this);
        cdk.requireProperty(props, 'idleSessionTtlInSeconds', this);
        cdk.requireProperty(props, 'name', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));

        this.dataPrivacy = props.dataPrivacy;
        this.idleSessionTtlInSeconds = props.idleSessionTtlInSeconds;
        this.name = props.name;
        this.roleArn = props.roleArn;
        this.autoBuildBotLocales = props.autoBuildBotLocales;
        this.botFileS3Location = props.botFileS3Location;
        this.botLocales = props.botLocales;
        this.botTags = props.botTags;
        this.description = props.description;
        this.testBotAliasSettings = props.testBotAliasSettings;
        this.testBotAliasTags = props.testBotAliasTags;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBot.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            dataPrivacy: this.dataPrivacy,
            idleSessionTtlInSeconds: this.idleSessionTtlInSeconds,
            name: this.name,
            roleArn: this.roleArn,
            autoBuildBotLocales: this.autoBuildBotLocales,
            botFileS3Location: this.botFileS3Location,
            botLocales: this.botLocales,
            botTags: this.botTags,
            description: this.description,
            testBotAliasSettings: this.testBotAliasSettings,
            testBotAliasTags: this.testBotAliasTags,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBotPropsToCloudFormation(props);
    }
}

export namespace CfnBot {
    /**
     * Specifies settings that enable advanced audio recognition for slot values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html
     */
    export interface AdvancedRecognitionSettingProperty {
        /**
         * Specifies that Amazon Lex should use slot values as a custom vocabulary when recognizing user utterances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html#cfn-lex-bot-advancedrecognitionsetting-audiorecognitionstrategy
         */
        readonly audioRecognitionStrategy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AdvancedRecognitionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedRecognitionSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AdvancedRecognitionSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioRecognitionStrategy', cdk.validateString)(properties.audioRecognitionStrategy));
    return errors.wrap('supplied properties not correct for "AdvancedRecognitionSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AdvancedRecognitionSetting` resource
 *
 * @param properties - the TypeScript properties of a `AdvancedRecognitionSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AdvancedRecognitionSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotAdvancedRecognitionSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AdvancedRecognitionSettingPropertyValidator(properties).assertSuccess();
    return {
        AudioRecognitionStrategy: cdk.stringToCloudFormation(properties.audioRecognitionStrategy),
    };
}

// @ts-ignore TS6133
function CfnBotAdvancedRecognitionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AdvancedRecognitionSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AdvancedRecognitionSettingProperty>();
    ret.addPropertyResult('audioRecognitionStrategy', 'AudioRecognitionStrategy', properties.AudioRecognitionStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AudioRecognitionStrategy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html
     */
    export interface AllowedInputTypesProperty {
        /**
         * `CfnBot.AllowedInputTypesProperty.AllowAudioInput`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html#cfn-lex-bot-allowedinputtypes-allowaudioinput
         */
        readonly allowAudioInput: boolean | cdk.IResolvable;
        /**
         * `CfnBot.AllowedInputTypesProperty.AllowDTMFInput`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html#cfn-lex-bot-allowedinputtypes-allowdtmfinput
         */
        readonly allowDtmfInput: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AllowedInputTypesProperty`
 *
 * @param properties - the TypeScript properties of a `AllowedInputTypesProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AllowedInputTypesPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowAudioInput', cdk.requiredValidator)(properties.allowAudioInput));
    errors.collect(cdk.propertyValidator('allowAudioInput', cdk.validateBoolean)(properties.allowAudioInput));
    errors.collect(cdk.propertyValidator('allowDtmfInput', cdk.requiredValidator)(properties.allowDtmfInput));
    errors.collect(cdk.propertyValidator('allowDtmfInput', cdk.validateBoolean)(properties.allowDtmfInput));
    return errors.wrap('supplied properties not correct for "AllowedInputTypesProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AllowedInputTypes` resource
 *
 * @param properties - the TypeScript properties of a `AllowedInputTypesProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AllowedInputTypes` resource.
 */
// @ts-ignore TS6133
function cfnBotAllowedInputTypesPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AllowedInputTypesPropertyValidator(properties).assertSuccess();
    return {
        AllowAudioInput: cdk.booleanToCloudFormation(properties.allowAudioInput),
        AllowDTMFInput: cdk.booleanToCloudFormation(properties.allowDtmfInput),
    };
}

// @ts-ignore TS6133
function CfnBotAllowedInputTypesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AllowedInputTypesProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AllowedInputTypesProperty>();
    ret.addPropertyResult('allowAudioInput', 'AllowAudioInput', cfn_parse.FromCloudFormation.getBoolean(properties.AllowAudioInput));
    ret.addPropertyResult('allowDtmfInput', 'AllowDTMFInput', cfn_parse.FromCloudFormation.getBoolean(properties.AllowDTMFInput));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html
     */
    export interface AudioAndDTMFInputSpecificationProperty {
        /**
         * `CfnBot.AudioAndDTMFInputSpecificationProperty.AudioSpecification`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-audiospecification
         */
        readonly audioSpecification?: CfnBot.AudioSpecificationProperty | cdk.IResolvable;
        /**
         * `CfnBot.AudioAndDTMFInputSpecificationProperty.DTMFSpecification`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-dtmfspecification
         */
        readonly dtmfSpecification?: CfnBot.DTMFSpecificationProperty | cdk.IResolvable;
        /**
         * `CfnBot.AudioAndDTMFInputSpecificationProperty.StartTimeoutMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-starttimeoutms
         */
        readonly startTimeoutMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioAndDTMFInputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioAndDTMFInputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AudioAndDTMFInputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioSpecification', CfnBot_AudioSpecificationPropertyValidator)(properties.audioSpecification));
    errors.collect(cdk.propertyValidator('dtmfSpecification', CfnBot_DTMFSpecificationPropertyValidator)(properties.dtmfSpecification));
    errors.collect(cdk.propertyValidator('startTimeoutMs', cdk.requiredValidator)(properties.startTimeoutMs));
    errors.collect(cdk.propertyValidator('startTimeoutMs', cdk.validateNumber)(properties.startTimeoutMs));
    return errors.wrap('supplied properties not correct for "AudioAndDTMFInputSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioAndDTMFInputSpecification` resource
 *
 * @param properties - the TypeScript properties of a `AudioAndDTMFInputSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioAndDTMFInputSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotAudioAndDTMFInputSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AudioAndDTMFInputSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AudioSpecification: cfnBotAudioSpecificationPropertyToCloudFormation(properties.audioSpecification),
        DTMFSpecification: cfnBotDTMFSpecificationPropertyToCloudFormation(properties.dtmfSpecification),
        StartTimeoutMs: cdk.numberToCloudFormation(properties.startTimeoutMs),
    };
}

// @ts-ignore TS6133
function CfnBotAudioAndDTMFInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioAndDTMFInputSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioAndDTMFInputSpecificationProperty>();
    ret.addPropertyResult('audioSpecification', 'AudioSpecification', properties.AudioSpecification != null ? CfnBotAudioSpecificationPropertyFromCloudFormation(properties.AudioSpecification) : undefined);
    ret.addPropertyResult('dtmfSpecification', 'DTMFSpecification', properties.DTMFSpecification != null ? CfnBotDTMFSpecificationPropertyFromCloudFormation(properties.DTMFSpecification) : undefined);
    ret.addPropertyResult('startTimeoutMs', 'StartTimeoutMs', cfn_parse.FromCloudFormation.getNumber(properties.StartTimeoutMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the location of audio log files collected when conversation logging is enabled for a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html
     */
    export interface AudioLogDestinationProperty {
        /**
         * Specifies the Amazon S3 bucket where the audio files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html#cfn-lex-bot-audiologdestination-s3bucket
         */
        readonly s3Bucket: CfnBot.S3BucketLogDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AudioLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', CfnBot_S3BucketLogDestinationPropertyValidator)(properties.s3Bucket));
    return errors.wrap('supplied properties not correct for "AudioLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotAudioLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AudioLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cfnBotS3BucketLogDestinationPropertyToCloudFormation(properties.s3Bucket),
    };
}

// @ts-ignore TS6133
function CfnBotAudioLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioLogDestinationProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', CfnBotS3BucketLogDestinationPropertyFromCloudFormation(properties.S3Bucket));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies settings for logging the audio of conversations between Amazon Lex and a user. You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html
     */
    export interface AudioLogSettingProperty {
        /**
         * Specifies the location of the audio log files collected when conversation logging is enabled for a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html#cfn-lex-bot-audiologsetting-destination
         */
        readonly destination: CfnBot.AudioLogDestinationProperty | cdk.IResolvable;
        /**
         * Specifies whether audio logging is enabled for the bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html#cfn-lex-bot-audiologsetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AudioLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBot_AudioLogDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "AudioLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotAudioLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AudioLogSettingPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBotAudioLogDestinationPropertyToCloudFormation(properties.destination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotAudioLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioLogSettingProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBotAudioLogDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html
     */
    export interface AudioSpecificationProperty {
        /**
         * `CfnBot.AudioSpecificationProperty.EndTimeoutMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html#cfn-lex-bot-audiospecification-endtimeoutms
         */
        readonly endTimeoutMs: number;
        /**
         * `CfnBot.AudioSpecificationProperty.MaxLengthMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html#cfn-lex-bot-audiospecification-maxlengthms
         */
        readonly maxLengthMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_AudioSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endTimeoutMs', cdk.requiredValidator)(properties.endTimeoutMs));
    errors.collect(cdk.propertyValidator('endTimeoutMs', cdk.validateNumber)(properties.endTimeoutMs));
    errors.collect(cdk.propertyValidator('maxLengthMs', cdk.requiredValidator)(properties.maxLengthMs));
    errors.collect(cdk.propertyValidator('maxLengthMs', cdk.validateNumber)(properties.maxLengthMs));
    return errors.wrap('supplied properties not correct for "AudioSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioSpecification` resource
 *
 * @param properties - the TypeScript properties of a `AudioSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.AudioSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotAudioSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_AudioSpecificationPropertyValidator(properties).assertSuccess();
    return {
        EndTimeoutMs: cdk.numberToCloudFormation(properties.endTimeoutMs),
        MaxLengthMs: cdk.numberToCloudFormation(properties.maxLengthMs),
    };
}

// @ts-ignore TS6133
function CfnBotAudioSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioSpecificationProperty>();
    ret.addPropertyResult('endTimeoutMs', 'EndTimeoutMs', cfn_parse.FromCloudFormation.getNumber(properties.EndTimeoutMs));
    ret.addPropertyResult('maxLengthMs', 'MaxLengthMs', cfn_parse.FromCloudFormation.getNumber(properties.MaxLengthMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies settings that are unique to a locale. For example, you can use a different Lambda function for each locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html
     */
    export interface BotAliasLocaleSettingsProperty {
        /**
         * Specifies the Lambda function to use in this locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html#cfn-lex-bot-botaliaslocalesettings-codehookspecification
         */
        readonly codeHookSpecification?: CfnBot.CodeHookSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies whether the locale is enabled for the bot. If the value is false, the locale isn't available for use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html#cfn-lex-bot-botaliaslocalesettings-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_BotAliasLocaleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeHookSpecification', CfnBot_CodeHookSpecificationPropertyValidator)(properties.codeHookSpecification));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "BotAliasLocaleSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.BotAliasLocaleSettings` resource
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.BotAliasLocaleSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotBotAliasLocaleSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_BotAliasLocaleSettingsPropertyValidator(properties).assertSuccess();
    return {
        CodeHookSpecification: cfnBotCodeHookSpecificationPropertyToCloudFormation(properties.codeHookSpecification),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotAliasLocaleSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotAliasLocaleSettingsProperty>();
    ret.addPropertyResult('codeHookSpecification', 'CodeHookSpecification', properties.CodeHookSpecification != null ? CfnBotCodeHookSpecificationPropertyFromCloudFormation(properties.CodeHookSpecification) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies locale settings for a single locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html
     */
    export interface BotAliasLocaleSettingsItemProperty {
        /**
         * Specifies locale settings for a locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html#cfn-lex-bot-botaliaslocalesettingsitem-botaliaslocalesetting
         */
        readonly botAliasLocaleSetting: CfnBot.BotAliasLocaleSettingsProperty | cdk.IResolvable;
        /**
         * Specifies the locale that the settings apply to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html#cfn-lex-bot-botaliaslocalesettingsitem-localeid
         */
        readonly localeId: string;
    }
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsItemProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_BotAliasLocaleSettingsItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botAliasLocaleSetting', cdk.requiredValidator)(properties.botAliasLocaleSetting));
    errors.collect(cdk.propertyValidator('botAliasLocaleSetting', CfnBot_BotAliasLocaleSettingsPropertyValidator)(properties.botAliasLocaleSetting));
    errors.collect(cdk.propertyValidator('localeId', cdk.requiredValidator)(properties.localeId));
    errors.collect(cdk.propertyValidator('localeId', cdk.validateString)(properties.localeId));
    return errors.wrap('supplied properties not correct for "BotAliasLocaleSettingsItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.BotAliasLocaleSettingsItem` resource
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.BotAliasLocaleSettingsItem` resource.
 */
// @ts-ignore TS6133
function cfnBotBotAliasLocaleSettingsItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_BotAliasLocaleSettingsItemPropertyValidator(properties).assertSuccess();
    return {
        BotAliasLocaleSetting: cfnBotBotAliasLocaleSettingsPropertyToCloudFormation(properties.botAliasLocaleSetting),
        LocaleId: cdk.stringToCloudFormation(properties.localeId),
    };
}

// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotAliasLocaleSettingsItemProperty>();
    ret.addPropertyResult('botAliasLocaleSetting', 'BotAliasLocaleSetting', CfnBotBotAliasLocaleSettingsPropertyFromCloudFormation(properties.BotAliasLocaleSetting));
    ret.addPropertyResult('localeId', 'LocaleId', cfn_parse.FromCloudFormation.getString(properties.LocaleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides configuration information for a locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html
     */
    export interface BotLocaleProperty {
        /**
         * Specifies a custom vocabulary to use with a specific locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-customvocabulary
         */
        readonly customVocabulary?: CfnBot.CustomVocabularyProperty | cdk.IResolvable;
        /**
         * A description of the bot locale. Use this to help identify the bot locale in lists.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-description
         */
        readonly description?: string;
        /**
         * One or more intents defined for the locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-intents
         */
        readonly intents?: Array<CfnBot.IntentProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The identifier of the language and locale that the bot will be used in. The string must match one of the supported locales.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-localeid
         */
        readonly localeId: string;
        /**
         * Determines the threshold where Amazon Lex will insert the AMAZON.FallbackIntent, AMAZON.KendraSearchIntent, or both when returning alternative intents. You must configure an AMAZON.FallbackIntent. AMAZON.KendraSearchIntent is only inserted if it is configured for the bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-nluconfidencethreshold
         */
        readonly nluConfidenceThreshold: number;
        /**
         * One or more slot types defined for the locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-slottypes
         */
        readonly slotTypes?: Array<CfnBot.SlotTypeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Identifies the Amazon Polly voice used for audio interaction with the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-voicesettings
         */
        readonly voiceSettings?: CfnBot.VoiceSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BotLocaleProperty`
 *
 * @param properties - the TypeScript properties of a `BotLocaleProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_BotLocalePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customVocabulary', CfnBot_CustomVocabularyPropertyValidator)(properties.customVocabulary));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('intents', cdk.listValidator(CfnBot_IntentPropertyValidator))(properties.intents));
    errors.collect(cdk.propertyValidator('localeId', cdk.requiredValidator)(properties.localeId));
    errors.collect(cdk.propertyValidator('localeId', cdk.validateString)(properties.localeId));
    errors.collect(cdk.propertyValidator('nluConfidenceThreshold', cdk.requiredValidator)(properties.nluConfidenceThreshold));
    errors.collect(cdk.propertyValidator('nluConfidenceThreshold', cdk.validateNumber)(properties.nluConfidenceThreshold));
    errors.collect(cdk.propertyValidator('slotTypes', cdk.listValidator(CfnBot_SlotTypePropertyValidator))(properties.slotTypes));
    errors.collect(cdk.propertyValidator('voiceSettings', CfnBot_VoiceSettingsPropertyValidator)(properties.voiceSettings));
    return errors.wrap('supplied properties not correct for "BotLocaleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.BotLocale` resource
 *
 * @param properties - the TypeScript properties of a `BotLocaleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.BotLocale` resource.
 */
// @ts-ignore TS6133
function cfnBotBotLocalePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_BotLocalePropertyValidator(properties).assertSuccess();
    return {
        CustomVocabulary: cfnBotCustomVocabularyPropertyToCloudFormation(properties.customVocabulary),
        Description: cdk.stringToCloudFormation(properties.description),
        Intents: cdk.listMapper(cfnBotIntentPropertyToCloudFormation)(properties.intents),
        LocaleId: cdk.stringToCloudFormation(properties.localeId),
        NluConfidenceThreshold: cdk.numberToCloudFormation(properties.nluConfidenceThreshold),
        SlotTypes: cdk.listMapper(cfnBotSlotTypePropertyToCloudFormation)(properties.slotTypes),
        VoiceSettings: cfnBotVoiceSettingsPropertyToCloudFormation(properties.voiceSettings),
    };
}

// @ts-ignore TS6133
function CfnBotBotLocalePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotLocaleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotLocaleProperty>();
    ret.addPropertyResult('customVocabulary', 'CustomVocabulary', properties.CustomVocabulary != null ? CfnBotCustomVocabularyPropertyFromCloudFormation(properties.CustomVocabulary) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('intents', 'Intents', properties.Intents != null ? cfn_parse.FromCloudFormation.getArray(CfnBotIntentPropertyFromCloudFormation)(properties.Intents) : undefined);
    ret.addPropertyResult('localeId', 'LocaleId', cfn_parse.FromCloudFormation.getString(properties.LocaleId));
    ret.addPropertyResult('nluConfidenceThreshold', 'NluConfidenceThreshold', cfn_parse.FromCloudFormation.getNumber(properties.NluConfidenceThreshold));
    ret.addPropertyResult('slotTypes', 'SlotTypes', properties.SlotTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotTypePropertyFromCloudFormation)(properties.SlotTypes) : undefined);
    ret.addPropertyResult('voiceSettings', 'VoiceSettings', properties.VoiceSettings != null ? CfnBotVoiceSettingsPropertyFromCloudFormation(properties.VoiceSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Describes a button to use on a response card used to gather slot values from a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html
     */
    export interface ButtonProperty {
        /**
         * The text that appears on the button. Use this to tell the user the value that is returned when they choose this button.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html#cfn-lex-bot-button-text
         */
        readonly text: string;
        /**
         * The value returned to Amazon Lex when the user chooses this button. This must be one of the slot values configured for the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html#cfn-lex-bot-button-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `ButtonProperty`
 *
 * @param properties - the TypeScript properties of a `ButtonProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ButtonPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('text', cdk.requiredValidator)(properties.text));
    errors.collect(cdk.propertyValidator('text', cdk.validateString)(properties.text));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "ButtonProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.Button` resource
 *
 * @param properties - the TypeScript properties of a `ButtonProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.Button` resource.
 */
// @ts-ignore TS6133
function cfnBotButtonPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ButtonPropertyValidator(properties).assertSuccess();
    return {
        Text: cdk.stringToCloudFormation(properties.text),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBotButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ButtonProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ButtonProperty>();
    ret.addPropertyResult('text', 'Text', cfn_parse.FromCloudFormation.getString(properties.Text));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the Amazon CloudWatch Logs log group where text and metadata logs are delivered. The log group must exist before you enable logging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html
     */
    export interface CloudWatchLogGroupLogDestinationProperty {
        /**
         * Specifies the Amazon Resource Name (ARN) of the log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html#cfn-lex-bot-cloudwatchloggrouplogdestination-cloudwatchloggrouparn
         */
        readonly cloudWatchLogGroupArn: string;
        /**
         * Specifies the prefix of the log stream name within the log group that you specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html#cfn-lex-bot-cloudwatchloggrouplogdestination-logprefix
         */
        readonly logPrefix: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_CloudWatchLogGroupLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupArn', cdk.requiredValidator)(properties.cloudWatchLogGroupArn));
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupArn', cdk.validateString)(properties.cloudWatchLogGroupArn));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.requiredValidator)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.validateString)(properties.logPrefix));
    return errors.wrap('supplied properties not correct for "CloudWatchLogGroupLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.CloudWatchLogGroupLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.CloudWatchLogGroupLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_CloudWatchLogGroupLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogGroupArn: cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
        LogPrefix: cdk.stringToCloudFormation(properties.logPrefix),
    };
}

// @ts-ignore TS6133
function CfnBotCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CloudWatchLogGroupLogDestinationProperty>();
    ret.addPropertyResult('cloudWatchLogGroupArn', 'CloudWatchLogGroupArn', cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn));
    ret.addPropertyResult('logPrefix', 'LogPrefix', cfn_parse.FromCloudFormation.getString(properties.LogPrefix));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies information about code hooks that Amazon Lex calls during a conversation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html
     */
    export interface CodeHookSpecificationProperty {
        /**
         * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html#cfn-lex-bot-codehookspecification-lambdacodehook
         */
        readonly lambdaCodeHook: CfnBot.LambdaCodeHookProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CodeHookSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_CodeHookSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaCodeHook', cdk.requiredValidator)(properties.lambdaCodeHook));
    errors.collect(cdk.propertyValidator('lambdaCodeHook', CfnBot_LambdaCodeHookPropertyValidator)(properties.lambdaCodeHook));
    return errors.wrap('supplied properties not correct for "CodeHookSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.CodeHookSpecification` resource
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.CodeHookSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotCodeHookSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_CodeHookSpecificationPropertyValidator(properties).assertSuccess();
    return {
        LambdaCodeHook: cfnBotLambdaCodeHookPropertyToCloudFormation(properties.lambdaCodeHook),
    };
}

// @ts-ignore TS6133
function CfnBotCodeHookSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CodeHookSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CodeHookSpecificationProperty>();
    ret.addPropertyResult('lambdaCodeHook', 'LambdaCodeHook', CfnBotLambdaCodeHookPropertyFromCloudFormation(properties.LambdaCodeHook));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies settings that manage logging that saves audio, text, and metadata for the conversations with your users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html
     */
    export interface ConversationLogSettingsProperty {
        /**
         * Specifies the Amazon S3 settings for logging audio to an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html#cfn-lex-bot-conversationlogsettings-audiologsettings
         */
        readonly audioLogSettings?: Array<CfnBot.AudioLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies settings to enable text conversation logs. You specify the Amazon CloudWatch Logs log group and whether logs should be stored for an alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html#cfn-lex-bot-conversationlogsettings-textlogsettings
         */
        readonly textLogSettings?: Array<CfnBot.TextLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConversationLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ConversationLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioLogSettings', cdk.listValidator(CfnBot_AudioLogSettingPropertyValidator))(properties.audioLogSettings));
    errors.collect(cdk.propertyValidator('textLogSettings', cdk.listValidator(CfnBot_TextLogSettingPropertyValidator))(properties.textLogSettings));
    return errors.wrap('supplied properties not correct for "ConversationLogSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.ConversationLogSettings` resource
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.ConversationLogSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotConversationLogSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ConversationLogSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioLogSettings: cdk.listMapper(cfnBotAudioLogSettingPropertyToCloudFormation)(properties.audioLogSettings),
        TextLogSettings: cdk.listMapper(cfnBotTextLogSettingPropertyToCloudFormation)(properties.textLogSettings),
    };
}

// @ts-ignore TS6133
function CfnBotConversationLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ConversationLogSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ConversationLogSettingsProperty>();
    ret.addPropertyResult('audioLogSettings', 'AudioLogSettings', properties.AudioLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAudioLogSettingPropertyFromCloudFormation)(properties.AudioLogSettings) : undefined);
    ret.addPropertyResult('textLogSettings', 'TextLogSettings', properties.TextLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotTextLogSettingPropertyFromCloudFormation)(properties.TextLogSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * A custom response string that Amazon Lex sends to your application. You define the content and structure of the string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html
     */
    export interface CustomPayloadProperty {
        /**
         * The string that is sent to your application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html#cfn-lex-bot-custompayload-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `CustomPayloadProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPayloadProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_CustomPayloadPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "CustomPayloadProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomPayload` resource
 *
 * @param properties - the TypeScript properties of a `CustomPayloadProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomPayload` resource.
 */
// @ts-ignore TS6133
function cfnBotCustomPayloadPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_CustomPayloadPropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBotCustomPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomPayloadProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomPayloadProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies a custom vocabulary. A custom vocabulary is a list of words that you expect to be used during a conversation with your bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html
     */
    export interface CustomVocabularyProperty {
        /**
         * Specifies a list of words that you expect to be used during a conversation with your bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html#cfn-lex-bot-customvocabulary-customvocabularyitems
         */
        readonly customVocabularyItems: Array<CfnBot.CustomVocabularyItemProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CustomVocabularyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_CustomVocabularyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customVocabularyItems', cdk.requiredValidator)(properties.customVocabularyItems));
    errors.collect(cdk.propertyValidator('customVocabularyItems', cdk.listValidator(CfnBot_CustomVocabularyItemPropertyValidator))(properties.customVocabularyItems));
    return errors.wrap('supplied properties not correct for "CustomVocabularyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomVocabulary` resource
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomVocabulary` resource.
 */
// @ts-ignore TS6133
function cfnBotCustomVocabularyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_CustomVocabularyPropertyValidator(properties).assertSuccess();
    return {
        CustomVocabularyItems: cdk.listMapper(cfnBotCustomVocabularyItemPropertyToCloudFormation)(properties.customVocabularyItems),
    };
}

// @ts-ignore TS6133
function CfnBotCustomVocabularyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomVocabularyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomVocabularyProperty>();
    ret.addPropertyResult('customVocabularyItems', 'CustomVocabularyItems', cfn_parse.FromCloudFormation.getArray(CfnBotCustomVocabularyItemPropertyFromCloudFormation)(properties.CustomVocabularyItems));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies an entry in a custom vocabulary.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html
     */
    export interface CustomVocabularyItemProperty {
        /**
         * Specifies 1 - 4 words that should be recognized.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html#cfn-lex-bot-customvocabularyitem-phrase
         */
        readonly phrase: string;
        /**
         * Specifies the degree to which the phrase recognition is boosted. The default value is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html#cfn-lex-bot-customvocabularyitem-weight
         */
        readonly weight?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CustomVocabularyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_CustomVocabularyItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('phrase', cdk.requiredValidator)(properties.phrase));
    errors.collect(cdk.propertyValidator('phrase', cdk.validateString)(properties.phrase));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "CustomVocabularyItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomVocabularyItem` resource
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.CustomVocabularyItem` resource.
 */
// @ts-ignore TS6133
function cfnBotCustomVocabularyItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_CustomVocabularyItemPropertyValidator(properties).assertSuccess();
    return {
        Phrase: cdk.stringToCloudFormation(properties.phrase),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnBotCustomVocabularyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomVocabularyItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomVocabularyItemProperty>();
    ret.addPropertyResult('phrase', 'Phrase', cfn_parse.FromCloudFormation.getString(properties.Phrase));
    ret.addPropertyResult('weight', 'Weight', properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html
     */
    export interface DTMFSpecificationProperty {
        /**
         * `CfnBot.DTMFSpecificationProperty.DeletionCharacter`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-deletioncharacter
         */
        readonly deletionCharacter: string;
        /**
         * `CfnBot.DTMFSpecificationProperty.EndCharacter`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-endcharacter
         */
        readonly endCharacter: string;
        /**
         * `CfnBot.DTMFSpecificationProperty.EndTimeoutMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-endtimeoutms
         */
        readonly endTimeoutMs: number;
        /**
         * `CfnBot.DTMFSpecificationProperty.MaxLength`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-maxlength
         */
        readonly maxLength: number;
    }
}

/**
 * Determine whether the given properties match those of a `DTMFSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `DTMFSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_DTMFSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deletionCharacter', cdk.requiredValidator)(properties.deletionCharacter));
    errors.collect(cdk.propertyValidator('deletionCharacter', cdk.validateString)(properties.deletionCharacter));
    errors.collect(cdk.propertyValidator('endCharacter', cdk.requiredValidator)(properties.endCharacter));
    errors.collect(cdk.propertyValidator('endCharacter', cdk.validateString)(properties.endCharacter));
    errors.collect(cdk.propertyValidator('endTimeoutMs', cdk.requiredValidator)(properties.endTimeoutMs));
    errors.collect(cdk.propertyValidator('endTimeoutMs', cdk.validateNumber)(properties.endTimeoutMs));
    errors.collect(cdk.propertyValidator('maxLength', cdk.requiredValidator)(properties.maxLength));
    errors.collect(cdk.propertyValidator('maxLength', cdk.validateNumber)(properties.maxLength));
    return errors.wrap('supplied properties not correct for "DTMFSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.DTMFSpecification` resource
 *
 * @param properties - the TypeScript properties of a `DTMFSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.DTMFSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotDTMFSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_DTMFSpecificationPropertyValidator(properties).assertSuccess();
    return {
        DeletionCharacter: cdk.stringToCloudFormation(properties.deletionCharacter),
        EndCharacter: cdk.stringToCloudFormation(properties.endCharacter),
        EndTimeoutMs: cdk.numberToCloudFormation(properties.endTimeoutMs),
        MaxLength: cdk.numberToCloudFormation(properties.maxLength),
    };
}

// @ts-ignore TS6133
function CfnBotDTMFSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DTMFSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DTMFSpecificationProperty>();
    ret.addPropertyResult('deletionCharacter', 'DeletionCharacter', cfn_parse.FromCloudFormation.getString(properties.DeletionCharacter));
    ret.addPropertyResult('endCharacter', 'EndCharacter', cfn_parse.FromCloudFormation.getString(properties.EndCharacter));
    ret.addPropertyResult('endTimeoutMs', 'EndTimeoutMs', cfn_parse.FromCloudFormation.getNumber(properties.EndTimeoutMs));
    ret.addPropertyResult('maxLength', 'MaxLength', cfn_parse.FromCloudFormation.getNumber(properties.MaxLength));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html
     */
    export interface DataPrivacyProperty {
        /**
         * `CfnBot.DataPrivacyProperty.ChildDirected`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html#cfn-lex-bot-dataprivacy-childdirected
         */
        readonly childDirected: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DataPrivacyProperty`
 *
 * @param properties - the TypeScript properties of a `DataPrivacyProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_DataPrivacyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('childDirected', cdk.requiredValidator)(properties.childDirected));
    errors.collect(cdk.propertyValidator('childDirected', cdk.validateBoolean)(properties.childDirected));
    return errors.wrap('supplied properties not correct for "DataPrivacyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.DataPrivacy` resource
 *
 * @param properties - the TypeScript properties of a `DataPrivacyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.DataPrivacy` resource.
 */
// @ts-ignore TS6133
function cfnBotDataPrivacyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_DataPrivacyPropertyValidator(properties).assertSuccess();
    return {
        ChildDirected: cdk.booleanToCloudFormation(properties.childDirected),
    };
}

// @ts-ignore TS6133
function CfnBotDataPrivacyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DataPrivacyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DataPrivacyProperty>();
    ret.addPropertyResult('childDirected', 'ChildDirected', cfn_parse.FromCloudFormation.getBoolean(properties.ChildDirected));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies whether an intent uses the dialog code hook during conversations with a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html
     */
    export interface DialogCodeHookSettingProperty {
        /**
         * Indicates whether an intent uses the dialog code hook during a conversation with a user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html#cfn-lex-bot-dialogcodehooksetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DialogCodeHookSettingProperty`
 *
 * @param properties - the TypeScript properties of a `DialogCodeHookSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_DialogCodeHookSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "DialogCodeHookSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.DialogCodeHookSetting` resource
 *
 * @param properties - the TypeScript properties of a `DialogCodeHookSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.DialogCodeHookSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotDialogCodeHookSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_DialogCodeHookSettingPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotDialogCodeHookSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DialogCodeHookSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DialogCodeHookSettingProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides information about the external source of the slot type's definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html
     */
    export interface ExternalSourceSettingProperty {
        /**
         * Settings required for a slot type based on a grammar that you provide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html#cfn-lex-bot-externalsourcesetting-grammarslottypesetting
         */
        readonly grammarSlotTypeSetting?: CfnBot.GrammarSlotTypeSettingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ExternalSourceSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ExternalSourceSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ExternalSourceSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grammarSlotTypeSetting', CfnBot_GrammarSlotTypeSettingPropertyValidator)(properties.grammarSlotTypeSetting));
    return errors.wrap('supplied properties not correct for "ExternalSourceSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.ExternalSourceSetting` resource
 *
 * @param properties - the TypeScript properties of a `ExternalSourceSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.ExternalSourceSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotExternalSourceSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ExternalSourceSettingPropertyValidator(properties).assertSuccess();
    return {
        GrammarSlotTypeSetting: cfnBotGrammarSlotTypeSettingPropertyToCloudFormation(properties.grammarSlotTypeSetting),
    };
}

// @ts-ignore TS6133
function CfnBotExternalSourceSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ExternalSourceSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ExternalSourceSettingProperty>();
    ret.addPropertyResult('grammarSlotTypeSetting', 'GrammarSlotTypeSetting', properties.GrammarSlotTypeSetting != null ? CfnBotGrammarSlotTypeSettingPropertyFromCloudFormation(properties.GrammarSlotTypeSetting) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Determines if a Lambda function should be invoked for a specific intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html
     */
    export interface FulfillmentCodeHookSettingProperty {
        /**
         * Indicates whether a Lambda function should be invoked for fulfill a specific intent.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * Provides settings for update messages sent to the user for long-running Lambda fulfillment functions. Fulfillment updates can be used only with streaming conversations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-fulfillmentupdatesspecification
         */
        readonly fulfillmentUpdatesSpecification?: CfnBot.FulfillmentUpdatesSpecificationProperty | cdk.IResolvable;
        /**
         * Provides settings for messages sent to the user for after the Lambda fulfillment function completes. Post-fulfillment messages can be sent for both streaming and non-streaming conversations.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-postfulfillmentstatusspecification
         */
        readonly postFulfillmentStatusSpecification?: CfnBot.PostFulfillmentStatusSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FulfillmentCodeHookSettingProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentCodeHookSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_FulfillmentCodeHookSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    errors.collect(cdk.propertyValidator('fulfillmentUpdatesSpecification', CfnBot_FulfillmentUpdatesSpecificationPropertyValidator)(properties.fulfillmentUpdatesSpecification));
    errors.collect(cdk.propertyValidator('postFulfillmentStatusSpecification', CfnBot_PostFulfillmentStatusSpecificationPropertyValidator)(properties.postFulfillmentStatusSpecification));
    return errors.wrap('supplied properties not correct for "FulfillmentCodeHookSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentCodeHookSetting` resource
 *
 * @param properties - the TypeScript properties of a `FulfillmentCodeHookSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentCodeHookSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotFulfillmentCodeHookSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_FulfillmentCodeHookSettingPropertyValidator(properties).assertSuccess();
    return {
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
        FulfillmentUpdatesSpecification: cfnBotFulfillmentUpdatesSpecificationPropertyToCloudFormation(properties.fulfillmentUpdatesSpecification),
        PostFulfillmentStatusSpecification: cfnBotPostFulfillmentStatusSpecificationPropertyToCloudFormation(properties.postFulfillmentStatusSpecification),
    };
}

// @ts-ignore TS6133
function CfnBotFulfillmentCodeHookSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentCodeHookSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentCodeHookSettingProperty>();
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addPropertyResult('fulfillmentUpdatesSpecification', 'FulfillmentUpdatesSpecification', properties.FulfillmentUpdatesSpecification != null ? CfnBotFulfillmentUpdatesSpecificationPropertyFromCloudFormation(properties.FulfillmentUpdatesSpecification) : undefined);
    ret.addPropertyResult('postFulfillmentStatusSpecification', 'PostFulfillmentStatusSpecification', properties.PostFulfillmentStatusSpecification != null ? CfnBotPostFulfillmentStatusSpecificationPropertyFromCloudFormation(properties.PostFulfillmentStatusSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides settings for a message that is sent to the user when a fulfillment Lambda function starts running.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html
     */
    export interface FulfillmentStartResponseSpecificationProperty {
        /**
         * Determines whether the user can interrupt the start message while it is playing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * The delay between when the Lambda fulfillment function starts running and the start message is played. If the Lambda function returns before the delay is over, the start message isn't played.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-delayinseconds
         */
        readonly delayInSeconds: number;
        /**
         * One to 5 message groups that contain start messages. Amazon Lex chooses one of the messages to play to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-messagegroups
         */
        readonly messageGroups: Array<CfnBot.MessageGroupProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FulfillmentStartResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentStartResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_FulfillmentStartResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('delayInSeconds', cdk.requiredValidator)(properties.delayInSeconds));
    errors.collect(cdk.propertyValidator('delayInSeconds', cdk.validateNumber)(properties.delayInSeconds));
    errors.collect(cdk.propertyValidator('messageGroups', cdk.requiredValidator)(properties.messageGroups));
    errors.collect(cdk.propertyValidator('messageGroups', cdk.listValidator(CfnBot_MessageGroupPropertyValidator))(properties.messageGroups));
    return errors.wrap('supplied properties not correct for "FulfillmentStartResponseSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentStartResponseSpecification` resource
 *
 * @param properties - the TypeScript properties of a `FulfillmentStartResponseSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentStartResponseSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotFulfillmentStartResponseSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_FulfillmentStartResponseSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        DelayInSeconds: cdk.numberToCloudFormation(properties.delayInSeconds),
        MessageGroups: cdk.listMapper(cfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroups),
    };
}

// @ts-ignore TS6133
function CfnBotFulfillmentStartResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentStartResponseSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentStartResponseSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('delayInSeconds', 'DelayInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.DelayInSeconds));
    ret.addPropertyResult('messageGroups', 'MessageGroups', cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroups));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides information for updating the user on the progress of fulfilling an intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html
     */
    export interface FulfillmentUpdateResponseSpecificationProperty {
        /**
         * Determines whether the user can interrupt an update message while it is playing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * The frequency that a message is sent to the user. When the period ends, Amazon Lex chooses a message from the message groups and plays it to the user. If the fulfillment Lambda function returns before the first period ends, an update message is not played to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-frequencyinseconds
         */
        readonly frequencyInSeconds: number;
        /**
         * One to 5 message groups that contain update messages. Amazon Lex chooses one of the messages to play to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-messagegroups
         */
        readonly messageGroups: Array<CfnBot.MessageGroupProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FulfillmentUpdateResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdateResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_FulfillmentUpdateResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('frequencyInSeconds', cdk.requiredValidator)(properties.frequencyInSeconds));
    errors.collect(cdk.propertyValidator('frequencyInSeconds', cdk.validateNumber)(properties.frequencyInSeconds));
    errors.collect(cdk.propertyValidator('messageGroups', cdk.requiredValidator)(properties.messageGroups));
    errors.collect(cdk.propertyValidator('messageGroups', cdk.listValidator(CfnBot_MessageGroupPropertyValidator))(properties.messageGroups));
    return errors.wrap('supplied properties not correct for "FulfillmentUpdateResponseSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentUpdateResponseSpecification` resource
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdateResponseSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentUpdateResponseSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotFulfillmentUpdateResponseSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_FulfillmentUpdateResponseSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        FrequencyInSeconds: cdk.numberToCloudFormation(properties.frequencyInSeconds),
        MessageGroups: cdk.listMapper(cfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroups),
    };
}

// @ts-ignore TS6133
function CfnBotFulfillmentUpdateResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentUpdateResponseSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentUpdateResponseSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('frequencyInSeconds', 'FrequencyInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.FrequencyInSeconds));
    ret.addPropertyResult('messageGroups', 'MessageGroups', cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroups));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides information for updating the user on the progress of fulfilling an intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html
     */
    export interface FulfillmentUpdatesSpecificationProperty {
        /**
         * Determines whether fulfillment updates are sent to the user. When this field is true, updates are sent.
         *
         * If the active field is set to true, the `startResponse` , `updateResponse` , and `timeoutInSeconds` fields are required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-active
         */
        readonly active: boolean | cdk.IResolvable;
        /**
         * Provides configuration information for the message sent to users when the fulfillment Lambda functions starts running.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-startresponse
         */
        readonly startResponse?: CfnBot.FulfillmentStartResponseSpecificationProperty | cdk.IResolvable;
        /**
         * The length of time that the fulfillment Lambda function should run before it times out.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-timeoutinseconds
         */
        readonly timeoutInSeconds?: number;
        /**
         * Provides configuration information for messages sent periodically to the user while the fulfillment Lambda function is running.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-updateresponse
         */
        readonly updateResponse?: CfnBot.FulfillmentUpdateResponseSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FulfillmentUpdatesSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdatesSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_FulfillmentUpdatesSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('active', cdk.requiredValidator)(properties.active));
    errors.collect(cdk.propertyValidator('active', cdk.validateBoolean)(properties.active));
    errors.collect(cdk.propertyValidator('startResponse', CfnBot_FulfillmentStartResponseSpecificationPropertyValidator)(properties.startResponse));
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.validateNumber)(properties.timeoutInSeconds));
    errors.collect(cdk.propertyValidator('updateResponse', CfnBot_FulfillmentUpdateResponseSpecificationPropertyValidator)(properties.updateResponse));
    return errors.wrap('supplied properties not correct for "FulfillmentUpdatesSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentUpdatesSpecification` resource
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdatesSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.FulfillmentUpdatesSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotFulfillmentUpdatesSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_FulfillmentUpdatesSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Active: cdk.booleanToCloudFormation(properties.active),
        StartResponse: cfnBotFulfillmentStartResponseSpecificationPropertyToCloudFormation(properties.startResponse),
        TimeoutInSeconds: cdk.numberToCloudFormation(properties.timeoutInSeconds),
        UpdateResponse: cfnBotFulfillmentUpdateResponseSpecificationPropertyToCloudFormation(properties.updateResponse),
    };
}

// @ts-ignore TS6133
function CfnBotFulfillmentUpdatesSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentUpdatesSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentUpdatesSpecificationProperty>();
    ret.addPropertyResult('active', 'Active', cfn_parse.FromCloudFormation.getBoolean(properties.Active));
    ret.addPropertyResult('startResponse', 'StartResponse', properties.StartResponse != null ? CfnBotFulfillmentStartResponseSpecificationPropertyFromCloudFormation(properties.StartResponse) : undefined);
    ret.addPropertyResult('timeoutInSeconds', 'TimeoutInSeconds', properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined);
    ret.addPropertyResult('updateResponse', 'UpdateResponse', properties.UpdateResponse != null ? CfnBotFulfillmentUpdateResponseSpecificationPropertyFromCloudFormation(properties.UpdateResponse) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Settings required for a slot type based on a grammar that you provide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html
     */
    export interface GrammarSlotTypeSettingProperty {
        /**
         * The source of the grammar used to create the slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html#cfn-lex-bot-grammarslottypesetting-source
         */
        readonly source?: CfnBot.GrammarSlotTypeSourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `GrammarSlotTypeSettingProperty`
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_GrammarSlotTypeSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('source', CfnBot_GrammarSlotTypeSourcePropertyValidator)(properties.source));
    return errors.wrap('supplied properties not correct for "GrammarSlotTypeSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.GrammarSlotTypeSetting` resource
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.GrammarSlotTypeSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotGrammarSlotTypeSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_GrammarSlotTypeSettingPropertyValidator(properties).assertSuccess();
    return {
        Source: cfnBotGrammarSlotTypeSourcePropertyToCloudFormation(properties.source),
    };
}

// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.GrammarSlotTypeSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.GrammarSlotTypeSettingProperty>();
    ret.addPropertyResult('source', 'Source', properties.Source != null ? CfnBotGrammarSlotTypeSourcePropertyFromCloudFormation(properties.Source) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Describes the Amazon S3 bucket name and location for the grammar that is the source of the slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html
     */
    export interface GrammarSlotTypeSourceProperty {
        /**
         * The AWS Key Management Service key required to decrypt the contents of the grammar, if any.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-kmskeyarn
         */
        readonly kmsKeyArn?: string;
        /**
         * The name of the S3 bucket that contains the grammar source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-s3bucketname
         */
        readonly s3BucketName: string;
        /**
         * The path to the grammar in the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-s3objectkey
         */
        readonly s3ObjectKey: string;
    }
}

/**
 * Determine whether the given properties match those of a `GrammarSlotTypeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_GrammarSlotTypeSourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.requiredValidator)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3BucketName', cdk.validateString)(properties.s3BucketName));
    errors.collect(cdk.propertyValidator('s3ObjectKey', cdk.requiredValidator)(properties.s3ObjectKey));
    errors.collect(cdk.propertyValidator('s3ObjectKey', cdk.validateString)(properties.s3ObjectKey));
    return errors.wrap('supplied properties not correct for "GrammarSlotTypeSourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.GrammarSlotTypeSource` resource
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.GrammarSlotTypeSource` resource.
 */
// @ts-ignore TS6133
function cfnBotGrammarSlotTypeSourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_GrammarSlotTypeSourcePropertyValidator(properties).assertSuccess();
    return {
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        S3BucketName: cdk.stringToCloudFormation(properties.s3BucketName),
        S3ObjectKey: cdk.stringToCloudFormation(properties.s3ObjectKey),
    };
}

// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.GrammarSlotTypeSourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.GrammarSlotTypeSourceProperty>();
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('s3BucketName', 'S3BucketName', cfn_parse.FromCloudFormation.getString(properties.S3BucketName));
    ret.addPropertyResult('s3ObjectKey', 'S3ObjectKey', cfn_parse.FromCloudFormation.getString(properties.S3ObjectKey));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * A card that is shown to the user by a messaging platform. You define the contents of the card, the card is displayed by the platform.
     *
     * When you use a response card, the response from the user is constrained to the text associated with a button on the card.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html
     */
    export interface ImageResponseCardProperty {
        /**
         * A list of buttons that should be displayed on the response card. The arrangement of the buttons is determined by the platform that displays the buttons.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-buttons
         */
        readonly buttons?: Array<CfnBot.ButtonProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The URL of an image to display on the response card. The image URL must be publicly available so that the platform displaying the response card has access to the image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-imageurl
         */
        readonly imageUrl?: string;
        /**
         * The subtitle to display on the response card. The format of the subtitle is determined by the platform displaying the response card.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-subtitle
         */
        readonly subtitle?: string;
        /**
         * The title to display on the response card. The format of the title is determined by the platform displaying the response card.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-title
         */
        readonly title: string;
    }
}

/**
 * Determine whether the given properties match those of a `ImageResponseCardProperty`
 *
 * @param properties - the TypeScript properties of a `ImageResponseCardProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ImageResponseCardPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('buttons', cdk.listValidator(CfnBot_ButtonPropertyValidator))(properties.buttons));
    errors.collect(cdk.propertyValidator('imageUrl', cdk.validateString)(properties.imageUrl));
    errors.collect(cdk.propertyValidator('subtitle', cdk.validateString)(properties.subtitle));
    errors.collect(cdk.propertyValidator('title', cdk.requiredValidator)(properties.title));
    errors.collect(cdk.propertyValidator('title', cdk.validateString)(properties.title));
    return errors.wrap('supplied properties not correct for "ImageResponseCardProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.ImageResponseCard` resource
 *
 * @param properties - the TypeScript properties of a `ImageResponseCardProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.ImageResponseCard` resource.
 */
// @ts-ignore TS6133
function cfnBotImageResponseCardPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ImageResponseCardPropertyValidator(properties).assertSuccess();
    return {
        Buttons: cdk.listMapper(cfnBotButtonPropertyToCloudFormation)(properties.buttons),
        ImageUrl: cdk.stringToCloudFormation(properties.imageUrl),
        Subtitle: cdk.stringToCloudFormation(properties.subtitle),
        Title: cdk.stringToCloudFormation(properties.title),
    };
}

// @ts-ignore TS6133
function CfnBotImageResponseCardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ImageResponseCardProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ImageResponseCardProperty>();
    ret.addPropertyResult('buttons', 'Buttons', properties.Buttons != null ? cfn_parse.FromCloudFormation.getArray(CfnBotButtonPropertyFromCloudFormation)(properties.Buttons) : undefined);
    ret.addPropertyResult('imageUrl', 'ImageUrl', properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined);
    ret.addPropertyResult('subtitle', 'Subtitle', properties.Subtitle != null ? cfn_parse.FromCloudFormation.getString(properties.Subtitle) : undefined);
    ret.addPropertyResult('title', 'Title', cfn_parse.FromCloudFormation.getString(properties.Title));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * The name of a context that must be active for an intent to be selected by Amazon Lex .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html
     */
    export interface InputContextProperty {
        /**
         * The name of the context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html#cfn-lex-bot-inputcontext-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputContextProperty`
 *
 * @param properties - the TypeScript properties of a `InputContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_InputContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "InputContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.InputContext` resource
 *
 * @param properties - the TypeScript properties of a `InputContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.InputContext` resource.
 */
// @ts-ignore TS6133
function cfnBotInputContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_InputContextPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnBotInputContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.InputContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.InputContextProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Represents an action that the user wants to perform.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html
     */
    export interface IntentProperty {
        /**
         * A description of the intent. Use the description to help identify the intent in lists.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-description
         */
        readonly description?: string;
        /**
         * Specifies that Amazon Lex invokes the alias Lambda function for each user input. You can invoke this Lambda function to personalize user interaction.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-dialogcodehook
         */
        readonly dialogCodeHook?: CfnBot.DialogCodeHookSettingProperty | cdk.IResolvable;
        /**
         * Specifies that Amazon Lex invokes the alias Lambda function when the intent is ready for fulfillment. You can invoke this function to complete the bot's transaction with the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-fulfillmentcodehook
         */
        readonly fulfillmentCodeHook?: CfnBot.FulfillmentCodeHookSettingProperty | cdk.IResolvable;
        /**
         * A list of contexts that must be active for this intent to be considered by Amazon Lex .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-inputcontexts
         */
        readonly inputContexts?: Array<CfnBot.InputContextProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Sets the response that Amazon Lex sends to the user when the intent is closed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-intentclosingsetting
         */
        readonly intentClosingSetting?: CfnBot.IntentClosingSettingProperty | cdk.IResolvable;
        /**
         * Provides prompts that Amazon Lex sends to the user to confirm the completion of an intent. If the user answers "no," the settings contain a statement that is sent to the user to end the intent.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-intentconfirmationsetting
         */
        readonly intentConfirmationSetting?: CfnBot.IntentConfirmationSettingProperty | cdk.IResolvable;
        /**
         * Configuration information required to use the AMAZON.KendraSearchIntent intent to connect to an Amazon Kendra index. The AMAZON.KendraSearchIntent intent is called when Amazon Lex can't determine another intent to invoke.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-kendraconfiguration
         */
        readonly kendraConfiguration?: CfnBot.KendraConfigurationProperty | cdk.IResolvable;
        /**
         * The name of the intent. Intent names must be unique within the locale that contains the intent and can't match the name of any built-in intent.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-name
         */
        readonly name: string;
        /**
         * A list of contexts that the intent activates when it is fulfilled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-outputcontexts
         */
        readonly outputContexts?: Array<CfnBot.OutputContextProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A unique identifier for the built-in intent to base this intent on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-parentintentsignature
         */
        readonly parentIntentSignature?: string;
        /**
         * A list of utterances that a user might say to signal the intent.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-sampleutterances
         */
        readonly sampleUtterances?: Array<CfnBot.SampleUtteranceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Indicates the priority for slots. Amazon Lex prompts the user for slot values in priority order.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-slotpriorities
         */
        readonly slotPriorities?: Array<CfnBot.SlotPriorityProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A list of slots that the intent requires for fulfillment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-slots
         */
        readonly slots?: Array<CfnBot.SlotProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntentProperty`
 *
 * @param properties - the TypeScript properties of a `IntentProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_IntentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('dialogCodeHook', CfnBot_DialogCodeHookSettingPropertyValidator)(properties.dialogCodeHook));
    errors.collect(cdk.propertyValidator('fulfillmentCodeHook', CfnBot_FulfillmentCodeHookSettingPropertyValidator)(properties.fulfillmentCodeHook));
    errors.collect(cdk.propertyValidator('inputContexts', cdk.listValidator(CfnBot_InputContextPropertyValidator))(properties.inputContexts));
    errors.collect(cdk.propertyValidator('intentClosingSetting', CfnBot_IntentClosingSettingPropertyValidator)(properties.intentClosingSetting));
    errors.collect(cdk.propertyValidator('intentConfirmationSetting', CfnBot_IntentConfirmationSettingPropertyValidator)(properties.intentConfirmationSetting));
    errors.collect(cdk.propertyValidator('kendraConfiguration', CfnBot_KendraConfigurationPropertyValidator)(properties.kendraConfiguration));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outputContexts', cdk.listValidator(CfnBot_OutputContextPropertyValidator))(properties.outputContexts));
    errors.collect(cdk.propertyValidator('parentIntentSignature', cdk.validateString)(properties.parentIntentSignature));
    errors.collect(cdk.propertyValidator('sampleUtterances', cdk.listValidator(CfnBot_SampleUtterancePropertyValidator))(properties.sampleUtterances));
    errors.collect(cdk.propertyValidator('slotPriorities', cdk.listValidator(CfnBot_SlotPriorityPropertyValidator))(properties.slotPriorities));
    errors.collect(cdk.propertyValidator('slots', cdk.listValidator(CfnBot_SlotPropertyValidator))(properties.slots));
    return errors.wrap('supplied properties not correct for "IntentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.Intent` resource
 *
 * @param properties - the TypeScript properties of a `IntentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.Intent` resource.
 */
// @ts-ignore TS6133
function cfnBotIntentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_IntentPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        DialogCodeHook: cfnBotDialogCodeHookSettingPropertyToCloudFormation(properties.dialogCodeHook),
        FulfillmentCodeHook: cfnBotFulfillmentCodeHookSettingPropertyToCloudFormation(properties.fulfillmentCodeHook),
        InputContexts: cdk.listMapper(cfnBotInputContextPropertyToCloudFormation)(properties.inputContexts),
        IntentClosingSetting: cfnBotIntentClosingSettingPropertyToCloudFormation(properties.intentClosingSetting),
        IntentConfirmationSetting: cfnBotIntentConfirmationSettingPropertyToCloudFormation(properties.intentConfirmationSetting),
        KendraConfiguration: cfnBotKendraConfigurationPropertyToCloudFormation(properties.kendraConfiguration),
        Name: cdk.stringToCloudFormation(properties.name),
        OutputContexts: cdk.listMapper(cfnBotOutputContextPropertyToCloudFormation)(properties.outputContexts),
        ParentIntentSignature: cdk.stringToCloudFormation(properties.parentIntentSignature),
        SampleUtterances: cdk.listMapper(cfnBotSampleUtterancePropertyToCloudFormation)(properties.sampleUtterances),
        SlotPriorities: cdk.listMapper(cfnBotSlotPriorityPropertyToCloudFormation)(properties.slotPriorities),
        Slots: cdk.listMapper(cfnBotSlotPropertyToCloudFormation)(properties.slots),
    };
}

// @ts-ignore TS6133
function CfnBotIntentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('dialogCodeHook', 'DialogCodeHook', properties.DialogCodeHook != null ? CfnBotDialogCodeHookSettingPropertyFromCloudFormation(properties.DialogCodeHook) : undefined);
    ret.addPropertyResult('fulfillmentCodeHook', 'FulfillmentCodeHook', properties.FulfillmentCodeHook != null ? CfnBotFulfillmentCodeHookSettingPropertyFromCloudFormation(properties.FulfillmentCodeHook) : undefined);
    ret.addPropertyResult('inputContexts', 'InputContexts', properties.InputContexts != null ? cfn_parse.FromCloudFormation.getArray(CfnBotInputContextPropertyFromCloudFormation)(properties.InputContexts) : undefined);
    ret.addPropertyResult('intentClosingSetting', 'IntentClosingSetting', properties.IntentClosingSetting != null ? CfnBotIntentClosingSettingPropertyFromCloudFormation(properties.IntentClosingSetting) : undefined);
    ret.addPropertyResult('intentConfirmationSetting', 'IntentConfirmationSetting', properties.IntentConfirmationSetting != null ? CfnBotIntentConfirmationSettingPropertyFromCloudFormation(properties.IntentConfirmationSetting) : undefined);
    ret.addPropertyResult('kendraConfiguration', 'KendraConfiguration', properties.KendraConfiguration != null ? CfnBotKendraConfigurationPropertyFromCloudFormation(properties.KendraConfiguration) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('outputContexts', 'OutputContexts', properties.OutputContexts != null ? cfn_parse.FromCloudFormation.getArray(CfnBotOutputContextPropertyFromCloudFormation)(properties.OutputContexts) : undefined);
    ret.addPropertyResult('parentIntentSignature', 'ParentIntentSignature', properties.ParentIntentSignature != null ? cfn_parse.FromCloudFormation.getString(properties.ParentIntentSignature) : undefined);
    ret.addPropertyResult('sampleUtterances', 'SampleUtterances', properties.SampleUtterances != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleUtterancePropertyFromCloudFormation)(properties.SampleUtterances) : undefined);
    ret.addPropertyResult('slotPriorities', 'SlotPriorities', properties.SlotPriorities != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotPriorityPropertyFromCloudFormation)(properties.SlotPriorities) : undefined);
    ret.addPropertyResult('slots', 'Slots', properties.Slots != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotPropertyFromCloudFormation)(properties.Slots) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides a statement the Amazon Lex conveys to the user when the intent is successfully fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html
     */
    export interface IntentClosingSettingProperty {
        /**
         * The response that Amazon Lex sends to the user when the intent is complete.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-closingresponse
         */
        readonly closingResponse: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies whether an intent's closing response is used. When this field is false, the closing response isn't sent to the user and no closing input from the user is used. If the IsActive field isn't specified, the default is true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-isactive
         */
        readonly isActive?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntentClosingSettingProperty`
 *
 * @param properties - the TypeScript properties of a `IntentClosingSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_IntentClosingSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('closingResponse', cdk.requiredValidator)(properties.closingResponse));
    errors.collect(cdk.propertyValidator('closingResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.closingResponse));
    errors.collect(cdk.propertyValidator('isActive', cdk.validateBoolean)(properties.isActive));
    return errors.wrap('supplied properties not correct for "IntentClosingSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.IntentClosingSetting` resource
 *
 * @param properties - the TypeScript properties of a `IntentClosingSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.IntentClosingSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotIntentClosingSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_IntentClosingSettingPropertyValidator(properties).assertSuccess();
    return {
        ClosingResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.closingResponse),
        IsActive: cdk.booleanToCloudFormation(properties.isActive),
    };
}

// @ts-ignore TS6133
function CfnBotIntentClosingSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentClosingSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentClosingSettingProperty>();
    ret.addPropertyResult('closingResponse', 'ClosingResponse', CfnBotResponseSpecificationPropertyFromCloudFormation(properties.ClosingResponse));
    ret.addPropertyResult('isActive', 'IsActive', properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides a prompt for making sure that the user is ready for the intent to be fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html
     */
    export interface IntentConfirmationSettingProperty {
        /**
         * When the user answers "no" to the question defined in PromptSpecification, Amazon Lex responds with this response to acknowledge that the intent was canceled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-declinationresponse
         */
        readonly declinationResponse: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies whether the intent's confirmation is sent to the user. When this field is false, confirmation and declination responses aren't sent and processing continues as if the responses aren't present. If the active field isn't specified, the default is true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-isactive
         */
        readonly isActive?: boolean | cdk.IResolvable;
        /**
         * Prompts the user to confirm the intent. This question should have a yes or no answer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-promptspecification
         */
        readonly promptSpecification: CfnBot.PromptSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `IntentConfirmationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `IntentConfirmationSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_IntentConfirmationSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('declinationResponse', cdk.requiredValidator)(properties.declinationResponse));
    errors.collect(cdk.propertyValidator('declinationResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.declinationResponse));
    errors.collect(cdk.propertyValidator('isActive', cdk.validateBoolean)(properties.isActive));
    errors.collect(cdk.propertyValidator('promptSpecification', cdk.requiredValidator)(properties.promptSpecification));
    errors.collect(cdk.propertyValidator('promptSpecification', CfnBot_PromptSpecificationPropertyValidator)(properties.promptSpecification));
    return errors.wrap('supplied properties not correct for "IntentConfirmationSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.IntentConfirmationSetting` resource
 *
 * @param properties - the TypeScript properties of a `IntentConfirmationSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.IntentConfirmationSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotIntentConfirmationSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_IntentConfirmationSettingPropertyValidator(properties).assertSuccess();
    return {
        DeclinationResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.declinationResponse),
        IsActive: cdk.booleanToCloudFormation(properties.isActive),
        PromptSpecification: cfnBotPromptSpecificationPropertyToCloudFormation(properties.promptSpecification),
    };
}

// @ts-ignore TS6133
function CfnBotIntentConfirmationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentConfirmationSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentConfirmationSettingProperty>();
    ret.addPropertyResult('declinationResponse', 'DeclinationResponse', CfnBotResponseSpecificationPropertyFromCloudFormation(properties.DeclinationResponse));
    ret.addPropertyResult('isActive', 'IsActive', properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined);
    ret.addPropertyResult('promptSpecification', 'PromptSpecification', CfnBotPromptSpecificationPropertyFromCloudFormation(properties.PromptSpecification));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides configuration information for the AMAZON.KendraSearchIntent intent. When you use this intent, Amazon Lex searches the specified Amazon Kendra index and returns documents from the index that match the user's utterance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html
     */
    export interface KendraConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the Amazon Kendra index that you want the AMAZON.KendraSearchIntent intent to search. The index must be in the same account and Region as the Amazon Lex bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-kendraindex
         */
        readonly kendraIndex: string;
        /**
         * A query filter that Amazon Lex sends to Amazon Kendra to filter the response from a query. The filter is in the format defined by Amazon Kendra.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-queryfilterstring
         */
        readonly queryFilterString?: string;
        /**
         * Determines whether the AMAZON.KendraSearchIntent intent uses a custom query string to query the Amazon Kendra index.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-queryfilterstringenabled
         */
        readonly queryFilterStringEnabled?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KendraConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `KendraConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_KendraConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kendraIndex', cdk.requiredValidator)(properties.kendraIndex));
    errors.collect(cdk.propertyValidator('kendraIndex', cdk.validateString)(properties.kendraIndex));
    errors.collect(cdk.propertyValidator('queryFilterString', cdk.validateString)(properties.queryFilterString));
    errors.collect(cdk.propertyValidator('queryFilterStringEnabled', cdk.validateBoolean)(properties.queryFilterStringEnabled));
    return errors.wrap('supplied properties not correct for "KendraConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.KendraConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `KendraConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.KendraConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnBotKendraConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_KendraConfigurationPropertyValidator(properties).assertSuccess();
    return {
        KendraIndex: cdk.stringToCloudFormation(properties.kendraIndex),
        QueryFilterString: cdk.stringToCloudFormation(properties.queryFilterString),
        QueryFilterStringEnabled: cdk.booleanToCloudFormation(properties.queryFilterStringEnabled),
    };
}

// @ts-ignore TS6133
function CfnBotKendraConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.KendraConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.KendraConfigurationProperty>();
    ret.addPropertyResult('kendraIndex', 'KendraIndex', cfn_parse.FromCloudFormation.getString(properties.KendraIndex));
    ret.addPropertyResult('queryFilterString', 'QueryFilterString', properties.QueryFilterString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryFilterString) : undefined);
    ret.addPropertyResult('queryFilterStringEnabled', 'QueryFilterStringEnabled', properties.QueryFilterStringEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.QueryFilterStringEnabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html
     */
    export interface LambdaCodeHookProperty {
        /**
         * Specifies the version of the request-response that you want Amazon Lex to use to invoke your Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html#cfn-lex-bot-lambdacodehook-codehookinterfaceversion
         */
        readonly codeHookInterfaceVersion: string;
        /**
         * Specifies the Amazon Resource Name (ARN) of the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html#cfn-lex-bot-lambdacodehook-lambdaarn
         */
        readonly lambdaArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaCodeHookProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_LambdaCodeHookPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeHookInterfaceVersion', cdk.requiredValidator)(properties.codeHookInterfaceVersion));
    errors.collect(cdk.propertyValidator('codeHookInterfaceVersion', cdk.validateString)(properties.codeHookInterfaceVersion));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.requiredValidator)(properties.lambdaArn));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.validateString)(properties.lambdaArn));
    return errors.wrap('supplied properties not correct for "LambdaCodeHookProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.LambdaCodeHook` resource
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.LambdaCodeHook` resource.
 */
// @ts-ignore TS6133
function cfnBotLambdaCodeHookPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_LambdaCodeHookPropertyValidator(properties).assertSuccess();
    return {
        CodeHookInterfaceVersion: cdk.stringToCloudFormation(properties.codeHookInterfaceVersion),
        LambdaArn: cdk.stringToCloudFormation(properties.lambdaArn),
    };
}

// @ts-ignore TS6133
function CfnBotLambdaCodeHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.LambdaCodeHookProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.LambdaCodeHookProperty>();
    ret.addPropertyResult('codeHookInterfaceVersion', 'CodeHookInterfaceVersion', cfn_parse.FromCloudFormation.getString(properties.CodeHookInterfaceVersion));
    ret.addPropertyResult('lambdaArn', 'LambdaArn', cfn_parse.FromCloudFormation.getString(properties.LambdaArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * The object that provides message text and it's type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html
     */
    export interface MessageProperty {
        /**
         * A message in a custom format defined by the client application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-custompayload
         */
        readonly customPayload?: CfnBot.CustomPayloadProperty | cdk.IResolvable;
        /**
         * A message that defines a response card that the client application can show to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-imageresponsecard
         */
        readonly imageResponseCard?: CfnBot.ImageResponseCardProperty | cdk.IResolvable;
        /**
         * A message in plain text format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-plaintextmessage
         */
        readonly plainTextMessage?: CfnBot.PlainTextMessageProperty | cdk.IResolvable;
        /**
         * A message in Speech Synthesis Markup Language (SSML) format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-ssmlmessage
         */
        readonly ssmlMessage?: CfnBot.SSMLMessageProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MessageProperty`
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_MessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('customPayload', CfnBot_CustomPayloadPropertyValidator)(properties.customPayload));
    errors.collect(cdk.propertyValidator('imageResponseCard', CfnBot_ImageResponseCardPropertyValidator)(properties.imageResponseCard));
    errors.collect(cdk.propertyValidator('plainTextMessage', CfnBot_PlainTextMessagePropertyValidator)(properties.plainTextMessage));
    errors.collect(cdk.propertyValidator('ssmlMessage', CfnBot_SSMLMessagePropertyValidator)(properties.ssmlMessage));
    return errors.wrap('supplied properties not correct for "MessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.Message` resource
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.Message` resource.
 */
// @ts-ignore TS6133
function cfnBotMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_MessagePropertyValidator(properties).assertSuccess();
    return {
        CustomPayload: cfnBotCustomPayloadPropertyToCloudFormation(properties.customPayload),
        ImageResponseCard: cfnBotImageResponseCardPropertyToCloudFormation(properties.imageResponseCard),
        PlainTextMessage: cfnBotPlainTextMessagePropertyToCloudFormation(properties.plainTextMessage),
        SSMLMessage: cfnBotSSMLMessagePropertyToCloudFormation(properties.ssmlMessage),
    };
}

// @ts-ignore TS6133
function CfnBotMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.MessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MessageProperty>();
    ret.addPropertyResult('customPayload', 'CustomPayload', properties.CustomPayload != null ? CfnBotCustomPayloadPropertyFromCloudFormation(properties.CustomPayload) : undefined);
    ret.addPropertyResult('imageResponseCard', 'ImageResponseCard', properties.ImageResponseCard != null ? CfnBotImageResponseCardPropertyFromCloudFormation(properties.ImageResponseCard) : undefined);
    ret.addPropertyResult('plainTextMessage', 'PlainTextMessage', properties.PlainTextMessage != null ? CfnBotPlainTextMessagePropertyFromCloudFormation(properties.PlainTextMessage) : undefined);
    ret.addPropertyResult('ssmlMessage', 'SSMLMessage', properties.SSMLMessage != null ? CfnBotSSMLMessagePropertyFromCloudFormation(properties.SSMLMessage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides one or more messages that Amazon Lex should send to the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html
     */
    export interface MessageGroupProperty {
        /**
         * The primary message that Amazon Lex should send to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html#cfn-lex-bot-messagegroup-message
         */
        readonly message: CfnBot.MessageProperty | cdk.IResolvable;
        /**
         * Message variations to send to the user. When variations are defined, Amazon Lex chooses the primary message or one of the variations to send to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html#cfn-lex-bot-messagegroup-variations
         */
        readonly variations?: Array<CfnBot.MessageProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MessageGroupProperty`
 *
 * @param properties - the TypeScript properties of a `MessageGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_MessageGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('message', cdk.requiredValidator)(properties.message));
    errors.collect(cdk.propertyValidator('message', CfnBot_MessagePropertyValidator)(properties.message));
    errors.collect(cdk.propertyValidator('variations', cdk.listValidator(CfnBot_MessagePropertyValidator))(properties.variations));
    return errors.wrap('supplied properties not correct for "MessageGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.MessageGroup` resource
 *
 * @param properties - the TypeScript properties of a `MessageGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.MessageGroup` resource.
 */
// @ts-ignore TS6133
function cfnBotMessageGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_MessageGroupPropertyValidator(properties).assertSuccess();
    return {
        Message: cfnBotMessagePropertyToCloudFormation(properties.message),
        Variations: cdk.listMapper(cfnBotMessagePropertyToCloudFormation)(properties.variations),
    };
}

// @ts-ignore TS6133
function CfnBotMessageGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.MessageGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MessageGroupProperty>();
    ret.addPropertyResult('message', 'Message', CfnBotMessagePropertyFromCloudFormation(properties.Message));
    ret.addPropertyResult('variations', 'Variations', properties.Variations != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessagePropertyFromCloudFormation)(properties.Variations) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Indicates whether a slot can return multiple values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-multiplevaluessetting.html
     */
    export interface MultipleValuesSettingProperty {
        /**
         * Indicates whether a slot can return multiple values. When true, the slot may return more than one value in a response. When false, the slot returns only a single value. If AllowMultipleValues is not set, the default value is false.
         *
         * Multi-value slots are only available in the en-US locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-multiplevaluessetting.html#cfn-lex-bot-multiplevaluessetting-allowmultiplevalues
         */
        readonly allowMultipleValues?: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MultipleValuesSettingProperty`
 *
 * @param properties - the TypeScript properties of a `MultipleValuesSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_MultipleValuesSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowMultipleValues', cdk.validateBoolean)(properties.allowMultipleValues));
    return errors.wrap('supplied properties not correct for "MultipleValuesSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.MultipleValuesSetting` resource
 *
 * @param properties - the TypeScript properties of a `MultipleValuesSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.MultipleValuesSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotMultipleValuesSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_MultipleValuesSettingPropertyValidator(properties).assertSuccess();
    return {
        AllowMultipleValues: cdk.booleanToCloudFormation(properties.allowMultipleValues),
    };
}

// @ts-ignore TS6133
function CfnBotMultipleValuesSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.MultipleValuesSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MultipleValuesSettingProperty>();
    ret.addPropertyResult('allowMultipleValues', 'AllowMultipleValues', properties.AllowMultipleValues != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowMultipleValues) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Determines whether Amazon Lex obscures slot values in conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html
     */
    export interface ObfuscationSettingProperty {
        /**
         * Value that determines whether Amazon Lex obscures slot values in conversation logs. The default is to obscure the values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html#cfn-lex-bot-obfuscationsetting-obfuscationsettingtype
         */
        readonly obfuscationSettingType: string;
    }
}

/**
 * Determine whether the given properties match those of a `ObfuscationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ObfuscationSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ObfuscationSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('obfuscationSettingType', cdk.requiredValidator)(properties.obfuscationSettingType));
    errors.collect(cdk.propertyValidator('obfuscationSettingType', cdk.validateString)(properties.obfuscationSettingType));
    return errors.wrap('supplied properties not correct for "ObfuscationSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.ObfuscationSetting` resource
 *
 * @param properties - the TypeScript properties of a `ObfuscationSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.ObfuscationSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotObfuscationSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ObfuscationSettingPropertyValidator(properties).assertSuccess();
    return {
        ObfuscationSettingType: cdk.stringToCloudFormation(properties.obfuscationSettingType),
    };
}

// @ts-ignore TS6133
function CfnBotObfuscationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ObfuscationSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ObfuscationSettingProperty>();
    ret.addPropertyResult('obfuscationSettingType', 'ObfuscationSettingType', cfn_parse.FromCloudFormation.getString(properties.ObfuscationSettingType));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Describes a session context that is activated when an intent is fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html
     */
    export interface OutputContextProperty {
        /**
         * The name of the output context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-name
         */
        readonly name: string;
        /**
         * The amount of time, in seconds, that the output context should remain active. The time is figured from the first time the context is sent to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-timetoliveinseconds
         */
        readonly timeToLiveInSeconds: number;
        /**
         * The number of conversation turns that the output context should remain active. The number of turns is counted from the first time that the context is sent to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-turnstolive
         */
        readonly turnsToLive: number;
    }
}

/**
 * Determine whether the given properties match those of a `OutputContextProperty`
 *
 * @param properties - the TypeScript properties of a `OutputContextProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_OutputContextPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('timeToLiveInSeconds', cdk.requiredValidator)(properties.timeToLiveInSeconds));
    errors.collect(cdk.propertyValidator('timeToLiveInSeconds', cdk.validateNumber)(properties.timeToLiveInSeconds));
    errors.collect(cdk.propertyValidator('turnsToLive', cdk.requiredValidator)(properties.turnsToLive));
    errors.collect(cdk.propertyValidator('turnsToLive', cdk.validateNumber)(properties.turnsToLive));
    return errors.wrap('supplied properties not correct for "OutputContextProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.OutputContext` resource
 *
 * @param properties - the TypeScript properties of a `OutputContextProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.OutputContext` resource.
 */
// @ts-ignore TS6133
function cfnBotOutputContextPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_OutputContextPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        TimeToLiveInSeconds: cdk.numberToCloudFormation(properties.timeToLiveInSeconds),
        TurnsToLive: cdk.numberToCloudFormation(properties.turnsToLive),
    };
}

// @ts-ignore TS6133
function CfnBotOutputContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.OutputContextProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.OutputContextProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('timeToLiveInSeconds', 'TimeToLiveInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.TimeToLiveInSeconds));
    ret.addPropertyResult('turnsToLive', 'TurnsToLive', cfn_parse.FromCloudFormation.getNumber(properties.TurnsToLive));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines an ASCII text message to send to the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html
     */
    export interface PlainTextMessageProperty {
        /**
         * The message to send to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html#cfn-lex-bot-plaintextmessage-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `PlainTextMessageProperty`
 *
 * @param properties - the TypeScript properties of a `PlainTextMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_PlainTextMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "PlainTextMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.PlainTextMessage` resource
 *
 * @param properties - the TypeScript properties of a `PlainTextMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.PlainTextMessage` resource.
 */
// @ts-ignore TS6133
function cfnBotPlainTextMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_PlainTextMessagePropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBotPlainTextMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.PlainTextMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PlainTextMessageProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides a setting that determines whether the post-fulfillment response is sent to the user. For more information, see [Post-fulfillment response](https://docs.aws.amazon.com/lex/latest/dg/streaming-progress.html#progress-complete) in the *Amazon Lex developer guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html
     */
    export interface PostFulfillmentStatusSpecificationProperty {
        /**
         * Specifies a list of message groups that Amazon Lex uses to respond when fulfillment isn't successful.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-failureresponse
         */
        readonly failureResponse?: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies a list of message groups that Amazon Lex uses to respond when the fulfillment is successful.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-successresponse
         */
        readonly successResponse?: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies a list of message groups that Amazon Lex uses to respond when fulfillment isn't completed within the timeout period.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-timeoutresponse
         */
        readonly timeoutResponse?: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PostFulfillmentStatusSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PostFulfillmentStatusSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_PostFulfillmentStatusSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('failureResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.failureResponse));
    errors.collect(cdk.propertyValidator('successResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.successResponse));
    errors.collect(cdk.propertyValidator('timeoutResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.timeoutResponse));
    return errors.wrap('supplied properties not correct for "PostFulfillmentStatusSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.PostFulfillmentStatusSpecification` resource
 *
 * @param properties - the TypeScript properties of a `PostFulfillmentStatusSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.PostFulfillmentStatusSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotPostFulfillmentStatusSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_PostFulfillmentStatusSpecificationPropertyValidator(properties).assertSuccess();
    return {
        FailureResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.failureResponse),
        SuccessResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.successResponse),
        TimeoutResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.timeoutResponse),
    };
}

// @ts-ignore TS6133
function CfnBotPostFulfillmentStatusSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.PostFulfillmentStatusSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PostFulfillmentStatusSpecificationProperty>();
    ret.addPropertyResult('failureResponse', 'FailureResponse', properties.FailureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.FailureResponse) : undefined);
    ret.addPropertyResult('successResponse', 'SuccessResponse', properties.SuccessResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.SuccessResponse) : undefined);
    ret.addPropertyResult('timeoutResponse', 'TimeoutResponse', properties.TimeoutResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.TimeoutResponse) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html
     */
    export interface PromptAttemptSpecificationProperty {
        /**
         * `CfnBot.PromptAttemptSpecificationProperty.AllowInterrupt`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * `CfnBot.PromptAttemptSpecificationProperty.AllowedInputTypes`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-allowedinputtypes
         */
        readonly allowedInputTypes: CfnBot.AllowedInputTypesProperty | cdk.IResolvable;
        /**
         * `CfnBot.PromptAttemptSpecificationProperty.AudioAndDTMFInputSpecification`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-audioanddtmfinputspecification
         */
        readonly audioAndDtmfInputSpecification?: CfnBot.AudioAndDTMFInputSpecificationProperty | cdk.IResolvable;
        /**
         * `CfnBot.PromptAttemptSpecificationProperty.TextInputSpecification`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-textinputspecification
         */
        readonly textInputSpecification?: CfnBot.TextInputSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PromptAttemptSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PromptAttemptSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_PromptAttemptSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('allowedInputTypes', cdk.requiredValidator)(properties.allowedInputTypes));
    errors.collect(cdk.propertyValidator('allowedInputTypes', CfnBot_AllowedInputTypesPropertyValidator)(properties.allowedInputTypes));
    errors.collect(cdk.propertyValidator('audioAndDtmfInputSpecification', CfnBot_AudioAndDTMFInputSpecificationPropertyValidator)(properties.audioAndDtmfInputSpecification));
    errors.collect(cdk.propertyValidator('textInputSpecification', CfnBot_TextInputSpecificationPropertyValidator)(properties.textInputSpecification));
    return errors.wrap('supplied properties not correct for "PromptAttemptSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.PromptAttemptSpecification` resource
 *
 * @param properties - the TypeScript properties of a `PromptAttemptSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.PromptAttemptSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotPromptAttemptSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_PromptAttemptSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        AllowedInputTypes: cfnBotAllowedInputTypesPropertyToCloudFormation(properties.allowedInputTypes),
        AudioAndDTMFInputSpecification: cfnBotAudioAndDTMFInputSpecificationPropertyToCloudFormation(properties.audioAndDtmfInputSpecification),
        TextInputSpecification: cfnBotTextInputSpecificationPropertyToCloudFormation(properties.textInputSpecification),
    };
}

// @ts-ignore TS6133
function CfnBotPromptAttemptSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.PromptAttemptSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PromptAttemptSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('allowedInputTypes', 'AllowedInputTypes', CfnBotAllowedInputTypesPropertyFromCloudFormation(properties.AllowedInputTypes));
    ret.addPropertyResult('audioAndDtmfInputSpecification', 'AudioAndDTMFInputSpecification', properties.AudioAndDTMFInputSpecification != null ? CfnBotAudioAndDTMFInputSpecificationPropertyFromCloudFormation(properties.AudioAndDTMFInputSpecification) : undefined);
    ret.addPropertyResult('textInputSpecification', 'TextInputSpecification', properties.TextInputSpecification != null ? CfnBotTextInputSpecificationPropertyFromCloudFormation(properties.TextInputSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies a list of message groups that Amazon Lex sends to a user to elicit a response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html
     */
    export interface PromptSpecificationProperty {
        /**
         * Indicates whether the user can interrupt a speech prompt from the bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * The maximum number of times the bot tries to elicit a response from the user using this prompt
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-maxretries
         */
        readonly maxRetries: number;
        /**
         * A collection of responses that Amazon Lex can send to the user. Amazon Lex chooses the actual response to send at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-messagegroupslist
         */
        readonly messageGroupsList: Array<CfnBot.MessageGroupProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnBot.PromptSpecificationProperty.MessageSelectionStrategy`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-messageselectionstrategy
         */
        readonly messageSelectionStrategy?: string;
        /**
         * `CfnBot.PromptSpecificationProperty.PromptAttemptsSpecification`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-promptattemptsspecification
         */
        readonly promptAttemptsSpecification?: { [key: string]: (CfnBot.PromptAttemptSpecificationProperty | cdk.IResolvable) } | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `PromptSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PromptSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_PromptSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.requiredValidator)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('maxRetries', cdk.validateNumber)(properties.maxRetries));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.requiredValidator)(properties.messageGroupsList));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.listValidator(CfnBot_MessageGroupPropertyValidator))(properties.messageGroupsList));
    errors.collect(cdk.propertyValidator('messageSelectionStrategy', cdk.validateString)(properties.messageSelectionStrategy));
    errors.collect(cdk.propertyValidator('promptAttemptsSpecification', cdk.hashValidator(CfnBot_PromptAttemptSpecificationPropertyValidator))(properties.promptAttemptsSpecification));
    return errors.wrap('supplied properties not correct for "PromptSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.PromptSpecification` resource
 *
 * @param properties - the TypeScript properties of a `PromptSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.PromptSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotPromptSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_PromptSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        MaxRetries: cdk.numberToCloudFormation(properties.maxRetries),
        MessageGroupsList: cdk.listMapper(cfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList),
        MessageSelectionStrategy: cdk.stringToCloudFormation(properties.messageSelectionStrategy),
        PromptAttemptsSpecification: cdk.hashMapper(cfnBotPromptAttemptSpecificationPropertyToCloudFormation)(properties.promptAttemptsSpecification),
    };
}

// @ts-ignore TS6133
function CfnBotPromptSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.PromptSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PromptSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('maxRetries', 'MaxRetries', cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries));
    ret.addPropertyResult('messageGroupsList', 'MessageGroupsList', cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList));
    ret.addPropertyResult('messageSelectionStrategy', 'MessageSelectionStrategy', properties.MessageSelectionStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.MessageSelectionStrategy) : undefined);
    ret.addPropertyResult('promptAttemptsSpecification', 'PromptAttemptsSpecification', properties.PromptAttemptsSpecification != null ? cfn_parse.FromCloudFormation.getMap(CfnBotPromptAttemptSpecificationPropertyFromCloudFormation)(properties.PromptAttemptsSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies a list of message groups that Amazon Lex uses to respond to user input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html
     */
    export interface ResponseSpecificationProperty {
        /**
         * Indicates whether the user can interrupt a speech response from Amazon Lex .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html#cfn-lex-bot-responsespecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * A collection of responses that Amazon Lex can send to the user. Amazon Lex chooses the actual response to send at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html#cfn-lex-bot-responsespecification-messagegroupslist
         */
        readonly messageGroupsList: Array<CfnBot.MessageGroupProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_ResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.requiredValidator)(properties.messageGroupsList));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.listValidator(CfnBot_MessageGroupPropertyValidator))(properties.messageGroupsList));
    return errors.wrap('supplied properties not correct for "ResponseSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.ResponseSpecification` resource
 *
 * @param properties - the TypeScript properties of a `ResponseSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.ResponseSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotResponseSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_ResponseSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        MessageGroupsList: cdk.listMapper(cfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList),
    };
}

// @ts-ignore TS6133
function CfnBotResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ResponseSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ResponseSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('messageGroupsList', 'MessageGroupsList', cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies an Amazon S3 bucket for logging audio conversations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html
     */
    export interface S3BucketLogDestinationProperty {
        /**
         * Specifies the Amazon Resource Name (ARN) of an AWS Key Management Service key for encrypting audio log files stored in an Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-kmskeyarn
         */
        readonly kmsKeyArn?: string;
        /**
         * Specifies the Amazon S3 prefix to assign to audio log files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-logprefix
         */
        readonly logPrefix: string;
        /**
         * Specifies the Amazon Resource Name (ARN) of the Amazon S3 bucket where audio files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-s3bucketarn
         */
        readonly s3BucketArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3BucketLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_S3BucketLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.requiredValidator)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.validateString)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.requiredValidator)(properties.s3BucketArn));
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.validateString)(properties.s3BucketArn));
    return errors.wrap('supplied properties not correct for "S3BucketLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.S3BucketLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.S3BucketLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotS3BucketLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_S3BucketLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        LogPrefix: cdk.stringToCloudFormation(properties.logPrefix),
        S3BucketArn: cdk.stringToCloudFormation(properties.s3BucketArn),
    };
}

// @ts-ignore TS6133
function CfnBotS3BucketLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.S3BucketLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.S3BucketLogDestinationProperty>();
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('logPrefix', 'LogPrefix', cfn_parse.FromCloudFormation.getString(properties.LogPrefix));
    ret.addPropertyResult('s3BucketArn', 'S3BucketArn', cfn_parse.FromCloudFormation.getString(properties.S3BucketArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines an Amazon S3 bucket location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html
     */
    export interface S3LocationProperty {
        /**
         * The S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The path and file name to the object in the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3objectkey
         */
        readonly s3ObjectKey: string;
        /**
         * The version of the object in the S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3objectversion
         */
        readonly s3ObjectVersion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_S3LocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.validateString)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3ObjectKey', cdk.requiredValidator)(properties.s3ObjectKey));
    errors.collect(cdk.propertyValidator('s3ObjectKey', cdk.validateString)(properties.s3ObjectKey));
    errors.collect(cdk.propertyValidator('s3ObjectVersion', cdk.validateString)(properties.s3ObjectVersion));
    return errors.wrap('supplied properties not correct for "S3LocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.S3Location` resource
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.S3Location` resource.
 */
// @ts-ignore TS6133
function cfnBotS3LocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_S3LocationPropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cdk.stringToCloudFormation(properties.s3Bucket),
        S3ObjectKey: cdk.stringToCloudFormation(properties.s3ObjectKey),
        S3ObjectVersion: cdk.stringToCloudFormation(properties.s3ObjectVersion),
    };
}

// @ts-ignore TS6133
function CfnBotS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.S3LocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.S3LocationProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', cfn_parse.FromCloudFormation.getString(properties.S3Bucket));
    ret.addPropertyResult('s3ObjectKey', 'S3ObjectKey', cfn_parse.FromCloudFormation.getString(properties.S3ObjectKey));
    ret.addPropertyResult('s3ObjectVersion', 'S3ObjectVersion', properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines a Speech Synthesis Markup Language (SSML) prompt.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html
     */
    export interface SSMLMessageProperty {
        /**
         * The SSML text that defines the prompt.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html#cfn-lex-bot-ssmlmessage-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `SSMLMessageProperty`
 *
 * @param properties - the TypeScript properties of a `SSMLMessageProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SSMLMessagePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "SSMLMessageProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SSMLMessage` resource
 *
 * @param properties - the TypeScript properties of a `SSMLMessageProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SSMLMessage` resource.
 */
// @ts-ignore TS6133
function cfnBotSSMLMessagePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SSMLMessagePropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBotSSMLMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SSMLMessageProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SSMLMessageProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * A sample utterance that invokes and intent or responds to a slot elicitation prompt.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html
     */
    export interface SampleUtteranceProperty {
        /**
         * The sample utterance that Amazon Lex uses to build its machine-learning model to recognize intents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html#cfn-lex-bot-sampleutterance-utterance
         */
        readonly utterance: string;
    }
}

/**
 * Determine whether the given properties match those of a `SampleUtteranceProperty`
 *
 * @param properties - the TypeScript properties of a `SampleUtteranceProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SampleUtterancePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('utterance', cdk.requiredValidator)(properties.utterance));
    errors.collect(cdk.propertyValidator('utterance', cdk.validateString)(properties.utterance));
    return errors.wrap('supplied properties not correct for "SampleUtteranceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SampleUtterance` resource
 *
 * @param properties - the TypeScript properties of a `SampleUtteranceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SampleUtterance` resource.
 */
// @ts-ignore TS6133
function cfnBotSampleUtterancePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SampleUtterancePropertyValidator(properties).assertSuccess();
    return {
        Utterance: cdk.stringToCloudFormation(properties.utterance),
    };
}

// @ts-ignore TS6133
function CfnBotSampleUtterancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SampleUtteranceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SampleUtteranceProperty>();
    ret.addPropertyResult('utterance', 'Utterance', cfn_parse.FromCloudFormation.getString(properties.Utterance));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines one of the values for a slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html
     */
    export interface SampleValueProperty {
        /**
         * The value that can be used for a slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html#cfn-lex-bot-samplevalue-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `SampleValueProperty`
 *
 * @param properties - the TypeScript properties of a `SampleValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SampleValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "SampleValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SampleValue` resource
 *
 * @param properties - the TypeScript properties of a `SampleValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SampleValue` resource.
 */
// @ts-ignore TS6133
function cfnBotSampleValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SampleValuePropertyValidator(properties).assertSuccess();
    return {
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnBotSampleValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SampleValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SampleValueProperty>();
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html
     */
    export interface SentimentAnalysisSettingsProperty {
        /**
         * `CfnBot.SentimentAnalysisSettingsProperty.DetectSentiment`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html#cfn-lex-bot-sentimentanalysissettings-detectsentiment
         */
        readonly detectSentiment: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SentimentAnalysisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SentimentAnalysisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('detectSentiment', cdk.requiredValidator)(properties.detectSentiment));
    errors.collect(cdk.propertyValidator('detectSentiment', cdk.validateBoolean)(properties.detectSentiment));
    return errors.wrap('supplied properties not correct for "SentimentAnalysisSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SentimentAnalysisSettings` resource
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SentimentAnalysisSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotSentimentAnalysisSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SentimentAnalysisSettingsPropertyValidator(properties).assertSuccess();
    return {
        DetectSentiment: cdk.booleanToCloudFormation(properties.detectSentiment),
    };
}

// @ts-ignore TS6133
function CfnBotSentimentAnalysisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SentimentAnalysisSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SentimentAnalysisSettingsProperty>();
    ret.addPropertyResult('detectSentiment', 'DetectSentiment', cfn_parse.FromCloudFormation.getBoolean(properties.DetectSentiment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the definition of a slot. Amazon Lex elicits slot values from uses to fulfill the user's intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html
     */
    export interface SlotProperty {
        /**
         * A description of the slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-description
         */
        readonly description?: string;
        /**
         * Determines whether the slot can return multiple values to the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-multiplevaluessetting
         */
        readonly multipleValuesSetting?: CfnBot.MultipleValuesSettingProperty | cdk.IResolvable;
        /**
         * The name of the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-name
         */
        readonly name: string;
        /**
         * Determines whether the contents of the slot are obfuscated in Amazon CloudWatch Logs logs. Use obfuscated slots to protect information such as personally identifiable information (PII) in logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-obfuscationsetting
         */
        readonly obfuscationSetting?: CfnBot.ObfuscationSettingProperty | cdk.IResolvable;
        /**
         * The name of the slot type that this slot is based on. The slot type defines the acceptable values for the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-slottypename
         */
        readonly slotTypeName: string;
        /**
         * Determines the slot resolution strategy that Amazon Lex uses to return slot type values. The field can be set to one of the following values:
         *
         * - OriginalValue - Returns the value entered by the user, if the user value is similar to a slot value.
         * - TopResolution - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
         *
         * If you don't specify the valueSelectionStrategy, the default is OriginalValue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-valueelicitationsetting
         */
        readonly valueElicitationSetting: CfnBot.SlotValueElicitationSettingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SlotProperty`
 *
 * @param properties - the TypeScript properties of a `SlotProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('multipleValuesSetting', CfnBot_MultipleValuesSettingPropertyValidator)(properties.multipleValuesSetting));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('obfuscationSetting', CfnBot_ObfuscationSettingPropertyValidator)(properties.obfuscationSetting));
    errors.collect(cdk.propertyValidator('slotTypeName', cdk.requiredValidator)(properties.slotTypeName));
    errors.collect(cdk.propertyValidator('slotTypeName', cdk.validateString)(properties.slotTypeName));
    errors.collect(cdk.propertyValidator('valueElicitationSetting', cdk.requiredValidator)(properties.valueElicitationSetting));
    errors.collect(cdk.propertyValidator('valueElicitationSetting', CfnBot_SlotValueElicitationSettingPropertyValidator)(properties.valueElicitationSetting));
    return errors.wrap('supplied properties not correct for "SlotProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.Slot` resource
 *
 * @param properties - the TypeScript properties of a `SlotProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.Slot` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotPropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        MultipleValuesSetting: cfnBotMultipleValuesSettingPropertyToCloudFormation(properties.multipleValuesSetting),
        Name: cdk.stringToCloudFormation(properties.name),
        ObfuscationSetting: cfnBotObfuscationSettingPropertyToCloudFormation(properties.obfuscationSetting),
        SlotTypeName: cdk.stringToCloudFormation(properties.slotTypeName),
        ValueElicitationSetting: cfnBotSlotValueElicitationSettingPropertyToCloudFormation(properties.valueElicitationSetting),
    };
}

// @ts-ignore TS6133
function CfnBotSlotPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('multipleValuesSetting', 'MultipleValuesSetting', properties.MultipleValuesSetting != null ? CfnBotMultipleValuesSettingPropertyFromCloudFormation(properties.MultipleValuesSetting) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('obfuscationSetting', 'ObfuscationSetting', properties.ObfuscationSetting != null ? CfnBotObfuscationSettingPropertyFromCloudFormation(properties.ObfuscationSetting) : undefined);
    ret.addPropertyResult('slotTypeName', 'SlotTypeName', cfn_parse.FromCloudFormation.getString(properties.SlotTypeName));
    ret.addPropertyResult('valueElicitationSetting', 'ValueElicitationSetting', CfnBotSlotValueElicitationSettingPropertyFromCloudFormation(properties.ValueElicitationSetting));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the default value to use when a user doesn't provide a value for a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html
     */
    export interface SlotDefaultValueProperty {
        /**
         * The default value to use when a user doesn't provide a value for a slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html#cfn-lex-bot-slotdefaultvalue-defaultvalue
         */
        readonly defaultValue: string;
    }
}

/**
 * Determine whether the given properties match those of a `SlotDefaultValueProperty`
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotDefaultValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValue', cdk.requiredValidator)(properties.defaultValue));
    errors.collect(cdk.propertyValidator('defaultValue', cdk.validateString)(properties.defaultValue));
    return errors.wrap('supplied properties not correct for "SlotDefaultValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotDefaultValue` resource
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotDefaultValue` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotDefaultValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotDefaultValuePropertyValidator(properties).assertSuccess();
    return {
        DefaultValue: cdk.stringToCloudFormation(properties.defaultValue),
    };
}

// @ts-ignore TS6133
function CfnBotSlotDefaultValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotDefaultValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotDefaultValueProperty>();
    ret.addPropertyResult('defaultValue', 'DefaultValue', cfn_parse.FromCloudFormation.getString(properties.DefaultValue));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines a list of values that Amazon Lex should use as the default value for a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html
     */
    export interface SlotDefaultValueSpecificationProperty {
        /**
         * A list of default values. Amazon Lex chooses the default value to use in the order that they are presented in the list.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html#cfn-lex-bot-slotdefaultvaluespecification-defaultvaluelist
         */
        readonly defaultValueList: Array<CfnBot.SlotDefaultValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SlotDefaultValueSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotDefaultValueSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValueList', cdk.requiredValidator)(properties.defaultValueList));
    errors.collect(cdk.propertyValidator('defaultValueList', cdk.listValidator(CfnBot_SlotDefaultValuePropertyValidator))(properties.defaultValueList));
    return errors.wrap('supplied properties not correct for "SlotDefaultValueSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotDefaultValueSpecification` resource
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotDefaultValueSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotDefaultValueSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotDefaultValueSpecificationPropertyValidator(properties).assertSuccess();
    return {
        DefaultValueList: cdk.listMapper(cfnBotSlotDefaultValuePropertyToCloudFormation)(properties.defaultValueList),
    };
}

// @ts-ignore TS6133
function CfnBotSlotDefaultValueSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotDefaultValueSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotDefaultValueSpecificationProperty>();
    ret.addPropertyResult('defaultValueList', 'DefaultValueList', cfn_parse.FromCloudFormation.getArray(CfnBotSlotDefaultValuePropertyFromCloudFormation)(properties.DefaultValueList));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Sets the priority that Amazon Lex should use when eliciting slots values from a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html
     */
    export interface SlotPriorityProperty {
        /**
         * The priority that Amazon Lex should apply to the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html#cfn-lex-bot-slotpriority-priority
         */
        readonly priority: number;
        /**
         * The name of the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html#cfn-lex-bot-slotpriority-slotname
         */
        readonly slotName: string;
    }
}

/**
 * Determine whether the given properties match those of a `SlotPriorityProperty`
 *
 * @param properties - the TypeScript properties of a `SlotPriorityProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotPriorityPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    errors.collect(cdk.propertyValidator('slotName', cdk.requiredValidator)(properties.slotName));
    errors.collect(cdk.propertyValidator('slotName', cdk.validateString)(properties.slotName));
    return errors.wrap('supplied properties not correct for "SlotPriorityProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotPriority` resource
 *
 * @param properties - the TypeScript properties of a `SlotPriorityProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotPriority` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotPriorityPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotPriorityPropertyValidator(properties).assertSuccess();
    return {
        Priority: cdk.numberToCloudFormation(properties.priority),
        SlotName: cdk.stringToCloudFormation(properties.slotName),
    };
}

// @ts-ignore TS6133
function CfnBotSlotPriorityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotPriorityProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotPriorityProperty>();
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addPropertyResult('slotName', 'SlotName', cfn_parse.FromCloudFormation.getString(properties.SlotName));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Describes a slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html
     */
    export interface SlotTypeProperty {
        /**
         * A description of the slot type. Use the description to help identify the slot type in lists.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-description
         */
        readonly description?: string;
        /**
         * Sets the type of external information used to create the slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-externalsourcesetting
         */
        readonly externalSourceSetting?: CfnBot.ExternalSourceSettingProperty | cdk.IResolvable;
        /**
         * The name of the slot type. A slot type name must be unique withing the account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-name
         */
        readonly name: string;
        /**
         * The built-in slot type used as a parent of this slot type. When you define a parent slot type, the new slot type has the configuration of the parent lot type.
         *
         * Only AMAZON.AlphaNumeric is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-parentslottypesignature
         */
        readonly parentSlotTypeSignature?: string;
        /**
         * A list of SlotTypeValue objects that defines the values that the slot type can take. Each value can have a list of synonyms, additional values that help train the machine learning model about the values that it resolves for the slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-slottypevalues
         */
        readonly slotTypeValues?: Array<CfnBot.SlotTypeValueProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Determines the slot resolution strategy that Amazon Lex uses to return slot type values. The field can be set to one of the following values:
         *
         * - OriginalValue - Returns the value entered by the user, if the user value is similar to a slot value.
         * - TopResolution - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
         *
         * If you don't specify the valueSelectionStrategy, the default is OriginalValue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-valueselectionsetting
         */
        readonly valueSelectionSetting?: CfnBot.SlotValueSelectionSettingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SlotTypeProperty`
 *
 * @param properties - the TypeScript properties of a `SlotTypeProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotTypePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('externalSourceSetting', CfnBot_ExternalSourceSettingPropertyValidator)(properties.externalSourceSetting));
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('parentSlotTypeSignature', cdk.validateString)(properties.parentSlotTypeSignature));
    errors.collect(cdk.propertyValidator('slotTypeValues', cdk.listValidator(CfnBot_SlotTypeValuePropertyValidator))(properties.slotTypeValues));
    errors.collect(cdk.propertyValidator('valueSelectionSetting', CfnBot_SlotValueSelectionSettingPropertyValidator)(properties.valueSelectionSetting));
    return errors.wrap('supplied properties not correct for "SlotTypeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotType` resource
 *
 * @param properties - the TypeScript properties of a `SlotTypeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotType` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotTypePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotTypePropertyValidator(properties).assertSuccess();
    return {
        Description: cdk.stringToCloudFormation(properties.description),
        ExternalSourceSetting: cfnBotExternalSourceSettingPropertyToCloudFormation(properties.externalSourceSetting),
        Name: cdk.stringToCloudFormation(properties.name),
        ParentSlotTypeSignature: cdk.stringToCloudFormation(properties.parentSlotTypeSignature),
        SlotTypeValues: cdk.listMapper(cfnBotSlotTypeValuePropertyToCloudFormation)(properties.slotTypeValues),
        ValueSelectionSetting: cfnBotSlotValueSelectionSettingPropertyToCloudFormation(properties.valueSelectionSetting),
    };
}

// @ts-ignore TS6133
function CfnBotSlotTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotTypeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotTypeProperty>();
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('externalSourceSetting', 'ExternalSourceSetting', properties.ExternalSourceSetting != null ? CfnBotExternalSourceSettingPropertyFromCloudFormation(properties.ExternalSourceSetting) : undefined);
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addPropertyResult('parentSlotTypeSignature', 'ParentSlotTypeSignature', properties.ParentSlotTypeSignature != null ? cfn_parse.FromCloudFormation.getString(properties.ParentSlotTypeSignature) : undefined);
    ret.addPropertyResult('slotTypeValues', 'SlotTypeValues', properties.SlotTypeValues != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotTypeValuePropertyFromCloudFormation)(properties.SlotTypeValues) : undefined);
    ret.addPropertyResult('valueSelectionSetting', 'ValueSelectionSetting', properties.ValueSelectionSetting != null ? CfnBotSlotValueSelectionSettingPropertyFromCloudFormation(properties.ValueSelectionSetting) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Each slot type can have a set of values. The `SlotTypeValue` represents a value that the slot type can take.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html
     */
    export interface SlotTypeValueProperty {
        /**
         * The value of the slot type entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html#cfn-lex-bot-slottypevalue-samplevalue
         */
        readonly sampleValue: CfnBot.SampleValueProperty | cdk.IResolvable;
        /**
         * Additional values related to the slot type entry.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html#cfn-lex-bot-slottypevalue-synonyms
         */
        readonly synonyms?: Array<CfnBot.SampleValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SlotTypeValueProperty`
 *
 * @param properties - the TypeScript properties of a `SlotTypeValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotTypeValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sampleValue', cdk.requiredValidator)(properties.sampleValue));
    errors.collect(cdk.propertyValidator('sampleValue', CfnBot_SampleValuePropertyValidator)(properties.sampleValue));
    errors.collect(cdk.propertyValidator('synonyms', cdk.listValidator(CfnBot_SampleValuePropertyValidator))(properties.synonyms));
    return errors.wrap('supplied properties not correct for "SlotTypeValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotTypeValue` resource
 *
 * @param properties - the TypeScript properties of a `SlotTypeValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotTypeValue` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotTypeValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotTypeValuePropertyValidator(properties).assertSuccess();
    return {
        SampleValue: cfnBotSampleValuePropertyToCloudFormation(properties.sampleValue),
        Synonyms: cdk.listMapper(cfnBotSampleValuePropertyToCloudFormation)(properties.synonyms),
    };
}

// @ts-ignore TS6133
function CfnBotSlotTypeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotTypeValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotTypeValueProperty>();
    ret.addPropertyResult('sampleValue', 'SampleValue', CfnBotSampleValuePropertyFromCloudFormation(properties.SampleValue));
    ret.addPropertyResult('synonyms', 'Synonyms', properties.Synonyms != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleValuePropertyFromCloudFormation)(properties.Synonyms) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Settings that you can use for eliciting a slot value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html
     */
    export interface SlotValueElicitationSettingProperty {
        /**
         * A list of default values for a slot. Default values are used when Amazon Lex hasn't determined a value for a slot. You can specify default values from context variables, session attributes, and defined values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-defaultvaluespecification
         */
        readonly defaultValueSpecification?: CfnBot.SlotDefaultValueSpecificationProperty | cdk.IResolvable;
        /**
         * The prompt that Amazon Lex uses to elicit the slot value from the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-promptspecification
         */
        readonly promptSpecification?: CfnBot.PromptSpecificationProperty | cdk.IResolvable;
        /**
         * If you know a specific pattern that users might respond to an Amazon Lex request for a slot value, you can provide those utterances to improve accuracy. This is optional. In most cases Amazon Lex is capable of understanding user utterances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-sampleutterances
         */
        readonly sampleUtterances?: Array<CfnBot.SampleUtteranceProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies whether the slot is required or optional.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-slotconstraint
         */
        readonly slotConstraint: string;
        /**
         * Specifies the prompts that Amazon Lex uses while a bot is waiting for customer input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-waitandcontinuespecification
         */
        readonly waitAndContinueSpecification?: CfnBot.WaitAndContinueSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SlotValueElicitationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueElicitationSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotValueElicitationSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('defaultValueSpecification', CfnBot_SlotDefaultValueSpecificationPropertyValidator)(properties.defaultValueSpecification));
    errors.collect(cdk.propertyValidator('promptSpecification', CfnBot_PromptSpecificationPropertyValidator)(properties.promptSpecification));
    errors.collect(cdk.propertyValidator('sampleUtterances', cdk.listValidator(CfnBot_SampleUtterancePropertyValidator))(properties.sampleUtterances));
    errors.collect(cdk.propertyValidator('slotConstraint', cdk.requiredValidator)(properties.slotConstraint));
    errors.collect(cdk.propertyValidator('slotConstraint', cdk.validateString)(properties.slotConstraint));
    errors.collect(cdk.propertyValidator('waitAndContinueSpecification', CfnBot_WaitAndContinueSpecificationPropertyValidator)(properties.waitAndContinueSpecification));
    return errors.wrap('supplied properties not correct for "SlotValueElicitationSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueElicitationSetting` resource
 *
 * @param properties - the TypeScript properties of a `SlotValueElicitationSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueElicitationSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotValueElicitationSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotValueElicitationSettingPropertyValidator(properties).assertSuccess();
    return {
        DefaultValueSpecification: cfnBotSlotDefaultValueSpecificationPropertyToCloudFormation(properties.defaultValueSpecification),
        PromptSpecification: cfnBotPromptSpecificationPropertyToCloudFormation(properties.promptSpecification),
        SampleUtterances: cdk.listMapper(cfnBotSampleUtterancePropertyToCloudFormation)(properties.sampleUtterances),
        SlotConstraint: cdk.stringToCloudFormation(properties.slotConstraint),
        WaitAndContinueSpecification: cfnBotWaitAndContinueSpecificationPropertyToCloudFormation(properties.waitAndContinueSpecification),
    };
}

// @ts-ignore TS6133
function CfnBotSlotValueElicitationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotValueElicitationSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueElicitationSettingProperty>();
    ret.addPropertyResult('defaultValueSpecification', 'DefaultValueSpecification', properties.DefaultValueSpecification != null ? CfnBotSlotDefaultValueSpecificationPropertyFromCloudFormation(properties.DefaultValueSpecification) : undefined);
    ret.addPropertyResult('promptSpecification', 'PromptSpecification', properties.PromptSpecification != null ? CfnBotPromptSpecificationPropertyFromCloudFormation(properties.PromptSpecification) : undefined);
    ret.addPropertyResult('sampleUtterances', 'SampleUtterances', properties.SampleUtterances != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleUtterancePropertyFromCloudFormation)(properties.SampleUtterances) : undefined);
    ret.addPropertyResult('slotConstraint', 'SlotConstraint', cfn_parse.FromCloudFormation.getString(properties.SlotConstraint));
    ret.addPropertyResult('waitAndContinueSpecification', 'WaitAndContinueSpecification', properties.WaitAndContinueSpecification != null ? CfnBotWaitAndContinueSpecificationPropertyFromCloudFormation(properties.WaitAndContinueSpecification) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Provides a regular expression used to validate the value of a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueregexfilter.html
     */
    export interface SlotValueRegexFilterProperty {
        /**
         * A regular expression used to validate the value of a slot.
         *
         * Use a standard regular expression. Amazon Lex supports the following characters in the regular expression:
         *
         * - A-Z, a-z
         * - 0-9
         * - Unicode characters ("\ u<Unicode>")
         *
         * Represent Unicode characters with four digits, for example "]u0041" or "\ u005A".
         *
         * The following regular expression operators are not supported:
         *
         * - Infinite repeaters: *, +, or {x,} with no upper bound
         * - Wild card (.)
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueregexfilter.html#cfn-lex-bot-slotvalueregexfilter-pattern
         */
        readonly pattern: string;
    }
}

/**
 * Determine whether the given properties match those of a `SlotValueRegexFilterProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueRegexFilterProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotValueRegexFilterPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pattern', cdk.requiredValidator)(properties.pattern));
    errors.collect(cdk.propertyValidator('pattern', cdk.validateString)(properties.pattern));
    return errors.wrap('supplied properties not correct for "SlotValueRegexFilterProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueRegexFilter` resource
 *
 * @param properties - the TypeScript properties of a `SlotValueRegexFilterProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueRegexFilter` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotValueRegexFilterPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotValueRegexFilterPropertyValidator(properties).assertSuccess();
    return {
        Pattern: cdk.stringToCloudFormation(properties.pattern),
    };
}

// @ts-ignore TS6133
function CfnBotSlotValueRegexFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotValueRegexFilterProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueRegexFilterProperty>();
    ret.addPropertyResult('pattern', 'Pattern', cfn_parse.FromCloudFormation.getString(properties.Pattern));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Contains settings used by Amazon Lex to select a slot value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html
     */
    export interface SlotValueSelectionSettingProperty {
        /**
         * Specifies settings that enable advanced recognition settings for slot values. You can use this to enable using slot values as a custom vocabulary for recognizing user utterances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-advancedrecognitionsetting
         */
        readonly advancedRecognitionSetting?: CfnBot.AdvancedRecognitionSettingProperty | cdk.IResolvable;
        /**
         * A regular expression used to validate the value of a slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-regexfilter
         */
        readonly regexFilter?: CfnBot.SlotValueRegexFilterProperty | cdk.IResolvable;
        /**
         * Determines the slot resolution strategy that Amazon Lex uses to return slot type values. The field can be set to one of the following values:
         *
         * - OriginalValue - Returns the value entered by the user, if the user value is similar to a slot value.
         * - TopResolution - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
         *
         * If you don't specify the valueSelectionStrategy, the default is OriginalValue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-resolutionstrategy
         */
        readonly resolutionStrategy: string;
    }
}

/**
 * Determine whether the given properties match those of a `SlotValueSelectionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueSelectionSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_SlotValueSelectionSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('advancedRecognitionSetting', CfnBot_AdvancedRecognitionSettingPropertyValidator)(properties.advancedRecognitionSetting));
    errors.collect(cdk.propertyValidator('regexFilter', CfnBot_SlotValueRegexFilterPropertyValidator)(properties.regexFilter));
    errors.collect(cdk.propertyValidator('resolutionStrategy', cdk.requiredValidator)(properties.resolutionStrategy));
    errors.collect(cdk.propertyValidator('resolutionStrategy', cdk.validateString)(properties.resolutionStrategy));
    return errors.wrap('supplied properties not correct for "SlotValueSelectionSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueSelectionSetting` resource
 *
 * @param properties - the TypeScript properties of a `SlotValueSelectionSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.SlotValueSelectionSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotSlotValueSelectionSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_SlotValueSelectionSettingPropertyValidator(properties).assertSuccess();
    return {
        AdvancedRecognitionSetting: cfnBotAdvancedRecognitionSettingPropertyToCloudFormation(properties.advancedRecognitionSetting),
        RegexFilter: cfnBotSlotValueRegexFilterPropertyToCloudFormation(properties.regexFilter),
        ResolutionStrategy: cdk.stringToCloudFormation(properties.resolutionStrategy),
    };
}

// @ts-ignore TS6133
function CfnBotSlotValueSelectionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.SlotValueSelectionSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueSelectionSettingProperty>();
    ret.addPropertyResult('advancedRecognitionSetting', 'AdvancedRecognitionSetting', properties.AdvancedRecognitionSetting != null ? CfnBotAdvancedRecognitionSettingPropertyFromCloudFormation(properties.AdvancedRecognitionSetting) : undefined);
    ret.addPropertyResult('regexFilter', 'RegexFilter', properties.RegexFilter != null ? CfnBotSlotValueRegexFilterPropertyFromCloudFormation(properties.RegexFilter) : undefined);
    ret.addPropertyResult('resolutionStrategy', 'ResolutionStrategy', cfn_parse.FromCloudFormation.getString(properties.ResolutionStrategy));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Defines the messages that Amazon Lex sends to a user to remind them that the bot is waiting for a response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html
     */
    export interface StillWaitingResponseSpecificationProperty {
        /**
         * Indicates that the user can interrupt the response by speaking while the message is being played.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-allowinterrupt
         */
        readonly allowInterrupt?: boolean | cdk.IResolvable;
        /**
         * How often a message should be sent to the user. Minimum of 1 second, maximum of 5 minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-frequencyinseconds
         */
        readonly frequencyInSeconds: number;
        /**
         * A collection of responses that Amazon Lex can send to the user. Amazon Lex chooses the actual response to send at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-messagegroupslist
         */
        readonly messageGroupsList: Array<CfnBot.MessageGroupProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * If Amazon Lex waits longer than this length of time for a response, it will stop sending messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-timeoutinseconds
         */
        readonly timeoutInSeconds: number;
    }
}

/**
 * Determine whether the given properties match those of a `StillWaitingResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `StillWaitingResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_StillWaitingResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allowInterrupt', cdk.validateBoolean)(properties.allowInterrupt));
    errors.collect(cdk.propertyValidator('frequencyInSeconds', cdk.requiredValidator)(properties.frequencyInSeconds));
    errors.collect(cdk.propertyValidator('frequencyInSeconds', cdk.validateNumber)(properties.frequencyInSeconds));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.requiredValidator)(properties.messageGroupsList));
    errors.collect(cdk.propertyValidator('messageGroupsList', cdk.listValidator(CfnBot_MessageGroupPropertyValidator))(properties.messageGroupsList));
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.requiredValidator)(properties.timeoutInSeconds));
    errors.collect(cdk.propertyValidator('timeoutInSeconds', cdk.validateNumber)(properties.timeoutInSeconds));
    return errors.wrap('supplied properties not correct for "StillWaitingResponseSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.StillWaitingResponseSpecification` resource
 *
 * @param properties - the TypeScript properties of a `StillWaitingResponseSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.StillWaitingResponseSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotStillWaitingResponseSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_StillWaitingResponseSpecificationPropertyValidator(properties).assertSuccess();
    return {
        AllowInterrupt: cdk.booleanToCloudFormation(properties.allowInterrupt),
        FrequencyInSeconds: cdk.numberToCloudFormation(properties.frequencyInSeconds),
        MessageGroupsList: cdk.listMapper(cfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList),
        TimeoutInSeconds: cdk.numberToCloudFormation(properties.timeoutInSeconds),
    };
}

// @ts-ignore TS6133
function CfnBotStillWaitingResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.StillWaitingResponseSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.StillWaitingResponseSpecificationProperty>();
    ret.addPropertyResult('allowInterrupt', 'AllowInterrupt', properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined);
    ret.addPropertyResult('frequencyInSeconds', 'FrequencyInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.FrequencyInSeconds));
    ret.addPropertyResult('messageGroupsList', 'MessageGroupsList', cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList));
    ret.addPropertyResult('timeoutInSeconds', 'TimeoutInSeconds', cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies configuration settings for the alias used to test the bot. If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html
     */
    export interface TestBotAliasSettingsProperty {
        /**
         * Specifies settings that are unique to a locale. For example, you can use a different Lambda function depending on the bot's locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-botaliaslocalesettings
         */
        readonly botAliasLocaleSettings?: Array<CfnBot.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies settings for conversation logs that save audio, text, and metadata information for conversations with your users.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-conversationlogsettings
         */
        readonly conversationLogSettings?: CfnBot.ConversationLogSettingsProperty | cdk.IResolvable;
        /**
         * Specifies a description for the test bot alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-description
         */
        readonly description?: string;
        /**
         * Specifies whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-sentimentanalysissettings
         */
        readonly sentimentAnalysisSettings?: any | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TestBotAliasSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TestBotAliasSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_TestBotAliasSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botAliasLocaleSettings', cdk.listValidator(CfnBot_BotAliasLocaleSettingsItemPropertyValidator))(properties.botAliasLocaleSettings));
    errors.collect(cdk.propertyValidator('conversationLogSettings', CfnBot_ConversationLogSettingsPropertyValidator)(properties.conversationLogSettings));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('sentimentAnalysisSettings', cdk.validateObject)(properties.sentimentAnalysisSettings));
    return errors.wrap('supplied properties not correct for "TestBotAliasSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.TestBotAliasSettings` resource
 *
 * @param properties - the TypeScript properties of a `TestBotAliasSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.TestBotAliasSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotTestBotAliasSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_TestBotAliasSettingsPropertyValidator(properties).assertSuccess();
    return {
        BotAliasLocaleSettings: cdk.listMapper(cfnBotBotAliasLocaleSettingsItemPropertyToCloudFormation)(properties.botAliasLocaleSettings),
        ConversationLogSettings: cfnBotConversationLogSettingsPropertyToCloudFormation(properties.conversationLogSettings),
        Description: cdk.stringToCloudFormation(properties.description),
        SentimentAnalysisSettings: cdk.objectToCloudFormation(properties.sentimentAnalysisSettings),
    };
}

// @ts-ignore TS6133
function CfnBotTestBotAliasSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.TestBotAliasSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TestBotAliasSettingsProperty>();
    ret.addPropertyResult('botAliasLocaleSettings', 'BotAliasLocaleSettings', properties.BotAliasLocaleSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotBotAliasLocaleSettingsItemPropertyFromCloudFormation)(properties.BotAliasLocaleSettings) : undefined);
    ret.addPropertyResult('conversationLogSettings', 'ConversationLogSettings', properties.ConversationLogSettings != null ? CfnBotConversationLogSettingsPropertyFromCloudFormation(properties.ConversationLogSettings) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('sentimentAnalysisSettings', 'SentimentAnalysisSettings', properties.SentimentAnalysisSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.SentimentAnalysisSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html
     */
    export interface TextInputSpecificationProperty {
        /**
         * `CfnBot.TextInputSpecificationProperty.StartTimeoutMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html#cfn-lex-bot-textinputspecification-starttimeoutms
         */
        readonly startTimeoutMs: number;
    }
}

/**
 * Determine whether the given properties match those of a `TextInputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `TextInputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_TextInputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('startTimeoutMs', cdk.requiredValidator)(properties.startTimeoutMs));
    errors.collect(cdk.propertyValidator('startTimeoutMs', cdk.validateNumber)(properties.startTimeoutMs));
    return errors.wrap('supplied properties not correct for "TextInputSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.TextInputSpecification` resource
 *
 * @param properties - the TypeScript properties of a `TextInputSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.TextInputSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotTextInputSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_TextInputSpecificationPropertyValidator(properties).assertSuccess();
    return {
        StartTimeoutMs: cdk.numberToCloudFormation(properties.startTimeoutMs),
    };
}

// @ts-ignore TS6133
function CfnBotTextInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.TextInputSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextInputSpecificationProperty>();
    ret.addPropertyResult('startTimeoutMs', 'StartTimeoutMs', cfn_parse.FromCloudFormation.getNumber(properties.StartTimeoutMs));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html
     */
    export interface TextLogDestinationProperty {
        /**
         * Specifies the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html#cfn-lex-bot-textlogdestination-cloudwatch
         */
        readonly cloudWatch: CfnBot.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TextLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_TextLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatch', cdk.requiredValidator)(properties.cloudWatch));
    errors.collect(cdk.propertyValidator('cloudWatch', CfnBot_CloudWatchLogGroupLogDestinationPropertyValidator)(properties.cloudWatch));
    return errors.wrap('supplied properties not correct for "TextLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.TextLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.TextLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotTextLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_TextLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatch: cfnBotCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties.cloudWatch),
    };
}

// @ts-ignore TS6133
function CfnBotTextLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.TextLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextLogDestinationProperty>();
    ret.addPropertyResult('cloudWatch', 'CloudWatch', CfnBotCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties.CloudWatch));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies settings to enable conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html
     */
    export interface TextLogSettingProperty {
        /**
         * Specifies the Amazon CloudWatch Logs destination log group for conversation text logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html#cfn-lex-bot-textlogsetting-destination
         */
        readonly destination: CfnBot.TextLogDestinationProperty | cdk.IResolvable;
        /**
         * Specifies whether conversation logs should be stored for an alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html#cfn-lex-bot-textlogsetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TextLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_TextLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBot_TextLogDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TextLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.TextLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.TextLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotTextLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_TextLogSettingPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBotTextLogDestinationPropertyToCloudFormation(properties.destination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotTextLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.TextLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextLogSettingProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBotTextLogDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Identifies the Amazon Polly voice used for audio interaction with the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html
     */
    export interface VoiceSettingsProperty {
        /**
         * `CfnBot.VoiceSettingsProperty.Engine`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html#cfn-lex-bot-voicesettings-engine
         */
        readonly engine?: string;
        /**
         * The Amazon Polly voice used for voice interaction with the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html#cfn-lex-bot-voicesettings-voiceid
         */
        readonly voiceId: string;
    }
}

/**
 * Determine whether the given properties match those of a `VoiceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VoiceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_VoiceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('engine', cdk.validateString)(properties.engine));
    errors.collect(cdk.propertyValidator('voiceId', cdk.requiredValidator)(properties.voiceId));
    errors.collect(cdk.propertyValidator('voiceId', cdk.validateString)(properties.voiceId));
    return errors.wrap('supplied properties not correct for "VoiceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.VoiceSettings` resource
 *
 * @param properties - the TypeScript properties of a `VoiceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.VoiceSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotVoiceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_VoiceSettingsPropertyValidator(properties).assertSuccess();
    return {
        Engine: cdk.stringToCloudFormation(properties.engine),
        VoiceId: cdk.stringToCloudFormation(properties.voiceId),
    };
}

// @ts-ignore TS6133
function CfnBotVoiceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.VoiceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.VoiceSettingsProperty>();
    ret.addPropertyResult('engine', 'Engine', properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined);
    ret.addPropertyResult('voiceId', 'VoiceId', cfn_parse.FromCloudFormation.getString(properties.VoiceId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBot {
    /**
     * Specifies the prompts that Amazon Lex uses while a bot is waiting for customer input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html
     */
    export interface WaitAndContinueSpecificationProperty {
        /**
         * The response that Amazon Lex sends to indicate that the bot is ready to continue the conversation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-continueresponse
         */
        readonly continueResponse: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
        /**
         * Specifies whether the bot will wait for a user to respond. When this field is false, wait and continue responses for a slot aren't used and the bot expects an appropriate response within the configured timeout. If the IsActive field isn't specified, the default is true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-isactive
         */
        readonly isActive?: boolean | cdk.IResolvable;
        /**
         * A response that Amazon Lex sends periodically to the user to indicate that the bot is still waiting for input from the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-stillwaitingresponse
         */
        readonly stillWaitingResponse?: CfnBot.StillWaitingResponseSpecificationProperty | cdk.IResolvable;
        /**
         * The response that Amazon Lex sends to indicate that the bot is waiting for the conversation to continue.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-waitingresponse
         */
        readonly waitingResponse: CfnBot.ResponseSpecificationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `WaitAndContinueSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `WaitAndContinueSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBot_WaitAndContinueSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('continueResponse', cdk.requiredValidator)(properties.continueResponse));
    errors.collect(cdk.propertyValidator('continueResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.continueResponse));
    errors.collect(cdk.propertyValidator('isActive', cdk.validateBoolean)(properties.isActive));
    errors.collect(cdk.propertyValidator('stillWaitingResponse', CfnBot_StillWaitingResponseSpecificationPropertyValidator)(properties.stillWaitingResponse));
    errors.collect(cdk.propertyValidator('waitingResponse', cdk.requiredValidator)(properties.waitingResponse));
    errors.collect(cdk.propertyValidator('waitingResponse', CfnBot_ResponseSpecificationPropertyValidator)(properties.waitingResponse));
    return errors.wrap('supplied properties not correct for "WaitAndContinueSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::Bot.WaitAndContinueSpecification` resource
 *
 * @param properties - the TypeScript properties of a `WaitAndContinueSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::Bot.WaitAndContinueSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotWaitAndContinueSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBot_WaitAndContinueSpecificationPropertyValidator(properties).assertSuccess();
    return {
        ContinueResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.continueResponse),
        IsActive: cdk.booleanToCloudFormation(properties.isActive),
        StillWaitingResponse: cfnBotStillWaitingResponseSpecificationPropertyToCloudFormation(properties.stillWaitingResponse),
        WaitingResponse: cfnBotResponseSpecificationPropertyToCloudFormation(properties.waitingResponse),
    };
}

// @ts-ignore TS6133
function CfnBotWaitAndContinueSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.WaitAndContinueSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.WaitAndContinueSpecificationProperty>();
    ret.addPropertyResult('continueResponse', 'ContinueResponse', CfnBotResponseSpecificationPropertyFromCloudFormation(properties.ContinueResponse));
    ret.addPropertyResult('isActive', 'IsActive', properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined);
    ret.addPropertyResult('stillWaitingResponse', 'StillWaitingResponse', properties.StillWaitingResponse != null ? CfnBotStillWaitingResponseSpecificationPropertyFromCloudFormation(properties.StillWaitingResponse) : undefined);
    ret.addPropertyResult('waitingResponse', 'WaitingResponse', CfnBotResponseSpecificationPropertyFromCloudFormation(properties.WaitingResponse));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBotAlias`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html
 */
export interface CfnBotAliasProps {

    /**
     * The name of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliasname
     */
    readonly botAliasName: string;

    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botid
     */
    readonly botId: string;

    /**
     * Maps configuration information to a specific locale. You can use this parameter to specify a specific Lambda function to run different functions in different locales.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliaslocalesettings
     */
    readonly botAliasLocaleSettings?: Array<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * You can only add tags when you specify an alias.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliastags
     */
    readonly botAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The version of the bot that the bot alias references.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botversion
     */
    readonly botVersion?: string;

    /**
     * Specifies whether Amazon Lex logs text and audio for conversations with the bot. When you enable conversation logs, text logs store text input, transcripts of audio input, and associated metadata in Amazon CloudWatch logs. Audio logs store input in Amazon S3 .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-conversationlogsettings
     */
    readonly conversationLogSettings?: CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable;

    /**
     * The description of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-description
     */
    readonly description?: string;

    /**
     * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-sentimentanalysissettings
     */
    readonly sentimentAnalysisSettings?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnBotAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotAliasProps`
 *
 * @returns the result of the validation.
 */
function CfnBotAliasPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botAliasLocaleSettings', cdk.listValidator(CfnBotAlias_BotAliasLocaleSettingsItemPropertyValidator))(properties.botAliasLocaleSettings));
    errors.collect(cdk.propertyValidator('botAliasName', cdk.requiredValidator)(properties.botAliasName));
    errors.collect(cdk.propertyValidator('botAliasName', cdk.validateString)(properties.botAliasName));
    errors.collect(cdk.propertyValidator('botAliasTags', cdk.listValidator(cdk.validateCfnTag))(properties.botAliasTags));
    errors.collect(cdk.propertyValidator('botId', cdk.requiredValidator)(properties.botId));
    errors.collect(cdk.propertyValidator('botId', cdk.validateString)(properties.botId));
    errors.collect(cdk.propertyValidator('botVersion', cdk.validateString)(properties.botVersion));
    errors.collect(cdk.propertyValidator('conversationLogSettings', CfnBotAlias_ConversationLogSettingsPropertyValidator)(properties.conversationLogSettings));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    errors.collect(cdk.propertyValidator('sentimentAnalysisSettings', cdk.validateObject)(properties.sentimentAnalysisSettings));
    return errors.wrap('supplied properties not correct for "CfnBotAliasProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias` resource
 *
 * @param properties - the TypeScript properties of a `CfnBotAliasProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAliasPropsValidator(properties).assertSuccess();
    return {
        BotAliasName: cdk.stringToCloudFormation(properties.botAliasName),
        BotId: cdk.stringToCloudFormation(properties.botId),
        BotAliasLocaleSettings: cdk.listMapper(cfnBotAliasBotAliasLocaleSettingsItemPropertyToCloudFormation)(properties.botAliasLocaleSettings),
        BotAliasTags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.botAliasTags),
        BotVersion: cdk.stringToCloudFormation(properties.botVersion),
        ConversationLogSettings: cfnBotAliasConversationLogSettingsPropertyToCloudFormation(properties.conversationLogSettings),
        Description: cdk.stringToCloudFormation(properties.description),
        SentimentAnalysisSettings: cdk.objectToCloudFormation(properties.sentimentAnalysisSettings),
    };
}

// @ts-ignore TS6133
function CfnBotAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAliasProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAliasProps>();
    ret.addPropertyResult('botAliasName', 'BotAliasName', cfn_parse.FromCloudFormation.getString(properties.BotAliasName));
    ret.addPropertyResult('botId', 'BotId', cfn_parse.FromCloudFormation.getString(properties.BotId));
    ret.addPropertyResult('botAliasLocaleSettings', 'BotAliasLocaleSettings', properties.BotAliasLocaleSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasBotAliasLocaleSettingsItemPropertyFromCloudFormation)(properties.BotAliasLocaleSettings) : undefined);
    ret.addPropertyResult('botAliasTags', 'BotAliasTags', properties.BotAliasTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.BotAliasTags) : undefined);
    ret.addPropertyResult('botVersion', 'BotVersion', properties.BotVersion != null ? cfn_parse.FromCloudFormation.getString(properties.BotVersion) : undefined);
    ret.addPropertyResult('conversationLogSettings', 'ConversationLogSettings', properties.ConversationLogSettings != null ? CfnBotAliasConversationLogSettingsPropertyFromCloudFormation(properties.ConversationLogSettings) : undefined);
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addPropertyResult('sentimentAnalysisSettings', 'SentimentAnalysisSettings', properties.SentimentAnalysisSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.SentimentAnalysisSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lex::BotAlias`
 *
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies an alias for the specified version of a bot. Use an alias to enable you to change the version of a bot without updating applications that use the bot.
 *
 * For example, you can specify an alias called "PROD" that your applications use to call the Amazon Lex bot.
 *
 * @cloudformationResource AWS::Lex::BotAlias
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html
 */
export class CfnBotAlias extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::BotAlias";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBotAlias {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBotAliasPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBotAlias(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the bot alias.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The unique identifier of the bot alias.
     * @cloudformationAttribute BotAliasId
     */
    public readonly attrBotAliasId: string;

    /**
     * The current status of the bot alias. When the status is Available the alias is ready for use with your bot.
     * @cloudformationAttribute BotAliasStatus
     */
    public readonly attrBotAliasStatus: string;

    /**
     * The name of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliasname
     */
    public botAliasName: string;

    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botid
     */
    public botId: string;

    /**
     * Maps configuration information to a specific locale. You can use this parameter to specify a specific Lambda function to run different functions in different locales.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliaslocalesettings
     */
    public botAliasLocaleSettings: Array<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * An array of key-value pairs to apply to this resource.
     *
     * You can only add tags when you specify an alias.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliastags
     */
    public botAliasTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The version of the bot that the bot alias references.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botversion
     */
    public botVersion: string | undefined;

    /**
     * Specifies whether Amazon Lex logs text and audio for conversations with the bot. When you enable conversation logs, text logs store text input, transcripts of audio input, and associated metadata in Amazon CloudWatch logs. Audio logs store input in Amazon S3 .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-conversationlogsettings
     */
    public conversationLogSettings: CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable | undefined;

    /**
     * The description of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-description
     */
    public description: string | undefined;

    /**
     * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-sentimentanalysissettings
     */
    public sentimentAnalysisSettings: any | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Lex::BotAlias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotAliasProps) {
        super(scope, id, { type: CfnBotAlias.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'botAliasName', this);
        cdk.requireProperty(props, 'botId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrBotAliasId = cdk.Token.asString(this.getAtt('BotAliasId', cdk.ResolutionTypeHint.STRING));
        this.attrBotAliasStatus = cdk.Token.asString(this.getAtt('BotAliasStatus', cdk.ResolutionTypeHint.STRING));

        this.botAliasName = props.botAliasName;
        this.botId = props.botId;
        this.botAliasLocaleSettings = props.botAliasLocaleSettings;
        this.botAliasTags = props.botAliasTags;
        this.botVersion = props.botVersion;
        this.conversationLogSettings = props.conversationLogSettings;
        this.description = props.description;
        this.sentimentAnalysisSettings = props.sentimentAnalysisSettings;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBotAlias.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            botAliasName: this.botAliasName,
            botId: this.botId,
            botAliasLocaleSettings: this.botAliasLocaleSettings,
            botAliasTags: this.botAliasTags,
            botVersion: this.botVersion,
            conversationLogSettings: this.conversationLogSettings,
            description: this.description,
            sentimentAnalysisSettings: this.sentimentAnalysisSettings,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBotAliasPropsToCloudFormation(props);
    }
}

export namespace CfnBotAlias {
    /**
     * Specifies the S3 bucket location where audio logs are stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html
     */
    export interface AudioLogDestinationProperty {
        /**
         * The S3 bucket location where audio logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html#cfn-lex-botalias-audiologdestination-s3bucket
         */
        readonly s3Bucket: CfnBotAlias.S3BucketLogDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_AudioLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('s3Bucket', cdk.requiredValidator)(properties.s3Bucket));
    errors.collect(cdk.propertyValidator('s3Bucket', CfnBotAlias_S3BucketLogDestinationPropertyValidator)(properties.s3Bucket));
    return errors.wrap('supplied properties not correct for "AudioLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.AudioLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.AudioLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasAudioLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_AudioLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        S3Bucket: cfnBotAliasS3BucketLogDestinationPropertyToCloudFormation(properties.s3Bucket),
    };
}

// @ts-ignore TS6133
function CfnBotAliasAudioLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.AudioLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.AudioLogDestinationProperty>();
    ret.addPropertyResult('s3Bucket', 'S3Bucket', CfnBotAliasS3BucketLogDestinationPropertyFromCloudFormation(properties.S3Bucket));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Settings for logging audio of conversations between Amazon Lex and a user. You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html
     */
    export interface AudioLogSettingProperty {
        /**
         * The location of audio log files collected when conversation logging is enabled for a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html#cfn-lex-botalias-audiologsetting-destination
         */
        readonly destination: CfnBotAlias.AudioLogDestinationProperty | cdk.IResolvable;
        /**
         * Determines whether audio logging in enabled for the bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html#cfn-lex-botalias-audiologsetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_AudioLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBotAlias_AudioLogDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "AudioLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.AudioLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.AudioLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasAudioLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_AudioLogSettingPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBotAliasAudioLogDestinationPropertyToCloudFormation(properties.destination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotAliasAudioLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.AudioLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.AudioLogSettingProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBotAliasAudioLogDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Specifies settings that are unique to a locale. For example, you can use different Lambda function depending on the bot's locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html
     */
    export interface BotAliasLocaleSettingsProperty {
        /**
         * Specifies the Lambda function that should be used in the locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html#cfn-lex-botalias-botaliaslocalesettings-codehookspecification
         */
        readonly codeHookSpecification?: CfnBotAlias.CodeHookSpecificationProperty | cdk.IResolvable;
        /**
         * Determines whether the locale is enabled for the bot. If the value is false, the locale isn't available for use.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html#cfn-lex-botalias-botaliaslocalesettings-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_BotAliasLocaleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeHookSpecification', CfnBotAlias_CodeHookSpecificationPropertyValidator)(properties.codeHookSpecification));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "BotAliasLocaleSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.BotAliasLocaleSettings` resource
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.BotAliasLocaleSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasBotAliasLocaleSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_BotAliasLocaleSettingsPropertyValidator(properties).assertSuccess();
    return {
        CodeHookSpecification: cfnBotAliasCodeHookSpecificationPropertyToCloudFormation(properties.codeHookSpecification),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.BotAliasLocaleSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.BotAliasLocaleSettingsProperty>();
    ret.addPropertyResult('codeHookSpecification', 'CodeHookSpecification', properties.CodeHookSpecification != null ? CfnBotAliasCodeHookSpecificationPropertyFromCloudFormation(properties.CodeHookSpecification) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Specifies settings that are unique to a locale. For example, you can use different Lambda function depending on the bot's locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html
     */
    export interface BotAliasLocaleSettingsItemProperty {
        /**
         * Specifies settings that are unique to a locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html#cfn-lex-botalias-botaliaslocalesettingsitem-botaliaslocalesetting
         */
        readonly botAliasLocaleSetting: CfnBotAlias.BotAliasLocaleSettingsProperty | cdk.IResolvable;
        /**
         * The unique identifier of the locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html#cfn-lex-botalias-botaliaslocalesettingsitem-localeid
         */
        readonly localeId: string;
    }
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsItemProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_BotAliasLocaleSettingsItemPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botAliasLocaleSetting', cdk.requiredValidator)(properties.botAliasLocaleSetting));
    errors.collect(cdk.propertyValidator('botAliasLocaleSetting', CfnBotAlias_BotAliasLocaleSettingsPropertyValidator)(properties.botAliasLocaleSetting));
    errors.collect(cdk.propertyValidator('localeId', cdk.requiredValidator)(properties.localeId));
    errors.collect(cdk.propertyValidator('localeId', cdk.validateString)(properties.localeId));
    return errors.wrap('supplied properties not correct for "BotAliasLocaleSettingsItemProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.BotAliasLocaleSettingsItem` resource
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.BotAliasLocaleSettingsItem` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasBotAliasLocaleSettingsItemPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_BotAliasLocaleSettingsItemPropertyValidator(properties).assertSuccess();
    return {
        BotAliasLocaleSetting: cfnBotAliasBotAliasLocaleSettingsPropertyToCloudFormation(properties.botAliasLocaleSetting),
        LocaleId: cdk.stringToCloudFormation(properties.localeId),
    };
}

// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.BotAliasLocaleSettingsItemProperty>();
    ret.addPropertyResult('botAliasLocaleSetting', 'BotAliasLocaleSetting', CfnBotAliasBotAliasLocaleSettingsPropertyFromCloudFormation(properties.BotAliasLocaleSetting));
    ret.addPropertyResult('localeId', 'LocaleId', cfn_parse.FromCloudFormation.getString(properties.LocaleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * The Amazon CloudWatch Logs log group where the text and metadata logs are delivered. The log group must exist before you enable logging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html
     */
    export interface CloudWatchLogGroupLogDestinationProperty {
        /**
         * The Amazon Resource Name (ARN) of the log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html#cfn-lex-botalias-cloudwatchloggrouplogdestination-cloudwatchloggrouparn
         */
        readonly cloudWatchLogGroupArn: string;
        /**
         * The prefix of the log stream name within the log group that you specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html#cfn-lex-botalias-cloudwatchloggrouplogdestination-logprefix
         */
        readonly logPrefix: string;
    }
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_CloudWatchLogGroupLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupArn', cdk.requiredValidator)(properties.cloudWatchLogGroupArn));
    errors.collect(cdk.propertyValidator('cloudWatchLogGroupArn', cdk.validateString)(properties.cloudWatchLogGroupArn));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.requiredValidator)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.validateString)(properties.logPrefix));
    return errors.wrap('supplied properties not correct for "CloudWatchLogGroupLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.CloudWatchLogGroupLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.CloudWatchLogGroupLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_CloudWatchLogGroupLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatchLogGroupArn: cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
        LogPrefix: cdk.stringToCloudFormation(properties.logPrefix),
    };
}

// @ts-ignore TS6133
function CfnBotAliasCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.CloudWatchLogGroupLogDestinationProperty>();
    ret.addPropertyResult('cloudWatchLogGroupArn', 'CloudWatchLogGroupArn', cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn));
    ret.addPropertyResult('logPrefix', 'LogPrefix', cfn_parse.FromCloudFormation.getString(properties.LogPrefix));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Contains information about code hooks that Amazon Lex calls during a conversation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html
     */
    export interface CodeHookSpecificationProperty {
        /**
         * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html#cfn-lex-botalias-codehookspecification-lambdacodehook
         */
        readonly lambdaCodeHook: CfnBotAlias.LambdaCodeHookProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CodeHookSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_CodeHookSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('lambdaCodeHook', cdk.requiredValidator)(properties.lambdaCodeHook));
    errors.collect(cdk.propertyValidator('lambdaCodeHook', CfnBotAlias_LambdaCodeHookPropertyValidator)(properties.lambdaCodeHook));
    return errors.wrap('supplied properties not correct for "CodeHookSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.CodeHookSpecification` resource
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.CodeHookSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasCodeHookSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_CodeHookSpecificationPropertyValidator(properties).assertSuccess();
    return {
        LambdaCodeHook: cfnBotAliasLambdaCodeHookPropertyToCloudFormation(properties.lambdaCodeHook),
    };
}

// @ts-ignore TS6133
function CfnBotAliasCodeHookSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.CodeHookSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.CodeHookSpecificationProperty>();
    ret.addPropertyResult('lambdaCodeHook', 'LambdaCodeHook', CfnBotAliasLambdaCodeHookPropertyFromCloudFormation(properties.LambdaCodeHook));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Configures conversation logging that saves audio, text, and metadata for the conversations with your users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html
     */
    export interface ConversationLogSettingsProperty {
        /**
         * The Amazon S3 settings for logging audio to an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html#cfn-lex-botalias-conversationlogsettings-audiologsettings
         */
        readonly audioLogSettings?: Array<CfnBotAlias.AudioLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon CloudWatch Logs settings for logging text and metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html#cfn-lex-botalias-conversationlogsettings-textlogsettings
         */
        readonly textLogSettings?: Array<CfnBotAlias.TextLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ConversationLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_ConversationLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioLogSettings', cdk.listValidator(CfnBotAlias_AudioLogSettingPropertyValidator))(properties.audioLogSettings));
    errors.collect(cdk.propertyValidator('textLogSettings', cdk.listValidator(CfnBotAlias_TextLogSettingPropertyValidator))(properties.textLogSettings));
    return errors.wrap('supplied properties not correct for "ConversationLogSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.ConversationLogSettings` resource
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.ConversationLogSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasConversationLogSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_ConversationLogSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioLogSettings: cdk.listMapper(cfnBotAliasAudioLogSettingPropertyToCloudFormation)(properties.audioLogSettings),
        TextLogSettings: cdk.listMapper(cfnBotAliasTextLogSettingPropertyToCloudFormation)(properties.textLogSettings),
    };
}

// @ts-ignore TS6133
function CfnBotAliasConversationLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.ConversationLogSettingsProperty>();
    ret.addPropertyResult('audioLogSettings', 'AudioLogSettings', properties.AudioLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasAudioLogSettingPropertyFromCloudFormation)(properties.AudioLogSettings) : undefined);
    ret.addPropertyResult('textLogSettings', 'TextLogSettings', properties.TextLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasTextLogSettingPropertyFromCloudFormation)(properties.TextLogSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html
     */
    export interface LambdaCodeHookProperty {
        /**
         * The version of the request-response that you want Amazon Lex to use to invoke your Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html#cfn-lex-botalias-lambdacodehook-codehookinterfaceversion
         */
        readonly codeHookInterfaceVersion: string;
        /**
         * The Amazon Resource Name (ARN) of the Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html#cfn-lex-botalias-lambdacodehook-lambdaarn
         */
        readonly lambdaArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `LambdaCodeHookProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_LambdaCodeHookPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codeHookInterfaceVersion', cdk.requiredValidator)(properties.codeHookInterfaceVersion));
    errors.collect(cdk.propertyValidator('codeHookInterfaceVersion', cdk.validateString)(properties.codeHookInterfaceVersion));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.requiredValidator)(properties.lambdaArn));
    errors.collect(cdk.propertyValidator('lambdaArn', cdk.validateString)(properties.lambdaArn));
    return errors.wrap('supplied properties not correct for "LambdaCodeHookProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.LambdaCodeHook` resource
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.LambdaCodeHook` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasLambdaCodeHookPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_LambdaCodeHookPropertyValidator(properties).assertSuccess();
    return {
        CodeHookInterfaceVersion: cdk.stringToCloudFormation(properties.codeHookInterfaceVersion),
        LambdaArn: cdk.stringToCloudFormation(properties.lambdaArn),
    };
}

// @ts-ignore TS6133
function CfnBotAliasLambdaCodeHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.LambdaCodeHookProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.LambdaCodeHookProperty>();
    ret.addPropertyResult('codeHookInterfaceVersion', 'CodeHookInterfaceVersion', cfn_parse.FromCloudFormation.getString(properties.CodeHookInterfaceVersion));
    ret.addPropertyResult('lambdaArn', 'LambdaArn', cfn_parse.FromCloudFormation.getString(properties.LambdaArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Specifies an Amazon S3 bucket for logging audio conversations
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html
     */
    export interface S3BucketLogDestinationProperty {
        /**
         * The Amazon Resource Name (ARN) of an AWS Key Management Service key for encrypting audio log files stored in an S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-kmskeyarn
         */
        readonly kmsKeyArn?: string;
        /**
         * The S3 prefix to assign to audio log files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-logprefix
         */
        readonly logPrefix: string;
        /**
         * The Amazon Resource Name (ARN) of an Amazon S3 bucket where audio log files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-s3bucketarn
         */
        readonly s3BucketArn: string;
    }
}

/**
 * Determine whether the given properties match those of a `S3BucketLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_S3BucketLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('kmsKeyArn', cdk.validateString)(properties.kmsKeyArn));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.requiredValidator)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('logPrefix', cdk.validateString)(properties.logPrefix));
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.requiredValidator)(properties.s3BucketArn));
    errors.collect(cdk.propertyValidator('s3BucketArn', cdk.validateString)(properties.s3BucketArn));
    return errors.wrap('supplied properties not correct for "S3BucketLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.S3BucketLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.S3BucketLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasS3BucketLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_S3BucketLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        KmsKeyArn: cdk.stringToCloudFormation(properties.kmsKeyArn),
        LogPrefix: cdk.stringToCloudFormation(properties.logPrefix),
        S3BucketArn: cdk.stringToCloudFormation(properties.s3BucketArn),
    };
}

// @ts-ignore TS6133
function CfnBotAliasS3BucketLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.S3BucketLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.S3BucketLogDestinationProperty>();
    ret.addPropertyResult('kmsKeyArn', 'KmsKeyArn', properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined);
    ret.addPropertyResult('logPrefix', 'LogPrefix', cfn_parse.FromCloudFormation.getString(properties.LogPrefix));
    ret.addPropertyResult('s3BucketArn', 'S3BucketArn', cfn_parse.FromCloudFormation.getString(properties.S3BucketArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html
     */
    export interface SentimentAnalysisSettingsProperty {
        /**
         * `CfnBotAlias.SentimentAnalysisSettingsProperty.DetectSentiment`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html#cfn-lex-botalias-sentimentanalysissettings-detectsentiment
         */
        readonly detectSentiment: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `SentimentAnalysisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_SentimentAnalysisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('detectSentiment', cdk.requiredValidator)(properties.detectSentiment));
    errors.collect(cdk.propertyValidator('detectSentiment', cdk.validateBoolean)(properties.detectSentiment));
    return errors.wrap('supplied properties not correct for "SentimentAnalysisSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.SentimentAnalysisSettings` resource
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.SentimentAnalysisSettings` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasSentimentAnalysisSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_SentimentAnalysisSettingsPropertyValidator(properties).assertSuccess();
    return {
        DetectSentiment: cdk.booleanToCloudFormation(properties.detectSentiment),
    };
}

// @ts-ignore TS6133
function CfnBotAliasSentimentAnalysisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.SentimentAnalysisSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.SentimentAnalysisSettingsProperty>();
    ret.addPropertyResult('detectSentiment', 'DetectSentiment', cfn_parse.FromCloudFormation.getBoolean(properties.DetectSentiment));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html
     */
    export interface TextLogDestinationProperty {
        /**
         * Defines the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html#cfn-lex-botalias-textlogdestination-cloudwatch
         */
        readonly cloudWatch: CfnBotAlias.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TextLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_TextLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cloudWatch', cdk.requiredValidator)(properties.cloudWatch));
    errors.collect(cdk.propertyValidator('cloudWatch', CfnBotAlias_CloudWatchLogGroupLogDestinationPropertyValidator)(properties.cloudWatch));
    return errors.wrap('supplied properties not correct for "TextLogDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.TextLogDestination` resource
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.TextLogDestination` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasTextLogDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_TextLogDestinationPropertyValidator(properties).assertSuccess();
    return {
        CloudWatch: cfnBotAliasCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties.cloudWatch),
    };
}

// @ts-ignore TS6133
function CfnBotAliasTextLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.TextLogDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.TextLogDestinationProperty>();
    ret.addPropertyResult('cloudWatch', 'CloudWatch', CfnBotAliasCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties.CloudWatch));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotAlias {
    /**
     * Defines settings to enable conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html
     */
    export interface TextLogSettingProperty {
        /**
         * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html#cfn-lex-botalias-textlogsetting-destination
         */
        readonly destination: CfnBotAlias.TextLogDestinationProperty | cdk.IResolvable;
        /**
         * Determines whether conversation logs should be stored for an alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html#cfn-lex-botalias-textlogsetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TextLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotAlias_TextLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', cdk.requiredValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('destination', CfnBotAlias_TextLogDestinationPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('enabled', cdk.requiredValidator)(properties.enabled));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TextLogSettingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotAlias.TextLogSetting` resource
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotAlias.TextLogSetting` resource.
 */
// @ts-ignore TS6133
function cfnBotAliasTextLogSettingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotAlias_TextLogSettingPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnBotAliasTextLogDestinationPropertyToCloudFormation(properties.destination),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnBotAliasTextLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.TextLogSettingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.TextLogSettingProperty>();
    ret.addPropertyResult('destination', 'Destination', CfnBotAliasTextLogDestinationPropertyFromCloudFormation(properties.Destination));
    ret.addPropertyResult('enabled', 'Enabled', cfn_parse.FromCloudFormation.getBoolean(properties.Enabled));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnBotVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html
 */
export interface CfnBotVersionProps {

    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botid
     */
    readonly botId: string;

    /**
     * Specifies the locales that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botversionlocalespecification
     */
    readonly botVersionLocaleSpecification: Array<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-description
     */
    readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `CfnBotVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotVersionProps`
 *
 * @returns the result of the validation.
 */
function CfnBotVersionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botId', cdk.requiredValidator)(properties.botId));
    errors.collect(cdk.propertyValidator('botId', cdk.validateString)(properties.botId));
    errors.collect(cdk.propertyValidator('botVersionLocaleSpecification', cdk.requiredValidator)(properties.botVersionLocaleSpecification));
    errors.collect(cdk.propertyValidator('botVersionLocaleSpecification', cdk.listValidator(CfnBotVersion_BotVersionLocaleSpecificationPropertyValidator))(properties.botVersionLocaleSpecification));
    errors.collect(cdk.propertyValidator('description', cdk.validateString)(properties.description));
    return errors.wrap('supplied properties not correct for "CfnBotVersionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotVersion` resource
 *
 * @param properties - the TypeScript properties of a `CfnBotVersionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotVersion` resource.
 */
// @ts-ignore TS6133
function cfnBotVersionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotVersionPropsValidator(properties).assertSuccess();
    return {
        BotId: cdk.stringToCloudFormation(properties.botId),
        BotVersionLocaleSpecification: cdk.listMapper(cfnBotVersionBotVersionLocaleSpecificationPropertyToCloudFormation)(properties.botVersionLocaleSpecification),
        Description: cdk.stringToCloudFormation(properties.description),
    };
}

// @ts-ignore TS6133
function CfnBotVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersionProps>();
    ret.addPropertyResult('botId', 'BotId', cfn_parse.FromCloudFormation.getString(properties.BotId));
    ret.addPropertyResult('botVersionLocaleSpecification', 'BotVersionLocaleSpecification', cfn_parse.FromCloudFormation.getArray(CfnBotVersionBotVersionLocaleSpecificationPropertyFromCloudFormation)(properties.BotVersionLocaleSpecification));
    ret.addPropertyResult('description', 'Description', properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lex::BotVersion`
 *
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies a new version of the bot based on the `DRAFT` version. If the `DRAFT` version of this resource hasn't changed since you created the last version, Amazon Lex doesn't create a new version, it returns the last created version.
 *
 * When you specify the first version of a bot, Amazon Lex sets the version to 1. Subsequent versions increment by 1.
 *
 * @cloudformationResource AWS::Lex::BotVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html
 */
export class CfnBotVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::BotVersion";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBotVersion {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnBotVersionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnBotVersion(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The version of the bot.
     * @cloudformationAttribute BotVersion
     */
    public readonly attrBotVersion: string;

    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botid
     */
    public botId: string;

    /**
     * Specifies the locales that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botversionlocalespecification
     */
    public botVersionLocaleSpecification: Array<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-description
     */
    public description: string | undefined;

    /**
     * Create a new `AWS::Lex::BotVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotVersionProps) {
        super(scope, id, { type: CfnBotVersion.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'botId', this);
        cdk.requireProperty(props, 'botVersionLocaleSpecification', this);
        this.attrBotVersion = cdk.Token.asString(this.getAtt('BotVersion', cdk.ResolutionTypeHint.STRING));

        this.botId = props.botId;
        this.botVersionLocaleSpecification = props.botVersionLocaleSpecification;
        this.description = props.description;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnBotVersion.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            botId: this.botId,
            botVersionLocaleSpecification: this.botVersionLocaleSpecification,
            description: this.description,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnBotVersionPropsToCloudFormation(props);
    }
}

export namespace CfnBotVersion {
    /**
     * The version of a bot used for a bot locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html
     */
    export interface BotVersionLocaleDetailsProperty {
        /**
         * The version of a bot used for a bot locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html#cfn-lex-botversion-botversionlocaledetails-sourcebotversion
         */
        readonly sourceBotVersion: string;
    }
}

/**
 * Determine whether the given properties match those of a `BotVersionLocaleDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleDetailsProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotVersion_BotVersionLocaleDetailsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceBotVersion', cdk.requiredValidator)(properties.sourceBotVersion));
    errors.collect(cdk.propertyValidator('sourceBotVersion', cdk.validateString)(properties.sourceBotVersion));
    return errors.wrap('supplied properties not correct for "BotVersionLocaleDetailsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotVersion.BotVersionLocaleDetails` resource
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleDetailsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotVersion.BotVersionLocaleDetails` resource.
 */
// @ts-ignore TS6133
function cfnBotVersionBotVersionLocaleDetailsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotVersion_BotVersionLocaleDetailsPropertyValidator(properties).assertSuccess();
    return {
        SourceBotVersion: cdk.stringToCloudFormation(properties.sourceBotVersion),
    };
}

// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersion.BotVersionLocaleDetailsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersion.BotVersionLocaleDetailsProperty>();
    ret.addPropertyResult('sourceBotVersion', 'SourceBotVersion', cfn_parse.FromCloudFormation.getString(properties.SourceBotVersion));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnBotVersion {
    /**
     * Specifies the locale that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html
     */
    export interface BotVersionLocaleSpecificationProperty {
        /**
         * The version of a bot used for a bot locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html#cfn-lex-botversion-botversionlocalespecification-botversionlocaledetails
         */
        readonly botVersionLocaleDetails: CfnBotVersion.BotVersionLocaleDetailsProperty | cdk.IResolvable;
        /**
         * The identifier of the locale to add to the version.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html#cfn-lex-botversion-botversionlocalespecification-localeid
         */
        readonly localeId: string;
    }
}

/**
 * Determine whether the given properties match those of a `BotVersionLocaleSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnBotVersion_BotVersionLocaleSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('botVersionLocaleDetails', cdk.requiredValidator)(properties.botVersionLocaleDetails));
    errors.collect(cdk.propertyValidator('botVersionLocaleDetails', CfnBotVersion_BotVersionLocaleDetailsPropertyValidator)(properties.botVersionLocaleDetails));
    errors.collect(cdk.propertyValidator('localeId', cdk.requiredValidator)(properties.localeId));
    errors.collect(cdk.propertyValidator('localeId', cdk.validateString)(properties.localeId));
    return errors.wrap('supplied properties not correct for "BotVersionLocaleSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::BotVersion.BotVersionLocaleSpecification` resource
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::BotVersion.BotVersionLocaleSpecification` resource.
 */
// @ts-ignore TS6133
function cfnBotVersionBotVersionLocaleSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnBotVersion_BotVersionLocaleSpecificationPropertyValidator(properties).assertSuccess();
    return {
        BotVersionLocaleDetails: cfnBotVersionBotVersionLocaleDetailsPropertyToCloudFormation(properties.botVersionLocaleDetails),
        LocaleId: cdk.stringToCloudFormation(properties.localeId),
    };
}

// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersion.BotVersionLocaleSpecificationProperty>();
    ret.addPropertyResult('botVersionLocaleDetails', 'BotVersionLocaleDetails', CfnBotVersionBotVersionLocaleDetailsPropertyFromCloudFormation(properties.BotVersionLocaleDetails));
    ret.addPropertyResult('localeId', 'LocaleId', cfn_parse.FromCloudFormation.getString(properties.LocaleId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {

    /**
     * A resource policy to add to the resource. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow IAM syntax. If the policy isn't valid, Amazon Lex returns a validation exception.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-policy
     */
    readonly policy: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-resourcearn
     */
    readonly resourceArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourcePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policy', cdk.requiredValidator)(properties.policy));
    errors.collect(cdk.propertyValidator('policy', cdk.validateObject)(properties.policy));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.requiredValidator)(properties.resourceArn));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "CfnResourcePolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Lex::ResourcePolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourcePolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Lex::ResourcePolicy` resource.
 */
// @ts-ignore TS6133
function cfnResourcePolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourcePolicyPropsValidator(properties).assertSuccess();
    return {
        Policy: cdk.objectToCloudFormation(properties.policy),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
    ret.addPropertyResult('policy', 'Policy', cfn_parse.FromCloudFormation.getAny(properties.Policy));
    ret.addPropertyResult('resourceArn', 'ResourceArn', cfn_parse.FromCloudFormation.getString(properties.ResourceArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Lex::ResourcePolicy`
 *
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies a new resource policy with the specified policy statements.
 *
 * @cloudformationResource AWS::Lex::ResourcePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::ResourcePolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnResourcePolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnResourcePolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The identifier of the resource policy.
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * Specifies the current revision of a resource policy.
     * @cloudformationAttribute RevisionId
     */
    public readonly attrRevisionId: string;

    /**
     * A resource policy to add to the resource. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow IAM syntax. If the policy isn't valid, Amazon Lex returns a validation exception.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-policy
     */
    public policy: any | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-resourcearn
     */
    public resourceArn: string;

    /**
     * Create a new `AWS::Lex::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
        super(scope, id, { type: CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policy', this);
        cdk.requireProperty(props, 'resourceArn', this);
        this.attrId = cdk.Token.asString(this.getAtt('Id', cdk.ResolutionTypeHint.STRING));
        this.attrRevisionId = cdk.Token.asString(this.getAtt('RevisionId', cdk.ResolutionTypeHint.STRING));

        this.policy = props.policy;
        this.resourceArn = props.resourceArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policy: this.policy,
            resourceArn: this.resourceArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourcePolicyPropsToCloudFormation(props);
    }
}
