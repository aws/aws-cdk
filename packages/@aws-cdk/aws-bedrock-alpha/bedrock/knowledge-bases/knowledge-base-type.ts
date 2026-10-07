import type * as s3 from 'aws-cdk-lib/aws-s3';
import type { IMixin } from 'constructs';
import { VECTOR_KNOWLEDGE_BASE_TYPE } from './private/knowledge-base-helpers';
import type { VectorStore } from './vector-store';
import { KnowledgeBaseEmbeddingsModel, KnowledgeBaseSupplementalDataStorage } from '../mixins/knowledge-base';
import type { BedrockFoundationModel, VectorType } from '../models';

/**
 * Properties for a vector knowledge base.
 */
export interface VectorKnowledgeBaseTypeProps {
  /**
   * The model used to create vector embeddings for the knowledge base.
   */
  readonly embeddingsModel: BedrockFoundationModel;

  /**
   * The vector store in which the embeddings are stored and searched.
   */
  readonly vectorStore: VectorStore;

  /**
   * The data type of the vector embeddings.
   *
   * @default VectorType.FLOATING_POINT
   */
  readonly vectorType?: VectorType;

  /**
   * The Amazon S3 bucket in which multimedia content extracted from
   * multimodal documents (images, audio, video) is stored.
   *
   * Required when the knowledge base ingests multimodal content.
   *
   * @default - no supplemental data storage; only text content is ingested
   */
  readonly supplementalDataStorageBucket?: s3.IBucketRef;
}

/**
 * The type of a knowledge base, which determines how its data is stored and queried.
 *
 * Use one of the static factory methods to configure a type.
 */
export class KnowledgeBaseType {
  /**
   * A knowledge base that stores vector embeddings of ingested documents in a
   * vector store and retrieves them by similarity search.
   */
  public static vector(props: VectorKnowledgeBaseTypeProps): KnowledgeBaseType {
    const mixins: IMixin[] = [
      new KnowledgeBaseEmbeddingsModel({ embeddingsModel: props.embeddingsModel, vectorType: props.vectorType }),
      props.vectorStore._mixin,
    ];
    if (props.supplementalDataStorageBucket !== undefined) {
      mixins.push(new KnowledgeBaseSupplementalDataStorage({ bucket: props.supplementalDataStorageBucket }));
    }
    return new KnowledgeBaseType(VECTOR_KNOWLEDGE_BASE_TYPE, mixins);
  }

  /**
   * The mixins that configure a knowledge base of this type.
   *
   * @internal
   */
  public readonly _mixins: IMixin[];

  /**
   * The value of `KnowledgeBaseConfiguration.Type`.
   *
   * @internal
   */
  public readonly _typeName: string;

  private constructor(typeName: string, mixins: IMixin[]) {
    this._typeName = typeName;
    this._mixins = mixins;
  }
}
