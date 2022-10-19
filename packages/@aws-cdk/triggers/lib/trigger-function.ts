import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { ITrigger, Trigger, TriggerOptions } from '.';

/**
 * Props for `InvokeFunction`.
 */
export interface TriggerFunctionProps extends lambda.FunctionProps, TriggerOptions {
}

/**
 * Invokes an AWS Lambda function during deployment.
 */
export class TriggerFunction extends lambda.Function implements ITrigger {

  /**
   * The underlying trigger resource.
   */
  public readonly trigger: Trigger;

  constructor(scope: Construct, id: string, props: TriggerFunctionProps) {
    super(scope, id, props);

    this.trigger = new Trigger(this, 'Trigger', {
      ...props,
      handler: this,
    });
  }

  public executeAfter(...scopes: Construct[]): void {
    this.trigger.executeAfter(...scopes);
  }

  public executeBefore(...scopes: Construct[]): void {
    this.trigger.executeBefore(...scopes);
  }
}
