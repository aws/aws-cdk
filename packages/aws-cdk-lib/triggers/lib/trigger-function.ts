import { Construct } from 'constructs';
import { ITrigger, Trigger, TriggerOptions } from '.';
import * as lambda from '../../aws-lambda';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Props for `InvokeFunction`.
 */
export interface TriggerFunctionProps extends lambda.FunctionProps, TriggerOptions {
}

/**
 * Invokes an AWS Lambda function during deployment.
 */
@propertyInjectable
export class TriggerFunction extends lambda.Function implements ITrigger {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.triggers.TriggerFunction';
  /**
   * The underlying trigger resource.
   */
  public readonly trigger: Trigger;

  constructor(scope: Construct, id: string, props: TriggerFunctionProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.trigger = new Trigger(this, 'Trigger', {
      ...props,
      handler: this,
    });
  }

  @MethodMetadata()
  public executeAfter(...scopes: Construct[]): void {
    this.trigger.executeAfter(...scopes);
  }

  @MethodMetadata()
  public executeBefore(...scopes: Construct[]): void {
    this.trigger.executeBefore(...scopes);
  }
}
