/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { IResource, Resource } from 'aws-cdk-lib';
import { CfnDataSource, CfnDataSourceProps } from 'aws-cdk-lib/aws-bedrock';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

import { IKnowledgeBase } from './../knowledge-bases/knowledge-base';
import { ChunkingStrategy } from './chunking';
import { ContextEnrichment } from './context-enrichment';
import { CustomTransformation } from './custom-transformation';
import { ParsingStategy } from './parsing';
/**
 * Specifies the policy for handling data when a data source resource is deleted.
 * This policy affects the vector embeddings created from the data source.
 */
export enum DataDeletionPolicy {
  /**
   * Deletes all vector embeddings derived from the data source upon deletion
   * of a data source resource.
   */
  DELETE = 'DELETE',

  /**
   * Retains all vector embeddings derived from the data source even after
   * deletion of a data source resource.
   */
  RETAIN = 'RETAIN',
}

/**
 * Represents the types of data sources that can be associated to an Knowledge Base.
 */
export enum DataSourceType {
  /**
   * Amazon S3 Bucket data source.
   */
  S3 = 'S3',

  /**
   * Confluence Cloud Instance data source.
   */
  CONFLUENCE = 'CONFLUENCE',

  /**
   * Salesforce instance data source.
   */
  SALESFORCE = 'SALESFORCE',

  /**
   * Microsoft SharePoint instance data source.
   */
  SHAREPOINT = 'SHAREPOINT',

  /**
   * Web Crawler data source.
   * Extracts content from authorized public web pages using a crawler.
   */
  WEB_CRAWLER = 'WEB',

  /**
   * Custom data source.
   * A custom data source allows the flexibility to automatically ingest documents
   * into your vector database directly.
   */
  CUSTOM = 'CUSTOM',

  /**
   * Redshift Metadata data source.
   */
  REDSHIFT_METADATA = 'REDSHIFT_METADATA',
}

/**
 * Specifies interface for resources created with CDK or imported into CDK.
 */
export interface IDataSource extends IResource {
  /**
   * The unique identifier of the data source.
   * @example 'JHUEVXUZMU'
   */
  readonly dataSourceId: string;
}

/**
 * Specifies the base class for all data source resources (imported and new).
 */
export abstract class DataSourceBase extends Resource implements IDataSource {
  /**
   * The unique identifier of the data source.
   * @example 'JHUEVXUZMU'
   */
  public abstract readonly dataSourceId: string;

  // Common methods for imported and new data sources go here
}

/**
 * Properties common for creating any of the different data source types.
 */
export interface DataSourceAssociationProps {
  /**
   * The name of the data source.
   *
   * @default - A new name will be generated.
   */
  readonly dataSourceName?: string;

  /**
   * A description of the data source.
   *
   * @default - No description is provided.
   */
  readonly description?: string;

  /**
   * The KMS key to use to encrypt the data source.
   *
   * @default - Service owned and managed key.
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The data deletion policy to apply to the data source.
   *
   * @default - Sets the data deletion policy to the default of the data source type.
   */
  readonly dataDeletionPolicy?: DataDeletionPolicy;

  /**
   * The chunking stategy to use for splitting your documents or content.
   * The chunks are then converted to embeddings and written to the vector
   * index allowing for similarity search and retrieval of the content.
   *
   * @default ChunkingStrategy.DEFAULT
   */
  readonly chunkingStrategy?: ChunkingStrategy;

  /**
   * The parsing strategy to use.
   *
   * @default - No Parsing Stategy is used.
   */
  readonly parsingStrategy?: ParsingStategy;

  /**
   * The custom transformation strategy to use.
   *
   * @default - No custom transformation is used.
   */
  readonly customTransformation?: CustomTransformation;

  /**
   * The context enrichment configuration to use.
   * @default - No context enrichment is used.
   */
  readonly contextEnrichment?: ContextEnrichment;
}

/**
 * Specifies the base class for all NEW data source resources of ANY type.
 */
export abstract class DataSourceNew extends DataSourceBase {
  /**
   * The unique identifier of the data source.
   * @example 'JHUEVXUZMU'
   */
  public abstract readonly dataSourceId: string;
  /**
   * The type of data source.
   */
  public abstract readonly dataSourceType: DataSourceType;
  /**
   * The name of the data source.
   */
  public abstract readonly dataSourceName: string;
  /**
   * The knowledge base associated with the data source.
   */
  public abstract readonly knowledgeBase: IKnowledgeBase;
  /**
   * The KMS key to use to encrypt the data source.
   */
  public abstract readonly kmsKey?: kms.IKey;

  // ------------------------------------------------------
  // Common methods for ALL NEW data sources
  // ------------------------------------------------------

  /**
   * Adds appropriate permissions to the KB execution role needed by the data source.
   */
  public handleCommonPermissions(props: DataSourceAssociationProps) {
    let statementsToAdd: PolicyStatement[] = [];
    // Parsing strategy requires access to the parsing FM, so be sure to add permissions
    if (props.parsingStrategy) {
      statementsToAdd.push(...props.parsingStrategy.generatePolicyStatements());
    }
    // Custom transformation requires invoke permissions for the Lambda
    if (props.customTransformation) {
      statementsToAdd.push(...props.customTransformation.generatePolicyStatements(this));
    }
    // Add the permission statements to the KB execution role
    statementsToAdd.forEach((statement) => {
      this.knowledgeBase.role.addToPrincipalPolicy(statement);
    });
  }

  /**
   * Formats the data source configuration properties for CloudFormation.
   */
  public formatAsCfnProps(
    props: DataSourceAssociationProps,
    dataSourceConfiguration: CfnDataSource.DataSourceConfigurationProperty,
  ): CfnDataSourceProps {
    return {
      dataDeletionPolicy: props.dataDeletionPolicy,
      dataSourceConfiguration: dataSourceConfiguration,
      description: props.description,
      knowledgeBaseId: this.knowledgeBase.knowledgeBaseId,
      name: this.dataSourceName,
      serverSideEncryptionConfiguration: props.kmsKey
        ? {
          kmsKeyArn: props.kmsKey.keyArn,
        }
        : undefined,
      vectorIngestionConfiguration:
        props.chunkingStrategy || props.parsingStrategy || props.customTransformation || props.contextEnrichment
          ? {
            chunkingConfiguration: props.chunkingStrategy?.configuration,
            parsingConfiguration: props.parsingStrategy?.configuration,
            customTransformationConfiguration: props.customTransformation?.configuration,
            contextEnrichmentConfiguration: props.contextEnrichment?.configuration,
          }
          : undefined,
    };
  }
}

export class DataSource extends DataSourceBase {
  public static fromDataSourceId(scope: Construct, id: string, dataSourceId: string): IDataSource {
    return new DataSource(scope, id, dataSourceId);
  }

  public readonly dataSourceId: string;

  private constructor(scope: Construct, id: string, dataSourceId: string) {
    super(scope, id);
    this.dataSourceId = dataSourceId;
  }
}
