// tslint:disable: max-line-length
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Construct, Duration } from '@aws-cdk/core';
import path = require('path');
import consts = require('./runtime/consts');
import { calculateRetryPolicy } from './util';

const RUNTIME_HANDLER_PATH = path.join(__dirname, 'runtime');

/**
 * Initialization properties for the `Provider` construct.
 */
export interface ProviderProps {

  /**
   * The AWS Lambda function to invoke for all resource lifecycle operations
   * (CREATE/UPDATE/DELETE).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   */
  readonly onEventHandler: lambda.IFunction;

  /**
   * The AWS Lambda function to invoke in order to determine if the operation is
   * complete.
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   *
   * @default - provider is synchronous. This means that the `onEvent` handler
   * is expected to finish all lifecycle operations within the initial invocation.
   */
  readonly isCompleteHandler?: lambda.IFunction;

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
export class Provider extends Construct {
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
   *      provider: cfn.CustomResourceProvider.lambda(provider.entrypoint)
   *    });
   */
  public readonly entrypoint: lambda.IFunction;

  /**
   * The user-defined AWS Lambda function which is invoked for all resource
   * lifecycle operations (CREATE/UPDATE/DELETE).
   */
  public readonly onEventHandler: lambda.IFunction;

  /**
   * The user-defined AWS Lambda function which is invoked asynchronously in
   * order to determine if the operation is complete.
   */
  public readonly isCompleteHandler?: lambda.IFunction;

  constructor(scope: Construct, id: string, props: ProviderProps) {
    super(scope, id);

    if (!props.isCompleteHandler && (props.queryInterval || props.totalTimeout)) {
      throw new Error(`"queryInterval" and "totalTimeout" can only be configured if "isCompleteHandler" is specified. Otherwise, they have no meaning`);
    }

    this.onEventHandler = props.onEventHandler;
    this.isCompleteHandler = props.isCompleteHandler;

    const onEventFunction = this.createFunction(consts.FRAMEWORK_ON_EVENT_HANDLER_NAME);

    if (this.isCompleteHandler) {
      const isCompleteFunction = this.createFunction(consts.FRAMEWORK_IS_COMPLETE_HANDLER_NAME);
      const timeoutFunction = this.createFunction(consts.FRAMEWORK_ON_TIMEOUT_HANDLER_NAME);

      const isCompleteTask = this.createTask(isCompleteFunction);
      isCompleteTask.addCatch(this.createTask(timeoutFunction));
      isCompleteTask.addRetry(calculateRetryPolicy(props));

      const waiterStateMachine = new sfn.StateMachine(this, 'waiter-state-machine', {
        definition: isCompleteTask
      });

      // the on-event entrypoint is going to start the execution of the waiter
      onEventFunction.addEnvironment(consts.WAITER_STATE_MACHINE_ARN_ENV, waiterStateMachine.stateMachineArn);
      waiterStateMachine.grantStartExecution(onEventFunction);
    }

    this.entrypoint = onEventFunction;
  }

  private createFunction(entrypoint: string) {
    const fn = new lambda.Function(this, `framework-${entrypoint}`, {
      code: lambda.Code.fromAsset(RUNTIME_HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `framework.${entrypoint}`,
    });

    fn.addEnvironment(consts.USER_ON_EVENT_FUNCTION_ARN_ENV, this.onEventHandler.functionArn);
    this.onEventHandler.grantInvoke(fn);

    if (this.isCompleteHandler) {
      fn.addEnvironment(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, this.isCompleteHandler.functionArn);
      this.isCompleteHandler.grantInvoke(fn);
    }

    return fn;
  }

  private createTask(handler: lambda.Function) {
    return new sfn.Task(this, `${handler.node.id}-task`, {
      task: new tasks.InvokeFunction(handler),
    });
  }
}
