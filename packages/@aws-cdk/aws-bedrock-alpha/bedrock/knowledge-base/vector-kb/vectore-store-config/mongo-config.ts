import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";
import { VectorStoreConfig } from "../vector-store-config";
import { VectorStoreType } from "../vector-kb";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

/******************************************************************************
 *                                 MongoDB                                    *
 *****************************************************************************/
/**
 * Field mapping configuration for MongoDB Atlas vector store.
 *
 * These field mappings define how Amazon Bedrock stores different types of data
 * in your MongoDB Atlas collection when creating a knowledge base.
 */
export interface MongoDbAtlasVectorFieldMapping {
  /**
   * The name of the field in which Amazon Bedrock stores the raw text from your data.
   * The text is split according to the chunking strategy you choose.
   */
  readonly textField: string;
  /**
   * The name of the field in which Amazon Bedrock stores metadata about the vector store.
   */
  readonly metadataField: string;
  /**
   * The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.
   */
  readonly vectorField: string;
}

/**
 * Configuration properties for MongoDB Atlas vector store.
 *
 * When setting up the vector store, you must gather the following information
 * from your MongoDB Atlas cluster to create a knowledge base:
 *
 * @example
 * ```typescript
 * const mongoConfig: MongoDbAtlas = {
 *   endpoint: 'cluster0.abcd.mongodb.net',
 *   databaseName: 'my-knowledge-db',
 *   collectionName: 'documents',
 *   vectorIndexName: 'vector_index',
 *   secret: mySecret,
 *   fieldMapping: {
 *     textField: 'text',
 *     vectorField: 'text_embedding',
 *     metadataField: 'metadata'
 *   }
 * };
 * ```
 */
export interface MongoDbAtlasVectorStoreConfigProps {
  /**
   * The endpoint URL of your MongoDB Atlas cluster.
   *
   * This is the connection endpoint for your MongoDB Atlas cluster that Amazon Bedrock
   * will use to connect to your vector store.
   *
   * @example "cluster0.abcd.mongodb.net"
   */
  readonly endpoint: string;
  /**
   * The name of the database in your MongoDB Atlas cluster.
   *
   * This database will contain the collection used for storing your knowledge base data.
   */
  readonly databaseName: string;
  /**
   * The name of the collection in your database.
   *
   * This collection will store the vector embeddings, text chunks, and metadata
   * for your knowledge base documents.
   */
  readonly collectionName: string;
  /**
   * The name of the MongoDB Atlas Vector Search Index on your collection.
   *
   * This index enables vector similarity search capabilities for your knowledge base.
   * You must create this index in MongoDB Atlas before using it with Amazon Bedrock.
   */
  readonly vectorIndexName: string;
  /**
   * The Amazon Resource Name (ARN) of the secret in AWS Secrets Manager.
   *
   * The secret must contain the username and password for a database user in your
   * MongoDB Atlas cluster. The secret must contain keys named 'username' and 'password'.
   *
   * If you encrypted your credentials secret with a customer-managed KMS key,
   * ensure Amazon Bedrock has permission to decrypt it.
   */
  readonly secret: ISecret;
  /**
   * The name of the MongoDB Atlas Search index on your collection.
   *
   * This is optional and used for hybrid search capabilities, combining vector
   * similarity search with traditional text search.
   */
  readonly textIndexName?: string;
  /**
   * The name of the VPC endpoint service connected to your MongoDB Atlas cluster.
   *
   * Use this when your MongoDB Atlas cluster is accessed through a VPC endpoint
   * for enhanced security and network isolation.
   */
  readonly endpointService?: string;
  /**
   * Field mapping configuration that defines how Amazon Bedrock stores data.
   *
   * These mappings specify which fields in your MongoDB collection will store
   * vector embeddings, raw text, and metadata.
   */
  readonly fieldMapping: MongoDbAtlasVectorFieldMapping;
}

/**
 * MongoDB Atlas vector store configuration for Amazon Bedrock Knowledge Base.
 *
 * This class configures a MongoDB Atlas cluster as a vector store for your knowledge base.
 * It handles the connection configuration, field mappings, and IAM permissions required
 * for Amazon Bedrock to interact with your MongoDB Atlas vector store.
 *
 * The vector store will be used to store and retrieve vector embeddings generated from
 * your knowledge base documents, enabling semantic search capabilities.
 *
 * @example
 * ```typescript
 * const secret = Secret.fromSecretArn(this, 'MongoSecret', 'arn:aws:secretsmanager:...');
 *
 * const vectorStore = new MongoDbAtlasVectorStoreConfig({
 *   endpoint: 'cluster0.abcd.mongodb.net',
 *   databaseName: 'knowledge-base',
 *   collectionName: 'documents',
 *   vectorIndexName: 'vector_index',
 *   secret: secret,
 *   fieldMapping: {
 *     textField: 'text',
 *     vectorField: 'text_embedding',
 *     metadataField: 'metadata'
 *   }
 * });
 * ```
 */
export class MongoDbAtlasVectorStoreConfig extends VectorStoreConfig {
  public readonly vectorStoreType = VectorStoreType.MONGO_DB_ATLAS;
  public readonly secret: ISecret;
  public readonly endpoint: string;
  public readonly databaseName: string;
  public readonly collectionName: string;
  public readonly vectorIndexName: string;
  public readonly textIndexName?: string;
  public readonly endpointService?: string;
  public readonly fieldMapping: MongoDbAtlasVectorFieldMapping;

  constructor(config: MongoDbAtlasVectorStoreConfigProps) {
    super();
    this.secret = config.secret;
    this.endpoint = config.endpoint;
    this.databaseName = config.databaseName;
    this.collectionName = config.collectionName;
    this.vectorIndexName = config.vectorIndexName;
    this.textIndexName = config.textIndexName;
    this.endpointService = config.endpointService;
    this.fieldMapping = config.fieldMapping;
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.MONGO_DB_ATLAS,
      mongoDbAtlasConfiguration: {
        credentialsSecretArn: this.secret.secretArn,
        endpoint: this.endpoint,
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        vectorIndexName: this.vectorIndexName,
        textIndexName: this.textIndexName,
        endpointServiceName: this.endpointService,
        fieldMapping: this.fieldMapping,
      },
    };
  }

  public _grantStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [this.secret.secretArn],
      }),
    ];
  }
}
