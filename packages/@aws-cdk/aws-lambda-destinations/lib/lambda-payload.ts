import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { EventBridgeDestination } from './event-bridge';

/**
 * Use a Lambda function as a Lambda destination.
 *
 * The Lambda function receives the **exact** payload returned by the origin
 * Lambda function.
 */
export class LambdaPayloadDestination extends EventBridgeDestination implements lambda.IDestination {
  constructor(private readonly fn: lambda.IFunction) {
    super(); // Use default event bus
  }

  /**
   * Returns a destination configuration
   */
  public bind(scope: Construct, fn: lambda.IFunction, type?: lambda.DestinationType): lambda.DestinationConfig {
    // Match invocation result of the function to which this destination is added
    const rule = new events.Rule(scope, `${type}`, {
      eventPattern: {
        detailType: [`Lambda Function Invocation Result - ${type}`],
        resources: [`${fn.functionArn}:$LATEST`],
        source: ['lambda'],
      },
    });

    // Use it to trigger destination function
    rule.addTarget(new targets.LambdaFunction(this.fn, {
      event: events.RuleTargetInput.fromEventPath('$.detail.responsePayload')
    }));

    return super.bind(scope, fn);
  }
}
