import { NestedStack } from '@aws-cdk/aws-cloudformation';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Construct, Stack } from '@aws-cdk/core';
import path = require('path');
import { AsyncCustomResourceProps } from '.';
import consts = require('./runtime/consts');
import { calculateRetryPolicy } from './util';

const RUNTIME_HANDLER_PATH = path.join(__dirname, 'runtime');

export class ProviderStack extends NestedStack {
  /**
   * Gets or creates the singleton nested stack that contains the handler resources.
   */
  public static getOrCreate(scope: Construct, props: AsyncCustomResourceProps) {
    const stack = Stack.of(scope);
    const id = 'AsyncCustomResourceProvider:' + props.uuid;
    const exists = stack.node.tryFindChild(id) as ProviderStack;
    if (exists) {
      return exists;
    }

    return new ProviderStack(stack, id, props);
  }

  public readonly entrypoint: lambda.Function;
  public readonly userOnEventFunction: lambda.Function;
  public readonly userIsCompleteFunction: lambda.Function;

  private constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    super(scope, id);

    this.userOnEventFunction = new lambda.Function(this, 'user-on-event-function', {
      code: props.code,
      runtime: props.runtime,
      handler: props.onEventHandler,
    });

    this.userIsCompleteFunction = new lambda.Function(this, 'user-is-complete-function', {
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
  }

  private createFunction(entrypoint: string) {
    const fn = new lambda.Function(this, `${entrypoint}-handler`, {
      code: lambda.Code.fromAsset(RUNTIME_HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `index.${entrypoint}`,
      environment: {
        [consts.ENV_USER_IS_COMPLETE_FUNCTION_ARN]: this.userIsCompleteFunction.functionArn,
        [consts.ENV_USER_ON_EVENT_FUNCTION_ARN]: this.userOnEventFunction.functionArn,
      }
    });

    this.userIsCompleteFunction.grantInvoke(fn);
    this.userOnEventFunction.grantInvoke(fn);

    return fn;
  }

  private createTask(handler: lambda.Function) {
    return new sfn.Task(this, `${handler.node.id}-task`, {
      task: new tasks.InvokeFunction(handler),
    });
  }
}
