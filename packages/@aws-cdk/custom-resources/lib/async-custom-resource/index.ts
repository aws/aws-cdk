import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { ProviderStack } from './provider';

export interface AsyncCustomResourceProps {
  readonly uuid: string;
  readonly properties?: { [name: string]: any };
  readonly resourceType?: string;
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The handler JavaScript code for the custom resource (Node.js 10.x).
   *
   * Must contain the handler files with the approriate exports as defined by `onEventHandler`
   * and `isCompleteHandler`. The defaults are `index.onEvent` and `index.isComplete`.
   */
  readonly handlerCode: lambda.Code;

  /**
   * The JavaScript function to invoke for all resource lifecycle
   * operations (CREATE/UPDATE/DELETE).
   *
   * The syntax is `<file>.<function>` (similar to the AWS Lambda API for
   * JavaScript).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   *
   * @default "index.handler"
   */
  readonly onEventHandler?: string;

  /**
   * The JavaScript function to invoke in order to determine if the operation is
   * complete.
   *
   * The syntax is `<file>.<function>` (similar to the AWS Lambda API for
   * JavaScript).
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   *
   */
  readonly isCompleteHandler?: string;

  /**
   * Time between calls to the `isComplete` handler which determines if the
   * resource has been stabilized.
   *
   * The first `isComplete` will be called immediately after `handler` and then
   * every `queryInterval` seconds, and until `timeout` has been reached or until
   * `isComplete` returns `true`.
   *
   * @default Duration.seconds(5)
   */
  readonly queryInterval?: Duration;

  /**
   * Total timeout for the entire operation.
   *
   * The maximum timeout is 2 hours (yes, it can exceed the AWS Lambda 15 minutes)
   *
   * @default Duration.minutes(30)
   */
  readonly totalTimeout?: Duration;
}

export class AsyncCustomResource extends cfn.CustomResource {
  constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    const handlerStack = ProviderStack.getOrCreate(scope, props);

    super(scope, id, {
      provider: cfn.CustomResourceProvider.lambda(handlerStack.onEventHandler),
      resourceType: props.resourceType,
      properties: props.properties,
      removalPolicy: props.removalPolicy
    });
  }
}
