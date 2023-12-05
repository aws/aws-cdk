import { Construct } from 'constructs';
import { IModel } from './model-base';
import { ArnFormat, Stack } from '../../core';

/**
 * The model identifiers for the Bedrock base foundation models.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
 */
export enum FoundationModelIdentifier {
  /** Base model "ai21.j2-mid-v1". */
  AI21_LABS_JURASSIC_2_MID_V1 = 'ai21.j2-mid-v1',

  /** Base model "ai21.j2-ultra-v1". */
  AI21_LABS_JURASSIC_2_ULTRA_V1 = 'ai21.j2-ultra-v1',

  /** Base model "amazon.titan-embed-text-v1". */
  AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1 = 'amazon.titan-embed-text-v1',

  /** Base model "amazon.titan-text-express-v1". */
  AMAZON_TITAN_TEXT_G1_EXPRESS_V1 = 'amazon.titan-text-express-v1',

  /** Base model "amazon.titan-embed-image-v1". */
  AMAZON_TITAN_MULTIMODAL_EMBEDDINGS_G1_V1 = 'amazon.titan-embed-image-v1',

  /** Base model "amazon.titan-image-generator-v1". */
  AMAZON_TITAN_IMAGE_GENERATOR_G1_V1 = 'amazon.titan-image-generator-v1',

  /** Base model "anthropic.claude-v1". */
  ANTHROPIC_CLAUDE_V1 = 'anthropic.claude-v1',

  /** Base model "anthropic.claude-v2". */
  ANTHROPIC_CLAUDE_V2 = 'anthropic.claude-v2',

  /** Base model "anthropic.claude-v2:1". */
  ANTHROPIC_CLAUDE_V2_1 = 'anthropic.claude-v2:1',

  /** Base model "anthropic.claude-instant-v1". */
  ANTHROPIC_CLAUDE_INSTANT_V1 = 'anthropic.claude-instant-v1',

  /** Base model "cohere.command-text-v14". */
  COHERE_COMMAND_V14 = 'cohere.command-text-v14',

  /** Base model "cohere.command-light-text-v14". */
  COHERE_COMMAND_LIGHT_V14 = 'cohere.command-light-text-v14',

  /** Base model "cohere.embed-english-v3". */
  COHERE_EMBED_ENGLISH_V3 = 'cohere.embed-english-v3',

  /** Base model "cohere.embed-multilingual-v3". */
  COHERE_EMBED_MULTILINGUAL_V3 = 'cohere.embed-multilingual-v3',

  /** Base model "meta.llama2-13b-chat-v1". */
  META_LLAMA_2_CHAT_13B_V1 = 'meta.llama2-13b-chat-v1',

  /** Base model "meta.llama2-70b-chat-v1". */
  META_LLAMA_2_CHAT_70B_V1 = 'meta.llama2-70b-chat-v1',
}

/**
 * Construction properties of `FoundationModel`.
 * Module-private, as the constructor of `FoundationModel` is private.
 */
interface FoundationModelProps {
  readonly modelId: string;
  readonly modelArn: string;
}

/**
 * A Bedrock base foundation model.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
 */
export class FoundationModel implements IModel {
  /**
   * Construct a Bedrock base foundation model given the model identifier.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
   *
   * @param id The model identifier
   * @example 'amazon.titan-text-express-v1'
   * @returns A Bedrock base foundation model.
   */
  public static fromFoundationModelId(scope: Construct, _id: string, foundationModelId: FoundationModelIdentifier): FoundationModel {
    return new FoundationModel({
      modelId: foundationModelId,
      modelArn: Stack.of(scope).formatArn({
        service: 'bedrock',
        account: '',
        resource: 'foundation-model',
        resourceName: foundationModelId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      }),
    });
  }

  /**
   * The foundation model ID.
   * @example 'amazon.titan-text-express-v1'
   */
  public readonly modelId: string;

  /**
   * The foundation model ARN.
   */
  public readonly modelArn: string;

  private constructor(props: FoundationModelProps) {
    this.modelId = props.modelId;
    this.modelArn = props.modelArn;
  }
}
