import { Duration, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DestinationType, IDestination } from './destination';
import { IFunction } from './function-base';
import { CfnEventInvokeConfig } from './lambda.generated';

/**
 * Options to add an EventInvokeConfig to a function.
 */
export interface EventInvokeConfigOptions {
  /**
   * The destination for failed invocations.
   *
   * @default - no destination
   */
  readonly onFailure?: IDestination;

  /**
   * The destination for successful invocations.
   *
   * @default - no destination
   */
  readonly onSuccess?: IDestination;

  /**
   * The maximum age of a request that Lambda sends to a function for
   * processing.
   *
   * Minimum: 60 seconds
   * Maximum: 6 hours
   *
   * @default Duration.hours(6)
   */
  readonly maxEventAge?: Duration;

  /**
   * The maximum number of times to retry when the function returns an error.
   *
   * Minimum: 0
   * Maximum: 2
   *
   * @default 2
   */
  readonly retryAttempts?: number;
}

/**
 * Properties for an EventInvokeConfig
 */
export interface EventInvokeConfigProps extends EventInvokeConfigOptions {
  /**
   * The Lambda function
   */
  readonly function: IFunction;

  /**
   * The qualifier
   *
   * @default - latest version
   */
  readonly qualifier?: string;
}

/**
 * Configure options for asynchronous invocation on a version or an alias
 *
 * By default, Lambda retries an asynchronous invocation twice if the function
 * returns an error. It retains events in a queue for up to six hours. When an
 * event fails all processing attempts or stays in the asynchronous invocation
 * queue for too long, Lambda discards it.
 */
export class EventInvokeConfig extends Resource {
  constructor(scope: Construct, id: string, props: EventInvokeConfigProps) {
    super(scope, id);

    if (props.maxEventAge && (props.maxEventAge.toSeconds() < 60 || props.maxEventAge.toSeconds() > 21600)) {
      throw new Error('`maximumEventAge` must represent a `Duration` that is between 60 and 21600 seconds.');
    }

    if (props.retryAttempts && (props.retryAttempts < 0 || props.retryAttempts > 2)) {
      throw new Error('`retryAttempts` must be between 0 and 2.');
    }

    new CfnEventInvokeConfig(this, 'Resource', {
      destinationConfig: props.onFailure || props.onSuccess
        ? {
          ...props.onFailure ? { onFailure: props.onFailure.bind(this, props.function, { type: DestinationType.FAILURE }) } : {},
          ...props.onSuccess ? { onSuccess: props.onSuccess.bind(this, props.function, { type: DestinationType.SUCCESS }) } : {},
        }
        : undefined,
      functionName: props.function.functionName,
      maximumEventAgeInSeconds: props.maxEventAge && props.maxEventAge.toSeconds(),
      maximumRetryAttempts: props.retryAttempts !== undefined ? props.retryAttempts : undefined,
      qualifier: props.qualifier || '$LATEST',
    });
  }
}
