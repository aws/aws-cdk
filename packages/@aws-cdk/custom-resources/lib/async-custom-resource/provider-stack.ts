import { NestedStack } from '@aws-cdk/aws-cloudformation';
import iam = require('@aws-cdk/aws-iam');
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

  public readonly onEventFunction: lambda.Function;

  public readonly roles: iam.IRole[];

  private readonly onEventUserHandlerName: string;
  private readonly isCompleteUserHandlerName: string;
  private readonly userCodeLayer: lambda.LayerVersion;

  private constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    super(scope, id);

    this.onEventUserHandlerName = props.onEventHandler || 'index.onEvent';
    this.isCompleteUserHandlerName = props.isCompleteHandler || 'index.isComplete';

    this.userCodeLayer = new lambda.LayerVersion(this, 'user-layer', {
      description: 'async custom resource user code',
      code: props.handlerCode,
    });

    const onEventFunction = this.createFunction('onEventHandler');
    const isCompleteFunction = this.createFunction('isCompleteHandler');
    const timeoutFunction = this.createFunction('timeoutHandler');

    this.roles = [ isCompleteFunction, onEventFunction ].map(f => f.role!);

    const isCompleteTask = this.createTask(isCompleteFunction);
    isCompleteTask.addCatch(this.createTask(timeoutFunction));
    isCompleteTask.addRetry(calculateRetryPolicy(props));

    const waiterStateMachine = new sfn.StateMachine(this, 'waiter-state-machine', {
      definition: isCompleteTask
    });

    // the on-event entrypoint is going to start the execution of the waiter
    onEventFunction.addEnvironment(consts.ENV_WAITER_STATE_MACHINE_ARN, waiterStateMachine.stateMachineArn);
    waiterStateMachine.grantStartExecution(onEventFunction);

    this.onEventFunction = onEventFunction;
  }

  private createFunction(entrypoint: string) {
    const { file: onEventFile, func: onEventFunc } = parseHandler('onEvent', this.onEventUserHandlerName);
    const { file: isCompleteFile, func: isCompleteFunc } = parseHandler('isComplete', this.isCompleteUserHandlerName);

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

  private createTask(handler: lambda.Function) {
    return new sfn.Task(this, `${handler.node.id}-task`, {
      task: new tasks.InvokeFunction(handler),
    });
  }
}

function parseHandler(name: string, spec: string) {
  const parts = spec.split('.');
  if (parts.length !== 2) {
    throw new Error(`Invalid handler specification for ${name} ("${spec}"). Format is "<filename>.<export-function>"`);
  }

  const [ file, func ] = parts;
  return { file: `/opt/${file}.js`, func }; // `/opt` is where layers are mounted
}