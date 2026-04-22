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

import type { IResource, ResourceProps } from 'aws-cdk-lib';
import { Arn, ArnFormat, Lazy, Resource, Names } from 'aws-cdk-lib';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import * as perms from './perms';
import { validateEvaluatorName, validateTags, throwIfInvalid } from './validation-helpers';

/******************************************************************************
 *                                Enums
 *****************************************************************************/

/**
 * The granularity level at which evaluation occurs.
 */
export enum EvaluationLevel {
  /** Evaluate at the session level */
  SESSION = 'SESSION',
  /** Evaluate at the trace level */
  TRACE = 'TRACE',
  /** Evaluate at the tool call level */
  TOOL_CALL = 'TOOL_CALL',
}

/******************************************************************************
 *                           Rating Scale
 *****************************************************************************/

/**
 * A categorical rating entry for an LLM-as-a-Judge evaluator.
 */
export interface CategoricalRatingEntry {
  /**
   * The label for this rating entry.
   */
  readonly label: string;

  /**
   * The definition describing what this rating label means.
   */
  readonly definition: string;
}

/**
 * A numerical rating entry for an LLM-as-a-Judge evaluator.
 */
export interface NumericalRatingEntry {
  /**
   * The label for this rating entry.
   */
  readonly label: string;

  /**
   * The definition describing what this rating label means.
   */
  readonly definition: string;

  /**
   * The numeric value associated with this rating entry.
   */
  readonly value: number;
}

/**
 * Defines the rating scale used by an LLM-as-a-Judge evaluator.
 *
 * Use the static factory methods to create either a categorical or numerical rating scale.
 * Categorical scales use label/definition pairs, while numerical scales add a numeric value.
 */
export class RatingScale {
  /**
   * Creates a categorical rating scale.
   *
   * @param entries - The categorical rating entries (label and definition pairs)
   * @returns A RatingScale configured with categorical entries
   */
  public static categorical(entries: CategoricalRatingEntry[]): RatingScale {
    return new RatingScale({ categorical: entries });
  }

  /**
   * Creates a numerical rating scale.
   *
   * @param entries - The numerical rating entries (label, definition, and numeric value)
   * @returns A RatingScale configured with numerical entries
   */
  public static numerical(entries: NumericalRatingEntry[]): RatingScale {
    return new RatingScale({ numerical: entries });
  }

  private readonly config: {
    categorical?: CategoricalRatingEntry[];
    numerical?: NumericalRatingEntry[];
  };

  private constructor(config: { categorical?: CategoricalRatingEntry[]; numerical?: NumericalRatingEntry[] }) {
    this.config = config;
  }

  /**
   * Renders the rating scale to the L1 CloudFormation shape.
   * @internal
   */
  public _render(): any {
    if (this.config.categorical) {
      return {
        categorical: this.config.categorical.map((entry) => ({
          label: entry.label,
          definition: entry.definition,
        })),
      };
    }
    return {
      numerical: this.config.numerical!.map((entry) => ({
        label: entry.label,
        definition: entry.definition,
        value: entry.value,
      })),
    };
  }
}

/******************************************************************************
 *                         Evaluator Config
 *****************************************************************************/

/**
 * Properties for creating an LLM-as-a-Judge evaluator configuration.
 */
export interface LlmAsAJudgeProps {
  /**
   * The evaluation instructions containing placeholders for the LLM judge.
   */
  readonly evaluationInstructions: string;

  /**
   * The Bedrock model ID to use as the judge.
   */
  readonly modelId: string;

  /**
   * The rating scale for the evaluator.
   */
  readonly ratingScale: RatingScale;

  /**
   * The maximum number of tokens to generate.
   *
   * @default - No max tokens limit
   */
  readonly maxTokens?: number;

  /**
   * The temperature for model inference.
   *
   * @default - Model default temperature
   */
  readonly temperature?: number;

  /**
   * The topP value for model inference.
   *
   * @default - Model default topP
   */
  readonly topP?: number;

  /**
   * Additional model request fields as an untyped map.
   *
   * @default - No additional fields
   */
  readonly additionalModelRequestFields?: { [key: string]: any };
}

/**
 * Properties for creating a code-based evaluator configuration.
 */
export interface CodeBasedProps {
  /**
   * The Lambda function to use for evaluation.
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * The timeout in seconds for the Lambda function invocation.
   *
   * @default - No timeout (1-300 seconds)
   */
  readonly lambdaTimeoutInSeconds?: number;
}

