import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { Construct, Duration, RemovalPolicy, Stack } from '@aws-cdk/core';
import path = require('path');

export interface AsyncCustomResourceProps {
  readonly uuid: string;
  readonly properties?: { [name: string]: any };
  readonly resourceType?: string;
  readonly removalPolicy?: RemovalPolicy;

  /**
   * How many seconds to wait initially before retrying
   *
   * @default Duration.seconds(1)
   */
  readonly interval?: Duration;

  /**
   * How many times to retry this particular error.
   *
   * May be 0 to disable retry for specific errors (in case you have
   * a catch-all retry policy).
   *
   * @default 3
   */
  readonly maxAttempts?: number;

  /**
   * Multiplication for how much longer the wait interval gets on every retry
   *
   * @default 2
   */
  readonly backoffRate?: number;
}

export class AsyncCustomResource extends cfn.CustomResource {
  constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    const handlerStack = getCreateHandlerStack(scope, props);

    super(scope, id, {
      provider: cfn.CustomResourceProvider.lambda(handlerStack.begin),
      resourceType: props.resourceType,
      properties: props.properties,
      removalPolicy: props.removalPolicy
    });
  }
}

function getCreateHandlerStack(scope: Construct, props: AsyncCustomResourceProps) {
  const stack = Stack.of(scope);
  const id = props.uuid;
  const exists = stack.node.tryFindChild(id) as HandlerStack;
  if (exists) {
    return exists;
  }

  return new HandlerStack(stack, id, props);
}

const HANDLER_PATH = path.join(__dirname, 'async-custom-resource-provider');

class HandlerStack extends Stack {
  public readonly begin: lambda.Function;

  constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    super(scope, id, { stackName: id });

    const completeTask = this.taskForEntrypoint('complete');
    completeTask.addCatch(this.taskForEntrypoint('timeout'));
    completeTask.addRetry({
      maxAttempts: props.maxAttempts,
      interval: props.interval,
      backoffRate: props.backoffRate,
    });

    const stateMachine = new sfn.StateMachine(this, 'state-machine', {
      definition: completeTask
    });

    this.begin = this.handlerForEntrypoint('begin');
    this.begin.addEnvironment('STATE_MACHINE_ARN', stateMachine.stateMachineArn);
    stateMachine.grantStartExecution(this.begin);
  }

  private handlerForEntrypoint(entrypoint: string) {
    return new lambda.Function(this, `${entrypoint}-handler`, {
      code: lambda.Code.fromAsset(HANDLER_PATH),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: `index.${entrypoint}`
    });
  }

  private taskForEntrypoint(entrypoint: string) {
    return new sfn.Task(this, `${entrypoint}-task`, {
      task: new tasks.InvokeFunction(this.handlerForEntrypoint(entrypoint)),
    });
  }
}
