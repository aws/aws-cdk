import { Construct } from 'constructs';
import { IModel } from './model-base';
import { ArnFormat, Stack } from '../../core';

/**
 * The model identifiers for the Bedrock base foundation models.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html
 */
export class FoundationModelIdentifier {
  /** Base model "amazon.titan-tg1-large". */
  public static readonly AMAZON_TITAN_TG1_LARGE = new FoundationModelIdentifier('amazon.titan-tg1-large');

  /** Base model "amazon.titan-text-lite-v1". */
  public static readonly AMAZON_TITAN_TEXT_LITE_V1 = new FoundationModelIdentifier('amazon.titan-text-lite-v1');

  /** Base model "amazon.titan-text-lite-v1:0:4k". */
  public static readonly AMAZON_TITAN_TEXT_LITE_V1_0_4K = new FoundationModelIdentifier('amazon.titan-text-lite-v1:0:4k');

  /** Base model "amazon.titan-text-express-v1:0:8k". */
  public static readonly AMAZON_TITAN_TEXT_EXPRESS_V1_0_8K = new FoundationModelIdentifier('amazon.titan-text-express-v1:0:8k');

  /** Base model "amazon.titan-text-express-v1". */
  public static readonly AMAZON_TITAN_TEXT_G1_EXPRESS_V1 = new FoundationModelIdentifier('amazon.titan-text-express-v1');

  /** Base model "amazon.titan-text-lite-v1". */
  public static readonly AMAZON_TITAN_TEXT_G1_LITE_V1 = new FoundationModelIdentifier('amazon.titan-text-lite-v1');

  /** Base model "amazon.titan-text-premier-v1:0". */
  public static readonly AMAZON_TITAN_TEXT_PREMIER_V1 = new FoundationModelIdentifier('amazon.titan-text-premier-v1:0');

  /** Base model "amazon.titan-embed-text-v1". */
  public static readonly AMAZON_TITAN_EMBEDDINGS_G1_TEXT_V1 = new FoundationModelIdentifier('amazon.titan-embed-text-v1');

  /** Base model "amazon.titan-embed-text-v1:2:8k". */
  public static readonly AMAZON_TITAN_EMBED_TEXT_V1_2_8K = new FoundationModelIdentifier('amazon.titan-embed-text-v1:2:8k');

  /** Base model "amazon.titan-embed-g1-text-02". */
  public static readonly AMAZON_TITAN_EMBED_G1_TEXT_02 = new FoundationModelIdentifier('amazon.titan-embed-g1-text-02');

  /** Base model "amazon.titan-embed-text-v2:0". */
  public static readonly AMAZON_TITAN_EMBED_TEXT_V2_0 = new FoundationModelIdentifier('amazon.titan-embed-text-v2:0');

  /** Base model "amazon.titan-image-generator-v1". */
  public static readonly AMAZON_TITAN_IMAGE_GENERATOR_G1_V1 = new FoundationModelIdentifier('amazon.titan-image-generator-v1');

  /** Base model "amazon.titan-image-generator-v1:0". */
  public static readonly AMAZON_TITAN_IMAGE_GENERATOR_V1_0 = new FoundationModelIdentifier('amazon.titan-image-generator-v1:0');

  /** Base model "amazon.titan-embed-image-v1:0". */
  public static readonly AMAZON_TITAN_EMBED_IMAGE_V1_0 = new FoundationModelIdentifier('amazon.titan-embed-image-v1:0');

  /** Base model "amazon.titan-embed-image-v1". */
  public static readonly AMAZON_TITAN_MULTIMODAL_EMBEDDINGS_G1_V1 = new FoundationModelIdentifier('amazon.titan-embed-image-v1');

  /** Base model "ai21.j2-mid". */
  public static readonly AI21_J2_MID = new FoundationModelIdentifier('ai21.j2-mid');

  /** Base model "ai21.j2-mid-v1". */
  public static readonly AI21_LABS_JURASSIC_2_MID_V1 = new FoundationModelIdentifier('ai21.j2-mid-v1');

  /** Base model "ai21.j2-ultra". */
  public static readonly AI21_J2_ULTRA = new FoundationModelIdentifier('ai21.j2-ultra');

  /** Base model "ai21.j2-ultra-v1". */
  public static readonly AI21_LABS_JURASSIC_2_ULTRA_V1 = new FoundationModelIdentifier('ai21.j2-ultra-v1');

  /** Base model "ai21.j2-grande-instruct". */
  public static readonly AI21_J2_GRANDE_INSTRUCT = new FoundationModelIdentifier('ai21.j2-grande-instruct');

