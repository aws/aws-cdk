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

import { IKnowledgeBase, KnowledgeBaseType } from "../knowledge-base";
import { KnowledgeBaseBase } from "../knowledge-base-base";

/******************************************************************************
 *                              ENUMS
 *****************************************************************************/
/**
 * The query engine reads metadata from your structured data store and generates
 * optimized SQL queries. When choosing your query engine, consider factors such
 * as data volume and complexity, storage location, and query complexity.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-prereq-structured.html
 */
export enum SqlQueryEngineType {
  /**
   * A fully managed, petabyte-scale data warehouse service in the cloud.
   */
  REDSHIFT = "REDSHIFT",
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
/**
 * Interface for a SQL Knowledge Base, adds extra attributes to common.
 */
export interface ISqlKnowledgeBase extends IKnowledgeBase {
  /**
   * The type of query engine.
   */
  readonly queryEngineType: SqlQueryEngineType;
}

/**
 * Base Class for a SQL Knowledge Base, add extra methods to common
 */
export abstract class SqlKnowledgeBaseBase extends KnowledgeBaseBase implements ISqlKnowledgeBase {
  /**
   * The type of knowledge base.
   */
  readonly knowledgeBaseType: KnowledgeBaseType = KnowledgeBaseType.SQL;
  /**
   * The type of query engine.
   */
  abstract readonly queryEngineType: SqlQueryEngineType;
}
