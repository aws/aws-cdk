import { join } from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, IConstruct } from '@aws-cdk/core';

import { Construct, Node } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
   * You can also use `trigger.executeBefore()` to add additional dependencies.
   *
   * @default []
   */
  readonly executeBefore?: Construct[];
}

/**
 * Props for `Trigger`.
 */
export interface TriggerProps extends TriggerOptions {
  /**
   * The AWS Lambda version of the handler to execute.
   *
   * The trigger will be executed every time the version changes (code or
   * configuration).
   */
  readonly handlerVersion: lambda.IVersion;
}

/**
 * Triggers an AWS Lambda function during deployment.
 */
export class Trigger extends CoreConstruct implements ITrigger {
  constructor(scope: Construct, id: string, props: TriggerProps) {
    super(scope, id);

    const provider = CustomResourceProvider.getOrCreateProvider(this, 'AWSCDK.TriggerCustomResourceProvider', {
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      codeDirectory: join(__dirname, 'lambda'),
      policyStatements: [
        {
          Effect: 'Allow',
          Action: ['lambda:InvokeFunction'],
          Resource: [props.handlerVersion.functionArn],
        },
      ],
    });

    // we use 'currentVersion' because a new version is created every time the
    // handler changes (either code or configuration). this will have the effect
    // that the trigger will be executed every time the handler is changed.
    const handlerArn = props.handlerVersion.functionArn;

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
}