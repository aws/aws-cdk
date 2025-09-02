import * as fs from 'fs';
import { Arn, ArnFormat, IResolvable, IResource, Lazy, Resource, Token, ValidationError } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Metric, MetricOptions, MetricProps } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IKey, Key } from 'aws-cdk-lib/aws-kms';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
// Internal Libs
import * as filters from './guardrail-filters';
import { GuardrailVersion } from './guardrail-version';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * GuardrailCrossRegionConfigProperty
 */
export interface GuardrailCrossRegionConfigProperty {
  /**
   * The arn of thesystem-defined guardrail profile that you're using with your guardrail.
   * Guardrail profiles define the destination AWS Regions where guardrail inference requests can be automatically routed.
   * Using guardrail profiles helps maintain guardrail performance and reliability when demand increases.
   * @default - No cross-region configuration
   */
  readonly guardrailProfileArn: string;
}

/**
 * Represents a Guardrail, either created with CDK or imported.
 */
export interface IGuardrail extends IResource {
  /**
   * The ARN of the guardrail.
   * @attribute
   */
  readonly guardrailArn: string;
  /**
   * The ID of the guardrail.
   * @attribute
   */
  readonly guardrailId: string;
  /**
   * Optional KMS encryption key associated with this guardrail
   */
  readonly kmsKey?: IKey;
  /**
   * When this guardrail was last updated.
   */
  readonly lastUpdated?: string;
  /**
   * The version of the guardrail. If no explicit version is created,
   * this will default to "DRAFT"
   * @attribute
   */
  readonly guardrailVersion: string;

  /**
   * Grant the given principal identity permissions to perform actions on this guardrail.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
  /**
   * Grant the given identity permissions to apply the guardrail.
   */
  grantApply(grantee: iam.IGrantable): iam.Grant;

  /**
   * Return the given named metric for this guardrail.
   */
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Return the invocations metric for this guardrail.
   */
  metricInvocations(props?: MetricOptions): Metric;

  /**
   * Return the invocation latency metric for this guardrail.
   */
  metricInvocationLatency(props?: MetricOptions): Metric;

  /**
   * Return the invocation client errors metric for this guardrail.
   */
  metricInvocationClientErrors(props?: MetricOptions): Metric;

  /**
   * Return the invocation server errors metric for this guardrail.
   */
  metricInvocationServerErrors(props?: MetricOptions): Metric;

  /**
   * Return the invocation throttles metric for this guardrail.
   */
  metricInvocationThrottles(props?: MetricOptions): Metric;

  /**
   * Return the text unit count metric for this guardrail.
   */
  metricTextUnitCount(props?: MetricOptions): Metric;

  /**
   * Return the invocations intervened metric for this guardrail.
   */
  metricInvocationsIntervened(props?: MetricOptions): Metric;
}

/**
 * Abstract base class for a Guardrail.
 * Contains methods and attributes valid for Guardrails either created with CDK or imported.
 */
export abstract class GuardrailBase extends Resource implements IGuardrail {
  /**
   * Return the given named metric for all guardrails.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public static metricAll(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/Bedrock/Guardrails',
      dimensionsMap: { Operation: 'ApplyGuardrail' },
      metricName,
      ...props,
    });
  }

  /**
   * Return the invocations metric for all guardrails.
   */
  public static metricAllInvocations(props?: MetricOptions): Metric {
    return this.metricAll('Invocations', props);
  }

  /**
   * Return the text unit count metric for all guardrails.
   */
  public static metricAllTextUnitCount(props?: MetricOptions): Metric {
    return this.metricAll('TextUnitCount', props);
  }

  /**
   * Return the invocations intervened metric for all guardrails.
   */
  public static metricAllInvocationsIntervened(props?: MetricOptions): Metric {
    return this.metricAll('InvocationsIntervened', props);
  }

  /**
   * Return the invocation latency metric for all guardrails.
   */
  public static metricAllInvocationLatency(props?: MetricOptions): Metric {
    return this.metricAll('InvocationLatency', props);
  }

  private _version: string = 'DRAFT';

  /**
   * The ARN of the guardrail.
   * @attribute
   */
  public abstract readonly guardrailArn: string;

  /**
   * The ID of the guardrail.
   * @attribute
   */
  public abstract readonly guardrailId: string;

  /**
   * Optional KMS encryption key associated with this guardrail
   */
  public abstract readonly kmsKey?: IKey;

  /**
   * When this guardrail was last updated.
   */
  public abstract readonly lastUpdated?: string;

  /**
   * The version of the guardrail.
   * @attribute
   */
  public get guardrailVersion(): string {
    return this._version;
  }

  protected updateVersion(version: string) {
    this._version = version;
  }

  /**
   * Grant the given principal identity permissions to perform actions on this guardrail.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.guardrailArn],
      scope: this,
    });
  }

  /**
   * Grant the given identity permissions to apply the guardrail.
   */
  public grantApply(grantee: iam.IGrantable): iam.Grant {
    const baseGrant = this.grant(grantee, 'bedrock:ApplyGuardrail');

    if (this.kmsKey) {
      // If KMS key exists, create encryption grant and combine with base grant
      const kmsGrant = this.kmsKey.grantEncryptDecrypt(grantee);
      return kmsGrant.combine(baseGrant);
    } else {
      // If no KMS key exists, return only the base grant
      return baseGrant;
    }
  }

  /**
   * Return the given named metric for this guardrail.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock/Guardrails',
      metricName,
      dimensionsMap: { GuardrailArn: this.guardrailArn, GuardrailVersion: this.guardrailVersion },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return the invocations metric for this guardrail.
   */
  public metricInvocations(props?: MetricOptions): Metric {
    return this.metric('Invocations', props);
  }

  /**
   * Return the invocation latency metric for this guardrail.
   */
  public metricInvocationLatency(props?: MetricOptions): Metric {
    return this.metric('InvocationLatency', props);
  }

  /**
   * Return the invocation client errors metric for this guardrail.
   */
  public metricInvocationClientErrors(props?: MetricOptions): Metric {
    return this.metric('InvocationClientErrors', props);
  }

