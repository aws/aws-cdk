/******************************************************************************
 *                                  ENUMS
 *****************************************************************************/

import { BedrockFoundationModel, VectorType } from "../../models";
import { IKnowledgeBase, KnowledgeBaseType } from "../knowledge-base";
import { KnowledgeBaseBase } from "../knowledge-base-base";

/******************************************************************************
 *                                 ENUMS                                      *
 *****************************************************************************/
/**
 * Vector knowledge base can be backed by different vector databases.
 * This enum represents the different vector databases that can be used.
 */
export enum VectorStoreType {
  /**
   * `OPENSEARCH_SERVERLESS` is the vector store for OpenSearch Serverless.
   */
  OPENSEARCH_SERVERLESS = "OPENSEARCH_SERVERLESS",
  /**
   * `OPENSEARCH_MANAGED_CLUSTER` is the vector store for OpenSearch Managed Cluster.
   */
  OPENSEARCH_MANAGED_CLUSTER = "OPENSEARCH_MANAGED_CLUSTER",
  /**
   * `PINECONE` is the vector store for Pinecone.
   */
  PINECONE = "PINECONE",
  /**
   * `RDS` is the vector store for Amazon RDS and Amazon Aurora.
   */
  AMAZON_AURORA = "RDS",
  /**
   * `MONGO_DB_ATLAS` is the vector store for MongoDB Atlas.
   */
  MONGO_DB_ATLAS = "MONGO_DB_ATLAS",
  /**
   * `NEPTUNE_ANALYTICS` is the vector store for Amazon Neptune Analytics.
   */
  NEPTUNE_ANALYTICS = "NEPTUNE_ANALYTICS",
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
/**
 * Interface for a Vector Knowledge Base, adds extra attributes to common.
 */
export interface IVectorKnowledgeBase extends IKnowledgeBase {
  /**
   * The type of query engine.
   */
  readonly vectorStoreType: VectorStoreType;
  /**
   * The embedding model used by the vector store
   */
  readonly embeddingModel: BedrockFoundationModel;
}

/**
 * Base Class for a Vector Knowledge Base, add extra methods to common
 */
export abstract class VectorKnowledgeBaseBase
  extends KnowledgeBaseBase
  implements IVectorKnowledgeBase
{
  /**
   * The type of knowledge base.
   */
  readonly knowledgeBaseType: KnowledgeBaseType = KnowledgeBaseType.VECTOR;
  /**
   * The type of query engine.
   */
  abstract readonly vectorStoreType: VectorStoreType;
  /**
   * The embedding model used by the vector store
   */
  abstract readonly embeddingModel: BedrockFoundationModel;
  /**
   * The embedding vector type used while storing vector embeddings.
   */
  abstract readonly embeddingVectorType?: VectorType;
}
