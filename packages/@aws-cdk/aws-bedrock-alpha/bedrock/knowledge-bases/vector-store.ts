import type * as bedrock from 'aws-cdk-lib/aws-bedrock';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';
import { KnowledgeBaseOpenSearchServerlessStorage } from '../mixins/knowledge-base';

/**
 * Properties for an Amazon OpenSearch Serverless vector store.
 *
 * The collection and its vector index must already exist. Amazon Bedrock
 * validates at creation time that the index exists in the collection and
 * that its vector field matches the embeddings model. Specify the field
 * names exactly as they are defined in the index.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-setup-oss.html
 */
export interface OpenSearchServerlessVectorStoreProps {
  /**
   * The OpenSearch Serverless collection that contains the vector index.
   */
  readonly collection: opensearchserverless.ICollectionRef;

  /**
   * The name of the vector index in the collection.
   */
  readonly vectorIndexName: string;

  /**
   * The name of the index field that stores the vector embeddings.
   */
  readonly vectorField: string;

  /**
   * The name of the index field that stores the raw text of each chunk.
   */
  readonly textField: string;

  /**
   * The name of the index field that stores the metadata of each chunk.
   */
  readonly metadataField: string;
}

/**
 * The vector store that backs a vector knowledge base.
 *
 * Use one of the static factory methods to reference an existing store.
 */
export abstract class VectorStore {
  /**
   * An existing vector index in an Amazon OpenSearch Serverless collection.
   */
  public static openSearchServerless(props: OpenSearchServerlessVectorStoreProps): VectorStore {
    return new OpenSearchServerlessVectorStore(props);
  }

  protected constructor() {}

  /**
   * Configures the knowledge base to use this vector store and grants the
   * service role the permissions it needs to access the store.
   *
   * @internal
   */
  public abstract _bind(knowledgeBase: bedrock.CfnKnowledgeBase, role: iam.IRoleRef & iam.IGrantable): void;
}

class OpenSearchServerlessVectorStore extends VectorStore {
  constructor(private readonly props: OpenSearchServerlessVectorStoreProps) {
    super();
  }

  public _bind(knowledgeBase: bedrock.CfnKnowledgeBase, role: iam.IRoleRef & iam.IGrantable): void {
    knowledgeBase.with(new KnowledgeBaseOpenSearchServerlessStorage({ ...this.props, role }));
  }
}
