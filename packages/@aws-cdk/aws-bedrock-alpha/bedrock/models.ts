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
export interface IBedrockInvokable {
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
 * These properties define the model's capabilities and supported features.
 */
export interface BedrockFoundationModelProps {
  /**
   * Bedrock Agents can use this model.
   * When true, the model can be used with Bedrock Agents for automated task execution.
   *
   * @default - false
   */
  readonly supportsAgents?: boolean;

  /**
   * Currently, some of the offered models are optimized with prompts/parsers fine-tuned for integrating with the agents architecture.
   * When true, the model has been specifically optimized for agent interactions.
   *
   * @default - false
   */
  readonly optimizedForAgents?: boolean;

  /**
   * https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html
   * A version is marked Legacy when there is a more recent version which provides superior performance.
   * Amazon Bedrock sets an EOL date for Legacy versions.
   *
   * @default - false
   */
  readonly legacy?: boolean;

  /**
   * Bedrock Knowledge Base can use this model.
   * When true, the model can be used for knowledge base operations.
   *
   * @default - false
   */
  readonly supportsKnowledgeBase?: boolean;

  /**
   * Can be used with a Cross-Region Inference Profile.
   * When true, the model supports inference across different AWS regions.
   *
   * @default - false
   */
  readonly supportsCrossRegion?: boolean;

  /**
   * Embedding models have different vector dimensions.
   * Only applicable for embedding models. Defines the dimensionality of the vector embeddings.
   *
   * @default - undefined
   */
  readonly vectorDimensions?: number;

  /**
   * Embeddings models have different supported vector types.
   * Defines whether the model supports floating-point or binary vectors.
   *
   * @default - undefined
   */
  readonly supportedVectorType?: VectorType[];
}

/**
 * Bedrock models.
 *
 * If you need to use a model name that doesn't exist as a static member, you
 * can instantiate a `BedrockFoundationModel` object, e.g: `new BedrockFoundationModel('my-model')`.
 */
export class BedrockFoundationModel implements IBedrockInvokable {
  /****************************************************************************
   *                            AI21
   ***************************************************************************/

  /**
   * AI21's Jamba 1.5 Large model optimized for text generation tasks.
   * Suitable for complex language understanding and generation tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Optimized for natural language processing
   * - Best for: Content generation, summarization, and complex text analysis
   */
  public static readonly AI21_JAMBA_1_5_LARGE_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-large-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * AI21's Jamba 1.5 Mini model, a lighter version optimized for faster processing.
   * Balances performance with efficiency for general text tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Faster response times compared to larger models
   * - Best for: Quick text processing, basic content generation
   */
  public static readonly AI21_JAMBA_1_5_MINI_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-mini-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * AI21's Jamba Instruct model, specifically designed for instruction-following tasks.
   * Optimized for understanding and executing specific instructions.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Enhanced instruction understanding
   * - Best for: Task-specific instructions, command processing
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
   * Provides quick responses while maintaining good quality output.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Fast response times
   * - Best for: Real-time applications, chatbots, quick content generation
   */
  public static readonly AMAZON_TITAN_TEXT_EXPRESS_V1 = new BedrockFoundationModel(
    'amazon.titan-text-express-v1',
    {
      supportsAgents: true,
    },
  );

  /**
   * Amazon's Titan Text Premier model, designed for high-quality text generation.
   * Offers enhanced capabilities for complex language tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Advanced language understanding
   * - Best for: Complex content generation, detailed analysis
   */
  public static readonly AMAZON_TITAN_PREMIER_V1_0 = new BedrockFoundationModel(
    'amazon.titan-text-premier-v1:0',
    {
      supportsAgents: true,
    },
  );

