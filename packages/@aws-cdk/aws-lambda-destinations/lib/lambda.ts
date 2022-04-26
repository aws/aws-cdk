import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';

import { EventBridgeDestination } from './event-bridge';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Options for a Lambda destination
 */
export interface LambdaDestinationOptions {
  /**
   * Whether the destination function receives only the `responsePayload` of
   * the source function.
   *
   * When set to `true` and used as `onSuccess` destination, the destination
   * function will be invoked with the payload returned by the source function.
   *
   * When set to `true` and used as `onFailure` destination, the destination
   * function will be invoked with the error object returned by source function.
   *
   * See the README of this module to see a full explanation of this option.
   *
   * @default false The destination function receives the full invocation record.
   */
  readonly responseOnly?: boolean;
}

/**
 * Use a Lambda function as a Lambda destination
 */
export class LambdaDestination implements lambda.IDestination {
  constructor(private readonly fn: lambda.IFunction, private readonly options: LambdaDestinationOptions = {}) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(scope: Construct, fn: lambda.IFunction, options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // Normal Lambda destination (full invocation record)
    if (!this.options.responseOnly) {
      // deduplicated automatically
      this.fn.grantInvoke(fn);

      return {
        destination: this.fn.functionArn,
      };
    }

    // Otherwise add rule to extract the response payload and use EventBridge
    // as destination
    if (!options) { // `options` added to bind() as optionnal to avoid breaking change
      throw new Error('Options must be defined when using `responseOnly`.');
    }

    // Match invocation result of the source function (`fn`) and use it
    // to trigger the destination function (`this.fn`).
    new events.Rule(scope, options.type, {
      eventPattern: {
        detailType: [`Lambda Function Invocation Result - ${options.type}`],
        resources: [`${fn.functionArn}:$LATEST`],
        source: ['lambda'],
      },
      targets: [
        new targets.LambdaFunction(this.fn, {
          event: events.RuleTargetInput.fromEventPath('$.detail.responsePayload'), // Extract response payload
        }),
      ],
    });

    const destination = new EventBridgeDestination(); // Use default event bus here
    return destination.bind(scope, fn);
  }
}
