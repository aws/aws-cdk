import { IConstruct } from 'constructs';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { Fn } from '../../core';

/**
 * Error thrown when hook details validation fails
 */
class HookDetailsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HookDetailsValidationError';
  }
}

/**
 * Validates that input is a valid JSON object and returns it as a stringified JSON using Fn::ToJsonString
 * @param hookDetails The input to validate (must be a JSON object)
 * @returns The stringified JSON using CloudFormation's Fn::ToJsonString intrinsic function
 * @throws HookDetailsValidationError if the input is not a valid JSON object
 */
export function stringifyHookDetails(hookDetails: any): string {
  // Reject arrays
  if (Array.isArray(hookDetails)) {
    throw new HookDetailsValidationError('hookDetails must be a JSON object, got: array');
  }

  // Check if it's a plain object
  if (typeof hookDetails === 'object' && hookDetails.constructor === Object) {
    return Fn.toJsonString(hookDetails);
  }

  // Everything else is invalid (primitives, functions, dates, etc.)
  throw new HookDetailsValidationError(`hookDetails must be a JSON object, got: ${typeof hookDetails}`);
}

/**
 * Deployment lifecycle stages where hooks can be executed
 */
export enum DeploymentLifecycleStage {
  /**
   * Execute during service reconciliation
   */
  RECONCILE_SERVICE = 'RECONCILE_SERVICE',
  /**
   * Execute before scaling up tasks
   */
  PRE_SCALE_UP = 'PRE_SCALE_UP',
  /**
   * Execute after scaling up tasks
   */
  POST_SCALE_UP = 'POST_SCALE_UP',
  /**
   * Execute during test traffic shift
   */
  TEST_TRAFFIC_SHIFT = 'TEST_TRAFFIC_SHIFT',
  /**
   * Execute after test traffic shift
   */
  POST_TEST_TRAFFIC_SHIFT = 'POST_TEST_TRAFFIC_SHIFT',
  /**
   * Execute during production traffic shift
   */
  PRODUCTION_TRAFFIC_SHIFT = 'PRODUCTION_TRAFFIC_SHIFT',
  /**
   * Execute after production traffic shift
   */
  POST_PRODUCTION_TRAFFIC_SHIFT = 'POST_PRODUCTION_TRAFFIC_SHIFT',
}

/**
 * Configuration for a deployment lifecycle hook target
 */
export interface DeploymentLifecycleHookTargetConfig {
  /**
   * The ARN of the target resource
   */
  readonly targetArn: string;

  /**
   * The IAM role that grants permissions to invoke the target
   * @default - a role will be created automatically
   */
  readonly role?: iam.IRole;

  /**
   * The lifecycle stages when this hook should be executed
   */
  readonly lifecycleStages: DeploymentLifecycleStage[];

  /**
   * Use this field to specify custom parameters that Amazon ECS will pass to your hook target invocations (such as a Lambda function).
   * @default - No custom parameters will be passed
   */
  readonly hookDetails?: string;
}

/**
 * Interface for deployment lifecycle hook targets
 */
export interface IDeploymentLifecycleHookTarget {
  /**
   * Bind this target to a deployment lifecycle hook
   *
   * @param scope The construct scope
   */
  bind(scope: IConstruct): DeploymentLifecycleHookTargetConfig;
}

/**
 * Configuration for a lambda deployment lifecycle hook
 */
export interface DeploymentLifecycleLambdaTargetProps {
  /**
   * The IAM role that grants permissions to invoke the lambda target
   * @default - A unique role will be generated for this lambda function.
   */
  readonly role?: iam.IRole;

  /**
   * The lifecycle stages when this hook should be executed
   */
  readonly lifecycleStages: DeploymentLifecycleStage[];

  /**
   * Use this field to specify custom parameters that Amazon ECS will pass to your hook target invocations (such as a Lambda function).
   *
   * This field accepts JSON objects only
   *
   * @example
   * // JSON object
   * hookDetails: {environment:"production",timeout:300}
   *
   * @default - No custom parameters will be passed
   */
  readonly hookDetails?: any;
}

/**
 * Use an AWS Lambda function as a deployment lifecycle hook target
 */
export class DeploymentLifecycleLambdaTarget implements IDeploymentLifecycleHookTarget {
  private _role?: iam.IRole;

  constructor(
    private readonly handler: lambda.IFunction,
    private readonly id: string,
    private readonly props: DeploymentLifecycleLambdaTargetProps,
  ) { }

  /**
   * The IAM role for the deployment lifecycle hook target
   */
  public get role(): iam.IRole {
    return this._role!;
  }

  /**
   * Bind this target to a deployment lifecycle hook
   */
  public bind(scope: IConstruct): DeploymentLifecycleHookTargetConfig {
    // Create role if not provided
    this._role = this.props.role;
    if (!this._role) {
      this._role = new iam.Role(scope, `${this.id}Role`, {
        assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
      });
      this.handler.grantInvoke(this._role);
    }

    return {
      targetArn: this.handler.functionArn,
      role: this._role,
      lifecycleStages: this.props.lifecycleStages,
      hookDetails: (this.props.hookDetails === undefined || this.props.hookDetails === null)?
        this.props.hookDetails : stringifyHookDetails(this.props.hookDetails),
    };
  }
}
