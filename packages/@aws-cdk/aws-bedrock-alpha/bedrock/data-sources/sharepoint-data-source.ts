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
import { DataSourceAssociationProps, DataSourceNew, DataSourceType } from './base-data-source';
/**
 * Represents the authentication types available for connecting to a SharePoint data source.
 */
export enum SharePointDataSourceAuthType {
  /**
   * OAuth 2.0 Client Credentials flow for authentication with SharePoint.
   * Your secret authentication credentials in AWS Secrets Manager should include:
   * - `username`: The admin username for SharePoint authentication
   * - `password`: The admin password associated with the username
   * - `clientId`: The client ID (also known as application ID)
   * - `clientSecret`: The client secret
   */
  OAUTH2_CLIENT_CREDENTIALS = 'OAUTH2_CLIENT_CREDENTIALS',
}

/**
 * Represents the SharePoint object types that can be accessed by the data source connector.
 */
export enum SharePointObjectType {
  /**
   * Represents a SharePoint page, which typically contains web parts and content.
   */
  PAGE = 'Page',

  /**
   * Represents a calendar event in SharePoint.
   */
  EVENT = 'Event',

  /**
   * Represents a file stored in SharePoint document libraries.
   */
  FILE = 'File',
}

/**
 * Defines the crawling filters for SharePoint data ingestion. These filters allow
 * you to specify which content should be included or excluded during the crawling process.
 * If you specify an inclusion and exclusion filter and both match a document,
 * the exclusion filter takes precedence and the document isn’t crawled.
 */
export interface SharePointCrawlingFilters {
  /**
   * The SharePoint object type this filter applies to.
   */
  readonly objectType: SharePointObjectType;
  /**
   * Optional array of regular expression patterns to include specific content.
   * Only content matching these patterns will be crawled.
   * @example ['.*public.*', '.*shared.*']
   */
  readonly includePatterns?: string[];
  /**
   * Optional array of regular expression patterns to exclude specific content.
   * Content matching these patterns will be skipped during crawling.
   * @example ['.*private.*', '.*confidential.*']
   */
  readonly excludePatterns?: string[];
}

/**
 * Interface to add a new data source to an existing KB
 */
export interface SharePointDataSourceAssociationProps extends DataSourceAssociationProps {
  /**
   * The domain of your SharePoint instance or site URL/URLs.
   * @example "yourdomain"
   */
  readonly domain: string;
  /**
   * The SharePoint site URL/URLs.
   * Must start with “https”. All URLs must start with same protocol.
   * @example ["https://yourdomain.sharepoint.com/sites/mysite"]
   */
  readonly siteUrls: string[];
  /**
   * The identifier of your Microsoft 365 tenant.
   * @example "d1c035a6-1dcf-457d-97e3"
   */
  readonly tenantId: string;
  /**
   * The AWS Secrets Manager secret that stores your authentication credentials
   * for your Sharepoint instance URL. Secret must start with "AmazonBedrock-".
   */
  readonly authSecret: ISecret;
  /**
   * The filters (regular expression patterns) for the crawling.
   * If there's a conflict, the exclude pattern takes precedence.
   * @default None - all your content is crawled.
   */
  readonly filters?: SharePointCrawlingFilters[];
}

/**
 * Interface to create a new standalone data source object
 */
export interface SharePointDataSourceProps extends SharePointDataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up an data source to be added to a knowledge base.
 */
export class SharePointDataSource extends DataSourceNew {
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
   * The domain name of your SharePoint instance.
   */
  public readonly domain: string;
  /**
   * The AWS Secrets Manager secret that stores your authentication credentials.
   */
  public readonly authSecret: ISecret;
  /**
   * The SharePoint site URL/URLs.
   */
  public readonly siteUrls: string[];
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * The Data Source cfn resource.
   */
  private readonly __resource: CfnDataSource;

  constructor(scope: Construct, id: string, props: SharePointDataSourceProps) {
    super(scope, id);
    // Assign attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.SHAREPOINT;
    this.dataSourceName =
      props.dataSourceName ??
      this.generatePhysicalName() + '-sharepoint-ds';
    this.siteUrls = props.siteUrls;
    this.domain = props.domain;
    this.authSecret = props.authSecret;
    this.kmsKey = props.kmsKey;

    // ------------------------------------------------------
    // Manage permissions for the data source
    // ------------------------------------------------------
    this.handleCommonPermissions(props);
    this.authSecret.grantRead(this.knowledgeBase.role);

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new CfnDataSource(this, 'DataSource', {
      ...this.formatAsCfnProps(props, {
        type: this.dataSourceType,
        sharePointConfiguration: {
          sourceConfiguration: {
            authType: SharePointDataSourceAuthType.OAUTH2_CLIENT_CREDENTIALS,
            credentialsSecretArn: this.authSecret.secretArn,
            hostType: 'ONLINE',
            domain: props.domain,
            siteUrls: this.siteUrls,
            tenantId: props.tenantId,
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
