import codepipeline = require('@aws-cdk/aws-codepipeline');
import { SecretValue } from '@aws-cdk/cdk';

/**
 * Construction properties of the {@link GitHubSourceAction GitHub source action}.
 */
export interface GitHubSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact. CfnOutput artifacts are used by CodePipeline as
   * inputs into other actions.
   */
  readonly outputArtifactName: string;

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
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use a webhook to detect source changes instead.
   *
   * @default false
   */
  readonly pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends codepipeline.SourceAction {
  private readonly props: GitHubSourceActionProps;

  constructor(props: GitHubSourceActionProps) {
    super({
      ...props,
      owner: 'ThirdParty',
      provider: 'GitHub',
      configuration: {
        Owner: props.owner,
        Repo: props.repo,
        Branch: props.branch || "master",
        OAuthToken: props.oauthToken.toString(),
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
      outputArtifactName: props.outputArtifactName
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (!this.props.pollForSourceChanges) {
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
