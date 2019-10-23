import { NestedStack } from '@aws-cdk/aws-cloudformation';
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Construct, Stack } from '@aws-cdk/core';
import path = require('path');
import { AsyncCustomResourceProps } from '.';
import { calculateRetryPolicy } from '../util';
import consts = require('./handler/consts');

const HANDLER_PATH = path.join(__dirname, 'handler');

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

    validateHandlerSpec('onEvent', this.userOnEventHandler);
    validateHandlerSpec('isComplete', this.userIsCompleteHandler);

    this.userCodeLayer = new lambda.LayerVersion(this, 'user-layer', {
      description: 'async custom resource user code',
      code: props.handlerCode,
    });

    const isCompleteTask = this.createTask(consts.IS_COMPLETE_ENTRYPOINT);
    isCompleteTask.addCatch(this.createTask(consts.TIMEOUT_ENTRYPOINT));
    isCompleteTask.addRetry(calculateRetryPolicy(props));

    const waiterStateMachine = new sfn.StateMachine(this, 'waiter-state-machine', {
      definition: isCompleteTask
    });

    this.onEventHandler = this.createHandler(consts.ON_EVENT_ENTRYPOINT);

    // the on-event entrypoint is going to start the execution of the waiter
    this.onEventHandler.addEnvironment(consts.ENV_WAITER_STATE_MACHINE_ARN, waiterStateMachine.stateMachineArn);
    waiterStateMachine.grantStartExecution(this.onEventHandler);
  }

  private createHandler(entrypoint: string) {
    return new lambda.Function(this, `${entrypoint}-handler`, {
      code: lambda.Code.fromAsset(HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `index.${entrypoint}`,
      layers: [ this.userCodeLayer ],
      environment: {
        [consts.ENV_ON_EVENT_USER_HANDLER]: this.userOnEventHandler,
        [consts.ENV_IS_COMPLETE_USER_HANDLER]: this.userIsCompleteHandler
      }
    });
  }

  private createTask(entrypoint: string) {
    return new sfn.Task(this, `${entrypoint}-task`, {
      task: new tasks.InvokeFunction(this.createHandler(entrypoint)),
    });
  }
}

function validateHandlerSpec(name: string, spec: string) {
  if (spec.split('.').length !== 2) {
    throw new Error(`Invalid handler specification for ${name} ("${spec}"). Format is "<filename>.<export>"`);
  }
}