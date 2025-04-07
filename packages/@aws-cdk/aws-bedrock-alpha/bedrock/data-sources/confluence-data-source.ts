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
 * The different authentication types available to connect to your Confluence instance.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/confluence-data-source-connector.html#configuration-confluence-connector
 */
export enum ConfluenceDataSourceAuthType {
  /**
   * Your secret authentication credentials in AWS Secrets Manager should include:
   * - `confluenceAppKey`
   * - `confluenceAppSecret`
   * - `confluenceAccessToken`
   * - `confluenceRefreshToken`
   */
  OAUTH2_CLIENT_CREDENTIALS = 'OAUTH2_CLIENT_CREDENTIALS',
  /**
   * Your secret authentication credentials in AWS Secrets Manager should include:
   *  - `username` (email of admin account)
   *  - `password` (API token)
   */
  BASIC = 'BASIC',
}

/**
 * Represents the different types of content objects in Confluence that can be
 * crawled by the data source.
 */
export enum ConfluenceObjectType {
  SPACE = 'Space',
  PAGE = 'Page',
  BLOG = 'Blog',
  COMMENT = 'Comment',
  ATTACHMENT = 'Attachment',
}

/**
 * Defines filters for crawling Confluence content.
 * These filters allow you to include or exclude specific content based on object types and patterns.
 *
 * - For Spaces: Use the unique space key
 * - For Pages: Use the main page title
 * - For Blogs: Use the main blog title
 * - For Comments: Use "Re: Page/Blog Title"
 * - For Attachments: Use the filename with extension
 * @remarks
 * - You can specify inclusion and exclusion patterns using regular expressions.
 * - If both inclusion and exclusion patterns match a document, the exclusion takes precedence.
 *
 * @example
 * {
 *   objectType: ConfluenceObjectType.ATTACHMENT,
 *   excludePatterns: [".*private.*\\.pdf"]
 * }
 */
export interface ConfluenceCrawlingFilters {
  /**
   * The type of Confluence object to apply the filters to.
   */
  readonly objectType: ConfluenceObjectType;

  /**
   * Regular expression patterns to include content.
   * If specified, only content matching these patterns will be crawled.
   */
  readonly includePatterns?: string[];

  /**
   * Regular expression patterns to exclude content.
   * Content matching these patterns will not be crawled, even if it matches an include pattern.
   */
  readonly excludePatterns?: string[];
}

/**
 * Interface to add a new data source to an existing KB.
 */
export interface ConfluenceDataSourceAssociationProps extends DataSourceAssociationProps {
  /**
   * The Confluence host URL or instance URL.
   * @example https://example.atlassian.net
   */
  readonly confluenceUrl: string;
  /**
   * The AWS Secrets Manager secret that stores your authentication credentials
   * for your Confluence instance URL. Secret must start with "AmazonBedrock-".
   */
  readonly authSecret: ISecret;
  /**
   * The supported authentication method to connect to the data source.
   * @default ConfluenceDataSourceAuthType.OAUTH2_CLIENT_CREDENTIALS
   */
  readonly authType?: ConfluenceDataSourceAuthType;
  /**
   * The filters (regular expression patterns) for the crawling.
   * If there's a conflict, the exclude pattern takes precedence.
   * @default None - all your content is crawled.
   */
  readonly filters?: ConfluenceCrawlingFilters[];
}

/**
 * Interface to create a new standalone data source object.
 */
export interface ConfluenceDataSourceProps extends ConfluenceDataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up a Confluence Data Source to be added to a knowledge base.
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/confluence-data-source-connector.html
 */
export class ConfluenceDataSource extends DataSourceNew {
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
   * The Confluence host URL or instance URL.
   */
  public readonly confluenceUrl: string;
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

  constructor(scope: Construct, id: string, props: ConfluenceDataSourceProps) {
    super(scope, id);
    // Assign common attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.CONFLUENCE;
    this.dataSourceName =
      props.dataSourceName ??
      this.generatePhysicalName() + '-confluence-ds';
    this.kmsKey = props.kmsKey;
    // Assign unique attributes
    this.confluenceUrl = props.confluenceUrl;
    this.authSecret = props.authSecret;

    // ------------------------------------------------------
    // Manage permissions for the data source
    // ------------------------------------------------------
    this.handleCommonPermissions(props);
    this.authSecret.grantRead(this.knowledgeBase.role);

    // Grant write permissions to the knowledge base role for updating the secret.
    // This is necessary when using OAuth 2.0 authentication with a refresh token.
    if (props.authType === ConfluenceDataSourceAuthType.OAUTH2_CLIENT_CREDENTIALS) {
      this.authSecret.grantWrite(this.knowledgeBase.role);
    }
    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new CfnDataSource(this, 'DataSource', {
      ...this.formatAsCfnProps(props, {
        type: this.dataSourceType,
        confluenceConfiguration: {
          sourceConfiguration: {
            authType: props.authType ?? ConfluenceDataSourceAuthType.OAUTH2_CLIENT_CREDENTIALS,
            credentialsSecretArn: this.authSecret.secretArn,
            hostUrl: this.confluenceUrl,
            hostType: 'SAAS',
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
