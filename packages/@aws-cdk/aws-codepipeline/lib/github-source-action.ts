import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { CfnWebhook } from './codepipeline.generated';

/**
 * Construction properties of the {@link GitHubSourceAction GitHub source action}.
 */
export interface GitHubSourceActionProps extends actions.CommonActionProps {
  /**
   * The name of the source's output artifact. CfnOutput artifacts are used by CodePipeline as
   * inputs into other actions.
   */
  outputArtifactName: string;

  /**
   * The GitHub account/user that owns the repo.
   */
  owner: string;

  /**
   * The name of the repo, without the username.
   */
  repo: string;

  /**
   * The branch to use.
   *
   * @default "master"
   */
  branch?: string;

  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a Secrets Manager `SecretString` to obtain the token:
   *
   *   const oauth = new secretsmanager.SecretString(this, 'GitHubOAuthToken', { secretId: 'my-github-token' });
   *   new GitHubSource(this, 'GitHubAction', { oauthToken: oauth.value, ... });
   */
  oauthToken: string;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use a webhook to detect source changes instead.
   *
   * @default false
   */
  pollForSourceChanges?: boolean;
}

/**
 * Source that is provided by a GitHub repository.
 */
export class GitHubSourceAction extends actions.SourceAction {
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
        OAuthToken: props.oauthToken,
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
      outputArtifactName: props.outputArtifactName
    });

    this.props = props;
  }

  protected bind(stage: actions.IStage, scope: cdk.Construct): void {
    if (!this.props.pollForSourceChanges) {
      new CfnWebhook(scope, 'WebhookResource', {
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
        targetPipeline: stage.pipeline.pipelineName,
        targetPipelineVersion: 1,
        registerWithThirdParty: true,
      });
    }
  }
}
