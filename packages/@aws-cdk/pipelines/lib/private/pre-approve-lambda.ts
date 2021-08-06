import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

export interface PreApproveLambdaProps {
  readonly pipelineTag: string;
}

/**
 * A lambda function that approves a Manual Approval Action, given
 * the following payload:
 *
 * {
 *  "PipelineName": [CodePipelineName],
 *  "StageName": [CodePipelineStageName],
 *  "ActionName": [ManualApprovalActionName]
 * }
 */
export class PreApproveLambda extends CoreConstruct {
  /**
   * A lambda function that approves a Manual Approval Action
   */
  public readonly preApproveLambda: lambda.Function;
  /**
   * The command to invoke the lambda function.
   */
  public readonly invokeLambda: string;

  constructor(scope: Construct, id: string, props: PreApproveLambdaProps) {
    super(scope, id);

    this.preApproveLambda = new lambda.Function(scope, 'CDKPipelinesAutoApprove', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'approve-lambda')),
      timeout: Duration.minutes(5),
    });

    this.preApproveLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['codepipeline:GetPipelineState', 'codepipeline:PutApprovalResult'],
      conditions: {
        StringEquals: {
          [`aws:ResourceTag/${props.pipelineTag}`]: 'ALLOW_APPROVE',
        },
      },
      resources: ['*'],
    }));

    this.invokeLambda =
      'aws lambda invoke' +
      ` --function-name ${this.preApproveLambda.functionName}` +
      ' --invocation-type Event' +
      ' --payload "$payload"' +
      ' lambda.out';
  }
}