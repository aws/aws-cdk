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

import { ArnFormat, aws_bedrock as bedrock, IResource, Resource, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { Construct } from 'constructs';
import { IAgent } from './agent';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents an Agent Alias, either created with CDK or imported.
 */
export interface IAgentAlias extends IResource {
  /**
   * The unique identifier of the agent alias.
   * @example `TCLCITFZTN`
   */
  readonly aliasId: string;
  /**
   * The ARN of the agent alias.
   * @example `arn:aws:bedrock:us-east-1:123456789012:agent-alias/DNCJJYQKSU/TCLCITFZTN`
   */
  readonly aliasArn: string;
  /**
   * The underlying agent for this alias.
   */
  readonly agent: IAgent;

  /**
   * Grant the given principal identity permissions to perform actions on this agent alias.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to invoke the agent alias.
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to get the agent alias.
   */
  grantGet(grantee: iam.IGrantable): iam.Grant;

  /**
   * Define an EventBridge rule that triggers when something happens to this agent alias
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  onCloudTrailEvent(id: string, options?: events.OnEventOptions): events.Rule;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for an Agent.
 * Contains methods and attributes valid for Agents either created with CDK or imported.
 */
export abstract class AgentAliasBase extends Resource implements IAgentAlias {
  public abstract readonly aliasId: string;
  public abstract readonly aliasArn: string;
  public abstract readonly agent: IAgent;

  /**
   * Grant the given principal identity permissions to perform actions on this agent alias.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.aliasArn],
      scope: this,
    });
  }

  /**
   * Grant the given identity permissions to invoke the agent alias.
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:InvokeAgent');
  }

  /**
   * Grant the given identity permissions to get the agent alias.
   */
  public grantGet(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:GetAgentAlias');
  }

  /**
   * Define an EventBridge rule that triggers when something happens to this agent alias
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  public onCloudTrailEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.bedrock'],
      detailType: ['AWS API Call via CloudTrail'],
      detail: {
        requestParameters: {
          agentAliasId: [this.aliasId],
        },
      },
    });
    return rule;
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK-Managed Agent Alias.
 */
export interface AgentAliasProps {
  /**
   * The name for the agent alias.
   * This will be used as the physical name of the agent alias.
   *
   * @default - "latest-{hash}"
   */
  readonly agentAliasName?: string;
  /**
   * The version of the agent to associate with the agent alias.
   *
   * @default - Creates a new version of the agent.
   */
  readonly agentVersion?: string;
  /**
   * The agent associated to this alias.
   */
  readonly agent: IAgent;
  /**
   * Description for the agent alias.
   * @default undefined - No description is provided
   */
  readonly description?: string;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes needed to create an import
 */
export interface AgentAliasAttributes {
  /**
   * The Id of the agent alias.
   */
  readonly aliasId: string;
  /**
   * The name of the agent alias.
   * @default undefined - No alias name is provided
   */
  readonly aliasName?: string;
  /**
   * The underlying agent for this alias.
   */
  readonly agent: IAgent;
  /**
   * The agent version for this alias.
   */
  readonly agentVersion: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create an Agent Alias with CDK.
 * @cloudformationResource AWS::Bedrock::AgentAlias
 */
export class AgentAlias extends AgentAliasBase {
  // ------------------------------------------------------
  // Imports
  // ------------------------------------------------------
  /**
   * Brings an Agent Alias from an existing one created outside of CDK.
   */
  public static fromAttributes(
    scope: Construct,
    id: string,
    attrs: AgentAliasAttributes,
  ): IAgentAlias {
    class Import extends AgentAliasBase {
      public readonly agent = attrs.agent;
      public readonly aliasId = attrs.aliasId;
      public readonly aliasName = attrs.aliasName;
      public readonly aliasArn = Stack.of(scope).formatArn({
        resource: 'agent-alias',
        service: 'bedrock',
        resourceName: `${attrs.agent.agentId}/${attrs.aliasId}`,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      });
    }
    return new Import(scope, id);
  }

  // ----------------------------------------
  // Inherited Attributes
  // ----------------------------------------
  public readonly agent: IAgent;
  public readonly aliasId: string;
  public readonly aliasArn: string;
  /**
   * The name of the agent alias.
   * This is either provided by the user or generated from a hash.
   */
  public readonly aliasName: string;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: AgentAliasProps) {
    super(scope, id);

    // Compute hash from agent, to recreate the resource when agent has changed
    const hash = md5hash(props.agent.agentId + props.agentVersion + props.agent.lastUpdated);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    // see https://github.com/awslabs/generative-ai-cdk-constructs/issues/947
    this.aliasName = props.agentAliasName ?? `latest-${hash}`;
    this.agent = props.agent;

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const alias = new bedrock.CfnAgentAlias(this, 'Resource', {
      agentAliasName: this.aliasName,
      agentId: this.agent.agentId,
      description: props.description,
      routingConfiguration: props.agentVersion
        ? [
          {
            agentVersion: props.agentVersion,
          },
        ]
        : undefined,
    });

    this.aliasId = alias.attrAgentAliasId;
    this.aliasArn = alias.attrAgentAliasArn;
  }
}
