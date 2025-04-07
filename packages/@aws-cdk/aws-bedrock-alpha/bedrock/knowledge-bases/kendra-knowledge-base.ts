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

export { KnowledgeBaseBase } from './knowledge-base';
import { ArnFormat, Stack } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  CommonKnowledgeBaseAttributes,
  CommonKnowledgeBaseProps,
  IKnowledgeBase,
  KnowledgeBaseBase,
  KnowledgeBaseType,
} from './knowledge-base';
import { IKendraGenAiIndex } from './kendra-knowledgebase';

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
export interface IKendraKnowledgeBase extends IKnowledgeBase {
  /**
   * The GenAI Kendra Index.
   */
  readonly kendraIndex: IKendraGenAiIndex;
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a Kendra Index Knowledge Base.
 */
export interface KendraKnowledgeBaseProps extends CommonKnowledgeBaseProps {
  /**
   * The Kendra Index to use for the knowledge base.
   */
  readonly kendraIndex: IKendraGenAiIndex;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Properties for importing a knowledge base outside of this stack
 */
export interface KendraKnowledgeBaseAttributes extends CommonKnowledgeBaseAttributes {
  /**
   * The GenAI Kendra Index ARN.
   */
  readonly kendraIndex: IKendraGenAiIndex;
}

/******************************************************************************
 *                              ABSTRACT CLASS
 *****************************************************************************/
export abstract class KendraKnowledgeBaseBase extends KnowledgeBaseBase {
  public abstract readonly knowledgeBaseArn: string;
  public abstract readonly knowledgeBaseId: string;
  public abstract readonly role: iam.IRole;
  public abstract readonly kendraIndex: IKendraGenAiIndex;
  public abstract readonly description?: string;
  public abstract readonly instruction?: string;
  public readonly type: KnowledgeBaseType = KnowledgeBaseType.KENDRA;
}

/******************************************************************************
 *                        		  CONSTRUCT
 *****************************************************************************/
export class KendraKnowledgeBase extends KendraKnowledgeBaseBase {
  // ------------------------------------------------------
  // Import Methods
  // ------------------------------------------------------
  public static fromKnowledgeBaseAttributes(
    scope: Construct,
    id: string,
    attrs: KendraKnowledgeBaseAttributes,
  ): IKendraKnowledgeBase {
    const stack = Stack.of(scope);

    class Import extends KendraKnowledgeBaseBase {
      public readonly role = iam.Role.fromRoleArn(this, `kb-${attrs.knowledgeBaseId}-role`, attrs.executionRoleArn);
      public readonly description = attrs.description;
      public readonly instruction = attrs.instruction;
      public readonly knowledgeBaseId = attrs.knowledgeBaseId;
      public readonly kendraIndex = attrs.kendraIndex;
      public readonly knowledgeBaseArn = stack.formatArn({
        service: 'bedrock',
        resource: 'knowledge-base',
        resourceName: attrs.knowledgeBaseId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      });
    }
    return new Import(scope, id);
  }
  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  // inherited
  public readonly knowledgeBaseArn: string;
  public readonly knowledgeBaseId: string;
  public readonly role: iam.IRole;
  public readonly description?: string;
  public readonly instruction?: string;

  /**
   * The name of the knowledge base.
   */
  public readonly name: string;

  /**
   * The GenAI Kendra Index.
   */
  public readonly kendraIndex: IKendraGenAiIndex;
  /**
   * The type of Knowledge Base
   */
  public readonly type: KnowledgeBaseType = KnowledgeBaseType.KENDRA;

  private readonly _resource: bedrock.CfnKnowledgeBase;

  constructor(scope: Construct, id: string, props: KendraKnowledgeBaseProps) {
    super(scope, id);
    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    this.kendraIndex = props.kendraIndex;
    this.name = props.name ?? this.generatePhysicalName() + '-kendra-kb';
    this.instruction = props.instruction;
    this.description = props.description;

    // ------------------------------------------------------
    // Role
    // ------------------------------------------------------
    let policyAddition: iam.AddToPrincipalPolicyResult | undefined;
    if (props.existingRole) {
      this.role = props.existingRole;
    } else {
      const roleName = this.generatePhysicalName() + '-AmazonBedrockExecutionRoleForKnowledgeBase';
      this.role = new iam.Role(this, 'Role', {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com', {
          conditions: {
            StringEquals: { 'aws:SourceAccount': Stack.of(this).account },
            ArnLike: {
              'aws:SourceArn': Stack.of(this).formatArn({
                service: 'bedrock',
                resource: 'knowledge-base',
                resourceName: '*',
                arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
              }),
            },
          },
        }),
      });
      policyAddition = this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          sid: 'AmazonBedrockKnowledgeBaseKendraIndexAccessStatement',
          actions: ['kendra:Retrieve', 'kendra:DescribeIndex'],
          resources: [this.kendraIndex.indexArn],
        }),
      );
    }
    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this._resource = new bedrock.CfnKnowledgeBase(this, 'MyCfnKnowledgeBase', {
      name: this.name,
      roleArn: this.role.roleArn,
      description: props.description,
      knowledgeBaseConfiguration: {
        type: KnowledgeBaseType.KENDRA,
        kendraKnowledgeBaseConfiguration: {
          kendraIndexArn: props.kendraIndex.indexArn,
        },
      },
    });

    // Ensure policy statement is added before creating KnowledgeBase
    this._resource.node.addDependency(policyAddition?.policyDependable!);

    this.knowledgeBaseArn = this._resource.attrKnowledgeBaseArn;
    this.knowledgeBaseId = this._resource.attrKnowledgeBaseId;
  }

  protected generatePhysicalName(): string {
    return super.generatePhysicalName().toLowerCase();
  }
}