  /** Base model "ai21.j2-jumbo-instruct". */
  public static readonly AI21_J2_JUMBO_INSTRUCT = new FoundationModelIdentifier('ai21.j2-jumbo-instruct');

  /**
   * Base model "anthropic.claude-v1".
   * @deprecated use latest version of the model
   **/
  public static readonly ANTHROPIC_CLAUDE_V1 = new FoundationModelIdentifier('anthropic.claude-v1');

  /** Base model "anthropic.claude-v2". */
  public static readonly ANTHROPIC_CLAUDE_V2 = new FoundationModelIdentifier('anthropic.claude-v2');

  /** Base model "anthropic.claude-v2:0:18k". */
  public static readonly ANTHROPIC_CLAUDE_V2_0_18K = new FoundationModelIdentifier('anthropic.claude-v2:0:18k');

  /** Base model "anthropic.claude-v2:0:100k". */
  public static readonly ANTHROPIC_CLAUDE_V2_0_100K = new FoundationModelIdentifier('anthropic.claude-v2:0:100k');

  /** Base model "anthropic.claude-v2:1". */
  public static readonly ANTHROPIC_CLAUDE_V2_1 = new FoundationModelIdentifier('anthropic.claude-v2:1');

  /** Base model "anthropic.claude-v2:1:18k". */
  public static readonly ANTHROPIC_CLAUDE_V2_1_18K = new FoundationModelIdentifier('anthropic.claude-v2:1:18k');

  /** Base model "anthropic.claude-v2:1:200k". */
  public static readonly ANTHROPIC_CLAUDE_V2_1_200K = new FoundationModelIdentifier('anthropic.claude-v2:1:200k');

  /** Base model "anthropic.claude-3-sonnet-20240229-v1:0". */
  public static readonly ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0 = new FoundationModelIdentifier('anthropic.claude-3-sonnet-20240229-v1:0');

  /** Base model "anthropic.claude-3-sonnet-20240229-v1:0:28k" */
  public static readonly ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0_28K = new FoundationModelIdentifier('anthropic.claude-3-sonnet-20240229-v1:0:28k');

  /** Base model "anthropic.claude-3-sonnet-20240229-v1:0:200k" */
  public static readonly ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0_200K = new FoundationModelIdentifier('anthropic.claude-3-sonnet-20240229-v1:0:200k');

  /** Base model "anthropic.claude-3-haiku-20240307-v1:0". */
  public static readonly ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0 = new FoundationModelIdentifier('anthropic.claude-3-haiku-20240307-v1:0');

  /** Base model "anthropic.claude-3-haiku-20240307-v1:0:48k" */
  public static readonly ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0_48K = new FoundationModelIdentifier('anthropic.claude-3-haiku-20240307-v1:0:48k');

  /** Base model "anthropic.claude-3-haiku-20240307-v1:0:200k" */
  public static readonly ANTHROPIC_CLAUDE_3_HAIKU_20240307_V1_0_200K = new FoundationModelIdentifier('anthropic.claude-3-haiku-20240307-v1:0:200k');

  /** Base model "anthropic.claude-3-opus-20240229-v1:0" */
  public static readonly ANTHROPIC_CLAUDE_3_OPUS_20240229_V1_0 = new FoundationModelIdentifier('anthropic.claude-3-opus-20240229-v1:0');

  /** Base model "anthropic.claude-instant-v1". */
  public static readonly ANTHROPIC_CLAUDE_INSTANT_V1 = new FoundationModelIdentifier('anthropic.claude-instant-v1');

  /** Base model "anthropic.claude-instant-v1:2:100k". */
  public static readonly ANTHROPIC_CLAUDE_INSTANT_V1_2_100K = new FoundationModelIdentifier('anthropic.claude-instant-v1:2:100k');

  /** Base model "cohere.command-text-v14". */
  public static readonly COHERE_COMMAND_V14 = new FoundationModelIdentifier('cohere.command-text-v14');

  /** Base model "cohere.command-light-text-v14". */
  public static readonly COHERE_COMMAND_LIGHT_V14 = new FoundationModelIdentifier('cohere.command-light-text-v14');

  /** Base model "cohere.command-text-v14:7:4k". */
  public static readonly COHERE_COMMAND_TEXT_V14_7_4K = new FoundationModelIdentifier('cohere.command-text-v14:7:4k');

  /** Base model "cohere.command-light-text-v14:7:4k". */
  public static readonly COHERE_COMMAND_LIGHT_TEXT_V14_7_4K = new FoundationModelIdentifier('cohere.command-light-text-v14:7:4k');

