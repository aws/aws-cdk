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

import { CfnDataSource } from 'aws-cdk-lib/aws-bedrock';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import { IKnowledgeBase } from './../knowledge-bases/knowledge-base';
import { DataSourceNew, DataSourceAssociationProps, DataSourceType } from './base-data-source';
/**
 * Represents the authentication types available for connecting to a Salesforce data source.
 */
export enum SalesforceDataSourceAuthType {
  /**
   * Your secret authentication credentials in AWS Secrets Manager should include:
   * - `consumerKey` (app client ID)
   * - `consumerSecret` (client secret)
   * - `authenticationUrl`
   */
  OAUTH2_CLIENT_CREDENTIALS = 'OAUTH2_CLIENT_CREDENTIALS',
}

/**
 * Represents the Salesforce object types that can be accessed by the data source connector.
 */
export enum SalesforceObjectType {
  ACCOUNT = 'Account',
  ATTACHMENT = 'Attachment',
  CAMPAIGN = 'Campaign',
  CONTENT_VERSION = 'ContentVersion',
  PARTNER = 'Partner',
  PRICEBOOK_2 = 'Pricebook2',
  CASE = 'Case',
  CONTACT = 'Contact',
  CONTRACT = 'Contract',
  DOCUMENT = 'Document',
  IDEA = 'Idea',
  LEAD = 'Lead',
  OPPORTUNITY = 'Opportunity',
  PRODUCT_2 = 'Product2',
  SOLUTION = 'Solution',
  TASK = 'Task',
  FEED_ITEM = 'FeedItem',
  FEED_COMMENT = 'FeedComment',
  KNOWLEDGE_KAV = 'Knowledge__kav',
  USER = 'User',
  COLLABORATION_GROUP = 'CollaborationGroup',
}

/**
 * Defines the crawling filters for Salesforce data ingestion.
 */
export interface SalesforceCrawlingFilters {
  /**
   * The Salesforce object type to which this filter applies.
   */
  readonly objectType: SalesforceObjectType;
  /**
   * Regular expression patterns to include specific content.
   */
  readonly includePatterns?: string[];
  /**
   * Regular expression patterns to exclude specific content.
   */
  readonly excludePatterns?: string[];
}

/**
 * Interface to add a new data source to an existing KB.
 */
export interface SalesforceDataSourceAssociationProps extends DataSourceAssociationProps {
  /**
   * The Salesforce host URL or instance URL.
   * @example "https://company.salesforce.com/"
   */
  readonly endpoint: string;
  /**
   * The AWS Secrets Manager secret that stores your authentication credentials
   * for your Salesforce instance URL. Secret must start with "AmazonBedrock-".
   */
  readonly authSecret: ISecret;
  /**
   * The filters (regular expression patterns) for the crawling.
   * If there's a conflict, the exclude pattern takes precedence.
   * @default None - all your content is crawled.
   */
  readonly filters?: SalesforceCrawlingFilters[];
}

/**
 * Interface to create a new standalone data source object.
 */
export interface SalesforceDataSourceProps extends SalesforceDataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up an data source to be added to a knowledge base.
 */
export class SalesforceDataSource extends DataSourceNew {
  // ------------------------------------------------------
  // Common attributes for all new data sources
  // ------------------------------------------------------
  /**
   * The unique identifier of the data source.
   * @example 'JHUEVXUZMU'
   */
  public readonly dataSourceId: string;
  /**
   * The type of data source.
   */
  public readonly dataSourceType: DataSourceType;
  /**
   * The name of the data source.
   */
  public readonly dataSourceName: string;
  /**
   * The knowledge base associated with the data source.
   */
  public readonly knowledgeBase: IKnowledgeBase;
  /**
   * The KMS key to use to encrypt the data source.
   */
  public readonly kmsKey?: IKey;
  // ------------------------------------------------------
  // Unique to this class
  // ------------------------------------------------------
  /**
   * The Salesforce host URL or instance URL.
   */
  public readonly endpoint: string;
  /**
   * The AWS Secrets Manager secret that stores your authentication credentials.
   */
  public readonly authSecret: ISecret;
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * The Data Source cfn resource.
   */
  private readonly __resource: CfnDataSource;

  constructor(scope: Construct, id: string, props: SalesforceDataSourceProps) {
    super(scope, id);
    // Assign attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.SALESFORCE;
    this.dataSourceName =
      props.dataSourceName ?? this.generatePhysicalName() + '-sfdc-ds';
    this.endpoint = props.endpoint;
    this.authSecret = props.authSecret;
    this.kmsKey = props.kmsKey;

    // ------------------------------------------------------
    // Manage permissions for the data source
    // ------------------------------------------------------
    this.handleCommonPermissions(props);
    this.authSecret.grantRead(this.knowledgeBase.role);

    // ------------------------------------------------------

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new CfnDataSource(this, 'DataSource', {
      ...this.formatAsCfnProps(props, {
        type: this.dataSourceType,
        salesforceConfiguration: {
          sourceConfiguration: {
            authType: SalesforceDataSourceAuthType.OAUTH2_CLIENT_CREDENTIALS,
            credentialsSecretArn: this.authSecret.secretArn,
            hostUrl: this.endpoint,
          },
          crawlerConfiguration: props.filters
            ? {
              filterConfiguration: {
                type: 'PATTERN',
                patternObjectFilter: {
                  filters: props.filters?.map(item => ({
                    objectType: item.objectType,
                    inclusionFilters: item.includePatterns,
                    exclusionFilters: item.excludePatterns,
                  })),
                },
              },
            }
            : undefined,
        },
      }),
    });

    this.dataSourceId = this.__resource.attrDataSourceId;
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}
