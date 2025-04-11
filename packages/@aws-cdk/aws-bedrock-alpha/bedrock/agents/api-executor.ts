/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

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
  public static readonly RETURN_CONTROL = new ActionGroupExecutor(undefined, 'RETURN_CONTROL');

  /**
   * Defines an action group with a Lambda function containing the business logic.
   * @param lambdaFunction - Lambda function to be called by the action group.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/agents-lambda.html
   */
  public static fromlambdaFunction(lambdaFunction: IFunction): ActionGroupExecutor {
    return new ActionGroupExecutor(lambdaFunction, undefined);
  }

  public readonly lambdaFunction?: IFunction;
  public readonly customControl?: string;

  private constructor(lambdaFunction?: IFunction, customControl?: string) {
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
