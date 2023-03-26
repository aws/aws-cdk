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
export declare class CfnBot extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::Bot";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBot;
    /**
     * The Amazon Resource Name (ARN) of the bot.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier of the bot.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * Provides information on additional privacy protections Amazon Lex should use with the bot's data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-dataprivacy
     */
    dataPrivacy: any | cdk.IResolvable;
    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.
     *
     * A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout.
     *
     * You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-idlesessionttlinseconds
     */
    idleSessionTtlInSeconds: number;
    /**
     * The name of the field to filter the list of bots.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-name
     */
    name: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-rolearn
     */
    roleArn: string;
    /**
     * Indicates whether Amazon Lex V2 should automatically build the locales for the bot after a change.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-autobuildbotlocales
     */
    autoBuildBotLocales: boolean | cdk.IResolvable | undefined;
    /**
     * The Amazon S3 location of files used to import a bot. The files must be in the import format specified in [JSON format for importing and exporting](https://docs.aws.amazon.com/lexv2/latest/dg/import-export-format.html) in the *Amazon Lex developer guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botfiles3location
     */
    botFileS3Location: CfnBot.S3LocationProperty | cdk.IResolvable | undefined;
    /**
     * A list of locales for the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botlocales
     */
    botLocales: Array<CfnBot.BotLocaleProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A list of tags to add to the bot. You can only add tags when you import a bot. You can't use the `UpdateBot` operation to update tags. To update tags, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-bottags
     */
    botTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-description
     */
    description: string | undefined;
    /**
     * Specifies configuration settings for the alias used to test the bot. If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliassettings
     */
    testBotAliasSettings: CfnBot.TestBotAliasSettingsProperty | cdk.IResolvable | undefined;
    /**
     * A list of tags to add to the test alias for a bot. You can only add tags when you import a bot. You can't use the `UpdateAlias` operation to update tags. To update tags on the test alias, use the `TagResource` operation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliastags
     */
    testBotAliasTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Lex::Bot`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnBot {
    /**
     * Specifies settings that enable advanced audio recognition for slot values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html
     */
    interface AdvancedRecognitionSettingProperty {
        /**
         * Specifies that Amazon Lex should use slot values as a custom vocabulary when recognizing user utterances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html#cfn-lex-bot-advancedrecognitionsetting-audiorecognitionstrategy
         */
        readonly audioRecognitionStrategy?: string;
    }
}
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html
     */
    interface AllowedInputTypesProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html
     */
    interface AudioAndDTMFInputSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies the location of audio log files collected when conversation logging is enabled for a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html
     */
    interface AudioLogDestinationProperty {
        /**
         * Specifies the Amazon S3 bucket where the audio files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html#cfn-lex-bot-audiologdestination-s3bucket
         */
        readonly s3Bucket: CfnBot.S3BucketLogDestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies settings for logging the audio of conversations between Amazon Lex and a user. You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html
     */
    interface AudioLogSettingProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html
     */
    interface AudioSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies settings that are unique to a locale. For example, you can use a different Lambda function for each locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html
     */
    interface BotAliasLocaleSettingsProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies locale settings for a single locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html
     */
    interface BotAliasLocaleSettingsItemProperty {
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
export declare namespace CfnBot {
    /**
     * Provides configuration information for a locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html
     */
    interface BotLocaleProperty {
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
export declare namespace CfnBot {
    /**
     * Describes a button to use on a response card used to gather slot values from a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html
     */
    interface ButtonProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies the Amazon CloudWatch Logs log group where text and metadata logs are delivered. The log group must exist before you enable logging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html
     */
    interface CloudWatchLogGroupLogDestinationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies information about code hooks that Amazon Lex calls during a conversation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html
     */
    interface CodeHookSpecificationProperty {
        /**
         * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html#cfn-lex-bot-codehookspecification-lambdacodehook
         */
        readonly lambdaCodeHook: CfnBot.LambdaCodeHookProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies settings that manage logging that saves audio, text, and metadata for the conversations with your users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html
     */
    interface ConversationLogSettingsProperty {
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
export declare namespace CfnBot {
    /**
     * A custom response string that Amazon Lex sends to your application. You define the content and structure of the string.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html
     */
    interface CustomPayloadProperty {
        /**
         * The string that is sent to your application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html#cfn-lex-bot-custompayload-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies a custom vocabulary. A custom vocabulary is a list of words that you expect to be used during a conversation with your bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html
     */
    interface CustomVocabularyProperty {
        /**
         * Specifies a list of words that you expect to be used during a conversation with your bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html#cfn-lex-bot-customvocabulary-customvocabularyitems
         */
        readonly customVocabularyItems: Array<CfnBot.CustomVocabularyItemProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies an entry in a custom vocabulary.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html
     */
    interface CustomVocabularyItemProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html
     */
    interface DTMFSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html
     */
    interface DataPrivacyProperty {
        /**
         * `CfnBot.DataPrivacyProperty.ChildDirected`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html#cfn-lex-bot-dataprivacy-childdirected
         */
        readonly childDirected: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies whether an intent uses the dialog code hook during conversations with a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html
     */
    interface DialogCodeHookSettingProperty {
        /**
         * Indicates whether an intent uses the dialog code hook during a conversation with a user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html#cfn-lex-bot-dialogcodehooksetting-enabled
         */
        readonly enabled: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Provides information about the external source of the slot type's definition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html
     */
    interface ExternalSourceSettingProperty {
        /**
         * Settings required for a slot type based on a grammar that you provide.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html#cfn-lex-bot-externalsourcesetting-grammarslottypesetting
         */
        readonly grammarSlotTypeSetting?: CfnBot.GrammarSlotTypeSettingProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Determines if a Lambda function should be invoked for a specific intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html
     */
    interface FulfillmentCodeHookSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Provides settings for a message that is sent to the user when a fulfillment Lambda function starts running.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html
     */
    interface FulfillmentStartResponseSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Provides information for updating the user on the progress of fulfilling an intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html
     */
    interface FulfillmentUpdateResponseSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Provides information for updating the user on the progress of fulfilling an intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html
     */
    interface FulfillmentUpdatesSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Settings required for a slot type based on a grammar that you provide.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html
     */
    interface GrammarSlotTypeSettingProperty {
        /**
         * The source of the grammar used to create the slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html#cfn-lex-bot-grammarslottypesetting-source
         */
        readonly source?: CfnBot.GrammarSlotTypeSourceProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Describes the Amazon S3 bucket name and location for the grammar that is the source of the slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html
     */
    interface GrammarSlotTypeSourceProperty {
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
export declare namespace CfnBot {
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
    interface ImageResponseCardProperty {
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
export declare namespace CfnBot {
    /**
     * The name of a context that must be active for an intent to be selected by Amazon Lex .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html
     */
    interface InputContextProperty {
        /**
         * The name of the context.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html#cfn-lex-bot-inputcontext-name
         */
        readonly name: string;
    }
}
export declare namespace CfnBot {
    /**
     * Represents an action that the user wants to perform.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html
     */
    interface IntentProperty {
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
export declare namespace CfnBot {
    /**
     * Provides a statement the Amazon Lex conveys to the user when the intent is successfully fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html
     */
    interface IntentClosingSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Provides a prompt for making sure that the user is ready for the intent to be fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html
     */
    interface IntentConfirmationSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Provides configuration information for the AMAZON.KendraSearchIntent intent. When you use this intent, Amazon Lex searches the specified Amazon Kendra index and returns documents from the index that match the user's utterance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html
     */
    interface KendraConfigurationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html
     */
    interface LambdaCodeHookProperty {
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
export declare namespace CfnBot {
    /**
     * The object that provides message text and it's type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html
     */
    interface MessageProperty {
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
export declare namespace CfnBot {
    /**
     * Provides one or more messages that Amazon Lex should send to the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html
     */
    interface MessageGroupProperty {
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
export declare namespace CfnBot {
    /**
     * Indicates whether a slot can return multiple values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-multiplevaluessetting.html
     */
    interface MultipleValuesSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Determines whether Amazon Lex obscures slot values in conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html
     */
    interface ObfuscationSettingProperty {
        /**
         * Value that determines whether Amazon Lex obscures slot values in conversation logs. The default is to obscure the values.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html#cfn-lex-bot-obfuscationsetting-obfuscationsettingtype
         */
        readonly obfuscationSettingType: string;
    }
}
export declare namespace CfnBot {
    /**
     * Describes a session context that is activated when an intent is fulfilled.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html
     */
    interface OutputContextProperty {
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
export declare namespace CfnBot {
    /**
     * Defines an ASCII text message to send to the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html
     */
    interface PlainTextMessageProperty {
        /**
         * The message to send to the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html#cfn-lex-bot-plaintextmessage-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBot {
    /**
     * Provides a setting that determines whether the post-fulfillment response is sent to the user. For more information, see [Post-fulfillment response](https://docs.aws.amazon.com/lex/latest/dg/streaming-progress.html#progress-complete) in the *Amazon Lex developer guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html
     */
    interface PostFulfillmentStatusSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html
     */
    interface PromptAttemptSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies a list of message groups that Amazon Lex sends to a user to elicit a response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html
     */
    interface PromptSpecificationProperty {
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
        readonly promptAttemptsSpecification?: {
            [key: string]: (CfnBot.PromptAttemptSpecificationProperty | cdk.IResolvable);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies a list of message groups that Amazon Lex uses to respond to user input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html
     */
    interface ResponseSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies an Amazon S3 bucket for logging audio conversations.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html
     */
    interface S3BucketLogDestinationProperty {
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
export declare namespace CfnBot {
    /**
     * Defines an Amazon S3 bucket location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html
     */
    interface S3LocationProperty {
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
export declare namespace CfnBot {
    /**
     * Defines a Speech Synthesis Markup Language (SSML) prompt.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html
     */
    interface SSMLMessageProperty {
        /**
         * The SSML text that defines the prompt.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html#cfn-lex-bot-ssmlmessage-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBot {
    /**
     * A sample utterance that invokes and intent or responds to a slot elicitation prompt.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html
     */
    interface SampleUtteranceProperty {
        /**
         * The sample utterance that Amazon Lex uses to build its machine-learning model to recognize intents.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html#cfn-lex-bot-sampleutterance-utterance
         */
        readonly utterance: string;
    }
}
export declare namespace CfnBot {
    /**
     * Defines one of the values for a slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html
     */
    interface SampleValueProperty {
        /**
         * The value that can be used for a slot type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html#cfn-lex-bot-samplevalue-value
         */
        readonly value: string;
    }
}
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html
     */
    interface SentimentAnalysisSettingsProperty {
        /**
         * `CfnBot.SentimentAnalysisSettingsProperty.DetectSentiment`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html#cfn-lex-bot-sentimentanalysissettings-detectsentiment
         */
        readonly detectSentiment: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies the definition of a slot. Amazon Lex elicits slot values from uses to fulfill the user's intent.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html
     */
    interface SlotProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies the default value to use when a user doesn't provide a value for a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html
     */
    interface SlotDefaultValueProperty {
        /**
         * The default value to use when a user doesn't provide a value for a slot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html#cfn-lex-bot-slotdefaultvalue-defaultvalue
         */
        readonly defaultValue: string;
    }
}
export declare namespace CfnBot {
    /**
     * Defines a list of values that Amazon Lex should use as the default value for a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html
     */
    interface SlotDefaultValueSpecificationProperty {
        /**
         * A list of default values. Amazon Lex chooses the default value to use in the order that they are presented in the list.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html#cfn-lex-bot-slotdefaultvaluespecification-defaultvaluelist
         */
        readonly defaultValueList: Array<CfnBot.SlotDefaultValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Sets the priority that Amazon Lex should use when eliciting slots values from a user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html
     */
    interface SlotPriorityProperty {
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
export declare namespace CfnBot {
    /**
     * Describes a slot type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html
     */
    interface SlotTypeProperty {
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
export declare namespace CfnBot {
    /**
     * Each slot type can have a set of values. The `SlotTypeValue` represents a value that the slot type can take.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html
     */
    interface SlotTypeValueProperty {
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
export declare namespace CfnBot {
    /**
     * Settings that you can use for eliciting a slot value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html
     */
    interface SlotValueElicitationSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Provides a regular expression used to validate the value of a slot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueregexfilter.html
     */
    interface SlotValueRegexFilterProperty {
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
export declare namespace CfnBot {
    /**
     * Contains settings used by Amazon Lex to select a slot value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html
     */
    interface SlotValueSelectionSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Defines the messages that Amazon Lex sends to a user to remind them that the bot is waiting for a response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html
     */
    interface StillWaitingResponseSpecificationProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies configuration settings for the alias used to test the bot. If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html
     */
    interface TestBotAliasSettingsProperty {
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
export declare namespace CfnBot {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html
     */
    interface TextInputSpecificationProperty {
        /**
         * `CfnBot.TextInputSpecificationProperty.StartTimeoutMs`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html#cfn-lex-bot-textinputspecification-starttimeoutms
         */
        readonly startTimeoutMs: number;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html
     */
    interface TextLogDestinationProperty {
        /**
         * Specifies the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html#cfn-lex-bot-textlogdestination-cloudwatch
         */
        readonly cloudWatch: CfnBot.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBot {
    /**
     * Specifies settings to enable conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html
     */
    interface TextLogSettingProperty {
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
export declare namespace CfnBot {
    /**
     * Identifies the Amazon Polly voice used for audio interaction with the user.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html
     */
    interface VoiceSettingsProperty {
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
export declare namespace CfnBot {
    /**
     * Specifies the prompts that Amazon Lex uses while a bot is waiting for customer input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html
     */
    interface WaitAndContinueSpecificationProperty {
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
export declare class CfnBotAlias extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::BotAlias";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBotAlias;
    /**
     * The Amazon Resource Name (ARN) of the bot alias.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier of the bot alias.
     * @cloudformationAttribute BotAliasId
     */
    readonly attrBotAliasId: string;
    /**
     * The current status of the bot alias. When the status is Available the alias is ready for use with your bot.
     * @cloudformationAttribute BotAliasStatus
     */
    readonly attrBotAliasStatus: string;
    /**
     * The name of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliasname
     */
    botAliasName: string;
    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botid
     */
    botId: string;
    /**
     * Maps configuration information to a specific locale. You can use this parameter to specify a specific Lambda function to run different functions in different locales.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliaslocalesettings
     */
    botAliasLocaleSettings: Array<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * You can only add tags when you specify an alias.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliastags
     */
    botAliasTags: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The version of the bot that the bot alias references.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botversion
     */
    botVersion: string | undefined;
    /**
     * Specifies whether Amazon Lex logs text and audio for conversations with the bot. When you enable conversation logs, text logs store text input, transcripts of audio input, and associated metadata in Amazon CloudWatch logs. Audio logs store input in Amazon S3 .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-conversationlogsettings
     */
    conversationLogSettings: CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable | undefined;
    /**
     * The description of the bot alias.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-description
     */
    description: string | undefined;
    /**
     * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-sentimentanalysissettings
     */
    sentimentAnalysisSettings: any | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Lex::BotAlias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotAliasProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnBotAlias {
    /**
     * Specifies the S3 bucket location where audio logs are stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html
     */
    interface AudioLogDestinationProperty {
        /**
         * The S3 bucket location where audio logs are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html#cfn-lex-botalias-audiologdestination-s3bucket
         */
        readonly s3Bucket: CfnBotAlias.S3BucketLogDestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBotAlias {
    /**
     * Settings for logging audio of conversations between Amazon Lex and a user. You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html
     */
    interface AudioLogSettingProperty {
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
export declare namespace CfnBotAlias {
    /**
     * Specifies settings that are unique to a locale. For example, you can use different Lambda function depending on the bot's locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html
     */
    interface BotAliasLocaleSettingsProperty {
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
export declare namespace CfnBotAlias {
    /**
     * Specifies settings that are unique to a locale. For example, you can use different Lambda function depending on the bot's locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html
     */
    interface BotAliasLocaleSettingsItemProperty {
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
export declare namespace CfnBotAlias {
    /**
     * The Amazon CloudWatch Logs log group where the text and metadata logs are delivered. The log group must exist before you enable logging.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html
     */
    interface CloudWatchLogGroupLogDestinationProperty {
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
export declare namespace CfnBotAlias {
    /**
     * Contains information about code hooks that Amazon Lex calls during a conversation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html
     */
    interface CodeHookSpecificationProperty {
        /**
         * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html#cfn-lex-botalias-codehookspecification-lambdacodehook
         */
        readonly lambdaCodeHook: CfnBotAlias.LambdaCodeHookProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBotAlias {
    /**
     * Configures conversation logging that saves audio, text, and metadata for the conversations with your users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html
     */
    interface ConversationLogSettingsProperty {
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
export declare namespace CfnBotAlias {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html
     */
    interface LambdaCodeHookProperty {
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
export declare namespace CfnBotAlias {
    /**
     * Specifies an Amazon S3 bucket for logging audio conversations
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html
     */
    interface S3BucketLogDestinationProperty {
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
export declare namespace CfnBotAlias {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html
     */
    interface SentimentAnalysisSettingsProperty {
        /**
         * `CfnBotAlias.SentimentAnalysisSettingsProperty.DetectSentiment`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html#cfn-lex-botalias-sentimentanalysissettings-detectsentiment
         */
        readonly detectSentiment: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnBotAlias {
    /**
     * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html
     */
    interface TextLogDestinationProperty {
        /**
         * Defines the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html#cfn-lex-botalias-textlogdestination-cloudwatch
         */
        readonly cloudWatch: CfnBotAlias.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnBotAlias {
    /**
     * Defines settings to enable conversation logs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html
     */
    interface TextLogSettingProperty {
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
export declare class CfnBotVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::BotVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBotVersion;
    /**
     * The version of the bot.
     * @cloudformationAttribute BotVersion
     */
    readonly attrBotVersion: string;
    /**
     * The unique identifier of the bot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botid
     */
    botId: string;
    /**
     * Specifies the locales that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botversionlocalespecification
     */
    botVersionLocaleSpecification: Array<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The description of the version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-description
     */
    description: string | undefined;
    /**
     * Create a new `AWS::Lex::BotVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnBotVersionProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnBotVersion {
    /**
     * The version of a bot used for a bot locale.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html
     */
    interface BotVersionLocaleDetailsProperty {
        /**
         * The version of a bot used for a bot locale.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html#cfn-lex-botversion-botversionlocaledetails-sourcebotversion
         */
        readonly sourceBotVersion: string;
    }
}
export declare namespace CfnBotVersion {
    /**
     * Specifies the locale that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html
     */
    interface BotVersionLocaleSpecificationProperty {
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
export declare class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Lex::ResourcePolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourcePolicy;
    /**
     * The identifier of the resource policy.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * Specifies the current revision of a resource policy.
     * @cloudformationAttribute RevisionId
     */
    readonly attrRevisionId: string;
    /**
     * A resource policy to add to the resource. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow IAM syntax. If the policy isn't valid, Amazon Lex returns a validation exception.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-policy
     */
    policy: any | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-resourcearn
     */
    resourceArn: string;
    /**
     * Create a new `AWS::Lex::ResourcePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
