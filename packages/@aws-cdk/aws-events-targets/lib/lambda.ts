import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Names, Stack } from '@aws-cdk/core';
import { addLambdaPermission } from './util';

/**
 * Customize the Lambda Event Target
 */
export interface LambdaFunctionProps {
  /**
   * The event to send to the Lambda
   *
   * This will be the payload sent to the Lambda Function.
   *
   * @default the entire EventBridge event
   */
  readonly event?: events.RuleTargetInput;

  /**
   * The SQS Queue to be used as deadLetterQueue.
   *
   * @default none
   */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * Use an AWS Lambda function as an event rule target.
 */
export class LambdaFunction implements events.IRuleTarget {
  constructor(private readonly handler: lambda.IFunction, private readonly props: LambdaFunctionProps = {}) {

  }

  /**
   * Returns a RuleTarget that can be used to trigger this Lambda as a
   * result from an EventBridge event.
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // Allow handler to be called from rule
    addLambdaPermission(rule, this.handler);

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    return {
      id: '',
      arn: this.handler.functionArn,
      deadLetterConfig: { arn: this.props.deadLetterQueue?.queueArn },
      input: this.props.event,
      targetResource: this.handler,
    };
  }
}


function addToDeadLetterQueueResourcePolicy(rule: events.IRule, queue: sqs.IQueue) {
  const ruleParsedStack = Stack.of(rule);
  const queueParsedStack = Stack.of(queue);

  if (ruleParsedStack.region !== queueParsedStack.region) {
    throw new Error(`Cannot assign Dead Letter Queue to the rule ${rule}. Both the queue and the rule must be in the same region`);
  }

  // Skip Resource Policy creation if the Queue is not in the same account.
  // There is no way to add a target onto an imported rule, so we can assume we will run the following code only
  // where the rule is created.

  if (ruleParsedStack.account === queueParsedStack.account) {
    const policyStatementId = `AllowEventRule${Names.nodeUniqueId(rule.node)}`;

    queue.addToResourcePolicy(new iam.PolicyStatement({
      sid: policyStatementId,
      principals: [new iam.ServicePrincipal('events.amazonaws.com')],
      effect: iam.Effect.ALLOW,
      actions: ['sqs:SendMessage'],
      resources: [queue.queueArn],
      conditions: {
        ArnEquals: {
          'aws:SourceArn': rule.ruleArn,
        },
      },
    }));
  } else {
    // Maybe we could post a warning telling the user to create the permission in the target accout ?
  }
}