/**
 * Configuration for an Evaluator resource.
 *
 * Use the static factory methods to create either an LLM-as-a-Judge or code-based configuration.
 */
export class EvaluatorConfig {
  /**
   * Creates an LLM-as-a-Judge evaluator configuration.
   *
   * @param props - The LLM-as-a-Judge configuration properties
   * @returns An EvaluatorConfig for LLM-as-a-Judge evaluation
   */
  public static llmAsAJudge(props: LlmAsAJudgeProps): EvaluatorConfig {
    return new EvaluatorConfig({ llmAsAJudge: props });
  }

  /**
   * Creates a code-based evaluator configuration.
   *
   * @param props - The code-based configuration properties
   * @returns An EvaluatorConfig for code-based evaluation
   */
  public static codeBased(props: CodeBasedProps): EvaluatorConfig {
    return new EvaluatorConfig({ codeBased: props });
  }

  private readonly config: {
    llmAsAJudge?: LlmAsAJudgeProps;
    codeBased?: CodeBasedProps;
  };

  private constructor(config: { llmAsAJudge?: LlmAsAJudgeProps; codeBased?: CodeBasedProps }) {
    this.config = config;
  }

  /**
   * Returns whether this config is an LLM-as-a-Judge configuration.
   * @internal
   */
  public _isLlmAsAJudge(): boolean {
    return this.config.llmAsAJudge !== undefined;
  }

  /**
   * Returns the model ID if this is an LLM-as-a-Judge configuration, undefined otherwise.
   * @internal
   */
  public _getModelId(): string | undefined {
    return this.config.llmAsAJudge?.modelId;
  }

  /**
   * Renders the evaluator configuration to the L1 CloudFormation shape.
   * @internal
   */
  public _render(): any {
    if (this.config.llmAsAJudge) {
      const llm = this.config.llmAsAJudge;

      // Build inference config only if any inference params are provided
      const hasInferenceParams = llm.maxTokens !== undefined || llm.temperature !== undefined || llm.topP !== undefined;
      const inferenceConfig = hasInferenceParams
        ? {
          ...(llm.maxTokens !== undefined && { maxTokens: llm.maxTokens }),
          ...(llm.temperature !== undefined && { temperature: llm.temperature }),
          ...(llm.topP !== undefined && { topP: llm.topP }),
        }
        : undefined;

      return {
        llmAsAJudge: {
          instructions: llm.evaluationInstructions,
          modelConfig: {
            bedrockEvaluatorModelConfig: {
              modelId: llm.modelId,
              ...(inferenceConfig && { inferenceConfig }),
              ...(llm.additionalModelRequestFields && {
                additionalModelRequestFields: llm.additionalModelRequestFields,
              }),
            },
          },
          ratingScale: llm.ratingScale._render(),
        },
      };
    }

    const codeBased = this.config.codeBased!;
    return {
      codeBased: {
        lambdaConfig: {
          lambdaArn: codeBased.lambdaFunction.functionArn,
          ...(codeBased.lambdaTimeoutInSeconds !== undefined && {
            lambdaTimeoutInSeconds: codeBased.lambdaTimeoutInSeconds,
          }),
        },
      },
    };
  }
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for Evaluator resources.
 */
export interface IEvaluator extends IResource, iam.IGrantable {
  /**
   * The ARN of the evaluator resource.
   * @attribute
   */
  readonly evaluatorArn: string;

  /**
   * The ID of the evaluator.
   * @attribute
   */
  readonly evaluatorId: string;

