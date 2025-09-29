import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";
import { VectorStoreConfig } from "../vector-store-config";
import { VectorStoreType } from "../vector-kb";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

/******************************************************************************
 *                                 Pinecone                                   *
 *****************************************************************************/

export interface PineconeVectorFieldMapping {
  /**
   * Provide the name for the text field that you configured in Pinecone. Bedrock will
   * store raw text from your data  according to the chunking strategy you choose.
   */
  readonly textField: string;
  /**
   * Provide the name of the metadata field that you configured in Pinecone. Bedrock
   * will store metadata that is required to carry out source attribution and enable
   * data ingestion and querying.
   */
  readonly metadataField: string;
}

export interface PineconeVectorStoreConfigProps {
  /**
   * Enter the endpoint URL for your Pinecone index management page.
   * @example "https://name-index-aa12345.svc.asia-southeast1-gcp-free.pinecone.io"
   */
  readonly endpoint: string;
  /**
   * The name of the Pinecone namespace that you want to use for the vector store.
   */
  readonly namespace: string;
  /**
   * The Secrets Manager secret containing the credentials for the Pinecone DB.
   */
  readonly secret: ISecret;
  /**
   * The name of the Pinecone field that you want to use for the vector store.
   */
  readonly fieldMapping: PineconeVectorFieldMapping;
}

/**
 * Pinecone vector store implementation
 */
export class PineconeVectorStoreConfig extends VectorStoreConfig {
  public readonly vectorStoreType = VectorStoreType.PINECONE;
  public readonly secret: ISecret;
  public readonly endpoint: string;
  public readonly namespace: string;
  public readonly fieldMapping: PineconeVectorFieldMapping;

  constructor(config: PineconeVectorStoreConfigProps) {
    super();
    this.secret = config.secret;
    this.endpoint = config.endpoint;
    this.namespace = config.namespace;
    this.fieldMapping = config.fieldMapping;
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.PINECONE,
      pineconeConfiguration: {
        credentialsSecretArn: this.secret.secretArn,
        connectionString: this.endpoint,
        namespace: this.namespace,
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
