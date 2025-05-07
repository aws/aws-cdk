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

import { Arn, ArnFormat, Aws } from 'aws-cdk-lib';
import { IModel, FoundationModel, FoundationModelIdentifier } from 'aws-cdk-lib/aws-bedrock';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { IConstruct } from 'constructs';

/**
 * The data type for the vectors when using a model to convert text into vector embeddings.
 * The model must support the specified data type for vector embeddings. Floating-point (float32)
 * is the default data type, and is supported by most models for vector embeddings. See Supported
 * embeddings models for information on the available models and their vector data types.
 */
export enum VectorType {
  /**
   * `FLOATING_POINT` convert the data to floating-point (float32) vector embeddings (more precise, but more costly).
   */
  FLOATING_POINT = 'FLOAT32',
  /**
   * `BINARY` convert the data to binary vector embeddings (less precise, but less costly).
   */
  BINARY = 'BINARY',
}

/**
 * Represents an Amazon Bedrock abstraction on which you can
 * run the `Invoke` API. This can be a Foundational Model,
 * a Custom Model, or an Inference Profile.
 */
export interface IInvokable {
  /**
   * The ARN of the Bedrock invokable abstraction.
   */
  readonly invokableArn: string;

  /**
   * Gives the appropriate policies to invoke and use the invokable abstraction.
   */
  grantInvoke(grantee: IGrantable): Grant;
}

/**
 * Properties for configuring a Bedrock Foundation Model.
 */
export interface BedrockFoundationModelProps {
  /**
   * Bedrock Agents can use this model.
   *
   * @default - false
   */
  readonly supportsAgents?: boolean;
  /**
   * Currently, some of the offered models are optimized with prompts/parsers fine-tuned for integrating with the agents architecture.
   *
   * @default - false
   */
  readonly optimizedForAgents?: boolean;
  /**
   * https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html
   * A version is marked Legacy when there is a more recent version which provides superior performance. Amazon Bedrock sets an EOL date for Legacy versions.
   *
   * @default - false
   */
  readonly legacy?: boolean;
  /**
   * Bedrock Knowledge Base can use this model.
   *
   * @default - false
   */
  readonly supportsKnowledgeBase?: boolean;
  /**
   * Can be used with a Cross-Region Inference Profile
   * @default - false
   */
  readonly supportsCrossRegion?: boolean;
  /**
   * Embedding models have different vector dimensions.
   * Only applicable for embedding models.
   */
  /**
   * Embedding models have different vector dimensions.
   * Only applicable for embedding models.
   *
   * @default undefined - No vector dimensions specified
   */
  readonly vectorDimensions?: number;

  /**
   * Embeddings models have different supported vector types.
   *
   * @default undefined - No vector types specified
   */
  readonly supportedVectorType?: VectorType[];
}

/**
 * Bedrock models.
 *
 * If you need to use a model name that doesn't exist as a static member, you
 * can instantiate a `BedrockFoundationModel` object, e.g: `new BedrockFoundationModel('my-model')`.
 */
export class BedrockFoundationModel implements IInvokable {
  /****************************************************************************
   *                            AI21
   ***************************************************************************/
  /**
   * AI21's Jamba 1.5 Large model, optimized for general text generation and understanding.
   * Suitable for complex language tasks with high accuracy requirements.
   */
  public static readonly AI21_JAMBA_1_5_LARGE_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-large-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * AI21's Jamba 1.5 Mini model, a lightweight version optimized for faster inference.
   * Suitable for simpler language tasks where speed is prioritized.
   */
  public static readonly AI21_JAMBA_1_5_MINI_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-mini-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * AI21's Jamba Instruct model, specifically designed for instruction-following tasks.
   * Optimized for understanding and executing natural language instructions.
   */
  public static readonly AI21_JAMBA_INSTRUCT_V1 = new BedrockFoundationModel(
    'ai21.jamba-instruct-v1:0',
    {
      supportsAgents: true,
    },
  );
  /****************************************************************************
   *                            AMAZON
   ***************************************************************************/
  /**
   * Amazon's Titan Text Express model, optimized for fast text generation.
   * Suitable for real-time applications requiring quick responses.
   */
  public static readonly AMAZON_TITAN_TEXT_EXPRESS_V1 = new BedrockFoundationModel(
    'amazon.titan-text-express-v1',
    {
      supportsAgents: true,
    },
  );

