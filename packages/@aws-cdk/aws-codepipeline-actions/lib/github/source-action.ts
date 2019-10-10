import codepipeline = require('@aws-cdk/aws-codepipeline');
import { Construct, SecretValue } from '@aws-cdk/core';
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
 * Construction properties of the {@link GitHubSourceAction GitHub source action}.
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
   *   new GitHubSource(this, 'GitHubAction', { oauthToken: oauth, ... });
   */
  readonly oauthToken: SecretValue;

  /**
   * How AWS CodePipeline should be triggered
   *
   * With the default value "WEBHOOK", a webhook is created in GitHub that triggers the action
   * With "POLL", CodePipeline periodically checks the source for changes
   * With "None", the action is not triggered through changes in the source
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

  protected bound(scope: Construct, stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    if (!this.props.trigger || this.props.trigger === GitHubTrigger.WEBHOOK) {
      new codepipeline.CfnWebhook(scope, 'WebhookResource', {
        authentication: 'GITHUB_HMAC',
        authenticationConfiguration: {
          secretToken: this.props.oauthToken.toString(),
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
        Branch: this.props.branch || "master",
        OAuthToken: this.props.oauthToken.toString(),
        PollForSourceChanges: this.props.trigger === GitHubTrigger.POLL,
      },
    };
  }
}
