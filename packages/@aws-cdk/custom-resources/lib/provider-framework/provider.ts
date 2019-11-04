import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Construct, Duration } from '@aws-cdk/core';
import path = require('path');
import consts = require('./runtime/consts');
import { calculateRetryPolicy } from './util';

const RUNTIME_HANDLER_PATH = path.join(__dirname, 'runtime');

export interface ProviderProps {
  /**
   * The handler JavaScript code for the custom resource (Node.js 10.x).
   *
   * Must contain the handler files with the approriate exports as defined by `onEventHandler`
   * and `isCompleteHandler`. The defaults are `index.onEvent` and `index.isComplete`.
   */
  readonly code: lambda.Code;

  /**
   * The AWS Lambda runtime to use. Currently, only NodeJS runtimes are supported.
   */
  readonly runtime: lambda.Runtime;

  /**
   * The function to invoke for all resource lifecycle operations
   * (CREATE/UPDATE/DELETE).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   */
  readonly onEventHandler: string;

  /**
   * The function to invoke in order to determine if the operation is
   * complete.
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   */
  readonly isCompleteHandler: string;

  /**
   * Policy statements to add to the IAM role that executes the user handlers.
   *
   * The `Provider` class also implements `iam.IGrantable`, which means you can
   * use it as a target of `grantFoo` methods (e.g.
   * `bucket.grantRead(provider)`).
   *
   * Bear in mind that usually there is a single provider which handles
   * provisioning for multiple resources, so it's execution role should allow it
   * to manage multiple resources of the same type.
   *
   * @default - empty policy
   */
  readonly policy?: iam.PolicyStatement[];

  /**
   * Time between calls to the `isComplete` handler which determines if the
   * resource has been stabilized.
   *
   * The first `isComplete` will be called immediately after `handler` and then
   * every `queryInterval` seconds, and until `timeout` has been reached or until
   * `isComplete` returns `true`.
   *
   * @default Duration.seconds(5)
   */
  readonly queryInterval?: Duration;

  /**
   * Total timeout for the entire operation.
   *
   * The maximum timeout is 2 hours (yes, it can exceed the AWS Lambda 15 minutes)
   *
   * @default Duration.minutes(30)
   */
  readonly totalTimeout?: Duration;
}

/**
 * Defines an AWS CloudFormation custom resource provider.
 */
export class Provider extends Construct implements iam.IGrantable {
  /**
   * The entrypoint of the custom resource provider.
   *
   * Use this when defining custom resources:
   *
   * @example
   *
   *    import cr = require('@aws-cdk/custom-resources');
   *    import cfn = require('@aws-cdk/aws-cloudformation');
   *
   *    const provider = new cr.Provider(this, 'MyProvider', { ... })
   *
   *    new cfn.CustomResource(this, 'MyResource', {
   *      provider: cfn.CustomResourceProvider.fromLambda(provider)
   *    });
   */
  public readonly entrypoint: lambda.Function;

  public readonly grantPrincipal: iam.IPrincipal;

  private userOnEvent: lambda.Function;
  private userIsComplete: lambda.Function;

  public constructor(scope: Construct, id: string, props: ProviderProps) {
    super(scope, id);

    this.userOnEvent = new lambda.Function(this, 'user-on-event-function', {
      code: props.code,
      runtime: props.runtime,
      handler: props.onEventHandler,
    });

    this.userIsComplete = new lambda.Function(this, 'user-is-complete-function', {
      code: props.code,
      runtime: props.runtime,
      handler: props.isCompleteHandler
    });

    const onEventFunction = this.createFunction('onEventHandler');
    const isCompleteFunction = this.createFunction('isCompleteHandler');
    const timeoutFunction = this.createFunction('timeoutHandler');

    const isCompleteTask = this.createTask(isCompleteFunction);
    isCompleteTask.addCatch(this.createTask(timeoutFunction));
    isCompleteTask.addRetry(calculateRetryPolicy(props));

    const waiterStateMachine = new sfn.StateMachine(this, 'waiter-state-machine', {
      definition: isCompleteTask
    });

    // the on-event entrypoint is going to start the execution of the waiter
    onEventFunction.addEnvironment(consts.ENV_WAITER_STATE_MACHINE_ARN, waiterStateMachine.stateMachineArn);
    waiterStateMachine.grantStartExecution(onEventFunction);

    this.entrypoint = onEventFunction;

    this.grantPrincipal = new MultiRole([
      this.userOnEvent.role!,
      this.userIsComplete.role!
    ]);
  }

  private createFunction(entrypoint: string) {
    const fn = new lambda.Function(this, `${entrypoint}-handler`, {
      code: lambda.Code.fromAsset(RUNTIME_HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `index.${entrypoint}`,
      environment: {
        [consts.ENV_USER_IS_COMPLETE_FUNCTION_ARN]: this.userIsComplete.functionArn,
        [consts.ENV_USER_ON_EVENT_FUNCTION_ARN]: this.userOnEvent.functionArn,
      }
    });

    this.userIsComplete.grantInvoke(fn);
    this.userOnEvent.grantInvoke(fn);

    return fn;
  }

  private createTask(handler: lambda.Function) {
    return new sfn.Task(this, `${handler.node.id}-task`, {
      task: new tasks.InvokeFunction(handler),
    });
  }
}

/**
 * An IAM principal that represents multiple roles with the same policy.
 *
 * `assumeRoleAction` or `policyFragment` are not supported.
 */
class MultiRole implements iam.IPrincipal {
  public readonly grantPrincipal = this;

  constructor(private readonly roles: iam.IRole[]) { }

  public get assumeRoleAction(): string { throw new Error('not supported'); }
  public get policyFragment(): iam.PrincipalPolicyFragment { throw new Error('not supported'); }

  public addToPolicy(statement: iam.PolicyStatement): boolean {
    for (const role of this.roles) {
      role.addToPolicy(statement);
    }

    return true;
  }
}
