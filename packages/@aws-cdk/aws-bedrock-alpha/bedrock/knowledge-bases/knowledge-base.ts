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
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

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
  VECTOR = 'VECTOR',
  /**
   * Kendra GenAI Index
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build-kendra-genai-index.html
   */
  KENDRA = 'KENDRA',
  /**
   * Structured data store (e.g. REDSHIFT)
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build-structured.html
   */
  SQL = 'SQL',
}

/******************************************************************************
 *                             COMMON INTERFACE
 *****************************************************************************/
/**
 * Represents a Knowledge Base, either created with CDK or imported, of any type.
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
  readonly type: KnowledgeBaseType;

  /**
   * The description of the knowledge base.
   */
  readonly description?: string;

  /**
   * A narrative instruction of the knowledge base.
   * A Bedrock Agent can use this instruction to determine if it should
   * query this Knowledge Base.
   */
  readonly instruction?: string;

  /**
   * Grant the given principal identity permissions to perform actions on this knowledge base.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to query the knowledge base.
   */
  grantQuery(grantee: iam.IGrantable): iam.Grant;
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

  /**
   * A narrative description of the knowledge base.
   *
   * A Bedrock Agent can use this instruction to determine if it should
   * query this Knowledge Base.
   *
   * @default - No description provided.
   */
  readonly instruction?: string;
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
   * Instructions for agents based on the design and type of information of the
   * Knowledge Base. This will impact how Agents interact with the Knowledge Base.
   *
   * @default - No description provided.
   */
  readonly instruction?: string;
  /**
   * Specifies whether to use the knowledge base or not when sending an InvokeAgent request.
   * @default - ENABLED
   */
  readonly knowledgeBaseState?: string;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
/**
 * Abstract base class for Knowledge Base (regarless the type).
 * Contains methods valid for KBs either created with CDK or imported and
 * applicable to Knowledge Bases of any type.
 */
export abstract class KnowledgeBaseBase extends Resource implements IKnowledgeBase {
  public abstract readonly knowledgeBaseArn: string;
  public abstract readonly knowledgeBaseId: string;
  public abstract readonly role: iam.IRole;
  public abstract readonly description?: string;
  public abstract readonly instruction?: string;
  public abstract readonly type: KnowledgeBaseType;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  /**
   * Grant the given principal identity permissions to perform actions on this knowledge base.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.knowledgeBaseArn],
      actions,
    });
  }

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  public grantRetrieve(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:Retrieve');
  }

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  public grantRetrieveAndGenerate(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:RetrieveAndGenerate');
  }

  /**
   * Grant the given identity permissions to query the knowledge base.
   * This contains:
   * - Retrieve
   * - RetrieveAndGenerate
   */
  public grantQuery(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:Retrieve', 'bedrock:RetrieveAndGenerate');
  }
}