  /**
   * Amazon's Nova Micro model, a lightweight model optimized for efficiency.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: Quick processing tasks, basic language understanding
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
   * Amazon's Nova Lite model, balancing performance with efficiency.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: General-purpose language tasks, moderate complexity
   */
  public static readonly AMAZON_NOVA_LITE_V1 = new BedrockFoundationModel('amazon.nova-lite-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Nova Pro model, offering advanced capabilities for complex tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: Complex language tasks, professional applications
   */
  public static readonly AMAZON_NOVA_PRO_V1 = new BedrockFoundationModel('amazon.nova-pro-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Nova Premier model, the most advanced in the Nova series.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: High-end applications, complex analysis, premium performance
   */
  public static readonly AMAZON_NOVA_PREMIER_V1 = new BedrockFoundationModel('amazon.nova-premier-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  /**
   * Amazon's Titan Embed Text V1 model for text embeddings.
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 1536-dimensional vectors
   * - Floating-point vector type
   * - Best for: Text embeddings, semantic search, document similarity
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
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 1024-dimensional vectors
   * - Supports both floating-point and binary vectors
   * - Best for: High-dimensional embeddings, advanced semantic search
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
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 512-dimensional vectors
   * - Supports both floating-point and binary vectors
   * - Best for: Balanced performance and dimensionality
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
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 256-dimensional vectors
   * - Supports both floating-point and binary vectors
   * - Best for: Efficient embeddings with lower dimensionality
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
   * Anthropic's Claude 3.7 Sonnet model, latest in the Claude 3 series.
   * Advanced language model with enhanced capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Complex reasoning, analysis, and content generation
   */
  public static readonly ANTHROPIC_CLAUDE_3_7_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-7-sonnet-20250219-v1:0',

    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: false },
  );

  /**
   * Anthropic's Claude 3.5 Sonnet V2 model, optimized for agent interactions.
   * Enhanced version with improved performance and capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: Agent-based applications, complex dialogue
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V2_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20241022-v2:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude 3.5 Sonnet V1 model, balanced performance model.
   * Offers good balance between performance and efficiency.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: General language tasks, balanced performance
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20240620-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude 3.5 Haiku model, optimized for quick responses.
   * Lightweight model focused on speed and efficiency.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: Fast responses, lightweight processing
   */
  public static readonly ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-haiku-20241022-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Opus model, designed for advanced tasks.
   * High-performance model with extensive capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Optimized for agents
   * - Best for: Complex reasoning, research, and analysis
   */
  public static readonly ANTHROPIC_CLAUDE_OPUS_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-opus-20240229-v1:0',
    { supportsAgents: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Sonnet model, legacy version.
   * Balanced model for general-purpose tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Legacy model with EOL date
   * - Best for: General language tasks, standard applications
   */
  public static readonly ANTHROPIC_CLAUDE_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-sonnet-20240229-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, legacy: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude Haiku model, optimized for efficiency.
   * Fast and efficient model for lightweight tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Optimized for agents
   * - Best for: Quick responses, simple tasks
   */
  public static readonly ANTHROPIC_CLAUDE_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-haiku-20240307-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  /**
   * Anthropic's Claude V2.1 model, legacy version.
   * Improved version of Claude V2 with enhanced capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Legacy model with EOL date
   * - Optimized for agents
   * - Best for: General language tasks, legacy applications
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
   * Anthropic's Claude V2 model, legacy version.
   * Original Claude V2 model with broad capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Legacy model with EOL date
   * - Optimized for agents
   * - Best for: General language tasks, legacy applications
   */
  public static readonly ANTHROPIC_CLAUDE_V2 = new BedrockFoundationModel('anthropic.claude-v2', {
    supportsAgents: true,
    legacy: true,
    optimizedForAgents: true,
  });

  /**
   * Anthropic's Claude Instant V1.2 model, legacy version.
   * Fast and efficient model optimized for quick responses.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Legacy model with EOL date
   * - Optimized for agents
   * - Best for: Quick responses, simple tasks, legacy applications
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
   * Cohere's English embedding model, optimized for English text embeddings.
   * Specialized for semantic understanding of English content.
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 1024-dimensional vectors
   * - Supports both floating-point and binary vectors
   * - Best for: English text embeddings, semantic search, content similarity
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
   * Cohere's Multilingual embedding model, supporting multiple languages.
   * Enables semantic understanding across different languages.
   *
   * Features:
   * - Supports Knowledge Base integration
   * - 1024-dimensional vectors
   * - Supports both floating-point and binary vectors
   * - Best for: Cross-lingual embeddings, multilingual semantic search
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
   * Deepseek's R1 model, designed for general language understanding.
   * Balanced model for various language tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: General language tasks, content generation
   */
  public static readonly DEEPSEEK_R1_V1 = new BedrockFoundationModel('deepseek.r1-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
  });

  /****************************************************************************
   *                            META
   ***************************************************************************/

  /**
   * Meta's Llama 3 1.8B Instruct model, compact instruction-following model.
   * Efficient model optimized for instruction-based tasks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Lightweight instruction processing, quick responses
   */
  public static readonly META_LLAMA_3_1_8B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-8b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3 70B Instruct model, large-scale instruction model.
   * High-capacity model for complex language understanding.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Complex instructions, advanced language tasks
   */
  public static readonly META_LLAMA_3_1_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3.2 11B Instruct model, mid-sized instruction model.
   * Balanced model for general instruction processing.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: General instruction tasks, balanced performance
   */
  public static readonly META_LLAMA_3_2_11B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-11b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3.2 3B Instruct model, compact efficient model.
   * Lightweight model for basic instruction processing.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Basic instructions, efficient processing
   */
  public static readonly META_LLAMA_3_2_3B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-3b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3.2 1B Instruct model, ultra-lightweight model.
   * Most compact model in the Llama 3.2 series.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Simple instructions, fastest response times
   */
  public static readonly META_LLAMA_3_2_1B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-1b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 3.3 70B Instruct model, latest large-scale model.
   * Advanced model with enhanced capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Complex reasoning, advanced language tasks
   */
  public static readonly META_LLAMA_3_3_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-3-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 4 Maverick 17B Instruct model, innovative mid-sized model.
   * Specialized for creative and dynamic responses.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Creative tasks, innovative solutions
   */
  public static readonly META_LLAMA_4_MAVERICK_17B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama4-maverick-17b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  /**
   * Meta's Llama 4 Scout 17B Instruct model, analytical mid-sized model.
   * Focused on precise and analytical responses.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Analytical tasks, precise responses
   */
  public static readonly META_LLAMA_4_SCOUT_17B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama4-scout-17b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );
  /****************************************************************************
   *                            MISTRAL AI
   ***************************************************************************/

