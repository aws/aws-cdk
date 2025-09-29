import { IDomain } from "aws-cdk-lib/aws-opensearchservice";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";
import { VectorStoreConfig } from "../vector-store-config";
import { VectorStoreType } from "../vector-kb";

/******************************************************************************
 *                            OpenSearch Managed                              *
 *****************************************************************************/

export interface OpenSearchManagedVectorFieldMapping {
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
 * OpenSearch Managed Cluster vector store properties
 */
export interface OpenSearchManagedVectorStoreConfigProps {
  /**
   * The OpenSearch Managed Cluster Domain.
   */
  readonly domain: IDomain;
  /**
   * The OpenSearch Managed Field Mapping
   */
  readonly fieldMapping: OpenSearchManagedVectorFieldMapping;
  /**
   * The OpenSearch Managed Field Mapping. Provide the name of the vector field
   * that you configured in OpenSearch. Bedrock will store the vector embeddings
   * in this field.
   */
  readonly vectorIndexName: string;
}

/**
 * OpenSearch Managed Cluster vector store implementation
 */
export class OpenSearchManagedVectorStoreConfig extends VectorStoreConfig {
  public readonly vectorStoreType = VectorStoreType.OPENSEARCH_MANAGED_CLUSTER;
  public readonly domain: IDomain;
  public readonly fieldMapping: OpenSearchManagedVectorFieldMapping;
  public readonly vectorIndexName: string;

  constructor(props: OpenSearchManagedVectorStoreConfigProps) {
    super();
    this.domain = props.domain;
    this.fieldMapping = props.fieldMapping;
    this.vectorIndexName = props.vectorIndexName;
  }

  /**
   * Associates an existing OpenSearch Managed Cluster vector store from domain configuration
   */
  public static fromConfig(
    config: OpenSearchManagedVectorStoreConfigProps
  ): OpenSearchManagedVectorStoreConfig {
    return new OpenSearchManagedVectorStoreConfig(config);
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.OPENSEARCH_MANAGED_CLUSTER,
      opensearchManagedClusterConfiguration: {
        domainArn: this.domain.domainArn,
        domainEndpoint: this.domain.domainEndpoint,
        fieldMapping: this.fieldMapping,
        vectorIndexName: this.vectorIndexName,
      },
    };
  }

  public _grantStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: ["es:DescribeDomain"],
        resources: [this.domain.domainArn],
      }),
    ];
  }
}
