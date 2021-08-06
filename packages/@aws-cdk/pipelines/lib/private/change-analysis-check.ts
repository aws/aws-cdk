import * as codebuild from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { PreApproveLambda } from './pre-approve-lambda';
import { ifElse } from './security-check-utils';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for an ChangeAnalysisCheck
 */
export interface ChangeAnalysisCheckProps {
  /**
   * The pipeline that will be automatically approved
   *
   * Will have a tag added to it.
   */
  readonly codePipeline: cp.Pipeline;
}

/**
 * A construct containing both the Lambda and CodeBuild Project
 * needed to conduct a security check on any given application stage.
 *
 * The Lambda acts as an auto approving mechanism that should only be
 * triggered when the CodeBuild Project registers no security changes.
 *
 * The CodeBuild Project runs c2a diff on the application stage,
 * and exports the link to the console of the project.
 */
export class ChangeAnalysisCheck extends CoreConstruct {
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
  public readonly preApproveLambda: lambda.Function;
  /**
   * A CodeBuild Project that runs c2a diff on the application stage.
   *
   * - If the c2a diff registers no security changes, CodeBuild will invoke the
   *   pre-approval lambda and approve the ManualApprovalAction.
   * - If changes are detected, CodeBuild will exit into a ManualApprovalAction
   */
  public readonly c2aDiffProject: codebuild.Project;

  constructor(scope: Construct, id: string, props: ChangeAnalysisCheckProps) {
    super(scope, id);

    Tags.of(props.codePipeline).add('CHANGE_ANALYSIS', 'ALLOW_APPROVE', {
      includeResourceTypes: ['AWS::CodePipeline::Pipeline'],
    });

    const { preApproveLambda, invokeLambda } = new PreApproveLambda(this, 'CDKPreApproveLambda', {
      pipelineTag: 'CHANGE_ANALYSIS',
    });
    this.preApproveLambda = preApproveLambda;

    const message = [
      'An upcoming change would violate configured rules settings in $PIPELINE_NAME.',
      'Review and approve the changes in CodePipeline to proceed with the deployment.',
      '',
      'Review the changes in CodeBuild:',
      '',
      '$LINK',
      '',
      'Approve the changes in CodePipeline (stage $STAGE_NAME, action $ACTION_NAME):',
      '',
      '$PIPELINE_LINK',
    ];

    const publishNotification =
      'aws sns publish' +
      ' --topic-arn $NOTIFICATION_ARN' +
      ' --subject "$NOTIFICATION_SUBJECT"' +
      ` --message "${message.join('\n')}"`;

    this.c2aDiffProject = new codebuild.Project(this, 'CDKSecurityCheck', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          build: {
            commands: [
              'npm install -g cdk-change-analyzer',
              // $CODEBUILD_INITIATOR will always be Code Pipeline and in the form of:
              // "codepipeline/example-pipeline-name-Xxx"
              'export PIPELINE_NAME="$(node -pe \'`${process.env.CODEBUILD_INITIATOR}`.split("/")[1]\')"',
              'payload="$(node -pe \'JSON.stringify({ "PipelineName": process.env.PIPELINE_NAME, "StageName": process.env.STAGE_NAME, "ActionName": process.env.ACTION_NAME })\' )"',
              // ARN: "arn:aws:codebuild:$region:$account_id:build/$project_name:$project_execution_id$"
              'ARN=$CODEBUILD_BUILD_ARN',
              'REGION="$(node -pe \'`${process.env.ARN}`.split(":")[3]\')"',
              'ACCOUNT_ID="$(node -pe \'`${process.env.ARN}`.split(":")[4]\')"',
              'PROJECT_NAME="$(node -pe \'`${process.env.ARN}`.split(":")[5].split("/")[1]\')"',
              'PROJECT_ID="$(node -pe \'`${process.env.ARN}`.split(":")[6]\')"',
              // Manual Approval adds 'http/https' to the resolved link
              'export LINK="https://$REGION.console.aws.amazon.com/codesuite/codebuild/$ACCOUNT_ID/projects/$PROJECT_NAME/build/$PROJECT_NAME:$PROJECT_ID/?region=$REGION"',
              'export PIPELINE_LINK="https://$REGION.console.aws.amazon.com/codesuite/codepipeline/pipelines/$PIPELINE_NAME/view?region=$REGION"',
              // Run invoke only if cdk diff passes (returns exit code 0)
              // 0 -> true, 1 -> false
              ifElse({
                condition: `aws-c2a diff --app "assembly-${props.codePipeline.stack.stackName}-$STAGE_NAME/" --broadening-permissions --fail`,
                thenStatements: [
                  invokeLambda,
                  'export MESSAGE="No changes that violate rules detected."',
                ],
                elseStatements: [
                  `[ -z "\${NOTIFICATION_ARN}" ] || ${publishNotification}`,
                  'export MESSAGE="Deployment would make security-impacting changes. Click the link below to inspect them, then click Approve if all changes are expected."',
                ],
              }),
            ],
          },
        },
        env: {
          'exported-variables': [
            'LINK',
            'MESSAGE',
          ],
        },
      }),
    });

    // this is needed to check the status the stacks when doing `cdk diff`
    this.c2aDiffProject.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: ['*'],
      conditions: {
        'ForAnyValue:StringEquals': {
          'iam:ResourceTag/aws-cdk:bootstrap-role': ['deploy'],
        },
      },
    }));

    this.c2aDiffProject.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudformation:GetTemplate', 'cloudformation:DescribeStack'],
      resources: ['*'],
    }));

    this.preApproveLambda.grantInvoke(this.c2aDiffProject);
  }
}