  /**
   * Amazon's Titan Premier model, offering enhanced capabilities for complex text generation.
   * Provides higher quality outputs compared to Express version.
   */
  public static readonly AMAZON_TITAN_PREMIER_V1_0 = new BedrockFoundationModel(
    'amazon.titan-text-premier-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * Amazon's Nova Micro model, a lightweight model optimized for Bedrock Agents.
   * Provides fast inference with cross-region support.
   */
  public static readonly AMAZON_NOVA_MICRO_V1 = new BedrockFoundationModel(
    'amazon.nova-micro-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
      optimizedForAgents: true,
    },
  );

  /**
   * Amazon's Nova Lite model, balancing performance and resource usage.
   * Optimized for Bedrock Agents with cross-region support.
   */
  public static readonly AMAZON_NOVA_LITE_V1 = new BedrockFoundationModel('amazon.nova-lite-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Nova Pro model, offering advanced capabilities for complex tasks.
   * Provides high-quality outputs with cross-region support and agent optimization.
   */
  public static readonly AMAZON_NOVA_PRO_V1 = new BedrockFoundationModel('amazon.nova-pro-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Nova Premier model, their most advanced Nova model.
   * Provides highest quality outputs with cross-region support and agent optimization.
   */
  public static readonly AMAZON_NOVA_PREMIER_V1 = new BedrockFoundationModel('amazon.nova-premier-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Titan Embed Text V1 model for text embeddings.
   * Generates 1536-dimensional floating-point vector embeddings.
   */
  public static readonly TITAN_EMBED_TEXT_V1 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v1',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1536,
      supportedVectorType: [VectorType.FLOATING_POINT],
    },
  );

  /**
   * Amazon's Titan Embed Text V2 model with 1024-dimensional vectors.
   * Supports both floating-point and binary vector embeddings.
   */
  public static readonly TITAN_EMBED_TEXT_V2_1024 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v2:0',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

  /**
   * Amazon's Titan Embed Text V2 model with 512-dimensional vectors.
   * Provides a balance between precision and resource usage.
   */
  public static readonly TITAN_EMBED_TEXT_V2_512 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v2:0',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 512,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

  /**
   * Amazon's Titan Embed Text V2 model with 256-dimensional vectors.
   * Optimized for applications requiring compact vector representations.
   */
  public static readonly TITAN_EMBED_TEXT_V2_256 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v2:0',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 256,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );
  /****************************************************************************
   *                            ANTHROPIC
   ***************************************************************************/
  /**
   * Anthropic's Claude 3.7 Sonnet model, the latest version with enhanced capabilities.
   * Provides advanced natural language understanding and generation with cross-region support.
   */
  public static readonly ANTHROPIC_CLAUDE_3_7_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-7-sonnet-20250219-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: false },
  );

  /**
   * Anthropic's Claude 3.5 Sonnet V2 model, optimized for Bedrock Agents.
   * Offers improved performance and reliability over V1.
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V2_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20241022-v2:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude 3.5 Sonnet V1 model, with cross-region support.
   * Balances performance and resource usage for general-purpose tasks.
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20240620-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude 3.5 Haiku model, a lightweight version optimized for speed.
   * Ideal for applications requiring quick responses with good accuracy.
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-haiku-20241022-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Opus model, their most advanced model for complex tasks.
   * Provides highest quality outputs with enhanced reasoning capabilities.
   */
  public static readonly ANTHROPIC_CLAUDE_OPUS_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-opus-20240229-v1:0',
    { supportsAgents: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Sonnet model, a legacy version with agent optimization.
   * Provides reliable performance for general language tasks.
   */
  public static readonly ANTHROPIC_CLAUDE_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-sonnet-20240229-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, legacy: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Haiku model, optimized for fast inference.
   * Suitable for applications requiring quick responses with good quality.
   */
  public static readonly ANTHROPIC_CLAUDE_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-haiku-20240307-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude V2.1 model, a legacy version with enhanced capabilities.
   * Provides reliable performance for a wide range of language tasks.
   */
  public static readonly ANTHROPIC_CLAUDE_V2_1 = new BedrockFoundationModel(
    'anthropic.claude-v2:1',
    {
      supportsAgents: true,
      legacy: true,
      optimizedForAgents: true,
    },
  );

  /**
   * Anthropic's Claude V2 model, a legacy version of their general-purpose model.
   * Suitable for a wide range of language understanding and generation tasks.
   */
  public static readonly ANTHROPIC_CLAUDE_V2 = new BedrockFoundationModel('anthropic.claude-v2', {
    supportsAgents: true,
    legacy: true,
    optimizedForAgents: true,
  });

  /**
   * Anthropic's Claude Instant V1.2 model, a legacy fast-inference version.
   * Optimized for quick responses while maintaining good output quality.
   */
  public static readonly ANTHROPIC_CLAUDE_INSTANT_V1_2 = new BedrockFoundationModel(
    'anthropic.claude-instant-v1',
    {
      supportsAgents: true,
      legacy: true,
      optimizedForAgents: true,
    },
  );

  /****************************************************************************
   *                            COHERE
   ***************************************************************************/
  /**
   * Cohere's English embedding model, optimized for English text.
   * Generates 1024-dimensional vectors with support for both floating-point and binary types.
   */
  public static readonly COHERE_EMBED_ENGLISH_V3 = new BedrockFoundationModel(
    'cohere.embed-english-v3',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

  /**
   * Cohere's multilingual embedding model, supporting multiple languages.
   * Generates 1024-dimensional vectors with support for both floating-point and binary types.
   */
  public static readonly COHERE_EMBED_MULTILINGUAL_V3 = new BedrockFoundationModel(
    'cohere.embed-multilingual-v3',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );
  /****************************************************************************
   *                            DEEPSEEK
   ***************************************************************************/
  /**
   * Deepseek's R1 model, offering advanced language capabilities.
   * Supports cross-region deployment and Bedrock Agents integration.
   */
  public static readonly DEEPSEEK_R1_V1 = new BedrockFoundationModel(
    'deepseek.r1-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /****************************************************************************
   *                            META
   ***************************************************************************/
  /**
   * Meta's Llama 3 1.8B instruction-tuned model, a lightweight version.
   * Suitable for tasks requiring quick responses with good accuracy.
   */
  public static readonly META_LLAMA_3_1_8B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-8b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3 70B instruction-tuned model, their largest model.
   * Provides high-quality outputs for complex language tasks.
   */
  public static readonly META_LLAMA_3_1_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3 11B instruction-tuned model, a mid-sized version.
   * Balances performance and resource usage for general tasks.
   */
  public static readonly META_LLAMA_3_2_11B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-11b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3 3B instruction-tuned model, optimized for efficiency.
   * Suitable for applications requiring fast inference.
   */
  public static readonly META_LLAMA_3_2_3B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-3b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3 1B instruction-tuned model, their most compact version.
   * Ideal for resource-constrained environments.
   */
  public static readonly META_LLAMA_3_2_1B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-1b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3.3 70B instruction-tuned model, latest large version.
   * Offers enhanced capabilities with cross-region support.
   */
  public static readonly META_LLAMA_3_3_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-3-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 4 Maverick 70B instruction-tuned model, their most advanced model.
   * Provides state-of-the-art performance for complex language tasks with cross-region support.
   */
  public static readonly META_LLAMA_4_MAVERICK_17B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama4-maverick-17b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 4 Scout 17B instruction-tuned model, a mid-sized efficient model.
   * Balances performance and resource usage with cross-region support.
   */
  public static readonly META_LLAMA_4_SCOUT_17B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama4-scout-17b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Creates a BedrockFoundationModel from a CDK FoundationModelIdentifier.
   * @param modelId The foundation model identifier
   * @param props Optional properties for the model
   * @returns A new BedrockFoundationModel instance
   */
  public static fromCdkFoundationModelId(
    modelId: FoundationModelIdentifier,
    props: BedrockFoundationModelProps = {},
  ): BedrockFoundationModel {
    return new BedrockFoundationModel(modelId.modelId, props);
  }

  /**
   * Creates a BedrockFoundationModel from a CDK FoundationModel.
   * @param modelId The foundation model
   * @param props Optional properties for the model
   * @returns A new BedrockFoundationModel instance
   */
  public static fromCdkFoundationModel(
    modelId: FoundationModel,
    props: BedrockFoundationModelProps = {},
  ): BedrockFoundationModel {
    return new BedrockFoundationModel(modelId.modelId, props);
  }

  /****************************************************************************
   *                            Constructor
   ***************************************************************************/
  /**
   * The unique identifier of the foundation model.
   */
  public readonly modelId: string;

  /**
   * The ARN of the foundation model.
   */
  public readonly modelArn: string;

  /**
   * The ARN used for invoking the model.
   */
  public readonly invokableArn: string;

  /**
   * Whether this model can be used with Bedrock Agents.
   */
  public readonly supportsAgents: boolean;

  /**
   * Whether this model supports cross-region inference.
   */
  public readonly supportsCrossRegion: boolean;

  /**
   * The dimensionality of vectors produced by this model.
   * Only applicable for embedding models.
   */
  public readonly vectorDimensions?: number;

  /**
   * Whether this model can be used with Bedrock Knowledge Base.
   */
  public readonly supportsKnowledgeBase: boolean;

  /**
   * The vector types supported by this model.
   * Only applicable for embedding models.
   */
  public readonly supportedVectorType?: VectorType[];
  constructor(value: string, props: BedrockFoundationModelProps = {}) {
    this.modelId = value;
    this.modelArn = Arn.format({
      partition: Aws.PARTITION,
      service: 'bedrock',
      region: Aws.REGION,
      account: '',
      resource: 'foundation-model',
      resourceName: this.modelId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.invokableArn = this.modelArn;
    this.supportsCrossRegion = props.supportsCrossRegion ?? false;
    this.supportsAgents = props.supportsAgents ?? false;
    this.vectorDimensions = props.vectorDimensions;
    this.supportsKnowledgeBase = props.supportsKnowledgeBase ?? false;
    this.supportedVectorType = props.supportedVectorType;
  }

  toString(): string {
    return this.modelId;
  }

  /**
   * Returns the ARN of the foundation model in the following format:
   * `arn:${Partition}:bedrock:${Region}::foundation-model/${ResourceId}`
   */
  asArn(construct: IConstruct): string {
    if (construct) {
    }
    return this.modelArn;
  }

  /**
   * Returns this foundation model as an IModel interface.
   * This allows using the model with APIs that expect an IModel.
   * @param construct The scope in which to create any required resources
   * @returns This foundation model as an IModel
   */
  asIModel(construct: IConstruct): IModel {
    if (construct) {
    }
    return this;
  }

  /**
   * Gives the appropriate policies to invoke and use the Foundation Model in the stack region.
   */
  public grantInvoke(grantee: IGrantable): Grant {
    const grant = Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
      resourceArns: [this.invokableArn],
    });
    return grant;
  }

  /**
   * Gives the appropriate policies to invoke and use the Foundation Model in all regions.
   */
  public grantInvokeAllRegions(grantee: IGrantable): Grant {
    const invokableArn = Arn.format({
      partition: Aws.PARTITION,
      service: 'bedrock',
      region: '*',
      account: '',
      resource: 'foundation-model',
      resourceName: this.modelId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });

    return Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
      resourceArns: [invokableArn],
    });
  }
}
