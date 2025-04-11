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
  readonly vectorDimensions?: number;
  /**
   * Embeddings models have different supported vector types
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
  public static readonly AI21_JAMBA_1_5_LARGE_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-large-v1:0',
    {
      supportsAgents: true,
    },
  );

  public static readonly AI21_JAMBA_1_5_MINI_V1 = new BedrockFoundationModel(
    'ai21.jamba-1-5-mini-v1:0',
    {
      supportsAgents: true,
    },
  );

  public static readonly AI21_JAMBA_INSTRUCT_V1 = new BedrockFoundationModel(
    'ai21.jamba-instruct-v1:0',
    {
      supportsAgents: true,
    },
  );
  /****************************************************************************
   *                            AMAZON
   ***************************************************************************/
  public static readonly AMAZON_TITAN_TEXT_EXPRESS_V1 = new BedrockFoundationModel(
    'amazon.titan-text-express-v1',
    {
      supportsAgents: true,
    },
  );

  public static readonly AMAZON_TITAN_PREMIER_V1_0 = new BedrockFoundationModel(
    'amazon.titan-text-premier-v1:0',
    {
      supportsAgents: true,
    },
  );

  public static readonly AMAZON_NOVA_MICRO_V1 = new BedrockFoundationModel(
    'amazon.nova-micro-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
      optimizedForAgents: true,
    },
  );

  public static readonly AMAZON_NOVA_LITE_V1 = new BedrockFoundationModel('amazon.nova-lite-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  public static readonly AMAZON_NOVA_PRO_V1 = new BedrockFoundationModel('amazon.nova-pro-v1:0', {
    supportsAgents: true,
    supportsCrossRegion: true,
    optimizedForAgents: true,
  });

  public static readonly TITAN_EMBED_TEXT_V1 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v1',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1536,
      supportedVectorType: [VectorType.FLOATING_POINT],
    },
  );

  public static readonly TITAN_EMBED_TEXT_V2_1024 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v2:0',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

  public static readonly TITAN_EMBED_TEXT_V2_512 = new BedrockFoundationModel(
    'amazon.titan-embed-text-v2:0',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 512,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

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
  public static readonly ANTHROPIC_CLAUDE_3_7_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-7-sonnet-20250219-v1:0',

    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: false },
  );

  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V2_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20241022-v2:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_3_5_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-sonnet-20240620-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-5-haiku-20241022-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_OPUS_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-opus-20240229-v1:0',
    { supportsAgents: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_SONNET_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-sonnet-20240229-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, legacy: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_HAIKU_V1_0 = new BedrockFoundationModel(
    'anthropic.claude-3-haiku-20240307-v1:0',
    { supportsAgents: true, supportsCrossRegion: true, optimizedForAgents: true },
  );

  public static readonly ANTHROPIC_CLAUDE_V2_1 = new BedrockFoundationModel(
    'anthropic.claude-v2:1',
    {
      supportsAgents: true,
      legacy: true,
      optimizedForAgents: true,
    },
  );

  public static readonly ANTHROPIC_CLAUDE_V2 = new BedrockFoundationModel('anthropic.claude-v2', {
    supportsAgents: true,
    legacy: true,
    optimizedForAgents: true,
  });

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
  public static readonly COHERE_EMBED_ENGLISH_V3 = new BedrockFoundationModel(
    'cohere.embed-english-v3',
    {
      supportsKnowledgeBase: true,
      vectorDimensions: 1024,
      supportedVectorType: [VectorType.FLOATING_POINT, VectorType.BINARY],
    },
  );

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
  public static readonly META_LLAMA_3_1_8B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-8b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static readonly META_LLAMA_3_1_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-1-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static readonly META_LLAMA_3_2_11B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-11b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static readonly META_LLAMA_3_2_3B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-3b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static readonly META_LLAMA_3_2_1B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-2-1b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static readonly META_LLAMA_3_3_70B_INSTRUCT_V1 = new BedrockFoundationModel(
    'meta.llama3-3-70b-instruct-v1:0',
    {
      supportsAgents: true,
      supportsCrossRegion: true,
    },
  );

  public static fromCdkFoundationModelId(
    modelId: FoundationModelIdentifier,
    props: BedrockFoundationModelProps = {},
  ): BedrockFoundationModel {
    return new BedrockFoundationModel(modelId.modelId, props);
  }
  public static fromCdkFoundationModel(
    modelId: FoundationModel,
    props: BedrockFoundationModelProps = {},
  ): BedrockFoundationModel {
    return new BedrockFoundationModel(modelId.modelId, props);
  }

  /****************************************************************************
   *                            Constructor
   ***************************************************************************/
  public readonly modelId: string;
  public readonly modelArn: string;
  public readonly invokableArn: string;
  public readonly supportsAgents: boolean;
  public readonly supportsCrossRegion: boolean;
  public readonly vectorDimensions?: number;
  public readonly supportsKnowledgeBase: boolean;
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
