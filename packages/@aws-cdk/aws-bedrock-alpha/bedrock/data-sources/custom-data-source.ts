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
import { DataSourceAssociationProps, DataSourceNew, DataSourceType } from './base-data-source';
/**
 * Interface to add a new CustomDataSource to an existing KB
 */
export interface CustomDataSourceAssociationProps extends DataSourceAssociationProps {}

/**
 * Interface to create a new Custom Data Source object.
 */
export interface CustomDataSourceProps extends CustomDataSourceAssociationProps {
  /**
   * The knowledge base to associate with the data source.
   */
  readonly knowledgeBase: IKnowledgeBase;
}

/**
 * Sets up a custom Data Source to be added to a knowledge base.
 */
export class CustomDataSource extends DataSourceNew {
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
  // No unique attributes at the moment ...
  //
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * The Data Source cfn resource.
   */
  private readonly __resource: CfnDataSource;

  constructor(scope: Construct, id: string, props: CustomDataSourceProps) {
    super(scope, id);
    // Assign attributes
    this.knowledgeBase = props.knowledgeBase;
    this.dataSourceType = DataSourceType.CUSTOM;

    // Turns out chunking and parsing are not replace so pass
   // const chunkingStrategy = props.chunkingStrategy;
   // const parsingStrategy = props.parsingStrategy;
    //const theseAreNotReplacable = { chunkingStrategy, parsingStrategy };
    this.dataSourceName =
      props.dataSourceName ??
      this.generatePhysicalName() + '-custom-ds';
    this.kmsKey = props.kmsKey;

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
      }),
    });

    this.dataSourceId = this.__resource.attrDataSourceId;
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}
