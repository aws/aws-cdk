import { IConstruct } from 'constructs';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';

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
}

/**
 * Interface for deployment lifecycle hook targets
 */
export interface IDeploymentLifecycleHookTarget {
  /**
   * Bind this target to a deployment lifecycle hook
   *
   * @param scope The construct scope
   * @param id A unique identifier for this binding
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
    };
  }
}