  /**
   * Return the invocation server errors metric for this guardrail.
   */
  public metricInvocationServerErrors(props?: MetricOptions): Metric {
    return this.metric('InvocationServerErrors', props);
  }

  /**
   * Return the invocation throttles metric for this guardrail.
   */
  public metricInvocationThrottles(props?: MetricOptions): Metric {
    return this.metric('InvocationThrottles', props);
  }

  /**
   * Return the text unit count metric for this guardrail.
   */
  public metricTextUnitCount(props?: MetricOptions): Metric {
    return this.metric('TextUnitCount', props);
  }

  /**
   * Return the invocations intervened metric for this guardrail.
   */
  public metricInvocationsIntervened(props?: MetricOptions): Metric {
    return this.metric('InvocationsIntervened', props);
  }

  private configureMetric(props: MetricProps) {
    return new Metric({
      ...props,
      region: props?.region ?? this.stack.region,
      account: props?.account ?? this.stack.account,
    });
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a Guardrail.
 */
export interface GuardrailProps {
  /**
   * The name of the guardrail.
   * This will be used as the physical name of the guardrail.
   */
  readonly guardrailName: string;
  /**
   * The description of the guardrail.
   * @default - No description
   */
  readonly description?: string;
  /**
   * The message to return when the guardrail blocks a prompt.
   * Must be between 1 and 500 characters.
   * @default "Sorry, your query violates our usage policy."
   */
  readonly blockedInputMessaging?: string;
  /**
   * The message to return when the guardrail blocks a model response.
   * Must be between 1 and 500 characters.
   * @default "Sorry, I am unable to answer your question because of our usage policy."
   */
  readonly blockedOutputsMessaging?: string;
  /**
   * A custom KMS key to use for encrypting data.
   * @default - Data is encrypted by default with a key that AWS owns and manages for you
   */
  readonly kmsKey?: IKey;
  /**
   * The content filters to apply to the guardrail.
   * @default []
   */
  readonly contentFilters?: filters.ContentFilter[];
  /**
   * The tier configuration to apply to the guardrail.
   * @default filters.TierConfig.CLASSIC
   */
  readonly contentFiltersTierConfig?: filters.TierConfig;
  /**
   * A list of policies related to topics that the guardrail should deny.
   * @default []
   */
  readonly deniedTopics?: filters.Topic[];
  /**
   * The tier configuration to apply to the guardrail.
   * @default filters.TierConfig.CLASSIC
   */
  readonly topicsTierConfig?: filters.TierConfig;
  /**
   * The word filters to apply to the guardrail.
   * @default []
   */
  readonly wordFilters?: filters.WordFilter[];
  /**
   * The managed word filters to apply to the guardrail.
   * @default []
   */
  readonly managedWordListFilters?: filters.ManagedWordFilter[];
  /**
   * The PII filters to apply to the guardrail.
   * @default []
   */
  readonly piiFilters?: filters.PIIFilter[];
  /**
   * The regular expression (regex) filters to apply to the guardrail.
   * @default []
   */
  readonly regexFilters?: filters.RegexFilter[];
  /**
   * The contextual grounding filters to apply to the guardrail.
   * @default []
   */
  readonly contextualGroundingFilters?: filters.ContextualGroundingFilter[];
  /**
   * The cross-region configuration for the guardrail.
   * This is optional and when provided, it should be of type GuardrailCrossRegionConfigProperty.
   * @default - No cross-region configuration
   */
  readonly crossRegionConfig?: GuardrailCrossRegionConfigProperty;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
export interface GuardrailAttributes {
  /**
   * The ARN of the guardrail. At least one of guardrailArn or guardrailId must be
   * defined in order to initialize a guardrail ref.
   */
  readonly guardrailArn: string;
  /**
   * The KMS key of the guardrail if custom encryption is configured.
   *
   * @default undefined - Means data is encrypted by default with a AWS-managed key
   */
  readonly kmsKey?: IKey;
  /**
   * The version of the guardrail.
   *
   * @default "DRAFT"
   */
  readonly guardrailVersion?: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create a Guardrail with CDK.
 * @cloudformationResource AWS::Bedrock::Guardrail
 */
@propertyInjectable
export class Guardrail extends GuardrailBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.Guardrail';

  /**
   * Import a guardrail given its attributes
   */
  public static fromGuardrailAttributes(scope: Construct, id: string, attrs: GuardrailAttributes): IGuardrail {
    class Import extends GuardrailBase {
      public readonly guardrailArn = attrs.guardrailArn;
      public readonly guardrailId = Arn.split(attrs.guardrailArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly kmsKey = attrs.kmsKey;
      public readonly lastUpdated = undefined;

      constructor() {
        super(scope, id);
        this.updateVersion(attrs.guardrailVersion ?? 'DRAFT');
      }
    }

    return new Import();
  }

  /**
   * Import a low-level L1 Cfn Guardrail
   */
  public static fromCfnGuardrail(cfnGuardrail: bedrock.CfnGuardrail): IGuardrail {
    return new (class extends GuardrailBase {
      public readonly guardrailArn = cfnGuardrail.attrGuardrailArn;
      public readonly guardrailId = cfnGuardrail.attrGuardrailId;
      public readonly kmsKey = cfnGuardrail.kmsKeyArn
        ? Key.fromKeyArn(this, '@FromCfnGuardrailKey', cfnGuardrail.kmsKeyArn)
        : undefined;
      public readonly lastUpdated = cfnGuardrail.attrUpdatedAt;

      constructor() {
        super(cfnGuardrail, '@FromCfnGuardrail');
        this.updateVersion(cfnGuardrail.attrVersion);
      }
    })();
  }

  /**
   * The ARN of the guardrail.
   * @attribute
   */
  public readonly guardrailArn: string;
  /**
   * The ID of the guardrail.
   * @attribute
   */
  public readonly guardrailId: string;
  /**
   * The name of the guardrail.
   */
  public readonly name: string;
  /**
   * The KMS key used to encrypt data.
   *
   * @default undefined - "Data is encrypted by default with a key that AWS owns and manages for you"
   */
  public readonly kmsKey?: IKey;
  /**
   * The content filters applied by the guardrail.
   */
  public readonly contentFilters: filters.ContentFilter[];
  /**
   * The PII filters applied by the guardrail.
   */
  public readonly piiFilters: filters.PIIFilter[];
  /**
   * The regex filters applied by the guardrail.
   */
  public readonly regexFilters: filters.RegexFilter[];
  /**
   * The denied topic filters applied by the guardrail.
   */
  public readonly deniedTopics: filters.Topic[];
  /**
   * The contextual grounding filters applied by the guardrail.
   */
  public readonly contextualGroundingFilters: filters.ContextualGroundingFilter[];
  /**
   * The word filters applied by the guardrail.
   */
  public readonly wordFilters: filters.WordFilter[];
  /**
   * The managed word list filters applied by the guardrail.
   */
  public readonly managedWordListFilters: filters.ManagedWordFilter[];
  /**
   * When this guardrail was last updated
   */
  public readonly lastUpdated?: string;
  /**
   * The computed hash of the guardrail properties.
   */
  public readonly hash: string;
  /**
   * The L1 representation of the guardrail
   */
  private readonly __resource: bedrock.CfnGuardrail;

  /**
   * The tier that your guardrail uses for denied topic filters.
   * @default filters.TierConfig.CLASSIC
   */
  public readonly topicsTierConfig: filters.TierConfig;

  /**
   * The tier that your guardrail uses for content filters.
   * Consider using a tier that balances performance, accuracy, and compatibility with your existing generative AI workflows.
   * @default filters.TierConfig.CLASSIC
   */
  public readonly contentFiltersTierConfig: filters.TierConfig;
  /**
   * The cross-region configuration for the guardrail.
   */
  public readonly crossRegionConfig?: GuardrailCrossRegionConfigProperty;

  /**
   * The message to return when the guardrail blocks a prompt.
   * @default "Sorry, your query violates our usage policy."
   */
  public readonly blockedInputMessaging: string;

  /**
   * The message to return when the guardrail blocks a model response.
   * @default "Sorry, I am unable to answer your question because of our usage policy."
   */
  public readonly blockedOutputsMessaging: string;

  constructor(scope: Construct, id: string, props: GuardrailProps) {
    super(scope, id, {
      physicalName: props.guardrailName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    this.name = this.physicalName;
    this.contentFilters = props.contentFilters ?? [];
    this.piiFilters = props.piiFilters ?? [];
    this.regexFilters = props.regexFilters ?? [];
    this.deniedTopics = props.deniedTopics ?? [];
    this.contextualGroundingFilters = props.contextualGroundingFilters ?? [];
    this.wordFilters = props.wordFilters ?? [];
    this.managedWordListFilters = props.managedWordListFilters ?? [];
    this.topicsTierConfig = props.topicsTierConfig ?? filters.TierConfig.CLASSIC;
    this.contentFiltersTierConfig = props.contentFiltersTierConfig ?? filters.TierConfig.CLASSIC;
    this.crossRegionConfig = props.crossRegionConfig;
    this.blockedInputMessaging = props.blockedInputMessaging ?? 'Sorry, your query violates our usage policy.';
    this.blockedOutputsMessaging = props.blockedOutputsMessaging ?? 'Sorry, I am unable to answer your question because of our usage policy.';

    // ------------------------------------------------------
    // Validate all filter arrays
    // ------------------------------------------------------
    this.validateContentFilters(this.contentFilters);
    this.validatePiiFilters(this.piiFilters);
    this.validateRegexFilters(this.regexFilters);
    this.validateDeniedTopics(this.deniedTopics);
    this.validateContextualGroundingFilters(this.contextualGroundingFilters);
    this.validateWordFilters(this.wordFilters);
    this.validateManagedWordListFilters(this.managedWordListFilters);

    // ------------------------------------------------------
    // Validate messaging properties
    // ------------------------------------------------------
    this.validateMessagingProperty(this.blockedInputMessaging, 'blockedInputMessaging');
    this.validateMessagingProperty(this.blockedOutputsMessaging, 'blockedOutputsMessaging');

    // ------------------------------------------------------
    // Validate tier configuration requirements
    // ------------------------------------------------------
    this.validateTierConfiguration(props);

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    let cfnProps: bedrock.CfnGuardrailProps = {
      name: props.guardrailName,
      description: props.description,
      kmsKeyArn: props.kmsKey?.keyArn,
      blockedInputMessaging: this.blockedInputMessaging,
      blockedOutputsMessaging: this.blockedOutputsMessaging,
      // Lazy props
      crossRegionConfig: this.generateCfnCrossRegionConfig(),
      contentPolicyConfig: this.generateCfnContentPolicyConfig(),
      contextualGroundingPolicyConfig: this.generateCfnContextualPolicyConfig(),
      topicPolicyConfig: this.generateCfnTopicPolicy(),
      wordPolicyConfig: this.generateCfnWordPolicyConfig(),
      sensitiveInformationPolicyConfig: this.generateCfnSensitiveInformationPolicyConfig(),
    };

    // Hash calculation useful for versioning of the guardrail
    this.hash = md5hash(JSON.stringify(cfnProps));

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new bedrock.CfnGuardrail(this, 'MyGuardrail', cfnProps);

    this.guardrailId = this.__resource.attrGuardrailId;
    this.guardrailArn = this.__resource.attrGuardrailArn;
    this.updateVersion(this.__resource.attrVersion);
    this.lastUpdated = this.__resource.attrUpdatedAt;
  }

  // ------------------------------------------------------
  // METHODS
  // ------------------------------------------------------
  /**
   * Adds a content filter to the guardrail.
   * @param filter The content filter to add.
   */
  @MethodMetadata()
  public addContentFilter(filter: filters.ContentFilter): void {
    this.validateSingleContentFilter(filter);
    this.contentFilters.push(filter);
  }

  /**
   * Adds a PII filter to the guardrail.
   * @param filter The PII filter to add.
   */
  @MethodMetadata()
  public addPIIFilter(filter: filters.PIIFilter): void {
    this.validateSinglePiiFilter(filter);
    this.piiFilters.push(filter);
  }

  /**
   * Adds a regex filter to the guardrail.
   * @param filter The regex filter to add.
   */
  @MethodMetadata()
  public addRegexFilter(filter: filters.RegexFilter): void {
    this.validateSingleRegexFilter(filter);
    this.regexFilters.push(filter);
  }

  /**
   * Adds a denied topic filter to the guardrail.
   * @param filter The denied topic filter to add.
   */
  @MethodMetadata()
  public addDeniedTopicFilter(filter: filters.Topic): void {
    this.validateSingleDeniedTopic(filter);
    this.deniedTopics.push(filter);
  }

  /**
   * Adds a contextual grounding filter to the guardrail.
   * @param filter The contextual grounding filter to add.
   */
  @MethodMetadata()
  public addContextualGroundingFilter(filter: filters.ContextualGroundingFilter): void {
    this.validateSingleContextualGroundingFilter(filter);
    this.contextualGroundingFilters.push(filter);
  }

  /**
   * Adds a word filter to the guardrail.
   * @param filter The word filter to add.
   */
  @MethodMetadata()
  public addWordFilter(filter: filters.WordFilter): void {
    this.validateSingleWordFilter(filter);
    this.wordFilters.push(filter);
  }

  /**
   * Adds a word filter to the guardrail.
   * @param filePath The location of the word filter file.
   */
  @MethodMetadata()
  public addWordFilterFromFile(filePath: string,
    inputAction?: filters.GuardrailAction,
    outputAction?: filters.GuardrailAction,
    inputEnabled?: boolean,
    outputEnabled?: boolean): void {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const words = fileContents.trim().split(',');
    for (const word of words) this.addWordFilter({ text: word, inputAction, outputAction, inputEnabled, outputEnabled });
  }

  /**
   * Adds a managed word list filter to the guardrail.
   * @param filter The managed word list filter to add.
   */
  @MethodMetadata()
  public addManagedWordListFilter(filter: filters.ManagedWordFilter): void {
    this.validateSingleManagedWordListFilter(filter);
    this.managedWordListFilters.push(filter);
  }

  /**
   * Create a version for the guardrail.
   * @param description The description of the version.
   * @returns The guardrail version.
   */
  @MethodMetadata()
  public createVersion(description?: string): string {
    const cfnVersion = new GuardrailVersion(this, `GuardrailVersion-${this.hash.slice(0, 16)}`, {
      description: description,
      guardrail: this,
    });

    this.updateVersion(cfnVersion.guardrailVersion);
    return this.guardrailVersion;
  }

  // ------------------------------------------------------
  // CFN Generators
  // ------------------------------------------------------
  /**
   * Returns the content filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnContentPolicyConfig(): IResolvable {
    return Lazy.any({
      produce: () => {
        if (this.contentFilters.length > 0) {
          const contentPolicyConfig: bedrock.CfnGuardrail.ContentPolicyConfigProperty = {
            filtersConfig: this.contentFilters,
            ...(this.contentFiltersTierConfig && {
              contentFiltersTierConfig: {
                tierName: this.contentFiltersTierConfig,
              } as bedrock.CfnGuardrail.ContentFiltersTierConfigProperty,
            }),
          };

          return contentPolicyConfig;
        } else {
          return undefined;
        }
      },
    });
  }

  /**
   * Returns the topic filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnTopicPolicy(): IResolvable {
    return Lazy.any({
      produce: () => {
        if (this.deniedTopics.length > 0) {
          const topicPolicyConfig: bedrock.CfnGuardrail.TopicPolicyConfigProperty = {
            topicsConfig: this.deniedTopics.flatMap((topic: filters.Topic) => {
              return {
                definition: topic.definition,
                name: topic.name,
                examples: topic.examples,
                type: 'DENY',
                inputAction: topic.inputAction,
                inputEnabled: topic.inputEnabled,
                outputAction: topic.outputAction,
                outputEnabled: topic.outputEnabled,
              } as bedrock.CfnGuardrail.TopicConfigProperty;
            }),
            ...(this.topicsTierConfig && {
              topicsTierConfig: {
                tierName: this.topicsTierConfig,
              } as bedrock.CfnGuardrail.TopicsTierConfigProperty,
            }),
          };

          return topicPolicyConfig;
        } else {
          return undefined;
        }
      },
    });
  }

  /**
   * Returns the contectual filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnContextualPolicyConfig(): IResolvable {
    return Lazy.any({
      produce: () => {
        if (this.contextualGroundingFilters.length > 0) {
          return {
            filtersConfig: this.contextualGroundingFilters.flatMap((filter: filters.ContextualGroundingFilter) => {
              return {
                type: filter.type,
                threshold: filter.threshold,
                action: filter.action,
                enabled: filter.enabled,
              } as bedrock.CfnGuardrail.ContextualGroundingFilterConfigProperty;
            }),
          };
        } else {
          return undefined;
        }
      },
    });
  }

  /**
   * Returns the word config applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnWordPolicyConfig(): IResolvable {
    return Lazy.any({
      produce: () => {
        if (this.wordFilters.length > 0 || this.managedWordListFilters.length > 0) {
          return {
            wordsConfig: this.generateCfnWordConfig(),
            managedWordListsConfig: this.generateCfnManagedWordListsConfig(),
          } as bedrock.CfnGuardrail.WordPolicyConfigProperty;
        } else {
          return undefined;
        }
      },
    });
  }

  /**
   * Returns the word filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnWordConfig(): IResolvable {
    return Lazy.any(
      {
        produce: () => {
          return this.wordFilters.flatMap((word: filters.WordFilter) => {
            return {
              text: word.text,
              inputAction: word.inputAction,
              inputEnabled: word.inputEnabled,
              outputAction: word.outputAction,
              outputEnabled: word.outputEnabled,
            } as bedrock.CfnGuardrail.WordConfigProperty;
          });
        },
      },
      { omitEmptyArray: true },
    );
  }

  /**
   * Returns the word filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnManagedWordListsConfig(): IResolvable {
    return Lazy.any(
      {
        produce: () => {
          return this.managedWordListFilters.flatMap((filter: filters.ManagedWordFilter) => {
            return {
              type: filter.type,
              inputAction: filter.inputAction,
              inputEnabled: filter.inputEnabled,
              outputAction: filter.outputAction,
              outputEnabled: filter.outputEnabled,
            } as bedrock.CfnGuardrail.ManagedWordsConfigProperty;
          });
        },
      },
      { omitEmptyArray: true },
    );
  }

  /**
   * Returns the sensitive information config applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnSensitiveInformationPolicyConfig(): IResolvable {
    return Lazy.any(
      {
        produce: () => {
          if (this.regexFilters.length > 0 || this.piiFilters.length > 0) {
            return {
              regexesConfig: this.generateCfnRegexesConfig(),
              piiEntitiesConfig: this.generateCfnPiiEntitiesConfig(),
            };
          } else {
            return undefined;
          }
        },
      },
      { omitEmptyArray: true },
    );
  }

  /**
   * Returns the regex filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnRegexesConfig(): IResolvable {
    return Lazy.any(
      {
        produce: () => {
          return this.regexFilters.flatMap((regex: filters.RegexFilter) => {
            return {
              name: regex.name,
              description: regex.description,
              pattern: regex.pattern,
              action: regex.action,
              inputAction: regex.inputAction,
              inputEnabled: regex.inputEnabled,
              outputAction: regex.outputAction,
              outputEnabled: regex.outputEnabled,
            } as bedrock.CfnGuardrail.RegexConfigProperty;
          });
        },
      },
      { omitEmptyArray: true },
    );
  }

  /**
   * Returns the Pii filters applied to the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnPiiEntitiesConfig(): IResolvable {
    return Lazy.any(
      {
        produce: () => {
          return this.piiFilters.flatMap((filter: filters.PIIFilter) => {
            return {
              type: filter.type.value,
              action: filter.action,
              inputAction: filter.inputAction,
              inputEnabled: filter.inputEnabled,
              outputAction: filter.outputAction,
              outputEnabled: filter.outputEnabled,
            } as bedrock.CfnGuardrail.PiiEntityConfigProperty;
          });
        },
      },
      { omitEmptyArray: true },
    );
  }

  /**
   * Returns the cross-region configuration for the guardrail. This method defers the computation
   * to synth time.
   */
  private generateCfnCrossRegionConfig(): IResolvable {
    return Lazy.any({
      produce: () => {
        if (this.crossRegionConfig) {
          return {
            guardrailProfileArn: this.crossRegionConfig.guardrailProfileArn,
          } as bedrock.CfnGuardrail.GuardrailCrossRegionConfigProperty;
        } else {
          return undefined;
        }
      },
    });
  }

  /**
   * Validates a RegexFilter object and applies default values for optional properties.
   * @param filter The regex filter to validate.
   * @param index Optional index for error messages when validating arrays.
   */
  private validateRegexFilter(filter: filters.RegexFilter, index?: number): void {
    const prefix = index !== undefined ? `Invalid RegexFilter at index ${index}` : 'Invalid RegexFilter';

    // Validate name: between 1 and 100 characters
    if (filter.name !== undefined && !Token.isUnresolved(filter.name)) {
      if (filter.name.length < 1) {
        throw new ValidationError(`${prefix}: The field name is ${filter.name.length} characters long but must be at least 1 characters`, this);
      }
      if (filter.name.length > 100) {
        throw new ValidationError(`${prefix}: The field name is ${filter.name.length} characters long but must be less than or equal to 100 characters`, this);
      }
    }

    // Validate description: between 1 and 1000 characters (if provided)
    if (filter.description !== undefined && !Token.isUnresolved(filter.description)) {
      if (filter.description.length < 1) {
        throw new ValidationError(`${prefix}: The field description is ${filter.description.length} characters long but must be at least 1 characters`, this);
      }
      if (filter.description.length > 1000) {
        throw new ValidationError(`${prefix}: The field description is ${filter.description.length} characters long but must be less than or equal to 1000 characters`, this);
      }
    }

    // Validate pattern: at least one character
    if (filter.pattern !== undefined && !Token.isUnresolved(filter.pattern)) {
      if (filter.pattern.length < 1) {
        throw new ValidationError(`${prefix}: The field pattern is ${filter.pattern.length} characters long but must be at least 1 characters`, this);
      }
    }

    // Validate action: must be a valid GuardrailAction value
    if (filter.action !== undefined && !Token.isUnresolved(filter.action) && !Object.values(filters.GuardrailAction).includes(filter.action)) {
      throw new ValidationError(`${prefix}: action must be a valid GuardrailAction value`, this);
    }

    // Validate inputAction: must be a valid GuardrailAction value (if provided)
    if (filter.inputAction !== undefined &&
        !Token.isUnresolved(filter.inputAction) &&
        !Object.values(filters.GuardrailAction).includes(filter.inputAction)) {
      throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
    }

    // Validate outputAction: must be a valid GuardrailAction value (if provided)
    if (filter.outputAction !== undefined &&
        !Token.isUnresolved(filter.outputAction) &&
        !Object.values(filters.GuardrailAction).includes(filter.outputAction)) {
      throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
    }

    // Validate inputEnabled: must be a boolean (if provided)
    if (filter.inputEnabled !== undefined &&
        !Token.isUnresolved(filter.inputEnabled) &&
        typeof filter.inputEnabled !== 'boolean') {
      throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
    }

    // Validate outputEnabled: must be a boolean (if provided)
    if (filter.outputEnabled !== undefined &&
        !Token.isUnresolved(filter.outputEnabled) &&
        typeof filter.outputEnabled !== 'boolean') {
      throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
    }

    // Apply default values for optional properties if not provided
    if (filter.inputAction === undefined) {
      (filter as any).inputAction = filters.GuardrailAction.BLOCK;
    }
    if (filter.inputEnabled === undefined) {
      (filter as any).inputEnabled = true;
    }
    if (filter.outputAction === undefined) {
      (filter as any).outputAction = filters.GuardrailAction.BLOCK;
    }
    if (filter.outputEnabled === undefined) {
      (filter as any).outputEnabled = true;
    }
  }

  /**
   * Validates a messaging property (blockedInputMessaging or blockedOutputsMessaging).
   * @param value The messaging value to validate.
   * @param propertyName The name of the property being validated.
   */
  private validateMessagingProperty(value: string | undefined, propertyName: string): void {
    if (value !== undefined && !Token.isUnresolved(value)) {
      if (value.length < 1) {
        throw new ValidationError(`Invalid ${propertyName}: The field ${propertyName} is ${value.length} characters long but must be at least 1 characters`, this);
      }
      if (value.length > 500) {
        throw new ValidationError(`Invalid ${propertyName}: The field ${propertyName} is ${value.length} characters long but must be less than or equal to 500 characters`, this);
      }
    }
  }

  /**
   * Validates that cross-region configuration is provided when STANDARD tier is used.
   * @param props The guardrail properties to validate.
   */
  private validateTierConfiguration(props: GuardrailProps): void {
    const contentTierConfig = props.contentFiltersTierConfig ?? filters.TierConfig.CLASSIC;
    const topicsTierConfig = props.topicsTierConfig ?? filters.TierConfig.CLASSIC;
    const hasCrossRegionConfig = props.crossRegionConfig !== undefined;

    // Check if STANDARD tier is used for content filters
    if (contentTierConfig === filters.TierConfig.STANDARD && !hasCrossRegionConfig) {
      throw new ValidationError(
        'Cross-region configuration is required when using STANDARD tier for content filters. ' +
        'Please provide a crossRegionConfig property with a valid guardrailProfileArn.',
        this,
      );
    }

    // Check if STANDARD tier is used for topic filters
    if (topicsTierConfig === filters.TierConfig.STANDARD && !hasCrossRegionConfig) {
      throw new ValidationError(
        'Cross-region configuration is required when using STANDARD tier for topic filters. ' +
        'Please provide a crossRegionConfig property with a valid guardrailProfileArn.',
        this,
      );
    }
  }

  /**
   * Validates content filters array and applies default values for optional properties.
   * @param contentFilters The content filters to validate.
   */
  private validateContentFilters(contentFilters?: filters.ContentFilter[]): void {
    if (!contentFilters) return;

    contentFilters.forEach((filter, index) => {
      const prefix = `Invalid ContentFilter at index ${index}`;

      // Validate that the filter has required properties
      if (!filter.type) {
        throw new ValidationError(`${prefix}: type is required`, this);
      }

      // Validate input strength
      if (filter.inputStrength !== undefined && !Token.isUnresolved(filter.inputStrength)) {
        if (!Object.values(filters.ContentFilterStrength).includes(filter.inputStrength)) {
          throw new ValidationError(`${prefix}: inputStrength must be a valid ContentFilterStrength value`, this);
        }
      }

      // Validate output strength
      if (filter.outputStrength !== undefined && !Token.isUnresolved(filter.outputStrength)) {
        if (!Object.values(filters.ContentFilterStrength).includes(filter.outputStrength)) {
          throw new ValidationError(`${prefix}: outputStrength must be a valid ContentFilterStrength value`, this);
        }
      }

      // Validate input modalities
      if (filter.inputModalities) {
        filter.inputModalities.forEach((modality, modalityIndex) => {
          if (!Object.values(filters.ModalityType).includes(modality)) {
            throw new ValidationError(`${prefix}: inputModalities[${modalityIndex}] must be a valid ModalityType value`, this);
          }
        });
      }

      // Validate output modalities
      if (filter.outputModalities) {
        filter.outputModalities.forEach((modality, modalityIndex) => {
          if (!Object.values(filters.ModalityType).includes(modality)) {
            throw new ValidationError(`${prefix}: outputModalities[${modalityIndex}] must be a valid ModalityType value`, this);
          }
        });
      }

      // Validate inputAction: must be a valid GuardrailAction value (if provided)
      if (filter.inputAction !== undefined &&
          !Token.isUnresolved(filter.inputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.inputAction)) {
        throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
      }

      // Validate outputAction: must be a valid GuardrailAction value (if provided)
      if (filter.outputAction !== undefined &&
          !Token.isUnresolved(filter.outputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.outputAction)) {
        throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
      }

      // Validate inputEnabled: must be a boolean (if provided)
      if (filter.inputEnabled !== undefined &&
          !Token.isUnresolved(filter.inputEnabled) &&
          typeof filter.inputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
      }

      // Validate outputEnabled: must be a boolean (if provided)
      if (filter.outputEnabled !== undefined &&
          !Token.isUnresolved(filter.outputEnabled) &&
          typeof filter.outputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (filter.inputAction === undefined) {
        (filter as any).inputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.inputEnabled === undefined) {
        (filter as any).inputEnabled = true;
      }
      if (filter.outputAction === undefined) {
        (filter as any).outputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.outputEnabled === undefined) {
        (filter as any).outputEnabled = true;
      }
    });
  }

  /**
   * Validates PII filters array and applies default values for optional properties.
   * @param piiFilters The PII filters to validate.
   */
  private validatePiiFilters(piiFilters?: filters.PIIFilter[]): void {
    if (!piiFilters) return;

    piiFilters.forEach((filter, index) => {
      const prefix = `Invalid PIIFilter at index ${index}`;

      // Validate that the filter has required properties
      if (!filter.type) {
        throw new ValidationError(`${prefix}: type is required`, this);
      }

      if (!filter.action) {
        throw new ValidationError(`${prefix}: action is required`, this);
      }

      // Validate action values
      if (!Token.isUnresolved(filter.action) && !Object.values(filters.GuardrailAction).includes(filter.action)) {
        throw new ValidationError(`${prefix}: action must be a valid GuardrailAction value`, this);
      }

      if (filter.inputAction &&
          !Token.isUnresolved(filter.inputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.inputAction)) {
        throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
      }

      if (filter.outputAction &&
          !Token.isUnresolved(filter.outputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.outputAction)) {
        throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
      }

      // Validate inputEnabled: must be a boolean (if provided)
      if (filter.inputEnabled !== undefined &&
          !Token.isUnresolved(filter.inputEnabled) &&
          typeof filter.inputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
      }

      // Validate outputEnabled: must be a boolean (if provided)
      if (filter.outputEnabled !== undefined &&
          !Token.isUnresolved(filter.outputEnabled) &&
          typeof filter.outputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (filter.inputAction === undefined) {
        (filter as any).inputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.inputEnabled === undefined) {
        (filter as any).inputEnabled = true;
      }
      if (filter.outputAction === undefined) {
        (filter as any).outputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.outputEnabled === undefined) {
        (filter as any).outputEnabled = true;
      }
    });
  }

  /**
   * Validates regex filters array.
   * @param regexFilters The regex filters to validate.
   */
  private validateRegexFilters(regexFilters?: filters.RegexFilter[]): void {
    if (!regexFilters) return;

    regexFilters.forEach((filter, index) => {
      this.validateRegexFilter(filter, index);
    });
  }

  /**
   * Validates denied topics array and applies default values for optional properties.
   * @param deniedTopics The denied topics to validate.
   */
  private validateDeniedTopics(deniedTopics?: filters.Topic[]): void {
    if (!deniedTopics) return;

    deniedTopics.forEach((topic, index) => {
      const prefix = `Invalid Topic at index ${index}`;

      // Validate that the topic has required properties
      if (!topic.name) {
        throw new ValidationError(`${prefix}: name is required`, this);
      }

      if (!topic.definition) {
        throw new ValidationError(`${prefix}: definition is required`, this);
      }

      // Validate name length
      if (!Token.isUnresolved(topic.name) && topic.name.length > 100) {
        throw new ValidationError(`${prefix}: name must be 100 characters or less`, this);
      }

      // Validate definition length
      if (!Token.isUnresolved(topic.definition) && topic.definition.length > 1000) {
        throw new ValidationError(`${prefix}: definition must be 1000 characters or less`, this);
      }

      // Validate examples if provided
      if (topic.examples) {
        if (topic.examples.length > 100) {
          throw new ValidationError(`${prefix}: examples array cannot contain more than 100 examples`, this);
        }

        topic.examples.forEach((example, exampleIndex) => {
          if (!Token.isUnresolved(example) && example.length > 100) {
            throw new ValidationError(`${prefix}: examples[${exampleIndex}] must be 100 characters or less`, this);
          }
        });
      }

      // Validate inputAction: must be a valid GuardrailAction value (if provided)
      if (topic.inputAction !== undefined &&
          !Token.isUnresolved(topic.inputAction) &&
          !Object.values(filters.GuardrailAction).includes(topic.inputAction)) {
        throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
      }

      // Validate outputAction: must be a valid GuardrailAction value (if provided)
      if (topic.outputAction !== undefined &&
          !Token.isUnresolved(topic.outputAction) &&
          !Object.values(filters.GuardrailAction).includes(topic.outputAction)) {
        throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
      }

      // Validate inputEnabled: must be a boolean (if provided)
      if (topic.inputEnabled !== undefined &&
          !Token.isUnresolved(topic.inputEnabled) &&
          typeof topic.inputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
      }

      // Validate outputEnabled: must be a boolean (if provided)
      if (topic.outputEnabled !== undefined &&
          !Token.isUnresolved(topic.outputEnabled) &&
          typeof topic.outputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (topic.inputAction === undefined) {
        (topic as any).inputAction = filters.GuardrailAction.BLOCK;
      }
      if (topic.inputEnabled === undefined) {
        (topic as any).inputEnabled = true;
      }
      if (topic.outputAction === undefined) {
        (topic as any).outputAction = filters.GuardrailAction.BLOCK;
      }
      if (topic.outputEnabled === undefined) {
        (topic as any).outputEnabled = true;
      }
    });
  }

  /**
   * Validates contextual grounding filters array and applies default values for optional properties.
   * @param contextualGroundingFilters The contextual grounding filters to validate.
   */
  private validateContextualGroundingFilters(contextualGroundingFilters?: filters.ContextualGroundingFilter[]): void {
    if (!contextualGroundingFilters) return;

    contextualGroundingFilters.forEach((filter, index) => {
      const prefix = `Invalid ContextualGroundingFilter at index ${index}`;

      // Validate that the filter has required properties
      if (!filter.type) {
        throw new ValidationError(`${prefix}: type is required`, this);
      }

      if (filter.threshold === undefined) {
        throw new ValidationError(`${prefix}: threshold is required`, this);
      }

      // Validate type
      if (!Object.values(filters.ContextualGroundingFilterType).includes(filter.type)) {
        throw new ValidationError(`${prefix}: type must be a valid ContextualGroundingFilterType value`, this);
      }

      // Validate threshold range
      if (!Token.isUnresolved(filter.threshold)) {
        if (filter.threshold < 0 || filter.threshold > 0.99) {
          throw new ValidationError(`${prefix}: threshold must be between 0 and 0.99`, this);
        }
      }

      // Validate action: must be a valid GuardrailAction value (if provided)
      if (filter.action !== undefined &&
          !Token.isUnresolved(filter.action) &&
          !Object.values(filters.GuardrailAction).includes(filter.action)) {
        throw new ValidationError(`${prefix}: action must be a valid GuardrailAction value`, this);
      }

      // Validate enabled: must be a boolean (if provided)
      if (filter.enabled !== undefined &&
          !Token.isUnresolved(filter.enabled) &&
          typeof filter.enabled !== 'boolean') {
        throw new ValidationError(`${prefix}: enabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (filter.action === undefined) {
        (filter as any).action = filters.GuardrailAction.BLOCK;
      }
      if (filter.enabled === undefined) {
        (filter as any).enabled = true;
      }
    });
  }

  /**
   * Validates word filters array and applies default values for optional properties.
   * @param wordFilters The word filters to validate.
   */
  private validateWordFilters(wordFilters?: filters.WordFilter[]): void {
    if (!wordFilters) return;

    wordFilters.forEach((filter, index) => {
      const prefix = `Invalid WordFilter at index ${index}`;

      // Validate that the filter has required properties
      if (!filter.text) {
        throw new ValidationError(`${prefix}: text is required`, this);
      }

      // Validate text length
      if (!Token.isUnresolved(filter.text) && filter.text.length > 100) {
        throw new ValidationError(`${prefix}: text must be 100 characters or less`, this);
      }

      // Validate inputAction: must be a valid GuardrailAction value (if provided)
      if (filter.inputAction !== undefined &&
          !Token.isUnresolved(filter.inputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.inputAction)) {
        throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
      }

      // Validate outputAction: must be a valid GuardrailAction value (if provided)
      if (filter.outputAction !== undefined &&
          !Token.isUnresolved(filter.outputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.outputAction)) {
        throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
      }

      // Validate inputEnabled: must be a boolean (if provided)
      if (filter.inputEnabled !== undefined &&
          !Token.isUnresolved(filter.inputEnabled) &&
          typeof filter.inputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
      }

      // Validate outputEnabled: must be a boolean (if provided)
      if (filter.outputEnabled !== undefined &&
          !Token.isUnresolved(filter.outputEnabled) &&
          typeof filter.outputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (filter.inputAction === undefined) {
        (filter as any).inputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.inputEnabled === undefined) {
        (filter as any).inputEnabled = true;
      }
      if (filter.outputAction === undefined) {
        (filter as any).outputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.outputEnabled === undefined) {
        (filter as any).outputEnabled = true;
      }
    });
  }

  /**
   * Validates managed word list filters array and applies default values for optional properties.
   * @param managedWordListFilters The managed word list filters to validate.
   */
  private validateManagedWordListFilters(managedWordListFilters?: filters.ManagedWordFilter[]): void {
    if (!managedWordListFilters) return;

    managedWordListFilters.forEach((filter, index) => {
      const prefix = `Invalid ManagedWordFilter at index ${index}`;

      // Validate type: must be a valid ManagedWordFilterType value (if provided)
      if (filter.type !== undefined && !Object.values(filters.ManagedWordFilterType).includes(filter.type)) {
        throw new ValidationError(`${prefix}: type must be a valid ManagedWordFilterType value`, this);
      }

      // Validate inputAction: must be a valid GuardrailAction value (if provided)
      if (filter.inputAction !== undefined &&
          !Token.isUnresolved(filter.inputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.inputAction)) {
        throw new ValidationError(`${prefix}: inputAction must be a valid GuardrailAction value`, this);
      }

      // Validate outputAction: must be a valid GuardrailAction value (if provided)
      if (filter.outputAction !== undefined &&
          !Token.isUnresolved(filter.outputAction) &&
          !Object.values(filters.GuardrailAction).includes(filter.outputAction)) {
        throw new ValidationError(`${prefix}: outputAction must be a valid GuardrailAction value`, this);
      }

      // Validate inputEnabled: must be a boolean (if provided)
      if (filter.inputEnabled !== undefined &&
          !Token.isUnresolved(filter.inputEnabled) &&
          typeof filter.inputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: inputEnabled must be a boolean value`, this);
      }

      // Validate outputEnabled: must be a boolean (if provided)
      if (filter.outputEnabled !== undefined &&
          !Token.isUnresolved(filter.outputEnabled) &&
          typeof filter.outputEnabled !== 'boolean') {
        throw new ValidationError(`${prefix}: outputEnabled must be a boolean value`, this);
      }

      // Apply default values for optional properties if not provided
      if (filter.type === undefined) {
        (filter as any).type = filters.ManagedWordFilterType.PROFANITY;
      }
      if (filter.inputAction === undefined) {
        (filter as any).inputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.inputEnabled === undefined) {
        (filter as any).inputEnabled = true;
      }
      if (filter.outputAction === undefined) {
        (filter as any).outputAction = filters.GuardrailAction.BLOCK;
      }
      if (filter.outputEnabled === undefined) {
        (filter as any).outputEnabled = true;
      }
    });
  }

  /**
   * Validates a single content filter and applies default values for optional properties.
   * @param filter The content filter to validate.
   */
  private validateSingleContentFilter(filter: filters.ContentFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateContentFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single PII filter and applies default values for optional properties.
   * @param filter The PII filter to validate.
   */
  private validateSinglePiiFilter(filter: filters.PIIFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validatePiiFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single regex filter and applies default values for optional properties.
   * @param filter The regex filter to validate.
   */
  private validateSingleRegexFilter(filter: filters.RegexFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateRegexFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single denied topic and applies default values for optional properties.
   * @param filter The denied topic to validate.
   */
  private validateSingleDeniedTopic(filter: filters.Topic): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateDeniedTopics([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single contextual grounding filter and applies default values for optional properties.
   * @param filter The contextual grounding filter to validate.
   */
  private validateSingleContextualGroundingFilter(filter: filters.ContextualGroundingFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateContextualGroundingFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single word filter and applies default values for optional properties.
   * @param filter The word filter to validate.
   */
  private validateSingleWordFilter(filter: filters.WordFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateWordFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }

  /**
   * Validates a single managed word list filter and applies default values for optional properties.
   * @param filter The managed word list filter to validate.
   */
  private validateSingleManagedWordListFilter(filter: filters.ManagedWordFilter): void {
    // Use the existing validation logic but catch and re-throw with a clearer error message
    try {
      this.validateManagedWordListFilters([filter]);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Replace "at index 0" with a clearer message for single filter validation
        const message = error.message.replace(' at index 0', '');
        throw new ValidationError(message, this);
      }
      throw error;
    }
  }
}
