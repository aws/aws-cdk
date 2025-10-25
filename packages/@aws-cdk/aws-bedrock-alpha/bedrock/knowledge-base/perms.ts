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

/**
 * Actions for Amazon Bedrock Knowledge Base operations.
 *
 * This class provides static action arrays for various Knowledge Base operations
 * based on AWS service authorization reference.
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrock.html
 */
export class KnowledgeBaseActions {
  /******************************************************************************
   *                             CONTROL PLANE
   *****************************************************************************/
  public static readonly CREATE_KNOWLEDGE_BASE = ["bedrock:CreateKnowledgeBase"];
  public static readonly LIST_KNOWLEDGE_BASES = ["bedrock:ListKnowledgeBases"];
  public static readonly GET_KNOWLEDGE_BASE = ["bedrock:GetKnowledgeBase"];
  public static readonly MANAGE_KNOWLEDGE_BASE = [
    "bedrock:UpdateKnowledgeBase",
    "bedrock:DeleteKnowledgeBase",
  ];
  public static readonly TAG_KNOWLEDGE_BASE = [
    "bedrock:TagResource",
    "bedrock:UntagResource",
    "bedrock:ListTagsForResource",
  ];
  public static readonly ALLOW_VENDED_LOG_DELIVERY = ["bedrock:AllowVendedLogDeliveryForResource"];

  /******************************************************************************
   *                             DATA PLANE
   *****************************************************************************/
  public static readonly MANAGE_INGESTION_JOBS = [
    "bedrock:StartIngestionJob",
    "bedrock:GetIngestionJob",
    "bedrock:ListIngestionJobs",
    "bedrock:StopIngestionJob",
  ];
  public static readonly RETRIEVE = ["bedrock:Retrieve"];
  public static readonly RETRIEVE_AND_GENERATE = ["bedrock:RetrieveAndGenerate"];
  public static readonly MANAGE_DATA_SOURCES = [
    "bedrock:CreateDataSource",
    "bedrock:GetDataSource",
    "bedrock:ListDataSources",
    "bedrock:UpdateDataSource",
    "bedrock:DeleteDataSource",
  ];
  public static readonly ASSOCIATE_WITH_AGENT = [
    "bedrock:AssociateAgentKnowledgeBase",
    "bedrock:DisassociateAgentKnowledgeBase",
    "bedrock:GetAgentKnowledgeBase",
    "bedrock:ListAgentKnowledgeBases",
    "bedrock:UpdateAgentKnowledgeBase",
  ];

  /******************************************************************************
   *                             READ ONLY
   *****************************************************************************/
  public static readonly READ_KNOWLEDGE_BASE = [
    "bedrock:GetKnowledgeBase",
    "bedrock:GetIngestionJob",
    "bedrock:ListIngestionJobs",
    "bedrock:ListTagsForResource",
  ];

  /******************************************************************************
   *                             COMBINED ACTIONS
   *****************************************************************************/
  public static readonly QUERY = [...this.RETRIEVE, ...this.RETRIEVE_AND_GENERATE];
  public static readonly READ_ONLY = [
    ...this.LIST_KNOWLEDGE_BASES,
    ...this.READ_KNOWLEDGE_BASE,
    ...this.QUERY,
  ];
  public static readonly ADMIN = [
    ...this.CREATE_KNOWLEDGE_BASE,
    ...this.GET_KNOWLEDGE_BASE,
    ...this.LIST_KNOWLEDGE_BASES,
    ...this.MANAGE_KNOWLEDGE_BASE,
    ...this.TAG_KNOWLEDGE_BASE,
  ];
  public static readonly FULL_ACCESS = [
    ...this.ADMIN,
    ...this.MANAGE_INGESTION_JOBS,
    ...this.MANAGE_DATA_SOURCES,
    ...this.ALLOW_VENDED_LOG_DELIVERY,
    ...this.ASSOCIATE_WITH_AGENT,
    ...this.QUERY,
  ];
}
