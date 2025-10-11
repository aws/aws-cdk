import { CfnKnowledgeBase } from "aws-cdk-lib/aws-bedrock";

/******************************************************************************
 *                              ENUMS
 *****************************************************************************/
/**
 * Specifies the type of storage that Amazon Redshift will query data from.
 * The underlying data that the Amazon Redshift engine can query can be data natively stored in Amazon Redshift clusters,
 * or data located under the default AWS Glue Data Catalog (such as in Amazon S3 among others).
 */
export enum RedshiftStorageType {
  /**
   * Data natively stored in Amazon Redshift clusters
   */
  REDSHIFT = "REDSHIFT",
  /**
   * AWS Glue Data Catalog
   * A centralized metadata repository for data assets, including tables, schemas, and data formats, within AWS.
   * Allows querying data stored in external sources like Amazon S3.
   */
  GLUE_DATA_CATALOG = "AWS_DATA_CATALOG",
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/

/**
 * Configuration for Redshift query data
 */
export interface RedshiftQueryDataConfig {
  readonly storageType: RedshiftStorageType;
  readonly databaseName?: string;
  readonly tableNames?: string[];
}

export class RedshiftQueryData {
  /**
   * Static method to configure using Amazon Redshift native storage.
   */
  public static fromRedshift(databaseName: string): RedshiftQueryData {
    return new RedshiftQueryData({
      storageType: RedshiftStorageType.REDSHIFT,
      databaseName,
    });
  }

  /**
   * Static method to configure using AWS Glue Data Catalog.
   */
  public static fromGlueDataCatalog(tableNames: string[]): RedshiftQueryData {
    return new RedshiftQueryData({
      storageType: RedshiftStorageType.GLUE_DATA_CATALOG,
      tableNames,
    });
  }

  public readonly storageType: RedshiftStorageType;
  public readonly databaseName?: string;
  public readonly tableNames?: string[];

  /** Constructor of the class */
  constructor(config: RedshiftQueryDataConfig) {
    this.storageType = config.storageType;
    this.databaseName = config.databaseName;
    this.tableNames = config.tableNames;
  }

  /** Transforms internal properties into a CloudFormation compatible JSON */
  render(): CfnKnowledgeBase.RedshiftQueryEngineStorageConfigurationProperty {
    return {
      type: this.storageType,
      ...(this.storageType === RedshiftStorageType.REDSHIFT && {
        redshiftConfiguration: {
          databaseName: this.databaseName!,
        },
      }),
      ...(this.storageType === RedshiftStorageType.GLUE_DATA_CATALOG && {
        awsDataCatalogConfiguration: {
          tableNames: this.tableNames!,
        },
      }),
    };
  }
}
