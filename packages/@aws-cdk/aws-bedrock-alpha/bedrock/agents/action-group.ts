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

import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { ActionGroupExecutor } from './api-executor';
import { ApiSchema } from './api-schema';

/******************************************************************************
 *                           Signatures
 *****************************************************************************/
/**
 * AWS Defined signatures for enabling certain capabilities in your agent.
 */
export class ParentActionGroupSignature {
  /**
   * Signature that allows your agent to request the user for additional information when trying to complete a task.
   */
  public static readonly USER_INPUT = new ParentActionGroupSignature('AMAZON.UserInput');
  /**
   * Signature that allows your agent to generate, run, and troubleshoot code when trying to complete a task.
   */
  public static readonly CODE_INTERPRETER = new ParentActionGroupSignature('AMAZON.CodeInterpreter');
  /**
   * Constructor should be used as a temporary solution when a new signature is supported
   * but its implementation in CDK hasn't been added yet.
   */
  constructor(public readonly value: string) {}
  public toString() {
    return this.value;
  }
}
/******************************************************************************
 *                         PROPS - Action Group Class
 *****************************************************************************/
export interface AgentActionGroupProps {
  /**
   * The name of the action group.
   */
  readonly name: string;

  /**
   * A description of the action group.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * The API Schema
   *
   * @default - No API Schema
   */
  readonly apiSchema?: ApiSchema;

  /**
   * The action group executor.
   *
   * @default - No executor
   */
  readonly executor?: ActionGroupExecutor;

  /**
   * Specifies whether the action group is available for the agent to invoke or
   * not when sending an InvokeAgent request.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Specifies whether to delete the resource even if it's in use.
   *
   * @default false
   */
  readonly forceDelete?: boolean;

  /**
   * Defines functions that each define parameters that the agent needs to invoke from the user.
   * NO L2 yet as this doesn't make much sense IMHO
   */
  readonly functionSchema?: CfnAgent.FunctionSchemaProperty;

  /**
   * The AWS Defined signature for enabling certain capabilities in your agent.
   * When this property is specified, you must leave the description, apiSchema,
   * and actionGroupExecutor fields blank for this action group
   */
  readonly parentActionGroupSignature?: ParentActionGroupSignature;
}

/******************************************************************************
 *                         DEF - Action Group Class
 *****************************************************************************/

export class AgentActionGroup {
  // ------------------------------------------------------
  // Static Constructors
  // ------------------------------------------------------
  /**
   * Defines an action group that allows your agent to request the user for
   * additional information when trying to complete a task.
   * @param enabled Specifies whether the action group is available for the agent
   */
  public static userInput(enabled: boolean): AgentActionGroup {
    return new AgentActionGroup({
      name: 'UserInputAction',
      enabled: enabled,
      parentActionGroupSignature: ParentActionGroupSignature.USER_INPUT,
    });
  }

  /**
   * Defines an action group that allows your agent to request the user for
   * additional information when trying to complete a task.
   * @param enabled Specifies whether the action group is available for the agent
   */
  public static codeInterpreter(enabled: boolean): AgentActionGroup {
    return new AgentActionGroup({
      name: 'CodeInterpreterAction',
      enabled: enabled,
      parentActionGroupSignature: ParentActionGroupSignature.CODE_INTERPRETER,
    });
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The name of the action group.
   */
  public readonly name: string;
  /**
   * A description of the action group.
   */
  public readonly description?: string;
  /**
   * Whether this action group is available for the agent to invoke or not.
   */
  public readonly enabled: boolean;
  /**
   * The api schema for this action group (if defined).
   */
  public readonly apiSchema?: ApiSchema;
  /**
   * The action group executor for this action group (if defined).
   */
  public readonly executor?: ActionGroupExecutor;
  /**
   * Whether to delete the resource even if it's in use.
   */
  public readonly forceDelete?: boolean;
  /**
   * The function schema for this action group (if defined).
   */
  public readonly functionSchema?: CfnAgent.FunctionSchemaProperty;
  /**
   * The AWS Defined signature (if defined).
   */
  public readonly parentActionGroupSignature?: ParentActionGroupSignature;

  public constructor(props: AgentActionGroupProps) {
    // Validate Props
    this.validateProps(props);

    // ------------------------------------------------------
    // Set attributes or defaults
    // ------------------------------------------------------
    this.name = props.name;
    this.description = props.description;
    this.apiSchema = props.apiSchema;
    this.executor = props.executor;
    this.enabled = props.enabled ?? true;
    this.forceDelete = props.forceDelete ?? false;
    this.functionSchema = props.functionSchema;
    this.parentActionGroupSignature = props.parentActionGroupSignature;
  }

  private validateProps(props: AgentActionGroupProps) {
    if (props.parentActionGroupSignature && (props.description || props.apiSchema || props.executor)) {
      throw new Error(
        'When parentActionGroupSignature is specified, you must leave the description, ' +
          'apiSchema, and actionGroupExecutor fields blank for this action group',
      );
    }
  }

  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.AgentActionGroupProperty {
    return {
      actionGroupExecutor: this.executor?._render(),
      actionGroupName: this.name,
      actionGroupState: this.enabled ? 'ENABLED' : 'DISABLED',
      apiSchema: this.apiSchema?._render(),
      description: this.description,
      functionSchema: this.functionSchema,
      parentActionGroupSignature: this.parentActionGroupSignature?.toString(),
      skipResourceInUseCheckOnDelete: this.forceDelete,
    };
  }
}
