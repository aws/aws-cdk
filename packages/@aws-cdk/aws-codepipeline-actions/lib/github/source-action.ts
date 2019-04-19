import codepipeline = require('@aws-cdk/aws-codepipeline');
import { SecretValue } from '@aws-cdk/cdk';
import { sourceArtifactBounds } from '../common';

export enum TriggerType {
  None = 'None',
  Poll = 'Poll',
  WebHook = 'WebHook',
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
   * It is recommended to use a Secrets Manager `SecretString` to obtain the token:
   *
   *   const oauth = new secretsmanager.SecretString(this, 'GitHubOAuthToken', { secretId: 'my-github-token' });
   *   new GitHubSource(this, 'GitHubAction', { oauthToken: oauth.value, ... });
   */
  readonly oauthToken: SecretValue;

  /**
   * How AWS CodePipeline should be triggered
   *
   * @default "WebHook"
   */
  readonly trigger?: TriggerType;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends codepipeline.Action {
  private readonly props: GitHubSourceActionProps;

  constructor(props: GitHubSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Source,
      owner: 'ThirdParty',
      provider: 'GitHub',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
      configuration: {
        Owner: props.owner,
        Repo: props.repo,
        Branch: props.branch || "master",
        OAuthToken: props.oauthToken.toString(),
        PollForSourceChanges: (props.trigger && props.trigger === TriggerType.Poll) || false,
      },
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (!this.props.trigger || this.props.trigger === TriggerType.WebHook) {
      new codepipeline.CfnWebhook(info.scope, 'WebhookResource', {
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
        targetAction: this.actionName,
        targetPipeline: info.pipeline.pipelineName,
        targetPipelineVersion: 1,
        registerWithThirdParty: true,
      });
    }
  }
}
