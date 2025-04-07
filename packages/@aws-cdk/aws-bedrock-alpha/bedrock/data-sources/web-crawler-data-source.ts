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
import { Construct } from 'constructs';

import { IKnowledgeBase } from './../knowledge-bases/knowledge-base';
import { DataSourceNew, DataSourceAssociationProps, DataSourceType } from './base-data-source';
/**
 * The scope of the crawling.
 */
export enum CrawlingScope {
  /**
   * Crawls only web pages that belong to the same host or primary domain.
   */
  HOST_ONLY = 'HOST_ONLY',
  /**
   * Includes subdomains in addition to the host or primary domain, i.e.
   * web pages that contain "aws.amazon.com" can also include
   * sub domain "docs.aws.amazon.com"
   */
  SUBDOMAINS = 'SUBDOMAINS',
  /**
   * Limit crawling to web pages that belong to the same host and with the
   * same initial URL path.
   */
  DEFAULT = 'DEFAULT',
}

/**
 * The filters (regular expression patterns) to include or exclude in the crawling
 * in accordance with your scope.
 */
export interface CrawlingFilters {
  /**
   * Include patterns.
   */
  readonly includePatterns?: string[];
  /**
   * Exclude paths.
   */
  readonly excludePatterns?: string[];
}

/**
 * Interface to add a new data source to an existing KB.
 */
export interface WebCrawlerDataSourceAssociationProps extends DataSourceAssociationProps {
  /**
   * The source urls in the format `https://www.sitename.com`.
   * Maximum of 100 URLs.
   */
  readonly sourceUrls: string[];
  /**
   * The scope of the crawling.
   * @default - CrawlingScope.DEFAULT
   */
  readonly crawlingScope?: CrawlingScope;
  /**
   * The max rate at which pages are crawled, up to 300 per minute per host.
   * Higher values will decrease sync time but increase the load on the host.
   * @default 300
   */
  readonly crawlingRate?: number;
  /**
   * The filters (regular expression patterns) for the crawling.
   * If there's a conflict, the exclude pattern takes precedence.
   * @default None
   */
  readonly filters?: CrawlingFilters;
  /**
   * The user agent string to use when crawling.
   * @default - Default user agent string
   */
  readonly userAgent?: string;
  /**
   * The user agent header to use when crawling. A string used for identifying
   * the crawler or bot when it accesses a web server. The user agent header value
   * consists of the bedrockbot, UUID, and a user agent suffix for your crawler (if one is provided).
   * By default, it is set to bedrockbot_UUID. You can optionally append a custom suffix to bedrockbot_UUID
   * to allowlist a specific user agent permitted to access your source URLs.
   * @default - Default user agent header (bedrockbot_UUID)
   */
  readonly userAgentHeader?: string;
  /**
   * The maximum number of pages to crawl. The max number of web pages crawled from your source URLs,
   * up to 25,000 pages. If the web pages exceed this limit, the data source sync will fail and
   * no web pages will be ingested.
   * @default - No limit
   */
  readonly maxPages?: number;
}

/**
 * Interface to create a new standalone data source object.
 */
export interface WebCrawlerDataSourceProps extends WebCrawlerDataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up a web crawler data source to be added to a knowledge base.
 */
export class WebCrawlerDataSource extends DataSourceNew {
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
   * The max rate at which pages are crawled.
   */
  public readonly siteUrls: string[];
  /**
   * The max rate at which pages are crawled.
   */
  public readonly crawlingRate: number;
  /**
   * The maximum number of pages to crawl.
   */
  public readonly maxPages: number;
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * The Data Source cfn resource.
   */
  private readonly __resource: CfnDataSource;

  constructor(scope: Construct, id: string, props: WebCrawlerDataSourceProps) {
    super(scope, id);
    // Assign attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.WEB_CRAWLER;
    this.dataSourceName =
      props.dataSourceName ??
      this.generatePhysicalName() + '-crawler-ds';
    this.kmsKey = props.kmsKey;
    this.crawlingRate = props.crawlingRate ?? 300;
    this.siteUrls = props.sourceUrls;
    this.maxPages = props.maxPages ?? 25000;
    // ------------------------------------------------------
    // Manage permissions for the data source
    // ------------------------------------------------------
    this.handleCommonPermissions(props);

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------

    this.__resource = new CfnDataSource(this, 'DataSource', {
      ...this.formatAsCfnProps(props, {
        type: this.dataSourceType,
        webConfiguration: {
          crawlerConfiguration: {
            crawlerLimits: {
              rateLimit: this.crawlingRate,
              maxPages: this.maxPages,
            },
            scope: props.crawlingScope !== CrawlingScope.DEFAULT ? props.crawlingScope : undefined,
            inclusionFilters: props.filters?.includePatterns,
            exclusionFilters: props.filters?.excludePatterns,
            userAgent: props.userAgent,
            userAgentHeader: props.userAgentHeader,
          },
          sourceConfiguration: {
            urlConfiguration: {
              seedUrls: props.sourceUrls.map(item => ({ url: item })),
            },
          },
        },
      }),
    });

    this.dataSourceId = this.__resource.attrDataSourceId;
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}
