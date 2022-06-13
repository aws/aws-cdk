import { join } from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime } from '@aws-cdk/core';
import { Construct, IConstruct, Node } from 'constructs';

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
 * Props for `Trigger`.
 */
export interface TriggerProps extends TriggerOptions {
  /**
   * The AWS Lambda function of the handler to execute.
   */
  readonly handler: lambda.Function;
}

/**
 * Triggers an AWS Lambda function during deployment.
 */
export class Trigger extends Construct implements ITrigger {
  constructor(scope: Construct, id: string, props: TriggerProps) {
    super(scope, id);

    const handlerArn = this.determineHandlerArn(props);
    const provider = CustomResourceProvider.getOrCreateProvider(this, 'AWSCDK.TriggerCustomResourceProvider', {
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      codeDirectory: join(__dirname, 'lambda'),
      policyStatements: [
        {
          Effect: 'Allow',
          Action: ['lambda:InvokeFunction'],
          Resource: [handlerArn],
        },
      ],
    });

    new CustomResource(this, 'Default', {
      resourceType: 'Custom::Trigger',
      serviceToken: provider.serviceToken,
      properties: {
        HandlerArn: handlerArn,
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

  private determineHandlerArn(props: TriggerProps) {
    return props.handler.currentVersion.functionArn;
    // const executeOnHandlerChange = props.executeOnHandlerChange ?? true;
    // if (executeOnHandlerChange) {
    // }

    // return props.handler.functionArn;
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