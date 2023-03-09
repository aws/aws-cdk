import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { sourceArtifactBounds } from '../common';

/**
 * If and how the GitHub source action should be triggered
 */
export enum GitHubTrigger {
  NONE = 'None',
  POLL = 'Poll',
  WEBHOOK = 'WebHook',
}

/**
 * The CodePipeline variables emitted by GitHub source Action.
 */
export interface GitHubSourceVariables {
  /** The name of the repository this action points to. */
  readonly repositoryName: string;
  /** The name of the branch this action tracks. */
  readonly branchName: string;
  /** The date the currently last commit on the tracked branch was authored, in ISO-8601 format. */
  readonly authorDate: string;
  /** The date the currently last commit on the tracked branch was committed, in ISO-8601 format. */
  readonly committerDate: string;
  /** The SHA1 hash of the currently last commit on the tracked branch. */
  readonly commitId: string;
  /** The message of the currently last commit on the tracked branch. */
  readonly commitMessage: string;
  /** The GitHub API URL of the currently last commit on the tracked branch. */
  readonly commitUrl: string;
}

/**
 * Construction properties of the `GitHubSourceAction GitHub source action`.
 */
export interface GitHubSourceActionProps extends codepipeline.CommonActionProps {
  /**
   *
   */
  readonly output: codepipeline.Artifact;

  /**
   * The GitHub account/user that owns the repo.
   */
  readonly owner: string;

  /**
   * The name of the repo, without the username.
   */
  readonly repo: string;

  /**
   * The branch to use.
   *
   * @default "master"
   */
  readonly branch?: string;

  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a Secrets Manager `Secret` to obtain the token:
   *
   *   const oauth = cdk.SecretValue.secretsManager('my-github-token');
   *   new GitHubSourceAction(this, 'GitHubAction', { oauthToken: oauth, ... });
   *
   * If you rotate the value in the Secret, you must also change at least one property
   * of the CodePipeline to force CloudFormation to re-read the secret.
   *
   * The GitHub Personal Access Token should have these scopes:
   *
   * * **repo** - to read the repository
   * * **admin:repo_hook** - if you plan to use webhooks (true by default)
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/appendix-github-oauth.html#GitHub-create-personal-token-CLI
   */
  readonly oauthToken: SecretValue;

  /**
   * How AWS CodePipeline should be triggered
   *
   * With the default value "WEBHOOK", a webhook is created in GitHub that triggers the action
   * With "POLL", CodePipeline periodically checks the source for changes
   * With "None", the action is not triggered through changes in the source
   *
   * To use `WEBHOOK`, your GitHub Personal Access Token should have
   * **admin:repo_hook** scope (in addition to the regular **repo** scope).
   *
   * @default GitHubTrigger.WEBHOOK
   */
  readonly trigger?: GitHubTrigger;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends Action {
  private readonly props: GitHubSourceActionProps;

  constructor(props: GitHubSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      owner: 'ThirdParty',
      provider: 'GitHub',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
    });

    this.props = props;
  }

  /** The variables emitted by this action. */
  public get variables(): GitHubSourceVariables {
    return {
      repositoryName: this.variableExpression('RepositoryName'),
      branchName: this.variableExpression('BranchName'),
      authorDate: this.variableExpression('AuthorDate'),
      committerDate: this.variableExpression('CommitterDate'),
      commitId: this.variableExpression('CommitId'),
      commitMessage: this.variableExpression('CommitMessage'),
      commitUrl: this.variableExpression('CommitUrl'),
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    if (!this.props.trigger || this.props.trigger === GitHubTrigger.WEBHOOK) {
      new codepipeline.CfnWebhook(scope, 'WebhookResource', {
        authentication: 'GITHUB_HMAC',
        authenticationConfiguration: {
          secretToken: this.props.oauthToken.unsafeUnwrap(), // Safe usage
        },
        filters: [
          {
            jsonPath: '$.ref',
            matchEquals: 'refs/heads/{Branch}',
          },
        ],
        targetAction: this.actionProperties.actionName,
        targetPipeline: stage.pipeline.pipelineName,
        targetPipelineVersion: 1,
        registerWithThirdParty: true,
      });
    }

    return {
      configuration: {
        Owner: this.props.owner,
        Repo: this.props.repo,
        Branch: this.props.branch || 'master',
        OAuthToken: this.props.oauthToken.unsafeUnwrap(),
        PollForSourceChanges: this.props.trigger === GitHubTrigger.POLL,
      },
    };
  }
}
