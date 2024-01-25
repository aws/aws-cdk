import { Construct } from 'constructs';
import { IModel } from './model-base';
import { ArnFormat, Stack } from '../../core';

/**
 * The model identifiers for the Bedrock base foundation models.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
 */
export class FoundationModelIdentifier {
  /** Base model "ai21.j2-mid-v1". */
  public static readonly AI21_LABS_JURASSIC_2_MID_V1 = new FoundationModelIdentifier('ai21.j2-mid-v1');

  /** Base model "ai21.j2-ultra-v1". */
  public static readonly AI21_LABS_JURASSIC_2_ULTRA_V1 = new FoundationModelIdentifier('ai21.j2-ultra-v1');

  /** Base model "amazon.titan-embed-text-v1". */
  public static readonly AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1 = new FoundationModelIdentifier('amazon.titan-embed-text-v1');

  /** Base model "amazon.titan-text-express-v1". */
  public static readonly AMAZON_TITAN_TEXT_G1_EXPRESS_V1 = new FoundationModelIdentifier('amazon.titan-text-express-v1');

  /** Base model "amazon.titan-embed-image-v1". */
  public static readonly AMAZON_TITAN_MULTIMODAL_EMBEDDINGS_G1_V1 = new FoundationModelIdentifier('amazon.titan-embed-image-v1');

  /** Base model "amazon.titan-image-generator-v1". */
  public static readonly AMAZON_TITAN_IMAGE_GENERATOR_G1_V1 = new FoundationModelIdentifier('amazon.titan-image-generator-v1');

  /** Base model "anthropic.claude-v1". */
  public static readonly ANTHROPIC_CLAUDE_V1 = new FoundationModelIdentifier('anthropic.claude-v1');

  /** Base model "anthropic.claude-v2". */
  public static readonly ANTHROPIC_CLAUDE_V2 = new FoundationModelIdentifier('anthropic.claude-v2');

  /** Base model "anthropic.claude-v2:1". */
  public static readonly ANTHROPIC_CLAUDE_V2_1 = new FoundationModelIdentifier('anthropic.claude-v2:1');

  /** Base model "anthropic.claude-instant-v1". */
  public static readonly ANTHROPIC_CLAUDE_INSTANT_V1 = new FoundationModelIdentifier('anthropic.claude-instant-v1');

  /** Base model "cohere.command-text-v14". */
  public static readonly COHERE_COMMAND_V14 = new FoundationModelIdentifier('cohere.command-text-v14');

  /** Base model "cohere.command-light-text-v14". */
  public static readonly COHERE_COMMAND_LIGHT_V14 = new FoundationModelIdentifier('cohere.command-light-text-v14');

  /** Base model "cohere.embed-english-v3". */
  public static readonly COHERE_EMBED_ENGLISH_V3 = new FoundationModelIdentifier('cohere.embed-english-v3');

  /** Base model "cohere.embed-multilingual-v3". */
  public static readonly COHERE_EMBED_MULTILINGUAL_V3 = new FoundationModelIdentifier('cohere.embed-multilingual-v3');

  /** Base model "meta.llama2-13b-chat-v1". */
  public static readonly META_LLAMA_2_CHAT_13B_V1 = new FoundationModelIdentifier('meta.llama2-13b-chat-v1');

  /** Base model "meta.llama2-70b-chat-v1". */
  public static readonly META_LLAMA_2_CHAT_70B_V1 = new FoundationModelIdentifier('meta.llama2-70b-chat-v1');

  /**
   * Constructor for foundation model identifier
   * @param modelId the model identifier
   */
  public constructor(public readonly modelId: string) { }
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
   * @param scope The parent construct
   * @param _id The name of the model construct
   * @param foundationModelId The model identifier such as 'amazon.titan-text-express-v1'
   * @returns A Bedrock base foundation model.
   */
  public static fromFoundationModelId(scope: Construct, _id: string, foundationModelId: FoundationModelIdentifier): FoundationModel {
    return new FoundationModel({
      modelId: foundationModelId.modelId,
      modelArn: Stack.of(scope).formatArn({
        service: 'bedrock',
        account: '',
        resource: 'foundation-model',
        resourceName: foundationModelId.modelId,
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
