import { IDatabaseCluster } from "aws-cdk-lib/aws-rds";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { VectorStoreConfig } from "../vector-store-config";
import { VectorStoreType } from "../vector-kb";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as iam from "aws-cdk-lib/aws-iam";

/******************************************************************************
 *                              Amazon Aurora                                 *
 *****************************************************************************/
export interface AuroraVectorFieldMapping {
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
  /**
   * The name of the field in which Amazon Bedrock stores the ID for each entry.
   */
  readonly primaryKeyField: string;
  /**
   * Provide a name for the universal metadata field where Amazon Bedrock will store any custom metadata from your data source.
   */
  readonly customMetadataField: string;
}

/**
 * Amazon Aurora vector store properties
 */
export interface AuroraVectorStoreConfigProps {
  /**
   * The Amazon Aurora cluster.
   */
  readonly cluster: IDatabaseCluster;
  /**
   * The Secrets Manager secret containing the credentials for the Amazon Aurora DB cluster.
   */
  readonly secret: ISecret;
  /**
   * The name of the database in your Amazon Aurora DB cluster.
   */
  readonly databaseName: string;
  /**
   * The name of the table in your Amazon Aurora DB cluster.
   */
  readonly tableName: string;
  /**
   * The Amazon Aurora field mapping to store and index your data.
   */
  readonly fieldMapping: AuroraVectorFieldMapping;
}

/**
 * Amazon Aurora vector store implementation
 */
export class AuroraVectorStoreConfig extends VectorStoreConfig {
  private readonly config: bedrock.CfnKnowledgeBase.RdsConfigurationProperty;
  public readonly vectorStoreType = VectorStoreType.AMAZON_AURORA;
  public readonly cluster: IDatabaseCluster;
  public readonly secret: ISecret;

  constructor(config: AuroraVectorStoreConfigProps) {
    super();
    this.secret = config.secret;
    this.cluster = config.cluster;
    this.config = {
      credentialsSecretArn: this.secret.secretArn,
      resourceArn: config.cluster.clusterArn,
      fieldMapping: config.fieldMapping,
      databaseName: config.databaseName,
      tableName: config.tableName,
    };
  }

  /**
   * Associates an existing Aurora vector store from configuration
   */
  public static fromConfig(config: AuroraVectorStoreConfigProps): AuroraVectorStoreConfig {
    return new AuroraVectorStoreConfig(config);
  }

  public _render(): bedrock.CfnKnowledgeBase.StorageConfigurationProperty {
    return {
      type: VectorStoreType.AMAZON_AURORA,
      rdsConfiguration: this.config,
    };
  }

  public _grantStatements(): iam.PolicyStatement[] {
    const statements = [
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [this.secret.secretArn],
      }),
      new iam.PolicyStatement({
        actions: [
          "rds-data:ExecuteStatement",
          "rds-data:BatchExecuteStatement",
          "rds:DescribeDBClusters",
        ],
        resources: [this.config.resourceArn],
      }),
    ];

    if (this.secret.encryptionKey) {
      statements.push(
        new iam.PolicyStatement({
          actions: ["kms:Decrypt", "kms:DescribeKey", "kms:GenerateDataKey"],
          resources: [this.secret.encryptionKey!.keyArn],
          conditions: {
            StringEquals: {
              "kms:EncryptionContext:SecretARN": this.secret.secretArn,
            },
          },
        })
      );
    }

    return statements;
  }
}
