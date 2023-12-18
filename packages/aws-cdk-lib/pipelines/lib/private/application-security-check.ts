import { Construct } from 'constructs';
import { CDKP_DEFAULT_CODEBUILD_IMAGE } from './default-codebuild-image';
import * as codebuild from '../../../aws-codebuild';
import * as cp from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as lambda from '../../../aws-lambda';
import { Duration, Tags } from '../../../core';
import { ApproveLambdaFunction } from '../../../custom-resource-handlers/dist/pipelines/approve-lambda.generated';

/**
 * Properties for an ApplicationSecurityCheck
 */
export interface ApplicationSecurityCheckProps {
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
 * The CodeBuild Project runs a security diff on the application stage,
 * and exports the link to the console of the project.
 */
export class ApplicationSecurityCheck extends Construct {
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
   * A CodeBuild Project that runs a security diff on the application stage.
   *
   * - If the diff registers no security changes, CodeBuild will invoke the
   *   pre-approval lambda and approve the ManualApprovalAction.
   * - If changes are detected, CodeBuild will exit into a ManualApprovalAction
   */
  public readonly cdkDiffProject: codebuild.Project;

  constructor(scope: Construct, id: string, props: ApplicationSecurityCheckProps) {
    super(scope, id);

    Tags.of(props.codePipeline).add('SECURITY_CHECK', 'ALLOW_APPROVE', {
      includeResourceTypes: ['AWS::CodePipeline::Pipeline'],
    });

    this.preApproveLambda = new ApproveLambdaFunction(this, 'CDKPipelinesAutoApprove', {
      timeout: Duration.minutes(5),
    });

    this.preApproveLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['codepipeline:GetPipelineState', 'codepipeline:PutApprovalResult'],
      conditions: {
        StringEquals: {
          'aws:ResourceTag/SECURITY_CHECK': 'ALLOW_APPROVE',
        },
      },
      resources: ['*'],
    }));

    const invokeLambda =
      'aws lambda invoke' +
      ` --function-name ${this.preApproveLambda.functionName}` +
      ' --invocation-type Event' +
      ' --cli-binary-format raw-in-base64-out' +
      ' --payload "$payload"' +
      ' lambda.out';

    const message = [
      'An upcoming change would broaden security changes in $PIPELINE_NAME.',
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

    this.cdkDiffProject = new codebuild.Project(this, 'CDKSecurityCheck', {
      environment: {
        buildImage: CDKP_DEFAULT_CODEBUILD_IMAGE,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          build: {
            commands: [
              'npm install -g aws-cdk',
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
                condition: 'cdk diff -a . --security-only --fail $STAGE_PATH/\\*',
                thenStatements: [
                  invokeLambda,
                  'export MESSAGE="No security-impacting changes detected."',
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
    this.cdkDiffProject.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: ['*'],
      conditions: {
        'ForAnyValue:StringEquals': {
          'iam:ResourceTag/aws-cdk:bootstrap-role': ['deploy'],
        },
      },
    }));

    this.preApproveLambda.grantInvoke(this.cdkDiffProject);
  }
}

interface ifElseOptions {
  readonly condition: string,
  readonly thenStatements: string[],
  readonly elseStatements?: string[]
}

const ifElse = ({ condition, thenStatements, elseStatements }: ifElseOptions): string => {
  let statement = thenStatements.reduce((acc, ifTrue) => {
    return `${acc} ${ifTrue};`;
  }, `if ${condition}; then`);

  if (elseStatements) {
    statement = elseStatements.reduce((acc, ifFalse) => {
      return `${acc} ${ifFalse};`;
    }, `${statement} else`);
  }

  return `${statement} fi`;
};
