import {
  BuildSpec,
  ComputeType,
  IBuildImage,
  LinuxBuildImage,
  Project,
  Source
} from '@aws-cdk/aws-codebuild';
import { IRepository } from '@aws-cdk/aws-codecommit';
import { EventField, RuleTargetInput } from '@aws-cdk/aws-events';
import { CodeBuildProject, LambdaFunction } from '@aws-cdk/aws-events-targets';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import * as path from 'path';

const lambdaPath = path.join(__dirname, '..', 'lambdas');

export interface PullRequestCheckProps {
  /**
   * The CodeCommit repository.
   */
  readonly repository: IRepository;

  /**
   * Filename or contents of buildspec in JSON format.
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-example
   */
  readonly buildSpec: BuildSpec;

  /**
   * Build environment to use for the build.
   *
   * @default BuildEnvironment.LinuxBuildImage.STANDARD_2_0
   */
  readonly buildImage?: IBuildImage;

  /**
   * The type of compute to use for this build.
   * See the {@link ComputeType} enum for the possible values.
   *
   * @default taken from {@link #buildImage#defaultComputeType}
   */
  readonly computeType?: ComputeType;
}

/**
 * Represents a reference to a PullRequestCheck.
 */
export class PullRequestCheck extends Construct {
  public constructor(
    scope: Construct,
    id: string,
    props: PullRequestCheckProps
  ) {
    super(scope, id);

    const {
      repository,
      buildSpec,
      buildImage = LinuxBuildImage.STANDARD_2_0,
      computeType = buildImage.defaultComputeType
    } = props;

    const lambdaRole = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });

    lambdaRole.addToPolicy(
      new PolicyStatement({
        resources: ['*'],
        actions: [
          'codebuild:*',
          'codecommit:*',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'logs:GetLogEvents'
        ]
      })
    );

    const pullRequestFunction = new Function(this, 'PullRequestFunction', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.asset(`${lambdaPath}/pull-request`),
      handler: 'pull_request.lambda_handler',
      role: lambdaRole
    });

    const codeBuildResultFunction = new Function(
      this,
      'CodeBuildResultFunction',
      {
        runtime: Runtime.PYTHON_3_7,
        code: Code.asset(`${lambdaPath}/code-build-result`),
        handler: 'code_build_result.lambda_handler',
        role: lambdaRole
      }
    );

    const pullRequestProject = new Project(this, 'PullRequestProject', {
      projectName: `${repository.repositoryName}-pull-request`,
      source: Source.codeCommit({
        repository
      }),
      environment: {
        buildImage,
        computeType
      },
      buildSpec
    });

    pullRequestProject.onStateChange('PullRequestValidationRule', {
      target: new LambdaFunction(codeBuildResultFunction)
    });

    const rule = repository.onPullRequestStateChange('PullRequestChangeRule', {
      eventPattern: {
        detail: {
          event: ['pullRequestSourceBranchUpdated', 'pullRequestCreated']
        }
      }
    });

    rule.addTarget(new LambdaFunction(pullRequestFunction));
    rule.addTarget(
      new CodeBuildProject(pullRequestProject, {
        event: RuleTargetInput.fromObject({
          sourceVersion: EventField.fromPath('$.detail.sourceCommit'),
          artifactsOverride: { type: 'NO_ARTIFACTS' },
          environmentVariablesOverride: [
            {
              name: 'pullRequestId',
              value: EventField.fromPath('$.detail.pullRequestId'),
              type: 'PLAINTEXT'
            },
            {
              name: 'repositoryName',
              value: EventField.fromPath('$.detail.repositoryNames[0]'),
              type: 'PLAINTEXT'
            },
            {
              name: 'sourceCommit',
              value: EventField.fromPath('$.detail.sourceCommit'),
              type: 'PLAINTEXT'
            },
            {
              name: 'destinationCommit',
              value: EventField.fromPath('$.detail.destinationCommit'),
              type: 'PLAINTEXT'
            }
          ]
        })
      })
    );
  }
}
