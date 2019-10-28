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
    const id = props.uuid;
    const exists = stack.node.tryFindChild(id) as ProviderStack;
    if (exists) {
      return exists;
    }

    return new ProviderStack(stack, id, props);
  }

  public readonly onEventHandler: lambda.Function;

  private readonly userOnEventHandler: string;
  private readonly userIsCompleteHandler: string;
  private readonly userCodeLayer: lambda.LayerVersion;

  private constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    super(scope, id);

    this.userOnEventHandler = props.onEventHandler || 'index.onEvent';
    this.userIsCompleteHandler = props.isCompleteHandler || 'index.isComplete';

    this.userCodeLayer = new lambda.LayerVersion(this, 'user-layer', {
      description: 'async custom resource user code',
      code: props.handlerCode,
    });

    const isCompleteTask = this.createTask('isCompleteHandler');
    isCompleteTask.addCatch(this.createTask('timeoutHandler'));
    isCompleteTask.addRetry(calculateRetryPolicy(props));

    const waiterStateMachine = new sfn.StateMachine(this, 'waiter-state-machine', {
      definition: isCompleteTask
    });

    this.onEventHandler = this.createHandler('onEventHandler');

    // the on-event entrypoint is going to start the execution of the waiter
    this.onEventHandler.addEnvironment(consts.ENV_WAITER_STATE_MACHINE_ARN, waiterStateMachine.stateMachineArn);
    waiterStateMachine.grantStartExecution(this.onEventHandler);
  }

  private createHandler(entrypoint: string) {
    const { file: onEventFile, func: onEventFunc } = parseHandler('onEvent', this.userOnEventHandler);
    const { file: isCompleteFile, func: isCompleteFunc } = parseHandler('isComplete', this.userIsCompleteHandler);

    return new lambda.Function(this, `${entrypoint}-handler`, {
      code: lambda.Code.fromAsset(RUNTIME_HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `index.${entrypoint}`,
      layers: [ this.userCodeLayer ],
      environment: {
        [consts.ENV_IS_COMPLETE_USER_HANDLER_FILE]: isCompleteFile,
        [consts.ENV_IS_COMPLETE_USER_HANDLER_FUNCTION]: isCompleteFunc,
        [consts.ENV_ON_EVENT_USER_HANDLER_FILE]: onEventFile,
        [consts.ENV_ON_EVENT_USER_HANDLER_FUNCTION]: onEventFunc
      }
    });
  }

  private createTask(entrypoint: string) {
    return new sfn.Task(this, `${entrypoint}-task`, {
      task: new tasks.InvokeFunction(this.createHandler(entrypoint)),
    });
  }
}

function parseHandler(name: string, spec: string) {
  const parts = spec.split('.');
  if (parts.length !== 2) {
    throw new Error(`Invalid handler specification for ${name} ("${spec}"). Format is "<filename>.<export-function>"`);
  }

  const [ file, func ] = parts;
  return { file, func };
}