  /** Base model "cohere.command-r-v1:0". */
  public static readonly COHERE_COMMAND_R_V1 = new FoundationModelIdentifier('ccohere.command-r-v1:0');

  /** Base model "cohere.command-r-v1:0". */
  public static readonly COHERE_COMMAND_R_PLUS_V1 = new FoundationModelIdentifier('cohere.command-r-plus-v1:0');

  /** Base model "cohere.embed-english-v3". */
  public static readonly COHERE_EMBED_ENGLISH_V3 = new FoundationModelIdentifier('cohere.embed-english-v3');

  /** Base model "cohere.embed-multilingual-v3". */
  public static readonly COHERE_EMBED_MULTILINGUAL_V3 = new FoundationModelIdentifier('cohere.embed-multilingual-v3');

  /** Base model "meta.llama2-13b-v1". */
  public static readonly META_LLAMA_2_13B_V1 = new FoundationModelIdentifier('meta.llama2-13b-v1');

  /** Base model "meta.llama2-13b-v1:0:4k". */
  public static readonly META_LLAMA_2_13B_V1_0_4K = new FoundationModelIdentifier('meta.llama2-13b-v1:0:4k');

  /** Base model "meta.llama2-13b-chat-v1:0:4k". */
  public static readonly META_LLAMA_2_13B_CHAT_V1_0_4K = new FoundationModelIdentifier('meta.llama2-13b-chat-v1:0:4k');

  /** Base model "meta.llama2-70b-v1". */
  public static readonly META_LLAMA_2_70B_V1 = new FoundationModelIdentifier('meta.llama2-70b-v1');

  /** Base model "meta.llama2-70b-v1:0:4k". */
  public static readonly META_LLAMA_2_70B_V1_0_4K = new FoundationModelIdentifier('meta.llama2-70b-v1:0:4k');

  /** Base model "meta.llama2-13b-chat-v1". */
  public static readonly META_LLAMA_2_CHAT_13B_V1 = new FoundationModelIdentifier('meta.llama2-13b-chat-v1');

  /** Base model "meta.llama2-70b-chat-v1". */
  public static readonly META_LLAMA_2_CHAT_70B_V1 = new FoundationModelIdentifier('meta.llama2-70b-chat-v1');

  /** Base model "meta.llama2-70b-chat-v1:0:4k". */
  public static readonly META_LLAMA_2_70B_CHAT_V1_0_4K = new FoundationModelIdentifier('meta.llama2-70b-chat-v1:0:4k');

  /** Base model "meta.llama3-8b-instruct-v1:0". */
  public static readonly META_LLAMA_3_8B_INSTRUCT_V1 = new FoundationModelIdentifier('meta.llama3-8b-instruct-v1:0');

  /** Base model "meta.llama3-70b-instruct-v1:0". */
  public static readonly META_LLAMA_3_70_INSTRUCT_V1 = new FoundationModelIdentifier('meta.llama3-70b-instruct-v1:0');

  /** Base model "mistral.mistral-7b-instruct-v0:2". */
  public static readonly MISTRAL_MISTRAL_7B_INSTRUCT_V0_2 = new FoundationModelIdentifier('mistral.mistral-7b-instruct-v0:2');

  /** Base model "mistral.mixtral-8x7b-instruct-v0:1". */
  public static readonly MISTRAL_MIXTRAL_8X7B_INSTRUCT_V0_1 = new FoundationModelIdentifier('mistral.mixtral-8x7b-instruct-v0:1');

  /** Base model "mistral.mistral-large-2402-v1:0". */
  public static readonly MISTRAL_LARGE_V0_1 = new FoundationModelIdentifier('mistral.mistral-large-2402-v1:0');

  /**
   * Base model "stability.stable-diffusion-xl".
   * @deprecated use latest version of the model
   **/
  public static readonly STABILITY_STABLE_DIFFUSION_XL = new FoundationModelIdentifier('stability.stable-diffusion-xl');

  /**
   *  Base model "stability.stable-diffusion-xl-v0".
   * @deprecated use latest version of the model
   */
  public static readonly STABILITY_STABLE_DIFFUSION_XL_V0 = new FoundationModelIdentifier('stability.stable-diffusion-xl-v0');

  /** Base model "stability.stable-diffusion-xl-v1". */
  public static readonly STABILITY_STABLE_DIFFUSION_XL_V1 = new FoundationModelIdentifier('stability.stable-diffusion-xl-v1');

  /** Base model "stability.stable-diffusion-xl-v1:0". */
  public static readonly STABILITY_STABLE_DIFFUSION_XL_V1_0 = new FoundationModelIdentifier('stability.stable-diffusion-xl-v1:0');

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
