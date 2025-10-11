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

import { ArnFormat, Resource, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { IKnowledgeBase, KnowledgeBaseType } from "./knowledge-base";
import { KnowledgeBaseActions } from "./perms";
import { generatePhysicalNameV2 } from "../utils";

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
  public abstract readonly knowledgeBaseType: KnowledgeBaseType;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  /**
   * Adds permissions to the execution role of the knowledge base.
   */
  public addToRolePolicy(statement: iam.PolicyStatement): iam.AddToPrincipalPolicyResult {
    return this.role.addToPrincipalPolicy(statement);
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
   * Grant the given identity permissions to manage ingestion jobs.
   */
  public grantManageIngestionJobs(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.MANAGE_INGESTION_JOBS);
  }

  /**
   * Grant the given identity permissions to manage data sources.
   */
  public grantManageDataSources(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.MANAGE_DATA_SOURCES);
  }

  /**
   * Grant the given identity administrative permissions for control plane operations.
   */
  public grantAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.ADMIN);
  }

  /**
   * Grant the given identity permissions to retrieve content from the knowledge base.
   */
  public grantRetrieve(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.RETRIEVE);
  }
  /**
   * Grant the given identity permissions to retrieve and generate from the knowledge base.
   */
  public grantRetrieveAndGenerate(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.RETRIEVE_AND_GENERATE);
  }
  /**
   * Grant the given identity permissions to query the knowledge base.
   */
  public grantQuery(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...KnowledgeBaseActions.QUERY);
  }

  /**
   * Creates a new Service Role for the Knowledge Base.
   * Can be used by extending classes when a custom role has not been provided.
   */
  protected createKnowledgeBaseServiceRole(scope: Construct): iam.Role {
    return new iam.Role(scope, "Role", {
      roleName: generatePhysicalNameV2(scope, "AmazonBedrockExecutionRoleForKnowledgeBase", {
        maxLength: 64,
        separator: "-",
      }),
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com", {
        conditions: {
          StringEquals: { "aws:SourceAccount": Stack.of(scope).account },
          ArnLike: {
            "aws:SourceArn": Stack.of(scope).formatArn({
              service: "bedrock",
              resource: "knowledge-base",
              resourceName: "*",
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            }),
          },
        },
      }),
    });
  }
}
