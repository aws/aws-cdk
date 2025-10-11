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

import { IResource } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

/******************************************************************************
 *                              ENUMS
 *****************************************************************************/
/**
 * Types of possible knowledge bases supported by Amazon Bedrock Knowledge Bases.
 */
export enum KnowledgeBaseType {
  /**
   * Vector database with emebeddings vectors
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-it-works.html
   */
  VECTOR = "VECTOR",
  /**
   * Kendra GenAI Index
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build-kendra-genai-index.html
   */
  KENDRA = "KENDRA",
  /**
   * Structured data store (e.g. REDSHIFT)
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build-structured.html
   */
  SQL = "SQL",
}

/******************************************************************************
 *                             COMMON INTERFACE
 *****************************************************************************/
/**
 * Represents a Knowledge Base, either created with CDK or imported.
 * This contains all of the common attributes regardless of the Knowledge Base Type.
 */
export interface IKnowledgeBase extends IResource {
  /**
   * The ARN of the knowledge base.
   * @example "arn:aws:bedrock:us-east-1:123456789012:knowledge-base/KB12345678"
   */
  readonly knowledgeBaseArn: string;

  /**
   * The ID of the knowledge base.
   * @example "KB12345678"
   */
  readonly knowledgeBaseId: string;

  /**
   * The role associated with the knowledge base.
   */
  readonly role: iam.IRole;

  /**
   * The type of knowledge base.
   */
  readonly knowledgeBaseType: KnowledgeBaseType;

  /**
   * The description of the knowledge base.
   */
  readonly description?: string;

  /**
   * Grant the given principal identity permissions to perform actions on this knowledge base.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to query the knowledge base.
   */
  grantQuery(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  grantRetrieve(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to retrieve and generate from the knowledge base.
   */
  grantRetrieveAndGenerate(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to manage ingestion jobs.
   */
  grantManageIngestionJobs(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to manage data sources.
   */
  grantManageDataSources(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity administrative permissions for control plane operations.
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                       COMMON PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Common properties for creating any type of new Knowledge Base.
 */
export interface CommonKnowledgeBaseProps {
  /**
   * The name of the knowledge base.
   */
  readonly name?: string;

  /**
   * The description of the knowledge base.
   *
   * @default - No description provided.
   */
  readonly description?: string;

  /**
   * Existing IAM role with policy statements granting appropriate permissions
   * to invoke the specific embeddings models.
   * Any entity (e.g., an AWS service or application) that assumes
   * this role will be able to invoke or use the
   * specified embeddings model within the Bedrock service.
   */
  readonly existingRole?: iam.IRole;
}

/******************************************************************************
 *                          COMMON ATTRS FOR IMPORTS
 *****************************************************************************/
/**
 * Common properties for importing a knowledge base (of any type) created outside of this stack.
 */
export interface CommonKnowledgeBaseAttributes {
  /**
   * The ID of the knowledge base.
   * @example "KB12345678"
   */
  readonly knowledgeBaseId: string;

  /**
   * The Service Execution Role associated with the knowledge base.
   * @example "arn:aws:iam::123456789012:role/AmazonBedrockExecutionRoleForKnowledgeBaseawscdkbdgeBaseKB12345678"
   */
  readonly executionRoleArn: string;

  /**
   * The description of the knowledge base.
   *
   * @default - No description provided.
   */
  readonly description?: string;

  /**
   * Specifies whether to use the knowledge base or not when sending an InvokeAgent request.
   * @default - ENABLED
   */
  readonly knowledgeBaseState?: string;
}
