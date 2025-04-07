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
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { IKnowledgeBase } from './../knowledge-bases/knowledge-base';
import { DataSourceAssociationProps, DataSourceNew, DataSourceType } from './base-data-source';
/**
 * Interface to add a new S3DataSource to an existing KB
 */
export interface S3DataSourceAssociationProps extends DataSourceAssociationProps {
  /**
   * The bucket that contains the data source.
   */
  readonly bucket: IBucket;

  /**
   * The prefixes of the objects in the bucket that should be included in the data source.
   *
   * @default - All objects in the bucket.
   */
  readonly inclusionPrefixes?: string[];
}

/**
 * Interface to create a new S3 Data Source object.
 */
export interface S3DataSourceProps extends S3DataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up an S3 Data Source to be added to a knowledge base.
 */
export class S3DataSource extends DataSourceNew {
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
   * The bucket associated with the data source.
   */
  public readonly bucket: IBucket;
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * The Data Source cfn resource.
   */
  private readonly __resource: CfnDataSource;

  constructor(scope: Construct, id: string, props: S3DataSourceProps) {
    super(scope, id);
    // Assign attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.S3;

    // Store chunking and parsing strategies from props
    //const chunkingStrategy = props.chunkingStrategy;
    //const parsingStrategy = props.parsingStrategy;
    this.dataSourceName =
      props.dataSourceName ??
      this.generatePhysicalName() + '-s3-ds';
    this.bucket = props.bucket;
    this.kmsKey = props.kmsKey;

    // ------------------------------------------------------
    // Manage permissions for the data source
    // ------------------------------------------------------
    this.handleCommonPermissions(props);
    this.bucket.grantRead(this.knowledgeBase.role);

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new CfnDataSource(this, 'DataSource', {
      ...this.formatAsCfnProps(props, {
        type: this.dataSourceType,
        s3Configuration: {
          bucketArn: props.bucket.bucketArn,
          inclusionPrefixes: props.inclusionPrefixes,
        },
      }),
    });

    this.dataSourceId = this.__resource.attrDataSourceId;
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}
