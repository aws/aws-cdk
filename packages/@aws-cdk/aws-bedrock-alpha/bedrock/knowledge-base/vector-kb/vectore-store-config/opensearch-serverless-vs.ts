import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";
import { VectorStoreConfig } from "../vector-store-config";
import { VectorStoreType } from "../vector-kb";

/******************************************************************************
 *                           OpenSearch Serverless                            *
 *****************************************************************************/

export interface OpenSearchServerlessVectorFieldMapping {
  /**
   * The name of the OpenSearch Serverless field that you want to use for the vector store.
   */
  readonly vectorField: string;
  /**
   * The name of the OpenSearch Serverless field that you want to use for the vector store.
   */
  readonly textField: string;
  /**
   * The name of the OpenSearch Serverless field that you want to use for the vector store.
   */
  readonly metadataField: string;
}

export interface OpenSearchServerlessVectorStoreConfigProps {
  /**
   * The name of the OpenSearch Serverless collection that you want to use for the vector store.
   */
  readonly collectionArn: string;
  /**
   * The name of the OpenSearch Serverless field that you want to use for the vector store.
   */
  readonly fieldMapping?: OpenSearchServerlessVectorFieldMapping;
  /**
   * The name of the OpenSearch Serverless index that you want to use for the vector store.
   */
  readonly vectorIndexName: string;
}

/**
 * OpenSearch Serverless vector store implementation
 */
export class OpenSearchServerlessVectorStoreConfig extends VectorStoreConfig {
  public readonly vectorStoreType = VectorStoreType.OPENSEARCH_SERVERLESS;
  public readonly fieldMapping: OpenSearchServerlessVectorFieldMapping;
  public readonly vectorIndexName: string;
  public readonly collectionArn: string;

  constructor(props: OpenSearchServerlessVectorStoreConfigProps) {
    super();
    this.fieldMapping = props.fieldMapping ?? {
      textField: "AMAZON_BEDROCK_TEXT_CHUNK",
      metadataField: "AMAZON_BEDROCK_TEXT_CHUNK",
      vectorField: "bedrock-knowledge-base-default-vector",
    };
    this.vectorIndexName = props.vectorIndexName;
    this.collectionArn = props.collectionArn;
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.OPENSEARCH_SERVERLESS,
      opensearchServerlessConfiguration: {
        collectionArn: this.collectionArn,
        fieldMapping: this.fieldMapping,
        vectorIndexName: this.vectorIndexName,
      },
    };
  }

  public _grantStatements(): iam.PolicyStatement[] {
    return [];
  }
}
