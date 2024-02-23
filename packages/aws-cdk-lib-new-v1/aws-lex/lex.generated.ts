/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies an Amazon Lex conversational bot.
 *
 * You must configure an intent based on the `AMAZON.FallbackIntent` built-in intent. If you don't add one, creating the bot will fail.
 *
 * @cloudformationResource AWS::Lex::Bot
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html
 */
export class CfnBot extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lex::Bot";

  /**
   * Build a CfnBot from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBot(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the bot.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the bot.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Indicates whether Amazon Lex V2 should automatically build the locales for the bot after a change.
   */
  public autoBuildBotLocales?: boolean | cdk.IResolvable;

  /**
   * The Amazon S3 location of files used to import a bot.
   */
  public botFileS3Location?: cdk.IResolvable | CfnBot.S3LocationProperty;

  /**
   * A list of locales for the bot.
   */
  public botLocales?: Array<CfnBot.BotLocaleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of tags to add to the bot.
   */
  public botTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * By default, data stored by Amazon Lex is encrypted.
   */
  public dataPrivacy: any | cdk.IResolvable;

  /**
   * The description of the version.
   */
  public description?: string;

  /**
   * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.
   */
  public idleSessionTtlInSeconds: number;

  /**
   * The name of the bot locale.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
   */
  public roleArn: string;

  /**
   * Specifies configuration settings for the alias used to test the bot.
   */
  public testBotAliasSettings?: cdk.IResolvable | CfnBot.TestBotAliasSettingsProperty;

  /**
   * A list of tags to add to the test alias for a bot.
   */
  public testBotAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBotProps) {
    super(scope, id, {
      "type": CfnBot.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataPrivacy", this);
    cdk.requireProperty(props, "idleSessionTtlInSeconds", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.autoBuildBotLocales = props.autoBuildBotLocales;
    this.botFileS3Location = props.botFileS3Location;
    this.botLocales = props.botLocales;
    this.botTags = props.botTags;
    this.dataPrivacy = props.dataPrivacy;
    this.description = props.description;
    this.idleSessionTtlInSeconds = props.idleSessionTtlInSeconds;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.testBotAliasSettings = props.testBotAliasSettings;
    this.testBotAliasTags = props.testBotAliasTags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "autoBuildBotLocales": this.autoBuildBotLocales,
      "botFileS3Location": this.botFileS3Location,
      "botLocales": this.botLocales,
      "botTags": this.botTags,
      "dataPrivacy": this.dataPrivacy,
      "description": this.description,
      "idleSessionTtlInSeconds": this.idleSessionTtlInSeconds,
      "name": this.name,
      "roleArn": this.roleArn,
      "testBotAliasSettings": this.testBotAliasSettings,
      "testBotAliasTags": this.testBotAliasTags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBot.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBotPropsToCloudFormation(props);
  }
}

export namespace CfnBot {
  /**
   * Provides configuration information for a locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html
   */
  export interface BotLocaleProperty {
    /**
     * Specifies a custom vocabulary to use with a specific locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-customvocabulary
     */
    readonly customVocabulary?: CfnBot.CustomVocabularyProperty | cdk.IResolvable;

    /**
     * A description of the bot locale.
     *
     * Use this to help identify the bot locale in lists.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-description
     */
    readonly description?: string;

    /**
     * One or more intents defined for the locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-intents
     */
    readonly intents?: Array<CfnBot.IntentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The identifier of the language and locale that the bot will be used in.
     *
     * The string must match one of the supported locales.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-localeid
     */
    readonly localeId: string;

    /**
     * Determines the threshold where Amazon Lex will insert the `AMAZON.FallbackIntent` , `AMAZON.KendraSearchIntent` , or both when returning alternative intents. You must configure an `AMAZON.FallbackIntent` . `AMAZON.KendraSearchIntent` is only inserted if it is configured for the bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-nluconfidencethreshold
     */
    readonly nluConfidenceThreshold: number;

    /**
     * One or more slot types defined for the locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-slottypes
     */
    readonly slotTypes?: Array<cdk.IResolvable | CfnBot.SlotTypeProperty> | cdk.IResolvable;

    /**
     * Defines settings for using an Amazon Polly voice to communicate with a user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botlocale.html#cfn-lex-bot-botlocale-voicesettings
     */
    readonly voiceSettings?: cdk.IResolvable | CfnBot.VoiceSettingsProperty;
  }

  /**
   * Specifies a custom vocabulary.
   *
   * A custom vocabulary is a list of words that you expect to be used during a conversation with your bot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html
   */
  export interface CustomVocabularyProperty {
    /**
     * Specifies a list of words that you expect to be used during a conversation with your bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabulary.html#cfn-lex-bot-customvocabulary-customvocabularyitems
     */
    readonly customVocabularyItems: Array<CfnBot.CustomVocabularyItemProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies an entry in a custom vocabulary.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html
   */
  export interface CustomVocabularyItemProperty {
    /**
     * The DisplayAs value for the custom vocabulary item from the custom vocabulary list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html#cfn-lex-bot-customvocabularyitem-displayas
     */
    readonly displayAs?: string;

    /**
     * Specifies 1 - 4 words that should be recognized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html#cfn-lex-bot-customvocabularyitem-phrase
     */
    readonly phrase: string;

    /**
     * Specifies the degree to which the phrase recognition is boosted.
     *
     * The default value is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-customvocabularyitem.html#cfn-lex-bot-customvocabularyitem-weight
     */
    readonly weight?: number;
  }

  /**
   * Describes a slot type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html
   */
  export interface SlotTypeProperty {
    /**
     * A description of the slot type.
     *
     * Use the description to help identify the slot type in lists.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-description
     */
    readonly description?: string;

    /**
     * Sets the type of external information used to create the slot type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-externalsourcesetting
     */
    readonly externalSourceSetting?: CfnBot.ExternalSourceSettingProperty | cdk.IResolvable;

    /**
     * The name of the slot type.
     *
     * A slot type name must be unique withing the account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-name
     */
    readonly name: string;

    /**
     * The built-in slot type used as a parent of this slot type.
     *
     * When you define a parent slot type, the new slot type has the configuration of the parent lot type.
     *
     * Only `AMAZON.AlphaNumeric` is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-parentslottypesignature
     */
    readonly parentSlotTypeSignature?: string;

    /**
     * A list of SlotTypeValue objects that defines the values that the slot type can take.
     *
     * Each value can have a list of synonyms, additional values that help train the machine learning model about the values that it resolves for the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-slottypevalues
     */
    readonly slotTypeValues?: Array<cdk.IResolvable | CfnBot.SlotTypeValueProperty> | cdk.IResolvable;

    /**
     * Determines the slot resolution strategy that Amazon Lex uses to return slot type values.
     *
     * The field can be set to one of the following values:
     *
     * - `ORIGINAL_VALUE` - Returns the value entered by the user, if the user value is similar to the slot value.
     * - `TOP_RESOLUTION` - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
     *
     * If you don't specify the `valueSelectionStrategy` , the default is `ORIGINAL_VALUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottype.html#cfn-lex-bot-slottype-valueselectionsetting
     */
    readonly valueSelectionSetting?: cdk.IResolvable | CfnBot.SlotValueSelectionSettingProperty;
  }

  /**
   * Each slot type can have a set of values.
   *
   * Each `SlotTypeValue` represents a value that the slot type can take.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html
   */
  export interface SlotTypeValueProperty {
    /**
     * The value of the slot type entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html#cfn-lex-bot-slottypevalue-samplevalue
     */
    readonly sampleValue: cdk.IResolvable | CfnBot.SampleValueProperty;

    /**
     * Additional values related to the slot type entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slottypevalue.html#cfn-lex-bot-slottypevalue-synonyms
     */
    readonly synonyms?: Array<cdk.IResolvable | CfnBot.SampleValueProperty> | cdk.IResolvable;
  }

  /**
   * Defines one of the values for a slot type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html
   */
  export interface SampleValueProperty {
    /**
     * The value that can be used for a slot type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-samplevalue.html#cfn-lex-bot-samplevalue-value
     */
    readonly value: string;
  }

  /**
   * Contains settings used by Amazon Lex to select a slot value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html
   */
  export interface SlotValueSelectionSettingProperty {
    /**
     * Provides settings that enable advanced recognition settings for slot values.
     *
     * You can use this to enable using slot values as a custom vocabulary for recognizing user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-advancedrecognitionsetting
     */
    readonly advancedRecognitionSetting?: CfnBot.AdvancedRecognitionSettingProperty | cdk.IResolvable;

    /**
     * A regular expression used to validate the value of a slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-regexfilter
     */
    readonly regexFilter?: cdk.IResolvable | CfnBot.SlotValueRegexFilterProperty;

    /**
     * Determines the slot resolution strategy that Amazon Lex uses to return slot type values.
     *
     * The field can be set to one of the following values:
     *
     * - `ORIGINAL_VALUE` - Returns the value entered by the user, if the user value is similar to the slot value.
     * - `TOP_RESOLUTION` - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
     *
     * If you don't specify the `valueSelectionStrategy` , the default is `ORIGINAL_VALUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueselectionsetting.html#cfn-lex-bot-slotvalueselectionsetting-resolutionstrategy
     */
    readonly resolutionStrategy: string;
  }

  /**
   * Provides settings that enable advanced recognition settings for slot values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html
   */
  export interface AdvancedRecognitionSettingProperty {
    /**
     * Enables using the slot values as a custom vocabulary for recognizing user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-advancedrecognitionsetting.html#cfn-lex-bot-advancedrecognitionsetting-audiorecognitionstrategy
     */
    readonly audioRecognitionStrategy?: string;
  }

  /**
   * Provides a regular expression used to validate the value of a slot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueregexfilter.html
   */
  export interface SlotValueRegexFilterProperty {
    /**
     * A regular expression used to validate the value of a slot.
     *
     * Use a standard regular expression. Amazon Lex supports the following characters in the regular expression:
     *
     * - A-Z, a-z
     * - 0-9
     * - Unicode characters ("\⁠u<Unicode>")
     *
     * Represent Unicode characters with four digits, for example "\⁠u0041" or "\⁠u005A".
     *
     * The following regular expression operators are not supported:
     *
     * - Infinite repeaters: *, +, or {x,} with no upper bound.
     * - Wild card (.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueregexfilter.html#cfn-lex-bot-slotvalueregexfilter-pattern
     */
    readonly pattern: string;
  }

  /**
   * Provides information about the external source of the slot type's definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html
   */
  export interface ExternalSourceSettingProperty {
    /**
     * Settings required for a slot type based on a grammar that you provide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-externalsourcesetting.html#cfn-lex-bot-externalsourcesetting-grammarslottypesetting
     */
    readonly grammarSlotTypeSetting?: CfnBot.GrammarSlotTypeSettingProperty | cdk.IResolvable;
  }

  /**
   * Settings requried for a slot type based on a grammar that you provide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html
   */
  export interface GrammarSlotTypeSettingProperty {
    /**
     * The source of the grammar used to create the slot type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesetting.html#cfn-lex-bot-grammarslottypesetting-source
     */
    readonly source?: CfnBot.GrammarSlotTypeSourceProperty | cdk.IResolvable;
  }

  /**
   * Describes the Amazon S3 bucket name and location for the grammar that is the source for the slot type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html
   */
  export interface GrammarSlotTypeSourceProperty {
    /**
     * The AWS KMS key required to decrypt the contents of the grammar, if any.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The name of the Amazon S3 bucket that contains the grammar source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-s3bucketname
     */
    readonly s3BucketName: string;

    /**
     * The path to the grammar in the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-grammarslottypesource.html#cfn-lex-bot-grammarslottypesource-s3objectkey
     */
    readonly s3ObjectKey: string;
  }

  /**
   * Represents an action that the user wants to perform.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html
   */
  export interface IntentProperty {
    /**
     * A description of the intent.
     *
     * Use the description to help identify the intent in lists.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-description
     */
    readonly description?: string;

    /**
     * Specifies that Amazon Lex invokes the alias Lambda function for each user input.
     *
     * You can invoke this Lambda function to personalize user interaction.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-dialogcodehook
     */
    readonly dialogCodeHook?: CfnBot.DialogCodeHookSettingProperty | cdk.IResolvable;

    /**
     * Specifies that Amazon Lex invokes the alias Lambda function when the intent is ready for fulfillment.
     *
     * You can invoke this function to complete the bot's transaction with the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-fulfillmentcodehook
     */
    readonly fulfillmentCodeHook?: CfnBot.FulfillmentCodeHookSettingProperty | cdk.IResolvable;

    /**
     * Configuration setting for a response sent to the user before Amazon Lex starts eliciting slots.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-initialresponsesetting
     */
    readonly initialResponseSetting?: CfnBot.InitialResponseSettingProperty | cdk.IResolvable;

    /**
     * A list of contexts that must be active for this intent to be considered by Amazon Lex .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-inputcontexts
     */
    readonly inputContexts?: Array<CfnBot.InputContextProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Sets the response that Amazon Lex sends to the user when the intent is closed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-intentclosingsetting
     */
    readonly intentClosingSetting?: CfnBot.IntentClosingSettingProperty | cdk.IResolvable;

    /**
     * Provides prompts that Amazon Lex sends to the user to confirm the completion of an intent.
     *
     * If the user answers "no," the settings contain a statement that is sent to the user to end the intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-intentconfirmationsetting
     */
    readonly intentConfirmationSetting?: CfnBot.IntentConfirmationSettingProperty | cdk.IResolvable;

    /**
     * Provides configuration information for the `AMAZON.KendraSearchIntent` intent. When you use this intent, Amazon Lex searches the specified Amazon Kendra index and returns documents from the index that match the user's utterance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-kendraconfiguration
     */
    readonly kendraConfiguration?: cdk.IResolvable | CfnBot.KendraConfigurationProperty;

    /**
     * The name of the intent.
     *
     * Intent names must be unique within the locale that contains the intent and can't match the name of any built-in intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-name
     */
    readonly name: string;

    /**
     * A list of contexts that the intent activates when it is fulfilled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-outputcontexts
     */
    readonly outputContexts?: Array<cdk.IResolvable | CfnBot.OutputContextProperty> | cdk.IResolvable;

    /**
     * A unique identifier for the built-in intent to base this intent on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-parentintentsignature
     */
    readonly parentIntentSignature?: string;

    /**
     * A list of utterances that a user might say to signal the intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-sampleutterances
     */
    readonly sampleUtterances?: Array<cdk.IResolvable | CfnBot.SampleUtteranceProperty> | cdk.IResolvable;

    /**
     * Indicates the priority for slots.
     *
     * Amazon Lex prompts the user for slot values in priority order.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-slotpriorities
     */
    readonly slotPriorities?: Array<cdk.IResolvable | CfnBot.SlotPriorityProperty> | cdk.IResolvable;

    /**
     * A list of slots that the intent requires for fulfillment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intent.html#cfn-lex-bot-intent-slots
     */
    readonly slots?: Array<cdk.IResolvable | CfnBot.SlotProperty> | cdk.IResolvable;
  }

  /**
   * Configuration setting for a response sent to the user before Amazon Lex starts eliciting slots.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-initialresponsesetting.html
   */
  export interface InitialResponseSettingProperty {
    /**
     * Settings that specify the dialog code hook that is called by Amazon Lex at a step of the conversation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-initialresponsesetting.html#cfn-lex-bot-initialresponsesetting-codehook
     */
    readonly codeHook?: CfnBot.DialogCodeHookInvocationSettingProperty | cdk.IResolvable;

    /**
     * Provides a list of conditional branches.
     *
     * Branches are evaluated in the order that they are entered in the list. The first branch with a condition that evaluates to true is executed. The last branch in the list is the default branch. The default branch should not have any condition expression. The default branch is executed if no other branch has a matching condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-initialresponsesetting.html#cfn-lex-bot-initialresponsesetting-conditional
     */
    readonly conditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-initialresponsesetting.html#cfn-lex-bot-initialresponsesetting-initialresponse
     */
    readonly initialResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * The next step in the conversation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-initialresponsesetting.html#cfn-lex-bot-initialresponsesetting-nextstep
     */
    readonly nextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;
  }

  /**
   * Settings that specify the dialog code hook that is called by Amazon Lex at a step of the conversation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehookinvocationsetting.html
   */
  export interface DialogCodeHookInvocationSettingProperty {
    /**
     * Indicates whether a Lambda function should be invoked for the dialog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehookinvocationsetting.html#cfn-lex-bot-dialogcodehookinvocationsetting-enablecodehookinvocation
     */
    readonly enableCodeHookInvocation: boolean | cdk.IResolvable;

    /**
     * A label that indicates the dialog step from which the dialog code hook is happening.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehookinvocationsetting.html#cfn-lex-bot-dialogcodehookinvocationsetting-invocationlabel
     */
    readonly invocationLabel?: string;

    /**
     * Determines whether a dialog code hook is used when the intent is activated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehookinvocationsetting.html#cfn-lex-bot-dialogcodehookinvocationsetting-isactive
     */
    readonly isActive: boolean | cdk.IResolvable;

    /**
     * Contains the responses and actions that Amazon Lex takes after the Lambda function is complete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehookinvocationsetting.html#cfn-lex-bot-dialogcodehookinvocationsetting-postcodehookspecification
     */
    readonly postCodeHookSpecification: cdk.IResolvable | CfnBot.PostDialogCodeHookInvocationSpecificationProperty;
  }

  /**
   * Specifies next steps to run after the dialog code hook finishes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html
   */
  export interface PostDialogCodeHookInvocationSpecificationProperty {
    /**
     * A list of conditional branches to evaluate after the dialog code hook throws an exception or returns with the `State` field of the `Intent` object set to `Failed` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-failureconditional
     */
    readonly failureConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step the bot runs after the dialog code hook throws an exception or returns with the `State` field of the `Intent` object set to `Failed` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-failurenextstep
     */
    readonly failureNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input when the code hook fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-failureresponse
     */
    readonly failureResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches to evaluate after the dialog code hook finishes successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-successconditional
     */
    readonly successConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifics the next step the bot runs after the dialog code hook finishes successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-successnextstep
     */
    readonly successNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond when the code hook succeeds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-successresponse
     */
    readonly successResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches to evaluate if the code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-timeoutconditional
     */
    readonly timeoutConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot runs when the code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-timeoutnextstep
     */
    readonly timeoutNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond to the user input when the code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postdialogcodehookinvocationspecification.html#cfn-lex-bot-postdialogcodehookinvocationspecification-timeoutresponse
     */
    readonly timeoutResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * Specifies a list of message groups that Amazon Lex uses to respond the user input.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html
   */
  export interface ResponseSpecificationProperty {
    /**
     * Indicates whether the user can interrupt a speech response from Amazon Lex.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html#cfn-lex-bot-responsespecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * A collection of responses that Amazon Lex can send to the user.
     *
     * Amazon Lex chooses the actual response to send at runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-responsespecification.html#cfn-lex-bot-responsespecification-messagegroupslist
     */
    readonly messageGroupsList: Array<cdk.IResolvable | CfnBot.MessageGroupProperty> | cdk.IResolvable;
  }

  /**
   * Provides one or more messages that Amazon Lex should send to the user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html
   */
  export interface MessageGroupProperty {
    /**
     * The primary message that Amazon Lex should send to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html#cfn-lex-bot-messagegroup-message
     */
    readonly message: cdk.IResolvable | CfnBot.MessageProperty;

    /**
     * Message variations to send to the user.
     *
     * When variations are defined, Amazon Lex chooses the primary message or one of the variations to send to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-messagegroup.html#cfn-lex-bot-messagegroup-variations
     */
    readonly variations?: Array<cdk.IResolvable | CfnBot.MessageProperty> | cdk.IResolvable;
  }

  /**
   * The object that provides message text and its type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html
   */
  export interface MessageProperty {
    /**
     * A message in a custom format defined by the client application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-custompayload
     */
    readonly customPayload?: CfnBot.CustomPayloadProperty | cdk.IResolvable;

    /**
     * A message that defines a response card that the client application can show to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-imageresponsecard
     */
    readonly imageResponseCard?: CfnBot.ImageResponseCardProperty | cdk.IResolvable;

    /**
     * A message in plain text format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-plaintextmessage
     */
    readonly plainTextMessage?: cdk.IResolvable | CfnBot.PlainTextMessageProperty;

    /**
     * A message in Speech Synthesis Markup Language (SSML).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-message.html#cfn-lex-bot-message-ssmlmessage
     */
    readonly ssmlMessage?: cdk.IResolvable | CfnBot.SSMLMessageProperty;
  }

  /**
   * A custom response string that Amazon Lex sends to your application.
   *
   * You define the content and structure the string.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html
   */
  export interface CustomPayloadProperty {
    /**
     * The string that is sent to your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-custompayload.html#cfn-lex-bot-custompayload-value
     */
    readonly value: string;
  }

  /**
   * A card that is shown to the user by a messaging platform.
   *
   * You define the contents of the card, the card is displayed by the platform.
   *
   * When you use a response card, the response from the user is constrained to the text associated with a button on the card.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html
   */
  export interface ImageResponseCardProperty {
    /**
     * A list of buttons that should be displayed on the response card.
     *
     * The arrangement of the buttons is determined by the platform that displays the button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-buttons
     */
    readonly buttons?: Array<CfnBot.ButtonProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The URL of an image to display on the response card.
     *
     * The image URL must be publicly available so that the platform displaying the response card has access to the image.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-imageurl
     */
    readonly imageUrl?: string;

    /**
     * The subtitle to display on the response card.
     *
     * The format of the subtitle is determined by the platform displaying the response card.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-subtitle
     */
    readonly subtitle?: string;

    /**
     * The title to display on the response card.
     *
     * The format of the title is determined by the platform displaying the response card.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-imageresponsecard.html#cfn-lex-bot-imageresponsecard-title
     */
    readonly title: string;
  }

  /**
   * Describes a button to use on a response card used to gather slot values from a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html
   */
  export interface ButtonProperty {
    /**
     * The text that appears on the button.
     *
     * Use this to tell the user what value is returned when they choose this button.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html#cfn-lex-bot-button-text
     */
    readonly text: string;

    /**
     * The value returned to Amazon Lex when the user chooses this button.
     *
     * This must be one of the slot values configured for the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-button.html#cfn-lex-bot-button-value
     */
    readonly value: string;
  }

  /**
   * Defines an ASCII text message to send to the user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html
   */
  export interface PlainTextMessageProperty {
    /**
     * The message to send to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-plaintextmessage.html#cfn-lex-bot-plaintextmessage-value
     */
    readonly value: string;
  }

  /**
   * Defines a Speech Synthesis Markup Language (SSML) prompt.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html
   */
  export interface SSMLMessageProperty {
    /**
     * The SSML text that defines the prompt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-ssmlmessage.html#cfn-lex-bot-ssmlmessage-value
     */
    readonly value: string;
  }

  /**
   * Provides a list of conditional branches.
   *
   * Branches are evaluated in the order that they are entered in the list. The first branch with a condition that evaluates to true is executed. The last branch in the list is the default branch. The default branch should not have any condition expression. The default branch is executed if no other branch has a matching condition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalspecification.html
   */
  export interface ConditionalSpecificationProperty {
    /**
     * A list of conditional branches.
     *
     * A conditional branch is made up of a condition, a response and a next step. The response and next step are executed when the condition is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalspecification.html#cfn-lex-bot-conditionalspecification-conditionalbranches
     */
    readonly conditionalBranches: Array<CfnBot.ConditionalBranchProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The conditional branch that should be followed when the conditions for other branches are not satisfied.
     *
     * A conditional branch is made up of a condition, a response and a next step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalspecification.html#cfn-lex-bot-conditionalspecification-defaultbranch
     */
    readonly defaultBranch: CfnBot.DefaultConditionalBranchProperty | cdk.IResolvable;

    /**
     * Determines whether a conditional branch is active.
     *
     * When `IsActive` is false, the conditions are not evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalspecification.html#cfn-lex-bot-conditionalspecification-isactive
     */
    readonly isActive: boolean | cdk.IResolvable;
  }

  /**
   * A set of actions that Amazon Lex should run if none of the other conditions are met.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-defaultconditionalbranch.html
   */
  export interface DefaultConditionalBranchProperty {
    /**
     * The next step in the conversation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-defaultconditionalbranch.html#cfn-lex-bot-defaultconditionalbranch-nextstep
     */
    readonly nextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-defaultconditionalbranch.html#cfn-lex-bot-defaultconditionalbranch-response
     */
    readonly response?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * The current state of the conversation with the user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogstate.html
   */
  export interface DialogStateProperty {
    /**
     * Defines the action that the bot executes at runtime when the conversation reaches this step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogstate.html#cfn-lex-bot-dialogstate-dialogaction
     */
    readonly dialogAction?: CfnBot.DialogActionProperty | cdk.IResolvable;

    /**
     * Override settings to configure the intent state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogstate.html#cfn-lex-bot-dialogstate-intent
     */
    readonly intent?: CfnBot.IntentOverrideProperty | cdk.IResolvable;

    /**
     * Map of key/value pairs representing session-specific context information.
     *
     * It contains application information passed between Amazon Lex and a client application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogstate.html#cfn-lex-bot-dialogstate-sessionattributes
     */
    readonly sessionAttributes?: Array<cdk.IResolvable | CfnBot.SessionAttributeProperty> | cdk.IResolvable;
  }

  /**
   * Defines the action that the bot executes at runtime when the conversation reaches this step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogaction.html
   */
  export interface DialogActionProperty {
    /**
     * If the dialog action is `ElicitSlot` , defines the slot to elicit from the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogaction.html#cfn-lex-bot-dialogaction-slottoelicit
     */
    readonly slotToElicit?: string;

    /**
     * When true the next message for the intent is not used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogaction.html#cfn-lex-bot-dialogaction-suppressnextmessage
     */
    readonly suppressNextMessage?: boolean | cdk.IResolvable;

    /**
     * The action that the bot should execute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogaction.html#cfn-lex-bot-dialogaction-type
     */
    readonly type: string;
  }

  /**
   * A key/value pair representing session-specific context information.
   *
   * It contains application information passed between Amazon Lex V2 and a client application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sessionattribute.html
   */
  export interface SessionAttributeProperty {
    /**
     * The name of the session attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sessionattribute.html#cfn-lex-bot-sessionattribute-key
     */
    readonly key: string;

    /**
     * The session-specific context information for the session attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sessionattribute.html#cfn-lex-bot-sessionattribute-value
     */
    readonly value?: string;
  }

  /**
   * Override settings to configure the intent state.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentoverride.html
   */
  export interface IntentOverrideProperty {
    /**
     * The name of the intent.
     *
     * Only required when you're switching intents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentoverride.html#cfn-lex-bot-intentoverride-name
     */
    readonly name?: string;

    /**
     * A map of all of the slot value overrides for the intent.
     *
     * The name of the slot maps to the value of the slot. Slots that are not included in the map aren't overridden.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentoverride.html#cfn-lex-bot-intentoverride-slots
     */
    readonly slots?: Array<cdk.IResolvable | CfnBot.SlotValueOverrideMapProperty> | cdk.IResolvable;
  }

  /**
   * Maps a slot name to the [SlotValueOverride](https://docs.aws.amazon.com/lexv2/latest/APIReference/API_SlotValueOverride.html) object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverridemap.html
   */
  export interface SlotValueOverrideMapProperty {
    /**
     * The name of the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverridemap.html#cfn-lex-bot-slotvalueoverridemap-slotname
     */
    readonly slotName?: string;

    /**
     * The SlotValueOverride object to which the slot name will be mapped.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverridemap.html#cfn-lex-bot-slotvalueoverridemap-slotvalueoverride
     */
    readonly slotValueOverride?: cdk.IResolvable | CfnBot.SlotValueOverrideProperty;
  }

  /**
   * The slot values that Amazon Lex uses when it sets slot values in a dialog step.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverride.html
   */
  export interface SlotValueOverrideProperty {
    /**
     * When the shape value is `List` , it indicates that the `values` field contains a list of slot values.
     *
     * When the value is `Scalar` , it indicates that the `value` field contains a single value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverride.html#cfn-lex-bot-slotvalueoverride-shape
     */
    readonly shape?: string;

    /**
     * The current value of the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverride.html#cfn-lex-bot-slotvalueoverride-value
     */
    readonly value?: cdk.IResolvable | CfnBot.SlotValueProperty;

    /**
     * A list of one or more values that the user provided for the slot.
     *
     * For example, for a slot that elicits pizza toppings, the values might be "pepperoni" and "pineapple."
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueoverride.html#cfn-lex-bot-slotvalueoverride-values
     */
    readonly values?: Array<cdk.IResolvable | CfnBot.SlotValueOverrideProperty> | cdk.IResolvable;
  }

  /**
   * The value to set in a slot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalue.html
   */
  export interface SlotValueProperty {
    /**
     * The value that Amazon Lex determines for the slot.
     *
     * The actual value depends on the setting of the value selection strategy for the bot. You can choose to use the value entered by the user, or you can have Amazon Lex choose the first value in the `resolvedValues` list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalue.html#cfn-lex-bot-slotvalue-interpretedvalue
     */
    readonly interpretedValue?: string;
  }

  /**
   * A set of actions that Amazon Lex should run if the condition is matched.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalbranch.html
   */
  export interface ConditionalBranchProperty {
    /**
     * Contains the expression to evaluate.
     *
     * If the condition is true, the branch's actions are taken.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalbranch.html#cfn-lex-bot-conditionalbranch-condition
     */
    readonly condition: CfnBot.ConditionProperty | cdk.IResolvable;

    /**
     * The name of the branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalbranch.html#cfn-lex-bot-conditionalbranch-name
     */
    readonly name: string;

    /**
     * The next step in the conversation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalbranch.html#cfn-lex-bot-conditionalbranch-nextstep
     */
    readonly nextStep: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conditionalbranch.html#cfn-lex-bot-conditionalbranch-response
     */
    readonly response?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * Provides an expression that evaluates to true or false.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-condition.html
   */
  export interface ConditionProperty {
    /**
     * The expression string that is evaluated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-condition.html#cfn-lex-bot-condition-expressionstring
     */
    readonly expressionString: string;
  }

  /**
   * Determines if a Lambda function should be invoked for a specific intent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html
   */
  export interface FulfillmentCodeHookSettingProperty {
    /**
     * Indicates whether a Lambda function should be invoked to fulfill a specific intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * Provides settings for update messages sent to the user for long-running Lambda fulfillment functions.
     *
     * Fulfillment updates can be used only with streaming conversations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-fulfillmentupdatesspecification
     */
    readonly fulfillmentUpdatesSpecification?: CfnBot.FulfillmentUpdatesSpecificationProperty | cdk.IResolvable;

    /**
     * Determines whether the fulfillment code hook is used.
     *
     * When `active` is false, the code hook doesn't run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-isactive
     */
    readonly isActive?: boolean | cdk.IResolvable;

    /**
     * Provides settings for messages sent to the user for after the Lambda fulfillment function completes.
     *
     * Post-fulfillment messages can be sent for both streaming and non-streaming conversations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentcodehooksetting.html#cfn-lex-bot-fulfillmentcodehooksetting-postfulfillmentstatusspecification
     */
    readonly postFulfillmentStatusSpecification?: cdk.IResolvable | CfnBot.PostFulfillmentStatusSpecificationProperty;
  }

  /**
   * Provides a setting that determines whether the post-fulfillment response is sent to the user.
   *
   * For more information, see [](https://docs.aws.amazon.com/lexv2/latest/dg/streaming-progress.html#progress-complete)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html
   */
  export interface PostFulfillmentStatusSpecificationProperty {
    /**
     * A list of conditional branches to evaluate after the fulfillment code hook throws an exception or returns with the `State` field of the `Intent` object set to `Failed` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-failureconditional
     */
    readonly failureConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step the bot runs after the fulfillment code hook throws an exception or returns with the `State` field of the `Intent` object set to `Failed` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-failurenextstep
     */
    readonly failureNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond when fulfillment isn't successful.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-failureresponse
     */
    readonly failureResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches to evaluate after the fulfillment code hook finishes successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-successconditional
     */
    readonly successConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step in the conversation that Amazon Lex invokes when the fulfillment code hook completes successfully.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-successnextstep
     */
    readonly successNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond when the fulfillment is successful.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-successresponse
     */
    readonly successResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches to evaluate if the fulfillment code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-timeoutconditional
     */
    readonly timeoutConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot runs when the fulfillment code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-timeoutnextstep
     */
    readonly timeoutNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond when fulfillment isn't completed within the timeout period.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-postfulfillmentstatusspecification.html#cfn-lex-bot-postfulfillmentstatusspecification-timeoutresponse
     */
    readonly timeoutResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * Provides information for updating the user on the progress of fulfilling an intent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html
   */
  export interface FulfillmentUpdatesSpecificationProperty {
    /**
     * Determines whether fulfillment updates are sent to the user. When this field is true, updates are sent.
     *
     * If the `active` field is set to true, the `startResponse` , `updateResponse` , and `timeoutInSeconds` fields are required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-active
     */
    readonly active: boolean | cdk.IResolvable;

    /**
     * Provides configuration information for the message sent to users when the fulfillment Lambda functions starts running.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-startresponse
     */
    readonly startResponse?: CfnBot.FulfillmentStartResponseSpecificationProperty | cdk.IResolvable;

    /**
     * The length of time that the fulfillment Lambda function should run before it times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-timeoutinseconds
     */
    readonly timeoutInSeconds?: number;

    /**
     * Provides configuration information for messages sent periodically to the user while the fulfillment Lambda function is running.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdatesspecification.html#cfn-lex-bot-fulfillmentupdatesspecification-updateresponse
     */
    readonly updateResponse?: CfnBot.FulfillmentUpdateResponseSpecificationProperty | cdk.IResolvable;
  }

  /**
   * Provides settings for a message that is sent periodically to the user while a fulfillment Lambda function is running.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html
   */
  export interface FulfillmentUpdateResponseSpecificationProperty {
    /**
     * Determines whether the user can interrupt an update message while it is playing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * The frequency that a message is sent to the user.
     *
     * When the period ends, Amazon Lex chooses a message from the message groups and plays it to the user. If the fulfillment Lambda returns before the first period ends, an update message is not played to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-frequencyinseconds
     */
    readonly frequencyInSeconds: number;

    /**
     * 1 - 5 message groups that contain update messages.
     *
     * Amazon Lex chooses one of the messages to play to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentupdateresponsespecification.html#cfn-lex-bot-fulfillmentupdateresponsespecification-messagegroups
     */
    readonly messageGroups: Array<cdk.IResolvable | CfnBot.MessageGroupProperty> | cdk.IResolvable;
  }

  /**
   * Provides settings for a message that is sent to the user when a fulfillment Lambda function starts running.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html
   */
  export interface FulfillmentStartResponseSpecificationProperty {
    /**
     * Determines whether the user can interrupt the start message while it is playing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * The delay between when the Lambda fulfillment function starts running and the start message is played.
     *
     * If the Lambda function returns before the delay is over, the start message isn't played.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-delayinseconds
     */
    readonly delayInSeconds: number;

    /**
     * 1 - 5 message groups that contain start messages.
     *
     * Amazon Lex chooses one of the messages to play to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-fulfillmentstartresponsespecification.html#cfn-lex-bot-fulfillmentstartresponsespecification-messagegroups
     */
    readonly messageGroups: Array<cdk.IResolvable | CfnBot.MessageGroupProperty> | cdk.IResolvable;
  }

  /**
   * Provides a prompt for making sure that the user is ready for the intent to be fulfilled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html
   */
  export interface IntentConfirmationSettingProperty {
    /**
     * The `DialogCodeHookInvocationSetting` object associated with intent's confirmation step.
     *
     * The dialog code hook is triggered based on these invocation settings when the confirmation next step or declination next step or failure next step is `InvokeDialogCodeHook` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-codehook
     */
    readonly codeHook?: CfnBot.DialogCodeHookInvocationSettingProperty | cdk.IResolvable;

    /**
     * A list of conditional branches to evaluate after the intent is closed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-confirmationconditional
     */
    readonly confirmationConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot executes when the customer confirms the intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-confirmationnextstep
     */
    readonly confirmationNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-confirmationresponse
     */
    readonly confirmationResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches to evaluate after the intent is declined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-declinationconditional
     */
    readonly declinationConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot executes when the customer declines the intent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-declinationnextstep
     */
    readonly declinationNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * When the user answers "no" to the question defined in `promptSpecification` , Amazon Lex responds with this response to acknowledge that the intent was canceled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-declinationresponse
     */
    readonly declinationResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * The `DialogCodeHookInvocationSetting` used when the code hook is invoked during confirmation prompt retries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-elicitationcodehook
     */
    readonly elicitationCodeHook?: CfnBot.ElicitationCodeHookInvocationSettingProperty | cdk.IResolvable;

    /**
     * Provides a list of conditional branches.
     *
     * Branches are evaluated in the order that they are entered in the list. The first branch with a condition that evaluates to true is executed. The last branch in the list is the default branch. The default branch should not have any condition expression. The default branch is executed if no other branch has a matching condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-failureconditional
     */
    readonly failureConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * The next step to take in the conversation if the confirmation step fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-failurenextstep
     */
    readonly failureNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input when the intent confirmation fails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-failureresponse
     */
    readonly failureResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * Specifies whether the intent's confirmation is sent to the user.
     *
     * When this field is false, confirmation and declination responses aren't sent. If the `IsActive` field isn't specified, the default is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-isactive
     */
    readonly isActive?: boolean | cdk.IResolvable;

    /**
     * Prompts the user to confirm the intent. This question should have a yes or no answer.
     *
     * Amazon Lex uses this prompt to ensure that the user acknowledges that the intent is ready for fulfillment. For example, with the `OrderPizza` intent, you might want to confirm that the order is correct before placing it. For other intents, such as intents that simply respond to user questions, you might not need to ask the user for confirmation before providing the information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentconfirmationsetting.html#cfn-lex-bot-intentconfirmationsetting-promptspecification
     */
    readonly promptSpecification: cdk.IResolvable | CfnBot.PromptSpecificationProperty;
  }

  /**
   * Specifies a list of message groups that Amazon Lex sends to a user to elicit a response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html
   */
  export interface PromptSpecificationProperty {
    /**
     * Indicates whether the user can interrupt a speech prompt from the bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * The maximum number of times the bot tries to elicit a response from the user using this prompt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-maxretries
     */
    readonly maxRetries: number;

    /**
     * A collection of messages that Amazon Lex can send to the user.
     *
     * Amazon Lex chooses the actual message to send at runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-messagegroupslist
     */
    readonly messageGroupsList: Array<cdk.IResolvable | CfnBot.MessageGroupProperty> | cdk.IResolvable;

    /**
     * Indicates how a message is selected from a message group among retries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-messageselectionstrategy
     */
    readonly messageSelectionStrategy?: string;

    /**
     * Specifies the advanced settings on each attempt of the prompt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptspecification.html#cfn-lex-bot-promptspecification-promptattemptsspecification
     */
    readonly promptAttemptsSpecification?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnBot.PromptAttemptSpecificationProperty>;
  }

  /**
   * Specifies the settings on a prompt attempt.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html
   */
  export interface PromptAttemptSpecificationProperty {
    /**
     * Indicates the allowed input types of the prompt attempt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-allowedinputtypes
     */
    readonly allowedInputTypes: CfnBot.AllowedInputTypesProperty | cdk.IResolvable;

    /**
     * Indicates whether the user can interrupt a speech prompt attempt from the bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * Specifies the settings on audio and DTMF input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-audioanddtmfinputspecification
     */
    readonly audioAndDtmfInputSpecification?: CfnBot.AudioAndDTMFInputSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the settings on text input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-promptattemptspecification.html#cfn-lex-bot-promptattemptspecification-textinputspecification
     */
    readonly textInputSpecification?: cdk.IResolvable | CfnBot.TextInputSpecificationProperty;
  }

  /**
   * Specifies the text input specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html
   */
  export interface TextInputSpecificationProperty {
    /**
     * Time for which a bot waits before re-prompting a customer for text input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textinputspecification.html#cfn-lex-bot-textinputspecification-starttimeoutms
     */
    readonly startTimeoutMs: number;
  }

  /**
   * Specifies the allowed input types.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html
   */
  export interface AllowedInputTypesProperty {
    /**
     * Indicates whether audio input is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html#cfn-lex-bot-allowedinputtypes-allowaudioinput
     */
    readonly allowAudioInput: boolean | cdk.IResolvable;

    /**
     * Indicates whether DTMF input is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-allowedinputtypes.html#cfn-lex-bot-allowedinputtypes-allowdtmfinput
     */
    readonly allowDtmfInput: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the audio and DTMF input specification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html
   */
  export interface AudioAndDTMFInputSpecificationProperty {
    /**
     * Specifies the settings on audio input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-audiospecification
     */
    readonly audioSpecification?: CfnBot.AudioSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the settings on DTMF input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-dtmfspecification
     */
    readonly dtmfSpecification?: CfnBot.DTMFSpecificationProperty | cdk.IResolvable;

    /**
     * Time for which a bot waits before assuming that the customer isn't going to speak or press a key.
     *
     * This timeout is shared between Audio and DTMF inputs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audioanddtmfinputspecification.html#cfn-lex-bot-audioanddtmfinputspecification-starttimeoutms
     */
    readonly startTimeoutMs: number;
  }

  /**
   * Specifies the DTMF input specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html
   */
  export interface DTMFSpecificationProperty {
    /**
     * The DTMF character that clears the accumulated DTMF digits and immediately ends the input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-deletioncharacter
     */
    readonly deletionCharacter: string;

    /**
     * The DTMF character that immediately ends input.
     *
     * If the user does not press this character, the input ends after the end timeout.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-endcharacter
     */
    readonly endCharacter: string;

    /**
     * How long the bot should wait after the last DTMF character input before assuming that the input has concluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-endtimeoutms
     */
    readonly endTimeoutMs: number;

    /**
     * The maximum number of DTMF digits allowed in an utterance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dtmfspecification.html#cfn-lex-bot-dtmfspecification-maxlength
     */
    readonly maxLength: number;
  }

  /**
   * Specifies the audio input specifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html
   */
  export interface AudioSpecificationProperty {
    /**
     * Time for which a bot waits after the customer stops speaking to assume the utterance is finished.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html#cfn-lex-bot-audiospecification-endtimeoutms
     */
    readonly endTimeoutMs: number;

    /**
     * Time for how long Amazon Lex waits before speech input is truncated and the speech is returned to application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiospecification.html#cfn-lex-bot-audiospecification-maxlengthms
     */
    readonly maxLengthMs: number;
  }

  /**
   * Settings that specify the dialog code hook that is called by Amazon Lex between eliciting slot values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-elicitationcodehookinvocationsetting.html
   */
  export interface ElicitationCodeHookInvocationSettingProperty {
    /**
     * Indicates whether a Lambda function should be invoked for the dialog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-elicitationcodehookinvocationsetting.html#cfn-lex-bot-elicitationcodehookinvocationsetting-enablecodehookinvocation
     */
    readonly enableCodeHookInvocation: boolean | cdk.IResolvable;

    /**
     * A label that indicates the dialog step from which the dialog code hook is happening.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-elicitationcodehookinvocationsetting.html#cfn-lex-bot-elicitationcodehookinvocationsetting-invocationlabel
     */
    readonly invocationLabel?: string;
  }

  /**
   * Specifies the definition of a slot.
   *
   * Amazon Lex elicits slot values from uses to fulfill the user's intent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html
   */
  export interface SlotProperty {
    /**
     * The description of the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-description
     */
    readonly description?: string;

    /**
     * Indicates whether a slot can return multiple values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-multiplevaluessetting
     */
    readonly multipleValuesSetting?: cdk.IResolvable | CfnBot.MultipleValuesSettingProperty;

    /**
     * The name given to the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-name
     */
    readonly name: string;

    /**
     * Determines whether the contents of the slot are obfuscated in Amazon CloudWatch Logs logs.
     *
     * Use obfuscated slots to protect information such as personally identifiable information (PII) in logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-obfuscationsetting
     */
    readonly obfuscationSetting?: cdk.IResolvable | CfnBot.ObfuscationSettingProperty;

    /**
     * The name of the slot type that this slot is based on.
     *
     * The slot type defines the acceptable values for the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-slottypename
     */
    readonly slotTypeName: string;

    /**
     * Determines the slot resolution strategy that Amazon Lex uses to return slot type values.
     *
     * The field can be set to one of the following values:
     *
     * - ORIGINAL_VALUE - Returns the value entered by the user, if the user value is similar to a slot value.
     * - TOP_RESOLUTION - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.
     *
     * If you don't specify the `valueSelectionStrategy` , the default is `ORIGINAL_VALUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slot.html#cfn-lex-bot-slot-valueelicitationsetting
     */
    readonly valueElicitationSetting: cdk.IResolvable | CfnBot.SlotValueElicitationSettingProperty;
  }

  /**
   * Specifies the elicitation setting details eliciting a slot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html
   */
  export interface SlotValueElicitationSettingProperty {
    /**
     * A list of default values for a slot.
     *
     * Default values are used when Amazon Lex hasn't determined a value for a slot. You can specify default values from context variables, session attributes, and defined values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-defaultvaluespecification
     */
    readonly defaultValueSpecification?: cdk.IResolvable | CfnBot.SlotDefaultValueSpecificationProperty;

    /**
     * The prompt that Amazon Lex uses to elicit the slot value from the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-promptspecification
     */
    readonly promptSpecification?: cdk.IResolvable | CfnBot.PromptSpecificationProperty;

    /**
     * If you know a specific pattern that users might respond to an Amazon Lex request for a slot value, you can provide those utterances to improve accuracy.
     *
     * This is optional. In most cases, Amazon Lex is capable of understanding user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-sampleutterances
     */
    readonly sampleUtterances?: Array<cdk.IResolvable | CfnBot.SampleUtteranceProperty> | cdk.IResolvable;

    /**
     * Specifies the settings that Amazon Lex uses when a slot value is successfully entered by a user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-slotcapturesetting
     */
    readonly slotCaptureSetting?: cdk.IResolvable | CfnBot.SlotCaptureSettingProperty;

    /**
     * Specifies whether the slot is required or optional.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-slotconstraint
     */
    readonly slotConstraint: string;

    /**
     * Specifies the prompts that Amazon Lex uses while a bot is waiting for customer input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotvalueelicitationsetting.html#cfn-lex-bot-slotvalueelicitationsetting-waitandcontinuespecification
     */
    readonly waitAndContinueSpecification?: cdk.IResolvable | CfnBot.WaitAndContinueSpecificationProperty;
  }

  /**
   * Specifies the prompts that Amazon Lex uses while a bot is waiting for customer input.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html
   */
  export interface WaitAndContinueSpecificationProperty {
    /**
     * The response that Amazon Lex sends to indicate that the bot is ready to continue the conversation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-continueresponse
     */
    readonly continueResponse: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * Specifies whether the bot will wait for a user to respond.
     *
     * When this field is false, wait and continue responses for a slot aren't used. If the `IsActive` field isn't specified, the default is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-isactive
     */
    readonly isActive?: boolean | cdk.IResolvable;

    /**
     * A response that Amazon Lex sends periodically to the user to indicate that the bot is still waiting for input from the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-stillwaitingresponse
     */
    readonly stillWaitingResponse?: cdk.IResolvable | CfnBot.StillWaitingResponseSpecificationProperty;

    /**
     * The response that Amazon Lex sends to indicate that the bot is waiting for the conversation to continue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-waitandcontinuespecification.html#cfn-lex-bot-waitandcontinuespecification-waitingresponse
     */
    readonly waitingResponse: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * Defines the messages that Amazon Lex sends to a user to remind them that the bot is waiting for a response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html
   */
  export interface StillWaitingResponseSpecificationProperty {
    /**
     * Indicates that the user can interrupt the response by speaking while the message is being played.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-allowinterrupt
     */
    readonly allowInterrupt?: boolean | cdk.IResolvable;

    /**
     * How often a message should be sent to the user.
     *
     * Minimum of 1 second, maximum of 5 minutes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-frequencyinseconds
     */
    readonly frequencyInSeconds: number;

    /**
     * One or more message groups, each containing one or more messages, that define the prompts that Amazon Lex sends to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-messagegroupslist
     */
    readonly messageGroupsList: Array<cdk.IResolvable | CfnBot.MessageGroupProperty> | cdk.IResolvable;

    /**
     * If Amazon Lex waits longer than this length of time for a response, it will stop sending messages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-stillwaitingresponsespecification.html#cfn-lex-bot-stillwaitingresponsespecification-timeoutinseconds
     */
    readonly timeoutInSeconds: number;
  }

  /**
   * Settings used when Amazon Lex successfully captures a slot value from a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html
   */
  export interface SlotCaptureSettingProperty {
    /**
     * A list of conditional branches to evaluate after the slot value is captured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-captureconditional
     */
    readonly captureConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot runs when the slot value is captured before the code hook times out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-capturenextstep
     */
    readonly captureNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-captureresponse
     */
    readonly captureResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * Code hook called after Amazon Lex successfully captures a slot value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-codehook
     */
    readonly codeHook?: CfnBot.DialogCodeHookInvocationSettingProperty | cdk.IResolvable;

    /**
     * Code hook called when Amazon Lex doesn't capture a slot value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-elicitationcodehook
     */
    readonly elicitationCodeHook?: CfnBot.ElicitationCodeHookInvocationSettingProperty | cdk.IResolvable;

    /**
     * A list of conditional branches to evaluate when the slot value isn't captured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-failureconditional
     */
    readonly failureConditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies the next step that the bot runs when the slot value code is not recognized.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-failurenextstep
     */
    readonly failureNextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;

    /**
     * Specifies a list of message groups that Amazon Lex uses to respond the user input when the slot fails to be captured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotcapturesetting.html#cfn-lex-bot-slotcapturesetting-failureresponse
     */
    readonly failureResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;
  }

  /**
   * A sample utterance that invokes an intent or respond to a slot elicitation prompt.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html
   */
  export interface SampleUtteranceProperty {
    /**
     * A sample utterance that invokes an intent or respond to a slot elicitation prompt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sampleutterance.html#cfn-lex-bot-sampleutterance-utterance
     */
    readonly utterance: string;
  }

  /**
   * The default value to use when a user doesn't provide a value for a slot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html
   */
  export interface SlotDefaultValueSpecificationProperty {
    /**
     * A list of default values.
     *
     * Amazon Lex chooses the default value to use in the order that they are presented in the list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvaluespecification.html#cfn-lex-bot-slotdefaultvaluespecification-defaultvaluelist
     */
    readonly defaultValueList: Array<cdk.IResolvable | CfnBot.SlotDefaultValueProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the default value to use when a user doesn't provide a value for a slot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html
   */
  export interface SlotDefaultValueProperty {
    /**
     * The default value to use when a user doesn't provide a value for a slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotdefaultvalue.html#cfn-lex-bot-slotdefaultvalue-defaultvalue
     */
    readonly defaultValue: string;
  }

  /**
   * Determines whether Amazon Lex obscures slot values in conversation logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html
   */
  export interface ObfuscationSettingProperty {
    /**
     * Value that determines whether Amazon Lex obscures slot values in conversation logs.
     *
     * The default is to obscure the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-obfuscationsetting.html#cfn-lex-bot-obfuscationsetting-obfuscationsettingtype
     */
    readonly obfuscationSettingType: string;
  }

  /**
   * Indicates whether a slot can return multiple values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-multiplevaluessetting.html
   */
  export interface MultipleValuesSettingProperty {
    /**
     * Indicates whether a slot can return multiple values.
     *
     * When `true` , the slot may return more than one value in a response. When `false` , the slot returns only a single value.
     *
     * Multi-value slots are only available in the en-US locale. If you set this value to `true` in any other locale, Amazon Lex throws a `ValidationException` .
     *
     * If the `allowMutlipleValues` is not set, the default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-multiplevaluessetting.html#cfn-lex-bot-multiplevaluessetting-allowmultiplevalues
     */
    readonly allowMultipleValues?: boolean | cdk.IResolvable;
  }

  /**
   * Settings that determine the Lambda function that Amazon Lex uses for processing user responses.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html
   */
  export interface DialogCodeHookSettingProperty {
    /**
     * Enables the dialog code hook so that it processes user requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dialogcodehooksetting.html#cfn-lex-bot-dialogcodehooksetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * A context that must be active for an intent to be selected by Amazon Lex.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html
   */
  export interface InputContextProperty {
    /**
     * The name of the context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-inputcontext.html#cfn-lex-bot-inputcontext-name
     */
    readonly name: string;
  }

  /**
   * Provides configuration information for the `AMAZON.KendraSearchIntent` intent. When you use this intent, Amazon Lex searches the specified Amazon Kendra index and returns documents from the index that match the user's utterance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html
   */
  export interface KendraConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kendra index that you want the `AMAZON.KendraSearchIntent` intent to search. The index must be in the same account and Region as the Amazon Lex bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-kendraindex
     */
    readonly kendraIndex: string;

    /**
     * A query filter that Amazon Lex sends to Amazon Kendra to filter the response from a query.
     *
     * The filter is in the format defined by Amazon Kendra. For more information, see [Filtering queries](https://docs.aws.amazon.com/kendra/latest/dg/filtering.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-queryfilterstring
     */
    readonly queryFilterString?: string;

    /**
     * Determines whether the `AMAZON.KendraSearchIntent` intent uses a custom query string to query the Amazon Kendra index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-kendraconfiguration.html#cfn-lex-bot-kendraconfiguration-queryfilterstringenabled
     */
    readonly queryFilterStringEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Provides a statement the Amazon Lex conveys to the user when the intent is successfully fulfilled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html
   */
  export interface IntentClosingSettingProperty {
    /**
     * The response that Amazon Lex sends to the user when the intent is complete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-closingresponse
     */
    readonly closingResponse?: cdk.IResolvable | CfnBot.ResponseSpecificationProperty;

    /**
     * A list of conditional branches associated with the intent's closing response.
     *
     * These branches are executed when the `nextStep` attribute is set to `EvalutateConditional` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-conditional
     */
    readonly conditional?: CfnBot.ConditionalSpecificationProperty | cdk.IResolvable;

    /**
     * Specifies whether an intent's closing response is used.
     *
     * When this field is false, the closing response isn't sent to the user. If the `IsActive` field isn't specified, the default is true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-isactive
     */
    readonly isActive?: boolean | cdk.IResolvable;

    /**
     * Specifies the next step that the bot executes after playing the intent's closing response.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-intentclosingsetting.html#cfn-lex-bot-intentclosingsetting-nextstep
     */
    readonly nextStep?: CfnBot.DialogStateProperty | cdk.IResolvable;
  }

  /**
   * Describes a session context that is activated when an intent is fulfilled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html
   */
  export interface OutputContextProperty {
    /**
     * The name of the output context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-name
     */
    readonly name: string;

    /**
     * The amount of time, in seconds, that the output context should remain active.
     *
     * The time is figured from the first time the context is sent to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-timetoliveinseconds
     */
    readonly timeToLiveInSeconds: number;

    /**
     * The number of conversation turns that the output context should remain active.
     *
     * The number of turns is counted from the first time that the context is sent to the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-outputcontext.html#cfn-lex-bot-outputcontext-turnstolive
     */
    readonly turnsToLive: number;
  }

  /**
   * Sets the priority that Amazon Lex should use when eliciting slot values from a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html
   */
  export interface SlotPriorityProperty {
    /**
     * The priority that Amazon Lex should apply to the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html#cfn-lex-bot-slotpriority-priority
     */
    readonly priority: number;

    /**
     * The name of the slot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-slotpriority.html#cfn-lex-bot-slotpriority-slotname
     */
    readonly slotName: string;
  }

  /**
   * Defines settings for using an Amazon Polly voice to communicate with a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html
   */
  export interface VoiceSettingsProperty {
    /**
     * Indicates the type of Amazon Polly voice that Amazon Lex should use for voice interaction with the user.
     *
     * For more information, see the [`engine` parameter of the `SynthesizeSpeech` operation](https://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html#polly-SynthesizeSpeech-request-Engine) in the *Amazon Polly developer guide* .
     *
     * If you do not specify a value, the default is `standard` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html#cfn-lex-bot-voicesettings-engine
     */
    readonly engine?: string;

    /**
     * The identifier of the Amazon Polly voice to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-voicesettings.html#cfn-lex-bot-voicesettings-voiceid
     */
    readonly voiceId: string;
  }

  /**
   * Defines an Amazon S3 bucket location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3bucket
     */
    readonly s3Bucket: string;

    /**
     * The path and file name to the object in the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3objectkey
     */
    readonly s3ObjectKey: string;

    /**
     * The version of the object in the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3location.html#cfn-lex-bot-s3location-s3objectversion
     */
    readonly s3ObjectVersion?: string;
  }

  /**
   * Specifies configuration settings for the alias used to test the bot.
   *
   * If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html
   */
  export interface TestBotAliasSettingsProperty {
    /**
     * Specifies settings that are unique to a locale.
     *
     * For example, you can use a different Lambda function depending on the bot's locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-botaliaslocalesettings
     */
    readonly botAliasLocaleSettings?: Array<CfnBot.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Specifies settings for conversation logs that save audio, text, and metadata information for conversations with your users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-conversationlogsettings
     */
    readonly conversationLogSettings?: CfnBot.ConversationLogSettingsProperty | cdk.IResolvable;

    /**
     * Specifies a description for the test bot alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-description
     */
    readonly description?: string;

    /**
     * Specifies whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-testbotaliassettings.html#cfn-lex-bot-testbotaliassettings-sentimentanalysissettings
     */
    readonly sentimentAnalysisSettings?: any | cdk.IResolvable;
  }

  /**
   * Specifies locale settings for a single locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html
   */
  export interface BotAliasLocaleSettingsItemProperty {
    /**
     * Specifies locale settings for a locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html#cfn-lex-bot-botaliaslocalesettingsitem-botaliaslocalesetting
     */
    readonly botAliasLocaleSetting: CfnBot.BotAliasLocaleSettingsProperty | cdk.IResolvable;

    /**
     * Specifies the locale that the settings apply to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettingsitem.html#cfn-lex-bot-botaliaslocalesettingsitem-localeid
     */
    readonly localeId: string;
  }

  /**
   * Specifies settings that are unique to a locale.
   *
   * For example, you can use different Lambda function depending on the bot's locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html
   */
  export interface BotAliasLocaleSettingsProperty {
    /**
     * Specifies the Lambda function that should be used in the locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html#cfn-lex-bot-botaliaslocalesettings-codehookspecification
     */
    readonly codeHookSpecification?: CfnBot.CodeHookSpecificationProperty | cdk.IResolvable;

    /**
     * Determines whether the locale is enabled for the bot.
     *
     * If the value is `false` , the locale isn't available for use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-botaliaslocalesettings.html#cfn-lex-bot-botaliaslocalesettings-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Contains information about code hooks that Amazon Lex calls during a conversation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html
   */
  export interface CodeHookSpecificationProperty {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-codehookspecification.html#cfn-lex-bot-codehookspecification-lambdacodehook
     */
    readonly lambdaCodeHook: cdk.IResolvable | CfnBot.LambdaCodeHookProperty;
  }

  /**
   * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html
   */
  export interface LambdaCodeHookProperty {
    /**
     * The version of the request-response that you want Amazon Lex to use to invoke your Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html#cfn-lex-bot-lambdacodehook-codehookinterfaceversion
     */
    readonly codeHookInterfaceVersion: string;

    /**
     * The Amazon Resource Name (ARN) of the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-lambdacodehook.html#cfn-lex-bot-lambdacodehook-lambdaarn
     */
    readonly lambdaArn: string;
  }

  /**
   * Configures conversation logging that saves audio, text, and metadata for the conversations with your users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html
   */
  export interface ConversationLogSettingsProperty {
    /**
     * The Amazon S3 settings for logging audio to an S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html#cfn-lex-bot-conversationlogsettings-audiologsettings
     */
    readonly audioLogSettings?: Array<CfnBot.AudioLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon CloudWatch Logs settings for logging text and metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-conversationlogsettings.html#cfn-lex-bot-conversationlogsettings-textlogsettings
     */
    readonly textLogSettings?: Array<cdk.IResolvable | CfnBot.TextLogSettingProperty> | cdk.IResolvable;
  }

  /**
   * Defines settings to enable text conversation logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html
   */
  export interface TextLogSettingProperty {
    /**
     * Specifies the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html#cfn-lex-bot-textlogsetting-destination
     */
    readonly destination: cdk.IResolvable | CfnBot.TextLogDestinationProperty;

    /**
     * Determines whether conversation logs should be stored for an alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogsetting.html#cfn-lex-bot-textlogsetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html
   */
  export interface TextLogDestinationProperty {
    /**
     * Defines the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-textlogdestination.html#cfn-lex-bot-textlogdestination-cloudwatch
     */
    readonly cloudWatch: CfnBot.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
  }

  /**
   * The Amazon CloudWatch Logs log group where the text and metadata logs are delivered.
   *
   * The log group must exist before you enable logging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html
   */
  export interface CloudWatchLogGroupLogDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the log group where text and metadata logs are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html#cfn-lex-bot-cloudwatchloggrouplogdestination-cloudwatchloggrouparn
     */
    readonly cloudWatchLogGroupArn: string;

    /**
     * The prefix of the log stream name within the log group that you specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-cloudwatchloggrouplogdestination.html#cfn-lex-bot-cloudwatchloggrouplogdestination-logprefix
     */
    readonly logPrefix: string;
  }

  /**
   * Settings for logging audio of conversations between Amazon Lex and a user.
   *
   * You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html
   */
  export interface AudioLogSettingProperty {
    /**
     * Specifies the location of the audio log files collected when conversation logging is enabled for a bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html#cfn-lex-bot-audiologsetting-destination
     */
    readonly destination: CfnBot.AudioLogDestinationProperty | cdk.IResolvable;

    /**
     * Determines whether audio logging in enabled for the bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologsetting.html#cfn-lex-bot-audiologsetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * The location of audio log files collected when conversation logging is enabled for a bot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html
   */
  export interface AudioLogDestinationProperty {
    /**
     * Specifies the Amazon S3 bucket where the audio files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-audiologdestination.html#cfn-lex-bot-audiologdestination-s3bucket
     */
    readonly s3Bucket: cdk.IResolvable | CfnBot.S3BucketLogDestinationProperty;
  }

  /**
   * Specifies an Amazon S3 bucket for logging audio conversations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html
   */
  export interface S3BucketLogDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of an AWS Key Management Service (KMS) key for encrypting audio log files stored in an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The S3 prefix to assign to audio log files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-logprefix
     */
    readonly logPrefix: string;

    /**
     * The Amazon Resource Name (ARN) of an Amazon S3 bucket where audio log files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-s3bucketlogdestination.html#cfn-lex-bot-s3bucketlogdestination-s3bucketarn
     */
    readonly s3BucketArn: string;
  }

  /**
   * By default, data stored by Amazon Lex is encrypted.
   *
   * The `DataPrivacy` structure provides settings that determine how Amazon Lex handles special cases of securing the data for your bot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html
   */
  export interface DataPrivacyProperty {
    /**
     * For each Amazon Lex bot created with the Amazon Lex Model Building Service, you must specify whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to the Children's Online Privacy Protection Act (COPPA) by specifying `true` or `false` in the `childDirected` field.
     *
     * By specifying `true` in the `childDirected` field, you confirm that your use of Amazon Lex *is* related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. By specifying `false` in the `childDirected` field, you confirm that your use of Amazon Lex *is not* related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. You may not specify a default value for the `childDirected` field that does not accurately reflect whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. If your use of Amazon Lex relates to a website, program, or other application that is directed in whole or in part, to children under age 13, you must obtain any required verifiable parental consent under COPPA. For information regarding the use of Amazon Lex in connection with websites, programs, or other applications that are directed or targeted, in whole or in part, to children under age 13, see the [Amazon Lex FAQ](https://docs.aws.amazon.com/lex/faqs#data-security) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-dataprivacy.html#cfn-lex-bot-dataprivacy-childdirected
     */
    readonly childDirected: boolean | cdk.IResolvable;
  }

  /**
   * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html
   */
  export interface SentimentAnalysisSettingsProperty {
    /**
     * Sets whether Amazon Lex uses Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-bot-sentimentanalysissettings.html#cfn-lex-bot-sentimentanalysissettings-detectsentiment
     */
    readonly detectSentiment: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnBot`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html
 */
export interface CfnBotProps {
  /**
   * Indicates whether Amazon Lex V2 should automatically build the locales for the bot after a change.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-autobuildbotlocales
   */
  readonly autoBuildBotLocales?: boolean | cdk.IResolvable;

  /**
   * The Amazon S3 location of files used to import a bot.
   *
   * The files must be in the import format specified in [JSON format for importing and exporting](https://docs.aws.amazon.com/lexv2/latest/dg/import-export-format.html) in the *Amazon Lex developer guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botfiles3location
   */
  readonly botFileS3Location?: cdk.IResolvable | CfnBot.S3LocationProperty;

  /**
   * A list of locales for the bot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-botlocales
   */
  readonly botLocales?: Array<CfnBot.BotLocaleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A list of tags to add to the bot.
   *
   * You can only add tags when you import a bot. You can't use the `UpdateBot` operation to update tags. To update tags, use the `TagResource` operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-bottags
   */
  readonly botTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * By default, data stored by Amazon Lex is encrypted.
   *
   * The `DataPrivacy` structure provides settings that determine how Amazon Lex handles special cases of securing the data for your bot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-dataprivacy
   */
  readonly dataPrivacy: any | cdk.IResolvable;

  /**
   * The description of the version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-description
   */
  readonly description?: string;

  /**
   * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.
   *
   * A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout.
   *
   * You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-idlesessionttlinseconds
   */
  readonly idleSessionTtlInSeconds: number;

  /**
   * The name of the bot locale.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-rolearn
   */
  readonly roleArn: string;

  /**
   * Specifies configuration settings for the alias used to test the bot.
   *
   * If the `TestBotAliasSettings` property is not specified, the settings are configured with default values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliassettings
   */
  readonly testBotAliasSettings?: cdk.IResolvable | CfnBot.TestBotAliasSettingsProperty;

  /**
   * A list of tags to add to the test alias for a bot.
   *
   * You can only add tags when you import a bot. You can't use the `UpdateAlias` operation to update tags. To update tags on the test alias, use the `TagResource` operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-bot.html#cfn-lex-bot-testbotaliastags
   */
  readonly testBotAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CustomVocabularyItemProperty`
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotCustomVocabularyItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("displayAs", cdk.validateString)(properties.displayAs));
  errors.collect(cdk.propertyValidator("phrase", cdk.requiredValidator)(properties.phrase));
  errors.collect(cdk.propertyValidator("phrase", cdk.validateString)(properties.phrase));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"CustomVocabularyItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotCustomVocabularyItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotCustomVocabularyItemPropertyValidator(properties).assertSuccess();
  return {
    "DisplayAs": cdk.stringToCloudFormation(properties.displayAs),
    "Phrase": cdk.stringToCloudFormation(properties.phrase),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnBotCustomVocabularyItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomVocabularyItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomVocabularyItemProperty>();
  ret.addPropertyResult("displayAs", "DisplayAs", (properties.DisplayAs != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayAs) : undefined));
  ret.addPropertyResult("phrase", "Phrase", (properties.Phrase != null ? cfn_parse.FromCloudFormation.getString(properties.Phrase) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomVocabularyProperty`
 *
 * @param properties - the TypeScript properties of a `CustomVocabularyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotCustomVocabularyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customVocabularyItems", cdk.requiredValidator)(properties.customVocabularyItems));
  errors.collect(cdk.propertyValidator("customVocabularyItems", cdk.listValidator(CfnBotCustomVocabularyItemPropertyValidator))(properties.customVocabularyItems));
  return errors.wrap("supplied properties not correct for \"CustomVocabularyProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotCustomVocabularyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotCustomVocabularyPropertyValidator(properties).assertSuccess();
  return {
    "CustomVocabularyItems": cdk.listMapper(convertCfnBotCustomVocabularyItemPropertyToCloudFormation)(properties.customVocabularyItems)
  };
}

// @ts-ignore TS6133
function CfnBotCustomVocabularyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomVocabularyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomVocabularyProperty>();
  ret.addPropertyResult("customVocabularyItems", "CustomVocabularyItems", (properties.CustomVocabularyItems != null ? cfn_parse.FromCloudFormation.getArray(CfnBotCustomVocabularyItemPropertyFromCloudFormation)(properties.CustomVocabularyItems) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SampleValueProperty`
 *
 * @param properties - the TypeScript properties of a `SampleValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSampleValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SampleValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSampleValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSampleValuePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotSampleValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SampleValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SampleValueProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotTypeValueProperty`
 *
 * @param properties - the TypeScript properties of a `SlotTypeValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotTypeValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sampleValue", cdk.requiredValidator)(properties.sampleValue));
  errors.collect(cdk.propertyValidator("sampleValue", CfnBotSampleValuePropertyValidator)(properties.sampleValue));
  errors.collect(cdk.propertyValidator("synonyms", cdk.listValidator(CfnBotSampleValuePropertyValidator))(properties.synonyms));
  return errors.wrap("supplied properties not correct for \"SlotTypeValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotTypeValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotTypeValuePropertyValidator(properties).assertSuccess();
  return {
    "SampleValue": convertCfnBotSampleValuePropertyToCloudFormation(properties.sampleValue),
    "Synonyms": cdk.listMapper(convertCfnBotSampleValuePropertyToCloudFormation)(properties.synonyms)
  };
}

// @ts-ignore TS6133
function CfnBotSlotTypeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotTypeValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotTypeValueProperty>();
  ret.addPropertyResult("sampleValue", "SampleValue", (properties.SampleValue != null ? CfnBotSampleValuePropertyFromCloudFormation(properties.SampleValue) : undefined));
  ret.addPropertyResult("synonyms", "Synonyms", (properties.Synonyms != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleValuePropertyFromCloudFormation)(properties.Synonyms) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdvancedRecognitionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedRecognitionSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAdvancedRecognitionSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audioRecognitionStrategy", cdk.validateString)(properties.audioRecognitionStrategy));
  return errors.wrap("supplied properties not correct for \"AdvancedRecognitionSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAdvancedRecognitionSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAdvancedRecognitionSettingPropertyValidator(properties).assertSuccess();
  return {
    "AudioRecognitionStrategy": cdk.stringToCloudFormation(properties.audioRecognitionStrategy)
  };
}

// @ts-ignore TS6133
function CfnBotAdvancedRecognitionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AdvancedRecognitionSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AdvancedRecognitionSettingProperty>();
  ret.addPropertyResult("audioRecognitionStrategy", "AudioRecognitionStrategy", (properties.AudioRecognitionStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AudioRecognitionStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueRegexFilterProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueRegexFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValueRegexFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"SlotValueRegexFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValueRegexFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValueRegexFilterPropertyValidator(properties).assertSuccess();
  return {
    "Pattern": cdk.stringToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValueRegexFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueRegexFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueRegexFilterProperty>();
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueSelectionSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueSelectionSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValueSelectionSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("advancedRecognitionSetting", CfnBotAdvancedRecognitionSettingPropertyValidator)(properties.advancedRecognitionSetting));
  errors.collect(cdk.propertyValidator("regexFilter", CfnBotSlotValueRegexFilterPropertyValidator)(properties.regexFilter));
  errors.collect(cdk.propertyValidator("resolutionStrategy", cdk.requiredValidator)(properties.resolutionStrategy));
  errors.collect(cdk.propertyValidator("resolutionStrategy", cdk.validateString)(properties.resolutionStrategy));
  return errors.wrap("supplied properties not correct for \"SlotValueSelectionSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValueSelectionSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValueSelectionSettingPropertyValidator(properties).assertSuccess();
  return {
    "AdvancedRecognitionSetting": convertCfnBotAdvancedRecognitionSettingPropertyToCloudFormation(properties.advancedRecognitionSetting),
    "RegexFilter": convertCfnBotSlotValueRegexFilterPropertyToCloudFormation(properties.regexFilter),
    "ResolutionStrategy": cdk.stringToCloudFormation(properties.resolutionStrategy)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValueSelectionSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueSelectionSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueSelectionSettingProperty>();
  ret.addPropertyResult("advancedRecognitionSetting", "AdvancedRecognitionSetting", (properties.AdvancedRecognitionSetting != null ? CfnBotAdvancedRecognitionSettingPropertyFromCloudFormation(properties.AdvancedRecognitionSetting) : undefined));
  ret.addPropertyResult("regexFilter", "RegexFilter", (properties.RegexFilter != null ? CfnBotSlotValueRegexFilterPropertyFromCloudFormation(properties.RegexFilter) : undefined));
  ret.addPropertyResult("resolutionStrategy", "ResolutionStrategy", (properties.ResolutionStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.ResolutionStrategy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrammarSlotTypeSourceProperty`
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.requiredValidator)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3ObjectKey", cdk.requiredValidator)(properties.s3ObjectKey));
  errors.collect(cdk.propertyValidator("s3ObjectKey", cdk.validateString)(properties.s3ObjectKey));
  return errors.wrap("supplied properties not correct for \"GrammarSlotTypeSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotGrammarSlotTypeSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotGrammarSlotTypeSourcePropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3ObjectKey": cdk.stringToCloudFormation(properties.s3ObjectKey)
  };
}

// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.GrammarSlotTypeSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.GrammarSlotTypeSourceProperty>();
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3ObjectKey", "S3ObjectKey", (properties.S3ObjectKey != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GrammarSlotTypeSettingProperty`
 *
 * @param properties - the TypeScript properties of a `GrammarSlotTypeSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("source", CfnBotGrammarSlotTypeSourcePropertyValidator)(properties.source));
  return errors.wrap("supplied properties not correct for \"GrammarSlotTypeSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotGrammarSlotTypeSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotGrammarSlotTypeSettingPropertyValidator(properties).assertSuccess();
  return {
    "Source": convertCfnBotGrammarSlotTypeSourcePropertyToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnBotGrammarSlotTypeSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.GrammarSlotTypeSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.GrammarSlotTypeSettingProperty>();
  ret.addPropertyResult("source", "Source", (properties.Source != null ? CfnBotGrammarSlotTypeSourcePropertyFromCloudFormation(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExternalSourceSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ExternalSourceSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotExternalSourceSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grammarSlotTypeSetting", CfnBotGrammarSlotTypeSettingPropertyValidator)(properties.grammarSlotTypeSetting));
  return errors.wrap("supplied properties not correct for \"ExternalSourceSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotExternalSourceSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotExternalSourceSettingPropertyValidator(properties).assertSuccess();
  return {
    "GrammarSlotTypeSetting": convertCfnBotGrammarSlotTypeSettingPropertyToCloudFormation(properties.grammarSlotTypeSetting)
  };
}

// @ts-ignore TS6133
function CfnBotExternalSourceSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ExternalSourceSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ExternalSourceSettingProperty>();
  ret.addPropertyResult("grammarSlotTypeSetting", "GrammarSlotTypeSetting", (properties.GrammarSlotTypeSetting != null ? CfnBotGrammarSlotTypeSettingPropertyFromCloudFormation(properties.GrammarSlotTypeSetting) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotTypeProperty`
 *
 * @param properties - the TypeScript properties of a `SlotTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("externalSourceSetting", CfnBotExternalSourceSettingPropertyValidator)(properties.externalSourceSetting));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parentSlotTypeSignature", cdk.validateString)(properties.parentSlotTypeSignature));
  errors.collect(cdk.propertyValidator("slotTypeValues", cdk.listValidator(CfnBotSlotTypeValuePropertyValidator))(properties.slotTypeValues));
  errors.collect(cdk.propertyValidator("valueSelectionSetting", CfnBotSlotValueSelectionSettingPropertyValidator)(properties.valueSelectionSetting));
  return errors.wrap("supplied properties not correct for \"SlotTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotTypePropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExternalSourceSetting": convertCfnBotExternalSourceSettingPropertyToCloudFormation(properties.externalSourceSetting),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParentSlotTypeSignature": cdk.stringToCloudFormation(properties.parentSlotTypeSignature),
    "SlotTypeValues": cdk.listMapper(convertCfnBotSlotTypeValuePropertyToCloudFormation)(properties.slotTypeValues),
    "ValueSelectionSetting": convertCfnBotSlotValueSelectionSettingPropertyToCloudFormation(properties.valueSelectionSetting)
  };
}

// @ts-ignore TS6133
function CfnBotSlotTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotTypeProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("externalSourceSetting", "ExternalSourceSetting", (properties.ExternalSourceSetting != null ? CfnBotExternalSourceSettingPropertyFromCloudFormation(properties.ExternalSourceSetting) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parentSlotTypeSignature", "ParentSlotTypeSignature", (properties.ParentSlotTypeSignature != null ? cfn_parse.FromCloudFormation.getString(properties.ParentSlotTypeSignature) : undefined));
  ret.addPropertyResult("slotTypeValues", "SlotTypeValues", (properties.SlotTypeValues != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotTypeValuePropertyFromCloudFormation)(properties.SlotTypeValues) : undefined));
  ret.addPropertyResult("valueSelectionSetting", "ValueSelectionSetting", (properties.ValueSelectionSetting != null ? CfnBotSlotValueSelectionSettingPropertyFromCloudFormation(properties.ValueSelectionSetting) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomPayloadProperty`
 *
 * @param properties - the TypeScript properties of a `CustomPayloadProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotCustomPayloadPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CustomPayloadProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotCustomPayloadPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotCustomPayloadPropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotCustomPayloadPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CustomPayloadProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CustomPayloadProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ButtonProperty`
 *
 * @param properties - the TypeScript properties of a `ButtonProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotButtonPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("text", cdk.requiredValidator)(properties.text));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ButtonProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotButtonPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotButtonPropertyValidator(properties).assertSuccess();
  return {
    "Text": cdk.stringToCloudFormation(properties.text),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotButtonPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ButtonProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ButtonProperty>();
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageResponseCardProperty`
 *
 * @param properties - the TypeScript properties of a `ImageResponseCardProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotImageResponseCardPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("buttons", cdk.listValidator(CfnBotButtonPropertyValidator))(properties.buttons));
  errors.collect(cdk.propertyValidator("imageUrl", cdk.validateString)(properties.imageUrl));
  errors.collect(cdk.propertyValidator("subtitle", cdk.validateString)(properties.subtitle));
  errors.collect(cdk.propertyValidator("title", cdk.requiredValidator)(properties.title));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  return errors.wrap("supplied properties not correct for \"ImageResponseCardProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotImageResponseCardPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotImageResponseCardPropertyValidator(properties).assertSuccess();
  return {
    "Buttons": cdk.listMapper(convertCfnBotButtonPropertyToCloudFormation)(properties.buttons),
    "ImageUrl": cdk.stringToCloudFormation(properties.imageUrl),
    "Subtitle": cdk.stringToCloudFormation(properties.subtitle),
    "Title": cdk.stringToCloudFormation(properties.title)
  };
}

// @ts-ignore TS6133
function CfnBotImageResponseCardPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ImageResponseCardProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ImageResponseCardProperty>();
  ret.addPropertyResult("buttons", "Buttons", (properties.Buttons != null ? cfn_parse.FromCloudFormation.getArray(CfnBotButtonPropertyFromCloudFormation)(properties.Buttons) : undefined));
  ret.addPropertyResult("imageUrl", "ImageUrl", (properties.ImageUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUrl) : undefined));
  ret.addPropertyResult("subtitle", "Subtitle", (properties.Subtitle != null ? cfn_parse.FromCloudFormation.getString(properties.Subtitle) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PlainTextMessageProperty`
 *
 * @param properties - the TypeScript properties of a `PlainTextMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPlainTextMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"PlainTextMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotPlainTextMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPlainTextMessagePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotPlainTextMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.PlainTextMessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PlainTextMessageProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SSMLMessageProperty`
 *
 * @param properties - the TypeScript properties of a `SSMLMessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSSMLMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SSMLMessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSSMLMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSSMLMessagePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotSSMLMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SSMLMessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SSMLMessageProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MessageProperty`
 *
 * @param properties - the TypeScript properties of a `MessageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotMessagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customPayload", CfnBotCustomPayloadPropertyValidator)(properties.customPayload));
  errors.collect(cdk.propertyValidator("imageResponseCard", CfnBotImageResponseCardPropertyValidator)(properties.imageResponseCard));
  errors.collect(cdk.propertyValidator("plainTextMessage", CfnBotPlainTextMessagePropertyValidator)(properties.plainTextMessage));
  errors.collect(cdk.propertyValidator("ssmlMessage", CfnBotSSMLMessagePropertyValidator)(properties.ssmlMessage));
  return errors.wrap("supplied properties not correct for \"MessageProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotMessagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotMessagePropertyValidator(properties).assertSuccess();
  return {
    "CustomPayload": convertCfnBotCustomPayloadPropertyToCloudFormation(properties.customPayload),
    "ImageResponseCard": convertCfnBotImageResponseCardPropertyToCloudFormation(properties.imageResponseCard),
    "PlainTextMessage": convertCfnBotPlainTextMessagePropertyToCloudFormation(properties.plainTextMessage),
    "SSMLMessage": convertCfnBotSSMLMessagePropertyToCloudFormation(properties.ssmlMessage)
  };
}

// @ts-ignore TS6133
function CfnBotMessagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.MessageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MessageProperty>();
  ret.addPropertyResult("customPayload", "CustomPayload", (properties.CustomPayload != null ? CfnBotCustomPayloadPropertyFromCloudFormation(properties.CustomPayload) : undefined));
  ret.addPropertyResult("imageResponseCard", "ImageResponseCard", (properties.ImageResponseCard != null ? CfnBotImageResponseCardPropertyFromCloudFormation(properties.ImageResponseCard) : undefined));
  ret.addPropertyResult("plainTextMessage", "PlainTextMessage", (properties.PlainTextMessage != null ? CfnBotPlainTextMessagePropertyFromCloudFormation(properties.PlainTextMessage) : undefined));
  ret.addPropertyResult("ssmlMessage", "SSMLMessage", (properties.SSMLMessage != null ? CfnBotSSMLMessagePropertyFromCloudFormation(properties.SSMLMessage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MessageGroupProperty`
 *
 * @param properties - the TypeScript properties of a `MessageGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotMessageGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("message", cdk.requiredValidator)(properties.message));
  errors.collect(cdk.propertyValidator("message", CfnBotMessagePropertyValidator)(properties.message));
  errors.collect(cdk.propertyValidator("variations", cdk.listValidator(CfnBotMessagePropertyValidator))(properties.variations));
  return errors.wrap("supplied properties not correct for \"MessageGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotMessageGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotMessageGroupPropertyValidator(properties).assertSuccess();
  return {
    "Message": convertCfnBotMessagePropertyToCloudFormation(properties.message),
    "Variations": cdk.listMapper(convertCfnBotMessagePropertyToCloudFormation)(properties.variations)
  };
}

// @ts-ignore TS6133
function CfnBotMessageGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.MessageGroupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MessageGroupProperty>();
  ret.addPropertyResult("message", "Message", (properties.Message != null ? CfnBotMessagePropertyFromCloudFormation(properties.Message) : undefined));
  ret.addPropertyResult("variations", "Variations", (properties.Variations != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessagePropertyFromCloudFormation)(properties.Variations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.requiredValidator)(properties.messageGroupsList));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.listValidator(CfnBotMessageGroupPropertyValidator))(properties.messageGroupsList));
  return errors.wrap("supplied properties not correct for \"ResponseSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotResponseSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotResponseSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "MessageGroupsList": cdk.listMapper(convertCfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList)
  };
}

// @ts-ignore TS6133
function CfnBotResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.ResponseSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ResponseSpecificationProperty>();
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("messageGroupsList", "MessageGroupsList", (properties.MessageGroupsList != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DialogActionProperty`
 *
 * @param properties - the TypeScript properties of a `DialogActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDialogActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("slotToElicit", cdk.validateString)(properties.slotToElicit));
  errors.collect(cdk.propertyValidator("suppressNextMessage", cdk.validateBoolean)(properties.suppressNextMessage));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DialogActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDialogActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDialogActionPropertyValidator(properties).assertSuccess();
  return {
    "SlotToElicit": cdk.stringToCloudFormation(properties.slotToElicit),
    "SuppressNextMessage": cdk.booleanToCloudFormation(properties.suppressNextMessage),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnBotDialogActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DialogActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DialogActionProperty>();
  ret.addPropertyResult("slotToElicit", "SlotToElicit", (properties.SlotToElicit != null ? cfn_parse.FromCloudFormation.getString(properties.SlotToElicit) : undefined));
  ret.addPropertyResult("suppressNextMessage", "SuppressNextMessage", (properties.SuppressNextMessage != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SuppressNextMessage) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SessionAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `SessionAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSessionAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"SessionAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSessionAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSessionAttributePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBotSessionAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SessionAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SessionAttributeProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("interpretedValue", cdk.validateString)(properties.interpretedValue));
  return errors.wrap("supplied properties not correct for \"SlotValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValuePropertyValidator(properties).assertSuccess();
  return {
    "InterpretedValue": cdk.stringToCloudFormation(properties.interpretedValue)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueProperty>();
  ret.addPropertyResult("interpretedValue", "InterpretedValue", (properties.InterpretedValue != null ? cfn_parse.FromCloudFormation.getString(properties.InterpretedValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValueOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("shape", cdk.validateString)(properties.shape));
  errors.collect(cdk.propertyValidator("value", CfnBotSlotValuePropertyValidator)(properties.value));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(CfnBotSlotValueOverridePropertyValidator))(properties.values));
  return errors.wrap("supplied properties not correct for \"SlotValueOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValueOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValueOverridePropertyValidator(properties).assertSuccess();
  return {
    "Shape": cdk.stringToCloudFormation(properties.shape),
    "Value": convertCfnBotSlotValuePropertyToCloudFormation(properties.value),
    "Values": cdk.listMapper(convertCfnBotSlotValueOverridePropertyToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValueOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueOverrideProperty>();
  ret.addPropertyResult("shape", "Shape", (properties.Shape != null ? cfn_parse.FromCloudFormation.getString(properties.Shape) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnBotSlotValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotValueOverridePropertyFromCloudFormation)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueOverrideMapProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueOverrideMapProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValueOverrideMapPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("slotName", cdk.validateString)(properties.slotName));
  errors.collect(cdk.propertyValidator("slotValueOverride", CfnBotSlotValueOverridePropertyValidator)(properties.slotValueOverride));
  return errors.wrap("supplied properties not correct for \"SlotValueOverrideMapProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValueOverrideMapPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValueOverrideMapPropertyValidator(properties).assertSuccess();
  return {
    "SlotName": cdk.stringToCloudFormation(properties.slotName),
    "SlotValueOverride": convertCfnBotSlotValueOverridePropertyToCloudFormation(properties.slotValueOverride)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValueOverrideMapPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueOverrideMapProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueOverrideMapProperty>();
  ret.addPropertyResult("slotName", "SlotName", (properties.SlotName != null ? cfn_parse.FromCloudFormation.getString(properties.SlotName) : undefined));
  ret.addPropertyResult("slotValueOverride", "SlotValueOverride", (properties.SlotValueOverride != null ? CfnBotSlotValueOverridePropertyFromCloudFormation(properties.SlotValueOverride) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntentOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `IntentOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotIntentOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("slots", cdk.listValidator(CfnBotSlotValueOverrideMapPropertyValidator))(properties.slots));
  return errors.wrap("supplied properties not correct for \"IntentOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotIntentOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotIntentOverridePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Slots": cdk.listMapper(convertCfnBotSlotValueOverrideMapPropertyToCloudFormation)(properties.slots)
  };
}

// @ts-ignore TS6133
function CfnBotIntentOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentOverrideProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentOverrideProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("slots", "Slots", (properties.Slots != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotValueOverrideMapPropertyFromCloudFormation)(properties.Slots) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DialogStateProperty`
 *
 * @param properties - the TypeScript properties of a `DialogStateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDialogStatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dialogAction", CfnBotDialogActionPropertyValidator)(properties.dialogAction));
  errors.collect(cdk.propertyValidator("intent", CfnBotIntentOverridePropertyValidator)(properties.intent));
  errors.collect(cdk.propertyValidator("sessionAttributes", cdk.listValidator(CfnBotSessionAttributePropertyValidator))(properties.sessionAttributes));
  return errors.wrap("supplied properties not correct for \"DialogStateProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDialogStatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDialogStatePropertyValidator(properties).assertSuccess();
  return {
    "DialogAction": convertCfnBotDialogActionPropertyToCloudFormation(properties.dialogAction),
    "Intent": convertCfnBotIntentOverridePropertyToCloudFormation(properties.intent),
    "SessionAttributes": cdk.listMapper(convertCfnBotSessionAttributePropertyToCloudFormation)(properties.sessionAttributes)
  };
}

// @ts-ignore TS6133
function CfnBotDialogStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DialogStateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DialogStateProperty>();
  ret.addPropertyResult("dialogAction", "DialogAction", (properties.DialogAction != null ? CfnBotDialogActionPropertyFromCloudFormation(properties.DialogAction) : undefined));
  ret.addPropertyResult("intent", "Intent", (properties.Intent != null ? CfnBotIntentOverridePropertyFromCloudFormation(properties.Intent) : undefined));
  ret.addPropertyResult("sessionAttributes", "SessionAttributes", (properties.SessionAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSessionAttributePropertyFromCloudFormation)(properties.SessionAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultConditionalBranchProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultConditionalBranchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDefaultConditionalBranchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("nextStep", CfnBotDialogStatePropertyValidator)(properties.nextStep));
  errors.collect(cdk.propertyValidator("response", CfnBotResponseSpecificationPropertyValidator)(properties.response));
  return errors.wrap("supplied properties not correct for \"DefaultConditionalBranchProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDefaultConditionalBranchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDefaultConditionalBranchPropertyValidator(properties).assertSuccess();
  return {
    "NextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.nextStep),
    "Response": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.response)
  };
}

// @ts-ignore TS6133
function CfnBotDefaultConditionalBranchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DefaultConditionalBranchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DefaultConditionalBranchProperty>();
  ret.addPropertyResult("nextStep", "NextStep", (properties.NextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.NextStep) : undefined));
  ret.addPropertyResult("response", "Response", (properties.Response != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.Response) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expressionString", cdk.requiredValidator)(properties.expressionString));
  errors.collect(cdk.propertyValidator("expressionString", cdk.validateString)(properties.expressionString));
  return errors.wrap("supplied properties not correct for \"ConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotConditionPropertyValidator(properties).assertSuccess();
  return {
    "ExpressionString": cdk.stringToCloudFormation(properties.expressionString)
  };
}

// @ts-ignore TS6133
function CfnBotConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ConditionProperty>();
  ret.addPropertyResult("expressionString", "ExpressionString", (properties.ExpressionString != null ? cfn_parse.FromCloudFormation.getString(properties.ExpressionString) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionalBranchProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionalBranchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotConditionalBranchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("condition", cdk.requiredValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("condition", CfnBotConditionPropertyValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("nextStep", cdk.requiredValidator)(properties.nextStep));
  errors.collect(cdk.propertyValidator("nextStep", CfnBotDialogStatePropertyValidator)(properties.nextStep));
  errors.collect(cdk.propertyValidator("response", CfnBotResponseSpecificationPropertyValidator)(properties.response));
  return errors.wrap("supplied properties not correct for \"ConditionalBranchProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotConditionalBranchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotConditionalBranchPropertyValidator(properties).assertSuccess();
  return {
    "Condition": convertCfnBotConditionPropertyToCloudFormation(properties.condition),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.nextStep),
    "Response": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.response)
  };
}

// @ts-ignore TS6133
function CfnBotConditionalBranchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ConditionalBranchProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ConditionalBranchProperty>();
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? CfnBotConditionPropertyFromCloudFormation(properties.Condition) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("nextStep", "NextStep", (properties.NextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.NextStep) : undefined));
  ret.addPropertyResult("response", "Response", (properties.Response != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.Response) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionalSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionalSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotConditionalSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionalBranches", cdk.requiredValidator)(properties.conditionalBranches));
  errors.collect(cdk.propertyValidator("conditionalBranches", cdk.listValidator(CfnBotConditionalBranchPropertyValidator))(properties.conditionalBranches));
  errors.collect(cdk.propertyValidator("defaultBranch", cdk.requiredValidator)(properties.defaultBranch));
  errors.collect(cdk.propertyValidator("defaultBranch", CfnBotDefaultConditionalBranchPropertyValidator)(properties.defaultBranch));
  errors.collect(cdk.propertyValidator("isActive", cdk.requiredValidator)(properties.isActive));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  return errors.wrap("supplied properties not correct for \"ConditionalSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotConditionalSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "ConditionalBranches": cdk.listMapper(convertCfnBotConditionalBranchPropertyToCloudFormation)(properties.conditionalBranches),
    "DefaultBranch": convertCfnBotDefaultConditionalBranchPropertyToCloudFormation(properties.defaultBranch),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive)
  };
}

// @ts-ignore TS6133
function CfnBotConditionalSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ConditionalSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ConditionalSpecificationProperty>();
  ret.addPropertyResult("conditionalBranches", "ConditionalBranches", (properties.ConditionalBranches != null ? cfn_parse.FromCloudFormation.getArray(CfnBotConditionalBranchPropertyFromCloudFormation)(properties.ConditionalBranches) : undefined));
  ret.addPropertyResult("defaultBranch", "DefaultBranch", (properties.DefaultBranch != null ? CfnBotDefaultConditionalBranchPropertyFromCloudFormation(properties.DefaultBranch) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PostDialogCodeHookInvocationSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PostDialogCodeHookInvocationSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPostDialogCodeHookInvocationSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.failureConditional));
  errors.collect(cdk.propertyValidator("failureNextStep", CfnBotDialogStatePropertyValidator)(properties.failureNextStep));
  errors.collect(cdk.propertyValidator("failureResponse", CfnBotResponseSpecificationPropertyValidator)(properties.failureResponse));
  errors.collect(cdk.propertyValidator("successConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.successConditional));
  errors.collect(cdk.propertyValidator("successNextStep", CfnBotDialogStatePropertyValidator)(properties.successNextStep));
  errors.collect(cdk.propertyValidator("successResponse", CfnBotResponseSpecificationPropertyValidator)(properties.successResponse));
  errors.collect(cdk.propertyValidator("timeoutConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.timeoutConditional));
  errors.collect(cdk.propertyValidator("timeoutNextStep", CfnBotDialogStatePropertyValidator)(properties.timeoutNextStep));
  errors.collect(cdk.propertyValidator("timeoutResponse", CfnBotResponseSpecificationPropertyValidator)(properties.timeoutResponse));
  return errors.wrap("supplied properties not correct for \"PostDialogCodeHookInvocationSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotPostDialogCodeHookInvocationSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPostDialogCodeHookInvocationSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "FailureConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.failureConditional),
    "FailureNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.failureNextStep),
    "FailureResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.failureResponse),
    "SuccessConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.successConditional),
    "SuccessNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.successNextStep),
    "SuccessResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.successResponse),
    "TimeoutConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.timeoutConditional),
    "TimeoutNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.timeoutNextStep),
    "TimeoutResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.timeoutResponse)
  };
}

// @ts-ignore TS6133
function CfnBotPostDialogCodeHookInvocationSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.PostDialogCodeHookInvocationSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PostDialogCodeHookInvocationSpecificationProperty>();
  ret.addPropertyResult("failureConditional", "FailureConditional", (properties.FailureConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.FailureConditional) : undefined));
  ret.addPropertyResult("failureNextStep", "FailureNextStep", (properties.FailureNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.FailureNextStep) : undefined));
  ret.addPropertyResult("failureResponse", "FailureResponse", (properties.FailureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.FailureResponse) : undefined));
  ret.addPropertyResult("successConditional", "SuccessConditional", (properties.SuccessConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.SuccessConditional) : undefined));
  ret.addPropertyResult("successNextStep", "SuccessNextStep", (properties.SuccessNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.SuccessNextStep) : undefined));
  ret.addPropertyResult("successResponse", "SuccessResponse", (properties.SuccessResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.SuccessResponse) : undefined));
  ret.addPropertyResult("timeoutConditional", "TimeoutConditional", (properties.TimeoutConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.TimeoutConditional) : undefined));
  ret.addPropertyResult("timeoutNextStep", "TimeoutNextStep", (properties.TimeoutNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.TimeoutNextStep) : undefined));
  ret.addPropertyResult("timeoutResponse", "TimeoutResponse", (properties.TimeoutResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.TimeoutResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DialogCodeHookInvocationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `DialogCodeHookInvocationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDialogCodeHookInvocationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableCodeHookInvocation", cdk.requiredValidator)(properties.enableCodeHookInvocation));
  errors.collect(cdk.propertyValidator("enableCodeHookInvocation", cdk.validateBoolean)(properties.enableCodeHookInvocation));
  errors.collect(cdk.propertyValidator("invocationLabel", cdk.validateString)(properties.invocationLabel));
  errors.collect(cdk.propertyValidator("isActive", cdk.requiredValidator)(properties.isActive));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("postCodeHookSpecification", cdk.requiredValidator)(properties.postCodeHookSpecification));
  errors.collect(cdk.propertyValidator("postCodeHookSpecification", CfnBotPostDialogCodeHookInvocationSpecificationPropertyValidator)(properties.postCodeHookSpecification));
  return errors.wrap("supplied properties not correct for \"DialogCodeHookInvocationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDialogCodeHookInvocationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDialogCodeHookInvocationSettingPropertyValidator(properties).assertSuccess();
  return {
    "EnableCodeHookInvocation": cdk.booleanToCloudFormation(properties.enableCodeHookInvocation),
    "InvocationLabel": cdk.stringToCloudFormation(properties.invocationLabel),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "PostCodeHookSpecification": convertCfnBotPostDialogCodeHookInvocationSpecificationPropertyToCloudFormation(properties.postCodeHookSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotDialogCodeHookInvocationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DialogCodeHookInvocationSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DialogCodeHookInvocationSettingProperty>();
  ret.addPropertyResult("enableCodeHookInvocation", "EnableCodeHookInvocation", (properties.EnableCodeHookInvocation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableCodeHookInvocation) : undefined));
  ret.addPropertyResult("invocationLabel", "InvocationLabel", (properties.InvocationLabel != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationLabel) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("postCodeHookSpecification", "PostCodeHookSpecification", (properties.PostCodeHookSpecification != null ? CfnBotPostDialogCodeHookInvocationSpecificationPropertyFromCloudFormation(properties.PostCodeHookSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InitialResponseSettingProperty`
 *
 * @param properties - the TypeScript properties of a `InitialResponseSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotInitialResponseSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHook", CfnBotDialogCodeHookInvocationSettingPropertyValidator)(properties.codeHook));
  errors.collect(cdk.propertyValidator("conditional", CfnBotConditionalSpecificationPropertyValidator)(properties.conditional));
  errors.collect(cdk.propertyValidator("initialResponse", CfnBotResponseSpecificationPropertyValidator)(properties.initialResponse));
  errors.collect(cdk.propertyValidator("nextStep", CfnBotDialogStatePropertyValidator)(properties.nextStep));
  return errors.wrap("supplied properties not correct for \"InitialResponseSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotInitialResponseSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotInitialResponseSettingPropertyValidator(properties).assertSuccess();
  return {
    "CodeHook": convertCfnBotDialogCodeHookInvocationSettingPropertyToCloudFormation(properties.codeHook),
    "Conditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.conditional),
    "InitialResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.initialResponse),
    "NextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.nextStep)
  };
}

// @ts-ignore TS6133
function CfnBotInitialResponseSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.InitialResponseSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.InitialResponseSettingProperty>();
  ret.addPropertyResult("codeHook", "CodeHook", (properties.CodeHook != null ? CfnBotDialogCodeHookInvocationSettingPropertyFromCloudFormation(properties.CodeHook) : undefined));
  ret.addPropertyResult("conditional", "Conditional", (properties.Conditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.Conditional) : undefined));
  ret.addPropertyResult("initialResponse", "InitialResponse", (properties.InitialResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.InitialResponse) : undefined));
  ret.addPropertyResult("nextStep", "NextStep", (properties.NextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.NextStep) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PostFulfillmentStatusSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PostFulfillmentStatusSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPostFulfillmentStatusSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.failureConditional));
  errors.collect(cdk.propertyValidator("failureNextStep", CfnBotDialogStatePropertyValidator)(properties.failureNextStep));
  errors.collect(cdk.propertyValidator("failureResponse", CfnBotResponseSpecificationPropertyValidator)(properties.failureResponse));
  errors.collect(cdk.propertyValidator("successConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.successConditional));
  errors.collect(cdk.propertyValidator("successNextStep", CfnBotDialogStatePropertyValidator)(properties.successNextStep));
  errors.collect(cdk.propertyValidator("successResponse", CfnBotResponseSpecificationPropertyValidator)(properties.successResponse));
  errors.collect(cdk.propertyValidator("timeoutConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.timeoutConditional));
  errors.collect(cdk.propertyValidator("timeoutNextStep", CfnBotDialogStatePropertyValidator)(properties.timeoutNextStep));
  errors.collect(cdk.propertyValidator("timeoutResponse", CfnBotResponseSpecificationPropertyValidator)(properties.timeoutResponse));
  return errors.wrap("supplied properties not correct for \"PostFulfillmentStatusSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotPostFulfillmentStatusSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPostFulfillmentStatusSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "FailureConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.failureConditional),
    "FailureNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.failureNextStep),
    "FailureResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.failureResponse),
    "SuccessConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.successConditional),
    "SuccessNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.successNextStep),
    "SuccessResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.successResponse),
    "TimeoutConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.timeoutConditional),
    "TimeoutNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.timeoutNextStep),
    "TimeoutResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.timeoutResponse)
  };
}

// @ts-ignore TS6133
function CfnBotPostFulfillmentStatusSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.PostFulfillmentStatusSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PostFulfillmentStatusSpecificationProperty>();
  ret.addPropertyResult("failureConditional", "FailureConditional", (properties.FailureConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.FailureConditional) : undefined));
  ret.addPropertyResult("failureNextStep", "FailureNextStep", (properties.FailureNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.FailureNextStep) : undefined));
  ret.addPropertyResult("failureResponse", "FailureResponse", (properties.FailureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.FailureResponse) : undefined));
  ret.addPropertyResult("successConditional", "SuccessConditional", (properties.SuccessConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.SuccessConditional) : undefined));
  ret.addPropertyResult("successNextStep", "SuccessNextStep", (properties.SuccessNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.SuccessNextStep) : undefined));
  ret.addPropertyResult("successResponse", "SuccessResponse", (properties.SuccessResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.SuccessResponse) : undefined));
  ret.addPropertyResult("timeoutConditional", "TimeoutConditional", (properties.TimeoutConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.TimeoutConditional) : undefined));
  ret.addPropertyResult("timeoutNextStep", "TimeoutNextStep", (properties.TimeoutNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.TimeoutNextStep) : undefined));
  ret.addPropertyResult("timeoutResponse", "TimeoutResponse", (properties.TimeoutResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.TimeoutResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FulfillmentUpdateResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdateResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotFulfillmentUpdateResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("frequencyInSeconds", cdk.requiredValidator)(properties.frequencyInSeconds));
  errors.collect(cdk.propertyValidator("frequencyInSeconds", cdk.validateNumber)(properties.frequencyInSeconds));
  errors.collect(cdk.propertyValidator("messageGroups", cdk.requiredValidator)(properties.messageGroups));
  errors.collect(cdk.propertyValidator("messageGroups", cdk.listValidator(CfnBotMessageGroupPropertyValidator))(properties.messageGroups));
  return errors.wrap("supplied properties not correct for \"FulfillmentUpdateResponseSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotFulfillmentUpdateResponseSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotFulfillmentUpdateResponseSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "FrequencyInSeconds": cdk.numberToCloudFormation(properties.frequencyInSeconds),
    "MessageGroups": cdk.listMapper(convertCfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroups)
  };
}

// @ts-ignore TS6133
function CfnBotFulfillmentUpdateResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentUpdateResponseSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentUpdateResponseSpecificationProperty>();
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("frequencyInSeconds", "FrequencyInSeconds", (properties.FrequencyInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.FrequencyInSeconds) : undefined));
  ret.addPropertyResult("messageGroups", "MessageGroups", (properties.MessageGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FulfillmentStartResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentStartResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotFulfillmentStartResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("delayInSeconds", cdk.requiredValidator)(properties.delayInSeconds));
  errors.collect(cdk.propertyValidator("delayInSeconds", cdk.validateNumber)(properties.delayInSeconds));
  errors.collect(cdk.propertyValidator("messageGroups", cdk.requiredValidator)(properties.messageGroups));
  errors.collect(cdk.propertyValidator("messageGroups", cdk.listValidator(CfnBotMessageGroupPropertyValidator))(properties.messageGroups));
  return errors.wrap("supplied properties not correct for \"FulfillmentStartResponseSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotFulfillmentStartResponseSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotFulfillmentStartResponseSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "DelayInSeconds": cdk.numberToCloudFormation(properties.delayInSeconds),
    "MessageGroups": cdk.listMapper(convertCfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroups)
  };
}

// @ts-ignore TS6133
function CfnBotFulfillmentStartResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentStartResponseSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentStartResponseSpecificationProperty>();
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("delayInSeconds", "DelayInSeconds", (properties.DelayInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DelayInSeconds) : undefined));
  ret.addPropertyResult("messageGroups", "MessageGroups", (properties.MessageGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FulfillmentUpdatesSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentUpdatesSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotFulfillmentUpdatesSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("active", cdk.requiredValidator)(properties.active));
  errors.collect(cdk.propertyValidator("active", cdk.validateBoolean)(properties.active));
  errors.collect(cdk.propertyValidator("startResponse", CfnBotFulfillmentStartResponseSpecificationPropertyValidator)(properties.startResponse));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  errors.collect(cdk.propertyValidator("updateResponse", CfnBotFulfillmentUpdateResponseSpecificationPropertyValidator)(properties.updateResponse));
  return errors.wrap("supplied properties not correct for \"FulfillmentUpdatesSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotFulfillmentUpdatesSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotFulfillmentUpdatesSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Active": cdk.booleanToCloudFormation(properties.active),
    "StartResponse": convertCfnBotFulfillmentStartResponseSpecificationPropertyToCloudFormation(properties.startResponse),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds),
    "UpdateResponse": convertCfnBotFulfillmentUpdateResponseSpecificationPropertyToCloudFormation(properties.updateResponse)
  };
}

// @ts-ignore TS6133
function CfnBotFulfillmentUpdatesSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentUpdatesSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentUpdatesSpecificationProperty>();
  ret.addPropertyResult("active", "Active", (properties.Active != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Active) : undefined));
  ret.addPropertyResult("startResponse", "StartResponse", (properties.StartResponse != null ? CfnBotFulfillmentStartResponseSpecificationPropertyFromCloudFormation(properties.StartResponse) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addPropertyResult("updateResponse", "UpdateResponse", (properties.UpdateResponse != null ? CfnBotFulfillmentUpdateResponseSpecificationPropertyFromCloudFormation(properties.UpdateResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FulfillmentCodeHookSettingProperty`
 *
 * @param properties - the TypeScript properties of a `FulfillmentCodeHookSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotFulfillmentCodeHookSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("fulfillmentUpdatesSpecification", CfnBotFulfillmentUpdatesSpecificationPropertyValidator)(properties.fulfillmentUpdatesSpecification));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("postFulfillmentStatusSpecification", CfnBotPostFulfillmentStatusSpecificationPropertyValidator)(properties.postFulfillmentStatusSpecification));
  return errors.wrap("supplied properties not correct for \"FulfillmentCodeHookSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotFulfillmentCodeHookSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotFulfillmentCodeHookSettingPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "FulfillmentUpdatesSpecification": convertCfnBotFulfillmentUpdatesSpecificationPropertyToCloudFormation(properties.fulfillmentUpdatesSpecification),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "PostFulfillmentStatusSpecification": convertCfnBotPostFulfillmentStatusSpecificationPropertyToCloudFormation(properties.postFulfillmentStatusSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotFulfillmentCodeHookSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.FulfillmentCodeHookSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.FulfillmentCodeHookSettingProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("fulfillmentUpdatesSpecification", "FulfillmentUpdatesSpecification", (properties.FulfillmentUpdatesSpecification != null ? CfnBotFulfillmentUpdatesSpecificationPropertyFromCloudFormation(properties.FulfillmentUpdatesSpecification) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("postFulfillmentStatusSpecification", "PostFulfillmentStatusSpecification", (properties.PostFulfillmentStatusSpecification != null ? CfnBotPostFulfillmentStatusSpecificationPropertyFromCloudFormation(properties.PostFulfillmentStatusSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextInputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `TextInputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotTextInputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("startTimeoutMs", cdk.requiredValidator)(properties.startTimeoutMs));
  errors.collect(cdk.propertyValidator("startTimeoutMs", cdk.validateNumber)(properties.startTimeoutMs));
  return errors.wrap("supplied properties not correct for \"TextInputSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotTextInputSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotTextInputSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "StartTimeoutMs": cdk.numberToCloudFormation(properties.startTimeoutMs)
  };
}

// @ts-ignore TS6133
function CfnBotTextInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.TextInputSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextInputSpecificationProperty>();
  ret.addPropertyResult("startTimeoutMs", "StartTimeoutMs", (properties.StartTimeoutMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartTimeoutMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AllowedInputTypesProperty`
 *
 * @param properties - the TypeScript properties of a `AllowedInputTypesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAllowedInputTypesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowAudioInput", cdk.requiredValidator)(properties.allowAudioInput));
  errors.collect(cdk.propertyValidator("allowAudioInput", cdk.validateBoolean)(properties.allowAudioInput));
  errors.collect(cdk.propertyValidator("allowDtmfInput", cdk.requiredValidator)(properties.allowDtmfInput));
  errors.collect(cdk.propertyValidator("allowDtmfInput", cdk.validateBoolean)(properties.allowDtmfInput));
  return errors.wrap("supplied properties not correct for \"AllowedInputTypesProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAllowedInputTypesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAllowedInputTypesPropertyValidator(properties).assertSuccess();
  return {
    "AllowAudioInput": cdk.booleanToCloudFormation(properties.allowAudioInput),
    "AllowDTMFInput": cdk.booleanToCloudFormation(properties.allowDtmfInput)
  };
}

// @ts-ignore TS6133
function CfnBotAllowedInputTypesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AllowedInputTypesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AllowedInputTypesProperty>();
  ret.addPropertyResult("allowAudioInput", "AllowAudioInput", (properties.AllowAudioInput != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowAudioInput) : undefined));
  ret.addPropertyResult("allowDtmfInput", "AllowDTMFInput", (properties.AllowDTMFInput != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowDTMFInput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DTMFSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `DTMFSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDTMFSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deletionCharacter", cdk.requiredValidator)(properties.deletionCharacter));
  errors.collect(cdk.propertyValidator("deletionCharacter", cdk.validateString)(properties.deletionCharacter));
  errors.collect(cdk.propertyValidator("endCharacter", cdk.requiredValidator)(properties.endCharacter));
  errors.collect(cdk.propertyValidator("endCharacter", cdk.validateString)(properties.endCharacter));
  errors.collect(cdk.propertyValidator("endTimeoutMs", cdk.requiredValidator)(properties.endTimeoutMs));
  errors.collect(cdk.propertyValidator("endTimeoutMs", cdk.validateNumber)(properties.endTimeoutMs));
  errors.collect(cdk.propertyValidator("maxLength", cdk.requiredValidator)(properties.maxLength));
  errors.collect(cdk.propertyValidator("maxLength", cdk.validateNumber)(properties.maxLength));
  return errors.wrap("supplied properties not correct for \"DTMFSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDTMFSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDTMFSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "DeletionCharacter": cdk.stringToCloudFormation(properties.deletionCharacter),
    "EndCharacter": cdk.stringToCloudFormation(properties.endCharacter),
    "EndTimeoutMs": cdk.numberToCloudFormation(properties.endTimeoutMs),
    "MaxLength": cdk.numberToCloudFormation(properties.maxLength)
  };
}

// @ts-ignore TS6133
function CfnBotDTMFSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DTMFSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DTMFSpecificationProperty>();
  ret.addPropertyResult("deletionCharacter", "DeletionCharacter", (properties.DeletionCharacter != null ? cfn_parse.FromCloudFormation.getString(properties.DeletionCharacter) : undefined));
  ret.addPropertyResult("endCharacter", "EndCharacter", (properties.EndCharacter != null ? cfn_parse.FromCloudFormation.getString(properties.EndCharacter) : undefined));
  ret.addPropertyResult("endTimeoutMs", "EndTimeoutMs", (properties.EndTimeoutMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndTimeoutMs) : undefined));
  ret.addPropertyResult("maxLength", "MaxLength", (properties.MaxLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAudioSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endTimeoutMs", cdk.requiredValidator)(properties.endTimeoutMs));
  errors.collect(cdk.propertyValidator("endTimeoutMs", cdk.validateNumber)(properties.endTimeoutMs));
  errors.collect(cdk.propertyValidator("maxLengthMs", cdk.requiredValidator)(properties.maxLengthMs));
  errors.collect(cdk.propertyValidator("maxLengthMs", cdk.validateNumber)(properties.maxLengthMs));
  return errors.wrap("supplied properties not correct for \"AudioSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAudioSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAudioSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "EndTimeoutMs": cdk.numberToCloudFormation(properties.endTimeoutMs),
    "MaxLengthMs": cdk.numberToCloudFormation(properties.maxLengthMs)
  };
}

// @ts-ignore TS6133
function CfnBotAudioSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioSpecificationProperty>();
  ret.addPropertyResult("endTimeoutMs", "EndTimeoutMs", (properties.EndTimeoutMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.EndTimeoutMs) : undefined));
  ret.addPropertyResult("maxLengthMs", "MaxLengthMs", (properties.MaxLengthMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLengthMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioAndDTMFInputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioAndDTMFInputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAudioAndDTMFInputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audioSpecification", CfnBotAudioSpecificationPropertyValidator)(properties.audioSpecification));
  errors.collect(cdk.propertyValidator("dtmfSpecification", CfnBotDTMFSpecificationPropertyValidator)(properties.dtmfSpecification));
  errors.collect(cdk.propertyValidator("startTimeoutMs", cdk.requiredValidator)(properties.startTimeoutMs));
  errors.collect(cdk.propertyValidator("startTimeoutMs", cdk.validateNumber)(properties.startTimeoutMs));
  return errors.wrap("supplied properties not correct for \"AudioAndDTMFInputSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAudioAndDTMFInputSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAudioAndDTMFInputSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AudioSpecification": convertCfnBotAudioSpecificationPropertyToCloudFormation(properties.audioSpecification),
    "DTMFSpecification": convertCfnBotDTMFSpecificationPropertyToCloudFormation(properties.dtmfSpecification),
    "StartTimeoutMs": cdk.numberToCloudFormation(properties.startTimeoutMs)
  };
}

// @ts-ignore TS6133
function CfnBotAudioAndDTMFInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioAndDTMFInputSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioAndDTMFInputSpecificationProperty>();
  ret.addPropertyResult("audioSpecification", "AudioSpecification", (properties.AudioSpecification != null ? CfnBotAudioSpecificationPropertyFromCloudFormation(properties.AudioSpecification) : undefined));
  ret.addPropertyResult("dtmfSpecification", "DTMFSpecification", (properties.DTMFSpecification != null ? CfnBotDTMFSpecificationPropertyFromCloudFormation(properties.DTMFSpecification) : undefined));
  ret.addPropertyResult("startTimeoutMs", "StartTimeoutMs", (properties.StartTimeoutMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartTimeoutMs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PromptAttemptSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PromptAttemptSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPromptAttemptSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("allowedInputTypes", cdk.requiredValidator)(properties.allowedInputTypes));
  errors.collect(cdk.propertyValidator("allowedInputTypes", CfnBotAllowedInputTypesPropertyValidator)(properties.allowedInputTypes));
  errors.collect(cdk.propertyValidator("audioAndDtmfInputSpecification", CfnBotAudioAndDTMFInputSpecificationPropertyValidator)(properties.audioAndDtmfInputSpecification));
  errors.collect(cdk.propertyValidator("textInputSpecification", CfnBotTextInputSpecificationPropertyValidator)(properties.textInputSpecification));
  return errors.wrap("supplied properties not correct for \"PromptAttemptSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotPromptAttemptSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPromptAttemptSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "AllowedInputTypes": convertCfnBotAllowedInputTypesPropertyToCloudFormation(properties.allowedInputTypes),
    "AudioAndDTMFInputSpecification": convertCfnBotAudioAndDTMFInputSpecificationPropertyToCloudFormation(properties.audioAndDtmfInputSpecification),
    "TextInputSpecification": convertCfnBotTextInputSpecificationPropertyToCloudFormation(properties.textInputSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotPromptAttemptSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.PromptAttemptSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PromptAttemptSpecificationProperty>();
  ret.addPropertyResult("allowedInputTypes", "AllowedInputTypes", (properties.AllowedInputTypes != null ? CfnBotAllowedInputTypesPropertyFromCloudFormation(properties.AllowedInputTypes) : undefined));
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("audioAndDtmfInputSpecification", "AudioAndDTMFInputSpecification", (properties.AudioAndDTMFInputSpecification != null ? CfnBotAudioAndDTMFInputSpecificationPropertyFromCloudFormation(properties.AudioAndDTMFInputSpecification) : undefined));
  ret.addPropertyResult("textInputSpecification", "TextInputSpecification", (properties.TextInputSpecification != null ? CfnBotTextInputSpecificationPropertyFromCloudFormation(properties.TextInputSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PromptSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `PromptSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPromptSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.requiredValidator)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.requiredValidator)(properties.messageGroupsList));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.listValidator(CfnBotMessageGroupPropertyValidator))(properties.messageGroupsList));
  errors.collect(cdk.propertyValidator("messageSelectionStrategy", cdk.validateString)(properties.messageSelectionStrategy));
  errors.collect(cdk.propertyValidator("promptAttemptsSpecification", cdk.hashValidator(CfnBotPromptAttemptSpecificationPropertyValidator))(properties.promptAttemptsSpecification));
  return errors.wrap("supplied properties not correct for \"PromptSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotPromptSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPromptSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "MessageGroupsList": cdk.listMapper(convertCfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList),
    "MessageSelectionStrategy": cdk.stringToCloudFormation(properties.messageSelectionStrategy),
    "PromptAttemptsSpecification": cdk.hashMapper(convertCfnBotPromptAttemptSpecificationPropertyToCloudFormation)(properties.promptAttemptsSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotPromptSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.PromptSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.PromptSpecificationProperty>();
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("messageGroupsList", "MessageGroupsList", (properties.MessageGroupsList != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList) : undefined));
  ret.addPropertyResult("messageSelectionStrategy", "MessageSelectionStrategy", (properties.MessageSelectionStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.MessageSelectionStrategy) : undefined));
  ret.addPropertyResult("promptAttemptsSpecification", "PromptAttemptsSpecification", (properties.PromptAttemptsSpecification != null ? cfn_parse.FromCloudFormation.getMap(CfnBotPromptAttemptSpecificationPropertyFromCloudFormation)(properties.PromptAttemptsSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElicitationCodeHookInvocationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ElicitationCodeHookInvocationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotElicitationCodeHookInvocationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableCodeHookInvocation", cdk.requiredValidator)(properties.enableCodeHookInvocation));
  errors.collect(cdk.propertyValidator("enableCodeHookInvocation", cdk.validateBoolean)(properties.enableCodeHookInvocation));
  errors.collect(cdk.propertyValidator("invocationLabel", cdk.validateString)(properties.invocationLabel));
  return errors.wrap("supplied properties not correct for \"ElicitationCodeHookInvocationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotElicitationCodeHookInvocationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotElicitationCodeHookInvocationSettingPropertyValidator(properties).assertSuccess();
  return {
    "EnableCodeHookInvocation": cdk.booleanToCloudFormation(properties.enableCodeHookInvocation),
    "InvocationLabel": cdk.stringToCloudFormation(properties.invocationLabel)
  };
}

// @ts-ignore TS6133
function CfnBotElicitationCodeHookInvocationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ElicitationCodeHookInvocationSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ElicitationCodeHookInvocationSettingProperty>();
  ret.addPropertyResult("enableCodeHookInvocation", "EnableCodeHookInvocation", (properties.EnableCodeHookInvocation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableCodeHookInvocation) : undefined));
  ret.addPropertyResult("invocationLabel", "InvocationLabel", (properties.InvocationLabel != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationLabel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntentConfirmationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `IntentConfirmationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotIntentConfirmationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHook", CfnBotDialogCodeHookInvocationSettingPropertyValidator)(properties.codeHook));
  errors.collect(cdk.propertyValidator("confirmationConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.confirmationConditional));
  errors.collect(cdk.propertyValidator("confirmationNextStep", CfnBotDialogStatePropertyValidator)(properties.confirmationNextStep));
  errors.collect(cdk.propertyValidator("confirmationResponse", CfnBotResponseSpecificationPropertyValidator)(properties.confirmationResponse));
  errors.collect(cdk.propertyValidator("declinationConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.declinationConditional));
  errors.collect(cdk.propertyValidator("declinationNextStep", CfnBotDialogStatePropertyValidator)(properties.declinationNextStep));
  errors.collect(cdk.propertyValidator("declinationResponse", CfnBotResponseSpecificationPropertyValidator)(properties.declinationResponse));
  errors.collect(cdk.propertyValidator("elicitationCodeHook", CfnBotElicitationCodeHookInvocationSettingPropertyValidator)(properties.elicitationCodeHook));
  errors.collect(cdk.propertyValidator("failureConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.failureConditional));
  errors.collect(cdk.propertyValidator("failureNextStep", CfnBotDialogStatePropertyValidator)(properties.failureNextStep));
  errors.collect(cdk.propertyValidator("failureResponse", CfnBotResponseSpecificationPropertyValidator)(properties.failureResponse));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("promptSpecification", cdk.requiredValidator)(properties.promptSpecification));
  errors.collect(cdk.propertyValidator("promptSpecification", CfnBotPromptSpecificationPropertyValidator)(properties.promptSpecification));
  return errors.wrap("supplied properties not correct for \"IntentConfirmationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotIntentConfirmationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotIntentConfirmationSettingPropertyValidator(properties).assertSuccess();
  return {
    "CodeHook": convertCfnBotDialogCodeHookInvocationSettingPropertyToCloudFormation(properties.codeHook),
    "ConfirmationConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.confirmationConditional),
    "ConfirmationNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.confirmationNextStep),
    "ConfirmationResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.confirmationResponse),
    "DeclinationConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.declinationConditional),
    "DeclinationNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.declinationNextStep),
    "DeclinationResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.declinationResponse),
    "ElicitationCodeHook": convertCfnBotElicitationCodeHookInvocationSettingPropertyToCloudFormation(properties.elicitationCodeHook),
    "FailureConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.failureConditional),
    "FailureNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.failureNextStep),
    "FailureResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.failureResponse),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "PromptSpecification": convertCfnBotPromptSpecificationPropertyToCloudFormation(properties.promptSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotIntentConfirmationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentConfirmationSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentConfirmationSettingProperty>();
  ret.addPropertyResult("codeHook", "CodeHook", (properties.CodeHook != null ? CfnBotDialogCodeHookInvocationSettingPropertyFromCloudFormation(properties.CodeHook) : undefined));
  ret.addPropertyResult("confirmationConditional", "ConfirmationConditional", (properties.ConfirmationConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.ConfirmationConditional) : undefined));
  ret.addPropertyResult("confirmationNextStep", "ConfirmationNextStep", (properties.ConfirmationNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.ConfirmationNextStep) : undefined));
  ret.addPropertyResult("confirmationResponse", "ConfirmationResponse", (properties.ConfirmationResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.ConfirmationResponse) : undefined));
  ret.addPropertyResult("declinationConditional", "DeclinationConditional", (properties.DeclinationConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.DeclinationConditional) : undefined));
  ret.addPropertyResult("declinationNextStep", "DeclinationNextStep", (properties.DeclinationNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.DeclinationNextStep) : undefined));
  ret.addPropertyResult("declinationResponse", "DeclinationResponse", (properties.DeclinationResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.DeclinationResponse) : undefined));
  ret.addPropertyResult("elicitationCodeHook", "ElicitationCodeHook", (properties.ElicitationCodeHook != null ? CfnBotElicitationCodeHookInvocationSettingPropertyFromCloudFormation(properties.ElicitationCodeHook) : undefined));
  ret.addPropertyResult("failureConditional", "FailureConditional", (properties.FailureConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.FailureConditional) : undefined));
  ret.addPropertyResult("failureNextStep", "FailureNextStep", (properties.FailureNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.FailureNextStep) : undefined));
  ret.addPropertyResult("failureResponse", "FailureResponse", (properties.FailureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.FailureResponse) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("promptSpecification", "PromptSpecification", (properties.PromptSpecification != null ? CfnBotPromptSpecificationPropertyFromCloudFormation(properties.PromptSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StillWaitingResponseSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `StillWaitingResponseSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotStillWaitingResponseSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowInterrupt", cdk.validateBoolean)(properties.allowInterrupt));
  errors.collect(cdk.propertyValidator("frequencyInSeconds", cdk.requiredValidator)(properties.frequencyInSeconds));
  errors.collect(cdk.propertyValidator("frequencyInSeconds", cdk.validateNumber)(properties.frequencyInSeconds));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.requiredValidator)(properties.messageGroupsList));
  errors.collect(cdk.propertyValidator("messageGroupsList", cdk.listValidator(CfnBotMessageGroupPropertyValidator))(properties.messageGroupsList));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.requiredValidator)(properties.timeoutInSeconds));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"StillWaitingResponseSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotStillWaitingResponseSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotStillWaitingResponseSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "AllowInterrupt": cdk.booleanToCloudFormation(properties.allowInterrupt),
    "FrequencyInSeconds": cdk.numberToCloudFormation(properties.frequencyInSeconds),
    "MessageGroupsList": cdk.listMapper(convertCfnBotMessageGroupPropertyToCloudFormation)(properties.messageGroupsList),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnBotStillWaitingResponseSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.StillWaitingResponseSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.StillWaitingResponseSpecificationProperty>();
  ret.addPropertyResult("allowInterrupt", "AllowInterrupt", (properties.AllowInterrupt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowInterrupt) : undefined));
  ret.addPropertyResult("frequencyInSeconds", "FrequencyInSeconds", (properties.FrequencyInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.FrequencyInSeconds) : undefined));
  ret.addPropertyResult("messageGroupsList", "MessageGroupsList", (properties.MessageGroupsList != null ? cfn_parse.FromCloudFormation.getArray(CfnBotMessageGroupPropertyFromCloudFormation)(properties.MessageGroupsList) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WaitAndContinueSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `WaitAndContinueSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotWaitAndContinueSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("continueResponse", cdk.requiredValidator)(properties.continueResponse));
  errors.collect(cdk.propertyValidator("continueResponse", CfnBotResponseSpecificationPropertyValidator)(properties.continueResponse));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("stillWaitingResponse", CfnBotStillWaitingResponseSpecificationPropertyValidator)(properties.stillWaitingResponse));
  errors.collect(cdk.propertyValidator("waitingResponse", cdk.requiredValidator)(properties.waitingResponse));
  errors.collect(cdk.propertyValidator("waitingResponse", CfnBotResponseSpecificationPropertyValidator)(properties.waitingResponse));
  return errors.wrap("supplied properties not correct for \"WaitAndContinueSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotWaitAndContinueSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotWaitAndContinueSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "ContinueResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.continueResponse),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "StillWaitingResponse": convertCfnBotStillWaitingResponseSpecificationPropertyToCloudFormation(properties.stillWaitingResponse),
    "WaitingResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.waitingResponse)
  };
}

// @ts-ignore TS6133
function CfnBotWaitAndContinueSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.WaitAndContinueSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.WaitAndContinueSpecificationProperty>();
  ret.addPropertyResult("continueResponse", "ContinueResponse", (properties.ContinueResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.ContinueResponse) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("stillWaitingResponse", "StillWaitingResponse", (properties.StillWaitingResponse != null ? CfnBotStillWaitingResponseSpecificationPropertyFromCloudFormation(properties.StillWaitingResponse) : undefined));
  ret.addPropertyResult("waitingResponse", "WaitingResponse", (properties.WaitingResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.WaitingResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotCaptureSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SlotCaptureSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotCaptureSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("captureConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.captureConditional));
  errors.collect(cdk.propertyValidator("captureNextStep", CfnBotDialogStatePropertyValidator)(properties.captureNextStep));
  errors.collect(cdk.propertyValidator("captureResponse", CfnBotResponseSpecificationPropertyValidator)(properties.captureResponse));
  errors.collect(cdk.propertyValidator("codeHook", CfnBotDialogCodeHookInvocationSettingPropertyValidator)(properties.codeHook));
  errors.collect(cdk.propertyValidator("elicitationCodeHook", CfnBotElicitationCodeHookInvocationSettingPropertyValidator)(properties.elicitationCodeHook));
  errors.collect(cdk.propertyValidator("failureConditional", CfnBotConditionalSpecificationPropertyValidator)(properties.failureConditional));
  errors.collect(cdk.propertyValidator("failureNextStep", CfnBotDialogStatePropertyValidator)(properties.failureNextStep));
  errors.collect(cdk.propertyValidator("failureResponse", CfnBotResponseSpecificationPropertyValidator)(properties.failureResponse));
  return errors.wrap("supplied properties not correct for \"SlotCaptureSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotCaptureSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotCaptureSettingPropertyValidator(properties).assertSuccess();
  return {
    "CaptureConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.captureConditional),
    "CaptureNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.captureNextStep),
    "CaptureResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.captureResponse),
    "CodeHook": convertCfnBotDialogCodeHookInvocationSettingPropertyToCloudFormation(properties.codeHook),
    "ElicitationCodeHook": convertCfnBotElicitationCodeHookInvocationSettingPropertyToCloudFormation(properties.elicitationCodeHook),
    "FailureConditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.failureConditional),
    "FailureNextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.failureNextStep),
    "FailureResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.failureResponse)
  };
}

// @ts-ignore TS6133
function CfnBotSlotCaptureSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotCaptureSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotCaptureSettingProperty>();
  ret.addPropertyResult("captureConditional", "CaptureConditional", (properties.CaptureConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.CaptureConditional) : undefined));
  ret.addPropertyResult("captureNextStep", "CaptureNextStep", (properties.CaptureNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.CaptureNextStep) : undefined));
  ret.addPropertyResult("captureResponse", "CaptureResponse", (properties.CaptureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.CaptureResponse) : undefined));
  ret.addPropertyResult("codeHook", "CodeHook", (properties.CodeHook != null ? CfnBotDialogCodeHookInvocationSettingPropertyFromCloudFormation(properties.CodeHook) : undefined));
  ret.addPropertyResult("elicitationCodeHook", "ElicitationCodeHook", (properties.ElicitationCodeHook != null ? CfnBotElicitationCodeHookInvocationSettingPropertyFromCloudFormation(properties.ElicitationCodeHook) : undefined));
  ret.addPropertyResult("failureConditional", "FailureConditional", (properties.FailureConditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.FailureConditional) : undefined));
  ret.addPropertyResult("failureNextStep", "FailureNextStep", (properties.FailureNextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.FailureNextStep) : undefined));
  ret.addPropertyResult("failureResponse", "FailureResponse", (properties.FailureResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.FailureResponse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SampleUtteranceProperty`
 *
 * @param properties - the TypeScript properties of a `SampleUtteranceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSampleUtterancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("utterance", cdk.requiredValidator)(properties.utterance));
  errors.collect(cdk.propertyValidator("utterance", cdk.validateString)(properties.utterance));
  return errors.wrap("supplied properties not correct for \"SampleUtteranceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSampleUtterancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSampleUtterancePropertyValidator(properties).assertSuccess();
  return {
    "Utterance": cdk.stringToCloudFormation(properties.utterance)
  };
}

// @ts-ignore TS6133
function CfnBotSampleUtterancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SampleUtteranceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SampleUtteranceProperty>();
  ret.addPropertyResult("utterance", "Utterance", (properties.Utterance != null ? cfn_parse.FromCloudFormation.getString(properties.Utterance) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotDefaultValueProperty`
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotDefaultValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.requiredValidator)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  return errors.wrap("supplied properties not correct for \"SlotDefaultValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotDefaultValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotDefaultValuePropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue)
  };
}

// @ts-ignore TS6133
function CfnBotSlotDefaultValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotDefaultValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotDefaultValueProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotDefaultValueSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SlotDefaultValueSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotDefaultValueSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValueList", cdk.requiredValidator)(properties.defaultValueList));
  errors.collect(cdk.propertyValidator("defaultValueList", cdk.listValidator(CfnBotSlotDefaultValuePropertyValidator))(properties.defaultValueList));
  return errors.wrap("supplied properties not correct for \"SlotDefaultValueSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotDefaultValueSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotDefaultValueSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultValueList": cdk.listMapper(convertCfnBotSlotDefaultValuePropertyToCloudFormation)(properties.defaultValueList)
  };
}

// @ts-ignore TS6133
function CfnBotSlotDefaultValueSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotDefaultValueSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotDefaultValueSpecificationProperty>();
  ret.addPropertyResult("defaultValueList", "DefaultValueList", (properties.DefaultValueList != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotDefaultValuePropertyFromCloudFormation)(properties.DefaultValueList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotValueElicitationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SlotValueElicitationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotValueElicitationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValueSpecification", CfnBotSlotDefaultValueSpecificationPropertyValidator)(properties.defaultValueSpecification));
  errors.collect(cdk.propertyValidator("promptSpecification", CfnBotPromptSpecificationPropertyValidator)(properties.promptSpecification));
  errors.collect(cdk.propertyValidator("sampleUtterances", cdk.listValidator(CfnBotSampleUtterancePropertyValidator))(properties.sampleUtterances));
  errors.collect(cdk.propertyValidator("slotCaptureSetting", CfnBotSlotCaptureSettingPropertyValidator)(properties.slotCaptureSetting));
  errors.collect(cdk.propertyValidator("slotConstraint", cdk.requiredValidator)(properties.slotConstraint));
  errors.collect(cdk.propertyValidator("slotConstraint", cdk.validateString)(properties.slotConstraint));
  errors.collect(cdk.propertyValidator("waitAndContinueSpecification", CfnBotWaitAndContinueSpecificationPropertyValidator)(properties.waitAndContinueSpecification));
  return errors.wrap("supplied properties not correct for \"SlotValueElicitationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotValueElicitationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotValueElicitationSettingPropertyValidator(properties).assertSuccess();
  return {
    "DefaultValueSpecification": convertCfnBotSlotDefaultValueSpecificationPropertyToCloudFormation(properties.defaultValueSpecification),
    "PromptSpecification": convertCfnBotPromptSpecificationPropertyToCloudFormation(properties.promptSpecification),
    "SampleUtterances": cdk.listMapper(convertCfnBotSampleUtterancePropertyToCloudFormation)(properties.sampleUtterances),
    "SlotCaptureSetting": convertCfnBotSlotCaptureSettingPropertyToCloudFormation(properties.slotCaptureSetting),
    "SlotConstraint": cdk.stringToCloudFormation(properties.slotConstraint),
    "WaitAndContinueSpecification": convertCfnBotWaitAndContinueSpecificationPropertyToCloudFormation(properties.waitAndContinueSpecification)
  };
}

// @ts-ignore TS6133
function CfnBotSlotValueElicitationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotValueElicitationSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotValueElicitationSettingProperty>();
  ret.addPropertyResult("defaultValueSpecification", "DefaultValueSpecification", (properties.DefaultValueSpecification != null ? CfnBotSlotDefaultValueSpecificationPropertyFromCloudFormation(properties.DefaultValueSpecification) : undefined));
  ret.addPropertyResult("promptSpecification", "PromptSpecification", (properties.PromptSpecification != null ? CfnBotPromptSpecificationPropertyFromCloudFormation(properties.PromptSpecification) : undefined));
  ret.addPropertyResult("sampleUtterances", "SampleUtterances", (properties.SampleUtterances != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleUtterancePropertyFromCloudFormation)(properties.SampleUtterances) : undefined));
  ret.addPropertyResult("slotCaptureSetting", "SlotCaptureSetting", (properties.SlotCaptureSetting != null ? CfnBotSlotCaptureSettingPropertyFromCloudFormation(properties.SlotCaptureSetting) : undefined));
  ret.addPropertyResult("slotConstraint", "SlotConstraint", (properties.SlotConstraint != null ? cfn_parse.FromCloudFormation.getString(properties.SlotConstraint) : undefined));
  ret.addPropertyResult("waitAndContinueSpecification", "WaitAndContinueSpecification", (properties.WaitAndContinueSpecification != null ? CfnBotWaitAndContinueSpecificationPropertyFromCloudFormation(properties.WaitAndContinueSpecification) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ObfuscationSettingProperty`
 *
 * @param properties - the TypeScript properties of a `ObfuscationSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotObfuscationSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("obfuscationSettingType", cdk.requiredValidator)(properties.obfuscationSettingType));
  errors.collect(cdk.propertyValidator("obfuscationSettingType", cdk.validateString)(properties.obfuscationSettingType));
  return errors.wrap("supplied properties not correct for \"ObfuscationSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotObfuscationSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotObfuscationSettingPropertyValidator(properties).assertSuccess();
  return {
    "ObfuscationSettingType": cdk.stringToCloudFormation(properties.obfuscationSettingType)
  };
}

// @ts-ignore TS6133
function CfnBotObfuscationSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.ObfuscationSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ObfuscationSettingProperty>();
  ret.addPropertyResult("obfuscationSettingType", "ObfuscationSettingType", (properties.ObfuscationSettingType != null ? cfn_parse.FromCloudFormation.getString(properties.ObfuscationSettingType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MultipleValuesSettingProperty`
 *
 * @param properties - the TypeScript properties of a `MultipleValuesSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotMultipleValuesSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowMultipleValues", cdk.validateBoolean)(properties.allowMultipleValues));
  return errors.wrap("supplied properties not correct for \"MultipleValuesSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotMultipleValuesSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotMultipleValuesSettingPropertyValidator(properties).assertSuccess();
  return {
    "AllowMultipleValues": cdk.booleanToCloudFormation(properties.allowMultipleValues)
  };
}

// @ts-ignore TS6133
function CfnBotMultipleValuesSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.MultipleValuesSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.MultipleValuesSettingProperty>();
  ret.addPropertyResult("allowMultipleValues", "AllowMultipleValues", (properties.AllowMultipleValues != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowMultipleValues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotProperty`
 *
 * @param properties - the TypeScript properties of a `SlotProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("multipleValuesSetting", CfnBotMultipleValuesSettingPropertyValidator)(properties.multipleValuesSetting));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("obfuscationSetting", CfnBotObfuscationSettingPropertyValidator)(properties.obfuscationSetting));
  errors.collect(cdk.propertyValidator("slotTypeName", cdk.requiredValidator)(properties.slotTypeName));
  errors.collect(cdk.propertyValidator("slotTypeName", cdk.validateString)(properties.slotTypeName));
  errors.collect(cdk.propertyValidator("valueElicitationSetting", cdk.requiredValidator)(properties.valueElicitationSetting));
  errors.collect(cdk.propertyValidator("valueElicitationSetting", CfnBotSlotValueElicitationSettingPropertyValidator)(properties.valueElicitationSetting));
  return errors.wrap("supplied properties not correct for \"SlotProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "MultipleValuesSetting": convertCfnBotMultipleValuesSettingPropertyToCloudFormation(properties.multipleValuesSetting),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObfuscationSetting": convertCfnBotObfuscationSettingPropertyToCloudFormation(properties.obfuscationSetting),
    "SlotTypeName": cdk.stringToCloudFormation(properties.slotTypeName),
    "ValueElicitationSetting": convertCfnBotSlotValueElicitationSettingPropertyToCloudFormation(properties.valueElicitationSetting)
  };
}

// @ts-ignore TS6133
function CfnBotSlotPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("multipleValuesSetting", "MultipleValuesSetting", (properties.MultipleValuesSetting != null ? CfnBotMultipleValuesSettingPropertyFromCloudFormation(properties.MultipleValuesSetting) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("obfuscationSetting", "ObfuscationSetting", (properties.ObfuscationSetting != null ? CfnBotObfuscationSettingPropertyFromCloudFormation(properties.ObfuscationSetting) : undefined));
  ret.addPropertyResult("slotTypeName", "SlotTypeName", (properties.SlotTypeName != null ? cfn_parse.FromCloudFormation.getString(properties.SlotTypeName) : undefined));
  ret.addPropertyResult("valueElicitationSetting", "ValueElicitationSetting", (properties.ValueElicitationSetting != null ? CfnBotSlotValueElicitationSettingPropertyFromCloudFormation(properties.ValueElicitationSetting) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DialogCodeHookSettingProperty`
 *
 * @param properties - the TypeScript properties of a `DialogCodeHookSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDialogCodeHookSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"DialogCodeHookSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDialogCodeHookSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDialogCodeHookSettingPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotDialogCodeHookSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DialogCodeHookSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DialogCodeHookSettingProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputContextProperty`
 *
 * @param properties - the TypeScript properties of a `InputContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotInputContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"InputContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotInputContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotInputContextPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnBotInputContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.InputContextProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.InputContextProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KendraConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `KendraConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotKendraConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kendraIndex", cdk.requiredValidator)(properties.kendraIndex));
  errors.collect(cdk.propertyValidator("kendraIndex", cdk.validateString)(properties.kendraIndex));
  errors.collect(cdk.propertyValidator("queryFilterString", cdk.validateString)(properties.queryFilterString));
  errors.collect(cdk.propertyValidator("queryFilterStringEnabled", cdk.validateBoolean)(properties.queryFilterStringEnabled));
  return errors.wrap("supplied properties not correct for \"KendraConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotKendraConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotKendraConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KendraIndex": cdk.stringToCloudFormation(properties.kendraIndex),
    "QueryFilterString": cdk.stringToCloudFormation(properties.queryFilterString),
    "QueryFilterStringEnabled": cdk.booleanToCloudFormation(properties.queryFilterStringEnabled)
  };
}

// @ts-ignore TS6133
function CfnBotKendraConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.KendraConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.KendraConfigurationProperty>();
  ret.addPropertyResult("kendraIndex", "KendraIndex", (properties.KendraIndex != null ? cfn_parse.FromCloudFormation.getString(properties.KendraIndex) : undefined));
  ret.addPropertyResult("queryFilterString", "QueryFilterString", (properties.QueryFilterString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryFilterString) : undefined));
  ret.addPropertyResult("queryFilterStringEnabled", "QueryFilterStringEnabled", (properties.QueryFilterStringEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.QueryFilterStringEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntentClosingSettingProperty`
 *
 * @param properties - the TypeScript properties of a `IntentClosingSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotIntentClosingSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("closingResponse", CfnBotResponseSpecificationPropertyValidator)(properties.closingResponse));
  errors.collect(cdk.propertyValidator("conditional", CfnBotConditionalSpecificationPropertyValidator)(properties.conditional));
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("nextStep", CfnBotDialogStatePropertyValidator)(properties.nextStep));
  return errors.wrap("supplied properties not correct for \"IntentClosingSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotIntentClosingSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotIntentClosingSettingPropertyValidator(properties).assertSuccess();
  return {
    "ClosingResponse": convertCfnBotResponseSpecificationPropertyToCloudFormation(properties.closingResponse),
    "Conditional": convertCfnBotConditionalSpecificationPropertyToCloudFormation(properties.conditional),
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "NextStep": convertCfnBotDialogStatePropertyToCloudFormation(properties.nextStep)
  };
}

// @ts-ignore TS6133
function CfnBotIntentClosingSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentClosingSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentClosingSettingProperty>();
  ret.addPropertyResult("closingResponse", "ClosingResponse", (properties.ClosingResponse != null ? CfnBotResponseSpecificationPropertyFromCloudFormation(properties.ClosingResponse) : undefined));
  ret.addPropertyResult("conditional", "Conditional", (properties.Conditional != null ? CfnBotConditionalSpecificationPropertyFromCloudFormation(properties.Conditional) : undefined));
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("nextStep", "NextStep", (properties.NextStep != null ? CfnBotDialogStatePropertyFromCloudFormation(properties.NextStep) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputContextProperty`
 *
 * @param properties - the TypeScript properties of a `OutputContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotOutputContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("timeToLiveInSeconds", cdk.requiredValidator)(properties.timeToLiveInSeconds));
  errors.collect(cdk.propertyValidator("timeToLiveInSeconds", cdk.validateNumber)(properties.timeToLiveInSeconds));
  errors.collect(cdk.propertyValidator("turnsToLive", cdk.requiredValidator)(properties.turnsToLive));
  errors.collect(cdk.propertyValidator("turnsToLive", cdk.validateNumber)(properties.turnsToLive));
  return errors.wrap("supplied properties not correct for \"OutputContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotOutputContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotOutputContextPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "TimeToLiveInSeconds": cdk.numberToCloudFormation(properties.timeToLiveInSeconds),
    "TurnsToLive": cdk.numberToCloudFormation(properties.turnsToLive)
  };
}

// @ts-ignore TS6133
function CfnBotOutputContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.OutputContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.OutputContextProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("timeToLiveInSeconds", "TimeToLiveInSeconds", (properties.TimeToLiveInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeToLiveInSeconds) : undefined));
  ret.addPropertyResult("turnsToLive", "TurnsToLive", (properties.TurnsToLive != null ? cfn_parse.FromCloudFormation.getNumber(properties.TurnsToLive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SlotPriorityProperty`
 *
 * @param properties - the TypeScript properties of a `SlotPriorityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSlotPriorityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("slotName", cdk.requiredValidator)(properties.slotName));
  errors.collect(cdk.propertyValidator("slotName", cdk.validateString)(properties.slotName));
  return errors.wrap("supplied properties not correct for \"SlotPriorityProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSlotPriorityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSlotPriorityPropertyValidator(properties).assertSuccess();
  return {
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "SlotName": cdk.stringToCloudFormation(properties.slotName)
  };
}

// @ts-ignore TS6133
function CfnBotSlotPriorityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SlotPriorityProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SlotPriorityProperty>();
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("slotName", "SlotName", (properties.SlotName != null ? cfn_parse.FromCloudFormation.getString(properties.SlotName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntentProperty`
 *
 * @param properties - the TypeScript properties of a `IntentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotIntentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("dialogCodeHook", CfnBotDialogCodeHookSettingPropertyValidator)(properties.dialogCodeHook));
  errors.collect(cdk.propertyValidator("fulfillmentCodeHook", CfnBotFulfillmentCodeHookSettingPropertyValidator)(properties.fulfillmentCodeHook));
  errors.collect(cdk.propertyValidator("initialResponseSetting", CfnBotInitialResponseSettingPropertyValidator)(properties.initialResponseSetting));
  errors.collect(cdk.propertyValidator("inputContexts", cdk.listValidator(CfnBotInputContextPropertyValidator))(properties.inputContexts));
  errors.collect(cdk.propertyValidator("intentClosingSetting", CfnBotIntentClosingSettingPropertyValidator)(properties.intentClosingSetting));
  errors.collect(cdk.propertyValidator("intentConfirmationSetting", CfnBotIntentConfirmationSettingPropertyValidator)(properties.intentConfirmationSetting));
  errors.collect(cdk.propertyValidator("kendraConfiguration", CfnBotKendraConfigurationPropertyValidator)(properties.kendraConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outputContexts", cdk.listValidator(CfnBotOutputContextPropertyValidator))(properties.outputContexts));
  errors.collect(cdk.propertyValidator("parentIntentSignature", cdk.validateString)(properties.parentIntentSignature));
  errors.collect(cdk.propertyValidator("sampleUtterances", cdk.listValidator(CfnBotSampleUtterancePropertyValidator))(properties.sampleUtterances));
  errors.collect(cdk.propertyValidator("slotPriorities", cdk.listValidator(CfnBotSlotPriorityPropertyValidator))(properties.slotPriorities));
  errors.collect(cdk.propertyValidator("slots", cdk.listValidator(CfnBotSlotPropertyValidator))(properties.slots));
  return errors.wrap("supplied properties not correct for \"IntentProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotIntentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotIntentPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DialogCodeHook": convertCfnBotDialogCodeHookSettingPropertyToCloudFormation(properties.dialogCodeHook),
    "FulfillmentCodeHook": convertCfnBotFulfillmentCodeHookSettingPropertyToCloudFormation(properties.fulfillmentCodeHook),
    "InitialResponseSetting": convertCfnBotInitialResponseSettingPropertyToCloudFormation(properties.initialResponseSetting),
    "InputContexts": cdk.listMapper(convertCfnBotInputContextPropertyToCloudFormation)(properties.inputContexts),
    "IntentClosingSetting": convertCfnBotIntentClosingSettingPropertyToCloudFormation(properties.intentClosingSetting),
    "IntentConfirmationSetting": convertCfnBotIntentConfirmationSettingPropertyToCloudFormation(properties.intentConfirmationSetting),
    "KendraConfiguration": convertCfnBotKendraConfigurationPropertyToCloudFormation(properties.kendraConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutputContexts": cdk.listMapper(convertCfnBotOutputContextPropertyToCloudFormation)(properties.outputContexts),
    "ParentIntentSignature": cdk.stringToCloudFormation(properties.parentIntentSignature),
    "SampleUtterances": cdk.listMapper(convertCfnBotSampleUtterancePropertyToCloudFormation)(properties.sampleUtterances),
    "SlotPriorities": cdk.listMapper(convertCfnBotSlotPriorityPropertyToCloudFormation)(properties.slotPriorities),
    "Slots": cdk.listMapper(convertCfnBotSlotPropertyToCloudFormation)(properties.slots)
  };
}

// @ts-ignore TS6133
function CfnBotIntentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.IntentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.IntentProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("dialogCodeHook", "DialogCodeHook", (properties.DialogCodeHook != null ? CfnBotDialogCodeHookSettingPropertyFromCloudFormation(properties.DialogCodeHook) : undefined));
  ret.addPropertyResult("fulfillmentCodeHook", "FulfillmentCodeHook", (properties.FulfillmentCodeHook != null ? CfnBotFulfillmentCodeHookSettingPropertyFromCloudFormation(properties.FulfillmentCodeHook) : undefined));
  ret.addPropertyResult("initialResponseSetting", "InitialResponseSetting", (properties.InitialResponseSetting != null ? CfnBotInitialResponseSettingPropertyFromCloudFormation(properties.InitialResponseSetting) : undefined));
  ret.addPropertyResult("inputContexts", "InputContexts", (properties.InputContexts != null ? cfn_parse.FromCloudFormation.getArray(CfnBotInputContextPropertyFromCloudFormation)(properties.InputContexts) : undefined));
  ret.addPropertyResult("intentClosingSetting", "IntentClosingSetting", (properties.IntentClosingSetting != null ? CfnBotIntentClosingSettingPropertyFromCloudFormation(properties.IntentClosingSetting) : undefined));
  ret.addPropertyResult("intentConfirmationSetting", "IntentConfirmationSetting", (properties.IntentConfirmationSetting != null ? CfnBotIntentConfirmationSettingPropertyFromCloudFormation(properties.IntentConfirmationSetting) : undefined));
  ret.addPropertyResult("kendraConfiguration", "KendraConfiguration", (properties.KendraConfiguration != null ? CfnBotKendraConfigurationPropertyFromCloudFormation(properties.KendraConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outputContexts", "OutputContexts", (properties.OutputContexts != null ? cfn_parse.FromCloudFormation.getArray(CfnBotOutputContextPropertyFromCloudFormation)(properties.OutputContexts) : undefined));
  ret.addPropertyResult("parentIntentSignature", "ParentIntentSignature", (properties.ParentIntentSignature != null ? cfn_parse.FromCloudFormation.getString(properties.ParentIntentSignature) : undefined));
  ret.addPropertyResult("sampleUtterances", "SampleUtterances", (properties.SampleUtterances != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSampleUtterancePropertyFromCloudFormation)(properties.SampleUtterances) : undefined));
  ret.addPropertyResult("slotPriorities", "SlotPriorities", (properties.SlotPriorities != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotPriorityPropertyFromCloudFormation)(properties.SlotPriorities) : undefined));
  ret.addPropertyResult("slots", "Slots", (properties.Slots != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotPropertyFromCloudFormation)(properties.Slots) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VoiceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VoiceSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotVoiceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("voiceId", cdk.requiredValidator)(properties.voiceId));
  errors.collect(cdk.propertyValidator("voiceId", cdk.validateString)(properties.voiceId));
  return errors.wrap("supplied properties not correct for \"VoiceSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotVoiceSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotVoiceSettingsPropertyValidator(properties).assertSuccess();
  return {
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "VoiceId": cdk.stringToCloudFormation(properties.voiceId)
  };
}

// @ts-ignore TS6133
function CfnBotVoiceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.VoiceSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.VoiceSettingsProperty>();
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("voiceId", "VoiceId", (properties.VoiceId != null ? cfn_parse.FromCloudFormation.getString(properties.VoiceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotLocaleProperty`
 *
 * @param properties - the TypeScript properties of a `BotLocaleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotBotLocalePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customVocabulary", CfnBotCustomVocabularyPropertyValidator)(properties.customVocabulary));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("intents", cdk.listValidator(CfnBotIntentPropertyValidator))(properties.intents));
  errors.collect(cdk.propertyValidator("localeId", cdk.requiredValidator)(properties.localeId));
  errors.collect(cdk.propertyValidator("localeId", cdk.validateString)(properties.localeId));
  errors.collect(cdk.propertyValidator("nluConfidenceThreshold", cdk.requiredValidator)(properties.nluConfidenceThreshold));
  errors.collect(cdk.propertyValidator("nluConfidenceThreshold", cdk.validateNumber)(properties.nluConfidenceThreshold));
  errors.collect(cdk.propertyValidator("slotTypes", cdk.listValidator(CfnBotSlotTypePropertyValidator))(properties.slotTypes));
  errors.collect(cdk.propertyValidator("voiceSettings", CfnBotVoiceSettingsPropertyValidator)(properties.voiceSettings));
  return errors.wrap("supplied properties not correct for \"BotLocaleProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotBotLocalePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotBotLocalePropertyValidator(properties).assertSuccess();
  return {
    "CustomVocabulary": convertCfnBotCustomVocabularyPropertyToCloudFormation(properties.customVocabulary),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Intents": cdk.listMapper(convertCfnBotIntentPropertyToCloudFormation)(properties.intents),
    "LocaleId": cdk.stringToCloudFormation(properties.localeId),
    "NluConfidenceThreshold": cdk.numberToCloudFormation(properties.nluConfidenceThreshold),
    "SlotTypes": cdk.listMapper(convertCfnBotSlotTypePropertyToCloudFormation)(properties.slotTypes),
    "VoiceSettings": convertCfnBotVoiceSettingsPropertyToCloudFormation(properties.voiceSettings)
  };
}

// @ts-ignore TS6133
function CfnBotBotLocalePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotLocaleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotLocaleProperty>();
  ret.addPropertyResult("customVocabulary", "CustomVocabulary", (properties.CustomVocabulary != null ? CfnBotCustomVocabularyPropertyFromCloudFormation(properties.CustomVocabulary) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("intents", "Intents", (properties.Intents != null ? cfn_parse.FromCloudFormation.getArray(CfnBotIntentPropertyFromCloudFormation)(properties.Intents) : undefined));
  ret.addPropertyResult("localeId", "LocaleId", (properties.LocaleId != null ? cfn_parse.FromCloudFormation.getString(properties.LocaleId) : undefined));
  ret.addPropertyResult("nluConfidenceThreshold", "NluConfidenceThreshold", (properties.NluConfidenceThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.NluConfidenceThreshold) : undefined));
  ret.addPropertyResult("slotTypes", "SlotTypes", (properties.SlotTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnBotSlotTypePropertyFromCloudFormation)(properties.SlotTypes) : undefined));
  ret.addPropertyResult("voiceSettings", "VoiceSettings", (properties.VoiceSettings != null ? CfnBotVoiceSettingsPropertyFromCloudFormation(properties.VoiceSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3ObjectKey", cdk.requiredValidator)(properties.s3ObjectKey));
  errors.collect(cdk.propertyValidator("s3ObjectKey", cdk.validateString)(properties.s3ObjectKey));
  errors.collect(cdk.propertyValidator("s3ObjectVersion", cdk.validateString)(properties.s3ObjectVersion));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3ObjectKey": cdk.stringToCloudFormation(properties.s3ObjectKey),
    "S3ObjectVersion": cdk.stringToCloudFormation(properties.s3ObjectVersion)
  };
}

// @ts-ignore TS6133
function CfnBotS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.S3LocationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3ObjectKey", "S3ObjectKey", (properties.S3ObjectKey != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectKey) : undefined));
  ret.addPropertyResult("s3ObjectVersion", "S3ObjectVersion", (properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaCodeHookProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotLambdaCodeHookPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHookInterfaceVersion", cdk.requiredValidator)(properties.codeHookInterfaceVersion));
  errors.collect(cdk.propertyValidator("codeHookInterfaceVersion", cdk.validateString)(properties.codeHookInterfaceVersion));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.requiredValidator)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  return errors.wrap("supplied properties not correct for \"LambdaCodeHookProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotLambdaCodeHookPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotLambdaCodeHookPropertyValidator(properties).assertSuccess();
  return {
    "CodeHookInterfaceVersion": cdk.stringToCloudFormation(properties.codeHookInterfaceVersion),
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn)
  };
}

// @ts-ignore TS6133
function CfnBotLambdaCodeHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.LambdaCodeHookProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.LambdaCodeHookProperty>();
  ret.addPropertyResult("codeHookInterfaceVersion", "CodeHookInterfaceVersion", (properties.CodeHookInterfaceVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CodeHookInterfaceVersion) : undefined));
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeHookSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotCodeHookSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaCodeHook", cdk.requiredValidator)(properties.lambdaCodeHook));
  errors.collect(cdk.propertyValidator("lambdaCodeHook", CfnBotLambdaCodeHookPropertyValidator)(properties.lambdaCodeHook));
  return errors.wrap("supplied properties not correct for \"CodeHookSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotCodeHookSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotCodeHookSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "LambdaCodeHook": convertCfnBotLambdaCodeHookPropertyToCloudFormation(properties.lambdaCodeHook)
  };
}

// @ts-ignore TS6133
function CfnBotCodeHookSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CodeHookSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CodeHookSpecificationProperty>();
  ret.addPropertyResult("lambdaCodeHook", "LambdaCodeHook", (properties.LambdaCodeHook != null ? CfnBotLambdaCodeHookPropertyFromCloudFormation(properties.LambdaCodeHook) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHookSpecification", CfnBotCodeHookSpecificationPropertyValidator)(properties.codeHookSpecification));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"BotAliasLocaleSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotBotAliasLocaleSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotBotAliasLocaleSettingsPropertyValidator(properties).assertSuccess();
  return {
    "CodeHookSpecification": convertCfnBotCodeHookSpecificationPropertyToCloudFormation(properties.codeHookSpecification),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotAliasLocaleSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotAliasLocaleSettingsProperty>();
  ret.addPropertyResult("codeHookSpecification", "CodeHookSpecification", (properties.CodeHookSpecification != null ? CfnBotCodeHookSpecificationPropertyFromCloudFormation(properties.CodeHookSpecification) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsItemProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botAliasLocaleSetting", cdk.requiredValidator)(properties.botAliasLocaleSetting));
  errors.collect(cdk.propertyValidator("botAliasLocaleSetting", CfnBotBotAliasLocaleSettingsPropertyValidator)(properties.botAliasLocaleSetting));
  errors.collect(cdk.propertyValidator("localeId", cdk.requiredValidator)(properties.localeId));
  errors.collect(cdk.propertyValidator("localeId", cdk.validateString)(properties.localeId));
  return errors.wrap("supplied properties not correct for \"BotAliasLocaleSettingsItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotBotAliasLocaleSettingsItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotBotAliasLocaleSettingsItemPropertyValidator(properties).assertSuccess();
  return {
    "BotAliasLocaleSetting": convertCfnBotBotAliasLocaleSettingsPropertyToCloudFormation(properties.botAliasLocaleSetting),
    "LocaleId": cdk.stringToCloudFormation(properties.localeId)
  };
}

// @ts-ignore TS6133
function CfnBotBotAliasLocaleSettingsItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.BotAliasLocaleSettingsItemProperty>();
  ret.addPropertyResult("botAliasLocaleSetting", "BotAliasLocaleSetting", (properties.BotAliasLocaleSetting != null ? CfnBotBotAliasLocaleSettingsPropertyFromCloudFormation(properties.BotAliasLocaleSetting) : undefined));
  ret.addPropertyResult("localeId", "LocaleId", (properties.LocaleId != null ? cfn_parse.FromCloudFormation.getString(properties.LocaleId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotCloudWatchLogGroupLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.requiredValidator)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.validateString)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.requiredValidator)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.validateString)(properties.logPrefix));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogGroupLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotCloudWatchLogGroupLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
    "LogPrefix": cdk.stringToCloudFormation(properties.logPrefix)
  };
}

// @ts-ignore TS6133
function CfnBotCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.CloudWatchLogGroupLogDestinationProperty>();
  ret.addPropertyResult("cloudWatchLogGroupArn", "CloudWatchLogGroupArn", (properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined));
  ret.addPropertyResult("logPrefix", "LogPrefix", (properties.LogPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotTextLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatch", cdk.requiredValidator)(properties.cloudWatch));
  errors.collect(cdk.propertyValidator("cloudWatch", CfnBotCloudWatchLogGroupLogDestinationPropertyValidator)(properties.cloudWatch));
  return errors.wrap("supplied properties not correct for \"TextLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotTextLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotTextLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatch": convertCfnBotCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties.cloudWatch)
  };
}

// @ts-ignore TS6133
function CfnBotTextLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.TextLogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextLogDestinationProperty>();
  ret.addPropertyResult("cloudWatch", "CloudWatch", (properties.CloudWatch != null ? CfnBotCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties.CloudWatch) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotTextLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBotTextLogDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TextLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotTextLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotTextLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBotTextLogDestinationPropertyToCloudFormation(properties.destination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotTextLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.TextLogSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TextLogSettingProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBotTextLogDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3BucketLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotS3BucketLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.requiredValidator)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.validateString)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.requiredValidator)(properties.s3BucketArn));
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.validateString)(properties.s3BucketArn));
  return errors.wrap("supplied properties not correct for \"S3BucketLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotS3BucketLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotS3BucketLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "LogPrefix": cdk.stringToCloudFormation(properties.logPrefix),
    "S3BucketArn": cdk.stringToCloudFormation(properties.s3BucketArn)
  };
}

// @ts-ignore TS6133
function CfnBotS3BucketLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.S3BucketLogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.S3BucketLogDestinationProperty>();
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("logPrefix", "LogPrefix", (properties.LogPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogPrefix) : undefined));
  ret.addPropertyResult("s3BucketArn", "S3BucketArn", (properties.S3BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAudioLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", CfnBotS3BucketLogDestinationPropertyValidator)(properties.s3Bucket));
  return errors.wrap("supplied properties not correct for \"AudioLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAudioLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAudioLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": convertCfnBotS3BucketLogDestinationPropertyToCloudFormation(properties.s3Bucket)
  };
}

// @ts-ignore TS6133
function CfnBotAudioLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioLogDestinationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? CfnBotS3BucketLogDestinationPropertyFromCloudFormation(properties.S3Bucket) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAudioLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBotAudioLogDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AudioLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAudioLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAudioLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBotAudioLogDestinationPropertyToCloudFormation(properties.destination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotAudioLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.AudioLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.AudioLogSettingProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBotAudioLogDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConversationLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotConversationLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audioLogSettings", cdk.listValidator(CfnBotAudioLogSettingPropertyValidator))(properties.audioLogSettings));
  errors.collect(cdk.propertyValidator("textLogSettings", cdk.listValidator(CfnBotTextLogSettingPropertyValidator))(properties.textLogSettings));
  return errors.wrap("supplied properties not correct for \"ConversationLogSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotConversationLogSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotConversationLogSettingsPropertyValidator(properties).assertSuccess();
  return {
    "AudioLogSettings": cdk.listMapper(convertCfnBotAudioLogSettingPropertyToCloudFormation)(properties.audioLogSettings),
    "TextLogSettings": cdk.listMapper(convertCfnBotTextLogSettingPropertyToCloudFormation)(properties.textLogSettings)
  };
}

// @ts-ignore TS6133
function CfnBotConversationLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.ConversationLogSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.ConversationLogSettingsProperty>();
  ret.addPropertyResult("audioLogSettings", "AudioLogSettings", (properties.AudioLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAudioLogSettingPropertyFromCloudFormation)(properties.AudioLogSettings) : undefined));
  ret.addPropertyResult("textLogSettings", "TextLogSettings", (properties.TextLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotTextLogSettingPropertyFromCloudFormation)(properties.TextLogSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TestBotAliasSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TestBotAliasSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotTestBotAliasSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botAliasLocaleSettings", cdk.listValidator(CfnBotBotAliasLocaleSettingsItemPropertyValidator))(properties.botAliasLocaleSettings));
  errors.collect(cdk.propertyValidator("conversationLogSettings", CfnBotConversationLogSettingsPropertyValidator)(properties.conversationLogSettings));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("sentimentAnalysisSettings", cdk.validateObject)(properties.sentimentAnalysisSettings));
  return errors.wrap("supplied properties not correct for \"TestBotAliasSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotTestBotAliasSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotTestBotAliasSettingsPropertyValidator(properties).assertSuccess();
  return {
    "BotAliasLocaleSettings": cdk.listMapper(convertCfnBotBotAliasLocaleSettingsItemPropertyToCloudFormation)(properties.botAliasLocaleSettings),
    "ConversationLogSettings": convertCfnBotConversationLogSettingsPropertyToCloudFormation(properties.conversationLogSettings),
    "Description": cdk.stringToCloudFormation(properties.description),
    "SentimentAnalysisSettings": cdk.objectToCloudFormation(properties.sentimentAnalysisSettings)
  };
}

// @ts-ignore TS6133
function CfnBotTestBotAliasSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.TestBotAliasSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.TestBotAliasSettingsProperty>();
  ret.addPropertyResult("botAliasLocaleSettings", "BotAliasLocaleSettings", (properties.BotAliasLocaleSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotBotAliasLocaleSettingsItemPropertyFromCloudFormation)(properties.BotAliasLocaleSettings) : undefined));
  ret.addPropertyResult("conversationLogSettings", "ConversationLogSettings", (properties.ConversationLogSettings != null ? CfnBotConversationLogSettingsPropertyFromCloudFormation(properties.ConversationLogSettings) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("sentimentAnalysisSettings", "SentimentAnalysisSettings", (properties.SentimentAnalysisSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.SentimentAnalysisSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataPrivacyProperty`
 *
 * @param properties - the TypeScript properties of a `DataPrivacyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotDataPrivacyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childDirected", cdk.requiredValidator)(properties.childDirected));
  errors.collect(cdk.propertyValidator("childDirected", cdk.validateBoolean)(properties.childDirected));
  return errors.wrap("supplied properties not correct for \"DataPrivacyProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotDataPrivacyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotDataPrivacyPropertyValidator(properties).assertSuccess();
  return {
    "ChildDirected": cdk.booleanToCloudFormation(properties.childDirected)
  };
}

// @ts-ignore TS6133
function CfnBotDataPrivacyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBot.DataPrivacyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.DataPrivacyProperty>();
  ret.addPropertyResult("childDirected", "ChildDirected", (properties.ChildDirected != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ChildDirected) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBotProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoBuildBotLocales", cdk.validateBoolean)(properties.autoBuildBotLocales));
  errors.collect(cdk.propertyValidator("botFileS3Location", CfnBotS3LocationPropertyValidator)(properties.botFileS3Location));
  errors.collect(cdk.propertyValidator("botLocales", cdk.listValidator(CfnBotBotLocalePropertyValidator))(properties.botLocales));
  errors.collect(cdk.propertyValidator("botTags", cdk.listValidator(cdk.validateCfnTag))(properties.botTags));
  errors.collect(cdk.propertyValidator("dataPrivacy", cdk.requiredValidator)(properties.dataPrivacy));
  errors.collect(cdk.propertyValidator("dataPrivacy", cdk.validateObject)(properties.dataPrivacy));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("idleSessionTtlInSeconds", cdk.requiredValidator)(properties.idleSessionTtlInSeconds));
  errors.collect(cdk.propertyValidator("idleSessionTtlInSeconds", cdk.validateNumber)(properties.idleSessionTtlInSeconds));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("testBotAliasSettings", CfnBotTestBotAliasSettingsPropertyValidator)(properties.testBotAliasSettings));
  errors.collect(cdk.propertyValidator("testBotAliasTags", cdk.listValidator(cdk.validateCfnTag))(properties.testBotAliasTags));
  return errors.wrap("supplied properties not correct for \"CfnBotProps\"");
}

// @ts-ignore TS6133
function convertCfnBotPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotPropsValidator(properties).assertSuccess();
  return {
    "AutoBuildBotLocales": cdk.booleanToCloudFormation(properties.autoBuildBotLocales),
    "BotFileS3Location": convertCfnBotS3LocationPropertyToCloudFormation(properties.botFileS3Location),
    "BotLocales": cdk.listMapper(convertCfnBotBotLocalePropertyToCloudFormation)(properties.botLocales),
    "BotTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.botTags),
    "DataPrivacy": cdk.objectToCloudFormation(properties.dataPrivacy),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IdleSessionTTLInSeconds": cdk.numberToCloudFormation(properties.idleSessionTtlInSeconds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TestBotAliasSettings": convertCfnBotTestBotAliasSettingsPropertyToCloudFormation(properties.testBotAliasSettings),
    "TestBotAliasTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.testBotAliasTags)
  };
}

// @ts-ignore TS6133
function CfnBotPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotProps>();
  ret.addPropertyResult("autoBuildBotLocales", "AutoBuildBotLocales", (properties.AutoBuildBotLocales != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoBuildBotLocales) : undefined));
  ret.addPropertyResult("botFileS3Location", "BotFileS3Location", (properties.BotFileS3Location != null ? CfnBotS3LocationPropertyFromCloudFormation(properties.BotFileS3Location) : undefined));
  ret.addPropertyResult("botLocales", "BotLocales", (properties.BotLocales != null ? cfn_parse.FromCloudFormation.getArray(CfnBotBotLocalePropertyFromCloudFormation)(properties.BotLocales) : undefined));
  ret.addPropertyResult("botTags", "BotTags", (properties.BotTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.BotTags) : undefined));
  ret.addPropertyResult("dataPrivacy", "DataPrivacy", (properties.DataPrivacy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataPrivacy) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("idleSessionTtlInSeconds", "IdleSessionTTLInSeconds", (properties.IdleSessionTTLInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleSessionTTLInSeconds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("testBotAliasSettings", "TestBotAliasSettings", (properties.TestBotAliasSettings != null ? CfnBotTestBotAliasSettingsPropertyFromCloudFormation(properties.TestBotAliasSettings) : undefined));
  ret.addPropertyResult("testBotAliasTags", "TestBotAliasTags", (properties.TestBotAliasTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TestBotAliasTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SentimentAnalysisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotSentimentAnalysisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detectSentiment", cdk.requiredValidator)(properties.detectSentiment));
  errors.collect(cdk.propertyValidator("detectSentiment", cdk.validateBoolean)(properties.detectSentiment));
  return errors.wrap("supplied properties not correct for \"SentimentAnalysisSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotSentimentAnalysisSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotSentimentAnalysisSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DetectSentiment": cdk.booleanToCloudFormation(properties.detectSentiment)
  };
}

// @ts-ignore TS6133
function CfnBotSentimentAnalysisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBot.SentimentAnalysisSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBot.SentimentAnalysisSettingsProperty>();
  ret.addPropertyResult("detectSentiment", "DetectSentiment", (properties.DetectSentiment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetectSentiment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies an alias for the specified version of a bot. Use an alias to enable you to change the version of a bot without updating applications that use the bot.
 *
 * For example, you can specify an alias called "PROD" that your applications use to call the Amazon Lex bot.
 *
 * @cloudformationResource AWS::Lex::BotAlias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html
 */
export class CfnBotAlias extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lex::BotAlias";

  /**
   * Build a CfnBotAlias from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBotAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the bot alias.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier of the bot alias.
   *
   * @cloudformationAttribute BotAliasId
   */
  public readonly attrBotAliasId: string;

  /**
   * The current status of the bot alias. When the status is Available the alias is ready for use with your bot.
   *
   * @cloudformationAttribute BotAliasStatus
   */
  public readonly attrBotAliasStatus: string;

  /**
   * Specifies settings that are unique to a locale.
   */
  public botAliasLocaleSettings?: Array<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the bot alias.
   */
  public botAliasName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public botAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The unique identifier of the bot.
   */
  public botId: string;

  /**
   * The version of the bot that the bot alias references.
   */
  public botVersion?: string;

  /**
   * Specifies whether Amazon Lex logs text and audio for conversations with the bot.
   */
  public conversationLogSettings?: CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable;

  /**
   * The description of the bot alias.
   */
  public description?: string;

  /**
   * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
   */
  public sentimentAnalysisSettings?: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBotAliasProps) {
    super(scope, id, {
      "type": CfnBotAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "botAliasName", this);
    cdk.requireProperty(props, "botId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrBotAliasId = cdk.Token.asString(this.getAtt("BotAliasId", cdk.ResolutionTypeHint.STRING));
    this.attrBotAliasStatus = cdk.Token.asString(this.getAtt("BotAliasStatus", cdk.ResolutionTypeHint.STRING));
    this.botAliasLocaleSettings = props.botAliasLocaleSettings;
    this.botAliasName = props.botAliasName;
    this.botAliasTags = props.botAliasTags;
    this.botId = props.botId;
    this.botVersion = props.botVersion;
    this.conversationLogSettings = props.conversationLogSettings;
    this.description = props.description;
    this.sentimentAnalysisSettings = props.sentimentAnalysisSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "botAliasLocaleSettings": this.botAliasLocaleSettings,
      "botAliasName": this.botAliasName,
      "botAliasTags": this.botAliasTags,
      "botId": this.botId,
      "botVersion": this.botVersion,
      "conversationLogSettings": this.conversationLogSettings,
      "description": this.description,
      "sentimentAnalysisSettings": this.sentimentAnalysisSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBotAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBotAliasPropsToCloudFormation(props);
  }
}

export namespace CfnBotAlias {
  /**
   * Specifies settings that are unique to a locale.
   *
   * For example, you can use different Lambda function depending on the bot's locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html
   */
  export interface BotAliasLocaleSettingsItemProperty {
    /**
     * Specifies settings that are unique to a locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html#cfn-lex-botalias-botaliaslocalesettingsitem-botaliaslocalesetting
     */
    readonly botAliasLocaleSetting: CfnBotAlias.BotAliasLocaleSettingsProperty | cdk.IResolvable;

    /**
     * The unique identifier of the locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettingsitem.html#cfn-lex-botalias-botaliaslocalesettingsitem-localeid
     */
    readonly localeId: string;
  }

  /**
   * Specifies settings that are unique to a locale.
   *
   * For example, you can use different Lambda function depending on the bot's locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html
   */
  export interface BotAliasLocaleSettingsProperty {
    /**
     * Specifies the Lambda function that should be used in the locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html#cfn-lex-botalias-botaliaslocalesettings-codehookspecification
     */
    readonly codeHookSpecification?: CfnBotAlias.CodeHookSpecificationProperty | cdk.IResolvable;

    /**
     * Determines whether the locale is enabled for the bot.
     *
     * If the value is `false` , the locale isn't available for use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-botaliaslocalesettings.html#cfn-lex-botalias-botaliaslocalesettings-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Contains information about code hooks that Amazon Lex calls during a conversation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html
   */
  export interface CodeHookSpecificationProperty {
    /**
     * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-codehookspecification.html#cfn-lex-botalias-codehookspecification-lambdacodehook
     */
    readonly lambdaCodeHook: cdk.IResolvable | CfnBotAlias.LambdaCodeHookProperty;
  }

  /**
   * Specifies a Lambda function that verifies requests to a bot or fulfills the user's request to a bot.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html
   */
  export interface LambdaCodeHookProperty {
    /**
     * The version of the request-response that you want Amazon Lex to use to invoke your Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html#cfn-lex-botalias-lambdacodehook-codehookinterfaceversion
     */
    readonly codeHookInterfaceVersion: string;

    /**
     * The Amazon Resource Name (ARN) of the Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-lambdacodehook.html#cfn-lex-botalias-lambdacodehook-lambdaarn
     */
    readonly lambdaArn: string;
  }

  /**
   * Configures conversation logging that saves audio, text, and metadata for the conversations with your users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html
   */
  export interface ConversationLogSettingsProperty {
    /**
     * The Amazon S3 settings for logging audio to an S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html#cfn-lex-botalias-conversationlogsettings-audiologsettings
     */
    readonly audioLogSettings?: Array<CfnBotAlias.AudioLogSettingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon CloudWatch Logs settings for logging text and metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-conversationlogsettings.html#cfn-lex-botalias-conversationlogsettings-textlogsettings
     */
    readonly textLogSettings?: Array<cdk.IResolvable | CfnBotAlias.TextLogSettingProperty> | cdk.IResolvable;
  }

  /**
   * Defines settings to enable text conversation logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html
   */
  export interface TextLogSettingProperty {
    /**
     * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html#cfn-lex-botalias-textlogsetting-destination
     */
    readonly destination: cdk.IResolvable | CfnBotAlias.TextLogDestinationProperty;

    /**
     * Determines whether conversation logs should be stored for an alias.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogsetting.html#cfn-lex-botalias-textlogsetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Defines the Amazon CloudWatch Logs destination log group for conversation text logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html
   */
  export interface TextLogDestinationProperty {
    /**
     * Defines the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-textlogdestination.html#cfn-lex-botalias-textlogdestination-cloudwatch
     */
    readonly cloudWatch: CfnBotAlias.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable;
  }

  /**
   * The Amazon CloudWatch Logs log group where the text and metadata logs are delivered.
   *
   * The log group must exist before you enable logging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html
   */
  export interface CloudWatchLogGroupLogDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the log group where text and metadata logs are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html#cfn-lex-botalias-cloudwatchloggrouplogdestination-cloudwatchloggrouparn
     */
    readonly cloudWatchLogGroupArn: string;

    /**
     * The prefix of the log stream name within the log group that you specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-cloudwatchloggrouplogdestination.html#cfn-lex-botalias-cloudwatchloggrouplogdestination-logprefix
     */
    readonly logPrefix: string;
  }

  /**
   * Settings for logging audio of conversations between Amazon Lex and a user.
   *
   * You specify whether to log audio and the Amazon S3 bucket where the audio file is stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html
   */
  export interface AudioLogSettingProperty {
    /**
     * The location of audio log files collected when conversation logging is enabled for a bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html#cfn-lex-botalias-audiologsetting-destination
     */
    readonly destination: CfnBotAlias.AudioLogDestinationProperty | cdk.IResolvable;

    /**
     * Determines whether audio logging in enabled for the bot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologsetting.html#cfn-lex-botalias-audiologsetting-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the S3 bucket location where audio logs are stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html
   */
  export interface AudioLogDestinationProperty {
    /**
     * The S3 bucket location where audio logs are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-audiologdestination.html#cfn-lex-botalias-audiologdestination-s3bucket
     */
    readonly s3Bucket: cdk.IResolvable | CfnBotAlias.S3BucketLogDestinationProperty;
  }

  /**
   * Specifies an Amazon S3 bucket for logging audio conversations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html
   */
  export interface S3BucketLogDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of an AWS Key Management Service (KMS) key for encrypting audio log files stored in an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The S3 prefix to assign to audio log files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-logprefix
     */
    readonly logPrefix: string;

    /**
     * The Amazon Resource Name (ARN) of an Amazon S3 bucket where audio log files are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-s3bucketlogdestination.html#cfn-lex-botalias-s3bucketlogdestination-s3bucketarn
     */
    readonly s3BucketArn: string;
  }

  /**
   * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html
   */
  export interface SentimentAnalysisSettingsProperty {
    /**
     * Sets whether Amazon Lex uses Amazon Comprehend to detect the sentiment of user utterances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botalias-sentimentanalysissettings.html#cfn-lex-botalias-sentimentanalysissettings-detectsentiment
     */
    readonly detectSentiment: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnBotAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html
 */
export interface CfnBotAliasProps {
  /**
   * Specifies settings that are unique to a locale.
   *
   * For example, you can use different Lambda function depending on the bot's locale.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliaslocalesettings
   */
  readonly botAliasLocaleSettings?: Array<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the bot alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliasname
   */
  readonly botAliasName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * You can only add tags when you specify an alias.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botaliastags
   */
  readonly botAliasTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The unique identifier of the bot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botid
   */
  readonly botId: string;

  /**
   * The version of the bot that the bot alias references.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-botversion
   */
  readonly botVersion?: string;

  /**
   * Specifies whether Amazon Lex logs text and audio for conversations with the bot.
   *
   * When you enable conversation logs, text logs store text input, transcripts of audio input, and associated metadata in Amazon CloudWatch logs. Audio logs store input in Amazon S3 .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-conversationlogsettings
   */
  readonly conversationLogSettings?: CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable;

  /**
   * The description of the bot alias.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-description
   */
  readonly description?: string;

  /**
   * Determines whether Amazon Lex will use Amazon Comprehend to detect the sentiment of user utterances.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botalias.html#cfn-lex-botalias-sentimentanalysissettings
   */
  readonly sentimentAnalysisSettings?: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `LambdaCodeHookProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaCodeHookProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasLambdaCodeHookPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHookInterfaceVersion", cdk.requiredValidator)(properties.codeHookInterfaceVersion));
  errors.collect(cdk.propertyValidator("codeHookInterfaceVersion", cdk.validateString)(properties.codeHookInterfaceVersion));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.requiredValidator)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  return errors.wrap("supplied properties not correct for \"LambdaCodeHookProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasLambdaCodeHookPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasLambdaCodeHookPropertyValidator(properties).assertSuccess();
  return {
    "CodeHookInterfaceVersion": cdk.stringToCloudFormation(properties.codeHookInterfaceVersion),
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn)
  };
}

// @ts-ignore TS6133
function CfnBotAliasLambdaCodeHookPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBotAlias.LambdaCodeHookProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.LambdaCodeHookProperty>();
  ret.addPropertyResult("codeHookInterfaceVersion", "CodeHookInterfaceVersion", (properties.CodeHookInterfaceVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CodeHookInterfaceVersion) : undefined));
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeHookSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CodeHookSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasCodeHookSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaCodeHook", cdk.requiredValidator)(properties.lambdaCodeHook));
  errors.collect(cdk.propertyValidator("lambdaCodeHook", CfnBotAliasLambdaCodeHookPropertyValidator)(properties.lambdaCodeHook));
  return errors.wrap("supplied properties not correct for \"CodeHookSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasCodeHookSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasCodeHookSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "LambdaCodeHook": convertCfnBotAliasLambdaCodeHookPropertyToCloudFormation(properties.lambdaCodeHook)
  };
}

// @ts-ignore TS6133
function CfnBotAliasCodeHookSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.CodeHookSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.CodeHookSpecificationProperty>();
  ret.addPropertyResult("lambdaCodeHook", "LambdaCodeHook", (properties.LambdaCodeHook != null ? CfnBotAliasLambdaCodeHookPropertyFromCloudFormation(properties.LambdaCodeHook) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeHookSpecification", CfnBotAliasCodeHookSpecificationPropertyValidator)(properties.codeHookSpecification));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"BotAliasLocaleSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasBotAliasLocaleSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasBotAliasLocaleSettingsPropertyValidator(properties).assertSuccess();
  return {
    "CodeHookSpecification": convertCfnBotAliasCodeHookSpecificationPropertyToCloudFormation(properties.codeHookSpecification),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.BotAliasLocaleSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.BotAliasLocaleSettingsProperty>();
  ret.addPropertyResult("codeHookSpecification", "CodeHookSpecification", (properties.CodeHookSpecification != null ? CfnBotAliasCodeHookSpecificationPropertyFromCloudFormation(properties.CodeHookSpecification) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotAliasLocaleSettingsItemProperty`
 *
 * @param properties - the TypeScript properties of a `BotAliasLocaleSettingsItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botAliasLocaleSetting", cdk.requiredValidator)(properties.botAliasLocaleSetting));
  errors.collect(cdk.propertyValidator("botAliasLocaleSetting", CfnBotAliasBotAliasLocaleSettingsPropertyValidator)(properties.botAliasLocaleSetting));
  errors.collect(cdk.propertyValidator("localeId", cdk.requiredValidator)(properties.localeId));
  errors.collect(cdk.propertyValidator("localeId", cdk.validateString)(properties.localeId));
  return errors.wrap("supplied properties not correct for \"BotAliasLocaleSettingsItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasBotAliasLocaleSettingsItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasBotAliasLocaleSettingsItemPropertyValidator(properties).assertSuccess();
  return {
    "BotAliasLocaleSetting": convertCfnBotAliasBotAliasLocaleSettingsPropertyToCloudFormation(properties.botAliasLocaleSetting),
    "LocaleId": cdk.stringToCloudFormation(properties.localeId)
  };
}

// @ts-ignore TS6133
function CfnBotAliasBotAliasLocaleSettingsItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.BotAliasLocaleSettingsItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.BotAliasLocaleSettingsItemProperty>();
  ret.addPropertyResult("botAliasLocaleSetting", "BotAliasLocaleSetting", (properties.BotAliasLocaleSetting != null ? CfnBotAliasBotAliasLocaleSettingsPropertyFromCloudFormation(properties.BotAliasLocaleSetting) : undefined));
  ret.addPropertyResult("localeId", "LocaleId", (properties.LocaleId != null ? cfn_parse.FromCloudFormation.getString(properties.LocaleId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogGroupLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasCloudWatchLogGroupLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.requiredValidator)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.validateString)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.requiredValidator)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.validateString)(properties.logPrefix));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogGroupLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasCloudWatchLogGroupLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
    "LogPrefix": cdk.stringToCloudFormation(properties.logPrefix)
  };
}

// @ts-ignore TS6133
function CfnBotAliasCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.CloudWatchLogGroupLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.CloudWatchLogGroupLogDestinationProperty>();
  ret.addPropertyResult("cloudWatchLogGroupArn", "CloudWatchLogGroupArn", (properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined));
  ret.addPropertyResult("logPrefix", "LogPrefix", (properties.LogPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasTextLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatch", cdk.requiredValidator)(properties.cloudWatch));
  errors.collect(cdk.propertyValidator("cloudWatch", CfnBotAliasCloudWatchLogGroupLogDestinationPropertyValidator)(properties.cloudWatch));
  return errors.wrap("supplied properties not correct for \"TextLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasTextLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasTextLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatch": convertCfnBotAliasCloudWatchLogGroupLogDestinationPropertyToCloudFormation(properties.cloudWatch)
  };
}

// @ts-ignore TS6133
function CfnBotAliasTextLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBotAlias.TextLogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.TextLogDestinationProperty>();
  ret.addPropertyResult("cloudWatch", "CloudWatch", (properties.CloudWatch != null ? CfnBotAliasCloudWatchLogGroupLogDestinationPropertyFromCloudFormation(properties.CloudWatch) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TextLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `TextLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasTextLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBotAliasTextLogDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TextLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasTextLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasTextLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBotAliasTextLogDestinationPropertyToCloudFormation(properties.destination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotAliasTextLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBotAlias.TextLogSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.TextLogSettingProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBotAliasTextLogDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3BucketLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `S3BucketLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasS3BucketLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.requiredValidator)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("logPrefix", cdk.validateString)(properties.logPrefix));
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.requiredValidator)(properties.s3BucketArn));
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.validateString)(properties.s3BucketArn));
  return errors.wrap("supplied properties not correct for \"S3BucketLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasS3BucketLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasS3BucketLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "LogPrefix": cdk.stringToCloudFormation(properties.logPrefix),
    "S3BucketArn": cdk.stringToCloudFormation(properties.s3BucketArn)
  };
}

// @ts-ignore TS6133
function CfnBotAliasS3BucketLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBotAlias.S3BucketLogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.S3BucketLogDestinationProperty>();
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("logPrefix", "LogPrefix", (properties.LogPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogPrefix) : undefined));
  ret.addPropertyResult("s3BucketArn", "S3BucketArn", (properties.S3BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasAudioLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", CfnBotAliasS3BucketLogDestinationPropertyValidator)(properties.s3Bucket));
  return errors.wrap("supplied properties not correct for \"AudioLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasAudioLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasAudioLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "S3Bucket": convertCfnBotAliasS3BucketLogDestinationPropertyToCloudFormation(properties.s3Bucket)
  };
}

// @ts-ignore TS6133
function CfnBotAliasAudioLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.AudioLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.AudioLogDestinationProperty>();
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? CfnBotAliasS3BucketLogDestinationPropertyFromCloudFormation(properties.S3Bucket) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AudioLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasAudioLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnBotAliasAudioLogDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AudioLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasAudioLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasAudioLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnBotAliasAudioLogDestinationPropertyToCloudFormation(properties.destination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnBotAliasAudioLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.AudioLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.AudioLogSettingProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnBotAliasAudioLogDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConversationLogSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConversationLogSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasConversationLogSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("audioLogSettings", cdk.listValidator(CfnBotAliasAudioLogSettingPropertyValidator))(properties.audioLogSettings));
  errors.collect(cdk.propertyValidator("textLogSettings", cdk.listValidator(CfnBotAliasTextLogSettingPropertyValidator))(properties.textLogSettings));
  return errors.wrap("supplied properties not correct for \"ConversationLogSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasConversationLogSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasConversationLogSettingsPropertyValidator(properties).assertSuccess();
  return {
    "AudioLogSettings": cdk.listMapper(convertCfnBotAliasAudioLogSettingPropertyToCloudFormation)(properties.audioLogSettings),
    "TextLogSettings": cdk.listMapper(convertCfnBotAliasTextLogSettingPropertyToCloudFormation)(properties.textLogSettings)
  };
}

// @ts-ignore TS6133
function CfnBotAliasConversationLogSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAlias.ConversationLogSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.ConversationLogSettingsProperty>();
  ret.addPropertyResult("audioLogSettings", "AudioLogSettings", (properties.AudioLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasAudioLogSettingPropertyFromCloudFormation)(properties.AudioLogSettings) : undefined));
  ret.addPropertyResult("textLogSettings", "TextLogSettings", (properties.TextLogSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasTextLogSettingPropertyFromCloudFormation)(properties.TextLogSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SentimentAnalysisSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SentimentAnalysisSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasSentimentAnalysisSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("detectSentiment", cdk.requiredValidator)(properties.detectSentiment));
  errors.collect(cdk.propertyValidator("detectSentiment", cdk.validateBoolean)(properties.detectSentiment));
  return errors.wrap("supplied properties not correct for \"SentimentAnalysisSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasSentimentAnalysisSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasSentimentAnalysisSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DetectSentiment": cdk.booleanToCloudFormation(properties.detectSentiment)
  };
}

// @ts-ignore TS6133
function CfnBotAliasSentimentAnalysisSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnBotAlias.SentimentAnalysisSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAlias.SentimentAnalysisSettingsProperty>();
  ret.addPropertyResult("detectSentiment", "DetectSentiment", (properties.DetectSentiment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetectSentiment) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBotAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botAliasLocaleSettings", cdk.listValidator(CfnBotAliasBotAliasLocaleSettingsItemPropertyValidator))(properties.botAliasLocaleSettings));
  errors.collect(cdk.propertyValidator("botAliasName", cdk.requiredValidator)(properties.botAliasName));
  errors.collect(cdk.propertyValidator("botAliasName", cdk.validateString)(properties.botAliasName));
  errors.collect(cdk.propertyValidator("botAliasTags", cdk.listValidator(cdk.validateCfnTag))(properties.botAliasTags));
  errors.collect(cdk.propertyValidator("botId", cdk.requiredValidator)(properties.botId));
  errors.collect(cdk.propertyValidator("botId", cdk.validateString)(properties.botId));
  errors.collect(cdk.propertyValidator("botVersion", cdk.validateString)(properties.botVersion));
  errors.collect(cdk.propertyValidator("conversationLogSettings", CfnBotAliasConversationLogSettingsPropertyValidator)(properties.conversationLogSettings));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("sentimentAnalysisSettings", cdk.validateObject)(properties.sentimentAnalysisSettings));
  return errors.wrap("supplied properties not correct for \"CfnBotAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnBotAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotAliasPropsValidator(properties).assertSuccess();
  return {
    "BotAliasLocaleSettings": cdk.listMapper(convertCfnBotAliasBotAliasLocaleSettingsItemPropertyToCloudFormation)(properties.botAliasLocaleSettings),
    "BotAliasName": cdk.stringToCloudFormation(properties.botAliasName),
    "BotAliasTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.botAliasTags),
    "BotId": cdk.stringToCloudFormation(properties.botId),
    "BotVersion": cdk.stringToCloudFormation(properties.botVersion),
    "ConversationLogSettings": convertCfnBotAliasConversationLogSettingsPropertyToCloudFormation(properties.conversationLogSettings),
    "Description": cdk.stringToCloudFormation(properties.description),
    "SentimentAnalysisSettings": cdk.objectToCloudFormation(properties.sentimentAnalysisSettings)
  };
}

// @ts-ignore TS6133
function CfnBotAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotAliasProps>();
  ret.addPropertyResult("botAliasLocaleSettings", "BotAliasLocaleSettings", (properties.BotAliasLocaleSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnBotAliasBotAliasLocaleSettingsItemPropertyFromCloudFormation)(properties.BotAliasLocaleSettings) : undefined));
  ret.addPropertyResult("botAliasName", "BotAliasName", (properties.BotAliasName != null ? cfn_parse.FromCloudFormation.getString(properties.BotAliasName) : undefined));
  ret.addPropertyResult("botAliasTags", "BotAliasTags", (properties.BotAliasTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.BotAliasTags) : undefined));
  ret.addPropertyResult("botId", "BotId", (properties.BotId != null ? cfn_parse.FromCloudFormation.getString(properties.BotId) : undefined));
  ret.addPropertyResult("botVersion", "BotVersion", (properties.BotVersion != null ? cfn_parse.FromCloudFormation.getString(properties.BotVersion) : undefined));
  ret.addPropertyResult("conversationLogSettings", "ConversationLogSettings", (properties.ConversationLogSettings != null ? CfnBotAliasConversationLogSettingsPropertyFromCloudFormation(properties.ConversationLogSettings) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("sentimentAnalysisSettings", "SentimentAnalysisSettings", (properties.SentimentAnalysisSettings != null ? cfn_parse.FromCloudFormation.getAny(properties.SentimentAnalysisSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies a new version of the bot based on the `DRAFT` version. If the `DRAFT` version of this resource hasn't changed since you created the last version, Amazon Lex doesn't create a new version, it returns the last created version.
 *
 * When you specify the first version of a bot, Amazon Lex sets the version to 1. Subsequent versions increment by 1.
 *
 * @cloudformationResource AWS::Lex::BotVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html
 */
export class CfnBotVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lex::BotVersion";

  /**
   * Build a CfnBotVersion from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBotVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The version of the bot.
   *
   * @cloudformationAttribute BotVersion
   */
  public readonly attrBotVersion: string;

  /**
   * The unique identifier of the bot.
   */
  public botId: string;

  /**
   * Specifies the locales that Amazon Lex adds to this version.
   */
  public botVersionLocaleSpecification: Array<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the version.
   */
  public description?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBotVersionProps) {
    super(scope, id, {
      "type": CfnBotVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "botId", this);
    cdk.requireProperty(props, "botVersionLocaleSpecification", this);

    this.attrBotVersion = cdk.Token.asString(this.getAtt("BotVersion", cdk.ResolutionTypeHint.STRING));
    this.botId = props.botId;
    this.botVersionLocaleSpecification = props.botVersionLocaleSpecification;
    this.description = props.description;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "botId": this.botId,
      "botVersionLocaleSpecification": this.botVersionLocaleSpecification,
      "description": this.description
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBotVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBotVersionPropsToCloudFormation(props);
  }
}

export namespace CfnBotVersion {
  /**
   * Specifies the locale that Amazon Lex adds to this version.
   *
   * You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html
   */
  export interface BotVersionLocaleSpecificationProperty {
    /**
     * The version of a bot used for a bot locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html#cfn-lex-botversion-botversionlocalespecification-botversionlocaledetails
     */
    readonly botVersionLocaleDetails: CfnBotVersion.BotVersionLocaleDetailsProperty | cdk.IResolvable;

    /**
     * The identifier of the locale to add to the version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocalespecification.html#cfn-lex-botversion-botversionlocalespecification-localeid
     */
    readonly localeId: string;
  }

  /**
   * The version of a bot used for a bot locale.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html
   */
  export interface BotVersionLocaleDetailsProperty {
    /**
     * The version of a bot used for a bot locale.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lex-botversion-botversionlocaledetails.html#cfn-lex-botversion-botversionlocaledetails-sourcebotversion
     */
    readonly sourceBotVersion: string;
  }
}

/**
 * Properties for defining a `CfnBotVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html
 */
export interface CfnBotVersionProps {
  /**
   * The unique identifier of the bot.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botid
   */
  readonly botId: string;

  /**
   * Specifies the locales that Amazon Lex adds to this version.
   *
   * You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-botversionlocalespecification
   */
  readonly botVersionLocaleSpecification: Array<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-botversion.html#cfn-lex-botversion-description
   */
  readonly description?: string;
}

/**
 * Determine whether the given properties match those of a `BotVersionLocaleDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourceBotVersion", cdk.requiredValidator)(properties.sourceBotVersion));
  errors.collect(cdk.propertyValidator("sourceBotVersion", cdk.validateString)(properties.sourceBotVersion));
  return errors.wrap("supplied properties not correct for \"BotVersionLocaleDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotVersionBotVersionLocaleDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotVersionBotVersionLocaleDetailsPropertyValidator(properties).assertSuccess();
  return {
    "SourceBotVersion": cdk.stringToCloudFormation(properties.sourceBotVersion)
  };
}

// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersion.BotVersionLocaleDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersion.BotVersionLocaleDetailsProperty>();
  ret.addPropertyResult("sourceBotVersion", "SourceBotVersion", (properties.SourceBotVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SourceBotVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BotVersionLocaleSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `BotVersionLocaleSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botVersionLocaleDetails", cdk.requiredValidator)(properties.botVersionLocaleDetails));
  errors.collect(cdk.propertyValidator("botVersionLocaleDetails", CfnBotVersionBotVersionLocaleDetailsPropertyValidator)(properties.botVersionLocaleDetails));
  errors.collect(cdk.propertyValidator("localeId", cdk.requiredValidator)(properties.localeId));
  errors.collect(cdk.propertyValidator("localeId", cdk.validateString)(properties.localeId));
  return errors.wrap("supplied properties not correct for \"BotVersionLocaleSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnBotVersionBotVersionLocaleSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotVersionBotVersionLocaleSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "BotVersionLocaleDetails": convertCfnBotVersionBotVersionLocaleDetailsPropertyToCloudFormation(properties.botVersionLocaleDetails),
    "LocaleId": cdk.stringToCloudFormation(properties.localeId)
  };
}

// @ts-ignore TS6133
function CfnBotVersionBotVersionLocaleSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersion.BotVersionLocaleSpecificationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersion.BotVersionLocaleSpecificationProperty>();
  ret.addPropertyResult("botVersionLocaleDetails", "BotVersionLocaleDetails", (properties.BotVersionLocaleDetails != null ? CfnBotVersionBotVersionLocaleDetailsPropertyFromCloudFormation(properties.BotVersionLocaleDetails) : undefined));
  ret.addPropertyResult("localeId", "LocaleId", (properties.LocaleId != null ? cfn_parse.FromCloudFormation.getString(properties.LocaleId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBotVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnBotVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBotVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("botId", cdk.requiredValidator)(properties.botId));
  errors.collect(cdk.propertyValidator("botId", cdk.validateString)(properties.botId));
  errors.collect(cdk.propertyValidator("botVersionLocaleSpecification", cdk.requiredValidator)(properties.botVersionLocaleSpecification));
  errors.collect(cdk.propertyValidator("botVersionLocaleSpecification", cdk.listValidator(CfnBotVersionBotVersionLocaleSpecificationPropertyValidator))(properties.botVersionLocaleSpecification));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  return errors.wrap("supplied properties not correct for \"CfnBotVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnBotVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBotVersionPropsValidator(properties).assertSuccess();
  return {
    "BotId": cdk.stringToCloudFormation(properties.botId),
    "BotVersionLocaleSpecification": cdk.listMapper(convertCfnBotVersionBotVersionLocaleSpecificationPropertyToCloudFormation)(properties.botVersionLocaleSpecification),
    "Description": cdk.stringToCloudFormation(properties.description)
  };
}

// @ts-ignore TS6133
function CfnBotVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBotVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBotVersionProps>();
  ret.addPropertyResult("botId", "BotId", (properties.BotId != null ? cfn_parse.FromCloudFormation.getString(properties.BotId) : undefined));
  ret.addPropertyResult("botVersionLocaleSpecification", "BotVersionLocaleSpecification", (properties.BotVersionLocaleSpecification != null ? cfn_parse.FromCloudFormation.getArray(CfnBotVersionBotVersionLocaleSpecificationPropertyFromCloudFormation)(properties.BotVersionLocaleSpecification) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * > Amazon Lex V2 is the only supported version in AWS CloudFormation .
 *
 * Specifies a new resource policy with the specified policy statements.
 *
 * @cloudformationResource AWS::Lex::ResourcePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html
 */
export class CfnResourcePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lex::ResourcePolicy";

  /**
   * Build a CfnResourcePolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourcePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The identifier of the resource policy.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies the current revision of a resource policy.
   *
   * @cloudformationAttribute RevisionId
   */
  public readonly attrRevisionId: string;

  /**
   * A resource policy to add to the resource.
   */
  public policy: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
   */
  public resourceArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourcePolicyProps) {
    super(scope, id, {
      "type": CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "resourceArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrRevisionId = cdk.Token.asString(this.getAtt("RevisionId", cdk.ResolutionTypeHint.STRING));
    this.policy = props.policy;
    this.resourceArn = props.resourceArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policy": this.policy,
      "resourceArn": this.resourceArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourcePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourcePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourcePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html
 */
export interface CfnResourcePolicyProps {
  /**
   * A resource policy to add to the resource.
   *
   * The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow IAM syntax. If the policy isn't valid, Amazon Lex returns a validation exception.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-policy
   */
  readonly policy: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lex-resourcepolicy.html#cfn-lex-resourcepolicy-resourcearn
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
// @ts-ignore TS6133
function CfnResourcePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"CfnResourcePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnResourcePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourcePolicyPropsValidator(properties).assertSuccess();
  return {
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnResourcePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourcePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourcePolicyProps>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}