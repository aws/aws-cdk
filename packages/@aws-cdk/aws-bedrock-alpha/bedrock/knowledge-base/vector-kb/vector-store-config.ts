import { VectorStoreType } from "./vector-kb";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";
import { OpenSearchManagedVectorStoreConfig } from "./vectore-store-config/opensearch-provisioned-vs";
import { PineconeVectorStoreConfig } from "./vectore-store-config/pinecone-vs";
import { AuroraVectorStoreConfig } from "./vectore-store-config/aurora-config";
import { MongoDbAtlasVectorStoreConfig } from "./vectore-store-config/mongo-config";
import { NeptuneAnalyticsVectorStoreConfig } from "./vectore-store-config/neptune-config";
import { OpenSearchServerlessVectorStoreConfig } from "./vectore-store-config/opensearch-serverless-vs";

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
/**
 * Abstract base class for vector stores. Cannot be instantiated directly.
 * Use one of the concrete vector store classes instead:
 * - {@link OpenSearchManagedVectorStoreConfig}
 * - {@link OpenSearchServerlessVectorStoreConfig}
 * - {@link PineconeVectorStoreConfig}
 * - {@link AuroraVectorStoreConfig}
 * - {@link MongoDbAtlasVectorStoreConfig}
 * - {@link NeptuneAnalyticsVectorStoreConfig}
 */
export abstract class VectorStoreConfig {
  /**
   * Creates a vector store instance based on the specified type
   */
  public static create(type: VectorStoreType, config: any): VectorStoreConfig {
    switch (type) {
      case VectorStoreType.OPENSEARCH_MANAGED_CLUSTER:
        return new OpenSearchManagedVectorStoreConfig(config);
      case VectorStoreType.OPENSEARCH_SERVERLESS:
        return new OpenSearchServerlessVectorStoreConfig(config);
      case VectorStoreType.PINECONE:
        return new PineconeVectorStoreConfig(config);
      case VectorStoreType.AMAZON_AURORA:
        return new AuroraVectorStoreConfig(config);
      case VectorStoreType.MONGO_DB_ATLAS:
        return new MongoDbAtlasVectorStoreConfig(config);
      case VectorStoreType.NEPTUNE_ANALYTICS:
        return new NeptuneAnalyticsVectorStoreConfig(config);
      default:
        throw new Error(`Unsupported vector store type: ${type}`);
    }
  }

  /**
   * The vector store type
   */
  public abstract readonly vectorStoreType: VectorStoreType;
  /**
   * Returns the Bedrock storage configuration property for this vector store.
   * @internal
   */
  public abstract _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty;
  /**
   * Returns the IAM statements to add to the KnowledgeBase role
   * @internal
   */
  public abstract _grantStatements(): iam.PolicyStatement[];
}
