/******************************************************************************
 *                                 Neptune                                   *
 *****************************************************************************/

import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { VectorStoreType } from "../vector-kb";
import { VectorStoreConfig } from "../vector-store-config";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";

export interface NeptuneFieldMapping {
  /**
   * Provide the name for the text field that you configured in Neptune Analytics.
   * Bedrock will store raw text from your data in chunks in this field
   */
  readonly textField: string;
  /**
   * Provide a name for the field where Bedrock will store metadata that is required
   * to carry out source attribution and enable data ingestion and query.
   */
  readonly metadataField: string;
}

export interface NeptuneAnalyticsVectorStoreConfigProps {
  /**
   * Specify the ARN of your Amazon Neptune Analytics Graph
   */
  readonly graphArn: string;
  /**
   * The Secrets Manager secret containing the credentials for the Pinecone DB.
   */
  readonly secret: ISecret;
  /**
   * The name of the Neptune fields that you want to use for the vector store.
   */
  readonly fieldMapping: NeptuneFieldMapping;
}

/**
 * Pinecone vector store implementation
 */
export class NeptuneAnalyticsVectorStoreConfig extends VectorStoreConfig {
  public readonly vectorStoreType = VectorStoreType.NEPTUNE_ANALYTICS;
  public readonly graphArn: string;
  public readonly fieldMapping: NeptuneFieldMapping;

  constructor(config: NeptuneAnalyticsVectorStoreConfigProps) {
    super();
    this.fieldMapping = config.fieldMapping;
    this.graphArn = config.graphArn;
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.NEPTUNE_ANALYTICS,
      neptuneAnalyticsConfiguration: {
        graphArn: this.graphArn,
        fieldMapping: this.fieldMapping,
      },
    };
  }

  public _grantStatements(): iam.PolicyStatement[] {
    return [];
  }
}
