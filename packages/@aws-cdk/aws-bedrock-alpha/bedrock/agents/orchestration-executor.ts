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