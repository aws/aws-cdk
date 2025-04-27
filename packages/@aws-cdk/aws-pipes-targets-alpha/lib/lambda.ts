import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

/**
 * Parameters for the LambdaFunction target
 */
export interface LambdaFunctionParameters {

  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * Specify whether to invoke the Lambda Function synchronously (`REQUEST_RESPONSE`) or asynchronously (`FIRE_AND_FORGET`).
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html
   * @default LambdaFunctionInvocationType.REQUEST_RESPONSE
   */
  readonly invocationType?: LambdaFunctionInvocationType;
}

/**
 * InvocationType for invoking the Lambda Function.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetlambdafunctionparameters.html
 */
export enum LambdaFunctionInvocationType {
  /**
   * Invoke Lambda Function asynchronously (`Invoke`). `InvocationType` is set to `Event` on `Invoke`, see https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html for more details.
   */
  FIRE_AND_FORGET = 'FIRE_AND_FORGET',

  /**
   * Invoke Lambda Function synchronously (`Invoke`) and wait for the response. `InvocationType` is set to `RequestResponse` on `Invoke`, see https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html for more details.
   */
  REQUEST_RESPONSE = 'REQUEST_RESPONSE',
}

/**
 * An EventBridge Pipes target that sends messages to an AWS Lambda Function.
 */
export class LambdaFunction implements ITarget {
  public readonly targetArn: string;

  private readonly lambdaFunction: lambda.IFunction;
  private readonly invocationType: LambdaFunctionInvocationType;
  private readonly inputTemplate?: IInputTransformation;

  constructor(
    lambdaFunction: lambda.IFunction,
    parameters: LambdaFunctionParameters,
  ) {
    this.lambdaFunction = lambdaFunction;
    this.targetArn = lambdaFunction.functionArn;
    this.invocationType =
      parameters.invocationType ??
      LambdaFunctionInvocationType.REQUEST_RESPONSE;
    this.inputTemplate = parameters.inputTransformation;
  }

  grantPush(grantee: IRole): void {
    this.lambdaFunction.grantInvoke(grantee);
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTemplate?.bind(pipe).inputTemplate,
        lambdaFunctionParameters: {
          invocationType: this.invocationType,
        },
      },
    };
  }
}
