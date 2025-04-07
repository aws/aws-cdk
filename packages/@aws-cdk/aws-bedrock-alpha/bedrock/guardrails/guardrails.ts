/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as fs from 'fs';
import { Arn, ArnFormat, IResolvable, IResource, Lazy, Resource } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Metric, MetricOptions, MetricProps } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IKey, Key } from 'aws-cdk-lib/aws-kms';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { Construct } from 'constructs';
import * as filters from './guardrail-filters';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents a Guardrail, either created with CDK or imported.
 */
export interface IGuardrail extends IResource {
  /**
   * The ARN of the guardrail.
   * @example "arn:aws:bedrock:us-east-1:123456789012:guardrail/yympzo398ipq"
   * @attribute
   */
  readonly guardrailArn: string;
  /**
   * The ID of the guardrail.
   * @example "yympzo398ipq"
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
   */
  guardrailVersion: string;

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

  /**
   * The ARN of the guardrail.
   */
  public abstract readonly guardrailArn: string;
  /**
   * The ID of the guardrail.
   */
  public abstract readonly guardrailId: string;
  /**
   * The ID of the guardrail.
   */
  public abstract guardrailVersion: string;
  /**
   * The KMS key of the guardrail if custom encryption is configured.
   */
  public abstract readonly kmsKey?: IKey;
  /**
   * When this guardrail was last updated
   */
  public abstract readonly lastUpdated?: string;
  /**
   * Grant the given principal identity permissions to perform actions on this agent alias.
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
   */
  readonly name: string;
  /**
   * The description of the guardrail.
   */
  readonly description?: string;
  /**
   * The message to return when the guardrail blocks a prompt.
   *
   * @default "Sorry, your query violates our usage policy."
   */
  readonly blockedInputMessaging?: string;
  /**
   * The message to return when the guardrail blocks a model response.
   *
   * @default "Sorry, I am unable to answer your question because of our usage policy."
   */
  readonly blockedOutputsMessaging?: string;
  /**
   * A custom KMS key to use for encrypting data.
   *
   * @default "Your data is encrypted by default with a key that AWS owns and manages for you."
   */
  readonly kmsKey?: IKey;
  /**
   * The content filters to apply to the guardrail.
   * Note, if one of
   */
  readonly contentFilters?: filters.ContentFilter[];
  /**
   * Up to 30 denied topics to block user inputs or model responses associated with the topic.
   */
  readonly deniedTopics?: filters.Topic[];
  /**
   * The word filters to apply to the guardrail.
   */
  readonly wordFilters?: string[];
  /**
   * The managed word filters to apply to the guardrail.
   */
  readonly managedWordListFilters?: filters.ManagedWordFilterType[];
  /**
   * The PII filters to apply to the guardrail.
   */
  readonly piiFilters?: filters.PIIFilter[];
  /**
   * The regular expression (regex) filters to apply to the guardrail.
   */
  readonly regexFilters?: filters.RegexFilter[];
  /**
   * The contextual grounding filters to apply to the guardrail.
   */
  readonly contextualGroundingFilters?: filters.ContextualGroundingFilter[];
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
export class Guardrail extends GuardrailBase {
  /**
   * Import a guardrail given its attributes
   */
  public static fromGuardrailAttributes(scope: Construct, id: string, attrs: GuardrailAttributes): IGuardrail {
    class Import extends GuardrailBase {
      public readonly guardrailArn = attrs.guardrailArn;
      public readonly guardrailId = Arn.split(attrs.guardrailArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly guardrailVersion = attrs.guardrailVersion ?? 'DRAFT';
      public readonly kmsKey = attrs.kmsKey;
      public readonly lastUpdated = undefined;
    }

    return new Import(scope, id);
  }

  /**
   * Import a low-level L1 Cfn Guardrail
   */
  public static fromCfnGuardrail(cfnGuardrail: bedrock.CfnGuardrail): IGuardrail {
    return new (class extends GuardrailBase {
      public readonly guardrailArn = cfnGuardrail.attrGuardrailArn;
      public readonly guardrailId = cfnGuardrail.attrGuardrailId;
      public readonly guardrailVersion = cfnGuardrail.attrVersion;
      public readonly kmsKey = cfnGuardrail.kmsKeyArn
        ? Key.fromKeyArn(this, '@FromCfnGuardrailKey', cfnGuardrail.kmsKeyArn)
        : undefined;
      public readonly lastUpdated = cfnGuardrail.attrUpdatedAt;
    })(cfnGuardrail, '@FromCfnGuardrail');
  }

  /**
   * The ARN of the guardrail.
   */
  public readonly guardrailArn: string;
  /**
   * The ID of the guardrail.
   */
  public readonly guardrailId: string;
  /**
   * The name of the guardrail.
   */
  public readonly name: string;
  /**
   * The version of the guardrail.
   * By default, this value will always be `DRAFT` unless an explicit version is created.
   * For an explicit version created, this will usually be a number (e.g. for Version 1 just enter "1")
   *
   * @example "1"
   * @default - "DRAFT"
   */
  public guardrailVersion: string;
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
  public readonly wordFilters: string[];
  /**
   * The managed word list filters applied by the guardrail.
   */
  public readonly managedWordListFilters: filters.ManagedWordFilterType[];
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

  constructor(scope: Construct, id: string, props: GuardrailProps) {
    super(scope, id, {
      physicalName: props.name,
    });

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

    const defaultBlockedInputMessaging = 'Sorry, your query violates our usage policy.';
    const defaultBlockedOutputsMessaging = 'Sorry, I am unable to answer your question because of our usage policy.';

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    let cfnProps: bedrock.CfnGuardrailProps = {
      name: this.name,
      description: props.description,
      kmsKeyArn: props.kmsKey?.keyArn,
      blockedInputMessaging: props.blockedInputMessaging ?? defaultBlockedInputMessaging,
      blockedOutputsMessaging: props.blockedOutputsMessaging ?? defaultBlockedOutputsMessaging,
      // Lazy props
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
    this.guardrailVersion = this.__resource.attrVersion;
    this.lastUpdated = this.__resource.attrUpdatedAt;
  }

  // ------------------------------------------------------
  // METHODS
  // ------------------------------------------------------
  /**
   * Adds a content filter to the guardrail.
   * @param filter The content filter to add.
   */
  public addContentFilter(filter: filters.ContentFilter): void {
    this.contentFilters.push(filter);
  }

  /**
   * Adds a PII filter to the guardrail.
   * @param filter The PII filter to add.
   */
  public addPIIFilter(filter: filters.PIIFilter): void {
    this.piiFilters.push(filter);
  }

  /**
   * Adds a regex filter to the guardrail.
   * @param filter The regex filter to add.
   */
  public addRegexFilter(filter: filters.RegexFilter): void {
    this.regexFilters.push(filter);
  }

  /**
   * Adds a denied topic filter to the guardrail.
   * @param filter The denied topic filter to add.
   */
  public addDeniedTopicFilter(filter: filters.Topic): void {
    this.deniedTopics.push(filter);
  }

  /**
   * Adds a contextual grounding filter to the guardrail.
   * @param filter The contextual grounding filter to add.
   */
  public addContextualGroundingFilter(filter: filters.ContextualGroundingFilter): void {
    this.contextualGroundingFilters.push(filter);
  }

  /**
   * Adds a word filter to the guardrail.
   * @param filter The word filter to add.
   */
  public addWordFilter(filter: string): void {
    this.wordFilters.push(filter);
  }

  /**
   * Adds a word filter to the guardrail.
   * @param filePath The location of the word filter file.
   */
  public addWordFilterFromFile(filePath: string): void {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const words = fileContents.trim().split(',');
    for (const word of words) this.addWordFilter(word);
  }

  /**
   * Adds a managed word list filter to the guardrail.
   * @param filter The managed word list filter to add.
   */
  public addManagedWordListFilter(filter: filters.ManagedWordFilterType): void {
    this.managedWordListFilters.push(filter);
  }

  /**
   * Create a version for the guardrail.
   * @param description The description of the version.
   * @returns The guardrail version.
   */
  public createVersion(description?: string): string {
    const cfnVersion = new bedrock.CfnGuardrailVersion(this, `GuardrailVersion-${this.hash.slice(0, 16)}`, {
      description: description,
      guardrailIdentifier: this.guardrailId,
    });

    this.guardrailVersion = cfnVersion.attrVersion;
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
          return { filtersConfig: this.contentFilters } as bedrock.CfnGuardrail.ContentPolicyConfigProperty;
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
          return {
            topicsConfig: this.deniedTopics.flatMap((topic: filters.Topic) => {
              return {
                definition: topic.definition,
                name: topic.name,
                examples: topic.examples,
                type: 'DENY',
              } as bedrock.CfnGuardrail.TopicConfigProperty;
            }),
          };
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
          return this.wordFilters.flatMap((word: string) => {
            return {
              text: word,
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
          return this.managedWordListFilters.flatMap((filter: filters.ManagedWordFilterType) => {
            return {
              type: filter.toString(),
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
              type: filter.type,
              action: filter.action,
            } as bedrock.CfnGuardrail.PiiEntityConfigProperty;
          });
        },
      },
      { omitEmptyArray: true },
    );
  }
}
