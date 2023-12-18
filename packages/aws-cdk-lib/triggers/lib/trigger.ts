import { Construct, IConstruct, Node } from 'constructs';
import * as lambda from '../../aws-lambda';
import { CustomResource, Duration } from '../../core';
import { TriggerProvider } from '../../custom-resource-handlers/dist/triggers/trigger-provider.generated';

/**
 * Interface for triggers.
 */
export interface ITrigger extends IConstruct {
  /**
   * Adds trigger dependencies. Execute this trigger only after these construct
   * scopes have been provisioned.
   *
   * @param scopes A list of construct scopes which this trigger will depend on.
   */
  executeAfter(...scopes: Construct[]): void;

  /**
   * Adds this trigger as a dependency on other constructs. This means that this
   * trigger will get executed *before* the given construct(s).
   *
   * @param scopes A list of construct scopes which will take a dependency on
   * this trigger.
   */
  executeBefore(...scopes: Construct[]): void;
}

/**
 * Options for `Trigger`.
 */
export interface TriggerOptions {
  /**
   * Adds trigger dependencies. Execute this trigger only after these construct
   * scopes have been provisioned.
   *
   * You can also use `trigger.executeAfter()` to add additional dependencies.
   *
   * @default []
   */
  readonly executeAfter?: Construct[];

  /**
   * Adds this trigger as a dependency on other constructs. This means that this
   * trigger will get executed *before* the given construct(s).
   *
   * You can also use `trigger.executeBefore()` to add additional dependants.
   *
   * @default []
   */
  readonly executeBefore?: Construct[];

  /**
   * Re-executes the trigger every time the handler changes.
   *
   * This implies that the trigger is associated with the `currentVersion` of
   * the handler, which gets recreated every time the handler or its
   * configuration is updated.
   *
   * @default true
   */
  readonly executeOnHandlerChange?: boolean;
}

/**
 * The invocation type to apply to a trigger. This determines whether the trigger function should await the result of the to be triggered function or not.
 */
export enum InvocationType {
  /**
   * Invoke the function asynchronously. Send events that fail multiple times to the function's dead-letter queue (if one is configured).
   * The API response only includes a status code.
   */
  EVENT = 'Event',

  /**
   * Invoke the function synchronously. Keep the connection open until the function returns a response or times out.
   * The API response includes the function response and additional data.
   */
  REQUEST_RESPONSE = 'RequestResponse',

  /**
   *  Validate parameter values and verify that the user or role has permission to invoke the function.
   */
  DRY_RUN = 'DryRun'
}

/**
 * Props for `Trigger`.
 */
export interface TriggerProps extends TriggerOptions {
  /**
   * The AWS Lambda function of the handler to execute.
   */
  readonly handler: lambda.Function;

  /**
   * The invocation type to invoke the Lambda function with.
   *
   * @default RequestResponse
   */
  readonly invocationType?: InvocationType;

  /**
   * The timeout of the invocation call of the Lambda function to be triggered.
   *
   * @default Duration.minutes(2)
   */
  readonly timeout?: Duration;
}

/**
 * Triggers an AWS Lambda function during deployment.
 */
export class Trigger extends Construct implements ITrigger {
  constructor(scope: Construct, id: string, props: TriggerProps) {
    super(scope, id);

    const provider = TriggerProvider.getOrCreateProvider(this, 'AWSCDK.TriggerCustomResourceProvider');

    provider.addToRolePolicy({
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: [`${props.handler.functionArn}:*`],
    });

    new CustomResource(this, 'Default', {
      resourceType: 'Custom::Trigger',
      serviceToken: provider.serviceToken,
      properties: {
        HandlerArn: props.handler.currentVersion.functionArn,
        InvocationType: props.invocationType ?? 'RequestResponse',
        Timeout: props.timeout?.toMilliseconds().toString() ?? Duration.minutes(2).toMilliseconds().toString(),
        ExecuteOnHandlerChange: props.executeOnHandlerChange ?? true,
      },
    });

    this.executeAfter(...props.executeAfter ?? []);
    this.executeBefore(...props.executeBefore ?? []);
  }

  public executeAfter(...scopes: Construct[]): void {
    Node.of(this).addDependency(...scopes);
  }

  public executeBefore(...scopes: Construct[]): void {
    for (const s of scopes) {
      Node.of(s).addDependency(this);
    }
  }
}

/**
 * Determines
 */
export enum TriggerInvalidation {
  /**
   * The trigger will be executed every time the handler (or its configuration)
   * changes. This is implemented by associated the trigger with the `currentVersion`
   * of the AWS Lambda function, which gets recreated every time the handler changes.
   */
  HANDLER_CHANGE = 'WHEN_FUNCTION_CHANGES',
}
