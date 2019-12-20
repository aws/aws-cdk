import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { EventBridgeDestination } from './event-bridge';

/**
 * Properties for a LambdaChain
 */
export interface LambdaChainProps {
  /**
   * The functions to chain.
   *
   * The functions cannot already have an asynchronous invocation
   * configuration.
   */
  readonly functions: lambda.IFunction[];

  /**
   * The event bus to use.
   *
   * @default - default event bus
   */
  readonly eventBus?: events.IEventBus;

  /**
   * The destination for failed invocations.
   *
   * This destination will not be applied to the last function of the chain.
   *
   * @default - no destination
   */
  readonly onFailure?: lambda.IDestination;
}

/**
 * Creates a chain of asynchronous Lambda invocations.
 *
 * The response payload of a **successful** invocation of a function in the
 * chain is passed as request payload to the next function automatically using
 * EventBridge.
 */
export class LambdaChain extends Construct {
  constructor(scope: Construct, id: string, props: LambdaChainProps) {
    super(scope, id);

    let previousFn = props.functions[0];

    for (const [idx, fn] of props.functions.entries()) {
      // Configure destinations for all functions except the last one
      if (idx < props.functions.length - 1) {
        fn.configureAsyncInvoke({
          onFailure: props.onFailure,
          onSuccess: new EventBridgeDestination(props.eventBus),
        });
      }

      if (idx > 0) { // Only for the tail
        // Match invocation result of previous function in the chain
        const rule = new events.Rule(this, `Rule${idx}`, {
          eventPattern: {
            detailType: ['Lambda Function Invocation Result - Success'],
            resources: [`${previousFn.functionArn}:$LATEST`],
            source: ['lambda'],
          },
        });

        // Use it to trigger current function in the chain
        rule.addTarget(new targets.LambdaFunction(fn, {
          event: events.RuleTargetInput.fromEventPath('$.detail.responsePayload')
        }));
      }

      previousFn = fn;
    }
  }
}
