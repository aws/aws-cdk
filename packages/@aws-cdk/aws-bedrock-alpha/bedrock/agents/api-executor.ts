import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { ValidationError } from './validation-helpers';

/**
 * The type of custom control for the action group executor.
 */
export enum CustomControl {
  /**
   * Returns the action group invocation results directly in the InvokeAgent response.
   */
  RETURN_CONTROL = 'RETURN_CONTROL',
}

/******************************************************************************
 *                         Action Group Executor
 *****************************************************************************/
/**
 * Defines how fulfillment of the action group is handled after the necessary
 * information has been elicited from the user.
 * Valid executors are:
 * - Lambda function
 * - Return Control
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/action-handle.html
 */
export class ActionGroupExecutor {
  /**
   * Returns the action group invocation results directly in the InvokeAgent response.
   * The information and parameters can be sent to your own systems to yield results.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/agents-returncontrol.html
   */
  public static readonly RETURN_CONTROL = new ActionGroupExecutor(undefined, CustomControl.RETURN_CONTROL);

  /**
   * Defines an action group with a Lambda function containing the business logic.
   * @param lambdaFunction - Lambda function to be called by the action group.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/agents-lambda.html
   */
  public static fromLambda(lambdaFunction: IFunction): ActionGroupExecutor {
    return new ActionGroupExecutor(lambdaFunction, undefined);
  }

  /**
   * The Lambda function that will be called by the action group.
   * Contains the business logic for handling the action group's invocation.
   */
  public readonly lambdaFunction?: IFunction;

  /**
   * The custom control type for the action group executor.
   * Currently only supports 'RETURN_CONTROL' which returns results directly in the InvokeAgent response.
   */
  public readonly customControl?: CustomControl;

  private constructor(lambdaFunction?: IFunction, customControl?: CustomControl) {
    if (lambdaFunction && customControl) {
      throw new ValidationError('ActionGroupExecutor cannot have both lambdaFunction and customControl defined - they are mutually exclusive.');
    }
    this.lambdaFunction = lambdaFunction;
    this.customControl = customControl;
  }

  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): bedrock.CfnAgent.ActionGroupExecutorProperty {
    return {
      customControl: this.customControl,
      lambda: this.lambdaFunction?.functionArn,
    };
  }
}
