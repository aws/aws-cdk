import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/******************************************************************************
 *                           Orchestration Executor
 *****************************************************************************/
/**
 * Contains details about the Lambda function containing the orchestration logic carried
 * out upon invoking the custom orchestration.
 */
export class OrchestrationExecutor {
  /**
   * Defines an orchestration executor with a Lambda function containing the business logic.
   * @param lambdaFunction - Lambda function to be called by the orchestration.
   */
  public static fromlambdaFunction(lambdaFunction: IFunction): OrchestrationExecutor {
    return new OrchestrationExecutor(lambdaFunction);
  }

  /**
   * The Lambda function that contains the custom orchestration logic.
   * This function is called when the agent needs to make decisions about action execution.
   */
  public readonly lambdaFunction: IFunction;

  private constructor(lambdaFunction: IFunction) {
    this.lambdaFunction = lambdaFunction;
  }

  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): bedrock.CfnAgent.OrchestrationExecutorProperty {
    return {
      lambda: this.lambdaFunction?.functionArn,
    };
  }
}