  /**
   * Mistral's 7B Instruct model, efficient instruction-following model.
   * Balanced performance for instruction processing.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Optimized for instruction tasks
   * - Best for: General instruction processing, balanced performance
   */
  public static readonly MISTRAL_7B_INSTRUCT_V0 = new BedrockFoundationModel(
    'mistral.mistral-7b-instruct-v0:2',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: false,
    },
  );

  /**
   * Mistral's Mixtral 8x7B Instruct model, mixture-of-experts architecture.
   * Advanced model combining multiple expert networks.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Specialized expert networks
   * - Best for: Complex tasks, diverse language understanding
   */
  public static readonly MISTRAL_MIXTRAL_8X7B_INSTRUCT_V0 = new BedrockFoundationModel(
    'mistral.mixtral-8x7b-instruct-v0:1',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: false,
    },
  );

  /**
   * Mistral's Small 2402 model, compact efficient model.
   * Optimized for quick responses and efficiency.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Efficient processing
   * - Best for: Quick responses, basic language tasks
   */
  public static readonly MISTRAL_SMALL_2402_V1 = new BedrockFoundationModel(
    'mistral.mistral-small-2402-v1:0',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: false,
    },
  );

  /**
   * Mistral's Large 2402 model, high-capacity language model.
   * Advanced model for complex language understanding.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Enhanced language capabilities
   * - Best for: Complex reasoning, detailed analysis
   */
  public static readonly MISTRAL_LARGE_2402_V1 = new BedrockFoundationModel(
    'mistral.mistral-large-2402-v1:0',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: false,
    },
  );

  /**
   * Mistral's Large 2407 model, updated large-scale model.
   * Enhanced version with improved capabilities.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Advanced language processing
   * - Best for: Sophisticated language tasks, complex analysis
   */
  public static readonly MISTRAL_LARGE_2407_V1 = new BedrockFoundationModel(
    'mistral.mistral-large-2407-v1:0',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: false,
    },
  );

  /**
   * Mistral's Pixtral Large 2502 model, specialized large model.
   * Advanced model with cross-region support.
   *
   * Features:
   * - Supports Bedrock Agents integration
   * - Cross-region support
   * - Best for: Advanced language tasks, distributed applications
   */
  public static readonly MISTRAL_PIXTRAL_LARGE_2502_V1 = new BedrockFoundationModel(
    'mistral.pixtral-large-2502-v1:0',
    {
      supportsAgents: true,
      optimizedForAgents: false,
      supportsCrossRegion: true,
    },
  );

  /**
   * Creates a BedrockFoundationModel from a FoundationModelIdentifier.
   * Use this method when you have a model identifier from the CDK.
   * @param modelId - The foundation model identifier
   * @param props - Optional properties for the model
   * @returns A new BedrockFoundationModel instance
   */
  public static fromCdkFoundationModelId(
    modelId: FoundationModelIdentifier,
    props: BedrockFoundationModelProps = {},
  ): BedrockFoundationModel {
    return new BedrockFoundationModel(modelId.modelId, props);
  }
  /**
   * Creates a BedrockFoundationModel from a FoundationModel.
   * Use this method when you have a foundation model from the CDK.
   * @param modelId - The foundation model
   * @param props - Optional properties for the model
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
   * Format: arn:${Partition}:bedrock:${Region}::foundation-model/${ResourceId}
   */
  public readonly modelArn: string;

  /**
   * The ARN used for invoking the model.
   * This is the same as modelArn for foundation models.
   */
  public readonly invokableArn: string;

  /**
   * Whether this model supports integration with Bedrock Agents.
   * When true, the model can be used with Bedrock Agents for automated task execution.
   */
  public readonly supportsAgents: boolean;

  /**
   * Whether this model supports cross-region inference.
   * When true, the model can be used with Cross-Region Inference Profiles.
   */
  public readonly supportsCrossRegion: boolean;

  /**
   * The dimensionality of the vector embeddings produced by this model.
   * Only applicable for embedding models.
   */
  public readonly vectorDimensions?: number;

  /**
   * Whether this model supports integration with Bedrock Knowledge Base.
   * When true, the model can be used for knowledge base operations.
   */
  public readonly supportsKnowledgeBase: boolean;

  /**
   * The vector types supported by this model for embeddings.
   * Defines whether the model supports floating-point or binary vectors.
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
  asArn(): string {
    return this.modelArn;
  }

  /**
   * Returns the IModel
   */
  asIModel(): IModel {
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