  /**
   * Grants IAM actions to the IAM Principal.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants `Get` and `List` actions on the Evaluator.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants `Update`, `Delete`, and read actions on the Evaluator.
   */
  grantManage(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/

/**
 * Abstract base class for an Evaluator.
 * Contains methods and attributes valid for Evaluators either created with CDK or imported.
 */
export abstract class EvaluatorBase extends Resource implements IEvaluator {
  public abstract readonly evaluatorArn: string;
  public abstract readonly evaluatorId: string;

  /**
   * The principal to grant permissions to.
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  /**
   * Grants IAM actions to the IAM Principal.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant permissions to
   * @param actions - The actions to grant
   * @returns An IAM Grant object representing the granted permissions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.evaluatorArn],
    });
  }

  /**
   * Grant read permissions on this evaluator to an IAM principal.
   * This includes both read permissions on the specific evaluator and list permissions on all evaluators.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...perms.EVALUATOR_READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee,
      resourceArns: ['*'],
      actions: perms.EVALUATOR_LIST_PERMS,
    });

    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grant manage permissions on this evaluator to an IAM principal.
   * This includes update, delete, and read permissions.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant manage permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    const manageGrant = this.grant(
      grantee,
      ...perms.EVALUATOR_MANAGE_PERMS,
    );

    const readGrant = this.grantRead(grantee);

    return manageGrant.combine(readGrant);
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/

/**
 * Properties for creating an Evaluator resource.
 */
export interface EvaluatorProps {
  /**
   * The name of the evaluator.
   * Valid characters are a-z, A-Z, 0-9, _ (underscore).
   * The name must start with a letter and can be up to 48 characters long.
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   *
   * @default - auto-generated
   */
  readonly evaluatorName?: string;

  /**
   * The evaluator configuration (LLM-as-a-Judge or code-based).
   */
  readonly evaluatorConfig: EvaluatorConfig;

  /**
   * The evaluation level (SESSION, TRACE, or TOOL_CALL).
   */
  readonly level: EvaluationLevel;

  /**
   * Optional description for the evaluator.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Tags to apply to this evaluator resource.
   *
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/

/**
 * Attributes for specifying an imported Evaluator.
 */
export interface EvaluatorAttributes {
  /**
   * The ARN of the evaluator.
   * @attribute
   */
  readonly evaluatorArn: string;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 * An Evaluator resource for AWS Bedrock AgentCore.
 * Represents a custom evaluator that assesses agent performance using either
 * LLM-as-a-Judge or code-based (Lambda) evaluation logic.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
 * @resource AWS::BedrockAgentCore::Evaluator
 */
@propertyInjectable
export class Evaluator extends EvaluatorBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.Evaluator';

  /**
   * Creates an Evaluator reference from an existing evaluator's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing evaluator
   * @returns An IEvaluator reference to the existing evaluator
   */
  public static fromEvaluatorAttributes(scope: Construct, id: string, attrs: EvaluatorAttributes): IEvaluator {
    class Import extends EvaluatorBase {
      public readonly evaluatorArn = attrs.evaluatorArn;
      public readonly evaluatorId = Arn.split(attrs.evaluatorArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly grantPrincipal: iam.IPrincipal;

      constructor(s: Construct, i: string) {
        super(s, i);
        this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
      }
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------

  /**
   * The ARN of the evaluator resource.
   * @attribute
   */
  public readonly evaluatorArn: string;

  /**
   * The ID of the evaluator.
   * @attribute
   */
  public readonly evaluatorId: string;

  /**
   * The status of the evaluator.
   * @attribute
   */
  public readonly status?: string;

  /**
   * The principal to grant permissions to.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The evaluator configuration.
   * @internal
   */
  public readonly _evaluatorConfig: EvaluatorConfig;

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: agent_core.CfnEvaluator;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: EvaluatorProps) {
    super(scope, id, {
      physicalName: props.evaluatorName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    // Validate evaluator name
    throwIfInvalid(validateEvaluatorName, this.physicalName);

    // Validate tags
    throwIfInvalid(validateTags, props.tags);

    // ------------------------------------------------------
    // CFN Props
    // ------------------------------------------------------
    const cfnProps: agent_core.CfnEvaluatorProps = {
      evaluatorName: this.physicalName,
      evaluatorConfig: props.evaluatorConfig._render(),
      level: props.level,
      description: props.description,
      tags: props.tags
        ? Object.entries(props.tags).map(([key, value]) => ({ key, value }))
        : undefined,
    };

    // ------------------------------------------------------
    // CFN Resource
    // ------------------------------------------------------
    this.__resource = new agent_core.CfnEvaluator(this, 'Resource', cfnProps);

    // Wire attributes from L1
    this.evaluatorArn = this.__resource.attrEvaluatorArn;
    this.evaluatorId = this.__resource.attrEvaluatorId;
    this.status = this.__resource.attrStatus;

    // Evaluator has no execution role of its own
    this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });

    // Store config for use by EvaluatorReference
    this._evaluatorConfig = props.evaluatorConfig;
  }
}
