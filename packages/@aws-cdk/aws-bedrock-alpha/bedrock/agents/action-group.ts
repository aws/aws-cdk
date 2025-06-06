import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import * as crypto from 'crypto';
import { ActionGroupExecutor } from './api-executor';
import { ApiSchema } from './api-schema';
import { ValidationError } from './validation-helpers';
import { FunctionSchema } from './function-schema';

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
   * Constructor should be used as a temporary solution when a new signature is supported but its implementation in CDK hasn't been added yet.
   */
  constructor(
    /**
     * The AWS-defined signature value for this action group capability.
     */
    public readonly value: string,
  ) {}

  /**
   * Returns the string representation of the signature value.
   * Used when configuring the action group in CloudFormation.
   */
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
   * @default - A unique name is generated in the format 'action_group_quick_start_UUID'
   */
  readonly name?: string;

  /**
   * A description of the action group.
   *
   * @default undefined - No description is provided
   */
  readonly description?: string;

  /**
   * The API Schema defining the functions available to the agent.
   *
   * @default undefined - No API Schema is provided
   */
  readonly apiSchema?: ApiSchema;

  /**
   * The action group executor that implements the API functions.
   *
   * @default undefined - No executor is provided
   */
  readonly executor?: ActionGroupExecutor;

  /**
   * Specifies whether the action group is available for the agent to invoke or
   * not when sending an InvokeAgent request.
   *
   * @default true - The action group is enabled
   */
  readonly enabled?: boolean;

  /**
   * Specifies whether to delete the resource even if it's in use.
   *
   * @default false - The resource will not be deleted if it's in use
   */
  readonly forceDelete?: boolean;

  /**
   * Defines functions that each define parameters that the agent needs to invoke from the user.
   * NO L2 yet as this doesn't make much sense IMHO.
   *
   * @default undefined - No function schema is provided
   */
  readonly functionSchema?: FunctionSchema;

  /**
   * The AWS Defined signature for enabling certain capabilities in your agent.
   * When this property is specified, you must leave the description, apiSchema,
   * and actionGroupExecutor fields blank for this action group.
   *
   * @default undefined - No parent action group signature is provided
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
  public readonly functionSchema?: FunctionSchema;
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
    this.name = props.name ?? `action_group_quick_start_${crypto.randomUUID()}`;
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
      throw new ValidationError(
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
      functionSchema: this.functionSchema?._render(),
      parentActionGroupSignature: this.parentActionGroupSignature?.toString(),
      skipResourceInUseCheckOnDelete: this.forceDelete,
    };
  }
}
